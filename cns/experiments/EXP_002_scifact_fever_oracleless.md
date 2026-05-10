# EXP-002 — SciFact/FEVER Oracle-less Grounding

## Purpose

Evaluate evidence-grounded claim status under benchmark labels withheld from runtime.

## Datasets

- SciFact for scientific claim verification.
- FEVER for general fact verification.

## Runtime rules

- labels are hidden during inference;
- retrieval, evidence spans, and model scores are allowed;
- labels are used only after output for scoring/calibration.

## Baselines

- RAG-only answer;
- RAG + NLI verifier;
- LLM debate;
- self-consistency;
- argument graph only;
- GCTS full.

## Metrics

- citation validity;
- ZTHR;
- claim status accuracy;
- Brier score;
- ECE;
- abstention precision;
- evidence preservation.

## Expected result

GCTS should not necessarily maximize raw label accuracy at all costs; it should improve calibration, abstention correctness, and auditability.
