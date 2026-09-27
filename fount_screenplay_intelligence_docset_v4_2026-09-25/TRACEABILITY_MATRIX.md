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
| H01 | Four XML inputs with exact source identity | every pass | document 35 packet audit |
| H02 | User applies/commits; Codex verifies/repairs | every pass | application/QC commit record |
| H03 | Actual SystemOneSDK facade and answer semantics | 1/2/9 | document 34 SDK contract tests |

Every phase also performs its demonstration from document 36. Research R01–R10 motivates W01–W12, but citations alone do not satisfy implementation or human-validation gates.

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
