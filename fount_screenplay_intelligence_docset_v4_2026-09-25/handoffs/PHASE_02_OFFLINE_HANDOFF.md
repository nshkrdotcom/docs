# Phase 2 offline implementation handoff

**Phase:** Observe Measurement Substrate Hardening. **Date:** 2026-09-26 (Pacific/Honolulu).
**Status:** OFFLINE_IMPLEMENTED. **Next action:** runtime QC and repair of Phase 2,
not Phase 3 and not another implementation plan.

## Deliverables

`fount_phase_02_overlay.zip` contains 21 additions and 25
modifications, no deletions, and the strict archive manifest. The separate
`fount_phase_02_docset.zip` contains the complete supplied docset plus these records.
`PHASE_02_RUNTIME_QC_HANDOFF.md` is both a standalone download and included here.

## Writer outcome and implementation

Ask a concrete scene question and inspect the exact passages supplied for an answer,
or see an honest unavailable result. The screenplay remains unchanged. The source
hardens output/context contracts, semantic versus provenance identity, calibration,
model stability, ETS/private L1 reuse, request/budget/resource controls, completed
partial results, human/rule/import recording and data-only fixture loading.
The full scope mapping is `PHASE_02_IMPLEMENTATION_MATRIX.md`.

## Inputs and preimage evidence

`PHASE_02_INPUTS.json` records all four attachment byte hashes and content-based
identification. Fount supplies four packages; SDK supplies the inspected 0.6.0
semantic facade; Inference supplies the 0.5.0 completion boundary; the docset selects
Phase 2 after historical Phase 1 COMPLETE. Current raw XMLs lack seals.
Every modified preimage matches a supplied post-QC hash; the manifest never uses a
guessed newline variant. This does not authenticate absent files or current Git
commits. The actual user-applied Fount/docset commits are not known here.

## SDK/API inspection

Read the supplied `packages/system_one_sdk/lib/system_one_sdk.ex`, `client.ex`,
`system_one_response.ex`, `request_budget.ex`, `test.ex`, provider/client/batch
implementations and relevant boundary tests. Used existing public `new_client/1`,
`noul/2`, `choice/3`, `score/3`, `prepare/1`, `evaluate_stream/4`, and `version/0`.
The adapter reads actual response `model`, `request_id`, `usage`,
`prepared_fingerprint`, `batch_index`, `retries`, `elapsed_ms` and
`runtime_elapsed_ms`; `request_too_large` is a verified source error type.
No native SDK structs cross into Intelligence values.

Read Inference's `apps/inference/lib/inference.ex`, `client.ex`, `request.ex`,
`response.ex` and response-format/adapter contracts. The real completion boundary
is `Inference.complete/3`; Phase 2 adds no Inference call and does not alter
Workshop generation, SDK/Inference repositories or dependency versions/locks.

## Tests and verification

Five new ExUnit files contain 32 test declarations, listed exactly in
`PHASE_02_FILE_INVENTORY.json`. They were written before the corresponding source
passes where possible, but no runtime RED/GREEN was observed. Elixir, Mix and Erlang
are absent. No runtime, formatter, compiler, Credo, Dialyzer, docs, DB, PDF, speech,
live provider, or writer-example success is claimed.

Executed checks, including the full-Python-discovery missing-helper error and
strict archive application tests, are listed in `PHASE_02_STATIC_CHECKS.json`.
They establish only their stated source/asset/transport properties.

## Review and remaining runtime risks

Self-review only; no independent subagent/reviewer was available. Review tightened
provenance maps, contradictory distribution fields, cache metadata validation,
import projection binding and installed-fixture checks. Those fixes are not runtime
verified. Codex must especially check formatting/warnings, active output shapes
against real SDK answers, cancellation/worker cleanup and partial ordering,
cache identity/ETS lifecycle, typed-context source-pointer validation, record
imports, and all four packages' existing regressions. Do not weaken assertions or
silence warnings to hide defects.

The absent cleanup helper and SDK client configuration test are snapshot omissions,
not permission to invent replacements. No deleted files, schema migration, public
release or Phase 3 work is included. Historical Luna-output debt remains explicit.

## Complete file inventory

Machine-readable hashes, authenticated preimages and test names are in
`PHASE_02_FILE_INVENTORY.json`. New files are listed first, then modifications.

- `handoff/PHASE_02_SOURCE_NOTES.md`
- `packages/fount_observe/examples/fixture_file.exs`
- `packages/fount_observe/examples/live.exs`
- `packages/fount_observe/examples/phase_two.exs`
- `packages/fount_observe/guides/measurement-substrate.md`
- `packages/fount_observe/lib/fount/observe/cache/ets.ex`
- `packages/fount_observe/lib/fount/observe/calibration.ex`
- `packages/fount_observe/lib/fount/observe/fingerprint.ex`
- `packages/fount_observe/lib/fount/observe/measurement_spec.ex`
- `packages/fount_observe/lib/fount/observe/output_contract.ex`
- `packages/fount_observe/lib/fount/observe/recording.ex`
- `packages/fount_observe/lib/fount/observe/resources.ex`
- `packages/fount_observe/lib/fount/observe/scene_question.ex`
- `packages/fount_observe/priv/calibrations/identity.json`
- `packages/fount_observe/priv/fixtures/scene_visibility.json`
- `packages/fount_observe/test/phase_two_contracts_test.exs`
- `packages/fount_observe/test/phase_two_execution_test.exs`
- `packages/fount_observe/test/phase_two_provider_test.exs`
- `packages/fount_observe/test/phase_two_scene_question_test.exs`
- `packages/fount_observe/test/phase_two_sources_test.exs`
- `scripts/tests/test_phase_two_source.py`
- `packages/fount_intelligence/lib/fount/intelligence/acquisition/measurements.ex`
- `packages/fount_observe/CHANGELOG.md`
- `packages/fount_observe/README.md`
- `packages/fount_observe/examples/README.md`
- `packages/fount_observe/guides/architecture.md`
- `packages/fount_observe/guides/usage.md`
- `packages/fount_observe/guides/verification.md`
- `packages/fount_observe/lib/fount/observe/batch.ex`
- `packages/fount_observe/lib/fount/observe/budget.ex`
- `packages/fount_observe/lib/fount/observe/context.ex`
- `packages/fount_observe/lib/fount/observe/distribution.ex`
- `packages/fount_observe/lib/fount/observe/executor.ex`
- `packages/fount_observe/lib/fount/observe/lens.ex`
- `packages/fount_observe/lib/fount/observe/measurement_result.ex`
- `packages/fount_observe/lib/fount/observe/options.ex`
- `packages/fount_observe/lib/fount/observe/projection.ex`
- `packages/fount_observe/lib/fount/observe/provider.ex`
- `packages/fount_observe/lib/fount/observe/provider_call.ex`
- `packages/fount_observe/lib/fount/observe/providers/system_one.ex`
- `packages/fount_observe/lib/fount/observe/question.ex`
- `packages/fount_observe/lib/fount/observe/registry.ex`
- `packages/fount_observe/lib/fount/observe/request.ex`
- `packages/fount_observe/lib/fount/observe/sandbox.ex`
- `packages/fount_observe/lib/fount/observe.ex`
- `packages/fount_observe/mix.exs`