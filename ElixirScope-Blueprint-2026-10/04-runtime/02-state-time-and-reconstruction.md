# State over time, reconstruction, and honesty of unknowns

## Central limitation

No generic debugger can reconstruct every historical piece of arbitrary BEAM state without recording enough information. Telemetry, ordinary traces and event timestamps don't reveal all private GenServer state, ETS changes, process dictionary contents, mailbox contents, external system state, or NIF effects. An interface that fills missing values from a convenient reducer will be persuasive and wrong.

## Classes of reconstructability

**Class 0 — no state capture:** only process lifecycle, calls or metadata; state unknown.

**Class 1 — point observation:** state/property captured at specific instants. UI can show *last observed at T* but not continuous value between observations.

**Class 2 — complete observed transition series:** a reliable pre/post snapshot or ordered diffs for a bounded callback/state owner. May reconstruct covered intervals if the capture protocol proves no transitions missing and snapshots are sufficient.

**Class 3 — validated deterministic replay:** requires captured inputs and all relevant nondeterminism, external-effect records and versioned code. This is substantially harder than storing state diffs and is not a v1 objective.

A movie timeline may have **holes**. Unknown is a first-class visible state.

## Two distinct things called "state"

1. *Process state*: a GenServer's callback state term, a gen_statem state/data pair, task local environment, process dictionary and mailbox. These are distinct and not interchangeable.
2. *Application/external state*: ETS, Mnesia, database, object store, remote device, network peer. A process state observation does not prove external transactional state.

A combined state pane should label owner, storage type and capture method. Avoid a single global "StateAt(time)" function that pretends to merge all components into an authoritative snapshot.

## Proposed observations

```
StateObservation {
  session_id,
  owner: ProcessIncarnation | ExternalResource,
  event_id,
  phase: before_callback | after_callback | explicit_snapshot | external_read,
  completeness: full | partial | metadata_only,
  value_status: present | redacted | truncated | unavailable,
  encoding: sanitized_json | binary_digest_only | omitted,
  source_ref?,
  provenance,
  payload_ref?
}
```

`after_callback` is an observation after some callback returns *in that instrumented program*, not a guarantee it has been durably persisted anywhere. A state-before/after comparison must be calculated only when owner identities and capture completeness match.

## Reconstruction algorithm guardrails

1. Choose a specific state owner and property scope.
2. Find an observed snapshot prior to target time within the same incarnation/code context.
3. Prove sufficient ordered transition coverage (no gaps, sampling, dropped buffers, unobserved mutation channels, external writes bypassing probes).
4. Apply validated diffs only if semantics/format are known and identifiers match.
5. Return `reconstructed_validated` with proof of coverage, otherwise `last_observed` and `unknown_gap`.
6. Mark cross-process or external state separately; do not apply GenServer-local transitions to another incarnation.

Without 3, the right answer is **unknown**. That can still be useful if the UI shows which observation would close the gap.

## Temporal window APIs

`events(session, from, to, actor_filter, limit)`; `state_observations(session, owner, property, window)`; `state_at(session, owner, property, time)` returns a value **with status and derivation** or explicit unknown. `causal_slice` never assumes wall-clock gives all causal edges.

Store raw time as integer/domain-specific; JavaScript JSON nanoseconds as decimal string. For distributed runs, wall time placement may have estimated offset and error; a cross-node timeline may render an uncertainty envelope.

## Source mapping across loaded code versions

Recorded event source identity must refer to the code actually executed. Store application version, BEAM module MD5/build marker or deployed revision whenever possible; configure probe to emit version manifest. For hot-code change, exact mapping may be unavailable and must be surfaced as an ambiguity. Never default to local checkout revision as proof of running code.

## Payload safety

Sensitive values should be redacted at recording source rather than only at viewer. Bound depth/size, handle non-JSON terms by safe metadata representations, do not create new atoms from untrusted payload, and never `binary_to_term` or `Code.eval_*` untrusted trace data without appropriate restrictions. PIDs/references/functions cannot be meaningfully serialized as transferable executable terms. A structured textual digest is enough for many investigations.

## Old TemporalBridge lesson

The older `TemporalBridge` code merged event value snapshots into a map to return an apparent state at T and grouped events by correlation ID plus timestamp ordering. That is an instructive prototype for queries but insufficient for authoritative historical state or distributed causality. Preserve its UI promise—time-aware inspection—while replacing its epistemic assumptions.

## Five state UX examples

- `state.status = :executing` recorded at 12:00:00.100; no later observation until crash: show last observed, interval unknown.
- `state.pending` after callback differs from before: show exact field diff if both complete snapshots match owner/version.
- Process exits and supervisor restarts another PID: separate tracks; no inherited in-memory state assumption.
- ETS change observed only through instrumentation wrapping one writer: classify other possible mutations as unobserved.
- External effect "request sent" with timeout: show attempted + uncertain result; do not label success/rollback.
