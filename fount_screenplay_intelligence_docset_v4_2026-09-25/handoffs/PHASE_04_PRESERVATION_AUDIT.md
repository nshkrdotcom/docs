# Phase 4 preservation audit

## Purpose

Phase 4 must add temporal/first-reader reasoning without breaking canonical screenplay editing, Observe measurement behavior, existing StoryWorld semantics, or Workshop writing workflows.

## Source areas deliberately preserved

- `packages/fount/`: no canonical parser/editor/persistence code is changed.
- `packages/fount_observe/`: no provider, lens, cache, context, measurement, sandbox, or System One adapter code is changed.
- `packages/fount_workshop/`: no generation, revision, acceptance, DB, PDF, audio, or writer-workflow code is changed.
- database migrations and schemas: unchanged.
- System One and Inference dependencies/APIs: inspected but not called by new Phase-4 pure modules.
- existing StoryWorld records/compiler/query/causality semantics: preserved; the only StoryWorld source change is a graph helper for connected story-time recomputation.
- existing `Fount.Intelligence.Reader.Reveal`: preserved rather than replaced.

## Intentional modifications

`fount_intelligence` gains `Temporal`, `Reader`, Reader value structs, tests, a provider-free example, and documentation. `StoryWorld.StoryTime.connected_nodes/2` exposes undirected connected-region traversal needed for recomputation. `mix.exs` only adds the new guide/modules to generated docs. Root/package README and changelog text describe the new phase.

## Preservation risks Codex must rerun

1. Compile and format all four packages; source-writing could contain Elixir syntax/style issues that Python cannot prove.
2. Run existing Intelligence tests, especially StoryWorld temporal/causal/records/reference suites, because Phase 4 consumes those contracts.
3. Run the compiled architecture/xref gate to prove no accidental effect dependency entered the pure namespace.
4. Run existing Core/Workshop DB, writer acceptance, PDF/export and revision regression checks required by the repository's current QC policy.
5. Inspect package contents/docs so the new guide/example ships without pulling test/support code into release artifacts unexpectedly.

## Known input-only gap

The supplied Fount XML contains `scripts/tests/test_prune_deleted_directories.py` but does not contain `scripts/prune_deleted_directories.py`. Consequently the repository-wide Python source suite reports one import error. Phase 4 did not manufacture an unrelated helper to make that old test green. Codex should compare the real applied checkout with the supplied snapshot and either restore the helper only if it belongs to the actual baseline or record the mismatch; do not attribute this failure to the new Reader/Temporal implementation without evidence.

## Result

No existing feature is intentionally removed or compatibility-shimmed. Runtime preservation remains unverified until Codex executes the full gates on the user's applied commit.