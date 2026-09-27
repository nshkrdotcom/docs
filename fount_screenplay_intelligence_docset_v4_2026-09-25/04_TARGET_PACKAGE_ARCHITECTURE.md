# Target Package Architecture

## 1. Decision

Fount's screenplay-intelligence architecture uses four physical Mix packages:

```text
                         fount
          canonical screenplay substrate and authoring truth
                         |
                         v
                   fount_observe
              measurement and acquisition
                         |
                         v
                fount_intelligence
       interpretation, pure reasoning, and playbooks
                         |
                         v
                  fount_workshop
             creative generation and revision
```

`fount_workshop` also depends directly on `fount` for canonical screenplay operations and on `inference` for generation. `fount_intelligence` consumes canonical Fount values as well as Observe contracts/results.

`fount_probe` is directly superseded and removed in Phase 1. There is no compatibility package, shim, dual path, or migration program.

The four applications are physical boundaries. StoryWorld, temporal/story-time modeling, Reader, Diagnosis, and Playbooks remain logical namespaces inside `fount_intelligence`.

## 2. Why these are the physical boundaries

The package boundaries follow durable responsibility, not deployment topology or every conceptual pipeline stage.

### `fount` — canonical screenplay substrate

Answers:

> What did the writer actually author, what revision is canonical, where exactly is it in source, and how may it be edited safely?

Owns:

- lossless Fountain parsing/serialization;
- canonical IR/CST/source spans;
- stable screenplay/scene/element/dialogue/cast/mention/authored-item identity;
- canonical query/slice APIs;
- typed edit operations and exact source mutation;
- change impact and canonical/source diffs;
- generic authored annotation/provenance primitives appropriate to the screenplay substrate;
- screenplay/revision/candidate persistence already owned by core;
- accepted-head locking/transactional acceptance;
- format adapters/export/import/canonical validation.

Does not own:

- TypeSafe/Jev measurement execution;
- analysis provider adapters;
- analytical lenses;
- reader models;
- story-world interpretation;
- dramatic diagnoses;
- investigative playbooks;
- generative rewrite policy.

Hard test for adding a concept to core:

> Would this still belong in Fount if every analysis/AI package disappeared?

If not, it belongs elsewhere.

### `fount_observe` — measurement

Answers:

> What source-grounded evidence can we measure about this screenplay state under an explicit measurement contract?

Owns:

- leaf provider-neutral measurement contracts;
- `MeasurementResult` and current-source `Observation` values;
- normalized probability/distribution values;
- target/evidence references used by measurement;
- lenses and output-contract declarations;
- deterministic/model-backed/human/imported sensors;
- canonical-to-measurement projections;
- typed neutral context primitives and validated context envelopes;
- lens/projection input schemas;
- TypeSafe/Jev adapter via supplied `system_one_sdk` API;
- batching/concurrency/timeout/retry/association;
- provider-result normalization;
- calibration assets/application;
- L1 DB-free MeasurementResult cache;
- provider/model/input/spec fingerprints;
- measurement budgets;
- deterministic Sandbox fixture adapter;
- closed sensor/projection registries.

Observe **may know the local semantic proposition it measures** — e.g. status movement, deception, exposition, objective activity. It does not decide what those observations mean across the whole film.

This boundary survives cloud, studio on-prem, workstation GPU, local process, deterministic Elixir, human annotations, or cached results. The package owns **measurement**, not "remote network I/O."

### `fount_intelligence` — interpretation and investigation

Answers:

> Given canonical screenplay data and measured evidence, what does it imply across the movie, what might explain a concern, what remains uncertain, and what further evidence should be acquired?

It contains two mechanically separated regions.

#### Pure core

```text
Fount.Intelligence.StoryWorld
Fount.Intelligence.Temporal
Fount.Intelligence.Reader
Fount.Intelligence.Diagnosis
Fount.Intelligence.Capabilities.*
```

Owns:

- interpreted entities/events/assertions/relations;
- goals, commitments, knowledge/belief, possession/access/resources;
- presentation points;
- partial story-time constraint graph;
- narrative/reality scopes where required;
- causal graph independent from story-time ordering;
- state transitions and continuity reasoning;
- beat/motif interpretations;
- qualified character/relationship state views;
- strict-forward Reader state;
- open questions, expectations, promises, threats, suspense, curiosity, surprise, comprehension, emotional alignment;
- evidence-composed diagnoses/counterevidence/alternatives;
- counterfactual reasoning over supplied values;
- the twelve capability families' interpretation logic.

Pure core consumes explicit canonical values + Observe leaf contracts/values. It cannot call acquisition, Repo, provider clients, cache adapters, environment, filesystem, wall clock, randomness, or hidden process state for semantic behavior.

#### Imperative shell

```text
Fount.Intelligence.Acquisition
Fount.Intelligence.Playbooks
Fount.Intelligence.Runner
Fount.Intelligence.Persistence
Fount.Intelligence.Reporting
```

Owns:

- analytical playbooks;
- determining missing measurement requirements;
- multi-pass acquisition orchestration;
- conversion from rich Intelligence state into Observe-owned context primitives;
- L1/L2 cache coordination;
- analysis-run budgeting;
- durable analysis persistence;
- report assembly/export;
- investigation planning;
- controlled Observe calls;
- controlled execution of pure core.

The shell may persist derived analysis/run metadata. It may not silently mutate accepted screenplay content.

### `fount_workshop` — creative revision

Answers:

> Given writer intent, evidence, and selected strategies, what concrete alternative pages or structured edits can we create, audition, compare, combine, and accept?

Owns/preserves:

- develop from brief;
- targeted rewrite;
- sequence rebuild;
- character rewrite;
- note response;
- creative passes;
- recovery/adaptation;
- alternatives/strategy exploration;
- candidate generation through `inference`;
- audition/combine/select/materialize;
- change groups and dependency-aware selection;
- Fountain/source/structural diffs;
- review/rebase/reject/accept;
- render/PDF/table-read/rehearsal workflows;
- candidate persistence;
- regression analysis through Intelligence.

Workshop proposes authored changes; Fount controls what becomes canonical.

## 3. Final dependency graph

Required physical dependencies:

```text
fount_observe      -> fount
fount_intelligence -> fount
fount_intelligence -> fount_observe
fount_workshop     -> fount
fount_workshop     -> fount_intelligence
fount_workshop     -> inference
```

Workshop normally acquires analysis through Intelligence rather than calling Observe directly.

No package depends on `fount_probe` after Phase 1.

## 4. Logical architecture inside `fount_intelligence`

The package is physically cohesive but directional:

```text
             canonical screenplay + Observations
                         |
                         v
              +---------------------+
              | StoryWorld          |
              | events/assertions   |
              | story-time graph    |
              | causal graph        |
              +----------+----------+
                         |
               +---------+---------+
               |                   |
               v                   v
       +---------------+   +---------------+
       | Temporal views|   | Reader        |
       | diegetic      |   | discourse fold|
       +-------+-------+   +-------+-------+
               \                   /
                \                 /
                 v               v
                 +---------------+
                 | Diagnosis     |
                 +-------+-------+
                         |
                         v
                 +---------------+
                 | Playbooks     |
                 | Reporting     |
                 +---------------+

Acquisition --------------------------------> fount_observe
     |                                               |
     +--------------- Observations ------------------+
```

Allowed direction:

```text
StoryWorld -> pure helpers + Observe leaf value contracts
Temporal   -> StoryWorld + pure helpers
Reader     -> StoryWorld/explicit checkpoint inputs + pure helpers
Diagnosis  -> StoryWorld/Temporal/Reader
Playbooks  -> Diagnosis + Acquisition + pure core
Acquisition-> Observe execution + canonical projection APIs
```

Forbidden:

```text
StoryWorld/Temporal/Reader/Diagnosis -> Acquisition
pure core -> Fount.Repo
pure core -> Observe execution/provider/cache APIs
pure core -> Inference
pure core -> hidden environment/filesystem/network/clock/random state
```

See `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`.

## 5. Functional core / imperative shell is an invariant, not another package

A separate `fount_dramatics` application is not created merely to obtain pure functions.

Pure logic remains callable with frozen values, for example conceptually:

```elixir
story = Fount.Intelligence.StoryWorld.compile(canonical, observations, opts)
reader = Fount.Intelligence.Reader.reduce(checkpoints, reader_opts)
```

These operations require no provider, Repo, L1/L2 cache, application environment, or hidden process state.

Benefits:

- deterministic replay;
- fixture-driven reasoning tests;
- measurement changes evaluated against frozen reasoning;
- reasoning changes evaluated against frozen measurements;
- human/imported observations;
- later extraction if a real independent-consumer requirement appears.

Extraction is deferred until actual reuse/release/licensing/security/deployment evidence justifies another package.

## 6. Presentation order, story time, and causality

This docset makes this an architecture-level distinction.

### Presentation/discourse order

Canonical total order from screenplay source. Powers Reader and presentation-relative trajectories.

### Story time

Partial evidence-backed constraints among events/intervals. It may contain unknown/ambiguous/simultaneous/overlapping relationships and scope distinctions. It is **not** forced into one chronological list.

### Causality

Separate graph. Temporal precedence does not equal causation, and an effect may be presented before its cause.

Do not design the pure core around one universal temporal reducer. Reader reduction is ordered; diegetic state is event/story-time qualified and graph/query driven.

See `08_TEMPORAL_AND_READER_STATE.md`.

## 7. Context inversion and multi-pass acquisition

Higher-order measurements can require state inferred by Intelligence.

The shell conducts the loop:

```text
PASS 0
canonical IR -> base measurements

PASS 1
base Observations -> pure StoryWorld/Reader reasoning

PASS 2
selected Intelligence state
  -> Acquisition converts to Observe neutral primitives
  -> validated Observe Context slots
  -> contextual measurements

PASS 3
all Observations -> final pure reasoning -> diagnoses
```

The boundary rule is not "Observe must know no dramatic words." A deception/status/objective sensor necessarily knows what it measures.

The rule is:

> Observe owns measurement semantics and accepted input shapes; Intelligence owns longitudinal dramatic interpretation.

Context is represented conceptually as:

```elixir
%Fount.Observe.Context{
  slots: %{
    known_facts: [...],
    speaker_beliefs: [...],
    relationship_state: ...
  }
}
```

Each active lens declares a closed schema for its accepted slots/neutral primitives. Unknown or malformed slots fail before acquisition. No `Fount.Intelligence.*` struct crosses the API, and there is no unrestricted attributes junk drawer.

## 8. Narrow Observe contract surface

Because Intelligence physically depends on Observe, the leaf value modules must remain isolated from provider execution.

Expected conceptual surface:

```text
Fount.Observe.MeasurementResult
Fount.Observe.Observation
Fount.Observe.Distribution
Fount.Observe.TargetRef
Fount.Observe.EvidenceRef
Fount.Observe.Context
Fount.Observe.Context.* neutral primitives
Fount.Observe.Error   # pure value only
```

These modules must not depend transitively on provider adapters, SDK-native structs, execution processes, or cache implementations.

Pure Intelligence may reference only the approved leaf surface. Shell modules may call Observe execution facades.

## 9. Measurement result versus Observation provenance

This distinction is required for correct cross-revision reuse.

### `MeasurementResult`

Reusable immutable output of an exact semantic measurement computation.

### `Observation`

Current revision/target/evidence binding of a MeasurementResult.

On a cache hit from another revision, reuse the MeasurementResult but create a fresh Observation for current source/provenance.

Do not cache/replay a prior revision's entire Observation as if it were current.

## 10. Persistence/cache boundary

### Canonical authored state

Owned by `fount`.

### L1 disposable measurement-result cache

Owned by Observe; DB-free by default.

### Durable L2 measurement reuse + derived analysis

Owned/configured by Intelligence shell/host persistence.

### Derived recomputation

StoryWorld/Reader/diagnosis/report dependency frontiers determine what recalculates after an edit. Immutable cached MeasurementResults are not semantically deleted merely because a new revision exists.

See `13_PERSISTENCE_PROVENANCE_CACHE_RECOMPUTATION.md`.

## 11. Cache identity principle

Reuse identity hashes the effective semantic computation, not the revision provenance wrapper.

Conceptually:

```text
privacy namespace
+ measurement specification fingerprint
+ semantic input/context fingerprint
+ stable-enough provider/model fingerprint
```

Current revision ID stays in Observation/run provenance unless the measurement actually sees it.

If upstream context changes, the semantic-input hash changes and the cache misses naturally even when local target text is unchanged.

## 12. Model identity

Do not assume aliases are immutable or require unavailable weight hashes.

Record the strongest identity the provider exposes and classify its stability. Durable reuse can be restricted/disabled when a model is represented only by a mutable alias.

## 13. No code-level compatibility architecture

This repository is greenfield and unpublished.

Forbidden:

- Probe wrappers/aliases;
- dual execution paths;
- old/new flags;
- old analytical schema readers;
- data migration for nonexistent external users;
- numeric domain contract generations;
- code written solely to decode superseded development shapes.

Reproducibility comes from exact source revision/evidence, logical IDs + hashes, output-contract data-shape digests, semantic input hashes, model identity, and source/release identity.

## 14. Direct Probe supersession

Phase 1:

1. classify current Probe behavior;
2. implement required final-owner behavior in Observe/Intelligence/Workshop/Fount as appropriate;
3. move/recreate meaningful tests;
4. update Workshop callers;
5. replace surviving CLI/docs surfaces;
6. remove `packages/fount_probe`;
7. remove code dependencies/references;
8. run runtime QC before advancement.

No production compatibility shim remains.

See `15_FOUNT_PROBE_DIRECT_SUPERSESSION.md` and `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`.

## 15. Capability slices, not packages

The twelve families are vertical slices:

```text
measurement      -> fount_observe
meaning/state    -> fount_intelligence pure core
investigation    -> fount_intelligence shell/playbooks
creative action  -> fount_workshop when pages/edits are requested
```

Example — relationship dynamics:

```text
Observe
  local status/leverage/trust/concealment measurements

Intelligence
  diegetic relationship state
  reader-visible relationship trajectory
  relationship diagnoses
  Relationship Pass

Workshop
  writer-selected relationship rewrite strategies/candidates
```

## 16. Architecture enforcement

The internal Core/Shell distinction is mechanically checked from Phase 1 using layered mechanisms appropriate to the actual toolchain:

- nested module boundaries where useful;
- compiler/xref/BEAM dependency inspection;
- targeted forbidden-MFA checks;
- deterministic replay/property tests.

No one mechanism is treated as a universal purity theorem prover.

See `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`.

## 17. Architectural success criteria

The composition is healthy when:

- `fount` remains understandable without screenplay intelligence;
- Observe can measure without owning whole-film trajectories/diagnoses;
- pure Intelligence can replay frozen values without provider/Repo/cache services;
- non-linear scripts do not force false chronological state;
- Reader has strict forward-only presentation semantics;
- higher-order sensors receive validated Observe context without Intelligence structs;
- cached result reuse cannot carry stale revision provenance;
- Workshop creates/compares candidates without owning analytical provider execution;
- current Probe functionality has explicit final ownership;
- no `FountProbe` production module remains;
- architecture gates detect core-to-shell/provider/persistence/hidden-input leaks.