# 11 — Implementation Plan

## MVP objective

Build a CNS 8.0 prototype that can process a small evidence corpus, produce SNOs, identify productive contradictions, perform proof-constrained synthesis, recover simple latent predicates on synthetic tasks, and emit an audit-ready orthesis candidate.

## Phase 0 — Repository skeleton

Deliverables:

- `cns8/` Python package;
- `tests/` with deterministic toy cases;
- `configs/cns8_mvp.yaml`;
- JSON schemas;
- run manifest format.

## Phase 1 — Evidence and SNO extraction

Components:

- EvidenceStore
- EvidenceAtom
- SNO parser
- Claim/Relation extractor interface
- citation validator

Acceptance criteria:

- every evidence atom has stable ID and hash;
- missing evidence IDs fail closed;
- parser handles valid and invalid SNOs;
- citation validity measured per claim.

## Phase 2 — Grounding critics

Components:

- entailment scorer;
- source quality scorer;
- access-state validator;
- proof status assigner.

Acceptance criteria:

- strict claims require valid citation and entailment;
- invalid citation causes rejection;
- access states do not masquerade as truth values.

## Phase 3 — Chirality and entanglement

Components:

- evidence overlap;
- graph chirality;
- evidence-polarity chirality;
- round-trip language–logic residual;
- Productive Conflict Score.

Acceptance criteria:

- pair selector ranks synthetic productive conflicts above unrelated conflicts;
- high overlap/agreement is not misclassified as synthesis target;
- high contradiction/no overlap is downgraded.

## Phase 4 — Tensor proof closure

Components:

- rule registry;
- zero-temperature closure;
- proof trace recorder;
- ZTHR metric.

Acceptance criteria:

- strict claims carry proof traces;
- unsupported claims cannot be promoted;
- closure produces expected atoms on toy rules.

## Phase 5 — Residual tensor and predicate invention

Components:

- residual tensor builder;
- factorization sketch;
- latent predicate candidate generator;
- predicate grounding gate;
- PIU metric.

Acceptance criteria:

- synthetic hidden contexts recovered above baseline;
- spurious predicates rejected by grounding/complexity gates;
- residual energy decreases when correct latent predicate is accepted.

## Phase 6 — Synthesizer and orthesis loop

Components:

- structured synthesis planner;
- LLM renderer with bounded prompt;
- re-grounding loop;
- round-trip residual scorer;
- orthesis report.

Acceptance criteria:

- synthesized SNO preserves evidence provenance;
- round-trip residual decreases over iterations;
- final strict claims have proof traces;
- unresolved contradictions are reported, not hidden.

## Phase 7 — Multiverse and audit layer

Components:

- possible-world generator;
- posterior scoring;
- calibration report;
- audit renderer.

Acceptance criteria:

- worlds include access assumptions;
- posterior report does not replace synthesized SNO;
- final output separates strict, likely, hypothesis, unresolved, and rejected claims.

## Engineering stack

Recommended:

- Python for MVP proof algorithms;
- Pydantic or dataclasses for schemas;
- NetworkX for topology;
- NumPy/PyTorch for tensor operations;
- sentence-transformers or equivalent for embeddings;
- NLI model for entailment;
- optional LoRA for extraction;
- simple CLI before dashboard.

## CLI sketch

```bash
cns8 ingest corpus.jsonl --out runs/evidence.jsonl
cns8 propose runs/evidence.jsonl --out runs/snos.jsonl
cns8 critique runs/snos.jsonl --out runs/critic.jsonl
cns8 select-pairs runs/snos.jsonl --out runs/pairs.jsonl
cns8 synthesize runs/pairs.jsonl --out runs/synthesized_snos.jsonl
cns8 orthesis runs/synthesized_snos.jsonl --out runs/orthesis_report.json
cns8 report runs/orthesis_report.json --format markdown
```

## Build order warning

Do not build a dashboard first. Do not build a large multi-agent runtime first. Build the proof-bearing SNO loop first.
