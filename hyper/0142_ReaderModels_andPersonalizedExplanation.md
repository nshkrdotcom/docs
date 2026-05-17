# Response 29 - Reader Models and Personalized Explanation

The trust UX explains how to show evidence, uncertainty, and belief states. The compression layer explains how to reduce cognitive load. But explanation quality depends on the reader.

The same architecture answer can be excellent for one person and useless for another.

---

# 1. Core Claim

The system should maintain reader models that represent a person's background, prior exposure, vocabulary, understanding states, and explanation preferences.

Good explanations are not only accurate. They are fitted to:

```text
what this person already knows
what they are trying to do
what they have seen before
which vocabulary they use
which risks they are responsible for
how much uncertainty they can act on
```

Without a reader model, every answer starts from a generic baseline.

---

# 2. Reader Objects

| Object | Meaning |
|---|---|
| `reader_profile` | Durable model of a person's explanation needs |
| `reader_exposure` | Prior contact with artifacts, domains, concepts, or incidents |
| `reader_vocabulary` | Preferred terms and known terms |
| `explanation_goal` | What the explanation is trying to enable |
| `explanation_variant` | A generated explanation fitted to a profile |
| `explanation_feedback` | Signal that the explanation was too shallow, too dense, wrong, or useful |
| `knowledge_prerequisite` | Concept needed before an explanation will land |

---

# 3. Suggested Schema

```sql
CREATE TABLE reader_profile (
  reader_profile_id uuid PRIMARY KEY,
  workspace_id      uuid NOT NULL,
  actor_id          uuid NOT NULL,

  role_kind         text,
  -- junior_engineer, senior_engineer, architect,
  -- sre, security_reviewer, product_manager,
  -- contractor, new_hire, executive

  familiarity_json  jsonb NOT NULL DEFAULT '{}',
  -- languages, frameworks, domains, services,
  -- architecture concepts, local vocabulary

  explanation_preferences_json jsonb NOT NULL DEFAULT '{}',
  -- prefers_examples, wants_source_first,
  -- wants_risk_first, short_answers, stepwise,
  -- diagram_first, compare_to_known_system

  privacy_level     text NOT NULL DEFAULT 'personal',
  -- personal, team_visible, aggregate_only

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, actor_id)
);
```

```sql
CREATE TABLE reader_exposure (
  reader_exposure_id uuid PRIMARY KEY,
  reader_profile_id uuid NOT NULL REFERENCES reader_profile(reader_profile_id),

  subject_kind      text NOT NULL,
  subject_id        uuid NOT NULL,
  exposure_kind     text NOT NULL,
  -- read, reviewed_pr, authored_code, resolved_incident,
  -- approved_decision, owned_service, completed_onboarding,
  -- disputed_finding

  exposure_strength numeric NOT NULL DEFAULT 0.5,
  last_seen_at      timestamptz NOT NULL DEFAULT now(),
  evidence_json     jsonb NOT NULL DEFAULT '{}',
  metadata          jsonb NOT NULL DEFAULT '{}',
  UNIQUE (reader_profile_id, subject_kind, subject_id, exposure_kind)
);
```

```sql
CREATE TABLE explanation_goal (
  explanation_goal_id uuid PRIMARY KEY,
  workspace_id      uuid NOT NULL,

  goal_kind         text NOT NULL,
  -- orient, debug, review, decide, onboard,
  -- compare, migrate, approve, teach, audit

  target_subject_kind text NOT NULL,
  target_subject_id uuid NOT NULL,
  required_depth    text NOT NULL DEFAULT 'medium',
  -- skim, working_model, decision_ready,
  -- implementation_ready, audit_ready

  risk_context_json jsonb NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE explanation_variant (
  explanation_variant_id uuid PRIMARY KEY,
  explanation_goal_id uuid NOT NULL REFERENCES explanation_goal(explanation_goal_id),
  reader_profile_id uuid REFERENCES reader_profile(reader_profile_id),

  variant_kind      text NOT NULL,
  -- novice, expert, source_first, risk_first,
  -- narrative, comparative, checklist, evidence_ladder

  content_artifact_id uuid,
  evidence_json     jsonb NOT NULL DEFAULT '{}',
  omitted_prerequisites_json jsonb NOT NULL DEFAULT '[]',
  uncertainty_disclosures_json jsonb NOT NULL DEFAULT '[]',
  created_at        timestamptz NOT NULL DEFAULT now(),
  metadata          jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE explanation_feedback (
  explanation_feedback_id uuid PRIMARY KEY,
  explanation_variant_id uuid NOT NULL REFERENCES explanation_variant(explanation_variant_id),
  actor_id          uuid NOT NULL,

  feedback_kind     text NOT NULL,
  -- too_basic, too_dense, missing_context,
  -- wrong_assumption, helpful, misleading,
  -- needs_example, needs_source, stale

  feedback_text     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Explanation Fitting

The explanation planner should choose:

```text
starting point
depth
vocabulary
examples
amount of code
amount of history
amount of uncertainty
whether to teach prerequisites first
whether to compare against a known concept
```

Example:

```text
Question:
  Why does Billing publish invoice events instead of calling Accounts directly?

For a new engineer:
  Explain bounded contexts, event mediation, and the local naming convention.

For the service owner:
  Skip bounded-context basics. Show the exception history and current drift risk.

For security:
  Lead with trust boundary and data exposure.

For product:
  Lead with why direct coupling slowed account migration.
```

The claim and evidence stay the same. The explanation shape changes.

---

# 5. Reader Model Inputs

Reader models should learn from:

```text
reading sessions
PR reviews
authored code
incident participation
explanation feedback
governance participation
accepted ambiguity records
onboarding checkpoints
explicit user settings
```

They should not infer sensitive personal judgments carelessly.

Use conservative states:

```text
has_seen
has_worked_on
has_reviewed
has_decision_authority
has_uncertain_understanding
unknown
```

Avoid pretending to measure intelligence or ability.

---

# 6. Privacy and Governance

Reader models can easily become invasive. The system should separate:

```text
private reader preferences
team-visible expertise signals
aggregate onboarding gaps
governance authority records
```

Rules:

```text
Do not expose private confusion marks by default.
Do not rank people by inferred ability.
Do not use reader profile as hidden enforcement authority.
Do show why an explanation was adapted.
Do let users correct their profile.
```

---

# 7. Minimal Viable Layer

Start with:

```text
reader_profile
reader_exposure
explanation_goal
explanation feedback buttons
reading-session integration
```

The first win is simple:

```text
stop re-explaining things the reader has already accepted
do explain prerequisites the reader has not seen
```

---

# 8. Final Definition

A reader model turns explanation from generic summarization into situated teaching and decision support.

It lets the system say the same true thing in the form most likely to help this person act correctly now.

