## Codebase Understanding Engine — Data Schema Design

The core insight: this is a **pre-materialized hyperdimensional index** over an AST, where the UI is purely a read-side navigator over pre-computed projections. No realtime inference at view time — all LLM work is offline. Knob turns are indexed lookups.

---

### Conceptual Architecture

```
AST Parse → Entity Extraction → LLM Annotation Pipeline → 
  Dimensional Understanding Slices → Relation Graph → 
    Materialized Projections → Navigation Index → UI
```

---

### Core Tables

```sql
-- ============================================================
-- LAYER 0: Repositories & Parse Artifacts
-- ============================================================

CREATE TABLE repos (
  id           UUID PRIMARY KEY,
  name         TEXT NOT NULL,
  root_path    TEXT NOT NULL,
  head_commit  TEXT,
  indexed_at   TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}'
);

-- ============================================================
-- LAYER 1: AST-Anchored Code Entities
-- The fundamental unit. Every node that matters gets a row.
-- ============================================================

CREATE TYPE entity_kind AS ENUM (
  'repo', 'file', 'module', 'protocol', 'impl',
  'behaviour', 'macro', 'function', 'clause',
  'guard', 'expression', 'type_spec', 'callback',
  'attribute', 'struct_field', 'supervision_child'
);

CREATE TABLE code_entities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id          UUID NOT NULL REFERENCES repos(id),
  parent_id        UUID REFERENCES code_entities(id),  -- tree parent
  kind             entity_kind NOT NULL,
  qualified_name   TEXT NOT NULL,     -- "MyApp.Server.handle_call/3[clause:2]"
  file_path        TEXT,
  loc_start        INT,
  loc_end          INT,
  col_start        INT,
  col_end          INT,
  ast_node         JSONB NOT NULL,    -- raw quoted AST
  ast_path         LTREE NOT NULL,    -- MyApp.Server.handle_call.clause_2.case_1
  node_hash        TEXT NOT NULL,     -- SHA of normalized AST node (for diffing)
  arity            INT,               -- for functions
  visibility       TEXT,              -- :public | :private
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON code_entities USING GIST (ast_path);
CREATE INDEX ON code_entities (repo_id, kind);
CREATE INDEX ON code_entities (qualified_name);
CREATE INDEX ON code_entities (parent_id);
CREATE INDEX ON code_entities (node_hash);
```

---

```sql
-- ============================================================
-- LAYER 2: Dimensional Understanding Slices
-- LLM-generated structured understanding, one row per
-- (entity × dimension × granularity) tuple.
-- This is the bulk of the data.
-- ============================================================

CREATE TYPE understanding_dimension AS ENUM (
  'intent',        -- what it does and why it exists
  'behavior',      -- runtime behavior, side effects, state changes
  'data_flow',     -- what flows in, what flows out, transforms
  'execution',     -- control flow, branches, recursion shape
  'contracts',     -- pre/postconditions, specs, dialyzer facts
  'errors',        -- failure modes, error handling topology
  'concurrency',   -- process boundaries, message passing, OTP role
  'dependencies',  -- what this needs, what needs this
  'patterns',      -- idioms, design patterns, Elixir conventions used
  'domain',        -- business concept / domain meaning
  'complexity',    -- cognitive load, hotspot classification
  'macro_expansion'-- for macros: what they expand into conceptually
);

CREATE TABLE understanding_slices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id       UUID NOT NULL REFERENCES code_entities(id),
  dimension       understanding_dimension NOT NULL,
  -- granularity: 0=one-liner, 5=paragraph, 10=deep technical
  granularity     SMALLINT NOT NULL CHECK (granularity BETWEEN 0 AND 10),
  content         JSONB NOT NULL,    -- structured, schema varies by dimension
  prose_summary   TEXT,              -- always-present human text, full-text indexed
  model_id        TEXT NOT NULL,     -- which model generated this
  prompt_hash     TEXT,              -- hash of the prompt template used
  confidence      FLOAT,            -- model self-assessed or heuristic
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (entity_id, dimension, granularity)
);

CREATE INDEX ON understanding_slices (entity_id, dimension);
CREATE INDEX ON understanding_slices USING GIN (to_tsvector('english', prose_summary));
```

**`content` JSONB schema by dimension (examples):**

```jsonb
-- intent (granularity 3)
{
  "summary": "Handles connection timeout by draining the queue then terminating cleanly",
  "rationale": "Avoids message loss during controlled shutdown",
  "analogy": "Like a cashier finishing the current customer before closing the register",
  "tags": ["lifecycle", "cleanup", "timeout"]
}

-- data_flow
{
  "inputs": [
    {"name": "state", "type": "%ServerState{}", "role": "primary", "mutable": false}
  ],
  "outputs": [
    {"name": "reply", "type": "{:ok, result} | {:error, reason}", "path": "normal"},
    {"name": "new_state", "type": "%ServerState{}", "path": "normal"}
  ],
  "transforms": [
    {"from": "raw_request", "to": "normalized_request", "via": "parse_request/1"}
  ],
  "side_effects": ["emits telemetry event", "may write to ETS"]
}

-- execution
{
  "entry_points": ["GenServer callback"],
  "branches": [
    {"condition": "request.type == :read", "probability": "high", "tail": false},
    {"condition": "state.locked?", "probability": "rare", "tail": false}
  ],
  "recursion": null,
  "terminal_forms": ["reply/2", "{:noreply, state}"]
}

-- concurrency
{
  "process_role": "server",
  "otp_callback": "handle_call",
  "blocks_caller": true,
  "spawns": [],
  "sends_to": ["MetricsCollector"],
  "ets_access": [{"table": ":request_cache", "op": "read"}],
  "supervision_tree_depth": 2
}

-- complexity
{
  "cyclomatic": 4,
  "clause_count": 3,
  "nesting_depth": 2,
  "pattern_match_complexity": "moderate",
  "hotspot_score": 0.73,
  "cognitive_load_estimate": "medium",
  "recommended_split": false
}
```

---

```sql
-- ============================================================
-- LAYER 3: Relation Graph
-- Typed edges between entities. This is the navigation fabric.
-- ============================================================

CREATE TYPE relation_kind AS ENUM (
  -- call graph
  'calls', 'called_by', 'tail_calls',
  -- structural
  'contains', 'contained_by',
  'defines_type', 'uses_type',
  -- OTP
  'supervises', 'supervised_by',
  'sends_message_to', 'receives_message_from',
  'spawns', 'spawned_by',
  'monitors', 'monitored_by',
  -- data
  'reads_from', 'writes_to',
  'produces', 'consumes',
  -- protocol/behaviour
  'implements', 'implemented_by',
  'defines_callback', 'satisfies_callback',
  -- macro
  'expands_from', 'generates',
  -- dependency
  'imports', 'aliases', 'uses_module',
  -- pattern
  'dispatches_to',   -- multi-clause dispatch
  'guards_with',
  -- semantic
  'conceptually_groups_with'  -- LLM-inferred semantic proximity
);

CREATE TABLE entity_relations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id       UUID NOT NULL REFERENCES code_entities(id),
  to_id         UUID NOT NULL REFERENCES code_entities(id),
  kind          relation_kind NOT NULL,
  weight        FLOAT DEFAULT 1.0,    -- salience for navigation priority
  dynamic       BOOLEAN DEFAULT FALSE, -- runtime vs. static relation
  metadata      JSONB DEFAULT '{}',
  UNIQUE (from_id, to_id, kind)
);

CREATE INDEX ON entity_relations (from_id, kind);
CREATE INDEX ON entity_relations (to_id, kind);
```

---

```sql
-- ============================================================
-- LAYER 4: Semantic Clusters
-- Groupings that cut across AST hierarchy — the "diagonal" axis.
-- LLM-inferred or heuristic-derived.
-- ============================================================

CREATE TYPE cluster_kind AS ENUM (
  'domain_concept',       -- all code pertaining to e.g. "billing"
  'otp_component',        -- a supervision subtree + its workers
  'data_pipeline',        -- a chain of transforms
  'error_boundary',       -- everything that handles a class of failure
  'design_pattern',       -- e.g. "saga pattern", "circuit breaker"
  'hot_path',             -- high-frequency execution path
  'ownership_surface'     -- code owned by a conceptual team/concern
);

CREATE TABLE semantic_clusters (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id          UUID NOT NULL REFERENCES repos(id),
  kind             cluster_kind NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  centroid_id      UUID REFERENCES code_entities(id),
  entity_ids       UUID[] NOT NULL,
  salience_score   FLOAT,   -- how "important" this cluster is
  metadata         JSONB DEFAULT '{}'
);

CREATE TABLE cluster_memberships (
  cluster_id     UUID NOT NULL REFERENCES semantic_clusters(id),
  entity_id      UUID NOT NULL REFERENCES code_entities(id),
  membership_weight FLOAT DEFAULT 1.0,  -- partial membership
  PRIMARY KEY (cluster_id, entity_id)
);
```

---

```sql
-- ============================================================
-- LAYER 5: Projection Configs
-- The "lens" — what combination of dimensions and weights
-- defines a particular way of looking at the codebase.
-- These correspond to named knob presets.
-- ============================================================

CREATE TABLE projection_configs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL UNIQUE,  -- "OTP Topology", "Data Flow", "Beginner"
  description      TEXT,
  -- which dimensions are active and at what weight
  dimension_weights JSONB NOT NULL,
  -- {intent: 1.0, concurrency: 0.9, behavior: 0.5, complexity: 0.0}
  -- per-dimension granularity target
  granularity_map   JSONB NOT NULL,
  -- {intent: 3, concurrency: 7, behavior: 5}
  -- how to traverse neighbors
  nav_relation_types TEXT[],   -- which relation_kinds to follow for navigation
  focus_scope       TEXT,      -- 'entity' | 'cluster' | 'path' | 'file'
  is_preset         BOOLEAN DEFAULT FALSE,
  metadata          JSONB DEFAULT '{}'
);

-- Preset examples:
-- "Executive": {intent: 10, domain: 10, complexity: 5} @ granularity 2
-- "Data Flow": {data_flow: 10, contracts: 8, behavior: 6} @ granularity 6
-- "OTP Architect": {concurrency: 10, patterns: 7, errors: 8} @ granularity 7
-- "Deep Dive": all dimensions @ granularity 10
-- "Newcomer": {intent: 10, patterns: 8, domain: 7} @ granularity 4
```

---

```sql
-- ============================================================
-- LAYER 6: Materialized Projections
-- The actual pre-rendered "pages" — what the UI reads.
-- One row per (entity × projection_config).
-- This is the hot read path.
-- ============================================================

CREATE TABLE materialized_projections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id         UUID NOT NULL REFERENCES code_entities(id),
  config_id         UUID NOT NULL REFERENCES projection_configs(id),
  -- the rendered content blob the UI displays
  rendered          JSONB NOT NULL,
  -- pre-computed navigation neighbors in this projection
  nav_prev_id       UUID REFERENCES code_entities(id),
  nav_next_id       UUID REFERENCES code_entities(id),
  nav_up_id         UUID REFERENCES code_entities(id),   -- abstraction up
  nav_down_id       UUID REFERENCES code_entities(id),   -- abstraction down
  nav_lateral       UUID[],  -- same-level siblings/peers
  nav_diagonal      UUID[],  -- cross-cutting cluster members
  nav_execution_next UUID[], -- next nodes in execution order
  cluster_ids       UUID[],  -- clusters this entity belongs to
  source_slice_ids  UUID[],  -- which understanding_slices were used
  generated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (entity_id, config_id)
);

CREATE INDEX ON materialized_projections (entity_id, config_id);
CREATE INDEX ON materialized_projections (config_id);
```

**`rendered` JSONB structure:**

```jsonb
{
  "entity": {
    "id": "uuid",
    "kind": "function",
    "qualified_name": "MyApp.Server.handle_call/3",
    "loc": {"file": "lib/server.ex", "start": 42, "end": 67}
  },
  "panels": {
    "primary": {
      "dimension": "intent",
      "granularity": 3,
      "content": { ... slice content ... }
    },
    "secondary": [
      {"dimension": "behavior", "granularity": 5, "content": {...}},
      {"dimension": "concurrency", "granularity": 7, "content": {...}}
    ],
    "overlay": {
      "dimension": "complexity",
      "content": {"hotspot_score": 0.73, "visual_hint": "warm"}
    }
  },
  "source_excerpt": {
    "lines": ["  def handle_call({:get, key}, _from, state) do", ...],
    "annotations": [
      {"line": 44, "kind": "data_flow_in", "label": "key: term()"},
      {"line": 48, "kind": "side_effect", "label": "ETS read"}
    ]
  },
  "nav_labels": {
    "up": "MyApp.Server (module)",
    "down": "clause 1 of 3",
    "lateral": ["handle_cast/2", "handle_info/2"],
    "execution_next": ["validate_key/1", "Cache.fetch/2"]
  }
}
```

---

```sql
-- ============================================================
-- LAYER 7: Knob Definitions
-- What each physical "knob" in the UI controls.
-- Discrete steps → maps to config/query changes.
-- ============================================================

CREATE TYPE knob_kind AS ENUM (
  'projection_selector',    -- switches active projection_config
  'granularity_global',     -- shifts all granularities up/down
  'dimension_spotlight',    -- brings one dimension to foreground
  'relation_filter',        -- which relation types nav follows
  'scope_zoom',             -- entity → file → module → cluster
  'cluster_navigator',      -- walks through cluster membership
  'execution_tracer',       -- steps along a hot_path cluster
  'abstraction_level'       -- zooms in/out on AST depth
);

CREATE TABLE knob_definitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  kind          knob_kind NOT NULL,
  affects_scope TEXT NOT NULL,   -- 'full_page' | 'primary_panel' | 'overlay'
  steps         JSONB NOT NULL,  -- ordered array of discrete step values
  default_step  INT DEFAULT 0,
  description   TEXT
);

-- Navigation history for session replay / breadcrumbing
CREATE TABLE navigation_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id       UUID NOT NULL REFERENCES repos(id),
  breadcrumb    JSONB[],   -- [{entity_id, config_id, knob_state, timestamp}]
  started_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Key Design Decisions

**Why ltree for `ast_path`?**
Enables `@>` and `<@` ancestor/descendant queries across the AST without recursion. `MyApp.Server.*` returns everything inside that module efficiently. The "scope zoom" knob is a single ltree query.

**Why pre-materialized projections?**
The knob turn latency budget is ~16ms for 60fps feel. LLM inference is seconds. Pre-generation shifts all cost offline. The entire UI is a read-only index scan.

**Why `UUID[]` for nav neighbors?**
Avoids joins at read time. The `nav_execution_next`, `nav_lateral`, `nav_diagonal` arrays are populated at materialization time, so a knob turn is: current entity ID → lookup materialized row → return neighbor IDs → fetch those rows. Three indexed lookups.

**Generation pipeline order:**
```
1. Parse AST → code_entities + entity_relations (static analysis)
2. Infer semantic_clusters (heuristic + LLM)  
3. Generate understanding_slices (LLM, parallelized by entity)
4. Materialize materialized_projections per config (fan-out)
5. Build navigation index (populate nav_* arrays)
```

**Elixir-specific extensions to add:**
`macro_expansion_slices` (separate table for multi-stage expansions), `otp_topology_graph` (dedicated supervision tree view), `typespec_contracts` (dialyzer-derived, not LLM-derived), `pipe_chains` (materializing `|>` sequences as their own navigable entities).

This schema is the complete pre-computation substrate. The UI is a pure read client — every knob turn is a row lookup with pre-populated neighbors.
