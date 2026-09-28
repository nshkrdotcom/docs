# Requirement traceability

Agents replace pending source/test/evidence cells as work proceeds. Written tests and executed tests are distinct. Active requirement IDs are defined in the six phase specifications. Phase 01 is `COMPLETE` after local runtime QC. Phase 02 is `OFFLINE_IMPLEMENTED`: source/tests are delivered, but R01–R06 remain unexecuted runtime gates. Executed evidence for A01–A06 is in [the Phase 01 runtime QC report](handoffs/PHASE_01_RUNTIME_QC_REPORT.md); Phase 02 runtime evidence is pending [the Phase 02 QC handoff](handoffs/PHASE_02_RUNTIME_QC_HANDOFF.md). Later phases remain `NOT_STARTED`.

| Requirement | Phase | Source / tests | Runtime evidence |
| --- | --- | --- | --- |
| A01 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `writing/principal.ex`, `authority.ex`, `review.ex`, `approval.ex`; `persistence.ex`; `writing_persistence_test.exs` human/agent/service audit | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A02 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `persistence.ex` direct-save closure + `save_edit_candidate/4`; `writing_persistence_test.exs`; `continuation_concurrency_test.exs`; Phase 01 source callsite audit | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A03 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `writing/check_set.ex`, `writing/review_gate.ex`; Core unit/integration forged identity/check/report/override/no-partial-write coverage | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A04 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | Stable approval ID/hash in `persistence.ex`; retry/conflict tests in `writing_persistence_test.exs`; PostgreSQL race in `continuation_concurrency_test.exs` | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A05 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `20260928000000_authorize_canonical_acceptance.exs`; `approval_migration_test.exs` fresh + baseline-upgrade schemas and identity constraints | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A06 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | Workshop Review/Acceptance/CLI/fake store/examples/docs/tests converted to typed approval; legacy shapes fail closed; no `packages/fount_run` | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| R01 | [02](phases/02_RUN_FOUNDATION.md) | `packages/fount_run`; root workspace/CI/architecture/final-acceptance five-library registration; host-free application + package contract tests | NOT_RUN — runtime QC pending |
| R02 | [02](phases/02_RUN_FOUNDATION.md) | `20260928010000_create_run_foundation.exs`; `integration/{storage_constraints,run_foundation}_test.exs` Core→Run migration, FK/constraint and invalid cross-link coverage | NOT_RUN — PostgreSQL QC pending |
| R03 | [02](phases/02_RUN_FOUNDATION.md) | `FountRun.start_run/get_run/list_runs`; `ActorContext`, `Plan`, `Policy`, `Persistence`; authorization/idempotency/provider-free written tests | NOT_RUN — runtime QC pending |
| R04 | [02](phases/02_RUN_FOUNDATION.md) | Closed canonical plan/policy fingerprints; append-only snapshot/event persistence; expected-version pointer changes and immutability tests | NOT_RUN — runtime QC pending |
| R05 | [02](phases/02_RUN_FOUNDATION.md) | Pending decision single-resolution/concurrency storage; immutable approval review/payload lifecycle; accepted outcome blocked pending later acceptance bridge | NOT_RUN — concurrent PostgreSQL QC pending |
| R06 | [02](phases/02_RUN_FOUNDATION.md) | Controlled step/attempt + lease/fence identity, usage reservation/settlement and delivery identity/replay persistence tests | NOT_RUN — PostgreSQL reload/constraint QC pending |
| W01 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W02 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W03 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W04 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W05 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W06 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| W07 | [03](phases/03_DURABLE_EXECUTION.md) | NOT_STARTED | NOT_RUN |
| P01 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P02 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P03 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P04 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P05 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P06 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| P07 | [04](phases/04_SCREENPLAY_PIPELINE.md) | NOT_STARTED | NOT_RUN |
| C01 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C02 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C03 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C04 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C05 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C06 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| C07 | [05](phases/05_CONTROL_AND_COMPLETION.md) | NOT_STARTED | NOT_RUN |
| U01 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U02 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U03 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U04 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U05 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U06 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |
| U07 | [06](phases/06_WEB_APP_AND_INTEGRATION.md) | NOT_STARTED | NOT_RUN |

Preservation: immutable revisions, typed edits, scoped selections, candidate lineage/rebase, source-grounded Intelligence, all nine Workshop workflows, review/export/PDF/table-read interfaces and published package boundaries. Phase 01 changes approval APIs deliberately; update callers without preserving a writable bypass.

## Coverage retained from the former layout

These are historical IDs only; new evidence uses the active IDs above. Splitting a requirement does not certify either new phase.

| Former requirements | Active coverage |
| --- | --- |
| F01–F04 (direct approval/canon) | A01–A04 |
| F05 (Core and Run migrations, identity and attempt storage) | A05, R02, R05 |
| F06 (run/plan/policy plus package independence) | A06, R01, R03, R04 |
| E01–E02 (candidate journeys and repairs) | P01, P02, P04 |
| E03–E04 (crashes and workers) | W01–W03, W05–W07, P06 |
| E05 (usage/retry/iteration bounds) | R06, W04, P04 |
| E06 (strategy decision and dispatch controls) | W05, P03 |
| E07 (workflow/architecture preservation) | A06, W06, P07 |
| C01–C07 (control and completion) | C01–C07, now Phase 05 |
| U01–U07 (web and final integration) | U01–U07, now Phase 06 |

## Specification review coverage

| Resolved gap | Active acceptance IDs |
| --- | --- |
| Immutable plan snapshots and bindings | R02, R04, C05 |
| Canonical strategy decision command | P03; extended by C01 |
| Durable approval attempts and stable identities | A04, R05, C04, C06 |
| Shared human approval/decision transition | C01, C07 |
| Distinct creative, malformed-output and transport limits | W04, P04 |
| Transactional active-step leases and precise replay guarantees | W02, W03, W06 |
| Docset preservation without deletion/rename | Handoff protocol; tooling inventory/ZIP tests |