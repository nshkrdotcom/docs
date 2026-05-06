**On universality first:** the ontology is universal because the tuple is architectural, not linguistic.

⟦P⟧ = (B, E, R, C, O) — behavior, effects, resources, cost, observability — these categories exist above the language layer. What varies per language is the *projection engine* — how you derive tests from the semantic type. The semantic type definition for `PortableBackendABI` doesn't care if the implementation is C++, Elixir, or Rust. The type is architectural. The test emission is a mechanical adapter. One ontology, N projection backends. This is actually load-bearing — if the ontology were language-specific you'd have to re-derive it for every platform and you'd lose composability across polyglot systems.

---

**Aaltonen's specific problem.** His platform is C++ host + HLSL/MSL/WGSL shaders + Metal/Vulkan/WebGPU backends. The semantic type that should have existed:

```
BindingArchitecture : PortableBackendABI {
  backends: [Metal, Vulkan, WebGPU]
  max_shader_visible_bind_groups: 4   // WebGPU hard limit, load-bearing
  abi_delta_requires_explicit_migration: true
  hot_path_descriptor_growth: 0
  backend_schema: equivalent_across_backends
  cost: O(draws), not O(draws × buffers)
}
```

The Codex patch fails this type on four dimensions simultaneously — slot 30 violates the group limit, per-buffer metadata violates descriptor growth zero, Metal-only violates backend equivalence, and the scale factor changes from O(draws) to O(draws × buffers). That's not a style violation. That's four type errors.

The projection engine for this platform — no exotic tooling required — derives:

- **Static shader scan:** parse all shader source, assert no `[[group(N)]]` or `binding(set=N)` where N > 3. This is a regex over shader text. Trivial.
- **Cross-backend compilation test:** compile the same shader against all three backends via their respective compilers, compare reflection output for structural equivalence.
- **ABI golden snapshot:** serialize the binding layout descriptor and diff against committed baseline. Any structural change requires an explicit migration declaration.
- **Scale factor property test:** drive the renderer with increasing draw counts vs increasing buffer counts, assert cost grows with draws not buffers.
- **Mutation test:** inject slot 30, verify the static scan catches it.

None of this requires a novel type system in C++. It requires the semantic type definition to exist as a first-class artifact — a YAML or DSL file that the projection engine reads — and a CI step that runs the derived checks. The consistency kernel is just: does the implementation satisfy all projections of its declared semantic type?

The Codex failure happened because none of this existed. The binding architecture's constraints lived in Aaltonen's head, not in a machine-readable semantic type. The fix isn't better prompting or AGENTS.md. It's making the architectural contract a typed artifact that the projection engine can enforce mechanically, independent of whether the author is a human, Codex, or anything else.

