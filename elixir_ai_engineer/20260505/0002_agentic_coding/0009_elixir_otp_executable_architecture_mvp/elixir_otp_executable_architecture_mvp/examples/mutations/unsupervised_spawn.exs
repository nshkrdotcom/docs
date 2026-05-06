defmodule Example.Mutations.UnsupervisedSpawn do
  @behaviour ArchEx.Mutation

  def id, do: :unsupervised_spawn
  def targets, do: ["lib/example/session_pool.ex"]

  def apply(source) do
    String.replace(source, "DynamicSupervisor.start_child", "fn _sup, child -> {:ok, spawn(fn -> child.start.() end)} end.")
  end

  def expected_killers do
    ["lib/credo/check/archex/no_unsupervised_spawn_in_session_pool.ex"]
  end
end
