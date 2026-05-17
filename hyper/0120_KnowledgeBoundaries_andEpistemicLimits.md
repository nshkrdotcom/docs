# Response 21 - Knowledge Boundaries and Epistemic Limits

The system already models known unknowns, missing evidence, incomplete indexing, confidence, freshness, and trust UX. But it still needs a stronger distinction:

```text
not analyzed yet
```

is not the same as:

```text
not knowable by this kind of system
```

Some facts are structurally unavailable to static analysis, unavailable to runtime traces, unavailable to documentation mining, or unavailable without human testimony. The system needs to model its own knowledge boundary.

---

# 1. Core Claim

The operating intelligence kernel should know what it cannot know.

It should distinguish:

```text
temporarily unknown
  We have not indexed or analyzed enough yet.

contingently unknowable
  We could know this if we got more traces, config, docs, or human input.

structurally unknowable
  This class of fact cannot be determined by the available method.

policy-restricted
  The system may know evidence exists, but cannot reveal it to this user or model.

perspectival
  There may be multiple legitimate answers, not one hidden truth.
```

This prevents the system from implicitly promising answers it cannot provide.

---

# 2. Epistemic Boundary Types

| Boundary Type | Example |
|---|---|
| `static_limit` | Dynamic dispatch cannot be fully resolved statically |
| `runtime_limit` | Behavior only occurs under rare load or tenant-specific conditions |
| `config_limit` | Production config lives outside the repository |
| `human_memory_limit` | Decision was verbal and never recorded |
| `provider_limit` | External provider behavior is undocumented |
| `access_limit` | Evidence exists but is restricted |
| `sampling_limit` | Runtime traces are partial |
| `semantic_limit` | Intent cannot be inferred from code alone |
| `perspective_limit` | Multiple valid architecture views coexist |

These are not failures. They are boundaries of the system's epistemology.

---

# 3. Suggested Schema

```sql
CREATE TABLE epistemic_boundary (
  epistemic_boundary_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  boundary_kind      text NOT NULL,
  -- static_limit, runtime_limit, config_limit,
  -- human_memory_limit, provider_limit, access_limit,
  -- sampling_limit, semantic_limit, perspective_limit

  subject_kind       text NOT NULL,
  subject_id         uuid NOT NULL,

  claim_type         text,
  description        text NOT NULL,

  knowability_state  text NOT NULL,
  -- unknown_for_now, knowable_with_more_input,
  -- structurally_unknowable, restricted,
  -- plural_by_nature

  required_input_json jsonb NOT NULL DEFAULT '{}',
  -- runtime_trace, prod_config, human_answer,
  -- provider_doc, access_grant, benchmark

  confidence         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE epistemic_method_capability (
  method_capability_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  method_key         text NOT NULL,
  -- static_analysis, llm_inference, runtime_trace,
  -- test_analysis, doc_mining, human_elicitation,
  -- provider_catalog, config_ingest

  claim_type         text NOT NULL,
  capability_state   text NOT NULL,
  -- strong, partial, weak, incapable, restricted

  limitation_text    text,
  calibration_json   jsonb NOT NULL DEFAULT '{}',
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, method_key, claim_type)
);
```

```sql
CREATE TABLE knowledge_boundary_disclosure (
  disclosure_id      uuid PRIMARY KEY,
  epistemic_boundary_id uuid NOT NULL REFERENCES epistemic_boundary(epistemic_boundary_id),
  projection_packet_id uuid,
  query_answer_id    uuid,
  disclosure_text    text NOT NULL,
  user_visible       boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Boundary-Aware Belief States

The belief calculus should add or refine states:

```text
unknown_unanalyzed
  The system has not analyzed enough.

unknown_incomplete_input
  More input could resolve this.

unknown_structural_limit
  No available analysis can determine this.

unknown_restricted
  Evidence exists but cannot be used or shown in this context.

plural_valid
  Multiple interpretations are legitimate.
```

This is more precise than a single `unknown`.

---

# 5. Examples

## Dynamic dispatch

```text
Claim:
  This function never calls Accounts.Internal.TokenStore.

Boundary:
  Static analysis cannot prove absence because calls are generated through apply/3.

State:
  unknown_structural_limit for static method.

Required input:
  runtime trace or compiler instrumentation.
```

## Production config

```text
Claim:
  Password reset email is asynchronous in production.

Boundary:
  runtime adapter is selected by production config outside repository.

State:
  unknown_incomplete_input.

Required input:
  production runtime config or production traces.
```

## Verbal architecture

```text
Claim:
  Reporting is allowed to read Billing projections.

Boundary:
  no ADR, commitment, or exception records exist.

State:
  knowable_with_human_input.

Action:
  ask current owners or governance body.
```

---

# 6. Query and UX Behavior

Bad answer:

```text
No violation found.
```

Better answer:

```text
No static violation found in indexed code.

Knowledge boundary:
  Dynamic dispatch in Billing.Legacy.Export prevents static proof of absence.
  Production runtime traces are unavailable.

State:
  Unknown under current evidence, not verified clean.
```

Trust UX should show method limits before users overtrust the output.

---

# 7. Method Selection

The query planner and scheduler should use boundary records.

Example:

```text
If static analysis is incapable for a claim:
  do not schedule more static analysis.
  request runtime evidence or human input.

If runtime sampling is insufficient:
  ask for longer observation window.

If evidence is access-restricted:
  route query to privileged reviewer or show redacted basis.
```

This saves compute and reduces user frustration.

---

# 8. Minimal Viable Epistemic Boundary Layer

Start with:

```text
1. dynamic dispatch static limit
2. external production config limit
3. missing human decision record
4. restricted evidence boundary
5. runtime sampling limit
```

Add a visible `knowledge boundary` block to query answers and CI warnings.

---

# 9. Final Definition

Knowledge Boundaries and Epistemic Limits is:

> A model of what the system can know, cannot yet know, cannot know by a given method, cannot reveal, or should treat as inherently plural.

It closes the gap between:

```text
unknown because analysis is incomplete
```

and:

```text
unknown because the fact is outside the system's knowable boundary.
```

