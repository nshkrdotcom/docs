# Response 18 - Gradual Enforcement Rollout

The Commitment DSL and Action Model define observe, warn, fail, and enforce modes. The missing piece is how a new rule becomes enforceable across a real organization without causing disruption.

Architecture rules are not usually switched on globally. They roll out:

```text
first observe
then warn
then fail new code
then fail modified code
then require cleanup of existing violations
then enforce everywhere
```

The system needs a rollout model.

---

# 1. Core Claim

Every commitment should have an adoption lifecycle separate from its logical lifecycle.

Logical lifecycle:

```text
draft -> proposed -> accepted -> enforced -> deprecated
```

Rollout lifecycle:

```text
observe -> baseline -> advisory -> fail new -> fail touched -> cohort enforce -> full enforce
```

A commitment can be accepted but only partially enforced.

---

# 2. Rollout Dimensions

Rollout can expand along multiple axes:

```text
time
teams
repos
bounded contexts
new code only
modified code only
critical paths first
severity classes
confidence thresholds
runtime environments
artifact cohorts
```

Example:

```text
Month 1:
  warn only, all repos.

Month 2:
  fail new violations in Billing and Accounts.

Month 3:
  fail modified violations in all domain apps.

Month 4:
  enforce all non-exceptioned violations.
```

---

# 3. Suggested Schema

```sql
CREATE TABLE enforcement_rollout (
  rollout_id         uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  commitment_id      uuid,
  commitment_pack_id uuid,

  rollout_key        text NOT NULL,
  display_name       text NOT NULL,
  state              text NOT NULL DEFAULT 'planned',
  -- planned, active, paused, completed, rolled_back, superseded

  owner_body_id      uuid,
  started_at         timestamptz,
  completed_at       timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, rollout_key)
);
```

```sql
CREATE TABLE rollout_stage (
  rollout_stage_id   uuid PRIMARY KEY,
  rollout_id         uuid NOT NULL REFERENCES enforcement_rollout(rollout_id),
  stage_index        integer NOT NULL,
  stage_key          text NOT NULL,

  enforcement_mode   text NOT NULL,
  -- observe_only, advisory, warn_ci,
  -- fail_new_violations, fail_touched_violations,
  -- enforce_cohort, enforce_all

  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  entry_criteria_json jsonb NOT NULL DEFAULT '{}',
  exit_criteria_json  jsonb NOT NULL DEFAULT '{}',
  rollback_criteria_json jsonb NOT NULL DEFAULT '{}',

  starts_at          timestamptz,
  ends_at            timestamptz,
  state              text NOT NULL DEFAULT 'pending',
  -- pending, active, passed, failed, rolled_back, skipped

  metrics_json       jsonb NOT NULL DEFAULT '{}',
  UNIQUE (rollout_id, stage_index)
);
```

```sql
CREATE TABLE rollout_cohort (
  rollout_cohort_id  uuid PRIMARY KEY,
  rollout_id         uuid NOT NULL REFERENCES enforcement_rollout(rollout_id),
  cohort_key         text NOT NULL,
  cohort_kind        text NOT NULL,
  -- team, repo, bounded_context, service,
  -- risk_class, new_module, touched_code
  selector_json      jsonb NOT NULL,
  current_stage_id   uuid REFERENCES rollout_stage(rollout_stage_id),
  metrics_json       jsonb NOT NULL DEFAULT '{}',
  UNIQUE (rollout_id, cohort_key)
);
```

```sql
CREATE TABLE rollout_decision (
  rollout_decision_id uuid PRIMARY KEY,
  rollout_id         uuid NOT NULL REFERENCES enforcement_rollout(rollout_id),
  rollout_stage_id   uuid REFERENCES rollout_stage(rollout_stage_id),
  decision_kind      text NOT NULL,
  -- promote, pause, rollback, extend_stage,
  -- narrow_scope, widen_scope, lower_threshold
  rationale_text     text,
  decided_by_actor_id uuid,
  metrics_snapshot_json jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Entry and Exit Criteria

Stages should advance automatically only when quality gates pass.

Example criteria:

```text
false_positive_rate < 5%
false_block_rate = 0
benchmark suite passing
detector reliability healthy
existing violations classified
owners assigned
exceptions reviewed
PR comment acceptance > threshold
```

Rollback criteria:

```text
false_positive spike
high-priority PR incorrectly blocked
owner dispute unresolved
benchmark regression
new scope ambiguity
```

This makes rollout empirical rather than calendar-only.

---

# 5. New, Touched, and Existing Violations

Rollout needs precise violation age semantics.

Classifications:

```text
new_violation
  introduced by current PR

touched_violation
  existing violation in modified artifact

existing_violation
  pre-existing and untouched

worsened_violation
  existing violation with increased blast radius

expired_exception
  previously allowed, now outside exception window
```

Action policies can differ:

```text
fail new
warn touched
track existing
fail expired exception
```

---

# 6. Automatic Promotion

Rollout stages can promote when metrics are healthy.

Example:

```text
Stage:
  advisory for Billing context.

Promotion criteria:
  30 days active
  0 confirmed false positives
  95% findings acknowledged
  benchmark suite passing
  owners assigned for all exceptions

Next:
  fail new violations in Billing.
```

Promotion should produce a governance event, not silently change enforcement.

---

# 7. Rollout Trust UX

PR comments and dashboards should show rollout state.

Example:

```text
Finding:
  Web controller calls Repo directly.

Commitment:
  web_no_repo

Rollout state:
  Stage 2: fail new violations, warn existing.

Why this fails:
  This is a new violation introduced by this PR.

Existing backlog:
  14 historical violations are tracked but not blocking yet.
```

This prevents the "why did this suddenly fail?" problem.

---

# 8. Minimal Viable Rollout

For the first product:

```text
1. baseline existing violations
2. classify new vs existing vs touched
3. support observe -> warn -> fail_new
4. track false-positive rate
5. require manual promotion to next stage
6. show rollout state in CI output
```

That is enough for adoption without overbuilding.

---

# 9. Final Definition

Gradual Enforcement Rollout is:

> A staged, metric-gated adoption model for architecture commitments that controls how enforcement expands across time, teams, repos, code cohorts, and violation classes.

It closes the gap between:

```text
this rule exists
```

and:

```text
this rule can be safely enforced at organizational scale.
```

