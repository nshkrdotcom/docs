# Phase 4 first-reader domain review packet

**Status:** prepared only. No reader study has been run and no human result is claimed.

## Goal

Validate whether Phase-4 Reader checkpoints correspond usefully to what real first-time readers know, expect, question and misunderstand at the same screenplay exposure point, without allowing future pages to contaminate the answer.

## Minimum pilot target from the docset

Use at least **3 rights-cleared feature scripts or substantial feature-script excerpts**, with selected first-reader checkpoints and a target of **3–5 independent first-time readers per checkpoint set**. These are pilot targets, not statistical-validity claims.

Before any review, record a corpus manifest for each item with rights basis, allowed uses, provider-export permission, human-review permission, redistribution permission, retention and confidentiality class. Hosted-provider use is not implied by permission to conduct human review.

## First-exposure protocol

For each case:

1. Freeze the exact screenplay revision and checkpoint positions.
2. Give a reader only the prefix through the current checkpoint. Do not show later scenes, Fount predictions, writer intent, or another reader's answer.
3. At selected checkpoints ask, where relevant:
   - What do you currently believe happened?
   - What do you think a named character knows or believes?
   - What question are you waiting to see answered?
   - What outcome do you expect?
   - What threat feels active?
   - Where are you confused or temporally disoriented?
   - What feels unresolved enough to pull you forward?
4. Permit “I don't know / not enough information” and free response before any forced choice.
5. Record reader uncertainty and preserve disagreement.
6. Only after the independent response is locked, compare it with the deterministic Reader ledger and any model-estimated interpretation.

## Claim classes must stay separate

Every comparison packet must label:

- `canonical_fact` — direct screenplay/source fact;
- `deterministic_derived_narrative_state` — Reader/StoryWorld state deterministically produced from supplied records/events;
- `model_estimated_reader_interpretation` — machine-estimated interpretation, not human truth;
- `human_observation` — actual checkpoint response from a named/pseudonymous study participant with study provenance.

Never upgrade a model estimate to a human-calibrated claim because it resembles a fixture or one reader answer.

## Required comparison outputs

For each checkpoint retain:

- screenplay/revision/checkpoint identity;
- exact exposed prefix boundary;
- source evidence IDs used by Fount;
- deterministic Reader state before seeing human answers;
- StoryWorld diegetic comparison where relevant;
- each reader's independent response and uncertainty;
- disagreement distribution/rationale;
- mismatch classification: software defect, event/annotation input error, legitimate interpretation disagreement, screenplay ambiguity, insufficient evidence, or presentation issue;
- any proposed software repair kept separate from creative judgments about the screenplay.

## Non-linear cases

At least one selected case should contain a flashback, recollection, intercut, or other presentation/story-time divergence. Verify specifically that readers can update their interpretation when a later-presented earlier event appears, while earlier checkpoint records remain frozen.

## Completion rule

Engineering QC can finish before this pilot. If the software gates pass but this packet has no real review records, Phase 4 becomes `DOMAIN_REVIEW_PENDING`, not `COMPLETE`, unless the user explicitly authorizes a visible validation-debt override. Codex must not invent participants or findings.
