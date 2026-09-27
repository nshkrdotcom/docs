# Phase 8 offline source handoff — Capabilities C

**Status:** `OFFLINE_IMPLEMENTED`, not COMPLETE. **Stop before Phase 9.**

## What is delivered

The strict Fount overlay completes source coverage for capability families 9–12: Emotional/Value Movement, Theme/Meaning, Genre Lens Packs, and Revision Intelligence. It adds four installed Observe lens assets, pure capability evaluators, safe declarative-lens and genre-pack configuration, explicit before/after revision analysis, writer-playbook integration, a provider-free Phase-8 example, guides and focused tests.

## Screenplay-writing outcome

A writer can inspect practical and emotional/value condition changes without being told what a person must universally feel; compare competing thematic hypotheses with counterevidence; apply optional mystery/thriller/horror/romance/comedy/action emphasis or a project/studio hybrid pack with explicit subversions; and compare a base/candidate revision for intended effect, collateral changes, protected strengths, reader/character/relationship trajectory changes, causal ripple and story-time continuity. None of those surfaces chooses the “best” script, strategy, theme or genre conformity for the writer.

## Safe extensibility

Custom project/studio/third-party declarative lenses are data-only and compile only onto registered Observe projections plus existing `noul`/`choice`/`score` questions and `observe.answer_set`. Module/function/MFA, shell/command, file/path, endpoint/URL, credential/header/token, HTTP/DB/query, tool/callback/decoder/adapter authority is rejected. Installation and enablement are separate caller decisions. Genre packs validate trust/source, installed lens/family/playbook references, salience, writer intent/subversions and explicit resource caps; host caps dominate requests.

## Revision boundary

Revision Intelligence uses an explicit two-revision API. It keeps presentation/source changes, diegetic StoryWorld changes and story-time continuity evidence distinct. It produces target-effect/collateral/protected-strength/trajectory/causal/strategy-distinctness evidence only. Workshop generation, candidate selection and canonical acceptance remain Phase 9/Workshop responsibilities and are not implemented here.

## Actual API inspection

All five attachments were identified by contents. SystemOneSDK is 0.6.0, Inference is 0.5.0, and ASM is 0.17.1; Phase 8 adds no direct call to them. The implementation reuses inspected Fount APIs including `Fount.Screenplay.diff/2`, `Fount.Screenplay.to_fountain/2`, StoryWorld/Reader, StrategyContrast, Observe Question/Lens/Registry, and exposes new Observe/Intelligence wrappers documented in `PHASE_08_INPUTS.json`.

## Offline evidence actually executed

- Four Phase-8 lens JSON assets parse successfully.
- All 52 Phase 1–8 `test_phase_*_source.py` tests pass.
- `py_compile` passes for changed Phase-8/Phase-7 source checks and overlay/snapshot helpers.
- A pure-Phase-8 external-boundary scan finds no SystemOneSDK/Inference/ASM/FountWorkshop reference.
- Overlay ZIP integrity passes.
- Strict overlay dry-run/application against the decoded supplied Fount baseline passes, and the applied tree reproduces the desired source bytes when generated cache/backup artifacts are excluded.
- Repository-wide Python discovery runs 61 tests: 60 pass and one import error remains because the supplied XML omits the cleanup helper imported by `test_prune_deleted_directories.py`. This is recorded as an input-snapshot limitation, not a pass.

## Checks not run here

Elixir, Erlang and Mix are absent. No claim is made for formatter, compile, ExUnit, full CI, compiled architecture, Credo, Dialyzer, ExDoc, package archives, PostgreSQL integrations, Workshop acceptance/PDF/table-read gates, live providers, or human/domain review.

## Required next action

The user applies and commits `fount_phase_08_overlay.zip` and the complete updated docset. Codex starts from those applied commits, **does not reapply the overlay**, inspects the real checkout/APIs, runs the Phase-8 focused and full preservation/QC ladder, repairs only Phase 8 as needed, records actual evidence, and updates the Phase-8 records. **Do not begin Phase 9.**