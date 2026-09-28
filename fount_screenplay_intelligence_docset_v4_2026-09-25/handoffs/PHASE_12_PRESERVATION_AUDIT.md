# Phase 12 Preservation Audit

## Preserved contracts

- Canon still advances only through `FountWorkshop.Acceptance` / the Core review gate. Discovery records, reverse outlines, card reorders, fragments and keep-both/reject-all decisions do not mutate screenplay pages.
- The opening session request and base revision remain immutable provenance. Evolving brief state is session progress and only overlays the effective in-memory request for later work.
- Existing generated alternatives still use Workshop → Inference. Observe/System One and ASM ownership boundaries are unchanged.
- Existing strategy payloads remain valid when no Phase-12 treatment contract is requested. `diagnose` remains accepted by the workflow schema while writer presentation uses `inspect`.
- Existing candidate checks, stale-base acceptance and review metadata are reused for writer-origin manual candidates.
- Phase-11 evaluation/live-verification source is not removed; its source-contract regression was updated only to permit later Phase-12 implementation.

## Runtime regressions Codex must prove

1. Full workspace `mix ci` and package tests/format/quality/docs/archive gates.
2. Existing Phase-9/10/11 Workshop/Intelligence persistence and resume regressions.
3. All four new Phase-12 ExUnit scenario files.
4. Real PostgreSQL provider-free CLI example from open → fragment → manual candidate → edit → accept → resume.
5. Stale concurrent candidate acceptance and same-candidate idempotent re-acceptance against the actual store, not only the continuation test seam.
6. Generated deterministic alternatives and, only if authorized, a narrow live generation check; no live-model creative claim is required to establish deterministic engineering behavior.
7. Existing live Observe/System One boundaries remain unchanged; do not add a direct ASM or SystemOneSDK Workshop dependency while repairing failures.

## Known source-writing limitation

Elixir/Erlang/Mix are absent here. No compile/formatter/ExUnit/database/provider result is claimed. Repository-wide Python discovery also retains the supplied-snapshot import error for `scripts/prune_deleted_directories.py`; focused Phase-9–12 source checks pass.

## Runtime preservation result — 2026-09-27

Compiled architecture reports zero violations across 289 source files. The real-store Phase-12 regression and CLI run keep the opening request immutable, persist noncanonical discovery and advance only the explicitly accepted candidate. Core/Intelligence/Workshop PostgreSQL integration passes 11/4/17. `mix ci` passes 343 tests, strict quality and docs. Four Hex archive builds pass with the repository package-build switch. No direct Workshop SystemOneSDK/ASM dependency was added; Inference 0.5.0 remains the generated-alternative boundary. No live provider or human study was run.
