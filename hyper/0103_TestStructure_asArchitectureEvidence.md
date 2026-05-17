# Response 19 - Test Structure as Architecture Evidence

The current design treats tests mainly as verification evidence: a test verifies a requirement, covers a function, or proves a commitment. That is necessary, but incomplete.

Tests also encode architecture intent.

The way tests are structured reveals what the author believed were:

```text
system boundaries
external interfaces
collaboration seams
domain concepts
mockable dependencies
integration surfaces
coupling assumptions
ownership boundaries
```

The system should mine test structure as architectural evidence, not only as coverage.

---

# 1. Core Claim

Tests are executable mental models.

A unit test with a mock says:

```text
this dependency is considered external to the unit
```

An integration test spanning ten modules says:

```text
these modules are expected to collaborate as one scenario
```

A fixture shape says:

```text
this is the data contract the author thought mattered
```

A test file boundary says:

```text
this is the conceptual unit the author expected readers to recognize
```

These are architecture signals.

---

# 2. Test Architecture Signals

| Signal | Architectural Meaning |
|---|---|
| Mock boundary | What the author treated as external |
| Fixture shape | Expected data contract or domain object |
| Test module grouping | Conceptual grouping of behavior |
| Setup block | Required collaboration context |
| Shared helper | Reused scenario or invariant |
| Integration breadth | Coupling surface size |
| Assertions | Behavioral contract |
| Factory usage | Domain model assumptions |
| Tags | Runtime/environment/ownership hints |
| Test naming | User-facing or domain language |

---

# 3. Suggested Schema

```sql
CREATE TABLE test_architecture_surface (
  test_arch_surface_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  test_anchor_id     uuid NOT NULL,
  test_kind          text NOT NULL,
  -- unit, integration, property, contract,
  -- acceptance, smoke, regression, unknown

  conceptual_subject_kind text,
  conceptual_subject_id uuid,
  inferred_concept     text,

  scope_json          jsonb NOT NULL DEFAULT '{}',
  evidence_json       jsonb NOT NULL DEFAULT '{}',
  confidence          numeric NOT NULL DEFAULT 0.5,
  created_at          timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE test_boundary_signal (
  test_boundary_signal_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  test_anchor_id     uuid NOT NULL,

  signal_kind        text NOT NULL,
  -- mock_boundary, fixture_contract, setup_dependency,
  -- assertion_contract, helper_reuse, integration_span,
  -- tag_scope, factory_shape, naming_concept

  source_anchor_id   uuid,
  target_anchor_id   uuid,
  signal_json        jsonb NOT NULL DEFAULT '{}',
  architecture_interpretation text,
  confidence         numeric NOT NULL DEFAULT 0.5,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE test_coupling_metric (
  test_coupling_metric_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  test_anchor_id     uuid NOT NULL,

  metric_key         text NOT NULL,
  -- module_span, app_span, context_span,
  -- external_mock_count, fixture_complexity,
  -- setup_width, assertion_breadth

  numeric_value      numeric,
  json_value         jsonb,
  interpretation     text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snapshot_id, test_anchor_id, metric_key)
);
```

```sql
CREATE TABLE test_implied_commitment (
  test_implied_commitment_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  test_anchor_id     uuid NOT NULL,

  candidate_commitment_text text NOT NULL,
  commitment_kind    text NOT NULL,
  -- boundary, contract, invariant, data_shape,
  -- runtime_behavior, external_interface

  support_json       jsonb NOT NULL DEFAULT '{}',
  confidence         numeric NOT NULL DEFAULT 0.5,
  state              text NOT NULL DEFAULT 'candidate',
  -- candidate, promoted, rejected, superseded
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Mock Boundaries

Mocks are architecture signals.

Example:

```text
Password reset tests mock Mailer.
```

Possible interpretation:

```text
Email delivery is considered external to account recovery logic.
Password reset should enqueue or call a mail boundary, not implement provider details inline.
```

If later code synchronously calls the provider directly, the test structure supports a drift finding.

---

# 5. Fixture Contracts

Fixtures encode expected data shapes.

Example:

```elixir
valid_invoice_payload = %{
  customer_id: customer.id,
  line_items: [...],
  currency: "USD"
}
```

Architecture signals:

```text
invoice payload contract
required fields
domain terms
external API shape
test author's expected boundary
```

If implementation accepts a different shape, the system should detect possible contract drift.

---

# 6. Integration Breadth

Tests vary in architecture meaning.

```text
Ten unit tests each touching one module:
  suggests separable behavior.

One integration test touching ten modules:
  suggests scenario-level coupling.

Integration test with no mocks:
  suggests end-to-end contract.

Integration test with many mocks:
  reveals assumed external seams.
```

The system should compute coupling metrics from test execution or static test analysis.

---

# 7. Test Organization as Concept Map

Test file paths and module names often encode the domain model:

```text
test/accounts/password_reset_test.exs
test/billing/invoice_lifecycle_test.exs
test/notifications/email_delivery_contract_test.exs
```

These should feed:

```text
domain concept inference
bounded context membership
capability extraction
scenario extraction
candidate commitment discovery
```

---

# 8. Belief Integration

Test structure evidence should have scoped authority.

It can support claims like:

```text
This behavior is considered part of Account Recovery.
Mailer is treated as an external boundary.
This payload shape is expected by consumers.
This scenario couples Billing and Notifications.
```

It should not automatically prove:

```text
the architecture is accepted
the implementation is correct
production behavior matches the test
```

Test structure is strong evidence of author intent and verification shape, not universal truth.

---

# 9. Minimal Viable Test Architecture Layer

Start with:

```text
1. detect test kind
2. extract tested subject
3. extract mocks and external boundaries
4. extract fixture shapes
5. compute integration breadth
6. infer candidate commitments
7. feed findings into middle-out exploration
```

This can add architecture signal without requiring runtime test tracing at first.

---

# 10. Final Definition

Test Structure as Architecture Evidence is:

> A model for interpreting test organization, mocks, fixtures, setup, assertions, and integration breadth as evidence of the system's intended boundaries, contracts, concepts, and coupling.

It closes the gap between:

```text
tests as verification coverage
```

and:

```text
tests as executable architectural memory.
```

