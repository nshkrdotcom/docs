# 13 — Metrics and Acceptance Criteria

## Core metrics

### SNO validity rate

Fraction of outputs that parse into valid SNO-8 schema.

Target MVP: ≥ 95%.

### Citation validity

Fraction of cited evidence references that resolve to known evidence atoms.

Target strict claims: 100%.

### Mean entailment

Mean NLI/evidence support score for strict and likely claims.

Target strict claims: ≥ 0.75 in MVP, domain-adjusted later.

### Zero-Temperature Hallucination Rate

$$
ZTHR =
\frac{
\#\text{strict promoted claims without valid proof trace}
}{
\#\text{strict promoted claims}
}
$$

Target: 0.

### Evidential Entanglement

Weighted evidence overlap between SNOs.

Used for pair selection, not final truth.

### Chiral tension

Combination of graph, evidence-polarity, and language–logic chirality.

### Productive Conflict Precision@K

Fraction of top-K selected SNO pairs that yield either:

- accepted synthesis;
- useful latent predicate;
- explicitly preserved unresolved contradiction.

### Residual energy

Unresolved support/refute contradiction mass after proof closure and accepted predicates.

### Predicate-Invention Utility

$$
PIU =
\frac{\Delta ResidualEnergy}{1 + PredicateComplexity}
$$

### False Predicate Rate

Accepted latent predicates that fail grounding or do not generalize.

### Orthesis convergence

Fraction of synthesized SNOs satisfying round-trip and proof criteria.

### Round-trip residual

$$
\chi_{LL}=\|G(S(T))-T\|_\Omega
$$

### Beta-1 reduction

$$
\Delta \beta_1 = \beta_1(G_{input}) - \beta_1(G_{synth})
$$

CNS should not force cycles to zero when the contradiction is real. Preserved contradictions must be explicit.

### Calibration ECE

Expected calibration error for likely claims.

## Acceptance bands

| Metric | MVP | Research target |
|---|---:|---:|
| SNO validity | ≥95% | ≥98% |
| citation validity strict | 100% | 100% |
| ZTHR strict | 0 | 0 |
| mean entailment strict | ≥0.75 | ≥0.85 |
| pair-selection P@10 | ≥0.60 | ≥0.80 |
| latent recovery F1 synthetic | ≥0.60 | ≥0.85 |
| orthesis convergence | ≥0.40 | ≥0.70 |
| ECE likely claims | ≤0.15 | ≤0.08 |

## Report categories

Final outputs must separate:

- strict;
- likely;
- hypothesis;
- unresolved;
- rejected.

Do not collapse these into one confidence score.

## Failure taxonomy

- citation hallucination;
- weak entailment;
- unsupported synthesis;
- predicate overfit;
- access-state misuse;
- hidden oracle leakage;
- round-trip drift;
- topology overclaim;
- possible-world substitution;
- LLM truth voting.
