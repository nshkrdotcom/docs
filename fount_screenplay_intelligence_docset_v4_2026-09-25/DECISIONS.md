# Product and Implementation Decision Ledger

Future implementation agents must not silently reverse approved decisions. Record genuine product, workflow, or implementation decisions when user direction, research, or source/runtime evidence requires a correction.

## D001 — Four physical packages

**Decision:** The architecture is `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`.

**Reason:** These correspond to durable responsibilities: canonical authoring truth, measurement, dramatic interpretation/investigation, and creative revision.

**Status:** Approved.

## D002 — `fount_probe` is directly superseded and removed in Phase 1

**Decision:** Reimplement/subsume valuable behavior, update Workshop, and delete Probe in the same phase.

**No:** wrappers, shims, dual paths, deprecation period, old data migration program.

**Status:** Approved.

## D003 — Logical layers stay inside Intelligence

**Decision:** StoryWorld, Temporal/Reader, Diagnosis, and Playbooks remain distinct internal namespaces/layers inside one `fount_intelligence` application.

**Reason:** Conceptual separation is valuable; separate Mix packages created package-sprawl/common-closure problems.

**Status:** Approved.

## D004 — Functional core / imperative shell is mechanically enforced

**Decision:** Pure Intelligence namespaces cannot call Observe acquisition, persistence, network, environment, filesystem, wall clock, randomness, or hidden mutable services for semantic behavior.

**Reason:** Collapsing dramatics/playbooks physically is safe only with a hard architecture gate.

**Status:** Approved.

## D005 — Measurement versus interpretation is the durable boundary

**Decision:** `fount_observe` measures; `fount_intelligence` interprets.

**Reason:** This remains valid for hosted, on-prem, local GPU, deterministic, human, or cached measurement producers. Deployment topology is not the package boundary.

**Status:** Approved.

## D006 — Observe owns leaf measurement contracts

**Decision:** Provider-neutral `MeasurementResult`, `Observation`, distribution, evidence, target, context-primitive, and error value contracts are leaf modules in `fount_observe`. Intelligence pure code may depend only on an explicit allowlist of these values and cannot call Observe execution.

**Reason:** The four-package graph removes the need for a contracts-only package while preserving normalized measurement types.

**Status:** Approved.

## D007 — Context inversion uses typed neutral primitives + closed lens-declared slots

**Decision:** Intelligence-derived context passed back to Observe uses an Observe-owned serializable `%Fount.Observe.Context{}` envelope containing neutral measurement primitives. Each lens/projection declares the accepted/required slot names and value shapes. Runtime validation is mandatory.

**No:** passing `Fount.Intelligence.*` structs; unrestricted generic attribute bags; arbitrary unvalidated maps.

**Reason:** This preserves one-way dependency, refactor ergonomics, and runtime integrity without mirroring Intelligence's entire domain model inside Observe.

**Status:** Approved.

## D008 — L1/L2 storage split

**Decision:** Observe owns DB-free L1 MeasurementResult caching. Intelligence shell/host owns durable L2 reuse/persistence when configured.

**Status:** Approved.

## D009 — First-class Observe Sandbox

**Decision:** Observe ships a deterministic fixture/Sandbox adapter used by normal Intelligence playbook tests.

**Status:** Approved.

## D010 — Canonical and derived state remain separate

**Decision:** Model-backed/interpreted data never silently mutates canonical screenplay truth.

**Status:** Approved.

## D011 — Inference remains on creative side

**Decision:** `fount_workshop` uses `inference` for candidate/page generation. Pure Intelligence does not generate screenplay pages.

**Status:** Approved.

## D012 — Reader state follows presentation order only

**Decision:** Reader state at discourse point N may use only material presented at or before N. Property tests enforce this.

**Reason:** Reader experience is presentation-relative even when story events are non-chronological.

**Status:** Approved.

## D013 — No universal screenplay-quality score

**Decision:** Use observations, trajectories, diagnoses, comparisons, and human holistic responses; do not manufacture one global quality number.

**Status:** Approved.

## D014 — Observation, diagnosis, strategy, candidate are distinct

**Decision:** Preserve these as separate data/behavior levels and lineage records.

**Status:** Approved.

## D015 — Content hashes + output-contract digests, not compatibility versions

**Decision:** Analytical assets use stable logical IDs + content hashes. Normalized output contracts use stable logical contract IDs + canonical data-shape digests. Do not introduce numeric schema generations, `.v1`/`.v2` domain names, old-contract readers, or compatibility decoders.

**Reason:** The repository is greenfield. When a contract shape changes, stale derived observations fail closed and are reacquired/recomputed. Hashes identify exact semantics; compatibility code has no user to protect.

**Clarification:** Normal Mix/Hex package release metadata may follow ecosystem requirements if publishing occurs.

**Status:** Approved.

## D016 — Code-defined executable primitives

**Decision:** Assets/models select only registered sensors/projections/playbooks/evaluators. No arbitrary module/function/expression execution.

**Status:** Approved.

## D017 — Feature-screenplay first

**Decision:** Optimize capability/evaluation semantics for feature films. TV/season mechanics are outside this program unless explicitly added later.

**Status:** Approved.

## D018 — Craft theories are optional lens packs

**Decision:** McKee/Mamet/Johnstone/Hitchcock/Truby/etc. may inform named optional lenses; none becomes hidden law.

**Status:** Approved.

## D019 — Preserve functionality, not Probe API/package shape

**Decision:** Every current valuable Probe behavior and Workshop writer-facing workflow must be reimplemented/subsumed or explicitly superseded by stronger behavior. API compatibility is not a goal.

**Status:** Approved.

## D020 — Presentation order, story time, and causality are separate

**Decision:** Intelligence represents:

1. a total canonical presentation/discourse order;
2. a partial story-time constraint graph over events/intervals;
3. an independent causal graph.

**No:** one scene-ordinal timeline for all semantics; forced total chronology; causality inferred merely from temporal precedence.

**Status:** Approved.

## D021 — Story time preserves uncertainty and scope

**Decision:** Story-time relations may remain unknown/ambiguous and are qualified by narrative/reality scope when needed (base story, recollection, dream, hypothetical/alternate/contested material).

**Reason:** Non-linear and unreliable screenplays cannot always be reduced to one exact chronological ordering.

**Status:** Approved.

## D022 — No mandatory general interval solver

**Decision:** Implement practical evidence-backed temporal constraint propagation/checking for screenplay questions. Do not promise a complete solver for arbitrary interval networks or reduce continuity to a simple topological sort.

**Status:** Approved.

## D023 — Reusable MeasurementResult is separate from revision-bound Observation

**Decision:** Caches reuse immutable MeasurementResults. Every current request materializes an Observation against current revision/target/evidence/provenance.

**Reason:** Cross-revision result reuse must never carry stale source identity.

**Status:** Approved.

## D024 — Cache identity hashes effective semantic computation, not revision provenance

**Decision:** Reuse keys derive from normalized semantic measurement specification/input/model identity plus privacy namespace. Revision IDs and other provenance-only IDs are excluded unless the measurement intentionally sees them.

**Reason:** This enables correct cross-revision reuse while still missing naturally when upstream context changes.

**Status:** Approved.

## D025 — Model identity stability controls durable reuse

**Decision:** Use the strongest provider/model fingerprint actually available. Durable reuse may be disabled/limited for mutable aliases or unknown model identity. Do not invent unavailable weights digests.

**Status:** Approved.

## D026 — Derived analysis uses recomputation frontiers; cache does not use semantic deletion

**Decision:** Immutable cached MeasurementResults are not deleted merely because a screenplay changes. LRU/TTL/quota are storage policies. StoryWorld/Reader/diagnosis/report dependency frontiers determine what must recompute.

**Status:** Approved.

## D027 — Purity gate uses layered enforcement from Phase 1

**Decision:** The Phase-1 architecture gate combines the simplest reliable set of:

- nested module boundaries for Core -> Shell direction;
- compiler/xref/BEAM dependency analysis;
- targeted forbidden-MFA checks for hidden side effects/nondeterminism;
- deterministic replay/property tests.

**No:** deferring enforcement until later phases; claiming a tiny AST denylist alone proves purity; globally stopping dependency applications as the main proof.

**Status:** Approved.

## D028 — Character epistemics have diegetic and reader-relative views

**Decision:** Keep distinct (a) what a character actually knows/believes at an event/story-time scope and (b) what the reader currently thinks that character knows/believes at a presentation checkpoint.

**Status:** Approved.

## D029 — Writer-facing presentation contract is mandatory even though the system is headless

**Decision:** Analytical results must conform to `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md` and have a deterministic reference renderer. A polished GUI is not required by this program.

**Status:** Approved.

## D030 — Human/domain validation begins before Phase 11 and is separately resourced

**Decision:** Small exploratory human/domain pilots begin when StoryWorld, Reader, and Diagnosis capabilities first appear. Phase 11 scales calibration/robustness rather than introducing human evaluation for the first time.

**Reason:** Runtime correctness cannot establish dramaturgical validity or writer usefulness, and early validation has real staffing/rights/logistics costs that must be explicit.

**Status:** Approved.

## D031 — Declarative extensibility is constrained capability composition, not arbitrary execution

**Decision:** Writer questions are open; safe project/studio packs and compatible declarative lenses can be installed without code changes only within registered projection/output/execution capabilities and host resource/privacy policy.

**No:** arbitrary module/function/tool execution, provider/credential definitions, arbitrary iteration, or declarative privilege escalation.

**Status:** Approved.

## D032 — Resource economics are longitudinal

**Decision:** Cost/compute accounting models repeated rewrite usage, marginal reuse, hosted monetary rates where configured, and local/on-prem compute constraints. One-shot coverage pricing is not the governing comparison.

**Status:** Approved.

## D033 — Feature-film scope is intentional

**Decision:** This program targets feature-film screenplays. TV/episodic/series requirements are outside scope and must not add a future-compatibility tax to the feature architecture.

**Status:** Approved.

## D034 — External benchmarks are evaluation references, not evidence that Fount works

**Decision:** STAGE and other external research may inform task/evaluation design or supply separately licensed comparisons. Their results must not be cited as validation of Fount's unbuilt or unevaluated implementation.

**Status:** Approved.

## D035 — Screenplay writing is the governing product objective

**Decision:** Discovery, drafting, cinematic revision, voice, rehearsal, notes, and finishing are first-class workflows. Analysis supports writing decisions rather than functioning as the product's primary funnel. Human-only use remains valuable. No distributed-system requirement follows from choosing Elixir.

**Basis:** User brief and research synthesis in documents 32–33. Existing engineering decisions remain supporting constraints.

**Status:** Adopted for this docset revision.

## D036 — Four XML inputs and user-applied overlays

**Decision:** Each source-writing pass receives exactly fount.xml, system_one_sdk.xml, inference.xml, and docset.xml. It returns a strict hashed Fount overlay, complete updated docset, and QC handoff. The user applies and commits; Codex verifies and repairs that state without reapplying.

**Basis:** User workflow and the actual Fount overlay applier; document 35.

**Status:** Adopted for this docset revision.

## D037 — Product completion phases and evidence

**Decision:** Preserve Phases 1–11 and add Phases 12–15 for complete writer workflows. Final acceptance moves to Phase 16. Every phase includes a writer demonstration. Creative usefulness, human response, engineering tests, and live provider results remain distinct evidence.

**Basis:** Documents 33 and 36. A specification is not evidence that the future implementation works.

**Status:** Adopted for this docset revision.

## D038 — Use the supplied SystemOneSDK facade

**Decision:** The dependency snapshot is system_one_sdk, with actual question preparation, evaluation, answer, and provider contracts. Preserve working Jev semantics; do not invent a fifth SDK input or replace the facade with raw hosted-provider calls.

**Basis:** Source inspection recorded in document 34.

**Status:** Adopted for this docset revision.

## Phase 1 source decisions - 2026-09-26

**Runtime QC addendum:** The actual checkout retained all 86 manifest-deleted Probe files with the documented terminal-LF byte variant, plus one excluded tracked SVG and ignored generated output. QC removed the reviewed tracked package files and preserved ignored output outside the repository. Old BEAM products were likewise preserved outside the repository before rerunning the compiled gate. The repository's new package-build mode emits versioned dependency metadata while ordinary workspace builds retain local paths. No Fount workspace package was published. Core 0.9.1, Codex SDK 0.21.1, ASM 0.17.1 and Inference 0.5.0 were separately tested with real Codex examples and then published and pushed as user-authorized dependency repairs. SystemOneSDK 0.6.0 remains a checked-out source dependency. Hex 0.5.0 was matched byte-for-byte to Git `382c959`; a local plain `v0.5.0` tag and `fount-phase1-sdk` branch were created from that identity. A live Luna bridge completed, while live alternatives returned a timeout and uninspected citations, which Fount rejected; the user explicitly allowed Luna-output validation debt. No Fount package or SDK 0.6.0 release was published. See `handoffs/PHASE_01_RUNTIME_QC_REPORT.md`.

1. **Actual provider API:** the supplied SystemOneSDK package is 0.6.0, not the older Fount lock's 0.5.0. Observe uses the real public `new_client`, `noul`, `choice`, `score`, `prepare` and `evaluate_stream` APIs. Its path override permits QC against the supplied source without claiming Hex availability. Actual dependency/lock reconciliation remains runtime work.
2. **Canonical helpers:** existing selection, exact evidence validation, inventory and exact search are substrate concerns and now live in `fount`. Measurement projections remain Observe-owned.
3. **Mixed helpers split by responsibility:** proposal completion and measured PDF layout are Workshop-owned services explicitly injected into Intelligence's acquisition/playbook shell. Native Inference clients/types do not become Intelligence contracts. Native SystemOneSDK types terminate in the Observe adapter.
4. **Pure baseline, not future scaffolding:** existing record validation, reveal reduction and decision interpretation occupy StoryWorld/Reader/Capabilities. No full later-phase temporal/diagnosis engine or compatibility wrapper was introduced.
5. **Analytical identity:** closed playbook requests and logical result/lens IDs with content digests replace superseded analytical request/report/profile generations. Existing canonical interchange and writing-proposal contracts are preserved, not gratuitously renumbered.
6. **Transport evidence limitation:** these attachments do not contain authenticated seals. Decoded-body preimage checks remain strict; actual checkout identity is explicitly unverified. This does not waive document 35's sealing requirement for future inputs. Unseen excluded files require actual checkout inspection; no guessed deletions are authorized.
7. **Empty directories:** the supplied full-file applier leaves directories. A separate, tested post-apply helper removes only empty ancestors of declared deletions; it cannot remove unknown content.
