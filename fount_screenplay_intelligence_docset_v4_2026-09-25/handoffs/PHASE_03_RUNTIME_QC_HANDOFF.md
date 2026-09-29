# Phase 03 — runtime QC and completion

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Start here

The user has already applied `fount_run_phase_03_overlay.zip` and `fount_run_phase_03_docset.zip` to the Fount and docset repositories, committed and pushed both, before handing this file to the local runtime agent. **Do not reapply either ZIP.** Read `AGENT_START_HERE.md`, `state.json`, `phases/03_DURABLE_EXECUTION.md`, `handoffs/PHASE_03_OFFLINE_HANDOFF.md`, `handoffs/PHASE_03_INPUTS.json`, `handoffs/PHASE_03_IMPLEMENTATION_MATRIX.md`, this handoff, and the copied overlay manifest. Record the actual user-applied Fount/docset commits and dirty status; preserve unrelated work.

Baseline before the overlay was Fount `228a76081871a273f49888f9530f3f805e0f4a4f` and docset `ae04a9d5dd553eca97ec52d5befa414bda251560`. Overlay archive SHA-256: `c063c0b2d66bd2466885231c26a5f14719109fc15dac3e969454ce700c14c6e6`. Copied manifest SHA-256: `f941a226b7c3b36ce667853a6d62ad7c83e85db35caf4d2e5c7e52fb64c58575`. The web result is only `OFFLINE_IMPLEMENTED`; no Phase 03 runtime acceptance ID has passed yet.

## What was implemented

Phase 03 adds a reusable one-operation Run execution engine and no Phase 04 screenplay orchestration. Public Run additions are `enqueue_step/4`, `step/4` and `progress/3`; a configurable worker calls the same single-unit engine. Claims serialize beneath the run row with PostgreSQL time and monotonic fencing. Core/Workshop persistence receives generic optional transaction-local guards plus nullable unique operation keys so a stale Run worker cannot persist session/candidate results while standalone Workshop APIs remain usable. Provider intent is persisted before dispatch; known saved success can be reused, while an expired ambiguous dispatched request becomes unknown/partial and retains its reservation rather than being blindly repeated. Distinct malformed and transient retry counters plus provider/measurement counts survive in Run storage.

The closed default stage registry contains only the Phase 03 Workshop write handler. Missing later-stage handlers/services fail explicitly. The handler opens then durably links a Workshop session before paid work, passes remaining Run decode/transport allowances, disables Workshop's inner creative repair loop for Run-managed execution, and saves candidate/check/usage identity without advancing Core canon.

## Exact expected Fount operations and hashes

Verify the installed source against this table before repairs. If formatter/user changes differ, inspect and record the discrepancy; do not overwrite blindly. There are zero deletions.

| Action | Repository-relative path | Original SHA-256 | Result SHA-256 | Mode |
| --- | --- | --- | --- | --- |
| `MODIFY` | `packages/fount/CHANGELOG.md` | `b3cb903893345a3ccfef0794c0f9c2d950fffa5eab81501608310e35bf97533b` | `cad81ca1473e45242184683067216fe0977f5cb87da88d7e9b8fdcc7ade6e70f` | `420` |
| `MODIFY` | `packages/fount/lib/fount/persistence/schema.ex` | `8e6d9324d946eb12e095206f61f4d3670139ae5d9df99e9d83db9f7b01221df7` | `afa80d8e5d471e33d82331f7e1de960bba910eb397db2ae579dd14ac4113355d` | `420` |
| `MODIFY` | `packages/fount/lib/fount/persistence.ex` | `ee57bb55b5805d12ffc2ec5e6dcb610aec8b5d0b07fa712fbe046a1a09a14fde` | `7ff5d55c6b937116b1d8b6bd93667b99a667cfae37bd54ad1c58a23666daa518` | `420` |
| `ADD` | `packages/fount/priv/repo/migrations/20260928010000_add_workshop_operation_identity.exs` | `—` | `5cbb067a5af4207674b3b7b80768c6d1414870946855598818dbbac251f7c789` | `420` |
| `MODIFY` | `packages/fount_run/CHANGELOG.md` | `2dc9b60dec9d902e029bca1dc7ea38d11b6eced443a7511f03d18e3889d93aab` | `553c7b7fe921d52af4b3759dcb220b4b342079e3fd6038490e394fd06d3d5ed0` | `420` |
| `MODIFY` | `packages/fount_run/README.md` | `4b6730e0813f96c840b9e066c76ad888f064b63ee42505975a6e9d47dde12a5d` | `42dba039c35c645ef41d77c59a5f482bd815ca9e15fdf41e6b93c968293906d1` | `420` |
| `MODIFY` | `packages/fount_run/guides/architecture.md` | `f19f913eaae9621b3594202fc22145aa6ff48bc1658634e96343abdec866ad5a` | `e857ab658707f0930831192d837cbe550f33ae98636fb27278554cac2c8b4e06` | `420` |
| `MODIFY` | `packages/fount_run/guides/storage.md` | `43522682692f61f9972a1d8fd6feda30aaaaad579a7ace47edadd11766b98072` | `08e6c66be9a748bae72b301bf26ef7f2a1a3c3e79bbfdb9f2b156d7624fb4a69` | `420` |
| `ADD` | `packages/fount_run/integration/durable_execution_test.exs` | `—` | `82164a99acef9c344c356dbd59acbfe8824cf2de5baf348619968c3e740b21cf` | `420` |
| `MODIFY` | `packages/fount_run/integration/run_foundation_test.exs` | `501a867a25dd0771281170261244290877fdf6625dd2d0f4c2522b43bdccaa25` | `0842f6ab01b66409a8c2256e0b266b9855f368abf4b5615e9ab0d9402a21329f` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/application.ex` | `28073ffc458e0af6d195fb638f9cfa5d05bbe7eebdd569c75e16d23249bc81da` | `42d9224948241862f7fcc320588dae9ee6de08bb31ce4eb1cd5e77ad78fed6b1` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/dispatch_hook.ex` | `—` | `caa62495edfb573e48b868cd2aa7f1c44c63bd5546965c8dbb0b9570bca9c10b` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/engine.ex` | `—` | `b5e085899643c98087968228990be22fda04711dd59589c00f9f8bd7bf90b183` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/execution_store.ex` | `—` | `b6398c7cce6ce40d416d0db38f06f97532196bb9ddf2e5ad91aa23016c7ce31b` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/stage_handler.ex` | `—` | `403c9bafd92597c6fca873f698d02cead7bc5e2a14210deee488eded20805738` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/stage_registry.ex` | `—` | `3924406d4487f0664909c24df1387f37f508bd1021a22430725533506d849028` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/transition.ex` | `—` | `32c85b0710386a2235968e7febead5ece06001ac847162f356d95f0a5131781c` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/worker.ex` | `—` | `1e0d71a3788fcb349b47a3e6e9f8eac2267157c88ee02061c487c1f6d861cc1d` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/workshop_handler.ex` | `—` | `94052d110cd218933c8c03937cc24436116b5a48c9ebd6dc33e2d8e00f76e39e` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run.ex` | `62f135fa64ca8977f4e885a609d56320f717aca3f00f4c6a0c660d967c096e03` | `939d6dbdfc33ac30d33504a07484a04e98f107607328caab12700e2c134f214b` | `420` |
| `MODIFY` | `packages/fount_run/mix.exs` | `d8b80c7e436854c523419a0771894cb1242d345a1f5eb9cadaa179aec9196e54` | `c1deb1eb840956864976241cadb682ab8be5c16fe1eb0bd7253993ed53710d59` | `420` |
| `MODIFY` | `packages/fount_run/mix.lock` | `c11bdcb4bcea8f6e28b25de878e08ca17852415b0f3051b2aa257bf70b431cfc` | `17ab894bf96b86e0ae4ffc345d284552f8571e037200900e8371f0b9d11b68e8` | `420` |
| `ADD` | `packages/fount_run/priv/repo/migrations/20260928020000_durable_execution.exs` | `—` | `8ca243645b434e4564d74bc382a2e7a77fb5d2e556c861d9b03012ed9eb2575a` | `420` |
| `ADD` | `packages/fount_run/test/durable_execution_test.exs` | `—` | `f190a02a76bfc1621a8f1adbc7adc6f9e65dfb9cd446722b776aefe0028e09cc` | `420` |
| `MODIFY` | `packages/fount_run/test/storage_contract_test.exs` | `169e2a30c5a855e833db1fdd93b6e6e909513e7d46589d51f4760b5d70ac3a4d` | `e17e5c214785a748f5adb98172b235a61c43559c8f28c35a114591efb4ba5b53` | `420` |
| `MODIFY` | `packages/fount_workshop/CHANGELOG.md` | `e2cc0a3084b0a54a4d9b058b94080fe635175546466c25f3c237f4332381511f` | `43322c3166aee8829ccbbe206664f34f25ca70469cac6f2ef281c0d7a52e78c8` | `420` |
| `MODIFY` | `packages/fount_workshop/lib/fount_workshop/session.ex` | `4226e1310c848610c70366c5355e95b66769abe1557f7456ea383cd6aca36619` | `a82b9a8731302227c432e12355ed9c4fe5a3fd67a3d186942299bb8885593ec9` | `420` |
| `MODIFY` | `packages/fount_workshop/lib/fount_workshop/store.ex` | `983a89cfb74e4b26d1847e3246124c2f3cfdc2527a6dd003baf1e262734bdf2d` | `34f0d7f714a47686bd497bbec717860b792046508f25f87b27dac4cf73265a15` | `420` |
| `MODIFY` | `packages/fount_workshop/lib/fount_workshop/writing/budget.ex` | `5115f460faf097f6e91814eb853723331ebe476f7b18de017145104604440367` | `ca5d44aa9f4d3faf543b8ef210a94da32ca89b44875bf588257c49e55c9142ae` | `420` |
| `MODIFY` | `packages/fount_workshop/lib/fount_workshop/writing/completion.ex` | `df4aafa9f12d23e45fe8f845b910280aea4427e2b0094a0c3da19822b1c13a3e` | `eefa64bc60c276f1dc41c431ac9fee0680af0378cbf308de129bbcfd5b7c669e` | `420` |
| `MODIFY` | `scripts/final_acceptance.py` | `29b76eed0d9f6b3cbe0bacc952d534b7707850d6e4872f5aa7fdcd530b339f29` | `2eea0e3202546a426f8708f9bac3ebb420dbee711a1527d09aa3766a10d7dc9f` | `420` |
| `ADD` | `scripts/tests/test_durable_execution_source.py` | `—` | `6734a579ff007904bc2c86a1f6422699a0cf4e3bb3564a4b9800c2963ceb9895` | `420` |
| `MODIFY` | `scripts/tests/test_run_foundation_source.py` | `5ccb189e8157c7c2bcf293b12d1f9315668d9cb0b347b4722058f040a81e02cf` | `f88327732ddff74a15a42905eae394487d3b862a3648500a8a630ed98426b011` | `420` |

## Validation already performed by the web agent

| Check | Result |
| --- | --- |
| `python3 -m unittest scripts.tests.test_run_foundation_source scripts.tests.test_durable_execution_source` | PASS — 18 source-contract tests |
| `python3 scripts/final_acceptance.py` | PASS — 16 source-only repository boundary/inventory checks; script itself states no BEAM/PostgreSQL assurance |
| `python3 handoff/apply_overlay.py --root /mnt/data/phase03_work/fount_baseline --archive /mnt/data/fount_run_phase_03_overlay.zip --dry-run` | PASS — 33 declared writes, no deletions, against exact extracted Phase 02 Fount baseline |
| apply-overlay test copy plus payload hash verification | PASS — 33 writes applied to a disposable exact baseline and all resulting payload hashes matched the manifest |
| Elixir/Mix compilation, formatter, ExUnit/Ecto, PostgreSQL migrations/concurrency/recovery, Credo, Dialyzer, ExDoc and Hex builds | **NOT_RUN** — `elixir`, `mix` and `psql` are unavailable in the web environment |
| `python3 scripts/docset.py refresh` | PASS — regenerated state views/integrity inventory for 59 docset files |
| `python3 scripts/docset.py validate` | PASS — 59-file state, links, handoff paths and integrity validated |
| nine `scripts/test_docset.py` test methods run individually | PASS — all nine behavior/transport tests passed |
| one-shot `python3 scripts/test_docset.py` | INCOMPLETE — sandbox command timed out after eight progress dots; every test method was then executed individually and passed |

The three runtime executables checked in the sandbox (`elixir`, `mix`, `psql`) were unavailable. Therefore compilation, ExUnit/Ecto, migrations, PostgreSQL crash/concurrency proof, package builds and application behavior are **NOT_RUN**, not inferred from source checks.

## Requirement-to-source/test mapping

Use [PHASE_03_IMPLEMENTATION_MATRIX.md](PHASE_03_IMPLEMENTATION_MATRIX.md). Required executed acceptance IDs are W01–W07; each must map to final runtime evidence in `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`. The authored integration entry point is `packages/fount_run/integration/durable_execution_test.exs`; unit coverage is `packages/fount_run/test/durable_execution_test.exs`. Existing Phase 02 Run integration and existing Workshop tests are regression gates, not substitutes for W01–W07.

## Execute and repair

From `/home/home/p/g/n/fount`, record `git status --short`, `git rev-parse HEAD`, branch/upstream and actual Elixir/Erlang/Mix/PostgreSQL versions first. Confirm all manifest result hashes (or reviewed intentional deviations) and zero deletions. Then execute the repository common gates, including at minimum:

```sh
mix setup
mix ci
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
python3 scripts/final_acceptance.py
```

Run Core migrations/integration and Workshop regression suites using isolated test PostgreSQL as specified by `RUNTIME_QC.md`. Run Phase 03 Run checks explicitly:

```sh
cd /home/home/p/g/n/fount/packages/fount_run
mix test
MIX_ENV=test mix test integration/durable_execution_test.exs
MIX_ENV=test mix test integration/storage_constraints_test.exs integration/run_foundation_test.exs integration/run_upgrade_test.exs
MIX_ENV=test mix test integration
```

For database proof, test both a fresh Core→Run migration chain and an upgrade from the populated verified Phase 02 schema through Core `20260928010000_add_workshop_operation_identity.exs` and Run `20260928020000_durable_execution.exs`. Use distinct PostgreSQL connections for claim/reclaim and reservation races. Inspect `pg_stat_activity`/test instrumentation as appropriate to prove scripted provider I/O is outside row-lock transactions. Fault-inject W02 boundaries at claim, session open/link, provider intent, post-dispatch/pre-response persistence, response persistence, candidate persistence and step completion. Confirm known success reuses durable results, while ambiguous paid work is unknown/partial with reservation retained and no blind replay.

Exercise W04 beyond the authored source cases: concurrent reservation/duplicate settlement, cumulative subordinate Workshop usage, reload-surviving malformed/transient limits, money ceiling/overrun, unknown-cost fail-closed behavior and resource exhaustion. Exercise W05 stop plus new plan/policy fencing and late usage reconciliation. For W06 run the full existing standalone Workshop unit/integration suites in addition to the Run smoke. For W07 use scripted/local providers only; no paid live provider is required.

Build all five library packages with `FOUNT_PACKAGE_BUILD=1 mix hex.build` after tests. Run formatter, strict Credo, Dialyzer and docs through the normal repository quality gates. Record exact commands, tool versions, exit codes/counts, temporary database/schema names and cleanup.

## Phase boundary and completion rule

Repair compile/API/database/test defects that belong to Phase 03, but do not add Phase 04 intake/investigate/plan/write/check orchestration or strategy decisions. Mark Phase 03 `COMPLETE` only if all common engineering gates and W01–W07 execute successfully. If a required gate remains unavailable or fails, set `QC_FAILED` with actionable evidence instead of advancing.

After successful QC, write `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`, record the verified final Fount commit/tree, update traceability/decisions/state, refresh and validate the complete docset, commit and push code/docset changes, then prepare five fresh sealed XMLs for Phase 04. Stop after preparing that handoff; do not implement Phase 04 in the same cycle.
