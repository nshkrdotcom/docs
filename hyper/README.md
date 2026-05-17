# Intent-to-Implementation Architecture Intelligence

This directory is a design dossier for a software intelligence system that goes far beyond code search, static analysis, or LLM summaries.

The central idea:

> Build a versioned, evidence-backed, operating intelligence system that understands how informal intent becomes requirements, how requirements become architecture, how architecture becomes contracts, how contracts become code, how code is verified, and how all of it changes over time.

The docs evolve from a code-understanding substrate into a broader architecture and engineering-memory system. The final shape is not just a graph. It is a reasoning system over a graph: it maintains beliefs, detects drift, evaluates commitments, predicts change impact, supports governance, asks targeted questions, and serves fast UI projections.

---

## Start Here

If you only read one thing, read this README first, then read these in order:

1. [0060_eng_gpt.md](0060_eng_gpt.md)  
   Explains the missing leap from a representational graph to an operating intelligence kernel.

2. [0061_BeliefCalculusfortheOperatingIntelligenceKernel.md](0061_BeliefCalculusfortheOperatingIntelligenceKernel.md)  
   Defines how the system decides what is believed, verified, stale, drifted, contested, or refuted.

3. [0062_CommitmentLanguage_ArchDSL.md](0062_CommitmentLanguage_ArchDSL.md)  
   Defines the architecture DSL that turns human intent into executable commitments.

4. [0063_ActionModel_forThe_OperatingIntelligenceKernel.md](0063_ActionModel_forThe_OperatingIntelligenceKernel.md)  
   Defines how the system reports, warns, blocks CI, drafts tests, requests approval, and learns.

5. [0088_CollaborativeEngineeringPractice.md](0088_CollaborativeEngineeringPractice.md)  
   Reframes the system as support for real engineering practice, not only software as an artifact.

Those five files give the shortest path to the current thesis.

---

## The Mental Model

The system has three broad layers.

### 1. Representation Substrate

This is the indexed model of the software universe:

```text
source files
AST nodes
symbols
functions
clauses
modules
Mix projects
OTP applications
bounded contexts
runtime services
requirements
decisions
commitments
contracts
tests
runtime observations
external systems
human annotations
```

The substrate is versioned, evidence-backed, and precomputed. The UI reads materialized projection packets instead of doing live inference when a user turns a knob.

### 2. Operating Intelligence Kernel

This is the reasoning layer:

```text
belief calculus
commitment evaluation
causal impact reasoning
action selection
query planning
trust rendering
governance
known-unknown elicitation
inference scheduling
```

This is where the novelty lives. The system does not merely store that a function implements a requirement. It can say:

```text
This function used to satisfy the accepted security commitment.
The current PR changed the implementation.
The upstream ADR was not updated.
The old test is now stale.
The current state is architecture drift.
CI should fail unless the code is restored or an approved ADR amendment is added.
```

### 3. Human and Product Surface

This is how people experience the system:

```text
PR architecture reviewer
architecture drift explorer
requirement-to-code trace explorer
function rationale view
boundary violation dashboard
provider migration control room
governance review queue
onboarding/rationale assistant
```

The UX is not just visualization. It is a trust surface: every important claim should expose scope, evidence, uncertainty, freshness, contradiction, and next action.

---

## The Implementation Primitive

The elegant primitive in this design is not an "agent" object and not a raw graph node. It is a **stateful work episode over an evidence-scoped context bundle**.

In practical terms:

```text
work_episode
  root artifact or event
  current scope
  context bundle
  active belief states
  trace paths
  action contracts
  collaboration events
  open loops
  resulting artifacts
```

This is the unit that makes long-running reasoning implementable.

### Why This Works

An episode gives the system durable state without hiding that state inside a prompt or chat transcript.

```text
Stateful behavior
  lives in work_episode, belief states, open loops, and action state machines.

Decision trace
  lives in action contracts, review events, governance verdicts, and before/after belief states.

Context graph
  lives in context bundles, trace paths, diagonal path indexes, and projection packets.

Agent memory
  becomes explicit artifacts, claims, evidence, corrections, and learned priors.

Replayability
  comes from event logs, query provenance, benchmark cases, and audit trails.
```

The system does not ask an assistant to "remember" why it did something. It persists the reasoning substrate:

```text
what was known
what was believed
what evidence was used
what decision was made
who approved it
what changed afterward
what remains unresolved
```

### Minimal Shape

The smallest useful implementation can use six records:

```text
1. artifact
   The thing being reasoned about.

2. context_bundle
   The bounded neighborhood assembled for the task.

3. claim / belief_state
   What the system currently believes about the artifact.

4. trace_path
   How the artifact connects to requirements, decisions, code, tests, runtime, or ownership.

5. action_contract
   What the system proposes or performs, with evidence, risk, approval, and verification.

6. open_loop
   What remains unresolved after the action.
```

Everything else in the design can be seen as specialization or scaling of that primitive.

Example:

```text
PR #1842 opens
  -> work episode created
  -> context bundle assembled around changed source spans
  -> beliefs recomputed for affected commitments
  -> trace paths connect code to SEC-014 and ADR-008
  -> action contract says CI should fail unless resolved
  -> governance event records approval, rejection, or exception
  -> open loop tracks required ADR/test follow-up
```

That is the implementation answer: make reasoning state explicit, scoped, inspectable, and replayable.

---

## What This Is Not

This design is not:

```text
an AST viewer
a code summarizer
a generic knowledge graph
a static architecture diagram generator
a RAG chatbot over source files
a CI linter with prettier output
```

Those can be components or baselines. The target system is stronger:

```text
a truth-maintaining, causally aware, executable architecture memory for large software systems
```

---

## Design Evolution

The documents form a sequence. Each group answers a different question.

### Phase 1: Code Understanding Substrate

These files define the code-level and AST-grounded foundation.

- [0001_codex.md](0001_codex.md)  
  Introduces the versioned, AST-anchored semantic hypergraph for Elixir. It defines anchors, source spans, AST nodes, symbols, semantic facts, relations, dimensions, projections, and UI transition caches.

- [0010_claude.md](0010_claude.md)  
  Proposes a pre-materialized hyperdimensional index over AST entities. It emphasizes that knob turns should be indexed lookups, not runtime LLM calls.

Together, these establish the leaf layer:

```text
source -> AST -> anchors -> semantic facts -> dimensions -> projections
```

### Phase 2: Architecture Above Code

These files extend beyond modules and functions into real Elixir system architecture.

- [0002_codex.md](0002_codex.md)  
  Adds workspace snapshots, repositories, Mix project roots, umbrella membership, OTP applications, dependency declarations, architecture entities, architecture edges, runtime services, supervision topology, config, ownership, and architecture projections.

- [0011_claude.md](0011_claude.md)  
  Adds organizations, repo groups, OTP apps, API surfaces, cross-app relations, bounded contexts, context relations, architectural patterns, and architectural understanding slices.

- [0020_response_gpt.md](0020_response_gpt.md)  
  Critiques and hardens the architecture layer: snapshot-first modeling, normalized canonical graph plus denormalized UI caches, evidence, runtime traces, data/config/test architecture, policy evaluation, projection packets, and lineage.

- [0030_response_claude.md](0030_response_claude.md)  
  Adds Elixir-specific gaps: Mix evaluation, `mix xref`, `use` injection, telemetry, Ecto ownership, LiveView/HEEx, Mix.lock, distributed BEAM topology, extraction protocols, and coordinate query performance.

Together, these establish the architecture layer:

```text
workspace snapshot
  -> repositories
    -> Mix projects
      -> OTP apps
        -> runtime services
          -> bounded contexts
            -> source graph
```

### Phase 3: Intent-to-Implementation Traceability

These files identify the missing continuum between vague human intent and concrete code.

- [0040_arch_gpt.md](0040_arch_gpt.md)  
  Introduces the design-to-code hypergraph: requirements, capabilities, scenarios, decisions, commitments, contracts, implementation, verification, runtime, and history.

- [0050_arch_claude.md](0050_arch_claude.md)  
  Names the traceability continuum and introduces artifacts, artifact links, multi-modal representations, temporal causation, and continuous abstraction-level navigation.

Together, these shift the design from:

```text
architecture over code
```

to:

```text
intent -> decision -> architecture -> contract -> code -> test -> runtime -> history
```

### Phase 4: Operating Intelligence Kernel

These files define the reasoning layer that makes the design novel.

- [0060_eng_gpt.md](0060_eng_gpt.md)  
  Names the missing layer: the operating intelligence kernel. It reframes the product around truth maintenance, causal reasoning, executable architecture memory, semantic compression, runtime feedback, human learning, and benchmarks.

- [0061_BeliefCalculusfortheOperatingIntelligenceKernel.md](0061_BeliefCalculusfortheOperatingIntelligenceKernel.md)  
  Defines claims, evidence, contextual authority, support/refute scoring, belief states, contradiction taxonomy, scope, freshness, invalidation, propagation, and calibration.

- [0062_CommitmentLanguage_ArchDSL.md](0062_CommitmentLanguage_ArchDSL.md)  
  Defines a semi-formal architecture commitment DSL with selectors, constraints, evidence policies, exceptions, lifecycle states, action policies, compilation targets, and examples.

- [0063_ActionModel_forThe_OperatingIntelligenceKernel.md](0063_ActionModel_forThe_OperatingIntelligenceKernel.md)  
  Defines action levels and safety gates: observe, explain, recommend, draft, stage, request approval, execute, enforce, verify, and learn.

- [0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md](0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md)  
  Defines IntentQL, a belief-aware query language for rationale, realization, impact, drift, violation, runtime alignment, compression, and action queries.

- [0065_EvaluationCorpus_and_BenchmarkHarness.md](0065_EvaluationCorpus_and_BenchmarkHarness.md)  
  Defines how to benchmark trace correctness, belief correctness, causal impact, commitment evaluation, action quality, query answers, compression faithfulness, runtime feedback, learning, and performance.

- [0066_TrustUX_forThe_OperatingIntelligenceKernel.md](0066_TrustUX_forThe_OperatingIntelligenceKernel.md)  
  Defines the UX discipline for belief badges, evidence ladders, intended-vs-actual splits, scope stamps, contested evidence, exceptions, unknowns, redaction, generated content, and calibrated trust.

Together, these make the system active:

```text
observe -> revise beliefs -> detect drift -> infer impact -> choose action -> explain -> learn
```

### Phase 5: Practice, Governance, and Scale

The `0070` feedback identified what was still missing after the operating kernel. The `0080` series fills those gaps.

- [0070_feedback_claude.md](0070_feedback_claude.md)  
  Short critique identifying missing human process, tacit architecture, organizational time, policy inheritance, dimension conflict, diagonal navigation materialization, external interface evolution, and inference prioritization.

- [0080_GovernanceProcess_forArchitectureIntelligence.md](0080_GovernanceProcess_forArchitectureIntelligence.md)  
  Adds governance bodies, actors, decision rights, proposals, review events, verdicts, disputes, and business overrides.

- [0081_KnownUnknowns_andArchitectureElicitation.md](0081_KnownUnknowns_andArchitectureElicitation.md)  
  Adds known unknowns, architecture questions, elicitation sessions, tacit knowledge capture, and active learning.

- [0082_OrganizationalTime_andOwnershipContinuity.md](0082_OrganizationalTime_andOwnershipContinuity.md)  
  Adds team lineage, ownership epochs, handoff events, knowledge continuity, acquired code context, and orphaned intent.

- [0083_ComposableCommitments_andPolicyInheritance.md](0083_ComposableCommitments_andPolicyInheritance.md)  
  Adds commitment packs, inheritance, overrides, profiles, effective commitments, conflict detection, and policy materialization.

- [0084_DimensionalConflict_andDecisionPressureCalculus.md](0084_DimensionalConflict_andDecisionPressureCalculus.md)  
  Adds pressure vectors for competing forces like safety, urgency, verification, ownership, business pressure, and operational risk.

- [0085_DiagonalNavigation_MaterializationStrategy.md](0085_DiagonalNavigation_MaterializationStrategy.md)  
  Makes diagonal navigation concrete with ranked cross-dimensional path families, candidate pools, path indexes, scoring, and invalidation.

- [0086_ExternalInterfaceEvolution.md](0086_ExternalInterfaceEvolution.md)  
  Treats external systems as evolving architectural constraints, with API versions, provider notices, compatibility bindings, and migration plans.

- [0087_SalienceDrivenInferenceScheduling.md](0087_SalienceDrivenInferenceScheduling.md)  
  Defines budget-aware prioritization for analysis, LLM work, runtime ingestion, projection refreshes, benchmark runs, and human questions.

- [0088_CollaborativeEngineeringPractice.md](0088_CollaborativeEngineeringPractice.md)  
  Synthesizes the remaining gap: the system should model engineering work as collaborative practice, with work episodes, open loops, practice stages, and reusable workflows.

Together, these shift the system from:

```text
software as a product to be understood
```

to:

```text
software development as a practice to be supported
```

---

## Core Concepts

### Artifact

Any meaningful piece of the software universe:

```text
doc section
requirement
decision
commitment
contract
module
function
source span
test
runtime trace
external provider notice
human correction
```

Artifacts can have multiple representations: prose, structured JSON, graph node, vector embedding, source span, AST node, or projection packet.

### Anchor

A stable handle for something navigable. Code-level anchors point to files, modules, functions, clauses, AST nodes, call sites, source spans, and generated projections. Higher-level anchors point to architecture entities, commitments, runtime services, external systems, questions, or actions.

The UI should mostly navigate anchors, not raw AST rows.

### Claim

A proposition the system may believe, refute, mark stale, or contest.

Example:

```text
Accounts.Token.verify_reset_token/1 enforces 15-minute reset token expiry.
```

Claims are evaluated against evidence. They are not treated as permanent facts.

### Evidence

The basis for or against a claim:

```text
source span
test assertion
runtime trace
ADR
requirement
policy
human correction
static analysis
LLM inference
```

Evidence has authority only in context. Code is high-authority for what is implemented. ADRs are high-authority for what was intended. Runtime traces are high-authority for what occurred.

### Belief State

The current truth posture of a claim:

```text
verified
believed
inferred
unverified
unimplemented
stale
contested
drifted
refuted
exceptioned
scope_split
unknown
```

These states are operational. They determine what the UI shows, what CI does, and what actions are safe.

### Commitment

An accepted architectural statement that constrains the system.

Example:

```text
Billing must not directly read Accounts-owned tables.
```

In the DSL, this becomes selectors, forbidden relations, allowed indirections, exceptions, evidence requirements, severity, and action policy.

### Projection Packet

A complete precomputed UI payload:

```text
current subject
visible claims
source excerpts
evidence summaries
neighbors
diagonal paths
actions
transition hints
scope stamp
trust footer
```

Projection packets preserve the fast knob-driven UI model.

### Diagonal Path

A ranked cross-cutting navigation path that does not follow only containment or call structure.

Example:

```text
function -> security commitment -> violated ADR -> stale test -> required action
```

Diagonal paths are precomputed and scored, not discovered randomly at view time.

### Work Episode

A durable unit of engineering activity:

```text
PR review
architecture review
provider migration
incident follow-up
feature design
onboarding investigation
```

The episode holds the scoped context, active beliefs, decisions, actions, collaboration events, and unresolved follow-ups for that work.

### Context Bundle

The bounded set of artifacts needed to reason about a task:

```text
root artifact
upstream requirements
relevant decisions
commitments
contracts
source spans
tests
runtime observations
owners
open unknowns
```

A context bundle is the concrete implementation of a task-specific context graph.

### Action Contract

A structured record of what the system proposes to do, why, with what evidence, under what authority, and how it will be verified.

Examples:

```text
fail CI for a new high-confidence violation
draft an ADR amendment
generate a missing test
request a scoped exception
ask an owner clarification question
```

Action contracts make system behavior auditable instead of opaque.

### Open Loop

An unresolved piece of engineering practice:

```text
exception follow-up
ADR update required
missing test
owner clarification
known unknown
provider migration task
```

Open loops turn findings into durable work, rather than one-off comments.

---

## Example Product Experience

Suppose a PR changes this:

```elixir
Phoenix.Token.verify(MyAppWeb.Endpoint, @salt, token, max_age: 3600)
```

Previously it was:

```elixir
max_age: 900
```

The system should not merely say:

```text
This line changed.
```

It should say:

```text
Architecture drift detected.

Intended architecture:
  Password reset tokens expire within 15 minutes.
  Sources: SEC-014 and ADR-008.

Current implementation:
  This PR changes expiry to 60 minutes.
  Source: lib/accounts/token.ex:44.

Verification impact:
  Existing expiry test still asserts 15-minute behavior.

State:
  Drifted.

Action:
  Restore max_age: 900, or update SEC-014, ADR-008, tests,
  and obtain security approval.

CI:
  Fail new high-confidence security drift unless resolved.
```

That behavior requires the full stack:

```text
source span extraction
claim normalization
belief calculus
commitment DSL
trace paths
action policy
governance
trust UX
projection packet
```

---

## Recommended Reading Paths

### For the Architecture Thesis

Read:

1. [0040_arch_gpt.md](0040_arch_gpt.md)
2. [0050_arch_claude.md](0050_arch_claude.md)
3. [0060_eng_gpt.md](0060_eng_gpt.md)
4. [0088_CollaborativeEngineeringPractice.md](0088_CollaborativeEngineeringPractice.md)

You will get the conceptual arc from code graph to intent-to-implementation hypergraph to operating architecture intelligence.

### For the First Product Wedge

Read:

1. [0062_CommitmentLanguage_ArchDSL.md](0062_CommitmentLanguage_ArchDSL.md)
2. [0063_ActionModel_forThe_OperatingIntelligenceKernel.md](0063_ActionModel_forThe_OperatingIntelligenceKernel.md)
3. [0066_TrustUX_forThe_OperatingIntelligenceKernel.md](0066_TrustUX_forThe_OperatingIntelligenceKernel.md)
4. [0080_GovernanceProcess_forArchitectureIntelligence.md](0080_GovernanceProcess_forArchitectureIntelligence.md)

This points toward the first likely product:

```text
PR Architecture Reviewer for Elixir umbrellas and multi-repo systems
```

### For Data Model and Indexing

Read:

1. [0001_codex.md](0001_codex.md)
2. [0002_codex.md](0002_codex.md)
3. [0020_response_gpt.md](0020_response_gpt.md)
4. [0030_response_claude.md](0030_response_claude.md)

This gives the physical data model: source spans, AST, anchors, symbols, architecture entities, dependencies, runtime services, data/config/test layers, and projection caches.

### For Reasoning and Trust

Read:

1. [0061_BeliefCalculusfortheOperatingIntelligenceKernel.md](0061_BeliefCalculusfortheOperatingIntelligenceKernel.md)
2. [0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md](0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md)
3. [0065_EvaluationCorpus_and_BenchmarkHarness.md](0065_EvaluationCorpus_and_BenchmarkHarness.md)
4. [0066_TrustUX_forThe_OperatingIntelligenceKernel.md](0066_TrustUX_forThe_OperatingIntelligenceKernel.md)

This explains how the system avoids becoming an overconfident AI oracle.

### For Scaling the System in Real Organizations

Read:

1. [0080_GovernanceProcess_forArchitectureIntelligence.md](0080_GovernanceProcess_forArchitectureIntelligence.md)
2. [0081_KnownUnknowns_andArchitectureElicitation.md](0081_KnownUnknowns_andArchitectureElicitation.md)
3. [0082_OrganizationalTime_andOwnershipContinuity.md](0082_OrganizationalTime_andOwnershipContinuity.md)
4. [0083_ComposableCommitments_andPolicyInheritance.md](0083_ComposableCommitments_andPolicyInheritance.md)
5. [0087_SalienceDrivenInferenceScheduling.md](0087_SalienceDrivenInferenceScheduling.md)

This covers authority, tacit knowledge, ownership drift, layered policy, and resource allocation.

---

## Likely First Build

The most practical first product is:

```text
PR Architecture Reviewer for Elixir umbrellas and multi-repo systems
```

Why this wedge works:

```text
It is narrow enough to build.
It uses the core architecture ideas.
It creates immediate value.
It produces benchmarkable outcomes.
It can start advisory and later enforce.
It captures human feedback naturally in PR review.
```

Minimum capabilities:

```text
1. Index source, Mix projects, OTP apps, modules, functions, call edges.
2. Define a small commitment pack:
   - Web controllers must not call Repo directly.
   - Domain apps must not call other domain internals.
   - Data tables have owners.
   - Deprecated APIs must not gain new consumers.
   - Security commitments must have tests.
3. Run in observe-only mode to baseline existing violations.
4. Switch to fail-new-violations mode for high-confidence findings.
5. Show exact source evidence and violated commitment.
6. Offer resolution options:
   - fix code
   - add test
   - draft ADR update
   - request scoped exception
7. Record reviewer decisions as learning signals.
```

This wedge proves the thesis without requiring the entire system.

---

## Implementation Sequence

A practical build order:

### Stage 1: Substrate

```text
source files
source spans
AST nodes
anchors
symbols
call sites
Mix project roots
OTP apps
architecture entities
basic relation graph
```

Primary docs:

- [0001_codex.md](0001_codex.md)
- [0002_codex.md](0002_codex.md)
- [0030_response_claude.md](0030_response_claude.md)

### Stage 2: Commitments and Beliefs

```text
structured claims
evidence attachment
belief states
commitment DSL
commitment evaluation
exceptions
staleness and invalidation
```

Primary docs:

- [0061_BeliefCalculusfortheOperatingIntelligenceKernel.md](0061_BeliefCalculusfortheOperatingIntelligenceKernel.md)
- [0062_CommitmentLanguage_ArchDSL.md](0062_CommitmentLanguage_ArchDSL.md)
- [0083_ComposableCommitments_andPolicyInheritance.md](0083_ComposableCommitments_andPolicyInheritance.md)

### Stage 3: PR Action Surface

```text
changed artifact detection
local belief recomputation
new vs existing violation classification
PR comments
CI checks
action contracts
approval routing
trust UX
```

Primary docs:

- [0063_ActionModel_forThe_OperatingIntelligenceKernel.md](0063_ActionModel_forThe_OperatingIntelligenceKernel.md)
- [0066_TrustUX_forThe_OperatingIntelligenceKernel.md](0066_TrustUX_forThe_OperatingIntelligenceKernel.md)
- [0080_GovernanceProcess_forArchitectureIntelligence.md](0080_GovernanceProcess_forArchitectureIntelligence.md)

### Stage 4: Queries and Projections

```text
IntentQL
projection packets
diagonal path indexes
compression policies
scope stamps
trust footers
```

Primary docs:

- [0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md](0064_QueryLanguage_forThe_OperatingIntelligenceKernel.md)
- [0085_DiagonalNavigation_MaterializationStrategy.md](0085_DiagonalNavigation_MaterializationStrategy.md)

### Stage 5: Learning, Evaluation, and Scale

```text
benchmark harness
confidence calibration
human correction learning
salience-driven scheduling
known-unknown elicitation
organizational time
external interface evolution
```

Primary docs:

- [0065_EvaluationCorpus_and_BenchmarkHarness.md](0065_EvaluationCorpus_and_BenchmarkHarness.md)
- [0081_KnownUnknowns_andArchitectureElicitation.md](0081_KnownUnknowns_andArchitectureElicitation.md)
- [0082_OrganizationalTime_andOwnershipContinuity.md](0082_OrganizationalTime_andOwnershipContinuity.md)
- [0086_ExternalInterfaceEvolution.md](0086_ExternalInterfaceEvolution.md)
- [0087_SalienceDrivenInferenceScheduling.md](0087_SalienceDrivenInferenceScheduling.md)

---

## Architectural Invariants

The final system should preserve these invariants:

```text
Every important claim has a belief state.
Every high-impact claim has inspectable evidence.
Every answer has scope.
Every enforcement action has exact evidence.
Every contradiction is preserved or explicitly resolved.
Every exception has scope, approver, and expiry.
Every unknown is represented as unknown, not clean.
Every generated artifact is a draft until approved.
Every compressed view preserves high-risk and contested facts.
Every human correction records scope and authority.
Every governance decision is auditable.
Every action leaves a durable learning signal.
```

These invariants are more important than any individual table.

---

## Key Design Tensions

### Discovery vs Decision

The system can infer architecture, but inference is not authority. Governance decides what counts as accepted architecture.

### Current Code vs Intended Architecture

The system must never silently treat current implementation as intended design. Drift is a first-class state.

### Automation vs Approval

The system can draft tests, ADRs, exceptions, and patches. High-risk changes require explicit approval and audit trails.

### Compression vs Trust

The UI should reduce cognitive load, but never hide active contradictions, high-risk unknowns, expired exceptions, or critical missing evidence.

### Runtime Reality vs Static Intent

Runtime traces can confirm or refute assumptions, but observed behavior is not automatically correct architecture.

### Local Exception vs Global Rule

A scoped exception should not weaken a commitment globally.

---

## Vocabulary Cheat Sheet

```text
Intent-to-Implementation Hypergraph
  The full trace space from vague goals to code, tests, runtime, and history.

Operating Intelligence Kernel
  The reasoning layer that maintains beliefs, evaluates commitments, chooses actions, and learns.

Belief Calculus
  The system for computing verified, stale, drifted, contested, refuted, and unknown states.

Architecture Commitment
  A human or organization-accepted constraint over the software system.

IntentQL
  A query language over requirements, architecture, code, tests, runtime, beliefs, and actions.

Projection Packet
  A precomputed UI payload for fast navigation and knob transitions.

Diagonal Navigation
  Cross-cutting movement across dimensions, such as code to risk to owner to policy.

Work Episode
  A durable state container for one engineering activity, including context, beliefs, actions, decisions, and open loops.

Context Bundle
  A scoped graph neighborhood assembled for a task, query, PR, review, or investigation.

Action Contract
  A structured proposal or operation with evidence, risk, authority, approval, verification, and audit state.

Known Unknown
  An explicit architectural memory gap that should be answered or governed.

Open Loop
  An unresolved follow-up such as missing test, expired exception, ADR update, or owner clarification.

Trust UX
  The interface discipline for showing evidence, scope, uncertainty, contradictions, and safe actions.
```

---

## One-Sentence Summary

This dossier designs a system that turns software architecture from scattered code, docs, decisions, runtime traces, and human memory into a live, evidence-backed, queryable, enforceable, and governable engineering intelligence layer.
