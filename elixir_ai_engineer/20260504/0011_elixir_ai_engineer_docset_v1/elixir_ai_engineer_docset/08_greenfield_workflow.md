# 08 — Greenfield Workflow: Building a Large Elixir System from Zero

## Goal

This workflow is for a large greenfield Elixir/OTP system where code should follow from architecture instead of architecture being guessed by a model.

The workflow intentionally delays feature implementation until system shape is constrained.

## Phase overview

```text
Phase 0: Problem framing
Phase 1: Nonfunctional requirement discovery
Phase 2: Capability map
Phase 3: Domain model
Phase 4: Boundary graph
Phase 5: Contract and state modeling
Phase 6: Runtime topology design
Phase 7: Architecture tournament
Phase 8: SpecCell decomposition
Phase 9: Context bundle generation
Phase 10: Deterministic skeleton
Phase 11: Bounded LM implementation
Phase 12: Evidence and compression
Phase 13: Acceptance and runtime feedback
```

## Phase 0 — Problem framing

Output:

```text
one-page product/system thesis
```

Questions:

```text
What is the system for?
Who uses it?
What must never happen?
What is allowed to fail?
What must be observable?
What is the first vertical slice?
```

## Phase 1 — Nonfunctional requirement discovery

Ryan's point lives here: nonfunctional requirements prune the universe of bad choices.

Capture:

```text
maintainability target
team expertise assumptions
latency target
data durability
fault tolerance
security model
multi-tenancy
observability
budget constraints
operational complexity budget
```

Output:

```yaml
nfr:
  team:
    expected_expertise: mixed
    maintainability_bias: high
  runtime:
    max_process_complexity: conservative
    prefer_boring_otp: true
  security:
    ambient_authority_allowed: false
```

## Phase 2 — Capability map

Define what the system can do without naming modules.

Example:

```text
- start session
- attach connector
- issue credential lease
- invoke provider
- revoke authority
- audit effect
```

## Phase 3 — Domain model

Define nouns and relationships.

Reject synonym drift early.

Example rule:

```text
Session, Run, Conversation, Invocation, and ActorContext are not interchangeable.
```

## Phase 4 — Boundary graph

Define components and allowed edges.

No code until the component graph exists.

## Phase 5 — Contract and state modeling

For each capability:

```text
input
output
errors
requires
preserves
state transitions
forbidden transitions
```

## Phase 6 — Runtime topology design

For each component, choose the runtime shape:

```text
pure module
stateful process
supervisor
worker
adapter
materializer
registry
dynamic supervisor
```

Every runtime primitive must have a reason.

## Phase 7 — Architecture tournament

Before code, generate competing architecture proposals.

Example for `CredentialLeaseRegistry`:

```text
A: pure module + caller-owned state
B: single GenServer
C: ETS table + owner process
D: persistent event log
```

Evaluate:

```text
state ownership
complexity
failure semantics
future change cost
operation volume
security risk
implementation cost
```

Pick one and write the ADR.

## Phase 8 — SpecCell decomposition

Split into cells until each cell is implementable with narrow context.

A good leaf SpecCell should fit into a context bundle under a few thousand tokens.

## Phase 9 — Context bundle generation

The system compiles the exact context for one implementation task.

It includes:

```text
- relevant charter invariants
- local spec cell
- domain references
- boundary edges
- contracts
- state machine
- effect declarations
- ENF policy
- allowed files
- forbidden inventions
- test obligations
```

## Phase 10 — Deterministic skeleton

Generate scaffolding without an LM when possible:

```text
module declarations
struct fields
callback shells
supervision child specs
state machine test shells
property test shells
traceability headers
```

## Phase 11 — Bounded LM implementation

The model fills only holes:

```text
pure transition function
pattern matching clauses
test cases
error handling
small docs
```

The model may not invent new modules, effects, processes, or boundaries unless the spec is updated.

## Phase 12 — Evidence and compression

Run:

```text
format
compile
tests
property tests
fault tests
spec.audit
ENF audit
compression challenge
```

## Phase 13 — Acceptance and runtime feedback

Accepted code emits lineage:

```text
which spec cell produced it
which model/operator touched it
which tests prove it
which normalizations reduced it
which runtime traces validate it
```

Runtime failures refine specs, tests, and normalizers.

## Greenfield rule

Never let the first implementation become the architecture.

For each major component:

```text
architecture alternatives first
implementation second
compression third
```
