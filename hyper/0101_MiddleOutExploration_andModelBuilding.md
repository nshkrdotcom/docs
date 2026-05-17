# Response 17 - Middle-Out Exploration and Model Building

The existing design is strong at tracing from known intent down to code, and from runtime evidence back up to architecture. But engineering often starts in the middle.

An engineer opens an unfamiliar codebase and thinks:

```text
What is this area?
What patterns are emerging?
Which functions belong together?
What concepts are implicit here?
What rule do these modules seem to follow?
What question should I ask next?
```

The missing layer is an exploratory mode for building a mental model from code, tests, runtime, and local patterns before the user knows the right query.

---

# 1. Core Claim

The system needs **middle-out exploration**.

It should support a workflow where architecture is discovered from:

```text
code neighborhoods
repeated patterns
test structure
runtime traces
co-change clusters
module naming
data access
mock boundaries
human notes
```

This is different from asking "why does this function exist?" It is the mode where the user does not yet know what the important concepts are.

---

# 2. Exploration Objects

| Object | Meaning |
|---|---|
| `exploration_session` | A durable investigation episode |
| `attention_trail` | What the user inspected, compared, expanded, or dismissed |
| `emergent_cluster` | A candidate conceptual grouping found during exploration |
| `hypothesis` | A possible commitment, boundary, concept, or rationale |
| `sensemaking_note` | User or system note about emerging understanding |
| `next_question` | Suggested high-value question |
| `model_snapshot` | Current provisional mental model |

---

# 3. Suggested Schema

```sql
CREATE TABLE exploration_session (
  exploration_session_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  session_key        text,
  title              text NOT NULL,
  root_anchor_id     uuid,
  entry_kind         text NOT NULL,
  -- module, function, PR, runtime_trace, search_result,
  -- unknown_area, onboarding_task

  user_goal_text     text,
  state              text NOT NULL DEFAULT 'active',
  -- active, paused, summarized, converted_to_episode, abandoned

  created_by_actor_id uuid,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE attention_event (
  attention_event_id uuid PRIMARY KEY,
  exploration_session_id uuid NOT NULL REFERENCES exploration_session(exploration_session_id),
  actor_id           uuid,
  event_kind         text NOT NULL,
  -- view, expand, compare, search, follow_path,
  -- mark_relevant, dismiss, correct, ask_query
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  event_json         jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE exploration_hypothesis (
  hypothesis_id      uuid PRIMARY KEY,
  exploration_session_id uuid NOT NULL REFERENCES exploration_session(exploration_session_id),

  hypothesis_kind    text NOT NULL,
  -- candidate_commitment, candidate_boundary,
  -- candidate_domain_concept, candidate_contract,
  -- candidate_owner, candidate_rationale,
  -- duplicate_concept, hidden_coupling

  statement_text     text NOT NULL,
  subject_ids        uuid[] NOT NULL DEFAULT '{}',
  support_json       jsonb NOT NULL DEFAULT '{}',
  refute_json        jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  state              text NOT NULL DEFAULT 'proposed',
  -- proposed, promoted, rejected, needs_human_answer,
  -- converted_to_commitment, converted_to_unknown
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE emergent_cluster (
  emergent_cluster_id uuid PRIMARY KEY,
  exploration_session_id uuid REFERENCES exploration_session(exploration_session_id),
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  cluster_kind       text NOT NULL,
  -- behavior, domain_concept, data_flow, test_surface,
  -- runtime_path, coupling_cluster, duplicate_pattern

  label              text,
  member_anchor_ids  uuid[] NOT NULL DEFAULT '{}',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  naming_confidence  numeric NOT NULL DEFAULT 0.5,
  salience_score     numeric NOT NULL DEFAULT 0.5,
  state              text NOT NULL DEFAULT 'candidate',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE model_snapshot (
  model_snapshot_id  uuid PRIMARY KEY,
  exploration_session_id uuid NOT NULL REFERENCES exploration_session(exploration_session_id),
  summary_text       text,
  concepts_json      jsonb NOT NULL DEFAULT '[]',
  open_questions_json jsonb NOT NULL DEFAULT '[]',
  promoted_artifacts_json jsonb NOT NULL DEFAULT '[]',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Exploration Operators

Middle-out exploration needs operators that are not just trace queries.

Examples:

```text
show_neighborhood
compare_siblings
cluster_by_shape
cluster_by_test_boundary
cluster_by_runtime_path
show_conceptual_duplicates
show_boundary_candidates
show_hidden_couplings
show_missing_names
suggest_next_questions
promote_hypothesis
```

These operators help the user form a model before formal commitments exist.

---

# 5. Exploratory Projection

An exploration view should show:

```text
current artifact
nearby structural context
similar artifacts
tests that reveal expected behavior
runtime paths
data touched
candidate concepts
candidate commitments
open questions
high-value next steps
```

Unlike a PR review projection, this view is allowed to show weaker inferred material, as long as it is clearly marked.

Trust mode:

```text
verified facts
likely patterns
candidate hypotheses
unknowns
next questions
```

---

# 6. Bottom-Up Commitment Discovery

The system should infer candidate commitments from repeated behavior.

Example:

```text
Observed pattern:
  42 Phoenix controllers call context modules.
  0 controllers call Repo.
  Context modules own Repo access.

Hypothesis:
  Web controllers should not call Repo directly.

State:
  candidate commitment.

Suggested action:
  Ask architecture owner whether to promote this rule.
```

This is architecture extracted from code practice, not from a pre-existing ADR.

---

# 7. Pattern Comparison

Exploration should support comparing artifacts:

```text
These two functions have similar structure but different commitments.
These two tests mock different boundaries for the same provider.
These modules both transform invoice data but live in different contexts.
These runtime paths share a database table but no explicit contract.
```

Comparison output should include:

```text
similarities
differences
possible shared concept
possible boundary violation
candidate refactor
unknowns requiring human input
```

---

# 8. Relationship to Known Unknowns

Exploration often ends with:

```text
we found an important question
```

The system should convert unresolved exploration hypotheses into known unknowns:

```text
Is this shared concept intentional?
Who owns this data shape?
Is this duplicate behavior a feature or drift?
Should this repeated pattern become a commitment?
```

This bridges discovery and governance.

---

# 9. Minimal Viable Exploration

For the first version:

```text
1. start from module/function/PR
2. show local structural neighborhood
3. show similar functions/modules
4. show tests and mocks around the artifact
5. infer candidate concepts and commitments
6. let user promote, reject, or ask question
7. persist attention trail and model snapshot
```

This makes the system useful before architecture is fully formalized.

---

# 10. Final Definition

Middle-Out Exploration is:

> A sensemaking mode that helps users build provisional architecture understanding from code, tests, runtime behavior, and patterns, then promote useful hypotheses into commitments, known unknowns, context bundles, or governance proposals.

It closes the gap between:

```text
known-requirement navigation
```

and:

```text
exploring an unfamiliar system before knowing what to ask.
```

