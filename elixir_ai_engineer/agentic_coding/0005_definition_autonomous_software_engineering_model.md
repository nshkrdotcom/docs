The **core extraction** is this:

> **Autonomous software engineering requires an executable semantic model of the program, where code is only one projection, tests are another projection, performance is another projection, architecture is another projection, and every projection is checked for consistency against the same underlying structure.**

Or shorter:

> **The center of the machine is not an agent. It is a self-testing program model.**

The LLM is not the center. The test suite is not the center. The source code is not the center. The architecture docs are not the center.

The center is a **typed, executable, multi-projection model of the software system**.

That model must be rich enough to say:

```text
This change is not merely editing Metal code.
It mutates renderer binding topology.
That topology projects into shader ABI, backend portability, hot-path cost,
resource metadata shape, and compatibility limits.
Therefore the required executable projections are:
  - shader ABI check
  - backend matrix check
  - performance envelope check
  - resource-shape check
  - original OOM regression check
```

That is the actual architecture.

---

# The theoretical center

The existing bodies of theory that touch this are:

| Existing field                             | What it contributes                                                      | Why it is insufficient alone                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Formal methods**                         | Rigorous specification and verification                                  | Too expensive / narrow if applied to everything                                           |
| **Abstract interpretation**                | Sound approximation of runtime properties without enumerating all states | Usually focused on program analysis, not full architecture/test generation                |
| **Model-driven engineering**               | Models and transformations between models/code                           | Often too generation-centric and not enough adversarial/self-testing                      |
| **Bidirectional transformations / lenses** | Keeping multiple representations consistent                              | Usually does not encode performance, fault, capability, and runtime-observation semantics |
| **Property-based testing**                 | Executable invariants over large input spaces                            | Needs the invariants and model first                                                      |
| **Model-based testing**                    | Generate tests from behavior models                                      | Behavior alone misses topology, performance, ABI, portability, effects                    |
| **Metamorphic testing**                    | Test relations when exact oracle is hard                                 | Powerful, but needs relation extraction                                                   |
| **Architectural description languages**    | Capture components/connectors/constraints                                | Often too static and disconnected from CI/runtime                                         |

The architecture you are reaching for is the **fusion** of these, but with a specific AI-era purpose: make a codebase **legible, constrained, and falsifiable enough for autonomous modification**.

Abstract interpretation is especially relevant because it explicitly exists to approximate program semantics without enumerating impossible state spaces; Cousot describes program analyzers as programs that automatically answer runtime-property questions, with partial but irrefutable answers because of undecidability/complexity limits. ([NYU Computer Science][1]) Model checking and abstract interpretation are also connected precisely because abstraction is how you fight state explosion and infinite-state systems. ([pcousot.github.io][2])

Bidirectional transformations are also central because you are talking about multiple representations of one system that must stay consistent: source code, specs, tests, diagrams, runtime telemetry, benchmarks, and architectural graphs. The bidirectional-transformation literature frames this as maintaining consistency among related sources of information, across software engineering, databases, programming languages, and documents. ([gsd.uwaterloo.ca][3])

But the missing AI-era addition is:

> These projections cannot merely synchronize. They must **falsify bad changes**.

That is why this is not ordinary model-driven engineering.

---

# The real object: the Program Semantic Graph

The core artifact should be a **Program Semantic Graph**.

Not a diagram. Not documentation. A live graph with executable semantics.

```text
ProgramSemanticGraph =
  Stable identities
  + typed entities
  + typed relations
  + invariant classes
  + projection contracts
  + test obligations
  + performance envelopes
  + effect/capability boundaries
  + runtime observations
  + mutation/falsification corpus
```

Every important thing in the system becomes an object in this graph:

```text
Module
Function
Process
Message
State
Transition
Effect
Capability
Schema
Contract
Hot path
Resource
Backend
ABI
Benchmark
Telemetry event
Failure mode
Invariant
Test obligation
```

The source code is one view. The tests are another view. The runtime traces are another view. The docs are another view.

The system becomes autonomous only when those views are mechanically related.

---

# The phrase I would use

I would call the center:

## Executable Semantic Substrate

Or, more technically:

## A Multi-Projection Program Semantic Graph with Executable Invariants

That is the core extraction.

Your five-tier stack was already pointing at this, but the deeper thing is:

> The tiers are not documents. They are projections of a shared semantic object.

That is the shift.

---

# Why ordinary naming collapses

You are right that naming is a key failure point.

Human naming is semantic compression:

```text
"binding layout"
"router"
"executor"
"pool"
"session"
"capability"
"artifact"
"adapter"
```

But names drift. They accrete meaning. They lie. They collide.

So the system must not trust names as identity.

It needs this split:

```text
Stable identity: deterministic, graph-native, never ambiguous
Surface name: human/LLM-facing label
Alias set: accepted language variants
Projection name: generated name in code/test/docs/telemetry
```

Example:

```yaml
id: renderer.binding.invariant.portable_group_limit
kind: invariant
surface_names:
  - portable bind group limit
  - max backend bind groups
  - shader-visible group ceiling
projection_names:
  elixir_module: Invariants.Renderer.Binding.PortableGroupLimit
  test_file: test/invariants/renderer/binding/portable_group_limit_test.exs
  telemetry_event: [:renderer, :binding, :portable_group_limit, :violation]
  golden_artifact: priv/goldens/renderer/shader_abi/font_render.json
```

The LLM can talk in natural language.

The substrate operates on stable IDs.

That is how you let language remain flexible while keeping the machine deterministic.

---

# The core machine

The architecture looks like this:

```text
                  ┌──────────────────────────────┐
                  │   Program Semantic Graph      │
                  │ stable ids + typed relations  │
                  └──────────────┬───────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        v                        v                        v
┌───────────────┐        ┌───────────────┐        ┌────────────────┐
│ Code          │        │ Tests         │        │ Runtime         │
│ Projection    │        │ Projection    │        │ Projection      │
└──────┬────────┘        └──────┬────────┘        └──────┬─────────┘
       │                        │                        │
       v                        v                        v
┌───────────────┐        ┌───────────────┐        ┌────────────────┐
│ Static checks │        │ Property /    │        │ Telemetry /     │
│ Type checks   │        │ model tests   │        │ trace checks    │
└──────┬────────┘        └──────┬────────┘        └──────┬─────────┘
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                v
                    ┌───────────────────────┐
                    │ Consistency /         │
                    │ Invariant Verifier    │
                    └───────────────────────┘
```

The LLM does not decide correctness.

The LLM proposes graph edits, code edits, tests, and explanations.

The substrate decides whether the projections are consistent.

---

# The invariant is not a sentence

This is the practical breakthrough.

An invariant cannot merely be:

```text
Do not mutate renderer binding topology for local font fixes.
```

That is prose. Useful, but not executable.

An operational invariant must be a bundle:

```yaml
id: renderer.binding.invariant.portable_topology
kind: topology_invariant
scope:
  code:
    - renderer/backend/**
    - shaders/**
  model:
    - renderer.binding.schema
    - renderer.shader_abi.*
statement:
  shader-visible binding topology is portable and globally registered
deterministic_checks:
  - static_no_raw_bind_group_indices
  - shader_reflection_matches_golden_abi
  - backend_schema_equivalence
  - least_capable_backend_limit_check
mutation_tests:
  - inject_bind_group_slot_30
  - add_metal_only_binding_group
  - add_shader_unregistered_group
required_on_patch:
  when_touches:
    - renderer/backend/**
    - shaders/**
```

That is the unit of architecture.

An invariant is:

```text
statement + scope + projection obligations + deterministic checks + mutants
```

Without the checks and mutants, it is not an invariant. It is a hope.

---

# The actual “test coverage” you want

The real coverage metric is not line coverage.

It is:

## Invariant Projection Coverage

For every semantic object:

```text
Does it project into:
  code?
  tests?
  static checks?
  benchmarks?
  telemetry?
  mutation tests?
```

And:

## Invariant Mutation Coverage

For every invariant:

```text
Can the harness kill representative bad changes?
```

Example:

```text
Invariant: no unregistered shader-visible bind group
Mutants:
  add slot 30
  add slot 4
  add Metal-only group
  add raw integer binding
  add shader ABI delta without golden update

Kill rate: 5/5
```

That is how you know the invariant is real.

Metamorphic testing is relevant here because it tests necessary relations across multiple executions when a simple expected-output oracle is hard; that maps directly to architectural relations like “changing a local font OOM case must not change shader ABI” or “same abstract backend schema must normalize across Metal/Vulkan/WebGPU.” ([Fortran Discourse][4])

---

# The center is not full formal verification

This is important.

You are not trying to fully prove the whole program.

That explodes.

You are trying to build **bounded semantic projections**.

Each projection preserves one kind of structure and discards the rest.

Examples:

```text
State projection:
  only state names, transitions, messages, allowed effects

Performance projection:
  only operation, frequency, scale factor, budget, benchmark

Capability projection:
  only actor, operation, proof token, resource, allowed effect

Topology projection:
  only modules, dependencies, supervisors, boundaries

ABI projection:
  only layout, fields, slots, serialization, versioning

Runtime projection:
  only telemetry events, traces, metrics, conformance checks
```

This is exactly the abstract-interpretation move: preserve the property you care about while throwing away impossible detail. The literature’s reason for abstraction is precisely state explosion and the impossibility of exact analysis for large or infinite-state programs. ([pcousot.github.io][2])

So the machine is not omniscient.

It is **selectively exact**.

That is the right target.

---

# The deep principle

A good autonomous codebase must be **semantically compressible**.

Bad system:

```text
Every feature is special.
Every test is bespoke.
Every name is hand-invented.
Every exception is local.
Every performance issue is discovered after the fact.
```

Good system:

```text
Every feature instantiates a small number of semantic patterns.
Every pattern has known projections.
Every projection has checks.
Every check has mutants.
Every runtime observation feeds back into the same model.
```

That is the architecture.

The machine wins not by enumerating all states, but by forcing the program to be expressed through reusable semantic forms.

---

# The finite taxonomy

You need a finite taxonomy of semantic forms.

For an Elixir/OTP substrate, the first-order forms are probably:

```text
Domain entity
Value/schema
Reducer
Command
Query
Effect
Capability
Boundary process
State machine
Supervisor
Worker pool
Adapter
Protocol
Artifact
Runtime observation
Benchmark envelope
Invariant
Mutation
Projection
```

Each form has required projections.

Example:

```yaml
kind: boundary_process
required_projections:
  code:
    - GenServer module
    - public facade
  behavior:
    - state machine
    - message contract
  tests:
    - transition property test
    - crash/restart test
    - call/cast contract test
  effects:
    - declared adapter calls
    - capability requirements
  runtime:
    - telemetry events
    - health checks
  performance:
    - mailbox depth budget
    - call latency p95
    - memory envelope
```

Now autonomous implementation becomes constrained:

> To add a boundary process, instantiate the boundary-process semantic form and satisfy its projections.

That is the practical route.

---

# The morphism part

The word is **morphism**, and it matters.

You want transformations like:

```text
Spec → Architecture
Architecture → Code
Code → Tests
Runtime Trace → Model Update
Patch Diff → Impacted Invariants
```

But they must be **structure-preserving**.

That means if the domain model says:

```text
Operation X requires capability C and emits effect E.
```

Then every projection must preserve that:

```text
Code checks C.
Tests deny X without C.
Telemetry records E.
Docs mention C/E.
Runtime traces can prove C preceded E.
```

If code implements X without capability C, the morphism is broken.

If tests exist but do not check C, the test projection is incomplete.

If telemetry cannot observe E, runtime projection is incomplete.

This gives you a generalized correctness criterion:

```text
A projection is valid if it preserves the invariant-relevant structure of the model.
```

That is the theory.

---

# The AI-era novelty

Traditional MDE often says:

```text
Generate code from models.
```

Your system says:

```text
Generate and continuously falsify all projections from the model.
```

That is different.

It is not just code generation.

It is:

```text
model → code
model → tests
model → benchmarks
model → telemetry
model → mutation corpus
model → static checks
runtime → model
patch → model impact
```

And all of it is checked.

Recent summaries of model-driven engineering still describe model transformations as the backbone for automating movement from high-level models into other artifacts. ([ACM Digital Library][5]) The AI-era extension is that transformations must be adversarially verified, mutation-tested, and runtime-connected.

---

# The “Sebastian case” in this architecture

The bad patch would be represented as a proposed graph edit.

```yaml
patch:
  touches:
    - renderer.backend.metal.binding_layout
    - shaders.font_render
  inferred_model_objects:
    - renderer.binding.schema
    - renderer.shader_abi.font_render
    - renderer.performance.binding_update_hot_path
    - renderer.backend.portability_matrix
```

The graph says:

```yaml
required_invariants:
  - renderer.binding.portable_topology
  - renderer.shader_abi.golden_stability
  - renderer.backend.least_capable_limit
  - renderer.performance.binding_update_envelope
  - renderer.resource.no_global_per_buffer_metadata_growth
```

Then deterministic checks run.

The patch dies because:

```text
slot 30 violates portable topology
Metal diverges from WebGPU/Vulkan
shader ABI golden changed
per-buffer metadata grew
hot-path benchmark regressed
```

Notice the key difference:

The system does **not** need to “know” the patch is ugly in human terms.

It needs to know which **semantic projections** changed and which executable invariants govern those projections.

That is the center.

---

# The architecture as a pipeline

Here is the end-to-end machine:

```text
1. Semantic Registry
   Stores stable IDs, entity kinds, relations, invariant classes.

2. Projection Engine
   Generates/validates code, tests, docs, benchmarks, telemetry contracts.

3. Patch Impact Analyzer
   Maps diffs to semantic objects and required invariants.

4. Invariant Harness
   Runs deterministic checks, property tests, static checks, golden checks.

5. Mutation Harness
   Injects representative bad changes to prove the checks catch them.

6. Runtime Observer
   Maps telemetry/traces back to semantic objects and performance envelopes.

7. LLM Agent
   Proposes model edits, code edits, tests, and repair candidates.

8. Consistency Kernel
   Accepts/rejects changes based on executable projection consistency.
```

The **Consistency Kernel** is the hard center.

Not the LLM.

---

# Consistency Kernel

The kernel decides:

```text
Given:
  model M
  projections P(code, tests, benchmarks, telemetry, docs)
  patch Δ
  runtime evidence R

Accept Δ only if:
  M + Δ is well-typed
  all required projections exist
  all invariant checks pass
  all implicated mutation tests are killed
  all performance/resource deltas are within envelope
  all runtime observation contracts remain satisfiable
```

This is the core rule.

In pseudo-form:

```text
accept(patch) =
  well_typed(model_after(patch))
  ∧ projection_complete(model_after(patch))
  ∧ invariant_preserving(model_before, model_after, patch)
  ∧ mutants_killed(implicated_invariants)
  ∧ benchmarks_within_envelope(implicated_hot_paths)
  ∧ telemetry_contracts_preserved(model_after)
```

That is the center of the machine.

---

# Where the LLM belongs

The LLM is a **search and synthesis engine** around the kernel.

It can propose:

```text
- candidate model objects
- candidate invariants
- candidate tests
- candidate code
- candidate benchmarks
- candidate repairs
- candidate explanations
```

But the LLM never says:

```text
This is correct.
```

The kernel says that.

The LLM is useful because the space of possible invariants/tests/repairs is enormous. But every artifact it proposes must be compiled, executed, mutated, benchmarked, or checked.

This is how you use language without trusting language.

---

# What “hallucinate the architecture” should produce

Here is the concrete architecture I would hallucinate, but grounded:

```text
apps/
  semantic_core/
    lib/
      semantic_core/id.ex
      semantic_core/graph.ex
      semantic_core/entity.ex
      semantic_core/relation.ex
      semantic_core/invariant.ex
      semantic_core/projection.ex
      semantic_core/morphism.ex
      semantic_core/namespace.ex

  projection_engine/
    lib/
      projection_engine/code_projection.ex
      projection_engine/test_projection.ex
      projection_engine/benchmark_projection.ex
      projection_engine/telemetry_projection.ex
      projection_engine/doc_projection.ex
      projection_engine/golden_projection.ex

  invariant_harness/
    lib/
      invariant_harness/registry.ex
      invariant_harness/check.ex
      invariant_harness/static_check.ex
      invariant_harness/property_check.ex
      invariant_harness/contract_check.ex
      invariant_harness/perf_check.ex
      invariant_harness/golden_check.ex
      invariant_harness/coverage.ex

  mutation_lab/
    lib/
      mutation_lab/mutant.ex
      mutation_lab/injector.ex
      mutation_lab/runner.ex
      mutation_lab/kill_report.ex

  patch_lens/
    lib/
      patch_lens/diff_parser.ex
      patch_lens/impact_analyzer.ex
      patch_lens/symbol_mapper.ex
      patch_lens/model_delta.ex

  runtime_observer/
    lib/
      runtime_observer/telemetry_contract.ex
      runtime_observer/trace_mapper.ex
      runtime_observer/envelope_monitor.ex
      runtime_observer/model_feedback.ex

  agent_synthesizer/
    lib/
      agent_synthesizer/invariant_miner.ex
      agent_synthesizer/test_writer.ex
      agent_synthesizer/repair_search.ex
      agent_synthesizer/model_editor.ex
```

The heart modules are:

```text
SemanticCore.Graph
SemanticCore.Invariant
SemanticCore.Projection
PatchLens.ImpactAnalyzer
InvariantHarness.Registry
MutationLab.Runner
ConsistencyKernel
```

I would add a dedicated app:

```text
consistency_kernel/
  lib/
    consistency_kernel/acceptance.ex
    consistency_kernel/proof_bundle.ex
    consistency_kernel/run_plan.ex
    consistency_kernel/verdict.ex
```

Because that is the actual “court.”

---

# The proof bundle

Every autonomous patch must produce a proof bundle.

Not a mathematical proof necessarily. A machine-verifiable evidence package.

```yaml
patch_id: patch_2026_05_05_001
model_delta:
  added:
    - renderer.font.oom_regression_case
  modified:
    - renderer.font.bounds_check
  unchanged_assertions:
    - renderer.binding.schema
    - renderer.shader_abi.font_render
implicated_invariants:
  - renderer.font.no_oom_on_pathological_glyph_run
  - renderer.binding.portable_topology
  - renderer.shader_abi.golden_stability
checks:
  passed:
    - ex_unit.font_oom_regression
    - shader_abi_golden
    - backend_schema_equivalence
    - binding_hot_path_benchmark
mutation:
  killed:
    - add_bind_group_slot_30
    - add_metal_only_binding
    - remove_font_bounds_check
benchmarks:
  binding_update_p95_delta: 0.2%
  frame_time_p95_delta: 0.1%
verdict: accepted
```

That is the artifact an autonomous system needs.

Not “the agent thought it was fine.”

---

# The hard problem: invariant discovery

The truly hard part is not running tests.

The hard part is discovering the right invariants.

That is where LLMs are useful, but they need an adversarial loop:

```text
LLM proposes invariant
→ system demands deterministic check
→ system demands representative mutants
→ system verifies check kills mutants
→ invariant enters registry
```

So an invariant must earn admission.

```text
candidate invariant → executable invariant → mutation-proven invariant
```

This is the way to prevent “architecture prose” from pretending to be safety.

---

# The second hard problem: projection completeness

Given a model object, how do you know you have enough projections?

You define projection contracts by kind.

Example:

```yaml
kind: hot_path_operation
required_projection_contract:
  code:
    required: true
  tests:
    required:
      - functional_regression
      - property_boundary
  benchmarks:
    required:
      - p95_latency
      - allocation_count
      - scale_factor
  telemetry:
    required:
      - duration
      - count
      - error
  mutation_tests:
    required:
      - add_extra_allocation
      - increase_scale_factor
      - bypass_fast_path
```

Now the system can say:

```text
This hot_path_operation lacks allocation-count benchmark.
Projection incomplete.
```

That is how you objectify coverage.

---

# The third hard problem: boundedness

You said something crucial: the representation cannot grow unbounded relative to code/problem complexity.

So the system needs **semantic compression**.

The rules:

1. **Small finite taxonomy of kinds**
2. **Reusable projection contracts per kind**
3. **Stable IDs generated by deterministic namespace rules**
4. **Default invariant bundles per kind**
5. **Mutation templates per invariant class**
6. **Runtime telemetry templates per operation class**

Then adding a new subsystem does not create arbitrary modeling work. It instantiates templates.

Example:

```text
New GenServer boundary process
→ gets default state-machine projection
→ gets message contract tests
→ gets supervision tests
→ gets mailbox/perf envelope
→ gets telemetry contract
→ gets crash recovery mutants
```

This is how complexity stays bounded.

---

# The core taxonomy I would start with

For your Elixir/OTP world:

```text
1. Value
2. Schema
3. Command
4. Query
5. Reducer
6. Effect
7. Capability
8. BoundaryProcess
9. Supervisor
10. Adapter
11. Pool
12. Protocol
13. Artifact
14. HotPathOperation
15. RuntimeObservation
16. Invariant
17. Projection
18. Mutant
```

That is enough to model a lot.

Each kind has required projections.

That is the architecture.

---

# The deeper answer: this is a compiler problem

At the center, you are building a compiler.

But not a compiler from language to machine code.

A compiler from **semantic intent to verified software projections**.

```text
Semantic Model
   ↓ compile
Code
Tests
Benchmarks
Telemetry
Docs
Mutation Corpus
```

The compiler has a type system.

Its type system includes:

```text
effect types
capability types
state types
performance types
resource types
topology types
portability types
projection types
```

That is why naming, architecture, and tests collapse into one thing.

They are all generated/checked artifacts of a typed semantic compiler.

---

# The deepest compressed formulation

Here is the core in one sentence:

> **Build a compiler whose source language is the architecture of the system, whose target languages are code/tests/benchmarks/telemetry/docs, and whose type system is executable invariants over all projections.**

That is the center.

That is the machine.

The LLM becomes a heuristic frontend for editing the source language. The consistency kernel is the compiler/typechecker. The runtime observer is feedback from execution. The mutation harness is the adversary proving the type system catches bad changes.

---

# Final answer

The core extraction is:

## Software must become a typed, executable semantic graph.

Not code plus docs.

A graph.

That graph has stable identities, finite semantic kinds, structure-preserving projections, executable invariants, mutation-proven checks, performance/resource envelopes, and runtime feedback.

Then autonomous AI engineering becomes possible because the agent is no longer operating over free-text instructions and source files. It is operating inside a semantic compiler where every change must preserve the graph’s projection contracts.

The center of the machine is:

```text
Program Semantic Graph
      +
Projection Engine
      +
Consistency Kernel
      +
Mutation/Invariant Harness
```

Everything else — LLMs, agents, prompts, codegen, tests, docs — orbits that.

[1]: https://cs.nyu.edu/~pmc309/publications.www/Cousot-ACM-Computing-Surveys-v28A-n4-Dec-96.pdf?utm_source=chatgpt.com "Program Analysis: The Abstract Interpretation Perspective"
[2]: https://pcousot.github.io/talks/Cousot_Reunion_2000_4-1.pdf?utm_source=chatgpt.com "Abstraction in Program Analysis & Model Checking"
[3]: https://gsd.uwaterloo.ca/sites/default/files/GRACE-report-ICMT09.pdf?utm_source=chatgpt.com "Bidirectional Transformations: A Cross-Discipline Perspective"
[4]: https://fortran-lang.discourse.group/t/about-metamorphic-testing-property-based-tests/2888?utm_source=chatgpt.com "About \"Metamorphic Testing\" (property based tests)"
[5]: https://dl.acm.org/doi/full/10.1145/3712008?utm_source=chatgpt.com "Automation in Model-Driven Engineering: A Look Back, ..."
