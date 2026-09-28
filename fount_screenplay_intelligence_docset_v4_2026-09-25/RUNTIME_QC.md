# Runtime QC and completion gates

Work in `/home/home/p/g/n/fount`; update docs in `/home/home/jb/docs/20260928/fount` (same as `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`). Dependency checkouts are `/home/home/p/g/n/system_one_sdk`, `/home/home/p/g/n/inference`, `/home/home/p/g/n/agent_session_manager`. Read current repository instructions and source-defined commands first. The following commands were grounded in the inspected baseline, and the phase must extend their coverage when adding Run/host projects.

## Preflight and applied-state verification

Record `git status --short`, `git rev-parse HEAD`, branch, `elixir --version`, `mix --version`, PostgreSQL and Node/PDF/browser versions used. Verify overlay payload hashes/deletions against the user-applied checkout. Inspect deviations rather than reapplying. Record docset applied commit separately. Read prior reports for known debt; don't assert their results passed on new code.

Use disposable test databases and fixture screenplays. Read existing integration helpers and environment names. Existing CI uses `FOUNT_TEST_PGHOST`, `FOUNT_TEST_PORT`, `FOUNT_TEST_USER`, `FOUNT_TEST_PASSWORD`, and `FOUNT_DATABASE_URL`; never log passwords or use a production connection. Add explicit Run/host migration tests and SQL sandbox/isolation as appropriate. No default live provider tests.

## Common workspace ladder

From `/home/home/p/g/n/fount`:

```bash
mix setup
mix format --check-formatted
mix deps.unlock --check-unused
mix blitz.workspace format --check-formatted
mix blitz.workspace lock_check
mix blitz.workspace compile
mix test
mix fount.architecture
mix blitz.workspace credo --strict
mix blitz.workspace dialyzer
mix blitz.workspace docs
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
```

`mix ci` runs the baseline Mix ladder (including setup); use it as the aggregate instead of needlessly repeating all those steps. Root `mix test` delegates to Blitz. Inspect root configuration to ensure warnings-as-errors compilation, strict Credo and all introduced projects are covered. Keep package-count/architecture checks aligned with the phase: four libraries in Phase 01, five from Phase 02, and the host added in Phase 06. Preserve meaningful boundaries rather than disabling tests wholesale or adding later packages early to satisfy a count.

Core and Workshop have explicit integration directories. Execute, with a disposable configured PostgreSQL database:

```bash
cd /home/home/p/g/n/fount/packages/fount
MIX_ENV=test mix ecto.migrate
MIX_ENV=test mix test integration
cd /home/home/p/g/n/fount/packages/fount_workshop
MIX_ENV=test mix test integration
```

Phase 01 exercises Core migrations and the existing four-library workspace only. Phase 02 adds the fifth library, runnable Run migration/integration harness and exact commands; Phase 06 adds the host migration/browser harness. Run Core migrations before Run, and host project migrations after both. Check fresh DB and baseline→new migration upgrade. Run concurrency tests with distinct connections; one transaction sandbox process does not prove competing row locks. Test assertions must prove expected behavior, not merely inspect source strings.

Build the libraries present in the selected phase from their own directories with the repository's release mode:

```bash
FOUNT_PACKAGE_BUILD=1 mix hex.build
```

Apply this to `packages/fount`, `packages/fount_observe`, `packages/fount_intelligence`, `packages/fount_workshop`, `packages/fount_run` from Phase 02 onward. Phase 01 builds the existing four libraries; it must not create Run merely to satisfy a future build gate. Inspect manifests for excluded tests/secrets/builds and required runtime assets/migrations. Hex build does not prove published dependency installation; record that distinction and any not-yet-published sibling dependency limitation. Phase 06 builds the host/assets through its documented production build command as well. Never publish packages as part of QC.

## Behavior ladder by phase

| Phase | Required executed evidence |
| --- | --- |
| 01 | A01–A06: Core approval/identity/override/canon paths, caller-stable replay, Core migrations/concurrency and standalone Workshop preservation |
| 02 | R01–R06: Run package registration, migrations/FKs, idempotent creation, immutable plans/policies, decision/approval-attempt storage and resource identity primitives |
| 03 | W01–W07: real single-operation execution, crash boundaries, lease/fencing races, durable budgets/retries, stale-result handling and explicit incomplete-stage behavior |
| 04 | P01–P07: screenplay candidate journeys, canonical strategy decisions, bounded iteration, composition/checks and multi-stage recovery |
| 05 | C01–C07: shared human decision/approval entry points, plan/policy/rebase races, durable review→approval→acceptance recovery, retained declined/fenced attempts, exports and CLI journeys |
| 06 | U01–U07: three browser journeys, reconnect/two tabs/auth, fresh setup, final runtime/db/package/browser regression and documentation |

Use scripted Inference clients and System One Sandbox fixtures following the actual dependency interfaces. Tests that merely count files or assert module names are supplementary static evidence. Do not substitute them for state transitions, row constraints, actual page content, files or browser actions.

PDF validation, when selected in the required journey, must actually render/read a generated PDF using the repository's existing Node/browser tooling and `pdfinfo`/`pdftotext` or equivalent. Install/configure prerequisites where available. A missing required tool leaves that engineering gate pending; it is not a pass. Existing optional audio/live-provider examples can remain explicitly NOT_RUN when not part of the required journey.

## Reporting and completion

Use `templates/RUNTIME_QC_REPORT.md`. Record applied commits, verified final code commit/tree, fixes, commands and exit codes/counts, DB isolation, expected-failure assertions, artifacts and their hashes, limitations, and traceability links. Distinguish `PASS`, `FAIL`, `NOT_RUN`, and `NOT_APPLICABLE` with a reason. Use `NOT_APPLICABLE` only for work outside this phase, not to skip a required gate.

A phase is complete when its required behavior and common engineering gates pass and the updated docset explains the actual implementation. Optional live-provider spending and optional human creative-quality pilots do not block engineering completion; record their absence. Stop broadening tests once the applicable gates and concrete remaining risks are resolved. Follow the handoff protocol to commit/push and prepare the next source packet.