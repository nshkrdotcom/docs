# Agentic Coding: Executable Architecture, Semantic Control, and Intervention-Aware Software Engineering

This directory collects a line of thought about why autonomous coding agents fail on large systems, why ordinary guardrails are insufficient, and what a more serious substrate for AI-assisted software engineering would require.

The central claim is simple:

> Agentic coding does not become reliable by giving models more prose instructions. It becomes reliable when the architecture of the software is represented as an executable, queryable, mutation-tested control system over possible code changes.

The files in this directory develop that claim from a concrete Codex failure case into a broader theory of executable architecture, semantic types, architectural capsules, intervention graphs, and control oracles.

This README covers only the Markdown files directly in `./agentic_coding/`. It intentionally excludes the large nested MVP docset under `./agentic_coding/0009_elixir_otp_executable_architecture_mvp/`.

---

## Table of Contents

### Part I — The motivating failure case

1. [`0001_codex_hypehype_failure_case.md`](#0001-codex-hypehype-failure-case)
2. [`0100_claude_codex_failure_analysis.md`](#0100-claude-codex-failure-analysis)
3. [`0101_structural_write_scope_restriction_approaches.md`](#0101-structural-write-scope-restriction-approaches)
4. [`0102_senior_engineer_intuition_versus_guardrails.md`](#0102-senior-engineer-intuition-versus-guardrails)

### Part II — From guardrails to repair-shape reasoning

5. [`0002_autonomous_agent_architecture_guardrails.md`](#0002-autonomous-agent-architecture-guardrails)
6. [`0103_invariants_encoded_as_mechanical_tests.md`](#0103-invariants-encoded-as-mechanical-tests)
7. [`0003_pivot_to_executable_semantic_models.md`](#0003-pivot-to-executable-semantic-models)
8. [`0104_morphisms_and_structure_preserving_transformations.md`](#0104-morphisms-and-structure-preserving-transformations)

### Part III — The semantic model

9. [`0004_core_abstraction_beyond_conventional_docs.md`](#0004-core-abstraction-beyond-conventional-docs)
10. [`0005_definition_autonomous_software_engineering_model.md`](#0005-definition-autonomous-software-engineering-model)
11. [`0006_deep_extraction_of_system_center.md`](#0006-deep-extraction-of-system-center)
12. [`0105_performance_as_first_class_type.md`](#0105-performance-as-first-class-type)
13. [`0106_universal_ontology_and_language_projections.md`](#0106-universal-ontology-and-language-projections)
14. [`0107_repair_scope_as_agent_capability.md`](#0107-repair-scope-as-agent-capability)

### Part IV — Applying the model to real agentic coding

15. [`0007_solving_codex_with_semantic_types.md`](#0007-solving-codex-with-semantic-types)
16. [`0008_stronger_answer_for_agentic_coding.md`](#0008-stronger-answer-for-agentic-coding)
17. [`0009_elixir_otp_executable_architecture_mvp.md`](#0009-elixir-otp-executable-architecture-mvp)
18. [`0010_next_hard_layer_of_model.md`](#0010-next-hard-layer-of-model)
19. [`0011_annotations_are_insufficient_for_invariants.md`](#0011-annotations-are-insufficient-for-invariants)
20. [`0012_reality_check_on_architecture_scope.md`](#0012-reality-check-on-architecture-scope)

### Part V — The deeper architecture-evaluation turn

21. [`0013_main_point_of_executable_architecture.md`](#0013-main-point-of-executable-architecture)
22. [`0014_missing_fundamental_object_from_future.md`](#0014-missing-fundamental-object-from-future)

### Synthesis

23. [The cohesive argument](#the-cohesive-argument)
24. [Core concepts](#core-concepts)
25. [System architecture implied by the directory](#system-architecture-implied-by-the-directory)
26. [Practical MVP path](#practical-mvp-path)
27. [What this directory is really about](#what-this-directory-is-really-about)

---

# File Summaries

## `0001_codex_hypehype_failure_case.md`

This file starts from a concrete Codex failure involving HypeHype’s renderer. The agent attempted to solve a local font-rendering/OOM problem by adding a hardcoded bind group slot to a Metal backend path. The local repair mutated global renderer binding architecture, violating portability, ABI stability, and hot-path performance assumptions.

The key idea is **Architectural Choke-Point Protection**. Some files, modules, data structures, or interfaces are not ordinary code. They define cross-system contracts: renderer binding layouts, capability derivation rules, provider adapter contracts, tensor backend fallback semantics, session identity propagation, provenance token formats, sandbox boundaries, and planner/executor handoff schemas.

The file argues that agents must be blocked from editing such choke points unless the change carries explicit evidence: invariant diffs, compatibility matrices, benchmark results, and migration proofs. The lesson is not “LLMs are bad at code.” The lesson is that AI agents are dangerous where a local patch can silently mutate a global contract.

## `0100_claude_codex_failure_analysis.md`

This file provides a compact analysis of the same Codex incident. It identifies two nested failures:

1. OOM handling was placed at the wrong architectural layer.
2. A backend-specific bind group hack corrupted a cross-backend portability contract.

The central observation is that the model optimized for local task completion despite explicit repository instructions. That makes the incident a microcosm of the agentic coding problem: LLMs can produce code that compiles and passes narrow tests while violating foundational architecture.

The file connects this directly to `[DESIGNED] → [BUILT] → [PROVEN]` gate discipline. Architectural contracts must become executable gates, not just prose.

## `0101_structural_write_scope_restriction_approaches.md`

This file lists early mitigation patterns:

- make architectural interface files read-only to agents;
- encode invariants as machine-checkable artifacts;
- classify blast radius before writes;
- use adversarial reviewer agents;
- recognize that prose instructions cannot enumerate all invariants.

Its most important point is that AGENTS-style prose is insufficient. If an invariant matters, it must be enforced by scaffolding, CI, permissions, generated tests, or another deterministic mechanism.

The file also names the honest ceiling: these are damage-reduction strategies, not a complete solution. The hard case is an agent producing a locally coherent change that violates a global constraint that was not mechanically represented.

## `0102_senior_engineer_intuition_versus_guardrails.md`

This file reframes the gap between guardrails and real engineering judgment. A senior engineer does not avoid the bad renderer change merely because a rule says not to. They avoid it because they carry a causal model of the stack.

That causal model includes:

- which constraints are load-bearing;
- which code paths are hot;
- which abstractions preserve portability;
- which repairs are disproportionate to the fault;
- when uncertainty should trigger a stop rather than a patch.

The file identifies a key weakness of current agents: strong local coherence but weak global model integrity. Agents can make changes that appear reasonable in the local file while corrupting system-level contracts.

## `0002_autonomous_agent_architecture_guardrails.md`

This file introduces **repair-shape classification**. The problem is not only whether a patch works. The problem is whether the shape of the repair matches the shape of the fault.

A local font-rendering bug should lead to a local repair: bounds checks, allocation fixes, metadata reuse, glyph atlas handling, or local shader logic. It should not trigger a backend ABI mutation or cross-backend binding topology change.

The file defines a hierarchy of repair shapes, from low-risk local logic corrections to high-risk ABI, topology, and portability mutations. The crucial claim is:

> A repair is not valid merely because it eliminates the observed failure. It is valid only if its blast radius is proportional to the demonstrated fault.

This becomes the basis for later semantic and control models.

## `0103_invariants_encoded_as_mechanical_tests.md`

This file pivots from “the LLM should understand invariants” to “the LLM should help author executable invariant tests.”

The enforcement path should not rely on runtime LLM judgment. Instead:

1. the model reads architecture docs and proposes invariant propositions;
2. those propositions become executable tests, static checks, or property tests;
3. CI enforces them mechanically;
4. mutation testing validates that the checks catch representative violations.

The file emphasizes property tests for ordering, capability, ACID, and HLC-style invariants. It also identifies invariant coverage as the remaining hard problem: how do we know the executable tests cover the invariants that matter?

## `0003_pivot_to_executable_semantic_models.md`

This file sharpens the previous point into the idea of **variance-bounded test harnesses**. Architectural “badness” is reframed as unauthorized variance along dimensions such as:

- binding topology;
- backend portability;
- shader ABI;
- hot-path cost;
- memory layout;
- repair scope;
- local instruction compliance;
- test coverage.

The file argues for an invariant registry where each invariant has scope, severity, deterministic checks, and required coverage. It introduces the important distinction between line coverage and **invariant coverage**: what matters is whether declared architecture properties are covered by executable checks.

It also introduces **invariant mutation coverage**: deliberately inject known-bad changes and prove that the invariant suite catches them.

## `0104_morphisms_and_structure_preserving_transformations.md`

This file names the mathematical structure underlying the argument: a valid patch is a **morphism**, a structure-preserving transformation.

A change is valid if it preserves the semantic structures that matter: behavior, effects, resources, performance, ordering, capability, portability, and observability. A change that breaks those structures is not merely a failing test; it is a non-morphism.

The file also states a boundedness requirement: a well-designed system should have an invariant hierarchy that grows tractably relative to problem size. If every feature creates unique invariants, autonomous verification becomes impossible.

## `0004_core_abstraction_beyond_conventional_docs.md`

This file argues that code, tests, docs, benchmarks, telemetry, and architecture are not separate artifacts. They should be projections of a shared underlying **Program Model**.

The key move is from free-text documentation to a global semantic object containing:

- stable identities;
- entities and relations;
- behaviors and effects;
- resource and performance envelopes;
- state spaces and failure modes;
- observability surfaces;
- test obligations;
- naming/identity schemes.

Source code becomes one projection. Tests become another. Runtime telemetry becomes another. Documentation becomes another. The purpose of the architecture is to keep these projections consistent.

## `0005_definition_autonomous_software_engineering_model.md`

This file names the central object as a **Program Semantic Graph** or **Executable Semantic Substrate**.

The graph includes:

- stable identities;
- typed entities and relations;
- invariant classes;
- projection contracts;
- test obligations;
- performance envelopes;
- capability boundaries;
- runtime observations;
- mutation and falsification corpora.

The file introduces the **Consistency Kernel** as the deterministic judge. The LLM may propose graph edits, code edits, tests, and explanations, but the kernel decides whether the projections remain consistent.

The deep claim is:

> Build a compiler whose source language is the architecture of the system, whose target languages are code, tests, benchmarks, telemetry, and docs, and whose type system is executable invariants over all projections.

## `0006_deep_extraction_of_system_center.md`

This file pushes deeper into formal semantics. It argues that the core is not just a semantic graph but **cost-refined compositional denotational semantics**.

A program component denotes:

```text
⟦P⟧ = Behavior × Effects × Resources × Cost × Observations
```

Later files expand this tuple to include capabilities and protocol ordering.

The key assertion is that performance is not an external measurement. It is part of the denotation of the program. A function or operation should be typed not only by input and output, but by behavior, effects, resources, cost, and observations.

This makes performance regressions architectural type errors when they violate declared resource or cost structure.

## `0105_performance_as_first_class_type.md`

This file restates the same idea in more direct engineering language: **performance is a first-class type**.

It connects the proposal to refinement types, quantitative type theory, effect systems, and resource-aware analysis. The point is not that Elixir, C++, or Rust already give this natively. The point is that the platform needs a specification-first semantic type layer above implementation.

The Codex renderer failure becomes a type error because the patch changes the resource profile of the binding architecture. It violates the declared type of the operation, not merely a benchmark threshold.

## `0106_universal_ontology_and_language_projections.md`

This file clarifies that the ontology should be universal, while projections are platform-specific.

The semantic tuple is architectural, not language-specific. Behavior, effects, resources, cost, and observability exist across C++, Elixir, Rust, shaders, Python, and other languages. What varies is how checks are emitted.

For the HypeHype renderer case, the semantic type might be `PortableBackendABI`, while projections include shader scans, cross-backend compilation, ABI snapshots, scale-factor tests, and mutation tests. For Elixir/OTP, projections would include ExUnit, StreamData, Credo, Dialyzer, Benchee, and telemetry assertions.

The important conclusion is: one ontology, many projection backends.

## `0107_repair_scope_as_agent_capability.md`

This file sharpens repair scope into a **typed agent capability bundle**.

A local repair agent should not merely be forbidden from editing certain files. It should have a semantic capability profile:

- it may read global architecture;
- it may modify local subsystem objects;
- it may not modify architecture kernels, ABI definitions, capability derivation rules, or global protocols.

This introduces the distinction between a type checker and a **type oracle**. The checker rejects invalid patches after the fact. The oracle answers before code generation:

> Given this intent and this capability bundle, what valid morphisms are available?

This is a major shift. The agent should generate inside the valid morphism space rather than generate freely and fail afterward.

## `0007_solving_codex_with_semantic_types.md`

This file applies the semantic-type framing directly to Sebastian Aaltonen’s renderer case.

It proposes semantic types such as:

- `PortableBackendABI`;
- `HotPathOperation`;
- `ShaderABI`;
- `FontRenderingRepair`.

The slot-30 patch fails all of them. It introduces a shader-visible bind group outside the portable ABI, changes hot-path resource shape, creates backend divergence, and violates local repair scope.

The practical version is not a grand dependent type system. It is an architecture type layer represented in YAML or another DSL, with generated checks for shader ABI, backend schema equivalence, backend limits, hot-path resource shape, benchmarks, and mutation tests.

## `0008_stronger_answer_for_agentic_coding.md`

This file consolidates several previous ideas into the category **Executable Architecture**:

> Architecture documents should compile into semantic types, capabilities, protocol constraints, performance envelopes, generated tests, generated benchmarks, mutation suites, and runtime observation contracts.

It also improves the model by adding:

- capability bundles as repair-scope control;
- type oracles as pre-generation guidance;
- bootstrap validation of semantic types;
- observation as cost-type calibration;
- protocol ordering/session types;
- cross-backend Common Binding IR for real renderer tooling.

This is one of the strongest “product framing” files in the directory. It identifies the thing being built as more than a linter, test generator, or AI reviewer. It is architecture that enforces itself.

## `0009_elixir_otp_executable_architecture_mvp.md`

This file summarizes a generated MVP docset for Elixir/OTP executable architecture. The nested docset itself is excluded from this README, but this top-level file is included because it sits directly in `./agentic_coding/`.

The MVP centers on four semantic types:

- `AgentCapabilityBundle`;
- `BoundaryProcess`;
- `SessionProtocol`;
- `HotPathOperation`.

The example target is a supervised `SessionPool`. The goal is to prove the loop:

```text
semantic type
→ type oracle query
→ generated tests/checks/benchmarks/telemetry
→ patch impact analysis
→ mutation harness
→ proof bundle
→ consistency-kernel verdict
→ runtime feedback
```

This file is the bridge from theory to a buildable Elixir/OTP vertical slice.

## `0010_next_hard_layer_of_model.md`

This file asks how to evaluate whether an AI-proposed architecture improvement is actually good.

The answer is an **Architectural Fitness Function**, represented as a vector rather than a single scalar score. Dimensions include:

- semantic cohesion;
- coupling control;
- compositionality;
- disposability;
- idiomaticity;
- explicitness;
- testability;
- observability;
- failure locality;
- performance preservation;
- migration cost;
- cognitive load.

The key rule is that architecture proposals should not be essays. They should be structured claim bundles containing semantic deltas, fitness deltas, proof obligations, deterministic checks, mutation tests, runtime observation plans, tradeoffs, and stop conditions.

This turns architecture review itself into an executable contract.

## `0011_annotations_are_insufficient_for_invariants.md`

This file rejects the idea that the solution is simply code annotations.

Annotations imply that source code is primary and metadata is attached. The desired inversion is:

```text
semantic structure is primary;
source code is one projection;
tests are another;
runtime observations are another;
documentation is another.
```

The file proposes a **Universal Program Semantic Graph** backed by multiple projections:

- canonical semantic fact store;
- property graph for traversal;
- Datalog/logic layer for inference;
- CST/AST/symbol/code-property projections;
- vector retrieval for discovery;
- e-graphs for rewrite/equivalence spaces;
- time-series observation store for runtime calibration.

It also introduces the **Semantic Source Map**, linking semantic objects to source anchors, code symbols, tests, mutations, runtime observations, specifications, and proof bundles.

## `0012_reality_check_on_architecture_scope.md`

This file is a necessary scope correction. It distinguishes the valuable core from the dangerous cathedral version.

The high-confidence pieces are:

- generated invariant tests;
- capability-scoped agents;
- mutation-tested invariant coverage;
- runtime observation for cost calibration;
- narrow semantic harnesses around known failure classes.

The lower-confidence pieces are:

- a fully automatic universal semantic graph;
- deterministic codegen replacing LLM coding broadly;
- a complete general-purpose software substrate.

The file gives the right MVP test:

> Given a known class of AI-bad patches, the semantic harness rejects them before review while still allowing good local fixes.

If the system catches real bad patches and does not become paperwork, it works. If not, kill it.

## `0013_main_point_of_executable_architecture.md`

This file corrects a major omission: before encoding invariants, we need to know whether a huge codebase has good architecture at all.

The key criterion is **predictive compression**:

> A good architecture is one where a bounded, compressed representation accurately predicts behavior, change impact, cost, ownership, failure, and dependency flow for the scenarios that matter.

A senior engineer’s “this is junk” judgment is reframed as detection of anti-compression. The system cannot be summarized without lying. Every meaningful change requires arbitrary code archaeology.

The file introduces:

- multiscale architectural capsules;
- scenario portfolios;
- historical change replay;
- prediction error;
- context residual;
- boundary seal tests;
- architectural surprise.

This is the front half that was missing. Invariants come after we discover which compressed models actually predict the system.

## `0014_missing_fundamental_object_from_future.md`

This file pushes one level deeper again. Predictive representations are not the final object. The final object is **controllability**.

Architecture is not primarily about what the system is. It is about what changes the system can survive.

The missing unit is the **intervention**:

```text
add feature
fix bug
replace backend
enforce policy
optimize hot path
remove subsystem
change protocol
migrate data
recover from failure
scale traffic
upgrade dependency
```

A good architecture has a friendly intervention surface: changes are local, safe, observable, reversible, and bounded. A bad architecture has a hostile intervention surface: local intent requires global edits, abstractions are fake control handles, prediction error is high, and corrections are not local or reversible.

This file introduces the **Intervention Graph** and **Control Oracle** as the deeper counterpart to the Semantic Graph and Type Oracle.

---

# The Cohesive Argument

The directory begins with a concrete AI coding failure: an agent attempted to fix a local renderer issue by mutating a global GPU binding architecture. The patch was not merely ugly. It was structurally wrong. It used the wrong control surface for the problem.

That incident exposes the core weakness of ordinary agentic coding:

```text
LLMs are good at local code synthesis.
They are weak at preserving global architecture under local pressure.
```

Initial mitigations such as read-only architectural files, AGENTS.md instructions, reviewer agents, and blast-radius classification help, but they are not enough. They are guardrails around a model that still does not possess the system’s architectural semantics.

The next move is to turn architectural judgment into executable checks. Invariants must not live only in prose. If “no shader-visible bind group outside the portable backend ABI” matters, it must become a machine-checkable fact. If “checkout requires a capability” matters, it must become a property test and mutation-killed invariant. If “this path is hot” matters, it must have a cost/resource type and benchmark projection.

But even that is incomplete. A pile of tests is not architecture. Tests, code, docs, benchmarks, and telemetry should all be projections of a shared semantic model. This leads to the Program Semantic Graph: a typed, versioned, executable representation of the software system, where source code is one projection among many.

The model then deepens into cost-refined denotational semantics. A program is not just behavior. It is behavior plus effects, capabilities, resources, cost, protocol ordering, and observations:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

A valid patch is a structure-preserving transformation over that denotation. An invalid patch is a non-morphism.

This gives us executable architecture: architecture documents compile into semantic types, capability bundles, protocol constraints, performance envelopes, generated tests, generated static checks, generated benchmarks, mutation suites, telemetry contracts, and proof bundles.

Then the argument turns to architecture evaluation itself. How do we know a huge codebase is good or junk before we know all the invariants? The answer is predictive compression. A good architecture admits bounded summaries that accurately predict behavior and change impact. A bad architecture does not. Every question requires loading the world.

Finally, the deepest object is identified: interventions. Software architecture is the geometry of possible change. The system is good if bounded agents can steer it through expected future interventions with bounded context, bounded blast radius, bounded cost, and observable/reversible outcomes.

So the final substrate is not just a semantic graph. It is:

```text
Semantic Graph
+ Architecture Capsule Graph
+ Historical Change Graph
+ Runtime Observation Graph
+ Intervention Graph
+ Control Oracle
+ Consistency Kernel
```

The point is not to make LLMs “smarter” in the abstract. The point is to place them inside a system where valid changes are queryable, invalid changes are mechanically rejected, architectural claims are mutation-tested, and the intervention surface of the codebase becomes visible.

---

# Core Concepts

## Architectural choke point

A load-bearing element whose mutation changes cross-system semantics. Examples include ABI layouts, capability derivation rules, protocol schemas, hot-path resource shapes, provider adapter contracts, and sandbox boundaries.

## Repair shape

The semantic category of a proposed fix. Local logic correction, schema change, ABI mutation, hot-path topology change, and portability abstraction change are different repair shapes with different risk profiles.

## Blast-radius proportionality

A patch should not use a global architectural mutation to solve a local symptom. The scope of the repair must be proportional to the demonstrated fault.

## Executable invariant

An architecture rule with scope, deterministic checks, projection obligations, and mutation tests. Without executable checks, an invariant is only prose.

## Invariant mutation coverage

A coverage metric that asks whether tests/checks kill representative known-bad mutations. This is more relevant to architecture safety than line coverage.

## Program Semantic Graph

A typed graph of software meaning: operations, effects, resources, capabilities, protocols, invariants, projections, observations, tests, benchmarks, mutations, proof bundles, and source anchors.

## Semantic Source Map

A bidirectional mapping between semantic objects and code symbols, source spans, generated tests, mutations, telemetry events, specs, and proof bundles.

## Cost-refined semantic type

A semantic type that includes not only input/output behavior but also resource shape, cost envelope, effects, capabilities, protocol ordering, and observation obligations.

## Type oracle

A proactive query system that tells an agent what valid morphisms exist for a given intent and capability bundle before code generation begins.

## Consistency kernel

The deterministic verifier that accepts or rejects patches based on semantic graph consistency, required projection completeness, invariant checks, mutation results, cost envelopes, telemetry contracts, and proof bundles.

## Architecture capsule

A bounded, multiscale summary of a system unit that predicts behavior, ownership, dependencies, failure modes, cost, tests, and likely change impact.

## Context residual

The extra context required beyond the expected architecture capsule set to answer a change question correctly. High context residual indicates abstraction leakage.

## Intervention graph

A graph of possible and historical changes: expected scope, actual scope, capabilities required, cost deltas, context required, rollback path, prediction error, and observed outcomes.

## Control oracle

A higher-level oracle that advises how to steer the system safely through an intervention, not merely whether a term typechecks.

---

# System Architecture Implied by the Directory

The implied system has several layers.

## 1. Fact extraction layer

Extracts source facts, symbol graphs, AST/CST anchors, call graphs, dependency graphs, test links, git history, runtime traces, and performance observations.

## 2. Semantic graph layer

Stores stable semantic objects and relations:

- operations;
- capabilities;
- effects;
- resources;
- protocols;
- cost envelopes;
- invariants;
- projections;
- mutations;
- observations;
- proof bundles;
- source anchors.

## 3. Architecture capsule layer

Builds bounded summaries at multiple scales:

```text
system → domain → component → module → operation → code span
```

Each capsule should be small enough to fit in bounded context and accurate enough to predict relevant changes.

## 4. Scenario and intervention layer

Defines representative future changes:

- add provider;
- replace storage;
- add capability checks;
- optimize checkout;
- migrate protocol;
- change session identity;
- remove subsystem;
- recover from worker crash.

It tracks expected scope, actual scope, context required, proof obligations, rollback path, and prediction error.

## 5. Projection engine

Generates enforcement artifacts from semantic types:

- ExUnit tests;
- StreamData properties;
- Credo/static checks;
- Dialyzer specs where useful;
- Benchee benchmarks;
- telemetry contract tests;
- mutation templates;
- proof bundle templates.

## 6. Oracle layer

Includes at least two oracles:

- **Type Oracle**: what valid morphisms exist under this semantic type and capability bundle?
- **Control Oracle**: what intervention path safely steers the system from current state to desired state?

## 7. Consistency kernel

Makes deterministic accept/reject decisions. It does not call an LLM for verdicts.

## 8. Runtime observer

Maps telemetry, benchmarks, traces, and anomalies back to semantic cost and observation types. It proposes refinements but does not auto-weaken contracts.

---

# Practical MVP Path

The directory repeatedly warns against building the cathedral first. The right MVP is narrow and evidence-driven.

## MVP target

Pick one vertical slice. For Elixir/OTP, the recommended slice is:

```text
SessionPool.checkout/checkin
```

Model it with four semantic types:

```text
AgentCapabilityBundle
BoundaryProcess
SessionProtocol
HotPathOperation
```

## MVP loop

Implement the smallest loop that proves value:

```text
semantic DSL/YAML
→ generated tests/checks/benchmarks/telemetry contracts
→ mutation runner
→ patch impact analyzer
→ proof bundle
→ deterministic verdict
```

## Known-bad patches the MVP must reject

- remove capability check;
- perform forbidden effect;
- spawn unsupervised process;
- skip telemetry event;
- break protocol ordering;
- allow unbounded mailbox growth;
- modify global capability rules from a local repair agent.

## Known-good patch it should allow

- bounded checkout timeout/retry refinement preserving capability, protocol, cost, and observation contracts.

## Success condition

The MVP works if it rejects representative AI-bad patches before human review while still allowing valid local fixes.

If it becomes paperwork or fails to catch real bad changes, it is not working.

---

# What This Directory Is Really About

This directory is not just about Codex, HypeHype, Elixir, OTP, GPU APIs, or tests.

It is about the missing substrate for autonomous software engineering.

Current agents operate over source code, prose instructions, and shallow test suites. That is insufficient for large systems because large-system correctness is architectural: locality, ownership, protocols, effects, cost, observability, capability, reversibility, and intervention control.

The core progression is:

```text
Bad AI patch
→ guardrails are insufficient
→ repair shape matters
→ invariants must be executable
→ tests are projections from semantic types
→ architecture must be a semantic graph
→ cost and performance are part of program meaning
→ agents need type oracles
→ codebases must be evaluated by predictive compression
→ architecture is ultimately controllability over interventions
```

The final thesis is:

> Autonomous coding becomes viable only when software architecture becomes an executable control system over change.

The LLM should not be trusted to infer every load-bearing constraint from prose. It should operate inside a substrate where architecture is typed, projected, tested, mutated, observed, versioned, and used to control interventions.

That is the through-line of `./agentic_coding/`.
