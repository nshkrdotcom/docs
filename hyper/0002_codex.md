Yes — exactly. The previous design was **code-local**. It described how to understand modules, functions, clauses, AST nodes, facts, and projections, but it did **not** yet describe the architecture layer that makes sense for a large Elixir estate.

For a serious Elixir system, especially a multi-repository or multi-umbrella codebase, the root unit is **not a file**, **not a module**, and not even a single repo. The root unit is a **workspace snapshot** containing many repositories, each repository containing one or more `mix.exs` project roots, each Mix project defining or hosting one or more OTP applications, dependency graphs, runtime services, releases, configuration surfaces, and architectural boundaries.

Elixir’s own Mix model supports this distinction: a Mix project is generally defined in a `mix.exs` file through `use Mix.Project`, and `project/0` returns project configuration; umbrella projects use `apps_path` / child app paths to coordinate multiple applications under one parent project. ([hexdocs.pm][1]) The official docs also frame umbrellas as a way to build multiple applications that run together in one repository, while still treating the child applications as separable units. ([hexdocs.pm][2])

So the architecture layer has to sit **above** the semantic code graph.

---

# Corrected System Shape

The correct top-level model should look more like this:

```text
Architecture Workspace
  ├── Repository Group
  │     ├── Repository
  │     │     ├── Repository Revision
  │     │     │     ├── Mix Project Root
  │     │     │     │     ├── Umbrella Parent Project
  │     │     │     │     ├── Child Mix Project
  │     │     │     │     ├── OTP Application
  │     │     │     │     ├── Dependency Declarations
  │     │     │     │     ├── Runtime Configuration
  │     │     │     │     ├── Release Profiles
  │     │     │     │     └── Source Graph
  │     │     │     │           ├── Modules
  │     │     │     │           ├── Functions
  │     │     │     │           ├── Clauses
  │     │     │     │           └── AST Anchors
  │     │     │     └── Non-Elixir Assets
  │     │     └── Other Revisions
  │     └── Other Repositories
  └── Cross-Repo Architecture Graph
        ├── Logical Applications
        ├── Services
        ├── Bounded Contexts
        ├── Domains
        ├── Runtime Systems
        ├── External Systems
        ├── Ownership
        ├── Deployment Topology
        └── Change Impact Surfaces
```

The previous AST/fact/projection schema becomes the **leaf layer**.

The new architecture schema becomes the **rollup layer**.

---

# 1. Key Principle: Physical Structure vs Logical Architecture

You need to separate these three things:

| Layer                             | Meaning               | Example                                                        |
| --------------------------------- | --------------------- | -------------------------------------------------------------- |
| **Physical repository structure** | Where code lives      | `repo_a/apps/billing`, `repo_b/services/auth`                  |
| **Build/project structure**       | What Mix sees         | one `mix.exs`, umbrella parent, child Mix app, path dependency |
| **Logical architecture**          | What the system means | Billing context, Auth service, Fraud boundary, Event pipeline  |

These are related, but they are not the same.

A large Elixir estate can have:

```text
repo_a/
  mix.exs
  apps/
    accounts/mix.exs
    billing/mix.exs
    notifications/mix.exs

repo_b/
  services/
    auth/mix.exs
    identity/mix.exs

repo_c/
  platform/
    telemetry/mix.exs
    shared_config/mix.exs
```

Physically, that is three repositories.

Build-wise, that may be:

```text
repo_a umbrella
  accounts
  billing
  notifications

repo_b multiple independent Mix projects
  auth
  identity

repo_c multiple platform libraries
  telemetry
  shared_config
```

Architecturally, that may be:

```text
Identity Domain
  auth
  identity
  accounts

Money Domain
  billing

Platform Domain
  telemetry
  shared_config

Customer Communication Domain
  notifications
```

Your system needs to model **all three**.

---

# 2. New Top-Level Entity: Architecture Workspace

Instead of starting with `codebase`, start with a **workspace**.

A workspace is the user’s current universe of code.

```sql
CREATE TABLE architecture_workspace (
  workspace_id       uuid PRIMARY KEY,
  name               text NOT NULL,
  description        text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

A workspace may contain many repositories.

```sql
CREATE TABLE repository_group (
  repo_group_id      uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  name               text NOT NULL,
  group_kind         text NOT NULL,
  -- organization, product_area, platform_area, team_area, arbitrary

  description        text,
  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, name)
);

CREATE TABLE repository (
  repository_id      uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),
  repo_group_id      uuid REFERENCES repository_group(repo_group_id),

  repo_name          text NOT NULL,
  remote_url         text,
  default_branch     text,
  vcs_provider       text,
  metadata           jsonb NOT NULL DEFAULT '{}',

  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, repo_name)
);

CREATE TABLE repository_revision (
  repository_revision_id uuid PRIMARY KEY,
  repository_id      uuid NOT NULL REFERENCES repository(repository_id),

  commit_sha         text NOT NULL,
  branch_name        text,
  tag_name           text,
  commit_timestamp   timestamptz,
  scanned_at         timestamptz NOT NULL DEFAULT now(),

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (repository_id, commit_sha)
);
```

---

# 3. Workspace Snapshot: The Multi-Repo Time Slice

This is critical.

For a large system, you are not analyzing one repo. You are analyzing a **consistent set of repo revisions**.

```sql
CREATE TABLE workspace_snapshot (
  snapshot_id        uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  snapshot_name      text,
  snapshot_kind      text NOT NULL,
  -- branch_aligned, release_candidate, production, staging, arbitrary, historical

  created_at         timestamptz NOT NULL DEFAULT now(),
  description        text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE workspace_snapshot_member (
  snapshot_member_id uuid PRIMARY KEY,
  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),
  repository_revision_id uuid NOT NULL REFERENCES repository_revision(repository_revision_id),

  role               text,
  -- primary, dependency, platform, service, library, unknown

  UNIQUE (snapshot_id, repository_revision_id)
);
```

This allows the UI to ask:

```text
Show me the architecture of production as of this release.
Show me main branch across all repos.
Show me the delta between staging and production.
Show me what billing touches across all repos.
```

Without this, cross-repo analysis becomes incoherent.

---

# 4. Mix Project Roots

Now every `mix.exs` gets modeled as a first-class thing.

```sql
CREATE TABLE mix_project_root (
  mix_project_id     uuid PRIMARY KEY,
  repository_revision_id uuid NOT NULL REFERENCES repository_revision(repository_revision_id),

  project_file_path  text NOT NULL,
  project_root_path  text NOT NULL,

  project_module     text,
  -- Example: MyApp.MixProject

  project_kind       text NOT NULL,
  -- regular, umbrella_parent, umbrella_child, dependency_project, unknown

  is_umbrella        boolean NOT NULL DEFAULT false,

  parent_mix_project_id uuid REFERENCES mix_project_root(mix_project_id),

  discovered_by      text NOT NULL,
  -- filesystem_scan, mix_project_apps_paths, path_dep, git_dep, manual

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (repository_revision_id, project_file_path)
);
```

This lets one repo contain:

```text
one root project
many root projects
one umbrella parent
many umbrella children
nested or nonstandard project structures
tools-only Mix projects
test-support Mix projects
```

The tool must not assume a single `mix.exs`.

---

# 5. Parsed Mix Configuration

You need to parse and evaluate enough of `mix.exs` to extract project shape, but you should also store uncertainty because `mix.exs` can execute arbitrary Elixir.

```sql
CREATE TABLE mix_project_config (
  mix_project_config_id uuid PRIMARY KEY,
  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  app_name           text,
  version            text,
  elixir_requirement text,

  apps_path          text,
  config_path        text,
  deps_path          text,
  lockfile_path      text,
  build_path         text,

  start_permanent_expr text,

  project_config_json jsonb NOT NULL DEFAULT '{}',
  application_config_json jsonb NOT NULL DEFAULT '{}',
  aliases_json       jsonb NOT NULL DEFAULT '{}',
  compilers_json     jsonb NOT NULL DEFAULT '[]',

  extraction_status  text NOT NULL,
  -- exact_static, evaluated_in_sandbox, partial_static, failed, dynamic_unknown

  confidence         numeric NOT NULL DEFAULT 1.0,

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

Why this matters:

```elixir
def project do
  [
    app: :billing,
    version: version(),
    deps: deps(),
    aliases: aliases(),
    elixirc_paths: elixirc_paths(Mix.env())
  ]
end
```

The architecture system needs to understand:

```text
What app is this?
Where are its deps?
Which config file applies?
Which lockfile applies?
Is this an umbrella?
What changes by environment?
What cannot be statically known?
```

---

# 6. Umbrella Relationships

Do not model umbrella merely as a boolean. It is a relationship graph.

```sql
CREATE TABLE umbrella_membership (
  umbrella_membership_id uuid PRIMARY KEY,

  parent_mix_project_id uuid NOT NULL REFERENCES mix_project_root(mix_project_id),
  child_mix_project_id  uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  child_app_name      text,
  child_path          text NOT NULL,

  membership_source   text NOT NULL,
  -- apps_path_scan, apps_paths_config, manual, inferred

  confidence          numeric NOT NULL DEFAULT 1.0,

  UNIQUE (parent_mix_project_id, child_mix_project_id)
);
```

A child can share:

```text
_build
deps
mix.lock
config/config.exs
```

with the umbrella parent. That shared build/config/dependency surface is architecturally important.

```sql
CREATE TABLE shared_mix_surface (
  shared_surface_id  uuid PRIMARY KEY,

  parent_mix_project_id uuid NOT NULL REFERENCES mix_project_root(mix_project_id),
  child_mix_project_id  uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  surface_kind       text NOT NULL,
  -- build_path, deps_path, config_path, lockfile, test_aliases, release_config

  parent_path        text,
  child_declared_path text,
  resolved_path      text,

  is_shared          boolean NOT NULL,
  confidence         numeric NOT NULL DEFAULT 1.0
);
```

This gives you views like:

```text
Which child apps share the same lockfile?
Which apps share runtime config?
Which apps can actually be versioned independently?
Which umbrella boundaries are real, and which are mostly organizational?
```

---

# 7. OTP Application Identity vs Instance

This is another missing piece.

In a large estate, `:billing` is a logical OTP application. But it may appear in different repo revisions, different branches, different releases, or even duplicated accidentally.

So split identity from instance.

```sql
CREATE TABLE otp_application_identity (
  otp_app_identity_id uuid PRIMARY KEY,
  workspace_id        uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  app_name            text NOT NULL,
  canonical_label     text,

  logical_owner_id    uuid,
  domain_id           uuid,

  metadata            jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, app_name)
);

CREATE TABLE otp_application_instance (
  otp_app_instance_id uuid PRIMARY KEY,

  otp_app_identity_id uuid NOT NULL REFERENCES otp_application_identity(otp_app_identity_id),
  mix_project_id      uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  app_name            text NOT NULL,
  version             text,

  application_module  text,
  -- Example: Billing.Application

  has_supervision_tree boolean NOT NULL DEFAULT false,

  extra_applications_json jsonb NOT NULL DEFAULT '[]',
  included_applications_json jsonb NOT NULL DEFAULT '[]',

  application_config_json jsonb NOT NULL DEFAULT '{}',

  confidence          numeric NOT NULL DEFAULT 1.0,

  UNIQUE (mix_project_id, app_name)
);
```

This allows you to distinguish:

```text
Logical app:
  :billing

Concrete app instances:
  repo_a/apps/billing at commit 123
  repo_a/apps/billing at commit 456
  repo_b/deps/billing at commit abc
```

---

# 8. Dependency Architecture

Dependencies need to be modeled at multiple levels:

| Dependency Type          | Example                                       |
| ------------------------ | --------------------------------------------- |
| Hex dependency           | `{:ecto, "~> 3.12"}`                          |
| Git dependency           | `{:internal_auth, git: "...", tag: "v1.2.0"}` |
| Path dependency          | `{:shared, path: "../shared"}`                |
| Umbrella sibling         | `{:billing, in_umbrella: true}`               |
| Runtime OTP dependency   | `extra_applications: [:logger]`               |
| Compile-time dependency  | macros, behaviours, protocols                 |
| Architectural dependency | Billing depends on Accounts                   |

Schema:

```sql
CREATE TABLE dependency_declaration (
  dependency_declaration_id uuid PRIMARY KEY,

  mix_project_id      uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  dep_app_name        text NOT NULL,
  dep_kind            text NOT NULL,
  -- hex, git, path, in_umbrella, local, unknown

  requirement_text    text,
  options_json        jsonb NOT NULL DEFAULT '{}',

  declared_in_path    text NOT NULL,
  source_span_id      uuid,

  extraction_status   text NOT NULL,
  confidence          numeric NOT NULL DEFAULT 1.0
);

CREATE TABLE dependency_resolution (
  dependency_resolution_id uuid PRIMARY KEY,

  dependency_declaration_id uuid NOT NULL REFERENCES dependency_declaration(dependency_declaration_id),

  resolved_kind       text NOT NULL,
  -- workspace_app, umbrella_child, external_hex, external_git, path_project,
  -- unresolved, ambiguous

  resolved_mix_project_id uuid REFERENCES mix_project_root(mix_project_id),
  resolved_otp_app_identity_id uuid REFERENCES otp_application_identity(otp_app_identity_id),

  resolved_version    text,
  resolved_commit_sha text,
  resolved_path       text,
  lockfile_entry_json jsonb NOT NULL DEFAULT '{}',

  confidence          numeric NOT NULL DEFAULT 1.0
);
```

Then dependency edges become a graph:

```sql
CREATE TABLE architecture_dependency_edge (
  dependency_edge_id uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  source_mix_project_id uuid REFERENCES mix_project_root(mix_project_id),
  source_otp_app_identity_id uuid REFERENCES otp_application_identity(otp_app_identity_id),

  target_mix_project_id uuid REFERENCES mix_project_root(mix_project_id),
  target_otp_app_identity_id uuid REFERENCES otp_application_identity(otp_app_identity_id),

  target_external_package_id uuid,

  edge_kind           text NOT NULL,
  -- declared_mix_dep, resolved_mix_dep, runtime_otp_dep,
  -- compile_time_macro_dep, behaviour_dep, protocol_dep,
  -- config_dep, architectural_inferred_dep

  direction           text NOT NULL DEFAULT 'source_to_target',

  strength            numeric NOT NULL DEFAULT 1.0,
  confidence          numeric NOT NULL DEFAULT 1.0,

  evidence_json       jsonb NOT NULL DEFAULT '{}',
  metadata            jsonb NOT NULL DEFAULT '{}'
);
```

This is one of the most important tables in the whole system.

---

# 9. External Packages and Internal Packages

You need external dependencies to appear in the same graph, but not as if they are source-owned components.

```sql
CREATE TABLE external_package (
  external_package_id uuid PRIMARY KEY,

  package_ecosystem  text NOT NULL,
  -- hex, git, npm, rebar, system, docker, unknown

  package_name       text NOT NULL,
  package_source     text,
  -- hex.pm, github, private_git, path, unknown

  canonical_key      text NOT NULL,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (package_ecosystem, canonical_key)
);

CREATE TABLE external_package_version (
  external_package_version_id uuid PRIMARY KEY,
  external_package_id uuid NOT NULL REFERENCES external_package(external_package_id),

  version_text       text,
  commit_sha         text,
  source_url         text,

  lockfile_json      jsonb NOT NULL DEFAULT '{}',

  UNIQUE (external_package_id, version_text, commit_sha)
);
```

This lets the UI show:

```text
Internal dependency
External dependency
Private package
Path dependency
Unresolved dependency
Version conflict
```

---

# 10. Architecture Entities: The Rollup Graph

Now comes the actual architecture layer.

Do not directly use `module`, `file`, or `function` as architecture nodes. Instead, define architecture entities that can be backed by many lower-level anchors.

```sql
CREATE TABLE architecture_entity (
  architecture_entity_id uuid PRIMARY KEY,

  snapshot_id         uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  entity_kind         text NOT NULL,
  -- workspace, repo_group, repository, mix_project, umbrella,
  -- otp_application, release, service, bounded_context,
  -- domain, subsystem, component, library, external_system,
  -- data_store, message_bus, job_queue, api_surface

  canonical_key       text NOT NULL,
  display_name        text NOT NULL,

  parent_entity_id    uuid REFERENCES architecture_entity(architecture_entity_id),

  primary_repository_id uuid REFERENCES repository(repository_id),
  primary_mix_project_id uuid REFERENCES mix_project_root(mix_project_id),
  primary_otp_app_identity_id uuid REFERENCES otp_application_identity(otp_app_identity_id),

  description         text,
  confidence          numeric NOT NULL DEFAULT 1.0,

  metadata            jsonb NOT NULL DEFAULT '{}',

  UNIQUE (snapshot_id, entity_kind, canonical_key)
);
```

Examples:

```text
domain:identity
bounded_context:identity.accounts
service:auth_api
otp_app:accounts
otp_app:billing
repository:payment-platform
umbrella:core_umbrella
external_system:stripe
data_store:postgres.main
message_bus:oban
api_surface:billing_public_api
```

Then connect architecture entities to code anchors:

```sql
CREATE TABLE architecture_entity_anchor (
  architecture_entity_anchor_id uuid PRIMARY KEY,

  architecture_entity_id uuid NOT NULL REFERENCES architecture_entity(architecture_entity_id),
  anchor_id              uuid NOT NULL,

  role                   text NOT NULL,
  -- defines, implements, configures, documents, tests, owns,
  -- entrypoint, boundary, adapter, internal_detail

  weight                 numeric NOT NULL DEFAULT 1.0,
  confidence             numeric NOT NULL DEFAULT 1.0,

  evidence_fact_id       uuid,

  UNIQUE (architecture_entity_id, anchor_id, role)
);
```

This is how a bounded context rolls down into code:

```text
Bounded Context: Billing
  backed by:
    repo_a/apps/billing
    Billing.*
    BillingWeb.*
    Oban workers related to billing
    Ecto schemas related to invoices
    tests/billing/*
    config keys under :billing
```

---

# 11. Architecture Edges

Architecture edges are higher-level than call graph edges.

```sql
CREATE TABLE architecture_edge (
  architecture_edge_id uuid PRIMARY KEY,

  snapshot_id          uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  source_entity_id     uuid NOT NULL REFERENCES architecture_entity(architecture_entity_id),
  target_entity_id     uuid NOT NULL REFERENCES architecture_entity(architecture_entity_id),

  edge_kind            text NOT NULL,
  -- depends_on, calls, publishes_to, subscribes_to, reads_from,
  -- writes_to, supervises, deploys_with, configured_by,
  -- owns, uses_library, exposes_api_to, sends_job_to,
  -- shares_lockfile_with, shares_config_with, violates_boundary

  directionality       text NOT NULL DEFAULT 'directed',
  -- directed, bidirectional, undirected

  layer                text NOT NULL,
  -- build, compile, runtime, data, domain, ownership, deployment, inferred

  strength             numeric NOT NULL DEFAULT 1.0,
  confidence           numeric NOT NULL DEFAULT 1.0,
  risk_score           numeric NOT NULL DEFAULT 0.0,

  evidence_json        jsonb NOT NULL DEFAULT '{}',
  metadata             jsonb NOT NULL DEFAULT '{}',

  UNIQUE (snapshot_id, source_entity_id, target_entity_id, edge_kind, layer)
);
```

This lets you model:

```text
Billing depends_on Accounts
Billing writes_to Postgres
Notifications subscribes_to PubSub topic
Auth exposes_api_to Mobile Gateway
Core umbrella shares_lockfile_with Billing
Identity violates_boundary Money
Telemetry observes Billing
```

The architecture graph should be navigable independently of the AST graph.

---

# 12. Bounded Contexts and Domains

For large systems, this is essential.

```sql
CREATE TABLE domain_model (
  domain_id           uuid PRIMARY KEY,
  workspace_id        uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  domain_key          text NOT NULL,
  display_name        text NOT NULL,

  description         text,
  owner_team_id       uuid,

  confidence          numeric NOT NULL DEFAULT 0.5,
  origin              text NOT NULL,
  -- user_defined, inferred_from_namespaces, inferred_from_deps,
  -- inferred_from_docs, imported_from_catalog

  metadata            jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, domain_key)
);

CREATE TABLE bounded_context (
  bounded_context_id  uuid PRIMARY KEY,
  workspace_id        uuid NOT NULL REFERENCES architecture_workspace(workspace_id),
  domain_id           uuid REFERENCES domain_model(domain_id),

  context_key         text NOT NULL,
  display_name        text NOT NULL,

  description         text,
  owner_team_id       uuid,

  confidence          numeric NOT NULL DEFAULT 0.5,
  origin              text NOT NULL,

  metadata            jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, context_key)
);

CREATE TABLE bounded_context_membership (
  membership_id       uuid PRIMARY KEY,

  bounded_context_id  uuid NOT NULL REFERENCES bounded_context(bounded_context_id),
  architecture_entity_id uuid NOT NULL REFERENCES architecture_entity(architecture_entity_id),

  role                text NOT NULL,
  -- primary, supporting, shared_kernel, adapter, external_dependency,
  -- anti_corruption_layer, unclear

  confidence          numeric NOT NULL DEFAULT 0.5,
  evidence_json       jsonb NOT NULL DEFAULT '{}',

  UNIQUE (bounded_context_id, architecture_entity_id, role)
);
```

This lets the UI ask:

```text
Show me Billing as a domain, not as files.
Show me all code that probably belongs to Identity.
Show me modules that violate context boundaries.
Show me shared-kernel modules.
Show me adapters between contexts.
```

---

# 13. Runtime Systems, Services, and Releases

Large Elixir architecture is not just project structure. It is runtime topology.

A Mix project may define releases. An OTP application may run inside one release, many releases, or no release. A service may be a release, a container, a Kubernetes deployment, a Fly.io app, a bare BEAM node, or something else.

```sql
CREATE TABLE release_profile (
  release_profile_id uuid PRIMARY KEY,

  mix_project_id     uuid NOT NULL REFERENCES mix_project_root(mix_project_id),

  release_name       text NOT NULL,
  release_config_json jsonb NOT NULL DEFAULT '{}',

  included_apps_json jsonb NOT NULL DEFAULT '[]',
  runtime_config_paths_json jsonb NOT NULL DEFAULT '[]',

  extraction_status  text NOT NULL,
  confidence         numeric NOT NULL DEFAULT 1.0,

  UNIQUE (mix_project_id, release_name)
);

CREATE TABLE runtime_service (
  runtime_service_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  service_key        text NOT NULL,
  display_name       text NOT NULL,

  service_kind       text NOT NULL,
  -- beam_release, phoenix_endpoint, worker_service, cron_service,
  -- library_only, external_service, unknown

  owning_team_id     uuid,
  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, service_key)
);

CREATE TABLE runtime_service_mapping (
  runtime_service_mapping_id uuid PRIMARY KEY,

  runtime_service_id uuid NOT NULL REFERENCES runtime_service(runtime_service_id),
  release_profile_id uuid REFERENCES release_profile(release_profile_id),
  otp_app_instance_id uuid REFERENCES otp_application_instance(otp_app_instance_id),
  architecture_entity_id uuid REFERENCES architecture_entity(architecture_entity_id),

  role               text NOT NULL,
  -- primary_app, included_app, dependency_app, endpoint, worker, supervisor

  confidence         numeric NOT NULL DEFAULT 1.0
);
```

This gives a view like:

```text
Service: billing-api
  release: billing_api
  primary app: :billing_web
  included apps:
    :billing
    :accounts_client
    :telemetry_platform
  external systems:
    Stripe
    Postgres
    Oban
    PubSub
```

---

# 14. Supervision Topology as Architecture

Previously we had OTP components at the local code level. At architecture level, supervision topology should roll up into runtime entities.

```sql
CREATE TABLE supervision_tree (
  supervision_tree_id uuid PRIMARY KEY,

  snapshot_id         uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  otp_app_instance_id uuid REFERENCES otp_application_instance(otp_app_instance_id),
  runtime_service_id  uuid REFERENCES runtime_service(runtime_service_id),

  root_module         text,
  root_anchor_id      uuid,

  tree_kind           text NOT NULL,
  -- application_root, dynamic_supervisor, nested_supervisor, inferred

  confidence          numeric NOT NULL DEFAULT 1.0,
  metadata            jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE supervision_node (
  supervision_node_id uuid PRIMARY KEY,

  supervision_tree_id uuid NOT NULL REFERENCES supervision_tree(supervision_tree_id),

  parent_node_id      uuid REFERENCES supervision_node(supervision_node_id),

  module_name         text,
  process_name        text,
  child_spec_json     jsonb NOT NULL DEFAULT '{}',

  node_kind           text NOT NULL,
  -- supervisor, dynamic_supervisor, genserver, task_supervisor,
  -- registry, repo, endpoint, worker, unknown

  restart_strategy    text,
  shutdown_behavior   text,

  source_anchor_id    uuid,
  confidence          numeric NOT NULL DEFAULT 1.0
);
```

This enables architecture-level questions like:

```text
Which services start this GenServer?
Which supervision trees depend on this Repo?
What happens if this process fails?
Which apps have runtime state?
Which apps are library-only?
```

---

# 15. Configuration Architecture

For Elixir systems, architecture often lives in config.

You need first-class config modeling.

```sql
CREATE TABLE config_surface (
  config_surface_id  uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  surface_kind       text NOT NULL,
  -- config_exs, runtime_exs, environment_config, release_config,
  -- app_env, system_env, secrets, compile_time_config

  repository_revision_id uuid REFERENCES repository_revision(repository_revision_id),
  mix_project_id     uuid REFERENCES mix_project_root(mix_project_id),

  path               text,
  environment        text,
  -- dev, test, prod, runtime, all, unknown

  metadata           jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE config_key (
  config_key_id      uuid PRIMARY KEY,

  config_surface_id  uuid NOT NULL REFERENCES config_surface(config_surface_id),

  app_name           text,
  key_path           text[] NOT NULL,

  value_kind         text,
  -- literal, env_var, module, function_ref, secret_ref, dynamic, unknown

  value_preview      text,
  value_json         jsonb,

  source_span_id     uuid,
  confidence         numeric NOT NULL DEFAULT 1.0
);

CREATE TABLE config_dependency_edge (
  config_dependency_edge_id uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  config_key_id      uuid NOT NULL REFERENCES config_key(config_key_id),

  target_entity_id   uuid REFERENCES architecture_entity(architecture_entity_id),
  target_anchor_id   uuid,

  dependency_kind    text NOT NULL,
  -- configures_app, configures_endpoint, configures_repo,
  -- configures_worker, configures_external_system,
  -- compile_time_affects_runtime

  confidence         numeric NOT NULL DEFAULT 1.0
);
```

This lets the UI show:

```text
This app depends on this config key.
This config key points to this Repo.
This environment variable controls this service.
This compile-time config affects this module.
This runtime config is shared across umbrella children.
```

---

# 16. Ownership and Socio-Technical Architecture

For real large codebases, architecture includes people and ownership.

```sql
CREATE TABLE team (
  team_id            uuid PRIMARY KEY,
  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  team_key           text NOT NULL,
  display_name       text NOT NULL,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, team_key)
);

CREATE TABLE ownership_assignment (
  ownership_assignment_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  team_id            uuid NOT NULL REFERENCES team(team_id),

  architecture_entity_id uuid REFERENCES architecture_entity(architecture_entity_id),
  repository_id      uuid REFERENCES repository(repository_id),
  mix_project_id     uuid REFERENCES mix_project_root(mix_project_id),
  otp_app_identity_id uuid REFERENCES otp_application_identity(otp_app_identity_id),
  anchor_id          uuid,

  ownership_kind     text NOT NULL,
  -- owns, maintains, reviews, operates, deprecated_owner, unclear

  source             text NOT NULL,
  -- codeowners, manual, inferred_from_commits, inferred_from_docs,
  -- imported_catalog

  confidence         numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

This supports:

```text
Show me the owner of this service.
Show cross-team dependency paths.
Show unowned apps.
Show architecture risk by team.
Show files where ownership and dependency direction disagree.
```

---

# 17. Architecture Facts

The previous `semantic_fact` table was code-local. You also need architectural facts.

```sql
CREATE TABLE architecture_fact (
  architecture_fact_id uuid PRIMARY KEY,

  snapshot_id         uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),

  primary_entity_id   uuid REFERENCES architecture_entity(architecture_entity_id),
  primary_edge_id     uuid REFERENCES architecture_edge(architecture_edge_id),

  fact_type           text NOT NULL,
  -- system_summary, responsibility, boundary_rule,
  -- dependency_risk, deployment_note, ownership_note,
  -- coupling_note, architectural_smell, migration_hint,
  -- service_contract, runtime_behavior, scaling_constraint

  title               text,
  body_text           text,
  body_json           jsonb NOT NULL DEFAULT '{}',

  confidence          numeric NOT NULL DEFAULT 0.5,
  utility_score       numeric NOT NULL DEFAULT 0.5,
  risk_score          numeric NOT NULL DEFAULT 0.0,

  verification_state  text NOT NULL DEFAULT 'unverified',
  -- static_exact, inferred, llm_inferred, user_verified,
  -- contradicted, stale

  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE architecture_fact_evidence (
  architecture_fact_evidence_id uuid PRIMARY KEY,

  architecture_fact_id uuid NOT NULL REFERENCES architecture_fact(architecture_fact_id),

  evidence_entity_id uuid REFERENCES architecture_entity(architecture_entity_id),
  evidence_edge_id   uuid REFERENCES architecture_edge(architecture_edge_id),
  evidence_anchor_id uuid,
  evidence_span_id   uuid,

  evidence_role      text NOT NULL,
  -- supports, weakens, contradicts, source_location,
  -- dependency_declaration, config_key, release_config,
  -- supervision_node, ownership_file, runtime_trace

  quote_text         text,
  weight             numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

Architectural claims should be evidence-backed just like code-level claims.

Example:

```text
Fact:
  Billing has a hard compile-time dependency on Accounts.

Evidence:
  billing/mix.exs declares {:accounts, in_umbrella: true}
  Billing.Invoice calls Accounts.Customer.lookup/1
  Billing config reads :accounts_client keys
```

---

# 18. Architecture Boundary Rules

A large tool needs to expose architectural contracts.

```sql
CREATE TABLE architecture_boundary_rule (
  boundary_rule_id   uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL REFERENCES architecture_workspace(workspace_id),

  rule_key           text NOT NULL,
  display_name       text NOT NULL,

  rule_kind          text NOT NULL,
  -- allowed_dependency, forbidden_dependency,
  -- allowed_call_direction, required_adapter,
  -- no_direct_repo_access, no_cross_context_schema_access,
  -- no_compile_time_dependency

  source_selector_json jsonb NOT NULL,
  target_selector_json jsonb NOT NULL,

  severity           text NOT NULL,
  -- info, warning, error, critical

  rule_source        text NOT NULL,
  -- manual, inferred, imported_architecture_doc, generated

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, rule_key)
);

CREATE TABLE architecture_boundary_violation (
  violation_id       uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),
  boundary_rule_id   uuid NOT NULL REFERENCES architecture_boundary_rule(boundary_rule_id),

  source_entity_id   uuid REFERENCES architecture_entity(architecture_entity_id),
  target_entity_id   uuid REFERENCES architecture_entity(architecture_entity_id),

  source_anchor_id   uuid,
  target_anchor_id   uuid,

  violation_kind     text NOT NULL,
  title              text,
  explanation        text,

  severity_score     numeric NOT NULL DEFAULT 0.5,
  confidence         numeric NOT NULL DEFAULT 1.0,

  evidence_json      jsonb NOT NULL DEFAULT '{}',

  status             text NOT NULL DEFAULT 'open'
);
```

This is where the tool becomes powerful:

```text
Billing must not call Auth internals.
Web layer must not call Repo directly.
Notifications must use EventBus, not direct service calls.
Platform apps can depend on domain apps? No.
Domain apps can depend on platform apps? Yes.
```

---

# 19. Rollup Metrics

Architecture needs aggregate metrics.

```sql
CREATE TABLE architecture_metric (
  architecture_metric_id uuid PRIMARY KEY,

  snapshot_id          uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),
  architecture_entity_id uuid REFERENCES architecture_entity(architecture_entity_id),
  architecture_edge_id uuid REFERENCES architecture_edge(architecture_edge_id),

  metric_key           text NOT NULL,
  metric_kind          text NOT NULL,
  -- count, ratio, score, rank, boolean

  numeric_value        numeric,
  text_value           text,
  json_value           jsonb,

  calculation_method   text NOT NULL,
  confidence           numeric NOT NULL DEFAULT 1.0,

  UNIQUE (
    snapshot_id,
    architecture_entity_id,
    architecture_edge_id,
    metric_key
  )
);
```

Useful metrics:

```text
afferent_coupling
efferent_coupling
instability
public_api_surface_area
cross_context_call_count
compile_time_dependency_count
runtime_dependency_count
external_dependency_count
unowned_code_ratio
test_coverage_proxy
config_surface_area
supervision_complexity
message_flow_fanout
boundary_violation_count
```

For the UI, metrics are just another knob dimension.

---

# 20. Architecture Projection Layer

The previous projection system needs an architecture counterpart.

```sql
CREATE TABLE architecture_viewpoint (
  architecture_viewpoint_id uuid PRIMARY KEY,

  viewpoint_key       text NOT NULL UNIQUE,
  display_name        text NOT NULL,

  viewpoint_kind      text NOT NULL,
  -- portfolio_map, repo_map, umbrella_map, dependency_map,
  -- bounded_context_map, runtime_topology, deployment_map,
  -- ownership_map, risk_map, change_impact_map

  layout_spec_json    jsonb NOT NULL DEFAULT '{}',
  default_axes_json   jsonb NOT NULL DEFAULT '{}',

  description         text
);
```

```sql
CREATE TABLE architecture_projection_instance (
  architecture_projection_id uuid PRIMARY KEY,

  snapshot_id         uuid NOT NULL REFERENCES workspace_snapshot(snapshot_id),
  architecture_viewpoint_id uuid NOT NULL REFERENCES architecture_viewpoint(architecture_viewpoint_id),

  root_entity_id      uuid REFERENCES architecture_entity(architecture_entity_id),

  axis_state_json     jsonb NOT NULL DEFAULT '{}',
  projection_hash     bytea NOT NULL,

  render_status       text NOT NULL DEFAULT 'ready',

  created_at          timestamptz NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE architecture_projection_item (
  architecture_projection_item_id uuid PRIMARY KEY,

  architecture_projection_id uuid NOT NULL REFERENCES architecture_projection_instance(architecture_projection_id),

  item_order          integer NOT NULL,

  entity_id           uuid REFERENCES architecture_entity(architecture_entity_id),
  edge_id             uuid REFERENCES architecture_edge(architecture_edge_id),
  fact_id             uuid REFERENCES architecture_fact(architecture_fact_id),
  metric_id           uuid REFERENCES architecture_metric(architecture_metric_id),

  card_kind           text NOT NULL,
  -- entity_card, edge_card, repo_card, app_card, domain_card,
  -- dependency_card, violation_card, metric_card, path_card,
  -- ownership_card, release_card

  render_payload_json jsonb NOT NULL,

  salience_score      numeric NOT NULL DEFAULT 0.5,
  confidence          numeric NOT NULL DEFAULT 1.0
);
```

Now the UI can start at:

```text
Workspace architecture
```

and drill down to:

```text
Domain
  -> bounded context
    -> service
      -> OTP app
        -> Mix project
          -> module
            -> function
              -> clause
                -> AST node
```

Or move sideways:

```text
Billing service
  -> dependencies
  -> owner team
  -> release
  -> runtime config
  -> external systems
  -> tests
  -> boundary violations
```

---

# 21. Architecture Navigation Axes

For large codebases, your knobs should not only modulate source-level facts. They should modulate architectural dimensions.

Recommended architecture axes:

| Axis                 | Values                                                                       |
| -------------------- | ---------------------------------------------------------------------------- |
| `architecture_level` | workspace, repo_group, repo, mix_project, otp_app, service, module, function |
| `structure_mode`     | physical, build, runtime, domain, ownership, deployment                      |
| `dependency_mode`    | declared, resolved, compile_time, runtime, inferred, external                |
| `boundary_mode`      | all, allowed, suspicious, violated, unknown                                  |
| `coupling_direction` | upstream, downstream, bidirectional, transitive                              |
| `runtime_mode`       | supervision, message_flow, release, endpoint, worker                         |
| `config_mode`        | compile_time, runtime, env_specific, secrets, shared                         |
| `change_scope`       | local, app, umbrella, repo, cross_repo, release                              |
| `confidence_filter`  | exact, high, medium, inferred, speculative                                   |
| `risk_filter`        | none, low, medium, high, critical                                            |

This is what makes it possible to “zoom” across a multi-repo estate.

---

# 22. Example Architecture View: Multi-Repo Elixir Estate

Imagine the system discovers this:

```text
Workspace: Commerce Platform

Repository Group: Core Product
  repo: commerce-core
    umbrella: commerce_umbrella
      app: accounts
      app: billing
      app: notifications

Repository Group: Identity
  repo: identity-services
    project: auth_api
    project: identity_core

Repository Group: Platform
  repo: platform-libs
    project: telemetry_platform
    project: shared_config
```

Architecture graph:

```text
Domain: Identity
  owns:
    accounts
    auth_api
    identity_core

Domain: Money
  owns:
    billing

Domain: Communication
  owns:
    notifications

Domain: Platform
  owns:
    telemetry_platform
    shared_config
```

Dependency graph:

```text
billing
  depends_on accounts
  depends_on telemetry_platform
  writes_to postgres.main
  publishes_to notifications.events

notifications
  depends_on shared_config
  subscribes_to billing.events
  calls external_system:sendgrid

auth_api
  depends_on identity_core
  exposes_api_to external_system:web_frontend
```

Now the UI can show:

```text
Knob: structure_mode = physical
  Shows repositories and Mix project roots.

Knob: structure_mode = build
  Shows umbrellas, child apps, Mix deps, lockfiles.

Knob: structure_mode = runtime
  Shows releases, supervision trees, services, workers.

Knob: structure_mode = domain
  Shows bounded contexts and cross-context dependencies.

Knob: dependency_mode = compile_time
  Shows macro/behaviour/module dependencies.

Knob: dependency_mode = runtime
  Shows GenServer calls, PubSub, Oban, HTTP, Repo access.

Knob: boundary_mode = violated
  Shows only edges breaking architecture rules.
```

---

# 23. Architecture Extraction Pipeline

The corrected pipeline becomes:

```text
1. Discover workspace
   - repositories
   - repo groups
   - branches / commits
   - selected snapshot

2. Scan each repository revision
   - locate every mix.exs
   - locate umbrellas
   - locate child projects
   - locate config files
   - locate lockfiles
   - locate release config

3. Parse every mix.exs
   - project/0
   - application/0
   - deps/0
   - aliases
   - elixirc_paths
   - apps_path
   - build/config/deps/lockfile paths

4. Build Mix project graph
   - regular projects
   - umbrella parents
   - umbrella children
   - path deps
   - git deps
   - Hex deps
   - unresolved/dynamic deps

5. Build OTP app graph
   - app names
   - application callback modules
   - extra_applications
   - included_applications
   - supervision roots

6. Build source-level graph
   - files
   - AST
   - modules
   - functions
   - calls
   - macros
   - clauses
   - facts

7. Roll source-level graph upward
   - module -> app
   - app -> mix project
   - mix project -> repo
   - app -> domain/context
   - app -> runtime service
   - service -> release

8. Infer architecture entities
   - domains
   - bounded contexts
   - services
   - adapters
   - shared kernels
   - external systems
   - data stores
   - job queues
   - message buses

9. Infer architecture edges
   - build deps
   - compile deps
   - runtime calls
   - data access
   - config deps
   - ownership links
   - deployment links

10. Generate architecture facts
   - summaries
   - risks
   - boundary notes
   - change impact
   - coupling explanation
   - service responsibilities

11. Materialize architecture projections
   - portfolio map
   - dependency map
   - umbrella map
   - runtime topology
   - bounded context map
   - ownership map
   - change impact map
```

---

# 24. The New Core Object

The previous core object was:

```text
AST-anchored semantic hypergraph
```

The corrected core object should be:

```text
A workspace-level architecture hypergraph whose leaves are AST-anchored semantic graphs.
```

More precisely:

> A **versioned multi-repository architecture graph** containing physical repositories, Mix projects, OTP applications, runtime services, domains, bounded contexts, dependencies, ownership, releases, configuration surfaces, and external systems, with every high-level node and edge backed by source-level anchors and evidence.

That is the real structure.

---

# 25. Minimal Architecture Schema to Add First

Start with these tables before going deeper:

```text
architecture_workspace
repository_group
repository
repository_revision
workspace_snapshot
workspace_snapshot_member

mix_project_root
mix_project_config
umbrella_membership
shared_mix_surface

otp_application_identity
otp_application_instance

dependency_declaration
dependency_resolution
architecture_dependency_edge

architecture_entity
architecture_entity_anchor
architecture_edge
architecture_fact
architecture_fact_evidence

architecture_viewpoint
architecture_projection_instance
architecture_projection_item
```

That gives you a real large-system architecture substrate.

---

# 26. Important Correction to the Previous Design

The previous design should not be thrown away. It should be nested.

The corrected hierarchy is:

```text
Architecture Workspace
  -> Snapshot
    -> Repository
      -> Mix Project
        -> OTP Application
          -> Runtime / Release / Supervision
          -> Source Files
            -> Modules
              -> Functions
                -> Clauses
                  -> AST Nodes
                    -> Semantic Facts
```

But the UI should be able to navigate in both directions:

```text
top-down:
  Domain -> Service -> App -> Module -> Function

bottom-up:
  Function -> App -> Service -> Domain -> Owner Team

sideways:
  App -> Dependency -> External System -> Config -> Runtime Service

diagonal:
  Risk -> Boundary Violation -> Cross-Repo Dependency -> Owning Team
```

That is the missing architecture layer.

[1]: https://hexdocs.pm/mix/Mix.Project.html "Mix.Project — Mix v1.19.5"
[2]: https://hexdocs.pm/elixir/main/dependencies-and-umbrella-projects.html "Dependencies and umbrella projects — Elixir v1.20.0-dev"
