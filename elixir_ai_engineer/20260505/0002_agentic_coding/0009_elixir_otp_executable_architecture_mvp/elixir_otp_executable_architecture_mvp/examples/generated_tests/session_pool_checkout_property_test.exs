defmodule Generated.SessionPool.CheckoutPropertyTest do
  use ExUnit.Case
  use ExUnitProperties

  property "session protocol never executes before checkout" do
    check all commands <- Generators.session_commands() do
      model = Example.SessionModel.run(commands)
      refute Example.SessionModel.has_invalid_transition?(model, :execute_before_checkout)
    end
  end

  property "worker count stays within configured bound" do
    check all commands <- Generators.session_commands() do
      model = Example.SessionModel.run(commands)
      assert model.max_workers <= Application.fetch_env!(:archex_example, :max_workers)
    end
  end
end
