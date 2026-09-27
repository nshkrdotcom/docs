# Agent Start Here

You are implementing a screenplay-writing tool for humans and agentic collaborators, from source snapshots in an environment assumed to lack a usable Elixir runtime. Read the writer outcome before the technical constraints. Do not substitute architectural activity for useful writing behavior.

## Required inputs

You must have:

1. `fount.xml`;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `docset.xml`, containing this complete updated docset.

## Determine your phase

Read `PROGRESS.md`. Select the first phase not marked `COMPLETE`. If it is already offline-implemented or awaiting QC/domain review, repair or finish that handoff rather than starting the next phase or rewriting it from scratch.

The current checkpoint is:

> **Phase 3 - Story-World Pure Core: COMPLETE under explicit human-review validation-debt override. Phase 4 is next and NOT_STARTED.**

Read `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`, decision D045, and `PROGRESS.md` for the verified Phase-3 source and visible Level-A debt. The next implementation pass may begin Phase 4 from Fount commit `60f989bcb9935b28519c908f3cd123ad6efe172f`; this override pass does not implement it. Phases 1 and 2 remain COMPLETE under their recorded QC evidence.

## Read before coding

For every phase:

First read documents 32–36: research, writer workflows, collaboration, four-XML handoff, and phase demonstrations. Phases 12–15 have their detailed scope in document 36; Phase 16 is final integration.

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

Do not fabricate human validation. When a phase requires a human/domain pilot, produce the evaluation artifacts and handoff instructions, then leave the domain gate pending until actual review occurs.

### Current Phase 3 checkpoint

Phase 2 is `COMPLETE` after the runtime QC recorded in `handoffs/PHASE_02_RUNTIME_QC_REPORT.md`. Phase 3 engineering QC passed at Fount `60f989bcb9935b28519c908f3cd123ad6efe172f`; see `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`. The user explicitly deferred Phase-3 Level-A human review as visible validation debt in D045, so Phase 3 is `COMPLETE` under that exception. Phase 4 is eligible to begin in the next implementation pass; its own requirements and gates still apply.
