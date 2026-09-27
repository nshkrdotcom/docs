# Phase 7 offline source handoff — Capabilities B

**Status:** `OFFLINE_IMPLEMENTED`, not COMPLETE. **Stop before Phase 8.**

## What is delivered

The strict Fount overlay implements all four Phase-7 capability families:

- Audience / Reader Experience;
- Sequence Movement;
- Dialogue Interaction;
- Setup / Payoff and Motifs.

It adds four closed Observe lenses, four pure capability evaluators, playbook/registry integration, typed dialogue context validation, a non-linear feature-style fixture, provider-free example, documentation and focused tests. It deliberately reuses the verified Reader, Temporal and StoryWorld layers instead of creating competing audience/timeline models.

## Screenplay-writing outcome

A writer can inspect first-exposure audience questions/expectations/threats/suspense/curiosity/surprise/comprehension/handoff pressure; see how a run of scenes changes objectives/constraints/stakes/knowledge/relationships/choices/tactics without reducing movement to one score; inspect adjacent dialogue exchanges for response/evasion/subtext/exposition/tactic/status/knowledge asymmetry/repetition/voice; and trace setup/payoff/motif lifecycles even when presentation order differs from story time.

The synthetic watch/ledger fixture is intentionally non-linear: a present-day clue is shown before a later-presented flashback establishing the watch's earlier origin. The capability packets preserve that presentation choice while keeping diegetic story-time relations separate.

## Exact source/API boundaries inspected

The five attachments were identified by contents. SystemOneSDK is 0.6.0, Inference is 0.5.0, and ASM is 0.17.1. Phase 7 adds no direct call to any of them. Semantic acquisition remains behind existing `Fount.Observe`; generation remains Workshop/Inference-owned. Phase 7 directly reuses actual Fount APIs including Selection evidence, ContextBuilder validation, Reader reduction/inspection, Temporal sequence/setup-payoff views, and StoryWorld story-time/causal queries.

## Offline evidence actually executed

- Four new lens JSON assets parsed successfully.
- All 41 Phase 1–7 Python source-contract tests passed.
- `py_compile` passed for the changed source-check scripts plus overlay/snapshot helpers.
- Overlay ZIP integrity passed.
- Strict overlay dry-run and strict apply passed against the decoded pristine Fount source with only the explicit terminal-LF allowance.
- All 30 applied result SHA-256 values matched the manifest.
- The applied tree reproduced the 519-file desired source tree when generated Python caches and the applier backup journal were excluded.
- Repository-wide Python discovery found 50 tests and reported one import error because the supplied Fount XML omits `scripts/prune_deleted_directories.py` while retaining its test. This is an input-snapshot limitation, not claimed as a pass.

## Checks not run here

Elixir, Erlang and Mix are absent. No claim is made for formatter, compile, ExUnit, root/full CI, compiled architecture, Credo, Dialyzer, ExDoc, package archives, PostgreSQL integrations, Workshop acceptance/PDF/table-read gates, live providers, or human/domain review.

## Required next action

The user applies and commits `fount_phase_07_overlay.zip` and the complete updated docset. Codex starts from those applied commits, verifies/reconciles the real checkout, runs the Phase-7 focused and full preservation/QC ladder, repairs only Phase 7 as needed, records actual evidence, and updates the Phase-7 handoff/inventory. **Do not reapply this overlay. Do not begin Phase 8.**