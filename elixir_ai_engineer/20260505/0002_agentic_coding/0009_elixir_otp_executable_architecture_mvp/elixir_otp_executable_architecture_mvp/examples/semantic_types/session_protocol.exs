defmodule Example.SemanticTypes.SessionProtocol do
  use ArchEx.SemanticType

  semantic_type "session_pool.protocol.lifecycle" do
    kind :protocol
    version "0.1.0"

    states [:closed, :open, :worker_checked_out, :executing]

    transition :create_session, from: :closed, to: :open
    transition :checkout, from: :open, to: :worker_checked_out, requires: "session.worker.checkout"
    transition :execute, from: :worker_checked_out, to: :executing, requires: "session.worker.execute"
    transition :command_done, from: :executing, to: :worker_checked_out
    transition :checkin, from: :worker_checked_out, to: :open
    transition :close_session, from: :open, to: :closed

    forbid_transition :execute, from: :open
    forbid_transition :checkout, from: :closed

    derive_checks [:stream_data, :ex_unit]
    derive_mutants [:execute_before_checkout, :checkout_after_close, :missing_checkin]
  end
end
