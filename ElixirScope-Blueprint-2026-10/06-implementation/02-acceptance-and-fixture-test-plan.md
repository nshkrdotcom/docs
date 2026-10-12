# End-to-end acceptance and fixture plan

## Fixture application: `otp_recovery_lab`

A deliberately tiny BEAM system with real failure modes:

```text
CommandIngress (GenServer) on Node A
  -> sends command to CommandWorker on Node B
  -> worker asks Journal on Node C for durable state
  -> worker attempts ExternalGateway effect (mock, controllable outcome)
  -> supervisor restarts worker after injected crash
  -> recovery may retry under uncertain outcome
```

Include both stable identifiers (`command_id`, `role_id`) and unstable ones (PID, run timestamp). Tests intentionally reorder independent messages and vary process creation. A local node version is sufficient initially; a distributed version comes later.

## Scenario oracle catalogue

| ID | Scenario | Critical expected facts | Critical unknowns |
|---|---|---|---|
| SC-01 | No crash, one command completes | Accepted → worker callback → journal update → observed success | External state only when fake gateway confirms |
| SC-02 | Crash before sending external operation | Crash → supervisor restart → recovery | Whether uncaptured side effects occurred (none in deterministic fixture, but generic viewer cannot assume) |
| SC-03 | Crash after operation sent, before outcome | Attempt → exit → new process → retry attempt | Initial external outcome unknown unless gateway test instrumentation records it |
| SC-04 | Retry safely reconciles durable record | Restart → journal read → no duplicate attempt | Results only within recorded test oracle |
| SC-05 | Worker PID reused across node reboot | Distinct node/process incarnation identities | Name/PID alone not stable |
| SC-06 | Cross-node send without receive capture | Observed send, no confirmed matched receive | Receiver action unknown |
| SC-07 | Concurrent independent commands | No false total-order causal path | Incomparable events possible |
| SC-08 | Same logical worker role across restart | Role link but separate process state | No inherited private state without observed reload |
| SC-09 | Running source version differs from current Git HEAD | Source mismatch signal; old ref retained | Exact span may be unresolved |
| SC-10 | Redacted arguments in one run | Comparable metadata, sensitive value hidden | Value equality not decidable |
| SC-11 | One run has missing node events | Coverage discrepancy classified | No behavioral negative proof |
| SC-12 | Same code, different schedule | Semantic anchor correspondence not unstable PID/time | No unique root cause assumed |
| SC-13 | Function moved/renamed in PR | Candidate correspondence with rationale | Exact semantic equality not guaranteed |
| SC-14 | Dynamic apply/macro function call | Analysis diagnostic for unresolved edge | Complete reachability not established |
| SC-15 | Recorder budget exceeded | Gap counts / stop reason preserved | State/events after budget unknown |

## Golden artifact corpus

- Git repo at two fixed SHAs and a dirty-tree snapshot; expected source spans/hashes.
- Reach and ExAST provider output captured with provider versions, after legal/license check; stable normalized fixture expected JSON.
- 100-event and 100k-event traces with checksums, duplicate IDs negative fixture and redaction scenarios.
- Two comparable runs with expected milestone pairs and first supported divergence.
- One incomplete cross-node causal trace and one missing-source trace.
- Saved investigation JSON with pins, history, selected symbol and finding attachments.

## Test layers

**Engine unit:** SourceRef canonicalization; revision matching; selection/projection purity; relation truncation and caps; source/evidence provenance; text/source exactness. All independent of Phoenix/Ash.

**Adapter integration:** Reach/ExAST API installed at pinned versions, validated against known modules, macros, multi-clause functions, nested `with`, dynamic calls and Erlang/Gleam capability absence. Test no raw tool IDs leaked into public stable IDs.

**Trace import:** schema version validation, event duplicate/conflict rejection, gap preservation, no global monotonic time assumption, safe chunk bounds and checksums.

**Causal queries:** DAG cycle detection/diagnostics, exact send-receive matching, multiple concurrent successors, source mismatch, missing node segment.

**Ash backend:** migration upgrade/downgrade where supported, persisted investigation/finding idempotence, SQLite write contention, authorized source scope, audit trail.

**TypeScript:** rapid mouse/key navigation, pin invariance, focus restore, stale response discard, no unbounded DOM on 100k events, reduced-motion, browser popout, keyboard-only source navigation.

**E2E:** start Phoenix test server + React app, open real fixture repo, perform three flagship workflows and save/export/import investigations.

## Three flagship acceptance scripts

### Semantic review

Given base and HEAD Git snapshots, when selecting modified `recover/2`, then display structurally changed clauses, direct callers, statically possible external-write path and exact source refs. After pinning old source and navigating another caller, old source remains. Saving a finding restores same evidence.

### Process-following Cinema

Given SC-03, selecting a crash finds correct worker incarnation and source callback. Switching follow from process to logical role crosses restart and displays new `init/1` source; state remains unknown across gap. Two effect attempts can be inspected with external outcome explicitly unknown.

### Multi-run comparison

Given SC-01 and SC-03, select stable command scope and effect/restart milestones. Align causal anchors despite changed PIDs/timestamps. Highlight second effect attempt as supported difference; do not call the first attempt confirmed unless gateway outcome was captured. Save bundle, reload, verify alignments.

## Traceable acceptance IDs

`REV-*` source/review behavior; `NAV-*` focus/pins/history; `CIN-*` process-follow/cinema; `CMP-*` two-run comparison; `EV-*` evidence integrity; `PERF-*` budget targets; `SEC-*` privacy/authorization. Put these in test names and milestone checklists to prevent an enormous self-referential PRD.

## Practical CI cadence

On PR: format/compile, engine+server unit, TS type/unit, mock Playwright smoke. On main/nightly: full provider compatibility, distributed node tests when introduced, 100k/1M trace performance, security fuzz, full Playwright E2E and schema migration suites. Use Blitz impact CI only as a speed optimization with full periodic checks.
