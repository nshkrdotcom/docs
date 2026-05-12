# Feature Acceptance And Review Protocol

## Purpose

This document defines the formal review and acceptance process for features. It applies to new features, major refactors, runtime topology changes, persistence changes, and external integrations.

## Acceptance Principle

```text
A feature is accepted when its behavior, boundaries, runtime shape, failure behavior, tests, and operational evidence match the approved design.
```

Code that works locally but lacks evidence is not accepted.

## Review Stages

### Stage 1: Concept Inventory Review

Questions:

- What concepts were introduced?
- Which are domain concepts?
- Which are persistence concepts?
- Which are runtime concepts?
- Which are synonyms?
- Which can be deleted or collapsed?

Blockers:

- Unresolved duplicate terms.
- Manager/service/coordinator nouns hiding unclear ownership.
- External provider terms leaking into core domain.

Output:

```yaml
concept_review:
  accepted:
    - Account
    - CredentialLease
  collapse:
    - CredentialLeaseManager -> CredentialLeaseRegistry
  rejected:
    - UniversalExecutionThing
```

### Stage 2: Boundary Review

Questions:

- What modules are public?
- What modules are internal?
- Which components may call each other?
- What payloads cross boundaries?
- Are external payloads translated?
- Are contracts versioned?

Blockers:

- Controller/LiveView directly calls Repo for domain operations.
- Domain core calls HTTP client.
- External SDK struct is stored as domain state.
- Public API added without contract.

### Stage 3: State Ownership Review

Questions:

- Who owns each state value?
- Is state durable or ephemeral?
- Is state cached or authoritative?
- Can two processes own the same logical state?
- What happens after crash or restart?

Blockers:

- Multiple authoritative owners.
- Runtime-only state for business facts that must survive restart.
- Cached state without invalidation.
- Process restart loses externally visible work.

### Stage 4: Runtime Primitive Review

Questions:

- Why is this a process?
- Why this process type?
- Why this supervisor?
- Why dynamic lookup?
- Why async messaging?
- What prevents overload?

Blockers:

- GenServer with no runtime state or serialization need.
- `cast` for important unbounded work.
- Unsupervised production-significant process.
- Blocking external calls inside stateful callbacks.
- Registry used to hide unclear ownership.

### Stage 5: Effect And Persistence Review

Questions:

- What durable writes happen?
- What external effects happen?
- What is in the transaction?
- What happens after commit?
- What retries?
- What is idempotent?
- What can be duplicated?

Blockers:

- Email, payment capture, webhook, or provider mutation inside transaction without recovery plan.
- Race-sensitive uniqueness enforced only by changeset validation.
- External effect lacks idempotency key or dedupe rule.
- Migration can lock production table without mitigation.

### Stage 6: Test And QC Review

Questions:

- Are pure rules tested without processes?
- Are process APIs tested through public functions?
- Are forbidden transitions tested?
- Are crash/restart paths tested?
- Are static checks updated?
- Are release gates defined?

Blockers:

- Only happy-path tests.
- Tests rely on `Process.sleep/1` instead of synchronization.
- No regression test for the bug being fixed.
- No contract test for external boundary.

### Stage 7: Observability And Operations Review

Questions:

- What telemetry is emitted?
- What fields identify tenant/session/request/job?
- What logs are safe?
- What health checks reflect this feature?
- How does an operator debug failure?
- How does shutdown behave?

Blockers:

- Important background work has no visibility.
- Secret or credential can be logged.
- No way to distinguish retrying from stuck.
- No drain behavior for work accepted before shutdown.

### Stage 8: Compression Review

Questions:

- What can be removed before merge?
- Can public API shrink?
- Can behavior be concrete until second implementation exists?
- Can process be replaced by transaction or pure function?
- Can wrapper be eliminated?

Blockers:

- Premature abstraction without near-term use.
- Duplicate implementation paths.
- Public functions added "just in case."

## Evidence Package

Each accepted feature records:

```yaml
feature:
  name:
  owner:
  design_docs:
  contracts:
  public_api_changes:
  migrations:
  processes_added:
  external_effects:
  test_evidence:
    format:
    compile:
    unit:
    integration:
    property:
    contract:
  static_analysis:
    credo:
    dialyzer:
    sobelow:
    deps_audit:
  observability:
    telemetry_events:
    dashboards:
    runbooks:
  exceptions:
    - id:
      owner:
      expires:
  decision: accepted | rejected | accepted_with_followups
```

## Review Finding Format

```yaml
finding:
  id:
  severity: blocker | high | medium | low
  area: domain | boundary | state | otp | persistence | effects | tests | operations | security
  evidence:
    - file:
    - behavior:
  risk:
  recommendation:
  required_before_merge: true
  deterministic_check_candidate: true
```

## Acceptance Decisions

### Accepted

Use when:

- Design matches implementation.
- Required gates pass.
- No blocker findings remain.
- Exceptions are owned and time bounded.

### Accepted With Followups

Use only when:

- Followups do not affect correctness, data safety, security, or operability.
- Followups have owners and dates.
- The accepted feature is still coherent without them.

### Rejected

Use when:

- Invariant enforcement is missing.
- Runtime ownership is unclear.
- Evidence is insufficient.
- Security or data-loss risk remains.
- Design and implementation diverged without amendment.

## Rule Promotion

After each feature:

1. Review findings.
2. Identify repeated patterns.
3. Promote repeated patterns to:
   - Template field.
   - Static check.
   - CI gate.
   - Architecture review question.
   - Test generator.

The review system should become stricter over time based on real defects.

