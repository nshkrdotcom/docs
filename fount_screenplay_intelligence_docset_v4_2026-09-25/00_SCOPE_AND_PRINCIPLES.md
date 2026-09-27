# Scope, Product Intent, and Design Principles

## 1. Product intent

The governing objective is useful screenplay writing, for humans and agentic collaborators. Elixir is chosen for the pleasure of building with it, not because this product needs distributed-system machinery. Documents 32–36 expand the original analytical brief into discovery, drafting, cinematic revision, voice, rehearsal, notes, and sharing. Their writer outcomes are acceptance requirements, not optional UI polish.

A writer may begin with a fragment and no outline; write without model assistance; pursue stillness or cooperation rather than conflict; and keep the original after exploring alternatives. No theory, metric, or agent recommendation overrides those choices. Existing technical decisions support the writing experience rather than define its value.

Fount is a screenplay substrate and revision environment. This program adds a screenplay-intelligence layer capable of understanding and comparing dramatic state across a feature screenplay without pretending that one theory of screenwriting is the screenplay itself.

The system should help a writer answer questions such as:

- What is happening in this scene beyond literal plot summary?
- What does each character want, know, believe, conceal, risk, and decide at this point?
- Which earlier events or facts make a later beat possible?
- What does a first-time reader know or expect at page/scene/beat N?
- Which dramatic questions are open, reinforced, answered, abandoned, or prematurely obvious?
- How are trust, leverage, intimacy, hostility, status, and dependency changing between characters?
- Is a sequence escalating, repeating, drifting, or paying off prior material?
- Why might a reader report that the second act drags, a reveal feels flat, a character feels passive, or dialogue feels expository?
- What competing diagnoses fit the evidence?
- What revision strategies address the likely cause while preserving existing strengths?
- Did the revision actually address the stated problem, and what else did it change?

The product should make aggressive experimentation safer: the writer can generate alternatives, compare consequences, inspect evidence, and choose what becomes canon.

## 2. What the system is not

It is not:

- a universal screenplay scoring machine;
- a replacement for human taste or a competition reader;
- an implementation of McKee, Truby, Mamet, Snyder, Johnstone, or any other single school as law;
- a hidden auto-rewriter that silently changes the accepted draft;
- a free-form agent runtime that can execute arbitrary tool names;
- a database of mutable prompts whose historical behavior cannot be reproduced;
- a whole-script LLM prompt masquerading as structured analysis;
- a future-aware reader simulator that accidentally uses later scenes to judge earlier suspense or mystery;
- a system that treats confidence as truth.

## 3. Why the architecture needs more than local probes

The current probe model is useful for atomic questions: whether a line looks expository, whether a proposition is established, whether one scene supports another, or whether dialogue resembles a character's voice profile.

But screenplay effects are often **emergent**. They depend on accumulated state and temporal change:

- suspense depends on threat, uncertainty, audience knowledge, character knowledge, proximity, and time;
- a character arc depends on repeated decisions and changes in goals/beliefs/relationships, not a single scene classification;
- a setup has meaning only in relation to later reinforcement or payoff;
- pacing is partly a distribution of change, pressure, novelty, and resolution across time;
- a reveal can be factually clear but dramatically dead because the audience inferred it twenty pages earlier;
- dialogue can be locally sharp while a relationship remains static for an entire sequence;
- a scene can function well in isolation while repeating the same story work as its neighbors.

The new architecture therefore makes time, state, evidence combination, and writer intent first-class.

## 4. Core conceptual layers

### Canonical layer

What the writer actually authored: screenplay text, structured elements/scenes, identities, revisions, accepted authored metadata, exact source spans, and explicit edits.

### Semantic layer

Interpreted story-world objects grounded in canonical evidence: entities, events, facts, goals, commitments, causal relations, knowledge assertions, beat interpretations, motifs, promises, and relationships.

### Observation layer

Small measurements made by deterministic logic or model-backed sensors: whether an objective is active, whether a line states intention directly, whether a beat shifts leverage, whether a fact is established, probability distributions over tactics, etc.

### Temporal layer

Pure reducers that turn ordered observations/events into evolving timelines: character state, relationship state, causal/setup ledgers, sequence movement, and state transitions.

### Reader layer

A strict-forward simulation of what a first-time screenplay reader has been given so far: open questions, expectations, threats, promises, likely inferences, uncertainty, surprise opportunities, comprehension load, and emotional alignment hypotheses.

### Diagnosis layer

Evidence-composed hypotheses about why an observed reader/writer problem may be occurring. Diagnoses carry support, counterevidence, uncertainty, alternatives, and suggested next investigations.

### Playbook layer

Writer-task compositions such as dialogue pass, character pass, scene doctor, thriller audit, pacing investigation, notes response, or submission pass. Playbooks select registered sensors/reducers/diagnoses; they do not invent code.

### Workshop layer

Actual generation and revision: alternatives, targeted rewrites, propagation, sequence rebuilds, note responses, creative passes, recovery, comparison, and explicit review/acceptance.

## 5. Principles for subjective material

### Measure what can be measured; preserve what cannot

The system can often estimate whether a character has acted, whether a fact has appeared, whether a relationship changed direction, or whether a question remained unresolved. It should be much more cautious about declaring whether a character is “good,” whether a theme is “deep,” or whether a script has “magic.”

For holistic judgments, prefer:

- evidence collections;
- contrasts between sections or revisions;
- multiple reader-model hypotheses;
- writer-specified intent;
- calibration against annotated corpora;
- language like “evidence suggests,” “possible cause,” or “reader-model estimate” rather than objective verdicts.

### Intent matters

A slow scene, unresolved question, repeated line, static relationship, hidden objective, ambiguous motivation, or delayed payoff can be deliberate. The system should compare observed behavior to writer intent and playbook purpose before diagnosing it as a defect.

### Exceptions are not errors

A feature can succeed by violating a familiar rule. “Late in, early out,” explicit objectives, three-act turning points, polarity shifts, character transformation, and other frameworks are useful lenses, not constitutional requirements.

## 6. Feature-film focus

This program targets **feature-film screenplays**. Television/episodic/series intelligence is outside this implementation program by design, not merely deferred because of time.

Feature-film acceptance must not be diluted by episodic concerns such as season/series arc hierarchy, episodic reset, act-outs, series-bible state, cross-episode continuity, or writers-room ownership.

The feature scope still includes structurally unusual movies: non-linear chronology, ensembles, multiple protagonists, unreliable narration, dream/alternate material, genre hybrids, and deliberate structural rule-breaking.

See `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`.

## 7. Compatibility stance

The existing `fount_probe` package is directly superseded in Phase 1. Its useful behavior, tests, algorithms, and safety properties are reimplemented under the final architecture; its package/API shape is not preserved, and the package is deleted rather than maintained in parallel.

The existing `fount` package remains the canonical substrate and is extended only for genuinely general screenplay primitives. `fount_observe` measures, `fount_intelligence` interprets, and `fount_workshop` revises; none redefines canonical screenplay truth.

## 8. Writer-facing presentation is part of the product contract

Headless does not mean presentation-undefined.

Every writer-facing analysis must be renderable through the semantic contract in `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`, which separates source evidence, derived state, diagnostic hypotheses, counterevidence, uncertainty, strategies, protected strengths, and revision effects.

A GUI is not required by this program; a coherent writer-facing result contract and reference renderer are.

## 9. Validation is a parallel product workstream

Engineering QC is necessary but cannot establish dramaturgical usefulness.

Human/domain validation begins with small pilots when StoryWorld, Reader, and diagnosis behavior first appear, then scales in Phase 11. Early validation therefore has explicit staffing, rights, privacy, and corpus logistics defined in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.

Do not describe a phase as writer/reader validated merely because its runtime checks pass.

## 10. Extensibility is open at the question/configuration layer, closed at the executable layer

Writer questions may be open-ended. Safe project/studio packs and compatible declarative lenses may be authored without Elixir changes under the restrictions in `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.

Executable sensors, projections, decoders, provider adapters, reducers, and privileged actions remain registered code.

## 11. Resource economics are product behavior

Playbooks must expose resource preflight, caps, actual usage, and incremental-reuse effects. Hosted price is only one possible projection; local/on-prem compute and queue cost also matter.

See `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.