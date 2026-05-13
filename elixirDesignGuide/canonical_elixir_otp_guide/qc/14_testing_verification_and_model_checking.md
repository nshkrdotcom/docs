# Testing, Verification, And Model Checking

## Purpose

This document defines the verification strategy for large Elixir/OTP systems, from pure unit tests to distributed failure testing.

## Testing Rule

```text
Test the pure core without processes.
Test the process through its public API.
Test effects at the boundary.
Test failure modes explicitly.
```

## Test Layers

| Layer | Purpose |
|---|---|
| Unit tests | Pure functions, constructors, validators, transitions. |
| Boundary tests | DTO parsing, changesets, adapter mapping. |
| Integration tests | Repo transactions, constraints, context APIs. |
| Process tests | GenServer/Agent/Task lifecycle through public API. |
| Supervision tests | Crash, restart, state recovery, shutdown. |
| Contract tests | Behaviors, external providers, payload compatibility. |
| Property tests | Invariants over generated inputs. |
| State-machine tests | Long-running lifecycle transitions. |
| Concurrency tests | Race and interleaving risk. |
| Distributed tests | Multi-node behavior and rolling compatibility. |
| Chaos tests | Network or dependency failure. |
| Release tests | Config, migration, boot, shutdown, rollback. |

## Pure Core Tests

Pure tests should cover:

- Constructor validity.
- Invalid data rejection.
- Allowed transitions.
- Forbidden transitions.
- Event emission.
- Algebraic properties.
- Idempotency.

They should not require:

- Repo.
- Supervision tree.
- HTTP.
- Real time.
- Global config.

## Boundary Tests

Boundary tests cover:

- External input shape.
- Unknown fields.
- Type conversion.
- Atom safety.
- Error messages.
- Provider payload mapping.
- Redaction.

## Persistence Tests

Persistence tests cover:

- Database constraints.
- Transaction rollback.
- `Ecto.Multi` step failure.
- Race-sensitive constraints.
- Idempotency keys.
- Migration assumptions.

Include tests that prove validations are not the only line of defense for concurrent invariants.

Use Ecto SQL Sandbox for normal Repo-backed tests when available. Database integration tests are often the right default for transactions, constraints, migrations, and context APIs. Do not mock the database when the behavior being tested is database behavior.

Sandbox rules:

- Use concurrent sandbox tests where the adapter supports them.
- Use shared mode or explicit allowances when spawned processes need database access.
- Keep pure domain tests separate so database setup does not hide business logic coupling.
- Add explicit non-sandbox or staging tests for migration, lock, and production-shape data risks.
- Be cautious with adapters whose transaction behavior does not support safe concurrent sandbox tests.

## LiveView Tests

LiveView tests cover:

- `mount`, `handle_params`, and authorization behavior.
- `handle_event` through rendered UI interactions.
- PubSub `handle_info` messages through documented topics.
- `assign_async`, `start_async`, and failure UI states.
- Reconnect/remount recovery for user-visible state.
- Streams, pagination, or temporary assigns for large collections.

Do not assert internal socket state when public rendered behavior or telemetry can prove the same contract.

## Ingestion Pipeline Tests

Broadway or GenStage pipeline tests cover:

- Message decoding and boundary validation.
- Idempotent handling of duplicate messages.
- Batch behavior.
- Ack and failure paths.
- Poison-message/dead-letter handling.
- Partition or ordering behavior.
- Graceful shutdown or replay assumptions.

Use Broadway's test helpers where available, but keep domain decisions testable outside the pipeline callbacks.

## Process Tests

Test process behavior through public API:

- Start.
- Normal call.
- Expected error.
- Timeout.
- Crash and restart.
- State recovery.
- Duplicate message.
- Unknown message.
- Shutdown.

Avoid:

- Reaching into process internals.
- Testing implementation message tuples from outside.
- `Process.sleep/1` as synchronization.

Prefer:

- Monitors.
- Test probes.
- Telemetry events.
- Eventually helpers with bounded timeout.
- Controlled clocks.

## Supervision Tests

Test:

- Child restarts after crash.
- State is rebuilt or intentionally lost.
- Supervisor strategy behaves as expected.
- `:rest_for_one` dependencies restart together.
- Shutdown order is safe.
- Permanent/transient/temporary policies are correct.

## Contract Tests

For behavior adapters:

- Run the same contract suite against fake and real adapter when practical.
- Verify error normalization.
- Verify timeout semantics.
- Verify telemetry.
- Use Mox or an equivalent process-aware mock for external behaviours in async tests.
- Pass explicit dependency modules/structs into effect shells when the test needs a fake.
- Prefer real SQL Sandbox tests over Repo mocks for persistence behavior.

For external APIs:

- Use recorded fixtures where appropriate.
- Validate schema.
- Validate semantic expectations.
- Include compatibility tests for old payloads.

## Effect Shell Tests

Effect-shell tests cover orchestration across boundaries:

- Domain transition called with normalized input.
- Repo transaction success and rollback.
- External client success/failure/timeout mapping.
- Job/outbox enqueue behavior.
- PubSub topic and payload shape where observable.
- Telemetry emission.
- Idempotency on duplicate commands or retries.

Rules:

- Mock only the external seam, not the business rule.
- Keep Mox expectations local to the test process or explicitly allow spawned processes.
- Use test probes, durable rows, or telemetry when spawned process behavior is hard to observe directly.
- Do not hide race-sensitive behavior behind a fake when the database or source system is the authority.

## Property-Based Testing

Use property tests when:

- Input space is large.
- Invariants are simple to state.
- Edge cases are easy to miss.

Good properties:

- Money operations never produce negative amounts unless allowed.
- Encoders/decoders round trip.
- Commands are idempotent.
- Sorting/ranking is stable under ties.
- State transitions never enter forbidden state.

## Stateful Property Testing

Use state-machine property tests for:

- Workflow engines.
- Caches.
- Lock managers.
- Rate limiters.
- Session state.
- Distributed registries.

Model:

- Abstract state.
- Generated commands.
- Preconditions.
- Next-state function.
- Postconditions.

## Model Checking

Use model checking or schedule exploration when:

- Race condition would be severe.
- Interleavings are hard to cover randomly.
- Process messaging logic is central.
- Shared ETS or registry logic is complex.

Keep scenarios small and terminating. Stub external dependencies.

## Trace-Based Verification

Use trace-based verification when:

- System is eventually consistent.
- State is distributed.
- Direct assertions are flaky.
- Temporal order matters.

Pattern:

1. Emit structured trace events.
2. Run scenario.
3. Verify trace history with pure assertions.

Example assertion:

```text
If job_started occurs, then job_finished or job_dead occurs with the same job_id.
No provider_success occurs before authorization_granted.
```

## Chaos Testing

Inject:

- Network latency.
- Network partition.
- External timeout.
- Provider 5xx.
- Database disconnect.
- Node crash.
- Worker crash.
- Duplicate delivery.

Chaos tests need clear expected behavior:

- Retry.
- Fail closed.
- Park for operator.
- Compensate.
- Degrade feature.

## Release Tests

Before release:

- Boot release artifact.
- Verify runtime config.
- Run migrations in staging-like environment.
- Test graceful shutdown.
- Test old payload decoding.
- Test mixed-version cluster for protocol changes.
- Test rollback or forward-fix.

## Coverage Matrix

Each feature should declare:

| Risk | Required Test |
|---|---|
| Business invariant | Pure unit or property test. |
| Race-sensitive invariant | Constraint/transaction test. |
| Process state | Process restart test. |
| External effect | Adapter contract and idempotency test. |
| Workflow | State-machine transition test. |
| LiveView state | Rendered interaction, PubSub, async, and reconnect test. |
| Ingestion pipeline | Ack/failure/batch/replay test. |
| Distributed payload | Compatibility test. |
| Security boundary | Rejection and redaction test. |

## Review Checklist

- [ ] Pure core has direct tests.
- [ ] Processes are tested through public API.
- [ ] Failure modes are tested, not only happy paths.
- [ ] Race-sensitive rules are tested at authoritative layer.
- [ ] Repo behavior is tested against the database with SQL Sandbox or an equivalent integration setup where practical.
- [ ] LiveView and ingestion pipeline behavior are tested through public/runtime boundaries.
- [ ] External contracts and old payloads are tested.
- [ ] Release risks have release-level tests.
