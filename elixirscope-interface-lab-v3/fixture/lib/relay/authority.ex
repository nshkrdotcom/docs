defmodule Relay.Authority do
  use GenServer
  alias Relay.{Policy, Journal}

  def start_link(opts), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  def submit(command), do: GenServer.call(__MODULE__, {:submit, command})

  def init(_), do: {:ok, %{pending: %{}, epoch: 1}}

  def handle_call({:submit, command}, _from, state) do
    with :ok <- Relay.ValidationGate.check(command),
         :ok <- Policy.authorize(command),
         {:ok, record} <- Journal.accept(command) do
      Relay.Dispatcher.dispatch(record)
      pending = Map.put(state.pending, command.id, record)
      {:reply, {:accepted, command.id}, %{state | pending: pending}}
    else
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end
end
