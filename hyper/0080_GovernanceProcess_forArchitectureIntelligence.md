# Response 7 - Governance Process for the Operating Intelligence Kernel

The previous files define a strong operating kernel: beliefs, commitments, actions, queries, benchmarks, and trust UX. The missing piece is that architecture is not only inferred or enforced. It is also **decided**.

The system needs a first-class model for:

```text
who has standing to decide
how a commitment becomes accepted
how exceptions are approved
how disagreements are resolved
how business overrides are recorded
how governance decisions become executable memory
```

Without this, `approved_by`, `approval_required`, and `human correction` are useful fields, but they do not model the process by which architecture becomes legitimate.

---

# 1. Core Claim

Architecture intelligence needs a **governance process layer**.

The system should distinguish:

```text
inferred architecture
proposed architecture
accepted architecture
enforced architecture
disputed architecture
overridden architecture
superseded architecture
```

A commitment should not become authoritative just because the system inferred it or a single user wrote it. It becomes authoritative through a governed process appropriate to the organization.

---

# 2. Governance Objects

The layer needs these primary objects:

| Object | Meaning |
|---|---|
| `governance_body` | A team, review board, role, or working group with decision authority |
| `decision_right` | What a body or role may approve, reject, override, or enforce |
| `architecture_proposal` | A proposed commitment, ADR, exception, policy, or deprecation |
| `review_process` | Required stages, reviewers, quorum, timeouts, and escalation |
| `review_event` | Comment, approval, rejection, request for changes, escalation |
| `governance_verdict` | Accepted, rejected, deferred, overridden, exceptioned, superseded |
| `business_override` | Explicit non-technical decision to accept architectural risk |

This lets the system answer:

```text
Who accepted this rule?
Who can approve this exception?
Why did CI enforce this policy?
Was this drift intentionally accepted or merely unreviewed?
What happens when architecture and product priorities conflict?
```

---

# 3. Suggested Schema

```sql
CREATE TABLE governance_body (
  governance_body_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  body_key           text NOT NULL,
  display_name       text NOT NULL,
  body_kind          text NOT NULL,
  -- architecture_board, security_review, domain_owner,
  -- code_owner_group, product_owner_group, sre_group
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, body_key)
);
```

```sql
CREATE TABLE governance_actor (
  governance_actor_id uuid PRIMARY KEY,
  workspace_id        uuid NOT NULL,
  actor_kind          text NOT NULL,
  -- person, team, role, external_reviewer, service_account
  actor_key           text NOT NULL,
  display_name        text,
  metadata            jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, actor_kind, actor_key)
);
```

```sql
CREATE TABLE governance_membership (
  membership_id       uuid PRIMARY KEY,
  governance_body_id uuid NOT NULL REFERENCES governance_body(governance_body_id),
  governance_actor_id uuid NOT NULL REFERENCES governance_actor(governance_actor_id),
  role               text NOT NULL,
  -- chair, reviewer, approver, observer, delegate
  valid_from         timestamptz,
  valid_to           timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE decision_right (
  decision_right_id   uuid PRIMARY KEY,
  workspace_id        uuid NOT NULL,
  governance_body_id  uuid REFERENCES governance_body(governance_body_id),
  governance_actor_id uuid REFERENCES governance_actor(governance_actor_id),

  right_kind          text NOT NULL,
  -- approve_commitment, reject_commitment, approve_exception,
  -- override_policy, enforce_policy, accept_risk,
  -- deprecate_api, approve_security_change

  subject_selector_json jsonb NOT NULL DEFAULT '{}',
  max_severity        text,
  requires_coapproval boolean NOT NULL DEFAULT false,
  valid_from          timestamptz,
  valid_to            timestamptz,
  metadata            jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE architecture_proposal (
  proposal_id        uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  proposal_kind      text NOT NULL,
  -- new_commitment, commitment_change, exception,
  -- adr_amendment, deprecation, business_override,
  -- ownership_change, policy_pack_change

  title              text NOT NULL,
  body_text          text,
  subject_kind       text,
  subject_id         uuid,
  proposed_by_actor_id uuid REFERENCES governance_actor(governance_actor_id),

  lifecycle_state    text NOT NULL DEFAULT 'draft',
  -- draft, submitted, under_review, changes_requested,
  -- accepted, rejected, deferred, escalated, withdrawn, superseded

  risk_score         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE review_process (
  review_process_id  uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  process_key        text NOT NULL,
  proposal_kind      text NOT NULL,
  required_bodies_json jsonb NOT NULL DEFAULT '[]',
  quorum_json        jsonb NOT NULL DEFAULT '{}',
  escalation_json    jsonb NOT NULL DEFAULT '{}',
  timeout_policy_json jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, process_key)
);
```

```sql
CREATE TABLE review_event (
  review_event_id    uuid PRIMARY KEY,
  proposal_id        uuid NOT NULL REFERENCES architecture_proposal(proposal_id),
  actor_id           uuid REFERENCES governance_actor(governance_actor_id),
  event_kind         text NOT NULL,
  -- submit, approve, reject, request_changes, comment,
  -- escalate, delegate, override, withdraw
  event_text         text,
  event_json         jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE governance_verdict (
  verdict_id         uuid PRIMARY KEY,
  proposal_id        uuid NOT NULL REFERENCES architecture_proposal(proposal_id),
  verdict_kind       text NOT NULL,
  -- accepted, rejected, deferred, overridden,
  -- exception_approved, risk_accepted, superseded
  decided_by_body_id uuid REFERENCES governance_body(governance_body_id),
  decided_by_actor_id uuid REFERENCES governance_actor(governance_actor_id),
  rationale_text     text,
  effective_from     timestamptz,
  effective_to       timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Governance States Become Belief Evidence

Governance outputs should feed the belief calculus as high-authority evidence.

Examples:

```text
accepted commitment
  -> high-authority intent evidence

rejected commitment
  -> do not enforce, but preserve rationale

approved exception
  -> violation becomes exceptioned within scope

business override
  -> violation remains known, but action policy changes

deferred decision
  -> finding remains contested or unknown
```

The system should not treat governance decisions as magic truth. It should treat them as high-authority organizational commitments with explicit scope and time.

---

# 5. Disagreement and Escalation

Architecture governance exists because people disagree.

The model should support:

```text
architect approves, security rejects
domain owner wants exception, platform owner objects
business accepts risk, engineering records technical objection
timeout causes escalation
temporary exception expires
policy ambiguity requires interpretation
```

Suggested dispute states:

```text
under_review
blocked_on_owner
blocked_on_security
policy_ambiguous
business_override_requested
escalated
accepted_risk
rejected_risk
```

These states should appear in Trust UX and Action Model outputs.

---

# 6. Business Overrides

The design must model cases where the technically preferred decision is not chosen.

Example:

```text
Architecture recommendation:
  Do not launch with direct Billing -> Accounts table reads.

Business override:
  Launch is approved for regulatory deadline.
  Exception expires in 30 days.
  Risk accepted by product leadership.
  Follow-up migration task required.
```

This is not the same as saying the architecture is clean. It is:

```text
known violation
accepted risk
time-bound obligation
auditable decision
```

---

# 7. Governance Queries

The query layer should support:

```text
Who can approve this exception?
Which commitments are proposed but not accepted?
Which architecture decisions were business overrides?
Which exceptions expire this month?
Which rules are enforced without an owner?
Which findings are blocked on governance?
What decisions did this review board make last quarter?
```

Example IntentQL:

```yaml
query: governance
select:
  proposals:
    lifecycle_state: under_review
    severity: critical
output:
  group_by: required_governance_body
  include:
    - blocked_since
    - required_decision_right
    - affected_commitments
```

---

# 8. Minimal Viable Governance Layer

For the first PR Architecture Reviewer wedge, implement only:

```text
1. governance actors and bodies
2. decision rights for exceptions and policy enforcement
3. proposal workflow for:
   - commitment promotion
   - ADR amendment
   - scoped exception
4. verdicts that feed the belief engine
5. audit trail for CI enforcement
```

That is enough to answer:

```text
Why did CI block this?
Who can approve an exception?
Was this drift intentionally accepted?
Is this rule enforced or only proposed?
```

---

# 9. Final Definition

The Governance Process Layer is:

> A model of how architectural authority is assigned, exercised, disputed, overridden, and recorded, so that commitments, exceptions, ADR amendments, and enforcement behavior become legitimate organizational decisions rather than inferred database facts.

It closes the gap between:

```text
the system found architecture intent
```

and:

```text
the organization accepted this as architecture.
```

