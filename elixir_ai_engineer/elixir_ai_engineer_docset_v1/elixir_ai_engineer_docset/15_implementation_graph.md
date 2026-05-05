# 15 — Implementation Graph

## Purpose

The ImplementationGraph is the extracted architectural truth of the codebase.

It answers:

```text
What did the code actually build?
```

## Nodes

```text
Module
Function
Struct
Behaviour
Protocol
GenServer
Supervisor
DynamicSupervisor
Registry
Task
ETS table
ExternalEffect
ConfigRead
TelemetryEvent
Test
SpecCell
Contract
```

## Edges

```text
calls
implements
uses
supervises
registers
spawns
reads_config
performs_effect
emits_telemetry
tests
traces_to
violates
```

## Extraction targets

### Module graph

```text
module name
file path
module kind if declared
public functions
private functions
aliases/imports
```

### Call graph

```text
local calls
remote calls
external library calls
OTP calls
```

### Runtime graph

```text
use GenServer
use Supervisor
DynamicSupervisor.start_child
Registry calls
Task calls
spawn calls
```

### Effect graph

```text
System.get_env
Application.get_env
File.*
Req/Finch/HTTPoison/Tesla
Ecto.Repo
Port.open
System.cmd
:ets
credential backend calls
```

### Public API graph

```text
def functions
@doc public docs
@specs
contract traceability
```

## Output schema example

```json
{
  "modules": [
    {
      "name": "CredentialFabric.LeaseRegistry",
      "kind": "StatefulProcess",
      "file": "lib/credential_fabric/lease_registry.ex",
      "uses": ["GenServer"],
      "public_functions": ["start_link/1", "issue/2", "redeem/2"],
      "effects": [],
      "spec_cell": "credential_fabric.lease_registry"
    }
  ],
  "violations": [
    {
      "rule": "public_function_without_contract",
      "node": "CredentialFabric.LeaseRegistry.lookup/1"
    }
  ]
}
```

## Spec comparison

Compare ImplementationGraph to SpecGraph:

```text
- module traces to SpecCell?
- public function traces to contract?
- effect declared?
- process justified?
- boundary edge allowed?
- telemetry obligation implemented?
```

## Drift classification

A code change is classified as:

```text
conforming_detail
spec_violation
spec_omission
implementation_bloat
spec_refinement_candidate
dead_behavior
```

## Why not embeddings first

Embeddings can help retrieval. They cannot verify structure.

The core checks should operate on concrete graphs.
