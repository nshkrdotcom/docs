# Open Questions and Deferred Decisions

These items are intentionally deferred because they require current source/runtime evidence. They do not reopen the settled four-package architecture.

## 1. Exact module granularity inside `fount_observe`

Package responsibility is fixed. Phase 1/2 may choose exact internal module names after inspecting current conventions.

Constraint: stable provider-neutral contracts must remain leaf-like and provider adapters must not leak into Intelligence.

## 2. Existing `Fount.Semantics.*` relationship

Core already contains primitive semantic structs. Phase 3 must inspect their actual usage and choose whether Intelligence:

- consumes them directly where suitable;
- wraps them in richer `Fount.Intelligence.StoryWorld.*` records;
- or uses conversion helpers.

Constraint: model-derived interpretation does not become canonical IR merely to reuse a type.

## 3. SystemOneSDK exact adapter calls

The Observe provider boundary is fixed; concrete calls are determined from the supplied `system_one_sdk` snapshot.

Inspect:

- client construction;
- endpoint/key/model configuration;
- question/request constructors;
- batch/stream support;
- response types;
- test adapter facilities;
- timeout/error semantics.

The existing Fount Jev path already uses `SystemOneSDK`. Preserve its useful semantics and verify calls against the supplied source. Document 34 records the inspected facade and answer distinctions; this is not a request to replace the SDK with a raw provider client.

## 4. Architecture enforcement implementation

Mechanical purity enforcement is mandatory from Phase 1. The enforcement stack is settled conceptually: nested logical boundaries, compiled dependency analysis, targeted forbidden-MFA checks, and deterministic replay/property tests.

Deferred only:

- exact `boundary`/custom-task composition compatible with the actual workspace;
- whether compiled dependency inspection uses xref JSON, BEAM import chunks, or both;
- exact forbidden-MFA list after runtime inspection of false positives.

Runtime QC must prove the chosen mechanism works. No single source grep or tiny AST scanner may be treated as sufficient proof.

## 5. Durable L2 persistence schema

Ownership is fixed: Intelligence shell/host persistence, not Observe and not pure core.

Exact Ecto tables/schemas wait until Phase 10 can inspect current persistence patterns.

No old Probe data migration compatibility is required.

## 6. L1 cache implementation details

Observe owns a DB-free pluggable ephemeral MeasurementResult cache. ETS is the recommended default. Exact process ownership/eviction policy may follow workspace conventions.

Correctness never depends on L1 persistence. Cache entries are immutable measurement results; edits do not require semantic deletion.

Deferred operational choices include LRU/TTL/quota policy and whether project/studio privacy namespaces map to separate tables/processes/key prefixes.

## 7. Sequence segmentation

Writer-authored sections/outlines are first-class. Inferred sequence boundaries are derived interpretations.

Deferred:

- heuristic versus model-assisted segmentation;
- whether multiple candidate segmentations ship initially;
- UI/export representation.

The capability must not assume a universal act/sequence formula.

## 8. Beat segmentation

Beat representation is required; one universal beat detector is not.

Phase 3/4 may start with explicit/source-grounded beat hypotheses and later add competing model-assisted segmentations.

## 9. Human reader corpus acquisition

The operational model is settled in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`: rights-cleared corpus lanes, corpus manifests, provider-export policy, early pilots, first-reader checkpoints, and disagreement preservation.

Still unresolved until execution: which exact scripts, licensors, writers/readers, storage service, and recruitment channels will be used. Those are procurement/staffing decisions, not reasons to postpone all human evaluation until Phase 11.

Do not claim population-level or human-valid prediction of holistic engagement before the corresponding data exists.

## 10. Theme/meaning automation depth

Theme capability is required, but generative synthesis depth remains flexible.

Prefer evidence-linked repeated value conflicts/choices/motifs and competing interpretations over one authoritative theme statement.

## 11. Genre pack first shipped set

The extensibility mechanism is settled by `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.

Mystery, thriller, horror, romance, comedy, and action remain useful initial candidates, but exact shipped breadth may follow quality/corpus readiness. No pack becomes a universal rule set, and no pack is required merely to cover every genre label.

## 12. Durable storage of raw provider distributions

Observe must preserve raw normalized distributions in memory/result contracts. Whether every distribution is persisted durably may depend on privacy/storage policy. Do not discard them before Intelligence has the choice.

## 13. Replacement CLI/task surface

There is no Probe CLI compatibility obligation. Phase 1/12 should preserve useful workflows under sensible current commands only.

Open question: whether a low-level `fount.observe` task is worth shipping versus keeping Observe debugging in examples/tests.

## 14. Package publication timing

The four packages should remain packageable/documentable. Exact Hex publication order and release metadata are operational decisions after QC stabilizes.

This does not justify compatibility-version code inside domain APIs/assets.

## 15. UI/visualization

The program remains headless/domain-first, but writer-facing semantics are **not** deferred. `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md` is required and a deterministic reference renderer is part of implementation/evaluation.

Timeline graphs, reader-question views, relationship matrices, evidence explorers, rich revision panels, desktop/editor integrations, and polished chat surfaces remain future UI choices over that contract.
## 16. Story-time constraint implementation depth

The ontology is settled: presentation order, partial story-time constraints, narrative/reality scope, and causality are distinct.

Deferred implementation details:

- the minimal qualitative relation set actually needed by fixtures;
- constraint propagation algorithm and connected-subgraph query strategy;
- whether any restricted interval-algebra helper dependency is justified;
- materialization/caching strategy for definitely ordered subsets.

Constraint: do not promise a complete arbitrary interval solver and do not reduce continuity to topological sorting.

## 17. Model fingerprint stability source

Observe must record the strongest stable provider/model identity available and enforce durable-reuse policy for unstable aliases.

Deferred to SDK/runtime inspection:

- whether `system_one_sdk` exposes immutable model revision/artifact identifiers;
- whether endpoint/provider metadata belongs in the semantic model fingerprint;
- whether mutable aliases are allowed for L1-only reuse or disable caching entirely.

Do not invent weights digests that the provider cannot expose.

## 18. Feature-screenplay scope

Not open. This program targets feature-film screenplays. Television/series mechanics are outside scope unless a future explicit product program adds them. See `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`.

## 19. Human-validation staffing/procurement

The validation process is specified, but the exact named reviewers/readers, compensation, script licenses, NDAs, and storage vendor cannot be fixed by architecture. Before each human-gated phase begins, record the concrete resource plan in the phase handoff/progress artifacts.