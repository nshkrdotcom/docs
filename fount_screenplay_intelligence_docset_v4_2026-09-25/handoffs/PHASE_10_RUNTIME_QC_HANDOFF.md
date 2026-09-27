# Codex QC handoff — Phase 10: Durable Analysis Persistence, Reuse, and Recomputation

You are the runtime QC/debugging agent for **Phase 10 only**. The source-writing agent had no Elixir/Erlang/Mix runtime. Treat the applied source as an implementation attempt that must be compiled, migrated, tested, repaired and documented before Phase 10 can become `COMPLETE`. **Do not implement Phase 11. Do not reapply the overlay.**

## Inputs / baseline

- documented verified pre-Phase-10 Fount baseline: commit `361a9fd04752d947e0eaf12edbcf0fbd4d1bad54`, tree `2d25494002d6b711185be83c6c6b0b44b92d3068`;
- offline overlay: `Fount_Phase_10_Durable_Analysis_overlay.zip`;
- overlay SHA-256: `95c8d53bf8eba195bce384b85f398d7bc8ca12e2ff5cbb1c4af3472b5eb92813`;
- strict manifest inventory: `handoffs/PHASE_10_FILE_INVENTORY.json`;
- source account: `handoffs/PHASE_10_OFFLINE_HANDOFF.md`;
- user-applied Fount/docset commits: inspect the actual checkout; do not invent them here.

The overlay has **27 operations: 10 additions, 17 modifications, no deletions**.

## First: verify the user's already-applied state

1. Preserve unrelated work.
2. Inspect the applied commit diff and compare the 27 result hashes/bytes to `PHASE_10_FILE_INVENTORY.json` before making repairs.
3. Do **not** apply the ZIP a second time.
4. Confirm the real checkout still contains the tracked `handoff/prune_deleted_directories.py`; the source XML used offline omitted it while retaining its test.
5. Confirm no Phase-11 files/work were introduced.

## What Phase 10 is intended to do

Core stores durable derived-analysis data; Observe still owns measurement semantics/provider/cache identity/fresh Observation materialization; Intelligence shell owns durable analysis policy/recomputation/history; Workshop retains creative generation and explicit writer acceptance. Durable analysis is opt-in and may not select, resurrect or canonicalize a candidate.

The implementation adds:

- `Fount.Persistence.Analysis` and migration/schema for analysis assets/runs/L2 MeasurementResults/current Observations/dependencies;
- `Fount.Intelligence.Persistence` plus `Persistence.MeasurementCache` using the real `Fount.Observe.Cache` behaviour;
- `Fount.Intelligence.Recomputation` composing existing StoryWorld/Reader frontiers and persisted derived dependencies;
- public Intelligence helpers for durable store/export/usage/recomputation;
- Workshop opt-in persistence and resume limits;
- DB integration tests for semantic reuse/provenance/assets/audit;
- a PostgreSQL writer resume/history regression proving a rejected branch stays rejected, an unchosen branch survives, durable analysis history remains, no new completion is invoked on resume, and canon is unchanged.

## Exact dependency APIs inspected offline

No new direct dependency call was added, but verify the current dependency checkout remains compatible.

- SystemOneSDK 0.6.0: `version/0`, `new_client/1`, `system_one/4`, `noul/2`, `choice/3`, `score/3`, `prepare/1`, `evaluate/4`, `evaluate_stream/4`, `evaluate_many/4`, `list_models/2`.
- Inference 0.5.0: `client/1`, `capabilities/1`, `client!/1`, `complete/3`, `stream/3`.
- ASM 0.17.1: `start_session/1`, `stop_session/1`, `query/3`, `stream/3`, `session_id/1`, `session_info/1`.

System One must remain behind Observe; Inference behind Workshop generation; ASM behind Inference.

## Focused checks to run first

Use repository-native environment variables/path overrides from the verified Phase-9 report. Suggested sequence:

```bash
# root
mix format --check-formatted
mix compile --warnings-as-errors
python3 -m unittest scripts.tests.test_phase_ten_source scripts.tests.test_phase_nine_source -v
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v

# Observe: existing identity/provenance/model-stability regressions
cd packages/fount_observe
mix test test/cache_integrity_test.exs test/phase_two_execution_test.exs test/system_one_boundary_test.exs

# Intelligence pure recomputation
cd ../fount_intelligence
mix test test/phase_ten_recomputation_test.exs

# Prepare disposable PostgreSQL, then from Core
cd ../fount
MIX_ENV=test mix ecto.migrate

# Intelligence durable storage/cache/assets
cd ../fount_intelligence
MIX_ENV=test mix test integration/phase_ten_durable_analysis_test.exs

# Writer resume/history outcome
cd ../fount_workshop
MIX_ENV=test mix test integration/phase_ten_resume_history_test.exs
MIX_ENV=test mix test integration/phase_nine_writer_loop_test.exs
mix test test/session_continuation_test.exs test/candidate_continuation_test.exs
```

Repair compile/test defects directly in the applied Phase-10 source and rerun the affected gates. Do not preserve an offline mistake for compatibility.

## Phase-specific semantic assertions

Verify all of these with actual runtime evidence:

1. **Cross-revision reuse:** unchanged effective semantic input can reuse the same immutable MeasurementResult across screenplay revisions.
2. **Fresh current provenance:** a cache hit materializes a new current Observation; no prior revision/evidence provenance is returned as current.
3. **Context sensitivity:** changed upstream context misses even if target text is unchanged.
4. **Other identity misses:** question/spec/lens, output-contract digest, model fingerprint and semantic execution changes miss according to existing Observe rules.
5. **Mutable aliases:** `mutable_alias_or_unknown` model identity remains rejected for durable cache use.
6. **Privacy namespace:** separate namespaces do not cross-reuse.
7. **Output contract:** logical ID and exact digest persist and are revalidated on read.
8. **No edit-triggered eviction:** canonical revisions do not delete L2 rows; explicit eviction only removes reusable cache rows.
9. **Audit retention:** cache eviction leaves analysis runs, observations, dependency history, resource usage and writer/candidate history intact.
10. **Recomputation:** StoryWorld uses the existing connected region; Reader begins at the earliest affected presentation checkpoint; diagnosis/report dependents are derived from latest applicable dependency rows without deleting historical rows.
11. **Project assets:** project/studio assets are host-gated, content-addressed, data-only, trust/source tagged, disabled until enabled, and reject executable/provider/credential-style keys.
12. **Secrets:** no credential/provider secret is persisted in analysis asset/run/cache/result metadata.
13. **Candidate timing:** post-candidate Revision Intelligence can persist its exact revision UUID/content hash and candidate lineage even though Workshop saves the candidate row afterward. Do not add a premature FK or reorder the verified writer path unless a real defect demands it.
14. **Writer resume:** rejected advice/candidate stays rejected; unchosen candidate remains available; retry/resume does not duplicate accepted changes or consume a new generation call when branches are already saved; canonical head is unchanged until explicit accept.
15. **Generation-only preservation:** sessions with durable analysis disabled and/or no Observe provider still behave exactly as Phase 9 tests specify.

## Full QC ladder after focused repairs

Run the repository's complete equivalent of the verified Phase-9 ladder:

1. root/package format checks;
2. warnings-as-errors compilation;
3. focused Phase-10 tests;
4. full four-package tests / root `mix ci`;
5. `bash scripts/verify_handoff.sh --offline`;
6. compiled architecture/dependency boundary checks;
7. strict Credo;
8. Dialyzer (refresh stale local-dependency PLTs if needed, and record that accurately);
9. ExDoc warnings/errors gate;
10. all repository Python tests;
11. all Core migrations in a disposable Phase-10 database;
12. Core PostgreSQL integration suite;
13. Workshop PostgreSQL integration suite, including both Phase-9 and Phase-10 writer loops;
14. representative Observe Sandbox and all twelve capability/Reader/Temporal regressions;
15. Core Fountain/FDX/JSON roundtrip/interchange examples;
16. Workshop accept/reject plus PDF/table-read demonstration;
17. four package `FOUNT_PACKAGE_BUILD=1 mix hex.build` inspections where Phase-9 QC used them.

A paid/live provider call is not required merely to prove Phase-10 persistence. If a live check is run for another reason, record authorization, model, request count and actual result separately.

## Required writer-facing demonstration

Execute and inspect `packages/fount_workshop/integration/phase_ten_resume_history_test.exs` or an equivalent repaired test using actual Core PostgreSQL persistence. The passing evidence must show the same session after interruption, with:

- one explicitly rejected branch still rejected;
- another unchosen candidate still present and undecided;
- the durable analysis record for the rejected branch still available only as history;
- no automatic acceptance/resurrection/ranking;
- accepted head unchanged;
- no duplicate/new generation call merely from resume when saved branches are complete.

This is an engineering demonstration, not a human usefulness study.

## Docset and handoff after QC

Create `handoffs/PHASE_10_RUNTIME_QC_REPORT.md` with exact commands, failures, repairs, final counts, DB identity, migration results and final Fount commit/tree. Update at least:

- `PROGRESS.md`;
- `TRACEABILITY_MATRIX.md`;
- `MANIFEST.md`;
- `README.md`;
- `AGENT_START_HERE.md`;
- `16_PHASED_IMPLEMENTATION_PLAN.md` Phase-10 checkpoint;
- `PHASE_10_FILE_INVENTORY.json` post-QC hashes/bytes;
- `PHASE_10_DOCSET_HASHES.json` and `SHA256SUMS.txt`.

Mark Phase 10 `COMPLETE` only if applicable non-human engineering/preservation gates pass. Human review is optional under D046; if skipped, keep it as validation debt and make no human usefulness claim. If any non-human gate remains blocked, use `QC_BLOCKED` and state the exact blocker.

**Then stop before Phase 11.** Return the final Fount/docset commit identities and the Phase-10 runtime report. Do not start calibration/corpus/live-verification Phase 11 in the same pass.
