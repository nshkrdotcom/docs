# Sources and inspected baseline

Prepared 2026-09-28 from local source. This records inspection, not a new runtime certification.

| Source | Inspected commit / path |
| --- | --- |
| Fount | `6becd6e8a753df7709d7c47e169cf9f4496d88d1` at `/home/home/p/g/n/fount` |
| System One SDK | `e757598a89e549274b979f0e77c6a4b2b6667752` at `/home/home/p/g/n/system_one_sdk` |
| Inference | `3750a03ec62a3c9da11be9caa4dc911ebbbb9801` at `/home/home/p/g/n/inference` |
| Agent Session Manager | `dc28a00e5ff6ad6932411334241ec8d9efda8857` at `/home/home/p/g/n/agent_session_manager` |

Product source: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260927/fount/{README.md,PRODUCT.md,ARCHITECTURE.md,FOUNT_RUN_PACKAGE.md,REVIEW_AND_APPROVAL_MODEL.md}`. `PRODUCT.md` is retained here as the product brief; the new architecture/data/approval/workflow documents resolve its technical details. The earlier package proposal is superseded by those documents rather than copied as a conflicting second contract.

Handoff reference: `/home/home/p/g/n/docs/fount_screenplay_intelligence_docset_v4_2026-09-25`, especially `AGENT_START_HERE.md`, `17_AGENT_EXECUTION_PROTOCOL.md`, `18_RUNTIME_QC_PROTOCOL.md`, `35_FOUR_XML_PROGRESSIVE_HANDOFF.md`, Repomix configs and phase handoffs. Reuse its source delivery/QC cycle, byte fidelity and honest evidence rules. Its sixteen-phase count and exact four-package target belong to that completed plan and do not constrain this one.

Inspected source includes Core persistence/review gate/migrations; Workshop Session, Strategy, Review, Acceptance, Store, Services, Budget and Rebase; workspace/package Mix files, CI, final-acceptance script, overlay applier and snapshot sealer. See `ARCHITECTURE.md` for absolute file anchors. Inference and System One `AGENTS.md` describe their ownership boundaries; follow current copies if changing them is separately authorized.

The old architecture cited Fount `101e270`. This docset uses the later inspected hash above. Fresh sealed XML input always replaces the source baseline for implementation; record changes instead of assuming either historical hash is still HEAD.

## Phase 02 sealed implementation packet

The Phase 02 web implementation used the five sealed XMLs below. Fount/docset XMLs do not embed a reliable current Git commit, so their packet byte identities are authoritative for this offline delivery; no commit is invented. Dependency XMLs embed the listed clean commits and were inspected without changes.

| Snapshot | SHA-256 | Bytes | Embedded commit |
| --- | --- | ---: | --- |
| `fount(20260928-214212).xml` | `27aaf9c0059cb8a4093a63e8caaa98d1598e9afc7d9d908b2e29ae777d04130e` | 3485104 | not embedded |
| `docset(1).xml` | `08f521d050e104244f8acf6b88dec80c1e6ca7a6407b7aa9fba96b2cf01ace68` | 263126 | not embedded |
| `system_one_sdk(20260928-214142).xml` | `ce3fcec597edcf82bf11dfd227a2a483c57d4ef2dc140f27816f1799a0c31942` | 981679 | `e757598a89e549274b979f0e77c6a4b2b6667752` |
| `inference(20260928-214141).xml` | `2b1906c46181a3d90efbb898a262467594430ab3907530d8b99a4ef6f6e1e06e` | 320605 | `3750a03ec62a3c9da11be9caa4dc911ebbbb9801` |
| `agent_session_manager(5).xml` | `d2a9aec681b2cfc3f0766af2849fd397f76a3de8ee5c2c448f01aa6a35f61854` | 1670906 | `dc28a00e5ff6ad6932411334241ec8d9efda8857` |

See `handoffs/PHASE_02_INPUTS.json` for canonical source-root paths and dependency disposition.
