# Persistence, Provenance, Caching, and Recomputation

## 1. Purpose

The architecture distinguishes:

1. canonical screenplay truth;
2. immutable reusable measurement results;
3. revision-bound observations/provenance;
4. durable derived analysis;
5. disposable L1 cache storage.

Caching is an optimization. Provenance and writer-visible analytical history are product semantics. They must not be conflated.

## 2. State classes

### Canonical authored state — `fount`

Authoritative screenplay text/IR, authored metadata, revisions, candidate lineage, accepted-head state, source identity, and canonical annotations where appropriate.

### Reusable measurement result — Observe contract

An immutable `MeasurementResult` produced from one exact normalized semantic measurement request.

It is safe to cache/reuse only according to its computation fingerprint and cache-scope policy.

It is not bound to one current revision.

### Observation — current provenance binding

An Observation ties a MeasurementResult to current:

```text
screenplay/revision
target/evidence
canonical dependencies
acquisition/run provenance
```

Cross-revision reuse creates a new Observation around the reused result.

### Durable derived analysis — `fount_intelligence` shell

Potential records:

```text
analysis runs
selected Observation records
StoryWorld snapshots/indexes
Reader snapshots
materialized temporal/story-time views
diagnoses
playbook reports
writer intent/protected-strength records
project analytical assets
evaluation/corpus annotations
candidate analysis lineage
```

This material is not canonical screenplay truth.

### L1 disposable cache — `fount_observe`

Fast DB-free MeasurementResult reuse, defaulting to ETS or injected in-memory storage. Safe to discard.

## 3. L1 cache contract

Properties:

- no `Fount.Repo` dependency required;
- no schema/migration required for standalone Observe;
- stores MeasurementResults, not revision-bound Observations;
- misses are ordinary;
- operational errors are not cached indefinitely as semantic results;
- cache entries are immutable;
- resource eviction may use LRU/TTL/quota;
- semantic edits do not require active cache deletion.

## 4. Durable L2 reuse

When durable reuse is configured, the Intelligence shell/host may supply an L2 adapter used by acquisition.

The L2 store persists reusable MeasurementResults plus stable computation fingerprints and may separately persist Observation/run provenance.

The pure core knows neither Repo nor cache adapters.

## 5. Reuse identity versus provenance identity

This distinction is mandatory.

### Reuse identity

Answers:

> Did we already execute the same semantic measurement function against the same semantic input under the same meaningful model/execution conditions?

### Provenance identity

Answers:

> Which screenplay/revision/target/evidence/run is this current Observation associated with?

Do not use provenance-only identity to defeat useful cross-revision reuse, and do not strip provenance from audit records merely to improve cache hits.

## 6. Cache key composition

Prefer two canonical fingerprints plus a privacy namespace.

### Measurement specification fingerprint

Hash of semantics that define the measurement function, such as:

```text
lens content hash
output contract ID + canonical-shape hash
projection semantics represented by the produced normalized input
calibration/normalization hash where result semantics include it
sensor/adapter semantic identity when it changes interpretation
semantic execution options
```

### Input fingerprint

Hash of the canonical serialized semantic payload actually visible to the sensor/model:

```text
projected screenplay state
validated normalized context
speaker/entity semantic identity when supplied to the sensor
ordering/position information only when supplied and semantically relevant
```

Exclude provenance-only material such as the current revision ID unless the measurement intentionally sees it.

Do not hash a revision-bound `TargetRef` wholesale.

### Provider/model fingerprint

Use the strongest stable identity the provider exposes plus semantic inference parameters.

### Privacy/cache namespace

Storage/reuse may be restricted by project/tenant/studio privacy scope even if content hashes match.

### Conceptual key

```text
hash(
  privacy_scope,
  measurement_spec_sha,
  semantic_input_sha,
  provider_model_sha
)
```

Secrets/API keys never enter the key.

## 7. Exact semantic input rule

Do not attempt to improve hit rates by omitting data that the sensor actually sees.

If character identity, prior dialogue, scene position, relationship summary, or story context is included in the model request, it is part of the input fingerprint.

Conversely, database UUIDs/revision IDs used only for lineage should not be serialized into the semantic-input payload.

Cross-revision reuse is correct only because the **effective measurement input is identical**, not because two targets happen to have similar text.

## 8. Context-sensitive reuse

If Scene 3 changes and thereby changes the belief/context entering an unchanged Scene 4, Scene 4's contextual measurement naturally misses because its normalized context hash changes.

No row deletion is necessary.

If Scene 4's text and all effective context remain identical, its MeasurementResult can be reused even though the screenplay revision changed.

## 9. Model identity stability

Model cache identity must never assume that a mutable alias is immutable.

Classify model fingerprints:

```text
immutable_exact
provider_stable
mutable_alias_or_unknown
```

Examples of useful fingerprint material when actually available:

```text
provider name
resolved model/revision/artifact ID
weights/artifact digest
endpoint/provider deployment identity where relevant
inference/decoding parameters
```

Do not require unavailable weights digests.

Durable reuse policy may reject `mutable_alias_or_unknown`. L1/run-local memoization may be allowed under an explicit weaker policy.

## 10. Observation materialization on cache hit

On a cache hit:

1. retrieve immutable MeasurementResult;
2. revalidate that current output contract/fingerprint expectations match;
3. create a new Observation for the current request;
4. attach current screenplay/revision/target/evidence/dependencies;
5. record cache source/result ID in acquisition provenance;
6. persist current Observation/run lineage when requested.

Never return a prior revision's Observation unchanged.

## 11. Project analytical assets

Project-specific lens/calibration/playbook configuration is content-addressed and immutable once referenced.

Conceptual record:

```text
analysis_asset
  id
  scope
  kind
  logical_id
  content
  sha256
  parent_id?   # optional lineage only
  actor
  created_at
```

No numeric compatibility-version field.

Built-in assets are source-controlled and hashed at use time.

## 12. Analysis-run persistence

A playbook run records enough to reconstruct what happened:

```text
run ID
screenplay/revision
playbook logical ID/hash
request/concern/intent/scope
Observation refs
MeasurementResult refs where useful
StoryWorld/Reader/derived state refs or hashes
diagnosis refs
coverage/errors
budget/usage
code/source identity
created metadata
```

No credential material is stored.

## 13. Reproducibility identity

Durable derived results record the exact meaningful identities needed for reproduction/comparison:

```text
canonical screenplay revision and evidence
measurement asset hashes
output contract hashes
semantic input/context hashes
provider/model fingerprint
calibration/normalization hashes
reducer/diagnosis source identity
semantic execution options
```

Repository/package release metadata may supplement source identity.

No parallel compatibility code is created to keep obsolete internal formats runnable.

## 14. Recomputation frontiers

Use **recomputation** terminology for derived analytical state.

### Direct canonical edit

Recompute observations whose effective semantic input changes. Cache lookup determines whether acquisition work is actually needed.

### StoryWorld

Recompute derived assertions/state transitions/temporal constraints/causal edges in the connected dependency region affected by changed inputs.

### Reader

Recompute from the earliest affected discourse checkpoint forward.

### Diagnosis/playbook/report

Recompute outputs whose declared dependencies intersect changed StoryWorld/Reader/Observation values.

Do not delete immutable MeasurementResults merely because a new revision exists.

## 15. Story-time recomputation

There may be no total chronology.

Do not define temporal recomputation as "from the earliest date onward." Instead recompute the connected story-time/state constraint region affected by changed events/relations and any materialized views that depend on it.

## 16. Calibration changes

If raw normalized provider distributions are stored separately from calibrated derivatives:

- raw MeasurementResult may remain reusable when the provider/lens/input/output contract match;
- calibrated/diagnostic derivatives recompute when calibration changes.

If calibration is embedded in the cached result semantics, its hash is part of measurement specification identity.

Make the chosen representation explicit.

## 17. Source-span safety

Never carry an old byte span into a new revision merely because the excerpt looks similar.

When creating the current Observation, use stable canonical identity/change-impact/span reconciliation. If current evidence cannot be proven, reacquire/re-resolve provenance even when a MeasurementResult is reusable.

## 18. Dependency indexes

Derived objects declare dependencies on relevant identities:

```text
canonical targets/evidence
Observations
StoryWorld objects/constraints
Reader snapshots/checkpoints
analytical asset/contract hashes
```

These indexes support recomputation frontiers. They are not instructions to delete immutable cache results.

## 19. Candidate analysis

Candidates may be analyzed without changing the accepted head.

Candidate analysis identifies:

```text
base accepted revision
candidate revision/content hash
analysis inputs
selected diagnoses/strategies
pre/post relationship
```

Rejecting a candidate does not require deleting analytical history or cached MeasurementResults.

## 20. Retention classes

Distinguish:

- writer-visible analytical history;
- durable audit/provenance;
- evaluation/corpus assets;
- L2 reusable measurement results;
- L1 disposable cache.

A writer-selected diagnosis attached to a candidate is history. An intermediate cache result may be evicted. Human benchmark labels are corpus data, not cache.

## 21. Persistence API boundary

Only shell modules such as:

```text
Fount.Intelligence.Persistence
Fount.Intelligence.Runner
Fount.Intelligence.Reporting
Fount.Intelligence.Acquisition
```

may load/store derived records.

Pure core modules receive values and return values.

## 22. Greenfield rule

There is no old Probe analysis database contract to preserve.

Do not implement:

```text
dual readers
old-shape decoders
copy migrations solely for superseded Probe records
compatibility serializers
background backfills for nonexistent users
```

During runtime QC, reset development/test analytical data where appropriate and create only the schemas required by the final architecture.

## 23. Export

Exported analytical records are plain JSON-compatible values with explicit logical IDs, hashes, provenance, and uncertainty.

They do not require executable deserialization or provider SDK structs.
