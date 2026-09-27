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

## Four XML phase inputs

Every implementation phase receives exactly:

- `fount.xml`;
- `system_one_sdk.xml`;
- `inference.xml`;
- `docset.xml`, containing this complete current docset.

The docset is an implementation specification, not a source-code snapshot.

Documents 32–36 add screenplay-first research, writer workflows, actual SDK collaboration, the user-applied ZIP protocol, and four product phases. Final acceptance is Phase 16. Phase 1 is still next.

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

Phase 1 is offline implemented and awaits runtime verification/repair. These records do not advance the next phase.
