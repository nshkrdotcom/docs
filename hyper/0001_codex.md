# Design: Data-Driven Code Introspection System for Elixir

The core object is **not an AST viewer**. It is a **semantic projection engine** over a codebase.

The AST is the anchor layer. Around it you build a multidimensional semantic graph: symbols, calls, clauses, execution paths, dataflow, macro expansion, OTP structure, risks, invariants, explanations, generated summaries, test links, change impact, and UI-ready materialized projections.

The UI then becomes a high-speed control surface over precomputed slices.

## 1. Core Concept

### Name the internal structure

I would model this as a:

> **Code Understanding Hypergraph**

A normal graph is not enough because many important code facts are not simply `A -> B`. For example:

> “This function clause handles failed password reset tokens by pattern-matching `{:error, reason}`, then routes the failure through a telemetry event and returns a Phoenix redirect.”

That fact connects:

* a function clause
* a pattern
* a branch
* a return shape
* an execution path
* a concern: authentication
* a concern: observability
* a user-facing behavior
* a risk classification
* one or more source spans

So the primitive should be:

> **A versioned, evidence-backed semantic fact attached to one or more code anchors.**

The AST gives you precise location. The graph gives you meaning. The projection layer gives the human an interactive view.

For Elixir specifically, the parser and AST layer should preserve columns, token metadata, comments, and literal/source fidelity where possible. Elixir’s `Code.string_to_quoted/2` exposes parser options such as `:columns`, `:token_metadata`, `:unescape`, and `:literal_encoder`; `Code.string_to_quoted_with_comments/2` also returns comments, which matters for high-fidelity source understanding. Elixir’s own docs note that ordinary AST metadata does not fully preserve literals, comments, and formatting choices unless additional parser options are used. ([hexdocs.pm][1])

---

# 2. System Layers

```text
┌──────────────────────────────────────────────────────────────┐
│ UI projection layer                                           │
│ Fixed panels, knobs, slices, transitions, render fragments     │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌──────────────────────────────────────────────────────────────┐
│ Materialized projection layer                                 │
│ Precomputed views for execution paths, modules, risks, etc.    │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌──────────────────────────────────────────────────────────────┐
│ Semantic hypergraph                                            │
│ Facts, claims, evidence, dimensions, relations, coordinates     │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌──────────────────────────────────────────────────────────────┐
│ Elixir code model                                              │
│ AST nodes, source spans, symbols, clauses, calls, macros, OTP   │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌──────────────────────────────────────────────────────────────┐
│ Repository snapshot                                            │
│ Repo, commit, files, source blobs, parser artifacts             │
└──────────────────────────────────────────────────────────────┘
```

The UI does **not** run expensive analysis when the user turns a knob. A knob change should hit precomputed tables like:

```text
projection_instance
projection_item
projection_transition
mv_function_card
mv_execution_slice
mv_concern_slice
mv_anchor_neighbors
```

That is the difference between a tool that feels instantaneous and one that feels like an AI chat wrapper over a repo.

---

# 3. Primary Design Principle

Every stored insight should answer four questions:

```text
What code is this about?
What does the system believe about it?
Why does it believe that?
Which projection/view can use it?
```

That yields four foundation entities:

| Entity                | Purpose                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `anchor`              | Stable pointer to AST node, source span, symbol, relation, or projection |
| `semantic_fact`       | Generated or static understanding attached to anchors                    |
| `semantic_relation`   | Typed edges between anchors                                              |
| `projection_instance` | Precomputed UI slice for a particular viewpoint/knob state               |

---

# 4. Repository and Source Schema

```sql
CREATE TABLE codebase (
  codebase_id        uuid PRIMARY KEY,
  name               text NOT NULL,
  root_uri           text,
  language_primary   text NOT NULL DEFAULT 'elixir',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE code_revision (
  revision_id        uuid PRIMARY KEY,
  codebase_id        uuid NOT NULL REFERENCES codebase(codebase_id),
  vcs_provider       text,
  commit_sha         text,
  branch_name        text,
  revision_label     text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (codebase_id, commit_sha)
);

CREATE TABLE source_file (
  file_id            uuid PRIMARY KEY,
  codebase_id        uuid NOT NULL REFERENCES codebase(codebase_id),
  path               text NOT NULL,
  file_kind          text NOT NULL, -- ex, exs, heex, config, mix, test, markdown
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (codebase_id, path)
);

CREATE TABLE source_file_version (
  file_version_id    uuid PRIMARY KEY,
  file_id            uuid NOT NULL REFERENCES source_file(file_id),
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),
  content_hash       bytea NOT NULL,
  byte_length        integer NOT NULL,
  line_count         integer,
  source_text        text NOT NULL,
  is_deleted         boolean NOT NULL DEFAULT false,
  UNIQUE (file_id, revision_id)
);

CREATE TABLE source_span (
  span_id            uuid PRIMARY KEY,
  file_version_id    uuid NOT NULL REFERENCES source_file_version(file_version_id),

  start_byte         integer NOT NULL,
  end_byte           integer NOT NULL,

  start_line         integer NOT NULL,
  start_col          integer NOT NULL,
  end_line           integer NOT NULL,
  end_col            integer NOT NULL,

  text_hash          bytea,
  preview_text       text
);

CREATE INDEX source_span_file_range_idx
  ON source_span (file_version_id, start_line, start_col, end_line, end_col);
```

## Why this matters

The source span is a first-class object. Do not bury it inside AST metadata only. The interface will constantly need to render source-aligned cards, highlights, deltas, and snippets.

---

# 5. Parse Artifact and AST Schema

Elixir’s `Macro` module is the official manipulation layer for AST work; macros receive AST as input and return AST as output, and the module exposes traversal functions such as `prewalk`, `postwalk`, `path`, and `traverse`. ([hexdocs.pm][2])

```sql
CREATE TABLE parse_artifact (
  parse_id           uuid PRIMARY KEY,
  file_version_id    uuid NOT NULL REFERENCES source_file_version(file_version_id),

  parser_name        text NOT NULL, -- elixir_code, sourceror, custom
  parser_version     text NOT NULL,
  ast_mode           text NOT NULL,
  -- lexical, normalized, macro_expanded, formatter_preserving, etc.

  parser_options     jsonb NOT NULL DEFAULT '{}',
  root_node_id       uuid,

  parse_status       text NOT NULL DEFAULT 'ok',
  diagnostics        jsonb NOT NULL DEFAULT '[]',

  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ast_node (
  node_id            uuid PRIMARY KEY,
  parse_id           uuid NOT NULL REFERENCES parse_artifact(parse_id),

  parent_node_id     uuid REFERENCES ast_node(node_id),
  ast_path           integer[] NOT NULL,
  child_index        integer,

  node_kind          text NOT NULL,
  -- module_def, function_def, macro_def, clause, call, remote_call,
  -- pipe, match, case, cond, with, try, receive, send, literal,
  -- alias, import, require, attribute, typespec, protocol, impl, etc.

  ast_form           text,
  -- tuple3, literal, list, block, special_form, operator, unknown

  operator_name      text,
  atom_name          text,
  literal_kind       text,
  arity              integer,

  span_id            uuid REFERENCES source_span(span_id),

  ast_metadata       jsonb NOT NULL DEFAULT '{}',
  raw_ast_json       jsonb,
  normalized_hash    bytea NOT NULL,
  subtree_hash       bytea NOT NULL,

  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (parse_id, ast_path)
);

CREATE INDEX ast_node_parent_idx
  ON ast_node (parent_node_id);

CREATE INDEX ast_node_kind_idx
  ON ast_node (parse_id, node_kind);

CREATE INDEX ast_node_hash_idx
  ON ast_node (subtree_hash);
```

## Optional but useful

```sql
CREATE TABLE ast_edge (
  edge_id            uuid PRIMARY KEY,
  parse_id           uuid NOT NULL REFERENCES parse_artifact(parse_id),
  parent_node_id     uuid NOT NULL REFERENCES ast_node(node_id),
  child_node_id      uuid NOT NULL REFERENCES ast_node(node_id),
  child_index        integer NOT NULL,
  edge_role          text,
  -- body, lhs, rhs, guard, argument, pattern, clause, do_block, else_block
  UNIQUE (parent_node_id, child_node_id)
);
```

This lets you navigate the AST without repeatedly unpacking JSON.

---

# 6. Comment and Token Schema

For the kind of high-fidelity UI you are describing, comments and token-level source structure should not be thrown away.

```sql
CREATE TABLE source_comment (
  comment_id         uuid PRIMARY KEY,
  file_version_id    uuid NOT NULL REFERENCES source_file_version(file_version_id),
  span_id            uuid NOT NULL REFERENCES source_span(span_id),

  text               text NOT NULL,
  previous_eol_count integer,
  next_eol_count     integer,

  nearest_node_id    uuid REFERENCES ast_node(node_id),
  attachment_kind    text,
  -- preceding, trailing, module_doc, function_doc, orphan, unclear

  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE source_token (
  token_id           uuid PRIMARY KEY,
  file_version_id    uuid NOT NULL REFERENCES source_file_version(file_version_id),
  span_id            uuid NOT NULL REFERENCES source_span(span_id),

  token_kind         text NOT NULL,
  token_text         text NOT NULL,
  token_metadata     jsonb NOT NULL DEFAULT '{}',

  nearest_node_id    uuid REFERENCES ast_node(node_id)
);
```

This matters because the UI may show one of several projections:

```text
source-faithful view
semantic normalized view
macro-expanded view
execution path view
documentation/comment intent view
```

Those are different projections over the same code.

---

# 7. Anchors: The Universal Join Layer

The `anchor` table is the central trick.

An anchor is a stable semantic handle. It can point to an AST node, a source span, a symbol, a relation, a runtime trace, or even a projection item.

```sql
CREATE TABLE anchor (
  anchor_id          uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_kind        text NOT NULL,
  -- ast_node, source_span, symbol, function_clause, relation,
  -- otp_component, runtime_event, projection, synthetic_concept

  node_id            uuid REFERENCES ast_node(node_id),
  span_id            uuid REFERENCES source_span(span_id),
  symbol_id          uuid,
  relation_id        uuid,

  stable_key         text NOT NULL,
  display_label      text,
  salience_score     numeric NOT NULL DEFAULT 0,

  structural_hash    bytea,
  semantic_hash      bytea,

  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (revision_id, stable_key)
);

CREATE INDEX anchor_kind_idx
  ON anchor (revision_id, anchor_kind);

CREATE INDEX anchor_node_idx
  ON anchor (node_id);

CREATE INDEX anchor_salience_idx
  ON anchor (revision_id, salience_score DESC);
```

### Example anchor keys

```text
file:lib/my_app/accounts.ex
module:MyApp.Accounts
function:MyApp.Accounts.register_user/1
clause:MyApp.Accounts.register_user/1#clause:0
call:MyApp.Accounts.register_user/1->Ecto.Repo.insert/1#site:3
concern:authentication
risk:unsafe_atom_conversion
projection:function_deep_dive:MyApp.Accounts.register_user/1
```

The UI should almost never talk directly to `ast_node`. It should talk to `anchor`.

---

# 8. Elixir Symbol Schema

```sql
CREATE TABLE symbol (
  symbol_id          uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  symbol_kind        text NOT NULL,
  -- module, function, macro, callback, type, struct, protocol,
  -- implementation, attribute, variable, app_config_key

  canonical_name     text NOT NULL,
  module_name        text,
  local_name         text,
  arity              integer,

  visibility         text,
  -- public, private, callback, generated, unknown

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (revision_id, symbol_kind, canonical_name)
);

CREATE TABLE symbol_definition (
  definition_id      uuid PRIMARY KEY,
  symbol_id          uuid NOT NULL REFERENCES symbol(symbol_id),
  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  node_id            uuid REFERENCES ast_node(node_id),
  span_id            uuid REFERENCES source_span(span_id),

  definition_kind    text NOT NULL,
  -- defmodule, def, defp, defmacro, defmacrop, defcallback,
  -- defstruct, defprotocol, defimpl, @type, @spec

  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE symbol_reference (
  reference_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  symbol_id          uuid REFERENCES symbol(symbol_id),
  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  node_id            uuid REFERENCES ast_node(node_id),
  span_id            uuid REFERENCES source_span(span_id),

  reference_kind     text NOT NULL,
  -- local_call, remote_call, alias, import, require, behaviour,
  -- protocol_dispatch, struct_access, config_access, type_reference

  resolution_status  text NOT NULL,
  -- resolved, unresolved, ambiguous, macro_generated, dynamic

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX symbol_name_idx
  ON symbol (revision_id, canonical_name);

CREATE INDEX symbol_reference_symbol_idx
  ON symbol_reference (symbol_id);
```

---

# 9. Lexical and Compile-Time Environment

Elixir needs this because aliases, imports, requires, macros, guards, and match contexts materially affect meaning. `Macro.Env` stores compile-time environment information such as context, current module, file, function, line, and related compiler environment fields. ([hexdocs.pm][3])

```sql
CREATE TABLE lexical_env_snapshot (
  env_id             uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_id          uuid REFERENCES anchor(anchor_id),
  node_id            uuid REFERENCES ast_node(node_id),

  module_name        text,
  function_name      text,
  function_arity     integer,

  context_kind       text,
  -- default, guard, match

  aliases_json       jsonb NOT NULL DEFAULT '[]',
  imports_json       jsonb NOT NULL DEFAULT '[]',
  requires_json      jsonb NOT NULL DEFAULT '[]',
  macros_json        jsonb NOT NULL DEFAULT '[]',
  variables_json     jsonb NOT NULL DEFAULT '[]',

  metadata           jsonb NOT NULL DEFAULT '{}',

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

# 10. Elixir-Specific Semantic Tables

These tables are not generic language-server tables. They are tuned for Elixir.

## Function clauses

```sql
CREATE TABLE elixir_function_clause (
  clause_id          uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  function_symbol_id uuid NOT NULL REFERENCES symbol(symbol_id),
  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),

  clause_index       integer NOT NULL,
  head_node_id       uuid REFERENCES ast_node(node_id),
  body_node_id       uuid REFERENCES ast_node(node_id),
  guard_node_id      uuid REFERENCES ast_node(node_id),

  patterns_json      jsonb NOT NULL DEFAULT '[]',
  guard_summary      text,
  return_shape_json  jsonb,

  visibility         text,
  is_callback_impl   boolean NOT NULL DEFAULT false,

  UNIQUE (function_symbol_id, clause_index)
);
```

## Calls

```sql
CREATE TABLE elixir_call_site (
  call_site_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  caller_symbol_id   uuid REFERENCES symbol(symbol_id),
  callee_symbol_id   uuid REFERENCES symbol(symbol_id),

  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  node_id            uuid REFERENCES ast_node(node_id),
  span_id            uuid REFERENCES source_span(span_id),

  call_kind          text NOT NULL,
  -- local, remote, macro, anonymous_fn, capture, protocol, dynamic, apply

  dispatch_status    text NOT NULL,
  -- resolved, unresolved, dynamic, ambiguous

  receiver_expr_json jsonb,
  args_shape_json    jsonb,
  pipe_position      integer,

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX elixir_call_caller_idx
  ON elixir_call_site (revision_id, caller_symbol_id);

CREATE INDEX elixir_call_callee_idx
  ON elixir_call_site (revision_id, callee_symbol_id);
```

## Pipes

```sql
CREATE TABLE elixir_pipe_chain (
  pipe_chain_id      uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  root_node_id       uuid REFERENCES ast_node(node_id),

  owning_symbol_id   uuid REFERENCES symbol(symbol_id),
  step_count         integer NOT NULL,

  input_shape_json   jsonb,
  output_shape_json  jsonb,
  summary            text
);

CREATE TABLE elixir_pipe_step (
  pipe_step_id       uuid PRIMARY KEY,
  pipe_chain_id      uuid NOT NULL REFERENCES elixir_pipe_chain(pipe_chain_id),

  step_index         integer NOT NULL,
  call_site_id       uuid REFERENCES elixir_call_site(call_site_id),
  anchor_id          uuid REFERENCES anchor(anchor_id),

  input_expr_json    jsonb,
  output_expr_json   jsonb,

  UNIQUE (pipe_chain_id, step_index)
);
```

## Pattern matches

```sql
CREATE TABLE elixir_pattern_match (
  pattern_id         uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  node_id            uuid REFERENCES ast_node(node_id),

  owning_symbol_id   uuid REFERENCES symbol(symbol_id),
  pattern_kind       text NOT NULL,
  -- function_head, case_clause, with_clause, receive_clause,
  -- assignment, assert_match

  matched_shape_json jsonb NOT NULL DEFAULT '{}',
  bound_vars_json    jsonb NOT NULL DEFAULT '[]',
  failure_behavior   text,
  -- falls_through, raises_match_error, unmatched_clause, unknown

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

## Macro expansion

Sourceror is useful here because it works with the Elixir AST shape and also supports patch-oriented source manipulation; its docs describe using standard `Macro` traversal functions on Sourceror AST and preserving formatting through patches rather than rewriting the entire formatted AST. ([GitHub][4])

```sql
CREATE TABLE elixir_macro_expansion (
  expansion_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  source_anchor_id   uuid NOT NULL REFERENCES anchor(anchor_id),
  source_node_id     uuid REFERENCES ast_node(node_id),

  expanded_parse_id  uuid REFERENCES parse_artifact(parse_id),
  expanded_node_id   uuid REFERENCES ast_node(node_id),

  macro_symbol_id    uuid REFERENCES symbol(symbol_id),
  env_id             uuid REFERENCES lexical_env_snapshot(env_id),

  expansion_kind     text NOT NULL,
  -- expand_once, expand_full, compiler_observed, synthetic

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

## OTP and runtime architecture

```sql
CREATE TABLE elixir_otp_component (
  otp_component_id   uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_id          uuid REFERENCES anchor(anchor_id),
  symbol_id          uuid REFERENCES symbol(symbol_id),

  component_kind     text NOT NULL,
  -- application, supervisor, dynamic_supervisor, genserver,
  -- task_supervisor, agent, registry, worker, child_spec

  callback_module    text,
  child_spec_json    jsonb,
  supervision_json   jsonb,

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE elixir_message_flow (
  message_flow_id    uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  sender_anchor_id   uuid REFERENCES anchor(anchor_id),
  receiver_anchor_id uuid REFERENCES anchor(anchor_id),

  message_kind       text NOT NULL,
  -- GenServer.call, GenServer.cast, send, receive, Phoenix.PubSub,
  -- Oban job, Task.async, Registry dispatch

  payload_shape_json jsonb,
  sync_async         text,
  timeout_behavior   text,

  confidence         numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

---

# 11. Semantic Facts: The LLM Understanding Layer

This is where the language model’s output lives.

Important: do **not** store raw chain-of-thought. Store concise, inspectable, evidence-backed claims.

```sql
CREATE TABLE analyzer (
  analyzer_id        uuid PRIMARY KEY,
  analyzer_kind      text NOT NULL,
  -- parser, static_pass, compiler_pass, llm, runtime_trace, user_annotation

  name               text NOT NULL,
  version            text NOT NULL,
  config_json        jsonb NOT NULL DEFAULT '{}',

  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE analysis_run (
  run_id             uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),
  analyzer_id        uuid NOT NULL REFERENCES analyzer(analyzer_id),

  input_scope_kind   text NOT NULL,
  -- file, module, function, clause, relation, projection, whole_repo

  input_anchor_id    uuid REFERENCES anchor(anchor_id),
  input_hash         bytea NOT NULL,

  model_provider     text,
  model_name         text,
  prompt_template_id uuid,

  status             text NOT NULL DEFAULT 'completed',
  started_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz,

  diagnostics        jsonb NOT NULL DEFAULT '[]'
);

CREATE TABLE prompt_template (
  prompt_template_id uuid PRIMARY KEY,
  template_name      text NOT NULL,
  template_version   text NOT NULL,
  purpose            text NOT NULL,
  template_hash      bytea NOT NULL,
  template_text      text NOT NULL,
  output_schema_json jsonb NOT NULL DEFAULT '{}',

  UNIQUE (template_name, template_version)
);

CREATE TABLE semantic_fact (
  fact_id            uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),
  run_id             uuid REFERENCES analysis_run(run_id),

  primary_anchor_id  uuid NOT NULL REFERENCES anchor(anchor_id),

  fact_type          text NOT NULL,
  -- intent_summary, invariant, precondition, postcondition,
  -- failure_mode, hidden_dependency, data_shape, side_effect,
  -- security_risk, concurrency_risk, complexity_note,
  -- refactor_opportunity, test_gap, human_explanation,
  -- naming_explanation, domain_concept, user_story_link

  fact_scope         text NOT NULL,
  -- node, clause, function, module, app, repo, projection

  title              text,
  body_text          text,
  body_json          jsonb NOT NULL DEFAULT '{}',

  confidence         numeric NOT NULL DEFAULT 0.5,
  utility_score      numeric NOT NULL DEFAULT 0.5,
  novelty_score      numeric NOT NULL DEFAULT 0.5,
  cognitive_load     numeric NOT NULL DEFAULT 0.5,
  risk_score         numeric NOT NULL DEFAULT 0.0,

  verification_state text NOT NULL DEFAULT 'unverified',
  -- exact_static, compiler_observed, llm_inferred, user_verified,
  -- contradicted, stale, superseded

  supersedes_fact_id uuid REFERENCES semantic_fact(fact_id),

  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX semantic_fact_anchor_idx
  ON semantic_fact (primary_anchor_id, fact_type);

CREATE INDEX semantic_fact_revision_type_idx
  ON semantic_fact (revision_id, fact_type);

CREATE INDEX semantic_fact_utility_idx
  ON semantic_fact (revision_id, utility_score DESC);
```

## Fact evidence

```sql
CREATE TABLE semantic_fact_evidence (
  evidence_id        uuid PRIMARY KEY,
  fact_id            uuid NOT NULL REFERENCES semantic_fact(fact_id),

  evidence_anchor_id uuid REFERENCES anchor(anchor_id),
  evidence_span_id   uuid REFERENCES source_span(span_id),
  evidence_fact_id   uuid REFERENCES semantic_fact(fact_id),

  evidence_role      text NOT NULL,
  -- supports, weakens, contradicts, source_location,
  -- compiler_trace, runtime_trace, test_case, documentation

  quote_text         text,
  quote_hash         bytea,
  weight             numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE semantic_fact_conflict (
  conflict_id        uuid PRIMARY KEY,
  fact_a_id          uuid NOT NULL REFERENCES semantic_fact(fact_id),
  fact_b_id          uuid NOT NULL REFERENCES semantic_fact(fact_id),

  conflict_kind      text NOT NULL,
  -- contradiction, overlapping_claim, stale_vs_current, ambiguity

  severity           numeric NOT NULL DEFAULT 0.5,
  resolution_state   text NOT NULL DEFAULT 'unresolved',
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

This gives you a durable model of “understanding” without pretending that every generated statement is equally true.

---

# 12. Relations and Hyperedges

Simple relations:

```sql
CREATE TABLE semantic_relation (
  relation_id        uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  relation_type      text NOT NULL,
  -- contains, defines, calls, called_by, reads, writes, returns,
  -- raises, rescues, sends_message, receives_message, supervises,
  -- configures, tests, documents, expands_to, depends_on,
  -- same_concern_as, risk_flows_to, data_flows_to

  source_anchor_id   uuid NOT NULL REFERENCES anchor(anchor_id),
  target_anchor_id   uuid NOT NULL REFERENCES anchor(anchor_id),

  directed           boolean NOT NULL DEFAULT true,
  confidence         numeric NOT NULL DEFAULT 1.0,
  weight             numeric NOT NULL DEFAULT 1.0,

  provenance_fact_id uuid REFERENCES semantic_fact(fact_id),
  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (
    revision_id,
    relation_type,
    source_anchor_id,
    target_anchor_id
  )
);

CREATE INDEX semantic_relation_source_idx
  ON semantic_relation (revision_id, source_anchor_id, relation_type);

CREATE INDEX semantic_relation_target_idx
  ON semantic_relation (revision_id, target_anchor_id, relation_type);
```

Hyperedges:

```sql
CREATE TABLE semantic_hyperedge (
  hyperedge_id       uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  hyperedge_type     text NOT NULL,
  -- execution_scenario, invariant_cluster, failure_path,
  -- domain_operation, refactor_cluster, test_surface,
  -- concern_slice, cross_module_behavior

  title              text,
  summary            text,

  confidence         numeric NOT NULL DEFAULT 0.5,
  salience_score     numeric NOT NULL DEFAULT 0.5,

  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE semantic_hyperedge_endpoint (
  endpoint_id        uuid PRIMARY KEY,
  hyperedge_id       uuid NOT NULL REFERENCES semantic_hyperedge(hyperedge_id),
  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),

  endpoint_role      text NOT NULL,
  -- entrypoint, source, sink, guard, branch, side_effect,
  -- risk_source, mitigation, test, documentation, config

  endpoint_order     integer,
  weight             numeric NOT NULL DEFAULT 1.0,

  UNIQUE (hyperedge_id, anchor_id, endpoint_role)
);
```

This is how you represent “diagonal” navigation.

Example:

```text
Concern: authentication
Path: HTTP request -> controller -> context -> repo -> email worker
Risk: token leakage
Evidence: specific clauses, configs, logs, tests
```

That is a hyperedge, not a single edge.

---

# 13. Dimensions: The Multidimensional Code Cube

This is where your knob idea becomes concrete.

```sql
CREATE TABLE dimension (
  dimension_id       uuid PRIMARY KEY,
  dimension_key      text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  dimension_kind     text NOT NULL,
  -- ordered, categorical, numeric, boolean, graph_path, temporal

  description        text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE dimension_value (
  value_id           uuid PRIMARY KEY,
  dimension_id       uuid NOT NULL REFERENCES dimension(dimension_id),

  value_key          text NOT NULL,
  display_name       text NOT NULL,
  ordinal            integer,
  numeric_value      numeric,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (dimension_id, value_key)
);

CREATE TABLE anchor_coordinate (
  coordinate_id      uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  dimension_id       uuid NOT NULL REFERENCES dimension(dimension_id),
  value_id           uuid REFERENCES dimension_value(value_id),

  numeric_value      numeric,
  score              numeric NOT NULL DEFAULT 1.0,

  source_fact_id     uuid REFERENCES semantic_fact(fact_id),
  confidence         numeric NOT NULL DEFAULT 1.0,

  UNIQUE (anchor_id, dimension_id, value_id)
);

CREATE INDEX anchor_coordinate_lookup_idx
  ON anchor_coordinate (revision_id, dimension_id, value_id, score DESC);
```

## Recommended dimensions

| Dimension             | Example values                                                                         |
| --------------------- | -------------------------------------------------------------------------------------- |
| `abstraction_level`   | token, expression, clause, function, module, app, system                               |
| `execution_direction` | upstream, downstream, bidirectional, message_flow, dataflow                            |
| `semantic_concern`    | auth, persistence, validation, error_handling, concurrency, config, logging, telemetry |
| `certainty`           | static_exact, compiler_observed, runtime_observed, llm_inferred, user_verified         |
| `risk_class`          | security, reliability, concurrency, performance, maintainability                       |
| `change_impact`       | local, module, cross_module, app_wide, unknown                                         |
| `cognitive_role`      | entrypoint, transformer, validator, coordinator, side_effect, adapter, boundary        |
| `runtime_layer`       | controller, context, schema, repo, worker, supervisor, pubsub, external_service        |
| `test_coverage`       | directly_tested, indirectly_tested, untested, unknown                                  |
| `temporal_state`      | unchanged, added, modified, deleted, moved, refactored                                 |

Now a knob is just a UI control over one dimension or a composed set of dimensions.

---

# 14. Navigation Schema

```sql
CREATE TABLE navigation_lens (
  lens_id            uuid PRIMARY KEY,
  lens_key           text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  lens_kind          text NOT NULL,
  -- execution_path, horizontal_peer, diagonal_concern,
  -- abstraction_zoom, risk_path, dataflow, message_flow,
  -- ownership, temporal_diff

  query_spec_json    jsonb NOT NULL,
  default_axes_json  jsonb NOT NULL DEFAULT '{}',
  description        text
);

CREATE TABLE navigation_edge (
  nav_edge_id        uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  lens_id            uuid NOT NULL REFERENCES navigation_lens(lens_id),

  from_anchor_id     uuid NOT NULL REFERENCES anchor(anchor_id),
  to_anchor_id       uuid NOT NULL REFERENCES anchor(anchor_id),

  nav_edge_kind      text NOT NULL,
  -- next_call, caller, callee, sibling_clause, enclosing_module,
  -- downstream_data, upstream_data, same_concern, same_risk,
  -- test_for, config_for, macro_origin, macro_expanded

  cost               numeric NOT NULL DEFAULT 1.0,
  salience_score     numeric NOT NULL DEFAULT 0.5,
  rank               integer,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (revision_id, lens_id, from_anchor_id, to_anchor_id, nav_edge_kind)
);

CREATE INDEX navigation_edge_from_idx
  ON navigation_edge (revision_id, lens_id, from_anchor_id, salience_score DESC);

CREATE INDEX navigation_edge_to_idx
  ON navigation_edge (revision_id, lens_id, to_anchor_id);
```

## Precomputed paths

```sql
CREATE TABLE navigation_path (
  path_id            uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  lens_id            uuid NOT NULL REFERENCES navigation_lens(lens_id),
  root_anchor_id     uuid NOT NULL REFERENCES anchor(anchor_id),

  path_kind          text NOT NULL,
  title              text,
  summary            text,

  total_cost         numeric,
  salience_score     numeric NOT NULL DEFAULT 0.5,

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE navigation_path_step (
  path_step_id       uuid PRIMARY KEY,
  path_id            uuid NOT NULL REFERENCES navigation_path(path_id),

  step_index         integer NOT NULL,
  anchor_id          uuid NOT NULL REFERENCES anchor(anchor_id),
  relation_id        uuid REFERENCES semantic_relation(relation_id),

  step_role          text,
  render_hint        text,

  UNIQUE (path_id, step_index)
);
```

This enables:

```text
turn knob: execution downstream
turn knob: same concern
turn knob: abstraction up
turn knob: show only high-risk
turn knob: show macro-expanded equivalent
turn knob: jump from function to tests
```

---

# 15. Projection and UI Schema

The UI can be fixed, but the contents of its panels are dynamic.

## Viewpoints

```sql
CREATE TABLE viewpoint (
  viewpoint_id       uuid PRIMARY KEY,
  viewpoint_key      text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  viewpoint_kind     text NOT NULL,
  -- function_deep_dive, module_overview, execution_path,
  -- risk_lens, concern_lens, test_surface, macro_lens,
  -- otp_architecture, diff_lens

  description        text,
  layout_spec_json   jsonb NOT NULL,
  default_axis_json  jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE viewpoint_slot (
  slot_id            uuid PRIMARY KEY,
  viewpoint_id       uuid NOT NULL REFERENCES viewpoint(viewpoint_id),

  slot_key           text NOT NULL,
  display_name       text NOT NULL,

  slot_kind          text NOT NULL,
  -- source, summary, graph, list, card_stack, metric_strip,
  -- explanation, path, evidence, diff, warnings

  slot_order         integer NOT NULL,
  slot_query_json    jsonb NOT NULL DEFAULT '{}',
  render_spec_json   jsonb NOT NULL DEFAULT '{}',

  UNIQUE (viewpoint_id, slot_key)
);
```

## Axes and knobs

```sql
CREATE TABLE ui_axis (
  axis_id            uuid PRIMARY KEY,
  axis_key           text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  dimension_id       uuid REFERENCES dimension(dimension_id),

  axis_kind          text NOT NULL,
  -- discrete, continuous, cyclic, ranked, graph_neighbor, temporal

  min_value          numeric,
  max_value          numeric,
  step_size          numeric,

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE ui_axis_state (
  axis_state_id      uuid PRIMARY KEY,

  axis_state_hash    bytea NOT NULL UNIQUE,
  state_json         jsonb NOT NULL,

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

Example `state_json`:

```json
{
  "root_anchor": "function:MyApp.Accounts.register_user/1",
  "abstraction_level": "function",
  "execution_direction": "downstream",
  "semantic_concern": "auth",
  "certainty": ["static_exact", "compiler_observed", "llm_inferred"],
  "risk_threshold": 0.6,
  "macro_mode": "lexical"
}
```

## Projection instances

```sql
CREATE TABLE projection_instance (
  projection_instance_id uuid PRIMARY KEY,

  revision_id          uuid NOT NULL REFERENCES code_revision(revision_id),
  viewpoint_id         uuid NOT NULL REFERENCES viewpoint(viewpoint_id),
  axis_state_id        uuid NOT NULL REFERENCES ui_axis_state(axis_state_id),

  root_anchor_id       uuid REFERENCES anchor(anchor_id),

  generated_from_run_id uuid REFERENCES analysis_run(run_id),

  projection_hash      bytea NOT NULL,
  render_status        text NOT NULL DEFAULT 'ready',

  created_at           timestamptz NOT NULL DEFAULT now(),

  UNIQUE (revision_id, viewpoint_id, axis_state_id, root_anchor_id)
);

CREATE TABLE projection_item (
  projection_item_id  uuid PRIMARY KEY,

  projection_instance_id uuid NOT NULL REFERENCES projection_instance(projection_instance_id),
  slot_id             uuid NOT NULL REFERENCES viewpoint_slot(slot_id),

  item_order          integer NOT NULL,

  anchor_id           uuid REFERENCES anchor(anchor_id),
  fact_id             uuid REFERENCES semantic_fact(fact_id),
  relation_id         uuid REFERENCES semantic_relation(relation_id),
  path_id             uuid REFERENCES navigation_path(path_id),

  card_kind           text NOT NULL,
  -- source_excerpt, function_card, risk_card, invariant_card,
  -- call_edge, test_card, config_card, explanation_card,
  -- metric, graph_node, graph_edge, transition_hint

  render_payload_json jsonb NOT NULL,

  salience_score      numeric NOT NULL DEFAULT 0.5,
  confidence          numeric NOT NULL DEFAULT 1.0,

  created_at          timestamptz NOT NULL DEFAULT now(),

  UNIQUE (projection_instance_id, slot_id, item_order)
);

CREATE INDEX projection_item_instance_idx
  ON projection_item (projection_instance_id, slot_id, item_order);
```

## Projection transitions

This is what makes the knobs feel fast.

```sql
CREATE TABLE projection_transition (
  transition_id       uuid PRIMARY KEY,

  from_projection_id  uuid NOT NULL REFERENCES projection_instance(projection_instance_id),
  to_projection_id    uuid NOT NULL REFERENCES projection_instance(projection_instance_id),

  axis_id             uuid REFERENCES ui_axis(axis_id),
  transition_kind     text NOT NULL,
  -- knob_tick_forward, knob_tick_backward, jump, zoom_in,
  -- zoom_out, concern_shift, path_step, sibling_step

  delta_json          jsonb NOT NULL DEFAULT '{}',

  affected_slot_keys  text[] NOT NULL DEFAULT '{}',
  transition_payload_json jsonb NOT NULL DEFAULT '{}',

  cost                numeric NOT NULL DEFAULT 1.0,
  rank                integer
);

CREATE INDEX projection_transition_from_idx
  ON projection_transition (from_projection_id, axis_id, rank);
```

### Why this is critical

A knob click should not mean:

```text
compute new semantic interpretation
```

It should mean:

```text
fetch next projection id
replace these slots
animate deterministic transition
```

That is the design that gives you the “high-speed zooming around a codebase” feeling.

---

# 16. Materialized View Layer

PostgreSQL materialized views are appropriate for precomputed UI slices, as long as you treat them as cache tables over the canonical schema. PostgreSQL’s `REFRESH MATERIALIZED VIEW` replaces the contents of the materialized view; `CONCURRENTLY` can avoid blocking concurrent selects, but it requires a qualifying unique index and an already populated materialized view. ([PostgreSQL][5])

## Function card materialization

```sql
CREATE MATERIALIZED VIEW mv_function_card AS
SELECT
  s.revision_id,
  s.symbol_id,
  s.canonical_name,
  s.module_name,
  s.local_name,
  s.arity,

  a.anchor_id,

  MAX(CASE WHEN f.fact_type = 'intent_summary'
      THEN f.body_text END) AS intent_summary,

  MAX(CASE WHEN f.fact_type = 'human_explanation'
      THEN f.body_text END) AS human_explanation,

  MAX(CASE WHEN f.fact_type = 'failure_mode'
      THEN f.risk_score END) AS max_failure_risk,

  COUNT(DISTINCT cs.call_site_id) AS outgoing_call_count,

  MAX(f.utility_score) AS max_utility_score,
  MAX(f.confidence) AS max_confidence

FROM symbol s
JOIN symbol_definition sd
  ON sd.symbol_id = s.symbol_id
JOIN anchor a
  ON a.anchor_id = sd.anchor_id
LEFT JOIN semantic_fact f
  ON f.primary_anchor_id = a.anchor_id
LEFT JOIN elixir_call_site cs
  ON cs.caller_symbol_id = s.symbol_id

WHERE s.symbol_kind IN ('function', 'macro')

GROUP BY
  s.revision_id,
  s.symbol_id,
  s.canonical_name,
  s.module_name,
  s.local_name,
  s.arity,
  a.anchor_id;

CREATE UNIQUE INDEX mv_function_card_uidx
  ON mv_function_card (revision_id, symbol_id);
```

## Execution neighbors

```sql
CREATE MATERIALIZED VIEW mv_execution_neighbors AS
SELECT
  r.revision_id,
  r.source_anchor_id,
  r.target_anchor_id,
  r.relation_type,
  r.weight,
  r.confidence,
  a1.display_label AS source_label,
  a2.display_label AS target_label
FROM semantic_relation r
JOIN anchor a1 ON a1.anchor_id = r.source_anchor_id
JOIN anchor a2 ON a2.anchor_id = r.target_anchor_id
WHERE r.relation_type IN (
  'calls',
  'called_by',
  'data_flows_to',
  'sends_message',
  'receives_message',
  'raises',
  'rescues'
);

CREATE UNIQUE INDEX mv_execution_neighbors_uidx
  ON mv_execution_neighbors (
    revision_id,
    source_anchor_id,
    target_anchor_id,
    relation_type
  );
```

## Concern slices

```sql
CREATE MATERIALIZED VIEW mv_concern_slice AS
SELECT
  ac.revision_id,
  ac.dimension_id,
  ac.value_id,
  ac.anchor_id,
  a.display_label,
  a.anchor_kind,
  ac.score,
  ac.confidence,
  sf.fact_id,
  sf.title,
  sf.body_text,
  sf.utility_score,
  sf.risk_score
FROM anchor_coordinate ac
JOIN anchor a
  ON a.anchor_id = ac.anchor_id
LEFT JOIN semantic_fact sf
  ON sf.primary_anchor_id = ac.anchor_id
WHERE ac.score > 0.25;

CREATE UNIQUE INDEX mv_concern_slice_uidx
  ON mv_concern_slice (
    revision_id,
    dimension_id,
    value_id,
    anchor_id,
    COALESCE(fact_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );
```

---

# 17. Incremental Analysis and Cache Invalidation

You need this from day one.

```sql
CREATE TABLE analysis_task (
  task_id            uuid PRIMARY KEY,
  revision_id        uuid NOT NULL REFERENCES code_revision(revision_id),

  analyzer_id        uuid NOT NULL REFERENCES analyzer(analyzer_id),
  target_anchor_id   uuid REFERENCES anchor(anchor_id),
  target_file_version_id uuid REFERENCES source_file_version(file_version_id),

  task_kind          text NOT NULL,
  -- parse, resolve_symbols, build_call_graph, summarize_function,
  -- extract_risks, build_projection, refresh_materialized_view

  input_hash         bytea NOT NULL,
  output_hash        bytea,

  status             text NOT NULL DEFAULT 'pending',
  priority           integer NOT NULL DEFAULT 100,

  created_at         timestamptz NOT NULL DEFAULT now(),
  started_at         timestamptz,
  completed_at       timestamptz,

  UNIQUE (revision_id, analyzer_id, task_kind, input_hash)
);

CREATE TABLE anchor_lineage (
  lineage_id         uuid PRIMARY KEY,

  from_revision_id   uuid NOT NULL REFERENCES code_revision(revision_id),
  to_revision_id     uuid NOT NULL REFERENCES code_revision(revision_id),

  from_anchor_id     uuid NOT NULL REFERENCES anchor(anchor_id),
  to_anchor_id       uuid NOT NULL REFERENCES anchor(anchor_id),

  match_kind         text NOT NULL,
  -- exact_hash, moved, renamed, fuzzy_structural, semantic_match

  match_score        numeric NOT NULL DEFAULT 1.0,
  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (from_anchor_id, to_anchor_id)
);
```

## Why lineage matters

Without lineage, every commit feels like a new universe. With lineage, the UI can say:

```text
same function, changed body
same concept, moved module
same risk, now mitigated
same path, one new branch inserted
```

That is essential for temporal navigation.

---

# 18. Embeddings and Search

Use embeddings as an acceleration layer, not as the source of truth.

```sql
CREATE TABLE embedding_space (
  embedding_space_id uuid PRIMARY KEY,
  name               text NOT NULL,
  model_provider     text NOT NULL,
  model_name         text NOT NULL,
  dimensions         integer NOT NULL,
  purpose            text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (name, model_provider, model_name)
);

CREATE TABLE semantic_embedding (
  embedding_id       uuid PRIMARY KEY,
  embedding_space_id uuid NOT NULL REFERENCES embedding_space(embedding_space_id),

  anchor_id          uuid REFERENCES anchor(anchor_id),
  fact_id            uuid REFERENCES semantic_fact(fact_id),

  embedded_text_hash bytea NOT NULL,
  embedding          vector,

  metadata           jsonb NOT NULL DEFAULT '{}',

  CHECK (
    anchor_id IS NOT NULL OR fact_id IS NOT NULL
  )
);
```

The vector search layer helps with:

```text
“show me similar functions”
“where else is this pattern used?”
“find code that probably has the same concern”
“find risk clusters”
“jump diagonally to conceptually related code”
```

But any result shown in the UI should still resolve back to anchors, facts, spans, and evidence.

---

# 19. Example Viewpoints

## A. Function Deep Dive

Fixed slots:

| Slot         | Content                            |
| ------------ | ---------------------------------- |
| `source`     | Source excerpt, AST-highlighted    |
| `intent`     | What this function is for          |
| `execution`  | Callers, callees, message sends    |
| `data_shape` | Inputs, outputs, pattern matches   |
| `risks`      | Failure modes, edge cases          |
| `tests`      | Direct and indirect tests          |
| `neighbors`  | Similar functions, sibling clauses |
| `evidence`   | Source spans supporting claims     |

Knobs:

```text
abstraction_level
execution_direction
concern
certainty
risk_threshold
macro_mode
test_visibility
```

## B. Execution Path View

Shows:

```text
entrypoint -> controller -> context -> schema -> repo -> worker -> external service
```

Knobs:

```text
next/previous call
upstream/downstream
sync/async
include/exclude side effects
show only high-risk branches
show only user-facing behavior
```

## C. Diagonal Concern View

Example:

```text
Concern: authentication
Layer: module/function
Risk: high
Certainty: static + LLM
```

This may surface functions that are not adjacent in the AST or call graph but are semantically coupled.

## D. Macro Lens

Shows:

```text
source-level AST
macro invocation
expanded AST
semantic consequence
generated functions/calls
```

This is especially valuable in Elixir because macro-heavy code can make source-level reading misleading.

## E. OTP Architecture Lens

Shows:

```text
application
supervision tree
workers
GenServers
message flows
restart boundaries
runtime side effects
```

---

# 20. Example Render Payload

A `projection_item.render_payload_json` might look like this:

```json
{
  "title": "Registers a user",
  "subtitle": "MyApp.Accounts.register_user/1",
  "primary_text": "Validates attributes, builds a changeset, inserts a user, and emits post-registration side effects.",
  "badges": [
    { "kind": "concern", "label": "auth" },
    { "kind": "risk", "label": "medium" },
    { "kind": "certainty", "label": "static+llm" }
  ],
  "source": {
    "file": "lib/my_app/accounts.ex",
    "start_line": 42,
    "end_line": 58
  },
  "meters": {
    "risk": 0.42,
    "complexity": 0.37,
    "confidence": 0.86,
    "utility": 0.91
  },
  "nav_targets": [
    {
      "label": "Downstream calls",
      "lens": "execution_path",
      "target_anchor": "call:Ecto.Repo.insert/1"
    },
    {
      "label": "Tests",
      "lens": "test_surface",
      "target_anchor": "test:register_user"
    }
  ]
}
```

The UI can render this without understanding Elixir.

---

# 21. Minimal End-to-End Pipeline

```text
1. Ingest repo revision
2. Store source files and source spans
3. Parse Elixir files with high-fidelity options
4. Walk AST and emit ast_node / ast_edge
5. Extract symbols, definitions, references
6. Resolve calls, aliases, imports, requires, macros where possible
7. Extract Elixir structures:
   - modules
   - functions
   - clauses
   - guards
   - pattern matches
   - pipe chains
   - OTP components
   - message flows
8. Create anchors for all meaningful units
9. Run static analyzers
10. Run LLM analyzers per anchor / cluster
11. Store semantic facts with evidence
12. Build semantic relations and hyperedges
13. Assign multidimensional coordinates
14. Build navigation edges and paths
15. Materialize projection instances
16. UI loads projection instance by viewpoint + axis state
17. Knob transitions fetch precomputed projection_transition rows
```

---

# 22. The Most Important Tables

If you want the shortest possible implementation path, start with these:

```text
codebase
code_revision
source_file
source_file_version
source_span

parse_artifact
ast_node
ast_edge

anchor
symbol
symbol_definition
symbol_reference

semantic_fact
semantic_fact_evidence
semantic_relation

dimension
dimension_value
anchor_coordinate

viewpoint
viewpoint_slot
ui_axis_state
projection_instance
projection_item
projection_transition
```

That is enough to build the first working system.

---

# 23. What Makes This State-of-the-Art

The state-of-the-art part is not merely “LLM summarizes code.”

It is this combination:

1. **AST-grounded anchors**
   Every claim attaches to exact code structure.

2. **Versioned semantic facts**
   Generated understanding is stored, invalidated, compared, and superseded.

3. **Evidence-backed model output**
   The system records why a claim exists.

4. **Multidimensional coordinate system**
   Code can be navigated by execution, concern, risk, abstraction, certainty, runtime role, and change impact.

5. **Hypergraph representation**
   Complex behaviors are represented as multi-anchor structures, not flattened into simple edges.

6. **Materialized UI projections**
   The interface is fast because it consumes precomputed projection items.

7. **Knob transition cache**
   A knob tick maps to a deterministic transition between projection states.

8. **Elixir-aware semantic extraction**
   Clauses, guards, macros, pipes, OTP components, message passing, and pattern matching are all first-class.

---

# 24. The Design in One Sentence

Build a **versioned, AST-anchored semantic hypergraph**, enrich it with static and LLM-generated facts, assign every anchor coordinates across human-useful dimensions, then serve the UI from precomputed projection instances and transition caches rather than live analysis.

[1]: https://hexdocs.pm/elixir/Code.html "Code — Elixir v1.19.5"
[2]: https://hexdocs.pm/elixir/Macro.html "Macro — Elixir v1.19.5"
[3]: https://hexdocs.pm/elixir/Macro.Env.html "Macro.Env — Elixir v1.19.5"
[4]: https://github.com/doorgan/sourceror "GitHub - doorgan/sourceror: Utilities to manipulate Elixir source code · GitHub"
[5]: https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html "PostgreSQL: Documentation: 18: REFRESH MATERIALIZED VIEW"
