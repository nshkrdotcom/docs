# Rollout Playbook

## Adoption strategy

Start with one high-value boundary, not the whole codebase.

Recommended first target:

```text
critical boundary process + capability check + protocol lifecycle + hot path cost envelope + telemetry contract
```

## Phase 1 — Observation only

- Define semantic IDs
- Add telemetry contracts
- Add runtime observer
- Do not fail CI yet
- Build baseline cost observations

## Phase 2 — Generated tests

- Add semantic type for one operation
- Generate ExUnit/StreamData tests
- Add known-good/known-bad examples
- Run in CI but allow failures as warnings

## Phase 3 — Mutation validation

- Add mutations
- Require kill score for selected types
- Promote type status to `trusted`

## Phase 4 — Enforced capability bundles

- Add patch-lens mapping
- Reject unauthorized patch scopes
- Require proof bundles for agent-generated changes

## Phase 5 — Enforced cost types

- Enable impacted benchmarks for hot paths
- Require calibration records for envelope changes
- Add runtime anomaly feedback loop

## Phase 6 — Expand semantic type library

Add more kinds:

- `ArtifactProtocol`
- `ProviderAdapter`
- `MemoryTierBoundary`
- `TransactionBoundary`
- `EventLogInvariant`
- `AccessGraphInvariant`

## Adoption anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Model everything at once | too much upfront work |
| Use prose-only invariants | not executable |
| Trust LLM-generated types immediately | bootstrap problem |
| Treat benchmarks as the whole cost type | misses structural resource violations |
| Make oracle reactive only | wastes agent cycles and permits bad search |
| Skip mutation testing | no proof checks catch bad classes |

## Success metrics

- number of trusted semantic types
- invariant mutation kill rate
- percentage of PRs with proof bundles
- mean time to produce valid oracle-guided patch
- number of runtime anomalies converted to type refinements
- reduction in architecture-violating AI patches
