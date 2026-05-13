# Golden Cases

## Case 1: Direct support

Evidence: “A causes B.”  
Claim: “A causes B.”  
Expected: proven/probable depending on rule policy.

## Case 2: Invalid citation

Claim cites missing evidence ID.  
Expected: unsupported; no strict promotion.

## Case 3: Similar negation

Evidence: “A does not cause B.”  
Claim: “A causes B.”  
Expected: rejected/conflicted; not supported despite lexical similarity.

## Case 4: Time split

Evidence 1: “Before 2020, A was legal.”  
Evidence 2: “After 2020, A was illegal.”  
Expected: latent predicate `time_period` resolves apparent contradiction.

## Case 5: Subgroup split

Evidence 1: “Treatment works for subgroup S.”  
Evidence 2: “Treatment does not work for subgroup not-S.”  
Expected: latent predicate `subgroup`.

## Case 6: Source reliability conflict

Two sources conflict; one is downgraded.  
Expected: both worlds shown, posterior favors higher-quality source but uncertainty remains.

## Case 7: Expected record inaccessible

Claim depends on a high-duty record that is expected to exist but inaccessible.  
Expected: record_contingent; not rejected solely due to missing record.

## Case 8: Evidence of absence

Expected record is available, in-scope, and affirmatively lacks the claimed event.  
Expected: rejected or very unlikely unless a valid scope/context challenge exists.

## Case 9: Record not expected

Claim references a record type that ordinary process would not generate.  
Expected: no absence penalty; record dependency may be ignored or marked not_generated.

## Case 10: Withheld expected record

Expected record is controlled by an actor with exposure, requested, and not produced.  
Expected: competing benign and strategic missingness worlds; suppression hypothesis may affect likely-truth ranking but not strict proof.
