# Phase 10 implementation matrix — Durable Analysis Persistence, Reuse, and Recomputation

**Delivery status:** OFFLINE_IMPLEMENTED on 2026-09-27. Runtime QC has not run.

| Phase-10 requirement | Source implementation | Test / demonstration written | Offline status |
|---|---|---|---|
| Durable analysis-run persistence | `packages/fount/lib/fount/persistence/analysis.ex`; `20260927000000_create_durable_analysis_state.exs`; schema additions | `packages/fount_intelligence/integration/phase_ten_durable_analysis_test.exs` | WRITTEN; runtime unrun |
| Keep reusable MeasurementResult distinct from current Observation provenance | `analysis_measurement_results` and `analysis_observations`; `Fount.Intelligence.Persistence.MeasurementCache`; `record_batch/3` | durable-analysis integration plus existing Observe cache/provenance tests called out for QC | WRITTEN; runtime unrun |
| Optional durable L2 cache | `Fount.Intelligence.Persistence.MeasurementCache` implements the existing `Fount.Observe.Cache` behaviour and fronts Core L2 storage | integration test reuses an unchanged semantic request across revisions | WRITTEN; runtime unrun |
| Privacy isolation | L2 primary identity is `(privacy_namespace, cache_key, ordinal)`; Workshop accepts persisted `analysis_privacy_namespace` | integration test uses a second namespace and expects a miss | WRITTEN; runtime unrun |
| Model-fingerprint stability | Phase 10 reuses Observe's existing `:durable` cache policy and immutable/provider-stable fingerprint gate; no duplicate model policy | existing Observe fingerprint/cache tests are required QC; Python source check verifies the actual gate remains used | STATIC VERIFIED; runtime regression pending |
| Output-contract identity | run/cache storage persists logical output-contract ID plus exact digest; cache hits remain revalidated by Observe | durable-analysis integration checks persisted output-contract identity | WRITTEN; runtime unrun |
| Asset/output/model/context changes miss naturally | No Phase-10 shortcut bypasses Observe semantic cache keys; stored rows carry exact semantic/spec/provider/output identity | integration covers context and namespace; existing Observe tests cover question/text/output/model invalidation | WRITTEN / EXISTING; runtime pending |
| No edit-triggered semantic cache deletion | Core writer persistence never references L2 rows; eviction exists only as explicit analysis-cache operation | `scripts/tests/test_phase_ten_source.py` source guard; QC must exercise explicit eviction | PASS static |
| Resource eviction distinct from analytical history | `evict_cache/3` only deletes measurement cache rows; runs/observations/dependencies are separate tables | durable-analysis integration exports audit/usage before/after eviction | WRITTEN; runtime unrun |
| StoryWorld connected-region recomputation | `Fount.Intelligence.Recomputation.plan/4` delegates to existing `Temporal.recomputation_region/2` | `test/phase_ten_recomputation_test.exs` | WRITTEN; runtime unrun |
| Reader presentation-suffix recomputation | same plan delegates to existing `Reader.recomputation_boundary/2` | `test/phase_ten_recomputation_test.exs` | WRITTEN; runtime unrun |
| Diagnosis/report dependency recomputation | durable `analysis_dependencies`; `affected_records/3` resolves latest applicable subject run without overwriting old run rows | durable-analysis integration and recomputation unit test | WRITTEN; runtime unrun |
| Historical audit identity remains exact | analysis runs retain screenplay ID, revision UUID, revision content hash, session/candidate lineage, playbook/content hash, namespace and finished result | integration exports an audit bundle and checks usage/run identity | WRITTEN; runtime unrun |
| Candidate analysis history | Workshop passes session ID and candidate ID into Intelligence persistence; pre/post packets retain run lineage | Phase-10 Workshop resume-history integration | WRITTEN; runtime unrun |
| Writer-facing report export | `Fount.Intelligence.Persistence.export_run/2` and `Fount.Intelligence.export_analysis_run/2` produce canonical JSON audit output | durable-analysis integration | WRITTEN; runtime unrun |
| Current-revision evidence rematerialization | L2 stores MeasurementResult only; every evaluation still goes through Observe, which creates a fresh Observation; durable save validates current screenplay/revision evidence binding | cross-revision reuse scenario in durable-analysis integration | WRITTEN; runtime unrun |
| Retention policy separate from cache policy | candidate/session/run/observation/dependency records do not depend on cache-row retention | Phase-10 resume-history test plus cache-eviction integration | WRITTEN; runtime unrun |
| Durable usage history for longitudinal estimates | analysis runs persist `resource_usage`; `usage_history/4` and public `analysis_usage_history/4` expose actual stored history | durable-analysis integration | WRITTEN; runtime unrun |
| Safe data-only project/studio assets | `save_lens/4`, `save_genre_pack/4`, `save_data_asset/6`; explicit host `allow_project_assets`; content hash, trust/source metadata, disabled-by-default; executable-like keys rejected | durable-analysis integration | WRITTEN; runtime unrun |
| No numeric analytical versions / compatibility generations | migration/API uses stable logical IDs + content hashes; no V1/V2/domain-version reader added | Phase-10 source-contract test | PASS static |
| Preserve Phase-9 writing loop | durable analysis is opt-in; Store + Inference-only lane and optional Observe path remain; acceptance/rejection code unchanged | Phase-9 source-contract suite retained; Codex reruns full Workshop suite | PASS static / runtime pending |
| Phase-10 writer outcome: resume without resurrecting rejected advice or losing unchosen candidates | existing `Session.resume/3` semantics preserved; durable analysis history is independent of candidate decisions | `packages/fount_workshop/integration/phase_ten_resume_history_test.exs` rejects one branch, leaves one unchosen, resumes with an empty completion script, confirms both decisions/history survive and accepted head is unchanged | WRITTEN; **NOT_RUN** |

## Source/API correction recorded in this delivery

Workshop performs post-candidate Revision Intelligence before `save_candidate/3` persists the candidate revision. Phase 10 therefore records exact derived-analysis revision identity as revision UUID plus content hash and retains candidate UUID as lineage, but does not add a premature database foreign key that would force a reordering of the existing writer workflow. See D048.

## Explicit non-goals

- no Phase 11 calibration/corpus/live-verification work;
- no new physical package;
- no direct SystemOneSDK/Inference/ASM call from Phase-10 persistence/recomputation code;
- no cache-based acceptance, ranking, resurrection, or canonical edit;
- no compatibility layer or numeric analytical schema generation;
- no human usefulness claim.
