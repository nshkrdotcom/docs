# ADR 0003: Repair Scope as Agent Capability Bundle

## Status

Accepted for MVP.

## Context

A local repair should often read global architecture but not modify it.

## Decision

Model repair scope as typed capability bundles over semantic objects, with separate read/modify/execute/delegate permissions.

## Consequences

- Patch scope checking becomes access graph validation.
- Oracle filters valid morphisms by capability bundle.
- Local repair agents cannot mutate architectural kernels without a migration capability.
