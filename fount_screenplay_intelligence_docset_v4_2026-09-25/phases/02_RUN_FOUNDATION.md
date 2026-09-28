# Phase 02 — Run foundation

Entry: Phase 01 is complete on recorded runtime evidence and the supplied source includes its Core/Workshop approval changes. Read `ARCHITECTURE.md`, the schema/plan/policy contracts in `DATA_AND_EXECUTION.md`, and the Run storage portions of the approval model.

## Deliverable and scope

A host can create/read a durable run with immutable plan/policy snapshots and a complete storage model for later execution, decisions, approvals, usage and delivery. This is the phase that creates `packages/fount_run`. Worker execution is Phase 03; screenplay orchestration and canonical strategy submission are Phase 04; steering and approval dispatch are Phase 05.

## Implementation checklist

1. Add `packages/fount_run` with Mix metadata, formatter, docs, migrations and tests. Follow current workspace dependency conventions. Register the fifth library in workspace/CI/package/architecture/snapshot tooling and update exact four-library assertions intentionally.
2. Implement every Run table and FK/index/constraint in `DATA_AND_EXECUTION.md`: runs, immutable plans/policies, steps/attempts/events, decisions, approval attempts, usage and deliveries. Core never depends on these tables. The caller owns the shared Repo/database.
3. Implement pure closed-schema plan/policy validation and canonical fingerprints; owner/approver resolution uses trusted host context. Add `start_run`, read/list and snapshot persistence. Atomically create run plus plan/policy version 1 and their pointers; a repeated request key returns one run and conflicts on altered content.
4. Add append-only snapshot/event primitives, atomic pending-decision persistence/resolution primitives and controlled approval-attempt lifecycle storage. Received review/approval payloads become immutable when set; rejected/invalid/fenced attempts can exist without Core acceptances. Full public decision commands and callback execution belong to later phases.
5. Add usage reservation/settlement and active-step/lease schema primitives needed by the worker. This phase proves storage constraints and transactions; Phase 03 implements claiming, renew/reclaim, provider accounting and recovery behavior.
6. Export the migration path and provide a runnable Core→Run migration/integration harness on the caller's Repo. Application startup without a configured host must be safe and perform no provider work. Document which public commands are implemented; do not expose future commands as successful no-ops.

## Runtime acceptance

- **R01:** Fifth-library registration, compile/docs/build and host-free startup work; Core remains independently buildable and has no Run/host dependency.
- **R02:** Core→Run migrations initialize a fresh database and upgrade the prior schema. Cross-screenplay/run/plan/policy/step references fail transactionally when invalid; all resource/state constraints hold.
- **R03:** Run creation validates trusted ownership, attrs and policy, creates exactly one initial plan/policy, is idempotent and performs zero provider calls. Read/list enforce caller authority.
- **R04:** Complete plan/policy snapshots have stable fingerprints, atomic version/pointer changes and preserved historical bindings. Public persistence cannot overwrite snapshots/events; unknown fields and invalid limits are rejected.
- **R05:** Pending decision primitives resolve once under concurrent submissions and retain actor/context identity. Approval-attempt storage preserves nonaccepted outcomes and exact immutable review/approval identity; it does not advance canon.
- **R06:** Usage identities, reservation/settlement records, active-step ownership references and delivery identities survive reload and reject duplicate/invalid links. Tests distinguish storage invariants from Phase 03 runtime lease/recovery behavior.

Run common quality gates, new Run PostgreSQL integration, Core/Workshop regressions and all five library package builds. Include the exact new migration/test commands in the runtime handoff.

## Handoff boundary

Web returns two ZIPs plus Phase 02 QC handoff with source-only status. Runtime repairs/certifies R01–R06, updates state/traceability, commits/pushes and prepares Phase 03 inputs. It stops before implementing the worker.