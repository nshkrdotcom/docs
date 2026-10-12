# Practical content taxonomy: what exactly should display when the user selects X?

This is a compact *design table of projections* for implementing the shared focus engine. It answers the recurring question "what useful information correlates to dynamic high-speed source navigation?". Each row specifies the information worth showing and the evidence required, not an obligation to build a new permanent panel.

## Selection → relevant projections

| Selected object | Source follower | Timeline/actor | Inspector/evidence | Primary next actions |
|---|---|---|---|---|
| Changed function | Definition/clauses and two-revision diff | Optional recorded invocations | Static callers, effects, test leads, structural-diff reason | Follow effect; pin old/new source |
| `GenServer.handle_call/3` | Callback and call/return handling | Selected process invocation and callers | Request/reply, captured state, timeout only if observed | Follow caller; next invocation; inspect state |
| `handle_info/2` | Matching callback clause if known | Receiver process and message | Send/receive proof, state observation and errors | Follow message origin or effect |
| `GenServer.call` | Call site, callback candidate | Wait interval if instrumented | Timeout, reply, late reply/uncertainty | Follow matching receive and response |
| Supervisor child spec | Static start spec and strategy | Actual child incarnations if captured | Observed vs predicted restart behavior | Show blast radius, pin strategy |
| Process incarnation | Relevant current callback | One lifeline/actor lane | Spawn, exit, PID, node boot, last snapshot | Follow event, switch role |
| Logical process role | Relevant code module/callback | Connected but separate incarnations | Role identification basis, continuity limits | Follow restart, compare incarnations |
| Message send | Exact send expression/caller | Sender lane, correlated receive if available | Message ID, transport/correlation, absence explanation | Follow transfer, inspect receive |
| Message receive | Callback/receive clause | Receiver lane, causal predecessor if known | Original sender when provable, value redaction | Follow send origin |
| Process crash | Last correlated callback/stack | Exit marker, monitor/link/supervisor reactions | Exception and provenance, capture limits | Causal backward, recovery forward |
| New worker spawn | `start_child`/`init` if mapped | New lifeline next to prior role | Supervisor decision and code build version | Follow role, inspect state reload |
| State snapshot | Callback/source owner | Event at capture point | Explicit before/after fields, completeness, redaction | Compare snapshots, show last observed |
| State field | Static references and likely owners | Recorded observation occurrences | Possible static writers vs observed writes | Value trail; show capture gaps |
| Database operation | Call site / effect frontier | Attempt/outcome event if recorded | Result status, transaction scope and uncertainty | Backward source/effect path |
| Network call | Request call site | Attempt/response/error events | Confirmed response vs timeout/unknown | Follow causal request, inspect retry |
| ETS write | Writer source | Event if explicitly instrumented | Shared table identity/owner; possible readers | Show ownership and other observed writes |
| Timer set/cancel | Source and callback | Scheduled/timeout markers where captured | Token/owner/lifecycle, late timer uncertainty | Follow delivery path |
| `:DOWN` / link exit | Monitor/link setup if mapped | Related actor lifelines | Monitor vs link semantics | Follow failure lineage |
| Node disconnect | Relevant connection/recovery code if mapped | Node group disconnected interval | Which observations truly captured; clock issues | Examine node-down reaction |
| Source revision change | Before/after function code | Code version segments in recording | Source hash mismatch, hot-code update evidence | Pin revision, compare invocations |
| Test failure | Assertion and tested code | Captured test slice if available | Invariant/expected vs observed, completeness | Open run compare, create finding |
| Review finding | Exact source anchors | Referenced events if recorded | Claim, counterevidence, unknowns | Reproduce, contest, resolve |
| AI explanation | Source links cited by hypothesis | Events cited explicitly | Model hypothesis + facts + falsifiers | Challenge evidence, accept/reject |
| Graph node | Matching revision-qualified symbol | Invocations if recorded | Bounded relations and why-path | Expand neighbor, lock source |
| Causal fork | Source of each branch's events | Concurrent reachable successors | No total order, branch reasons | Follow one branch or group |
| Unmatched event | Nearest source if known | Event with gap badge | Possible capture drop/redaction/uninstrumented region | Expand window, avoid unsupported claims |

## View rendering grammar

**Known/observed:** exact source location/event ID and explanation panel. **Static possible:** hollow/dashed relationship and no execution claim. **Inferred:** label hypothesis with evidence list and alternative interpretations. **Unknown:** substantive placeholder with reason (`not captured`, `redacted`, `truncated`, `unresolved`, `source mismatch`, `node absent`) rather than empty area. Distinguish missing data from explicit negative evidence.

## Automatic source following rules

- Advance source only when an event maps to an exact source span and follow mode includes the event.
- If multiple code locations represent macro generation or dynamic dispatch, show a disambiguation list; do not silently pick one.
- If focus stays in the same function, update an invocation strip and highlights without a full scroll reset.
- When `Pinned`, show stale navigation status but never overwrite the pinned document.
- During rapid time preview, update a lightweight current selection; commit source/panels only when an event is selected or scrub ends, to avoid flashing files.
- A source pane can be configured to follow a *logical role* across restarts without treating private process state as continuous.

## Design priority of contents

1. Exact source and actor/event identity.
2. Why this relation is relevant to the selected question.
3. What was observed, with source/evidence link.
4. What remains possible but unconfirmed.
5. What is missing and how to gather it.
6. Optional recommendations for the next useful navigation, never an unreviewable automatic jump.

That's a more useful "Jarvis" experience than showing as many charts as possible.
