# Phase 5 offline source handoff — Diagnosis and Multi-Pass Playbook Shell

**Status:** `OFFLINE_IMPLEMENTED`, not `COMPLETE`.

This delivery starts from the docset's recorded post-Phase-4 checkpoint and implements only Phase 5. The supplied XMLs are raw Repomix snapshots rather than authenticated Git seals, so the historical verified Phase-4 Fount commit `cfde46cd2f654e050cbb9b5dbe32501625510c69` is context, not an invented identity for these exact attachment bytes.

## Writer outcome

A writer can state a concrete concern, intended effect and protected strengths, select or default to exact screenplay evidence, and run one of ten baseline writer tasks through a controlled multi-pass analysis. The result keeps evidence, derived state, competing diagnoses, abstentions, counterevidence, alternatives, missing evidence, possible investigations and resource coverage inspectable. It does not generate replacement pages and it does not issue a universal screenplay-quality score.

The Phase-5 shell uses the actual existing Observe APIs. It performs a first measurement pass over supplied screenplay evidence, purely reduces those results, builds closed lens-declared context from plain Intelligence state, performs contextual support/counterevidence measurement, and returns to pure diagnosis. Source-selection truncation, provider-request caps, measurement budgets and failed/missing acquisition produce partial coverage rather than a false clean result.

## Delivered Fount surface

The strict overlay contains 36 file operations: 22 additions, 14 modifications and no deletions. The exact inventory and hashes are in `PHASE_05_FILE_INVENTORY.json`. Major additions are the pure Diagnosis namespace, `Acquisition.Planner`, `Acquisition.ContextBuilder`, the two diagnosis lenses, `WriterRegistry`, `WriterRunner`, `WriterPacket`, deterministic renderer, Phase-5 example and focused tests.

Existing sixteen low-level playbooks and public analysis paths remain intact. No Phase-6 capability family is implemented.

## Dependency/API inspection

`PHASE_05_INPUTS.json` records all five input hashes and inspected APIs. The supplied SystemOneSDK is 0.6.0, Inference is 0.5.0 and Agent Session Manager is 0.17.1. Phase 5 adds no direct call to any of them: System One remains behind Observe, Inference remains Workshop-owned, and ASM is inspected to verify the actual Inference/session boundary. The shell calls real Fount Observe `Context`, `Lens`, `Request`, `preflight/evaluate`, `Budget` and `Sandbox` contracts.

## Checks actually executed

See `PHASE_05_STATIC_CHECKS.json`. The Phase-5 Python source gate, JSON parsing, pure Diagnosis source-boundary scan, shell syntax check and overlay validation/apply/byte comparison pass. Repository-wide Python discovery has one pre-existing input-gap error because `scripts/prune_deleted_directories.py` is absent from the supplied source. No Elixir/Erlang/Mix executable is available here.

Therefore all ExUnit tests, formatter, compile, full CI, compiled architecture gate, Credo, Dialyzer, ExDoc, package inspection, DB/Workshop/PDF preservation, the Phase-5 example, live providers and human review are **unrun** in this source-writing environment.

## Optional human review

`PHASE_05_DOMAIN_REVIEW_PACKET.md` keeps the diagnosis/usefulness study protocol. It was not run and remains validation debt under D046.

## Required next action

The user applies and commits `fount_phase_05_overlay.zip` and the complete updated docset. Codex starts from those applied commits, verifies payload identity, compiles/tests/repairs Phase 5, updates the runtime QC report/progress/integrity evidence, and stops before Phase 6. Codex must not reapply this overlay.