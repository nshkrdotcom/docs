# Fount Screenplay Intelligence — Implementation Docset

Fount is a tool for discovering, writing, revising, and finishing feature screenplays—with humans and agents working on the same creative material. Its purpose is better writing decisions, not a screenplay score or an architecture showcase. Elixir is the chosen medium for the joy of building with it.

Every ChatGPT.com pass receives exactly five fresh XML attachments:

1. `fount.xml`;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `agent_session_manager.xml`;
5. `docset.xml` containing this complete, progressively updated docset.

ChatGPT.com writes the current phase without claiming unrun Elixir checks and returns a Fount overlay ZIP, complete updated docset ZIP, and handoff. The user applies and commits the changes. Codex verifies that applied state, runs and repairs the phase, and updates the docset. The next pass starts only from the QC-corrected baseline. Document 35 specifies the exact manifest and responsibilities.

## Start with the writing experience

Read `32_SCREENPLAY_FIRST_RESEARCH_EXPANSION.md`, `33_WRITER_WORKFLOWS_AND_CREATIVE_CONTRACT.md`, and `34_HUMAN_JEV_AND_LLM_COLLABORATION.md` before treating the architecture below as a product brief. The new research complements the earlier reader/notes work with discovery, cinematic action and sound, voice, rehearsal, and useful alternatives.

`36_PRODUCT_PHASES_AND_ACCEPTANCE_SCENARIOS.md` supplies a writer demonstration for every phase and detailed Phases 12–15. Final integration is Phase 16. Phases 1–10 are COMPLETE on engineering QC; Phase 11 is OFFLINE_IMPLEMENTED and awaits runtime/live QC; Phase 12 is NOT_STARTED. The verified Phase-10 checkpoint is in `handoffs/PHASE_10_RUNTIME_QC_REPORT.md`, and the current Phase-11 source delivery is in `handoffs/PHASE_11_OFFLINE_HANDOFF.md`. Phase 3 Level-A, Phase 4 first-reader, Phase 5 usefulness, and later optional human studies remain visible validation debt; D046 makes human reviews optional and nonblocking.

Success means a writer can arrive with an image, a scene, or a difficult note; explore real choices; preserve what matters; see consequences; and choose what becomes the draft. No compulsory outline, universal conflict theory, or simulated audience verdict. Human-only writing remains useful without provider credentials.

The retained engineering references support those workflows. They do not authorize distributed-system features, new platforms, or architectural elaboration unrelated to a writer outcome.

## Target physical architecture

```text
                         fount
          canonical screenplay substrate / authoring truth
                         |
                         v
                   fount_observe
              measurement and acquisition
                         |
                         v
                fount_intelligence
       pure dramatic reasoning + playbook shell
                         |
                         v
                  fount_workshop
             creative generation / revision
```

`fount_workshop` also depends directly on `fount` for canonical screenplay operations and on `inference` for generation.

`fount_probe` is **directly superseded and deleted in Phase 1**. There is no compatibility layer, legacy-data program, or slow cutover.

## Logical layers inside Intelligence

```text
PURE CORE
  StoryWorld
  Temporal / qualified state views
  Reader
  Diagnosis
  Capability evaluators

IMPERATIVE SHELL
  Acquisition
  Playbooks
  Runner
  Persistence
  Reporting
```

The pure/shell boundary is mechanically enforced; it is not merely a convention.

## Current core corrections

The second-order architecture review tightened five areas without changing Phase 1 sequencing or the four-package topology.

### Presentation time is not story time

Intelligence keeps separate:

```text
presentation/discourse order  -> total canonical source order, Reader fold
story-time constraints        -> partial event/interval relation graph
causality                      -> independent causal graph
```

Non-linear screenplays are not forced into a fabricated chronological array.

### Measurement contracts are content-identifiable without compatibility versions

Observe uses:

```text
stable logical lens/contract IDs
+
exact content/data-shape digests
```

When the normalized output contract changes, stale derived observations/fixtures fail closed and are reacquired/regenerated. No numeric schema generations or old-contract readers are added.

### Context inversion is typed but not domain-mirrored

Intelligence converts rich dramatic state into Observe-owned neutral measurement primitives inside a serializable `%Fount.Observe.Context{}`. Each lens declares closed context slots and runtime validation. No Intelligence structs cross into Observe, and there is no unrestricted attributes junk drawer.

### Cached computation is not screenplay provenance

Observe/Intelligence distinguish:

```text
MeasurementResult  -> immutable reusable computation result
Observation        -> current revision/target/evidence binding of that result
```

A cross-revision cache hit reuses the result but creates a fresh current Observation.

### Purity uses layered enforcement

The Phase-1 architecture gate combines the simplest reliable set of:

- nested logical boundaries;
- compiler/xref/BEAM dependency analysis;
- targeted forbidden-MFA checks;
- deterministic replay/property tests.

No single tiny AST scan is treated as proof of purity.

See `25_SECOND_ORDER_REVIEW_RESOLUTIONS.md`.

## Writer-product corrections added in this revision

The third-order usefulness review adds five product-level contracts without changing the four-package architecture or Phase 1:

- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md` — stable writer-facing semantic output independent of UI;
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md` — early domain pilots, rights/privacy/recruiting logistics, and Phase-11 scale-up;
- `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md` — declarative customization without arbitrary execution or unmetered provider work;
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md` — per-run/revision/project compute and cost transparency;
- `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md` — feature-film-only scope is explicit and intentional.

`26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md` records the Socratic review that produced these decisions.

## Core principles

1. **Canonical screenplay truth stays in `fount`.**
2. **Measurement and interpretation are different responsibilities.** Observe measures; Intelligence reasons over measurements.
3. **Provider topology is not architecture.** Hosted, on-prem, local GPU, deterministic, human, or cached producers normalize through Observe.
4. **Pure reasoning is replayable.** StoryWorld/Reader/Diagnosis logic runs from explicit frozen values without providers or a database.
5. **Reader experience is strict-forward in presentation order.** Future scenes cannot leak into earlier reader state.
6. **Story time is partial and evidence-backed.** Unknown chronology remains unknown.
7. **Causality is not temporal precedence.** Keep causal relations separate from story-time and presentation order.
8. **Observation != diagnosis != strategy != candidate.**
9. **Notes are symptoms/evidence, not automatically correct fixes.**
10. **No universal screenplay-quality score.** Preserve multidimensional/human judgment.
11. **Craft theories are optional lenses, not hidden law.**
12. **Analytical assets/contracts are content-addressed.** Use stable logical IDs + exact hashes; do not build compatibility-version schemes.
13. **No arbitrary executable workflows from data/model output.** Registries are closed.
14. **Writer remains authority.** Workshop proposes; Fount acceptance controls canon.
15. **This is greenfield.** No Probe shims, old schema readers, dual paths, or old-data migrations.
16. **Preserve functionality, not accidental package shape.** `23_FUNCTIONALITY_PRESERVATION_AUDIT.md` is blocking.
17. **Headless still has a writer-facing contract.** Evidence, diagnosis, uncertainty, intent, strategies, and revision effects have stable semantics independent of UI.
18. **Human validation is not runtime QC.** Product/domain pilots begin before scaled Phase-11 calibration.
19. **Safe configuration is capability-limited.** Declarative packs/lenses may customize questions and salience without gaining arbitrary code/tool/resource authority.
20. **Resource cost is longitudinal.** Measure repeated rewrite usage and incremental reuse, not just one analysis pass.

## Why the redesign exists

The current Probe package proved valuable ideas—closed tools, exact evidence, Jev batching, knowledge/dependency/continuity analysis, comparison/ablation, structured investigations—but accumulated measurement, interpretation, orchestration, reporting, and some generative helper concerns under one abstraction.

The final architecture separates:

```text
what the writer authored      -> fount
what can be measured          -> fount_observe
what that evidence means      -> fount_intelligence
what pages/edits to audition  -> fount_workshop
```

StoryWorld, temporal/story-time reasoning, Reader, Diagnosis, and Playbooks are namespaces inside Intelligence rather than separate Mix applications.

## Research documents

The first three deep documents define product behavior, not optional background:

- `01_INDUSTRY_EVALUATION_AND_READER_CRITERIA.md` — broad screenplay-evaluation dimensions without pretending to automate taste.
- `02_EMERGENT_READER_EXPERIENCE_OVER_TIME.md` — anticipation, escalation, unresolved questions, relationship/character trajectories, payoff, suspense/curiosity/surprise, comprehension, and forward pull.
- `03_NOTES_DIAGNOSIS_AND_REVISION_PHILOSOPHY.md` — reaction vs cause vs proposed fix, competing diagnoses, protected strengths, and writer-controlled treatment.

## Recommended implementation reading order

1. `AGENT_START_HERE.md`
2. `00_SCOPE_AND_PRINCIPLES.md`
3. `04_TARGET_PACKAGE_ARCHITECTURE.md`
4. `25_SECOND_ORDER_REVIEW_RESOLUTIONS.md`
5. `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md`
6. `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`
7. `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`
8. `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`
9. `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`
10. `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`
11. `DECISIONS.md`
12. `05_ANALYSIS_CONTRACTS_AND_DATA_MODEL.md`
13. `06_SEMANTIC_STORY_WORLD.md`
14. `07_OBSERVATION_SENSOR_AND_LENS_SYSTEM.md`
15. `08_TEMPORAL_AND_READER_STATE.md`
16. `09_DIAGNOSIS_SYSTEM.md`
17. `10_PLAYBOOKS_AND_WRITER_WORKFLOWS.md`
18. `11_CAPABILITY_CATALOG_12_FAMILIES.md`
19. `12_CALIBRATION_EVALUATION_AND_CORPUS.md`
20. `13_PERSISTENCE_PROVENANCE_CACHE_RECOMPUTATION.md`
21. `14_WORKSHOP_INTEGRATION_AND_REVISION_INTELLIGENCE.md`
22. `15_FOUNT_PROBE_DIRECT_SUPERSESSION.md`
23. `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`
24. `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`
25. `16_PHASED_IMPLEMENTATION_PLAN.md`
26. `17_AGENT_EXECUTION_PROTOCOL.md`
27. `18_RUNTIME_QC_PROTOCOL.md`
28. `19_ACCEPTANCE_CRITERIA.md`

Use `MANIFEST.md` for the complete inventory.

## The twelve capability families

1. Scene Engine
2. Agency and Causality
3. Character Trajectory
4. Relationship Dynamics
5. Audience / Reader Experience
6. Sequence Movement
7. Dialogue Interaction
8. Setup / Payoff and Motifs
9. Emotional / Value Movement
10. Theme and Meaning
11. Genre Lens Packs
12. Revision Intelligence

See `11_CAPABILITY_CATALOG_12_FAMILIES.md`.

## Direct Probe supersession

Phase 1 remains exactly the same implementation phase as in the prior docset: create Observe + Intelligence, subsume current valuable Probe behavior, update Workshop, move/recreate tests, and delete `packages/fount_probe` in one overlay.

This revision changes Phases 2+ product-validation and writer-surface requirements; it does **not** split Phase 1 into 1A/1B or authorize a compatibility bridge.

## Handoff cycle

```text
latest QC'd source snapshots + latest docset
                 |
                 v
      offline phase implementer
      (writes, does not fake runtime success)
                 |
         overlay + updated docset
                 |
                 v
          runtime-QC agent
      (compile/test/fix/live checks)
                 |
          corrected source snapshot
                 |
                 v
             next phase
```

## Current status

Read `PROGRESS.md`. Phases 1–10 are `COMPLETE` on engineering QC. Phase 11 is `OFFLINE_IMPLEMENTED` with runtime/live QC pending. Phase 12 is `NOT_STARTED`.

## Previous verified checkpoint: Phase 7

The current source delivery makes capability families 5–8 concrete. A writer can inspect first-exposure audience questions, expectations, threats, suspense, curiosity, surprise, comprehension and handoff pressure; inspect sequence movement as separate changes in objective/constraints/stakes/knowledge/relationships/choices/tactics rather than one momentum score; analyze adjacent canonical dialogue turns with typed neutral context; and trace setup/payoff/motif lifecycles while keeping presentation order separate from story time. The non-linear watch/ledger fixture deliberately presents an origin flashback after the present-day clue even though StoryWorld places that origin earlier diegetically.

Artifacts are `fount_phase_07_overlay.zip`, `fount_phase_07_docset.zip`, and `FOUNT_PHASE_07_CODEX_QC_HANDOFF.md`. The source-delivery checks remain historical. Runtime QC passed at Fount `4a1c723`: 305 workspace tests, 53 Python tests, compiled architecture, strict Credo, Dialyzer, ExDoc, four archives, isolated Core/Workshop PostgreSQL integrations and writer accept/reject PDF/table-read demonstrations. The real helper is `handoff/prune_deleted_directories.py`; the XML-only missing-file account used the wrong path. Read `handoffs/PHASE_07_RUNTIME_QC_REPORT.md` for defects, repairs and limits. Optional human review was skipped under D046; no human usefulness claim is made. At that checkpoint Phase 8 was NOT_STARTED; the current Phase-8 source handoff is below.

## Historical Phase 8 source handoff

At source delivery, Phase 8 was `OFFLINE_IMPLEMENTED`: Emotional/Value Movement, Theme/Meaning, Genre Lens Packs, Revision Intelligence, safe declarative-lens/pack configuration, and explicit before/after revision comparison are source-written. See `handoffs/PHASE_08_OFFLINE_HANDOFF.md`, `handoffs/PHASE_08_IMPLEMENTATION_MATRIX.md`, and `handoffs/PHASE_08_RUNTIME_QC_HANDOFF.md`. At that checkpoint runtime compilation/QC was pending; Phase 9 had not started.

### Phase 8 verified runtime result

Phase 8 is **COMPLETE** on engineering and preservation QC at Fount `f7f4d68`: 320 workspace tests, 64 Python source tests, compiled architecture, strict Credo, Dialyzer, ExDoc, four package archives, isolated Core/Workshop PostgreSQL integrations, and writer accept/reject/PDF/table-read checks passed. See `handoffs/PHASE_08_RUNTIME_QC_REPORT.md`. The optional human/domain review was skipped under D046 and remains validation debt. Phase 9 remained NOT_STARTED at that historical checkpoint.

## Phase 9 verified runtime result

Phase 9 Workshop Intelligence Integration is **COMPLETE** on engineering and preservation QC at Fount `361a9fd`: full CI passed 325 tests, 73 Python tests passed, isolated Core/Workshop PostgreSQL and a deterministic Sandbox/scripted-Inference writer loop passed, and PDF/table-read/export plus four package builds passed. Read `handoffs/PHASE_09_RUNTIME_QC_REPORT.md`. The optional human workflow study remains unperformed validation debt under D046. Phase 10 is not started.
## Phase 10 verified runtime result

Phase 10 Durable Analysis Persistence, Reuse, and Recomputation is **COMPLETE** on engineering and preservation QC at Fount `6d164f6`: full CI passed 328 tests, 82 Python tests passed, disposable PostgreSQL migrations and Core/Intelligence/Workshop integrations passed, and the deterministic rejected/unchosen writer resume-history outcome passed without a new generation call or canon change. Read `handoffs/PHASE_10_RUNTIME_QC_REPORT.md`. The optional human usefulness study remains validation debt under D046. Phase 11 has since been source-written.

## Phase 11 source delivery

Phase 11 Scaled Calibration, Evaluation Corpus, Robustness, and Live Verification is **OFFLINE_IMPLEMENTED**, not COMPLETE. The new Intelligence evaluation surface keeps rights/provider-export policy, independent reader disagreement, calibration/abstention, descriptive drift, frozen current-contract reasoning fixtures, capability-suite coverage and longitudinal resource calibration explicit and separately inspectable. It ships a nonlinear first-exposure/story-time regression and opt-in live QC paths: Observe sends only a synthetic scene; Workshop generates one noncanonical candidate for one scene with Observe disabled and never accepts it. No human calibration/usefulness or live-provider result is claimed by this source handoff. Read `handoffs/PHASE_11_OFFLINE_HANDOFF.md` and `handoffs/PHASE_11_RUNTIME_QC_HANDOFF.md`. Phase 12 remains `NOT_STARTED`.
