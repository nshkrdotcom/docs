# MVP Build Pivot

## Do not build the whole v2 substrate first

The right MVP is narrow and executable.

The first success condition is not a grand graph database. It is catching representative AI-bad patches before human review while still allowing valid local fixes.

## First vertical slice

Start with a supervised Elixir/OTP `SessionPool`.

Semantic types:

```text
AgentCapabilityBundle
BoundaryProcess
SessionProtocol
HotPathOperation
```

The target operation:

```text
SessionPool.checkout/2
```

is not merely:

```text
SessionId -> WorkerRef
```

It is:

```text
SessionId -> WorkerRef
  @ requires Capability<session.worker.checkout>
  @ effects [registry_lookup, worker_checkout, telemetry_emit]
  @ forbids [db_write, network_call, unsupervised_spawn]
  @ protocol session_open -> worker_checked_out
  @ resource mailbox_delta <= 1
  @ cost p95 <= 20ms
  @ observation emits checkout start/stop/exception events
```

## MVP loop

```text
semantic YAML/DSL
-> generated tests / static checks / benchmarks / telemetry contracts
-> mutation runner: inject known-bad patches
-> patch impact analysis
-> proof bundle
-> deterministic consistency-kernel verdict
-> runtime cost-type calibration
```

## First commands

```bash
mix spec.audit
mix spec.bundle <cell>
mix spec.accept
mix spec.trace
mix spec.typecheck
mix spec.oracle <intent>
mix spec.mutate <invariant>
mix spec.proof <patch>
```

## Known-bad patches to reject

```text
remove capability check from checkout
spawn unsupervised process from repair agent
perform forbidden db_write in hot path
skip required telemetry event
break session protocol ordering
allow unbounded mailbox growth
modify global capability rules from local repair scope
```

## Known-good patch to allow

```text
bounded checkout timeout/retry refinement that preserves capability,
protocol, cost, and observation contracts
```

## Two-week target

1. Define semantic type DSL/YAML for the four MVP types.
2. Implement `mix spec.audit` for five slop detectors.
3. Implement `mix spec.typecheck` for the `SessionPool.checkout/2` semantic type.
4. Generate ExUnit tests for capability denial and protocol order.
5. Generate a telemetry contract test.
6. Implement a simple mutation runner with 3 known-bad mutants.
7. Produce a proof bundle for one valid local fix.

## Six-week target

1. Add Patch Lens impact analysis.
2. Add a minimal Type Oracle for valid local morphisms.
3. Add one Control Oracle path for local vs global repair.
4. Add one safe normalizer.
5. Add runtime observer calibration for checkout latency and mailbox growth.
6. Compare naive AI output vs substrate-guided output.

## Kill criterion

If the MVP becomes paperwork or fails to catch real known-bad patches, kill or narrow it.

The MVP succeeds only if it changes accepted code quality.
