Yes. This is the missing concept.

Claude’s version says: **pre-materialized hyperdimensional index over an AST**, with architectural projections added above the AST and navigable vertical/diagonal paths through org → repo → OTP app → bounded context → module → function → clause. That is useful, but it still mostly treats architecture as a structure **over existing code**.  

What you are describing is larger:

> A system that connects **informal intent** to **formal architecture** to **implementation** to **line-level evidence**, across time, alternatives, decisions, requirements, runtime behavior, ownership, and verification.

That is the actual “hyperdimensional” part.

Not just:

```text
code → AST → semantic slices → projections
```

But:

```text
loose app idea
  → requirements
    → capabilities
      → use cases
        → quality attributes
          → domain model
            → architectural decisions
              → bounded contexts
                → services / apps / repos
                  → APIs / contracts / data models
                    → modules
                      → functions
                        → clauses
                          → expressions / lines / tokens
                            → tests
                              → runtime evidence
                                → historical evolution
```

And all of that is navigable in multiple directions.

---

# What “Hyperdimensional Architecture” Should Mean Here

I would define it like this:

> **Hyperdimensional architecture is a multi-representational trace graph where every software artifact can be located across independent dimensions such as abstraction level, concern, formality, certainty, time, ownership, runtime behavior, quality attribute, requirement lineage, implementation evidence, and verification status.**

It is not necessarily “hyperdimensional” in the mathematical/vector sense, although vectors can be one storage layer. It is hyperdimensional in the **systems modeling** sense:

```text
one thing can exist in many representational spaces at once
```

Example:

```text
"Users can reset their password securely"
```

That one vague requirement participates in many dimensions:

| Dimension                  | Value                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Abstraction                | requirement                                                 |
| Concern                    | authentication, security, email delivery                    |
| Formality                  | informal prose                                              |
| Quality attribute          | security, reliability, usability                            |
| Domain concept             | account recovery                                            |
| Decision lineage           | token expiration, email verification, audit logging         |
| Architecture realization   | Accounts context, Mailer, Token module, Repo, Endpoint      |
| Implementation realization | controller action, context function, schema, tests          |
| Verification               | unit tests, integration tests, runtime telemetry            |
| Historical state           | proposed, accepted, implemented, changed, deprecated        |
| Confidence                 | inferred, user-confirmed, code-confirmed, runtime-confirmed |

That is the hyperdimensional object.

---

# The Key Correction

Architecture is not just a level between repo and module.

It is the **transformation fabric** between intent and implementation.

So instead of thinking:

```text
requirements
architecture
code
```

you want:

```text
Requirement Space
  ↕
Decision Space
  ↕
Architecture Space
  ↕
Contract Space
  ↕
Implementation Space
  ↕
Verification Space
  ↕
Runtime Space
  ↕
Historical Space
```

Each “space” has its own artifacts, graph edges, facts, dimensions, projections, and materialized views.

The UI then lets a person navigate the **same system** through any representational layer.

---

# Core Concept: The Design-to-Code Hypergraph

The core object should become:

> **A versioned design-to-code hypergraph.**

Not merely an architecture graph.

Not merely a semantic code graph.

A **design-to-code hypergraph** where nodes can be requirements, decisions, components, services, APIs, data models, tests, runtime traces, modules, functions, source spans, comments, or even partial lines of code.

The most important primitive becomes:

```text
artifact + representation + dimension coordinates + provenance + evidence + lineage
```

Or more compactly:

```text
Represented Thing
  + where it came from
  + what it means
  + what it constrains
  + what implements it
  + what verifies it
  + how it changed
```

---

# 1. Separate Layers from Dimensions

This is probably the most important conceptual distinction.

## Layers

Layers are representational levels:

```text
idea
requirement
capability
scenario
constraint
decision
architecture
contract
component
implementation
test
runtime observation
```

## Dimensions

Dimensions are independent axes that apply across layers:

```text
security
performance
ownership
risk
certainty
time
domain
data flow
failure behavior
concurrency
user value
change impact
```

A requirement, architecture decision, function, or line of code can all participate in the same dimension.

For example:

```text
security dimension
  requirement: "password reset must be secure"
  decision: "tokens expire after 15 minutes"
  architecture: "token generation lives in Accounts.Security"
  code: "Phoenix.Token.verify(..., max_age: 900)"
  test: "expired token is rejected"
  runtime: "password reset failure telemetry"
```

That is the real “hyperdimensional” bridge.

---

# 2. The Representation Ladder

You need a canonical ladder that everything can map onto.

```text
L0  Raw informal material
    Markdown docs, voice notes, product notes, meeting notes, sketches

L1  Extracted claims
    "Users need password reset", "Billing must support refunds"

L2  Requirements
    Functional requirements, non-functional requirements, constraints

L3  Capabilities
    Account recovery, payment capture, invoice generation, notification delivery

L4  Scenarios
    User stories, use cases, flows, acceptance paths

L5  Domain model
    Concepts, entities, invariants, terms, business rules

L6  Architectural decisions
    ADRs, tradeoffs, selected patterns, rejected alternatives

L7  Architecture model
    Bounded contexts, services, OTP apps, repos, supervision, data stores

L8  Contracts
    APIs, events, messages, schemas, behaviours, config keys, telemetry

L9  Implementation units
    modules, functions, clauses, macros, configs, migrations

L10 Code spans
    expressions, lines, partial lines, AST nodes, tokens

L11 Verification
    tests, assertions, properties, fixtures, mocks, contract tests

L12 Runtime evidence
    traces, logs, telemetry, metrics, observed edges

L13 Historical lineage
    changes, supersessions, migrations, refactors, design drift
```

The UI’s “zoom” knob is not merely:

```text
module → function → clause
```

It becomes:

```text
requirement → decision → architecture → API → module → function → line → test → runtime trace
```

And it can move sideways at each level.

---

# 3. The Missing Schema Primitive: `knowledge_artifact`

Everything starts with artifacts.

```sql
CREATE TABLE knowledge_artifact (
  artifact_id        uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  artifact_kind      text NOT NULL,
  -- raw_doc, doc_section, requirement, capability, scenario,
  -- quality_attribute, domain_concept, invariant, decision,
  -- rejected_alternative, architecture_component, api_contract,
  -- data_contract, config_contract, code_anchor, test_anchor,
  -- runtime_observation, user_annotation

  title              text,
  body_text          text,
  body_json          jsonb NOT NULL DEFAULT '{}',

  source_kind        text NOT NULL,
  -- markdown, issue, adr, code, ast, test, runtime_trace,
  -- imported_catalog, user_input, llm_generated

  source_uri         text,
  source_hash        text,

  lifecycle_state    text NOT NULL DEFAULT 'draft',
  -- draft, proposed, accepted, implemented, verified,
  -- contradicted, deprecated, superseded, unknown

  confidence         numeric NOT NULL DEFAULT 0.5,
  salience_score     numeric NOT NULL DEFAULT 0.5,

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

This table lets the system represent both:

```text
"Users should be able to reset passwords"
```

and:

```text
line 51 in lib/accounts/token.ex
```

as first-class things.

Not because they are the same kind of thing, but because they need to participate in the same trace fabric.

---

# 4. Document Spans for Markdown / Informal Material

Loose design docs should not just be blobs. They need addressable spans.

```sql
CREATE TABLE source_document (
  document_id        uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  document_kind      text NOT NULL,
  -- product_brief, requirements_doc, adr, design_doc,
  -- meeting_notes, issue, markdown_spec, generated_summary

  title              text NOT NULL,
  path_or_uri        text,
  content_format     text NOT NULL,
  -- markdown, plain_text, html, issue_body, transcript

  content_text       text NOT NULL,
  content_hash       text NOT NULL,

  metadata           jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE document_span (
  span_id            uuid PRIMARY KEY,

  document_id        uuid NOT NULL REFERENCES source_document(document_id),

  start_offset       integer NOT NULL,
  end_offset         integer NOT NULL,

  heading_path       text[],
  section_title      text,

  extracted_text     text NOT NULL,
  text_hash          text NOT NULL,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

Now a requirement can be traced back to the exact sentence or section that produced it.

---

# 5. Representation Levels

The ladder itself should be data, not hard-coded.

```sql
CREATE TABLE representation_level (
  representation_level_id uuid PRIMARY KEY,

  level_key          text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  level_order        integer NOT NULL,

  level_family       text NOT NULL,
  -- informal, requirement, domain, decision, architecture,
  -- contract, implementation, verification, runtime, historical

  description        text,

  schema_json        jsonb NOT NULL DEFAULT '{}'
);
```

Example levels:

```text
raw_note
extracted_claim
functional_requirement
quality_attribute
capability
user_scenario
domain_concept
business_invariant
architecture_decision
bounded_context
component
api_contract
data_contract
module
function
source_span
test_case
runtime_trace
change_event
```

Then every artifact can be assigned to one or more levels:

```sql
CREATE TABLE artifact_representation (
  artifact_representation_id uuid PRIMARY KEY,

  artifact_id         uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  representation_level_id uuid NOT NULL REFERENCES representation_level(representation_level_id),

  representation_role text NOT NULL,
  -- primary, supporting, derived, inferred, conflicting

  confidence          numeric NOT NULL DEFAULT 1.0,

  UNIQUE (artifact_id, representation_level_id, representation_role)
);
```

---

# 6. Hyperdimensions

This is where “hyperdimensional” becomes formal.

A dimension is not a UI knob yet. A dimension is a way to place artifacts into a meaningful coordinate system.

```sql
CREATE TABLE hyperdimension (
  hyperdimension_id  uuid PRIMARY KEY,

  dimension_key      text NOT NULL UNIQUE,
  display_name       text NOT NULL,

  dimension_family   text NOT NULL,
  -- abstraction, concern, quality, lifecycle, certainty,
  -- ownership, time, runtime, architecture, data, risk,
  -- verification, implementation, user_value

  value_kind         text NOT NULL,
  -- categorical, ordinal, numeric, boolean, temporal,
  -- vector, graph_path, freeform, composite

  description        text,

  schema_json        jsonb NOT NULL DEFAULT '{}'
);
```

Dimension values:

```sql
CREATE TABLE hyperdimension_value (
  value_id           uuid PRIMARY KEY,

  hyperdimension_id  uuid NOT NULL REFERENCES hyperdimension(hyperdimension_id),

  value_key          text NOT NULL,
  display_name       text NOT NULL,

  ordinal            integer,
  numeric_value      numeric,

  metadata           jsonb NOT NULL DEFAULT '{}',

  UNIQUE (hyperdimension_id, value_key)
);
```

Artifact coordinates:

```sql
CREATE TABLE artifact_coordinate (
  artifact_coordinate_id uuid PRIMARY KEY,

  artifact_id         uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  hyperdimension_id   uuid NOT NULL REFERENCES hyperdimension(hyperdimension_id),

  value_id            uuid REFERENCES hyperdimension_value(value_id),
  numeric_value       numeric,
  text_value          text,
  json_value          jsonb,

  source_artifact_id  uuid REFERENCES knowledge_artifact(artifact_id),

  confidence          numeric NOT NULL DEFAULT 1.0,
  weight              numeric NOT NULL DEFAULT 1.0,

  UNIQUE (
    artifact_id,
    hyperdimension_id,
    value_id,
    source_artifact_id
  )
);
```

Example dimensions:

| Dimension           | Example values                                                     |
| ------------------- | ------------------------------------------------------------------ |
| `abstraction_level` | raw idea, requirement, decision, component, module, function, line |
| `formality`         | informal, structured, contract, executable, observed               |
| `concern`           | auth, billing, persistence, email, telemetry, security             |
| `quality_attribute` | performance, reliability, security, usability, scalability         |
| `certainty`         | guessed, inferred, accepted, implemented, tested, observed         |
| `lifecycle`         | proposed, accepted, implemented, verified, deprecated              |
| `trace_direction`   | upstream, downstream, lateral, diagonal                            |
| `domain_area`       | identity, money, notification, platform                            |
| `runtime_layer`     | controller, context, worker, supervisor, repo, external service    |
| `evidence_strength` | none, weak, medium, strong, proven                                 |
| `historical_epoch`  | initial design, refactor, migration, post-incident                 |

This is the part the existing design does not yet fully capture.

---

# 7. The Critical Edge Type: Design Derivation

Normal graph edges like `calls`, `depends_on`, and `contains` are not enough.

You need edges that describe **engineering transformation**.

```sql
CREATE TABLE derivation_edge (
  derivation_edge_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  from_artifact_id   uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  to_artifact_id     uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  derivation_kind    text NOT NULL,
  -- extracts, refines, decomposes, formalizes, constrains,
  -- decides, rejects, allocates_to, realizes, implements,
  -- verifies, tests, observes, contradicts, supersedes,
  -- explains, motivates, depends_on, affects, traces_to

  directionality     text NOT NULL DEFAULT 'directed',

  rationale_text     text,
  rationale_json     jsonb NOT NULL DEFAULT '{}',

  confidence         numeric NOT NULL DEFAULT 0.5,
  evidence_strength  numeric NOT NULL DEFAULT 0.5,

  created_by_kind    text NOT NULL,
  -- user, llm, static_analyzer, runtime_observer, imported_tool

  created_at         timestamptz NOT NULL DEFAULT now(),

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

This is where the actual bridge happens.

Examples:

```text
doc sentence
  extracts → requirement

requirement
  refines → capability

capability
  decomposes → user scenario

scenario
  constrains → quality attribute

quality attribute
  motivates → architecture decision

architecture decision
  allocates_to → bounded context

bounded context
  realizes → OTP app

API contract
  implemented_by → function

function
  verified_by → test

runtime trace
  observes → architecture edge

new requirement
  supersedes → old requirement
```

This is the missing mechanism.

---

# 8. Architecture Is a Set of Commitments

A major upgrade is to treat architecture as **commitments**, not just components.

A component says:

```text
There is an Accounts service.
```

A commitment says:

```text
Password reset tokens must be generated by Accounts, expire within 15 minutes, never be logged, and be verified before password mutation.
```

That commitment then maps down into code and tests.

Schema:

```sql
CREATE TABLE architecture_commitment (
  commitment_id      uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  commitment_kind    text NOT NULL,
  -- responsibility, constraint, invariant, boundary_rule,
  -- quality_attribute, interface_guarantee, data_ownership,
  -- failure_policy, security_policy, deployment_policy

  title              text NOT NULL,
  statement_text     text NOT NULL,
  statement_json     jsonb NOT NULL DEFAULT '{}',

  owning_artifact_id uuid REFERENCES knowledge_artifact(artifact_id),

  lifecycle_state    text NOT NULL DEFAULT 'proposed',
  -- proposed, accepted, implemented, verified, violated,
  -- deprecated, superseded

  confidence         numeric NOT NULL DEFAULT 0.5,
  criticality_score  numeric NOT NULL DEFAULT 0.5,

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

Then link commitments to everything else:

```sql
CREATE TABLE commitment_binding (
  commitment_binding_id uuid PRIMARY KEY,

  commitment_id      uuid NOT NULL REFERENCES architecture_commitment(commitment_id),
  artifact_id        uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  binding_kind       text NOT NULL,
  -- motivated_by, constrains, realized_by, implemented_by,
  -- verified_by, violated_by, documented_by, superseded_by

  confidence         numeric NOT NULL DEFAULT 1.0,
  evidence_json      jsonb NOT NULL DEFAULT '{}',

  UNIQUE (commitment_id, artifact_id, binding_kind)
);
```

This lets the UI answer:

```text
Show me all code that realizes this requirement.
Show me all requirements realized by this function.
Show me decisions behind this module.
Show me architecture commitments with no tests.
Show me code whose original requirement is now deprecated.
Show me requirements contradicted by runtime behavior.
```

---

# 9. Design Decisions and Alternatives

To bridge loose requirements to code, you need to model the decision process, not only the chosen result.

```sql
CREATE TABLE design_decision (
  decision_id        uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  decision_key       text,
  title              text NOT NULL,

  decision_kind      text NOT NULL,
  -- architecture, data_model, runtime, dependency,
  -- security, performance, UX, API, deployment

  status             text NOT NULL,
  -- proposed, accepted, rejected, superseded, reopened

  decision_text      text NOT NULL,
  rationale_text     text,

  selected_option_id uuid,

  source_artifact_id uuid REFERENCES knowledge_artifact(artifact_id),

  decided_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE design_option (
  option_id          uuid PRIMARY KEY,

  decision_id        uuid NOT NULL REFERENCES design_decision(decision_id),

  option_label       text NOT NULL,
  option_text        text NOT NULL,

  status             text NOT NULL,
  -- selected, rejected, deferred, unknown

  pros_json          jsonb NOT NULL DEFAULT '[]',
  cons_json          jsonb NOT NULL DEFAULT '[]',

  tradeoff_json      jsonb NOT NULL DEFAULT '{}',

  confidence         numeric NOT NULL DEFAULT 0.5
);
```

This is important because architecture is often defined by what was **not** chosen.

The system should let you navigate:

```text
requirement
  → decision
    → selected option
    → rejected alternatives
    → implementation
```

That is an architectural dimension too.

---

# 10. Requirements as Structured but Not Over-Formalized

You need a middle representation between loose prose and rigid spec.

```sql
CREATE TABLE requirement_unit (
  requirement_id     uuid PRIMARY KEY,

  artifact_id        uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  requirement_kind   text NOT NULL,
  -- functional, nonfunctional, constraint, compliance,
  -- user_story, acceptance_criterion, business_rule

  requirement_text   text NOT NULL,

  subject            text,
  action             text,
  object             text,
  condition_text     text,
  expected_result    text,

  priority           text,
  -- must, should, could, won't, unknown

  lifecycle_state    text NOT NULL DEFAULT 'draft',

  ambiguity_score    numeric NOT NULL DEFAULT 0.5,
  completeness_score numeric NOT NULL DEFAULT 0.5,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

An LLM can extract a rough requirement from a design note, but the system should preserve the fact that it was inferred.

---

# 11. Capabilities and Scenarios

Capabilities are often the best bridge between requirements and architecture.

```sql
CREATE TABLE capability (
  capability_id      uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  capability_key     text NOT NULL,
  display_name       text NOT NULL,

  description        text,

  domain_area        text,
  business_value     text,

  lifecycle_state    text NOT NULL DEFAULT 'proposed',
  confidence         numeric NOT NULL DEFAULT 0.5,

  UNIQUE (workspace_id, capability_key)
);
```

```sql
CREATE TABLE scenario (
  scenario_id        uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  scenario_kind      text NOT NULL,
  -- user_story, use_case, acceptance_path, failure_path,
  -- abuse_case, operational_scenario

  title              text NOT NULL,
  actor              text,
  trigger_text       text,
  goal_text          text,

  steps_json         jsonb NOT NULL DEFAULT '[]',
  expected_outcome   text,

  lifecycle_state    text NOT NULL DEFAULT 'proposed',
  confidence         numeric NOT NULL DEFAULT 0.5
);
```

Then:

```text
requirement → capability → scenario → architecture commitment → code
```

becomes precomputable.

---

# 12. Contracts as the Bridge to Code

The jump from architecture to code should usually pass through contracts.

Contracts are where architecture becomes implementable.

```sql
CREATE TABLE software_contract (
  contract_id        uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  contract_kind      text NOT NULL,
  -- api_endpoint, behaviour, callback, event_schema,
  -- message_contract, data_schema, config_key,
  -- telemetry_event, public_module, function_contract,
  -- test_contract

  title              text NOT NULL,

  contract_text      text,
  contract_json      jsonb NOT NULL DEFAULT '{}',

  owning_artifact_id uuid REFERENCES knowledge_artifact(artifact_id),

  lifecycle_state    text NOT NULL DEFAULT 'proposed',
  stability          text NOT NULL DEFAULT 'unknown',
  -- experimental, internal, stable, deprecated, removed, unknown

  confidence         numeric NOT NULL DEFAULT 0.5
);
```

Contract bindings:

```sql
CREATE TABLE contract_binding (
  contract_binding_id uuid PRIMARY KEY,

  contract_id        uuid NOT NULL REFERENCES software_contract(contract_id),
  artifact_id        uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  binding_kind       text NOT NULL,
  -- specified_by, implemented_by, consumed_by, verified_by,
  -- violated_by, documented_by, generated_from

  confidence         numeric NOT NULL DEFAULT 1.0,
  evidence_json      jsonb NOT NULL DEFAULT '{}',

  UNIQUE (contract_id, artifact_id, binding_kind)
);
```

Examples:

```text
Requirement:
  "Users can reset passwords securely"

Contract:
  POST /password-reset/request
  POST /password-reset/confirm
  PasswordResetToken format
  telemetry event [:accounts, :password_reset, :request]
  token expiration invariant

Implementation:
  Accounts.request_password_reset/1
  Accounts.reset_password/2
  Token.verify_password_reset_token/1
```

---

# 13. Historical Markers and Context Graph

You specifically mentioned historical markers: where things came from, how downstream things changed, and a more sophisticated context graph.

That requires two pieces:

1. **Lineage**
2. **Context bundles**

## Lineage

```sql
CREATE TABLE artifact_lineage (
  lineage_id         uuid PRIMARY KEY,

  from_artifact_id   uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  to_artifact_id     uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  lineage_kind       text NOT NULL,
  -- same_thing_next_version, renamed, split, merged,
  -- refactored, superseded, extracted, moved,
  -- generalized, specialized

  from_snapshot_id   uuid,
  to_snapshot_id     uuid,

  match_score        numeric NOT NULL DEFAULT 1.0,

  evidence_json      jsonb NOT NULL DEFAULT '{}',

  created_at         timestamptz NOT NULL DEFAULT now()
);
```

## Context bundles

A context bundle is the local universe needed to understand an artifact.

```sql
CREATE TABLE context_bundle (
  context_bundle_id  uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,
  snapshot_id        uuid,

  root_artifact_id   uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  bundle_kind        text NOT NULL,
  -- requirement_context, decision_context, implementation_context,
  -- architecture_context, change_context, debug_context,
  -- onboarding_context

  title              text,

  context_policy_json jsonb NOT NULL DEFAULT '{}',
  -- how far upstream/downstream, which dimensions, which evidence,
  -- which confidence thresholds, which time window

  generated_at       timestamptz NOT NULL DEFAULT now(),

  bundle_hash        text NOT NULL
);
```

```sql
CREATE TABLE context_bundle_member (
  context_bundle_member_id uuid PRIMARY KEY,

  context_bundle_id  uuid NOT NULL REFERENCES context_bundle(context_bundle_id),
  artifact_id        uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  member_role        text NOT NULL,
  -- root, upstream_requirement, downstream_code,
  -- decision, evidence, test, runtime_observation,
  -- conflict, missing_link, historical_origin

  distance           integer,
  salience_score     numeric NOT NULL DEFAULT 0.5,

  UNIQUE (context_bundle_id, artifact_id, member_role)
);
```

This lets the UI show:

```text
Why does this code exist?
What requirement led to it?
What decisions shaped it?
What tests verify it?
What changed since the original design?
What is missing?
```

---

# 14. Projection Becomes a Slice Through the Design-to-Code Hypergraph

The existing projection model should be generalized.

A projection is not just:

```text
entity + config
```

It is:

```text
root artifact
+ selected representation level
+ selected dimensions
+ trace direction
+ time horizon
+ confidence policy
+ evidence policy
+ rendering target
```

Schema:

```sql
CREATE TABLE hyper_projection_spec (
  projection_spec_id uuid PRIMARY KEY,

  workspace_id       uuid NOT NULL,

  spec_key           text NOT NULL,
  display_name       text NOT NULL,

  root_selector_json jsonb NOT NULL DEFAULT '{}',

  representation_levels_json jsonb NOT NULL DEFAULT '[]',
  dimensions_json    jsonb NOT NULL DEFAULT '{}',

  trace_policy_json  jsonb NOT NULL DEFAULT '{}',
  -- upstream depth, downstream depth, lateral depth,
  -- include contradictions, include missing links, include tests

  evidence_policy_json jsonb NOT NULL DEFAULT '{}',
  time_policy_json     jsonb NOT NULL DEFAULT '{}',

  render_policy_json   jsonb NOT NULL DEFAULT '{}',

  UNIQUE (workspace_id, spec_key)
);
```

Materialized projection packet:

```sql
CREATE TABLE hyper_projection_packet (
  projection_packet_id uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,
  projection_spec_id uuid NOT NULL REFERENCES hyper_projection_spec(projection_spec_id),

  root_artifact_id   uuid REFERENCES knowledge_artifact(artifact_id),

  axis_state_hash    text NOT NULL,
  axis_state_json    jsonb NOT NULL,

  rendered_json      jsonb NOT NULL,

  visible_artifact_ids uuid[] NOT NULL DEFAULT '{}',
  visible_edge_ids     uuid[] NOT NULL DEFAULT '{}',

  missing_link_count integer NOT NULL DEFAULT 0,
  contradiction_count integer NOT NULL DEFAULT 0,

  packet_hash        text NOT NULL,

  generated_at       timestamptz NOT NULL DEFAULT now(),

  UNIQUE (
    snapshot_id,
    projection_spec_id,
    root_artifact_id,
    axis_state_hash
  )
);
```

Now a knob can shift:

```text
Representation level:
  requirement → decision → contract → implementation

Concern:
  security → performance → reliability

Trace direction:
  upstream → downstream → lateral → historical

Certainty:
  inferred → accepted → implemented → verified → observed

Time:
  original design → current code → diff → future proposal
```

This is much richer than codebase navigation.

---

# 15. Example: One Requirement Across the Stack

Take this vague input:

```text
Users should be able to reset their password if they forget it.
It should be secure and not annoying.
```

The system generates and links:

```text
Raw doc span
  ↓ extracts
Requirement:
  User can request password reset

Requirement:
  Password reset must be secure

Capability:
  Account Recovery

Scenario:
  Request reset email
  Confirm reset token
  Set new password

Quality attributes:
  security
  usability
  reliability

Domain concepts:
  user account
  reset token
  token expiration
  identity proof

Architecture commitments:
  token must expire
  token must be single-use or invalidated by password change
  reset request must not reveal whether email exists
  reset email must be asynchronous
  reset attempt must be audited

Decisions:
  use signed token
  use Oban job for email delivery
  do not store raw token
  emit telemetry event

Architecture:
  Accounts context
  Mailer service
  Token module
  Repo
  endpoint/controller
  worker queue

Contracts:
  request_password_reset(email)
  reset_password(token, new_password)
  password_reset_requested event
  password_reset_completed event

Implementation:
  Accounts.request_password_reset/1
  Accounts.reset_password/2
  Accounts.Token.sign/1
  Accounts.Token.verify/1
  Mailer.PasswordResetEmail
  ResetPasswordController

Code spans:
  exact function clauses
  token max_age expression
  branch that handles expired token
  email job enqueue line

Verification:
  expired token test
  non-enumeration test
  email job test
  successful reset test

Runtime:
  telemetry events
  job enqueue observations
  failure rates

History:
  original token expiry was 24h
  later changed to 15m
  decision superseded after security review
```

That is the hyperdimensional architecture.

The user can stand at any point and ask:

```text
Why does this line exist?
```

And the system can travel upward:

```text
line
  → function
  → contract
  → architecture commitment
  → decision
  → requirement
  → original doc span
```

Or downward:

```text
requirement
  → decisions
  → contracts
  → implementation
  → tests
  → runtime evidence
```

Or diagonally:

```text
security requirement
  → all commitments
  → all code spans
  → all unverified areas
  → all historical changes
```

---

# 16. Multiple Storage Systems, One Logical Model

You are right that this should not be forced into one database style.

The logical model should be unified, but the storage should be polyglot.

| Store                                  | Role                                                           |
| -------------------------------------- | -------------------------------------------------------------- |
| Markdown / flat files                  | Human-authored docs, ADRs, generated design narratives         |
| Relational DB                          | Canonical artifacts, edges, snapshots, coordinates, provenance |
| Graph store or relational graph tables | Fast traversal across trace paths                              |
| Vector store                           | Loose matching between informal docs, code, concepts, names    |
| Columnar store                         | Metrics, time-series, architectural health, dependency drift   |
| Object/blob store                      | Raw source, projection packets, rendered contexts              |
| AST index                              | Code-level source spans, syntax tree, symbol resolution        |
| Search index                           | Full-text search over docs, facts, summaries, code comments    |

The product should expose one logical abstraction:

```text
Artifact
Coordinate
Edge
Evidence
Projection
Lineage
```

But internally it can use whatever storage structure is appropriate.

---

# 17. The Most Important New Table: `trace_path`

You need precomputed trace paths.

```sql
CREATE TABLE trace_path (
  trace_path_id      uuid PRIMARY KEY,

  snapshot_id        uuid NOT NULL,

  path_kind          text NOT NULL,
  -- requirement_to_code, code_to_requirement,
  -- decision_to_implementation, architecture_to_tests,
  -- requirement_to_runtime, change_impact,
  -- historical_origin, contradiction_path

  start_artifact_id  uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  end_artifact_id    uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  start_level_key    text,
  end_level_key      text,

  path_length        integer NOT NULL,

  confidence         numeric NOT NULL DEFAULT 0.5,
  completeness_score numeric NOT NULL DEFAULT 0.5,
  salience_score     numeric NOT NULL DEFAULT 0.5,

  summary_text       text,
  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

```sql
CREATE TABLE trace_path_step (
  trace_path_step_id uuid PRIMARY KEY,

  trace_path_id      uuid NOT NULL REFERENCES trace_path(trace_path_id),

  step_index         integer NOT NULL,

  artifact_id        uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  derivation_edge_id uuid REFERENCES derivation_edge(derivation_edge_id),

  step_role          text,
  -- source_requirement, decision, architecture_commitment,
  -- contract, implementation, test, runtime_evidence

  render_hint        text,

  UNIQUE (trace_path_id, step_index)
);
```

This is how the UI becomes fast.

A knob does not calculate:

```text
How does this requirement map to code?
```

It loads:

```text
trace_path where path_kind = requirement_to_code
```

---

# 18. What the UI Is Actually Navigating

The UI is not navigating code.

It is navigating **representational continuity**.

For every transition, the system needs to preserve identity:

```text
same requirement, different formality
same concern, different layer
same decision, downstream implementation
same component, runtime evidence
same code, upstream rationale
same artifact, historical version
```

So each projection should include continuity links:

```sql
CREATE TABLE projection_continuity (
  continuity_id      uuid PRIMARY KEY,

  from_projection_packet_id uuid NOT NULL REFERENCES hyper_projection_packet(projection_packet_id),
  to_projection_packet_id   uuid NOT NULL REFERENCES hyper_projection_packet(projection_packet_id),

  from_artifact_id   uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),
  to_artifact_id     uuid NOT NULL REFERENCES knowledge_artifact(artifact_id),

  continuity_kind    text NOT NULL,
  -- same_artifact, refined_form, implementation_of,
  -- verified_by, historical_successor, same_concern,
  -- same_requirement_different_level

  continuity_score   numeric NOT NULL DEFAULT 1.0,

  metadata           jsonb NOT NULL DEFAULT '{}'
);
```

This makes the knob interface cognitively stable.

Turning a knob from:

```text
requirement view
```

to:

```text
implementation view
```

does not create a random new screen. It transforms a known object into its linked representation.

---

# 19. New Projection Types

The existing system had code and architecture projections. This system needs broader projection types.

## A. Requirement Realization Projection

```text
Root: requirement
Shows:
  original wording
  extracted structured requirement
  ambiguity
  decisions
  architecture commitments
  implementation artifacts
  tests
  missing links
```

## B. Decision Impact Projection

```text
Root: architecture decision
Shows:
  rationale
  selected option
  rejected options
  affected requirements
  affected components
  affected code
  tests that prove it
  historical changes
```

## C. Code Rationale Projection

```text
Root: line/function/module
Shows:
  what this code does
  what contract it implements
  what decision caused it
  what requirement it realizes
  whether it is still justified
```

## D. Change Impact Projection

```text
Root: proposed requirement change
Shows:
  affected capabilities
  decisions that must be revisited
  contracts that change
  code impacted
  tests impacted
  runtime risks
```

## E. Architecture Drift Projection

```text
Root: current architecture commitment
Shows:
  intended architecture
  actual code
  runtime observations
  violations
  historical drift
```

## F. Completeness Projection

```text
Root: capability or requirement set
Shows:
  implemented
  partially implemented
  unimplemented
  untested
  contradicted
  obsolete
```

These are the novel architecture representations.

---

# 20. The Structured Engineering Process

The tool should not only understand an existing codebase. It should support a process:

## Stage 1: Capture

Input:

```text
loose product description
Markdown notes
rough requirements
architecture sketches
tickets
existing docs
```

Output:

```text
raw artifacts
document spans
extracted claims
ambiguities
open questions
```

## Stage 2: Normalize

Output:

```text
requirements
capabilities
scenarios
quality attributes
domain concepts
constraints
```

## Stage 3: Decide

Output:

```text
architecture decisions
selected options
rejected alternatives
rationales
tradeoffs
commitments
```

## Stage 4: Architect

Output:

```text
bounded contexts
services
OTP apps
data stores
APIs
events
contracts
supervision topology
config surfaces
```

## Stage 5: Implement

Output:

```text
modules
functions
clauses
code spans
migrations
configs
tests
```

## Stage 6: Verify

Output:

```text
test mappings
contract verification
runtime observations
coverage of requirements
violations
missing evidence
```

## Stage 7: Evolve

Output:

```text
lineage
superseded requirements
changed decisions
architecture drift
impact projections
historical markers
```

The system becomes a **software engineering memory engine**.

---

# 21. Why This Complements the Existing Design

The existing design gives you:

```text
AST-grounded understanding
architecture graph over code
materialized projections
fast UI navigation
```

The missing hyperdimensional layer gives you:

```text
intent-grounded understanding
requirements-to-code traceability
decision provenance
architecture commitments
contract realization
verification linkage
historical lineage
change impact
```

So the corrected full system is:

```text
Design-to-Code Hypergraph
  ├── Informal artifact layer
  ├── Requirement layer
  ├── Capability/scenario layer
  ├── Domain/invariant layer
  ├── Decision/tradeoff layer
  ├── Architecture commitment layer
  ├── Contract/interface layer
  ├── Runtime architecture layer
  ├── Implementation/code layer
  ├── Verification/test layer
  ├── Runtime observation layer
  └── Historical lineage layer

Each layer:
  ├── has artifacts
  ├── has dimensions
  ├── has coordinates
  ├── has typed edges
  ├── has evidence
  ├── has projections
  └── has precomputed transitions
```

---

# 22. The Better Name

I would avoid calling the final system merely a “code understanding engine.”

A better name would be:

```text
Design-to-Code Intelligence Graph
```

or:

```text
Software Architecture Trace Manifold
```

or:

```text
Intent-to-Implementation Hypergraph
```

The third one is probably the most accurate.

## Final definition

> The system is an **Intent-to-Implementation Hypergraph**: a versioned, evidence-backed, multidimensional representation of how informal goals become requirements, how requirements become decisions, how decisions become architecture, how architecture becomes contracts, how contracts become code, how code is verified, and how all of it changes over time.

That is the missing gap.
