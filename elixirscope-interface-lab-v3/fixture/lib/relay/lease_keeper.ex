defmodule Relay.LeaseKeeper do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def claim(device), do: GenServer.call(__MODULE__, {:claim, device})
  def init(_), do: {:ok, %{epochs: %{}}}

  def handle_call({:claim, device}, _from, state) do
    epoch = Map.get(state.epochs, device, 0) + 1
    {:reply, {:ok, epoch}, %{state | epochs: Map.put(state.epochs, device, epoch)}}
  end
end
