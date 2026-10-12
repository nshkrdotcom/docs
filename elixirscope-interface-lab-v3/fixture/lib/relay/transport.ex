defmodule Relay.Transport do
  def post(path, body) do
    request = Finch.build(:post, base_url() <> path, [], body)
    case Finch.request(request, Relay.HTTP, receive_timeout: 1_500) do
      {:ok, %{status: 200, body: reply}} -> {:ok, reply}
      {:error, %Mint.TransportError{reason: :timeout}} -> {:error, :timeout}
      other -> {:error, other}
    end
  end

  def get(path) do
    request = Finch.build(:get, base_url() <> path)
    case Finch.request(request, Relay.HTTP) do
      {:ok, %{body: body}} -> {:ok, body}
      other -> {:error, other}
    end
  end

  defp base_url, do: Application.fetch_env!(:relay, :device_url)
end
