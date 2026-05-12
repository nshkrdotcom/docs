# Canonical approach: design the data first, then wrap effects in OTP

A complex Elixir/OTP application should be designed as a **functional domain core** surrounded by **supervised effectful runtime components**. OTP is not a replacement for domain modeling; it is the mechanism for making stateful, concurrent, failure-prone parts explicit, restartable, observable, and bounded. OTP’s core model is a hierarchy of **workers** and **supervisors**, where supervisors monitor and restart workers to form a fault-tolerant supervision tree. ([Erlang.org][1])

The canonical architecture looks like this:

```text
Application
└── Root Supervisor
    ├── Infrastructure
    │   ├── Repo / DB pool
    │   ├── PubSub / message bus
    │   ├── Registry
    │   └── Task.Supervisor
    ├── Bounded Context A Supervisor
    │   ├── static workers
    │   └── DynamicSupervisor for runtime children
    ├── Bounded Context B Supervisor
    │   ├── Registry
    │   └── DynamicSupervisor
    └── Observability / telemetry / health workers
```

The application callback starts the top-level supervisor; Elixir applications do not have a conventional `main` function. On shutdown, the runtime terminates the top-level supervisor, which recursively shuts down descendant processes before calling the application’s `stop/1` callback. ([Hexdocs][2])

---

# 1. Start with data modeling, not processes

## Model categories separately

Do not begin by asking “which GenServers do we need?” Begin by classifying the data:

| Category               | Use for                                                        | Typical representation                                                            |
| ---------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Value object**       | Immutable concepts such as money, email, interval, coordinates | Plain struct with constructor functions                                           |
| **Entity / aggregate** | Business object with identity and lifecycle                    | Struct plus pure transition functions                                             |
| **Command**            | Request to change the system                                   | Struct or map validated at boundary                                               |
| **Event**              | Fact that happened                                             | Struct persisted or published                                                     |
| **Read model**         | Query-optimized view                                           | Ecto schema, DTO, projection                                                      |
| **Persistent record**  | Database-backed storage shape                                  | Ecto schema                                                                       |
| **Runtime state**      | Ephemeral state owned by a process                             | GenServer state, ETS, Registry, process dictionary only with strong justification |

Ecto schemas should be treated as **data mappers**, not automatically as your domain model. The Ecto docs explicitly describe schemas as mapping external data into Elixir structs, with `schema/2` commonly used for persisted sources and `embedded_schema/1` for in-memory or embedded data. Ecto also notes that schemas can decouple application representation from database representation. ([Hexdocs][3])

A good rule:

```text
Domain structs express meaning.
Ecto schemas express persistence and validation boundaries.
GenServer state expresses runtime ownership.
```

Those may overlap, but they should not be assumed to be the same thing.

---

## Separate read models from write models

Complex systems often become painful because one schema is forced to serve all purposes: API input, database persistence, UI form state, domain logic, and reporting. Prefer separate models when the shape differs.

For example:

```text
RegistrationInput       # external form/API shape
Account                 # persisted identity record
Profile                 # persisted profile record
UserReadModel           # query/reporting shape
RegisterUser command    # business operation
UserRegistered event    # fact emitted after success
```

Ecto’s own guidance says large schemas are sometimes best broken into smaller ones: one for reading, one for writing, one for the database, one for forms. ([Hexdocs][4])

---

## Put invariants in the correct place

Use the weakest sufficient mechanism:

| Invariant type                  | Best home                                               |
| ------------------------------- | ------------------------------------------------------- |
| Pure deterministic invariant    | Constructor, pure function, changeset validation        |
| Input shape validation          | Changeset, embedded schema, boundary parser             |
| Cross-record uniqueness         | Database constraint                                     |
| Race-sensitive consistency      | Database transaction, lock, constraint, idempotency key |
| Long-running workflow invariant | Persistent state plus supervised process or job         |
| External side-effect safety     | Outbox, idempotency key, retry policy                   |

Ecto changesets distinguish **validations** from **constraints**: validations run before database interaction, while constraints rely on the database and are safe for race-sensitive checks such as uniqueness. ([Hexdocs][5])

For multi-step persistent changes, prefer `Ecto.Multi` or explicit transaction functions. `Ecto.Multi` groups multiple Repo operations into a single transaction and lets you inspect or compose the operations before executing them. ([Hexdocs][6])

---

## Example domain shape

```elixir
defmodule MyApp.Billing.Money do
  @enforce_keys [:amount, :currency]
  defstruct [:amount, :currency]

  @type t :: %__MODULE__{
          amount: integer(),
          currency: :USD | :EUR | :GBP
        }

  def new(amount, currency)
      when is_integer(amount) and amount >= 0 and currency in [:USD, :EUR, :GBP] do
    {:ok, %__MODULE__{amount: amount, currency: currency}}
  end

  def new(_, _), do: {:error, :invalid_money}
end
```

```elixir
defmodule MyApp.Orders.Order do
  alias MyApp.Orders.{Order, OrderPlaced}

  @enforce_keys [:id, :customer_id, :lines, :status]
  defstruct [:id, :customer_id, :lines, :status]

  def place(attrs) do
    with {:ok, order} <- build_order(attrs),
         :ok <- ensure_has_lines(order) do
      {:ok, order, [%OrderPlaced{order_id: order.id, customer_id: order.customer_id}]}
    end
  end

  defp ensure_has_lines(%Order{lines: [_ | _]}), do: :ok
  defp ensure_has_lines(_), do: {:error, :empty_order}
end
```

Notice that this module does **not** know about `Repo`, HTTP clients, `GenServer`, queues, or supervision. It transforms data and returns facts.

---

# 2. Separate functional core from effect shell

The most reliable shape is:

```text
Pure domain logic
    ↓
Command / application service
    ↓
Effect adapters: Repo, HTTP, email, queue, clock, UUID, process messaging
    ↓
Supervised runtime
```

## Functional core

Pure modules should:

* Accept explicit inputs.
* Return explicit outputs.
* Return `{:ok, value}` / `{:error, reason}` for expected business failures.
* Avoid `Repo`, HTTP clients, `Logger`, process messaging, `Application.get_env/2`, timers, and global process names.
* Be heavily unit-tested and property-tested where useful.

## Effect shell

Effectful modules should:

* Orchestrate domain functions.
* Call the database, network, file system, queues, or processes.
* Use transactions and idempotency.
* Emit telemetry/logs.
* Enforce timeouts.
* Convert external errors into domain/application errors.

Example:

```elixir
defmodule MyApp.Orders do
  alias Ecto.Multi
  alias MyApp.Repo
  alias MyApp.Orders.{Order, OrderSchema, EventSchema}

  def place_order(attrs) do
    with {:ok, order, events} <- Order.place(attrs) do
      Multi.new()
      |> Multi.insert(:order, OrderSchema.changeset(%OrderSchema{}, order))
      |> Multi.insert_all(:events, EventSchema, Enum.map(events, &event_row/1))
      |> Repo.transaction()
      |> case do
        {:ok, %{order: order_schema}} ->
          {:ok, order_schema}

        {:error, _step, reason, _changes_so_far} ->
          {:error, reason}
      end
    end
  end
end
```

For irreversible external effects—email, payment capture, webhook delivery—avoid doing the effect directly inside the same transaction. Prefer:

```text
transaction:
  write business state
  write outbox/job/event row

after commit:
  supervised worker delivers effect idempotently
```

That keeps recovery deterministic.

---

# 3. When to use OTP

Use a process only when you need a **runtime property**. The GenServer docs are explicit: a GenServer/process should model runtime characteristics such as mutable state, concurrency, and failure; it should not be used merely for code organization. ([Hexdocs][7])

## OTP decision table

| Need                                    | Use                                     | Avoid                                    |
| --------------------------------------- | --------------------------------------- | ---------------------------------------- |
| Stateless calculation                   | Plain module/function                   | GenServer                                |
| Shared simple state                     | Agent, but only for simple cases        | Complex Agent callbacks                  |
| Long-lived stateful server              | GenServer                               | Raw `receive` loops                      |
| One-shot concurrent work tied to caller | `Task.async` / `Task.await`             | Naked `spawn`                            |
| One-shot work that should be supervised | `Task.Supervisor`                       | Fire-and-forget process                  |
| Dynamic runtime children                | `DynamicSupervisor`                     | Manual process registry                  |
| Dynamic process lookup                  | `Registry`                              | Dynamically generated atoms              |
| Explicit finite-state machine           | `:gen_statem`                           | Hand-rolled state machine in a GenServer |
| High-read shared in-memory table        | ETS owned by supervised process         | GenServer bottleneck for every read      |
| Non-OTP subsystem                       | `:supervisor_bridge` or adapter process | Unmanaged external process tree          |

---

## GenServer

Use a GenServer when at least one is true:

* It owns mutable runtime state.
* It serializes access to a resource.
* It represents a long-lived actor/entity/session.
* It needs to receive asynchronous messages.
* It needs timers or periodic work.
* It needs to participate in supervision and restart semantics.
* It is a failure boundary.

Do **not** use a GenServer for:

* Stateless service modules.
* Pure business logic.
* “Manager” modules with no state.
* Wrapping every database call.
* Hiding code behind a single process “because OTP.”

A GenServer supports synchronous `call`, asynchronous `cast`, ordinary messages via `handle_info`, standard tracing/error-reporting behavior, and participation in a supervision tree. ([Hexdocs][7])

A canonical GenServer shape:

```elixir
defmodule MyApp.Sessions.SessionServer do
  use GenServer

  alias MyApp.Sessions.Session

  # Client API

  def start_link(opts) do
    session_id = Keyword.fetch!(opts, :session_id)

    GenServer.start_link(
      __MODULE__,
      opts,
      name: via(session_id)
    )
  end

  def snapshot(session_id) do
    GenServer.call(via(session_id), :snapshot)
  end

  def apply_event(session_id, event) do
    GenServer.call(via(session_id), {:apply_event, event})
  end

  # Server callbacks

  @impl true
  def init(opts) do
    session_id = Keyword.fetch!(opts, :session_id)
    state = Session.load_or_new(session_id)
    {:ok, state}
  end

  @impl true
  def handle_call(:snapshot, _from, state) do
    {:reply, Session.snapshot(state), state}
  end

  @impl true
  def handle_call({:apply_event, event}, _from, state) do
    case Session.apply_event(state, event) do
      {:ok, new_state, reply} -> {:reply, reply, new_state}
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  defp via(session_id) do
    {:via, Registry, {MyApp.SessionRegistry, session_id}}
  end
end
```

The public API hides OTP details. Callers do not manually assemble messages.

---

## Agent

Use `Agent` for very simple shared state when the state operations are trivial. Agents are explicitly described as a simple abstraction around state. ([Hexdocs][8])

Good Agent use:

```elixir
defmodule MyApp.FeatureFlags.Cache do
  use Agent

  def start_link(_opts), do: Agent.start_link(fn -> %{} end, name: __MODULE__)
  def get(key), do: Agent.get(__MODULE__, &Map.get(&1, key))
  def put(key, value), do: Agent.update(__MODULE__, &Map.put(&1, key, value))
end
```

Avoid Agents when the state has protocol, lifecycle, timers, external messages, backpressure, or complex transitions. Use a GenServer instead.

---

## Task and Task.Supervisor

Use `Task` for one-shot concurrent work. `Task.async` links the caller and task; if one crashes, the other crashes too. That is correct when the task only exists to compute a value for that caller. ([Hexdocs][9])

Use `Task.Supervisor` when tasks should be started under supervision, when work may fail independently, or when the caller should not be linked to the task. The official docs describe `Task.Supervisor` as a supervisor for dynamically supervised tasks, and they recommend starting it under a supervision tree for production code. ([Hexdocs][10])

Example:

```elixir
children = [
  {Task.Supervisor, name: MyApp.TaskSupervisor}
]
```

```elixir
Task.Supervisor.async_nolink(MyApp.TaskSupervisor, fn ->
  MyApp.Email.deliver(message)
end)
```

Inside a GenServer, prefer `Task.Supervisor.async_nolink/2` for risky work, then handle both the result message and the `:DOWN` message in `handle_info/2`.

---

## DynamicSupervisor

Use `DynamicSupervisor` when the set of children is not known at application boot: sessions, game rooms, device connections, workflow instances, tenants, workers per external subscription, and so on.

A `DynamicSupervisor` starts with no children and starts them on demand. It is optimized for dynamic children and can scale to very large numbers of children; for high start-rate bottlenecks, the docs recommend partitioning with `PartitionSupervisor`. ([Hexdocs][11])

Example:

```elixir
children = [
  {DynamicSupervisor,
   name: MyApp.SessionSupervisor,
   strategy: :one_for_one}
]
```

```elixir
DynamicSupervisor.start_child(
  MyApp.SessionSupervisor,
  {MyApp.Sessions.SessionServer, session_id: session_id}
)
```

---

## Registry

Use `Registry` for dynamic process names. A local Registry is decentralized and scalable, and supports unique or duplicate keys. ([Hexdocs][12])

Use:

```elixir
{:via, Registry, {MyApp.SessionRegistry, session_id}}
```

Avoid dynamically creating atoms for names. The GenServer docs warn that atoms are not garbage-collected, so dynamically generated names should use a registry rather than atoms. ([Hexdocs][7])

---

## `:gen_statem`

Use `:gen_statem` when the primary complexity is an explicit state machine:

```text
:pending -> :authorized -> :captured -> :settled
:pending -> :cancelled
:authorized -> :voided
```

It is the modern OTP state-machine behavior and supersedes `gen_fsm` for new code. ([Erlang.org][13])

A GenServer can handle simple state, but if the logic is full of “only this event is valid in this state,” `:gen_statem` usually produces a clearer design.

---

## ETS

Use ETS for high-throughput, shared, in-memory data when a GenServer would become a read bottleneck. ETS supports atomic and isolated updates to single objects and can be configured for read/write concurrency, but full-table traversals do not provide a consistent snapshot if concurrent updates are happening. ([Erlang.org][14])

Canonical ETS rule:

```text
A supervised process owns the ETS table.
Other processes may read/write only according to the access policy.
The table is a cache/index/runtime optimization, not an invisible domain model.
```

---

# 4. Designing the supervision tree

Supervision trees should be organized by **failure domains**, not by source-code directories.

A good supervision tree answers:

1. What can fail independently?
2. What must be restarted together?
3. What state is lost on restart?
4. Can that state be rebuilt?
5. What is the correct startup order?
6. What is the correct shutdown order?
7. Which children are static?
8. Which children are dynamic?
9. What restart intensity prevents crash loops?
10. What shutdown timeout is safe?

Supervisors support `:one_for_one`, `:one_for_all`, and `:rest_for_one`: restart only the failed child, restart all children, or restart the failed child plus children started after it. ([Hexdocs][15])

## Default strategy

Use `:one_for_one` by default.

```elixir
Supervisor.start_link(children, strategy: :one_for_one)
```

Use `:one_for_all` when children are meaningless unless all are restarted together.

Use `:rest_for_one` when children listed later depend on children listed earlier.

Example:

```elixir
defmodule MyApp.Workflows.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    children = [
      {Registry, keys: :unique, name: MyApp.WorkflowRegistry},
      {DynamicSupervisor,
       name: MyApp.WorkflowRunSupervisor,
       strategy: :one_for_one}
    ]

    Supervisor.init(children, strategy: :rest_for_one)
  end
end
```

Here, if the registry dies, the dynamic supervisor and its children should also restart because their names/registrations are no longer trustworthy.

---

## Static vs dynamic children

Use normal `Supervisor` for static children known at boot:

```elixir
children = [
  MyApp.Repo,
  {Registry, keys: :unique, name: MyApp.Registry},
  {Task.Supervisor, name: MyApp.TaskSupervisor},
  MyApp.Workflows.Supervisor,
  MyApp.Cache.Supervisor
]
```

Use `DynamicSupervisor` for children created at runtime.

---

## Restart values

Each child has a restart policy:

| Policy       | Meaning                       | Typical use                               |
| ------------ | ----------------------------- | ----------------------------------------- |
| `:permanent` | Always restart                | Core services, servers, infrastructure    |
| `:transient` | Restart only on abnormal exit | Job/process that may complete normally    |
| `:temporary` | Never restart                 | One-off task, explicitly disposable child |

The Supervisor docs define child specs with restart and shutdown options, and restart values control whether a terminated child should be restarted. ([Hexdocs][15])

A common mistake is marking every worker `:permanent`. If a worker represents a job that can complete successfully, `:transient` or `:temporary` is usually more accurate.

---

## Startup and shutdown order

A supervisor starts children in the listed order and shuts them down in reverse order. ([Hexdocs][15])

Therefore:

```elixir
children = [
  MyApp.Database,
  MyApp.Registry,
  MyApp.WorkerSupervisor,
  MyApp.HttpEndpoint
]
```

means:

```text
startup:  Database -> Registry -> WorkerSupervisor -> HttpEndpoint
shutdown: HttpEndpoint -> WorkerSupervisor -> Registry -> Database
```

That is usually what you want: stop accepting work first, drain/stop workers next, then shut down dependencies.

---

# 5. Are unsupervised processes allowed?

## Canonical rule

**No long-lived, production-significant process should be unsupervised.**

A process is production-significant if it:

* Owns state that matters.
* Owns a socket, file, timer, subscription, lock, ETS table, or external resource.
* Performs business work.
* Needs cleanup.
* Must be observable.
* Should be restarted or explicitly not restarted.
* Could leak memory, messages, or resources.

Such a process belongs under a supervisor.

The Elixir guide on dynamic supervision states the practical rule directly: processes should be started inside supervisors. ([Hexdocs][16])

## Acceptable exceptions

Unsupervised or not-directly-supervised processes may be acceptable only when all of this is true:

```text
The process is short-lived.
Its owner is clear.
Its failure is observed, linked, monitored, or irrelevant.
It owns no critical resource.
Its lifetime is bounded.
It cannot silently accumulate.
```

Acceptable examples:

```elixir
task = Task.async(fn -> expensive_pure_calculation(input) end)
result = Task.await(task)
```

That task is linked to the caller, and the caller awaits it.

Also acceptable:

* IEx experiments.
* Mix tasks/scripts.
* Test helper processes.
* A short-lived process linked to a supervised parent and explicitly monitored.
* A library-internal process whose lifecycle is already managed by the library.

Not acceptable:

```elixir
spawn(fn -> send_email(order) end)
```

That loses failure visibility, retry policy, shutdown control, and observability.

Prefer:

```elixir
Task.Supervisor.start_child(MyApp.TaskSupervisor, fn ->
  MyApp.Email.deliver(order)
end)
```

For a subsystem that is not designed according to OTP principles, use a supervisor bridge or an adapter process that connects it into the supervision tree. `:supervisor_bridge` exists specifically to connect a non-OTP subsystem to a supervision tree. ([Erlang.org][17])

---

# 6. Process quality criteria

Every process should have a design note answering these questions.

## Lifecycle

```text
Why does this process exist?
Who starts it?
Who stops it?
Is it static or dynamic?
What is its restart policy?
What is its shutdown timeout?
What happens if it crashes?
What state is lost?
How is state recovered?
```

## State

```text
Is the state authoritative or cached?
If authoritative, where is it persisted?
If cached, how is it invalidated?
Can two processes own the same logical state?
Can this process be restarted without corrupting external state?
```

## Messages

```text
What messages does it accept?
Which are synchronous calls?
Which are async casts?
Which are raw messages?
What is the timeout policy?
What prevents mailbox growth?
What happens under overload?
```

## Effects

```text
Does it call external services?
Are external calls idempotent?
Are retries bounded?
Is there backoff?
Are irreversible effects protected by an outbox/idempotency key?
```

## Observability

```text
Is the process named or discoverable?
Does it emit telemetry?
Are errors logged with useful metadata?
Can we inspect state safely?
Are mailbox size, reductions, memory, and restart counts observable?
```

## Testing

```text
Can pure logic be tested without a process?
Can the process be tested with controlled messages?
Are crash/restart scenarios tested?
Are timeout paths tested?
Are duplicate-delivery and retry paths tested?
```

---

# 7. Module organization

A practical structure:

```text
lib/my_app/
  application.ex

  accounts/
    accounts.ex                 # public context API / effect shell
    account.ex                  # domain struct / pure logic
    user.ex                     # domain struct / pure logic
    schemas/
      account_schema.ex         # Ecto persistence shape
      user_schema.ex
    commands/
      register_user.ex
    events/
      user_registered.ex

  orders/
    orders.ex
    order.ex
    line_item.ex
    schemas/
    commands/
    events/

  workflows/
    supervisor.ex
    registry.ex
    workflow_server.ex
    workflow_state.ex

  runtime/
    task_supervisor.ex
    cache_owner.ex
```

The public context module, such as `MyApp.Orders`, is allowed to orchestrate effects. Domain modules, such as `MyApp.Orders.Order`, should remain pure unless there is an explicit reason not to.

---

# 8. Design workflow for a complex feature

Use this sequence for each major feature.

## Step 1: Define the business operation

```text
Command: PlaceOrder
Inputs: customer_id, cart_id, payment_method_id
Outputs: order, events
Errors: cart_empty, customer_blocked, payment_failed
```

## Step 2: Define data and invariants

```text
Order cannot be empty.
Order total must be non-negative.
Customer must be active.
Payment authorization must be idempotent.
Inventory reservation must be atomic.
```

## Step 3: Decide consistency boundary

```text
Same DB transaction:
  create order
  reserve inventory
  write outbox event

Outside transaction:
  send confirmation email
  publish integration event
  capture payment if authorization model allows delayed capture
```

## Step 4: Implement pure transition

```elixir
Order.place(command, cart, customer)
#=> {:ok, order, events}
#=> {:error, reason}
```

## Step 5: Implement effect orchestration

```elixir
Repo.transaction(fn ->
  # load rows
  # call pure domain logic
  # persist state
  # persist outbox events
end)
```

## Step 6: Add OTP only where runtime ownership exists

Use a process if the operation becomes long-running, concurrent, or stateful:

```text
No process:
  simple transactional command

Task:
  parallel pure calculations or independent I/O

Task.Supervisor:
  supervised one-shot background work

GenServer:
  stateful session, connection, lock owner, rate limiter, workflow runner

DynamicSupervisor:
  many runtime-created GenServers

Registry:
  lookup by business key

:gen_statem:
  explicit workflow state machine
```

## Step 7: Define failure behavior

```text
If payment call fails: retry? compensate? mark pending?
If worker crashes after DB commit but before email: outbox retries.
If process restarts: reload state from DB.
If duplicate command arrives: idempotency key returns prior result.
```

---

# 9. Common anti-patterns

## Anti-pattern: “One GenServer per context”

```elixir
defmodule MyApp.OrdersServer do
  use GenServer

  def place_order(attrs) do
    GenServer.call(__MODULE__, {:place_order, attrs})
  end
end
```

This serializes all order placement through one process for no reason.

Prefer:

```elixir
defmodule MyApp.Orders do
  def place_order(attrs) do
    # pure logic + transaction + effects
  end
end
```

Use a GenServer only if there is runtime state or concurrency control that must be owned.

---

## Anti-pattern: “Database cache in a GenServer”

A single GenServer cache can become a bottleneck and a consistency trap.

Prefer:

* Query the database directly if fast enough.
* Use ETS for high-read local cache.
* Use explicit invalidation.
* Use persistent read models for expensive queries.
* Use a supervised cache owner if ETS is needed.

---

## Anti-pattern: “Fire and forget”

```elixir
spawn(fn -> do_important_work() end)
```

Prefer:

```elixir
Task.Supervisor.start_child(MyApp.TaskSupervisor, fn ->
  do_important_work()
end)
```

or a durable job/outbox if the work must survive node crashes.

---

## Anti-pattern: “Let it crash” without recovery design

“Let it crash” is not a substitute for:

* Idempotency.
* State recovery.
* Transactional boundaries.
* External side-effect safety.
* Restart intensity limits.
* Observability.

A crash is fine only when restart is safe.

---

# 10. Review rubric

A complex Elixir/OTP application is well-designed when these are true:

## Data

* Domain structs are meaningful and not just database rows.
* Ecto schemas do not blindly mirror UI/API shapes.
* Validations and database constraints are used in the right places.
* Race-sensitive invariants are enforced by the database or another authoritative serialization point.
* Commands and events are explicit.
* State ownership is clear.

## Functional core

* Most business rules are pure functions.
* Pure modules do not call `Repo`, HTTP clients, timers, process APIs, or config.
* Expected business errors are returned as data.
* Pure logic is easy to test without booting supervision trees.

## Effects

* Effects happen at application/service boundaries.
* Transactions are explicit.
* External effects are idempotent or protected by outbox/job records.
* Retries are bounded and observable.
* Timeouts are explicit.

## OTP usage

* Processes model runtime concerns, not code organization.
* Long-lived processes are supervised.
* Dynamic children are under `DynamicSupervisor`.
* One-shot supervised work uses `Task.Supervisor`.
* Dynamic names use `Registry`, not generated atoms.
* Restart policies match the child’s lifecycle.
* Supervisors are grouped by failure domain.
* Startup and shutdown order are intentional.

## Operations

* Process names and telemetry make the system inspectable.
* Mailbox growth, restarts, memory, and latency are observable.
* Crash/restart paths are tested.
* Shutdown is graceful.
* Backpressure exists where load can exceed capacity.
* No important work disappears silently.

---

# Canonical summary

Design in this order:

```text
1. Model the domain data.
2. Identify invariants and consistency boundaries.
3. Keep business transitions pure.
4. Put effects in explicit orchestration layers.
5. Use OTP only for runtime ownership, concurrency, failure, and lifecycle.
6. Build supervision trees around failure domains.
7. Supervise all long-lived or significant processes.
8. Make every restart safe, observable, and bounded.
```

The strongest Elixir systems are not “all OTP everywhere.” They are mostly pure, explicit data transformations, with OTP used precisely where the system needs durable runtime structure.

[1]: https://www.erlang.org/doc/system/design_principles.html "Overview — Erlang System Documentation v28.5"
[2]: https://hexdocs.pm/elixir/Application.html "Application — Elixir v1.19.5"
[3]: https://hexdocs.pm/ecto/Ecto.Schema.html "Ecto.Schema — Ecto v3.13.6"
[4]: https://hexdocs.pm/ecto/data-mapping-and-validation.html "Data mapping and validation — Ecto v3.13.6"
[5]: https://hexdocs.pm/ecto/Ecto.Changeset.html "Ecto.Changeset — Ecto v3.13.6"
[6]: https://hexdocs.pm/ecto/Ecto.Multi.html "Ecto.Multi — Ecto v3.13.6"
[7]: https://hexdocs.pm/elixir/GenServer.html "GenServer — Elixir v1.19.5"
[8]: https://hexdocs.pm/elixir/Agent.html "Agent — Elixir v1.19.5"
[9]: https://hexdocs.pm/elixir/Task.html "Task — Elixir v1.19.5"
[10]: https://hexdocs.pm/elixir/Task.Supervisor.html "Task.Supervisor — Elixir v1.19.5"
[11]: https://hexdocs.pm/elixir/DynamicSupervisor.html "DynamicSupervisor — Elixir v1.19.5"
[12]: https://hexdocs.pm/elixir/Registry.html "Registry — Elixir v1.19.5"
[13]: https://www.erlang.org/doc/apps/stdlib/gen_statem.html "gen_statem — stdlib v7.3"
[14]: https://www.erlang.org/doc/apps/stdlib/ets.html "ets — stdlib v7.3"
[15]: https://hexdocs.pm/elixir/Supervisor.html "Supervisor — Elixir v1.19.5"
[16]: https://hexdocs.pm/elixir/dynamic-supervisor.html "Supervising dynamic children — Elixir v1.19.5"
[17]: https://www.erlang.org/doc/apps/stdlib/supervisor_bridge.html "supervisor_bridge — stdlib v7.3"
