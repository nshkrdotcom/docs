defmodule Example.SemanticTypes.SessionPoolCheckout do
  use ArchEx.SemanticType

  semantic_type "session_pool.operation.checkout" do
    kind :hot_path_operation
    version "0.1.0"

    behavior do
      input "SessionId"
      output "WorkerRef"
      guarantee :returns_supervised_worker
      guarantee :does_not_create_unbounded_workers
    end

    requires do
      capability "session.worker.checkout"
    end

    effects do
      allow :registry_lookup
      allow :worker_checkout
      allow :telemetry_emit
      forbid :db_write
      forbid :network_call
      forbid :unsupervised_spawn
    end

    resources do
      bound :mailbox_delta, max: 1
      bound :dynamic_children, max_ref: "config.session_pool.max_workers"
    end

    cost do
      asymptotic :constant, relative_to: :active_sessions
      p95 max_ms: 20
      allocation_delta max_bytes: 2048
    end

    protocol do
      requires_state :session_open
      transitions from: :session_open, to: :worker_checked_out
    end

    observes do
      event [:archex, :session_pool, :checkout, :start]
      event [:archex, :session_pool, :checkout, :stop]
      event [:archex, :session_pool, :checkout, :exception]
    end

    derive_checks [:ex_unit, :stream_data, :credo, :telemetry, :benchee]
    derive_mutants [:remove_capability_check, :remove_telemetry, :add_network_call, :unbounded_spawn]
  end
end
