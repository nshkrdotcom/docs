# Phase 9 runtime QC report — Workshop Intelligence Integration

**Status:** COMPLETE on non-human engineering and preservation QC, 2026-09-27. Phase 10 remains NOT_STARTED.

## Applied state and repair identity

- Applied Fount commit `8c13ca3fab9aac9ff040b1f82feed359778d51b9`, tree `73b9892c18ec5ab9af83704a19ac89b1491bae0a`.
- Applied docset commit `b5c1dc26c0165306cc84eeb18972acfea5cea6b1`, tree `f32111fc16a48e57034d1d833c533eff6b7e171a`.
- Final Fount repair commit `361a9fd04752d947e0eaf12edbcf0fbd4d1bad54`, tree `2d25494002d6b711185be83c6c6b0b44b92d3068`.
- All 19 delivered paths matched their original SHA-256 and byte count in `PHASE_09_FILE_INVENTORY.json` before repair. The real tracked `handoff/prune_deleted_directories.py` helper was present and preserved. No overlay was reapplied. The inventory now records post-repair hashes and byte counts. The new PostgreSQL writer-loop test is a runtime-QC addition beyond the original 19 paths.

## Commands and results

All Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` and `ERL_FLAGS='+S 4'`. No live provider or paid model was used. PostgreSQL used a disposable `fount_phase9_qc` database on the local peer socket at `/var/run/postgresql:5433`; `FOUNT_DATABASE_URL='postgres://home@localhost:5433/fount_phase9_qc?socket_dir=/var/run/postgresql'`.

| Gate | Actual result |
|---|---|
| Root `mix format --check-formatted`; `mix compile --warnings-as-errors` | Passed. The package formatter first found delivered Phase-9 files that needed formatting; repaired. Final `mix ci` includes all package format and warnings-as-errors compile gates. |
| Workshop `mix test test/phase_nine_intelligence_test.exs` | 5 passed. |
| Workshop `mix test` | 63 passed after two generation-only compatibility repairs. |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v` | 73 passed, including the real cleanup-helper tests. |
| `bash scripts/verify_handoff.sh --offline` | Passed after formatting; all four package dependency, format, compile and test gates plus compiled/source architecture passed with zero violations. Ledger `/tmp/fount-handoff-offline-20260927T121010-256635/status.tsv`. |
| Root `mix ci` | Passed: Core 71, Observe 65, Intelligence 126, Workshop 63 = **325 tests**; dependency/lock checks, package formatting, warnings-as-errors compile, compiled architecture, strict Credo, Dialyzer and ExDoc passed. Log `/tmp/fount-phase9-ci-final.log`. |
| Workshop `MIX_ENV=test mix dialyzer --force-check` | Passed with zero errors after refreshing a stale local-dependency PLT. The first `mix ci` Dialyzer run reported five missing functions from that stale PLT; the refreshed PLT and final CI passed unchanged. |
| Core `MIX_ENV=test mix ecto.migrate`; `mix test integration` | Passed; 11 PostgreSQL integration tests. |
| Workshop `MIX_ENV=test mix test integration` | Passed; 14 established PostgreSQL integration tests covering Develop, targeted rewrite, sequence rebuild, note response, pass, recovery, acceptance/rejection, PDF and action layout. |
| Workshop `MIX_ENV=test mix test integration/phase_nine_writer_loop_test.exs` | Passed; one new deterministic real-PostgreSQL session. Total Workshop DB integration coverage is 15 tests. |
| Workshop `MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase9-writer-accept --decision accept --pdf`; same with `reject` | Both passed with Mock Inference and Observe Sandbox. Each rendered a two-page PDF and HTML table read; accept advanced canon and reject retained the base. |
| Core `MIX_ENV=test mix run examples/live.exs --mode roundtrip --out /tmp/fount-phase9-roundtrip`; same with `--mode interchange --out /tmp/fount-phase9-interchange` | Passed; representative Fountain/FDX/JSON import/export flows. |
| `FOUNT_PACKAGE_BUILD=1 mix hex.build` in each of the four packages | Passed; four archives created and removed after inspection. No build tree, Node modules or environment file appeared in outer archive entries. |

The initial full Workshop run failed two regressions, and the initial offline handoff check failed formatting. The first full CI reached Credo and failed five Phase-9 style checks. The next CI reached Dialyzer and found a stale dependency PLT. These were failures, not counted as passes. The final commands above passed.

## Defects and repairs

1. Strategy lineage was attached as an empty field even for generation-only callers with no Observe analysis. `link_strategies/2` now attaches lineage only when an actual complete or partial writer packet exists. The existing prompt-size regression and full Workshop suite pass.
2. An existing continuation fixture offered two strategies with identical semantic signatures. The Phase-9 duplicate guard correctly refused them; the fixture now uses two distinct dramatic mechanisms, retaining its continuation purpose.
3. Formatted delivered Workshop source/tests and refactored the Phase-9 preparation, candidate check, review packet and aliases for strict Credo. No acceptance gate or Core source was changed.
4. Added a deterministic PostgreSQL Phase-9 writer-loop integration test using actual `Fount.Persistence`, `FountWorkshop.Session`, Observe Sandbox and scripted Inference. Its first draft needed a Sandbox scene-mechanics fixture and an extraction response; the final test passes and consumes exactly the scripted calls.
5. Refreshed the Workshop Dialyzer PLT with `mix dialyzer --force-check`, following the Phase-8 local-dependency repair procedure. Final `mix ci` passed with zero Dialyzer errors.
6. Updated root README status, delivery inventory and the companion docset checkpoint.

## Phase-9 contract and preservation

The focused tests and PostgreSQL writer loop show provider-free preflight (`changes_canon=false`) without consuming a scripted generation call; a real prewrite `scene_doctor` packet; two causally different strategies with diagnosis/playbook lineage; real typed-edit candidate pages; exact original/proposed Fountain and source diff; a separate `revision_regression` packet; advisory semantic checks; a rejected branch; a content-hash rejection; explicit acceptance of the selected branch; and reloaded accepted head/history. The packet and pages are separately persisted, and the scripted completion queue is exhausted exactly. The normal no-Observe path passes Workshop unit tests with `not_run` analysis metadata. Focused tests cover note reaction/cause/treatment separation and advisory protected-strength checks. Existing tests cover direct legacy candidate checks, investigate without pages, audition/combine/rebase, and writer review protections.

`Writing.Context.prompt_data/2` compacts inspection and writer-analysis input for generation; saved candidate provenance retains the full prewrite packet and revision packet. Source/compiled architecture passed: System One is behind Observe; Inference is behind Workshop generation; ASM is behind Inference; pure Intelligence has no effect dependency; Core owns persistence/canon. Host option caps feed the Intelligence bridge; actual resource usage is attached to candidate/review metadata after execution. Unknown cost is not fabricated, and no provider secret or provider client is persisted. No Phase-10 durable analysis schema/cache/recomputation was introduced.

## Validation debt

The optional `PHASE_09_DOMAIN_REVIEW_PACKET.md` human workflow study was **not run** under D046 and remains visible validation debt. No human writer-usefulness, audience-response or creative-quality claim is made. Phase 10 is **NOT_STARTED**.
