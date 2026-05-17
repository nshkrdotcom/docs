# Response 35 - Human Expertise Availability and Context Continuity

The organizational time layer models team lineage, ownership epochs, and handoffs. But daily engineering work depends on a more immediate resource:

```text
who currently has the context to make or review this decision?
```

Teams change. People rotate, go on leave, join as contractors, move to other teams, or become overloaded. Architectural knowledge is unevenly distributed and often perishable.

---

# 1. Core Claim

Human expertise and availability should be modeled as architectural resources.

The system should know enough to answer:

```text
Who can review this safely?
Who understands this module for this purpose?
Who has authority versus who has practical context?
Who is unavailable?
Where is knowledge concentrated in one person?
Which areas are at context-loss risk?
```

This is not a people-ranking system. It is continuity support for architecture work.

---

# 2. Expertise Objects

| Object | Meaning |
|---|---|
| `expertise_claim` | Evidence-backed claim that a person or team understands an area |
| `availability_window` | Whether a person or team can participate now |
| `review_readiness` | Whether someone can review a specific change type |
| `context_concentration_risk` | Risk that knowledge depends on too few people |
| `context_handoff` | Transfer of understanding between people or teams |
| `expertise_decay` | Staleness of expertise after code, concept, or team changes |
| `decision_room` | Recommended participants for a decision |

---

# 3. Suggested Schema

```sql
CREATE TABLE expertise_claim (
  expertise_claim_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  actor_id           uuid,
  team_id            uuid,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  expertise_kind     text NOT NULL,
  -- author, maintainer, reviewer, incident_responder,
  -- domain_expert, runtime_operator,
  -- security_reviewer, migration_owner,
  -- historical_context_holder

  strength           numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 0.5,
  source_kind        text NOT NULL,
  -- authored_code, reviewed_prs, incidents,
  -- reading_session, ownership_record,
  -- governance_decision, explicit_self_report,
  -- manager_assignment

  evidence_json      jsonb NOT NULL DEFAULT '{}',
  last_validated_at  timestamptz,
  expires_at         timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE availability_window (
  availability_window_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  actor_id           uuid,
  team_id            uuid,

  availability_state text NOT NULL,
  -- available, limited, unavailable,
  -- on_leave, rotating_out, contractor_ending,
  -- overloaded, unknown

  start_at           timestamptz NOT NULL,
  end_at             timestamptz,
  source_kind        text,
  source_ref         text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE review_readiness (
  review_readiness_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  actor_id           uuid NOT NULL,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  change_kind        text NOT NULL,
  -- routine, refactor, security_sensitive,
  -- migration, incident_fix, ownership_change,
  -- public_api_change

  readiness_state    text NOT NULL,
  -- ready, ready_with_limits, needs_refresh,
  -- not_ready, unavailable, unknown

  basis_json         jsonb NOT NULL DEFAULT '{}',
  missing_context_json jsonb NOT NULL DEFAULT '[]',
  updated_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE context_concentration_risk (
  context_concentration_risk_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  risk_kind          text NOT NULL,
  -- single_person_dependency, no_current_owner,
  -- expert_unavailable, contractor_exit,
  -- team_rotation, stale_expertise,
  -- missing_handoff

  risk_level         text NOT NULL,
  affected_work_json jsonb NOT NULL DEFAULT '[]',
  recommended_action_json jsonb NOT NULL DEFAULT '[]',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE context_handoff (
  context_handoff_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  from_actor_id      uuid,
  from_team_id       uuid,
  to_actor_id        uuid,
  to_team_id         uuid,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  handoff_state      text NOT NULL,
  -- planned, in_progress, completed,
  -- incomplete, failed, superseded

  required_reading_session_id uuid,
  required_narrative_id uuid,
  required_artifacts_json jsonb NOT NULL DEFAULT '[]',
  gaps_json          jsonb NOT NULL DEFAULT '[]',
  created_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);
```

---

# 4. Review Routing

Review routing should consider:

```text
ownership authority
practical expertise
recent exposure
understanding state
accepted ambiguity
availability
attention budget
conflict of perspective
required concern expertise
```

Example:

```text
Change:
  PR modifies password reset token expiry.

Needed reviewers:
  Accounts maintainer
  security concern owner
  person with recent incident context

Avoid:
  former owner whose expertise is stale
  current owner marked unavailable
  team already over attention budget unless severity is high
```

---

# 5. Context Continuity

The system should detect context-loss risks:

```text
Only one person has reviewed this area in the last year.
The current owner never completed onboarding for this boundary.
The contractor who authored the provider adapter leaves in two weeks.
The security reviewer for this concern is on leave.
The last accepted narrative is stale after a migration.
```

Recommended actions:

```text
schedule handoff reading session
generate narrative draft
capture known unknowns
assign secondary reviewer
formalize lightweight owner record
create concern map
downgrade enforcement until reviewer coverage exists
```

---

# 6. Privacy and Misuse Boundaries

This layer needs strong guardrails.

The system should not:

```text
rank engineers publicly
infer personal quality from code ownership
penalize people for private confusion marks
expose leave or availability details beyond routing needs
make employment judgments
```

The system should:

```text
route work responsibly
reduce single-person dependency
support handoffs
make missing context visible
protect private learning states
separate authority from practical familiarity
```

---

# 7. Minimal Viable Layer

Start with:

```text
expertise_claim from ownership, authorship, review, and incidents
availability_window from explicit team calendar or manual status
review_readiness for changed areas
context concentration risk
handoff checklist
```

This is enough to answer who should be in the room without pretending to know everything about people.

---

# 8. Final Definition

Human expertise availability is the operational model of who currently has the context, authority, and capacity to make architecture decisions.

It turns team memory from an invisible dependency into a managed architectural resource.

