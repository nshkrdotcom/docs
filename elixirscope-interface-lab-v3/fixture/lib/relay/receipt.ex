defmodule Relay.Receipt do
  def decode(body) do
    with {:ok, %{"command_id" => id, "applied" => true}} <- Jason.decode(body) do
      {:ok, %{id: id, status: :applied}}
    else
      _ -> {:error, :unconfirmed}
    end
  end
end
