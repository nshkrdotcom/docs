# 08 — Data, Metrics, and Evaluation

## Datasets

### Synthetic latent-context dataset

Generate controlled contradictions with known latent resolutions.

Example:

- Evidence A: “Drug X reduced symptom Y in adults over 65.”
- Evidence B: “Drug X did not reduce symptom Y in adults under 40.”
- Naive conflict: Drug X works vs does not work.
- Correct resolution: subgroup predicate `AgeGroup`.

### Synthetic adversarial-record dataset

Generate scenarios where truth depends on record-access structure.

Example:

- Claim: “System S generated alert A before event E.”
- Expected record: alert log.
- Access states: produced, inaccessible, withheld, destroyed, never generated, or produced and refuting.
- Gold resolution: distinguish claim likelihood from access uncertainty and record-production status.

### SciFact

Scientific claim verification with evidence abstracts and rationales. Use labels only for evaluation/calibration, not runtime inference.

### FEVER

General textual fact verification with supported/refuted/not-enough-info labels. Good for claim status classification and evidence retrieval stress tests.

### Domain-specific future datasets

- legal argument snippets with citations;
- intelligence-style synthetic scenarios;
- biomedical multi-paper contradictions;
- news event timeline conflicts;
- institutional record-access and disclosure scenarios.

## Metrics

### Grounding metrics

- **Citation validity:** proportion of references that resolve.
- **Evidence coverage:** proportion of promoted claims with at least one evidence atom or explicit record-contingency state.
- **Entailment score:** calibrated NLI support probability.
- **Zero-temperature hallucination rate (ZTHR):** promoted strict claims without proof trace. Target: 0.

### Access metrics

- **Access-state accuracy/F1:** classification of available, inaccessible, sealed, withheld, destroyed, not-generated, unknown.
- **Record-duty calibration:** calibration of whether a record should be expected to exist.
- **Evidence-of-absence precision:** precision when system treats non-supportive records as refuting.
- **False absence penalty rate:** rate at which absence of evidence is incorrectly penalized as evidence of absence.
- **Suppression hypothesis precision:** proportion of high-suppression-probability cases that match planted or adjudicated strategic non-production.

### World metrics

- **Top-K world coverage:** whether gold state is represented in top K.
- **World posterior ECE:** calibration over worlds.
- **World entropy:** uncertainty over alternatives.
- **Assumption load:** number/weight of assumptions required by world.
- **Access-coherence loss:** mismatch between world claims and expected record states.

### Claim metrics

- **Likely-truth Brier score:** calibrated quality of claim probability.
- **ECE:** expected calibration error.
- **Strict support mass:** posterior mass of worlds where the claim is in zero-temperature closure.
- **Abstention precision:** whether abstained cases are truly unsupported, ambiguous, or access-contingent.
- **Status accuracy:** proven/probable/plausible/record_contingent/conflicted/unsupported/rejected.

### Chiral metrics

- **Round-trip chirality:** distance between logic/access state and re-grounded rendered state.
- **Graph chirality:** evidence-weighted incidence mismatch.
- **Residual energy:** unresolved support/refute tensor mass.
- **Access chirality:** mismatch between narrative missingness and structured record-access state.
- **Chirality predictiveness:** correlation with difficulty and error.

### Synthesis metrics

- **Evidence preservation:** preserved support/refute evidence in report.
- **Conflict transparency:** report identifies major unresolved alternatives.
- **Access transparency:** report identifies record-contingent claims and missing decisive records.
- **Latent context utility:** residual reduction per added predicate complexity.
- **Human auditability:** proportion of claims with readable proof/evidence/access path.

## Estimative outputs

Each final claim emits:

```json
{
  "claim": "...",
  "posterior": 0.73,
  "strict_support": 0.31,
  "confidence": 0.61,
  "estimative_language": "likely",
  "status": "probable",
  "world_support": ["W1", "W3"],
  "world_conflict": ["W2"],
  "evidence": ["E12", "E19"],
  "record_dependencies": ["R7"],
  "proof_traces": ["P44"],
  "uncertainty": {
    "aleatory": 0.22,
    "epistemic": 0.18,
    "access": 0.14,
    "suppression": 0.08,
    "source": 0.11,
    "model": 0.09
  }
}
```

## Evaluation protocol

1. Freeze corpus, retrieval index, and access-state metadata.
2. Hide labels from runtime pipeline.
3. Run baselines and GCTS on identical inputs.
4. Compute metrics against labels and planted states only after outputs are written.
5. Perform calibration analysis.
6. Run ablations.
7. Produce error taxonomy.

## Error taxonomy

- invalid reference;
- evidence mismatch;
- claim too broad for evidence;
- latent context missing;
- latent context spurious;
- access state misclassified;
- absence of evidence treated as evidence of absence;
- suppression hypothesis overfit;
- rule overreach;
- source reliability misestimated;
- extraction schema failure;
- rendering introduced unsupported phrase;
- posterior miscalibration.
