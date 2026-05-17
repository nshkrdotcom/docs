# Response 27 - Reading Sessions and Interpretive Work

The system already supports queries, projections, exploration sessions, PR review, governance, and architecture actions. But there is still a missing primary activity:

```text
reading
```

Architecture work often begins before a user has a precise question. An engineer sits with a module, follows definitions, keeps several threads open, compares two paths, marks confusion, accepts some claims provisionally, and returns later.

This should not be treated as a loose sequence of navigation clicks. Reading is a first-class architectural activity.

---

# 1. Core Claim

The system should model sustained reading as a durable work mode.

Reading is different from search:

```text
search asks for a target
reading builds a model
```

Reading is different from exploration:

```text
exploration tries to discover a question
reading tries to absorb and interpret a region
```

Reading is different from review:

```text
review evaluates a change or claim
reading prepares the person to evaluate anything at all
```

The product should make careful reading visible, resumable, and useful to the belief and explanation layers.

---

# 2. Reading Objects

| Object | Meaning |
|---|---|
| `reading_session` | A durable episode of sustained reading |
| `reading_scope` | The selected module, feature, slice, decision trail, or concern |
| `reading_thread` | A line of attention the reader is following |
| `reading_mark` | Annotation, confusion, acceptance, question, or bookmark |
| `reading_checkpoint` | A resumable state in a reading session |
| `reading_comparison` | Side-by-side comparison between artifacts or paths |
| `read_acceptance` | A scoped record that a user has read and accepted something for a purpose |

---

# 3. Suggested Schema

```sql
CREATE TABLE reading_session (
  reading_session_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  actor_id           uuid NOT NULL,
  work_episode_id    uuid,

  session_kind       text NOT NULL,
  -- onboarding, review_prep, incident_followup,
  -- feature_understanding, due_diligence, refactor_prep,
  -- general_study

  title              text,
  state              text NOT NULL DEFAULT 'active',
  -- active, paused, completed, abandoned, superseded

  started_at         timestamptz NOT NULL DEFAULT now(),
  paused_at          timestamptz,
  completed_at       timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE reading_scope (
  reading_scope_id   uuid PRIMARY KEY,
  reading_session_id uuid NOT NULL REFERENCES reading_session(reading_session_id),

  scope_kind         text NOT NULL,
  -- module, feature, bounded_context, trace_path,
  -- commitment, concern, runtime_service, decision_history

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  scope_reason       text,
  included_selector_json jsonb NOT NULL DEFAULT '{}',
  excluded_selector_json jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE reading_thread (
  reading_thread_id  uuid PRIMARY KEY,
  reading_session_id uuid NOT NULL REFERENCES reading_session(reading_session_id),

  thread_kind        text NOT NULL,
  -- call_flow, data_flow, rationale, test_path,
  -- ownership, runtime_behavior, concern_path,
  -- unknown_cluster

  label              text NOT NULL,
  current_subject_kind text,
  current_subject_id uuid,
  thread_state       text NOT NULL DEFAULT 'open',
  -- open, parked, resolved, abandoned

  priority           numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE reading_mark (
  reading_mark_id    uuid PRIMARY KEY,
  reading_session_id uuid NOT NULL REFERENCES reading_session(reading_session_id),
  reading_thread_id  uuid REFERENCES reading_thread(reading_thread_id),

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  source_span_id     uuid,

  mark_kind          text NOT NULL,
  -- note, question, confusion, bookmark, accepted,
  -- suspicious, compare_later, explain_again,
  -- followup, skip_for_now

  body               text,
  confidence         numeric,
  visibility         text NOT NULL DEFAULT 'private',
  -- private, team, governance, training_signal

  created_at         timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE reading_checkpoint (
  reading_checkpoint_id uuid PRIMARY KEY,
  reading_session_id uuid NOT NULL REFERENCES reading_session(reading_session_id),

  checkpoint_kind    text NOT NULL,
  -- pause, handoff, resume_point, summary,
  -- completion, model_update

  focus_subject_kind text,
  focus_subject_id   uuid,
  open_threads_json  jsonb NOT NULL DEFAULT '[]',
  summary_text       text,
  next_steps_json    jsonb NOT NULL DEFAULT '[]',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Product Behavior

The reading mode should support:

```text
pause and resume
keep multiple threads open
mark "I do not understand this yet"
compare two paths side by side
record "good enough for current task"
convert confusion into a known unknown
convert insight into a candidate claim
produce a reading summary without pretending it is a final architecture decision
```

The system should not force every reading mark into a finding, violation, or action.

Some marks are cognitive scaffolding:

```text
this looks important
return after reading tests
I understand the public API but not the async worker path
accepted for PR review, not accepted for migration planning
```

---

# 5. Reading State and Belief State

Reading marks should not automatically change architecture truth.

They should feed:

```text
reader model
explanation personalization
known unknowns
context bundles
future salience scheduling
candidate claims
team expertise maps
```

Example:

```text
An engineer reads Billing.InvoiceFinalizer.

They mark:
  "understand happy path"
  "unclear retry semantics"
  "accepted for current tax PR"

The system should remember:
  this person has enough understanding for tax-related review
  retry behavior remains uncertain
  future explanations can skip happy-path basics
  retry-related changes should not assume this reader has full context
```

---

# 6. Reading UI

The UI should have a mode for slow work:

```text
left: artifact or trace path
right: notes, open threads, evidence, current scope
bottom: breadcrumb of reading trail
side-by-side: compare code, tests, ADR, runtime trace
resume card: where you stopped and what remained open
```

This is not a chat surface. It is an interpretive workspace.

The assistant can participate, but the durable state is not the chat transcript. The durable state is the reading session, marks, checkpoints, and accepted uncertainty.

---

# 7. Minimal Viable Layer

The smallest useful version needs:

```text
reading_session
reading_mark
reading_checkpoint
read_acceptance
conversion to known_unknown
conversion to candidate_claim
```

This is enough to make architecture understanding cumulative for a person instead of disappearing at the end of a browser tab.

---

# 8. Final Definition

Reading sessions turn slow interpretive work into a first-class system activity.

They let the system remember not just what a user asked, but what they studied, what they accepted, what they still do not understand, and where their mental model should resume.

