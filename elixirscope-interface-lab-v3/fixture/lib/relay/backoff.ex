defmodule Relay.Backoff do
  def delay(attempt) when attempt >= 0 do
    base = trunc(:math.pow(2, min(attempt, 8))) * 100
    min(base, 30_000)
  end
end
