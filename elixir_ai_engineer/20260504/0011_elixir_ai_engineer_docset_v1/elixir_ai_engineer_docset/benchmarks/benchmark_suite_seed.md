# Benchmark Suite Seed

## Goal

Create a local benchmark suite to compare:

```text
naive AI generation
vs
spec-bundled generation
vs
spec-bundled + ENF audit
vs
spec-bundled + ENF audit + normalizer
```

## Seed tasks

1. Pure reducer for credential lease expiry.
2. Credential lease wrong-connector rejection.
3. ExecutionContext propagation through connector call.
4. Stateful LeaseRegistry with revocation epoch.
5. Remove unnecessary GenServer from stateless validator.
6. Collapse single-implementation behaviour.
7. Detect undeclared System.get_env/1 effect.
8. Generate state machine tests for lease lifecycle.
9. Prevent raw secret in agent-visible output.
10. Compression challenge for bloated provider adapter.

## Metrics

```text
compile pass
test pass
property pass
ENF violations
LOC
module count
public function count
process count
behaviour count
frontier model calls
normalization delta
human review defects
```

## Report format

```yaml
task:
naive:
  accepted: false
  enf_violations: []
  loc:
  modules:
harness:
  accepted: true
  enf_violations: []
  loc:
  modules:
delta:
  loc_reduction:
  module_reduction:
  process_reduction:
```
