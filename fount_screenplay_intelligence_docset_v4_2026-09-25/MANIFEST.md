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
- `handoffs/PHASE_09_OFFLINE_HANDOFF.md` / `PHASE_09_RUNTIME_QC_HANDOFF.md` — current Phase-9 source delivery and Codex repair/QC instructions.

## Five XML phase inputs

Every implementation phase receives exactly:

- `fount.xml`;
- `system_one_sdk.xml`;
- `inference.xml`;
- `agent_session_manager.xml`;
- `docset.xml`, containing this complete current docset.

The docset is an implementation specification, not a source-code snapshot.

Documents 32–36 add screenplay-first research, writer workflows, actual SDK collaboration and the user-applied ZIP protocol. Final acceptance is Phase 16. Phases 1–9 are COMPLETE on engineering QC; Phase 10 remains NOT_STARTED. Phase 6, Phase 7 and Phase 8 runtime QC are recorded in `handoffs/PHASE_06_RUNTIME_QC_REPORT.md`, `handoffs/PHASE_07_RUNTIME_QC_REPORT.md` and `handoffs/PHASE_08_RUNTIME_QC_REPORT.md`. Phase 3/4/5/6/7/8 human studies are unperformed validation debt. D046 makes human reviews optional and nonblocking. Use PROGRESS.md for the authoritative checkpoint.

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

## Current Phase 9 checkpoint

Phase 9 is `COMPLETE` on runtime engineering and preservation QC at Fount `361a9fd`; see `handoffs/PHASE_09_RUNTIME_QC_REPORT.md` and the post-repair `PHASE_09_FILE_INVENTORY.json`. The optional human review is unperformed validation debt under D046. Phase 10 is `NOT_STARTED`.
