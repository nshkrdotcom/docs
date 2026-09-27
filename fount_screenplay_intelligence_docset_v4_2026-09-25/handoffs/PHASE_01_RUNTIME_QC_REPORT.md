# Phase 1 Runtime QC Report

**Phase:** 1 — Direct Architecture Supersession and Probe Removal

**Date:** 2026-09-26 (Pacific/Honolulu)

**Applied baselines:** Fount `0cc296cca35d1040166bc34e5b92922b02c98c5e`; docset `d87ad39d3c79d4097c96d7f85c6ae2956b9afa59`

**Post-QC Fount commit:** `b1953288ffd8ea514f419f2be9faf4cba6f49a69`

**Dependency source commits:** SystemOneSDK `e757598a89e549274b979f0e77c6a4b2b6667752`; Inference `a1f91ee33d082fc726b0dfdc3ccf619fca9121b9`

**Status:** QC_BLOCKED

## Applied state and source integrity

Both repositories initially had empty `git status --short`. The overlay was not reapplied. The 278-operation inventory contained 159 additions, 33 modifications and 86 explicit deletions. At intake, 191 added/modified result hashes matched, all 86 deletion preimages matched the manifest's explicitly recorded terminal-LF variant, and root `mix.exs` differed from its declared result hash despite its four-package workspace configuration. The physical retired package remained with 87 tracked files: the 86 declared deletions plus an excluded decorative SVG. Its ignored `_build`, `deps` and generated `doc` output also remained. No unknown content was deleted: the generated output was moved to `/tmp/fount-phase1-retired-preservation/fount_probe`, and the 87 reviewed tracked files were removed with Git. Old `dev` and `test` BEAM trees were separately preserved under `/tmp/fount-phase1-stale-{dev,test}-builds`; they had caused false old-package references in the compiled architecture scan. The retired directory is now physically absent.

The original four inputs were raw, unsealed Repomix exports. Their attachment identity and snapshot-body hashes do not authenticate the user's earlier checkout. This limitation cannot be retroactively repaired. The updated inventory retains the original operation hashes and adds current checkout hashes and follow-up corrections; fresh sealed snapshots establish the subsequent source baseline only.

## Toolchain and dependency resolution

- Erlang/OTP 29, Elixir/Mix 1.20.3, Python 3.14.4, Node 24.19.0, npm 11.17.0, PostgreSQL 18.6, Poppler and eSpeak NG.
- `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` resolved the checked-out SystemOneSDK 0.6.0 source through Observe for all consumers. New Observe and Intelligence locks came from Mix. Workshop's stale `system_one_sdk` 0.5.0 lock entry was removed with `mix deps.unlock system_one_sdk` followed by `mix deps.get`; its effective dependency tree resolves the same 0.6 source through Observe. Inference remains the Hex 0.4.1 resolution.
- `mix hex.info system_one_sdk` reported latest published release 0.5.0. Both local and remote Git tag lists were empty. The user's requested branch from a tagged Hex release therefore could not be created without inventing a tag or falsely identifying a commit. Hex 0.5.0 was fetched separately for inspection and also defaults to `jev-latest`; the local 0.6.0 source uses that same default. No sibling repository was edited.
- The disposable test database was created and migrated at `127.0.0.1:55432`, database `fount_phase1_qc`, user `home`, with local trust authentication. No production or existing user database was used.

## Executed checks

| Check | Result |
|---|---|
| `python3 -m unittest discover -s scripts/tests -v`; `bash -n scripts/verify_handoff.sh` | PASS, 18 Python tests and shell syntax |
| `mix setup`; workspace formatting; `mix blitz.workspace compile --warnings-as-errors` | PASS after repairs |
| `mix format --check-formatted`; workspace format check; root unused-lock check; workspace lock check | PASS |
| `mix test` | PASS: Fount 71 (including one property), Observe 25, Intelligence 44, Workshop 58; total 198 |
| `mix fount.architecture` | PASS, source and compiled mode; 209 source files, 230 compiled modules, zero missing and zero violations. Negative architecture fixtures ran in the Intelligence suite. |
| `mix blitz.workspace credo --strict` | PASS, no issues in any package after source refactors |
| `mix blitz.workspace dialyzer` | PASS after the Observe error-normalization correction; final post-refactor rerun reported zero errors in all four packages. |
| `mix blitz.workspace docs` | PASS, all four packages generated docs with warnings as errors |
| Package-local `mix hex.build` (`FOUNT_PACKAGE_BUILD=1` for versioned dependency metadata) | PASS, four local archives inspected for README/license/guides/assets; no publish. Observe's 0.6.0 SDK requirement is not currently installable from published Hex. |
| Fount `MIX_ENV=test mix ecto.create`, `ecto.migrate`, `mix test integration` | PASS, migrated through `20260924020000`, 11 integration tests |
| Workshop `npm ci`; `MIX_ENV=test mix test integration` | PASS, 14 integration tests including stored writer and real PDF layout |
| `scripts/verify_handoff.sh --offline` | PASS, 17 recorded package checks including the compiled architecture gate |

The final formatting, lock, compile, 198 unit-test, compiled architecture, strict Credo, docs, Dialyzer, 25 integration-test, package-build and offline-handoff reruns all exited zero after the last source refactor. The offline handoff command is `bash scripts/verify_handoff.sh --offline` because that script is not executable in this checkout. Command logs and status tables are outside the repositories under `/tmp/fount-phase1-*`.

## Corrections and preservation

The repairs removed the physical retired package and stale generated BEAMs, resolved package locks through Mix, corrected warnings in the SDK boundary and architecture gate, placed Intelligence evidence tests with their owning package, retained the Workshop neutral provider-error boundary, and made local Hex builds emit versioned dependency metadata. Strict Credo fixes used ordinary aliases and extracted control-flow helpers without removing meaningful assertions or weakening the gate. The 37 production and 26 test mappings in the preservation audit remain represented by source and migrated tests. Existing development, revision, comparison, review, acceptance, recovery, table-read, speech and export paths remain present. Unit and integration suites exercised them; additional live modes that require successful completion were not claimed as passed.

The deterministic Phase 1 demonstration ran in both decisions against the disposable database using `Inference.Adapters.Mock` and `Observe.Sandbox`. Reject preserved the original accepted Fountain; accept installed the candidate revision. Each wrote original/candidate/accepted Fountain, real comparison and review JSON, strategy-contrast JSON, table-read HTML and an identity manifest. The accept run also rendered a two-page Letter PDF. Both pages were rasterized and visually inspected; the body page contains the selected scene and dialogue. A separate recovery example produced an exact historical candidate and PDF. The non-speech table read produced JSON/HTML and a six-page PDF. eSpeak NG produced four real PCM WAV clips. These are engineering fixtures, with no human preference, actor response or creative-superiority claim.

## Live checks and open gates

The measurement-only `examples/analysis.exs --mode knowledge` completed three perspectives with the official TypeSafe endpoint and the SDK's `jev-latest` default; no private screenplay was sent. In the live alternatives run, provider response metadata identified `jev-1.13.0` while the request fingerprint retained mutable alias `jev-latest`. This is model identity evidence, not a quality judgment.

The authorized small Workshop attempt used `FOUNT_CODEX_MODEL=gpt-6-luna` and `FOUNT_CODEX_REASONING_EFFORT=low` on the repository's public fixture. It ended `partial_live_run` after two inference calls, with the neutral stored error `{:completion_provider_error, :invalid}` during preparation. No candidate was generated or accepted. The run artifact is under `/tmp/fount-phase1-luna-alternatives`; it is an actual failure, not a pass and not a test of creative quality. The deterministic Mock/Sandbox writer demonstration supplies output-independent contract coverage. This live route still needs a supported ASM model/configuration or an explicit user waiver recorded as debt.

The requested SDK branch from a tagged Hex release remains unresolved because no upstream Git tag exists and 0.6.0 has not been published to Hex. A future release/tag or an explicit source identity decision is needed before this can be claimed. The original raw-input provenance limitation also remains disclosed. Phase 1 is therefore **QC_BLOCKED**, despite passing engineering and writer fixture gates. Phase 2 has not started.
