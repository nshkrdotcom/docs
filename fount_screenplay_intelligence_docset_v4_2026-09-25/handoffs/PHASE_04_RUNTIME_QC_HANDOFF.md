# Codex QC handoff — Fount Phase 4

**Historical handoff, superseded:** Phase 4 runtime QC passed at Fount `cfde46c`; the phase is `COMPLETE` under D046. Its optional first-reader pilot was skipped as visible validation debt. See `PHASE_04_RUNTIME_QC_REPORT.md` and current `PROGRESS.md`. The instructions below describe the original pre-QC task and must not be rerun as a new Phase-4 implementation pass.

You are the runtime/QC agent for **Phase 4 — Temporal Views and Forward-Reader Engine**. The user has already applied and committed the Phase-4 Fount overlay and complete docset before handing the checkout to you. **Do not reapply the overlay. Do not implement Phase 5.**

## 1. Establish the applied source

Record the actual Fount and docset commits you received. Compare the applied Phase-4 files with `handoffs/PHASE_04_FILE_INVENTORY.json` and the embedded overlay manifest. The original XMLs were raw Repomix exports without current Git metadata, so do not invent a source commit for the offline input.

If the real checkout differs from the supplied decoded preimage, determine whether the difference is a legitimate user/Codex baseline repair before changing anything. Do not bypass manifest mismatches by overwriting unrelated edits.

## 2. Read the phase contracts

Before repair, read:

- `PROGRESS.md`;
- Phase 4 in `16_PHASED_IMPLEMENTATION_PLAN.md`;
- `08_TEMPORAL_AND_READER_STATE.md`;
- `19_ACCEPTANCE_CRITERIA.md`;
- `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`;
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`;
- `handoffs/PHASE_04_IMPLEMENTATION_MATRIX.md`;
- `handoffs/PHASE_04_PRESERVATION_AUDIT.md`;
- `handoffs/PHASE_04_STATIC_CHECKS.json`;
- `handoffs/PHASE_04_DOMAIN_REVIEW_PACKET.md`.

Preserve the central invariant: **presentation order, partial diegetic story time, and causality are different coordinate systems.** Reader state is first-exposure/presentation-relative. StoryWorld/Temporal state is event/story-time-qualified and may remain unknown or ambiguous.

## 3. Format, compile, test, and repair Phase 4

Use the repository's current aliases/scripts rather than assuming historical commands still match. At minimum capture exact command/exit evidence for the appropriate equivalents of:

```bash
mix format --check-formatted
mix compile --warnings-as-errors
mix test
mix ci
mix fount.architecture
python3 scripts/tests/test_phase_four_source.py
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v
bash scripts/verify_handoff.sh --offline
```

Also run package-local `fount_intelligence` checks required by the checkout, including strict Credo, Dialyzer, ExDoc warnings-as-errors and package inspection/build. Run the new targeted Phase-4 tests explicitly so failures are easy to attribute:

```bash
cd packages/fount_intelligence
mix test test/temporal_views_test.exs
mix test test/reader_forward_test.exs
mix test test/reader_story_world_differential_test.exs
mix run examples/phase_four.exs
```

Repair actual failures. Do not weaken future-leak checks, private-material exclusion, story-time ambiguity, evidence provenance, or package boundaries merely to make a test pass.

### Known offline-only issue to reconcile

In the supplied Fount XML, `scripts/tests/test_prune_deleted_directories.py` exists but `scripts/prune_deleted_directories.py` does not, so offline repository-wide Python discovery has one import error. Inspect the actual applied checkout. If the helper legitimately exists there, rerun and record. If it is still absent, determine from repository history/current policy whether it should be restored; do not silently attribute the gap to Phase 4 or fabricate a passing result.

## 4. Required Phase-4 correctness ladder

Verify, with executed tests rather than source inspection alone:

1. future presentation mutations cannot change earlier Reader snapshots;
2. later Reader evidence cannot cite unseen future screenplay material;
3. notes/boneyards/omitted material do not leak into ordinary first-reader checkpoints;
4. deterministic replay returns identical points/snapshots;
5. a later-presented flashback may change Reader interpretation while StoryWorld chronology remains independently constrained;
6. Reader character knowledge can differ from diegetic character knowledge;
7. relationship state remains directional/asymmetric;
8. setup/payoff lifecycle is inspectable without forcing one theory of dramatic quality;
9. question open/reinforce/resolve/abandon behavior is preserved;
10. Reader recomputation starts at the earliest affected presentation checkpoint and recomputes only the suffix;
11. Temporal recomputation follows the story-time connected region, not a screenplay-order suffix;
12. every public trajectory declares `presentation_relative`, `diegetic_story_time_qualified`, or `diegetic_story_time_partial` semantics as appropriate;
13. pure Temporal/Reader modules have no acquisition/persistence/provider effect dependency.

Add focused regression tests when a runtime repair exposes an uncovered bug.

## 5. Preservation gates

Phase 4 intentionally changes only Intelligence plus root/package documentation. Rerun the current repository preservation ladder for canonical Fount, Observe, StoryWorld and Workshop. Include the existing isolated database/writer acceptance/PDF/export checks the current `verify_handoff`/CI policy requires. Previous green Phase-3 evidence does not transfer to changed Intelligence source.

No new hosted-provider call is required merely to validate this pure phase. Do not spend tokens or expose screenplay text to a provider unless a current repository gate truly requires it and the user authorizes it.

## 6. Human first-reader gate

Engineering QC is not the first-reader pilot. `PHASE_04_DOMAIN_REVIEW_PACKET.md` requires rights-cleared first-exposure checkpoints and real independent readers. Do not pretend Codex review, fixtures, or model output satisfy it.

After engineering QC:

- if the real pilot is recorded, evaluate it under the docset and mark the phase accordingly;
- if engineering is green but no real pilot exists, set Phase 4 to `DOMAIN_REVIEW_PENDING`;
- mark `COMPLETE` without the pilot only if the user explicitly authorizes a visible validation-debt override, as was separately done for Phase 3.

## 7. Required QC outputs

Create/update `handoffs/PHASE_04_RUNTIME_QC_REPORT.md` with:

- exact applied source/docset commits;
- exact commands and exit results;
- every repair and why it was needed;
- post-repair file/source identity;
- Phase-4 targeted and full preservation evidence;
- architecture/package evidence;
- status of the first-reader pilot;
- remaining limitations/debt.

Update `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `PHASE_04_IMPLEMENTATION_MATRIX.md`, `PHASE_04_FILE_INVENTORY.json` if repair payloads change, and docset integrity hashes. Produce a complete corrected docset for the next four-XML handoff.

**STOP AFTER PHASE 4. Do not implement Phase 5 Diagnosis, Acquisition, or multi-pass Playbooks in this QC pass.**
