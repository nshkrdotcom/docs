# Response 12 - Diagonal Navigation Materialization Strategy

The existing design promises diagonal navigation: jumping across abstraction levels, concerns, risks, runtime behavior, ownership, and architecture. The missing piece is operational.

The hard question is:

```text
What exactly gets precomputed so diagonal navigation is fast,
bounded, explainable, and not a graph hairball?
```

---

# 1. Core Claim

Diagonal navigation should be materialized as **ranked cross-dimensional paths**, not as an all-pairs graph and not as ad hoc vector search.

The system should precompute a bounded set of high-salience paths such as:

```text
function -> commitment -> violation -> owner
requirement -> decision -> contract -> implementation -> test
runtime hot path -> design assumption -> risk -> action
source span -> data entity -> external interface -> migration plan
module -> ambiguous boundary -> active question -> governance proposal
```

---

# 2. Diagonal Path Families

Define path families explicitly.

| Family | Example |
|---|---|
| `rationale_path` | code -> contract -> commitment -> decision -> requirement |
| `violation_path` | source span -> relation -> commitment -> action |
| `risk_path` | artifact -> risk claim -> pressure -> mitigation |
| `ownership_path` | module -> bounded context -> owner -> governance body |
| `runtime_drift_path` | trace -> runtime claim -> contradicted commitment -> code |
| `data_lineage_path` | function -> schema -> table -> data owner -> policy |
| `external_change_path` | provider notice -> contract -> adapter -> tests |
| `known_unknown_path` | artifact -> missing rationale -> question -> elicitation session |

Each family has its own ranking and materialization policy.

---

# 3. Candidate Generation

Diagonal candidates should come from multiple sources:

```text
trace edges
semantic hyperedges
artifact coordinates
commitment evaluations
runtime observations
ownership assignments
known unknowns
vector similarity
co-change history
human corrections
```

But vector similarity should only create candidates. It should not by itself create authoritative paths.

---

# 4. Ranking Signals

Rank diagonal paths by:

```text
salience
risk
belief strength
user task relevance
path length
evidence quality
novelty
diversity
runtime hotness
policy severity
owner relevance
recent change proximity
```

Suggested path score:

```text
path_score =
  salience
  * evidence_strength
  * task_relevance
  * continuity
  * diversity_bonus
  * freshness
  * risk_multiplier
  / path_cost
```

---

# 5. Suggested Schema

```sql
CREATE TABLE diagonal_navigation_spec (
  diagonal_spec_id   uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  spec_key           text NOT NULL,
  path_family        text NOT NULL,
  start_selector_json jsonb NOT NULL DEFAULT '{}',
  allowed_edge_types text[] NOT NULL DEFAULT '{}',
  required_dimensions text[] NOT NULL DEFAULT '{}',
  ranking_policy_json jsonb NOT NULL DEFAULT '{}',
  max_paths_per_anchor integer NOT NULL DEFAULT 20,
  max_path_length     integer NOT NULL DEFAULT 6,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, spec_key)
);
```

```sql
CREATE TABLE diagonal_candidate_pool (
  candidate_id       uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL,
  diagonal_spec_id   uuid NOT NULL REFERENCES diagonal_navigation_spec(diagonal_spec_id),
  start_anchor_id    uuid NOT NULL,
  candidate_anchor_id uuid NOT NULL,
  candidate_source   text NOT NULL,
  -- trace_edge, coordinate_overlap, hyperedge,
  -- vector_similarity, runtime_observation, human_correction
  raw_score          numeric NOT NULL DEFAULT 0.5,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE diagonal_path_index (
  diagonal_path_id   uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL,
  diagonal_spec_id   uuid NOT NULL REFERENCES diagonal_navigation_spec(diagonal_spec_id),
  path_family        text NOT NULL,

  start_anchor_id    uuid NOT NULL,
  end_anchor_id      uuid NOT NULL,
  path_length        integer NOT NULL,
  path_score         numeric NOT NULL,
  salience_score     numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 0.5,
  explanation_text   text,
  invalidation_keys_json jsonb NOT NULL DEFAULT '[]',

  UNIQUE (snapshot_id, diagonal_spec_id, start_anchor_id, end_anchor_id)
);
```

```sql
CREATE TABLE diagonal_path_step (
  diagonal_path_step_id uuid PRIMARY KEY,
  diagonal_path_id   uuid NOT NULL REFERENCES diagonal_path_index(diagonal_path_id),
  step_index         integer NOT NULL,
  anchor_id          uuid NOT NULL,
  edge_kind          text,
  edge_id            uuid,
  step_role          text,
  belief_state       text,
  evidence_summary_json jsonb NOT NULL DEFAULT '{}',
  UNIQUE (diagonal_path_id, step_index)
);
```

---

# 6. Materialization Strategy

Do not materialize every possible diagonal jump.

Materialize:

```text
top K paths per anchor per path family
top K paths per high-salience commitment
top K paths per active violation
top K paths per PR-changed artifact
top K paths per runtime drift finding
top K paths per known unknown
```

Use on-demand materialization for low-salience paths.

---

# 7. Path Planning

Use constrained search over layered graph data.

Inputs:

```text
start anchor
path family
allowed graph layers
allowed edge types
required dimensions
max length
task context
```

Algorithm:

```text
1. Generate candidate endpoints.
2. Search bounded paths through allowed layers.
3. Score path evidence and continuity.
4. Deduplicate near-equivalent paths.
5. Preserve path diversity.
6. Store top K.
7. Attach explanation and invalidation keys.
```

This is closer to route planning than generic graph traversal.

---

# 8. Diagonal Navigation and Projection Packets

Projection packets should include:

```text
visible diagonal paths
prefetch path IDs
continuity links
path explanations
hidden high-risk path count
on-demand expansion hints
```

Example:

```text
Function view:
  Accounts.Token.verify_reset_token/1

Diagonal paths:
  1. Rationale: function -> SEC-014 -> ADR-008
  2. Verification: function -> expiry test
  3. Drift: function -> changed max_age -> violated commitment
  4. Owner: function -> Accounts context -> Identity team
```

---

# 9. Invalidation

Diagonal paths become stale when any step changes.

Invalidation keys should include:

```text
anchor structural hash
claim belief state hash
commitment version
ownership epoch
runtime observation window
query/projection policy
coordinate vector version
```

If a path depends on stale belief, the path should remain visible but marked stale until recomputed.

---

# 10. Minimal Viable Diagonal Navigation

Start with four path families:

```text
rationale_path
violation_path
ownership_path
verification_path
```

Materialize top 10 paths for:

```text
PR-changed functions
accepted commitments
active violations
high-salience modules
```

This is enough to make diagonal navigation feel real in the PR reviewer and rationale explorer.

---

# 11. Final Definition

Diagonal Navigation Materialization is:

> A bounded, ranked, evidence-backed path index across graph layers and dimensions, designed to make cross-cutting navigation fast, explainable, fresh, and task-relevant.

It closes the gap between:

```text
the promise of diagonal navigation
```

and:

```text
a concrete hot read path the UI can serve.
```

