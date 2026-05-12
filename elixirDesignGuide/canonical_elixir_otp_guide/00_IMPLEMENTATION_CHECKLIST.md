# Implementation Checklist And Coverage Ledger

This checklist is the control plane for the docset. Each top-level item corresponds to one guide document. Each subchecklist records the coverage that document must contain.

Status legend:

- `[ ]` Planned but not yet covered.
- `[x]` Covered in the current docset.
- `Review note` records improvements made during the final review pass.

## Docset-Level Acceptance

- [x] Every guide document exists.
- [x] Every guide has a clear purpose and intended audience.
- [x] Greenfield and brownfield paths are both covered.
- [x] Domain modeling, effect boundaries, OTP lowering, supervision, persistence, external effects, testing, CI, observability, security, distributed operation, and feature acceptance are all covered.
- [x] QC appears throughout the guide, not only in QC-specific files.
- [x] Templates exist for architecture, process, state, effects, reviews, exceptions, and acceptance.
- [x] Final review pass completed for clarity, utility, and canonical consistency.

Review note: The final pass added explicit brownfield audit tracks, SLO feedback, and Oban/dead-letter handling language before this checklist was closed.

## 01 Formal Development Process

- [x] Defines the multi-tier architecture process.
- [x] Defines iterative critique, reflection, and redesign loops.
- [x] Defines required artifacts and gates.
- [x] Defines when to refactor, rebuild, or stop.
- [x] Defines roles for human review, deterministic tooling, and LM-assisted critique.

## 02 Greenfield Lifecycle

- [x] Covers charter, NFRs, domain model, boundaries, contracts, state, effects, OTP lowering, implementation, and release.
- [x] Prevents premature process-oriented design.
- [x] Provides acceptance gates for each stage.
- [x] Covers iterative architecture tournaments and compression review.

## 03 Brownfield Lifecycle

- [x] Covers inventory, runtime/process audit, data audit, boundary audit, dependency audit, and risk classification.
- [x] Defines safe remediation sequencing.
- [x] Covers strangler, wrapper, extraction, and rebuild options.
- [x] Defines brownfield evidence and stop conditions.

## 04 Domain Data And Boundaries

- [x] Separates value objects, entities, aggregates, commands, events, read models, persistence records, and runtime state.
- [x] Defines bounded contexts and allowed dependency edges.
- [x] Maps invariants to enforcement locations.
- [x] Covers anti-corruption layers and external payload translation.
- [x] Covers public API budgets and module organization.

## 05 Functional Core, Effect Shell

- [x] Defines pure core rules.
- [x] Defines effect shell responsibilities.
- [x] Covers dependency injection for time, UUID, config, IO, and external clients.
- [x] Covers command/application services.
- [x] Covers expected error returns versus crashes.

## 06 OTP Runtime Lowering

- [x] Defines when to use plain modules, GenServer, Agent, Task, Task.Supervisor, Supervisor, DynamicSupervisor, Registry, ETS, `:gen_statem`, GenStage/Broadway, and Oban.
- [x] Requires process justification forms.
- [x] Covers call/cast/message policy.
- [x] Covers business logic extraction from callbacks.
- [x] Covers anti-patterns and rejection rules.

## 07 Supervision And Process Lifecycle

- [x] Covers failure domains.
- [x] Covers static and dynamic children.
- [x] Covers restart policy and shutdown timeout.
- [x] Covers startup/shutdown order.
- [x] Covers process state recovery and mailbox/backpressure concerns.

## 08 Persistence, Transactions, And Effects

- [x] Covers Ecto schema/domain separation.
- [x] Covers validations versus constraints.
- [x] Covers `Ecto.Multi`, transactions, locks, idempotency, and uniqueness.
- [x] Covers outbox and durable job patterns.
- [x] Covers migrations, zero-downtime changes, and data repair.

## 09 APIs, Web Layers, And Contracts

- [x] Covers Phoenix/controllers/LiveView/context boundaries.
- [x] Covers DTOs and input validation.
- [x] Covers behavior contracts, consumer contracts, and versioning.
- [x] Covers public API review and compatibility.
- [x] Covers external SDK/provider adapter boundaries.

## 10 Workflows, Jobs, And External Effects

- [x] Covers long-running workflows.
- [x] Covers state machines and sagas.
- [x] Covers Oban/job queues, retries, backoff, dead letters, and compensation.
- [x] Covers external HTTP/CLI/provider calls.
- [x] Covers idempotent effect delivery and exactly-once illusions.

## 11 Distributed OTP And Cluster Readiness

- [x] Covers cluster topology and node roles.
- [x] Covers distributed registry, PubSub, RPC, process groups, and partition risks.
- [x] Covers rolling upgrades and mixed-version compatibility.
- [x] Covers capability negotiation and payload versioning.
- [x] Covers distributed test and chaos requirements.

## 12 Observability, Operations, And Shutdown

- [x] Covers logs, metrics, traces, telemetry, health checks, and dashboards.
- [x] Covers process-level observability.
- [x] Covers graceful shutdown and drain.
- [x] Covers incident-ready diagnostics and runbooks.
- [x] Covers operational SLOs and feedback into design.

## 13 Security, Config, Secrets, And Tenant Boundaries

- [x] Covers runtime config and release-safe env handling.
- [x] Covers secret handling and redaction.
- [x] Covers tenant/session/resource boundaries.
- [x] Covers unsafe atom, eval, deserialization, shell, and file access.
- [x] Covers audit trails and authorization around effects.

## 14 Testing, Verification, And Model Checking

- [x] Covers unit, integration, contract, property, state-machine, concurrency, trace, chaos, and release tests.
- [x] Covers testing pure logic separately from processes.
- [x] Covers process restart and supervision tests.
- [x] Covers distributed test harnesses.
- [x] Covers when to use model checking or trace-based verification.

## 15 Static Analysis, QC, And CI Gates

- [x] Covers format, compile, warnings, Credo, Dialyzer, Sobelow, deps audit, boundary checks, custom checks, and migration safety.
- [x] Covers CI gate levels.
- [x] Covers deterministic versus LM-assisted controls.
- [x] Covers exceptions with owners and expiration.
- [x] Covers release evidence and quality ledgers.

## 16 Refactoring, Cleanup, And Rebuild Process

- [x] Covers pass-based cleanup.
- [x] Covers no-regex structural rewrite rule.
- [x] Covers sequencing from inventory to final governance.
- [x] Covers code deletion, API shrinkage, and abstraction collapse.
- [x] Covers rebuild triggers and migration paths.

## 17 Feature Acceptance And Review Protocol

- [x] Covers pre-code reviews.
- [x] Covers architecture review stages.
- [x] Covers implementation acceptance.
- [x] Covers evidence packages.
- [x] Covers post-merge learning and rule promotion.

## 18 Use Case Playbooks

- [x] Covers transactional CRUD/context feature.
- [x] Covers stateful session/process feature.
- [x] Covers background job/outbox feature.
- [x] Covers external provider integration.
- [x] Covers real-time/PubSub feature.
- [x] Covers distributed/clustered feature.
- [x] Covers brownfield remediation feature.

## 19 Templates And Forms

- [x] Provides charter template.
- [x] Provides domain model template.
- [x] Provides boundary contract template.
- [x] Provides process justification template.
- [x] Provides supervisor design template.
- [x] Provides state machine template.
- [x] Provides effect declaration template.
- [x] Provides review finding template.
- [x] Provides acceptance evidence template.
- [x] Provides exception waiver template.

## 20 Canonical Review Rubric

- [x] Covers data/domain review.
- [x] Covers functional-core review.
- [x] Covers OTP/process review.
- [x] Covers persistence/effects review.
- [x] Covers API/contracts review.
- [x] Covers distributed/operations/security review.
- [x] Covers test/QC/release review.
- [x] Defines severity, blocking criteria, and acceptance decision.
