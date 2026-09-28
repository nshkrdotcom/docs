# Phase 02 implementation matrix — Run foundation

Status: **OFFLINE_IMPLEMENTED**. Runtime certification remains pending; no R01–R06 row is marked passed by source-only work.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Acceptance mapping

| ID | Source implementation | Written proof | Runtime status |
| --- | --- | --- | --- |
| R01 | New `packages/fount_run` package, host-free `FountRun.Application`, migration export in `FountRun.migrations_path/0`; root `mix.exs`, CI, architecture/final-acceptance surfaces and package-count assertions updated from four to five libraries while Core remains Run-independent. | `packages/fount_run/test/storage_contract_test.exs`; updated architecture tests; `scripts/tests/test_run_foundation_source.py`; source-only final-acceptance inventory. | **NOT_RUN** — needs Mix/BEAM/docs/Hex/runtime startup evidence. |
| R02 | Forward migration `20260928010000_create_run_foundation.exs` creates all ten prefixed Run tables with composite same-run/same-screenplay bindings, indexes, state/resource checks, deferred current plan/policy/active-step bindings and immutability guards. Caller-owned Repo is used; no second DB configuration is introduced. | `packages/fount_run/integration/storage_constraints_test.exs`; `run_foundation_test.exs` Core→Run migration harness and invalid cross-reference cases. | **NOT_RUN** — needs fresh + prior-Core-schema PostgreSQL migration/constraint execution. |
| R03 | `FountRun.start_run/4`, `get_run/3`, `list_runs/3`; trusted `ActorContext`; closed plan/policy input; atomic run + plan/policy v1 persistence; caller-bound idempotency key/fingerprint; unsupported future start options fail closed; no provider dependency or dispatch. | `plan_policy_test.exs`; `run_foundation_test.exs` authorized create/read/list, exact replay/conflict and provider-free cases. | **NOT_RUN** — needs ExUnit/PostgreSQL execution. |
| R04 | Canonical closed-map hashing in `Plan`/`Policy`; append-only plan/policy snapshots and events; owner-authorized expected-version pointer changes preserve history; step/attempt identity is retained on events. | `plan_policy_test.exs`; `run_foundation_test.exs` snapshot append/history/immutability tests; migration append-only triggers. | **NOT_RUN** — needs formatter/compile/PostgreSQL execution. |
| R05 | Atomic pending-decision insert/resolve storage with authenticated response identity and replay/conflict semantics; durable `ApprovalAttempt` lifecycle stores immutable received review and approval identity/payload; nonaccepted outcomes persist; `accepted` is explicitly blocked with `:acceptance_bridge_required`, so Phase 02 cannot move Core canon. | `run_foundation_test.exs` single-resolution, competing-task concurrency and approval-attempt immutability/no-canon cases. | **NOT_RUN** — needs real concurrent PostgreSQL connections and Core head verification. |
| R06 | Controlled step/attempt start/finish storage, active lease/fence identity fields, usage reservation/settlement identity and delivery candidate-vs-accepted-revision identity/result replay. No worker claim/reclaim/provider recovery algorithm is implemented. | `run_foundation_test.exs` step/attempt/event, usage, lease identity and delivery reload/conflict cases. | **NOT_RUN** — needs PostgreSQL execution/reload proof; Phase 03 behavior is intentionally absent. |

## Phase boundary

Implemented here: durable schema and persistence primitives required by Phase 02, plus the only public commands the phase makes real (`start_run`, `get_run`, `list_runs`).

Deliberately absent: worker claim/reclaim/renew, provider dispatch or reconciliation, supervised polling, Workshop operation execution, strategy materialization, canonical `submit_decision`, policy-driven callback dispatch, Core acceptance bridge, and delivery IO. Those belong to Phases 03–05 and are not successful no-ops in this package.

## Dependency disposition

System One SDK, Inference and Agent Session Manager were supplied and inspected as sealed references. Phase 02 adds no source changes to them and `fount_run` declares no provider/ASM/SystemOne/Inference dependency. Their exact snapshot identities are recorded in [PHASE_02_INPUTS.json](PHASE_02_INPUTS.json).
