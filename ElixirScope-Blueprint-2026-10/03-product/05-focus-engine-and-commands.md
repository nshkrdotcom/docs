# Focus engine, navigation transitions and event-to-pane projections

## Design statement

**Focus is a shared semantic data structure, not a global DOM cursor.** Every pane may follow, pin or locally compare. React renders state projections based on the focus snapshot; the backend only resolves missing facts and sources. Rapid scrubbing is handled locally before committing focus.

## State

```ts
type FollowMode = 'free'|'process'|'role'|'causal'|'function'|'value'|'effect'|'pinned';
type Lens = 'review'|'diff'|'source'|'graph'|'cinema'|'process'|'state'|'effect'|'evidence'|'compare';
interface Focus {
  repositoryId: string;
  revisionId: string;
  comparedRevisionId?: string;
  symbolRef?: string;
  sourceRef?: string;
  captureSessionId?: string;
  processInstanceId?: string;
  logicalRoleId?: string;
  eventId?: string;
  causalRootId?: string;
  timeWindow?: {startNs: string; endNs: string};
  followMode: FollowMode;
  lens: Lens;
  epoch: number;
}
interface Pane {
  id: string;
  kind: Lens;
  pinned: boolean;
  pinnedFocus?: Focus;
  followMode?: FollowMode;
  options: Record<string, unknown>;
}
```

**Implementation note:** `epoch` increments for committed navigation; per-frame preview seeks are separate ephemeral state and shouldn't flood global React selectors/history. Timelines may store 64-bit nanosecond values as bigint internally, but JSON uses decimal strings.

## Commands as a reducer

```ts
type Command =
  | {kind:'selectSymbol'; symbolRef:string; revisionId:string; source:'user'|'pane'|'deepLink'}
  | {kind:'selectEvent'; captureSessionId:string; eventId:string}
  | {kind:'selectProcess'; processInstanceId:string}
  | {kind:'setFollow'; mode:FollowMode}
  | {kind:'commitSeek'; eventId?:string; timeNs?:string}
  | {kind:'pinPane'; paneId:string}
  | {kind:'unpinPane'; paneId:string}
  | {kind:'openSource'; sourceRef:string; targetPaneId?:string}
  | {kind:'compareRuns'; left:string; right:string}
  | {kind:'navigateBack'} | {kind:'navigateForward'};
```

Commands produce `(newFocus, panePlan, sideEffects)`; effects fetch needed data and attach results only when epoch/source keys still match. A pane plan declares `sourcePane-1 show revision-x/ref-y`; UI rendering is pure. Undo/back store committed snapshots; don't store every hover.

## Automatic following guardrails

1. Pinned panes have absolute priority over global focus.
2. A source pane assigned to an actor only follows events from that actor/role (unless explicit user command changes mode).
3. Scrubbing within source function may update invocation badge without re-centering source editor if the source span is unchanged.
4. New source selection should preserve scroll anchor where possible; jump only when a different relevant function is selected.
5. A topology pane chooses a bounded neighborhood; do not auto-expand 500 nodes as focus changes.
6. Source version mismatch blocks silent navigation and generates explicit `cannot_correlate_source` UI state.
7. Focus history includes original cause (clicked effect, step causal, diff selection), so navigation can be explained.

## Pane projection contracts

`SourcePane(Focus, PanePolicy) → {SourceRef?, highlights[], invocation?, coverage}`. `CinemaPane → {VisibleEventWindow, causalLinks, selectedEvent, actorScope}`. `EvidencePane → {anchors, facts, gaps, alternativeReasons}`. `GraphPane → {boundedNodes, boundedEdges, whyPath, truncated}`. All outputs are keyed by source/capture version to prevent stale data.

## Deep-link behavior

An investigation URL can encode an investigation ID and stable focus reference; the persisted record contains source revisions, capture manifests and pane layout JSON. Browser back/forward should not corrupt internal navigation history. If deep-linked resources no longer exist, show an actionable stale/missing banner and the original IDs/metadata.

## Selection policy tests

Pin invariance, correct actor following, source hash/version invariance, stale fetch rejection, history determinism, multiple same-type panes, popout window focus propagation, failed API result isolation, URL round trip, keyboard focus stability, lack of server calls during drag.
