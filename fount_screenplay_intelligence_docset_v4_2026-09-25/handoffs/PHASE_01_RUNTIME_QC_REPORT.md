# Phase 1 Runtime QC Report

**Phase:** 1 — Direct Architecture Supersession and Probe Removal

**Date:** 2026-09-26 (Pacific/Honolulu)

**Applied baselines:** Fount `0cc296cca35d1040166bc34e5b92922b02c98c5e`; docset `d87ad39d3c79d4097c96d7f85c6ae2956b9afa59`

**Post-QC Fount commit:** `b82b6560da3fed3955e51a52f3a1d613d5141513` (follow-up dependency repair)

**Dependency source commits:** SystemOneSDK `e757598a89e549274b979f0e77c6a4b2b6667752`; Inference `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`

**Status:** COMPLETE (engineering; live Luna alternatives debt explicitly accepted by user)

## Applied state and source integrity

Both repositories initially had empty `git status --short`. The overlay was not reapplied. The 278-operation inventory contained 159 additions, 33 modifications and 86 explicit deletions. At intake, 191 added/modified result hashes matched, all 86 deletion preimages matched the manifest's explicitly recorded terminal-LF variant, and root `mix.exs` differed from its declared result hash despite its four-package workspace configuration. The physical retired package remained with 87 tracked files: the 86 declared deletions plus an excluded decorative SVG. Its ignored `_build`, `deps` and generated `doc` output also remained. No unknown content was deleted: the generated output was moved to `/tmp/fount-phase1-retired-preservation/fount_probe`, and the 87 reviewed tracked files were removed with Git. Old `dev` and `test` BEAM trees were separately preserved under `/tmp/fount-phase1-stale-{dev,test}-builds`; they had caused false old-package references in the compiled architecture scan. The retired directory is now physically absent.

The original four inputs were raw, unsealed Repomix exports. Their attachment identity and snapshot-body hashes do not authenticate the user's earlier checkout. This limitation cannot be retroactively repaired. The updated inventory retains the original operation hashes and adds current checkout hashes and follow-up corrections; fresh sealed snapshots establish the subsequent source baseline only.

## Toolchain and dependency resolution

- Erlang/OTP 29, Elixir/Mix 1.20.3, Python 3.14.4, Node 24.19.0, npm 11.17.0, PostgreSQL 18.6, Poppler and eSpeak NG.
- `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` resolves the checked-out SystemOneSDK 0.6.0 source through Observe for all consumers. Workshop now resolves published Inference 0.5.0, ASM 0.17.1 and Core 0.9.1 through Mix-generated locks. The SDK 0.6.0 requirement still requires the local path; it is not a published Hex release.
- Hex 0.5.0's 94 packaged files matched Git commit `382c95978f2967591d16053c27ba0ab5071dc27b` byte-for-byte. A local plain `v0.5.0` tag was created there and branch `fount-phase1-sdk` was made from that tag and advanced to `e757598a89e549274b979f0e77c6a4b2b6667752`. Neither the SystemOneSDK branch nor tag was pushed. The local 0.6.0 source and packaged 0.5.0 both default to the single Jev model alias `jev-latest`.
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

### 2026-09-26 follow-up release and runtime checks

The previous ASM/Core releases exposed an oversized prompt transport failure in the real Workshop alternatives workflow: a 73,741-byte prompt was passed as a `codex exec` argv value and the erlexec port returned `:einval`. Core 0.9.1 now sends Codex prompts over 32,768 bytes on bootstrap stdin and passes `-` as the CLI prompt argument. A focused regression checks the full 73,741-byte payload and a real Core session with a roughly 70 KB prompt reached a terminal result. ASM's real Core lane with the same large prompt returned `{:ok, :end_turn, true, 2}`. The transport failure was a Core argument-size defect, not a provider/model error.

| Release | Git commit/tag | Prepublish verification | Hex result |
|---|---|---|---|
| Core 0.9.1 | `2ea02df` / `v0.9.1` | `mix ci` passed, 404 tests, Dialyzer zero errors; real 70 KB Luna session passed | Published and pushed |
| Codex SDK 0.21.1 | `299abad` / `v0.21.1` | 1564 tests, zero failures (4 skipped, 16 excluded); compile, Credo, Dialyzer, docs and package build passed; real `Codex.Thread.run` with Luna succeeded | Published and pushed |
| ASM 0.17.1 | `dc28a00` / `v0.17.1` | 397 tests, zero failures (6 excluded); compile, Credo, Dialyzer, docs and package build passed; real Codex SDK lane and 70 KB Core lane succeeded | Published and pushed |
| Inference 0.5.0 | `3750a03` / `v0.5.0` | 130 tests, zero failures; compile, Credo, Dialyzer, docs and package build passed; real ASM/Core Luna example returned text | Published and pushed |

An earlier 0.9.0/0.21.0/0.17.0 release sequence had lacked direct real examples before publication. The patch releases above were verified with real examples before publication. Inference's local `Mix.install` live example required a forced fresh resolution because its prior install cache still held Core 0.9.0; the example now sets `force: true`. No exact wording from a model was used as a unit-test oracle.

After upgrading Fount Workshop to these releases, the root 198 tests passed, the compiled architecture gate passed (209 source files, 230 modules, zero violations), `scripts/verify_handoff.sh --offline` passed all 17 recorded checks, both PostgreSQL integration suites passed (11 and 14), strict Credo, Dialyzer, docs, lock check and the Workshop package build passed. Logs are under `/tmp/fount-phase1-final-*` and `/tmp/fount-handoff-offline-20260926T163656-177477`.

## Corrections and preservation

The repairs removed the physical retired package and stale generated BEAMs, resolved package locks through Mix, corrected warnings in the SDK boundary and architecture gate, placed Intelligence evidence tests with their owning package, retained the Workshop neutral provider-error boundary, and made local Hex builds emit versioned dependency metadata. Strict Credo fixes used ordinary aliases and extracted control-flow helpers without removing meaningful assertions or weakening the gate. The 37 production and 26 test mappings in the preservation audit remain represented by source and migrated tests. Existing development, revision, comparison, review, acceptance, recovery, table-read, speech and export paths remain present. Unit and integration suites exercised them; additional live modes that require successful completion were not claimed as passed.

The deterministic Phase 1 demonstration ran in both decisions against the disposable database using `Inference.Adapters.Mock` and `Observe.Sandbox`. Reject preserved the original accepted Fountain; accept installed the candidate revision. Each wrote original/candidate/accepted Fountain, real comparison and review JSON, strategy-contrast JSON, table-read HTML and an identity manifest. The accept run also rendered a two-page Letter PDF. Both pages were rasterized and visually inspected; the body page contains the selected scene and dialogue. A separate recovery example produced an exact historical candidate and PDF. The non-speech table read produced JSON/HTML and a six-page PDF. eSpeak NG produced four real PCM WAV clips. These are engineering fixtures, with no human preference, actor response or creative-superiority claim.

## Live checks and open gates

The measurement-only `examples/analysis.exs --mode knowledge` completed three perspectives with the official TypeSafe endpoint and the SDK's `jev-latest` default; no private screenplay was sent. In the live alternatives run, provider response metadata identified `jev-1.13.0` while the request fingerprint retained mutable alias `jev-latest`. This is model identity evidence, not a quality judgment.

The first authorized Workshop attempt used `FOUNT_CODEX_MODEL=gpt-6-luna` and low effort on the repository's public fixture. It ended `partial_live_run` with `{:completion_provider_error, :invalid}` because ASM 0.16.0 lacked that model. After the model-catalog updates, a smaller live `bridge` run completed in 94,045 ms with three inference calls, generated review/PDF artifacts and no acceptance (`/tmp/fount-phase1-luna6-bridge`). This proves the public writing path can reach the real provider and leave output as a candidate.

The subsequent live `alternatives` retry used Core 0.9.1. Process inspection showed `codex exec ... -`, proving the previously failing 73,741-byte prompt moved over stdin. The run lasted 348,428 ms and ended `partial_live_run`: `approach_practical_evasion` had `{:completion_provider_error, :timeout}`; `approach_costly_admission` produced `{:invalid_completion, {:uninspected_citations, [...]}}`. Fount correctly rejected the uninspected evidence references. It produced no accepted candidate. The exact run record is `/tmp/fount-phase1-luna-alternatives-core091/alternatives-b6f1b0d0-d741-473f-a994-4192d44564b4/run.json`. This is a live model-output failure, not a pass. The user explicitly directed low-effort Luna testing with expected model-output failures and deferred stronger-model comparison; this remains validation debt, not a creative or audience result. Deterministic Mock/Sandbox tests and stored writer demonstrations establish output-independent contract behavior.

The tagged SDK provenance concern is resolved locally by the package-byte comparison, plain `v0.5.0` tag and `fount-phase1-sdk` branch described above. The current 0.6.0 SDK remains a local-path dependency and is not published. The original four raw, unsealed attachments remain unauthenticated as historical checkout snapshots; fresh sealed current-source snapshots establish the next handoff baseline, without retroactive provenance claims. No unknown retired-package file remains. Phase 1 engineering is **COMPLETE** under the user's explicit Luna-output waiver; Phase 2 remains NOT_STARTED.

## Final source handoff

The current source was packed and sealed with `scripts/seal_handoff_snapshot.py` into `/tmp/fount-phase1-final-packet`. The Fount seal covers 408 files at `b82b656` (SHA-256 `d800f285584d8257030a5b189d146fdf23a247b4b56d0dff9eaa439b77c5c36f`); the SystemOneSDK seal covers 254 files at `e757598` (SHA-256 `bc12acf58c0902f261b3f505b34473b1be77053f52015d405a5f022ab7f7917d`); the Inference seal covers 69 files at `3750a03` (SHA-256 `7f44e4d69f86201f01f38d48f0f7b866d424cf28468dcc2d5ffdeebd7e333d86`). The SDK client configuration test was reviewed and explicitly included after Repomix's conservative security exclusion; its strings use dummy `example.test` credentials, not live secrets. The docset seal and complete ZIP are recorded in the packet's preparation record after this report is committed. `PHASE_01_DOCSET_HASHES.json` records exact current docset file identities and omits itself to avoid recursion.