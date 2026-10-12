defmodule Relay.Dispatcher do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def dispatch(record), do: GenServer.cast(__MODULE__, {:dispatch, record})
  def init(state), do: {:ok, state}

  def handle_cast({:dispatch, record}, state) do
    Relay.WorkerSupervisor.start_command(record.command_id)
    {:noreply, state}
  end
end
