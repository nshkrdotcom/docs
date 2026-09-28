# Phase 16 preservation audit — 2026-09-27

**Status: source-preservation audit PASS; runtime preservation NOT_RUN.**

## Change footprint

The Phase-16 overlay has **17 operations: 8 additions, 9 modifications, 0 deletions**. It changes no `packages/*/lib/**` production module. The only `mix.exs` modification is Workshop ExDoc extras for the final guide/example; package dependencies and package-file allowlists are unchanged. Additions are final audit scripts, source/ExUnit tests, a guide, an example README, and `acceptance_matrix.json`.

## Preserved behavior

- `fount` remains the only canonical screenplay/revision substrate; no canonical acceptance/edit path changes.
- `fount_observe` keeps the existing System One provider boundary; no new SDK call or provider authority is added.
- `fount_intelligence` reasoning, StoryWorld/Temporal/Reader/Diagnosis/capabilities/playbooks/persistence code is unchanged. The new test only exercises its existing architecture gate.
- `fount_workshop` generation, Session/Store/Candidate/Review/Acceptance, note/research/rebase, table-read/share/usefulness, PDF/TTS, and CLI production modules are unchanged.
- W01–W12 and A01–A12 are mapped to the Phase-12–15 tests that already exercise those public paths; Phase 16 does not create a privileged final-demo shortcut.
- Core Fountain/FDX fidelity, stale-candidate protection, clean-share privacy, noncanonical rehearsal, note/research provenance, and usefulness non-scoring contracts remain owned by their prior regressions.
- There are no file deletions, Probe resurrection, superseded physical packages, or new compatibility shims.

## Risks intentionally left to runtime QC

Source scans cannot prove Elixir compilation, compiled dependency/xref behavior, ExUnit behavior, PostgreSQL durability, Hex archive contents, rendered ExDoc, PDF/TTS behavior, provider execution, or human usefulness. Codex must run the actual repository ladder and prior preservation suites before marking the phase complete.

The supplied XML export still omits `scripts/prune_deleted_directories.py` while containing its Python test. That causes one repository-wide Python import error here; prior runtime QC records that the real checkout contains the helper. Do not add a duplicate helper from this source handoff solely to make the XML extraction green.
