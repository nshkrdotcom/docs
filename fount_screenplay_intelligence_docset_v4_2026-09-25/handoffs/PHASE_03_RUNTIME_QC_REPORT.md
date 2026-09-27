# Phase 3 runtime QC report — Story-World Pure Core

**Date:** 2026-09-26 HST. **Engineering result:** passed. **Phase status:** `DOMAIN_REVIEW_PENDING` because the required Level-A human review has not been supplied or performed. No Phase 4 work or live provider call was made.

## Source and environment identity

- Applied Fount overlay commit: `69b8537572c370992a47b6a8630909785eb973d1`; applied complete docset commit: `aabd58c9e0e814c6a62a18df23399151cbcc4920`. Both repositories were clean at entry. Fount Phase-3 QC repair commit: `60f989bcb9935b28519c908f3cd123ad6efe172f`; tree: `dceb415ceb697eabed1fb84eb091a71fe1666458`. The Fount checkout is clean after that commit.
- The installed overlay manifest and `PHASE_03_FILE_INVENTORY.json` agree on **21 additions, 8 modifications, zero deletions**. All 29 applied file SHA-256 values and byte lengths matched both records before repairs. Git recorded `100644` for all 29. The checkout initially exposed `0664` permissions despite those Git modes; permissions were normalized to manifest `0644` after content verification. The original ZIP was unavailable here, so ZIP container bytes were not revalidated. The supplied XML preimage hashes describe an unsealed reconstruction, not the live pre-overlay commit.
- SDK source: `/home/home/p/g/n/system_one_sdk`, commit `e757598a89e549274b979f0e77c6a4b2b6667752`, package 0.6.0, clean. Inference source: `/home/home/p/g/n/inference`, commit `3750a03ec62a3c9da11be9caa4dc911ebbbb9801`, package 0.5.0, clean. Observe dependency resolution used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`; no dependency was changed to avoid resolution.
- Lock identities (SHA-256): root Mix `0b3edda815861ea063b140bf0700874b512cdca86e9ca305d60b2d9dc85a069e`; Core `eb1fff53893a36c21edfd22809b6f2f22873dd32dd3ac2734554ef5c9ca58685`; Observe and Intelligence `3a2d8edcd896928d912081418311e058f989d7a68d3c61ed1fe608f3cc89b812`; Workshop `17ab894bf96b86e0ae4ffc345d284552f8571e037200900e8371f0b9d11b68e8`; Workshop npm `e05f86b538cb65ebcc826508fe0bde47652bf1d63b5bcc911cc12f52b8e31b7c`.
- Host: Linux 6.18.33.2 WSL2 x86_64; Erlang/OTP 29.0.5; Elixir and Mix 1.20.3; Python 3.14.4; Node 24.19.0; PostgreSQL client and isolated test server 18.6.

## Executed commands and results

Commands below ran from Fount root unless a package directory is stated. `SDK=...` in this table means the exact `FOUNT_SYSTEM_ONE_SDK_PATH` assignment above. Exit codes are observed, including failed pre-repair runs.

| Command | Exit | Result |
|---|---:|---|
| `(cd packages/fount_intelligence && mix format)` | 0 | Elixir's changed-file cache left delivered files untouched. `mix format --check-formatted` exposed them; subsequent `(cd packages/fount_intelligence && mix format --force)` and `mix format --check-formatted` both exited 0. |
| `SDK mix setup` | 0 | Four package dependencies resolved and Workshop `npm ci` completed. A transient Hex ETS cache `:badfile` line appeared for Core; resolution completed and all later gates passed. npm reported three critical audit findings; no dependency changes were made in this Phase-3 pass. |
| `(cd packages/fount_intelligence && SDK MIX_ENV=test mix compile --warnings-as-errors)` | 0 after repair | Initial exit 1 for an unused `record_id/3` parameter; final compile has no warnings. |
| `(cd packages/fount_intelligence && SDK MIX_ENV=test mix test test/story_world_architecture_test.exs test/story_world_records_test.exs test/story_world_records_validation_test.exs test/story_world_reference_test.exs test/story_world_scope_causality_test.exs test/story_world_temporal_test.exs)` | 0 after repair | Initial exit 2: cycle conflict lacked constraint IDs. After regression and repair, 14 passed. |
| `(cd packages/fount_intelligence && SDK MIX_ENV=test mix test)` | 0 | 56 passed. Mix emits a harmless discovery warning for `test/support/story_world_fixture.ex`, which `test_helper.exs` loads explicitly. |
| `(cd packages/fount_intelligence && SDK MIX_ENV=test mix run examples/phase_three.exs)` | 0 | Flashback possession `:unknown`, later possession known, causal descendants shown, limitations rendered. Repeated after final repairs. |
| `python3 -m unittest discover -s scripts/tests -v`; `bash -n scripts/verify_handoff.sh` | 0 each | 26 Python tests and shell syntax passed. |
| `SDK mix ci` | 0 final | Root setup, format/lock checks, four-package warnings-as-errors compile, ExUnit, compiled architecture, strict Credo, Dialyzer and ExDoc passed. Previous attempts failed at formatting (1), architecture (1), Credo (10), Dialyzer (2), ExDoc (1), then Credo (8) after the cycle query change; each defect was repaired and the full command rerun. Final log: `/tmp/fount-phase3-mix-ci-final.log`. |
| `SDK FOUNT_VERIFY_OUT=/tmp/fount-phase3-verify-handoff bash scripts/verify_handoff.sh --offline` | 0 | All 17 package dependency/format/compile/test/architecture rows passed; status table at `/tmp/fount-phase3-verify-handoff/status.tsv`. |
| `FOUNT_DATABASE_URL=postgres://home@127.0.0.1:55432/fount_phase3_qc MIX_ENV=test mix ecto.create`; same `mix ecto.migrate` in `packages/fount` | 0 each | Created and migrated only the isolated `fount_phase3_qc` database. No user database reset/drop. |
| Same URL, `MIX_ENV=test mix test integration` in `packages/fount`; `SDK` plus same URL in `packages/fount_workshop` | 0 each | Core 11 and Workshop 14 integration tests passed, including persistence, writer and PDF/export regressions. |
| `SDK FOUNT_DATABASE_URL=... MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase3-writer-reject --decision reject` in Workshop | 0 | Mock completion and Observe Sandbox; accepted revision equals base revision, one table-read turn. |
| Same command with `--out /tmp/fount-phase3-writer-accept --decision accept --pdf` | 0 | Accepted revision equals candidate revision; two-page PDF produced. |
| `SDK FOUNT_PACKAGE_BUILD=1 mix hex.build --output /tmp/fount-phase3-<package>.tar` in each of `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop` | 0 each | Four archives inspected: 117, 67, 61, 81 content members respectively. No `_build`, `deps`, `node_modules`, `.env`, PDF, or nested archive content. Intelligence archive rebuilt after the final source repair. Nothing published. |

`SDK` is a table abbreviation only; every executed command used the full assignment `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`.

## Repairs and architecture findings

The repair commit changes only `packages/fount_intelligence`. It formats delivered files, removes one unused parameter warning, replaces grouped Observe aliases with explicit allowed leaf aliases for the existing architecture scanner, and refactors new functions to satisfy strict Credo without changing thresholds. Graph walkers use plain visited maps to avoid Dialyzer's opaque `MapSet` warnings; PLT refresh alone did not clear them. The publicly referenced `StoryTime.Graph` type now has visible documentation for ExDoc.

Two temporal correctness repairs have regressions. Strict-cycle conflicts now include the supporting constraint IDs in `involved_ids`. A pair participating in opposing strict paths now returns a source-backed `:contradiction` packet instead of promoting one direct `before` edge to known chronology; direct contradictions retain their own direct evidence packet. All revised tests passed before and after the final full CI run.

The compiled architecture gate checked 267 modules and 229 source files with zero violations. It confirmed the four-package DAG: Core has no Observe/Intelligence/Workshop dependency; Observe depends on Core and SDK providers; Intelligence depends on Core and Observe leaf contracts; Workshop owns Inference and writing. No Probe wrapper returned. Pure StoryWorld has no provider, Repo, shell, filesystem/network/environment, clock/random or process-state semantic dependency. Existing Phase-2 `StoryWorld.Records`, extraction kinds and playbook contracts remain; Observe `MeasurementResult` and current `Observation` provenance remain separate. Story-time, presentation and causality are separately represented, and the counterfactual API reports support/dependency impact only.

## Human gate and limits

The `PHASE_03_DOMAIN_REVIEW_PACKET.md` protocol remains ready, but no rights-cleared three-case corpus, two independent structural reviewers, independent forms, or reconciliation record were supplied. Synthetic ExUnit fixtures and the example are engineering evidence only. Phase 3 is therefore `DOMAIN_REVIEW_PENDING`, not `COMPLETE`. The gate needs rights/provenance/provider-export metadata before analysis, deterministic JSON/Markdown and exact evidence/query artifacts per case, independent review, then classified disagreements. No validation-debt override was requested. No live provider call was needed or made for this pure phase.

The exact next Repomix Fount source is commit `60f989bcb9935b28519c908f3cd123ad6efe172f` (tree `dceb415ceb697eabed1fb84eb091a71fe1666458`). Phase 4 remains `NOT_STARTED`.
