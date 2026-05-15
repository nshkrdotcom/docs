# 26 — Human Review Protocol

## When to trigger human review

Trigger review when:

- high chiral tension and high stakes;
- access gaps block strict claims;
- predicate invention proposes high-impact latent context;
- residual contradiction remains high;
- calibration confidence is poor;
- strict claims are impossible but likely claims are decision-relevant;
- critic ensemble deadlocks.

## Review packet

A review packet includes:

- input SNOs;
- synthesized SNO;
- Antagonist report;
- proof traces;
- evidence spans;
- access states;
- residual tensor summary;
- latent predicates;
- possible worlds;
- model/run manifest.

## Reviewer actions

Reviewer can:

- accept strict claims;
- downgrade likely claims;
- reject unsupported claims;
- mark latent predicate as plausible / unsupported / wrong;
- request evidence collection;
- mark access-state assumptions;
- annotate synthesis quality.

## How review affects the system

Human review may be used:

- as post-run annotation;
- as calibration data;
- as training data in future offline runs.

Human review is recorded after runtime unless the run is explicitly marked as a review or retraining step.

## Review labels

- `accepted`
- `downgraded`
- `rejected`
- `needs_evidence`
- `access_blocked`
- `predicate_plausible`
- `predicate_unsupported`
- `synthesis_overclaims`
- `synthesis_preserves_conflict`
