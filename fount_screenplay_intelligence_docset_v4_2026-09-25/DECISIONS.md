# Settled implementation decisions

| ID | Decision and reason |
| --- | --- |
| D01 | Six implementation phases, each with offline delivery then runtime QC. Core safety and Run storage are separate deliveries, as are worker durability and screenplay orchestration. QC is integrated into every phase. |
| D02 | Add a headless `packages/fount_run` and a separate `apps/fount_web` host in the same Fount poncho. The current proposal includes a writer-facing app as well as orchestration. |
| D03 | Reuse existing Core/Workshop/Intelligence/Observe functionality. Inspect actual APIs at every input revision; no general graph engine or agent platform is required. |
| D04 | Enforce one post-genesis approval transaction for every principal and origin. Remove actual `save_edit` head mutation bypass; deprecation prose alone is insufficient. |
| D05 | Approval identity is established by trusted host context and matched to policy; a JSON type/ID alone grants no authority. Core remains independent of Run. |
| D06 | Run uses caller-owned Repo/shared DB, prefixed tables, composite identity constraints and forward migrations. Preserve historical records without inventing principal types. |
| D07 | Steps/attempts have controlled mutable lifecycle projections; plans/policies/events, received review/approval payloads and terminal results are immutable. This resolves the proposal's contradictory “immutable started→succeeded row” wording. |
| D08 | Leases, fencing, operation keys and short transactions surround external work. Unknown provider outcomes are explicit; no exactly-once billing promise. |
| D09 | Durable reservations cover all sessions/attempts and separate actual, estimated and unknown cost. Monetary ceilings require enforceable bounds before dispatch. |
| D10 | Scope/base changes create linked successor runs with fresh decisions/checks. Goal/notes/constraint steering within the same base/scope appends an immutable plan snapshot. Pending approvals never survive a changed plan/content/check/policy context. |
| D11 | Completion status follows delivery, while acceptance identity is recorded independently so export failure can resume without a second canon change. |
| D12 | All runtime handoffs repeat the absolute code/docs/dependency paths. `~/jb` resolves to the same canonical docs tree; never maintain duplicate copies. |
| D13 | One state JSON selects the first incomplete phase; generated current handoff replaces repeated historical banners. Both agents update state; user never changes phase instructions. |
| D14 | Web chat receives Repomix XML (`docset.xml` and `fount.xml`, plus dependency XMLs), has no Elixir, and creates/edits code/tests/docs. It returns two ZIPs plus a standalone QC Markdown also inside the docset. Reuse the existing strict overlay applier and snapshot sealer. |
| D15 | Runtime agent starts after the user has applied both ZIPs, committed and pushed both repositories; it repairs and certifies that phase, commits/pushes updates, and prepares fresh next inputs. No automatic next-phase code work in the same cycle. |
| D16 | Deterministic engineering gates are required. Paid live providers and human usefulness studies are optional and remain truthful separate evidence. No fabricated creative certification. |
| D17 | Store complete append-only `fount_run_plans`; `fount_runs.current_plan_version` points to one, and steps/decisions/events/approval attempts bind actual same-run plan versions. A version number without a snapshot is insufficient provenance. |
| D18 | Phase 02 supplies decision persistence, Phase 04 implements canonical `submit_decision` for strategy gates, and Phase 05 extends it. No temporary decision resolver. |
| D19 | Store durable Run approval attempts before callbacks and exact reviews before acceptance. Preserve declined, invalid, fenced and unknown attempts; persist stable approval ID/payload before Core. Standalone callers retain their own stable identity/payload. Core acceptances remain canonical commit truth. |
| D20 | Final human approval is a typed decision. `approve_run`, CLI `approve` and web forms delegate to the exact `submit_decision` transition; automated results share its acceptance bridge. No parallel human-approval state machine. |
| D21 | Separate creative `max_iterations`, formatting `max_malformed_repairs_per_call` and transport `max_transient_retries`. Count every dispatch and persist allowances across restart. Disable Workshop's inner creative repair loop only for Run-managed work. |
| D22 | Enforce one eligible active-step lease under the run row lock with monotonic fencing, not a clock-dependent uniqueness predicate. Promise no duplicate committed logical outcome and no blind replay of ambiguous work; external execution/billing can remain uncertain. |
| D23 | During all six phases, docset files are added or updated in place, never deleted/renamed. Retain superseded paths and historical evidence; refresh guards the prior path inventory. This makes the complete ZIP applicable without manual cleanup. |
| D24 | Split the former combined Foundation into Core approval safety (01) and Run foundation (02); split combined Execution into durable execution (03) and screenplay pipeline (04). Control/delivery is 05 and web/integration is 06. State and active specs use only these numbers; old paths remain redirects. No implementation completion is inferred from this refactor. |
| D25 | Phase 01 upgrades pre-existing pending candidates by attaching the new authoritative check snapshot only on an exact idempotent `save_candidate/3` replay. Changed payloads still conflict; already-recorded acceptances remain `historical` and no legacy actor string is reclassified as a principal. |
| D26 | Phase 02 runtime QC found that the installed docset commit lacked the supplied Phase 02 handoffs and still said `NOT_STARTED`. Reconstruct missing handoffs only from the user-supplied handoff, the installed Fount manifest and executed QC, label their provenance, preserve all existing docset files, and record the discrepancy. Do not claim original docset ZIP byte verification or reapply either ZIP. |
| D27 | Phase 03 is the first Run phase that performs real Workshop orchestration, so `fount_run` may depend on `fount_workshop`. Core remains independent of Run, and Run has no direct SDK/Inference/ASM dependency. |
| D28 | Preserve standalone Workshop APIs by making operation identity and transaction-local fencing guards optional seams. Run supplies stable operation keys and a guard; Core persistence stays generic and imports no Run module. |
| D29 | Provider execution uses durable intent before dispatch. Persisted known success is reusable; an expired dispatched request without a saved response is unknown/partial, retains its reservation, and is not blindly replayed. Late provider output/usage may still reconcile after fencing so paid work remains inspectable/accounted. |
| D30 | The Phase 03 closed stage registry enables only the single real Workshop write operation. Missing later-stage handlers return explicit errors; the full screenplay stage graph and strategy decisions remain Phase 04. |
| D31 | The user-applied Core operation-key migration shared Ecto version `20260928010000` with the verified Phase 02 Run foundation. Runtime QC moved only the new Core migration to `20260928011000`, preserving the Run version and proving fresh and populated upgrades. Distinct migration versions are required even when packages expose separate migration directories on one Repo. |
| D32 | A dispatched provider failure consumes its reserved inference call. For a hard money ceiling, Run requires a same-currency estimate before dispatch, settles reported microunit cost, retains charges on overrun or unknown actual cost, and pauses further dispatch. This is a bounded accounting rule, not a model-pricing inference. |
| D33 | Phase 05 pause prevents new provider/approval dispatch but does not pretend an already-running external call never happened; stop is the serialized terminal control, increments fencing and blocks any later acceptance from a delayed callback. |
| D34 | Callback response evidence is append-only safe evidence and may be recorded after fencing, but a terminal approval attempt (`accepted`, `rejected`, `invalid`, `fenced`, `failed`) cannot be resurrected into reviewed/ready state. |
| D35 | Rebase uses the actual Workshop three-way rebase API and produces fresh candidate/check bindings on a linked successor Run. Writer replacement text likewise creates a new candidate; reviewed candidate bytes are never changed in place. |
| D36 | Core acceptance and Run terminal completion are intentionally separate. Acceptance may move canon once, but `completed_accepted` or `completed_candidate` is written only after the selected delivery bundle succeeds; per-format export failure stays visible/retryable without a second acceptance. |
| D37 | Phase 05 CLI/API accepts only request data from JSON. Repo, trusted actor context, service modules/processes, artifact root and PDF runtime/options are host configuration. The headless slice adds no Phase 06 web/Phoenix surface. |

Review resolution: the seven supplied critique points identify real specification gaps; D17–D23 resolve them within the existing phases. A dedicated approval-attempt table is a chosen explicit persistence contract, not a claim that generic events could never store the same facts. The standalone Workshop wording refers to the new authorized API, and approval-ID ownership is now explicit. These contracts carry into the six-phase split; the refactor adds handoff boundaries without expanding product scope.

Add decisions when actual source or explicit user steering resolves a material ambiguity. Do not reopen these as routine permission questions. Deferred product work: team permissions, collaborative full editor, arbitrary workflow graphs, custom agent platforms, new speech infrastructure and hosted multi-user onboarding.

## Phase 04 implementation decisions (offline)

- Strategy planning is explicitly split from materialization. Investigation persists first; `Session.plan_only/4` is seeded from that saved investigation and no candidate may exist before the strategy decision.
- Human strategy resolution is a production Run transaction, not a test resolver. Its response binds actor, context fingerprint, plan/policy versions, canonical base and one saved route; the same transaction schedules the idempotent write step.
- Iteration is a durable Run stage with Workshop's inner creative repair disabled. Repairs compile against the immutable canonical base, retain parent-candidate/report lineage and never accept intermediate candidates.
- Phase 04 stops at saved `candidate_review` or unresolved `iteration` decisions. Phase 05 owns later decision resolution, acceptance and delivery.

## Phase 04 runtime QC resolution

- The saved investigation's `uncertainties` field must carry through the strategy checkpoint and subsequent request envelope; visible uncertainty is part of the human route decision evidence.
- Strategy submission reconstructs its write request from the persisted successful plan-step result, including the linked strategy session, report IDs and uncertainty. The immutable original step request alone predates those values. Resolution and successor insertion remain one transaction.
- No Phase 04 schema migration is added. Fresh Core→Run migration and the populated Phase 03 upgrade regression passed; Run-managed Workshop repair stays disabled while durable `iterate` owns the creative allowance.
