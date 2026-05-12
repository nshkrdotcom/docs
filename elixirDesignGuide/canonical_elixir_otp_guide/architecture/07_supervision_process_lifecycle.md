# Supervision And Process Lifecycle

## Purpose

This document defines how to design supervisors, process lifecycles, restart behavior, shutdown, and runtime state recovery.

## Rule

```text
Supervision trees are organized by failure domains, not source directories.
```

## Failure Domain Questions

For each supervisor:

- What can fail independently?
- What must restart together?
- What state is lost?
- Can that state be rebuilt?
- Which children are dependencies of later children?
- What starts first?
- What stops first?
- What restart intensity prevents crash loops?
- What shutdown timeout is safe?

## Supervisor Strategies

### `:one_for_one`

Default. Restart only failed child.

Use when children are independent.

### `:one_for_all`

Restart all children if one fails.

Use when no child is meaningful alone.

### `:rest_for_one`

Restart failed child and children started after it.

Use when later children depend on earlier children.

Example:

```elixir
children = [
  {Registry, keys: :unique, name: MyApp.WorkflowRegistry},
  {DynamicSupervisor, name: MyApp.WorkflowRunSupervisor, strategy: :one_for_one}
]

Supervisor.init(children, strategy: :rest_for_one)
```

If the Registry dies, dynamic children registered in it should restart too.

## Static And Dynamic Children

Use normal Supervisor for children known at boot:

```elixir
children = [
  MyApp.Repo,
  {Task.Supervisor, name: MyApp.TaskSupervisor},
  MyApp.Workflows.Supervisor,
  MyAppWeb.Endpoint
]
```

Use DynamicSupervisor for runtime-created children:

```elixir
DynamicSupervisor.start_child(
  MyApp.SessionSupervisor,
  {MyApp.Sessions.SessionServer, session_id: session_id}
)
```

## Restart Policies

| Policy | Meaning | Use |
|---|---|---|
| `:permanent` | Always restart | Core service or long-lived server. |
| `:transient` | Restart only abnormal exits | Job-like child that can finish normally. |
| `:temporary` | Never restart | Disposable one-off child. |

Do not mark every child permanent. A child that finishes successfully may become a restart loop if marked incorrectly.

## Startup And Shutdown Order

Supervisors start children in listed order and shut down in reverse.

Recommended:

```text
startup:  Repo -> Registry -> WorkerSupervisor -> Endpoint
shutdown: Endpoint -> WorkerSupervisor -> Registry -> Repo
```

Stop accepting work before shutting down workers and dependencies.

## Shutdown Policy

Each child needs:

- Shutdown timeout.
- Drain behavior.
- In-flight work behavior.
- External resource cleanup.
- Telemetry for shutdown failure.

Long-running work should checkpoint progress or be durable. Shutdown timeout should not pretend in-memory work is durable.

## State Recovery

For every process state value:

| Question | Required Answer |
|---|---|
| Is it authoritative? | If yes, where persisted? |
| Is it cached? | How invalidated and rebuilt? |
| Is it derived? | What source derives it? |
| Is it external resource state? | How reconnected or released? |
| Is it workflow progress? | How resumed after crash? |

Recovery patterns:

- Reload from database.
- Rebuild from event log.
- Rebuild from durable job args.
- Reconnect to external resource.
- Drop cache and warm lazily.
- Fail closed and require operator action.

## Mailbox And Backpressure

Every process accepting messages needs:

- Message types.
- Expected rate.
- Maximum safe backlog.
- Timeout policy.
- Overload behavior.
- Telemetry for mailbox size.

Avoid:

- Unbounded casts.
- Slow work in callbacks.
- `Process.sleep/1` as flow control.
- Blocking HTTP calls inside a state owner.

Options:

- Use `call` for backpressure.
- Use bounded queues.
- Use GenStage/Broadway for pipelines.
- Use Oban for durable async work.
- Use `Task.Supervisor.async_nolink` and handle result/DOWN.

## Timers

Timer rules:

- Store timer refs when cancellation matters.
- Handle late timer messages.
- Keep time decisions in runtime shell, not pure core.
- Test timer behavior with controlled clocks when possible.

## Process Observability

For each important process expose:

- Name or discovery path.
- Telemetry events.
- State summary function safe for production.
- Mailbox size.
- Memory.
- Reductions.
- Restart count.
- Last error metadata.

Do not expose secrets or large state dumps.

## Lifecycle Design Note

Every process should have:

```yaml
lifecycle:
  why_exists:
  starter:
  stopper:
  static_or_dynamic:
  supervisor:
  restart_policy:
  shutdown_timeout:
  crash_result:
  state_lost:
  recovery:
  overload:
  observability:
```

## Review Checklist

- [ ] Supervisor groups match failure domains.
- [ ] Startup and shutdown order are intentional.
- [ ] Restart policies match lifecycle.
- [ ] Process state has recovery path.
- [ ] Mailbox and overload behavior are defined.
- [ ] Shutdown drains or safely abandons work according to durability rules.

