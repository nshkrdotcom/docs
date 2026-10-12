defmodule Relay.Authority do
  use GenServer
  alias Relay.{Policy, Journal, Decision, DeviceAdapter}

  def start_link(opts), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  def submit(command), do: GenServer.call(__MODULE__, {:submit, command})
  def init(_), do: {:ok, %{in_flight: MapSet.new()}}

  def handle_call({:submit, command}, _from, state) do
    with :ok <- Policy.authorize(command),
         {:ok, record} <- Journal.accept(command) do
      action = Decision.next(record)
      {:reply, {:accepted, record.command_id, action}, state}
    else
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  # Candidate architecture would run effect work in supervised tasks.
  # Admission, cancellation and task-result handling still need design.
end
