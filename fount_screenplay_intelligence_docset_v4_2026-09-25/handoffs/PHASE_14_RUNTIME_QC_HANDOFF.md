# Fount Phase 14 — Codex Runtime QC Handoff

You are completing **Phase 14 only: Research, Notes, and Consequential Revision**. The user has already applied and committed the supplied Fount overlay and updated docset. **Do not reapply the overlay. Do not start Phase 15.**

## Read first

Read `PROGRESS.md`, documents 16 and 33–36, `DECISIONS.md` D054, `handoffs/PHASE_14_INPUTS.json`, `PHASE_14_IMPLEMENTATION_MATRIX.md`, `PHASE_14_PRESERVATION_AUDIT.md`, `PHASE_14_STATIC_CHECKS.json`, and `PHASE_14_FILE_INVENTORY.json`. Treat source-delivery status as `OFFLINE_IMPLEMENTED`, not proof of Elixir/runtime behavior.

## Verify the applied state

1. Record Git status, commit/tree and toolchain versions.
2. Before repair, verify every Phase-14 path against `PHASE_14_FILE_INVENTORY.json`. Preserve supplied overlay result hashes separately from any repair hashes.
3. Confirm the actual dependency resolution. Phase 14 should add no dependency: provider-free note experiments use existing `CandidateAPI.manual`; generation stays Workshop -> Inference -> ASM; measurement stays Workshop/Intelligence -> Observe -> SystemOneSDK.
4. Confirm no Phase-15 read/share/usefulness implementation slipped into the overlay.

## Compile and repair, do not merely report

Run formatter and warnings-as-errors compile first. Repair genuine Phase-14 source defects. Do not invent compatibility APIs, second canonical-edit paths, fuzzy note anchoring, automatic web access, hidden upload, or new persistence tables just to satisfy tests. Reuse Session/Store, Candidate/Review/Acceptance, `Screenplay.diff`, Rebase and Undo unless actual runtime evidence proves a minimal change is necessary.

## Focused Phase-14 requirements

Run the four `test/writer_workflows/phase_fourteen_*.exs` files and inspect behavior rather than only green status.

- **W07 / A08 — research:** the quoted instruction stays untrusted source data and cannot authorize an upload or tool call; disputed date stays disputed; deliberate fictionalization is separate; provider export remains denied; no unavailable web/search/citation is invented.
- **W08 / A06 — notes:** both conflicting raw notes retain source and original draft; no merged instruction is created; concern/treatment decisions remain independent; stable identity/exact text yields exact/relocated; duplicate exact text after split yields ambiguous; no match yields orphaned. Do not add fuzzy auto-relocation to make the test pass.
- **W09 / A07 — consequence-aware revision:** the note decision produces an ordinary candidate. The spare-key reveal moves early; only approved scenes change; the unrelated scene stays untouched. Supported dependency, hypothesis, unresolved work, checked scenes and not-analyzed scenes remain separate. Actual changed-scene evidence must come from `Screenplay.diff`, never candidate self-description.
- **Concurrent edit / A10 preservation:** accept one sibling candidate, prove the other cannot overwrite the newer head, inspect Rebase conflict output, and prove `Screenplay.undo/2` restores exact prior Fountain bytes.

Then run `integration/phase_fourteen_research_notes_durability_test.exs` against disposable PostgreSQL. Confirm research + note decisions survive a fresh Session/Store read, the note-linked candidate is reviewable, and canonical head remains unchanged before acceptance.

## Preservation / full engineering ladder

After focused repairs pass, run the repository's established gates: full `mix ci`; compiled architecture; strict Credo; Dialyzer; ExDoc warnings-as-errors; Python source suite; four `FOUNT_PACKAGE_BUILD=1 mix hex.build` packages; disposable PostgreSQL migrations and integrations; relevant Phase-12/13 discovery/manual-candidate/voice/rehearsal/PDF/table-read regressions; and any existing acceptance/rebase tests that cover stale writes and rollback.

The offline XML export omits `scripts/prune_deleted_directories.py` while including its test. The Phase-13 runtime record says the actual checkout contains it and Python passed there. Verify the real checkout instead of adding an unrelated helper solely from this handoff.

No live provider call or web search is required to prove deterministic Phase-14 engineering behavior. If external research/live calls are separately authorized, report them as distinct evidence. Human/domain review in `PHASE_14_DOMAIN_REVIEW_PACKET.md` is optional under D046 and assumed NOT_RUN unless commissioned.

## Completion and docset update

Record every actual command/result and repair. Update `PHASE_14_RUNTIME_QC_REPORT.md`, inventory current hashes if repairs changed them, `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, document 36, checksum indexes, and decisions only if a real new decision was made. Keep original overlay identities intact as source-delivery evidence.

Mark Phase 14 `COMPLETE` only if applicable non-human gates pass. Leave any unrun human/live/external research work explicitly NOT_RUN. **Stop before Phase 15.**
