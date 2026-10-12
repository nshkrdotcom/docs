# Elixir/BEAM library landscape — what to adopt, study, or refuse

**Research checked:** 2026-10-11. Versions and public interfaces listed below come from the linked source documentation; package compatibility and throughput are not validated in this blueprint. "Adopt" means a deliberate integration experiment before lock-in, not blind trust.

## Recommended architecture-level selection

| Library / capability | Why it matters | Integration mode | Priority | Concern / validation |
|---|---|---|---|---|
| [Reach](https://github.com/elixir-vibe/reach) | Program dependence graph, call/control/data flow, effects, OTP/process relations, change/impact checks, JSON reports | Analysis adapter inside independent library | **P0** | Performance, macro resolution, dynamic calls, version pinning, report provenance |
| [ExAST](https://github.com/elixir-vibe/ex_ast) | AST-aware diff/search, source symbols and references, structural matches | Analysis adapter / source diff | **P0** | Symbol identities, source span fidelity, generated code, unresolved aliases |
| [Sourceror](https://github.com/doorgan/sourceror) | Source-preserving AST with positions and comments | Surgical fallback to align ranges | **P1** | Don't duplicate ExAST, don't store every AST node |
| Built-in [`mix xref`](https://hexdocs.pm/mix/Mix.Tasks.Xref.html) | Cheap dependency cross-check and built-in graph facts | Validation / fallback | **P1** | Module vs function granularity |
| [ElixirSense](https://github.com/elixir-lsp/elixir_sense) | Definitions, completion and navigation primitives | Optional local definitions adapter | **P1–P2** | Runtime/compiler context needed, macro behavior, API compatibility |
| [ElixirLS](https://github.com/elixir-lsp/elixir-ls) | LSP navigation/diagnostics, later DAP | External integration not a hard engine dependency | **P2** | Process/service lifecycle; LSP is not trace correlation |
| [Boundary](https://github.com/sasa1977/boundary) | Human-declared architectural dependency rules | Optional declared-intent importer | **P1** | Requires project opt-in; architectural intent not business intent |
| ArchTest | Architecture assertions, if current package chosen and verified | Optional policy import | **P2** | Distinguish from unrelated Rust `arch_test` results; verify exact Elixir package before adoption |
| [ExDoc](https://hexdocs.pm/ex_doc/) | Existing docs, source links, module grouping | Read documents/symbol metadata | **P1** | Docs express authored intent, not inferred invariant truth |
| [libgraph](https://github.com/bitwalker/libgraph) | Generic graph traversal and simple algorithms | In-memory bounded neighborhood | **P1** | Old rework actually uses it; avoid unbounded centrality cost |
| [Exograph](https://github.com/elixir-vibe/exograph) | Persisted structural code facts and query ideas, UI search inspiration | Study/query prototype only | **P2** | Storage overlap with Ash; current GitHub About says Postgres/ParadeDB while main README discusses DuckDB/QuackDB — do not silently assume a single backend |
| [Ash](https://hexdocs.pm/ash/) | Resource/domain/actions/relationships/authorization | Backend durable app semantics | **P0** | Not raw trace store; no engine dependency |
| [AshSqlite](https://hexdocs.pm/ash_sqlite/) | Local-first persistence | Initial backend data layer | **P0** | Lacks some AshPostgres features, including aggregates; concurrent write transaction behavior differs |
| [AshPostgres](https://hexdocs.pm/ash_postgres/) | More capable deployed relational persistence | Future backend alternative | **P2** | Don't code to Postgres-only features in v1 without need |
| [AshJsonApi](https://hexdocs.pm/ash_json_api/) | Optional standardized JSON:API/OpenAPI routes | Evaluate for CRUD resource exposure | **P2** | Investigation API is task-oriented, not merely generated CRUD |
| [Phoenix](https://hexdocs.pm/phoenix/) | Router, HTTP, Channels, WebSockets, optional LiveView | API server and admin/diagnostic app | **P0** | API and TS UI may use distinct origins |
| [Phoenix LiveView](https://hexdocs.pm/phoenix_live_view/) | Excellent server-rendered admin/diagnostic screens | Optional backend-origin console | **P2** | Not automatically "headless" to TS: LiveView is HTML/live DOM protocol |
| [Telemetry](https://github.com/beam-telemetry/telemetry) | Application/library events, instrumented signals | Optional capture/ingestion source | **P1–P2** | Not arbitrary GenServer state or all messages |
| OTP 27+ [`trace`](https://www.erlang.org/docs/27/apps/kernel/trace.html) | Trace sessions for calls, messages, process events | Optional bounded recording | **P2** | Production overhead, multi-node fan-in, permissions |
| [`seq_trace`](https://www.erlang.org/docs/27/apps/kernel/seq_trace.html) | Causal information-transfer tracing local and remote | Experiment for causal Cinema | **P2** | Requires activation/tokens; each node collects its local events; not ETS causality |
| [`:sys.get_state`](https://www.erlang.org/docs/27/apps/stdlib/sys.html) | Debug retrieval of OTP process current state | Controlled snapshot experiment | **P2** | May perturb system; not historical state |
| [Redbug](https://github.com/massemanet/redbug) | Bounded tracing ergonomics | Design reference / possible adapter | **P2** | Verify current compatibility, do not adopt unrestricted trace configuration |
| [LiveDebugger](https://github.com/software-mansion/live-debugger) | LiveView callbacks, component tree, assigns | Study interaction and integration pattern | **P2** | Dev-only by upstream guidance; Phoenix-specific |
| [PhoenixReplay](https://github.com/elixir-vibe/phoenix_replay) | Session recording/replay and state deltas for LiveView | Reference implementation | **P2** | Specific replay boundaries and limitations |
| [OpenTelemetry for Erlang/Elixir](https://opentelemetry.io/docs/languages/erlang/) | Trace/span context across service boundaries | Optional import and runtime context | **P2** | Application spans != BEAM message graph |
| ExUnit, [StreamData](https://github.com/whatyouhide/stream_data), Mox | Unit, property, integration and behavior testing | Throughout | **P0** | Trace fixture oracle and false-positive tests are more important than broad coverage percentages |
| [Blitz](https://hex.pm/packages/blitz) | Multiple independent Mix projects, parallel test/compile, impact CI | Root workspace tooling | **P0** | Confirmed v0.4.1 current Hex README, *not* a distributed job queue |

## Reach — the most compelling analyzer

As checked, [Reach's README](https://github.com/elixir-vibe/reach) describes a dependence graph for Elixir, Erlang, Gleam, JavaScript and TypeScript. That is **broader than the initial Elixir-focused plan**; our UX can remain BEAM-native while source facts include language tags. The documented version family was `~> 2.8`, with examples of `mix reach.map`, `mix reach.inspect`, `mix reach.trace`, `mix reach.check`, `mix reach.otp`, and `--format json` for tooling. [Reach.Project v2.8.4](https://reach.hexdocs.pm/Reach.Project.html) provides `from_mix_project/1`, `from_glob/2`, and `from_sources/2`.

**Important dependency distinction:** Reach's README shows `only: [:dev, :test], runtime: false` for projects using Reach as developer tooling. If ElixirScope loads Reach directly during API requests or background indexing, that configuration would make no sense in a deployed runtime. We must select an installation mode based on whether the analyzer executes in the engine, a dev process, or a separate worker, and test deployment packaging accordingly.

Proposed adapter outputs, normalized independently of Reach internals:

- `Symbol` and `SourceRange` references with revision and language.
- Bounded `Relation` edges annotated with evidence/provenance.
- `EffectCandidate` locations and source-to-sink paths.
- `ImpactNeighborhood` containing radius/filter/limits and skipped-edge reasons.
- OTP behavior/supervision evidence, clearly marked static and potentially incomplete.
- `AnalysisDiagnostic` for macro/dynamic-dispatch limitations.

**Acceptance experiment:** two real repositories (one Phoenix/Ash, one OTP-heavy), plus a simple Erlang/Gleam fixture. Test that impact results are useful and source links exact, not simply that Reach emits JSON.

## ExAST — changed function, not changed filename

[ExAST README](https://github.com/elixir-vibe/ex_ast) documents structural search, AST-aware diff, `ExAST.Symbols.definitions/1`, `ExAST.Symbols.references/1` and symbol qualified names. As checked, example version family `~> 0.13`. It is especially attractive for matching semantic changes when text moves, comments change, or a function relocates.

Normalize ExAST outputs into **revision-specific symbols**, never use a symbol's qualified name as an immutable cross-revision unique identifier by itself. Cross-revision matching is a separate process; macros, function head clauses and generated code require explicit ambiguity handling. Direct calls into `ExAST` in prod likewise require prod inclusion, not blindly copying its CLI-only dev installation example.

## LSP and compiler metadata: helpful but not the product

ElixirSense/ElixirLS can improve go-to-definition, references, diagnostics and type-like hints. They cannot establish full runtime causality or historical state. Do not build and maintain an LSP server as a prerequisite; adapt to existing protocols only after Reach/ExAST prove insufficient.

The built-in `mix xref` and `Code`/BEAM compile metadata can cross-validate facts cheaply, but compiled metadata may not reflect the exact Git revision under review, and debug info can be absent.

## Architecture and intent tools

Boundary is valuable because its restrictions reflect an engineer's *declared* architecture. Do not confuse that with authoritative product intent. Tests, docs, `@spec`, OTP behavior contracts and manually linked requirements are useful evidence. An LLM may propose labels and review questions but must label them hypotheses.

## Capture-related tools

The 2025 monolith tried to build much of the capture engine itself. We should first leverage OTP `trace` sessions, `seq_trace`, `:telemetry`, `:sys`, bounded Redbug-like approaches, and existing Phoenix-specific instrumentation. Compile-time AST rewriting is justified only for targeted value/branch capture not available through safer primitives, and must preserve source semantics and change behavior as little as measurable.

## Library evaluation template

For every dependency, capture: checked version/commit, supported Elixir/OTP versions, licensing, maintenance signal, API stability, representative fixture, source correlation fidelity, failure modes, transitive deps, runtime cost, ability to remove, and integration-owner. A library is not adopted until it passes one product-specific experiment.
