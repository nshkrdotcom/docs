# Docset Manifest

## Entry and governance

- `README.md`
- `AGENT_START_HERE.md`
- `PROGRESS.md`
- `DECISIONS.md`
- `TRACEABILITY_MATRIX.md`
- `MANIFEST.md`
- `SOURCES.md`

## Research / product philosophy

- `00_SCOPE_AND_PRINCIPLES.md`
- `01_INDUSTRY_EVALUATION_AND_READER_CRITERIA.md`
- `02_EMERGENT_READER_EXPERIENCE_OVER_TIME.md`
- `03_NOTES_DIAGNOSIS_AND_REVISION_PHILOSOPHY.md`
- `32_SCREENPLAY_FIRST_RESEARCH_EXPANSION.md`
- `33_WRITER_WORKFLOWS_AND_CREATIVE_CONTRACT.md`
- `34_HUMAN_JEV_AND_LLM_COLLABORATION.md`
- `35_FOUR_XML_PROGRESSIVE_HANDOFF.md`
- `36_PRODUCT_PHASES_AND_ACCEPTANCE_SCENARIOS.md`

## Architecture / domain model

- `04_TARGET_PACKAGE_ARCHITECTURE.md`
- `05_ANALYSIS_CONTRACTS_AND_DATA_MODEL.md`
- `06_SEMANTIC_STORY_WORLD.md`
- `07_OBSERVATION_SENSOR_AND_LENS_SYSTEM.md`
- `08_TEMPORAL_AND_READER_STATE.md`
- `09_DIAGNOSIS_SYSTEM.md`
- `10_PLAYBOOKS_AND_WRITER_WORKFLOWS.md`
- `11_CAPABILITY_CATALOG_12_FAMILIES.md`
- `12_CALIBRATION_EVALUATION_AND_CORPUS.md`
- `13_PERSISTENCE_PROVENANCE_CACHE_RECOMPUTATION.md`
- `14_WORKSHOP_INTEGRATION_AND_REVISION_INTELLIGENCE.md`
- `15_FOUNT_PROBE_DIRECT_SUPERSESSION.md`
- `23_FUNCTIONALITY_PRESERVATION_AUDIT.md`
- `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`
- `25_SECOND_ORDER_REVIEW_RESOLUTIONS.md`
- `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md`
- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`
- `28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`
- `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`
- `31_FEATURE_SCREENPLAY_PRODUCT_SCOPE.md`

## Implementation / operations

- `16_PHASED_IMPLEMENTATION_PLAN.md`
- `17_AGENT_EXECUTION_PROTOCOL.md`
- `18_RUNTIME_QC_PROTOCOL.md`
- `19_ACCEPTANCE_CRITERIA.md`
- `20_OPEN_QUESTIONS_AND_DEFERRED_DECISIONS.md`
- `21_SECURITY_COST_AND_FAILURE_MODEL.md`
- `22_PUBLIC_API_AND_PACKAGE_PUBLISHING.md`

## Examples

- `examples/CONCEPTUAL_CONTRACT_EXAMPLES.md`
- `examples/lens_asset.example.json`
- `examples/context_schema.example.json`
- `examples/diagnosis.example.json`
- `examples/playbook.example.json`
- `examples/writer_result_packet.example.json`
- `examples/genre_pack.example.json`
- `examples/declarative_lens.example.json`
- `examples/corpus_manifest.example.json`
- `examples/resource_preflight.example.json`

## Templates

- `templates/PHASE_IMPLEMENTATION_PROMPT.md`
- `templates/PHASE_QC_HANDOFF_PROMPT.md`
- `templates/PHASE_DELIVERY_CHECKLIST.md`
- `templates/PHASE_RUNTIME_QC_REPORT.md`
- `templates/UPDATED_DOCSET_CHECKLIST.md`
- `templates/DEPENDENCY_REPOMIX_CONFIG.json`
- `repomix.config.json` — full-docset XML export configuration.

## Runtime handoffs

- `handoffs/` — phase-specific offline and QC handoffs are added during implementation.
- `handoffs/PREPARATION_2026-09-26.md` — source baselines and actual preparation checks; not a completed implementation phase.
- `handoffs/PHASE_03_RUNTIME_QC_REPORT.md` — applied source identity, engineering repairs and gates, and user-authorized Level-A validation debt.
- `handoffs/PHASE_08_RUNTIME_QC_REPORT.md` — verified Phase-8 engineering checkpoint.
- `handoffs/PHASE_09_RUNTIME_QC_REPORT.md` — verified Phase-9 engineering checkpoint.
- `handoffs/PHASE_10_OFFLINE_HANDOFF.md` / `PHASE_10_RUNTIME_QC_HANDOFF.md` — historical Phase-10 source delivery and QC instructions.
- `handoffs/PHASE_10_RUNTIME_QC_REPORT.md` — verified Phase-10 runtime, PostgreSQL, writer-resume and full-quality evidence.

## Five XML phase inputs

Every implementation phase receives exactly:

- `fount.xml`;
- `system_one_sdk.xml`;
- `inference.xml`;
- `agent_session_manager.xml`;
- `docset.xml`, containing this complete current docset.

The docset is an implementation specification, not a source-code snapshot.

Documents 32–36 add screenplay-first research, writer workflows, actual SDK collaboration and the user-applied ZIP protocol. Final acceptance is Phase 16. Phases 1–13 are COMPLETE on recorded applicable engineering QC; Phase 14 is OFFLINE_IMPLEMENTED and awaits runtime/repair QC; Phase 15 remains NOT_STARTED. Phase-14 source-delivery records are under `handoffs/PHASE_14_*`. Earlier optional human studies remain visible validation debt. D046 makes human reviews optional and nonblocking. Use PROGRESS.md for the authoritative checkpoint.

## Current revision note

`25_SECOND_ORDER_REVIEW_RESOLUTIONS.md` records the architecture-focused Socratic review. `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md` records the writer-usefulness review and links the new writer presentation, human validation, safe extensibility, resource economics, and feature-scope contracts. Phase 1 sequencing remains unchanged.

## Integrity

- `SHA256SUMS.txt` — SHA-256 hashes for every docset file except itself.

## Phase 1 delivery records

- `handoffs/PHASE_01_OFFLINE_HANDOFF.md`
- `handoffs/PHASE_01_RUNTIME_QC_HANDOFF.md`
- `handoffs/PHASE_01_PRESERVATION_AUDIT.md`
- `handoffs/PHASE_01_INPUTS.json`
- `handoffs/PHASE_01_STATIC_CHECKS.json`
- `handoffs/PHASE_01_FILE_INVENTORY.json`

These are historical Phase 1 records. Its runtime-QC report records COMPLETE with the explicit Luna-output debt. Phase 2 records follow.

## Phase 2 delivery records

- `handoffs/PHASE_02_INPUTS.json`: four content-identified input hashes, file-level preimage evidence and omissions.
- `handoffs/PHASE_02_FILE_INVENTORY.json`: complete added/modified inventory, hashes and new test names.
- `handoffs/PHASE_02_IMPLEMENTATION_MATRIX.md`: entire phase scope mapped to source/tests/demo.
- `handoffs/PHASE_02_PRESERVATION_AUDIT.md`: unchanged functionality/source and required runtime reruns.
- `handoffs/PHASE_02_STATIC_CHECKS.json`: actual offline results, failures and unrun gates.
- `handoffs/PHASE_02_OFFLINE_HANDOFF.md`: source delivery account.
- `handoffs/PHASE_02_RUNTIME_QC_HANDOFF.md`: Codex verifies the user-applied state, repairs Phase 2, then stops.

`handoffs/PHASE_02_RUNTIME_QC_REPORT.md` and `handoffs/PHASE_02_PACKET_RECORD.md` now record the actual Phase-2 completion evidence.

## Phase 3 delivery records

- `handoffs/PHASE_03_INPUTS.json`: content-identified raw XML identities and API inspection scope.
- `handoffs/PHASE_03_FILE_INVENTORY.json`: exact added/modified inventory, byte hashes, modes and test declarations.
- `handoffs/PHASE_03_IMPLEMENTATION_MATRIX.md`: Phase-3 requirements mapped to source/tests/demo.
- `handoffs/PHASE_03_PRESERVATION_AUDIT.md`: source areas left unchanged and full regression obligations.
- `handoffs/PHASE_03_DOMAIN_REVIEW_PACKET.md`: rights-aware Level-A human structural/factual review protocol; no fabricated reviewers/results.
- `handoffs/PHASE_03_STATIC_CHECKS.json`: checks actually executed in the offline environment and explicit unrun gates.
- `handoffs/PHASE_03_OFFLINE_HANDOFF.md`: source-delivery account and stop line.
- `handoffs/PHASE_03_RUNTIME_QC_HANDOFF.md`: Codex verifies the user-applied Phase-3 state, repairs it, runs engineering QC, then stops before Phase 4.

Phase-3 runtime QC is recorded in `handoffs/PHASE_03_RUNTIME_QC_REPORT.md`. No human-review result is fabricated. The user explicitly deferred the Level-A pilot as visible validation debt in D045, allowing Phase 4 to start in a later pass.

## Phase 4 delivery records

- `handoffs/PHASE_04_INPUTS.json`: current four content-identified raw XML identities plus inspected System One/Inference public API boundaries.
- `handoffs/PHASE_04_FILE_INVENTORY.json`: exact 23-file Fount overlay inventory with preimage/result hashes and modes.
- `handoffs/PHASE_04_IMPLEMENTATION_MATRIX.md`: every Temporal/Reader requirement mapped to source/tests/example.
- `handoffs/PHASE_04_PRESERVATION_AUDIT.md`: unchanged Core/Observe/Workshop/StoryWorld functionality and required reruns.
- `handoffs/PHASE_04_DOMAIN_REVIEW_PACKET.md`: rights-aware first-reader checkpoint pilot; no human participants/results fabricated.
- `handoffs/PHASE_04_STATIC_CHECKS.json`: actual offline source/archive results and explicit unrun runtime gates.
- `handoffs/PHASE_04_OFFLINE_HANDOFF.md`: current source-delivery account.
- `handoffs/PHASE_04_RUNTIME_QC_HANDOFF.md`: historical Codex QC instructions for the applied Phase-4 state.
- `handoffs/PHASE_04_RUNTIME_QC_REPORT.md`: executed Phase-4 engineering and preservation evidence, with the D046 completion addendum.
- `handoffs/PHASE_04_DOCSET_HASHES.json`: post-QC complete-docset file hashes, excluding the self-referential hash index.

## Phase 5 delivery records

- `handoffs/PHASE_05_INPUTS.json`: five content-identified raw XML identities plus inspected System One, Inference, ASM and Observe API boundaries.
- `handoffs/PHASE_05_FILE_INVENTORY.json`: exact 36-file overlay inventory with preimage/result hashes and modes.
- `handoffs/PHASE_05_IMPLEMENTATION_MATRIX.md`: every Phase-5 diagnosis/acquisition/playbook/reporting/resource requirement mapped to source/tests/example.
- `handoffs/PHASE_05_PRESERVATION_AUDIT.md`: Core/Workshop/StoryWorld/Reader/low-level-playbook preservation and required runtime reruns.
- `handoffs/PHASE_05_DOMAIN_REVIEW_PACKET.md`: optional rights-aware diagnosis/usefulness review protocol; no human participants/results fabricated.
- `handoffs/PHASE_05_STATIC_CHECKS.json`: actual offline source/asset/archive results and explicit unrun runtime gates.
- `handoffs/PHASE_05_OFFLINE_HANDOFF.md`: current source-delivery account.
- `handoffs/PHASE_05_RUNTIME_QC_HANDOFF.md`: Codex verifies the user-applied Phase-5 state, repairs it, runs engineering QC, then stops before Phase 6.
- `handoffs/PHASE_05_DOCSET_HASHES.json`: complete updated-docset file identities generated by the source-writing delivery, excluding itself and `SHA256SUMS.txt` to avoid a mutual checksum cycle.

## Phase 6 delivery records

- `handoffs/PHASE_06_INPUTS.json`: five content-identified raw XML identities plus inspected Fount/System One/Inference/ASM API boundaries.
- `handoffs/PHASE_06_FILE_INVENTORY.json`: exact 31-operation Fount overlay inventory with preimage/result hashes and modes.
- `handoffs/PHASE_06_IMPLEMENTATION_MATRIX.md`: every Scene/Agency/Character/Relationship requirement mapped to source/tests/example.
- `handoffs/PHASE_06_PRESERVATION_AUDIT.md`: unchanged Core/Workshop/StoryWorld/Reader/Diagnosis behavior and required runtime reruns.
- `handoffs/PHASE_06_DOMAIN_REVIEW_PACKET.md`: optional rights-aware capability usefulness review protocol; no human participants/results fabricated.
- `handoffs/PHASE_06_STATIC_CHECKS.json`: actual offline source/asset/archive results and explicit unrun runtime gates.
- `handoffs/PHASE_06_OFFLINE_HANDOFF.md`: current source-delivery account and Phase-7 stop line.
- `handoffs/PHASE_06_RUNTIME_QC_HANDOFF.md`: Codex verifies the user-applied Phase-6 state, repairs it, runs engineering/preservation QC, then stops before Phase 7.
- `handoffs/PHASE_06_DOCSET_HASHES.json`: complete updated-docset identities, excluding itself and `SHA256SUMS.txt` to avoid a mutual checksum cycle.

- `handoffs/PHASE_06_RUNTIME_QC_REPORT.md`: applied commit/tree, repair commit/tree, engineering and preservation gates, skipped optional human review.

## Phase 7 delivery records

- `handoffs/PHASE_07_INPUTS.json`: five content-identified raw XML identities plus the exact System One/Inference/ASM/Fount APIs inspected for this phase.
- `handoffs/PHASE_07_FILE_INVENTORY.json`: exact 30-operation Fount overlay inventory with preimage/result hashes, bytes and modes.
- `handoffs/PHASE_07_IMPLEMENTATION_MATRIX.md`: Audience/Sequence/Dialogue/Setup-Payoff requirements mapped to source/tests/example and writer use.
- `handoffs/PHASE_07_PRESERVATION_AUDIT.md`: unchanged Core/Workshop and reused StoryWorld/Reader/Temporal behavior plus required runtime reruns.
- `handoffs/PHASE_07_DOMAIN_REVIEW_PACKET.md`: optional rights-aware capability usefulness review protocol; no human participants/results fabricated.
- `handoffs/PHASE_07_STATIC_CHECKS.json`: actual offline source/asset/archive/transport results and explicit unrun runtime gates.
- `handoffs/PHASE_07_OFFLINE_HANDOFF.md`: current source-delivery account and Phase-8 stop line.
- `handoffs/PHASE_07_RUNTIME_QC_HANDOFF.md`: Codex verifies the user-applied Phase-7 state, repairs it, runs engineering/preservation QC, then stops before Phase 8.
- `handoffs/PHASE_07_DOCSET_HASHES.json`: complete updated-docset identities, excluding itself and `SHA256SUMS.txt` to avoid a mutual checksum cycle.
- `handoffs/PHASE_07_RUNTIME_QC_REPORT.md`: verified applied/repaired commits, engineering and preservation gates, defects, repairs and validation debt.

## Phase 8 delivery records

- `handoffs/PHASE_08_INPUTS.json`: five content-identified XML identities and inspected API boundaries.
- `handoffs/PHASE_08_FILE_INVENTORY.json`: exact 37-operation overlay inventory with preimage/result hashes and sizes.
- `handoffs/PHASE_08_IMPLEMENTATION_MATRIX.md`: every Phase-8 capability/extensibility/revision requirement mapped to source/tests/writer value.
- `handoffs/PHASE_08_PRESERVATION_AUDIT.md`: protected Core/Workshop/prior-family behavior and runtime regression obligations.
- `handoffs/PHASE_08_DOMAIN_REVIEW_PACKET.md`: optional D046 human/domain study; no fabricated result.
- `handoffs/PHASE_08_STATIC_CHECKS.json`: executed offline evidence and explicit unrun runtime gates.
- `handoffs/PHASE_08_OFFLINE_HANDOFF.md`: source delivery, limitations and Phase-9 stop line.
- `handoffs/PHASE_08_RUNTIME_QC_HANDOFF.md`: Codex instructions for user-applied Phase-8 state.
- `handoffs/PHASE_08_RUNTIME_QC_REPORT.md`: executed runtime repair, full quality/preservation evidence and validation debt.
- `handoffs/PHASE_08_DOCSET_HASHES.json`: complete Phase-8 docset identities, excluding recursive checksum files.

## Phase 8 verified checkpoint

Phase 8 runtime QC is COMPLETE at Fount `f7f4d68`; the authoritative command/repair evidence is `handoffs/PHASE_08_RUNTIME_QC_REPORT.md`, with post-repair path identities in `handoffs/PHASE_08_FILE_INVENTORY.json`. Optional human/domain review is unperformed validation debt under D046. Phase 9 remained NOT_STARTED at that historical checkpoint.

## Phase 9 delivery records

- `handoffs/PHASE_09_INPUTS.json`: five content-identified XML identities and inspected Fount/System One/Inference/ASM boundaries.
- `handoffs/PHASE_09_FILE_INVENTORY.json`: exact 19-operation overlay inventory with preimage/result hashes, sizes and modes.
- `handoffs/PHASE_09_IMPLEMENTATION_MATRIX.md`: Workshop Intelligence requirements mapped to source evidence and writer value.
- `handoffs/PHASE_09_PRESERVATION_AUDIT.md`: unchanged ownership/acceptance behavior and required runtime regressions.
- `handoffs/PHASE_09_DOMAIN_REVIEW_PACKET.md`: optional D046 end-to-end writer review; no fabricated result.
- `handoffs/PHASE_09_STATIC_CHECKS.json`: executed offline evidence and explicit unrun runtime gates.
- `handoffs/PHASE_09_OFFLINE_HANDOFF.md`: source-delivery account and Phase-10 stop line.
- `handoffs/PHASE_09_RUNTIME_QC_HANDOFF.md`: historical Codex instructions for the applied Phase-9 state.
- `handoffs/PHASE_09_RUNTIME_QC_REPORT.md`: verified runtime results, repairs, writer loop and final Fount identity.
- `handoffs/PHASE_09_DOCSET_HASHES.json`: complete runtime-QC docset identities, excluding recursive checksum files.

## Phase 9 verified checkpoint

Phase 9 is `COMPLETE` on runtime engineering and preservation QC at Fount `361a9fd`; see `handoffs/PHASE_09_RUNTIME_QC_REPORT.md` and the post-repair `PHASE_09_FILE_INVENTORY.json`. The optional human review is unperformed validation debt under D046.

## Phase 10 delivery records

- `handoffs/PHASE_10_INPUTS.json`: five content-identified XML identities, hashes, versions and inspected external public APIs.
- `handoffs/PHASE_10_FILE_INVENTORY.json`: exact 27-operation overlay inventory with preimage/result hashes, sizes and modes.
- `handoffs/PHASE_10_IMPLEMENTATION_MATRIX.md`: durable persistence/reuse/recomputation and writer outcome mapped to source/tests.
- `handoffs/PHASE_10_PRESERVATION_AUDIT.md`: writer/canon/package-boundary preservation and runtime regressions.
- `handoffs/PHASE_10_STATIC_CHECKS.json`: executed offline evidence and explicit unrun runtime/database gates.
- `handoffs/PHASE_10_OFFLINE_HANDOFF.md`: source-delivery account, risks and Phase-11 stop line.
- `handoffs/PHASE_10_RUNTIME_QC_HANDOFF.md`: Codex instructions for the user-applied Phase-10 state.
- `handoffs/PHASE_10_DOCSET_HASHES.json`: post-QC docset identities, excluding recursive checksum files.

## Current Phase 10 checkpoint

Phase 10 is `COMPLETE` on engineering QC at Fount `6d164f6` (tree `9a94735`). The strict source overlay is `Fount_Phase_10_Durable_Analysis_overlay.zip` with 27 operations and SHA-256 `95c8d53bf8eba195bce384b85f398d7bc8ca12e2ff5cbb1c4af3472b5eb92813`. Runtime migration/compile/ExUnit/preservation evidence is in `handoffs/PHASE_10_RUNTIME_QC_REPORT.md`. Phase 11 has since been source-written.

## Phase 11 delivery records

- `handoffs/PHASE_11_INPUTS.json`: exact five input identities, content-based role identification and inspected external APIs.
- `handoffs/PHASE_11_IMPLEMENTATION_MATRIX.md`: Phase-11 requirement → source/test/evidence mapping.
- `handoffs/PHASE_11_OFFLINE_HANDOFF.md`: source-delivery account and explicit unrun claims.
- `handoffs/PHASE_11_PRESERVATION_AUDIT.md`: preservation risks and runtime proof obligations.
- `handoffs/PHASE_11_STATIC_CHECKS.json`: machine-readable offline checks.
- `handoffs/PHASE_11_FILE_INVENTORY.json`: strict overlay file identities.
- `handoffs/PHASE_11_RUNTIME_QC_HANDOFF.md`: Codex runtime/live repair instructions and Phase-12 stop line.
- `handoffs/PHASE_11_RUNTIME_QC_REPORT.md`: NOT_RUN placeholder to be replaced with actual runtime evidence.
- `handoffs/PHASE_11_DOMAIN_REVIEW_PACKET.md`: optional real human support/validity and writer-usefulness study protocol.
- `handoffs/PHASE_11_DOCSET_HASHES.json`: regenerated complete docset identities excluding itself/SHA256SUMS recursion.

## Current Phase 11 checkpoint

Phase 11 is `COMPLETE` on recorded engineering and authorized live QC; see `handoffs/PHASE_11_RUNTIME_QC_REPORT.md`. Its optional human study remains NOT_RUN validation debt under D046.

## Phase 12 delivery records

- `handoffs/PHASE_12_INPUTS.json`: five content-identified XML roles, hashes and inspected public API boundaries.
- `handoffs/PHASE_12_FILE_INVENTORY.json`: exact 36-operation Fount overlay inventory with preimage/result hashes, sizes and modes.
- `handoffs/PHASE_12_IMPLEMENTATION_MATRIX.md`: W01–W03/W11 and A01–A03/A10 mapped to source/tests.
- `handoffs/PHASE_12_PRESERVATION_AUDIT.md`: canonical/Workshop/dependency preservation obligations.
- `handoffs/PHASE_12_DOMAIN_REVIEW_PACKET.md`: optional D046 writer-process review protocol; NOT_RUN.
- `handoffs/PHASE_12_STATIC_CHECKS.json`: actual offline source/transport checks and explicit runtime NOT_RUN states.
- `handoffs/PHASE_12_OFFLINE_HANDOFF.md`: current source-delivery account and Phase-13 stop line.
- `handoffs/PHASE_12_RUNTIME_QC_HANDOFF.md`: Codex instructions for the user's applied Phase-12 state.
- `handoffs/PHASE_12_RUNTIME_QC_REPORT.md`: applied checkout identity, repairs, full CI, PostgreSQL, CLI writer artifacts and completion evidence.
- `handoffs/PHASE_12_DOCSET_HASHES.json`: regenerated complete docset identities excluding recursive checksum files.

## Current Phase 12 checkpoint

Phase 12 is `COMPLETE` on applicable engineering gates. The strict source overlay is `fount_phase_12_overlay.zip`, 36 operations (23 additions, 13 modifications, no deletions), SHA-256 `51ca6d00d7c1e7a871b08f2657127264886a63df8a0485b6a3a958b61b01bc2b`. The original 36 overlay hashes matched before repair. Full CI, 98 Python tests, 32 PostgreSQL integrations, the CLI example and four archives pass; live-provider and optional human studies remain NOT_RUN. Phase 13 is `NOT_STARTED`.

## Phase 13 delivery records

- `handoffs/PHASE_13_INPUTS.json`: five content-identified XML roles, hashes, real dependency versions and inspected public boundaries.
- `handoffs/PHASE_13_FILE_INVENTORY.json`: exact 24-operation Fount overlay inventory plus transport verification.
- `handoffs/PHASE_13_IMPLEMENTATION_MATRIX.md`: W04–W06 and A02–A05 mapped to source/tests and writer outcome.
- `handoffs/PHASE_13_PRESERVATION_AUDIT.md`: canon, session, dependency and prior-phase preservation obligations.
- `handoffs/PHASE_13_DOMAIN_REVIEW_PACKET.md`: optional D046 original/candidate/generic-control and language/voice tradeoff review; NOT_RUN.
- `handoffs/PHASE_13_STATIC_CHECKS.json`: executed offline checks and explicit runtime NOT_RUN states.
- `handoffs/PHASE_13_OFFLINE_HANDOFF.md`: source-delivery account and Phase-14 stop line.
- `handoffs/PHASE_13_RUNTIME_QC_HANDOFF.md`: Codex instructions for the user-applied Phase-13 state.
- `handoffs/PHASE_13_RUNTIME_QC_REPORT.md`: verified runtime repairs, full engineering gates, PostgreSQL rehearsal resume and deterministic writer evidence.
- `handoffs/PHASE_13_DOCSET_HASHES.json`: complete updated-docset identities excluding recursive checksum files.

## Phase 13 source-delivery checkpoint

At source delivery, Phase 13 was `OFFLINE_IMPLEMENTED`, not `COMPLETE`. The strict overlay is `fount_phase_13_overlay.zip`, 24 operations (13 additions, 11 modifications, no deletions), SHA-256 `204775aabc11810e381bcc53bccb43b644ef19a8a5eb2d5fede3b3666b96ea39`. Strict dry-run/apply/second-dry-run, ZIP integrity and 614-file desired/applied tree identity pass. Focused Phase-9–13 Python source checks pass 41/41. Elixir/Mix/PostgreSQL/live/human gates are NOT_RUN. Phase 14 is `NOT_STARTED`.

## Phase 13 runtime checkpoint

Phase 13 is `COMPLETE` on applicable non-human engineering gates at Fount repair commit `26da17e` (tree `fd17e72`). The original 24 overlay hashes matched before repair; current identities are separate in `PHASE_13_FILE_INVENTORY.json`. Full CI passes 347 workspace tests and architecture/strict quality/docs; 105 Python tests, 33 PostgreSQL integrations, focused writer/PDF/table-read checks and four package builds pass. The optional D046 human/domain study and live providers remain `NOT_RUN`. Phase 14 is `NOT_STARTED`.

## Phase 14 delivery records

- `handoffs/PHASE_14_INPUTS.json`: five content-identified XML roles, hashes, actual dependency versions and inspected public boundaries.
- `handoffs/PHASE_14_FILE_INVENTORY.json`: exact 18-operation overlay inventory plus desired-tree identities and transport verification.
- `handoffs/PHASE_14_IMPLEMENTATION_MATRIX.md`: W07–W09/A06–A08 and stale/rebase/undo mapped to source/tests.
- `handoffs/PHASE_14_PRESERVATION_AUDIT.md`: canon, research, notes, scope, rollback and dependency preservation obligations.
- `handoffs/PHASE_14_DOMAIN_REVIEW_PACKET.md`: optional D046 collaborator/writer review protocol; NOT_RUN.
- `handoffs/PHASE_14_STATIC_CHECKS.json`: executed offline evidence and explicit runtime NOT_RUN states.
- `handoffs/PHASE_14_OFFLINE_HANDOFF.md`: current source-delivery account and Phase-15 stop line.
- `handoffs/PHASE_14_RUNTIME_QC_HANDOFF.md`: Codex instructions for the user's applied Phase-14 state.
- `handoffs/PHASE_14_RUNTIME_QC_REPORT.md`: NOT_RUN placeholder awaiting applied-checkout runtime evidence.
- `handoffs/PHASE_14_DOCSET_HASHES.json`: regenerated complete docset identities excluding recursive checksum files.

## Phase 14 source-delivery checkpoint

Phase 14 is `OFFLINE_IMPLEMENTED`, not `COMPLETE`. The strict overlay is `fount_phase_14_overlay.zip`, 18 operations (11 additions, 7 modifications, no deletions), SHA-256 `586b3192fcdf6447ff85736b2d18e45eb5e1871f331f43442438f4833df922b6`. Strict dry-run/apply/second-dry-run, ZIP integrity and 626-file desired/applied tree identity pass. Focused Phase-9–14 Python source checks pass 49/49. Repository-wide discovery has one supplied-snapshot missing-helper import error; Elixir/Mix/PostgreSQL/live/human gates are NOT_RUN. Phase 15 is `NOT_STARTED`.

