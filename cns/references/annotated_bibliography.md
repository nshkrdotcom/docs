# Annotated Bibliography

This bibliography supports the CNS 7.0 / Grounded Chiral Tensor Synthesis (GCTS) proposal. It is organized by what each source contributes to the buildable theory.

## Evidence-grounded generation and verification

- **RAG (Lewis et al., 2020)** — Establishes the modern retrieval-plus-generation baseline. GCTS differs by not treating retrieved passages as sufficient context; it requires evidence atoms, proof traces, and world-ranked alternatives before a synthesis can be promoted.
- **FEVER (Thorne et al., 2018)** — Supplies a large benchmark for claim verification against textual sources with supported/refuted/not-enough-info labels. GCTS uses FEVER-style labels for evaluation and calibration, not as a runtime oracle.
- **SciFact (Wadden et al., 2020)** — Supplies a scientific claim verification benchmark with evidence rationales. It is the preferred MVP dataset for testing grounding, citation validity, and entailment.

## Argumentation and debate

- **Dung (1995)** — Formalizes abstract argumentation as arguments plus attack relations. GCTS preserves this graph-theoretic lineage but adds evidence-weighted chirality, possible worlds, and proof-carrying tensor closure.
- **Mochales and Moens (2011); Lippi and Torroni (2016); Wachsmuth et al. (2017)** — Establish argument mining and argument retrieval. GCTS depends on claim/relation extraction, but the novelty lies in synthesis under uncertainty rather than extraction alone.
- **Multiagent Debate (Du et al., 2023), Tree of Thoughts (Yao et al., 2023), Self-consistency (Wang et al., 2022)** — Useful baselines for multi-path reasoning. GCTS differs because consensus is not the criterion; proof-carrying evidence closure and calibrated uncertainty are.

## Tensor logic and neuro-symbolic inference

- **Tensor Logic (Domingos, 2025/2026)** — Provides the closest prior-art foundation for tensor equations as a unifying language for symbolic, neural, and statistical AI. GCTS adopts the temperature idea but applies it to narrative conflict, multiverse views, and oracle-boundary enforcement.
- **TensorLog (Cohen, 2016; Cohen et al., 2020)** — Demonstrates differentiable logical inference. GCTS uses similar differentiable proof machinery, but with evidence-ranked narrative worlds.
- **Logic Tensor Networks (Serafini and Garcez, 2016; Badreddine et al., 2022)** and **Probabilistic Soft Logic (Bach et al., 2017)** — Important neuro-symbolic baselines for continuous logic and structured uncertainty.

## Geometry, topology, and consistency

- **Sheaf Neural Networks (Hansen and Gebhart, 2020)** — Shows how sheaf Laplacians model asymmetric/signed relations on graphs. GCTS uses sheaf-like language-logic gluing as a theory of chirality.
- **Persistent Homology Roadmap (Otter et al., 2015)** — Supports the topological diagnostics used for cycle and stability analysis.

## Intelligence-analysis uncertainty

- **ICD 203 (ODNI, 2015)** — Requires rigor and analytic standards for intelligence products. GCTS operationalizes this by carrying probability, source quality, alternatives, and confidence.
- **Sherman Kent (1964)** — Foundational work on words of estimative probability. GCTS maps numeric posterior intervals to estimative language.
- **Heuer (1999) and CIA Tradecraft Primer (2009)** — ACH and structured analytic techniques motivate the “multiverse view”: maintain competing hypotheses and test evidence against each rather than prematurely collapsing to one answer.

## Model adaptation

- **LoRA (Hu et al., 2021)** — Preferred adaptation technique for claim extraction and schema fidelity because it freezes a base model and trains low-rank adapters. GCTS treats fine-tuning as optional and bounded: extraction and calibration may be fine-tuned, but runtime truth ranking must remain evidence/proof-based.
