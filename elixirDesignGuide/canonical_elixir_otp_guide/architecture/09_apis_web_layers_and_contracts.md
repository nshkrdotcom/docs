# APIs, Web Layers, And Contracts

## Purpose

This document defines how Phoenix layers, public context APIs, DTOs, external adapters, and versioned contracts should interact.

## Layer Rule

```text
Web translates.
Context orchestrates.
Domain decides.
Adapters isolate external systems.
```

## Phoenix Controllers

Controllers should:

- Authenticate and authorize.
- Parse request shape.
- Call context APIs.
- Translate results to HTTP responses.
- Avoid business logic.
- Avoid direct Repo calls for business operations.

Controller should not:

- Build aggregates directly.
- Call internal schema modules from other contexts.
- Call external provider SDKs.
- Perform long-running work inline.

## LiveView

LiveView should:

- Own UI state.
- Call context APIs.
- Subscribe to PubSub where appropriate.
- Use assign state as presentation state.

LiveView should not:

- Become domain state authority.
- Hide business transitions in event handlers.
- Call Repo for domain writes.
- Start unmanaged processes.

## DTOs And Input Validation

Use DTOs or embedded schemas for external input.

Rules:

- Validate external shape at the boundary.
- Convert strings to bounded internal values safely.
- Do not create atoms from untrusted input.
- Normalize provider-specific fields.
- Preserve raw payload only if audit requires it and it is redacted.

## Public Context APIs

Public APIs should be stable and small.

Each public function declares:

- Inputs.
- Outputs.
- Expected errors.
- Side effects.
- Transaction behavior.
- Telemetry event.
- Authorization requirement where applicable.

Example:

```elixir
@spec place_order(actor(), PlaceOrder.t()) ::
        {:ok, OrderReceipt.t()} | {:error, place_order_error()}
```

## Behaviors

Use behaviors for real seams:

- External client adapter.
- Storage backend.
- Runtime provider.
- Policy evaluator.

Avoid behaviors when:

- There is one implementation and no near-term second implementation.
- The behavior merely mirrors one concrete module.
- The abstraction hides unclear design.

If a one-implementation behavior is kept, record why.

## Consumer Contracts

For internal Elixir boundaries:

- Define behavior callbacks where dynamic implementation matters.
- Use tests against both mock and real implementation.
- Use contract tests for adapters.

For external boundaries:

- Version payloads.
- Use OpenAPI, protobuf, JSON schema, Pact, or explicit fixtures as appropriate.
- Test old and new payloads.
- Record compatibility windows.

## Versioning

Version when payloads are:

- Persisted.
- Published.
- Sent across services.
- Sent across nodes during rolling upgrade.
- Consumed by external clients.

Rules:

- Add new fields compatibly.
- Keep old decoders.
- Do not remove fields until compatibility window ends.
- Record semantic changes, not only structural changes.

## External SDK Boundaries

Provider SDK structs must not leak into domain core.

Adapter should:

- Accept internal request.
- Convert to provider request.
- Apply timeout.
- Apply retry policy only where safe.
- Convert provider response.
- Convert provider error.
- Emit telemetry.
- Redact secrets.

## API Compatibility Review

Before changing public API:

- Diff exported functions.
- Identify consumers.
- Identify behavior callback changes.
- Identify payload compatibility.
- Add deprecation path where needed.
- Update contract tests.

## Review Checklist

- [ ] Web layer only translates and delegates.
- [ ] Context API owns orchestration.
- [ ] Domain core has no web/provider payloads.
- [ ] DTOs validate and normalize external input.
- [ ] Public API surface is justified.
- [ ] Contracts are versioned where durable or external.

