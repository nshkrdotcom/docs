# Architecture and implementation boundary

## Package layout

Implement `FountRun` in `/home/home/p/g/n/fount/packages/fount_run` in Phase 02, after Phase 01 establishes Core approval safety. Add the writer host at `/home/home/p/g/n/fount/apps/fount_web` in Phase 06. Both are independent Mix projects in the poncho workspace, not an umbrella. Register them explicitly in root `mix.exs` and update package-count assertions, CI, architecture checks, release lists and Repomix coverage when each appears.

```text
FountWeb → FountRun → FountWorkshop → FountIntelligence → FountObserve
                 ↘ Fount Core ← domain persistence and canon acceptance
Workshop → Inference (generation)
Observe  → SystemOneSDK (measurement)
```

The diagram describes ownership; inspect each package's actual dependency declarations. Core never reads Run tables or calls Run modules. Run owns orchestration, and references Core's stored candidates, revisions and reports. It does not copy those models into a second canonical store. The host owns authentication, project ownership, service construction, notifications and presentation. `fount_observe` is a measurement package, not the general telemetry layer described in the old proposal. Emit ordinary `:telemetry` events for run operations without inventing an Observe API.

Run uses a caller-supplied Ecto Repo connected to the same PostgreSQL database as Core. It exports `FountRun.migrations_path/0`; the host and test harness explicitly run Core migrations followed by Run migrations. Do not create an independently configured second database or start the caller's Repo twice. Its supervision tree owns configured workers only; application startup without a configured host is safe.

Use existing Mix conventions and compatible installed versions. At inspection, the workspace declares Elixir `~> 1.18`, while Workshop declares `~> 1.19`; record and resolve the supported workspace toolchain through actual QC. Do not copy the proposal's sample dependency helper as a new repository policy. Follow current sibling helpers and any current repository instructions. SDK/Inference/ASM are reference inputs; this plan does not require changes to their repositories.

## Existing source anchors (verified 2026-09-28)

| Capability | Actual source / contract |
| --- | --- |
| Core SQL persistence | `/home/home/p/g/n/fount/packages/fount/lib/fount/persistence.ex`; `create/4`, `save/4`, `save_edit/4`, `accept_candidate/3` |
| Core review gate | `/home/home/p/g/n/fount/packages/fount/lib/fount/writing/review_gate.ex`; currently consumes maps and a writer actor |
| Schema | `/home/home/p/g/n/fount/packages/fount/priv/repo/migrations`; existing tables use UUIDs and composite screenplay identity |
| Workshop sessions | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/session.ex`; `preflight/3`, `open/4`, `start/4`, `resume/3`, `get/2` |
| Route generation/materialization | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/strategy.ex`; `generate/5`, `materialize/4` |
| Store boundary | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/store.ex`; `%Store{repo: repo}`, whitelisted actions |
| Review/export | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/review.ex`; `packet/2`, `accept/4`, `export/4` |
| Other acceptance entry | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/acceptance.ex`; forwards through Store |
| Rebase | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/rebase.ex`; `run/5` with explicit choices |
| Invocation budget | `/home/home/p/g/n/fount/packages/fount_workshop/lib/fount_workshop/writing/budget.ex`; in-memory inference/measurement counters, not a durable run budget |

`Session.open` performs no generation but creates its own ID. `Session.resume` can execute the whole saved operation. Neither proves a durable run-stage boundary nor closes the session-link crash window. Phase 03 adds narrow supported Workshop seams for idempotent open/link and operation recovery. Phase 04 adds preparation-only execution and selected-route materialization where needed. Preserve standalone Workshop workflows and their tests. Never call a private function from Run or regenerate strategies merely to cross a checkpoint.

## Target public API

These are new contracts, not claims that functions already exist. Implement them with typespecs, docs and tagged errors. Commands receive a trusted actor context separately from untrusted request data. Supply services explicitly; never persist credentials, provider clients, PIDs or functions.

```elixir
FountRun.start_run(repo, attrs, actor_context, opts \\ [])
FountRun.get_run(repo, run_id, actor_context)
FountRun.list_runs(repo, filter, actor_context)
FountRun.step(repo, run_id, services, opts \\ [])
FountRun.submit_decision(repo, decision_id, response, actor_context)
FountRun.update_plan(repo, run_id, plan, actor_context, opts \\ [])
FountRun.update_policy(repo, run_id, policy, actor_context, opts \\ [])
FountRun.pause_run(repo, run_id, actor_context)
FountRun.resume_run(repo, run_id, actor_context)
FountRun.stop_run(repo, run_id, actor_context)
FountRun.approve_run(repo, run_id, response, actor_context)
FountRun.deliver(repo, run_id, destination, actor_context, opts \\ [])
```

`start_run` attrs include screenplay/base IDs, goal, scope, constraints, policy and a client idempotency key. Import/brief initialization lives at the host/CLI intake boundary and records genesis before creating the run. `step` executes at most one claimed unit and returns its durable outcome; a supervised poller repeatedly calls it. Run commands return `{:ok, value}` or `{:error, reason}`; use stable reasons for unauthorized, stale version, stale base, already resolved, budget exhausted and ambiguous provider outcome. Repeated identical idempotent requests return their recorded result; mismatched payloads under the same key conflict.

`start_run` persists work attributes as immutable `fount_run_plans` version 1, with `current_plan_version` on the run. `update_plan` requires expected plan version and command idempotency key; it appends a same-base/same-scope snapshot or returns the linked successor run for a changed base/scope. It follows the invalidation, resource and authorization rules in `DATA_AND_EXECUTION.md`.

`submit_decision` is the canonical human decision transition, including final approval/rejection. Phase 02 supplies its persistence primitives; Phase 04 implements the production command for strategy checkpoints; Phase 05 extends its typed cases. `approve_run` is only a convenience wrapper: its response must supply the exact `decision_id`, context fingerprint and review/choice; it checks that the decision belongs to the given run and delegates to `submit_decision`. It must not infer a newer pending decision or implement another state transition. CLI `approve` and web approval forms use this same path. Automated callbacks enter the same approval-attempt/acceptance bridge after policy validation, without impersonating a human decision.

## Principal boundary

An actor context is host-authenticated identity plus host-established authority for a screenplay. A browser or model cannot construct one by posting `actor_type`. Core's authorization callback/context is supplied by trusted host code, independent of the approval payload. Run additionally checks the policy's exact approver and version. A local CLI uses an explicitly configured local owner identity and authority; do not default to `human` or `unknown`.

The first host has one owner per project and an explicit allowlist of configured automated approvers. An automated approver callback receives a frozen review packet and returns a typed review/recommendation; Run validates it before constructing approval. It cannot change the policy. Do not add a general agent platform, dynamically load module names from JSON, or treat a model's claim to be authorized as evidence.

## Implementation module map

Run: `Plan`, `Policy`, `Principal`, `Persistence`, `Engine`, `Worker`, `Budget`, `Decision`, `ApprovalAttempt`, `ApprovalBridge`, `Delivery`, `Stages.*`, and public `FountRun`. Keep transition/plan/policy evaluation pure; keep SQL/IO in explicit boundaries. Use one consistent schema layer with SQL locks where required rather than multiple competing repositories. Host: Repo configuration, owner/project mapping, router, LiveViews, configured provider/approver services and worker supervision.

All names beyond the source-anchor table are target design. Refine local file granularity as needed while keeping public semantics, dependencies and acceptance tests intact; record any material change in `DECISIONS.md`.