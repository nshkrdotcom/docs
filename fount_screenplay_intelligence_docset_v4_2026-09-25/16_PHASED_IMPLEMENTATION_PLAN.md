# Phased Implementation Plan

The program has sixteen phases. Documents 33 and 36 define writer outcomes and demonstrations for every phase. Phases 12–15 complete discovery, cinematic/voice work, notes/research/revision, and read/share/usefulness workflows. Phase 16 is final acceptance. Preserve existing useful writing operations throughout the earlier engineering work.

## 1. Operating model

This implementation program is intentionally designed for repeated handoff between two environments:

### Offline implementation agent

Has the complete source snapshots but **no usable Elixir runtime**. It can inspect source/dependency APIs and write files, but it cannot truthfully claim Mix/Postgres/provider/runtime checks passed.

Every phase implementation prompt supplies:

1. `fount.xml`;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `docset.xml`, containing this complete current docset.

The agent implements exactly the current phase, updates the docset progress/handoff records, and returns:

- one ZIP overlay containing **only new/modified/deleted-file instructions relative to the supplied Fount snapshot**;
- the updated docset ZIP;
- a phase handoff/QC prompt describing what was written, what was not executed, and what runtime verification is required.

### Runtime-QC agent/environment

Has Elixir/OTP and any required Postgres/provider access. The user has already applied and committed the overlay and updated docset. Codex verifies that applied state, compiles/tests/fixes the phase, performs runtime checks, updates the handoff/QC report and `PROGRESS.md`, and produces the next source snapshot. It does not reapply the ZIP. See document 35.

A phase does not advance merely because offline code was written. It advances only after runtime QC records the phase as complete.

## 2. Greenfield direct-replacement rule

This program contains **no compatibility phase**.

Specifically:

- Phase 1 directly supersedes and deletes `fount_probe`;
- no `FountProbe` shims or delegates are written;
- no old/new dual paths exist;
- no analysis-data migration program is implemented;
- no compatibility schema readers are implemented;
- no numeric domain API/lens schema variants such as `v1`/`v2` are introduced;
- later phases improve the final architecture rather than slowly cutting over from Probe.

This is an unpublished greenfield codebase. Spend effort on the correct final architecture.

## 3. Phase completion convention

Each phase has:

```text
Goal
Entry criteria
Source inspection requirements
Implementation scope
Explicit non-goals
Required tests to write
Offline static checks
Overlay expectations
Runtime-QC requirements
Docset updates
Exit criteria
```

If source inspection disproves a proposed module/function name, the agent corrects the implementation while preserving the phase's architectural contract and records the correction in `DECISIONS.md` when architectural.

---

# Phase 1 — Direct Architecture Supersession and `fount_probe` Removal

## Goal

Establish the final four-package physical topology immediately and remove `fount_probe` without compatibility scaffolding, while preserving the current valuable Probe behavior and existing Workshop writer-facing behavior.

Final package set after this phase:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

## Entry criteria

- current Fount Repomix includes complete `fount`, `fount_probe`, and `fount_workshop` source/tests/guides;
- current SDK snapshots supplied;
- this docset marks Phase 1 as next.

## Source inspection requirements

Before writing code, inventory:

- all `FountProbe` production modules;
- all Probe tests;
- all `FountProbe` references in Workshop/root code/docs/tasks;
- root workspace package list/dependencies;
- actual TypeSafe SDK public API in supplied snapshot;
- actual Inference API used by Workshop;
- existing Fount query/slice/report/persistence primitives that can replace generic Probe helpers.

Update the Phase-1 handoff with a complete ownership classification as required by `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`.

## Implementation scope

### Create `packages/fount_observe`

Minimum complete baseline:

- Mix project/readme/license/changelog/docs assets consistent with workspace conventions;
- `Observation`, `Distribution`, `EvidenceRef`, request/error contracts;
- closed sensor/projection registry;
- lens asset loader/content hashing;
- measurement-specific projections;
- TypeSafe provider adapter using supplied `system_one_sdk` API;
- executor with request IDs, deterministic reassembly, concurrency/timeouts/error normalization;
- analytical budget primitive;
- L1 cache behavior + memory implementation;
- deterministic Sandbox/fixture adapter;
- replacement atomic measurement behavior required by current Probe tools.

### Create `packages/fount_intelligence`

Minimum complete baseline:

- Mix project/readme/license/changelog/docs;
- pure-core namespaces and shell namespaces;
- architecture-enforcement gate scaffold;
- story/inventory/search/investigation/reporting surfaces necessary to replace current Probe callers;
- migrated current knowledge/access/continuity/dependency/scene/dialogue/voice/action/comparison/counterfactual/strategy-contrast behavior at least to existing functional coverage;
- playbook/registry surface replacing Probe's closed tool catalog;
- source-grounded reporting/evidence validation;
- no compatibility wrapper API.

### Refactor `fount_workshop`

- remove `{:fount_probe, ...}` dependency;
- add `fount_intelligence` dependency;
- replace all Probe projection/report/analysis calls with Fount/Intelligence equivalents;
- move any Probe completion/generative helper functionality to Workshop-owned modules;
- preserve existing candidate/review/acceptance/render/recovery/rewrite workflows.

### Keep `fount` focused

Only add generic query/slice/evidence/persistence primitives where current source proves they are substrate concerns independent of analysis.

### Delete Probe

Overlay deletion manifest must remove:

```text
packages/fount_probe/**
```

and all workspace references.

## Explicit non-goals

- do not implement the full expanded twelve-family architecture beyond what is required for current behavior;
- do not preserve Probe APIs;
- do not create migration adapters;
- do not create placeholder modules that just delegate to Probe;
- do not claim full calibration/research corpus completion.

## Required tests to write/move

- replacements for behaviorally meaningful Probe tests;
- Observe executor association/error tests;
- Observe Sandbox tests;
- Intelligence closed-registry/request validation tests;
- source evidence/citation validation tests;
- Workshop existing tests updated to new dependencies;
- architecture-gate tests;
- no-Probe-reference source test/check.

## Offline static checks

The offline agent can run text/structure checks only, e.g.:

```text
all new source paths present
grep shows no production FountProbe refs in resulting overlay intent
JSON assets parse using available non-Elixir tooling
module/file naming consistency
no invented SDK function unsupported by inspected snapshot
```

Do not claim `mix test`/compile success.

## Runtime-QC requirements

Runtime agent must run/fix:

- deps setup;
- format;
- compile warnings-as-errors;
- package tests;
- workspace tests;
- architecture gate;
- Credo/Dialyzer/docs/package checks per repo conventions;
- Postgres tests required by Workshop/Fount;
- small live Observe provider check when authorized;
- existing Workshop small live check when authorized;
- source scan confirming Probe package/references absent.

## Exit criteria

- `fount_probe` directory absent;
- root workspace contains only final four packages relevant to this architecture;
- Workshop builds/tests without Probe;
- existing Probe functionality preservation audit has no unreviewed items;
- architecture gate green;
- runtime QC marks Phase 1 complete.

---

## Product-validation spine for Phases 3–11

Engineering/runtime QC and dramaturgical/product validation are separate evidence classes. Under D046, human reviews are optional and never block phase completion or subsequent work.

The program uses the resource model in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`:

```text
Phase 3   StoryWorld structural/factual pilot
Phase 4   first-reader checkpoint pilot
Phase 5   diagnosis/playbook usefulness pilot
Phase 6   scene/agency/character/relationship human-reviewed cases
Phase 7   audience/sequence/dialogue/setup-payoff human-reviewed cases
Phase 8   emotional/theme/genre/revision human-reviewed cases
Phase 9   end-to-end writer workflow review
Phase 11  scaled calibration, robustness, disagreement, model/provider comparison
```

Early pilots are exploratory. They catch wrong constructs and unusable output before those mistakes become dependencies. They are **not** population-level validation.

For phases with an optional human/domain pilot, runtime QC preserves any in-scope evaluation packet/reference rendering and records the study as performed or skipped. Engineering-clean phases reach `COMPLETE` without a human pilot. Skipped reviews remain visible validation debt; no separate override is needed under D046.

The reference writer-facing semantics are defined by `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.

# Phase 2 — Observe Measurement Substrate Hardening

## Goal

Turn the Phase-1 Observe replacement into the durable measurement substrate required by all later capabilities.

## Implementation scope

- finalize leaf provider-neutral `MeasurementResult`, `Observation`, distribution, target, evidence, and error contracts;
- separate reusable MeasurementResult identity from revision-bound Observation provenance;
- finalize lens asset format without numeric compatibility versions;
- add explicit output-contract logical identity + canonical data-shape digest;
- fail closed on stale output-contract digest rather than adding compatibility readers;
- projection registry and canonical dependency/provenance tracking;
- separate semantic input payload from provenance envelope;
- Observe-owned typed neutral measurement primitives;
- serializable `%Fount.Observe.Context{}` envelope with lens-declared closed slots;
- strict runtime input-contract validation and canonical context serialization;
- calibration asset handling;
- raw normalized distribution preservation;
- request/state size limits;
- provider timeout/retry/partial error semantics;
- exact measurement-spec/input/model fingerprinting;
- model-identity stability classification for durable reuse;
- L1 MeasurementResult cache/ETS implementation;
- project/studio cache namespace support where required for privacy;
- budget accounting;
- deterministic/human/imported observation paths;
- first-class Sandbox fixture loader;
- live example/docs;
- provider payload minimization and secret redaction;
- resource-estimation metadata required for playbook preflight (target/state/request size signals where available);
- declarative-lens static validation hooks required by `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`, without opening executable registries.

## Tests

- output-contract digest is based on canonical data shape, not module source/docstrings;
- stale contract rejects/reacquires rather than adapting;
- context-slot validation rejects missing/unknown/malformed slots;
- canonical context serialization is deterministic;
- cache key sensitivity to semantic input/lens/contract/model/params;
- cache key excludes revision-only provenance;
- context change in an unchanged scene causes contextual measurement miss;
- cached MeasurementResult materializes a fresh current-revision Observation;
- provider response normalization;
- duplicate/missing association;
- budget exhaustion;
- state-too-large;
- raw distribution retention;
- mutable model aliases do not silently qualify for stable durable reuse;
- Sandbox deterministic playbook support;
- credential redaction;
- declarative assets cannot name arbitrary executable modules/functions/provider endpoints/credentials;
- asset-requested budgets cannot exceed host caps.

## Runtime QC

Include representative TypeSafe/Jev live proposition/choice/score calls if supported and authorized, endpoint/key configurability, exact provider/model fingerprint capture available from the supplied SDK/runtime, and no-secret logs.

## Exit criteria

Observe's public surface is stable enough that later Intelligence phases depend on leaf contracts and the high-level acquisition facade, not provider internals. Cross-revision reuse is proven to reuse MeasurementResults without carrying stale revision provenance.

---

## Phase 2 delivery checkpoint

Phase 2 is OFFLINE_IMPLEMENTED. The complete scope mapping, tests, demonstration,
source identities and required runtime repair are in the `PHASE_02_*` handoffs.
Do not restart Phase 1 or begin Phase 3. New source is not a runtime pass; the
historical Phase 1 waiver does not waive this phase's measurement acceptance.

# Phase 3 — Story-World Pure Core

## Goal

Implement `Fount.Intelligence.StoryWorld` as a provider-free interpreted narrative model that separates presentation order, diegetic story-time constraints, and causality.

## Scope

- entities/mentions/events/interactions;
- assertions/facts;
- goals/objectives;
- commitments/obligations;
- possessions/access/resources;
- diegetic character knowledge/belief/suspicion representation;
- presentation points for when events/facts are shown/referenced;
- narrative/reality scopes where needed (base story, recollection, dream, hypothetical, alternate/contested material);
- partial story-time constraint graph over events/intervals;
- evidence-backed relations such as before/after/meets/overlaps/same-time/during/contains/start/end relationships;
- unknown/ambiguous relation sets without fabricated total order;
- typed causal graph separate from story-time relations;
- state-transition preconditions/postconditions;
- practical temporal consistency checks without promising a general interval theorem prover;
- beat interpretations;
- motifs/promises where story-world appropriate;
- competing interpretations;
- source/evidence dependencies;
- pure compilation from canonical values + observations;
- query API;
- counterfactual support primitives;
- connected dependency/recomputation model;
- source-grounded StoryWorld inspection packet compatible with `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- deterministic Markdown/JSON reference rendering sufficient for domain review.

## Tests

All tests use canonical fixtures + frozen observations. No provider or Repo required.

Required cases include:

- a flashback does not inherit later-presented diegetic state;
- death/injury/possession state is event/story-time qualified;
- simultaneous/overlapping events need no fabricated order;
- unknown chronology remains unknown;
- temporal contradiction detection cites evidence;
- ambiguous chronology abstains rather than forcing a conclusion;
- dream/hypothetical/alternate scope does not silently corrupt base-story state;
- causal direction remains independent from presentation/story-time order.

## Domain pilot

Optionally run the Phase-3 structural/factual pilot from `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md` using rights-cleared material. The pilot must review source grounding, event/fact/state correctness, ambiguity handling, and usefulness of the reference presentation.

Do not claim human reader-response validation in this phase.

## Exit criteria

Story-world compilation/query is deterministic, replayable, source-grounded, architecture-gate clean, no API assumes that story chronology is a single scene-ordinal sequence. The optional structural/domain pilot recorded if performed and otherwise listed as unperformed validation debt.

---

# Phase 4 — Temporal Views and Forward-Reader Engine

## Goal

Implement presentation-order Reader reduction plus qualified diegetic state/trajectory views over the StoryWorld temporal/causal model.

## Scope

### Diegetic/temporal views

- qualified character-state views;
- relationship-state views;
- setup/payoff ledger;
- character knowledge/belief/suspicion queries at event/story-time scope;
- commitments;
- resource/possession/access state;
- sequence state/views with explicit ordering semantics;
- materialized sparse views where constraints justify them;
- dependency refs for recomputation;
- no requirement for one universal chronological reducer.

### Reader / discourse engine

- strict forward-only reader state;
- open questions;
- expectations;
- promises;
- threats;
- reveal state;
- reader-visible model of what characters know/believe;
- suspense components;
- curiosity;
- surprise opportunity/realization;
- comprehension/confusion risk, including temporal disorientation;
- emotional-alignment hypotheses;
- reader-visible character/relationship trajectories;
- scene-to-scene forward-pull data.

## Tests

- future presentation mutation cannot alter earlier reader snapshots;
- deterministic replay;
- flashback insertion can change reader interpretation without rewriting impossible diegetic chronology;
- reader model of character knowledge can differ from diegetic character knowledge;
- asymmetric relationships;
- setup/payoff lifecycle;
- reader-character knowledge differentials;
- question open/reinforce/resolve/abandon;
- presentation suffix recomputation boundaries;
- story-time connected-region recomputation behavior.

## Domain pilot

Optionally run the first-reader checkpoint pilot defined by `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.

The packet must keep distinct:

- canonical facts;
- deterministic Reader ledger state;
- model-estimated reader interpretations;
- any genuinely human-calibrated response claim.

Use first-exposure prefixes and prevent future-scene leakage. Record disagreement rather than forcing consensus.

## Exit criteria

Reader and temporal/story-world views have no acquisition/persistence dependencies, pass forward-leak and non-linear-story correctness gates, state explicitly whether each trajectory is presentation-relative or diegetic/story-time-qualified; the optional first-reader pilot is recorded if performed and otherwise remains visible validation debt.

---

# Phase 5 — Diagnosis and Multi-Pass Playbook Shell

## Goal

Implement evidence-composed diagnosis plus the imperative Intelligence shell that can acquire missing evidence through Observe without contaminating the pure core.

## Scope

- concern model;
- diagnosis support/counterevidence/missing-evidence/alternatives;
- abstention/uncertainty;
- protected strengths;
- next-investigation requirements;
- Acquisition planner;
- multi-pass observe -> pure reduce/query -> context build -> observe -> pure reduce/diagnose loop;
- conversion from Intelligence state into Observe-owned neutral context primitives;
- closed lens-declared context slot validation;
- Playbook registry;
- run/budget/coverage tracking;
- Intelligence report/export;
- deterministic Sandbox integration;
- baseline playbooks: Scene Doctor, Dialogue Pass, Character Trajectory, Relationship Pass, Suspense Audit, Sequence Momentum, Setup/Payoff, Notes Diagnosis, Submission Read, Revision Regression;
- normative writer-facing result packet from `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- deterministic reference renderer for playbook results;
- resource preflight/cap enforcement and post-run usage reporting per `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.

## Tests

- pure core returns evidence needs without calling Observe;
- shell converts Intelligence state to Observe context without passing Intelligence structs;
- invalid/unknown context slots fail before acquisition;
- Sandbox drives multi-pass playbook deterministically;
- competing diagnoses coexist;
- missing evidence produces investigation, not forced conclusion;
- playbook partial coverage explicit;
- core-to-shell and core-to-Observe-execution architecture violations fail the gate;
- writer packet keeps evidence/state/diagnosis/strategy distinct;
- preflight estimate respects host caps and actual usage is reported;
- partial-budget runs do not present skipped work as passed.

## Domain pilot

Optionally run the diagnosis/playbook usefulness pilot from `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`. At minimum, experienced screenwriting/story reviewers assess support/validity separately from usefulness, clarity, alternative-awareness, intent preservation, uncertainty honesty, and over-prescriptiveness.

## Exit criteria

The old Probe plan/execute/explain intent is fully superseded by multi-pass playbooks and diagnoses while the pure core remains provider/persistence free; playbooks emit the writer presentation contract; the optional Phase-5 diagnosis/usefulness pilot is recorded if performed and otherwise listed as validation debt.

**Historical delivery checkpoint — 2026-09-27:** `OFFLINE_IMPLEMENTED`. The pure Diagnosis records/reducers, Acquisition planner/context bridge, two declarative Observe diagnosis lenses, ten writer-playbook catalog, multi-pass runner, resource/coverage accounting, normative writer packet, deterministic renderer, Sandbox example and focused tests are written. Elixir/runtime gates remain unrun in the source-writing environment. The optional human usefulness pilot was not run and is validation debt under D046. Phase 6 remains `NOT_STARTED`.

**Runtime QC checkpoint — 2026-09-27:** `COMPLETE` at Fount `f3a56c90842d467cf57fb3a1f2123115d7f976d2`; see `handoffs/PHASE_05_RUNTIME_QC_REPORT.md`. The optional usefulness pilot is unperformed validation debt under D046. Phase 6 remains `NOT_STARTED`.

---

# Phase 6 — Capability Completion A: Scene, Agency, Character, Relationship

## Families

1. Scene Engine
2. Agency and Causality
3. Character Trajectory
4. Relationship Dynamics

## Scope

Implement complete measurement/reasoning/diagnosis/playbook slices for all requirements in `11_CAPABILITY_CATALOG_12_FAMILIES.md`.

Must include:

- objective/opposition/stakes/urgency/tactic/turn/decision/consequence/entry-exit;
- decision->action->consequence and alternate-support reasoning;
- character goals/beliefs/adaptation/commitments/arc pattern characterization;
- diegetic versus reader-visible character-state distinction;
- trust/intimacy/leverage/status/allegiance/dependency/concealment relationship views;
- non-linear screenplay cases where relationship/character events are presented out of story-time order.

## Domain evaluation

Add corpus/fixture cases and optional annotation instructions and human-review packets for the four capability families. Use rights-cleared material and evaluate both support/validity and writer usefulness where subjective interpretation is involved.

Human-reviewed cases are optional. Product-readiness claims without them must rely on engineering evidence and avoid claiming human usefulness validation.

## Exit criteria

All four families have source-grounded outputs, deterministic core fixtures, Sandbox playbook integration, documented limitations, non-linear-story cases, Workshop usefulness mapping; optional domain-review cases are recorded if performed and otherwise listed as validation debt.

**Historical source-delivery checkpoint — 2026-09-27:** `OFFLINE_IMPLEMENTED`. Four closed Observe measurement lenses, pure Scene/Agency/Character/Relationship evaluators, exact source-in-semantic-input shell integration, non-linear fixtures, deterministic Sandbox playbook tests, writer packets and Workshop usefulness mapping are written. Offline Python/JSON/source/transport checks passed except the pre-existing missing `scripts/prune_deleted_directories.py` repository-wide discovery gap. Elixir/Mix/runtime gates are unrun. The optional human/domain review was not run and is validation debt under D046. Phase 7 remains `NOT_STARTED`.

---

# Phase 7 — Capability Completion B: Audience, Sequence, Dialogue, Setup/Payoff

## Families

5. Audience / Reader Experience
6. Sequence Movement
7. Dialogue Interaction
8. Setup / Payoff and Motifs

## Scope

Complete:

- reader question/expectation/threat/suspense/curiosity/surprise/comprehension trajectories in presentation order;
- sequence objective/escalation/reversal/change density/handoff with explicit presentation/story-time semantics where relevant;
- dialogue response/evasion/subtext/exposition/tactic/status/knowledge-asymmetry/exchange-level diagnosis;
- setup/reinforce/transform/pay/subvert/abandon lifecycle and motif/callback analysis;
- context-dependent dialogue sensors using validated Observe context primitives/slots;
- setup/payoff cases where payoff presentation order and diegetic chronology differ.

## Domain evaluation

Optional human-reviewed cases may be added for Audience/Reader, Sequence, Dialogue, and Setup/Payoff. Reader cases must use forward-exposure checkpoints; dialogue/usefulness review must distinguish factual support from writer usefulness.

## Exit criteria

Each family has complete sensor/intelligence/playbook coverage, representative revision/non-linear presentation fixtures; optional domain-review cases are recorded if performed and otherwise listed as validation debt.

---

# Phase 8 — Capability Completion C: Emotional/Value, Theme, Genre, Revision Intelligence

## Families

9. Emotional / Value Movement
10. Theme and Meaning
11. Genre Lens Packs
12. Revision Intelligence

## Scope

- practical/emotional state change and reversal;
- repeated value-conflict/choice/theme evidence;
- optional combinable mystery/thriller/horror/romance/comedy/action lens packs as initial candidates, not a closed genre-support list;
- project/studio declarative pack authoring/validation/install path from `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`;
- constrained declarative lens authoring only through registered safe measurement capabilities;
- pack trust/source metadata, resource-policy validation, and subversion/anti-genre intent;
- genre-subversion intent;
- base/candidate target-effect/collateral comparisons;
- protected-strength checking;
- strategy distinctness;
- reader/character/relationship trajectory diffs;
- causal ripple analysis;
- revision comparisons that distinguish presentation effects from diegetic/story-time continuity effects;
- no universal quality score.

## Domain evaluation

Optional human-reviewed cases may be added for Emotional/Value Movement, Theme/Meaning, Genre Packs, and Revision Intelligence. Genre review must test at least one hybrid/custom pack and one intentional subversion case.

## Exit criteria

All twelve capability families pass traceability and acceptance requirements, including the safe custom-pack workflow; optional domain-review cases are recorded if performed and otherwise listed as validation debt.

---

# Phase 9 — Workshop Intelligence Integration

## Goal

Make the analytical architecture materially improve the writer's existing creative workflows without changing the writer-controlled acceptance model.

## Scope

Preserve and enhance:

```text
Develop
TargetedRewrite
SequenceRebuild
CharacterRewrite
NoteResponse
Pass
Recover
Strategy/alternatives
Audition/combine/select/materialize
Review/rebase/accept/reject
Submission/table-read/render
```

Add/complete:

- playbook-driven diagnosis before substantial rewrites;
- note reaction/cause/treatment separation;
- diagnosis -> strategy -> candidate lineage;
- multiple causally distinct alternatives;
- analysis-guided context construction;
- pre/post candidate analysis;
- protected-strength regression checks;
- consequence propagation proposals;
- candidate evidence/review packets;
- ability to investigate without generating pages;
- writer-facing presentation contract carried intact into Workshop review/candidate packets;
- resource preflight/caps surfaced before expensive investigation/generation where the caller surface permits;
- actual resource usage/reuse attached to resulting session/review metadata where appropriate.

Workshop still uses `inference` for generation and Fount typed edits for canonical mutation.

## Domain evaluation

Optionally run an end-to-end feature-screenplay investigation/rewrite session using the human-review protocol in `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`. Evaluate whether the system helped the writer understand the concern, whether alternatives were meaningfully different, whether protected strengths survived, and whether the presentation was usable without a bespoke GUI.

## Exit criteria

Writer-facing workflows remain operational and can use Intelligence without bypassing explicit review/acceptance; the writer presentation/resource contracts survive end-to-end; the optional Phase-9 workflow review is recorded if performed and otherwise listed as validation debt.

---

# Phase 10 — Durable Analysis Persistence, Reuse, and Recomputation

## Goal

Implement L2 derived analysis storage and efficient revision-aware measurement reuse/recomputation without contaminating the pure core.

## Scope

- analysis-run persistence;
- separate durable MeasurementResult and Observation/provenance records where storage is justified;
- optional durable L2 MeasurementResult cache;
- content-addressed project lens/calibration/playbook assets;
- no numeric domain versions;
- output-contract ID/digest persistence;
- cache privacy namespaces;
- model-fingerprint stability policy;
- no semantic cache-row deletion on edits;
- resource eviction policy distinct from analytical recomputation;
- StoryWorld connected-region recomputation;
- reader presentation-suffix recomputation;
- diagnosis/report dependency recomputation;
- candidate analysis history;
- report export;
- current-revision source-span/evidence rematerialization;
- retention versus cache policy;
- durable resource-usage history sufficient for longitudinal estimates;
- durable project/studio declarative pack/lens assets only where host policy enables them, with trust/source/content-hash metadata and no executable code loading.

## Tests/QC

Include database integration tests and scenarios proving:

- unchanged semantic input can reuse MeasurementResult across revisions;
- changed upstream context causes a miss even when target text is unchanged;
- old revision provenance is never returned as the current Observation;
- asset/output-contract/model/context changes miss naturally;
- mutable model alias policy is enforced;
- cache storage isolation policy prevents unintended cross-project reuse;
- reader/StoryWorld recomputation frontiers are correct;
- historical audit identity remains exact.

---

# Phase 11 — Scaled Calibration, Evaluation Corpus, Robustness, and Live Verification

## Goal

Implement systematic calibration, robustness, disagreement, and regression evaluation where evidence exists. Earlier human/domain pilots are optional and may be absent.

## Scope

- representative screenplay/corpus fixture framework;
- multiple human-reader annotation support;
- disagreement preservation;
- calibration/evaluation metrics by lens type;
- abstention policy;
- model drift comparisons;
- frozen MeasurementResult/Observation reasoning benchmarks;
- fixture manifests that pin current output-contract digests;
- explicit regeneration workflow when an output contract changes;
- human labels stored at stable semantic levels rather than obsolete provider encodings where practical;
- reader checkpoint annotations;
- non-linear story-time/continuity benchmark cases;
- capability-specific benchmark suites;
- failure/timeout/budget/security hardening;
- Observe live QC;
- Workshop small live generation QC;
- cost/usage reporting and longitudinal preflight-estimate calibration;
- rights/provenance corpus manifests and provider-export policy checks;
- support/validity versus writer-usefulness evaluation kept separate;
- no secret leakage.

## Exit criteria

Core lenses/capabilities have executable evaluation notes/fixtures, any actual early-pilot findings have been incorporated, discovered regressions become permanent tests, and scaled human/corpus claims are documented at their actual level of evidence. Contract-shape changes fail stale generated fixtures visibly and require regeneration rather than compatibility decoding.

---

# Phase 12 — Discovery, Session Modes, and Scene Exploration

Implement the complete Phase 12 brief in `36_PRODUCT_PHASES_AND_ACCEPTANCE_SCENARIOS.md`: W01–W03/W11, source mappings, tests, and runnable example; human review is optional. Exit requires the fragment-to-scene and resume demonstrations, with no mandatory outline or analysis funnel.

# Phase 13 — Cinematic Revision, Rehearsal, and Voice

Implement the complete Phase 13 brief in document 36: W04–W06, visual/sound passes, voice protection, and noncanonical rehearsal. Exit requires actual candidate comparisons and mechanical evidence, not only generated explanations of success; human review is optional.

# Phase 14 — Research, Notes, and Consequential Revision

Implement the complete Phase 14 brief in document 36: W07–W09, research provenance, conflicting/stale notes, revision consequences, and stale-candidate protection. Exit requires the note/reveal demonstrations; collaborator review is optional.

# Phase 15 — Read, Share, Resume, and Prove Usefulness

Implement the complete Phase 15 brief in document 36: W01/W10–W12 and whole-workflow integration. Exit requires human-only and agent-assisted paths, clean export, and session recovery. The human comparison study is optional; if skipped, record no human usefulness claim.

# Phase 16 — Final Integration, Documentation, Package Readiness, and Acceptance

## Goal

Close the program with one coherent four-package product and no superseded architecture residue.

## Scope

- final workspace dependency audit;
- final internal Core/Shell boundary gate;
- final allowed Observe-contract dependency audit;
- final forbidden-MFA/determinism gate;
- final `FountProbe`/`fount_probe` scan;
- final old package-name scan (`fount_analysis`, `fount_semantics`, etc. should not exist as packages/dependencies);
- final content-contract/versioning scan (no compatibility generations/readers);
- final cache/provenance identity audit;
- final non-linear temporal/reader property suite;
- remove dead files/config/deps/docs;
- top-level/package READMEs/guides/examples;
- API docs grouping;
- package file allowlists and Hex inspection where publishability is intended;
- complete capability/Probe/functionality traceability audit;
- final runtime QC;
- final writer-presentation/reference-renderer audit;
- final domain-validation/corpus-rights/resource-logistics audit;
- final safe declarative lens/pack authoring/install audit;
- final longitudinal resource-estimation/cap audit;
- final feature-film scope/non-claim audit;
- final live checks when authorized;
- update `PROGRESS.md` to complete.

## Final exit criteria

Every criterion in `19_ACCEPTANCE_CRITERIA.md` passes, `23_FUNCTIONALITY_PRESERVATION_AUDIT.md` has no missing behavior, and W01–W12/A01–A12 in documents 33/36 have source/test/demonstration evidence. Do not claim market leadership or creative superiority without comparative evidence.

---

# 4. Phase handoff state machine

Each phase has only these states in `PROGRESS.md`:

```text
NOT_STARTED
OFFLINE_IMPLEMENTED
QC_BLOCKED
QC_IN_PROGRESS
DOMAIN_REVIEW_PENDING
COMPLETE
```

`OFFLINE_IMPLEMENTED` does **not** mean tests passed. `DOMAIN_REVIEW_PENDING` remains a historical status; under D046, missing human review alone no longer keeps an engineering-clean phase pending.

The next phase may begin when the prior phase is `COMPLETE` on applicable non-human gates. Optional human review never blocks sequencing; any unperformed study remains visible validation debt and cannot support a human-validation claim.

# 5. Overlay contract

Every offline implementation ZIP contains repository-relative paths only.

New/modified files are included as files.

All operations are listed in the strict archive manifest:

```text
handoff/fount-overlay.manifest.json
```

Use exact repository-relative paths and original/result byte hashes as specified in document 35 and the actual Fount applier. Phase 1 enumerates each Probe deletion. No globs, unlisted payloads, or deletion inferred from omission.

No `_build`, `deps`, secrets, generated docs, local DB dumps, or environment files are included.

# 6. Docset update contract

At every phase, the offline agent updates:

- `PROGRESS.md`;
- `DECISIONS.md` for actual product, workflow, or architecture decisions/corrections;
- `TRACEABILITY_MATRIX.md` for implemented requirements;
- current phase handoff under `handoffs/`;
- any implementation document proven inaccurate by source inspection.

The runtime-QC agent then updates the same progress/handoff with actual executed results and corrections before producing the next source snapshot.