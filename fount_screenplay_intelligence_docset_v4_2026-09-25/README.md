# Fount Run — six-phase implementation docset

Build a writer-facing screenplay application on Fount: brief/import → investigation → route → candidate pages → checks → bounded revision → review or authorized acceptance → export. This is the implementation plan, not a claim that the application exists.

**Start at [AGENT_START_HERE.md](AGENT_START_HERE.md).** Agents select their work from [state.json](state.json); the user does not edit phase numbers or prompts. [PROGRESS.md](PROGRESS.md) and [NEXT_HANDOFF.md](NEXT_HANDOFF.md) are generated views of that state.

## Six phases

| Phase | Deliverable | Runtime proof before advancing |
| --- | --- | --- |
| [01 Core approval safety](phases/01_CORE_APPROVAL_SAFETY.md) | Authorized Core acceptance and existing Workshop callers/tests | Canon invariant, stable approval replay, migrations and concurrency |
| [02 Run foundation](phases/02_RUN_FOUNDATION.md) | Create `fount_run`; durable records, immutable plans/policies and decision/approval-attempt storage | PostgreSQL integrity, idempotent creation and immutable bindings |
| [03 Durable execution](phases/03_DURABLE_EXECUTION.md) | Workers, leases, fencing, recovery, retries and budgets | Real single-operation recovery; no duplicate committed logical outcome or blind replay |
| [04 Screenplay pipeline](phases/04_SCREENPLAY_PIPELINE.md) | Workflows, strategy decisions, candidate composition and bounded iteration | Meaningful candidate journeys and durable stage checkpoints |
| [05 Control and completion](phases/05_CONTROL_AND_COMPLETION.md) | Writer steering, human/agent/service approval, CLI and exports | Exact decisions/acceptance, stale-base handling and delivery recovery |
| [06 Web app and integration](phases/06_WEB_APP_AND_INTEGRATION.md) | Writer interface and three complete journeys | Browser, database, restart, package and regression gates |

Six phases separate the two large former Foundation and Execution deliveries. Phase 01 changes Core/Workshop acceptance only; creating the Run package and tables is Phase 02. Worker durability is proved in Phase 03 before multi-stage screenplay orchestration in Phase 04. QC belongs to every phase; Phase 06 includes final integration and there is no Phase 07. Prior phase-file paths remain as clearly superseded redirects so ZIP application needs no manual deletions.

## The repeating handoff

1. Runtime agent prepares fresh Repomix XMLs from the current verified baseline: `fount.xml`, the complete docset as `docset.xml`, and the three dependency XMLs.
2. Web chat has **no Elixir**. It creates/edits code, tests and docs for the selected phase and returns **two ZIPs and one Markdown handoff**: complete changed/added Fount files (plus explicit deletions), the complete revised docset, and instructions for runtime QC.
3. User applies the overlay and updated docset, commits and pushes them, and gives the handoff to the Elixir agent.
4. Runtime agent checks the applied state, repairs and tests that phase, records evidence, commits and pushes code/docs, and prepares the next five XMLs and handoff. Then it stops. The next web chat automatically selects the next incomplete phase.

## Paths

| Purpose | Absolute path |
| --- | --- |
| Fount code checkout | `/home/home/p/g/n/fount` |
| Operational docset path | `/home/home/jb/docs/20260928/fount` |
| Same docset, canonical checkout path | `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount` |
| Docset Git repository | `/home/home/p/g/n/brainstorms` |
| System One SDK | `/home/home/p/g/n/system_one_sdk` |
| Inference | `/home/home/p/g/n/inference` |
| Agent Session Manager | `/home/home/p/g/n/agent_session_manager` |

`/home/home/jb` was verified as a symlink to `/home/home/p/g/n/brainstorms/nshkrdotcom`. Both docset paths identify the same files. Every phase handoff must repeat these absolute paths. In web chat they describe the receiving machine; they are not assumed to exist in its sandbox.

## Reading map

- [PRODUCT.md](PRODUCT.md): writer scope, presets and first-release journeys.
- [ARCHITECTURE.md](ARCHITECTURE.md): package boundaries, actual source anchors, API contract.
- [REVIEW_AND_APPROVAL_MODEL.md](REVIEW_AND_APPROVAL_MODEL.md): principal trust and the single canonical commit path.
- [DATA_AND_EXECUTION.md](DATA_AND_EXECUTION.md): tables, transitions, leases, budgets and recovery.
- [WORKFLOWS_AND_UI.md](WORKFLOWS_AND_UI.md): stage mapping, steering, host and delivery.
- [HANDOFF_PROTOCOL.md](HANDOFF_PROTOCOL.md): two ZIPs, manifests, role routing and commit order.
- [RUNTIME_QC.md](RUNTIME_QC.md): executable checks and evidence requirements.
- [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md), [DECISIONS.md](DECISIONS.md), [SOURCES.md](SOURCES.md): coverage, settled choices and inspected baseline.
- [TOOLING.md](TOOLING.md): state refresh, integrity validation, docset ZIP and source preparation.

The five proposal files dated 2026-09-27 are source material. This docset resolves their conceptual examples into implementation requirements; do not carry their conflicting API/schema examples forward. Current source determines available APIs, and this docset determines intended new behavior.