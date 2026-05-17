# Response 9 - Organizational Time and Ownership Continuity

The existing lineage model tracks technical change across snapshots, commits, artifacts, and beliefs. But software also changes across **organizational time**:

```text
teams reorganize
owners leave
services move between groups
companies acquire codebases
domain boundaries change
stewards retire systems
knowledge is lost
```

The system needs to model how organizational context changes the trust, interpretation, and actionability of architecture knowledge.

---

# 1. Core Claim

Architecture memory is not only versioned by code commits. It is versioned by organizational stewardship.

The system should answer:

```text
Who owned this when it was created?
Who owns it now?
Did the owning team still exist when this rule was accepted?
Was this service inherited from an acquired codebase?
Is there anyone with current authority to approve changes?
Is the original rationale orphaned because the team disappeared?
```

---

# 2. Organizational Time Objects

| Object | Meaning |
|---|---|
| `organization_epoch` | A period with stable team/domain structure |
| `team_lineage` | Team split, merge, rename, dissolution, creation |
| `ownership_epoch` | Time-bounded stewardship of artifact/entity/system |
| `handoff_event` | Transfer of ownership or operational responsibility |
| `knowledge_continuity` | Whether current owners understand original intent |
| `acquisition_context` | Imported code with external history and unknowns |
| `stewardship_gap` | Important artifact lacks current accountable owner |

---

# 3. Suggested Schema

```sql
CREATE TABLE organization_epoch (
  org_epoch_id       uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  epoch_key          text NOT NULL,
  title              text NOT NULL,
  valid_from         timestamptz NOT NULL,
  valid_to           timestamptz,
  description        text,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, epoch_key)
);
```

```sql
CREATE TABLE team_lineage_event (
  team_lineage_event_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  event_kind         text NOT NULL,
  -- created, renamed, split, merged, dissolved,
  -- transferred_domain, acquired, outsourced

  from_team_ids      uuid[] NOT NULL DEFAULT '{}',
  to_team_ids        uuid[] NOT NULL DEFAULT '{}',
  effective_at       timestamptz NOT NULL,
  rationale_text     text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE ownership_epoch (
  ownership_epoch_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  owner_kind         text NOT NULL,
  -- team, person, role, governance_body, unknown
  owner_id           uuid,

  ownership_kind     text NOT NULL,
  -- owns, maintains, operates, reviews, inherited,
  -- temporary_steward, deprecated_owner

  valid_from         timestamptz NOT NULL,
  valid_to           timestamptz,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE handoff_event (
  handoff_event_id   uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  from_owner_id      uuid,
  to_owner_id        uuid,
  handoff_kind       text NOT NULL,
  -- planned, emergency, reorg, acquisition,
  -- deprecation, operational_transfer
  handoff_quality    text NOT NULL DEFAULT 'unknown',
  -- complete, partial, missing_docs, disputed, unknown
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE knowledge_continuity_assessment (
  continuity_id      uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  assessment_kind    text NOT NULL,
  -- original_author_available, current_owner_understands,
  -- docs_sufficient, runbook_sufficient, orphaned_intent
  state              text NOT NULL,
  -- strong, partial, weak, missing, disputed
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  assessed_at        timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Ownership Affects Belief and Action

Organizational context should affect:

```text
who can approve an exception
who receives PR findings
how much weight to give old human annotations
whether missing rationale is high risk
whether a commitment needs re-ratification
whether an ownership claim is stale
```

Example:

```text
Claim:
  This module belongs to Billing.

Evidence:
  Old team annotation from 2022.

Organizational time:
  Billing team split into Payments and Invoicing in 2024.

Belief result:
  ownership claim is historically valid but current ownership is stale.
```

---

# 5. Orphaned Intent

The system should detect artifacts whose original rationale exists only historically.

Signals:

```text
artifact is old and high-salience
original team dissolved
no current owner assigned
no linked ADR/requirement
few recent changes
runtime path remains important
current maintainers frequently override warnings
```

State:

```text
orphaned_intent
```

Action:

```text
create known unknown
request stewardship assignment
run architecture elicitation
generate rationale reconstruction task
```

---

# 6. Acquired and Imported Code

Imported systems need special handling.

The system should model:

```text
source organization
import date
known missing history
compatibility assumptions
new owner
legacy policy exceptions
migration plan
confidence limits
```

This prevents the system from pretending imported code has the same evidence quality as native, well-documented systems.

---

# 7. Organizational Time Queries

Examples:

```text
Who owned this service when this ADR was accepted?
Who owns it now?
Which architecture commitments have no current owner?
Which services were inherited from dissolved teams?
Which drift findings are blocked by ownership ambiguity?
Which exceptions were approved by people no longer in the owning group?
```

IntentQL example:

```yaml
query: ownership_continuity
root:
  bounded_context: Billing
include:
  - ownership_epochs
  - handoff_events
  - orphaned_intent
  - open_unknowns
```

---

# 8. Minimal Viable Organizational Time Layer

Start with:

```text
1. time-bounded ownership assignments
2. current owner resolution
3. ownership stale detection
4. stewardship gap findings
5. approval routing based on current owner
```

This is enough to stop the system from routing architecture actions to obsolete owners or trusting old ownership claims too strongly.

---

# 9. Final Definition

The Organizational Time Layer is:

> A versioned model of how teams, ownership, authority, and stewardship change over time, and how those changes affect architectural truth, trust, routing, and action.

It closes the gap between:

```text
technical lineage
```

and:

```text
organizational memory.
```

