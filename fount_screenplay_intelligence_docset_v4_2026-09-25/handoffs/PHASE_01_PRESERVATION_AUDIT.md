# Phase 1 preservation audit

Status: source ownership reviewed and replacements written; all Elixir behavior checks remain UNRUN. This is not a runtime equivalence certificate. The supplied baseline contains 37 production modules, 26 test-support files (25 test files plus the test helper), and 86 total files under the removed package. Every listed destination exists in the delivered working tree.

## Production modules

| Original source | Disposition | Final source |
|---|---|---|
| `packages/fount_probe/lib/fount_probe/access.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/acquisition/access.ex` |
| `packages/fount_probe/lib/fount_probe/action/layout.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/writing/action_layout.ex` |
| `packages/fount_probe/lib/fount_probe/action.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/action.ex` |
| `packages/fount_probe/lib/fount_probe/budget.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/writing/budget.ex` |
| `packages/fount_probe/lib/fount_probe/catalog.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/registry.ex` |
| `packages/fount_probe/lib/fount_probe/cli.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/inspection_cli.ex` |
| `packages/fount_probe/lib/fount_probe/comparison.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/comparison.ex` |
| `packages/fount_probe/lib/fount_probe/completion.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/writing/completion.ex` |
| `packages/fount_probe/lib/fount_probe/constraints.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/constraints.ex` |
| `packages/fount_probe/lib/fount_probe/continuity.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/continuity.ex` |
| `packages/fount_probe/lib/fount_probe/dependencies.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/dependencies.ex` |
| `packages/fount_probe/lib/fount_probe/dialogue.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/dialogue.ex` |
| `packages/fount_probe/lib/fount_probe/extraction.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/acquisition/extraction.ex` |
| `packages/fount_probe/lib/fount_probe/inventory.ex` | MOVED TO FOUNT | `packages/fount/lib/fount/inventory.ex` |
| `packages/fount_probe/lib/fount_probe/investigation.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/investigation.ex` |
| `packages/fount_probe/lib/fount_probe/jev.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/acquisition/measurements.ex` |
| `packages/fount_probe/lib/fount_probe/knowledge.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/acquisition/knowledge.ex` |
| `packages/fount_probe/lib/fount_probe/knowledge_trace/behavior.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/knowledge_trace/behavior.ex` |
| `packages/fount_probe/lib/fount_probe/knowledge_trace.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/knowledge_trace.ex` |
| `packages/fount_probe/lib/fount_probe/launcher.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/launcher.ex` |
| `packages/fount_probe/lib/fount_probe/live_example.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/fount_workshop/analysis_example.ex` |
| `packages/fount_probe/lib/fount_probe/profile.ex` | REIMPLEMENTED | `packages/fount_observe/lib/fount/observe/lens.ex` |
| `packages/fount_probe/lib/fount_probe/projection.ex` | REIMPLEMENTED | `packages/fount_observe/lib/fount/observe/projection.ex`<br>`packages/fount/lib/fount/selection.ex` |
| `packages/fount_probe/lib/fount_probe/report.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/reporting/report.ex` |
| `packages/fount_probe/lib/fount_probe/retrieval.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/retrieval.ex` |
| `packages/fount_probe/lib/fount_probe/saved_records.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/persistence/saved_records.ex` |
| `packages/fount_probe/lib/fount_probe/scene_mechanics.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/scene_mechanics.ex` |
| `packages/fount_probe/lib/fount_probe/search.ex` | MOVED TO FOUNT | `packages/fount/lib/fount/search.ex` |
| `packages/fount_probe/lib/fount_probe/state.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/acquisition/views.ex` |
| `packages/fount_probe/lib/fount_probe/strategy_contrast.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/strategy_contrast.ex` |
| `packages/fount_probe/lib/fount_probe/voice.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/playbooks/voice.ex` |
| `packages/fount_probe/lib/fount_probe/writing/decision_policy.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence/capabilities/decision_policy.ex` |
| `packages/fount_probe/lib/fount_probe/writing/evidence.ex` | MOVED TO FOUNT | `packages/fount/lib/fount/source_evidence.ex` |
| `packages/fount_probe/lib/fount_probe/writing/executor.ex` | REIMPLEMENTED | `packages/fount_observe/lib/fount/observe/association.ex` |
| `packages/fount_probe/lib/fount_probe.ex` | REIMPLEMENTED | `packages/fount_intelligence/lib/fount/intelligence.ex` |
| `packages/fount_probe/lib/mix/tasks/fount.probe.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/mix/tasks/fount.analyze.ex` |
| `packages/fount_probe/lib/mix/tasks/fount.search.ex` | MOVED TO WORKSHOP | `packages/fount_workshop/lib/mix/tasks/fount.search.ex` |

## Tests

Tests retain their behavioral assertions except where the superseded SDK/report/profile boundary is intentionally replaced by neutral contracts. Runtime QC must repair assertions/fixtures, not delete meaningful coverage to make the split pass.

| Original test | Disposition | Destination (unrun) |
|---|---|---|
| `packages/fount_probe/test/adjacent_extraction_test.exs` | MOVED TO WORKSHOP | `packages/fount_workshop/test/analysis_adjacent_extraction_test.exs` |
| `packages/fount_probe/test/catalog_continuation_test.exs` | MOVED TO WORKSHOP | `packages/fount_workshop/test/analysis_catalog_continuation_test.exs` |
| `packages/fount_probe/test/changed_continuity_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/changed_continuity_test.exs` |
| `packages/fount_probe/test/completion_repair_test.exs` | MOVED TO WORKSHOP | `packages/fount_workshop/test/analysis_completion_repair_test.exs` |
| `packages/fount_probe/test/constraint_contract_names_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/constraint_contract_names_test.exs` |
| `packages/fount_probe/test/continuation_constraints_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/continuation_constraints_test.exs` |
| `packages/fount_probe/test/continuation_projection_test.exs` | REIMPLEMENTED | `packages/fount_observe/test/continuation_projection_test.exs` |
| `packages/fount_probe/test/continuation_voice_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/continuation_voice_test.exs` |
| `packages/fount_probe/test/invention_policy_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/invention_policy_test.exs` |
| `packages/fount_probe/test/inventory_test.exs` | MOVED TO FOUNT | `packages/fount/test/canonical_inventory_test.exs` |
| `packages/fount_probe/test/investigation_contract_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/investigation_contract_test.exs` |
| `packages/fount_probe/test/knowledge_behavior_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/knowledge_behavior_test.exs` |
| `packages/fount_probe/test/knowledge_reveal_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/knowledge_reveal_test.exs` |
| `packages/fount_probe/test/knowledge_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/knowledge_test.exs` |
| `packages/fount_probe/test/profile_continuation_test.exs` | REIMPLEMENTED | `packages/fount_observe/test/lens_asset_test.exs` |
| `packages/fount_probe/test/profile_threshold_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/profile_threshold_test.exs` |
| `packages/fount_probe/test/retrieval_exact_continuation_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/retrieval_exact_continuation_test.exs` |
| `packages/fount_probe/test/same_scene_dependencies_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/same_scene_dependencies_test.exs` |
| `packages/fount_probe/test/saved_records_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/saved_records_test.exs` |
| `packages/fount_probe/test/scene_count_scope_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/scene_count_scope_test.exs` |
| `packages/fount_probe/test/search_test.exs` | MOVED TO FOUNT | `packages/fount/test/canonical_search_test.exs` |
| `packages/fount_probe/test/selection_boundary_continuation_test.exs` | REIMPLEMENTED | `packages/fount_observe/test/selection_boundary_continuation_test.exs` |
| `packages/fount_probe/test/state_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/state_test.exs` |
| `packages/fount_probe/test/test_helper.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/test_helper.exs` |
| `packages/fount_probe/test/typed_constraint_targets_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/typed_constraint_targets_test.exs` |
| `packages/fount_probe/test/writing_policies_test.exs` | REIMPLEMENTED | `packages/fount_intelligence/test/writing_policies_test.exs` |

## Remaining package files

| Original file | Disposition and preservation |
|---|---|
| `packages/fount_probe/.formatter.exs` | New package formatter configuration retained. |
| `packages/fount_probe/CHANGELOG.md` | New package changelogs record offline Phase 1; historical source remains in Git/input snapshot. |
| `packages/fount_probe/LICENSE` | MIT license retained in each new package. |
| `packages/fount_probe/README.md` | Replacement architecture/usage/verification and preserved topic guides under Intelligence, plus Workshop writing/analysis examples. |
| `packages/fount_probe/examples/README.md` | Live runner moved to Workshop `examples/analysis.exs`; deterministic examples added to Observe/Intelligence. |
| `packages/fount_probe/examples/live.exs` | Live runner moved to Workshop `examples/analysis.exs`; deterministic examples added to Observe/Intelligence. |
| `packages/fount_probe/guides/architecture.md` | Replacement architecture/usage/verification and preserved topic guides under Intelligence, plus Workshop writing/analysis examples. |
| `packages/fount_probe/guides/comparison-and-ablation.md` | Replacement architecture/usage/verification and preserved topic guides under Intelligence, plus Workshop writing/analysis examples. |
| `packages/fount_probe/guides/investigations-and-evidence.md` | Replacement architecture/usage/verification and preserved topic guides under Intelligence, plus Workshop writing/analysis examples. |
| `packages/fount_probe/guides/tools-and-catalog.md` | Replacement architecture/usage/verification and preserved topic guides under Intelligence, plus Workshop writing/analysis examples. |
| `packages/fount_probe/mix.exs` | Replaced by two complete Mix projects with final package dependency ownership. |
| `packages/fount_probe/mix.lock` | Removed obsolete package lock; current package locks require actual dependency resolution in Codex. No fabricated hashes. |
| `packages/fount_probe/priv/profiles/README.md` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/access.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/action.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/continuity.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/dependencies.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/dialogue.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/knowledge_behavior.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/knowledge_trace.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/retrieval.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/strategy_contrast.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |
| `packages/fount_probe/priv/profiles/voice.json` | Superseded by content-hashed Observe lens assets and pure Intelligence threshold interpretation; no numeric profile reader. |

## Writer workflow preservation

Develop/continue/bridge, alternatives/audition/combine, story propagation, sequence rebuild, character rewrite, notes/conflicts, creative passes, recovery, candidate materialization/rebase, exact review/acceptance/rejection, table reads, PDF exports and mechanical submission checks retain their existing implementation paths and tests in Workshop. Only analytical/configuration/completion ownership was changed. Canonical parser/interchange/edit/persistence tests remain.

The new `examples/phase_one.exs` and `integration/phase_one_writer_demo_test.exs` exercise develop -> reject alternate -> accept selected fixture -> targeted revision -> measured strategy contrast -> compare -> explicit accept/reject -> table-read/Fountain/PDF export. They have not run. Existing integration tests remain necessary; this demonstration does not replace them.

No full new temporal/diagnosis/genre/corpus capability is claimed. The later twelve-family expansion remains assigned to the phases already specified.

## Excluded material

The source snapshot excludes decorative assets, build/dependency directories and potentially other ignored files. Their absence is not proof they do not exist in the real checkout. The overlay enumerates the 86 supplied package files only. It must not invent preimage hashes or delete unlisted files. Codex must inspect any remaining removed-package directory and resolve its actual contents before the Phase 1 exit gate. The supplied applier leaves empty directories; `handoff/prune_deleted_directories.py` removes only empty ancestors of explicitly deleted files, never files or symlinks.
