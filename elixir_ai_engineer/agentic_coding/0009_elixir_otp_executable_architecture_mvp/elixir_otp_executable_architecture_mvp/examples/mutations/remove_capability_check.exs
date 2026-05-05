defmodule Example.Mutations.RemoveCapabilityCheck do
  @behaviour ArchEx.Mutation

  def id, do: :remove_capability_check
  def targets, do: ["lib/example/session_pool.ex"]

  def apply(source) do
    source
    |> String.replace(
      "with :ok <- Capability.require!(capability_bundle, :checkout) do",
      "with :ok <- :ok do"
    )
  end

  def expected_killers do
    [
      "test/generated/session_pool/checkout_contract_test.exs",
      "test/generated/session_pool/checkout_property_test.exs"
    ]
  end
end
