# Phase 02 runtime QC report — Run foundation

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Identity and outcome

- Phase: **02 — Run foundation**; final status **COMPLETE**. Phase 03 remains `NOT_STARTED`.
- Prior Phase 01 verified Fount commit: `e79510008735220545f4ee9322bade127c868d40`.
- User-applied Fount commit: `3fc3aea5c73d1b9df7ee4bfc26e56a42a7de2aa2`, `main`, initially clean. Its installed 45 declared overlay results matched the manifest SHA-256 values exactly; manifest declares 17 modifications, 28 additions and zero deletions. The overlay was not reapplied. Delivered Fount ZIP SHA-256 was reported as `cdeb0480d4852d4da643d2e60237879abf1e89a8ce43aefe2211e3e60658541b`.
- User-applied docset Git commit: `ecbbf4c46387a984d1af170d99f6560e19242a07`, `main`, subtree initially clean. Contrary to the supplied handoff, it retained Phase 02 `NOT_STARTED` and lacked every Phase 02 handoff file. The original docset ZIP could not be checked byte for byte. The missing handoffs were reconstructed from the user-supplied handoff and installed source, clearly labeled, and the exact Fount overlay manifest was copied into the docset (SHA-256 `9c9f228b60c0352b0a70f001a2512b2577f1327219068a1f480ed94b0ba8e062`). No ZIP was reapplied.
- Runtime repair commit and final verified Fount commit: `228a76081871a273f49888f9530f3f805e0f4a4f`; final tree `8cc5c9859b6e94807d99f36afa98c0f583c9063f`. Push to `origin/main` succeeded (`3fc3aea..228a760`). The docset completion commit is the containing commit for this report; it was pushed after refresh and validation.
- Dependency checkouts remained unchanged at System One SDK `e757598a89e549274b979f0e77c6a4b2b6667752`, Inference `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`, and ASM `dc28a00e5ff6ad6932411334241ec8d9efda8857`.

## Toolchain and database isolation

Erlang/OTP 29, Elixir 1.20.3, Mix 1.20.3, PostgreSQL client/server 18.6, Node.js 24.19.0, npm 11.17.0, and `pdfinfo` 26.01.0. Local PostgreSQL used `/var/run/postgresql`, port `5433`, user `home` with peer authentication; no password was printed or required. `FOUNT_TEST_PGHOST`, `FOUNT_TEST_PORT`, `FOUNT_TEST_USER`, and `FOUNT_DATABASE_URL` targeted disposable databases `fount_phase02_qc_20260928` and `fount_phase02_isolation_qc_20260928`. `FOUNT_SYSTEM_ONE_SDK_PATH` pointed to the existing local SDK package because SDK 0.6.0 is unavailable on Hex. No provider credentials or calls were used.

The Core public schema received migration versions `20260924000000`, `20260924010000`, `20260924020000`, `20260927000000`, and `20260928000000`. Run integration used isolated `phase02_*` schemas, applied Core migrations before Run `20260928010000`, and dropped the schema per test. A distinct populated Core-to-Run upgrade retained an existing screenplay/revision. An earlier harness defect leaked temporary schemas; after repair, the full Run integration suite left **zero** `phase02_*` schemas in the fresh isolation database. Disposable QC databases were removed after checks.

## Executed checks

All commands ran from the Fount root unless a package path is named. `mix ci` covers `mix setup`, root/workspace format and unused-lock checks, warnings-as-errors workspace compile, five package unit/property suites, architecture, strict Credo, Dialyzer and warnings-as-errors docs. It does **not** run Python, PostgreSQL integration or Hex builds. The final run used the environment described above and exited 0. One initial CI invocation without `FOUNT_SYSTEM_ONE_SDK_PATH` failed dependency resolution; rerunning with the recorded local SDK path passed. This was environment configuration, not a source failure.

| Command / scope | Result | Executed evidence |
| --- | --- | --- |
| `mix ci` final | PASS | Five libraries; Core 73 (one property), Observe 65, Intelligence 141, Workshop 80, Run 4 unit tests. Architecture checked 315 source files and 359 compiled modules, zero violations; strict Credo zero issues, Dialyzer zero errors, and docs built for all five. Root/workspace format, lock and compile gates passed. |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` | PASS | 139 tests on full checkout; the source-packet import omission did not recur. |
| `python3 scripts/final_acceptance.py` | PASS | 16 source-only checks, including exact five-library inventory; this script alone gives no runtime assurance. |
| Core `MIX_ENV=test mix ecto.create`, `MIX_ENV=test mix ecto.migrate`, `MIX_ENV=test mix test integration`, `mix test` | PASS | Disposable database created/migrated through Phase 01; 16 Core integration and 73 Core unit/property tests. |
| Run `mix test`; `MIX_ENV=test mix test integration/storage_constraints_test.exs`; `integration/run_foundation_test.exs`; `integration/run_upgrade_test.exs`; `MIX_ENV=test mix test integration` | PASS | Four Run unit tests; full integration 11 tests. Fresh Core→Run schema, populated Core upgrade, transactional invalid FK/state/resource checks, creation, snapshots, concurrent decisions, immutable approval attempts, usage, step/attempt and delivery identity. |
| Workshop `MIX_ENV=test mix test integration`; `mix test` | PASS | 21 integration and 80 unit tests; standalone workflows and prior Core behavior preserved. |
| Host-free `Application.ensure_all_started(:fount_run)` with `FOUNT_DATABASE_URL` unset | PASS | Application started with `FountRun.Supervisor` child list `[]`; no Repo, host or provider startup. |
| Five package `FOUNT_PACKAGE_BUILD=1 mix hex.build` commands | PASS | Core, Observe, Intelligence, Workshop and Run archives built. Run archive included `priv/repo/migrations/20260928010000_create_run_foundation.exs`. Build artifacts were removed, none published. |
| Source/manifest boundary and `git diff --check` | PASS | All 45 installed result hashes matched the applied commit before repairs, zero deletions; Core source and dependencies have no Run import; Run has no SDK/Inference/ASM/provider dependency. |
| Docset `python3 scripts/test_docset.py`; `python3 scripts/docset.py refresh`; `python3 scripts/docset.py validate` | PASS | Nine docset transport tests after fixing state-independent fixture; refreshed views/inventory and validated complete docset. |

Five built Hex archive SHA-256 values: Core `2cf66ad59aed4a24cb76e94733648c1ad6dd48c9ecd54384be51fe20c8624936`; Observe `d7c29a06dbcc93eacd3c91cc774259fef80b3379962ef582d23393023668f088`; Intelligence `fe54708b4464ef82dc4c0364561f4716450df6fecab7c846686e8d68a56953f6`; Workshop `8f1361291fd516862970d9b406f23df74d786d7a8c7e6d685e3c3f6aea5a9cda`; Run `3ea8e5b60d074ff431bc2b9b8965aa3777b414006b4a2b05b80b08286ded9f9f`. These are package build results, not published dependency installation results.

## R01–R06 acceptance mapping

| ID | Executed evidence | Result |
| --- | --- | --- |
| R01 | Final five-library `mix ci`, 16 final-acceptance source checks, Core independent build/audit, empty-child host-free Run start, and five Hex builds with migration asset. | PASS |
| R02 | Core fresh migration and 16 integration tests; Run 11 integration tests apply Core before Run to fresh isolated schemas; separate populated Core upgrade retains rows; ten Run tables, composite links, invalid cross-screenplay/run/plan/policy/step, resource and state constraints tested transactionally. | PASS |
| R03 | Run closed plan/policy unit tests and start/read/list PostgreSQL case prove host-created owner/service authority, forged payload rejection, exactly one run plus plan/policy v1, exact key replay, changed content/caller conflict, unsupported option rejection and zero provider calls. | PASS |
| R04 | Unit and PostgreSQL snapshot cases prove stable stored/reloaded fingerprints, unknown/invalid field rejection, expected-version append, immutable historical plan/policy/events, linked identity and atomic current pointer change. | PASS |
| R05 | Decision tests bind run/plan/policy/base/context and responder identity; exact replay stable, changed response conflicts. Two named single-connection Repos have distinct PostgreSQL backend PIDs and race to exactly one resolution. Approval review/payload identity survives reload; rejected/invalid/fenced/failed/unknown outcomes store without Core acceptance; `accepted` returns `:acceptance_bridge_required`. | PASS |
| R06 | PostgreSQL integration reloads usage reservation/settlement, step/attempt/lease/fence and delivery rows; exact replays are stable, mismatched settlement/linkage and candidate XOR accepted revision failures reject, and event references retain step/attempt identity. | PASS |

## Repairs and preservation

The delivered source needed Elixir syntax and formatter fixes, one default-argument and unused-variable warning fix, a missing `saxy` lock entry and strict Credo-friendly helper extraction. The architecture dependency map was corrected to allow Workshop's existing ASM use while allowing Run only Core and rejecting Run imports of Workshop, ASM and providers; a regression test covers the boundary. Run usage and delivery replay now return the canonical stored row, and delivery exact replay is idempotent rather than conflicting. Source-shaped tests were strengthened with real PostgreSQL checks. The new populated-Core upgrade test confirms Core→Run migration compatibility. Decision concurrency uses distinct database backends. Integration cleanup now opens a fresh admin connection so every isolated schema is dropped. The docset test fixtures were made independent of its live Phase 02 state.

All changes stayed within Phase 02 storage behavior or its test/tooling. There is no worker claim/reclaim algorithm, provider dispatch, supervised poller, Workshop Run orchestration or crash recovery. Core remains independent of Run and no dependency checkout changed.

## Limitations and next handoff

Live providers, paid generation, browser review and human screenplay-quality checks were **NOT_RUN**; they are not required by this storage phase. Phase 03 must implement and test lease policy, provider accounting and crash recovery separately. The original Phase 02 docset ZIP was unavailable in the installed docset, so its original contents cannot be authenticated; the reconstructed handoffs disclose this discrepancy and the Fount overlay itself was verified by hash.

The Fount repair commit was pushed to `origin/main`. Phase 02 state and traceability were updated, docset refreshed/validated and pushed on `main`. Five fresh sealed XML inputs were generated only after both source commits were final; their paths, byte hashes and actual Git commits are in the external packet manifest returned with [NEXT_HANDOFF.md](../NEXT_HANDOFF.md). Stop before Phase 03 implementation.
