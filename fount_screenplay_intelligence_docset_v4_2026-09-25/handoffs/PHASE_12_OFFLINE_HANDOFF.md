# Phase 12 Offline Implementation Handoff

**Phase:** 12 — Discovery, Session Modes, and Scene Exploration  
**State:** `OFFLINE_IMPLEMENTED`, not `COMPLETE`  
**Overlay:** `fount_phase_12_overlay.zip` — 36 operations (23 add, 13 modify, 0 delete), SHA-256 `51ca6d00d7c1e7a871b08f2657127264886a63df8a0485b6a3a958b61b01bc2b`.

## What changed

Phase 12 extends the existing Workshop session/candidate/review model rather than adding another screenplay representation. Session progress now owns a noncanonical discovery record: explicit Draft/Explore/Inspect/Revise mode, evolving brief with history, fragments with adoption/retirement history, reverse-outline views, scene-card reorder proposals, writer decisions, selected candidate and pending question. The immutable opening request/base remain provenance.

A provider-free `Session.open/4` creates durable discovery sessions without Inference/Observe/System One/ASM credentials. Writer-origin manual typed edits enter the existing Candidate/API checks and review/Acceptance path. The CLI exposes open, fragment, brief, mode, outline, reorder, manual, edit and decision operations. Generated alternatives still use the existing Inference boundary.

Scene exploration can opt into a binding treatment contract: route ID + action/revelation/relationship/mixed mechanism, concrete tradeoffs, protected material and explicit brief-departure disclosure. Existing strategy payloads remain accepted when the treatment contract is absent.

## Writer evidence written

- A01 pool/map deterministic fixture: three materially different generated openings; accept one, reject one, leave one proposed; resume selected draft, protected map and pending question.
- A02 quiet-key Inspect fixture: source fact remains distinct from an interpretation such as forgiveness.
- A03 deterministic treatment fixture: concealment, voluntary relationship disclosure and accidental-action reveal materialize distinct pages; a mock returning three confession paraphrases is rejected.
- A10 provider-free manual/edit fixture: explicit acceptance, stale sibling refusal, idempotent same-candidate reacceptance, retained decisions after resume.
- Runnable PostgreSQL CLI example: fragment → brief → manual candidate → fragment adoption → manual edit → explicit accept → mode switch/resume. It is written but not run here.

## Actual offline checks

Focused Phase-9–12 Python source checks: **34/34 PASS**. Changed Python checks compile. Workflow schema and six Phase-12 JSON examples parse. Strict overlay dry-run, application to a clean extracted baseline, second dry-run, exact tree reproduction and ZIP integrity pass. Repository-wide Python discovery runs 95 tests with one supplied-snapshot import error for the absent `scripts/prune_deleted_directories.py` helper.

Elixir, Erlang and Mix are absent. Therefore formatter, compile, ExUnit, Credo, Dialyzer, ExDoc/package, PostgreSQL, CLI runtime, provider and live checks are **NOT_RUN**. No claim is made that the new Elixir code compiles or that the writer demonstration has executed.

## Preservation / risks for Codex

- Run the full prior-phase regression ladder: the new session effective-request overlay and manual candidate path touch durable Workshop state and acceptance sequencing.
- Verify treatment JSON-schema unions and exact generated-output validation against the actual `Fount.Writing.Schema` at compile/runtime.
- Verify provider-free CLI commands acquire no Inference/Observe clients in the real launcher and still have the expected PostgreSQL-only prerequisites.
- Verify the real persistence implementation gives the same idempotent/stale acceptance behavior as the continuation test seam.
- Keep canonical acceptance authoritative even if presentation-state recording must be repaired.
- Do not reintroduce direct SystemOneSDK/ASM dependencies or advance into Phase-13 rehearsal/voice/cinematic work.

Read `PHASE_12_IMPLEMENTATION_MATRIX.md`, `PHASE_12_PRESERVATION_AUDIT.md`, `PHASE_12_STATIC_CHECKS.json`, and `PHASE_12_RUNTIME_QC_HANDOFF.md`.
