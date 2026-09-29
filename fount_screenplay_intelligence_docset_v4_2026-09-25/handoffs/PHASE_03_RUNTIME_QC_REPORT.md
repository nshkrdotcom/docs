# Phase 03 runtime QC report — Durable execution

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Identity and outcome

Phase 03 is **COMPLETE** after executed local QC. Phase 04 remains `NOT_STARTED`; no Phase 04 pipeline or strategy decision implementation was added.

- Verified Phase 02 baseline: Fount `228a76081871a273f49888f9530f3f805e0f4a4f`; docset `ae04a9d5dd553eca97ec52d5befa414bda251560`.
- User-applied Phase 03 commits at QC entry: Fount `a3b8fbc930f2837c4514f234633ac8987f3da6d6`, docset `b9e8dc69e46f91074ad0f395a04fdea24c0c9aea`, both `main` tracking `origin/main`, both clean. Neither ZIP was reapplied.
- Copied Fount manifest SHA-256 `f941a226b7c3b36ce667853a6d62ad7c83e85db35caf4d2e5c7e52fb64c58575`: all 33 installed result byte hashes matched, with zero declared deletions. The installed filesystem reported mode `0664` for those files versus manifest `0644` because of the shared checkout permissions; Git recorded ordinary non-executable files. This is a reviewed mode discrepancy, not a payload mismatch.
- Final verified Fount repair commit `a3b9d8fe5d009dad15b6d3d354cc470560ec1c0b`; tree `971580ed16d4ad443a9933efc6fbed1885f7a952`. The Fount worktree was clean and `origin/main` push succeeded (`a3b8fbc..a3b9d8f`). The containing docset commit supplies this report's docset identity.
- The supplied overlay archive SHA-256 was `c063c0b2d66bd2466885231c26a5f14719109fc15dac3e969454ce700c14c6e6`; the archive was not reapplied or revalidated from a local ZIP, so the installed file/manifest checks above are the local evidence.

## Toolchain and isolated database

Erlang/OTP 29, Elixir 1.20.3, Mix 1.20.3, PostgreSQL client/server 18.6, Node.js 24.19.0, npm 11.17.0, `pdfinfo` 26.01.0 and Repomix 1.18.0 were available. PostgreSQL used `/var/run/postgresql`, port `5433`, peer-authenticated user `home`. No password or provider credential was used. `FOUNT_SYSTEM_ONE_SDK_PATH` pointed to `/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`, because SDK 0.6.0 is not on Hex. Test `FOUNT_DATABASE_URL` used `postgresql://home@localhost:5433/<database>?socket_dir=/var/run/postgresql`.

Disposable databases were `fount_phase03_qc_20260928`, `fount_phase03_isolation_qc_20260928` and `fount_phase03_fresh_qc_20260928`. The first exposed an initial migration collision before repair. A fresh Core migration chain in the third database applied versions `20260924000000`, `20260924010000`, `20260924020000`, `20260927000000`, `20260928000000` and corrected Phase 03 `20260928011000`. Run integration created unique `phase02_*` and `phase03_*` schemas in the isolation database, applied Core then Run `20260928010000` and `20260928020000`, and dropped each schema. A final query found zero such schemas. The populated upgrade test first applied the verified Phase 02 Core and Run versions, inserted a screenplay/revision/head, then applied the Phase 03 Core and Run versions while retaining those rows. All three disposable databases were dropped after checks.

## Executed checks

All commands exited `0` in their final run. The common environment included `FOUNT_SYSTEM_ONE_SDK_PATH` above; PostgreSQL commands also used the test `FOUNT_DATABASE_URL` above. `mix ci` itself includes setup, format and lock checks, warnings-as-errors compile, all five unit suites, architecture, strict Credo, Dialyzer and warnings-as-errors docs.

| Command | Directory | Executed result |
| --- | --- | --- |
| `mix setup` | Fount root | PASS with local SDK path. Initial unconfigured attempt failed Hex resolution for unpublished SDK 0.6.0; configured rerun passed. |
| `mix ci` | Fount root | PASS: Core 73 (including one property), Observe 65, Intelligence 141, Workshop 80, Run 6; architecture zero violations, strict Credo zero issues, Dialyzer zero errors in all five, docs built in all five. |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` | Fount root | PASS, 148 tests. |
| `python3 scripts/final_acceptance.py` | Fount root | PASS, 16 source-only checks. The script is not runtime evidence. |
| `MIX_ENV=test mix ecto.migrate` | `packages/fount` | PASS on fresh disposable database, six Core migrations including corrected Phase 03 version. |
| `MIX_ENV=test mix test integration` | `packages/fount` | PASS, 16 integration tests. |
| `mix test`; `MIX_ENV=test mix test integration` | `packages/fount_workshop` | PASS, 80 standalone unit and 21 standalone integration tests. |
| `mix test` | `packages/fount_run` | PASS, 6 unit tests. |
| `MIX_ENV=test mix test integration/durable_execution_test.exs` | `packages/fount_run` | PASS, 12 Phase 03 integration tests. |
| `MIX_ENV=test mix test integration/storage_constraints_test.exs integration/run_foundation_test.exs integration/run_upgrade_test.exs` | `packages/fount_run` | PASS, 11 regression/upgrade tests. |
| `MIX_ENV=test mix test integration` | `packages/fount_run` | PASS, 23 total integration tests on final source. |
| `FOUNT_PACKAGE_BUILD=1 mix hex.build` in each library | Five package directories | PASS, five archives built after tests and inspected for Core/Run Phase 03 migrations; archives removed after hashing, none published. |
| `git diff --check`; docset refresh/validate/tests | Respective roots | PASS; docset commands and final publication recorded below. |

Final Hex archive SHA-256 values: Core `b36c3171bd022f821b605c69e09733b42badc30cc0f76f2db2b5b19f445e9fd2`; Observe `d7c29a06dbcc93eacd3c91cc774259fef80b3379962ef582d23393023668f088`; Intelligence `c6d16a35c59139461af1019b6378eb490ea057bfd69935ce198063921efd6ba1`; Workshop `98a2113cce485f8407a02bcda2bd63716fd18c0986353eab724ab3abb5742093`; Run `a49e07b7e93472b8e95cb92032ed6262a40ae6b11401cad9d7278b216bd1cc82`. Hex archive creation verifies package contents, not unpublished sibling installation.

## W01–W07 executed acceptance

| ID | PostgreSQL/runtime evidence | Result |
| --- | --- | --- |
| W01 | Real scripted Workshop `write` step saved one linked session, one candidate, checks, two provider requests and two settled inference usages; Workshop spent count was two and Core head stayed at the input revision. Re-entry after completion returned `:no_work`. | PASS |
| W02 | Fault injector exercised claim, session open, session link, provider intent, dispatch, post-provider/pre-response storage, response storage, candidate storage and step completion. Pre-dispatch faults resumed; saved successes reused without extra provider calls; an expired dispatched request with no saved response became unknown/partial, kept its reservation and did not replay. | PASS |
| W03 | Two single-connection Repos had different `pg_backend_pid()` values and raced for one claim; one won, one received `:busy`. Expiry/reclaim advanced the token; old heartbeat and Core session/candidate writes through the transaction guard were rejected. While a scripted provider was blocked, a distinct connection acquired `FOR UPDATE NOWAIT` on both Run and Step rows, proving provider I/O held neither row lock. | PASS |
| W04 | Independent connections raced money reservations under the Run lock: one fit, one hit the ceiling. Exact replay returned the same operation; a changed duplicate settlement conflicted. Failed dispatched calls consumed inference allowance. Separate-connection reload preserved provider, malformed and transient counters; measurement and inference limits exhausted. Workshop's cumulative spent count matched Run usage. Monetary estimates were required under a ceiling; actual overrun and unknown actual cost retained charges and paused further dispatch. | PASS |
| W05 | Persisted pause and stop requests prevented new dispatch. New plan and policy snapshots fenced old claims. Late provider responses still settled usage after stop/plan/policy invalidation. `progress/3` returned status and usage metadata without provider response bodies. | PASS |
| W06 | Operation-key replay created one session and one candidate across restarts. A stale token could not commit either Core session or candidate through the generic guard. Full standalone Workshop unit/integration suites remained green. | PASS |
| W07 | Missing intake handler, unavailable Inference service, unsupported registry override and invalid handler result returned explicit errors; the relevant steps persisted `failed`. No later-stage placeholder reported success. Scripted/local providers only. | PASS |

## Repairs and preservation

Formatter changes, two stale Core helper arities, unused variables, registry default-argument syntax and the Phase 03 Run→Workshop architecture allowance were corrected. The delivered Core operation-key migration collided with the existing Run foundation at version `20260928010000`; it was renamed byte-for-byte to `20260928011000`, and the populated Phase 02 upgrade test now proves the migration order. Claim validation now decodes `active_step_id` as a UUID and treats nullable control timestamps safely. Scripted response enums/maps are converted to JSON before persistence. Failed dispatched calls consume inference allowance, and Run can reserve/settle estimated/actual microunit cost, pause on overrun or unknown actual cost, and reject changed duplicate settlement. Fault-injection and concurrent connection tests were expanded. Docs and source contracts were updated. Core still imports no Run code; the Phase 03 stage registry still has only the real Workshop write handler.

Optional paid providers and human creative-quality studies were **NOT_RUN** and are not Phase 03 engineering gates. Phase 04 screenplay orchestration, decisions and full journeys remain unimplemented by design.

## Next handoff

The Fount repair commit was pushed to `origin/main`. Phase 03 state/traceability/decisions were updated, the complete docset refreshed, validated, committed and pushed, and five new sealed XMLs were prepared only after both committed trees were final. The external packet manifest records exact source commits and attachment byte hashes. Stop before Phase 04 implementation.
