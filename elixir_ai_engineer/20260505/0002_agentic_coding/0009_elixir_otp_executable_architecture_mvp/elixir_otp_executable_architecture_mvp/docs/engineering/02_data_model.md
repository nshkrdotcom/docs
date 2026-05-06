# Data Model

## Entity relationship diagram

```mermaid
erDiagram
    SEMANTIC_OBJECT ||--|| SEMANTIC_TYPE : has
    SEMANTIC_TYPE ||--o{ PROJECTION_CONTRACT : derives
    SEMANTIC_TYPE ||--o{ MUTATION_CASE : validates
    SEMANTIC_TYPE ||--o{ OBSERVATION_CONTRACT : observes
    CAPABILITY_BUNDLE ||--o{ ACCESS_EDGE : contains
    ACCESS_EDGE }o--|| SEMANTIC_OBJECT : targets
    PATCH ||--o{ PATCH_TOUCH : touches
    PATCH_TOUCH }o--|| SEMANTIC_OBJECT : maps_to
    PROOF_BUNDLE ||--|| PATCH : proves
    PROOF_BUNDLE ||--o{ CHECK_RESULT : includes
    PROOF_BUNDLE ||--o{ MUTATION_RESULT : includes
    VERDICT ||--|| PROOF_BUNDLE : decides

    SEMANTIC_OBJECT {
      string id
      string kind
      string version
      string namespace
      string statement
    }

    SEMANTIC_TYPE {
      string id
      string kind
      map behavior
      map effects
      map capabilities
      map resources
      map cost
      map protocol
      map observations
    }

    CAPABILITY_BUNDLE {
      string id
      string agent_kind
      string purpose
      string version
    }

    ACCESS_EDGE {
      string action
      string target_id
      string mode
    }

    PROOF_BUNDLE {
      string patch_id
      string capability_bundle_id
      string semantic_graph_hash
      string status
    }
```

## Core structs

```elixir
defmodule ArchEx.Core.SemanticObject do
  @type t :: %__MODULE__{
    id: String.t(),
    kind: atom(),
    version: Version.t(),
    aliases: [String.t()],
    statement: String.t(),
    scope: map()
  }

  defstruct [:id, :kind, :version, aliases: [], statement: "", scope: %{}]
end
```

```elixir
defmodule ArchEx.Core.SemanticType do
  @type t :: %__MODULE__{
    id: String.t(),
    kind: atom(),
    behavior: map(),
    effects: map(),
    capabilities: map(),
    resources: map(),
    cost: map(),
    protocol: map(),
    observations: map(),
    projections: [map()],
    mutations: [map()]
  }

  defstruct [
    :id,
    :kind,
    behavior: %{},
    effects: %{},
    capabilities: %{},
    resources: %{},
    cost: %{},
    protocol: %{},
    observations: %{},
    projections: [],
    mutations: []
  ]
end
```

## Semantic ID rules

IDs are deterministic handles into semantic space:

```text
<domain>.<component>.<kind>.<concept>
```

Examples:

```text
session_pool.operation.checkout
session_pool.protocol.lifecycle
agent.capability.session_checkout_repair
kernel.capability.derivation_rules
runtime.observation.session_pool_checkout
```

Names are projections. IDs are identity.

## Semantic graph hash

Every proof bundle should record the semantic graph hash:

```text
sha256(canonical_json(semantic_graph))
```

This makes verdicts reproducible.
