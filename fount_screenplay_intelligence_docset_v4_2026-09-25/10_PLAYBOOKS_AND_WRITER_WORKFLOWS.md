# Playbooks and Writer Workflows

## 1. Purpose

A playbook is a registered composition of analyses for a writer-facing task. It is the bridge between low-level measurements and useful work.

A writer should ask for “diagnose why the interrogation sequence stalls,” not manually schedule 37 sensors.

## 2. Playbook structure

Conceptually:

```text
Playbook
  logical id/content hash
  intent schema
  required inputs
  scope rules
  observation plan
  temporal reducers
  reader reducers
  diagnostic evaluators
  optional comparison stages
  output packet schema
  budget policy
  genre/lens packs
```

The playbook is data plus references to registered code primitives. It is not an arbitrary workflow language.

## 3. Closed registry

All executable stages must be registered. A model may select among allowed playbooks/sensors/diagnoses if the caller permits, but it cannot name arbitrary modules or functions.

This preserves a valuable safety property of the superseded Probe closed catalog while moving the organizing abstraction from “tool” to “writer task.”

## 4. Shared acquisition

Playbooks should deduplicate overlapping work.

If dialogue pass and relationship pass both require status/tactic observations over the same turns, acquire once and share observations by fingerprint.

If several diagnoses need the same character timeline, reduce once.

## 5. Core playbooks

### Scene Doctor

Uses scene engine, character objective, opposition, stakes, tactic, turn, decision, consequence, entry/exit, relationship and reader-handoff observations.

Outputs:

- scene state map;
- candidate strengths;
- candidate problems;
- competing diagnoses;
- surrounding-sequence implications;
- optional treatment strategies.

### Dialogue Pass

Uses response/evasion, tactic, subtext/directness, exposition, redundancy, voice, status/leverage, knowledge asymmetry, turn length/rhythm, and relationship change.

Outputs are organized by **exchange and scene**, not only line flags.

### Character Trajectory Pass

Uses goals, wants hypotheses, decisions, caused consequences, beliefs, knowledge, adaptations, relationships, commitments, and key losses/gains across the feature.

### Relationship Pass

Builds pair/group timelines and identifies significant transitions, long stasis, unsupported reversals, asymmetric knowledge, obligation, trust, intimacy, leverage, and allegiance.

### Suspense / Thriller Audit

Uses reader knowledge, character knowledge, threat state, proximity/deadline, open questions, anticipation, causal constraints, reversals, and payoff timing.

It must not assume every thriller uses the same tension curve.

### Sequence Momentum Pass

Uses sequence objective, escalation dimensions, state-change density, reversals, consequences, repeated function, and handoff pressure.

### Setup / Payoff Audit

Traces setup lifecycles, orphaned setups, unsupported payoffs, reinforcement, timing, transformation, motif echoes, and revision breakage.

### Notes Diagnosis

Takes raw notes, separates reaction/cause/treatment, gathers evidence, proposes competing diagnoses, identifies conflicts and protected strengths, and prepares strategies for workshop.

### Submission Read

A holistic but non-scoring pass using the broad industry dimensions in `01_INDUSTRY_EVALUATION_AND_READER_CRITERIA.md`: story journey, voice, characters, craft, reader desire, theme/meaning, originality hypotheses, clarity, pacing, and presentation.

Output should resemble a rigorous development memo with traceable evidence, not pretend to predict contest results.

### Revision Regression Pass

Compares base and candidate across target concerns and collateral dimensions.

## 6. Genre lens packs

Genre packs influence which questions and diagnoses are salient. They do not replace the base story model.

Examples:

### Mystery

- question lifecycle;
- clue visibility;
- candidate-answer distribution;
- red herring support;
- reveal fairness;
- explanation load.

### Thriller

- threat knowledge;
- pursuit/control;
- time pressure;
- narrowing options;
- suspense/reversal cadence.

### Horror

- threat visibility/uncertainty;
- vulnerability/isolation;
- rule learning;
- dread versus shock;
- escalation of cost.

### Romance

- attraction/intimacy/trust;
- obstacle;
- vulnerability;
- commitment;
- relational reversals;
- earned union/separation.

### Comedy

- comic premise/expectation;
- setup/payoff;
- escalation/reversal;
- status;
- callback;
- rhythm;
- character-specific comic engine.

### Action

- objective clarity;
- spatial clarity;
- cause/effect;
- escalating constraint;
- resource depletion;
- consequence and recovery.

Genre packs should be optional and combinable.

Pack composition is declarative and must follow `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`. A new pack does not require Elixir code when it only composes installed safe primitives. Executable primitives remain closed/registered.

## 7. Writer intent in playbooks

Every playbook should accept intent context where relevant:

- desired reader experience;
- genre/anti-genre intent;
- protected strengths;
- note priorities;
- deliberate ambiguity;
- character arc design;
- tonal target;
- sequence purpose.

Without intent, output language should remain more tentative.

## 8. Investigation playbooks versus rewrite playbooks

Two modes:

### Investigate

Returns observations, timelines, diagnoses, and strategies. Does not create screenplay pages.

### Revise

Consumes selected diagnoses/strategies and hands them to `fount_workshop` for candidate generation/editing.

A user should be able to stop after investigation.

## 9. Writer-facing result packet

All writer-facing playbook output follows `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.

At minimum the packet preserves:

```text
playbook ref
source revision
writer concern / intended experience
claim class
coverage
source evidence
state/trajectory refs
diagnoses
counterevidence / alternatives
uncertainty / missing evidence
protected strengths
recommended next investigations
strategies (if requested)
revision comparison (if applicable)
resource preflight/actual usage
errors/missing coverage
provenance
non-claims / limitations
```

The repository should ship a deterministic reference renderer so human reviewers can inspect the same packet before a rich UI exists.

## 10. Resource preflight

Before expensive acquisition begins, a playbook should expose an estimate/capability summary covering expected targets, model/provider work, known reuse, optional enrichment, and applicable caller/studio caps.

The same run records actual usage afterward. See `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.

## 11. No universal “health score”

A playbook may provide counts, distributions, comparisons, and confidence measures. It must not manufacture a single overall screenplay health number unless a future explicit product requirement introduces a clearly labeled, calibrated, purpose-specific score.