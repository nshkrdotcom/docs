# CNS 7.1 / GCTS: Grounded Chiral Tensor Synthesis

**Date:** 2026-05-13  
**Deliverable:** research proposal docset, implementation plan, test plan, and Python sketches  
**Status:** Buildable research proposal, not a completed implementation.

## What this is

This package proposes Chiral Narrative Synthesis as **Grounded Chiral Tensor Synthesis (GCTS)**: a testable system for ranking likely truth states under limited, contradictory, and adversarial information; resolving conflicting narratives through evidence-grounded tensor logic; modeling record-access constraints; and producing multi-world / “multiverse” views instead of unsupported single-answer synthesis.

The core move is:

> CNS should not ask an LLM to decide which narrative is true. CNS should build a distribution over structured possible worlds, quantify the curvature/mismatch between language, logic, evidence, and access states, and emit ranked, confidence-calibrated likely-truth hypotheses with explicit evidence, record dependencies, and uncertainty.

## Design commitments

1. **Likely truth is the target.** The system ranks claims by calibrated posterior over possible worlds, not by LLM confidence and not only by strict proof.
2. **No runtime oracle.** The system may use labeled data or expert feedback for training, calibration, and evaluation, but the undersupervised runtime must work from available evidence, access states, rules, source reliability, and model-calibrated uncertainty.
3. **LLMs are candidate generators and renderers, not truth engines.** Truth rankings are produced by evidence closure, proof traces, contradiction residuals, access modeling, and posterior world scoring.
4. **Multiverse views are first-class.** The output is a ranked set of possible worlds/hypothesis states, not a single premature synthesis.
5. **Access states are first-class.** Missing, unavailable, sealed, withheld, destroyed, and not-generated records are distinct epistemic states.
6. **Chirality is measurable.** It is the mismatch/curvature induced by language→logic/access→language round trips, evidence-weighted graph opposition, access-state mismatch, and residual contradiction tensors.
7. **Every claim gets a status.** `proven`, `probable`, `plausible`, `record_contingent`, `conflicted`, `unsupported`, or `rejected`.

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
19. [Adversarial Evidence and Likely-Truth Ranking](docs/18_adversarial_evidence_and_likely_truth.md)

### Appendices

- [Experiment Report Template](appendices/experiment_report_template.md)
- [Formal Definitions Extended](appendices/formal_definitions_extended.md)
- [Proof Sketches](appendices/math_proof_sketches.md)
- [Oracle Boundary Policy](appendices/oracle_boundary_policy.md)
- [Adversarial Evidence Policy](appendices/adversarial_evidence_policy.md)

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
- [EXP-006 Adversarial record suppression](experiments/EXP_006_adversarial_record_suppression.md)

### Sketch code

- [Sketch README](sketches/README.md)
- `sketches/cns_types.py`
- `sketches/adversarial_evidence.py`
- `sketches/chirality.py`
- `sketches/worlds.py`
- `sketches/tensor_logic.py`
- `sketches/synthetic_latent_context_experiment.py`

### Configs and tests

- [Pipeline YAML](configs/cns_gcts_pipeline.yaml)
- [Testing Strategy](tests/testing_strategy.md)
- [Property Test Plan](tests/property_test_plan.md)

## Suggested reading order

Read documents 00 → 03 first, then 04 → 11 for implementation and governance, and 07/08/18 for experiments and adversarial evidence modeling. The Python files are sketches only; they show the formal objects and executable direction without attempting a full build.
