# Phase 14 Runtime QC Report

**Date:** 2026-09-27 (Pacific/Honolulu)

**Status:** COMPLETE on applicable non-human engineering and preservation gates. Phase 15 remains `NOT_STARTED`.

## Applied state and identity

The user-applied Fount checkout was clean at commit `660fcaded5caba0f30c8b53e764e4250469cee0a`, tree `999a1614c04783e58b7439ea9ee3bc7f9dc85310`. Before repair, all 18 Phase-14 inventory paths matched the immutable overlay `result_sha256` values; zero mismatches. Repairs are committed as `37a25cae9cbee8408188d83cfa55f55d6f32d491`, tree `52c259bc5373083eb05172113dadc56d21351307`. The inventory records current hashes separately, including the additional Workshop `mix.exs` documentation repair. Fount is clean after the repair commit.

Toolchain: Elixir 1.20.3, Erlang/OTP 29 (`erts-17.0.5`), Python 3.14.4, PostgreSQL 18.6, Node v24.19.0 and npm 11.17.0. `mix deps.tree --only prod` resolved Inference 0.5.0 and Agent Session Manager 0.17.1 from Hex; `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` selected local SystemOneSDK 0.6.0 through Observe. Phase 14 added no dependency or migration. Note experiments use `CandidateAPI.manual/4`; the existing generation path is Workshop → Inference → ASM, and measurement is Workshop/Intelligence → Observe → SystemOneSDK. The overlay introduced no Phase-15 read/share/usefulness implementation. The actual checkout contains `scripts/prune_deleted_directories.py`; the offline XML omission required no repair.

## Failures and repairs

1. Initial root/workspace formatter check failed on Phase-14 Workshop source/tests. `mix format` corrected them. Initial warnings-as-errors compile lacked the established local SDK dependency setup; `mix setup` with `FOUNT_SYSTEM_ONE_SDK_PATH` resolved it. Compilation then exposed a genuine `NoteTriage.reanchor/5` multiple-clause default-argument warning; a function header removed it.
2. The four initial Phase-14 ExUnit fixtures failed at `Session.open/4`: each set `alternatives: 0`, below the existing request schema minimum. The four fixtures and PostgreSQL fixture now use `1`. No request compatibility API was added. The focused rerun passed 4/4.
3. First full `mix ci` reached strict Credo and found four Phase-14 complexity issues. Small validation/helper refactors in Research, NoteTriage and Review preserved the same accepted fields and packet values; strict Credo then passed. The next full CI reached ExDoc, which rejected the Phase-14 guide link because the guide was not registered as an extra. Workshop `mix.exs` now registers the guide and example. Final full CI passed.

## Executed gates

All final commands below exited 0. Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH` above. Database commands used `FOUNT_DATABASE_URL=ecto://home@localhost:55432/fount_phase14_qc_20260927` and `MIX_ENV=test`. Full logs are `/tmp/fount-phase14-*.log` in the execution environment.

| Command | Result |
|---|---|
| Root `mix format --check-formatted`, `mix blitz.workspace format --check-formatted`, `mix blitz.workspace compile` | PASS after repairs; compilation uses warnings as errors. |
| Workshop `mix test test/writer_workflows/phase_fourteen_*.exs` | 4 passed. |
| Core `mix ecto.migrate` on disposable PostgreSQL | All existing migrations applied; no Phase-14 migration. |
| Workshop `mix test integration/phase_fourteen_research_notes_durability_test.exs` | 1 passed. |
| Root `mix ci` | PASS: 351 workspace tests (Core 71, Observe 65, Intelligence 138, Workshop 77), compiled architecture `source_and_compiled` with 295 source files/zero violations, strict Credo zero issues, Dialyzer zero errors/skips, and all four ExDoc builds with warnings as errors. |
| `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -v` | 113 passed, including the prune helper test. |
| Core / Intelligence / Workshop `mix test integration` | 11 / 4 / 19 passed, 34 total. |
| Workshop Phase-12/13 writer workflows plus `rebase_resolution_test.exs` and `table_read_test.exs` | 13 passed; includes discovery/manual-candidate/voice/rehearsal, stale/rebase and table read coverage. |
| Workshop PDF, Phase-12 durable writer, Phase-13 rehearsal durability, Phase-14 durability integration files | 7 passed; includes real-store stale/idempotent acceptance and PDF. |
| Four package `FOUNT_PACKAGE_BUILD=1 mix hex.build` commands | All passed; Workshop archive listing includes the Phase-14 guide and example. Generated archives removed. |
| `git diff --check` | PASS; Fount repair commit leaves a clean checkout. |

The disposable database `fount_phase14_qc_20260927` was created via `createdb -h localhost -p 55432 -U home` and removed via `dropdb` after verification.

## Scenario findings and limits

- **W07 / A08:** The quoted upload instruction remains `untrusted_content` with `instruction_authority: none` and provider export false. The 1974 claim remains disputed; the intentional 1972 choice is a separate fictionalized invention. The no-web result records a question and supplied citation without inventing retrieval. No upload, web search or provider call ran.
- **W08 / A06:** Both conflicting notes remain separate with raw text/source/original draft. Concern and proposed treatment have independent decisions. Stable identity/exact text is exact; unique exact text relocates with evidence; duplicate exact text after a split is ambiguous; no match is orphaned. No fuzzy relocation was added.
- **W09 / A07:** The accepted note decision creates an ordinary writer-origin candidate. The spare-key reveal moves early in actual pages; `ConsequenceReview` obtains changed scenes from `Screenplay.diff/2`, finds only the two approved scenes, and leaves the bus-stop scene untouched. Supported dependency, hypothesis, unresolved work, checked scenes and not-analyzed scenes remain distinct. Candidate prose is marked non-evidence.
- **Concurrent edit / A10:** One sibling candidate is accepted; the stale sibling is refused against the newer head. Rebase returns the overlapping element conflict. `Screenplay.undo/2` restores the exact prior Fountain bytes.
- **PostgreSQL durability:** Research and note decisions survive a fresh Session/Store read; the note-linked candidate yields a Review packet; the canonical head and Fountain bytes remain unchanged before acceptance.

These are deterministic engineering fixtures, not live model, external research, or human usefulness evidence. Live Inference/ASM, System One, web research and optional D046 human/domain review are `NOT_RUN`. No new decision was needed; D054 remains the governing decision. Phase 15 is `NOT_STARTED`.