defmodule Relay.Encoder do
  def encode(id, payload) do
    Jason.encode!(%{command_id: id, payload: payload})
  end
end
