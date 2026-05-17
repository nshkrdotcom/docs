# Response 30 - Architecture Narrative and Historical Sensemaking

The design-to-code hypergraph can trace requirements, decisions, contracts, code, tests, runtime, and history. But traceability is not the same as narrative.

A trace can answer:

```text
What led to this function?
```

A narrative answers:

```text
How did this part of the system get this way, and why does it make sense given what happened?
```

Both are needed.

---

# 1. Core Claim

Architecture should be represented not only as structure and constraint, but also as story.

The story is not fiction. It is an evidence-backed synthesis of:

```text
business pressures
technical constraints
incidents
migrations
staffing changes
provider changes
deadlines
reversals
exceptions
debt acceptance
concept drift
```

Narrative makes a system intelligible. It explains why the current architecture is not arbitrary.

---

# 2. Narrative Objects

| Object | Meaning |
|---|---|
| `architecture_narrative` | A coherent story about a part of the system |
| `narrative_episode` | A time-bounded event in that story |
| `narrative_turning_point` | A decision, incident, migration, or constraint that changed direction |
| `narrative_thread` | A theme such as compliance, scaling, migration, or ownership |
| `narrative_claim` | A claim used in the story |
| `narrative_gap` | Missing or contested part of the story |
| `narrative_variant` | Different story for different perspective or audience |

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_narrative (
  architecture_narrative_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  narrative_kind     text NOT NULL,
  -- origin_story, migration_story, incident_story,
  -- debt_story, domain_evolution, ownership_story,
  -- provider_story, security_story

  perspective_id     uuid,
  title              text NOT NULL,
  summary_text       text,
  confidence         numeric NOT NULL DEFAULT 0.5,
  state              text NOT NULL DEFAULT 'draft',
  -- draft, reviewed, accepted, contested,
  -- stale, superseded

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE narrative_episode (
  narrative_episode_id uuid PRIMARY KEY,
  architecture_narrative_id uuid NOT NULL REFERENCES architecture_narrative(architecture_narrative_id),

  sequence_index     integer NOT NULL,
  episode_kind       text NOT NULL,
  -- decision, incident, deadline, migration,
  -- acquisition, outage, refactor, exception,
  -- team_change, provider_change

  title              text NOT NULL,
  event_time         timestamptz,
  start_time         timestamptz,
  end_time           timestamptz,
  body_text          text NOT NULL,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  UNIQUE (architecture_narrative_id, sequence_index)
);
```

```sql
CREATE TABLE narrative_turning_point (
  narrative_turning_point_id uuid PRIMARY KEY,
  architecture_narrative_id uuid NOT NULL REFERENCES architecture_narrative(architecture_narrative_id),

  trigger_kind       text NOT NULL,
  -- new_requirement, incident, scale_limit,
  -- deadline, compliance_need, provider_change,
  -- team_loss, product_pivot

  trigger_artifact_id uuid,
  before_state_text  text,
  after_state_text   text,
  consequence_text   text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE narrative_gap (
  narrative_gap_id   uuid PRIMARY KEY,
  architecture_narrative_id uuid NOT NULL REFERENCES architecture_narrative(architecture_narrative_id),

  gap_kind           text NOT NULL,
  -- missing_date, missing_reason, contested_cause,
  -- missing_owner, missing_tradeoff, weak_evidence,
  -- perspective_conflict

  description        text NOT NULL,
  blocking_level     text NOT NULL DEFAULT 'non_blocking',
  known_unknown_id   uuid,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Narrative vs Trace

Trace:

```text
REQ-42 -> ADR-9 -> COMMITMENT-12 -> Billing.InvoiceFinalizer -> test
```

Narrative:

```text
Billing started as a direct synchronous flow because payment volume was low.
The 2023 retry incident showed that invoice finalization needed isolation.
The team introduced an event boundary, but kept one direct call for legacy tax export.
That exception became risky after Accounts moved ownership to the Identity team.
The current architecture is therefore a hybrid transitional state, not a clean design.
```

The second answer is what a new architect needs to make good judgment.

---

# 5. Narrative Queries

The system should support:

```text
Tell the story of how Billing got into its current shape.
What turning points explain the current boundary?
Which parts of this architecture are deliberate and which are leftover?
What changed after the 2024 incident?
Why does this exception still exist?
Which story differs between the security and domain perspectives?
```

The answer should disclose:

```text
evidence strength
missing episodes
contested causes
perspective
current relevance
```

---

# 6. Narrative Governance

Narratives should have lifecycle states:

```text
draft
reviewed
accepted
contested
stale
superseded
```

They should not silently become authoritative architecture. They become high-value context that may support decisions, onboarding, migration planning, or governance.

Accepted narratives can be attached to:

```text
bounded contexts
architecture perspectives
commitments
debt items
provider migrations
incident reviews
onboarding paths
```

---

# 7. Minimal Viable Layer

Start with:

```text
architecture_narrative
narrative_episode
narrative_gap
trace-to-narrative generator
human review state
```

The first useful product behavior is:

```text
Generate a draft story from decisions, incidents, ownership changes, and code history,
then ask owners to correct the weak parts.
```

---

# 8. Final Definition

Architecture narrative is evidence-backed historical sensemaking.

It lets the system explain not only what exists and what constrains it, but why the current shape became reasonable under the sequence of pressures that produced it.

