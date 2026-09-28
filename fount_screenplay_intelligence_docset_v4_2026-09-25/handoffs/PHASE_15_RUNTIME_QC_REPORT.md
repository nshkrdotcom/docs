# Phase 15 runtime QC report — 2026-09-27

**Status: COMPLETE on applicable non-human engineering gates.** This report verifies the committed Phase-15 overlay in the actual checkout and records repairs committed at Fount `72c583a665c076ce809e453516f23351f50d0386` (tree `30df207a16798de4f0e4fa794bf6a6ea175de325`). It does not claim human usefulness, comparative superiority, live provider quality, or Phase-16 acceptance.

## Applied state and identity

- Starting Git status: clean. Commit `ae5b5eb38e15e68c02d6a5d1fcfe14a0bf777353`; tree `554a83815d3937f124dc7ce8581a251a7c1eb453`.
- Before repair, all **17/17** Phase-15 paths matched `PHASE_15_FILE_INVENTORY.json` `result_sha256` exactly. The original overlay inventory remains untouched. Post-repair bytes and hashes are in `PHASE_15_RUNTIME_FILE_HASHES.json`, including the existing ReviewExport and Observe test surfaces repaired after runtime checks.
- Toolchain: Erlang/OTP 29 (`erts-17.0.5`), Elixir/Mix 1.20.3, Python 3.14.4, PostgreSQL 18.6, Node 24.19.0, npm 11.17.0, Git 2.53.0.
- Workshop `mix deps.tree --only prod` resolves Inference `~> 0.5.0` and Agent Session Manager `~> 0.17.1`. SystemOneSDK is transitive through ASM/Observe, with local path selected by `FOUNT_SYSTEM_ONE_SDK_PATH`; Workshop gained no direct SystemOneSDK dependency. Phase 16 remains untouched.
- The checkout has `handoff/prune_deleted_directories.py`; its test imports from `handoff/`. The offline XML omission described in source-delivery records does not apply to this checkout. No helper repair was needed.

## Repairs

1. Explicitly formatted seven delivered Workshop paths: `cli.ex`, `share.ex`, `table_read.ex`, `usefulness.ex`, `mix.exs`, and the two Phase-15 workflow tests. The package default formatter did not include every path checked by workspace CI.
2. Moved defaults to function headers in `TableRead.packet/3`, `Share.export/4`, and `Usefulness.report/2`, removing warnings-as-errors compile failures.
3. Simplified `Share.project/2` and split `Share.write_exports/3` into a small writer helper to satisfy strict Credo. Core Fountain/FDX exporters and privacy projection remain the only export path.
4. `ReviewExport` now writes persisted candidate `decision` into the resumed review manifest and status note. The real CLI run had shown accepted/rejected candidates as “open” because the export read `status`; regenerated output shows `accepted` and `rejected`. No session store or acceptance path was added.
5. The existing Observe whole-call timeout test no longer requires a callback-start message before accepting a valid timeout result. On a loaded full-CI run, the 100 ms timeout fired before the callback began, so the old `assert_receive` failed despite a correct `provider_timeout` batch. The test now blocks its callback for 5 s and checks the returned timeout, no observations and elapsed time below the callback delay. Ten repeated module runs passed. No production Observe or provider code changed.

## Commands and outcomes

All Mix commands below used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`. Database commands additionally used `FOUNT_DATABASE_URL=ecto://home@localhost:55432/fount_phase15_qc_20260927` and `MIX_ENV=test`.

| Command / gate | Result |
|---|---|
| `git status --short`; `git rev-parse HEAD HEAD^{tree}`; toolchain commands | Clean starting state and identities above. |
| SHA-256 verification of all 17 inventory paths before repair | 17/17 match. |
| Initial root `mix format --check-formatted` and `mix compile --warnings-as-errors` | Returned 0 through the root wrapper; Workshop-specific checks below exposed formatting and warning defects. |
| Initial root `mix test packages/fount_workshop/test/...` | Failed: workspace fan-out passed package-prefixed paths into each package and lacked the local SystemOneSDK path. Replaced by package-local focused tests. |
| Initial Workshop `mix format --check-formatted` | Failed on delivered formatting; repaired. |
| Workshop `mix compile --warnings-as-errors` | Initially three default-argument warnings; repaired and passed. |
| Workshop `mix format` and `mix format` on seven explicit delivered paths; `mix compile --warnings-as-errors` | PASS after repairs. |
| Workshop Phase-15 workflow tests | 2 passed; the read/share test also passed after the strict-Credo refactor. |
| Workshop `mix credo --strict` | PASS after two clean-share refactors. |
| Observe `mix test test/system_one_boundary_test.exs --seed N` for seeds 1–10 | 10/10 module runs passed after removing the callback-start race. |
| First/second root `mix ci` | First stopped at workspace formatting; second stopped at two strict Credo findings; repaired. A later repeat hit a timing-sensitive Observe whole-call timeout test once. The test was repaired as described above and passed ten repeated module runs. |
| Final root `mix ci` | PASS: 353 workspace tests (Core 71, Observe 65, Intelligence 138, Workshop 79); compiled architecture 297 source files, zero violations; strict Credo zero issues; Dialyzer zero errors/skips; four ExDoc builds with warnings as errors. |
| `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -q` | 122 passed; prune helper test included. |
| `createdb`; Core `mix ecto.migrate` on disposable PostgreSQL | PASS; all existing migrations applied. |
| Workshop `mix test integration/phase_fifteen_read_share_resume_test.exs` | 1 passed with fresh Store/Repo read. |
| Core / Intelligence / Workshop `mix test integration` | 11 / 4 / 20 passed, 35 total. |
| Core lossless Fountain/FDX fidelity tests | 7 passed, including one property test. |
| Workshop Phase-12/13/14 writer, rebase, table-read and Submission tests | 18 passed. PDF and durable writer regressions are included in database integration runs. |
| Four package `FOUNT_PACKAGE_BUILD=1 mix hex.build` commands | All passed; generated archives removed. |
| `bash /tmp/fount-phase15-cli.sh` (nine documented `mix fount.*` commands); `mix fount.session` after resume-export repair; direct `psql` head read | PASS; same accepted revision in packet, manifest and database; regenerated review manifest records accepted/rejected. |
| `mix deps.tree --only prod`; `git diff --check` | Dependency boundary confirmed; diff whitespace check PASS. |

Logs: `/tmp/fount-phase15-ci.log`, `/tmp/fount-phase15-ci-final.log`, `/tmp/fount-phase15-*-integration.log`, `/tmp/fount-phase15-fidelity.log`, `/tmp/fount-phase15-preservation.log`, `/tmp/fount-phase15-*-hex.log` and `/tmp/fount-phase15-cli.log`.

## Scenario evidence and inspected artifacts

- **A09 / W10:** The deterministic packet works without speech and binds screenplay/revision/selection to selected pages, scene context, roles and dialogue turns. A human pronoun-confusion reaction is stored in `reactions` with delivery and listening conditions, separate from script facts. `tts` is refused as a human observer; no laughter, engagement, timing or actor endorsement is inferred.
- **A11 / W10:** The focused fixture share retains `Title: Café at Midnight`, `Ça va`, dual-dialogue `DAN ^`/FDX `DualDialogue`, and accepted pages. Private note, boneyard/omitted scene, development outline/synopsis and unchosen candidate text are absent. The page-break loss appears in `unsupported_or_lossy`. Original Core no-op Fountain and FDX fidelity regressions pass.
- **A10 / W11:** The same accepted candidate decision retries idempotently; a stale sibling cannot overwrite the new head; rejected and proposed siblings persist. PostgreSQL integration reloads through a fresh Store/Repo and verifies head, accepted/rejected decisions, packet source identity and private-note exclusion. No duplicate accepted edit appears.
- **A12 / W12:** The three deterministic records represent neutral keep-original, negative generic basic-LLM and positive Fount-assisted examples. Engineering and human-response fields remain separate. The report has no score, winner, greenlight, marketability, expert, or representative-sample claim. These are fixture shapes, not real human outcomes.
- **Provider-free writer path:** Existing CLI commands completed capture → Explore → writer-origin manual revision → edit/compare → accept edited candidate/reject sibling → read/share → resume. Artifacts are under `/tmp/fount-phase15-cli-20260927`. The saved Fountain is `EXT. CLOSED SWIMMING POOL - NIGHT` plus “They fold the wet paper map on the concrete. Neither lets go first.” FDX contains the same page. The packet and share manifest name screenplay `41c1af48-950a-42a8-911c-ab2f125191b4`, accepted revision `14fb7c91-e04d-407e-ae86-f43ff4fcc24e`, and content hash `0f47ad1324da5bffb560364ee568b51a51f3e903cdc00d5dfc1b6274e9dea1bb`; direct PostgreSQL head read matches. The generated read packet has one selected page and `speech_required: false`. The regenerated resume manifest records one `accepted` and one `rejected` candidate. The CLI fixture contains no private note, so the focused share fixture and PostgreSQL integration provide the privacy stress case.

## Limits and stop line

Live Inference/ASM, live SystemOne measurement, speech synthesis, and the optional D046 four-writer comparative study are **NOT_RUN**. Human usefulness and comparative preference cannot be inferred from deterministic fixtures. Phase 16 remains **NOT_STARTED**.