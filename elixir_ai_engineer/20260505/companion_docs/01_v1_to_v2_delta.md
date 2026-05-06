# v1 to v2 Delta

## Summary

v1 established the Living Substrate as a graph-projected, adversarially tested, self-normalizing engineering harness.

v2 adds the control theory of software change:

```text
executable architecture + semantic types + intervention graph + control oracle
```

The result is a substrate that does not merely accept code. It governs interventions.

## Core differences

| v1 | v2 |
|---|---|
| Living feedback substrate | Intervention-aware executable architecture substrate |
| Five living graphs | Program Semantic Graph plus projection, access, intervention, capsule, and history views |
| Context bundles constrain LM work | Context bundles plus type/control oracles bound valid move space |
| ENF as evolving policy | ENF split into stable core, project policy, experimental rules, and exception ledger |
| StackLab adversary tests accepted code | StackLab mutation-tests invariants, semantic types, and known-bad patches |
| AccessGraph governs credentials/capabilities | AccessGraph governs read/modify/execute/delegate across code and credentials |
| Acceptance gate/state | Consistency Kernel plus proof bundle and living acceptance state |
| Normalizer compresses code | Normalizer reduces mechanism while preserving semantic denotation |
| Reports as output | Proof bundles and intervention outcomes as product |
| Architecture as graph projection | Architecture as controllability over interventions |

## The new center

v2 shifts the center from:

```text
Can the generated code be accepted?
```

to:

```text
Can bounded operators steer this system through expected interventions
with bounded context, bounded blast radius, bounded cost, observability,
and reversibility?
```

## The deepest new primitives

### Program Semantic Graph

A typed graph of software meaning:

```text
Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

### Type Oracle

Answers what valid morphisms exist for a task before code is written.

### InterventionGraph

Tracks possible and historical changes, including expected scope, actual scope, proof obligations, prediction error, rollback path, and outcome.

### Control Oracle

Answers how to steer the system safely through an intervention.

### Consistency Kernel

Determines accept/reject verdicts without calling an LLM.

### Proof Bundle

A machine-verifiable package of semantic delta, checks, mutants, benchmarks, evidence, normalization, and lineage.

## Practical consequence

The v2 system should reject a patch not merely because a test fails, but because the proposed change is the wrong kind of intervention.

Examples:

```text
local timeout fix -> local SessionPool repair
not -> global capability-kernel rewrite

local connector bug -> connector adapter repair
not -> credential-fabric policy mutation

stateless validation -> pure module
not -> GenServer + Registry + DynamicSupervisor
```
