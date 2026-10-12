defmodule Relay.DeviceAdapter do
  def write(id, payload) do
    body = Relay.Encoder.encode(id, payload)
    Relay.Transport.post("/commands", body)
  end

  def readback(id) do
    with {:ok, body} <- Relay.Transport.get("/commands/#{id}"),
         {:ok, receipt} <- Relay.Receipt.decode(body) do
      {:ok, receipt}
    end
  end
end
