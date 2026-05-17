# Response 3 — Action Model for the Operating Intelligence Kernel

The next missing piece is the **Action Model**.

The previous pieces define:

```text
Belief Calculus:
  What does the system believe, why, and with what current state?

Commitment DSL:
  What should be true, how should it be evaluated, and what counts as violation or compliance?
```

But a serious architecture intelligence system also needs to decide:

```text
What should the system do about what it knows?
```

The original schema correctly frames the UI as a read-side navigator over precomputed projections: AST parsing, LLM annotation, dimensional slices, materialized projections, navigation indexes, and knob-driven lookup rather than realtime inference.  The Action Model sits above that substrate. It decides when the system reports, warns, blocks, drafts, generates, asks approval, or applies changes.

---

# 1. Core Claim

The system should not jump directly from:

```text
detected problem
```

to:

```text
agent changes code
```

That would be too unsafe.

Instead, it needs a graduated action ladder:

```text
observe
  → explain
    → suggest
      → draft
        → generate
          → stage
            → request approval
              → execute
                → verify
                  → remember
```

The novelty is not that the system can generate a patch. The novelty is that every action is grounded in:

```text
belief state
commitment state
evidence
scope
risk
authority
expected effect
approval policy
verification result
audit trail
```

That is the difference between an architecture-aware assistant and a generic coding agent.

---

# 2. The Action Model’s Job

The Action Model answers seven questions:

```text
1. What happened?
2. Does it matter?
3. What kind of action is appropriate?
4. Who is allowed to approve or perform that action?
5. What evidence justifies it?
6. What must be verified afterward?
7. What should be remembered for future reasoning?
```

Example:

```text
Event:
  PR changes password reset token expiry from 15 minutes to 60 minutes.

Belief result:
  Architecture drift.

Commitment result:
  Security commitment violated.

Action result:
  Block CI unless one of these occurs:
    - code is restored
    - security requirement is updated
    - ADR amendment is approved
    - explicit time-limited exception is granted
```

This is not merely “flag a warning.” It is an operational protocol.

---

# 3. Action Levels

The system needs explicit action levels.

| Level | Name                 | System Behavior                                        |
| ----: | -------------------- | ------------------------------------------------------ |
|     0 | **Observe**          | Record evidence, update beliefs, no user-facing action |
|     1 | **Surface**          | Show in UI projection or dashboard                     |
|     2 | **Explain**          | Produce rationale, evidence, and uncertainty           |
|     3 | **Recommend**        | Suggest likely next steps                              |
|     4 | **Draft**            | Draft ADR update, test, policy exception, or patch     |
|     5 | **Stage**            | Prepare a concrete change but do not submit/apply      |
|     6 | **Request Approval** | Route to required human authority                      |
|     7 | **Execute**          | Apply approved action, create PR/comment/check/test    |
|     8 | **Enforce**          | Fail CI, block merge, require exception                |
|     9 | **Verify**           | Run checks/tests/recompute beliefs                     |
|    10 | **Learn**            | Convert outcome into priors, calibration data, lineage |

The same finding can lead to different action levels depending on confidence and risk.

Example:

```text
Low-confidence possible boundary violation:
  Explain + recommend.

High-confidence new security violation:
  Enforce + require approval.

Runtime anomaly contradicting design:
  Surface + explain + recommend investigation.

Human-approved intentional architecture change:
  Draft ADR update + request approval.
```

---

# 4. Action Kinds

The system should support a finite but extensible catalog of action kinds.

## Informational actions

```text
report_finding
explain_belief
show_evidence
show_trace_path
summarize_drift
highlight_uncertainty
ask_clarifying_question
```

## Review actions

```text
create_pr_comment
create_ci_check
request_architect_review
request_security_review
request_owner_review
mark_existing_violation
```

## Generation actions

```text
draft_adr_update
draft_requirement_update
draft_policy_exception
generate_test
generate_contract_test
generate_static_check
generate_runtime_monitor
generate_code_patch
generate_migration_plan
```

## Enforcement actions

```text
warn_ci
fail_ci
block_merge
require_exception
require_adr_update
require_test_evidence
require_owner_approval
```

## Learning actions

```text
record_human_verdict
update_inference_prior
calibrate_analyzer
suppress_false_positive_pattern
promote_inferred_commitment
demote_unreliable_claim_type
```

## Maintenance actions

```text
invalidate_stale_claims
refresh_projection_packets
recompute_trace_paths
archive_superseded_claims
mark_commitment_deprecated
```

The product should not treat all actions equally. Each kind needs different authorization and verification.

---

# 5. Action Policy Comes from Multiple Inputs

An action should not be determined by one thing.

It should be a function of:

```text
belief state
commitment severity
evidence strength
claim type
scope
risk
freshness
human authority
CI mode
repository policy
historical false-positive rate
user preference
```

A simple decision rule:

```text
action = policy(
  belief_state,
  commitment_action_policy,
  evidence_profile,
  risk_score,
  scope,
  actor_permissions,
  confidence_calibration
)
```

Example:

```text
belief_state = drifted
commitment_severity = critical
evidence_strength = high
scope = PR changed code
violation_new = true
human_exception = absent

=> fail CI and request architecture/security review
```

Another:

```text
belief_state = contested
commitment_severity = warning
evidence_strength = medium
runtime_data = incomplete

=> create PR warning, ask targeted clarification, do not fail CI
```

---

# 6. Action Contract

Every nontrivial action should be represented by an **Action Contract**.

An Action Contract defines:

```text
what the system proposes to do
why
what evidence supports it
what authority is required
what risks exist
what verification must pass
what happens afterward
```

Canonical structure:

```yaml
action:
  kind: generate_test
  title: "Generate test for password reset non-enumeration behavior"

trigger:
  belief_state: unverified
  commitment: password_reset_must_not_reveal_email_existence
  evidence:
    - accepted_security_requirement
    - implementation_candidate_found
    - no_test_found_with_search_completeness_0_94

scope:
  repo: commerce-core
  otp_app: accounts
  files:
    - test/accounts/password_reset_test.exs

preconditions:
  - source_index_fresh
  - test_index_completeness_above_0_90
  - no_existing_equivalent_test

proposed_effect:
  - add ExUnit test comparing existing and non-existing email reset responses

risk:
  level: low
  reason: "test-only change"

approval:
  required_from:
    - code_owner

verification:
  - run_test_file
  - recompute_verification_claim
  - update_requirement_trace

post_action:
  - mark_requirement_verification_state: verified_if_tests_pass
  - record_action_outcome
```

This prevents the system from behaving like an opaque agent.

---

# 7. Action Gating

The system needs hard gates before it can act.

## Gate 1: Confidence

```text
Low-confidence findings cannot trigger destructive actions.
```

Example:

```text
LLM-inferred possible boundary violation:
  May recommend.
  May not fail CI unless confirmed by static evidence or policy.
```

## Gate 2: Evidence Completeness

```text
Absence-based claims require sufficient search completeness.
```

Example:

```text
“No test found” can only trigger unverified state if test search coverage is high enough.
```

## Gate 3: Risk

```text
Higher-risk actions require stronger approval.
```

Example:

```text
Drafting a test: low risk.
Updating an ADR: medium risk.
Changing production code: high risk.
Changing security policy: critical.
```

## Gate 4: Authority

```text
A human correction from a code owner may update ownership.
A security policy exception requires security authority.
An architecture exception requires architecture authority.
```

## Gate 5: Scope

```text
Actions are valid only inside their declared scope.
```

Example:

```text
An exception for one module does not permit all Billing → Accounts table reads.
```

## Gate 6: Reversibility

```text
Irreversible or hard-to-reverse actions require stronger approval.
```

---

# 8. Approval Model

The system needs explicit roles.

```text
PR author
code owner
module owner
service owner
bounded context owner
architect
security reviewer
SRE / operations owner
product owner
admin
```

Different action kinds require different approval.

| Action                      | Typical Approval                |
| --------------------------- | ------------------------------- |
| Add generated unit test     | Code owner                      |
| Draft ADR update            | Architect                       |
| Accept boundary exception   | Architect + owning team         |
| Accept security exception   | Security reviewer               |
| Change requirement priority | Product owner                   |
| Suppress false positive     | Code owner or architect         |
| Enforce new CI rule         | Repo admin / architecture owner |
| Change runtime monitor      | SRE / service owner             |
| Modify production code      | Normal PR approval chain        |

The system should not collapse all human approval into “user said yes.”

Authority matters.

---

# 9. Action Modes

Every repository or workspace should support action modes.

| Mode                  | Behavior                                   |
| --------------------- | ------------------------------------------ |
| `observe_only`        | Record findings, no PR/CI actions          |
| `advisory`            | Show comments and dashboards, never block  |
| `warn_ci`             | CI warnings only                           |
| `fail_new_violations` | Existing issues tolerated, new ones fail   |
| `enforce_all`         | All violations fail                        |
| `draft_only`          | Generate ADR/tests/patches but never apply |
| `approved_execution`  | Execute only after explicit approval       |
| `autofix_low_risk`    | Apply limited low-risk changes             |
| `incident_mode`       | Prioritize runtime drift and risk findings |

This makes adoption practical.

A team can start with:

```text
observe_only
```

then graduate to:

```text
fail_new_violations
```

for high-confidence commitments.

---

# 10. PR Review Behavior

The PR workflow is probably the best first action surface.

## On PR open

```text
1. Identify changed artifacts.
2. Invalidate affected claims.
3. Recompute local beliefs.
4. Evaluate commitments.
5. Classify findings.
6. Determine action level.
7. Produce PR comments/checks.
8. Suggest fixes or required approvals.
```

## PR finding types

```text
architecture_drift
new_boundary_violation
security_commitment_violation
requirement_no_longer_implemented
test_evidence_removed
new_unverified_behavior
deprecated_api_new_consumer
runtime_assumption_invalidated
ownership_conflict
```

## PR comment should include

```text
summary
belief state
commitment violated
evidence
changed source span
upstream requirement/ADR
impact classification
resolution options
approval requirements
```

Example:

```text
Architecture drift detected: password reset token expiry

This PR changes Accounts.Token.verify_reset_token/1 from 900 seconds to 3600 seconds.

Why this matters:
  SEC-014 and ADR-008 currently commit this system to 15-minute reset token expiry.

Evidence:
  Changed code span: lib/accounts/token.ex:44
  Requirement: SEC-014
  ADR: ADR-008
  Test affected: test/accounts/password_reset_test.exs

Resolution required:
  - restore max_age: 900, or
  - update SEC-014 and ADR-008 with security approval, and update tests.

CI behavior:
  Failing because this is a new high-confidence security architecture drift.
```

That is the action model in practice.

---

# 11. CI Behavior

CI should not simply be pass/fail.

It should produce structured check results.

```text
passed
warned
failed
unknown
needs_approval
exception_expired
existing_violation
new_violation
```

## CI decision matrix

| Finding                         | Existing? | Confidence | Severity | Action                  |
| ------------------------------- | --------: | ---------: | -------: | ----------------------- |
| Boundary violation              |        No |       High |    Error | Fail                    |
| Boundary violation              |       Yes |       High |    Error | Warn                    |
| Possible violation              |        No |     Medium |  Warning | Warn                    |
| Security drift                  |        No |       High | Critical | Fail + require approval |
| Missing test                    |        No |     Medium |  Warning | Warn + suggest test     |
| Expired exception               |       Yes |       High |    Error | Fail                    |
| Unknown due to incomplete index |       N/A |        Low |      Any | Warn or skip            |

CI should avoid punishing teams for the entire historical backlog on day one.

The default adoption-friendly policy:

```text
fail new high-confidence violations
warn existing violations
warn unknowns
```

---

# 12. Suggested Patches

The system may generate patches, but only under controlled conditions.

## Patch categories

| Patch Type                                   | Risk          |
| -------------------------------------------- | ------------- |
| Add test                                     | Low to medium |
| Add documentation link                       | Low           |
| Draft ADR amendment                          | Low           |
| Add telemetry assertion                      | Medium        |
| Replace direct call with existing public API | Medium        |
| Move function across modules                 | High          |
| Change runtime behavior                      | High          |
| Change security policy                       | Critical      |
| Change data ownership                        | Critical      |

Patch generation should require an Action Contract.

For example:

```text
Allowed automatically:
  draft test file
  draft ADR update
  draft policy exception

Requires approval:
  source code behavior change
  dependency change
  config change
  runtime monitor change

Never automatic by default:
  security weakening
  data deletion
  ownership change
  production config mutation
```

---

# 13. Generated Tests

Test generation is one of the safest and most valuable action types.

The system can generate tests when:

```text
accepted commitment exists
implementation candidate exists
verification evidence missing
test search completeness high
test fixture strategy known
risk acceptable
```

Example:

```text
Requirement:
  Password reset must not reveal whether email exists.

Implementation candidates:
  Accounts.request_password_reset/1
  PasswordResetController.create/2

Generated test:
  Compare response shape, status code, and observable behavior for:
    - existing email
    - non-existing email

Expected result:
  Same user-facing response.
```

The generated test should be presented as:

```text
proposed test
why it exists
what requirement it verifies
what code it exercises
what evidence state it will update if passing
```

After the test is added and passes:

```text
requirement verification state can move from unverified to verified
```

This is a powerful closed loop.

---

# 14. Generated ADR Updates

When code intentionally diverges from architecture, the system should not silently normalize reality.

It should propose an ADR update.

## ADR update action

```text
Trigger:
  accepted decision contradicted by code change

Action:
  draft ADR amendment

Requires:
  architect approval
  possibly security/product approval

Postcondition:
  if accepted, old commitment becomes superseded
  new commitment becomes accepted
  downstream tests and docs become must_revalidate
```

Example output:

```markdown
# ADR-008 Amendment: Password Reset Token Expiry

## Proposed Change

Increase password reset token expiry from 15 minutes to 60 minutes.

## Reason This Amendment Is Required

The current PR changes `Accounts.Token.verify_reset_token/1` to use `max_age: 3600`, which contradicts the existing accepted decision.

## Required Rationale

Document why the increased account-takeover window is acceptable.

## Affected Artifacts

- SEC-014
- password reset expiry tests
- support documentation
- telemetry interpretation
- abuse-rate monitoring

## Approval Required

Security reviewer and architecture owner.
```

The action model should clearly separate:

```text
drafted
approved
applied
verified
```

---

# 15. Policy Exception Actions

Exceptions should be explicit, scoped, and expiring.

When a PR violates a boundary, the system may offer:

```text
add temporary exception
```

But the exception draft must include:

```text
source artifact
target artifact
violated commitment
reason
expiration
approver
follow-up work
blast radius
CI behavior
```

Example:

```yaml
exception:
  id: reporting_legacy_billing_read
  commitment: reporting_must_not_read_billing_tables
  source: Reporting.LegacyInvoiceExport
  target: billing.invoices
  reason: "Temporary migration until invoice projection is available"
  expires_on: "2026-08-01"
  required_followup:
    - "Implement Billing.InvoiceExported event"
    - "Move report to projection table"
  approval_required:
    - architecture_owner
    - billing_owner
```

An exception should create future obligations, not just suppress a warning.

---

# 16. Runtime Actions

Runtime-to-intent feedback needs actions too.

Runtime finding:

```text
Designed-rare path is hot in production.
```

Possible actions:

```text
raise risk score
surface drift report
recommend performance requirement
generate telemetry dashboard note
request owner review
suggest load test
suggest architecture decision update
```

Runtime finding:

```text
A supposedly async path synchronously calls external email provider.
```

Possible actions:

```text
create incident-style finding
link traces to code path
flag runtime/design mismatch
suggest config review
generate test to prevent synchronous path
request SRE/service owner review
```

Runtime evidence usually should not directly change code. It should trigger review, verification, and design updates.

---

# 17. Human Clarification Actions

Sometimes the right action is not to generate or block. It is to ask a targeted question.

The system should ask questions when:

```text
two high-impact interpretations are plausible
human labeling would greatly reduce uncertainty
action risk is high
evidence conflict cannot be resolved automatically
```

Bad question:

```text
Is this okay?
```

Good question:

```text
Should `Billing.Legacy.Export` be treated as an approved exception to the Billing → Accounts data boundary until the migration is complete?

If yes, I will draft a scoped exception expiring in 90 days.
If no, I will classify this PR as a new boundary violation.
```

Another:

```text
I found three modules that determine whether this is Shared Kernel or Billing-owned.
Labeling one of them will resolve most of the policy ambiguity:
  - Shared.UserRef
  - Billing.UserSnapshot
  - Accounts.PublicUser
```

Clarification should be high-leverage and minimal.

---

# 18. Learning from Actions

Every action outcome should feed the system.

## Examples

| Outcome                         | Learning                                           |
| ------------------------------- | -------------------------------------------------- |
| Human accepts violation as real | Increase confidence in detector                    |
| Human marks false positive      | Update selector, prior, or analyzer calibration    |
| Generated test accepted         | Strengthen commitment-to-test pattern              |
| ADR update rejected             | Preserve original commitment, classify PR as drift |
| Exception approved              | Suppress only within scoped exception              |
| CI failure overridden           | Record authority and rationale                     |
| Patch rejected                  | Penalize patch strategy                            |
| Runtime alert confirmed         | Increase runtime feedback weight                   |

The system should not repeat the same bad recommendation forever.

---

# 19. Action Audit Trail

Every action should be auditable.

Audit record should include:

```text
trigger event
belief state before action
evidence used
commitment involved
action recommended
action taken
actor
approval chain
result
verification result
belief state after action
```

This is necessary because the system will influence architecture decisions.

An audit trail allows the organization to ask:

```text
Why did CI block this PR?
Who approved this exception?
Why did the system update this commitment?
What evidence caused this ADR draft?
Did the generated test actually verify the requirement?
```

---

# 20. Action Safety Rules

The action engine needs hard safety boundaries.

## Never silently weaken commitments

If code weakens a security or architecture commitment, the system must not simply update the architecture to match code.

It should say:

```text
implementation contradicts accepted architecture
```

not:

```text
architecture changed
```

## Never treat generated text as approved truth

Generated ADRs, requirements, and exceptions are drafts until approved.

## Never globally apply local exceptions

An exception for one module does not change the rule for all modules.

## Never block on low-confidence LLM-only evidence

Blocking actions require high-authority evidence.

## Never hide uncertainty in enforcement

If CI fails, the user must see exact evidence and why the system is confident enough to enforce.

## Never auto-modify high-risk code by default

High-risk code changes require explicit approval and normal review.

---

# 21. Action Model as State Machine

Each action should move through a state machine:

```text
candidate
  → proposed
    → drafted
      → awaiting_approval
        → approved
          → executed
            → verified
              → learned
```

Alternative terminal states:

```text
rejected
cancelled
expired
failed_verification
superseded
converted_to_exception
```

Example:

```text
candidate:
  Missing test for security requirement found.

proposed:
  System recommends generating ExUnit test.

drafted:
  Test file patch generated.

awaiting_approval:
  Code owner review needed.

approved:
  Maintainer accepts generated test.

executed:
  PR patch applied.

verified:
  Test passes and trace link updates.

learned:
  System records successful generated test pattern.
```

This is a clean agentic workflow without uncontrolled autonomy.

---

# 22. Relationship to Projections

The Action Model should feed the UI projections.

A projection should show not only:

```text
what exists
```

but also:

```text
what needs action
```

Projection panels can include:

```text
Current belief state
Open actions
Suggested actions
Blocked actions
Required approvals
Draft patches
CI status
Runtime feedback
Historical actions
```

Example projection for a commitment:

```text
Commitment:
  Billing must not read Accounts-owned tables.

Current state:
  violated

Open actions:
  - Remove direct read in Billing.Legacy.Export
  - Or approve scoped exception expiring 2026-09-01

CI behavior:
  New violations fail.
  Existing exception warns until expiry.

Evidence:
  2 source spans
  1 data access edge
  1 expired exception candidate
```

The UI becomes an operational surface, not just a browser.

---

# 23. First Adoption Wedge: PR Architecture Reviewer

The Action Model strongly suggests the first product wedge:

```text
PR Architecture Reviewer for Elixir umbrellas and multi-repo systems.
```

It would support:

```text
boundary rules
dependency direction rules
data ownership rules
public API surface rules
security verification rules
deprecated API rules
```

## Workflow

```text
1. User defines or accepts commitment pack.
2. System runs in observe-only mode for baseline.
3. Existing violations are classified and optionally exceptioned.
4. PR reviewer activates in fail-new-violations mode.
5. New PRs get architecture-aware comments and CI checks.
6. System suggests tests, ADR updates, or exceptions.
7. Human decisions feed learning priors.
```

This is narrow enough to build but broad enough to prove the thesis.

---

# 24. Example End-to-End Action Scenario

## Commitment

```text
Phoenix controllers must not call Repo directly.
```

## PR change

```elixir
def create(conn, params) do
  changeset = User.changeset(%User{}, params)
  {:ok, user} = MyApp.Repo.insert(changeset)
  json(conn, user)
end
```

## Detection

```text
Static call graph:
  MyAppWeb.UserController.create/2 → MyApp.Repo.insert/1

Commitment:
  web_no_repo

Belief:
  verified violation

Scope:
  new PR change
```

## Action

```text
CI:
  fail new violation

PR comment:
  Controller calls Repo directly.
  Architecture says controllers should call context modules.

Suggested patch:
  Move persistence into Accounts.create_user/1.
  Controller should call Accounts.create_user(params).

Generated test suggestion:
  Add controller test that verifies request behavior.
  Add context test for Accounts.create_user/1.

Required resolution:
  - accept suggested refactor, or
  - request architecture exception.
```

## After maintainer accepts patch

```text
Verification:
  Repo call removed from controller.
  Context function added.
  Tests pass.
  Commitment state becomes verified.
  Action outcome recorded as accepted.
```

This is exactly the kind of workflow that differentiates the product.

---

# 25. What This Adds

The Action Model gives the system a working answer to:

```text
When do we merely report?
When do we warn?
When do we fail CI?
When do we generate tests?
When do we draft ADR updates?
When do we suggest patches?
When do we require approval?
When do we learn from human response?
```

It turns the operating intelligence kernel from passive analysis into controlled engineering behavior.

---

# 26. Final Definition

The Action Model is:

> A risk-aware, evidence-gated operating protocol that converts belief states and architecture commitments into reports, explanations, PR comments, CI checks, generated tests, ADR drafts, scoped exceptions, suggested patches, approval workflows, verification steps, and durable learning signals.

It is the bridge from:

```text
the system knows something
```

to:

```text
the system behaves usefully and safely because of what it knows
```

The next gap to fill is the **Query Language**: a declarative way for humans and tools to ask questions like “why does this function exist?”, “what does this PR affect?”, “where is intended architecture drifting from runtime behavior?”, and “what must change if this requirement changes?”
