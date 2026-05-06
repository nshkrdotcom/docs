# 05 — Elixir Engineering Normal Form (ENF)

## Purpose

Engineering Normal Form is the declared implementation style accepted by the harness.

It answers:

```text
What shapes of Elixir/OTP code are admissible for this system?
```

Without ENF, “good Elixir” is invisible taste. With ENF, many taste judgments become checkable constraints.

## Module kinds

Every generated module must declare one kind.

```text
PureDomainModule
BoundaryAPI
StatefulProcess
Supervisor
DynamicSupervisor
Registry
Adapter
Materializer
PolicyModule
ProtocolStateMachine
StorageBoundary
TelemetryEmitter
TestModule
PropertyTestModule
FaultTestModule
```

A module with no kind is suspect.

## PureDomainModule

### Use when

```text
- logic is deterministic
- behavior is data-in/data-out
- no process state is required
- no external effect is required
```

### Allowed

```text
- structs
- pure constructors
- reducers
- converters
- pattern matching
- guards
- private helpers
```

### Forbidden

```text
- GenServer calls
- process spawn
- ETS
- filesystem writes
- network calls
- Application config reads
- telemetry side effects unless declared
- credential materialization
```

### Cost policy

Pure modules are cheap. Prefer them.

## BoundaryAPI

### Use when

```text
- hiding OTP machinery
- providing stable public API
- mapping external input into domain structs
```

### Allowed

```text
- public facade functions
- validation of external inputs
- delegation to process or core
```

### Forbidden

```text
- large domain logic
- raw GenServer exposure to callers
- unstructured error wrapping
```

## StatefulProcess

### Use when

A process owns at least one of:

```text
- mutable runtime state over time
- serialized access to a resource
- lifecycle responsibility
- concurrent coordination
- external resource session
```

### Required

```text
- state ownership justification
- explicit state struct or state map
- child_spec
- public API facade
- call/cast policy
- crash/restart semantics
- tests through public API
```

### Forbidden by default

```text
- business logic in callbacks
- external provider calls in state-holding callbacks
- long blocking work in callbacks
- unsupervised spawned children
- direct credential access unless Materializer kind
```

## Supervisor

### Use when

```text
- owning static child lifecycle
- grouping failure domains
```

### Required

```text
- child list
- restart strategy
- restart intensity
- failure domain rationale
```

### Forbidden

```text
- business logic
- data transformation
- policy decisions
```

## DynamicSupervisor

### Use when

```text
- children are started at runtime
- children are independently restartable
- child identity matters
```

### Suspect when

```text
- child set is fixed
- only one child ever exists
- dynamic supervisor exists because AI copied an OTP pattern
```

## Registry

### Use when

```text
- dynamic process lookup is required across ownership boundaries
- PIDs cannot be passed directly
```

### Suspect when

```text
- there is one process
- explicit reference would suffice
- it replaces missing ownership design
```

## Behaviour

Behaviours are expensive abstractions.

Allowed when:

```text
- multiple real implementations exist
- external adapter boundary requires pluggability
- test double boundary is declared
- roadmap explicitly requires provider expansion
```

Rejected when:

```text
- one implementation exists
- behaviour only wraps one module
- callbacks mirror concrete functions exactly
```

## Adapter

Use when translating between external shape and internal domain shape.

Adapters are allowed to know about external SDKs, APIs, CLI outputs, file formats, etc.

The core must not.

## Materializer

A trusted effect boundary allowed to redeem leases into raw credential material.

Required:

```text
- non-exportable lease
- credential backend call
- redaction policy
- audit event
- ephemeral material lifetime
```

Forbidden:

```text
- returning raw secret to agent
- storing secret in long-lived process state
- logging secret material
```

## Engineering cost signals

The harness should compute:

```text
module_count
public_function_count
process_count
behaviour_count
single_implementation_behaviour_count
callback_complexity
supervision_depth
cross_boundary_edges
undeclared_effects
invented_domain_terms
state_representation_count
public_api_growth
```

## Default cost preferences

```text
prefer pure function over process
prefer one module over many when concepts are not distinct
prefer explicit data over hidden process state
prefer public API minimization
prefer direct pattern matching over abstraction layers
prefer behaviour only at true boundary seams
prefer state machine where lifecycle matters
prefer tests of behavior over tests of implementation shape
```

## ENF rejection examples

```text
Rejected: GenServer introduced but state is always nil.
Rejected: Behaviour has one implementation and no declared extension point.
Rejected: Public function is not traced to a contract.
Rejected: Adapter performs domain policy decision.
Rejected: PureDomainModule calls System.get_env/1.
Rejected: Supervisor module contains business branching.
Rejected: Registry introduced for single statically named process.
```

## The compression principle

If two implementations satisfy the same spec and evidence gates, prefer the one with:

```text
fewer concepts
fewer modules
fewer public functions
fewer processes
fewer boundary edges
fewer state representations
less future change cost
```

This is how ENF attacks the 1,000 LOC → 250 LOC problem.
