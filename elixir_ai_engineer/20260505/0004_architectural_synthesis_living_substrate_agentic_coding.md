# Architectural Synthesis: Yesterday’s Living Substrate + Today’s Agentic Coding Work

**Purpose:** Synthesize the earlier Elixir AI Engineer / Living Substrate architecture with today’s `agentic_coding/` materials into one coherent architectural direction.

**Source basis:** Yesterday’s docs (`elixir_ai_engineer_docset_v1`, `ElixirAIEngineer_*.md`, `living_substrate_architecture.md`) and today’s `README_agentic_coding.md` plus `agentic_coding/*.md`.

## Executive synthesis

Yesterday’s architecture established the substrate:

```text
SpecGraph + ImplementationGraph + EvidenceGraph + RuntimeGraph + LineageGraph
+ ENF normalizer
+ context bundles
+ bounded LM fill
+ adversarial evidence
+ living SpecCells
```

Today’s agentic-coding work supplies the missing theory of control:

```text
repair-shape classification
executable invariants
cost-refined semantic types
type oracles
capability-scoped repair
semantic source maps
architecture capsules
intervention graphs
control oracles
```

The synthesis is:

> The Elixir AI Engineer should be reframed as an **intervention-aware executable architecture substrate**. Its job is not merely to generate acceptable code from specs. Its job is to control the system’s future change surface: valid changes should be local, bounded, typed, observable, reversible, and mutation-tested; invalid changes should be unrepresentable or non-mergeable.

In one line:

```text
Living Substrate + Executable Architecture + Intervention Control
= governed software change under bounded AI operators.
```

## 1. What yesterday contributed

Yesterday’s docs defined the platform as a living engineering substrate rather than an agent:

- specifications are structured as SpecCells;
- code is extracted into an ImplementationGraph;
- tests/evidence accumulate in an EvidenceGraph;
- BEAM runtime facts accumulate in a RuntimeGraph;
- acceptance and rejection history accumulate in a LineageGraph;
- Elixir Engineering Normal Form rejects common AI/OTP slop;
- context bundles constrain LM work;
- normalizers compress bloated implementations;
- nogoods compile into rules, tests, and detectors.

The strongest yesterday insight was:

```text
The harness is the engineer.
The LM is one bounded operator inside it.
```

Yesterday’s architecture was already moving from “agent writes code” to “substrate accepts code.”

## 2. What today contributed

Today’s `agentic_coding/` directory starts from the Codex/HypeHype-style failure: a local repair mutates a global architecture contract. From there it adds several missing primitives.

### Repair shape

A patch is not valid merely because it fixes the immediate symptom. Its repair shape must match the fault shape.

```text
Local font/OOM bug -> local font/glyph/bounds/resource repair.
Not -> global renderer binding topology mutation.
```

For Elixir:

```text
Local checkout timeout -> local timeout/retry/policy repair.
Not -> global capability-kernel rewrite.
```

### Executable invariants

Architecture prose is insufficient. Invariants need scope, checks, projections, and mutants.

```text
invariant = statement + scope + deterministic checks + mutation tests + projection obligations
```

### Cost-refined semantic types

A component’s meaning includes behavior, effects, capabilities, resources, cost, protocol, and observations:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

Performance and resource shape are not after-the-fact metrics. They are part of what the component is.

### Type oracle and control oracle

A checker says whether a patch failed. An oracle tells a bounded operator what valid moves exist before editing.

```text
TypeOracle(intent, capability, semantic_type) -> valid morphism space
ControlOracle(intervention, current_system) -> safe steering path
```

### Architecture quality as predictive compression

A huge codebase is architecturally healthy if bounded capsules can predict behavior, ownership, cost, failure, and change impact.

A bad architecture forces every question to load the world.

### Architecture as controllability

The deepest new turn is that architecture is not only representation. It is the shape of the intervention surface.

Good architecture makes desired interventions:

- local;
- bounded in context;
- bounded in blast radius;
- observable;
- reversible or compensatable;
- cheap to verify;
- hard to perform incorrectly.

## 3. Unified thesis

The combined architecture should be stated as:

> The Elixir AI Engineer is a living, intervention-aware executable architecture substrate. It represents specifications, implementation, evidence, runtime observations, lineage, and interventions in shared semantic graphs; gives bounded operators queryable valid-move spaces; accepts only code/interventions that preserve semantic types and evidence obligations; and evolves its own rules, normalizers, and policies from failures.

This reframes the output from “accepted code” to “accepted intervention.”

```text
AcceptedCode is downstream of AcceptedIntervention.
```

A patch should be accepted only when the intended intervention was authorized, local, typed, evidence-backed, and within the expected control surface.

## 4. The new central object: intervention

Yesterday’s central unit was the SpecCell. Today adds the intervention as the dynamic unit of change.

A SpecCell says:

```text
What does this part of the system mean and own?
```

An intervention says:

```text
How may this system be safely changed?
```

An intervention should be first-class:

```yaml
intervention:
  id: session_pool.add_checkout_timeout
  intent: bound checkout wait time under worker contention
  expected_scope:
    - session_pool.operation.checkout
    - session_pool.worker_selection_policy
  forbidden_scope:
    - capability.kernel
    - credential.materializer
    - global_session_protocol
  capability_required:
    - Modify(session_pool.checkout)
  context_budget:
    max_capsules: 3
  proof_obligations:
    - checkout_timeout_property
    - unauthorized_checkout_still_denied
    - checkout_telemetry_contract
    - checkout_p95_benchmark
  rollback:
    - disable timeout policy via declared config
```

This object connects specs, code, tests, context, authority, and future change.

## 5. Revised graph architecture

Yesterday had five living graphs. Today suggests adding three more views.

### Existing graphs

```text
SpecGraph
ImplementationGraph
EvidenceGraph
RuntimeGraph
LineageGraph
CostGraph / PolicyGraph where applicable
```

### New graph views

```text
SemanticTypeGraph
ArchitectureCapsuleGraph
InterventionGraph
```

### Unified graph substrate

```text
LivingGraphSubstrate =
  SpecGraph
  + ImplementationGraph
  + EvidenceGraph
  + RuntimeGraph
  + LineageGraph
  + SemanticTypeGraph
  + ArchitectureCapsuleGraph
  + InterventionGraph
  + Policy/Cost Graphs
```

The system should not necessarily implement these as separate databases. They are separate semantic views over shared facts.

## 6. Mapping yesterday concepts to today concepts

| Yesterday concept | Today’s addition | Synthesized meaning |
|---|---|---|
| SpecCell | Semantic type | A SpecCell should compile into semantic types with behavior/effect/resource/cost/protocol/observation fields. |
| Context Bundle | Type/control query packet | A context bundle becomes the operator’s control packet: task, capability, allowed moves, forbidden deltas, proof obligations. |
| ENF | Cost-refined type policy | ENF becomes a stable normal-form policy plus cost/resource type layer. |
| AccessGraph | Capability bundle | Repair scope, credential use, code mutation, and tool execution all use read/modify/execute/delegate edges. |
| EvidenceGraph | Invariant/mutation coverage | Evidence must include mutation-killed invariants, not just passing examples. |
| RuntimeGraph | Cost calibration | Runtime observations calibrate cost/resource/observation types. |
| LineageGraph | Judgment/intervention traces | Lineage stores rejected designs, accepted morphisms, intervention predictions, and actual outcomes. |
| Adversary | Mutation/intervention attacker | The adversary attacks semantic types, architecture claims, and intervention scope. |
| Normalizer | Rewrite/extraction optimizer | Normalization should preserve semantic type inhabitance while reducing engineering cost. |
| Architecture tournament | Fitness/intervention evaluation | Alternatives should be scored by future-change controllability, not only immediate design elegance. |

## 7. Acceptance predicate after synthesis

Yesterday’s acceptance predicate was mostly code-centered. The synthesized predicate should be intervention-centered.

```text
accept(intervention I, patch Δ) =
  authorized(I)
  ∧ matches_declared_intent(I, Δ)
  ∧ preserves_required_semantic_types(Δ)
  ∧ respects_capability_bundle(Δ)
  ∧ repair_scope_proportional_to_fault(Δ)
  ∧ context_within_budget(I)
  ∧ invariant_checks_pass(Δ)
  ∧ implicated_mutants_killed(Δ)
  ∧ cost_envelopes_satisfied(Δ)
  ∧ telemetry_contracts_satisfied(Δ)
  ∧ rollback_or_compensation_declared(I)
  ∧ proof_bundle_complete(Δ)
```

This is the formal bridge between the living substrate and the agentic-coding work.

## 8. Reframing ENF

ENF should become a stable but typed policy system.

Yesterday’s ENF says:

```text
Do not accept unjustified Elixir/OTP mechanism.
```

Today’s semantic model says:

```text
Do not accept a term that fails to inhabit its behavior/effect/resource/cost/protocol/observation type.
```

Synthesized ENF:

```text
Elixir Engineering Normal Form is the BEAM/OTP projection of the project’s semantic type system and intervention-control policy.
```

Concrete implication:

- “No unjustified GenServer” becomes a resource/lifecycle type rule.
- “No behavior with one implementation” becomes a disposability/composability budget rule.
- “No undeclared effect” becomes an effect/capability type rule.
- “No public function without contract” becomes a projection-completeness rule.
- “No raw secret in logs” becomes a credentialed-effect invariant with mutation tests.

## 9. Reframing context bundles

Yesterday’s context bundle was already a major insight. Today clarifies that a context bundle is not just context. It is a control object.

A synthesized bundle should include:

```yaml
bundle:
  intervention_id: session_pool.add_checkout_timeout
  spec_cell: session_pool.operation.checkout
  semantic_types:
    - CapabilityCheckedOperation
    - SessionProtocol
    - HotPathOperation
  capability_bundle:
    read:
      - session_pool.*
      - capability.kernel.summary
    modify:
      - session_pool.checkout
      - session_pool.worker_selection_policy
    forbidden_modify:
      - capability.kernel
      - credential.fabric
      - session.identity_format
  valid_morphisms:
    - local_timeout_guard
    - bounded_retry
    - telemetry_preserving_error_path
  forbidden_deltas:
    - remove_capability_check
    - unsupervised_spawn
    - global_protocol_change
  proof_obligations:
    - generated_tests
    - mutation_suite
    - telemetry_contract
    - benchmark
```

The operator should not receive merely “relevant context.” It should receive a bounded valid-move space.

## 10. Reframing the adversary

Yesterday’s adversary challenged invariants. Today expands its job:

- mutate semantic types;
- attack architecture claims;
- inject known-bad patches;
- test repair-scope proportionality;
- probe intervention distance;
- measure context residual;
- test boundary substitution;
- replay historical changes;
- challenge rollback/observability claims.

The adversary should answer:

```text
Does this architecture make invalid interventions hard and valid interventions easy?
```

## 11. Reframing LineageGraph as the training-grade asset

Yesterday called judgment traces the product. Today strengthens that.

The LineageGraph should store not only code-generation traces, but intervention outcomes:

```text
intended intervention
expected scope
actual scope
expected context
actual context
expected proof obligations
actual proof obligations
prediction error
normalizer effects
mutants killed/survived
runtime anomalies
accepted/rejected verdict
```

This becomes the dataset for improving engineering judgment.

GitHub shows final code. The substrate shows why other code was rejected.

## 12. Architecture capsules and context residual

The living substrate should create multiscale architecture capsules:

```text
system -> domain -> component -> module -> operation -> code anchor
```

A capsule is a compact predictive summary:

- purpose;
- public surface;
- owned state;
- effects;
- dependencies;
- protocols;
- cost model;
- failure model;
- tests;
- likely change scenarios.

The useful metric is **context residual**:

```text
extra context needed beyond the expected capsules to perform the intervention correctly
```

High context residual means the abstraction leaks. This directly operationalizes the reviewer concern that large systems cannot fit in a context window.

## 13. The combined MVP path

The combined docset contains two candidate MVP slices:

1. **SessionPool checkout/checkin** from the executable-architecture MVP.
2. **Governed credentialed connector invocation** from the Elixir AI Engineer proof slice.

The synthesis should use them in sequence:

### Phase A - Small control fixture: `SessionPool.checkout`

Purpose: prove semantic types, capability bundles, generated tests, mutation harness, telemetry contracts, and proof bundles on a small OTP boundary.

Known-bad mutations:

- remove capability check;
- remove telemetry stop event;
- spawn unsupervised worker;
- break protocol order;
- allow unbounded mailbox growth.

### Phase B - Strategic proof slice: governed credentialed connector invocation

Purpose: prove the same machinery on the real security/governance domain.

Known-bad mutations:

- agent receives raw credential;
- wrong connector redeems lease;
- revoked lease redeems;
- missing AccessGraph edge passes;
- provider call emits no audit;
- secret appears in telemetry/log/crash output.

This avoids building the cathedral before proving the first loop.

## 14. New commands to add to yesterday’s CLI

Yesterday’s first commands were:

```bash
mix spec.audit
mix spec.bundle <cell>
mix spec.accept
mix spec.trace
```

Today suggests adding:

```bash
mix spec.types.validate
mix spec.oracle <intervention_or_cell>
mix spec.mutate --impacted
mix spec.proof --patch <id>
mix spec.capsule <object>
mix spec.intervention.plan <scenario>
mix spec.intervention.replay <commit_or_scenario>
```

The first new command should probably be:

```bash
mix spec.mutate --impacted
```

because mutation proves that rules are not just prose.

## 15. Revised build order

A practical build order:

1. **Audit-first extraction:** existing five ENF/slop detectors.
2. **Capability bundle schema:** read/modify/execute/delegate over semantic objects.
3. **Generated proof obligations:** tests, telemetry checks, static checks.
4. **Mutation harness:** prove checks catch known-bad changes.
5. **Type/Control oracle:** query valid moves before bounded LM fill.
6. **Architecture capsules:** generate bounded summaries for context.
7. **Intervention graph:** track expected vs actual scope/context/cost.
8. **Runtime calibration:** feed telemetry and benchmark anomalies back into semantic types.

Do not start with the universal semantic database. Start with one vertical slice and let facts accumulate.

## 16. The main architectural risks

### Risk 1: The ontology becomes larger than the code

Mitigation: only model load-bearing facts that generate checks, mutations, context reductions, or acceptance decisions.

### Risk 2: Semantic facts rot

Mitigation: reverse extraction, projection freshness checks, graph hashes, and drift classification.

### Risk 3: LLM-generated types become confidently wrong

Mitigation: semantic types must be bootstrap-validated with known-good/known-bad examples and mutation suites.

### Risk 4: Benchmarks become noisy bureaucracy

Mitigation: separate static resource-shape checks from empirical calibration; require benchmarks only for hot paths or changed cost types.

### Risk 5: Agents game generated tests

Mitigation: mutation testing, adversarial counterexamples, proof bundles, and non-LLM consistency kernel.

### Risk 6: The tool is too hard to use

Mitigation: start with four commands and a visible slop/proof report. Internal graph richness must not leak into daily ergonomics.

## 17. What to change in the top-level architecture doc

Add a new section after the graph substrate section:

```text
InterventionGraph and Control Oracle
```

Define:

- intervention;
- expected scope;
- actual scope;
- capability required;
- context budget;
- proof obligations;
- rollback path;
- prediction error;
- intervention distance.

Add a new acceptance rule:

```text
No patch is accepted until the intended intervention and its proof bundle are explicit.
```

Add a new explanation:

```text
Architecture quality is the quality of the future change surface.
```

## 18. Final synthesized architecture

The final architecture is:

```text
Spec compiler
+ semantic type layer
+ implementation graph extractor
+ BEAM runtime observer
+ Engineering Normal Form normalizer
+ capability/access graph
+ credentialed effect fabric
+ invariant/mutation harness
+ architecture capsule builder
+ intervention graph
+ type/control oracle
+ consistency kernel
+ lineage/judgment trace store
+ harness evolution engine
```

The LM remains bounded:

```text
LM proposes.
Skills operate.
Oracles bound the move space.
Graphs store engineering truth.
Checks and mutants falsify.
Normalizer compresses.
Kernel accepts or rejects.
Runtime calibrates.
Lineage teaches the harness.
```

## Bottom line

Yesterday’s work built the living substrate for accepted code. Today’s work explains how that substrate should control agentic change.

The combined thesis is:

> AI software engineering becomes viable when architecture is a living, executable, intervention-aware control system. The system should not merely know what code exists. It should know what changes are valid, who may perform them, what they should touch, what they must preserve, what evidence proves them, and how failures update the substrate.

That is the synthesis between yesterday and today.
