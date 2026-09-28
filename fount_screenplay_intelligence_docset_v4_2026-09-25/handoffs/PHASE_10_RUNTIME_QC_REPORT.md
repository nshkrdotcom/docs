# Phase 10 runtime QC report — 2026-09-27

**Status: COMPLETE on non-human engineering and preservation gates.** Phase 11 remains NOT_STARTED. No live or paid provider call was made. Human usefulness review was skipped under D046 and remains validation debt; this report makes no human usefulness claim.

## Applied state and environment

The user-applied Fount commit was `f18cf39750aa17e871a3f98a10bd394b59f9c987` (tree `b3dfa744f359a3c67af5459d4bc1ed056475de11`), based on verified Phase 9 `361a9fd04752d947e0eaf12edbcf0fbd4d1bad54`. Before repair, all 27 files matched the strict inventory result SHA-256 and byte counts: 10 additions, 17 modifications, zero deletions. `handoff/prune_deleted_directories.py` was tracked and present. No Phase-11 path was present. The overlay was not reapplied.

Final Fount repair commit: `6d164f636b6ffd0d9278c7f0ac436ce573447423`; tree `9a94735238e080f6a30bdad85b61d78a69a7d9b1`. `PHASE_10_FILE_INVENTORY.json` retains original overlay identities and records post-QC hashes separately.

All Mix commands below used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` and `ERL_FLAGS='+S 4'`. Database commands also used `FOUNT_DATABASE_URL='postgres://home@localhost:5433/fount_phase10_qc?socket_dir=/var/run/postgresql'`. The disposable database was created with `createdb -h /var/run/postgresql -p 5433 -U home fount_phase10_qc`; PostgreSQL reports version 18.6, database `fount_phase10_qc`, role `home`, local socket `/var/run/postgresql:5433`. `MIX_ENV=test mix ecto.migrate` in Core applied versions `20260924000000`, `20260924010000`, `20260924020000`, and Phase-10 `20260927000000` successfully. The Phase-10 migration created five derived-analysis tables: assets, runs, measurement results, observations, dependencies.

## Failures and repairs

1. First focused Intelligence compilation warned about an unused Core alias and two Elixir default-argument clause declarations. Removed the alias and added function heads.
2. First durable integration run failed because `measurement_options/2` forwarded an Intelligence-only `:analysis_run` key to Observe, whose option whitelist correctly rejected it. Kept the returned options Observe-valid and added the run marker only at the Intelligence acquisition wrapper.
3. The asset insertion path returned atom keys for a new row while loaded rows used string keys. Normalized the insertion return to string keys.
4. The credential scan raised on a `MeasurementResult` struct because structs do not implement `Enumerable`. It now traverses `Map.from_struct/1` before recursively checking keys.
5. The writer test expected an undecided candidate decision of `nil`; Core stores the explicit `proposed` value. Corrected the runtime and Python source assertions. The actual writer behavior was unchanged.
6. Initial full CI and offline handoff found missing terminal newlines in two Phase-10 Workshop files. Added them and ran package formatting. The first offline handoff was also invoked without the required local SDK path override, so Hex could not resolve the unpublished local SDK; the rerun with the verified override passed.
7. The next full CI reached strict Credo and found complexity/alias-order issues in new Core and Intelligence code. Refactored parameter construction, dependency extraction, cache lookup, batch projection, and packet completion; strict Credo then reported zero issues in all four packages.
8. Dialyzer initially reported 17 missing Core analysis functions from Intelligence and one missing Intelligence constructor from Workshop. Both dependency PLTs were stale. `mix dialyzer --force-check` in Intelligence and Workshop refreshed them; each returned zero errors. Final full CI passed without suppressions.

## Final executed gates

| Gate and exact command (run from indicated directory) | Result |
|---|---|
| Root `mix format --check-formatted`; `mix compile --warnings-as-errors` | Passed; final `mix ci` repeated package format and warning-free compilation. |
| Root `python3 -m unittest scripts.tests.test_phase_ten_source scripts.tests.test_phase_nine_source -v` | 18 passed before repair; updated source assertion included in final 82-test discovery. |
| Root `python3 -m unittest discover -s scripts/tests -p 'test_*.py' -q` | 82 passed, including tracked cleanup-helper tests. |
| Observe `mix test test/cache_integrity_test.exs test/phase_two_execution_test.exs test/system_one_boundary_test.exs` | 19 passed. |
| Observe `mix test test/executor_sandbox_test.exs test/cache_integrity_test.exs test/phase_two_execution_test.exs` | 20 passed; cache identity, poisoning, stable model, context and Sandbox regressions. |
| Intelligence `mix test test/phase_ten_recomputation_test.exs integration/phase_ten_durable_analysis_test.exs` with `MIX_ENV=test` and database URL | 6 passed: three pure recomputation plus three PostgreSQL durability tests. |
| Intelligence `mix test test/phase_six_capabilities_test.exs test/phase_seven_capabilities_test.exs test/phase_eight_capabilities_test.exs test/reader_forward_test.exs test/reader_replay_test.exs test/temporal_views_test.exs test/story_world_temporal_test.exs` | 36 passed, covering all twelve delivered capability families plus Reader/Temporal regressions. |
| Core `MIX_ENV=test mix ecto.migrate`; `MIX_ENV=test mix test integration` | Four migrations applied; 11 PostgreSQL integration tests passed. |
| Intelligence `MIX_ENV=test mix test integration/phase_ten_durable_analysis_test.exs` | 3 PostgreSQL integration tests passed. |
| Workshop `MIX_ENV=test mix test integration`; `MIX_ENV=test mix test integration/phase_ten_resume_history_test.exs integration/phase_nine_writer_loop_test.exs` | 16 PostgreSQL integration tests and both focused writer-loop tests passed. |
| Workshop `mix test test/session_continuation_test.exs test/candidate_continuation_test.exs` | Passed in the initial focused 8-test run with the two writer integrations; also included in full package suite. |
| Root `mix ci` | Passed: Core 71, Observe 65, Intelligence 129, Workshop 63 = **328 tests**; dependency/lock, format, warning-free compile, compiled architecture, strict Credo, Dialyzer and ExDoc warning/error gates passed. Log `/tmp/fount-phase10-ci-final.log`. |
| Root `bash scripts/verify_handoff.sh --offline` | Passed with local SDK override; ledger `/tmp/fount-handoff-offline-20260927T132105-326683/status.tsv`. Compiled architecture checked 315 modules and 271 source files with zero violations. |
| Intelligence and Workshop `mix dialyzer --force-check` | Refreshed stale local-dependency PLTs; zero errors in both. Final CI Dialyzer passed in all four packages. |
| Core `MIX_ENV=test mix run examples/live.exs --mode roundtrip --out /tmp/fount-phase10-roundtrip` and `--mode interchange --out /tmp/fount-phase10-interchange` | Both passed; representative Fountain/FDX/JSON roundtrip and interchange. |
| Workshop `MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase10-writer-accept --decision accept --pdf` and matching `--decision reject` | Both passed with Inference Mock and Observe Sandbox; each rendered a two-page PDF and one HTML table-read turn. Accept advanced canon; reject retained the base. |
| Each package `FOUNT_PACKAGE_BUILD=1 mix hex.build` | Four archives built, outer and inner tar entries inspected, and generated archives removed. No `_build`, `node_modules`, or `.env` payload appeared. |

## Phase-10 semantic and writer evidence

The real PostgreSQL durable integration proves that unchanged semantic input reuses the same immutable MeasurementResult across revisions while Observe creates a distinct current Observation with the new revision/evidence provenance. Changed upstream context and a different privacy namespace miss. Existing Observe tests cover question/model/semantic identity, changed context, mutable aliases rejected for durable cache, poisoned output-contract/raw payload reacquisition, and credential-like transport extra rejection. The L2 row stores logical output-contract ID and exact SHA-256; Observe revalidates cache hits on read. Core edits have no cache-delete path; `evict_cache/3` deletes only reusable measurement rows. Run, observation, dependency, resource, candidate and review history are separate tables. The durability integration verifies audit export/resource history after eviction.

The pure recomputation test verifies the existing StoryWorld connected story-time region and Reader presentation suffix frontiers. Core's `affected_records/3` uses the latest run for each derived subject when selecting dependency intersections; historical rows remain. Project asset integration verifies host gating, content hash, source/trust fields, disabled default, explicit enablement, and executable-key rejection. Core recursively rejects credential-like metadata keys. Analysis runs record exact revision UUID/content hash and candidate lineage without a premature candidate FK, preserving the verified post-candidate writer order.

The required `phase_ten_resume_history_test.exs` uses actual Core PostgreSQL persistence. It saved two alternative candidates, explicitly rejected one, left the other `proposed`, attached a completed durable analysis run to the rejected branch, and resumed the same session using a scripted completion agent. The agent call list stayed empty. After resume, both candidates and the same analysis run remained; the rejected decision and proposed decision stayed intact, and the canonical head equaled the base revision. Nothing selected, ranked, resurrected, accepted, or regenerated a candidate. Existing generation-only session/candidate and Phase-9 writer tests passed.

These are deterministic engineering fixtures, not a human usefulness study. No model calibration, corpus work, paid provider, or Phase-11 implementation was performed.