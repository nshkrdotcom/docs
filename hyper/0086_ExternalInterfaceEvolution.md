# Response 13 - External Interface Evolution

The architecture design models external systems as entities, but it mostly treats them as leaves. In serious systems, external interfaces evolve and generate architectural work.

Examples:

```text
payment provider API version deprecates
email provider changes webhook payload
database version removes behavior
OAuth provider changes token claims
cloud service changes retry semantics
partner API adds required field
```

The system needs a first-class model for external interface evolution.

---

# 1. Core Claim

External systems are not static dependencies. They are versioned architecture actors with contracts, timelines, deprecations, migrations, and runtime evidence.

The system should answer:

```text
Which provider API versions do we use?
Which external deprecations affect us?
What code depends on provider behavior?
Which tests prove compatibility?
What must change before a provider deadline?
Which commitments are invalidated by external interface changes?
```

---

# 2. External Evolution Objects

| Object | Meaning |
|---|---|
| `external_system_identity` | Stripe, SendGrid, AWS S3, partner API, database engine |
| `external_interface` | Specific API, webhook, SDK, protocol, schema, CLI, service behavior |
| `external_interface_version` | Versioned external contract |
| `external_change_notice` | Deprecation, breaking change, migration notice, incident |
| `external_contract_binding` | Internal code/config/tests tied to external behavior |
| `compatibility_assessment` | Whether current system is compatible |
| `provider_migration_plan` | Work required to move from one version to another |

---

# 3. Suggested Schema

```sql
CREATE TABLE external_system_identity (
  external_system_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  system_key         text NOT NULL,
  display_name       text NOT NULL,
  provider_kind      text NOT NULL,
  -- payment_provider, email_provider, cloud_service,
  -- database, partner_api, identity_provider, package_registry
  owner_entity_id    uuid,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, system_key)
);
```

```sql
CREATE TABLE external_interface (
  external_interface_id uuid PRIMARY KEY,
  external_system_id uuid NOT NULL REFERENCES external_system_identity(external_system_id),
  interface_key      text NOT NULL,
  interface_kind     text NOT NULL,
  -- rest_api, graphql_api, webhook, sdk, protocol,
  -- config_schema, auth_claims, event_payload
  display_name       text NOT NULL,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (external_system_id, interface_key)
);
```

```sql
CREATE TABLE external_interface_version (
  external_interface_version_id uuid PRIMARY KEY,
  external_interface_id uuid NOT NULL REFERENCES external_interface(external_interface_id),
  version_key        text NOT NULL,
  lifecycle_state    text NOT NULL,
  -- current, supported, deprecated, sunset, removed, unknown
  released_at        timestamptz,
  deprecated_at      timestamptz,
  sunset_at          timestamptz,
  contract_json      jsonb NOT NULL DEFAULT '{}',
  source_uri         text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  UNIQUE (external_interface_id, version_key)
);
```

```sql
CREATE TABLE external_change_notice (
  external_change_notice_id uuid PRIMARY KEY,
  external_system_id uuid NOT NULL REFERENCES external_system_identity(external_system_id),
  external_interface_id uuid REFERENCES external_interface(external_interface_id),
  from_version_id    uuid,
  to_version_id      uuid,
  notice_kind        text NOT NULL,
  -- deprecation, breaking_change, migration_required,
  -- behavior_change, security_advisory, incident
  title              text NOT NULL,
  body_text          text,
  effective_at       timestamptz,
  severity           text NOT NULL DEFAULT 'medium',
  source_uri         text,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE external_contract_binding (
  external_contract_binding_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  external_interface_version_id uuid REFERENCES external_interface_version(external_interface_version_id),
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  binding_kind       text NOT NULL,
  -- calls_api, consumes_webhook, emits_payload,
  -- uses_sdk, depends_on_behavior, configures_provider,
  -- verifies_compatibility
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE provider_migration_plan (
  provider_migration_plan_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  external_change_notice_id uuid REFERENCES external_change_notice(external_change_notice_id),
  title              text NOT NULL,
  state              text NOT NULL DEFAULT 'proposed',
  -- proposed, accepted, in_progress, blocked, completed, superseded
  deadline_at        timestamptz,
  affected_artifacts_json jsonb NOT NULL DEFAULT '[]',
  required_actions_json jsonb NOT NULL DEFAULT '[]',
  risk_json          jsonb NOT NULL DEFAULT '{}',
  owner_id           uuid,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

---

# 4. External Change as an Event

External changes should enter the same intelligence loop:

```text
external notice ingested
  -> affected bindings found
  -> beliefs invalidated
  -> compatibility assessed
  -> impact classified
  -> migration plan proposed
  -> actions generated
  -> progress tracked
```

Example:

```text
Provider notice:
  Payment API v2 sunset on 2026-09-30.

System finds:
  Billing.PaymentClient uses v2 endpoints.
  Contract tests cover v2 payload only.
  Runtime traces show v2 calls in prod.

Impact:
  must_change client adapter
  must_revalidate webhook parser
  must_update contract tests
  must_revalidate reconciliation jobs
```

---

# 5. External Drift

There are two important drift types:

```text
internal_to_external_drift
  internal assumptions no longer match provider contract

external_to_internal_drift
  provider behavior changed but internal code did not adapt
```

Examples:

```text
webhook adds required field
SDK retry behavior changes
API endpoint deprecates response field
provider changes rate-limit semantics
database version changes query planner behavior
```

These should create belief states such as:

```text
compatibility_unknown
compatibility_verified
compatibility_drifted
migration_required
sunset_risk
```

---

# 6. Queries

```text
Which external API versions are we using?
Which provider deprecations affect production services?
What code depends on this webhook schema?
Which tests verify compatibility with provider v3?
What must change before this external sunset date?
Which external assumptions have runtime evidence?
```

IntentQL example:

```yaml
query: impact
change:
  external_change_notice: stripe_v2_sunset
impact:
  classify:
    - must_change
    - must_revalidate
    - may_change
include:
  - code
  - tests
  - runtime
  - contracts
  - migration_plan
```

---

# 7. Minimal Viable External Evolution Layer

Start with:

```text
1. external system identity
2. interface version
3. deprecation/change notice
4. code/config binding to external version
5. migration impact query
```

This is enough for provider migration planning and PR review warnings.

---

# 8. Final Definition

External Interface Evolution is:

> A versioned model of external APIs, protocols, provider behavior, deprecation notices, compatibility bindings, and migration plans, integrated into the same belief, impact, action, and projection machinery as internal architecture.

It closes the gap between:

```text
external systems as leaf nodes
```

and:

```text
external systems as evolving architectural constraints.
```

