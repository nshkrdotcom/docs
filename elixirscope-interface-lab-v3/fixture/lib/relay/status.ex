defmodule Relay.Status do
  def describe(:pending), do: %{label: "Accepted", final: false}
  def describe(:unknown), do: %{label: "Outcome unknown", final: false}
  def describe(:completed), do: %{label: "Confirmed", final: true}
  def describe(other), do: %{label: inspect(other), final: false}
end
