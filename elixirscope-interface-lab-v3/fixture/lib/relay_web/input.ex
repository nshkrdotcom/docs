defmodule RelayWeb.Input do
  def decode(params) do
    %{id: Map.fetch!(params, "id"),
      action: action(Map.fetch!(params, "action")),
      payload: Map.get(params, "payload", %{}),
      actor: Map.fetch!(params, "actor"),
      device: Map.fetch!(params, "device")}
  end

  defp action("open"), do: :open
  defp action("close"), do: :close
  defp action("set_limit"), do: :set_limit
end
