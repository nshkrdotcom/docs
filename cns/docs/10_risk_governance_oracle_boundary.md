# 10 — Risks, Governance, and Oracle Boundary

## Oracle boundary

### Allowed oracle use

- Training labels.
- Calibration labels.
- Evaluation labels.
- Expert review of error cases.
- Human approval of new strict rules.

### Forbidden oracle use

- Runtime access to gold labels.
- Runtime human/model truth decisions that bypass evidence closure.
- Dataset label leakage into retrieval, ranking, or world building.
- Prompting an LLM to “decide” truth and using that as posterior.

## Governance controls

1. **Runtime manifest:** records whether labels were accessible. Any label access marks run as non-deployable.
2. **Promotion policy:** strict claims require evidence references and proof trace.
3. **Audit log:** every promoted claim has a trace from evidence to rule closure to world ranking.
4. **Human review flag:** high-impact or high-uncertainty results require review.
5. **Rule registry:** strict rules require approval and tests.

## Safety risks

### False certainty

Risk: posterior score interpreted as objective truth.

Mitigation: confidence bands, entropy, uncertainty decomposition, estimative language, and explicit caveats.

### Source poisoning

Risk: manipulated evidence changes world rankings.

Mitigation: source reliability priors, source diversity metrics, adversarial evidence tests, source-quality uncertainty.

### Latent predicate abuse

Risk: system invents spurious context to save a false hypothesis.

Mitigation: MDL penalty, held-out validation, evidence grounding, human inspection before production promotion.

### Overreliance on NLI

Risk: NLI model mis-scores specialized evidence.

Mitigation: calibrate by domain, ensemble validators, conservative thresholds, abstention.

### LLM rendering drift

Risk: renderer adds unsupported details.

Mitigation: render from structured payload only; post-render verifier; reject unsupported phrases.

## Ethical boundary

GCTS is a decision-support system. It should expose alternatives and uncertainty, not replace human judgment in high-stakes domains.

## Audit checklist

Before deploying a result:

- [ ] All promoted claims have resolvable citations.
- [ ] All strict claims have proof traces.
- [ ] Runtime labels were unavailable.
- [ ] Posterior and confidence are reported separately.
- [ ] Top alternatives are shown.
- [ ] Uncertainty decomposition is shown.
- [ ] Evidence that would change the conclusion is listed.
