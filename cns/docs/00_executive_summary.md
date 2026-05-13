# 00 — Executive Summary

## Thesis

CNS 7.1 / GCTS is a **grounded probabilistic likely-truth engine** for limited, contradictory, and adversarial information environments. It should not ask an LLM to “decide” truth by verbal confidence, and it should not collapse into a proof-only filter that treats unavailable records as epistemic silence. It should construct a **multiverse of possible structured worlds**, score those worlds against evidence, source quality, record-access conditions, institutional incentives, contradiction residuals, and parsimony, then emit calibrated likely-truth rankings with explicit uncertainty.

We call this version:

> **CNS 7.1 / GCTS — Grounded Chiral Tensor Synthesis**

## The problem

Current LLM and RAG systems can retrieve evidence and produce plausible prose, but they often fail in the cases CNS is meant to address:

- limited, contradictory, or adversarially curated evidence;
- multiple plausible hypotheses that should not be collapsed into one answer;
- evidence controlled by institutions, counterparties, platforms, agencies, employers, vendors, or other gatekeepers;
- unavailable, sealed, deleted, withheld, uncollected, or selectively disclosed records;
- absence of evidence being misread as evidence of absence;
- source incentives, role obligations, reputational exposure, and liability pressures affecting what appears in the record;
- hidden context variables such as time, population, domain, jurisdiction, mechanism, source bias, measurement frame, or access regime;
- synthesis that requires saying “this is likely,” “this is plausible but record-contingent,” “this is conflicted,” or “this would change if record R were produced.”

## Proposed solution

GCTS represents a case as:

1. **Evidence atoms** — traceable spans, observations, structured data, source quality, time, provenance, and access path.
2. **Record-access states** — whether expected records are available, inaccessible, sealed, withheld, destroyed, not generated, or unknown.
3. **Claims and relations** — structured propositions with support, contradiction, implication, qualification, or refinement relations.
4. **Institutional-incentive models** — role obligations, record-generation duties, control of evidence, motive to disclose, motive to conceal, and liability exposure.
5. **Tensor logic rules** — proof-carrying transformations over claims, evidence, access states, and admissible inference rules.
6. **World views** — possible structured truth states, each with facts, assumptions, latent contexts, proof traces, access hypotheses, suppression hypotheses, and posterior mass.
7. **Chirality metrics** — measures of mismatch between language plausibility, logic/proof structure, available evidence, and expected-but-missing records.
8. **Likely-truth output** — top-K worlds plus claim rankings, confidence, uncertainty decomposition, record-contingency notes, and evidence that would change the ranking.

## What is novel

The novelty is not “another multi-agent debate system.” The key contribution is a **language–logic–access theory** and a buildable **possible-world synthesis mechanism**:

- **Likely-truth ranking:** claims are ranked by posterior mass across structured worlds, not by LLM confidence and not only by strict proof.
- **Language–logic bundle:** language/manifold representations and logic/proof representations are separate spaces connected by grounding and rendering maps.
- **Evidence-access layer:** missing records are modeled according to access regime, record-generation duty, expected observability, and control incentives.
- **Chirality as round-trip distortion:** a narrative is chiral when semantic plausibility does not survive translation into proof-carrying logic, evidence-access structure, and back.
- **Orthesis as fixed point:** the stable synthesis is the logic state that survives repeated grounding/rendering without losing evidence support or record-access coherence.
- **Multiverse views:** competing possible worlds are maintained explicitly, with posterior mass distributed across proof-carrying and record-contingent alternatives.
- **Oracle-boundary discipline:** labels and expert judgments may calibrate models offline, but runtime truth ranking is evidence-driven, access-aware, and capable of abstention.

## Minimum viable build

The MVP can be built without full custom model training:

- Use existing LLMs for extraction candidates, latent-context suggestions, access-hypothesis suggestions, and natural-language rendering.
- Use retrieval plus citation validation for evidence grounding.
- Use NLI/entailment models for claim–evidence scoring.
- Use an evidence-access model for expected record existence, availability, control, and non-production.
- Use a rule compiler for a small monotone tensor-logic core.
- Use candidate-world enumeration or MCMC/beam search over possible worlds.
- Use calibration data to map evidence, access, incentive, and contradiction scores to probabilities.
- Use a dashboard to expose world rankings, proof traces, record-access states, uncertainty, and next evidence.

Fine-tuning is optional for Phase 1. If used, it should be limited to schema-constrained extraction, evidence linking, access-state classification, and calibration—not direct runtime truth judgment.

## Programmatic experiments

The proposal includes six experiments:

1. **Synthetic latent-context resolution:** test whether CNS recovers hidden modifiers that resolve contradictions.
2. **SciFact/FEVER oracle-less grounding:** test evidence-ranking and claim-status assignment without runtime labels.
3. **Multiverse calibration:** test whether top-K world distributions are calibrated and cover gold outcomes.
4. **Oracle boundary ablation:** compare no labels, calibration-only labels, and illegal runtime oracle modes.
5. **Chirality predictiveness:** test whether chirality predicts synthesis difficulty, contradiction persistence, and human-rated uncertainty.
6. **Adversarial record suppression:** test whether the system distinguishes absent evidence, evidence of absence, inaccessible records, and likely withheld records.

## Go/no-go criteria

The first MVP succeeds if it reaches:

- 100% resolvable citations for promoted strict claims;
- zero promoted zero-temperature claims without proof traces;
- calibrated claim probabilities with ECE ≤ 0.10 on held-out verification tasks;
- top-3 world coverage ≥ 85% on synthetic latent-context tasks;
- measurable chirality correlation with synthesis difficulty;
- measurable access-state calibration on adversarial record-suppression tasks;
- explicit distinction between `unsupported`, `record_contingent`, `conflicted`, and `rejected` statuses;
- ablation evidence that multiverse/proof/access scoring beats simple RAG and LLM debate baselines on grounding, uncertainty quality, and likely-truth ranking.
