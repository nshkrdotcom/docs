# Workspace architecture: an instrument for reasoning, not dashboard clutter

## Foundational thesis

The value is **high-performance navigation correlated to meaningful facts**. A pretty multi-pane dashboard is not the goal. When a developer selects a changed function, observed message, logical actor or captured value, every unpinned pane should reveal evidence relevant to the same question with no repeated manual search.

Every pane is a projection of a global focus. A projection can be unavailable, pending, uncertain or deliberately hidden. A pin makes a pane an immutable contextual reference until explicitly changed. Navigation is reversible and serializable.

## Default review layout

```text
+----------------------- GLOBAL COMMAND / QUERY BAR -----------------------+
| Repo/revision A..B | Investigate: where can this change cause effects?     |
+----------------+-----------------------------------+-----------------------+
| Change map      | Source/diff working set            | Evidence / impacts    |
|                |                                   |                       |
| Workflow groups | Active changed function           | callers / effects     |
| Symbol changes  | Pinned caller or data owner       | graph neighborhood    |
| Test leads      | Source decorations and comments  | coverage caveats      |
| Finding queue   | Context breadcrumbs              | review findings       |
+----------------+-----------------------------------+-----------------------+
| Bottom drawer: tests | changed hunks | investigation history | capture |
+-------------------------------------------------------------------------+
```

## Default Cinema layout

```text
+--------------------- INVESTIGATION / CAPTURE HEADER ---------------------+
| Session + source version + selected logical actor + follow mode           |
+-------------------------------------------------------------------------+
| System Score / causal timeline (node groups, process lanes, event ticks) |
+-----------------------------------------+-------------------------------+
| Source follower / pinned source          | Event & evidence inspector    |
| current invocation / exact revision      | state observed, send/receive  |
| optionally 2nd source comparison         | effects, gaps, process       |
+-----------------------------------------+-------------------------------+
| History / breadcrumbs / bookmarks / alternative hypotheses / findings   |
+-------------------------------------------------------------------------+
```

These are starting layouts, not enforced schemas. Dockview manages saved layouts, floating panels and popouts. The focus model determines meaning even if panels move. Multiple panes of the same type may have different follow modes.

## Pane vocabulary

| Pane | Primary input | Shows | What it must not imply |
|---|---|---|---|
| Review navigator | revision pair, changed symbol | changed behavior groups, state/effect leads | Full risk score or guaranteed test coverage |
| Source follower | revision, SourceRef, EventRef? | source span, conditional highlighting, invocation strip | Current HEAD is executed revision |
| Diff | revision pair, selected hunk/symbol | structural/textual changes, annotation anchors | All moved code equals unchanged semantics |
| Neighborhood | symbol, relation filter | callers, callees, boundaries, effects | Static edge was executed |
| Process anatomy | logical role, process incarnation, session | supervisor, restarts, observed lifecycle | Role continuity means state continuity |
| System Score | session, time/range, causal focus | node lanes, process lifespan, messages, events | Total global order or unrecorded messages |
| State filmstrip | owner, snapshots | known snapshots and diffs with gaps | Complete state unless capture coverage proves it |
| Value trail | selected property/value | recorded occurrences plus static dependency leads | Imputed equality across absent values |
| Effect ledger | operation, session | attempted/success/failure and unknown outcome | Attempt = durable external commit |
| Evidence inspector | claim or event | provenance, source/trace/test links, gaps and counterexamples | AI prose equals ground truth |
| Comparison | two runs, anchors | matched milestones, first supported divergence | Missing sample = different behavior |
| Findings | investigation | claims, evidence, contested gaps, severity, status | Final root cause unless tested |

## Shared focus state

```
Focus {
  repoId, revisionId, comparisonRevisionId?,
  symbolRef?, sourceSpan?,
  captureId?, nodeInstanceId?, processInstanceId?, logicalRoleId?,
  eventId?, timeWindow?, causalRootId?,
  lens, followMode, navigationOrigin, requestEpoch
}
```

`navigationOrigin` is the command that generated the focus (clicked call edge, selected message, scrubbed, keyboard command), useful for breadcrumbs and reducing disorientation. `requestEpoch` prevents slow in-flight fetches overwriting newer focus. The focus reducer creates immutable snapshots for history.

### Pane-specific policy

`PaneState { paneId, viewKind, pinned, anchorFocus?, followMode?, params, layout }`. A pane with `pinned: true` ignores global selection changes until user explicitly unpins or performs `navigateHere`. A `process-follow` pane may ignore unrelated events even while global clock changes. The UI displays why a pane isn't updating.

## Navigator commands

Every important action must be accessible by mouse and command palette:

- `Open symbol`, `Find references`, `Show possible callers`, `Show effects`, `Show state owner`, `Show supervision role`.
- `Pin this source`, `Split source comparison`, `Swap follow pane`, `Return to current focus`, `Back/forward`, `Go to originating event`.
- `Follow process`, `Follow logical role across restart`, `Follow causal chain`, `Follow function invocations`, `Lock source`.
- `Next meaningful event`, `Previous event`, `Seek to crash`, `Seek to retry`, `Show evidence for claim`, `Compare with run`.
- `Create finding`, `Attach observed evidence`, `Mark unknown`, `Export investigation`.

Default keyboard hints (editable): Cmd/Ctrl+K command palette; Alt+Left/Right navigation history; P pin current pane; F cycle follow mode; J/K next/previous selected event; G graph neighborhood; S source; E evidence; D diff. Don't conflict with browser/editor shortcuts without testing.

## Responsiveness model

While dragging a timeline thumb: local window cache, spatial index and Web Worker-derived event-to-source lookup respond at animation-frame cadence; do not run React state updates across all panes on every pointer move. An intermediate 'preview seek' can update timeline and source highlight at lower fidelity; committing the seek triggers expensive evidence/graph fetch. Use debounce only where source jumps would otherwise be chaotic, not to mask poor architecture.

Prefetch adjacent symbol source chunks, nearby causal events and pinned source revisions. Cache by exact source/version and query parameters. Use abortable network requests, requestEpoch rejection, and stable pane layouts to avoid jank.

## UX integrity requirements

- Always show current source revision and capture coverage status near Cinema event source.
- Unknown state must not be rendered as interpolated animation.
- Causal arrows require documented evidence; guessed edges must look different and have explicit labels.
- Keyboard focus must remain stable while panes update.
- A user can freeze panes and compare left/right content even as other panes follow.
- Hover preview never persists a finding or switches the main navigation history unless committed.
- A large collapsed graph should display a text summary and expand only bounded neighborhoods.
- Empty state distinguishes "no relationship found" vs "analysis unavailable" vs "not yet indexed".

## User testing plan

Give five experienced Elixir developers unfamiliar with a sample repo a recovery bug task. Compare against conventional editor + logs workflow. Record time to first correct hypothesis, time to evidence, number of ungrounded claims, number of navigation actions, reliance on auto-scroll and subjective orientation loss. Use both visual and keyboard-only sessions.
