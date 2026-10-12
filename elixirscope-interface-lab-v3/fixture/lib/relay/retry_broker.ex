defmodule Relay.RetryBroker do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def schedule(id), do: GenServer.cast(__MODULE__, {:retry, id})
  def init(_), do: {:ok, %{attempts: %{}}}

  def handle_cast({:retry, id}, state) do
    count = Map.get(state.attempts, id, 0)
    Process.send_after(self(), {:fire, id}, Relay.Backoff.delay(count))
    {:noreply, %{state | attempts: Map.put(state.attempts, id, count + 1)}}
  end

  def handle_info({:fire, id}, state) do
    Relay.WorkerSupervisor.start_command(id)
    {:noreply, state}
  end
end
