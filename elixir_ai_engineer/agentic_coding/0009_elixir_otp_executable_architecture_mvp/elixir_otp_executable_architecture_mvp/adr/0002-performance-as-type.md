# ADR 0002: Performance as a First-Class Type

## Status

Accepted for MVP.

## Context

Performance regressions are often architectural violations rather than mere measurement failures.

## Decision

Model cost/resource envelopes as part of semantic type definitions.

## Consequences

- Hot paths require static resource-shape checks and empirical calibration.
- Benchmarks validate cost types rather than standing alone.
- Runtime observation anomalies can propose type refinements, but cannot auto-weaken contracts.
