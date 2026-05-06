# 04 — Fractal SpecCells

## Why SpecCells

Large systems cannot be specified as one giant document.

They need a recursive unit that works at every scale:

```text
ecosystem → subsystem → component → process → operation
```

That unit is the **SpecCell**.

## Definition

A SpecCell is a structured hybrid artifact containing prose, parseable declarations, and test obligations.

```text
SpecCell
├── identity
├── purpose
├── inherited charter constraints
├── domain references
├── boundaries
├── interfaces
├── state
├── mutations
├── protocols
├── effects
├── capabilities
├── concurrency model
├── failure modes
├── observability
├── test obligations
├── lowering hints
└── traceability links
```

## SpecCell scale examples

| Scale | Example SpecCell |
|---|---|
| Ecosystem | AI Governance Platform |
| Subsystem | Credential Fabric |
| Component | Lease Registry |
| Process | CredentialFabric.LeaseRegistry GenServer |
| Operation | `redeem_credential_lease` |
| Test obligation | wrong connector cannot redeem lease |

## SpecCell fields

### Identity

```yaml
id: credential_fabric.lease_registry
name: Credential Lease Registry
kind: component
parent: credential_fabric
```

### Purpose

Human-readable explanation:

```text
The Lease Registry stores active credential leases, indexes revocation epochs,
and answers redemption eligibility queries without exposing secret material.
```

### Domain references

```yaml
entities:
  - CredentialLease
  - LeaseId
  - ConnectorId
  - ExecutionContext
  - RevocationEpoch
```

If a lower artifact uses `ProviderSessionLease` and that term is not declared, the system flags drift.

### Boundary

```yaml
boundary:
  owns:
    - active_lease_index
    - revocation_epoch_index
  may_call:
    - AuditSink
  may_not_call:
    - SecretBackend
    - ProviderAPI
    - AgentSandbox
```

### Interfaces

```yaml
operations:
  - issue
  - lookup
  - redeem
  - revoke
  - expire
```

### State

```yaml
state:
  active_leases: map(LeaseId, CredentialLease)
  revocation_epochs: map(ContextKey, non_neg_integer)
```

### Protocols

```yaml
state_machine:
  states:
    - empty
    - active
    - revoking
  transitions:
    - empty -> active: issue
    - active -> active: issue
    - active -> revoking: revoke_context
    - revoking -> active: cleanup_complete
```

### Effects

```yaml
effects:
  external: []
  internal:
    - emit_audit_event
    - emit_telemetry_event
  forbidden:
    - read_secret_material
    - network_call
    - spawn_process
```

### Capabilities

```yaml
requires:
  - capability: credential.lease.issue
  - capability: credential.lease.redeem
```

### Concurrency model

```yaml
runtime_shape: StatefulProcess
message_model:
  default: call
  cast_allowed: false
backpressure: synchronous_call
```

### Failure modes

```yaml
failure_modes:
  - expired_lease
  - revoked_context
  - connector_mismatch
  - missing_audit_sink
```

### Observability

```yaml
telemetry:
  - [:credential_fabric, :lease, :issued]
  - [:credential_fabric, :lease, :redeemed]
  - [:credential_fabric, :lease, :revoked]
```

### Test obligations

```yaml
tests:
  - wrong_connector_cannot_redeem
  - expired_lease_cannot_redeem
  - revoked_context_cannot_redeem
  - redemption_emits_audit_event
  - no_secret_material_in_state
```

### Lowering hints

```yaml
implementation:
  preferred_module_kind: StatefulProcess
  max_modules: 3
  max_public_functions: 12
  forbid:
    - BehaviourUnlessMultipleImplementations
    - SecretBackendAccess
```

## SpecCell monotonicity

Children may narrow constraints. Children may not widen authority silently.

If parent says:

```text
No raw credential material outside trusted materializers.
```

A child may say:

```text
This child never touches secret material.
```

A child may not say:

```text
This child temporarily stores secrets in AgentSession state.
```

## Why this helps AI

The model no longer has to infer project physics from prose.

It receives a local cell with:

```text
- exact nouns
- exact operations
- exact state
- exact effects
- exact runtime shape
- exact forbidden choices
- exact tests
```

Coding becomes a bounded fill task rather than architecture invention.
