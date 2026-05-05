# ADR 0001: Executable Architecture as Product Category

## Status

Accepted for MVP.

## Context

AI-generated patches can satisfy local tests while violating global architecture. Prose instructions and manual review do not scale to autonomous systems.

## Decision

Represent architecture as executable semantic types that generate enforcement projections and deterministic CI verdicts.

## Consequences

- Architecture docs become build inputs.
- Semantic type changes require validation.
- Tests and benchmarks are projections, not hand-authored afterthoughts.
- The LLM is a synthesizer, not a correctness oracle.
