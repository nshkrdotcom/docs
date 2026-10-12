# Deliberately deferred decisions and required evidence

## Architecture issues not worth designing in detail yet

- **Authentication/organizations/tenancy:** V1 local trusted developer tool, but shape scopes around repository and capture and avoid hardcoded single global operator. Introduce real auth before any remotely exposed sensitive repository/recording access.
- **Database deployment:** SQLite pilot; Postgres when needed. Do not build a storage abstraction framework outside Ash.
- **Cloud/object store and retention:** portable trace file contract already permits relocation; postpone S3, streaming services, Kafka and time-series databases.
- **Continuous streaming:** would need replayable cursors, drop/backpressure, retention and secure node agent. Not necessary to validate offline Cinema.
- **Agent package:** likely useful, but only when bounded instrumentation installed in target app is demonstrably necessary. Could be a separate Hex package later.
- **Source matching for Gleam/Erlang:** capability fields preserve option; Elixir gets rich source/diff first.
- **LSP lifecycle:** no background language server manager until specific navigation gaps require it.
- **AI providers and MCP:** API may be exposed as typed tool actions later; do not structure engine around one AI orchestrator.
- **Runtime replay accuracy:** complete deterministic replay requires far more data and nondeterminism handling; Cinema's early feature is *recorded evidence navigation*, not VM replay.
- **Systematic concurrency testing:** promising but advanced; begin with manually seeded failing ExUnit traces and then property-based shrinking.
- **Cross-node clock synchronization:** capture schema allows clocks and offsets; implementation only when multi-node experiments demand it.
- **Generated asset/source hosting:** API config and source manifest abstraction permit same-origin, split CDN, desktop sidecar or offline viewer.

## Questions for implementation experiments

### Source and analysis

- How accurate are ExAST ranges for multiline guarded clauses and macros in target repos?
- Can Reach return bounded path/reason detail for effect paths without exporting all graph nodes?
- Do its OTP/process facts distinguish statically declared from dynamically inferred actors reliably?
- Which data needed by code review is unavailable from Reach/ExAST but available via `mix xref` or ElixirSense?
- Should source ref tie to exact Git blob hash, file digest, or compiler-generated module checksum? Likely several identifiers for different semantics.

### Visualization

- Is Perfetto embed selection integration sufficient for code following, or only viewport control?
- At what event scale does custom Canvas/worker implementation beat embedded renderer for our interaction?
- How does graph panel layout preserve positions as focus shifts, to prevent disorientation?
- Should left navigator group changes by module, behavior/effect, process role or user-defined investigation? Test all, never pretend automatically recovered business workflows.
- Can the workspace be used effectively on a single laptop display and by keyboard, not only a three-monitor developer?

### Distributed capture

- Are explicit trace token relationships available under the user's OTP deployment topology and capture policy?
- How reliably can a probe identify logical dynamic supervisor workers across restarts without app-specific hints?
- How are dropped events accounted for when the target node crashes while collector buffers pending data?
- Can state be captured in tests with acceptable behavior perturbation and redaction?
- What exact source/build identity can be emitted at runtime under hot code upgrades?

### Product validation

- Do engineers prefer causal stepping vs time stepping for recorded concurrency bugs?
- Which of effect ledger, state filmstrip, supervision view and value trail actually helps reach correct conclusion fastest?
- How valuable is comparison of two runs vs merely displaying one trace with annotations?
- Does review context help without AI explanations? We hypothesize yes; measure.
- What evidence causes a reviewer to trust or distrust the UI?

## Criteria for expansion

Every expansion must (a) answer a real bounded question, (b) have a concrete fixture and falsifiable behavior, (c) fit into current identities/provenance model, (d) meet measured latency and privacy budget, and (e) not force a rewrite of the independent engine/server split.
