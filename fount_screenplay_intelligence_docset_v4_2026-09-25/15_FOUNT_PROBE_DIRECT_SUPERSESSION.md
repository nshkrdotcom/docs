# `fount_probe` Direct Supersession

## 1. Decision

`fount_probe` is removed as a package. Its valuable behavior is reimplemented under the correct owners; its package/API shape is not preserved.

This repository is greenfield and unpublished. There is no reason to spend implementation effort on a compatibility period.

Therefore this plan explicitly rejects:

- shims named `FountProbe.*`;
- delegating wrappers;
- dual-running old and new engines;
- feature flags selecting Probe versus new architecture;
- old request/report/profile schema support;
- migration adapters for old local development analysis data;
- deprecation periods;
- staged public-API cutover.

Phase 1 performs direct supersession in one overlay and deletes `packages/fount_probe` before the phase is considered complete.

## 2. Preserve behavior, not package boundaries

The current Probe code is useful source material. Its strongest properties must survive:

- closed executable tool surface;
- validated requests;
- exact canonical source/evidence identity;
- deterministic result association for batched provider calls;
- separate generative vs analytical budgets;
- provider failures distinguished from semantic uncertainty;
- probability distributions and decision-policy ideas;
- context/state size limits;
- knowledge/access reasoning;
- causal/dependency analysis;
- continuity analysis;
- scene mechanics;
- dialogue/voice/action analysis;
- revision comparison;
- scene lift and counterfactual ablation;
- strategy contrast;
- structured investigations;
- evidence-backed explanations;
- saved analysis/report concepts where still useful;
- current tests that encode product behavior rather than obsolete API names.

## 3. Direct ownership map

### Measurement -> `fount_observe`

Current Probe areas to mine/reimplement:

```text
Jev
Writing.Executor
Writing.DecisionPolicy (measurement/calibration portions)
Profile (lens/calibration asset semantics only)
Projection (measurement-specific projection portions)
State (measurement request/state portions)
Budget (analytical acquisition portions)
Writing.Evidence (observation evidence portions)
Launcher/client construction (provider portions)
semantic retrieval filtering
atomic portions of Knowledge/Access/Continuity/Dependencies/
SceneMechanics/Dialogue/Voice/Action/StrategyContrast/Constraints
```

No module names are retained for compatibility.

### Interpretation/investigation -> `fount_intelligence`

Current Probe areas to reimplement/subsume:

```text
Catalog -> playbook/sensor registries and capability surfaces
Investigation -> playbook plan/run/report flow
Report -> Intelligence report/diagnosis/playbook-run records
KnowledgeTrace / locate boundary -> knowledge + reader timelines/diagnoses
Access -> knowledge/access reasoning
Continuity -> story-world/temporal continuity diagnoses
Dependencies -> causal graph + setup/payoff ledger + counterfactual reasoning
SceneMechanics -> scene-engine capability
Dialogue -> dialogue-interaction capability
Voice -> character/dialogue capability
Action -> action/readability capability
Comparison -> revision intelligence
scene_lift -> counterfactual/revision playbook
ablate -> counterfactual reasoning/playbook
StrategyContrast -> strategy distinctness diagnosis
Search/Retrieval -> query + semantic acquisition + Intelligence search playbook
Inventory/Extraction -> Fount canonical query plus Intelligence story extraction/reporting
SavedRecords -> L2 analysis persistence if behavior remains useful
```

### Creative/generative -> `fount_workshop`

Current Probe functionality that exists only because Probe became a convenient dependency must move to Workshop:

```text
Completion/generative repair helpers
candidate-generation prompt support
layout/report helpers used only by Workshop review flows
creative constraints tied to candidate authorization
```

Workshop continues to use `inference` directly through its own generation boundary.

### Canonical substrate -> `fount` only if intrinsically general

Some Probe projection/selection helpers may expose missing canonical query/slice primitives. Move only the smallest general primitive into `fount` if it passes this test:

> Would the function still belong in Fount if no analysis packages existed?

Do not move screenplay theory or model-facing state into core.

## 4. Current closed tools and replacement behavior

The current 16 Probe tool intents all survive functionally:

| Current tool intent | New location / surface |
|---|---|
| inventory | canonical Fount query + Intelligence inventory/story-world report |
| extract_story | Intelligence extraction/story-world playbook using Observe as needed |
| search | Fount exact/lexical query + Observe semantic measurement + Intelligence search result |
| check_constraints | split among canonical validation, Intelligence diagnosis, Workshop candidate policy |
| knowledge_trace | Intelligence knowledge timeline + Observe belief/inference/access measurements |
| locate_boundary | Intelligence temporal/reader boundary query |
| dependencies | Intelligence causal graph/setup-payoff + Observe support measurements |
| continuity | Intelligence continuity timeline/diagnosis + deterministic/Observe measurements |
| scene_mechanics | Scene Engine capability |
| dialogue | Dialogue Interaction capability |
| voice | Character/Dialogue capability with Observe voice sensors |
| action | Scene/Action capability with Observe action sensors |
| compare | Revision Intelligence |
| scene_lift | Counterfactual/Revision Intelligence playbook |
| ablate | Counterfactual engine/playbook |
| strategy_contrast | Diagnosis/Workshop strategy distinctness check |

This mapping preserves functionality without preserving request names or old public schemas.

## 5. Test migration rule

Every current Probe test is classified:

```text
BEHAVIORAL -> recreate/move assertion under new package owner
OBSOLETE-API-ONLY -> delete after equivalent behavior is covered elsewhere
BUG-REGRESSION -> preserve as a regression fixture/test
LIVE-PROVIDER -> recreate against fount_observe public provider path
```

Do not copy test modules merely to maintain `FountProbe` names.

Examples of behavior worth preserving from current tests include:

- private action does not automatically grant knowledge/access;
- continuity reacts to changed targets;
- same-scene dependencies work;
- exact search behavior remains exact;
- completion repair/structured validation remains on Workshop side;
- invention policy remains explicit;
- knowledge/reveal behavior preserves chronology;
- typed constraint targets reject malformed inputs;
- request/state association is deterministic;
- profile-threshold behavior is replaced by calibrated lens/policy tests, not old profile compatibility.

## 6. Workshop call-site replacement

The current `fount_workshop` source directly uses Probe in several places. Phase 1 must search all references rather than rely on a static list.

Expected replacements include:

```text
FountProbe.Projection.select
  -> Fount query/slice or Intelligence/Observe selection API depending on purpose

FountProbe.Report.new
  -> Intelligence/Workshop review report type appropriate to the call

FountProbe inspection calls
  -> Fount.Intelligence playbook/query calls

FountProbe completion helpers
  -> FountWorkshop.Writing.Completion/Generation equivalents
```

After Phase 1:

```bash
grep -R "FountProbe\|fount_probe" packages mix.exs README.md
```

must return no production/documentation dependency except historical notes inside this implementation docset if explicitly discussing the superseded source.

## 7. CLI and Mix tasks

Current Probe CLI/tasks are not preserved by name for compatibility.

Retain useful user-facing operations under the new architecture, for example:

```text
mix fount.observe ...       # low-level measurement/debug only if useful
mix fount.analyze ...       # Intelligence/playbook surface
mix fount.search ...        # preserve useful search UX if desired, backed by new stack
```

Exact task names should follow current Fount naming conventions and product usefulness. The agent should not create commands solely because Probe had them.

## 8. Documentation replacement

Probe-specific architecture guides are deleted with the package. Their useful conceptual material is incorporated into:

- Observe README/guides;
- Intelligence README/guides;
- Workshop guides;
- top-level workspace README.

No docs should instruct users to depend on Probe after Phase 1.

## 9. No data migration obligation

If current Probe has saved-record schemas or development data, they are not a public compatibility contract.

The new L2 analysis persistence is designed correctly for the final architecture. Local test/dev data may be reset. Do not create old-record translators unless the current source reveals data that is required by the repository's own tests/fixtures and cannot simply be regenerated.

## 10. Phase-1 completion gate

Direct supersession is complete only when runtime QC confirms:

1. `packages/fount_probe` is gone;
2. root workspace no longer lists it;
3. `fount_workshop` no longer depends on it;
4. no production module references `FountProbe`;
5. current valuable Probe tests have explicit replacements or recorded deletion rationale;
6. existing Workshop tests still cover writer-facing behavior under new dependencies;
7. Observe provider tests cover the analytical provider path;
8. Intelligence tests cover migrated investigation/analysis behavior;
9. docs/tasks/examples use new package names;
10. compile/tests/static gates pass in the real Elixir environment.

There is no later "retirement phase." Deletion happens here.

## 11. Later phases are expansion, not migration

After Phase 1, the repository already has its final physical topology:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

Subsequent phases deepen semantics, temporal/reader state, diagnoses, capability families, persistence, calibration, and Workshop intelligence. They never reintroduce Probe or maintain parallel architectures.