# Fount Screenplay Intelligence — Offline Phase Implementation Prompt

You are implementing the next phase of the Fount Screenplay Intelligence program.

## Authoritative inputs attached

1. `fount.xml`, from the latest post-QC source;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `agent_session_manager.xml`;
5. `docset.xml`, the complete current docset.

Read documents 32–36 before implementation. Lead with this phase's writer outcome and demonstration. This is screenplay-writing software, not an architecture showcase. Preserve human authorship, voice, and useful existing workflows. Follow document 35: the user applies and commits the output ZIPs, then Codex verifies and repairs that applied state.

Read `AGENT_START_HERE.md`, `PROGRESS.md`, `DECISIONS.md`, the current phase in `16_PHASED_IMPLEMENTATION_PLAN.md`, and all referenced architecture/capability docs. Inspect actual source/tests and relevant SDK source before implementation.

## Environment limitation

You do **not** have a working Elixir/Erlang/Fount runtime. You may inspect files and write production-intended source, tests, docs, JSON assets, and artifacts. You cannot truthfully claim Mix, ExUnit, Credo, Dialyzer, ExDoc, PostgreSQL, provider calls, or runtime examples passed.

Do not substitute another plan for implementation. Write the phase and hand it off for runtime QC.

## Current phase

**Phase:** `<PHASE_NUMBER> — <PHASE_NAME>`

Implement the complete scope/exit-oriented source changes from `16_PHASED_IMPLEMENTATION_PLAN.md` against the supplied current source.

## Architecture rules

Final physical package topology is exactly:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

- `fount` owns canonical screenplay truth.
- `fount_observe` owns measurement/acquisition, TypeSafe integration, L1 cache, context validation, and Sandbox.
- `fount_intelligence` owns StoryWorld/Temporal/Reader/Diagnosis pure core plus Acquisition/Playbooks/Persistence/Reporting shell.
- `fount_workshop` owns creative generation/candidates/revision through `inference` and Fount typed edits.
- Pure Intelligence namespaces must not acquire observations, call Repo/provider/network/environment APIs, or hide mutable runtime state.
- Observe accepts Intelligence-derived higher-order context only through Observe-owned serializable context values with closed lens-declared slots and runtime validation; Intelligence structs never cross that API.
- Observe provider-native SDK types do not leak into Intelligence.
- Standard Intelligence tests must be able to use `Fount.Observe.Sandbox`.
- Reader state is strict-forward in presentation order; StoryWorld story-time is a separate partial constraint graph and causality is separate again.
- Do not force story-time into one chronological array or claim that a topological sort validates arbitrary interval constraints; preserve unknown/ambiguous temporal relations.
- Observe output contracts use stable logical identity plus canonical data-shape digest; incompatible prior derived outputs are stale and reacquired, not adapted through numeric schema generations.
- Reusable cache entries are `MeasurementResult` computation results; an `Observation` binds a result to the current revision/target/evidence. Cross-revision reuse must materialize fresh current provenance.
- Cache reuse keys contain the effective semantic measurement input/model identity, not provenance-only revision/database identifiers; privacy namespace is part of durable reuse policy.
- Observation != diagnosis != strategy != candidate.
- No universal screenplay-quality score.
- Executable sensors/projections/playbooks/evaluators resolve through closed registries.
- Canonical changes require explicit Workshop/Fount review/acceptance.

## Greenfield rule

This codebase is unpublished/greenfield.

Do not implement:

- Probe wrappers/delegates;
- old/new dual paths;
- old Probe request/report/profile readers;
- deprecation layers;
- old-data migration machinery for Probe;
- compatibility module families;
- domain asset/API names with old/new numeric suffixes;
- numeric domain asset version fields.

**Phase 1 specifically must port/subsume required current behavior and delete `packages/fount_probe` in the same overlay.** Later phases must not reintroduce it.

## Functionality preservation

Read `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`.

Preserve or improve:

- all current valuable Probe tool intents/infrastructure behavior;
- all current writer-facing Workshop workflows;
- all twelve capability families from the original docset;
- research-driven reader/notes/evaluation requirements.

Do not preserve superseded APIs merely for compatibility.

## SDK/API rule

The attached SDK snapshots are authoritative. Inspect and use their actual public APIs. Do not infer calls from older source or memory.

If a required external capability is absent, implement the internal boundary honestly and document the gap for runtime QC rather than inventing an API.

## Required deliverable 1 — repository overlay ZIP

Suggested name:

`fount_phase_<NN>_<short_name>_overlay.zip`

Requirements:

- paths relative to Fount repository root;
- every and only new/modified files required by phase;
- `handoff/fount-overlay.manifest.json` with exact hashes and explicit add/modify/delete operations;
- no `.git`, `_build`, `deps`, node modules, repomix inputs, secrets, logs, or unchanged files.

Phase 1 must enumerate each actual Probe file to delete. No wildcard deletion, missing preimage hash, symlink, directory ZIP entry, or unlisted payload is allowed. Validate the archive using the supplied Python applier even when Elixir is unavailable.

## Required deliverable 2 — updated complete docset ZIP

Update at least:

- `PROGRESS.md` -> current phase `OFFLINE_IMPLEMENTED`, never `COMPLETE`;
- `TRACEABILITY_MATRIX.md` with written source/test paths/status;
- `DECISIONS.md` for real product, workflow, or architecture/API corrections;
- relevant specs if source inspection disproves an assumption;
- `handoffs/PHASE_<NN>_OFFLINE_HANDOFF.md`.

Return the complete docset, not only modified docs.

## Required deliverable 3 — runtime-QC handoff Markdown

Suggested name:

`FOUNT_PHASE_<NN>_RUNTIME_QC_HANDOFF.md`

Include:

- baseline/snapshot identity;
- overlay filename;
- added/modified/deleted file inventory;
- implementation summary;
- current Probe module/test classification when Phase 1;
- exact SDK APIs inspected/used;
- tests written;
- static checks actually performed;
- every runtime check not run;
- compile/test/integration risk areas;
- focused checks to run first;
- full architecture/runtime QC ladder;
- database/live requirements;
- exact phase exit criteria;
- instruction to fix failures and update the docset rather than only report them.

## Source quality

Write complete production-intended files, not pseudocode. Follow naming, packaging, docs, and testing conventions visible in the current source. Do not mark the phase complete; runtime QC decides that.

## Writer-product and domain-validation rules

For phases after Phase 2, inspect the product contracts relevant to the phase:

- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`;
- `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`;
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`;
- `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`.

If the phase defines an optional human/domain pilot:

- write the evaluation/export/reference-rendering support needed by the pilot;
- prepare the rights/reviewer/corpus manifest fields and handoff packet;
- do **not** invent reader/writer responses;
- do **not** claim a skipped study was performed;
- record remaining human/resource dependencies explicitly.

For writer-facing outputs, preserve evidence -> derived state -> diagnosis -> strategy -> candidate separation and the claim classes defined in doc 27.

For declarative packs/lenses, obey doc 29: open configuration does not mean arbitrary execution, provider configuration, credentials, or unmetered work.

For expensive playbooks, implement the phase's required preflight/resource accounting under doc 30.