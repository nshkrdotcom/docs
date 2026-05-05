# 06 — OTP Lowering Guide: Bijection Between Architecture and Runtime Primitives

## Purpose

This document defines how pre-code architecture artifacts lower into OTP primitives.

The goal is not “use OTP everywhere.” The goal is to introduce OTP only when the architecture demands a runtime primitive.

## The lowering question

For every component, ask:

```text
What runtime responsibility exists?
```

Then choose the smallest matching primitive.

## Decision table

| Architectural need | Elixir/OTP primitive | Notes |
|---|---|---|
| Pure data transformation | Module + struct | Default choice. |
| Stateful serial access | GenServer | Only with state ownership. |
| Static lifecycle group | Supervisor | Declarative only. |
| Runtime-created children | DynamicSupervisor | Children independently restartable. |
| Dynamic process lookup | Registry | Use when passing PID is not enough. |
| One-off concurrent work | Task under Task.Supervisor | Do not pollute stateful GenServer. |
| Periodic or timer-driven duties | Worker GenServer / timer worker | Keep time out of core. |
| High-read concurrent shared state | ETS | Requires ownership and access policy. |
| Backpressured async pipeline | Broadway / GenStage-style pattern | Only with real throughput need. |
| External SDK/CLI/API boundary | Adapter/Materializer process or module | External shapes do not enter core. |

## Process justification form

Every new process requires:

```yaml
process:
  name: CredentialFabric.LeaseRegistry
  reason:
    - owns_runtime_state
    - serializes_lease_redemption
  state_owned:
    - active_leases
    - revocation_epochs
  callers:
    - CredentialAuthority
    - ConnectorFabric
  default_message: call
  cast_allowed: false
  crash_behavior:
    on_restart: rebuild_from_snapshot_or_empty_for_mvp
  supervisor: CredentialFabric.Supervisor
```

If this form cannot be filled convincingly, the process probably should not exist.

## Functional core first

For any process with business logic, lower first into a pure transition module:

```text
Domain.transition(state, event) -> {:ok, new_state, effects} | {:error, reason}
```

Then wrap with GenServer:

```text
handle_call(event, from, process_state)
  -> Domain.transition(process_state.domain, event)
  -> update process state
  -> reply
```

The GenServer owns time/concurrency/state. It does not own business semantics.

## Call vs cast

Default to `call` because it creates backpressure.

Use `cast` only if:

```text
- caller must not block
- receiver can absorb load
- message rate is bounded
- loss/duplication semantics are declared
- mailbox risk is tested or monitored
```

The harness should flag `cast` by default.

## Boundary facade

Callers must not use raw OTP machinery unless the component is explicitly internal.

Preferred:

```elixir
CredentialFabric.issue_lease(context, request)
```

Not preferred:

```elixir
GenServer.call(pid, {:issue_lease, context, request})
```

## Supervision lowering

A supervision spec must answer:

```text
- What failure domain does this supervisor own?
- Which children restart independently?
- Which children must restart together?
- What state is lost on restart?
- What state is rebuilt?
- What telemetry/audit records failure?
```

## Registry lowering

Use Registry if:

```text
- dynamic identity maps to process
- PID changes across restarts
- external callers need lookup by stable identity
```

Do not use Registry if:

```text
- process is statically known
- process reference can be passed directly
- lookup is hiding unclear ownership
```

## Worker lowering

A worker exists to isolate a specific responsibility:

```text
- time
- IO
- external call
- background cleanup
- connector invocation
- materialization
```

Workers must not decide domain policy unless they are explicitly PolicyModule.

## OTP anti-patterns the harness should reject

```text
- GenServer with no state
- GenServer with business case tree inside callback
- cast used for unbounded work
- DynamicSupervisor with one static child
- Registry for a single process
- Supervisor containing business logic
- Task.start without Task.Supervisor
- Process.sleep in tests
- long blocking external calls inside stateful process callbacks
```

## Lowering invariant

```text
No OTP primitive may be introduced unless the corresponding architectural responsibility exists in the SpecCell.
```
