# Phase 12 Runtime QC Report

**Date:** 2026-09-27 (Pacific/Honolulu)
**Status:** COMPLETE on applicable non-human engineering and preservation gates. Phase 13 remains `NOT_STARTED`.

## Applied state and dependencies

The user-applied Fount checkout began clean: `HEAD` `344bbc6764c519e0f150fa5a6da5aa1238104343`, tree `1906cd2d61a3dc33aed223212f4ac7b9531fa842`, and empty `git status --short`. Before repair, every one of the 36 paths in `PHASE_12_FILE_INVENTORY.json` matched its supplied result SHA-256; mismatches: zero. Elixir 1.20.3, Erlang/OTP 29 (`erts-17.0.5`), and PostgreSQL 18.6 ran the checks. Resolved boundaries: Inference 0.5.0 and transitive ASM 0.17.1 in Workshop; SystemOneSDK 0.6.0 from local source at `e757598a89e549274b979f0e77c6a4b2b6667752` behind Observe. `FOUNT_SYSTEM_ONE_SDK_PATH` selected that inspected local SDK source for Mix; no provider credentials were supplied to the Phase-12 CLI path. No direct ASM dependency or replacement Inference/System One API was added.

Repairs are committed in Fount as `39a3afa2cf1a6e98b5862f89f3b51b694f4a204e` (tree `9e405fb215a050b1ca0d90e3cc603f0e81e0d64e`). They touch 11 tracked Phase-12 files plus Workshop `mix.exs` and add `integration/phase_twelve_durable_writer_test.exs`; current source identities for all original paths and the two additional paths are in the inventory's `runtime_qc` section. The original overlay result hashes remain intact there for transport audit.

## Failures and repairs

- Initial formatter gate failed on supplied Workshop Phase-12 source and tests. Those files were formatted.
- Focused ExUnit initially failed because `Discovery.add_fragment/4` returned the whole discovery state rather than the new fragment; the next assertion showed `update_brief/4` returned the whole state rather than the effective brief. Both calls now return their saved item after persistence. The actual CLI artifact confirms the corrected shape.
- Initial compilation emitted default-argument/clause grouping warnings. Function headers and helper placement were repaired; warnings-as-errors compilation now passes.
- Initial strict Credo reported ten nesting/complexity findings. Focused helper extraction in Discovery, Request and CLI, plus a redundant `with` correction in Strategy, cleared them. Behavior remained covered by focused and full tests.
- Initial ExDoc gate warned that README's new discovery guide was absent from docs extras. Workshop `mix.exs` now includes the guide and Phase-12 example; warnings-as-errors ExDoc passes. The Workshop Hex archive contains both paths.
- The supplied snapshot's Python `prune_deleted_directories` import error does not reproduce in this checkout: `scripts/prune_deleted_directories.py` exists and its four tests pass.

## Executed gates

All final commands exited 0. Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`; database commands also used `FOUNT_DATABASE_URL=ecto://home@localhost:55432/fount_phase12_qc_20260927` and `MIX_ENV=test`.

| Command | Result |
|---|---|
| Root `mix ci` | Pass: formatter, unused-lock check, warnings-as-errors compile, 343 workspace tests (Core 71, Observe 65, Intelligence 138, Workshop 69), compiled architecture (`source_and_compiled`, 289 source files, zero violations), strict Credo (zero issues), Dialyzer (zero errors/skips), ExDoc with warnings as errors |
| Workshop `mix test` on four Phase-12 writer-workflow files | 6 pass, including A01/A02/A03/A10 and negative treatment validation |
| `python3 -m unittest discover -s scripts/tests` | 98 pass, zero errors |
| Each package `FOUNT_PACKAGE_BUILD=1 mix hex.build` | Four archives pass; inspected Workshop inner archive for discovery guide and Phase-12 README/JSON examples |
| Core `MIX_ENV=test mix ecto.migrate` | Pass on disposable PostgreSQL database; all current migrations applied |
| Core / Intelligence / Workshop `MIX_ENV=test mix test integration` | 11 / 4 / 17 pass, respectively |
| Workshop `MIX_ENV=test mix test integration/phase_twelve_durable_writer_test.exs` | 1 pass against actual PostgreSQL store |
| Phase-12 README CLI commands, each a fresh Mix invocation | Open → fragment → brief → manual candidate → adopt → manual edit → accept → switch mode → session export all pass |

The new real-store regression observes the saved `Uneasy recognition` brief in the subsequent scripted generation request while the opening request's `intended_effect` remains absent. It verifies a real manual edit candidate, accepted database head, idempotent reacceptance of that same candidate, stale sibling refusal, rejection and decisions after resume. Core/Workshop integration retains earlier persistence, accept/reject, rebase and resume coverage. The final `mix ci` log is `/tmp/fount-phase12-final-ci.log`; integration and Python logs are `/tmp/fount-phase12-*-integration.log` and `/tmp/fount-phase12-python.log` in this QC environment.

## Writer scenario evidence

- **W01/W02:** The provider-free CLI opened a Draft session without prewrite analysis or generation credentials, captured an unattached image, saved a revised brief, adopted the fragment into a real candidate, edited it, accepted it and switched to Inspect. Fresh resume retained the opening `draft` request, current `inspect` mode, mode/brief/fragment history, pending question and selected candidate. Reverse-outline/card-reorder/classify/link/retire noncanonical behavior passes the focused discovery test; real-store effective brief execution is proven by the new integration test.
- **A01:** The deterministic pool/map test creates three different action/relationship/revelation openings; one is explicitly accepted, one rejected, one unchosen. Fresh resume retains accepted draft, protected map and pending question.
- **A02:** The Inspect test keeps key placement as source fact and forgiveness as labeled interpretation; the unchanged source remains available.
- **A03:** Actual scripted pages show concealment, voluntary disclosure and accidental action. The three-confession control fails treatment validation. Added negative tests reject missing tradeoffs and a departure that the brief forbids.
- **A10:** The real PostgreSQL test and CLI artifacts prove manual candidate/edit/acceptance; the test proves stale sibling refusal, idempotent retry and durable decisions.
- **W11:** Existing finite preflight/caps and partial-result suite passed in full CI. The provider-free CLI performed no paid generation or measurement calls.

Inspected CLI artifacts under `/tmp/fount-phase12-cli-qc`: session `a86020c3-e2cc-4d4f-8ff9-94061b87ef4d`, selected candidate `857cef7c-bcee-44ad-b106-8dc5c4ad6b28`, accepted head revision `dadda309-a1eb-412b-bdb2-da058c4e75f2`. The resumed Fountain page reads: `They fold the wet paper map on the concrete. Neither lets go first.` The database query showed that same head and two retained candidates. The disposable database was dropped after inspection; the exported artifacts and QC logs remain under `/tmp`. `session.json` shows opening mode `draft`, current mode `inspect`, saved protected strengths and pending question `Do they recognize the handwriting?`.

No live provider check or optional D046 human study was commissioned or run. Scripted fixture outcomes establish deterministic engineering behavior and do not establish live-model creative quality or writer usefulness. Phase 13 remains `NOT_STARTED`.