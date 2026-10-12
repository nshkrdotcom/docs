defmodule Relay.Application do
  use Application

  def start(_type, _args) do
    children = [Relay.Repo, Relay.RootSupervisor]
    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
