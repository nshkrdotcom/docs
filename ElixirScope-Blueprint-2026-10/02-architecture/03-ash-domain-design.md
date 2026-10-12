# Ash domain and persistence design

## Separation rule

Ash is the server's durable application model: repositories, indexed facts needed for browsing, saved investigations, findings and capture manifests. The *analysis library* returns plain structs/maps and must run without Ash. High-cardinality raw events belong in trace chunks with a specialized query index, not automatically in millions of Ash resource records.

## Recommended Ash domains

### `ElixirScopeServer.Codebase`

| Resource | Key fields | Relationships / actions |
|---|---|---|
| `Repository` | `id`, display name, canonical root, allowed path/scope, created/updated | has_many Revisions; `open`, `rescan` (action schedules job) |
| `Revision` | `id`, repository_id, git SHA/tree, dirty snapshot flag, indexed_at, parser status, content manifest | belongs_to Repository; has_many Symbols |
| `IndexedSymbol` | `id`, revision_id, qualified_name, kind, language, source_ref JSON/structured fields | belongs_to Revision; related indexed edges |
| `IndexedRelation` | `id`, revision_id, from_symbol_id, to_symbol_id?, relation_kind, provider, detail, ambiguity | belongs_to Revision; may include external source refs |
| `IndexJob` | repository, revision, phase, progress, error, timings, adapter_versions | `queue`, `cancel`, `retry`; optional task/Oban backend |

Only persist the hot, helpful subset of analysis facts first. Reach's full in-memory graph may be a cache/file artifact and need not be normalized into Ash from day one.

### `ElixirScopeServer.Review`

| Resource | Fields | Actions |
|---|---|---|
| `Investigation` | id, repository/revision refs, question, focus JSON, saved_layout, bookmarks, owner later | create, save, load, clone, archive |
| `Finding` | id, investigation_id, title, claim, severity?, status, anchor refs, evidence/gaps, created | add finding, link evidence, resolve, export |
| `EvidenceAttachment` (optional) | finding_id, kind, immutable external artifact/event/source IDs, projection metadata | attach, detach, verify availability |

### `ElixirScopeServer.Captures` — only after Cinema import

`CaptureSession`: id, code/source manifest IDs, schema version, storage URI/relative path, recorded nodes, coverage metadata, imported_at, redaction policy. Maybe `SavedView` or `ActorBookmark`. **Not** raw events as Ash resources.

## SQLite-first then Postgres

AshSqlite allows fast local-first workflow; its docs note missing aggregate support relative to AshPostgres. The AshSqlite transaction documentation explains SQLite's single-writer behavior and that AshSqlite disables transaction support by default without extra configuration. Design writes to be short and serialized/queued where relevant; don't assume complex cross-resource transactions are portable. On Postgres migration, retest authorization, migrations, query filters and relationship loads. Sources: https://ash-sqlite.hexdocs.pm/what-is-ash-sqlite.html and https://github.com/ash-project/ash_sqlite/blob/main/documentation/topics/about-ash-sqlite/transactions.md.

For new local installs, dev database lives in server-controlled directory; database path is configuration, not hardcoded in engine. Use atomic schema migration versions, and an explicit export of investigations to avoid coupling portability to SQLite file transfer.

## Resource example (illustrative, check installed Ash DSL)

```elixir
defmodule ElixirScopeServer.Codebase.Repository do
  use Ash.Resource,
    domain: ElixirScopeServer.Codebase,
    data_layer: AshSqlite.DataLayer

  sqlite do
    table "repositories"
    repo ElixirScopeServer.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :name, :string, allow_nil?: false, public?: true
    attribute :root_path, :string, allow_nil?: false
    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  actions do
    defaults [:read, :create, :update, :destroy]
  end
end
```

Exact DSL and versions should be generated with current Ash/Igniter and tested. Do not treat this snippet as the canonical complete migrations/auth/policy configuration.

## Avoid misleading semantic richness

Store **typed relationships and provenance** rather than imposing dozens of mandatory universal resources. Begin with symbols, source ranges and edges. Rich query APIs are services in the engine, not necessarily dozens of calculations on resources. Authored architectural constraints and code-review questions may eventually be first-class resources, but intent remains a separate concept from source extraction.

## APIs and authorization

The browser uses task-oriented routes (`neighborhood`, `review-context`, `trace-window`) plus scoped persisted resources. Only expose paths under approved repository roots; do not accept arbitrary absolute paths, BEAM eval strings or remote node cookies from JSON inputs. `AshJsonApi` is optional for basic CRUD and OpenAPI; custom JSON routes are appropriate for aggregate/investigation queries.

## Index invalidation

An immutable `Revision` index never mutates to represent a different Git tree. A dirty working copy gets a temporary source identity with content hash; changes create a new ephemeral revision/snapshot. Cache results by `repository`, `revision`, analyzer version, policy config and query options. Do not invalidate every cached graph because one file changed if dependency-aware incremental invalidation is available from chosen tools, but correctness comes before incremental cleverness.

## Schema portability traps to avoid

- PostgreSQL-specific JSON operators/aggregates in initial core queries.
- Complex Ash calculations that require data-layer aggregate support not available on SQLite.
- Raw event streams in database transactions or synchronized GenServers.
- Unbounded `has_many` loads for symbols, callers, events or source snippets.
- Hardcoded domain/hostname or filesystem root fields that assume single deployment.
- Persisting arbitrary OTP terms or LLM prompts as unredacted blobs.
