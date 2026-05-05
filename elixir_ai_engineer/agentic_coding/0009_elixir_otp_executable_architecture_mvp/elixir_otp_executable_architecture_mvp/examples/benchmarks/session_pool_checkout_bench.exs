Mix.install([
  {:benchee, "~> 1.5"}
])

Benchee.run(
  %{
    "session_pool.checkout/checkin" => fn ->
      session = Fixtures.session_open!()
      cap = Fixtures.checkout_capability!()
      {:ok, worker} = Example.SessionPool.checkout(session.id, cap)
      :ok = Example.SessionPool.checkin(worker)
    end
  },
  time: 5,
  memory_time: 2,
  save: [path: "bench/results/session_pool_checkout.benchee"]
)
