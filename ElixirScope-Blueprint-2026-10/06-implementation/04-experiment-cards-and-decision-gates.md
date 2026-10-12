# Decisive experiments: small tests with clear falsifiers

## Experiment E1 — semantic diff fidelity

**Hypothesis:** ExAST can map meaningful changed Elixir functions/clauses well enough to power navigation instead of line-only diff. **Fixtures:** function body edit, multiple clauses, moved function, renamed function, macro, guard, alias/import. **Metric:** exact source spans and unambiguous classification on 20 manually curated changes. **Falsifier:** >3 misleading source mappings or unexplained changes; use plain diff + explicit manual annotations for these cases.

## Experiment E2 — Reach review context utility

**Hypothesis:** Reach's graph/impact/effect path data offers a faster review path to real external effects than ordinary text search. **Fixture:** a worker callback changed so recovery path reaches an external operation, plus dynamic `apply` edge. **Metric:** reachable useful path, reviewer's time-to-evidence and false assumptions. **Falsifier:** tool output too noisy or omits central relationships without diagnostics. Restrict to direct callers/effects or augment with compiler metadata.

## Experiment E3 — cross-pane navigation value

**Hypothesis:** synchronized changed symbol → code → bounded impact → evidence saves time. **Fixture:** 20k lines and 100 changed functions in realistic OTP repo; 5 engineers. **Metric:** task time, wrong-file navigation, pins maintained, satisfaction. **Falsifier:** users prefer editor or can't tell what pane updated. Iterate focus policies before more backend work.

## Experiment E4 — Perfetto bidirectionality

**Hypothesis:** Perfetto embedded UI can be made to coordinate event selection ↔ TS source pane. **Fixture:** 100k events, 100 actor lanes, 3 nodes, 5 causal paths. **Metric:** host can navigate exact event/time and receive selected event IDs reliably using supported embed/plugin mechanism. **Falsifier:** selection only internal/needs brittle DOM interception. Build Canvas source follower timeline.

## Experiment E5 — state claim fidelity

**Hypothesis:** UI can be honest while still useful with sparse snapshots. **Fixture:** before/after callback snapshots, skipped transition, redacted field, restart. **Metric:** zero false exact states and clear explanation by user. **Falsifier:** users infer continuous state from filmstrip. Change visual grammar to emphasize coverage.

## Experiment E6 — process identity semantics

**Hypothesis:** logical role view improves restart comprehension without state continuity confusion. **Fixture:** supervisor restarts worker with same role, new PID, potential VM reboot/name reuse. **Metric:** user identifies distinct process incarnations and role continuity. **Falsifier:** timeline suggests old worker persisted; redesign.

## Experiment E7 — causal selection

**Hypothesis:** stepping causal path reduces noise compared to time scrubbing. **Fixture:** interleaved independent commands, cross-node send/reply, missing receive. **Metric:** time to isolate duplicate attempt and rate of false causal links. **Falsifier:** without enough capture, path looks artificially precise; stay chronological with explicit partial ordering.

## Experiment E8 — two-run semantic alignment

**Hypothesis:** anchor-based comparison survives PID/time differences and reveals valuable behavioral divergence. **Fixture:** one good and one failing run, plus missing-capture and concurrency variants. **Metric:** correct first supported divergence and no false claims on absent events. **Falsifier:** alignment is mostly arbitrary; let user align milestones manually before algorithm sophistication.

## Experiment E9 — Ash/SQLite boundaries

**Hypothesis:** local-first persistence is enough for investigations and index metadata, without raw events as Ash resources. **Fixture:** 5 simultaneous indexing/read/finding operations on fixed repo, import one 100k event trace. **Metric:** short writes, response latency and no DB lock chaos. **Falsifier:** write contention in actual UI; serialize writes or move hosted backend to Postgres.

## Experiment E10 — real trace capture

**Hypothesis:** bounded OTP trace or Telemetry can reproduce fixture-level evidence for process/message lifecycle safely. **Fixture:** controlled ExUnit process restart, target vs unrelated work, defined capture budgets. **Metric:** event completeness and documented omissions, overhead vs baseline, drop accounting, stop cleanup. **Falsifier:** output cannot correlate a useful message path or destabilizes test; revisit capture plan, don't add more invasive probes automatically.

## Gate policy

Every experiment yields a short artifact: fixture SHA, dependencies/versions, exact code or recording input, expected/actual, measurements, interpretation, next action. No success claims based solely on an animated demo or copied benchmark from a library README.
