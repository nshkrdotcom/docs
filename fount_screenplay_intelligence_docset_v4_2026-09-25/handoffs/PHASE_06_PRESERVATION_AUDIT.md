# Phase 6 preservation audit

## Purpose

Phase 6 completes capability families 1–4 without replacing canonical screenplay behavior, Observe's measurement boundary, Phase-3/4 StoryWorld/Temporal/Reader semantics, Phase-5 Diagnosis/playbooks, or Workshop's creative-writing authority.

## Preserved functionality

- `packages/fount/` parser, canonical IR, editing, revision, persistence and exact selection behavior are unchanged.
- `packages/fount_workshop/` creative generation, alternatives, develop/rewrite/pass/recovery, acceptance, DB, PDF and table-read source is unchanged.
- Existing Phase-3 StoryWorld records/queries and Phase-4 Temporal/Reader source are not modified.
- Existing Phase-5 Diagnosis, WriterRunner, writer packet/renderer and low-level playbook registry remain intact.
- Observe's request/executor/provider/cache/context contracts remain authoritative. Phase 6 adds four data-only lenses and registry entries; it does not create another provider stack.
- SystemOneSDK, Inference and ASM remain dependency snapshots used for API inspection. Phase 6 adds no direct dependency on them from pure Intelligence; System One remains behind Observe, and creative completion remains behind Workshop/Inference.
- Workshop still owns generated screenplay candidates and canonical acceptance. Phase-6 writer packets keep `candidate` nil.

## Intentional changes

`fount_intelligence` gains four pure capability-family evaluators, shared support/result contracts, a closed measurement catalog, shell-side source/StoryWorld runner, public facade calls, deterministic fixtures/tests/example and a screenplay-first guide. `fount_observe` gains four closed lens assets, registry entries, a focused lens test and changelog entry. The existing writer registry receives only Phase-6 family mappings for Scene Doctor, Character Trajectory and Relationship Pass.

## Runtime preservation gates Codex must rerun

1. format/compile/test the root workspace and all four packages;
2. run the compiled architecture/xref gate, especially the pure `Capabilities` namespace;
3. rerun existing StoryWorld, Temporal, Reader, Diagnosis, writer-runner and low-level playbook tests;
4. rerun Observe measurement/context/cache/provider/Sandbox tests after lens registration;
5. rerun existing Workshop creative workflows, acceptance/rejection, isolated DB integrations, PDF/export and table-read gates;
6. build docs/packages and verify new lenses/guides/modules/examples are shipped correctly;
7. verify the new public Phase-6 facade and Sandbox example use the actual APIs without direct SystemOneSDK/Inference/ASM leakage;
8. verify Phase-7 capability modules were not introduced.

## Known baseline gap

The supplied Fount XML contains `scripts/tests/test_prune_deleted_directories.py` but not `scripts/prune_deleted_directories.py`. Repository-wide Python discovery therefore reports one import error. Phase 6 does not invent an unrelated helper to hide that input gap. Codex must inspect the actual applied checkout and reconcile it only from real repository evidence.

## Result

No existing feature is intentionally removed. Runtime preservation remains unverified until Codex runs the repository-native gates on the user's applied Phase-6 commit.
