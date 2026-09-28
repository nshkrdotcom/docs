# Phase 04 — screenplay pipeline

Entry: Phases 01–03 complete with verified Core approval, Run persistence and worker/resource behavior. Read `WORKFLOWS_AND_UI.md`, execution/policy contracts and actual Session/Strategy/Request/Workflows/Intelligence APIs.

## Deliverable and scope

Headless runs carry screenplay work through intake, investigation, saved dramatic routes, candidate writing, checks and bounded creative iteration. The production strategy decision command resolves human route gates. Candidate demos stop at the saved check→decide boundary; final decision/acceptance/delivery and the complete CLI are Phase 05. Do not label that checkpoint a completed/exported run.

## Implementation checklist

1. Wire intake/preflight, investigate, plan, write, check and iterate handlers to the existing domain APIs using Phase 03's engine. Save real reports, inspected/omitted scope, uncertainty, strategies, candidates and lineage; preserve closed request/operation contracts.
2. Add supported Workshop preparation-only and selected-route materialization seams where needed. Reuse saved preparation/strategies; do not call a whole-session execution path that writes pages before the strategy checkpoint.
3. Dispatch all eight writing operations plus investigate through the existing closed registry. Supply meaningful brief→opening, reveal/consequence and selected-scene dialogue fixtures with typed edits. Test other registered workflows' dispatch/validation and retain existing standalone workflow tests.
4. Implement production `FountRun.submit_decision/4` for strategy checkpoints using Phase 02's primitives: authenticated principal, exact plan/policy/context match, closed saved choices, atomic resolution and next-step scheduling. Identical response replay returns its result; competing/stale responses conflict. No manual SQL or test-only resolver in the demonstrated writer path. Phase 05 extends this same transition to the remaining kinds.
5. Compose successive unaccepted candidates against the immutable canonical base, preserve parent-candidate lineage and validate all accumulated edits/check/report bindings. Scope and protected material are required checks. Intermediate candidates must not be accepted merely to make revision parents fit.
6. Schedule each creative repair through durable `iterate`; preserve successful branches and target the smallest actionable finding. Enforce `max_iterations` without resetting spend or formatting/transport allowances. Material unresolved trade-offs and hard limits leave explicit saved decisions/partial results.
7. Add deterministic candidate demonstrations and progress/check inspection. Invoke `step` through the stored check→decide boundary in these demos; do not dispatch unimplemented completion handlers. The pipeline adds no successful placeholder for Phase 05 acceptance/export.

## Runtime acceptance

- **P01:** Brief→opening candidate and selected-scene dialogue pass produce meaningful changed pages, exact base/candidate IDs, checks and reports. Canon remains at its starting head.
- **P02:** Reveal fixture stores distinct dramatic routes, preserves the train-platform scene and performs a targeted consequence repair. Inspection gaps and uncertainty remain visible.
- **P03:** A human strategy gate saves routes before pages; only production `submit_decision` can resolve it and continue materialization. Test success, identical replay, competing response, wrong actor and stale plan/policy/context.
- **P04:** Iteration stops at the cap, retains successful work and charges each creative repair separately from malformed-output/transport recovery. No hidden Session repair loop or version change resets a limit.
- **P05:** The final candidate composes all unaccepted changes against canon with valid scope, protected-material checks and report lineage. Review displays the complete diff, without intermediate acceptance.
- **P06:** Interrupt and resume the actual multi-stage/multi-session fixtures at strategy and candidate/check checkpoints. Reuse successful stages, preserve pending decisions and inherited usage, and apply Phase 03's ambiguous-outcome rules.
- **P07:** All nine existing Workshop workflow entry points, analytical/provider package boundaries, Core acceptance safety and Phase 03 recovery gates remain green. The demo truthfully ends at its saved completion checkpoint, not a fabricated delivered/accepted status.

Run common gates, Run/Workshop PostgreSQL integration and deterministic Sandbox/scripted-Inference screenplay demonstrations. Provider calls and human creative-quality studies are optional separate evidence.

## Handoff boundary

Web returns two ZIPs and Phase 04 QC handoff. Runtime repairs/certifies P01–P07, updates evidence/state, commits/pushes and prepares Phase 05 inputs. Only then implement final steering, acceptance and delivery.