# Fount Phase Runtime QC Handoff Prompt

You are the runtime QC/debugging agent for **Phase `<N>` — `<NAME>`**.

The previous agent had no working Elixir runtime. Treat its source as an implementation attempt that requires compilation, tests, integration validation, and repair before the phase can become complete.

## Inputs

- current Fount checkout/source baseline: `<BASELINE>`
- offline overlay: `<OVERLAY_ZIP>`
- updated complete docset: `<DOCSET_ZIP>`
- offline handoff: `<HANDOFF>`

## Apply

1. preserve unrelated work;
2. inspect overlay paths and `DELETE_FILES.txt`;
3. apply at repository root;
4. execute deletions intentionally;
5. review complete diff before running build tools;
6. reconcile dependency/API assumptions with real environment.

## Phase summary

`<SUMMARY>`

## Files added/modified/deleted

`<FILE_LIST>`

## Offline API inspection notes

`<SDK_API_NOTES>`

## Known risks / unverified assumptions

`<RISKS>`

## Required QC ladder

Run repository-native equivalents of:

1. dependency/setup;
2. formatter check;
3. focused compile warnings-as-errors;
4. focused tests;
5. full workspace compile/tests;
6. architecture gate from `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`;
7. Credo strict;
8. Dialyzer;
9. docs warnings-as-errors;
10. package/Hex inspection where relevant;
11. DB setup/migrations/integration where relevant;
12. Observe Sandbox tests;
13. phase-specific property tests;
14. small live Observe/Inference checks only when required/authorized.

Fix defects caused by the phase and rerun affected gates.

## Architecture audit

Verify:

- final four-package DAG;
- no `fount_probe` source/dependency after Phase 1;
- no Probe compatibility wrappers;
- no superseded granular physical analysis packages;
- pure Intelligence namespaces do not call Observe execution, persistence, provider, environment, filesystem/network, hidden clock/random state;
- pure Intelligence only depends on allowed Observe value/contract modules; structural boundaries, dependency analysis, targeted forbidden-MFA checks, and deterministic replay all agree;
- context inversion uses Observe-owned typed neutral primitives with closed lens-declared slots and runtime validation; no generic attributes junk drawer;
- Observe L1 remains DB-free; cache entries store reusable MeasurementResult computation, not old revision-bound Observation provenance;
- Intelligence shell owns durable analysis persistence;
- Sandbox can drive playbooks deterministically;
- Reader forward-only invariant holds in presentation order; story-time constraints and causal relations are modeled separately and ambiguity is preserved;
- Workshop explicit acceptance remains intact.

## Phase-1 special audit

If Phase 1:

- verify `packages/fount_probe` is actually deleted;
- grep production/current docs for `FountProbe`/`fount_probe` references;
- verify current Probe production modules/tests were classified per `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`;
- verify existing Workshop workflows still test under new dependencies.

## Docset update

After QC:

- update current phase to `COMPLETE` only if all phase exit criteria pass;
- otherwise use `QC_BLOCKED` with exact blockers;
- append commands/results/fixes to phase QC report;
- update traceability with `QC_VERIFIED` paths/tests;
- update Decisions/specs for runtime-proven corrections;
- return complete updated docset;
- identify exact post-QC source state for next Fount Repomix.

## Domain/product review handoff

If the current phase has a required domain pilot:

- generate the canonical writer/domain evaluation packet after engineering QC;
- verify its evidence/provenance and reference rendering;
- do not mark the human/domain gate passed unless actual reviewers/readers completed it;
- use `DOMAIN_REVIEW_PENDING` when engineering QC passes but human review remains outstanding;
- record an explicit user override as validation debt if sequencing continues without the pilot.

Also verify where relevant:

- writer-facing result contract from doc 27;
- safe declarative pack/lens restrictions from doc 29;
- preflight and actual resource reporting from doc 30;
- feature-film-only claim boundary from doc 31.
