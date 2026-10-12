defmodule Relay.Decision do
  def next(%{status: :completed}), do: :stop
  def next(%{status: :unknown}), do: :reconcile
  def next(%{status: :pending}), do: :dispatch

  def after_readback({:ok, %{status: :applied}}), do: :complete
  def after_readback({:ok, %{status: :not_applied}}), do: :dispatch
  def after_readback({:error, _}), do: :remain_unknown
end
