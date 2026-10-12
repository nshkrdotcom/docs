defmodule Relay.StatusProjector do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def get(id), do: GenServer.call(__MODULE__, {:get, id})
  def init(_), do: {:ok, %{statuses: %{}}}

  def handle_call({:get, id}, _from, state) do
    status = Map.get(state.statuses, id, :pending)
    {:reply, status, state}
  end

  def handle_cast({:status, id, value}, state) do
    {:noreply, %{state | statuses: Map.put(state.statuses, id, value)}}
  end
end
