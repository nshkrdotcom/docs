# Publication Copy

## One-line post

Living Substrate v2: executable architecture as a lifetime-scoped, graph-projected control system for AI-assisted Elixir/OTP engineering.

## Short post

The v1 Living Substrate reframed the Elixir AI Engineer as a graph-projected feedback system rather than a coding agent.

v2 adds the missing control layer:

```text
semantic types
type oracles
intervention graphs
control oracles
consistency kernels
mutation-tested invariants
proof bundles
```

The goal is not “the agent writes better code.”

The goal is that valid changes are local, bounded, typed, observable, reversible, and mutation-tested — while invalid changes become unrepresentable or non-mergeable.

## Longer post

The Living Substrate v2 is the next turn in the Elixir AI Engineer architecture.

v1 established the substrate: specs, code, runtime behavior, evidence, and lineage projected into shared graphs; LMs as bounded proposal operators; ENF normalization; StackLab adversarial evidence; failures becoming rules instead of notes.

v2 adds the deeper object: interventions.

Software architecture is not primarily about what the system is. It is about what changes the system can survive.

So the substrate now includes:

```text
Program Semantic Graph
AccessGraph
InterventionGraph
Architecture Capsule Graph
Type Oracle
Control Oracle
Consistency Kernel
Proof Bundles
```

A patch is not accepted merely because it compiles and passes tests. It must preserve behavior, effects, capabilities, resources, cost, protocol ordering, and observation obligations:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

The practical MVP is narrow: four semantic types around a supervised `SessionPool`, generated tests/checks/benchmarks/telemetry contracts, mutation-tested known-bad patches, and deterministic proof bundles.

The thesis:

> Autonomous coding becomes viable only when software architecture becomes an executable control system over change.

## Caption for the SVG

A control-surface view of the Living Substrate v2. The graph substrate sits at the center; context initialization, bounded synthesis, type/control oracles, evidence, adversarial mutation, normal-form compression, proof bundles, and harness evolution orbit it as feedback loops. The LM is not the engineer. The harness is.
