# Workflows, Jobs, And External Effects

## Purpose

This document defines how to design long-running workflows, background jobs, retries, state machines, provider calls, and external side effects.

## Effect Rule

```text
External effects are never "just a function call."
They need ownership, idempotency, timeout, retry, telemetry, and recovery.
```

## One-Step Command

Use a normal transactional command when:

- Work completes quickly.
- All authoritative state changes fit in one transaction.
- External effects can be deferred.
- Caller can wait.

Example:

```text
place order:
  transaction writes order and outbox event
  returns receipt
  outbox later sends email
```

## Durable Job

Use durable job when:

- Work must run after process crash.
- Work should retry.
- Work may run later.
- Work is expensive.
- Work is external.

In Elixir applications this is commonly implemented with Oban or another durable job system backed by persistent storage. A supervised `Task` is useful for in-memory concurrency, but it is not a durable job.

Job rules:

- Args are small and versioned.
- Job can run more than once safely.
- Retry policy is bounded.
- Dead state is observable.
- Dead-letter or parked state has owner review and alerting.
- Job can be canceled or superseded if required.

## Data Ingestion Pipelines

Use Broadway or a GenStage-based pipeline when:

- Data arrives from Kafka, SQS, RabbitMQ, Google Pub/Sub, files, sockets, or another high-volume source.
- Backpressure matters.
- Work benefits from processor concurrency and batching.
- Acknowledgement, retry, or dead-letter behavior is tied to the source.
- Ordering or partitioning by key matters.

Do not use ad hoc GenServers, unbounded casts, or `Task.async_stream` as the default ingestion architecture for sustained external streams.

Broadway pipeline design must define:

- Source and producer module.
- Delivery guarantee from the source.
- Ack semantics.
- Batch size and batch timeout.
- Processor concurrency.
- Partitioning key and ordering requirements.
- Idempotency key or dedupe strategy.
- Poison-message handling.
- Dead-letter or quarantine destination.
- Replay strategy.
- Shutdown and drain behavior.
- Telemetry and backlog metrics.

Decision table:

| Need | Prefer |
|---|---|
| Must run one command later with retry | Oban or durable job. |
| Deliver outbox effects after commit | Outbox worker or durable job. |
| Consume a sustained message stream with backpressure | Broadway / GenStage. |
| Batch writes or provider calls from a stream | Broadway batchers. |
| Preserve per-key order while parallelizing other keys | Broadway partitioning or source partitioning. |
| Process a small in-memory list for current caller | `Task.async_stream` or plain `Enum`. |

Pipeline rules:

- `handle_message` and `handle_batch` callbacks stay thin and delegate domain decisions to pure or context modules.
- Messages are versioned at the boundary before entering domain code.
- Side effects are idempotent because source delivery is commonly at-least-once.
- Acknowledgement is coupled to successful processing or explicit failure handling.
- Backpressure configuration is reviewed under expected and overload rates.
- Dead-letter queues have owners, alerts, replay tools, and retention rules.

Avoid:

- Acknowledging before durable state or idempotent effect safety exists.
- Treating processor concurrency as a substitute for database constraints.
- Global ordering claims when only per-partition ordering is provided.
- Large message payloads when the pipeline can pass references and load detail from authoritative storage.

## Workflow

Use workflow when:

- There are multiple steps.
- Steps may wait for external events.
- Human or external approval may intervene.
- Compensation may be required.
- State must survive restarts.

Workflow state should be persisted. A process may drive the workflow, but it should not be the only source of truth for important progress.

## State Machines

Define:

- States.
- Events.
- Allowed transitions.
- Forbidden transitions.
- Actions.
- Timeouts.
- Persistence after transition.
- Recovery after crash.

Example:

```text
draft -> submitted -> approved -> executing -> completed
submitted -> rejected
executing -> failed
failed -> retrying
retrying -> executing
```

Test:

- Allowed transitions.
- Forbidden transitions.
- Duplicate events.
- Out-of-order events.
- Timeout paths.
- Recovery from persisted state.

## Sagas And Compensation

Use saga-like design when distributed steps cannot share one transaction.

Rules:

- Persist each step.
- Make each step idempotent.
- Define compensation for completed steps where possible.
- Define non-compensable effects explicitly.
- Alert on stuck state.

Do not claim exactly-once execution across external systems. Design for at-least-once delivery plus idempotent effects.

## External HTTP Calls

Each external call needs:

- Adapter boundary.
- Timeout.
- Retry policy.
- Circuit breaker or rate limit if needed.
- Idempotency key for mutations.
- Error classification.
- Telemetry.
- Redaction.
- Contract tests or fixtures.

Classify errors:

| Error | Response |
|---|---|
| Validation | Do not retry. |
| Auth | Do not retry without credential refresh. |
| Rate limit | Retry with backoff if within budget. |
| Timeout | Retry if idempotent. |
| 5xx | Retry if safe. |
| Unknown | Fail closed or park for operator review. |

## CLI And Port Effects

For external commands:

- Prefer `System.cmd/3` with argument list.
- Avoid shell string execution.
- Set timeout.
- Set working directory intentionally.
- Bound output size.
- Redact command and output.
- Capture exit status.
- Use supervised process or durable job if long-running.

## Outbox Delivery

Delivery worker:

- Reads due rows.
- Claims rows safely.
- Delivers effect.
- Records result.
- Schedules retry or dead state.
- Emits telemetry.

Outbox review:

- Can two workers deliver same row?
- Is duplicate delivery safe?
- What happens if delivery succeeds but recording success fails?
- What is the maximum retry age?
- What alerts on backlog?
- What moves an item to dead-letter state?
- Who owns dead-letter review?

## Review Checklist

- [ ] Long-running progress is persisted.
- [ ] External mutations are idempotent.
- [ ] Retry policy is bounded and observable.
- [ ] Jobs can tolerate duplicate execution.
- [ ] Ingestion pipelines define backpressure, acknowledgement, batching, poison-message, and replay behavior.
- [ ] State machines include forbidden transition tests.
- [ ] Non-compensable effects are explicit.
