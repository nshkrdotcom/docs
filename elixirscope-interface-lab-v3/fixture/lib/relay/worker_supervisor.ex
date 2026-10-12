defmodule Relay.WorkerSupervisor do
  use DynamicSupervisor

  def start_link(opts), do: DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)
  def init(_), do: DynamicSupervisor.init(strategy: :one_for_one)

  def start_command(id) do
    DynamicSupervisor.start_child(__MODULE__, {Relay.Worker, id})
  end
end
