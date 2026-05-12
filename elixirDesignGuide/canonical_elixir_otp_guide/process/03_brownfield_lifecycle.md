# Brownfield Lifecycle

## Purpose

Brownfield Elixir/OTP work starts with discovery, not rewriting. Existing systems have implicit contracts, hidden process dependencies, production data, and operational habits. The goal is to make those constraints visible before changing them.

## Brownfield Rule

```text
Inventory before intervention.
Stabilize before refactor.
Refactor before rebuild.
Rebuild only behind a compatibility plan.
```

## Phase 0: Safety Baseline

Record the current state.

Run, where available:

```bash
mix deps.get
mix compile
mix compile --warnings-as-errors
mix format --check-formatted
mix test
mix credo --strict
mix dialyzer
mix sobelow
mix deps.audit
```

If some commands fail, record that. Do not hide failure to create a clean narrative.

Create:

```text
docs/brownfield/
  00_baseline.md
  01_inventory.md
  02_findings.md
  03_exceptions.md
```

Gate:

```text
No cleanup or architecture claim is accepted without a baseline.
```

## Phase 1: Inventory

Inventory these surfaces:

- Mix projects and dependency graph.
- Applications started in releases.
- Supervisors and children.
- GenServers, Agents, Tasks, DynamicSupervisors, Registries, ETS owners.
- Public modules and public functions.
- Ecto schemas, migrations, constraints, and repos.
- External clients and SDKs.
- Config and env access.
- Secrets handling.
- Background jobs.
- Message/event formats.
- Observability instrumentation.
- CI commands and release scripts.

Run the inventory through four explicit audit tracks:

| Audit Track | Questions |
|---|---|
| Runtime audit | Which processes exist, who starts them, what state do they own, and what happens on restart? |
| Data audit | Which tables, schemas, constraints, migrations, read models, and repair scripts define durable truth? |
| Boundary audit | Which public APIs are actually used, which internal modules leak, and where do external payloads enter? |
| Dependency audit | Which Mix apps, libraries, external services, and optional providers are required for boot, tests, and release? |

Useful scans:

```bash
rg 'use GenServer|use Agent|DynamicSupervisor|Task.Supervisor|Task\\.start|Task\\.async|spawn\\(' lib test
rg 'Application\\.get_env|System\\.get_env|Mix\\.env' lib config
rg 'String\\.to_atom|binary_to_term|Code\\.eval|:os\\.cmd|System\\.cmd' lib test
rg 'Repo\\.transaction|Ecto\\.Multi|unique_constraint|foreign_key_constraint' lib priv
```

Gate:

```text
Every production-significant process is listed with owner, supervisor, state, and restart behavior.
```

## Phase 2: Risk Classification

Classify findings:

| Severity | Meaning |
|---|---|
| Blocker | Can lose data, leak secrets, silently drop work, or prevent release. |
| High | Can cause production incidents under plausible load or failure. |
| Medium | Causes maintainability, testability, or local correctness risk. |
| Low | Style, clarity, or cleanup improvement. |

Risk tags:

- `unsupervised_work`
- `hidden_effect`
- `boundary_leak`
- `unsafe_config`
- `unsafe_secret`
- `atom_exhaustion`
- `blocking_callback`
- `unbounded_mailbox`
- `migration_risk`
- `duplicate_state_owner`
- `missing_observability`
- `contract_drift`

Gate:

```text
Each high or blocker finding has an owner and remediation path.
```

## Phase 3: Stabilization

Before large refactors:

- Add tests around current behavior.
- Add telemetry around unclear runtime behavior.
- Add compatibility wrappers for public APIs.
- Add idempotency around risky external effects.
- Add supervision around important unsupervised work.
- Add database constraints for race-sensitive invariants.
- Add release-safe config paths.

Gate:

```text
The system is safer after stabilization even if no major architecture cleanup has happened.
```

## Phase 4: Boundary Recovery

Recover boundaries from actual usage.

Steps:

1. Identify modules that callers use directly.
2. Identify modules that should be internal.
3. Create or repair public context APIs.
4. Move external payload parsing to boundary modules.
5. Move Repo calls out of web/UI layers.
6. Move business logic out of GenServer callbacks.
7. Add static checks or review gates for boundary violations.

Gate:

```text
New code must use recovered public boundaries even if old code remains temporarily grandfathered.
```

## Phase 5: Runtime Topology Repair

Audit every process:

- Does it own state?
- Is that state authoritative or cached?
- Is the process supervised?
- Can state be rebuilt?
- Can it block?
- Can mailbox grow unbounded?
- Does it use `cast` for important work?
- Does it hide business logic in callbacks?

Common repairs:

- Replace stateless GenServer with plain module.
- Move business transition to pure module.
- Move slow IO to supervised Task or job.
- Add Registry only where dynamic lookup is needed.
- Split one global bottleneck process into per-entity processes or transactional operations.
- Replace GenServer read bottleneck with ETS only when access policy is explicit.

Gate:

```text
No long-lived production-significant process remains unsupervised without a documented exception.
```

## Phase 6: Data And Persistence Repair

Brownfield data issues usually constrain architecture.

Repair order:

1. Add missing constraints.
2. Backfill invalid data.
3. Add dual-read or dual-write only when needed and time bounded.
4. Add online-safe migrations.
5. Introduce read models.
6. Split overloaded schemas.
7. Remove obsolete columns after compatibility window.

Gate:

```text
Every data migration has rollback, forward-fix, or explicit irreversible rationale.
```

## Phase 7: Strangler Or Rebuild

Choose the smallest safe option:

| Option | Use When |
|---|---|
| Wrapper | Public API is wrong but internals can remain. |
| Strangler | New path can run beside old path with routing control. |
| Extraction | A bounded context has stable contracts. |
| Rebuild | Current implementation cannot enforce required invariants. |

Rebuild requires:

- Compatibility contract.
- Data migration plan.
- Cutover plan.
- Rollback or forward-fix plan.
- Shadow-mode or comparison evidence when possible.

Gate:

```text
No rebuild starts until the old behavior is characterized enough to avoid accidental regressions.
```

## Phase 8: Governance Lock-In

After cleanup:

- Add static checks for fixed problems.
- Add regression tests for each high-risk defect.
- Add architecture decision records.
- Add public API diff checks.
- Add owner review for exceptions.
- Add dashboards for runtime risks.

Gate:

```text
The same class of defect cannot re-enter unnoticed.
```

## Brownfield Stop Conditions

Pause and redesign when:

- Tests are too weak to detect behavior change.
- Runtime state ownership is unknown.
- A migration risk cannot be bounded.
- Multiple processes own the same authoritative state.
- Public API usage cannot be inventoried.
- The team cannot explain restart behavior.
