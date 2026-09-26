# Phase <N> Runtime QC Report

**Phase:** <N — NAME>  
**Date:** <YYYY-MM-DD>  
**Baseline before overlay:** <Repomix/SHA if known>  
**Offline overlay:** <filename>  
**Status:** COMPLETE | QC_BLOCKED | DOMAIN_REVIEW_PENDING

## Overlay application

- repository status before apply:
- overlay paths inspected:
- `DELETE_FILES.txt` reviewed/applied:
- unexpected/unrelated changes:

## Toolchain

```text
OS:
Elixir:
OTP:
Mix:
PostgreSQL (if relevant):
Git SHA/status:
```

## Commands actually run

```text
<exact command>
<exit/result>
```

Include focused checks then full gates required by `18_RUNTIME_QC_PROTOCOL.md`.

## Defects found and fixes made

- ...

## Architecture audit

- four-package dependency graph:
- Probe source/dependency/reference scan:
- no compatibility/dual path code:
- pure Intelligence boundary gate (structural boundary + dependency analysis + targeted forbidden-MFA checks + deterministic replay):
- allowed Observe value/contract dependency only; no Observe execution reach-through:
- typed neutral context/closed-slot boundary and runtime validation:
- output-contract identity + canonical data-shape digest checks:
- presentation-order / story-time-constraint / causal-graph separation where relevant:
- Observe L1 / Intelligence L2 ownership:
- cached MeasurementResult vs revision-bound Observation separation:
- cross-revision cache-reuse provenance rebinding checks where relevant:
- Sandbox deterministic integration:
- reader future-leakage checks where relevant:
- explicit Workshop review/acceptance where relevant:

## Functionality preservation audit

- Probe/current behavior items checked:
- Workshop behavior items checked:
- capability-family traceability updated:

## Database checks

- not applicable / exact commands and results

## Provider/live checks

- not applicable / exact authorized checks and results
- provider/model/endpoint identity without secrets:
- if blocked by credentials, state explicitly

## Remaining limitations or blockers

- ...

## Post-QC baseline

- commit/SHA if known:
- next Fount Repomix generated from:
- updated docset artifact:
- `PROGRESS.md` updated:
- next phase ready: yes/no

## Writer-product / domain review

- writer-facing presentation packet checked:
- reference renderer checked:
- resource preflight/actual reporting checked where relevant:
- declarative pack/lens safety checked where relevant:
- rights/corpus manifest checked where relevant:
- domain pilot required: yes/no
- reviewers/readers actually completed pilot: yes/no
- domain findings / usefulness concerns:
- validation debt / explicit override if any:
