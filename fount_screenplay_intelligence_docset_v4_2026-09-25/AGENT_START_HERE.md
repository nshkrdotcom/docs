# Agent Start Here

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

> **Phases 1–7: COMPLETE on engineering QC. Phase 8: OFFLINE_IMPLEMENTED pending runtime QC. Phase 9 remains NOT_STARTED.**

Read `handoffs/PHASE_07_RUNTIME_QC_REPORT.md` and `PROGRESS.md` for the verified Phase-7 state. Fount repair commit `4a1c723` passed engineering and preservation QC. Historical validation debt remains visible; do not claim human validation. Stop before Phase 8.

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

### Current Phase 8 checkpoint

Phase 8 source is `OFFLINE_IMPLEMENTED`, not COMPLETE. Families 9–12, the constrained declarative-lens/genre-pack path, and explicit two-revision analysis are delivered in a strict 37-operation overlay. 52 Phase 1–8 source-contract tests pass offline; Elixir/runtime checks are unrun. Read all `handoffs/PHASE_08_*` records. For the next action, Codex tests/repairs **Phase 8 only** from the user-applied commits and stops before Phase 9.
