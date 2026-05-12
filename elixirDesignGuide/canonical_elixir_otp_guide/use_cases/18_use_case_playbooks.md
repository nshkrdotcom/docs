# Use Case Playbooks

## Purpose

This document provides practical playbooks for common large-scale Elixir/OTP feature types.

Each playbook follows:

```text
domain -> consistency -> effects -> OTP lowering -> tests -> QC -> acceptance
```

## Playbook 1: Transactional CRUD / Context Feature

Use when:

- Feature is mostly database-backed.
- Work completes synchronously.
- External effects can be deferred.

Design:

- Define input DTO.
- Define domain entity/value object.
- Define persistence schema.
- Define context public API.
- Define transaction.
- Define events/outbox if effects exist.

OTP:

- Usually none beyond Repo and existing app supervision.

Tests:

- Changeset/DTO validation.
- Domain transition.
- Transaction success/failure.
- Constraint errors.

QC:

- No controller Repo business calls.
- No domain Repo calls.
- No external effect in transaction.

## Playbook 2: Stateful Session Or Runtime Entity

Use when:

- A session, connection, room, or runtime entity owns ephemeral state.
- Calls need serialized access.
- State can be rebuilt or safely lost.

Design:

- Define durable source of truth if needed.
- Define session state.
- Define public API.
- Define message protocol.
- Define restart behavior.

OTP:

- GenServer for session.
- DynamicSupervisor for many sessions.
- Registry for lookup by session ID.

Tests:

- Start and lookup.
- Calls through public API.
- Crash and restart.
- State recovery.
- Unknown messages.

QC:

- No business rules trapped only in callbacks.
- No unbounded cast.
- State recovery documented.

## Playbook 3: Background Job And Outbox

Use when:

- Work must happen after commit.
- Work can retry.
- External effect may fail.
- Node crash must not lose work.

Design:

- Transaction writes business state and outbox/job row.
- Worker delivers effect idempotently.
- Dead-letter or park behavior exists.

OTP:

- Durable job system or outbox worker.
- Task.Supervisor only for non-durable helper work.

Tests:

- Outbox row written in transaction.
- Duplicate delivery safe.
- Retry scheduling.
- Dead state.
- Telemetry emitted.

QC:

- No fire-and-forget for must-run work.
- Provider idempotency key exists for mutations.
- Backlog alert defined.

## Playbook 4: External Provider Integration

Use when:

- Calling HTTP, SDK, CLI, LLM, payment, storage, or SaaS provider.

Design:

- Define internal request/response.
- Define adapter behavior only if there is a real seam.
- Define provider mapping.
- Define error classification.
- Define timeout/retry policy.
- Define secrets and redaction.

OTP:

- Usually plain adapter module.
- Use supervised pool/process only for persistent connection or resource ownership.
- Use job for durable external mutations.

Tests:

- Contract tests.
- Timeout and error mapping.
- Redaction.
- Idempotent retry.
- Fixture compatibility.

QC:

- No provider structs in domain core.
- No raw secrets in logs.
- No broad retry of non-idempotent operation.

## Playbook 5: Real-Time PubSub Feature

Use when:

- UI or local subscribers need updates.
- Messages are notifications, not source of truth.

Design:

- Define event source.
- Define topic naming and tenant scope.
- Define payload version.
- Define missed-message recovery.

OTP:

- PubSub infrastructure.
- Optional process subscribers.

Tests:

- Topic authorization.
- Broadcast payload.
- Subscriber behavior.
- Missed message fallback.

QC:

- PubSub is not used for must-deliver business events.
- Topics include tenant/resource scope.
- Payloads are small and versioned if long-lived.

## Playbook 6: Long-Running Workflow

Use when:

- Multiple steps.
- External waits.
- Retries and compensation.
- Human approval.

Design:

- Define state machine.
- Define persisted state.
- Define step effects.
- Define compensation.
- Define timeout behavior.

OTP:

- Durable workflow rows plus job runner.
- GenServer or `:gen_statem` only when runtime session/coordination is needed.

Tests:

- Allowed and forbidden transitions.
- Duplicate events.
- Crash/restart.
- Compensation.
- Timeout.

QC:

- Workflow progress persisted.
- External effects idempotent.
- Stuck states observable.

## Playbook 7: Distributed Or Clustered Feature

Use when:

- Multiple nodes participate.
- Work may run anywhere.
- Payloads cross nodes.
- Rolling upgrades matter.

Design:

- Define node roles.
- Define ownership.
- Define partition behavior.
- Define payload versions.
- Define capability negotiation if needed.

OTP:

- Local Registry, `:pg`, PubSub, or coordinator chosen by failure model.
- Avoid remote synchronous calls where possible.

Tests:

- Multi-node local cluster.
- Node down.
- Partition or timeout.
- Mixed-version payload.

QC:

- Remote calls have timeout.
- PubSub not durable source.
- Duplicate singleton ownership is handled.

## Playbook 8: Brownfield Remediation Feature

Use when:

- Fixing an existing unsafe pattern.
- Refactoring boundary or process topology.

Design:

- Baseline current behavior.
- Add characterization tests.
- Define target invariant.
- Pick smallest safe remediation.
- Add compatibility wrapper if needed.

OTP:

- Remove processes that do not need to exist.
- Add supervision where needed.
- Move durable facts out of runtime state.

Tests:

- Regression for old bug.
- Existing behavior compatibility.
- New invariant enforcement.
- Restart and failure path if runtime changed.

QC:

- Narrow PR scope.
- Findings ledger updated.
- Exceptions explicit.
- Same class of defect gets a check or review gate.

