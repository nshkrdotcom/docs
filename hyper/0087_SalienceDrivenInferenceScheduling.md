# Response 14 - Salience-Driven Inference Scheduling

The system defines many analyzers and reasoning engines, but it cannot run everything everywhere all the time. A large workspace may have millions of artifacts and many expensive LLM, static, runtime, and projection tasks.

The missing layer is inference prioritization:

```text
what to analyze first
what to defer
what to refresh
what to materialize
where to spend LLM budget
where human clarification is worth asking
```

---

# 1. Core Claim

The operating kernel needs a **salience-driven scheduler**.

Its job is to allocate finite analysis resources to the work that most improves:

```text
truth
actionability
trust
coverage
user value
risk reduction
latency
```

Without this, the system either under-analyzes important areas or wastes resources summarizing low-value code.

---

# 2. Task Types

The scheduler should prioritize:

```text
parse_file
extract_symbols
resolve_calls
extract_mix_config
infer_boundary
generate_llm_claims
evaluate_commitment
recompute_belief
refresh_projection_packet
materialize_diagonal_paths
ingest_runtime_trace
ask_human_clarification
generate_test_draft
run_benchmark_case
```

Each task has:

```text
cost
expected value
latency budget
dependencies
freshness need
risk impact
user demand
```

---

# 3. Priority Signals

| Signal | Meaning |
|---|---|
| `changed_recently` | PR or commit touched artifact |
| `policy_severity` | High-severity commitment involved |
| `belief_uncertainty` | Important claim is unknown or contested |
| `runtime_hotness` | Artifact is on hot production path |
| `risk_score` | Security, reliability, data, compliance risk |
| `fanout` | Many downstream artifacts depend on result |
| `user_attention` | User opened, queried, or corrected this area |
| `actionability` | Result may lead to concrete action |
| `staleness` | Existing claim/projection is stale |
| `coverage_gap` | Important region lacks analysis |
| `benchmark_value` | Task improves evaluation or calibration |

Suggested score:

```text
priority =
  expected_value
  * urgency
  * risk_multiplier
  * actionability
  * freshness_need
  / estimated_cost
```

---

# 4. Suggested Schema

```sql
CREATE TABLE analysis_budget (
  analysis_budget_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  budget_kind        text NOT NULL,
  -- llm_tokens, cpu_seconds, runtime_ingest,
  -- human_questions, projection_builds
  period_start       timestamptz NOT NULL,
  period_end         timestamptz NOT NULL,
  max_amount         numeric NOT NULL,
  used_amount        numeric NOT NULL DEFAULT 0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE inference_task (
  inference_task_id  uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  task_kind          text NOT NULL,
  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  priority_score     numeric NOT NULL DEFAULT 0.5,
  expected_value     numeric NOT NULL DEFAULT 0.5,
  estimated_cost     numeric NOT NULL DEFAULT 1.0,
  deadline_at        timestamptz,

  status             text NOT NULL DEFAULT 'pending',
  -- pending, blocked, running, completed, failed, skipped, superseded

  dependency_task_ids uuid[] NOT NULL DEFAULT '{}',
  priority_factors_json jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  started_at         timestamptz,
  completed_at       timestamptz
);
```

```sql
CREATE TABLE prioritization_policy (
  prioritization_policy_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  policy_key         text NOT NULL,
  scope_selector_json jsonb NOT NULL DEFAULT '{}',
  weights_json       jsonb NOT NULL,
  starvation_policy_json jsonb NOT NULL DEFAULT '{}',
  budget_policy_json jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, policy_key)
);
```

```sql
CREATE TABLE analysis_coverage_cell (
  coverage_cell_id   uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  cell_kind          text NOT NULL,
  -- bounded_context, otp_app, repo, commitment_family,
  -- runtime_service, risk_class
  cell_key           text NOT NULL,
  coverage_json      jsonb NOT NULL DEFAULT '{}',
  freshness_json     jsonb NOT NULL DEFAULT '{}',
  risk_json          jsonb NOT NULL DEFAULT '{}',
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snapshot_id, cell_kind, cell_key)
);
```

---

# 5. Scheduling Loop

```text
1. Ingest events.
2. Generate candidate inference tasks.
3. Estimate value and cost.
4. Apply dependency constraints.
5. Reserve budget.
6. Execute highest value tasks.
7. Update beliefs/projections.
8. Measure outcome value.
9. Recalibrate priority estimates.
```

The scheduler should learn which tasks actually produce useful changes.

Example:

```text
LLM summaries for low-salience private helpers rarely affect actions.
Boundary analysis for PR-changed functions often affects CI.
Runtime ingestion for hot paths often changes risk.
```

---

# 6. Human Question Budget

Human attention is the scarcest resource.

The scheduler should budget clarification questions.

Ask only when:

```text
uncertainty affects high-value action
answer is likely known by a specific person/team
question can be bounded
answer resolves multiple findings
automation cannot safely decide
```

Do not ask:

```text
low-impact curiosity questions
questions the system could answer by indexing more code
broad open-ended questions
questions with unclear action consequence
```

---

# 7. Starvation and Coverage

Pure priority can starve low-risk areas forever. The scheduler needs coverage floors.

Policies:

```text
minimum refresh for accepted commitments
minimum coverage for each bounded context
periodic stale-claim sweeps
runtime-hot path priority boost
new-team ownership areas priority boost
```

This keeps the system from becoming blind outside active PRs.

---

# 8. Minimal Viable Scheduler

For the PR reviewer wedge:

```text
1. prioritize changed files and affected commitments
2. prioritize high-severity policies
3. recompute beliefs only in local impact radius
4. refresh projection packet for PR review
5. ask at most N clarification questions per PR
6. defer low-salience LLM summaries
```

This gives practical latency and cost control from day one.

---

# 9. Final Definition

Salience-Driven Inference Scheduling is:

> A budget-aware prioritization engine that decides which analysis, belief, projection, runtime, LLM, benchmark, and human-clarification tasks are worth doing next.

It closes the gap between:

```text
the system knows how to analyze
```

and:

```text
the system knows what is worth analyzing now.
```

