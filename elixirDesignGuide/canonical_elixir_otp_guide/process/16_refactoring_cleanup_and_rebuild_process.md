# Refactoring, Cleanup, And Rebuild Process

## Purpose

This document defines a pass-based cleanup process for existing Elixir/OTP systems. It prevents broad cleanup from becoming uncontrolled churn.

## Cleanup Philosophy

Do not "clean the codebase" in one giant sweep.

Run focused passes:

1. Scan for one class of issue.
2. Classify findings by risk and owner.
3. Fix only that concern.
4. Add red-first or regression tests.
5. Run verification gates.
6. Document exceptions.

Each pass should produce a narrow reviewable change.

## Global Cleanup Rules

### No Regex For Structural Rewrites

Regex may validate flat lexical strings. It must not rewrite Elixir syntax, `mix.exs`, configs, nested payloads, or multi-line code structures.

Use parser-aware tooling:

```elixir
Code.string_to_quoted/2
Macro.prewalk/2
Macro.postwalk/2
```

Or source-aware tools:

```text
Sourceror
Rewrite
Igniter
```

### Every Pass Has An Exit Gate

A pass is complete only when:

- Unsafe findings are fixed or documented.
- Tests cover rejected cases.
- Existing tests pass or failures are documented.
- New behavior is observable.
- No unrelated behavior was changed.

### Exceptions Must Expire

Exception format:

```elixir
# guide:allow unsafe_deserialization
# reason: trusted release migration payload generated locally
# owner: platform-runtime
# expires: 2026-08-01
```

Required fields:

- Rule.
- Reason.
- Owner.
- Expiration or review date.
- Test coverage.

## Recommended Pass Order

| Pass | Topic | Reason |
|---:|---|---|
| 0 | Baseline and inventory | Establish truth before changes. |
| 1 | Transformation safety | Prevent cleanup tools from corrupting code. |
| 2 | Boundary and DTO integrity | Stop external shapes leaking inward. |
| 3 | Atom safety and bounded vocabulary | Prevent atom exhaustion and invalid vocabularies. |
| 4 | Config and ambient authority | Remove hidden runtime coupling. |
| 5 | Secrets and error redaction | Prevent leakage. |
| 6 | Unsafe deserialization and runtime eval | Remove high-impact execution risks. |
| 7 | OTP lifecycle and supervision | Ensure work is owned and restartable. |
| 8 | Mailbox and backpressure | Prevent memory growth and overload collapse. |
| 8A | LiveView and PubSub fanout | Prevent UI processes from becoming hidden domain owners or fanout bottlenecks. |
| 9 | GenServer functional-core cleanup | Extract business logic from callbacks. |
| 10 | Serialization and versioning | Stabilize durable and external contracts. |
| 10A | Ingestion pipeline safety | Stabilize ack, retry, dead-letter, and replay semantics. |
| 11 | Persistence and state backend cleanup | Clarify authority and side effects. |
| 12 | Package and dependency boundaries | Reduce transitive coupling. |
| 13 | Observability and context propagation | Make failures explainable. |
| 14 | Idiom, performance, and maintainability | Improve after safety risks are handled. |
| 15 | Governance lock-in | Keep fixed problems fixed. |

## Pass Details

### Pass 0: Baseline And Inventory

Actions:

- Record command results.
- Inventory processes, supervisors, schemas, public APIs, effects, and dependencies.
- Record known flaky tests separately from new failures.

Exit:

```text
Baseline exists and is accepted as the starting truth.
```

### Pass 1: Transformation Safety

Actions:

- Remove ad hoc source rewrite scripts.
- Replace string rewrites with AST-aware tooling.
- Add tests for transformation scripts.

Exit:

```text
No structural code rewrite relies on unbounded regex.
```

### Pass 2: Boundary And DTO Integrity

Actions:

- Introduce input DTOs or embedded schemas.
- Translate external payloads at the boundary.
- Prevent controllers and LiveViews from calling persistence internals.

Exit:

```text
External payloads cannot reach domain core without validation and translation.
```

### Pass 3: Atom Safety

Actions:

- Replace `String.to_atom/1` on external input.
- Use `String.to_existing_atom/1` only for trusted bounded vocabularies.
- Prefer maps, enums, explicit parsers, or lookup tables.

Exit:

```text
No unbounded external input can create atoms.
```

### Pass 4: Config And Ambient Authority

Actions:

- Remove `Mix.env/0` from runtime application code.
- Move `System.get_env/1` and `Application.get_env/2` to config or materializer boundaries.
- Inject config into pure modules.

Exit:

```text
Runtime behavior does not depend on compile-time environment reads.
```

### Pass 5: Secrets And Error Redaction

Actions:

- Redact logs, telemetry, exceptions, and inspect output.
- Avoid storing raw credentials in process state.
- Add tests for error surfaces.

Exit:

```text
Secrets cannot appear in normal logs, telemetry, error tuples, or crash reports under tested paths.
```

### Pass 6: Unsafe Execution And Deserialization

Actions:

- Remove `Code.eval_*` from runtime paths.
- Replace unsafe `binary_to_term` usage.
- Ban `:os.cmd/1`.
- Use `System.cmd/3` with argument lists and timeouts when shelling out is unavoidable.

Exit:

```text
Untrusted data cannot become code, atoms, terms, or shell commands.
```

### Pass 7: OTP Lifecycle And Supervision

Actions:

- Replace `spawn` and unmanaged `Task.start` with supervised alternatives.
- Add child specs.
- Define restart policies.
- Add process lifecycle tests.

Exit:

```text
All production-significant work is supervised or explicitly exempted.
```

### Pass 8: Mailbox And Backpressure

Actions:

- Audit `cast` usage.
- Add bounded queues or backpressure.
- Monitor mailbox size.
- Move slow work out of callbacks.

Exit:

```text
Important asynchronous work has capacity, overload, and observability rules.
```

### Pass 8A: LiveView And PubSub Fanout

Actions:

- Classify LiveView assigns as presentation, derived, async, stream, or durable reference.
- Move business writes from LiveView callbacks into context APIs.
- Replace broad PubSub topics with tenant/resource-scoped topics.
- Shrink large PubSub payloads to identifiers or compact events.
- Add missed-message recovery by re-querying authoritative state.
- Add telemetry for event latency, message handling, fanout, and async failures.

Exit:

```text
LiveView processes own presentation state only, and PubSub fanout is scoped, observable, and recoverable.
```

### Pass 9: GenServer Functional-Core Cleanup

Actions:

- Extract pure transition modules.
- Keep callbacks thin.
- Test transitions without processes.
- Keep side effects in orchestration.

Exit:

```text
Business rules are testable without starting the GenServer.
```

### Pass 10: Serialization And Versioning

Actions:

- Version external and durable payloads.
- Add decoders for old formats.
- Add compatibility tests.

Exit:

```text
Rolling upgrades and persisted old payloads have a compatibility path.
```

### Pass 10A: Ingestion Pipeline Safety

Actions:

- Inventory Broadway/GenStage producers, processors, batchers, and source guarantees.
- Document acknowledgement, retry, poison-message, dead-letter, and replay behavior.
- Add idempotency or dedupe before increasing concurrency.
- Move domain decisions out of pipeline callbacks where practical.
- Add telemetry for source lag, batch latency, ack failure, and dead-letter counts.
- Add tests for duplicate delivery and failure paths.

Exit:

```text
Ingestion pipelines can tolerate duplicate delivery, bounded failure, shutdown, and replay without corrupting state.
```

### Pass 11: Persistence And State Backend Cleanup

Actions:

- Add missing constraints.
- Split read and write models.
- Replace hidden process authority with durable state where needed.
- Add idempotency keys.
- Replace inappropriate `:persistent_term`, `:atomics`, or `:counters` usage with an owner module or durable authority.

Exit:

```text
Race-sensitive invariants are enforced by authoritative persistence or serialization point.
```

### Pass 12: Package And Dependency Boundaries

Actions:

- Remove dependency cycles.
- Move optional dependencies behind adapters.
- Clarify public APIs.

Exit:

```text
Internal modules are not required by external consumers.
```

### Pass 13: Observability

Actions:

- Add telemetry for commands, jobs, external calls, retries, and process failures.
- Add correlation/context propagation.
- Add dashboards and runbook notes.

Exit:

```text
Operators can answer what happened, where, to whom, and whether retry/recovery is in progress.
```

### Pass 14: Idiom And Maintainability

Actions:

- Reduce public API surface.
- Remove dead code.
- Collapse single-use wrappers.
- Tune Credo and Dialyzer findings.

Exit:

```text
The code is simpler without changing externally accepted behavior.
```

### Pass 15: Governance Lock-In

Actions:

- Promote repeated findings to static checks.
- Add CI gates.
- Add exception review.
- Add public API diff review.

Exit:

```text
The same defect class cannot return without failing a check or review.
```

## Rebuild Triggers

Rebuild when refactoring cannot satisfy the invariant safely.

Triggers:

- State authority is fundamentally wrong.
- Persistence schema cannot support required consistency.
- Public API exposes invalid operations that cannot be wrapped safely.
- Runtime topology creates unavoidable bottleneck or data loss.
- Test harness cannot isolate behavior because concerns are inseparable.

Rebuild rules:

- Rebuild behind a stable facade.
- Add shadow mode where possible.
- Compare old and new behavior.
- Migrate data in reversible steps when possible.
- Keep old decoders until compatibility window ends.
