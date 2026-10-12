defmodule Relay.RootSupervisor do
  use Supervisor

  def start_link(opts), do: Supervisor.start_link(__MODULE__, opts, name: __MODULE__)

  def init(_opts) do
    children = [
      {Registry, keys: :unique, name: Relay.Registry},
      Relay.Authority, Relay.ValidationGate, Relay.Dispatcher,
      Relay.RetryBroker, Relay.StatusProjector, Relay.LeaseKeeper,
      Relay.WorkerSupervisor
    ]
    Supervisor.init(children, strategy: :one_for_one)
  end
end
