# Control Oracle and Intervention Graph

## The core idea

Architecture is not primarily about what the system is.

It is about what changes the system can survive.

The Living Substrate v2 therefore adds an **InterventionGraph** and **Control Oracle** on top of the semantic graph.

## Intervention

An intervention is an intended change to the system.

Examples:

```text
add feature
fix bug
replace backend
enforce policy
optimize hot path
remove subsystem
change protocol
migrate data
recover from failure
scale traffic
upgrade dependency
```

Each intervention records:

```yaml
intervention:
  id:
  kind:
  intent:
  requested_by:
  capability_bundle:
  expected_scope:
  expected_files:
  expected_components:
  forbidden_scope:
  proof_obligations:
  rollback_path:
  risk_class:
```

After execution, the actual intervention records:

```yaml
actual:
  files_touched:
  components_touched:
  semantic_types_changed:
  effects_added:
  tests_added:
  mutants_killed:
  evidence_result:
  prediction_error:
  rollback_complexity:
  accepted:
```

## Control Oracle

The Control Oracle answers:

```text
Given this current system state and desired intervention,
what safe steering path should be used?
```

It uses:

```text
Program Semantic Graph
Architecture Capsule Graph
Historical Change Graph
Runtime Observation Graph
InterventionGraph
AccessGraph
EvidenceGraph
```

## Why this matters

A Type Oracle says:

```text
Is this term or patch valid under a semantic type?
```

A Control Oracle says:

```text
What change path should we take so the system remains steerable?
```

That is a higher-order question.

## Example

Intent:

```text
Refine SessionPool checkout timeout behavior.
```

Bad intervention shape:

```text
rewrite global capability derivation
change SessionProtocol lifecycle
spawn unsupervised worker
replace Registry architecture
```

Good intervention shape:

```text
local SessionPool timeout classification
bounded retry policy
telemetry around timeout branch
property test for eventual checkin
mutation test for missing capability check
```

The Control Oracle should route the work into the good shape before any patch is generated.

## Success metric

The intervention system works when expected changes are:

```text
local
predictable
low prediction-error
bounded in files/components touched
covered by proof obligations
observable in telemetry/evidence
reversible without global migration
```
