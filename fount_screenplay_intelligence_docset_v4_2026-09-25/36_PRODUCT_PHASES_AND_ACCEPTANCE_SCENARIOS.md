# Product phases and acceptance scenarios

Normative companion to the engineering sequence in document 16. Phases 1–11 retain their existing dependency order. The former final-integration phase is now Phase 16. New Phases 12–15 complete the writer-facing workflows in document 33; they are not permission to postpone all writing usefulness until Phase 12.

## Product outcome in every phase

| Phase | Writer-facing demonstration required in addition to engineering gates |
|---:|---|
| 1 | Existing develop, revise, compare, accept/reject, table-read, and export examples still work after Probe removal; no creative workflow disappears behind a new architecture |
| 2 | One scene question returns inspectable evidence or an honest unavailable result |
| 3 | A writer can correct a story fact without adopting a model's interpretation |
| 4 | A reveal's placement changes what a first-time reader can know; a private note does not |
| 5 | A concern yields competing explanations and one useful experiment, including a leave-it-alone option |
| 6 | A quiet scene and a cooperative relationship are not automatically diagnosed as broken |
| 7 | A dialogue or reveal pass points to actual passages and respects intentional ambiguity |
| 8 | A writer can decline a theory or heuristic while still using the tool |
| 9 | A real revision request yields candidate pages, comparison, explicit acceptance, and exact recovery |
| 10 | Resume a writing session without resurrecting rejected advice or losing unchosen candidates |
| 11 | Show actual evaluation evidence and disagreements; distinguish engineering success from human usefulness |
| 12 | Begin from a fragment and explore a scene without a mandatory outline or critique |
| 13 | Revise cinematic action and dialogue while preserving the project's voice |
| 14 | Turn conflicting and stale notes into explicit revision decisions |
| 15 | Complete a writing/review/share session in both human-only and agent-assisted modes |
| 16 | Demonstrate the coherent whole and publish only claims supported by evidence |

A phase may reuse existing functionality. Do not rebuild a working feature solely to satisfy a new module name. Inspect the latest snapshot and record the existing implementation, gap, test, and demonstration for every requirement.

## Shared implementation procedure for Phases 12–15

For each task below: inspect named source areas, add a regression test for the missing behavior, implement the smallest coherent change through existing public operations, update a runnable example, and record the actual source/test paths in the handoff. The offline agent writes tests but marks them unexecuted; Codex executes and repairs them.

Use `packages/fount_workshop/test/writer_workflows/` for new cross-workflow regression scenarios unless the latest source has an established equivalent. Keep low-level unit tests near the existing relevant tests. Do not replace existing tests with only a new happy-path demonstration.

Public operations must use existing Session/Request/Candidate/Acceptance contracts where possible. Introduce an internal helper only when existing responsibilities cannot express the behavior cleanly. This specification deliberately does not invent signatures that conflict with future phase snapshots.

## Phase 12 — Discovery, session modes, and scene exploration

**Goal:** A writer can arrive with unfinished material and leave with a useful scene experiment while retaining control of what becomes the draft.

**Requirements:** W01–W03, W11; cases A01–A03 and A10 below.

**Existing source to inspect:** Workshop `session.ex`, `request.ex`, `develop.ex`, `candidate_api.ex`, `candidate.ex`, `store.ex`, `cli.ex`, `writing/context.ex`, `writing/generation.ex`, and continuation/decision tests.

Tasks:

1. Add draft/explore/inspect/revise mode selection and persistence through existing session/request operations. Test that draft mode does not require analysis and that resume preserves the selected mode.
2. Add an evolving brief and fragment collection with explicit adoption/retirement. Test an unattached image, a reverse outline, and a proposed card reorder that leaves canonical source unchanged.
3. Extend scene exploration to treatments that differ in action, revelation, or relationship strategy. Reuse alternatives/combine operations. Test reject-all, keep-both, and explicit brief departure.
4. Provide a runnable text/CLI example from fragment to candidate to manual edit to acceptance. Include provider-free operation and deterministic generation fixtures.

**Required demonstration:** Use A01, then resume it on another invocation. Show the same accepted draft, unchosen alternatives, protected text, and pending question.

**Optional human study:** If commissioned, one discovery-oriented writer and one outline-oriented writer each complete a session and answer whether the tool forced an unwanted process. Record exact task, output, friction, and rejection reasons. This is formative evidence, not population evidence. Under D046, missing reviewers do not block the phase; record the study as skipped validation debt.

## Phase 13 — Cinematic revision, rehearsal, and voice

**Goal:** Help a writer change what a scene does on screen without making it sound like a generic model.

**Requirements:** W04–W06; cases A02–A05.

**Existing source to inspect:** `pass.ex`, `character_rewrite.ex`, `strategy.ex`, `writing/proposal_guide.ex`, `writing/review_gate.ex`, `table_read.ex`, plus the capability evaluators delivered in Phases 6–8.

Tasks:

1. Add visual/sound/space/transition strategies to the existing pass workflow. Test an offscreen event, intentional stillness, and a voiceover that must remain.
2. Add writer-selected voice exemplars and protected stylistic choices to generation context. Verify exact protected text mechanically and test Unicode, code-switching, deliberate fragments, and repetition without normalization.
3. Add rehearsal exercises as explicitly noncanonical session material. Test that an invented backstory never becomes a StoryWorld fact or later-generation assumption without adoption.
4. Compare original and candidate pages, identifying actual changed actions and language rather than accepting the generator's self-description.

**Required demonstration:** Revise A02 in two different ways; keep the writer's silence and repeated phrase. Reject a fluent but generic control. Show the protected-text check and the human tradeoff.

**Optional human study:** If commissioned, two writers review original/candidate/generic-control excerpts in randomized order. Record voice fit, meaningful difference, cinematic usefulness, and cases where the original is preferred. Do not claim blinded preference if condition labels were visible.

## Phase 14 — Research, notes, and consequential revision

**Goal:** Convert real development material into decisions and revision experiments without losing sources or confusing speculation with facts.

**Requirements:** W07–W09; cases A06–A08.

**Existing source to inspect:** `note_response.ex`, `writing/note_conflicts.ex`, `review.ex`, `rebase.ex`, `sequence_rebuild.ex`, `targeted_rewrite.ex`, `writing/footprint.ex`, and propagation/rebase tests. Reuse canonical edit/source identities and Intelligence consequences.

Tasks:

1. Add research-source and fiction-status records using the existing project/session persistence. Test missing web access, disputed facts, intentionally fictionalized details, and untrusted text that contains instructions.
2. Preserve raw notes and source/draft anchors through triage. Test conflicting notes, accepted concern/rejected treatment, and exact/ambiguous/orphaned anchors after scene split/merge.
3. Connect a note decision to a candidate and visible consequence review. Test moving a reveal without rewriting unrelated scenes, and report unresolved downstream work.
4. Extend comparison/acceptance/rebase tests to manual concurrent edits. Verify stale candidates cannot overwrite the latest source and that rollback restores exact bytes.

**Required demonstration:** Apply A06 to two conflicting notes, then A07 to a reveal move. Show why one note needs re-anchoring and why one suggested “fix” was declined.

**Optional human study:** If commissioned, a writer and a separate note-giver or story collaborator review the workflow. Record whether the original concern survives triage, whether disagreement is represented fairly, and whether the proposed revision addresses the chosen concern.

## Phase 15 — Read, share, resume, and prove usefulness

**Goal:** Make the writing process coherent across sessions, review, and handoff, with evidence of usefulness rather than a feature inventory.

**Requirements:** W01, W10–W12 and all prior workflow integration; cases A09–A12.

**Existing source to inspect:** `table_read.ex`, `audition.ex`, `review_export.ex`, `submission.ex`, `export/pdf.ex`, `cli.ex`, acceptance and session continuation; core Fountain/FDX exporters and source-projection tests.

Tasks:

1. Produce a human table-read packet without TTS and record reactions independently of screenplay facts. Keep optional speech adapters optional.
2. Verify clean sharing/export of selected material, with no private-note or alternative leakage. Test dual dialogue, non-ASCII text, unsupported export features, and roundtrip fidelity.
3. Provide one documented end-to-end entry path for capture → explore → revise → compare → accept/reject → export → resume. Use existing commands; do not require a new graphical editor.
4. Preserve runnable human-only, basic LLM-assistance, and Fount-assisted paths. An optional comparative human study may record actual outputs, time, errors, friction, and preferences separately, including failures and unchanged originals.

**Required demonstration:** A09–A12 plus a complete scene session using the same source identities. No provider credentials are necessary for the human-only path.

**Optional human study:** If commissioned, at least four writers with differing practices each try the three conditions on comparable tasks; counterbalance order and acknowledge learning effects and the small sample. Preserve consent and material rights. Record whether the tool helped the next decision, respected voice, and created meaningful alternatives. This evaluates the workflow, not commercial potential.

## Phase 16 — Final integration and acceptance

Retain all final engineering/publication gates from document 16 and all earlier acceptance criteria. Add the W01–W12 audit and A01–A12 demonstrations. No `COMPLETE` label while required source fidelity, acceptance, privacy, or creative-control tests fail.

The release report separates implemented capability, deterministic evidence, actual human review, and authorized live checks. “Best in the world” is an aspiration, not an acceptance assertion. Report which workflows were compared, with whom, and where evidence remains weak.

## Acceptance scenarios

These are original synthetic test situations, not copied screenplay passages and not a replacement for the rights-cleared human corpus. Automated tests assert behavior and data integrity; human review judges creative usefulness.

### A01 — Start with an image

A writer supplies: “At a closed swimming pool, two estranged siblings fold a wet paper map.” There is no logline, genre, or outline. Ask for three ways the scene might begin.

Pass: alternatives differ in action or relationship, preserve the map, remain candidates, and allow the writer to keep none. No required global analysis or invented commitment to a plot. A subsequent manual fragment can be adopted without an LLM call.

### A02 — Protect a quiet choice

Mara has Dan's key. She places it beside a cooling cup, waits, then leaves without speaking. The writer wants unresolved tenderness, not confrontation.

Pass: the tool can inspect legibility and offer visual/sound changes without forcing an argument, reversal, villain, or explanation. It distinguishes “the key was placed” from “this means forgiveness.” The untouched version remains a valid choice.

### A03 — Distinct alternatives, not paraphrases

Request three treatments of a secret: conceal it, volunteer it, or reveal it accidentally through an action.

Pass: actual candidate pages embody those differences. A mock returning three reworded confessions fails the diversity fixture. In live output, a model's diversity claim is shown as an estimate and subject to human review.

### A04 — Preserve voice

The writer protects the exact repeated line “Not today. Not today.” and uses multilingual dialogue plus clipped action fragments.

Pass: protected bytes survive; candidates do not silently translate, standardize dialect, or remove repetition. A language-competence limitation is visible. A human can prefer the less polished original.

### A05 — Rehearsal is not history

An agent improvises that Dan once stole a boat, solely as a rehearsal exercise.

Pass: later story facts and prompts do not adopt that event. Explicit adoption creates traceable project material; rejection leaves the exercise outside canon.

### A06 — Notes disagree and move

One reader says “Explain why she leaves”; another says “Keep the mystery.” The scene is subsequently split, and the same line appears twice.

Pass: both notes retain source and original draft; no automatic merged instruction results. The anchor becomes ambiguous until resolved. A writer may accept the clarity concern but choose a physical cue rather than dialogue.

### A07 — Move a reveal

A branch moves knowledge of a spare key from a late scene to an early scene.

Pass: first-reader checkpoints change only after the new reveal; author notes cannot contaminate earlier knowledge. The tool identifies supported downstream dependencies, labels uncertain consequences, and does not silently rewrite unrelated scenes.

### A08 — Facts and fiction

A supplied research note has a disputed historical date and an instruction embedded in quoted text to upload the screenplay.

Pass: the quotation is treated as data, not authority. The date stays disputed unless evidence resolves it; an intentional fictional departure is recorded. No external upload occurs.

### A09 — Hear without pretending to measure

A human table-read produces one note about a confusing pronoun; TTS produces no audience feedback.

Pass: the human reaction links to the read version. The tool does not invent engagement, laughter, timing, or actor endorsement from synthesis. The packet works with no speech service.

### A10 — Stale candidate and interrupted session

After a candidate is generated, the writer edits its target line manually, then resumes after interruption.

Pass: accepting the old candidate requires reconciliation; no overwrite. Accepted source, rejected suggestions, remaining candidates, and completed work survive. Retry does not create duplicate accepted changes.

### A11 — Clean share

The source contains a private note, boneyard scene, dual dialogue, Unicode, and an unchosen alternate ending.

Pass: exported reader-visible material matches the selected draft; excluded content stays excluded. Unsupported output is reported, not silently discarded. A no-op supported roundtrip preserves established fidelity guarantees.

### A12 — An honest usefulness report

One writer finds the alternatives helpful, another keeps the original, and a third finds the suggestions generic.

Pass: all outcomes appear in the evaluation record. No aggregated screenplay score, fabricated endorsement, or claim of a representative sample. Engineering tests and human responses are reported separately.

## Traceability record for each demonstration

Record requirement/case ID, fixture or consented source identity, invoked public operation/command, candidate or output path, assertions, actual execution status, source revision, and human-review status where relevant. Source-writing agents may fill proposed commands and tests but must not mark them executed.

## Phase 2 demonstration delivery record

Written: `packages/fount_observe/examples/phase_two.exs`,
`examples/fixture_file.exs`, `examples/live.exs`, and
`test/phase_two_scene_question_test.exs` relative to Observe. The deterministic
example asks about a synthetic scene, shows supplied evidence, distinguishes
fixture answers from real inference, excludes private notes and checks unchanged
Fountain. It also shows an unavailable-provider result with no false finding.

Execution status: NOT_RUN in the source-writing environment. Codex must run and
inspect the actual artifacts before this demonstration satisfies the phase exit.
No human usefulness or screenplay-quality claim is made.

## Phase 10 demonstration delivery record

Written: `packages/fount_workshop/integration/phase_ten_resume_history_test.exs` plus the durable-analysis persistence integration in `packages/fount_intelligence/integration/phase_ten_durable_analysis_test.exs`. The writer regression uses the actual Session/Candidate/Review/Core persistence surfaces: two alternatives exist, one is explicitly rejected, the other is left unchosen, a durable analysis record remains historical, and `Session.resume/3` must preserve both decisions without a new scripted generation call or canonical head change.

Execution status: **NOT_RUN** in the source-writing environment because Elixir/Mix/PostgreSQL are unavailable. Codex must execute and inspect the actual database/session state before the Phase-10 writer demonstration satisfies the exit gate. No human usefulness or screenplay-quality claim is made. Phase 11 is not implemented in this delivery.

## Phase 12 demonstration delivery record

Written: `packages/fount_workshop/test/writer_workflows/phase_twelve_a01_demo_test.exs`, `phase_twelve_discovery_test.exs`, `phase_twelve_inspect_test.exs`, `phase_twelve_scene_exploration_test.exs`, plus `packages/fount_workshop/examples/phase_twelve/README.md`. A01 creates three pool/map openings through deterministic scripted Inference, accepts one, rejects one, leaves one unchosen, then resumes selected draft/protected map/pending question. A02 separates performed fact from interpretation. A03 requires three different mechanisms and rejects confession paraphrases. A10 exercises manual writer candidates, stale acceptance and idempotent reacceptance.

Execution status: **NOT_RUN** for Elixir/PostgreSQL/runtime behavior in the source-writing environment. The 34 focused Python source-contract checks and strict overlay transport checks pass, but they are not substitutes for ExUnit/database execution. No human usefulness or live-model quality result is claimed. Phase 13 is not implemented in this delivery.

### Phase 12 runtime QC result — 2026-09-27

The applied checkout matched all 36 overlay hashes before repair. Focused A01/A02/A03/A10 tests, the new real PostgreSQL acceptance/brief regression, full CI (343 workspace tests), 98 Python tests, 32 database integration tests, the provider-free CLI example and four package builds pass. The real example saved an edited pool-scene Fountain page and the accepted database head, then resumed the original draft request with Inspect as current mode. Deterministic scripted mechanisms do not establish live-model quality. The optional D046 human study was not commissioned. Phase 12 is `COMPLETE` on applicable engineering gates; Phase 13 remains `NOT_STARTED`. See `handoffs/PHASE_12_RUNTIME_QC_REPORT.md`.

## Phase 13 demonstration delivery record

Written: `packages/fount_workshop/test/writer_workflows/phase_thirteen_comparison_test.exs`, `phase_thirteen_voice_test.exs`, `phase_thirteen_rehearsal_test.exs`, `phase_thirteen_pass_profiles_test.exs`, the three new pass-profile assets, `FountWorkshop.Comparison`, `FountWorkshop.Rehearsal`, `FountWorkshop.Writing.VoiceProtection`, and `examples/phase_thirteen/README.md`.

A02 is represented by a quiet key/cooling-cup scene with exact repeated offscreen language: one candidate changes visual stillness, one changes offscreen sound, neither changes dialogue, and a fluent explanatory control is explicitly rejected. A04 protects exact repeated multilingual text and cue through required deterministic pins; an action-only edit is allowed while normalized dialogue is constructed as a failure. A05 keeps invented rehearsal backstory out of later generation context until explicit adoption, records adoption/rejection provenance, and still labels adopted project material noncanonical rather than a StoryWorld fact. Actual comparison uses stable screenplay identities and labels generator summaries as claims rather than evidence.

Source-delivery execution status (historical): **OFFLINE_IMPLEMENTED / Elixir runtime NOT_RUN**. Phase-13 Python source checks pass 7/7; focused Phase-9–13 source checks pass 41/41; strict 24-operation overlay dry-run/apply/second-dry-run, ZIP integrity and whole-tree identity pass. Repository-wide Python discovery attempts 102 tests with one pre-existing missing `scripts/prune_deleted_directories.py` import in the supplied snapshot. `mix`, `elixir`, and `erl` are absent, so ExUnit/compile/PostgreSQL/full-CI/provider results are not claimed. The optional D046 writer/language tradeoff review is NOT_RUN. Phase 14 remains NOT_STARTED.

## Phase 13 runtime execution record — 2026-09-27

At Fount repair commit `26da17e`, all 24 applied overlay paths matched their supplied SHA-256 values before repair. The four Phase-13 writer workflow tests pass (4/4). A02 compares actual stable-ID pages: visual stillness and offscreen sound yield different action changes while silence and repeated `Not today. Not today.` language remain; the generic explanatory control is rejected. A04 runs exact repeated/multilingual text through required `pin_text` and `ReviewGate`: action-only passes, normalized dialogue hard-fails even with override. A05 runs a real PostgreSQL Store/Session resume: active/rejected inventions stay out of later context, explicit actor/note adoption is traceable and noncanonical, both decisions persist, and the screenplay head does not change. Generator summaries remain claims, never comparison evidence.

Full `mix ci` passes 347 workspace tests, compiled architecture, strict Credo, Dialyzer and ExDoc; Python discovery passes 105; disposable PostgreSQL migrations and 33 integration tests pass; four Hex archives build. Phase-12 discovery/stale/idempotent acceptance and writer/PDF/table-read regressions pass. Details and transient repair history are in `handoffs/PHASE_13_RUNTIME_QC_REPORT.md`. These scripted fixtures prove deterministic engineering behavior, not model quality. Live provider calls and optional D046 human/language review are `NOT_RUN`. Phase 13 is `COMPLETE` on applicable non-human gates; Phase 14 remains `NOT_STARTED`.

## Phase 14 demonstration delivery record

Written: `packages/fount_workshop/test/writer_workflows/phase_fourteen_notes_test.exs`, `phase_fourteen_consequence_test.exs`, `phase_fourteen_research_test.exs`, `phase_fourteen_rebase_test.exs`, `integration/phase_fourteen_research_notes_durability_test.exs`, `FountWorkshop.Research`, `FountWorkshop.NoteTriage`, `FountWorkshop.ConsequenceReview`, and `examples/phase_fourteen/README.md`.

A06 keeps “Explain why she leaves” and “Keep the mystery” as separate sourced notes, permits clarity concern accepted/treatment rejected, and moves anchor state from exact to unique relocation, ambiguous after duplicate split, or orphaned with no exact evidence. A07 moves the spare-key reveal early, leaves an unrelated scene untouched, links the decision to an ordinary candidate, and separates supported dependency from uncertain hypothesis and unresolved downstream work. A08 treats a quoted upload instruction as untrusted data, leaves a disputed date disputed, records deliberate fictionalization separately, and performs no external upload/search. The concurrency regression accepts one sibling candidate, requires stale refusal/reconciliation for the other, surfaces Rebase conflict, and requires exact Fountain bytes after Undo.

Source-delivery execution status: **OFFLINE_IMPLEMENTED / Elixir runtime NOT_RUN**. Phase-14 Python source checks pass 8/8; focused Phase-9–14 source checks pass 49/49; strict 18-operation overlay dry-run/apply/second-dry-run, ZIP integrity and 626-file whole-tree identity pass. Repository-wide Python discovery attempts 110 tests with 109 passing and one supplied-snapshot missing `scripts/prune_deleted_directories.py` import. `mix`, `elixir`, and `erl` are absent, so ExUnit/compile/PostgreSQL/full-CI/provider results are not claimed. Optional D046 collaborator/human review is NOT_RUN. Phase 15 remains NOT_STARTED.


**Phase 14 runtime QC checkpoint — 2026-09-27:** `COMPLETE` on applicable non-human gates at Fount repair commit `37a25ca` (tree `52c259b`). Four focused A06/A07/A08/concurrent-edit tests and the real PostgreSQL durability test pass. `mix ci` passes 351 workspace tests with architecture, strict Credo, Dialyzer and ExDoc; 113 Python tests, 34 database integrations and four Hex builds pass. A06 retains conflicting raw notes and exact anchor states; A07 gets changed-scene evidence from `Screenplay.diff/2` and leaves the bus-stop scene untouched; A08 keeps the hostile quote untrusted and the date disputed; stale acceptance, Rebase conflict and exact Undo pass. See `handoffs/PHASE_14_RUNTIME_QC_REPORT.md`. Live providers, external web research and optional D046 human/domain review are `NOT_RUN`. Phase 15 is `NOT_STARTED`.

## Phase 15 source-delivery record — 2026-09-27

Written: `FountWorkshop.TableRead.packet/3`, `export_packet/4`, and `record_reaction/2`; `FountWorkshop.Share`; `FountWorkshop.Usefulness`; the extended existing `fount.read` command; `guides/read-share-resume-and-usefulness.md`; `examples/phase_fifteen/README.md`; `test/writer_workflows/phase_fifteen_read_share_resume_test.exs`; `phase_fifteen_usefulness_test.exs`; and `integration/phase_fifteen_read_share_resume_test.exs`.

A09 writes a provider-free human table-read packet tied to exact screenplay revision/selection and refuses synthesized speech as a human reaction source. A10 reuses existing stale/idempotent acceptance and resume state, with a fresh-store PostgreSQL regression written for Codex. A11 projects accepted canonical material through Core's spec IR and actual Fountain/FDX exporters, excludes private notes/boneyards/omitted scenes/Workshop state, preserves dual dialogue/Unicode/title metadata where supported, and exposes exporter losses instead of hiding them. A12 records human-only, basic-LLM and Fount-assisted task evidence without aggregate screenplay scores, automatic winners, expert endorsements, representative-sample claims, or acceptance-rate-as-quality claims.

Source-delivery execution status: **OFFLINE_IMPLEMENTED / Elixir runtime NOT_RUN**. Focused Phase-13–15 Python source checks pass 24/24; all phase-source checks pass 110/110; strict 17-operation overlay dry-run/apply/second-dry-run, ZIP integrity and whole-tree reproduction pass. Repository-wide Python discovery attempts 119 tests: 118 pass and one known supplied-snapshot import error remains because `scripts/prune_deleted_directories.py` is absent. `mix`, `elixir`, and `erl` are absent, so formatter/compile/ExUnit/PostgreSQL/full-CI/package/provider results are not claimed. The optional D046 four-writer comparative study is **NOT_RUN**. Phase 16 remains **NOT_STARTED**.


**Phase 15 runtime QC checkpoint — 2026-09-27:** `COMPLETE` on applicable non-human gates at Fount `72c583a` (tree `30df207`). All 17 source overlay hashes matched before repair; post-repair identities are separate. A09–A12 focused tests, fresh PostgreSQL resume/privacy integration, full 353-test `mix ci` with architecture/strict quality/docs, 122 Python tests, 35 database integrations, Core lossless Fountain/FDX, writer/PDF/Submission preservation, provider-free capture-through-resume CLI path, and four Hex builds pass. Resume review export now shows persisted accepted/rejected decisions. Deterministic records are engineering fixtures, not human preference data. Live providers and the optional D046 four-writer study are `NOT_RUN`. See `handoffs/PHASE_15_RUNTIME_QC_REPORT.md`. Phase 16 remains `NOT_STARTED`.

## Phase 16 source-delivery record — 2026-09-27

Written: `scripts/final_acceptance.py`, `scripts/final_acceptance.sh`, `packages/fount_intelligence/test/phase_sixteen_final_architecture_test.exs`, `packages/fount_workshop/test/writer_workflows/phase_sixteen_acceptance_matrix_test.exs`, `packages/fount_workshop/examples/phase_sixteen/README.md`, `acceptance_matrix.json`, and `guides/final-acceptance.md`. The final matrix covers every W01–W12 and A01–A12 with owned evidence paths and proposed execution records; it deliberately reuses actual Phase-12–15 workflows instead of adding a bypassing “final demo.”

Source-delivery execution status: **OFFLINE_IMPLEMENTED / Elixir runtime NOT_RUN**. Final source audit 16/16, focused Phase-16 Python 4/4 and all phase-source Python 114/114 pass; strict 17-operation overlay transport/tree reproduction passes. Repository-wide Python discovery attempts 123 tests: 122 pass plus the known supplied-XML missing prune-helper import. Runtime/database/package/provider/PDF/TTS checks are NOT_RUN. Optional D046 human work is NOT_RUN; no creative-superiority or human-usefulness claim is made.

Codex must execute each case/requirement map on the exact final revision, record source identity/command/artifact/assertions/result/human status, repair defects, and only then mark Phase 16 COMPLETE on applicable non-human gates. There is no Phase 17.


## Phase 16 runtime scenario result — 2026-09-27

All A01–A12 synthetic engineering scenarios and W01–W12 owning suites passed at Fount `6becd6e8a753df7709d7c47e169cf9f4496d88d1`. `handoffs/PHASE_16_RUNTIME_QC_REPORT.md` records each fixture identity, invoked public command, artifact/log path, assertion/result and human-review status. The provider-free CLI path, PostgreSQL durability, clean Fountain/FDX share and full quality/package ladder passed. Human creative preference, audience response and representative usefulness were not measured; optional D046 study is NOT_RUN. Phase 16 is COMPLETE on applicable non-human gates. There is no Phase 17.
