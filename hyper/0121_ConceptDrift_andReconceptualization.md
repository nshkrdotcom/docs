# Response 22 - Concept Drift and Reconceptualization

The system learns from corrections and updates priors, but the current design assumes concepts are mostly stable. In real systems, concepts themselves drift.

Terms change meaning. Boundaries blur. Patterns that were once violations become normal. A bounded context that was clear two years ago can become ambiguous after growth, reorgs, acquisitions, or repeated exceptions.

The missing layer is concept drift and reconceptualization.

---

# 1. Core Claim

The system should distinguish:

```text
the model was wrong
```

from:

```text
the world changed
```

Human corrections are not always evidence that the previous classifier was bad. Sometimes they indicate that the architecture's conceptual structure has evolved.

---

# 2. Concept Drift Types

| Drift Type | Example |
|---|---|
| `semantic_shift` | "Shared Kernel" now includes modules once owned by Billing |
| `boundary_erosion` | Direct cross-context reads become common during migration |
| `boundary_hardening` | Previously informal boundary becomes enforced |
| `term_split` | "Accounts" splits into Identity and Profile |
| `term_merge` | Billing and Payments become one domain |
| `pattern_normalization` | A once-exceptional integration style becomes standard |
| `policy_inversion` | Platform dependency direction changes after replatforming |
| `ownership_reconceptualization` | New team maps services differently |

These are concept-level events, not just artifact changes.

---

# 3. Suggested Schema

```sql
CREATE TABLE architecture_concept (
  architecture_concept_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  concept_key        text NOT NULL,
  display_name       text NOT NULL,
  concept_kind       text NOT NULL,
  -- bounded_context, domain_term, pattern,
  -- ownership_category, architecture_layer,
  -- public_surface, shared_kernel

  description        text,
  current_version_id uuid,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, concept_key)
);
```

```sql
CREATE TABLE architecture_concept_version (
  concept_version_id uuid PRIMARY KEY,
  architecture_concept_id uuid NOT NULL REFERENCES architecture_concept(architecture_concept_id),

  version_key        text NOT NULL,
  valid_from         timestamptz NOT NULL,
  valid_to           timestamptz,

  definition_text    text,
  definition_json    jsonb NOT NULL DEFAULT '{}',
  membership_rule_json jsonb NOT NULL DEFAULT '{}',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_by_kind    text NOT NULL,
  -- inferred, human_defined, governance_accepted,
  -- imported, reconceptualized

  confidence         numeric NOT NULL DEFAULT 0.5,
  metadata           jsonb NOT NULL DEFAULT '{}',
  UNIQUE (architecture_concept_id, version_key)
);
```

```sql
CREATE TABLE concept_drift_signal (
  concept_drift_signal_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,
  architecture_concept_id uuid REFERENCES architecture_concept(architecture_concept_id),

  signal_kind        text NOT NULL,
  -- correction_cluster, exception_growth,
  -- membership_instability, naming_shift,
  -- cochange_shift, runtime_path_shift,
  -- ownership_shift, test_structure_shift

  signal_json        jsonb NOT NULL DEFAULT '{}',
  strength           numeric NOT NULL DEFAULT 0.5,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE reconceptualization_proposal (
  reconceptualization_proposal_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  proposal_kind      text NOT NULL,
  -- split_concept, merge_concepts, rename_concept,
  -- redefine_boundary, change_membership_rule,
  -- deprecate_concept

  title              text NOT NULL,
  affected_concept_ids uuid[] NOT NULL DEFAULT '{}',
  proposed_definition_json jsonb NOT NULL DEFAULT '{}',
  rationale_text     text,
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  impact_json        jsonb NOT NULL DEFAULT '{}',
  state              text NOT NULL DEFAULT 'proposed',
  -- proposed, under_review, accepted, rejected, superseded
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Drift Detection Signals

Concept drift should be detected from:

```text
repeated human corrections
growing exception clusters
increasing boundary ambiguity
changes in co-change patterns
test reorganization
runtime paths crossing old boundaries
ownership handoffs
renames and module movement
new vocabulary in docs and PRs
debt items concentrated on one concept
```

Example:

```text
Signal:
  17 modules previously classified as Billing were corrected to Shared Kernel.

Interpretation:
  Not just classifier error. Shared Kernel concept may have expanded.

Action:
  propose reconceptualization of Shared Kernel membership rule.
```

---

# 5. Reconceptualization vs Correction

Correction:

```text
This artifact was classified wrong under the current concept definition.
```

Reconceptualization:

```text
The concept definition itself should change.
```

The system should not silently handle all corrections as classifier training data. It should detect clusters that suggest the architecture model needs revision.

---

# 6. Concept Versions in Belief and Query

Queries should include concept version.

Example:

```text
Billing context under 2024 definition:
  includes Billing.UserSnapshot.

Billing context under 2026 definition:
  excludes Billing.UserSnapshot; Shared Kernel owns it.
```

This supports historical truth:

```text
The old classification was correct at the time.
The current classification is different because the concept changed.
```

---

# 7. Governance Integration

Reconceptualization should often require governance.

Examples:

```text
split Identity domain into Auth and Profile
promote repeated exception into accepted integration pattern
rename Shared Kernel to Platform Model
move table ownership from Accounts to Identity
```

These changes affect commitments, policies, debt portfolios, and historical interpretation.

---

# 8. Trust UX

Show users when concept definitions changed.

Example:

```text
This module changed bounded-context classification.

Not because the module moved.
Because the Shared Kernel definition was updated on 2026-05-17.

Previous concept version:
  Shared Kernel = cross-domain utility modules.

Current concept version:
  Shared Kernel = stable identity reference data and cross-domain utilities.
```

This prevents confusing reconceptualization with inconsistency.

---

# 9. Minimal Viable Concept Drift Layer

Start with:

```text
1. versioned concept definitions
2. correction cluster detection
3. exception growth signal
4. reconceptualization proposal
5. query answers include concept version when relevant
```

This is enough to stop treating all changes as errors.

---

# 10. Final Definition

Concept Drift and Reconceptualization is:

> A model for detecting when architectural concepts, boundaries, terms, and normal patterns have genuinely changed, and for proposing or governing new concept definitions rather than merely updating classifier priors.

It closes the gap between:

```text
learning a stable architecture
```

and:

```text
tracking an architecture whose concepts evolve.
```

