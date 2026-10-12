defmodule RelayWeb.CommandController do
  use RelayWeb, :controller

  def create(conn, params) do
    command = struct!(Relay.Command, RelayWeb.Input.decode(params))
    case Relay.Authority.submit(command) do
      {:accepted, id} -> conn |> put_status(202) |> json(%{id: id})
      {:error, reason} -> conn |> put_status(422) |> json(%{error: reason})
    end
  end

  def show(conn, %{"id" => id}) do
    record = Relay.Journal.fetch(id)
    json(conn, Relay.Status.describe(record.status))
  end
end
