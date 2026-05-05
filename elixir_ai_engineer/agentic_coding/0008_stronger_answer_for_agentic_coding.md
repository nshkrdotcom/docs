Below is the stronger answer I would give.

---

# The sharper answer

The solution to the original poster’s problem is not “better AI code review,” and it is not merely “more performance tests.”

The solution is **executable architecture**:

> Architecture documents should compile into semantic types, capabilities, protocol constraints, performance envelopes, generated tests, generated benchmarks, mutation suites, and runtime observation contracts.

The AI agent should not be operating over source code plus prose. It should be operating inside a typed semantic space where the allowed changes are queryable before code generation and mechanically enforced afterward.

The Codex bind-group-slot-30 failure is a perfect example. The agent did not merely write bad Metal code. It attempted a morphism that was invalid for the renderer’s architecture:

```text
Font-rendering repair
  ⟶ global renderer binding topology mutation
  ⟶ shader ABI expansion
  ⟶ backend portability break
  ⟶ hot-path resource/cost profile change
```

That should not be a reviewer comment. It should be a type error.

---

# 1. The universal ontology

You do **not** want a separate ontology for every language or platform. That explodes.

You want a universal ontology of software semantic kinds, with platform-specific type libraries.

The universal ontology is:

```text
Semantic Program Ontology
  ├─ Identity
  ├─ Value / Schema
  ├─ Operation
  ├─ Effect
  ├─ Capability
  ├─ Resource
  ├─ Cost
  ├─ Protocol / Ordering
  ├─ State
  ├─ Boundary
  ├─ Topology
  ├─ ABI / Contract
  ├─ Portability Constraint
  ├─ Observation
  ├─ Invariant
  ├─ Projection
  └─ Mutation
```

Then each domain instantiates those categories.

For a GPU renderer:

```text
Operation      = bind, draw, dispatch, upload, compile shader
Effect         = GPU command emission, buffer write, descriptor update
Capability     = modify font pipeline, modify backend ABI, modify shader ABI
Resource       = bind group, descriptor, buffer, argument buffer, shader slot
Cost           = draw overhead, frame p95, descriptor update cost, memory traffic
Protocol       = render_pass → bind_pipeline → bind_resources → draw
ABI            = shader-visible binding layout
Topology       = backend abstraction, render graph, binding architecture
Portability    = Metal / Vulkan / WebGPU compatibility matrix
Observation    = shader reflection, GPU capture, perf counters, benchmarks
Invariant      = max bind groups, ABI stability, hot-path resource bounds
```

For Elixir/OTP:

```text
Operation      = call, cast, handle_info, supervise, checkout, execute
Effect         = DB write, file IO, network call, sandbox action
Capability     = invoke tool, mutate artifact, access session, cross memory tier
Resource       = process, mailbox, ETS table, connection, token, sandbox
Cost           = latency, reductions, queue depth, memory, restart pressure
Protocol       = session lifecycle, GenServer message ordering, handoff protocol
ABI            = message schema, API contract, provider protocol
Topology       = supervision tree, dependency graph, AccessGraph
Portability    = provider/runtime/backend matrix
Observation    = telemetry, traces, health checks, event logs
Invariant      = HLC monotonicity, capability preservation, bounded mailbox growth
```

Same ontology. Different semantic type libraries.

That is the right abstraction boundary.

---

# 2. Performance is a first-class semantic type

The core type form should not be:

```text
Input -> Output
```

It should be:

```text
Input -> Output @ Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

So a renderer binding operation has a type like:

```text
BindingUpdate :
  DrawStream(n)
  -> GPUCommandBuffer
  @ {
    effects:
      - emit_gpu_commands
      - bind_registered_resources_only

    resources:
      shader_visible_bind_groups ≤ 4
      per_buffer_metadata_delta = 0
      descriptor_growth_delta = 0

    cost:
      asymptotic = O(draws)
      hot_path_allocation_delta = 0
      p95_regression ≤ 1%

    protocol:
      render_pass_started before bind_resources
      bind_pipeline before draw
      no shader_abi_delta without migration

    portability:
      Metal ≡ Vulkan ≡ WebGPU after binding-schema normalization

    observation:
      shader_reflection_required
      backend_matrix_check_required
      binding_update_benchmark_required
  }
```

The bad Codex patch does not satisfy that type.

It tries to introduce:

```text
shader_visible_bind_group = 30
per_buffer_metadata_delta > 0
Metal-only binding schema
shader ABI delta
unknown hot-path cost delta
```

So the verdict is:

```text
type error: attempted patch does not inhabit BindingUpdate semantic type
```

This is stronger than “the benchmark failed.”

The benchmark is only one projection of the cost type. The structural resource violation is visible before measurement.

---

# 3. Repair scope is really an agent capability type

This is the most important correction.

“Repair scope” should not be modeled merely as “these files may or may not be touched.”

It should be modeled as a **capability bundle on the agent**.

For the font OOM issue, the agent should receive something like:

```text
CapabilityBundle<FontOOMRepairAgent> =
  Read:
    - RendererWide
    - BindingArchitecture
    - ShaderABI
    - BackendPortabilityMatrix

  Modify:
    - FontPipeline
    - GlyphBufferValidation
    - FontShaderLocalLogic
    - FontAllocatorLocalPolicy

  ForbiddenModify:
    - PortableBackendABI
    - RendererBindingTopology
    - GlobalBufferDescriptorShape
    - CrossBackendShaderABI
```

This is not just a file permission system. It is an **architectural capability type**.

The agent can read the renderer-wide binding architecture because it needs context. But it cannot modify that architecture under a font-rendering repair capability.

If it wants to modify binding topology, it must request a different capability:

```text
CapabilityBundle<RendererABIMigrationAgent>
```

That bundle would require a completely different proof obligation:

```text
- backend compatibility matrix update
- shader ABI migration
- golden ABI update
- cross-backend reflection normalization
- hot-path benchmark migration
- mutation suite update
```

This unifies the GPU case and the OTP case.

In the GPU renderer:

```text
capability = may modify font pipeline, may not mutate backend ABI
```

In OTP:

```text
capability = may modify session checkout logic, may not mutate capability derivation or memory-tier boundary
```

Same structure.

This connects directly to access graphs:

```text
Agent
  ──has_capability──▶ Modify(FontPipeline)
  ──has_read_edge────▶ Read(RendererWide)
  ──lacks_edge───────▶ Modify(PortableBackendABI)
```

So locality is not a heuristic. It is a typed access relation.

---

# 4. The type system must be queryable, not just enforcing

A normal checker says:

```text
You wrote a patch.
It failed.
```

That is reactive.

The stronger architecture is a **type oracle**:

```text
Given this intent and this capability bundle,
what valid morphisms are available?
```

Before generating code, the agent queries:

```text
Intent:
  Fix font-rendering OOM

Capability:
  FontOOMRepairAgent

Question:
  What valid repair morphisms exist?
```

The oracle returns:

```text
Valid morphism space:
  1. Add local glyph-run bounds validation
  2. Add CPU-side preflight size check
  3. Use existing metadata channel for buffer size
  4. Fix glyph atlas allocation/lifetime bug
  5. Add local font shader guard preserving existing ABI

Invalid under current capability:
  - add new shader-visible bind group
  - modify PortableBackendABI
  - add Metal-only binding slot
  - add per-buffer global metadata
  - mutate renderer-wide descriptor layout
```

This is the difference between:

```text
type checker
```

and:

```text
type oracle
```

For autonomous coding, the oracle matters more than the checker.

The agent should generate *inside* the valid morphism space, not discover after the fact that it generated an invalid patch.

---

# 5. The original renderer fix should be expressed as a morphism problem

The valid patch is not “any code that stops the OOM.”

It is:

```text
Find Δ such that:

Δ : RendererState_old -> RendererState_new

where:

RendererState_new refines RendererState_old
with respect to:
  - FontOOMSafety improved
  - PortableBackendABI preserved
  - ShaderABI preserved
  - HotPathCostType preserved
  - BackendPortability preserved
  - AgentCapabilityBundle respected
```

In more concrete terms:

```text
accept(Δ) =
  fixes(FontOOM)
  ∧ preserves(PortableBackendABI)
  ∧ preserves(ShaderABI)
  ∧ preserves(HotPathCostEnvelope)
  ∧ preserves(BackendPortability)
  ∧ respects(FontOOMRepairAgent.capabilities)
  ∧ satisfies(RuntimeObservationObligations)
```

The slot-30 patch fails at least four clauses:

```text
violates PortableBackendABI
violates ShaderABI
violates HotPathCostEnvelope
violates agent modify capability
```

That is why the system should reject it.

---

# 6. The bootstrap problem: semantic types must earn authority

The hard part is not only enforcing semantic types.

The hard part is validating the semantic type definitions themselves.

If the LLM translates architecture prose into the wrong semantic type, the entire downstream system becomes confidently wrong.

So semantic types need their own test discipline.

Every semantic type must ship with:

```text
1. known-good inhabitants
2. known-bad non-inhabitants
3. mutation suite
4. projection checks
5. historical incident tests
```

Example:

```yaml
id: renderer.binding.portable_abi
known_good:
  - local font bounds check
  - glyph atlas allocation fix
  - CPU-side preflight validation
  - use existing dynamic metadata slot

known_bad:
  - inject bind group slot 30
  - add Metal-only shader-visible binding
  - add per-buffer size metadata globally
  - increase shader-visible group count above portable limit
  - mutate font shader ABI without migration

must_reject:
  - slot_30_metal_patch
  - metal_only_buffer_size_binding
  - global_buffer_descriptor_growth

must_accept:
  - local_font_bounds_check
  - existing_metadata_path_fix
```

Then the semantic type checker itself is tested:

```text
semantic type accepts known-good repairs
semantic type rejects known-bad repairs
semantic type-generated tests kill representative mutants
```

This is the meta-layer.

The type earns authority by surviving its own mutation suite.

Without this, “semantic type” is just a more formal hallucination.

---

# 7. Runtime observation is not just telemetry; it is calibration

The denotation of a program should include observations:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

But `Observation` is not merely:

```text
emit telemetry event
```

It is the feedback channel between declared cost semantics and runtime reality.

For example:

```text
Declared:
  BindingUpdate.p95_regression ≤ 1%
  AllocationDelta = 0
  DescriptorGrowth = 0

Observed:
  p95 regression = 6%
  allocation count unchanged
  descriptor count unchanged
```

That means the structural type did not catch everything. Maybe cache behavior changed. Maybe command buffer ordering changed. Maybe driver behavior differs.

The feedback loop should be:

```text
observation anomaly
  → classify semantic gap
  → propose cost-type refinement
  → confirm/refute
  → update semantic type
  → regenerate projections
  → add mutation/regression case
```

So the runtime system is not just monitoring. It is calibrating the semantic model.

The loop is:

```text
Static semantic type
  → generated benchmark
  → runtime observation
  → anomaly
  → candidate type refinement
  → updated semantic type
  → regenerated checks
```

This prevents the cost type from drifting away from hardware reality.

---

# 8. Composition must include ordering, not just resource union

The previous answer under-specified this.

For GPU systems, composition is not commutative.

This is valid:

```text
begin_render_pass
  ∘ bind_pipeline
  ∘ bind_resources
  ∘ draw
  ∘ end_render_pass
```

This is not:

```text
bind_resources
  ∘ begin_render_pass
  ∘ draw
```

So the semantic type needs protocol/order structure.

This is where **session types** become relevant.

A render command stream has a protocol type:

```text
RenderPassProtocol =
  BeginRenderPass
    ; BindPipeline
    ; BindResources*
    ; Draw+
    ; EndRenderPass
```

A backend binding update is not just an operation with resource cost. It is a term in a protocol.

So the type should include:

```text
Protocol:
  operation ordering
  allowed repetition
  required preconditions
  forbidden interleavings
  lifecycle boundaries
```

For OTP, this maps directly:

```text
SessionProtocol =
  CreateSession
    ; AttachCapabilities
    ; CheckoutWorker
    ; Execute*
    ; CheckinWorker
    ; CloseSession
```

Same ontology again.

GPU command buffers and OTP processes are different platforms, but both need ordered protocol types.

---

# 9. Cross-backend shader reflection is a real engineering subsystem

You cannot handwave “backend schema equivalence.”

For a real renderer, this is hard.

Metal, Vulkan, and WebGPU do not expose the same reflection path:

```text
Metal:
  MSL / metallib
  argument buffers
  Metal reflection APIs

Vulkan:
  SPIR-V bytecode
  descriptor sets / bindings
  SPIRV-Cross or SPIR-V reflection

WebGPU:
  WGSL
  bind groups / bindings
  naga / tint / custom reflection path
```

So the architecture needs a normalization layer:

```text
Backend-specific reflection
  → Common Binding IR
  → Normalized Portable ABI
  → Equivalence check
```

The Common Binding IR might look like:

```yaml
shader: font_render

bindings:
  - group: 0
    binding: 0
    kind: uniform_buffer
    visibility: vertex_fragment
    semantic_id: frame_uniforms

  - group: 1
    binding: 0
    kind: sampled_texture
    visibility: fragment
    semantic_id: glyph_atlas

  - group: 3
    binding: 0
    kind: dynamic_uniform_buffer
    visibility: vertex
    semantic_id: dynamic_draw_params
```

Then the check is:

```text
normalize(MetalReflection(font_render))
  ≡ normalize(VulkanReflection(font_render))
  ≡ normalize(WebGPUReflection(font_render))
  ≤ PortableBackendABI
```

The slot-30 patch shows up as:

```yaml
- group: 30
  binding: 0
  kind: storage_buffer
  semantic_id: buffer_sizes
  backend: metal_only
```

Then it fails:

```text
group 30 ∉ PortableBackendABI
backend-specific shader-visible binding forbidden
```

This is not trivial tooling. It is a real product subsystem.

---

# 10. What the original poster should build first

If I were giving Sebastian’s team a practical implementation path, I would not say “build a dependent type system.”

I would say: build the first executable architecture slice around renderer binding semantics.

## Phase 1: Architecture manifest

Create:

```text
architecture/
  renderer/
    portable_backend_abi.yaml
    shader_abi_manifest.yaml
    backend_limits.yaml
    hot_path_cost_types.yaml
    agent_capabilities.yaml
```

## Phase 2: Common Binding IR

Build:

```text
tools/shader_reflect/
  metal_to_binding_ir
  spirv_to_binding_ir
  wgsl_to_binding_ir
  normalize_binding_ir
  compare_binding_ir
```

## Phase 3: Generated checks

Generate:

```text
- no unregistered bind groups
- no backend-only shader-visible bindings
- no ABI delta without migration
- no per-buffer metadata growth in hot path
- no hot-path allocation/hash lookup regression
- backend layout equivalence
```

## Phase 4: Type oracle

Before Codex writes code, it queries:

```text
semoracle valid-morphisms \
  --intent fix_font_oom \
  --capability FontOOMRepairAgent \
  --domain renderer.font
```

Oracle returns valid repair classes.

## Phase 5: Mutation suite

Inject:

```text
- bind group slot 30
- Metal-only binding
- shader ABI change
- per-buffer global metadata
- descriptor growth
- command ordering violation
```

CI must kill all mutants.

## Phase 6: Runtime calibration

Every benchmark anomaly opens a semantic refinement path:

```text
observed regression
  → new cost-type hypothesis
  → generated mutant/check
  → updated semantic type
```

That is executable architecture in practice.

---

# 11. How this applies to your platform too

For your BEAM/agent substrate, the equivalent is:

```text
AgentCapabilityBundle<ExecutionAgent> =
  Read:
    - SpecGraph
    - AccessGraph
    - ProviderRegistry

  Modify:
    - ProposalDraft
    - LocalImplementationPlan
    - TestProjection

  ForbiddenModify:
    - CapabilityDerivationRules
    - MemoryTierBoundary
    - ProvenanceTokenFormat
    - RuntimeAuthKernel
```

A patch to a local provider adapter cannot mutate global capability derivation.

That is the same as the font-rendering agent not being allowed to mutate backend binding topology.

For OTP, the semantic type might be:

```text
CapabilityCheckedOperation :
  Input
  -> Output
  @ {
    required_capability: C,
    proof_token: Π(action),
    effects: declared_only,
    ordering: HLC_monotonic,
    resource: mailbox_growth_bounded,
    cost: p95 ≤ envelope,
    observation: telemetry_required
  }
```

The generated projections are:

```text
- ExUnit contract tests
- StreamData property tests
- custom Credo checks
- Dialyzer/spec checks where useful
- telemetry assertions
- Benchee or load benchmark gates
- mutation tests that remove capability checks or break HLC monotonicity
```

Same universal ontology. Different platform type library.

---

# 12. The improved product category

“Semantic CI” is good but too narrow.

The sharper category is:

## Executable Architecture

Definition:

> Architecture specifications that compile into capabilities, semantic types, generated tests, generated benchmarks, generated telemetry contracts, mutation suites, and type-oracle guidance for autonomous agents.

The product is not a linter.

It is not a test generator.

It is not an AI reviewer.

It is a system where architecture becomes executable.

The slogan:

```text
Architecture that enforces itself.
```

Or more technical:

```text
Cost-refined semantic types for autonomous software engineering.
```

---

# Final improved answer

To solve the original poster’s problem:

1. **Model renderer architecture as executable semantic types**, not prose.
2. **Make performance/resource shape part of the type**, not a post-hoc benchmark.
3. **Represent repair scope as a typed agent capability bundle**, not just a file-scope rule.
4. **Give the agent a type oracle** so it can query the valid morphism space before generating code.
5. **Normalize shader/backend reflection into a Common Binding IR** so Metal/Vulkan/WebGPU equivalence is mechanically checkable.
6. **Generate deterministic checks, benchmarks, telemetry obligations, and mutation tests from the semantic types.**
7. **Validate the semantic types themselves with known-good/known-bad patches and mutation testing.**
8. **Use runtime observations to calibrate and refine cost types over time.**

Then the Codex slot-30 patch fails cleanly:

```text
Rejected:
  agent lacks Modify(PortableBackendABI)
  group 30 ∉ PortableBackendABI
  Metal schema no longer normalizes with Vulkan/WebGPU
  ShaderABI<font_render> changed without migration
  HotPathOperation<BindingUpdate> resource shape changed
```

That is the answer.

The agent does not need to be a senior graphics engineer.

It needs to operate inside **executable architecture** where the senior graphics engineer’s architectural judgment has been compiled into semantic types, capabilities, protocols, cost envelopes, and mutation-proven checks.
