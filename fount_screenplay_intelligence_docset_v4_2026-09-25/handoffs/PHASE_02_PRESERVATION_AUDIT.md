# Phase 2 preservation audit

**Scope:** 21 added files, 25 modified files, no deletions.
The complete per-file hashes and all 32 newly written ExUnit test names
are in `PHASE_02_FILE_INVENTORY.json`.

The source comparison preserves every pre-existing test. All files in
`packages/fount/` and `packages/fount_workshop/` remain byte-for-byte unchanged.
The root workspace project, dependency locks, migrations, assets represented in
the snapshot, package versions, and ten installed lens declarations remain
unchanged. Existing Memory cache and direct Sandbox fixtures remain valid input
paths; no old/new compatibility reader or retired package is introduced.

Only one existing Intelligence line changes: its state hash uses
`Context.semantic_map/1`, exactly matching the provider-visible serializer rather
than hashing storage-only Fact evidence pointers. Pure reader, StoryWorld,
capability and playbook code is not changed. New Observe context/lens/calibration
validation rejects malformed input; valid existing calls are intended to retain
behavior, subject to runtime regression tests.

Existing writer development, revision, comparison, acceptance/rejection, recovery,
table-read and export implementations are untouched. This is a source-preservation
claim, not a new runtime proof. Full four-package tests and the stored Phase 1
writer demonstration must run against the modified Observe implementation.

No source is changed in the SystemOneSDK or Inference repositories. No dependency
upgrade, lock resolution, publication, database schema change, migration, original
screenplay edit, or Phase 3 implementation occurs in this delivery.

The input's absent `handoff/prune_deleted_directories.py` remains an explicit
snapshot omission. The original test is retained and full Python discovery reports
its import failure. Actual checkout inspection must recover evidence, not guessed
implementation. Excluded decorative SVGs are likewise not deleted or replaced.

Historical Phase 1 results and user-authorized Luna alternative-output debt are
retained without being relabeled as Phase 2 success.