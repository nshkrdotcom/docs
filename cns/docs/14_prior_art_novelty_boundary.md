# 14 — Prior Art and Contribution Boundary

## Purpose

This document states what prior work covers and where CNS 8.0 differs.

## Fact verification

FEVER defines a large-scale claim verification task over Wikipedia claims, with labels Supported, Refuted, and NotEnoughInfo. SciFact extends verification to scientific claims, evidence abstracts, and rationales.

CNS uses these datasets for grounding tests, but CNS is not only claim verification. Verification labels claims; CNS synthesizes new SNOs from chiral, evidentially entangled conflicts.

## RAG

RAG combines parametric generation with non-parametric retrieved memory. It improves factual grounding and provenance compared to closed parametric generation.

CNS uses retrieval as input. RAG does not by itself perform dialectical synthesis, predicate invention, orthesis testing, or proof-carrying SNO construction.

## Multi-agent debate

Multi-agent debate uses multiple model instances to propose and challenge answers. It is relevant to the Proposer/Antagonist/Synthesizer idea.

CNS differs by requiring structured SNOs, evidence gates, tensor proof closure, and orthesis round-trip testing. LLM agreement is not truth.

## Tree of Thoughts and search over reasoning paths

Tree of Thoughts explores multiple intermediate reasoning paths with self-evaluation and backtracking.

CNS can use search, but the core object is the SNO and the core stability test is proof-grounded orthesis, not only path selection.

## Logic Tensor Networks and neuro-symbolic logic

Logic Tensor Networks integrate learning and logical reasoning by grounding first-order logic in differentiable tensor semantics.

CNS uses related neuro-symbolic ideas but adds chiral narrative selection, evidential entanglement, dialectical agents, contradiction residuals, predicate invention, and orthesis as a synthesis fixed point.

## Tensor Logic

Tensor Logic proposes tensor equations as a unifying construct for neural, symbolic, and statistical AI, including the observation that logical rules and Einstein summation can be treated in a shared language.

CNS 8.0 uses tensor logic as a proof and closure substrate. This is not "rules as tensors" alone; it is the use of tensor closure inside chiral narrative synthesis, with residual contradiction driving predicate invention and orthesis testing.

## Probabilistic Soft Logic

Probabilistic Soft Logic provides weighted first-order-like rules and efficient probabilistic inference.

CNS can borrow calibration and soft-rule ideas, but strict CNS promotion requires proof traces and runtime oracle boundaries.

## Large Concept Models

Large Concept Models operate over higher-level sentence/concept representations rather than token-level prediction.

CNS can use concept-level representations for $L$, but CNS requires explicit grounding into $\mathcal{T}$, proof traces, and synthesis stability.

## Intelligence analysis and ACH

Analysis of Competing Hypotheses and analytic standards emphasize competing hypotheses, uncertainty, source evaluation, and controlled probability language.

CNS uses these as reporting method. CNS differs by constructing proof-bearing narrative objects, measuring chiral tension, and performing predicate invention.

## Contribution claim

CNS 8.0's strongest contribution is the integrated mechanism:

```text
SNOs
+ chiral/evidential pair selection
+ antagonist pressure
+ zero-temperature tensor proof closure
+ contradiction residual tensor
+ predicate invention
+ orthesis fixed-point test
+ multiverse/access-aware uncertainty report
```

No single prior-art bucket covers this full pipeline.

## Contribution boundary

Do not claim contribution for:

- RAG retrieval;
- NLI entailment scoring;
- LoRA adaptation;
- possible-world reasoning in general;
- fact verification datasets;
- Datalog-style closure;
- tensor factorization in general;
- multi-agent debate in general.

Claim contribution for the CNS composition and the specific role each component plays in grounded dialectical synthesis.
