# EXP-001 — Synthetic Latent-Context Resolution

## Purpose

Test whether GCTS can recover hidden context variables that resolve contradictions.

## Data generator

Generate triples:

- base entity: X;
- target property: Y;
- context variable: Z;
- positive evidence for context Z=1;
- negative evidence for context Z=0.

Example:

```text
E1: Drug X reduced symptom Y in adults over 65.
E2: Drug X did not reduce symptom Y in adults under 40.
```

Gold resolution:

```text
Drug X effect depends on age group.
```

## Hypotheses

- H1: GCTS top-3 worlds include the planted latent context ≥85% of the time.
- H2: Residual tensor decomposition improves calibration relative to no-decomposition ablation.
- H3: RAG and debate baselines over-collapse contradictions into single false synthesis more often than GCTS.

## Metrics

- latent predicate F1;
- top-K world coverage;
- claim Brier score;
- contradiction residual reduction;
- report faithfulness.

## Ablations

- no residual decomposition;
- no multiverse, single world only;
- no proof closure;
- no grounding gate.