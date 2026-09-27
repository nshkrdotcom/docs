# Phase 3 implementation matrix — Story-World Pure Core

**Source-writing status:** OFFLINE_IMPLEMENTED. This matrix maps the complete Phase-3 source scope to concrete files/tests. Runtime and human/domain results remain separate.

| Phase-3 requirement | Implementation | Verification source | Offline status |
|---|---|---|---|
| provider-free StoryWorld model | `Fount.Intelligence.StoryWorld`, compiler, values | architecture test + source scans | implemented, runtime unrun |
| entities / mentions | canonical cast/mention scaffolding plus explicit `entity` records | records test | implemented |
| events / interactions | canonical scene events plus evidence-backed explicit events/interactions | records test | implemented |
| assertions / facts | qualified `Assertion` values and `facts_at/2` | records/reference tests | implemented |
| goals/objectives | `Goal` values | records test | implemented |
| commitments/obligations | `Commitment` values | records test | implemented |
| possession/access/resources | generic event-qualified `StateTransition` attribute model | temporal test | implemented |
| diegetic knowledge/belief/suspicion | assertions with `epistemic_owner`, `story_time_refs`; `knowledge_at/4` | records test | implemented |
| presentation points | canonical scene/element coordinates stored independently from story time | compiler/reference renderer | implemented |
| narrative/reality scopes | base + recollection/dream/hypothetical/alternate/contested scopes | scope test | implemented |
| partial story-time graph | `StoryTimeNode`, `StoryTimeConstraint`, `StoryTime.Graph` | temporal tests | implemented |
| relation vocabulary | before/after/meets/overlaps/same_time/during/contains/starts_with/ends_with | temporal module/tests/docs | implemented |
| unknown/ambiguous relations | `:unknown` and `:ambiguous` packets; no source-order fallback | temporal test | implemented |
| temporal contradiction with evidence | direct incompatible relation intersection + strict-cycle conflicts | contradiction test | implemented |
| causal graph independent from time | typed `CausalRelation` and traversal | scope/causality test | implemented |
| state-transition pre/postconditions | stored on `StateTransition`; local consistency checks for conflicting writes/prior-state mismatch | temporal/records source | implemented |
| practical consistency, not theorem prover | direct temporal contradictions, strict cycles, local state conflicts only | StoryTime/Consistency | implemented |
| beat interpretations | `Beat` values, competing alternatives/evidence | records test | implemented |
| motifs/promises | `Motif` + `Commitment` | records test | implemented |
| competing interpretations | alternatives fields, ambiguous temporal sets, competing assertion groups | reference packet | implemented |
| source/evidence dependencies | exact Evidence values + revision/excerpt revalidation + dependency refs | stale-evidence/reference tests | implemented |
| pure compile canonical + observations | `StoryWorld.compile/3` | all StoryWorld tests | implemented |
| query API | state/facts/knowledge/story-time/causal/evidence/dependency queries | temporal/records tests | implemented |
| counterfactual primitives | dependency/support removal analysis, no page generation | reference test | implemented |
| connected recomputation model | reverse `DependencyIndex` and `affected_by/2` | records/counterfactual tests | implemented |
| writer-facing inspection packet | concern/question, evidence, derived state, uncertainty, protected strengths, empty diagnosis/strategy | reference test | implemented |
| deterministic Markdown/JSON | `Renderer.markdown/2`, `Renderer.json/2` | deterministic replay/reference test | implemented |
| Phase-2 extraction preservation | legacy extraction kinds normalize into richer StoryWorld records | records preservation test | implemented |
| no stale source promotion | observation/evidence screenplay/revision/excerpt checked before compile | stale-evidence test | implemented |
| architecture gate purity | no Observe execution/provider/Repo/IO/clock/random dependencies in new pure namespace | architecture test + source scans | implemented, compiled gate unrun |
| Phase-3 provider-free writer demo | `packages/fount_intelligence/examples/phase_three.exs` | Codex runtime handoff | written, unrun |
| Level-A structural/factual pilot | review packet/protocol in `PHASE_03_DOMAIN_REVIEW_PACKET.md` | actual human review required | **PENDING; not fabricated** |

## Required acceptance cases represented in tests

1. Flashback does not inherit later-presented state — `story_world_temporal_test.exs`.
2. Death/injury/possession is event/story-time qualified — same test uses life-status and possession transitions.
3. Simultaneous/overlapping events need no fabricated order — overlap case.
4. Unknown chronology remains unknown — unknown pair case.
5. Temporal contradiction cites evidence — incompatible direct constraints case.
6. Ambiguous chronology abstains — multi-relation case.
7. Dream/alternate scope does not corrupt base state — `story_world_scope_causality_test.exs`.
8. Causal direction remains independent from presentation/story time — causal relation deliberately points opposite a known temporal relation.

## Explicitly not advanced

Phase 4 Reader reduction/reader snapshots, diagnosis, playbook-shell acquisition, capability-family expansion, durable L2 persistence, and Workshop integration are not part of this overlay.
