defmodule Relay.CommandRecord do
  use Ecto.Schema
  import Ecto.Changeset

  schema "commands" do
    field :command_id, :string
    field :status, Ecto.Enum, values: [:pending, :unknown, :completed]
    field :payload, :map
    field :receipt, :string
    timestamps()
  end

  def changeset(record, attrs) do
    record
    |> cast(attrs, [:command_id, :payload, :status])
    |> validate_required([:command_id])
    |> unique_constraint(:command_id)
  end
end
