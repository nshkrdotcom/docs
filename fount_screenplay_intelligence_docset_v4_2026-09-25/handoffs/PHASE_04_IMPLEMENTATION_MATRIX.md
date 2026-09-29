# Phase 04 implementation matrix — Screenplay pipeline

Status: **COMPLETE** after executed local Elixir/PostgreSQL QC. See [the Phase 04 runtime QC report](PHASE_04_RUNTIME_QC_REPORT.md).

| ID | Delivered source | Authored tests / required runtime proof | Runtime status |
| --- | --- | --- | --- |
| P01 | `FountRun.PipelineHandler` intake→investigate→plan→check/iterate; `WorkshopHandler` selected-route write; `Session.prepare_only/4` + `plan_only/4` | `integration/screenplay_pipeline_test.exs`: brief→opening and selected-scene dialogue journeys, exact IDs/checks/reports, canon unchanged; unit/source P01 | PASS |
| P02 | saved investigation preparation/reports/uncertainty; investigation routes seeded into page-free planning | reveal/train fixture in `integration/screenplay_pipeline_test.exs` proves three routes, visible uncertainty, protected train beat and targeted consequence repair; source P02 | PASS |
| P03 | production `FountRun.submit_decision/4` → transactional `Persistence.submit_strategy_decision/4`; exact actor/context/plan/policy/base/choice binding and replay | integration success/replay/competing/wrong-actor/stale-context/stale-plan/stale-policy cases; unit/source P03 | PASS |
| P04 | each failed required check schedules durable `iterate`; Run limits/retry counters preserved; Workshop inner repair disabled | integration repair accounting + hard cap/partial checkpoint; Phase 03 budget/retry regressions; unit/source P04 | PASS |
| P05 | candidates compile on immutable canonical base; parent lineage/report IDs retained; scope/protected-material required checks | train repair integration proves parent/base/protected beat/report lineage/full saved candidate while canon stays fixed; unit/source P05 | PASS |
| P06 | persisted successor idempotency, decisions/provider usage exposed through `progress/3`; Phase 03 engine/reconciliation retained | restart/progress/replay assertions in Phase 04 integration plus `integration/durable_execution_test.exs` ambiguity/recovery regression; unit/source P06 | PASS |
| P07 | closed Phase 04 registry supports intake/investigate/plan/write/check/iterate; all nine Workshop request workflows remain validated; decide/deliver absent | nine-workflow integration validation, updated Phase 03 unavailable-stage regression, existing Core/Workshop suites required in local QC; unit/source P07 | PASS |

No Phase 05 acceptance, delivery, final-decision resolution or web UI was implemented.
