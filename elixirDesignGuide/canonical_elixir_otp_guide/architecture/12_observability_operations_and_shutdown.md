# Observability, Operations, And Shutdown

## Purpose

This document defines how Elixir/OTP applications expose runtime behavior, support operations, handle shutdown, and feed production learning back into architecture.

## Observability Rule

```text
If a feature can fail in production, operators need a way to see it, explain it, and recover it.
```

## Telemetry

Emit telemetry for:

- Public commands.
- Transactions.
- External calls.
- Jobs.
- Retries.
- Outbox delivery.
- Process start/stop/crash.
- State machine transitions.
- Authorization failures.
- Rate limits.
- Queue depth.

Event naming:

```elixir
[:my_app, :orders, :place_order, :stop]
[:my_app, :outbox, :deliver, :exception]
[:my_app, :workflow, :transition]
```

Include metadata:

- Tenant/account ID where safe.
- Request/correlation ID.
- Actor ID where safe.
- Resource ID.
- Error class.
- Payload version.
- Node.

Do not include secrets or raw untrusted payloads.

## Logging

Logs should:

- Explain exceptional paths.
- Include correlation metadata.
- Avoid duplicate noisy success logs.
- Redact sensitive fields.
- Avoid dumping large process state.

Expected business errors often belong in telemetry metrics, not error logs.

## Metrics

Track:

- Request latency.
- Command success/failure counts.
- Job queue depth and age.
- Retry counts.
- Outbox backlog.
- Process restart count.
- Mailbox sizes.
- Memory.
- Scheduler utilization.
- Database query latency.
- External provider latency and error rate.

## Tracing

Use traces for:

- Multi-step commands.
- External calls.
- Jobs spawned from requests.
- Cross-node or cross-service flows.

Propagate context across:

- Tasks.
- Jobs.
- PubSub where useful.
- External calls.

## Health Checks

Health checks should distinguish:

- Process alive.
- Dependency reachable.
- Ready to accept work.
- Degraded but serving.
- Draining during shutdown.

Avoid a single "alive" check that hides dependency or backlog failures.

## Dashboards

Minimum dashboards:

- Application overview.
- Command latency/errors.
- Job/outbox health.
- Process health.
- Database health.
- External dependency health.
- Security/audit events.

## SLOs And Operational Feedback

Define service-level objectives for critical flows:

- Availability.
- Latency.
- Error rate.
- Job completion age.
- Outbox delivery age.
- Recovery time after dependency failure.
- Maximum tolerated projection lag.

When an SLO is breached, the result should feed back into architecture:

- Add or tune backpressure.
- Add missing telemetry.
- Change retry policy.
- Split an overloaded process.
- Move in-memory work to durable jobs.
- Revisit database indexes or read models.
- Add a new acceptance gate for the failure class.

## Runbooks

Each critical feature needs:

- Symptoms.
- Dashboard links.
- Common causes.
- Safe inspection commands.
- Safe remediation.
- Escalation owner.
- Data repair notes if applicable.

## Graceful Shutdown

Shutdown design:

1. Stop accepting new external work.
2. Stop scheduling new internal work.
3. Drain in-flight requests when bounded.
4. Persist checkpoints.
5. Release external resources.
6. Stop dependencies last.

For jobs:

- Define whether jobs finish, checkpoint, or abort.
- Ensure aborted jobs retry safely.
- Keep shutdown timeout realistic.

For processes:

- Implement `terminate/2` only when useful.
- Prefer durable state over relying on terminate callback.
- Handle supervisor shutdown order.

## Incident Feedback

After incidents:

- Add regression tests.
- Add missing telemetry.
- Update runbooks.
- Add static checks for preventable classes.
- Revisit architecture assumptions.
- Update feature acceptance templates.

## Review Checklist

- [ ] Commands, jobs, effects, and transitions emit telemetry.
- [ ] Logs are useful and redacted.
- [ ] Operators can inspect process health safely.
- [ ] Shutdown order and drain behavior are defined.
- [ ] Runbooks exist for critical features.
- [ ] Incident learnings feed back into checks and templates.
