# Human Validation and Corpus Operations

## 1. Why this is a separate workstream

Engineering QC answers whether the software behaves as specified.

Dramaturgical/product validation asks whether the claims are supported, useful, understandable, and aligned with actual first-reader/writer experience.

These require different people, artifacts, rights, and budgets.

The program therefore treats human validation as a parallel workstream with explicit resourcing rather than a late-phase afterthought.

## 2. Three validation levels

### Level A — structural/factual verification

Used for StoryWorld, evidence extraction, event/fact/knowledge/causal representations, and continuity.

Reviewers compare output against screenplay evidence and an annotation guide.

This can begin early with small rights-cleared sets.

### Level B — expert writer/reader usefulness review

Experienced screenwriters, script readers, story editors, or dramaturgically competent reviewers assess:

- whether a diagnosis is supportable;
- whether it is useful;
- whether it misses obvious alternatives;
- whether it respects intent;
- whether it overstates certainty;
- whether strategies are meaningfully different.

This is product validation, not statistical calibration.

### Level C — reader-response calibration

Independent first-time readers answer checkpoint questions without future exposure.

Examples:

- what do you currently believe happened?
- what do you think character X knows?
- what question are you waiting to see answered?
- what outcome do you expect?
- what threat feels active?
- where were you confused?

This produces human distributions/disagreement for Reader-model evaluation.

## 3. Early pilot versus Phase-11 scale-up

Early pilots are deliberately small and exploratory.

They are designed to catch category errors before eight more phases build on them.

Optional pilot targets if a study is commissioned, subject to actual staffing:

- Phase 3: at least 3 rights-cleared feature scripts or substantial feature-script excerpts; at least 2 independent structural reviewers for selected facts/events/relations;
- Phase 4: at least 3 scripts/excerpts with first-reader checkpoints; target 3–5 independent readers per selected checkpoint set;
- Phase 5: at least 10 diagnosis cases reviewed by at least 2 experienced screenwriting/story reviewers;
- Phases 6–8: each newly completed capability family contributes at least one human-reviewed case plus adversarial/negative cases;
- Phase 9: at least one end-to-end rewrite/investigation session evaluated for usefulness, intent preservation, and evidence quality.

These are **optional pilot targets** if a study is commissioned, not implementation requirements or claims of statistical validity.

Phase 11 designs the larger evaluation using observed variance/disagreement and an explicit study plan rather than pretending an arbitrary N proves calibration.

## 4. Rights-cleared corpus lanes

The project must not assume that a screenplay found online can be redistributed, uploaded to a provider, or bundled in tests.

Acceptable corpus lanes include:

### 4.1 Author-owned / user-supplied

The writer owns or controls the screenplay and explicitly allows the intended evaluation/provider use.

### 4.2 Commissioned evaluation material

Original feature-script scenes or full scripts commissioned with explicit evaluation rights.

### 4.3 Written permission / license

Rights holder grants the required analysis, storage, provider-processing, and/or redistribution rights.

### 4.4 Verified public-domain material

Use only where public-domain status for the actual screenplay text is verified, not merely assumed from the age/status of the film.

### 4.5 External benchmark under its own license

Use benchmark material only within the license/terms that actually apply. Do not copy it into publishable Fount packages unless redistribution is permitted.

## 5. Corpus manifest

Every corpus item should have a rights/provenance manifest independent of its annotations.

Suggested fields:

```text
corpus_item_id
pseudonymous title / internal label
source
rights_basis
rights_evidence_ref
allowed_uses
provider_export_allowed
human_review_allowed
redistribution_allowed
retention_policy
confidentiality_class
created/ingested date
notes
```

Do not put secrets or sensitive legal documents inside package fixtures.

## 6. Provider export policy

A confidential screenplay may be legal to evaluate internally but not authorized for export to a hosted model provider.

Corpus/project policy therefore separates:

```text
may store locally
may show human reviewers
may send to hosted Observe provider
may send to hosted Inference provider
may process only on-prem/local
may redistribute in package/tests
```

On-prem/local inference is a major product advantage for studios and confidential material, but the system must not assume it is always configured.

## 7. Reader-study protocol

For Reader evaluation:

- preserve first-exposure order;
- prevent future-scene contamination;
- capture checkpoint timestamp/order;
- separate free response from forced-choice where possible;
- record uncertainty;
- allow "I don't know / not enough information";
- preserve disagreement;
- avoid showing Fount's prediction before the reader answers;
- keep writer intent hidden from ordinary first-reader panels unless the study specifically evaluates intent-conditioned reading.

## 8. Writer-usefulness protocol

Usefulness reviewers may see the writer's concern and intended effect.

Rate separately:

- evidence support;
- usefulness;
- specificity;
- clarity;
- non-obviousness;
- alternative-awareness;
- uncertainty honesty;
- respect for intent;
- over-prescriptiveness;
- protected-strength awareness.

Free-text rationale should accompany numeric/ordinal labels where practical.

## 9. Human disagreement is signal

Do not force consensus on subjective dimensions.

Store distributions and rationales.

A useful result may be:

> Three readers inferred the betrayal here; two did not. The scene therefore appears inference-sensitive rather than uniformly obvious.

That is more informative than declaring one reader "wrong."

## 10. Phase gating

Engineering and domain status are distinct.

For phases with optional domain pilots, engineering progress follows its own gates. Historical progress could pass through:

```text
OFFLINE_IMPLEMENTED
QC_IN_PROGRESS
DOMAIN_REVIEW_PENDING
COMPLETE
```

Under D046, an engineering-clean phase may be `COMPLETE` while every human review is skipped. Missing human review never blocks implementation, sequencing, or engineering acceptance and needs no new waiver. Record the skipped study as visible validation debt. The phase must not be described as dramaturgically or human validated until real study evidence exists.

## 11. Phase-11 role

Phase 11 is the scale-up phase for:

- larger evaluation sets;
- calibration curves and distributional metrics where appropriate;
- robustness/model drift;
- capability-specific benchmark suites;
- inter-rater disagreement analysis;
- repeatability;
- model/provider comparisons;
- study-design refinement based on earlier pilots.

If earlier optional studies were skipped, Phase 11 may be the first human contact with the system; do not imply otherwise.

## 12. Legal caution

Screenplays are dramatic/literary works and copyright/AI-use questions can be context-specific. The implementation must not encode a blanket assumption that research, evaluation, or model processing is automatically permitted merely because a script is publicly accessible.

Use rights-cleared lanes and obtain legal review where the use requires it.

## 13. External benchmark boundary

External benchmarks such as STAGE may inform task design and provide separately licensed comparison material.

Their existence demonstrates that screenplay-scale structured tasks can be evaluated. It does **not** validate Fount's implementation or reader/diagnosis claims.