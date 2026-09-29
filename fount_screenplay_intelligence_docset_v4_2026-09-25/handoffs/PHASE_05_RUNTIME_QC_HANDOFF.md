# Phase 05 runtime QC handoff — Control and completion

The user has already applied the Phase 05 Fount overlay and complete docset, then committed and pushed both repositories before this handoff reaches the local runtime agent. **Do not reapply either ZIP.** Verify the installed result, run/repair Phase 05, update the same repositories, and stop after preparing the Phase 06 packet.

Current phase state from the offline agent: **OFFLINE_IMPLEMENTED**. C01–C07 application runtime acceptance is **NOT_RUN** and Phase 05 is not certified.

## Runtime destinations

Fount repository: `/home/home/p/g/n/fount`
Operational docset: `/home/home/jb/docs/20260928/fount`
Canonical docset: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
Docset Git root: `/home/home/p/g/n/brainstorms`
System One SDK: `/home/home/p/g/n/system_one_sdk`
Inference: `/home/home/p/g/n/inference`
Agent Session Manager: `/home/home/p/g/n/agent_session_manager`

## Exact baselines and offline artifact identity

- Verified Phase 04 Fount baseline: `c3af2d662198aaf15dd8e754f2d25c109c2707c1`.
- Verified Phase 04 docset baseline: `e3369f4bba8e977d83d5091126c9261488893a98`.
- Sealed packet manifest SHA-256: `77a51ef4f078b01758b692488e2347bc900016be8eff8069f96ace87896602de`.
- Phase 05 overlay SHA-256: `81a620d81d1e99b5812aaff9f8076e991aeb07715b926979f09a6fc891e8f75e`.
- Embedded/copied overlay manifest SHA-256: `cc2c8339e7d9750514676f5d352106639b5ac36a625f6338cc5731e11334ed35`.
- Overlay operations: 31 writes (18 modified, 13 added), zero deletions.
- Exact input hashes/commits: [PHASE_05_INPUTS.json](PHASE_05_INPUTS.json).
- Requirement/source/test mapping: [PHASE_05_IMPLEMENTATION_MATRIX.md](PHASE_05_IMPLEMENTATION_MATRIX.md).

Before runtime repair, verify the installed Phase 05 result hashes against [PHASE_05_OVERLAY_MANIFEST.json](PHASE_05_OVERLAY_MANIFEST.json) and confirm no unrelated paths were overwritten or removed. Do not require the installed tree to have a particular post-apply commit hash; record the user's containing commits instead.

Offline source checks passed `git diff --check`, 7/7 Phase 05 source-contract tests, 154 supported Python source tests and 16/16 `final_acceptance.py` checks. The sealed Repomix snapshot omits `scripts/prune_deleted_directories.py`, so the offline agent could not execute `test_prune_deleted_directories.py`; the installed repository must run the complete Python suite during local QC. These are source-only checks, not runtime acceptance.

## Read first

Read `AGENT_START_HERE.md`, `state.json`, `RUNTIME_QC.md`, `HANDOFF_PROTOCOL.md`, `phases/05_CONTROL_AND_COMPLETION.md`, `DATA_AND_EXECUTION.md`, `REVIEW_AND_APPROVAL_MODEL.md`, `WORKFLOWS_AND_UI.md`, this handoff, `PHASE_05_IMPLEMENTATION_MATRIX.md`, and the Phase 04 runtime QC report. Inspect the Phase 05 migration and all new/changed `packages/fount_run` modules before running tests.

## Required gate ladder

Use the local unpublished SDK path and isolated PostgreSQL database/schema conventions from prior QC. Record exact commands, tool versions, database/schema names and exit status. At minimum run, repair and rerun:

```text
# Fount root common gates
mix setup
mix format --check-formatted
mix deps.unlock --check-unused
mix blitz.workspace format --check-formatted
mix blitz.workspace lock_check
mix blitz.workspace compile
mix fount.architecture
mix test
mix blitz.workspace credo --strict
mix blitz.workspace dialyzer
mix blitz.workspace docs
mix ci
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
python3 scripts/final_acceptance.py
git diff --check

# Run package / migrations / integration
cd packages/fount_run
MIX_ENV=test mix ecto.migrate
mix test
MIX_ENV=test mix test integration/control_completion_test.exs
MIX_ENV=test mix test integration/screenplay_pipeline_test.exs
MIX_ENV=test mix test integration/durable_execution_test.exs
MIX_ENV=test mix test integration/storage_constraints_test.exs integration/run_foundation_test.exs integration/run_upgrade_test.exs
MIX_ENV=test mix test integration

# Core / Workshop regression
cd ../fount
MIX_ENV=test mix ecto.migrate
mix test
MIX_ENV=test mix test integration
cd ../fount_workshop
mix test
MIX_ENV=test mix test integration

# Package builds after tests
FOUNT_PACKAGE_BUILD=1 mix hex.build   # run in each of fount, fount_observe, fount_intelligence, fount_workshop, fount_run
```

Also perform fresh-schema and populated-upgrade migration proof through the new Phase 05 migration. Reapplying current migrations must be empty/idempotent. If `mix ecto.migrate` has the prior no-configured-Repo limitation in `fount_run`, retain the named-schema script as the actual migration evidence and report the warning truthfully.

## C01–C07 executed acceptance proof

### C01 — canonical decision/approval replay
Use distinct PostgreSQL connections to race two responses to one final approval decision. Prove exactly one resolution, one linked durable approval identity and one Core acceptance. Exercise the same decision via public `submit_decision/4`, `approve_run/4`, CLI `decide` and CLI `approve`; identical replay must return the same outcome. Wrong principal, stale tab/context fingerprint, altered option/candidate/check fingerprint/plan/policy and cross-run decision must fail without scheduling or accepting work.

### C02 — pause/resume/stop and delayed work
Pause at saved work, restart Repo/processes on the same schema, resume and continue. Race `stop` with an active worker and with an approval callback using distinct connections. Record deterministic outcome, fencing token/attempt state and retained candidate. Release a delayed callback only after stop: safe evidence may be appended, but the attempt must remain fenced/terminal and there must be no Core acceptance. Export the stopped candidate without resuming acceptance.

### C03 — completion modes and provenance
Run candidate-only completion and prove canonical head unchanged while reading exported Fountain/FDX/review/diff/provenance files. Then complete human, registered agent and registered service paths and query Core acceptance rows: one acceptance each with authentic origin, approver and Run provenance. An unregistered agent/service approver must fail before Core. Acceptance followed by export failure must retain canon and acceptance while Run remains nonterminal/partial until delivery succeeds.

### C04 — checks, overrides and fallback
Force automated required fail and unknown outcomes; neither may accept. Exercise an authorized human semantic override only for a check declared `overridable`, including nonblank reason, and prove deterministic/nonoverridable required failures block every principal. Deliver rejected, malformed and post-stop/fenced callbacks; inspect exact safe review/outcome evidence and prove no acceptance. Trigger fallback after a terminal failed automated attempt and show it creates a fresh human decision and a distinct child attempt linked to the parent; the failed review must not be converted into an acceptable automated attempt.

### C05 — plan/policy fencing and rebase
While an approver is active, change plan then policy, including a change that leaves generated pages byte-identical. The old attempt must fence. Inspect immutable snapshot history, old step bindings, inherited provider/cost/iteration commitments and idempotent command replay. Move canonical head after review to force stale-head compare/rebase. Use actual Workshop three-way conflict resolution; verify a fresh candidate and fresh check/review binding, then prove the old approval cannot accept. Inspect full composition/diff against the accepted base so unrelated prior candidate edits were not dropped.

### C06 — crash recovery and delivery retry
Inject and persist evidence around all required boundaries: (1) before callback dispatch, (2) after callback response but before durable response/review persistence, (3) after review persistence, (4) after stable approval ID/payload persistence and (5) after acceptance commit but before acknowledgement/export. Saved review must resume without callback redispatch; saved approval must reuse the same approval ID; unknown callback outcome must reconcile or pause rather than blindly call again; Core rejection must retain attempt history; lost acceptance acknowledgement must yield one Core acceptance on retry. Separately force one configured PDF export failure, inspect its failed delivery row while other formats remain ready, restore PDF configuration and retry only the failed/missing format. Read every generated file and compare recorded checksum/revision identity; a return tuple alone is not acceptance proof. Run `pdfinfo`/equivalent on the successful configured PDF and record output.

### C07 — public API and CLI journeys
Configure Repo, `FountRun.ActorContext`, scripted provider/services, artifact root and PDF options through trusted application/host configuration, not request JSON. Run all three product journeys end-to-end through `mix fount.run`, including start/show/step/decisions/decide or approve, steering/control and export as applicable. Record CLI exit codes for success, usage/input, trusted-config/auth, conflict/stale/fenced and runtime/partial cases. Rerun standalone Workshop acceptance through the authorized typed Core approval API and existing export. Verify the old Core actor-string signature cannot mutate canon.

## PDF and provider truthfulness

PDF and provider application checks are required when the selected/configured Phase 05 path uses them. If the configured PDF runtime or required scripted runtime dependency is unavailable, do not substitute an inspection binary or source review and do not mark the affected C06/C07 acceptance passed. Record the blocker and leave Phase 05 in `QC_FAILED`/`QC_IN_PROGRESS` as appropriate.

Paid live-provider calls and human screenplay-quality judgments are not required for deterministic engineering acceptance unless the local configuration explicitly selects them. Do not claim creative quality from scripted providers.

## Completion procedure

After all required gates pass, write `handoffs/PHASE_05_RUNTIME_QC_REPORT.md` with exact executed evidence, repairs, installed/result hashes, toolchain, database proof, acceptance evidence and final containing commits. Update Phase 05 in `state.json` to `COMPLETE` only then, set `verified_code_commit` to the tested Fount commit, `required_gates_passed: true`, update traceability/decisions/matrix, run `scripts/docset.py refresh` and `validate`, commit/push Fount and docset, and create the fresh sealed Phase 06 packet from those corrected commits. Stop after that handoff; do not implement Phase 06 in the Phase 05 runtime pass.
