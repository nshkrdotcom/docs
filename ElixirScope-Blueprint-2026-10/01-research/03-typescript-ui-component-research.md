# Frontend library research and composition strategy

The high-performance UI is the differentiated deliverable. Adopt robust pre-existing rendering primitives but own the **focus, navigation, provenance and investigation logic**. No library provides the product as a whole.

## Component decision matrix

| Responsibility | Candidate | Recommended experiment | Important constraint |
|---|---|---|---|
| IDE-style multi-pane layout | [Dockview / dockview-react](https://dockview.dev/docs/) | **Adopt** as outer shell; preserve `api.toJSON()` layout and panel IDs; floating/popouts optional | Native browser popout requires same-origin `popout.html`; layout migrations and security need tests |
| Diff and source | [`@git-diff-view/react`](https://www.npmjs.com/package/@git-diff-view/react) | **Trial 1:** structural code-review diff + inline annotation widgets | Confirm current API, licensing and performance on large Elixir files |
| Accurate code navigation | [CodeMirror 6](https://codemirror.net/) | **Trial 2:** read-only decorated source follower with annotations and line mapping | Correct source language support, large-file virtualization, semantics to decorations |
| Full editor feature set | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Alternative if necessary for highlighting, compare, actions | More weight; don't import IDE complexity without user value |
| Small architectural graphs | [React Flow](https://reactflow.dev/) | **Adopt for bounded neighborhoods** and narrative graph cards | Render <= dozens/hundreds visible nodes; don't represent trace event corpus as React nodes |
| Layout algorithm | [Dagre](https://github.com/dagrejs/dagre) | Start for DAG-like local topology | Shared cycles/OTP layouts may need other layout |
| Advanced layout | [ELKjs](https://github.com/kieler/elkjs) | Evaluate if local graphs grow complex | Potentially worker/off-main-thread; stable layout important |
| Very large networks | [Sigma.js](https://www.sigmajs.org/) | Future fallback for WebGL clustering | Not appropriate for semantic source-oriented node detail by default |
| Trace timeline | [Perfetto embedding API](https://perfetto.dev/docs/visualization/embedding-the-ui) | **Decisive bakeoff** vs own Canvas; test host-to-selection bridge | Documented iframe protocol supports loading/time viewport; host selection callbacks aren't part of simple public iframe surface |
| Custom timeline | Canvas2D / [PixiJS](https://pixijs.com/) | Small proof when Perfetto selection integration fails | Accessibility, picking, virtualization, DPI and temporal lanes are real engineering work |
| Timeseries metrics | [uPlot](https://github.com/leeoniya/uPlot) | Optional for mailbox/memory metrics | Metrics are not an execution or causality view |
| Huge lists/trees | [TanStack Virtual](https://tanstack.com/virtual/latest) | **Adopt** for symbols, events, search and findings | Supports huge collections only if rows and query pagination are disciplined |
| Tree editor UX | [react-arborist](https://github.com/brimdata/react-arborist) or custom virtual tree | Optional; file tree secondary to review-context navigator | Need keyboard selection & virtualization |
| Shared local focus | [Zustand](https://zustand.docs.pmnd.rs/) | **Adopt** narrow focus + pane/pin state | Don't accidentally rerender every panel at 60Hz |
| Remote query caching | [TanStack Query](https://tanstack.com/query/latest) | **Adopt** bounded queries/prefetch | Separate transient cursor from server data |
| Command palette | [cmdk](https://github.com/dip/cmdk) | **Adopt**; everything important command-addressable | Surface only commands valid for active lens |
| Worker-side transformations | Browser Web Workers | **Use** on event aggregation and layout | Worker outputs versioned, cancelable to avoid stale cursor updates |
| E2E tests | [Playwright](https://playwright.dev/) | **Adopt** | Test keyboard/pinning/history/routing under latency |

## Compose, don't render the world

Outer Dockview is almost entirely React shell. Source panes are CodeMirror/diff views with source references; graph projections operate on selected neighborhoods; timeline is Canvas/Perfetto with locally cached bounded windows; evidence tables/lists use virtualization. React state owns view-level metadata. The animation frame / trace cursor is *not* an Ash resource and is *not* pushed to Phoenix on every movement.

### Two-frontends caution

We mean **two frontend delivery modes**, not necessarily two independently authored primary interfaces: the React app is the high-frequency developer cockpit; Phoenix can expose a LiveView-powered internal diagnostics/admin UI at its origin. This does **not** turn LiveView into a generic headless JSON view engine. The React app talks to documented JSON and, later, Channels. See deployment docs.

## Perfetto experiment (critical, unresolved)

The [official embed API](https://perfetto.dev/docs/visualization/embedding-api-reference) supports `mode=embedded`, `postMessage` trace loading (including streams), viewport control, URL selection on initial load by timestamp/duration, and plugin arguments. A [plugin API](https://perfetto.dev/docs/contributing/ui-plugins) supports selection inspection and custom tracks/tabs. The simple host iframe API does **not** guarantee rich "user selected this event; notify my host CodeMirror pane" callbacks. Validate custom plugin/bridge support and licensing/security before basing Cinema on it.

Suggested bakeoff on a captured fixture:

1. Load 100k event records across 100 actor lanes, with 20 realistic messages and a crash/restart sequence.
2. Seek to event ID via host; verify programmatic viewport/selection support.
3. Click event in timeline; propagate exact event ID to source pane via supported API or plugin; measure total latency.
4. Pin process role and toggle causal vs chronological mode; evaluate visual adaptation.
5. Compare behavior of browser popout, cold load, huge traces, partial data and keyboard navigation.
6. If host selection is unreliable, build a small custom Canvas timeline with an event-hit index. Don't fake synchronization by polling the DOM.

## A navigation-centered UI contract

Every representation exposes common events: `selectSymbol`, `selectEvent`, `selectActor`, `selectValue`, `selectEffect`, `seekTime`, `setFollowMode`, `pinPane`, `unpinPane`, `back`, `forward`, `compareWith`, `saveFinding`. Handlers update the shared focus reducer. Every view declares which focus fields it consumes and which it ignores.

## Frontend budgets (targets to measure)

- Source navigation from cache: p95 < 75 ms; warm neighborhood query p95 < 150 ms.
- Trace seek during local window scrubbing: 60fps target; must not send one HTTP request per pointermove.
- Source highlighting: update within following animation frame on typical hardware.
- Large event lists: virtualized; no unbounded DOM/event node creation.
- Heavy transforms: worker/off-thread, cancellable by request ID and focus revision.
- Graph local neighborhood: default cap about 30–80 semantic nodes (tune based on measured legibility and performance, not arbitrary global limit).

These are provisional product performance budgets, not benchmark findings.

## Browser-accessibility and cognitive budgets

Provide keyboard navigation across panes, landmarks, screen-reader textual alternatives for graph and timeline, reduced-motion mode, persistent breadcrumb and pin affordances, and a one-command restore to a known layout. Do not auto-scroll a pinned source pane or use unexplained animations to imply causal certainty.
