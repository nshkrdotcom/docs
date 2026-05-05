# ADR Template

```yaml
id:
title:
status: proposed | accepted | rejected | superseded
spec_cell:
date:
```

## Context

What decision is needed?

## Decision

What did we choose?

## Alternatives considered

| Alternative | Pros | Cons | Decision |
|---|---|---|---|
| Pure module | | | |
| GenServer | | | |
| ETS + owner process | | | |
| DynamicSupervisor | | | |

## Nonfunctional requirements driving the choice

- maintainability:
- fault tolerance:
- latency:
- observability:
- team expertise:

## Consequences

What gets easier?

What gets harder?

## ENF impact

```yaml
runtime_shape:
processes_added:
public_api_added:
effects_added:
```

## Reversal trigger

When should this decision be revisited?
