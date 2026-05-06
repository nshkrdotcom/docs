# Diagram Companion: `0007_living_substrate_v2_format_fixed.svg`

## Title

Living Substrate Architecture v2

## Short caption

A lifetime-scoped, graph-projected control system for AI-assisted Elixir/OTP engineering. The substrate constrains generation, checks semantic types, controls interventions, mutation-tests invariants, records proof bundles, and evolves from failures.

## Alt text

Diagram of the Living Substrate Architecture v2. A central Living Graph Substrate connects SpecGraph, ImplementationGraph, EvidenceGraph, RuntimeGraph, LineageGraph, AccessGraph, Program Semantic Graph, and InterventionGraph. Around it are context initialization, bounded synthesis, type and control oracles, consistency kernel, StackLab adversary, ENF normalizer, proof bundles, and harness evolution loops. The diagram emphasizes that LMs and agents are bounded proposal operators while deterministic and adversarial systems verify, compress, and classify changes.

## How to read the diagram

Do not read the SVG as a waterfall.

Read it as a control surface:

```text
context init -> valid move query -> bounded proposal -> graph projection
-> consistency checks -> adversarial mutation -> proof bundle
-> accepted artifact or substrate refinement
```

The key idea is feedback:

```text
counterexamples refine specs and semantic types
runtime anomalies calibrate cost types
normalization outcomes update ENF policy
rejected patches become nogoods, tests, mutants, or rules
accepted proof bundles become judgment traces
intervention results update the control oracle
```

## Callouts worth highlighting

1. **The graph substrate is not a cache.** It is the source of engineering truth.
2. **The LM is not the engineer.** It is one bounded proposal operator.
3. **The Type Oracle bounds valid code moves.**
4. **The Control Oracle bounds valid interventions.**
5. **The Consistency Kernel decides verdicts deterministically.**
6. **StackLab is the adversary.** It tries to falsify invariants.
7. **Proof bundles are the external product.** They capture engineering judgment.
8. **Harness evolution is versioned and metric-driven.** It is not fuzzy HPO.

## Suggested pair text

Post the SVG first, then the standalone architecture note.

```text
Diagram: 0007_living_substrate_v2_format_fixed.svg
Doc: living_substrate_architecture_v2.md
```
