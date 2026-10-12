# Interaction specification 3: Multi-run comparison and behavioral counterexamples

**Priority:** third flagship experience. **Goal:** compare two actual captured executions and their code context without pretending alignment, event absence or state equivalence is certain. **Entry:** two run IDs and optionally base/head revision pair. **Exit:** a reproducible, source-linked difference/claim with first supported divergence and competing explanations.

## The core problem

Two BEAM test runs rarely have identical event sequences. Scheduling interleavings differ, PIDs change, clocks differ, node names may be reused, tests may take different branches, sampling can differ, and different code revisions can move symbols. A side-by-side list diff is mostly noise. The system must align **semantic milestones** (chosen message, callback, effect, crash/restart, checkpoint) under evidence-aware rules.

## Use cases

**A. Passing vs failing test:** one run succeeds, the other hits a recovery violation. Find the earliest *supported* divergence in the selected causal slice.

**B. Before vs after PR:** compare same scenario under two revisions. Source panes show code-version-aware differences, invocation behavior and effects.

**C. Retry variability:** compare two independent runs under same code; one times out and retries, one doesn't. Scheduling differences are observations, not guaranteed root causes.

**D. Cross-node partial recordings:** one session lost Node C's capture; show coverage asymmetry and decline unsupported divergence claims.

## Workspace

```text
+------------------------ COMPARISON HEADER -------------------------------+
| Run A [pass] vs Run B [fail] | alignment policy | source revision A/B  |
+--------------------------+----------------------------+----------------+
| A: process/system score  | Aligned milestones         | B: process score |
| actor lanes + events     | matched, extra, unknown    | actor lanes      |
+--------------------------+----------------------------+----------------+
| A: source + invocation   | Diff / divergence lens     | B: source       |
+--------------------------+----------------------------+----------------+
| Evidence: match basis, coverage gaps, unmatched branches, findings      |
+-------------------------------------------------------------------------+
```

## Comparison identity mapping

**Never align raw PID, node local seq or absolute monotonic time across runs.** Choose stable/semantic anchors such as test ID, request/command correlation ID, module/function source correspondence, observed effect kind, message causality and logical actor role. Mapping is many-to-many/partial, with match reason and ambiguity. Matching source across revisions uses an explicit source-correspondence relation.

Define an `AlignmentPlan`:

```
{
  runA, runB,
  scope: {testId?, logicalRole?, commandId?, sourceSymbol?},
  anchors: ["command_accepted", "effect_attempted", "worker_exit", "worker_restarted"],
  matching: {allowReorderedIndependentEvents: true, allowUncertainSourceMatch: false},
  viewPolicy: {showUnmatched: true, alignBy: "causal_milestones"}
}
```

Only exact matched anchors are automatically committed; speculative matches are shown with a prompt to accept/reject. Alignment policy and evidence are saved alongside the investigation.

## Primary interaction path

### 1 — Select runs

Choose two imports/sessions; display source version, capture level, participating nodes, time window and gaps before comparison. A warning highlights if one run was heavily sampled or source IDs missing. Comparison can still open but will not claim behavioral absence from missing data.

### 2 — Choose scope

Select command correlation ID or logical worker role. Default to a bounded causal slice from an agreed root anchor, not all captured events. If no common root exists, offer a static symbol-based comparison with low-fidelity runtime alignment and explicit limitations.

### 3 — Compute semantic milestones

Represent interesting events as typed checkpoints: accepted request, outgoing command, callback entry, journal write, external attempt/result, exception, process exit, restart, recovery branch, final persisted state, test assertion. Milestone extraction uses recorded event semantics; do not use LLMs to silently invent anchors.

### 4 — Align matched anchors

Show matched milestones centered between the two timelines. Lines and labels explain match by shared propagated correlation, logical role and source-ref match. Nonmatches are visible. For concurrent subbranches, don't impose one arbitrary order: visually group or let the user expand branches.

### 5 — Find first *supported* divergence

The comparison engine computes difference categories: `observed_value_diff`, `event_type_diff`, `additional_observed_event`, `timing_distribution_diff` (with limitations), `different_causal_edge`, `different_effect_outcome`, `different_code_path`, `coverage_gap`, `ambiguous_match`. The first supported divergence is the earliest anchored point after which the evidence actually differs, not necessarily the causal root of failure.

### 6 — Inspect source and values

Left and right source panes follow corresponding recorded events. If both map to the same revision/function, hold one source function fixed and show invocation differences. If source revisions differ, show AST-aware code diff plus event-specific markers. Values compare only when captured with compatible schema/policy and without redaction preventing equality; otherwise `not comparable`.

### 7 — Challenge the hypothesis

An evidence inspector lists: difference, supporting recorded events, source correspondence, capture coverage, plausible alternative explanations, unmatched branches. User can hide merely unrelated interleavings, but must be able to reintroduce them. An AI summary can be generated only as a sourced hypothesis.

### 8 — Save a counterexample

The output is not only prose. It is a portable bundle: both run IDs/manifest hashes, alignment plan, selected milestone pairs, source refs, bounded causal subgraphs, observed differences, gaps, claims and unresolved questions. Can be reopened without access to live nodes.

## Alignment algorithm proposal

1. Normalize both runs and enforce event schema/source manifest checks.
2. User/fixture chooses comparison root and scope.
3. Extract observable milestone candidates and explicit causal edges from each run.
4. Match high-confidence stable anchors (same test/command ID where reliably propagated, same effect kind/role/source correspondence).
5. For remaining regions, match sequences only within causally consistent subgraphs; allow concurrent independent branches and partial order.
6. Classify differences and detect which ones are unsupported by capture completeness.
7. Produce an explainable alignment graph and navigation plan; no opaque "difference score".
8. Permit user edit/override of ambiguous correspondences; preserve them as manual assertions.

Do not implement general graph-edit-distance optimization for arbitrary trace DAGs in v1. A bounded heuristic milestone aligner is sufficient for the sample app and provides useful explainability.

## What each visible difference means

| Difference | Supported claim | Common false inference |
|---|---|---|
| Observed second write attempt in B only | B recorded a second attempt; A didn't within covered scope | A never attempted one anywhere |
| Value changed at same observed checkpoint | Captured comparable field differed | Entire process state differed |
| Crash present only in B | Crash observed in B; A may lack capture | Code change uniquely caused crash |
| Run B longer by wall clock | Observed elapsed time differs within clock assumptions | All extra duration is the measured function's execution |
| Missing event on sampled A | Unknown whether A emitted it | B behavior necessarily diverged there |
| New source branch in B | Code revisions contain different branch/structure | That branch executed unless observed |
| Different external API response | Recorded response differed | Network service had identical input unless captured |

## Interactions and shortcuts

- `Align here`: choose clicked event as anchor in each run.
- `Follow matching role`: synchronize same logical actor across two runs.
- `Step matched milestone`: advance both if available, leave one side stationary with a gap label if unmatched.
- `Lock source`: freeze selected function while stepping through invocations independently.
- `Show first supported divergence`: focus two panes and inspector on one evidence-backed mismatch.
- `Expand uncertain interval`: load more events/actor lanes and discover whether difference was merely hidden.
- `Compare effect ledger`: align attempted/confirmed/unresolved operations.
- `Convert to finding`: attach both runs, relevant source and acknowledged gaps.

## High-value BEAM scenario matrix

| Scenario | Expected comparison outcome |
|---|---|
| GenServer callback crash then restart | New process incarnation distinct; logical role can align, source `init`/recovery shown |
| Different worker scheduling | Concurrent events do not automatically count as semantic divergence |
| Different message receive order | If recorded with proper correlation, mark order difference; no claims outside captured scope |
| Different state snapshots | Compare recorded fields and provenance; unknown intervals remain unknown |
| Different node availability | Report node capture absence; avoid comparing across missing span |
| Hot-code upgrade mid-run | Split by code version, align source correspondences cautiously |
| Duplicate external operation attempt | Show two attempts and durable outcome if available; otherwise unresolved outcome |
| Test nondeterminism | Compare repeated runs with the same code and record alternative interleavings |

## Acceptance tests

1. Same event content but different PIDs and wall times maps to stable logical roles.
2. Independent concurrent event order swaps do not produce a false first divergence.
3. Missing events in sampled run produce coverage gaps rather than "absent behavior" claims.
4. Two runs with same source show fixed source function and different recorded invocations.
5. Two source revisions show exact code-correspondence and AST-aware structural diff.
6. User overrides ambiguous match and survives export/import and browser reload.
7. A rollback of an alignment operation restores previous milestone matching and pane focus.
8. First supported divergence identifies the two effect attempts in deliberately failing recovery fixture.
9. An observed send without matching receive remains `unmatched`, not a fabricated receive.
10. Exported finding reproduces source/event focus and preserves original capture manifests.

## Completion criterion

An engineer can visually isolate the earliest supported behavioral divergence between a known passing and failing OTP test, follow both runs to exact source and state/effect evidence, and explain what is observed vs still uncertain. That is sufficiently distinctive to justify deeper tracing and systematic test integration.
