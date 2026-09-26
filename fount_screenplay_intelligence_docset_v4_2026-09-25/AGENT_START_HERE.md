# Agent Start Here

You are implementing Fount's screenplay-intelligence architecture from source snapshots in an environment that is assumed to lack a usable Elixir runtime.

## Required inputs

You must have:

1. latest Fount Repomix XML;
2. latest `typesafe_api_sdk` Repomix XML;
3. latest `inference` Repomix XML;
4. this complete docset.

## Determine your phase

Read `PROGRESS.md`. Implement the first phase not marked `COMPLETE`.

At initial delivery that is:

> **Phase 1 — Direct Architecture Supersession and `fount_probe` Removal**

Phase 1 is intentionally not split into a compatibility/scaffold subphase.

## Read before coding

For every phase:

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

1. phase overlay ZIP containing new/modified files plus `DELETE_FILES.txt` when needed;
2. updated complete docset ZIP;
3. runtime-QC handoff prompt/report.

Then stop. Runtime QC must complete before the next phase starts.

## Product-validation additions in this docset

Before implementing any phase after Phase 2, read:

- `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md`;
- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`;
- `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`;
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`;
- `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`.

Do not fabricate human validation. When a phase requires a human/domain pilot, produce the evaluation artifacts and handoff instructions, then leave the domain gate pending until actual review occurs.
