defmodule Generated.SessionPool.CheckoutContractTest do
  use ExUnit.Case

  test "checkout requires session.worker.checkout capability" do
    session = Fixtures.session_open()
    denied = CapabilityBundle.empty()

    assert {:error, :unauthorized} = Example.SessionPool.checkout(session.id, denied)
  end

  test "checkout returns a supervised worker with valid capability" do
    session = Fixtures.session_open()
    cap = Fixtures.checkout_capability()

    assert {:ok, worker} = Example.SessionPool.checkout(session.id, cap)
    assert Process.alive?(worker.pid)
    assert Example.WorkerSupervisor.supervised?(worker.pid)
  end
end
