# 20 — MVP Build Checklist

## Dataset

- [ ] Small evidence corpus prepared.
- [ ] Synthetic latent-context dataset generated.
- [ ] Train/dev/test split hashes recorded.
- [ ] Gold labels isolated from runtime.

## Evidence

- [ ] Evidence atoms created.
- [ ] Stable IDs and hashes.
- [ ] Access states attached.
- [ ] Citation lookup tested.

## SNO extraction

- [ ] Candidate SNO schema implemented.
- [ ] Claim extraction prompt or model.
- [ ] Relation extraction prompt or model.
- [ ] Parser tests for malformed output.

## Critics

- [ ] Citation validator.
- [ ] Entailment scorer.
- [ ] Logic critic.
- [ ] Topology critic.
- [ ] Access critic.
- [ ] Chirality critic.

## Pair selection

- [ ] Evidential Entanglement score.
- [ ] Graph chirality.
- [ ] Evidence-polarity chirality.
- [ ] Productive Conflict Score.
- [ ] Pair-selection report.

## Proof closure

- [ ] Rule registry.
- [ ] Zero-temperature closure.
- [ ] Proof trace generation.
- [ ] ZTHR metric.

## Predicate invention

- [ ] Residual tensor builder.
- [ ] Factorization routine.
- [ ] Candidate predicate labels.
- [ ] Predicate grounding tests.
- [ ] PIU metric.

## Synthesis

- [ ] Synthesizer prompt.
- [ ] Synthesized SNO schema.
- [ ] Proof/reference preservation.
- [ ] Residual contradiction preservation.

## Orthesis

- [ ] Render/re-ground loop.
- [ ] Round-trip residual.
- [ ] Stability threshold.
- [ ] Orthesis report.

## Audit

- [ ] strict/likely/hypothesis/unresolved/rejected sections.
- [ ] top worlds.
- [ ] access gaps.
- [ ] proof trace links.
- [ ] latent predicate status.
- [ ] calibration report.

## Stop condition

Do not expand to large multi-agent runtime until the SNO → Antagonist → proof → predicate invention → Synthesizer → orthesis loop works on toy data.
