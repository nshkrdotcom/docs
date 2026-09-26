# Observation, Sensor, Lens, Projection, and Acquisition System

## 1. Purpose

`fount_observe` is the measurement package. It turns canonical screenplay material plus explicitly supplied validated context into normalized, source-grounded measurement results and observations.

Observe may know **what a measurement means locally** — e.g. deception, status movement, exposition, objective activity. It does not own whole-script interpretation such as a failed arc, broken second act, relationship trajectory, or reader suspense curve.

That is the durable boundary:

```text
Observe measures.
Intelligence interprets measurements across the screenplay.
```

## 2. Main abstractions

```text
Lens               semantic proposition/distribution being measured
OutputContract     normalized result shape consumed by Intelligence
Projection         canonical/context input construction
Context            typed neutral measurement inputs
Sensor             executable acquisition implementation
Calibration        reliability/decision interpretation where applicable
MeasurementResult  immutable reusable computation result
Observation         current revision/evidence binding of a result
Executor           batching/concurrency/retry/association
L1 Cache           ephemeral result reuse
Sandbox            deterministic fixture acquisition
Registry           closed executable sensor/projection set
```

## 3. Lens

A lens describes the measurement question/criterion.

Conceptual asset:

```json
{
  "id": "dialogue.status_bid",
  "type": "choice",
  "instructions": "Relative to the interlocutor, what status move is this turn making?",
  "choices": ["raise_self", "lower_self", "raise_other", "lower_other", "resist", "unclear"],
  "projection": "dialogue.turn_pair",
  "output_contract": "dialogue.status_bid",
  "context_slots": {
    "optional": {
      "relationship_state": "relation_summary"
    }
  }
}
```

The asset has no numeric compatibility version. Its exact content identity is its canonical-content SHA-256.

## 4. Output contract

The lens question and normalized result shape are separate concerns.

An OutputContract defines the exact provider-neutral result consumed by reducers.

Conceptually:

```elixir
Fount.Observe.Contracts.StatusBid
```

with a canonical declarative schema such as:

```text
choice: one of raise_self/lower_self/raise_other/lower_other/resist/unclear
probabilities: map over exactly the declared choice domain
optional confidence metadata
```

The contract module exposes or is paired with:

```text
logical contract ID
canonical data-shape representation
SHA-256 of that representation
validate/normalize functions
```

Do not hash module source/AST/docstrings to define the contract.

A change in normalized shape/domain changes the contract digest. Stale observations are not adapted; they are reacquired/recomputed.

## 5. Measurement context

### 5.1 Context envelope

Higher-order multi-pass state enters Observe through one provider-neutral serializable envelope:

```elixir
%Fount.Observe.Context{slots: %{...}}
```

### 5.2 Neutral primitives

Slot values use a limited set of Observe-owned measurement primitives, for example:

```text
EntityRef
Fact
Belief
Relation
Turn
TextSpan/Excerpt
Score/Quantity
TemporalRef
Literal scalar/list/map where a lens explicitly declares it
```

These are measurement inputs, not Intelligence's StoryWorld types.

### 5.3 Lens-declared slots

A lens/projection declares exactly which slots it accepts and their shapes.

Example conceptual schema:

```json
{
  "required": {
    "known_facts": {"type": "list", "items": "fact"},
    "speaker_beliefs": {"type": "list", "items": "belief"}
  },
  "optional": {
    "relationship_state": {"type": "relation_summary"}
  },
  "allow_unknown": false
}
```

No unrestricted `attributes` map may bypass this contract.

Validation occurs when a normalized context is constructed/accepted for a request batch. Do not redundantly validate the same immutable context for every individual item in a batch.

Required behavior:

- missing required slot -> `invalid_context`;
- wrong shape/type -> `invalid_context`;
- unknown slot -> `invalid_context` unless explicitly allowed;
- canonical serialization -> deterministic;
- validation error path -> explicit but non-sensitive;
- schema/contract digest -> recorded.

Elixir structs and typespecs improve refactor ergonomics but do not replace runtime validation.

## 6. Projection

A projection constructs the smallest sufficient semantic state for a lens.

Examples:

```text
dialogue.turn_pair
scene.entry_exit
scene.objective_context
knowledge.prefix
relationship.exchange
beat.transition
setup_payoff.pair
revision.changed_region
```

Projection code may use Fount query/slice APIs. It may not call Intelligence reducers.

Projection output must separate:

### Semantic input payload

Exactly what the measurement implementation sees and can be influenced by.

### Provenance envelope

Revision/target/source/evidence/dependency identity used for audit and materializing the current Observation.

This separation is essential for safe cross-revision result reuse.

## 7. Sensor behavior

A sensor is an executable measurement producer registered under a stable logical identity.

Sensors may be:

```text
deterministic
TypeSafe/Jev backed
future local/on-prem model backed
human/import adapter
fixture/Sandbox
```

All normalize to the same provider-neutral contracts.

A sensor must not:

- mutate canonical screenplay state;
- invoke Intelligence diagnosis/reducers;
- return provider-native structs above Observe;
- select arbitrary executable modules from data/model output;
- hide missing output as a negative answer.

## 8. `MeasurementResult`

The executor normalizes provider output into an immutable `MeasurementResult` suitable for L1/L2 reuse.

It contains no current-revision provenance claim.

The result records:

```text
value/distribution
output contract ID/digest
measurement-spec fingerprint
semantic-input fingerprint
provider/model fingerprint when relevant
semantic execution fingerprint
calibration fingerprint where included in the result
```

## 9. Observation materialization

For every current request, Observe creates an Observation that binds:

```text
current target
current revision
current evidence
current dependencies
current run/acquisition provenance
MeasurementResult reference/value
```

On a cache hit, reuse only the MeasurementResult. Re-materialize Observation provenance against the current request.

## 10. Provider adapter

Provider-specific request/response objects stop at the adapter boundary.

The TypeSafe adapter should expose arbitrary configured endpoint/key/model support allowed by the actual SDK snapshot rather than hardcoding one hosted topology.

No architecture rule assumes cloud inference. The same adapter contract must support hosted, studio on-prem, local-network, or local-process endpoints when the SDK/runtime supports them.

## 11. Executor

Executor responsibilities:

- batch preparation;
- request association;
- concurrency/pending limits;
- timeouts/retries where safe;
- partial failure reporting;
- size limits;
- budget accounting;
- normalization;
- result caching;
- secret-safe logging.

A batch error must never silently associate a response to the wrong target.

## 12. Model/provider fingerprint

Caching/reproducibility uses the strongest model identity available.

Conceptual stability classes:

```text
immutable_exact
provider_stable
mutable_alias_or_unknown
```

Fingerprint may include:

```text
provider/adapter identity
endpoint identity where semantically relevant and safe
provider model ID/revision if available
weights/artifact digest if actually exposed
inference/decoding parameters
other provider settings affecting semantics
```

Do not invent a weights digest the provider cannot supply.

Durable reuse policy may reject/limit mutable aliases. L1/run-local reuse may be more permissive if explicitly configured.

## 13. Cache behavior

Observe owns DB-free L1 result caching.

The cache stores immutable MeasurementResults keyed from normalized semantic computation identity, not revision-bound Observations.

No secret values enter a key.

Edits do not actively delete cached results for semantic correctness. Resource eviction may use LRU/TTL/quota.

See `13_PERSISTENCE_PROVENANCE_CACHE_RECOMPUTATION.md`.

## 14. Budgeting

Budget limits acquisition work, not dramatic interpretation.

Track at least:

```text
scheduled states
provider requests
estimated/actual usage where available
failures/retries
wall-clock acquisition time
cache hits/misses
```

Pure reducers do not consume provider budgets.

## 15. Calibration

Calibration distinguishes:

- raw normalized probability/distribution;
- calibrated interpretation/reliability metadata;
- downstream diagnostic thresholds/policies.

When possible retain raw normalized provider output separately so a calibration-policy change need not require a model call.

Calibration assets are content-addressed and carry no numeric compatibility version.

## 16. Sandbox adapter

`Fount.Observe.Sandbox` is a first-class deterministic test/runtime adapter.

It should allow callers to register fixture results using stable request identity such as:

```text
lens/output contract
target semantic identity or supplied fixture key
context/input fingerprint
```

Tests can exercise multi-pass playbooks without credentials or mocks of nested provider internals.

The Sandbox returns normal MeasurementResults/Observations and goes through the same validation/association path where practical.

## 17. Human/imported observations

A writer/reviewer/research annotation can become an Observation/measurement input when producer/provenance is explicit.

Human evidence is not automatically probabilistic and should not be coerced into fake model confidence.

## 18. Registry safety

Code/data may select only registered lens/sensor/projection IDs.

No arbitrary module/function expression from a model, JSON asset, or user-supplied report is executable.

## 19. Logging/security

Never log/store:

```text
API keys
Authorization headers
unredacted secret-bearing provider configs
raw private screenplay text merely for debug convenience
```

Evidence/report export may contain screenplay excerpts only when the calling product surface intentionally includes them.

## 20. Reproducibility packet

A model-backed measurement should be attributable to:

```text
lens ID/hash
output contract ID/hash
projection ID/hash
context/input hashes
sensor/source identity
provider/model fingerprint
calibration hash if relevant
semantic execution options
current observation provenance
```

No compatibility reader is promised for superseded development-only shapes.

## Declarative lens authoring boundary

Safe project/studio lens authoring is permitted only through the constrained model in `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.

A declarative lens can supply measurement rubric/configuration only inside registered generic measurement machinery, projection/context capabilities, and output contracts. It cannot define code, tools, provider endpoints, credentials, arbitrary loops, or resource policy above host caps.

Lens text is treated as potentially untrusted input; least privilege, typed output contracts, minimal context, and lack of tool authority are the primary defenses.
