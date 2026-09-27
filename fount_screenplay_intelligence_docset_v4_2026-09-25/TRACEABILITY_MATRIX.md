# Traceability Matrix

This matrix maps architectural/product requirements to final ownership, implementation phase, and verification. Phase agents add concrete source/test paths as work is implemented.

## Architecture requirements

| Requirement | Owner | Phase | Verification |
|---|---|---:|---|
| four physical packages | workspace | 1 | dependency/architecture gate |
| direct Probe removal | workspace | 1 | source/package/reference scan |
| no compatibility shims/dual paths | workspace | 1–12 | architecture/source gate |
| Observe measurement boundary | `fount_observe` | 1–2 | package/API tests |
| pure Intelligence core | `fount_intelligence` | 1+ | layered architecture gate + deterministic tests |
| Core -> Shell dependency prohibition | Intelligence | 1+ | boundary/dependency gate |
| Observe leaf-contract allowlist | Observe + Intelligence | 1–2 | architecture gate/xref/BEAM analysis |
| targeted hidden-side-effect prohibition | Intelligence | 1+ | forbidden-MFA gate |
| multi-pass context inversion | Intelligence shell + Observe | 5 | Sandbox integration tests |
| typed neutral Observe context envelope | Observe | 2 | context construction/validation tests |
| closed lens-declared context slots | Observe | 2 | invalid/missing/unknown slot tests |
| output contract logical ID + canonical-shape digest | Observe | 2 | contract digest/stale-contract tests |
| no numeric analytical schema generations | workspace | 1–12 | source/asset scan + contract tests |
| MeasurementResult separate from Observation provenance | Observe/Intelligence | 2,10 | cross-revision cache tests |
| Observe L1 DB-free result cache | Observe | 2 | cache tests |
| Intelligence durable L2 reuse/persistence | Intelligence shell | 10 | DB integration tests |
| semantic cache key excludes revision-only provenance | Observe | 2,10 | cross-revision reuse tests |
| model identity stability policy | Observe/Intelligence | 2,10 | cache-policy tests |
| project/tenant cache namespace | Observe/host | 2,10 | isolation tests |
| no semantic cache deletion on edit | Observe/Intelligence | 10 | retention/recompute tests |
| derived recomputation frontiers | Intelligence | 3–4,10 | dependency/frontier tests |
| Observe Sandbox | Observe | 1–2 | deterministic playbook tests |
| presentation/discourse order | Fount + Reader | 3–4 | source-order/reader tests |
| partial story-time constraint graph | Intelligence StoryWorld | 3 | non-linear temporal tests |
| narrative/reality scopes | Intelligence StoryWorld | 3 | dream/memory/alternate fixtures |
| causal graph independent from time | Intelligence StoryWorld | 3 | causal-order tests |
| no forced total story chronology | Intelligence | 3–4 | ambiguity/nonlinear fixtures |
| reader forward-only invariant | Intelligence Reader | 4 | property/regression tests |
| diegetic vs reader-visible character knowledge | StoryWorld + Reader | 3–4 | epistemic fixtures |
| content-addressed analytical assets | Observe/Intelligence | 2,10 | hashing/persistence tests |
| closed executable registries | Observe/Intelligence | 1,5 | request validation tests |

## Capability families

| # | Capability | Measurement owner | Reasoning owner | Playbook/workflow | Primary phase |
|---:|---|---|---|---|---:|
| 1 | Scene Engine | Observe | Intelligence StoryWorld/Capabilities | Scene Doctor / Workshop rewrite | 6 |
| 2 | Agency & Causality | Observe | Intelligence StoryWorld/Causal graph | Agency/Causality investigation | 6 |
| 3 | Character Trajectory | Observe | Intelligence StoryWorld/Reader | Character Trajectory / Workshop | 6 |
| 4 | Relationship Dynamics | Observe | Intelligence StoryWorld/Reader | Relationship Pass / Workshop | 6 |
| 5 | Audience / Reader Experience | Observe | Intelligence Reader | Suspense/Reader/Submission playbooks | 7 |
| 6 | Sequence Movement | Observe | Intelligence sequence/Reader views | Sequence Momentum / Workshop | 7 |
| 7 | Dialogue Interaction | Observe | Intelligence exchange/relationship reasoning | Dialogue Pass / Workshop | 7 |
| 8 | Setup / Payoff & Motifs | Observe | Intelligence StoryWorld/Reader ledgers | Setup/Payoff Audit / Workshop | 7 |
| 9 | Emotional / Value Movement | Observe | Intelligence Reader/Capabilities | Emotional/Value Pass | 8 |
| 10 | Theme & Meaning | Observe where needed | Intelligence evidence synthesis | Theme/Meaning investigation | 8 |
| 11 | Genre Lens Packs | Observe optional lenses | Intelligence optional evaluators | Genre playbooks | 8 |
| 12 | Revision Intelligence | Observe + Fount diffs | Intelligence comparison/counterfactual | Regression/strategy + Workshop review | 8–9 |

## Temporal/non-linear requirements

| Requirement | Final owner | Phase | Verification |
|---|---|---:|---|
| flashback does not inherit later diegetic state | StoryWorld | 3 | fixture |
| future death does not contaminate earlier story event | StoryWorld | 3 | fixture |
| simultaneous/overlapping events need no fake ordering | StoryWorld | 3 | relation-graph tests |
| unknown story-time relation remains unresolved | StoryWorld | 3 | abstention test |
| temporal contradiction cites support | StoryWorld/Diagnosis | 3/5 | contradiction fixture |
| dream/hypothetical/alternate scope separated | StoryWorld | 3 | scope fixture |
| causal edge independent of temporal order | StoryWorld | 3 | causal fixture |
| reader snapshots follow only presentation prefix | Reader | 4 | property test |
| reader model of character knowledge differs from diegetic state | StoryWorld + Reader | 4 | mystery/flashback fixture |
| Reader recomputes presentation suffix only | Reader/Persistence | 4/10 | recomputation tests |
| StoryWorld recomputes connected constraint region | StoryWorld/Persistence | 3/10 | dependency tests |

## Probe tool supersession

| Current Probe intent | Final owner | Phase-1 preservation | Expanded capability phase |
|---|---|---:|---:|
| inventory | Fount query + Intelligence reporting | 1 | 3/5 |
| extract_story | Observe extraction measurements + StoryWorld | 1 | 3 |
| search | Fount/Intelligence retrieval | 1 | 3/5 |
| check_constraints | split Fount/Intelligence/Workshop policy | 1 | 5/9 |
| knowledge_trace | Observe epistemic sensors + StoryWorld/Reader | 1 | 3–4/7 |
| locate_boundary | Reader/StoryWorld boundary query | 1 | 4 |
| dependencies | Observe support sensors + StoryWorld causal/setup graph | 1 | 6/7 |
| continuity | StoryWorld temporal/state constraints + Observe evidence | 1 | 3/6 |
| scene_mechanics | Scene Engine | 1 | 6 |
| dialogue | Dialogue Interaction | 1 | 7 |
| voice | Observe voice + Intelligence character/dialogue | 1 | 6/7 |
| action | Observe action + Intelligence scene/readability | 1 | 6 |
| compare | Revision Intelligence | 1 | 8 |
| scene_lift | Intelligence counterfactual/revision playbook | 1 | 8 |
| ablate | Intelligence counterfactual engine | 1 | 8 |
| strategy_contrast | Intelligence diagnosis + Workshop strategy guard | 1 | 8/9 |

## Existing Probe infrastructure

| Current area | Final owner | Phase |
|---|---|---:|
| Catalog | Observe sensor registry + Intelligence playbook registry | 1 |
| Profile | Observe lens/calibration assets | 1–2 |
| Jev | Observe provider adapter/normalization | 1–2 |
| Writing.Executor | Observe executor | 1–2 |
| Writing.DecisionPolicy | Observe calibration + Intelligence diagnosis policy | 1–2,5 |
| Writing.Evidence | Observe evidence + Intelligence report validation | 1 |
| Budget | Observe acquisition budget + Intelligence run allocation | 1–2,5 |
| Projection/State | Fount query/slice + Observe projection/context + Intelligence derived state | 1–5 |
| Report | Observation/Diagnosis/PlaybookRun/Intelligence.Report | 1,5 |
| Investigation | Intelligence Playbooks/Runner | 1,5 |
| SavedRecords | Intelligence L2 persistence | 1 baseline / 10 final |
| Completion | Workshop generation | 1 |
| Launcher/live | Observe/Intelligence/Workshop examples | 1–2,11 |
| CLI/tasks | useful replacement tasks only | 1/12 |

## Measurement/reuse requirements

| Requirement | Owner | Phase | Verification |
|---|---|---:|---|
| raw normalized distribution retained | Observe | 1–2 | normalization tests |
| canonical output-contract digest | Observe | 2 | digest fixtures |
| stale contract fails closed | Observe/Intelligence | 2 | stale-contract test |
| context is canonicalized before hashing | Observe | 2 | deterministic serialization test |
| cache hashes actual semantic input | Observe | 2 | key-difference/equality tests |
| revision-only provenance excluded from reuse key | Observe | 2 | cross-revision hit test |
| upstream context change changes key | Observe | 2 | context-sensitive miss test |
| cache hit materializes fresh Observation provenance | Observe/Intelligence | 2/10 | provenance test |
| mutable model alias policy explicit | Observe | 2 | model-fingerprint tests |
| durable reuse isolated by privacy scope | Observe/host | 10 | isolation test |
| generated observation fixtures pin current contract digest | Evaluation | 11 | stale-fixture test |

## Workshop preservation

| Existing Workshop behavior | Final owner | Phase |
|---|---|---:|
| Develop | Workshop | 1 preserve / 9 enhance |
| TargetedRewrite | Workshop | 1 / 9 |
| SequenceRebuild | Workshop | 1 / 9 |
| CharacterRewrite | Workshop | 1 / 9 |
| NoteResponse | Workshop + Intelligence diagnosis | 1 / 9 |
| Pass | Workshop + Intelligence | 1 / 9 |
| Recover | Workshop | 1 / 9 |
| Strategy | Workshop + Intelligence distinctness | 1 / 8–9 |
| Candidate/Session/Store | Workshop | 1 |
| Audition/combine/select/materialize | Workshop | 1 / 9 |
| Review/rebase/accept/reject | Workshop + Fount acceptance | 1 |
| PDF/submission/table-read/audio | Workshop | 1 |
| structured completion/repair | Workshop/Inference | 1 |
| change groups/footprints/conflicts | Workshop | 1 / 9 |

## Research/product principles

| Principle | Primary implementation surface |
|---|---|
| broad industry reader criteria, not one theory | Submission Read + corpus/evaluation |
| emergent reader experience over presentation time | Reader + playbooks |
| story-world continuity independent from presentation order | StoryWorld temporal constraints |
| notes are reactions, not commands | Diagnosis + Notes playbook + Workshop |
| no universal score | all reports/acceptance |
| theory-specific optional lenses | Observe assets + genre/theory packs |
| writer intent/protected strengths | Intelligence playbook + Workshop lineage |
| uncertainty/ambiguity preserved | StoryWorld/Reader/Diagnosis |

## Progress notation

Phase agents add concrete paths in handoffs/matrix using:

```text
WRITTEN_UNEXECUTED
QC_VERIFIED
BLOCKED
```

Do not mark source as verified based on offline implementation alone.

## Writer-product requirements

| Requirement | Owner | Primary phase | Verification |
|---|---|---:|---|
| writer-facing semantic result contract | Intelligence | 3–5 | packet/schema + reference renderer tests |
| claim class separation (fact/derived/model/human-calibrated) | Intelligence/Reader | 3–5 | result packet + domain-review fixtures |
| reference human-readable renderer before rich UI | Intelligence | 3–5 | deterministic render snapshots |
| early StoryWorld structural pilot | Evaluation workstream | 3 | rights-cleared review packet |
| first-reader checkpoint pilot | Evaluation workstream | 4 | forward-exposure human review |
| diagnosis/usefulness pilot | Evaluation workstream | 5 | expert writer/story review |
| capability-family human review | Evaluation workstream | 6–8 | recorded review cases |
| end-to-end writer workflow review | Workshop/Evaluation | 9 | human session/report |
| scaled calibration not first human contact | Evaluation | 11 | corpus/calibration suite |
| rights/provenance corpus manifest | Evaluation/host | 3+ | manifest audit |
| provider-export permission separated from storage/review rights | host/Evaluation | 3+ | policy tests/process audit |
| declarative pack authoring without code when safe | Intelligence/Observe | 8 | asset validation/install tests |
| declarative lens capability restrictions | Observe | 2/8 | invalid capability/resource tests |
| open writer questions, closed executable primitives | Intelligence/Observe | 5/8 | planner + registry tests |
| longitudinal preflight/resource caps | Intelligence shell | 5+ | estimate/cap tests |
| Workshop surfaces resource preflight/actual | Workshop | 9 | integration tests |
| per-project/rewrite resource history | Intelligence persistence | 10 | persistence/report tests |
| feature-film-only claim boundary | docs/evaluation | all | scope/non-claim audit |
| STAGE/external benchmark not treated as Fount validation | Evaluation/docs | 11/16 | documentation/source audit |

## Screenplay-writing workflow expansion

All rows below are specification requirements, initially NOT_STARTED. Phase handoffs replace that status with concrete source/test/demo identities and actual evidence. Existing capabilities can satisfy a row when verified; do not rebuild them unnecessarily.

| Requirement | Product outcome | Primary phase | Acceptance cases |
|---|---|---:|---|
| W01 | Draft/explore/inspect/revise, human-only path, resume | 12/15 | A01/A10/A12 |
| W02 | Evolving brief, fragments, optional outline/cards | 12 | A01 |
| W03 | Scene workshop and materially different alternatives | 12 | A01/A03 |
| W04 | Cinematic action, sound, space, rhythm | 13 | A02 |
| W05 | Relationship rehearsal separate from canon | 13 | A05 |
| W06 | Voice and language preservation | 13 | A04 |
| W07 | Research provenance and intentional fiction | 14 | A08 |
| W08 | Notes triage, disagreement, reliable anchors | 14 | A06 |
| W09 | Revision experiments, consequences, safe acceptance | 14 | A07/A10 |
| W10 | Read/share/export without private-material leakage | 15 | A09/A11 |
| W11 | Useful partial results, cancellation, controlled retry | 12/15 | A10 |
| W12 | Honest comparative usefulness evidence | 15/16 | A12 |
| H01 | Five XML inputs with exact source identity | every pass | document 35 packet audit |
| H02 | User applies/commits; Codex verifies/repairs | every pass | application/QC commit record |
| H03 | Actual SystemOneSDK facade and answer semantics | 1/2/9 | document 34 SDK contract tests |

Every phase also performs its engineering demonstration from document 36. Research R01–R10 motivates W01–W12, but citations alone do not satisfy implementation or establish human validation. Optional human studies never block phase completion under D046.

## Phase 1 concrete source traceability - COMPLETE

The source mappings below have now been checked with 198 workspace unit tests, 25 database-backed integration tests, the source/BEAM architecture gate, and the deterministic accept/reject demonstration. See `handoffs/PHASE_01_RUNTIME_QC_REPORT.md` for exact historical results and the explicitly retained Luna-output debt. The 37-module/26-test source classification remains in the preservation audit. Later-phase rows above retain their original scope and status.

| Requirement / preserved usefulness | Source | Tests or demonstration | Status |
|---|---|---|---|
| Final package graph / direct removal | root `mix.exs`; both new Mix projects; strict overlay manifest | `scripts/tests/test_phase_one_source.py`; Intelligence `architecture_test.exs`; `mix fount.architecture` | Phase 1 source and compiled gates passed per its QC report; rerun for Phase 2 |
| Neutral atomic questions and evidence | Observe `question.ex`, `request.ex`, `distribution.ex`, `evidence_ref.ex`, `context.ex` | `measurement_contract_test.exs` | Runtime tests passed; see Phase 1 QC report |
| Real SDK boundary and normalization | Observe `providers/system_one.ex` | `system_one_boundary_test.exs` | Runtime tests passed; see Phase 1 QC report |
| Association / partial failures / caps / timeout | Observe `executor.ex`, `association.ex`, `provider_call.ex`, `budget.ex` | `executor_sandbox_test.exs`; `system_one_boundary_test.exs` | Runtime tests passed; see Phase 1 QC report |
| Minimum L1 cache / current provenance | Observe `measurement_result.ex`, `observation.ex`, `cache/memory.ex` | `cache_integrity_test.exs`; cross-revision Sandbox test | Runtime tests passed; Phase 1 evidence only; Phase 2 hardening QC_VERIFIED |
| Closed analytical requests / no executable data | Intelligence `playbooks/registry.ex`, `playbooks/request.ex` | `request_contract_test.exs`; migrated catalog tests in Workshop | Runtime tests passed; see Phase 1 QC report |
| Pure interpretation and core-shell boundary | Intelligence `capabilities/*`, `reader/reveal.ex`, `story_world/records.ex`, `runner/architecture.ex` | `reader_replay_test.exs`; `architecture_test.exs` | Runtime tests passed; see Phase 1 QC report |
| Exact selection / evidence / search | core `selection.ex`, `source_evidence.ex`, `inventory.ex`, `search.ex` | moved inventory/search/source-evidence tests; original canonical tests | Runtime tests passed; see Phase 1 QC report |
| Knowledge, continuity, causal support, dialogue, voice, action | Intelligence `playbooks/*` and `acquisition/*`; Observe projections/lenses | 26 original analysis tests mapped to final ownership | Runtime tests passed; see Phase 1 QC report |
| Generation remains Workshop-owned | Workshop `writing/completion.ex`, `services.ex`, `writing/action_layout.ex` | moved completion/extraction tests; `completion_privacy_test.exs` | Runtime tests passed; see Phase 1 QC report |
| Document 36 Phase 1 writer demonstration; baseline W02-W06/W09-W11 | Workshop `examples/phase_one.exs`, `examples/support/phase_one_demo.exs` | `integration/phase_one_writer_demo_test.exs`; existing workflow/integration suite | Executed accept/reject, review, table-read and PDF/export fixtures; live bridge completed; alternatives output failed under user-authorized Luna debt; no human/domain result claimed |
| Strict file transport and safe directory completion | unchanged applier; new `handoff/prune_deleted_directories.py` | Python transport checks and four cleanup tests | See actual static/transport report |

The reusable MeasurementResult/Observation/context baseline is required to implement Phase 1's Observe minimum. Its presence does not mark Phase 2, Phase 10 or any expanded writer phase complete.

## Phase 2 concrete source traceability - COMPLETE

The complete requirement/source/test mapping is
`handoffs/PHASE_02_IMPLEMENTATION_MATRIX.md`. It covers every scope/test row in
Phase 2 of document 16 and the scene-question demonstration in document 36.
The original 32 ExUnit tests plus two runtime regression tests pass, along with
26 Python checks. The four-package `mix ci`, architecture, DB/writer/PDF, package
build and authorized synthetic live gates passed. See `PHASE_02_RUNTIME_QC_REPORT.md`
for commands and limits; `PHASE_02_STATIC_CHECKS.json` remains historical offline evidence.

H01: four raw input hashes and content classification recorded; modified preimages
match supplied post-QC hashes, but the missing input seals remain explicit.
H02: strict changed-file overlay and complete docset; user applies/commits and
Codex verifies without reapplication. H03: inspected public SDK facade retained;
new partial relay and metadata use the supplied 0.6.0 source fields.
W01/W11: the narrow inspection/resource/partial-result substrate is written; the
full later session workflow is not claimed complete. No other later-phase row is
advanced. Prior Phase 1 runtime evidence does not transfer to changed source.

Phase 2 QC verified all 19 rows in `handoffs/PHASE_02_IMPLEMENTATION_MATRIX.md` with the 232-test workspace suite, compiled boundary gate, isolated database and writer examples, one capped live SDK request and four package builds. Later W01/W11 session work remains assigned to later phases.

## Phase 3 concrete source traceability - COMPLETE with Level-A validation debt

The complete requirement/source/test mapping is `handoffs/PHASE_03_IMPLEMENTATION_MATRIX.md`. The table below records the historical offline delivery. Engineering verification and repairs are recorded separately in `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`. The unperformed Level-A human structural/factual pilot is visible validation debt under explicit user decision D045.

| Requirement / writer usefulness | Source | Tests or demonstration | Offline status |
|---|---|---|---|
| canonical + frozen-observation StoryWorld compile | `story_world.ex`; `story_world/compiler.ex`; `story_world/evidence.ex` | `story_world_reference_test.exs`; `story_world_records_test.exs` | written; runtime unrun |
| event-qualified facts/state/knowledge | `story_world/values.ex`; `story_world/query.ex`; `story_world/consistency.ex` | `story_world_temporal_test.exs`; `story_world_records_test.exs` | written; runtime unrun |
| presentation order separate from diegetic chronology | compiler presentation points; `story_world/story_time.ex` | flashback/unknown/overlap tests | written; no scene-order fallback |
| partial story-time with ambiguity/contradiction/evidence | `story_world/story_time.ex` | `story_world_temporal_test.exs` | written; runtime unrun |
| reality/narrative scopes | `NarrativeScope`; compiler scope validation; scoped queries | `story_world_scope_causality_test.exs` | written; runtime unrun |
| causal graph independent from time | `story_world/causal.ex`; causal queries | `story_world_scope_causality_test.exs` | written; runtime unrun |
| connected recomputation/counterfactual support impact | `story_world/dependency_index.ex`; `story_world/counterfactual.ex` | `story_world_reference_test.exs`; records dependency case | written; no replacement-page generation |
| writer-facing semantic packet/reference renderer | `story_world/inspection.ex`; `story_world/renderer.ex` | deterministic reference test; `examples/phase_three.exs` | written; demo unrun |
| Phase-2 extraction usefulness retained | compiler legacy normalization + unchanged `story_world/records.ex` | legacy `events` preservation test | written; runtime unrun |
| pure-core package boundary | new StoryWorld namespace; existing `Runner.Architecture` gate | `story_world_architecture_test.exs` + offline direct scans | source scan only; compiled gate unrun |
| early StoryWorld structural/factual pilot | `handoffs/PHASE_03_DOMAIN_REVIEW_PACKET.md` | at least 3 rights-cleared feature scripts/excerpts and 2 independent structural reviewers | **PENDING; no human result claimed** |

W01–W12 later workflow rows are not advanced by this source delivery. At the Phase-3 source-delivery checkpoint, Phase 4 Reader state, diagnosis, playbook-shell reasoning, durable persistence and Workshop integration were NOT_STARTED.

**Runtime trace:** Fount `60f989bcb9935b28519c908f3cd123ad6efe172f` passed 244 four-package ExUnit tests, compiled architecture on 267 modules/229 source files, strict Credo, Dialyzer, ExDoc, isolated Core/Workshop integration (11/14 tests), writer accept/reject/PDF examples, and four package inspections. `story_world_temporal_test.exs` now also proves strict-cycle constraint provenance and contradictory pair-query abstention. The Level-A corpus/reviewer/reconciliation artifacts remain unrecorded; Phase 3 is `COMPLETE` under D045's explicit validation-debt override, and At that Phase-3 checkpoint, Phase 4 was `NOT_STARTED` but eligible to begin next.

## Phase 4 concrete source traceability - COMPLETE (human pilot skipped)

The complete current requirement/source/test mapping is `handoffs/PHASE_04_IMPLEMENTATION_MATRIX.md`. Runtime results are not yet available; the rows below are source-delivery evidence only.

| Requirement / writer usefulness | Source | Tests or demonstration | Current evidence |
|---|---|---|---|
| event-qualified character/resource/commitment/knowledge views | `Fount.Intelligence.Temporal` | `temporal_views_test.exs` | written; Elixir unrun |
| presentation/story-time coordinate separation | `Temporal.sequence_view/3`, `trajectory/5`; Phase-3 StoryWorld constraints | flashback/non-linear cases | written; no source-order chronology fallback |
| directional relationship state | `Temporal.relationship_state/5` | asymmetric relationship case | written; Elixir unrun |
| setup/payoff lifecycle | `Temporal.setup_payoff_ledger/2` | setup/payoff case | written; Elixir unrun |
| story-time connected recomputation | `StoryTime.connected_nodes/2`; `Temporal.recomputation_region/2` | connected-region case | written; Elixir unrun |
| first-reader forward-only checkpoints | `Fount.Intelligence.Reader.reduce/3`; Reader state/snapshot/event values | `reader_forward_test.exs` | written; Elixir unrun |
| private material / future evidence cannot leak | Reader canonical-selection boundary + evidence validation | private-note and future-evidence cases | written; Python source guard PASS |
| reader question/reveal/promise/threat/epistemic/relationship/audience-state ledgers | Reader reducers | lifecycle/flashback/suspense tests | written; Elixir unrun |
| reader vs diegetic character knowledge | `Reader.knowledge_differential/6` + StoryWorld | `reader_story_world_differential_test.exs` | written; Elixir unrun |
| presentation suffix recomputation | `Reader.recomputation_boundary/2` | suffix test | written; Elixir unrun |
| provider/persistence-free core | Temporal/Reader namespace | direct Python source scan + compiled architecture gate required later | source scan PASS; compiled gate unrun |
| writer-facing Phase-4 demonstration | `examples/phase_four.exs`; temporal/reader guide | runtime example | written; unrun |
| first-reader human checkpoint pilot | `handoffs/PHASE_04_DOMAIN_REVIEW_PACKET.md` | >=3 rights-cleared scripts/excerpts; 3–5 readers/checkpoint target | **PENDING; no human result claimed** |

Phase 5 Diagnosis/Acquisition/Playbooks and all later capability/persistence/Workshop work remain `NOT_STARTED`. The source-writing pass does not transfer Phase-3 runtime evidence to changed Phase-4 Intelligence source.


**Phase 4 runtime trace — 2026-09-27:** Fount `cfde46cd2f654e050cbb9b5dbe32501625510c69` passed 263 four-package ExUnit tests, 19 focused Phase-4 tests, forward-leak/private-material and non-linear temporal cases, compiled architecture, strict Credo, Dialyzer, ExDoc, isolated Core/Workshop integration (11/14), writer acceptance/PDF and package inspection. These executed results supersede the offline-only labels above. The first-reader pilot is unperformed; Phase 4 is `DOMAIN_REVIEW_PENDING`. Phase 5 remains `NOT_STARTED`.

**D046 policy trace:** The user made all future human reviews optional and nonblocking. Phase 4 is `COMPLETE` on the executed engineering evidence above; its first-reader pilot was skipped and remains visible validation debt. For later phases, trace engineering tests/demonstrations separately from any optional human study. Do not claim human validity or usefulness without real participants and records. Phase 5 remains `NOT_STARTED`.

## Phase 5 concrete source traceability — OFFLINE_IMPLEMENTED

| Requirement | Phase-5 source/test evidence | Status |
|---|---|---|
| pure evidence-composed diagnosis | `diagnosis.ex`, `diagnosis/{concern,evidence_need,result}.ex`, `diagnosis_test.exs` | WRITTEN; Python boundary scan PASS; ExUnit unrun |
| explicit evidence needs / abstention / competing hypotheses | same Diagnosis source/tests | WRITTEN; ExUnit unrun |
| shell-only Observe acquisition | `acquisition/{planner,context_builder,diagnostic_measurements,measurements}.ex`, `playbooks/writer_runner.ex` | WRITTEN; runtime unrun |
| closed Observe context | `ContextBuilder` + `diagnosis.evidence_support.json`; actual `Fount.Observe.Context.from_map/2` | JSON/source checks PASS; ExUnit unrun |
| two diagnosis lens assets | `fount_observe/priv/lenses/diagnosis.*.json`, Observe Registry | JSON PASS; provider unrun |
| ten writer playbooks | `playbooks/writer_registry.ex`, `writer_registry_test.exs` | Python catalog check PASS; ExUnit unrun |
| partial coverage under request/evidence caps | `WriterRunner` + `writer_runner_test.exs` | WRITTEN; ExUnit unrun |
| writer semantic result packet | `reporting/writer_packet.ex`, `renderer.ex`, `writer_packet_test.exs` | WRITTEN; runtime unrun |
| resource preflight/actual usage | actual Observe preflight/evaluate/Budget integration in `WriterRunner`/`Measurements` | WRITTEN; runtime unrun |
| deterministic Sandbox playbook | `writer_runner_test.exs`, `examples/phase_five.exs` | WRITTEN; example unrun |
| pure-core boundary | `phase_five_architecture_test.exs` + offline direct scan | source scan PASS; compiled gate unrun |
| existing analysis/writing preservation | additive writer registry; no Core/Workshop/StoryWorld/Reader source modifications | full preservation ladder pending Codex |
| five-input transport | `PHASE_05_INPUTS.json`, D047, document 35 | RECORDED |
| human diagnosis/usefulness review | `PHASE_05_DOMAIN_REVIEW_PACKET.md` | NOT RUN; validation debt under D046 |

The source-writing pass does not transfer Phase-4 runtime evidence to changed Intelligence/Observe source. Phase 5 remains `OFFLINE_IMPLEMENTED` until Codex executes and repairs the runtime gates. Phase 6 and all capability-family work remain `NOT_STARTED`.

## Phase 5 runtime QC trace — 2026-09-27

Fount applied `3cd9ba4d02a2bb342a94149467a7321d8682e3b8`, repaired `f3a56c90842d467cf57fb3a1f2123115d7f976d2`; applied docset `5393fde85509e03a59a61e2af92ae7e7c1c26294`. The 36-file applied inventory and embedded manifest matched. Focused Phase-5 ExUnit: 18 passed. Full CI: Core 71, Observe 59, Intelligence 93, Workshop 58 = 281 passed; compiled architecture 283 modules/245 source files and zero violations; strict Credo, Dialyzer, ExDoc and package archives passed. Isolated Core/Workshop integration: 11/14 passed; mock writer acceptance, rejection and two-page PDF passed. The deterministic Sandbox packet preserves two competing hypotheses, supported counterevidence with high uncertainty, protected strength, next investigation, source excerpts, coverage and unknown hosted cost. See `handoffs/PHASE_05_RUNTIME_QC_REPORT.md` and `handoffs/PHASE_05_FILE_INVENTORY.json` for the command record and post-repair hashes. Phase 5 is `COMPLETE`; optional human usefulness review is unperformed validation debt under D046. Phase 6 remains `NOT_STARTED`.

## Phase 6 concrete source traceability — COMPLETE

| Requirement | Phase-6 source/test evidence | Status |
|---|---|---|
| Scene Engine atomic measurements and derived state | `acquisition/capability_measurements.ex`, `capabilities/scene_engine.ex` | WRITTEN; Python source gate PASS; ExUnit unrun |
| Scene turn/entry-exit/sequence/handoff outputs | `SceneEngine.turn_candidates`, entry/exit delta, surrounding-sequence contribution, handoff/counterfactual support | WRITTEN |
| Agency explicit decision/action/consequence reasoning | `capabilities/agency_causality.ex` + StoryWorld causal APIs | WRITTEN; runtime unrun |
| alternate support / causal reach / consequence latency | Agency derived state + nonlinear fixture | WRITTEN |
| Character goals/beliefs/commitments/adaptation/arc hypotheses | `capabilities/character_trajectory.ex` | WRITTEN |
| no compulsory character transformation | closed arc choices include steadfast/deliberately-static/mixed; guide/tests | WRITTEN |
| reader-visible vs diegetic character state | separate presentation measurements and StoryWorld story-time relation packet | WRITTEN; nonlinear fixture |
| Relationship pair/group dimensions/directionality | `capabilities/relationship_dynamics.ex` | WRITTEN |
| relationship nonlinear presentation and story-time separation | relationship transition/interaction story-time packet + flashback fixture | WRITTEN |
| exact source participates in measurement semantics | `CapabilityRunner.build_inputs/4` copies evidence excerpts into `state.source` and retains evidence envelope | Python source gate PASS; runtime unrun |
| four closed Observe lenses | `scene.engine.json`, `agency.causality.json`, `character.trajectory.json`, `relationship.dynamics.json` + Registry | JSON PASS; ExUnit unrun |
| all four families exercised through Sandbox writer playbooks | `phase_six_runner_test.exs`, `examples/phase_six.exs` | WRITTEN; runtime unrun |
| Workshop usefulness mapping without premature integration | `guides/capabilities-a.md`; existing Workshop API names inspected | WRITTEN; no Workshop call added |
| pure-core effect boundary | `phase_six_architecture_test.exs` + Python direct scan | source scan PASS; compiled gate unrun |
| Phase-7 stop line | Python absence check + handoff | PASS offline |
| five-input transport | `PHASE_06_INPUTS.json`, D047 | RECORDED |
| optional human/domain review | `PHASE_06_DOMAIN_REVIEW_PACKET.md` | NOT RUN; validation debt under D046 |

The source-writing pass does not transfer Phase-5 runtime evidence to changed Intelligence/Observe source. Phase 6 remains `OFFLINE_IMPLEMENTED` until Codex executes and repairs the runtime/preservation gates. Phase 7 remains `NOT_STARTED`.

## Phase 6 runtime verification

At Fount `51f7c5e`, all four Phase-6 families and lenses, exact selected source in semantic input and provenance, partial coverage for caps, scene/agency/character/relationship reasoning, non-linear story-time separation, evidence-backed hypotheses, Sandbox playbooks and nil generated candidates are verified by 10 focused ExUnit tests, 292 workspace tests, 46 Python source tests, and source/compiled architecture inspection. Core and Workshop isolated integrations (11/14), accept/reject writer demonstrations, two-page PDF, table-read, strict Credo, Dialyzer, ExDoc and four archive builds pass. See `handoffs/PHASE_06_RUNTIME_QC_REPORT.md`. Optional human/domain review is NOT RUN under D046; Phase 7 remains NOT_STARTED. Historical source-delivery statuses above remain as chronology.

## Phase 7 concrete source traceability — OFFLINE_IMPLEMENTED

| Requirement | Phase-7 source/test evidence | Offline state |
|---|---|---|
| Audience/Reader first-exposure trajectory | `capabilities/audience_reader_experience.ex`; existing `Reader.reduce/3`; `phase_seven_capabilities_test.exs` | WRITTEN; source gate PASS; ExUnit unrun |
| no future-scene reader leakage | existing strict-forward Reader reused; Phase-7 audience code accepts only supplied validated Reader events | WRITTEN; prior Reader source unchanged; runtime regression pending |
| reader ledgers remain separate | Audience result keeps question, anticipation, suspense, curiosity, surprise, comprehension and handoff outputs distinct | WRITTEN |
| Sequence state vector and movement density | `capabilities/sequence_movement.ex` retains per-scene measurement IDs and separate movement dimensions | WRITTEN; source gate PASS |
| presentation/story-time sequence separation | `Temporal.sequence_view/3` called for both orderings; non-linear fixture | WRITTEN; ExUnit unrun |
| Dialogue adjacent-turn semantics | `CapabilityRunner` derives adjacent canonical character/dialogue turns with cue+dialogue evidence; `dialogue_interaction.ex` interprets response/evasion/subtext/tactic/status/etc. | WRITTEN; source gate PASS |
| validated typed dialogue context | `dialogue.exchange.json` closed context contract + `ContextBuilder.validate/2`; global/per-scene neutral slots | JSON PASS; provider dispatch unrun |
| Setup/payoff lifecycle and motifs | `setup_payoff_motifs.ex` + existing `Temporal.setup_payoff_ledger/2` + StoryWorld causal/story-time relations | WRITTEN; source gate PASS |
| non-linear setup/payoff | five-scene fixture presents watch origin flashback after a present clue while StoryWorld places origin earlier; payoff packet records both relations | WRITTEN; ExUnit unrun |
| four closed Observe lenses | `audience.reader_experience.json`, `sequence.movement.json`, `dialogue.exchange.json`, `setup_payoff.motifs.json` + Registry | all JSON parse PASS |
| writer-facing playbook use | `suspense_audit`, `sequence_momentum`, `dialogue_pass`, `setup_payoff`; dialogue composes existing relationship family | WRITTEN; runner tests unrun |
| diagnosis evidence lineage | Phase-7 evaluators retain measurement provenance/support; Sequence vectors preserve measurement IDs | source review complete; runtime assertions pending |
| generation remains Workshop-owned | Capability runner returns analysis packets; generated `candidate` remains nil | source gate PASS; full Workshop regression pending |
| dependency preservation | no Phase-7 direct SystemOneSDK/Inference/ASM calls; Observe and Workshop boundaries retained | source inspection PASS |
| Phase-8 stop line | no Emotional/Theme/Genre/Revision family implementation in Phase-7 overlay | source gate PASS |
| five-input transport | `PHASE_07_INPUTS.json`, document 35 | RECORDED |
| optional human/domain review | `PHASE_07_DOMAIN_REVIEW_PACKET.md` | NOT RUN; validation debt under D046 |

The source-writing pass does not transfer Phase-6 runtime evidence to changed Phase-7 Observe/Intelligence source. Phase 7 remains `OFFLINE_IMPLEMENTED` until Codex executes and repairs the runtime/preservation ladder. Phase 8 remains `NOT_STARTED`.

