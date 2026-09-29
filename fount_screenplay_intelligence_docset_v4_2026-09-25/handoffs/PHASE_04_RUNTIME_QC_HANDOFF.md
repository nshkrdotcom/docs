# Phase 04 runtime QC handoff

The user will apply `fount_run_phase_04_overlay.zip` and `fount_run_phase_04_docset.zip`, commit and push both repositories, then give this handoff to the local runtime agent. **Do not reapply either ZIP.** Verify the installed result and preserve unrelated work.

Phase 04 status is **OFFLINE_IMPLEMENTED**. P01–P07 are **NOT_RUN** until this local QC executes. Do not mark the phase COMPLETE from the web source checks.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Exact baselines and delivered payload

- Fount source baseline before overlay: `a3b9d8fe5d009dad15b6d3d354cc470560ec1c0b`
- Docset source baseline: `61f0137533cc1c8824c3edffc16a9200dbbf9409`
- Overlay archive SHA-256: `48316fd07c0c496038addf6ff0f116f03d837a9c74c534c0aade5999943b2401`
- Copied overlay manifest SHA-256: `2d9eab9764a60fb6ed02b09deefd62dd76dde9c97a23d9fa9c89c662a9c23f55`
- Overlay operations: 17 writes, zero deletions.
- Input packet manifest SHA-256: `e0e5d1a7f7b9732c476ecb4e71e9a5ff2e19ba32d7ebf35099f371f9a073793a`

Read `AGENT_START_HERE.md`, `state.json`, `phases/04_SCREENPLAY_PIPELINE.md`, `RUNTIME_QC.md`, `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`, `handoffs/PHASE_04_INPUTS.json`, `handoffs/PHASE_04_IMPLEMENTATION_MATRIX.md`, `handoffs/PHASE_04_OFFLINE_HANDOFF.md` and `handoffs/PHASE_04_OVERLAY_MANIFEST.json` before testing.

## First verify the applied state

From `/home/home/p/g/n/fount`, record `git status --short`, `git rev-parse HEAD`, branch/upstream, and actual `elixir --version`, `mix --version`, PostgreSQL version. Confirm every overlay manifest result hash (or document any intentional repair) and confirm no unrelated file was overwritten/deleted. Record the user-applied Fount and docset commits separately.

## Required commands

Run the repository common gates from `/home/home/p/g/n/fount`:

```sh
mix setup
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
mix ci
```

Run the Run package and Phase 04 journey tests explicitly with the configured disposable PostgreSQL test database:

```sh
cd /home/home/p/g/n/fount/packages/fount_run
MIX_ENV=test mix ecto.migrate
mix test
MIX_ENV=test mix test integration/screenplay_pipeline_test.exs
MIX_ENV=test mix test integration/durable_execution_test.exs
MIX_ENV=test mix test integration/storage_constraints_test.exs integration/run_foundation_test.exs integration/run_upgrade_test.exs
MIX_ENV=test mix test integration
```

Run the unchanged Core and Workshop regression surfaces:

```sh
cd /home/home/p/g/n/fount/packages/fount
MIX_ENV=test mix ecto.migrate
mix test
MIX_ENV=test mix test integration
cd /home/home/p/g/n/fount/packages/fount_workshop
mix test
MIX_ENV=test mix test integration
```

Build all five libraries after tests:

```sh
cd /home/home/p/g/n/fount/packages/fount && FOUNT_PACKAGE_BUILD=1 mix hex.build
cd /home/home/p/g/n/fount/packages/fount_observe && FOUNT_PACKAGE_BUILD=1 mix hex.build
cd /home/home/p/g/n/fount/packages/fount_intelligence && FOUNT_PACKAGE_BUILD=1 mix hex.build
cd /home/home/p/g/n/fount/packages/fount_workshop && FOUNT_PACKAGE_BUILD=1 mix hex.build
cd /home/home/p/g/n/fount/packages/fount_run && FOUNT_PACKAGE_BUILD=1 mix hex.build
```

## P01–P07 runtime proof required

- **P01:** execute both deterministic Phase 04 integration journeys: brief→opening and selected-scene dialogue. Confirm meaningful page changes, persisted reports/checks/base/candidate IDs and unchanged Core canonical head.
- **P02:** run the reveal/train fixture. Confirm exactly three saved routes before pages, uncertainty retained, train-platform protected beat preserved, consequence repaired and no hidden intermediate acceptance.
- **P03:** execute success, identical replay, competing response, wrong actor, stale context, stale plan and stale policy cases through public `FountRun.submit_decision/4`. Inspect the DB transaction result to confirm one resolved decision and one idempotent write step.
- **P04:** prove one creative repair is accounted as its own durable `iterate` work, malformed/transport counters remain distinct, `max_iterations` stops further creative work, spend does not reset and Workshop `max_repair_rounds` remains zero under Run.
- **P05:** inspect final candidate lineage/base/report/check bindings and complete Core diff; prove all unaccepted candidate revisions were composed from the canonical base and canon did not move.
- **P06:** interrupt/restart at strategy and check/iteration checkpoints; prove successful steps/sessions/provider usage and pending decisions are reused. Re-run Phase 03 known-success and ambiguous-paid-outcome crash cases unchanged.
- **P07:** run all nine Workshop workflow unit/integration surfaces, Core approval-safety tests and Phase 03 recovery gates. Confirm the Phase 04 registry has no successful `decide`/`deliver` handler and the demonstrated run ends at saved `candidate_review` or unresolved `iteration` checkpoint.

Use distinct PostgreSQL connections where concurrency matters. Test both a fresh Core→Run migration chain and upgrade from the verified Phase 03 schema. Repair ordinary Phase 04 defects in place, rerun the affected and full gates, and record exact commands/counts/DB schema names.

## Completion rule

Write `handoffs/PHASE_04_RUNTIME_QC_REPORT.md` only after executed evidence exists. Mark P01–P07 PASS individually, set Phase 04 `COMPLETE`, and record the verified final Fount commit only if all required engineering gates pass. If any required gate fails or remains unavailable, set `QC_FAILED` and do not advance. After successful QC, refresh/validate the docset, commit/push code and docs, then prepare five fresh sealed XMLs for Phase 05. Stop before implementing Phase 05.
