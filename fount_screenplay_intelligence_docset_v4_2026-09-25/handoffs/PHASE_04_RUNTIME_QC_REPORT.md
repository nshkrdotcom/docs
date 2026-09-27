# Phase 4 runtime QC — Temporal Views and Forward-Reader Engine

**Date:** 2026-09-27 HST. **Engineering result:** passed. **Phase status:** `COMPLETE` under D046; first-reader pilot unperformed validation debt. No Phase-5 work, hosted-provider call, or human pilot was performed.

## Source identity and baseline

- Applied Fount commit: `bf20ede6bd3c868fae37b1dda61061767adc7899`; applied complete docset commit: `a59aea645547975122fea11af0ceabe675979c99`. Both checkouts were clean at entry.
- All 23 applied Phase-4 files matched `PHASE_04_FILE_INVENTORY.json` byte hashes. The embedded overlay manifest SHA-256 was `b680ce364dd7243b2cae21bab645858af4dbe6f4cb428e22a547139931a44317`, matching the inventory. No mismatch bypass or baseline overwrite was needed. The supplied raw Repomix XML was unsealed and carries no current source Git identity; none is inferred.
- Post-repair Fount commit: `cfde46cd2f654e050cbb9b5dbe32501625510c69`; tree `2f6e7e6c9514bab1962c9195c518076646220458`, clean checkout. Eleven changed-file applied and post-QC hashes/lengths are in the inventory's `repair_payloads`. The manifest remains the historical *applied overlay* identity; it is not relabeled as the post-QC payload.
- Package resolution used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` from the established Phase-3 checkout policy. No dependency declaration was changed.

## Executed gates

Commands ran from Fount root unless a package directory is shown. `SDK` below abbreviates the exact environment assignment above. Exit codes are observed. The first runs matter: bare `bash scripts/verify_handoff.sh --offline` exited 1 for missing SDK resolution and Phase-4 syntax; the exact same command with `SDK` exited 0 after repair.

| Command | Exit | Evidence |
|---|---:|---|
| `mix format --check-formatted`; `mix compile --warnings-as-errors` (root) | 0, 0 | Workspace root baseline. Package source required repairs below. |
| `SDK mix ci` (root, final) | 0 | Four-package format, lock, warnings-as-errors compile, test, architecture, strict Credo, Dialyzer, and ExDoc warnings-as-errors passed. Final log `/tmp/fount-phase4-root-ci-final.log`. |
| `SDK mix test`; `SDK mix fount.architecture` (root) | 0, 0 | Core 71, Observe 59, Intelligence 74 before final extra regression / 75 in final CI, Workshop 58: **263 final tests**. Architecture: 272 compiled modules, 234 source files, zero violations. |
| `python3 scripts/tests/test_phase_four_source.py`; `python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v` | 0, 0 | Five Phase-4 source checks; 31 Python tests. The actual checkout contains `handoff/prune_deleted_directories.py`, imported by the old cleanup test; the offline XML-only missing-helper issue does not apply here. |
| `SDK bash scripts/verify_handoff.sh --offline` | 0 | All 17 package dependency/format/compile/test/architecture rows passed; `/tmp/fount-handoff-offline-20260927T060214-383762/status.tsv`. |
| `(cd packages/fount_intelligence && SDK mix format --check-formatted; mix compile --warnings-as-errors; mix credo --strict; mix dialyzer; mix docs --warnings-as-errors)` | 0 each | Strict Credo zero issues; Dialyzer zero errors; ExDoc clean. CI also ran these across all four packages. |
| `(cd packages/fount_intelligence && SDK mix test test/temporal_views_test.exs)` | 0 | 5 passed. |
| `(cd packages/fount_intelligence && SDK mix test test/reader_forward_test.exs)` | 0 | 12 passed after adding boneyard/omitted regression. |
| `(cd packages/fount_intelligence && SDK mix test test/reader_story_world_differential_test.exs)` | 0 | 2 passed. |
| `(cd packages/fount_intelligence && SDK mix run examples/phase_four.exs)` | 0 | Provider-free non-linear Reader/Temporal demonstration ran. |
| `FOUNT_DATABASE_URL=postgres://home@127.0.0.1:55432/fount_phase4_qc MIX_ENV=test mix ecto.create`; `mix ecto.migrate` in Core | 0 each | Isolated Phase-4 database only; no user database reset/drop. |
| Same URL, `MIX_ENV=test mix test integration` in Core and Workshop (`SDK` set for Workshop) | 0, 0 | Core 11; Workshop 14, including persistence, writer and export checks. |
| Same URL/SDK, `MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase4-writer-accept --decision accept --pdf` in Workshop | 0 | Mock/Observe Sandbox writer acceptance and two-page PDF. No hosted provider. |
| `(cd packages/<package> && SDK FOUNT_PACKAGE_BUILD=1 mix hex.build --output /tmp/fount-phase4-<package>.tar)` for all four packages | 0 each | Archives inspected: 117/67/68/81 members. Intelligence contains new guide and example; no build/deps/node_modules/.env/PDF/nested archive content. Nothing published. |

## Repairs

1. Repaired malformed Reader default argument and corrected its primary function to `reduce/3`, preserving `compile/3` as the documented convenience call. The original declaration could not format or compile.
2. Split joined `test_helper.exs` calls onto separate lines. The delivered helper could not parse.
3. Formatted eleven delivered Intelligence files, then refactored new Reader/Temporal functions and event validation to satisfy strict Credo without weakening checks. The future-evidence revision, visibility, point-order, and provenance guards remain active.
4. Used a deterministic plain-list graph walk for `StoryTime.connected_nodes/2` to clear Dialyzer opaque `MapSet` errors while preserving connected-region semantics.
5. Added a focused Reader regression proving that boneyards and omitted scenes are absent from ordinary checkpoints. Private notes and future evidence already had executed tests.

The Phase-4 correctness ladder is exercised by the 19 targeted tests: frozen earlier snapshots under future mutation; unseen future evidence rejection; note/boneyard/omitted exclusion; deterministic replay; later-presented flashback versus diegetic chronology; reader/diegetic knowledge differential; directional relationships; setup/payoff and question lifecycles; presentation-suffix versus story-time connected recomputation; trajectory semantics. Compiled architecture and source checks verify that pure Reader/Temporal modules have no acquisition, persistence, or provider effect dependency. Trajectories expose presentation-relative or qualified/partial diegetic semantics as applicable. These are deterministic software checks, not creative-quality validation.

## First-reader gate and remaining limits

`PHASE_04_DOMAIN_REVIEW_PACKET.md` still has no rights-cleared corpus manifest, first-exposure checkpoint records, independent readers, or disagreement analysis. Fixtures, Codex inspection, and model output do not satisfy that pilot. At the original engineering checkpoint Phase 4 was `DOMAIN_REVIEW_PENDING`. The later D046 authorization marks it `COMPLETE` with this study skipped as visible validation debt; Phase 3's D045 override remains a separate historical decision. No Phase-5 Diagnosis, Acquisition, or multi-pass Playbooks were implemented.

## Subsequent user authorization — D046

After the engineering checkpoint, the user authorized marking Phase 4 complete with the first-reader pilot skipped, then made all future human reviews optional and nonblocking. The study packet remains available, but no participant, corpus result, human-calibrated interpretation, or usefulness finding is claimed. Phase 4 is `COMPLETE` on the engineering evidence above; the unperformed study remains visible validation debt. This addendum supersedes the earlier pending-status conclusion without changing any test result or Fount source identity.