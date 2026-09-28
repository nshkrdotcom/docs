# Phase 11 optional domain/human evaluation packet

**Status:** PREPARED, NOT_RUN. Human review is optional/nonblocking under D046.

Use this packet only if a real study is commissioned. Never synthesize reviewer identities or findings.

## Preconditions

1. Every screenplay/excerpt has a validated `Fount.Intelligence.Evaluation.CorpusManifest` with rights evidence and explicit permissions for the actual storage/review/provider lane.
2. Human-review permission is true before showing material to reviewers.
3. Provider-export permission is independently checked before any hosted Observe/Inference use; human-review permission does not imply provider export.
4. Reviewers receive only the slice/checkpoint required for the question; first-exposure Reader studies do not expose future pages.

## Separate studies

### A. Support / validity

Use independent semantic annotations for measurable constructs and first-exposure reader checkpoints. Preserve every response and disagreement. Do not adjudicate to consensus merely to improve a score. Record reviewer role/experience only with consent and without unnecessary personal data.

Suggested screenplay cases should include linear and non-linear presentation, ensemble/relationship cases, ambiguous subtext, setup/payoff, and deliberately withheld/uncertain evidence. Sample size and corpus composition must be reported exactly; do not call a small convenience sample representative.

### B. Writer usefulness

Run separately from support/validity. Ask whether evidence, uncertainty, protected strengths, alternatives and resource cost help the writer make a decision. Do not use writer preference as ground truth for a lens measurement and do not use calibration accuracy as proof that a rewrite recommendation is useful.

## Reader checkpoint protocol

For each selected checkpoint record at minimum: corpus item, stable unit ID, presentation index, `first_exposure=true`, exact prompt, semantic response, optional confidence/rationale, and blinding. Future screenplay material must remain hidden until later checkpoints.

## Reporting

Report distributions/disagreement, missing/abstained responses, construct-specific metrics, limitations and corpus rights. Separate model support/validity from writer usefulness. Do not rank providers or models unless a separately authorized comparative study was actually designed to do so; Phase-11 drift output is descriptive only.

If the study is skipped, record only: `NOT_RUN under D046; validation debt retained`.
