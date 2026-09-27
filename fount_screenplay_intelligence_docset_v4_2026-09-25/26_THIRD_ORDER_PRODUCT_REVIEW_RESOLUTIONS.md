# Third-Order Product Review Resolutions

## 1. Purpose

This document records the Socratic review of the writer-usefulness critiques raised after the prior architecture revision was frozen. It is deliberately product-facing rather than package-facing. The question is not whether the architecture is elegant; the question is whether the resulting system would help a serious feature-screenplay writer make better decisions without pretending to replace human judgment.

The review produced six material corrections and one explicit non-change.

## 2. Writer-facing output: the earlier critique was right about the problem, wrong about the noun

The earlier phrase “no UI” was imprecise. A headless system can be entirely legitimate. Fount may ultimately be used through a chat/agent surface, desktop application, editor plugin, web frontend, CLI, studio service, or another product.

The real missing artifact was a **writer-facing presentation contract**.

Without one, every frontend would independently invent how to present evidence, uncertainty, competing diagnoses, protected strengths, revision effects, and temporal movement. That would make product behavior inconsistent even if the analytical engine were correct.

### Resolution

`27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md` is normative.

Every writer-facing playbook result must distinguish at least:

- the writer's question/concern;
- observed evidence;
- exact source references;
- derived state;
- diagnosis/hypothesis;
- counterevidence and alternatives;
- uncertainty / missing evidence;
- protected strengths;
- possible strategies, when requested;
- revision comparison, when applicable;
- what the system is **not** claiming.

A minimal reference renderer must exist before the final UI exists so domain reviewers can inspect the same semantic result packet a future frontend would consume.

## 3. Early human validation is not a free reordering

The criticism that “move validation earlier” adds real staffing, rights, storage, scheduling, and review costs is correct. Human validation cannot be wished into a phase plan as a sentence.

The original program postponed most corpus and reader-study logistics until late because those logistics are genuinely non-trivial. Moving product validation earlier therefore requires a **separate validation workstream**, not merely changing phase numbers.

### Resolution

`28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md` defines:

- early exploratory validation versus later quantitative calibration;
- reviewer/reader roles;
- rights-cleared corpus lanes;
- privacy/provider-export rules;
- corpus manifests and retention metadata;
- domain-review artifacts;
- phase-specific pilot gates;
- the rule that engineering completion and dramaturgical/product validation are separate claims.

Early phases use small, legally usable pilots. Phase 11 remains the scale-up/calibration phase rather than the first moment human judgment enters the program.

## 4. STAGE is adjacent evidence, not validation of Fount

The STAGE benchmark demonstrates that full-screenplay tasks such as world representation, event abstraction, screenplay question answering, and character-oriented reasoning can be formalized and benchmarked over feature-length scripts.

It does **not** validate Fount's StoryWorld, Reader model, diagnoses, temporal model, or provider choices.

### Resolution

STAGE may be cited only for:

- evidence that screenplay-scale structured evaluation tasks exist;
- inspiration for evaluation task design;
- possible external comparison where licensing/task alignment permits.

It must never be cited as evidence that Fount's untested implementation is accurate.

## 5. Genre-pack criticism: extension workflow was the real gap

The prior response was too dismissive. The important concern was not that every genre label needs a dedicated pack. The real issue was that “hybrid/custom packs” had been asserted without a concrete authoring, validation, installation, trust, and resource-budget workflow.

### Resolution

`29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md` makes pack/lens extensibility a designed product surface.

The system must support declarative project/user/studio packs without requiring Elixir changes **when they only compose or parameterize registered safe primitives**.

The executable surface remains closed.

No requirement is added to invent packs merely to cover every bookstore genre label. A pack exists when it adds useful domain-specific questions, measurements, salience, or diagnostics beyond the general twelve capability families.

## 6. Declarative extensibility is not automatically safe

This criticism is strongly relevant.

A data-only lens can still:

- consume provider budget;
- send badly scoped screenplay context to a provider;
- contain adversarial or misleading natural-language instructions;
- produce malformed or semantically misleading measurements;
- request too much work through combinatorial composition;
- create privacy problems if it asks for confidential context that was unnecessary.

Calling an asset “configuration” does not eliminate these risks.

### Resolution

Declarative assets operate under capability restrictions:

- only registered projection primitives;
- only registered provider-neutral output contracts;
- only declared context slots;
- no module/function/tool names;
- no filesystem/network/provider configuration;
- no credentials;
- no arbitrary iteration/recursion;
- hard host-controlled request/token/time/resource ceilings;
- minimal-context projection by default;
- explicit trust/source metadata;
- installation-time validation;
- writer/studio approval for non-core assets;
- structured separation between system instructions and untrusted lens/content text.

A third-party lens may influence a **measurement request**; it never receives execution privileges.

## 7. Cost must be modeled longitudinally, not as one coverage purchase

The earlier use of one-shot coverage-service prices was only a market anchor. It should not be used as evidence that Fount's economics are acceptable.

Fount's intended usage pattern is iterative:

- initial whole-draft analysis;
- targeted scene/sequence passes;
- repeated runs after revisions;
- candidate comparison;
- regression checks;
- possibly many passes over a rewrite cycle.

The relevant unit is therefore not “price of one coverage report.”

### Resolution

`30_LONGITUDINAL_RESOURCE_ECONOMICS.md` defines:

- preflight estimates;
- marginal rerun cost after reuse;
- per-playbook, per-draft, and per-project budgets;
- hosted monetary cost where rates are configured;
- on-prem/local GPU time, queue pressure, and compute accounting;
- maximum caps;
- scenario-based longitudinal estimates over many rewrite iterations.

The product must be able to answer: “What will this pass consume, and what will rerunning it after this revision probably consume?” before execution.

## 8. Feature-film-only scope is intentional, not an unresolved gap

The criticism that television writers receive no dedicated support is factually true but not a defect **within this program's stated scope**.

This project is intentionally about feature screenplays.

Adding episodic reset, season/series arcs, act-outs, writers-room provenance, episode continuity, cold opens/tags, network/streaming format conventions, and series-bible state would be a separate scope expansion with different evaluation requirements.

### Resolution

`31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md` makes this boundary explicit.

Do not distort feature-film architecture to preserve hypothetical future TV compatibility. If episodic/series support is later desired, it receives its own requirements and evidence rather than being smuggled into this program.

## 9. Human-validation claims must distinguish accuracy from usefulness

A finding can be technically supported but useless to a writer. Conversely, a probabilistic interpretation can be useful because it provokes a productive re-read even when it is not an objective fact.

### Resolution

Domain evaluation records at least two independent dimensions:

1. **support / validity** — is the claim grounded and defensible from the screenplay/evidence?
2. **writer usefulness** — does the result help the writer understand, decide, compare, or revise?

Other dimensions may include clarity, novelty, actionability, preservation of intent, and trust calibration, but they must not be collapsed into one global quality score.

## 10. Product-validation spine

The implementation phases remain technically sequential, but domain validation becomes a parallel spine:

```text
Phase 3  StoryWorld factual/structural pilot
Phase 4  first-reader checkpoint pilot
Phase 5  diagnosis/playbook usefulness pilot
Phase 6  scene/agency/character/relationship review
Phase 7  audience/sequence/dialogue/setup-payoff review
Phase 8  emotional/theme/genre/revision review
Phase 9  end-to-end writer workflow review
Phase 11 scaled calibration + robustness + corpus evaluation
```

Phase 11 is still where systematic calibration becomes mature. It is no longer the first time a human sees the claims.

## 11. Final stance

The product remains:

- headless/domain-first;
- feature-screenplay-specific;
- writer-authority-preserving;
- non-scoring by default;
- evidence-first;
- provider-topology-independent;
- closed for executable primitives;
- open for safe writer questions and constrained declarative composition;
- empirically humble about reader psychology;
- explicit about compute/resource cost;
- evaluated for usefulness as well as analytical support.