# Templates And Forms

## Purpose

This document provides reusable forms for the formal development process.

## Charter Template

```markdown
# Feature/System Charter

## Intent

## Users And Operators

## Hard Invariants

- Invariant:
  Enforcement path:

## Nonfunctional Priorities

1. 
2. 
3. 

## Non-Goals

## Release Constraints
```

## Domain Model Template

```markdown
# Domain Model

## Vocabulary

| Term | Type | Definition | Accepted? |
|---|---|---|---|

## Value Objects

## Entities

## Aggregates

## Commands

## Events

## Read Models

## Rejected Or Collapsed Terms
```

## Boundary Contract Template

```yaml
boundary:
  name:
  owner:
  public_api:
    - function:
      inputs:
      outputs:
      expected_errors:
      side_effects:
  allowed_callers:
  forbidden_callers:
  payload_versioning:
  telemetry:
```

## Process Justification Template

```yaml
process:
  name:
  primitive:
  reason:
    - owns_runtime_state
  state_owned:
    - name:
      authoritative:
      persisted_in:
      recovery:
  callers:
  public_api:
  messages:
    calls:
    casts:
    infos:
  timeout_policy:
  overload_policy:
  supervisor:
  restart_policy:
  shutdown_timeout:
  telemetry:
  tests:
```

## Supervisor Design Template

```yaml
supervisor:
  name:
  failure_domain:
  strategy:
  children:
    - name:
      type:
      restart:
      shutdown:
      dependency_notes:
  startup_order:
  shutdown_order:
  restart_intensity:
  state_loss:
  recovery:
```

## State Machine Template

```yaml
state_machine:
  name:
  persisted:
  states:
    - name:
      allowed_events:
      timeout:
  transitions:
    - from:
      event:
      to:
      actions:
      persistence:
  forbidden_transitions:
  duplicate_event_behavior:
  recovery:
  tests:
```

## Effect Declaration Template

```yaml
effect:
  name:
  type: email | webhook | payment | provider_call | file | shell | pubsub | job
  trigger:
  transaction_relation: inside_transaction | after_commit | outbox | job
  idempotency:
  retry_policy:
  timeout:
  authorization_context:
  telemetry:
  redaction:
  compensation:
  tests:
```

## Persistence Change Template

```yaml
persistence_change:
  name:
  schema_or_table:
  change_type:
  online_safe:
  migration_steps:
  backfill:
  compatibility_window:
  rollback_or_forward_fix:
  constraints:
  tests:
```

## Review Finding Template

```yaml
finding:
  id:
  severity: blocker | high | medium | low
  area:
  evidence:
    - file:
      detail:
  risk:
  recommendation:
  owner:
  required_before_merge:
  check_candidate:
```

## Acceptance Evidence Template

```yaml
acceptance:
  feature:
  owner:
  review_tier:
  design_docs:
  implementation_refs:
  gates:
    format:
    compile:
    tests:
    credo:
    dialyzer:
    security:
  tests_added:
  processes_added:
  public_api_changes:
  migrations:
  effects:
  liveview_pubsub:
  ingestion_pipelines:
  advanced_primitives:
  framework_mapping:
  telemetry:
  exceptions:
  decision:
  reviewer:
```

## Fast Track Template

```yaml
fast_track:
  feature:
  scope:
  why_low_risk:
  existing_boundaries_used:
  new_runtime_ownership: false
  new_external_effect: false
  public_api_change: false
  migration_risk: false
  security_or_tenant_change: false
  tests:
  qc_gates:
  reviewer:
```

## LiveView Design Template

```yaml
live_view:
  module:
  route_or_mount:
  context_apis:
  assigns:
    - name:
      type: presentation | derived | async_result | stream | durable_reference
      recovery:
  events:
    - name:
      context_call:
      expected_errors:
  pubsub:
    topics:
      - topic_shape:
        tenant_scope:
        payload:
        versioned:
        missed_message_recovery:
        fanout_estimate:
  async_work:
    - name:
      cancellation_ok:
      failure_ui:
  tests:
```

## Ingestion Pipeline Template

```yaml
ingestion_pipeline:
  name:
  source:
  producer:
  delivery_guarantee:
  message_schema:
  payload_version:
  processor_concurrency:
  batch_size:
  batch_timeout:
  partitioning:
  idempotency:
  ack_policy:
  retry_policy:
  poison_message_policy:
  dead_letter:
    destination:
    owner:
    alert:
    replay:
    retention:
  shutdown:
  telemetry:
  tests:
```

## Advanced Primitive Template

```yaml
advanced_primitive:
  name:
  primitive: ets | persistent_term | atomics | counters
  owner_module:
  reason:
  read_pattern:
  write_pattern:
  update_frequency:
  state_authority: cache | derived | local_metric | durable_fact
  restart_or_loss_behavior:
  observability:
  tests:
```

## Ash Mapping Template

```yaml
ash_mapping:
  domain:
  resources:
    - resource:
      guide_concept:
      public_actions:
      policies:
      data_layer:
      generated_interfaces:
      effects:
      transaction_notes:
      tests:
```

## Exception Waiver Template

```yaml
exception:
  id:
  rule:
  location:
  reason:
  owner:
  expires:
  compensating_control:
  evidence:
  reviewer:
```

## Architecture Decision Template

```markdown
# ADR: <title>

## Status

Proposed | Accepted | Superseded

## Context

## Options Considered

## Decision

## Consequences

## Rejection Criteria

## Review Date
```
