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

- Own interactive UI state.
- Call context APIs.
- Subscribe to PubSub where appropriate.
- Use assigns as presentation state.
- Use streams or temporary assigns for large/changing collections.
- Use `assign_async` or `start_async` for bounded async loading tied to the LiveView lifetime.
- Keep URL params, session, or durable storage as the recovery source for user-visible state when refresh/reconnect matters.

LiveView should not:

- Become domain state authority.
- Hide business transitions in `handle_event`, `handle_info`, or `handle_async`.
- Call Repo for domain writes.
- Start unmanaged processes.
- Subscribe every connected user to broad topics without fanout and payload budgeting.

LiveView is a process. That makes it a runtime boundary, but usually not a domain runtime owner. Treat socket assigns as presentation cache unless the design explicitly proves otherwise.

### LiveView State Classification

Classify each assign:

| Assign Type | Use For | Recovery |
|---|---|---|
| Presentation state | Filters, selected tab, open modal, local form state. | URL params, session, or harmless reset. |
| Derived read state | Loaded rows, counts, dashboard data. | Re-query context API or projection. |
| Async result state | Loading/error/result wrapper for a bounded async operation. | Restart async operation or display retry. |
| Stream state | Large collections rendered incrementally. | Rebuild stream from context query or event. |
| Durable business fact | Order status, payment state, workflow progress. | Must not live only in assigns. Persist elsewhere. |

Rules:

- Assigns may cache durable facts for rendering, but may not be the authoritative copy.
- Form changesets are UI validation state; final writes still go through context APIs.
- If a LiveView crash or reconnect would lose user-visible business progress, persist or checkpoint that progress outside the LiveView.

### LiveView Callback Policy

`handle_event/3` should:

- Parse event intent.
- Call context APIs or local presentation helpers.
- Assign result state.
- Avoid business case trees.

`handle_info/2` should:

- Accept documented messages only.
- Treat PubSub messages as notifications.
- Re-query authoritative state when payload freshness or authorization matters.
- Drop, coalesce, or rate-limit noisy updates.

`handle_async/3` should:

- Update loading/result/error assigns.
- Avoid starting follow-on unbounded work.
- Translate failures into UI state or let unexpected faults crash according to policy.

### PubSub And Fanout

PubSub is appropriate for UI notification, cache invalidation, and local real-time updates. It is not a durable event log.

For every LiveView subscription define:

- Topic shape.
- Tenant/account/resource scope.
- Payload version.
- Maximum expected subscriber count.
- Payload size budget.
- Missed-message recovery path.
- Authorization or topic access rule.
- Whether the LiveView re-queries after notification.

Avoid:

- Broadcasting whole Ecto schemas or large lists.
- One global topic for all tenants.
- Treating PubSub delivery as confirmation that a business event was processed.
- High-frequency fanout without coalescing, throttling, or a read-model strategy.

For very large fanout, review Phoenix PubSub adapter/pool configuration, custom dispatching needs, payload encoding cost, and rollout safety.

### Components

Function components are pure rendering functions and should be preferred for markup decomposition.

LiveComponents run in the parent LiveView process. Use them for encapsulated UI state and event handling, but do not assume they create isolation from parent mailbox, memory, or crash behavior.

Nested LiveViews start separate processes. Use them only when process isolation, independent lifecycle, or sticky behavior is actually needed.

### LiveView Async Work

Use LiveView async helpers when:

- The work is bounded.
- The result is only needed by the LiveView.
- Cancellation when the user leaves is correct.
- Failure can be represented as UI state.

Use context APIs, jobs, or supervised workers instead when:

- Work must continue after navigation.
- Work mutates external systems.
- Work must retry durably.
- Work is shared by many users.

### Eventual Consistency In The UI

When a LiveView command delegates to a durable job or outbox path, the UI needs an explicit coordination contract.

Pattern:

```text
1. User submits command.
2. LiveView calls context API.
3. Context writes durable state/job/outbox and returns command_id or resource_id.
4. LiveView assigns pending state keyed by command_id/resource_id.
5. Worker completes effect and publishes scoped notification.
6. LiveView receives notification, re-queries authoritative state, clears pending state.
```

Use optimistic UI only when:

- The optimistic state is reversible.
- Failure can be shown clearly.
- The user cannot observe a false durable fact as confirmed.
- Duplicate completion messages are harmless.

Use pending UI when:

- External provider confirmation matters.
- Payment, email, webhook, or workflow completion may fail.
- Authorization or state can change after submission.

Pending-state assign example:

```elixir
socket
|> assign(:pending_commands, Map.put(socket.assigns.pending_commands, command_id, :payment_capture))
```

Completion message rules:

- Include tenant/resource scope.
- Include correlation or command ID.
- Include payload version when durable or cross-node.
- Prefer compact event payload plus re-query over large state payload.
- Treat duplicate or stale completion as normal.

Avoid:

- Clearing pending state based only on job enqueue success.
- Broadcasting provider secrets or raw response payloads.
- Blocking the LiveView process while waiting for durable job completion.
- Assuming PubSub delivery is guaranteed.

### LiveView Tests

LiveView tests should cover:

- Event handling through rendered UI.
- Authorization and tenant-scoped topics.
- PubSub notification handling.
- Reconnect or remount recovery when state matters.
- Async loading success and failure.
- Pending state for durable jobs/outbox effects.
- PubSub completion and failure notifications.
- Duplicate or stale completion messages.
- Large-list rendering through streams or pagination.

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
- [ ] LiveView assigns, PubSub subscriptions, async work, and recovery paths are classified.
