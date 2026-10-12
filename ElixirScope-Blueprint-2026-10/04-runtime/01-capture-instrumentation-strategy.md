# Capture architecture: selective, bounded and evidence-aware

## Strategy: staged capability, not total recall

Cinema requires *some* dynamic facts to become extraordinary, but it does not require or justify recording every function, message or variable. The old monolith's full-recall vision is a research ambition with major safety and performance tradeoffs. Keep a standalone, independently testable event format and integrate sources incrementally.

## Capture capability tiers

| Tier | Producer | Typical observability | Main limitation / policy |
|---|---|---|---|
| C0 Static-only | Git, Reach, ExAST | Definitions, callers, effects, possible OTP relationships | No execution claims |
| C1 App observability | Telemetry, annotated test logs, optional OpenTelemetry | Request spans, domain events, explicitly emitted metrics | No arbitrary process state/messages |
| C2 Targeted VM tracing | OTP 27+ `trace` sessions, match specs, safe tracer | Selected function events, sends/receives, process lifecycle depending configured flags | Capture overhead, high rate, missing arguments or correlations |
| C3 Semantic callback probes | Opt-in `GenServer`/`:gen_statem` wrappers, explicit hooks | State snapshots/diffs at known callback boundaries, effect outcome instrumentation | Changes code path; values/terms sensitive; must be bounded |
| C4 Laboratory AST instrumentation | Tested source/compile probes in development or tests | Selected expression bindings, clauses and value trails | Macro/semantic preservation complexity; intrusive; not default |

Do not introduce a separate probe package at C0/C1. Introduce `apps/elixir_scope_probe` **only** when a real self-contained capture feature inside target BEAM applications needs shipping. In V0, mock/import a fixture into engine and server.

## OTP building blocks

### Trace sessions

OTP 27's [`trace` module](https://www.erlang.org/docs/27/apps/kernel/trace.html) gives dynamically created independent trace sessions; flags allow selected call/message/process/scheduling events. Appropriate as a bounded experimental runtime source. Test with representative OTP versions and capture load. Disable/clean up tracer settings promptly; no blanket full-system trace. Use stable session/node/process identifiers in output.

### Sequential tracing

[`seq_trace`](https://www.erlang.org/docs/27/apps/kernel/seq_trace.html) can propagate tokens with information transfers across processes and distributed nodes. It needs explicit activation and local per-node collectors whose traces must be combined. It does not cover arbitrary ETS/ports/external effects. Use it as a *candidate* to establish send/receive causal edges, not assume a universal distributed clock.

### OTP inspection

`:sys.get_state` and `:sys.trace` can assist controlled debugging of cooperating OTP processes. These observations are live, potentially intrusive and not historical. A state read at time T is evidence about a specific query, not a source for silently filling all previous time frames.

### Telemetry and OpenTelemetry

Useful at application boundaries and instrumentation points, with propagated context. Record source/version and correlation information where available. Spans are good for request/service flow, but a full BEAM actor/message graph requires additional capture.

### Redbug-like bounds

Borrow safe tracing ergonomics: duration, event count, patterns, target PID scope, rate thresholds, memory budgets, and deterministic stop behavior. The downstream recorder must not produce arbitrary Erlang term payloads for transport.

## Capture policy envelope

```json
{
  "schemaVersion": "1.0",
  "mode": "test_bounded",
  "target": {"modules": ["Example.CommandWorker"], "pids": []},
  "events": ["process_spawn", "process_exit", "send", "receive", "callback_enter", "callback_exit"],
  "maximumDurationMs": 30000,
  "maxEvents": 100000,
  "maxBytes": 40000000,
  "maxPayloadBytes": 4096,
  "sampling": {"type": "none"},
  "redact": {"keys": ["password", "token", "secret"], "default": "metadata_only"},
  "onBudgetExceeded": "stop_payloads_then_stop_capture"
}
```

Illustrative fields and values only. Policy validation should happen *before* enabling tracing. If a policy is changed while recording, emit configuration-change markers. When events drop, record an explicit gap with count/source if known.

## Tracer pipeline (minimal viable)

```text
Target BEAM app / ExUnit test
  -> built-in trace or explicit probe
  -> per-node bounded ring/batch collector
  -> versioned event envelope + capture policy + drop/gap metadata
  -> safe serialized trace chunks with checksums
  -> local/remote export to offline viewer

Viewer:
  trace import / validation
  -> time/actor/correlation indexes
  -> local source revision resolution
  -> bounded windows and causal slices
```

Do not build custom lock-free shared-memory ring buffers until a benchmark proves normal bounded GenServer/ETS/chunk ingestion insufficient. The old repo invested heavily in those primitives before demonstrating UI value.

## Data retention and export

A trace session is immutable when closed, with manifest and chunk checksums. Allow exporting a portable investigation subset with source digests, selected traces and review notes but default to excluding raw sensitive payloads. Event chunk compression and storage format should remain an implementation detail behind a stable schema/reader interface.

## Capture accuracy report

Every recording provides: `producer`, `version`, `target policy`, `start/end`, `node instances`, `source/build mapping`, `sample rate`, `dropped count`, `truncated count`, `payload redaction policy`, `known missing participants`, and observed clock synchronization status. UI consumes this in every relevant evidence pane.

## Cost and safety measurements before running on real systems

For each capture tier, benchmark idle overhead, median/p95 event processing time, CPU/memory allocation growth, target request latency, effect on scheduling and mailbox growth, throughput at saturation, dropped event accounting, tracer failure/stop correctness and privacy/term sanitization. Distinguish baseline from instrumented test process; never claim zero-cost tracing.

## Go/no-go criteria for deeper instrumentation

**Go** only if a specific Cinema interaction currently fails due to missing evidence *and* a targeted probe closes that gap with acceptable measured overhead and safety. **No-go** if static/code-review navigation and fixture Cinema aren't yet excellent, if values could leak secrets, or if the tracing mechanism modifies reproduction timing beyond the test's tolerance.
