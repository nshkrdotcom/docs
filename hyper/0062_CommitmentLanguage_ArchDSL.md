# Response 2 — Commitment Language / Architecture DSL

The next missing piece is the **Commitment Language**.

The previous belief-calculus layer answers:

```text
What does the system currently believe?
Why does it believe that?
Is the belief stale, verified, contradicted, drifted, or unimplemented?
```

But belief maintenance needs something more precise than prose to evaluate architecture intent. A sentence like:

```text
Billing must not directly read Accounts-owned tables.
```

is understandable to a human, but the system needs to know how to compile that into:

```text
source selector
target selector
forbidden relationship
allowed exceptions
required evidence
severity
scope
CI behavior
PR review behavior
runtime behavior
```

So the second gap-filling component is a **semi-formal Architecture Commitment DSL**.

The existing representation substrate already has code entities, semantic slices, relation graphs, materialized projections, navigation indices, and knob-driven read-side projections. The commitment DSL should compile into that substrate rather than replace it. 

---

# 1. Core Claim

Architecture commitments should not live only as prose.

They should exist in three forms at once:

```text
1. Human prose
   "Billing must not directly read Accounts-owned tables."

2. Structured commitment
   Machine-readable intent with selectors, constraints, exceptions, and evidence rules.

3. Executable checks
   Static analysis, graph queries, CI checks, PR review rules, runtime drift detectors, and tests.
```

The commitment language is the bridge between:

```text
architecture intent
```

and:

```text
enforceable engineering behavior
```

This is where the system becomes more than a graph viewer.

---

# 2. What a Commitment Is

A commitment is an accepted architectural statement that constrains the system.

Examples:

```text
Billing must not directly read Accounts-owned tables.

Only the Notifications app may send email through the external provider.

All cross-context communication from Billing to Accounting must happen through published events.

The Auth context owns password reset tokens.

Phoenix controllers may call context modules but must not call Ecto Repo directly.

Public API modules must not depend on internal modules.

Every accepted security requirement must have at least one verification artifact.

Runtime password reset requests must not synchronously block on email provider latency.

Every externally exposed endpoint must emit telemetry.

All Oban jobs must be idempotent.

No production service may depend on test-only config.
```

A commitment is different from a fact.

A fact says:

```text
This code currently calls that module.
```

A commitment says:

```text
This kind of call is allowed, forbidden, required, or suspicious.
```

The belief engine evaluates whether reality satisfies the commitment.

---

# 3. Commitment Types

The DSL should support several commitment families.

| Commitment Family        | Example                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| **Boundary**             | “Web layer must not call Repo directly.”                               |
| **Ownership**            | “Accounts owns the `users` table.”                                     |
| **Dependency Direction** | “Platform may not depend on domain apps.”                              |
| **Contract**             | “Billing exposes only stable public modules to other apps.”            |
| **Runtime**              | “Password reset email delivery must be async.”                         |
| **Data**                 | “Reporting may read billing projections but not billing write tables.” |
| **Security**             | “Password reset tokens must expire within 15 minutes.”                 |
| **Verification**         | “Every accepted security commitment must have tests.”                  |
| **Observability**        | “Every external call must emit telemetry.”                             |
| **Deployment**           | “These apps must deploy together.”                                     |
| **Deprecation**          | “Deprecated APIs must not gain new consumers.”                         |
| **Exception**            | “This violation is temporarily allowed until date X.”                  |

The language should be generic enough to support all of these, but not so generic that it becomes meaningless.

---

# 4. DSL Design Goals

The commitment language should be:

## Human-readable

A maintainer should be able to read it without learning a full programming language.

## Compilable

Every commitment should compile into one or more executable checks.

## Evidence-aware

A commitment should specify what counts as evidence.

## Scope-aware

Rules should apply to snapshots, environments, repos, apps, contexts, modules, runtime services, or feature-flag states.

## Exception-aware

Real systems need temporary and permanent exceptions.

## Severity-aware

Not every violation should fail CI.

## Action-aware

The rule should specify what happens when it is violated.

## Explainable

Every violation should produce an understandable explanation with exact evidence.

---

# 5. A Possible DSL Shape

The language could be YAML, JSON, EDN, Elixir terms, or a custom textual DSL.

For Elixir users, an Elixir-term-like syntax is attractive because it feels native, but YAML is more portable. I would design the **logical model** first, then allow multiple syntaxes.

Here is a readable YAML form:

```yaml
commitment: billing_must_not_read_accounts_tables
kind: boundary.data_access
status: accepted
severity: error

statement: >
  Billing must not directly read Accounts-owned database tables.
  Billing may consume Accounts public APIs or published events.

scope:
  snapshots: ["main", "production"]
  environments: ["prod", "staging"]
  repos: ["commerce-core"]

source:
  select:
    bounded_context: "Billing"

forbidden:
  relation: "data.reads_from"
  target:
    data_owner: "Accounts"
    data_kind: ["db_table", "ecto_schema"]

allowed:
  - relation: "calls"
    target:
      api_surface:
        owner: "Accounts"
        stability: ["stable", "public"]

  - relation: "subscribes_to"
    target:
      event_owner: "Accounts"
      event_stability: ["published"]

exceptions:
  - id: billing_legacy_report_export
    reason: "Legacy report export migration"
    source:
      module: "Billing.Legacy.ReportExport"
    target:
      data_entity: "accounts.users"
    expires_on: "2026-09-01"
    approved_by: "architecture-review-board"

required_evidence:
  violation:
    - source_span
    - data_access_edge
  compliance:
    - public_api_call
    - event_subscription
    - no_direct_table_read

ci:
  on_violation: fail
  on_exception_expired: fail
  on_unknown: warn

pr_review:
  message_template: "billing_accounts_boundary_violation"
  require_resolution:
    - "remove direct table read"
    - "add approved exception"
    - "route through Accounts public API"
```

This is not just documentation. It is executable architecture intent.

---

# 6. Same Commitment in Compact Form

For frequent rules, the system could support a concise form:

```yaml
forbid Billing -> Accounts:
  relation: data.reads_from
  target_kind: db_table
  except:
    - Billing.Legacy.ReportExport until 2026-09-01
  severity: error
```

The concise form is useful for humans. The expanded form is useful for compilers.

The system should store the expanded canonical form.

---

# 7. Commitment Anatomy

Every commitment should contain these parts:

```text
identity
kind
human statement
scope
source selector
target selector
relation constraint
allow/forbid/require condition
exceptions
evidence requirements
severity
action policy
lifecycle state
provenance
```

## Minimal canonical structure

```json
{
  "id": "billing_must_not_read_accounts_tables",
  "kind": "boundary.data_access",
  "statement": "Billing must not directly read Accounts-owned database tables.",
  "status": "accepted",
  "severity": "error",

  "scope": { "...": "..." },

  "subjects": {
    "source": { "...selector...": "..." },
    "target": { "...selector...": "..." }
  },

  "constraint": {
    "operator": "forbid",
    "relation": "data.reads_from"
  },

  "exceptions": [],

  "evidence_policy": { "...": "..." },

  "action_policy": { "...": "..." }
}
```

---

# 8. Selector Language

The most important part of the DSL is the selector language.

A commitment needs to select things like:

```text
all modules in Billing
all apps owned by Platform
all tables owned by Accounts
all public API surfaces in Auth
all functions tagged as security-sensitive
all runtime services in prod
all dependencies from domain apps to platform apps
all source spans introduced by a PR
```

So selectors must be compositional.

## Selector examples

```yaml
source:
  bounded_context: "Billing"
```

```yaml
source:
  otp_app: ":billing"
```

```yaml
source:
  module_matches: "^Billing\\."
```

```yaml
source:
  architecture_entity:
    kind: "domain"
    name: "Money"
```

```yaml
target:
  data_owner: "Accounts"
  data_kind: "db_table"
```

```yaml
target:
  api_surface:
    owner: "Accounts"
    stability: "public"
```

```yaml
source:
  changed_in_pr: true
```

```yaml
source:
  all:
    - bounded_context: "Billing"
    - code_kind: "function"
    - has_dimension:
        concern: "persistence"
```

```yaml
target:
  any:
    - module_matches: "^Accounts\\.Internal\\."
    - stability: "internal"
```

Selectors should support:

```text
all
any
not
matches
owned_by
tagged_with
changed_in_pr
has_relation
has_dimension
has_belief_state
has_runtime_observation
within_path
within_context
within_repo
within_snapshot
```

---

# 9. Relation Constraints

Most architecture commitments are about relationships.

The DSL should represent constraints over relations:

```text
forbid relation
require relation
allow relation
limit relation
prefer relation
discourage relation
require_indirection
require_verification
require_observability
```

## Examples

### Forbid direct call

```yaml
constraint:
  operator: forbid
  relation: calls
  source:
    bounded_context: "Billing"
  target:
    module_matches: "^Accounts\\.Internal\\."
```

### Require indirection

```yaml
constraint:
  operator: require_indirection
  from:
    bounded_context: "Billing"
  to:
    bounded_context: "Accounts"
  allowed_intermediaries:
    - api_surface:
        owner: "Accounts"
        stability: "public"
    - event:
        owner: "Accounts"
        stability: "published"
```

### Require verification

```yaml
constraint:
  operator: require_verification
  subject:
    commitment_kind: "security"
  verification:
    any:
      - test_kind: "unit"
      - test_kind: "property"
      - test_kind: "contract"
```

### Require telemetry

```yaml
constraint:
  operator: require_relation
  source:
    api_surface:
      externally_visible: true
  relation: emits
  target:
    telemetry_event:
      required: true
```

### Limit dependency direction

```yaml
constraint:
  operator: forbid
  relation: depends_on
  source:
    domain_kind: "platform"
  target:
    domain_kind: "core_domain"
```

---

# 10. Required Operators

The commitment DSL should include at least these operators.

| Operator                | Meaning                                            |
| ----------------------- | -------------------------------------------------- |
| `allow`                 | This relation is permitted                         |
| `forbid`                | This relation is not permitted                     |
| `require`               | This artifact or relation must exist               |
| `require_absence`       | Something must not exist                           |
| `require_indirection`   | A relation may exist only through allowed boundary |
| `limit`                 | Cap quantity, fanout, depth, or frequency          |
| `prefer`                | Soft architectural preference                      |
| `discourage`            | Soft anti-pattern                                  |
| `require_verification`  | A claim/behavior must be tested or observed        |
| `require_observability` | A runtime path must emit telemetry                 |
| `require_documentation` | A public surface must be documented                |
| `deprecate`             | Consumers should not increase                      |
| `freeze`                | No changes without explicit approval               |
| `exception_for`         | Scoped override of another commitment              |

These operators become different compiled checks.

---

# 11. Evidence Policies

A commitment should specify what evidence is required to determine compliance or violation.

Example:

```yaml
required_evidence:
  violation:
    minimum:
      - relation_edge
      - source_span
  compliance:
    any:
      - absence_search:
          relation: data.reads_from
          completeness: 0.95
      - public_api_usage:
          evidence: source_span
  unknown_when:
    - index_completeness_below: 0.80
    - dynamic_dispatch_unresolved: true
```

This prevents overconfident outputs.

Instead of saying:

```text
No violation found.
```

the system can say:

```text
No violation found, but index completeness is only 62%, so compliance is unknown.
```

That matters for trust.

---

# 12. Exception Model

Architecture systems fail if they cannot represent exceptions.

But exceptions must be controlled.

## Exception structure

```yaml
exceptions:
  - id: temporary_reporting_access
    applies_to:
      source:
        module: "Reporting.LegacyInvoiceExport"
      target:
        data_entity: "billing.invoices"
      relation: data.reads_from

    reason: "Legacy migration path before event projection is complete"

    status: approved
    approved_by: "principal-architect"
    created_on: "2026-05-17"
    expires_on: "2026-08-01"

    required_followup:
      - "Create Billing.InvoiceExported event consumer"
      - "Remove direct table read"

    ci:
      on_expired: fail
      before_expiry: warn
```

An exception is not a silent suppression. It is a scoped architectural fact.

The belief engine should classify violations as:

```text
open violation
exceptioned violation
expired exception violation
unknown exception state
```

---

# 13. Commitment Lifecycle

Commitments should not be permanently “on.”

They have lifecycle states:

```text
draft
proposed
accepted
enforced
deprecated
superseded
disabled
experimental
```

Different states imply different behavior.

| State          | Behavior                                |
| -------------- | --------------------------------------- |
| `draft`        | Analyze only, no CI effect              |
| `proposed`     | Show likely violations, gather feedback |
| `accepted`     | Report violations                       |
| `enforced`     | Fail CI according to action policy      |
| `deprecated`   | Warn if new dependencies appear         |
| `superseded`   | Evaluate only for history               |
| `disabled`     | Do not evaluate                         |
| `experimental` | Track precision/recall before enforcing |

This is crucial for adoption.

You do not want the first version of a rule to instantly break every PR.

---

# 14. Action Policy

A commitment should specify what the system does when a rule is violated.

```yaml
action_policy:
  report:
    enabled: true
    audience: ["author", "reviewer", "architect"]

  pr_review:
    enabled: true
    severity: "error"
    require_resolution: true

  ci:
    on_new_violation: fail
    on_existing_violation: warn
    on_exception_expired: fail
    on_unknown: warn

  suggestions:
    generate_patch: false
    generate_test: true
    generate_adr_update: true

  escalation:
    if_unresolved_days: 14
    notify: ["architecture-board"]
```

This separates detection from enforcement.

The same commitment can run in different modes:

```text
observe only
warn
block
suggest
auto-generate tests
require approval
```

---

# 15. Commitment Compilation Pipeline

The commitment DSL should compile into executable artifacts.

```text
Commitment source
  → Parse
    → Normalize selectors
      → Resolve architecture entities
        → Expand into graph queries
          → Generate static checks
            → Generate runtime checks
              → Generate test requirements
                → Generate PR review behavior
                  → Generate projection packets
```

## Compilation targets

| Commitment            | Compiles Into                            |
| --------------------- | ---------------------------------------- |
| Boundary rule         | Graph query over source/target relations |
| Data ownership rule   | Data access checker                      |
| Runtime behavior rule | Runtime trace assertion                  |
| Verification rule     | Test coverage query                      |
| Dependency rule       | Mix/app dependency query                 |
| API stability rule    | Public surface checker                   |
| Security invariant    | Static code check + test requirement     |
| Deprecation rule      | New consumer detector                    |
| Architecture decision | Drift detector                           |
| Observability rule    | Telemetry event checker                  |

This turns prose-level architecture into operational machinery.

---

# 16. Example: Boundary Commitment Compilation

Commitment:

```yaml
commitment: web_must_not_call_repo
kind: boundary.layering
severity: error

source:
  module_matches: ".*Web\\..*Controller$"

forbidden:
  relation: calls
  target:
    module_matches: ".*Repo$"

allowed:
  - target:
      module_matches: ".*Context$"

ci:
  on_new_violation: fail
```

Compiled checks:

```text
1. Select all controller functions.
2. Build call graph from changed functions.
3. Find direct calls to Repo modules.
4. Exclude generated/test-only code if scoped that way.
5. Emit violation if source span exists.
6. In PR mode, only fail on new violations.
```

Violation output:

```text
Architecture violation: Controller calls Repo directly.

Source:
  MyAppWeb.UserController.create/2
  lib/my_app_web/controllers/user_controller.ex:42

Forbidden target:
  MyApp.Repo.insert/1

Commitment:
  Web controllers must call context modules, not Repo directly.

Suggested fix:
  Move persistence call into MyApp.Accounts.create_user/1
  and call that context function from the controller.
```

---

# 17. Example: Runtime Commitment

Commitment:

```yaml
commitment: password_reset_email_must_be_async
kind: runtime.behavior
severity: error

statement: >
  Password reset request handling must not synchronously block on the external email provider.

source:
  capability: "account_recovery"
  scenario: "request_password_reset"

forbidden:
  relation: observed_http_call
  target:
    external_system: "email_provider"
  within_runtime_span:
    operation: "POST /password-reset/request"
    sync: true

required:
  relation: enqueues_job
  target:
    job_kind: "password_reset_email"

runtime:
  observation_window: "14d"
  environments: ["prod", "staging"]

ci:
  on_static_violation: fail
  on_runtime_violation: alert
```

This commitment evaluates both static and runtime evidence.

It can produce:

```text
Static result:
  AccountRecovery.request_password_reset/1 enqueues PasswordResetEmailJob.
  No direct provider call found.

Runtime result:
  Production traces show SMTPProvider.send/2 inside password reset request span in 3.2% of requests.

Belief state:
  contested / runtime_design_mismatch

Action:
  investigate fallback path or misconfigured adapter.
```

This is much more powerful than static rule checking.

---

# 18. Example: Requirement-to-Test Commitment

Commitment:

```yaml
commitment: security_requirements_must_be_verified
kind: verification.coverage
severity: warning

source:
  requirement:
    quality_attribute: "security"
    lifecycle_state: "accepted"

required:
  relation: verified_by
  target:
    any:
      - test_kind: "unit"
      - test_kind: "integration"
      - test_kind: "property"
      - test_kind: "contract"

evidence:
  absence_search_completeness: 0.90

ci:
  on_new_unverified_requirement: warn
  on_security_critical_unverified: fail
```

This allows the system to say:

```text
Accepted security requirement SEC-014 has implementation evidence but no verification evidence.

Requirement:
  Password reset must not reveal whether an email address exists.

Implementation candidates:
  Accounts.request_password_reset/1
  PasswordResetController.create/2

Missing:
  No test found that asserts same response shape for existing and non-existing email.

Recommended generated test:
  Add ExUnit test comparing response and telemetry behavior for both cases.
```

This turns architecture commitments into verification work.

---

# 19. Commitment-to-Belief Integration

The belief engine consumes commitment evaluation results.

A commitment evaluation can produce:

```text
satisfied
violated
exceptioned
unknown
stale
unimplemented
unverified
drifted
```

Example mapping:

| Evaluation Result                   | Belief State           |
| ----------------------------------- | ---------------------- |
| Rule satisfied with strong evidence | `verified`             |
| Rule satisfied with weak evidence   | `believed`             |
| Rule violated by current code       | `drifted` or `refuted` |
| Rule has approved exception         | `exceptioned`          |
| Rule cannot be evaluated            | `unknown`              |
| Rule depends on stale source        | `stale`                |
| Required implementation missing     | `unimplemented`        |
| Required test missing               | `unverified`           |

The DSL provides the formal commitment. The belief calculus determines current truth state.

---

# 20. Commitment-to-Projection Integration

Commitments should become navigable UI objects.

The projection layer should support views like:

```text
Architecture commitments for this bounded context
Open violations
Exceptioned violations
Commitments implemented by this module
Requirements with no commitments
Commitments with no tests
Runtime contradictions
PR-induced drift
```

A commitment projection should show:

```text
human statement
scope
current state
evidence summary
violations
exceptions
affected artifacts
downstream code
upstream requirements
recommended actions
```

Example compressed projection:

```text
Billing Boundary Commitments

1. Billing must not read Accounts tables.
   State: violated
   New violations: 2
   Existing exceptions: 1
   CI behavior: fail new violations

2. Billing may consume Accounts public API.
   State: verified
   Public calls: 14
   Internal calls: 0

3. Billing invoice events must be published after successful invoice creation.
   State: unverified
   Implementation found, no test evidence found.
```

This is where commitment language feeds semantic compression.

---

# 21. Commitment Inference

Not every commitment will be manually written.

The system should infer candidate commitments from:

```text
ADRs
requirements
docs
repeated code patterns
module naming conventions
existing tests
runtime behavior
human annotations
architecture diagrams
dependency history
```

But inferred commitments should start as:

```text
proposed
```

not:

```text
enforced
```

Example inferred commitment:

```text
Candidate commitment:
  Controllers in MyAppWeb appear to call only context modules.
  Direct Repo access from controllers is probably forbidden.

Evidence:
  42 controller actions call context modules.
  0 current direct Repo calls.
  Existing test names describe context boundary.
  Docs mention "contexts own persistence."

Suggested DSL:
  web_must_not_call_repo

Recommended state:
  proposed
```

This gives the human a way to promote inferred architecture into executable architecture memory.

---

# 22. Commitment Conflict Detection

Commitments can contradict each other.

Example:

```yaml
Commitment A:
  Billing must never call Accounts directly.

Commitment B:
  Billing may call Accounts public API.
```

These are not necessarily incompatible if “directly” means internal modules, but the system needs to detect ambiguity.

Conflict types:

| Conflict Type          | Example                                          |
| ---------------------- | ------------------------------------------------ |
| `direct_contradiction` | One rule allows what another forbids             |
| `scope_overlap`        | Rules conflict only in prod                      |
| `exception_conflict`   | Exception permits what security rule forbids     |
| `severity_conflict`    | One rule warns, another fails                    |
| `lifecycle_conflict`   | Deprecated rule still enforced                   |
| `selector_ambiguity`   | Same artifact selected as both source and target |
| `ownership_conflict`   | Two domains claim same data entity               |

The DSL compiler should run commitment validation before enforcement.

---

# 23. Commitment Drift

A commitment itself can become stale.

Example:

```text
ADR says Billing uses event-driven integration with Reporting.
But code and runtime show direct table reads.
```

Possible interpretations:

```text
implementation drifted from commitment
commitment obsolete
migration incomplete
exception missing
runtime behavior incorrect
```

The belief engine should not automatically decide that code wins.

It should report:

```text
Accepted architecture says X.
Current implementation/runtime says Y.
This is drift requiring resolution.
```

Resolution options:

```text
restore implementation
update commitment
add exception
mark commitment superseded
open migration task
```

---

# 24. Generated ADR Updates

When a commitment is violated intentionally, the system should suggest an ADR update.

Example PR changes token expiry from 15 minutes to 60 minutes.

Generated ADR update draft:

```markdown
# ADR-008 Amendment: Password Reset Token Expiry

## Status

Proposed amendment.

## Change

Password reset token expiry changes from 15 minutes to 60 minutes.

## Rationale Needed

This change contradicts the original security rationale. The PR should document why the longer expiry is acceptable.

## Affected Commitments

- SEC-014: reset tokens expire within 15 minutes
- AUTH-003: account recovery token policy

## Required Follow-Up

- Update expiry tests
- Update support documentation
- Review brute-force and token leakage risk
- Re-evaluate telemetry thresholds
```

The system should not silently update architecture. It should propose an update requiring approval.

---

# 25. Commitment DSL and Action Model Boundary

The DSL should not itself perform actions.

It should specify action policy.

Actual actions belong to the next layer:

```text
Action Model
```

The DSL says:

```yaml
ci:
  on_new_violation: fail

suggestions:
  generate_test: true
  generate_adr_update: true
```

The action engine decides:

```text
when to generate
how to ask approval
what patches are allowed
who can approve
what gets committed
what stays advisory
```

This separation matters.

The commitment DSL defines **what ought to be true** and **what should happen when it is not true**.

The action model defines **how the system behaves operationally**.

---

# 26. Minimal Viable Commitment DSL

For the first version, do not try to support every rule type.

Start with five commitment kinds:

```text
1. forbid relation
2. require relation
3. require verification
4. require indirection
5. exception
```

And five selector types:

```text
1. bounded_context
2. otp_app
3. module_matches
4. api_surface
5. data_entity / data_owner
```

That is enough to build a powerful first product around Elixir architecture boundaries.

## First wedge

```text
Boundary violation detector for Elixir umbrellas and multi-repo systems.
```

Supported commitments:

```text
Web must not call Repo.
Domain apps must not call other domain internals.
Apps must consume public API surfaces only.
Data tables have owners.
Deprecated APIs must not gain consumers.
Security requirements must have tests.
```

This can deliver real value quickly.

---

# 27. Example Full Commitment Pack for an Elixir System

```yaml
commitment_pack: commerce_architecture_boundaries
version: 1

commitments:
  - id: web_no_repo
    kind: boundary.layering
    severity: error
    statement: "Phoenix web controllers must not call Repo directly."
    source:
      module_matches: ".*Web\\..*Controller$"
    forbidden:
      relation: calls
      target:
        module_matches: ".*Repo$"
    allowed:
      - relation: calls
        target:
          tag: "context_api"
    ci:
      on_new_violation: fail

  - id: billing_no_accounts_table_reads
    kind: boundary.data_access
    severity: error
    statement: "Billing must not directly read Accounts-owned tables."
    source:
      bounded_context: "Billing"
    forbidden:
      relation: data.reads_from
      target:
        data_owner: "Accounts"
    allowed:
      - relation: calls
        target:
          api_surface:
            owner: "Accounts"
            stability: "public"
      - relation: subscribes_to
        target:
          event_owner: "Accounts"
    exceptions:
      - id: legacy_billing_export
        source:
          module: "Billing.Legacy.Export"
        target:
          data_entity: "accounts.users"
        expires_on: "2026-09-01"
        approved_by: "architecture-review-board"
    ci:
      on_new_violation: fail
      on_exception_expired: fail

  - id: security_requirements_have_tests
    kind: verification.coverage
    severity: warning
    source:
      requirement:
        quality_attribute: "security"
        lifecycle_state: "accepted"
    required:
      relation: verified_by
      target:
        any:
          - test_kind: "unit"
          - test_kind: "integration"
          - test_kind: "property"
    ci:
      on_new_unverified_requirement: warn

  - id: deprecated_api_no_new_consumers
    kind: lifecycle.deprecation
    severity: error
    source:
      api_surface:
        stability: "deprecated"
    forbidden:
      relation: consumed_by
      target:
        changed_in_pr: true
    ci:
      on_new_violation: fail
```

This is the beginning of executable architecture memory.

---

# 28. What This Adds to the System

The commitment DSL gives the operating intelligence kernel a precise way to answer:

```text
What architecture does this system claim to follow?

Which claims are enforceable?

Which code violates those claims?

Which violations are intentional exceptions?

Which requirements lack implementation?

Which implementations lack verification?

Which PRs increase architectural drift?

Which runtime observations contradict commitments?

What should CI do?
```

Without this language, the system can describe architecture.

With it, the system can **execute architecture**.

---

# 29. Final Definition

The Commitment Language is:

> A semi-formal, evidence-aware architecture DSL that turns human architectural intent into scoped, executable commitments over requirements, code, data, runtime behavior, tests, and policies.

It is the bridge from:

```text
“Here is how the system should be designed”
```

to:

```text
“Here is the exact code, dependency, runtime behavior, or missing test that violates that design.”
```

The next gap to fill is the **Action Model**: when the system reports, suggests, generates tests, drafts ADRs, blocks CI, asks for approval, or applies changes.
