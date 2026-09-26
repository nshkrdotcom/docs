# Public API and Package Publishing Guidance

## 1. Physical packages

The intended package surface is:

```text
fount
fount_observe
fount_intelligence
fount_workshop
```

There is no `fount_probe` package after Phase 1 and no granular semantic/temporal/reader/diagnose/playbook Mix applications.

## 2. Package roles

### `fount`

Public APIs for canonical screenplay representation, query/slice, edit, revision, persistence, adapters, rendering/export-related substrate, and generic source/provenance concepts.

### `fount_observe`

Public APIs for provider-neutral observations, lenses/measurement requests where external use is useful, deterministic/model-backed measurement, and Sandbox/test support.

Provider adapter internals remain private.

### `fount_intelligence`

Public APIs should be writer/developer meaningful:

```text
analyze/run playbook
query story/temporal/reader state
inspect diagnosis/evidence
compare revisions/candidates
run pure reducers where a real library use case exists
```

Internal Acquisition/Persistence/registry wiring should not become public merely because it exists.

### `fount_workshop`

Public APIs for creative workflows, candidates, alternatives, audition/combine, review/rebase/accept/reject, submission/render/table-read, and generation through Inference.

## 3. Dependency direction

```text
fount_observe      -> fount
fount_intelligence -> fount + fount_observe
fount_workshop     -> fount + fount_intelligence + inference
```

No reverse dependency is allowed.

## 4. Public versus internal modules

Expose stable domain concepts and useful operations.

Keep internal:

- SDK-native response adapters;
- provider retry plumbing;
- asset decoders;
- cache internals;
- registry implementation;
- acquisition scheduler internals;
- persistence query implementation;
- reducer helper modules without standalone value.

Do not expose a provider SDK struct as a Fount public return type.

## 5. Pure-core API

Even though pure dramatic reasoning lives in the same package as playbooks, pure functions should remain directly testable and reasonably callable with values.

Do not force callers through network/persistence to use:

```text
StoryWorld compilation
Temporal reduction
Reader reduction
Diagnosis evaluation against supplied state
```

Public exposure can remain selective; testability is mandatory.

## 6. Observe contract stability

Intelligence should compile against a narrow Observe contract surface:

```text
Observation
Distribution
EvidenceRef
Error/value contracts as needed
high-level acquisition facade in shell modules only
```

Avoid public macros/provider-native types that increase compile-time coupling.

## 7. Domain compatibility stance

The codebase is greenfield and unpublished.

Do not add:

- Probe API compatibility;
- old/new module families;
- dual schema readers;
- code-level `v1`/`v2` variants;
- asset `version` fields for migration compatibility;
- deprecation wrappers.

When analytical asset content changes, use content hashes and source/release identity.

Normal Mix/Hex package release metadata follows ecosystem requirements if/when publishing occurs. This is ordinary packaging, not an excuse for old/new domain APIs.

## 8. Provider dependency pinning

Use dependency/path requirements found in the supplied current source. Do not guess a published `typesafe_api_sdk` or `inference` requirement when snapshots show another composition.

Offline implementation writes the best source-grounded dependency declaration; runtime QC resolves actual Mix/Hex constraints.

## 9. Package metadata

Follow existing workspace conventions for intended publishable packages:

- README;
- CHANGELOG;
- LICENSE;
- ExDoc extras/groups;
- source/homepage links;
- package file allowlist;
- assets/logo when repo convention uses them;
- Mix package release metadata.

Phase-specific agents may create/update metadata; final runtime QC inspects docs and package archives.

## 10. Documentation contract

Every package README answers:

- what the package owns;
- what it explicitly does not own;
- minimum useful example;
- adjacent-package composition;
- provenance/data guarantees;
- provider requirements if any;
- failure semantics;
- test/live configuration;
- links to guides.

`fount_intelligence` README must explicitly explain pure core versus imperative shell and the architecture gate.

## 11. Package extraction policy

Do not create `fount_dramatics` preemptively.

Extraction of the pure core becomes reasonable only if evidence appears for:

- independent third-party consumers;
- independent publishing/release cadence;
- licensing/deployment constraints;
- repeated failure of internal architecture enforcement;
- a true security/process boundary.

Design for extractability; do not pay for it without need.

## Declarative asset authoring surface

Public/package design should expose a safe way to inspect and validate declarative lenses/packs without exposing arbitrary execution:

- list registered executable primitives/contracts;
- validate a pack/lens manifest;
- inspect required context/projection capabilities;
- preview effective composition;
- compute content hash;
- estimate requested resource class;
- install/enable project/studio assets through host policy.

The asset authoring surface follows `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md` and does not make executable registries dynamic code loaders.

## Writer result contract

`fount_intelligence` should expose writer-facing result packets independently of any specific UI. Rich clients consume `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`; the package should also provide or support a deterministic reference renderer for evaluation/debugging.
