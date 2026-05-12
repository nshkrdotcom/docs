# Persistence, Transactions, And Effects

## Purpose

This document defines how to design persistence, transactions, durable effects, Ecto usage, migrations, and data repair for large Elixir applications.

## Ecto Schema Rule

```text
Ecto schemas map data.
They are not automatically domain aggregates.
```

Use separate shapes when needed:

- Input DTO.
- Domain struct.
- Persistence schema.
- Read model.
- Event schema.
- External payload.

## Changesets And Constraints

Changeset validations run before the database. Database constraints enforce truth under concurrency.

Use validations for:

- Required fields.
- Format.
- Length.
- Enum inclusion.
- Basic cross-field checks that do not require concurrent authority.

Use constraints for:

- Uniqueness.
- Foreign keys.
- Exclusion constraints.
- Check constraints.
- Race-sensitive invariants.

Pattern:

```elixir
schema
|> changeset(attrs)
|> unique_constraint(:idempotency_key)
|> foreign_key_constraint(:customer_id)
```

## Transactions

Use `Ecto.Multi` or explicit transactions when multiple changes must commit together.

Good transaction contents:

- Load authoritative rows.
- Lock when needed.
- Validate domain transition.
- Write business state.
- Write events or outbox rows.

Avoid inside transactions:

- Sending email.
- Calling payment provider.
- Calling webhooks.
- Publishing non-transactional messages.
- Long-running HTTP calls.

## Outbox Pattern

Use outbox for irreversible or externally visible effects.

Flow:

```text
transaction:
  write business state
  write outbox row

after commit:
  worker reads outbox
  delivers effect idempotently
  records success/failure
```

Outbox row should include:

- Event/effect type.
- Payload version.
- Idempotency key.
- Correlation ID.
- Tenant/account ID where relevant.
- Attempt count.
- Next attempt time.
- Last error summary.

## Idempotency

Every command that can be retried needs idempotency.

Options:

- Client-provided idempotency key.
- Natural key.
- Unique database constraint.
- Provider idempotency key.
- Dedupe table.
- Durable command log.

Rules:

- Return prior result for duplicate command when possible.
- Make duplicate effect delivery harmless.
- Store enough state to distinguish duplicate from conflict.

## Locks And Serialization

Use locks when database authority is the correct serialization point.

Options:

- Row locks.
- Advisory locks.
- Unique constraints.
- Optimistic locking.
- Dedicated process owner for runtime-only serialization.

Do not use a GenServer as a database consistency substitute unless:

- The process is the explicit serialization owner.
- It is supervised.
- It persists enough state.
- It works under clustering or is intentionally single-node.

## Read Models

Use read models when:

- Query shape differs from write shape.
- Reporting would burden write schema.
- UI requires denormalized projections.
- Rebuild is possible.

Read model rules:

- Source of truth is declared.
- Projection lag is acceptable and documented.
- Rebuild command exists for important projections.
- Consumers understand staleness.

## Migrations

Zero-downtime migration pattern:

1. Add nullable column/table/index concurrently where possible.
2. Deploy code that writes both old and new shape if needed.
3. Backfill.
4. Deploy code that reads new shape.
5. Stop writing old shape.
6. Remove old shape after compatibility window.

Avoid:

- Table-locking changes during traffic.
- Renaming columns without compatibility.
- Dropping columns immediately.
- Adding non-null columns without safe default/backfill plan.
- Long data migrations in schema migration transaction.

## Data Repair

Data repair needs:

- Source query.
- Target invariant.
- Dry-run mode.
- Batch size.
- Idempotent operation.
- Audit output.
- Rollback or forward-fix story.

Repair scripts should not depend on web endpoints. Prefer Mix tasks or release tasks with explicit safeguards.

## Persistence Observability

Track:

- Transaction duration.
- Constraint errors by type.
- Deadlocks.
- Retry count.
- Outbox backlog.
- Job age.
- Projection lag.
- Migration duration.
- Data repair counts.

## Review Checklist

- [ ] Domain and persistence shapes are intentionally related.
- [ ] Validations and constraints are placed correctly.
- [ ] Transactions are explicit.
- [ ] External effects occur after commit through durable mechanism.
- [ ] Idempotency is defined for retried commands and effects.
- [ ] Migrations are online-safe or explicitly scheduled for downtime.

