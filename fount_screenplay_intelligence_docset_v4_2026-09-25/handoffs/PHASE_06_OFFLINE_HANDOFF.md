# Phase 6 offline source handoff — Capabilities A

**Status:** `OFFLINE_IMPLEMENTED`, not COMPLETE. **Stop before Phase 7.**

## What is delivered

The strict Fount overlay implements all four Phase-6 capability families:

- Scene Engine;
- Agency and Causality;
- Character Trajectory;
- Relationship Dynamics.

It adds source-visible Observe measurements, pure capability reasoning/diagnosis, non-linear StoryWorld fixtures, Sandbox playbook coverage and writer-facing analysis packets while preserving Workshop as the owner of creative page generation and acceptance.

## Screenplay-writing outcome

A writer can select screenplay material and inspect scene objective/opposition/stakes/urgency/tactics/turns/consequences and entry/exit candidates; trace explicit character decisions through causal reach, alternate support and consequence latency; compare reader-visible character trajectory with diegetic state relationships without demanding transformation; and inspect directional pair/group relationship movement across trust, leverage, obligation, concealment and other dimensions. Findings remain source-grounded hypotheses with limitations rather than universal screenplay rules.

## Exact source/API boundaries inspected

The five attachments were identified by contents. SystemOneSDK is 0.6.0; Inference's public package is 0.5.0; ASM is 0.17.1. Phase 6 does not call any of those directly. It uses the existing `Fount.Observe` acquisition boundary and pure `Fount.Intelligence.StoryWorld` APIs. The guide maps results to existing Workshop proposal APIs only after a writer chooses a strategy; no Phase-9 wiring is added.

## Offline evidence actually executed

- Phase-6 Python source gate: 8 tests passed.
- Four new lens JSON assets parsed successfully.
- direct forbidden-token scan of eight pure capability modules passed.
- Phase-7 capability-module absence check passed.
- `bash -n scripts/verify_handoff.sh` passed.
- strict ZIP integrity passed.
- actual `handoff/apply_overlay.py` strict dry-run passed against the decoded Fount baseline.
- strict apply passed on a clean copy and reproduced the 503-file working tree byte-for-byte (ignoring the applier's backup journal directory).
- repository-wide Python discovery ran 43 tests and reported one error: the pre-existing missing `scripts/prune_deleted_directories.py` helper imported by `test_prune_deleted_directories.py`.

## Checks not run here

Elixir, Erlang and Mix are absent. Therefore no claim is made for formatter, compile, ExUnit, root/full CI, compiled architecture, Credo, Dialyzer, ExDoc, package archives, PostgreSQL integrations, Workshop acceptance/PDF/table-read gates, live providers, or human/domain review.

## Required next action

The user applies and commits `fount_phase_06_overlay.zip` and the updated docset. Codex starts from that applied commit, verifies/reconciles the actual checkout, runs the Phase-6 focused and full preservation/QC ladder, repairs only Phase 6 as needed, records actual evidence, and updates the Phase-6 handoff/inventory. Codex must not reapply this overlay and must not begin Phase 7.