# Emergent Reader Experience Over Time

## Purpose

Fount is currently strongest where screenplay analysis can be attached to a local source span: a continuity fact, a knowledge proposition, a dialogue property, a causal relationship, or a before/after revision difference.

A feature screenplay, however, is experienced **sequentially**. Many of its most important effects do not live in one line or scene. They emerge from accumulated information, changing expectations, emotional investment, repeated choices, delayed resolution, relationship evolution, and the rhythm of revelation and consequence.

This document defines that missing layer and how a system can model it without pretending to read exactly like a human.

## 1. Reader experience is a time series, not a script-wide label

A whole-script judgment such as “suspenseful,” “slow,” “confusing,” or “emotionally engaging” destroys useful information.

The implementation should instead ask what is happening at successive narrative checkpoints:

```text
scene 8:  audience knows threat; protagonist does not
scene 9:  threat gets closer; escape path narrows
scene 10: protagonist pursues unrelated objective
scene 11: audience learns deadline
scene 12: protagonist finally discovers threat
```

The dramatic effect lies in the **trajectory and relations among those states**.

The primary checkpoint hierarchy should support:

- element/turn boundary where necessary;
- inferred beat boundary;
- scene entry/exit;
- sequence boundary;
- user-authored section/act boundary;
- arbitrary writer-selected point.

## 2. Strict forward-reading rule

Reader-state computation must never inspect future material when estimating state at an earlier point.

This rule is critical.

At checkpoint `t`, a reader reducer may use only:

- canonical material at or before `t`;
- deterministic or model observations whose evidence is at or before `t`;
- prior reader-state snapshots;
- writer intent explicitly marked as *reader-visible* by that point.

It may not use:

- later reveals;
- final answers to open mysteries;
- later character confessions;
- downstream causal truth unavailable to the reader;
- a future scene summary generated from the completed script.

This prevents a common analytical error: judging an early mystery using knowledge of its eventual solution.

## 3. Relevant research constructs

Narrative research supports treating engagement as multidimensional rather than one variable. Busselle and Bilandzic's Narrative Engagement framework distinguishes narrative understanding, attentional focus, emotional engagement, and narrative presence. Transportation research similarly studies focused involvement, emotional response, imagery, suspense, and absorption. Research on narrative tension distinguishes suspense, surprise, and curiosity as related but functionally different structures.

Fount should not import psychometric scales as screenplay grades. Their value is conceptual: **human narrative experience decomposes into multiple processes that can rise and fall differently over time.**

## 4. The reader-state model

`Fount.Intelligence.Reader` should maintain an explicit `ReaderState` at each selected checkpoint.

Conceptually:

```text
ReaderState
  knowledge / likely inferences
  open questions
  expectations / predictions
  threats and opportunities
  promises awaiting payoff
  character alignment / concern hypotheses
  uncertainty
  comprehension load
  novelty / repetition context
  anticipation targets
  resolved questions and satisfaction evidence
  surprise candidates
  tone / affect trajectory hypotheses
```

These are not all probabilities. Some are sets, lifecycle records, or distributions.

## 5. Anticipation

Anticipation exists when the screenplay has given the reader reason to expect a future event, confrontation, discovery, decision, or payoff.

Sources include:

- explicit plans;
- threats;
- appointments/deadlines;
- planted objects;
- promised confrontations;
- genre expectations;
- parallel trajectories on a collision course;
- unfinished actions;
- declared goals;
- dramatic irony.

Represent an anticipation target as a lifecycle:

```text
introduced -> strengthened -> delayed -> complicated -> fulfilled
                                     \-> subverted
                                     \-> abandoned
```

Useful measures are duration, reinforcement count, intervening complications, payoff type, and whether the payoff changes state.

## 6. Suspense

Suspense is not synonymous with danger. A useful computational model should consider at least:

- valued outcome;
- uncertainty of outcome;
- anticipated future event;
- stakes/cost;
- perceived proximity or time pressure;
- reader knowledge;
- character knowledge;
- ability to act;
- obstacles/control.

Dramatic irony is one important suspense configuration: the reader knows a threat or fact that a character does not. But suspense also occurs when reader and character share uncertainty.

Do not reduce suspense to one hard threshold. Preserve contributing state so diagnoses can explain *why* a suspense estimate changed.

## 7. Curiosity

Curiosity is organized around missing explanatory information: what happened, why did it happen, who did it, what does this mean, what is the hidden relationship, what is the rule, what is the plan?

Represent curiosity through an **open-question ledger**.

Each question should track:

- introduction point;
- evidence that makes it salient;
- question type;
- likely answer space if inferable;
- current reader confidence in candidate answers;
- reinforcements;
- partial answers;
- contradictions;
- resolution point;
- whether the final answer was already obvious;
- whether the screenplay appears to have stopped caring about the question.

This directly supports “mystery versus confusion.” A reader can have an open question because the screenplay intentionally withheld an answer, or because necessary causal information was unclear. Diagnoses must distinguish those cases.

## 8. Surprise

Surprise is a transition event: the new information/state sharply conflicts with the reader model immediately before it.

A surprise can fail in opposite ways:

- **telegraphed:** the reader model already placed high probability on the reveal;
- **unearned/arbitrary:** the reveal had too little prior support and feels disconnected;
- **productive:** the reveal was not expected but earlier evidence becomes newly meaningful.

Therefore evaluate surprise with both **pre-reveal expectation** and **retrospective support**.

## 9. Escalation

Escalation should not mean “things get louder.” Track possible increases in:

- stakes;
- irreversibility;
- cost;
- commitment;
- exposure;
- opposition;
- resource loss;
- time pressure;
- moral difficulty;
- relationship damage;
- uncertainty;
- consequence reach.

A sequence can escalate by narrowing choices even if physical scale decreases.

## 10. Character trajectory

A character trajectory should be reconstructed from state change, not assigned from a template.

Track over time:

- active external goals;
- deeper wants/needs hypotheses;
- beliefs;
- knowledge;
- commitments/promises;
- fears/avoidances;
- tactics;
- decisions;
- caused consequences;
- adaptations;
- relationship states;
- values exposed by choice.

Then describe trajectory types instead of forcing “positive arc.”

## 11. Emotional movement

Fount cannot directly observe a reader's emotions without human feedback. It can model **emotion-eliciting conditions and character-affect trajectories**.

Possible inputs:

- anticipated gain/loss;
- actual gain/loss;
- goal progress/setback;
- relationship gain/loss;
- status change;
- safety/threat;
- hope/fear balance;
- moral injury;
- revelation;
- sacrifice;
- reunion/separation;
- injustice/relief.

The output should say “conditions associated with X increase here” or compare sections/revisions, not assert what every reader feels.

## 12. Relationship evolution

Relationships are independent timelines, not static labels such as “friends” or “married.”

Track dimensions such as:

- trust;
- intimacy;
- allegiance;
- dependency;
- leverage;
- status/power;
- attraction;
- resentment;
- knowledge asymmetry;
- obligation/debt;
- openness/concealment.

Not every dimension applies to every pair. The relation schema should allow sparse, evolving attributes.

Important events include bids, refusals, disclosures, betrayals, rescues, sacrifices, status reversals, boundary violations, promises, and forgiveness.

## 13. Payoff satisfaction

A payoff is more than a repeated reference. Evaluate:

- setup salience;
- reader memory/reinforcement;
- delay;
- transformation between setup and payoff;
- consequence;
- emotional/character/thematic integration;
- predictability;
- whether the payoff resolves or deepens a question;
- whether it creates a new setup.

The system should distinguish callback, explanation, reveal, consequence, reversal, fulfillment, ironic payoff, and thematic echo.

## 14. “One scene makes you need the next”

This can be operationalized as **handoff pressure** rather than a mystical score.

At a scene exit, record active forward vectors:

- unresolved immediate objective;
- new question;
- new threat;
- declared plan;
- fresh consequence;
- anticipated confrontation;
- withheld response;
- irreversible decision;
- deadline;
- relationship rupture;
- discovery requiring action.

At the next scene, record whether that pressure is advanced, delayed productively, redirected, or dropped.

A sequence where many scene exits have no meaningful forward vector may deserve investigation. That is still a hypothesis, not an automatic defect.

## 15. Comprehension and confusion

Narrative understanding is a major engagement dimension. Fount already has strong ingredients for this because it can track facts, continuity, knowledge, and causal support.

Model potential comprehension failures such as:

- required fact never established;
- referent ambiguity;
- unexplained state transition;
- event order ambiguity that appears unintentional;
- character knowledge without access path;
- objective change without motivating event;
- pronoun/name ambiguity;
- location/time jump without enough orientation;
- reveal answer lacking a previously legible question.

But deliberate ambiguity should remain representable as intent.

## 16. Attention, novelty, and repetition

A screenplay cannot directly measure a reader's attention, but it can identify structural conditions that may challenge it:

- repeated scene function;
- repeated information;
- repeated tactic without new result;
- long span without changed dramatic state;
- excessive parallel explanation;
- homogeneous scene lengths/energies;
- heavy exposition density;
- delayed consequences;
- long setup chains without intermediate reward.

Conversely, novelty can arise from new information, changed objective, new setting, altered relationship, reversal, visual event, comic premise, formal shift, or surprising consequence.

## 17. Reader-state outputs

Do not output one line chart labeled “engagement.” Provide inspectable tracks:

```text
open questions
anticipation targets
threat/proximity
character concern hypotheses
relationship movement
sequence pressure
comprehension risk
setup/payoff lifecycles
surprise opportunity
emotional-condition trajectories
```

A higher-level diagnosis can combine tracks for a specific concern.

## 18. Human reader calibration

Eventually, reader-state hypotheses need human data. A practical corpus can ask readers to mark at scene checkpoints:

- what they think will happen next;
- what questions they most want answered;
- which character outcome they care about;
- perceived clarity/confusion;
- perceived tension/curiosity;
- whether a reveal surprised them;
- whether a payoff felt satisfying;
- whether they wanted to continue.

Preserve distributions and disagreement. Do not collapse all readers into a single “correct” reaction.

## 19. Architecture consequences

This research is why Reader state deserves to remain a distinct logical model from Temporal story-world state, even though both live inside `fount_intelligence`.

`Fount.Intelligence.Temporal` answers: **what story/character/relationship state has evolved?**

`Fount.Intelligence.Reader` answers: **given only what the screenplay has revealed so far, what experience hypotheses and unresolved mental objects should a first-time reader carry forward?**

That separation lets the system know the actual story truth while still respecting what the reader does not yet know.

## Claim ladder for reader outputs

Reader analysis must label whether a statement is:

1. a canonical screenplay fact;
2. a deterministic derived narrative state;
3. a model-estimated reader interpretation;
4. a human-calibrated reader-response estimate.

Do not phrase level 3 as level 4 before human evaluation supports that claim for the relevant task/population. The writer-facing surface follows `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.