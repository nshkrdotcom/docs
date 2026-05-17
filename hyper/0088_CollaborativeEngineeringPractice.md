# Response 15 - Collaborative Engineering Practice

The prior gap-fill files add important missing mechanisms: governance, known unknowns, organizational time, composable policies, pressure calculus, diagonal materialization, external evolution, and inference scheduling.

The larger missing concept from `0070_feedback_claude.md` is this:

```text
The design models software as a product to be understood,
but only lightly models software development as a practice to be supported.
```

This file defines that practice layer.

---

# 1. Core Claim

The system should model engineering work as a sequence of collaborative episodes, not only as artifacts and graph edges.

Real architecture evolves through:

```text
requirements discovery
informal debate
proposal drafting
design review
implementation
PR review
exception negotiation
incident learning
handoff
deprecation
migration
retrospective
```

The operating kernel should support those workflows directly.

---

# 2. Practice Objects

| Object | Meaning |
|---|---|
| `work_episode` | A bounded unit of engineering activity |
| `practice_stage` | Discovery, design, review, implementation, verification, operation |
| `collaboration_event` | Comment, meeting, review, decision, objection, correction |
| `decision_journal` | Timeline of how a decision was formed |
| `architecture_ceremony` | Review, exception meeting, migration checkpoint, incident retro |
| `open_loop` | Unclosed commitment, question, exception, or follow-up |
| `practice_pattern` | Reusable workflow, such as "propose commitment then enforce new violations" |

---

# 3. Suggested Schema

```sql
CREATE TABLE work_episode (
  work_episode_id    uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  episode_key        text,
  title              text NOT NULL,
  episode_kind       text NOT NULL,
  -- feature, migration, incident, refactor, deprecation,
  -- provider_upgrade, architecture_review, onboarding

  state              text NOT NULL DEFAULT 'open',
  -- open, designing, implementing, reviewing, verifying,
  -- deployed, closed, paused, superseded

  root_artifact_kind text,
  root_artifact_id   uuid,
  owner_actor_id     uuid,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  closed_at          timestamptz
);
```

```sql
CREATE TABLE practice_stage (
  practice_stage_id  uuid PRIMARY KEY,
  work_episode_id    uuid NOT NULL REFERENCES work_episode(work_episode_id),
  stage_kind         text NOT NULL,
  -- capture, normalize, decide, architect,
  -- implement, verify, operate, learn
  state              text NOT NULL DEFAULT 'pending',
  started_at         timestamptz,
  completed_at       timestamptz,
  required_outputs_json jsonb NOT NULL DEFAULT '[]',
  actual_outputs_json jsonb NOT NULL DEFAULT '[]'
);
```

```sql
CREATE TABLE collaboration_event (
  collaboration_event_id uuid PRIMARY KEY,
  work_episode_id    uuid REFERENCES work_episode(work_episode_id),
  actor_id           uuid,
  event_kind         text NOT NULL,
  -- comment, review, objection, approval, correction,
  -- clarification, meeting_note, decision, override, followup
  subject_kind       text,
  subject_id         uuid,
  body_text          text,
  body_json          jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE open_loop (
  open_loop_id       uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  work_episode_id    uuid REFERENCES work_episode(work_episode_id),
  loop_kind          text NOT NULL,
  -- unanswered_question, unverified_commitment,
  -- approved_exception_followup, migration_todo,
  -- stale_adr_update, owner_assignment_needed
  title              text NOT NULL,
  subject_kind       text,
  subject_id         uuid,
  owner_actor_id     uuid,
  due_at             timestamptz,
  state              text NOT NULL DEFAULT 'open',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  closed_at          timestamptz
);
```

```sql
CREATE TABLE practice_pattern (
  practice_pattern_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  pattern_key        text NOT NULL,
  display_name       text NOT NULL,
  pattern_kind       text NOT NULL,
  -- pr_architecture_review, commitment_promotion,
  -- exception_lifecycle, provider_migration,
  -- incident_to_commitment, onboarding_rationale_capture
  stage_template_json jsonb NOT NULL DEFAULT '[]',
  action_policy_json jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, pattern_key)
);
```

---

# 4. Process Views

The UI should have process projections, not only architecture projections.

Examples:

```text
Architecture Review Inbox
  proposed commitments
  requested exceptions
  disputed findings
  stale ADRs
  ownerless artifacts

Migration Control Room
  target architecture
  exceptions
  open loops
  provider deadlines
  affected services

PR Architecture Review
  findings
  required decisions
  suggested actions
  approval state
  open follow-ups

Incident Learning View
  runtime anomaly
  contradicted assumptions
  new commitments proposed
  tests/monitors generated
```

These are workflow surfaces.

---

# 5. Open Loops Are First-Class

Architecture work often fails because follow-ups disappear.

Examples:

```text
temporary exception never expires
ADR draft never reviewed
test suggested but not added
provider migration task loses owner
known unknown remains unanswered
business override lacks revisit date
```

The system should track open loops and tie them to:

```text
owners
due dates
belief states
governance decisions
CI behavior
projection salience
```

An exception without an open loop is just suppressed debt.

---

# 6. Practice Patterns

Reusable practice patterns make the system adoptable.

## PR Architecture Reviewer

```text
observe baseline
classify existing violations
promote commitments
fail new high-confidence violations
suggest fixes or exceptions
learn from reviewer verdicts
```

## Commitment Promotion

```text
infer candidate commitment
ask owner clarification
draft DSL
review by governance body
run in proposed mode
measure false positives
promote to enforced
```

## Provider Migration

```text
ingest external change notice
bind affected code/contracts/tests
create migration plan
track open loops
verify compatibility
close before sunset
```

## Incident to Architecture Memory

```text
ingest runtime incident
identify contradicted assumption
propose new commitment/test/monitor
review and accept
enforce future prevention
```

---

# 7. Relationship to Existing Layers

The practice layer orchestrates the other layers.

```text
Belief calculus
  tells the episode what is true, stale, drifted, or unknown.

Commitment DSL
  provides proposed or accepted architecture rules.

Action model
  defines safe next steps.

Governance
  decides authority and approval.

Known unknowns
  become elicitation tasks.

Organizational time
  routes work to current stewards.

Pressure calculus
  explains why a decision is blocked or urgent.

Scheduler
  decides what analysis to run next.

Trust UX
  makes the workflow inspectable and safe.
```

---

# 8. Minimal Viable Practice Layer

For the first product wedge, implement:

```text
1. work episode = PR architecture review
2. open loops for:
   - required ADR update
   - required exception approval
   - required test evidence
   - owner clarification
3. collaboration events from PR comments and reviewer responses
4. governance verdicts linked to episode
5. episode summary projection
```

This turns PR review from one-off comments into durable architecture memory.

---

# 9. Final Definition

The Collaborative Engineering Practice Layer is:

> A workflow model for how people discover, debate, decide, implement, verify, operate, and revise architecture over time, with open loops, governance decisions, human corrections, and system actions preserved as part of the architecture memory.

It closes the largest remaining gap:

```text
software as a product to be understood
```

becomes:

```text
software development as a practice to be supported.
```

