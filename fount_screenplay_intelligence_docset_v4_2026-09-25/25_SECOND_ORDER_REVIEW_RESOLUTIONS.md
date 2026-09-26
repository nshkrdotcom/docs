# Second-Order Architecture Review Resolutions

## 1. Purpose

This document records the conclusions of the second Socratic review of the screenplay-intelligence architecture. It exists so later agents do not re-open settled questions from short summaries or silently adopt a critique's proposed remedy merely because the critique found a real problem.

Phase 1 sequencing is intentionally out of scope here. The Phase 1 program remains exactly as specified elsewhere in this docset.

The review covered five issues:

1. presentation order versus story time;
2. analytical contract evolution without compatibility-version schemes;
3. higher-order context passed from Intelligence back into Observe;
4. cache identity, provenance, and recomputation;
5. mechanical purity enforcement inside `fount_intelligence`.

The conclusions below supersede simpler formulations in the previous docset.

---

## 2. Temporal model: accept the problem, reject both simplistic fixes

### 2.1 Question

A screenplay has at least two different temporal concerns:

- the order in which the reader encounters material;
- the time relationships among events inside the story world.

Can both be represented by one sequence keyed by scene order?

**No.** A flashback shown on page 70 may depict an event decades before a scene shown on page 10. Folding diegetic state in presentation order can produce impossible possession, age, knowledge, or life/death states.

### 2.2 Why two linear timelines are still insufficient

Replacing one line with two lines — presentation order plus a supposedly chronological line — remains too strong. Screenplays can contain:

- uncertain relative order;
- simultaneous or overlapping events;
- montage and intercut events;
- dream, memory, fantasy, imagined, hypothetical, or unreliable material;
- alternate branches/worldlines;
- contradictory recollections;
- events anchored only by relations such as "before the trial" or "years earlier".

A system must not invent an exact total order merely to make reduction easy.

### 2.3 Why a full interval solver is also the wrong default

Allen-style interval relations are useful vocabulary for temporal relationships, but the general relation-network satisfaction problem is substantially more complex than topological sorting. Relations such as overlap, contains, during, starts, or equals cannot be reduced to a simple precedence DAG. The product does not need to ship a general-purpose temporal theorem prover in order to help a screenwriter.

### 2.4 Final design

Use **three separate structures**:

#### A. Discourse / presentation order

A total screenplay-order coordinate derived from canonical source order. It drives:

- first-reader state;
- reveal timing;
- suspense/curiosity/surprise;
- what the reader currently believes about characters and events;
- scene-to-scene forward pull;
- presentation-relative knowledge gaps.

This is the primary fold/reducer axis.

#### B. Story-time constraint graph

A partial graph over story events/intervals. It stores only relationships justified by evidence or explicit author metadata, such as:

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
unknown / relation-set uncertainty
```

Exact dates/times may be attached when authored or safely inferred, but they are not required.

Story-time objects also identify the narrative/reality scope where needed so a dream, hypothetical branch, remembered event, and base story world are not silently collapsed.

#### C. Causal graph

Causality remains separate from time. `A before B` is not `A causes B`; an effect may be presented before its cause.

### 2.5 Reducer consequence

Do **not** require all StoryWorld state to be produced by a single chronological reducer.

- Reader state is an ordered fold over discourse checkpoints.
- Presentation-relative hypotheses about what the reader currently thinks a character knows can also fold over discourse.
- Diegetic state is qualified by event/time constraints and queried from StoryWorld facts/state transitions.
- Materialized story-time views may be cached when the constraints justify a definite ordering, but uncertainty remains legal.

### 2.6 Continuity consequence

Do not define continuity as "a valid topological sort exists." That test is insufficient for interval relations and can misclassify alternate/reality-scoped material.

Continuity checks should instead combine:

- temporal-relation contradiction checks;
- state-transition preconditions/postconditions;
- causal requirements where relevant;
- scope/worldline compatibility;
- explicit uncertainty.

Emit a contradiction diagnosis only when the available evidence makes the conflict supportable. Otherwise return ambiguity/missing evidence rather than inventing chronology.

### 2.7 Incremental recomputation

A newly inserted past event does not imply recomputing an imaginary timeline from "the beginning of time." Recompute the connected story-time/state subgraph and any materialized views dependent on changed constraints. Reader snapshots still recompute only from the earliest changed presentation checkpoint forward.

---

## 3. Output contracts: accept contract digests, reject numeric schema generations

### 3.1 Question

If a lens keeps the logical ID `dialogue.status_bid` but its normalized output space changes, how can a reducer know whether an observation matches the contract it expects?

The answer cannot be the lens logical ID alone.

### 3.2 What content hashes do and do not solve

A prompt/lens content hash identifies exact measurement instructions/assets. It does not by itself identify the normalized output shape consumed by reducers.

Therefore every normalized observation that enters Intelligence records both:

```text
output contract logical identity
output contract canonical-shape digest
```

The digest is computed from a canonical declarative representation of the contract — field names, required/optional structure, value domains/variants, and serialization rules. It is **not** computed from module AST, source comments, helper functions, source paths, or documentation.

### 3.3 No compatibility-version tokens

Do not introduce:

```text
status_bid/2
status_bid_v2
schema_version: 2
contract_generation: 2
```

The repository is greenfield and does not need old-contract readers. The currently compiled contract has one current digest.

A reducer either receives an observation satisfying that exact contract or receives `:stale_contract` / missing evidence and asks the shell to reacquire/recompute.

### 3.4 Why stale fixtures are not a reason to preserve old schemas

If a choice space changes from three states to five, the old probability distribution is not necessarily semantically comparable to the new one. Reusing it merely to preserve a fixture can be misleading.

Therefore:

- current observation fixtures pin the expected contract digest;
- a contract change intentionally causes those generated-observation fixtures to fail;
- fixture regeneration is part of the change;
- human-labeled corpus truth should be stored at a more stable semantic level where possible, independent of a particular model output encoding.

### 3.5 Semantic renaming rule

Do not invent a new English concept for every rubric refinement.

Keep the logical contract ID when the concept remains the same. Change its canonical-shape digest when its normalized representation changes. Rename only when the semantic concept itself changes materially.

This avoids both vocabulary inflation and compatibility machinery.

---

## 4. Context inversion: reject both arbitrary maps and a giant generic junk drawer

### 4.1 Question

How can Intelligence supply higher-order state to Observe without making Observe depend on Intelligence's rich domain structs?

The previous plain-map answer was too weak. The proposed replacement of a single `%Context{facts, beliefs, attributes}` is also too weak if `attributes` becomes an unchecked escape hatch.

### 4.2 What Observe is allowed to know

`fount_observe` is not required to be ignorant of screenplay concepts. A sensor measuring deception, status movement, exposition, or objective activity necessarily knows the semantic proposition it measures.

The boundary is:

> Observe may know **measurement semantics**. It must not own longitudinal dramatic interpretation, reader trajectories, diagnoses, or StoryWorld authority.

Therefore a lens may declare that it requires facts, beliefs, prior turns, relationship summaries, or active goals. That is not an architectural leak by itself.

### 4.3 Final context model

Use:

1. a small set of provider-neutral typed **measurement primitives**;
2. one serializable context envelope containing named slots;
3. a lens/projection-declared closed input schema defining which slots and primitive shapes are accepted.

Conceptually:

```elixir
%Fount.Observe.Context{
  slots: %{
    known_facts: [...],
    speaker_beliefs: [...],
    relationship_state: ...
  }
}
```

The values use Observe-owned neutral primitives such as normalized fact/belief/relation/turn/entity references rather than `Fount.Intelligence.*` structs.

The `slots` map is **not arbitrary**:

- the active lens declares allowed and required slot names;
- unknown slots fail unless explicitly allowed;
- values are validated against the lens's input contract;
- the context is canonicalized before hashing/serialization.

Do not provide a permanently open `attributes: %{}` escape hatch that bypasses these rules.

### 4.4 Compile-time and runtime safety

An Elixir struct gives useful structural protection but is not a proof that nested values are semantically valid. Therefore use both:

```text
struct/typespec ergonomics
+
strict runtime validation
+
canonical serialized schema/digest
```

The validator executes once per normalized context construction/reuse boundary, not redundantly for every identical batched state.

---

## 5. Cache identity: result reuse and observation provenance are different records

### 5.1 Question

What exactly is safe to reuse across revisions?

Not a revision-bound observation record wholesale.

The reusable artifact is the result of a measurement function over an exact normalized input. The product then materializes a new observation against the current screenplay/revision/evidence.

### 5.2 `MeasurementResult` versus `Observation`

#### `MeasurementResult`

Immutable cacheable payload:

```text
normalized value/distribution
output contract ID/digest
measurement specification fingerprint
input fingerprint
provider/model fingerprint when applicable
raw normalized provider data when retained
calibration result where cache policy includes calibration
```

It has no claim that it belongs to a particular current revision.

#### `Observation`

Run/revision-bound evidence record:

```text
current screenplay/revision/target/evidence
current acquisition/run provenance
reference to reused/new MeasurementResult
current dependency refs
```

On a cross-revision cache hit, create a new Observation with current evidence/provenance and a reference to the cached result.

### 5.3 Reuse key

Do not hand-select arbitrary identity fields. Hash the **effective semantic measurement request** after normalization.

Conceptually:

```text
cache namespace
measurement specification fingerprint
input fingerprint
provider/model fingerprint
semantic execution fingerprint
```

Where:

- measurement specification includes lens, projection behavior as reflected in the produced state, output contract, and calibration/normalization semantics where relevant;
- input fingerprint hashes exactly the canonical serialized state/context the sensor actually sees;
- provenance-only IDs such as revision IDs are excluded unless they are intentionally part of the measurement input;
- semantic identities such as speaker/entity identity are included when the sensor sees/depends on them;
- secrets are never included.

### 5.4 Revision identity

Revision ID belongs in Observation provenance and analysis-run lineage, not automatically in reusable result identity.

Likewise, do not accidentally reintroduce revision identity by serializing a revision-bound `TargetRef` into the input fingerprint. Projection/input builders must produce an explicit semantic-input representation separate from provenance.

### 5.5 Model fingerprint practicality

Do not require a model weights digest that a hosted provider does not expose.

Classify model identity stability:

```text
exact immutable provider/model revision
provider-reported stable model ID
mutable alias / unknown stability
```

Durable cross-run reuse is permitted only when the model fingerprint is stable enough for the configured policy. Mutable aliases may be limited to L1/run-local reuse or disabled for durable reuse.

Always include inference/decoding parameters that affect output.

### 5.6 Cache scope and privacy

Content addressing must not accidentally create cross-project or cross-tenant data leakage. Cache storage is namespaced by the configured privacy scope even when content hashes match.

### 5.7 No semantic cache invalidation

Cached measurement results are immutable. Edits do not delete them for correctness.

TTL/LRU/quota garbage collection may evict cache data for resource management. That is not semantic invalidation.

The term **recomputation frontier** applies to StoryWorld, temporal, reader, diagnosis, and report derivations affected by changed inputs.

---

## 6. Purity enforcement: keep it immediate, reject the 40-line-proof fantasy

### 6.1 Question

Can a small source AST denylist prove the Intelligence core is pure?

No. Aliases, imports, captures, macros, `apply/3`, wrappers, generated code, and indirect module dependencies make a tiny denylist an incomplete architecture proof. It can still be a useful supplemental check for specific forbidden calls.

Likewise, `mix xref` alone is not sufficient: it distinguishes compile/export/runtime dependencies and can show struct/export coupling, but it does not encode the architectural meaning of an allowed contract dependency versus a forbidden acquisition dependency.

The `boundary` library is useful for nested module-boundary rules, but external OTP dependencies are permitted by default, so it is not a complete side-effect checker either.

### 6.2 Final enforcement stack

Phase 1 keeps the architecture gate requirement already present in the plan. Implement the simplest reliable stack the source permits:

#### Layer A — nested module boundaries

Inside `fount_intelligence`, define strict logical boundaries for:

```text
Core / StoryWorld / Temporal / Reader / Diagnosis
Shell / Acquisition / Playbooks / Persistence / Reporting
```

Core cannot depend on shell.

Observe should expose an intentionally small leaf contract surface separate from execution/provider modules.

#### Layer B — compiled dependency / xref architecture checks

Use compiler/xref/BEAM dependency information to verify:

- allowed Observe contract dependencies from pure modules;
- forbidden Observe execution/provider dependencies;
- no Repo/Inference/network package dependency from pure modules;
- no core-to-shell dependencies;
- compile/export coupling stays within the stated budget.

An export dependency on `%Fount.Observe.Observation{}` is allowed; a runtime dependency on `Fount.Observe.measure/3` is not.

#### Layer C — targeted forbidden-MFA checks

Use a small targeted checker for specific hidden side-effect/nondeterminism calls that module boundaries alone cannot express, for example:

```text
Application.get_env/fetch_env as semantic input
System.get_env
File read/write APIs
wall-clock acquisition such as DateTime.utc_now
randomness APIs
Repo query/write calls
```

This check is a guardrail, not a general purity theorem prover.

#### Layer D — deterministic replay/property tests

For fixed inputs and options, pure core functions must return identical values and run without provider clients, Repo handles, cache adapters, clocks, or random sources.

Do not stop shared OTP applications globally inside normal tests merely to demonstrate purity; that can interfere with unrelated tests. Prove the boundary primarily through dependency checks and explicit-input tests.

### 6.3 Positive design rule

The strongest purity mechanism remains API design:

```text
explicit canonical values
+ explicit observations
+ explicit options
-> pure value
```

If core code needs evidence that is not present, return an evidence requirement. The shell decides whether to acquire it.

---

## 7. Final resolutions

| Area | Resolution |
|---|---|
| Reader time | Fold on canonical presentation order only |
| Story time | Partial temporal constraint graph, not a forced total chronology |
| Causality | Separate graph from story-time relations |
| Character knowledge | Distinguish diegetic knowledge state from reader's current model of that knowledge |
| Temporal consistency | Constraint/state-transition contradiction checks; no promise of a full general interval solver |
| Output contract evolution | Stable logical contract ID + canonical shape digest; no numeric schema generations |
| Stale observations | Fail closed and reacquire/recompute; no compatibility decoder |
| Context inversion | Typed neutral measurement primitives + closed lens-declared context slots + runtime validation |
| Cache | Immutable `MeasurementResult` reuse separate from revision-bound `Observation` provenance |
| Cache invalidation | No semantic deletion; use recomputation frontiers for derived analysis |
| Model identity | Stable fingerprint when available; degrade/disable durable reuse for mutable aliases |
| Purity | Enforce from Phase 1 using module boundaries, dependency checks, targeted forbidden calls, deterministic replay |

These decisions are reflected in `DECISIONS.md`, contracts, temporal/story-world specifications, cache rules, phase scopes, and acceptance criteria.
