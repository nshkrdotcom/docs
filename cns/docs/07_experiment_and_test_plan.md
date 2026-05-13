# 07 — Experiment and Test Plan

## Experimental philosophy

The project must test the theory, not only produce plausible demos. Every experiment has:

- pre-registered hypotheses;
- baselines;
- ablations;
- held-out data;
- no runtime oracle;
- failure criteria.

## Core experiments

### EXP-001 — Synthetic latent-context resolution

Purpose: determine whether GCTS can recover hidden modifiers that explain contradictions.

Data: generate claims where conflict is resolved by planted latent variables: time, subgroup, measurement method, mechanism.

Success:

- top-3 world coverage ≥ 85%;
- latent predicate recovery F1 ≥ 0.70;
- calibration ECE ≤ 0.10.

### EXP-002 — SciFact/FEVER oracle-less grounding

Purpose: test claim-status assignment with benchmark labels withheld at runtime.

Data: SciFact, FEVER, optional SciFact-Open.

Baselines:

- RAG + direct answer;
- RAG + NLI verifier;
- multi-agent debate;
- GCTS without multiverse;
- full GCTS.

Success:

- zero promoted strict claims with unresolved citations;
- improved ECE/Brier over baselines;
- higher abstention precision.

### EXP-003 — Multiverse calibration

Purpose: verify whether top-K worlds are calibrated and informative.

Metrics:

- top-K world coverage;
- Brier score for claim probabilities;
- ECE;
- entropy vs error correlation.

### EXP-004 — Oracle boundary ablation

Purpose: prove that oracle use is limited to training/evaluation.

Conditions:

1. No labels at all.
2. Labels for offline calibration only.
3. Illegal runtime oracle upper bound.

Expected outcome: condition 2 should improve calibration over condition 1, while condition 3 should be treated as an upper bound and never as deployable.

### EXP-005 — Chirality predictiveness

Purpose: test whether chirality predicts synthesis difficulty.

Dependent variables:

- convergence iterations;
- contradiction residual after synthesis;
- human uncertainty rating;
- false synthesis rate;
- abstention correctness.

Success: chirality has statistically significant predictive power beyond embedding distance and graph cycle count.

### EXP-006 — Adversarial record suppression

Purpose: test whether GCTS distinguishes absent evidence, evidence of absence, inaccessible evidence, likely withheld evidence, and not-generated evidence.

Data: synthetic scenarios with planted access states:

- expected record exists and is produced;
- expected record exists but is inaccessible;
- expected record exists but is withheld;
- expected record was destroyed;
- record was never expected to exist;
- produced record affirmatively refutes the claim.

Baselines:

- RAG-only;
- RAG + NLI;
- LLM debate;
- GCTS without access modeling;
- full GCTS.

Success:

- access-state F1 ≥ 0.75 on synthetic planted cases;
- improved likely-truth Brier/ECE over no-access ablation;
- lower false rejection rate for claims whose decisive records are inaccessible;
- lower false promotion rate for claims where evidence of absence is available.

## Test layers

### Unit tests

- schema validation;
- citation ID resolution;
- tensor rule firing;
- proof trace emission;
- posterior normalization;
- entropy/confidence formulas;
- access-state classification invariants.

### Property tests

- posterior mass sums to 1;
- adding supporting evidence should not increase contradiction energy unless source reliability conflicts;
- strict rule promotion requires a proof trace;
- invalid citations force strict claim status to unsupported;
- soft rules cannot promote strict truth claims;
- absence of evidence cannot be treated as evidence of absence without a record-duty and access-path basis;
- adding unused suppression hypotheses increases parsimony penalty.

### Integration tests

- ingestion → extraction → grounding → access modeling → closure → world ranking → report.

### Golden tests

- hand-authored examples for:
  - support;
  - refutation;
  - insufficient evidence;
  - subgroup resolution;
  - time-split resolution;
  - conflicting sources;
  - source reliability downgrade;
  - expected record not produced;
  - record affirmatively refutes claim;
  - record not expected to exist.

### Red-team tests

- adversarial citation hallucination;
- semantically similar negations;
- unsupported paraphrase;
- misleading source with high lexical overlap;
- evidence that supports a narrower claim than generated;
- false suppression inference from ordinary missingness;
- strategic partial disclosure.

## Baseline suite

1. **RAG-only:** answer from retrieved evidence.
2. **RAG + NLI gate:** verify citations but no possible worlds.
3. **LLM debate:** multiple agents debate and summarize.
4. **Self-consistency:** sample multiple answers and majority/consistency vote.
5. **Argument graph only:** extract support/refute graph and rank by graph metrics.
6. **GCTS without access modeling:** evidence closure + worlds + chirality, no record-access layer.
7. **Full GCTS:** evidence closure + worlds + chirality + residual decomposition + access modeling.

## Statistical tests

- Bootstrap CIs for ECE, Brier, coverage, and access-state F1.
- McNemar tests for paired pass/fail comparisons.
- Mann-Whitney U for difficulty distributions.
- Spearman/Pearson correlation for chirality predictiveness.
- Ablation effect sizes with confidence intervals.

## Artifacts per experiment

- config YAML;
- dataset manifest;
- run manifest;
- raw predictions;
- access-state table;
- world posterior table;
- proof traces;
- metrics JSON;
- rendered report;
- error analysis notebook.
