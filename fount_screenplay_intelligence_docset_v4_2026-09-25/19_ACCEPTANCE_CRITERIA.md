# Final Acceptance Criteria

The program is complete only when every applicable criterion below passes in the real runtime environment.

## A. Physical package architecture

- only the intended four packages implement this product boundary: `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`;
- `fount_probe` source/package/dependency is absent;
- no `FountProbe` compatibility modules exist;
- no superseded granular analysis packages were created;
- dependency graph is acyclic;
- `fount` remains independent of Observe/Intelligence/Workshop;
- Observe does not depend on Intelligence/Workshop;
- Intelligence does not depend on Workshop/Inference;
- Workshop uses Intelligence rather than Probe for analysis.

## B. Greenfield/no-compatibility requirement

- no dual old/new code paths;
- no compatibility shims/delegates;
- no old Probe schema readers;
- no data migration machinery written solely for unpublished Probe state;
- no numeric analytical schema generations or compatibility module families;
- analytical asset reproducibility uses stable logical IDs + exact content hashes;
- normalized output contracts use stable logical IDs + canonical data-shape digests;
- stale derived observations are reacquired/recomputed rather than adapted through legacy readers.

Normal Mix/Hex release metadata is exempt from this domain rule.

## C. Internal purity

- StoryWorld/Temporal/Reader/Diagnosis/Capabilities pure namespaces pass the architecture gate;
- Core cannot depend on Intelligence shell namespaces;
- pure code makes no Observe acquisition, Repo, network, filesystem, environment, wall-clock, or hidden random calls for semantic behavior;
- pure reducers/query functions run from explicit canonical + observation values without external services;
- Observe usage from pure core is restricted to explicit leaf contract/value modules;
- evidence gaps return requirements rather than acquiring implicitly;
- deterministic replay/property tests pass;
- architecture checks do not rely solely on a naïve source grep/AST denylist.

## D. Observe context inversion

- multi-pass acquisition is implemented in the Intelligence shell;
- Observe owns a serializable context envelope and neutral measurement primitives;
- lens/projection definitions declare closed required/optional context slots;
- unknown/missing/malformed slots fail explicitly before acquisition;
- Intelligence converts its rich state into Observe inputs; `Fount.Intelligence.*` structs never cross into the Observe measurement API;
- no unrestricted generic attributes bag can bypass lens input contracts;
- runtime validation remains present even when structs/typespecs are used;
- context canonicalization/hashing is deterministic.

## E. Output-contract integrity

- every normalized model/deterministic result consumed by Intelligence has an output-contract logical ID and canonical data-shape digest;
- the digest is derived from the declared data shape/value domain, not source AST/docstrings/formatting;
- reducer/consumer rejects stale contract digest;
- contract-shape change causes reacquisition/regeneration of derived observations/fixtures;
- no numeric schema-generation compatibility path exists.

## F. Measurement result versus observation provenance

- L1/L2 reusable caches store immutable `MeasurementResult` semantics, not a prior revision's Observation as the reusable authority;
- every current analysis request materializes an Observation with current screenplay/revision/target/evidence provenance;
- a cross-revision cache hit never returns the old revision's target/evidence record unchanged;
- current source-span/evidence reconciliation occurs even when the measurement result is reused.

## G. Caching/persistence ownership

- Observe L1 cache is DB-free and works without Postgres;
- Intelligence shell/host owns/configures durable L2 analysis persistence/reuse;
- pure core never calls persistence;
- reuse keys hash the effective semantic measurement request;
- revision/provenance-only identity is excluded unless intentionally visible to the measurement;
- changed upstream context produces a miss even if local target text is unchanged;
- identical effective semantic input can reuse a MeasurementResult across revisions;
- secrets are absent from cache keys/provenance;
- cache storage respects configured project/tenant privacy namespace;
- immutable cache results are not semantically deleted on edits;
- LRU/TTL/quota eviction is treated as storage policy, not analytical invalidation;
- durable project analytical assets are content-addressed/immutable once referenced.

## H. Model/provider fingerprinting

- model identity uses the strongest stable provider identity actually available;
- inference/decoding parameters affecting semantics are fingerprinted;
- mutable aliases are never silently treated as immutable exact models;
- durable reuse is disabled/limited according to explicit policy when model identity stability is insufficient;
- unavailable weights digests are not fabricated.

## I. Observe Sandbox

- first-class deterministic Sandbox ships with Observe;
- Intelligence playbooks can run standard tests using Sandbox only;
- fixture results/errors can be keyed by stable semantic measurement identity;
- tests do not require external mock libraries for ordinary acquisition behavior;
- live provider calls are excluded from standard test suite.

## J. Canonical/derived separation

- model-backed or inferred data never silently mutates canonical screenplay truth;
- Observations/StoryWorld/Reader/diagnoses carry exact source/provenance dependencies;
- writer intent is explicit authored/project state when persisted;
- candidate revisions remain separate until explicit acceptance;
- accepted-head transaction/stale-base protections remain intact.

## K. Presentation order, story time, and causality

- presentation/discourse order is canonical and total for a revision;
- first-reader state folds only over presentation order;
- diegetic story time is represented as an evidence-backed partial constraint graph over events/intervals rather than a forced total chronology;
- unknown/ambiguous temporal relations remain representable;
- simultaneous/overlapping/during/containment relations do not require fabricated precedence;
- narrative/reality scopes can distinguish base story from recollection/dream/hypothetical/alternate/contested material where required;
- causality is represented separately from temporal order;
- the implementation does not claim that a simple topological sort validates arbitrary interval relations;
- the implementation does not require a complete general-purpose temporal theorem prover.

## L. Temporal/non-linear screenplay correctness

Required tests/fixtures include:

- a flashback does not inherit state changes from later story-time events merely because it is later on the page;
- a future death does not mark a character dead in an earlier story event;
- possession/access transitions are story-time/event qualified;
- unknown order remains unknown rather than arbitrarily sorted;
- temporal contradictions are emitted only when evidence supports them;
- ambiguous chronology returns uncertainty/missing evidence;
- dream/hypothetical/alternate scope does not corrupt base-story continuity;
- causal direction can differ from both presentation order and story-time relation.

## M. Reader model

- forward-only invariant is mechanically/property tested;
- future presentation edits cannot alter earlier snapshots;
- open-question/expectation/promise/threat/reveal lifecycles work;
- suspense/curiosity/surprise are decomposable and inspectable;
- comprehension/temporal-disorientation risk cites evidence;
- revision comparison can show reader-state trajectory changes;
- reader-visible model of a character's knowledge can differ from diegetic character knowledge;
- no universal tension curve requirement.

## N. Probe functional supersession

Every current Probe tool intent has verified replacement behavior:

```text
inventory
extract_story
search
check_constraints
knowledge_trace
locate_boundary
dependencies
continuity
scene_mechanics
dialogue
voice
action
compare
scene_lift
ablate
strategy_contrast
```

Current useful Probe infrastructure behavior—closed registries, evidence validation, batching/association, budgets, probability handling, investigations, reports, saved analysis, live provider verification—also has a verified final owner.

## O. Twelve capability families

Every family in `11_CAPABILITY_CATALOG_12_FAMILIES.md` has:

- required sensors/projections where needed;
- pure interpretation/query/reducer behavior;
- diagnoses where appropriate;
- at least one writer-facing playbook or Workshop use;
- source-grounded evidence;
- deterministic fixture tests;
- known limitations;
- evaluation/corpus guidance;
- non-linear/presentation-vs-story-time cases where relevant.

## P. Diagnosis model

- observation != diagnosis != strategy != candidate in code/storage;
- support and counterevidence retained;
- multiple diagnoses may coexist;
- insufficient evidence may request investigation or abstain;
- protected strengths supported;
- no universal screenplay-quality score.

## Q. Notes and revision intelligence

- raw note attribution preserved;
- reaction/cause/proposed fix separable;
- note conflicts/convergence representable;
- diagnoses/strategies precede substantial candidates where workflow calls for it;
- candidates retain lineage;
- base/candidate target and collateral effects are visible;
- protected strengths can be checked;
- strategy alternatives can be tested for genuine distinctness;
- revision comparisons distinguish reader/presentation effects from diegetic continuity/causal effects.

## R. Workshop preservation

Existing writer-facing behavior remains available under the final architecture:

```text
Develop
TargetedRewrite
SequenceRebuild
CharacterRewrite
NoteResponse
Pass
Recover
Strategy/alternatives
Audition/combine/select/materialize
Review/rebase/accept/reject
Submission/render/table read/audio where supported
```

Generation remains on Inference/Workshop side and cannot bypass Fount typed edits/review.

## S. TypeSafe/Observe provider behavior

- implementation uses current supplied `typesafe_api_sdk` public APIs;
- arbitrary supported endpoint/key configuration works;
- hosted/on-prem/local deployment topology does not change the measurement contract;
- provider-native structs do not leak to Intelligence;
- request/result association deterministic;
- duplicate/missing/error results explicit;
- timeouts/retries owned by Observe;
- raw distributions retained where useful;
- provider/model identity/stability recorded;
- secrets not persisted/logged;
- small authorized live check succeeds.

## T. Inference/Workshop provider behavior

- current supplied `inference` public APIs used;
- structured generation validation retained;
- malformed output cannot bypass typed screenplay edits;
- candidate review/acceptance safety retained;
- small authorized live candidate workflow succeeds.

## U. Persistence/recomputation

- L1/L2 separation verified;
- StoryWorld recomputation is dependency/connected-region driven rather than a fabricated total-chronology suffix;
- Reader recomputes from earliest affected presentation checkpoint forward;
- later presentation edits do not alter earlier reader snapshots;
- unchanged semantic measurement inputs can reuse results;
- changed context/model/contract/assets create expected misses;
- old revision analysis remains historically identifiable;
- source spans never silently cross incompatible revisions.

## V. Calibration/evaluation

- core lenses have executable fixture/corpus evaluation guidance;
- human disagreement supported for subjective dimensions;
- raw probabilities retained where useful;
- calibration/threshold rationale documented;
- abstention supported;
- frozen current-contract observation fixtures test reasoning independently of providers;
- generated fixture manifests detect stale output contracts;
- human labels are stored at stable semantic levels where practical rather than being coupled to obsolete provider encodings;
- discovered regressions become fixtures.

## W. Security/cost/failure

- payload minimization;
- secret redaction;
- closed executable registries;
- no arbitrary module execution from assets/model output;
- analytical provider states/requests and generative usage accounted separately;
- partial coverage explicit;
- provider failure != semantic uncertainty;
- no missing result treated as negative evidence;
- cache namespace/storage policy prevents unintended cross-project leakage.

## X. Runtime quality gates

Repository's actual equivalents pass:

```text
dependency setup
format check
compile warnings-as-errors
full tests
architecture gate
Core/Shell boundary check
Observe-contract allowlist check
forbidden-MFA check
deterministic replay/property tests
reader forward-leak tests
non-linear temporal correctness tests
Credo strict
Dialyzer
docs warnings-as-errors
package/Hex inspection for intended packages
relevant Postgres tests
selected authorized live Observe checks
selected authorized live Workshop/Inference checks
```

## Y. Documentation and traceability

- top-level README reflects four-package composition;
- package READMEs clearly state ownership/non-ownership;
- no current docs instruct use of Probe;
- no unimplemented modules are described as shipped;
- `PROGRESS.md` matches source/QC state;
- `TRACEABILITY_MATRIX.md` maps all requirements to verified source/tests;
- `23_FUNCTIONALITY_PRESERVATION_AUDIT.md` has no missing item;
- `25_SECOND_ORDER_REVIEW_RESOLUTIONS.md` decisions are reflected in implementation;
- final architecture/QC handoff is complete.

## X. Writer-facing product contract

- every writer-facing playbook can emit the semantic packet in `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- evidence, derived state, diagnosis, strategy, and candidate remain distinguishable;
- uncertainty/counterevidence and protected strengths are representable;
- a deterministic reference renderer exists;
- no polished GUI is required for acceptance.

## Y. Human/domain validation

- Phase 3–9 validation artifacts/gates required by `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md` are recorded or explicitly overridden as visible debt;
- rights/provenance manifests exist for nontrivial corpus material;
- Reader human-valid claims are not made beyond available evidence;
- support/validity and writer usefulness are evaluated separately.

## Z. Safe lens/pack extensibility

- data-only packs can be authored/validated/installed without Elixir changes when they only compose approved safe primitives;
- executable primitives remain closed/registered;
- host privacy/resource caps dominate declarative asset requests;
- untrusted lens/pack text cannot acquire tool or canonical-edit authority;
- hybrid/custom pack workflow is documented and tested.

## AA. Longitudinal resource transparency

- expensive playbooks expose preflight estimates where possible;
- caller/studio caps are enforced;
- actual use and reuse are reported;
- repeated-revision/project scenarios can be estimated from real resource units;
- hosted monetary cost is optional/configured rather than the only cost model.

## AB. Feature-film scope

- acceptance tests/evaluation claims are scoped to feature screenplays;
- no TV/series functionality is implied by feature-film validation;
- unusual/nonlinear/ensemble feature structures remain supported within the feature scope.
