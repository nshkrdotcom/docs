# 15 — Chiral Resolution Algorithm

## Problem statement

Given two or more narratives that share evidence but imply conflicting claims, or that depend on unavailable expected records, produce a ranked set of worlds that either resolves the conflict through grounded context/access structure or explicitly preserves uncertainty.

## Inputs

- Evidence atoms `E`.
- Claim graph `G`.
- Record-access states `A`.
- Institutional incentive profiles `I`.
- Strict tensor rules `R0`.
- Soft/access rules `R+`.
- Source reliability priors `Qsource`.
- Optional latent context vocabulary.

## Outputs

- Ranked worlds `W1...WK`.
- Claim likely-truth table.
- Strict support table.
- Residual contradiction report.
- Access-contingency report.
- Suggested evidence collection actions.

## Algorithm

### Step 1 — Grounded closure

Compute zero-temperature closure:

```text
F0 = Closure(E, Claims, R0, tau=0)
```

Every element of `F0` receives proof trace.

### Step 2 — Access-state construction

Classify expected records:

```text
A = AccessModel(E, domain_norms, source_metadata)
```

Each record gets generation duty, expected observability, controller, access state, and confidence.

### Step 3 — Conflict localization

Find conflict pairs:

```text
Conflict(c_i, c_j) if c_i supports h and c_j refutes h
or if closure derives h and not_h
or if graph/chiral residual exceeds threshold.
```

Find access conflicts:

```text
AccessConflict(c, r) if c materially depends on r and r is missing,
inaccessible, withheld, destroyed, or affirmatively non-supportive.
```

### Step 4 — Evidence entanglement

For each conflict pair compute shared evidence:

```text
E_AB = weighted_overlap(E_A, E_B)
```

High entanglement means productive conflict; low entanglement may be unrelated narratives.

### Step 5 — Residual tensor construction

Construct support/refute tensors over indices:

```text
T_support[claim, evidence, context, access]
T_refute[claim, evidence, context, access]
R = T_support - T_refute
```

### Step 6 — Context and access proposal

Factorize residual:

```text
R ≈ Core × U_claim × U_evidence × U_context × U_access
```

Map context factors to candidate predicates:

- time split;
- subgroup;
- mechanism;
- source frame;
- measurement method;
- geography/jurisdiction;
- modality/instrumentation.

Map access factors to candidate predicates:

- record expected but unavailable;
- record expected but withheld;
- record expected and affirmatively refuting;
- record not expected to exist;
- source with asymmetric control;
- produced record narrower than requested.

### Step 7 — Validation

For each proposed latent or access predicate:

1. bind evidence spans or access metadata to predicate descriptions;
2. test residual reduction;
3. penalize complexity;
4. reject if unsupported;
5. reject if it promotes strict truth without proof.

### Step 8 — World generation

Generate worlds with and without each validated context/access predicate. Each world receives energy score.

### Step 9 — Posterior and claim ranking

Normalize worlds and compute claim posteriors:

```text
P(c|E,A,I)=Σ_W Q(W|E,A,I) I[c∈Closure(W)]
P0(c|E)=Σ_W Q(W|E,A,I) I[c∈Closure0(W)]
```

### Step 10 — Report

If one world dominates and confidence is high, render synthesis. Otherwise render multiverse view with alternatives, access-contingencies, and evidence that would change the ranking.

## Pseudocode

```python
def resolve_chiral_conflict(evidence, claims, access_states, incentives, rules):
    f0 = strict_closure(evidence, claims, rules.strict)
    conflicts = localize_conflicts(f0, claims)
    access_conflicts = localize_access_conflicts(claims, access_states)
    residual = build_residual_tensor(conflicts, access_conflicts, evidence)
    contexts, access_preds = propose_contexts_and_access(residual)
    contexts = [z for z in contexts if validate_context(z, evidence, residual)]
    access_preds = [a for a in access_preds if validate_access(a, access_states, residual)]
    worlds = build_worlds(f0, contexts, access_preds, incentives, rules)
    worlds = rank_worlds(worlds, evidence, access_states, incentives)
    return synthesize_report(worlds)
```

## Edge cases

### No shared evidence

Do not synthesize as contradiction. Report independent narratives.

### Conflict with no valid context

Do not force resolution. Report conflicted status and evidence needed.

### Missing expected record

Do not treat missingness as refutation unless evidence-of-absence conditions are met. Mark record-contingent and show competing missingness worlds.

### Soft-only resolution

Label as probable, plausible, or record-contingent, not strict proof.

### Dominant world but low confidence

Use estimative language and explain uncertainty.
