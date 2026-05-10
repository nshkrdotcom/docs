# Appendix — Oracle Boundary Policy

## Definition

An oracle is any data source that directly reveals the correct label, hidden answer, or expert truth judgment for the specific runtime instance.

## Allowed

- training labels;
- validation labels;
- evaluation labels after inference;
- human review after system output;
- expert annotations for calibration.

## Forbidden during runtime

- label lookup;
- prompt leakage containing gold label;
- using benchmark label field in scoring;
- human adjudication before world ranking;
- LLM judge as final truth source.

## Enforcement

The runtime config must include:

```yaml
oracle_boundary:
  labels_available_at_runtime: false
  fail_if_labels_available: true
```

If a labels table is mounted, the run is marked invalid for deployment.
