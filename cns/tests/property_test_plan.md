# Property Test Plan

## Properties

1. **Mass conservation:** posterior worlds always sum to 1.
2. **Proof promotion:** every strict promoted claim has proof trace.
3. **Citation gate:** invalid citation implies no strict promotion.
4. **Evidence monotonicity:** adding high-quality supporting evidence should not lower claim posterior unless it also introduces contradiction or source reliability conflict.
5. **Contradiction penalty:** adding direct refuting evidence should increase contradiction energy.
6. **Parsimony:** adding unused latent contexts or suppression hypotheses should increase energy.
7. **Oracle boundary:** runtime label access must mark a run invalid.
8. **Renderer faithfulness:** rendered report must not contain claims absent from structured payload.
9. **Absence discipline:** absence of evidence cannot become evidence of absence without generation duty, expected observability, and access path.
10. **Access contingency:** inaccessible expected records should create access uncertainty rather than automatic rejection.
11. **Suppression softness:** suppression hypotheses cannot produce strict proof.
12. **Strict/likely separation:** strict support mass cannot exceed likely-truth posterior for the same claim.

## Suggested tooling

Use Hypothesis for Python property tests. Generate random claim/evidence/world/access configurations and assert invariants.
