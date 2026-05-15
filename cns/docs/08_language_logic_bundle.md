# 08 — Language–Logic Bundle and Chirality

## Motivation

Semantic similarity does not imply logical compatibility. Two texts can be semantically close because they discuss the same thing while logically opposing each other. CNS 8.0 separates language from logic so that this mismatch can be measured.

## Spaces

- \(L\): language / embedding / concept space.
- \(\mathcal{T}\): logic / tensor / proof space.
- \(G: L \to \mathcal{T}\): grounding.
- \(S: \mathcal{T} \to L\): synthesis or rendering.

## Bundle view

For each point in language space, there is a fiber of possible logical interpretations. Ambiguous language has a large fiber. Precise language with strong evidence has a smaller fiber.

A CNS run chooses and revises fiber states through grounding, proof, antagonist pressure, and synthesis.

## Chirality as non-commutativity

Language movement and logic movement do not commute.

Path A:

```text
language reframe → ground
```

Path B:

```text
ground → logic inference → render
```

The difference is chiral distortion.

\[
\chi_{LL} =
\|G(S(T)) - T\|_\Omega
\]

This is the key CNS 8.0 round-trip test.

## Holonomy

When an SNO is transported through a dialectical loop and returns changed, the loop has nontrivial holonomy.

```text
SNO_A
→ Antagonist reframing
→ proof closure
→ Synthesizer rendering
→ re-grounding
→ SNO_A'
```

If \(SNO_A'\) differs from \(SNO_A\) in proof-critical atoms, the narrative is unstable.

## Orthesis in the bundle

Orthesis is a stable section:

\[
T^* = G(S(T^*))
\]

with acceptable residuals and proof traces.

In practice, CNS accepts an orthesis candidate when repeated render/re-ground cycles stop changing proof-critical structure.

## Why this is different from vector averaging

Vector averaging produces a midpoint in \(L\). CNS synthesis seeks a stable state in \(\mathcal{T}\) that can be rendered into \(L\) without losing proof-critical structure.

## Why this is different from LLM debate

LLM debate can produce consensus text. CNS requires the consensus text to re-ground into the same proof-bearing logic state.

## Why this is different from fact verification

Fact verification labels claims. CNS builds a new narrative object when contradictions over shared evidence expose missing structure.

## Testable predictions

1. High \(\chi_{LL}\) predicts synthesis difficulty.
2. Orthesis candidates have lower round-trip residual than ordinary summaries.
3. Predicate invention reduces \(\chi_{LL}\) when the original predicate vocabulary is incomplete.
4. Possible-world ranking alone does not reduce round-trip residual unless it is connected to synthesis.
