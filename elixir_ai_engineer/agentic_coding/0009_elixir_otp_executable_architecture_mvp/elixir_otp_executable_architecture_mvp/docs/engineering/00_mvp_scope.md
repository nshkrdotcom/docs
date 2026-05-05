# MVP Scope

## Goal

Build a minimal executable architecture platform for Elixir/OTP that proves the complete loop:

```text
semantic type → oracle guidance → generated projections → patch proof bundle → mutation-proven deterministic verdict → runtime feedback
```

## Non-goals

The MVP does not:

- prove arbitrary Elixir correctness
- implement a full dependent type system
- infer all semantics automatically from code
- provide complete call graph analysis
- auto-merge production patches
- auto-weaken performance contracts from runtime observations

## MVP semantic types

| Type | Purpose |
|---|---|
| `AgentCapabilityBundle` | typed repair authority and access graph |
| `BoundaryProcess` | GenServer boundary with callbacks, effects, telemetry |
| `SessionProtocol` | ordered lifecycle/session type |
| `HotPathOperation` | cost/resource/observation contract |

## MVP example

`Example.SessionPool`:

- supervised GenServer
- checkouts workers from a bounded DynamicSupervisor
- requires capability token
- emits telemetry
- preserves session lifecycle
- has p95 checkout benchmark envelope
- rejects known bad mutations

## Acceptance criteria

### Semantic registry

- can load semantic type DSL files
- assigns stable IDs and versions
- validates schema
- exposes type lookup by ID

### Type oracle

- accepts intent + capability bundle
- returns valid morphism templates
- filters unauthorized modifications
- returns required projection/check list

### Projection engine

- generates at least one ExUnit contract test
- generates at least one StreamData property test
- generates at least one custom Credo check
- generates at least one telemetry contract test
- generates at least one Benchee benchmark stub

### Consistency kernel

- accepts proof bundle
- runs/checks required results
- rejects missing projections
- rejects capability violation
- rejects surviving mutation
- emits deterministic verdict report

### Mutation harness

- applies at least four mutations
- proves generated suite kills them
- reports kill score

### Runtime observer

- attaches to required telemetry events
- records cost observations
- identifies envelope breach
- proposes candidate refinement record

## Demo scenario

1. Agent asks oracle how to fix session checkout timeout.
2. Oracle allows local timeout/retry refinement.
3. Agent proposes patch.
4. Generated checks run.
5. Mutation harness removes capability check and confirms tests fail.
6. Kernel accepts patch.
7. Runtime observer later detects p95 regression and opens cost refinement candidate.
