# Phase 01 offline implementation handoff

Status: **OFFLINE_IMPLEMENTED** on 2026-09-28. Runtime certification is pending.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Phase and inputs

`state.json` selected the first non-`COMPLETE` phase: **01 — Core approval safety**. The supplied attachments are recorded in [PHASE_01_INPUTS.json](PHASE_01_INPUTS.json):

- `fount(20260928-202841).xml`: `e0c159ccc415a4d85478360088d1509aa45a88361fe66c839a6f9a3f2f23ba44` (3396668 bytes)
- `docset.raw(20260928-202846).xml`: `92451fc693a7cdd1db8f5922fcd4cf262cba796d8b00ba866b4b71e5b674dd61` (197059 bytes)

The supplied Repomix files did not embed a reliable Git commit identity, so no commit is invented. System One SDK, Inference and Agent Session Manager XMLs were not supplied and were not requested: Phase 01 required no external dependency API beyond the complete Fount snapshot.

## Implemented behavior

- Closed the post-genesis `save/4` / `save_edit/4` canonical mutation bypass. Changed models now return `:approval_required`; manual edits use `save_edit_candidate/4` and remain noncanonical until accepted.
- Added typed `Principal`, trusted host `Authority`, typed/closed `Review`, stable typed `Approval`, and canonical fingerprints.
- Added an authoritative required-check inventory/fingerprint saved with each candidate. It binds definitions, outcomes and exact report IDs; omitted/malformed required checks fail closed. Declared subjective overrides are human-only; deterministic checks and automated overrides cannot be bypassed.
- Candidate acceptance locks screenplay then candidate, revalidates stored model/check/report lineage and authority, records typed approval audit, marks the candidate accepted, and moves head atomically. Exact same-ID/payload retry is idempotent; changed same-ID payload conflicts.
- Added a forward Core migration with `genesis` / `approved` / migrated `historical` classification, approval identity/audit columns, candidate/result/approval database identity constraints, and no inferred historical principal type.
- Preserved pending pre-Phase-01 candidates by allowing an exact idempotent `save_candidate/3` replay to attach the new check snapshot before review; changed payload still conflicts.
- Migrated existing standalone Workshop review/acceptance, CLI, fake store, examples, integration/unit tests and docs. Legacy actor-string acceptance shapes only return a migration error.
- Did **not** create `packages/fount_run` or alter later-phase architecture.

Detailed A01–A06 source/test mapping and the baseline mutation-callsite audit are in [PHASE_01_IMPLEMENTATION_MATRIX.md](PHASE_01_IMPLEMENTATION_MATRIX.md).

## Overlay and docset

Delivered artifacts:

- `fount_run_phase_01_overlay.zip` — SHA-256 `0187847138ff2cb50e04a4b6d87e97aba0732025a7cda0fc06f6dfbb0b30ec9a`
- `fount_run_phase_01_docset.zip` — final hash is reported outside the archive after deterministic packaging to avoid self-reference.
- `PHASE_01_RUNTIME_QC_HANDOFF.md` — also present in this docset as `handoffs/PHASE_01_RUNTIME_QC_HANDOFF.md`.

The Fount overlay contains **53** declared source operations: 45 modifications and 8 additions, with **0 deletions**. Its copied manifest is [PHASE_01_OVERLAY_MANIFEST.json](PHASE_01_OVERLAY_MANIFEST.json), SHA-256 `88f3356983f534b0d46173bf12c3aa86f9af665e2d639c0b4b9987238f9e3c17`. The embedded overlay manifest uses the exact Repomix-body preimage hash and, for modified files, the reviewed alternate hash for the same bytes plus one terminal LF. The existing applier validated and dry-ran the archive against the extracted baseline, then applied it to a clean copy; every installed payload matched the intended final bytes. On the real checkout, use `--allow-terminal-newline` only for that explicit edge-byte case.

The docset ZIP remains a complete `fount/` tree. No docset file was deleted or renamed.

## Static checks actually run

| Check | Result |
| --- | --- |
| `python3 -m unittest scripts.tests.test_phase_one_source` | PASS — 10 tests |
| `python3 -m unittest discover -s scripts/tests -p 'test_phase_*_source.py'` | PASS — 118 tests |
| `python3 -m unittest scripts.tests.test_seal_handoff_snapshot` | PASS — 8 tests |
| Existing overlay applier dry-run against exact extracted baseline | PASS — all 53 operations accepted |
| Overlay apply to a clean baseline copy + byte-for-byte declared payload comparison | PASS |
| Broad `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` in the Repomix-extracted tree | INCOMPLETE — 126 loaded tests passed; discovery errors on `test_prune_deleted_directories` because the supplied Repomix intentionally excludes `handoff/prune_deleted_directories.py`. Retry on the full local checkout. |
| Elixir compile/format/ExUnit/Ecto/PostgreSQL/Dialyzer/Credo/docs/package builds | **NOT_RUN — no Elixir/Erlang environment** |
| Live providers / PDF / browser / human creative-quality checks | NOT_APPLICABLE to Phase 01 or NOT_RUN |

Static source inspection is not runtime certification. The new migration and all `.ex/.exs` changes require the local Elixir/PostgreSQL pass.

## Next action

Before the runtime agent receives [PHASE_01_RUNTIME_QC_HANDOFF.md](PHASE_01_RUNTIME_QC_HANDOFF.md), the user has already applied **both** ZIPs, committed and pushed the Fount and docset repositories. The runtime agent must start from that installed state, verify result hashes/commits, **not reapply either ZIP**, run and repair only A01–A06, then update state/traceability/reporting and prepare Phase 02 inputs only after the required gates pass.
