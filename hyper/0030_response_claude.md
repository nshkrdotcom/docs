Codex produced a solid foundational design. What follows is strictly additive — gaps, undermodeled mechanisms, and Elixir-specific architecture seams that don't appear in that document.

---

## 1. The Projection State Space Problem (Unaddressed)

Codex defines `projection_transition` and `ui_axis_state` but doesn't address the combinatorial explosion. With 10 axes each having 5–10 discrete values, the cartesian product is ~10⁸ potential states. You cannot pre-materialize all of them.

You need a **coverage strategy**:

```sql
CREATE TABLE projection_materialization_policy (
  policy_id          uuid PRIMARY KEY,
  viewpoint_id       uuid NOT NULL REFERENCES viewpoint(viewpoint_id),

  strategy           text NOT NULL,
  -- 'star_from_defaults'     — all 1-axis deviations from defaults
  -- 'high_salience_only'     — only anchors above salience threshold
  -- 'hot_path_first'         — execution paths first
  -- 'user_session_driven'    — materialize on demand, cache LRU
  -- 'explicit_enumeration'   — hardcoded list of valid state tuples

  max_states_per_anchor  integer,
  salience_threshold     numeric,
  explicit_states_json   jsonb,     -- [{axis: value, ...}] for enumeration
  ttl_seconds            integer,   -- for LRU-cached on-demand states

  metadata               jsonb NOT NULL DEFAULT '{}'
);
```

The `star_from_defaults` strategy is the practical starting point: pre-materialize the default state for every anchor, plus all single-axis deviations. That covers most knob turns without state explosion. Diagonal combinations are computed on demand and cached.

**The transition graph must be a sparse directed graph over a bounded state set**, not an implicit all-pairs mapping. The `projection_transition` table should only contain edges that were actually materialized:

```sql
-- Add to projection_transition:
ALTER TABLE projection_transition ADD COLUMN is_materialized boolean NOT NULL DEFAULT false;
ALTER TABLE projection_transition ADD COLUMN on_demand_ttl_expires_at timestamptz;
```

A knob click: check `projection_transition` for a materialized edge → if found, serve; if not, trigger async materialization and serve a "loading" state with a degraded projection.

---

## 2. The mix.exs Evaluation Problem

Codex flags `extraction_status: dynamic_unknown` but doesn't describe how you actually get past it. `mix.exs` is arbitrary Elixir code. Static parsing gets you perhaps 70% of real-world projects. The other 30% use helper functions, conditionals on `Mix.env()`, `System.get_env/1`, external config files, etc.

The correct strategy is **sandboxed Mix evaluation**:

```sql
CREATE TABLE mix_project_eval_attempt (
  eval_attempt_id    uuid PRIMARY KEY,
  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  eval_strategy      text NOT NULL,
  -- 'static_ast_parse'
  -- 'sourceror_transform'
  -- 'sandboxed_mix_eval'      -- runs `mix run` in restricted env
  -- 'mix_xref_deps'           -- `mix xref graph --format dot`
  -- 'mix_deps_tree'           -- `mix deps.tree --format plain`
  -- 'manual_override'

  attempted_at       timestamptz NOT NULL DEFAULT now(),
  status             text NOT NULL,
  -- 'success', 'partial', 'failed', 'skipped'

  environment        text,    -- which Mix.env() was simulated
  env_overrides_json jsonb,   -- what env vars were injected

  result_json        jsonb,   -- what was extracted
  failure_reason     text,

  -- which fields were statically vs dynamically resolved
  resolution_map_json jsonb   -- {field: 'static'|'dynamic'|'unknown'}
);
```

Practically: run the ingestion worker as an Elixir node, invoke `mix deps.tree --format plain` and `mix xref graph --format dot` per project in an isolated env, and parse those outputs. This gets you the resolved dependency graph without having to evaluate `mix.exs` directly. Then reconcile with static parse for the fields those Mix tasks don't expose (aliases, compilers, release config).

**Critical:** `mix xref graph` resolves actual compile-time module dependencies — not just declared Mix deps but the actual module-level coupling. This is architecturally more precise than anything you can infer from source alone.

```sql
CREATE TABLE mix_xref_edge (
  xref_edge_id       uuid PRIMARY KEY,
  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  from_module        text NOT NULL,
  to_module          text NOT NULL,

  xref_kind          text NOT NULL,
  -- 'compile'   — compile-time coupling (dangerous to change)
  -- 'export'    — runtime call
  -- 'runtime'   — runtime but not direct call
  -- 'struct'    — struct access

  -- 'compile' edges are the critical ones:
  -- changing the target breaks the source at compile time even without changing the source
  is_compile_time    boolean NOT NULL GENERATED ALWAYS AS (xref_kind = 'compile') STORED,

  source_span_id     uuid REFERENCES source_span(span_id),
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX mix_xref_compile_edges_idx
  ON mix_xref_edge (mix_project_id, is_compile_time, from_module);
```

The compile-time vs runtime xref distinction is one of the most architecturally important facts you can have and is not modeled anywhere in the Codex design.

---

## 3. `use` as a Primary Architectural Coupling Mechanism

The Codex design models macros but does not elevate `use MyModule` as a distinct architectural coupling type. In Elixir, `use` is how Phoenix controllers, Ecto schemas, GenServers, Absinthe resolvers, and most framework components inject behavior. It is not just macro expansion — it is **behavioral inheritance and API contract injection**.

```sql
CREATE TABLE elixir_use_injection (
  use_injection_id   uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  using_module_anchor_id  uuid NOT NULL REFERENCES anchor(anchor_id),
  used_module_anchor_id   uuid REFERENCES anchor(anchor_id),
  used_module_name        text NOT NULL,

  opts_json               jsonb NOT NULL DEFAULT '{}',

  -- what the __using__ macro injected
  injected_functions_json jsonb NOT NULL DEFAULT '[]',
  injected_callbacks_json jsonb NOT NULL DEFAULT '[]',
  injected_attributes_json jsonb NOT NULL DEFAULT '[]',
  injected_imports_json   jsonb NOT NULL DEFAULT '[]',

  injection_kind          text NOT NULL,
  -- 'phoenix_controller', 'phoenix_live_view', 'ecto_schema',
  -- 'ecto_changeset', 'gen_server', 'gen_statem', 'supervisor',
  -- 'absinthe_resolver', 'oban_worker', 'broadway_pipeline',
  -- 'custom_behaviour', 'unknown'

  coupling_class          text NOT NULL,
  -- 'framework_adoption'   — module adopts a framework contract
  -- 'behaviour_provision'  — module gets callbacks + default impls
  -- 'code_generation'      — primary effect is generating new code
  -- 'import_injection'     — primary effect is scoping imports
  -- 'unknown'

  confidence              numeric NOT NULL DEFAULT 1.0
);
```

At the architecture level, a `use Phoenix.Controller` is not just a macro call — it is a **declaration of framework dependency** that implies an entire contract: params handling, conn pipeline, render, redirect, action fallback. This should surface as an architecture edge `edge_kind: 'framework_adoption'` between the module and the Phoenix app.

---

## 4. Telemetry Events as Architectural Seams

Elixir's `:telemetry` library creates invisible coupling across module and application boundaries. A function in `billing` can emit `[:billing, :payment, :stop]` and an observer in `telemetry_platform` can act on it — with no compile-time link between them. This is architecturally equivalent to a PubSub topic but completely invisible to static analysis.

Codex mentions telemetry as a `side_effect` in the data flow schema. It needs to be a first-class architectural entity:

```sql
CREATE TABLE telemetry_event_declaration (
  telemetry_event_id uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  event_name_parts   text[] NOT NULL,   -- [:billing, :payment, :stop]
  event_name_key     text NOT NULL,     -- 'billing.payment.stop'

  event_kind         text NOT NULL,
  -- 'start', 'stop', 'exception', 'span', 'custom'

  emitter_anchor_id  uuid REFERENCES anchor(anchor_id),
  emitter_app_id     uuid REFERENCES otp_application_instance(otp_app_instance_id),

  measurements_json  jsonb NOT NULL DEFAULT '{}',  -- declared measurement keys
  metadata_json      jsonb NOT NULL DEFAULT '{}',  -- declared metadata keys

  discovery_method   text NOT NULL,
  -- 'direct_execute_call', 'span_call', 'telemetry_docs',
  -- 'test_attach', 'llm_inferred'

  confidence         numeric NOT NULL DEFAULT 1.0
);

CREATE TABLE telemetry_event_handler (
  telemetry_handler_id uuid PRIMARY KEY,
  revision_id          uuid NOT NULL REFERENCES code_revision(revision_id),

  -- may match a prefix: [:billing] handles all billing events
  event_pattern_parts  text[] NOT NULL,
  is_prefix_match      boolean NOT NULL DEFAULT false,

  handler_anchor_id    uuid REFERENCES anchor(anchor_id),
  handler_app_id       uuid REFERENCES otp_application_instance(otp_app_instance_id),

  attach_call_anchor_id uuid REFERENCES anchor(anchor_id),  -- where :telemetry.attach/4 is called

  handler_purpose      text,  -- LLM-inferred
  confidence           numeric NOT NULL DEFAULT 1.0
);

-- Join: which handlers receive which events (cross-app coupling)
CREATE TABLE telemetry_event_coupling (
  coupling_id          uuid PRIMARY KEY,
  revision_id          uuid NOT NULL REFERENCES code_revision(revision_id),

  emitter_event_id     uuid NOT NULL REFERENCES telemetry_event_declaration(telemetry_event_id),
  handler_id           uuid NOT NULL REFERENCES telemetry_event_handler(telemetry_handler_id),

  coupling_confidence  numeric NOT NULL DEFAULT 1.0,
  -- < 1.0 when matched by prefix pattern
  match_kind           text NOT NULL
  -- 'exact', 'prefix_match', 'inferred'
);
```

This surfaces in the architecture graph as an `architecture_edge` with `edge_kind: 'telemetry_coupling'` and `layer: 'runtime'`. Without it, the architecture view of a well-instrumented Elixir system appears to have fewer cross-app dependencies than it actually does at runtime.

---

## 5. Ecto Repo as a Bounded Context Boundary

Codex mentions Ecto repos in passing. In practice, `Ecto.Repo` is the **actual data ownership boundary** in most Elixir systems. Which module calls which Repo, and which schemas belong to which Repo, is one of the most important architectural facts you can extract.

```sql
CREATE TABLE ecto_repo_declaration (
  ecto_repo_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  module_name        text NOT NULL,        -- MyApp.Repo
  otp_app_name       text NOT NULL,        -- :my_app
  adapter_module     text,                 -- Ecto.Adapters.Postgres

  anchor_id          uuid REFERENCES anchor(anchor_id),
  app_instance_id    uuid REFERENCES otp_application_instance(otp_app_instance_id),

  is_read_replica    boolean NOT NULL DEFAULT false,
  is_multi_tenant    boolean NOT NULL DEFAULT false,

  config_key_path    text[],  -- e.g. [:my_app, MyApp.Repo]
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE ecto_schema_ownership (
  schema_ownership_id uuid PRIMARY KEY,
  revision_id         uuid NOT NULL REFERENCES code_revision(revision_id),

  schema_module_anchor_id uuid NOT NULL REFERENCES anchor(anchor_id),
  ecto_repo_id            uuid REFERENCES ecto_repo_declaration(ecto_repo_id),

  -- which apps call this repo with this schema
  calling_app_ids         uuid[],

  ownership_kind          text NOT NULL,
  -- 'primary_owner'        — the app that owns and migrates this schema
  -- 'read_allowed'         — may query but not write/migrate
  -- 'cross_context_access' — another context accessing this directly (potential violation)
  -- 'shared_schema'        — intentionally shared (shared kernel)
  -- 'unknown'

  discovery_method        text NOT NULL,
  confidence              numeric NOT NULL DEFAULT 1.0
);
```

Cross-context schema access (`ownership_kind: 'cross_context_access'`) is one of the most common architectural violations in Elixir systems and is currently completely invisible in the Codex design. It should generate an `architecture_boundary_violation` automatically.

---

## 6. HEEx / LiveView as First-Class Architectural Entities

Phoenix LiveView and HEEx templates are absent from both schemas. In a Phoenix application they are architecturally significant: they define user-facing boundaries, they couple to specific context modules, and they have their own event/callback model.

```sql
CREATE TABLE phoenix_live_view_declaration (
  live_view_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  module_anchor_id   uuid NOT NULL REFERENCES anchor(anchor_id),
  module_name        text NOT NULL,

  mount_arity        integer,    -- mount/3 or mount/2
  render_anchor_id   uuid REFERENCES anchor(anchor_id),

  -- LiveView routes this is mounted at
  route_paths        text[],

  -- which contexts this LV calls directly
  context_module_ids uuid[],    -- symbol_ids

  -- event handlers
  handle_event_count integer,
  handle_info_count  integer,

  -- which assigns flow through this component
  assigns_schema_json jsonb NOT NULL DEFAULT '{}',

  is_live_component  boolean NOT NULL DEFAULT false,
  parent_live_view_id uuid REFERENCES phoenix_live_view_declaration(live_view_id),

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE heex_template (
  heex_template_id   uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  file_version_id    uuid REFERENCES source_file_version(file_version_id),
  owning_anchor_id   uuid REFERENCES anchor(anchor_id),  -- the render/1 fn or .heex file

  template_kind      text NOT NULL,
  -- 'embedded_heex'       — ~H sigil in .ex
  -- 'external_heex'       -- .heex file
  -- 'function_component'  -- attr/slot-based component
  -- 'core_component'      -- from CoreComponents

  -- component references within this template
  component_calls_json jsonb NOT NULL DEFAULT '[]',
  -- [{module, function, assigns_passed}]

  -- live_patch / live_navigate links
  navigation_targets_json jsonb NOT NULL DEFAULT '[]',

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

At the architecture level, LiveView modules should surface as `architecture_entity` with `entity_kind: 'live_view'` and edges connecting them to their context modules, their routes, and their parent Live components.

---

## 7. Mix.lock as a First-Class Artifact

The lockfile is the **ground truth of the resolved dependency graph** and is not modeled as an entity in either design. It should be:

```sql
CREATE TABLE mix_lockfile (
  lockfile_id        uuid PRIMARY KEY,

  repository_revision_id uuid NOT NULL REFERENCES repository_revision(repository_revision_id),
  owning_mix_project_id  uuid REFERENCES mix_project_root(mix_project_id),

  lockfile_path      text NOT NULL,
  content_hash       bytea NOT NULL,

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE mix_lockfile_entry (
  lockfile_entry_id  uuid PRIMARY KEY,
  lockfile_id        uuid NOT NULL REFERENCES mix_lockfile(lockfile_id),

  package_name       text NOT NULL,
  scm               text NOT NULL,   -- :hex, :git, :path

  -- hex
  hex_version        text,
  hex_hash           text,
  hex_outer_checksum text,

  -- git
  git_url            text,
  git_ref            text,
  git_sha            text,

  -- resolved transitive dep tree for this entry
  sub_deps_json      jsonb NOT NULL DEFAULT '[]',

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

The lockfile matters because:
- Version skew between umbrella children sharing a lockfile is an architectural risk
- Transitive dependency conflicts are a deployment risk  
- The difference between `mix.exs` declared version and `mix.lock` resolved version can be significant
- Cross-repo lockfile alignment is often a source of subtle runtime incompatibilities

---

## 8. Distributed BEAM Node Topology

For systems running distributed Erlang or libcluster, the architecture graph needs a layer Codex entirely omits:

```sql
CREATE TABLE beam_node_topology (
  node_topology_id   uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  topology_kind      text NOT NULL,
  -- 'single_node', 'static_cluster', 'dynamic_cluster',
  -- 'gossip_cluster', 'dns_cluster', 'kubernetes_cluster', 'unknown'

  clustering_library text,
  -- 'libcluster', 'partisan', 'erlang_dist', 'none', 'unknown'

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE beam_node_role (
  node_role_id       uuid PRIMARY KEY,
  node_topology_id   uuid NOT NULL REFERENCES beam_node_topology(node_topology_id),

  role_name          text NOT NULL,   -- 'web', 'worker', 'scheduler', etc.
  runtime_service_id uuid REFERENCES runtime_service(runtime_service_id),

  -- which OTP apps run on this node role
  app_instance_ids   uuid[],

  -- node-specific config overrides
  config_overrides_json jsonb NOT NULL DEFAULT '{}',

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE distributed_process_group (
  process_group_id   uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  group_kind         text NOT NULL,
  -- 'pg_scope', 'horde_registry', 'swarm', 'global_name',
  -- 'phoenix_presence', 'unknown'

  scope_name         text,
  owning_app_id      uuid REFERENCES otp_application_instance(otp_app_instance_id),

  -- which modules register/lookup in this group
  participant_anchor_ids uuid[],

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

For distributed Elixir, questions like "which processes might be running on multiple nodes simultaneously" and "which state is per-node vs. cluster-global" are architectural — and currently unrepresentable in either schema.

---

## 9. The LLM Extraction Protocol Gap

Codex defines `semantic_fact` output storage but never specifies the extraction protocol that produces it. This is a real design gap because the quality and consistency of facts depends entirely on prompt structure.

What's needed is a **fact extraction contract** per `fact_type`:

```sql
CREATE TABLE fact_extraction_spec (
  extraction_spec_id uuid PRIMARY KEY,
  fact_type          text NOT NULL,   -- matches semantic_fact.fact_type
  target_scope       text NOT NULL,   -- 'clause' | 'function' | 'module' | 'pipe_chain' | etc.

  -- what context must be assembled before prompting
  required_context_kinds text[] NOT NULL,
  -- ['source_excerpt', 'parent_module', 'callers', 'callees',
  --  'otp_role', 'spec', 'tests', 'sibling_clauses']

  -- max tokens for each context kind
  context_budget_json jsonb NOT NULL,

  -- the extraction output schema (what JSON structure the LLM must return)
  output_schema_json  jsonb NOT NULL,

  -- validation rules for the output
  validation_rules_json jsonb NOT NULL DEFAULT '[]',

  -- how to score confidence based on what context was available
  confidence_heuristic_json jsonb NOT NULL DEFAULT '{}',

  prompt_template_id  uuid REFERENCES prompt_template(prompt_template_id),

  metadata            jsonb NOT NULL DEFAULT '{}'
);
```

The `required_context_kinds` and `context_budget_json` together define the **context assembly problem**: for a function clause, you need its source, its enclosing module's purpose, its callers' intent if it's public, its spec if present, and its OTP role if applicable. These have different token costs and different reliability. The system needs to know what to include and what to drop when budget is tight.

Without this, the LLM annotation pipeline will produce inconsistent facts across different anchors because each analysis run will have ad-hoc context assembly.

---

## 10. The `anchor_coordinate` Sparse Tensor Query Strategy

The coordinate system in Codex (`dimension` / `dimension_value` / `anchor_coordinate`) is correct but will have severe query performance issues at scale without explicit design.

The query pattern for knob navigation is:

```sql
-- "Show me all functions in the auth concern with high risk"
SELECT a.anchor_id, a.display_label
FROM anchor_coordinate ac_concern
JOIN anchor_coordinate ac_risk
  ON ac_risk.anchor_id = ac_concern.anchor_id
WHERE ac_concern.dimension_id = <concern_dimension>
  AND ac_concern.value_id     = <auth_value>
  AND ac_risk.dimension_id    = <risk_dimension>
  AND ac_risk.numeric_value   > 0.7
ORDER BY ac_risk.numeric_value DESC;
```

This is a multi-dimensional sparse lookup with AND-semantics across dimension rows for the same anchor. With millions of anchors and dozens of dimensions this is an expensive join chain.

The solution: **a materialized sparse coordinate vector per anchor**:

```sql
CREATE MATERIALIZED VIEW mv_anchor_coordinate_vector AS
SELECT
  ac.revision_id,
  ac.anchor_id,
  -- pivot common dimensions into columns for fast filtering
  MAX(CASE WHEN d.dimension_key = 'abstraction_level'
      THEN dv.ordinal END)         AS abstraction_ordinal,
  MAX(CASE WHEN d.dimension_key = 'risk_class'
      THEN ac.numeric_value END)   AS risk_score,
  MAX(CASE WHEN d.dimension_key = 'cognitive_role'
      THEN dv.value_key END)       AS cognitive_role,
  MAX(CASE WHEN d.dimension_key = 'semantic_concern'
      THEN dv.value_key END)       AS primary_concern,
  MAX(CASE WHEN d.dimension_key = 'test_coverage'
      THEN dv.value_key END)       AS test_coverage,
  MAX(CASE WHEN d.dimension_key = 'certainty'
      THEN dv.ordinal END)         AS certainty_ordinal,
  -- etc.
  jsonb_object_agg(d.dimension_key,
    COALESCE(ac.numeric_value::text, dv.value_key)) AS full_coordinate_map
FROM anchor_coordinate ac
JOIN dimension d      ON d.dimension_id = ac.dimension_id
LEFT JOIN dimension_value dv ON dv.value_id = ac.value_id
GROUP BY ac.revision_id, ac.anchor_id;

CREATE UNIQUE INDEX mv_anchor_coord_vec_uidx
  ON mv_anchor_coordinate_vector (revision_id, anchor_id);

CREATE INDEX mv_anchor_coord_risk_idx
  ON mv_anchor_coordinate_vector (revision_id, risk_score DESC NULLS LAST);

CREATE INDEX mv_anchor_coord_concern_idx
  ON mv_anchor_coordinate_vector (revision_id, primary_concern);

CREATE INDEX mv_anchor_coord_gin_idx
  ON mv_anchor_coordinate_vector USING GIN (full_coordinate_map);
```

The pivoted columns handle the hot multi-dimension filter queries with plain B-tree indexes. The GIN index on `full_coordinate_map` handles arbitrary dimension combinations. Most knob states map to a query against this single materialized view rather than a multi-join across `anchor_coordinate`.

---

## Summary: What Codex Covered vs. What's Added Here

| Area | Codex | Here |
|---|---|---|
| Core schema + AST | Complete | — |
| Architecture layers | Complete | — |
| Projection state space | Tables only | Coverage strategy, LRU, sparse state design |
| mix.exs evaluation | Flagged | Sandboxed eval + `mix xref` integration |
| `use` injection coupling | Partial (macro) | First-class with coupling_class |
| Telemetry seams | Side effect field | Full emitter/handler/coupling tables |
| Ecto repo as boundary | Mentioned | Schema + cross-context violation detection |
| HEEx / LiveView | Absent | Declaration + template tables |
| Mix.lock | Mentioned | First-class artifact + entry table |
| Distributed BEAM topology | Absent | Node roles, process groups, cluster topology |
| LLM extraction protocol | Store-only | Context assembly contract per fact_type |
| Coordinate query performance | Tables only | Pivoted materialized view + index strategy |
| `mix xref` compile edges | Absent | Compile-time vs runtime xref first-class |
