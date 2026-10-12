/* Fabricated offline source and hand-authored mappings. No analysis or execution occurs. */
window.ATLAS_FILES = [
  {
    "path": "fixture/lib/relay/application.ex",
    "name": "application.ex",
    "kind": "infrastructure",
    "goals": [],
    "reason": "Starts the application; machinery without a direct product requirement.",
    "source": "defmodule Relay.Application do\n  use Application\n\n  def start(_type, _args) do\n    children = [Relay.Repo, Relay.RootSupervisor]\n    Supervisor.start_link(children, strategy: :one_for_one)\n  end\nend\n",
    "line": 1,
    "loc": 8,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/root_supervisor.ex",
    "name": "root_supervisor.ex",
    "kind": "supervisor",
    "goals": [
      "reconcile"
    ],
    "reason": "Restarts processes; does not restore their previous memory.",
    "source": "defmodule Relay.RootSupervisor do\n  use Supervisor\n\n  def start_link(opts), do: Supervisor.start_link(__MODULE__, opts, name: __MODULE__)\n\n  def init(_opts) do\n    children = [\n      {Registry, keys: :unique, name: Relay.Registry},\n      Relay.Authority, Relay.ValidationGate, Relay.Dispatcher,\n      Relay.RetryBroker, Relay.StatusProjector, Relay.LeaseKeeper,\n      Relay.WorkerSupervisor\n    ]\n    Supervisor.init(children, strategy: :one_for_one)\n  end\nend\n",
    "line": 13,
    "loc": 15,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/authority.ex",
    "name": "authority.ex",
    "kind": "actor",
    "goals": [
      "authorize",
      "commit",
      "reconcile"
    ],
    "reason": "Owns a command admission cache; journal is durable authority.",
    "source": "defmodule Relay.Authority do\n  use GenServer\n  alias Relay.{Policy, Journal}\n\n  def start_link(opts), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)\n  def submit(command), do: GenServer.call(__MODULE__, {:submit, command})\n\n  def init(_), do: {:ok, %{pending: %{}, epoch: 1}}\n\n  def handle_call({:submit, command}, _from, state) do\n    with :ok <- Relay.ValidationGate.check(command),\n         :ok <- Policy.authorize(command),\n         {:ok, record} <- Journal.accept(command) do\n      Relay.Dispatcher.dispatch(record)\n      pending = Map.put(state.pending, command.id, record)\n      {:reply, {:accepted, command.id}, %{state | pending: pending}}\n    else\n      {:error, reason} -> {:reply, {:error, reason}, state}\n    end\n  end\nend\n",
    "line": 10,
    "loc": 21,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/policy.ex",
    "name": "policy.ex",
    "kind": "pure",
    "goals": [
      "authorize"
    ],
    "reason": "Authorization is a decision; it does not require a process.",
    "source": "defmodule Relay.Policy do\n  def authorize(%{actor: actor, device: device, action: action}) do\n    cond do\n      not actor.enabled -> {:error, :actor_disabled}\n      device.site_id not in actor.site_ids -> {:error, :wrong_site}\n      action not in actor.allowed_actions -> {:error, :not_allowed}\n      true -> :ok\n    end\n  end\nend\n",
    "line": 2,
    "loc": 10,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/validation_gate.ex",
    "name": "validation_gate.ex",
    "kind": "actor",
    "goals": [
      "authorize"
    ],
    "reason": "A GenServer wraps a pure validator. No runtime reason is declared.",
    "source": "defmodule Relay.ValidationGate do\n  use GenServer\n\n  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)\n  def check(command), do: GenServer.call(__MODULE__, {:check, command})\n  def init(state), do: {:ok, state}\n\n  def handle_call({:check, command}, _from, state) do\n    {:reply, Relay.Command.validate(command), state}\n  end\nend\n",
    "line": 8,
    "loc": 11,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/command.ex",
    "name": "command.ex",
    "kind": "pure",
    "goals": [
      "authorize",
      "commit"
    ],
    "reason": "Validates values and carries the stable command identifier.",
    "source": "defmodule Relay.Command do\n  @enforce_keys [:id, :actor, :device, :action]\n  defstruct [:id, :actor, :device, :action, payload: %{}]\n\n  def validate(%__MODULE__{id: id, action: action, payload: payload}) do\n    cond do\n      not is_binary(id) -> {:error, :missing_id}\n      action not in [:open, :close, :set_limit] -> {:error, :invalid_action}\n      not is_map(payload) -> {:error, :invalid_payload}\n      true -> :ok\n    end\n  end\nend\n",
    "line": 5,
    "loc": 13,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/journal.ex",
    "name": "journal.ex",
    "kind": "storage",
    "goals": [
      "commit",
      "reconcile",
      "report"
    ],
    "reason": "Durable command status survives a worker crash; NOT external device truth.",
    "source": "defmodule Relay.Journal do\n  import Ecto.Query\n  alias Relay.{Repo, CommandRecord}\n\n  def accept(command) do\n    %CommandRecord{}\n    |> CommandRecord.changeset(Map.from_struct(command))\n    |> Repo.insert(on_conflict: :nothing, conflict_target: :command_id)\n  end\n\n  def fetch(id), do: Repo.get_by!(CommandRecord, command_id: id)\n\n  def mark_unknown(id) do\n    from(c in CommandRecord, where: c.command_id == ^id)\n    |> Repo.update_all(set: [status: :unknown])\n  end\n\n  def complete(id, receipt) do\n    from(c in CommandRecord, where: c.command_id == ^id)\n    |> Repo.update_all(set: [status: :completed, receipt: receipt])\n  end\nend\n",
    "line": 11,
    "loc": 22,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/command_record.ex",
    "name": "command_record.ex",
    "kind": "storage",
    "goals": [
      "commit"
    ],
    "reason": "A unique ID prevents duplicate journal rows, not duplicate device writes.",
    "source": "defmodule Relay.CommandRecord do\n  use Ecto.Schema\n  import Ecto.Changeset\n\n  schema \"commands\" do\n    field :command_id, :string\n    field :status, Ecto.Enum, values: [:pending, :unknown, :completed]\n    field :payload, :map\n    field :receipt, :string\n    timestamps()\n  end\n\n  def changeset(record, attrs) do\n    record\n    |> cast(attrs, [:command_id, :payload, :status])\n    |> validate_required([:command_id])\n    |> unique_constraint(:command_id)\n  end\nend\n",
    "line": 17,
    "loc": 19,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/repo.ex",
    "name": "repo.ex",
    "kind": "dependency",
    "goals": [
      "commit",
      "reconcile"
    ],
    "reason": "Dependency envelope: Ecto + SQL driver + pool. Internal resources are not counted.",
    "source": "defmodule Relay.Repo do\n  use Ecto.Repo,\n    otp_app: :relay,\n    adapter: Ecto.Adapters.Postgres\nend\n",
    "line": 1,
    "loc": 5,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/dispatcher.ex",
    "name": "dispatcher.ex",
    "kind": "actor",
    "goals": [
      "commit",
      "reconcile"
    ],
    "reason": "Message hop into worker creation; throughput isolation is not documented.",
    "source": "defmodule Relay.Dispatcher do\n  use GenServer\n\n  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)\n  def dispatch(record), do: GenServer.cast(__MODULE__, {:dispatch, record})\n  def init(state), do: {:ok, state}\n\n  def handle_cast({:dispatch, record}, state) do\n    Relay.WorkerSupervisor.start_command(record.command_id)\n    {:noreply, state}\n  end\nend\n",
    "line": 8,
    "loc": 12,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/worker_supervisor.ex",
    "name": "worker_supervisor.ex",
    "kind": "supervisor",
    "goals": [
      "reconcile"
    ],
    "reason": "Failure isolation for command workers. Restart policy is separate from recovery.",
    "source": "defmodule Relay.WorkerSupervisor do\n  use DynamicSupervisor\n\n  def start_link(opts), do: DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)\n  def init(_), do: DynamicSupervisor.init(strategy: :one_for_one)\n\n  def start_command(id) do\n    DynamicSupervisor.start_child(__MODULE__, {Relay.Worker, id})\n  end\nend\n",
    "line": 7,
    "loc": 10,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/worker.ex",
    "name": "worker.ex",
    "kind": "actor",
    "goals": [
      "commit",
      "reconcile"
    ],
    "reason": "Owns transient attempt state. Restart reloads journal but blindly dispatches.",
    "source": "defmodule Relay.Worker do\n  use GenServer, restart: :transient\n  alias Relay.{Journal, RecoveryPolicy, DeviceAdapter}\n\n  def start_link(id), do: GenServer.start_link(__MODULE__, id)\n\n  def init(id) do\n    record = Journal.fetch(id)\n    state = %{id: id, attempts: 0, outcome: :unknown, record: record}\n    {:ok, state, {:continue, :recover}}\n  end\n\n  def handle_continue(:recover, state) do\n    case RecoveryPolicy.next(state.record) do\n      :dispatch -> send(self(), :execute)\n      :reconcile -> send(self(), :readback)\n      :stop -> :ok\n    end\n    {:noreply, state}\n  end\n\n  def handle_info(:execute, state) do\n    result = DeviceAdapter.write(state.id, state.record.payload)\n    case result do\n      {:ok, receipt} -> Journal.complete(state.id, receipt)\n      {:error, :timeout} -> Journal.mark_unknown(state.id)\n    end\n    {:noreply, %{state | attempts: state.attempts + 1}}\n  end\nend\n",
    "line": 13,
    "loc": 30,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/recovery_policy.ex",
    "name": "recovery_policy.ex",
    "kind": "pure",
    "goals": [
      "reconcile"
    ],
    "reason": "The requirement/code disagreement: unknown outcomes take the dispatch branch.",
    "source": "defmodule Relay.RecoveryPolicy do\n  @moduledoc \"Choose the next action from durable progress.\"\n\n  def next(%{status: :completed}), do: :stop\n  def next(%{status: :pending}), do: :dispatch\n\n  # A timeout is not evidence that the device did nothing.\n  # This fixture intentionally violates the declared no-blind-replay requirement.\n  def next(%{status: :unknown}), do: :dispatch\nend\n",
    "line": 9,
    "loc": 10,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/retry_broker.ex",
    "name": "retry_broker.ex",
    "kind": "actor",
    "goals": [
      "reconcile"
    ],
    "reason": "A second retry owner stores a mirror of command attempt counts.",
    "source": "defmodule Relay.RetryBroker do\n  use GenServer\n\n  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)\n  def schedule(id), do: GenServer.cast(__MODULE__, {:retry, id})\n  def init(_), do: {:ok, %{attempts: %{}}}\n\n  def handle_cast({:retry, id}, state) do\n    count = Map.get(state.attempts, id, 0)\n    Process.send_after(self(), {:fire, id}, Relay.Backoff.delay(count))\n    {:noreply, %{state | attempts: Map.put(state.attempts, id, count + 1)}}\n  end\n\n  def handle_info({:fire, id}, state) do\n    Relay.WorkerSupervisor.start_command(id)\n    {:noreply, state}\n  end\nend\n",
    "line": 8,
    "loc": 18,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/backoff.ex",
    "name": "backoff.ex",
    "kind": "pure",
    "goals": [
      "reconcile"
    ],
    "reason": "Delay scheduling affects when to retry; it cannot establish that retry is safe.",
    "source": "defmodule Relay.Backoff do\n  def delay(attempt) when attempt >= 0 do\n    base = trunc(:math.pow(2, min(attempt, 8))) * 100\n    min(base, 30_000)\n  end\nend\n",
    "line": 2,
    "loc": 6,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/device_adapter.ex",
    "name": "device_adapter.ex",
    "kind": "effect",
    "goals": [
      "reconcile",
      "report"
    ],
    "reason": "Irreversible boundary: a device write can outlive the requesting process.",
    "source": "defmodule Relay.DeviceAdapter do\n  def write(id, payload) do\n    body = Relay.Encoder.encode(id, payload)\n    Relay.Transport.post(\"/commands\", body)\n  end\n\n  def readback(id) do\n    with {:ok, body} <- Relay.Transport.get(\"/commands/#{id}\"),\n         {:ok, receipt} <- Relay.Receipt.decode(body) do\n      {:ok, receipt}\n    end\n  end\nend\n",
    "line": 2,
    "loc": 13,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/transport.ex",
    "name": "transport.ex",
    "kind": "effect",
    "goals": [
      "reconcile",
      "report"
    ],
    "reason": "HTTP dependency boundary. Whether the device deduplicates is unknown.",
    "source": "defmodule Relay.Transport do\n  def post(path, body) do\n    request = Finch.build(:post, base_url() <> path, [], body)\n    case Finch.request(request, Relay.HTTP, receive_timeout: 1_500) do\n      {:ok, %{status: 200, body: reply}} -> {:ok, reply}\n      {:error, %Mint.TransportError{reason: :timeout}} -> {:error, :timeout}\n      other -> {:error, other}\n    end\n  end\n\n  def get(path) do\n    request = Finch.build(:get, base_url() <> path)\n    case Finch.request(request, Relay.HTTP) do\n      {:ok, %{body: body}} -> {:ok, body}\n      other -> {:error, other}\n    end\n  end\n\n  defp base_url, do: Application.fetch_env!(:relay, :device_url)\nend\n",
    "line": 4,
    "loc": 20,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/encoder.ex",
    "name": "encoder.ex",
    "kind": "pure",
    "goals": [
      "reconcile"
    ],
    "reason": "Serialization changes data shape, not authority or state ownership.",
    "source": "defmodule Relay.Encoder do\n  def encode(id, payload) do\n    Jason.encode!(%{command_id: id, payload: payload})\n  end\nend\n",
    "line": 2,
    "loc": 5,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/receipt.ex",
    "name": "receipt.ex",
    "kind": "pure",
    "goals": [
      "report",
      "reconcile"
    ],
    "reason": "Only a confirmed receipt can support completion in this fixture.",
    "source": "defmodule Relay.Receipt do\n  def decode(body) do\n    with {:ok, %{\"command_id\" => id, \"applied\" => true}} <- Jason.decode(body) do\n      {:ok, %{id: id, status: :applied}}\n    else\n      _ -> {:error, :unconfirmed}\n    end\n  end\nend\n",
    "line": 2,
    "loc": 9,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/status_projector.ex",
    "name": "status_projector.ex",
    "kind": "actor",
    "goals": [
      "report",
      "commit"
    ],
    "reason": "Process-local status mirror can diverge from durable command status.",
    "source": "defmodule Relay.StatusProjector do\n  use GenServer\n\n  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)\n  def get(id), do: GenServer.call(__MODULE__, {:get, id})\n  def init(_), do: {:ok, %{statuses: %{}}}\n\n  def handle_call({:get, id}, _from, state) do\n    status = Map.get(state.statuses, id, :pending)\n    {:reply, status, state}\n  end\n\n  def handle_cast({:status, id, value}, state) do\n    {:noreply, %{state | statuses: Map.put(state.statuses, id, value)}}\n  end\nend\n",
    "line": 8,
    "loc": 16,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/status.ex",
    "name": "status.ex",
    "kind": "pure",
    "goals": [
      "report"
    ],
    "reason": "Maps evidence into user-visible truth; unknown stays unknown.",
    "source": "defmodule Relay.Status do\n  def describe(:pending), do: %{label: \"Accepted\", final: false}\n  def describe(:unknown), do: %{label: \"Outcome unknown\", final: false}\n  def describe(:completed), do: %{label: \"Confirmed\", final: true}\n  def describe(other), do: %{label: inspect(other), final: false}\nend\n",
    "line": 3,
    "loc": 6,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/lease_keeper.ex",
    "name": "lease_keeper.ex",
    "kind": "actor",
    "goals": [
      "authorize",
      "reconcile"
    ],
    "reason": "Owns lease epochs. A fencing claim still requires downstream token enforcement.",
    "source": "defmodule Relay.LeaseKeeper do\n  use GenServer\n\n  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)\n  def claim(device), do: GenServer.call(__MODULE__, {:claim, device})\n  def init(_), do: {:ok, %{epochs: %{}}}\n\n  def handle_call({:claim, device}, _from, state) do\n    epoch = Map.get(state.epochs, device, 0) + 1\n    {:reply, {:ok, epoch}, %{state | epochs: Map.put(state.epochs, device, epoch)}}\n  end\nend\n",
    "line": 8,
    "loc": 12,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/fence.ex",
    "name": "fence.ex",
    "kind": "pure",
    "goals": [
      "authorize",
      "reconcile"
    ],
    "reason": "A process-local epoch is not a cross-node ownership proof.",
    "source": "defmodule Relay.Fence do\n  def current?(token, stored_epoch) when is_integer(token) do\n    token >= stored_epoch\n  end\n\n  def accept(_token, nil), do: {:error, :no_authority}\n  def accept(token, epoch) do\n    if current?(token, epoch), do: :ok, else: {:error, :stale_token}\n  end\nend\n",
    "line": 2,
    "loc": 10,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay_web/command_controller.ex",
    "name": "command_controller.ex",
    "kind": "effect",
    "goals": [
      "authorize",
      "report"
    ],
    "reason": "Public API converts HTTP into admission and evidence-qualified status.",
    "source": "defmodule RelayWeb.CommandController do\n  use RelayWeb, :controller\n\n  def create(conn, params) do\n    command = struct!(Relay.Command, RelayWeb.Input.decode(params))\n    case Relay.Authority.submit(command) do\n      {:accepted, id} -> conn |> put_status(202) |> json(%{id: id})\n      {:error, reason} -> conn |> put_status(422) |> json(%{error: reason})\n    end\n  end\n\n  def show(conn, %{\"id\" => id}) do\n    record = Relay.Journal.fetch(id)\n    json(conn, Relay.Status.describe(record.status))\n  end\nend\n",
    "line": 4,
    "loc": 16,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay_web/input.ex",
    "name": "input.ex",
    "kind": "pure",
    "goals": [
      "authorize"
    ],
    "reason": "Decodes API fields before domain validation.",
    "source": "defmodule RelayWeb.Input do\n  def decode(params) do\n    %{id: Map.fetch!(params, \"id\"),\n      action: action(Map.fetch!(params, \"action\")),\n      payload: Map.get(params, \"payload\", %{}),\n      actor: Map.fetch!(params, \"actor\"),\n      device: Map.fetch!(params, \"device\")}\n  end\n\n  defp action(\"open\"), do: :open\n  defp action(\"close\"), do: :close\n  defp action(\"set_limit\"), do: :set_limit\nend\n",
    "line": 2,
    "loc": 13,
    "variant": "current"
  },
  {
    "path": "fixture/lib/relay/telemetry.ex",
    "name": "telemetry.ex",
    "kind": "infrastructure",
    "goals": [],
    "reason": "Instrumentation supports understanding; no behavioral requirement mapping is approved.",
    "source": "defmodule Relay.Telemetry do\n  def observe(command_id, phase, metadata) do\n    :telemetry.execute([:relay, :command, phase], %{count: 1},\n      Map.put(metadata, :command_id, command_id))\n  end\nend\n",
    "line": 1,
    "loc": 6,
    "variant": "current"
  },
  {
    "path": "fixture/test/relay/policy_test.exs",
    "name": "policy_test.exs",
    "kind": "test",
    "goals": [
      "authorize"
    ],
    "reason": "Fixture test supports one denied command, not all authorization cases.",
    "source": "defmodule Relay.PolicyTest do\n  use ExUnit.Case\n\n  test \"disabled actors cannot issue commands\" do\n    command = %{actor: %{enabled: false}, device: %{}, action: :open}\n    assert {:error, :actor_disabled} = Relay.Policy.authorize(command)\n  end\nend\n",
    "line": 4,
    "loc": 8,
    "variant": "current"
  },
  {
    "path": "fixture/test/relay/recovery_test.exs",
    "name": "recovery_test.exs",
    "kind": "test",
    "goals": [
      "reconcile",
      "commit"
    ],
    "reason": "Fixture counterexample exposes blind replay. Not a minimized or executed proof.",
    "source": "defmodule Relay.RecoveryTest do\n  use ExUnit.Case\n\n  test \"unknown outcome requires reconciliation before retry\" do\n    durable_record = %{status: :unknown, command_id: \"cmd-42\"}\n    assert Relay.RecoveryPolicy.next(durable_record) == :reconcile\n  end\n\n  test \"completed command is not dispatched again\" do\n    assert Relay.RecoveryPolicy.next(%{status: :completed}) == :stop\n  end\nend\n",
    "line": 6,
    "loc": 12,
    "variant": "current"
  },
  {
    "path": "candidate/lib/relay/authority.ex",
    "name": "authority.ex",
    "kind": "actor",
    "goals": [
      "authorize",
      "commit",
      "reconcile",
      "report"
    ],
    "reason": "Candidate: one serialized admission owner. Cross-node fencing remains unresolved.",
    "source": "defmodule Relay.Authority do\n  use GenServer\n  alias Relay.{Policy, Journal, Decision, DeviceAdapter}\n\n  def start_link(opts), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)\n  def submit(command), do: GenServer.call(__MODULE__, {:submit, command})\n  def init(_), do: {:ok, %{in_flight: MapSet.new()}}\n\n  def handle_call({:submit, command}, _from, state) do\n    with :ok <- Policy.authorize(command),\n         {:ok, record} <- Journal.accept(command) do\n      action = Decision.next(record)\n      {:reply, {:accepted, record.command_id, action}, state}\n    else\n      {:error, reason} -> {:reply, {:error, reason}, state}\n    end\n  end\n\n  # Candidate architecture would run effect work in supervised tasks.\n  # Admission, cancellation and task-result handling still need design.\nend\n",
    "line": 9,
    "loc": 21,
    "variant": "candidate"
  },
  {
    "path": "candidate/lib/relay/decision.ex",
    "name": "decision.ex",
    "kind": "pure",
    "goals": [
      "reconcile",
      "authorize"
    ],
    "reason": "Candidate removes stateful wrappers and separates retry safety from delay.",
    "source": "defmodule Relay.Decision do\n  def next(%{status: :completed}), do: :stop\n  def next(%{status: :unknown}), do: :reconcile\n  def next(%{status: :pending}), do: :dispatch\n\n  def after_readback({:ok, %{status: :applied}}), do: :complete\n  def after_readback({:ok, %{status: :not_applied}}), do: :dispatch\n  def after_readback({:error, _}), do: :remain_unknown\nend\n",
    "line": 3,
    "loc": 9,
    "variant": "candidate"
  },
  {
    "path": "candidate/lib/relay/journal.ex",
    "name": "journal.ex",
    "kind": "storage",
    "goals": [
      "commit",
      "reconcile",
      "report"
    ],
    "reason": "Candidate keeps durable ownership. Pool and transaction machinery still exist.",
    "source": "defmodule Relay.Journal do\n  alias Relay.{Repo, CommandRecord}\n\n  def accept(command) do\n    %CommandRecord{}\n    |> CommandRecord.changeset(Map.from_struct(command))\n    |> Repo.insert(on_conflict: :nothing, conflict_target: :command_id)\n  end\n\n  def fetch(id), do: Repo.get_by!(CommandRecord, command_id: id)\n\n  def unknown(id) do\n    record = fetch(id)\n    record |> Ecto.Changeset.change(status: :unknown) |> Repo.update()\n  end\nend\n",
    "line": 10,
    "loc": 16,
    "variant": "candidate"
  },
  {
    "path": "candidate/lib/relay/device_adapter.ex",
    "name": "device_adapter.ex",
    "kind": "effect",
    "goals": [
      "reconcile",
      "report"
    ],
    "reason": "Candidate still depends on trustworthy device readback, not an automatic guarantee.",
    "source": "defmodule Relay.DeviceAdapter do\n  def perform(:dispatch, record) do\n    Relay.Transport.post(\"/commands\", Relay.Encoder.encode(record.command_id, record.payload))\n  end\n\n  def perform(:reconcile, record) do\n    Relay.Transport.get(\"/commands/#{record.command_id}\")\n  end\n\n  def perform(:stop, _record), do: {:ok, :already_completed}\nend\n",
    "line": 6,
    "loc": 11,
    "variant": "candidate"
  }
];
