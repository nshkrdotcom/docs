# 19 — Runtime Oracle Boundary Policy

## Policy

CNS 8.0 may train with oracles. CNS 8.0 must not run with hidden oracles.

## Allowed offline oracle use

- labels in SciFact, FEVER, and synthetic tasks;
- expert annotations;
- calibration labels;
- human review labels;
- synthetic hidden context labels for evaluation;
- gold rationales for training extraction.

## Forbidden runtime oracle use

- answer keys;
- gold labels in prompts;
- synthetic generation parameters;
- LLM judge as final truth oracle;
- access to withheld test rationales;
- hidden evaluator calls inside runtime;
- prompting that asks a model to choose the correct label using unseen gold data.

## Required metadata

Every run manifest records:

- dataset split hash;
- label availability;
- prompt templates;
- model IDs;
- proof rule version;
- calibration model version;
- oracle-use declaration;
- leakage scan result.

## Leakage checks

- scan prompts for label fields;
- verify runtime input schema excludes gold labels;
- run random-label controls;
- run shuffled-evidence controls;
- isolate synthetic generator seeds;
- withhold latent context variables during inference.

## Output language

CNS must not present likely claims as strict claims.

Allowed:

```text
Strict: follows from proof trace.
Likely: posterior-supported but not strict.
Hypothesis: generated for testing.
Unresolved: evidence/access insufficient.
Rejected: failed gate.
```

## Human review

Human experts may review outputs. Their judgments are post-runtime annotations unless explicitly used in a retraining/calibration step.
