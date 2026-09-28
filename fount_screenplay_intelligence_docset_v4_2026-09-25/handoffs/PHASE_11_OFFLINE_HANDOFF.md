# Phase 11 offline handoff

## State

`OFFLINE_IMPLEMENTED` — not `COMPLETE`.

The five inputs were identified by content, not filenames. `PROGRESS.md` makes Phase 11 the first unfinished phase after the verified Phase-10 checkpoint at Fount `6d164f636b6ffd0d9278c7f0ac436ce573447423` (tree `9a94735238e080f6a30bdad85b61d78a69a7d9b1`). This delivery implements only Phase 11 and leaves Phase 12 `NOT_STARTED`.

## Writer outcome

Phase 11 turns the screenplay-analysis stack from a collection of unit-verified capabilities into an explicit evaluation surface a writer/studio can audit: what material may be used, what readers actually disagreed about, how measurement confidence/calibration/abstention behaves, whether provider/model outputs drifted, whether non-linear reader/story-time semantics regressed, and whether repeated revisions consume the resources preflight predicted. The Workshop live check remains page-producing but deliberately cannot move canon.

## Implemented source

- `Fount.Intelligence.Evaluation` and seven focused modules for corpus rights, annotations, metrics, drift, frozen benchmarks, resources and suite coverage.
- Five shipped evaluation assets: synthetic rights manifest, independent reader annotations, frozen current-contract concealment fixture, nonlinear story-time case and all-12-family suite.
- Public Intelligence wrappers and ExDoc/package inclusion for the evaluation surface.
- Unit regressions for corpus rights, disagreement, calibration/abstention/ordinal metrics, descriptive drift, stale output-contract fixtures, suite coverage, resource comparison and nonlinear presentation/story-time semantics.
- PostgreSQL integration proving durable Phase-10 usage history can calibrate estimate versus actual resource units without inventing hosted cost.
- Provider-free Phase-11 example.
- Explicitly authorized Observe live QC using the existing provider/SceneQuestion boundary and a tiny synthetic scene.
- Explicitly authorized Workshop live QC using the existing Inference/ASM generation boundary: one scene, one candidate, no Observe, no acceptance.
- Permanent source regression guards for Phase-9/10 preservation and the Phase-12 stop line.

## Dependency/API inspection

The implementation inspected the supplied source for SystemOneSDK 0.6.0, Inference 0.5.0 and ASM 0.17.1. Phase 11 does not call those packages directly from Intelligence. Existing boundaries remain authoritative: SystemOneSDK through `Fount.Observe`; Inference through Workshop's `Inference.Client.agent_session!/1` setup; ASM behind the Inference ASM adapter.

## Offline evidence actually run

- `python3 -m unittest scripts.tests.test_phase_eleven_source scripts.tests.test_phase_ten_source scripts.tests.test_phase_nine_source -v` — **27/27 PASS**.
- Frozen output-contract digest and full frozen-fixture digest recomputed independently by the Python source test — PASS.
- strict overlay ZIP validation — PASS.
- overlay dry-run against the exact XML-extracted Fount baseline — PASS.
- overlay apply — 36 operations applied; reproduced the intended 577-file source tree exactly after ignoring installer backups / Python bytecode — PASS.
- second overlay dry-run after apply — all 36 operations `unchanged` — PASS.
- ZIP CRC test — PASS.
- repository-wide Python discovery ran **88 tests with 87 passing and 1 import error** because this supplied Fount XML contains `scripts/tests/test_prune_deleted_directories.py` but omits its imported `scripts/prune_deleted_directories.py`. The repository-wide suite is therefore **not claimed green** from this packet.

## Checks not run

Elixir, Erlang and Mix are not installed in this source-writing environment. Therefore compilation, formatting, ExUnit, PostgreSQL, architecture task, Credo, Dialyzer, ExDoc, package archives, provider-free Mix examples, authorized live Observe, authorized live Workshop and actual human-reader studies are **NOT_RUN** here. No result for any of those is implied.

Codex must begin from the user's applied/committed overlay, verify the exact intended paths/hashes, run and repair Phase 11, update the runtime report, and stop before Phase 12. Human review is optional/nonblocking under D046, but any skipped study remains visible validation debt and no human-calibration claim may be added.