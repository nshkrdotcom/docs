# Notes, Diagnosis, and Revision Philosophy

## Purpose

This document defines how Fount should reason about notes and revision problems. The central rule is simple:

> A note is evidence of a reader reaction or stakeholder concern. It is not automatically a correct diagnosis, and its proposed fix is not automatically the right treatment.

That distinction is strongly consistent with the WGAW *Screenwriters Handbook* and long-running professional screenwriting practice discussed on Scriptnotes.

## 1. The professional notes problem

A note may arrive as:

- “The second act drags.”
- “I don't understand why she goes back.”
- “Can he explain the plan earlier?”
- “We need to like him more.”
- “The reveal needs to be bigger.”
- “Can you add a scene where they fight?”
- “This relationship doesn't land.”
- “The stakes need to be higher.”

These statements occupy different levels.

Some describe a **reaction**. Some contain an inferred **cause**. Some contain a proposed **solution**. Frequently they contain all three mixed together.

The system must separate them.

## 2. WGA principle: symptom versus cause

The WGAW handbook advises writers not to treat every note as an instruction and uses a doctor/patient analogy: the collaborator can report what is bothering them, while the writer must determine the underlying cause and appropriate treatment.

This is a foundational architectural requirement for Fount.

Fount must never implement:

```text
note -> automatic rewrite
```

The desired chain is:

```text
reported reaction
    -> normalize concern
    -> collect evidence
    -> generate competing diagnoses
    -> identify uncertainty / missing evidence
    -> propose revision strategies
    -> generate optional candidates
    -> compare effects / regressions
    -> writer chooses
```

## 3. Scriptnotes principle: hear the note, not necessarily the solution

Recent and historical Scriptnotes discussions repeatedly distinguish the issue the reader experienced from the fix the reader suggests. A note about page 15 may have been caused by something missing on page 12. A requested explanatory scene may be unnecessary if an earlier source of confusion is removed. A scene can often improve by deleting material rather than adding clarifications.

This implies three important system capabilities:

1. **causal backtracking:** search earlier setup, motivation, knowledge, or expectation state for the origin of a later reaction;
2. **minimal intervention:** consider deletion, compression, reorder, substitution, or earlier setup before defaulting to added exposition;
3. **counterfactual comparison:** test more than one plausible treatment against the same diagnosis.

## 4. The canonical note object

A future note representation should distinguish fields that humans often conflate:

```text
Note
  id
  source / author / meeting
  source_revision_id
  target(s)
  raw_text
  reported_reaction
  proposed_cause?      # optional, attributed to note-giver
  proposed_solution?   # optional, attributed to note-giver
  priority / obligation metadata? # writer/project-controlled
  status
  created_at
```

Do not rewrite the raw note into an apparently objective statement. Preserve attribution.

## 5. Reaction normalization

The system may derive one or more structured concerns from a note, for example:

```text
raw: "The second act drags. Maybe give Mara another obstacle."

reported_reaction:
  pacing_loss / desire_to_continue_drop

note_giver_hypothesis:
  insufficient opposition

note_giver_treatment:
  add obstacle for Mara
```

This separation makes it possible for Fount to discover that the evidence instead points to repeated objectives, an already-obvious reveal, or delayed consequences.

## 6. Diagnosis is a hypothesis object

A diagnosis should contain:

```text
Diagnosis
  id
  concern_id
  code / family
  hypothesis
  support_evidence_ids
  counterevidence_ids
  affected_range
  confidence / uncertainty representation
  alternative_diagnosis_ids
  missing_information
  suggested_investigations
  intent_context
  identity/hash / provenance
```

A diagnosis must be falsifiable enough to investigate.

Bad:

> “The scene is weak.”

Better:

> “The scene may feel static because Mara's objective, leverage relationship with Dan, and knowledge state enter and exit unchanged; the new information repeats a fact established two scenes earlier.”

The second statement names inspectable evidence and admits the connection to felt pacing is a hypothesis.

## 7. Competing diagnoses are expected

A reported pacing problem might plausibly come from:

- repeated scene function;
- unclear objective;
- weak stakes;
- no consequence from prior action;
- unresolved setup held too long;
- reveal already inferred;
- low novelty;
- relationship state not moving;
- action prose density;
- scene entering too early;
- scene leaving too late;
- sequence objective already achieved;
- too many explanatory beats after comprehension was secured.

Fount should rank evidence relevance if calibrated, but must preserve alternatives rather than converting uncertainty into certainty.

## 8. Note convergence and disagreement

Multiple independent readers reporting the same reaction is useful evidence that something is not landing, even if their diagnoses differ.

Represent:

- **reaction convergence:** several readers report confusion at the same transition;
- **diagnostic divergence:** they propose different reasons;
- **treatment divergence:** they suggest incompatible fixes.

The system should surface the convergence without pretending the majority solution is correct.

## 9. Stakeholder agenda and movie intent

Professional notes exist in a context: producer, executive, director, actor, financier, contest reader, collaborator, writer. Their concerns may differ.

Fount should preserve source and project authority metadata but remain a writer tool. It may say:

- this note is contractually/project marked `required`;
- this note conflicts with writer-authored intent;
- these two notes request incompatible outcomes;
- this candidate addresses one note while worsening another.

It should not infer hidden motives or decide which stakeholder is “right.”

## 10. Treatment strategies

A `TreatmentStrategy` is not yet prose generation. It is a plan for changing dramatic mechanics.

Examples:

- remove redundant explanatory beat;
- move existing reveal earlier;
- delay reveal and increase misleading support for alternative inference;
- turn passive discovery into character-caused consequence;
- merge two scenes that perform the same function;
- change who holds leverage in the exchange;
- seed objective before the scene rather than explain it inside the scene;
- make failure cost concrete;
- replace dialogue explanation with observable action;
- preserve plot but change relationship consequence;
- remove the question entirely rather than answer it later.

Each strategy should predict affected states and risks.

## 11. Minimal intervention and the “surgical fix”

Scriptnotes discussions of overwriting emphasize that notes often accumulate explanatory material. A strong rewrite may remove a phrase, beat, scene, or premise assumption that generated the need for later explanation.

Therefore strategy generation should explicitly include these operation classes:

```text
DELETE
COMPRESS
MOVE
REVEAL_EARLIER
REVEAL_LATER
REASSIGN_CAUSE
REASSIGN_INFORMATION
CHANGE_TACTIC
CHANGE_CONSEQUENCE
MERGE
SPLIT
RECONCEIVE
ADD
```

`ADD` should not be the default first class.

## 12. Revision experiment protocol

For each important concern:

1. Freeze the base revision.
2. Preserve writer intent and note attribution.
3. Gather observations/timelines relevant to the concern.
4. Create two or more plausible diagnoses when evidence allows.
5. Select one diagnosis or explicitly explore alternatives.
6. Create treatment strategies at the dramatic-mechanics level.
7. Materialize candidate pages only when requested.
8. Re-run relevant observations on each candidate.
9. Compare target improvement, collateral changes, new continuity/knowledge/dependency risks, voice drift, and reader-state effects.
10. Let the writer accept, reject, combine, or iterate.

This is the architecture behind a trustworthy `notes` workflow.

## 13. Preserve strengths

Every diagnosis/revision workflow should be able to name **protected strengths**.

Examples:

- distinctive line/voice;
- setup needed later;
- relationship ambiguity the writer wants;
- visual motif;
- comic rhythm;
- suspenseful knowledge gap;
- intentionally withheld motivation;
- actor-friendly monologue;
- page-turn reveal;
- thematic echo.

A candidate that solves the note but damages a protected strength should surface that tradeoff.

## 14. Revision intelligence as a first-class capability

After a candidate exists, Fount should answer:

- Which reported reactions was this strategy intended to address?
- Which diagnosis did it assume?
- Which source facts/relationships/reader questions did it alter?
- Did the expected state change occur?
- Which previous setups/payoffs became invalid?
- Did any character gain knowledge without a valid path?
- Did voice drift?
- Did the scene become longer/clearer but lose pressure?
- Did the revision create a new unresolved question?
- Did it fix locally while making the sequence more repetitive?

This is more valuable than “the rewrite scored 7% better.”

## 15. Architecture rule

The system must preserve these four types separately all the way through storage and APIs:

```text
Reaction     what someone experienced
Diagnosis    why the system/writer thinks it may have happened
Strategy     what dramatic mechanics could change
Candidate    one concrete implementation of a strategy
```

Collapsing them destroys auditability and writer agency.

## Writer presentation and usefulness

A good diagnosis is not merely technically supportable; it must help the writer reason without disguising uncertainty or prematurely prescribing treatment.

Writer-facing note/diagnosis output therefore follows `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`, and human review evaluates support/validity separately from usefulness as specified in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.
