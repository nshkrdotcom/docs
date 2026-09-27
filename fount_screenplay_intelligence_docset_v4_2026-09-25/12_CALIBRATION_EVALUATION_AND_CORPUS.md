# Calibration, Evaluation, and Corpus Strategy

## 1. Why calibration is a product requirement

A probabilistic observation is useful only when its behavior is understood well enough to interpret. A threshold such as 0.80 is not meaningful merely because it looks conservative.

Calibration and evaluation are part of the product architecture, not post-launch polish.

Human/domain validation begins before Phase 11 through small exploratory pilots. Phase 11 is the scale-up/calibration phase, not the first point at which humans evaluate the system. See `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.

## 2. Evaluation layers

Evaluate different failure surfaces separately.

### 2.1 Sensor/measurement correctness

Can a sensor measure its intended construct under its declared output contract?

Examples:

- proposition support;
- dialogue response/evasion;
- objective presence;
- tactic classification;
- status movement;
- knowledge access;
- setup/purpose relation.

### 2.2 Output-contract integrity

Does normalization produce exactly the declared current data shape/value domain?

Tests must verify:

- canonical contract digest;
- invalid provider variants rejected/normalized explicitly;
- stale contract digest fails closed;
- contract-shape changes invalidate generated observation fixtures rather than invoking compatibility readers.

### 2.3 StoryWorld/reasoning correctness

Given correct current-contract observations, does pure reasoning reconstruct expected entities/assertions/state transitions/causal relations/story-time constraints?

This layer should be extensively testable without providers.

### 2.4 Reader-state validity

Do presentation-order Reader estimates correspond to what human first-time readers report at checkpoints?

### 2.5 Diagnosis validity and usefulness

Evaluate these separately:

- **support/validity:** is the diagnosis defensible from screenplay evidence and declared assumptions?
- **writer usefulness:** does it help a writer understand, decide, compare, or revise?

A technically supportable observation can be useless; a useful hypothesis can be probabilistic and should be presented as such.

### 2.6 Revision usefulness

Do strategies/candidates address target concerns while preserving stated strengths and avoiding regressions?

Do not collapse these layers into one benchmark.

## 3. Gold and silver data

### Gold

Human-annotated material with explicit instructions and multiple annotators where subjectivity matters.

### Silver

Derived from deterministic screenplay facts, trusted authored annotations, or high-agreement mechanical properties.

Examples:

- exact speaker;
- presentation/scene order;
- source repetition;
- explicit prop mention;
- authored section boundaries;
- revision changes.

Do not treat model-generated semantic labels as gold merely because confidence is high.

## 4. Annotation protocol

For each lens/capability define:

- construct definition;
- positive/negative/ambiguous examples;
- visible context;
- allowed abstention/uncertainty;
- whether future presentation material is visible;
- whether writer intent is visible;
- response format;
- evidence requirements;
- disagreement/adjudication rules.

Reader annotations must use screenplay prefixes/forward exposure so later scenes cannot contaminate earlier judgments.

Diegetic story-time labels must distinguish presentation order from in-world temporal claims.

## 5. Human disagreement

Some screenplay questions legitimately admit multiple readings.

Preserve:

- per-annotator labels;
- distributions;
- confidence/self-report where collected;
- evidence/rationale where feasible;
- adjudication only when operationally necessary.

The target is not to erase taste or uncertainty.

## 6. Calibration metrics

Use metrics appropriate to the contract/task, including where relevant:

- Brier score;
- log loss;
- calibration curves / expected calibration error;
- reliability by confidence bucket;
- confusion matrices;
- ordinal error;
- abstention/coverage curves;
- AUROC/AUPRC only when class balance and decision use justify them.

Do not force one metric across all lenses.

## 7. Stability testing

Evaluate changes in:

- provider/model identity;
- lens wording;
- output-contract shape;
- provider adapter;
- projection state;
- higher-order context;
- irrelevant whitespace/source details;
- neighboring-scene context;
- batch size/concurrency;
- order where semantics should be invariant.

Record acceptable vs unacceptable drift.

## 8. MeasurementResult fixtures versus human labels

Keep two different fixture concepts.

### Generated/current-contract observation fixtures

Used to test pure reasoning deterministically. They pin:

```text
lens/spec hash
output contract ID/digest
semantic input hash
normalized MeasurementResult/Observation shape
```

If the output contract changes, these fixtures should fail visibly and be regenerated/reviewed. Do not add an adapter merely to preserve obsolete generated fixtures.

### Human/corpus semantic labels

Should be stored at the most stable semantic level practical and should not unnecessarily mirror one provider's output encoding. A label such as "the audience inferred X by this page" can outlive a particular classifier choice set.

This separation prevents benchmark history from becoming an excuse for runtime compatibility machinery.

## 9. Non-linear temporal evaluation

The corpus/fixtures must include cases where presentation order differs from story time:

- flashbacks;
- flashforwards;
- simultaneous/intercut events;
- partially ordered backstory;
- uncertain dates/order;
- dreams/memories/hypotheticals;
- unreliable or contradictory accounts;
- alternate branches where appropriate.

Required assertions include:

- Reader uses presentation order;
- diegetic state does not inherit future story-time changes because of page order;
- unknown temporal relations remain unresolved;
- supported contradictions are detected;
- causal direction remains independently testable.

## 10. Slice evaluation

Measure by relevant slices:

- dialogue-heavy vs action-heavy;
- genre;
- nonlinear vs linear presentation;
- ensemble vs single-protagonist;
- short vs long scenes;
- voice-over;
- dual dialogue;
- ambiguous aliases;
- sparse vs explicit exposition;
- comedy/horror/thriller where reader effects differ;
- deliberate ambiguity.

Global averages can conceal important failure modes.

## 11. Corpus composition and operations

Corpus acquisition, rights, privacy, provider-export permission, reviewer recruitment, and retention are governed by `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.

Use legally usable material such as:

- handcrafted unit fixtures;
- synthetic adversarial fixtures;
- author-owned/user-supplied scripts with permission;
- commissioned material with explicit evaluation rights;
- licensed excerpts/full features;
- verified public-domain screenplay text;
- external benchmarks under their actual licenses;
- revision pairs;
- human checkpoint studies.

Do not assume a script found online is redistributable or provider-exportable. Do not bake copyrighted full scripts into a publishable package unless the required rights clearly permit it.

## 12. Full-screenplay research references

Full-screenplay narrative-understanding research and benchmarks can demonstrate that certain screenplay-scale tasks are definable/evaluable and can inspire benchmark design.

They do **not** validate Fount's StoryWorld, Reader model, diagnoses, provider choices, or future accuracy. External results must never be cited as evidence that an untested Fount implementation works.

## 13. Reader-study corpus

For Reader, collect checkpoint annotations such as:

- what do you think will happen next?
- what question do you most want answered?
- what do you believe about proposition X now?
- what do you think character C knows/believes now?
- how tense/curious/confused did this section feel?
- what caused the confusion?
- which character outcome matters most?
- was the reveal surprising?
- did the payoff feel prepared/earned?
- do you want to continue reading?

Store distributions/disagreement rather than imitating one reader.

## 14. Regression fixtures

Every discovered bug becomes a minimized fixture where practical.

Examples:

- response association failure;
- duplicate request ID;
- future leakage into Reader;
- flashback inherits future possession/death state;
- story-time ambiguity forced into arbitrary order;
- causal relation inferred solely from presentation order;
- setup dependency broken after scene deletion;
- character knowledge without access path;
- false voice drift after alias rename;
- relationship state transition applied twice;
- MeasurementResult reused across different semantic context;
- old Observation provenance reused after cross-revision cache hit;
- result reused across unstable/different model fingerprint;
- stale output-contract fixture silently accepted.

## 15. Release/default gates

A lens/diagnosis should not become default merely because it compiles.

Default-ready measurement assets need:

- construct definition;
- output-contract definition/digest;
- fixture tests;
- provider contract coverage where applicable;
- calibration/evaluation note;
- known failure modes;
- content-addressed asset identity;
- intended downstream uses.

Experimental assets may be explicitly tagged/isolated without creating compatibility-version APIs.

## 16. Early validation spine

Before Phase 11, capability phases produce small human-review artifacts as specified in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`:

- Phase 3: structural/StoryWorld pilot;
- Phase 4: first-reader checkpoint pilot;
- Phase 5: diagnosis/playbook usefulness pilot;
- Phases 6–8: capability-family human-reviewed cases;
- Phase 9: end-to-end writer workflow review.

These pilots are exploratory and must not be marketed as population-level validation. Their purpose is to catch wrong constructs, unusable output, and obvious mismatch with writer/reader experience before large implementation investment compounds the error.