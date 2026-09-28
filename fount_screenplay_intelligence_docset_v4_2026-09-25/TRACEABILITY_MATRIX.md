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

## Phase 7 concrete source traceability — historical offline delivery

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


## Phase 7 runtime verification — COMPLETE

At Fount `4a1c723`, all four new family/lens pairs, strict-forward Reader behavior, separate sequence story-time/presentation views, measurement-ID diagnosis lineage, cue-backed dialogue pairs and typed context rejection, watch-origin flashback qualification, setup/payoff motifs, nil generated candidates and the Phase-8 stop line are verified. Focused Phase-7 tests (2 Observe, 11 Intelligence), 305 full workspace tests, 53 Python source tests, compiled architecture, strict Credo, Dialyzer, ExDoc, four package archives, isolated Core/Workshop DB integrations (11/14) and writer accept/reject PDF/table-read flows pass. Details and repair hashes are in `handoffs/PHASE_07_RUNTIME_QC_REPORT.md` and `handoffs/PHASE_07_FILE_INVENTORY.json`. Optional human/domain review remains NOT RUN under D046; no human usefulness claim is made. Phase 8 is NOT_STARTED.

## Phase 8 source-delivery traceability — 2026-09-27

| Requirement | Delivered source | Offline evidence | Runtime status |
|---|---|---|---|
| Family 9 Emotional / Value Movement | `emotional.value_movement`, `Capabilities.EmotionalValueMovement` | focused source/capability tests | pending Codex |
| Family 10 Theme & Meaning | `theme.meaning`, `Capabilities.ThemeMeaning` | focused source/capability tests | pending Codex |
| Family 11 Genre Lens Packs | `genre.lens_pack`, `Packs`, `GenrePack`, `Catalog`, six optional core packs | pack/capability/source tests | pending Codex |
| safe custom/hybrid pack | trust/source/ref/salience/intent/resource validation; install != enable | pack tests + doc examples | pending Codex |
| constrained declarative lens | `Fount.Observe.DeclarativeLens` through registered projection/question/lens machinery | Observe/source tests | pending Codex |
| Family 12 Revision Intelligence | `revision.intelligence`, explicit before/after runner + `compare_revision` | revision capability/runner tests | pending Codex |
| revision presentation != diegetic != story time | source diff, StoryWorld transition/story-time and Reader trajectories kept separate | revision tests | pending Codex |
| protected strengths/collateral/causal ripple | revision comparison packet fields | revision tests | pending Codex |
| strategy distinctness without winner | existing StrategyContrast composition | runner tests | pending Codex |
| preserve ten playbook IDs/defaults | WriterRegistry IDs unchanged; character default unchanged | architecture/source/runner tests | pending Codex |
| no direct provider/runtime boundary leak | no Phase-8 direct SystemOneSDK/Inference/ASM use | source/API inspection | pending compiled architecture gate |
| stop before Phase 9 | Workshop source unchanged; candidate remains nil | overlay inventory/source guard | PASS offline |

This is source traceability only. Runtime verification/repair remains required before Phase 8 can be marked COMPLETE.

## Phase 8 runtime QC traceability — 2026-09-27

At Fount `f7f4d68` (tree `5b12527`), all twelve family IDs and four Phase-8 Observe assets, safe custom-lens/pack validation and explicit enablement, opt-in genre and Emotional/Value routing, Theme counterevidence, explicit two-revision comparison, retained Reader-state changes, separate character/relationship/causal/story-time effects, nil generated candidate and Phase-9 stop line are verified by focused and full tests. Full `mix ci` passed 320 ExUnit tests with compiled architecture, strict Credo, Dialyzer and ExDoc; 64 Python tests, four archives, isolated Core/Workshop PostgreSQL integrations (11/14), representative prior-family/Core regressions and writer accept/reject/PDF/table-read demonstrations passed. See `handoffs/PHASE_08_RUNTIME_QC_REPORT.md` and `handoffs/PHASE_08_FILE_INVENTORY.json` for commands, defects, repairs and hashes. Optional human/domain review remains NOT RUN under D046; no human validity or usefulness claim is made. Phase 8 is **COMPLETE**; Phase 9 is **NOT_STARTED**.
## Phase 9 source-delivery traceability — 2026-09-27

| Phase-9 requirement | Delivered source surface | Offline evidence | Runtime state |
|---|---|---|---|
| provider-free workflow/resource preflight | `FountWorkshop.preflight/3`, `Session.preflight/3`, Intelligence bridge | focused/source tests | pending Codex |
| prewrite diagnosis before supported revisions | `Writing.Preparation` → `Writing.Intelligence.enrich_preparation/5` → public Intelligence playbooks | source/API inspection | pending Codex |
| Store + Inference-only preservation | Observe optional; explicit `not_run` packet | source tests | pending Codex |
| note reaction/cause/treatment separation | Phase-9 note triage | focused/source tests | pending Codex |
| diagnosis → strategy → candidate lineage | Strategy + Generation + Candidate provenance | source tests | pending Codex |
| causally distinct alternatives | semantic-signature duplicate guard | source test | pending real generation |
| analysis-guided context | compact writer packet in `Context.prompt_data/2` | source inspection | pending Codex |
| pre/post candidate analysis | prewrite writer packet + explicit base/candidate `revision_regression` in `Candidate.check/4` | focused/source tests | pending Codex |
| protected strengths/collateral | advisory revision checks + review packet | focused/source tests | pending Codex |
| propagation/consequence visibility | strategy consequence proposals + revision causal ripple | source tests | pending Codex |
| investigate without pages | preserved investigate preparation/materialization behavior | source review | pending regression |
| writer presentation contract | separately named writer/revision packet, lineage, note/resource/consequence fields | source review | pending Codex |
| actual resource usage | candidate/session/review/audition metadata | source review | pending Codex |
| explicit acceptance | Core ReviewGate unchanged; Phase-9 checks advisory | source tests | pending accept/reject regression |
| external boundaries | no direct SystemOneSDK/ASM/Inference-complete call in new bridge | boundary scan | pending compiled architecture |
| stop before Phase 10 | no durable analysis persistence/recompute implementation | source-contract test | PASS offline |

This is source-delivery traceability only. Phase 9 is **OFFLINE_IMPLEMENTED**, not COMPLETE. Runtime verification/repair remains required; Phase 10 is **NOT_STARTED**.

## Phase 9 runtime QC traceability — 2026-09-27

The 19 delivered paths matched before repair. Focused tests, the 325-test full CI, 73 Python tests, compiled architecture, offline handoff, 11 Core and 15 Workshop PostgreSQL integration tests, and the new Sandbox/scripted-Inference two-strategy writer loop pass at Fount `361a9fd`. The writer loop verifies provider-free preflight, prewrite packet, distinct strategies, lineage, real candidate pages, exact diff, postwrite revision packet, advisory checks, explicit rejection, content-hash protection, acceptance, reload and history. Existing Workshop/Core suites preserve generation-only callers, direct legacy candidate checks, investigate without pages, audition/combine/rebase, required-only review, and PDF/table-read/export behavior. Full evidence and limits are in `handoffs/PHASE_09_RUNTIME_QC_REPORT.md`. Optional human review is NOT RUN under D046; Phase 9 is **COMPLETE** and Phase 10 **NOT_STARTED**.

## Phase 10 source-delivery traceability — 2026-09-27

| Requirement | Source / test evidence | Source-delivery status |
|---|---|---|
| durable analysis runs + audit identity | `Fount.Persistence.Analysis`; Phase-10 migration/schema; `Fount.Intelligence.Persistence` | WRITTEN; runtime unrun |
| immutable cross-revision MeasurementResult reuse + fresh current Observation | `Persistence.MeasurementCache`, `record_batch/3`, existing Observe cache semantics; `phase_ten_durable_analysis_test.exs` | WRITTEN; runtime unrun |
| privacy/output/model/context identity | namespace-scoped L2 rows; output-contract digests; Observe durable fingerprint gate | STATIC inspected; runtime regressions pending |
| cache retention distinct from history | explicit `evict_cache`; separate runs/observations/dependencies/candidates | WRITTEN; runtime unrun |
| connected StoryWorld + Reader suffix recomputation | `Fount.Intelligence.Recomputation`; `phase_ten_recomputation_test.exs` | WRITTEN; runtime unrun |
| diagnosis/report dependency history | `analysis_dependencies`; `affected_records/3` latest-applicable selection with per-run rows | WRITTEN; runtime unrun |
| candidate/session analysis history + report export | Workshop session/candidate lineage; `export_analysis_run/2`; usage history | WRITTEN; runtime unrun |
| safe project/studio assets | host-gated `save_lens`, `save_genre_pack`, `save_data_asset`; content hash/trust/source + executable-key rejection | WRITTEN; runtime unrun |
| Phase-10 writer outcome | `packages/fount_workshop/integration/phase_ten_resume_history_test.exs` | WRITTEN; NOT_RUN |
| Phase-9 writing functionality preserved | opt-in durable analysis, unchanged acceptance/rejection code, retained Phase-9 source tests | 18 targeted Phase-9/10 Python source tests PASS; Elixir runtime pending |
| Phase-11 stop line | source guard + overlay inventory contain no Phase-11 implementation | PASS offline |

Overlay/static evidence: 27-operation strict archive, dry-run/apply/result hashes/tree reproduction/idempotence PASS. Repository-wide Python discovery is not claimed as passed because the supplied XML omits the tracked cleanup helper imported by its test. Elixir/Mix/PostgreSQL/compiled architecture/Credo/Dialyzer/ExDoc/package/writer runtime gates are **NOT_RUN**. Phase 10 is **OFFLINE_IMPLEMENTED**, not COMPLETE; Phase 11 is **NOT_STARTED**.

## Phase 10 runtime QC traceability — 2026-09-27

All 27 overlay paths matched their delivered hashes and byte counts before repair. Fount `6d164f6` (tree `9a94735`) passes full `mix ci` with 328 tests, 82 Python tests, the offline handoff and compiled architecture checks, strict Credo/Dialyzer/ExDoc, four package archives, disposable PostgreSQL migrations and Core/Intelligence/Workshop integration suites. Focused tests prove same immutable MeasurementResult reuse across revisions with a fresh current Observation, context and namespace misses, output-contract/cache poisoning and mutable-alias policy, retained audit/resource history after explicit cache eviction, StoryWorld connected-region plus Reader suffix recomputation, and host-gated data-only assets. The writer resume test preserves a rejected branch, a proposed unchosen branch, its durable analysis history, no generation call and unchanged accepted head. Full commands, limitations and repair history are in `handoffs/PHASE_10_RUNTIME_QC_REPORT.md`. Optional human usefulness review was skipped under D046 and remains validation debt. Phase 10 is **COMPLETE**; Phase 11 is **NOT_STARTED**.

## Phase 11 source-delivery traceability — 2026-09-27

| Requirement | Source / asset | Current evidence |
|---|---|---|
| rights-cleared corpus and provider-export policy | `Evaluation.CorpusManifest`; `corpus_manifest.synthetic.json` | source-written; synthetic fixture only |
| independent human semantic labels and disagreement | `Evaluation.Annotation`; `reader_annotations.synthetic.json` | source-written; no real readers claimed |
| calibration/abstention/ordinal metrics | `Evaluation.Metrics` | ExUnit written; Python source contract PASS; Elixir unrun |
| descriptive model/provider drift | `Evaluation.Drift` | ExUnit written; live Observe path written, not run |
| frozen current-contract MeasurementResult/Observation benchmark | `Evaluation.Benchmark`; `frozen_concealment_fixture.json` | exact output-contract and fixture digests independently recomputed by Python PASS; Elixir unrun |
| stale contract fails / explicit regeneration / no compatibility decoding | `Benchmark.validate/2`, `regeneration_plan/2` | ExUnit written; static source contract PASS |
| nonlinear first-exposure/story-time regression | `nonlinear_story_time.synthetic.json`; `phase_eleven_nonlinear_benchmark_test.exs` | written; runtime unrun |
| all 12 capability families covered | `Evaluation.Suite`; `phase_eleven_suite.json` | Python source contract PASS; ExUnit written |
| robustness/security/budget regression permanence | existing Observe sandbox/execution/provider tests referenced by Phase-11 source gate | source guard PASS; runtime regressions pending |
| longitudinal estimate vs actual resource units | `Evaluation.Resources`; Phase-11 durable-history integration | written; PostgreSQL unrun |
| Observe live QC | `packages/fount_observe/examples/phase_eleven_live.exs` | explicit opt-in; NOT_RUN |
| Workshop small live generation QC | `phase_eleven_qc` LiveExample + wrapper | explicit opt-in; NOT_RUN; no canon acceptance |
| support/validity separate from writer usefulness | evaluation suite contract/docs | source-written; no human usefulness claim |
| package/dependency boundaries preserved | no direct SystemOneSDK/Inference/ASM calls from evaluation layer | Python boundary source check PASS; compile/architecture pending |
| preserve Phase 9/10 | Phase-9/10 Python source-contract suites | 18/18 prior-phase targeted tests PASS within 27-test combined run |
| stop before Phase 12 | no Phase-12 implementation in delivered evaluation roots; progress remains NOT_STARTED | source check PASS |

Offline strict archive evidence: 36 operations, ZIP CRC PASS, dry-run PASS, apply PASS, intended 577-file tree reproduction PASS, second dry-run all `unchanged` PASS. Repository-wide Python discovery is **not** claimed green: 88 tests ran with one import error because the supplied XML omitted `scripts/prune_deleted_directories.py` while including its test. Elixir/Mix/PostgreSQL/compiled architecture/Credo/Dialyzer/ExDoc/package/provider-free Mix examples/live Observe/live Workshop/human study are **NOT_RUN**. Phase 11 is **OFFLINE_IMPLEMENTED**, not COMPLETE; Phase 12 is **NOT_STARTED**.

## Phase 11 runtime QC checkpoint — 2026-09-27

The preceding source-delivery table remains historical. The applied 36 overlay paths matched delivered hashes before QC repair. Root `mix ci` passed 337 ExUnit tests, compiled architecture, strict Credo, Dialyzer and ExDoc; Python discovery passed 91 tests and focused Phase-9/10/11 source checks passed 27. Focused Intelligence Phase-11 tests passed 9, Observe robustness tests 21, and disposable PostgreSQL Core/Intelligence/Workshop suites passed 11/4/16 respectively. The Intelligence database run includes the Phase-11 resource-history test and three Phase-10 durability tests. Four package archives contained the new evaluation JSON and guide without build or secret files. The provider-free example emitted rights policy, independent disagreement, exact metrics, current frozen contract, all 12 families, nonlinear fixture and resource comparison. See `handoffs/PHASE_11_RUNTIME_QC_REPORT.md` for exact commands, digest, repairs and limitations.

The user supplied `gpt-6-luna` for Workshop and the default JEV for System One. Live Observe passed three synthetic `jev-latest` measurements (reported `jev-1.13.0`) with current output-contract digest and per-run resource accounting; baseline-to-last L1 was zero with unchanged selection/identity. The first Workshop live run failed exact strategy-ID validation; after a Phase-11-only prompt repair, `gpt-6-luna` produced exactly one nonaccepted candidate, review/export artifacts, four inference calls, zero measurement states, and an unchanged accepted head. Final full CI passed. Human/domain study is `NOT_RUN` optional D046 validation debt. Phase 11 is `COMPLETE`; Phase 12 remains `NOT_STARTED`. Live repeatability is not empirical calibration, reader agreement or writer usefulness.

## Phase 12 source-delivery traceability — 2026-09-27

| Requirement | Phase-12 source evidence | Offline status | Runtime state |
|---|---|---|---|
| W01 Draft/Explore/Inspect/Revise | workflow schema + `Discovery.current_mode`/mode history + resume view | source check PASS | pending Codex |
| W01 no forced analysis in Draft | store-only `Session.open/4`; develop has no prewrite playbook | written regression | ExUnit NOT_RUN |
| W01 provider-free capture/edit/accept | new discovery/manual CLI surfaces; paid client acquisition excludes them | source check PASS | PostgreSQL example NOT_RUN |
| W02 evolving brief | `Discovery.update_brief/4`; effective request overlay on later work | source review PASS | pending Codex |
| W02 fragments/adoption/retirement | fragment lifecycle and history | written regression | ExUnit NOT_RUN |
| W02 reverse outline/reorder noncanonical | source IDs + interpretation label; exact permutation branch proposal | written regressions | ExUnit NOT_RUN |
| W03 action/revelation/relationship treatments | Request treatment validation + Strategy binding/tradeoffs/departure | source check PASS | ExUnit NOT_RUN |
| W03 reject-all/keep-both/no winner | durable writer decisions; acceptance unchanged | written regression | ExUnit NOT_RUN |
| A01 pool/map resume | generated 3 routes; one accepted, one rejected, one proposed; protected map + pending question survive | `phase_twelve_a01_demo_test.exs` | NOT_RUN |
| A02 fact vs interpretation | quiet key source fact; forgiveness only interpretation; untouched source retained | `phase_twelve_inspect_test.exs` | NOT_RUN |
| A03 paraphrase control | three material mechanisms vs three confession paraphrases rejected | scene exploration test | NOT_RUN |
| A10 stale/idempotent resume | manual/edit/accept retry/stale sibling/reject/resume | discovery test | NOT_RUN |
| W11 finite/capped work | existing Session budgets/preflight retained; provider-free paths make no paid-client request | source review PASS | full runtime regression pending |
| dependency boundaries | Workshop→Inference generation; Observe→SystemOne measurement; ASM only behind Inference | API/source inspection PASS | compiled architecture pending |
| Phase-12 stop line | Phase-12 delivery itself contains no Phase-13 implementation | source contract PASS | historical Phase-12 stop satisfied; Phase 13 implemented separately in the next delivery |

Phase 12 remains `OFFLINE_IMPLEMENTED`: creative usefulness and runtime correctness are not inferred from the static checks.

## Phase 12 runtime QC closure — 2026-09-27

The five focused Phase-12 ExUnit tests plus a treatment-validation regression pass; a new real PostgreSQL integration test proves W02 effective-brief execution and A10 stale/idempotent acceptance. Full `mix ci` passes 343 tests, compiled architecture, strict Credo, Dialyzer and ExDoc. The disposable-database CLI example verifies W01/W02 writer capture through accepted edited pages and fresh resume; Core/Intelligence/Workshop integration counts are 11/4/17. A01/A02/A03 remain deterministic scripted engineering evidence, not a live-model quality or human-usefulness claim. W11 finite preflight and provider-free command behavior remain visible; no generation or measurement credentials were used for CLI. Phase 12 `COMPLETE`; Phase 13 `NOT_STARTED`. Detailed checks and artifact identities: `handoffs/PHASE_12_RUNTIME_QC_REPORT.md`.

## Phase 13 source implementation trace — 2026-09-27

Status: **OFFLINE_IMPLEMENTED; runtime NOT_RUN; Phase 14 NOT_STARTED.**

| Requirement / acceptance case | Phase-13 source surface | Evidence written | Current status |
|---|---|---|---|
| W04 visual/sound/space/rhythm/transition | Workshop pass profiles + Request/Preparation/Generation/Pass | `phase_thirteen_pass_profiles_test.exs`; A02 comparison fixture | WRITTEN; ExUnit NOT_RUN |
| A02 quiet unresolved tenderness | actual visual/stillness and offscreen-sound candidate pages; untouched base retained | `phase_thirteen_comparison_test.exs` | WRITTEN; ExUnit NOT_RUN |
| A02 reject explanatory generic control | explicit saved generic dialogue candidate rejected | comparison test | WRITTEN; ExUnit NOT_RUN |
| W06 exact voice protection | `Writing.VoiceProtection` -> required `pin_text` constraints on existing Constraints/ReviewGate path | voice test | WRITTEN; ExUnit NOT_RUN |
| A04 repeated/multilingual/clipped text | exact protected repeated multilingual dialogue + cue survive action edit; normalized dialogue fails | `phase_thirteen_voice_test.exs` | WRITTEN; ExUnit NOT_RUN |
| W06 language competence limit | context says similarity is not quality and does not certify language/cultural authenticity | VoiceProtection + guide | SOURCE INSPECTION |
| W05 noncanonical rehearsal | Session progress only; explicit adopt/reject; only adopted material enters later exploration context and remains `canonical: false` | `FountWorkshop.Rehearsal`; rehearsal test | WRITTEN; ExUnit NOT_RUN |
| A05 invented boat history isolation | active/rejected claim absent from later context; adopt is traceable | rehearsal test | WRITTEN; ExUnit NOT_RUN |
| mechanical candidate comparison | stable-ID `Fount.Screenplay.diff/2`; generator summary labeled claim/non-evidence | `FountWorkshop.Comparison`; comparison test | SOURCE INSPECTION / ExUnit NOT_RUN |
| canon authority | Acceptance/ReviewGate remain sole canonical gate; rehearsal/comparison do not accept | preservation audit | SOURCE INSPECTION |
| actual API/dependency use | Workshop generation through Inference/ASM adapter; analysis through Observe/SystemOneSDK; no new dependency | Phase-13 inputs + source | SOURCE INSPECTION |
| Phase-14 stop line | no W07–W09 implementation | inventory + source test | PASS |

Offline execution: Phase-13 Python source checks 7/7 PASS; focused Phase-9–13 checks 41/41 PASS; strict 24-operation overlay transport and 614-file applied-tree identity PASS. Repository-wide Python discovery has one known supplied-snapshot missing-helper import error. Mix/Elixir/Erlang are unavailable, so no runtime/ExUnit/PostgreSQL/live/human result is claimed. Optional human review is NOT_RUN under D046.

## Phase 13 runtime QC trace — 2026-09-27

The source-delivery table above records the historical offline state. At Fount repair commit `26da17e`, Phase 13 is `COMPLETE` on applicable non-human gates. W04/A02: four pass profiles validate and two real quiet-scene page diffs have distinct action changes and zero language change; a generic explanatory control is rejected. W06/A04: required exact `pin_text` checks pass an action-only edit and hard-block altered repeated/multilingual text through `ReviewGate`, including an attempted override; the human language-competence limit stays visible. W05/A05: active/rejected rehearsal inventions are absent from generation context, while explicit actor/note adoption is persisted as noncanonical project material; fresh PostgreSQL resume retains both decisions and unchanged canon. `Comparison` derives changes through stable-ID `Screenplay.diff/2` and labels proposal summaries as non-evidence. Full `mix ci` (347 tests), Python (105), PostgreSQL integrations (33), four package builds and writer/PDF/table-read regressions pass. Optional D046 human/domain review and live-provider calls are `NOT_RUN`. See `handoffs/PHASE_13_RUNTIME_QC_REPORT.md`. Phase 14 is `NOT_STARTED`.
