# 18 — Adversarial Evidence and Likely-Truth Ranking

## Purpose

This document defines the access-aware extension of GCTS. The goal is to support likely-truth ranking in environments where evidence may be incomplete, asymmetrically controlled, selectively disclosed, or unavailable.

## Core principle

The system must never treat available evidence as the entire epistemic universe when the case structure implies relevant records may exist outside the runtime corpus. It must also never infer truth merely because evidence is missing.

The correct representation is a distribution over worlds that includes evidence, missingness, access, incentives, and uncertainty.

## Access-state taxonomy

| State | Meaning | Inference effect |
|---|---|---|
| `available` | Record is in the runtime corpus | Can directly support/refute claims |
| `inaccessible` | Record may exist but is unavailable | Creates access uncertainty |
| `sealed` | Record exists or likely exists but is restricted | Creates access uncertainty with known barrier |
| `withheld` | Record expected and requested but not produced | Supports missingness hypotheses, not direct truth |
| `destroyed` | Record existed or likely existed and no longer exists | Supports access/suppression hypotheses depending on timing and duty |
| `not_generated` | Record should not be expected to exist | Prevents false absence penalties |
| `unknown` | Access state cannot be classified | Increases epistemic/access uncertainty |

## Absence tests

A missing record can be treated as evidence of absence only when all conditions hold:

1. The record would normally be generated or the observation would normally occur.
2. The runtime corpus has a reliable access path to the record or observation.
3. The available record affirmatively lacks the expected event, fact, or trace.
4. The collection process is broad enough to capture the relevant signal.
5. The absence is not better explained by access restriction, deletion, non-generation, or scope mismatch.

Otherwise the claim is record-contingent, not rejected.

## Suppression hypothesis tests

A suppression hypothesis may enter a world when:

1. A record has high generation duty or expected observability.
2. The record is controlled by an actor with material exposure if the relevant claim is true.
3. The record is not produced, partially produced, delayed, narrowed, destroyed, or contradicted by weaker secondary material.
4. Benign missingness worlds remain represented.
5. The suppression hypothesis improves calibration or top-K coverage under validation.

Suppression hypotheses are soft/access predicates. They cannot establish strict proof.

## Institutional incentive modeling

Incentive features affect:

- source reliability priors;
- missingness likelihood;
- world energy;
- confidence;
- next-evidence recommendations.

They do not directly prove or refute claims.

## Report requirements

Every report with record-contingent claims must include:

- the claim posterior;
- strict support mass;
- confidence;
- record dependencies;
- access-state table;
- competing missingness worlds;
- what record production would do to the ranking.

## Failure modes

- Treating missing evidence as refutation without access basis.
- Treating motive to conceal as proof.
- Inventing suppressed records with no record-generation duty.
- Hiding benign missingness alternatives.
- Rendering likely-truth posterior as strict proof.
