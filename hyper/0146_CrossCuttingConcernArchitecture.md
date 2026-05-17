# Response 33 - Cross-Cutting Concern Architecture

The design already has dimensions and architecture perspectives. Security, performance, observability, compliance, accessibility, and internationalization can appear as tags or filters.

But a cross-cutting concern is not just a tag.

Security architecture, for example, has requirements, threats, boundaries, decisions, patterns, code, tests, runtime signals, exceptions, owners, and governance.

It needs a first-class model.

---

# 1. Core Claim

Cross-cutting concerns should be navigable architecture objects that span the full abstraction stack.

A concern is coherent across:

```text
requirements
risks
architecture decisions
commitments
code patterns
tests
runtime telemetry
incidents
ownership
exceptions
governance
```

The system should support "show me the security architecture" as a first-class query, not as a collection of filtered nodes.

---

# 2. Concern Objects

| Object | Meaning |
|---|---|
| `architecture_concern` | A cross-cutting concern such as security or performance |
| `concern_scope` | Where the concern applies |
| `concern_requirement` | Requirement or objective specific to the concern |
| `concern_pattern` | Accepted implementation or design pattern |
| `concern_surface` | Code, runtime, data, API, or workflow surface affected by the concern |
| `concern_control` | Test, policy, monitor, review, or guardrail |
| `concern_exception` | Scoped deviation from concern rules |
| `concern_map` | Projection of the concern across the system |

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_concern (
  architecture_concern_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  concern_key        text NOT NULL,
  display_name       text NOT NULL,
  concern_kind       text NOT NULL,
  -- security, performance, observability,
  -- reliability, compliance, accessibility,
  -- privacy, internationalization, cost,
  -- data_quality

  owner_actor_id     uuid,
  owner_body_id      uuid,
  perspective_id     uuid,
  lifecycle_state    text NOT NULL DEFAULT 'active',
  description        text,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, concern_key)
);
```

```sql
CREATE TABLE concern_scope (
  concern_scope_id   uuid PRIMARY KEY,
  architecture_concern_id uuid NOT NULL REFERENCES architecture_concern(architecture_concern_id),

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  applicability      text NOT NULL,
  -- primary, secondary, not_applicable,
  -- inherited, conditional, disputed

  rationale_text     text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE concern_surface (
  concern_surface_id uuid PRIMARY KEY,
  architecture_concern_id uuid NOT NULL REFERENCES architecture_concern(architecture_concern_id),

  surface_kind       text NOT NULL,
  -- api_endpoint, data_store, background_job,
  -- external_provider, trust_boundary,
  -- user_flow, deployment_unit, runtime_metric,
  -- test_suite, configuration

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  risk_level         text NOT NULL DEFAULT 'unknown',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE concern_control (
  concern_control_id uuid PRIMARY KEY,
  architecture_concern_id uuid NOT NULL REFERENCES architecture_concern(architecture_concern_id),

  control_kind       text NOT NULL,
  -- test, monitor, policy, lint_rule,
  -- review_gate, runbook, ownership_rule,
  -- runtime_alert, dashboard

  control_subject_kind text NOT NULL,
  control_subject_id uuid NOT NULL,
  covers_subject_kind text,
  covers_subject_id uuid,

  control_state      text NOT NULL,
  -- active, missing, weak, stale,
  -- exceptioned, planned, retired

  evidence_json      jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE concern_map_snapshot (
  concern_map_snapshot_id uuid PRIMARY KEY,
  architecture_concern_id uuid NOT NULL REFERENCES architecture_concern(architecture_concern_id),
  workspace_snapshot_id uuid NOT NULL,

  map_kind           text NOT NULL,
  -- risk_map, control_coverage, data_flow,
  -- trust_boundary, performance_hot_path,
  -- observability_coverage

  projection_packet_id uuid,
  summary_json       jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Concern Navigation

A security reviewer should be able to navigate:

```text
security concern
  -> password reset requirement
  -> token expiry commitment
  -> Accounts.Token module
  -> tests covering expiry
  -> runtime traces for reset flow
  -> exception for legacy mobile app
  -> owner and approval body
  -> open risks
```

A performance reviewer should be able to navigate:

```text
performance concern
  -> checkout latency objective
  -> hot path map
  -> synchronous provider calls
  -> cache commitments
  -> load test coverage
  -> runtime p95 regression
  -> proposed remediation
```

These are not separate products. They are concern projections over the same architecture intelligence substrate.

---

# 5. Concern-Specific Belief States

The belief calculus should support concern context.

Example:

```text
Claim:
  Billing.InvoiceFinalizer is acceptable.

Domain perspective:
  believed

Performance concern:
  contested due to synchronous provider call

Security concern:
  verified for token handling

Observability concern:
  weak because retry failures are not emitted as telemetry
```

The system should avoid collapsing these into one generic architecture health score.

---

# 6. Product Behavior

Queries:

```text
Show the security architecture for password reset.
Where is observability missing from the billing flow?
Which performance controls cover checkout?
Which cross-cutting concern is most affected by this PR?
Show all exceptions to privacy controls for exports.
```

Outputs:

```text
concern map
coverage matrix
risk path
control gap
exception inventory
concern-specific PR review
```

---

# 7. Minimal Viable Layer

Start with one concern:

```text
security
```

Model:

```text
architecture_concern
concern_scope
concern_surface
concern_control
security-specific commitment pack
security concern projection
```

This gives security reviewers a real home in the system.

---

# 8. Final Definition

A cross-cutting concern architecture is a coherent, navigable architecture view that cuts through requirements, code, tests, runtime, ownership, and governance.

It turns tags into an operational map.

