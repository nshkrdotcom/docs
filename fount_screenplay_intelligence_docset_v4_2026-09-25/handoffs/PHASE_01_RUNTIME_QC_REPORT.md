# Phase 01 runtime QC report — Core approval safety

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Identity and outcome

- Phase: **01 — Core approval safety**. Final status: **COMPLETE** after the checks below.
- User-applied Fount commit: `8fa4bb0899e4094f88523fb6d93f231157f46fb7` on `main`; initial tree clean.
- User-applied docset commit: `5a7128335a7b054083cdb4bff52127ef2afbc61d` on `main`; docset subtree initially clean. The operational docs alias resolves to the canonical path above.
- Input source Repomix SHA-256: Fount `e0c159ccc415a4d85478360088d1509aa45a88361fe66c839a6f9a3f2f23ba44`; docset `92451fc693a7cdd1db8f5922fcd4cf262cba796d8b00ba866b4b71e5b674dd61`.
- Delivered overlay SHA-256: `0187847138ff2cb50e04a4b6d87e97aba0732025a7cda0fc06f6dfbb0b30ec9a`. The copied `handoffs/PHASE_01_OVERLAY_MANIFEST.json` has 53 entries, all installed `result_sha256` values matched byte-for-byte before QC, and `deletions` is empty. The overlay was not reapplied.
- Runtime repair commit: `e79510008735220545f4ee9322bade127c868d40`; final verified Fount tree: `8b0a0d321e69629978f315c56d93cf432dfbac0d`. The containing docset commit supplies its own identity.
- Code push: `main` → `origin/main` succeeded (`8fa4bb0..e795100`). Docset push: `main` → `origin/main` after this report commit. Phase 02 packet is generated from both committed sources after the docset push; its paths and checksums are in the returned packet manifest.

## Toolchain and database isolation

Elixir 1.20.3, Mix 1.20.3, Erlang/OTP 29, PostgreSQL server/client 18.6, Node.js 24.19.0, npm 11.17.0, and `pdfinfo` 26.01.0. Local PostgreSQL ran on `/var/run/postgresql:5433` as user `home`. QC created disposable databases `fount_phase01_qc_20260928` and `fount_phase01_workshop_qc_20260928`; `FOUNT_DATABASE_URL` targeted only the former. Workspace test settings targeted these isolated databases. No provider credential was set or needed. `FOUNT_SYSTEM_ONE_SDK_PATH` pointed to the existing `/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` checkout because SDK 0.6.0 was unavailable on Hex; no dependency source was changed.

The isolated Core database has schema migration versions `20260924000000`, `20260924010000`, `20260924020000`, `20260927000000`, and `20260928000000`. The per-test migration harness additionally created/dropped fresh and baseline-upgrade schemas. Its negative approved-row insertion raised a PostgreSQL constraint error as asserted. Final CLI acceptance used retained approval ID `c4745ed1-c2d4-4b79-8bc5-b93f021d9231`; a SQL count found exactly one acceptance for that ID after first call, replay, and conflict attempts.

## Executed checks

All commands below ran from `/home/home/p/g/n/fount` unless a package directory is named. `mix ci` is the checked-in aggregate: it executes `mix setup`, root/workspace format checks, root/workspace unused-lock checks, warnings-as-errors workspace compile, workspace unit/property tests, `mix fount.architecture`, strict workspace Credo, workspace Dialyzer, and warnings-as-errors workspace docs. It does not cover the separate Python suite, integration directories, CLI journey or Hex builds.

| Command / scope | Result | Executed evidence |
| --- | --- | --- |
| `mix setup` with local SDK path | PASS | Dependencies resolved and Workshop `npm ci` completed. The first attempt without the required SDK path failed during dependency resolution; the successful run used the checked-in path option. |
| `mix ci` final | PASS | Four workspace projects compiled with warnings as errors; unit/property results: Core 73, Observe 65, Intelligence 140, Workshop 80; architecture pass; strict Credo zero issues in all four; Dialyzer zero errors in all four; docs built. |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` | PASS | 130 tests, including the previously unavailable prune-directory module on the full checkout. |
| `MIX_ENV=test mix ecto.create`, `MIX_ENV=test mix ecto.migrate` in `packages/fount` | PASS | The manually created isolated DB was reported as already created; fresh migrations through `20260928000000` ran successfully. |
| `MIX_ENV=test mix test integration/approval_migration_test.exs` in `packages/fount` | PASS | 2 tests: fresh schema and baseline `20260927000000` → approval migration, historical classification and DB constraint rejection. |
| `MIX_ENV=test mix test integration/writing_persistence_test.exs integration/continuation_concurrency_test.exs` in `packages/fount` | PASS | Targeted acceptance suite passed after repairs; final separate writing test 11 and concurrency test 3. |
| `MIX_ENV=test mix test integration` in `packages/fount` | PASS | 16 tests, including fresh/upgrade migration, exact pending candidate replay, rollback, and independent-connection race. |
| `mix test` in `packages/fount` | PASS | 73 passed, including one property test. |
| `MIX_ENV=test mix test integration` in `packages/fount_workshop` | PASS | 21 tests across standalone writer workflows, rejection, durable candidate-only paths, PDF/export and resume. |
| `mix test` in `packages/fount_workshop` | PASS | 80 tests. |
| `mix fount.accept --help` in `packages/fount_workshop` | PASS | Help requires `--candidate`, `--expected-revision`, `--actor`, `--principal-type`, and `--approval-id`. |
| Scripted `mix fount.accept` journey against the isolated DB | PASS | Explicit human type, configured local owner/screenplay, and retained UUID accepted one candidate; identical retry returned the same result revision; unconfigured or wrong owner was rejected, as was the old actor-only shape. SQL found one approval row. No provider call. |
| `FOUNT_PACKAGE_BUILD=1 mix hex.build` in each of the four package directories | PASS | Four archives built: `fount` checksum `2cf66ad59aed4a24cb76e94733648c1ad6dd48c9ecd54384be51fe20c8624936`, Observe `e6763e9e1ecb4b3f1abd1f606dc1cc572a93046c7baa094872e01b8e4295b9a9`, Intelligence `2775cc37c5ea2f295f97b3ae8956501d00311f3f32d46d454046318721b1690a`, Workshop `4633e23a10c0e25cc8c2af7ff1017815bcc651ee3779d8bd69a34c92a79fb599`. These are build checksums, not publication evidence; generated untracked tar files were removed after verification. |
| Source boundary audit | PASS | Exactly four Blitz projects; `packages/fount_run` absent; Core has no Run reference/dependency. `set_head/3` has exactly two call sites: genesis and approved candidate acceptance. `git diff --check` passed. |

Expected rejection, stale-head, conflict and rollback results above were assertions inside passing tests or scripted CLI negative checks. They are not counted as engineering gate failures.

## A01–A06 acceptance mapping

| ID | Executed evidence | Result |
| --- | --- | --- |
| A01 | Core `writing_persistence_test.exs` creates genesis then accepts direct human, agent and service candidates; typed audit columns are queried. | PASS |
| A02 | Core persistence and concurrency tests reject changed `save/4` and `save_edit/4`, verify no revision/head write, then accept a `save_edit_candidate/4`; source audit finds only the two authorized `set_head/3` call sites. | PASS |
| A03 | Core unit and PostgreSQL tests assert candidate/content/base/check/report/authority mismatch, missing required checks, advisory substitution, conflicting application/check results, automated override rejection, deterministic failures for all principal types, blank human override rejection, explicit human semantic override, and unchanged head/audit before valid acceptance. | PASS |
| A04 | Concurrency test starts two separate named Ecto Repos with pool size one, confirms distinct PostgreSQL backend PIDs, releases both attempts together, and asserts one success, one stale result and one approved audit. Core replay/conflict tests prove stable ID retry and changed same-ID conflict; the scripted CLI proves stable retry across separate invocations. | PASS |
| A05 | Migration test creates disposable fresh and baseline-upgrade schemas; historical audit rows retain null principal types; an incomplete approved row violates DB constraints. PostgreSQL rollback tests leave no partial revision/head/audit write. Pending-candidate regression clears the legacy snapshot fields, then confirms only exact immutable replay attaches the new fingerprint; changed payload or revision metadata conflicts, and accepted historical rows cannot be backfilled. | PASS |
| A06 | Workshop 21 integration and 80 unit tests pass; CLI typed acceptance, local owner binding, rejection, candidate-only, exports and non-mutating review/edit paths remain exercised. Four package builds pass and Core has no Run dependency. | PASS |

## Repairs and preservation

The offline source had formatting differences, an invalid remote function in a guard, a default-argument clause warning, and an unused Workshop variable. Runtime QC formatted only affected delivered files and repaired those compile defects. The fresh/upgrade migration test needed Ecto URL parsing for its direct Postgrex admin connection, an Ecto migrator pool of two, and text-to-UUID casts for raw SQL parameters. Another integration assertion had interpolation inside a match pattern; it now compares bound values explicitly. Strict Credo required focused decomposition of new approval validation and persistence helpers plus aliases; Dialyzer required an ordinary list membership check instead of opaque `MapSet.subset?/2`, and a refreshed Workshop dependency PLT. The concurrency regression now uses two named Repos rather than a dynamic Repo test harness that sent raw SQL to a different pool from the transaction. Added checks cover the pending-candidate upgrade seam, every principal on deterministic failure, required-check severity and application result conflicts, exact revision replay, historical backfill rejection, and local CLI owner binding.

No migration identity constraint was weakened. The existing four library projects, immutable revisions, standalone Workshop workflows and historical migration rows remain within the Phase 01 boundary. No `fount_run`, workers, Run tables, host app, SDK/Inference/ASM changes, paid provider call, or live creative-quality claim was made. Hex archives were built but not published; published sibling dependency installation is outside this gate.

## Next handoff

The Fount repair commit is pushed. This report is part of the Phase 01 completion docset commit on `main`; after that commit is pushed, prepare the next five sealed XMLs from both committed sources. Phase 02 implementation is outside this cycle.
