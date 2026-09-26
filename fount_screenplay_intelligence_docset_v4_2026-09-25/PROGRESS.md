# Implementation Progress

**Target architecture:** `fount` + `fount_observe` + `fount_intelligence` + `fount_workshop`  
**Current next phase:** Phase 1 — Direct Architecture Supersession and `fount_probe` Removal

## Status values

```text
NOT_STARTED
OFFLINE_IMPLEMENTED
QC_BLOCKED
QC_IN_PROGRESS
DOMAIN_REVIEW_PENDING
COMPLETE
```

Runtime QC may establish engineering completion; phases with required human/domain pilots also require the domain gate (or an explicit user override recorded as validation debt) before `COMPLETE`.

| Phase | Name | Status | Offline overlay | Runtime QC report | Notes |
|---:|---|---|---|---|---|
| 1 | Direct Architecture Supersession and Probe Removal | NOT_STARTED | — | — | Creates final topology and deletes Probe directly |
| 2 | Observe Measurement Substrate Hardening | NOT_STARTED | — | — | Contracts, context schemas, calibration, L1, Sandbox |
| 3 | Story-World Pure Core | NOT_STARTED | — | — | StoryWorld namespace |
| 4 | Temporal and Forward-Reader Engine | NOT_STARTED | — | — | Temporal + Reader pure reducers |
| 5 | Diagnosis and Multi-Pass Playbook Shell | NOT_STARTED | — | — | Diagnosis + Acquisition + Playbooks |
| 6 | Capabilities A: Scene/Agency/Character/Relationship | NOT_STARTED | — | — | Families 1–4 |
| 7 | Capabilities B: Audience/Sequence/Dialogue/Setup-Payoff | NOT_STARTED | — | — | Families 5–8 |
| 8 | Capabilities C: Emotional/Theme/Genre/Revision | NOT_STARTED | — | — | Families 9–12 |
| 9 | Workshop Intelligence Integration | NOT_STARTED | — | — | Existing creative workflows enhanced |
| 10 | Durable Analysis Persistence, Reuse, and Recomputation | NOT_STARTED | — | — | L2 persistence + immutable result reuse + recomputation frontiers |
| 11 | Scaled Calibration/Evaluation/Robustness/Live Verification | NOT_STARTED | — | — | Scales earlier domain pilots into corpus/calibration/live gates |
| 12 | Final Integration and Acceptance | NOT_STARTED | — | — | Final cleanup/package/readiness |

## Phase handoff log

Add one row after every offline delivery and runtime-QC completion.

| Date | Phase | Event | Artifact / source identity | Result |
|---|---:|---|---|---|
| 2026-09-25 | — | Architecture docset prepared | this docset | ready for Phase 1 |

## Non-negotiable progress rule

Do not begin the next phase from the offline overlay alone. Use the source snapshot produced **after** runtime QC/fixes of the prior phase.

## Domain-review state note

For phases that carry a human/domain pilot under `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`, `DOMAIN_REVIEW_PENDING` may appear between engineering/runtime QC and `COMPLETE`.

This does not apply retroactively to Phase 1. Human/domain validation must never be fabricated by an offline or runtime agent.
