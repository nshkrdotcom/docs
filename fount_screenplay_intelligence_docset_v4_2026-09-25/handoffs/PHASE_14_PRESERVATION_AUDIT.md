# Phase 14 Preservation Audit

## Preserved contracts

- Canon still advances only through the existing candidate review/acceptance path. `Research` and `NoteTriage` write session progress only; note-linked edits become ordinary candidates and remain noncanonical until acceptance.
- No new database migration or second persistence layer is introduced. Research/note records reuse the existing JSONB session-progress contract; candidate lineage reuses existing provenance.
- Existing manual candidates remain compatible because new `addresses_notes` and `intelligence_lineage` options default to the previous empty values.
- Existing comparison behavior remains stable-ID/page-derived; Phase 14 adds `consequence_review` without replacing action/language/transition/dialogue deltas. Candidates without Phase-14 lineage report `not_declared` rather than failing.
- Existing ReviewGate/Acceptance authority, stale-base refusal and Rebase mechanisms remain unchanged. The new tests exercise them instead of bypassing them.
- `Fount.Screenplay.undo/2` remains the rollback mechanism; no destructive “restore” API is added.
- Research source text is always data with `instruction_authority: none`. Provider-export permission is explicit and defaults false. No web search, upload, shell, connector or provider call is hidden in the research helper.
- Research status does not collapse fact and fiction: disputed/unverified claims and deliberate fictionalization remain different records.
- Note disagreement is not synthesized into a compromise. Raw notes remain separate and the writer can accept the concern while rejecting the suggested fix.
- Reanchoring uses stable identity/exact text evidence only. Similar wording is not enough to relocate a note automatically after a split/merge.
- Local/sequence consequence declarations do not authorize broader edits. Actual changed scenes are computed independently and unrelated rewritten scene IDs are surfaced.
- The package DAG is unchanged. Workshop still uses Inference/ASM for generation; analytical measurements remain Observe/SystemOneSDK. Phase 14 adds no dependency.
- Phase 13 cinematic pass/voice/rehearsal behavior is not replaced or reinterpreted. Phase 12 discovery/manual-candidate behavior remains the same except that manual candidates may optionally carry note lineage.
- Phase 15 read/share/usefulness work is not implemented.

## Runtime proof still required

Codex must format/compile the actual applied checkout, run all new ExUnit tests, run the PostgreSQL durability test, verify stale/rebase/undo behavior against real Store/Persistence, and run full established CI/preservation/package gates. Any repair must preserve the semantics above and update file identities separately from the original overlay hashes.

The supplied source snapshot omits `scripts/prune_deleted_directories.py` while retaining its Python test; that causes one offline full-discovery import error. Do not confuse this source-export omission with a Phase-14 implementation defect if the actual checkout contains the helper, as the Phase-13 runtime record says it did.