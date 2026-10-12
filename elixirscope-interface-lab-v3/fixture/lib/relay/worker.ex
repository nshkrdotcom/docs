defmodule Relay.Worker do
  use GenServer, restart: :transient
  alias Relay.{Journal, RecoveryPolicy, DeviceAdapter}

  def start_link(id), do: GenServer.start_link(__MODULE__, id)

  def init(id) do
    record = Journal.fetch(id)
    state = %{id: id, attempts: 0, outcome: :unknown, record: record}
    {:ok, state, {:continue, :recover}}
  end

  def handle_continue(:recover, state) do
    case RecoveryPolicy.next(state.record) do
      :dispatch -> send(self(), :execute)
      :reconcile -> send(self(), :readback)
      :stop -> :ok
    end
    {:noreply, state}
  end

  def handle_info(:execute, state) do
    result = DeviceAdapter.write(state.id, state.record.payload)
    case result do
      {:ok, receipt} -> Journal.complete(state.id, receipt)
      {:error, :timeout} -> Journal.mark_unknown(state.id)
    end
    {:noreply, %{state | attempts: state.attempts + 1}}
  end
end
