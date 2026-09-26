# Analysis Contracts and Data Model

## 1. Purpose

This document defines provider-neutral records passed among `fount`, `fount_observe`, `fount_intelligence`, and `fount_workshop`.

The contracts exist to ensure:

- measurement can change without collapsing into dramatic interpretation;
- reasoning can be replayed from frozen values;
- source provenance remains exact;
- presentation order and story time are not conflated;
- reader/temporal state never silently becomes authored truth;
- observation, diagnosis, strategy, and candidate remain distinct;
- cached computation is separated from revision-bound evidence;
- no SDK-native structures leak above `fount_observe`.

## 2. Canonical values stay in `fount`

Canonical screenplay values remain owned by Fount: screenplay/revision IDs, scenes/elements/dialogue blocks, cast/mentions, source spans, authored items, typed edits, candidate/revision lineage, and canonical annotations where appropriate.

The analytical packages reference canonical identities and values. They do not establish a second screenplay authority.

A general rule for adding to `fount` is:

> Would this concept still belong to the screenplay substrate if every AI/analysis package were removed?

If not, it belongs elsewhere.

## 3. Observe value layers

`fount_observe` exposes a small provider-neutral contract surface. Keep these modules leaf-like and free of provider/executor dependencies.

### 3.1 `MeasurementResult`

A `MeasurementResult` is the immutable result of evaluating one normalized measurement function against one normalized semantic input.

Conceptual shape:

```elixir
%Fount.Observe.MeasurementResult{
  id: binary(),
  value: term(),
  distribution: %Fount.Observe.Distribution{} | nil,
  output_contract_id: binary(),
  output_contract_sha256: binary(),
  measurement_spec_sha256: binary(),
  input_sha256: binary(),
  provider_fingerprint: map() | nil,
  semantic_execution_sha256: binary(),
  normalized_raw: term() | nil,
  metadata: map()
}
```

This object is cacheable. It does **not** claim to belong to a particular current screenplay revision.

### 3.2 `Observation`

An Observation binds a measurement result to current source evidence and run provenance.

Conceptual shape:

```elixir
%Fount.Observe.Observation{
  id: binary(),
  kind: atom() | binary(),
  target: %Fount.Observe.TargetRef{},
  discourse_point: %Fount.Observe.DiscoursePoint{} | nil,
  story_time_refs: [term()],
  result: %Fount.Observe.MeasurementResult{},
  evidence: [%Fount.Observe.EvidenceRef{}],
  lens_id: binary() | nil,
  lens_sha256: binary() | nil,
  projection_id: binary() | nil,
  projection_sha256: binary() | nil,
  context_sha256: binary() | nil,
  sensor_id: binary(),
  calibration_sha256: binary() | nil,
  dependencies: [term()],
  provenance: map(),
  metadata: map()
}
```

An Observation is not a diagnosis and not screenplay truth.

### Observation rules

1. Every Observation is bound to one current screenplay/revision provenance context.
2. Source-backed observations carry evidence references.
3. Missing provider output is not represented as a negative observation.
4. Raw probabilistic information is retained when useful.
5. Deterministic, model-backed, human, imported, and cached producers are all explicit.
6. Provider-native structs are normalized before entering this contract.
7. Cross-revision reuse reuses a `MeasurementResult`, not an old revision-bound Observation wholesale.
8. A reused result is materialized as a new Observation with current evidence/provenance.
9. Stale output contracts fail closed rather than entering compatibility decoding.

## 4. Target and evidence references

### `TargetRef`

References a canonical object without owning it. It may identify:

```text
screenplay
revision
scene
element
dialogue block
character
authored item
source span
analysis-run-local semantic subject
```

Revision identity is required for provenance safety. Do not automatically feed the whole `TargetRef` into cross-revision cache hashing.

### `EvidenceRef`

Conceptually:

```elixir
%Fount.Observe.EvidenceRef{
  screenplay_id: ...,
  revision_id: ...,
  target: ...,
  span: ...,
  excerpt_sha256: ...,
  role: ...,
  metadata: ...
}
```

Exact excerpt text may be included in exports, but internal identity must not depend only on mutable text matching.

## 5. Distribution contract

Preserve normalized probability information rather than flattening everything to booleans.

Canonical families:

```text
Proposition
  p_true
  p_false

Choice
  [{label, probability}, ...]

Score/rubric
  distribution over declared rubric states
  optional derived scalar only where semantically justified
```

Calibration may derive confidence/margin/entropy metadata without deleting the underlying distribution.

## 6. Output contract identity

Lens identity and output shape are distinct.

Every normalized measurement result records:

```text
output_contract_id
output_contract_sha256
```

The contract digest is derived from a canonical declarative data-shape representation containing only semantics relevant to serialization/consumption, for example:

```text
required fields
optional fields
nested shapes
allowed variants/value domains
normalization rules that affect represented meaning
```

Do **not** derive this digest from:

```text
module AST
docstrings
source paths
helper functions
comments
formatting
```

A reducer accepts the currently compiled contract digest. Mismatch means stale/missing evidence and triggers reacquisition/recomputation through the shell.

Do not introduce numeric schema generations or compatibility decoders. A stable logical contract ID may keep its name while its exact shape digest changes.

## 7. Error contract

Observe errors distinguish operational acquisition failure from semantic uncertainty.

Required classes include:

```text
invalid_target
invalid_projection
invalid_context
stale_contract
lens_not_applicable
state_too_large
budget_exhausted
provider_unconfigured
provider_timeout
provider_unavailable
provider_rejected
invalid_provider_response
association_error
calibration_unavailable
unstable_model_identity_for_durable_cache
```

A high-entropy result is operational success, not a provider error.

## 8. Content-addressed analytical assets

Built-in and project analytical assets use stable logical IDs plus content hashes.

Examples:

```text
dialogue.status_bid
scene.objective_active
reader.threat_salience
projection.dialogue_turn_pair
calibration.status_bid.default
playbook.dialogue_pass
```

Runtime identity carries:

```text
logical_id
sha256
optional source/storage locator
```

Do not add numeric compatibility-version fields or suffixes. Exact historical attribution uses hashes and run/source identity.

## 9. Projection and semantic input contract

A projection transforms canonical Fount values plus validated context into the smallest sufficient semantic input for a measurement.

Conceptual request:

```elixir
%Fount.Observe.Request{
  lens: "dialogue.status_bid",
  target: target_ref,
  projection: "dialogue.turn_pair",
  context: %Fount.Observe.Context{},
  options: %{}
}
```

Projection result contains two deliberately separate surfaces:

### Semantic input

Exactly what can affect the measurement result:

```text
normalized state supplied to the sensor/model
normalized validated context
semantic entity/speaker identities when they affect meaning
semantic execution options
```

This is canonicalized and hashed for reuse identity.

### Provenance/evidence

```text
screenplay/revision identity
canonical dependency IDs
source/evidence references
source spans
run trace
```

Provenance does not enter cross-revision cache identity unless the actual measurement input deliberately contains it.

A projection may use Fount query/slice APIs but may not call Intelligence reducers.

## 10. Context contract

Multi-pass acquisition uses an Observe-owned serializable context envelope plus lens-declared input schemas.

Conceptual envelope:

```elixir
%Fount.Observe.Context{
  slots: %{
    known_facts: [...],
    speaker_beliefs: [...],
    relationship_state: ...
  }
}
```

Values use a small set of Observe-owned neutral measurement primitives such as:

```text
Fact
Belief
Relation
Turn
EntityRef
Quantity/score
TemporalRef
Literal JSON-compatible values where explicitly permitted
```

Do not pass `Fount.Intelligence.*` structs into Observe.

Do not provide an unrestricted generic `attributes` bag that bypasses contracts.

Each lens/projection declares a closed schema over context slots. Required behavior:

- missing required slot fails before acquisition;
- unknown slot fails unless explicitly permitted;
- nested primitive/value shapes are validated;
- input schema has a canonical digest;
- canonical context serialization is deterministic;
- validation errors identify field paths without leaking sensitive content.

Elixir structs/typespecs improve ergonomics but do not replace runtime validation.

## 11. Story-world records

These live inside `Fount.Intelligence.StoryWorld`.

### Entity

Interpreted story entity referencing canonical cast/location/object evidence.

### Event

Story event with participants, evidence, narrative/reality scope, temporal constraints, state deltas, and causal relations.

### Assertion

A proposition qualified by:

```text
subject/predicate/object or normalized proposition
truth/stance where applicable
epistemic owner where applicable
discourse visibility where applicable
story-time applicability where applicable
narrative/reality scope
evidence
confidence/alternatives
```

### Interaction

Character interaction with local objectives, tactics, information/status/trust/obligation changes, and evidence.

### Commitment

Promise, bargain, threat, plan, deadline, debt, order, vow, or obligation with lifecycle.

### Goal/objective

Long-horizon, sequence, scene, or local conversational pursuit, with evidence and uncertainty.

### Beat

Derived source-anchored interpretation, never canonical screenplay structure by default.

## 12. Temporal contracts

Time is intentionally split.

### `DiscoursePoint`

A stable presentation-order coordinate derived from canonical screenplay order:

```text
scene ordinal / scene ID
optional beat index/ID
optional element ID/boundary
entry/exit marker
```

It contains no future knowledge.

### `StoryTimeNode`

Identifies an event or interval in a narrative/reality scope. It may have an exact authored timestamp, a symbolic anchor, or no absolute timestamp.

### `StoryTimeConstraint`

Relates two nodes using one or more allowed qualitative relations, such as:

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
unknown relation-set
```

Every constraint carries evidence/provenance and uncertainty where applicable.

### `NarrativeScope`

Separates base-story events from material that cannot safely be merged into the same physical chronology, such as:

```text
memory/recollection
dream/fantasy
hypothetical/imagined branch
alternate timeline/worldline
unreliable/contested account
```

The implementation should not over-classify; scope is explicit only where needed.

### Causal relation

Causality is modeled independently of story time.

## 13. Snapshot and derived-view contracts

A snapshot is a pure state value at a well-defined discourse checkpoint or a well-defined story-world query scope.

Do not call every temporal structure a timeline.

Use:

```text
ReaderSnapshot         presentation-order state
CharacterStateView     diegetic/event-qualified character state
RelationshipStateView  qualified relation state
StoryTimeGraph         partial temporal constraints
CausalGraph            causal relations
SetupPayoffLedger       lifecycle view
SequenceView            presentation or story-world scope explicitly named
```

Every derived value identifies its contributing observations/assertions.

## 14. Reader-state contracts

Reader state is not story-world truth. It models what a first-time reader has been given through discourse point N.

Objects include:

### OpenQuestion

```text
question/proposition
opened_at
salience
candidate answers / uncertainty
reinforcement points
partial answers
closed_at / abandoned_at
supporting evidence
```

### Expectation

Evidence-backed future hypothesis held by the modeled reader.

### Promise

Reader-facing setup establishing expectation of later relevance/resolution.

### Threat

Known/inferred undesirable possibility with target, uncertainty, proximity/deadline, and reader/character knowledge relation.

### RevealState

```text
not introduced
hinted
inferable
likely inferred
explicitly revealed
confirmed/complicated/overturned
```

Multiple alternatives may coexist.

## 15. Character epistemic distinction

Do not collapse:

1. **diegetic character knowledge/belief** at an event/story-time scope; and
2. **the reader's current model of what that character knows/believes** at a discourse point.

The first belongs to StoryWorld/qualified character state. The second may be maintained in Reader state because it reflects only what the screenplay has revealed so far.

This distinction is essential for mysteries, unreliable narration, flashbacks, withheld information, and reveals.

## 16. Diagnosis contract

A diagnosis answers: "what might be causing this concern?"

Conceptual fields:

```text
id
concern
hypothesis
supporting evidence
counterevidence
missing evidence
confidence/uncertainty
scope
protected strengths
alternative diagnoses
next investigation requirements
```

A diagnosis is not an instruction to rewrite.

## 17. Playbook-run contract

A run records:

```text
playbook logical ID/hash
screenplay/revision/scope
writer intent/protected strengths
requested/acquired measurement requirements
coverage/budget/errors
StoryWorld/Reader derived refs
competing diagnoses
report/output refs
```

Executable playbooks are code-defined/registered. Data cannot name arbitrary modules/functions.

## 18. Strategy and candidate lineage

A strategy is a possible treatment direction. A candidate is concrete generated/edited screenplay material.

Required lineage:

```text
reported concern/note
-> diagnosis/hypothesis
-> selected strategy
-> generated change groups/candidate
-> pre/post analysis evidence
-> writer review decision
```

No layer is permitted to silently collapse those distinctions.

## 19. Serialization rules

All durable/exportable analytical values must:

- use JSON-compatible plain serialization at boundaries;
- record stable logical IDs and exact hashes;
- avoid executable deserialization;
- exclude secrets/provider credentials;
- represent uncertainty explicitly;
- preserve evidence identity;
- distinguish semantic reuse identity from provenance identity.

## 20. Greenfield rule

No contract in this document exists to decode superseded Probe shapes or old analytical schemas.

When a current analytical output contract changes, stale development-derived data/fixtures are recomputed or regenerated. Do not add old-contract readers, conversion layers, or numeric compatibility versions.
