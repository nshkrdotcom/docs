# Phase 13 Runtime QC Report

**Date:** 2026-09-27 (Pacific/Honolulu)
**Status:** COMPLETE on applicable non-human engineering and preservation gates. Phase 14 remains `NOT_STARTED`.

## Applied state and source identity

The user-applied Fount checkout started clean at commit `9ac5148c1d140b4ca2f077dfd5d0fe316c7881a8`, tree `55e0216cd8c1ec12eb15fd4c2f0e683f3f4fd827`. Before repair, all 24 paths in `PHASE_13_FILE_INVENTORY.json` matched their original overlay `result_sha256` values; mismatches: zero. The repair commit is `26da17e9ddb34d0d933f4389da0036c77490767a`, tree `fd17e722b52121fe2b7447c0d8161420f71f3994`. The inventory retains the immutable overlay hashes and records current repair hashes separately. The Fount checkout is clean after that commit.

Elixir 1.20.3, Erlang/OTP 29 (`erts-17.0.5`), Python 3.14.4, PostgreSQL server/client 18.6, Node v24.19.0 and npm 11.17.0 were used. Workshop resolved Inference 0.5.0 and Agent Session Manager 0.17.1. `FountWorkshop.Launcher` still builds `Inference.Client.agent_session!` with `Inference.Adapters.ASM`. The local SystemOneSDK 0.6.0 source at `e757598a89e549274b979f0e77c6a4b2b6667752` was selected through `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`; it remains behind Observe. No provider call ran.

## Failures and repairs

- Initial `mix blitz.workspace format --check-formatted` failed on Phase-13 Workshop files. `mix format --force` was required to update all files (the ordinary `mix format` did not refresh every stale formatted file). The final full CI formatter check passed.
- Initial warnings-as-errors compile stopped on missing test dependencies. `mix setup` without `FOUNT_SYSTEM_ONE_SDK_PATH` failed because `system_one_sdk ~> 0.6.0` has no published Hex resolution in this checkout. The established local SDK path made `mix setup` pass. Compilation then found an Elixir default-argument warning in `Rehearsal.add/4`, repaired with a function header.
- First full CI found an obsolete six-profile assertion in `test/pass_test.exs`. It now expects and loads all nine shipped profiles.
- Strict Credo found five Workshop issues: alias order, redundant final `with` clause, nested rehearsal/voice validation, and pass-inspection complexity. Small helper extraction cleared them while preserving the existing request and Store interfaces.
- Dialyzer found an unreachable malformed-target fallback. A new red-green regression showed a non-list `voice_exemplars` raised before validation. `VoiceProtection.exemplar_targets/1` now returns the existing `:invalid_voice_exemplars` error for malformed lists; Dialyzer reports zero errors.
- One intermediate full CI run hit a scheduling-sensitive existing Observe timeout test: its 100 ms whole-call timer expired before a stub-start message under parallel load. The same test passed alone, and the final unchanged full CI run passed 65/65 Observe tests. No Observe source or test was changed.
- A new real PostgreSQL regression uses existing `Persistence`, `Store`, `Session`, and `Rehearsal` surfaces to verify adopted/rejected decisions after a fresh read, noncanonical adopted context, exclusion of rejected material, immutable opening request and unchanged canonical head. No migration was needed.
- The voice test now exercises `ReviewGate.validate/3`: an action-only candidate passes exact repeated multilingual pins; a normalized dialogue candidate fails as a deterministic hard requirement even with an override.

## Executed engineering gates

All commands in this table exited 0 on the final repaired source. Mix commands used the local `FOUNT_SYSTEM_ONE_SDK_PATH` above. Database commands also used `FOUNT_DATABASE_URL=ecto://home@localhost:55432/fount_phase13_qc_20260927` and `MIX_ENV=test`.

| Command (working directory where relevant) | Result |
|---|---|
| Root `mix ci` | PASS: root/workspace format and lock checks; warnings-as-errors compile; 347 tests (Core 71, Observe 65, Intelligence 138, Workshop 73); compiled architecture `source_and_compiled`, 292 source files, zero violations; strict Credo zero issues; Dialyzer zero errors/skips; four ExDoc builds with warnings as errors. Log: `/tmp/fount-phase13-ci-final.log`. |
| Workshop `mix test` on the four `test/writer_workflows/phase_thirteen_*.exs` files | 4 passed. |
| Workshop `mix test` on the four `phase_twelve_*.exs` writer-workflow files | 6 passed, including discovery/session and A10 stale/idempotent behavior. |
| `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -v` | 105 passed. Log: `/tmp/fount-phase13-python-final.log`. |
| Core `MIX_ENV=test mix ecto.migrate` on disposable PostgreSQL database | All current migrations applied; no Phase-13 migration created. |
| Core / Intelligence / Workshop `MIX_ENV=test mix test integration` | 11 / 4 / 18 passed. Logs: `/tmp/fount-phase13-{fount,fount_intelligence,fount_workshop}-integration.log`. |
| Workshop `MIX_ENV=test mix test integration/pdf_export_test.exs integration/phase_twelve_durable_writer_test.exs integration/phase_thirteen_rehearsal_durability_test.exs` | 6 passed, including PDF, real-store Phase-12 stale/idempotent acceptance, and Phase-13 rehearsal resume. |
| Workshop `mix test test/table_read_test.exs` | 2 passed. |
| Each package `FOUNT_PACKAGE_BUILD=1 mix hex.build` | Four builds passed: `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`. Workshop archive contents were inspected and include the three new profile JSON assets, Phase-13 guide and example README. Logs: `/tmp/fount-phase13-<package>-hex.log`. Generated archives were removed after inspection. |
| `git diff --check` | PASS; repair commit created with a clean source checkout. |

The disposable database was created with `createdb -h localhost -p 55432 -U home fount_phase13_qc_20260927` and removed with the matching `dropdb` after verification. A direct SQL read of the saved rehearsal session showed statuses `["adopted", "rejected"]` and canonical flags `[false, false]`.

## Writer-scenario evidence and limits

- **W04 / A02:** `action_visual`, `sound_space`, `cinematic_rhythm` and `transition` all validate as shipped profiles. The A02 fixture compares actual stable-ID screenplay values: one candidate holds on thinning steam, another uses an offscreen elevator bell. Both keep the original silence and `Not today. Not today.` dialogue, with zero language delta. The original remains the unchanged base. A fluent forgiveness-speech control produces a real language delta and is explicitly rejected. `Comparison` uses `Screenplay.diff/2`; generator summary remains `generator_claim` with `generator_claim_is_evidence: false`.
- **W06 / A04:** Writer `protected_text` becomes required `pin_text` constraints through `Request` and the existing `Constraints`/`ReviewGate` path. Exact cue, repetition, French/Japanese Unicode and action fragments survive an action-only edit. Replacing the protected dialogue with `Not today.` fails the deterministic check and hard-blocks review even when overridden. Voice context says similarity is not a quality score and language/cultural authenticity requires writer/human review.
- **W05 / A05:** Active and rejected invented boat/marina claims are absent from `Rehearsal.generation_context/1`. Adoption needs actor and note; only the adopted boat history becomes traceable, noncanonical project material for later exploration. The database resume regression preserves adoption/rejection, keeps the opening request free of invented claims, and leaves the accepted screenplay head unchanged. A direct SQL read confirmed both saved records have `canonical: false`.

These are deterministic engineering fixtures, not a live-model quality claim. No live Inference/ASM or System One call was made. Optional D046 human/domain comparison and language review remain `NOT_RUN` validation debt; no human preference, cultural authenticity, or measured audience result is claimed. Phase 14 remains `NOT_STARTED`.