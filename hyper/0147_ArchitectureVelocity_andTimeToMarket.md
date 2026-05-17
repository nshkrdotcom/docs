# Response 34 - Architecture Velocity and Time-to-Market

Architecture debt economics helps decide which problems are worth fixing. But there is a prior operational question:

```text
What is the current architecture doing to the team's ability to ship?
```

This is not only about old debt. It is about live development velocity.

---

# 1. Core Claim

The system should model architecture as a force on time-to-market.

Architecture affects shipping speed through:

```text
coupling
review coordination
unclear ownership
uncertain impact radius
slow test feedback
manual approval paths
missing runtime confidence
duplicated patterns
fragile boundaries
knowledge concentration
```

The product should estimate and monitor these costs, not only identify violations.

---

# 2. Velocity Objects

| Object | Meaning |
|---|---|
| `architecture_velocity_signal` | Evidence that architecture is affecting delivery speed |
| `change_friction_profile` | Expected effort to make a class of change |
| `coordination_cost` | People, teams, and approvals needed for a change |
| `impact_uncertainty_cost` | Delay caused by not knowing what a change affects |
| `feedback_latency` | Time to get tests, reviews, runtime, or governance feedback |
| `velocity_intervention` | Architecture change intended to improve shipping speed |
| `time_to_market_forecast` | Estimated delivery effect of architecture choices |

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_velocity_signal (
  architecture_velocity_signal_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  signal_kind        text NOT NULL,
  -- long_pr_cycle, high_reviewer_count,
  -- repeated_conflict, slow_test_feedback,
  -- unclear_owner_delay, large_impact_radius,
  -- frequent_rework, blocked_on_architecture,
  -- incident_regression_delay

  observed_value     numeric,
  baseline_value     numeric,
  severity           text NOT NULL DEFAULT 'unknown',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  observed_at        timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE change_friction_profile (
  change_friction_profile_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  change_kind        text NOT NULL,
  -- add_feature, change_policy, migrate_provider,
  -- alter_schema, change_public_api,
  -- refactor_boundary, fix_incident_class,
  -- add_integration

  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  expected_steps_json jsonb NOT NULL DEFAULT '[]',
  expected_reviewers_json jsonb NOT NULL DEFAULT '[]',
  expected_feedback_latency_hours numeric,
  impact_uncertainty numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 0.5,
  updated_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE coordination_cost (
  coordination_cost_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  work_episode_id    uuid,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  required_actor_count integer,
  required_team_count integer,
  required_approval_count integer,
  blocked_duration_hours numeric,
  cause_kind         text NOT NULL,
  -- ownership_unclear, boundary_crossing,
  -- governance_required, expertise_missing,
  -- dependency_team, compliance_review,
  -- release_coordination

  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE velocity_intervention (
  velocity_intervention_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  intervention_kind  text NOT NULL,
  -- create_boundary, reduce_coupling,
  -- add_test_contract, clarify_owner,
  -- automate_review, split_service,
  -- formalize_commitment, remove_ceremony,
  -- improve_observability

  target_subject_kind text NOT NULL,
  target_subject_id uuid NOT NULL,
  expected_velocity_gain numeric,
  expected_risk_change numeric,
  expected_cost       numeric,
  state              text NOT NULL DEFAULT 'proposed',
  -- proposed, planned, active, completed,
  -- rejected, superseded

  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Velocity Metrics

Useful signals:

```text
PR cycle time by architecture area
reviewer count by change kind
files touched per feature
number of teams involved
time from question to confident impact answer
test feedback latency
rollback frequency
rework caused by missed dependency
architecture exception wait time
owner clarification wait time
```

These are not productivity surveillance metrics. They are architecture feedback signals.

The system should report them at the system, team, or architecture area level, not as a personal scorecard.

---

# 5. Example

```text
Observation:
  Changes to invoice finalization average 4.8 reviewers,
  touch 13 files, and wait 2.6 days for owner clarification.

Architecture cause:
  Billing finalization crosses payment, tax, account status,
  notification, and audit concerns with no explicit ownership split.

Velocity cost:
  high coordination cost and high impact uncertainty.

Intervention:
  create explicit finalization boundary,
  add event contract tests,
  assign review owners by concern.

Expected outcome:
  fewer required reviewers for routine changes,
  faster impact assessment,
  lower rework from missed downstream behavior.
```

---

# 6. Time-to-Market Forecasts

The system should support planning questions:

```text
If we keep the current boundary, what will the next three checkout features cost?
If we formalize this API contract, will review time drop enough to justify it?
Which architecture change would most reduce launch risk?
Where is unclear ownership slowing delivery?
Which missing tests are causing the most review delay?
```

Forecasts must disclose uncertainty and should be calibrated against actual delivery history.

---

# 7. Interaction with Debt Economics

Debt economics asks:

```text
Which architecture problems should we fix?
```

Velocity modeling asks:

```text
Which architecture choices are slowing current and upcoming work?
```

Debt may be accepted if it does not affect current plans. A non-debt architecture may still be too slow for a new product direction.

---

# 8. Minimal Viable Layer

Start with:

```text
PR cycle time by architecture area
reviewer count by touched boundary
impact radius estimate
owner clarification delay
change friction profile
velocity intervention proposal
```

This is enough to make architecture speed visible without pretending to perfectly model engineering productivity.

---

# 9. Final Definition

Architecture velocity is the measurable effect of system structure, ownership, knowledge, tests, and governance on how quickly teams can ship correct changes.

It connects architecture decisions to time-to-market without reducing engineering work to raw throughput.

