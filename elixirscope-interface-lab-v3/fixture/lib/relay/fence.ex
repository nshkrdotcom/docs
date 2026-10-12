defmodule Relay.Fence do
  def current?(token, stored_epoch) when is_integer(token) do
    token >= stored_epoch
  end

  def accept(_token, nil), do: {:error, :no_authority}
  def accept(token, epoch) do
    if current?(token, epoch), do: :ok, else: {:error, :stale_token}
  end
end
