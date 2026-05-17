# Response 26 - Architectural Pluralism and Perspective Models

The design has governance, belief states, corrections, and known unknowns. But it still tends to assume there is one real architecture and the system should discover or enforce it.

In practice, architecture is partly perspectival.

Different people can draw the same system differently:

```text
product sees capabilities
platform sees services and dependencies
domain experts see bounded contexts
SRE sees runtime failure domains
security sees trust boundaries
data teams see ownership and lineage
frontend teams see user journeys
```

These views can all be valid.

---

# 1. Core Claim

The system should support multiple coexisting architecture perspectives.

Not every disagreement is a temporary error waiting for governance to resolve. Some disagreements reflect legitimate modeling choices.

The system needs to distinguish:

```text
contradiction
ambiguity
unknown
governance dispute
legitimate perspective difference
```

---

# 2. Perspective Objects

| Object | Meaning |
|---|---|
| `architecture_perspective` | A coherent way of modeling the system |
| `perspective_scope` | Where and for whom the perspective is valid |
| `perspective_claim` | Claim true inside a perspective |
| `perspective_mapping` | Relation between concepts across perspectives |
| `viewpoint_conflict` | Tension between perspectives |
| `perspective_governance` | Which perspective is authoritative for which decision |

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_perspective (
  architecture_perspective_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  perspective_key    text NOT NULL,
  display_name       text NOT NULL,
  perspective_kind   text NOT NULL,
  -- domain, runtime, security, data, product,
  -- platform, ownership, deployment, user_journey,
  -- migration, legacy, team_local

  owner_actor_id     uuid,
  owner_body_id      uuid,
  description        text,
  lifecycle_state    text NOT NULL DEFAULT 'active',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, perspective_key)
);
```

```sql
CREATE TABLE perspective_scope (
  perspective_scope_id uuid PRIMARY KEY,
  architecture_perspective_id uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),
  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  validity_kind      text NOT NULL,
  -- authoritative, advisory, exploratory,
  -- historical, team_local, task_specific
  valid_from         timestamptz,
  valid_to           timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE perspective_claim (
  perspective_claim_id uuid PRIMARY KEY,
  architecture_perspective_id uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),
  claim_id           uuid NOT NULL,
  perspective_state  text NOT NULL,
  -- true_in_perspective, false_in_perspective,
  -- irrelevant, disputed, inherited
  rationale_text     text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  UNIQUE (architecture_perspective_id, claim_id)
);
```

```sql
CREATE TABLE perspective_mapping (
  perspective_mapping_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  from_perspective_id uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),
  to_perspective_id   uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),

  from_subject_kind  text NOT NULL,
  from_subject_id    uuid NOT NULL,
  to_subject_kind    text NOT NULL,
  to_subject_id      uuid NOT NULL,

  mapping_kind       text NOT NULL,
  -- equivalent, refines, abstracts, overlaps,
  -- conflicts, ignores, translates_to

  confidence         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE viewpoint_conflict (
  viewpoint_conflict_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  perspective_a_id   uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),
  perspective_b_id   uuid NOT NULL REFERENCES architecture_perspective(architecture_perspective_id),
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  conflict_kind      text NOT NULL,
  -- naming_conflict, boundary_conflict,
  -- ownership_conflict, priority_conflict,
  -- abstraction_conflict, legitimate_pluralism

  resolution_state   text NOT NULL DEFAULT 'open',
  -- open, accepted_plural, governed_authoritative,
  -- mapped, rejected, superseded

  explanation_text   text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Examples

## Security vs domain

Domain perspective:

```text
Billing and Accounts are separate bounded contexts.
```

Security perspective:

```text
Both are part of the identity/payment trust boundary for account takeover risk.
```

Both can be true. They answer different questions.

## Runtime vs source

Source perspective:

```text
Notifications is a separate OTP app.
```

Runtime perspective:

```text
Notifications workers run inside the same release as Billing.
```

Both are valid. The action depends on the task.

---

# 5. Perspective-Aware Queries

Queries should accept perspective.

Example:

```yaml
query: architecture_map
root:
  workspace: current
perspective: security
```

Different output:

```yaml
query: architecture_map
root:
  workspace: current
perspective: domain
```

The system should show when an answer depends on perspective:

```text
Under the domain perspective, this is Billing-owned.
Under the data ownership perspective, this table is Accounts-owned.
This creates a cross-perspective tension relevant to policy enforcement.
```

---

# 6. Perspective Authority

Some perspectives are authoritative for some decisions.

Examples:

```text
Security perspective is authoritative for token expiry risk.
Domain perspective is authoritative for bounded context naming.
SRE perspective is authoritative for runtime failure domains.
Product perspective is authoritative for capability grouping.
```

Governance should define which perspective wins for which action.

---

# 7. Pluralism in Trust UX

The UI should avoid forcing one view when pluralism is legitimate.

Example:

```text
This module has multiple valid classifications:

Domain view:
  Shared Kernel

Runtime view:
  Billing release dependency

Data view:
  Accounts reference-data consumer

Policy impact:
  Boundary checks use the domain view unless a data ownership rule is active.
```

This is more honest than pretending the module has one globally correct identity.

---

# 8. Minimal Viable Perspective Layer

Start with four perspectives:

```text
domain
runtime
data_ownership
security
```

Support:

```text
1. perspective-specific membership
2. perspective-aware query parameter
3. perspective conflict display
4. governance rule for authoritative perspective by commitment kind
```

This is enough to prevent false collapse of valid disagreements.

---

# 9. Final Definition

Architectural Pluralism and Perspective Models is:

> A framework for representing multiple valid architecture views over the same system, mapping between them, detecting tensions, and choosing the authoritative perspective only when a decision requires it.

It closes the gap between:

```text
architecture as one discoverable reality
```

and:

```text
architecture as partly constituted by valid, task-specific perspectives.
```

