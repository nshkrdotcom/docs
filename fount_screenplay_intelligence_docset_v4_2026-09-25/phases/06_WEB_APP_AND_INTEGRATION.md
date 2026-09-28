# Phase 06 — writer app and complete integration

Entry: Phases 01–05 complete, headless journeys executed, current inputs include all QC repairs. Read `PRODUCT.md`, `WORKFLOWS_AND_UI.md`, the host boundary in `ARCHITECTURE.md`, and prior phase reports.

## Deliverable

A runnable one-owner Phoenix LiveView application that lets a writer launch, inspect, steer, approve and export runs. The final repository includes setup/run instructions and verified end-to-end fixtures. There is no Phase 07.

## Implementation checklist

1. Add `apps/fount_web`, compatible dependencies, runtime configuration and lockfile, host Repo/migrations, provider and approver service setup, worker supervision and local owner authentication. Default local launch is straightforward and documented. Register app in workspace/CI and include `apps/**` in Fount snapshots.
2. Implement project/intake, setup, timeline, decision inbox, side-by-side review and export surfaces from the UI contract. Presets have editable gates and show whether accepted pages can change. Keep unknown cost/checks visible.
3. Enforce authorization on all views/actions/artifacts, CSRF protection, safe display of screenplay text and bounded upload/export paths. Forms use exact persisted context fingerprints; identities come from server session. Add clear conflict/reload behavior for stale tabs.
4. Persist progress independently of LiveView/socket lifetime. Reconnect queries durable events/decisions. Surface pause/stop settlement and actionable partial results. Use PubSub for notifications without depending on delivery for correctness.
5. Provide a deterministic demo service configuration and repeatable fixtures for all three journeys, separate from optional live configuration. Keep fixture credentials obviously nonsecret. Document selected PDF prerequisites and failure recovery.
6. Update root/package/app READMEs, API map, architecture checks, final acceptance runner, release/build lists and current stability statement. Replace stale four-package assertions with the new five libraries plus host app. Preserve prior useful Workshop functionality.
7. Execute final common quality gates plus headless, database and browser journeys. Review final traceability: every A/R/W/P/C/U requirement has source and runtime evidence or an explicit user-approved scope change. No required engineering item silently becomes deferred.

## Runtime acceptance

- **U01:** Authenticated writer completes brief → opening candidate in the browser, reviews actual pages and downloads the requested bundle; canon stays unchanged for candidate preset.
- **U02:** Reveal journey pauses at route choice, preserves the protected train scene, shows consequence repair and approves exact pages. Refresh/reconnect retains decision and progress.
- **U03:** Dialogue pass restricts edits to selected scenes. Autonomous preset runs configured agent/service approval and visibly records acceptance identity; failure/fallback appears truthfully.
- **U04:** Two tabs, duplicate clicks, stale candidate/base, revoked/tightened policy, process restart and worker loss cannot duplicate acceptance or bypass a gate. Unauthenticated/wrong-owner views, commands and downloads are denied.
- **U05:** Browser shows real diffs, unknown/failed checks, incurred versus estimated/unknown cost, stop/partial state and export failures. Forms work with keyboard navigation and associated labels; important status changes are accessible.
- **U06:** Fresh documented setup runs Core→Run→host migrations, starts the host and worker, and completes the fixtures. Library package builds exclude host-only assets and no library acquires a Phoenix dependency.
- **U07:** Full regression suite, prior Core/Workshop integrations, Run crash/concurrency matrix, actual PDF check when required, browser tests and docs/build checks pass on the final code revision. Record optional live/human validation as NOT_RUN when not executed.

Use Phoenix connection/LiveView integration tests plus real browser smoke coverage of rendering/download/reconnect flows. Select the existing available browser runner or add a documented maintained runner in this phase; record its actual version and commands. Screenshots alone are not behavioral evidence.

## Final handoff

Web still returns the same two ZIPs and Phase 06 QC handoff, with state `OFFLINE_IMPLEMENTED`. Runtime completes/repairs this phase, commits and pushes code and docs, marks all six complete and refreshes integrity/state views. `NEXT_HANDOFF.md` must then say the implementation is finished. Prepare final source snapshots for archival/review if useful, but do not queue another implementation phase. Report what engineering gates ran and the limits of any creative-quality evidence.