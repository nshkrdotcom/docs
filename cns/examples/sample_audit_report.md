# Sample CNS 8.0 Audit Report

## Synthesis status

Orthesis candidate: **accepted**

## Strict claims

1. Claim C1 follows from evidence `e1`, `e2` under rule `r_supports_from_entailment`.
2. Claim C2 follows from evidence `e3` under rule `r_refutes_from_entailment`.

## Likely claims

1. Claim C3 has posterior 0.78 under worlds W1 and W2 but lacks zero-temperature proof.

## Hypotheses

1. Latent predicate `dose_context` explains residual contradiction and is supported by dosage spans in `e1`, `e3`.

## Unresolved claims

1. Subgroup interaction remains unresolved because subgroup records are not available.

## Rejected claims

1. Claim R1 rejected due to invalid citation `doc_999`.

## Proof traces

```text
C1 ← r_supports_from_entailment(e1, e2)
C2 ← r_refutes_from_entailment(e3)
```

## Residual contradiction

Residual mass remains on:

```text
Treatment X × reduces × Symptom Y × subgroup_unknown
```

## Access gaps

- subgroup stratification table: `not_collected`
- adverse event appendix: `withheld`

## Top worlds

| World | Posterior | Notes |
|---|---:|---|
| W1 | 0.62 | dose context accepted, subgroup unresolved |
| W2 | 0.24 | dose and subgroup both relevant |
| W3 | 0.14 | measurement method explains conflict |

## Calibration

Likely-claim ECE: 0.11

## Final note

The synthesis narrows the contradiction by dose context but does not erase subgroup uncertainty.
