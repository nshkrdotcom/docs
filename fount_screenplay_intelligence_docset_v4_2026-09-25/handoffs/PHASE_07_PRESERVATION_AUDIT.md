# Phase 7 preservation audit

**Offline status:** source changes are intentionally narrow; runtime preservation is still pending.

## Source areas deliberately unchanged

- `packages/fount/**` canonical screenplay Core is unchanged: Fountain parsing/round-trip, FDX/JSON interchange, typed edits, persistence, revision identity, search/query, annotations and source evidence are not modified.
- `packages/fount_workshop/**` is unchanged: Develop, TargetedRewrite, SequenceRebuild, CharacterRewrite, NoteResponse, Pass, Recover, alternatives/audition/combine/select/materialize, review/rebase/accept/reject, rendering/PDF and table-read ownership remain as before.
- Existing Phase-3 `StoryWorld`, Phase-4 `Temporal`/`Reader`, and Phase-5 `Diagnosis` modules are reused, not replaced.
- Existing Phase-6 Scene/Agency/Character/Relationship evaluator modules are unchanged. Shared closed registries and the Capability runner are extended to include families 5–8.
- No dependency version or lockfile is changed.
- No direct SystemOneSDK, Inference or ASM dependency/call is introduced by Phase 7.

## Intentional shared-seam changes

- Observe Registry installs four new closed declarative lens assets.
- Intelligence CapabilityMeasurements/Capabilities registries install families 5–8.
- `CapabilityRunner` adds playbook/family routing, strict dialogue turn-pair construction, optional Reader-event use, and typed dialogue context validation.
- `WriterRegistry`, Intelligence docs/example/mix ExDoc extras and changelogs are extended.
- The historical Phase-6 source test is updated only to remove its now-obsolete assertion that Phase-7 modules must not exist; it still protects the Phase-6 contract.

## Offline transport preservation evidence

The overlay contains 30 operations: 16 additions, 14 modifications, zero deletions. ZIP integrity, strict preimage dry-run, strict application, 30/30 result hashes, and whole-tree reproduction pass. No unknown source file is deleted. The source package and Workshop source are absent from the operation list.

## Runtime preservation obligations for Codex

Do not infer preservation from the offline pass. On the actual checkout, rerun at least:

- root/four-package formatting, warnings-as-errors compile, full `mix ci`, compiled architecture, strict Credo, Dialyzer, ExDoc and package/archive inspection;
- all Phase-7 focused Observe/Intelligence tests and provider-free example;
- Phase-3 StoryWorld, Phase-4 Temporal/Reader, Phase-5 Diagnosis/WriterRunner, and Phase-6 capability/runner regression suites;
- canonical Core lossless/interchange/edit/persistence tests;
- isolated PostgreSQL Core + Workshop writing integrations;
- writer acceptance/rejection plus representative Develop/rewrite/rebuild/pass/recover flows;
- PDF/export and table-read/audio checks supported by the checkout;
- repository-wide Python source tests, after confirming the real cleanup helper that was omitted from the XML export remains present.

A live provider call is not required just to prove pure Phase-7 reasoning unless the repository's current QC policy or an authorized test requires it. If a live call is used, record actual provider/model identity and protect secrets.