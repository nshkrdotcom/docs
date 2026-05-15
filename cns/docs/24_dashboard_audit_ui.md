# 24 — Dashboard and Audit UI Plan

## Purpose

The dashboard should make CNS structure visible. It should not hide the machinery behind a single answer.

## Views

### 1. SNO population view

Shows:

- SNO graph;
- claims;
- evidence atoms;
- proof status;
- critic flags.

### 2. Productive conflict map

Scatter plot:

- x-axis: Evidential Entanglement;
- y-axis: Chirality;
- size: source quality;
- color: synthesis status.

### 3. Antagonist report view

Shows:

- unsupported claims;
- contradictions;
- access gaps;
- topology issues;
- latent predicate suggestions.

### 4. Proof trace view

For each strict claim:

```text
claim → evidence → rule → intermediate atom → promoted claim
```

### 5. Residual tensor heatmap

Shows unresolved support/refute mass by predicate/context.

### 6. Predicate invention view

Shows:

- candidate latent predicates;
- factor score;
- grounding evidence;
- residual reduction;
- PIU;
- acceptance status.

### 7. Orthesis trajectory

Shows render/re-ground cycles:

- round-trip residual;
- proof atom preservation;
- claim drift;
- beta-1 change;
- accepted/rejected status.

### 8. Multiverse view

Shows top candidate worlds and posterior mass, with access assumptions.

### 9. Final audit report

Sections:

- strict claims;
- likely claims;
- hypotheses;
- unresolved claims;
- rejected claims;
- access gaps;
- proof traces;
- possible worlds;
- calibration.

## UI anti-patterns

Avoid:

- one giant answer box;
- hidden confidence model;
- green check marks without proof traces;
- world posterior without SNO lineage;
- dashboard elements that make hypothesis text look strict.
