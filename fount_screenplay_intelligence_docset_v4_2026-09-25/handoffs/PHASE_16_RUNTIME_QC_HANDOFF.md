# Phase 16 runtime QC handoff — Codex

You are the runtime/repair agent for **Phase 16 — Final Integration and Acceptance**, the final phase. Start from the user's **already applied and committed** Fount and docset state. **Do not reapply `fount_phase_16_overlay.zip`. Do not begin or invent a Phase 17.**

## Ground truth and source-delivery state

Read, in order:

1. `PROGRESS.md` and `16_PHASED_IMPLEMENTATION_PLAN.md` Phase 16;
2. `19_ACCEPTANCE_CRITERIA.md`, `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`, `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`;
3. documents 27–36, especially W01–W12/A01–A12 and the five-XML handoff contract;
4. `handoffs/PHASE_15_RUNTIME_QC_REPORT.md` (verified baseline);
5. all `handoffs/PHASE_16_*` source-delivery records.

The immutable source overlay has 17 operations (8 add, 9 modify, 0 delete), SHA-256 `24c78ce6dde3476ed9418c43ca65028c9bebf84717913e9e6c01f9b53c40b98b`. Before any repair, verify all 17 result hashes in `PHASE_16_FILE_INVENTORY.json` against the applied checkout. Record user-applied commit/tree separately from any repair commit/tree.

## Dependency/API boundary facts to re-check, not reinvent

- SystemOneSDK snapshot inspected: **0.6.0**; native production use belongs to `fount_observe`.
- Inference snapshot inspected: **0.5.0**; direct production use belongs to `fount_workshop`.
- Agent Session Manager snapshot inspected: **0.17.1**; it is not an Observe/Intelligence analysis dependency.
- Final physical packages are exactly `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`.

Inspect the actual resolved dependency tree and current source. Repair reality if it differs; do not patch to an invented API.

## Required runtime ladder

Use the actual repository's toolchain and required local sibling paths. Record commands, exit codes, counts and logs. At minimum:

```bash
git status --short
git rev-parse HEAD HEAD^{tree}
python3 scripts/final_acceptance.py --output /tmp/fount-phase16-source-audit.json
bash scripts/final_acceptance.sh --runtime
```

The final runner intentionally does **not** convert missing PostgreSQL/live/human prerequisites into passes. Configure the real SystemOneSDK sibling path if this checkout requires `FOUNT_SYSTEM_ONE_SDK_PATH`. Configure a disposable Phase-16 PostgreSQL database through `FOUNT_DATABASE_URL`, migrate it, then run the explicit integration directory. Run the package-local focused tests even if `mix ci` already covers them, so failures are attributable:

```bash
cd packages/fount_intelligence
mix test test/phase_sixteen_final_architecture_test.exs

cd ../fount_workshop
mix test test/writer_workflows/phase_sixteen_acceptance_matrix_test.exs
mix test test/writer_workflows/phase_twelve_a01_demo_test.exs   test/writer_workflows/phase_twelve_discovery_test.exs   test/writer_workflows/phase_twelve_scene_exploration_test.exs   test/writer_workflows/phase_thirteen_pass_profiles_test.exs   test/writer_workflows/phase_thirteen_voice_test.exs   test/writer_workflows/phase_thirteen_rehearsal_test.exs   test/writer_workflows/phase_fourteen_notes_test.exs   test/writer_workflows/phase_fourteen_consequence_test.exs   test/writer_workflows/phase_fourteen_research_test.exs   test/writer_workflows/phase_fourteen_rebase_test.exs   test/writer_workflows/phase_fifteen_read_share_resume_test.exs   test/writer_workflows/phase_fifteen_usefulness_test.exs
MIX_ENV=test mix test integration
```

Also run/confirm the repository's full `mix ci`, compiled architecture/xref gate, strict Credo, Dialyzer, ExDoc warnings-as-errors, repository-wide Python tests including the real prune helper, Core Fountain/FDX fidelity/property tests, prior Observe timeout/cache/security/provider regressions, Intelligence nonlinear reader/story-time and durable analysis regressions, Workshop stale/rebase/undo/privacy/Submission/PDF/table-read regressions, and **all four** `FOUNT_PACKAGE_BUILD=1 mix hex.build` package builds. Inspect archive file lists rather than treating successful build exit alone as the allowlist proof.

## Final writer-facing acceptance

Use `packages/fount_workshop/examples/phase_sixteen/acceptance_matrix.json` as the ownership map, not as proof. For **each A01–A12** and **W01–W12**, record in the runtime report:

- requirement/case ID;
- fixture/consented source identity;
- public operation/command actually invoked;
- output/candidate/artifact path;
- assertions and actual result;
- exact Fount source revision;
- human-review status where relevant.

Re-run the provider-free documented capture → explore → revise → compare → accept/reject → read/share → resume path and inspect the actual Fountain/FDX/read/share/resume artifacts. Confirm candidates stay noncanonical until explicit acceptance, private/unchosen material does not leak, stale candidates cannot overwrite current source, unsupported export loss is visible, rehearsal does not become history, and usefulness records do not choose a winner or produce a screenplay score.

A deterministic fixture can establish engineering behavior only. It cannot establish live-model diversity, human voice preference, audience response, marketability, commercial potential, or representative human usefulness.

## Live and optional human gates

Run live Inference/ASM or System One checks **only if explicitly authorized and credentials are available**. Keep payloads minimal and never auto-accept generated pages. Under D046, optional human/domain studies are nonblocking; if not commissioned, record `NOT_RUN` and make no human-usefulness claim. TTS is a convenience, never audience measurement.

## Completion record

Create/replace `handoffs/PHASE_16_RUNTIME_QC_REPORT.md` with actual toolchain, commit/tree identities, pre-repair hash verification, defects and repairs, every required command/result/count, W01–W12/A01–A12 evidence, package/Hex inspection, preservation findings, live/human statuses, and claim limits. Regenerate current file/docset hashes after repairs.

Mark Phase 16 `COMPLETE` only when every applicable **non-human** engineering/source-fidelity/acceptance/privacy/creative-control/publication gate passes. If any required gate fails, keep `QC_BLOCKED` or `QC_IN_PROGRESS` and repair Phase 16. **There is no next implementation phase in this docset. Stop after Phase-16 QC.**
