# Sources, provenance and verification register

**Checked:** 2026-10-11. This document records why technical claims in the blueprint are credible and where they remain proposals. Libraries and public APIs can change; revisit their documentation when locking dependencies.

## User-provided source corpus

These are uploaded Repomix snapshots, not online current source references:

| Archive file supplied | Location/purpose | Local mining specifics |
|---|---|---|
| `repomix-output(20261011-234441).xml` | BEAM Atlas research docs (`0001`, `0002_not_beam_specific_distsys_debug`, `0003`, `0004`, `0005_the_fractal_sw_atlas`, `0006`, `0006a`, `0007`, `0010_code_review_gpt_deepResearch`, `0020_code_review_gemini_deepResearch`) | 10 entries; investigation-first revision of ambitious ontology; 45 BEAM and 50 distributed UX ideas |
| `repomix-output(20261011-234709).xml` | Old ElixirScope monolith, tests and demos | 610 included file entries; 191 under `lib`, 81 under `test`, 97 under `test_apps`; ASTRepository, Capture, TemporalBridge, PhoenixScopePlayer, demo |
| `repomix-output(20261011-235118).xml` | Later ElixirScope rework | 511 included entries, 475 under `docs` and 17 under `lib`; skeleton upper layers and working graph subset; archived reference implementations |

**Caution:** These Repomix files may not contain ignored files and do not themselves provide a Git history, compiled dependency lock compatibility or runtime test results. File entry counts are simple manifest counts, not product maturity metrics.

### Highly relevant exact source paths

From Atlas: `0001.md` (System Score), `0002_not_beam_specific_distsys_debug.md` (distributed causal ideas), `0003.md` (45 BEAM visualizations), `0005_the_fractal_sw_atlas.md` (original semantic ontology), `0006.md` (investigation-first correction, evidence and counterexample), `0006a.md` (declared vs inferred intent), `0007.md` (broader vision review), `0010_code_review_gpt_deepResearch.md` and `0020_code_review_gemini_deepResearch.md` (UI/ecosystem surveys).

Old monolith: `lib/elixir_scope/ast_repository/{parser,instrumentation_mapper,repository}.ex`, `lib/elixir_scope/capture/{temporal_bridge,temporal_storage,event_correlator,ring_buffer}.ex`, `test_apps/phoenix_scope_player/lib/phoenix_scope_player_web/live/playback_live.ex`, `test_apps/phoenix_scope_player/priv/captured_data/sample_session_1`, `docs/docs20250527_2/AST_CURSOR_PROG.md` (test gaps). The old repo's readiness claims should not be taken as independent verified benchmarks.

Rework: `README.md` and `lib/elixir_scope/{debugger,capture,intelligence,cpg,query}.ex` (`:not_implemented` facades), `lib/elixir_scope/graph/{core,foundation_integration}.ex`, `docs/archive/development_history/docs_local/STATIC_DYNAMIC_CORRELATOR.md`, `docs/archive/dated_docs/docs20250602/FOUNDATION_INVESTIGATION_DESIGN.md`, `docs/reference_implementation/capture/runtime/temporal_bridge.ex`, `docs/implementation/GRAPH_IMPLEMENTATION_GUIDE.md`.

## Verified external references — static analysis and code intelligence

- Reach: https://github.com/elixir-vibe/reach — documented PDG, impact, taint/effects, OTP, multi-language support, JSON CLI. Verified at time of research.
- Reach.Project API v2.8.4: https://reach.hexdocs.pm/Reach.Project.html — `from_mix_project`, `from_glob`, `from_sources`.
- ExAST: https://github.com/elixir-vibe/ex_ast — structural search/replace/diff; symbols definitions/references, language limits.
- Sourceror: https://github.com/doorgan/sourceror — Elixir source-preserving AST.
- Built-in `mix xref`: https://hexdocs.pm/mix/Mix.Tasks.Xref.html.
- ElixirSense: https://github.com/elixir-lsp/elixir_sense.
- ElixirLS: https://github.com/elixir-lsp/elixir-ls.
- Boundary: https://github.com/sasa1977/boundary — compile-time architecture constraints.
- ExDoc: https://hexdocs.pm/ex_doc/.
- libgraph: https://github.com/bitwalker/libgraph.
- Exograph: https://github.com/elixir-vibe/exograph — ***inconsistent current upstream descriptions***: GitHub About/organization description says Postgres/ParadeDB, README describes DuckDB/QuackDB. Treat persistence backend as unverified until selecting a specific release/commit.
- Elixir Vibe projects: https://github.com/elixir-vibe.

## Verified external references — Ash/Phoenix

- Ash relationships: https://ash-project.github.io/ash/relationships.html.
- Ash: https://hexdocs.pm/ash/.
- AshSqlite: https://github.com/ash-project/ash_sqlite and https://ash-sqlite.hexdocs.pm/what-is-ash-sqlite.html.
- AshSqlite transactions/write locking: https://github.com/ash-project/ash_sqlite/blob/main/documentation/topics/about-ash-sqlite/transactions.md.
- AshPostgres: https://hexdocs.pm/ash_postgres/.
- AshJsonApi: https://github.com/ash-project/ash_json_api and https://github.com/ash-project/ash_json_api/blob/main/documentation/tutorials/getting-started-with-ash-json-api.md.
- Phoenix Endpoint origin and transport: https://github.com/phoenixframework/phoenix/blob/main/lib/phoenix/endpoint.ex.
- Phoenix LiveView: https://hexdocs.pm/phoenix_live_view/.

## Verified external references — runtime/BEAM

- OTP 27 Trace: https://www.erlang.org/docs/27/apps/kernel/trace.html.
- OTP 27 Sequential trace: https://www.erlang.org/docs/27/apps/kernel/seq_trace.html.
- OTP 27 sys: https://www.erlang.org/docs/27/apps/stdlib/sys.html.
- OTP 27 trace-session overview: https://www.erlang.org/blog/highlights-otp-27/.
- Redbug: https://github.com/massemanet/redbug.
- LiveDebugger: https://github.com/software-mansion/live-debugger (dev-only guidance, released 1.0.0 in 2026).
- PhoenixReplay: https://github.com/elixir-vibe/phoenix_replay.
- OpenTelemetry Erlang: https://opentelemetry.io/docs/languages/erlang/.

## Verified external references — frontend and visualization

- Dockview: https://dockview.dev/docs/ and https://dockview.dev/docs/overview/introduction/.
- Dockview floating groups: https://dockview.dev/docs/core/groups/floatingGroups/.
- Dockview same-origin popout: https://dockview.dev/docs/core/groups/popoutGroups/.
- git-diff-view React package: https://www.npmjs.com/package/@git-diff-view/react.
- CodeMirror: https://codemirror.net/.
- Monaco: https://microsoft.github.io/monaco-editor/.
- React Flow and performance: https://reactflow.dev/learn/advanced-use/performance.
- Dagre: https://github.com/dagrejs/dagre.
- ELKjs: https://github.com/kieler/elkjs.
- Sigma: https://www.sigmajs.org/.
- Perfetto embedding: https://perfetto.dev/docs/visualization/embedding-the-ui.
- Perfetto embedding API reference: https://perfetto.dev/docs/visualization/embedding-api-reference.
- Perfetto UI plugin/selection: https://perfetto.dev/docs/contributing/ui-plugins.
- uPlot: https://github.com/leeoniya/uPlot.
- PixiJS: https://pixijs.com/.
- TanStack Virtual: https://tanstack.com/virtual/latest.
- TanStack Query: https://tanstack.com/query/latest.
- Zustand: https://zustand.docs.pmnd.rs/.
- cmdk: https://github.com/dip/cmdk.
- Playwright: https://playwright.dev/.

## Verified external references — multi-Mix tooling

- Blitz 0.4.1 README/working examples: https://hex.pm/packages/blitz/0.4.1/files/README.md?fallback=default.
- Blitz Hex: https://hex.pm/packages/blitz.
- Blitz docs: https://hexdocs.pm/blitz/.
- mise: https://mise.jdx.dev/.
- asdf: https://asdf-vm.com/.

## Research caveats

1. 'Verified externally' means the web-facing documentation or code repository described that capability on the checked date, not that our implementation integrated or benchmarked it.
2. Actual API signatures in examples should be tested at pinned versions, especially bleeding-edge Reach/ExAST and Blitz.
3. No current user-specific repository source was fetched from private GitHub; the user-supplied Repomix snapshots supplied historical content.
4. All new code/UI interactions, API designs and targets are **proposed**, not features already shipped in ElixirScope.
5. The documents intentionally correct overconfident "total recall" and "reconstruction" claims in old AI-authored repository notes.
