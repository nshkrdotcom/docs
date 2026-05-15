# Worked Example — CNS 8.0 Resolves a Conditional Contradiction

## Input account A

SNO-A:

```text
Claim A1: Treatment X reduces symptom Y.
Evidence: Study 1, Study 2.
Relation: Study 1 supports A1.
Relation: Study 2 supports A1.
```

## Input account B

SNO-B:

```text
Claim B1: Treatment X does not reduce symptom Y.
Evidence: Study 3, Study 4.
Relation: Study 3 supports B1.
Relation: Study 4 supports B1.
```

## Step 1 — Evidential Entanglement

The evidence sets overlap through shared measurements and trial endpoints. Entanglement is moderate/high.

## Step 2 — Chirality

The accounts disagree over the same predicate:

```text
reduces(X,Y)
```

Evidence-polarity chirality is high because the same endpoint is interpreted in opposite directions.

## Step 3 — Antagonist report

The Antagonist finds:

- different dosage ranges;
- different age subgroups;
- different measurement windows;
- no direct citation failure;
- contradiction persists under original predicate vocabulary.

## Step 4 — Zero-temperature closure

Strict closure proves:

```text
Study1 supports reduces(X,Y) under high_dose.
Study2 supports reduces(X,Y) under high_dose.
Study3 supports not_reduces(X,Y) under low_dose.
Study4 supports not_reduces(X,Y) under low_dose.
```

The original predicate `reduces(X,Y)` remains contradictory because dose context was missing.

## Step 5 — Residual tensor

Residual mass concentrates around:

```text
subject: Treatment X
predicate: reduces
object: Symptom Y
context: dose / subgroup
```

## Step 6 — Predicate invention

Tensor factorization proposes:

```text
latent predicate L1: high_dose_context
latent predicate L2: low_dose_context
```

Grounding critic finds dosage spans in evidence atoms. The predicates pass initial grounding.

## Step 7 — Synthesized SNO

SNO-C:

```text
Claim C1 strict: Treatment X reduces symptom Y in high-dose contexts supported by Study 1 and Study 2.
Claim C2 strict: Treatment X does not show reduction of symptom Y in low-dose contexts supported by Study 3 and Study 4.
Claim C3 likely: Dose context explains the apparent contradiction.
Residual: Subgroup interaction remains unresolved.
```

## Step 8 — Orthesis loop

Render SNO-C to language, re-ground it, and compare logic state.

If:

```text
G(S(T_C)) ≈ T_C
```

and proof traces remain intact, SNO-C becomes an orthesis candidate.

## Audit report

The final report includes:

- proof traces for C1 and C2;
- latent predicate status for dose context;
- unresolved subgroup residual;
- possible worlds for subgroup interaction;
- confidence language.
