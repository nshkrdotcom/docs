# Phase 2 implementation and acceptance matrix

All 19 Phase 2 rows are **QC_VERIFIED** by the commands below and `PHASE_02_RUNTIME_QC_REPORT.md`. The original 32 ExUnit tests plus two runtime regressions pass.
`O/` below means `packages/fount_observe/`. Existing tests remain in place. This
matrix maps the complete Phase 2 brief in document 16 and its document 36 demo;
it does not advance later capability, persistence or writer-product phases.

| Requirement | Implementation | Actual runtime evidence |
|---|---|---|
| Leaf result/observation/distribution/target/evidence/error contracts | Existing neutral structs retained; `distribution.ex`, `measurement_result.ex`, `request.ex`; exact source resolvers retained | Observe contract suite 59/59; compiled architecture 0 violations. |
| Logical output identity plus canonical data-shape digest | `output_contract.ex`, `question.ex`, `measurement_spec.ex`; closed shape grammar, ordered domains, 64 KiB shape cap | `phase_two_contracts_test.exs` passed; fixture digest Python/ExUnit checks passed. |
| Stale output fails closed or reacquires | `executor.ex` hit validation; `recording.ex` active contract import; `sandbox.ex` fixture output binding | Cache poison, stale import and stale fixture tests passed in Observe 59/59. |
| Reusable result versus current Observation provenance | Request semantic serializer and dependencies; Executor measurement/result IDs and fresh Observation envelope | Cross-revision cache/evidence tests passed; scene packet refs match current revision. |
| Projection registry and source minimization | `registry.ex` declarative projection identity; new `Projection.request/5` over preserved `at/4`; no hidden/future material from canonical selection | Projection and hidden-note tests passed; live/fixture scene packet cites six visible refs. |
| Neutral typed serializable closed context | `context.ex`: schema validation, `from_map/2`, storage/semantic maps, content hash, evidence-pointer binding, per-run shape memoization | Context shape/roundtrip and closed-slot tests passed. |
| Calibration assets and raw preservation | `calibration.ex`, identity asset, optional separate MeasurementResult view; raw probabilities and reported confidence untouched | Calibration/raw tests passed; live packet has raw answers and null calibration. |
| Exact spec/input/model/parameter identity | `measurement_spec.ex`, `Request.semantic_input/1`, `fingerprint.ex`, SystemOne adapter; Intelligence bridge hashes same semantic context | Identity sensitivity tests passed; SDK live requested/reported model identities captured. |
| Mutable model identity cannot enable durable reuse | Fingerprint classification; requested/reported model fields separated; endpoint digest and SDK version recorded | Mutable alias policy tests passed; live `jev-latest` remains mutable alias. |
| DB-free L1 cache with privacy/quota/TTL | `cache/ets.ex`; existing Memory implementation unchanged; explicit namespace required | ETS quota/TTL/namespace/tamper tests passed; Memory tests retained. |
| State/question/wire-size limits and budget | `options.ex`, `measurement_spec.ex`, `budget.ex`, `executor.ex`; SDK wire guard; finite request cap disables retries | State/question/wire cap and atomic budget tests passed; SDK transport size test passed. |
| Timeout/retry/partial association semantics | `provider_call.ex` coordinator; SystemOne progress relay; complete states survive later timeout/cancel/failure | SDK partial-timeout test preserved first state; association, cancel and timeout tests passed. |
| Provider normalization and secret redaction | SDK types terminate in adapter; opaque Provider inspect; safe extras; cache metadata validation | SDK Test normalization/security suite passed; live log secret scan clear; SDK 141 checks passed. |
| Deterministic/human/imported observation paths | `recording.ex`: literal values, explicit producer, no fake probability; input/projection-bound imports and fresh evidence | Human/rule/import tests passed; values had no fabricated probabilities. |
| First-class Sandbox fixture loader | Existing direct fixtures retained; `fixture/3`, `load/2`; local regular JSON, size/duplicate/contract guards | Fixture loader tests and `examples/fixture_file.exs` passed. |
| Resource preflight and honest actual metadata | `resources.ex`, facade `preflight/3`, `Batch.resource_usage`; exact semantic sizes and active caps; unknown money/retries remain nil | Preflight/usage tests passed; unknown remote count regression passed; live usage 499/69 tokens. |
| Safe declarative extensibility hooks | Lens static validation, registered sensors/projections, closed contexts/overrides, cap intersection, no remote/executable names | Custom declaration/host-cap tests passed; no executable or remote asset loading. |
| One useful scene question or honest unavailable result | `scene_question.ex`, `examples/phase_two.exs`, `examples/live.exs` | `examples/phase_two.exs` showed available/unavailable and unchanged Fountain; live scene gave three available answers. |
| Useful workflows and four-package boundaries preserved | No canonical/Workshop/dependency/schema changes; all pre-existing tests and lens files retained | Root `mix ci` passed: 232 tests, compiled architecture, Credo, Dialyzer, ExDoc; DB 11+14, writer reject/accept/PDF, four Hex builds passed. |

The neutral preflight and scene-question surface support inspect/cancel/retry
requirements W01/W11, but the complete session modes and later writer workflows
remain in their assigned phases. The one authorized live TypeSafe measurement is
recorded in the QC report; no human response, improved screenplay quality or
calibration population is claimed.
