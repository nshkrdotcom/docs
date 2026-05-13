# 09 — Implementation Roadmap

## Phase 0 — Project setup (Week 0)

Deliverables:

- repository layout;
- schemas;
- test harness;
- dataset manifests;
- baseline configs.

Exit criteria:

- CI runs schema/unit tests;
- synthetic dataset generator works;
- references resolve locally.

## Phase 1 — Oracle-less grounding MVP (Weeks 1–3)

Build:

- evidence atom store;
- claim extraction with LLM prompt;
- citation validator;
- NLI grounding report;
- claim status assignment.

Exit criteria:

- 100% invalid citations caught on tests;
- no strict promoted claim without evidence;
- basic SciFact/FEVER pipeline runs.

## Phase 2 — Access-state and missingness MVP (Weeks 4–5)

Build:

- record-access schema;
- expected-record classifier;
- access-state classifier;
- absence/evidence-of-absence decision rules;
- source-control and incentive metadata.

Exit criteria:

- access-state golden tests pass;
- absence of evidence is never treated as evidence of absence without record-duty support;
- record-contingent claims are represented separately from unsupported claims.

## Phase 3 — Tensor closure and proof traces (Weeks 6–8)

Build:

- small monotone tensor-rule engine;
- proof trace recorder;
- strict/soft/access rule policy;
- zero-temperature closure.

Exit criteria:

- proof traces emitted for all strict claims;
- strict rules cannot promote unsupported claims;
- soft/access rules cannot promote strict claims;
- unit and property tests pass.

## Phase 4 — Multiverse world builder (Weeks 9–11)

Build:

- candidate world enumeration;
- energy scoring;
- posterior normalization;
- claim likely-truth ranking;
- strict support mass;
- entropy/confidence outputs.

Exit criteria:

- top-K worlds produced for synthetic cases;
- calibration pipeline reports Brier/ECE;
- reports render ranked alternatives.

## Phase 5 — Chirality, latent context, and access residuals (Weeks 12–14)

Build:

- round-trip chirality;
- graph chiral tensor;
- residual tensor;
- access chirality;
- basic NMF/Tucker-style latent context and access-state proposer;
- residual reduction metrics.

Exit criteria:

- chirality predictiveness experiment runs;
- synthetic latent context recovery tested;
- adversarial record-suppression experiment runs;
- top-3 world coverage target evaluated.

## Phase 6 — Fine-tuning decision (Weeks 15–18)

If extraction or access classification remains bottleneck:

- prepare LoRA training data;
- train claim extraction adapter;
- train relation extraction adapter;
- train access-state adapter;
- evaluate against non-fine-tuned pipeline.

Go/no-go:

- fine-tuning must improve grounding, access classification, and calibration, not only fluency.

## Phase 7 — Research paper and demo (Weeks 19–22)

Deliverables:

- full evaluation report;
- ablation tables;
- proof trace demos;
- record-access demos;
- interactive multiverse view;
- paper draft.

## Repository layout

```text
cns-gcts/
  cns_gcts/
    schemas.py
    ingest.py
    extract.py
    verify.py
    access.py
    tensor_logic.py
    worlds.py
    chirality.py
    synthesize.py
    reports.py
  configs/
  data/
  experiments/
  tests/
  notebooks/
  docs/
```

## Engineering principles

- test before training;
- validate before synthesis;
- proof before strict promotion;
- likelihood before prose;
- confidence before conclusion;
- abstain before hallucinate;
- labels for calibration, never runtime truth.
