# Response 16 - System Failure Modes and Trust Repair

The design now has belief states, commitment evaluation, action policies, trust UX, evaluation, governance, and collaborative practice. But it still needs a theory of what happens when the system itself is wrong in a consequential way.

The missing layer is:

```text
system failure modes
false enforcement handling
trust repair
enforcement reliability control
post-failure learning
```

This matters because architecture intelligence will affect PRs, CI, reviews, and planning. A false block during a deadline can damage adoption more than several correct findings can repair.

---

# 1. Core Claim

The system must model its own failures as first-class events.

It should not only ask:

```text
Was the architecture claim correct?
```

It should also ask:

```text
Did the system behave appropriately given its uncertainty?
Did it over-enforce?
Did it route the decision to the right people?
Did it damage user trust?
Should this detector be allowed to block again?
What repair action is owed to the affected team?
```

This is different from ordinary evaluation. Evaluation measures correctness. Trust repair manages harm after incorrect or poorly calibrated behavior in real workflows.

---

# 2. Failure Mode Taxonomy

| Failure Mode | Example | Harm |
|---|---|---|
| `false_positive_block` | CI blocks a PR for a non-violation | Lost time, adoption damage |
| `false_negative_miss` | Real security drift is missed | Safety risk |
| `over_enforcement` | Low-confidence LLM-only claim fails CI | Trust loss |
| `under_enforcement` | High-confidence critical drift only warns | Safety loss |
| `wrong_scope` | Test-only violation treated as prod violation | Noise |
| `wrong_owner_route` | Exception approval sent to obsolete owner | Delay |
| `stale_evidence_action` | CI blocks using stale analysis | Trust loss |
| `hidden_uncertainty` | UI implies verified when evidence is weak | False authority |
| `bad_suggested_fix` | Suggested patch violates architecture elsewhere | Engineering churn |
| `repeated_false_positive` | Same detector keeps flagging accepted pattern | Tool avoidance |

The system should classify these explicitly.

---

# 3. Suggested Schema

```sql
CREATE TABLE system_failure_event (
  failure_event_id   uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  failure_kind       text NOT NULL,
  -- false_positive_block, false_negative_miss,
  -- over_enforcement, under_enforcement,
  -- wrong_scope, wrong_owner_route, stale_evidence_action,
  -- hidden_uncertainty, bad_suggested_fix,
  -- repeated_false_positive

  subject_kind       text,
  subject_id         uuid,

  action_id          uuid,
  commitment_id      uuid,
  belief_id          uuid,

  severity           text NOT NULL DEFAULT 'medium',
  impact_json        jsonb NOT NULL DEFAULT '{}',
  reported_by_actor_id uuid,

  state              text NOT NULL DEFAULT 'open',
  -- open, triaged, confirmed, rejected, repaired,
  -- learned, suppressed, superseded

  created_at         timestamptz NOT NULL DEFAULT now(),
  resolved_at        timestamptz
);
```

```sql
CREATE TABLE failure_root_cause (
  root_cause_id      uuid PRIMARY KEY,
  failure_event_id   uuid NOT NULL REFERENCES system_failure_event(failure_event_id),
  root_cause_kind    text NOT NULL,
  -- bad_selector, stale_index, bad_evidence_weight,
  -- incomplete_scope, bad_commitment_dsl,
  -- analyzer_bug, llm_hallucination,
  -- missing_exception, governance_gap,
  -- trust_ux_misleading
  explanation_text   text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE detector_reliability_control (
  detector_control_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  detector_key       text NOT NULL,
  claim_type         text,
  scope_selector_json jsonb NOT NULL DEFAULT '{}',

  current_mode       text NOT NULL,
  -- disabled, observe_only, advisory, warn_ci,
  -- fail_new_high_confidence, enforce

  reliability_state  text NOT NULL,
  -- healthy, degraded, probation, suspended,
  -- retraining_required, human_review_required

  reason             text,
  metrics_json       jsonb NOT NULL DEFAULT '{}',
  effective_from     timestamptz NOT NULL DEFAULT now(),
  effective_to       timestamptz,

  UNIQUE (workspace_id, detector_key, claim_type, effective_from)
);
```

```sql
CREATE TABLE trust_repair_action (
  trust_repair_action_id uuid PRIMARY KEY,
  failure_event_id   uuid NOT NULL REFERENCES system_failure_event(failure_event_id),

  repair_kind        text NOT NULL,
  -- apologize_in_pr, unblock_ci, downgrade_detector,
  -- publish_explanation, reroute_review,
  -- add_exception, fix_selector,
  -- recalibrate_confidence, create_benchmark_case,
  -- compensate_with_fast_path_review

  target_actor_id    uuid,
  action_text        text,
  state              text NOT NULL DEFAULT 'proposed',
  -- proposed, approved, executed, verified, rejected
  verification_json  jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);
```

---

# 4. Failure Events Should Feed the Kernel

A confirmed failure should update:

```text
detector reliability
belief calibration
commitment selector design
action gating thresholds
trust UX wording
benchmark corpus
human correction priors
governance workflow
```

Example:

```text
Failure:
  Controller direct Repo detector blocked a PR.

Reality:
  File was a generated migration test helper under test scope.

Root cause:
  scope selector failed to exclude test support paths.

System response:
  unblock CI
  downgrade detector to warn for test-support paths
  patch commitment selector
  add benchmark fixture
  notify affected PR author with explanation
```

This is not merely "mark false positive." It is operational repair.

---

# 5. Enforcement Reliability Gates

Blocking behavior should depend on recent reliability.

Rules:

```text
If detector false-block rate rises above threshold:
  downgrade from fail to warn.

If scope-related failures repeat:
  require scope review before enforcement.

If LLM-only evidence caused a false block:
  ban LLM-only evidence from blocking for that claim class.

If a detector has no gold benchmark coverage:
  allow advisory mode only.

If a commitment is newly promoted:
  enforce only after probation success.
```

This makes the system self-limiting.

---

# 6. User-Facing Trust Repair

Trust repair should be visible to affected users.

Bad:

```text
False positive fixed.
```

Better:

```text
The CI block on PR #1842 was incorrect.

Cause:
  The rule did not exclude test-support paths.

Action taken:
  CI unblocked.
  Detector downgraded to warning for this path class.
  Commitment selector updated.
  Regression benchmark added.

Future behavior:
  Similar findings will not block until the detector passes the probation suite.
```

This matters because the user's experience of the tool includes how it handles being wrong.

---

# 7. Failure-Aware Action Model

The Action Model should use failure history.

Example:

```text
Finding:
  New boundary violation.

Detector:
  Recently had 3 false positives in generated code.

Action:
  Warn and request confirmation, not fail CI,
  unless exact high-authority evidence excludes generated paths.
```

Action policy should include:

```text
detector reliability state
recent false positive rate
recent false negative rate
benchmark coverage
human dispute rate
successful repair history
```

---

# 8. Benchmarking Failure Recovery

Add evaluation cases for:

```text
false CI block repair
repeated false-positive suppression
detector downgrade after reliability drop
trust UX after wrong finding
human dispute resolution
benchmark creation from production failure
```

Metrics:

```text
time to unblock
time to root cause
repeat false-positive rate
detector downgrade correctness
user trust recovery
repair action completion
benchmark coverage added
```

---

# 9. Minimal Viable Failure Layer

For the PR Architecture Reviewer:

```text
1. false_positive_block event
2. human dispute button
3. root cause classification
4. detector downgrade to warn
5. unblock CI action
6. regression benchmark creation
7. trust repair message in PR
```

That is enough to keep early adoption from collapsing after bad enforcement.

---

# 10. Final Definition

System Failure Modes and Trust Repair is:

> A control layer that detects, classifies, repairs, learns from, and visibly accounts for consequential system mistakes, especially false enforcement and trust-damaging actions.

It closes the gap between:

```text
the system can be evaluated
```

and:

```text
the system can recover when it is wrong in production workflows.
```

