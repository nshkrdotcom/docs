# 14 — Mix Tasks and Tooling

## Start with three tasks

```bash
mix spec.audit
mix spec.bundle
mix spec.accept
```

Do not start with automatic code generation.

## `mix spec.audit`

Reads:

```text
spec/
lib/
test/
```

Outputs:

```text
- implementation graph
- slop report
- spec drift report
- ENF violations
- missing traceability
```

### First five checks

```text
1. GenServer without state-ownership justification.
2. Behaviour with only one implementation.
3. Public function not traceable to a spec contract.
4. External effect not declared in the spec.
5. Domain term not present in the domain model.
```

### Example output

```text
REJECTED: lib/credential_fabric/provider_key_resolver.ex

Violations:
- System.get_env/1 used outside Materializer boundary.
- Module name ProviderKeyResolver introduces undeclared term ProviderKey.
- Public function fetch/1 has no contract.

Suggested action:
- Move environment access to CredentialFabric.SecretBackend.LocalDev.
- Declare CredentialHandle/CredentialMaterial terms if required.
```

## `mix spec.bundle`

Generates a context bundle for a coding agent.

Example:

```bash
mix spec.bundle credential_fabric.issue_credential_lease
```

Outputs:

```text
tmp/context_bundles/credential_fabric.issue_credential_lease.md
```

Includes:

```text
- relevant SpecCell
- inherited invariants
- domain dictionary
- contract
- state machine fragment
- effect declarations
- ENF policy subset
- existing implementation graph summary
- allowed files
- forbidden inventions
- required tests
```

## `mix spec.accept`

Runs acceptance gate.

Default pipeline:

```bash
mix format --check-formatted
mix compile --warnings-as-errors
mix test
mix credo --strict
mix spec.audit
```

Later:

```bash
mix dialyzer
mix spec.property
mix spec.fault
mix spec.compress
mix spec.traceability
```

## Later tasks

```bash
mix spec.extract       # produce ImplementationGraph JSON
mix spec.trace        # traceability matrix
mix spec.compress     # compression challenge
mix spec.normalize    # safe rewrites
mix spec.watch        # live reverse extraction
mix spec.benchmark    # run local task benchmark suite
mix spec.gen          # deterministic skeleton generation
```

## Implementation note

Use Elixir AST first:

```elixir
{:ok, ast} = Code.string_to_quoted(source)
Macro.prewalk(ast, acc, fn node, acc -> ... end)
```

The first implementation can be simple and conservative.

False positives are acceptable if the report is useful and tunable.

## Avoid early overbuild

Do not implement:

```text
- full graph database
- full code generation
- multi-agent orchestration
- formal verification
- e-graphs
```

until `spec.audit` produces clear value on real AI-generated code.
