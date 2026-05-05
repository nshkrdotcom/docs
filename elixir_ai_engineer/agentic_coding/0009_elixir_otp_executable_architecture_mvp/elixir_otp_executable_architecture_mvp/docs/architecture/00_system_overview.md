# System Overview

## Mission

Build an Elixir/OTP MVP that turns architecture into executable semantic types and uses those types to guide and verify autonomous code changes.

## Top-level architecture

```mermaid
flowchart TD
    A[Architecture Docs / ADRs / Specs] --> B[Semantic Type Authoring]
    B --> C[Semantic Registry]
    C --> D[Type Oracle]
    C --> E[Projection Engine]
    C --> F[Consistency Kernel]
    C --> G[Runtime Observer]

    H[LLM / Agent] -->|queries valid morphisms| D
    D -->|bounded repair space| H
    H -->|proposes patch + proof bundle| F

    E --> I[Generated ExUnit Tests]
    E --> J[Generated StreamData Properties]
    E --> K[Generated Credo Checks]
    E --> L[Generated Benchmarks]
    E --> M[Generated Telemetry Contracts]

    N[Patch Lens] -->|diff impact| F
    I --> F
    J --> F
    K --> F
    L --> F
    M --> F

    O[Mutation Harness] --> F
    P[Runtime Telemetry / Benchmarks] --> G
    G -->|candidate refinements| B

    F -->|accept/reject| Q[CI Verdict]
```

## Major components

| Component | Responsibility |
|---|---|
| Semantic Registry | Stores typed semantic objects, IDs, relationships, aliases, versions |
| Type Oracle | Answers “what valid morphisms exist for this intent/capability?” |
| Projection Engine | Generates deterministic enforcement artifacts from semantic types |
| Consistency Kernel | Accepts/rejects patches based on proof bundles and checker results |
| Patch Lens | Maps source diffs to semantic objects and required checks |
| Mutation Harness | Proves semantic types/checks reject known-bad non-inhabitants |
| Runtime Observer | Maps telemetry/benchmarks back to semantic cost and observation types |
| Agent Gateway | Restricts agents by typed capability bundles and mediates oracle access |

## MVP dataflow

```mermaid
sequenceDiagram
    participant Spec as Architecture Spec
    participant LLM as LLM Type Author
    participant Reg as Semantic Registry
    participant Oracle as Type Oracle
    participant Agent as Coding Agent
    participant Proj as Projection Engine
    participant Kernel as Consistency Kernel
    participant CI as CI

    Spec->>LLM: prose/ADR/session-pool requirements
    LLM->>Reg: semantic type proposal
    Reg->>Reg: type validation + bootstrap examples
    Agent->>Oracle: valid morphisms for intent + capability
    Oracle-->>Agent: allowed repair templates + forbidden deltas
    Agent->>Proj: request generated checks
    Proj-->>CI: ExUnit/StreamData/Credo/Benchee/Telemetry checks
    Agent->>Kernel: patch + proof bundle
    CI->>Kernel: deterministic results
    Kernel-->>CI: accept/reject verdict
```

## MVP boundedness

The MVP does not attempt universal formal verification. It proves the loop for four semantic types:

1. `AgentCapabilityBundle`
2. `BoundaryProcess`
3. `SessionProtocol`
4. `HotPathOperation`

Each type must generate deterministic projections and have a mutation suite.
