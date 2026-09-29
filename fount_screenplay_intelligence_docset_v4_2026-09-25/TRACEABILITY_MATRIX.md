# Requirement traceability

Agents replace pending source/test/evidence cells as work proceeds. Written tests and executed tests are distinct. Active requirement IDs are defined in the six phase specifications. Phases 01–04 are `COMPLETE` after local runtime QC. Executed evidence for A01–A06 is in [the Phase 01 runtime QC report](handoffs/PHASE_01_RUNTIME_QC_REPORT.md); R01–R06 evidence is in [the Phase 02 runtime QC report](handoffs/PHASE_02_RUNTIME_QC_REPORT.md). Phase 05 is `OFFLINE_IMPLEMENTED` with authored source/tests and local runtime evidence still `NOT_RUN`; Phase 06 remains `NOT_STARTED`. Phase 04 executed evidence is in [the Phase 04 runtime QC report](handoffs/PHASE_04_RUNTIME_QC_REPORT.md). Phase 05 source/test mapping is expanded in [the Phase 05 implementation matrix](handoffs/PHASE_05_IMPLEMENTATION_MATRIX.md).

| Requirement | Phase | Source / tests | Runtime evidence |
| --- | --- | --- | --- |
| A01 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `writing/principal.ex`, `authority.ex`, `review.ex`, `approval.ex`; `persistence.ex`; `writing_persistence_test.exs` human/agent/service audit | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A02 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `persistence.ex` direct-save closure + `save_edit_candidate/4`; `writing_persistence_test.exs`; `continuation_concurrency_test.exs`; Phase 01 source callsite audit | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A03 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `writing/check_set.ex`, `writing/review_gate.ex`; Core unit/integration forged identity/check/report/override/no-partial-write coverage | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A04 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | Stable approval ID/hash in `persistence.ex`; retry/conflict tests in `writing_persistence_test.exs`; PostgreSQL race in `continuation_concurrency_test.exs` | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A05 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | `20260928000000_authorize_canonical_acceptance.exs`; `approval_migration_test.exs` fresh + baseline-upgrade schemas and identity constraints | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| A06 | [01](phases/01_CORE_APPROVAL_SAFETY.md) | Workshop Review/Acceptance/CLI/fake store/examples/docs/tests converted to typed approval; legacy shapes fail closed; no `packages/fount_run` | [PASS](handoffs/PHASE_01_RUNTIME_QC_REPORT.md) |
| R01 | [02](phases/02_RUN_FOUNDATION.md) | Five-library workspace/CI/architecture/build, Core independence and host-free `fount_run` startup | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| R02 | [02](phases/02_RUN_FOUNDATION.md) | Ten-table migration; `integration/storage_constraints_test.exs`, `run_upgrade_test.exs`, `run_foundation_test.exs` fresh and populated Core→Run paths | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| R03 | [02](phases/02_RUN_FOUNDATION.md) | ActorContext, closed Plan/Policy and `start_run`/`get_run`/`list_runs`; Run unit and PostgreSQL tests | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| R04 | [02](phases/02_RUN_FOUNDATION.md) | Fingerprints, append-only plan/policy/events, version pointers; Run unit and PostgreSQL snapshot tests | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| R05 | [02](phases/02_RUN_FOUNDATION.md) | Decision/ApprovalAttempt persistence, distinct-backend race, immutable payload and blocked Core acceptance bridge | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| R06 | [02](phases/02_RUN_FOUNDATION.md) | Budget/Step/Attempt/Delivery identity, lease fields, replay and cross-link PostgreSQL tests | [PASS](handoffs/PHASE_02_RUNTIME_QC_REPORT.md) |
| W01 | [03](phases/03_DURABLE_EXECUTION.md) | `FountRun.Engine` + `WorkshopHandler`; real scripted Workshop durable smoke in `integration/durable_execution_test.exs` | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W02 | [03](phases/03_DURABLE_EXECUTION.md) | `DispatchHook`/provider request reconciliation; known-response reuse and ambiguous-response crash tests | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W03 | [03](phases/03_DURABLE_EXECUTION.md) | run-row claim/reclaim, PostgreSQL-time leases, fencing/heartbeat/domain guard; competing-connection test | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W04 | [03](phases/03_DURABLE_EXECUTION.md) | atomic provider/measurement reservations and durable dispatch/retry counters; cap/idempotency tests | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W05 | [03](phases/03_DURABLE_EXECUTION.md) | persisted control/binding fences, late-result reconciliation and safe `progress/3`; pause test | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W06 | [03](phases/03_DURABLE_EXECUTION.md) | Core/Workshop operation keys + guarded persistence; duplicate session/candidate and stale-domain tests | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| W07 | [03](phases/03_DURABLE_EXECUTION.md) | closed stage registry and explicit unavailable handler/service errors; unit/integration tests | [PASS](handoffs/PHASE_03_RUNTIME_QC_REPORT.md) |
| P01 | [04](phases/04_SCREENPLAY_PIPELINE.md) | `PipelineHandler`, selected-route `WorkshopHandler`; opening/dialogue integration + unit/source tests | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P02 | [04](phases/04_SCREENPLAY_PIPELINE.md) | saved investigation→plan evidence/routes; train/reveal repair integration + unit/source tests | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P03 | [04](phases/04_SCREENPLAY_PIPELINE.md) | `submit_decision/4`, exact transactional strategy resolver; success/replay/conflict/stale integration | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P04 | [04](phases/04_SCREENPLAY_PIPELINE.md) | durable iterate scheduling/cap/accounting; no hidden repair loop; cap integration | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P05 | [04](phases/04_SCREENPLAY_PIPELINE.md) | canonical-base composition, lineage, scope/protected checks/reports; repair integration | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P06 | [04](phases/04_SCREENPLAY_PIPELINE.md) | persisted progress/decisions/idempotent successors + Phase 03 ambiguity regression | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| P07 | [04](phases/04_SCREENPLAY_PIPELINE.md) | nine Workshop workflow validation, closed Phase 04 registry, Core/Phase 03 regressions | [PASS](handoffs/PHASE_04_RUNTIME_QC_REPORT.md) |
| C01 | [05](phases/05_CONTROL_AND_COMPLETION.md) | canonical `DecisionCommand` + durable `ApprovalBridge`; concurrent/replay/stale/principal integration + CLI decision tests; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local PostgreSQL/runtime QC required |
| C02 | [05](phases/05_CONTROL_AND_COMPLETION.md) | `Control` pause/resume/stop + fencing; restart and delayed-callback-after-stop integration; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local PostgreSQL/runtime QC required |
| C03 | [05](phases/05_CONTROL_AND_COMPLETION.md) | `CompletionHandler`, shared Core acceptance bridge, candidate-only/accepted `DeliveryBundle`; provenance/export tests; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local Core/PostgreSQL/runtime QC required |
| C04 | [05](phases/05_CONTROL_AND_COMPLETION.md) | Run/Core check gates, safe callback evidence and fallback lineage; malformed/rejected/fenced tests + retained Core ReviewGate tests; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local Core/PostgreSQL/runtime QC required |
| C05 | [05](phases/05_CONTROL_AND_COMPLETION.md) | plan/policy invalidation; actual Workshop rebase and replacement candidates; fresh check/approval binding tests; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local Workshop/PostgreSQL/runtime QC required |
| C06 | [05](phases/05_CONTROL_AND_COMPLETION.md) | durable callback/review/payload/acceptance recovery; delivery checksum/retry; crash-boundary/reconciliation/artifact tests; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local provider/PostgreSQL/PDF runtime QC required |
| C07 | [05](phases/05_CONTROL_AND_COMPLETION.md) | complete public `FountRun` API, `FountRun.CLI`, `mix fount.run`; parser/exit/direct CLI tests and prior workflow regressions; `scripts/tests/test_control_completion_source.py` | NOT_RUN — local Mix/CLI/runtime QC required |
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
