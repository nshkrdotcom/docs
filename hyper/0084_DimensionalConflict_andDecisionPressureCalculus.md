# Response 11 - Dimensional Conflict and Decision Pressure Calculus

The system can assign artifacts coordinates across many dimensions: risk, ownership, certainty, runtime hotness, business value, test coverage, coupling, security, and more. The missing piece is what happens when dimensions conflict.

Example:

```text
High risk says change cautiously.
Runtime hotness says change urgently.
Low test coverage says do not touch.
Business deadline says ship now.
Security commitment says block.
```

Coordinates alone do not resolve this. The system needs a pressure and tradeoff calculus.

---

# 1. Core Claim

The operating kernel should model **decision pressure**:

```text
the set of competing forces that make an engineering decision urgent, risky, blocked, or ambiguous
```

This allows the system to explain not only:

```text
what is true
```

but:

```text
why the next action is hard
which dimensions are in conflict
who must decide
which tradeoffs are acceptable
```

---

# 2. Pressure Types

| Pressure | Meaning |
|---|---|
| `safety_pressure` | Security, correctness, compliance, data loss risk |
| `urgency_pressure` | Runtime incidents, hot path failures, deadlines |
| `stability_pressure` | Avoid churn in stable APIs or critical paths |
| `migration_pressure` | Temporary state must move toward target architecture |
| `verification_pressure` | Tests/evidence insufficient for action |
| `ownership_pressure` | No clear owner or conflicting owners |
| `business_pressure` | Product deadline, customer contract, regulatory date |
| `operational_pressure` | SRE load, incident risk, deployment complexity |
| `learning_pressure` | Human answer needed before enforcement is safe |

---

# 3. Suggested Schema

```sql
CREATE TABLE decision_pressure (
  decision_pressure_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  pressure_kind      text NOT NULL,
  magnitude          numeric NOT NULL,
  -- 0.0 to 1.0
  direction          text NOT NULL,
  -- push_change, resist_change, require_review,
  -- require_verification, require_exception

  source_kind        text NOT NULL,
  source_id          uuid,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE pressure_resolution_policy (
  pressure_policy_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  policy_key         text NOT NULL,
  scope_selector_json jsonb NOT NULL DEFAULT '{}',

  priority_json      jsonb NOT NULL,
  -- security_over_deadline, prod_incident_over_refactor,
  -- owner_required_for_exception, etc.

  escalation_json    jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, policy_key)
);
```

```sql
CREATE TABLE tradeoff_evaluation (
  tradeoff_evaluation_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  option_key         text NOT NULL,
  option_text        text,
  pressure_effects_json jsonb NOT NULL,
  -- pressure_kind -> increases/decreases/neutral
  residual_risk_json jsonb NOT NULL DEFAULT '{}',
  recommended_rank   integer,
  rationale_text     text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Pressure Vector

For any action candidate, compute a pressure vector:

```json
{
  "safety_pressure": 0.92,
  "urgency_pressure": 0.71,
  "verification_pressure": 0.64,
  "business_pressure": 0.80,
  "ownership_pressure": 0.30
}
```

Do not collapse this too early into one score. The vector is the explanation.

Then apply a resolution policy:

```text
critical security pressure blocks unless security approves
incident urgency may bypass normal ADR timing but not audit logging
unknown ownership downgrades enforcement to review-required
low verification raises must_revalidate before execute
```

---

# 5. Example

PR changes password reset expiry from 15 minutes to 60 minutes.

Pressure vector:

```text
safety_pressure: high
  weakens security commitment

business_pressure: medium
  support wants fewer expired links

verification_pressure: high
  tests still assert old behavior

urgency_pressure: low
  no incident data

ownership_pressure: low
  Accounts and Security owners known
```

Resolution:

```text
do not silently accept code change
require ADR amendment and security approval
fail CI unless architecture update or exception is included
```

---

# 6. Conflict Patterns

Common conflicts:

```text
hot_path_vs_high_risk
deadline_vs_security
stability_vs_migration
local_fix_vs_platform_policy
runtime_reality_vs_intended_architecture
owner_preference_vs_governance_rule
test_gap_vs_required_refactor
legacy_exception_vs_expiry
```

Each pattern can have a default action policy.

Example:

```text
hot_path_vs_high_risk
  -> require test evidence and staged rollout

deadline_vs_security
  -> require explicit business override and security review

runtime_reality_vs_intended_architecture
  -> classify as drift, do not normalize automatically
```

---

# 7. Relationship to Alternative Search

Alternative search should score options by pressure reduction.

Example options:

```text
Option A: restore max_age 900
  reduces safety pressure
  preserves architecture
  may increase support friction

Option B: accept max_age 3600 with ADR update
  reduces business pressure
  increases safety residual risk
  requires security approval

Option C: keep 900 but improve resend flow
  reduces support friction
  preserves security
  requires more implementation work
```

This produces better recommendations than a single "risk score."

---

# 8. Trust UX

The UI should show:

```text
This is blocked because security pressure outranks business pressure
under the active policy.
```

or:

```text
This is review-required because urgency is high, but verification evidence is weak.
```

Pressure explanations help users see that the system is not arbitrary.

---

# 9. Minimal Viable Pressure Calculus

Start with five pressures:

```text
safety
urgency
verification
ownership
business
```

And four resolution outcomes:

```text
safe_to_warn
requires_review
requires_approval
blocks_until_resolved
```

This is enough to improve PR action decisions and reduce over-enforcement.

---

# 10. Final Definition

The Decision Pressure Calculus is:

> A model for representing, explaining, and resolving competing architectural, operational, verification, ownership, and business pressures that act on an artifact, change, commitment, or action.

It closes the gap between:

```text
many independent dimensions
```

and:

```text
an explainable decision under competing constraints.
```

