# ADR 0004: Queryable Type Oracle

## Status

Accepted for MVP.

## Context

Reactive checking wastes agent cycles and permits invalid search.

## Decision

Provide a type oracle that returns valid morphism spaces before patch generation.

## Consequences

- Agents must query before editing.
- Oracle responses include valid templates, forbidden deltas, and required checks.
- The kernel remains the final deterministic verifier.
