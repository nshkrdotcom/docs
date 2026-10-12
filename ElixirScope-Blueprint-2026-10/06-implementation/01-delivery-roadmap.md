# Delivery roadmap: prove the experience before building the machinery

## Product strategy

Milestones are not backend layers. Each must produce a usable interaction and can be demonstrated against a known fixture. **Do not start with tracing or a comprehensive AST repository.** Simultaneously explore one static review slice and one Cinema UX fixture, sharing focus/navigation contracts. The static slice becomes first shipped value; Cinema can later consume real captured traces.

## P0 — Two proof-of-value spikes, independent and short

### Spike S1 — Reach/ExAST semantic revision analysis

- Select one nontrivial OTP repository and a known risky two-revision diff.
- Run Reach/ExAST on exact source manifests; validate changed-symbol extraction, call/effect path fidelity, source ranges, unresolved cases.
- Convert results into `SourceRef`, `Relation`, `Change` JSON fixtures with provenance.
- Render an interactive changed symbol and one effect path in TypeScript.
- **Pass:** A reviewer can select a function, inspect callers/effects and navigate to exact source with no ambiguous false certainty. **Fail:** More analysis machinery needed before useful paths exist; document missing facts precisely.

### Spike S2 — Cinema renderer and source follower

- Generate deterministic cross-node/actor recording fixture with crash/restart and unknown external outcome.
- Prototype Perfetto embedding vs minimal Canvas-based lane/timeline representation, using shared event IDs.
- Test selection in timeline → selected source and pinned source + source selection → time-window/event highlight.
- **Pass:** Bidirectional navigation precise, responsive, accessible; partial-order and missing-state semantics visible. **Fail:** Perfetto cannot expose necessary event selection; use custom local renderer or supported plugin.

The two spikes must not depend on Ash or live BEAM capture. They validate the decisive product thesis cheaply.

## P1 — First integrated product: Semantic Review

Deliverables:

1. Poncho repo, root Blitz, `.mise.toml`, TS workspace and CI skeleton.
2. Independent `ElixirScope` engine with normalized revision/symbol/source models.
3. Reach/ExAST adapters and a well-scoped fixture corpus.
4. Phoenix/AshSqlite persistence for repository/revision/index jobs/investigations/findings.
5. JSON API and typed TypeScript client.
6. Dockview workbench, semantic navigator, source/diff pane, local graph, evidence inspector.
7. Pin/unpin, history, deep links, finding save/reload.
8. Basic performance/coverage diagnostics.

**Milestone demonstration:** open a diff changing a worker recovery callback; discover a possible new external write path; pin original source; save a finding. Tests assert exact source hashes and provider qualifiers. No arbitrary tracer yet.

## P2 — Recorded Cinema (offline first)

Deliverables:

1. Stable trace event schema and validated recording fixture.
2. Import service, immutable trace manifest, bounded event queries and source correlation.
3. Process/node incarnation and logical role modeling.
4. Timeline + source follower + event/evidence inspector.
5. Modes: free, process, role, causal, function, pinned.
6. State observation display with unknown gaps.
7. Save/export Cinema bookmark as investigation.

**Milestone demonstration:** navigate a three-node synthetic recovered-worker failure, reconstruct no state beyond explicit snapshots and compare attempts. No capture machinery beyond fixture import.

## P3 — Targeted real BEAM capture for tests

- Instrument the sample OTP app with bounded Telemetry and safe tracing sessions.
- Emit source build ID, node boot/process incarnation, event sequences and drop accounting.
- Record controlled GenServer state snapshots only in test/dev mode; validate source mapping.
- Import real data, show same Cinema interaction; link captured executions to code-review findings.
- Add a strict capture budget and negative tests for perturbation/sensitive values.

**Milestone demonstration:** failing ExUnit test produces a recording and a review finding opens at the corresponding event with exact callback source.

## P4 — Multi-run comparison

- Two-run selection, matching provenance, semantic milestone alignment and difference classes.
- Source revision comparisons and fixed invocation comparison.
- Unknown coverage asymmetry visible, user-corrected alignments saved.
- Export reproducible minimal counterexample with two run manifests.

**Milestone demonstration:** compare good/bad recovery tests and find first supported divergence without treating changed PID, wall-clock ordering, or missing sampled events as semantic difference.

## P5 — Distributed causal recording (optional expansion)

- Per-node collectors, explicit cross-node correlation IDs or seq_trace, partial-order reconstruction.
- Node clock offset uncertainty, collector partition gaps and restarting VM identity.
- More advanced process anatomy and effect ledger.
- Test across distributed Erlang nodes with controlled disconnect/restart.

## P6 — Rich optional capabilities, justified by evidence

- Value trails/targeted expression instrumentation in test mode.
- Query-driven automated capture scope proposals; deliberate human approval.
- LSP/ElixirSense fallback, imported Boundary/ArchTest rules, docs/declared intent.
- Systematic test shrinking, ExUnit integration, AI evidence assistant, shared investigations.
- High-performance event store changes after a measured bottleneck.
- Multi-user deployment, AshPostgres, auth, retention and capture distribution.

## Sequence blockers / dependencies

```
source IDs -> changed symbols -> source/diff navigation -> review findings
       \                                 \
        \-> runtime source refs -> Cinema viewer -> real capture
                   \                 \
                    \-> 2-run alignment -> compare + evidence bundle
```

The core focus/evidence contracts are the enabling early investment. Avoid making every future feature a dependency of the first shipped review UX.

## Criteria to refuse a feature

Reject for current milestone if it needs unbounded dynamic instrumentation, real-time distributed aggregation, a new database engine, unsolved static business intent inference or generalized semantic graph construction. Ask whether a fixture-backed bounded interaction accomplishes the same product learning.

## Responsibilities for a small team

One engineer can own engine and fixtures; one frontend-focused engineer can own Cockpit + focus reducer + timeline prototype; one backend/fullstack engineer can own Phoenix/Ash/API/CI. If solo, interleave S1 + S2 spikes then finish P1 top-to-bottom. Only introduce a separately maintained probe after P2 works end-to-end.
