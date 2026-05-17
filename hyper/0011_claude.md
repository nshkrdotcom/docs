Exactly right. The existing schema bottoms out at the AST and has exactly one `repos` table as a throwaway foreign key. It has no concept of architectural topology whatsoever. What's missing is the entire **stratum above the AST** — and in a large Elixir system that stratum is itself multi-layered.

Let me map the full vertical first, then schema each missing layer.

---

### The Full Vertical — What Actually Exists

```
Organization / Monorepo Root
  └── Repository Group (e.g. "platform", "data", "infra")
        └── Repository
              └── Umbrella Project (mix.exs with :umbrella)
                    └── OTP Application (apps/*/mix.exs)
                          └── Namespace / Bounded Context (convention, not syntax)
                                └── Module
                                      └── Function / Clause / Expression
                                            └── AST Node
```

The existing schema covers the bottom three rows. Everything above `Module` is completely absent. And crucially — **the most architecturally meaningful understanding happens in the middle of this stack**, not at the bottom.

---

### Missing Layer 0: Organization & Repository Groups

```sql
-- ============================================================
-- Organizations and repository topology
-- ============================================================

CREATE TABLE organizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  kind            TEXT,  -- 'monorepo' | 'multi-repo' | 'hybrid'
  metadata        JSONB DEFAULT '{}'
);

-- A logical grouping of repos that form a system boundary
-- e.g. "platform-services", "ml-pipeline", "frontend-apis"
CREATE TABLE repo_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id),
  name            TEXT NOT NULL,
  description     TEXT,
  system_role     TEXT,  -- 'core-domain' | 'supporting' | 'generic' | 'infrastructure'
  metadata        JSONB DEFAULT '{}'
);

-- repos table gains foreign keys upward
ALTER TABLE repos ADD COLUMN org_id    UUID REFERENCES organizations(id);
ALTER TABLE repos ADD COLUMN group_id  UUID REFERENCES repo_groups(id);
ALTER TABLE repos ADD COLUMN repo_role TEXT; -- 'umbrella-host' | 'standalone-app' | 'lib-only'
```

---

### Missing Layer 1: OTP Applications & Umbrella Structure

This is the critical missing piece. Each `mix.exs` is a first-class entity. The distinction between an umbrella root and its children, and between inter-umbrella dependencies vs. cross-repo Hex dependencies, is architecturally fundamental.

```sql
-- ============================================================
-- OTP Applications (each mix.exs = one row)
-- ============================================================

CREATE TABLE otp_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id           UUID NOT NULL REFERENCES repos(id),
  parent_umbrella_id UUID REFERENCES otp_applications(id), -- null if standalone
  name              TEXT NOT NULL,    -- :my_app atom
  version           TEXT,
  elixir_requirement TEXT,
  otp_requirement   TEXT,
  app_path          TEXT NOT NULL,    -- relative path to mix.exs
  is_umbrella       BOOLEAN DEFAULT FALSE,
  is_umbrella_child BOOLEAN DEFAULT FALSE,
  start_permanent   BOOLEAN,
  application_mod   TEXT,             -- the module passed to :mod, if any
  env_defaults      JSONB,            -- :env key from mix project/0
  releases          JSONB,            -- :releases config
  metadata          JSONB DEFAULT '{}'
);

-- The dependencies declared in each mix.exs
-- This is architectural load-bearing — it defines coupling
CREATE TYPE dep_source AS ENUM (
  'hex',       -- from hex.pm
  'git',       -- git dep
  'path',      -- path dep (intra-umbrella or monorepo sibling)
  'umbrella'   -- in_umbrella: true
);

CREATE TABLE mix_dependencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaring_app_id UUID NOT NULL REFERENCES otp_applications(id),
  -- resolves to another otp_application row if internal
  resolved_app_id  UUID REFERENCES otp_applications(id),
  package_name    TEXT NOT NULL,
  version_req     TEXT,              -- "~> 1.2", ">= 0.9.0", etc.
  source          dep_source NOT NULL,
  git_url         TEXT,
  git_ref         TEXT,
  path_ref        TEXT,
  only_envs       TEXT[],           -- [:test], [:dev, :test], etc.
  runtime         BOOLEAN DEFAULT TRUE,
  optional        BOOLEAN DEFAULT FALSE,
  -- LLM-generated: what role does this dep play architecturally
  architectural_role TEXT,
  metadata        JSONB DEFAULT '{}'
);

CREATE INDEX ON mix_dependencies (declaring_app_id);
CREATE INDEX ON mix_dependencies (resolved_app_id);
CREATE INDEX ON mix_dependencies (package_name);
```

---

### Missing Layer 2: API Surfaces & Cross-Application Contracts

In a large Elixir system the boundary between two OTP applications is an **architectural contract**. The schema needs to reify that boundary explicitly — not infer it from call graphs alone.

```sql
-- ============================================================
-- API Surfaces: what each application exposes to others
-- ============================================================

CREATE TYPE surface_kind AS ENUM (
  'public_module',       -- modules explicitly part of the public API
  'behaviour_contract',  -- behaviours other apps implement
  'ecto_schema',         -- shared data shapes
  'phoenix_endpoint',    -- HTTP surface
  'live_view',           -- LiveView mountable components
  'pubsub_topic',        -- PubSub topics this app publishes to
  'genserver_name',      -- registered process names
  'ets_table',           -- shared ETS tables
  'telemetry_event',     -- emitted telemetry events
  'config_key'           -- application env keys other apps read
);

CREATE TABLE api_surfaces (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id           UUID NOT NULL REFERENCES otp_applications(id),
  kind             surface_kind NOT NULL,
  name             TEXT NOT NULL,       -- the module, topic, table name, etc.
  entity_id        UUID REFERENCES code_entities(id), -- points into AST if resolvable
  is_documented    BOOLEAN,
  stability        TEXT,  -- 'stable' | 'experimental' | 'internal' | 'deprecated'
  -- LLM-generated
  description      TEXT,
  contract_prose   TEXT,
  metadata         JSONB DEFAULT '{}'
);

-- Cross-application calls: who calls whose surface
-- This is separate from entity_relations because it crosses app boundaries
CREATE TABLE cross_app_relations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_app_id       UUID NOT NULL REFERENCES otp_applications(id),
  to_app_id         UUID NOT NULL REFERENCES otp_applications(id),
  surface_id        UUID REFERENCES api_surfaces(id),
  from_entity_id    UUID REFERENCES code_entities(id),
  to_entity_id      UUID REFERENCES code_entities(id),
  relation_kind     TEXT NOT NULL,
  -- 'direct_call' | 'pubsub' | 'ets_read' | 'ets_write' |
  -- 'config_read' | 'process_send' | 'rpc' | 'http' | 'behaviour_impl'
  is_synchronous    BOOLEAN,
  coupling_weight   FLOAT,  -- 0.0=decoupled, 1.0=tight
  call_frequency    TEXT,   -- 'hot_path' | 'background' | 'startup' | 'rare'
  metadata          JSONB DEFAULT '{}'
);

CREATE INDEX ON cross_app_relations (from_app_id, to_app_id);
CREATE INDEX ON cross_app_relations (surface_id);
```

---

### Missing Layer 3: Bounded Contexts & Architectural Boundaries

This is the layer that doesn't exist in Elixir syntax at all — it's purely architectural and must be derived from a combination of static analysis, naming conventions, and LLM inference. This is also the most valuable layer for a human navigating a large codebase.

```sql
-- ============================================================
-- Bounded Contexts: domain-driven conceptual boundaries
-- May span multiple apps, or live within one umbrella child
-- ============================================================

CREATE TABLE bounded_contexts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            UUID NOT NULL REFERENCES organizations(id),
  name              TEXT NOT NULL,     -- "Billing", "UserAuth", "Reporting"
  description       TEXT,
  domain_kind       TEXT,
  -- 'core-domain' | 'supporting-subdomain' | 'generic-subdomain'
  app_ids           UUID[],            -- which OTP apps belong to this context
  primary_app_id    UUID REFERENCES otp_applications(id),
  -- LLM-generated understanding of the context itself
  domain_language   JSONB,  -- ubiquitous language: {term: definition}
  invariants        TEXT[], -- business rules that must hold
  metadata          JSONB DEFAULT '{}'
);

-- Context map: how bounded contexts relate
-- (anti-corruption layer, shared kernel, customer-supplier, etc.)
CREATE TYPE context_relation_kind AS ENUM (
  'shared_kernel',
  'customer_supplier',
  'conformist',
  'anti_corruption_layer',
  'open_host_service',
  'published_language',
  'partnership',
  'separate_ways'
);

CREATE TABLE context_relations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upstream_id     UUID NOT NULL REFERENCES bounded_contexts(id),
  downstream_id   UUID NOT NULL REFERENCES bounded_contexts(id),
  kind            context_relation_kind NOT NULL,
  acl_app_id      UUID REFERENCES otp_applications(id), -- which app IS the ACL if applicable
  description     TEXT,
  metadata        JSONB DEFAULT '{}'
);
```

---

### Missing Layer 4: Architectural Patterns at System Level

```sql
-- ============================================================
-- System-level patterns: detected or declared architectural shapes
-- ============================================================

CREATE TYPE arch_pattern_kind AS ENUM (
  -- structural
  'hexagonal',             -- ports and adapters
  'layered',               -- presentation/domain/infrastructure
  'pipeline',              -- data transformation chain
  'event_driven',          -- event sourcing / CQRS
  'saga',                  -- distributed transaction pattern
  -- OTP-specific
  'supervision_tree',      -- full OTP supervisor hierarchy
  'worker_pool',           -- poolboy/nimble_pool pattern
  'registry_dispatch',     -- Registry-based dynamic dispatch
  'distributed_cluster',   -- multi-node BEAM topology
  -- communication
  'pubsub_bus',            -- Phoenix.PubSub topology
  'request_reply',         -- GenServer call pattern at scale
  'fire_and_forget',       -- cast-dominant pattern
  -- data
  'ecto_bounded_repo',     -- Ecto repo as bounded context boundary
  'read_replica_split',    -- separate read/write Ecto repos
  'multi_tenancy'          -- tenant isolation pattern
);

CREATE TABLE architectural_patterns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organizations(id),
  repo_id         UUID REFERENCES repos(id),
  app_id          UUID REFERENCES otp_applications(id),
  context_id      UUID REFERENCES bounded_contexts(id),
  kind            arch_pattern_kind NOT NULL,
  -- all the entity/app ids that participate in this pattern
  participant_app_ids    UUID[],
  participant_entity_ids UUID[],
  -- which entity is the "center" of this pattern
  anchor_entity_id UUID REFERENCES code_entities(id),
  confidence      FLOAT,   -- detection confidence
  description     TEXT,    -- LLM-generated explanation of HOW this pattern is implemented here
  deviations      TEXT[],  -- where the implementation deviates from the canonical pattern
  metadata        JSONB DEFAULT '{}'
);
```

---

### Missing Layer 5: Architectural Understanding Slices

The existing `understanding_slices` table works at entity granularity. We need an equivalent for the architectural layers, with different dimensions entirely.

```sql
-- ============================================================
-- Architectural understanding: LLM analysis at system level
-- Parallels understanding_slices but for higher abstractions
-- ============================================================

CREATE TYPE arch_subject_kind AS ENUM (
  'organization', 'repo_group', 'repo',
  'otp_application', 'bounded_context',
  'api_surface', 'cross_app_relation',
  'architectural_pattern', 'context_relation'
);

CREATE TYPE arch_dimension AS ENUM (
  -- structural
  'system_role',           -- what role this plays in the overall system
  'boundary_clarity',      -- how clean and explicit the boundary is
  'coupling_analysis',     -- afferent/efferent coupling, instability metric
  'cohesion_analysis',     -- does this app/context cohere around one concept
  'api_surface_quality',   -- is the exposed surface minimal and intentional
  -- behavioral
  'data_ownership',        -- what data does this own vs. share vs. borrow
  'failure_domain',        -- what fails together, blast radius
  'scaling_shape',         -- how this scales: stateful, stateless, sharded, etc.
  'deployment_coupling',   -- what must be deployed together
  -- evolutionary
  'change_frequency',      -- how often this changes and why
  'stability_requirement', -- how stable must this be for dependents
  'technical_debt',        -- architectural debt at this level
  -- organizational
  'ownership',             -- team/person ownership
  'ubiquitous_language',   -- domain language consistency
  -- OTP-specific
  'supervision_strategy',  -- restart strategies and their rationale
  'distribution_topology'  -- how this participates in cluster topology
);

CREATE TABLE architectural_understanding (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_kind    arch_subject_kind NOT NULL,
  subject_id      UUID NOT NULL,   -- polymorphic: references the appropriate table
  dimension       arch_dimension NOT NULL,
  granularity     SMALLINT NOT NULL CHECK (granularity BETWEEN 0 AND 10),
  content         JSONB NOT NULL,
  prose_summary   TEXT,
  model_id        TEXT NOT NULL,
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (subject_kind, subject_id, dimension, granularity)
);

CREATE INDEX ON architectural_understanding (subject_kind, subject_id);
CREATE INDEX ON architectural_understanding (dimension);
```

**Example `content` at architectural level:**

```jsonb
-- subject: otp_application "billing_core", dimension: coupling_analysis
{
  "afferent_coupling": 7,    -- 7 other apps depend on this
  "efferent_coupling": 2,    -- this depends on 2 others
  "instability": 0.22,       -- Ca/(Ca+Ce): relatively stable
  "abstractness": 0.61,      -- ratio of abstract entities
  "distance_from_main": 0.17,-- distance from stable-abstract ideal
  "problematic_dependents": [
    {
      "app": "reporting_engine",
      "coupling_kind": "direct_schema_access",
      "risk": "schema changes break reporting silently"
    }
  ],
  "recommendation": "reporting_engine should consume billing events, not query billing tables directly"
}

-- subject: bounded_context "UserAuth", dimension: boundary_clarity  
{
  "score": 0.43,
  "violations": [
    {
      "kind": "leaking_internals",
      "description": "UserAuth.Internal.TokenStore is called directly from 3 other apps",
      "offending_apps": ["admin_panel", "api_gateway"]
    },
    {
      "kind": "unclear_ownership",
      "description": "User struct is defined in auth_core but extended with billing fields in billing_core via Ecto embeds",
      "entities": ["UserAuth.User", "BillingCore.UserBillingEmbed"]
    }
  ],
  "strengths": ["Phoenix endpoint well-isolated", "PubSub events documented"]
}

-- subject: cross_app_relation, dimension: failure_domain
{
  "if_upstream_fails": "api_gateway degrades to cached responses for ~30s then returns 503",
  "if_downstream_fails": "billing_core queues events, retries with backoff, no data loss",
  "circuit_breaker_present": false,
  "timeout_configured": true,
  "recommendation": "add Fuse circuit breaker on api_gateway side of this call"
}
```

---

### Missing Layer 6: Materialized Projections Extended

The existing `materialized_projections` must now support navigation across the full vertical:

```sql
-- Projection configs need to understand architectural scope
ALTER TABLE projection_configs ADD COLUMN scope_levels TEXT[];
-- e.g. ['organization', 'repo_group', 'otp_application']
-- vs   ['otp_application', 'bounded_context', 'module']
-- vs   ['module', 'function', 'clause']

-- A new projection type for architectural views
CREATE TABLE architectural_projections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_kind      arch_subject_kind NOT NULL,
  subject_id        UUID NOT NULL,
  config_id         UUID NOT NULL REFERENCES projection_configs(id),
  rendered          JSONB NOT NULL,
  -- navigation at architectural scope
  nav_up_id         UUID,   -- e.g. from app → umbrella → repo
  nav_up_kind       arch_subject_kind,
  nav_down_ids      UUID[], -- e.g. from app → its bounded contexts
  nav_down_kind     arch_subject_kind,
  nav_lateral_ids   UUID[], -- sibling apps in same umbrella/group
  nav_cross_cutting UUID[], -- cross_app_relations involving this subject
  -- bridge to entity-level
  entry_point_ids   UUID[], -- code_entities that are the "front door" into this app
  hot_path_ids      UUID[], -- most traversed paths through this app
  generated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (subject_kind, subject_id, config_id)
);
```

---

### The Full Vertical Now — Navigation Across All Layers

The "zoom" axis of the UI is now a traversal through this full hierarchy:

```
architectural_projections [org]
  └── architectural_projections [repo_group]
        └── architectural_projections [repo]
              └── architectural_projections [otp_application]
                    └── architectural_projections [bounded_context]
                          └── materialized_projections [module]      ← existing
                                └── materialized_projections [function]
                                      └── materialized_projections [clause]
```

Each level has its own set of active `arch_dimension` or `understanding_dimension` values, its own appropriate `granularity`, and its own pre-computed neighbors. The "scope zoom" knob is a traversal up or down this table, switching between `architectural_projections` and `materialized_projections` at the module boundary.

The `cross_app_relations` table is what enables **diagonal navigation** — jumping from a function in `billing_core` directly to the `api_surface` it exposes, then to the `bounded_context` that consumes it in `api_gateway`, then down into the specific code in that other repo that calls it — all as a single navigable path pre-computed at materialization time.

That's the complete missing stratum.
