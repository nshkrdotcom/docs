# Diagnosis System

## 1. Purpose

`Fount.Intelligence.Diagnosis` is the pure-core layer that answers **“what might be causing this?”** It combines source evidence, atomic observations, story-world assertions, temporal state, reader state, and writer intent.

It does not generate screenplay pages and it does not convert a reader complaint directly into a fix.

## 2. Inputs

A diagnosis evaluator may consume:

- one normalized `Concern`;
- source revision and scope;
- `Observation` records;
- story-world assertions/events;
- timeline snapshots;
- reader-state snapshots;
- writer intent;
- deterministic metrics;
- prior notes/reactions;
- revision comparisons.

## 3. Output contract

A diagnosis is an evidence-backed hypothesis:

```text
Diagnosis
  id
  code
  concern_id
  scope
  hypothesis
  support
  counterevidence
  uncertainty
  alternatives
  missing evidence
  protected strengths
  suggested next investigations
  provenance / asset ref
```

No diagnosis may omit source/evidence lineage when it makes a claim about the screenplay.

## 4. Diagnostic families

### Local mechanics

- unclear scene objective;
- no effective opposition;
- stakes not legible;
- urgency absent where intended;
- tactic repetition;
- turn/decision/consequence missing;
- post-outcome linger;
- pre-conflict preamble.

### Causal/agency

- protagonist/reactor pattern;
- major event insufficiently caused;
- action inconsistent with available knowledge;
- convenient behavior lacking motivation support;
- consequence disconnected from prior choice;
- duplicated causal support.

### Character trajectory

- stated goal not pursued;
- abrupt goal change;
- belief shift without catalyst;
- repeated failure without adaptation;
- arc intent unsupported;
- deliberate steadfast arc recognized rather than mislabeled.

### Relationship

- long static run;
- leverage change without event;
- intimacy/trust shift without support;
- betrayal with inadequate prior relationship investment;
- repeated interaction pattern without new consequence.

### Reader experience

- reveal likely telegraphed;
- reveal unsupported;
- mystery question absent before answer;
- intentional question dropped;
- suspense knowledge gap collapses early;
- comprehension risk;
- scene handoff loses active forward vector;
- prolonged setup without reinforcement/reward.

### Sequence

- repeated scene function;
- no escalating constraint;
- outcome reset;
- local objective already resolved before sequence ends;
- consequences deferred too long;
- subplot interrupts without productive pressure exchange.

### Dialogue

- exposition redundancy;
- repeated tactic;
- low response relation;
- voice interchangeability;
- subtext/directness mismatch with intent;
- conversation changes no relevant state;
- status negotiation static where conflict depends on it.

### Setup/payoff

- orphaned setup;
- payoff without setup;
- premature payoff;
- over-signaled payoff;
- callback without transformation;
- setup invalidated by revision;
- competing setup chains causing confusion.

### Emotional/value movement

- repeated emotional condition;
- major event receives little reaction/consequence;
- reversal not prepared;
- declared feeling substitutes for dramatized change;
- value change inconsistent with action.

### Theme/meaning

Only cautious, evidence-based hypotheses:

- thematic question introduced but not revisited;
- character choices provide contradictory thematic signals;
- recurring motif disconnected from decisions;
- ending appears to resolve a different value conflict than the one developed.

These are never authoritative statements of “the theme.”

## 5. Diagnosis rules versus machine synthesis

Prefer deterministic diagnosis evaluators over generative prose whenever the rule can be expressed clearly.

Example:

```text
IF
  sequence has >= N scenes
  AND focal objective unchanged
  AND relationship state unchanged
  AND no new major consequence
  AND repeated-information evidence present
THEN
  emit candidate diagnosis: repeated dramatic state / low movement density
```

Exact numeric criteria must be calibrated; this example is structural only.

Generative explanation, if added later, should synthesize already-grounded diagnosis records rather than discover facts from the whole screenplay unsupervised.

## 6. Counterevidence

Every important diagnosis evaluator should actively search for reasons the diagnosis might be wrong.

Example for “passive protagonist”:

Support:

- few causal edges from protagonist decisions;
- repeated external-event initiation;
- stated goal but no pursuit actions.

Counterevidence:

- deliberate survival story intent;
- protagonist's refusal itself causes consequences;
- meaningful internal/relationship decisions drive later events;
- ensemble structure distributes agency.

Counterevidence improves trust and reduces doctrinaire advice.

## 7. Competing hypotheses

For one concern, return several diagnoses when warranted.

Example concern: `"The midpoint feels flat."`

Possible diagnoses:

- expected reveal already inferred;
- event changes plot facts but not character goal/relationship;
- stakes remain same after event;
- sequence had already peaked two scenes earlier;
- prior setup insufficient, so event lacks meaning;
- transition into midpoint scene is over-explained.

The writer can inspect evidence and choose which interpretation fits the intended movie.

## 8. Severity and priority

Avoid universal severity labels for subjective craft diagnoses.

Possible operational fields:

- `scope_reach`: local / sequence / whole-script;
- `evidence_strength`;
- `intent_mismatch`;
- `note_convergence`;
- `revision_risk`;
- `required_constraint` when a writer/project explicitly marks one.

A playbook can sort by these dimensions without claiming objective artistic severity.

## 9. Suggested investigations

When evidence is insufficient, diagnoses should request more analysis rather than fabricate certainty.

Examples:

- run reader-question trace around scenes 20–32;
- inspect Mara/Dan relationship leverage timeline;
- compare objective/tactic sequence before and after midpoint;
- ask writer whether ambiguity is intentional;
- inspect alternate causal support before recommending scene deletion.

## 10. From diagnosis to strategy

A diagnosis may expose strategy **classes**, not final prose:

```text
compress repetition
move setup earlier
move payoff later
change who causes event
add consequence rather than explanation
remove misleading premise
clarify objective
change relationship outcome
replace exposition with observable event
merge duplicate scene functions
```

`Fount.Intelligence.Playbooks` owns analytical investigation/orchestration; `fount_workshop` owns execution of creative strategies that produce candidate pages or edits.
