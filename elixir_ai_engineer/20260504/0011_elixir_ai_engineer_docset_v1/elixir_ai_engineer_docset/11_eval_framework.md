# 11 — Evaluation Framework

## Purpose

The Elixir AI Engineer needs evals at every layer, not only tests at the code layer.

The goal is to answer:

```text
Did the process produce acceptable architecture, not merely compiling code?
```

## Eval layers

```text
1. Spec completeness evals
2. Context sufficiency evals
3. Architecture choice evals
4. Implementation graph evals
5. ENF evals
6. Compression evals
7. Evidence evals
8. Reverse-extraction evals
9. Harness evolution evals
```

## 1. Spec completeness eval

Checks:

```text
- all entities defined
- all operation names unique
- all boundary edges declared
- all effects declared
- all state machines have forbidden transitions
- all public contracts have test obligations
- all invariants have enforcement path
```

## 2. Context sufficiency eval

Prompt-independent check:

```text
Can this bundle be implemented without inventing nouns, modules, effects, or boundaries?
```

Failure categories:

```text
missing entity
missing contract
ambiguous runtime shape
missing error algebra
missing effect declaration
missing test obligation
```

## 3. Architecture choice eval

For each major component, compare alternatives.

Example scoring:

| Candidate | Correctness risk | Runtime complexity | Maintainability | Cost |
|---|---:|---:|---:|---:|
| Pure module | low | low | high | low |
| Single GenServer | medium | medium | medium | medium |
| GenServer + ETS | medium | high | medium | high |
| DynamicSupervisor tree | high unless needed | high | low-medium | high |

## 4. Implementation graph eval

Extract:

```text
modules
public functions
calls
uses GenServer/Supervisor/Registry/ETS
external effects
config reads
file/network operations
telemetry emissions
```

Compare to SpecGraph.

## 5. ENF eval

Rejects:

```text
unjustified process
single-implementation behaviour
public API without contract
external effect without declaration
invented domain term
boundary violation
callback complexity over budget
```

## 6. Compression eval

Asks:

```text
Can a lower-cost equivalent implementation pass the same evidence?
```

Metrics:

```text
LOC delta
module delta
public API delta
process delta
behaviour delta
state representation delta
```

## 7. Evidence eval

Runs:

```text
unit tests
property tests
state-machine tests
fault injection
security/adversarial tests
telemetry/audit assertions
```

## 8. Reverse-extraction eval

Classifies code changes:

```text
conforming detail
spec violation
spec omission
implementation bloat
spec refinement candidate
dead behavior
```

## 9. Harness evolution eval

Compares pipeline versions:

```text
accepted candidates per token
frontier model calls per accepted component
module bloat ratio
normalization delta
human review defects
runtime failure rate
spec drift rate
```

## Benchmark tiers

```text
Tier 0: toy pure functions
Tier 1: state transitions
Tier 2: single GenServer boundary
Tier 3: supervised component
Tier 4: credentialed connector slice
Tier 5: multi-component vertical slice
Tier 6: multi-tenant/1:N stress slice
```

## Key benchmark metric

```text
Accepted-normal-form code, not first-pass code.
```

Report:

```yaml
benchmark_result:
  task: credential_lease_registry
  naive_ai:
    loc: 842
    modules: 11
    genservers: 3
    behaviours: 2
    tests: pass
    enf: fail
  harness_output:
    loc: 267
    modules: 4
    genservers: 1
    behaviours: 0
    tests: pass
    enf: pass
  compression_delta: 68_percent
```

## Why this matters

Without evals, all architecture claims are vibes.

With evals, you can say:

```text
This harness reduces AI-generated Elixir bloat while preserving behavior.
```
