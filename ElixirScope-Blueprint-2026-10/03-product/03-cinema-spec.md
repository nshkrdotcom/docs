# Interaction specification 2: Process-following Execution Cinema

**Priority:** UI prototyped alongside review using a realistic recording fixture; actual capture introduced later. **Question:** "What actually happened to this command as it moved through processes and node boundaries, and which source code explains each observed step?" **Output:** navigable evidence-backed causal investigation.

## Model execution: recovery after ambiguous external write

Actors: Node A ingress process; Node B worker; Node C journal/persistence process; Node B supervisor. A command enters, worker sends an external request, terminates before durable outcome record; the supervisor starts another worker, whose recovery logic may retry. A good fixture has enough information to prove some events and leaves at least one external outcome intentionally unknown. The UI's job is **not** to assert that the external action completed when only an attempt is observed.

## Core coordinates

Cinema focus is:

- source `revision_id`, `symbol_ref`, optional `source_span`;
- `session_id`, `event_id`, `process_instance_id`, optional `logical_role_id`;
- `time_window`, `causal_root_event_id`, `selected_invocation_id`;
- `follow_mode`: `process`, `role`, `causal`, `function`, `value`, `effect`, `free`, `pinned`;
- provenance and coverage state.

**Node name, PID string and wall time alone are not stable identity.** Across crashes/reboots and hot code loads, preserve incarnations and source-version mappings.

## Workspace hierarchy

**Top:** capture header (revision, capture policy/coverage, selected node and logical role, mode) + System Score timeline. **Center-left:** source follower and optional pinned source comparison. **Center-right:** event inspector with actor anatomy, state observations, message transfer and effect ledger. **Bottom:** causal path, breadcrumbs, user bookmarks and review finding trail. The timeline is the *control surface*, not the only view.

## Core visual elements

- **Node bands** group process lanes by node incarnation; offline/missing participants visibly incomplete.
- **Process lanes** represent unique process incarnations with lifetimes and icons for spawn, exit, restart.
- **Logical-role grouping** can visually connect terminated and restarted worker lanes, but never merge their historical state into one continuous process.
- **Slices** show recorded callback invocation durations only when entry/exit events correlate; partial spans have open ends and a qualifier.
- **Arrows** show recorded message send/receive matches or explicit causal links. Inferred possibilities use a distinct pattern and legend.
- **Markers** include exceptions, monitor DOWN, linked exits, persistence outcomes, snapshots and capture gaps.
- **Unknown band** may mark unrecorded intervals instead of interpolated behavior.

## Three distinct scrubbers

**Chronological time:** move a global presentation cursor. It does not impose causality; concurrent events can share a time window.

**Causal step:** advance on a selected dependency subgraph across process/node boundaries, skipping unrelated events. If multiple independent next causal events are possible, offer a fork/branch chooser rather than imposing arbitrary sequence.

**Invocation step:** hold a function/symbol in source while moving among recorded invocations, showing argument/result/duration differences. Only works when invocation identities were captured; else show unavailable.

These are separate controls/keyboard commands. The user should always see which one is active.

## Primary scenario, step by step

### Step 1 — Open a bounded recording

The user opens an imported fixture or capture session. The viewer verifies schema, code manifest, event counts, node membership, clock domains and capture gaps before rendering. No connection to the original live nodes is required. If code is unavailable, timeline still works with `source missing` indications.

### Step 2 — Choose relevant failure

A command palette query "crash" or a timeline marker selects a worker abnormal exit. The event inspector shows recorded exception/reason, process incarnation, node boot identity, local event sequence, code revision mapping, and known preceding events. The source follower selects last correlated function/callback; absent source is not guessed.

### Step 3 — Follow process backward

Follow mode `process` limits relevant events to one incarnation. Causal predecessor links and chronological predecessors remain distinct. The source follower moves through the recorded invocation series if available; with sparse capture, it shows the nearest known callback plus an explicit gap.

### Step 4 — Traverse a message

User selects a send from ingress to worker. The causal view displays paired receive only if correlation evidence supports it, otherwise `send observed; receive not captured / not matched`. If paired receive exists on another node, follow crosses node groups. The source panes navigate from send call to receiving callback, while a pinned caller pane remains still.

### Step 5 — Inspect state snapshots

Selecting a GenServer callback displays the *observed* state at known snapshot boundaries. If explicit before/after data exists, show a field-level diff; if only one observation exists, show last known and mark intermediate state unavailable. Redacted/oversized/truncated fields have visible placeholders, not invented values.

### Step 6 — Inspect an external effect

An effect ledger row shows `attempted`, `result reported`, `durably confirmed` (only when the corresponding reliable observation exists) or `outcome unknown`. From the effect, user can follow source path back through static possible dependencies and recorded caller links, visually separating the two evidence types.

### Step 7 — Follow restart across logical role

User switches from `process` to `logical role`. The view shows old worker exit, supervisor reaction and new worker incarnation if observed. The source follower moves to `init/1`, then recovery callback. The role connection doesn't bridge historical state unless a recorded durable state/load does.

### Step 8 — Compare original and retry attempt

Pin the first effect call source and invocation inspector. In the second source pane, follow the recovered worker's retry. A value/effect comparison emphasizes equal/different captured arguments and explicitly labels whether external outcome is known. If both attempts were observed but effects remain unknown, the review finding should say exactly that.

### Step 9 — Save an evidence-backed investigation

The finding can say "Recovery reattempted command X after crash, and capture lacks confirmed outcome for first attempt." Attach the two operation-attempt event IDs, restart events, source references at their versions, capture coverage and unresolved external outcome. Export includes a manifest and enough bounded trace slices to reproduce the navigation offline.

## Follow-mode behavioral contract

| Mode | Seek response | Process restart | Auto source updates |
|---|---|---|---|
| `free` | Timeline focus follows manual cursor only | no automatic role connection | only on committed event selection |
| `process` | nearest eligible event within one process incarnation | stops at exit; prompt to switch role | on related recorded callback/call event |
| `role` | all incarnations assigned same logical role | crosses restart boundary, labels transition | source follows newly selected incarnation; pinned unaffected |
| `causal` | advances to next supported causal event(s) | crosses only with causally supported links | follows currently selected causal event |
| `function` | next/prev invocation of exact source symbol | optional if same source-version mapping and capture evidence | source stays fixed, invocation strip changes |
| `value` | navigation among recorded value observations | stops/displays unknown at missing owner transition | follows evidenced value origin/use when possible |
| `effect` | advances along selected effect chain | acknowledges external boundary and uncertainty | related source effects and callbacks |
| `pinned` | no auto-follow | none | fixed until user explicitly navigates |

## Time and causal integrity

- A monotonic clock timestamp from Node A cannot simply be subtracted from Node B's monotonic timestamp. Store clock domains. Cross-node wall clock is approximate, with uncertain placement.
- `send → receive` correlation uses trace tokens/instrumented IDs and logged events, not superficial equality of payload text and timestamps.
- `seq_trace` can propagate tokens across processes/nodes when activated, but trace output remains local to collecting nodes and must be merged; ETS/ports can break propagation. Do not claim complete causality.
- Causal playback does not establish a unique topological order. When multiple concurrent branches remain, UI exposes alternatives.
- Missing capture from a node produces a visible dotted lane/unknown segment. No silent interpolation.

## State integrity and safety

Use a typed observation-status enum: `observed_complete`, `observed_partial`, `reconstructed_validated`, `sampled`, `redacted`, `truncated`, `missing`, `not_supported`. Do not use a single `nil` for these cases. State snapshots must come from explicit trusted capture, and users must be able to inspect capture level and privacy policy. Avoid expression-eval/remote code mutation through browser.

## Source matching edge cases

- Running code does not match Git HEAD: show recorded manifest and source mismatch.
- Hot code reload mid-run: segment by loaded code version; unresolved function source selection must be explicit.
- Compiler-generated callback: navigate to nearest attributed originating source span, with warning.
- Anonymous function/arity ambiguity: show candidate spans, not certain source.
- Instrumented line moved across revisions: retain exact old source; offer candidate correspondence.
- Missing source artifact: timeline/evidence functional without code; source unavailable with import instructions.

## Navigation performance architecture

The browser preloads the selected time window and keeps an event-to-source lookup table keyed by recording and revision. During drag, use fast preview state; on pointer release, commit focus and request adjacent source, causal and state windows as needed. Long streams are chunked and paginated. Timeline renderer uses Canvas/Perfetto, not DOM-per-event or React Flow-per-event. Source panes use a stable editor instance with decorations rather than remounting editors at every seek.

## Acceptance tests (must be automated with fixture oracle)

1. Select crash, verify exact recorded process incarnation and source revision.
2. Step backward within process then switch to role; cross restart while state remains unknown unless observed.
3. Select send with receive missing: UI never creates false receive/cause edge.
4. Select paired cross-node send/receive: source follows both, preserving pin.
5. Place two concurrent events with conflicting wall times: causal playback reports non-total order.
6. Load event with missing source hash: no silent navigation to current HEAD.
7. Scrub 200 events quickly: stale data fetch doesn't override latest focus.
8. Inject gap/drop/redaction flags: each renders distinctly in inspector and export.
9. Export/import investigation, verify stable event IDs and source digest.
10. Attempt huge payload/malformed fixture: import rejects or truncates safely before browser display.
11. Show first effect attempt and replayed effect attempt; distinguish attempted operations from confirmed external completion.
12. Toggle between chronological, causal, process, invocation modes and verify persistent mode indication.

## Exit criteria

With **only a recorded fixture**, a developer can understand and inspect an OTP crash/restart across three nodes and correlate every *supported* event to exact source, while the UI preserves unknowns. If this doesn't feel dramatically better than logs, do not build more capture infrastructure yet.

## Implementation research blockers

- Test Perfetto host-to-selected-event callback; official iframe API supports time control and loads but not obviously full bidirectional event selection. A plugin or own Canvas may be required.
- Test `seq_trace` in current OTP and node/network setups. It isn't a blanket general tracer for all state and effects.
- Determine a safe schema for captured BEAM term values; never serialize arbitrary runtime terms unboundedly into JSON.
