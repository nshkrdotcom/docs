# Risk register: architectural failure modes and mitigations

| Risk | Severity | Detect via | Mitigation/decision gate |
|---|---|---|---|
| We build analysis infrastructure instead of UX | Critical | Weeks spent on graph/CPG without working selection | P0 fixed slice and explicit discard list |
| Code IDs unstable across revisions | High | Moved/reformatted source breaks findings | Revision-qualified IDs + separate match edges |
| Runtime events map to wrong source revision | Critical | Mismatch fixture / hot reload | Source hash/build manifest, unresolved marker |
| Static possible edge presented as executed | Critical | Evidence taxonomy tests | Separate classes and visual legend; type-specific APIs |
| Missing events become false negative claim | Critical | Gap/sampling fixture | Coverage/gap fields in every relevant query |
| Wall clock used as cross-node causal order | Critical | Skew/partition fixture | Causal partial order + clock domain/errors |
| GenServer state invented by reducer | Critical | Snapshot gap oracle | Reconstruct only with sufficient verified transitions |
| Instrumentation causes crash/timing issue | Critical | Target process stress + tracing overhead bench | Bounded opt-in capture, no prod default |
| Sensitive data escapes in captured payload | Critical | Redaction/security fuzz | Source-side redaction, bounded serialization, export policy |
| User loses orientation as source follows | High | Usability test reveals unexplained jumping | Pins, modes, breadcrumbs, invocation-lock, back |
| Perfetto cannot report selection to host | High | P0 bidirectional event selection test | Use plugin or own Canvas, don't commit to iframe blindly |
| React Flow bogs down on entire program graph | High | Dense graph visual/profiling | Local neighborhoods only, clustering and truncation |
| CORS/origins block deployments | Medium | Separate-origin stage E2E | Runtime config, Phoenix check_origin allowlist, same-origin default |
| Dockview popout fails across origin/headers | Medium | Browser popout stage test | Same-origin popout.html, CSP/COOP validation |
| SQLite transactions fail under concurrent writes | Medium | Parallel Ash tests | Serial writer/short transactions; Postgres migration option |
| Reach/ExAST API changes | High | Locked adapter suite | Adapter boundary + lockfile/provider version recorded |
| Dynamic macros/protocol dispatch mislead analysis | High | Macro/`apply` fixture | Unresolved diagnostics; no completeness claim |
| Scope expands to universal intent ontology | High | Hard-coded inferred responsibilities | Human-authored intent distinct; hypotheses explicitly reviewable |
| LLM hallucinations become findings | High | Evidence challenge test | AI never source of observed fact; cite assumptions/falsifiers |
| Overbuilt deployment/auth infrastructure | Medium | No usable review prototype | Runtime URL and auth seam only until hosted need |
| Old source transplant adds fragile dependencies | High | Old test contradictions/`not_implemented` facades | Clean-room narrow package, fixtures only; benchmark any salvage |
| Cache invalidation leaks stale code | High | Edit/ref switch test | Content hash + revision + analyzer version in keys |
| Trace file import security | Critical | Zip-slip/bomb/parser fuzz | Validation, size/depth limits, no eval/deserialization |
| Comparison mistakenly matches unrelated events | High | PID shuffle/clock skew fixture | Explicit anchor basis, unresolved matches and user overrides |

## Highest-priority irreversible errors

1. Source revision/identity mismatch invalidates almost every subsequent view.
2. Evidence laundering (static/AI inference into fact) destroys product trust.
3. Incorrect causal ordering creates compelling but false debugging narratives.
4. Runtime collection without strict safety can damage the system under investigation.

Design these correctly from the first fixture; optimize other concerns later.

## Open decisions with measurable experiments

- Perfetto vs custom timeline: latency, selection callbacks, source-pane integration, data volume.
- ExAST/generic diff source mapping: moved code, multi-clause function and macros.
- Reach output fidelity on real OTP sample: call/effect/OTP relationships and unresolved cases.
- SQLite write concurrency: index job + review annotation persistence collision.
- Selected dataflow trail accuracy: does adding Sourceror/ElixirSense solve a proven gap?
- Targeted BEAM trace overhead and drop accounting: before enabling capture outside tests.
