# EXP-005 — Chirality Predictiveness

## Purpose

Test whether chirality predicts synthesis difficulty and error.

## Independent variables

- round-trip chirality;
- graph chirality;
- residual tensor energy;
- embedding cosine distance;
- graph beta-1.

## Dependent variables

- convergence iterations;
- contradiction residual after synthesis;
- false synthesis rate;
- abstention correctness;
- human-rated uncertainty.

## Analysis

Fit regression models with and without chirality metrics. Chirality is useful if it adds significant predictive power beyond embedding distance and beta-1.