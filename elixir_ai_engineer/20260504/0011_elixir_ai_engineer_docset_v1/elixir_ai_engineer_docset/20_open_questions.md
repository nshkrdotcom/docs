# 20 — Open Questions and Research Directions

## Architecture questions

```text
- How strict should ENF be before it blocks useful exploration?
- Which abstractions should be allowed before second implementation exists?
- How do we encode roadmap-driven optionality without inviting slop?
- What is the right cost function for maintainability in Elixir?
- How much of senior Elixir taste can be made executable?
```

## Tooling questions

```text
- How far can AST analysis go before a graph database is needed?
- Can Credo custom checks carry enough ENF policy?
- How should traceability links be represented in code?
- Can state machine specs generate useful property tests automatically?
- How should false positives be managed?
```

## LM questions

```text
- Which tasks need frontier models?
- Which can be handled by small/local models?
- How do we detect when a bundle is underspecified before generation?
- Can repeated critiques be distilled into deterministic checks?
- How do we prevent LMs from overfitting to the ENF report format?
```

## Evaluation questions

```text
- What benchmark tasks represent real Elixir architecture quality?
- How do we compare naive AI output vs harness output fairly?
- How do we measure future change cost?
- How do we measure “semantic density” without gaming?
- Can human senior rewrites become gold-standard compression pairs?
```

## Formalization questions

```text
- Which parts should use state machines?
- Which parts should use property tests?
- Which parts benefit from set-theoretic types as they mature?
- Which parts need TLA+/Alloy-style modeling?
- When does formalism cost more than it saves?
```

## Product questions

```text
- Is the first user the author, a small team, or public Elixir developers?
- Is the wedge audit/normalization or spec-to-code generation?
- What demo is undeniable to senior engineers?
- What data is valuable to frontier labs?
- What artifact is legible to non-Elixir people?
```

## Strongest unresolved problem

The hardest unsolved part is not tests. It is **architecture search**.

Given a spec, the system must choose among many valid runtime shapes.

The initial answer is not to automate perfectly, but to force alternatives and make the chosen shape explicit:

```text
Candidate architectures → cost/evidence comparison → ADR → implementation
```

That alone is a major improvement over unconstrained generation.
