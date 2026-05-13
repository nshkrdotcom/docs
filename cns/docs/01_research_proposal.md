# 01 — Research Proposal

## Project title

**Grounded Chiral Tensor Synthesis: A Buildable Framework for Likely-Truth Ranking under Limited, Contradictory, and Adversarial Information**

## Research question

Can a multi-agent, proof-carrying, access-aware system construct calibrated likely-truth rankings from limited, contradictory, and adversarially controlled evidence without relying on a runtime oracle?

## Hypothesis

A system that combines evidence-grounded claim extraction, tensor-logic proof closure, access-state modeling, institutional-incentive modeling, chiral mismatch measurement, and possible-world ranking will produce better calibrated and more auditable likely-truth syntheses than RAG-only, LLM-debate-only, or argument-graph-only baselines.

## Motivation

Limited information does not justify either a single overconfident answer or a retreat into “not proven.” It justifies a structured set of alternatives with explicit likelihood, confidence, evidence coverage, access constraints, source incentives, and uncertainty.

Intelligence analysis, investigative work, scientific synthesis, legal reasoning, and institutional accountability all require inference under incomplete records. CNS 7.1 turns that discipline into an executable AI architecture: the system maintains plausible worlds, ranks them, exposes evidence and record-access diagnostics, and distinguishes absence of evidence from evidence of absence.

## Scope

The project focuses on claims that can be represented as textual or structured propositions linked to evidence, expected records, observation reports, source obligations, or access states.

Initial domains:

1. Scientific claim verification: SciFact / SciFact-Open.
2. General fact verification: FEVER / FEVEROUS variants.
3. Synthetic conflict cases with planted latent contexts.
4. Controlled intelligence-style scenarios with multiple hypotheses and evidence items.
5. Synthetic adversarial-record scenarios with planted withheld, unavailable, destroyed, or never-generated records.

Out of scope for MVP:

- fully autonomous investigative collection;
- unrestricted legal, medical, or financial advice;
- claims requiring private, classified, or inaccessible evidence without an explicit access model;
- unrestricted arbitrary theorem proving;
- direct runtime truth judgment by a human, model, benchmark label, or hidden oracle.

## Core deliverables

1. **Theory paper:** definitions, formal claims, and proof sketches for language–logic chirality, likely-truth ranking, record-access modeling, and possible-world inference.
2. **MVP architecture:** modular pipeline with agents, schemas, configs, and audit interfaces.
3. **Programmatic experiment suite:** synthetic, benchmark, and adversarial-record tests with baselines and ablations.
4. **Reference implementation skeleton:** Python sketches for types, chirality, tensor rules, access modeling, and world scoring.
5. **Evaluation report template:** pre-registered metrics and thresholds.

## Why this can be built

The MVP uses existing components:

- retrieval over a document corpus;
- citation resolution and span alignment;
- NLI/entailment models;
- LLM extraction with schema validation;
- monotone tensor rules implemented as matrix/tensor operations;
- posterior scoring using energy models over candidate worlds;
- access-state heuristics and calibrated classifiers;
- calibration with held-out labels and synthetic gold worlds.

The novelty is the architecture and formal coupling, not dependence on speculative model capabilities.

## Success definition

The system succeeds if it can:

- ingest evidence and produce proof-carrying candidate worlds;
- rank claims by posterior likely truth probability;
- identify when strict proof is unavailable but a claim remains likely, plausible, conflicted, or record-contingent;
- distinguish absent evidence, evidence of absence, and inaccessible evidence;
- recover latent context predicates in synthetic contradictions;
- represent source incentives and record-control asymmetries without turning them into direct truth oracles;
- pass oracle-boundary tests showing no runtime labels are needed;
- outperform RAG/debate baselines on calibration, abstention, likely-truth ranking, and auditability.

## Key research risks

1. **World explosion:** possible worlds may scale poorly.
   - Mitigation: beam search, factorized world generation, pruning by proof support, access relevance, and contradiction energy.
2. **NLI unreliability:** entailment models may over/under-score domain claims.
   - Mitigation: calibration, domain-specific evaluation, abstention, ensemble validators.
3. **LLM extraction drift:** generated claims may not preserve evidence semantics.
   - Mitigation: schema tests, citation gates, extraction fine-tuning only if needed.
4. **Overfitted latent predicates:** tensor decomposition may invent meaningless contexts.
   - Mitigation: MDL penalty, held-out validation, human-inspectable predicate descriptions.
5. **Suppression overreach:** the system may infer concealment too readily from missing records.
   - Mitigation: record-generation duty tests, access-path modeling, motive calibration, alternative missingness hypotheses, conservative confidence.
6. **False confidence:** posterior masses may appear precise without enough evidence.
   - Mitigation: entropy reporting, confidence bands, source-quality uncertainty, access uncertainty, explicit unknown output.

## Work packages

### WP1 — Representation and schemas

Define EvidenceAtom, AccessState, RecordObligation, InstitutionalIncentiveProfile, Claim, Rule, ProofTrace, WorldView, MultiverseState, and SynthesisReport.

### WP2 — Oracle-less inference loop

Implement retrieval, claim extraction, evidence scoring, rule closure, access-state modeling, world ranking, and abstention.

### WP3 — Chiral metrics

Implement graph chirality, round-trip chirality, residual tensor chirality, and access-chirality metrics.

### WP4 — Latent context and record-access resolution

Implement residual decomposition that proposes latent context predicates and access-state hypotheses, then evaluates them against evidence and missingness constraints.

### WP5 — Experimental validation

Run synthetic, benchmark, and adversarial-record experiments with pre-registered thresholds and baselines.

### WP6 — Agent orchestration

Implement multi-agent pipeline with strict role separation and audit traces.

## Expected contribution

GCTS should produce a publishable contribution if experiments support these claims:

1. Maintaining explicit possible worlds improves calibration and abstention under contradiction.
2. Evidence-weighted chirality predicts synthesis difficulty better than simple embedding distance.
3. Tensor residual decomposition can recover latent context variables in controlled contradictory settings.
4. Access-state modeling improves likely-truth ranking in adversarial missing-record settings.
5. Runtime oracle-free truth ranking can be trained/calibrated using oracle labels without depending on them during deployment.
