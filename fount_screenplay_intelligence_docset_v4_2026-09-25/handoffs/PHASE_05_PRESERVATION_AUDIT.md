# Phase 5 preservation audit

## Purpose

Phase 5 adds diagnosis and orchestration without replacing canonical screenplay behavior, Observe's provider boundary, the existing low-level Intelligence tools, or Workshop's creative-writing authority.

## Preserved functionality

- `packages/fount/` canonical parser, IR, editing, revision and persistence source is unchanged.
- `packages/fount_workshop/` generation, develop/rewrite/pass/recovery, acceptance, DB, PDF and table-read source is unchanged.
- Existing `Fount.Intelligence.Playbooks.Registry` low-level catalog and the public `run/5`, `execute/4`, `plan/4`, `explain/5`, comparison and inspection paths remain present.
- Phase-3 StoryWorld and Phase-4 Temporal/Reader pure source is not modified.
- Existing Observe request/executor/provider/cache/context primitives remain authoritative. Phase 5 adds two declarative lenses and registers them; it does not create another provider stack.
- SystemOneSDK, Inference and ASM are inspected dependency snapshots, not new direct Phase-5 package dependencies. System One remains behind Observe; Inference remains Workshop-owned; ASM remains behind Inference/its consuming application.
- Workshop still owns candidate screenplay pages and canonical acceptance. The Phase-5 writer packet leaves `candidate` nil.

## Intentional changes

`fount_intelligence` gains pure Diagnosis records/reduction, shell-side context/planning/acquisition support, a separate ten-item writer playbook catalog, a multi-pass writer runner, writer result packet and renderer, tests, documentation and a Sandbox example. `fount_observe` gains two closed diagnosis lenses plus registry/docs updates. Root/package changelogs and READMEs describe the phase.

The writer registry is deliberately additive. Replacing the older low-level registry would break existing Workshop/analysis callers and would confuse foundational inspection tools with the ten writer tasks introduced by this phase.

## Runtime preservation gates Codex must rerun

1. format/compile/test all four packages and the root workspace;
2. run the compiled architecture/xref gate, especially the pure Diagnosis boundary and allowed Observe value-contract use;
3. rerun existing Intelligence StoryWorld/Reader/playbook/request/investigation tests;
4. rerun Observe measurement/context/cache/provider/Sandbox tests after the new lens registration;
5. rerun existing Workshop writer workflows, isolated DB integrations, acceptance/rejection and PDF/export checks;
6. inspect package builds/docs so new lenses/guides/modules/examples are included correctly;
7. verify no direct SystemOneSDK, Inference or ASM dependency leaked into Phase-5 Intelligence source.

## Known baseline gap

The supplied Fount XML contains `scripts/tests/test_prune_deleted_directories.py` but not `scripts/prune_deleted_directories.py`. Repository-wide Python discovery therefore reports one import error. Phase 5 does not manufacture an unrelated helper to hide this input gap. Codex must inspect the actual applied checkout and reconcile it from real repository evidence.

## Result

No existing feature is intentionally removed. Runtime preservation remains unverified until Codex runs the repository-native gates on the user's applied commit.