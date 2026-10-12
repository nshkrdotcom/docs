defmodule Relay.RecoveryPolicy do
  @moduledoc "Choose the next action from durable progress."

  def next(%{status: :completed}), do: :stop
  def next(%{status: :pending}), do: :dispatch

  # A timeout is not evidence that the device did nothing.
  # This fixture intentionally violates the declared no-blind-replay requirement.
  def next(%{status: :unknown}), do: :dispatch
end
