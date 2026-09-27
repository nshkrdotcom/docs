# Phase 3 Level-A structural/factual domain review packet

This is the required **human** validation packet for StoryWorld. It is prepared by the offline implementation pass but intentionally contains no fabricated reviews or scores.

**Current disposition (2026-09-26 HST):** the user explicitly deferred this Level-A pilot as visible validation debt in decision D045 so it does not block Phase 4. No case or reviewer result has been added. Keep this packet for the eventual human review; Phase 3's `COMPLETE` status is under the recorded exception, not evidence that this pilot occurred.

## Gate target

Per document 28, use at least **3 rights-cleared feature scripts or substantial feature-script excerpts** and at least **2 independent structural reviewers** for selected facts/events/relations. This is a pilot floor/target, not statistical calibration.

Do not use a screenplay merely because it can be found online. Record rights/provenance before analysis. Provider export permission is separate from local/human-review permission; Phase 3 itself needs no hosted provider call when frozen observations/records are already available.

## Material manifest for each case

Record outside publishable package fixtures if confidential:

```text
case_id
pseudonymous_title_or_label
rights_basis
rights_evidence_ref
allowed_uses
provider_export_allowed
human_review_allowed
redistribution_allowed
retention_policy
confidentiality_class
source_revision
review_scope
```

## Generate the review artifacts

For each case, compile the accepted screenplay revision plus frozen observations/records and save:

1. deterministic StoryWorld JSON reference;
2. deterministic StoryWorld Markdown reference;
3. exact source evidence excerpts/IDs already present in the packet;
4. selected queries covering facts/events/state, non-linear chronology, scope qualification where applicable, and causality where applicable;
5. any StoryWorld conflicts/unknown/ambiguous results.

No diagnosis/strategy or audience-response claim belongs in this phase.

## Independent reviewer form

Each reviewer works against screenplay source plus the generated reference. Record independently before reconciliation:

```text
reviewer_id: pseudonymous
case_id:
review_date:

source_grounding:
  supported_items:
  unsupported_items:
  missing_obvious_items:
  wrong_source_anchor_items:

event_fact_state_correctness:
  correct_items:
  incorrect_items:
  event_qualification_errors:

chronology_and_scope:
  correctly_unknown:
  incorrectly_forced_order:
  ambiguity_handled_well:
  ambiguity_mishandled:
  dream_memory_hypothetical_scope_errors:

causality:
  supported_edges:
  unsupported_edges:
  temporal_causal_conflations:

reference_usefulness:
  easy_to_verify:
  confusing_or_noisy:
  missing_context:

free_text_rationale:
```

## Reconciliation record

After independent reviews, record disagreements rather than silently forcing consensus. For every corrected implementation/data issue, cite the source revision and resulting repair commit. Separate:

- software defect;
- measurement/extraction error;
- legitimate interpretation disagreement;
- screenplay ambiguity;
- insufficient evidence;
- presentation/usability issue.

## Completion rule

Phase 3 may be marked `COMPLETE` only after engineering/runtime QC plus this recorded domain gate, unless the user explicitly authorizes an override that is recorded as visible validation debt. Fixtures, Codex review, or this empty template are not human validation.
