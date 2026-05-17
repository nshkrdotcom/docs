The gap is precise and it's architectural. What's been designed covers two ends of a spectrum but leaves the middle — and specifically the *connection fabric* between levels — completely unspecified.

Here's what's actually missing:

---

## The Missing Object: The Traceability Continuum

Everything designed so far treats abstraction levels as discrete tiers with defined handoffs between them. The code introspection tool operates from code downward. The Living Substrate operates from SpecCells downward. Neither represents the continuous, bidirectional, multi-modal fabric that links:

```
informal vision
  → rough requirements
    → design decisions
      → architecture choices
        → component specs
          → module contracts
            → function specs
              → implementation plans
                → code structure
                  → expressions
                    → AST nodes
```

...as a **unified navigable space** where you can start at any point and traverse in any direction.

---

## The Core New Primitive: The Artifact

Every piece of information across this entire spectrum is an **Artifact** with a position in a multidimensional coordinate system:

```yaml
artifact:
  id: uuid (stable, content-addressed)
  abstraction_level: float  # 0.0 = AST node, 10.0 = vision statement
  representation_kinds: [prose, structured, vector, graph_node, ast]
  concern_dimensions:  # what aspects of the system this touches
    - execution_path
    - data_flow
    - security_boundary
    - performance_contract
    - state_ownership
    - error_handling
  temporal_position: timestamp
  content_hash: bytes
  version_lineage: [prev_artifact_id, ...]
```

The abstraction level is **continuous**, not discrete. A function contract might sit at 2.3. A rough architecture sketch might sit at 7.1. A formal ADR might sit at 5.8. This matters because navigation can move in fractional steps, not just between named tiers.

---

## The Traceability Link Graph

What connects artifacts is a typed, directed, weighted link graph that spans all abstraction levels and all time:

```sql
CREATE TABLE artifact_link (
  link_id           UUID PRIMARY KEY,
  source_artifact_id UUID NOT NULL REFERENCES artifact(artifact_id),
  target_artifact_id UUID NOT NULL REFERENCES artifact(artifact_id),

  -- What kind of connection
  link_kind         TEXT NOT NULL,
  -- derives_from | implements | tests | constrains | contradicts
  -- refines | exemplifies | supersedes | questions | motivates
  -- cross_cuts | co_varies_with | is_evidence_for | is_exception_to

  -- The abstraction delta: negative = going more concrete, positive = more abstract
  abstraction_delta FLOAT GENERATED ALWAYS AS (
    target.abstraction_level - source.abstraction_level
  ) STORED,

  -- Direction of information flow (not always same as abstraction direction)
  flow_kind         TEXT,
  -- top_down | bottom_up | lateral | diagonal_crosscut | temporal

  confidence        FLOAT NOT NULL DEFAULT 1.0,
  provenance_kind   TEXT NOT NULL,
  -- human_authored | llm_inferred | static_analysis | test_derived
  -- runtime_observed | migration_traced | contradiction_detected

  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index for bidirectional traversal at specific abstraction levels
CREATE INDEX artifact_link_source_abstraction
  ON artifact_link (source_artifact_id, abstraction_delta, link_kind);

CREATE INDEX artifact_link_target_abstraction  
  ON artifact_link (target_artifact_id, abstraction_delta, link_kind);
```

This graph is what makes "navigate from this line of code upward to the requirement that motivated it" possible. It's also what makes "start at this rough requirement and see all the code that exists because of it" possible.

---

## Multi-Modal Storage Architecture

Different abstraction levels and representation kinds need different stores. The key is that the same **artifact** can have multiple **representations** in multiple stores — but there is one canonical identity.

```
Abstraction 8-10 (vision, rough requirements):
  Primary: Markdown files (prose, human-authored)
  Secondary: Vector embeddings (semantic search)
  Tertiary: Graph node (for linking)

Abstraction 5-8 (design decisions, formal requirements, architecture choices):
  Primary: Structured YAML/JSON in relational DB
  Secondary: Graph nodes (rich traversal)
  Tertiary: Vector embeddings (similarity)

Abstraction 3-5 (component specs, contracts, module boundaries):
  Primary: Relational tables (SpecCells, contracts, semantic types)
  Secondary: Graph (dependency/ownership relationships)
  Tertiary: Vector (semantic similarity)

Abstraction 1-3 (function specs, implementation plans, code structure):
  Primary: AST/symbol graph + relational (ImplementationGraph from existing design)
  Secondary: Relational (call graphs, dependency)
  Tertiary: Vector (similar code patterns)

Abstraction 0-1 (AST nodes, expressions, tokens):
  Primary: AST graph + source spans (from the code introspection design)
  Secondary: CST with token metadata
  Tertiary: Vector (code embeddings)
```

The **canonical identity** lives in one place (the artifact table), with **content pointers** to the actual representations in their respective stores:

```sql
CREATE TABLE artifact_representation (
  repr_id            UUID PRIMARY KEY,
  artifact_id        UUID NOT NULL REFERENCES artifact(artifact_id),
  representation_kind TEXT NOT NULL,
  -- prose | yaml_structured | json_structured | ast_node
  -- graph_node | vector_embedding | markdown_section | columnar_record

  store_backend      TEXT NOT NULL,
  -- postgres_table | markdown_file | neo4j_node | qdrant_collection
  -- duckdb_table | timescaledb | object_store

  store_location     TEXT NOT NULL,  -- table name, file path, node ID, etc.
  store_key          TEXT NOT NULL,  -- row ID, section anchor, etc.
  content_hash       BYTEA NOT NULL,

  is_authoritative   BOOLEAN NOT NULL DEFAULT FALSE,
  -- Only one representation is authoritative; others are derived projections

  last_synced_at     TIMESTAMPTZ
);
```

The critical rule: **authoritative representation determines the artifact's truth; derived representations must be invalidated when the authoritative one changes.**

---

## The Temporal Dimension

Historical evolution is not just version control metadata — it's a first-class navigable dimension. The same artifact at different points in time tells you *how decisions were made and what changed them*:

```sql
CREATE TABLE artifact_version (
  version_id        UUID PRIMARY KEY,
  artifact_id       UUID NOT NULL REFERENCES artifact(artifact_id),
  version_sequence  INTEGER NOT NULL,

  valid_from        TIMESTAMPTZ NOT NULL,
  valid_to          TIMESTAMPTZ,  -- NULL = current

  changed_by        TEXT,         -- human, llm, static_analysis, etc.
  change_reason     TEXT,         -- why this changed
  change_trigger_id UUID,         -- what artifact/event caused this change
  -- e.g. a downstream test failure that caused an upstream spec to update
  -- or a requirement change that cascaded to architecture decisions

  content_hash      BYTEA NOT NULL,
  abstraction_level FLOAT NOT NULL,

  UNIQUE (artifact_id, version_sequence)
);

-- The temporal link: when artifact B changed, what other artifacts changed causally?
CREATE TABLE temporal_causation (
  causation_id      UUID PRIMARY KEY,
  cause_version_id  UUID NOT NULL REFERENCES artifact_version(version_id),
  effect_version_id UUID NOT NULL REFERENCES artifact_version(version_id),
  causation_kind    TEXT NOT NULL
  -- requirement_change_propagated_down | code_change_invalidated_spec
  -- test_failure_updated_contract | runtime_observation_refined_type
  -- human_correction_propagated | contradiction_resolved
);
```

This answers: "show me the causal chain of what changed and why, from the original requirement all the way through to this specific AST node."

---

## The Navigation Coordinate System

The "knob" metaphor from the code introspection design extends naturally. A **navigation position** is a coordinate in the multidimensional artifact space:

```yaml
navigation_position:
  # Where you are
  artifact_id: uuid
  abstraction_level: 3.7
  temporal_point: "2026-03-15T14:23:00Z"

  # What dimensions are active / what you're filtering for
  active_concerns:
    - execution_path
    - security_boundary
  active_link_kinds:
    - implements
    - constrains
    - derives_from

  # What kind of traversal you're doing
  traversal_mode:
    vertical:   up_abstraction | down_abstraction | both
    temporal:   current | historical | evolutionary
    horizontal: same_level_peers
    diagonal:   cross_cutting_concerns

  # The current "projection" — which representation to show
  display_representation: prose | structured | code | graph | diff
```

The knob system then maps to:

| Knob | What it modulates |
|---|---|
| Abstraction zoom | `abstraction_level` ±N levels |
| Temporal scroll | `temporal_point` — move through history |
| Concern filter | which `active_concerns` dimensions are active |
| Link filter | which `link_kinds` are traversed |
| Representation | which store/format to display |
| Confidence threshold | minimum link confidence to show |
| Direction | up/down/lateral/diagonal traversal |
| Provenance filter | human-authored only vs. inferred included |

---

## What This Enables That Nothing Else Does

**Forward traceability:** Take a rough paragraph from a design doc → navigate down through decisions, specs, and code → arrive at the specific lines implementing it, with every intermediate link visible.

**Backward traceability:** Take a specific function or AST node → navigate upward through specs, decisions, and requirements → see *why this code exists* all the way to the original motivation.

**Horizontal exploration:** At any abstraction level, see peer artifacts on the same concern — all the authentication-related artifacts at architecture level, or all the performance-related artifacts at spec level.

**Diagonal cross-cutting:** A security concern that touches vision, architecture, spec, and code simultaneously — navigate along that concern through all levels at once.

**Temporal archaeology:** "Show me what this requirement looked like when the current code was written, and trace all the decisions in between."

**Contradiction detection:** Two artifacts at different abstraction levels that express incompatible things — detected by the link graph's `contradicts` edges.

**Change impact forward:** When a rough requirement changes, which downstream artifacts does the link graph say will need to change?

**Change impact backward:** When a function is deleted, what upstream specs, decisions, and requirements are now unsatisfied?

---

## How This Complements Rather Than Replaces the Existing Designs

The **code introspection tool** (first conversation) becomes the navigation surface for the `abstraction_level 0-2` zone, with its pre-generated LLM insights feeding into `artifact_representation` rows. Its AST anchors become artifact IDs.

The **Living Substrate / SpecCells** operate in the `abstraction_level 2-6` zone. SpecCells are just artifacts at level ~4. The ImplementationGraph, EvidenceGraph, and ENF machinery connect to this fabric via standard artifact links — `derives_from`, `implements`, `tests`.

The **informal requirements end** (`abstraction_level 6-10`) is the genuinely new territory. Markdown design docs, rough requirements, vision statements — these become artifacts too, with their own representations and links downward into the formal machinery.

The **connecting fabric** — the artifact link graph, the temporal causation chains, the multi-modal representation registry — is what's been entirely absent. It's the thing that makes "navigate from this line of code all the way up to the loose requirement that motivated it" a single query rather than archaeology.

---

## The Single Most Important Table

If the existing designs had to be extended with one table that captures the missing concept, it's this:

```sql
CREATE TABLE artifact (
  artifact_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abstraction_level   FLOAT NOT NULL CHECK (abstraction_level BETWEEN 0 AND 10),
  artifact_kind       TEXT NOT NULL,
  stable_key          TEXT NOT NULL,
  content_hash        BYTEA NOT NULL,
  concern_dimensions  TEXT[] NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (stable_key)
);

CREATE TABLE artifact_link (
  source_id    UUID NOT NULL REFERENCES artifact(artifact_id),
  target_id    UUID NOT NULL REFERENCES artifact(artifact_id),
  link_kind    TEXT NOT NULL,
  confidence   FLOAT NOT NULL DEFAULT 1.0,
  provenance   TEXT NOT NULL,
  PRIMARY KEY (source_id, target_id, link_kind)
);

CREATE INDEX artifact_abstraction_idx ON artifact (abstraction_level);
CREATE INDEX artifact_link_source_idx ON artifact_link (source_id, link_kind);
CREATE INDEX artifact_link_target_idx ON artifact_link (target_id, link_kind);
```

Everything else in both prior designs — SpecCells, AST nodes, semantic types, ImplementationGraph, understanding slices — becomes a specialized view over artifacts linked in this graph. The `abstraction_level` column is what unifies them all into one navigable continuum rather than a collection of separate disconnected systems.

That continuous abstraction gradient, the typed bidirectional link graph spanning all levels, and the multi-modal representation architecture — that's the hyperdimensional piece that's been missing.
