# 01 — Research Proposal

## Project title

**Grounded Chiral Tensor Synthesis: A Buildable Framework for Probabilistic Narrative Resolution under Limited Information**

## Research question

Can a multi-agent, proof-carrying system construct calibrated truth rankings from limited and contradictory evidence without relying on a runtime oracle?

## Hypothesis

A system that combines evidence-grounded claim extraction, tensor-logic proof closure, chiral mismatch measurement, and possible-world ranking will produce better calibrated and more auditable narrative syntheses than RAG-only, LLM-debate-only, or argument-graph-only baselines.

## Motivation

Limited information does not justify a single “answer.” It justifies a structured set of alternatives. Intelligence analysis has long treated uncertainty through competing hypotheses, source quality, confidence, and estimative language. GCTS turns that discipline into an executable AI architecture: the system maintains plausible worlds, ranks them, exposes evidence diagnostics, and refuses to overclaim.

## Scope

The project focuses on claims that can be represented as textual propositions linked to evidence. Initial domains:

1. Scientific claim verification: SciFact / SciFact-Open.
2. General fact verification: FEVER / FEVEROUS variants.
3. Synthetic conflict cases with planted latent contexts.
4. Controlled intelligence-style scenarios with multiple hypotheses and evidence items.

Out of scope for MVP:

- fully autonomous investigative collection;
- open-ended legal/medical advice;
- claims requiring private, classified, or inaccessible evidence;
- unrestricted arbitrary theorem proving.

## Core deliverables

1. **Theory paper:** definitions, formal claims, and proof sketches for language–logic chirality and possible-world ranking.
2. **MVP architecture:** modular pipeline with agents, schemas, configs, and audit interfaces.
3. **Programmatic experiment suite:** synthetic and benchmark tests with baselines and ablations.
4. **Reference implementation skeleton:** Python sketches for types, chirality, tensor rules, and world scoring.
5. **Evaluation report template:** pre-registered metrics and thresholds.

## Why this can be built

The MVP uses existing components:

- retrieval over a document corpus;
- citation resolution and span alignment;
- NLI/entailment models;
- LLM extraction with schema validation;
- monotone tensor rules implemented as matrix/tensor operations;
- posterior scoring using energy models over candidate worlds;
- calibration with held-out labels.

The novelty is the architecture and formal coupling, not dependence on speculative model capabilities.

## Success definition

The system succeeds if it can:

- ingest evidence and produce proof-carrying candidate worlds;
- rank claims by posterior truth probability;
- identify when a single synthesis is unjustified;
- recover latent context predicates in synthetic contradictions;
- pass oracle-boundary tests showing no runtime labels are needed;
- outperform RAG/debate baselines on calibration, abstention, and auditability.

## Key research risks

1. **World explosion:** possible worlds may scale poorly.
   - Mitigation: beam search, factorized world generation, pruning by proof support and contradiction energy.
2. **NLI unreliability:** entailment models may over/under-score domain claims.
   - Mitigation: calibration, domain-specific evaluation, abstention, ensemble validators.
3. **LLM extraction drift:** generated claims may not preserve evidence semantics.
   - Mitigation: schema tests, citation gates, extraction fine-tuning only if needed.
4. **Overfitted latent predicates:** tensor decomposition may invent meaningless contexts.
   - Mitigation: MDL penalty, held-out validation, human-inspectable predicate descriptions.
5. **False confidence:** posterior masses may appear precise without enough evidence.
   - Mitigation: entropy reporting, confidence bands, source-quality uncertainty, explicit unknown output.

## Work packages

### WP1 — Representation and schemas

Define EvidenceAtom, Claim, Rule, ProofTrace, WorldView, MultiverseState, and SynthesisReport.

### WP2 — Oracle-less inference loop

Implement retrieval, claim extraction, evidence scoring, rule closure, world ranking, and abstention.

### WP3 — Chiral metrics

Implement graph chirality, round-trip chirality, residual tensor chirality, and their correlation tests.

### WP4 — Latent context resolution

Implement residual decomposition that proposes latent context predicates and evaluates them against evidence.

### WP5 — Experimental validation

Run synthetic and benchmark experiments with pre-registered thresholds and baselines.

### WP6 — Agent orchestration

Implement multi-agent pipeline with strict role separation and audit traces.

## Expected contribution

GCTS should produce a publishable contribution if experiments support these claims:

1. Maintaining explicit possible worlds improves calibration and abstention under contradiction.
2. Evidence-weighted chirality predicts synthesis difficulty better than simple embedding distance.
3. Tensor residual decomposition can recover latent context variables in controlled contradictory settings.
4. Runtime oracle-free truth ranking can be trained/calibrated using oracle labels without depending on them during deployment.
