# CNS 7.0 / GCTS: Grounded Chiral Tensor Synthesis

**Date:** 2026-05-10  
**Deliverable:** research proposal docset, implementation plan, test plan, and Python sketches  
**Status:** Buildable research proposal, not a completed implementation.

## What this is

This package proposes the next version of Chiral Narrative Synthesis as **Grounded Chiral Tensor Synthesis (GCTS)**: a testable system for ranking possible truth states under limited information, resolving contradictory narratives through evidence-grounded tensor logic, and producing multi-world / “multiverse” views instead of unsupported single-answer synthesis.

The core move is:

> CNS should not ask an LLM to decide which narrative is true. CNS should build a distribution over proof-carrying possible worlds, quantify the curvature/mismatch between language and logic, and emit ranked, confidence-calibrated hypotheses with explicit evidence and uncertainty.

## Design commitments

1. **No runtime oracle.** The system may use labeled data or expert feedback for training, calibration, and evaluation, but the undersupervised runtime must work from available evidence, rules, source reliability, and model-calibrated uncertainty.
2. **LLMs are candidate generators and renderers, not truth engines.** Truth rankings are produced by evidence closure, proof traces, contradiction residuals, and posterior world scoring.
3. **Multiverse views are first-class.** The output is a ranked set of possible worlds/hypothesis states, not a single premature synthesis.
4. **Chirality is measurable.** It is the mismatch/curvature induced by language→logic→language round trips, evidence-weighted graph opposition, and residual contradiction tensors.
5. **Every claim gets a status.** `proven`, `probable`, `plausible`, `conflicted`, `unsupported`, or `rejected`.

## Table of contents

### Core documents

1. [Executive Summary](docs/00_executive_summary.md)
2. [Research Proposal](docs/01_research_proposal.md)
3. [Theory: Grounded Chiral Tensor Synthesis](docs/02_theory_grounded_chiral_tensor_synthesis.md)
4. [Prior Art and Novelty](docs/03_prior_art_and_novelty.md)
5. [System Architecture](docs/04_system_architecture.md)
6. [Multi-Agent Orchestration Plan](docs/05_agent_orchestration_plan.md)
7. [LLM Strategy and Fine-Tuning Plan](docs/06_llm_strategy_and_finetuning.md)
8. [Experiment and Test Plan](docs/07_experiment_and_test_plan.md)
9. [Data, Metrics, and Evaluation](docs/08_data_eval_and_metrics.md)
10. [Implementation Roadmap](docs/09_implementation_roadmap.md)
11. [Risks, Governance, and Oracle Boundary](docs/10_risk_governance_oracle_boundary.md)
12. [API, Schemas, and Intermediate Representations](docs/11_api_schemas_and_ir.md)
13. [Publication and Research Program Plan](docs/12_publication_plan.md)
14. [Glossary](docs/13_glossary.md)
15. [Detailed MVP Build Specification](docs/14_detailed_mvp_build_spec.md)
16. [Chiral Resolution Algorithm](docs/15_chiral_resolution_algorithm.md)
17. [Multiverse View UI Specification](docs/16_multiverse_view_ui.md)
18. [Model Cards and Calibration Plan](docs/17_model_cards_and_calibration.md)


### References

- [Annotated Bibliography](references/annotated_bibliography.md)
- [BibTeX](references/references.bib)
- [Source Map](references/source_map.md)

### Experiment specifications

- [EXP-001 Synthetic latent-context resolution](experiments/EXP_001_synthetic_latent_context.md)
- [EXP-002 SciFact/FEVER oracle-less grounding](experiments/EXP_002_scifact_fever_oracleless.md)
- [EXP-003 Multiverse calibration](experiments/EXP_003_multiverse_calibration.md)
- [EXP-004 Runtime oracle boundary ablation](experiments/EXP_004_oracle_boundary_ablation.md)
- [EXP-005 Chirality predictiveness](experiments/EXP_005_chirality_predictiveness.md)

### Sketch code

- [Sketch README](sketches/README.md)
- `sketches/cns_types.py`
- `sketches/chirality.py`
- `sketches/worlds.py`
- `sketches/tensor_logic.py`
- `sketches/synthetic_latent_context_experiment.py`

### Configs and tests

- [Pipeline YAML](configs/cns_gcts_pipeline.yaml)
- [Testing Strategy](tests/testing_strategy.md)
- [Property Test Plan](tests/property_test_plan.md)

## Suggested reading order

Read documents 00 → 03 first, then 04 → 09 for implementation, and 07/08 for experiments. The Python files are sketches only; they show the formal objects and executable direction without attempting a full build.
