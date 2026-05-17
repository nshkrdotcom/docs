# Response 24 - Tool Ecosystem Workflow Integration

The system has a strong internal model, but engineering work happens across many tools:

```text
GitHub
GitLab
Jira
Linear
Slack
Teams
Notion
Confluence
Google Docs
Figma
PagerDuty
Datadog
Sentry
CI systems
calendars
```

The missing layer is a model for how architecture intelligence moves through that tool ecosystem without becoming siloed.

---

# 1. Core Claim

Architecture intelligence should be tool-native at the workflow boundary.

The system should know:

```text
where a decision should be surfaced
where a task should be created
where a governance review happens
where a notification should go
where an artifact was copied
which external tool record is authoritative
how external state maps back into internal architecture memory
```

---

# 2. Integration Objects

| Object | Meaning |
|---|---|
| `external_tool` | Jira, GitHub, Slack, Notion, etc. |
| `external_record` | Issue, PR, Slack thread, wiki page, incident, design file |
| `sync_binding` | Link between internal artifact and external record |
| `workflow_route` | Rule for where to send a finding/action |
| `sync_event` | External or internal change propagated across boundary |
| `tool_authority_policy` | Which tool is authoritative for which artifact type |
| `notification_budget` | Limits on team-facing notifications |

---

# 3. Suggested Schema

```sql
CREATE TABLE external_tool (
  external_tool_id   uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  tool_key           text NOT NULL,
  tool_kind          text NOT NULL,
  -- github, gitlab, jira, linear, slack,
  -- notion, confluence, figma, pagerduty,
  -- datadog, ci_system, calendar
  display_name       text NOT NULL,
  config_json        jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, tool_key)
);
```

```sql
CREATE TABLE external_record (
  external_record_id uuid PRIMARY KEY,
  external_tool_id   uuid NOT NULL REFERENCES external_tool(external_tool_id),

  record_kind        text NOT NULL,
  -- issue, pr, comment, thread, page, doc,
  -- incident, dashboard, design_comment, ci_check

  external_key       text NOT NULL,
  external_url       text,
  title              text,
  state              text,
  last_seen_hash     text,
  last_synced_at     timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (external_tool_id, record_kind, external_key)
);
```

```sql
CREATE TABLE sync_binding (
  sync_binding_id    uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  internal_subject_kind text NOT NULL,
  internal_subject_id uuid NOT NULL,

  external_record_id uuid NOT NULL REFERENCES external_record(external_record_id),

  binding_kind       text NOT NULL,
  -- source_of_truth, mirror, notification_target,
  -- task_tracking, governance_review,
  -- discussion_thread, evidence_source

  authority_direction text NOT NULL,
  -- internal_to_external, external_to_internal,
  -- bidirectional, external_authoritative,
  -- internal_authoritative

  state              text NOT NULL DEFAULT 'active',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (internal_subject_kind, internal_subject_id, external_record_id, binding_kind)
);
```

```sql
CREATE TABLE workflow_route (
  workflow_route_id  uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  route_key          text NOT NULL,

  trigger_selector_json jsonb NOT NULL,
  destination_json   jsonb NOT NULL,
  -- tool, channel/project, assignee/group, template

  routing_policy_json jsonb NOT NULL DEFAULT '{}',
  notification_budget_json jsonb NOT NULL DEFAULT '{}',
  state              text NOT NULL DEFAULT 'active',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, route_key)
);
```

```sql
CREATE TABLE sync_event (
  sync_event_id      uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  sync_binding_id    uuid REFERENCES sync_binding(sync_binding_id),
  event_direction    text NOT NULL,
  -- internal_to_external, external_to_internal
  event_kind         text NOT NULL,
  source_hash        text,
  result_hash        text,
  status             text NOT NULL,
  diagnostics_json   jsonb NOT NULL DEFAULT '[]',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Authority Policies

Different tools are authoritative for different things.

Examples:

```text
GitHub PR is authoritative for review comments and CI state.
Jira is authoritative for quarterly planning tasks.
Notion may be authoritative for a design doc.
Internal system is authoritative for belief state.
Governance verdict may be mirrored to Jira but decided internally.
Slack thread may be evidence but not authoritative.
```

The system should avoid two-way sync confusion by recording authority direction.

---

# 5. Workflow Examples

## PR finding to GitHub

```text
New violation detected.
  -> create GitHub PR review comment
  -> create CI check
  -> bind comment to finding and action contract
  -> update state when comment resolved
```

## Known unknown to Linear

```text
High-value ownership question found.
  -> create Linear issue for owning team
  -> sync answer back as elicited_answer
  -> close known unknown if resolved
```

## Debt item to quarterly planning

```text
Architecture debt item ranked high.
  -> attach to planning board
  -> sync priority and owner
  -> remediation plan updates internal open loops
```

## Governance review to Slack

```text
Exception requires architecture board.
  -> notify channel with compact evidence
  -> link to review packet
  -> record verdict internally
```

---

# 6. Notification Discipline

Tool integration must respect attention budgets.

Routing policy should consider:

```text
severity
team finding budget
existing notifications
PR size
deadline
owner availability
recent false positive rate
user preferences
```

Do not send every finding to Slack. Route only what needs human attention.

---

# 7. Integration Trust UX

Every external record should show its sync status:

```text
mirrored from architecture system
external source of truth
stale mirror
sync failed
manually edited externally
conflict needs resolution
```

This prevents teams from trusting stale copied outputs.

---

# 8. Minimal Viable Integration Layer

For the PR reviewer:

```text
1. GitHub PR comment binding
2. GitHub CI check binding
3. Jira/Linear task creation for open loops
4. Slack notification for high-severity governance blockers
5. sync state back into action contracts
```

That is enough to keep architecture intelligence inside the engineering workflow.

---

# 9. Final Definition

Tool Ecosystem Workflow Integration is:

> A synchronization, routing, and authority model that connects internal architecture intelligence to the external tools where engineering decisions, reviews, planning, and communication actually happen.

It closes the gap between:

```text
high-quality internal intelligence
```

and:

```text
work coordinated in the team's real toolchain.
```

