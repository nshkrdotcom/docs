# Phase 03 — durable execution

Entry: Phases 01–02 complete with corrected source and runtime reports. Read worker, crash, budget and immutable-binding contracts in `DATA_AND_EXECUTION.md`, plus actual Workshop Session/Store/Budget/Completion implementations.

## Deliverable and scope

A reusable Run engine can claim, execute, checkpoint and recover one bounded operation safely, with durable resource accounting. Prove the engine with fault-injected test operations and at least one real Workshop session/candidate operation using scripted providers. The full intake→investigate→plan→write→check pipeline and strategy decision command belong to Phase 04.

## Implementation checklist

1. Implement pure transition evaluation, public `step` for one claimed unit, a configurable worker/poller, short transactions and durable events. Bind each unit to immutable plan/policy/input fingerprints. Validate stage handlers through a closed registry; unavailable later-stage handlers return explicit errors, never fake successful outcomes.
2. Serialize active-step assignment/reclaim under the run lock, with PostgreSQL time, monotonic fencing tokens and guarded heartbeat. Only the current unexpired owner may write active results. Apply fencing to session/candidate persistence as well as Run completion.
3. Add the narrow Workshop idempotent open/link and operation-identity seams. Save the session before paid work and recover a crash between opening and linking without another session. Preserve existing standalone Session APIs.
4. Persist provider intent before dispatch and reconcile saved sessions/candidates/request records on restart. Save partial/late output with provenance. Known success is reused; unavailable paid responses become unknown/partial and retain their reservations instead of being replayed blindly.
5. Implement atomic run reservations/settlement and subordinate session allowances. Persist distinct malformed-output and transient retry counters across restart. Pass remaining `:decode_repairs`, disable the inner creative repair loop for Run-managed sessions and account for every provider dispatch/measurement. Phase 04 schedules creative iteration using these bounds.
6. Honor persisted pause/stop requests, policy/plan invalidation and budget stops before the next dispatch. Public steering commands arrive in Phase 05; tests may install their persisted request state through the real storage primitives. Add progress/usage inspection and safe telemetry.
7. Provide a real Workshop open→link→execute/resume→saved candidate smoke fixture through the engine boundary. Use existing typed edits and scripted Inference; do not replace domain behavior with stub candidate strings or a second storage system.

## Runtime acceptance

- **W01:** One claimed real Workshop operation persists session, candidate, checks/usage and step result against the correct input. Restart reuses durable output and canon remains unchanged.
- **W02:** Inject crashes at claim, session open/link, intent creation, dispatch/response, candidate persistence and step completion. Recover known success once; ambiguous paid outcomes pause with retained reservation.
- **W03:** Competing initial/reclaim workers produce one authorized claimant and no duplicate committed logical outcome. Expired owners cannot revive leases or write through old tokens. Test with independent PostgreSQL connections; external IO holds no row locks.
- **W04:** Reservation races, duplicate settlement, cumulative session usage, unknown cost, monetary bounds/overrun and resource exhaustion behave as specified. All retry/formatting dispatches count and limits survive reload.
- **W05:** Pause/stop flags and newer plan/policy bindings fence an in-flight result before advancement or another dispatch. Late usage remains charged and partial work stays inspectable.
- **W06:** Session/open operation keys and recovery cannot create duplicate sessions or duplicate committed candidates. Standalone Workshop APIs still work, and stale workers are fenced at domain persistence, not only at the Run row.
- **W07:** Missing handlers, invalid contracts and unavailable services produce explicit error/partial evidence. The worker never reports unimplemented later-stage work as successful, and no live provider is needed for the proof.

Run common gates, Run database concurrency/recovery tests and the real scripted Workshop integration smoke. This phase proves the execution machinery; screenplay journey acceptance belongs to Phase 04 and completion/export to Phase 05.

## Handoff boundary

Web returns two ZIPs and Phase 03 QC handoff. Runtime repairs/certifies W01–W07, records actual failure-injection and DB evidence, commits/pushes and prepares Phase 04 inputs. It does not implement the complete screenplay pipeline in this cycle.