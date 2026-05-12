# Functional Core, Effect Shell

## Purpose

This document defines the split between pure business logic and effectful orchestration.

## Rule

```text
Pure core decides.
Effect shell observes, persists, calls, retries, and supervises.
```

The split is the primary design technique for keeping large Elixir systems testable.

## Functional Core

Pure modules should:

- Accept explicit inputs.
- Return explicit outputs.
- Return expected failures as `{:error, reason}`.
- Avoid Repo, HTTP, files, timers, process APIs, global names, and config reads.
- Avoid Logger except in rare diagnostic helpers.
- Avoid `DateTime.utc_now/0`, UUID generation, and random calls unless injected.

Example:

```elixir
defmodule MyApp.Orders.Order do
  def place(command, cart, customer) do
    with :ok <- ensure_active(customer),
         :ok <- ensure_non_empty(cart) do
      order = build_order(command, cart, customer)
      {:ok, order, [%OrderPlaced{order_id: order.id}]}
    end
  end
end
```

## Effect Shell

Effectful modules may:

- Load from Repo.
- Execute transactions.
- Call external services.
- Start tasks or jobs.
- Emit telemetry.
- Read runtime config.
- Generate IDs and timestamps.
- Convert low-level errors into application errors.

Example:

```elixir
defmodule MyApp.Orders do
  alias Ecto.Multi
  alias MyApp.Orders.Order

  def place_order(attrs, deps \\ default_deps()) do
    command = deps.command_parser.parse!(attrs)

    Multi.new()
    |> Multi.run(:cart, fn repo, _ -> load_cart(repo, command.cart_id) end)
    |> Multi.run(:customer, fn repo, _ -> load_customer(repo, command.customer_id) end)
    |> Multi.run(:domain, fn _repo, %{cart: cart, customer: customer} ->
      Order.place(command, cart, customer)
    end)
    |> Multi.insert(:order, fn %{domain: {order, _events}} -> to_schema(order) end)
    |> Multi.insert_all(:events, EventSchema, fn %{domain: {_order, events}} ->
      Enum.map(events, &event_row/1)
    end)
    |> deps.repo.transaction()
  end
end
```

## Dependency Injection

Inject dependencies when they affect testability or determinism:

| Dependency | Inject As |
|---|---|
| Clock | `clock.now()` |
| UUID | `id_generator.new()` |
| HTTP client | adapter behavior or module |
| Repo | application service dependency |
| Config | validated runtime config struct |
| Random | seeded generator or injected module |
| Process send | runtime shell or notifier |

Do not over-abstract every module. Prefer explicit parameters for simple cases and behaviors for real external seams.

## Error Semantics

### Expected Business Failures

Return data:

```elixir
{:error, :cart_empty}
{:error, {:payment_declined, reason}}
```

Use when callers can handle or present the error.

### Unexpected Faults

Let them crash or return infrastructure error at boundary:

- Invariant violation in internal code.
- Database outage.
- Malformed internal event.
- Impossible state transition.

Do not use broad rescue to hide unexpected faults.

## Application Services

Application services are effect shell modules. They:

- Accept commands.
- Validate and normalize input.
- Load required state.
- Call pure domain transitions.
- Persist state.
- Write events/outbox rows.
- Trigger post-commit work.
- Emit telemetry.

They should not:

- Hide massive business case trees.
- Become god modules.
- Own runtime state unless they are also processes, which should be rare.

## Testing Strategy

Test pure core with fast unit tests:

- Valid transitions.
- Invalid transitions.
- Invariant enforcement.
- Event generation.
- Property tests for algebraic rules.

Test effect shell with integration tests:

- Transaction behavior.
- Constraint errors.
- Idempotency.
- Outbox writes.
- Adapter error mapping.

Test processes through public API:

- Start.
- Calls.
- Casts only when justified.
- Restart.
- Timeout.
- Shutdown.

## Anti-Patterns

### Business Logic In GenServer Callback

Bad:

```elixir
def handle_call({:place_order, attrs}, _from, state) do
  # validates cart, calls Repo, calls payment, updates state, sends email
end
```

Repair:

- Extract `Order.place/3`.
- Use application service for transaction.
- Use process only if it owns runtime workflow state.

### Hidden Config In Core

Bad:

```elixir
def discount(order) do
  if Application.get_env(:my_app, :discounts_enabled), do: ...
end
```

Repair:

```elixir
def discount(order, policy) do
  if policy.discounts_enabled?, do: ...
end
```

### Side Effect In Constructor

Bad:

```elixir
def new(attrs), do: %__MODULE__{id: Ecto.UUID.generate(), inserted_at: DateTime.utc_now()}
```

Repair:

```elixir
def new(attrs, id, now), do: %__MODULE__{id: id, inserted_at: now}
```

## Review Checklist

- [ ] Domain modules are pure.
- [ ] Effects are at boundary/application layers.
- [ ] Expected business failures are returned as data.
- [ ] Unexpected faults are not swallowed.
- [ ] Time, IDs, config, and IO are injectable where needed.
- [ ] Tests cover core separately from effect shell.

