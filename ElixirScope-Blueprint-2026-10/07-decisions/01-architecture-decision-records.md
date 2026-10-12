# Architecture decision records (ADRs)

These are **proposed** accepted-for-prototype decisions. Each includes a reconsideration trigger; no irreversible enterprise design is mandated at this stage.

## ADR-001 — Poncho, not umbrella

**Decision:** Git monorepo with normal independent `mix.exs` in engine and Phoenix server, root Mix only for Blitz orchestration and separate TS workspace. **Rationale:** an engine usable from IEx/CLI/test/other servers; simple local path dep; avoid umbrella assumptions. **Alternative:** umbrella, more conventional for tightly integrated Elixir apps, but weakens deliberate independent distribution and encourages shared runtime. **Reconsider:** if independent engine release becomes meaningless after real usage, or compile/build coordination proves too expensive.

## ADR-002 — Engine has no Ash/Phoenix dependency

**Decision:** Static and trace normalization are ordinary Elixir functions/structs. **Rationale:** library reuse, CLI testing, independent BEAM tool, loose UI deployment. **Alternative:** put everything in Phoenix contexts. **Reconsider:** only for clearly server-specific tasks, not engine source facts.

## ADR-003 — Ash owns durable semantic application facts

**Decision:** Ash resources for repo, revision, indexed symbol/relation subset, investigation, finding, capture manifests; event corpus separate. **Rationale:** Ash's relationships/actions/authorization support rich app state without forcing the full graph into RDBMS. **Alternative:** custom Ecto-only schema or graph DB. **Reconsider:** if Ash capabilities become insufficient for actual workload, not speculative graph scale.

## ADR-004 — SQLite-first, Postgres-capable

**Decision:** use AshSqlite for single-user local prototype; avoid Postgres-only semantics in core domain; can migrate later. **Rationale:** reduce operational cost. **Risk:** write lock/aggregate limitations. **Reconsider:** multi-user collaboration, data-layer feature requirements or measured SQLite contention.

## ADR-005 — Reach + ExAST before custom analysis

**Decision:** use adapters to existing structured analysis. **Rationale:** old CFG/DFG/CPG experiments are expensive and incomplete; reuse current tools. **Reconsider:** reproducible, significant missing facts in real fixture that cannot be supplied by existing compiler/LSP adapters.

## ADR-006 — Source identity must be revision scoped

**Decision:** no globally stable AST node ID based on name/line; exact source ref includes revision/content and structural candidate matches are separate. **Rationale:** source drift and hot versions. **Reconsider:** never relax correctness; improve matching algorithm as needed.

## ADR-007 — Evidence classes are schema-level, not decoration

**Decision:** static, observed, reconstructed, inferred and unknown represented explicitly in API and UI. **Rationale:** avoid false engineering conclusions. **Reconsider:** do not collapse; may refine subcategories.

## ADR-008 — No canonical universal CPG/event supergraph

**Decision:** separate source/trace stores linked by provenance; form bounded graph projections for queries. **Rationale:** avoid coupling and irrelevant global visualizations. **Alternative:** custom CPG/temporal graph; old proposal. **Reconsider:** concrete query performance/access patterns show benefits of materialization.

## ADR-009 — TypeScript owns high-frequency interactions

**Decision:** React, Dockview, local state/worker rendering; Phoenix API/Channels. **Rationale:** timeline drag, code highlights and graph navigation cannot be server roundtrips. **Alternative:** pure LiveView UI. **Reconsider:** if desired interface becomes mostly CRUD/document oriented; keep LiveView for admin.

## ADR-010 — Timeline rendering undecided until experiment

**Decision:** prototype Perfetto and custom Canvas; do not rely on unsupported iframe selection API. **Rationale:** bidirectional event→source navigation is signature feature. **Reconsider:** once proof works at realistic scale.

## ADR-011 — Static review functions without runtime

**Decision:** first milestone is complete semantic code-review slice; missing trace not an error. **Rationale:** immediate value, cheaper validation. **Reconsider:** if user testing shows only runtime facts make static workbench useful, but still preserve split.

## ADR-012 — Capture is optional, bounded and offline-friendly

**Decision:** fixture/import first, trace sessions/semantic hooks later. **Rationale:** correctness, privacy and observer effect. **Reconsider:** don't make unbounded capture normal.

## ADR-013 — Causality uses evidenced partial order

**Decision:** cross-node wall time does not establish happens-before; event transfers/seq_trace or app IDs do. **Rationale:** distributed correctness. **Reconsider:** no; presentation may offer approximate wall-time as a separate projection.

## ADR-014 — Process incarnation distinct from logical role

**Decision:** process-level histories terminate at death; role groups may bridge restarts with stated basis. **Rationale:** supervisors intentionally replace processes; state doesn't flow automatically. **Reconsider:** refine role identity but never erase incarnation boundary.

## ADR-015 — Multi-run alignment is explainable and bounded

**Decision:** milestone correspondence, explicit match basis, user overrides; no opaque graph-edit-distance solver in v1. **Rationale:** reproducibility and trust. **Reconsider:** systematic captured scenarios demand more general aligner and provide validated evaluation corpus.

## ADR-016 — Default production topology can be same-origin proxy

**Decision:** TS static + Phoenix API may share public origin behind proxy, but config supports split domains. **Rationale:** simpler auth/CORS and Dockview popouts; postpones domain service. **Reconsider:** team SaaS or CDN deployment architecture.

## ADR-017 — Optional AI is downstream of evidence

**Decision:** LLM suggestions are hypotheses with citations/limitations, never authoritative facts. **Rationale:** Atlas notes explicitly corrected false recovery of intent. **Reconsider:** only change interface for richer provable tools, not language-model confidence alone.

## ADR-018 — Blitz is tooling only

**Decision:** use current Blitz MixWorkspace at root for multiple Mix projects and impact CI; don't make engine depend on Blitz. **Rationale:** tooling isolated and parent repo fast. **Reconsider:** if a simpler script suffices with same reliability; not a product runtime concern.
