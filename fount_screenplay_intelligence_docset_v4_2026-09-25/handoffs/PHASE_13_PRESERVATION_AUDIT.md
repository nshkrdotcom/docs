# Phase 13 Preservation Audit

## Preserved contracts

- Canon still advances only through the existing Workshop acceptance/review path. Rehearsal records are session-progress material and never call `Fount.Screenplay.apply/…` or StoryWorld mutation.
- Required exact-text protection composes with the existing deterministic `pin_text` constraint and ReviewGate mechanism rather than inventing a second acceptance authority.
- Candidate comparison uses `Fount.Screenplay.diff/2` and stable element/scene identities. Generator summaries are retained only as claims and are never substituted for actual page diffs.
- Existing Draft/Explore/Inspect/Revise discovery/session behavior from Phase 12 is unchanged. Adopted rehearsal is an additional in-memory generation context field; opening request provenance remains immutable.
- Existing `action_visual`, `brevity`, `custom`, `dialogue_subtext`, `dry_comedy`, and `tension` profiles remain valid; the three Phase-13 profiles are additive.
- Existing generation remains through `Inference.Client.agent_session!` / `Inference.Adapters.ASM`. The already-present Workshop dependencies on Inference 0.5.0 and Agent Session Manager 0.17.1 are retained. No new direct ASM invocation is introduced.
- Analytical measurements remain through `Fount.Observe.Providers.SystemOne` and the inspected SystemOneSDK 0.6.0 facade. Workshop does not gain a SystemOneSDK dependency.
- Phase-11 evaluation/calibration and Phase-12 discovery surfaces are not removed.

## Runtime regressions Codex must prove

1. Apply formatting/compile repairs as needed, then run full workspace `mix ci`, strict quality/docs and all four package builds.
2. Run all four new Phase-13 writer-workflow test files plus relevant Phase-12 session/discovery regressions.
3. Prove a required voice pin fails the real review gate when exact repeated/multilingual text changes; an action-only candidate must leave protected text byte-exact.
4. Prove rehearsal active/rejected inventions cannot appear in effective generation context, and explicit adoption is traceable while still noncanonical.
5. Prove actual comparison packets reflect real candidate/base pages and cannot pass by echoing proposal summaries.
6. Run a real PostgreSQL session-resume regression for rehearsal adoption/rejection if the existing Store path requires database behavior. No schema migration should be invented unless runtime evidence reveals a real persistence gap.
7. Re-run Phase-12 provider-free writer path and stale/idempotent acceptance.
8. Do not begin Phase 14.

## Source-writing limitations

`mix`, `elixir`, and `erl` are absent. No formatter, compile, ExUnit, PostgreSQL, live provider, documentation/package or human-review result is claimed. Repository-wide Python discovery has the pre-existing supplied-snapshot `scripts/prune_deleted_directories.py` import gap; focused Phase-9–13 source checks pass.

## Runtime QC result — 2026-09-27

All 24 applied overlay paths matched their original result hashes before repair. Current source hashes, including the legacy profile-test repair and new PostgreSQL rehearsal regression, are recorded separately in `PHASE_13_FILE_INVENTORY.json`. Full `mix ci`, compiled architecture, strict Credo, Dialyzer, ExDoc, 105 Python tests, 33 PostgreSQL integration tests, four Hex builds, focused Phase-12/13 writer tests, PDF and table-read regressions passed. The PostgreSQL rehearsal resume check preserved adopted/rejected decisions and unchanged canonical head without a migration. Workshop Inference/ASM and Observe/System One boundaries were retained. See `PHASE_13_RUNTIME_QC_REPORT.md` for commands, transient failures, repairs and evidence limits. Phase 14 remains `NOT_STARTED`.
