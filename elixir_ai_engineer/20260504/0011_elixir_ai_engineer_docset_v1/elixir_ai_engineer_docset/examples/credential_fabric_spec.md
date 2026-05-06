# Example Spec: Credential Fabric MVP

```yaml
id: credential_fabric
kind: subsystem
status: draft
```

## Purpose

The Credential Fabric governs credentialed external effects. It decides when an operation may obtain credentialed authority and ensures raw secret material is materialized only at trusted connector boundaries.

## Invariants

- No untrusted actor receives raw credential material.
- No credentialed effect occurs without `ExecutionContext`.
- No credentialed effect occurs without `CredentialLease`.
- A lease is redeemable only by its named connector.
- Expired or revoked leases cannot be redeemed.
- Every provider invocation emits an audit event.

## Entities

```yaml
entities:
  - ExecutionContext
  - CredentialHandle
  - CredentialLease
  - LeaseId
  - ConnectorId
  - Operation
  - ResourceRef
  - RevocationEpoch
  - AuditEvent
```

## Operation: issue_credential_lease

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
    - connector_not_authorized
    - credential_not_found
    - revoked
requires:
  - context.tenant_id
  - context.session_id
  - context.actor_id
  - context.capability_set_id
preserves:
  - tenant_isolation
  - no_raw_secret_exposure
  - connector_redeemability
```

## Operation: redeem_credential_lease

```yaml
operation: redeem_credential_lease
input:
  context: ExecutionContext
  lease: CredentialLease
  connector_id: ConnectorId
output:
  ok: RedemptionAuthorization
  error:
    - wrong_connector
    - expired
    - revoked
    - missing_context
preserves:
  - no_agent_secret_exposure
  - auditability
```

## CredentialLease lifecycle

```yaml
states:
  - requested
  - issued
  - redeemed
  - used
  - audited
  - expired
  - revoked
transitions:
  - requested -> issued
  - issued -> redeemed
  - redeemed -> used
  - used -> audited
  - issued -> expired
  - issued -> revoked
forbidden_transitions:
  - issued -> redeemed_by_wrong_connector
  - issued -> secret_material_returned_to_agent
  - used -> audit_missing
```

## Runtime shape

```yaml
components:
  CredentialFabric.Lease:
    kind: PureDomainModule
  CredentialFabric.LeaseIssuer:
    kind: PureDomainModule
  CredentialFabric.LeaseRegistry:
    kind: StatefulProcess
    reason:
      - active lease state
      - revocation epoch index
  CredentialFabric.Materializer.LocalDev:
    kind: Materializer
```

## Test obligations

```yaml
unit:
  - issue lease with valid context
  - reject missing context
  - reject wrong connector
property:
  - revoked lease can never be redeemed
  - expired lease can never be redeemed
adversarial:
  - agent env contains no secret
  - logs contain no secret
  - wrong connector cannot redeem
```
