# 07 — Tensor Logic and Predicate Invention

## Why tensor logic belongs in CNS

CNS needs a proof substrate that can operate over evidence-linked claims and relations. Tensor logic gives CNS a way to express rules as tensor contractions and closures. This allows strict proof paths for claims that require deterministic support and soft exploration for hypothesis generation.

## Rule temperatures

CNS 8.0 separates rules by temperature:

| Temperature | Role | Promotion status |
|---:|---|---|
| $T=0$ | strict proof, deterministic closure | may promote strict claims |
| $0<T<1$ | analogical bridge, soft rule | may propose hypotheses |
| annealed $T\downarrow 0$ | exploratory claim converted to proof obligation | may promote only after strict proof |
| LLM-only | language proposal | cannot promote truth |

## Example tensor rule

Datalog:

```text
supported_claim(c) ← cites(c,e), entails(e,c)
```

Tensor form:

$$
Supported[c] = step(Cites[c,e] \cdot Entails[e,c])
$$

The repeated index $e$ is contracted. `step` is the zero-temperature gate.

## Proof-carrying synthesis

Every strict claim in a synthesized SNO must have:

```text
claim_id
→ evidence atom(s)
→ rule(s)
→ intermediate atom(s)
→ final claim
```

No proof trace, no strict claim.

## Contradiction residuals

After zero-temperature closure, CNS builds residual tensors for unresolved support/refute pairs.

Example tensor axes:

```text
subject × predicate × object × context
```

A residual entry records where support and refutation both survive proof closure.

## Predicate invention

Predicate invention is not free-form LLM explanation. It is a structured process:

1. build residual tensor;
2. factorize residual tensor;
3. map high-loading factors to candidate predicates;
4. generate natural-language labels for candidates;
5. ground candidates against evidence;
6. add accepted predicates to rule bank;
7. rerun closure and measure residual reduction.

## Candidate latent predicate examples

- `holds_during_period(T)`
- `applies_to_subgroup(S)`
- `uses_measurement_method(M)`
- `assumes_definition(D)`
- `conditioned_on_source_frame(F)`
- `true_under_jurisdiction(J)`
- `explained_by_mechanism(K)`

## Predicate invention acceptance

A latent predicate is accepted only when it:

- reduces residual contradiction;
- has evidence support;
- improves explanation compactness;
- does not introduce ungrounded claims;
- survives critic review;
- can be represented in the SNO proof graph.

## Predicate-Invention Utility

$$
PIU =
\frac{
\Delta \mathrm{ResidualEnergy}
}{
1 + \mathrm{PredicateComplexity}
}
$$

A predicate with high residual reduction but high complexity may still be rejected by the Novelty-Parsimony Critic.

## Anti-patterns

Reject:

- LLM-generated hidden variables with no evidence;
- predicates that merely rename the contradiction;
- predicates that explain every case and therefore explain nothing;
- factors learned from data leakage;
- predicates accepted because they make the story smoother.

## Implementation target

The first implementation should use simple dense/sparse tensors in Python:

- boolean matrices for citation and entailment;
- relation tensors for support/refute;
- residual tensor over synthetic tasks;
- SVD/Tucker approximation for candidate latent factors;
- explicit proof traces in JSON.
