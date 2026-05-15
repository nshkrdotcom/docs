# 01 — CNS 8.0 Research Proposal

## Title

**Chiral Narrative Synthesis 8.0: Grounded Dialectical Orthesis through Chiral Tension, Evidential Entanglement, Tensor Logic, and Predicate Invention**

## Abstract

Chiral Narrative Synthesis 8.0 (CNS 8.0) is a buildable research program for synthesizing grounded narrative objects under contradiction and incomplete information. The system operates over **Structured Narrative Objects** (SNOs), not loose claims. It identifies productive conflicts by combining **chirality** with **Evidential Entanglement**, stress-tests them through an Antagonist and critic ensemble, grounds all promoted claims through tensor-logic proof traces, uses residual contradictions to propose latent predicates, and emits a synthesized SNO called an **orthesis candidate** when the synthesis survives repeated grounding and rendering.

CNS 8.0 is not a fact-verification wrapper and not a possible-world ranker. Fact verification, access states, possible worlds, calibration, and audit reporting are used as constraints on narrative synthesis. The central operation remains **grounded dialectical synthesis**: constructing a new narrative object from structured disagreement while preserving provenance, residual uncertainty, and unresolved contradiction.

## Core hypothesis

Conflicting accounts become productive when they have both:

1. high **chiral tension** — structured asymmetry or non-commuting language–logic round-trip distortion; and
2. high **Evidential Entanglement** — substantial overlap in the evidence base they interpret differently.

CNS 8.0 predicts that high-chirality / high-entanglement pairs are better synthesis targets than pairs selected by embedding distance, debate disagreement, RAG retrieval score, or claim-level contradiction alone.

## Research questions

### RQ1 — Productive conflict selection

Can a combined chirality–entanglement score identify pairs of narrative objects that yield useful synthesis better than embedding-distance or contradiction-only baselines?

### RQ2 — Orthesis convergence

Can repeated grounding and synthesis produce stable SNOs whose proof traces, evidence coverage, and topology diagnostics improve over iterations?

### RQ3 — Predicate invention

When contradictions persist under zero-temperature proof closure, can residual-tensor decomposition recover latent context variables such as time, subgroup, measurement method, source frame, jurisdiction, mechanism, or definition boundary?

### RQ4 — Runtime oracle discipline

Can the system train with labels and expert oracles while running without runtime gold labels, answer keys, or LLM truth votes?

### RQ5 — Multiverse-aware output

Can possible-world ranking and record-access states improve uncertainty reporting without replacing the synthesis operation?

## Contributions

1. **SNO-8:** a typed, proof-carrying Structured Narrative Object that keeps narrative identity, reasoning graph, evidence, access state, proof trace, residual contradictions, and synthesis lineage in one object.
2. **CNS Productive Conflict Score:** a pair-selection metric combining chiral tension and evidential entanglement.
3. **Grounded Dialectical Orthesis:** a synthesis loop that emits an orthesis candidate only after surviving grounding, antagonist pressure, proof closure, and residual analysis.
4. **Contradiction-Driven Predicate Invention:** tensor decomposition over residual contradiction mass to propose latent context predicates.
5. **Strict Runtime Oracle Boundary:** offline oracle use for training/calibration/evaluation, with no runtime label leakage.
6. **Buildable MVP:** a staged implementation plan using retrieval, extraction, NLI, graph topology, tensor closure, residual decomposition, and bounded LLM rendering.
7. **Evaluation Suite:** synthetic latent-context tests, SciFact/FEVER grounding tests, SNO-pair synthesis tests, and ablations.

## Scope

CNS 8.0 is a research and engineering plan. The Python files in `sketches/` are not production code; they are scaffolds for implementation and test design.

## System-level pipeline

```text
source corpus
→ evidence atomization
→ Proposer builds candidate SNOs
→ grounding critics validate citations and entailment
→ Antagonist finds chiral tension, contradictions, topology issues, access gaps
→ pair selector ranks high-chirality/high-entanglement SNO pairs
→ tensor prover computes zero-temperature closure
→ residual analyzer identifies unresolved contradiction mass
→ predicate inventor proposes latent context predicates when needed
→ Synthesizer constructs a new grounded SNO
→ orthesis loop tests G(S(T)) stability
→ multiverse/access layer ranks remaining interpretations
→ audit report exposes proof traces, uncertainties, and residual contradictions
```

## What is deliberately not central

- LLM debate as truth voting.
- RAG as final synthesis.
- Possible-world posterior mass as replacement for narrative synthesis.
- Evidence atoms as replacement for SNOs.
- Record-access state as replacement for contradiction analysis.
- Audit report as replacement for synthesis.

## Expected MVP result

The first CNS 8.0 MVP should demonstrate:

1. citation-valid SNO extraction on a small corpus;
2. productive-pair selection by chirality and evidential entanglement;
3. zero-temperature proof closure over at least one rule family;
4. residual tensor construction over unresolved support/refute mass;
5. latent context recovery on synthetic examples;
6. synthesized SNO output with proof traces;
7. orthesis stability diagnostics;
8. calibrated uncertainty report with explicit access states.
