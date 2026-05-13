# Static Analysis, QC, And CI Gates

## Purpose

This document defines static analysis, quality controls, CI gates, exceptions, and evidence for large Elixir/OTP applications.

## QC Rule

```text
Anything repeatedly found in review should become a deterministic check when practical.
```

## Control Levels

| Level | Name | Meaning |
|---|---|---|
| L0 | Guidance | Documentation and checklist only. |
| L1 | Structured review | Required form or rationale. |
| L2 | Static check | AST, text, dependency, or graph detector. |
| L3 | Behavioral check | Unit, integration, property, or fault test. |
| L4 | Construction constraint | Generator/template prevents invalid shape. |
| L5 | Merge gate | CI blocks acceptance. |

## Risk-Tiered Gates

QC gates scale with risk:

| Tier | Required Gate Shape |
|---|---|
| L0 Fast Track | Format, compile, focused tests, and any affected local static checks. |
| L1 Standard Feature | PR gate plus persistence/boundary tests for changed behavior. |
| L2 Runtime Or Integration | PR gate plus process, job, LiveView/PubSub, external adapter, migration, or ingestion tests as applicable. |
| L3 Architecture Change | Release gate plus architecture gate and evidence ledger. |

Skipping a heavier gate is acceptable only when the change remains inside the declared lower tier.

## Baseline Gates

Recommended baseline:

```bash
mix format --check-formatted
mix compile --warnings-as-errors
mix test
mix credo --strict
mix dialyzer
mix sobelow
mix deps.audit
```

Projects may vary, but skipped gates require explicit rationale.

## Static Analysis Areas

### Format And Compile

Gate:

- No formatting drift.
- No compile warnings.
- No missing applications.
- No runtime use of Mix in release code.

### Credo

Use Credo for:

- Readability.
- Refactor pressure.
- Design checks.
- Unsafe calls.
- Custom AST checks.

Advanced checks to consider:

- Forbidden modules by path.
- No `Mix.env/0` in `lib/`.
- No unsafe env reads at module body.
- No `String.to_atom/1` on untrusted paths.
- No unmanaged tasks.
- No `spawn` in production code.
- No blocking calls in GenServer callbacks.
- Missing telemetry around external calls.
- No broad rescue swallowing errors.
- LiveView callbacks calling Repo directly for domain writes.
- LiveView `handle_info` accepting broad undocumented message shapes.
- Broadway callbacks with hidden provider effects and no idempotency marker.
- Direct `:persistent_term.put/2`, `:counters.new/2`, or `:atomics.new/2` outside approved owner modules.

### Dialyzer

Use for:

- Public contract sanity.
- Type mismatch detection.
- Opaque type boundaries.
- Error tuple consistency.

Dialyzer is not a proof of correctness. It is one gate.

### Sobelow And Security Scans

Use for:

- Phoenix/web security checks.
- Unsafe redirects.
- SQL injection risks.
- Config mistakes.

Add custom scans for:

- Secrets in logs.
- Unsafe shell execution.
- Runtime eval.
- Unsafe deserialization.

### Dependency Audit

Use for:

- Known vulnerabilities.
- License policy.
- Deprecated packages.
- Runtime dependency creep.
- Optional dependency leakage.

## Boundary Checks

Enforce:

- Web cannot call internal context modules.
- Domain core cannot call Repo.
- Domain core cannot call HTTP clients.
- Domain core cannot read config.
- External SDK structs cannot appear in domain modules.
- Internal modules are not used by outside contexts.

Tools may include:

- Custom Credo checks.
- Boundary libraries.
- Dependency graph scripts.
- Public API export diffs.

Example boundary configuration shape:

```elixir
defmodule MyApp.Orders do
  use Boundary,
    deps: [
      MyApp.Orders.Domain,
      MyApp.Orders.Schemas,
      MyApp.Repo
    ],
    exports: [Orders]
end

defmodule MyApp.Orders.Domain do
  use Boundary, deps: [], exports: [Order, Money]
end
```

The exact configuration should match the project, but the rule is stable: domain/core packages have no dependency on Repo, web, provider SDKs, or runtime process APIs.

Example custom-check targets:

```elixir
# .credo.exs sketch
%{
  configs: [
    %{
      name: "default",
      checks: [
        {Credo.Check.Warning.ApplicationConfigInModuleAttribute, []},
        {MyApp.Credo.NoStringToAtom, paths: ["lib"]},
        {MyApp.Credo.NoMixEnvInLib, paths: ["lib"]},
        {MyApp.Credo.NoRepoInDomain, paths: ["lib/my_app/*/domain"]},
        {MyApp.Credo.NoSpawnInLib, paths: ["lib"]},
        {MyApp.Credo.NoPersistentTermHotWrite, paths: ["lib"]}
      ]
    }
  ]
}
```

Treat snippets as examples, not portable copy/paste. The important part is promoting repeated review findings into deterministic checks.

## OTP Checks

Flag:

- `spawn`, `spawn_link`, `Task.start` in production paths.
- `Task.async` without await or monitor.
- GenServer modules with no state.
- GenServer callbacks with direct HTTP calls.
- `cast` handlers doing important unbounded work.
- Dynamic atom names.
- Registry for static singleton.
- DynamicSupervisor with fixed children.
- `Process.sleep/1` in tests.
- `:persistent_term` writes in request, job, LiveView, or hot callback paths.
- Counter arrays used for durable business facts.

## LiveView And PubSub Checks

Flag:

- LiveView assigning durable business truth without external recovery.
- LiveView `handle_event` implementing business transitions instead of delegating to context APIs.
- LiveView subscribing to global or tenantless topics in multi-tenant systems.
- PubSub payloads that include large structs, secrets, or provider payloads.
- PubSub used as must-deliver business event transport.
- LiveComponents used for isolation assumptions even though they share the parent LiveView process.

## Ingestion Checks

Flag Broadway/GenStage pipelines where:

- Ack behavior is undocumented.
- Processor or batcher callbacks contain unbounded side effects.
- Duplicate delivery is unsafe.
- Poison-message handling is missing.
- Backpressure, concurrency, and batch settings have no rationale.
- Dead-letter queues lack owner, alert, replay, or retention policy.
- Pipeline telemetry is missing.

## Migration Safety Checks

Flag:

- Dropping columns without compatibility.
- Renaming columns directly.
- Adding non-null columns without backfill/default plan.
- Creating indexes without concurrent strategy where needed.
- Long data migrations in migration transaction.

## CI Gate Profiles

### Local Fast Gate

```bash
mix format
mix compile
mix test
```

### PR Gate

```bash
mix format --check-formatted
mix compile --warnings-as-errors
mix test
mix credo --strict
```

### Release Gate

```bash
mix dialyzer
mix sobelow
mix deps.audit
mix test --include integration
mix test --include contract
mix test --include release
```

### Architecture Gate

- Public API diff.
- Boundary diff.
- Process inventory diff.
- Migration risk review.
- Effect declaration diff.
- Telemetry coverage diff.
- LiveView/PubSub subscription diff.
- Ingestion pipeline diff.
- Advanced primitive ownership diff.

## Exceptions

Exception template:

```yaml
exception:
  id:
  rule:
  location:
  reason:
  owner:
  expires:
  compensating_control:
  tests:
  reviewer:
```

Rules:

- No owner, no exception.
- No expiration, no exception.
- Security exceptions require explicit approval.
- Expired exceptions fail CI or review.

## Evidence Ledger

Each release should record:

- Commit or release SHA.
- Gate results.
- Known failures.
- Waivers.
- Migration status.
- Test suite summary.
- Static analysis summary.
- Open production risks.

## LM-Assisted Controls

Use LM critique for:

- Ambiguous concept detection.
- Missing test suggestions.
- Architecture compression.
- Review finding clustering.
- Error explanation.

Do not use LM as authority for:

- Passing tests.
- Static analysis results.
- File existence.
- Dependency graph truth.
- Secret scan truth.

## Review Checklist

- [ ] Required gates are declared.
- [ ] Boundary and OTP checks cover local anti-patterns.
- [ ] Boundary enforcement uses deterministic tooling where practical, not only PR vigilance.
- [ ] LiveView/PubSub, ingestion, and advanced primitive checks cover local anti-patterns.
- [ ] Exceptions have owner and expiration.
- [ ] CI profiles distinguish local, PR, release, and architecture gates.
- [ ] Repeated review findings are promoted to checks.
- [ ] Evidence ledger is maintained for releases.
