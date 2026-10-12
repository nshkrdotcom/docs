# Atlas research inventory: 95 interface ideas — with v1 triage

> **Source-derived descriptions:** the idea names/descriptions below are condensed from the user-provided Atlas research files (`0002_not_beam_specific_distsys_debug.md` and `0003.md`). **New classification:** "Now / Next / Research" is this blueprint's recommendation and was not part of the archived source. All suggestions require capture/evidence feasibility checks.

## General distributed-systems concepts (50)

| # | Concept | Source-described use | Triage |
|---:|---|---|---|
| D01 | Causal Piano Roll | Signature view described in the source document; detailed constraints in adjacent research notes. | Now |
| D02 | Happens-before overlay | Show provable causal order rather than relying on wall-clock timestamps. | Now |
| D03 | Concurrency bands | Shade events whose relative order is unknown. | Now |
| D04 | Clock-skew lens | Show how the timeline changes when timestamps are corrected or uncertainty is displayed. | Next |
| D05 | Lamport time toggle | Switch between wall-clock and logical ordering. | Research |
| D06 | Vector-clock comparison | Select two events and determine whether one preceded the other or they're concurrent. | Research |
| D07 | Timeline braiding | Each node gets its own clock; messages weave the timelines together. | Now |
| D08 | Knowledge horizon | At any selected event, highlight what that process could possibly have known. | Next |
| D09 | Uncertainty envelope | Render timestamp ranges instead of falsely precise points. | Now |
| D10 | Causal cone | Select an event; illuminate everything that could have influenced it and everything it could influence. | Now |
| D11 | Wait-for graph | Reveal which processes, services, locks or acknowledgments are blocking others. | Next |
| D12 | Latency accordion | Expand a request into processing, queuing, network transit, retries and waiting. | Next |
| D13 | Critical-path spotlight | Highlight only events contributing to end-to-end completion time. | Next |
| D14 | Idle vs blocked vs busy | Distinguish an idle process from one unable to make progress. | Next |
| D15 | Mailbox pressure lanes | Show queue growth alongside process activity. | Next |
| D16 | Retry spiral | Visualize repeated attempts, backoff, and duplicate side effects. | Now |
| D17 | Timeout race | Display timeout firing relative to a response that arrived just too late. | Now |
| D18 | Backpressure wave | Animate congestion propagating upstream through services. | Research |
| D19 | Deadlock detector view | Highlight wait cycles where the necessary relationships are observable. | Research |
| D20 | Silence detector | Surface components expected to emit heartbeats or progress events but not doing so. | Next |
| D21 | State constellation | Show every replica's current value around the authoritative source. | Next |
| D22 | Divergence heatmap | Color nodes by how far their state differs from a chosen reference. | Research |
| D23 | Version genealogy | Track configuration or data versions through creation, replication and acceptance. | Next |
| D24 | Split-brain spotlight | Identify overlapping claims of leadership or authority. | Research |
| D25 | Quorum theater | Show which members voted, acknowledged or were unavailable. | Research |
| D26 | Consistency window | Highlight the interval during which observers disagree. | Next |
| D27 | State-diff scrubber | Scrub between two events and inspect field-level state changes. | Now |
| D28 | Invariant gauge | Show whether a selected safety or consistency invariant holds across the trace. | Next |
| D29 | Command uncertainty state | Distinguish sent, acknowledged, applied, observed and unknown outcomes. | Now |
| D30 | Replay lineage | Show how an event was processed, retried, deduplicated or rejected. | Now |
| D31 | Living topology | A service map that changes as processes start, die and reconnect. | Next |
| D32 | Failure blast radius | Select a crashed component and show all dependent components affected. | Next |
| D33 | Supervisor replay | Animate OTP child termination and restart behavior. | Now |
| D34 | Recovery stopwatch | Measure detection, restart, reconciliation and readiness separately. | Next |
| D35 | Partition scissors | Visually cut a network edge and explore the consequences in a simulation. | Research |
| D36 | Fault boundary overlay | Group processes by VM, host, availability zone and independent recovery boundary. | Next |
| D37 | Dependency inversion warning | Show when a supposedly independent service actually requires a remote dependency. | Next |
| D38 | Failure fingerprint | Cluster traces with similar causal patterns rather than similar error messages. | Next |
| D39 | Resilience comparison | Place healthy and fault-injected executions side by side. | Now |
| D40 | Minimal failure witness | Reduce a long trace to the smallest known event chain explaining a failure. | Now |
| D41 | Semantic neighborhoods | Group functions by behavior or responsibility rather than source directory. | Now |
| D42 | Code-to-event linking | Click a runtime event and jump to the function or handler responsible. | Now |
| D43 | Pure-core spotlight | Separate deterministic transformations from stateful processes and external effects. | Now |
| D44 | State ownership map | Show which process or datastore owns each piece of mutable state. | Now |
| D45 | Effect boundary map | Highlight database writes, network sends, file operations and external commands. | Now |
| D46 | Message contract explorer | Navigate producers, consumers, message shapes and compatibility. | Now |
| D47 | Architectural drift | Compare intended module/process boundaries with observed runtime coupling. | Next |
| D48 | Complexity-to-reliability overlay | Highlight code with high branching complexity and frequent runtime faults. | Next |
| D49 | Source evolution timeline | Align commits or deployments with behavior changes and regressions. | Now |
| D50 | Reviewer flight path | Generate a guided tour through the handful of mechanisms that explain a subsystem. | Now |

## BEAM/OTP-native concepts (45)

| # | Concept | Source-described use | Triage |
|---:|---|---|---|
| B01 | Living Supervision Tree | Signature view described in the source document; detailed constraints in adjacent research notes. | Now |
| B02 | Restart Blast Radius | Click a child and see the expected and observed restart set under `:one_for_one`, `:one_for_all`, or `:rest_for_one`. | Now |
| B03 | Restart Budget Gauge | Visualize restart intensity, time windows, and impending supervisor escalation. | Next |
| B04 | Process Reincarnation | Show successive PIDs occupying the same logical child role, with state reset boundaries. | Now |
| B05 | Crash Lineage | Trace which exception, exit signal, linked process, or supervisor decision caused each termination. | Now |
| B06 | Link and Monitor Lens | Differentiate bidirectional links, one-way monitors, `DOWN` messages, and exit propagation. | Next |
| B07 | Trap-Exit Map | Highlight processes using `Process.flag(:trap_exit, true)` and show how exits become messages. | Next |
| B08 | DynamicSupervisor Nursery | Show child creation, termination, concurrency, and transient worker lifetimes. | Next |
| B09 | Application Startup Waterfall | Map OTP application dependency order, child startup, and readiness. | Next |
| B10 | Mailbox Piano Roll | Incoming messages, dequeue/handling, responses, and state transitions on one timeline. | Now |
| B11 | GenServer State Filmstrip | State before and after each callback, with compact structural diffs. | Now |
| B12 | Call/Reply Anatomy | Show `GenServer.call` waiting, reply timing, timeout, and eventual late replies. | Now |
| B13 | Selective Receive Lens | Show unmatched messages remaining in the mailbox while a receive waits for a match. | Next |
| B14 | Mailbox Waterline | Queue length over time, annotated with which message classes accumulate. | Next |
| B15 | State Ownership Map | Distinguish state owned by processes, ETS tables, persistent storage, and external services. | Now |
| B16 | Callback Contract Explorer | Navigate `init`, `handle_call`, `handle_cast`, `handle_info`, `terminate`, and their return shapes. | Now |
| B17 | Timer Lifecycle | Show scheduled timers, cancellation, timeout delivery, and stale timer messages. | Next |
| B18 | Process Dictionary Lens | Surface process dictionary usage as hidden mutable state that may deserve review. | Next |
| B19 | Scheduler Runway | Show runnable, running, and waiting process activity across scheduler threads. | Research |
| B20 | Reduction Heatmap | Identify processes consuming disproportionate BEAM reductions. | Research |
| B21 | Run Queue Pressure | Correlate scheduler load and run queues with request latency. | Research |
| B22 | Heap Lifecycle | Show per-process heap growth, garbage collection, and reclamation. | Research |
| B23 | Binary Retention Map | Identify large reference-counted binaries retained through smaller sub-binaries or process references. | Research |
| B24 | ETS Ownership Graph | Show ETS tables, owners, heirs, readers, and writers. | Next |
| B25 | Memory by Failure Domain | Compare memory held by processes grouped under supervisors. | Research |
| B26 | Hot Process Lens | Connect high reductions, large mailboxes, or memory growth to specific process roles. | Research |
| B27 | Scheduler Migration Trail | Where instrumentation permits, show processes moving between scheduler execution contexts. | Research |
| B28 | Functional Core / Imperative Shell Map | Group pure transformations separately from state ownership and I/O. | Now |
| B29 | Effect Frontier | Highlight the precise source boundaries where data becomes an external side effect. | Now |
| B30 | Data Transformation River | Follow a value through parsing, validation, pattern matching, transformation, and output. | Now |
| B31 | Pattern-Match Decision Tree | Visualize clause selection, guards, and unmatched cases. | Now |
| B32 | Stateful Surface Area | Quantify processes, ETS, persistent stores, timers, and external effects relative to pure code. | Next |
| B33 | Protocol Dispatch Explorer | Show behaviours, implementations, protocol dispatch, and dynamic resolution. | Next |
| B34 | Dependency Direction Lens | Highlight application modules that improperly depend on adapters or infrastructure. | Now |
| B35 | Abstraction Value Review | Surface wrapper modules with little independent logic or meaningful dependency isolation. | Research |
| B36 | Minimality Diff | Compare revisions by removed abstractions, changed effect boundaries, and preserved tests. | Now |
| B37 | Distributed Erlang Connection Map | Nodes, connection changes, remote PIDs, and monitor/link behavior. | Next |
| B38 | Remote Message Journey | Send, serialization, transport, receive, and handling where observable. | Now |
| B39 | Node-Down Shockwave | Which monitors fire, remote calls fail, and processes react after a node disconnects. | Now |
| B40 | Registry and Name Resolution Lens | Local/global/third-party registries, registered names, and changing ownership. | Next |
| B41 | Partition Belief Map | What each node believes about cluster membership during a partition. | Next |
| B42 | Release Upgrade Timeline | Application versions, code loading, and process upgrade boundaries. | Now |
| B43 | Old-Code Retention View | Processes still executing old module versions after a deployment. | Now |
| B44 | NIF / Port Risk Boundary | Highlight operations that execute outside ordinary BEAM process isolation or may block schedulers. | Next |
| B45 | Chaos-to-Supervision Overlay | Correlate injected process kills with the observed OTP recovery path. | Now |

## Triage rationale

"Now" only means compatible with the source-first/Cinema fixture philosophy, **not** a requirement to build it in v1. The actual first implementation has fewer than ten panel types. "Next" generally depends on real bounded trace/state capture and a tested viewer. "Research" frequently needs cross-node clocks, scheduler-level observations, protocol-specific state or formal properties. Check the dedicated three experience specs before elevating any catalogue item.

## Evidence rule

If an idea requires state or causality data we do not have, render an explicit unavailable state, or omit the visualization entirely. A fancy but imaginary picture is worse than a precise source span and factual note.
