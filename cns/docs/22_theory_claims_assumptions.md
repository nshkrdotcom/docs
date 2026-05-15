# 22 — Theory Claims, Assumptions, and Theorem Sketches

## Claim 1 — Productive conflict is not generic contradiction

**Statement.** Productive synthesis pairs require both chiral opposition and evidential entanglement.

**Assumptions.**

- Evidence identifiers are stable.
- Evidence quality weights are available or default to uniform.
- SNOs contain aligned claim/relation structures.

**Prediction.** A pair selector using chirality × entanglement outperforms selectors using contradiction count or embedding distance alone.

## Claim 2 — Zero-temperature proof closure blocks strict hallucination

**Statement.** If a strict claim is promoted only when a proof trace exists under monotone zero-temperature rules grounded in evidence atoms, unsupported strict claims are blocked.

**Assumptions.**

- Rule set is monotone and finite.
- Evidence atoms resolve.
- Proof traces are required for strict promotion.
- Parser cannot bypass proof status.

**Test.** ZTHR must equal zero on constrained toy and fact-verification subsets.

## Claim 3 — Persistent residual contradiction implies missing structure or true unresolved conflict

**Statement.** If support and refute mass persist after proof closure, either the predicate vocabulary lacks a relevant context or the evidence cannot support a synthesis.

**Assumptions.**

- Grounding critics are reliable enough to avoid extraction-error residuals dominating.
- Residual tensor is built over aligned predicates.

**Test.** On synthetic tasks with planted hidden contexts, predicate invention recovers the hidden context; on no-solution tasks, CNS reports unresolved rather than inventing spurious predicates.

## Claim 4 — Orthesis is a stability condition

**Statement.** A synthesized SNO that survives render/re-ground cycles with low proof-critical distortion is more stable than an ordinary narrative summary.

**Assumptions.**

- Grounding function \(G\) is deterministic or variance-bounded under fixed configuration.
- Logic state comparison weights proof-critical atoms.

**Test.** CNS output has lower \(\chi_{LL}\) than baseline summaries.

## Claim 5 — Possible-world ranking improves uncertainty reporting but does not create synthesis

**Statement.** Possible worlds help report remaining uncertainty after synthesis, but possible-world posterior mass alone does not produce an SNO with proof traces and synthesis lineage.

**Test.** Possible-world-only baseline should perform worse on narrative synthesis quality and orthesis stability, even when calibrated.

## Claim 6 — Predicate invention increases information only when grounded

**Statement.** Latent predicates improve CNS only when they reduce residual contradiction and have independent evidence support.

**Assumptions.**

- Predicate complexity is penalized.
- Grounding is evaluated on held-out evidence when possible.

**Test.** Measure PIU and false predicate rate.

## Claim 7 — Topology is diagnostic, not a replacement for proof

**Statement.** Beta-1 and related topology metrics can predict synthesis difficulty and detect circular support, but cannot alone prove or refute claims.

**Test.** Compare beta-1-only against chirality+entanglement+proof metrics.
