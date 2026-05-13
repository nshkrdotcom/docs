# 14 — Detailed MVP Build Specification

## Objective

Build a working GCTS MVP that can process a small evidence corpus, produce candidate claims, verify grounding, model record access, create possible worlds, rank likely truth, and render a report without using runtime labels.

## MVP feature list

### Must have

- Evidence atom ingestion.
- Stable evidence IDs and span references.
- Candidate claim extraction.
- Citation resolution hard gate.
- Entailment scoring.
- Record-access state schema and classifier.
- Absence/evidence-of-absence distinction.
- Strict proof trace for strict promoted claims.
- Candidate world construction.
- Posterior normalization over worlds.
- Claim posterior, strict support mass, and confidence output.
- Top-K world report.
- Runtime oracle boundary check.

### Should have

- Graph chirality.
- Access chirality.
- Residual tensor energy.
- Synthetic latent context recovery.
- Synthetic adversarial-record experiment.
- Calibration metrics.
- Dashboard or notebook view.

### Could have

- Round-trip LLM rendering chirality.
- LoRA extraction adapter.
- Learned source reliability.
- Learned access-state classifier.
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

### Task 2 — Record access store

Implement:

```python
class RecordAccessStore:
    def add_record_state(record: RecordAccessState) -> None
    def get(record_id: str) -> RecordAccessState | None
    def expected_missing_records() -> list[RecordAccessState]
```

Acceptance tests:

- access states are valid enum values;
- generation duty and expected observability are bounded in `[0,1]`;
- missing expected records are separable from records not expected to exist.

### Task 3 — Claim extraction adapter

Implement a pluggable extractor interface:

```python
class ClaimExtractor:
    def extract(evidence_packet: list[EvidenceAtom]) -> list[Claim]
```

Backends:

1. deterministic toy extractor for tests;
2. LLM extraction prompt;
3. optional fine-tuned adapter.

### Task 4 — Grounding verification

Implement:

- citation validity;
- NLI scoring;
- claim narrowing warning;
- neutral/contradiction scores;
- fail-closed strict status assignment.

Acceptance:

- invalid citation forces unsupported for strict promotion;
- low entailment prevents strict promotion;
- contradiction score above threshold marks conflicted or rejected.

### Task 5 — Access verification

Implement:

- record-generation duty scoring;
- expected observability scoring;
- access-state classification;
- absent evidence vs evidence of absence rules;
- access uncertainty scoring.

Acceptance:

- absence cannot refute a claim without expected record and reliable access path;
- affirmative non-supportive records can refute claims;
- inaccessible records create record-contingency rather than automatic rejection.

### Task 6 — Rule compiler

Start with 12 rules:

1. direct support promotion;
2. direct refutation rejection;
3. support transitivity;
4. refutation propagation;
5. qualifier preservation;
6. narrower-than evidence warning;
7. source reliability downgrade;
8. contradiction conflict marker;
9. expected-record missingness marker;
10. evidence-of-absence marker;
11. record-contingency marker;
12. soft suppression-hypothesis marker.

Each rule has a proof template and policy tag.

### Task 7 — World builder

Generate worlds by choosing compatible subsets of grounded claims, assumptions, latent contexts, and access hypotheses. MVP beam search:

1. start from empty world;
2. add grounded claims greedily by support score;
3. branch on conflicts;
4. branch on access-state explanations for missing expected records;
5. add latent context splits when residual conflict persists;
6. prune by energy.

### Task 8 — World ranker

Implement energy:

```text
E = 2.0*grounding_loss
  + 2.0*contradiction_energy
  + 1.0*rule_loss
  + 0.5*parsimony
  + 1.5*access_loss
  + 0.8*incentive_loss
  - 2.0*support
```

Normalize by softmax over negative energy.

### Task 9 — Report renderer

Implement a deterministic renderer before LLM renderer:

- top worlds;
- claim table;
- posterior, strict support, and confidence;
- evidence IDs;
- record dependencies;
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
- Every record-contingent claim identifies record dependencies.

## MVP deliverable checklist

- [ ] `EvidenceStore` implemented.
- [ ] `RecordAccessStore` implemented.
- [ ] `ClaimExtractor` toy + LLM backends.
- [ ] `GroundingVerifier` implemented.
- [ ] `AccessVerifier` implemented.
- [ ] `RuleCompiler` implemented.
- [ ] `TinyTensorLogic` upgraded from sketch to testable module.
- [ ] `WorldBuilder` beam search implemented.
- [ ] `WorldRanker` implemented.
- [ ] `SynthesisReport` deterministic renderer.
- [ ] Synthetic latent-context experiment automated.
- [ ] Synthetic adversarial-record experiment automated.
- [ ] SciFact/FEVER loader integrated.
- [ ] Oracle boundary unit tests pass.
