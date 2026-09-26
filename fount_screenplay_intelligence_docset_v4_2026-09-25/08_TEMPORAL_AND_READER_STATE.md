# Temporal, Story-Time, and Reader State

## 1. Purpose

This document defines how `fount_intelligence` reasons about change across a screenplay without conflating:

1. **presentation/discourse order** — the order the reader encounters material;
2. **story-time relations** — when events occur relative to one another inside the represented world;
3. **causal relations** — which events enable, cause, motivate, prevent, or resolve others.

These are separate analytical dimensions.

The central product distinction is:

- `Fount.Intelligence.Reader` models what a first-time reader is positioned to know, expect, question, fear, hope for, infer, or misunderstand at each presentation checkpoint;
- `Fount.Intelligence.StoryWorld` models qualified diegetic facts/events/state transitions with partial story-time constraints;
- derived trajectory views summarize changes over either presentation order or a justified story-time query scope, but they must say which.

## 2. Why one timeline is wrong

A screenplay can present:

```text
Scene 1: 2026
Scene 2: 2028
Scene 3: flashback to 2004
Scene 4: memory whose exact year is unknown
Scene 5: intercut events occurring simultaneously
```

If character/resource state is naively folded by scene ordinal, a 2004 flashback can inherit consequences from 2028. That is false.

A second mistake would be forcing all diegetic events into one exact chronological list when the screenplay does not establish one.

Therefore the design uses a **total discourse sequence** plus a **partial story-time constraint graph**.

## 3. Discourse checkpoints

A `DiscoursePoint` is derived from canonical screenplay order.

Conceptually:

```text
scene ordinal / scene ID
optional beat/element boundary
entry / exit
```

The reader engine processes checkpoints monotonically from page/scene order only.

### Forward-only invariant

Reader state at point N may consume only material presented at or before N.

Changing later material must not change an earlier reader snapshot when the earlier prefix and analytical inputs are unchanged.

This is a hard property test.

## 4. Story-time graph

Story time is represented as event/interval nodes plus evidence-backed qualitative constraints.

### 4.1 Nodes

A node represents a diegetic event/interval and may include:

```text
exact authored timestamp/date
relative symbolic anchor
scene/event anchor
narrative/reality scope
optional duration/range
```

Absolute time is optional.

### 4.2 Relations

Support relations needed by practical screenplay reasoning, conceptually:

```text
before
after
meets
overlaps
same_time
during
contains
starts_with
ends_with
```

A relation can be uncertain, represented as a set of allowed relations with evidence/confidence rather than a fabricated single answer.

### 4.3 Constraint checking, not universal solving

The product is not required to provide a complete solver for arbitrary interval-relation networks.

Queries should:

- inspect the connected subgraph relevant to the requested continuity/state question;
- propagate obvious constraints where safe;
- detect supported contradictions;
- preserve unresolved relation sets;
- avoid inventing timestamps solely to make reduction easy.

A simple topological sort is insufficient for overlap/during/containment relationships and is not the general continuity algorithm.

## 5. Narrative/reality scope

Temporal relations alone do not distinguish a base-story event from a dream, hypothetical scene, alternate branch, or contested recollection.

Where needed, StoryWorld attaches scope such as:

```text
base story
memory/recollection account
dream/fantasy
hypothetical/imagined branch
alternate worldline
contested/unreliable account
```

Scope should be used sparingly and evidence-backed.

Continuity checks compare physical state only where scopes can legitimately be related.

## 6. Causality is separate from time

A cause can be presented after its effect, and temporal precedence does not imply causation.

Maintain separate causal edges such as:

```text
enables
causes
motivates
prevents
requires
pays_off
complicates
resolves
```

A continuity/diagnostic operation may combine story-time and causal constraints, but neither graph substitutes for the other.

## 7. Character state

Do not define one universal `CharacterTimeline` keyed only by scene ordinal.

Use two complementary views.

### 7.1 Diegetic character state

Qualified StoryWorld state at an event/story-time scope may include:

```text
active goal/objective
knowledge/beliefs/suspicions
commitments
location
possession/access/resources
injury/condition
relationship state
status/leverage
plans/tactics
```

State transitions have preconditions/postconditions and evidence.

Queries can ask what is known/supportable at an event or within a constrained temporal region.

### 7.2 Reader-visible character trajectory

The Reader engine tracks what a first-time reader has been shown/invited to infer about that character through discourse point N:

```text
apparent objective
apparent knowledge
apparent allegiance
apparent emotional/value state
apparent relationship posture
reader confidence/alternatives
```

This can differ sharply from diegetic truth.

## 8. Knowledge/belief distinction

Keep at least these separate:

```text
story-world fact
character knows proposition at event/scope
character believes proposition at event/scope
character suspects proposition at event/scope
reader has been shown proposition by discourse point
reader can plausibly infer proposition by discourse point
reader currently believes character knows/believes proposition
```

This is essential for mystery, dramatic irony, unreliable narration, flashbacks, secrets, and later reinterpretation.

## 9. Relationship state

Relationship analysis also has diegetic and reader-visible views.

Sparse dimensions may include:

```text
trust
intimacy
status/leverage
obligation/debt
allegiance
fear
resentment
concealment
dependency
romantic/sexual orientation where textually relevant
```

Never force all dimensions into one scalar.

Diegetic relationship changes attach to events/story-time scope. Reader-visible relationship impressions evolve in discourse order.

## 10. Possession/access/resource continuity

Physical/resource state is especially sensitive to non-linear scripts.

Example state transition:

```text
precondition: Dan possesses key K
transition: Dan gives K to Mara
after-state: Mara possesses K, Dan does not
story-time node: event E
scope: base story
```

A later-presented flashback does not inherit the current-day state merely because it appears later on the page.

Continuity checks should identify:

- incompatible preconditions;
- missing/intervening transitions where required;
- contradictory temporal constraints;
- scope mismatch;
- unresolved chronology that prevents a confident conclusion.

## 11. Setup/payoff ledger

Setup/payoff has both presentation and story-world aspects.

Track:

```text
setup presentation point
what expectation/promise it creates for the reader
story-world fact/event it establishes
reinforcement/complication points
payoff/resolution presentation point
causal/dependency support
partial/false/redirected payoff state
```

A payoff can occur later in presentation while depicting an earlier story-time event; the analysis must state which dimension is being evaluated.

## 12. Sequence movement

Sequences are derived analytical groupings, not canonical truth.

Sequence views may track through presentation order:

```text
objective movement
strategy/tactic changes
cost/escalation
new consequences
relationship movement
information/reveal movement
open-question movement
reader forward pressure
```

A sequence can also query story-time state where relevant, but must not silently treat presentation adjacency as chronological adjacency.

## 13. Reader state

`Fount.Intelligence.Reader` is a pure forward fold over discourse checkpoints.

A snapshot may include:

### Open questions

```text
question/proposition
opened_at
salience
candidate answers / uncertainty
reinforcement points
partial answers
closed/abandoned point
```

### Expectations

Likely future outcomes/events the modeled reader has reason to anticipate.

### Promises

Reader-facing setups that create expectation of later relevance/resolution.

### Threats

Known/inferred negative possibilities with target, uncertainty, proximity/deadline, and knowledge relation.

### Reveal states

```text
not introduced
hinted
inferable
likely inferred
explicitly revealed
confirmed
complicated
overturned
```

### Suspense

Do not store one universal suspense scalar as truth. Preserve contributing dimensions such as:

```text
threat salience
uncertainty
reader-character knowledge gap
proximity/deadline
attachment/alignment
perceived stakes
available agency
```

### Curiosity

Questions about past/present causes, identities, motives, hidden facts, mechanisms, or explanations.

### Surprise

A difference between prior expectation distribution and newly presented event/reveal, not simply "unexpected = good."

### Comprehension/confusion risk

Track distinguishable causes:

```text
missing prerequisite information
ambiguous referent
excessive simultaneous novelty
contradictory active hypotheses
intentionally unresolved mystery
presentation/story-time disorientation
```

Intentional ambiguity must not automatically become a defect.

## 14. Forward pull

At scene exits, the reader model may summarize active vectors:

```text
unresolved question pressure
threat pressure
anticipated action/decision
relationship uncertainty
promised payoff
unfinished immediate objective
newly opened information gap
emotional concern
```

This supports analysis of "one scene makes you need the next" without pretending it is one universal number.

## 15. Emotional/value movement

Represent value/emotional states as multidimensional hypotheses rather than one valence line.

Possible dimensions:

```text
hope/fear
security/danger
connection/isolation
trust/distrust
control/powerlessness
belonging/exclusion
certainty/uncertainty
moral confidence/conflict
```

Track change, reversal, reinforcement, contradiction, and stagnation with evidence.

## 16. Reader sampling/checkpoints

Full state need not materialize at every element.

Useful checkpoints include:

```text
scene entry/exit
major beat/reveal/decision
sequence boundaries
writer-specified points
analysis-selected points
```

The representation should remain sparse and reproducible.

## 17. Incremental recomputation

### Reader

A canonical/analytical change at discourse point N invalidates reader-derived snapshots from the earliest affected presentation checkpoint forward.

Earlier unaffected reader snapshots remain reusable.

### Story-time / diegetic state

Recompute only the connected assertions/transitions/constraints/materialized views dependent on changed evidence or constraints.

Do not define this as "recompute from the start of chronology" because there may be no total chronology.

### Diagnoses/reports

Recompute downstream outputs whose declared dependencies intersect the changed Reader/StoryWorld derived values.

## 18. Required temporal tests

At minimum:

- flashback state does not inherit later diegetic changes merely because it is presented later;
- a death in a future event does not mark a character dead in an earlier story-time event;
- presentation mutation after checkpoint N cannot alter reader snapshots <= N;
- moving a reveal earlier alters the correct reader suffix;
- simultaneous/intercut events can be represented without fabricated order;
- unknown ordering remains unknown rather than arbitrarily sorted;
- contradictory temporal constraints are surfaced with evidence;
- ambiguous constraints abstain instead of inventing certainty;
- causal direction remains independent of presentation/story-time ordering;
- scope-separated dream/hypothetical material does not corrupt base-story physical continuity.

## 19. Reader calibration

Reader state is a model of likely reader experience, not objective truth.

Validate against human checkpoint annotations and preserve disagreement. Different skilled readers can infer different things at the same page; the system should represent uncertainty rather than average all interpretation into false precision.
