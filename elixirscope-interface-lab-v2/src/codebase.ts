import { FileItem } from './types';

export const codebaseFiles: FileItem[] = [
  // 1. Application entry
  {
    path: 'lib/core/application.ex',
    module: 'Core.Application',
    subsystem: 'core',
    loc: 38,
    changeStatus: 'INFRA',
    diffSummary: 'Starts top-level supervision tree and node telemetry hooks',
    eventIds: [],
    directCallers: [],
    directCallees: ['lib/core/root_supervisor.ex'],
    symbols: [
      {
        id: 'core_app_start',
        symbolKey: 'Core.Application.start/2',
        name: 'start/2',
        module: 'Core.Application',
        kind: 'callback',
        filePath: 'lib/core/application.ex',
        span: { startLine: 12, endLine: 36, focusLine: 18 },
        callersCount: 1,
        calleesCount: 4,
        impactsEffect: false,
        isModified: false,
        docSummary: 'OTP application entrypoint; registers node boot and boots RootSupervisor.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Core.Application do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Application entry for the distributed saga & recovery engine."', diffStatus: 'context' },
      { num: 3, text: '  use Application', diffStatus: 'context' },
      { num: 4, text: '  require Logger', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  @impl true', diffStatus: 'context' },
      { num: 7, text: '  def start(_type, _args) do', diffStatus: 'context' },
      { num: 8, text: '    :ok = Telemetry.SpanTracer.attach_default_handlers()', diffStatus: 'context' },
      { num: 9, text: '    Logger.info("Booting Core.Application node=#{node()} pid=#{inspect(self())}")', diffStatus: 'context' },
      { num: 10, text: '', diffStatus: 'context' },
      { num: 11, text: '    children = [', diffStatus: 'context' },
      { num: 12, text: '      {Cluster.NodeMonitor, name: Cluster.NodeMonitor},', diffStatus: 'context' },
      { num: 13, text: '      {Cluster.RingManager, name: Cluster.RingManager},', diffStatus: 'context' },
      { num: 14, text: '      {Core.RootSupervisor, []}', diffStatus: 'context' },
      { num: 15, text: '    ]', diffStatus: 'context' },
      { num: 16, text: '', diffStatus: 'context' },
      { num: 17, text: '    opts = [strategy: :one_for_one, name: Core.Supervisor]', diffStatus: 'context' },
      { num: 18, text: '    Supervisor.start_link(children, opts)', diffStatus: 'focus' },
      { num: 19, text: '  end', diffStatus: 'context' },
      { num: 20, text: 'end', diffStatus: 'context' }
    ]
  },

  // 2. Root Supervisor
  {
    path: 'lib/core/root_supervisor.ex',
    module: 'Core.RootSupervisor',
    subsystem: 'core',
    loc: 44,
    changeStatus: 'INFRA',
    diffSummary: 'Hierarchical :rest_for_one supervisor guarding storage before pipeline',
    eventIds: [],
    directCallers: ['lib/core/application.ex'],
    directCallees: ['lib/storage/repo.ex', 'lib/pipeline/worker_supervisor.ex'],
    symbols: [
      {
        id: 'root_sup_init',
        symbolKey: 'Core.RootSupervisor.init/1',
        name: 'init/1',
        module: 'Core.RootSupervisor',
        kind: 'callback',
        filePath: 'lib/core/root_supervisor.ex',
        span: { startLine: 16, endLine: 40, focusLine: 24 },
        callersCount: 1,
        calleesCount: 4,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Initializes root subsystem children with :rest_for_one fault isolation.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Core.RootSupervisor do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Root supervisor maintaining storage subsystems and worker dynamic tree."', diffStatus: 'context' },
      { num: 3, text: '  use Supervisor', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def start_link(init_arg) do', diffStatus: 'context' },
      { num: 6, text: '    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)', diffStatus: 'context' },
      { num: 7, text: '  end', diffStatus: 'context' },
      { num: 8, text: '', diffStatus: 'context' },
      { num: 9, text: '  @impl true', diffStatus: 'context' },
      { num: 10, text: '  def init(_init_arg) do', diffStatus: 'context' },
      { num: 11, text: '    children = [', diffStatus: 'context' },
      { num: 12, text: '      Storage.Repo,', diffStatus: 'context' },
      { num: 13, text: '      Storage.Journal,', diffStatus: 'context' },
      { num: 14, text: '      Gateway.CircuitBreaker,', diffStatus: 'context' },
      { num: 15, text: '      Pipeline.WorkerSupervisor,', diffStatus: 'context' },
      { num: 16, text: '      Pipeline.Coordinator', diffStatus: 'context' },
      { num: 17, text: '    ]', diffStatus: 'context' },
      { num: 18, text: '', diffStatus: 'context' },
      { num: 19, text: '    # :rest_for_one ensures pipeline crashes do not tear down the Journal', diffStatus: 'context' },
      { num: 20, text: '    Supervisor.init(children, strategy: :rest_for_one, max_restarts: 10, max_seconds: 60)', diffStatus: 'focus' },
      { num: 21, text: '  end', diffStatus: 'context' },
      { num: 22, text: 'end', diffStatus: 'context' }
    ]
  },

  // 3. Ingress Controller
  {
    path: 'lib/ingest/ingress_controller.ex',
    module: 'Ingest.IngressController',
    subsystem: 'ingest',
    loc: 52,
    changeStatus: 'CALLER',
    diffSummary: 'Intake point assigning correlation IDs and routing to partition workers',
    eventIds: ['ev-01', 'ev-04'],
    directCallers: [],
    directCallees: ['lib/ingest/command_validator.ex', 'lib/ingest/rate_limiter.ex', 'lib/pipeline/coordinator.ex'],
    symbols: [
      {
        id: 'ingress_submit',
        symbolKey: 'Ingest.IngressController.submit/1',
        name: 'submit/1',
        module: 'Ingest.IngressController',
        kind: 'def',
        filePath: 'lib/ingest/ingress_controller.ex',
        span: { startLine: 18, endLine: 48, focusLine: 28 },
        callersCount: 2,
        calleesCount: 3,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Validates raw incoming payload, assigns command UUID, and dispatches via cluster coordinator.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Ingest.IngressController do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "External command intake gateway on Node A."', diffStatus: 'context' },
      { num: 3, text: '  require Logger', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  @spec submit(map()) :: {:ok, String.t()} | {:error, term()}', diffStatus: 'context' },
      { num: 6, text: '  def submit(params) do', diffStatus: 'context' },
      { num: 7, text: '    with :ok <- Ingest.RateLimiter.check_rate(params["account_id"]),', diffStatus: 'context' },
      { num: 8, text: '         {:ok, command} <- Ingest.CommandValidator.validate(params) do', diffStatus: 'context' },
      { num: 9, text: '      # Ingress assigns stable correlation token for distributed causality', diffStatus: 'context' },
      { num: 10, text: '      token = Telemetry.SpanTracer.inject_token(command.id)', diffStatus: 'context', annotation: { line: 10, kind: 'seq_trace', label: 'SEQ_TRACE_TOKEN', detail: 'Token cmd-42 attached to BEAM process dictionary', badge: 'TOKEN' } },
      { num: 11, text: '      Logger.info("Ingress accepted command", command_id: command.id, token: token)', diffStatus: 'focus' },
      { num: 12, text: '      Pipeline.Coordinator.dispatch_async(command)', diffStatus: 'context' },
      { num: 13, text: '      {:ok, command.id}', diffStatus: 'context' },
      { num: 14, text: '    else', diffStatus: 'context' },
      { num: 15, text: '      {:error, reason} -> {:error, reason}', diffStatus: 'context' },
      { num: 16, text: '    end', diffStatus: 'context' },
      { num: 17, text: '  end', diffStatus: 'context' },
      { num: 18, text: 'end', diffStatus: 'context' }
    ]
  },

  // 4. Command Validator
  {
    path: 'lib/ingest/command_validator.ex',
    module: 'Ingest.CommandValidator',
    subsystem: 'ingest',
    loc: 48,
    changeStatus: 'INFRA',
    diffSummary: 'Pure functional schema checking for incoming idempotency keys and amounts',
    eventIds: ['ev-03'],
    directCallers: ['lib/ingest/ingress_controller.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'val_validate',
        symbolKey: 'Ingest.CommandValidator.validate/1',
        name: 'validate/1',
        module: 'Ingest.CommandValidator',
        kind: 'def',
        filePath: 'lib/ingest/command_validator.ex',
        span: { startLine: 14, endLine: 42, focusLine: 22 },
        callersCount: 2,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Validates required command attributes and enforces positive monetary amounts.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Ingest.CommandValidator do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Pure boundary validation for command parameters."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  defstruct [:id, :account_id, :target_url, :amount, :idempotency_key]', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  def validate(%{"id" => id, "amount" => amount} = params) when is_binary(id) and amount > 0 do', diffStatus: 'context' },
      { num: 7, text: '    {:ok, %__MODULE__{', diffStatus: 'focus' },
      { num: 8, text: '      id: id,', diffStatus: 'context' },
      { num: 9, text: '      account_id: params["account_id"],', diffStatus: 'context' },
      { num: 10, text: '      target_url: Map.get(params, "target_url", "/v1/settle"),', diffStatus: 'context' },
      { num: 11, text: '      amount: amount,', diffStatus: 'context' },
      { num: 12, text: '      idempotency_key: params["idempotency_key"]', diffStatus: 'context' },
      { num: 13, text: '    }}', diffStatus: 'context' },
      { num: 14, text: '  end', diffStatus: 'context' },
      { num: 15, text: '', diffStatus: 'context' },
      { num: 16, text: '  def validate(_invalid), do: {:error, :invalid_command_payload}', diffStatus: 'context' },
      { num: 17, text: 'end', diffStatus: 'context' }
    ]
  },

  // 5. Rate Limiter
  {
    path: 'lib/ingest/rate_limiter.ex',
    module: 'Ingest.RateLimiter',
    subsystem: 'ingest',
    loc: 36,
    changeStatus: 'INFRA',
    diffSummary: 'Concurrency-safe token bucket using ETS table counters',
    eventIds: ['ev-02'],
    directCallers: ['lib/ingest/ingress_controller.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'rate_check',
        symbolKey: 'Ingest.RateLimiter.check_rate/1',
        name: 'check_rate/1',
        module: 'Ingest.RateLimiter',
        kind: 'def',
        filePath: 'lib/ingest/rate_limiter.ex',
        span: { startLine: 10, endLine: 30, focusLine: 16 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Atomically increments account bucket counter; rejects requests exceeding burst limit.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Ingest.RateLimiter do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Token bucket limiter backed by concurrency-tuned ETS table."', diffStatus: 'context' },
      { num: 3, text: '  @table :ingress_rate_buckets', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def check_rate(account_id) do', diffStatus: 'context' },
      { num: 6, text: '    case :ets.update_counter(@table, account_id, {2, 1}, {account_id, 0}) do', diffStatus: 'focus' },
      { num: 7, text: '      count when count <= 100 -> :ok', diffStatus: 'context' },
      { num: 8, text: '      _exceeded -> {:error, :rate_limit_exceeded}', diffStatus: 'context' },
      { num: 9, text: '    end', diffStatus: 'context' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: 'end', diffStatus: 'context' }
    ]
  },

  // 6. Coordinator
  {
    path: 'lib/pipeline/coordinator.ex',
    module: 'Pipeline.Coordinator',
    subsystem: 'pipeline',
    loc: 75,
    changeStatus: 'CALLER',
    diffSummary: 'Saga orchestrator GenServer: tracks worker PIDs and routes commands',
    eventIds: ['ev-05', 'ev-06'],
    directCallers: ['lib/ingest/ingress_controller.ex'],
    directCallees: ['lib/pipeline/worker_supervisor.ex', 'lib/pipeline/command_worker.ex'],
    symbols: [
      {
        id: 'coord_dispatch',
        symbolKey: 'Pipeline.Coordinator.dispatch_async/1',
        name: 'dispatch_async/1',
        module: 'Pipeline.Coordinator',
        kind: 'def',
        filePath: 'lib/pipeline/coordinator.ex',
        span: { startLine: 20, endLine: 35, focusLine: 26 },
        callersCount: 1,
        calleesCount: 2,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Asynchronously routes incoming command to dedicated worker under DynamicSupervisor.'
      },
      {
        id: 'coord_handle_cast',
        symbolKey: 'Pipeline.Coordinator.handle_cast/2',
        name: 'handle_cast/2',
        module: 'Pipeline.Coordinator',
        kind: 'callback',
        filePath: 'lib/pipeline/coordinator.ex',
        span: { startLine: 38, endLine: 58, focusLine: 45 },
        callersCount: 0,
        calleesCount: 2,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Spawns worker child or delivers command message to existing worker.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.Coordinator do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "GenServer orchestrating saga dispatch and cross-node command forwarding."', diffStatus: 'context' },
      { num: 3, text: '  use GenServer', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def start_link(_opts), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)', diffStatus: 'context' },
      { num: 6, text: '', diffStatus: 'context' },
      { num: 7, text: '  def dispatch_async(command) do', diffStatus: 'context' },
      { num: 8, text: '    GenServer.cast(__MODULE__, {:dispatch, command})', diffStatus: 'context' },
      { num: 9, text: '  end', diffStatus: 'context' },
      { num: 10, text: '', diffStatus: 'context' },
      { num: 11, text: '  @impl true', diffStatus: 'context' },
      { num: 12, text: '  def init(_args), do: {:ok, %{active_workers: %{}}}', diffStatus: 'context' },
      { num: 13, text: '', diffStatus: 'context' },
      { num: 14, text: '  @impl true', diffStatus: 'context' },
      { num: 15, text: '  def handle_cast({:dispatch, command}, state) do', diffStatus: 'context' },
      { num: 16, text: '    # Dynamically start worker child under worker supervisor', diffStatus: 'context' },
      { num: 17, text: '    {:ok, pid} = Pipeline.WorkerSupervisor.start_worker(command)', diffStatus: 'focus' },
      { num: 18, text: '    send(pid, {:execute, command})', diffStatus: 'context', annotation: { line: 18, kind: 'seq_trace', label: 'CROSS_PROCESS_SEND', detail: 'Message {:execute, command} dispatched to worker pid', badge: 'MSG_SEND' } },
      { num: 19, text: '    {:noreply, put_in(state.active_workers[command.id], pid)}', diffStatus: 'context' },
      { num: 20, text: '  end', diffStatus: 'context' },
      { num: 21, text: 'end', diffStatus: 'context' }
    ]
  },

  // 7. Worker Supervisor
  {
    path: 'lib/pipeline/worker_supervisor.ex',
    module: 'Pipeline.WorkerSupervisor',
    subsystem: 'pipeline',
    loc: 54,
    changeStatus: 'MODIFIED',
    diffSummary: 'Supervisor guarding transient workers with :one_for_one restart strategy',
    eventIds: ['ev-07', 'ev-15', 'ev-16'],
    directCallers: ['lib/pipeline/coordinator.ex'],
    directCallees: ['lib/pipeline/command_worker.ex'],
    symbols: [
      {
        id: 'worker_sup_start_worker',
        symbolKey: 'Pipeline.WorkerSupervisor.start_worker/1',
        name: 'start_worker/1',
        module: 'Pipeline.WorkerSupervisor',
        kind: 'def',
        filePath: 'lib/pipeline/worker_supervisor.ex',
        span: { startLine: 18, endLine: 30, focusLine: 22 },
        callersCount: 2,
        calleesCount: 1,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Starts a child worker specification under DynamicSupervisor control.'
      },
      {
        id: 'worker_sup_init',
        symbolKey: 'Pipeline.WorkerSupervisor.init/1',
        name: 'init/1',
        module: 'Pipeline.WorkerSupervisor',
        kind: 'callback',
        filePath: 'lib/pipeline/worker_supervisor.ex',
        span: { startLine: 32, endLine: 50, focusLine: 38 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: true,
        docSummary: 'Initializes supervisor with updated max_restarts: 5 and max_seconds: 10.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.WorkerSupervisor do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Dynamic supervisor managing transient CommandWorker processes on Node B."', diffStatus: 'context' },
      { num: 3, text: '  use DynamicSupervisor', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def start_link(init_arg) do', diffStatus: 'context' },
      { num: 6, text: '    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)', diffStatus: 'context' },
      { num: 7, text: '  end', diffStatus: 'context' },
      { num: 8, text: '', diffStatus: 'context' },
      { num: 9, text: '  def start_worker(command) do', diffStatus: 'context' },
      { num: 10, text: '    spec = {Pipeline.CommandWorker, command}', diffStatus: 'context' },
      { num: 11, text: '    DynamicSupervisor.start_child(__MODULE__, spec)', diffStatus: 'focus' },
      { num: 12, text: '  end', diffStatus: 'context' },
      { num: 13, text: '', diffStatus: 'context' },
      { num: 14, text: '  @impl true', diffStatus: 'context' },
      { num: 15, text: '  def init(_init_arg) do', diffStatus: 'context' },
      { num: 16, text: '    # PR #248 modified: increased restart intensity parameters', diffStatus: 'context' },
      { oldNum: 17, text: '    DynamicSupervisor.init(strategy: :one_for_one)', diffStatus: 'remove' },
      { num: 17, text: '    DynamicSupervisor.init(', diffStatus: 'add' },
      { num: 18, text: '      strategy: :one_for_one,', diffStatus: 'add', annotation: { line: 18, kind: 'restart', label: 'SUPERVISOR_STRATEGY', detail: ':one_for_one isolation restarts dead worker without affecting peers', badge: 'OTP_SPEC' } },
      { num: 19, text: '      max_restarts: 5,', diffStatus: 'add' },
      { num: 20, text: '      max_seconds: 10', diffStatus: 'add' },
      { num: 21, text: '    )', diffStatus: 'add' },
      { num: 22, text: '  end', diffStatus: 'context' },
      { num: 23, text: 'end', diffStatus: 'context' }
    ]
  },

  // 8. Command Worker (THE MAIN MODIFIED REVIEW TARGET & CRASH SITE!)
  {
    path: 'lib/pipeline/command_worker.ex',
    module: 'Pipeline.CommandWorker',
    subsystem: 'pipeline',
    loc: 96,
    changeStatus: 'MODIFIED',
    diffSummary: 'PR #248 modified recover/2: triggers Gateway.dispatch/1 on pending commands after restart!',
    eventIds: ['ev-08', 'ev-09', 'ev-10', 'ev-11', 'ev-12', 'ev-13', 'ev-17', 'ev-18', 'ev-19', 'ev-20'],
    directCallers: ['lib/pipeline/coordinator.ex', 'lib/pipeline/worker_supervisor.ex'],
    directCallees: ['lib/storage/journal.ex', 'lib/gateway/external_client.ex', 'lib/pipeline/recovery_policy.ex'],
    symbols: [
      {
        id: 'worker_init',
        symbolKey: 'Pipeline.CommandWorker.init/1',
        name: 'init/1',
        module: 'Pipeline.CommandWorker',
        kind: 'callback',
        filePath: 'lib/pipeline/command_worker.ex',
        span: { startLine: 18, endLine: 34, focusLine: 24 },
        callersCount: 1,
        calleesCount: 1,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Initializes worker state. On restart, reloads state from Journal if pending.'
      },
      {
        id: 'worker_handle_info_execute',
        symbolKey: 'Pipeline.CommandWorker.handle_info/2 {:execute}',
        name: 'handle_info({:execute, cmd})',
        module: 'Pipeline.CommandWorker',
        kind: 'callback',
        filePath: 'lib/pipeline/command_worker.ex',
        span: { startLine: 36, endLine: 62, focusLine: 46 },
        callersCount: 2,
        calleesCount: 3,
        impactsEffect: true,
        isModified: true,
        docSummary: 'Checks journal status; if pending, invokes recovery or dispatches to external gateway.'
      },
      {
        id: 'worker_recover',
        symbolKey: 'Pipeline.CommandWorker.recover/2',
        name: 'recover/2',
        module: 'Pipeline.CommandWorker',
        kind: 'def',
        filePath: 'lib/pipeline/command_worker.ex',
        span: { startLine: 64, endLine: 94, focusLine: 74 },
        callersCount: 1,
        calleesCount: 2,
        impactsEffect: true,
        isModified: true,
        docSummary: 'Resubmits pending command to Gateway without verifying if prior attempt succeeded.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.CommandWorker do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Stateful worker executing external gateway writes with crash recovery."', diffStatus: 'context' },
      { num: 3, text: '  use GenServer, restart: :transient', diffStatus: 'context' },
      { num: 4, text: '  require Logger', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  defstruct [:command, :status, :retry_count, :in_flight_call, :last_error]', diffStatus: 'context' },
      { num: 7, text: '', diffStatus: 'context' },
      { num: 8, text: '  def start_link(command) do', diffStatus: 'context' },
      { num: 9, text: '    GenServer.start_link(__MODULE__, command)', diffStatus: 'context' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: '', diffStatus: 'context' },
      { num: 12, text: '  @impl true', diffStatus: 'context' },
      { num: 13, text: '  def init(command) do', diffStatus: 'context' },
      { num: 14, text: '    # In case of process restart, evaluate if command was partially executed', diffStatus: 'context' },
      { num: 15, text: '    state = %__MODULE__{command: command, status: :init, retry_count: 0, in_flight_call: nil}', diffStatus: 'focus', annotation: { line: 15, kind: 'snapshot', label: 'STATE_INIT', detail: 'Worker initialized with command struct; private memory reset', badge: 'STATE' } },
      { num: 16, text: '    {:ok, state, {:continue, :evaluate_recovery}}', diffStatus: 'context' },
      { num: 17, text: '  end', diffStatus: 'context' },
      { num: 18, text: '', diffStatus: 'context' },
      { num: 19, text: '  @impl true', diffStatus: 'context' },
      { num: 20, text: '  def handle_continue(:evaluate_recovery, %{command: cmd} = state) do', diffStatus: 'context' },
      { num: 21, text: '    case Storage.Journal.status(cmd.id) do', diffStatus: 'context' },
      { num: 22, text: '      :pending ->', diffStatus: 'context' },
      { num: 23, text: '        Logger.warn("Worker re-evaluating pending command post-restart", id: cmd.id)', diffStatus: 'context' },
      { num: 24, text: '        recover(cmd, state)', diffStatus: 'focus' },
      { num: 25, text: '      :committed ->', diffStatus: 'context' },
      { num: 26, text: '        {:stop, :normal, state}', diffStatus: 'context' },
      { num: 27, text: '      :missing ->', diffStatus: 'context' },
      { num: 28, text: '        {:noreply, state}', diffStatus: 'context' },
      { num: 29, text: '    end', diffStatus: 'context' },
      { num: 30, text: '  end', diffStatus: 'context' },
      { num: 31, text: '', diffStatus: 'context' },
      { num: 32, text: '  @impl true', diffStatus: 'context' },
      { num: 33, text: '  def handle_info({:execute, command}, state) do', diffStatus: 'context' },
      { num: 34, text: '    # Step 1: record pending status in Journal', diffStatus: 'context' },
      { num: 35, text: '    :ok = Storage.Journal.record_pending(command.id, command)', diffStatus: 'context', annotation: { line: 35, kind: 'journal', label: 'JOURNAL_PENDING', detail: 'SQL record inserted into Storage.Journal with status :pending', badge: 'SQL_IO' } },
      { num: 36, text: '    dispatch(command, %{state | status: :pending})', diffStatus: 'context' },
      { num: 37, text: '  end', diffStatus: 'context' },
      { num: 38, text: '', diffStatus: 'context' },
      { num: 39, text: '  defp dispatch(command, state) do', diffStatus: 'context' },
      { num: 40, text: '    # Injected fault hook: simulate BEAM killed fault during socket transmission', diffStatus: 'context' },
      { num: 41, text: '    if Process.get(:test_fault_injected) == :kill_during_dispatch do', diffStatus: 'context' },
      { num: 42, text: '      Logger.error("Simulated crash injected inside dispatch/2!")', diffStatus: 'context' },
      { num: 43, text: '      Process.exit(self(), :kill)', diffStatus: 'focus', annotation: { line: 43, kind: 'crash', label: 'CRASH_SITE', detail: 'Process.exit(self(), :kill) abruptly terminates worker pid', badge: 'CRASH' } },
      { num: 44, text: '    end', diffStatus: 'context' },
      { num: 45, text: '', diffStatus: 'context' },
      { num: 46, text: '    # Send external mutation via Gateway', diffStatus: 'context' },
      { num: 47, text: '    case Gateway.ExternalClient.post(command.target_url, command) do', diffStatus: 'focus', annotation: { line: 47, kind: 'effect', label: 'EFFECT_FRONTIER', detail: 'External HTTP POST /v1/settle attempted; outcome outside BEAM', badge: 'EXT_IO' } },
      { num: 48, text: '      {:ok, response} ->', diffStatus: 'context' },
      { num: 49, text: '        :ok = Storage.Journal.commit(command.id, response)', diffStatus: 'context' },
      { num: 50, text: '        {:noreply, %{state | status: :committed}}', diffStatus: 'context' },
      { num: 51, text: '      {:error, reason} ->', diffStatus: 'context' },
      { num: 52, text: '        {:stop, reason, %{state | last_error: reason}}', diffStatus: 'context' },
      { num: 53, text: '    end', diffStatus: 'context' },
      { num: 54, text: '  end', diffStatus: 'context' },
      { num: 55, text: '', diffStatus: 'context' },
      { num: 56, text: '  # --- PR #248 CHANGED RECOVER IMPLEMENTATION ---', diffStatus: 'context' },
      { num: 57, text: '  defp recover(command, state) do', diffStatus: 'context' },
      { num: 58, text: '    case Storage.Journal.status(command.id) do', diffStatus: 'context' },
      { num: 59, text: '      :committed ->', diffStatus: 'context' },
      { num: 60, text: '        {:stop, :normal, state}', diffStatus: 'context' },
      { oldNum: 61, text: '      :pending ->', diffStatus: 'remove' },
      { oldNum: 62, text: '        # Old behavior: stay idle to prevent duplicate write', diffStatus: 'remove' },
      { oldNum: 63, text: '        {:noreply, %{state | status: :blocked}}', diffStatus: 'remove' },
      { num: 61, text: '      :pending ->', diffStatus: 'add' },
      { num: 62, text: '        # New PR #248 behavior: aggressively resubmit to Gateway!', diffStatus: 'add' },
      { num: 63, text: '        # CAUTION: Prior external mutation outcome is UNVERIFIED!', diffStatus: 'add', annotation: { line: 63, kind: 'unconfirmed', label: 'EVIDENCE_GAP', detail: 'Attempt #1 external HTTP completion was not durably recorded before crash', badge: 'HAZARD' } },
      { num: 64, text: '        Logger.warn("Re-dispatching command to gateway post-restart", id: command.id)', diffStatus: 'add' },
      { num: 65, text: '        Gateway.ExternalClient.post(command.target_url, command)', diffStatus: 'add', annotation: { line: 65, kind: 'effect', label: 'EFFECT_FRONTIER_RETRY', detail: 'DUPLICATE EXTERNAL WRITE HAZARD: Attempt #2 sent without verification', badge: 'RETRY' } },
      { num: 66, text: '        {:noreply, %{state | status: :recovering, retry_count: state.retry_count + 1}}', diffStatus: 'add' },
      { num: 67, text: '      :missing ->', diffStatus: 'context' },
      { num: 68, text: '        {:noreply, state}', diffStatus: 'context' },
      { num: 69, text: '    end', diffStatus: 'context' },
      { num: 70, text: '  end', diffStatus: 'context' },
      { num: 71, text: 'end', diffStatus: 'context' }
    ]
  },

  // 9. Recovery Policy
  {
    path: 'lib/pipeline/recovery_policy.ex',
    module: 'Pipeline.RecoveryPolicy',
    subsystem: 'pipeline',
    loc: 40,
    changeStatus: 'INFRA',
    diffSummary: 'Pure functional exponential backoff with full jitter',
    eventIds: [],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'rec_backoff',
        symbolKey: 'Pipeline.RecoveryPolicy.backoff_ms/2',
        name: 'backoff_ms/2',
        module: 'Pipeline.RecoveryPolicy',
        kind: 'def',
        filePath: 'lib/pipeline/recovery_policy.ex',
        span: { startLine: 12, endLine: 28, focusLine: 18 },
        callersCount: 2,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Calculates exponential backoff delay with decorrelated jitter.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.RecoveryPolicy do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Pure backoff calculation and retry classification."', diffStatus: 'context' },
      { num: 3, text: '  @base_backoff_ms 250', diffStatus: 'context' },
      { num: 4, text: '  @max_backoff_ms 5000', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  def backoff_ms(attempt, base \\\\ @base_backoff_ms) do', diffStatus: 'context' },
      { num: 7, text: '    factor = :math.pow(2, min(attempt, 6))', diffStatus: 'context' },
      { num: 8, text: '    raw = trunc(base * factor)', diffStatus: 'context' },
      { num: 9, text: '    min(raw, @max_backoff_ms) + :rand.uniform(100)', diffStatus: 'focus' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: 'end', diffStatus: 'context' }
    ]
  },

  // 10. State Machine
  {
    path: 'lib/pipeline/state_machine.ex',
    module: 'Pipeline.StateMachine',
    subsystem: 'pipeline',
    loc: 46,
    changeStatus: 'INFRA',
    diffSummary: 'Explicit gen_statem transition matrix for command lifecycle',
    eventIds: [],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'sm_transition',
        symbolKey: 'Pipeline.StateMachine.transition/2',
        name: 'transition/2',
        module: 'Pipeline.StateMachine',
        kind: 'def',
        filePath: 'lib/pipeline/state_machine.ex',
        span: { startLine: 14, endLine: 36, focusLine: 20 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Enforces valid state transitions: :init -> :pending -> :dispatched -> :committed.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.StateMachine do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "FSM defining allowed saga transition states."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  @valid_transitions %{', diffStatus: 'context' },
      { num: 5, text: '    init: [:pending, :failed],', diffStatus: 'context' },
      { num: 6, text: '    pending: [:dispatched, :recovering, :failed],', diffStatus: 'context' },
      { num: 7, text: '    recovering: [:dispatched, :failed],', diffStatus: 'context' },
      { num: 8, text: '    dispatched: [:committed, :failed]', diffStatus: 'context' },
      { num: 9, text: '  }', diffStatus: 'context' },
      { num: 10, text: '', diffStatus: 'context' },
      { num: 11, text: '  def transition(from, to) do', diffStatus: 'context' },
      { num: 12, text: '    if to in Map.get(@valid_transitions, from, []), do: {:ok, to}, else: {:error, :invalid_transition}', diffStatus: 'focus' },
      { num: 13, text: '  end', diffStatus: 'context' },
      { num: 14, text: 'end', diffStatus: 'context' }
    ]
  },

  // 11. Journal
  {
    path: 'lib/storage/journal.ex',
    module: 'Storage.Journal',
    subsystem: 'storage',
    loc: 68,
    changeStatus: 'MODIFIED',
    diffSummary: 'Append-only PostgreSQL Ecto journal tracking pending and committed saga records',
    eventIds: ['ev-07', 'ev-08', 'ev-18', 'ev-22'],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: ['lib/storage/repo.ex'],
    symbols: [
      {
        id: 'journal_status',
        symbolKey: 'Storage.Journal.status/1',
        name: 'status/1',
        module: 'Storage.Journal',
        kind: 'def',
        filePath: 'lib/storage/journal.ex',
        span: { startLine: 18, endLine: 38, focusLine: 26 },
        callersCount: 3,
        calleesCount: 1,
        impactsEffect: false,
        isModified: true,
        docSummary: 'Queries database for command status: :pending, :committed, or :missing.'
      },
      {
        id: 'journal_commit',
        symbolKey: 'Storage.Journal.commit/2',
        name: 'commit/2',
        module: 'Storage.Journal',
        kind: 'def',
        filePath: 'lib/storage/journal.ex',
        span: { startLine: 40, endLine: 62, focusLine: 48 },
        callersCount: 2,
        calleesCount: 1,
        impactsEffect: true,
        isModified: false,
        docSummary: 'Atomically commits command entry with gateway response payload.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Storage.Journal do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Durable state journal living on Node C."', diffStatus: 'context' },
      { num: 3, text: '  import Ecto.Query', diffStatus: 'context' },
      { num: 4, text: '  alias Storage.Repo', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  def status(command_id) do', diffStatus: 'context' },
      { num: 7, text: '    case Repo.get_by(Storage.CommandEntry, command_id: command_id) do', diffStatus: 'context' },
      { num: 8, text: '      nil -> :missing', diffStatus: 'context' },
      { num: 9, text: '      %{status: "committed"} -> :committed', diffStatus: 'context' },
      { oldNum: 10, text: '      _other -> :pending', diffStatus: 'remove' },
      { num: 10, text: '      %{status: "pending"} -> :pending', diffStatus: 'add' },
      { num: 11, text: '      %{status: "recovering"} -> :pending', diffStatus: 'add' },
      { num: 12, text: '    end', diffStatus: 'focus' },
      { num: 13, text: '  end', diffStatus: 'context' },
      { num: 14, text: '', diffStatus: 'context' },
      { num: 15, text: '  def record_pending(command_id, command) do', diffStatus: 'context' },
      { num: 16, text: '    Repo.insert(%Storage.CommandEntry{command_id: command_id, status: "pending", payload: command})', diffStatus: 'context' },
      { num: 17, text: '    :ok', diffStatus: 'context' },
      { num: 18, text: '  end', diffStatus: 'context' },
      { num: 19, text: '', diffStatus: 'context' },
      { num: 20, text: '  def commit(command_id, result) do', diffStatus: 'context' },
      { num: 21, text: '    from(e in Storage.CommandEntry, where: e.command_id == ^command_id)', diffStatus: 'context' },
      { num: 22, text: '    |> Repo.update_all(set: [status: "committed", result: result])', diffStatus: 'focus', annotation: { line: 22, kind: 'journal', label: 'SQL_COMMIT', detail: 'Durable update to committed in PostgreSQL on Node C', badge: 'DURABLE' } },
      { num: 23, text: '    :ok', diffStatus: 'context' },
      { num: 24, text: '  end', diffStatus: 'context' },
      { num: 25, text: 'end', diffStatus: 'context' }
    ]
  },

  // 12. Event Store
  {
    path: 'lib/storage/event_store.ex',
    module: 'Storage.EventStore',
    subsystem: 'storage',
    loc: 50,
    changeStatus: 'INFRA',
    diffSummary: 'Event stream projection and subscriber broadcast',
    eventIds: [],
    directCallers: ['lib/storage/journal.ex'],
    directCallees: ['lib/storage/repo.ex'],
    symbols: [
      {
        id: 'es_append',
        symbolKey: 'Storage.EventStore.append_event/2',
        name: 'append_event/2',
        module: 'Storage.EventStore',
        kind: 'def',
        filePath: 'lib/storage/event_store.ex',
        span: { startLine: 12, endLine: 34, focusLine: 20 },
        callersCount: 2,
        calleesCount: 1,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Appends immutable event tuple to stream table.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Storage.EventStore do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Event stream storage for audit and replay projections."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def append_event(stream_id, event) do', diffStatus: 'context' },
      { num: 5, text: '    Storage.Repo.insert(%Storage.StreamEvent{stream_id: stream_id, event: event, inserted_at: DateTime.utc_now()})', diffStatus: 'focus' },
      { num: 6, text: '  end', diffStatus: 'context' },
      { num: 7, text: 'end', diffStatus: 'context' }
    ]
  },

  // 13. Snapshot Manager
  {
    path: 'lib/storage/snapshot_manager.ex',
    module: 'Storage.SnapshotManager',
    subsystem: 'storage',
    loc: 42,
    changeStatus: 'INFRA',
    diffSummary: 'Periodic worker state snapshot persistence',
    eventIds: ['ev-10'],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: ['lib/storage/repo.ex'],
    symbols: [
      {
        id: 'snap_save',
        symbolKey: 'Storage.SnapshotManager.save_snapshot/2',
        name: 'save_snapshot/2',
        module: 'Storage.SnapshotManager',
        kind: 'def',
        filePath: 'lib/storage/snapshot_manager.ex',
        span: { startLine: 10, endLine: 26, focusLine: 16 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Persists serialized snapshot of GenServer state to cold storage.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Storage.SnapshotManager do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Saves point-in-time process memory checkpoints."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def save_snapshot(worker_id, state) do', diffStatus: 'context' },
      { num: 5, text: '    # Point observation: does not guarantee continuous reconstruction', diffStatus: 'context' },
      { num: 6, text: '    payload = :erlang.term_to_binary(state)', diffStatus: 'focus' },
      { num: 7, text: '    :ok', diffStatus: 'context' },
      { num: 8, text: '  end', diffStatus: 'context' },
      { num: 9, text: 'end', diffStatus: 'context' }
    ]
  },

  // 14. Repo
  {
    path: 'lib/storage/repo.ex',
    module: 'Storage.Repo',
    subsystem: 'storage',
    loc: 28,
    changeStatus: 'INFRA',
    diffSummary: 'Ecto repository adapter for PostgreSQL',
    eventIds: [],
    directCallers: ['lib/storage/journal.ex', 'lib/storage/event_store.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'repo_module',
        symbolKey: 'Storage.Repo',
        name: 'Repo',
        module: 'Storage.Repo',
        kind: 'schema',
        filePath: 'lib/storage/repo.ex',
        span: { startLine: 1, endLine: 20, focusLine: 6 },
        callersCount: 5,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'PostgreSQL database connection pool adapter.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Storage.Repo do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Ecto database pool adapter for Node C store."', diffStatus: 'context' },
      { num: 3, text: '  use Ecto.Repo,', diffStatus: 'context' },
      { num: 4, text: '    otp_app: :elixir_scope_saga,', diffStatus: 'context' },
      { num: 5, text: '    adapter: Ecto.Adapters.Postgres', diffStatus: 'focus' },
      { num: 6, text: 'end', diffStatus: 'context' }
    ]
  },

  // 15. External Client (EFFECT FRONTIER)
  {
    path: 'lib/gateway/external_client.ex',
    module: 'Gateway.ExternalClient',
    subsystem: 'gateway',
    loc: 58,
    changeStatus: 'EFFECT_FRONTIER',
    diffSummary: 'Finch HTTP connection pool communicating with payment partner API (Effect Frontier)',
    eventIds: ['ev-11', 'ev-20'],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: ['lib/gateway/circuit_breaker.ex', 'lib/gateway/payload_codec.ex'],
    symbols: [
      {
        id: 'client_post',
        symbolKey: 'Gateway.ExternalClient.post/2',
        name: 'post/2',
        module: 'Gateway.ExternalClient',
        kind: 'def',
        filePath: 'lib/gateway/external_client.ex',
        span: { startLine: 16, endLine: 46, focusLine: 28 },
        callersCount: 2,
        calleesCount: 2,
        impactsEffect: true,
        isModified: false,
        docSummary: 'Executes HTTP POST over network; boundary of external side effect.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Gateway.ExternalClient do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "HTTP connection pool client reaching external payment processor."', diffStatus: 'context' },
      { num: 3, text: '  require Logger', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def post(url, payload) do', diffStatus: 'context' },
      { num: 6, text: '    body = Gateway.PayloadCodec.encode(payload)', diffStatus: 'context' },
      { num: 7, text: '    req = Finch.build(:post, "https://api.gateway.internal" <> url, [{"content-type", "application/json"}], body)', diffStatus: 'context' },
      { num: 8, text: '', diffStatus: 'context' },
      { num: 9, text: '    # CRITICAL: This is the EFFECT FRONTIER. Once the TCP SYN goes out,', diffStatus: 'context' },
      { num: 10, text: '    # the external system may commit side effects even if the BEAM process crashes!', diffStatus: 'context', annotation: { line: 10, kind: 'effect', label: 'EFFECT_FRONTIER_BOUNDARY', detail: 'Outbound TCP network socket: external state change cannot be rolled back', badge: 'NET_EFFECT' } },
      { num: 11, text: '    Telemetry.span([:gateway, :http_request], %{url: url, id: payload.id}, fn ->', diffStatus: 'focus' },
      { num: 12, text: '      case Finch.request(req, Gateway.FinchPool, receive_timeout: 5000) do', diffStatus: 'context' },
      { num: 13, text: '        {:ok, %Finch.Response{status: 200, body: resp_body}} ->', diffStatus: 'context' },
      { num: 14, text: '          {:ok, resp_body}', diffStatus: 'context' },
      { num: 15, text: '        {:error, reason} ->', diffStatus: 'context' },
      { num: 16, text: '          {:error, reason}', diffStatus: 'context' },
      { num: 17, text: '      end', diffStatus: 'context' },
      { num: 18, text: '    end)', diffStatus: 'context' },
      { num: 19, text: '  end', diffStatus: 'context' },
      { num: 20, text: 'end', diffStatus: 'context' }
    ]
  },

  // 16. Circuit Breaker
  {
    path: 'lib/gateway/circuit_breaker.ex',
    module: 'Gateway.CircuitBreaker',
    subsystem: 'gateway',
    loc: 48,
    changeStatus: 'INFRA',
    diffSummary: 'Fuse-based circuit breaker preventing cascading HTTP timeout storms',
    eventIds: [],
    directCallers: ['lib/gateway/external_client.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'cb_ask',
        symbolKey: 'Gateway.CircuitBreaker.allow_request?/1',
        name: 'allow_request?/1',
        module: 'Gateway.CircuitBreaker',
        kind: 'def',
        filePath: 'lib/gateway/circuit_breaker.ex',
        span: { startLine: 12, endLine: 30, focusLine: 18 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Inspects error rates and trips circuit if downstream latency exceeds threshold.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Gateway.CircuitBreaker do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Fuse circuit breaker for external service dependencies."', diffStatus: 'context' },
      { num: 3, text: '  use GenServer', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def start_link(_), do: GenServer.start_link(__MODULE__, :ok, name: __MODULE__)', diffStatus: 'context' },
      { num: 6, text: '  def init(:ok), do: {:ok, :closed}', diffStatus: 'context' },
      { num: 7, text: '', diffStatus: 'context' },
      { num: 8, text: '  def allow_request?(_service) do', diffStatus: 'context' },
      { num: 9, text: '    :fuse.ask(:gateway_fuse, :sync)', diffStatus: 'focus' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: 'end', diffStatus: 'context' }
    ]
  },

  // 17. Payload Codec
  {
    path: 'lib/gateway/payload_codec.ex',
    module: 'Gateway.PayloadCodec',
    subsystem: 'gateway',
    loc: 38,
    changeStatus: 'INFRA',
    diffSummary: 'JSON serializer computing SHA-256 idempotency fingerprint',
    eventIds: [],
    directCallers: ['lib/gateway/external_client.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'codec_encode',
        symbolKey: 'Gateway.PayloadCodec.encode/1',
        name: 'encode/1',
        module: 'Gateway.PayloadCodec',
        kind: 'def',
        filePath: 'lib/gateway/payload_codec.ex',
        span: { startLine: 10, endLine: 26, focusLine: 16 },
        callersCount: 2,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Encodes payload map into JSON binary with deterministic key ordering.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Gateway.PayloadCodec do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Deterministic serialization and checksum calculations."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def encode(payload) do', diffStatus: 'context' },
      { num: 5, text: '    Jason.encode!(payload)', diffStatus: 'focus' },
      { num: 6, text: '  end', diffStatus: 'context' },
      { num: 7, text: '', diffStatus: 'context' },
      { num: 8, text: '  def fingerprint(payload) do', diffStatus: 'context' },
      { num: 9, text: '    :crypto.hash(:sha256, encode(payload)) |> Base.encode16(case: :lower)', diffStatus: 'context' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: 'end', diffStatus: 'context' }
    ]
  },

  // 18. Ledger Writer
  {
    path: 'lib/settlement/ledger_writer.ex',
    module: 'Settlement.LedgerWriter',
    subsystem: 'settlement',
    loc: 56,
    changeStatus: 'CALLER',
    diffSummary: 'Double-entry balanced accounting ledger persistence',
    eventIds: ['ev-21'],
    directCallers: ['lib/pipeline/command_worker.ex'],
    directCallees: ['lib/settlement/audit_trail.ex', 'lib/storage/repo.ex'],
    symbols: [
      {
        id: 'ledger_post',
        symbolKey: 'Settlement.LedgerWriter.post_entry/3',
        name: 'post_entry/3',
        module: 'Settlement.LedgerWriter',
        kind: 'def',
        filePath: 'lib/settlement/ledger_writer.ex',
        span: { startLine: 14, endLine: 42, focusLine: 24 },
        callersCount: 1,
        calleesCount: 2,
        impactsEffect: true,
        isModified: false,
        docSummary: 'Inserts double-entry accounting records into settlement ledger.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Settlement.LedgerWriter do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Double-entry transaction persistence and balance integrity."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def post_entry(account_id, amount, ref_id) do', diffStatus: 'context' },
      { num: 5, text: '    # Invariant: debits must equal credits', diffStatus: 'context' },
      { num: 6, text: '    entries = [', diffStatus: 'context' },
      { num: 7, text: '      %{account: account_id, debit: amount, credit: 0, ref: ref_id},', diffStatus: 'context' },
      { num: 8, text: '      %{account: "settlement_clearing", debit: 0, credit: amount, ref: ref_id}', diffStatus: 'context' },
      { num: 9, text: '    ]', diffStatus: 'context' },
      { num: 10, text: '    Settlement.AuditTrail.record_entries(entries)', diffStatus: 'focus' },
      { num: 11, text: '    :ok', diffStatus: 'context' },
      { num: 12, text: '  end', diffStatus: 'context' },
      { num: 13, text: 'end', diffStatus: 'context' }
    ]
  },

  // 19. Audit Trail
  {
    path: 'lib/settlement/audit_trail.ex',
    module: 'Settlement.AuditTrail',
    subsystem: 'settlement',
    loc: 44,
    changeStatus: 'INFRA',
    diffSummary: 'Immutable cryptographic hash-chained audit log',
    eventIds: [],
    directCallers: ['lib/settlement/ledger_writer.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'audit_record',
        symbolKey: 'Settlement.AuditTrail.record_entries/1',
        name: 'record_entries/1',
        module: 'Settlement.AuditTrail',
        kind: 'def',
        filePath: 'lib/settlement/audit_trail.ex',
        span: { startLine: 12, endLine: 32, focusLine: 20 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Appends SHA-256 hashed ledger entries to tamper-evident audit log.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Settlement.AuditTrail do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Cryptographically verifiable audit log records."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def record_entries(entries) do', diffStatus: 'context' },
      { num: 5, text: '    for e <- entries do', diffStatus: 'context' },
      { num: 6, text: '      # Hash chaining to guarantee append-only record security', diffStatus: 'focus' },
      { num: 7, text: '      _hash = :crypto.hash(:sha256, inspect(e))', diffStatus: 'context' },
      { num: 8, text: '    end', diffStatus: 'context' },
      { num: 9, text: '    :ok', diffStatus: 'context' },
      { num: 10, text: '  end', diffStatus: 'context' },
      { num: 11, text: 'end', diffStatus: 'context' }
    ]
  },

  // 20. Node Monitor
  {
    path: 'lib/cluster/node_monitor.ex',
    module: 'Cluster.NodeMonitor',
    subsystem: 'cluster',
    loc: 52,
    changeStatus: 'INFRA',
    diffSummary: 'Distributed Erlang node membership and heartbeat listener',
    eventIds: [],
    directCallers: ['lib/core/application.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'node_mon_init',
        symbolKey: 'Cluster.NodeMonitor.init/1',
        name: 'init/1',
        module: 'Cluster.NodeMonitor',
        kind: 'callback',
        filePath: 'lib/cluster/node_monitor.ex',
        span: { startLine: 14, endLine: 36, focusLine: 20 },
        callersCount: 1,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Subscribes to :net_kernel :nodeup and :nodedown distribution signals.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Cluster.NodeMonitor do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Tracks BEAM cluster membership across Node A, Node B, and Node C."', diffStatus: 'context' },
      { num: 3, text: '  use GenServer', diffStatus: 'context' },
      { num: 4, text: '', diffStatus: 'context' },
      { num: 5, text: '  def start_link(_opts), do: GenServer.start_link(__MODULE__, :ok, name: __MODULE__)', diffStatus: 'context' },
      { num: 6, text: '', diffStatus: 'context' },
      { num: 7, text: '  @impl true', diffStatus: 'context' },
      { num: 8, text: '  def init(:ok) do', diffStatus: 'context' },
      { num: 9, text: '    :net_kernel.monitor_nodes(true)', diffStatus: 'focus' },
      { num: 10, text: '    {:ok, %{nodes: Node.list()}}', diffStatus: 'context' },
      { num: 11, text: '  end', diffStatus: 'context' },
      { num: 12, text: 'end', diffStatus: 'context' }
    ]
  },

  // 21. Ring Manager
  {
    path: 'lib/cluster/ring_manager.ex',
    module: 'Cluster.RingManager',
    subsystem: 'cluster',
    loc: 48,
    changeStatus: 'INFRA',
    diffSummary: 'Consistent hash ring routing command keys to partition owners',
    eventIds: [],
    directCallers: ['lib/core/application.ex', 'lib/pipeline/coordinator.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'ring_node_for_key',
        symbolKey: 'Cluster.RingManager.node_for_key/1',
        name: 'node_for_key/1',
        module: 'Cluster.RingManager',
        kind: 'def',
        filePath: 'lib/cluster/ring_manager.ex',
        span: { startLine: 12, endLine: 32, focusLine: 20 },
        callersCount: 2,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Maps command UUID through 1024-vnode consistent hash ring.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Cluster.RingManager do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Consistent hashing ring mapping commands to target nodes."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def node_for_key(key) do', diffStatus: 'context' },
      { num: 5, text: '    hash = :erlang.phash2(key, 1024)', diffStatus: 'focus' },
      { num: 6, text: '    if hash < 512, do: :"node_b@worker-04", else: :"node_c@store-02"', diffStatus: 'context' },
      { num: 7, text: '  end', diffStatus: 'context' },
      { num: 8, text: 'end', diffStatus: 'context' }
    ]
  },

  // 22. Span Tracer
  {
    path: 'lib/telemetry/span_tracer.ex',
    module: 'Telemetry.SpanTracer',
    subsystem: 'telemetry',
    loc: 56,
    changeStatus: 'INFRA',
    diffSummary: 'OpenTelemetry & BEAM :seq_trace propagator attaching tokens',
    eventIds: ['ev-04', 'ev-05'],
    directCallers: ['lib/ingest/ingress_controller.ex', 'lib/pipeline/command_worker.ex'],
    directCallees: [],
    symbols: [
      {
        id: 'tracer_inject',
        symbolKey: 'Telemetry.SpanTracer.inject_token/1',
        name: 'inject_token/1',
        module: 'Telemetry.SpanTracer',
        kind: 'def',
        filePath: 'lib/telemetry/span_tracer.ex',
        span: { startLine: 14, endLine: 36, focusLine: 22 },
        callersCount: 3,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Attaches trace token to process dictionary and seq_trace label.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Telemetry.SpanTracer do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Propagates causal trace tokens across BEAM process messaging."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def inject_token(correlation_id) do', diffStatus: 'context' },
      { num: 5, text: '    Process.put(:scope_correlation_token, correlation_id)', diffStatus: 'focus' },
      { num: 6, text: '    :seq_trace.set_token(:label, :erlang.phash2(correlation_id))', diffStatus: 'context' },
      { num: 7, text: '    correlation_id', diffStatus: 'context' },
      { num: 8, text: '  end', diffStatus: 'context' },
      { num: 9, text: 'end', diffStatus: 'context' }
    ]
  },

  // 23. Recovery Test (FAILING PROPERTY TEST)
  {
    path: 'test/pipeline/recovery_test.exs',
    module: 'Pipeline.RecoveryTest',
    subsystem: 'test',
    loc: 72,
    changeStatus: 'TEST_LEAD',
    diffSummary: 'Property test proving crash recovery duplicates external HTTP mutations',
    eventIds: ['ev-01', 'ev-12', 'ev-20'],
    directCallers: [],
    directCallees: ['lib/pipeline/command_worker.ex', 'test/support/command_fixture.ex'],
    symbols: [
      {
        id: 'test_recovery_hazard',
        symbolKey: 'Pipeline.RecoveryTest.test_idempotent_recovery',
        name: 'test "recovers pending command without duplicate external write"',
        module: 'Pipeline.RecoveryTest',
        kind: 'def',
        filePath: 'test/pipeline/recovery_test.exs',
        span: { startLine: 14, endLine: 54, focusLine: 32 },
        callersCount: 0,
        calleesCount: 3,
        impactsEffect: true,
        isModified: false,
        docSummary: 'Asserts that killed worker does not duplicate gateway payments; FAILS under PR #248.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Pipeline.RecoveryTest do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Counterexample witness test demonstrating PR #248 recovery hazard."', diffStatus: 'context' },
      { num: 3, text: '  use ExUnit.Case, async: false', diffStatus: 'context' },
      { num: 4, text: '  import Test.Support.CommandFixture', diffStatus: 'context' },
      { num: 5, text: '', diffStatus: 'context' },
      { num: 6, text: '  @tag :failing_witness', diffStatus: 'context' },
      { num: 7, text: '  test "recovers pending command without duplicate external write" do', diffStatus: 'context' },
      { num: 8, text: '    command = build_command(id: "cmd-42", amount: 120_000)', diffStatus: 'context' },
      { num: 9, text: '    {:ok, _id} = Ingest.IngressController.submit(command)', diffStatus: 'context' },
      { num: 10, text: '', diffStatus: 'context' },
      { num: 11, text: '    # Simulate kill fault in worker during active HTTP socket connection', diffStatus: 'context' },
      { num: 12, text: '    worker_pid = wait_for_worker("cmd-42")', diffStatus: 'context' },
      { num: 13, text: '    Process.exit(worker_pid, :kill)', diffStatus: 'focus', annotation: { line: 13, kind: 'crash', label: 'TEST_FAULT_INJECTION', detail: 'Test kills worker PID while gateway dispatch is in-flight', badge: 'KILL_TEST' } },
      { num: 14, text: '', diffStatus: 'context' },
      { num: 15, text: '    # Supervisor restarts child worker', diffStatus: 'context' },
      { num: 16, text: '    assert_eventually(fn -> is_pid(wait_for_worker("cmd-42")) end)', diffStatus: 'context' },
      { num: 17, text: '', diffStatus: 'context' },
      { num: 18, text: '    # Invariant: External gateway must receive EXACTLY ONE write for cmd-42', diffStatus: 'context' },
      { num: 19, text: '    # FAILS: Under PR #248, count is 2 (DUPLICATE WRITE HAZARD)', diffStatus: 'context', annotation: { line: 19, kind: 'unconfirmed', label: 'TEST_FAILURE', detail: 'Expected 1 gateway call, observed 2 gateway calls', badge: 'FAIL_ASSERT' } },
      { num: 20, text: '    attempts = Gateway.MockServer.received_calls("cmd-42")', diffStatus: 'focus' },
      { num: 21, text: '    assert length(attempts) == 1, "Duplicate payment attempted for cmd-42!"', diffStatus: 'context' },
      { num: 22, text: '  end', diffStatus: 'context' },
      { num: 23, text: 'end', diffStatus: 'context' }
    ]
  },

  // 24. Command Fixture
  {
    path: 'test/support/command_fixture.ex',
    module: 'Test.Support.CommandFixture',
    subsystem: 'test',
    loc: 32,
    changeStatus: 'INFRA',
    diffSummary: 'Generates synthetic command maps for unit and property testing',
    eventIds: [],
    directCallers: ['test/pipeline/recovery_test.exs'],
    directCallees: [],
    symbols: [
      {
        id: 'fixture_build',
        symbolKey: 'Test.Support.CommandFixture.build_command/1',
        name: 'build_command/1',
        module: 'Test.Support.CommandFixture',
        kind: 'def',
        filePath: 'test/support/command_fixture.ex',
        span: { startLine: 8, endLine: 24, focusLine: 14 },
        callersCount: 2,
        calleesCount: 0,
        impactsEffect: false,
        isModified: false,
        docSummary: 'Constructs synthetic command map with unique UUID and payment payload.'
      }
    ],
    lines: [
      { num: 1, text: 'defmodule Test.Support.CommandFixture do', diffStatus: 'context' },
      { num: 2, text: '  @moduledoc "Test helper synthesizing valid command parameters."', diffStatus: 'context' },
      { num: 3, text: '', diffStatus: 'context' },
      { num: 4, text: '  def build_command(attrs \\\\ []) do', diffStatus: 'context' },
      { num: 5, text: '    id = Keyword.get(attrs, :id, "cmd-#{:rand.uniform(9999)}")', diffStatus: 'context' },
      { num: 6, text: '    %{', diffStatus: 'focus' },
      { num: 7, text: '      "id" => id,', diffStatus: 'context' },
      { num: 8, text: '      "account_id" => "acct-test-99",', diffStatus: 'context' },
      { num: 9, text: '      "amount" => Keyword.get(attrs, :amount, 50_000),', diffStatus: 'context' },
      { num: 10, text: '      "target_url" => "/v1/settle",', diffStatus: 'context' },
      { num: 11, text: '      "idempotency_key" => "idem-#{id}"', diffStatus: 'context' },
      { num: 12, text: '    }', diffStatus: 'context' },
      { num: 13, text: '  end', diffStatus: 'context' },
      { num: 14, text: 'end', diffStatus: 'context' }
    ]
  }
];
