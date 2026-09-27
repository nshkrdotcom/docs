# Phase 4 offline implementation handoff

**Phase:** 4 — Temporal Views and Forward-Reader Engine  
**Status at source delivery:** `OFFLINE_IMPLEMENTED`  
**Stop line:** Phase 5 is not implemented by this delivery.

## What was implemented

The Fount overlay adds pure `fount_intelligence` temporal and Reader semantics on top of the QC-corrected Phase-3 StoryWorld core:

- event/story-time-qualified character, relationship, resource, commitment, knowledge and sequence views;
- explicit setup/payoff inspection from commitments and typed causal links;
- story-time connected-region recomputation support without inventing a universal chronology;
- a strict presentation-order first-reader reducer with immutable checkpoints;
- question, expectation, promise, threat, reveal, character-epistemic, relationship, suspense, curiosity, surprise, comprehension-risk, alignment and forward-pull tracks;
- future-evidence rejection and private note/boneyard/omitted-material exclusion;
- Reader-versus-diegetic knowledge comparison;
- presentation-suffix recomputation boundaries;
- screenplay-first fixture/tests and a provider-free Phase-4 example;
- writer-facing guide/docs.

The source implementation deliberately makes no direct System One, Inference, database, filesystem, network or acquisition call. The supplied System One 0.6.0 and Inference 0.5.0 public facades were inspected to confirm those boundaries rather than invent APIs.

## Offline evidence actually executed

- `python3 scripts/tests/test_phase_four_source.py` — PASS, 5 tests.
- direct forbidden-boundary scan over Phase-4 pure source — PASS.
- `bash -n scripts/verify_handoff.sh` — PASS.
- strict overlay dry-run against a fresh decoded Fount baseline — PASS.
- strict overlay apply plus byte-equivalence check — PASS for all 23 payloads.
- repository-wide Python source suite — **not green**: 28 tests discovered with one import error because `scripts/prune_deleted_directories.py` is absent from the supplied Fount snapshot. This is recorded, not hidden.

No Elixir/Erlang/Mix executable was available. No ExUnit, formatting, warnings-as-errors compile, Credo, Dialyzer, docs, package, DB/PDF/writer regression, provider, or human-reader gate is claimed passed.

## Artifact contents

`fount_phase_04_overlay.zip` contains 12 added and 11 modified files, no deletions, plus the embedded strict manifest. `PHASE_04_FILE_INVENTORY.json` records each preimage/result hash. The complete docset records the current phase as `OFFLINE_IMPLEMENTED` until Codex supplies runtime evidence.

## Human/domain gate

The required first-reader pilot is prepared in `PHASE_04_DOMAIN_REVIEW_PACKET.md`. It has not been run. Fixtures and model outputs do not count as human validation.

## Next action

The user applies and commits the overlay and complete docset. Codex starts from those applied commits, **does not reapply the overlay**, runs/repairs the Phase-4 engineering ladder, records the actual post-repair source identity and results, and then stops before Phase 5. If engineering QC passes but no real reader pilot or explicit user override exists, the proper phase status is `DOMAIN_REVIEW_PENDING`.
