defmodule Relay.PolicyTest do
  use ExUnit.Case

  test "disabled actors cannot issue commands" do
    command = %{actor: %{enabled: false}, device: %{}, action: :open}
    assert {:error, :actor_disabled} = Relay.Policy.authorize(command)
  end
end
