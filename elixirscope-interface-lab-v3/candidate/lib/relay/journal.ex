defmodule Relay.Journal do
  alias Relay.{Repo, CommandRecord}

  def accept(command) do
    %CommandRecord{}
    |> CommandRecord.changeset(Map.from_struct(command))
    |> Repo.insert(on_conflict: :nothing, conflict_target: :command_id)
  end

  def fetch(id), do: Repo.get_by!(CommandRecord, command_id: id)

  def unknown(id) do
    record = fetch(id)
    record |> Ecto.Changeset.change(status: :unknown) |> Repo.update()
  end
end
