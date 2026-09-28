# Agent Start Here

> **Current handoff (2026-09-27): Phase 14 is OFFLINE_IMPLEMENTED.** Phases 1–13 are COMPLETE on recorded engineering QC. The next agent is Codex runtime QC for the user-applied Phase-14 commit: verify, test/repair Phase 14, update evidence, and stop before Phase 15. Do not reapply the overlay.

You are implementing a screenplay-writing tool for humans and agentic collaborators, from source snapshots in an environment assumed to lack a usable Elixir runtime. Read the writer outcome before the technical constraints. Do not substitute architectural activity for useful writing behavior.

## Required inputs

You must have:

1. `fount.xml`;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `agent_session_manager.xml`;
5. `docset.xml`, containing this complete updated docset.

## Determine your phase

Read `PROGRESS.md`. Select the first phase not marked `COMPLETE`. If it is already offline-implemented or awaiting QC/domain review, repair or finish that handoff rather than starting the next phase or rewriting it from scratch.

The current checkpoint is:

> **Phases 1–13: COMPLETE on recorded engineering QC. Phase 14: OFFLINE_IMPLEMENTED; runtime/repair QC pending. Phase 15: NOT_STARTED.**

Read `handoffs/PHASE_13_RUNTIME_QC_REPORT.md` for the verified Phase-13 checkpoint, then `handoffs/PHASE_14_OFFLINE_HANDOFF.md` and `handoffs/PHASE_14_RUNTIME_QC_HANDOFF.md` for the current source delivery. Historical validation debt remains visible; do not claim human validation or unrun Phase-14 runtime results. Do not advance to Phase 15.

## Read before coding

For every phase:

First read documents 32–36: research, writer workflows, collaboration, five-XML handoff (document 35 retains its historical filename), and phase demonstrations. Phases 12–15 have their detailed scope in document 36; Phase 16 is final integration.

1. `00_SCOPE_AND_PRINCIPLES.md`
2. `04_TARGET_PACKAGE_ARCHITECTURE.md`
3. `25_SECOND_ORDER_REVIEW_RESOLUTIONS.md`
4. `DECISIONS.md`
5. current phase in `16_PHASED_IMPLEMENTATION_PLAN.md`
6. `17_AGENT_EXECUTION_PROTOCOL.md`
7. `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`
8. capability/contract docs referenced by the current phase
9. most recent handoff/QC report

For Phase 1 also read:

- `15_FOUNT_PROBE_DIRECT_SUPERSESSION.md`
- `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`

## Hard architecture rules

Final physical packages:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

Phase 1 deletes `fount_probe`; do not create shims.

Do not create the superseded granular analysis packages.

Do not introduce old/new compatibility layers or numeric analytical schema generations.

Keep these distinctions explicit:

```text
presentation order != story-time constraints != causal graph
MeasurementResult != current Observation provenance
measurement semantics != longitudinal dramatic interpretation
```

## Environment limitation

You may inspect and write code, but **do not claim an Elixir/runtime check passed** unless your actual environment unexpectedly provides it and you truly execute it. Standard workflow assumes you cannot.

## Required output

Return:

1. phase overlay ZIP containing complete new/modified files and `handoff/fount-overlay.manifest.json` with exact hashed file operations;
2. updated complete docset ZIP;
3. runtime-QC handoff prompt/report.

Then stop. The user applies the ZIPs and commits; Codex checks that applied state and completes runtime QC before the next phase starts. Do not tell Codex to reapply the overlay.

## Product-validation additions in this docset

Before implementing any phase after Phase 2, read:

- `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md`;
- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`;
- `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`;
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`;
- `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`.

Do not fabricate human validation. Under D046, human/domain pilots are optional and skipped by default. Preserve in-scope evaluation interfaces and any useful study instructions, but do not block engineering completion or later work for absent reviewers. Record skipped studies as validation debt.

### Previous verified Phase 7 checkpoint

Phase 6 is COMPLETE on the runtime evidence recorded in `handoffs/PHASE_06_RUNTIME_QC_REPORT.md`. Phase 7 is `COMPLETE` after runtime QC at Fount `4a1c723`. Audience/Reader Experience, Sequence Movement, Dialogue Interaction, and Setup/Payoff + Motifs are source-written with four closed Observe lenses, existing strict-forward Reader and Temporal/StoryWorld reuse, typed dialogue context validation, non-linear setup/payoff fixtures, playbook wiring, writer packets, and explicit claim limitations. The 305-test workspace CI, 53 Python tests, isolated DB/writer/PDF checks and four package builds passed; see `handoffs/PHASE_07_RUNTIME_QC_REPORT.md`. No human/domain usefulness study was run. At that verified checkpoint Phase 8 was NOT_STARTED; the current source handoff is the Phase-8 checkpoint below.

### Historical Phase 8 source checkpoint

At source delivery, Phase 8 was `OFFLINE_IMPLEMENTED`, not COMPLETE. Families 9–12, the constrained declarative-lens/genre-pack path, and explicit two-revision analysis are delivered in a strict 37-operation overlay. 52 Phase 1–8 source-contract tests pass offline; Elixir/runtime checks are unrun. Read all `handoffs/PHASE_08_*` records. For the next action, Codex tests/repairs **Phase 8 only** from the user-applied commits and stops before Phase 9.

### Verified Phase 8 result

Phase 8 is **COMPLETE** at Fount `f7f4d68` on the full engineering and preservation QC in `handoffs/PHASE_08_RUNTIME_QC_REPORT.md`. The earlier source-delivery `OFFLINE_IMPLEMENTED` statements are historical. Optional human review remains unperformed validation debt under D046. No Phase-9 implementation had begun at that historical checkpoint.

### Phase 9 verified runtime result

Phase 9 is **COMPLETE** at Fount `361a9fd` on the full engineering and preservation QC in `handoffs/PHASE_09_RUNTIME_QC_REPORT.md`. All 19 original paths matched before repair; 325 workspace tests, 73 Python tests, architecture, isolated Core/Workshop PostgreSQL integrations and the deterministic Sandbox/scripted-Inference writer loop passed. The optional human workflow review remains unperformed validation debt under D046. That stop line is historical; Phase 10 has since been source-written.

### Historical Phase 10 source checkpoint

Phase 10 is **OFFLINE_IMPLEMENTED**, not COMPLETE. The 27-operation overlay adds durable analysis runs, L2 reusable MeasurementResults, fresh current-revision Observation persistence, content-addressed safe data assets, recomputation/dependency history, usage/audit export and opt-in Workshop session integration. The required resume/history writer regression is written. Offline Python/overlay checks are recorded in `handoffs/PHASE_10_STATIC_CHECKS.json`; Elixir/Mix/PostgreSQL/runtime gates are unrun. Codex must verify/repair Phase 10 from the user-applied commits and **stop before Phase 11**.
### Phase 10 verified runtime result

Phase 10 is **COMPLETE** at Fount `6d164f6` (tree `9a94735`) on the engineering and preservation QC recorded in `handoffs/PHASE_10_RUNTIME_QC_REPORT.md`. Full CI passed 328 tests; 82 Python tests, disposable PostgreSQL, writer resume/history, compiled architecture, strict quality/docs, PDF/table-read and four package builds passed. The optional human usefulness study was skipped under D046 as validation debt. That stop line is historical; Phase 11 is now source-written.

### Historical Phase 11 source checkpoint

Phase 11 is **OFFLINE_IMPLEMENTED**, not COMPLETE. Read `handoffs/PHASE_11_INPUTS.json`, `PHASE_11_IMPLEMENTATION_MATRIX.md`, `PHASE_11_STATIC_CHECKS.json`, `PHASE_11_PRESERVATION_AUDIT.md`, and `PHASE_11_RUNTIME_QC_HANDOFF.md`. The source delivery adds the evaluation/corpus/calibration/robustness/live-QC layer while preserving current package boundaries. Runtime, PostgreSQL, live-provider and human-study evidence is not claimed. Codex must verify/repair Phase 11 from the user's applied commits and **stop before Phase 12**.

### Current Phase 14 source checkpoint

Phase 14 is **OFFLINE_IMPLEMENTED**, not COMPLETE. The current 18-operation overlay adds research provenance/fiction status, untrusted-source isolation, durable conflicting-note triage with exact anchor states, note-linked writer candidates, actual consequence review, and regressions for stale concurrent edits, Rebase conflicts and exact Undo. Focused Phase-9–14 Python source checks and strict overlay transport checks pass; Elixir/Mix/PostgreSQL/runtime checks are unrun. Codex starts from the user-applied commit, follows `handoffs/PHASE_14_RUNTIME_QC_HANDOFF.md`, repairs actual failures, records executed evidence, and **stops before Phase 15**.