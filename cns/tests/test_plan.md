# CNS 8.0 Test Plan

## Unit tests

- EvidenceAtom hashing and lookup.
- SNO schema validation.
- citation-validity rejection behavior.
- evidence entanglement calculation.
- graph chirality proxy.
- zero-temperature closure.
- proof trace recording.
- ZTHR calculation.
- residual tensor construction.
- predicate-invention utility.
- world posterior normalization.
- orthesis loop convergence.

## Integration tests

- evidence → Proposer → critic → SNO.
- SNO pair → pair selector → proof closure.
- proof closure → residual tensor → latent predicate.
- Synthesizer → re-grounding → orthesis report.
- final audit report.

## Property tests

- no strict claim without proof trace;
- no missing evidence ID can pass citation validator;
- adding unrelated evidence should not increase entanglement;
- possible-world posterior sums to 1;
- predicate complexity penalty lowers PIU.

## Regression tests

- citation hallucination case;
- unrelated disagreement case;
- true unresolved contradiction case;
- hidden subgroup synthetic case;
- round-trip drift case.

## Acceptance tests

- synthetic latent-context recovery above threshold;
- strict ZTHR equals 0;
- final report separates strict/likely/hypothesis/unresolved/rejected.
