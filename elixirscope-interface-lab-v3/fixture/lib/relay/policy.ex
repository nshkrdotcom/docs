defmodule Relay.Policy do
  def authorize(%{actor: actor, device: device, action: action}) do
    cond do
      not actor.enabled -> {:error, :actor_disabled}
      device.site_id not in actor.site_ids -> {:error, :wrong_site}
      action not in actor.allowed_actions -> {:error, :not_allowed}
      true -> :ok
    end
  end
end
