# Testing Strategy

## Test categories

1. Schema tests.
2. Citation resolution tests.
3. Grounding tests.
4. Tensor closure tests.
5. Possible-world normalization tests.
6. Chirality metric tests.
7. Rendering faithfulness tests.
8. Oracle-boundary tests.

## Critical tests

### No unresolved citation can be promoted

Given a claim with evidence ref `E999` missing from corpus, status must be `unsupported` or `rejected`.

### Strict rule requires proof trace

If a claim is `proven`, it must have at least one proof trace with temperature 0.

### Posterior normalization

World posteriors must sum to 1 within numerical tolerance.

### Soft rule cannot promote strict truth

A claim supported only by soft rules may be `plausible` but not `proven`.

### Runtime labels forbidden

If evaluation labels are visible in runtime config, pipeline must fail closed.
