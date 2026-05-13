# 17 — Model Cards and Calibration Plan

## Models used

GCTS can use several model types:

1. Embedding model.
2. Retrieval model.
3. LLM extractor.
4. NLI/entailment verifier.
5. Access-state classifier.
6. Institutional-incentive feature model.
7. Optional LoRA extraction adapter.
8. Calibration model.

Each model requires a model card.

## Model card fields

```yaml
model_id: ""
role: "embedding | retrieval | extraction | entailment | access | incentive | rendering | calibration"
provider: ""
version: ""
training_data_known: false
intended_use: ""
forbidden_use: ""
runtime_truth_authority: false
calibration_dataset: ""
known_failure_modes: []
evaluation_metrics: {}
last_evaluated: ""
```

## Calibration workflow

1. Split labels into train/calibration/test.
2. Split planted access states into train/calibration/test for synthetic access tasks.
3. Fit score calibration on calibration split only.
4. Evaluate ECE/Brier on test split.
5. Evaluate access-state F1 and calibration.
6. Store calibration parameters in run manifest.
7. Freeze calibrator for benchmark runs.

## Reliability gates

A model cannot enter production if:

- it can access labels at runtime;
- it cannot emit confidence scores or score inputs;
- it increases unsupported strict promoted claims;
- it overuses suppression hypotheses on benign missingness tests;
- it lacks versioned model card;
- it has not been evaluated on adversarial negation and missing-record tests.

## Extraction adapter acceptance

A fine-tuned adapter must improve at least two of:

- citation validity;
- entailment;
- schema compliance;
- extraction recall;
- access-state classification;
- downstream calibration.

It must not degrade ZTHR, access calibration, or rendering faithfulness.
