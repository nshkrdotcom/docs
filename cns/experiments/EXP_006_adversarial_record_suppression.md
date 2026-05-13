# EXP-006 — Adversarial Record Suppression

## Purpose

Test whether GCTS can distinguish absent evidence, evidence of absence, inaccessible evidence, likely withheld evidence, destroyed records, and records not expected to exist.

## Data generator

Generate scenarios with:

- base event: X;
- target claim: C;
- record type: R;
- record-generation duty: high/medium/low;
- expected observability: high/medium/low;
- controller incentive: aligned/adverse/neutral;
- production status: produced, not produced, partially produced, delayed, destroyed, not generated.

Example:

```text
Claim: System S emitted alert A before event E.
Expected record: Alert log R.
Access state: R is expected, controlled by Actor K, requested but not produced.
Gold: claim is record_contingent; non-production is not evidence of absence.
```

Counterexample:

```text
Claim: System S emitted alert A before event E.
Expected record: Alert log R.
Access state: R is produced and affirmatively contains no alert A.
Gold: evidence of absence; claim likely rejected unless another world explains log scope failure.
```

## Hypotheses

- H1: Full GCTS has higher access-state F1 than no-access ablation.
- H2: Full GCTS has lower false rejection rate for record-contingent claims.
- H3: Full GCTS has lower false promotion rate when affirmative evidence of absence exists.
- H4: Suppression hypotheses improve calibration only when record-duty, access control, and adverse incentive conditions are present.

## Metrics

- access-state F1;
- likely-truth Brier score;
- ECE;
- false absence penalty rate;
- suppression hypothesis precision;
- top-K world coverage;
- record-contingent status accuracy.

## Ablations

- no access modeling;
- no institutional incentives;
- no benign missingness world;
- no evidence-of-absence rule;
- no parsimony penalty on suppression hypotheses.
