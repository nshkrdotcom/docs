# Runtime QC Protocol

## 1. Purpose

The runtime-QC agent is the first environment allowed to claim compile/test/runtime success. Its job is not merely to run commands; it must repair phase implementation issues, verify architecture invariants, and create the exact baseline for the next phase.

## 2. Inputs

- current source repository;
- offline phase overlay ZIP;
- updated docset;
- offline handoff/QC prompt;
- real Elixir/OTP/PostgreSQL environment;
- provider credentials/endpoints only when live checks are authorized.

## 3. Verify the user's applied overlay

1. Record the user's Fount and docset application commits and the supplied archive identities.
2. Inspect the strict manifest and verify intended additions, modifications, and deletions in the applied checkout.
3. Do not reapply the overlay or repeat deletions. Identify incomplete application before runtime work.
4. Review the applied commit diff and preserve unrelated local changes.
5. Reject unrelated/generated/secrets/build output; then compile, test, and repair phase defects.
6. Follow `35_FOUR_XML_PROGRESSIVE_HANDOFF.md` for the next packet and responsibility split.

Phase 1 must visibly delete `packages/fount_probe` rather than leaving dead code behind.

## 4. Baseline toolchain record

Record in the QC report:

```text
uname / OS
Elixir version
OTP version
Mix version
PostgreSQL version when relevant
Git SHA/status
```

Record provider/model identity for live tests without credentials.

## 5. Dependency and compile gate

Use repository-native aliases/scripts when present. Otherwise run the equivalent of:

```bash
mix deps.get
mix format --check-formatted
mix compile --warnings-as-errors
```

If the workspace is a poncho with package-local locks/deps, follow actual repository conventions discovered from source.

Fix source; do not merely document compile errors.

## 6. Test gate

Run package and workspace tests appropriate to the phase.

At minimum after Phase 1:

```text
fount tests
fount_observe tests
fount_intelligence tests
fount_workshop tests
workspace/top-level tests or CI alias
```

Database-tagged and live-tagged tests may require separate commands according to repository convention.

## 7. Architecture gate

Every phase executes the architecture check introduced in Phase 1.

It must verify:

- four-package dependency direction;
- no `fount_probe` dependency/source;
- pure Intelligence namespaces do not reference acquisition/persistence/provider/environment/network APIs;
- pure Intelligence uses only allowed Observe data-contract modules;
- Workshop has no direct Probe path;
- forbidden compatibility constructs are absent;
- no circular package/application dependency.

Record the actual command and result.

## 8. Reference scans

After Phase 1 and final phase, run targeted scans such as:

```bash
grep -R "FountProbe\|fount_probe" packages mix.exs README.md
```

Expected: no production/current-documentation references.

Also inspect accidentally created superseded packages/modules:

```text
fount_analysis
fount_semantics as physical package
fount_temporal as physical package
fount_reader as physical package
fount_diagnose as physical package
fount_playbooks as physical package
fount_dramatics
```

Logical namespaces inside Intelligence are fine when named `Fount.Intelligence.*`.

## 9. Static quality gates

Run repository equivalents of:

```text
Credo strict
Dialyzer
ExDoc warnings-as-errors / docs build
package inspection/build for publishable packages
```

Do not add blanket ignores to make these green unless the ignore is justified and documented.

## 10. Database gate

For phases touching persistence/workshop:

- create/reset isolated test DB as repository expects;
- run migrations/schema setup;
- run integration tests;
- verify accepted-head locking/stale candidate behavior remains intact;
- verify derived-analysis persistence cannot mutate canonical screenplay truth;
- verify pure reducers do not require a Repo.

Greenfield rule: reset development/test data rather than writing old Probe data migration machinery solely for compatibility.

## 11. Observe Sandbox gate

Standard Intelligence playbook tests must run using the first-class Observe Sandbox without live provider access.

Verify:

- canned MeasurementResults/Observations by semantic measurement identity/context;
- canned errors;
- deterministic request set;
- no hidden live calls;
- test isolation/cleanup.

## 12. Deterministic pure-core gate

Run replay/property tests covering:

- same input -> same output;
- frozen observation fixtures;
- no environment/time/random dependence;
- no Repo/provider requirement;
- future presentation mutation cannot affect earlier reader state;
- flashbacks/non-linear events do not inherit impossible diegetic state;
- unknown story-time relations remain unresolved;
- Reader presentation-suffix recomputation and StoryWorld connected-region recomputation behave correctly.

## 13. Provider live gate

When authorized and phase requires it, run a deliberately small `fount_observe` live check.

Verify:

- client construction from supported configuration;
- arbitrary supported endpoint/key selection;
- model selection where SDK supports it;
- proposition/choice/score forms needed by product;
- batch/request association;
- timeout/error normalization;
- usage metadata if available;
- no secret output/provenance.

Do not spend large tokens/states for a gate that can be proven with small fixtures.

## 14. Workshop live gate

When authorized, run one small generation/candidate flow using current `inference` public API.

Verify:

- structured generation validation;
- typed edits;
- candidate persisted separately from accepted head;
- review packet/diff;
- explicit acceptance path;
- regression analysis integration where phase requires.

## 15. Capability phase QC

For Phases 6–8, execute representative fixtures for every family in that phase and update the traceability matrix with actual test names.

No capability is "done" because modules exist.

## 16. Persistence/reuse/recomputation QC

For Phase 10:

- L1 MeasurementResult cache disposable/DB-free;
- L2 durable reuse/storage works when configured;
- semantic-input/lens/output-contract/model changes cause correct misses;
- revision-only provenance does not defeat valid cross-revision result reuse;
- upstream context change causes a miss even when target text is unchanged;
- cache hit materializes current-revision Observation/evidence rather than reusing prior provenance;
- mutable model-alias reuse policy is enforced;
- cache privacy namespace/isolation is verified;
- late presentation edit leaves earlier Reader state unchanged;
- earlier presentation edit recomputes correct Reader suffix;
- StoryWorld recomputes the correct connected temporal/state region;
- source-span evidence is not silently reused across incompatible revisions.

## 17. Phase-11 evaluation, robustness and live-verification QC

For Phase 11, runtime QC must additionally verify:

- corpus rights/use manifests fail closed and distinguish human review from hosted Observe/Inference export;
- semantic human annotations preserve independent disagreement and first-exposure Reader checkpoints;
- Noul/Choice calibration metrics, abstention curves and ordinal Score errors are hand-checkable on deterministic fixtures;
- drift output is descriptive and does not rank providers/models or turn repeatability into accuracy;
- frozen MeasurementResult/Observation fixtures pin the current output-contract digest, stale contracts fail visibly, and regeneration creates a new current fixture with no compatibility decoder;
- nonlinear Reader presentation order remains separate from partial/unknown StoryWorld story time;
- all twelve capability families resolve to installed evaluation lenses;
- existing malformed-association, failure, timeout, budget, credential-redaction and privacy regressions remain green;
- durable usage history calibrates preflight estimates against actual resource units without converting unknown cost to zero;
- the provider-free Phase-11 example produces inspectable evaluation output;
- authorized Observe live QC uses only the small synthetic scene and records resource/drift evidence without secrets;
- authorized Workshop live QC generates exactly one noncanonical one-scene candidate, leaves Observe disabled in that mode, and leaves accepted head unchanged.

If a live gate cannot be run because authorization/configuration is absent, record `NOT_RUN` and follow this protocol's applicable-gate completion rule. Human/domain review remains optional under D046 and must never be fabricated.

## 18. Functionality preservation gate

Phase 1 and Phase 16 compare the source to `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`.

Every listed current Probe behavior and Workshop workflow must be:

```text
implemented and verified
or explicitly superseded by verified stronger behavior
```

Nothing may be "temporarily available through old Probe" because old Probe no longer exists.

## 19. Fix policy

The runtime agent may directly fix:

- compile errors;
- test errors;
- API mismatches;
- formatting/spec/type issues;
- architecture-gate violations;
- Ecto/runtime issues;
- live adapter mismatches;
- doc inaccuracies discovered by execution.

If a fix changes architecture materially, update `DECISIONS.md` and relevant implementation docs.

## 20. QC report

Create/update:

```text
handoffs/PHASE_<NN>_RUNTIME_QC_REPORT.md
```

Include command, exit status, concise result, fixes applied, residual warnings, live checks, and exact Git/source state.

## 21. Progress transition

Possible transitions:

```text
OFFLINE_IMPLEMENTED -> QC_IN_PROGRESS
QC_IN_PROGRESS -> COMPLETE
QC_IN_PROGRESS -> QC_BLOCKED
QC_BLOCKED -> QC_IN_PROGRESS
```

Only runtime-QC changes a phase to `COMPLETE`.

## 22. Next baseline

After `COMPLETE`:

1. ensure source tree includes QC fixes;
2. update docset;
3. create the next Fount Repomix from that exact source;
4. supply that Repomix + latest SDK snapshots + latest docset to the next offline phase agent.

## Engineering QC versus domain validation

Runtime QC proves that code compiles/runs and that provider/storage contracts behave as specified. It does not establish that a screenplay diagnosis is useful or matches human reader experience.

For phases with an optional domain pilot:

1. run normal engineering/runtime QC;
2. generate the in-scope canonical evaluation packet/reference rendering;
3. verify source/evidence/provenance integrity;
4. record the human review as performed or skipped; if skipped, retain visible validation debt without blocking phase completion;
5. record any actual domain-review outcome separately from runtime status.

Do not conflate a green Mix/CI run with dramaturgical validation.