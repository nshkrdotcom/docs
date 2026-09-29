# Phase 02 — runtime QC and completion

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Applied source and scope

This record preserves the user-supplied runtime handoff because the original Phase 02 docset files were absent from the installed docset commit. Start from Fount `3fc3aea5c73d1b9df7ee4bfc26e56a42a7de2aa2` and docset `ecbbf4c46387a984d1af170d99f6560e19242a07`, both on `main` and initially clean. Do not reapply either ZIP. Compare the 45 manifest result hashes and zero-deletion list before repairs. The source implements Run storage foundations only; worker execution and recovery are Phase 03.

## Required runtime work

Run `mix setup`, `mix ci`, the full Python suite, and `scripts/final_acceptance.py` from the Fount root, with the local System One SDK path. Use an isolated PostgreSQL database and the repository's `FOUNT_TEST_*` and `FOUNT_DATABASE_URL` settings. Run Core `MIX_ENV=test mix ecto.create`, `ecto.migrate`, `mix test integration`, and `mix test`; Run `mix test`, its `integration/storage_constraints_test.exs`, `integration/run_foundation_test.exs`, and full `mix test integration`; Workshop integration and unit tests; and `FOUNT_PACKAGE_BUILD=1 mix hex.build` in all five packages. Inspect Core→Run fresh and populated-upgrade migration order, distinct database connections for the decision race, host-free startup, immutable identities and replay behavior. Map R01–R06 to actual evidence in [the QC report](PHASE_02_RUNTIME_QC_REPORT.md).

Repair formatting, compiler, PostgreSQL, UUID/JSON, concurrency or package defects within Phase 02. Do not implement claim/reclaim, provider dispatch, supervised polling, Workshop orchestration or crash recovery. Rejected and invalid approval attempts may be stored; `accepted` must remain blocked by `:acceptance_bridge_required` and cannot advance Core canon.

## Completion rule

Set Phase 02 `COMPLETE` only after common gates and R01–R06 pass. Record actual repairs, final Fount commit/tree, branch/push, docset discrepancy and optional limits. Refresh/validate the docset, commit/push both repositories, then create five fresh sealed XMLs from committed sources for Phase 03. Stop before Phase 03 implementation.
