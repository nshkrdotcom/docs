# Phase 3 preservation audit

**Status:** source-level preservation audit complete; runtime regression suite unrun.

## Change scope

The Phase-3 Fount diff contains **21 additions, 8 modifications, zero deletions**. All production changes are confined to `packages/fount_intelligence`; the only other Fount addition is `handoff/PHASE_03_SOURCE_NOTES.md`.

No file under these areas is changed by the overlay:

- `packages/fount/` canonical screenplay substrate;
- `packages/fount_observe/` measurement/acquisition runtime;
- `packages/fount_workshop/` writing/generation/revision workflows;
- root `mix.exs`, root lockfile, package lockfiles;
- PostgreSQL migrations/persistence schema;
- installed Observe lenses/calibrations/fixtures;
- SystemOneSDK or Inference repositories.

## Existing Intelligence preservation

Existing Phase-1/2 playbooks, acquisition modules, reporting, saved records, Reader reveal logic, capability interpretation and `StoryWorld.Records` remain in place. The only existing source files modified are Intelligence package docs/mix docs metadata and `test/test_helper.exs` to load a new test support fixture.

Phase-2 extraction record kinds (`events`, `propositions`, `goals`, `knowledge_access`, `props`, `commitments`, `relationships`, `timeline`) remain accepted by `StoryWorld.Records` and are explicitly normalized by the new compiler. A preservation test asserts that a Phase-2 `events` record still compiles as a source-backed StoryWorld event.

## Boundary preservation

- SystemOneSDK remains reachable only through the established Observe provider boundary; Phase 3 adds no SDK call.
- Inference remains outside `fount_intelligence`; Phase 3 adds no completion call.
- StoryWorld pure code adds no Repo, filesystem/IO, environment, clock, random-ID or process/runtime effect call in direct source inspection.
- Writer generation/acceptance/rebase/export behavior stays in Workshop and is not duplicated.

## Runtime regressions Codex must rerun

The source-only preservation audit does not prove behavior. Runtime QC must run the repository's current full test/CI ladder, not just new StoryWorld tests, including the four-package architecture gate and existing Workshop/persistence acceptance tests. Any regression introduced by Phase 3 must be repaired inside Phase 3 before completion.
