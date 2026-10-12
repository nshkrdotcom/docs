defmodule Relay.DeviceAdapter do
  def perform(:dispatch, record) do
    Relay.Transport.post("/commands", Relay.Encoder.encode(record.command_id, record.payload))
  end

  def perform(:reconcile, record) do
    Relay.Transport.get("/commands/#{record.command_id}")
  end

  def perform(:stop, _record), do: {:ok, :already_completed}
end
