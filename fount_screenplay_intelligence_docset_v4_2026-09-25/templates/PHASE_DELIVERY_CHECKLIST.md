# Offline Phase Delivery Checklist

## Repository overlay

- [ ] Paths are relative to Fount repo root.
- [ ] Every required new/modified file is included.
- [ ] `DELETE_FILES.txt` lists required deletions.
- [ ] No `_build`, `deps`, `.git`, node modules, logs, repomix inputs, secrets, or unrelated files.
- [ ] Tests are included for new behavior.
- [ ] Public docs/guides reflect changed behavior.

## Architecture

- [ ] Four-package topology respected.
- [ ] Phase 1 removes Probe rather than wrapping it; later phases do not reintroduce it.
- [ ] No compatibility/deprecation/dual-path code.
- [ ] Observe measures; Intelligence interprets.
- [ ] Pure Intelligence has no acquisition/persistence/provider/environment/network reach-through.
- [ ] Intelligence-derived Observe context uses Observe-owned typed neutral primitives and closed lens-declared slots; no Intelligence structs or generic junk-drawer attributes cross the boundary.
- [ ] Provider-native types stay inside Observe adapter boundary.
- [ ] Observe Sandbox exists/is updated where required.
- [ ] L1/L2 cache ownership respected.
- [ ] Reusable cached `MeasurementResult` is distinct from revision-bound `Observation` provenance.
- [ ] Cache reuse identity excludes provenance-only revision/database identifiers and includes every semantic/model input that can affect measurement.
- [ ] Reader-state work is forward-only in presentation order.
- [ ] Story-time is modeled separately as partial constraints/qualified state, and causality is not inferred merely from temporal order.
- [ ] Observation/diagnosis/strategy/candidate remain distinct.
- [ ] No universal screenplay-quality score.
- [ ] No arbitrary data-driven code execution.

## Functionality

- [ ] Relevant current Probe behavior mapped/preserved/superseded.
- [ ] Relevant Workshop behavior preserved.
- [ ] Relevant twelve-family requirements implemented for this phase.
- [ ] No behavior silently dropped because its old module disappeared.

## API inspection

- [ ] Relevant Fount source/tests inspected.
- [ ] Relevant `typesafe_api_sdk` source/tests inspected if touched.
- [ ] Relevant `inference` source/tests inspected if touched.
- [ ] No external function invented from memory.

## Domain identity

- [ ] New analytical assets use logical IDs/content hashes, not old/new numeric variants.
- [ ] Output contracts use stable logical identity plus canonical data-shape digest; no numeric schema generation is introduced.
- [ ] Provenance retains screenplay revision/evidence/model/context identities.
- [ ] No raw secrets persisted.

## Honesty

- [ ] Mix not claimed run unless truly available/executed.
- [ ] Tests not claimed passed.
- [ ] Credo/Dialyzer/docs not claimed passed.
- [ ] DB/live checks not claimed passed.
- [ ] Static inspections clearly labeled.

## Handoff

- [ ] Complete updated docset returned.
- [ ] `PROGRESS.md` phase is `OFFLINE_IMPLEMENTED`, not `COMPLETE`.
- [ ] `TRACEABILITY_MATRIX.md` updated.
- [ ] `DECISIONS.md` changed only for real decisions/corrections.
- [ ] Offline handoff lists files, tests, risks, unrun checks, and exact exit criteria.
- [ ] Runtime-QC handoff tells next agent to fix failures and update source/docset.

## Writer product / domain validation

- [ ] Relevant writer-facing output follows `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.
- [ ] Required reference-renderer/evaluation artifacts are included.
- [ ] Human/domain results are not fabricated.
- [ ] Rights/provider-export metadata required by the phase is represented.
- [ ] Safe custom lens/pack work follows `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.
- [ ] Expensive playbooks expose/enforce the required resource estimate/caps for this phase.
- [ ] Feature-film scope is preserved; no unsupported TV/series claim is introduced.
