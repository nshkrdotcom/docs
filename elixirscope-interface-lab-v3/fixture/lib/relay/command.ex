defmodule Relay.Command do
  @enforce_keys [:id, :actor, :device, :action]
  defstruct [:id, :actor, :device, :action, payload: %{}]

  def validate(%__MODULE__{id: id, action: action, payload: payload}) do
    cond do
      not is_binary(id) -> {:error, :missing_id}
      action not in [:open, :close, :set_limit] -> {:error, :invalid_action}
      not is_map(payload) -> {:error, :invalid_payload}
      true -> :ok
    end
  end
end
