defmodule Generated.SessionPool.CheckoutTelemetryTest do
  use ExUnit.Case

  test "checkout emits start and stop telemetry" do
    parent = self()
    handler_id = "checkout-telemetry-test-#{System.unique_integer([:positive])}"

    :telemetry.attach_many(
      handler_id,
      [
        [:archex, :session_pool, :checkout, :start],
        [:archex, :session_pool, :checkout, :stop]
      ],
      fn event, measurements, metadata, _config ->
        send(parent, {:telemetry_event, event, measurements, metadata})
      end,
      nil
    )

    try do
      session = Fixtures.session_open()
      cap = Fixtures.checkout_capability()
      assert {:ok, worker} = Example.SessionPool.checkout(session.id, cap)
      assert_receive {:telemetry_event, [:archex, :session_pool, :checkout, :start], _, _}
      assert_receive {:telemetry_event, [:archex, :session_pool, :checkout, :stop], %{duration: _}, metadata}
      assert Map.has_key?(metadata, :session_id)
      assert Map.has_key?(metadata, :worker_id)
      Example.SessionPool.checkin(worker)
    after
      :telemetry.detach(handler_id)
    end
  end
end
