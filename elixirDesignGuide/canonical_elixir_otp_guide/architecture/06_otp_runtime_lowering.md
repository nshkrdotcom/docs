# OTP Runtime Lowering

## Purpose

This document defines how architecture artifacts lower into OTP primitives.

The goal is not "use OTP everywhere." The goal is to use OTP only where the system needs runtime ownership, concurrency, failure boundaries, scheduling, dynamic identity, or lifecycle management.

## Lowering Question

For every component, ask:

```text
What runtime responsibility exists?
```

If none exists, use a plain module.

## Decision Table

| Need | Primitive | Avoid |
|---|---|---|
| Stateless calculation | Plain module/function | GenServer |
| Domain data | Struct and pure functions | Ecto schema as universal model |
| Simple shared state | Agent | Complex Agent protocol |
| Long-lived stateful actor | GenServer | Raw receive loop |
| Explicit state machine | `:gen_statem` | Large callback case tree |
| One-shot caller-owned work | `Task.async` / `Task.await` | Naked `spawn` |
| Supervised one-shot work | `Task.Supervisor` | Fire-and-forget task |
| Dynamic runtime children | `DynamicSupervisor` | Manual PID registry |
| Dynamic process lookup | `Registry` | Dynamically generated atoms |
| High-read shared table | ETS with supervised owner | GenServer bottleneck for every read |
| Durable background work | Oban or durable job system | In-memory task for must-run work |
| Backpressured stream | GenStage/Broadway pattern | Unbounded casts |

## Plain Module First

Use a module when:

- Behavior is stateless.
- State is passed explicitly.
- Persistence can be handled transactionally.
- Concurrency does not need serialization by a process.

Most context APIs should be plain modules.

## GenServer

Use a GenServer when at least one is true:

- It owns mutable runtime state.
- It serializes access to a resource.
- It represents a long-lived session, connection, workflow runner, lock, rate limiter, or cache owner.
- It receives asynchronous external messages.
- It owns timers.
- It is a failure boundary.

Do not use GenServer for:

- Stateless services.
- Pure business rules.
- Wrapping every Repo call.
- Organizing code.
- Hiding a global bottleneck.

Rules:

- Public API hides raw messages.
- Callbacks are thin.
- Business transitions live in pure modules.
- Slow external calls are offloaded.
- State recovery is defined.
- Timeout policy is explicit.

## Agent

Use Agent only for simple state operations:

- Read map.
- Update map.
- Store small counters.
- Test-only shared state.

Avoid Agent when:

- There is protocol.
- There are timers.
- There is lifecycle.
- There is backpressure.
- There are external messages.
- There are complex transitions.

## Task And Task.Supervisor

Use `Task.async` when:

- Work exists only for the caller.
- Caller awaits the result.
- Linked failure is correct.

Use `Task.Supervisor` when:

- Work may fail independently.
- Work should be observable.
- Work is started from a GenServer.
- Caller should not crash with the task.

Important:

```text
Supervised task does not mean durable task.
If work must survive node crash, use durable job/outbox.
```

## DynamicSupervisor

Use when children are created at runtime:

- Sessions.
- Devices.
- Tenants.
- Workflow runs.
- Game rooms.
- External subscriptions.

Rules:

- Define child identity.
- Define maximum children if resource bound.
- Define restart policy.
- Define shutdown.
- Pair with Registry only when lookup by stable key is needed.

## Registry

Use for dynamic process names:

```elixir
{:via, Registry, {MyApp.SessionRegistry, session_id}}
```

Avoid:

- Dynamic atoms.
- Registry for one static process.
- Registry to hide unclear ownership.

## ETS

Use ETS when:

- Reads are frequent.
- GenServer would bottleneck.
- Data is cache or index.
- Ownership and invalidation are explicit.

Rules:

- A supervised process owns the table.
- Access policy is documented.
- Recovery is defined.
- ETS is not invisible domain authority unless durability is intentionally not required.

## `:gen_statem`

Use when state machine complexity dominates:

```text
pending -> authorized -> captured -> settled
pending -> cancelled
authorized -> voided
```

Use it when:

- Events valid in one state are invalid in another.
- Timeouts are state-specific.
- Transition actions are central.
- The state graph should be explicit.

## Oban Or Durable Job System

Use for:

- Must-run work.
- Retried external effects.
- Outbox delivery.
- Scheduled work.
- Long-running asynchronous tasks.

Rules:

- Jobs are idempotent.
- Arguments are versioned.
- Retry policy is bounded.
- Dead jobs are observable.
- Duplicate execution is safe.

## Call, Cast, And Info Policy

Default to `call` for backpressure.

Use `cast` only when:

- Caller must not block.
- Work is bounded.
- Loss/duplication semantics are declared.
- Receiver capacity is known.
- Mailbox monitoring exists.

Use raw messages only for:

- Runtime events.
- Task results.
- DOWN messages.
- Timers.
- External library messages.

Document every raw message shape.

## Process Justification Form

```yaml
process:
  name:
  primitive: GenServer | Agent | Task | DynamicSupervisor | Registry | ETS owner | gen_statem
  reason:
    - owns_runtime_state
    - serializes_resource
    - receives_async_messages
  state_owned:
    - name:
      authoritative: true | false
      recovery:
  callers:
  message_protocol:
  timeout_policy:
  overload_policy:
  supervisor:
  restart_policy:
  shutdown:
  telemetry:
```

If the form cannot be completed, the process should probably not exist.

## Anti-Patterns

- GenServer with no state.
- GenServer containing all business logic.
- One GenServer per context.
- `cast` for critical work.
- `spawn` for production work.
- Dynamic atoms for names.
- Task started from GenServer without handling result and DOWN.
- DynamicSupervisor for fixed children.
- Supervisor that contains business logic.
- Registry used where a PID could be passed directly.

## Review Checklist

- [ ] Pure module considered first.
- [ ] Each process has runtime responsibility.
- [ ] Each process has public API.
- [ ] Each async path has capacity and failure semantics.
- [ ] Each dynamic child has supervisor and identity.
- [ ] Durable work is not implemented as in-memory fire-and-forget work.

