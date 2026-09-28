# Security, Cost, and Failure Model

## 1. Security posture

Screenplays are valuable unpublished creative material. External provider use must be explicit, minimal, and attributable.

### Provider payload minimization

Projection code should send only the context required by the lens/sensor rather than an entire screenplay by default.

### Credential handling

- use SDK-supported client/credential configuration;
- never persist raw API keys in analysis provenance;
- never print secrets in errors or debug output;
- keep endpoint/model/key selection explicit enough to audit without exposing the secret.

Exact secret-management integration is host-specific and not invented here.

### Cache/privacy isolation

Content-addressed measurement reuse must not become a cross-project information channel. Cache storage/reuse is namespaced according to the configured project/tenant/studio privacy boundary. Matching content hashes do not authorize reuse across privacy scopes.

Cached MeasurementResults do not carry credentials, and current Observations attach only the provenance/evidence authorized for the current run.

## 2. Closed execution surface and safe declarative extensibility

Models and user-supplied asset data cannot execute arbitrary modules/functions/shell commands.

Use closed registries for executable primitives:

- sensor execution primitives;
- projections;
- provider adapters;
- output decoders/contracts;
- reducers/evaluators;
- privileged playbook actions.

Writer questions and validated declarative pack/lens composition may remain open within those capabilities. See `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.

Untrusted lens/pack text is data, not privileged instruction. Measurement models must not gain arbitrary tool privileges from asset content, and host-controlled resource/privacy policy always wins.

## 3. Resource economics

Track execution resources in units that correspond to real work:

```text
provider states evaluated
provider requests/batches
Inference calls
tokens/usage where the SDK exposes it
configured hosted monetary rates
local/on-prem GPU/CPU time where measurable
queue/wall-clock runtime metadata
cache/reuse rate
```

Do not mix TypeSafe/Jev state count with generative Inference call count. Do not assume hosted execution is the only meaningful cost or that local/on-prem execution is free.

Every expensive playbook should support a preflight estimate and post-run actual accounting as specified in `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.

## 4. Playbook budgets

A playbook receives an execution budget and allocates it across required stages. It should be able to:

- skip optional enrichment when budget is low;
- reuse cached observations;
- deduplicate shared sensor requests;
- return partial coverage explicitly;
- never pretend skipped analysis passed;
- expose the active cap and expected/actual resource use to the caller;
- estimate marginal rerun cost/reuse where practical.

## 5. Failure taxonomy

### Input failures

- invalid target/selection;
- stale revision;
- missing required semantic context;
- unsupported lens/target combination.

### Acquisition failures

- missing client/credential;
- provider timeout;
- provider unavailable;
- invalid response;
- request/state too large;
- execution budget exhausted.

### Interpretation failures

- insufficient evidence;
- ambiguous result;
- competing high-probability interpretations;
- calibration unavailable.

### Reduction failures

- invalid temporal ordering;
- missing prerequisite state;
- duplicate event/observation identity;
- incompatible revision mix.

### Diagnosis failures

- insufficient coverage;
- concern too vague;
- evidence supports several alternatives without differentiation.

### Workshop failures

- invalid generated structure;
- unknown target IDs;
- stale candidate base;
- constraint failure;
- persistence conflict;
- Inference provider failure.

These categories must remain distinguishable in APIs and reports.

## 6. Partial results

A playbook can return useful partial coverage if:

- completed stages are clearly identified;
- missing stages/errors are explicit;
- diagnoses that require missing data are withheld or downgraded;
- no missing result is treated as negative evidence.

## 7. Timeouts and retries

Provider adapters own retry/timeout mechanics at acquisition boundaries. Reducers/diagnoses never retry providers themselves.

Retries must preserve request identity and avoid duplicate observations.

## 8. Live-test spending

Runtime QC should use small representative cases. Full-screenplay live sweeps are not required merely to prove connectivity and should not be run casually when a compact fixture verifies the integration contract.

## Phase 11 source-delivery checkpoint — 2026-09-27

Phase 11 adds a fail-closed evaluation corpus boundary rather than weakening existing provider security. Corpus manifests reject credential-like keys recursively and separate human-review permission from hosted Observe/Inference export permission. The live examples read existing environment configuration but serialize only provider-neutral results/fingerprints/resource usage, not keys.

The Phase-11 QC gate explicitly reruns existing Observe regressions where malformed/missing associations cannot become negative evidence, acquisition/budget failures remain explicit, credential-like provider extras are rejected and resource caps are enforced. These runtime regressions are required by the handoff but are **NOT_RUN** by the source-writing pass. Intelligence still has no direct SystemOneSDK, Inference or ASM dependency.
