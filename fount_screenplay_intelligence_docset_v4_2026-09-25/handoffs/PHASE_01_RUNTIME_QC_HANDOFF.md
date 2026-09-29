# Phase 01 — runtime QC and completion

The user has already applied both Phase 01 ZIPs to their respective repositories, committed and pushed both repositories. **Do not reapply either ZIP.** Start from the installed commits and repair/certify only Phase 01.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Phase identity and source delivery

- Phase: **01 — Core approval safety**
- Current docset state on delivery: `OFFLINE_IMPLEMENTED`
- Fount input Repomix SHA-256: `e0c159ccc415a4d85478360088d1509aa45a88361fe66c839a6f9a3f2f23ba44`
- Docset input Repomix SHA-256: `92451fc693a7cdd1db8f5922fcd4cf262cba796d8b00ba866b4b71e5b674dd61`
- Delivered Fount overlay: `fount_run_phase_01_overlay.zip`, SHA-256 `0187847138ff2cb50e04a4b6d87e97aba0732025a7cda0fc06f6dfbb0b30ec9a`
- Copied overlay manifest: `handoffs/PHASE_01_OVERLAY_MANIFEST.json`, SHA-256 `88f3356983f534b0d46173bf12c3aa86f9af665e2d639c0b4b9987238f9e3c17`
- Source operations: 53 (45 modify, 8 add), deletions: 0
- Dependency XMLs were not required for this phase; no dependency source was changed or guessed.

Read `AGENT_START_HERE.md`, `state.json`, `phases/01_CORE_APPROVAL_SAFETY.md`, `RUNTIME_QC.md`, `handoffs/PHASE_01_INPUTS.json`, `handoffs/PHASE_01_IMPLEMENTATION_MATRIX.md`, this handoff, and the copied overlay manifest before running tests.

## What was implemented

Phase 01 enforces the invariant that every post-genesis canonical advance consumes a typed authorized approval through the existing candidate-acceptance transaction. It blocks changed `Persistence.save/4` and `save_edit/4`, adds `save_edit_candidate/4`, typed principal/authority/review/approval contracts, stable caller-owned approval IDs, authoritative required-check snapshots/fingerprints, strict human-vs-automated override rules, forward approval-audit migration/constraints, stable replay/conflict behavior, and the corresponding Workshop/CLI/test/doc conversion. No Run package exists yet.

The first implementation intentionally requires review principal == approval principal. Existing architecture permits a later explicit adoption flow but no caller silently rewrites reviewer identity.

A migrated pending candidate has no old check fingerprint. It remains recoverable only by exact idempotent `save_candidate/3` replay, which attaches the new authoritative check snapshot; altered payloads conflict. Migrated acceptance rows are `historical` with principal types left null rather than guessed.

## Validate the already-applied payload

Record the actual user-applied Fount commit and docset commit first:

```bash
cd /home/home/p/g/n/fount
git status --short
git rev-parse HEAD
git branch --show-current
cd /home/home/p/g/n/brainstorms
git status --short -- docs/20260928/fount
git rev-parse HEAD
git branch --show-current
```

Do not run the applier again. Verify the installed Fount paths against `handoffs/PHASE_01_OVERLAY_MANIFEST.json` from the docset (result hashes only; zero deletions). If user formatting or an intentional post-apply edit changed a delivered hash, inspect it, record the deviation, and reconcile rather than overwriting blindly.

For reference only, the user-side application path is compatible with:

```bash
cd /home/home/p/g/n/fount
python3 handoff/apply_overlay.py --root . --archive /absolute/download/fount_run_phase_01_overlay.zip --allow-terminal-newline --dry-run
python3 handoff/apply_overlay.py --root . --archive /absolute/download/fount_run_phase_01_overlay.zip --allow-terminal-newline --apply
```

Those commands are **not** local-agent instructions now that the ZIP is already applied.

## Execute and repair

First record the actual toolchain (`elixir --version`, `mix --version`, PostgreSQL version) and use an isolated test database. Then run the common ladder from `RUNTIME_QC.md` in `/home/home/p/g/n/fount`:

```bash
mix setup
mix format --check-formatted
mix deps.unlock --check-unused
mix blitz.workspace format --check-formatted
mix blitz.workspace lock_check
mix blitz.workspace compile
mix test
mix fount.architecture
mix blitz.workspace credo --strict
mix blitz.workspace dialyzer
mix blitz.workspace docs
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
```

If this repository's checked-in `mix ci` is the canonical aggregate, run it as well and record exactly what it covers.

### Core PostgreSQL / A01–A05

From `/home/home/p/g/n/fount/packages/fount`, with `FOUNT_DATABASE_URL` pointing at the isolated test database:

```bash
MIX_ENV=test mix ecto.create
MIX_ENV=test mix ecto.migrate
MIX_ENV=test mix test integration/approval_migration_test.exs
MIX_ENV=test mix test integration/writing_persistence_test.exs integration/continuation_concurrency_test.exs
MIX_ENV=test mix test integration
mix test
```

`approval_migration_test.exs` creates disposable per-test PostgreSQL schemas and must prove both full fresh migration and upgrade from version `20260927000000` through `20260928000000`. Repair ordinary Ecto/Postgrex/migration syntax or prefix issues if the no-Elixir source delivery missed one; do not weaken the identity constraints to make the test pass.

Required behavior to attest:

- **A01:** genesis plus direct authenticated human, agent and service acceptance through the same Core transaction, no provider credentials.
- **A02:** changed `save/4` and `save_edit/4` return an approval-required error and do not persist/move canon; manual-edit candidate path works. Confirm only genesis and candidate acceptance can call `set_head/3`.
- **A03:** candidate/base/content/report/check mismatches, missing required checks, forged authority and invalid overrides leave head/audit unchanged. Deterministic failures block every principal; agent/service cannot override subjective failures; declared human subjective override requires nonblank reason.
- **A04:** use independent PostgreSQL connections for the competing candidate acceptance test. Exactly one head advance wins; identical stable approval replay returns recorded result; changed same-ID payload conflicts; stale base fails.
- **A05:** fresh and baseline-upgrade migrations preserve history, classify migrated rows without guessed principal types, enforce exact candidate/result/approval identity, and roll back failed acceptance without partial head/audit changes. Exercise the exact pending-candidate replay upgrade seam if practical.

### Workshop / A06

From `/home/home/p/g/n/fount/packages/fount_workshop`:

```bash
MIX_ENV=test mix test integration
mix test
```

Also exercise `mix fount.accept --help` and a scripted/local candidate acceptance with a caller-retained UUID using `--principal-type human --approval-id <stable-uuid>`. Verify the old actor-string argument shape is not a writable compatibility path. Existing rejection, candidate-only workflows, exports and non-mutating edit/review behavior must remain green.

### Existing four-package boundary

Phase 01 must still have exactly the existing four library projects; `packages/fount_run` must not exist. Build each package with the existing package-build convention:

```bash
for package in fount fount_observe fount_intelligence fount_workshop; do
  (cd /home/home/p/g/n/fount/packages/$package && FOUNT_PACKAGE_BUILD=1 mix hex.build)
done
```

Confirm `fount` has no Run dependency and no provider credential is required by A01–A06.

## Source-only checks already performed

- Phase 01 source checks: PASS 10/10.
- All phase source checks present in the supplied snapshot: PASS 118/118.
- Snapshot-sealing checks: PASS 8/8.
- Overlay dry-run/apply + byte comparison: PASS, 53 operations, 0 deletions.
- Broad Python discovery in the extracted Repomix tree reached 126 passing tests but could not import `test_prune_deleted_directories` because `handoff/prune_deleted_directories.py` is outside the supplied Repomix include set. On the full checkout this is a required retry, not a waiver.
- All Elixir/Ecto/PostgreSQL/format/Credo/Dialyzer/docs/package checks: NOT_RUN in web chat.

## Repair boundaries

Fix compile/API/migration/test defects required by A01–A06 in the installed source. Update affected Core/Workshop docs/tests if signatures settle. Preserve unrelated work. Do not create `packages/fount_run`, implement workers, or advance any Phase 02 behavior. Do not use paid/live providers; they are unnecessary here.

Likely first-runtime-risk areas because this environment lacked Elixir:

1. Ecto migration DSL/default-expression and isolated-schema MigrationRepo options in `approval_migration_test.exs`.
2. Formatter/warnings-as-errors in the newly added typed modules and converted tests/examples.
3. PostgreSQL composite/FK constraint ordering during fresh and upgrade migrations.
4. Workshop test helper call-shape conversions and any missed old acceptance caller in the full checkout omitted by Repomix.

Treat those as repair targets, not reasons to weaken the approval invariant.

## Record evidence and finish the phase

Create `handoffs/PHASE_01_RUNTIME_QC_REPORT.md` from the runtime report template. Record actual commands, versions, counts, DB evidence, user-applied code/doc commits, repair commits, final verified Fount commit/tree, and branch/push results. Map every A01–A06 item to executed evidence.

Set Phase 01 `COMPLETE` only when all required engineering gates pass. Otherwise set `QC_FAILED` with actionable evidence and stop on Phase 01. On success:

1. Commit/push Phase 01 repairs in `/home/home/p/g/n/fount`.
2. Update `state.json`, `TRACEABILITY_MATRIX.md`, decisions/reporting as needed in `/home/home/jb/docs/20260928/fount` (canonical `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`), run `python3 scripts/docset.py refresh` and `validate`, commit from `/home/home/p/g/n/brainstorms`, and push.
3. Generate the next **five** sealed XMLs from the corrected committed source using `scripts/prepare_inputs.py`; Phase 02 begins only from that verified baseline.
4. Stop after returning the fresh packet paths and generated `NEXT_HANDOFF.md`. Do not implement Phase 02 in this cycle.
