# Phase 10 offline handoff — Durable Analysis Persistence, Reuse, and Recomputation

**Status:** `OFFLINE_IMPLEMENTED`, not `COMPLETE`.  
**Date:** 2026-09-27  
**Stop line:** runtime-QC/repair Phase 10 only; do not implement Phase 11.

## Baseline and authority

The five supplied XMLs were identified by contents and hashed in `PHASE_10_INPUTS.json`. The authoritative docset progress record marks Phases 1–9 COMPLETE and Phase 10 as the first unfinished phase. The documented verified Fount baseline is commit `361a9fd04752d947e0eaf12edbcf0fbd4d1bad54`, tree `2d25494002d6b711185be83c6c6b0b44b92d3068`.

Overlay: `Fount_Phase_10_Durable_Analysis_overlay.zip`  
SHA-256: `95c8d53bf8eba195bce384b85f398d7bc8ca12e2ff5cbb1c4af3472b5eb92813`  
Manifest: 27 operations — 10 additions, 17 modifications, 0 deletions.

## What was implemented

- Core PostgreSQL schema/persistence for analysis assets, analysis runs, immutable reusable MeasurementResults, current-revision Observations and historical dependency rows.
- An optional Intelligence-owned L2 adapter implementing the existing Observe cache behaviour; Observe still constructs semantic keys, validates output contracts/model stability and rematerializes fresh Observations.
- Exact run identity including revision UUID + content hash, session/candidate lineage, playbook/content identity, privacy namespace, output-contract identity, full writer packet/audit result and actual resource usage.
- Explicit L2 eviction independent of analytical/writer history; canonical edits do not delete semantic cache rows.
- Existing StoryWorld connected-region and Reader presentation-suffix recomputation composed into a Phase-10 plan, plus latest-applicable diagnosis/report dependency lookup without overwriting historical runs.
- Canonical JSON audit export and durable usage history for later longitudinal estimates.
- Host-gated, content-addressed, data-only project/studio lens/genre/calibration/playbook assets with trust/source metadata and executable-key rejection.
- Workshop opt-in durable-analysis wiring while preserving the Store + Inference-only and optional-Observe lanes, existing candidate-save order and explicit acceptance semantics.
- A Phase-10 writer regression demonstrating resume with one rejected and one unchosen candidate plus durable analysis history.

## API inspection

Actual dependency snapshots were inspected rather than inferred:

- SystemOneSDK 0.6.0: `version/0`, `new_client/1`, `system_one/4`, `noul/2`, `choice/3`, `score/3`, `prepare/1`, `evaluate/4`, `evaluate_stream/4`, `evaluate_many/4`, `list_models/2`.
- Inference 0.5.0: `client/1`, `capabilities/1`, `client!/1`, `complete/3`, `stream/3`.
- ASM 0.17.1: `start_session/1`, `stop_session/1`, `query/3`, `stream/3`, `session_id/1`, `session_info/1`.

Phase 10 introduces no new direct call into those dependencies. System One remains behind Observe; Inference remains behind Workshop generation; ASM remains behind Inference.

## Offline checks actually run

- 18 targeted Phase-9/Phase-10 Python source-contract tests: PASS.
- Python compile of source-check scripts: PASS.
- strict overlay dry-run: PASS.
- strict overlay apply to a fresh extracted Fount baseline: PASS.
- result-hash verification and desired-tree byte comparison: PASS after excluding only the applier backup journal/directory.
- idempotence dry-run after application: all 27 declared paths `unchanged`.
- repository-wide Python discovery: **not a pass**. It reaches 79 tests but has one import error because the supplied Fount XML omits `handoff/prune_deleted_directories.py` while retaining `test_prune_deleted_directories.py`. This is the same input-snapshot limitation recorded in prior handoffs; Codex must inspect the real checkout.

`PHASE_10_STATIC_CHECKS.json` is the machine-readable record.

## Not run here

Elixir, Erlang and Mix are unavailable. Therefore formatting, compile warnings-as-errors, ExUnit, migrations, PostgreSQL integration, compiled architecture, Credo, Dialyzer, ExDoc, Hex/package inspection, Workshop writer/PDF/table-read runtime regressions and any live provider checks are **NOT_RUN**. Human review is optional under D046 and was not run. No human usefulness or screenplay-quality claim is made.

## Important runtime risks

1. The new Ecto migration/schema/query SQL has not been compiled or migrated.
2. The durable cache adapter's struct/JSON reconstruction must be checked against real Observe `MeasurementResult`/`Distribution` values.
3. Cross-revision reuse must prove that only MeasurementResult is reused and that new Observations carry the new revision/evidence identity.
4. The existing mutable-model-alias durable-cache rejection must still fire before durable reuse.
5. Workshop post-candidate analysis occurs before candidate persistence; the new schema intentionally records exact revision UUID/content hash without a premature revision/candidate FK. Verify this sequence rather than reordering the writer loop unless runtime evidence requires a repair.
6. Historical dependency rows are per analysis run. `affected_records/3` must choose the latest applicable subject run for recomputation without destroying old audit rows.
7. Session resume with durable options must not trigger new generation merely because analysis history exists, and rejected/unchosen candidate state must remain intact.

## Required runtime exit

Codex must compile/test/repair Phase 10, run the full engineering/preservation ladder in `PHASE_10_RUNTIME_QC_HANDOFF.md`, record exact defects and fixes, update the complete docset, and mark Phase 10 `COMPLETE` only if applicable non-human gates pass. Then stop before Phase 11.
