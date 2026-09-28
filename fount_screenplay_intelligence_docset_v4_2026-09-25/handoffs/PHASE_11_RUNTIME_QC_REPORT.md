# Phase 11 runtime QC report

**Date:** 2026-09-27  
**Status:** COMPLETE on engineering and authorized non-human live gates; optional human study NOT_RUN.  
**Scope:** Phase 11 only. Phase 12 remains NOT_STARTED.

## Applied identities and toolchain

The user-applied Fount commit is `32e40576ef8c4cf4315aef3fd7cf11e320fa782c` (tree `7c318a8a92639c943a5b23f4be53a232ab937dad`), atop the documented baseline `6d164f636b6ffd0d9278c7f0ac436ce573447423` (tree `9a94735238e080f6a30bdad85b61d78a69a7d9b1`). The user-applied docset commit is `34790022eab70f2a7196b4a6840cb2f35deff24a` (tree `9df50dfc3931f593d901b082f35fda50098c9f4a`). Both checkouts were clean before QC. All 36 inventory paths matched delivered result SHA-256 hashes before repair: 21 additions, 15 modifications, no deletion. QC repairs remain uncommitted in the Fount checkout: 18 tracked paths differ from the applied commit, and `git diff --binary` SHA-256 is `73c95c72b54fccccc6594c6b211310a9f0bcda75e104947248295aadd25235cc`. Docset updates remain uncommitted. No unrelated preexisting changes were present. Phase-12 implementation scan found none.

Linux WSL2 6.18.33.2; Erlang/OTP 29 (erts 17.0.5); Elixir and Mix 1.20.3; PostgreSQL 18.6. Package Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` and `ERL_FLAGS='+S 4'`. The first architecture attempt without that source path exited 1 because the unpublished SDK was unavailable as a Hex dependency; this was configuration, corrected by the repository's Phase-10 procedure.

The resolved source versions are SystemOneSDK 0.6.0, Inference 0.5.0 and ASM 0.17.1. Inspected SDK `new_client/1`, `noul/2`, `choice/3`, `score/3`, `prepare/1`, `evaluate/4`, `evaluate_stream/4`, `evaluate_many/4`, and `list_models/2`; Inference `Client.agent_session/1`, `Client.agent_session!/1`, `complete/3`, `stream/3`; ASM `start_session/1`, `stop_session/1`, `query/3`, `stream/3`, `session_id/1`, `session_info/1`. Observe alone calls SystemOneSDK for measurement. Workshop's Launcher uses `Inference.Client.agent_session!` with `Inference.Adapters.ASM`; Workshop completion uses Inference. Intelligence has no direct dependency on these three packages. The Phase-11 Observe live example was repaired to compute descriptive drift locally because Observe cannot depend backward on Intelligence.

## Commands and results

Unless noted, every command below exited **0**. Full logs are in `/tmp/fount-phase11-*.log` in this runtime workspace, outside the repositories.

| Command | Result |
|---|---|
| Root `mix format --check-formatted` | pass after package-local Phase-11 formatting |
| Root `mix fount.architecture` | pass, compiled/source mode, 279 source files, zero violations |
| Root `mix ci` | pass: setup, format, unused locks, warnings-as-errors compile, 337 workspace tests (Core 71, Observe 65, Intelligence 138, Workshop 63), architecture, strict Credo, Dialyzer, ExDoc |
| `python3 -m unittest discover -s scripts/tests -v` | 91/91 pass; tracked `handoff/prune_deleted_directories.py` is present, so the XML snapshot's missing-helper import error does not occur here |
| Focused Intelligence Phase-11 ExUnit command | 9/9 pass |
| Focused Observe sandbox/Phase-2 command | 21/21 pass |
| Focused Phase-9/10/11 Python command | 27/27 pass |
| `createdb -h /var/run/postgresql -p 5433 -U home fount_phase11_qc` | pass; disposable database |
| Core `MIX_ENV=test mix ecto.migrate` with `FOUNT_DATABASE_URL='postgres://home@localhost:5433/fount_phase11_qc?socket_dir=/var/run/postgresql'` | pass; current migrations through `20260927000000` |
| Core `MIX_ENV=test mix test integration` | 11/11 pass |
| Intelligence `MIX_ENV=test mix test integration/phase_eleven_resource_history_test.exs integration/phase_ten_durable_analysis_test.exs` | 4/4 pass (Phase 11: 1; Phase 10: 3) |
| Workshop `MIX_ENV=test mix test integration/phase_ten_resume_history_test.exs integration/phase_nine_writer_loop_test.exs` | 2/2 pass |
| Workshop `MIX_ENV=test mix test integration` | 16/16 pass |
| Intelligence `mix run examples/phase_eleven.exs` | pass after example repair; inspected JSON |
| Each package `FOUNT_PACKAGE_BUILD=1 mix hex.build` | four archives pass; inner tar inspection found 119/84/126/83 entries for Core/Observe/Intelligence/Workshop, with no `_build`, `node_modules`, or `.env` entries; generated archives removed |

The first `mix ci` exited 1 for Phase-11 formatting; the next exited 1 for a Metrics default-argument warning; the next reached tests and exited 1 for annotation double-validation; later passes exited 1 for strict Credo and a clause-order warning. All were repaired. One later final pass exited 1 for formatting the revised Observe example. The final full `mix ci` exited 0 with all 337 tests and quality/doc gates green.

## Exact focused command audit

The command prefixes below were exported for each Mix invocation: `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk ERL_FLAGS='+S 4'`. Database test commands additionally used `FOUNT_DATABASE_URL='postgres://home@localhost:5433/fount_phase11_qc?socket_dir=/var/run/postgresql'`. Relative paths are from the named package directory. Each listed final command exited 0.

```text
root: mix format --check-formatted
root: mix fount.architecture
root: mix ci
root: python3 -m unittest discover -s scripts/tests -v
root: python3 -m unittest scripts.tests.test_phase_eleven_source scripts.tests.test_phase_ten_source scripts.tests.test_phase_nine_source -v
packages/fount_intelligence: MIX_ENV=test mix test test/phase_eleven_evaluation_test.exs test/phase_eleven_nonlinear_benchmark_test.exs
packages/fount_observe: MIX_ENV=test mix test test/executor_sandbox_test.exs test/phase_two_execution_test.exs test/phase_two_provider_test.exs
packages/fount: MIX_ENV=test mix ecto.migrate
packages/fount: MIX_ENV=test mix test integration
packages/fount_intelligence: MIX_ENV=test mix test integration/phase_eleven_resource_history_test.exs integration/phase_ten_durable_analysis_test.exs
packages/fount_workshop: MIX_ENV=test mix test integration/phase_ten_resume_history_test.exs integration/phase_nine_writer_loop_test.exs
packages/fount_workshop: MIX_ENV=test mix test integration
packages/fount_intelligence: mix run examples/phase_eleven.exs
packages/fount, fount_observe, fount_intelligence, fount_workshop (each): FOUNT_PACKAGE_BUILD=1 mix hex.build
```

## Phase-11 behavior verified

The two synthetic reader checkpoint annotations remain separate, at first exposure and presentation index 2; summary agreement is 0.5 with `archive` and `unknown` each 0.5. Exact fixture assertions check categorical Brier `0.020277777777777787`, log loss `0.6917070100871012`, ECE `0.09166666666666673`, and ordinal MAE/RMSE `1/15`; abstention threshold 0.8 retains one of two categorical cases. Drift has descriptive L1/selection/identity changes and an explicit no-quality-ranking interpretation. The current frozen output contract digest is `79b0afc9ef4518c7a2834a6ffddbb42812724cd371a691d8152e1c032de87c9b`; changed contracts return `stale_output_contract_fixture` and a four-step new-measurement/new-observation/freeze regeneration plan with compatibility decoding false. Reader presentation order and partial/unknown story time pass the nonlinear regression. All 12 capability families validate against installed lenses.

Focused Observe tests cover malformed/missing associations, explicit acquisition failures including missing fixture/provider, timeout and exhausted budget, and credential transport-extra rejection. Corpus manifest and annotation validators reject credential-like/provider-shaped keys; the synthetic fixture forbids hosted Observe and Inference export. Source/boundary scans found no direct SDK/Inference/ASM dependency in Intelligence and no executable evaluation asset; `priv/evaluation/*` consists of JSON data. Phase-9/10 source tests and durable integration suites passed.

The durable Phase-11 test reads stored resource history and compares actual provider requests to estimates, computes reuse from actual cache hits and scheduled states, and retains missing hosted monetary cost as `nil`. The provider-free example emitted synthetic rights policy (hosted export false), 2-reader disagreement, Brier 0.0288/log loss 0.7228099136023527/ECE 0.12 and abstention, current fixture status, all 12 families, nonlinear fixture `phase11.non_linear_story_time`, estimate-versus-actual requests 4/4, and unknown hosted cost `null`. Its `human_validation_claim` is false; the example makes no creative-quality claim.

## Authorized live and human gates

The user supplied `gpt-6-luna` for Workshop inference and the default JEV for System One, then directed the agent to use existing documentation and not ask again. The source SDK default is the mutable `jev-latest` alias. The Phase-11 Observe example expects `FOUNT_OBSERVE_API_KEY`; it was passed the existing `SYSTEM_ONE_API_KEY` through the process environment without printing the value. The exact model configuration is now documented in the Observe and Workshop example READMEs.

**Observe live QC: PASS.** From `packages/fount_observe`, `FOUNT_OBSERVE_API_KEY="$SYSTEM_ONE_API_KEY" FOUNT_PHASE11_OBSERVE_LIVE=1 mix run examples/phase_eleven_live.exs` exited 0. The official TypeSafe endpoint fingerprint reports requested `jev-latest`, reported model `jev-1.13.0`, SDK 0.6.0 and endpoint digest `4d337e861565d8c29b98d171ee46fa0983d4aba2858e8ee2f1109d42e6aa61dd`. Three synthetic measurements completed. Each used one provider request, one scheduled and successful state, zero cache hits/retries, and reported 365 input and 22 output tokens; hosted monetary cost remained `nil`. The exact output-contract SHA-256 is `79b0afc9ef4518c7a2834a6ffddbb42812724cd371a691d8152e1c032de87c9b`. Baseline and last distributions were both `{false: 0.27, true: 0.73}`; middle was `{false: 0.24, true: 0.76}`. Baseline-to-last L1 was 0.0, both selections were `true`, selection did not change and identity changes were empty. This is descriptive repeatability evidence only, not accuracy, calibration, reader agreement or creative quality.

**Workshop live generation QC: PASS after a recorded first failure and repair.** The first `gpt-6-luna`/low-effort run exited 1 as `partial_live_run`: its only branch failed local validation with `{:invalid_completion, :wrong_strategy_id}`. It generated no accepted candidate. The Phase-11 QC prompt was repaired to demand the exact stored strategy ID while preserving the validator and ordinary Workshop prompt. The retry used `FOUNT_CODEX_MODEL=gpt-6-luna FOUNT_CODEX_REASONING_EFFORT=medium FOUNT_PHASE11_WORKSHOP_LIVE=1`, `FOUNT_PHASE11_WORKSHOP_OUT=/tmp/fount-phase11-workshop-live-retry`, the disposable database URL, and `mix run examples/phase_eleven_live.exs`; exit 0. It used Launcher `Inference.Client.agent_session!` with `Inference.Adapters.ASM`, with Observe disabled. The run status was `complete`; one session produced exactly one saved first-scene candidate and one review/export packet, including Fountain, PDF, HTML, JSON and Markdown artifacts. The session record retained `partial` status while its single branch was `saved`; this is a writer-review state, not acceptance. Its budget recorded four inference calls and zero measurement states; completion traces identified `gpt-6-luna` but did not report token usage. The decision was `accepted: false`, and an independent database reload found accepted head revision `0daf21f7-0da3-41e0-b774-2a8f8eb3ba79`, equal to the base revision. No model output is treated as writer usefulness.

**Human/domain study: NOT_RUN.** Optional and skipped under D046. Real reader agreement, empirical calibration, screenplay usefulness and writer preference remain validation debt; the synthetic annotation fixture is not a human study.

## Repairs and decision

QC repaired package formatting; the Metrics compile warning; annotation summary double-validation; strict Credo depth/complexity/alias issues; the Observe live example's reverse Intelligence reference; the provider-free example's missing nonlinear fixture reference and unused alias; and the Phase-11 Workshop strategy-ID prompt after the first live failure. Exact metric assertions were added. All edits are limited to Phase-11 paths. Final `mix ci` after the live repair exited 0 with 337 workspace tests and all quality/docs gates.

All applicable engineering and authorized non-human live gates now pass under `18_RUNTIME_QC_PROTOCOL.md`. Phase 11 is **COMPLETE**. The optional human study remains visible validation debt under D046. No Phase-12 work has begun.
