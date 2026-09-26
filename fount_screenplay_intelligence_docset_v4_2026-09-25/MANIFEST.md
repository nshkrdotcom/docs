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

## Runtime handoffs

- `handoffs/` — phase-specific offline and QC handoffs are added during implementation.

## External phase inputs not contained in this ZIP

Every implementation phase additionally receives fresh source snapshots:

- Fount Repomix XML;
- `typesafe_api_sdk` Repomix XML;
- `inference` Repomix XML.

The docset is an implementation specification, not a source-code snapshot.

## Current revision note

`25_SECOND_ORDER_REVIEW_RESOLUTIONS.md` records the architecture-focused Socratic review. `26_THIRD_ORDER_PRODUCT_REVIEW_RESOLUTIONS.md` records the writer-usefulness review and links the new writer presentation, human validation, safe extensibility, resource economics, and feature-scope contracts. Phase 1 sequencing remains unchanged.

## Integrity

- `SHA256SUMS.txt` — SHA-256 hashes for every docset file except itself.
