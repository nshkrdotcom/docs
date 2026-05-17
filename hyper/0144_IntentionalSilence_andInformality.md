# Response 31 - Intentional Silence and Informality

The system models missing evidence, unknowns, stale docs, and gaps. But absence does not always mean failure.

Sometimes a team intentionally leaves something informal:

```text
no ADR because the decision was obvious
no tests because the prototype is disposable
no owner because the code is intentionally shared
no formal contract because the boundary is still forming
```

The system needs to know when silence is a signal.

---

# 1. Core Claim

Intentional informality should be modeled as a first-class architectural state.

The system should distinguish:

```text
missing by accident
missing because not yet analyzed
missing because not worth formalizing
missing because intentionally deferred
missing because deliberately informal
missing because evidence is restricted
missing because it was lost
```

Without this distinction, the product will generate noise and push teams toward unnecessary ceremony.

---

# 2. Silence Objects

| Object | Meaning |
|---|---|
| `absence_signal` | A detected absence that may or may not matter |
| `informality_decision` | A deliberate choice not to formalize something |
| `documentation_nonrequirement` | A scoped statement that documentation is not required |
| `test_nonrequirement` | A scoped statement that tests are not required or not yet justified |
| `informal_boundary` | A boundary that is intentionally conventional rather than formal |
| `absence_review` | A later check of whether the absence is still acceptable |

---

# 3. Suggested Schema

```sql
CREATE TABLE absence_signal (
  absence_signal_id uuid PRIMARY KEY,
  workspace_id      uuid NOT NULL,

  subject_kind      text NOT NULL,
  subject_id        uuid NOT NULL,
  expected_artifact_kind text NOT NULL,
  -- adr, test, owner, commitment, runtime_trace,
  -- doc, contract, dashboard, review

  absence_kind      text NOT NULL,
  -- not_found, not_indexed, intentionally_absent,
  -- deferred, not_required, restricted,
  -- lost, unknown

  severity          text NOT NULL DEFAULT 'unknown',
  evidence_json     jsonb NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  metadata          jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE informality_decision (
  informality_decision_id uuid PRIMARY KEY,
  workspace_id      uuid NOT NULL,

  subject_kind      text NOT NULL,
  subject_id        uuid NOT NULL,
  decision_kind     text NOT NULL,
  -- no_adr_required, no_test_required,
  -- informal_owner_ok, convention_only,
  -- prototype_only, defer_formal_boundary,
  -- no_commitment_pack_yet

  rationale_text    text NOT NULL,
  accepted_risk     text NOT NULL,
  -- none, low, medium, high

  approved_by_actor_id uuid,
  approved_by_body_id uuid,
  valid_until       timestamptz,
  review_trigger_json jsonb NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  metadata          jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE absence_review (
  absence_review_id uuid PRIMARY KEY,
  informality_decision_id uuid REFERENCES informality_decision(informality_decision_id),
  absence_signal_id uuid REFERENCES absence_signal(absence_signal_id),

  review_state      text NOT NULL,
  -- still_acceptable, needs_formalization,
  -- superseded, invalidated, escalated

  review_reason     text,
  reviewed_by_actor_id uuid,
  reviewed_at       timestamptz NOT NULL DEFAULT now(),
  next_review_at    timestamptz
);
```

---

# 4. Absence Classification

Example classifications:

```text
No ADR for a helper function:
  not_required

No ADR for cross-context payment flow:
  missing_by_accident or unknown

No tests for throwaway experiment:
  intentionally_absent until prototype promotion

No owner for shared logging library:
  informal_owner_ok, review on incident or major change

No commitment for new service boundary:
  defer_formal_boundary for 30 days
```

The same absence has different meaning depending on scope, risk, and lifecycle state.

---

# 5. Interaction with Formalization Economics

Intentional silence is not a loophole.

It should carry:

```text
scope
rationale
risk
review trigger
expiry or lifecycle condition
authority
```

The system should ask:

```text
Is this absence cheap informality or hidden debt?
```

If the cost of silence rises, the absence review can convert it into:

```text
known unknown
architecture debt item
formalization proposal
governance review
test request
ADR draft
```

---

# 6. Product Behavior

Bad behavior:

```text
This module has no ADR. Please create one.
```

Better behavior:

```text
No ADR is attached to this boundary.
The boundary is currently marked informal because the integration is in prototype stage.
This decision expires when the feature reaches beta or gains an external API consumer.
```

This makes the system less noisy and more respectful of engineering judgment.

---

# 7. Minimal Viable Layer

Start with:

```text
absence_signal
informality_decision
expiry/review triggers
conversion to debt or known unknown
trust UX badge for intentional informality
```

This lets teams say "we saw this and chose not to formalize it yet" without losing the risk.

---

# 8. Final Definition

Intentional silence is a scoped decision that an expected artifact is not currently required.

It prevents the system from confusing healthy informality with architectural neglect.

