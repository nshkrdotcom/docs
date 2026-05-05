defmodule Example.SemanticTypes.AgentSessionCheckoutRepair do
  use ArchEx.CapabilityBundle

  capability_bundle "agent.session_checkout_repair" do
    version "0.1.0"
    purpose "Allow local repair of session checkout behavior while preventing global capability/protocol mutation."

    read do
      allow "session_pool.*"
      allow "capability.kernel"
      allow "runtime.telemetry"
      allow "semantic_type.session_pool.*"
    end

    modify do
      allow "session_pool.operation.checkout"
      allow "session_pool.worker_selection"
      allow "test.generated.session_pool.*"
      allow "bench.generated.session_pool.*"
    end

    forbidden_modify do
      deny "capability.kernel"
      deny "capability.derivation_rules"
      deny "semantic_type.capability_token"
      deny "runtime.auth_kernel"
      deny "memory_tier.boundary"
      deny "session_pool.protocol.lifecycle"
    end

    execute do
      allow "mix test"
      allow "mix credo"
      allow "mix archex.check"
      allow "mix archex.mutate"
      allow "mix archex.oracle"
    end
  end
end
