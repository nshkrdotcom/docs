# Phase 2 implementation and acceptance matrix

All Elixir source/test/example rows are **WRITTEN_UNEXECUTED**, not QC_VERIFIED.
`O/` below means `packages/fount_observe/`. Existing tests remain in place. This
matrix maps the complete Phase 2 brief in document 16 and its document 36 demo;
it does not advance later capability, persistence or writer-product phases.

| Requirement | Implementation | Runtime evidence to execute |
|---|---|---|
| Leaf result/observation/distribution/target/evidence/error contracts | Existing neutral structs retained; `distribution.ex`, `measurement_result.ex`, `request.ex`; exact source resolvers retained | Existing `measurement_contract_test.exs`; new contracts/sources tests |
| Logical output identity plus canonical data-shape digest | `output_contract.ex`, `question.ex`, `measurement_spec.ex`; closed shape grammar, ordered domains, 64 KiB shape cap | `phase_two_contracts_test.exs`; fixture output digest test |
| Stale output fails closed or reacquires | `executor.ex` hit validation; `recording.ex` active contract import; `sandbox.ex` fixture output binding | Cache-poison, stale import and fixture tests; no historical readers |
| Reusable result versus current Observation provenance | Request semantic serializer and dependencies; Executor measurement/result IDs and fresh Observation envelope | Existing cross-revision test; exact evidence/dependency rebind test |
| Projection registry and source minimization | `registry.ex` declarative projection identity; new `Projection.request/5` over preserved `at/4`; no hidden/future material from canonical selection | Existing projection/selection tests; new request/private-note tests |
| Neutral typed serializable closed context | `context.ex`: schema validation, `from_map/2`, storage/semantic maps, content hash, evidence-pointer binding, per-run shape memoization | Contract tests: unknown/missing slots, nested invalid schema, type roundtrip, evidence identity separation |
| Calibration assets and raw preservation | `calibration.ex`, identity asset, optional separate MeasurementResult view; raw probabilities and reported confidence untouched | Identity/temperature/model mismatch and raw-retention tests; no empirical validation claimed |
| Exact spec/input/model/parameter identity | `measurement_spec.ex`, `Request.semantic_input/1`, `fingerprint.ex`, SystemOne adapter; Intelligence bridge hashes same semantic context | Existing input/question/model sensitivity tests; new context/revision tests |
| Mutable model identity cannot enable durable reuse | Fingerprint classification; requested/reported model fields separated; endpoint digest and SDK version recorded | Mutable-alias rejection test; SDK boundary test; live identity capture pending |
| DB-free L1 cache with privacy/quota/TTL | `cache/ets.ex`; existing Memory implementation unchanged; explicit namespace required | LRU/TTL/clear/quota tests, namespace test, malformed cache reacquisition |
| State/question/wire-size limits and budget | `options.ex`, `measurement_spec.ex`, `budget.ex`, `executor.ex`; SDK wire guard; finite request cap disables retries | State/question/wire cap, atomic budget, finite dispatch and prior budget/cancellation tests |
| Timeout/retry/partial association semantics | `provider_call.ex` coordinator; SystemOne progress relay; complete states survive later timeout/cancel/failure | New real-SDK Test transport partial-timeout test; existing duplicate/missing/error tests; real worker cleanup QC |
| Provider normalization and secret redaction | SDK types terminate in adapter; opaque Provider inspect; safe extras; cache metadata validation | Existing SystemOne boundary/privacy tests, new metadata poison and extras tests |
| Deterministic/human/imported observation paths | `recording.ex`: literal values, explicit producer, no fake probability; input/projection-bound imports and fresh evidence | Human/rule/import tests; caller computes rule outside Observe, no executable asset callbacks |
| First-class Sandbox fixture loader | Existing direct fixtures retained; `fixture/3`, `load/2`; local regular JSON, size/duplicate/contract guards | Fixture packet and installed fixture tests; `examples/fixture_file.exs` |
| Resource preflight and honest actual metadata | `resources.ex`, facade `preflight/3`, `Batch.resource_usage`; exact semantic sizes and active caps; unknown money/retries remain nil | No-spend preflight and resource assertions; live usage metadata inspection |
| Safe declarative extensibility hooks | Lens static validation, registered sensors/projections, closed contexts/overrides, cap intersection, no remote/executable names | Closed declaration and host-cap tests; later pack install/catalog work not implemented |
| One useful scene question or honest unavailable result | `scene_question.ex`, `examples/phase_two.exs`, `examples/live.exs` | `phase_two_scene_question_test.exs`; actual demo commands in QC handoff |
| Useful workflows and four-package boundaries preserved | No canonical/Workshop/dependency/schema changes; all pre-existing tests and lens files retained | Full workspace tests, compiled architecture gate, stored writer/integration demonstrations |

The neutral preflight and scene-question surface support inspect/cancel/retry
requirements W01/W11, but the complete session modes and later writer workflows
remain in their assigned phases. No human response, improved screenplay quality,
calibration population, or live provider success is fabricated.
