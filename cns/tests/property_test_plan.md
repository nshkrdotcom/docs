# Property Test Plan

## Properties

1. **Mass conservation:** posterior worlds always sum to 1.
2. **Proof promotion:** every promoted strict claim has proof trace.
3. **Citation gate:** invalid citation implies no promotion.
4. **Evidence monotonicity:** adding high-quality supporting evidence should not lower claim posterior unless it also introduces contradiction.
5. **Contradiction penalty:** adding direct refuting evidence should increase contradiction energy.
6. **Parsimony:** adding unused latent contexts should increase energy.
7. **Oracle boundary:** runtime label access must mark a run invalid.
8. **Renderer faithfulness:** rendered report must not contain claims absent from structured payload.

## Suggested tooling

Use Hypothesis for Python property tests. Generate random claim/evidence/world configurations and assert invariants.
