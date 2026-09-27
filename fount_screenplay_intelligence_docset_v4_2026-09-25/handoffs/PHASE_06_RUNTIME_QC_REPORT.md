# Phase 6 runtime QC report — Capabilities A

**Status:** COMPLETE on engineering and preservation QC, 2026-09-27. Phase 7 remains NOT_STARTED.

## Applied state and inventory

- Applied Fount commit `c2692131fef8ac0fe3ff846736296b06d3323b92`, tree `e433f5f3ab0731063e64f5a505e975df7c522b60`.
- Repaired Fount commit `51f7c5e4054f8cab641d7f67a3c4737e17fd23d2`, tree `3a704750bc5e38028a3117041618d5d1f1d82aff`.
- Applied docset commit `05e9b10b76956b8bb7a0d981b29b95d97a8a6b22`. The companion runtime-QC documentation commit is recorded by the docset Git history.
- Before repair, all 31 overlay paths matched both the Phase-6 inventory and embedded manifest SHA-256 values. The real `handoff/prune_deleted_directories.py` was present and preserved. No overlay was reapplied. Post-repair hashes, including `packages/fount_intelligence/mix.exs`, are in `PHASE_06_FILE_INVENTORY.json`; the overlay manifest remains an immutable historical input record.

## Runtime commands and results

All Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk`, the established local SystemOneSDK 0.6.0 checkout path. No live provider was called.

| Command / gate | Result |
|---|---|
| Root `mix format --check-formatted`; `mix compile --warnings-as-errors` | passed |
| Observe `mix test test/phase_six_lens_assets_test.exs` | 1 passed |
| Intelligence `mix test test/phase_six_architecture_test.exs test/phase_six_capabilities_test.exs test/phase_six_runner_test.exs` | passed after repairs; focused coverage includes four families, non-linear story time, source, caps, and renderer |
| Intelligence `mix run examples/phase_six.exs` | passed; rendered Scene Doctor packet via Sandbox, no generated candidate |
| Root `ERL_FLAGS='+S 4' mix ci` | passed; Core 71, Observe 60, Intelligence 103, Workshop 58 = **292 tests**; format, lock, warnings-as-errors compile, architecture, strict Credo, Dialyzer and ExDoc passed. Log `/tmp/fount-phase6-ci-final.log` |
| Root `mix fount.architecture` | passed; 292 compiled modules, 254 source files, zero violations |
| Focused StoryWorld/Temporal/Reader/Diagnosis/WriterRunner/packet ExUnit | 48 passed |
| Python source discovery | 46 passed, including Phase-6 source checks; historical helper present |
| `ERL_FLAGS='+S 4' bash scripts/verify_handoff.sh --offline` | passed, 17 rows; ledger `/tmp/fount-handoff-offline-20260927T083753-93415/status.tsv` |
| Isolated PostgreSQL `fount_phase6_qc`: Core `mix ecto.create`, `mix ecto.migrate`, `mix test integration` | passed; 11 integration tests |
| Same DB: Workshop `mix test integration` | passed; 14 integration tests, including writing, recovery, PDF/export and action layout |
| Workshop `mix run examples/phase_one.exs --decision accept --pdf`; same with `--decision reject` | passed; acceptance rendered two-page PDF, rejection kept base revision, both used Mock Inference, Observe Sandbox and table-read |
| Four `FOUNT_PACKAGE_BUILD=1 mix hex.build` archives | passed; inspected 117/73/92/81 members. New lenses, guide and Phase-6 example included; no deps, build, node_modules, env files or PDFs |

A first full CI run exposed a pre-existing timing-sensitive Observe timeout test under high parallel load, and a later offline verification run exposed an ETS-cache cleanup race. The Observe tests passed in isolation and in the final full CI/offline verification runs with four Erlang schedulers. No Observe runtime code was changed for those intermittent failures.

## Repairs

1. Fixed an Elixir precedence error in Scene Engine's objective records; formatted delivered Phase-6 source.
2. Mapped canonical scenes to all frozen StoryWorld events at their presentation points so scene state includes transitions and causal support attached to explicit action events, not only `scene:<id>` scaffold events. Added a regression assertion for the office trust transition.
3. Made the packet renderer accept diagnosis support IDs as well as existing support maps; added a rendering regression test. Fixed the example's `{:ok, markdown}` return handling.
4. Resolved strict Credo and Dialyzer findings without weakening gates. Registered the Phase-6 guide in ExDoc extras.
5. Added a cap regression test; source scene/fragment caps and provider limits return explicit partial status.

## Capability correctness

The installed Phase-6 registry contains exactly `scene_engine`, `agency_causality`, `character_trajectory`, and `relationship_dynamics`, with four corresponding closed Observe lenses. Exact selected screenplay excerpts are in `state.source` for semantic measurement identity and attached again as current-revision evidence. Scene and provider caps downgrade status to partial. Scene outputs include objective/opposition/stakes/urgency/tactics, turns, decision/reveal/consequence measurements, entry/exit deltas, sequence contribution, handoff and counterfactual support.

Agency chains are derived from explicit StoryWorld causal edges, with alternate support, causal reach, consequence latency and removal analysis. Presentation distance is reported separately and does not create edges. Character exposes goals, belief/knowledge, commitments, adaptation and decision/arc hypotheses, including steadfast/static designs. Relationship supports pairs/groups and directional trust, intimacy, allegiance, leverage, status, dependency, attraction, resentment, obligation, concealment and knowledge asymmetry. In the synthetic non-linear fixture, the years-earlier corridor appears after the office but explicit StoryWorld constraints place it before; character/relationship packets retain that distinction. Diagnoses carry support, uncertainty and limitations as hypotheses, not universal rules.

The actual Observe Sandbox exercises all four families through `scene_doctor`, `character_trajectory`, and `relationship_pass`; writer packets retain `candidate: nil`. Architecture and source inspection found no new direct SystemOneSDK, Inference or ASM dependency in Phase-6 Intelligence. Workshop remains owner of page generation and acceptance. Phase-7 capability families remain absent.

## Validation debt

The optional `PHASE_06_DOMAIN_REVIEW_PACKET.md` study was **not run** under D046. No human usefulness, calibration or dramaturgical validity claim is made. No live provider call was required for this deterministic Sandbox QC.
