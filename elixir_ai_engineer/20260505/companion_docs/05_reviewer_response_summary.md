# Reviewer Response Summary

## High-level response

The reviewer’s likely concern is correct: the Living Substrate v2 is complex.

The answer is not to build all of it first.

The answer is to make the operating surface small:

```text
spec.audit
spec.bundle
spec.accept
spec.trace
spec.typecheck
spec.mutate
spec.proof
```

and to prove that the accepted code is better than naive AI output.

## Concern: Is this the entire lifetime frame?

Yes, but only for load-bearing engineering facts.

The substrate should maintain long-lived truth about:

```text
boundaries
contracts
effects
capabilities
semantic types
runtime shape
evidence
lineage
normal-form policy
accepted exceptions
intervention outcomes
```

It should not preserve arbitrary chat or every transient attempt as truth.

## Concern: Is ENF too fluid?

ENF v2 is layered:

```text
stable core        -> hard invariants
project policy     -> local engineering preferences
experimental rules -> report/warn until promoted
exception ledger   -> explicit, expiring deviations
```

The stable core should be boring and conservative.

## Concern: Are budgets arbitrary?

Budgets are per SpecCell and module kind. They are triggers for compression, split, re-budget, or redesign.

They are not line-count aesthetics. They are mechanism-cost controls.

## Concern: Are agents required?

No.

Skills can be the primary operators. Agents are optional bounded operators with capability bundles.

The product is not agent autonomy. The product is better accepted code.

## Concern: How do credentials relate to code architecture?

They share the AccessGraph.

A patch and a credentialed provider call are both authorized graph moves. Both need context, capability, evidence, audit, and lineage.

## Concern: How does context initialize?

Context must be explicit, reproducible, and mode-switchable.

A simple local run can have a generated default context.

Enterprise 1:N is achieved by passing different contexts, not by retrofitting hidden globals.

## Concern: Is harness evolution fuzzy HPO?

No.

Harness evolution is versioned and promotion-gated. It optimizes metrics like:

```text
frontier calls per accepted patch
normalization delta
false-positive rate
mutation kill rate
runtime failure rate
prediction error on interventions
human review defects
```

Hard invariants cannot be silently weakened.

## Bottom line

The Living Substrate v2 should be sold as a practical executable architecture harness, not a giant autonomous-agent cathedral.

The first proof is narrow:

```text
Given known AI-bad patches, the semantic harness rejects them before review
while still allowing valid local fixes.
```
