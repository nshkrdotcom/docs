defmodule Relay.Telemetry do
  def observe(command_id, phase, metadata) do
    :telemetry.execute([:relay, :command, phase], %{count: 1},
      Map.put(metadata, :command_id, command_id))
  end
end
