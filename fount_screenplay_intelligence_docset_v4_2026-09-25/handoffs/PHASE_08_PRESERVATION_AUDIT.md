# Phase 8 preservation audit

**Offline status:** source changes are additive and limited to Observe/Intelligence seams; runtime preservation is pending.

## Source areas deliberately unchanged

- `packages/fount/**` canonical screenplay Core is unchanged: lossless Fountain, FDX/JSON interchange, typed edits, persistence, revision identity, search/query, annotations and source evidence remain owned there.
- `packages/fount_workshop/**` is unchanged: Develop, TargetedRewrite, SequenceRebuild, CharacterRewrite, NoteResponse, Pass, Recover, alternatives/audition/combine/select/materialize, review/rebase/accept/reject, render/PDF and table-read behavior remain Workshop-owned.
- Phase-3 StoryWorld, Phase-4 Temporal/Reader, Phase-5 Diagnosis, Phase-6 families and Phase-7 families are reused rather than replaced.
- No dependency version or lockfile is changed.
- No direct SystemOneSDK, Inference or ASM dependency/call is introduced.

## Shared seams intentionally extended

- Observe Registry installs four Phase-8 closed lens IDs; `DeclarativeLens` adds a capability-limited data-only authoring path through existing Question/Lens/Registry machinery.
- Intelligence adds family evaluators 9–12, safe genre-pack catalog/validation and an explicit two-revision runner.
- `CapabilityMeasurements`, `Capabilities`, `CapabilityRunner`, `WriterRegistry` metadata and public `Fount.Intelligence` delegates are extended.
- The existing ten writer-playbook IDs are preserved. In particular, `character_trajectory` keeps its previous default family list; Emotional/Value is an explicit opt-in so prior callers do not silently incur added provider work.
- `submission_read` gains Theme and can add Genre only when a genre pack is explicitly supplied.
- `revision_regression` is not routed through the ordinary single-screenplay path; it requires the explicit before/after revision surface.

## Offline transport evidence

The overlay contains 37 operations: 22 additions, 15 modifications, zero deletions. ZIP integrity, strict preimage dry-run/application and whole-tree reproduction passed against the supplied Fount baseline. The canonical Core and Workshop trees are absent from the operation list.

## Runtime preservation obligations for Codex

On the actual applied checkout rerun root/four-package format, warnings-as-errors compile, full `mix ci`, compiled architecture, strict Credo, Dialyzer, ExDoc and archives; focused Phase-8 Observe/Intelligence tests and provider-free example; Phase-3 through Phase-7 regressions; canonical Core lossless/interchange/edit/persistence; isolated Core + Workshop PostgreSQL writing integrations; writer acceptance/rejection and representative creative flows; and supported PDF/table-read/audio checks.

The supplied XML omits the cleanup helper imported by `test_prune_deleted_directories.py`; Phase-7 runtime QC says the real checkout has the tracked helper and all Python tests passed. Preserve/verify the real helper rather than manufacturing one from this snapshot.
