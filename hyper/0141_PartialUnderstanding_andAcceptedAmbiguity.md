# Response 28 - Partial Understanding and Accepted Ambiguity

The existing design models unknowns, epistemic boundaries, belief states, and trust UX. But it still tends to treat understanding as a destination:

```text
unknown -> investigated -> understood
```

Real engineering work often lands somewhere else:

```text
partially understood, uncertainty accepted for this purpose
```

That state should be durable.

---

# 1. Core Claim

Partial understanding is a valid persistent state, not a failure to finish analysis.

An engineer can understand enough of a module to safely make one change while still not understanding another part of it. That state should be scoped, explicit, decaying, and revisitable.

The system should distinguish:

```text
not read
read but not understood
partially understood
understood for a purpose
uncertainty accepted
uncertainty rejected
full understanding claimed
understanding invalidated by change
```

---

# 2. Understanding Objects

| Object | Meaning |
|---|---|
| `understanding_state` | A scoped record of a person's or team's understanding |
| `understanding_scope` | What the understanding applies to |
| `ambiguity_acceptance` | A deliberate decision to proceed despite uncertainty |
| `understanding_gap` | The part that remains unclear |
| `understanding_decay_event` | A code, doc, runtime, or concept change that reduces confidence |
| `understanding_review` | A reassessment of whether prior understanding still holds |

---

# 3. Suggested Schema

```sql
CREATE TABLE understanding_state (
  understanding_state_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  actor_id           uuid,
  team_id            uuid,

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  purpose_kind       text NOT NULL,
  -- onboarding, pr_review, refactor, incident,
  -- security_review, migration, ownership_handoff,
  -- general_maintenance

  state              text NOT NULL,
  -- not_started, read_unresolved, partial,
  -- sufficient_for_purpose, strong,
  -- stale, invalidated

  understood_fraction numeric,
  confidence         numeric NOT NULL DEFAULT 0.5,
  scope_text         text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  valid_until        timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE ambiguity_acceptance (
  ambiguity_acceptance_id uuid PRIMARY KEY,
  understanding_state_id uuid NOT NULL REFERENCES understanding_state(understanding_state_id),

  ambiguity_kind     text NOT NULL,
  -- behavior_unknown, rationale_unknown, ownership_unknown,
  -- runtime_unknown, test_gap, edge_case_unknown,
  -- external_dependency_unknown

  accepted_for_kind  text NOT NULL,
  -- current_pr, advisory_review, prototype,
  -- low_risk_change, time_boxed_investigation,
  -- emergency_response

  risk_level         text NOT NULL,
  -- low, medium, high, critical

  rationale_text     text NOT NULL,
  review_trigger_json jsonb NOT NULL DEFAULT '{}',
  expires_at         timestamptz,
  created_by_actor_id uuid NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE understanding_gap (
  understanding_gap_id uuid PRIMARY KEY,
  understanding_state_id uuid NOT NULL REFERENCES understanding_state(understanding_state_id),

  gap_kind           text NOT NULL,
  -- missing_rationale, confusing_control_flow,
  -- unverified_edge_case, unknown_owner,
  -- unclear_runtime_behavior, absent_test,
  -- undocumented_external_contract

  description        text NOT NULL,
  blocking_level     text NOT NULL DEFAULT 'non_blocking',
  -- non_blocking, blocks_current_task,
  -- blocks_enforcement, blocks_ownership,
  -- blocks_migration

  converted_known_unknown_id uuid,
  created_at         timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE understanding_decay_event (
  understanding_decay_event_id uuid PRIMARY KEY,
  understanding_state_id uuid NOT NULL REFERENCES understanding_state(understanding_state_id),

  event_kind         text NOT NULL,
  -- code_changed, test_changed, adr_changed,
  -- runtime_changed, owner_changed, concept_changed,
  -- dependency_changed

  changed_subject_kind text NOT NULL,
  changed_subject_id uuid NOT NULL,
  decay_amount       numeric NOT NULL DEFAULT 0.25,
  reason_text        text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Purpose-Scoped Understanding

Understanding should always name its purpose.

Example:

```text
Subject:
  Billing.InvoiceFinalizer

State:
  sufficient_for_purpose

Purpose:
  review a formatting-only invoice PDF change

Known gaps:
  retry semantics unclear
  tax provider fallback unclear

Accepted ambiguity:
  retry semantics not relevant to the current PR
```

The same person may not be qualified to approve:

```text
refactor invoice finalization
change retry behavior
own incident response
approve a security exception
```

This prevents false equivalence between "has read it" and "can make any decision about it."

---

# 5. Decay Rules

Partial understanding should decay when relevant context changes.

Decay triggers:

```text
touched source spans
changed tests
changed ADRs
new runtime incidents
dependency upgrades
concept drift
ownership transfer
expired ambiguity acceptance
```

Decay does not mean the person forgot everything. It means the stored understanding should not be reused without a freshness check.

---

# 6. Query Behavior

The system should be able to answer:

```text
Who understands this enough to review this PR?
Which parts of this module are still unclear?
What uncertainty did we knowingly accept?
Has this person's understanding gone stale?
Can we proceed with this low-risk change?
What would upgrade this from partial to strong understanding?
```

This connects reading, expertise, governance, and review routing.

---

# 7. Minimal Viable Layer

Start with:

```text
understanding_state
understanding_gap
ambiguity_acceptance
decay on touched source spans
review eligibility query
```

That is enough to stop treating unresolved uncertainty as either ignorance or a hidden risk.

---

# 8. Final Definition

Accepted ambiguity is a scoped, auditable decision to proceed with known uncertainty.

It lets the system represent the actual cognitive posture of engineers: not omniscient, not blocked, but aware of what they do and do not know.

