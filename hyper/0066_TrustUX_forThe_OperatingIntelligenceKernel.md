# Response 6 — Trust UX for the Operating Intelligence Kernel

The next missing piece is **Trust UX**.

The system now has:

```text
Representation Substrate
  ASTs, entities, dimensions, relation graphs, semantic clusters, materialized projections.

Belief Calculus
  verified, stale, contested, drifted, refuted, unimplemented, unverified.

Commitment DSL
  semi-formal architecture commitments that compile into checks.

Action Model
  report, warn, fail CI, draft ADRs, generate tests, suggest patches, request approval.

Query Language
  rationale, realization, impact, drift, violation, compression, action queries.

Evaluation Harness
  benchmarks for trace accuracy, belief states, drift detection, action quality, compression, latency.
```

The original substrate is already designed as a pre-materialized hyperdimensional index over AST-anchored entities, where the UI is a read-side navigator over precomputed projections rather than live inference. 

But the system still needs a way to show all this intelligence without creating either:

```text
false authority
```

or:

```text
cognitive overload
```

That is the role of Trust UX.

---

# 1. Core Claim

Trust UX is not a visual polish layer.

It is the interface by which the system exposes:

```text
what it believes
why it believes it
how certain it is
what evidence supports it
what contradicts it
what scope it applies to
what changed recently
what action is recommended
what the user can safely do next
```

For this product, trust is not achieved by making answers sound confident.

Trust is achieved by making the system’s reasoning **inspectable, scoped, contestable, and operationally safe**.

The UX should make it easy for a user to distinguish:

```text
verified fact
current implementation behavior
intended architecture
LLM inference
runtime observation
human-approved exception
stale documentation
contested evidence
```

If those distinctions collapse, the system becomes dangerous.

---

# 2. The Trust UX Problem

A normal AI code tool often gives output like:

```text
This function validates password reset tokens and enforces a 15-minute expiration.
```

That may be useful, but it hides critical questions:

```text
Is that from code, docs, tests, or an LLM guess?
Is it true in the current branch?
Is it true in production?
Is it intended architecture or actual behavior?
Is the test still valid?
Has runtime behavior confirmed it?
Is there contradictory evidence?
Did this become stale after a PR?
```

A trust-oriented system should instead be able to say:

```text
Current belief:
  Drifted.

Intended architecture:
  15-minute reset token expiry.

Current implementation:
  60-minute reset token expiry.

Evidence:
  SEC-014 and ADR-008 still specify 15 minutes.
  Current code now uses max_age: 3600.
  Existing expiry test still expects 900 seconds.

Recommended action:
  Restore max_age: 900, or update the requirement, ADR, tests, and security approval.
```

That is not just more detail. It is a different epistemic posture.

---

# 3. Trust UX Design Principle

Every user-facing claim should carry a visible trust contract.

A **trust contract** answers:

```text
Claim:
  What is being asserted?

State:
  verified, believed, inferred, stale, contested, drifted, refuted, unknown, exceptioned.

Scope:
  Where and when does this apply?

Basis:
  Which evidence classes support it?

Conflict:
  Is there contradicting evidence?

Freshness:
  Has the supporting evidence changed?

Action:
  What should the user do, if anything?

Inspectability:
  Can the user drill into exact evidence?
```

The UI does not need to show all details at once. But every claim should be expandable into this structure.

---

# 4. Belief Badge Grammar

The system needs a small visual/textual grammar for belief states.

The badges should be consistent everywhere:

```text
Verified
Believed
Inferred
Unverified
Unimplemented
Stale
Contested
Drifted
Refuted
Exceptioned
Scope Split
Unknown
```

Each badge should mean something precise.

| Badge             | Meaning                                                 | UX Behavior                                 |
| ----------------- | ------------------------------------------------------- | ------------------------------------------- |
| **Verified**      | Strong direct evidence supports the claim               | Default visible, low warning                |
| **Believed**      | Good evidence, not fully verified                       | Show basis on hover/expand                  |
| **Inferred**      | Plausible, weaker evidence                              | Mark as inference, avoid authoritative tone |
| **Unverified**    | Implementation exists but test/runtime evidence missing | Show as action opportunity                  |
| **Unimplemented** | Requirement/commitment lacks implementation             | Show as gap                                 |
| **Stale**         | Evidence depended on changed artifacts                  | Show freshness warning                      |
| **Contested**     | Strong support and strong contradiction                 | Show split evidence panel                   |
| **Drifted**       | Intended architecture and actual behavior diverge       | Show intended vs actual                     |
| **Refuted**       | Strong evidence contradicts claim                       | De-emphasize or mark as false               |
| **Exceptioned**   | Violation exists but approved exception applies         | Show exception scope and expiry             |
| **Scope Split**   | True in one scope, false in another                     | Show environment/snapshot split             |
| **Unknown**       | Insufficient evidence                                   | Do not imply absence or compliance          |

These states should be operationally meaningful, not decorative.

---

# 5. Never Show a Naked Confidence Number

A raw confidence score like this is bad UX:

```text
Confidence: 0.73
```

It invites false precision.

Instead show a structured confidence explanation:

```text
Confidence: Medium-high

Why:
  Strong current code evidence.
  Strong ADR evidence.
  Test evidence is stale.
  Runtime evidence unavailable.

Main uncertainty:
  Dynamic code path may bypass this function.
```

The system can still store numeric confidence internally, but the user should usually see:

```text
confidence class
evidence basis
uncertainty reason
scope
```

Example:

```text
Belief: Believed
Basis: current code + accepted ADR
Missing: runtime confirmation
Uncertainty: macro-generated call path not fully resolved
```

That is more useful than `0.73`.

---

# 6. Claim Card Pattern

Every important claim can be rendered as a **Claim Card**.

```text
┌───────────────────────────────────────────────
│ Claim
│ Password reset tokens expire after 15 minutes.
│
│ State
│ Drifted
│
│ Intended
│ SEC-014 and ADR-008 specify 15 minutes.
│
│ Actual
│ Current code uses max_age: 3600.
│
│ Evidence
│ 2 supporting intent sources
│ 1 contradicting code source
│ 1 affected test
│
│ Scope
│ main branch, Accounts app, current PR
│
│ Action
│ Restore code or update architecture decision.
└───────────────────────────────────────────────
```

The compact card gives enough context. Expansion reveals exact source spans, trace paths, and belief calculus details.

This pattern should appear in:

```text
PR review
architecture drift views
requirement realization views
function rationale views
query answers
projection panels
CI output
```

Consistency is critical.

---

# 7. Evidence Ladder

The user should be able to drill down from summary to exact evidence.

A good evidence ladder has levels:

```text
Level 0:
  Claim summary.

Level 1:
  Evidence classes.
  “Supported by requirement, ADR, code, test.”

Level 2:
  Specific artifacts.
  “SEC-014, ADR-008, Accounts.Token.verify_reset_token/1.”

Level 3:
  Exact source spans.
  “lib/accounts/token.ex:44, max_age: 3600.”

Level 4:
  Raw artifact.
  Original doc paragraph, code snippet, trace span, test assertion.

Level 5:
  Reasoning trace.
  Why this evidence supports or contradicts the claim.
```

The user should never be forced to accept:

```text
The model says so.
```

They should always be able to inspect:

```text
Here is the exact evidence.
Here is why it was interpreted this way.
```

---

# 8. Intended vs Actual Split

A major trust pattern is separating:

```text
intended architecture
```

from:

```text
actual implementation
```

and from:

```text
observed runtime behavior
```

Many tools blur these.

This system should visibly separate them.

Example:

```text
Password Reset Token Expiry

Intended:
  15 minutes
  Source: SEC-014, ADR-008

Implemented:
  60 minutes
  Source: Accounts.Token.verify_reset_token/1

Tested:
  15 minutes
  Source: password_reset_expiry_test

Observed:
  No runtime token expiry observation available

State:
  Drifted
```

This pattern is essential because architecture intelligence often exists precisely where these layers disagree.

---

# 9. Scope Stamp

Every projection, claim, query answer, and action should show a **scope stamp**.

Example:

```text
Scope:
  Workspace: Commerce Platform
  Snapshot: main@abc123
  PR: #1842
  Environment: prod
  Runtime window: last 14 days
  Confidence floor: medium
```

Or compact:

```text
main@abc123 · PR #1842 · prod traces 14d · confidence ≥ medium
```

Why this matters:

```text
A claim may be true in main but false in production.
A runtime path may appear in prod but not test.
A config rule may apply only to release builds.
A PR finding may be new while the same violation exists elsewhere historically.
```

No scope, no trust.

---

# 10. Freshness Indicators

The system must make staleness visible.

Freshness should be shown as:

```text
Fresh
Locally stale
Upstream stale
Downstream stale
Runtime window expired
Historically valid
Needs revalidation
```

Example:

```text
This function summary is stale.

Reason:
  The function body changed after the summary was generated.

Generated:
  2026-05-10

Changed:
  2026-05-17 in PR #1842

Action:
  Recompute summary before relying on it.
```

For architecture docs:

```text
This ADR is accepted but implementation drifted 3 commits ago.
```

For runtime:

```text
Runtime evidence is older than the current deployment.
```

Freshness must not be hidden in metadata. It is central to trust.

---

# 11. Contested Evidence Panel

When evidence conflicts, the UI should not hide or average it away.

It should show a contested panel:

```text
State: Contested

Supporting evidence:
  - Requirement SEC-014 says token expires after 15 minutes.
  - ADR-008 says use max_age: 900.

Contradicting evidence:
  - Current code uses max_age: 3600.

Possible interpretations:
  1. Code is wrong and should be restored.
  2. Architecture changed but docs/tests were not updated.
  3. There is a scoped exception or feature flag not yet modeled.

Recommended next step:
  Require ADR update or code restoration.
```

This avoids the false simplicity of:

```text
Confidence: 0.51
```

Contested evidence should be a first-class experience.

---

# 12. Exception Presentation

Exceptions are dangerous if hidden.

A violation with an exception should not disappear. It should become:

```text
Exceptioned violation
```

Example:

```text
Billing.Legacy.Export reads Accounts.users.

General rule:
  Billing must not read Accounts-owned tables.

Exception:
  Approved temporary exception for legacy migration.

Expires:
  2026-09-01

Required follow-up:
  Replace direct read with Accounts public event projection.

CI behavior:
  Warn until expiry, fail after expiry.
```

This lets teams manage real systems without losing architectural discipline.

---

# 13. Unknown Is a Valid Answer

The UX must make “unknown” acceptable.

Bad:

```text
No violations found.
```

when index completeness is low.

Good:

```text
No violations found in indexed code.

However:
  only 64% of test files were indexed,
  dynamic dispatch resolution is incomplete,
  runtime traces were unavailable.

State:
  Unknown compliance, not verified compliance.
```

This is critical. The system should distinguish:

```text
clean
```

from:

```text
not enough evidence to know
```

That distinction is central to trust.

---

# 14. Compression With Guardrails

Semantic compression is one of the novel UI goals, but compression can destroy trust if it hides risk.

The compression engine needs mandatory preservation rules.

A compressed view must not omit:

```text
active contradictions
drifted commitments
critical unverified requirements
high-severity violations
expired exceptions
scope splits
stale evidence that affects the answer
human corrections
low-confidence links that drive major conclusions
redacted evidence indicators
```

A compressed view may omit:

```text
low-salience siblings
unchanged details
redundant supporting evidence
historically superseded facts
low-risk inferred relations
```

So a compressed answer should say:

```text
Showing 7 of 142 related artifacts.
Preserved all high-risk findings, active contradictions, and required actions.
Omitted low-salience implementation details.
```

The user should know the compression policy.

---

# 15. Progressive Disclosure

The UI should not show all evidence at once.

Use progressive disclosure:

```text
Summary
  → Trust state
    → Evidence classes
      → Exact artifacts
        → Source spans
          → Raw trace/reasoning
```

Default view:

```text
This PR creates one new architecture drift finding.
```

Expanded view:

```text
It changes reset token expiry from 15 to 60 minutes.
```

Evidence view:

```text
SEC-014, ADR-008, token.ex:44, expiry_test.exs:18.
```

Reasoning view:

```text
The accepted requirement and ADR still specify 15 minutes;
the current code contradicts that value.
```

This prevents cognitive overload while preserving inspectability.

---

# 16. User-Controlled Epistemic Strictness

Different users need different strictness.

The UI should allow modes like:

```text
Show only verified
Show believed + verified
Show inferred candidates
Show contested and stale
Show everything with confidence
```

Example filters:

```text
Certainty:
  [Verified] [Believed] [Inferred] [Unknown]

Risk:
  [Critical] [High] [Medium] [Low]

State:
  [Drifted] [Unverified] [Unimplemented] [Exceptioned] [Stale]

Evidence:
  [Code] [Tests] [Runtime] [Docs] [Human] [LLM]
```

This maps directly to the knobs concept.

The same architecture can be explored at different epistemic strictness levels.

---

# 17. Action Trust Pattern

Every suggested action should explain:

```text
why this action
why now
what it changes
what approval is required
what verification will happen
what happens if rejected
```

Example action card:

```text
Suggested action:
  Draft ADR amendment.

Why:
  This PR intentionally changes token expiry from 15 to 60 minutes,
  contradicting an accepted security decision.

Approval required:
  Security reviewer + architecture owner.

Verification required:
  Update expiry tests.
  Recompute SEC-014 realization state.

Risk:
  High, because this weakens a security commitment.
```

This is very different from:

```text
Would you like me to update the ADR?
```

The system should not propose actions without showing the action contract.

---

# 18. CI Trust UX

CI output must be especially precise.

A CI failure should never feel mysterious.

Bad CI message:

```text
Architecture policy failed.
```

Good CI message:

```text
Failed: New architecture drift detected.

Commitment:
  Password reset tokens expire within 15 minutes.

Changed code:
  lib/accounts/token.ex:44
  max_age changed from 900 to 3600.

Why this fails:
  SEC-014 and ADR-008 still require 15-minute expiry.
  No approved exception or ADR update was included.

Resolution:
  1. Restore max_age: 900, or
  2. Add approved ADR amendment and update tests.

Evidence:
  SEC-014
  ADR-008
  password_reset_expiry_test.exs
```

CI should also distinguish:

```text
new violation
existing violation
expired exception
unknown due to incomplete analysis
warning only
```

This reduces frustration and improves adoption.

---

# 19. PR Review Trust UX

PR review should minimize noise.

A PR comment should appear only when it is:

```text
high-confidence
relevant to changed artifacts
actionable
evidence-backed
properly scoped
```

PR comment structure:

```text
Finding:
  What changed?

Why it matters:
  Which commitment, requirement, or architecture decision is implicated?

Evidence:
  Exact source span and upstream artifact.

State:
  drifted / violated / unverified / stale.

Action:
  Required or suggested resolution.

Confidence:
  Why the system is confident enough to comment.
```

For low-confidence findings, use grouped advisory summaries rather than noisy inline comments.

Example:

```text
Possible architecture concern, not blocking:
  This call may cross the Billing → Accounts internal boundary,
  but target resolution is incomplete because the call is macro-generated.
```

That is trust-preserving behavior.

---

# 20. Query Answer Trust UX

Query answers should show the compiled interpretation.

If the user asks:

```text
Does Billing depend on Accounts?
```

The answer should say:

```text
Interpreted as:
  direct source-level dependencies from Billing to Accounts
  in current main snapshot,
  excluding tests,
  including public and internal calls.

Answer:
  Yes, Billing calls Accounts public API 14 times and Accounts internal modules 2 times.

Architecture state:
  public API calls are allowed.
  internal calls are violations unless exceptioned.
```

The system should let the user adjust:

```text
Include runtime?
Include transitive?
Include tests?
Only internals?
Current PR or production?
```

Trust improves when users see how their question was interpreted.

---

# 21. Source-Spanning Answers

For code-level trust, source spans matter.

A claim like:

```text
This function implements SEC-014.
```

should link to exact spans:

```text
Implementation evidence:
  lib/accounts/token.ex:41-48
  max_age: 900

Verification evidence:
  test/accounts/token_test.exs:21-39
  expired token rejected

Upstream evidence:
  docs/security/password_reset.md:12-16
  ADR-008: section "Token expiration"
```

The UX should prefer exact spans over vague file references.

---

# 22. Redaction-Aware Trust

The system will ingest sensitive code, configs, traces, and docs.

If evidence is hidden due to access control, the UI must show that.

Example:

```text
This claim has 4 evidence items.
2 visible to you.
2 hidden by access policy.

Visible basis:
  public ADR
  current code span

Hidden basis:
  restricted production trace
  restricted security review note
```

Do not pretend restricted evidence does not exist.

But also do not leak details.

Possible states:

```text
evidence_hidden
evidence_partially_redacted
claim_visible_but_evidence_restricted
action_requires_higher_access
```

Trust UX must work under permissions.

---

# 23. Model-Origin Disclosure

The user should know when content is generated.

Labels should distinguish:

```text
Static analyzer
LLM-generated
Human-confirmed
Runtime-observed
Test-derived
Doc-derived
Policy-derived
```

Example:

```text
Summary:
  LLM-generated, based on current code and ADR.

State:
  Believed.

Evidence:
  Code span and ADR support this summary.

Human review:
  Not reviewed.
```

This avoids false authority from polished generated prose.

---

# 24. Human Correction UX

The system should make correction easy and high-leverage.

Correction options:

```text
Mark this claim wrong.
Mark this as verified.
Mark this as stale.
Assign to different bounded context.
Add exception.
Change severity.
Suppress this finding.
Promote inferred commitment.
Demote public API classification.
```

But every correction should ask the right scope question:

```text
Apply this correction to:
  - this artifact only
  - this module
  - this namespace
  - this OTP app
  - this bounded context
  - future snapshots too
```

Example:

```text
You marked Billing.UserSnapshot as Shared Kernel.

Apply this as:
  1. only this module,
  2. all modules matching Shared.*,
  3. all modules with UserSnapshot-like data shape,
  4. all future snapshots?

Recommended:
  this module + future snapshots.
```

Corrections become learning signals, so the UX must capture scope and authority.

---

# 25. Clarification UX

When ambiguity blocks a high-stakes action, ask a targeted clarification.

Bad:

```text
Can you clarify?
```

Good:

```text
I cannot determine whether this is a violation because `Accounts.PublicUser` is classified inconsistently.

Please choose:
  A. It is part of Accounts public API.
  B. It is internal to Accounts.
  C. It is Shared Kernel.
  D. Unknown; do not enforce this rule yet.

This will affect 6 current findings.
```

Clarification should be:

```text
specific
bounded
impact-aware
low-effort
remembered
```

This is how the system learns without annoying users.

---

# 26. Disagreement UX

Humans may disagree with the system or with each other.

The UI should support disagreement states:

```text
system_contested
human_disputed
awaiting_owner_decision
policy_ambiguous
accepted_exception
suppressed_false_positive
```

Example:

```text
Boundary status:
  Disputed.

System inference:
  Billing.Legacy.Export violates Accounts data boundary.

PR author response:
  Claims this is required for migration.

Architecture owner:
  Not yet reviewed.

Current CI behavior:
  Warn, not fail, until owner decision.
```

This is realistic for architecture governance.

---

# 27. Time and History UX

Trust requires time awareness.

A claim should show:

```text
when it became true
when it changed
when evidence was generated
when exception expires
when claim became stale
when drift first appeared
```

Example:

```text
Architecture drift first detected:
  2026-04-12, PR #1719

Still open:
  35 days

Exception:
  none

Affected releases:
  staging, production
```

Historical timeline:

```text
2026-01-10  SEC-014 accepted
2026-01-12  ADR-008 accepted
2026-01-15  implementation added
2026-01-16  tests added
2026-05-17  PR #1842 changed max_age to 3600
2026-05-17  drift detected
```

This makes architecture memory tangible.

---

# 28. Runtime Trust UX

Runtime evidence is especially tricky.

The UI must show:

```text
observation window
environment
sample size
coverage
trace completeness
confidence
what runtime can and cannot prove
```

Example:

```text
Runtime observation:
  Password reset request synchronously calls email provider.

Scope:
  prod, last 14 days, 2,184 traces.

Frequency:
  3.2% of password reset requests.

Why this matters:
  Architecture commitment says email delivery should be async.

Caution:
  Runtime traces prove this path occurred.
  They do not prove it is the only path.
```

This prevents overclaiming from runtime data.

---

# 29. Projection Trust Footer

Every projection packet should have a compact footer:

```text
Projection:
  Billing Drift View

Snapshot:
  main@abc123

Generated:
  2026-05-17 13:42

Evidence freshness:
  code fresh
  docs fresh
  tests partial
  runtime 14d fresh

Compression:
  showing 12 of 184 related artifacts
  preserved active violations and contested claims

Hidden:
  2 restricted runtime traces
```

This footer can be collapsed, but it should exist.

It makes the pre-materialized UI honest about its own construction.

---

# 30. Trust-Preserving Language

The system should use careful wording.

## Avoid

```text
This is definitely wrong.
The architecture is broken.
This function does X.
No tests exist.
The system proves this.
```

## Prefer

```text
Current evidence indicates...
In this snapshot...
No verification evidence was found in indexed tests...
This contradicts the accepted commitment...
This is verified by current code and tests...
This is inferred from naming and dependency patterns...
Runtime traces show this occurred...
```

Language should reflect epistemic state.

The UI should not let polished prose imply certainty that the evidence does not support.

---

# 31. Trust UX for Semantic Compression

When presenting a compressed explanation, include a compression disclosure:

```text
Compressed explanation for:
  senior engineer reviewing PR risk

Included because:
  changed artifact
  high-risk commitment
  active violation
  upstream ADR

Omitted because:
  unchanged sibling modules
  low-risk dependencies
  superseded historical decisions

Not omitted:
  active contradictions
  stale evidence
  expired exceptions
```

Example:

```text
This explanation compresses 312 related artifacts into 9 items.
No active high-severity violations or contested claims were omitted.
```

If a high-risk item was omitted due to space, that is a compression failure.

---

# 32. Trust UX for “Why” Answers

For queries like:

```text
Why does this function exist?
```

The answer should be structured as:

```text
Immediate purpose
  What the function does.

Upstream rationale
  Requirement / decision / commitment.

Current evidence
  Code / test / runtime.

Current state
  verified / inferred / stale / drifted.

Caveats
  Missing or contested evidence.
```

Example:

```text
Accounts.Token.verify_reset_token/1 exists to verify reset tokens before password mutation.

Upstream rationale:
  SEC-014 requires short-lived reset tokens.
  ADR-008 selected signed stateless tokens.

Current state:
  Drifted.

Reason:
  The accepted rationale specifies 15-minute expiry,
  but current code uses 60 minutes.

Caveat:
  No approved ADR amendment was found.
```

This gives both explanation and trust.

---

# 33. Trust UX for “What Must Change?” Answers

Impact answers should show classification rationale.

```text
must_change:
  Accounts.Token.verify_reset_token/1
  Reason: directly implements token expiry value.

must_revalidate:
  password_reset_controller_test
  Reason: covers same flow but does not assert expiry.

must_not_change:
  non-enumeration behavior
  Reason: separate accepted security commitment.

may_change:
  support documentation
  Reason: mentions expiry window, but source text not fully indexed.
```

The classification reason is as important as the classification.

---

# 34. Trust UX Anti-Patterns

Avoid these.

## 1. Single confidence number

Creates false precision.

## 2. Hidden evidence

Creates unverifiable authority.

## 3. Unscoped claims

Creates misleading generality.

## 4. Suppressed contradictions

Creates false simplicity.

## 5. Treating docs as current implementation

Creates architecture hallucination.

## 6. Treating current code as intended architecture

Normalizes drift.

## 7. Treating missing evidence as absence

Creates false negatives.

## 8. Blocking CI without exact evidence

Destroys adoption trust.

## 9. Over-commenting PRs

Turns intelligence into noise.

## 10. Letting LLM prose outrank source evidence

Creates false authority.

These anti-patterns should be part of product QA.

---

# 35. Trust UX Metrics

The evaluation harness should measure trust UX directly.

## Metrics

| Metric                      | Meaning                                          |
| --------------------------- | ------------------------------------------------ |
| Appropriate trust rate      | Users trust correct claims and doubt weak claims |
| Overtrust rate              | Users accept weak/wrong claims                   |
| Undertrust rate             | Users ignore correct high-evidence claims        |
| Evidence inspection success | Users can find supporting evidence               |
| Scope comprehension         | Users understand where claim applies             |
| Action clarity              | Users know what to do next                       |
| Dispute resolution time     | Contested findings get resolved efficiently      |
| False-block frustration     | CI failures perceived as unjustified             |
| Correction quality          | User corrections capture correct scope           |
| Critical omission rate      | Compressed views omit important facts            |

The goal is not maximum trust.

The goal is calibrated trust.

---

# 36. Minimal Trust UX for First Product Wedge

For the first adoption wedge, likely:

```text
PR Architecture Reviewer for Elixir umbrellas
```

the minimum trust UX should include:

```text
1. Finding cards
   Show violation/drift/unverified states.

2. Exact source evidence
   Changed code span + violated commitment.

3. Scope stamp
   PR, snapshot, environment if applicable.

4. New vs existing distinction
   Do not punish old backlog as new violation.

5. Exception display
   Show approved, expired, or missing exception.

6. Resolution options
   Restore code, add ADR update, add exception, add test.

7. Confidence explanation
   Why this is enforceable or only advisory.

8. Review mode
   observe, warn, fail new violations.

9. Feedback controls
   Mark false positive, add exception, approve drift, change scope.

10. Audit link
   Why CI made this decision.
```

That is enough to make the product usable and trusted.

---

# 37. Example PR Trust UX

```text
Finding: New boundary violation

State:
  Verified violation

Commitment:
  Web controllers must not call Repo directly.

Changed code:
  lib/my_app_web/controllers/user_controller.ex:42
  MyApp.Repo.insert(changeset)

Why this matters:
  Controllers should route persistence through context modules.
  Direct Repo calls bypass the Accounts context boundary.

Evidence:
  - changed source span
  - static call edge to MyApp.Repo.insert/1
  - commitment web_no_repo

Scope:
  PR #1842, main@abc123, non-test code

CI behavior:
  Fail new violations.

Resolution:
  Move persistence into Accounts.create_user/1,
  or request scoped architecture exception.

Confidence:
  High.
  Exact static call edge found; no dynamic dispatch involved.
```

This is specific, inspectable, scoped, and actionable.

---

# 38. Example Query Trust UX

User asks:

```text
Why does this function exist?
```

Answer:

```text
Accounts.Token.verify_reset_token/1 exists to enforce reset-token validity before password mutation.

Current state:
  Drifted.

Intended architecture:
  Reset tokens expire after 15 minutes.
  Sources: SEC-014, ADR-008.

Current implementation:
  This function verifies tokens with max_age: 3600.

Verification:
  Existing test still asserts 15-minute expiry.

Interpretation:
  This function still implements token verification,
  but no longer satisfies the accepted expiry commitment.

Recommended action:
  Restore max_age: 900 or update SEC-014, ADR-008, and tests.
```

This is a good trust answer because it separates purpose from compliance.

---

# 39. Example Compression Trust UX

User asks:

```text
Explain Billing architecture only as needed to understand this PR risk.
```

Answer header:

```text
Compressed PR-risk view

Scope:
  PR #1842, Billing bounded context, main@abc123

Compression:
  9 items shown from 214 related artifacts.
  Preserved all active violations, high-risk commitments, and changed artifacts.

Main risk:
  This PR adds a direct read from Billing to Accounts-owned data.

Why it matters:
  Billing is allowed to consume Accounts public API/events,
  but direct reads of Accounts-owned tables are forbidden.

Evidence:
  Changed source span + billing_no_accounts_table_reads commitment.

Omitted:
  unchanged Billing worker modules,
  low-risk Notifications dependency,
  superseded migration exception.
```

The compression disclosure is part of the trust mechanism.

---

# 40. Trust UX as a System Requirement

Trust UX should be specified as product invariants.

## Invariants

```text
Every claim has a belief state.

Every high-impact claim has inspectable evidence.

Every answer has scope.

Every enforcement action has exact evidence.

Every contradiction is preserved or explicitly resolved.

Every exception has scope and expiry.

Every unknown is represented as unknown, not clean.

Every generated artifact is labeled as generated until approved.

Every compressed view preserves high-risk and contested facts.

Every human correction records scope and authority.
```

These invariants should be tested.

---

# 41. Final Definition

Trust UX is:

> The interface discipline that makes the operating intelligence kernel inspectable, scoped, contestable, evidence-backed, uncertainty-aware, and action-safe.

It is the bridge from:

```text
the system reasons internally
```

to:

```text
humans can safely rely on, challenge, correct, and act on that reasoning
```

Without Trust UX, the system risks becoming an impressive but overconfident AI architecture oracle.

With Trust UX, it becomes a collaborative architecture intelligence environment where users can see not only what the system says, but why, where it applies, what could be wrong, and what to do next.

The next gap to fill is **Security and Privacy**: access control, secret redaction, runtime trace privacy, model-context policy, tenant isolation, audit logging, and safe handling of architecture-sensitive information.
