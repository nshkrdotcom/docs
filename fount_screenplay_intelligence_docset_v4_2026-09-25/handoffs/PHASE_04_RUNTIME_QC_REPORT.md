# Phase 04 runtime QC report — Screenplay pipeline

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Identity and outcome

Phase 04 is **COMPLETE** after executed local QC. P01–P07 each passed. Phase 05 remains `NOT_STARTED`; acceptance, delivery and the web app were not implemented here.

- Verified Phase 03 Fount baseline: `a3b9d8fe5d009dad15b6d3d354cc470560ec1c0b`; Phase 04 docset source baseline: `61f0137533cc1c8824c3edffc16a9200dbbf9409`.
- User-applied commits at QC entry: Fount `2586e5eae3baf8817c6c6efafd78ec6189d81a32`; docset `74c2225af44e1d7d898064731b9f08469b218b41`. Both were clean `main` branches tracking `origin/main`. Neither ZIP was reapplied.
- Supplied overlay archive SHA-256: `48316fd07c0c496038addf6ff0f116f03d837a9c74c534c0aade5999943b2401`. Copied manifest SHA-256: `2d9eab9764a60fb6ed02b09deefd62dd76dde9c97a23d9fa9c89c662a9c23f55`. All 17 installed result hashes matched the manifest before repairs; it declared zero deletions. The installed Git diff from the Phase 03 baseline contained the 17 payload paths and the copied manifest, with no unrelated overwrite or deletion. Subsequent differences are the reviewed QC repairs below.
- Input packet manifest SHA-256: `e0e5d1a7f7b9732c476ecb4e71e9a5ff2e19ba32d7ebf35099f371f9a073793a`.
- Final verified Fount repair commit: `c3af2d662198aaf15dd8e754f2d25c109c2707c1`; tree `7236d35c2cf352b556e8b15ae876060c84fd39b5`. `git diff --check` passed, the Fount worktree was clean, and normal `origin/main` push succeeded (`2586e5e..c3af2d6`). The containing docset commit supplies this report's docset identity.

## Toolchain and isolated database

Erlang/OTP 29, Elixir/Mix 1.20.3, PostgreSQL client/server 18.6, Node.js 24.19.0, npm 11.17.0, `pdfinfo` 26.01.0 and Repomix 1.18.0 were available. `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` supplied the local unpublished SDK. The disposable test database was `fount_phase04_qc_20260928`, reached as `postgresql://home@localhost:5433/fount_phase04_qc_20260928?socket_dir=/var/run/postgresql`; no provider credential or production connection was used.

The explicit named schemas `phase04_qc_fresh_20260929` and `phase04_qc_upgrade_20260929` each applied Core versions `20260924000000`, `20260924010000`, `20260924020000`, `20260927000000`, `20260928000000`, `20260928011000`, followed by Run versions `20260928010000`, `20260928020000`. Reapplying current Run migrations returned `[]`. No migration file changed from the verified Phase 03 Fount baseline. The populated `run_upgrade_test.exs` independently verified the Phase 02→Phase 03 upgrade path, and the final Phase 04 integration suites created fresh isolated `phase04_<UUID>` schemas and dropped them. Distinct PostgreSQL connections were used by the inherited competing-claim, budget and recovery tests; the Phase 04 restart tests stopped and restarted their Repo on the same schema. `MIX_ENV=test mix ecto.migrate` in `packages/fount_run` exited zero but warned that no Ecto Repo is configured for that application; the named-schema migration script and integration setup are the executed Run migration evidence.

## Executed checks

All final commands below exited `0` with the SDK and database environment above. Final logs are under `/tmp/fount_phase04_qc_logs/final2_*.log`; they are local execution logs, not sealed packet inputs.

| Commands and directory | Executed result |
| --- | --- |
| Fount root: `mix setup`; `mix format --check-formatted`; `mix deps.unlock --check-unused`; `mix blitz.workspace format --check-formatted`; `mix blitz.workspace lock_check`; `mix blitz.workspace compile`; `mix fount.architecture` | PASS. |
| Fount root: `mix test`; `mix blitz.workspace credo --strict`; `mix blitz.workspace dialyzer`; `mix blitz.workspace docs`; `mix ci` | PASS. Each root test and CI run covered Core 73 (one property), Observe 65, Intelligence 141, Workshop 80 and Run 13. Strict Credo found no issues; Dialyzer found zero errors in all five libraries. |
| Fount root: `python3 -m unittest discover -s scripts/tests -p 'test_*.py'`; `python3 scripts/final_acceptance.py` | PASS, 155 Python tests and 16 source acceptance checks. The latter is source-only and is not treated as runtime evidence. |
| `packages/fount_run`: `MIX_ENV=test mix ecto.migrate`; `mix test`; `MIX_ENV=test mix test integration/screenplay_pipeline_test.exs`; `MIX_ENV=test mix test integration/durable_execution_test.exs`; `MIX_ENV=test mix test integration/storage_constraints_test.exs integration/run_foundation_test.exs integration/run_upgrade_test.exs`; `MIX_ENV=test mix test integration` | PASS. Counts 13, 6, 12, 11 and 29 respectively. The migrate command's no-configured-Repo warning is explained above. |
| `packages/fount`: `MIX_ENV=test mix ecto.migrate`; `mix test`; `MIX_ENV=test mix test integration` | PASS. Core migration command exited zero; 73 unit/property and 16 integration tests passed. |
| `packages/fount_workshop`: `mix test`; `MIX_ENV=test mix test integration` | PASS, 80 unit and 21 integration tests. |
| Each of `packages/fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`, `fount_run`: `FOUNT_PACKAGE_BUILD=1 mix hex.build` after tests | PASS, five archives built and hashed, then generated archives removed. |
| `MIX_ENV=test mix run /tmp/fount_phase04_named_migrations.exs` in `packages/fount_run`; `git diff --check` | PASS. Both named fresh/upgrade schemas had all eight migration versions; rerun was empty. |

Hex archive SHA-256 values: Core `5d2ea25df1c481dfcc722355d53963d07dc2f31da3dc158864b6264a064eaad3`; Observe `d7c29a06dbcc93eacd3c91cc774259fef80b3379962ef582d23393023668f088`; Intelligence `c6d16a35c59139461af1019b6378eb490ea057bfd69935ce198063921efd6ba1`; Workshop `726787d6aab313cdbad937e6f1aa5f582b7ca4b416eef68df16f17de1273b8e5`; Run `7cb78ba8e97246a15068d7c89c59ef37de186d5ce4e0f8e3a2516e467b41b11e`. Building archives does not certify published dependency installation.

## P01–P07 executed acceptance

| ID | PostgreSQL and deterministic runtime evidence | Result |
| --- | --- | --- |
| P01 | `screenplay_pipeline_test.exs` ran brief→opening and selected-scene dialogue journeys through intake, investigation, page-free strategy gate, write and check. Both saved changed page text, candidate/base IDs, reports/checks and a pending review; Core canonical head remained at the initial revision. | PASS |
| P02 | Reveal/train fixture saved exactly three distinct routes before any candidate rows, retained the stated antagonist-motive uncertainty in the strategy step, and recorded the protected-material failure. One targeted repair preserved the train action and added the evidence-cabinet consequence; the first failed check scheduled repair and did not accept an intermediate candidate. | PASS |
| P03 | Public `FountRun.submit_decision/4` covered success, identical replay, competing response, wrong actor, stale context, stale plan and stale policy. SQL confirmed one resolved decision row and one idempotent write step; replay returned the same successor. | PASS |
| P04 | The first failed check scheduled one separate durable `iterate` step, with three provider dispatches and zero malformed/transport retries on that step. Another fixture exhausted `max_iterations: 1`, stopped after one iterate and retained a pending `iteration` decision. Provider requests grew cumulatively from 2 at the strategy gate to 3 after the first write/check and 6 after iteration; Workshop options under Run set `max_repair_rounds: 0`. Phase 03 budget/retry tests remained green. | PASS |
| P05 | SQL found zero accepted writing candidates. The repaired candidate's parent was the failed candidate, both candidates bound to the original Core base revision, and the final check retained lineage, report IDs and passing checks. Full `Screenplay.diff` showed the protected train action changed only in the rejected first candidate and the final candidate added a scene/elements; canon did not move. | PASS |
| P06 | Repo stop/restart at strategy and check checkpoints preserved the pending route decision and reused saved provider requests and successor work. Identical submission replay reused the write step. The unchanged Phase 03 durable execution suite passed 12/12, including known-success reuse and ambiguous paid-outcome recovery with distinct connections. | PASS |
| P07 | All nine Workshop request contracts validated in the Phase 04 integration test; standalone Workshop 80-unit/21-integration suites and Core 73-unit/16-integration approval-safety surfaces passed. The registry returned `stage_handler_unavailable` for both `decide` and `deliver`; demonstrated runs ended at saved `candidate_review` or unresolved `iteration`, with no final acceptance or delivery. | PASS |

## Repairs and preservation

The applied source required formatting and had an undefined iteration `envelope`, an invalid Workshop guard, a miswrapped request fixture and mismatched scripted repair/provider expectations. The strategy submission initially read a stale plan-step request rather than reconstructing its persisted successful session/result bindings; this was fixed within the same SQL transaction. Core candidate row decoding now converts `parent_candidate_id` to a UUID. Investigation uncertainty now includes the Workshop `uncertainties` field and survives the saved route gate. A pre-existing Workshop test cleanup race was corrected after an intermittent teardown failure. Focused journey assertions were strengthened for decision row/write-step uniqueness, uncertainty, page-free routing, complete candidate diff, cumulative provider usage and restart reuse. The full gate ladder above was rerun after the final fixes. No Core canonical acceptance bypass or later-stage success handler was introduced.

Optional live paid providers and human screenplay-quality assessment were **NOT_RUN**; they are not Phase 04 engineering gates. The deterministic fixtures establish state transitions and constraints, not creative quality. Phase 05 control/completion and Phase 06 browser/PDF journeys remain future work.

## Next handoff

The Fount repair commit was pushed to `origin/main`. Phase 04 state, traceability, decisions and implementation matrix were updated after runtime evidence. The docset refresh/validation, docset push and five fresh sealed Phase 05 XMLs are recorded by the final containing docset commit and the external packet manifest, which holds exact source commits and attachment hashes. Stop before Phase 05 implementation.
