Yes. That pivot is right.

The goal is **not**:

> “Can the agent reason like Sebastian?”

The goal is:

> “Can the system reduce Sebastian’s judgment into deterministic invariants, generated tests, type checks, static checks, perf gates, and compatibility gates such that the agent cannot land the bad repair?”

The LLM can help **discover and propose tests**, but the final arbiter must be programmatic.

So the architecture becomes:

```text
Human/expert judgment → invariant catalog → generated checks → deterministic gates
LLM reasoning → proposes candidate invariants/tests → never acts as final judge
```

The key is turning “this smells wrong” into **testable variance constraints**.

---

# Core reframing: invariants as variance bounds

In this renderer case, “badness” is not one thing. It is several forms of unauthorized variance:

| Variance dimension           | Bad change                                         |
| ---------------------------- | -------------------------------------------------- |
| Binding topology variance    | Adds bind group slot 30                            |
| Backend portability variance | Metal diverges from Vulkan/WebGPU assumptions      |
| Shader ABI variance          | Shader-visible resource contract changes           |
| Hot-path cost variance       | Adds per-buffer metadata or lookup overhead        |
| Memory-layout variance       | Per-buffer data expands globally                   |
| Scope variance               | Local font fix mutates global backend architecture |
| Instruction variance         | Violates local repo instructions                   |
| Test coverage variance       | Fix does not add regression/perf/compat tests      |

So instead of saying:

> “Don’t make dumb architecture changes.”

You say:

> “For this subsystem, these dimensions of variance are bounded. Any patch exceeding those bounds must fail deterministic checks.”

That is the test-driven version.

---

# What coverage means here

Normal coverage asks:

```text
Did tests execute this line/branch?
```

That is too weak.

For autonomous AI systems, coverage has to mean:

```text
Did deterministic checks cover every declared invariant that could be violated by this kind of change?
```

So you need **invariant coverage**, not just code coverage.

Example:

```yaml
invariant: renderer.bind_groups.max_portable_slots
covered_by:
  - static_shader_layout_test
  - backend_capability_matrix_test
  - bind_group_slot_linter
  - cross_backend_compile_test
```

A patch touching renderer bindings is not adequately tested unless all relevant invariant checks ran.

---

# The needed artifact: an invariant registry

You need a machine-readable registry of invariants.

Something like:

```yaml
invariants:
  renderer.binding.max_portable_bind_groups:
    domain: renderer
    severity: critical
    applies_to:
      paths:
        - src/renderer/backend/**
        - shaders/**
    property:
      kind: numeric_bound
      value: 4
    checks:
      - type: static_ast
        command: mix test test/invariants/renderer/binding_slots_test.exs
      - type: shader_reflection
        command: mix run tools/check_shader_bind_groups.exs
      - type: backend_matrix
        command: mix test test/compat/backend_matrix_test.exs
    failure_message: >
      Renderer bind group count exceeded portable backend limit.
      Do not add backend-specific bind slots for local subsystem fixes.
```

This registry is the bridge between expert judgment and deterministic enforcement.

The LLM can author or update this registry, but CI enforces it.

---

# The test stack you actually need

For this kind of failure, one test type is not enough. You need a layered test system:

```text
1. Static structural checks
2. Type / schema checks
3. Contract tests
4. Cross-backend compatibility tests
5. Golden shader ABI tests
6. Hot-path performance tests
7. Differential tests
8. Mutation / adversarial tests
9. Invariant coverage checks
```

The important part is that each layer catches a different failure mode.

---

# 1. Static structural checks

These catch forbidden shapes before runtime.

For the renderer example:

```text
Fail if:
  - bind group index > portable maximum
  - magic slot number appears
  - backend-specific slot appears in shared shader ABI
  - Metal backend defines resource layout not represented in backend matrix
  - shader includes unauthorized binding namespace
```

This could be implemented with:

* AST checks
* shader reflection
* grep-like checks only for narrow literal bans
* semantic parser checks
* custom Credo checks
* custom Mix tasks

A simple version:

```elixir
defmodule Invariants.Renderer.NoMagicBindGroupSlotsTest do
  use ExUnit.Case

  @portable_max_bind_groups 4

  test "shader and backend code do not reference bind group slots above portable limit" do
    files =
      Path.wildcard("src/renderer/**/*.{ex,exs,metal,glsl,wgsl,hlsl}")
      |> Enum.reject(&String.contains?(&1, "test/fixtures"))

    offenders =
      for file <- files,
          line_with_index <- File.read!(file) |> String.split("\n") |> Enum.with_index(1),
          {line, line_no} = line_with_index,
          slot <- extract_bind_group_slots(line),
          slot >= @portable_max_bind_groups do
        {file, line_no, slot, line}
      end

    assert offenders == []
  end

  defp extract_bind_group_slots(line) do
    Regex.scan(~r/(?:bind_group|group|slot)\s*[\(\[=:]\s*(\d+)/, line)
    |> Enum.map(fn [_, n] -> String.to_integer(n) end)
  end
end
```

That is crude, but even crude checks would have caught `slot 30`.

A better version uses AST/shader reflection instead of regex.

---

# 2. Type and schema checks

The renderer binding layout should be a typed artifact, not ad hoc numbers.

Instead of:

```rust
slot = 30
```

You want something like:

```rust
enum PortableBindGroup {
    Frame = 0,
    Material = 1,
    Draw = 2,
    Dynamic = 3,
}
```

Then tests enforce exhaustiveness:

```text
No raw bind group integers outside the typed enum.
No backend may introduce an unregistered bind group.
No shader may reference a group absent from the registry.
```

In Elixir terms, this maps to a schema module:

```elixir
defmodule Renderer.BindingSchema do
  @allowed_groups %{
    frame: 0,
    material: 1,
    draw: 2,
    dynamic: 3
  }

  def allowed_groups, do: @allowed_groups

  def valid_group_index?(index) do
    index in Map.values(@allowed_groups)
  end
end
```

Then invariant tests assert all backends and shaders conform to that schema.

The point is:

> **The architecture has to become data.**

Once it is data, tests can enforce it.

---

# 3. Contract tests

Contract tests assert that every backend implements the same abstract binding contract.

Example contract:

```yaml
renderer.backend.binding_contract:
  groups:
    frame: 0
    material: 1
    draw: 2
    dynamic: 3
  forbidden:
    - backend_private_shader_visible_bind_groups
  required_properties:
    - same_group_count_across_backends
    - same_shader_visible_layout_across_backends
```

Then tests:

```elixir
defmodule Renderer.BackendBindingContractTest do
  use ExUnit.Case

  alias Renderer.BindingSchema

  @backends [:metal, :vulkan, :webgpu]

  test "all backends expose exactly the portable binding schema" do
    expected = BindingSchema.allowed_groups()

    for backend <- @backends do
      actual = backend_binding_schema(backend)
      assert actual == expected
    end
  end
end
```

This catches:

```text
Metal has slot 30, Vulkan/WebGPU do not.
```

---

# 4. Cross-backend compatibility tests

This is where the bad patch would fail hard.

Every shader/resource layout should compile or reflect against each backend target:

```text
font shader × Metal
font shader × Vulkan
font shader × WebGPU
```

The test is not “does Metal compile?” It is:

```text
Does the shader ABI fit the least-capable declared backend?
```

A compatibility matrix test:

```yaml
targets:
  - metal
  - vulkan
  - webgpu

portable_limits:
  max_bind_groups: 4
  max_dynamic_buffers: N
  max_storage_buffers: N
```

Then:

```text
For every shader:
  reflect bindings
  normalize layout
  assert layout <= portable limits
  assert layout compatible with every target
```

The important thing is **least common denominator enforcement**.

---

# 5. Golden shader ABI tests

This is extremely important.

You snapshot the shader ABI as a golden artifact:

```json
{
  "shader": "font_render",
  "bind_groups": {
    "0": ["FrameUniforms"],
    "1": ["MaterialParams"],
    "2": ["GlyphAtlas"],
    "3": ["DynamicDrawParams"]
  }
}
```

Then CI compares the current reflected ABI to the golden ABI.

Any unexpected ABI delta fails:

```text
Shader ABI changed:
  added group 30: BufferSizes
```

This is deterministic and brutal.

It does not require the agent to understand graphics. It only requires the invariant:

> Shader ABI is stable unless intentionally updated through the ABI update flow.

For autonomous mode, you can allow the LLM to propose a golden update, but only if all downstream compatibility and perf gates pass.

---

# 6. Performance invariant tests

Performance tests should not be broad vibes. They should be bound to hot-path invariants.

Example:

```yaml
invariant: renderer.binding.hot_path_no_extra_per_buffer_metadata
metric:
  name: bind_group_update_ns_per_buffer
  max_regression_percent: 2.0
benchmark:
  command: cargo bench renderer_binding_update
```

Or:

```yaml
invariant: renderer.frame.no_binding_layout_regression
metric:
  name: frame_time_p95_ms
  max_regression_percent: 1.0
```

For the bad change, you want tests that measure:

```text
- per-buffer binding update cost
- per-frame renderer overhead
- shader layout reflection cost
- memory overhead per buffer
- number of resource descriptors per draw/model
```

The key is to treat performance as a contract:

```text
Hot path performance may vary only within declared bounds.
```

Not “run benchmarks sometimes.”

---

# 7. Differential tests

Run old and new behavior against the same scenarios.

For renderer/backend architecture:

```text
Before patch:
  reflected ABI
  draw call count
  bind group count
  descriptor count
  memory per buffer
  frame benchmark

After patch:
  same metrics
```

Then assert allowed deltas.

Example invariant:

```yaml
allowed_deltas:
  bind_group_count: 0
  shader_visible_binding_groups: 0
  per_buffer_metadata_bytes: 0
  draw_call_count: 0
  p95_frame_time: "+1%"
```

This would catch the global mutation even if functionality worked.

---

# 8. Mutation tests / adversarial tests

This is how you get closer to autonomy.

You intentionally generate bad patches and ensure the invariant suite catches them.

For this case, synthetic bad mutations include:

```text
- Add bind group slot 30
- Add backend-only Metal binding
- Add per-buffer metadata field
- Increase bind group count to 5
- Add shader-visible size buffer
- Add raw integer binding slot
- Add unregistered binding group
```

Then the test suite must fail.

This gives you a real metric:

```text
Invariant suite caught 7/7 known bad renderer binding mutations.
```

That is the coverage you actually want.

Not line coverage.

**Invariant mutation coverage.**

---

# 9. Invariant coverage checks

This is the meta-test.

Given a patch, determine which invariants are implicated.

Example:

```text
Patch touches:
  src/renderer/backend/metal/bindings.*
  shaders/font_render.*
```

The system computes:

```text
Required invariant checks:
  renderer.binding.max_portable_bind_groups
  renderer.binding.cross_backend_schema
  renderer.shader_abi.font_render_golden
  renderer.hot_path.binding_update_benchmark
  renderer.backend.webgpu_compatibility
```

Then it fails if those checks did not run.

This prevents the agent from “fixing” the issue with only a narrow font test.

---

# The full test-driven autonomous loop

The autonomous agent workflow should be:

```text
1. Fault observed
2. LLM proposes fault model
3. System maps touched areas to invariant registry
4. LLM proposes regression tests
5. Deterministic system validates test relevance
6. Agent writes failing test first
7. Agent writes candidate patch
8. Static/type/contract/perf/compat checks run
9. Mutation coverage suite runs for implicated invariants
10. Patch accepted only if all deterministic checks pass
```

The LLM is useful in steps 2, 4, and 7.

The deterministic system owns steps 3, 5, 8, 9, and 10.

---

# The “test first” form of this incident

A proper autonomous agent facing the font OOM should first add a failing regression test like:

```text
Given a pathological glyph run / buffer size condition,
font rendering rejects or handles the input without OOM,
without changing shader ABI,
without increasing bind group count,
without adding per-buffer hot-path metadata.
```

That test is not just:

```text
does not OOM
```

It is:

```text
does not OOM while preserving architectural invariants
```

That is the missing piece.

The regression test should include negative assertions:

```text
assert no shader ABI change
assert no new bind groups
assert no backend divergence
assert no hot-path metadata expansion
assert no perf regression above threshold
```

This is the conversion from expert judgment into tests.

---

# Concrete invariant suite for the renderer example

Here is the suite I would want.

## A. Binding topology invariant

```text
All shader-visible bind groups must be registered in the portable binding schema.
No bind group index may exceed the declared portable maximum.
```

Catches slot 30.

## B. Cross-backend schema invariant

```text
Metal, Vulkan, and WebGPU backend binding schemas must normalize to the same abstract layout.
```

Catches Metal-only hack.

## C. Shader ABI golden invariant

```text
The reflected ABI of each shader must match the golden ABI unless an explicit ABI migration artifact is updated.
```

Catches hidden shader compatibility break.

## D. Hot-path metadata invariant

```text
Resource buffer structs used in the render loop may not gain per-buffer fields without memory and benchmark approval.
```

Catches extra size data.

## E. Least-capable backend invariant

```text
All renderer features must satisfy the minimum limits of the declared backend support matrix.
```

Catches WebGPU/Vulkan slot incompatibility.

## F. Repair locality invariant

```text
A regression in subsystem X may not modify global backend topology unless a failing test demonstrates local repair impossibility.
```

This one is harder but still partially testable through path/scope analysis.

## G. Original bug regression

```text
Pathological font rendering case no longer OOMs.
```

Catches the actual bug.

The point is that **G alone is dangerous**. You need A–F around it.

---

# How to make “repair locality” deterministic

This is the hardest one, but you can approximate it programmatically.

Define subsystem ownership:

```yaml
subsystems:
  font_rendering:
    paths:
      - src/renderer/text/**
      - shaders/font/**
    allowed_dependencies:
      - renderer.binding.readonly_schema
      - renderer.buffer_allocator.public_api
    forbidden_mutations:
      - renderer.backend.binding_layout
      - renderer.cross_backend_abi
```

Then a patch for a `font_rendering` issue can be checked:

```text
If issue label/domain = font_rendering
and patch modifies renderer.backend.binding_layout
then require:
  - explicit architectural migration test set
  - compatibility matrix update
  - benchmark suite
  - ABI migration artifact
```

In fully autonomous mode, you do not ask a human. You make the system prove the broader change is necessary through tests.

The agent must produce evidence like:

```text
All local repair candidates fail the original regression test or violate another invariant.
Only contract-level change passes all constraints.
```

That is difficult, but it is at least a deterministic target.

---

# The role of the LLM in generating tests

The LLM should be used as an **invariant miner**.

Given:

```text
- code diff
- architecture docs
- AGENTS.md
- recent failure
- existing tests
- subsystem graph
```

Ask it to produce:

```yaml
candidate_invariants:
  - name
  - rationale
  - deterministic check strategy
  - files implicated
  - failure examples
  - minimal test implementation
```

But then a deterministic harness validates:

```text
Does the test compile?
Does it fail on known bad mutation?
Does it pass on main?
Does it cover the touched artifact?
Does it avoid snapshotting irrelevant noise?
```

So the LLM can propose tests, but tests earn trust by catching mutations.

---

# The better metric: invariant mutation score

For each invariant, keep a set of generated bad mutations.

Example:

```yaml
invariant: renderer.binding.max_portable_bind_groups
mutants:
  - add_group_4
  - add_group_30
  - metal_only_group
  - raw_integer_slot
  - shader_unregistered_group
required_kill_rate: 100%
```

Then run:

```text
mix invariant.mutate renderer.binding.max_portable_bind_groups
```

Expected:

```text
5 mutants generated
5 mutants killed
0 survived
```

Now you have an objective metric:

> The test suite detects this class of architectural violation.

That is much better than hoping an agent has taste.

---

# For your architecture: name this layer

I would call it:

## Invariant Harness

Or more specifically:

## Variance-Bounded Test Harness

Its job:

```text
Convert architectural judgment into executable constraints.
```

Components:

```text
Invariant Registry
Patch Impact Analyzer
Test Synthesizer
Static Check Runner
Contract Test Runner
Golden Artifact Checker
Benchmark Gate
Mutation Harness
Invariant Coverage Reporter
```

---

# Suggested structure in an Elixir/BEAM stack

Something like:

```text
apps/
  stack_lab/
    lib/
      stack_lab/invariants/
        registry.ex
        invariant.ex
        impact_analyzer.ex
        coverage.ex
        mutation_runner.ex
        benchmark_gate.ex
        golden.ex
        static_check.ex
        contract_check.ex

      stack_lab/patch/
        diff_parser.ex
        touched_symbol_graph.ex
        subsystem_classifier.ex

      stack_lab/checks/
        credo/
        dialyzer/
        ex_unit/
        shader_reflection/
        perf/
```

Invariant behavior:

```elixir
defmodule StackLab.Invariant do
  @callback id() :: atom()
  @callback applies_to?(StackLab.Patch.t()) :: boolean()
  @callback required_checks() :: [StackLab.Check.t()]
  @callback mutants() :: [StackLab.Mutant.t()]
end
```

Example:

```elixir
defmodule Invariants.RendererPortableBindGroups do
  @behaviour StackLab.Invariant

  def id, do: :"renderer.binding.max_portable_bind_groups"

  def applies_to?(patch) do
    StackLab.Patch.touches_any?(patch, [
      "src/renderer/backend/",
      "shaders/"
    ])
  end

  def required_checks do
    [
      {:static, "mix test test/invariants/renderer/no_magic_slots_test.exs"},
      {:contract, "mix test test/invariants/renderer/backend_binding_contract_test.exs"},
      {:golden, "mix run tools/check_shader_abi.exs"},
      {:compat, "mix test test/compat/webgpu_limits_test.exs"}
    ]
  end

  def mutants do
    [
      {:add_bind_group_slot, 30},
      {:add_bind_group_slot, 4},
      {:metal_only_binding_group, 30},
      {:shader_unregistered_group, 30}
    ]
  end
end
```

That is the shape.

---

# The hard truth

You will not get to “100% autonomous” by making the LLM smarter alone.

You get there by making the codebase increasingly **self-describing and self-falsifying**.

Meaning:

```text
The system knows what properties must not vary.
The system knows which tests prove those properties.
The system knows when a patch touches those properties.
The system knows whether the tests were strong enough to catch bad mutations.
```

That is autonomy-compatible.

---

# The essential design rule

For every architecture rule, require four things:

```text
1. Statement
2. Scope
3. Deterministic check
4. Mutation that proves the check works
```

Example:

```yaml
statement: No shader-visible bind group may exceed portable backend limits.
scope: renderer backend bindings and shaders.
check: shader reflection + static slot check + backend matrix test.
mutation: inject bind group slot 30 into Metal font shader path.
```

If an invariant lacks a deterministic check, it is not yet an operational invariant. It is only design prose.

---

# The final answer

Your pivot is correct:

> The agent does not need a moral lecture about architecture.
> It needs a test harness where architectural variance is executable.

The core move is:

```text
Expert taste → invariants
Invariants → deterministic checks
Checks → mutation-tested coverage
Patch impact → required invariant suite
LLM → proposes tests and repairs
CI/harness → decides truth
```

So in the Sebastian-style failure, the system should not rely on the agent “knowing” slot 30 is bad.

It should have deterministic tests proving:

```text
slot 30 cannot appear,
Metal cannot diverge from WebGPU/Vulkan,
shader ABI cannot change silently,
hot-path per-buffer metadata cannot grow silently,
and a font OOM regression cannot be fixed by mutating global renderer binding topology.
```

That is the autonomous path: not better guardrails, but **programmatic invariant coverage with mutation-tested proof that the invariant tests actually catch the bad class of change**.
