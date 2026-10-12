# ElixirScope Interface Lab — design direction

## Design thesis

Not another IDE clone or an oversized node graph. The instrument is an **evidence-aware, coordinated navigation system** for advanced engineers: changed source, possible effects, recorded execution, process incarnation, state, and uncertainty all orbit the same investigation focus.

### The aesthetic

**Instrument-grade dark mode.** Deep blue-black structure, restrained green/cyan for supported observations and active selection, violet for static code/graph context, amber for boundary/unknown outcome, coral for crash/regression states. Strong monospaced metadata, compact semantically grouped controls and legible source code. Accent colors are information, not decoration.

### High information density without chaos

- Small chrome, clear subpanel boundaries and stable right-hand context.
- Persistent identity at every level: repository, revision, selected symbol, capture session, logical role and event.
- Line-numbered source with local code decorations and succinct inline effect anchors.
- Concise evidence summaries immediately adjacent to the object they explain.
- Selectable investigation trails and bounded neighborhoods rather than a sprawling omnigraph.
- A process-oriented timeline that doesn't silently fuse pre- and post-crash worker lifetimes.
- Actionable gaps—unknown outcome and capture limitations are shown in the mainline view, not hidden in a tooltip.

### Screen composition

**Semantic review** follows a stable `navigator | source | evidence` triad with a bottom investigation strip. The source pane is the visual center, with secondary pinned code that cannot be replaced by follow navigation.

**Cinema** has a timeline control surface above a source follower and event inspector. The graph uses event indices for visual organization because the fixture's cross-node monotonic clocks are not aligned; this presentation does not imply a global total order. Only the supplied `relations` array yields causal connectors.

**Run comparison** uses horizontal semantic checkpoints: pass on the left, match basis at the center, fail on the right. A contextual evidence inspector describes supported differences and caveats. Missing recordings don't count as negative evidence.

**Topology** shows a bounded meaningful system projection; actual captured message and supervisor edges are visually separate from static possible calls. The journal observation is deliberately **not** joined by a false causal arrow.

**Findings** treats an uncertainty-qualified concern as a first-class durable object, not AI-generated certainty.

## Interaction semantics in this prototype

- Source symbol selection updates the active review, inspector and breadcrumb; the pinned source remains intact.
- Switching the view doesn't change the stored findings.
- Cinema: `Role` stepping can cross a recorded restart via distinct incarnations; `Process` stepping stays inside one process; `Causal` stepping only traverses asserted fixture relations; `Free` steps through display sequence.
- Selected Cinema event uses its own `sourceRef`. When absent, it displays an explicit no-source-ref state instead of guessing.
- Findings are authored and locally saved with `localStorage`. Export creates a JSON concept bundle with focus, notes, captured comparison, and evidence caveats.
- The command palette, semantic history, and keyboard shortcuts provide basic low-friction control.

## Production handoff (not implemented here)

| Concern | Prototyped here | Intended production seam |
|---|---|---|
| Workspace | Fixed responsive panes | Dockview layout/pins and saved layouts |
| Source/diff | Virtual-looking line-rendered sample | CodeMirror 6 and structural diff library; viewport-aware decorations |
| Context state | Small typed in-memory store | Typed focus reducer / Zustand selectors with navigation epoch guards |
| Graph | Bounded SVG/cards | React Flow or custom localized view; do not render entire graph |
| Timeline | Small SVG fixture timeline | Canvas2D / Perfetto bakeoff, binary/chunked trace windows, event hit index |
| Data | Bundled read-only synthetic fixture | Revision-qualified API, TanStack Query and optional Channels |
| Findings | Browser localStorage | Ash-backed durable investigation + evidence attachment model |
| Work budget | 12/9 event fixtures | Profile large lists, worker transforms and 100k-event sample before scaling |

## Non-goals for the mockup

No backend; no code instrumentation; no real AST analysis; no live node attachment; no claims about actual external effects; no type-checked real Elixir project; no production auth, threat model, exhaustive WCAG audit, or performance benchmarks. This is a high-fidelity interaction concept for design validation, not a finished code-review engine.
