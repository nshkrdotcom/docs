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

> **Phases 1–4: COMPLETE. Phase 4 passed engineering QC at Fount `cfde46c`; its optional first-reader pilot was skipped under D046 as visible validation debt. Phase 5 is NOT_STARTED.**

Read `handoffs/PHASE_04_OFFLINE_HANDOFF.md`, `handoffs/PHASE_04_RUNTIME_QC_HANDOFF.md`, and `PROGRESS.md`. The user applies/commits the Phase-4 artifacts first; Codex then verifies that applied state, runs/repairs Phase 4, records runtime evidence, and stops. Phase 3 remains COMPLETE under D045 with its separate Level-A validation debt.

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

Do not fabricate human validation. Under D046, human/domain pilots are optional and skipped by default. Preserve in-scope evaluation interfaces and any useful study instructions, but do not block engineering completion or later work for absent reviewers. Record skipped studies as validation debt.

### Current Phase 4 checkpoint

Phase 4 runtime QC passed at Fount `cfde46c` and the phase is `COMPLETE` under D046. Its first-reader study was skipped and remains visible validation debt. The next implementation pass begins with Phase 5 from this verified source; do not infer human-calibrated Reader claims from the deterministic tests.