# Core Model: Cost-Refined Semantic Denotation

## Program denotation

Every meaningful program artifact is represented as:

```text
⟦P⟧ = B × E × K × R × C × Q × O
```

Where:

| Component | Meaning |
|---|---|
| `B` | Behavior: what it computes or guarantees |
| `E` | Effects: what it mutates, emits, invokes, writes, calls |
| `K` | Capabilities: what authority is required or granted |
| `R` | Resources: processes, mailboxes, ETS tables, DB connections, files, memory |
| `C` | Cost: latency, reductions, queue growth, allocation, cardinality, scale class |
| `Q` | Protocol: sequencing and lifecycle constraints |
| `O` | Observation: telemetry, traces, counters, benchmark obligations |

## Patch as morphism

A patch is not just a diff. It is a proposed semantic transformation:

```text
Δ : ⟦P_old⟧ → ⟦P_new⟧
```

A patch is acceptable when:

```text
⟦P_new⟧ refines Spec
AND Δ preserves all non-migrated semantic structure
AND Δ is authorized by the agent capability bundle
```

## Refinement

Refinement means the new program is at least as constrained as the old/spec in the relevant dimensions.

Examples:

| Dimension | Valid refinement | Invalid change |
|---|---|---|
| Behavior | handles more valid inputs | weakens authorization check |
| Effect | narrows side effects | adds DB write to pure validator |
| Capability | requires same or stronger proof | bypasses capability check |
| Resource | lowers mailbox bound | adds unbounded process spawn |
| Cost | preserves p95 envelope | adds per-message O(n) scan |
| Protocol | preserves legal lifecycle | permits execute before checkout |
| Observation | adds telemetry | removes required event |

## Composition algebra

Semantic components compose with domain-specific operators.

| Dimension | Sequential composition | Concurrent/parallel composition |
|---|---|---|
| Behavior | function composition | product / join |
| Effects | ordered effect sequence | effect union with conflict constraints |
| Capability | required capability join | least upper bound of authority |
| Resources | retained/peak resource composition | sum, max, or pool contention model |
| Cost | addition or amortized bound | max plus coordination overhead |
| Protocol | session-type sequencing | interleaving product with constraints |
| Observation | event sequence composition | trace span tree |

## Why this bounds complexity

The system does not enumerate states. Each component has a bounded semantic summary, and composition uses finite operators.

```text
semantic_model_size ≈ components × summary_size
```

Not:

```text
runtime_state_space_size
```

This is the route to tractable autonomous checking.
