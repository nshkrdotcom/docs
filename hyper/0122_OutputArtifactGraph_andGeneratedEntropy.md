# Response 23 - Output Artifact Graph and Generated Entropy

The system produces many outputs:

```text
PR comments
CI checks
ADR drafts
generated tests
policy exceptions
debt items
remediation plans
query answers
projection packets
known unknowns
open loops
governance proposals
```

These outputs become part of the engineering environment. They can become stale, conflict, duplicate each other, supersede each other, or outlive their usefulness.

The missing layer is an output artifact graph.

---

# 1. Core Claim

The system must model its own outputs as first-class artifacts with lifecycle, provenance, dependencies, and relationships.

Otherwise, the system's products become their own architecture debt:

```text
three ADR drafts for the same decision
two generated tests with unclear origin
expired exception still referenced by a PR comment
debt item duplicated by remediation plan
open loop detached from the finding that created it
query answer copied into wiki but now stale
```

---

# 2. Output Artifact Types

| Output Type | Example |
|---|---|
| `pr_comment` | Architecture violation comment |
| `ci_check` | Pass/fail/warn result |
| `adr_draft` | Proposed decision amendment |
| `test_draft` | Generated ExUnit test |
| `exception_draft` | Scoped policy exception |
| `debt_item` | Architecture debt record |
| `remediation_plan` | Sequenced cleanup plan |
| `query_answer` | Saved answer to IntentQL query |
| `projection_packet` | Materialized UI output |
| `known_unknown` | Memory gap created by analysis |
| `governance_proposal` | Proposal for review |

---

# 3. Suggested Schema

```sql
CREATE TABLE output_artifact (
  output_artifact_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  output_kind        text NOT NULL,
  -- pr_comment, ci_check, adr_draft, test_draft,
  -- exception_draft, debt_item, remediation_plan,
  -- query_answer, projection_packet, known_unknown,
  -- governance_proposal

  title              text,
  body_text          text,
  body_json          jsonb NOT NULL DEFAULT '{}',

  produced_by_action_id uuid,
  produced_by_query_id uuid,
  produced_by_benchmark_id uuid,

  lifecycle_state    text NOT NULL DEFAULT 'active',
  -- draft, proposed, active, accepted, rejected,
  -- applied, stale, superseded, archived, deleted

  content_hash       text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE output_artifact_link (
  output_artifact_link_id uuid PRIMARY KEY,
  source_output_id   uuid NOT NULL REFERENCES output_artifact(output_artifact_id),
  target_output_id   uuid NOT NULL REFERENCES output_artifact(output_artifact_id),
  link_kind          text NOT NULL,
  -- supersedes, duplicates, generated_from,
  -- implements, responds_to, blocks, unblocks,
  -- references, invalidates, resolves, conflicts_with

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_output_id, target_output_id, link_kind)
);
```

```sql
CREATE TABLE output_dependency (
  output_dependency_id uuid PRIMARY KEY,
  output_artifact_id uuid NOT NULL REFERENCES output_artifact(output_artifact_id),
  dependency_kind    text NOT NULL,
  -- source_span, claim, belief_state, commitment,
  -- runtime_window, query_plan, governance_verdict,
  -- external_notice, benchmark_result

  dependency_subject_kind text NOT NULL,
  dependency_subject_id uuid NOT NULL,
  dependency_hash    text,
  freshness_state    text NOT NULL DEFAULT 'fresh',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE output_entropy_signal (
  output_entropy_signal_id uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,
  output_artifact_id uuid REFERENCES output_artifact(output_artifact_id),
  signal_kind        text NOT NULL,
  -- duplicate_output, stale_output, orphaned_output,
  -- conflicting_output, unresolved_output_chain,
  -- obsolete_generated_artifact, noisy_comment_thread

  severity           text NOT NULL DEFAULT 'medium',
  evidence_json      jsonb NOT NULL DEFAULT '{}',
  state              text NOT NULL DEFAULT 'open',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 4. Output Lifecycles

Outputs need lifecycle states.

```text
draft
proposed
accepted
applied
active
stale
superseded
rejected
archived
```

Example:

```text
Generated test draft:
  draft -> accepted -> applied -> passing -> verifies commitment

ADR amendment:
  draft -> under governance review -> accepted -> supersedes old ADR

PR comment:
  active -> resolved -> archived

Projection packet:
  active -> stale -> regenerated -> superseded
```

---

# 5. Staleness and Supersession

Outputs depend on claims, code, policies, and decisions.

If a dependency changes:

```text
PR comment may become stale
ADR draft may no longer match current code
generated test may target deleted function
debt item may be remediated
query answer may be historically valid but current-stale
```

Trust UX should show:

```text
This generated output is stale because the source claim changed.
```

---

# 6. Output Graph Queries

Examples:

```text
Which generated tests came from this commitment?
Which ADR draft superseded this older draft?
Which open loops came from this PR finding?
Which outputs are stale after this PR?
Which debt items are duplicates?
Which generated artifacts were accepted by humans?
Which outputs did this failure event invalidate?
```

---

# 7. Output Entropy Controls

The system should periodically detect:

```text
duplicate ADR drafts
stale PR comments
unresolved exception drafts
orphaned open loops
conflicting query answers
generated tests without linked commitment
debt items with no owner or plan
```

Possible actions:

```text
archive stale output
merge duplicates
mark superseded
ask owner to resolve conflict
create cleanup benchmark
```

---

# 8. Minimal Viable Output Graph

Start with:

```text
1. output artifact table
2. generated_from and supersedes links
3. dependency hashes for staleness
4. stale output detection
5. accepted/rejected human verdict capture
6. query: show all outputs caused by this finding
```

This prevents the system from generating untraceable artifacts.

---

# 9. Final Definition

The Output Artifact Graph is:

> A lifecycle and dependency graph for the system's own generated and published outputs, so PR comments, CI checks, ADR drafts, tests, exceptions, plans, and projections remain traceable, fresh, deduplicated, and auditable.

It closes the gap between:

```text
the system produces useful outputs
```

and:

```text
the system manages the entropy those outputs create.
```

