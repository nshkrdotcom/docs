defmodule Example.Mutations.RemoveTelemetryStop do
  @behaviour ArchEx.Mutation

  def id, do: :remove_telemetry_stop
  def targets, do: ["lib/example/session_pool.ex"]

  def apply(source) do
    Regex.replace(~r/:telemetry\.execute\(\[:archex, :session_pool, :checkout, :stop\].*?\)\n/s, source, "")
  end

  def expected_killers do
    ["test/generated/session_pool/checkout_telemetry_test.exs"]
  end
end
