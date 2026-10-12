# Engineering quality, performance budgets and reproducible verification

## Quality gates, ordered by user value

1. **Correctness of evidence and source mapping**. No wrong-revision jumps, fabricated state, incorrect causal edges or lost gaps.
2. **Navigation responsiveness**. Smooth local selection, fast source snippets, no graph blowup.
3. **Availability and degradation**. Missing Reach/ExAST analysis does not break diff; imported trace viewer works with source absent.
4. **Security/privacy**. Repository root authorization and trace/payload redaction; no browser-side arbitrary eval of terms.
5. **Maintainability**. Independent engine tests, explicit wire schemas, bounded resources, small modules.

## Proposed performance SLOs for prototype (targets, not measured results)

| Scenario | Target | Measurement |
|---|---|---|
| Cached source navigation | p95 < 75 ms from click to visible highlight | Playwright browser performance trace |
| Warm semantic neighborhood | p95 < 150 ms under realistic sample repo | Backend timing + browser render |
| Timeline scrubbing | 60fps local target on typical laptop | FPS/time-to-event under 100k+ event fixture |
| Event context fetch | p95 < 250 ms for indexed recording window | API benchmark under cold/warm cache |
| Save finding | p95 < 200 ms for local SQLite (excluding bulk source fetch) | Ash action integration |
| Load saved investigation | < 1 s warm with 4 panes on sample repo | Browser E2E |
| Analyzed fixture size | 5k+ functions with bounded graph | Heap/CPU and UI memory check |
| Imported trace fixture | 100k events initially, later 1M chunked | Import duration, memory, random seek |

No invented benchmark numbers are reported. Define hardware, OTP/Elixir version, browser and fixture hashes when publishing measurements.

## Correctness oracle

Fixtures include expected source spans, known call paths, intentionally unresolved paths, process/node incarnation IDs, causal send/receive pairs, explicitly concurrent events, state snapshot gaps, replays and missing node segments. Tests assert provenance classes and absence of false claims, not simply successful JSON output.

## Backend testing layers

- Pure ExUnit unit tests for source IDs and relation projections.
- Adapter contract tests against pinned Reach/ExAST fixture outputs, recording provider version.
- Property tests (StreamData) for source ref stable hashing, event window bounds, causality transitivity (where valid), serialization roundtrips and pagination.
- SQLite Ash tests for CRUD, migrations, relation scoping, concurrent write behavior and file path validation.
- HTTP API integration for authorization/limits/errors/version compatibility.
- Trace import fuzz tests with malformed JSON, cycles, duplicate IDs, overflow and zip-slip paths.

## Frontend testing layers

- Reducer tests for focus transitions, pins, view states and history.
- Component tests for source/diff graph and evidence badges (data classes must remain distinct).
- Playwright: keyboard-only code review; pin/unpin; stress rapid selection; restore persisted workspace; multi-run alignment controls; timeline drag in browser.
- Offline mock API and online Phoenix-backed E2E matrix, including network delay and aborted/stale fetch.
- Large graph/event stress visual QA using deterministic seeded fixtures.

## Trace and capture testing

Run separate *diagnostic* capture benchmarks to quantify overhead and perturbation; do not treat microbench alone as sufficient. Include sustained event bursts, target process crash, emitter drop accounting, recorder crash/restart, disconnected node, code reload and privacy redaction. Production tracing stays disabled until these pass.

## CI and release

Root Blitz handles child Mix tests in parallel; separate Node CI builds, lints and Playwright. Format/compile/test/Credo/Dialyzer as chosen; development may use impact CI, releases run full deterministic suite. Pin lockfiles, toolchain, test fixture checksums and environment variables. Generate source/trace schema version compatibility matrix and migration tests.

## Human usability experiment

Compare ElixirScope against VSCode/neovim + ripgrep + normal PR diff + trace/log inspection on three realistic tasks: callback impact, crash/retry causality, test-run divergence. Record successful evidence-backed explanation within 10–15 minutes, navigation count, ungrounded claims, perceived disorientation and ability to repeat investigation. Prefer measured utility over visual wow factor.
