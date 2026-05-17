# Response 10 - Composable Commitments and Policy Inheritance

The Commitment DSL defines scoped, executable architecture commitments. The missing piece is scale.

Real architecture rules are not flat. They are layered:

```text
company-wide platform rules
product-area rules
domain rules
bounded-context rules
service-specific rules
temporary exceptions
environment-specific profiles
```

The system needs commitment composition, inheritance, override, and effective-policy materialization.

---

# 1. Core Claim

Commitments should behave like layered policy modules.

The system should support:

```text
base policies
specialized policies
strengthening overrides
relaxing overrides
temporary derogations
environment profiles
conflict detection
effective commitment compilation
```

Without this, every rule must be copied and modified manually, and large organizations will accumulate inconsistent commitment packs.

---

# 2. Commitment Composition Concepts

| Concept | Meaning |
|---|---|
| `commitment_pack` | A named set of commitments |
| `extends` | One pack inherits another pack |
| `profile` | Environment or rollout mode, such as prod, staging, advisory |
| `override` | A scoped change to inherited behavior |
| `derogation` | Approved temporary relaxation |
| `strengthening` | Narrower or stricter version of inherited policy |
| `effective_commitment` | Materialized result after inheritance and overrides |

---

# 3. Suggested Schema

```sql
CREATE TABLE commitment_pack (
  commitment_pack_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  pack_key           text NOT NULL,
  display_name       text NOT NULL,
  lifecycle_state    text NOT NULL DEFAULT 'draft',
  -- draft, proposed, accepted, enforced, deprecated
  owner_body_id      uuid,
  version            text NOT NULL,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, pack_key, version)
);
```

```sql
CREATE TABLE commitment_pack_inheritance (
  inheritance_id     uuid PRIMARY KEY,
  child_pack_id      uuid NOT NULL REFERENCES commitment_pack(commitment_pack_id),
  parent_pack_id     uuid NOT NULL REFERENCES commitment_pack(commitment_pack_id),
  inheritance_order  integer NOT NULL DEFAULT 0,
  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (child_pack_id, parent_pack_id)
);
```

```sql
CREATE TABLE commitment_override (
  override_id        uuid PRIMARY KEY,
  commitment_pack_id uuid NOT NULL REFERENCES commitment_pack(commitment_pack_id),
  base_commitment_id uuid,

  override_kind      text NOT NULL,
  -- strengthen, relax, narrow_scope, widen_scope,
  -- change_severity, change_action_policy,
  -- add_exception, disable, replace

  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  patch_json         jsonb NOT NULL,

  justification      text,
  approval_verdict_id uuid,
  effective_from     timestamptz,
  effective_to       timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE commitment_profile (
  commitment_profile_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  profile_key        text NOT NULL,
  -- observe, advisory, fail_new, enforce_all,
  -- prod, staging, test, incident_mode
  profile_json       jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, profile_key)
);
```

```sql
CREATE TABLE effective_commitment (
  effective_commitment_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  commitment_pack_id uuid NOT NULL REFERENCES commitment_pack(commitment_pack_id),
  commitment_profile_id uuid REFERENCES commitment_profile(commitment_profile_id),

  source_commitment_id uuid,
  effective_key     text NOT NULL,
  effective_json    jsonb NOT NULL,
  source_chain_json jsonb NOT NULL DEFAULT '[]',
  conflict_state    text NOT NULL DEFAULT 'none',
  compiled_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snapshot_id, commitment_pack_id, commitment_profile_id, effective_key)
);
```

---

# 4. Override Safety

Not all overrides are equal.

| Override | Default Safety |
|---|---|
| Strengthen rule | Usually safe |
| Narrow rule scope | May hide violations |
| Relax severity | Needs approval |
| Add exception | Needs owner approval and expiry |
| Disable rule | Needs governance approval |
| Widen enforcement | Needs rollout policy |

The compiler should require governance verdicts for risky overrides.

---

# 5. Example

Base platform pack:

```yaml
commitment_pack: platform_defaults
commitments:
  - id: no_domain_to_platform_reverse_dependency
    forbid:
      relation: depends_on
      source:
        domain_kind: platform
      target:
        domain_kind: core_domain
```

Billing pack:

```yaml
commitment_pack: billing_architecture
extends:
  - platform_defaults

overrides:
  - base: no_cross_context_table_reads
    kind: add_exception
    scope:
      source:
        module: Billing.Legacy.Export
    expires_on: 2026-09-01
    approved_by: architecture-board
```

Effective materialization:

```text
platform rule inherited
billing-specific exception applied
exception visible and expiring
CI warns before expiry, fails after expiry
```

---

# 6. Conflict Detection

Composition introduces policy conflicts.

Detect:

```text
parent forbids, child allows
two parents define different severity
exception outlives parent commitment
profile disables critical security rule
override selector matches no artifacts
override selector matches too many artifacts
cyclic inheritance
ambiguous precedence
```

Conflict states:

```text
none
warning
requires_review
invalid
ambiguous
governance_blocked
```

---

# 7. Effective Commitments in Queries and CI

CI and query answers should use effective commitments, not raw source commitments.

The answer should show:

```text
effective rule
source pack
inherited parents
applied overrides
exceptions
profile
governance approvals
```

Trust UX example:

```text
This PR violates `billing_no_accounts_table_reads`.

Effective policy source:
  platform_data_ownership v3
  extended by billing_architecture v2
  exception legacy_billing_export expired on 2026-09-01
```

---

# 8. Minimal Viable Composition

Start with:

```text
1. commitment packs
2. single-parent inheritance
3. add_exception override
4. severity/action profile override
5. effective commitment materialization
6. conflict detection for allow/forbid contradictions
```

That is enough for large workspaces without requiring a full policy language at first.

---

# 9. Final Definition

Composable Commitments are:

> Layered, inheritable, override-aware architecture policies that compile into effective commitments for a specific workspace, snapshot, scope, and enforcement profile.

They close the gap between:

```text
a flat commitment DSL
```

and:

```text
architecture policy at organizational scale.
```

