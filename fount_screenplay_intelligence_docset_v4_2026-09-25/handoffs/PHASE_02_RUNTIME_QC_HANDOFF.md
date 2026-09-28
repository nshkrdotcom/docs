# Phase 02 — runtime QC and completion

The user has already applied both Phase 02 ZIPs to their respective repositories, committed and pushed both repositories. **Do not reapply either ZIP.** Start from the installed commits and repair/certify only Phase 02 — Run foundation. Do not implement Phase 03 worker behavior.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Phase identity and source delivery

- Phase: **02 — Run foundation**
- Current docset state on delivery: `OFFLINE_IMPLEMENTED`
- Prior Phase 01 verified Fount commit recorded by the input docset: `e79510008735220545f4ee9322bade127c868d40`
- Fount input Repomix: `fount(20260928-214212).xml`, SHA-256 `27aaf9c0059cb8a4093a63e8caaa98d1598e9afc7d9d908b2e29ae777d04130e`, 3485104 bytes; no reliable current Git commit is embedded in the supplied XML.
- Docset input Repomix: `docset(1).xml`, SHA-256 `08f521d050e104244f8acf6b88dec80c1e6ca7a6407b7aa9fba96b2cf01ace68`, 263126 bytes.
- Dependency snapshots: System One SDK `e757598a89e549274b979f0e77c6a4b2b6667752`, Inference `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`, ASM `dc28a00e5ff6ad6932411334241ec8d9efda8857`; inspected references only, no dependency repository changes.
- Delivered Fount overlay: `fount_run_phase_02_overlay.zip`, SHA-256 `cdeb0480d4852d4da643d2e60237879abf1e89a8ce43aefe2211e3e60658541b`.
- Copied overlay manifest: `handoffs/PHASE_02_OVERLAY_MANIFEST.json`, SHA-256 `9c9f228b60c0352b0a70f001a2512b2577f1327219068a1f480ed94b0ba8e062`.
- Source operations: **45** total — 17 modify, 28 add, **0 deletions**.

Read `AGENT_START_HERE.md`, `state.json`, `phases/02_RUN_FOUNDATION.md`, `DATA_AND_EXECUTION.md`, `REVIEW_AND_APPROVAL_MODEL.md`, `RUNTIME_QC.md`, `handoffs/PHASE_02_INPUTS.json`, `handoffs/PHASE_02_IMPLEMENTATION_MATRIX.md`, `handoffs/PHASE_02_OFFLINE_HANDOFF.md`, this handoff and the copied overlay manifest before execution.

## What was implemented

Phase 02 adds `packages/fount_run` as the fifth Fount library and implements only the durable Run foundation:

- Public Phase 02 API: `FountRun.migrations_path/0`, `start_run/4`, `get_run/3`, `list_runs/3`. No future command is exposed as a successful no-op.
- Trusted `FountRun.ActorContext`, closed `Plan`/`Policy` validation, stable canonical fingerprints and caller-bound idempotent run creation.
- One forward migration, `packages/fount_run/priv/repo/migrations/20260928010000_create_run_foundation.exs`, containing all ten required Run tables plus composite FKs, indexes, state/resource constraints, deferred current plan/policy/active-step bindings, append-only guards and immutable terminal/received-payload guards.
- Atomic initial run + plan/policy version 1 storage, read/list authorization, append-only plan/policy/event primitives, controlled step/attempt storage, storage-only active lease/fence fields, decision persistence/resolution, durable approval attempts, usage reservation/settlement and delivery identities/results.
- Approval attempt `accepted` storage is deliberately rejected with `:acceptance_bridge_required`; this phase does not move Core canon.
- Root workspace, CI, architecture/final-acceptance and package-count tooling now recognizes five library projects. Core remains independent of Run. `fount_run` has no provider/ASM/SystemOne/Inference dependency and does no provider work.

Phase 03 behaviors are absent by design: no worker claim/reclaim/renew algorithm, provider dispatch, provider accounting recovery, supervised poller, durable crash recovery or Workshop operation execution.

## Validate the already-applied payload

First record the actual user-applied commits and branch/dirty state:

```bash
cd /home/home/p/g/n/fount
git status --short
git rev-parse HEAD
git branch --show-current

cd /home/home/p/g/n/brainstorms
git status --short -- nshkrdotcom/docs/20260928/fount
git rev-parse HEAD
git branch --show-current
```

Do **not** run the overlay applier. Verify the installed Fount paths against `/home/home/jb/docs/20260928/fount/handoffs/PHASE_02_OVERLAY_MANIFEST.json`: every declared result hash must match unless an intentional post-apply commit changed it, and the manifest declares zero deletions. Inspect and record any mismatch instead of overwriting it.

Record actual toolchain versions before QC:

```bash
cd /home/home/p/g/n/fount
elixir --version
mix --version
psql --version
```

Use an isolated PostgreSQL test database and the repository's existing `FOUNT_TEST_PGHOST`, `FOUNT_TEST_PORT`, `FOUNT_TEST_USER`, `FOUNT_TEST_PASSWORD` and `FOUNT_DATABASE_URL` conventions. Never print the password.

## Source-only validation already performed

The web implementation environment had no Elixir/Erlang runtime. These are source/package-delivery checks only:

- `python3 -m unittest scripts.tests.test_run_foundation_source scripts.tests.test_phase_one_source` — **PASS, 19 tests**.
- `python3 scripts/final_acceptance.py` — **PASS, 16 source-only checks**; it explicitly does not establish Mix/BEAM/PostgreSQL health.
- `python3 -m unittest discover -s scripts/tests -p 'test_phase_*_source.py'` — **PASS, 118 tests**.
- `python3 -m unittest scripts.tests.test_seal_handoff_snapshot` — **PASS, 8 tests**.
- Docset transport/tooling checks: `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_docset.py` — **PASS, 9 tests** after making its temporary phase-state fixtures independent of the live Phase 02 state; `python3 scripts/docset.py refresh/validate` — **PASS, 53 files**.
- CI YAML parse after Phase 02 edits — **PASS**.
- Run source lexical sanity pass — **PASS**, lexical only.
- Overlay validator/dry-run and apply-to-clean-copy byte comparison — **PASS, 45 operations, 0 deletions**.
- Broad `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` on the extracted Repomix tree — **INCOMPLETE**: 135 loaded tests passed; discovery had one import error because `scripts/prune_deleted_directories.py` is outside the supplied Repomix include set. Retry on the full checkout.
- Elixir format/compile/ExUnit/Ecto/PostgreSQL/Credo/Dialyzer/docs/Hex builds — **NOT_RUN**.
- Live providers/PDF/browser/human creative-quality checks — **NOT_RUN or not applicable to this storage phase**.

None of the above marks R01–R06 passed.

## Execute and repair

### 1. Common workspace ladder / R01 regression boundary

From `/home/home/p/g/n/fount`, run the repository aggregate and record exactly what it covers. If `mix ci` does not cover an item below, run that item separately:

```bash
cd /home/home/p/g/n/fount
mix setup
mix ci
mix format --check-formatted
mix deps.unlock --check-unused
mix blitz.workspace format --check-formatted
mix blitz.workspace lock_check
mix blitz.workspace compile
mix test
mix fount.architecture
mix blitz.workspace credo --strict
mix blitz.workspace dialyzer
mix blitz.workspace docs
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
python3 scripts/final_acceptance.py
```

Required R01 evidence:

- workspace/CI/architecture reports **five** libraries including `fount_run`;
- `packages/fount` remains independently buildable and imports no Run/host code;
- `fount_run` starts without a configured host/Repo/provider and performs no provider work;
- docs compile/build successfully and the new package contains its migration assets.

### 2. Core regression and Core→Run migration order / R02

Use a disposable `FOUNT_DATABASE_URL`. Run Core integration first:

```bash
cd /home/home/p/g/n/fount/packages/fount
MIX_ENV=test mix ecto.create
MIX_ENV=test mix ecto.migrate
MIX_ENV=test mix test integration
mix test
```

Then Run unit and PostgreSQL integration. Its integration harness explicitly starts a caller-owned Repo, creates an isolated schema, runs **Core migrations first and Run migrations second**, and drops the schema after the case:

```bash
cd /home/home/p/g/n/fount/packages/fount_run
mix test
MIX_ENV=test mix test integration/storage_constraints_test.exs
MIX_ENV=test mix test integration/run_foundation_test.exs
MIX_ENV=test mix test integration
```

Required R02 evidence:

- fresh Core→Run migration creates exactly: `fount_runs`, `fount_run_plans`, `fount_run_policies`, `fount_run_steps`, `fount_run_attempts`, `fount_run_events`, `fount_run_decisions`, `fount_run_approval_attempts`, `fount_run_usage`, `fount_run_deliveries`;
- exercise baseline/pre-Run Core schema → Run migration upgrade as a distinct path, not only a brand-new schema;
- invalid cross-screenplay/run/plan/policy/step references and invalid resource/state constraints fail transactionally;
- migration/trigger ordering works on real PostgreSQL without weakening identity or immutability guards.

### 3. Creation, authority and snapshots / R03–R04

Execute `packages/fount_run/integration/run_foundation_test.exs` and, if any assertion is too source-shaped, strengthen it rather than deleting the invariant. Required proof:

- authenticated owner/service context is host-created; untrusted payload cannot grant ownership/approver authority;
- `start_run` creates one run + plan/policy v1 atomically, makes zero provider calls, exact same idempotency request returns the same run, changed same-key content or caller identity conflicts, unsupported future start options fail closed;
- `get_run`/`list_runs` enforce authority and screenplay ownership;
- closed schemas reject unknown plan/policy fields and invalid limits; canonical fingerprints remain stable after storage/reload;
- plan/policy snapshots append with expected version and owner authority, historical rows remain immutable, current pointers move atomically, events are append-only and preserve linked step/attempt identity.

### 4. Decision and approval-attempt storage / R05

Use the written concurrency test with distinct connections/tasks and inspect the actual row-lock behavior. Required proof:

- one pending decision binds the exact run/plan/policy/base/context fingerprint and authenticated responder identity;
- exact replay is idempotent, a competing different response conflicts, and two concurrent submissions produce exactly one committed resolution;
- approval attempt IDs/reviews/approval payloads are durable and immutable once received;
- rejected/invalid/fenced/failed/unknown attempts remain stored without a Core acceptance;
- the Phase 02 `accepted` outcome remains blocked by `:acceptance_bridge_required`, so no path advances canon from Run storage alone.

### 5. Resource identity primitives / R06

Execute the usage, step/attempt/lease and delivery cases in `run_foundation_test.exs`. Required proof after reload:

- usage reservation identity is stable, exact settlement replay is idempotent, duplicate/mismatched settlement/linkage fails;
- step/attempt identities and storage-only lease/fence ownership fields reject invalid cross-run links;
- attempt start/finish and event step/attempt references retain the correct identity;
- delivery identity binds candidate XOR accepted revision and repeated exact result recording is stable while mismatched replay conflicts.

Do **not** turn these tests into Phase 03 behavior. Claim selection, fencing policy, renewal/reclaim timing, external call ambiguity and crash recovery are explicitly next-phase work.

### 6. Workshop and five-package regression/build

Phase 02 changes workspace architecture but must preserve existing Core/Observe/Intelligence/Workshop behavior. At minimum:

```bash
cd /home/home/p/g/n/fount/packages/fount_workshop
MIX_ENV=test mix test integration
mix test

for package in fount fount_observe fount_intelligence fount_workshop fount_run; do
  (cd /home/home/p/g/n/fount/packages/$package && FOUNT_PACKAGE_BUILD=1 mix hex.build)
done
```

Record any package-build limitation caused by unpublished sibling packages distinctly; do not publish during QC and do not replace the local workspace regression with a packaging-only claim.

## Repair boundaries and first-runtime risks

Repair ordinary format/compile/API/migration/test defects needed for R01–R06 in the installed source. Preserve unrelated work. Do not modify SDK/Inference/ASM unless a separately authorized, source-grounded dependency defect is genuinely required; none is expected from this phase.

Most likely first-runtime repair areas because the implementation environment lacked Elixir:

1. Elixir formatter/warnings-as-errors/Credo/Dialyzer issues in the new modules/tests.
2. PostgreSQL DDL/trigger/deferred-composite-FK ordering, including the acceptance identity index used by delivery binding.
3. Ecto/Postgrex UUID/JSON/raw-SQL normalization in integration assertions.
4. The concurrency test's actual connection independence; use real competing DB connections if the current task/pool arrangement does not prove row locking.
5. Hex package asset/dependency behavior with the fifth package.

Do **not** implement worker claim/reclaim, provider execution, supervised polling, Workshop orchestration or crash recovery while fixing Phase 02. Those are Phase 03.

## Record evidence and finish the phase

Create `handoffs/PHASE_02_RUNTIME_QC_REPORT.md` from the runtime report template. Record all seven runtime destinations above, actual user-applied Fount/docset commits, dirty status, toolchain versions, database isolation, every command/result/count, repairs, final verified Fount commit/tree, branch/push outcome, and remaining optional limitations. Map each R01–R06 row to executed evidence.

Set Phase 02 `COMPLETE` only when the common engineering gates and **R01–R06** all pass. Otherwise set `QC_FAILED`, record actionable failures and remain on Phase 02.

On success only:

1. Commit/push any Phase 02 repairs in `/home/home/p/g/n/fount`.
2. Update `state.json`, `TRACEABILITY_MATRIX.md`, `DECISIONS.md` if needed and `handoffs/PHASE_02_RUNTIME_QC_REPORT.md` under `/home/home/jb/docs/20260928/fount` (canonical `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`). Run `python3 scripts/docset.py refresh` and `python3 scripts/docset.py validate`, then commit from `/home/home/p/g/n/brainstorms` and push.
3. Generate **five fresh sealed XMLs** from the corrected committed trees with `scripts/prepare_inputs.py`; their packet manifest must record the actual final source commits.
4. Return those Phase 03 input paths plus generated `NEXT_HANDOFF.md` and stop. **Do not implement Phase 03 in this QC cycle.**
