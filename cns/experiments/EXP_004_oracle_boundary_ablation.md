# EXP-004 — Runtime Oracle Boundary Ablation

## Purpose

Prove that oracle usage is training/evaluation-only and measure its effect.

## Conditions

1. **No oracle:** no labels for training or runtime; uses heuristics and pretrained validators.
2. **Calibration oracle:** labels used offline for calibration and model selection.
3. **Illegal runtime oracle:** labels exposed during inference; treated only as upper bound.

## Rules

Condition 3 must never be used as a deployable result.

## Metrics

- calibration improvement;
- claim accuracy;
- abstention precision;
- world coverage;
- audit integrity.

## Expected result

Calibration oracle should improve probability quality over no-oracle while preserving runtime independence. Runtime oracle should score highest but is invalid as a deployment mode.
