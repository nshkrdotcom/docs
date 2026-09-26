# Semantic Story World

## 1. Purpose

`Fount.Intelligence.StoryWorld` is the reusable interpreted narrative layer built from canonical screenplay values plus normalized observations.

It exists so each higher-order analysis does not repeatedly rediscover the same entities, events, facts, goals, commitments, knowledge states, causal relationships, and story-time constraints.

StoryWorld is **derived interpretation**, never authored screenplay truth. Competing or uncertain interpretations are legal.

## 2. Relationship to `fount`

The current `fount` package already distinguishes canonical IR from semantic/annotation material. The new StoryWorld continues that separation.

Do not move model-derived story claims into canonical `Fount.IR` merely for convenience.

Before changing existing `Fount.Semantics.*` structures, inspect current usages/tests. Prefer adding richer Intelligence-owned views around existing core primitives unless a missing primitive is genuinely screenplay-substrate functionality.

## 3. StoryWorld is not one chronological reducer

A central design rule:

> StoryWorld is a graph of qualified assertions/events/state transitions, not one total timeline folded from page 1 to the end.

Presentation order, story-time relations, and causality are separate dimensions.

Reader state may fold in presentation order. StoryWorld records diegetic facts and transitions against events/scopes/temporal constraints, even when those events are presented out of order.

## 4. Object families

### Entities

Characters, groups, organizations, locations, props, documents, vehicles, institutions, abstract resources, and other story-relevant entities.

### Mentions

Exact source-backed occurrences, including ambiguous references.

### Events

Something that happens or is asserted to happen.

Important fields include:

```text
participants/roles
source evidence
narrative/reality scope
story-time node/constraints
presentation points where it is shown/referenced
state preconditions/postconditions
causal parents/children
certainty/alternatives
provenance
```

### Interactions

Character events where goals, information, status, trust, obligation, leverage, or relationship state may change.

### Assertions / facts

Qualified propositions such as:

```text
Mara possesses key K during event E.
Dan believes vault V is empty at event E.
The base story world establishes that key K is fake.
Mara promised Dan not to open V.
```

Assertions carry:

```text
semantic proposition
scope/worldline
story-time applicability
epistemic owner where relevant
presentation visibility where relevant
evidence
certainty/alternatives
dependencies
```

### Goals and objectives

Distinguish:

- long-horizon pursuit;
- sequence goal;
- scene objective;
- local conversational objective;
- inferred inner want/need hypothesis.

Deeper psychological interpretation should carry proportionate uncertainty.

### Commitments and obligations

Promises, threats, orders, bargains, duties, deadlines, vows, debts, conditions, and plans.

### Possession/access/resource state

Who has a prop, document, key, location access, information channel, money/resource, or physical presence — qualified by event/story-time scope.

### Knowledge and belief

Keep distinct:

```text
story-world fact
character knowledge
character belief
suspicion
lie/deception
reader knowledge
reader's current belief about what a character knows
```

The final two are presentation-relative Reader concerns; diegetic knowledge/belief belongs here.

### Beats

Derived source-range interpretations. A beat may carry local objective, tactic, information change, decision, relationship delta, value/emotional delta, outcome, and transition reason.

Competing beat segmentations are legal.

### Motifs

Recurring image, object, phrase, behavior, sound reference, place, gesture, or concept. Motif identity may be writer-authored or inferred and should preserve evidence.

## 5. Narrative/reality scope

Some material should not be silently merged into one physical story world.

When necessary, StoryWorld records a scope such as:

```text
base story
recollection/memory account
dream/fantasy
imagined/hypothetical branch
alternate timeline/worldline
contested/unreliable account
```

Do not classify every scene into exotic categories. Use explicit scope only when the screenplay requires it.

Scopes can relate to each other — e.g. a recollection claims an event occurred in the base story — without making the claim automatically true.

## 6. Presentation order

Every source-backed event/assertion can identify where it is presented to the reader.

Presentation order is canonical source order and is total for a screenplay revision.

It is used for:

- when information becomes available to the reader;
- open questions/expectations/reveals;
- reader suspense, curiosity, surprise, comprehension;
- presentation-relative trajectory views;
- comparing first-read effects between revisions.

Presentation order does **not** establish the event's diegetic chronology.

## 7. Story-time constraint graph

### 7.1 Nodes

Events or event intervals participate in a partial temporal graph.

A node may have:

```text
exact authored date/time
relative symbolic anchor
scene/event anchor
known duration/range
no absolute anchor
```

### 7.2 Relations

Support the qualitative relations required by screenplay analysis, conceptually including:

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

Unknown or ambiguous relationships remain explicit relation sets rather than being guessed.

### 7.3 Evidence and confidence

Every inferred temporal relation records evidence/provenance and, where appropriate, confidence/alternatives.

### 7.4 No full general solver requirement

The implementation does not need to solve arbitrary temporal-relation networks exhaustively.

Use practical constraint propagation/checking on the connected region needed by a query. Detect supported contradictions and preserve unresolved relationships.

Do not claim that a simple topological sort validates overlap/during/containment relationships.

## 8. State transitions and continuity

Dynamic state is represented by qualified transitions/assertions rather than one timeless property.

Examples:

```text
possession transfer
relationship commitment
injury/death
knowledge acquisition
plan adoption/abandonment
location transition
resource depletion
```

A continuity checker can test:

1. precondition compatibility;
2. temporal relation compatibility;
3. scope/worldline compatibility;
4. causal prerequisites where relevant;
5. existence of evidence for intervening transitions.

Only emit a contradiction when the evidence supports one. Otherwise return ambiguity or missing evidence.

## 9. Causal graph

Causality is independent of story time.

Typed relations include:

```text
enables
causes
motivates
prevents
reveals
requires
pays_off
complicates
resolves
contradicts
```

A cause may be shown after its effect. Therefore presentation order, story-time order, and causal direction must remain independently queryable.

Causal edges may carry confidence and alternative support.

## 10. Assertion lifecycle

A derived assertion may be:

```text
introduced
supported
contradicted
superseded
resolved
withdrawn
unknown
```

These are analysis lifecycle states, not compatibility versions.

## 11. Competing interpretations

Example: a character abruptly leaves a meeting.

Possible interpretations may include:

```text
offended
afraid
avoiding disclosure
executing a plan
late for another obligation
```

Unless the screenplay settles the matter, retain competing hypotheses with evidence rather than forcing one.

## 12. Compilation pipeline

A practical pure compilation path:

1. deterministic canonical projection from `fount`;
2. entity/mention resolution using canonical and existing semantic primitives;
3. deterministic scene/event scaffolding;
4. ingest normalized observations supplied as values;
5. create/merge qualified assertions/state transitions;
6. attach presentation points;
7. attach story-time constraints/scopes;
8. attach causal relations;
9. run local consistency checks;
10. emit StoryWorld plus provenance/dependency indexes.

No provider call occurs inside this pipeline.

## 13. Query requirements

The StoryWorld API should support queries such as:

- facts supported in a story-time/event scope;
- facts character C knows/believes/suspects at event/scope P;
- what the reader has been shown about C's knowledge by discourse point N;
- events involving C that are constrained before/after E;
- unresolved temporal relation between E1 and E2;
- causal ancestors/descendants of E;
- support for proposition Q;
- alternate support if scene/event S is removed;
- relationship state at a qualified event/scope;
- active goals/commitments in a qualified scope;
- all evidence backing assertion A;
- derived objects affected by changed canonical targets/observations.

## 14. Counterfactual support

For a proposed scene/event removal:

- remove evidence/events contributed only by the intervention;
- trace dependent assertions/causal edges/temporal constraints;
- identify alternate support;
- mark downstream material unsupported/uncertain as appropriate;
- recompute connected derived views;
- hand results to diagnosis/playbook layers.

Do not pretend this perfectly simulates an alternate movie.

## 15. Incremental recomputation

Derived objects declare dependencies on canonical IDs, observations, and other derived objects.

Changes recompute the affected connected region, not "all history from time zero."

Reader snapshots have a separate presentation-order suffix rule described in `08_TEMPORAL_AND_READER_STATE.md`.

## 16. Persistence stance

StoryWorld data is derived/regenerable but may be expensive enough to persist.

Durable records must retain exact source revision/evidence, current analytical contract fingerprints, and producer/source identity. Persisted derived state is never authority when its dependencies no longer match.
