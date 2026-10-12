# Executive decisions — implementation brief

## The actual product

**ElixirScope is an investigation-first semantic code-review workbench with an optional source-correlated Execution Cinema.** It is not an attempt to build an IDE, an observability platform, a general-purpose graph engine, a DAP debugger or an autonomous AI reviewer in v1.

The core value is *coordinated navigation*: a single focus changes the relevant context across source, change, relationships, process, time and evidence without losing pins or overclaiming certainty.

## Decisions taken for this blueprint

| Decision | Now | Deliberately deferred |
|---|---|---|
| Repository layout | Lightweight poncho with independent Mix apps and independent TS workspace | Umbrella, microservices, multiple capture services |
| Analysis | Reach + ExAST adapters; source/analysis normalizers | Rebuilding AST/CFG/DFG/CPG machinery |
| Language | Elixir first; identities and adapter contracts allow Erlang/Gleam | Broad language-specific UX, universal compiler |
| Persistent application state | Ash + AshSqlite for local pilot | AshPostgres for substantial collaboration; graph DB |
| Runtime data | Optional imported/recorded fixture with normalized events | Full production tracing and high-scale time series infrastructure |
| Phoenix | JSON endpoints + optional Channels; LiveView only for separate server-side admin/diagnostics if desired | LiveView as a replacement for TS's high-frequency canvas/editor state |
| TS frontend | React, Dockview, CodeMirror or git-diff-view, localized graph | Giant node graph, from-scratch code renderer |
| Timeline | Prototype custom local canvas and Perfetto embed side by side | Commit to Perfetto without bidirectional selection proof |
| AI | Source-grounded optional explanation later | LLM-driven instrumentation and automatic interpretation as source of truth |
| Test orchestration | Blitz 0.4.1 at tooling root; each child remains independently testable | Cross-project coupling and shared build state hacks |
| Toolchain | mise (or asdf) pins Elixir/OTP/Node | Exact version claims not verified by compatibility tests |
| Deployment | Local separate ports; configurable API/base URLs; optional same-origin proxy | Multi-tenant domain-management service |

## Five bedrock contracts

**1. Analysis interface.** `index_revision`, `changed_symbols`, `neighborhood`, `explain_path`, `effects`, `find_tests`; no server dependency. Must surface uncertainty and tool provenance.

**2. Focus interface.** A focus carries `repository`, `revision`, `symbol`, optional `session`, `actor`, `event`, `time_window`, `lens`, `follow_mode`. Focus updates are atomic and reversible; pinned panes reject unrelated automatic navigation.

**3. Evidence interface.** Each finding/edge/data value says whether it is static, observed, reconstructed, inferred or unknown, and gives a reason and source. Gaps are not silent nulls.

**4. Capture interface.** Versioned events with session, node/process incarnation, local time domain, sequence, optional cross-node links, source reference, privacy/coverage metadata. No global total-order assumption.

**5. Delivery interface.** TS talks to Phoenix via typed JSON/HTTP and optional WebSocket/Channels, not direct imports of Ash code or BEAM terms.

## Immediate successful demonstration

On a realistic OTP repo and a failing recovery test, a reviewer can:

1. Open the Git diff and navigate to changed functions, rather than merely filenames.
2. Inspect bounded callers, effects, and state ownership, with a fixed pinned source comparison.
3. Open a relevant recorded test in Cinema; follow a command through message and restart boundaries with source correlated to the exact revision.
4. Compare successful and failing runs, identifying the earliest *supported* divergence and any unseen outcomes.
5. Save one evidence-backed review finding; reload it and reproduce the same focused workspace.

## The make-or-break hypothesis

**Does source-following causal navigation beat conventional code review plus search/logs for one specific class of BEAM concurrency or recovery bugs?** Measure time-to-evidence, false confidence, navigation count, and whether users can challenge explanations. Refuse features that do not improve the answer to a concrete investigation question.
