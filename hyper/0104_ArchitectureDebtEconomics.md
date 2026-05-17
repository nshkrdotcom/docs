# Response 20 - Architecture Debt Economics

The design can detect drift, violations, missing tests, unknown ownership, stale ADRs, and runtime/design mismatch. But teams still need to decide:

```text
Which problems should we fix now?
Which should we accept temporarily?
Which cleanup investments have the best return?
How bad is this debt if left alone?
How should we sequence improvement work with finite capacity?
```

The missing layer is architecture debt economics.

---

# 1. Core Claim

Architecture intelligence should support investment decisions, not only findings.

The system should estimate:

```text
cost of carrying debt
cost of remediation
risk-adjusted value of fixing
time sensitivity
capacity constraints
sequencing dependencies
portfolio tradeoffs
```

This turns architectural health into actionable planning.

---

# 2. Debt Objects

| Object | Meaning |
|---|---|
| `architecture_debt_item` | A drift, violation, missing verification, stale commitment, or known unknown that carries future cost |
| `debt_cost_model` | How cost is estimated |
| `remediation_option` | Possible fix strategy |
| `remediation_plan` | Sequenced set of options |
| `capacity_budget` | Available engineering capacity by team/time |
| `debt_portfolio_snapshot` | Aggregate view of debt and risk |
| `accepted_debt_decision` | Explicit decision to carry debt for now |

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_debt_item (
  debt_item_id       uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  debt_kind          text NOT NULL,
  -- boundary_violation, stale_adr, missing_test,
  -- runtime_drift, expired_exception, unknown_owner,
  -- provider_migration, high_coupling, orphaned_intent

  title              text NOT NULL,
  subject_kind       text,
  subject_id         uuid,

  source_finding_kind text,
  source_finding_id  uuid,

  principal_score    numeric NOT NULL DEFAULT 0.5,
  -- estimated size/difficulty of cleanup

  interest_score     numeric NOT NULL DEFAULT 0.5,
  -- cost of leaving it unresolved

  risk_score         numeric NOT NULL DEFAULT 0.5,
  urgency_score      numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 0.5,

  state              text NOT NULL DEFAULT 'open',
  -- open, accepted, planned, in_progress,
  -- remediated, obsolete, superseded

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE debt_cost_model (
  debt_cost_model_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  model_key          text NOT NULL,
  debt_kind          text NOT NULL,
  formula_json       jsonb NOT NULL,
  calibration_json   jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, model_key)
);
```

```sql
CREATE TABLE remediation_option (
  remediation_option_id uuid PRIMARY KEY,
  debt_item_id       uuid NOT NULL REFERENCES architecture_debt_item(debt_item_id),

  option_kind        text NOT NULL,
  -- fix_now, add_test, add_exception,
  -- migrate_to_public_api, update_adr,
  -- replace_provider, assign_owner,
  -- defer_with_review, remove_dead_code

  title              text NOT NULL,
  description        text,
  estimated_effort   numeric,
  risk_reduction     numeric,
  debt_reduction     numeric,
  prerequisites_json jsonb NOT NULL DEFAULT '[]',
  side_effects_json  jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  rank               integer,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE remediation_plan (
  remediation_plan_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  plan_key           text,
  title              text NOT NULL,
  planning_horizon   text,
  -- sprint, quarter, migration, incident_followup
  capacity_budget_json jsonb NOT NULL DEFAULT '{}',
  objective_json     jsonb NOT NULL DEFAULT '{}',
  state              text NOT NULL DEFAULT 'proposed',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE remediation_plan_item (
  remediation_plan_item_id uuid PRIMARY KEY,
  remediation_plan_id uuid NOT NULL REFERENCES remediation_plan(remediation_plan_id),
  remediation_option_id uuid NOT NULL REFERENCES remediation_option(remediation_option_id),
  sequence_index     integer NOT NULL,
  assigned_owner_id  uuid,
  expected_start     timestamptz,
  expected_finish    timestamptz,
  state              text NOT NULL DEFAULT 'planned',
  UNIQUE (remediation_plan_id, remediation_option_id)
);
```

```sql
CREATE TABLE accepted_debt_decision (
  accepted_debt_decision_id uuid PRIMARY KEY,
  debt_item_id       uuid NOT NULL REFERENCES architecture_debt_item(debt_item_id),
  accepted_by_actor_id uuid,
  accepted_by_body_id uuid,
  rationale_text     text NOT NULL,
  review_at          timestamptz,
  constraints_json   jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Debt Cost Dimensions

Debt cost should include:

```text
change friction
defect risk
security risk
runtime cost
onboarding cost
review cost
incident likelihood
blast radius
migration deadline pressure
owner ambiguity
test gap cost
provider sunset risk
```

Not every debt item needs all dimensions.

Example:

```text
Boundary violation:
  high change friction
  medium defect risk
  high migration cost if target schema changes

Missing test:
  medium defect risk
  high change uncertainty

Unknown owner:
  high review delay
  high incident response risk
```

---

# 5. Remediation Value

For each option:

```text
value =
  risk_reduction
  + interest_reduction
  + future_work_unblocked
  + enforcement_readiness
  - implementation_effort
  - migration_risk
```

The system should show tradeoffs rather than pretend precision.

Example:

```text
Option A: Add scoped exception
  low effort
  low risk reduction
  buys time
  requires follow-up

Option B: Migrate to public Accounts API
  medium effort
  high risk reduction
  removes boundary violation
  requires Reporting test updates

Option C: Create event projection
  high effort
  highest long-term value
  unlocks future reporting features
```

---

# 6. Portfolio Views

Teams need portfolio-level questions:

```text
What are our top 10 architecture debts by risk-adjusted cost?
Which debts block enforcement rollout?
Which debts are cheap and high-value?
Which debts are growing fastest?
Which team carries the most unowned debt?
What can we fix this sprint with 10 engineer-days?
What must be fixed before provider sunset?
```

Debt should roll up by:

```text
bounded context
team
runtime service
commitment family
risk class
provider
release
```

---

# 7. Time and Interest

Debt should accrue interest.

Signals:

```text
more consumers added
more code depends on violation
runtime path gets hotter
owner leaves
exception approaches expiry
provider sunset approaches
tests become more stale
schema changes increase migration risk
```

Debt whose interest increases should rise in priority.

---

# 8. Integration with Practice Layer

Architecture debt should create open loops and work episodes.

Example:

```text
Debt item:
  Reporting reads Billing tables directly.

Plan:
  Build Billing.InvoiceExported event projection.

Open loops:
  create event contract
  add Reporting consumer
  migrate report
  remove exception
  enforce boundary
```

This connects economic prioritization to real engineering workflow.

---

# 9. Minimal Viable Debt Economics

Start with:

```text
1. create debt item from violations, drift, missing tests, expired exceptions
2. estimate effort and risk manually or heuristically
3. rank by risk * interest / effort
4. show top debt by owner/team/context
5. support accepted debt decision with review date
6. generate remediation options for PR reviewer findings
```

This gives immediate planning value without pretending to be financially exact.

---

# 10. Final Definition

Architecture Debt Economics is:

> A portfolio model for estimating, comparing, accepting, sequencing, and remediating architecture problems under finite engineering capacity and changing risk over time.

It closes the gap between:

```text
the system finds architecture problems
```

and:

```text
teams can decide which problems are worth fixing now.
```

