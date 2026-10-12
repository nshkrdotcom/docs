# Distributed BEAM: process identity, causal paths, supervision and failure topology

## BEAM-specific meaning

A BEAM application isn't just a call graph. It has actors/processes with isolated heaps and mailboxes, links/monitors, supervisors/restart strategies, protocol dispatch, ETS/shared tables, distributed nodes and process registration. Cinema should use these *native semantic dimensions* rather than rendering a generic distributed trace with decorative actor icons.

## Identity graph

`Cluster/Session → NodeIncarnation → ProcessIncarnation → LogicalRole (optional, many-to-one)`. Node incarnation includes node name + VM boot identity (as available) + session scope; process incarnation includes node incarnation + PID representation + observation boundaries. Registered name/child ID/logical workflow can connect roles across restarts with provenance; such mapping can be ambiguous when dynamic supervisors create multiple workers.

## Supervision model

Static source analysis may identify `Supervisor` child specs, `use GenServer`, callbacks, `DynamicSupervisor` and restart strategies in code. Dynamic capture may observe process spawn, link/monitor, exit, restart and registered names. These must be distinct evidence layers. In dynamically created workers, the exact runtime child spec may not be known from static source alone.

**Useful view:** a timeline where a stable logical role row contains multiple process lifelines, linked to the controlling supervisor at relevant times; the UI shows restart count, recorded reasons, code revisions and state discontinuity, not an imagined uninterrupted state.

## Message causality

An observed `send` is not necessarily an observed `receive`. A matching send/receive requires reliable correlation: `seq_trace` token, explicit correlation ID/monotonic per-process token, or an instrumented message envelope. Content equality and nearby timestamps are insufficient, especially for repeated commands.

Build edges with `basis`:

- `same_process_order` if capture provides ordered local event sequence.
- `propagated_seq_trace` if relevant send/receive token and collector output match.
- `explicit_message_id` from application instrumentation.
- `span_parent` from propagated tracing context, for explicitly instrumented operations.
- `user_asserted` if reviewer manually links for investigation; not treated as recorded truth.

Edges based only on structural expectation should be separate `possible_flow` relations.

## Causal partial order

The `happened_before` relation is transitive. Not every pair of events is comparable. A useful UI highlights a selected event's known causal predecessors and successors, plus events with unknown relationship. Sort by wall time only for display with clock uncertainty; don't derive causal order from it.

When two concurrent branches lead to the next point of interest, choose a user-visible branch or represent grouped successors. A chronological player can still show a plausible time ordering while labeling it as a presentation projection.

## Node clocks

Monotonic time is suitable within a node/clock domain but not inherently cross-node comparable. Wall clocks may drift or jump. If we measure offset and uncertainty (e.g. through external clock-sync method), store `offset_estimate` and `max_error` per interval. Otherwise render coarse placement with uncertainty or causal-only layout.

Avoid fabricating microsecond precision in multi-node UI just because events carry microsecond timestamp fields.

## Partition behavior

A recording with node B absent or recorder disconnected can still yield useful partial evidence. Missing session segments should be visualized as unavailable nodes/lanes and gaps. The import pipeline must not assume all nodes were continuously reachable or capable of contributing traces.

## OTP-specific views worth prototyping

- Supervision blast radius: which children terminated and restarted under observed strategy.
- Message/callback corridor: selected incoming request → callback → outgoing effects.
- Mailbox pressure overlay: recorded queue length samples; never infer exact queue state between samples.
- Actor lifecycle filmstrip: spawn, init, processing, exit, restart, new incarnation.
- State ownership: logical process owner and external durable state, with handoff boundaries.
- Dead-letter/timeout path: send, absence of observed response, timeout/retry, but no assertion that receiver never acted.
- Cross-node causal fork: repeated command flows and divergent outcomes.

## Counterexample-first investigation

Take a failed property-based test that generates a minimal command/restart sequence. The output should synchronize the failure invariant, event graph, state observations, and exact recovery source. A small counterexample is more intelligible than massive production traces and far safer to implement first.

## Grounding and limitations

Source: OTP's documented `trace`/`seq_trace`, and old Atlas notes `0002`, `0003`, `0006`. Our protocol/schema, role grouping and visual metaphors are *design recommendations*. Validate specific trace flags and OTP interactions with automated tests rather than assuming every BEAM version exposes identical behavior.
