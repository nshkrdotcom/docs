# Offline Agent Execution Protocol

## 1. Audience

This document is written for the implementation agent that receives the current source snapshots and this docset but **does not have a working Elixir execution environment**.

The agent's job is to inspect APIs, write the phase implementation, package the overlay, update this docset, and hand off exact runtime-QC instructions. It must not invent successful runtime results.

## 2. Required inputs every phase

The prompt must include five inputs:

1. `fount.xml`, containing the complete current workspace relevant to implementation;
2. `system_one_sdk.xml`;
3. `inference.xml`;
4. `agent_session_manager.xml`, for the actual agent-session/provider boundary used by Inference where relevant;
5. `docset.xml`, containing the complete current docset and prior handoffs.

Filenames may contain timestamps. Identify them by content, not an assumed literal filename.

Do not rely on conversation memory as an implementation source when the supplied files answer the question.

## 3. Start procedure

1. Read `AGENT_START_HERE.md`.
2. Read `PROGRESS.md` and identify the first phase not marked `COMPLETE`.
3. Read that phase completely in `16_PHASED_IMPLEMENTATION_PLAN.md`.
4. Read architecture and contracts relevant to the phase.
5. Inspect actual source/dependency APIs before designing files.
6. Read the prior phase runtime-QC handoff if one exists.
7. Update source assumptions when the latest Repomix differs from documentation.

Do not skip directly to coding from a phase title.

## 4. Architecture invariants

The target physical packages are exactly:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

Do not create the superseded physical packages:

```text
fount_analysis
fount_semantics
fount_temporal
fount_reader
fount_diagnose
fount_playbooks
fount_dramatics
```

Those names may appear in historical explanation in the docset only.

After Phase 1, do not create or retain `fount_probe`.

## 5. Greenfield rule

There are no external users/data contracts to protect.

Never spend phase effort on:

- `FountProbe` shims;
- compatibility delegates;
- old/new feature flags;
- old request/report/profile readers;
- data migrations for old Probe persistence;
- deprecation wrappers;
- `Legacy`, `Compat`, `Old*`, `V1`, `V2` module families intended to preserve superseded code;
- `.v1`/`.v2` analytical asset names;
- numeric domain asset version fields.

Implement the final architecture directly.

Normal Mix package release metadata is not the subject of this rule.

## 6. Source-first implementation

The Repomix files are authoritative for APIs available at implementation time.

Before using:

```text
Fount function/module
TypeSafe client function/module
Inference client function/module
Ecto schema/table
Mix alias
existing test helper
```

find the actual definition in supplied source.

If the architecture docs use a conceptual name that does not exist, adapt the implementation to the real API while preserving semantics.

Record material corrections in `DECISIONS.md` or the phase handoff.

## 7. No-execution honesty

You may use available non-Elixir tooling for textual/static work, but you must clearly label:

```text
WRITTEN / STATICALLY INSPECTED
NOT EXECUTED
```

Do not claim these passed without the runtime environment:

```text
mix deps.get
mix format --check-formatted
mix compile
mix test
mix credo
mix dialyzer
mix docs
mix hex.build
Ecto migrations
PostgreSQL integration
live TypeSafe calls
live Inference calls
PDF rendering requiring runtime tools
```

Instead, write the intended tests/scripts and tell the runtime-QC agent exactly what to run.

## 8. Phase scope discipline

Implement the current phase fully enough to satisfy its code/doc/test requirements, but do not opportunistically start later capability phases unless required to complete the current architecture.

Phase 1 is intentionally broad because it directly removes Probe. That is not permission to implement all later feature expansion.

## 9. Functional preservation discipline

For Phase 1 especially, use `23_FUNCTIONALITY_PRESERVATION_AUDIT.md` as a checklist.

Every current Probe production module/test must be classified. Every current Workshop writer-facing workflow must be preserved.

Do not equate "we changed the architecture" with permission to delete hard behavior.

## 10. Pure-core discipline

When writing `fount_intelligence`:

- pure StoryWorld/Temporal/Reader/Diagnosis code takes values and returns values;
- no hidden Observe call;
- no Repo call;
- no environment lookup;
- no network/filesystem provider dependency;
- no hidden timestamp/randomness in semantic output;
- evidence gaps return explicit requirements for the shell.

Write/update the architecture gate described in `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`.

## 11. Observe discipline

`fount_observe`:

- measures;
- owns typed neutral context primitives and validates closed lens-declared slots;
- normalizes providers;
- owns L1 MeasurementResult cache;
- exports stable provider-neutral MeasurementResult/Observation contracts;
- ships deterministic Sandbox fixtures;
- does not build whole-story dramatic diagnoses.

Inspect the supplied `system_one_sdk` public API before writing adapters.

## 12. Workshop discipline

`fount_workshop` remains the generation/revision package.

Preserve existing typed-edit and explicit-acceptance safety. Do not move creative completion into Intelligence merely because playbooks produce strategies.

Inspect supplied `inference` API before writing generation calls.

## 13. File-editing expectations

Produce complete final contents for every new/modified file. Do not return patch fragments that require guessing missing context.

Do not include generated/build/dependency directories.

Use the strict `handoff/fount-overlay.manifest.json` contract in document 35 for every changed/new/deleted file, including exact byte hashes.

Phase 1 enumerates each actual Probe deletion from the input inventory. No glob deletions or deletion inferred from an absent payload. Missing original hashes must be resolved before packaging.

## 14. Required overlay layout

ZIP root is repository-relative:

```text
mix.exs
README.md
packages/
  fount/...
  fount_observe/...
  fount_intelligence/...
  fount_workshop/...
handoff/fount-overlay.manifest.json
```

Do **not** wrap repository files in an arbitrary extra directory unless the prompt explicitly requests it.

## 15. Required docset updates

Every phase implementation updates:

### `PROGRESS.md`

Set phase to `OFFLINE_IMPLEMENTED` and list overlay/handoff names. Never mark `COMPLETE` without runtime-QC evidence.

### `TRACEABILITY_MATRIX.md`

Mark requirements implemented by source files/tests, but distinguish unexecuted from QC-verified.

### `DECISIONS.md`

Add/update for actual product, workflow, or architecture corrections supported by user direction, research, or source inspection, or when a deferred decision is resolved.

### Handoff

Create:

```text
handoffs/PHASE_<NN>_OFFLINE_HANDOFF.md
```

from the template.

## 16. Required deliverables

Return three downloads:

1. `fount_phase_<NN>_overlay.zip`
2. updated screenplay-intelligence docset ZIP
3. `PHASE_<NN>_RUNTIME_QC_HANDOFF.md` (also included under docset `handoffs/`)

If the user requests another naming convention, follow it while preserving the three artifact roles.

## 17. Handoff contents

The QC handoff must state:

- exact source baseline identity available from snapshot metadata;
- phase implemented;
- files added/modified/deleted;
- current Probe items classified/migrated when relevant;
- tests written;
- static validations actually performed;
- every runtime check **not** performed;
- expected commands;
- known high-risk compile/API assumptions;
- database/provider prerequisites;
- live tests and required env variables without secret values;
- any source/docs discrepancy;
- exact acceptance conditions before next phase.

## 18. Runtime failure is expected information

Because offline implementation cannot compile, runtime-QC may expose:

- wrong struct fields;
- private/public API misunderstandings;
- dependency/lock constraints;
- test helper mismatches;
- Dialyzer/spec errors;
- OTP/process behavior issues;
- Ecto migration/schema issues;
- live provider semantics.

The offline agent should minimize these through inspection but must not hide uncertainty.

## 19. Updating the next baseline

After runtime QC, the next phase's Fount Repomix must represent the corrected current source—not merely the offline overlay before fixes.

This is critical: every phase builds from the last QC'd source.

## 20. Stop condition

After producing the required artifacts for the current phase, stop. Do not silently implement the next phase in the same overlay.

## Domain-validation responsibilities

For phases with optional human/domain pilots, the offline implementation agent does **not** fabricate human results.

It must:

- implement/export the required evaluation packet/fixtures;
- update the validation manifest;
- state which rights-cleared material/reviewer resources are still required;
- include explicit domain-review instructions in the handoff;
- leave the phase in `OFFLINE_IMPLEMENTED` until runtime QC; skipped human review does not block engineering completion under D046.

The runtime-QC agent may prepare/render the packet but must not mark a human/domain gate passed without actual review evidence.