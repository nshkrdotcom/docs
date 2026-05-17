# Response 32 - Formalization Economics and Ceremony Budget

Much of the design makes architecture more explicit: commitments, decisions, governance, exceptions, policies, evidence, and generated artifacts.

That is powerful, but explicitness is not free.

Formalization has cost:

```text
writing cost
review cost
maintenance cost
reading cost
future constraint cost
premature certainty cost
social process cost
```

The system needs an economics of formalization itself.

---

# 1. Core Claim

The system should decide not only what architecture should be formalized, but when formalization is worth its cost.

The correct level of ceremony depends on:

```text
risk
reversibility
team size
change rate
regulatory exposure
runtime blast radius
coordination burden
knowledge concentration
product stage
time pressure
```

More explicit architecture is not always better architecture.

---

# 2. Formalization Objects

| Object | Meaning |
|---|---|
| `formalization_candidate` | Something that could be made explicit |
| `formalization_cost_model` | Estimated cost of making and keeping it explicit |
| `ceremony_budget` | Team or project capacity for formal process |
| `formalization_level` | Current and target level of explicitness |
| `formalization_decision` | Decision to formalize, defer, simplify, or remove ceremony |
| `ceremony_debt` | Harm caused by too much or too little formalization |

---

# 3. Suggested Schema

```sql
CREATE TABLE formalization_candidate (
  formalization_candidate_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,
  candidate_kind     text NOT NULL,
  -- adr, commitment, test_contract, owner_record,
  -- boundary_policy, exception_process,
  -- runbook, generated_dashboard

  reason_text        text NOT NULL,
  expected_value     numeric NOT NULL DEFAULT 0.5,
  expected_cost      numeric NOT NULL DEFAULT 0.5,
  urgency            numeric NOT NULL DEFAULT 0.5,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE formalization_cost_model (
  formalization_cost_model_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  candidate_kind     text NOT NULL,
  cost_components_json jsonb NOT NULL DEFAULT '{}',
  -- authoring, review, maintenance,
  -- reader_load, enforcement_overhead,
  -- constraint_cost, update_frequency

  calibration_json   jsonb NOT NULL DEFAULT '{}',
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, candidate_kind)
);
```

```sql
CREATE TABLE ceremony_budget (
  ceremony_budget_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  team_id            uuid,
  project_id         uuid,

  budget_kind        text NOT NULL,
  -- adr_reviews, architecture_questions,
  -- enforcement_exceptions, policy_changes,
  -- generated_artifact_reviews

  capacity_units     numeric NOT NULL,
  used_units         numeric NOT NULL DEFAULT 0,
  window_start       timestamptz NOT NULL,
  window_end         timestamptz NOT NULL,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE formalization_decision (
  formalization_decision_id uuid PRIMARY KEY,
  formalization_candidate_id uuid NOT NULL REFERENCES formalization_candidate(formalization_candidate_id),

  decision_state     text NOT NULL,
  -- formalize_now, formalize_later, keep_informal,
  -- simplify_existing, remove_ceremony,
  -- defer_until_trigger

  selected_level     text NOT NULL,
  -- none, note, lightweight_record, reviewed_record,
  -- executable_commitment, enforced_policy

  rationale_text     text NOT NULL,
  trigger_json       jsonb NOT NULL DEFAULT '{}',
  decided_by_actor_id uuid,
  decided_by_body_id uuid,
  decided_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Formalization Levels

The system should support a ladder:

```text
none
  no explicit record

note
  informal annotation or reading mark

lightweight_record
  structured but not governed

reviewed_record
  accepted by owner or team

executable_commitment
  machine-evaluable constraint

enforced_policy
  CI or workflow blocking behavior
```

The system should recommend moving up or down this ladder based on value and cost.

---

# 5. Example Decisions

## Prototype boundary

```text
Candidate:
  ADR for new recommendation service boundary.

Cost:
  high change rate, unclear domain model, small team.

Decision:
  lightweight_record only, revisit when first external consumer appears.
```

## Payment security rule

```text
Candidate:
  Commitment that password reset tokens expire within 15 minutes.

Cost:
  low maintenance, high safety value.

Decision:
  executable commitment with fail-new-violations rollout.
```

## Overgrown governance

```text
Candidate:
  Existing weekly review for every schema change.

Cost:
  high delay, low finding rate.

Decision:
  simplify to risk-triggered review.
```

---

# 6. Ceremony Debt

Architecture debt can come from too little formalization:

```text
undocumented cross-context dependency
unclear ownership
missing security commitment
lost rationale
```

It can also come from too much formalization:

```text
stale ADRs nobody trusts
approval gates that do not catch risk
generated docs nobody reads
policies too rigid for product discovery
```

The system should track both.

---

# 7. Product Behavior

The product should say:

```text
This is worth formalizing because it affects a high-risk boundary,
has repeated drift, and currently depends on one person's memory.
```

It should also say:

```text
Do not turn this into an enforced commitment yet.
The code is changing weekly, the boundary is experimental,
and the current risk is low. Use a lightweight record with a beta trigger.
```

This is a more mature stance than "missing doc equals problem."

---

# 8. Minimal Viable Layer

Start with:

```text
formalization_candidate
formalization level ladder
simple cost/value scoring
ceremony budget per team
formalize/defer/keep-informal decision
```

This gives the system a way to recommend less process when less process is correct.

---

# 9. Final Definition

Formalization economics is the discipline of spending architectural ceremony only where it buys more clarity, safety, coordination, or speed than it costs.

It keeps the system from turning explicit architecture into its own form of debt.

