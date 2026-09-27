# Phase 2 runtime QC report

**Date:** 2026-09-26 HST. **Result:** COMPLETE for Phase 2 engineering and the authorized narrow live measurement gate. No Phase 3 work or human creative-quality claim was made.

## Source identity and authenticity

- Applied Fount source commit: `2eea821` on `main`; applied complete docset commit: `819c1c6`. Both worktrees were clean before repair. Post-QC Fount repair commit: `08c2c44`. The final docset QC commit and sealed packet identities are recorded in `PHASE_02_PACKET_RECORD.md`.
- The applied `handoff/fount-overlay.manifest.json` listed 21 adds, 25 modifications and zero deletions. All 46 result SHA-256 hashes matched the live checkout before any repair. Its manifest is archive metadata, not a self-hashed installed payload. `PHASE_02_FILE_INVENTORY.json` retains this baseline and adds a separate post-QC repair inventory.
- Dependency source identities: SDK `e757598a89e549274b979f0e77c6a4b2b6667752` (0.6.0), Inference `3750a03ec62a3c9da11be9caa4dc911ebbbb9801` (0.5.0). Observe required the actual SDK 0.6.0 local path through `FOUNT_SYSTEM_ONE_SDK_PATH`; no current Hex availability is claimed. The omitted cleanup helper and SDK client-configuration test both exist in the live checkouts. Original Fount decorative SVGs were not removed.
- Host: Linux 6.18.33.2 WSL2 x86_64; Erlang/OTP 29.0.5, Elixir/Mix 1.20.3, Python 3.14.4, Node 24.19.0, PostgreSQL client 18.6. Logs are outside the repositories under `/tmp/fount-p2-*` and `/tmp/fount-handoff-offline-*`.

## Executed gates

| Command or gate | Exit | Observed result |
|---|---:|---|
| `mix setup` with SDK source path | 0 | Four-package dependency resolution and Workshop `npm ci` succeeded. |
| Observe/Intelligence `mix format --force`; Observe test compile `--warnings-as-errors` | 0 | Offline source required formatting. Subsequent format checks passed. |
| Five Phase 2 Observe test files | 0 | Original 32 tests passed; two regression tests were added and pass in the full suite. |
| Observe `MIX_ENV=test mix test` | 0 | 59 passed after repairs. |
| Observe `MIX_ENV=test mix run examples/phase_two.exs` and `examples/fixture_file.exs` | 0 each | Fixture scene packet available with three raw noul/choice/score answers and six current-revision evidence refs per answer; unavailable packet has zero findings and a typed `provider_unconfigured` error. Fountain source unchanged. File fixture completes with one entry. These are engineering oracles. |
| `python3 -m unittest discover -s scripts/tests -v`; `bash -n scripts/verify_handoff.sh` | 0 each | 26 Python tests, including four cleanup-helper tests, passed; shell syntax passed. |
| Root `mix ci` | 0 | Setup, formatting/unused lock checks, four-package warnings-as-errors compile, tests (Fount 71 including one property, Observe 59, Intelligence 44, Workshop 58), compiled architecture, strict Credo, Dialyzer and ExDoc all passed. Architecture checked 238 compiled modules and 217 source files, zero violations. |
| `bash scripts/verify_handoff.sh --offline` with SDK path | 0 | All package dependency, format, compile, test, and compiled architecture rows passed; result table `/tmp/fount-handoff-offline-20260926T175004-219387/status.tsv`. An initial run without the required SDK path failed dependency resolution; it was not treated as a source pass. |
| SDK package `mix test` | 0 | 140 tests and one doctest passed, two tagged live tests excluded; transport/lifecycle tests are deterministic. |
| Isolated `FOUNT_DATABASE_URL` `mix ecto.create`, `mix ecto.migrate` | 0 each | Created only `fount_phase2_qc` on local PostgreSQL socket port 5433; no user database was dropped or reset. |
| Fount and Workshop `MIX_ENV=test mix test integration` | 0 each | 11 and 14 tests passed. |
| Workshop writer reject and accept examples in separate `/tmp/fount-phase2-*` directories | 0 each | Reject kept accepted head equal to base; accept advanced head to candidate. Exact original/draft Fountain and isolated candidate files remain present. Table read has one turn. Accept rendered a two page PDF. Both used Inference Mock and Observe Sandbox with real persistence/review/export. |
| `FOUNT_PACKAGE_BUILD=1 mix hex.build` in each of four packages | 0 each | Four archives built and inspected: 117/67/47/81 content files; no `_build`, `deps`, `node_modules`, `.env`, PDF or nested tar content. Archives moved to `/tmp/fount-p2-packages`; nothing published. |
| Authorized TypeSafe `MIX_ENV=test mix run examples/live.exs` | 0 | One synthetic scene request, retries off, three supported question types, available packet, six current-revision evidence refs per answer. Requested alias `jev-latest`, reported model `jev-1.13.0`, SDK 0.6.0, endpoint SHA-256 `4d337e861565d8c29b98d171ee46fa0983d4aba2858e8ee2f1109d42e6aa61dd`. One request, zero retries, 499 input/69 output tokens. Noul raw 0.81; choice raw `concealing` 0.98 with confidence 0.96; score raw 1.79 with confidence 0.68. Calibration is absent. No bearer header, raw endpoint, or API key appeared in the live log. |

## Repair and review findings

The offline source formatted with Elixir's changed-file cache, so plain `mix format` initially missed many applied files. A forced formatter pass changed 28 Observe files; the repair diff is separate from the verified application commit. Strict Credo then exposed ten complex validation/accounting functions, two nesting issues and seven alias suggestions. Those functions were split into small helpers without raising caps or relaxing checks. Warnings-as-errors compile, the full suites, Credo and Dialyzer pass after the refactor.

Two behavior repairs were made. A scheduled remote call with missing completion metadata previously reported **zero** actual provider requests; it now reports unknown (`nil`) while retaining the scheduled count, with a regression test. `SceneQuestion` inspected the internal shape of opaque `Provider.t()`; a safe sensor accessor fixes that Dialyzer violation. `ProviderCall` now uses `Task.ignore/1` for monitor cleanup after consuming a task result. The Intelligence Dialyzer PLT was stale against `Context.semantic_map/1`; `mix dialyzer --force-check` refreshed it without changing source. SDK adapter tests cover real SDK normalization, delayed second-state timeout with first-state reuse, no second dispatch under a finite cap, typed wire-size failure, and official/generic endpoint construction with opaque credential handling.

Review confirmed exact semantic input excludes hidden notes and revision-only IDs; changed question/input/context/projection/model/parameter/privacy identity misses or rejects stale cache and import records; fresh Observations bind current revision evidence; raw values and calibration remain separate; human/rule records carry no invented probabilities; fixture packets reject duplicate/stale shapes. The compiled architecture gate found no Probe residue, pure Intelligence provider reach-through, native SDK leakage outside Observe's adapter, or new Inference use outside Workshop. Custom declarations remain data-only and host caps are intersected. A local timeout proves preservation of completed work, not cancellation of a remote provider request.

## Limits and validation debt

The live call is one authorized synthetic TypeSafe measurement, not an empirical calibration study or an evaluation of screenplay quality. A generic endpoint was covered by deterministic construction tests, not a live generic service. SDK live-tagged tests, speech output and a human pilot were not run; Phase 2 requires no human pilot. Monetary cost was not reported by the provider, so it remains unknown. The Phase 1 Luna alternatives output debt remains the historical user-authorized exception and was not reused for Phase 2.
