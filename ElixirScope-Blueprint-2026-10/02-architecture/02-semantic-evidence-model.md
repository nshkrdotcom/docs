# Semantic, source, runtime and evidence identity

## Why the model must be narrow but correct

A universal graph schema is too broad; a source/file-only schema cannot support Cinema. Use independent immutable **source index** and **runtime recording**, joined by a small correlation and evidence layer. Different views query the same normalized objects, but the persisted model is not one giant `nodes` table pretending all semantic units are interchangeable.

## Source model

**Repository**: identity, working path and permitted roots. **Revision**: Git SHA/tree or unique working-copy snapshot ID (dirty working tree is explicitly not HEAD). **File**: revision-qualified path + content hash. **Symbol**: language, logical qualified name, kind, arity where applicable, precise source span and identity. **Relation**: typed edge between IDs; analysis tool and flags. **Match**: candidate source correspondence across revisions with reason and ambiguity.

Identity sketch:

```
SourceRef {
  repository_id, revision_id,
  language, file_path, content_hash,
  symbol_key?, span: {start_line, start_col, end_line, end_col},
  selector_kind?, origin_map?
}
```

`symbol_key` is human-readable `MyApp.Worker.handle_call/3` where available, not the unique immutable DB key. A function with multiple clauses may have function-level identity and per-clause spans. Calls inside generated code can have `origin_map` unavailable. Structural matching across revisions is a separate relation, not overwritten identity.

**Source location invariant:** showing old event source always uses the event-associated code hash/revision. If unresolved, show a stale-code warning and let user choose a candidate mapping. Never silently jump to working tree.

## Runtime model

```
CaptureSession { id, started_at, ended_at?, capture_policy, code_versions,
                 coverage, schema_version, source_manifest }
NodeIncarnation { id, node_name?, boot_id?, hostname_hash?, clock_domain }
ProcessIncarnation { id, node_instance_id, pid_repr, first_seen?, last_seen?,
                     logical_role?, supervisor_ref?, identity_provenance }
Event { id, session_id, node_instance_id, process_instance_id?,
        local_seq, timestamp_mono?, timestamp_wall?, clock_domain,
        event_type, source_refs[], payload_ref?, coverage, provenance }
Observation { id, event_id, owner_ref, property_path?, value_status,
              capture_mode, redaction, completeness, value_ref? }
CausalRelation { from_event_id, to_event_id, kind, basis, uncertainty }
```

**Process incarnation** is NOT `{node_name, pid}` alone: node names can reboot/rejoin, PIDs can be reused, and logical roles continue across process lifetimes. Source revisions can differ across node deployments and even across one node's hot code change; session may reference several code versions.

## Evidence and claims

```
EvidenceRef {
  kind: static | observed | reconstructed | inferred | unknown,
  provider, version?, artifact_id?, source_refs[], event_ids[],
  assumptions[], limitations[], coverage, redaction?, captured_at?
}
Finding { question, claim, anchors[], evidence_refs[], competing_explanations[],
          gaps[], state: draft | reviewed | resolved }
```

**Avoid numeric confidence by default.** Static edge 'known to parser' and one observed message have different truth conditions, not 96% vs 92% confidence. For heuristics, record ambiguity, alternatives and explanation.

## Relations, not a one-size-fits-all graph

| Relation | Source / execution distinction | Invalid shortcut |
|---|---|---|
| `calls` | Static possible call edge OR observed invocation link | Treat as executed merely because present |
| `references` | Lexical/semantic source use | Infer state mutation from any reference |
| `may_effect` | Static analysis candidate | Treat as confirmed effect |
| `attempted_effect` | Captured invocation | Assume external effect completed |
| `effect_outcome` | Captured success/failure result with instrumentation scope | Claim durable commit if outcome wasn't actually observed |
| `supervised_by` | Static child spec prediction OR runtime relationship | Assume exact dynamic tree without observation |
| `send_receive` | Correlated observed transfer, with reliable IDs/tokens when possible | Match by timestamp/content alone |
| `local_order` | Process/session event sequence | Equate local sequence across nodes |
| `happened_before` | Transitive closure of trusted causal edges | Set by wall clock difference |
| `source_correspondence` | Same source or candidate structural match | Pretend renames/rewrites are certain |
| `supports` / `contradicts` | Evidence and claims | Let AI prose act as an observation |

## Partial-order and time model

Per-node monotonic timestamps are comparable only inside their clock domain and while lifecycle continuity is guaranteed. Wall-clock timestamps are approximations used for visual placement and cross-system UX. Offset estimates carry an error bound. A cross-process happens-before edge requires a recorded transfer/span/trace-token relationship or other explicit source of causality. Unrelated events can remain incomparable. A causality filter produces a directed subgraph, not necessarily a single total-ordered list.

## State model and the impossibility boundary

A capture of `GenServer` state at T1 and T3 is not proof of state at intermediate T2. Full replay is available only for fields/transitions whose complete ordered chain is known and whose transformation semantics are validated. Otherwise display: `last observed: executing at T1; current state between T1 and T3 unknown`. Failed captures, oversize truncation, redaction, sample filtering and dropped data must have distinct flags.

## Normalizer responsibilities

- Merge facts from Reach, ExAST and source compiler/LSP, preserving original provider and resolving exact source refs.
- Normalize events from trace sessions, Telemetry and fixture formats to one versioned event envelope; unknown event types retained opaque rather than dropped.
- Compute bounded derived projections, including message correlation and candidate source matches; never overwrite immutable raw evidence.
- Validate causal DAG acyclicity per asserted edge type; conflicts become diagnostics not arbitrary topological sorting.
- Emit explicit `gaps` in every window or path query: absent node, missing source, code version mismatch, clock offset uncertainty, sampling or drop counts.

## Low-cost index surfaces

Primary lookups: `(revision, file, span)`, `(revision, symbol_key)`, caller/callee edges, `(session, node, process, local_seq)`, `(session, event_id)`, `(session, actor, time-range)`, `(session, correlation_id)`, and `(source_ref, observed invocation list)`. Exact engine choice can change later.

## Future-proof but not future-built

Keep `language`, node incarnation, source revision and provenance in schemas from the beginning. Do **not** implement distributed collection, logical clock algorithms, generalized term serialization or a graph query DSL just to accommodate their future possibility. Compact type fields preserve the seam.
