# 15 — Chiral Resolution Algorithm

## Problem statement

Given two or more narratives that share evidence but imply conflicting claims, produce a ranked set of worlds that either resolves the conflict through grounded context or explicitly preserves uncertainty.

## Inputs

- Evidence atoms `E`.
- Claim graph `G`.
- Strict tensor rules `R0`.
- Soft rules `R+`.
- Source reliability priors `Qsource`.
- Optional latent context vocabulary.

## Outputs

- Ranked worlds `W1...WK`.
- Claim posterior table.
- Residual contradiction report.
- Suggested evidence collection actions.

## Algorithm

### Step 1 — Grounded closure

Compute zero-temperature closure:

```text
F0 = Closure(E, Claims, R0, tau=0)
```

Every element of `F0` receives proof trace.

### Step 2 — Conflict localization

Find conflict pairs:

```text
Conflict(c_i, c_j) if c_i supports h and c_j refutes h
or if closure derives h and not_h
or if graph/chiral residual exceeds threshold.
```

### Step 3 — Evidence entanglement

For each conflict pair compute shared evidence:

```text
E_AB = weighted_overlap(E_A, E_B)
```

High entanglement means productive conflict; low entanglement may be unrelated narratives.

### Step 4 — Residual tensor construction

Construct support/refute tensors over indices:

```text
T_support[claim, evidence, context]
T_refute[claim, evidence, context]
R = T_support - T_refute
```

### Step 5 — Context proposal

Factorize residual:

```text
R ≈ Core × U_claim × U_evidence × U_context
```

Map context factors to candidate predicates:

- time split;
- subgroup;
- mechanism;
- source frame;
- measurement method;
- geography/jurisdiction;
- modality/instrumentation.

### Step 6 — Context validation

For each proposed latent predicate:

1. bind evidence spans to predicate descriptions;
2. test residual reduction;
3. penalize complexity;
4. reject if unsupported.

### Step 7 — World generation

Generate worlds with and without each validated latent context. Each world receives energy score.

### Step 8 — Posterior and claim ranking

Normalize worlds and compute claim posteriors:

```text
P(c|E)=Σ_W Q(W|E) I[c∈Closure(W)]
```

### Step 9 — Report

If one world dominates and confidence is high, render synthesis. Otherwise render multiverse view with alternatives.

## Pseudocode

```python
def resolve_chiral_conflict(evidence, claims, rules):
    f0 = strict_closure(evidence, claims, rules.strict)
    conflicts = localize_conflicts(f0, claims)
    residual = build_residual_tensor(conflicts, evidence)
    contexts = propose_contexts(residual)
    contexts = [z for z in contexts if validate_context(z, evidence, residual)]
    worlds = build_worlds(f0, contexts, rules)
    worlds = rank_worlds(worlds, evidence)
    return synthesize_report(worlds)
```

## Edge cases

### No shared evidence

Do not synthesize as contradiction. Report independent narratives.

### Conflict with no valid context

Do not force resolution. Report conflicted status and evidence needed.

### Soft-only resolution

Label as hypothesis, not proof.

### Dominant world but low confidence

Use estimative language and explain uncertainty.
