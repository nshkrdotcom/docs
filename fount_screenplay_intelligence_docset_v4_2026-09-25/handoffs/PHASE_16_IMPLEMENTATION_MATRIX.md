# Phase 16 implementation matrix — Final Integration and Acceptance

**Source-delivery status: OFFLINE_IMPLEMENTED. Runtime QC is NOT_RUN in this environment.**

Phase 16 closes the existing four-package product. It does not add another screenplay model, analysis core, completion path, session path, or canon-acceptance path. The source overlay adds a final audit runner, final architecture/traceability tests, a machine-readable W01–W12/A01–A12 evidence map, and current documentation cleanup.

## Final engineering/publication gates

| Gate | Source implementation/evidence | Source status | Runtime obligation |
|---|---|---|---|
| Exact four-package topology | `scripts/final_acceptance.py`; existing `Runner.Architecture` | PASS source audit | Re-run compiled architecture/xref and full CI |
| Core/Shell purity and dependency ownership | existing `Fount.Intelligence.Runner.Architecture`; new final architecture test | WRITTEN; source audit PASS | Compile and execute architecture test/gate |
| System One boundary | static scan allows native `SystemOneSDK` only in `fount_observe/providers/system_one.ex` | PASS source audit | Resolve real deps; inspect `mix deps.tree`; run Observe regressions |
| Inference/ASM boundary | direct Inference refs remain Workshop-owned; no analysis-layer ASM calls | PASS source audit | Run Workshop generation/preservation suites; inspect resolved deps |
| Probe/superseded package cleanup | exact package-set and production/docs scans | PASS source audit | Re-run repository scans on actual checkout |
| No compatibility generations | current safe data assets scanned for numeric domain generations; no compatibility package introduced | PASS source audit | Inspect domain readers/assets and current public API during QC |
| Cache/provenance/model identity | unchanged Phase-10/11 implementation and tests | PRESERVED | Run full Observe/Intelligence persistence/recompute/cache suites |
| Non-linear temporal/reader behavior | unchanged permanent Phase-11 nonlinear and reader differential regressions | PRESERVED | Execute full Intelligence suite |
| Documentation/current status | root/package README + Workshop final-acceptance guide/example refreshed | WRITTEN | Build ExDoc with warnings as errors and inspect rendered grouping |
| Package/Hex allowlists | package file allowlists source-audited; Workshop docs extras include final guide/example | PASS source audit | Build and inspect all four Hex archives |
| W01–W12 traceability | `acceptance_matrix.json` + existing Phase-12–15 tests | COMPLETE as source map | Execute owning tests and record actual revision/results |
| A01–A12 demonstrations | same matrix records fixture/command/output/assertions with source-delivery NOT_RUN | COMPLETE as source map | Execute applicable deterministic/Pg demos; record results per case |
| Writer presentation/reference outputs | final guide reuses existing compare/read/share/report paths | PRESERVED | Inspect provider-free CLI artifacts and reference renderer outputs |
| Corpus rights/privacy/resource logistics | existing Phase-11/15 contracts unchanged; final audit adds no export authority | PRESERVED | Run security/privacy/resource regressions and inspect outputs |
| Declarative lens/pack safety | existing Phase-8 closed declarative path unchanged | PRESERVED | Run lens/pack validation/security tests |
| Longitudinal resources | existing Phase-10/11 durable usage/preflight calibration unchanged | PRESERVED | Run persistence/resource tests and inspect estimates vs actuals |
| Feature-film scope/nonclaims | final guide and README explicitly reject creative-superiority/audience/marketability claims | WRITTEN | Audit release docs and runtime report wording |
| Live/provider/human evidence | no new automatic call; optional/authorized only | NOT_RUN | Run only if authorized; otherwise record NOT_RUN under D046 |

## W01–W12 ownership audit

| ID | Requirement | Evidence paths | Phase-16 source state |
|---|---|---|---|
| W01 | A writing session, not a diagnostic funnel | `packages/fount_workshop/test/writer_workflows/phase_twelve_discovery_test.exs`<br>`packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | mapped; runtime execution NOT_RUN |
| W02 | An evolving brief and a collection of wanted material | `packages/fount_workshop/test/writer_workflows/phase_twelve_discovery_test.exs` | mapped; runtime execution NOT_RUN |
| W03 | A scene workshop | `packages/fount_workshop/test/writer_workflows/phase_twelve_scene_exploration_test.exs` | mapped; runtime execution NOT_RUN |
| W04 | Cinematic action, sound, space, and rhythm | `packages/fount_workshop/test/writer_workflows/phase_thirteen_pass_profiles_test.exs` | mapped; runtime execution NOT_RUN |
| W05 | Character and relationship rehearsal | `packages/fount_workshop/test/writer_workflows/phase_thirteen_rehearsal_test.exs` | mapped; runtime execution NOT_RUN |
| W06 | Voice protection and language | `packages/fount_workshop/test/writer_workflows/phase_thirteen_voice_test.exs` | mapped; runtime execution NOT_RUN |
| W07 | Research that supports invention without laundering facts | `packages/fount_workshop/test/writer_workflows/phase_fourteen_research_test.exs` | mapped; runtime execution NOT_RUN |
| W08 | Notes become decisions, not obedience | `packages/fount_workshop/test/writer_workflows/phase_fourteen_notes_test.exs` | mapped; runtime execution NOT_RUN |
| W09 | Revision experiments and consequence review | `packages/fount_workshop/test/writer_workflows/phase_fourteen_consequence_test.exs`<br>`packages/fount_workshop/test/writer_workflows/phase_fourteen_rebase_test.exs` | mapped; runtime execution NOT_RUN |
| W10 | Read, hear, and share | `packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | mapped; runtime execution NOT_RUN |
| W11 | Finite help and graceful failure | `packages/fount_workshop/test/writer_workflows/phase_twelve_discovery_test.exs`<br>`packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | mapped; runtime execution NOT_RUN |
| W12 | Measure usefulness without turning creativity into a scoreboard | `packages/fount_workshop/test/writer_workflows/phase_fifteen_usefulness_test.exs` | mapped; runtime execution NOT_RUN |

## A01–A12 demonstration traceability

| Case | Scenario | Requirements | Proposed runtime command | Evidence | Source state |
|---|---|---|---|---|---|
| A01 | Start with an image | W01, W02, W03 | `mix test test/writer_workflows/phase_twelve_a01_demo_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_twelve_a01_demo_test.exs` | NOT_RUN; runtime revision to be recorded |
| A02 | Protect a quiet choice | W04, W06 | `mix test test/writer_workflows/phase_thirteen_pass_profiles_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_thirteen_pass_profiles_test.exs` | NOT_RUN; runtime revision to be recorded |
| A03 | Distinct alternatives, not paraphrases | W03 | `mix test test/writer_workflows/phase_twelve_scene_exploration_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_twelve_scene_exploration_test.exs` | NOT_RUN; runtime revision to be recorded |
| A04 | Preserve voice | W06 | `mix test test/writer_workflows/phase_thirteen_voice_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_thirteen_voice_test.exs` | NOT_RUN; runtime revision to be recorded |
| A05 | Rehearsal is not history | W05 | `mix test test/writer_workflows/phase_thirteen_rehearsal_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_thirteen_rehearsal_test.exs` | NOT_RUN; runtime revision to be recorded |
| A06 | Notes disagree and move | W08 | `mix test test/writer_workflows/phase_fourteen_notes_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fourteen_notes_test.exs` | NOT_RUN; runtime revision to be recorded |
| A07 | Move a reveal | W09 | `mix test test/writer_workflows/phase_fourteen_consequence_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fourteen_consequence_test.exs` | NOT_RUN; runtime revision to be recorded |
| A08 | Facts and fiction | W07 | `mix test test/writer_workflows/phase_fourteen_research_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fourteen_research_test.exs` | NOT_RUN; runtime revision to be recorded |
| A09 | Hear without pretending to measure | W10 | `mix test test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | NOT_RUN; runtime revision to be recorded |
| A10 | Stale candidate and interrupted session | W01, W11 | `mix test test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs`<br>`packages/fount_workshop/integration/phase_fifteen_read_share_resume_test.exs` | NOT_RUN; runtime revision to be recorded |
| A11 | Clean share | W10 | `mix test test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` | NOT_RUN; runtime revision to be recorded |
| A12 | An honest usefulness report | W12 | `mix test test/writer_workflows/phase_fifteen_usefulness_test.exs` | `packages/fount_workshop/test/writer_workflows/phase_fifteen_usefulness_test.exs` | NOT_RUN; runtime revision to be recorded |

## Stop line

Phase 16 is the final implementation phase. This source handoff must not invent a Phase 17 or mark Phase 16 `COMPLETE`. Codex may repair Phase-16 defects and record actual evidence only.
