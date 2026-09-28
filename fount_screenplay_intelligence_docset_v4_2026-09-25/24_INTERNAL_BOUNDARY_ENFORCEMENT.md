# Internal Boundary Enforcement

## 1. Purpose

The four-package architecture intentionally keeps pure dramatic reasoning and imperative orchestration inside one `fount_intelligence` Mix application.

That is acceptable only if the internal dependency direction is mechanically enforced from the beginning.

The goal is **not** to prove mathematical purity for arbitrary Elixir. The goal is to make the prohibited architectural shortcuts hard to introduce and easy to detect.

## 2. Namespace zones

### Pure zone

```text
Fount.Intelligence.StoryWorld.*
Fount.Intelligence.Temporal.*
Fount.Intelligence.Reader.*
Fount.Intelligence.Diagnosis.*
Fount.Intelligence.Capabilities.*   # pure evaluators/reducers only
```

### Shell zone

```text
Fount.Intelligence.Acquisition.*
Fount.Intelligence.Playbooks.*
Fount.Intelligence.Runner.*
Fount.Intelligence.Persistence.*
Fount.Intelligence.Reporting.*
```

Observe should similarly keep provider-neutral leaf contracts distinct from execution/provider namespaces.

## 3. Pure-zone rule

Pure code receives explicit values and returns explicit values.

Typical signatures:

```elixir
compile_story_world(canonical, observations, opts)
reduce_reader(reader_state, checkpoint_inputs, opts)
evaluate_diagnosis(state, concern, opts)
query_character_state(story_world, event_ref, opts)
```

Hidden acquisition is forbidden.

If required evidence is missing, pure code returns a typed evidence requirement/gap. The shell decides whether/how to acquire it.

## 4. Forbidden pure dependencies

Pure code may not depend on required semantic behavior from:

```text
Fount.Observe execution/provider/cache facades
Fount.Intelligence shell namespaces
Fount.Repo or Ecto.Repo execution
Inference
HTTP/network clients
filesystem I/O
runtime environment/config reads
wall clock as hidden semantic input
randomness as hidden semantic input
process-global mutable caches
GenServer calls required for semantic correctness
```

Pure code may depend on an explicit allowlist of Observe leaf value/contract modules, for example:

```text
Fount.Observe.Observation
Fount.Observe.MeasurementResult
Fount.Observe.Distribution
Fount.Observe.EvidenceRef
Fount.Observe.Context primitives where a pure function legitimately receives them
```

Keep the allowlist small.

## 5. Why one tool is not enough

### `boundary`

Useful for nested logical boundaries and allowed exports/dependencies inside an application. It is well suited to preventing Core -> Shell calls.

It is not a universal side-effect checker; external OTP-app dependencies are permitted by default unless separately constrained.

### `mix xref`

Useful for compile/export/runtime dependency analysis and recompilation/coupling inspection. Struct use is an export dependency, which means an allowed Observe contract reference can be distinguished from some runtime dependencies when the architecture checker interprets the graph.

`xref` alone does not know which runtime call is semantically forbidden.

### Source/AST scanning

Useful for a small explicit set of forbidden MFAs, but not a complete proof. Alias/import/capture/macro/dynamic-call behavior makes a tiny generic denylist insufficient as the sole mechanism.

Therefore use layers.

## 6. Required Phase-1 architecture gate

Phase 1 retains the existing requirement to add a repository-owned architecture gate. Do not split or defer the phase because of this document.

The implementation should prefer the simplest combination verified against the actual toolchain/source.

A stable workspace alias should exist, for example:

```bash
mix fount.architecture
```

and/or be included in the repository's standard CI alias.

The offline implementation agent writes the gate but does not claim it ran. Runtime QC executes and repairs it.

## 7. Layer A — nested logical boundaries

Where compatible, define strict internal boundaries in `fount_intelligence` such as:

```text
Fount.Intelligence.Core
  StoryWorld
  Temporal
  Reader
  Diagnosis
  pure capability evaluators

Fount.Intelligence.Shell
  Acquisition
  Playbooks
  Runner
  Persistence
  Reporting
```

Core may not depend on Shell.

Observe should expose a leaf contract/value surface and separate execution/provider internals.

A boundary library is appropriate when it fits the current Elixir/workspace APIs; do not force it if runtime QC shows it fights the repository layout. The invariant matters more than one dependency choice.

## 8. Layer B — compiled dependency graph checks

The architecture task should inspect compiler/xref/BEAM dependency information and verify at least:

### Physical package graph

```text
fount -> no observe/intelligence/workshop dependency
observe -> fount, provider SDKs; no intelligence/workshop
intelligence -> fount + observe; no workshop/inference
workshop -> fount + intelligence + inference; no fount_probe
```

### Pure-zone graph

- Core cannot depend on Shell modules.
- Core can reference only allowlisted Observe contract/value modules.
- Core cannot have runtime/compile/export dependencies on Observe execution/provider/cache modules.
- Core cannot depend on Repo/Inference/network implementation modules.

### Coupling health

Inspect `mix xref` compile/export/runtime relationships for accidental compile-time waterfalls. Record unexpected compile-connected relationships in QC.

The gate may use generated xref JSON and/or BEAM import/dependency chunks as appropriate to the actual toolchain.

## 9. Layer C — targeted forbidden-MFA checks

Because module-boundary tools do not express every hidden nondeterministic input, add a narrow checker for explicitly forbidden calls from pure source/modules.

Examples:

```text
Application.get_env/fetch_env used as semantic input
System.get_env
File read/write/open APIs
DateTime.utc_now or equivalent wall-clock acquisition
:rand APIs
Repo query/write APIs
Fount.Observe.measure/acquire execution APIs
```

The implementation may inspect source AST or compiled imports.

Requirements:

- account for aliases/imports as far as practical;
- keep the forbidden list explicit and reviewed;
- do not advertise this checker as a general purity theorem prover;
- allow targeted exceptions only with documented rationale and an explicit pure substitute/input path.

## 10. Layer D — deterministic replay/property tests

For fixed inputs and options:

```text
same input -> same semantic output
```

Test:

- repeated execution equality;
- frozen Observation fixture replay;
- deterministic IDs derived from content/source rather than random generation;
- no semantic timestamps inserted by reducers;
- unordered collection normalization where required;
- no environment-dependent defaults;
- no provider/Repo/cache handles required by core APIs.

Do not globally stop dependency OTP applications inside ordinary parallel tests as the primary proof of purity. That can interfere with unrelated tests and proves less than dependency checks.

## 11. Reader forward-leak gate

Required property family:

1. compute reader snapshots through discourse point N;
2. mutate material after N;
3. recompute;
4. snapshots through N remain identical if their analytical inputs are unchanged.

Moving a reveal earlier should alter only the appropriate presentation suffix from its new position forward.

## 12. Story-time correctness gate

Pure temporal/story-world tests must also cover:

- flashbacks do not inherit future diegetic state merely because they are later on the page;
- unknown story ordering remains unknown;
- simultaneous/overlapping events do not require fabricated order;
- base-story state is not silently merged with dream/hypothetical/alternate scope;
- causal direction remains independent of story-time/presentation order;
- supported temporal contradictions are detected while ambiguous cases abstain.

## 13. Multi-pass acquisition gate

The shell may perform:

```text
observe
-> pure reduce/query
-> build validated Observe context
-> observe
-> pure reduce/diagnose
```

Pure structs may not store provider clients, repos, caches, acquisition callbacks, or hidden services.

Context crossing back to Observe uses provider-neutral Observe contracts, never Intelligence structs.

## 14. Compile-time footprint gate

To reduce cascading rebuilds:

- Observe contract modules remain leaf-like;
- no provider macros/types leak into Intelligence;
- no Observe execution macros are required in pure core;
- provider-specific types normalize immediately;
- xref compile-connected statistics are monitored during QC;
- public Observe contract modules should not depend transitively on provider execution modules.

## 15. Persistence gate

Pure-zone source cannot invoke Repo/Ecto query execution.

Persistence is shell-only and receives explicit adapters/repos where practical.

Database integration tests belong to shell/persistence test groups, not reducer tests.

## 16. Sandbox gate

Every playbook integration test must run with `Fount.Observe.Sandbox` or equivalent fixture acquisition without real provider credentials.

Live provider tests remain separately tagged/excluded according to repository convention.

A playbook that cannot run deterministically with canned measurements has leaked provider behavior into the wrong layer.

## 17. Probe/compatibility gates

After direct Probe supersession:

- no production module/dependency refers to `FountProbe` / `:fount_probe`;
- no compatibility wrappers/delegators remain;
- no old-shape readers or numeric compatibility-schema machinery is introduced.

Avoid naïve filename grep as the only test; false-positive domain text can exist in docs/tests.

## 18. Architecture report in every runtime handoff

Record:

```text
physical package graph
Core/Shell boundary status
Observe contract allowlist status
forbidden-MFA status
Probe-remnant scan
compatibility-code scan
xref compile/export/runtime observations
Sandbox tests
deterministic replay tests
reader forward-leak tests when relevant
story-time correctness tests when relevant
```

An architecture-gate failure blocks phase completion just like a compile/test failure.

## 19. Extraction trigger

If the pure core later gains genuine independent consumers, publishing/deployment requirements, or repeatedly cannot remain clean inside the application despite mechanical boundaries, it may be extracted into its own package.

That is a future evidence-based decision, not part of this implementation program.
## Phase 16 final compiled boundary result — 2026-09-27

The final source audit passed 16/16 checks and `mix ci` compiled architecture scanned 297 source files with zero violations at Fount `6becd6e8a753df7709d7c47e169cf9f4496d88d1`. Warnings-as-errors compilation, strict Credo, Dialyzer and ExDoc passed. The resolved production tree places SystemOneSDK `~> 0.6.0` under Observe and direct Inference `~> 0.5.0` plus ASM `~> 0.17.1` under Workshop; ASM is absent as an Observe/Intelligence analysis dependency. Full evidence is in `handoffs/PHASE_16_RUNTIME_QC_REPORT.md`.
