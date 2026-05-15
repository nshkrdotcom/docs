# 09 — Grounding, Access, and Multiverse Views

## Position in CNS 8.0

Grounding, access states, and multiverse views constrain and explain synthesis. They do not perform the synthesis step.

## Evidence atoms

Evidence atoms are immutable spans or data items:

```text
evidence_id
document_id
span_start
span_end
text_hash
source_quality
access_state
timestamp
metadata
```

They support SNO claims and proof traces.

## Record-access states

Access state is not a truth value. It tells the system what kind of evidentiary absence it is dealing with.

Recommended access states:

- `available`
- `retrieved`
- `not_retrieved`
- `withheld`
- `sealed`
- `destroyed`
- `never_generated`
- `not_collected`
- `unknown`
- `secondary_report_only`
- `contradictory_record`

## Access-aware inference

A missing record should not automatically support or refute a claim. Access state affects likelihood, confidence, and collection recommendations.

Example:

```text
if record_access == sealed:
    mark claim as unresolved due to access limit
if record_access == never_generated:
    do not infer negative evidence
if record_access == destroyed:
    increase audit warning and require provenance explanation
```

## Multiverse views

A multiverse view is a ranked set of possible structured states after synthesis constraints.

Each world contains:

- claim truth assignments;
- latent predicates;
- access assumptions;
- proof coverage;
- residual contradiction mass;
- posterior score.

## World ranking

CNS may compute:

\[
P(W_i\mid E,A)
\]

but this is only an uncertainty report. It is not the CNS engine.

## Output categories

| Category | Meaning |
|---|---|
| strict | proof trace from evidence under zero-temperature rules |
| likely | posterior-supported but not strict |
| hypothesis | generated for testing |
| unresolved | insufficient proof/access |
| rejected | failed grounding/proof |

## Estimative language

When reporting probabilities, CNS should use calibrated language and numeric ranges. Do not hide uncertainty in prose.

Example:

```text
Likely (70–85%): Claim C holds if latent predicate L1 is accepted.
Unresolved: Claim D cannot be promoted because the relevant record is sealed.
Strict: Claim E follows from evidence atoms e12 and e19 under rule r3.
```

## Audit report

The report should expose:

- input SNOs;
- synthesized SNO;
- proof traces;
- evidence spans;
- access states;
- latent predicates;
- rejected claims;
- top worlds;
- confidence calibration;
- residual contradictions.

## Anti-pattern

Do not output only:

```text
World 1: 0.72
World 2: 0.18
World 3: 0.10
```

without a synthesized SNO and proof-bearing narrative structure.
