defmodule Relay.Journal do
  import Ecto.Query
  alias Relay.{Repo, CommandRecord}

  def accept(command) do
    %CommandRecord{}
    |> CommandRecord.changeset(Map.from_struct(command))
    |> Repo.insert(on_conflict: :nothing, conflict_target: :command_id)
  end

  def fetch(id), do: Repo.get_by!(CommandRecord, command_id: id)

  def mark_unknown(id) do
    from(c in CommandRecord, where: c.command_id == ^id)
    |> Repo.update_all(set: [status: :unknown])
  end

  def complete(id, receipt) do
    from(c in CommandRecord, where: c.command_id == ^id)
    |> Repo.update_all(set: [status: :completed, receipt: receipt])
  end
end
