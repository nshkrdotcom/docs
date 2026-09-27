# Phase 1 offline source handoff - 2026-09-26

**State: OFFLINE_IMPLEMENTED. Runtime QC is not complete. Do not advance to Phase 2.**

**Historical handoff notice:** This paragraph records the source-writing state. Runtime QC subsequently ran from the applied commits and completed Phase 1 under the user's explicit Luna-output waiver; see `PHASE_01_RUNTIME_QC_REPORT.md` and `PROGRESS.md`. The original static checks remain historical evidence, not the current gate status.

## Writer outcome

Preserve the writer's current ability to develop alternatives, revise actual pages, compare changes, keep or reject candidates, accept explicitly, recover prior writing, create a table read and export a chosen draft while replacing the analysis architecture. The source includes a stored two-alternative development and targeted-revision demonstration in `packages/fount_workshop/examples/phase_one.exs`, plus integration assertions. It uses authored Mock/Sandbox answers and real persistence/review/export operations. The demonstration was written, not executed. No human preference or creative superiority was measured.

## Deliverables

- `fount_phase_01_overlay.zip`: strict repository-relative full-file overlay; 159 additions, 33 modifications, 86 exact deletions; 193 archive members including the manifest.
- `fount_phase_01_docset.zip`: the complete updated docset, retaining all 63 input docset paths and adding this phase's records.
- `FOUNT_PHASE_01_CODEX_QC_HANDOFF.md`: standalone Codex prompt, identical to `handoffs/PHASE_01_RUNTIME_QC_HANDOFF.md`.

The user applies and commits source/docset. Codex starts from those commits and repairs/completes Phase 1; it does not apply the same ZIP again.

## Input and application integrity - read before running anything

The four supplied attachments were identified by packed paths, modules, package definitions and progress contents. All are **unsealed raw Repomix exports**. The attachment hashes and file counts are recorded in `handoffs/PHASE_01_INPUTS.json`. Mentions of a sealing helper inside source text are not a snapshot seal. Historical preparation commits are not authenticated identities of these attachments.

This does not satisfy document 35's requested sealed-source provenance. The overlay manifest records exact **decoded snapshot-body** preimages and results, not a claim about the user's checkout bytes. A separately computed body-plus-one-terminal-LF hash is present when appropriate. The original applier remains unchanged: strict preflight is mandatory; the LF alternative needs explicit human review and its existing `--allow-terminal-newline` switch. CRLF differences, modified content, new-file collisions and every other mismatch must be reconciled from actual source, never forced. Transport tests proved application against a reconstruction, not the real checkout.

All 86 supplied files in `packages/fount_probe` are explicit hash-checked deletions. Excluded files, such as a decorative SVG or local build/dependency output, were not supplied and cannot be safely enumerated or hashed here. Inspect any remaining physical directory. Do not erase an unknown file merely to make a gate green.

The original applier leaves empty directories. The added `handoff/prune_deleted_directories.py` removes only empty ancestors of manifest-deleted files after successful application; it never removes a file or symlink. It reports nonempty ancestors. After the user's application, the physical retired package must be absent before Phase 1 can complete. The architecture gate checks this explicitly.

## Implementation ownership

### Canonical substrate

`Fount.Selection` retains exact scene/element/dialogue selection behavior. `Fount.SourceEvidence` validates actual revision/target/excerpt/UTF-8 evidence and citation IDs. `Fount.Inventory` and `Fount.Search` retain generic structural/lexical querying. Existing parser, canonical edit identity, persistence schema and transactional review behavior remain the source of truth. No analysis data migration was added.

### Observe

The new package implements neutral `Question`, `Request`, `Distribution`, `EvidenceRef`, `TargetRef`, `Context`, `MeasurementResult`, `Observation`, `Error` and batch contracts; a closed registry and content-hashed lens assets; exact measurement projections; the real SystemOneSDK adapter; association, partial failure, limits, cancellation and timeouts; an L1 cache behavior and memory implementation; and deterministic Sandbox.

Cached measurement content is distinct from newly bound observations. Model-visible inputs, question definitions, context, provider identity and execution inputs influence reuse. Namespace and mutable-model policies are explicit. No cached source provenance is recycled as if it were current evidence. Result distributions are not rewritten by downstream thresholds.

### Intelligence

A new closed 16-playbook request surface replaces the old catalog. Existing knowledge/access/continuity/dependency/scene/dialogue/voice/action/comparison/ablation/strategy behavior is distributed across acquisition, playbooks, reporting and pure interpretation rather than wrapped under an old API. `StoryWorld.Records`, `Reader.Reveal` and `Capabilities` contain the preserved pure value transformations; full later-phase engines are not stubbed or claimed.

Exact-source result validation covers original, candidate, experimental and explicit historical models. Reporting uses logical contract identity plus a shape digest; old report/profile readers were not retained. Existing generic persistence field names remain where they are storage concerns rather than public compatibility APIs. Investigation planning and explanation call an explicit Workshop/host proposal service through local schema/evidence validation.

The new architecture task checks physical packages, declared dependencies, source AST dependencies and compiled BEAM references, with negative test cases for hidden effects/edges. Only simpler Python source checks ran here; the actual Elixir gate is unrun.

### Workshop

Completion and measured action/PDF layout live in Workshop; `Services` supplies trusted proposal/layout functions to analysis. The launcher owns environment and native completion configuration. Candidate generation, review, acceptance/rejection, rebase, auditions, notes, sequences, passes, character/targeted rewrites, recovery, table reads, speech and exports remain represented by their existing code and tests. Analysis launchers/tasks were updated directly, not kept as old-name wrappers.

## Actual dependency APIs inspected

The supplied SystemOneSDK package source declares `0.6.0`; existing Fount lockfiles include the earlier `0.5.0` resolution. The new Observe dependency expresses `~> 0.6.0` and supports `FOUNT_SYSTEM_ONE_SDK_PATH` pointing at the **package** directory. This does not claim the release exists on Hex. Resolve and record the actual source used by all consumers; regenerate locks through Mix, not hand-edited hashes.

The Observe adapter uses the supplied public `SystemOneSDK.new_client/1`, `noul/2`, `choice/3`, `score/3`, `prepare/1` and `evaluate_stream/4` surfaces, and reads the actual response/answer structs inside `Fount.Observe.Providers.SystemOne`. Tests use the supplied `SystemOneSDK.Test` client and stubbing helpers. Noul has probability and no fabricated confidence; choices preserve ordered options; score retains the expected scalar. Batch association uses the SDK's actual batch index. Timeout, partial-failure and cleanup semantics require verification with the resolved SDK.

Inference source declares `0.4.0`. Workshop retains `Inference.Client.agent_session!/1`, the ASM adapter and `Inference.complete/3`; fixture examples use the actual `Inference.Client.new!/1` and `Inference.Adapters.Mock`. The public response-format union is `:text`, `{:json, :object}` or `{:json_schema, %{name: ..., schema: ..., strict: ...}}`. No provider-specific completion route is invented. Intelligence receives a trusted host `propose` function, not the Inference client. Completion traces/errors are reduced to neutral data before crossing back into analysis.

Exact local canonical APIs used include `Fount.Screenplay.new/1`, `from_document/2`, `apply/3`, `diff/2`, `to_fountain/1`, `Fount.ID.v4/0`, and the existing persistence/candidate/review APIs. New generic `Fount.Selection`, `SourceEvidence`, `Inventory` and `Search` helpers own canonical selection, evidence validation and retrieval rather than importing a retired analysis package.

## Preservation and exact file inventory

`handoffs/PHASE_01_PRESERVATION_AUDIT.md` classifies every supplied production module/test, plus other retired-package files. `handoff/phase_01_ownership.json` mirrors the 37 production and 26 test destinations in Fount. All 63 destinations were checked for actual existence. Remaining 23 old-package files are individually accounted for in the audit. Every one of the 86 provided old-package files is enumerated in the deletion manifest.

`handoffs/PHASE_01_FILE_INVENTORY.json` is the exact strict archive operation manifest, including all added/modified file names, original/result hashes, modes and individual deletions. No glob deletion or inference from omission is used.

### Modified existing files

- `.github/workflows/ci.yml`
- `CHANGELOG.md`
- `README.md`
- `mix.exs`
- `packages/fount/CHANGELOG.md`
- `packages/fount/README.md`
- `packages/fount/guides/architecture.md`
- `packages/fount_workshop/CHANGELOG.md`
- `packages/fount_workshop/README.md`
- `packages/fount_workshop/examples/README.md`
- `packages/fount_workshop/guides/architecture.md`
- `packages/fount_workshop/guides/creative-workflows.md`
- `packages/fount_workshop/integration/action_layout_test.exs`
- `packages/fount_workshop/lib/fount_workshop/audition.ex`
- `packages/fount_workshop/lib/fount_workshop/candidate.ex`
- `packages/fount_workshop/lib/fount_workshop/candidate_api.ex`
- `packages/fount_workshop/lib/fount_workshop/cli.ex`
- `packages/fount_workshop/lib/fount_workshop/live_example.ex`
- `packages/fount_workshop/lib/fount_workshop/request.ex`
- `packages/fount_workshop/lib/fount_workshop/review_export.ex`
- `packages/fount_workshop/lib/fount_workshop/session.ex`
- `packages/fount_workshop/lib/fount_workshop/store.ex`
- `packages/fount_workshop/lib/fount_workshop/strategy.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/completion.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/context.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/generation.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/layout.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/note_conflicts.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/preparation.ex`
- `packages/fount_workshop/lib/fount_workshop/writing/scope.ex`
- `packages/fount_workshop/mix.exs`
- `packages/fount_workshop/test/candidate_scope_test.exs`
- `scripts/verify_handoff.sh`

### New or modified test files supplied

These are source paths, not successful test results. Tests moved from the old package remain part of the preservation obligation.

- `packages/fount/test/canonical_inventory_test.exs`
- `packages/fount/test/canonical_search_test.exs`
- `packages/fount_intelligence/test/architecture_test.exs`
- `packages/fount_intelligence/test/changed_continuity_test.exs`
- `packages/fount_intelligence/test/constraint_contract_names_test.exs`
- `packages/fount_intelligence/test/continuation_constraints_test.exs`
- `packages/fount_intelligence/test/continuation_voice_test.exs`
- `packages/fount_intelligence/test/invention_policy_test.exs`
- `packages/fount_intelligence/test/investigation_contract_test.exs`
- `packages/fount_intelligence/test/knowledge_behavior_test.exs`
- `packages/fount_intelligence/test/knowledge_reveal_test.exs`
- `packages/fount_intelligence/test/knowledge_test.exs`
- `packages/fount_intelligence/test/profile_threshold_test.exs`
- `packages/fount_intelligence/test/proposal_service_contract_test.exs`
- `packages/fount_intelligence/test/reader_replay_test.exs`
- `packages/fount_intelligence/test/request_contract_test.exs`
- `packages/fount_intelligence/test/retrieval_exact_continuation_test.exs`
- `packages/fount_intelligence/test/same_scene_dependencies_test.exs`
- `packages/fount_intelligence/test/saved_records_test.exs`
- `packages/fount_intelligence/test/scene_count_scope_test.exs`
- `packages/fount_intelligence/test/state_test.exs`
- `packages/fount_intelligence/test/typed_constraint_targets_test.exs`
- `packages/fount_intelligence/test/writing_policies_test.exs`
- `packages/fount_observe/test/cache_integrity_test.exs`
- `packages/fount_observe/test/continuation_projection_test.exs`
- `packages/fount_observe/test/executor_sandbox_test.exs`
- `packages/fount_observe/test/lens_asset_test.exs`
- `packages/fount_observe/test/measurement_contract_test.exs`
- `packages/fount_observe/test/selection_boundary_continuation_test.exs`
- `packages/fount_observe/test/system_one_boundary_test.exs`
- `packages/fount_workshop/integration/action_layout_test.exs`
- `packages/fount_workshop/integration/phase_one_writer_demo_test.exs`
- `packages/fount_workshop/test/analysis_adjacent_extraction_test.exs`
- `packages/fount_workshop/test/analysis_catalog_continuation_test.exs`
- `packages/fount_workshop/test/analysis_completion_repair_test.exs`
- `packages/fount_workshop/test/candidate_scope_test.exs`
- `packages/fount_workshop/test/completion_privacy_test.exs`
- `scripts/tests/test_phase_one_source.py`
- `scripts/tests/test_prune_deleted_directories.py`

## Checks actually executed

The 18 Python tests passed: eight original snapshot-helper tests, six phase-specific source-structure checks, and four empty-directory-cleanup tests. `bash -n scripts/verify_handoff.sh` passed. Ownership destination and JSON parsing checks passed. The textual function-name audit found only the pre-existing Ecto-generated `__schema__` name outside textual declarations; it does not establish arity or compilation.

The supplied unmodified Python applier validated the archive and performed all 278 operations on an isolated reconstruction. All declared result bytes/modes and untouched files matched. Empty-directory pruning removed the retired package only when actually empty. A second application changed zero files. Local edits, altered payloads, symlink preimages and non-authorized line-ending changes were refused. An injected unseen old-package asset was preserved and reported rather than deleted.

Detailed machine-readable status is `handoffs/PHASE_01_STATIC_CHECKS.json`. These results do not authenticate the actual user's checkout. Review was author self-review, not an independent review agent.

## Unrun checks and risks

No Elixir/Mix executable was available. There was no Elixir parse/format/compile, ExUnit test run, AST/BEAM gate execution, Credo, Dialyzer, ExDoc, Hex build, dependency/lock resolution, database migration/integration, PDF rendering, speech synthesis, live model call or human/domain study. Written tests have not completed a red/green cycle. Source formatting and compiler warnings may need repair.

Highest-priority runtime risks are actual SDK 0.6 dependency resolution versus existing locks; cross-package return shapes and moved assertions; provider timeout/cancellation task cleanup; evidence across candidate/history/clipped sources; compiled gate coverage of imports/macros/nested aliases; and the real stored writer demonstration, review safety and renderer behavior. Unknown excluded old-package remnants and raw-input identity also remain explicit completion gates. Do not treat any of these as silently passed.

## Phase boundary and exit

No new twelve-family feature expansion, full StoryWorld/Temporal/Reader engine, durable L2 cache, corpus program, human study or Phase 2 work was started. Neutral primitives and L1/Sandbox pieces here are the minimum expressly required by Phase 1.

Codex must follow `handoffs/PHASE_01_RUNTIME_QC_HANDOFF.md`, repair failures, execute the required engineering and writer-preservation gates, update the docset and produce fresh sealed source identities. The retired package must be physically absent; all preservation rows need reviewed behavior evidence; Workshop must build/run without it; the full architecture gate and required runtime checks must pass. Only then may Codex mark Phase 1 `COMPLETE`. Stop there.

## Recorded decisions

See the Phase 1 entries in `DECISIONS.md`: actual SDK 0.6/source-path resolution; canonical evidence helpers; Workshop-owned completion/layout services; a minimal genuine pure baseline rather than future stubs; logical report/asset identities; fail-closed handling of raw inputs; and empty-only cleanup of declared-deletion ancestors. No compatibility API or user-source mismatch bypass was introduced.

Overlay SHA-256: `9ba4bb881cef0c8b7c09a1a4b64f116a77344b60c8adb8dabc5c01be5398560b`. The complete-docset ZIP is sealed after its final records are written; it does not contain a circular self-hash.
