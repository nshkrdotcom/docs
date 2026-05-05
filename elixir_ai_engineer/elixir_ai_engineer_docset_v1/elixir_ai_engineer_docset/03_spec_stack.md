# 03 — The Spec Stack: From Intent to Code Without Slop

## Why a stack exists

The jump from requirements to code is too large.

```text
loose intent → AI code
```

This is where the model invents architecture.

The Spec Stack inserts intermediate representations that are precise enough to constrain implementation but not so formal that the project dies in theory.

## The layers

```text
0. Charter
1. Capability Map
2. Domain Model
3. Boundary Graph
4. Contracts
5. State / Protocol Model
6. Effect / Governance Model
7. Runtime / OTP Topology
8. Implementation Plan
9. Code
10. Runtime Evidence
```

## Layer 0 — Charter

The constitution. Small, stable, human-owned.

Example invariants:

```text
- Every governed operation carries ExecutionContext.
- No untrusted execution environment receives raw credential material.
- No new process exists without state/lifecycle justification.
- No external effect occurs without an effect declaration.
- No public operation exists without a contract.
- Lower layers may narrow authority but never widen it silently.
```

## Layer 1 — Capability Map

Answers:

```text
What must the system be able to do?
```

Example:

```text
- create governed session
- issue credential lease
- invoke provider connector
- revoke capability
- audit external effect
- spawn supervised worker
```

Capabilities are not implementation modules. They are user/system powers.

## Layer 2 — Domain Model

Answers:

```text
What are the nouns?
```

Every lower-tier artifact must use these names or declare a child entity.

Example entities:

```text
Tenant, Principal, Session, Actor, ExecutionContext, Capability,
CredentialHandle, CredentialLease, Connector, Sandbox, AuditEvent,
AccessGraphEdge, PiToken, SpecCell.
```

Invented domain terms are flagged as drift.

## Layer 3 — Boundary Graph

Answers:

```text
What components exist, and what may cross between them?
```

Example components:

```text
SpecCompiler
SessionFabric
CapabilityFabric
CredentialFabric
ConnectorFabric
ExecutionPlane
TelemetryAuditPlane
StackLab
```

Edges are explicit:

```yaml
edge: CredentialFabric -> ConnectorFabric
operation: authorize_redemption
carries:
  - CredentialLease
  - ExecutionContext
requires:
  - lease.redeemable_by == connector_id
emits:
  - RedemptionAuthorization
```

## Layer 4 — Contracts

Answers:

```text
What operations exist, what inputs/outputs/errors do they have, and what must remain true?
```

Example:

```yaml
operation: issue_credential_lease
input:
  context: ExecutionContext
  operation: Operation
  resource: ResourceRef
  connector_id: ConnectorId
output:
  ok: CredentialLease
  error:
    - missing_identity
    - capability_denied
    - access_graph_denied
    - connector_not_authorized
preserves:
  - tenant_isolation
  - no_raw_secret_exposure
```

## Layer 5 — State / Protocol Model

Answers:

```text
What states can exist and which transitions are legal or forbidden?
```

Example:

```text
CredentialLease:
  Requested -> PolicyChecked -> Issued -> Redeemed -> Used -> Audited
  Issued -> Revoked

Forbidden:
  Issued -> RedeemedByWrongConnector
  Issued -> SecretMaterialReturnedToAgent
  Used -> AuditMissing
```

## Layer 6 — Effect / Governance Model

Answers:

```text
What authority is consumed, delegated, produced, or revoked?
```

Every external effect is declared:

```text
network call
file write
process spawn
credential materialization
sandbox creation
database mutation
provider API invocation
```

Undeclared effects fail audit.

## Layer 7 — Runtime / OTP Topology

Answers:

```text
Which processes exist, who supervises them, what state do they own, and what happens on crash?
```

Example:

```yaml
runtime:
  component: CredentialFabric
  supervisor: CredentialFabric.Supervisor
  children:
    - CredentialAuthority
    - LeaseRegistry
    - RevocationIndex
    - MaterializerSupervisor
  state_rules:
    raw_secret_material:
      allowed_in:
        - MaterializerWorker.process_memory
      forbidden_in:
        - AgentSession.state
        - Sandbox.env
        - logs
        - telemetry
```

## Layer 8 — Implementation Plan

Answers:

```text
What files/modules/tests should exist?
```

Generated from the upper layers.

It contains:

```text
- modules
- module kind
- public functions
- private support functions
- test obligations
- traceability links
- forbidden implementation choices
```

## Layer 9 — Code

Code is downstream.

A code artifact that cannot explain what spec fragment caused it to exist is suspicious.

## Layer 10 — Runtime Evidence

Answers:

```text
Did the running system preserve the spec under stress?
```

Includes:

```text
unit tests
property tests
state-machine tests
fault injection
adversarial tests
telemetry evidence
audit queries
```

## Refinement relation

The relation is not bijection.

The relation is:

```text
Every lower artifact is an admissible projection of an upper artifact under declared lowering rules.
```

This is close enough to be useful and honest enough to be buildable.
