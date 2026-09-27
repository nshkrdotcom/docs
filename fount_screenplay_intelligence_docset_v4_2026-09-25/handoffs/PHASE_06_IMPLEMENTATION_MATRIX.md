# Phase 6 implementation matrix — Capabilities A: Scene / Agency / Character / Relationship

**Delivery status:** `OFFLINE_IMPLEMENTED`, awaiting runtime QC. Phase 7 is not started.

| Phase-6 requirement | Implementation | Focused evidence written | Offline status |
|---|---|---|---|
| four closed capability families | `Fount.Intelligence.Capabilities` dispatches `scene_engine`, `agency_causality`, `character_trajectory`, `relationship_dynamics` | `phase_six_capabilities_test.exs`; Python source gate | WRITTEN; Python gate PASS; ExUnit unrun |
| source-grounded semantic measurements | `Acquisition.CapabilityMeasurements` + `Playbooks.CapabilityRunner`; exact selected excerpts are copied into semantic `state.source` and attached as current-revision evidence | runner tests + guide | WRITTEN; runtime unrun |
| closed Observe assets | four declarative lenses: `scene.engine`, `agency.causality`, `character.trajectory`, `relationship.dynamics` | `phase_six_lens_assets_test.exs`; JSON parse | JSON PASS; ExUnit unrun |
| partial coverage instead of false clean result | scene/fragment caps are explicit; cap reach downgrades result/packet to `partial` | runner source/tests | WRITTEN |
| Scene objective/opposition/stakes/urgency/tactics | Scene Engine measurement registry and scene state | capability tests | WRITTEN |
| Scene turns/decisions/reveals/consequences | turn candidates combine measurements with frozen beat changes; consequence/handoff state uses explicit transitions/causal graph | capability tests | WRITTEN |
| Scene entry/exit and sequence contribution | entry/exit deltas, preamble/linger candidates, surrounding causal contribution, counterfactual support, handoff pressure | capability tests | WRITTEN |
| Scene diagnoses | unclear objective, weak consequence, repeated tactic, static state, entry/exit economy, unsupported turn, local redundancy candidates | deterministic pure tests | WRITTEN |
| Agency decision -> action -> consequence | chains use only explicit StoryWorld causal edges | capability tests | WRITTEN |
| Agency alternate support / causal reach / removal | graph alternate support, descendants and `counterfactual_remove/2` | capability tests | WRITTEN |
| Agency consequence latency | explicit story-time relation + presentation event distance + delayed-consequence measurement scenes; presentation distance never creates causality | capability tests | WRITTEN |
| Agency diagnoses | reactive pattern, unsupported causal jump, motivation gap, redundant support, delayed consequence and explicit-intent mismatch | pure source/tests | WRITTEN |
| Character goals/beliefs/knowledge/commitments/adaptation | StoryWorld records plus scene-level measurements retained separately | capability tests | WRITTEN |
| Character trajectory without compulsory transformation | arc choices allow steadfast, tragic, corruption, revelation, cyclical, ensemble, deliberately static, mixed/unclear | capability tests | WRITTEN |
| Reader-visible vs diegetic character state | presentation measurement trajectory remains separate from explicit StoryWorld story-time relations | nonlinear fixture/test | WRITTEN |
| Relationship pair/group state | selection accepts 2+ parties; interactions/transitions/commitments are filtered without collapsing a group to one pair | relationship group test | WRITTEN |
| Relationship dimensions | trust, intimacy, allegiance, leverage, status, dependency, attraction, resentment, obligation, concealment, knowledge asymmetry | source/tests | WRITTEN |
| Directionality/asymmetry | directional transition state preserves A->B separately from B->A; asymmetric views remain inspectable | capability tests | WRITTEN |
| Relationship diagnoses | stasis, unsupported reversal, repeated negotiation, missing consequence, underprepared betrayal/payoff | pure source/tests | WRITTEN |
| non-linear screenplay cases | Phase-6 fixture presents a years-earlier flashback after a present scene while StoryWorld explicitly orders flashback state before present state | character/relationship/agency tests | WRITTEN; ExUnit unrun |
| deterministic Sandbox playbook integration | `scene_doctor`, `character_trajectory` (Character + Agency), and `relationship_pass` exercise all four families through actual `Fount.Observe.Sandbox` | `phase_six_runner_test.exs`; `examples/phase_six.exs` | WRITTEN; runtime unrun |
| writer result contract | Phase-6 playbook runner returns evidence/derived state/trajectory/diagnoses/uncertainty/limitations/resource usage; `candidate: nil` | runner tests | WRITTEN |
| Workshop usefulness mapping | guide maps each family to existing `TargetedRewrite`, `SequenceRebuild`, `CharacterRewrite`, or `Pass` actions after writer strategy selection; no Phase-9 call is added | `guides/capabilities-a.md` | WRITTEN |
| pure-core boundary | capability modules have no Observe acquisition, provider, repo, filesystem/env, clock/random, Workshop or Inference execution | architecture test + direct Python token scan | source scan PASS; compiled gate unrun |
| dependency preservation | no direct new SystemOneSDK, Inference or ASM dependency; System One stays behind Observe and creative completion stays Workshop-owned | source scan/preservation handoff | WRITTEN |
| optional domain review | rights-aware protocol retained; no participants or results invented | `PHASE_06_DOMAIN_REVIEW_PACKET.md` | NOT RUN; validation debt under D046 |

## Writer demonstration represented

A screenplay presents an office negotiation before a years-earlier refusal. The Phase-6 fixture lets Scene Engine inspect scene pressure and entry/exit candidates, Agency trace Mara's explicit choices to later consequences, Character distinguish the reader-visible flashback order from diegetic state movement, and Relationship preserve directional trust/leverage changes without treating the flashback as a present-day regression. The playbook output remains analysis: a writer may later choose Workshop to rewrite pages, but Phase 6 does not generate or accept those pages.

## Stop line

Audience/Reader Experience, Sequence Movement, Dialogue Interaction, and Setup/Payoff/Motifs capability-family implementation belong to Phase 7 and are deliberately absent from this overlay. Codex may repair Phase-6 defects exposed by runtime QC but must stop before Phase 7.