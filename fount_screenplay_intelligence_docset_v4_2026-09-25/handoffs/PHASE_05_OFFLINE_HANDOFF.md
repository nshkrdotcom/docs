# Phase 05 offline implementation handoff

Status: **OFFLINE_IMPLEMENTED**. Runtime acceptance C01–C07 is **NOT_RUN**. This handoff records source-only implementation from the sealed Phase 04 baseline and deliberately does not certify Phase 05.

## Runtime destinations

- Fount repository: `/home/home/p/g/n/fount`
- Operational docset: `/home/home/jb/docs/20260928/fount`
- Canonical docset: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- Docset Git root: `/home/home/p/g/n/brainstorms`
- System One SDK: `/home/home/p/g/n/system_one_sdk`
- Inference: `/home/home/p/g/n/inference`
- Agent Session Manager: `/home/home/p/g/n/agent_session_manager`

## Verified source packet

- Fount baseline: `c3af2d662198aaf15dd8e754f2d25c109c2707c1`.
- Docset baseline: `e3369f4bba8e977d83d5091126c9261488893a98`.
- System One SDK: `e757598a89e549274b979f0e77c6a4b2b6667752`.
- Inference: `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`.
- Agent Session Manager: `dc28a00e5ff6ad6932411334241ec8d9efda8857`.
- Packet manifest SHA-256: `77a51ef4f078b01758b692488e2347bc900016be8eff8069f96ace87896602de`.
- Input XML hashes and byte counts are preserved in [PHASE_05_INPUTS.json](PHASE_05_INPUTS.json).

## Implemented Phase 05 slice

- Extended the Phase 04 canonical decision command through final approval/rejection, replacement, iteration continuation and explicit rebase decisions. `approve_run/4` is only an exact typed-decision wrapper; it does not create a second approval state machine.
- Added idempotent plan/policy steering, linked successors where the base/scope or terminal lineage requires one, and pause/resume/stop behavior that fences invalid work while preserving prior artifacts and inherited resource commitments.
- Integrated the existing Workshop review and three-way rebase APIs. Replacement/rebase produces fresh candidates and requires fresh same-run check bindings; reviewed candidates are never invisibly edited.
- Connected durable approval attempts to trusted principals, callback intent, safe callback evidence, immutable received review, stable approval payload identity, fallback/reconciliation and the typed Core acceptance API. Terminal/fenced attempts cannot be resurrected by a late callback.
- Completed decide/deliver stages and candidate/accepted delivery bundles: Fountain, FDX, review JSON/Markdown, source/structural diff, resources/checks, provenance, selected PDF and existing table-read JSON/HTML where configured. Delivery rows hold checksums and retry individual failed/missing formats. Run terminal completion follows successful delivery rather than Core acceptance alone.
- Added the public Run command surface plus `FountRun.CLI` / `mix fount.run` paths for start/show/step/decisions/decide/plan/pause/resume/stop/policy/approve/export. Trusted Repo/principal/service/module configuration is host configuration, never accepted from untrusted JSON.
- Preserved Phase 04/Core/Workshop workflows and made no Phase 06 web/Phoenix change.

## Overlay artifact and file operations

- Overlay archive SHA-256: `81a620d81d1e99b5812aaff9f8076e991aeb07715b926979f09a6fc891e8f75e`.
- Copied overlay manifest SHA-256: `cc2c8339e7d9750514676f5d352106639b5ac36a625f6338cc5731e11334ed35`.
- Manifest operations: 31 writes (`18` modify, `13` add), `0` deletions.
- Manifest location in the overlay ZIP: `handoff/fount-overlay.manifest.json`.

| Action | Repository path | Baseline SHA-256 | Result SHA-256 | Mode |
| --- | --- | --- | --- | ---: |
| `modify` | `packages/fount_run/CHANGELOG.md` | `28a9c80766cbef05a6203331087c42bcc1eb332e1e747784f10de811d85bbf75` | `354dfd195beee7d003dbb70a995f1a2ec2d62d95ced0858ac1f987aad66fb94b` | `420` |
| `modify` | `packages/fount_run/README.md` | `733302464726fc8bd280be32db865f659b34d50b6782e1f56005b9e11754b6ef` | `61805be4057984dcfc9fd5ed61dcd61f45d1b1f323d8cc7f9984255226eb5dc1` | `420` |
| `modify` | `packages/fount_run/guides/architecture.md` | `a4aa09fdee1b5f28d771701f36d9548e0d1155826e32b04cd5b24a157f6490a9` | `e1439bc76f4776ce216425f5e378e19c1c9fca20468dd1170503a82ac4d2e5c8` | `420` |
| `add` | `packages/fount_run/guides/control-and-delivery.md` | `-` | `e3f48711681bc96ba7a1676c556012da42590ae60624243df0f5cc179b9c431d` | `420` |
| `modify` | `packages/fount_run/guides/storage.md` | `a5ce71eece2b39423676912c89d9a8581cc652e4be68fb450e6fc920f079369f` | `e3d8dc586dd849940d1b496747a3ed580dd24da3670687162d94924cc3b4495f` | `420` |
| `add` | `packages/fount_run/integration/control_completion_test.exs` | `-` | `257f0f7049ea5bf3fbdadceda0f1b1fcc4b30a26523f1194503931986d18813b` | `420` |
| `modify` | `packages/fount_run/integration/screenplay_pipeline_test.exs` | `30f4e63e5624338d8dc7eeb95090f6e03ca0574528f2cc612e7cecff52bd65ab` | `734190be55538f1405bb781d8e97d4d2e63aa36c6cdfa3b44c9c76f1d93c9513` | `420` |
| `modify` | `packages/fount_run/lib/fount_run.ex` | `e02dcb5888c8cb1a42abee4d8cb49075f2b1c65345fae42411cf943af5c6bafd` | `68725de0889d79bc1af2ac52546c127d0dd7e7a0acd7aa12f0aacba0417cb1d5` | `420` |
| `modify` | `packages/fount_run/lib/fount_run/approval_attempt.ex` | `c4fcef1dc669377afbc9c8dbc735667f0466ed9ebfb1e3a602bea38f7d15d3c3` | `2f7045898b7fc942a2dd744d5cab374f972cf1cd18b795bd93d5ff18e4b03cd8` | `420` |
| `add` | `packages/fount_run/lib/fount_run/approval_bridge.ex` | `-` | `94c6dea51a32baf65bfa1ac90a880f4b4d240751947b56ad34853c5e68a4598f` | `420` |
| `add` | `packages/fount_run/lib/fount_run/cli.ex` | `-` | `b2de04158e2abb141866b091808274bca3451bdde34fc55b542e295025fb3819` | `420` |
| `add` | `packages/fount_run/lib/fount_run/completion_handler.ex` | `-` | `8c68dbd32a74a7d09f09defd2827eea5dd0a3d4c04c8f7635a8fe4fa093dce86` | `420` |
| `add` | `packages/fount_run/lib/fount_run/control.ex` | `-` | `fa7a6457d4080ce521fcf76f933dcd4db4c90319d7d9713d7039d39f052bce90` | `420` |
| `add` | `packages/fount_run/lib/fount_run/decision_command.ex` | `-` | `313857ad6464f69641c7841b4507a013845904c66333b7fe62bf0eea8fb1a0a5` | `420` |
| `add` | `packages/fount_run/lib/fount_run/delivery_bundle.ex` | `-` | `9d2a6dd88624f794308f7fe10177c99ef7f4839ef6ef62f114a20b93c555d477` | `420` |
| `add` | `packages/fount_run/lib/fount_run/delivery_handler.ex` | `-` | `6ad3d29696816b8787871c0048b3f45cd925e3cab5a38f0ec6ee3d3515ba3172` | `420` |
| `modify` | `packages/fount_run/lib/fount_run/execution_store.ex` | `bf41c38557df8c3d8413c555dcd2c6412ff63b70fe2d115e4af8fb68861985a6` | `e958c2b4c6811bc98ff25e1f4dbcb79650a5f860ef7a98375abc0c4b909b8915` | `420` |
| `modify` | `packages/fount_run/lib/fount_run/persistence.ex` | `e1e5c4dda1dda689367a8dcc5c3f477ce32d4c1fa1b06e07e1bbe3cf2d9f20a8` | `48c885a6a15036a045372d43b9e537e31b86758790b0126ec5b17d27279cdd82` | `420` |
| `modify` | `packages/fount_run/lib/fount_run/pipeline_handler.ex` | `713b63260cd06be38b48ea1b3b940a91b1c53624ce882da5778d26a767cf048a` | `0e4735a30efa1bbeb79b5c9b610b24e359981e9e9c7274a372ccb08f56fac9e6` | `420` |
| `modify` | `packages/fount_run/lib/fount_run/stage_registry.ex` | `cba66c67aef6452494ff57bf60a7f371b8b0e0d3a549793823f4d3a9047be7f9` | `ac0a94b4a4f5fbe46661454a2517fbfc4f9098dd78fd340d65a37ffdbc5a649a` | `420` |
| `add` | `packages/fount_run/lib/mix/tasks/fount.run.ex` | `-` | `f624a13e59efe0afcae0029c8909c1a293046fbe7991b4ec414b4430d248eb3f` | `420` |
| `modify` | `packages/fount_run/mix.exs` | `c1deb1eb840956864976241cadb682ab8be5c16fe1eb0bd7253993ed53710d59` | `c71d7b85863ceacc104ecc65ac6796c4aa62969184f800df89441f09b136db0c` | `420` |
| `add` | `packages/fount_run/priv/repo/migrations/20260929010000_control_and_completion.exs` | `-` | `a2810909f9d2dd11e25ea706467e77761e3c6d7ccd081d23151d44bd0efe7127` | `420` |
| `add` | `packages/fount_run/test/control_completion_test.exs` | `-` | `6d848ce511d254f7969c3783e90b39975f6ad09e514574b7078911602ff3d2db` | `420` |
| `modify` | `packages/fount_run/test/durable_execution_test.exs` | `4fe33a55bbd6f8bb181f0292e2e881ee35bda6021582ac0abd89537d9e7b311a` | `498cc8026af047539a233c8ddabb1ad07defcfdcbdcbcda22beb23e463b946f0` | `420` |
| `modify` | `packages/fount_run/test/screenplay_pipeline_test.exs` | `b387b67edbabb76cecbb3e40f0f97bccc1dfa4ce4bad3b022c8c572d2656d921` | `2544d4e299542f2419d16bc5c3579c01118414cc434d82f82496d8b88b7302f3` | `420` |
| `modify` | `packages/fount_run/test/storage_contract_test.exs` | `e17e5c214785a748f5adb98172b235a61c43559c8f28c35a114591efb4ba5b53` | `7f85d41e9f65a015d84d4f7c2b9fcd0a43129eae6983d7ea27b02b1e64b278a9` | `420` |
| `add` | `scripts/tests/test_control_completion_source.py` | `-` | `9b18f4c941c25fe1398252830b27a687611e02e838a2e4d12b72145a6b1bb9fe` | `420` |
| `modify` | `scripts/tests/test_durable_execution_source.py` | `65cc38b830cda7313606393d4c8309e9be5e71f347b09ab8641b602031052d4e` | `d3def74cd29f9c5b7934e25d6c1dd6b11babb002bdbe3d1a51388cd15ef8f4b5` | `420` |
| `modify` | `scripts/tests/test_run_foundation_source.py` | `8ee6c9dc80812dde1901031af6acfd19e1d28735973c82094b43a86d35b40b2a` | `fe73e84e270e64b107ef8d338d90e60a293783ee506671dcf9899b2feac13346` | `420` |
| `modify` | `scripts/tests/test_screenplay_pipeline_source.py` | `724b31885e718d354bb1a06fd8c8c3875e21be64cd5855921dae8e067c5454f2` | `0ddf550ef11565527303bbe5d2a1f54328ba82cbfbd6f050afa09b1d5742ddae` | `420` |

No dependency-repository files were changed.

## Static checks actually executed

| Check | Result |
| --- | --- |
| Reconstructed Fount snapshot commit/hash identity against sealed input | PASS — exact baseline is `c3af2d662198aaf15dd8e754f2d25c109c2707c1`. |
| Reconstructed docset snapshot commit/hash identity against sealed input | PASS — exact baseline is `e3369f4bba8e977d83d5091126c9261488893a98`. |
| Input packet SHA-256 verification against `PACKET_MANIFEST.json` | PASS — all five XML hashes/byte counts matched. |
| Temporary Git baseline plus `git diff --check` | PASS — no whitespace errors in the Phase 05 diff. |
| Python parse of all Fount JSON files | PASS — 65 JSON files parsed, 0 errors. |
| Phase 05 source contract test `scripts/tests/test_control_completion_source.py` | PASS — 7/7 C01–C07 source-only checks. |
| Supported source-only Python regression files from the sealed snapshot | PASS — 154 tests across 20 files. `test_prune_deleted_directories.py` was excluded because its imported `scripts/prune_deleted_directories.py` source is not present in the supplied Repomix snapshot; local QC must run the complete suite from the installed repository. |
| `scripts/final_acceptance.py` source audit | PASS — 16/16 source-only checks; its own output explicitly disclaims runtime evidence. |
| Changed-path scope scan | PASS — 31 payload paths; no Phase 06/web path changed. |
| Strict overlay applier dry-run against exact Fount baseline | PASS. |
| Strict overlay applier apply against exact Fount baseline | PASS — 31 writes. |
| Full post-apply tree comparison | PASS — 761 reconstructed payload files on each side after excluding generated Python caches, byte-identical intended/applied trees, zero deletions. |
| Elixir/Mix application compile, formatter and ExUnit | **NOT_RUN** — Elixir/Mix are unavailable in this offline environment. |
| PostgreSQL migrations/concurrency | **NOT_RUN** — application runtime QC is reserved for the local agent. |
| Provider callback/runtime journeys | **NOT_RUN** — application runtime QC is reserved for the local agent. |
| PDF generation/application integration | **NOT_RUN** — only host PDF inspection tools were present; the configured application PDF runtime was not executed. |

Python `3.13.5` and Git `2.47.3` were available for packaging/static verification. Presence of `pdfinfo`/`pdftotext` is not PDF acceptance evidence.

## Known risks requiring local QC

- BEAM compilation, formatter behavior, Ecto migrations, SQL constraints/triggers and ExUnit behavior have not executed here; source inspection cannot substitute for them.
- Approval/stop/acceptance races require real PostgreSQL transactions and distinct connections to certify lock ordering and fencing.
- Provider crash/reconciliation behavior must be exercised around all five C06 fault boundaries with the installed runtime and scripted providers.
- Configured PDF export must be executed, its file inspected, an intentional format failure surfaced, and independent retry proven. Installed inspection binaries alone do not prove generation.
- CLI commands need local Mix execution with trusted Repo/principal/service configuration, including all three product journeys.

## Handoff boundary

Apply/commit the supplied Fount overlay and complete docset before local QC as instructed by the workflow. Then follow [PHASE_05_RUNTIME_QC_HANDOFF.md](PHASE_05_RUNTIME_QC_HANDOFF.md), repair only Phase 05 as needed, and record executed evidence. Do not mark Phase 05 `COMPLETE` until every required C01–C07 gate passes. Do not start Phase 06 from this offline handoff.
