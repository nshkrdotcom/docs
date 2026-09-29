# Phase 02 offline implementation handoff — Run foundation

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Delivery identity and provenance

This handoff was reconstructed during runtime QC from the user-supplied Phase 02 handoff, the installed Fount source, and the installed overlay manifest. The docset checkout at `ecbbf4c46387a984d1af170d99f6560e19242a07` had no Phase 02 handoff files and still marked Phase 02 `NOT_STARTED`; the original delivered docset ZIP could not be compared byte for byte. This record does not claim to be the original offline handoff. Input identities are in [PHASE_02_INPUTS.json](PHASE_02_INPUTS.json).

The Fount input was `fount(20260928-214212).xml` (SHA-256 `27aaf9c0059cb8a4093a63e8caaa98d1598e9afc7d9d908b2e29ae777d04130e`, 3485104 bytes); no reliable Git commit was embedded. The docset input was `docset(1).xml` (SHA-256 `08f521d050e104244f8acf6b88dec80c1e6ca7a6407b7aa9fba96b2cf01ace68`, 263126 bytes). Dependency snapshot commits are recorded in the inputs JSON. The prior verified Phase 01 Fount commit was `e79510008735220545f4ee9322bade127c868d40`.

## Implemented source

The delivered Fount overlay, `fount_run_phase_02_overlay.zip` (SHA-256 `cdeb0480d4852d4da643d2e60237879abf1e89a8ce43aefe2211e3e60658541b`), added `packages/fount_run` as a fifth library. Its public Phase 02 API is `migrations_path/0`, `start_run/4`, `get_run/3`, and `list_runs/3`. It provides trusted actor context, closed plan/policy validation and fingerprints, caller-bound idempotent creation, ten Run tables, append-only snapshots/events, decision and approval-attempt storage, and usage/step/attempt/lease/delivery identity primitives. It does not expose Phase 03 commands or perform provider work. Accepted approval attempts remain blocked by `:acceptance_bridge_required` pending a future Core bridge.

The copied [overlay manifest](PHASE_02_OVERLAY_MANIFEST.json) has SHA-256 `9c9f228b60c0352b0a70f001a2512b2577f1327219068a1f480ed94b0ba8e062`, 45 source operations (17 modify, 28 add) and zero deletions. All declared result hashes matched the installed Fount commit `3fc3aea5c73d1b9df7ee4bfc26e56a42a7de2aa2` before runtime repairs. The overlay was not reapplied. Source-to-requirement mapping is in [the implementation matrix](PHASE_02_IMPLEMENTATION_MATRIX.md).

## Source-only checks and limits

The supplied handoff reported 19 Phase 01/02 source tests, 16 final-acceptance source checks, 118 phase source tests, eight sealer tests, nine docset transport tests, YAML parse and lexical sanity, and a 45-operation overlay dry run passing in the web environment. Broad Python discovery loaded 135 passing tests but had one import error because the Repomix input omitted `scripts/prune_deleted_directories.py`. Elixir, Mix, ExUnit, Ecto, PostgreSQL, Credo, Dialyzer, docs and Hex builds were **NOT_RUN** there. None of those source-only checks certified R01–R06. The full-checkout Python suite and all runtime gates were run during local QC and are recorded separately.

## Next action

The user had already applied and pushed source before local QC. Verify installed commits and source hashes, repair only Phase 02, run common and R01–R06 gates, then complete the report and prepare Phase 03 inputs. Do not apply either ZIP again or implement the Phase 03 worker.
