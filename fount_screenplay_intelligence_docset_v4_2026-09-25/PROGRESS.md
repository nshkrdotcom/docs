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
| 1 | Direct Architecture Supersession and Probe Removal | OFFLINE_IMPLEMENTED | `fount_phase_01_overlay.zip` | pending | Four-package source written; runtime QC, exact checkout/preimage reconciliation and excluded-remnant inspection pending |
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
| 12 | Discovery, Session Modes, and Scene Exploration | NOT_STARTED | — | — | W01–W03/W11; document 36 |
| 13 | Cinematic Revision, Rehearsal, and Voice | NOT_STARTED | — | — | W04–W06; document 36 |
| 14 | Research, Notes, and Consequential Revision | NOT_STARTED | — | — | W07–W09; document 36 |
| 15 | Read, Share, Resume, and Prove Usefulness | NOT_STARTED | — | — | W01/W10–W12; document 36 |
| 16 | Final Integration and Acceptance | NOT_STARTED | — | — | Full engineering and writer-workflow acceptance |

## Phase handoff log

Add one row after every offline delivery and runtime-QC completion.

| Date | Phase | Event | Artifact / source identity | Result |
|---|---:|---|---|---|
| 2026-09-25 | — | Architecture docset prepared | this docset | ready for Phase 1 |
| 2026-09-26 | — | Screenplay-first research and four-XML handoff revision | documents 32–36 | Specification expanded; no implementation phase completed |
| 2026-09-26 | 1 | Source implementation delivered | `fount_phase_01_overlay.zip`; attachment identities in `handoffs/PHASE_01_INPUTS.json` | OFFLINE_IMPLEMENTED; runtime and real-checkout verification pending |

## Non-negotiable progress rule

Do not begin the next phase from the offline overlay alone. Use the source snapshot produced **after** runtime QC/fixes of the prior phase.

## Domain-review state note

For phases that carry a human/domain pilot under `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`, `DOMAIN_REVIEW_PENDING` may appear between engineering/runtime QC and `COMPLETE`.

This does not apply retroactively to Phase 1. Human/domain validation must never be fabricated by an offline or runtime agent.

## Current Phase 1 delivery - 2026-09-26

Source overlay: `fount_phase_01_overlay.zip`. Complete updated docset: `fount_phase_01_docset.zip`. Runtime agent prompt: `FOUNT_PHASE_01_CODEX_QC_HANDOFF.md` (also retained under `handoffs/`).

The user applies and commits. Codex starts from those applied commits, repairs this phase, updates this progress record and produces fresh sealed snapshots. Do not reapply the ZIP or begin Phase 2.

Python source/transport checks and all unrun runtime gates are recorded in `handoffs/PHASE_01_STATIC_CHECKS.json`. Exact checkout byte identity is unverified because the four input exports are unsealed. The strict manifest is based on decoded source bodies; no mismatch bypass or unknown-file deletion is permitted. Elixir compilation/tests, the AST/BEAM gate, DB/PDF/speech and live checks remain unrun.
