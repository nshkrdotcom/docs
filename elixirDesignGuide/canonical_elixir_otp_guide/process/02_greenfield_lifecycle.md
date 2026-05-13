# Greenfield Lifecycle

## Purpose

This document defines how to create a large Elixir/OTP application from zero without prematurely turning every concept into a GenServer or every database table into a domain model.

The lifecycle is staged. Each stage produces artifacts, receives critique, and either advances or loops back.

## Stage 1: Charter And Nonfunctional Priorities

Write the charter before modules, dependencies, schemas, or supervisors.

The charter must include:

- Mission.
- Users and operators.
- Hard invariants.
- Availability target.
- Latency target.
- Durability target.
- Security obligations.
- Observability obligations.
- Expected growth path.
- Non-goals.

Example:

```text
The system must never deliver a payment capture twice.
The system must preserve enough audit data to explain every external provider call.
The system may initially run on one node, but payloads must be versioned for future rolling upgrades.
```

Gate:

```text
No invariant may be listed without an enforcement candidate.
```

## Stage 2: Domain Vocabulary

Define domain concepts before code organization.

Create:

- A glossary.
- A synonym table.
- A rejected-terms table.
- A relationship map.

Avoid early terms like:

- Manager.
- Processor.
- Coordinator.
- Service.
- Handler.

Those terms may be valid, but only when they describe an actual runtime or architectural role. They are often placeholders for missing domain language.

Gate:

```text
Every load-bearing noun is classified as domain, persistence, API, runtime, or infrastructure.
```

## Stage 3: Data Model

Separate data categories:

| Category | Purpose |
|---|---|
| Value object | Immutable meaningful value. |
| Entity | Identity plus lifecycle. |
| Aggregate | Consistency boundary around related entities. |
| Command | Request to change state. |
| Event | Fact that happened. |
| Read model | Query-optimized projection. |
| Persistence record | Database shape. |
| Runtime state | Ephemeral process-owned state. |

Gate:

```text
No single schema may silently serve as API input, persistence record, domain aggregate, and read model unless the shapes are intentionally identical.
```

## Stage 4: Capabilities And Contracts

Define what the system can do as contracts, not modules.

For each capability:

```yaml
capability: place_order
inputs:
  - customer_id
  - cart_id
  - payment_method_id
outputs:
  - order_id
  - order_status
expected_errors:
  - cart_empty
  - customer_blocked
  - payment_declined
invariants:
  - order_has_at_least_one_line
  - payment_authorization_is_idempotent
```

Gate:

```text
Every capability has an explicit input, output, expected error, and invariant list.
```

## Stage 4A: Fast-Track Classification

Before deeper architecture work, decide whether the feature is low risk.

Fast-track work may continue with a compact record when it only:

- Adds or changes presentation behavior.
- Adds a simple context function over existing persistence.
- Uses existing boundary contracts.
- Uses existing supervision and runtime infrastructure.
- Adds no external effect except through an existing declared path.
- Adds no race-sensitive invariant, tenant/security change, or risky migration.

Fast-track gate:

```text
The feature can be explained as an existing-boundary change.
No new runtime owner, durable effect, ingestion pipeline, or public contract obligation is introduced.
Tests still cover the changed behavior.
```

If the work introduces LiveView subscriptions, PubSub fanout, Broadway/GenStage ingestion, Ash resource/action policy changes, or any advanced VM primitive, it is not L0 fast track even when the patch is small.

## Stage 5: Boundary Graph

Define bounded contexts and allowed edges.

Example:

```text
Web -> Orders public API
Orders -> Billing public API
Orders -> Inventory public API
Billing -> PaymentProvider adapter
Inventory -> Repo
Domain core -> no Repo, no HTTP, no process APIs
```

Gate:

```text
Every cross-context call must target a public context API or declared adapter.
```

## Stage 6: State And Consistency

For each state value, record:

- Owner.
- Source of truth.
- Persistence location.
- Cache or authority.
- Recovery path.
- Concurrency risk.
- Invalidation policy.

For each invariant, pick the weakest sufficient enforcement:

| Invariant | Typical enforcement |
|---|---|
| Pure deterministic rule | Constructor or pure transition. |
| Input shape | Changeset or boundary parser. |
| Cross-row uniqueness | Database constraint. |
| Race-sensitive consistency | Transaction, lock, constraint, idempotency key, or state owner. |
| Long-running workflow | Persisted workflow state plus supervised worker/job. |
| External side effect | Outbox, idempotency key, retry policy. |

Gate:

```text
No race-sensitive invariant may rely only on pre-transaction validation.
```

## Stage 7: Architecture Tournament

Generate two or three possible designs for major subsystems.

Each candidate must include:

- Domain shape.
- Runtime shape.
- Persistence shape.
- Failure behavior.
- Test strategy.
- Operational cost.
- Reasons to reject it.

Evaluation criteria:

- Simplicity.
- Correctness under concurrency.
- Recovery safety.
- Testability.
- Observability.
- Release safety.
- Future extraction cost.

Gate:

```text
The winning design must explain why a simpler pure-module or transactional design is insufficient if OTP is introduced.
```

## Stage 8: OTP Lowering

Lower only the approved runtime responsibilities.

Use this order:

1. Can this be a pure function?
2. Can this be a transactional application service?
3. Is there long-lived runtime state?
4. Is there dynamic process identity?
5. Is there concurrent work tied to a caller?
6. Is there supervised one-shot work?
7. Is there a durable job requirement?
8. Is there an explicit finite-state machine?
9. Is there a high-read shared table?

Gate:

```text
Every process has a process justification form.
Every supervisor has a failure-domain form.
```

## Stage 9: Skeleton Before Fill

Implement skeletons first:

- Domain structs.
- Pure transitions.
- Context public APIs.
- Behavior contracts only when there is a real seam.
- Supervisor tree with minimal children.
- Adapter boundaries.
- Test modules with pending cases or skipped acceptance labels.

Gate:

```text
The skeleton must compile without hidden behavior.
No placeholder process may own fake state.
```

## Stage 10: Red-First Implementation

Implement by contract and invariant.

Recommended order:

1. Pure domain tests.
2. Boundary parser/changeset tests.
3. Transaction tests.
4. Process public API tests.
5. Crash/restart tests.
6. External adapter contract tests.
7. Observability assertions.

Gate:

```text
Expected errors are tested as data.
Unexpected crashes are not hidden by broad rescue.
```

## Stage 11: Release Readiness

Before first production release:

- Confirm release-safe runtime config.
- Confirm migrations are online-safe.
- Confirm secrets are not compiled into release artifacts.
- Confirm graceful shutdown.
- Confirm health checks.
- Confirm telemetry dashboards.
- Confirm rollback or forward-fix plan.
- Confirm seed/bootstrap process.

Gate:

```text
The system can be started, stopped, and restarted without manual hidden state repair.
```

## Stage 12: Post-Launch Feedback

After launch:

- Compare observed failures to expected failure model.
- Promote repeated review findings into deterministic checks.
- Remove unused abstraction.
- Revisit process count.
- Revisit public API surface.
- Update runbooks.

Greenfield does not end at launch. The first production incidents are design feedback.
