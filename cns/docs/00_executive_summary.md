# 00 — Executive Summary

## Thesis

The next CNS should be a **grounded probabilistic synthesis engine** for limited-information reasoning. It should not ask an LLM to “resolve” narratives by text generation. It should construct a **multiverse of possible structured worlds**, score them against evidence, identify where language-space plausibility and logic-space proof diverge, and emit ranked conclusions with calibrated confidence.

We call this version:

> **CNS 7.0 / GCTS — Grounded Chiral Tensor Synthesis**

GCTS unifies the internal CNS lineage—Structured Narrative Objects, critic pipelines, grounded resonance, tensor logic, orthesis, and the language-logic bundle—into a buildable MVP.

## The problem

Current LLM and RAG systems can retrieve evidence and produce plausible synthesis, but they often fail in exactly the cases CNS is meant to address:

- limited and contradictory evidence;
- multiple plausible hypotheses;
- uncertainty that should not be collapsed into one answer;
- claims that sound coherent but lack evidence support;
- hidden context variables such as time, population, domain, jurisdiction, mechanism, source bias, or measurement frame;
- synthesis that requires saying “we do not know yet” while ranking the most defensible alternatives.

## Proposed solution

GCTS represents a case as:

1. **Evidence atoms** — traceable spans, source quality, time, provenance.
2. **Claims and relations** — structured propositions with support, contradiction, implication, or refinement relations.
3. **Tensor logic rules** — proof-carrying transformations over claims and evidence.
4. **World views** — possible structured states of the case, each with facts, assumptions, latent contexts, proof traces, and posterior mass.
5. **Chirality metrics** — measures of mismatch between language plausibility and logic/evidence structure.
6. **Multiverse output** — top-K worlds plus claim truth rankings, confidence, uncertainty decomposition, and what evidence would change the ranking.

## What is novel

The novelty is not “another multi-agent debate system.” The key research contribution is a **language–logic curvature theory** and a buildable **possible-world synthesis mechanism**:

- **Language–logic bundle:** language/manifold representations and logic/proof representations are separate spaces connected by grounding and rendering maps.
- **Chirality as round-trip distortion:** a narrative is chiral when semantic plausibility does not survive translation into proof-carrying logic and back.
- **Orthesis as fixed point:** the stable synthesis is the logic state that survives repeated grounding/rendering without losing proof support.
- **Multiverse views:** competing possible worlds are maintained explicitly, following structured-analysis traditions such as Analysis of Competing Hypotheses, but implemented as a calibrated posterior over proof-carrying worlds.
- **Oracle-boundary discipline:** labels and expert judgments may calibrate models, but runtime truth ranking is evidence-driven and can abstain.

## Minimum viable build

The MVP can be built without full custom model training:

- Use existing LLMs for extraction candidates and natural-language rendering.
- Use retrieval plus citation validation for evidence grounding.
- Use NLI/entailment models for claim–evidence scoring.
- Use a rule compiler for a small monotone tensor-logic core.
- Use candidate-world enumeration or MCMC/beam search over possible worlds.
- Use calibration data to map scores to probabilities.
- Use a dashboard to expose world rankings, proof traces, and uncertainty.

Fine-tuning is optional for Phase 1. If used, it should be limited to schema-constrained extraction, evidence linking, and calibration—not truth judgment.

## Programmatic experiments

The proposal includes five experiments:

1. **Synthetic latent-context resolution:** test whether CNS recovers hidden modifiers that resolve contradictions.
2. **SciFact/FEVER oracle-less grounding:** test evidence-ranking and claim-status assignment without runtime labels.
3. **Multiverse calibration:** test whether top-K world distributions are calibrated and cover gold outcomes.
4. **Oracle boundary ablation:** compare no labels, training-only labels, and illegal runtime oracle modes to prove the boundary matters.
5. **Chirality predictiveness:** test whether chirality predicts synthesis difficulty, contradiction persistence, and human-rated uncertainty.

## Go/no-go criteria

The first 12-week MVP succeeds if it reaches:

- 100% resolvable citations for promoted claims;
- zero promoted zero-temperature claims without proof traces;
- calibrated claim probabilities with ECE ≤ 0.10 on held-out verification tasks;
- top-3 world coverage ≥ 85% on synthetic latent-context tasks;
- measurable chirality correlation with synthesis difficulty;
- ablation evidence that multiverse/proof scoring beats simple RAG and LLM debate baselines on grounding and uncertainty quality.
