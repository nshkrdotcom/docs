# 14 — Detailed MVP Build Specification

## Objective

Build a working GCTS MVP that can process a small evidence corpus, produce candidate claims, verify grounding, create possible worlds, rank claims, and render a report without using runtime labels.

## MVP feature list

### Must have

- Evidence atom ingestion.
- Stable evidence IDs and span references.
- Candidate claim extraction.
- Citation resolution hard gate.
- Entailment scoring.
- Strict proof trace for promoted claims.
- Candidate world construction.
- Posterior normalization over worlds.
- Claim posterior and confidence output.
- Top-K world report.
- Runtime oracle boundary check.

### Should have

- Graph chirality.
- Residual tensor energy.
- Synthetic latent context recovery.
- Calibration metrics.
- Dashboard or notebook view.

### Could have

- Round-trip LLM rendering chirality.
- LoRA extraction adapter.
- Learned source reliability.
- Distributed agent runtime.

## Core implementation tasks

### Task 1 — Evidence store

Implement:

```python
class EvidenceStore:
    def add_document(doc_id: str, text: str, metadata: dict) -> list[EvidenceAtom]
    def get(evidence_id: str) -> EvidenceAtom | None
    def resolve_many(ids: list[str]) -> list[EvidenceAtom]
```

Acceptance tests:

- every atom has unique ID;
- missing IDs return `None`;
- retrieved spans match source text.

### Task 2 — Claim extraction adapter

Implement a pluggable extractor interface:

```python
class ClaimExtractor:
    def extract(evidence_packet: list[EvidenceAtom]) -> list[Claim]
```

Backends:

1. deterministic toy extractor for tests;
2. LLM extraction prompt;
3. optional fine-tuned adapter.

### Task 3 — Grounding verification

Implement:

- citation validity;
- NLI scoring;
- claim narrowing warning;
- neutral/contradiction scores;
- fail-closed status assignment.

Acceptance:

- invalid citation forces unsupported;
- low entailment forces unsupported or plausible only;
- contradiction score above threshold marks conflicted.

### Task 4 — Rule compiler

Start with 8 strict rules:

1. direct support promotion;
2. direct refutation rejection;
3. support transitivity;
4. refutation propagation;
5. qualifier preservation;
6. narrower-than evidence warning;
7. source reliability downgrade;
8. contradiction conflict marker.

Each rule has a proof template and policy tag.

### Task 5 — World builder

Generate worlds by choosing compatible subsets of grounded claims and assumptions. MVP beam search:

1. start from empty world;
2. add grounded claims greedily by support score;
3. branch on conflicts;
4. add latent context splits when residual conflict persists;
5. prune by energy.

### Task 6 — World ranker

Implement energy:

```text
E = 2.0*grounding_loss + 2.0*contradiction_energy + rule_loss + 0.5*parsimony - 2.0*support
```

Normalize by softmax over negative energy.

### Task 7 — Report renderer

Implement a deterministic renderer before LLM renderer:

- top worlds;
- claim table;
- evidence IDs;
- confidence bands;
- unknowns;
- next evidence needed.

LLM rendering comes later and must be post-verified.

## MVP architecture constraints

- Never pass benchmark labels into runtime objects.
- Every artifact file includes a manifest.
- Every generated report references a run ID.
- Every world posterior can be recomputed from stored energies.
- Every strict claim can be traced to evidence.

## MVP deliverable checklist

- [ ] `EvidenceStore` implemented.
- [ ] `ClaimExtractor` toy + LLM backends.
- [ ] `GroundingVerifier` implemented.
- [ ] `RuleCompiler` implemented.
- [ ] `TinyTensorLogic` upgraded from sketch to testable module.
- [ ] `WorldBuilder` beam search implemented.
- [ ] `WorldRanker` implemented.
- [ ] `SynthesisReport` deterministic renderer.
- [ ] Synthetic experiment automated.
- [ ] SciFact/FEVER loader integrated.
- [ ] Oracle boundary unit tests pass.
