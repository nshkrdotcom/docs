# Canonical Review Rubric

## Purpose

This document is the final review rubric for large Elixir/OTP work. Use it for architecture reviews, feature acceptance, brownfield cleanup, and release readiness.

## Severity

| Severity | Meaning |
|---|---|
| Blocker | Must be fixed before merge or release. |
| High | Should be fixed before merge unless explicit owner accepts risk. |
| Medium | Should be fixed soon or tracked. |
| Low | Improves clarity, consistency, or maintainability. |

## Data And Domain

Blockers:

- Domain model cannot express required invariant.
- Persistence schema is the only domain model for complex behavior.
- External payload leaks into core.
- Race-sensitive invariant lacks authoritative enforcement.

Review:

- Domain terms are clear.
- Value objects validate construction.
- Commands and events are explicit.
- Read and write models are separated where shape differs.
- Runtime state is not mistaken for durable fact.

## Functional Core

Blockers:

- Pure business logic calls Repo, HTTP, process APIs, or runtime config.
- Expected business failures are raised or swallowed inconsistently.
- Core behavior cannot be tested without supervision tree.

Review:

- Core transitions are pure.
- Time, IDs, and config are explicit.
- Expected errors are returned as data.
- Unexpected faults are not hidden.

## OTP And Runtime

Blockers:

- Production-significant process is unsupervised.
- GenServer exists only for code organization.
- Critical work uses unbounded `cast` or fire-and-forget process.
- Process state cannot recover after crash but represents business fact.

Review:

- Processes have justification forms.
- Supervisors match failure domains.
- Restart policies match lifecycle.
- Mailbox and overload behavior are defined.
- Dynamic lookup is justified.

## Persistence And Effects

Blockers:

- External irreversible effect happens inside transaction without recovery.
- No idempotency for retried command/effect.
- Migration can corrupt or lock production data without plan.
- Uniqueness relies only on pre-insert validation.

Review:

- Transactions are explicit.
- Constraints enforce race-sensitive rules.
- Outbox or durable jobs protect effects.
- Migrations are staged safely.

## APIs And Contracts

Blockers:

- Public API change has no compatibility assessment.
- External contract changed without versioning.
- Provider SDK type leaks across internal boundary.

Review:

- Public APIs are minimal.
- DTOs validate external input.
- Behaviors represent real seams.
- Contract tests cover adapters.

## Distributed And Operations

Blockers:

- Cross-node payload is unversioned for rolling upgrade path.
- Remote synchronous call has no timeout.
- PubSub is used as durable event delivery.
- Singleton ownership fails unsafe under partition.

Review:

- Cluster topology is declared.
- Capability negotiation exists where needed.
- Mixed-version behavior is tested.
- Operational dashboards and runbooks exist.

## Security

Blockers:

- Secret can appear in logs, telemetry, errors, or inspect output.
- Tenant boundary missing from data path.
- Untrusted input can create atoms, eval code, deserialize unsafe terms, or invoke shell.
- Background effect lacks authorization context.

Review:

- Runtime config is release-safe.
- Authorization context is propagated.
- Unsafe paths are absent or waived.
- Security tests cover rejection and redaction.

## Testing And QC

Blockers:

- No regression test for fixed production bug.
- No failure-mode test for critical runtime behavior.
- Static gates are skipped without rationale.
- Evidence package missing for release.

Review:

- Tests cover pure core, boundaries, persistence, processes, effects, and release risks.
- Property or state-machine testing is used where input/state space is large.
- CI gates are appropriate for risk.
- Exceptions have owner and expiration.

## Acceptance Decision

Accept only when:

- No blocker findings remain.
- High findings are fixed or explicitly owned.
- Evidence package is complete.
- Design and implementation match or amendment is recorded.
- QC gates pass or failures are explicitly waived.

Reject when:

- Runtime ownership is unclear.
- Invariant enforcement is missing.
- Security or data-loss risk remains.
- Tests cannot detect the behavior that matters.
- Release operation is not understood.

## Final Review Questions

- What can crash, and what happens next?
- What can be duplicated, and why is that safe?
- What can be delayed, and who notices?
- What can be stale, and who tolerates it?
- What can be lost, and why is that acceptable?
- What can be externally observed, and is it intentional?
- What can be removed to make the design simpler?

