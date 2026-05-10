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
- no promoted claim without evidence;
- basic SciFact/FEVER pipeline runs.

## Phase 2 — Tensor closure and proof traces (Weeks 4–6)

Build:

- small monotone tensor-rule engine;
- proof trace recorder;
- strict/soft rule policy;
- zero-temperature closure.

Exit criteria:

- proof traces emitted for all strict claims;
- strict rules cannot promote unsupported claims;
- unit and property tests pass.

## Phase 3 — Multiverse world builder (Weeks 7–9)

Build:

- candidate world enumeration;
- energy scoring;
- posterior normalization;
- claim truth ranking;
- entropy/confidence outputs.

Exit criteria:

- top-K worlds produced for synthetic cases;
- calibration pipeline reports Brier/ECE;
- reports render ranked alternatives.

## Phase 4 — Chirality and latent context (Weeks 10–12)

Build:

- round-trip chirality;
- graph chiral tensor;
- residual tensor;
- basic NMF/Tucker-style latent context proposer;
- residual reduction metrics.

Exit criteria:

- chirality predictiveness experiment runs;
- synthetic latent context recovery tested;
- top-3 world coverage target evaluated.

## Phase 5 — Fine-tuning decision (Weeks 13–16)

If extraction remains bottleneck:

- prepare LoRA training data;
- train claim extraction adapter;
- train relation extraction adapter;
- evaluate against non-fine-tuned pipeline.

Go/no-go:

- fine-tuning must improve grounding and calibration, not only fluency.

## Phase 6 — Research paper and demo (Weeks 17–20)

Deliverables:

- full evaluation report;
- ablation tables;
- proof trace demos;
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
- proof before promotion;
- confidence before prose;
- abstain before hallucinate;
- labels for calibration, never runtime truth.
