# Response 4 — Query Language for the Operating Intelligence Kernel

The next missing piece is the **Query Language**.

So far, the system has:

```text
Representation Substrate:
  ASTs, entities, facts, dimensions, architecture layers, projections.

Belief Calculus:
  What is currently believed, stale, verified, drifted, contested, or refuted.

Commitment DSL:
  What architecture says should be true.

Action Model:
  What the system should do when beliefs and commitments imply action.
```

But users also need to ask direct questions:

```text
Why does this function exist?

What requirement does this line implement?

What does this PR affect?

Where is the architecture drifting from implementation?

Which runtime paths contradict our design?

What must change if this requirement changes?

Which modules are suspiciously outside their bounded context?

Show me all accepted commitments that lack tests.

Find code whose upstream rationale is stale.

Explain the smallest truthful view of this subsystem.
```

The existing substrate is already designed around pre-materialized projections and indexed navigation, where the UI reads precomputed representations rather than doing inference live.  The query language should sit above that substrate and compile human intent into graph traversal, belief evaluation, causal impact analysis, projection retrieval, and action recommendations.

---

# 1. Core Claim

The system needs a query language that is **not just SQL**, **not just graph traversal**, and **not just natural-language search**.

It needs a declarative language for asking questions over:

```text
requirements
decisions
commitments
architecture
contracts
code
tests
runtime observations
belief states
lineage
actions
projections
```

The key idea:

> A query should ask over the **engineering meaning** of the system, not merely over tables.

So instead of:

```sql
SELECT * FROM entity_relations WHERE kind = 'calls';
```

the user should be able to ask:

```text
Show me where Billing violates Accounts data ownership.
```

And the system should compile that into:

```text
bounded context selectors
data ownership commitments
data access edges
current belief states
exception checks
source evidence
projection packets
PR/action context
```

---

# 2. The Query Language Has Three Front Doors

The system should support three query surfaces.

## 1. Natural language

For humans:

```text
Why does Accounts.Token.verify_reset_token/1 exist?
```

## 2. Structured query DSL

For power users, saved views, CI, and architecture rules:

```yaml
query: rationale
root:
  function: Accounts.Token.verify_reset_token/1
trace:
  direction: upstream
  through:
    - contract
    - commitment
    - decision
    - requirement
include:
  - evidence
  - belief_state
  - stale_links
```

## 3. Programmatic API

For tools:

```json
{
  "query_kind": "rationale",
  "root": {
    "kind": "function",
    "name": "Accounts.Token.verify_reset_token/1"
  },
  "trace": {
    "direction": "upstream",
    "levels": ["contract", "commitment", "decision", "requirement"]
  },
  "include": ["evidence", "belief_state", "actions"]
}
```

These should compile into the same internal query plan.

---

# 3. Query Language Name

Call it something like:

```text
ArchQL
```

or:

```text
IntentQL
```

I prefer **IntentQL**, because the system is not querying architecture alone. It is querying the relationship between intent and implementation.

Definition:

> **IntentQL** is a declarative query language for asking evidence-backed questions across requirements, decisions, architecture commitments, contracts, code, tests, runtime behavior, belief states, and historical lineage.

---

# 4. Why Existing Query Models Are Not Enough

## SQL is too physical

SQL can query tables, but the user wants engineering semantics:

```text
What must change if this requirement changes?
```

That requires causal reasoning, not a relational selection.

## Graph query alone is too structural

A graph traversal can find connected nodes, but cannot automatically distinguish:

```text
must change
may change
must not change
must revalidate
safe unaffected
```

## Vector search is too fuzzy

Vector search can find semantically similar docs or code, but cannot prove:

```text
this code implements this requirement
```

or:

```text
this PR violates this commitment
```

## Natural language alone is too ambiguous

Natural language is good for expression, but the system needs explainable, reproducible query plans.

So the query system needs all of them:

```text
natural language parsing
structured selectors
graph traversal
belief-state filtering
causal operators
projection retrieval
evidence rendering
vector fallback
```

---

# 5. Query Kinds

IntentQL should have a small set of first-class query kinds.

| Query Kind          | Question It Answers                                      |
| ------------------- | -------------------------------------------------------- |
| `rationale`         | Why does this artifact exist?                            |
| `realization`       | What implements this requirement/decision/commitment?    |
| `impact`            | What changes if this artifact changes?                   |
| `drift`             | Where does reality diverge from intent?                  |
| `coverage`          | What is implemented, tested, untested, or missing?       |
| `violation`         | What breaks an architecture commitment?                  |
| `dependency`        | What depends on this, directly or transitively?          |
| `runtime_alignment` | Does production behavior match design?                   |
| `lineage`           | Where did this come from, and how did it change?         |
| `alternative`       | What are plausible design/implementation options?        |
| `compression`       | What is the smallest faithful explanation for this task? |
| `projection`        | Which materialized view best answers this question?      |
| `action`            | What should be done next?                                |

These are not merely query templates. They imply different planners.

---

# 6. Core Query Objects

IntentQL needs to query over these object types:

```text
artifact
requirement
capability
scenario
decision
option
commitment
contract
architecture_entity
bounded_context
otp_application
repo
module
function
clause
source_span
test
runtime_observation
belief
violation
exception
action
projection
trace_path
```

The query language should treat them all as **addressable engineering artifacts**.

Example root selectors:

```yaml
root:
  requirement: SEC-014
```

```yaml
root:
  function: Accounts.Token.verify_reset_token/1
```

```yaml
root:
  source_span:
    file: lib/accounts/token.ex
    line: 44
```

```yaml
root:
  bounded_context: Billing
```

```yaml
root:
  pr: 1842
```

---

# 7. Selector Syntax

The selector language should be shared with the Commitment DSL.

Examples:

```yaml
select:
  bounded_context: Billing
```

```yaml
select:
  otp_app: ":accounts"
```

```yaml
select:
  module_matches: "^Billing\\."
```

```yaml
select:
  has_belief_state: drifted
```

```yaml
select:
  commitment:
    lifecycle_state: accepted
    quality_attribute: security
```

```yaml
select:
  all:
    - bounded_context: Billing
    - relation:
        kind: data.reads_from
        target:
          data_owner: Accounts
```

```yaml
select:
  any:
    - function: Accounts.reset_password/2
    - source_span:
        file: lib/accounts.ex
        line: 91
```

Selectors should support:

```text
all
any
not
matches
owned_by
changed_in_pr
has_relation
has_dimension
has_belief_state
has_commitment
has_runtime_observation
has_test_coverage
has_lineage
within_snapshot
within_environment
```

This makes saved queries and architecture policies interoperable.

---

# 8. Query Operators

IntentQL needs semantic operators beyond graph traversal.

## Trace operators

```text
upstream_of
downstream_of
lateral_to
diagonal_to
implements
implemented_by
verified_by
motivated_by
constrained_by
supersedes
derived_from
```

## Belief operators

```text
believed
verified
stale
contested
refuted
drifted
unimplemented
unverified
exceptioned
scope_split
```

## Causal operators

```text
must_change
should_change
may_change
must_not_change
must_revalidate
safe_unaffected
unknown_impact
```

## Runtime operators

```text
observed_in
hot_path
rare_path
runtime_contradicts
runtime_confirms
latency_above
error_rate_above
```

## Commitment operators

```text
violates
satisfies
requires
forbids
allowed_by
exceptioned_by
missing_required_evidence
```

## Compression operators

```text
minimize_cognitive_load
preserve_contradictions
preserve_high_risk
omit_low_salience
summarize_by
group_by
```

These operators are the semantic core of the language.

---

# 9. Example Query: “Why Does This Function Exist?”

Natural language:

```text
Why does Accounts.Token.verify_reset_token/1 exist?
```

Structured IntentQL:

```yaml
query: rationale

root:
  function: Accounts.Token.verify_reset_token/1

trace:
  direction: upstream
  through:
    - contract
    - architecture_commitment
    - design_decision
    - requirement
    - source_document

include:
  - belief_state
  - evidence
  - stale_links
  - tests
  - runtime_observations

compression:
  target: engineer
  max_items: 12
  preserve:
    - contradictions
    - high_risk
    - human_verified
```

Expected answer:

```text
Accounts.Token.verify_reset_token/1 exists to implement the password reset token verification contract.

It realizes:
  - SEC-014: reset tokens expire within 15 minutes
  - ADR-008: use signed stateless reset tokens
  - Commitment AUTH-003: password reset tokens must be short-lived and non-logged

Current belief:
  verified

Evidence:
  - code span uses Phoenix.Token.verify/4 with max_age: 900
  - expiry test covers expired token rejection
  - ADR-008 explicitly selected signed tokens

Runtime:
  password reset verification is observed in prod, low frequency

No stale upstream links found.
```

This is the core user experience.

---

# 10. Example Query: “What Requirements Does This PR Affect?”

Natural language:

```text
What requirements does this PR affect?
```

Structured IntentQL:

```yaml
query: impact

root:
  pr: 1842

impact:
  direction: upstream
  classify:
    - must_revalidate
    - may_change
    - must_not_change
    - drifted
  include_requirements: true
  include_decisions: true
  include_commitments: true

filters:
  belief_state:
    exclude:
      - refuted
      - superseded

output:
  group_by: impact_class
  include_evidence: true
  include_actions: true
```

Expected answer:

```text
This PR affects 3 accepted requirements and 1 architecture decision.

must_revalidate:
  SEC-014 — password reset token expiry
    Reason: changed max_age from 900 to 3600
    Action: update tests or restore value

drifted:
  ADR-008 — signed short-lived password reset tokens
    Reason: current code contradicts accepted expiry duration
    Action: require ADR amendment or code revert

must_not_change:
  SEC-015 — password reset must not reveal account existence
    Reason: adjacent behavior not directly changed, but same flow
    Action: run non-enumeration tests
```

This is much more useful than showing changed files.

---

# 11. Example Query: “Show Drift Between Intended and Runtime Architecture”

Natural language:

```text
Show drift between intended and runtime architecture for Billing.
```

IntentQL:

```yaml
query: drift

root:
  bounded_context: Billing

compare:
  intended:
    sources:
      - accepted_commitments
      - accepted_adrs
      - requirements
  actual:
    sources:
      - current_code
      - runtime_observations
      - dependency_graph
      - data_access_edges

drift_types:
  - doc_code_drift
  - runtime_design_mismatch
  - policy_violation
  - unverified_implementation
  - stale_requirement

scope:
  environment: prod
  runtime_window: 14d

output:
  group_by: severity
  include:
    - evidence
    - recommended_actions
    - affected_services
```

Expected answer:

```text
Billing has 4 architecture drift findings.

Critical:
  Billing.Legacy.Export reads Accounts-owned users table.
  Intended architecture: Billing consumes Accounts public API or events.
  Actual behavior: direct data read.
  State: violated, exception expired.

High:
  InvoiceCreated event is documented as emitted after successful invoice creation.
  Runtime traces show no event emission for 8% of successful invoice creation paths.
  State: runtime_design_mismatch.

Medium:
  Billing retry policy says external payment calls use exponential backoff.
  Current code has fixed retry interval.
  State: doc_code_drift.
```

This query combines docs, commitments, code, runtime, and belief state.

---

# 12. Example Query: “What Must Change If This Requirement Changes?”

Natural language:

```text
What must change if reset token expiry changes from 15 minutes to 5 minutes?
```

IntentQL:

```yaml
query: impact

change:
  artifact:
    requirement: SEC-014
  proposed_delta:
    field: token_expiry
    from: "15 minutes"
    to: "5 minutes"

impact:
  classify:
    - must_change
    - should_change
    - may_change
    - must_not_change
    - must_revalidate
    - safe_unaffected

include:
  - implementation
  - tests
  - adrs
  - docs
  - runtime_monitors
  - user_facing_copy
  - policies

output:
  include_reasoning: true
  include_action_plan: true
```

Expected answer:

```text
Changing reset token expiry from 15 minutes to 5 minutes has the following impact.

must_change:
  - Accounts.Token.verify_reset_token/1
    Reason: implements current max_age: 900.
  - password reset expiry tests
    Reason: assert 15-minute behavior.
  - ADR-008
    Reason: selected 15-minute expiry.

should_change:
  - support documentation
    Reason: describes reset link validity.
  - telemetry dashboard label
    Reason: names 15-minute expiry window.

must_not_change:
  - non-enumeration behavior
  - audit logging
  - token secrecy

must_revalidate:
  - resend reset token flow
  - rate limit behavior
  - email delivery latency assumptions
```

This is a causal query, not merely a traversal.

---

# 13. Example Query: “Smallest Truthful Explanation”

Natural language:

```text
Explain Billing’s architecture to me, but only the parts needed to understand why this PR is risky.
```

IntentQL:

```yaml
query: compression

root:
  pr: 1842

intent:
  user_task: understand_pr_risk
  audience: senior_engineer

compression:
  objective: smallest_truthful_explanation
  max_sections: 5
  max_artifacts: 20
  preserve:
    - high_risk
    - active_violations
    - contested_claims
    - human_verified_commitments
    - changed_artifacts
  omit:
    - low_salience_dependencies
    - unchanged_sibling_modules
    - historical_superseded_items

include:
  - architecture_context
  - changed_code
  - violated_commitments
  - likely_actions
```

Expected answer:

```text
This PR is risky because it changes Billing code that sits on a boundary between Billing and Accounts.

The relevant architecture is:

1. Billing owns invoice behavior, but not account identity data.
2. Accounts owns users and password reset identity state.
3. Billing may call Accounts public APIs or consume Accounts events.
4. Billing must not directly read Accounts-owned tables.
5. This PR adds a direct read of accounts.users from Billing.Legacy.Export.

That creates a new boundary violation with migration risk if Accounts changes its schema.
```

This is the semantic compression engine exposed as a query.

---

# 14. Query Output Contracts

Each query kind should have a typed output contract.

## Rationale output

```yaml
root_artifact:
  id: ...
  label: ...

summary: ...

upstream_chain:
  - level: requirement
    artifact: ...
    belief_state: verified
    evidence: [...]

current_state:
  belief_state: verified
  confidence: 0.91

tests:
  - ...

runtime:
  - ...

uncertainty:
  - ...
```

## Impact output

```yaml
root_change: ...

impact_groups:
  must_change: [...]
  should_change: [...]
  may_change: [...]
  must_not_change: [...]
  must_revalidate: [...]
  safe_unaffected: [...]
  unknown: [...]

actions:
  - ...
```

## Drift output

```yaml
drift_findings:
  - title: ...
    drift_type: doc_code_drift
    severity: high
    intended: ...
    actual: ...
    evidence: ...
    recommended_actions: ...
```

Typed outputs matter because the UI can render them reliably.

---

# 15. Query Planner

IntentQL needs a planner.

A natural-language question should compile into:

```text
query intent
root selector
scope
required graph layers
belief filters
causal operators
projection needs
evidence policy
compression policy
action policy
```

## Planning pipeline

```text
1. Parse user utterance.
2. Identify query kind.
3. Resolve root artifacts.
4. Infer scope.
5. Select graph layers.
6. Choose operators.
7. Retrieve candidate artifacts.
8. Evaluate belief states.
9. Expand or prune trace paths.
10. Apply causal classification if needed.
11. Apply compression policy.
12. Attach evidence.
13. Produce typed output.
14. Optionally materialize as projection packet.
```

Example:

```text
Question:
  Why does this line exist?

Plan:
  query_kind = rationale
  root = source_span
  trace = upstream
  graph_layers = code, contract, commitment, decision, requirement
  include = evidence, belief_state
  compression = local, engineer-facing
```

The planner is another operating-intelligence component.

---

# 16. Query Provenance

Every query answer should be reproducible.

The answer should record:

```text
query text
compiled query
root artifacts
snapshot
scope
evidence policy
belief states used
projection packets used
model calls, if any
timestamp
```

This matters because two weeks later a user may ask:

```text
Why did the system say this PR affected SEC-014?
```

The system should be able to show:

```text
Here was the compiled query.
Here was the snapshot.
Here were the trace paths.
Here was the evidence.
Here were the belief states at the time.
```

---

# 17. Query Scope

Every query should require or infer scope.

Scope dimensions:

```text
workspace
snapshot
repo
branch
PR
environment
release
runtime service
feature flag
tenant
time window
confidence threshold
index completeness threshold
```

Example:

```yaml
scope:
  snapshot: production-2026-05-17
  environment: prod
  runtime_window: 14d
  confidence_min: 0.70
  include_inferred: false
```

Without scope, the query may produce misleading answers.

For example:

```text
Does Billing call Accounts?
```

could mean:

```text
in source code?
in prod runtime?
in tests?
in this PR?
directly or transitively?
through public API or internals?
current branch or production release?
```

The query engine should clarify or infer.

---

# 18. Query Confidence and Trust

Each query answer should have an answer-level confidence separate from claim-level confidence.

Answer confidence depends on:

```text
claim confidence
evidence freshness
index completeness
scope clarity
conflict level
runtime coverage
selector ambiguity
query planner confidence
```

Example:

```yaml
answer_confidence:
  score: 0.78
  factors:
    positive:
      - current source index is fresh
      - exact function resolved
      - upstream requirement chain verified
    negative:
      - runtime observations are incomplete
      - one decision link is LLM-inferred
```

This helps avoid false authority.

---

# 19. Interactive Query Refinement

When a query is ambiguous, the system should ask targeted questions.

Bad:

```text
Can you clarify?
```

Good:

```text
“Does Billing call Accounts?” can mean several things.

Most likely interpretations:
1. Direct source-level calls from Billing modules to Accounts modules.
2. Runtime calls observed between Billing and Accounts services.
3. Any transitive dependency from Billing to Accounts.
4. Calls to Accounts internal modules, excluding public API.

I can answer the strict architecture-boundary version:
  “Does Billing call Accounts internals directly in current production snapshot?”
```

For high-speed UI use, clarification should usually be optional. The system can default to the most useful compiled query and show the interpretation.

---

# 20. Saved Queries

The query language should support saved queries.

Examples:

```yaml
saved_query: open_architecture_drift
query: drift
root:
  workspace: current
filters:
  belief_state:
    include:
      - drifted
      - contested
      - unimplemented
      - unverified
output:
  group_by: bounded_context
```

```yaml
saved_query: pr_required_architecture_review
query: violation
root:
  pr: current
filters:
  severity:
    include:
      - error
      - critical
  finding_status:
    include:
      - new
      - exception_expired
actions:
  include: true
```

```yaml
saved_query: security_commitments_without_tests
query: coverage
select:
  commitment:
    quality_attribute: security
    lifecycle_state: accepted
require:
  missing_relation: verified_by
output:
  group_by: owning_team
```

Saved queries become:

```text
dashboards
CI checks
UI presets
architecture review queues
knob states
```

This unifies the query layer with the projection and action layers.

---

# 21. Query-to-Projection Integration

Some queries should return ordinary answers. Others should return or generate a projection.

Example:

```yaml
query: projection
root:
  bounded_context: Billing
view:
  kind: drift_map
dimensions:
  - boundary_clarity
  - coupling
  - runtime_alignment
  - verification
compression:
  audience: architect
```

The query planner should decide:

```text
Is there an existing materialized projection packet?
Can it be reused?
Does it need a filtered projection?
Does a new projection packet need to be generated offline?
Can the answer be produced directly from existing packets?
```

This preserves the low-latency design.

The query layer should not destroy the pre-materialized UI model. It should compile into it.

---

# 22. Query-to-Action Integration

Some queries naturally produce actions.

Example:

```text
Show accepted security commitments with no tests.
```

The answer can include:

```text
findings
missing tests
suggested generated tests
approval requirements
CI behavior
```

Structured query:

```yaml
query: coverage

select:
  commitment:
    quality_attribute: security
    lifecycle_state: accepted

missing:
  relation: verified_by

actions:
  suggest:
    - generate_test
    - request_security_review
```

Output:

```text
5 accepted security commitments lack verification evidence.

Suggested actions:
  - Generate ExUnit test for password reset non-enumeration.
  - Generate property test for token expiry.
  - Request security review for MFA recovery flow.
```

Queries should be able to request:

```text
include_actions: true
```

or:

```text
advisory_only: true
```

---

# 23. Query-to-Belief Integration

Queries should not directly trust raw graph edges.

They should route through belief states.

Example:

```text
What implements SEC-014?
```

A raw trace may find:

```text
Accounts.Token.verify_reset_token/1
```

But the answer should say:

```text
currently verified
```

or:

```text
currently drifted
```

or:

```text
implementation candidate, but unverified
```

IntentQL should support belief filters:

```yaml
belief:
  include:
    - verified
    - believed
  exclude:
    - refuted
    - superseded
```

Or:

```yaml
belief:
  include_contested: true
  include_stale: true
  explain_conflicts: true
```

This is critical. The query language should ask over the **current belief model**, not just stored edges.

---

# 24. Query-to-Causal Engine Integration

Impact queries should not be graph traversals. They should invoke the causal impact engine.

Example:

```yaml
query: impact

change:
  artifact:
    commitment: billing_no_accounts_table_reads
  operation: strengthen
  delta:
    no_exceptions: true

impact:
  classify:
    - must_change
    - may_change
    - must_revalidate
```

The causal engine should classify artifacts, not merely return connected ones.

Output:

```text
must_change:
  - remove 2 existing exceptions
  - replace Billing.Legacy.Export direct read
  - update migration plan

must_revalidate:
  - Reporting invoice export tests
  - Billing event projection contract

may_change:
  - Reporting data freshness expectations
  - dashboard query source
```

This is a core novelty point.

---

# 25. Query Security and Access Control

The query language must respect permissions.

A user should not be able to ask:

```text
Show me secrets in runtime config.
```

or access unauthorized code/docs/traces.

Query results should be filtered by:

```text
artifact-level ACL
repo access
runtime trace access
secret redaction policy
tenant isolation
model-access policy
security classification
```

If evidence is redacted, the answer should say:

```text
Some evidence is hidden due to access policy.
```

rather than pretending it does not exist.

Example:

```text
This requirement appears to be implemented by 3 code spans.
1 span is hidden because it is in a restricted repository.
```

Trust requires visible redaction boundaries.

---

# 26. Query Evaluation Corpus

The query language should be benchmarked.

Create query benchmarks like:

```text
Why does this function exist?
What does this requirement implement?
What does this PR affect?
Where is this architecture drifting?
Which code violates this commitment?
Which tests verify this requirement?
What must change if this API is deprecated?
```

For each benchmark query, collect human-labeled expected answers:

```text
correct root resolution
correct trace path
correct impact classification
correct evidence
correct omissions
correct confidence
```

This turns IntentQL into an evaluable product surface.

---

# 27. Minimal Viable IntentQL

Do not build the entire query language at once.

Start with five query kinds:

```text
1. rationale
2. realization
3. impact
4. drift
5. violation
```

And support these object roots:

```text
requirement
commitment
function
source_span
bounded_context
PR
```

And these belief states:

```text
verified
believed
stale
drifted
unimplemented
unverified
contested
refuted
```

That is enough for a powerful first version.

## First useful query set

```text
Why does this function exist?

What implements this requirement?

What requirements does this PR affect?

What architecture rules does this PR violate?

Where is this bounded context drifting?

What accepted commitments lack tests?

What must change if this requirement changes?
```

These are immediately valuable.

---

# 28. Example Syntax Set

A compact IntentQL textual syntax could look like this:

```text
WHY function Accounts.Token.verify_reset_token/1
THROUGH contract, commitment, decision, requirement
IN snapshot main
INCLUDE evidence, tests, runtime
```

```text
IMPACT pr 1842
UPSTREAM TO requirements, decisions, commitments
CLASSIFY must_change, may_change, must_revalidate, drifted
INCLUDE actions
```

```text
DRIFT bounded_context Billing
COMPARE intended(commitments, adrs)
WITH actual(code, runtime, deps)
IN environment prod
GROUP BY severity
```

```text
VIOLATIONS commitment billing_no_accounts_table_reads
WHERE finding_status = new
IN pr 1842
INCLUDE source_spans, exceptions, actions
```

```text
COVERAGE commitments
WHERE quality_attribute = security
AND lifecycle_state = accepted
MISSING verified_by
GROUP BY owner
```

This human-readable syntax can compile to the YAML/JSON canonical form.

---

# 29. Relationship to Knobs

The UI knobs and IntentQL are not separate systems.

A knob state is a parameterized query.

Example:

```text
Knob: abstraction level
  changes representation_level filter

Knob: concern
  changes dimension filter

Knob: trace direction
  changes traversal operator

Knob: certainty
  changes belief-state filter

Knob: runtime/design toggle
  changes graph layer comparison

Knob: compression level
  changes output policy
```

So the UI can be understood as:

```text
a tactile query interface over precomputed projection packets
```

The user turns knobs; the system mutates query parameters and fetches the corresponding projection.

This directly connects the original UI concept to the operating intelligence layer.

---

# 30. What This Adds

The Query Language gives the system a working answer to:

```text
How do users ask questions across the hyperdimensional architecture?

How does natural language become reproducible reasoning?

How do saved views, CI checks, and UI knobs share the same semantics?

How does the system query beliefs rather than raw facts?

How does it expose causal impact and drift as first-class results?

How does it produce trusted, evidence-backed answers instead of graph dumps?
```

Without this layer, the system is navigable but not interrogable.

With it, the user can reason through the software universe directly.

---

# 31. Final Definition

The Query Language is:

> A belief-aware, causally capable, evidence-returning query layer that compiles natural language, saved views, UI knobs, CI checks, and API requests into reproducible operations over the intent-to-implementation hypergraph.

It is the bridge from:

```text
the system has knowledge
```

to:

```text
humans and tools can ask precise, trustworthy questions of that knowledge
```

The next gap to fill is the **Evaluation Corpus and Benchmark Harness**: how to prove that the belief engine, commitment DSL, action model, and query language are accurate, useful, calibrated, and fast.
