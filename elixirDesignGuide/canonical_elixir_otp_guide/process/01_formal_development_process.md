# Formal Development Process

## Purpose

This document defines the rigorous process for architecting and delivering large Elixir/OTP applications. It is not only a coding guide. It is a formal development loop that creates architecture artifacts, subjects them to critique, lowers approved design into implementation, and accepts work only when evidence proves the behavior, runtime shape, and operational properties are correct.

The process is deliberately iterative. A design is expected to change when the review finds unclear concepts, unsafe runtime ownership, hidden effects, excessive abstraction, or inadequate tests.

## Core Principle

```text
Every feature moves from intent -> model -> contract -> runtime design -> implementation -> evidence.
No feature skips the review and evidence stages.
```

Elixir/OTP rewards explicit runtime design. It also punishes vague ownership. This process exists to keep the design precise before concurrency, supervision, persistence, and distribution amplify mistakes.

## Tiers Of Work

### Tier 0: Charter

The charter defines why the system exists and what it must never violate.

Required artifacts:

- Product or system intent.
- Nonfunctional priorities.
- Hard invariants.
- Explicit non-goals.
- Operational constraints.

Acceptance gate:

```text
Every hard invariant has an intended enforcement path.
Every nonfunctional priority is ranked.
Every non-goal blocks at least one tempting design direction.
```

### Tier 1: Domain And Boundary Design

This tier defines the system without OTP.

Required artifacts:

- Domain vocabulary.
- Value objects.
- Entities and aggregates.
- Commands and events.
- Read models.
- Persistence records.
- Bounded contexts.
- Boundary graph.
- External systems and anti-corruption layers.

Acceptance gate:

```text
No unresolved synonyms.
No implementation-only nouns pretending to be domain concepts.
No cross-context operation without a declared contract.
No external payload enters domain core unchanged.
```

### Tier 2: State, Consistency, And Effects

This tier defines what changes, where it is persisted, and which effects occur.

Required artifacts:

- State ownership table.
- Invariant enforcement matrix.
- Transaction boundaries.
- Idempotency strategy.
- State machines.
- External effect declarations.
- Recovery rules.

Acceptance gate:

```text
Each invariant is enforced by the weakest sufficient mechanism.
Race-sensitive invariants use database constraints, locks, idempotency keys, or a declared serialization owner.
Irreversible external effects are protected by outbox, job, or idempotent delivery.
```

### Tier 3: OTP Lowering

Only after domain, state, and effects are clear does the design lower into OTP primitives.

Required artifacts:

- Process justification forms.
- Supervisor design forms.
- Registry naming rules.
- Message protocol definitions.
- Restart and shutdown policy.
- Backpressure and mailbox policy.
- Telemetry obligations.

Acceptance gate:

```text
Every process has a runtime responsibility.
Every long-lived production process is supervised.
Every supervisor owns a failure domain.
Every stateful process can restart without corrupting durable state.
```

### Tier 4: Implementation

Implementation is bounded by approved artifacts.

Rules:

- The patch may not invent domain concepts.
- The patch may not add external effects that are not declared.
- The patch may not add processes without process justification.
- The patch may not widen public API without contract review.
- Pure core behavior must be tested without booting the supervision tree.

Acceptance gate:

```text
The implementation matches the approved design or includes an explicit design amendment.
All required tests and QC gates pass.
Exceptions are documented with owner and expiration.
```

### Tier 5: Evidence And Release

Evidence is a durable record of why the feature was accepted.

Required artifacts:

- Test output summary.
- Static analysis summary.
- Migration safety notes.
- Observability notes.
- Operational runbook changes.
- Known exceptions.
- Review decision.

Acceptance gate:

```text
The evidence package is sufficient for a reviewer to reproduce the acceptance decision.
```

## Risk Tiers And Fast Track

The formal process scales with risk. It is not a demand to fill every template for every patch.

Classify each change before choosing the review depth:

| Tier | Use For | Required Process |
|---|---|---|
| L0: Fast Track | Simple CRUD, copy/UI-only change, small context function, no new runtime ownership, no risky migration, no external effect. | Fast-track checklist, focused tests, normal QC gates. |
| L1: Standard Feature | New capability with domain rules, persistence changes, or public API surface but no new runtime topology. | Charter summary, boundary contract, state/effect notes, tests, acceptance evidence. |
| L2: Runtime Or Integration Feature | New process, job, workflow, PubSub fanout, LiveView subscription pattern, external provider, durable effect, or migration with production risk. | Full design artifacts for affected areas plus process/effect/persistence forms. |
| L3: System Architecture Change | New bounded context, distributed ownership, data model rewrite, cluster protocol, ingestion pipeline, or rebuild. | Full formal process, architecture tournament, rollout plan, rollback or forward-fix plan. |

Fast-track eligibility requires all of this:

```text
No new OTP process, Registry, ETS table, persistent term, counter array, or supervisor.
No new external mutation, background job, outbox producer, Broadway pipeline, or PubSub fanout.
No public API compatibility break.
No authorization, tenant-boundary, secret-handling, or unsafe-input change.
No migration that can lock, rewrite, or corrupt production data.
No race-sensitive invariant added or changed.
```

Fast-track evidence:

```yaml
fast_track:
  scope:
  why_low_risk:
  tests:
  qc_gates:
```

If any reviewer cannot explain why the work is low risk, promote it to L1 or higher. Fast track reduces ceremony; it does not remove tests, ownership, or accountability.

## Progressive Architecture

Start with the simplest shape that preserves the current invariants. Do not split DTOs, domain structs, read models, and schemas just to satisfy a diagram.

Allowed simple shape:

```text
Phoenix context API
  -> Ecto schema/changeset
  -> Repo transaction
```

This is acceptable when:

- The API/input shape, persistence shape, and domain shape are intentionally identical.
- Business rules are simple validations and constraints.
- There is no long-running workflow or explicit state machine.
- External effects are absent or already routed through an existing outbox/job path.
- There is no public external payload compatibility obligation.

Fracture the simple shape into explicit DTO/domain/schema/read-model layers when one of these triggers appears:

| Trigger | Split Needed |
|---|---|
| External API or provider payload differs from persistence shape. | DTO or adapter payload module. |
| Domain invariant no longer fits cleanly in a changeset. | Pure domain struct/transition module. |
| Race-sensitive rule needs transaction/lock/idempotency beyond validation. | Application service plus persistence contract. |
| Lifecycle has more than trivial states or forbidden transitions. | State machine/domain transition module. |
| Read/query shape diverges from write shape. | Read model/projection. |
| Multiple contexts need the same concept with different meanings. | Bounded context language and boundary graph. |
| Tests require booting Repo or LiveView to prove pure business rules. | Extract pure core. |
| Mapping code becomes repetitive or error-prone. | Dedicated mapper/translator module at the boundary. |

Progressive architecture is not permission to let boundaries decay. It is a rule for delaying separation until the design pressure is real and named.

## Iterative Review Loop

Each non-fast-track feature runs this loop:

```text
1. Draft design.
2. Review for concept clarity.
3. Review boundaries and state ownership.
4. Review OTP lowering.
5. Review tests, operations, and release risks.
6. Revise or reject.
7. Implement only approved scope.
8. Verify.
9. Accept or send back to redesign.
```

Review is not a final ceremony. It is a development tool. If a late implementation detail invalidates the architecture, the feature returns to the design stage and records an amendment.

Fast-track features run a smaller loop:

```text
1. Confirm fast-track eligibility.
2. Implement through existing public boundaries.
3. Add or update focused tests.
4. Run declared QC gates.
5. Record evidence in the PR or change note.
```

## Critical Reflection Stages

### Concept Reflection

Ask:

- Are two names describing the same thing?
- Is a manager, coordinator, or service hiding a missing domain concept?
- Is a technical implementation detail being promoted to the domain language?
- Can this design be explained in fewer concepts?

Output:

```yaml
concept_review:
  accepted_terms:
    - Order
    - PaymentAuthorization
  suspicious_terms:
    - OrderManager
  required_changes:
    - Collapse OrderManager into Orders context API plus Order domain module.
```

### Boundary Reflection

Ask:

- What crosses each boundary?
- Is the payload stable and versioned?
- Does the caller depend on an internal module?
- Could this boundary survive extraction into another application or service?

### Runtime Reflection

Ask:

- Why is this a process?
- Why is it supervised here?
- What state is lost on crash?
- What rebuilds the state?
- What prevents mailbox growth?
- What is the shutdown behavior?

### Compression Reflection

Ask:

- Which module can be deleted?
- Which behavior has only one implementation?
- Which wrapper only renames another API?
- Which process can be replaced with a pure function?
- Which read model can be derived instead of stored?

Compression review is mandatory before implementation for greenfield features and mandatory before large refactors in brownfield work.

## Human, Tool, And LM Responsibilities

### Human Review

Humans own:

- Product tradeoffs.
- Domain language.
- Risk acceptance.
- Security exceptions.
- Release approval.
- Final architecture decisions.

### Deterministic Tooling

Tools own:

- Formatting.
- Compilation.
- Tests.
- Static checks.
- Dependency audits.
- Boundary graph checks where available.
- Public API diffs.
- Migration safety checks.

### LM-Assisted Critique

Language models may help with:

- Finding ambiguous concepts.
- Suggesting missing tests.
- Critiquing runtime design.
- Proposing compression.
- Explaining failures.

Language models are not final authority for:

- Test status.
- Compile status.
- Whether a file exists.
- Whether a public function changed.
- Whether a secret leaked.
- Whether a process is supervised.

Repeated LM findings should become deterministic checks when possible.

## Refactor, Rebuild, Or Continue

Use this decision table:

| Signal | Action |
|---|---|
| Concept names unclear but behavior is sound | Refactor names and docs. |
| Boundary leakage is local | Refactor behind a stable facade. |
| Process owns state that belongs in database | Rebuild that process around persisted state. |
| GenServer serializes unrelated work | Split or remove the process. |
| External effect can be duplicated | Add idempotency/outbox before feature growth. |
| Existing module blocks core invariants | Rebuild the module behind compatibility wrapper. |
| Tests cannot observe required behavior | Redesign the public contract or instrumentation. |

## Stop Conditions

Do not proceed to implementation when:

- The domain vocabulary is unstable.
- The consistency boundary is unknown.
- The feature requires a process but state recovery is undefined.
- External effects have no idempotency plan.
- A migration can lock or corrupt production data.
- There is no way to test the failure mode that matters.
- A security exception has no owner or expiration.

## Required Records

Each feature should leave:

```text
docs/features/<feature>/
  00_charter.md
  01_domain_and_boundaries.md
  02_state_effects_and_consistency.md
  03_otp_lowering.md
  04_test_and_qc_plan.md
  05_review_findings.md
  06_acceptance_evidence.md
```

Small features may combine files, but they may not omit the content.
