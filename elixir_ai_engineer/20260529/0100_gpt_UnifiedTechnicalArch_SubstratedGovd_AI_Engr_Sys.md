# Unified Technical Architecture for a Substrate-Governed AI Engineering System

## 0. Purpose

This document defines the common base architecture for an AI engineering system capable of supporting both:

1. **Elixir/OTP systems**, where source code describes concurrent runtime topology over the BEAM; and
2. **Verilog/FPGA systems**, where source code describes concurrent physical hardware topology over configurable silicon.

The goal is not to build two unrelated code-generation tools. The goal is to build one generalized substrate for **topology-constrained, evidence-governed engineering**, then specialize it through target adapters.

The shared system treats language models as bounded proposal engines. It does not rely on the model’s confidence, style, or apparent reasoning. It accepts artifacts only after they are projected into structural graphs, checked against declared constraints, executed or lowered into their target environment, and validated through evidence.

The common base system is therefore:

```text
Intent
  → SpecGraph
  → Context Bundle
  → Architecture Pattern Selection
  → Deterministic Skeleton
  → Bounded LM Fill
  → Candidate Artifact
  → Target Graph Extraction
  → Evidence Harness
  → Cost / Constraint / Topology Audit
  → Nogood Compilation
  → Accepted Artifact or Repair Loop
```

The Elixir and Verilog systems are target-specific instantiations of this same control architecture.

---

## 1. Core Thesis

Highly concurrent, resource-constrained engineering is not primarily a text-generation problem.

It is a **topological control problem**.

In sequential software, source code can often be treated as an ordered procedure. In Elixir/OTP and Verilog/FPGA, source code is better understood as a serialized description of a concurrent architecture.

In Elixir:

```text
modules, functions, GenServers, supervisors, registries, messages
```

lower into:

```text
BEAM processes, mailboxes, supervision trees, scheduler behavior,
state ownership, failure propagation, runtime effects, telemetry
```

In Verilog:

```text
modules, always blocks, assigns, FSMs, wires, registers
```

lower into:

```text
LUTs, flip-flops, BRAMs, DSP blocks, clock trees, reset trees,
routing paths, timing paths, physical placement, resource budgets
```

The shared architecture must therefore operate over **meaningful engineering topology**, not just source text.

The AI Engineer is not:

```text
a chatbot that writes Elixir
a chatbot that writes Verilog
a bigger autocomplete model
a swarm of unconstrained coding agents
```

It is:

```text
a governed control system that transforms intent into executable architecture
under explicit constraints, evidence gates, and repair rules.
```

---

## 2. Shared Design Principles

### 2.1 Topology Over Text

The source file is not the primary object of reasoning.

The system must project source into structured representations:

```text
Elixir source  → ImplementationGraph / RuntimeGraph / CapabilityGraph
Verilog source → RTLGraph / NetlistGraph / TimingGraph / ResourceGraph
```

Text is the editable surface. The graph is the reasoning surface.

### 2.2 Environment as Physics Engine

The model does not get to judge whether its artifact is valid.

The target environment provides truth.

For Elixir, the physics engine is:

```text
Elixir compiler
Mix
ExUnit
StreamData
Dialyzer-like analysis
runtime telemetry
fault injection
supervision traces
load tests
mailbox/process metrics
capability/security checks
```

For Verilog, the physics engine is:

```text
Verilog/SystemVerilog parser
lint
simulation
formal verification
synthesis
place-and-route
static timing analysis
CDC checks
reset-domain checks
resource reports
routing/congestion reports
```

The model proposes. The environment measures.

### 2.3 Cost and Resources as Types

Correctness is not only functional correctness.

An artifact is invalid if it violates its declared cost envelope.

For Elixir:

```text
process budget
mailbox depth
scheduler pressure
latency envelope
memory growth
supervision complexity
public API surface
capability exposure
effect surface
```

For Verilog:

```text
LUT budget
FF budget
BRAM budget
DSP budget
clock frequency
timing slack
routing congestion
latency budget
CDC safety
reset safety
```

The base system treats these as **semantic cost types**.

A change can be rejected as a type error because it exceeds a budget, even if its tests pass.

### 2.4 Blast-Radius Proportionality

A local repair must remain local unless it escalates.

The system must prevent an AI operator from solving a local failure by mutating global architecture.

Examples:

```text
Elixir:
  A local timeout fix must not redesign the credential capability kernel.

Verilog:
  A local timing fix must not alter the global bus protocol or clocking scheme.
```

Every proposal runs under a typed capability profile:

```text
allowed files
allowed graph nodes
allowed interfaces
allowed cost deltas
allowed topology changes
forbidden mutations
required evidence
escalation conditions
```

### 2.5 Failure as Constraint Compilation

A failed attempt is not just a failed prompt.

It becomes substrate material.

A failure can compile into:

```text
new static rule
new property test
new forbidden pattern
new graph query
new skeleton constraint
new SpecCell
new benchmark case
new cost weight
new repair policy
new expert review checklist
new training trajectory
```

The harness improves by making repeated classes of failure unmergeable.

---

## 3. Top-Level Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│ Human / External Intent                                        │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Spec Plane                                                     │
│ - SpecGraph                                                    │
│ - SpecCells                                                    │
│ - contracts                                                    │
│ - invariants                                                   │
│ - resource budgets                                             │
│ - topology requirements                                        │
│ - acceptance obligations                                       │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Context + Planning Plane                                       │
│ - ContextBundle compiler                                       │
│ - architecture pattern selection                               │
│ - capability-scoped task definition                            │
│ - allowed/forbidden action set                                 │
│ - target-specific lowering hints                               │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Synthesis Plane                                                │
│ - deterministic skeleton generator                             │
│ - bounded LM fill                                              │
│ - patch proposal                                               │
│ - predicted graph delta                                        │
│ - predicted evidence impact                                    │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Projection Plane                                               │
│ - source parser                                                │
│ - target graph extractor                                       │
│ - source-to-graph anchors                                      │
│ - semantic facts                                               │
│ - topology diff                                                │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Evidence Plane                                                 │
│ - compile / simulate / synthesize / execute                    │
│ - unit / property / formal / fault tests                       │
│ - runtime or physical feedback                                 │
│ - cost/resource measurements                                   │
│ - trust/evidence records                                       │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│ Governance Plane                                               │
│ - policy checks                                                │
│ - topology checks                                              │
│ - cost-type checks                                             │
│ - blast-radius checks                                          │
│ - acceptance gates                                             │
│ - escalation rules                                             │
└───────────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
┌───────────────────────────┐   ┌──────────────────────────────┐
│ Accepted Artifact          │   │ Rejection / Repair            │
│ - proof bundle             │   │ - failure classification       │
│ - lineage record           │   │ - nogood compilation           │
│ - benchmark record         │   │ - refined context bundle       │
└───────────────────────────┘   └──────────────────────────────┘
```

---

## 4. The Living Substrate

The center of the system is not the LLM.

The center is the **Living Engineering Substrate**.

The substrate stores load-bearing engineering knowledge as typed, evidence-backed graph facts.

It must unify:

```text
requirements
design decisions
architecture patterns
contracts
invariants
cost budgets
source code
graph projections
runtime evidence
physical evidence
tests
failures
repairs
acceptance decisions
human reviews
tool outputs
model attempts
policy updates
lineage records
```

These are not disconnected logs. They are cross-linked artifacts.

---

## 5. Core Graphs

The base system uses a graph family. Target adapters extend these graphs with domain-specific nodes and edges.

### 5.1 SpecGraph

Represents what should exist.

Contains:

```text
requirements
interfaces
protocols
contracts
invariants
resource budgets
failure semantics
security/capability constraints
observability obligations
acceptance gates
```

Primary entity:

```yaml
SpecCell:
  id: string
  kind: requirement | interface | invariant | budget | failure_semantics |
        topology_constraint | security_constraint | acceptance_gate
  purpose: string
  scope: local | subsystem | global
  target: abstract | elixir | verilog | both
  formal_shape: object
  required_evidence: list
  forbidden_shapes: list
  allowed_patterns: list
  cost_budget: object
  escalation_policy: object
```

### 5.2 ArchitectureGraph

Represents the intended structural design.

Contains:

```text
selected patterns
component boundaries
allowed topology
state ownership
effect ownership
clock/process/domain ownership
protocol choices
interface contracts
resource allocation assumptions
```

This graph sits between the abstract spec and the concrete implementation.

### 5.3 ImplementationGraph

Represents what the current artifact actually implements.

For Elixir, this includes:

```text
modules
functions
clauses
GenServers
Supervisors
Tasks
Registries
message flows
state ownership
public APIs
effects
capability edges
telemetry
tests
```

For Verilog, this includes:

```text
modules
ports
signals
registers
combinational blocks
FSMs
clock domains
reset domains
memories
DSP usage
handshake protocols
CDC transitions
testbenches
assertions
```

### 5.4 EvidenceGraph

Represents what has been observed or proven.

Contains:

```text
compile results
test results
simulation traces
property-test results
formal results
synthesis results
timing results
resource utilization
runtime telemetry
fault traces
security findings
human review findings
```

Evidence must be scoped and reproducible.

### 5.5 CostGraph

Represents cost and resource behavior.

For Elixir:

```text
latency
memory
process count
mailbox growth
scheduler pressure
API surface
module count
dependency count
effect surface
security exposure
```

For Verilog:

```text
LUTs
FFs
BRAMs
DSPs
clock frequency
timing slack
routing congestion
pipeline latency
fanout
logic depth
```

### 5.6 PolicyGraph

Represents executable constraints.

Contains:

```text
static rules
graph queries
forbidden patterns
allowed patterns
required test obligations
resource gates
security gates
topology gates
review gates
escalation gates
```

### 5.7 LineageGraph

Represents why the system changed.

Contains:

```text
input intent
SpecCell versions
context bundle versions
model calls
tool runs
patches
failures
repairs
review decisions
accepted proof bundles
policy updates
benchmark records
```

Lineage is critical because the system must remember not merely what exists, but why it was accepted.

### 5.8 NogoodGraph

Represents learned failure constraints.

Contains:

```text
failure pattern
cause classification
detector
repair pattern
future prevention rule
training case
benchmark case
promotion status
```

A nogood is not just a note. It is a candidate future gate.

---

## 6. Core Artifact Model

Every substrate object should be representable as an artifact with typed links.

```yaml
Artifact:
  artifact_id: uuid
  kind: spec_cell | source_span | graph_node | graph_edge | evidence |
        policy | test | model_run | tool_run | patch | review |
        nogood | proof_bundle | lineage_record
  target: common | elixir | verilog
  abstraction_level: intent | architecture | implementation |
                     evidence | policy | lineage
  content_hash: string
  body: object
  created_at: timestamp
  supersedes: artifact_id?
```

Typed links:

```yaml
ArtifactLink:
  source_id: uuid
  target_id: uuid
  link_kind:
    - realizes
    - refines
    - contradicts
    - supports
    - weakens
    - tests
    - constrains
    - violates
    - repairs
    - supersedes
    - derived_from
    - accepted_by
    - rejected_by
  confidence: float
  provenance: static | tool | model | human | runtime | physical
```

This gives the base system a continuous abstraction gradient:

```text
intent → architecture → implementation → evidence → policy → lineage
```

---

## 7. Three Nested Feedback Loops

The system operates at three timescales.

### 7.1 Inner Loop: Candidate Synthesis

Purpose:

```text
produce and repair local candidates
```

Flow:

```text
SpecCell + ContextBundle
  → deterministic skeleton
  → bounded LM fill
  → candidate patch
  → static scope check
  → candidate artifact
```

This loop should be fast. It does not decide acceptance.

### 7.2 Middle Loop: Normalization and Evidence

Purpose:

```text
measure, normalize, compress, and validate candidates
```

Flow:

```text
candidate artifact
  → graph extraction
  → spec alignment
  → evidence runner
  → cost model
  → topology audit
  → policy audit
  → accepted artifact or repair request
```

This loop decides whether the candidate is structurally credible.

### 7.3 Outer Loop: Harness Evolution

Purpose:

```text
convert failures into future constraints
```

Flow:

```text
failure / rejection / review finding
  → classify failure
  → create nogood
  → decide promotion path
  → generate detector or test or skeleton rule
  → update policy graph
  → update benchmark corpus
```

This loop is how the system improves even if the underlying model does not.

---

## 8. Bounded LM Proposal Engine

The language model is not allowed to act as an unconstrained engineer.

It receives a narrow context bundle.

```yaml
ContextBundle:
  task_id: string
  target: elixir | verilog | common
  task_kind:
    - implement_pattern_slot
    - repair_violation
    - generate_test
    - explain_failure
    - propose_architecture_alternative
    - compress_candidate
  allowed_artifacts: list
  forbidden_artifacts: list
  allowed_actions: list
  forbidden_actions: list
  required_patterns: list
  forbidden_patterns: list
  relevant_spec_cells: list
  relevant_policies: list
  current_graph_slice: object
  current_evidence: object
  current_nogoods: list
  expected_output_schema: object
```

The model must output structured proposals:

```yaml
Proposal:
  patch: object
  rationale: string
  predicted_graph_delta: object
  expected_evidence_impact: object
  declared_risks: list
  required_tests: list
  assumptions: list
```

The system must reject unscoped, unstructured, or authority-expanding proposals before tool execution.

---

## 9. Pattern Catalog

The system should not make the model invent architecture from scratch.

It should expose a pattern catalog.

### 9.1 Common Pattern Schema

```yaml
ArchitecturePattern:
  id: string
  target: common | elixir | verilog
  name: string
  intent: string
  when_to_use: list
  when_not_to_use: list
  required_topology: object
  required_interfaces: object
  required_state_boundaries: object
  required_failure_semantics: object
  required_evidence: list
  cost_model: object
  common_failure_modes: list
  forbidden_variants: list
  skeleton_generator: reference
  graph_validator: reference
```

### 9.2 Elixir Pattern Examples

```text
pure module
functional core + GenServer shell
DynamicSupervisor + Registry
Task.Supervisor worker pool
finite-state process
persistent process with snapshot/replay
telemetry-wrapped service boundary
capability-gated connector boundary
```

### 9.3 Verilog Pattern Examples

```text
combinational block
registered pipeline
FSM controller
valid/ready streaming stage
sync FIFO
async FIFO
BRAM-backed buffer
DSP pipeline
AXI-lite register bank
AXI-stream transform
CDC synchronizer
reset controller
```

The first version of the common system should support the pattern catalog generically, then allow target adapters to register patterns.

---

## 10. Target Adapter Interface

The common base system must define a target adapter contract.

```yaml
TargetAdapter:
  id: elixir | verilog
  source_extensions: list
  parse(source): ParseArtifact
  extract_graph(parse_artifact): TargetGraph
  generate_skeleton(spec_cell, pattern): SourcePatch
  run_evidence(candidate): EvidenceBundle
  evaluate_policy(graph, evidence, policies): PolicyResult
  extract_costs(graph, evidence): CostBundle
  classify_failure(evidence, graph): FailureClass
  propose_repair_context(failure): ContextBundle
```

Both Elixir and Verilog plug into this same interface.

---

## 11. Elixir Adapter

### 11.1 Elixir Target Graphs

The Elixir adapter projects source into:

```text
ElixirImplementationGraph
ElixirRuntimeGraph
ElixirCapabilityGraph
ElixirEffectGraph
ElixirTestGraph
```

Important nodes:

```text
Module
Function
FunctionClause
Behaviour
Callback
GenServer
Supervisor
DynamicSupervisor
Task
Registry
ETS Table
Message
StateShape
EffectBoundary
Capability
TelemetryEvent
TestCase
PropertyTest
```

Important edges:

```text
defines
calls
sends_message
receives_message
supervises
owns_state
reads_state
writes_state
performs_effect
requires_capability
emits_telemetry
tested_by
violates_policy
```

### 11.2 Elixir Physics Harness

The Elixir evidence harness should run:

```text
mix compile
mix format --check-formatted
unit tests
property tests
fault tests
supervision crash tests
mailbox/backpressure tests
security/capability tests
telemetry checks
static topology checks
ENF checks
compression challenge
```

### 11.3 Elixir Core Policies

Examples:

```text
No business logic inside GenServer callbacks.
No process without lifecycle justification.
No unsupervised process creation.
No hidden side effects in pure core.
No raw credential exposure across capability boundary.
No ambient authority.
No public API expansion without SpecCell.
No duplicated abstraction without compression review.
Every state-holding process must declare ownership and crash behavior.
Every external effect must pass through an effect boundary.
```

### 11.4 Elixir Acceptance

An Elixir candidate is accepted only if:

```text
it compiles
tests pass
properties pass
declared runtime topology matches ImplementationGraph
capability edges are legal
side effects are declared
ENF passes
compression challenge passes
required telemetry exists
lineage and evidence records are emitted
```

---

## 12. Verilog Adapter

### 12.1 Verilog Target Graphs

The Verilog adapter projects source into:

```text
RTLGraph
ModuleHierarchyGraph
SignalGraph
ClockDomainGraph
ResetDomainGraph
FSMGraph
PipelineGraph
CDCGraph
NetlistGraph
TimingGraph
ResourceGraph
VerificationGraph
```

Important nodes:

```text
Module
Port
Signal
Register
Wire
AlwaysBlock
Assign
FSM
State
ClockDomain
ResetDomain
Memory
BRAM
DSP
FIFO
HandshakeInterface
TimingPath
ResourceUse
Assertion
Testbench
```

Important edges:

```text
drives
samples
combinational_depends_on
registered_depends_on
belongs_to_clock_domain
belongs_to_reset_domain
crosses_clock_domain
implements_protocol
uses_resource
tested_by
constrained_by
violates_timing
violates_cdc
```

### 12.2 Verilog Physics Harness

The Verilog evidence harness should run:

```text
syntax parse
lint
elaboration
simulation
self-checking testbenches
randomized simulation where applicable
formal verification where applicable
synthesis
resource extraction
place-and-route
static timing analysis
CDC checks
reset-domain checks
constraint coverage checks
```

### 12.3 Verilog Core Policies

Examples:

```text
No inferred latch unless explicitly allowed.
No unconstrained clock.
No unsafe CDC.
No multi-bit CDC without protocol.
No unregistered long output path where timing budget forbids it.
No async reset ambiguity.
No vendor primitive unless allowed by SpecCell.
No timing failure accepted.
No resource-budget violation accepted.
No protocol interface without protocol checker.
No testbench-only correctness accepted without synthesis evidence.
```

### 12.4 Verilog Acceptance

A Verilog candidate is accepted only if:

```text
it parses
lints cleanly or has approved waivers
simulation passes
formal obligations pass where required
synthesis passes
P&R passes where required
STA passes for declared clocks
CDC/reset checks pass
resource budgets hold
latency budgets hold
required assertions/testbenches exist
lineage and evidence records are emitted
```

---

## 13. Shared Epistemic Model

The substrate must distinguish belief states.

A claim is not simply true or false.

```yaml
BeliefState:
  state:
    - verified
    - observed
    - inferred
    - assumed
    - contested
    - drifted
    - stale
    - refuted
    - unimplemented
    - unverified
  evidence: list
  confidence: float
  scope: object
  freshness: timestamp
  contradiction_links: list
```

Examples:

```text
Verified:
  This Verilog module passes simulation and STA for target device X.

Observed:
  This Elixir process mailbox exceeded threshold during load test.

Inferred:
  This timing path likely fails due to wide mux logic depth.

Assumed:
  This GenServer is expected to own this state.

Drifted:
  The code no longer matches the architecture commitment.

Refuted:
  The implementation does not satisfy the SpecCell.
```

The system must never collapse model inference, tool evidence, human judgment, and runtime observation into the same truth category.

---

## 14. Acceptance Gate

A candidate artifact is accepted only if all required gates pass.

General acceptance rule:

```text
1. It satisfies declared contracts.
2. It preserves declared invariants.
3. It performs no undeclared effects.
4. It matches declared topology.
5. It stays within declared cost/resource budgets.
6. It respects its capability scope.
7. It passes required target evidence.
8. It survives target policy checks.
9. It emits traceability records.
10. It produces a proof bundle.
```

The proof bundle contains:

```yaml
ProofBundle:
  candidate_id: uuid
  spec_cells: list
  context_bundle_hash: string
  graph_delta: object
  evidence_bundle: object
  policy_results: object
  cost_results: object
  unresolved_assumptions: list
  accepted_waivers: list
  lineage_record: uuid
```

---

## 15. Nogood Compiler

The Nogood Compiler converts failures into future constraints.

### 15.1 Nogood Schema

```yaml
Nogood:
  id: string
  target: common | elixir | verilog
  failure_class: string
  failure_pattern: object
  observed_in: list
  root_cause: string
  detection_strategy:
    - static_graph_query
    - source_ast_query
    - runtime_test
    - simulation_test
    - formal_property
    - lint_rule
    - policy_gate
    - expert_review
  repair_patterns: list
  prevention_rule: object
  promotion_status:
    - candidate
    - soft_warning
    - regression_test
    - policy_rule
    - hard_gate
  benchmark_case: object
```

### 15.2 Promotion Ladder

```text
failure
  → structured finding
  → nogood
  → detector candidate
  → regression/property/formal test
  → policy rule
  → CI/evidence gate
```

### 15.3 Elixir Nogood Example

```yaml
id: OTP-NG-GENSERVER-BIZLOGIC-001
target: elixir
failure_class: misplaced_domain_logic
failure_pattern:
  callback: handle_call
  contains_domain_transition: true
root_cause: business logic embedded inside process shell
repair_patterns:
  - functional_core_genserver_shell
prevention_rule:
  graph_query: callback mutates domain state without reducer edge
promotion_status: policy_rule
```

### 15.4 Verilog Nogood Example

```yaml
id: FPGA-NG-CDC-MULTIBIT-001
target: verilog
failure_class: unsafe_clock_domain_crossing
failure_pattern:
  source_clock: clock_a
  dest_clock: clock_b
  signal_width: ">1"
  synchronizer: absent
root_cause: multi-bit signal crosses clock domains without protocol
repair_patterns:
  - async_fifo
  - valid_ready_handshake
  - gray_counter_sync
prevention_rule:
  graph_query: multibit edge across clock domains without approved CDC pattern
promotion_status: hard_gate
```

---

## 16. Training and Data Strategy

The base system should produce useful training data, but training is not the first dependency.

The system should work as a harness before it becomes a fine-tuning factory.

### 16.1 Data Products

The substrate should emit:

```text
accepted trajectories
rejected trajectories
repair trajectories
tool-output-to-diagnosis pairs
graph-delta-to-evidence pairs
expert review labels
nogood examples
benchmark cases
```

### 16.2 Trajectory Shape

```yaml
Trajectory:
  input_spec: object
  context_bundle: object
  candidate: object
  graph_projection: object
  evidence: object
  failure_classification: object
  repair: object
  final_result: accepted | rejected
  expert_label: object?
```

### 16.3 Fine-Tuning Use

For Verilog, useful training examples include:

```text
RTL + testbench + simulation result
RTL + synthesis result
RTL + timing failure + repair
RTL + CDC warning + synchronizer repair
RTL + resource violation + architecture change
```

For Elixir, useful training examples include:

```text
Elixir patch + ImplementationGraph delta
GenServer misuse + reducer repair
capability violation + boundary repair
test failure + property addition
ENF failure + compression rewrite
```

The system should fine-tune models on **evidence-linked trajectories**, not raw code alone.

---

## 17. Query and Trust Interface

The base system should expose a query interface over engineering meaning.

Example queries:

```text
What requirement does this artifact implement?
What evidence proves this behavior?
What changed downstream after this SpecCell changed?
Why was this topology accepted?
What policy does this candidate violate?
What would break if this interface changed?
Which claims are drifted or stale?
Which failures became hard gates?
```

The query engine should compile user questions into graph traversal, belief evaluation, impact analysis, and evidence retrieval.

The UI should expose:

```text
belief state
scope
supporting evidence
contradicting evidence
lineage
recommended action
available repair patterns
acceptance blockers
```

The system must make it easy to distinguish:

```text
intended architecture
current implementation
tool-observed behavior
runtime-observed behavior
model inference
human-approved exception
stale documentation
contradictory evidence
```

---

## 18. Minimal Common Base Build

The first common implementation should not start with Elixir-specific or Verilog-specific intelligence.

It should build the substrate skeleton.

### 18.1 Common Core

Build:

```text
Artifact Store
ArtifactLink Store
SpecGraph
PolicyGraph
EvidenceGraph
LineageGraph
NogoodGraph
ContextBundle schema
TargetAdapter behavior
PatternCatalog
ProofBundle schema
AcceptanceGate runner
```

### 18.2 First Generic Workflows

Implement:

```text
create SpecCell
compile ContextBundle
select Pattern
generate Skeleton
accept Candidate Artifact
run TargetAdapter evidence
store EvidenceBundle
evaluate PolicyResult
emit ProofBundle
compile Nogood
query lineage
```

### 18.3 First Target Adapters

Stub both target adapters early.

```text
ElixirAdapter:
  parse placeholder
  graph extraction placeholder
  evidence runner: mix compile + mix test initially

VerilogAdapter:
  parse placeholder
  graph extraction placeholder
  evidence runner: parser/lint/sim initially
```

The point is to prove the common architecture before chasing full domain intelligence.

---

## 19. Minimal Elixir Wedge

After the common base exists, the first Elixir wedge should be:

```text
Functional core + GenServer shell enforcement
```

It should demonstrate:

```text
SpecCell → ContextBundle → skeleton → candidate patch
→ ImplementationGraph extraction → ENF policy check
→ tests/property tests → proof bundle → nogood on failure
```

Initial policies:

```text
no business logic in GenServer callback
no unsupervised process
state ownership declared
pure reducer tested
public API bounded
side effects declared
```

---

## 20. Minimal Verilog Wedge

After the common base exists, the first Verilog wedge should be:

```text
valid/ready streaming stage or small FIFO
```

It should demonstrate:

```text
SpecCell → ContextBundle → skeleton → candidate RTL
→ RTLGraph extraction → simulation → synthesis
→ resource check → policy check → proof bundle → nogood on failure
```

Initial policies:

```text
no inferred latch
registered outputs where required
valid/ready protocol obeyed
resource budget checked
simulation passes
synthesis passes
```

Then extend to:

```text
async FIFO
CDC synchronizer
small FSM controller
pipelined arithmetic stage
```

---

## 21. What This System Is

This system is:

```text
a living graph substrate for engineering truth
a controlled lowering path from intent to implementation
a policy-governed candidate generator
a runtime/physical evidence harness
a nogood compiler
a target-specializable architecture intelligence kernel
```

It is not:

```text
a generic coding assistant
a single-agent repo editor
a raw code fine-tuning project
a prompt library
a test runner wrapper
a Verilog-only tool
an Elixir-only tool
```

The common product is the **governed engineering substrate**.

Elixir and Verilog are proof domains.

---

## 22. Final Architecture Statement

The unified system should be built around this invariant:

```text
No AI-generated artifact is accepted because it looks plausible.

An artifact is accepted only when it can be traced from intent,
projected into target topology, executed or lowered into its environment,
measured against evidence, checked against cost and policy constraints,
and recorded with lineage sufficient to explain why it was accepted.
```

For Elixir, the environment is BEAM concurrency and operational behavior.

For Verilog, the environment is FPGA synthesis, timing, routing, and simulation.

For both, the base architecture is the same:

```text
SpecGraph
+ ArchitectureGraph
+ TargetGraph
+ EvidenceGraph
+ CostGraph
+ PolicyGraph
+ NogoodGraph
+ LineageGraph
+ Bounded Proposal Engine
+ Target Adapter
+ Acceptance Gate
= Substrate-Governed AI Engineering
```

That is the common platform to build first.
