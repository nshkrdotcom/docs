# Research Sources and How They Are Used

This docset distinguishes **industry/professional guidance**, **narrative research**, **technical narrative-understanding research**, and **secondary craft/coverage references**. Sources inform writer workflows and their implementation; no single source is treated as screenplay law.

## A. Primary industry / institutional sources

### Academy Nicholl Fellowships — Reader Judging Criteria / Scoring Rubric

- https://www.oscars.org/nicholl/about
- PDF used during research: https://www.oscars.org/sites/oscars/files/2025-05/Nicholl_Scoring_Rubric_0.pdf

Used for: broad professional reading dimensions including Story, Voice, Characters, Craft, Meaning and Magic; journey, emotional connection, originality/freshness, causal character action, conflict, desire to keep reading, and theme.

### Writers Guild of America West — Screenwriters Handbook

- https://www.wga.org/members/employment-resources/screenwriters-handbook
- PDF surfaced during research: https://www.wga.org/uploadedfiles/members/employment_resources/screenwriter-handbook.pdf

Used for: professional notes practice, collaboration, not accepting every proposed fix, separating the collaborator's reported problem from the writer's diagnosis/treatment.

### Sundance Institute — Feature Film Program

- https://www.sundance.org/programs/feature-film

Used for: project intent, theme, tone/feel/visual style, intended audience, creative problem to work on, urgency, personal connection, and revision as a rigorous development process.

### Sundance Institute — “Artists, Here’s What Sundance Institute Is Looking For in Your Script”

- https://www.sundance.org/blogs/artists-heres-what-sundance-institute-is-looking-for-in-your-script-3/

Used for: discovery, fresh cinematic voice, authenticity/singularity, diversity of form/intent/audience, urgency.

## B. Professional screenwriter practice — Scriptnotes / John August

### Episode 730 — A Frank Talk About Screenwriting

- https://johnaugust.com/2026/scriptnotes-episode-730-a-frank-conversation-about-screenwriting-transcript

Used for: note intention, “problem behind the note,” and not accepting a suggested solution as the solution.

### Episode 399 — Notes on Notes

- https://johnaugust.com/2019/scriptnotes-ep-399-notes-on-notes

Used for: character-centered notes, meaningful change, collaborative note behavior.

### Episode 86 — Taking Notes

- https://johnaugust.com/2013/scriptnotes-ep-86-taking-notes-transcript

Used for: note-giver perspective/intent, what-if framing, avoiding treating expert feedback as gospel.

### Episode 650 — Overwritten

- https://johnaugust.com/2024/scriptnotes-episode-650-overwritten-transcript

Used for: surgical fixes, removing clauses/scenes, note accumulation, avoiding unnecessary additive rewriting.

### Episode 655 — Conflict and Stakes Compendium

- https://johnaugust.com/2024/scriptnotes-episode-655-conflict-and-stakes-compendium-transcript

Used for: scene-specific wants, if/then stakes, competing interests, conflict beyond arguing.

### Episode 279 — What Do They Want?

- https://johnaugust.com/2016/scriptnotes-ep-279-what-do-they-want-transcript

Used for: goal versus deeper want, audience contract, tracking pursuit across the movie.

### Episode 42 — Verbs Are What’s Happening

- https://johnaugust.com/2012/scriptnotes-ep-42-verbs-are-whats-happening-transcript

Used for: rewrite ripple effects; changing one integrated story element should affect others.

### Episode 384 — Plot Holes

- https://johnaugust.com/2019/scriptnotes-ep-384-plot-holes-transcript

Used for: removing the question/problem rather than paving over it with explanation.

### Episode 556 — Let’s Catch Up

- https://johnaugust.com/2022/scriptnotes-episode-556-lets-catch-up-transcript

Used for: stepping back from local fixes and considering subtraction/earlier causes.

### Episode 686 — Problem Solving

- https://johnaugust.com/2025/scriptnotes-episode-686-problem-solving-transcript

Used for: decomposition, refactor/reconceive options, defining satisfactory solutions.

## C. Narrative engagement / reader-experience research

### Busselle & Bilandzic (2009), “Measuring Narrative Engagement”

- https://www.tandfonline.com/doi/abs/10.1080/15213260903287259

Used for: four distinct dimensions—narrative understanding, attentional focus, emotional engagement, narrative presence—and the argument against collapsing narrative experience into one variable.

### Green & Brock (2000), narrative transportation

- DOI: https://doi.org/10.1037/0022-3514.79.5.701

Used for: transportation/mental involvement as a distinct research construct; not used as a screenplay scoring formula.

### Bermejo-Berros, Lopez-Diez & Gil Martínez (2022), “Inducing narrative tension in the viewer through suspense, surprise, and curiosity”

- https://www.sciencedirect.com/science/article/pii/S0304422X22000262
- DOI: https://doi.org/10.1016/j.poetic.2022.101664

Used for: treating suspense, surprise, and curiosity as related but functionally distinct narrative structures.

### Audience immersion / narrative engagement validation (2023)

- https://link.springer.com/article/10.1186/s41235-023-00475-0

Used for: narrative-engagement dimensions and empirical measurement context; reinforces separating attention, emotional engagement, understanding, and presence.

## D. Full-screenplay narrative-understanding research

### STAGE — A Full-Screenplay Benchmark for Reasoning over Evolving Stories (2026)

- https://arxiv.org/abs/2601.08510

Used for: full-screenplay narrative backbone, evolving goals/beliefs/knowledge/relationships, provenance-linked state, cross-scene reasoning, and the importance of temporal/epistemic access.

The docset does not assume STAGE's task definitions are identical to Fount's product requirements; it is a strong external validation of the need for evolving, source-grounded state rather than isolated scene prompts.

## E. Secondary industry/craft sources

### ScreenCraft — script coverage overview

- https://screencraft.org/blog/a-screenwriters-guide-to-script-coverage/

Used only to corroborate common coverage categories such as concept, story, character, dialogue, structure, pacing, catharsis/originality and to distinguish coverage from development.

### Final Draft — setups and payoffs

- https://www.finaldraft.com/blog/how-to-put-setups-and-payoffs-in-your-scripts

Used as a contemporary craft reference for setup/payoff lifecycle and audience anticipation, not as a universal rule.

## F. Craft schools treated as optional lens packs

The architecture may later encode concepts associated with works such as:

- Robert McKee, *Story*;
- David Mamet, *On Directing Film*;
- Keith Johnstone, *Impro*;
- John Truby, *The Anatomy of Story*;
- other documented scene/structure/genre methods.

These are not architectural authorities. Any such framework must be named, content-addressed/provenanced, optional, and distinguishable from Fount's neutral story-state substrate.

## G. Technical architecture references added during the second-order review

### Allen interval-algebra overview / qualitative temporal relation networks

- https://ics.uci.edu/~alspaugh/cls/shr/allen.html

Used for: distinguishing temporal-interval relation graphs from simple total ordering; recognizing relations such as precedes/meets/overlaps/during/contains/equality and their converses; and documenting that general temporal-relation network satisfaction is materially more complex than topological sorting.

Fount does **not** commit to implementing a complete Allen-interval solver. The reference informs the ontology and cautions against pretending an interval network is merely a precedence DAG.

### Elixir `mix xref` documentation (Mix/Elixir 1.19 line)

- https://hexdocs.pm/mix/Mix.Tasks.Xref.html

Used for: compile/export/runtime dependency distinctions, struct use as an export dependency, compile-connected analysis, and using xref as dependency/coupling evidence rather than a semantic side-effect theorem prover.

### Boundary for Elixir

- https://boundary.hexdocs.pm/
- https://hex.pm/packages/boundary

Used for: nested module boundaries, exports/dependency rules, and compile-time cross-module enforcement. The documentation also makes clear that external OTP application dependencies are allowed by default, so Boundary is one layer of Fount's purity enforcement rather than the complete enforcement mechanism.

## Additional product-validation / safety references used in the v4 review

### NIST AI Risk Management Framework / AIRC

- AI RMF Core / Measure guidance: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- NIST AI RMF: https://www.nist.gov/itl/ai-risk-management-framework

Used to reinforce that evaluation involves domain experts/users, human-subject evaluation should fit the relevant population/conditions, and TEVV belongs throughout the lifecycle rather than only at the end.

### Google — Rules of Machine Learning

- https://developers.google.com/machine-learning/guides/rules-of-ml

Used only for the engineering/product principle of defining metrics early, building a working end-to-end pipeline, and measuring before adding unchecked complexity. It is not screenplay-domain evidence.

### OWASP — Prompt Injection

- https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

Used to support least-privilege/separation requirements for third-party/declarative lens text. No prompt filter is treated as complete prevention.

### Professional-screenwriter human-AI studies

- Tang et al., *How Do Human Creators Embrace Human-AI Co-Creation? A Perspective on Human Agency of Screenwriters* (2026): https://arxiv.org/abs/2602.06327
- Tang et al., *DuoDrama: Supporting Screenplay Refinement Through LLM-Assisted Human Reflection* (2026): https://arxiv.org/abs/2602.05854
- Tang et al., *Understanding Screenwriters' Practices, Attitudes, and Future Expectations in Human-AI Co-Creation* (2025): https://arxiv.org/abs/2502.16153

These support the importance of agency, reflection, and workflow fit. They do not validate Fount's particular analytical constructs.

### STAGE screenplay benchmark

- Tian et al., *STAGE: A Benchmark for Knowledge Graph Construction, Question Answering, and In-Script Role-Playing over Movie Screenplays* (2026): https://arxiv.org/abs/2601.08510

Use boundary: demonstrates that screenplay-scale structured tasks can be defined/evaluated and may inform benchmark design. It does **not** validate Fount's StoryWorld, Reader, diagnosis, or model accuracy.

### U.S. Copyright Office

- Scripts / dramatic works: https://www.copyright.gov/register/pa-scripts.html
- Copyright and Artificial Intelligence: https://www.copyright.gov/ai/
- Fair Use FAQ: https://www.copyright.gov/help/faq/faq-fairuse.html

Used to justify treating screenplay corpus rights as an explicit operational/legal concern rather than assuming that publicly accessible scripts may be freely redistributed, retained, or exported to model providers. This docset does not give legal advice.

## Screenplay-first expansion — 2026-09-26

The primary-source ledger in `32_SCREENPLAY_FIRST_RESEARCH_EXPANSION.md` adds ten research themes with direct links, source limitations, and explicitly labeled product inferences: Sciamma, August, Kaufman, Reichardt, Leigh, Wordcraft, Dramatron, creativity/diversity research, working-writer affordances, and Fountain fidelity.

Use those sources alongside the earlier reader/notes literature, not as a replacement canon. Practitioner methods remain optional; short-story or small co-writing studies do not validate feature-screenplay outcomes. No source provides evidence that the unbuilt Fount phases are superior to other tools.

## Phase 5 source/API snapshot ledger — 2026-09-27

This Phase-5 source-writing pass used five raw Repomix XML snapshots, identified by repository contents rather than attachment filenames. Exact attachment hashes, sizes and file counts are in `handoffs/PHASE_05_INPUTS.json`. The snapshots did not contain authenticated current Git seals, so no current source commit is invented from them. The docset's verified post-Phase-4 Fount commit `cfde46cd2f654e050cbb9b5dbe32501625510c69` is historical baseline context.

- **Fount:** four-package workspace (`fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`) with Phase-4 Temporal/Reader source. Phase 5 uses the existing Observe `Context`, `Lens`, `Request`, `preflight/evaluate`, `Budget`, `Sandbox`, and Intelligence `Acquisition.Measurements` boundaries.
- **SystemOneSDK 0.6.0:** inspected public client/question/evaluation APIs. Phase 5 adds no direct use; provider-native semantics remain behind Observe.
- **Inference 0.5.0:** inspected provider-neutral completion/streaming APIs and `Inference.Adapters.ASM`. Phase 5 adds no direct use; Inference remains Workshop-owned.
- **Agent Session Manager 0.17.1:** inspected `ASM.query/3`, `stream/3`, session lifecycle and `ASM.ProviderFeatures` to verify the real Inference agent-session boundary. Phase 5 adds no direct ASM dependency.
- **Current docset:** documents 00–36 plus Phase-1 through Phase-4 runtime history. Its progress record made Phase 5 the first phase eligible for implementation.

No web source or conversation memory substitutes for these code/API snapshots in the Phase-5 implementation record. Human usefulness validation was not run.

## Phase 7 implementation-source snapshot — 2026-09-27

This source-writing pass used exactly five fresh raw XML attachments and identified them by repository contents rather than filenames:

- **Fount**: four-package screenplay workspace (`fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`) containing the Phase-6 runtime-corrected capability baseline; raw XML SHA-256 `9afe5206449947f69b52aba19898654174ffc38a9d87c1207d351d7b50b98df6`.
- **System One SDK**: poncho workspace containing `system_one_sdk`, `system_one_contracts`, `system_one_bumblebee`, and `system_one_server`; public SDK version 0.6.0; raw XML SHA-256 `acf283c1d254293cf1fe634f037c0f861bab298f3d524b4db9c5d37bd639fd2d`.
- **Inference**: provider-neutral inference workspace with adapters including ASM; version 0.5.0; raw XML SHA-256 `a7e30d9b4dccc106923367725d4d9dd4ad01a57105b4684e1becd03e6cc84ee9`.
- **Agent Session Manager**: session/run/provider-backend/provider-feature/inference-endpoint repository; version 0.17.1; raw XML SHA-256 `67988c9aec015ce189e16078b18639f60873d244da63e3275d33707add5702db`.
- **Current docset**: documents 00–36 plus Phase-1 through Phase-6 records; `PROGRESS.md` marks Phases 1–6 COMPLETE and Phase 7 as the first NOT_STARTED phase; raw XML SHA-256 `638c52c787db4d94c271e1452ed8d8c7a65aec6d70347c2a27c75a5f2d885304`.

Actual source inspection confirmed that Phase 7 requires no new direct dependency calls into SystemOneSDK, Inference, or ASM. Fount continues to acquire semantic measurements through `Fount.Observe`; `SystemOneSDK.new_client/1`, question preparation/evaluation, and provider result normalization remain owned by the existing Observe provider adapter. Inference remains Workshop-side generation infrastructure, with its 0.5.0 capability/complete/stream facade; ASM remains behind the existing Inference/agent-session boundary. Phase-7 Intelligence directly reuses real Fount APIs including `Fount.Selection.select/2`, `Fount.Selection.evidence/1`, `Fount.Intelligence.Reader.reduce/3`, `Reader.inspection_packet/1`, `Temporal.sequence_view/3`, `Temporal.setup_payoff_ledger/2`, `StoryWorld.compile/3`, `StoryWorld.story_time_relation/3`, and Observe context validation through `Fount.Intelligence.Acquisition.ContextBuilder.validate/2`.

No Elixir/Mix/runtime or human-review claim is sourced from this offline pass. Exact attachment identities, API lists, omissions, and check evidence are in `handoffs/PHASE_07_INPUTS.json` and `handoffs/PHASE_07_STATIC_CHECKS.json`.

## K. Phase 8 five-XML source inspection — 2026-09-27

The current implementation pass used only the supplied five snapshots as authority for source/API facts. Content identification and exact SHA-256/byte/file counts are recorded in `handoffs/PHASE_08_INPUTS.json`.

- Fount was identified by its four-package `fount` / `fount_observe` / `fount_intelligence` / `fount_workshop` workspace and Phase-7 implementation/QC state.
- System One was identified by the `system_one_contracts`, `system_one_sdk`, `system_one_bumblebee`, and `system_one_server` poncho packages; inspected `SystemOneSDK` version is 0.6.0.
- Inference was identified by `apps/inference`, provider-neutral request/response/adapter code and ASM adapter; inspected package version is 0.5.0.
- ASM was identified by `lib/asm` session/run/provider-backend/inference-endpoint code; inspected version is 0.17.1.
- The docset was identified by numbered documents 00–36 plus handoffs through Phase 7; its authoritative progress record made Phase 8 the first unfinished phase.

Phase 8 adds no direct SystemOneSDK, Inference or ASM call. Actual Fount APIs were inspected before use; details are in `PHASE_08_INPUTS.json`. The source-writing environment had no Elixir runtime, so source inspection does not substitute for Codex runtime verification.
## L. Phase 9 five-XML source inspection — 2026-09-27

The Phase-9 implementation pass used the supplied five raw snapshots as the authority for repository/API facts and identified them by contents rather than attachment filenames. Exact SHA-256, byte counts and file counts are in `handoffs/PHASE_09_INPUTS.json`.

- **Fount** is the four-package `fount` / `fount_observe` / `fount_intelligence` / `fount_workshop` workspace at the Phase-8 runtime-corrected checkpoint. Phase 9 consumes the real public Intelligence capability/revision runners and existing Workshop Session/Candidate/Review surfaces.
- **System One SDK 0.6.0** is the poncho workspace with contracts, SDK, Bumblebee and server packages. Phase 9 adds no direct Workshop call to it; measurement provider details remain behind Observe.
- **Inference 0.5.0** is the provider-neutral completion/stream workspace with ASM and other adapters. Existing Workshop generation continues through `Inference.Client`; the new Intelligence bridge does not call `Inference.complete` directly.
- **Agent Session Manager 0.17.1** is the session/run/provider-backend/inference-endpoint repository. Phase 9 adds no direct ASM dependency or call; ASM remains behind the host-selected Inference adapter.
- **Current docset** is documents 00–36 plus Phase-1 through Phase-8 runtime records. Its authoritative progress state made Phase 9 Workshop Intelligence Integration the first unfinished phase.

No Elixir/Mix/runtime or human-usefulness result is inferred from source inspection. Those gates remain assigned to Codex in `handoffs/PHASE_09_RUNTIME_QC_HANDOFF.md`.
