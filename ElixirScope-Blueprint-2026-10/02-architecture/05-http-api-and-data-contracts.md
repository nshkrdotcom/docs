# External interfaces: HTTP, live updates, data contracts and versioning

## Contract philosophy

Keep browser/backend boundary boring and explicit. JSON, stable IDs, cursor pagination, narrow typed contracts. The backend can later be Phoenix on the same origin, subdomain, desktop sidecar or remotely hosted. The engine remains a pure library. Store wire schemas in `examples/contracts/` and generate TypeScript types after validation; never pass raw `Ash.Resource` struct shape or Erlang terms to the browser.

## Proposed REST endpoints (versioned)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/repositories` | Open an allowlisted repo root or registered remote checkout |
| `GET` | `/api/v1/repositories/:id/revisions` | Enumerate known refs/index status |
| `POST` | `/api/v1/repositories/:id/index` | Schedule index of exact revision/snapshot |
| `GET` | `/api/v1/index-jobs/:id` | Progress, indexed revision, diagnostics |
| `GET` | `/api/v1/revisions/:id/changes?base=` | Change groups and changed symbols |
| `GET` | `/api/v1/sources/:fileId?range=` | Exact revision-qualified source chunk, content hash |
| `POST` | `/api/v1/analysis/neighborhood` | Bounded typed relationship neighborhood |
| `POST` | `/api/v1/analysis/impact` | Changes/impact paths/effects/test leads |
| `GET` | `/api/v1/investigations/:id` | Load saved focus/pins/layout/findings |
| `POST` | `/api/v1/investigations` | Save or create investigation |
| `POST` | `/api/v1/investigations/:id/findings` | Evidence-backed finding with anchors |
| `POST` | `/api/v1/captures/import` | Import validated recorded artifact, optional for Cinema |
| `GET` | `/api/v1/captures/:id/window?from=&to=&actors=` | Bounded event window + gaps + continuation cursor |
| `POST` | `/api/v1/captures/:id/causal-slice` | Evidence-supported causal subgraph |
| `GET` | `/api/v1/captures/:id/events/:eventId/context` | Source/actor/state/effect evidence for one event |
| `POST` | `/api/v1/runs/compare` | Align two recorded runs using explicit anchors and report divergences |

V0 needs only repository/revision/change/source/neighborhood/investigation routes. Cinema import endpoints are introduced with fixtures after UI proves useful.

## Representative focus payload

```json
{
  "repositoryId": "repo-1",
  "revisionId": "rev-head",
  "symbolRef": "sym-worker-recover-2",
  "captureSessionId": "run-failing",
  "actorId": "node-b-boot1/proc-88",
  "eventId": "ev-0127",
  "lens": "state",
  "followMode": "causal",
  "temporalWindow": {"startNs": "12400000", "endNs": "12700000"}
}
```

Use decimal strings for nanoseconds and potentially 64-bit IDs to avoid JavaScript number precision loss. `captureSessionId`, `actorId` and `eventId` are nullable in static review. The full focus has a client-only ephemeral cursor; server saves snapshots/bookmarks, not every hover.

## Response envelope

```json
{
  "schemaVersion": "1.0",
  "requestId": "q-17",
  "revision": "rev-head",
  "data": {"nodes": [], "edges": []},
  "coverage": {"status": "partial", "reasons": ["dynamic_dispatch_unresolved"]},
  "provenance": [{"provider": "reach", "mode": "static", "version": "recorded_at_index_time"}],
  "page": {"truncated": false, "nextCursor": null}
}
```

`unknown`, `not_captured`, `truncated`, `redacted`, `unsupported`, `stale_revision`, `node_missing` must be distinguishable error/gap reason codes. HTTP 200 partial response is legitimate when the payload reports precise coverage; catastrophic query failures use conventional 4xx/5xx.

## Jobs and WebSockets

If needed, Channels can broadcast `index_job.progress`, `capture.imported`, `capture.new_window`, `investigation.updated` with resumption cursor, ACK and backpressure semantics. Do not broadcast every trace event to every browser. Use batch/sequence checkpoints; UI pulls precise windows on demand. Auth/rate-limits and origins are deployment concerns isolated to server transport.

## Multi-run comparison API

The comparison endpoint receives two run/session IDs, a scope (logical actor or correlation ID), alignment anchors (`message kind`, `function entry source ref`, `external effect attempted`, `crash`, `restart`, `test boundary`), and optional unmatched-event handling policy. Return aligned checkpoints with `leftEventIds`, `rightEventIds`, `matchBasis`, `ambiguity`, differences, and explicit `gap` arrays. Never declare divergence merely because one sampled run lacks an event.

## Build/runtime versioning

Separate `wireSchemaVersion`, `analyzerProviderVersion`, `traceFormatVersion` and `databaseMigrationVersion`. An old imported trace may still be viewable when its event schema has a compatible migration, even if current Reach version differs. Do not let UI binary version directly assume raw trace contents.

## Security baseline

- Repo root is server-authorized; normalizing paths eliminates traversal/symlink escapes.
- Query budgets and pagination limit CPU/memory; no shell commands evaluated from HTTP inputs.
- Redact secrets and sensitive terms before transport; source access follows auth scope when multi-user.
- Browser-generated IDs are not trusted as authorization; server resolves scope/revision/source identity.
- Even local dev import must reject malformed or oversized trace files rather than deserialize executable BEAM terms.
- Under distinct origins, configure CORS and Socket `check_origin` deliberately; never disable checks globally in production.
