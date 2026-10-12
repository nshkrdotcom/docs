defmodule Relay.ValidationGate do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def check(command), do: GenServer.call(__MODULE__, {:check, command})
  def init(state), do: {:ok, state}

  def handle_call({:check, command}, _from, state) do
    {:reply, Relay.Command.validate(command), state}
  end
end
