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
- Runtime human/model truth decisions that bypass evidence closure and world ranking.
- Dataset label leakage into retrieval, ranking, or world building.
- Prompting an LLM to “decide” truth and using that as posterior.

## Governance controls

1. **Runtime manifest:** records whether labels were accessible. Any label access marks run as non-deployable.
2. **Promotion policy:** strict claims require evidence references and proof trace.
3. **Likely-truth policy:** probable and plausible claims require posterior calculation over explicit worlds.
4. **Access policy:** record-contingent claims must identify record dependencies and access states.
5. **Audit log:** every promoted claim has a trace from evidence/access state to rule closure to world ranking.
6. **Human review flag:** high-impact or high-uncertainty results require review.
7. **Rule registry:** strict rules require approval and tests.

## Safety risks

### False certainty

Risk: posterior score interpreted as objective truth.

Mitigation: confidence bands, entropy, uncertainty decomposition, estimative language, and explicit caveats.

### Source poisoning

Risk: manipulated evidence changes world rankings.

Mitigation: source reliability priors, source diversity metrics, adversarial evidence tests, source-quality uncertainty.

### Access overreach

Risk: system infers withholding, destruction, or concealment too readily from ordinary missingness.

Mitigation: record-duty thresholds, access-path checks, competing missingness worlds, MDL penalty, conservative confidence.

### Access underreach

Risk: system treats inaccessible controlled records as simple lack of evidence.

Mitigation: record-contingency state, access uncertainty, expected-record modeling, and explicit next-evidence requirements.

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

GCTS is a decision-support system. It should expose alternatives, likely-truth rankings, access constraints, and uncertainty; it should not replace human judgment in high-stakes domains.

## Audit checklist

Before deploying a result:

- [ ] All strict promoted claims have resolvable citations.
- [ ] All strict claims have proof traces.
- [ ] Runtime labels were unavailable.
- [ ] Posterior, strict support, and confidence are reported separately.
- [ ] Top alternatives are shown.
- [ ] Record-contingent claims identify record dependencies.
- [ ] Uncertainty decomposition is shown.
- [ ] Evidence that would change the conclusion is listed.
