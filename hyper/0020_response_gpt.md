Claude’s response is directionally strong. The most important things it captures are: the UI should be a **read-side navigator over precomputed projections**, knob turns should be indexed lookups rather than live inference, and the missing large-system layer is the **architecture stratum above modules/functions/AST**. 

Where I would complement or correct it is mostly around **versioning, evidence, canonical architecture modeling, runtime reality, and UI read-model discipline**.

---

# 1. Do not let `UUID[]` arrays become the canonical graph

Claude uses arrays like:

```sql
entity_ids UUID[]
nav_lateral UUID[]
nav_diagonal UUID[]
participant_app_ids UUID[]
participant_entity_ids UUID[]
```

That is fine as a **hot read cache**, but it should not be the source of truth.

For a state-of-the-art system, you want two layers:

```text
Canonical graph:
  normalized edge / membership tables

Hot UI read model:
  denormalized arrays, ordered packets, cached projection blobs
```

So instead of only:

```sql
semantic_clusters.entity_ids UUID[]
```

you want:

```sql
CREATE TABLE semantic_cluster_membership (
  cluster_id          uuid NOT NULL,
  entity_id           uuid NOT NULL,
  membership_role     text NOT NULL,
  membership_weight   numeric NOT NULL DEFAULT 1.0,
  rank                integer,
  confidence          numeric NOT NULL DEFAULT 1.0,
  evidence_json       jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (cluster_id, entity_id, membership_role)
);
```

And instead of only:

```sql
materialized_projections.nav_lateral UUID[]
materialized_projections.nav_diagonal UUID[]
```

you want:

```sql
CREATE TABLE projection_neighbor (
  projection_neighbor_id uuid PRIMARY KEY,

  projection_id          uuid NOT NULL,
  from_subject_kind      text NOT NULL,
  from_subject_id        uuid NOT NULL,

  to_subject_kind        text NOT NULL,
  to_subject_id          uuid NOT NULL,

  neighbor_kind          text NOT NULL,
  -- up, down, lateral, diagonal, execution_next, execution_prev,
  -- dependency_upstream, dependency_downstream, owner, test, config, runtime

  rank                   integer NOT NULL,
  salience_score         numeric NOT NULL DEFAULT 0.5,
  continuity_score       numeric NOT NULL DEFAULT 0.5,

  transition_payload_json jsonb NOT NULL DEFAULT '{}',

  UNIQUE (
    projection_id,
    from_subject_kind,
    from_subject_id,
    neighbor_kind,
    rank
  )
);
```

Then you can still materialize arrays for the UI:

```json
{
  "nav_lateral": ["uuid1", "uuid2", "uuid3"],
  "nav_diagonal": ["uuid4", "uuid5"]
}
```

But arrays should be **derived artifacts**, not canonical architecture.

---

# 2. The system needs a workspace snapshot, not just `repo.head_commit`

Claude’s initial `repos` table has `head_commit`, but a multi-repo architecture cannot be represented by one repo’s head.

You need an explicit **multi-repo snapshot**.

```sql
CREATE TABLE workspace_snapshot (
  snapshot_id        uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL,

  snapshot_name      text,
  snapshot_kind      text NOT NULL,
  -- production, staging, release_candidate, branch_aligned,
  -- arbitrary, historical, comparison_left, comparison_right

  created_at         timestamptz NOT NULL DEFAULT now(),
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE workspace_snapshot_member (
  snapshot_member_id uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  repo_id            uuid NOT NULL,
  commit_sha         text NOT NULL,
  branch_name        text,
  tag_name           text,

  role               text,
  -- primary, dependency, platform, infra, library, unknown

  UNIQUE (snapshot_id, repo_id)
);
```

Without this, you cannot answer:

```text
What did production architecture look like last Tuesday?
What changed between release candidate A and production?
Which repos participate in this service version?
Which cross-repo dependency is real for this deployable system?
```

A large code-understanding system should almost always be rooted in:

```text
workspace_snapshot
```

not:

```text
repo
```

---

# 3. Separate Mix project, OTP application, release, and runtime service

Claude’s `otp_applications` table is useful, but it risks conflating four different things:

| Concept             | Example                 | Why it matters               |
| ------------------- | ----------------------- | ---------------------------- |
| **Mix project**     | `apps/billing/mix.exs`  | Build/dependency/config unit |
| **OTP application** | `:billing`              | BEAM application identity    |
| **Release**         | `:commerce_api` release | Deployable package           |
| **Runtime service** | `billing-api-prod`      | Actual running service       |

These are related, but not identical.

A cleaner architecture model:

```sql
CREATE TABLE mix_project_root (
  mix_project_id     uuid PRIMARY KEY,
  repo_revision_id   uuid NOT NULL,

  project_root_path  text NOT NULL,
  mix_file_path      text NOT NULL,

  project_kind       text NOT NULL,
  -- regular, umbrella_parent, umbrella_child, tools_only, dependency_project

  parent_mix_project_id uuid,

  extraction_status  text NOT NULL,
  confidence         numeric NOT NULL DEFAULT 1.0,

  UNIQUE (repo_revision_id, mix_file_path)
);
```

```sql
CREATE TABLE otp_application_instance (
  otp_app_instance_id uuid PRIMARY KEY,

  mix_project_id      uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  app_name            text NOT NULL,
  application_module  text,
  version             text,

  extra_applications_json    jsonb NOT NULL DEFAULT '[]',
  included_applications_json jsonb NOT NULL DEFAULT '[]',

  has_application_callback   boolean NOT NULL DEFAULT false,
  has_supervision_tree       boolean NOT NULL DEFAULT false,

  UNIQUE (mix_project_id, app_name)
);
```

```sql
CREATE TABLE release_profile (
  release_profile_id uuid PRIMARY KEY,

  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  release_name       text NOT NULL,
  release_config_json jsonb NOT NULL DEFAULT '{}',

  included_apps_json jsonb NOT NULL DEFAULT '[]',
  runtime_config_paths_json jsonb NOT NULL DEFAULT '[]',

  UNIQUE (mix_project_id, release_name)
);
```

```sql
CREATE TABLE runtime_service (
  runtime_service_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,

  service_key        text NOT NULL,
  display_name       text NOT NULL,

  service_kind       text NOT NULL,
  -- phoenix_api, worker, release_node, scheduled_worker,
  -- library_only, external_service, unknown

  environment        text,
  -- dev, test, staging, prod, unknown

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, service_key, environment)
);
```

This lets the UI navigate:

```text
Mix project
  -> OTP app
    -> release
      -> runtime service
```

or in reverse:

```text
Production service
  -> release profile
    -> included OTP apps
      -> Mix projects
        -> source code
```

That is much closer to how large Elixir systems actually behave.

---

# 4. `mix.exs` extraction needs uncertainty handling

A `mix.exs` file is executable Elixir, not static JSON.

This means extraction should produce:

```text
exact_static
partial_static
evaluated_in_sandbox
env_dependent
dynamic_unknown
failed
```

You want a table like:

```sql
CREATE TABLE mix_extraction_result (
  extraction_id      uuid PRIMARY KEY,

  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  extraction_mode    text NOT NULL,
  -- ast_static, sandbox_eval, mix_project_stack, manual_override

  mix_env            text,
  -- dev, test, prod, all, unknown

  target             text NOT NULL,
  -- project, application, deps, aliases, releases, compilers, elixirc_paths

  result_json        jsonb NOT NULL DEFAULT '{}',

  extraction_status  text NOT NULL,
  -- exact_static, partial_static, env_dependent, dynamic_unknown, failed

  confidence         numeric NOT NULL DEFAULT 1.0,
  diagnostics_json   jsonb NOT NULL DEFAULT '[]',

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

Why this matters:

```elixir
def deps do
  if System.get_env("ENABLE_INTERNAL_DEPS") do
    [{:internal_auth, path: "../auth"}]
  else
    []
  end
end
```

Your architecture graph should not pretend this is statically certain.

---

# 5. Enums are too rigid for a novel system

Claude uses many enums:

```sql
CREATE TYPE understanding_dimension AS ENUM (...)
CREATE TYPE relation_kind AS ENUM (...)
CREATE TYPE arch_dimension AS ENUM (...)
```

Good for a prototype, but too rigid for the actual product.

A novel introspection system will constantly discover new dimensions:

```text
migration_risk
semantic_drift
runtime_blast_radius
ownership_conflict
domain_language_leakage
boundary_permeability
release_coupling
process_registry_coupling
```

Use registry tables instead:

```sql
CREATE TABLE dimension_registry (
  dimension_id       uuid PRIMARY KEY,

  dimension_key      text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  dimension_family   text NOT NULL,
  -- code, architecture, runtime, data, ownership, risk, testing, domain

  value_kind         text NOT NULL,
  -- categorical, ordinal, numeric, text, json, vector, path

  description        text,
  schema_json        jsonb NOT NULL DEFAULT '{}',

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE relation_type_registry (
  relation_type_id   uuid PRIMARY KEY,

  relation_key       text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  relation_family    text NOT NULL,
  -- structural, call, data, runtime, dependency, ownership,
  -- architecture, semantic, config, test

  directed           boolean NOT NULL DEFAULT true,
  transitive_hint    boolean NOT NULL DEFAULT false,

  schema_json        jsonb NOT NULL DEFAULT '{}'
);
```

Then your actual graph rows use registry keys:

```sql
relation_type_id uuid NOT NULL REFERENCES relation_type_registry(relation_type_id)
```

This makes the system extensible without schema churn.

---

# 6. Add evidence and provenance everywhere

Claude has `model_id`, `prompt_hash`, and `confidence`, but I would go further.

Every generated understanding should answer:

```text
What claim was made?
Who/what generated it?
What source evidence supports it?
What could invalidate it?
Has it been verified?
```

Add:

```sql
CREATE TABLE analysis_run (
  analysis_run_id    uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,
  analyzer_kind      text NOT NULL,
  -- static_pass, compiler_pass, llm, runtime_trace, user_annotation,
  -- architecture_inference, config_extractor

  analyzer_name      text NOT NULL,
  analyzer_version   text NOT NULL,

  model_provider     text,
  model_name         text,
  prompt_template_key text,
  prompt_template_hash text,

  input_scope_kind   text NOT NULL,
  input_scope_id     uuid,
  input_hash         text NOT NULL,

  output_schema_key  text,
  output_hash        text,

  status             text NOT NULL,
  diagnostics_json   jsonb NOT NULL DEFAULT '[]',

  started_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);
```

Then every slice should reference the run:

```sql
ALTER TABLE understanding_slices
ADD COLUMN analysis_run_id uuid REFERENCES analysis_run(analysis_run_id);

ALTER TABLE architectural_understanding
ADD COLUMN analysis_run_id uuid REFERENCES analysis_run(analysis_run_id);
```

And add evidence:

```sql
CREATE TABLE understanding_evidence (
  evidence_id        uuid PRIMARY KEY,

  understanding_id   uuid NOT NULL,

  evidence_kind      text NOT NULL,
  -- source_span, ast_node, relation, dependency, config_key,
  -- runtime_trace, test_case, doc_comment, user_annotation

  evidence_subject_kind text NOT NULL,
  evidence_subject_id   uuid,

  evidence_role      text NOT NULL,
  -- supports, weakens, contradicts, source_location, example,
  -- inferred_from, validates, invalidates

  quote_text         text,
  weight             numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

This is a big distinction between:

```text
“the model says this”
```

and:

```text
“the system believes this because these source spans, dependencies, traces, and tests support it”
```

The second is what makes the tool trustworthy.

---

# 7. Introduce an explicit “architecture anchor” layer

Claude has `code_entities` and then architecture tables. I would add a unifying anchor layer so architectural nodes, code nodes, runtime nodes, config keys, and data assets can all participate in one navigation system.

```sql
CREATE TABLE anchor (
  anchor_id          uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  anchor_kind        text NOT NULL,
  -- code_entity, source_span, mix_project, otp_app, release,
  -- runtime_service, bounded_context, api_surface, config_key,
  -- data_store, db_table, telemetry_event, test_case,
  -- external_system, team, architecture_edge

  subject_id         uuid NOT NULL,

  stable_key         text NOT NULL,
  display_label      text NOT NULL,

  salience_score     numeric NOT NULL DEFAULT 0.5,

  structural_hash    text,
  semantic_hash      text,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (snapshot_id, stable_key)
);
```

Then the whole product becomes:

```text
Everything important is an anchor.
Every explanation attaches to anchors.
Every projection renders anchors.
Every knob transition moves between anchors.
```

That simplifies the UI and the read model dramatically.

---

# 8. Add lineage across revisions

For a large system, the user will constantly ask:

```text
What changed?
Did this move?
Did this risk get worse?
Is this the same service under a new name?
Did this boundary violation already exist?
```

You need explicit lineage:

```sql
CREATE TABLE anchor_lineage (
  lineage_id         uuid PRIMARY KEY,

  from_snapshot_id   uuid NOT NULL,
  to_snapshot_id     uuid NOT NULL,

  from_anchor_id     uuid NOT NULL REFERENCES anchor(anchor_id),
  to_anchor_id       uuid NOT NULL REFERENCES anchor(anchor_id),

  match_kind         text NOT NULL,
  -- exact_hash, same_stable_key, renamed, moved, split,
  -- merged, fuzzy_structural, semantic_equivalent, manual

  match_score        numeric NOT NULL DEFAULT 1.0,

  evidence_json      jsonb NOT NULL DEFAULT '{}',

  UNIQUE (from_anchor_id, to_anchor_id, match_kind)
);
```

This enables temporal projections:

```text
Before / after architecture map
Risk delta
Dependency delta
Boundary violation delta
Semantic drift
Moved-but-equivalent function
Split service
Merged bounded context
```

Without lineage, every snapshot is a disconnected graph.

---

# 9. Runtime observation should be a first-class input

Static analysis and LLM inference are not enough.

For Elixir, runtime reality matters because:

```text
GenServer names may be dynamic
Registry dispatch may hide receivers
PubSub topics may be runtime strings
Oban/Broadway jobs may create async edges
Supervision children may be assembled dynamically
Phoenix routes may be runtime-expanded
Config changes behavior by environment
```

Add runtime traces:

```sql
CREATE TABLE runtime_observation_source (
  runtime_source_id  uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,

  source_kind        text NOT NULL,
  -- telemetry, opentelemetry, log_ingest, runtime_probe,
  -- test_run_trace, staging_trace, production_trace

  environment        text,
  collected_at       timestamptz NOT NULL DEFAULT now(),

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE runtime_trace_span (
  trace_span_id      uuid PRIMARY KEY,

  runtime_source_id  uuid NOT NULL REFERENCES runtime_observation_source(runtime_source_id),

  trace_id           text,
  span_id            text,
  parent_span_id     text,

  operation_name     text,
  module_name        text,
  function_name      text,
  arity              integer,

  service_key        text,
  process_label      text,

  started_at         timestamptz,
  duration_ms        numeric,

  attributes_json    jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE observed_runtime_edge (
  observed_edge_id   uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  source_anchor_id   uuid REFERENCES anchor(anchor_id),
  target_anchor_id   uuid REFERENCES anchor(anchor_id),

  edge_kind          text NOT NULL,
  -- observed_call, observed_message_send, observed_pubsub,
  -- observed_job_enqueue, observed_db_query, observed_http_call,
  -- observed_telemetry_event

  observation_count  bigint NOT NULL DEFAULT 1,
  p50_duration_ms    numeric,
  p95_duration_ms    numeric,
  error_rate         numeric,

  first_seen_at      timestamptz,
  last_seen_at       timestamptz,

  confidence         numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

Then static and runtime graphs can disagree productively:

```text
Static graph says this call is possible.
Runtime graph says it is hot.
Static graph missed this dynamic dispatch.
Runtime graph shows this dependency only exists in prod.
```

That is a major state-of-the-art feature.

---

# 10. Add data architecture, not just code architecture

For large Elixir systems, especially Phoenix/Ecto systems, the architecture is often organized around data ownership.

You need tables for:

```text
Ecto schemas
Repos
migrations
database tables
read/write edges
ownership
cross-context table access
event payload schemas
```

Suggested schema:

```sql
CREATE TABLE data_store (
  data_store_id      uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  store_kind         text NOT NULL,
  -- postgres, mysql, redis, ets, mnesia, s3, kafka, pubsub, unknown

  canonical_key      text NOT NULL,
  display_name       text NOT NULL,

  owner_entity_id    uuid,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (snapshot_id, canonical_key)
);
```

```sql
CREATE TABLE data_entity (
  data_entity_id     uuid PRIMARY KEY,

  data_store_id      uuid REFERENCES data_store(data_store_id),
  snapshot_id        uuid NOT NULL,

  entity_kind        text NOT NULL,
  -- db_table, ecto_schema, migration, event_schema,
  -- embedded_schema, ets_table, cache_keyspace

  canonical_key      text NOT NULL,
  display_name       text NOT NULL,

  defining_anchor_id uuid,
  owner_entity_id    uuid,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (snapshot_id, entity_kind, canonical_key)
);
```

```sql
CREATE TABLE data_access_edge (
  data_access_edge_id uuid PRIMARY KEY,

  snapshot_id         uuid NOT NULL,

  source_anchor_id    uuid REFERENCES anchor(anchor_id),
  source_entity_id    uuid,

  data_entity_id      uuid NOT NULL REFERENCES data_entity(data_entity_id),

  access_kind         text NOT NULL,
  -- reads, writes, migrates, validates, publishes, subscribes,
  -- serializes, deserializes, owns, foreign_reads

  confidence          numeric NOT NULL DEFAULT 1.0,
  evidence_json       jsonb NOT NULL DEFAULT '{}'
);
```

This enables projections like:

```text
Show me all cross-context data reads.
Show me who owns this table.
Show me what code writes invoices.
Show me what breaks if this schema changes.
Show me data flow from HTTP request to database write to event emission.
```

---

# 11. Add configuration architecture as a peer layer

Claude mentions config keys as API surfaces, which is right, but config deserves a full layer.

```sql
CREATE TABLE config_surface (
  config_surface_id  uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  mix_project_id     uuid,
  repo_id            uuid,

  config_kind        text NOT NULL,
  -- config_exs, runtime_exs, env_config, release_config,
  -- system_env, app_env, secrets, compile_time_config

  environment        text,
  -- dev, test, prod, runtime, all, unknown

  path               text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE config_binding (
  config_binding_id  uuid PRIMARY KEY,

  config_surface_id  uuid NOT NULL REFERENCES config_surface(config_surface_id),

  app_name           text,
  key_path           text[] NOT NULL,

  value_kind         text NOT NULL,
  -- literal, module_ref, function_ref, env_var, secret_ref,
  -- path, url, dynamic, unknown

  value_preview      text,
  value_hash         text,
  sensitivity        text NOT NULL DEFAULT 'normal',
  -- public, normal, sensitive, secret

  source_anchor_id   uuid,

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE config_effect_edge (
  config_effect_edge_id uuid PRIMARY KEY,

  snapshot_id          uuid NOT NULL,

  config_binding_id    uuid NOT NULL REFERENCES config_binding(config_binding_id),

  affected_anchor_id   uuid REFERENCES anchor(anchor_id),
  affected_entity_id   uuid,

  effect_kind          text NOT NULL,
  -- configures_repo, configures_endpoint, configures_worker,
  -- selects_adapter, controls_feature_flag, controls_runtime_behavior,
  -- affects_compile_time, affects_release

  confidence           numeric NOT NULL DEFAULT 1.0,
  evidence_json        jsonb NOT NULL DEFAULT '{}'
);
```

This matters because in Elixir:

```text
config can choose modules
config can choose repos
config can choose endpoints
config can change supervision children
runtime.exs can alter production behavior
compile-time config can permanently bake behavior
```

So config is not a side note. It is architecture.

---

# 12. Add boundary policy and rule evaluation

Claude has bounded contexts and context relations. The next step is to make boundary expectations executable.

```sql
CREATE TABLE architecture_policy (
  policy_id          uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,

  policy_key         text NOT NULL,
  display_name       text NOT NULL,

  policy_kind        text NOT NULL,
  -- forbidden_dependency, allowed_dependency, required_adapter,
  -- no_direct_repo_access, no_cross_context_schema_access,
  -- no_runtime_call, no_compile_time_dep, required_event_interface

  source_selector_json jsonb NOT NULL,
  target_selector_json jsonb NOT NULL,

  severity           text NOT NULL,
  -- info, warning, error, critical

  policy_source      text NOT NULL,
  -- manual, inferred, imported_doc, generated, team_standard

  enabled            boolean NOT NULL DEFAULT true,

  UNIQUE (workspace_id, policy_key)
);
```

```sql
CREATE TABLE architecture_policy_evaluation (
  evaluation_id      uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,
  policy_id          uuid NOT NULL REFERENCES architecture_policy(policy_id),

  status             text NOT NULL,
  -- passed, violated, unknown, not_applicable

  violation_count    integer NOT NULL DEFAULT 0,

  evaluated_at       timestamptz NOT NULL DEFAULT now(),
  diagnostics_json   jsonb NOT NULL DEFAULT '[]',

  UNIQUE (snapshot_id, policy_id)
);
```

```sql
CREATE TABLE architecture_policy_violation (
  violation_id       uuid PRIMARY KEY,

  evaluation_id      uuid NOT NULL REFERENCES architecture_policy_evaluation(evaluation_id),

  source_anchor_id   uuid REFERENCES anchor(anchor_id),
  target_anchor_id   uuid REFERENCES anchor(anchor_id),

  source_entity_id   uuid,
  target_entity_id   uuid,

  edge_id            uuid,

  title              text NOT NULL,
  explanation        text,

  severity_score     numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 1.0,

  evidence_json      jsonb NOT NULL DEFAULT '{}',

  status             text NOT NULL DEFAULT 'open'
);
```

Example policies:

```text
Billing may depend on Platform, but Platform may not depend on Billing.
Web modules may not call Repo directly.
Domain contexts may not read each other’s Ecto schemas.
Cross-context communication must go through events or public API modules.
Only infrastructure apps may own external HTTP clients.
```

This turns the system from a viewer into an architecture governance engine.

---

# 13. Add projection packets, not just materialized rows

Claude’s materialized projection idea is correct, but for the UI you probably want **projection packets**.

A projection packet is the complete read payload needed for one fixed UI state:

```text
current subject
panels
visible anchors
source excerpts
metric strips
neighbor lists
knob states
transition targets
prefetch hints
continuity mapping
```

Schema:

```sql
CREATE TABLE projection_packet (
  projection_packet_id uuid PRIMARY KEY,

  snapshot_id          uuid NOT NULL,

  viewpoint_key        text NOT NULL,
  root_anchor_id       uuid,

  axis_state_hash      text NOT NULL,
  axis_state_json      jsonb NOT NULL,

  packet_schema_version text NOT NULL,

  render_payload_json jsonb NOT NULL,

  prefetch_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  transition_keys_json jsonb NOT NULL DEFAULT '{}',

  packet_hash         text NOT NULL,

  generated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (
    snapshot_id,
    viewpoint_key,
    root_anchor_id,
    axis_state_hash
  )
);
```

And transitions:

```sql
CREATE TABLE projection_packet_transition (
  transition_id       uuid PRIMARY KEY,

  from_packet_id      uuid NOT NULL REFERENCES projection_packet(projection_packet_id),
  to_packet_id        uuid NOT NULL REFERENCES projection_packet(projection_packet_id),

  knob_key            text NOT NULL,
  knob_delta          text NOT NULL,
  -- tick_forward, tick_backward, jump, zoom_in, zoom_out

  affected_regions   text[] NOT NULL DEFAULT '{}',

  continuity_map_json jsonb NOT NULL DEFAULT '{}',
  -- maps old visible items to new visible items so the UI can animate
  -- without cognitive discontinuity

  transition_payload_json jsonb NOT NULL DEFAULT '{}',

  rank                integer
);
```

This is better than “lookup row, then lookup neighbors” because the UI can receive one coherent packet and render immediately.

---

# 14. Add semantic continuity as a first-class UI concern

Your UI concept depends on **high-speed modulation** without losing the user.

So when a knob changes:

```text
Function intent view
  -> Function risk view
```

or:

```text
App dependency view
  -> App runtime view
```

the system should know which visible things correspond across states.

Add:

```sql
CREATE TABLE projection_continuity_link (
  continuity_link_id uuid PRIMARY KEY,

  from_packet_id      uuid NOT NULL REFERENCES projection_packet(projection_packet_id),
  to_packet_id        uuid NOT NULL REFERENCES projection_packet(projection_packet_id),

  from_item_key       text NOT NULL,
  to_item_key         text NOT NULL,

  continuity_kind     text NOT NULL,
  -- same_anchor, same_entity, same_relation, same_concept,
  -- same_source_span, same_metric, transformed_representation

  continuity_score    numeric NOT NULL DEFAULT 1.0,

  metadata            jsonb NOT NULL DEFAULT '{}'
);
```

This lets the fixed UI avoid feeling like a slot machine. The user turns a knob and the page changes, but object identity remains legible.

That matters especially for the kind of cognitively precise, low-surprise interface you are describing.

---

# 15. Model tests as architecture evidence

Large codebases often reveal their architecture through tests:

```text
integration tests show service boundaries
fixtures show domain objects
mocks show external systems
contract tests show API surfaces
property tests show invariants
```

Add:

```sql
CREATE TABLE test_surface (
  test_surface_id    uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  test_kind          text NOT NULL,
  -- unit, integration, property, contract, acceptance,
  -- smoke, regression, generated, unknown

  test_anchor_id     uuid REFERENCES anchor(anchor_id),

  subject_anchor_id  uuid REFERENCES anchor(anchor_id),
  subject_entity_id  uuid,

  describes_behavior text,
  confidence         numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE test_evidence_edge (
  test_evidence_edge_id uuid PRIMARY KEY,

  snapshot_id           uuid NOT NULL,

  test_surface_id       uuid NOT NULL REFERENCES test_surface(test_surface_id),

  target_anchor_id      uuid REFERENCES anchor(anchor_id),

  evidence_kind         text NOT NULL,
  -- covers, asserts_contract, documents_behavior,
  -- verifies_boundary, mocks_dependency, exposes_invariant

  strength              numeric NOT NULL DEFAULT 1.0,
  confidence            numeric NOT NULL DEFAULT 1.0,

  evidence_json         jsonb NOT NULL DEFAULT '{}'
);
```

This enables views like:

```text
Show me the tests that define this service’s public contract.
Show me untested architectural boundaries.
Show me tests that mock a dependency that is actually a hard runtime dependency.
Show me invariants implied by property tests.
```

---

# 16. Add user corrections and architectural ground truth

The system will infer architecture. Sometimes it will be wrong.

You need a way for a human to say:

```text
No, this module is not Billing; it belongs to Shared Kernel.
This dependency is intentional.
This API surface is deprecated.
This service is owned by Platform, not Payments.
This generated explanation is wrong.
```

Schema:

```sql
CREATE TABLE user_annotation (
  user_annotation_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,

  subject_anchor_id  uuid REFERENCES anchor(anchor_id),
  subject_kind       text,
  subject_id         uuid,

  annotation_kind    text NOT NULL,
  -- correction, confirmation, override, label, note,
  -- deprecation, policy_exception, ownership_assignment

  annotation_json    jsonb NOT NULL DEFAULT '{}',
  prose_note         text,

  authority_level    text NOT NULL DEFAULT 'user',
  -- user, maintainer, architect, admin, imported_catalog

  created_by         text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE inference_override (
  inference_override_id uuid PRIMARY KEY,

  user_annotation_id uuid NOT NULL REFERENCES user_annotation(user_annotation_id),

  target_fact_id      uuid,
  target_edge_id      uuid,
  target_entity_id    uuid,

  override_kind       text NOT NULL,
  -- replace, suppress, pin, boost, demote, mark_verified,
  -- mark_wrong, mark_intentional_exception

  effective_from_snapshot_id uuid,
  effective_to_snapshot_id   uuid
);
```

This is essential because architecture understanding is partially social and contextual. The tool needs to learn from corrections.

---

# 17. Use an event log for ingestion and invalidation

The analysis pipeline should be reproducible and incrementally invalidated.

Add an event log:

```sql
CREATE TABLE indexing_event (
  indexing_event_id uuid PRIMARY KEY,

  workspace_id      uuid NOT NULL,
  snapshot_id       uuid,

  event_kind        text NOT NULL,
  -- repo_scanned, file_changed, mix_project_discovered,
  -- ast_parsed, entity_extracted, relation_built,
  -- llm_slice_generated, projection_materialized,
  -- runtime_trace_ingested, policy_evaluated

  subject_kind      text,
  subject_id        uuid,

  input_hash        text,
  output_hash       text,

  event_status      text NOT NULL,
  diagnostics_json  jsonb NOT NULL DEFAULT '[]',

  created_at        timestamptz NOT NULL DEFAULT now()
);
```

Then analysis tasks:

```sql
CREATE TABLE analysis_task (
  analysis_task_id  uuid PRIMARY KEY,

  snapshot_id       uuid NOT NULL,

  task_kind         text NOT NULL,
  -- parse_file, extract_mix, resolve_deps, build_call_graph,
  -- infer_contexts, generate_slice, build_projection,
  -- evaluate_policy

  target_anchor_id  uuid REFERENCES anchor(anchor_id),
  target_subject_kind text,
  target_subject_id uuid,

  input_hash        text NOT NULL,
  priority          integer NOT NULL DEFAULT 100,

  status            text NOT NULL DEFAULT 'pending',
  attempt_count     integer NOT NULL DEFAULT 0,

  created_at        timestamptz NOT NULL DEFAULT now(),
  started_at        timestamptz,
  completed_at      timestamptz,

  UNIQUE (snapshot_id, task_kind, target_subject_kind, target_subject_id, input_hash)
);
```

This lets you avoid full reanalysis when a single file or dependency changes.

---

# 18. Distinguish four graph types

One major conceptual improvement: do not treat “the graph” as a single graph.

You need at least four graph layers:

| Graph                  | Nodes                              | Edges                              |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **Structural graph**   | files, modules, functions, clauses | contains, defines                  |
| **Semantic graph**     | facts, concepts, clusters          | same concern, invariant, risk      |
| **Architecture graph** | apps, services, contexts, repos    | depends on, exposes API, owns data |
| **Runtime graph**      | processes, services, traces, jobs  | sends, calls, publishes, observes  |

The UI can project any of them, or overlay them.

Useful schema addition:

```sql
CREATE TABLE graph_layer (
  graph_layer_id    uuid PRIMARY KEY,

  layer_key         text NOT NULL UNIQUE,
  display_name      text NOT NULL,

  layer_kind        text NOT NULL,
  -- structural, semantic, architecture, runtime, data, ownership, config, test

  description       text
);
```

```sql
CREATE TABLE layered_edge (
  layered_edge_id   uuid PRIMARY KEY,

  snapshot_id       uuid NOT NULL,
  graph_layer_id    uuid NOT NULL REFERENCES graph_layer(graph_layer_id),

  source_anchor_id  uuid NOT NULL REFERENCES anchor(anchor_id),
  target_anchor_id  uuid NOT NULL REFERENCES anchor(anchor_id),

  relation_type     text NOT NULL,

  weight            numeric NOT NULL DEFAULT 1.0,
  confidence        numeric NOT NULL DEFAULT 1.0,

  evidence_json     jsonb NOT NULL DEFAULT '{}'
);
```

Then a knob can literally switch:

```text
graph_layer = structural
graph_layer = runtime
graph_layer = architecture
graph_layer = semantic
graph_layer = data
```

Same UI, different graph substrate.

---

# 19. Add path indexes for “diagonal navigation”

The killer feature is not just showing nodes. It is letting the user jump:

```text
function
  -> API surface
    -> consuming app
      -> bounded context
        -> owner team
          -> policy violation
            -> exact source call
```

That needs precomputed path indexes.

```sql
CREATE TABLE navigation_path_index (
  path_id           uuid PRIMARY KEY,

  snapshot_id       uuid NOT NULL,

  path_kind         text NOT NULL,
  -- execution_path, dependency_path, ownership_path,
  -- boundary_violation_path, data_lineage_path,
  -- config_effect_path, runtime_trace_path

  start_anchor_id   uuid NOT NULL REFERENCES anchor(anchor_id),
  end_anchor_id     uuid NOT NULL REFERENCES anchor(anchor_id),

  path_length       integer NOT NULL,
  total_cost        numeric NOT NULL DEFAULT 1.0,
  salience_score    numeric NOT NULL DEFAULT 0.5,
  confidence        numeric NOT NULL DEFAULT 1.0,

  summary           text,
  metadata          jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE navigation_path_step (
  path_step_id      uuid PRIMARY KEY,

  path_id           uuid NOT NULL REFERENCES navigation_path_index(path_id),

  step_index        integer NOT NULL,

  anchor_id         uuid NOT NULL REFERENCES anchor(anchor_id),
  edge_id           uuid,

  step_role         text,
  render_hint       text,

  UNIQUE (path_id, step_index)
);
```

This is what makes “horizontal” and “diagonal” navigation feel intentional rather than like graph wandering.

---

# 20. Final complementary architecture

The cleanest full design is:

```text
Workspace Snapshot
  ├── Physical Graph
  │     ├── repo groups
  │     ├── repositories
  │     └── files
  │
  ├── Build Graph
  │     ├── Mix projects
  │     ├── umbrellas
  │     ├── dependencies
  │     └── lockfiles
  │
  ├── OTP/Application Graph
  │     ├── OTP apps
  │     ├── releases
  │     ├── supervision trees
  │     └── runtime services
  │
  ├── Source Graph
  │     ├── modules
  │     ├── functions
  │     ├── clauses
  │     └── AST anchors
  │
  ├── Data Graph
  │     ├── Ecto schemas
  │     ├── migrations
  │     ├── database tables
  │     └── read/write ownership
  │
  ├── Config Graph
  │     ├── config files
  │     ├── runtime env
  │     ├── app env keys
  │     └── feature/config effects
  │
  ├── Runtime Graph
  │     ├── observed traces
  │     ├── telemetry events
  │     ├── GenServer/PubSub/job edges
  │     └── hot paths
  │
  ├── Semantic Graph
  │     ├── LLM facts
  │     ├── evidence
  │     ├── risks
  │     ├── invariants
  │     └── domain concepts
  │
  └── Projection Graph
        ├── packets
        ├── knobs
        ├── transitions
        ├── continuity links
        └── prefetch paths
```

Claude’s schema gets you much of the way there. The biggest upgrades I would make are:

1. **Snapshot-first multi-repo versioning**
2. **Canonical anchors across every layer**
3. **Separate Mix project / OTP app / release / runtime service**
4. **Normalized canonical graph with denormalized UI caches**
5. **Evidence-backed understanding, not just generated slices**
6. **Runtime traces as first-class graph input**
7. **Data/config/test architecture layers**
8. **Executable architecture policies**
9. **Projection packets with continuity links**
10. **Lineage across snapshots**

The central design sentence I would use now is:

> Build a versioned, multi-repository, multi-layer architecture graph whose leaves are AST-grounded code anchors, whose generated claims are evidence-backed, and whose UI consumes precomputed projection packets and transition indexes rather than performing live interpretation.
