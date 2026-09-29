# Phase 03 offline implementation handoff — Durable execution

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Delivery identity and scope

Phase 03 is delivered as **OFFLINE_IMPLEMENTED**, not runtime-certified. Inputs were the five sealed snapshots recorded in [PHASE_03_INPUTS.json](PHASE_03_INPUTS.json). The verified Fount baseline is `228a76081871a273f49888f9530f3f805e0f4a4f` and verified docset baseline is `ae04a9d5dd553eca97ec52d5befa414bda251560`. The packet manifest SHA-256 is `f13ceab36cec0cfd1273909a7e24528c946449c0e67acbef320118095021d40f` and every attached sealed-input hash matched it before editing.

The Fount overlay is `fount_run_phase_03_overlay.zip`, SHA-256 `c063c0b2d66bd2466885231c26a5f14719109fc15dac3e969454ce700c14c6e6`, 76918 bytes. Its copied manifest [PHASE_03_OVERLAY_MANIFEST.json](PHASE_03_OVERLAY_MANIFEST.json) has SHA-256 `f941a226b7c3b36ce667853a6d62ad7c83e85db35caf4d2e5c7e52fb64c58575`, 33 file operations (20 modify, 13 add) and zero deletions.

This phase implements one-operation durable execution only: pure transition evaluation, public `step`, optional poll workers, run-row claim/reclaim with PostgreSQL-time leases and monotonic fencing, guarded heartbeat/domain persistence, Workshop operation identities and open/link recovery, durable provider intent/result reconciliation, Run-level reservations/counters, persisted control fences, safe progress inspection and a closed stage registry with only the Phase 03 Workshop write handler. Core remains independent of Run. Run now depends on Workshop because Phase 03 is the first phase that orchestrates a real Workshop operation; Run still has no direct System One SDK, Inference or ASM dependency.

No Phase 04 screenplay pipeline, strategy-decision command, intake/investigate/plan/write/check scheduler or multi-stage screenplay journey was implemented.

## Requirement mapping

See [PHASE_03_IMPLEMENTATION_MATRIX.md](PHASE_03_IMPLEMENTATION_MATRIX.md). W01–W07 have concrete source and authored test locations; all runtime evidence is `NOT_RUN` pending local QC.

## Exact Fount overlay operations and hashes

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

`deletions` is exactly `[]`. The manifest is the machine-readable authority for these operations.

## Checks actually run

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

Source inspection and Python source-contract checks are not runtime evidence. In particular, no claim is made that the added Elixir compiles or that database/recovery behavior passes until local QC executes it.

## Runtime risks to verify

The local agent must expect ordinary compile/format/API repairs if BEAM checks reveal them. Exercise both migrations on fresh and populated Core→Run schemas; verify independent PostgreSQL connections for claim/reclaim races; verify no lock spans scripted external calls; validate hard money ceilings including unknown-cost fail-closed behavior; exercise late/partial provider reconciliation; and rerun existing Workshop standalone tests to prove the new optional operation/guard seams preserve old callers.

## Next action

The user applies and commits both delivered ZIPs before giving [PHASE_03_RUNTIME_QC_HANDOFF.md](PHASE_03_RUNTIME_QC_HANDOFF.md) to the local agent. Runtime QC must start from that installed state and **must not reapply the overlay**. Repair/certify only Phase 03, map W01–W07 to actual executed evidence, update the docset and commits, then prepare Phase 04 sealed inputs. Do not implement Phase 04 in the QC cycle.
