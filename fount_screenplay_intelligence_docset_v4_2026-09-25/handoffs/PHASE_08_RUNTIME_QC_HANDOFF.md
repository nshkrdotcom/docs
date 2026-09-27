# Codex runtime-QC handoff — Fount Phase 8 Capabilities C

You are the runtime-QC/repair agent for **Phase 8 only**. The user has already applied and committed the Fount overlay and complete docset. **Do not reapply the overlay. Do not implement Phase 9.**

## 1. Establish the applied state

Read `PROGRESS.md`, `DECISIONS.md` (especially D046), Phase 8 in `16_PHASED_IMPLEMENTATION_PLAN.md`, families 9–12 in `11_CAPABILITY_CATALOG_12_FAMILIES.md`, `14_WORKSHOP_INTEGRATION_AND_REVISION_INTELLIGENCE.md`, `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`, relevant Phase-8 acceptance rows/sections, and every `handoffs/PHASE_08_*` source-delivery record. Inspect the actual checkout and actual APIs; do not trust this source snapshot where the real checkout differs.

Record the applied Fount commit/tree and docset commit. Verify the 37 delivered paths against `PHASE_08_FILE_INVENTORY.json` before repair. The supplied XML omitted the cleanup helper imported by `test_prune_deleted_directories.py`; the prior Phase-7 runtime report says the real checkout retained the tracked helper and all repository-wide Python tests passed. Confirm/preserve the real helper instead of recreating it from guesswork.

## 2. Format, compile and run focused Phase-8 tests

Use repository aliases where they supersede these commands. At minimum:

```bash
mix format --check-formatted
mix compile --warnings-as-errors

cd packages/fount_observe
mix test test/phase_eight_lens_assets_test.exs

cd ../fount_intelligence
mix test   test/phase_eight_architecture_test.exs   test/phase_eight_capabilities_test.exs   test/phase_eight_packs_test.exs   test/phase_eight_runner_test.exs
mix run examples/phase_eight.exs
```

Run the repository-wide Python source tests on the real checkout as well.

## 3. Prove Phase-8 correctness

Repair and verify all of the following before marking Phase 8 complete:

1. `Fount.Intelligence.Capabilities.families/0` contains exactly all twelve intended capability families, with families 9–12 named `emotional_value_movement`, `theme_meaning`, `genre_lens_packs`, and `revision_intelligence`;
2. the four new installed lens assets validate through the existing Observe schema and remain content-identifiable;
3. Emotional/Value output is multidimensional condition/value/event-reaction evidence; it does not invent a universal human-emotion model or a screenplay-quality score;
4. Theme/Meaning supports competing hypotheses, support and counterevidence, motif/value/choice/consequence links and writer-intent comparison; it does not emit an authoritative theme or depth score;
5. mystery/thriller/horror/romance/comedy/action are initial optional core packs and are disabled by default; they are not treated as the closed genre-support list;
6. project/studio/third-party pack validation checks trust/source, installed lens/family/playbook references, salience weights, writer intent/subversions/opt-outs, and explicit resource requests that cannot exceed host caps;
7. custom declarative lenses accept only capability-limited data through registered Observe projections, existing `noul`/`choice`/`score`, `observe.answer_set`, safe context/resource policy and supported calibration refs; reject executable/module/function/MFA/shell/path/URL/endpoint/credential/header/token/HTTP/DB/query/tool/callback/decoder/adapter authority;
8. install and enable are separate for lenses and packs; a custom pack can reference an explicitly enabled safe custom lens through the caller-owned catalog;
9. Genre analysis applies pack intent/subversion as context and does not turn a deliberately broken convention into a universal defect or genre-conformity score;
10. Revision Intelligence requires explicit before/after screenplay models; ordinary single-screenplay playbook dispatch must not fake a revision comparison;
11. the revision packet reports exact structural/source changes, intended target effect, collateral risks, protected-strength regressions, state transitions, separate character and relationship trajectory diffs, Reader trajectory diffs, causal ripple and story-time continuity evidence;
12. presentation/source change, diegetic StoryWorld change, and story-time continuity remain separate; non-linear presentation must not be “corrected” into chronology;
13. Reader comparison detects changed retained state as well as added/removed keys;
14. strategy distinctness may compare 2–5 supplied strategies but does not rank/select a winner;
15. the existing ten writer-playbook IDs remain; prior `character_trajectory` default routing remains unchanged and Emotional/Value is opt-in; genre work is opt-in through an explicit pack;
16. generated `candidate` remains nil and Phase 8 cannot write/accept canonical pages; Workshop creative integration remains Phase 9;
17. no new direct SystemOneSDK, Inference or ASM dependency leak exists; provider acquisition remains Observe-owned and generation remains Workshop/Inference-owned;
18. no Phase-9 implementation appears in this pass.

## 4. Full preservation/QC ladder

After focused repairs pass, run the repository's normal full quality/preservation gates across all four packages/root: format, warnings-as-errors compile, full `mix ci`, compiled architecture, strict Credo, Dialyzer, ExDoc and intended package/archive inspection.

Rerun representative regressions for StoryWorld, Temporal/Reader, Diagnosis/WriterRunner, and Phase-6/7 capability runners. Run canonical Core lossless/interchange/edit/persistence coverage and isolated PostgreSQL Core + Workshop integrations. Re-run writer acceptance/rejection and representative Develop/rewrite/rebuild/pass/recover flows plus PDF/export/table-read/audio checks supported by the checkout. Preserve existing behavior.

A live provider call is not required merely to prove the deterministic Phase-8 paths unless current repo policy/user authorization requires it. If one runs, record actual endpoint/provider/model identity and never log secrets.

## 5. Optional human review

`PHASE_08_DOMAIN_REVIEW_PACKET.md` is optional under D046 and assumed skipped unless commissioned. If skipped, keep it visible as validation debt and make no human-audience, emotional-validity, genre-conformity, theme-authority or writer-usefulness claim.

## 6. Repair and accounting rules

Repair Phase-8 defects directly in the applied checkout and rerun affected focused/full gates. Do not preserve source-delivery mistakes for compatibility. Update `PHASE_08_FILE_INVENTORY.json` with post-repair hashes/bytes; record actual commands/defects/repairs in `PHASE_08_RUNTIME_QC_REPORT.md`; update `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, `README.md`, `AGENT_START_HERE.md`, the Phase-8 plan checkpoint, `PHASE_08_DOCSET_HASHES.json`, and `SHA256SUMS.txt`.

Mark Phase 8 `COMPLETE` only when applicable non-human engineering/preservation gates pass. Optional human review may remain validation debt under D046. Then **stop before Phase 9** and return final Fount/docset commit identities plus the runtime report.
