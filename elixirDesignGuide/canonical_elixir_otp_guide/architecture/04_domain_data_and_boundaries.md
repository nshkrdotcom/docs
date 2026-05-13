# Domain Data And Boundaries

## Purpose

This document defines how to model data and boundaries before choosing OTP processes, database schemas, or web endpoints.

## Rule

```text
Domain structs express meaning.
Ecto schemas express persistence and validation boundaries.
GenServer state expresses runtime ownership.
API DTOs express external contracts.
```

These shapes may overlap, but they are not automatically the same thing.

## Data Categories

### Value Object

Use for immutable concepts where equality is value-based.

Examples:

- Money.
- Email.
- Date interval.
- Coordinates.
- Percentage.

Rules:

- Validate at construction.
- Make invalid states unrepresentable where practical.
- Keep persistence out.
- Keep external formatting out.

### Entity

Use for business objects with identity and lifecycle.

Examples:

- User.
- Account.
- Order.
- WorkflowRun.

Rules:

- Include identity.
- Define lifecycle transitions.
- Return expected business failures as data.
- Avoid direct Repo calls.

### Aggregate

Use for a consistency boundary around related entities.

Rules:

- Define what must change atomically.
- Define allowed commands.
- Emit events or effect requests.
- Avoid making aggregates span unrelated transactional concerns.

### Command

Use for requests to change the system.

Rules:

- Validate external shape at the boundary.
- Normalize into domain terms.
- Include idempotency key when duplicates are plausible.
- Keep command construction separate from execution.

### Event

Use for facts that happened.

Rules:

- Past tense.
- Immutable.
- Versioned when persisted or published.
- Include correlation identifiers.
- Include enough data for audit or projection.

### Read Model

Use for query-specific shapes.

Rules:

- Optimize for reads.
- Make rebuild path explicit.
- Do not put write invariants only in read models.

### Persistence Record

Use for database mapping.

Rules:

- Ecto schemas map persisted data.
- Changesets validate boundaries and cast input.
- Database constraints enforce race-sensitive rules.
- Do not assume table shape equals domain shape.

### Runtime State

Use for ephemeral process-owned data.

Rules:

- Declare owner.
- Declare recovery path.
- Declare whether it is authoritative or cached.
- Keep durable business facts out unless persisted.

## Boundary Types

### Domain Boundary

Separates bounded contexts.

Example:

```text
Orders may call Billing.authorize_payment/2.
Orders may not call Billing.Provider.Stripe.Client directly.
```

### Adapter Boundary

Separates external systems and SDKs from internal contracts.

Rules:

- External payloads stop at adapters.
- Normalize errors.
- Add timeouts.
- Add telemetry.
- Add redaction.
- Add idempotency where supported.

### Persistence Boundary

Separates domain operations from storage details.

Rules:

- Domain core should not know about Repo.
- Application services orchestrate persistence.
- Ecto schemas should not become god objects.

### Runtime Boundary

Separates process APIs from raw OTP messages.

Rules:

- Callers use public functions.
- Raw messages are internal.
- Message protocol is documented.
- Process names use stable APIs or Registry where needed.

## Boundary Graph

Maintain a graph:

```text
Web -> Accounts
Web -> Orders
Orders -> Billing
Orders -> Inventory
Billing -> PaymentProviderAdapter
Inventory -> Repo
Domain modules -> no effects
```

Each edge needs:

- Reason.
- Direction.
- Allowed operations.
- Payload shape.
- Error shape.
- Versioning policy if durable or external.

## Invariant Placement

Use the weakest sufficient mechanism:

| Invariant Type | Best Home |
|---|---|
| Pure deterministic rule | Constructor or pure transition. |
| Input shape | Boundary parser, embedded schema, or changeset. |
| Cross-record uniqueness | Database unique constraint plus changeset constraint. |
| Referential integrity | Database foreign key plus application validation. |
| Race-sensitive business rule | Transaction, lock, constraint, idempotency key, or process owner. |
| Long-running workflow state | Durable state plus job or supervised process. |
| External side-effect safety | Outbox, durable job, idempotency key, retry policy. |

## Module Organization

Recommended shape:

```text
lib/my_app/
  application.ex

  orders/
    orders.ex
    order.ex
    line_item.ex
    commands/
      place_order.ex
    events/
      order_placed.ex
    schemas/
      order_schema.ex
      order_event_schema.ex
    adapters/
      payment_gateway.ex

  runtime/
    task_supervisor.ex
    cache_owner.ex
```

`MyApp.Orders` is the public context API and may orchestrate effects. `MyApp.Orders.Order` should be pure unless there is an explicit exception.

## Public API Budget

Every public function should answer:

- Which contract requires this?
- Who calls it?
- What error shape does it return?
- Is it stable?
- Can it be private?

Public APIs become compatibility obligations. Keep them small.

## Framework Mapping: Ash

Ash is an optional application-layer framework that can encode many of this guide's boundaries declaratively. Using Ash does not remove the need for architecture review; it changes where the review looks.

Map concepts explicitly:

| Guide Concept | Ash Concept |
|---|---|
| Bounded context / public API | Ash Domain and generated/code interfaces. |
| Entity or persistence-backed resource | Ash Resource. |
| Command or query capability | Ash Action. |
| Input contract | Action arguments, accepted attributes, validations. |
| Authorization boundary | Ash policies and actor context. |
| Persistence boundary | Data layer, commonly AshPostgres. |
| Effect hook | Action lifecycle hook, notifier, job, or explicit application service. |

Rules:

- Name Ash actions after business capabilities, not only CRUD verbs, when domain behavior matters.
- Treat generated APIs as public contracts if callers depend on them.
- Keep provider SDK structs, raw web params, and external payloads out of resources unless the resource is explicitly an adapter or integration record.
- Review policy changes as authorization changes.
- Review action lifecycle hooks for transaction boundaries and external effects.
- Use outbox/jobs for irreversible external effects; do not hide provider mutation inside a resource hook without idempotency and recovery.
- Keep custom pure domain modules when behavior is clearer outside the resource DSL.

Ash adoption is an architecture decision. Record why it is being used, which guide responsibilities it enforces, and where application-specific checks still live.

## Anti-Patterns

### One Schema For Everything

Symptoms:

- Controller params are cast directly into database schema.
- UI form state leaks into domain.
- Reporting queries depend on write schema internals.

Repair:

- Add input DTOs or embedded schemas.
- Add domain structs.
- Add read models.

### Context Boundary Bypass

Symptoms:

- Web code calls `Repo` for business operations.
- Another context calls internal schema modules.
- External adapter structs appear in domain state.

Repair:

- Create public context APIs.
- Move translation to adapter boundary.
- Add boundary checks or review gates.

### Runtime State As Domain Model

Symptoms:

- Business facts live only in GenServer state.
- Restart loses user-visible state.
- Process state is queried for reports.

Repair:

- Persist authoritative facts.
- Treat process state as cache, lock, session, or workflow runner.

## Review Checklist

- [ ] Every data shape is classified.
- [ ] Every boundary edge is declared.
- [ ] External payloads are translated at boundaries.
- [ ] Race-sensitive invariants have authoritative enforcement.
- [ ] Public APIs map to contracts.
- [ ] Runtime state has owner and recovery path.
- [ ] Framework abstractions such as Ash map cleanly to domain, boundary, policy, persistence, and effect responsibilities.
