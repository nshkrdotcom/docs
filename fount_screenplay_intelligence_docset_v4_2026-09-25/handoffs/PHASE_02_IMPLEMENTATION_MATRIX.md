# Phase 02 implementation matrix — Run foundation

Reconstructed from the user-supplied Phase 02 handoff and the installed Fount tree during runtime QC. The original Phase 02 docset handoffs were absent at the applied docset commit. Executed results are in [the runtime QC report](PHASE_02_RUNTIME_QC_REPORT.md).

| ID | Installed source | Runtime tests and evidence |
| --- | --- | --- |
| R01 | `packages/fount_run`; root workspace, CI, architecture and package tooling | `mix ci`, host-free application start, five `mix hex.build` archives, Core independence audit |
| R02 | `packages/fount_run/priv/repo/migrations/20260928010000_create_run_foundation.exs`; `FountRun.migrations_path/0` | `integration/storage_constraints_test.exs`, `integration/run_foundation_test.exs`, `integration/run_upgrade_test.exs`; Core-first migration and cross-identity failures |
| R03 | `FountRun.ActorContext`, `FountRun.Plan`, `FountRun.Policy`, `FountRun.Persistence`, public start/read/list | Run `plan_policy_test.exs` and start/read/list PostgreSQL integration |
| R04 | append-only plan/policy/event storage, version pointers, fingerprints | Run snapshot PostgreSQL integration and closed-schema unit tests |
| R05 | `FountRun.Decision`, `FountRun.ApprovalAttempt`, persistence and DB guards | two-connection decision race, approval-attempt lifecycle and blocked accepted outcome in PostgreSQL integration |
| R06 | `FountRun.Budget`, `FountRun.Step`, `FountRun.Attempt`, `FountRun.Delivery`; lease fields and constraints | usage, step/attempt/event and delivery replay/linkage PostgreSQL integration |

Phase 03 worker selection, renewal/reclaim, provider dispatch/accounting and crash recovery are outside this matrix.
