# Phase 7 runtime QC report — Capabilities B

**Status:** COMPLETE on engineering and preservation QC, 2026-09-27. Phase 8 remains NOT_STARTED.

## Applied state and repair identity

- Applied Fount commit `72bfec6c6cb36257a34c14cffa7275fda32b41ad`, tree `e6125d8053eb5c8d123b240f8fa9111701558343`.
- Final Fount repair commit `4a1c723bff3f4085a344af7122fbf190a1deab4b`, tree `10d66f5ccb04d269d11803c9cc5ba5624ca90e3e`.
- Applied docset commit `1ae9badc968fd80e03a6976175f88a490df58665`, tree `709d843af2171def55ad8795ae5274ce68812323`. The companion documentation commit is in docset Git history.
- Before repair, all 30 Phase-7 applied paths matched `PHASE_07_FILE_INVENTORY.json` and the embedded overlay manifest. No overlay was reapplied. The real historical helper is `handoff/prune_deleted_directories.py`; it is tracked, was preserved, and repository-wide Python discovery passed. The source-delivery reference to `scripts/prune_deleted_directories.py` was a path error in the XML-only account.
- Post-repair SHA-256/bytes for the 30 delivered paths and all 12 changed Fount paths, including `test/test_helper.exs`, are in `PHASE_07_FILE_INVENTORY.json`. Original delivery hashes remain historical.

## Commands and actual results

All Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` and `ERL_FLAGS='+S 4'`, the established local SystemOneSDK 0.6.0 path. No live provider was called.

| Gate | Result |
|---|---|
| Root `mix format --check-formatted`; `mix compile --warnings-as-errors` | Passed with the local SDK path; package formatting then exposed delivered Phase-7 files and was repaired. |
| Observe `mix test test/phase_seven_lens_assets_test.exs` | 2 passed. |
| Intelligence `mix test test/phase_seven_architecture_test.exs test/phase_seven_capabilities_test.exs test/phase_seven_runner_test.exs` | 11 passed after repair. |
| Intelligence `mix run examples/phase_seven.exs` | Passed through Observe Sandbox; packet has no generated candidate. |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` | 53 passed, including the cleanup-helper regression. |
| Root `mix ci` | Passed after repairs: Core 71, Observe 62, Intelligence 114, Workshop 58 = **305 tests**; root/package format, lock/dependency checks, warnings-as-errors compile, compiled architecture, strict Credo, Dialyzer and ExDoc passed. Log: `/tmp/fount-phase7-ci-final.log`. |
| `bash scripts/verify_handoff.sh --offline` | Passed all 17 rows; ledger `/tmp/fount-handoff-offline-20260927T104054-152240/status.tsv`. |
| Isolated PostgreSQL `fount_phase7_qc`, Core `mix ecto.migrate && mix test integration` | Passed; 11 Core integration tests. The DB used peer authentication at `/var/run/postgresql` port 5433. |
| Same DB, Workshop `mix test integration` | Passed; 14 integration tests covering writing, develop/rewrite/rebuild/pass/recover, action layout and PDF/export. |
| Workshop `mix run examples/phase_one.exs --decision accept --pdf` and `--decision reject --pdf` | Both passed with Mock Inference and Observe Sandbox; both rendered two-page PDFs and table-read output. Accept advanced canon; reject retained base. |
| Four `FOUNT_PACKAGE_BUILD=1 mix hex.build` archives | Passed; inspected 117/77/98/89 members for Core/Observe/Intelligence/Workshop. Four new lens assets, Phase-7 guide and example are present; no build/dependency tree, Node modules, environment files or PDFs were packaged. |

The initial root Mix invocation had no local SDK path and stopped at dependency resolution. A TCP PostgreSQL attempt lacked a password; the authenticated local peer socket was used for the isolated integration database. These environment attempts did not change source or production data. The CI log contains npm audit advisory output from the pre-existing Workshop dependency install; `mix ci` itself exited 0.

## Defects and repairs

1. Added `phase_seven_fixture.ex` to Intelligence `test_helper.exs`; otherwise nine focused tests could not load the fixture.
2. Supplied required suspense components in the fixture's resolution event so the unchanged strict Reader validator accepts it.
3. Formatted delivered Phase-7 Intelligence and Observe files under package formatter rules.
4. Refactored Phase-7 nested code and aliases to pass strict Credo without relaxing checks. Dialogue extraction now requires an actual character cue, preserves exact cue/dialogue evidence, and clears a stale cue after action; it no longer fabricates an `UNKNOWN` speaker for a line without a cue.
5. Added runtime assertions for Sequence measurement-ID lineage into diagnosis support and the exact watch case: the initial clue precedes the origin flashback in presentation, while the gift precedes the clue in story time.

## Capability and boundary verification

Exactly four new family/lens pairs are installed: `audience_reader_experience` / `audience.reader_experience`, `sequence_movement` / `sequence.movement`, `dialogue_interaction` / `dialogue.exchange`, and `setup_payoff_motifs` / `setup_payoff.motifs`. Existing Phase-6 families remain installed; Phase-8 families remain absent. Audience uses caller-supplied validated Reader events and strict-forward checkpoints; missing events yield partial coverage. Its question, anticipation, suspense, curiosity, surprise, comprehension-risk and forward-pull fields remain separate. Sequence exposes per-scene measurements, state vector, movement density and distinct presentation/story-time views; diagnoses retain measurement IDs. The five-scene fixture preserves the watch flashback's deliberate non-linear placement.

Dialogue measures adjacent cue-plus-dialogue turns with source evidence for both turns; its neutral context uses only the four installed typed slots through `ContextBuilder.validate/2` before provider dispatch. `dialogue_pass` composes the existing relationship family. Setup/Payoff reuses the Temporal ledger and StoryWorld relations for lifecycle and motif candidates while keeping presentation and diegetic relations separate. Diagnoses retain source support, uncertainty and limitations; intentional stillness, repetition, exposition, ambiguity, subversion and unresolved setups are not universal defects. Capability packets keep `candidate: nil` and do not generate or accept pages. Source and compiled architecture found no new direct SystemOneSDK, Inference or ASM call/dependency leak; measurement acquisition remains Observe-owned and creative generation Workshop/Inference-owned.

## Validation debt

The optional Phase-7 domain/usefulness review was **not run** under D046. No human reader agreement, writer usefulness, calibration or live-provider claim is made. Phase 8 is NOT_STARTED.