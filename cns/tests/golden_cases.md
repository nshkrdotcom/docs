# Golden Cases

## Case 1: Direct support

Evidence: “A causes B.”  
Claim: “A causes B.”  
Expected: proven/probable depending on rule policy.

## Case 2: Invalid citation

Claim cites missing evidence ID.  
Expected: unsupported; no promotion.

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
