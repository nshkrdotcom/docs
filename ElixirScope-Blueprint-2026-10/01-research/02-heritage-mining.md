# Three source snapshots: archaeological findings, salvage list, and rejection list

## Status discipline

The source materials include AI-generated PRDs and status reports with contradictory claims of completion and benchmark performance. They are **not independent verification**. File presence, internal API shape and explicit `:not_implemented` source facades carry more weight than broad "production ready" prose. We did not compile either historical repository in the current environment; there was no local Elixir/Mix runtime.

### Snapshot inventory

| Supplied snapshot | Included file entries | Distinctive value | Caveat |
|---|---:|---|---|
| Atlas notes (`234441`) | 10 | Investigation-first semantics, concept of System Score, mechanisms/intent/evidence, rich BEAM-specific view ideas and UX critiques | Research/notes, not working code |
| Old ElixirScope monolith (`234709`) | 610 | 191 library files, ~81 test files, test apps including PhoenixScopePlayer/Cinema, AST repository, capture code, runtime correlator, TemporalBridge, CFG/DFG/CPG experiments | Interlocking, incomplete and inconsistent components; documentation often overclaims readiness |
| Later ElixirScope rework (`235118`) | 511 | Clearer dependency boundaries, published Foundation idea, libgraph-based graph implementation and extensive reference source history | 475 entries under `docs`; only 17 `lib/` files; upper layer facades return `:not_implemented` |

## High-value concepts to keep

**1. Question-driven investigation rather than one global graph.** Atlas `0006.md` and `0007.md` change the basic product from universal hierarchical semantic ontology to evidence-supported question answering. This is essential: globally index facts, load local projections.

**2. Cross-representation cursor / System Score.** Atlas `0001.md`, `0002_not_beam_specific_distsys_debug.md` and `0003.md` articulate process lanes, state, messages, supervision, time and source as synchronized views. The time-aware BEAM-native interface deserves revival, but not the former promise of omniscient replay.

**3. Intent vs observed behavior.** Atlas `0006a.md` explicitly distinguishes what code does, what it was designed to do and what it should do; business intent must be supplied or inferred and reviewed, not extracted as fact.

**4. Static–dynamic separation.** `docs/archive/development_history/docs_local/STATIC_DYNAMIC_CORRELATOR.md` in the rework emphasizes that static analysis should have no runtime dependency; a correlator joins static and dynamic evidence. We keep the dependency direction, simplify the modules.

**5. Typed source ↔ runtime anchor.** Old ASTRepository parser and instrumentation mapper proposed AST node IDs, runtime correlation IDs and source spans. Keep the *join capability*, but use revision-aware IDs and typed provenance. The older code uses in-run identifiers in places and should not be treated as long-term stable cross-version anchors.

**6. OTP-aware modeling.** Supervisor parent/child structure, callbacks, GenServer state, messages, restarts and logical role must be first-class. Atlas `0003.md` provides a richer catalogue than generic trace viewers.

**7. TemporalBridge ideas, but not its reconstruction semantics.** The old code stores/query events, correlates them and exposes time selectors. However, `TemporalBridge` replay maps captured local/state fields into a collapsed accumulator rather than proving complete BEAM state. We retain normalization and indexing, explicitly discard omniscient reconstruction claims.

**8. Capture-performance discipline.** Old ring buffer, writer pool, ingestor and instrumentation runtime files show serious attention to bounds, async ingestion and backpressure. Keep the principles: capture budgets, bounded buffers, drop accounting, offline recording, graceful failure; do not automatically reuse an unvalidated custom lock-free implementation.

**9. Saved investigation/movie.** The old test apps include `PhoenixScopePlayer`, playback LiveView, session generator, fixture data under `test_apps/phoenix_scope_player/priv/captured_data`. The portable source+events+metadata+annotations recording is a good product unit, even with runtime tracing absent.

**10. Structural/impact/context projections.** CFG/DFG/CPG experiments, `Graph` wrapper, module clustering, dependency importance, pathfinding are useful *questions* to expose. Reach and existing algorithms should implement them unless a demonstrated gap remains.

**11. Generated minimal behavioral counterexample.** Atlas `0006.md` proposes aligning a reduced failing execution, process timeline and exact source. This may be a signature feature when paired with property-based tests and captured runs. First support manually supplied recorded counterexamples; automatic shrinking later.

**12. Dependency boundaries and modularity.** The 2025 rework attempted a unified package plus external Foundation. The hard-won insight is separating pure code analysis from runtime and interface; but a giant Foundation dependency was itself too heavy for our new narrow wedge.

## Salvage matrix by source path

| Source | What to extract | What not to transplant |
|---|---|---|
| `lib/elixir_scope/ast_repository/parser.ex` (old monolith) | Source spans, node mapping concerns, test constructs | All enhanced AST schema variants and unstable node identity assumptions |
| `lib/elixir_scope/ast_repository/instrumentation_mapper.ex` | Probe location/correlation idea | Tight coupling to old capture pipeline |
| `lib/elixir_scope/ast_repository/enhanced/{cfg_generator,dfg_generator,cpg_builder}` | Elixir-specific fixtures for guards, matches, `with`, `case`, exception branches | Parallel static analyzer stack when Reach covers need |
| `lib/elixir_scope/ast_repository/query_builder*` | Desired query classes, test names | Custom SQL-like query language |
| `lib/elixir_scope/capture/{temporal_bridge,temporal_storage,event_correlator}` | Event fields, playback operations, bound queries | Claims of arbitrary historical reconstruction |
| `lib/elixir_scope/capture/{ring_buffer,async_writer,ingestor}` | Backpressure/drop/budget tests | Benchmark claims without rerunning, self-made lock-free primitives |
| `test_apps/phoenix_scope_player/` | Recorded session demo shape, timeline source annotation UX | Whole Phoenix app or separate rendering stack |
| `test_apps/cinema_demo/` | Small OTP scenarios and failure fixtures | Marketing claims of production readiness |
| `docs/archive/development_history/docs_local/STATIC_DYNAMIC_CORRELATOR.md` (rework) | Direction of dependencies and clear API responsibilities | Assumption that canonical storage must be CPG |
| `lib/elixir_scope/graph/*` (rework) | Candidate pathfinding, dependency importance, graph conversion | Automatic exhaustive path enumeration; complexity of complete graph analytics |
| `docs/reference_implementation/**` (rework) | Design and migration clues | Treating archived reference code as integrated production system |
| `docs/ast/FOUNDATION_AST_PROGRAMMATIC_CONTRACT.md` (rework) | Typed module/function/probe contracts | Overengineered Foundation-level API for every concern |

## What the status evidence actually says

- The rework README explicitly calls upper eight layers "skeleton created, ready for implementation". Files such as `lib/elixir_scope/debugger.ex`, `capture.ex`, `intelligence.ex`, `cpg.ex`, `query.ex` return `:not_implemented` for status. A graph subset advertises `:ready`. This is a strong reason to rebuild thinly, not repurpose a supposed comprehensive engine.
- The older monolith includes a progress note claiming 130 passing / 77 failing / 3 excluded out of 207 AST repository tests, while other documents claim full production readiness or 100% success at different times. Those can refer to different phases but cannot establish final correctness without test reruns.
- Old documentation makes sub-microsecond instrumentation and large throughput claims; these are *historical claims*, not performance measurements reproduced here. Re-benchmark under today's OTP, representative workloads, sampling and capture modes.
- `0004.md` and `0005_the_fractal_sw_atlas.md` proposed contract-bearing mechanisms and fractal decompositions. `0006.md` explicitly critiques global mechanism hierarchies and favors an investigation-centric model. The **later correction** is the recommended foundation.

## Explicit discard list

A "Foundation" app containing generic event bus, circuit breakers, custom pools, caches, memory pressure regulators and microservices; a custom universal CPG and graph storage system; generic runtime instrumentation of all code; seven mandatory global DAGs; a simulation of historical state from partial event lists; automatically generated business intent; bespoke LSP/DAP; costly rich telemetry persistence in Ash resources; NIF hooks; 3D visualization; complex AI orchestration; 100% exhaustive tracing marketing.

## What to retain as test data

Mine and shrink a corpus of Elixir constructs (patterns/guards/macros/behaviors/`GenServer`/`Supervisor`/`Phoenix`/`Ecto`), several OTP crash/restart recordings, and both good and deliberately bad architecture examples. Preserve the *expected facts* as oracles, then replace old implementation.

## Recommendation on repository reuse

Either original Git repo can be repurposed for name/history, but do a **clean branch/new package structure**. Avoid letting the old `ElixirScope.*` namespace's existing facades force new module shape. Use `ElixirScope` as external product name; internally limit namespaces to `Source`, `Analysis`, `Trace`, `Correlation`, `Investigation`, plus server-specific Ash domains.
