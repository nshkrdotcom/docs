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

**Human gate:** One discovery-oriented writer and one outline-oriented writer each complete a session and answer whether the tool forced an unwanted process. Record exact task, output, friction, and rejection reasons. This is a formative gate, not population evidence; missing reviewers leave `DOMAIN_REVIEW_PENDING`.

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

**Human gate:** Two writers review original/candidate/generic-control excerpts in randomized order. Record voice fit, meaningful difference, cinematic usefulness, and cases where the original is preferred. Do not claim blinded preference if condition labels were visible.

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

**Human gate:** A writer and a separate note-giver or story collaborator review the workflow. Record whether the original concern survives triage, whether disagreement is represented fairly, and whether the proposed revision addresses the chosen concern.

## Phase 15 — Read, share, resume, and prove usefulness

**Goal:** Make the writing process coherent across sessions, review, and handoff, with evidence of usefulness rather than a feature inventory.

**Requirements:** W01, W10–W12 and all prior workflow integration; cases A09–A12.

**Existing source to inspect:** `table_read.ex`, `audition.ex`, `review_export.ex`, `submission.ex`, `export/pdf.ex`, `cli.ex`, acceptance and session continuation; core Fountain/FDX exporters and source-projection tests.

Tasks:

1. Produce a human table-read packet without TTS and record reactions independently of screenplay facts. Keep optional speech adapters optional.
2. Verify clean sharing/export of selected material, with no private-note or alternative leakage. Test dual dialogue, non-ASCII text, unsupported export features, and roundtrip fidelity.
3. Provide one documented end-to-end entry path for capture → explore → revise → compare → accept/reject → export → resume. Use existing commands; do not require a new graphical editor.
4. Run human-only, basic LLM-assistance, and Fount-assisted task comparisons. Record actual outputs, time, errors, friction, and preferences separately. Include failures and unchanged originals.

**Required demonstration:** A09–A12 plus a complete scene session using the same source identities. No provider credentials are necessary for the human-only path.

**Human gate:** At least four writers with differing practices each try the three conditions on comparable tasks; counterbalance order and acknowledge learning effects and the small sample. Preserve consent and material rights. Record whether the tool helped the next decision, respected voice, and created meaningful alternatives. This evaluates the workflow, not commercial potential.

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