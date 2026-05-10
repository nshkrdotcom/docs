# 17 — Model Cards and Calibration Plan

## Models used

GCTS can use several model types:

1. Embedding model.
2. Retrieval model.
3. LLM extractor.
4. NLI/entailment verifier.
5. Optional LoRA extraction adapter.
6. Calibration model.

Each model requires a model card.

## Model card fields

```yaml
model_id: ""
role: "embedding | retrieval | extraction | entailment | rendering | calibration"
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
2. Fit score calibration on calibration split only.
3. Evaluate ECE/Brier on test split.
4. Store calibration parameters in run manifest.
5. Freeze calibrator for benchmark runs.

## Reliability gates

A model cannot enter production if:

- it can access labels at runtime;
- it cannot emit confidence scores or score inputs;
- it increases unsupported promoted claims;
- it lacks versioned model card;
- it has not been evaluated on adversarial negation tests.

## Extraction adapter acceptance

A fine-tuned adapter must improve at least two of:

- citation validity;
- entailment;
- schema compliance;
- extraction recall;
- downstream calibration.

It must not degrade ZTHR or increase rendering drift.
