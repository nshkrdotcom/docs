# Cost-Refined Types

## Thesis

Performance is a semantic dimension, not only an empirical result.

A type should encode not just:

```elixir
@spec checkout(Session.t()) :: {:ok, Worker.t()} | {:error, term()}
```

But:

```text
checkout : Session -> Worker
  @ requires Capability<CheckoutWorker>
  @ effects [registry_lookup, worker_checkout, telemetry_emit]
  @ protocol SessionOpen ; Checkout ; Execute* ; Checkin
  @ resource mailbox_delta ≤ 1, pool_count ≤ configured_max
  @ cost p95 ≤ 20ms, reductions ≤ bound, no unbounded scan
  @ observation emits [:archex, :session_pool, :checkout, :stop]
```

## Static vs empirical performance

Exact wall-clock time is environmental. The type system should separate:

| Layer | Example | Enforcement |
|---|---|---|
| Structural resource type | no unbounded spawn, no extra ETS table, no global lock | static analysis / Credo / semantic checker |
| Asymptotic cost type | `O(1)` checkout relative to active sessions | property test / static path check |
| Resource envelope type | mailbox depth bounded, pool size bounded | property test / runtime check |
| Empirical calibration | p95 ≤ configured envelope | Benchee / telemetry / CI benchmark |
| Observation contract | event emitted with duration and metadata | ExUnit / telemetry test |

## Example: HotPathOperation type

```elixir
semantic_type "session_pool.checkout" do
  kind :hot_path_operation

  input  "SessionId"
  output "WorkerRef"

  requires capability: "session.worker.checkout"

  effects do
    allow :registry_lookup
    allow :worker_checkout
    allow :telemetry_emit
    forbid :db_write
    forbid :network_call
  end

  resources do
    bound :mailbox_delta, max: 1
    bound :pool_workers, max_ref: "config.session_pool.max_workers"
    forbid :unbounded_spawn
  end

  cost do
    asymptotic :constant, relative_to: :active_sessions
    p95 max_ms: 20
    allocation_delta max_bytes: 2048
  end

  observes do
    event [:archex, :session_pool, :checkout, :start]
    event [:archex, :session_pool, :checkout, :stop]
    event [:archex, :session_pool, :checkout, :exception]
  end
end
```

## Failure examples

| Change | Type violation |
|---|---|
| Add DB write to checkout | forbidden effect |
| Scan all active sessions on checkout | asymptotic cost violation |
| Spawn unsupervised worker | topology/resource violation |
| Remove stop telemetry | observation violation |
| Permit checkout without capability | capability violation |
| Execute before checkout | protocol violation |

## Generated projections

From the type above, the projection engine derives:

- ExUnit contract tests
- StreamData state-machine/property tests
- Credo checks for forbidden calls and unsupervised spawn
- Dialyzer/spec templates where useful
- Benchee benchmark stub and threshold config
- Telemetry assertion tests
- Mutation tests that remove capability checks, reorder protocol, remove telemetry, or add forbidden effects
