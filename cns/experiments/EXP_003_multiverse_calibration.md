# EXP-003 — Multiverse Calibration

## Purpose

Test whether world distributions are calibrated and whether top-K worlds improve uncertainty handling.

## Procedure

1. Generate possible worlds for each example.
2. Compute posterior mass using energy scoring.
3. Evaluate whether gold label/world appears in top-K.
4. Measure calibration of claim-level posterior.

## Metrics

- top-1/top-3/top-5 world coverage;
- ECE;
- Brier score;
- entropy-error correlation;
- confidence interval coverage.

## Success threshold

- ECE ≤ 0.10 after calibration;
- top-3 coverage ≥ 85% on synthetic tasks;
- entropy should positively correlate with error.
