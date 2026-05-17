# Response 25 - Team Attention Economics

The inference scheduler manages compute. The action model manages behavior. The trust UX manages presentation. But the system still needs to model the scarcest resource in engineering organizations:

```text
team attention
```

A team can only absorb a limited number of findings, questions, review requests, and planning items before fatigue causes them to ignore everything.

---

# 1. Core Claim

Architecture intelligence must curate, not enumerate.

The system should know:

```text
how many findings a team can process
which findings are worth interrupting for
when to batch
when to suppress
when to summarize
when to escalate
when to wait
```

This is the difference between useful intelligence and another noisy tool.

---

# 2. Attention Objects

| Object | Meaning |
|---|---|
| `attention_budget` | Capacity for findings/questions/actions per team/time |
| `attention_event` | A notification, PR comment, question, review request, or dashboard item |
| `attention_cost` | Estimated cognitive cost of processing an item |
| `attention_value` | Expected value or risk reduction from showing it |
| `fatigue_signal` | Evidence that users are ignoring or overwhelmed |
| `curation_policy` | Rules for batching, ranking, suppressing, or escalating |

---

# 3. Suggested Schema

```sql
CREATE TABLE team_attention_budget (
  attention_budget_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  team_id            uuid NOT NULL,

  budget_period      text NOT NULL,
  -- day, week, sprint, quarter

  max_findings       integer,
  max_questions      integer,
  max_blocking_items integer,
  max_notifications  integer,

  policy_json        jsonb NOT NULL DEFAULT '{}',
  valid_from         timestamptz NOT NULL,
  valid_to           timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE attention_item (
  attention_item_id  uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  team_id            uuid,

  item_kind          text NOT NULL,
  -- pr_comment, ci_failure, dashboard_finding,
  -- clarification_question, governance_request,
  -- debt_planning_item, rollout_notice

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  attention_cost     numeric NOT NULL DEFAULT 0.5,
  expected_value     numeric NOT NULL DEFAULT 0.5,
  urgency_score      numeric NOT NULL DEFAULT 0.5,
  risk_score         numeric NOT NULL DEFAULT 0.5,

  delivery_state     text NOT NULL DEFAULT 'pending',
  -- pending, delivered, batched, suppressed,
  -- deferred, escalated, expired

  delivery_channel   text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  delivered_at       timestamptz
);
```

```sql
CREATE TABLE attention_fatigue_signal (
  fatigue_signal_id  uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  team_id            uuid,

  signal_kind        text NOT NULL,
  -- ignored_findings, repeated_dismissals,
  -- slow_acknowledgement, muted_channel,
  -- comment_noise_complaint, false_positive_burst

  signal_strength    numeric NOT NULL DEFAULT 0.5,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE attention_curation_policy (
  curation_policy_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  policy_key         text NOT NULL,
  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  ranking_policy_json jsonb NOT NULL DEFAULT '{}',
  batching_policy_json jsonb NOT NULL DEFAULT '{}',
  suppression_policy_json jsonb NOT NULL DEFAULT '{}',
  escalation_policy_json jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, policy_key)
);
```

---

# 4. Finding Budget

Each team should have a finding budget.

Example:

```text
Billing team, per sprint:
  max blocking findings: 3
  max advisory findings: 12
  max clarification questions: 5
```

If the system has 50 findings, it should not dump all 50.

It should:

```text
show critical blockers
batch related findings
defer low-value findings
convert repeated patterns into one remediation item
route planning-level debt separately from PR-level review
```

---

# 5. Value Per Attention Unit

Rank by:

```text
expected risk reduction
blocking relevance
confidence
novelty
actionability
deadline
user task relevance
fatigue state
```

Avoid showing:

```text
low-confidence noise
duplicate findings
known accepted debt
non-actionable observations
historical backlog during urgent PR review
```

---

# 6. Batching

Some findings should be grouped.

Example:

```text
Instead of 17 PR comments:

Finding:
  17 new calls use deprecated API.

Grouped by:
  12 in Billing.Legacy.Export
  5 in Reporting.InvoiceSync

Action:
  replace with Billing.PublicInvoices API.
```

Batching reduces cognitive load while preserving evidence drilldown.

---

# 7. Fatigue-Aware Enforcement

If fatigue signals rise:

```text
downgrade low-severity comments to summary
increase threshold for advisory findings
batch more aggressively
pause non-critical rollout expansion
ask fewer clarification questions
route debt to planning instead of PR
```

Do not lower enforcement for critical safety issues, but reduce nonessential noise.

---

# 8. Attention Metrics

Track:

```text
findings delivered per team
findings acknowledged
findings acted on
dismissal rate
false positive rate
time to resolution
comments per PR
blocking items per sprint
muted notification rate
user-reported noise
```

These should feed curation policy and rollout decisions.

---

# 9. Minimal Viable Attention Economics

For the PR reviewer:

```text
1. max inline comments per PR
2. group related findings
3. block only highest-confidence high-severity findings
4. move backlog to dashboard
5. track dismissed/ignored findings
6. pause rollout if false-positive or fatigue signals spike
```

This prevents early adoption failure from notification overload.

---

# 10. Final Definition

Team Attention Economics is:

> A model for budgeting, ranking, batching, suppressing, escalating, and measuring architecture findings according to the limited attention capacity of teams.

It closes the gap between:

```text
the system knows many important things
```

and:

```text
teams can actually absorb and act on the right few things.
```

