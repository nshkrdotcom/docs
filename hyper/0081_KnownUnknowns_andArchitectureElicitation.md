# Response 8 - Known Unknowns and Architecture Elicitation

The existing design is strongest when architecture is present somewhere: code, docs, ADRs, tests, runtime traces, or human annotations. But real systems often contain architecture that was never written down.

The missing layer is a model for:

```text
latent architecture
implicit commitments
undocumented decisions
unknown ownership
missing rationale
questions the system knows it cannot answer
elicitation workflows that turn tacit knowledge into explicit memory
```

---

# 1. Core Claim

Architecture intelligence should not assume all architecture exists to be discovered.

It should explicitly model **known unknowns**:

```text
we know this area probably has an architectural rule,
but we do not yet know what the rule is
```

This is different from `unknown` as a low-confidence belief. It is an actionable gap in organizational memory.

---

# 2. Unknown Types

| Unknown Type | Example |
|---|---|
| `missing_commitment` | Code follows a pattern, but no rule explains it |
| `missing_rationale` | Function exists, but no upstream requirement or ADR is linked |
| `unknown_owner` | Module has no current team steward |
| `implicit_exception` | Violation is tolerated, but no exception record exists |
| `undocumented_external_contract` | Integration depends on provider behavior not captured as a contract |
| `ambiguous_boundary` | Artifact could belong to multiple bounded contexts |
| `missing_verification_policy` | Requirement exists, but no one knows what proof is required |
| `historical_decision_gap` | Old code reflects a decision made before records existed |

These unknowns should be first-class artifacts.

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_unknown (
  unknown_id         uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  unknown_kind       text NOT NULL,
  -- missing_commitment, missing_rationale, unknown_owner,
  -- implicit_exception, undocumented_contract,
  -- ambiguous_boundary, historical_decision_gap

  title              text NOT NULL,
  description        text,

  subject_kind       text,
  subject_id         uuid,

  suspected_from_json jsonb NOT NULL DEFAULT '{}',
  -- pattern, repeated exception, drift, query failure,
  -- human report, runtime anomaly, old code age

  severity           text NOT NULL DEFAULT 'medium',
  salience_score     numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 0.5,

  state              text NOT NULL DEFAULT 'open',
  -- open, investigating, answered, disproved, deferred,
  -- accepted_as_unknown, superseded

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE architecture_question (
  question_id        uuid PRIMARY KEY,
  unknown_id         uuid REFERENCES architecture_unknown(unknown_id),
  workspace_id       uuid NOT NULL,

  question_text      text NOT NULL,
  question_kind      text NOT NULL,
  -- ownership, intent, exception, boundary, contract,
  -- priority, verification, historical_origin

  target_actor_selector_json jsonb NOT NULL DEFAULT '{}',
  expected_answer_schema_json jsonb NOT NULL DEFAULT '{}',
  value_score        numeric NOT NULL DEFAULT 0.5,
  effort_score       numeric NOT NULL DEFAULT 0.5,
  state              text NOT NULL DEFAULT 'open',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE elicitation_session (
  elicitation_session_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  session_kind       text NOT NULL,
  -- architecture_interview, review_prompt, migration_review,
  -- onboarding_capture, incident_retro, active_learning_batch

  title              text NOT NULL,
  facilitator_actor_id uuid,
  participant_selector_json jsonb NOT NULL DEFAULT '{}',
  question_ids       uuid[] NOT NULL DEFAULT '{}',
  outcome_json       jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);
```

```sql
CREATE TABLE elicited_answer (
  elicited_answer_id uuid PRIMARY KEY,
  question_id        uuid NOT NULL REFERENCES architecture_question(question_id),
  answered_by_actor_id uuid,
  answer_text        text,
  answer_json        jsonb NOT NULL DEFAULT '{}',
  authority_level    text NOT NULL DEFAULT 'unknown',
  scope_json         jsonb NOT NULL DEFAULT '{}',
  resulting_artifact_kind text,
  resulting_artifact_id uuid,
  confidence         numeric NOT NULL DEFAULT 0.5,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Unknowns Should Drive Action

Known unknowns should not sit passively in the graph.

They should trigger:

```text
targeted questions
review tasks
candidate commitment proposals
ownership clarification
exception requests
rationale capture
documentation tasks
benchmark cases
```

Example:

```text
Unknown:
  Reporting reads Billing tables directly, but this has existed for 4 years.

Question:
  Is this an approved shared-kernel data surface, a legacy exception, or a violation?

Suggested target:
  Billing owner + Reporting owner + architecture reviewer.

Possible outcomes:
  - create explicit exception
  - create migration commitment
  - mark as accepted shared read model
  - classify as violation
```

---

# 5. Active Learning for Architecture

The system should ask questions that reduce the most uncertainty per unit of human effort.

Priority can be computed from:

```text
risk
fanout
number of affected findings
impact on enforcement
human answerability
staleness
runtime importance
business criticality
```

Example:

```text
Labeling whether `Accounts.PublicUser` is public or internal
would resolve 17 possible boundary findings.
```

This is much better than asking humans to review every inferred claim.

---

# 6. Tacit Knowledge Capture

Architecture often lives in:

```text
old Slack threads
meeting decisions
PR comments
incident retrospectives
unwritten team norms
senior engineer memory
```

The system should allow lightweight capture:

```text
This was intentional because...
This is legacy and should be removed...
This module belongs to Shared Kernel...
This provider behavior is assumed...
No one currently knows why this exists...
```

Captured answers should become claims with:

```text
source = elicited_human_answer
authority = scoped by role
freshness = tied to answer date and scope
state = believed or proposed until corroborated
```

---

# 7. Unknowns in Trust UX

The UI should show memory gaps explicitly.

Bad:

```text
No rationale found.
```

Better:

```text
No upstream rationale is recorded.

Known unknown:
  This function is old, high-salience, and on a security path.
  It has no linked requirement, ADR, or commitment.

Suggested question:
  Should this behavior be formalized as a security commitment?
```

This turns missing documentation into actionable architecture work.

---

# 8. Minimal Viable Unknowns Layer

For the PR reviewer wedge, implement:

```text
1. unknown_owner
2. ambiguous_boundary
3. implicit_exception
4. missing_commitment
5. missing_verification_policy
```

And support one action:

```text
ask targeted clarification
```

This prevents the system from over-enforcing where the organization has not yet made architecture explicit.

---

# 9. Final Definition

The Known Unknowns and Elicitation Layer is:

> A model for detecting, prioritizing, asking about, and resolving gaps in architectural memory, especially where important intent exists only as tacit human knowledge or inherited convention.

It closes the gap between:

```text
architecture as discoverable artifact
```

and:

```text
architecture as partly undocumented organizational knowledge.
```

