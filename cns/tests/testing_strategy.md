# Testing Strategy

## Test categories

1. Schema tests.
2. Citation resolution tests.
3. Grounding tests.
4. Access-state tests.
5. Tensor closure tests.
6. Possible-world normalization tests.
7. Chirality metric tests.
8. Rendering faithfulness tests.
9. Oracle-boundary tests.

## Critical tests

### No unresolved citation can be strictly promoted

Given a claim with evidence ref `E999` missing from corpus, status must be `unsupported` or `rejected` for strict promotion.

### Strict rule requires proof trace

If a claim is `proven`, it must have at least one proof trace with temperature 0.

### Posterior normalization

World posteriors must sum to 1 within numerical tolerance.

### Soft rule cannot promote strict truth

A claim supported only by soft rules may be `plausible`, `probable`, or `record_contingent`, but not `proven`.

### Runtime labels forbidden

If evaluation labels are visible in runtime config, pipeline must fail closed.

### Access gold forbidden

If planted access labels are visible in runtime config, pipeline must fail closed.

### Absence requires access basis

A missing record cannot refute a claim unless record-generation duty, expected observability, and reliable access path are established.

### Record-contingent status

If a decisive expected record is inaccessible, sealed, withheld, destroyed, or unknown, dependent claims must expose record contingency.

### Suppression hypothesis cannot prove

A world may include a suppression hypothesis, but no claim may become `proven` solely because the hypothesis is present.
