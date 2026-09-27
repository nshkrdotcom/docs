# Codex runtime-QC handoff — Fount Phase 7 Capabilities B

You are the runtime-QC/repair agent for **Phase 7 only**. The user has already applied and committed the Fount overlay and complete docset. **Do not reapply the overlay. Do not implement Phase 8.**

## 1. Establish the applied state

Read `PROGRESS.md`, `DECISIONS.md` (especially D046/D047), Phase 7 in `16_PHASED_IMPLEMENTATION_PLAN.md`, families 5–8 in `11_CAPABILITY_CATALOG_12_FAMILIES.md`, section O in `19_ACCEPTANCE_CRITERIA.md`, `08_TEMPORAL_AND_READER_STATE.md`, and every `handoffs/PHASE_07_*` source-delivery record. Inspect the actual checkout; do not trust an XML snapshot over the applied repository.

Record the applied Fount commit/tree and docset commit. Verify the 30 applied Phase-7 paths against `handoffs/PHASE_07_FILE_INVENTORY.json` / the embedded overlay manifest before repair. The source-writing XML omitted the historical `scripts/prune_deleted_directories.py` helper while retaining its test; the prior Phase-6 runtime report says the real checkout contained that helper. Confirm and preserve the real file rather than recreating it from guesswork.

## 2. Format, compile and run focused Phase-7 tests

Use the repository's actual aliases where they supersede these commands. At minimum:

```bash
mix format --check-formatted
mix compile --warnings-as-errors

cd packages/fount_observe
mix test test/phase_seven_lens_assets_test.exs

cd ../fount_intelligence
mix test \
  test/phase_seven_architecture_test.exs \
  test/phase_seven_capabilities_test.exs \
  test/phase_seven_runner_test.exs
mix run examples/phase_seven.exs
```

Run the repository-wide Python source checks too; on the real checkout the cleanup helper should resolve the XML-only import gap. If it does not, investigate from real history/source rather than inventing an implementation.

## 3. Prove Phase-7 correctness

Repair and verify all of the following before marking Phase 7 complete:

1. exactly four new installed Phase-7 family/lens pairs: `audience_reader_experience` / `audience.reader_experience`, `sequence_movement` / `sequence.movement`, `dialogue_interaction` / `dialogue.exchange`, `setup_payoff_motifs` / `setup_payoff.motifs`;
2. Audience first-exposure state comes from supplied validated Reader events and the strict-forward Reader; later evidence cannot leak into earlier checkpoints; absent `reader_events` yields explicit partial coverage rather than a fabricated trajectory;
3. question, expectation/promise/threat, suspense, curiosity, surprise, comprehension-risk and forward-pull state remain separate inspectable outputs, not one audience score;
4. Sequence reports a per-scene state vector and movement density while keeping objective progress, constraint/stakes escalation, knowledge/relationship/choice changes, tactic shifts, reversals, local outcomes and handoffs separately inspectable;
5. Sequence exposes both presentation and story-time views without converting source adjacency into chronology; the non-linear flashback fixture must preserve the distinction;
6. Sequence diagnoses retain actual measurement IDs/evidence support after the source-delivery lineage fix;
7. Dialogue shell derives adjacent canonical turns from character-cue + dialogue elements and attaches exact cue/dialogue evidence for both turns; no line-only speaker invention;
8. dialogue context accepts only the installed neutral typed slots (`known_facts`, `speaker_beliefs`, `relationship_state`, `prior_turns`) through `ContextBuilder.validate/2`; unknown or malformed slots fail before provider dispatch;
9. Dialogue outputs preserve response/evasion/redirect/attack/bargain/reveal/conceal, subtext, exposition/dramatic work, tactic, status/leverage, repetition, voice and exchange outcome distinctions; `dialogue_pass` composes the existing relationship family rather than duplicating it;
10. Setup/Payoff uses the existing Temporal ledger and StoryWorld relations, exposes setup/reinforce/transform/pay/subvert/abandon and motif/callback/broken-chain candidates, and reports presentation relation separately from story-time relation;
11. specifically prove the fixture case where the watch's origin is presented after the initial clue but is earlier in story time; do not “correct” the screenplay into chronological order;
12. findings remain source-grounded hypotheses with support/uncertainty/limitations; intentional stillness, repetition, exposition, prediction, ambiguity, subversion, or unresolved setup are not universal defects;
13. writer packets keep generated `candidate` nil; Phase 7 analyzes but does not generate or accept pages;
14. no new direct SystemOneSDK, Inference or ASM boundary leak exists; measurement acquisition remains Observe-owned and creative generation Workshop/Inference-owned;
15. Phase-8 Emotional/Value, Theme, Genre-Pack and Revision-Intelligence families are not implemented by this pass.

## 4. Full preservation/QC ladder

After focused repairs pass, run the repository's normal full quality and preservation gates for all four packages and the root workspace: format, warnings-as-errors compile, full `mix ci`, compiled architecture, strict Credo, Dialyzer, ExDoc and package/archive inspection.

Rerun representative regressions from every layer Phase 7 depends on: StoryWorld, Temporal/Reader, Diagnosis/WriterRunner, and Phase-6 capability/runner tests. Run canonical Core lossless/interchange/edit/persistence coverage and the isolated PostgreSQL Core + Workshop writing integrations. Re-run writer acceptance/rejection and representative develop/rewrite/rebuild/pass/recover flows plus PDF/export/table-read/audio checks supported by the checkout. Preserve all existing functionality.

A live provider call is not required merely to prove these deterministic Phase-7 paths unless the current repo policy or user authorization requires it. If any live call is run, record real endpoint/provider/model identity and never log secrets.

## 5. Optional human review

`PHASE_07_DOMAIN_REVIEW_PACKET.md` is optional under D046 and assumed skipped unless actually commissioned. Its absence does not block engineering completion. If skipped, record validation debt and make no human-reader-agreement or writer-usefulness claim.

## 6. Repair and accounting rules

If runtime QC finds defects, repair Phase 7 directly in the applied checkout and rerun affected focused plus full gates. Do not preserve source-delivery mistakes for compatibility. Update:

- `handoffs/PHASE_07_FILE_INVENTORY.json` with post-repair hashes/bytes;
- `handoffs/PHASE_07_STATIC_CHECKS.json` only as needed to keep historical offline evidence clear;
- a new `handoffs/PHASE_07_RUNTIME_QC_REPORT.md` with actual commands, exit results, defects and repairs;
- `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, `README.md`, `AGENT_START_HERE.md`, and the Phase-7 checkpoint in `16_PHASED_IMPLEMENTATION_PLAN.md`;
- `handoffs/PHASE_07_DOCSET_HASHES.json` and `SHA256SUMS.txt` after all docset edits.

Record the applied Fount/docset commits and final repair commit/tree. Mark Phase 7 `COMPLETE` only when applicable non-human engineering/preservation gates pass. Optional human review may remain visible debt under D046. Then **stop before Phase 8** and return the repaired commit identities and runtime report to the user.
