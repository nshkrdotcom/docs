# 08 — Data, Metrics, and Evaluation

## Datasets

### Synthetic latent-context dataset

Generate controlled contradictions with known latent resolutions.

Example:

- Evidence A: “Drug X reduced symptom Y in adults over 65.”
- Evidence B: “Drug X did not reduce symptom Y in adults under 40.”
- Naive conflict: Drug X works vs does not work.
- Correct resolution: subgroup predicate `AgeGroup`.

### SciFact

Scientific claim verification with evidence abstracts and rationales. Use labels only for evaluation/calibration, not runtime inference.

### FEVER

General textual fact verification with supported/refuted/not-enough-info labels. Good for claim status classification and evidence retrieval stress tests.

### Domain-specific future datasets

- legal argument snippets with citations;
- intelligence-style synthetic scenarios;
- biomedical multi-paper contradictions;
- news event timeline conflicts.

## Metrics

### Grounding metrics

- **Citation validity:** proportion of references that resolve.
- **Evidence coverage:** proportion of promoted claims with at least one evidence atom.
- **Entailment score:** calibrated NLI support probability.
- **Zero-temperature hallucination rate (ZTHR):** promoted strict claims without proof trace. Target: 0.

### World metrics

- **Top-K world coverage:** whether gold state is represented in top K.
- **World posterior ECE:** calibration over worlds.
- **World entropy:** uncertainty over alternatives.
- **Assumption load:** number/weight of assumptions required by world.

### Claim metrics

- **Brier score:** calibrated probability quality.
- **ECE:** expected calibration error.
- **Abstention precision:** whether abstained cases are truly unsupported/ambiguous.
- **Status accuracy:** proven/probable/plausible/conflicted/unsupported/rejected.

### Chiral metrics

- **Round-trip chirality:** distance between logic state and re-grounded rendered state.
- **Graph chirality:** evidence-weighted incidence mismatch.
- **Residual energy:** unresolved support/refute tensor mass.
- **Chirality predictiveness:** correlation with difficulty and error.

### Synthesis metrics

- **Evidence preservation:** preserved support/refute evidence in report.
- **Conflict transparency:** report identifies major unresolved alternatives.
- **Latent context utility:** residual reduction per added predicate complexity.
- **Human auditability:** proportion of claims with readable proof/evidence path.

## Estimative outputs

Each final claim emits:

```json
{
  "claim": "...",
  "posterior": 0.73,
  "confidence": 0.61,
  "estimative_language": "likely",
  "status": "probable",
  "world_support": ["W1", "W3"],
  "world_conflict": ["W2"],
  "evidence": ["E12", "E19"],
  "proof_traces": ["P44"],
  "uncertainty": {
    "aleatory": 0.22,
    "epistemic": 0.18,
    "source": 0.11,
    "model": 0.09
  }
}
```

## Evaluation protocol

1. Freeze corpus and retrieval index.
2. Hide labels from runtime pipeline.
3. Run baselines and GCTS on identical inputs.
4. Compute metrics against labels only after outputs are written.
5. Perform calibration analysis.
6. Run ablations.
7. Produce error taxonomy.

## Error taxonomy

- invalid reference;
- evidence mismatch;
- claim too broad for evidence;
- latent context missing;
- latent context spurious;
- rule overreach;
- source reliability misestimated;
- extraction schema failure;
- rendering introduced unsupported phrase;
- posterior miscalibration.
