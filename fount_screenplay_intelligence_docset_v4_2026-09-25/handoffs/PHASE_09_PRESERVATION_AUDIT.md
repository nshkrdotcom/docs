# Phase 9 preservation audit

**Offline status:** additive Workshop integration is source-written; runtime preservation is pending.

## Deliberately unchanged ownership

- `packages/fount/**` canonical screenplay Core is untouched: parsing/interchange, typed edits, revision identity, persistence, review-gate semantics, search/query and source evidence remain Core-owned.
- `packages/fount_observe/**` is untouched; Phase 9 does not add provider authority or change measurement contracts.
- `packages/fount_intelligence/**` is untouched; Phase 9 consumes the Phase-8 public capability/revision surfaces rather than inventing a second analysis implementation.
- Inference and ASM are not dependencies of the bridge. Existing Workshop completion remains the only page-generation route and ASM remains host-selected behind Inference.
- No Ecto migration, database schema, lockfile, renderer dependency, submission rule, table-read/speech path or package version changes.

## Workshop seams intentionally extended

The 19-operation overlay changes only Workshop/docs/tests plus the historical Phase-8 source-contract guard. `Writing.Intelligence` is a bridge, not a new analytical domain layer. `Writing.Preparation` enriches an already-built context. `Strategy` adds packet lineage and an exact duplicate-semantic guard. `Generation` passes lineage to existing candidate compilation. `Candidate.check/4` optionally adds a post-candidate revision packet and advisory checks. Review/audition/rebase/combine surface or preserve that lineage.

`Session.services/1` still accepts the pre-existing `%{store: %Store{}, inference: %Inference.Client{}}` shape. If no `:observe` provider is present, the analysis fields explicitly report `not_run` and generation remains available. This is required preservation, not silent analytical success.

## Canonical acceptance invariant

Phase-9 checks use `severity = "advisory"`. The Core review gate remains unchanged and blocks only failed checks whose severity is `required`. No writer packet, provider probability, strategy comparison or revision-analysis result can accept or reject a screenplay revision. Existing expected-base/content-hash review and explicit writer action remain authoritative.

## Offline transport/preservation evidence

The strict overlay contains 19 operations: 4 additions, 15 modifications, zero deletions. ZIP integrity passes. The existing `handoff/apply_overlay.py` accepts all 19 against a fresh decoded copy of the supplied Fount snapshot, applies all 19, then reports all 19 `unchanged` on a second dry-run. The applied tree byte-matches the desired implementation tree after generated Python cache/overlay-backup directories are removed.

All 61 Phase 1–9 `test_phase_*_source.py` tests pass. Python compilation passes for the changed source tests and handoff helpers. The repository-wide Python suite cannot be certified from this XML snapshot because `test_prune_deleted_directories.py` imports an implementation helper omitted from the supplied snapshot; Codex must rerun it on the real checkout where Phase-8 QC recorded that tracked helper.

## Runtime preservation obligations for Codex

Run root `mix ci`, focused Workshop Phase-9 tests, full Workshop tests, compiled architecture, all repository Python tests, all four package builds, isolated Core/Workshop PostgreSQL integrations, writer accept/reject/rebase/audition/combine/materialization paths, PDF/table-read/render preservation, and at least one deterministic Observe Sandbox + mock Inference end-to-end Phase-9 session. Verify no extra provider calls occur when Observe is omitted and no analysis field can bypass explicit acceptance.

Do not start Phase 10 while repairing Phase 9.
