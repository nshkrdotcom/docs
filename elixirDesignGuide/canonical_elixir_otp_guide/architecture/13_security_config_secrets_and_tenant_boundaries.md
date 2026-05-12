# Security, Config, Secrets, And Tenant Boundaries

## Purpose

This document defines security and configuration rules for production Elixir/OTP applications.

## Runtime Config Rule

```text
Production runtime behavior must not depend on compile-time environment reads.
```

Avoid in `lib/` runtime code:

- `Mix.env/0`
- `System.get_env/1` at module body
- `Application.compile_env/3` for values that change per environment

Prefer:

- Runtime config in `config/runtime.exs`.
- Validated config structs.
- Explicit dependency injection.
- Materializer modules that isolate config reading.

## Secrets

Secrets must not appear in:

- Logs.
- Telemetry metadata.
- Error tuples.
- Crash dumps where avoidable.
- Inspect output.
- Test fixtures committed to repo.
- Process state dumps exposed through debug APIs.

Use:

- Redacted structs.
- Secret wrappers with safe `Inspect`.
- Credential leases or short-lived tokens.
- Runtime secret providers.

## Tenant And Session Boundaries

Every operation should know:

- Actor.
- Tenant/account.
- Resource.
- Authorization decision.
- Correlation ID.

Rules:

- Tenant ID is not optional in multi-tenant data paths.
- Queries include tenant scope.
- Background jobs include tenant scope.
- PubSub topics include tenant scope where needed.
- Cache keys include tenant scope.
- Telemetry avoids leaking tenant-sensitive payloads.

## Unsafe Atoms

Never use `String.to_atom/1` on untrusted input.

Use:

- Explicit parser.
- Map lookup.
- `String.to_existing_atom/1` only for trusted bounded vocabulary.

## Unsafe Deserialization

Avoid `:erlang.binary_to_term/1` on untrusted data.

If required for trusted internal data:

- Use safe options where applicable.
- Version payload.
- Authenticate source.
- Validate decoded shape.
- Document exception.

## Runtime Evaluation

Avoid:

- `Code.eval_string/1`
- `Code.eval_file/1`
- Dynamic module creation from user input.
- Runtime compilation from untrusted payloads.

If dynamic policy is required, use a constrained policy language or validated expression model.

## Shell And File Access

Avoid:

- `:os.cmd/1`
- `System.cmd/3` with shell interpolation.
- Unbounded file reads from user paths.

Use:

- `System.cmd/3` with argument list.
- Allowlisted commands.
- Explicit working directories.
- Timeouts.
- Output limits.
- Path normalization and sandboxing.

## Authorization Around Effects

External effects require authorization:

- Who requested it?
- Which capability permits it?
- Which resource is affected?
- Is it auditable?
- Can it be replayed?
- Can it be revoked?

Do not let background workers perform effects without carrying authorization context or an approved service authority.

## Security Testing

Test:

- Tenant boundary bypass.
- Secret redaction in logs and errors.
- Unsafe atom creation.
- Invalid payload rejection.
- Authorization failure.
- Job replay under old permissions.
- External adapter timeout and error redaction.

## Review Checklist

- [ ] Runtime config is release-safe.
- [ ] Secrets are redacted across logs, telemetry, errors, and inspect.
- [ ] Tenant scope is enforced in data, jobs, cache, and PubSub.
- [ ] Unsafe atom, eval, shell, and deserialization paths are absent or waived.
- [ ] Effects carry authorization/audit context.
- [ ] Security tests cover failure and rejection paths.

