# Phase 04 offline implementation handoff

Status: **OFFLINE_IMPLEMENTED**. Runtime acceptance P01–P07 is **NOT_RUN** in the web environment.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Baselines and packet

- Fount baseline: `a3b9d8fe5d009dad15b6d3d354cc470560ec1c0b` (verified Phase 03 COMPLETE)
- Docset baseline: `61f0137533cc1c8824c3edffc16a9200dbbf9409`
- System One SDK: `e757598a89e549274b979f0e77c6a4b2b6667752`
- Inference: `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`
- Agent Session Manager: `dc28a00e5ff6ad6932411334241ec8d9efda8857`
- Packet manifest SHA-256: `e0e5d1a7f7b9732c476ecb4e71e9a5ff2e19ba32d7ebf35099f371f9a073793a`; all input hashes matched.
- Overlay SHA-256: `48316fd07c0c496038addf6ff0f116f03d837a9c74c534c0aade5999943b2401`
- Overlay manifest SHA-256: `2d9eab9764a60fb6ed02b09deefd62dd76dde9c97a23d9fa9c89c662a9c23f55`

## Implemented Phase 04 only

The Phase 03 fenced one-step engine now drives a closed headless screenplay journey through intake/preflight, investigation, page-free route planning, an exact strategy decision checkpoint, selected-route materialization, required checks and limited durable iteration. Investigation reports/evidence/uncertainty seed planning instead of being discarded. `FountRun.submit_decision/4` is the production strategy transition: actor, context fingerprint, plan/policy versions, canonical base and closed saved choice must all match; resolution and write-step creation share one transaction; identical response replay is idempotent while competing/stale responses conflict.

Workshop gained preparation-only and plan-only seams. Planning proves no candidates exist before route selection. Writing uses `Strategy.materialize/4`; repairs use separate durable `iterate` steps with the inner Session repair loop disabled. Successive candidates remain rooted in the canonical base and preserve parent/report lineage. Scope and protected material are required checks. Candidate-review or unresolved-iteration decisions are persisted, but Phase 04 intentionally does not accept canon, resolve later decision kinds, deliver artifacts or add web UI.

See [PHASE_04_IMPLEMENTATION_MATRIX.md](PHASE_04_IMPLEMENTATION_MATRIX.md) for P01–P07 mapping.

## Changed-file inventory

| Action | Path | Original SHA-256 | Result SHA-256 | Mode |
| --- | --- | --- | --- | --- |
| `MODIFY` | `packages/fount_run/CHANGELOG.md` | `03b7b23611036156ea1d9a6dc6d48c5b740749b3c2e7c8c7c1482f205a9a68e8` | `28a9c80766cbef05a6203331087c42bcc1eb332e1e747784f10de811d85bbf75` | `420` |
| `MODIFY` | `packages/fount_run/README.md` | `bce63e334ff426c0f30366779ba89cfd7acb0d06b3b478e2319cdbb99559c91b` | `733302464726fc8bd280be32db865f659b34d50b6782e1f56005b9e11754b6ef` | `420` |
| `MODIFY` | `packages/fount_run/guides/architecture.md` | `e857ab658707f0930831192d837cbe550f33ae98636fb27278554cac2c8b4e06` | `a4aa09fdee1b5f28d771701f36d9548e0d1155826e32b04cd5b24a157f6490a9` | `420` |
| `MODIFY` | `packages/fount_run/integration/durable_execution_test.exs` | `ad73985c0e3ba30702f85e3edcdc859b2ec736c8edbf9107b11b4e2b4790b968` | `d1058f944b660488c4bd26f0d119665319f6467b31a47f759ab02c3f483c16c0` | `420` |
| `ADD` | `packages/fount_run/integration/screenplay_pipeline_test.exs` | `—` | `dd31d9bc5a20ea35aae5126ed1b085cd7c8666e6426667f7914cd40d1c4dbae0` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run.ex` | `939d6dbdfc33ac30d33504a07484a04e98f107607328caab12700e2c134f214b` | `e02dcb5888c8cb1a42abee4d8cb49075f2b1c65345fae42411cf943af5c6bafd` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/engine.ex` | `446aace83e439cddda68f0dfdac8fe98cdba9e4da30739372bebcc4a5e20a412` | `ba4cb87aa168ac36ce037806b6aa38787934e14c4e8c3e6b84c1b7a21fe4b823` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/execution_store.ex` | `69a642a0921f21b1b98270477261d69d797b1e0e87354a7776a815f2d0e3d9b5` | `bf41c38557df8c3d8413c555dcd2c6412ff63b70fe2d115e4af8fb68861985a6` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/persistence.ex` | `08678dfae782755336c4f1927e57e5905655c08466eaeaee120baba039e4d28d` | `5d3d0a9b779ed2ed6c3493628f66306ffc8b09155e65b92fae08f6a7b47ac7a6` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/pipeline_handler.ex` | `—` | `bb18231af75ef5d21c3506d4bf624705c843ee1c0537e5602cbb402590555354` | `420` |
| `ADD` | `packages/fount_run/lib/fount_run/pipeline_request.ex` | `—` | `a29fc56dc0185e682b085918f5769662169390c8e96e48ddcf9029fdcfafb4a9` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/stage_registry.ex` | `08933318cf6ad605daafa6ef0d586ef2a92fd358a7a524a49fffc8764fa74ff6` | `cba66c67aef6452494ff57bf60a7f371b8b0e0d3a549793823f4d3a9047be7f9` | `420` |
| `MODIFY` | `packages/fount_run/lib/fount_run/workshop_handler.ex` | `1137d7307c21978c861e71134cce996799497362d93a060d397ebc932fa2c94b` | `281551a0ab9f44f885180c09a71e2ef4e371d01bd3bd3b426963826c39009cb7` | `420` |
| `MODIFY` | `packages/fount_run/test/durable_execution_test.exs` | `b6a25d4493468a80a11e22e4eac0cebd45b39f47ae93a65c3cace48a47ed43f2` | `4fe33a55bbd6f8bb181f0292e2e881ee35bda6021582ac0abd89537d9e7b311a` | `420` |
| `ADD` | `packages/fount_run/test/screenplay_pipeline_test.exs` | `—` | `82baab05cbd26e9ed73108b2b2a2c20607383b8538e446f0b4ed074480fcb10f` | `420` |
| `MODIFY` | `packages/fount_workshop/lib/fount_workshop/session.ex` | `b77bea10ff5d971602330ec0c2573b354ed53d6dc96dd79929730c8fc91363b2` | `9ee19cce41d6d97462a49436f777b14432c16362c624aa625e10115f15a9b9ce` | `420` |
| `ADD` | `scripts/tests/test_screenplay_pipeline_source.py` | `—` | `1c780e80dd5cefc082591badb3268ac053ed1f8b3fbd24d9aaa35a2ba69c45bc` | `420` |

## Validation executed here

- `python3 -m unittest discover -s scripts/tests -p 'test_*source.py'` — **PASS**, 143 source-contract tests.
- `python3 scripts/final_acceptance.py` — **PASS**, 16 source-only repository boundary/inventory checks. The script explicitly provides no BEAM/PostgreSQL assurance.
- Packet SHA-256 verification against `PACKET_MANIFEST(1).json` — **PASS** for Fount, docset, SDK, Inference and ASM snapshots.
- Overlay diff/package inspection — **PASS**: 17 writes (5 adds, 12 modifies), zero deletions.
- `elixir`, `mix`, `psql` availability — **NOT_RUN runtime** because all three executables are unavailable in this environment.
- Therefore compilation, formatter, ExUnit/Ecto, PostgreSQL migrations/races/recovery, Credo, Dialyzer, ExDoc and Hex builds are **NOT_RUN**, not inferred from static checks.

## Known gaps requiring local QC

The new ExUnit/PostgreSQL P01–P07 suites are authored but unexecuted. Local QC must catch syntax/format/warnings-as-errors issues, confirm the scripted Inference response schemas and SQL assertions against real runtime values, run fresh/upgrade migrations, and re-run all Phase 03/Core/Workshop regressions. Paid/live providers and human creative-quality studies are optional and were not run.

Stop here for local runtime QC; do not begin Phase 05.
