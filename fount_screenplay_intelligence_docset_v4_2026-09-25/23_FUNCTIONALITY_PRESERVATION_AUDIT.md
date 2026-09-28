# Functionality Preservation Audit

## 1. Purpose

The architecture changed substantially between the original docset and this revision. This document prevents architectural simplification from accidentally deleting product capability.

Two baselines are authoritative inputs to the audit:

1. the complete original screenplay-intelligence implementation docset;
2. the supplied current Fount Repomix, including `fount`, `fount_probe`, and `fount_workshop` source/tests/guides.

The rule is:

> Preserve or improve behavior; do not preserve superseded package/API shapes merely for compatibility.

## 2. Intentional removals

These are deliberately **not** preserved:

- physical packages `fount_analysis`, `fount_semantics`, `fount_temporal`, `fount_reader`, `fount_diagnose`, and `fount_playbooks` from the original docset;
- `fount_probe` as a package;
- `FountProbe.*` public module names;
- Probe request/profile/report schemas as compatibility contracts;
- old/new dual paths;
- compatibility shims/delegates;
- numeric domain asset versions and `.v1`/`.v2` names;
- migrations for unpublished/development-only old analysis data;
- a slow Probe retirement/cutover program.

Their useful **functionality** is mapped below.

## 3. Original conceptual layers -> final ownership

| Original logical layer | Preserved? | Final owner |
|---|---:|---|
| Canonical screenplay | yes | `fount` |
| Semantic story world | yes | `Fount.Intelligence.StoryWorld` |
| Atomic observations | yes | `fount_observe` |
| Temporal state | yes | `Fount.Intelligence.Temporal` |
| Reader state | yes | `Fount.Intelligence.Reader` |
| Diagnosis | yes | `Fount.Intelligence.Diagnosis` |
| Playbooks | yes | `Fount.Intelligence.Playbooks` |
| Creative revision | yes | `fount_workshop` |
| Shared analysis-kernel package | no physical package | stable Observe contracts + internal Intelligence contracts |

Nothing substantive in the layer model is deleted; conceptual layers become namespaces where physical separation was unnecessary.

## 4. Twelve capability families

All twelve original capability families remain required.

### 1. Scene Engine

Preserved scope:

- objective;
- opposition/constraint;
- stakes/cost of failure;
- urgency/why-now;
- tactic and tactic changes;
- scene turn/reversal;
- decision/commitment;
- consequence;
- information/reveal;
- entry/exit economy;
- scene function and neighboring-sequence implications.

Final ownership:

```text
Observe -> atomic scene measurements
Intelligence -> scene state/reducer/diagnoses/Scene Doctor
Workshop -> selected scene rewrite treatments
```

### 2. Agency and Causality

Preserved scope:

- who causes events;
- decision -> action -> consequence chains;
- reactive versus initiating behavior;
- causal support;
- alternate support;
- plot-convenience hypotheses;
- scene-lift/counterfactual reach;
- revision-caused broken support.

### 3. Character Trajectory

Preserved scope:

- global/sequence/scene/local goals;
- beliefs/knowledge/suspicion;
- plans/tactics;
- commitments/obligations;
- decisions;
- caused consequences;
- adaptations;
- repeated defenses/avoidances;
- arc pattern characterization without one required arc shape.

### 4. Relationship Dynamics

Preserved scope:

- trust;
- intimacy;
- allegiance;
- dependency;
- leverage/status;
- attraction;
- resentment;
- obligation/debt;
- openness/concealment;
- asymmetric knowledge;
- transition/stasis/reversal.

### 5. Audience / Reader Experience

Preserved scope:

- strict forward-reading model;
- open questions;
- expectation;
- anticipation;
- suspense;
- curiosity;
- surprise;
- comprehension/confusion risk;
- threat awareness;
- reader/character knowledge differential;
- emotional alignment hypotheses;
- desire-to-continue proxies/holistic evaluation support;
- reveal timing.

### 6. Sequence Movement

Preserved scope:

- sequence objectives;
- escalation dimensions;
- repeated function;
- reversals;
- state-change density;
- accumulated consequences;
- local climax;
- handoff pressure into next sequence;
- sag/stall diagnoses without imposing a universal curve.

### 7. Dialogue Interaction

Preserved scope:

- response/evasion;
- subtext/direct intention;
- exposition;
- repetition/redundancy;
- tactic;
- tactic changes;
- status/leverage exchanges;
- knowledge asymmetry;
- conversational power;
- turn/scene context rather than isolated line grading.

### 8. Setup / Payoff and Motifs

Preserved scope:

- setup lifecycle;
- reinforcement;
- transformation;
- payoff;
- subversion;
- abandoned/orphaned setups;
- unsupported payoff;
- promise/threat/rule/object/behavior/information setup types;
- motif/echo/callback tracking;
- revision breakage.

### 9. Emotional / Value Movement

Preserved scope:

- opening/closing condition;
- meaningful gains/losses;
- polarity/value changes where appropriate;
- reversals;
- temporary versus durable change;
- earned versus merely verbal change hypotheses;
- no universal requirement that every scene invert polarity.

### 10. Theme and Meaning

Preserved scope:

- recurring value conflicts;
- choices revealing values;
- motif/theme evidence;
- competing thematic interpretations;
- relation between ending consequences and earlier value conflicts;
- no single theme score;
- "meaning/magic" remains holistic/human-facing rather than falsely objective.

### 11. Genre Lens Packs

Preserved scope:

- mystery;
- thriller;
- horror;
- romance;
- comedy;
- action;
- optional/combinable lenses;
- writer anti-genre/subversion intent;
- no genre formula as canonical law.

### 12. Revision Intelligence

Preserved scope:

- base/candidate comparisons;
- whether a revision addressed a target concern;
- protected strengths;
- collateral damage;
- new contradictions;
- causal ripple effects;
- reader-state trajectory changes;
- strategy distinctness;
- note -> diagnosis -> strategy -> candidate lineage;
- before/after analytical packets.

## 5. Industry-evaluation research functionality

`01_INDUSTRY_EVALUATION_AND_READER_CRITERIA.md` remains normative research context for coverage design.

Preserved broad reader dimensions include:

- story journey/shape;
- emotional connection;
- distinctive voice;
- vivid/specific characters;
- character change or meaningful testing;
- tension/conflict;
- character-caused story action;
- desire to continue reading;
- theme/meaning;
- freshness/originality hypotheses;
- holistic "meaning and magic" that the system must not reduce to a fake scalar.

These inform playbooks, corpus design, and human evaluation; they do not become one automated score.

## 6. Emergent reader-experience functionality

`02_EMERGENT_READER_EXPERIENCE_OVER_TIME.md` remains fully required.

Preserved concepts:

```text
anticipation
escalation
character trajectory
emotional movement
unresolved-question accumulation
relationship evolution
payoff satisfaction
scene-to-scene forward pull
suspense
curiosity
surprise
comprehension load
transport/alignment hypotheses
expectation management
reader fatigue/saturation hypotheses
```

The architectural change is only that Reader and Temporal are internal Intelligence namespaces.

## 7. Notes/diagnosis philosophy functionality

`03_NOTES_DIAGNOSIS_AND_REVISION_PHILOSOPHY.md` remains normative.

Preserved separations:

```text
reported reaction
note-giver's causal theory
note-giver's proposed fix
Fount observations
Fount diagnosis hypotheses
strategy
candidate pages
writer acceptance
```

Also preserved:

- raw note attribution;
- note convergence/conflict;
- protected strengths;
- smallest-effective-intervention preference when appropriate;
- deletion/re-conception as valid treatments;
- writer authority over treatment.

## 8. Current Probe closed-tool functionality

All sixteen current tool intents are preserved or expanded:

| Probe intent | Functional replacement |
|---|---|
| `inventory` | Fount canonical inventory + Intelligence report/story-world inventory |
| `extract_story` | Intelligence story extraction built from canonical + observations |
| `search` | exact/lexical Fount query + semantic Observe filtering + Intelligence surface |
| `check_constraints` | canonical structural checks + Intelligence semantic diagnoses + Workshop candidate policies |
| `knowledge_trace` | knowledge/belief timeline and reader/character epistemic analysis |
| `locate_boundary` | temporal boundary query over knowledge/reveal state |
| `dependencies` | causal graph + setup/payoff + alternate support |
| `continuity` | temporal/story-world continuity analysis |
| `scene_mechanics` | Scene Engine capability |
| `dialogue` | Dialogue Interaction capability |
| `voice` | voice measurement + character/dialogue diagnostics |
| `action` | action/readability/spatial/visibility analysis |
| `compare` | Revision Intelligence comparison |
| `scene_lift` | counterfactual removal/revision impact playbook |
| `ablate` | counterfactual evidence/knowledge/cause ablation |
| `strategy_contrast` | strategy-distinctness diagnosis/workshop guard |

## 9. Current Probe infrastructure functionality

### `Catalog`

Preserve closed execution and request validation. Replace with Observe sensor/projection registries plus Intelligence playbook registry and typed request validation.

### `Profile`

Preserve configurable lens wording/rubrics/calibration, immutable fingerprints, and reproducibility. Replace profile concept with content-addressed lens/calibration assets. No old profile schema.

### `Jev`

Preserve TypeSafe/System One measurement use, typed response normalization, state/context limits, and decision/calibration concepts. Reimplement in Observe against supplied `system_one_sdk`.

### `Writing.Executor`

Preserve batching, concurrency controls, timeouts, request/result association, partial errors, and prepared-question optimization if supported by current SDK.

### `Budget`

Preserve independent accounting for analytical model states versus generative Inference calls. Observe owns measurement budget mechanics; Intelligence playbooks allocate analysis budgets; Workshop owns generation budget concerns.

### `Projection` / `State`

Preserve controlled source slicing, prior/adjacent context, exact evidence, state size limits, and request identity. Split canonical slicing from measurement projection and Intelligence-derived context.

### `Writing.DecisionPolicy`

Preserve calibrated support/confidence/margin concepts where justified. Do not collapse raw probabilities; move policy to calibration/diagnosis rather than old Profile threshold compatibility.

### `Writing.Evidence`

Preserve exact citations, validated evidence IDs, source/revision grounding, and failure for invented/uninspected citations.

### `Report`

Preserve source revision, request, structured data, evidence, provenance, partial/error status, and exportability. Redesign as Observation/Diagnosis/PlaybookRun/Intelligence.Report rather than one universal Probe struct.

### `Investigation`

Preserve plan -> execute -> explain intent. Expand into multi-pass playbooks with evidence gaps and competing diagnoses.

### `SavedRecords`

Preserve useful durable analysis history through Intelligence L2 persistence. Do not preserve old storage schema.

### `Launcher` / live example

Preserve easy real-service configuration and representative live verification. Rebuild under Observe/Intelligence/Workshop package examples.

### CLI / Mix tasks

Preserve useful user workflows, not obsolete command names. New tasks route to Observe debugging or Intelligence playbooks as appropriate.

## 10. Current Probe behavioral tests

The Phase-1 implementer must inventory every Probe test in the supplied Repomix. At minimum, the following behavioral concerns from current tests must survive:

```text
adjacent extraction behavior
changed-target continuity
structured completion repair (moved to Workshop)
invention policy
inventory behavior
investigation contract
audience/character knowledge behavior
knowledge reveal timing
knowledge semantics
calibration/threshold reasoning intent
same-scene dependencies
saved analysis behavior where useful
scene-count scoping
search semantics
state validation
typed constraint targets
selection boundaries
exact retrieval continuation
voice/context continuation behavior
writing policy behavior
```

A test may be deleted if it only asserts an obsolete `FountProbe` API shape and the underlying product behavior is covered elsewhere. The handoff must state why.

## 11. Current Workshop functionality

No writer-facing Workshop feature is intentionally removed.

Preserve:

### Creative workflows

```text
Develop
TargetedRewrite
SequenceRebuild
CharacterRewrite
NoteResponse
Pass
Recover
Strategy
Workflows
```

### Candidate lifecycle

```text
Candidate
CandidateAPI
Session
Store
Rebase
Acceptance
Review
ReviewExport
Request
```

### Alternatives / audition / composition

```text
Audition
change groups
dependency-aware selection
footprint/overlap analysis
materialize/select/combine flows
```

### Generation

```text
Writing.Completion
Writing.Generation
Writing.Context
Writing.Preparation
proposal guidance
structured validation/repair
Inference integration
```

### Review and protection

```text
ReviewGate
canonical content hashes
stale-base rejection
required-check acknowledgment
candidate/base source and structural diff
explicit acceptance transaction
rejected candidate history
```

### Output/rehearsal

```text
`Submission` and PDF export/rendering
`TableRead` and table-read exports
speech/espeak integration where supported
reviewable Fountain/JSON/HTML outputs
```

The new architecture changes only Workshop's analytical dependency: Probe calls are replaced with Intelligence playbooks and Fount canonical APIs.

## 12. Canonical Fount functionality protected from architectural creep

Preserve the current core principles:

- byte-preserving Fountain source;
- stable IDs;
- typed IR;
- cast/mention distinction;
- annotations separate from canonical truth;
- semantic graph primitives remain interpreted;
- exact typed edits;
- no-op behavior;
- ID retention when content survives;
- invalid batch rejection;
- source/semantic diff;
- change-impact analysis;
- PostgreSQL accepted-head transaction;
- adapters/import/export;
- writer projections/table-read/location functions;
- validation.

The intelligence program may add small substrate primitives but must not relocate dramatic theory/provider behavior into core.

## 13. Operational functionality from original docset

Preserve:

- provider endpoint/key/model configurability supported by SDK;
- secrets excluded from provenance;
- payload minimization;
- state/request limits;
- retry/timeouts at acquisition boundary;
- budget accounting;
- partial result semantics;
- explicit failure taxonomy;
- closed executable registries;
- calibration/evaluation corpus;
- content fingerprints;
- revision-scoped invalidation;
- deterministic reducer replay;
- first-class sandbox fixture adapter;
- live TypeSafe verification;
- live small Inference/Workshop verification;
- docs/package/QC gates;
- handoff discipline for no-Elixir implementers.

## 14. Persistence functionality

Preserve the distinction among:

```text
canonical authored state
historically useful derived analysis
disposable caches
```

Change only ownership:

```text
L1 cache -> Observe
L2 derived persistence -> Intelligence shell
canonical -> Fount
```

Content hashes replace code-level asset version numbering.

## 15. Calibration/evaluation functionality

Preserve:

- annotated corpus strategy;
- multiple human readers where subjective;
- disagreement as data;
- calibration curves/threshold rationale;
- abstention;
- model drift evaluation;
- frozen observation fixtures;
- forward-reader checkpoint annotation;
- benchmark regression conversion;
- capability-specific evaluation rather than one screenplay score.

## 16. Security/failure functionality

Preserve:

- minimum provider payload;
- credential redaction;
- closed execution surfaces;
- no arbitrary module execution from assets/models;
- separate cost units;
- budget-aware partial coverage;
- provider failure != semantic uncertainty;
- structured input/acquisition/reduction/diagnosis/workshop failure classes;
- no missing result interpreted as negative evidence.

## 17. Packaging/public API functionality

Preserve publishable package hygiene for:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

Do not publish or retain Probe.

Normal Mix package release metadata may exist if publishing is later performed, but domain APIs/assets must not carry old/new compatibility variants.

## 18. Required Phase-1 source audit artifact

The Phase-1 offline implementer must add/update a source-grounded checklist in the handoff containing every current `FountProbe` production module and test file from the supplied Repomix with one of:

```text
REIMPLEMENTED -> destination file(s)
SUBSUMED -> destination feature/test
MOVED TO WORKSHOP -> destination
MOVED TO FOUNT -> general substrate destination, with justification
DELETED AS API-ONLY -> replacement behavior test reference
```

No `UNREVIEWED` item is permitted at phase delivery.

## 19. Final preservation acceptance

At final acceptance, the repository must be able to demonstrate:

1. all twelve capability families exist;
2. all current Probe tool intents have replacement surfaces;
3. all useful current Probe infrastructure properties have replacement ownership;
4. all writer-facing Workshop workflows remain;
5. core Fount canonical behavior remains intact;
6. research-driven reader/notes/evaluation functionality remains represented;
7. no superseded package/API compatibility code remains;
8. the implementation is simpler physically while broader functionally.

## Phase 1 source audit record

The concrete file-by-file disposition is in `handoffs/PHASE_01_PRESERVATION_AUDIT.md`. All supplied module/test paths have reviewed ownership and existing destination files. Behavioral equivalence remains unverified until Codex runs the preserved and new tests; there is no unreviewed source item being silently dropped. Excluded files are explicitly outside the snapshot inventory, not assumed deleted.

## Phase 8 preservation checkpoint — 2026-09-27

The Phase-8 overlay modifies only Observe/Intelligence/docs/tests and adds no deletion. `packages/fount/**` canonical screenplay behavior and `packages/fount_workshop/**` creative/canon workflows are unchanged. Existing StoryWorld/Temporal/Reader/Diagnosis and Phase-6/7 family modules are reused.

The ten writer-playbook IDs remain intact, and `character_trajectory` keeps its prior default family routing; Emotional/Value is opt-in rather than a silent provider/cost expansion. Genre analysis requires an explicit pack. Revision regression requires explicit before/after models rather than overloading ordinary one-model playbook execution. No direct SystemOneSDK/Inference/ASM integration is added.

Offline transport/source checks support preservation but do not prove runtime behavior. Codex must rerun the full Core/Observe/Intelligence/Workshop regression ladder described in `handoffs/PHASE_08_PRESERVATION_AUDIT.md` before marking Phase 8 COMPLETE.

## Phase 11 preservation checkpoint — 2026-09-27

The Phase-11 overlay does not modify Core production source and does not replace Observe execution, cache/provenance, StoryWorld/Reader/Temporal, any of the twelve capability implementations, Workshop review/acceptance semantics, or Phase-10 durable persistence/recomputation. Intelligence receives a data/pure evaluation layer; Observe receives only an opt-in synthetic live example plus docs; Workshop receives one conditional `LiveExample` QC mode plus wrapper/docs. No file is deleted.

The source-delivery preservation evidence is the combined 27-test Phase-9/10/11 Python contract run plus strict overlay reproduction. This is not runtime proof. Codex must rerun the complete four-package engineering ladder, the prior Observe robustness/cache/provider suites, Phase-10 durable DB regressions, Phase-9 Workshop writer loop, and the Phase-11 focused tests before marking the phase complete. The Workshop live QC candidate remains outside canon unless a separate writer acceptance action occurs; the Phase-11 wrapper explicitly disables acceptance.

## Phase 16 final preservation source checkpoint — 2026-09-27

The final source overlay changes **zero production `lib/**` modules**, deletes no file, changes no package dependency, and adds no compatibility shim. Its one `mix.exs` edit only registers final Workshop documentation/example extras. New files are final audit scripts, tests, guide/example content and a traceability matrix. Therefore the source handoff does not replace canonical Fount, Observe execution, Intelligence reasoning/persistence, Workshop generation/session/review/acceptance, Fountain/FDX export, PDF/TTS, notes/research/rebase, or read/share/usefulness behavior.

The 17-operation manifest passes strict apply/idempotence/tree reproduction. Source scans find exactly four package directories, no production Probe/superseded-package references, native SystemOneSDK only at the Observe boundary, and direct Inference only under Workshop. These are source-preservation checks, not runtime proof. Codex must rerun all prior preservation suites plus the final architecture/W/A matrix and inspect actual writer/export/package artifacts before final completion.


## Phase 16 runtime preservation result — 2026-09-27

No production `lib/**` file changed in Phase 16 or its two-file formatting repair. Core Fountain/FDX fidelity, Observe provider/cache/timeout/security, Intelligence forward-reader/StoryWorld/temporal/durable analysis, and Workshop candidate/undo/rebase/privacy/Submission/PDF/table-read workflows passed the full and focused runtime ladder. The provider-free CLI artifact inspection confirmed explicit acceptance, accepted-only sharing and persistent resume. See `handoffs/PHASE_16_RUNTIME_QC_REPORT.md` for commands, counts and limits.
