defmodule Relay.RecoveryTest do
  use ExUnit.Case

  test "unknown outcome requires reconciliation before retry" do
    durable_record = %{status: :unknown, command_id: "cmd-42"}
    assert Relay.RecoveryPolicy.next(durable_record) == :reconcile
  end

  test "completed command is not dispatched again" do
    assert Relay.RecoveryPolicy.next(%{status: :completed}) == :stop
  end
end
