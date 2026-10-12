(() => {
  // elixirscope-interface-lab-v2/src/codebase.ts
  var codebaseFiles = [
    // 1. Application entry
    {
      path: "lib/core/application.ex",
      module: "Core.Application",
      subsystem: "core",
      loc: 38,
      changeStatus: "INFRA",
      diffSummary: "Starts top-level supervision tree and node telemetry hooks",
      eventIds: [],
      directCallers: [],
      directCallees: ["lib/core/root_supervisor.ex"],
      symbols: [
        {
          id: "core_app_start",
          symbolKey: "Core.Application.start/2",
          name: "start/2",
          module: "Core.Application",
          kind: "callback",
          filePath: "lib/core/application.ex",
          span: { startLine: 12, endLine: 36, focusLine: 18 },
          callersCount: 1,
          calleesCount: 4,
          impactsEffect: false,
          isModified: false,
          docSummary: "OTP application entrypoint; registers node boot and boots RootSupervisor."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Core.Application do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Application entry for the distributed saga & recovery engine."', diffStatus: "context" },
        { num: 3, text: "  use Application", diffStatus: "context" },
        { num: 4, text: "  require Logger", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: "  @impl true", diffStatus: "context" },
        { num: 7, text: "  def start(_type, _args) do", diffStatus: "context" },
        { num: 8, text: "    :ok = Telemetry.SpanTracer.attach_default_handlers()", diffStatus: "context" },
        { num: 9, text: '    Logger.info("Booting Core.Application node=#{node()} pid=#{inspect(self())}")', diffStatus: "context" },
        { num: 10, text: "", diffStatus: "context" },
        { num: 11, text: "    children = [", diffStatus: "context" },
        { num: 12, text: "      {Cluster.NodeMonitor, name: Cluster.NodeMonitor},", diffStatus: "context" },
        { num: 13, text: "      {Cluster.RingManager, name: Cluster.RingManager},", diffStatus: "context" },
        { num: 14, text: "      {Core.RootSupervisor, []}", diffStatus: "context" },
        { num: 15, text: "    ]", diffStatus: "context" },
        { num: 16, text: "", diffStatus: "context" },
        { num: 17, text: "    opts = [strategy: :one_for_one, name: Core.Supervisor]", diffStatus: "context" },
        { num: 18, text: "    Supervisor.start_link(children, opts)", diffStatus: "focus" },
        { num: 19, text: "  end", diffStatus: "context" },
        { num: 20, text: "end", diffStatus: "context" }
      ]
    },
    // 2. Root Supervisor
    {
      path: "lib/core/root_supervisor.ex",
      module: "Core.RootSupervisor",
      subsystem: "core",
      loc: 44,
      changeStatus: "INFRA",
      diffSummary: "Hierarchical :rest_for_one supervisor guarding storage before pipeline",
      eventIds: [],
      directCallers: ["lib/core/application.ex"],
      directCallees: ["lib/storage/repo.ex", "lib/pipeline/worker_supervisor.ex"],
      symbols: [
        {
          id: "root_sup_init",
          symbolKey: "Core.RootSupervisor.init/1",
          name: "init/1",
          module: "Core.RootSupervisor",
          kind: "callback",
          filePath: "lib/core/root_supervisor.ex",
          span: { startLine: 16, endLine: 40, focusLine: 24 },
          callersCount: 1,
          calleesCount: 4,
          impactsEffect: false,
          isModified: false,
          docSummary: "Initializes root subsystem children with :rest_for_one fault isolation."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Core.RootSupervisor do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Root supervisor maintaining storage subsystems and worker dynamic tree."', diffStatus: "context" },
        { num: 3, text: "  use Supervisor", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def start_link(init_arg) do", diffStatus: "context" },
        { num: 6, text: "    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)", diffStatus: "context" },
        { num: 7, text: "  end", diffStatus: "context" },
        { num: 8, text: "", diffStatus: "context" },
        { num: 9, text: "  @impl true", diffStatus: "context" },
        { num: 10, text: "  def init(_init_arg) do", diffStatus: "context" },
        { num: 11, text: "    children = [", diffStatus: "context" },
        { num: 12, text: "      Storage.Repo,", diffStatus: "context" },
        { num: 13, text: "      Storage.Journal,", diffStatus: "context" },
        { num: 14, text: "      Gateway.CircuitBreaker,", diffStatus: "context" },
        { num: 15, text: "      Pipeline.WorkerSupervisor,", diffStatus: "context" },
        { num: 16, text: "      Pipeline.Coordinator", diffStatus: "context" },
        { num: 17, text: "    ]", diffStatus: "context" },
        { num: 18, text: "", diffStatus: "context" },
        { num: 19, text: "    # :rest_for_one ensures pipeline crashes do not tear down the Journal", diffStatus: "context" },
        { num: 20, text: "    Supervisor.init(children, strategy: :rest_for_one, max_restarts: 10, max_seconds: 60)", diffStatus: "focus" },
        { num: 21, text: "  end", diffStatus: "context" },
        { num: 22, text: "end", diffStatus: "context" }
      ]
    },
    // 3. Ingress Controller
    {
      path: "lib/ingest/ingress_controller.ex",
      module: "Ingest.IngressController",
      subsystem: "ingest",
      loc: 52,
      changeStatus: "CALLER",
      diffSummary: "Intake point assigning correlation IDs and routing to partition workers",
      eventIds: ["ev-01", "ev-04"],
      directCallers: [],
      directCallees: ["lib/ingest/command_validator.ex", "lib/ingest/rate_limiter.ex", "lib/pipeline/coordinator.ex"],
      symbols: [
        {
          id: "ingress_submit",
          symbolKey: "Ingest.IngressController.submit/1",
          name: "submit/1",
          module: "Ingest.IngressController",
          kind: "def",
          filePath: "lib/ingest/ingress_controller.ex",
          span: { startLine: 18, endLine: 48, focusLine: 28 },
          callersCount: 2,
          calleesCount: 3,
          impactsEffect: false,
          isModified: false,
          docSummary: "Validates raw incoming payload, assigns command UUID, and dispatches via cluster coordinator."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Ingest.IngressController do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "External command intake gateway on Node A."', diffStatus: "context" },
        { num: 3, text: "  require Logger", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  @spec submit(map()) :: {:ok, String.t()} | {:error, term()}", diffStatus: "context" },
        { num: 6, text: "  def submit(params) do", diffStatus: "context" },
        { num: 7, text: '    with :ok <- Ingest.RateLimiter.check_rate(params["account_id"]),', diffStatus: "context" },
        { num: 8, text: "         {:ok, command} <- Ingest.CommandValidator.validate(params) do", diffStatus: "context" },
        { num: 9, text: "      # Ingress assigns stable correlation token for distributed causality", diffStatus: "context" },
        { num: 10, text: "      token = Telemetry.SpanTracer.inject_token(command.id)", diffStatus: "context", annotation: { line: 10, kind: "seq_trace", label: "SEQ_TRACE_TOKEN", detail: "Token cmd-42 attached to BEAM process dictionary", badge: "TOKEN" } },
        { num: 11, text: '      Logger.info("Ingress accepted command", command_id: command.id, token: token)', diffStatus: "focus" },
        { num: 12, text: "      Pipeline.Coordinator.dispatch_async(command)", diffStatus: "context" },
        { num: 13, text: "      {:ok, command.id}", diffStatus: "context" },
        { num: 14, text: "    else", diffStatus: "context" },
        { num: 15, text: "      {:error, reason} -> {:error, reason}", diffStatus: "context" },
        { num: 16, text: "    end", diffStatus: "context" },
        { num: 17, text: "  end", diffStatus: "context" },
        { num: 18, text: "end", diffStatus: "context" }
      ]
    },
    // 4. Command Validator
    {
      path: "lib/ingest/command_validator.ex",
      module: "Ingest.CommandValidator",
      subsystem: "ingest",
      loc: 48,
      changeStatus: "INFRA",
      diffSummary: "Pure functional schema checking for incoming idempotency keys and amounts",
      eventIds: ["ev-03"],
      directCallers: ["lib/ingest/ingress_controller.ex"],
      directCallees: [],
      symbols: [
        {
          id: "val_validate",
          symbolKey: "Ingest.CommandValidator.validate/1",
          name: "validate/1",
          module: "Ingest.CommandValidator",
          kind: "def",
          filePath: "lib/ingest/command_validator.ex",
          span: { startLine: 14, endLine: 42, focusLine: 22 },
          callersCount: 2,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Validates required command attributes and enforces positive monetary amounts."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Ingest.CommandValidator do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Pure boundary validation for command parameters."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  defstruct [:id, :account_id, :target_url, :amount, :idempotency_key]", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: '  def validate(%{"id" => id, "amount" => amount} = params) when is_binary(id) and amount > 0 do', diffStatus: "context" },
        { num: 7, text: "    {:ok, %__MODULE__{", diffStatus: "focus" },
        { num: 8, text: "      id: id,", diffStatus: "context" },
        { num: 9, text: '      account_id: params["account_id"],', diffStatus: "context" },
        { num: 10, text: '      target_url: Map.get(params, "target_url", "/v1/settle"),', diffStatus: "context" },
        { num: 11, text: "      amount: amount,", diffStatus: "context" },
        { num: 12, text: '      idempotency_key: params["idempotency_key"]', diffStatus: "context" },
        { num: 13, text: "    }}", diffStatus: "context" },
        { num: 14, text: "  end", diffStatus: "context" },
        { num: 15, text: "", diffStatus: "context" },
        { num: 16, text: "  def validate(_invalid), do: {:error, :invalid_command_payload}", diffStatus: "context" },
        { num: 17, text: "end", diffStatus: "context" }
      ]
    },
    // 5. Rate Limiter
    {
      path: "lib/ingest/rate_limiter.ex",
      module: "Ingest.RateLimiter",
      subsystem: "ingest",
      loc: 36,
      changeStatus: "INFRA",
      diffSummary: "Concurrency-safe token bucket using ETS table counters",
      eventIds: ["ev-02"],
      directCallers: ["lib/ingest/ingress_controller.ex"],
      directCallees: [],
      symbols: [
        {
          id: "rate_check",
          symbolKey: "Ingest.RateLimiter.check_rate/1",
          name: "check_rate/1",
          module: "Ingest.RateLimiter",
          kind: "def",
          filePath: "lib/ingest/rate_limiter.ex",
          span: { startLine: 10, endLine: 30, focusLine: 16 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Atomically increments account bucket counter; rejects requests exceeding burst limit."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Ingest.RateLimiter do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Token bucket limiter backed by concurrency-tuned ETS table."', diffStatus: "context" },
        { num: 3, text: "  @table :ingress_rate_buckets", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def check_rate(account_id) do", diffStatus: "context" },
        { num: 6, text: "    case :ets.update_counter(@table, account_id, {2, 1}, {account_id, 0}) do", diffStatus: "focus" },
        { num: 7, text: "      count when count <= 100 -> :ok", diffStatus: "context" },
        { num: 8, text: "      _exceeded -> {:error, :rate_limit_exceeded}", diffStatus: "context" },
        { num: 9, text: "    end", diffStatus: "context" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "end", diffStatus: "context" }
      ]
    },
    // 6. Coordinator
    {
      path: "lib/pipeline/coordinator.ex",
      module: "Pipeline.Coordinator",
      subsystem: "pipeline",
      loc: 75,
      changeStatus: "CALLER",
      diffSummary: "Saga orchestrator GenServer: tracks worker PIDs and routes commands",
      eventIds: ["ev-05", "ev-06"],
      directCallers: ["lib/ingest/ingress_controller.ex"],
      directCallees: ["lib/pipeline/worker_supervisor.ex", "lib/pipeline/command_worker.ex"],
      symbols: [
        {
          id: "coord_dispatch",
          symbolKey: "Pipeline.Coordinator.dispatch_async/1",
          name: "dispatch_async/1",
          module: "Pipeline.Coordinator",
          kind: "def",
          filePath: "lib/pipeline/coordinator.ex",
          span: { startLine: 20, endLine: 35, focusLine: 26 },
          callersCount: 1,
          calleesCount: 2,
          impactsEffect: false,
          isModified: false,
          docSummary: "Asynchronously routes incoming command to dedicated worker under DynamicSupervisor."
        },
        {
          id: "coord_handle_cast",
          symbolKey: "Pipeline.Coordinator.handle_cast/2",
          name: "handle_cast/2",
          module: "Pipeline.Coordinator",
          kind: "callback",
          filePath: "lib/pipeline/coordinator.ex",
          span: { startLine: 38, endLine: 58, focusLine: 45 },
          callersCount: 0,
          calleesCount: 2,
          impactsEffect: false,
          isModified: false,
          docSummary: "Spawns worker child or delivers command message to existing worker."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.Coordinator do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "GenServer orchestrating saga dispatch and cross-node command forwarding."', diffStatus: "context" },
        { num: 3, text: "  use GenServer", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def start_link(_opts), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)", diffStatus: "context" },
        { num: 6, text: "", diffStatus: "context" },
        { num: 7, text: "  def dispatch_async(command) do", diffStatus: "context" },
        { num: 8, text: "    GenServer.cast(__MODULE__, {:dispatch, command})", diffStatus: "context" },
        { num: 9, text: "  end", diffStatus: "context" },
        { num: 10, text: "", diffStatus: "context" },
        { num: 11, text: "  @impl true", diffStatus: "context" },
        { num: 12, text: "  def init(_args), do: {:ok, %{active_workers: %{}}}", diffStatus: "context" },
        { num: 13, text: "", diffStatus: "context" },
        { num: 14, text: "  @impl true", diffStatus: "context" },
        { num: 15, text: "  def handle_cast({:dispatch, command}, state) do", diffStatus: "context" },
        { num: 16, text: "    # Dynamically start worker child under worker supervisor", diffStatus: "context" },
        { num: 17, text: "    {:ok, pid} = Pipeline.WorkerSupervisor.start_worker(command)", diffStatus: "focus" },
        { num: 18, text: "    send(pid, {:execute, command})", diffStatus: "context", annotation: { line: 18, kind: "seq_trace", label: "CROSS_PROCESS_SEND", detail: "Message {:execute, command} dispatched to worker pid", badge: "MSG_SEND" } },
        { num: 19, text: "    {:noreply, put_in(state.active_workers[command.id], pid)}", diffStatus: "context" },
        { num: 20, text: "  end", diffStatus: "context" },
        { num: 21, text: "end", diffStatus: "context" }
      ]
    },
    // 7. Worker Supervisor
    {
      path: "lib/pipeline/worker_supervisor.ex",
      module: "Pipeline.WorkerSupervisor",
      subsystem: "pipeline",
      loc: 54,
      changeStatus: "MODIFIED",
      diffSummary: "Supervisor guarding transient workers with :one_for_one restart strategy",
      eventIds: ["ev-07", "ev-15", "ev-16"],
      directCallers: ["lib/pipeline/coordinator.ex"],
      directCallees: ["lib/pipeline/command_worker.ex"],
      symbols: [
        {
          id: "worker_sup_start_worker",
          symbolKey: "Pipeline.WorkerSupervisor.start_worker/1",
          name: "start_worker/1",
          module: "Pipeline.WorkerSupervisor",
          kind: "def",
          filePath: "lib/pipeline/worker_supervisor.ex",
          span: { startLine: 18, endLine: 30, focusLine: 22 },
          callersCount: 2,
          calleesCount: 1,
          impactsEffect: false,
          isModified: false,
          docSummary: "Starts a child worker specification under DynamicSupervisor control."
        },
        {
          id: "worker_sup_init",
          symbolKey: "Pipeline.WorkerSupervisor.init/1",
          name: "init/1",
          module: "Pipeline.WorkerSupervisor",
          kind: "callback",
          filePath: "lib/pipeline/worker_supervisor.ex",
          span: { startLine: 32, endLine: 50, focusLine: 38 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: true,
          docSummary: "Initializes supervisor with updated max_restarts: 5 and max_seconds: 10."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.WorkerSupervisor do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Dynamic supervisor managing transient CommandWorker processes on Node B."', diffStatus: "context" },
        { num: 3, text: "  use DynamicSupervisor", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def start_link(init_arg) do", diffStatus: "context" },
        { num: 6, text: "    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)", diffStatus: "context" },
        { num: 7, text: "  end", diffStatus: "context" },
        { num: 8, text: "", diffStatus: "context" },
        { num: 9, text: "  def start_worker(command) do", diffStatus: "context" },
        { num: 10, text: "    spec = {Pipeline.CommandWorker, command}", diffStatus: "context" },
        { num: 11, text: "    DynamicSupervisor.start_child(__MODULE__, spec)", diffStatus: "focus" },
        { num: 12, text: "  end", diffStatus: "context" },
        { num: 13, text: "", diffStatus: "context" },
        { num: 14, text: "  @impl true", diffStatus: "context" },
        { num: 15, text: "  def init(_init_arg) do", diffStatus: "context" },
        { num: 16, text: "    # PR #248 modified: increased restart intensity parameters", diffStatus: "context" },
        { oldNum: 17, text: "    DynamicSupervisor.init(strategy: :one_for_one)", diffStatus: "remove" },
        { num: 17, text: "    DynamicSupervisor.init(", diffStatus: "add" },
        { num: 18, text: "      strategy: :one_for_one,", diffStatus: "add", annotation: { line: 18, kind: "restart", label: "SUPERVISOR_STRATEGY", detail: ":one_for_one isolation restarts dead worker without affecting peers", badge: "OTP_SPEC" } },
        { num: 19, text: "      max_restarts: 5,", diffStatus: "add" },
        { num: 20, text: "      max_seconds: 10", diffStatus: "add" },
        { num: 21, text: "    )", diffStatus: "add" },
        { num: 22, text: "  end", diffStatus: "context" },
        { num: 23, text: "end", diffStatus: "context" }
      ]
    },
    // 8. Command Worker (THE MAIN MODIFIED REVIEW TARGET & CRASH SITE!)
    {
      path: "lib/pipeline/command_worker.ex",
      module: "Pipeline.CommandWorker",
      subsystem: "pipeline",
      loc: 96,
      changeStatus: "MODIFIED",
      diffSummary: "PR #248 modified recover/2: triggers Gateway.dispatch/1 on pending commands after restart!",
      eventIds: ["ev-08", "ev-09", "ev-10", "ev-11", "ev-12", "ev-13", "ev-17", "ev-18", "ev-19", "ev-20"],
      directCallers: ["lib/pipeline/coordinator.ex", "lib/pipeline/worker_supervisor.ex"],
      directCallees: ["lib/storage/journal.ex", "lib/gateway/external_client.ex", "lib/pipeline/recovery_policy.ex"],
      symbols: [
        {
          id: "worker_init",
          symbolKey: "Pipeline.CommandWorker.init/1",
          name: "init/1",
          module: "Pipeline.CommandWorker",
          kind: "callback",
          filePath: "lib/pipeline/command_worker.ex",
          span: { startLine: 18, endLine: 34, focusLine: 24 },
          callersCount: 1,
          calleesCount: 1,
          impactsEffect: false,
          isModified: false,
          docSummary: "Initializes worker state. On restart, reloads state from Journal if pending."
        },
        {
          id: "worker_handle_info_execute",
          symbolKey: "Pipeline.CommandWorker.handle_info/2 {:execute}",
          name: "handle_info({:execute, cmd})",
          module: "Pipeline.CommandWorker",
          kind: "callback",
          filePath: "lib/pipeline/command_worker.ex",
          span: { startLine: 36, endLine: 62, focusLine: 46 },
          callersCount: 2,
          calleesCount: 3,
          impactsEffect: true,
          isModified: true,
          docSummary: "Checks journal status; if pending, invokes recovery or dispatches to external gateway."
        },
        {
          id: "worker_recover",
          symbolKey: "Pipeline.CommandWorker.recover/2",
          name: "recover/2",
          module: "Pipeline.CommandWorker",
          kind: "def",
          filePath: "lib/pipeline/command_worker.ex",
          span: { startLine: 64, endLine: 94, focusLine: 74 },
          callersCount: 1,
          calleesCount: 2,
          impactsEffect: true,
          isModified: true,
          docSummary: "Resubmits pending command to Gateway without verifying if prior attempt succeeded."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.CommandWorker do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Stateful worker executing external gateway writes with crash recovery."', diffStatus: "context" },
        { num: 3, text: "  use GenServer, restart: :transient", diffStatus: "context" },
        { num: 4, text: "  require Logger", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: "  defstruct [:command, :status, :retry_count, :in_flight_call, :last_error]", diffStatus: "context" },
        { num: 7, text: "", diffStatus: "context" },
        { num: 8, text: "  def start_link(command) do", diffStatus: "context" },
        { num: 9, text: "    GenServer.start_link(__MODULE__, command)", diffStatus: "context" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "", diffStatus: "context" },
        { num: 12, text: "  @impl true", diffStatus: "context" },
        { num: 13, text: "  def init(command) do", diffStatus: "context" },
        { num: 14, text: "    # In case of process restart, evaluate if command was partially executed", diffStatus: "context" },
        { num: 15, text: "    state = %__MODULE__{command: command, status: :init, retry_count: 0, in_flight_call: nil}", diffStatus: "focus", annotation: { line: 15, kind: "snapshot", label: "STATE_INIT", detail: "Worker initialized with command struct; private memory reset", badge: "STATE" } },
        { num: 16, text: "    {:ok, state, {:continue, :evaluate_recovery}}", diffStatus: "context" },
        { num: 17, text: "  end", diffStatus: "context" },
        { num: 18, text: "", diffStatus: "context" },
        { num: 19, text: "  @impl true", diffStatus: "context" },
        { num: 20, text: "  def handle_continue(:evaluate_recovery, %{command: cmd} = state) do", diffStatus: "context" },
        { num: 21, text: "    case Storage.Journal.status(cmd.id) do", diffStatus: "context" },
        { num: 22, text: "      :pending ->", diffStatus: "context" },
        { num: 23, text: '        Logger.warn("Worker re-evaluating pending command post-restart", id: cmd.id)', diffStatus: "context" },
        { num: 24, text: "        recover(cmd, state)", diffStatus: "focus" },
        { num: 25, text: "      :committed ->", diffStatus: "context" },
        { num: 26, text: "        {:stop, :normal, state}", diffStatus: "context" },
        { num: 27, text: "      :missing ->", diffStatus: "context" },
        { num: 28, text: "        {:noreply, state}", diffStatus: "context" },
        { num: 29, text: "    end", diffStatus: "context" },
        { num: 30, text: "  end", diffStatus: "context" },
        { num: 31, text: "", diffStatus: "context" },
        { num: 32, text: "  @impl true", diffStatus: "context" },
        { num: 33, text: "  def handle_info({:execute, command}, state) do", diffStatus: "context" },
        { num: 34, text: "    # Step 1: record pending status in Journal", diffStatus: "context" },
        { num: 35, text: "    :ok = Storage.Journal.record_pending(command.id, command)", diffStatus: "context", annotation: { line: 35, kind: "journal", label: "JOURNAL_PENDING", detail: "SQL record inserted into Storage.Journal with status :pending", badge: "SQL_IO" } },
        { num: 36, text: "    dispatch(command, %{state | status: :pending})", diffStatus: "context" },
        { num: 37, text: "  end", diffStatus: "context" },
        { num: 38, text: "", diffStatus: "context" },
        { num: 39, text: "  defp dispatch(command, state) do", diffStatus: "context" },
        { num: 40, text: "    # Injected fault hook: simulate BEAM killed fault during socket transmission", diffStatus: "context" },
        { num: 41, text: "    if Process.get(:test_fault_injected) == :kill_during_dispatch do", diffStatus: "context" },
        { num: 42, text: '      Logger.error("Simulated crash injected inside dispatch/2!")', diffStatus: "context" },
        { num: 43, text: "      Process.exit(self(), :kill)", diffStatus: "focus", annotation: { line: 43, kind: "crash", label: "CRASH_SITE", detail: "Process.exit(self(), :kill) abruptly terminates worker pid", badge: "CRASH" } },
        { num: 44, text: "    end", diffStatus: "context" },
        { num: 45, text: "", diffStatus: "context" },
        { num: 46, text: "    # Send external mutation via Gateway", diffStatus: "context" },
        { num: 47, text: "    case Gateway.ExternalClient.post(command.target_url, command) do", diffStatus: "focus", annotation: { line: 47, kind: "effect", label: "EFFECT_FRONTIER", detail: "External HTTP POST /v1/settle attempted; outcome outside BEAM", badge: "EXT_IO" } },
        { num: 48, text: "      {:ok, response} ->", diffStatus: "context" },
        { num: 49, text: "        :ok = Storage.Journal.commit(command.id, response)", diffStatus: "context" },
        { num: 50, text: "        {:noreply, %{state | status: :committed}}", diffStatus: "context" },
        { num: 51, text: "      {:error, reason} ->", diffStatus: "context" },
        { num: 52, text: "        {:stop, reason, %{state | last_error: reason}}", diffStatus: "context" },
        { num: 53, text: "    end", diffStatus: "context" },
        { num: 54, text: "  end", diffStatus: "context" },
        { num: 55, text: "", diffStatus: "context" },
        { num: 56, text: "  # --- PR #248 CHANGED RECOVER IMPLEMENTATION ---", diffStatus: "context" },
        { num: 57, text: "  defp recover(command, state) do", diffStatus: "context" },
        { num: 58, text: "    case Storage.Journal.status(command.id) do", diffStatus: "context" },
        { num: 59, text: "      :committed ->", diffStatus: "context" },
        { num: 60, text: "        {:stop, :normal, state}", diffStatus: "context" },
        { oldNum: 61, text: "      :pending ->", diffStatus: "remove" },
        { oldNum: 62, text: "        # Old behavior: stay idle to prevent duplicate write", diffStatus: "remove" },
        { oldNum: 63, text: "        {:noreply, %{state | status: :blocked}}", diffStatus: "remove" },
        { num: 61, text: "      :pending ->", diffStatus: "add" },
        { num: 62, text: "        # New PR #248 behavior: aggressively resubmit to Gateway!", diffStatus: "add" },
        { num: 63, text: "        # CAUTION: Prior external mutation outcome is UNVERIFIED!", diffStatus: "add", annotation: { line: 63, kind: "unconfirmed", label: "EVIDENCE_GAP", detail: "Attempt #1 external HTTP completion was not durably recorded before crash", badge: "HAZARD" } },
        { num: 64, text: '        Logger.warn("Re-dispatching command to gateway post-restart", id: command.id)', diffStatus: "add" },
        { num: 65, text: "        Gateway.ExternalClient.post(command.target_url, command)", diffStatus: "add", annotation: { line: 65, kind: "effect", label: "EFFECT_FRONTIER_RETRY", detail: "DUPLICATE EXTERNAL WRITE HAZARD: Attempt #2 sent without verification", badge: "RETRY" } },
        { num: 66, text: "        {:noreply, %{state | status: :recovering, retry_count: state.retry_count + 1}}", diffStatus: "add" },
        { num: 67, text: "      :missing ->", diffStatus: "context" },
        { num: 68, text: "        {:noreply, state}", diffStatus: "context" },
        { num: 69, text: "    end", diffStatus: "context" },
        { num: 70, text: "  end", diffStatus: "context" },
        { num: 71, text: "end", diffStatus: "context" }
      ]
    },
    // 9. Recovery Policy
    {
      path: "lib/pipeline/recovery_policy.ex",
      module: "Pipeline.RecoveryPolicy",
      subsystem: "pipeline",
      loc: 40,
      changeStatus: "INFRA",
      diffSummary: "Pure functional exponential backoff with full jitter",
      eventIds: [],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: [],
      symbols: [
        {
          id: "rec_backoff",
          symbolKey: "Pipeline.RecoveryPolicy.backoff_ms/2",
          name: "backoff_ms/2",
          module: "Pipeline.RecoveryPolicy",
          kind: "def",
          filePath: "lib/pipeline/recovery_policy.ex",
          span: { startLine: 12, endLine: 28, focusLine: 18 },
          callersCount: 2,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Calculates exponential backoff delay with decorrelated jitter."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.RecoveryPolicy do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Pure backoff calculation and retry classification."', diffStatus: "context" },
        { num: 3, text: "  @base_backoff_ms 250", diffStatus: "context" },
        { num: 4, text: "  @max_backoff_ms 5000", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: "  def backoff_ms(attempt, base \\\\ @base_backoff_ms) do", diffStatus: "context" },
        { num: 7, text: "    factor = :math.pow(2, min(attempt, 6))", diffStatus: "context" },
        { num: 8, text: "    raw = trunc(base * factor)", diffStatus: "context" },
        { num: 9, text: "    min(raw, @max_backoff_ms) + :rand.uniform(100)", diffStatus: "focus" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "end", diffStatus: "context" }
      ]
    },
    // 10. State Machine
    {
      path: "lib/pipeline/state_machine.ex",
      module: "Pipeline.StateMachine",
      subsystem: "pipeline",
      loc: 46,
      changeStatus: "INFRA",
      diffSummary: "Explicit gen_statem transition matrix for command lifecycle",
      eventIds: [],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: [],
      symbols: [
        {
          id: "sm_transition",
          symbolKey: "Pipeline.StateMachine.transition/2",
          name: "transition/2",
          module: "Pipeline.StateMachine",
          kind: "def",
          filePath: "lib/pipeline/state_machine.ex",
          span: { startLine: 14, endLine: 36, focusLine: 20 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Enforces valid state transitions: :init -> :pending -> :dispatched -> :committed."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.StateMachine do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "FSM defining allowed saga transition states."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  @valid_transitions %{", diffStatus: "context" },
        { num: 5, text: "    init: [:pending, :failed],", diffStatus: "context" },
        { num: 6, text: "    pending: [:dispatched, :recovering, :failed],", diffStatus: "context" },
        { num: 7, text: "    recovering: [:dispatched, :failed],", diffStatus: "context" },
        { num: 8, text: "    dispatched: [:committed, :failed]", diffStatus: "context" },
        { num: 9, text: "  }", diffStatus: "context" },
        { num: 10, text: "", diffStatus: "context" },
        { num: 11, text: "  def transition(from, to) do", diffStatus: "context" },
        { num: 12, text: "    if to in Map.get(@valid_transitions, from, []), do: {:ok, to}, else: {:error, :invalid_transition}", diffStatus: "focus" },
        { num: 13, text: "  end", diffStatus: "context" },
        { num: 14, text: "end", diffStatus: "context" }
      ]
    },
    // 11. Journal
    {
      path: "lib/storage/journal.ex",
      module: "Storage.Journal",
      subsystem: "storage",
      loc: 68,
      changeStatus: "MODIFIED",
      diffSummary: "Append-only PostgreSQL Ecto journal tracking pending and committed saga records",
      eventIds: ["ev-07", "ev-08", "ev-18", "ev-22"],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: ["lib/storage/repo.ex"],
      symbols: [
        {
          id: "journal_status",
          symbolKey: "Storage.Journal.status/1",
          name: "status/1",
          module: "Storage.Journal",
          kind: "def",
          filePath: "lib/storage/journal.ex",
          span: { startLine: 18, endLine: 38, focusLine: 26 },
          callersCount: 3,
          calleesCount: 1,
          impactsEffect: false,
          isModified: true,
          docSummary: "Queries database for command status: :pending, :committed, or :missing."
        },
        {
          id: "journal_commit",
          symbolKey: "Storage.Journal.commit/2",
          name: "commit/2",
          module: "Storage.Journal",
          kind: "def",
          filePath: "lib/storage/journal.ex",
          span: { startLine: 40, endLine: 62, focusLine: 48 },
          callersCount: 2,
          calleesCount: 1,
          impactsEffect: true,
          isModified: false,
          docSummary: "Atomically commits command entry with gateway response payload."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Storage.Journal do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Durable state journal living on Node C."', diffStatus: "context" },
        { num: 3, text: "  import Ecto.Query", diffStatus: "context" },
        { num: 4, text: "  alias Storage.Repo", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: "  def status(command_id) do", diffStatus: "context" },
        { num: 7, text: "    case Repo.get_by(Storage.CommandEntry, command_id: command_id) do", diffStatus: "context" },
        { num: 8, text: "      nil -> :missing", diffStatus: "context" },
        { num: 9, text: '      %{status: "committed"} -> :committed', diffStatus: "context" },
        { oldNum: 10, text: "      _other -> :pending", diffStatus: "remove" },
        { num: 10, text: '      %{status: "pending"} -> :pending', diffStatus: "add" },
        { num: 11, text: '      %{status: "recovering"} -> :pending', diffStatus: "add" },
        { num: 12, text: "    end", diffStatus: "focus" },
        { num: 13, text: "  end", diffStatus: "context" },
        { num: 14, text: "", diffStatus: "context" },
        { num: 15, text: "  def record_pending(command_id, command) do", diffStatus: "context" },
        { num: 16, text: '    Repo.insert(%Storage.CommandEntry{command_id: command_id, status: "pending", payload: command})', diffStatus: "context" },
        { num: 17, text: "    :ok", diffStatus: "context" },
        { num: 18, text: "  end", diffStatus: "context" },
        { num: 19, text: "", diffStatus: "context" },
        { num: 20, text: "  def commit(command_id, result) do", diffStatus: "context" },
        { num: 21, text: "    from(e in Storage.CommandEntry, where: e.command_id == ^command_id)", diffStatus: "context" },
        { num: 22, text: '    |> Repo.update_all(set: [status: "committed", result: result])', diffStatus: "focus", annotation: { line: 22, kind: "journal", label: "SQL_COMMIT", detail: "Durable update to committed in PostgreSQL on Node C", badge: "DURABLE" } },
        { num: 23, text: "    :ok", diffStatus: "context" },
        { num: 24, text: "  end", diffStatus: "context" },
        { num: 25, text: "end", diffStatus: "context" }
      ]
    },
    // 12. Event Store
    {
      path: "lib/storage/event_store.ex",
      module: "Storage.EventStore",
      subsystem: "storage",
      loc: 50,
      changeStatus: "INFRA",
      diffSummary: "Event stream projection and subscriber broadcast",
      eventIds: [],
      directCallers: ["lib/storage/journal.ex"],
      directCallees: ["lib/storage/repo.ex"],
      symbols: [
        {
          id: "es_append",
          symbolKey: "Storage.EventStore.append_event/2",
          name: "append_event/2",
          module: "Storage.EventStore",
          kind: "def",
          filePath: "lib/storage/event_store.ex",
          span: { startLine: 12, endLine: 34, focusLine: 20 },
          callersCount: 2,
          calleesCount: 1,
          impactsEffect: false,
          isModified: false,
          docSummary: "Appends immutable event tuple to stream table."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Storage.EventStore do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Event stream storage for audit and replay projections."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def append_event(stream_id, event) do", diffStatus: "context" },
        { num: 5, text: "    Storage.Repo.insert(%Storage.StreamEvent{stream_id: stream_id, event: event, inserted_at: DateTime.utc_now()})", diffStatus: "focus" },
        { num: 6, text: "  end", diffStatus: "context" },
        { num: 7, text: "end", diffStatus: "context" }
      ]
    },
    // 13. Snapshot Manager
    {
      path: "lib/storage/snapshot_manager.ex",
      module: "Storage.SnapshotManager",
      subsystem: "storage",
      loc: 42,
      changeStatus: "INFRA",
      diffSummary: "Periodic worker state snapshot persistence",
      eventIds: ["ev-10"],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: ["lib/storage/repo.ex"],
      symbols: [
        {
          id: "snap_save",
          symbolKey: "Storage.SnapshotManager.save_snapshot/2",
          name: "save_snapshot/2",
          module: "Storage.SnapshotManager",
          kind: "def",
          filePath: "lib/storage/snapshot_manager.ex",
          span: { startLine: 10, endLine: 26, focusLine: 16 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Persists serialized snapshot of GenServer state to cold storage."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Storage.SnapshotManager do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Saves point-in-time process memory checkpoints."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def save_snapshot(worker_id, state) do", diffStatus: "context" },
        { num: 5, text: "    # Point observation: does not guarantee continuous reconstruction", diffStatus: "context" },
        { num: 6, text: "    payload = :erlang.term_to_binary(state)", diffStatus: "focus" },
        { num: 7, text: "    :ok", diffStatus: "context" },
        { num: 8, text: "  end", diffStatus: "context" },
        { num: 9, text: "end", diffStatus: "context" }
      ]
    },
    // 14. Repo
    {
      path: "lib/storage/repo.ex",
      module: "Storage.Repo",
      subsystem: "storage",
      loc: 28,
      changeStatus: "INFRA",
      diffSummary: "Ecto repository adapter for PostgreSQL",
      eventIds: [],
      directCallers: ["lib/storage/journal.ex", "lib/storage/event_store.ex"],
      directCallees: [],
      symbols: [
        {
          id: "repo_module",
          symbolKey: "Storage.Repo",
          name: "Repo",
          module: "Storage.Repo",
          kind: "schema",
          filePath: "lib/storage/repo.ex",
          span: { startLine: 1, endLine: 20, focusLine: 6 },
          callersCount: 5,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "PostgreSQL database connection pool adapter."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Storage.Repo do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Ecto database pool adapter for Node C store."', diffStatus: "context" },
        { num: 3, text: "  use Ecto.Repo,", diffStatus: "context" },
        { num: 4, text: "    otp_app: :elixir_scope_saga,", diffStatus: "context" },
        { num: 5, text: "    adapter: Ecto.Adapters.Postgres", diffStatus: "focus" },
        { num: 6, text: "end", diffStatus: "context" }
      ]
    },
    // 15. External Client (EFFECT FRONTIER)
    {
      path: "lib/gateway/external_client.ex",
      module: "Gateway.ExternalClient",
      subsystem: "gateway",
      loc: 58,
      changeStatus: "EFFECT_FRONTIER",
      diffSummary: "Finch HTTP connection pool communicating with payment partner API (Effect Frontier)",
      eventIds: ["ev-11", "ev-20"],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: ["lib/gateway/circuit_breaker.ex", "lib/gateway/payload_codec.ex"],
      symbols: [
        {
          id: "client_post",
          symbolKey: "Gateway.ExternalClient.post/2",
          name: "post/2",
          module: "Gateway.ExternalClient",
          kind: "def",
          filePath: "lib/gateway/external_client.ex",
          span: { startLine: 16, endLine: 46, focusLine: 28 },
          callersCount: 2,
          calleesCount: 2,
          impactsEffect: true,
          isModified: false,
          docSummary: "Executes HTTP POST over network; boundary of external side effect."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Gateway.ExternalClient do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "HTTP connection pool client reaching external payment processor."', diffStatus: "context" },
        { num: 3, text: "  require Logger", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def post(url, payload) do", diffStatus: "context" },
        { num: 6, text: "    body = Gateway.PayloadCodec.encode(payload)", diffStatus: "context" },
        { num: 7, text: '    req = Finch.build(:post, "https://api.gateway.internal" <> url, [{"content-type", "application/json"}], body)', diffStatus: "context" },
        { num: 8, text: "", diffStatus: "context" },
        { num: 9, text: "    # CRITICAL: This is the EFFECT FRONTIER. Once the TCP SYN goes out,", diffStatus: "context" },
        { num: 10, text: "    # the external system may commit side effects even if the BEAM process crashes!", diffStatus: "context", annotation: { line: 10, kind: "effect", label: "EFFECT_FRONTIER_BOUNDARY", detail: "Outbound TCP network socket: external state change cannot be rolled back", badge: "NET_EFFECT" } },
        { num: 11, text: "    Telemetry.span([:gateway, :http_request], %{url: url, id: payload.id}, fn ->", diffStatus: "focus" },
        { num: 12, text: "      case Finch.request(req, Gateway.FinchPool, receive_timeout: 5000) do", diffStatus: "context" },
        { num: 13, text: "        {:ok, %Finch.Response{status: 200, body: resp_body}} ->", diffStatus: "context" },
        { num: 14, text: "          {:ok, resp_body}", diffStatus: "context" },
        { num: 15, text: "        {:error, reason} ->", diffStatus: "context" },
        { num: 16, text: "          {:error, reason}", diffStatus: "context" },
        { num: 17, text: "      end", diffStatus: "context" },
        { num: 18, text: "    end)", diffStatus: "context" },
        { num: 19, text: "  end", diffStatus: "context" },
        { num: 20, text: "end", diffStatus: "context" }
      ]
    },
    // 16. Circuit Breaker
    {
      path: "lib/gateway/circuit_breaker.ex",
      module: "Gateway.CircuitBreaker",
      subsystem: "gateway",
      loc: 48,
      changeStatus: "INFRA",
      diffSummary: "Fuse-based circuit breaker preventing cascading HTTP timeout storms",
      eventIds: [],
      directCallers: ["lib/gateway/external_client.ex"],
      directCallees: [],
      symbols: [
        {
          id: "cb_ask",
          symbolKey: "Gateway.CircuitBreaker.allow_request?/1",
          name: "allow_request?/1",
          module: "Gateway.CircuitBreaker",
          kind: "def",
          filePath: "lib/gateway/circuit_breaker.ex",
          span: { startLine: 12, endLine: 30, focusLine: 18 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Inspects error rates and trips circuit if downstream latency exceeds threshold."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Gateway.CircuitBreaker do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Fuse circuit breaker for external service dependencies."', diffStatus: "context" },
        { num: 3, text: "  use GenServer", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def start_link(_), do: GenServer.start_link(__MODULE__, :ok, name: __MODULE__)", diffStatus: "context" },
        { num: 6, text: "  def init(:ok), do: {:ok, :closed}", diffStatus: "context" },
        { num: 7, text: "", diffStatus: "context" },
        { num: 8, text: "  def allow_request?(_service) do", diffStatus: "context" },
        { num: 9, text: "    :fuse.ask(:gateway_fuse, :sync)", diffStatus: "focus" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "end", diffStatus: "context" }
      ]
    },
    // 17. Payload Codec
    {
      path: "lib/gateway/payload_codec.ex",
      module: "Gateway.PayloadCodec",
      subsystem: "gateway",
      loc: 38,
      changeStatus: "INFRA",
      diffSummary: "JSON serializer computing SHA-256 idempotency fingerprint",
      eventIds: [],
      directCallers: ["lib/gateway/external_client.ex"],
      directCallees: [],
      symbols: [
        {
          id: "codec_encode",
          symbolKey: "Gateway.PayloadCodec.encode/1",
          name: "encode/1",
          module: "Gateway.PayloadCodec",
          kind: "def",
          filePath: "lib/gateway/payload_codec.ex",
          span: { startLine: 10, endLine: 26, focusLine: 16 },
          callersCount: 2,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Encodes payload map into JSON binary with deterministic key ordering."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Gateway.PayloadCodec do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Deterministic serialization and checksum calculations."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def encode(payload) do", diffStatus: "context" },
        { num: 5, text: "    Jason.encode!(payload)", diffStatus: "focus" },
        { num: 6, text: "  end", diffStatus: "context" },
        { num: 7, text: "", diffStatus: "context" },
        { num: 8, text: "  def fingerprint(payload) do", diffStatus: "context" },
        { num: 9, text: "    :crypto.hash(:sha256, encode(payload)) |> Base.encode16(case: :lower)", diffStatus: "context" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "end", diffStatus: "context" }
      ]
    },
    // 18. Ledger Writer
    {
      path: "lib/settlement/ledger_writer.ex",
      module: "Settlement.LedgerWriter",
      subsystem: "settlement",
      loc: 56,
      changeStatus: "CALLER",
      diffSummary: "Double-entry balanced accounting ledger persistence",
      eventIds: ["ev-21"],
      directCallers: ["lib/pipeline/command_worker.ex"],
      directCallees: ["lib/settlement/audit_trail.ex", "lib/storage/repo.ex"],
      symbols: [
        {
          id: "ledger_post",
          symbolKey: "Settlement.LedgerWriter.post_entry/3",
          name: "post_entry/3",
          module: "Settlement.LedgerWriter",
          kind: "def",
          filePath: "lib/settlement/ledger_writer.ex",
          span: { startLine: 14, endLine: 42, focusLine: 24 },
          callersCount: 1,
          calleesCount: 2,
          impactsEffect: true,
          isModified: false,
          docSummary: "Inserts double-entry accounting records into settlement ledger."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Settlement.LedgerWriter do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Double-entry transaction persistence and balance integrity."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def post_entry(account_id, amount, ref_id) do", diffStatus: "context" },
        { num: 5, text: "    # Invariant: debits must equal credits", diffStatus: "context" },
        { num: 6, text: "    entries = [", diffStatus: "context" },
        { num: 7, text: "      %{account: account_id, debit: amount, credit: 0, ref: ref_id},", diffStatus: "context" },
        { num: 8, text: '      %{account: "settlement_clearing", debit: 0, credit: amount, ref: ref_id}', diffStatus: "context" },
        { num: 9, text: "    ]", diffStatus: "context" },
        { num: 10, text: "    Settlement.AuditTrail.record_entries(entries)", diffStatus: "focus" },
        { num: 11, text: "    :ok", diffStatus: "context" },
        { num: 12, text: "  end", diffStatus: "context" },
        { num: 13, text: "end", diffStatus: "context" }
      ]
    },
    // 19. Audit Trail
    {
      path: "lib/settlement/audit_trail.ex",
      module: "Settlement.AuditTrail",
      subsystem: "settlement",
      loc: 44,
      changeStatus: "INFRA",
      diffSummary: "Immutable cryptographic hash-chained audit log",
      eventIds: [],
      directCallers: ["lib/settlement/ledger_writer.ex"],
      directCallees: [],
      symbols: [
        {
          id: "audit_record",
          symbolKey: "Settlement.AuditTrail.record_entries/1",
          name: "record_entries/1",
          module: "Settlement.AuditTrail",
          kind: "def",
          filePath: "lib/settlement/audit_trail.ex",
          span: { startLine: 12, endLine: 32, focusLine: 20 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Appends SHA-256 hashed ledger entries to tamper-evident audit log."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Settlement.AuditTrail do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Cryptographically verifiable audit log records."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def record_entries(entries) do", diffStatus: "context" },
        { num: 5, text: "    for e <- entries do", diffStatus: "context" },
        { num: 6, text: "      # Hash chaining to guarantee append-only record security", diffStatus: "focus" },
        { num: 7, text: "      _hash = :crypto.hash(:sha256, inspect(e))", diffStatus: "context" },
        { num: 8, text: "    end", diffStatus: "context" },
        { num: 9, text: "    :ok", diffStatus: "context" },
        { num: 10, text: "  end", diffStatus: "context" },
        { num: 11, text: "end", diffStatus: "context" }
      ]
    },
    // 20. Node Monitor
    {
      path: "lib/cluster/node_monitor.ex",
      module: "Cluster.NodeMonitor",
      subsystem: "cluster",
      loc: 52,
      changeStatus: "INFRA",
      diffSummary: "Distributed Erlang node membership and heartbeat listener",
      eventIds: [],
      directCallers: ["lib/core/application.ex"],
      directCallees: [],
      symbols: [
        {
          id: "node_mon_init",
          symbolKey: "Cluster.NodeMonitor.init/1",
          name: "init/1",
          module: "Cluster.NodeMonitor",
          kind: "callback",
          filePath: "lib/cluster/node_monitor.ex",
          span: { startLine: 14, endLine: 36, focusLine: 20 },
          callersCount: 1,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Subscribes to :net_kernel :nodeup and :nodedown distribution signals."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Cluster.NodeMonitor do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Tracks BEAM cluster membership across Node A, Node B, and Node C."', diffStatus: "context" },
        { num: 3, text: "  use GenServer", diffStatus: "context" },
        { num: 4, text: "", diffStatus: "context" },
        { num: 5, text: "  def start_link(_opts), do: GenServer.start_link(__MODULE__, :ok, name: __MODULE__)", diffStatus: "context" },
        { num: 6, text: "", diffStatus: "context" },
        { num: 7, text: "  @impl true", diffStatus: "context" },
        { num: 8, text: "  def init(:ok) do", diffStatus: "context" },
        { num: 9, text: "    :net_kernel.monitor_nodes(true)", diffStatus: "focus" },
        { num: 10, text: "    {:ok, %{nodes: Node.list()}}", diffStatus: "context" },
        { num: 11, text: "  end", diffStatus: "context" },
        { num: 12, text: "end", diffStatus: "context" }
      ]
    },
    // 21. Ring Manager
    {
      path: "lib/cluster/ring_manager.ex",
      module: "Cluster.RingManager",
      subsystem: "cluster",
      loc: 48,
      changeStatus: "INFRA",
      diffSummary: "Consistent hash ring routing command keys to partition owners",
      eventIds: [],
      directCallers: ["lib/core/application.ex", "lib/pipeline/coordinator.ex"],
      directCallees: [],
      symbols: [
        {
          id: "ring_node_for_key",
          symbolKey: "Cluster.RingManager.node_for_key/1",
          name: "node_for_key/1",
          module: "Cluster.RingManager",
          kind: "def",
          filePath: "lib/cluster/ring_manager.ex",
          span: { startLine: 12, endLine: 32, focusLine: 20 },
          callersCount: 2,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Maps command UUID through 1024-vnode consistent hash ring."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Cluster.RingManager do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Consistent hashing ring mapping commands to target nodes."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def node_for_key(key) do", diffStatus: "context" },
        { num: 5, text: "    hash = :erlang.phash2(key, 1024)", diffStatus: "focus" },
        { num: 6, text: '    if hash < 512, do: :"node_b@worker-04", else: :"node_c@store-02"', diffStatus: "context" },
        { num: 7, text: "  end", diffStatus: "context" },
        { num: 8, text: "end", diffStatus: "context" }
      ]
    },
    // 22. Span Tracer
    {
      path: "lib/telemetry/span_tracer.ex",
      module: "Telemetry.SpanTracer",
      subsystem: "telemetry",
      loc: 56,
      changeStatus: "INFRA",
      diffSummary: "OpenTelemetry & BEAM :seq_trace propagator attaching tokens",
      eventIds: ["ev-04", "ev-05"],
      directCallers: ["lib/ingest/ingress_controller.ex", "lib/pipeline/command_worker.ex"],
      directCallees: [],
      symbols: [
        {
          id: "tracer_inject",
          symbolKey: "Telemetry.SpanTracer.inject_token/1",
          name: "inject_token/1",
          module: "Telemetry.SpanTracer",
          kind: "def",
          filePath: "lib/telemetry/span_tracer.ex",
          span: { startLine: 14, endLine: 36, focusLine: 22 },
          callersCount: 3,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Attaches trace token to process dictionary and seq_trace label."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Telemetry.SpanTracer do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Propagates causal trace tokens across BEAM process messaging."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def inject_token(correlation_id) do", diffStatus: "context" },
        { num: 5, text: "    Process.put(:scope_correlation_token, correlation_id)", diffStatus: "focus" },
        { num: 6, text: "    :seq_trace.set_token(:label, :erlang.phash2(correlation_id))", diffStatus: "context" },
        { num: 7, text: "    correlation_id", diffStatus: "context" },
        { num: 8, text: "  end", diffStatus: "context" },
        { num: 9, text: "end", diffStatus: "context" }
      ]
    },
    // 23. Recovery Test (FAILING PROPERTY TEST)
    {
      path: "test/pipeline/recovery_test.exs",
      module: "Pipeline.RecoveryTest",
      subsystem: "test",
      loc: 72,
      changeStatus: "TEST_LEAD",
      diffSummary: "Property test proving crash recovery duplicates external HTTP mutations",
      eventIds: ["ev-01", "ev-12", "ev-20"],
      directCallers: [],
      directCallees: ["lib/pipeline/command_worker.ex", "test/support/command_fixture.ex"],
      symbols: [
        {
          id: "test_recovery_hazard",
          symbolKey: "Pipeline.RecoveryTest.test_idempotent_recovery",
          name: 'test "recovers pending command without duplicate external write"',
          module: "Pipeline.RecoveryTest",
          kind: "def",
          filePath: "test/pipeline/recovery_test.exs",
          span: { startLine: 14, endLine: 54, focusLine: 32 },
          callersCount: 0,
          calleesCount: 3,
          impactsEffect: true,
          isModified: false,
          docSummary: "Asserts that killed worker does not duplicate gateway payments; FAILS under PR #248."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Pipeline.RecoveryTest do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Counterexample witness test demonstrating PR #248 recovery hazard."', diffStatus: "context" },
        { num: 3, text: "  use ExUnit.Case, async: false", diffStatus: "context" },
        { num: 4, text: "  import Test.Support.CommandFixture", diffStatus: "context" },
        { num: 5, text: "", diffStatus: "context" },
        { num: 6, text: "  @tag :failing_witness", diffStatus: "context" },
        { num: 7, text: '  test "recovers pending command without duplicate external write" do', diffStatus: "context" },
        { num: 8, text: '    command = build_command(id: "cmd-42", amount: 120_000)', diffStatus: "context" },
        { num: 9, text: "    {:ok, _id} = Ingest.IngressController.submit(command)", diffStatus: "context" },
        { num: 10, text: "", diffStatus: "context" },
        { num: 11, text: "    # Simulate kill fault in worker during active HTTP socket connection", diffStatus: "context" },
        { num: 12, text: '    worker_pid = wait_for_worker("cmd-42")', diffStatus: "context" },
        { num: 13, text: "    Process.exit(worker_pid, :kill)", diffStatus: "focus", annotation: { line: 13, kind: "crash", label: "TEST_FAULT_INJECTION", detail: "Test kills worker PID while gateway dispatch is in-flight", badge: "KILL_TEST" } },
        { num: 14, text: "", diffStatus: "context" },
        { num: 15, text: "    # Supervisor restarts child worker", diffStatus: "context" },
        { num: 16, text: '    assert_eventually(fn -> is_pid(wait_for_worker("cmd-42")) end)', diffStatus: "context" },
        { num: 17, text: "", diffStatus: "context" },
        { num: 18, text: "    # Invariant: External gateway must receive EXACTLY ONE write for cmd-42", diffStatus: "context" },
        { num: 19, text: "    # FAILS: Under PR #248, count is 2 (DUPLICATE WRITE HAZARD)", diffStatus: "context", annotation: { line: 19, kind: "unconfirmed", label: "TEST_FAILURE", detail: "Expected 1 gateway call, observed 2 gateway calls", badge: "FAIL_ASSERT" } },
        { num: 20, text: '    attempts = Gateway.MockServer.received_calls("cmd-42")', diffStatus: "focus" },
        { num: 21, text: '    assert length(attempts) == 1, "Duplicate payment attempted for cmd-42!"', diffStatus: "context" },
        { num: 22, text: "  end", diffStatus: "context" },
        { num: 23, text: "end", diffStatus: "context" }
      ]
    },
    // 24. Command Fixture
    {
      path: "test/support/command_fixture.ex",
      module: "Test.Support.CommandFixture",
      subsystem: "test",
      loc: 32,
      changeStatus: "INFRA",
      diffSummary: "Generates synthetic command maps for unit and property testing",
      eventIds: [],
      directCallers: ["test/pipeline/recovery_test.exs"],
      directCallees: [],
      symbols: [
        {
          id: "fixture_build",
          symbolKey: "Test.Support.CommandFixture.build_command/1",
          name: "build_command/1",
          module: "Test.Support.CommandFixture",
          kind: "def",
          filePath: "test/support/command_fixture.ex",
          span: { startLine: 8, endLine: 24, focusLine: 14 },
          callersCount: 2,
          calleesCount: 0,
          impactsEffect: false,
          isModified: false,
          docSummary: "Constructs synthetic command map with unique UUID and payment payload."
        }
      ],
      lines: [
        { num: 1, text: "defmodule Test.Support.CommandFixture do", diffStatus: "context" },
        { num: 2, text: '  @moduledoc "Test helper synthesizing valid command parameters."', diffStatus: "context" },
        { num: 3, text: "", diffStatus: "context" },
        { num: 4, text: "  def build_command(attrs \\\\ []) do", diffStatus: "context" },
        { num: 5, text: '    id = Keyword.get(attrs, :id, "cmd-#{:rand.uniform(9999)}")', diffStatus: "context" },
        { num: 6, text: "    %{", diffStatus: "focus" },
        { num: 7, text: '      "id" => id,', diffStatus: "context" },
        { num: 8, text: '      "account_id" => "acct-test-99",', diffStatus: "context" },
        { num: 9, text: '      "amount" => Keyword.get(attrs, :amount, 50_000),', diffStatus: "context" },
        { num: 10, text: '      "target_url" => "/v1/settle",', diffStatus: "context" },
        { num: 11, text: '      "idempotency_key" => "idem-#{id}"', diffStatus: "context" },
        { num: 12, text: "    }", diffStatus: "context" },
        { num: 13, text: "  end", diffStatus: "context" },
        { num: 14, text: "end", diffStatus: "context" }
      ]
    }
  ];

  // elixirscope-interface-lab-v2/src/trace_data.ts
  var processIncarnations = [
    {
      id: "node-a-boot-1/ingress-pid1",
      nodeInstanceId: "node-a-boot-1",
      pidRepr: "<0.142.0>",
      logicalRoleId: "ingress",
      bornEventId: "ev-01",
      reincarnationIndex: 1,
      color: "#38bdf8"
    },
    {
      id: "node-b-boot-1/coord-pid1",
      nodeInstanceId: "node-b-boot-1",
      pidRepr: "<0.184.0>",
      logicalRoleId: "coordinator",
      bornEventId: "ev-04",
      reincarnationIndex: 1,
      color: "#818cf8"
    },
    {
      id: "node-b-boot-1/sup-pid1",
      nodeInstanceId: "node-b-boot-1",
      pidRepr: "<0.190.0>",
      logicalRoleId: "worker_supervisor",
      bornEventId: "ev-05",
      reincarnationIndex: 1,
      color: "#c084fc"
    },
    {
      id: "node-b-boot-1/worker-pid1",
      nodeInstanceId: "node-b-boot-1",
      pidRepr: "<0.210.0>",
      logicalRoleId: "worker-cmd-42",
      supervisorId: "node-b-boot-1/sup-pid1",
      bornEventId: "ev-06",
      diedEventId: "ev-13",
      exitReason: ":killed (simulated BEAM fault)",
      reincarnationIndex: 1,
      color: "#f87171"
      // Coral/Red (Crashes)
    },
    {
      id: "node-b-boot-1/worker-pid2",
      nodeInstanceId: "node-b-boot-1",
      pidRepr: "<0.288.0>",
      logicalRoleId: "worker-cmd-42",
      supervisorId: "node-b-boot-1/sup-pid1",
      bornEventId: "ev-16",
      reincarnationIndex: 2,
      color: "#2dd4bf"
      // Teal (Reincarnation)
    },
    {
      id: "node-c-boot-1/journal-pid1",
      nodeInstanceId: "node-c-boot-1",
      pidRepr: "<0.312.0>",
      logicalRoleId: "journal",
      bornEventId: "ev-07",
      reincarnationIndex: 1,
      color: "#34d399"
    },
    {
      id: "node-c-boot-1/ledger-pid1",
      nodeInstanceId: "node-c-boot-1",
      pidRepr: "<0.340.0>",
      logicalRoleId: "ledger",
      bornEventId: "ev-21",
      reincarnationIndex: 1,
      color: "#fbbf24"
    }
  ];
  var traceEvents = [
    {
      id: "ev-01",
      seq: 1,
      timeNs: 1e6,
      timeDisplay: "T+1.00ms",
      nodeInstanceId: "node-a-boot-1",
      processInstanceId: "node-a-boot-1/ingress-pid1",
      logicalRoleId: "ingress",
      eventType: "command_accepted",
      title: "Command Accepted",
      headline: "Ingress accepts cmd-42 payload on Node A",
      correlationId: "cmd-42",
      seqTraceToken: "tok-42-root",
      causalPredecessors: [],
      causalSuccessors: ["ev-02", "ev-03"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/ingest/ingress_controller.ex",
        symbolKey: "Ingest.IngressController.submit/1",
        span: { startLine: 5, endLine: 18, focusLine: 6 }
      },
      stateObservation: {
        ownerPid: "<0.142.0>",
        logicalRole: "ingress",
        phase: "before_callback",
        completeness: "metadata_only",
        fields: { intake_status: ":active", current_conn: 14 }
      },
      notes: "Ingress intake receives raw JSON payload with amount 120,000 cents."
    },
    {
      id: "ev-02",
      seq: 2,
      timeNs: 115e4,
      timeDisplay: "T+1.15ms",
      nodeInstanceId: "node-a-boot-1",
      processInstanceId: "node-a-boot-1/ingress-pid1",
      logicalRoleId: "ingress",
      eventType: "rate_limit_checked",
      title: "Rate Limit Checked",
      headline: "Account bucket updated in ETS table",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-01"],
      causalSuccessors: ["ev-03"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/ingest/rate_limiter.ex",
        symbolKey: "Ingest.RateLimiter.check_rate/1",
        span: { startLine: 5, endLine: 10, focusLine: 6 }
      },
      notes: "Account acct-test-99 consumed 1 token; balance remaining: 99."
    },
    {
      id: "ev-03",
      seq: 3,
      timeNs: 122e4,
      timeDisplay: "T+1.22ms",
      nodeInstanceId: "node-a-boot-1",
      processInstanceId: "node-a-boot-1/ingress-pid1",
      logicalRoleId: "ingress",
      eventType: "validation_passed",
      title: "Command Validated",
      headline: "Pure schema check passes; positive monetary amount verified",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-02"],
      causalSuccessors: ["ev-04"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/ingest/command_validator.ex",
        symbolKey: "Ingest.CommandValidator.validate/1",
        span: { startLine: 6, endLine: 14, focusLine: 7 }
      },
      notes: 'Constructed %Ingest.CommandValidator{id: "cmd-42", amount: 120000}.'
    },
    {
      id: "ev-04",
      seq: 4,
      timeNs: 135e4,
      timeDisplay: "T+1.35ms",
      nodeInstanceId: "node-a-boot-1",
      processInstanceId: "node-a-boot-1/ingress-pid1",
      logicalRoleId: "ingress",
      eventType: "message_sent",
      title: "Cross-Node Dispatch Dispatched",
      headline: "Node A transmits {:dispatch, cmd} to Coordinator on Node B",
      correlationId: "cmd-42",
      seqTraceToken: "tok-42-dist",
      causalPredecessors: ["ev-03"],
      causalSuccessors: ["ev-05"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/ingest/ingress_controller.ex",
        symbolKey: "Ingest.IngressController.submit/1",
        span: { startLine: 10, endLine: 14, focusLine: 12 }
      },
      notes: "Transmitted over Distributed Erlang channel with seq_trace token tok-42-dist."
    },
    {
      id: "ev-05",
      seq: 5,
      timeNs: 158e4,
      timeDisplay: "T+1.58ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/coord-pid1",
      logicalRoleId: "coordinator",
      eventType: "message_received",
      title: "Coordinator Intake",
      headline: "Coordinator on Node B receives command message",
      correlationId: "cmd-42",
      seqTraceToken: "tok-42-dist",
      causalPredecessors: ["ev-04"],
      causalSuccessors: ["ev-06"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/coordinator.ex",
        symbolKey: "Pipeline.Coordinator.handle_cast/2",
        span: { startLine: 14, endLine: 20, focusLine: 15 }
      },
      stateObservation: {
        ownerPid: "<0.184.0>",
        logicalRole: "coordinator",
        phase: "before_callback",
        completeness: "full",
        fields: { active_workers: {} }
      },
      notes: "Clock domain transition: Node A monotonic time -> Node B monotonic time (estimated offset +142\xB5s)."
    },
    {
      id: "ev-06",
      seq: 6,
      timeNs: 172e4,
      timeDisplay: "T+1.72ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/sup-pid1",
      logicalRoleId: "worker_supervisor",
      eventType: "process_spawned",
      title: "Spawn Worker Incarnation #1",
      headline: "DynamicSupervisor spawns CommandWorker <0.210.0>",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-05"],
      causalSuccessors: ["ev-07"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/worker_supervisor.ex",
        symbolKey: "Pipeline.WorkerSupervisor.start_worker/1",
        span: { startLine: 9, endLine: 12, focusLine: 11 }
      },
      notes: "Child PID <0.210.0> linked to DynamicSupervisor <0.190.0>."
    },
    {
      id: "ev-07",
      seq: 7,
      timeNs: 185e4,
      timeDisplay: "T+1.85ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "saga_step_initiated",
      title: "Worker #1 Init & Message Delivered",
      headline: "Worker <0.210.0> receives {:execute, cmd-42}",
      correlationId: "cmd-42",
      seqTraceToken: "msg-42",
      causalPredecessors: ["ev-06"],
      causalSuccessors: ["ev-08"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.handle_info/2 {:execute}",
        span: { startLine: 32, endLine: 37, focusLine: 33 }
      },
      stateObservation: {
        ownerPid: "<0.210.0>",
        logicalRole: "worker-cmd-42",
        phase: "before_callback",
        completeness: "full",
        fields: { status: ":init", retry_count: 0, command_id: "cmd-42" }
      },
      mailboxState: {
        ownerPid: "<0.210.0>",
        queueDepth: 1,
        messages: [
          { id: "m-1", msgType: "{:execute, %Command{}}", payloadPreview: "cmd-42 $1200.00", senderPid: "<0.184.0>", status: "active" }
        ]
      },
      notes: "Worker #1 begins execution flow."
    },
    {
      id: "ev-08",
      seq: 8,
      timeNs: 24e5,
      timeDisplay: "T+2.40ms",
      nodeInstanceId: "node-c-boot-1",
      processInstanceId: "node-c-boot-1/journal-pid1",
      logicalRoleId: "journal",
      eventType: "journal_write_attempted",
      title: "Journal Record Pending Inserted",
      headline: "SQL insert into CommandEntry on Node C marks status :pending",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-07"],
      causalSuccessors: ["ev-09"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/storage/journal.ex",
        symbolKey: "Storage.Journal.record_pending/2",
        span: { startLine: 15, endLine: 18, focusLine: 16 }
      },
      notes: 'PostgreSQL row inserted: command_id="cmd-42", status="pending".'
    },
    {
      id: "ev-09",
      seq: 9,
      timeNs: 29e5,
      timeDisplay: "T+2.90ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "state_observed",
      title: "Worker #1 State Snapshot",
      headline: 'State transitions to status: ":pending" prior to Gateway call',
      correlationId: "cmd-42",
      causalPredecessors: ["ev-08"],
      causalSuccessors: ["ev-10"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.handle_info/2 {:execute}",
        span: { startLine: 35, endLine: 37, focusLine: 36 }
      },
      stateObservation: {
        ownerPid: "<0.210.0>",
        logicalRole: "worker-cmd-42",
        phase: "after_callback",
        completeness: "full",
        fields: { status: ":pending", retry_count: 0, command_id: "cmd-42", in_flight_call: true },
        diffs: { status: { from: ":init", to: ":pending" } }
      },
      notes: "GenServer private memory updated."
    },
    {
      id: "ev-10",
      seq: 10,
      timeNs: 31e5,
      timeDisplay: "T+3.10ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "callback_enter",
      title: "Dispatch Invocation",
      headline: "Worker #1 invokes dispatch(cmd, state)",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-09"],
      causalSuccessors: ["ev-11"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.recover/2",
        span: { startLine: 39, endLine: 54, focusLine: 40 }
      },
      notes: "Enters private dispatch clause."
    },
    {
      id: "ev-11",
      seq: 11,
      timeNs: 345e4,
      timeDisplay: "T+3.45ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "effect_attempted",
      title: "EFFECT FRONTIER: External HTTP Post Attempt #1",
      headline: "Worker #1 initiates HTTP POST /v1/settle to External Gateway",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-10"],
      causalSuccessors: ["ev-12"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/gateway/external_client.ex",
        symbolKey: "Gateway.ExternalClient.post/2",
        span: { startLine: 9, endLine: 18, focusLine: 11 }
      },
      effectRecord: {
        id: "eff-01",
        operation: "HTTP POST /v1/settle",
        target: "api.gateway.internal",
        attemptNumber: 1,
        status: "outcome_unknown",
        payloadDigest: "sha256:7b49cf8a2...",
        hazardNote: "Outbound TCP frame sent over wire. Durable outcome unconfirmed!"
      },
      notes: "Outbound TCP network socket packet transmitted. External payment gateway received packet."
    },
    {
      id: "ev-12",
      seq: 12,
      timeNs: 48e5,
      timeDisplay: "T+4.80ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "worker_fault_injected",
      title: "CRASH SITE: Injected Fault Executed",
      headline: "Process.exit(self(), :kill) abruptly terminates worker <0.210.0>!",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-11"],
      causalSuccessors: ["ev-13"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.recover/2",
        span: { startLine: 41, endLine: 45, focusLine: 43 }
      },
      notes: "Simulated BEAM crash injected while HTTP request is in-flight on the wire!"
    },
    {
      id: "ev-13",
      seq: 13,
      timeNs: 492e4,
      timeDisplay: "T+4.92ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid1",
      logicalRoleId: "worker-cmd-42",
      eventType: "process_exit",
      title: 'Process Exit: ":killed"',
      headline: "Worker Incarnation #1 terminates abnormally with reason :killed",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-12"],
      causalSuccessors: ["ev-14"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.recover/2",
        span: { startLine: 43, endLine: 44, focusLine: 43 }
      },
      stateObservation: {
        ownerPid: "<0.210.0>",
        logicalRole: "worker-cmd-42",
        phase: "crash",
        completeness: "metadata_only",
        fields: { exit_reason: ":killed" },
        unrecordedGap: "Intermediate socket return state between T+3.45ms and T+4.80ms was NOT captured"
      },
      notes: "Abnormal termination signal propagates to parent supervisor."
    },
    {
      id: "ev-14",
      seq: 14,
      timeNs: 51e5,
      timeDisplay: "T+5.10ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/sup-pid1",
      logicalRoleId: "worker_supervisor",
      eventType: "monitor_down_received",
      title: "Supervisor Trap :DOWN",
      headline: "WorkerSupervisor traps abnormal termination of child <0.210.0>",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-13"],
      causalSuccessors: ["ev-15"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/worker_supervisor.ex",
        symbolKey: "Pipeline.WorkerSupervisor.init/1",
        span: { startLine: 16, endLine: 21, focusLine: 18 }
      },
      notes: "Supervisor link monitor signal: {:EXIT, <0.210.0>, :killed}."
    },
    {
      id: "ev-15",
      seq: 15,
      timeNs: 525e4,
      timeDisplay: "T+5.25ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/sup-pid1",
      logicalRoleId: "worker_supervisor",
      eventType: "supervisor_restart_decision",
      title: "Supervisor Restart Decision",
      headline: "Supervisor verifies restart intensity (1 of 5 consumed) and triggers restart",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-14"],
      causalSuccessors: ["ev-16"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/worker_supervisor.ex",
        symbolKey: "Pipeline.WorkerSupervisor.init/1",
        span: { startLine: 17, endLine: 21, focusLine: 19 }
      },
      notes: "Restart budget: max_restarts: 5 within 10s. Current: 1. Restart approved under :one_for_one."
    },
    {
      id: "ev-16",
      seq: 16,
      timeNs: 56e5,
      timeDisplay: "T+5.60ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid2",
      logicalRoleId: "worker-cmd-42",
      eventType: "process_spawned",
      title: "Spawn Worker Incarnation #2",
      headline: "Fresh process <0.288.0> spawned for logical role worker-cmd-42",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-15"],
      causalSuccessors: ["ev-17"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.init/1",
        span: { startLine: 12, endLine: 17, focusLine: 13 }
      },
      notes: "CRITICAL OTP PROPERTY: Process state memory is NOT preserved across restarts! Fresh incarnation <0.288.0> starts with virgin heap."
    },
    {
      id: "ev-17",
      seq: 17,
      timeNs: 585e4,
      timeDisplay: "T+5.85ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid2",
      logicalRoleId: "worker-cmd-42",
      eventType: "reincarnation_init",
      title: "Worker #2 Init Callback",
      headline: "Worker <0.288.0> runs init/1 and returns {:continue, :evaluate_recovery}",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-16"],
      causalSuccessors: ["ev-18"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.init/1",
        span: { startLine: 13, endLine: 17, focusLine: 15 }
      },
      stateObservation: {
        ownerPid: "<0.288.0>",
        logicalRole: "worker-cmd-42",
        phase: "init",
        completeness: "full",
        fields: { status: ":init", retry_count: 0, command_id: "cmd-42", in_flight_call: null }
      },
      notes: "State reset: retry_count reset to 0; no knowledge of previous socket attempt."
    },
    {
      id: "ev-18",
      seq: 18,
      timeNs: 64e5,
      timeDisplay: "T+6.40ms",
      nodeInstanceId: "node-c-boot-1",
      processInstanceId: "node-c-boot-1/journal-pid1",
      logicalRoleId: "journal",
      eventType: "journal_status_queried",
      title: "Journal Status Queried",
      headline: 'Worker #2 queries Journal.status("cmd-42") on Node C -> returns :pending',
      correlationId: "cmd-42",
      causalPredecessors: ["ev-17"],
      causalSuccessors: ["ev-19"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/storage/journal.ex",
        symbolKey: "Storage.Journal.status/1",
        span: { startLine: 6, endLine: 13, focusLine: 10 }
      },
      notes: "Journal status returned as :pending because commit/2 was never invoked prior to crash."
    },
    {
      id: "ev-19",
      seq: 19,
      timeNs: 71e5,
      timeDisplay: "T+7.10ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid2",
      logicalRoleId: "worker-cmd-42",
      eventType: "recovery_evaluated",
      title: "PR #248 MODIFICATION: recover/2 Clause Invoked",
      headline: "Worker #2 enters PR #248 recover/2 pending clause",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-18"],
      causalSuccessors: ["ev-20"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/pipeline/command_worker.ex",
        symbolKey: "Pipeline.CommandWorker.recover/2",
        span: { startLine: 56, endLine: 70, focusLine: 63 }
      },
      stateObservation: {
        ownerPid: "<0.288.0>",
        logicalRole: "worker-cmd-42",
        phase: "before_callback",
        completeness: "full",
        fields: { status: ":pending", retry_count: 0, command_id: "cmd-42" },
        diffs: { status: { from: ":init", to: ":pending" } }
      },
      notes: "PR #248 modified this clause to immediately resubmit to Gateway.dispatch/1!"
    },
    {
      id: "ev-20",
      seq: 20,
      timeNs: 78e5,
      timeDisplay: "T+7.80ms",
      nodeInstanceId: "node-b-boot-1",
      processInstanceId: "node-b-boot-1/worker-pid2",
      logicalRoleId: "worker-cmd-42",
      eventType: "duplicate_effect_attempted",
      title: "HAZARD: External HTTP Post Attempt #2 (DUPLICATE WRITE)",
      headline: "Worker #2 sends SECOND HTTP POST /v1/settle for cmd-42 to External Gateway!",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-19"],
      causalSuccessors: ["ev-21"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/gateway/external_client.ex",
        symbolKey: "Gateway.ExternalClient.post/2",
        span: { startLine: 9, endLine: 18, focusLine: 11 }
      },
      effectRecord: {
        id: "eff-02",
        operation: "HTTP POST /v1/settle",
        target: "api.gateway.internal",
        attemptNumber: 2,
        status: "attempted",
        payloadDigest: "sha256:7b49cf8a2...",
        hazardNote: "DUPLICATE WRITE HAZARD: Attempt #1 was never confirmed dead! Customer card may be charged twice!"
      },
      notes: "EVIDENCE GAP: The capture protocol proves Attempt #1 occurred and Attempt #2 occurred, but lacks proof of whether Attempt #1 was applied at the gateway."
    },
    {
      id: "ev-21",
      seq: 21,
      timeNs: 89e5,
      timeDisplay: "T+8.90ms",
      nodeInstanceId: "node-c-boot-1",
      processInstanceId: "node-c-boot-1/ledger-pid1",
      logicalRoleId: "ledger",
      eventType: "duplicate_warning_emitted",
      title: "Ledger Writer Invariant Alert",
      headline: "LedgerWriter detects concurrent debit authorization for reference cmd-42",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-20"],
      causalSuccessors: ["ev-22"],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/settlement/ledger_writer.ex",
        symbolKey: "Settlement.LedgerWriter.post_entry/3",
        span: { startLine: 4, endLine: 12, focusLine: 10 }
      },
      notes: "Ledger audit detects double authorization anomaly."
    },
    {
      id: "ev-22",
      seq: 22,
      timeNs: 94e5,
      timeDisplay: "T+9.40ms",
      nodeInstanceId: "node-c-boot-1",
      processInstanceId: "node-c-boot-1/journal-pid1",
      logicalRoleId: "journal",
      eventType: "journal_write_committed",
      title: "Late Journal Commit for Attempt #2",
      headline: "Attempt #2 commits to SQL journal, masking the unconfirmed status of Attempt #1",
      correlationId: "cmd-42",
      causalPredecessors: ["ev-21"],
      causalSuccessors: [],
      epistemicClass: "observed",
      sourceRef: {
        repositoryId: "saga-core",
        revisionId: "head-rev-248",
        filePath: "lib/storage/journal.ex",
        symbolKey: "Storage.Journal.commit/2",
        span: { startLine: 20, endLine: 24, focusLine: 22 }
      },
      stateObservation: {
        ownerPid: "<0.288.0>",
        logicalRole: "worker-cmd-42",
        phase: "after_callback",
        completeness: "full",
        fields: { status: ":committed", retry_count: 1, command_id: "cmd-42" },
        diffs: { status: { from: ":pending", to: ":committed" } }
      },
      notes: "Saga terminates with potential phantom double charge on payment gateway."
    }
  ];
  var comparisonMilestones = [
    {
      index: 1,
      phaseName: "01 / Ingress Intake",
      symbol: "Ingest.IngressController.submit/1",
      runAEventId: "run-pass-001",
      runBEventId: "ev-01",
      runAStatus: "observed",
      runBStatus: "observed",
      matchBasis: "correlation_token",
      divergenceType: "identical",
      notes: "Both runs accept command cmd-42 with matching payload hash and seq_trace label."
    },
    {
      index: 2,
      phaseName: "02 / Rate Limit & Validation",
      symbol: "Ingest.CommandValidator.validate/1",
      runAEventId: "run-pass-002",
      runBEventId: "ev-03",
      runAStatus: "observed",
      runBStatus: "observed",
      matchBasis: "logical_role_and_symbol",
      divergenceType: "identical",
      notes: "Pure schema verification is identical in both runs."
    },
    {
      index: 3,
      phaseName: "03 / Journal Status Insert",
      symbol: "Storage.Journal.record_pending/2",
      runAEventId: "run-pass-003",
      runBEventId: "ev-08",
      runAStatus: "observed",
      runBStatus: "observed",
      matchBasis: "correlation_token",
      divergenceType: "identical",
      notes: "Both runs insert pending entry into PostgreSQL on Node C."
    },
    {
      index: 4,
      phaseName: "04 / Gateway Dispatch Attempt #1",
      symbol: "Gateway.ExternalClient.post/2",
      runAEventId: "run-pass-004",
      runBEventId: "ev-11",
      runAStatus: "observed",
      runBStatus: "observed",
      matchBasis: "effect_frontier",
      divergenceType: "identical",
      notes: "Both runs dispatch HTTP POST /v1/settle to external payment gateway."
    },
    {
      index: 5,
      phaseName: "05 / Fault Injection Point (DIVERGENCE)",
      symbol: "Pipeline.CommandWorker.recover/2",
      runAEventId: "run-pass-005",
      runBEventId: "ev-12",
      runAStatus: "observed",
      runBStatus: "crash",
      matchBasis: "logical_role_and_symbol",
      divergenceType: "crash_injected",
      notes: "EARLIEST SUPPORTED DIVERGENCE: Run A succeeds smoothly; Run B injects Process.exit(:kill) during socket wait!"
    },
    {
      index: 6,
      phaseName: "06 / Supervisor Reaction & Reincarnation",
      symbol: "Pipeline.WorkerSupervisor.init/1",
      runAEventId: void 0,
      runBEventId: "ev-16",
      runAStatus: "missing",
      runBStatus: "observed",
      matchBasis: "logical_role_and_symbol",
      divergenceType: "crash_injected",
      notes: "Run A never restarts. Run B supervisor catches :DOWN and spawns Worker Incarnation #2 (<0.288.0>)."
    },
    {
      index: 7,
      phaseName: "07 / Post-Crash Recovery Evaluation",
      symbol: "Pipeline.CommandWorker.recover/2",
      runAEventId: void 0,
      runBEventId: "ev-19",
      runAStatus: "missing",
      runBStatus: "observed",
      matchBasis: "logical_role_and_symbol",
      divergenceType: "duplicate_attempt",
      notes: "Under PR #248, Worker #2 evaluates :pending status in Journal and re-dispatches to Gateway."
    },
    {
      index: 8,
      phaseName: "08 / Duplicate External Mutation Hazard",
      symbol: "Gateway.ExternalClient.post/2",
      runAEventId: void 0,
      runBEventId: "ev-20",
      runAStatus: "missing",
      runBStatus: "diverged",
      matchBasis: "effect_frontier",
      divergenceType: "duplicate_attempt",
      notes: "CRITICAL CONCURRENCY BUG: Run B executes Attempt #2 without knowing if Attempt #1 succeeded!"
    }
  ];
  var initialSupervisionNodes = [
    {
      id: "Core.Supervisor",
      name: "Core.Supervisor",
      type: "supervisor",
      strategy: ":one_for_one",
      maxRestarts: 10,
      maxSeconds: 60,
      activeChildren: 3,
      restartsObserved: 0,
      incarnationHistory: ["<0.105.0>"],
      blastRadius: ["Cluster.NodeMonitor", "Cluster.RingManager", "Core.RootSupervisor"]
    },
    {
      id: "Core.RootSupervisor",
      name: "Core.RootSupervisor",
      type: "supervisor",
      strategy: ":rest_for_one",
      maxRestarts: 10,
      maxSeconds: 60,
      activeChildren: 5,
      restartsObserved: 0,
      incarnationHistory: ["<0.112.0>"],
      blastRadius: ["Pipeline.WorkerSupervisor", "Pipeline.Coordinator"]
    },
    {
      id: "Pipeline.WorkerSupervisor",
      name: "Pipeline.WorkerSupervisor",
      type: "dynamic_supervisor",
      strategy: ":one_for_one",
      maxRestarts: 5,
      maxSeconds: 10,
      activeChildren: 1,
      restartsObserved: 1,
      incarnationHistory: ["<0.190.0>"],
      blastRadius: ["Pipeline.CommandWorker"]
    },
    {
      id: "Pipeline.CommandWorker (role: worker-cmd-42)",
      name: "CommandWorker [role: worker-cmd-42]",
      type: "worker",
      activeChildren: 0,
      restartsObserved: 1,
      incarnationHistory: ["<0.210.0> (died :killed)", "<0.288.0> (reincarnation)"],
      blastRadius: []
    }
  ];
  var initialFindings = [
    {
      id: "F-001",
      title: "Non-idempotent gateway retry across worker restart boundary",
      severity: "critical",
      status: "active",
      claim: "PR #248 modified recover/2 to resubmit pending commands to Gateway.ExternalClient.post/2 after worker restart. In the failing recording, two distinct HTTP POST attempts occurred for cmd-42. The outcome of the first attempt is UNRECORDED, creating a critical risk of duplicate external payment mutations.",
      anchors: [
        {
          filePath: "lib/pipeline/command_worker.ex",
          symbol: "Pipeline.CommandWorker.recover/2",
          lineRange: "L57\u201370",
          eventId: "ev-20"
        },
        {
          filePath: "lib/gateway/external_client.ex",
          symbol: "Gateway.ExternalClient.post/2",
          lineRange: "L9\u201318",
          eventId: "ev-11"
        }
      ],
      evidencePoints: [
        {
          kind: "observed",
          summary: "Attempt #1 recorded at T+3.45ms by Worker-1 (<0.210.0>)."
        },
        {
          kind: "observed",
          summary: "Worker-1 killed by simulated fault at T+4.80ms during active HTTP request."
        },
        {
          kind: "unknown_gap",
          summary: "Capture lacks external gateway response or commit proof for Attempt #1."
        },
        {
          kind: "observed",
          summary: "Supervisor spawned Worker-2 (<0.288.0>) which re-executed Attempt #2 at T+7.80ms."
        }
      ],
      competingHypotheses: [
        "The external payment gateway might have idempotency keys enabled on its server side (unverified).",
        "The first HTTP TCP connection might have been dropped by the OS socket buffer before receipt."
      ],
      unresolvedGaps: [
        "External gateway access logs are not instrumented in this capture session.",
        "No pre-dispatch idempotency reservation was inserted into Storage.Journal."
      ],
      createdEpoch: "rev-248-investigation-1"
    },
    {
      id: "F-002",
      title: "GenServer private state reset obscures previous in-flight dispatch attempt",
      severity: "high",
      status: "active",
      claim: "When CommandWorker <0.210.0> was killed and restarted as <0.288.0>, state memory was reset. The new process had retry_count: 0 and in_flight_call: nil, concealing the fact that a socket dispatch had already been initiated.",
      anchors: [
        {
          filePath: "lib/pipeline/command_worker.ex",
          symbol: "Pipeline.CommandWorker.init/1",
          lineRange: "L13\u201317",
          eventId: "ev-17"
        }
      ],
      evidencePoints: [
        {
          kind: "observed",
          summary: "Worker <0.288.0> init/1 callback instantiated clean %CommandWorker{} struct."
        },
        {
          kind: "static_possible",
          summary: "OTP supervision does not persist process heap across child restart boundaries."
        }
      ],
      competingHypotheses: [
        "State was intended to be reloaded exclusively from the Journal database on Node C."
      ],
      unresolvedGaps: [
        "Journal does not store an attempt_count column or socket lease lock."
      ],
      createdEpoch: "rev-248-investigation-1"
    },
    {
      id: "F-003",
      title: "Missing transactional outbox pattern prior to external socket transmission",
      severity: "critical",
      status: "active",
      claim: "Storage.Journal.commit/2 is called AFTER Gateway.ExternalClient.post/2 returns. If the process crashes while the external request is in transit, the Journal remains :pending, directly misleading recovery into believing the command was never executed.",
      anchors: [
        {
          filePath: "lib/storage/journal.ex",
          symbol: "Storage.Journal.commit/2",
          lineRange: "L20\u201324",
          eventId: "ev-22"
        }
      ],
      evidencePoints: [
        {
          kind: "observed",
          summary: 'Journal row remained status="pending" after Worker-1 crashed at T+4.80ms.'
        },
        {
          kind: "observed",
          summary: 'Worker-2 inspected Journal.status("cmd-42") and branched to recover/2 because it was :pending.'
        }
      ],
      competingHypotheses: [
        "Developers assumed atomic two-phase commit without distributed coordinator."
      ],
      unresolvedGaps: [
        "No two-phase commit or transactional outbox queue implemented in storage layer."
      ],
      createdEpoch: "rev-248-investigation-1"
    }
  ];

  // elixirscope-interface-lab-v2/src/app.ts
  var appState = {
    lens: "cockpit",
    followMode: "role",
    activeFileIndex: 7,
    // Default: lib/pipeline/command_worker.ex
    activeEventIndex: 10,
    // Default: ev-11 (Attempt #1 Gateway)
    activeSymbolKey: "Pipeline.CommandWorker.recover/2",
    pinnedFileIndex: 7,
    pinnedLine: 57,
    pinnedSymbolKey: "Pipeline.CommandWorker.recover/2 (baseline)",
    isPinnedSplit: false,
    selectedProcessId: "node-b-boot-1/worker-pid1",
    selectedNodeId: "node-b-boot-1",
    epoch: 1
  };
  var isPlaying = false;
  var playInterval = null;
  var commandPaletteOpen = false;
  var shortcutsModalOpen = false;
  var findingsList = JSON.parse(JSON.stringify(initialFindings));
  var fileSearchQuery = "";
  function getActiveEvent() {
    return traceEvents[appState.activeEventIndex] || traceEvents[0];
  }
  function getActiveFile() {
    return codebaseFiles[appState.activeFileIndex] || codebaseFiles[0];
  }
  function getPinnedFile() {
    return codebaseFiles[appState.pinnedFileIndex ?? 7] || codebaseFiles[0];
  }
  function escapeHtml(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function highlightSyntax(code) {
    const re = /(#[^\n]*|"(?:\\.|[^"\\])*"|\b(?:defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|require|@impl|@moduledoc|@spec|@behaviour|@doc|test|assert)\b|@[a-z_]+|:[a-z][\w!?]*|\b[A-Z][A-Za-z0-9_.]*\b|\b\d+\b|\b[a-z][a-z0-9_!?]*(?=\())/g;
    let out = "";
    let last = 0;
    let match;
    while ((match = re.exec(code)) !== null) {
      out += escapeHtml(code.slice(last, match.index));
      const token = match[0];
      let cls = "tok-fn";
      if (token.startsWith("#")) cls = "tok-comment";
      else if (token.startsWith('"')) cls = "tok-string";
      else if (token.startsWith(":")) cls = "tok-atom";
      else if (token.startsWith("@")) cls = "tok-attr";
      else if (/^\d+$/.test(token)) cls = "tok-num";
      else if (/^[A-Z]/.test(token)) cls = "tok-module";
      else if (/^(defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|require|test|assert)$/.test(token)) cls = "tok-keyword";
      out += `<span class="${cls}">${escapeHtml(token)}</span>`;
      last = match.index + token.length;
    }
    return out + escapeHtml(code.slice(last));
  }
  function setEventIndex(idx, fromPlayback = false) {
    const clamped = Math.max(0, Math.min(idx, traceEvents.length - 1));
    appState.activeEventIndex = clamped;
    appState.epoch++;
    const ev = traceEvents[clamped];
    appState.selectedProcessId = ev.processInstanceId;
    appState.selectedNodeId = ev.nodeInstanceId;
    if (ev.sourceRef && appState.followMode !== "free") {
      const fileIdx = codebaseFiles.findIndex((f) => f.path === ev.sourceRef.filePath);
      if (fileIdx !== -1) {
        appState.activeFileIndex = fileIdx;
        appState.activeSymbolKey = ev.sourceRef.symbolKey;
      }
    }
    renderApp(fromPlayback);
    requestAnimationFrame(() => {
      const el = document.querySelector(".code-line.is-active-line");
      if (el) {
        el.scrollIntoView({ behavior: fromPlayback ? "auto" : "smooth", block: "center" });
      }
    });
  }
  function setFileIndex(idx) {
    appState.activeFileIndex = Math.max(0, Math.min(idx, codebaseFiles.length - 1));
    const file = codebaseFiles[appState.activeFileIndex];
    if (file.symbols.length > 0) {
      appState.activeSymbolKey = file.symbols[0].symbolKey;
    }
    appState.epoch++;
    renderApp();
  }
  function togglePlayback() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playInterval = window.setInterval(() => {
        if (appState.activeEventIndex >= traceEvents.length - 1) {
          setEventIndex(0, true);
        } else {
          setEventIndex(appState.activeEventIndex + 1, true);
        }
      }, 700);
    } else {
      if (playInterval) clearInterval(playInterval);
      playInterval = null;
    }
    renderApp();
  }
  function togglePinSplit() {
    appState.isPinnedSplit = !appState.isPinnedSplit;
    if (appState.isPinnedSplit) {
      appState.pinnedFileIndex = appState.activeFileIndex;
      const file = getActiveFile();
      appState.pinnedLine = file.symbols[0]?.span.focusLine || 1;
      appState.pinnedSymbolKey = appState.activeSymbolKey;
    }
    renderApp();
  }
  function setFollowMode(mode) {
    appState.followMode = mode;
    renderApp();
  }
  function setLens(lens) {
    appState.lens = lens;
    renderApp();
  }
  function jumpToMilestone(type) {
    let targetIdx = 0;
    if (type === "intake") targetIdx = 0;
    else if (type === "dispatch") targetIdx = 10;
    else if (type === "crash") targetIdx = 11;
    else if (type === "reincarnation") targetIdx = 15;
    else if (type === "duplicate") targetIdx = 19;
    setEventIndex(targetIdx);
  }
  function setupKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== "range" || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") {
          commandPaletteOpen = false;
          renderApp();
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        commandPaletteOpen = !commandPaletteOpen;
        renderApp();
      } else if (e.key === "/") {
        e.preventDefault();
        document.querySelector(".atlas-search-input")?.focus();
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        setEventIndex(e.key === "Home" ? 0 : traceEvents.length - 1);
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlayback();
      } else if (e.key === "ArrowRight" || e.key === "k" || e.key === "l") {
        e.preventDefault();
        setEventIndex(appState.activeEventIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "h") {
        e.preventDefault();
        setEventIndex(appState.activeEventIndex - 1);
      } else if (e.key === "]" || e.key === "PageDown") {
        e.preventDefault();
        setFileIndex(appState.activeFileIndex + 1);
      } else if (e.key === "[" || e.key === "PageUp") {
        e.preventDefault();
        setFileIndex(appState.activeFileIndex - 1);
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePinSplit();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        const modes = ["role", "process", "causal", "free"];
        const cur = modes.indexOf(appState.followMode);
        setFollowMode(modes[(cur + 1) % modes.length]);
      } else if (e.key.toLowerCase() === "x") {
        e.preventDefault();
        jumpToMilestone("crash");
      } else if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        jumpToMilestone("duplicate");
      } else if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        jumpToMilestone("dispatch");
      } else if (e.key === "1") {
        setLens("cockpit");
      } else if (e.key === "2") {
        setLens("cinema");
      } else if (e.key === "3") {
        setLens("review");
      } else if (e.key === "4") {
        setLens("compare");
      } else if (e.key === "5") {
        setLens("supervision");
      } else if (e.key === "6") {
        setLens("evidence");
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        commandPaletteOpen = !commandPaletteOpen;
        renderApp();
      } else if (e.key === "?") {
        e.preventDefault();
        shortcutsModalOpen = !shortcutsModalOpen;
        renderApp();
      } else if (e.key === "Escape") {
        commandPaletteOpen = false;
        shortcutsModalOpen = false;
        renderApp();
      }
    });
  }
  function renderHeader() {
    const ev = getActiveEvent();
    return `
    <header class="cockpit-top-bar">
      <div class="brand-zone">
        <div class="brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">ELIXIRSCOPE <span class="tag-v2">V2 COCKPIT</span></span>
          <span class="brand-sub">CAUSAL REVIEW &amp; BEAM CINEMA INSTRUMENT</span>
        </div>
      </div>

      <!-- Live Epistemic Gauge HUD -->
      <div class="epistemic-gauge-hud">
        <div class="hud-pill" title="Observed trace events in session">
          <span class="hud-dot dot-green"></span>
          <span class="hud-label">OBSERVED</span>
          <span class="hud-val">22</span>
        </div>
        <div class="hud-pill" title="Static analysis Reach/ExAST call edges">
          <span class="hud-dot dot-cyan"></span>
          <span class="hud-label">STATIC</span>
          <span class="hud-val">42</span>
        </div>
        <div class="hud-pill" title="Point-in-time state observations">
          <span class="hud-dot dot-purple"></span>
          <span class="hud-label">STATE PTS</span>
          <span class="hud-val">8</span>
        </div>
        <div class="hud-pill alert-gap" title="Critical epistemic gaps / unobserved outcomes">
          <span class="hud-dot dot-amber"></span>
          <span class="hud-label">GAPS</span>
          <span class="hud-val">2</span>
        </div>
        <div class="hud-pill" title="Target Elixir codebase files loaded">
          <span class="hud-dot dot-blue"></span>
          <span class="hud-label">CODEBASE</span>
          <span class="hud-val">${codebaseFiles.length} FILES</span>
        </div>
      </div>

      <!-- Lens Mode Switcher Tabs -->
      <nav class="lens-nav">
        <button class="lens-tab ${appState.lens === "cockpit" ? "active" : ""}" onclick="window.setLens('cockpit')">
          <span class="lens-num">1</span> COCKPIT
        </button>
        <button class="lens-tab ${appState.lens === "cinema" ? "active" : ""}" onclick="window.setLens('cinema')">
          <span class="lens-num">2</span> CINEMA
        </button>
        <button class="lens-tab ${appState.lens === "review" ? "active" : ""}" onclick="window.setLens('review')">
          <span class="lens-num">3</span> REVIEW DIFF
        </button>
        <button class="lens-tab ${appState.lens === "compare" ? "active" : ""}" onclick="window.setLens('compare')">
          <span class="lens-num">4</span> DUAL RUN
        </button>
        <button class="lens-tab ${appState.lens === "supervision" ? "active" : ""}" onclick="window.setLens('supervision')">
          <span class="lens-num">5</span> OTP BLAST
        </button>
        <button class="lens-tab ${appState.lens === "evidence" ? "active" : ""}" onclick="window.setLens('evidence')">
          <span class="lens-num">6</span> FINDINGS
        </button>
      </nav>

      <!-- Global Actions -->
      <div class="top-actions">
        <button class="action-btn" onclick="window.openPalette()" title="Command Palette (\u2318K)">
          <kbd>\u2318K</kbd>
        </button>
        <button class="action-btn" onclick="window.openShortcuts()" title="Hotkey Cheat Sheet (?)">
          <span>?</span>
        </button>
      </div>
    </header>
  `;
  }
  function renderScrubberDeck() {
    const ev = getActiveEvent();
    const progressPercent = appState.activeEventIndex / (traceEvents.length - 1) * 100;
    return `
    <div class="master-scrubber-deck">
      <div class="transport-controls">
        <button class="scrub-btn" onclick="window.setEventIndex(0)" title="Jump to Start (Home)">\u23EE</button>
        <button class="scrub-btn" onclick="window.setEventIndex(${appState.activeEventIndex - 1})" title="Step Back (H / J / \u2190)">\u25C0</button>
        <button class="scrub-btn play-pause-btn ${isPlaying ? "playing" : ""}" onclick="window.togglePlayback()" title="Play / Pause (Space)">
          ${isPlaying ? "\u23F8 PAUSE" : "\u25B6 PLAY"}
        </button>
        <button class="scrub-btn" onclick="window.setEventIndex(${appState.activeEventIndex + 1})" title="Step Forward (L / K / \u2192)">\u25B6</button>
        <button class="scrub-btn" onclick="window.setEventIndex(${traceEvents.length - 1})" title="Jump to End (End)">\u23ED</button>
      </div>

      <!-- Quick Causal Milestones Fast-Jump -->
      <div class="milestone-jump-bar">
        <button class="milestone-pill ${appState.activeEventIndex === 0 ? "active" : ""}" onclick="window.jumpToMilestone('intake')" title="Event 1: Ingress Intake">
          <span class="pill-dot dot-blue"></span> 01 INTAKE
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 10 ? "active" : ""}" onclick="window.jumpToMilestone('dispatch')" title="Event 11: HTTP Dispatch Attempt #1">
          <span class="pill-dot dot-amber"></span> 11 GATEWAY #1
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 11 ? "active" : ""}" onclick="window.jumpToMilestone('crash')" title="Event 12: Worker Kill Crash Site (X)">
          <span class="pill-dot dot-red"></span> 12 CRASH SITE (X)
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 15 ? "active" : ""}" onclick="window.jumpToMilestone('reincarnation')" title="Event 16: Worker Incarnation #2 Spawn">
          <span class="pill-dot dot-cyan"></span> 16 REINCARNATION
        </button>
        <button class="milestone-pill alert-pill ${appState.activeEventIndex === 19 ? "active" : ""}" onclick="window.jumpToMilestone('duplicate')" title="Event 20: Duplicate HTTP Dispatch Hazard! (D)">
          <span class="pill-dot dot-amber-pulse"></span> 20 DUPLICATE WRITE (D)
        </button>
      </div>

      <!-- High-Frequency Continuous Scrubber Range -->
      <div class="scrubber-range-container">
        <div class="scrubber-track-waveform">
          ${traceEvents.map((e, idx) => {
      let color = "#38bdf8";
      if (e.eventType.includes("crash") || e.eventType.includes("exit")) color = "#f87171";
      else if (e.eventType.includes("effect") || e.eventType.includes("warning")) color = "#fbbf24";
      else if (e.eventType.includes("journal")) color = "#34d399";
      else if (e.eventType.includes("spawn") || e.eventType.includes("reincarnation")) color = "#a78bfa";
      return `
              <div 
                class="event-pip ${idx === appState.activeEventIndex ? "is-active" : ""}"
                style="left: ${idx / (traceEvents.length - 1) * 100}%; background: ${color};"
                onclick="window.setEventIndex(${idx})"
                title="${e.timeDisplay} \xB7 ${escapeHtml(e.title)}"
              ></div>
            `;
    }).join("")}
          <div class="scrub-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <input 
          type="range" 
          min="0" 
          max="${traceEvents.length - 1}" 
          value="${appState.activeEventIndex}"
          class="master-scrub-input" 
          aria-label="Scrub recorded execution" oninput="window.setEventIndex(parseInt(this.value, 10), true)"
        />
      </div>

      <!-- Active Position HUD Badge -->
      <div class="scrub-hud-info">
        <span class="scrub-time">${ev.timeDisplay}</span>
        <span class="scrub-step">STEP ${String(ev.seq).padStart(2, "0")}/${String(traceEvents.length).padStart(2, "0")}</span>
        <span class="scrub-role">${escapeHtml(ev.logicalRoleId)}</span>
        <span class="scrub-pid">${escapeHtml(ev.processInstanceId.split("/").pop())}</span>
      </div>

      <!-- Follow Mode Toggle -->
      <div class="follow-mode-selector">
        <span class="follow-label">FOLLOW:</span>
        <button class="follow-pill ${appState.followMode === "role" ? "active" : ""}" onclick="window.setFollowMode('role')" title="Follow logical role across restarts">ROLE</button>
        <button class="follow-pill ${appState.followMode === "process" ? "active" : ""}" onclick="window.setFollowMode('process')" title="Follow strictly single process incarnation">PROCESS</button>
        <button class="follow-pill ${appState.followMode === "causal" ? "active" : ""}" onclick="window.setFollowMode('causal')" title="Follow causal happens-before graph">CAUSAL</button>
        <button class="follow-pill ${appState.followMode === "free" ? "active" : ""}" onclick="window.setFollowMode('free')" title="Free manual navigation">FREE</button>
      </div>

      <!-- Split Pin Toggle -->
      <button class="pin-toggle-btn ${appState.isPinnedSplit ? "active" : ""}" onclick="window.togglePinSplit()" title="Pin split baseline code viewer (P)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
        <span>${appState.isPinnedSplit ? "PINNED SPLIT ON" : "PIN BASELINE (P)"}</span>
      </button>
    </div>
  `;
  }
  function renderCodebaseAtlas() {
    const activeFile = getActiveFile();
    const filtered = fileSearchQuery ? codebaseFiles.filter((f) => f.path.toLowerCase().includes(fileSearchQuery.toLowerCase()) || f.module.toLowerCase().includes(fileSearchQuery.toLowerCase())) : codebaseFiles;
    return `
    <section class="codebase-atlas-strip">
      <div class="atlas-header">
        <div class="atlas-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>CODEBASE ATLAS &mdash; 24 OTP SOURCE UNITS</span>
        </div>
        <div class="atlas-filter">
          <input 
            type="text" 
            placeholder="Filter 24 files... (/)" 
            value="${escapeHtml(fileSearchQuery)}"
            oninput="window.setFileFilter(this.value)"
            class="atlas-search-input"
          />
        </div>
      </div>

      <div class="atlas-grid">
        ${filtered.map((file, i) => {
      const originalIdx = codebaseFiles.indexOf(file);
      const isActive = originalIdx === appState.activeFileIndex;
      const isPinned = appState.isPinnedSplit && originalIdx === appState.pinnedFileIndex;
      let badgeCls = "tag-infra";
      if (file.changeStatus === "MODIFIED") badgeCls = "tag-mod";
      else if (file.changeStatus === "EFFECT_FRONTIER") badgeCls = "tag-frontier";
      else if (file.changeStatus === "TEST_LEAD") badgeCls = "tag-lead";
      else if (file.changeStatus === "CALLER") badgeCls = "tag-caller";
      return `
            <div 
              class="atlas-card ${isActive ? "is-active-file" : ""} ${isPinned ? "is-pinned-file" : ""}" 
              onclick="window.setFileIndex(${originalIdx})"
              title="${escapeHtml(file.path)} (${file.loc} LOC) &mdash; ${escapeHtml(file.diffSummary || "")}"
            >
              <div class="card-top">
                <span class="file-name">${escapeHtml(file.path.split("/").pop())}</span>
                <span class="badge ${badgeCls}">${file.changeStatus}</span>
              </div>
              <div class="card-mid">
                <span class="module-name">${escapeHtml(file.module)}</span>
              </div>
              <div class="card-bottom">
                <span class="subsys-tag">${file.subsystem.toUpperCase()}</span>
                <span class="loc-tag">${file.loc} L</span>
                ${file.eventIds.length > 0 ? `<span class="event-count-pill">${file.eventIds.length} EV</span>` : ""}
              </div>
            </div>
          `;
    }).join("")}
      </div>
    </section>
  `;
  }
  function renderCodeViewerPane(file, isPinned = false) {
    const activeEv = getActiveEvent();
    const isTargetOfEvent = !isPinned && activeEv.sourceRef?.filePath === file.path;
    const activeFocusLine = isTargetOfEvent ? activeEv.sourceRef.span.focusLine : null;
    return `
    <div class="code-viewer-pane ${isPinned ? "is-pinned-pane" : ""}">
      <div class="pane-header">
        <div class="pane-title-group">
          <span class="pane-indicator ${isPinned ? "dot-pinned" : "dot-active"}"></span>
          <span class="pane-mode-label">${isPinned ? "PINNED BASELINE" : "LIVE CODE FOLLOWER"}</span>
          <span class="file-path-label">${escapeHtml(file.path)}</span>
          <span class="module-badge">${escapeHtml(file.module)}</span>
        </div>
        <div class="pane-meta-group">
          <span class="status-badge ${file.changeStatus === "MODIFIED" ? "badge-mod" : "badge-infra"}">
            ${file.changeStatus}
          </span>
          <span class="loc-badge">${file.loc} LOC</span>
        </div>
      </div>

      <div class="code-scroller">
        <table class="code-table">
          <tbody>
            ${file.lines.map((line) => {
      const isLineActive = activeFocusLine === line.num;
      const hasAnnotation = !!line.annotation;
      let lineCls = `diff-${line.diffStatus}`;
      if (isLineActive) lineCls += " is-active-line";
      return `
                <tr class="code-line ${lineCls}">
                  <td class="gutter-old">${line.oldNum !== void 0 ? line.oldNum : ""}</td>
                  <td class="gutter-new">${line.num !== void 0 ? line.num : ""}</td>
                  <td class="gutter-marker">${line.diffStatus === "add" ? "+" : line.diffStatus === "remove" ? "-" : isLineActive ? "\u25B6" : " "}</td>
                  <td class="code-content">
                    <pre><code>${highlightSyntax(line.text)}</code></pre>
                    ${hasAnnotation && line.annotation ? `
                      <div class="inline-evidence-chip chip-${line.annotation.kind}">
                        <span class="chip-badge">${escapeHtml(line.annotation.badge)}</span>
                        <strong class="chip-label">${escapeHtml(line.annotation.label)}:</strong>
                        <span class="chip-detail">${escapeHtml(line.annotation.detail)}</span>
                      </div>
                    ` : ""}
                  </td>
                </tr>
              `;
    }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
  }
  function renderCausalPianoRoll() {
    const activeEv = getActiveEvent();
    const width = 1100;
    const height = 240;
    const laneHeight = 28;
    const numEvents = traceEvents.length;
    return `
    <div class="causal-piano-roll-widget">
      <div class="piano-roll-header">
        <div class="piano-roll-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>SYSTEM SCORE &amp; CAUSAL PIANO ROLL &mdash; 3 BEAM NODES &middot; 7 PROCESS LIFELINES</span>
        </div>
        <div class="piano-roll-legend">
          <span class="legend-item"><span class="legend-swatch" style="background:#38bdf8;"></span> Ingress</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#818cf8;"></span> Coordinator</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#f87171;"></span> Worker #1 (Dead)</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#2dd4bf;"></span> Worker #2 (Reincarnated)</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#34d399;"></span> Journal</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#fbbf24;"></span> Effect Frontier</span>
        </div>
      </div>

      <div class="piano-roll-body">
        <!-- Process swimlane labels -->
        <div class="swimlane-labels">
          ${processIncarnations.map((p) => `
            <div class="lane-label" style="height:${laneHeight}px;">
              <span class="lane-node">${p.nodeInstanceId.split("-")[1].toUpperCase()}</span>
              <span class="lane-role">${p.logicalRoleId}</span>
              <span class="lane-pid">${p.pidRepr}</span>
            </div>
          `).join("")}
          <div class="lane-label" style="height:${laneHeight}px;">
            <span class="lane-node">EXT</span>
            <span class="lane-role">gateway_api</span>
            <span class="lane-pid">tcp:443</span>
          </div>
        </div>

        <!-- SVG Timeline Surface -->
        <div class="svg-surface-wrap">
          <svg viewBox="0 0 ${width} ${height}" class="piano-roll-svg" preserveAspectRatio="none">
            <!-- Gridlines -->
            ${processIncarnations.map((_, i) => `
              <line x1="0" y1="${i * laneHeight + laneHeight / 2}" x2="${width}" y2="${i * laneHeight + laneHeight / 2}" stroke="#1e293b" stroke-width="1" />
            `).join("")}
            <line x1="0" y1="${7 * laneHeight + laneHeight / 2}" x2="${width}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 4" />

            <!-- Process Lifelines -->
            <!-- Worker 1 lifeline: Starts at event 6, dies at event 12 -->
            <line 
              x1="${5 / (numEvents - 1) * (width - 40) + 20}" 
              y1="${3 * laneHeight + laneHeight / 2}" 
              x2="${12 / (numEvents - 1) * (width - 40) + 20}" 
              y2="${3 * laneHeight + laneHeight / 2}" 
              stroke="#f87171" 
              stroke-width="3" 
            />
            <!-- Worker 1 Crash marker -->
            <text x="${12 / (numEvents - 1) * (width - 40) + 20}" y="${3 * laneHeight + laneHeight / 2 + 5}" fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle">\u2715</text>

            <!-- Worker 2 lifeline: Starts at event 15 onwards -->
            <line 
              x1="${15 / (numEvents - 1) * (width - 40) + 20}" 
              y1="${4 * laneHeight + laneHeight / 2}" 
              x2="${width - 20}" 
              y2="${4 * laneHeight + laneHeight / 2}" 
              stroke="#2dd4bf" 
              stroke-width="3" 
            />

            <!-- Causal vectors between processes -->
            <!-- Msg 1: Ingress -> Coord -->
            <path d="M ${3 / (numEvents - 1) * (width - 40) + 20} ${0 * laneHeight + laneHeight / 2} Q ${3.5 / (numEvents - 1) * (width - 40) + 20} ${0.5 * laneHeight + laneHeight / 2} ${4 / (numEvents - 1) * (width - 40) + 20} ${1 * laneHeight + laneHeight / 2}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" />
            
            <!-- Msg 2: Coord -> Worker 1 -->
            <path d="M ${4 / (numEvents - 1) * (width - 40) + 20} ${1 * laneHeight + laneHeight / 2} L ${6 / (numEvents - 1) * (width - 40) + 20} ${3 * laneHeight + laneHeight / 2}" fill="none" stroke="#818cf8" stroke-width="1.5" />

            <!-- Crash to Sup DOWN -->
            <path d="M ${12 / (numEvents - 1) * (width - 40) + 20} ${3 * laneHeight + laneHeight / 2} L ${13 / (numEvents - 1) * (width - 40) + 20} ${2 * laneHeight + laneHeight / 2}" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="2 2" />

            <!-- Sup restart to Worker 2 spawn -->
            <path d="M ${14 / (numEvents - 1) * (width - 40) + 20} ${2 * laneHeight + laneHeight / 2} L ${15 / (numEvents - 1) * (width - 40) + 20} ${4 * laneHeight + laneHeight / 2}" fill="none" stroke="#c084fc" stroke-width="2" />

            <!-- Attempt #1 Gateway write (Worker 1 -> External) -->
            <line x1="${10 / (numEvents - 1) * (width - 40) + 20}" y1="${3 * laneHeight + laneHeight / 2}" x2="${10 / (numEvents - 1) * (width - 40) + 20}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 2" />

            <!-- Attempt #2 Gateway write (Worker 2 -> External) -->
            <line x1="${19 / (numEvents - 1) * (width - 40) + 20}" y1="${4 * laneHeight + laneHeight / 2}" x2="${19 / (numEvents - 1) * (width - 40) + 20}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#fbbf24" stroke-width="2.5" />

            <!-- Active Cursor Bar -->
            <line 
              x1="${appState.activeEventIndex / (numEvents - 1) * (width - 40) + 20}" 
              y1="0" 
              x2="${appState.activeEventIndex / (numEvents - 1) * (width - 40) + 20}" 
              y2="${height}" 
              stroke="#60a5fa" 
              stroke-width="2" 
              stroke-dasharray="4 2" 
            />

            <!-- Event Ticks on Swimlanes -->
            ${traceEvents.map((e, idx) => {
      let laneIdx = 0;
      if (e.logicalRoleId === "ingress") laneIdx = 0;
      else if (e.logicalRoleId === "coordinator") laneIdx = 1;
      else if (e.logicalRoleId === "worker_supervisor") laneIdx = 2;
      else if (e.logicalRoleId === "worker-cmd-42" && e.processInstanceId.includes("worker-pid1")) laneIdx = 3;
      else if (e.logicalRoleId === "worker-cmd-42" && e.processInstanceId.includes("worker-pid2")) laneIdx = 4;
      else if (e.logicalRoleId === "journal") laneIdx = 5;
      else if (e.logicalRoleId === "ledger") laneIdx = 6;
      const cx = idx / (numEvents - 1) * (width - 40) + 20;
      const cy = laneIdx * laneHeight + laneHeight / 2;
      const isSelected = idx === appState.activeEventIndex;
      let fill = "#38bdf8";
      if (e.eventType.includes("crash") || e.eventType.includes("exit")) fill = "#f87171";
      else if (e.eventType.includes("effect")) fill = "#fbbf24";
      else if (e.eventType.includes("journal")) fill = "#34d399";
      else if (e.eventType.includes("reincarnation") || e.eventType.includes("spawn")) fill = "#a78bfa";
      return `
                <g class="event-node-group" onclick="window.setEventIndex(${idx})">
                  ${isSelected ? `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#60a5fa" stroke-width="2" class="cursor-glow" />` : ""}
                  <circle cx="${cx}" cy="${cy}" r="${isSelected ? 5.5 : 4}" fill="${fill}" stroke="#0f172a" stroke-width="1.5" />
                </g>
              `;
    }).join("")}
          </svg>
        </div>
      </div>
    </div>
  `;
  }
  function renderDiagnosticInspector() {
    const ev = getActiveEvent();
    return `
    <div class="diagnostic-inspector-pane">
      <div class="inspector-tabs-header">
        <span class="inspector-title">TELEMETRY &amp; STATE TRIAD</span>
        <span class="active-event-badge">${ev.timeDisplay} &middot; EV #${ev.seq}</span>
      </div>

      <div class="inspector-content">
        <!-- 1. Active Event Headline Card -->
        <div class="event-summary-card">
          <div class="card-status-bar ${ev.eventType.includes("crash") ? "bar-red" : ev.eventType.includes("effect") ? "bar-amber" : "bar-blue"}"></div>
          <div class="event-type-badge">${escapeHtml(ev.eventType)}</div>
          <h3 class="event-headline">${escapeHtml(ev.headline)}</h3>
          <p class="event-notes">${escapeHtml(ev.notes || "")}</p>
          <div class="event-meta-tags">
            <span class="meta-tag">NODE: ${escapeHtml(ev.nodeInstanceId)}</span>
            <span class="meta-tag">PID: ${escapeHtml(ev.processInstanceId.split("/").pop())}</span>
            <span class="meta-tag">CORR: ${escapeHtml(ev.correlationId)}</span>
            ${ev.seqTraceToken ? `<span class="meta-tag tag-token">TOKEN: ${escapeHtml(ev.seqTraceToken)}</span>` : ""}
          </div>
        </div>

        <!-- 2. GenServer State Filmstrip & Diff -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>GENSERVER STATE OBSERVATION</span>
            <span class="status-chip ${ev.stateObservation ? "chip-observed" : "chip-none"}">
              ${ev.stateObservation ? ev.stateObservation.completeness.toUpperCase() : "NO SNAPSHOT"}
            </span>
          </div>
          ${ev.stateObservation ? `
            <div class="state-fields-table">
              ${Object.entries(ev.stateObservation.fields).map(([k, v]) => {
      const diff = ev.stateObservation?.diffs?.[k];
      return `
                  <div class="state-row ${diff ? "is-mutated" : ""}">
                    <span class="state-key">${escapeHtml(k)}:</span>
                    <span class="state-val">
                      ${diff ? `<span class="val-old">${escapeHtml(diff.from)}</span> &rarr; <span class="val-new">${escapeHtml(diff.to)}</span>` : escapeHtml(JSON.stringify(v))}
                    </span>
                  </div>
                `;
    }).join("")}
            </div>
            ${ev.stateObservation.unrecordedGap ? `
              <div class="epistemic-gap-alert">
                <strong>EPISTEMIC GAP:</strong> ${escapeHtml(ev.stateObservation.unrecordedGap)}
              </div>
            ` : ""}
          ` : `
            <div class="no-data-msg">No state snapshot captured at this local sequence tick.</div>
          `}
        </div>

        <!-- 3. Effect Frontier & External Mutation Hazard -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>EFFECT FRONTIER &amp; MUTATION LEDGER</span>
            <span class="status-chip ${ev.effectRecord ? "chip-frontier" : "chip-none"}">
              ${ev.effectRecord ? ev.effectRecord.status.toUpperCase() : "NO EXTERNAL IO"}
            </span>
          </div>
          ${ev.effectRecord ? `
            <div class="effect-details">
              <div class="effect-row">
                <span class="eff-label">OPERATION:</span>
                <span class="eff-val font-mono">${escapeHtml(ev.effectRecord.operation)}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">TARGET:</span>
                <span class="eff-val">${escapeHtml(ev.effectRecord.target)}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">ATTEMPT:</span>
                <span class="eff-val font-bold">#${ev.effectRecord.attemptNumber}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">DIGEST:</span>
                <span class="eff-val font-mono text-xs">${escapeHtml(ev.effectRecord.payloadDigest)}</span>
              </div>
              ${ev.effectRecord.hazardNote ? `
                <div class="hazard-callout">
                  <strong>CONCURRENCY HAZARD:</strong> ${escapeHtml(ev.effectRecord.hazardNote)}
                </div>
              ` : ""}
            </div>
          ` : `
            <div class="no-data-msg">No outbound external side effect attempted at this step.</div>
          `}
        </div>

        <!-- 4. Mailbox Anatomy -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>PROCESS MAILBOX WATERLINE</span>
            <span class="status-chip">${ev.mailboxState ? `${ev.mailboxState.queueDepth} MSG` : "EMPTY"}</span>
          </div>
          ${ev.mailboxState && ev.mailboxState.messages.length > 0 ? `
            <div class="mailbox-items">
              ${ev.mailboxState.messages.map((m) => `
                <div class="mailbox-msg-item">
                  <div class="msg-type font-mono">${escapeHtml(m.msgType)}</div>
                  <div class="msg-preview text-xs">${escapeHtml(m.payloadPreview)}</div>
                  <div class="msg-sender text-xs">from: ${escapeHtml(m.senderPid)} &middot; ${escapeHtml(m.status)}</div>
                </div>
              `).join("")}
            </div>
          ` : `
            <div class="no-data-msg">Mailbox queue depth is 0; process is not backpressured.</div>
          `}
        </div>
      </div>
    </div>
  `;
  }
  function renderCompareLens() {
    return `
    <div class="compare-lens-container">
      <div class="compare-header">
        <h2>DUAL-RUN DIVERGENCE &amp; COUNTEREXAMPLE ALIGNMENT</h2>
        <p>Comparing <strong>Run A [Passing Baseline]</strong> versus <strong>Run B [Failing PR #248 Witness]</strong> aligned by semantic milestones.</p>
      </div>

      <div class="milestones-table-wrap">
        <table class="milestones-table">
          <thead>
            <tr>
              <th>MILESTONE PHASE</th>
              <th>SEMANTIC SYMBOL</th>
              <th>RUN A (PASS)</th>
              <th>RUN B (FAIL)</th>
              <th>MATCH BASIS</th>
              <th>DIVERGENCE VERDICT</th>
            </tr>
          </thead>
          <tbody>
            ${comparisonMilestones.map((m) => {
      const isDiverged = m.divergenceType !== "identical";
      return `
                <tr class="milestone-row ${isDiverged ? "is-diverged-row" : ""}">
                  <td class="font-bold">${escapeHtml(m.phaseName)}</td>
                  <td class="font-mono text-xs">${escapeHtml(m.symbol)}</td>
                  <td><span class="badge ${m.runAStatus === "observed" ? "badge-green" : "badge-gray"}">${m.runAStatus.toUpperCase()}</span></td>
                  <td><span class="badge ${m.runBStatus === "observed" ? "badge-green" : m.runBStatus === "crash" ? "badge-red" : "badge-amber"}">${m.runBStatus.toUpperCase()}</span></td>
                  <td class="text-xs font-mono">${escapeHtml(m.matchBasis)}</td>
                  <td>
                    ${isDiverged ? `
                      <span class="divergence-alert">
                        <strong>${m.divergenceType?.toUpperCase()}:</strong> ${escapeHtml(m.notes)}
                      </span>
                    ` : `
                      <span class="text-muted text-xs">Identical behavior verified.</span>
                    `}
                  </td>
                </tr>
              `;
    }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
  }
  function renderSupervisionLens() {
    return `
    <div class="supervision-lens-container">
      <div class="supervision-header">
        <h2>OTP SUPERVISION TREE &amp; RESTART BLAST RADIUS</h2>
        <p>Dynamic process incarnation tracking and supervisor escalation limits.</p>
      </div>

      <div class="supervision-cards-grid">
        ${initialSupervisionNodes.map((node) => `
          <div class="supervision-card">
            <div class="sup-card-top">
              <span class="sup-type-tag">${node.type.toUpperCase()}</span>
              <span class="sup-strategy">${node.strategy || ":worker"}</span>
            </div>
            <h3 class="sup-name">${escapeHtml(node.name)}</h3>
            <div class="sup-metrics">
              <div class="metric-row">
                <span>RESTART BUDGET:</span>
                <strong>${node.maxRestarts ? `${node.restartsObserved} of ${node.maxRestarts} (${node.maxSeconds}s window)` : "N/A"}</strong>
              </div>
              <div class="metric-row">
                <span>ACTIVE CHILDREN:</span>
                <strong>${node.activeChildren}</strong>
              </div>
            </div>

            <div class="incarnation-trail">
              <span class="trail-label">INCARNATION HISTORY:</span>
              ${node.incarnationHistory.map((inc) => `
                <div class="inc-pill font-mono">${escapeHtml(inc)}</div>
              `).join("")}
            </div>

            ${node.blastRadius.length > 0 ? `
              <div class="blast-radius-box">
                <span class="blast-label">BLAST RADIUS ON CRASH:</span>
                <div class="blast-items">
                  ${node.blastRadius.map((b) => `<span class="blast-chip">${escapeHtml(b)}</span>`).join("")}
                </div>
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
  }
  function renderFindingsLens() {
    return `
    <div class="findings-lens-container">
      <div class="findings-header">
        <div class="findings-title-group">
          <h2>EVIDENCE-BACKED REVIEW FINDINGS</h2>
          <p>Uncertainty-qualified conclusions with exact source anchors, observed facts, and unresolved gaps.</p>
        </div>
        <button class="export-btn" onclick="window.exportInvestigation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          EXPORT INVESTIGATION BUNDLE (JSON)
        </button>
      </div>

      <div class="findings-grid">
        ${findingsList.map((f) => `
          <div class="finding-card finding-${f.severity}">
            <div class="finding-card-top">
              <span class="finding-id">${f.id}</span>
              <span class="finding-severity severity-${f.severity}">${f.severity.toUpperCase()}</span>
              <span class="finding-status status-${f.status}">${f.status.replace("_", " ").toUpperCase()}</span>
            </div>
            <h3 class="finding-title">${escapeHtml(f.title)}</h3>
            <p class="finding-claim">${escapeHtml(f.claim)}</p>

            <div class="finding-section">
              <span class="section-heading">SOURCE &amp; EVENT ANCHORS:</span>
              <div class="anchor-pills">
                ${f.anchors.map((a) => `
                  <div class="anchor-pill">
                    <span class="anchor-file">${escapeHtml(a.filePath.split("/").pop())}</span>
                    <span class="anchor-sym font-mono">${escapeHtml(a.symbol)}</span>
                    <span class="anchor-range">${escapeHtml(a.lineRange)}</span>
                    ${a.eventId ? `<span class="anchor-ev">${escapeHtml(a.eventId)}</span>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="finding-section">
              <span class="section-heading">EVIDENCE BASES:</span>
              <ul class="evidence-list">
                ${f.evidencePoints.map((ep) => `
                  <li class="evidence-item kind-${ep.kind}">
                    <span class="kind-tag">${ep.kind.toUpperCase()}</span>
                    <span>${escapeHtml(ep.summary)}</span>
                  </li>
                `).join("")}
              </ul>
            </div>

            <div class="finding-section gap-section">
              <span class="section-heading text-amber">UNRESOLVED GAPS &amp; CAVEATS:</span>
              <ul class="gaps-list">
                ${f.unresolvedGaps.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}
              </ul>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  }
  function renderModals() {
    if (commandPaletteOpen) {
      return `
      <div class="modal-backdrop" onclick="window.closePalette()">
        <div class="command-palette-modal" onclick="event.stopPropagation()">
          <div class="palette-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Type command or jump to file/milestone... (ESC to close)" 
              class="palette-input" 
              autofocus 
              id="cmd-input"
            />
          </div>
          <div class="palette-results">
            <div class="palette-group">NAVIGATION JUMPS</div>
            <div class="palette-item" onclick="window.jumpToMilestone('crash'); window.closePalette();">
              <span>Seek to Crash Site (Process.exit :kill)</span>
              <kbd>X</kbd>
            </div>
            <div class="palette-item" onclick="window.jumpToMilestone('duplicate'); window.closePalette();">
              <span>Seek to Duplicate Gateway Mutation Hazard</span>
              <kbd>D</kbd>
            </div>
            <div class="palette-item" onclick="window.jumpToMilestone('dispatch'); window.closePalette();">
              <span>Seek to Attempt #1 External Write</span>
              <kbd>E</kbd>
            </div>
            <div class="palette-group">LENS SWITCHING</div>
            <div class="palette-item" onclick="window.setLens('cockpit'); window.closePalette();">
              <span>Lens 1: Causal Code Cockpit</span>
              <kbd>1</kbd>
            </div>
            <div class="palette-item" onclick="window.setLens('compare'); window.closePalette();">
              <span>Lens 4: Dual-Run Divergence Matrix</span>
              <kbd>4</kbd>
            </div>
            <div class="palette-item" onclick="window.setLens('supervision'); window.closePalette();">
              <span>Lens 5: OTP Supervision Blast Radius</span>
              <kbd>5</kbd>
            </div>
            <div class="palette-item" onclick="window.togglePinSplit(); window.closePalette();">
              <span>Toggle Pinned Baseline Split Mode</span>
              <kbd>P</kbd>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    if (shortcutsModalOpen) {
      return `
      <div class="modal-backdrop" onclick="window.closeShortcuts()">
        <div class="shortcuts-modal" onclick="event.stopPropagation()">
          <div class="shortcuts-header">
            <h3>KEYBOARD NAVIGATION CHEAT SHEET</h3>
            <button class="close-btn" onclick="window.closeShortcuts()">&times;</button>
          </div>
          <div class="shortcuts-grid">
            <div class="shortcut-item"><kbd>Space</kbd> <span>Play / Pause Scrubber Playback</span></div>
            <div class="shortcut-item"><kbd>&larr;</kbd> / <kbd>&rarr;</kbd> or <kbd>J</kbd> / <kbd>K</kbd> <span>Step Trace Event Backward / Forward</span></div>
            <div class="shortcut-item"><kbd>[</kbd> / <kbd>]</kbd> <span>Previous / Next File across 24 Codebase Units</span></div>
            <div class="shortcut-item"><kbd>P</kbd> <span>Toggle Pinned Baseline Split Screen</span></div>
            <div class="shortcut-item"><kbd>F</kbd> <span>Cycle Follow Mode (Role &rarr; Process &rarr; Causal &rarr; Free)</span></div>
            <div class="shortcut-item"><kbd>X</kbd> <span>Fast Jump to Worker Kill Crash Site</span></div>
            <div class="shortcut-item"><kbd>D</kbd> <span>Fast Jump to Duplicate External Write Hazard</span></div>
            <div class="shortcut-item"><kbd>E</kbd> <span>Fast Jump to Effect Frontier Attempt #1</span></div>
            <div class="shortcut-item"><kbd>1</kbd> - <kbd>6</kbd> <span>Switch Main View Lenses</span></div>
            <div class="shortcut-item"><kbd>\u2318K</kbd> <span>Open Command &amp; Symbol Palette</span></div>
            <div class="shortcut-item"><kbd>/</kbd> <span>Focus Codebase Atlas Search Filter</span></div>
            <div class="shortcut-item"><kbd>Esc</kbd> <span>Close Modals / Overlays</span></div>
          </div>
        </div>
      </div>
    `;
    }
    return "";
  }
  function renderApp(preserveDeck = false) {
    const root = document.getElementById("app");
    if (!root) return;
    const activeFile = getActiveFile();
    const pinnedFile = getPinnedFile();
    let mainContent = "";
    if (appState.lens === "cockpit" || appState.lens === "review" || appState.lens === "cinema") {
      mainContent = `
      <!-- Codebase Atlas File Strip (24 files) -->
      ${renderCodebaseAtlas()}

      <!-- Causal Piano Roll / System Score -->
      ${renderCausalPianoRoll()}

      <!-- Central Code Review & Telemetry Split Screen -->
      <div class="cockpit-split-workbench ${appState.isPinnedSplit ? "is-split-active" : ""}">
        ${appState.isPinnedSplit ? `
          <!-- Left: Pinned Baseline Code -->
          <div class="workbench-column col-pinned">
            ${renderCodeViewerPane(pinnedFile, true)}
          </div>
        ` : ""}

        <!-- Live Code Viewer -->
        <div class="workbench-column col-live">
          ${renderCodeViewerPane(activeFile, false)}
        </div>

        <!-- Right: Diagnostic & State Triad -->
        <div class="workbench-column col-inspector">
          ${renderDiagnosticInspector()}
        </div>
      </div>
    `;
    } else if (appState.lens === "compare") {
      mainContent = renderCompareLens();
    } else if (appState.lens === "supervision") {
      mainContent = renderSupervisionLens();
    } else if (appState.lens === "evidence") {
      mainContent = renderFindingsLens();
    }
    const focused = document.activeElement;
    const restoreSearch = focused?.classList.contains("atlas-search-input");
    const selection = restoreSearch ? focused.selectionStart : null;
    const scrubber = root.querySelector(".master-scrub-input");
    const atlasScroll = root.querySelector(".atlas-grid")?.scrollLeft || 0;
    const markup = `
    <div class="cockpit-root">
      ${renderHeader()}
      ${renderScrubberDeck()}
      <main class="cockpit-main-viewport">
        ${mainContent}
      </main>
      ${renderModals()}
    </div>
  `;
    if (preserveDeck && root.querySelector(".master-scrubber-deck")) {
      const next = document.createElement("div");
      next.innerHTML = markup;
      root.querySelector(".cockpit-main-viewport").innerHTML = next.querySelector(".cockpit-main-viewport").innerHTML;
      for (const selector of [".transport-controls", ".milestone-jump-bar", ".scrub-hud-info"]) {
        root.querySelector(selector).innerHTML = next.querySelector(selector).innerHTML;
      }
      root.querySelector(".scrub-progress-fill").style.width = `${appState.activeEventIndex / (traceEvents.length - 1) * 100}%`;
      root.querySelectorAll(".event-pip").forEach((pip, i) => pip.classList.toggle("is-active", i === appState.activeEventIndex));
      if (scrubber) scrubber.value = String(appState.activeEventIndex);
    } else {
      root.innerHTML = markup;
    }
    const newScrubber = root.querySelector(".master-scrub-input");
    if (scrubber && newScrubber && !preserveDeck) {
      scrubber.value = String(appState.activeEventIndex);
      newScrubber.replaceWith(scrubber);
    }
    const atlas = root.querySelector(".atlas-grid");
    if (atlas) atlas.scrollLeft = atlasScroll;
    if (restoreSearch) {
      const input = root.querySelector(".atlas-search-input");
      input?.focus();
      if (selection !== null) input?.setSelectionRange(selection, selection);
    }
    if (commandPaletteOpen) root.querySelector("#cmd-input")?.focus();
    const line = root.querySelector(".col-live .is-active-line");
    const scroller = root.querySelector(".col-live .code-scroller");
    if (line && scroller) scroller.scrollTop = line.offsetTop - scroller.offsetTop - scroller.clientHeight / 2;
  }
  window.setEventIndex = setEventIndex;
  window.setFileIndex = setFileIndex;
  window.togglePlayback = togglePlayback;
  window.togglePinSplit = togglePinSplit;
  window.setFollowMode = setFollowMode;
  window.setLens = setLens;
  window.jumpToMilestone = jumpToMilestone;
  window.setFileFilter = (val) => {
    fileSearchQuery = val;
    renderApp();
  };
  window.openPalette = () => {
    commandPaletteOpen = true;
    renderApp();
    setTimeout(() => document.getElementById("cmd-input")?.focus(), 50);
  };
  window.closePalette = () => {
    commandPaletteOpen = false;
    renderApp();
  };
  window.openShortcuts = () => {
    shortcutsModalOpen = true;
    renderApp();
  };
  window.closeShortcuts = () => {
    shortcutsModalOpen = false;
    renderApp();
  };
  window.exportInvestigation = () => {
    const exportPayload = {
      format: "elixirscope-investigation-bundle-v2",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      focus: appState,
      activeEvent: getActiveEvent(),
      findings: findingsList,
      milestones: comparisonMilestones
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elixirscope-investigation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  document.addEventListener("DOMContentLoaded", () => {
    setupKeyboard();
    renderApp();
  });
})();
