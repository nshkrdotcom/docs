# ADR 0005: Semantic Types Must Be Mutation-Validated

## Status

Accepted for MVP.

## Context

LLM-generated semantic types may be wrong.

## Decision

Semantic types become trusted only after accepting known-good examples, rejecting known-bad examples, and killing required mutants.

## Consequences

- Semantic type authority is earned.
- Bootstrap validation is a first-class workflow.
- Mutation kill rate becomes a primary coverage metric.
