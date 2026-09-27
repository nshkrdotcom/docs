# Codex runtime-QC handoff — Fount Phase 6 Capabilities A

You are the runtime-QC/repair agent for **Phase 6 only**. The user has already applied and committed the Fount overlay and complete docset. **Do not reapply the overlay. Do not implement Phase 7.**

## 1. Establish the applied state

Read `PROGRESS.md`, `DECISIONS.md` (especially D046/D047), `16_PHASED_IMPLEMENTATION_PLAN.md` Phase 6, `11_CAPABILITY_CATALOG_12_FAMILIES.md`, `19_ACCEPTANCE_CRITERIA.md`, and all `handoffs/PHASE_06_*` records. Inspect the actual checkout rather than trusting the source-writing environment. Record the applied Fount commit/tree and docset commit.

Verify that the applied Phase-6 payload matches `handoffs/PHASE_06_FILE_INVENTORY.json` / the embedded overlay manifest before making repairs. If the real checkout contains the historical `scripts/prune_deleted_directories.py` helper absent from the XML export, preserve the real file; do not overwrite it from guesswork.

## 2. Format, compile and focused Phase-6 tests

Run repository-native formatting/compile gates first, repairing source as required. At minimum exercise:

```bash
mix format --check-formatted
mix compile --warnings-as-errors

cd packages/fount_observe
mix test test/phase_six_lens_assets_test.exs

cd ../fount_intelligence
mix test \
  test/phase_six_architecture_test.exs \
  test/phase_six_capabilities_test.exs \
  test/phase_six_runner_test.exs
mix run examples/phase_six.exs
```

Use the repository's actual root/package aliases where they supersede these illustrative commands.

## 3. Phase-6 correctness ladder

Repair and prove all of the following before marking Phase 6 complete:

1. exactly four installed Phase-6 families/lenses: Scene, Agency/Causality, Character, Relationship;
2. semantic measurement state actually includes the exact selected screenplay excerpts being judged, while the same material remains attached as current-revision evidence/provenance;
3. scene/fragment/provider caps produce explicit partial coverage, never a false clean result;
4. Scene Engine exposes objective/opposition/stakes/urgency/tactics, turn candidates, decision/reveal/consequence, entry/exit delta, surrounding-sequence contribution and handoff/counterfactual support;
5. Agency chains come only from explicit StoryWorld causal edges; alternate support, causal reach, consequence latency and counterfactual removal are preserved; presentation distance never creates causality;
6. Character exposes goals, belief/knowledge state, commitments, adaptation, decisions and arc hypotheses without requiring transformation, and keeps reader-visible presentation separate from established story-time relations;
7. Relationship supports selected pairs or groups, preserves directional/asymmetric state, covers the documented dimensions, and keeps non-linear presentation separate from diegetic relationship movement;
8. diagnoses remain evidence-backed hypotheses with counterevidence/limitations and do not turn screenplay conventions into universal rules;
9. actual `Fount.Observe.Sandbox` deterministically exercises all four families through `scene_doctor`, `character_trajectory` and `relationship_pass`;
10. writer packets keep generated `candidate` nil; Phase 6 analyzes but does not generate/accept pages;
11. no new direct SystemOneSDK, Inference or ASM dependency leaks into Phase-6 Intelligence; provider acquisition stays behind Observe and creative completion stays Workshop-owned;
12. no Phase-7 family (`audience_reader_experience`, `sequence_movement`, `dialogue_interaction`, `setup_payoff_motifs`) is implemented.

Pay special attention to the synthetic non-linear fixture: the years-earlier corridor material is presented after the present office scene, while explicit StoryWorld constraints place it earlier. Character/relationship logic must not fabricate a chronological regression from presentation order.

## 4. Full preservation/QC ladder

Run the repository's normal full CI for all four packages and the root workspace, then the architecture gate, strict Credo, Dialyzer, ExDoc and package/archive inspection expected by the current repo. Rerun Phase-3/4 StoryWorld/Temporal/Reader and Phase-5 Diagnosis/WriterRunner tests because Phase 6 builds on them.

Also rerun the existing isolated PostgreSQL/Core + Workshop writing integrations, acceptance/rejection behavior, PDF/export/table-read gates, and representative writer flows. Preserve all previously working functionality.

A live provider call is not required merely to prove the deterministic Phase-6 Sandbox path unless the repository's current QC policy or user authorization explicitly requires one. If a live call is run, record the real provider/model identity and do not expose secrets.

## 5. Optional human review

`PHASE_06_DOMAIN_REVIEW_PACKET.md` is optional under D046 and is assumed skipped unless actually commissioned. Its absence does not block engineering completion. If skipped, record validation debt and make no human-usefulness claim.

## 6. Repair/accounting rules

If QC requires source repairs, make them directly in the applied checkout, rerun affected focused and full gates, and update:

- `handoffs/PHASE_06_FILE_INVENTORY.json` with post-repair file hashes;
- `handoffs/PHASE_06_STATIC_CHECKS.json` / a new `PHASE_06_RUNTIME_QC_REPORT.md` with actual commands/results;
- `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, `README.md`, and Phase-6 checkpoint text;
- `handoffs/PHASE_06_DOCSET_HASHES.json` and `SHA256SUMS.txt`.

Mark Phase 6 `COMPLETE` only when applicable non-human engineering/preservation gates pass. Keep optional human review as validation debt. Then **stop before Phase 7** and return the repaired commit identities/report to the user.
