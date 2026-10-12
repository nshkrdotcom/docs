# Interaction specification 1: Semantic code review

**Priority:** first fully implemented product slice. **Entry:** repository + base/head diff. **Exit:** saved investigation with concrete findings and exact anchors. **No runtime capture required.**

## The user story

A reviewer receives a PR changing how a GenServer recovers pending commands. Ordinary tools show a handful of changed lines in different files. ElixirScope should let them ask: **What behavior changed, what could depend on it, what effects might it reach, and what evidence justifies the concern?**

## Prerequisites

- `Git` can enumerate exact revision pair, source files and content hashes.
- ExAST extracts changed functions/clauses and structurally distinguishes moved/edited code where supported.
- Reach supplies bounded dependency and effects/OTP context, with diagnostics when uncertain.
- Source and relations are mapped to revision-qualified SourceRefs.
- Ash can persist at least `Repository`, `Revision`, `Investigation`, `Finding` (or local fixture for UI prototype).

## Workspace, initially

**Left:** change navigator grouped by impacted workflows rather than file names only. **Middle:** active semantic diff plus optional pinned related source pane. **Right:** local relationship/effect neighborhood, limitations and evidence. **Bottom:** related test leads / findings / breadcrumbs. Group names are heuristics from symbol relationships until user supplies architecture labels; do not claim recovered business intent.

## Primary interaction path (A → H)

### A — Open revision pair

The user picks `main...feature/recover` or two SHAs. `POST index` if needed; UI shows source trees and pending analysis state. Render a normal diff immediately while indexing; don't block on Reach. Any project scan respects allowed root. If one ref unavailable, report accurately, do not silently substitute HEAD.

### B — Changed symbol map

The navigator upgrades from changed files to modified definitions, clauses and imports with context. Each entry has: name/MFA, change type, source span, possible side effects, known callers count within current analysis, and tool coverage. Structural matching may report `ambiguous move/rename` as a separate category.

### C — Select modified callback

Selecting `CommandWorker.handle_info/2` updates focus: source pane jumps to exact changed span at HEAD; diff highlights corresponding old/new symbol; relationship pane requests a bounded neighborhood (default radius 1, user-expandable); explanatory labels clarify caller/callee, OTP callback and possible effects.

### D — Follow an effect path

Reviewer clicks "possible external write". The right pane shows the shortest relevant *statically possible* source-to-effect path, not a giant call graph. Each edge links to a call site; `why this edge` exposes provider/fact and unresolved dynamic calls. Source pane follows as user traverses the path. A pinned source snippet remains fixed.

### E — Pin the old behavior

Reviewer pins old revision's `recover/2`, then examines new revision's `recover/2`. Split panes stay side-by-side. Additional selections update only unpinned panes. Pin state persists in investigation. If source was deleted, pinned old source still renders from its original revision.

### F — Inspect OTP and state context

An OTP lens shows likely supervisor/process ownership and callback boundaries. Avoid claiming process state is "changed" merely because a field is referenced; distinguish static access candidates from observed mutations. Show named state fields only when derivable reliably; otherwise offer source references and explanatory limitations.

### G — Attach test or runtime evidence

Reviewer opens test leads. Tests are categorized `direct reference`, `candidate`, `observed in capture` when actual recorded data exists. A static reference alone is not coverage proof. If test recordings exist, a button opens Cinema at the related symbol; returning preserves review focus and pins.

### H — Save finding

The reviewer writes a claim, attaches changed source range, path and optionally failing execution. Findings preserve both revisions, provider versions, capture IDs, supporting observations and remaining unknowns. One click returns to all selected evidence. Reviewer can mark a claim contested/resolved without deleting contrary evidence.

## Deep navigation behavior

**Select symbol:** visible highlight, code breadcrumb and neighborhood fetch. **Select graph node:** jump to that exact version and provenance; user can open in pinned side pane. **Select source call site:** recenter graph on called symbol, preserve one-step history. **Select effect:** show source path, effect kind, directness, unresolved edges. **Select test lead:** separate test source pane. **Double-click finding:** restore its anchors. `Back` reverses semantic selection rather than browser URL alone; browser history deep-link can encode stable focus fields.

## Important conditional states

| Condition | Correct behavior |
|---|---|
| Indexing still running | Show source and conventional diff; add semantic sections incrementally, label partial |
| Reach API failure | Diff and ExAST navigation remain functional; show missing analysis diagnostic |
| ExAST ambiguous move | Display candidate correspondences; no automatic permanent symbol merge |
| Macro-generated code | Show original source and analysis limits; expand/compiler location later if available |
| No precise call-site range | Show function-level path with warning, not bogus line marker |
| Very large impact graph | Return bounded neighborhood with truncation + expansion controls |
| HEAD changed after scan | Pin immutable revision; signal stale working tree, request new snapshot |
| No tests identified | Say no test leads from active providers; do not assert untested |
| User pins all source panes | Offer explicit open-in-new-pane or replace action, never auto-unpin |
| Language = Erlang/Gleam | Use available Reach facts, no false ExAST structural-diff support |
| Ash persistence offline | Local UI still navigable; save unavailable with actionable error |

## Information requirements per panel

- **Change navigator:** selected source span, change kind, likely related neighbors, concise coverage explanation.
- **Source follower:** exact revision, symbol, code range, surrounding clauses and jump-to-definition.
- **Impact pane:** bounded typed edges, candidate effects and paths, optional architecture boundaries.
- **Evidence:** why-this-fact/source, tool/version, limitations, test vs execution support, unresolved paths.
- **Findings:** claim text, independent anchors, editable state, difference between concern and confirmed regression.

## Analysis response examples

**Changed symbol:** `{symbolRef, beforeRef?, afterRef?, changeKind, spanPairs[], structuralReason?, diagnostics[]}`.

**Effect path:** `{pathId, sourceSymbol, targetEffect, steps:[{relationKind, callSiteRef?, provider, qualifiers}], scope, caveats[]}`.

**Review context:** `{selected, directCallers, directCallees, stateOwnerCandidates, otpRelations, effectPaths, testLeads, coverage, truncated}`.

## Performance and behavior tests

1. Select 30 successive symbols quickly; only final network result is applied, no stale pane overwrite.
2. Keep one old-revision source pane pinned; navigate 20 impacts, confirm pin never changes.
3. `back` restores symbol focus, graph scope and relevant source without clearing user pins.
4. Navigate a large module and graph 10k+ overall nodes; UI only renders local neighborhood.
5. Empty/unavailable/ambiguous facts produce distinct statuses, never mislead.
6. Save/reopen finding and compare exact revision hashes and selected source lines.
7. In a known fixture, detect a newly introduced path to a write and show the code path with correct source calls; if analysis cannot resolve path, report it honestly.
8. Audit no event or source payload can escape allowlisted repo root through path traversal.

## Exit criteria for v1

Reviewing one PR in an OTP-heavy sample can be completed with changed-symbol navigation, contextual impact and test leads, pinned sources and evidence-linked findings. The three-pane flow works with no AI and no runtime instrumentation. Reviewers can always tell what is static possibility versus observed fact.

## Future enhancement without contract changes

Recorded tests and Cinema add *another evidence source* for the same symbol, finding and investigation. Architectural intent declarations add authored constraint checks. AI can propose questions based on gathered facts, but does not own what is saved as verified evidence.
