# 16 — Normalizer: Turning Working Slop into Smaller Code

## Purpose

The normalizer is a compiler pass for engineering shape.

It takes code that may pass tests and asks:

```text
Can this be made smaller, more local, and more boring without changing behavior?
```

## Normalization phases

```text
1. Extract implementation graph
2. Compute cost
3. Identify rewrite candidates
4. Apply safe rewrite or ask LM to propose rewrite
5. Run evidence
6. Keep rewrite if evidence passes and cost decreases
7. Repeat until no safe reduction remains
```

## First safe rewrites

### Collapse single-implementation behaviour

Before:

```text
CredentialBackend behaviour
CredentialBackend.Local implementation
```

After:

```text
CredentialBackend.Local module only
```

unless boundary seam is declared.

### Replace stateless GenServer with pure module

If:

```text
- state is nil/static
- callbacks only delegate to pure functions
- no lifecycle/resource responsibility
```

then remove process.

### Inline one-call wrapper module

If a module only wraps one function call and has no boundary role, inline.

### Collapse duplicated validators

If multiple modules validate the same entity, consolidate at boundary or constructor.

### Shrink public API

Public functions with one internal caller become private unless contract requires public.

## Unsafe rewrites

Require human or high-confidence LM review:

```text
- changing state ownership
- changing supervision tree
- changing persistence semantics
- changing external API
- changing error contract
- removing adapter boundary with roadmap purpose
```

## Cost function sketch

```yaml
cost_weights:
  module: 1.0
  public_function: 0.4
  stateful_process: 4.0
  supervisor: 2.0
  dynamic_supervisor: 3.0
  registry: 2.0
  behaviour: 2.0
  single_impl_behaviour: 5.0
  undeclared_effect: inf
  boundary_violation: inf
  invented_domain_term: 3.0
  pure_function_bonus: -0.2
  traceability_bonus: -0.5
```

## Compression acceptance

A rewrite is accepted only if:

```text
- format passes
- compile passes
- tests pass
- spec audit passes
- extracted tracked graph is equivalent or intentionally improved
- cost decreases
```

## Role of LM

Use LM to propose rewrites and explain semantic equivalence.

Do not trust the LM's claim of equivalence. Run the evidence.

## Normalizer output

```yaml
normalization:
  candidate: collapse_single_impl_behaviour
  before:
    modules: 5
    behaviours: 1
    public_functions: 16
  after:
    modules: 3
    behaviours: 0
    public_functions: 9
  evidence:
    tests: pass
    spec_audit: pass
  accepted: true
```
