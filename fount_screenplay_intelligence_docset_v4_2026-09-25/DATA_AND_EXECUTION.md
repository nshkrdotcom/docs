# Durable data, state transitions and execution

Run records belong to `fount_run`; Core owns screenplay truth. Use `fount_runs` and the other prefixed tables below to avoid generic host table collisions. UUID IDs match current Core. Every reference to a revision, candidate, session or report must retain screenplay identity, enforced by composite foreign keys or a transactional check when the existing schema lacks the needed unique key.

## Schema contract

| Table | Required content and invariants |
| --- | --- |
| `fount_runs` | ID, owner type/ID, screenplay ID, `current_plan_version`, `current_policy_version`, status/stage, iteration, selected candidate, active step ID, current fencing token, parent/superseding run IDs, lock version, pause/stop request, timestamps. Unique `(screenplay_id,id)` and `(owner identity, client idempotency key)` with input fingerprint. Base/goal/scope/constraints are read from the current immutable plan, not independently mutable run fields. |
| `fount_run_plans` | `(run_id,version)` primary key, screenplay/base revision IDs, goal, scope, constraints/protected material, input brief/notes references and hashes, closed operation parameters, canonical plan fingerprint, authenticated author type/ID, change reason and timestamp. Append-only; each version is a complete snapshot. Composite run/screenplay and screenplay/base FKs. Deferred `(id,current_plan_version)` FK from run permits atomic initial insertion. |
| `fount_run_policies` | `(run_id,version)` primary key, closed canonical JSON, fingerprint, authenticated author type/ID and timestamp. Append-only. Resolve `:human` to an actual owner before storing. Deferred FK from run's current version permits atomic initial insertion. |
| `fount_run_steps` | ID, run/screenplay IDs, `plan_version`, `policy_version`, stage, iteration, branch identity, input revision/candidate, request fingerprint, idempotency key, linked session, output IDs, status, lease owner/token/expiry and heartbeat. Unique logical idempotency key; active-step selection and lease ownership are serialized under the run lock as specified below. This row is a mutable projection; it is not called immutable. |
| `fount_run_attempts` | Step ID, attempt number, fencing token, start/end, outcome, redacted error, provider request ID when available. Start/finish are controlled transitions; terminal attempt records are immutable. |
| `fount_run_events` | Append-only ordered events with run sequence, step/attempt, actor, policy/plan version, payload fingerprint and safe summary. Unique `(run_id,sequence)` supplies stable timeline order. |
| `fount_run_decisions` | Run/step/policy/plan, kind, prompt, finite options, candidate/base/content/check bindings where relevant, context fingerprint, status (`pending/resolved/superseded`), authorized principal, chosen response, authenticated respondent and timestamp. Unique logical checkpoint. Conditional update resolves once. |
| `fount_run_approval_attempts` | ID, run/screenplay/step IDs, optional human decision ID, plan/policy versions and fingerprints, candidate/base/content/check/packet bindings, frozen packet or immutable packet artifact reference, reviewer and approver identities, callback operation ID, fencing token, immutable received review and review hash, recommendation, stable approval ID/payload/hash when constructed, outcome/reason, acceptance ID when committed, timestamps. Unique callback operation ID, unique non-null approval ID and one attempt per resolved human approval decision. Lifecycle below preserves rejected, invalid, fenced and unknown attempts as well as accepted ones. |
| `fount_run_usage` | Stable operation ID, run/step/attempt/session, provider request ID, resource, reserved quantity, settled quantity, cost currency/unit and knowledge state, reconciliation state. Unique operation/resource; settle once. |
| `fount_run_deliveries` | Run, candidate or accepted revision, format/options fingerprint, output checksum/location, state/error. Unique delivery key. A retried export never accepts a second time. |

FKs bind step/run screenplay, `(run_id,plan_version)` and `(run_id,policy_version)` to the same run and its stored snapshots. Decisions, approval attempts and events retain the corresponding plan/policy bindings; decisions/approval attempts also bind step/run identity. The run's active step belongs to that run. A selected candidate must belong to the run's screenplay; Run additionally validates its base/lineage/scope against the current plan. A parent run belongs to the same screenplay. Nonnegative limits/counters and closed status vocabularies get DB constraints. Index runnable work, lease expiry, pending decisions, approval reconciliation and run timeline. Do not cascade-delete canonical records or erase accepted audit history on run deletion.

The host stores project ownership in its own table; a screenplay UUID is not proof of authorization. Headless callers provide a host authorization callback/context. No Core foreign key or query points to Run or host tables.

## Immutable work plans

A plan snapshot defines the requested screenplay work; the `plan` execution stage produces dramatic routes as step outputs. These are distinct records. At start, atomically insert plan version 1, policy version 1 and the run's pointers. Canonical plan hashing uses a closed schema and includes referenced input hashes. Steps, decisions and approval attempts keep their original plan version/fingerprint permanently.

`update_plan` requires the authenticated owner, expected current plan version and a stable command idempotency key. On a nonterminal run, goal clarification, added notes or changes to constraints/protected material within the same base and scope append a complete new plan version under the run lock. Changing base or scope, or requesting creative work after a terminal result, creates a linked successor run with its own plan version 1. A new plan cannot widen authority granted by policy; any required policy change is separately authenticated/versioned and applied atomically with the plan change. Loosening protection is an explicit owner action, never a generated suggestion silently applied.

Advance the plan pointer and fencing token, supersede affected pending decisions/approval attempts and checkpoint the restart stage in that same transaction. Re-evaluate intake/preflight and dependent investigation/plan/write/check steps; old outputs remain inspectable and may be reused only after explicit compatibility/check validation with new lineage. A goal/constraint change cannot reuse an old approval merely because pages match. Iteration/call/spend counters and unresolved reservations do not reset with plan versions; successor runs for continuing work carry the inherited resource commitments described by the budget contract. An identical plan-update retry returns its prior version/successor; different content under the same command key conflicts.

## Policy

The JSON example in `examples/policy.json` is normative for field shape. Unknown keys, invalid enumerations, negative/noninteger limits and mismatched completion/approver are rejected. Strings map through a closed lookup; never atomize arbitrary input.

Gates: investigation scope, strategy choice, candidate generation and iteration each choose `automatic` or `human`. Completion is `candidate` or `accept`. Candidate completion has no approver. Accept completion resolves an exact human/agent/service identity. An optional human fallback must resolve to the authorized project owner. Automated route selection follows a configured deterministic choice rule over saved routes/checks or a registered bounded reviewer callback; save compared IDs, evidence, uncertainty and reason. Unresolved material trade-offs create a human decision.

Append policies; never overwrite them. Tightening applies before the next consequential action, invalidates affected decisions and prevents stale in-flight results from auto-advancing. A looser policy requires an authenticated owner command and a new snapshot. It never retroactively authorizes an old action. Scope/base changes create a successor with new plan identity, explicit candidate reuse/rebase and fresh checks; parent work remains inspectable. Raising limits carries prior incurred usage/reservations forward for the continuing work; it cannot reset costs by changing version.

Default limits have separate meanings:

| Field | Default | Meaning |
| --- | --- | --- |
| `max_iterations` | 3 | Creative write/check cycles; the initial write counts as iteration 1 and each subsequent screenplay repair consumes another iteration. |
| `max_malformed_repairs_per_call` | 1 | Additional completions to correct malformed/schema-invalid output for one logical completion request. A logical call keeps its repair counter across transport retries and restart; a network retry does not reset it. |
| `max_transient_retries` | 2 | Additional transport/transient attempts per logical operation, counted across its original completion and malformed-output corrections. Retry only when the dispatch/reconciliation rules permit it. |
| `max_inference_calls` | 12 | Total provider dispatches, including original completions, malformed-output corrections, transport retries and automated reviews. |
| `max_measurement_states` | 500 | Total measured states across the run's sessions and attempts. |

All limits are capped by host ceilings and may be lowered. The UI shows effective values before launch. Run policy has no ambiguous `max_repair_rounds` field. At the inspected Workshop baseline, completion formatting recovery uses `:decode_repairs`, while Session's `:max_repair_rounds` controls candidate/check repair. The Run adapter supplies `:decode_repairs` from the remaining malformed-output allowance, disables Session's hidden creative repair loop (`max_repair_rounds: 0`) for Run-managed sessions, and schedules every creative repair through Run's durable `iterate` stage. Preserve standalone Workshop options. Persist all counters/reservations before dispatch; a new invocation must not restore a full repair/retry allowance.

## Run transitions

Statuses: `queued`, `running`, `paused`, `waiting_for_decision`, `waiting_for_approval`, `partial`, `completed_candidate`, `completed_accepted`, `stopped`, `failed`.

Stages: `intake → investigate → plan → write → check → decide → deliver`. `check → iterate → write` is the only automatic creative loop. Error retries are bounded attempts of the same logical step and do not consume a new creative iteration; they do consume resources.

| Event | Result |
| --- | --- |
| New authorized run | Queued at intake, no provider work in the start transaction |
| Successful claimed step | Persist outcome, next stage queued, append event |
| Human gate | Persist exact pending decision and matching waiting status atomically |
| Pause request | Commit any safe in-flight checkpoint, then paused; no new provider dispatch |
| Stop request | Checkpoint and stop; keep saved candidates exportable; block any later acceptance |
| Check failure with allowed repair | Record targeted finding and increment iteration within caps |
| Limit exhausted or ambiguous paid-call outcome | Partial with explicit reason, saved work and reconciliation/resume options |
| Stale canonical base | Waiting decision for explicit compare/rebase/successor; no silent retarget |
| Candidate completion | Decide records candidate intent, deliver succeeds, then completed_candidate |
| Accepted completion | Decide commits acceptance, deliver succeeds, then completed_accepted |
| Export fails after acceptance | Partial with acceptance ID retained; resume delivery only |
| Unrecoverable invalid contract | Failed with reason and preserved audit |

Resume is an authorized command from paused/partial after its cause is resolved; it never releases unresolved decisions or silently increases a cap. Terminal results may be exported again, but new creative work uses a successor run. Stop does not roll back an already committed acceptance; serialize stop/acceptance under the run lock and report which committed first.

## Durable approval attempts

Approval attempts belong to Run; Core `acceptances` remains the record of actual canon advancement. In Phase 02 build the table, constraints and persistence transitions; Phase 05 connects review callbacks, human approval and Core acceptance.

For an automated review, persist the frozen packet/bindings, exact authorized principals, callback operation ID, resource reservation and fencing token **before** dispatch. Callback receipt writes the exact safe review payload/hash and recommendation to the same attempt before any acceptance call. Do not store credentials or hidden provider reasoning. Outcome moves from `pending` to `reviewed`, then to `ready` only after review validation and durable construction of the approval ID/payload/hash. Terminal outcomes are `accepted`, `rejected`, `invalid`, `fenced` or `failed`; `unknown` is a reconciliation state when callback execution cannot be established. Record the review recommendation separately from outcome: an approving review is not an acceptance.

For a human final decision, `submit_decision` atomically records the authenticated response, resolves that exact pending decision and creates its linked `ready` approval attempt with immutable review, approval ID and payload. Then the shared approval bridge attempts Core acceptance in a subsequent short transaction. A resolved human choice means authorization was recorded, not that canon has already moved. Duplicate submission of the same response resumes/returns the linked attempt; it never creates another approval ID. An explicit human rejection resolves the decision with a rejected attempt and no approval payload.

Once set, packet bindings, received review and approval payload cannot be overwritten. An authorized new evaluation creates a new attempt linked to the prior one; fallback creates a new human decision/attempt. Controlled outcome changes append events. A late response may be stored as fenced evidence and have its usage settled, but cannot resurrect authority or move canon. On a validation/acceptance error, preserve any prepared approval payload and record the reason/outcome separately, even if the Core transaction rolls back. A confirmed retryable database rollback leaves the attempt `ready` with a recorded error and bounded retry; reserve terminal `failed` for nonretryable failure. After an uncertain commit result, reconcile the stored acceptance first.

On recovery, a replacement worker may reclaim an already persisted `reviewed`/`ready` attempt under the run lock when its semantic bindings and authority still match; record the new execution fencing token/event without replacing its review or approval identity. A `reviewed` attempt is validated without calling the reviewer again; a `ready` attempt rechecks current plan/policy/head/authority and submits the **same** approval ID and payload. A terminal fenced attempt is not revived. A lost response before review persistence uses provider reconciliation and the ordinary unknown-outcome rules; persisting an intent alone does not recover an unavailable response. An unknown attempt can become reviewed/rejected when its original callback is reconciled by the current authorized worker and its bindings remain valid; a separately authorized new callback uses a new attempt and preserves the original unknown record. Core acceptance and Run's accepted outcome/acceptance ID commit together. After a lost commit response, look up that durable identity before further work. Declined, invalid and fenced attempts survive even when no Core acceptance exists.

## Worker and crash protocol

1. Claim under a short run/step transaction. Lock the run row, inspect its active step and lease, and either retain its current owner or atomically assign/reclaim one step with a monotonically increasing run fencing token. Use PostgreSQL time for expiry; check status, current plan/policy, base, gate and reservations. Commit claim before IO. One eligible lease per run is enforced by this locked active-step transition, not a time-dependent partial unique index. Renewal requires the same active step/token and an unexpired lease; an expired worker cannot revive its authority by heartbeating.
2. Link an idempotently opened Workshop session before paid work. Existing `Session.open/4` generates a random ID; add an explicit operation key or caller-supplied ID with conflict validation and create/link atomically. A crash between open and link must be recoverable by that key without generating a second session.
3. Run one bounded domain action outside the transaction. Persist a provider-operation intent before dispatch; use provider idempotency keys when supported. Heartbeat separately. Killing the worker cancels local work when possible, but does not prove cancellation at a provider.
4. Commit the result only if claim token, plan/policy and input identity still match. Charge actual incurred usage even when the result is stale; keep useful output quarantined with provenance. A superseded worker cannot advance a run or accept content.
5. On restart, reconcile durable sessions/candidates/provider request records before dispatch. Never resume an operation known to be still in flight simply because its lease expired. For a lost paid response without provider idempotency/retrieval, mark outcome unknown and pause for explicit retry authorization; keep the unresolved reservation. Do not claim exactly-once provider billing.

Hash logical work from run, plan, policy, stage, iteration, branch, input revision/candidate and canonical request fingerprint. Retries reuse the logical key and get distinct attempt IDs. Renewed policy/input creates new work. A failed attempt does not erase an earlier success. Worker concurrency tests must use distinct DB connections and prove an expired worker is fenced at both domain persistence and Run completion. Add narrow Workshop fencing/operation hooks where its store can otherwise accept a stale write; pure Run row fencing alone is insufficient.

The guarantee is no duplicate committed logical outcome and no blind replay of ambiguous work. Lease exclusivity and fencing establish write safety; they cannot establish exactly-once remote execution or billing.

## Budget contract

Reserve atomically before each billable/limited action. Enforce `settled + unresolved reservations + new reservation <= ceiling` under the run lock. Session counters are subordinate to the remaining run allowance; loading/resuming a session cannot reset them. Settlement replaces a reservation once and records actual usage; do not sum cumulative session snapshots repeatedly. Use deltas against a persisted checkpoint or unique provider-operation usage records.

Represent money in integer micro-units with a currency, not a floating number or invented USD cents. Preserve provider-reported usage/cost, estimated amounts, and unknown amounts separately. If a monetary ceiling is configured, a new call needs a trustworthy upper-bound reservation based on explicit pricing and bounded tokens/units, or a provider-enforced cap. An unknown estimate alone cannot enforce a hard spend ceiling: pause before dispatch when no bound is available. A calls-only policy may allow unknown monetary cost and must say so. If actual billing exceeds an estimate, retain the real value, stop further work and expose the breach; never falsify it to fit the cap.

On a confirmed pre-dispatch failure release the reservation. On a timeout/ambiguous dispatch retain it until reconciled. Budgets cover strategy generation, candidate writing, repair, measurement, automated approval and requested rendering. Record per-run telemetry for stage duration, claims/retries, decisions, usage and stop reason without logging screenplay text, credentials or hidden provider reasoning.