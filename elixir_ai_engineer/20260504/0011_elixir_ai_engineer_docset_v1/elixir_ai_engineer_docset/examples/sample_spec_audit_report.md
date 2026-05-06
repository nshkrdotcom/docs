# Sample `mix spec.audit` Report

```yaml
project: credential_fabric_mvp
commit: abc123
spec_version: 0.1.0
policy_version: enf_policy_0.1.0
```

## Verdict

```text
REJECTED
```

## Critical violations

### 1. Undeclared external effect

```yaml
rule: UndeclaredExternalEffect
file: lib/credential_fabric/provider_key_resolver.ex
module: CredentialFabric.ProviderKeyResolver
function: fetch/1
evidence:
  - calls System.get_env/1
  - module kind is not Materializer or SecretBackend
recommendation:
  - move env access to CredentialFabric.SecretBackend.LocalDev
  - declare local_dev_secret_fetch effect if needed
```

### 2. Public function without contract

```yaml
rule: PublicFunctionWithoutContract
file: lib/credential_fabric/lease_registry.ex
module: CredentialFabric.LeaseRegistry
function: lookup/1
recommendation:
  - make private or add contract to credential_fabric spec
```

## Warnings

### Single-implementation behaviour

```yaml
rule: SingleImplementationBehaviour
behaviour: CredentialFabric.SecretBackend
implementations:
  - CredentialFabric.SecretBackend.LocalDev
recommendation:
  - keep only if declared as production seam
  - otherwise collapse until second backend exists
```

## Compression candidates

| Artifact | Reason | Suggested action |
|---|---|---|
| CredentialLeaseValidator | one public function, one caller | inline into CredentialFabric.Lease |
| ProviderKeyResolver | external effect in wrong boundary | move to SecretBackend.LocalDev |
| SecretBackend behaviour | one implementation | collapse or declare seam |

## Next action

Fix critical violations, then run:

```bash
mix spec.accept
```
