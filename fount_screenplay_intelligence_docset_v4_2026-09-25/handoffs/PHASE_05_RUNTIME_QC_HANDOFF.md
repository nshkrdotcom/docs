# Codex QC handoff — Fount Phase 5

You are the runtime/QC agent for **Phase 5 — Diagnosis and Multi-Pass Playbook Shell**. The user has already applied and committed the Phase-5 Fount overlay and complete docset before handing the checkouts to you.

**Do not reapply the overlay. Do not implement Phase 6.** Compile, test, inspect, repair and complete Phase 5 only.

## 1. Establish the applied source

Record the exact Fount and docset commits you received. Compare the applied Phase-5 files with `handoffs/PHASE_05_FILE_INVENTORY.json` and the embedded overlay manifest. The offline Fount input was a raw Repomix export without a current authenticated Git seal; the docset's Phase-4 commit `cfde46cd2f654e050cbb9b5dbe32501625510c69` is historical baseline context only.

If an applied file differs from the manifest payload, inspect the user commit and any legitimate baseline repair. Preserve unrelated work; do not bypass a preimage/payload mismatch with blind extraction.

## 2. Read the exact Phase-5 contracts

Before repair, read:

- `PROGRESS.md`;
- Phase 5 in `16_PHASED_IMPLEMENTATION_PLAN.md`;
- `09_DIAGNOSIS_SYSTEM.md`;
- `10_PLAYBOOKS_AND_WRITER_WORKFLOWS.md`;
- `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`;
- `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`;
- `24_INTERNAL_BOUNDARY_ENFORCEMENT.md`;
- `handoffs/PHASE_05_IMPLEMENTATION_MATRIX.md`;
- `handoffs/PHASE_05_PRESERVATION_AUDIT.md`;
- `handoffs/PHASE_05_STATIC_CHECKS.json`.

The central boundary is:

```text
pure Diagnosis: explicit data in -> diagnosis / evidence need out; no acquisition/provider/persistence
shell: plan -> Observe -> pure reduce/query -> closed Context -> Observe -> pure diagnosis -> writer packet
Workshop: creative candidate pages and canonical acceptance
```

## 3. Focused compile/test first

Use the checkout's real toolchain and repository-native aliases. First make the new source format/compile clean and run the focused Phase-5 tests:

```bash
mix format --check-formatted
mix compile --warnings-as-errors

cd packages/fount_intelligence
mix test test/diagnosis_test.exs
mix test test/context_builder_test.exs
mix test test/writer_registry_test.exs
mix test test/writer_packet_test.exs
mix test test/writer_runner_test.exs
mix test test/phase_five_architecture_test.exs
mix run examples/phase_five.exs
cd ../..
```

Repair actual failures rather than weakening the contracts. In particular, do not turn partial coverage into a clean result, let future capability-family assumptions leak into Phase 5, or make provider/session code part of the pure core.

The source-writing environment did not have Elixir/Mix, so syntax, formatting, structs/specs, runtime behavior and all ExUnit assertions require real verification now.

## 4. Phase-5 correctness ladder

Verify with executed tests:

1. `Diagnosis.evaluate/4` is deterministic and provider/persistence free;
2. an unassessed hypothesis returns an explicit `EvidenceNeed`, not an invented conclusion;
3. competing supported hypotheses can coexist without choosing a single winner;
4. supported counterevidence remains visible and raises uncertainty rather than disappearing;
5. uncertain/unsupported hypotheses produce abstention records that preserve alternatives, evidence and next investigations;
6. the base Observe relevance pass never filters source evidence out of the diagnosis request;
7. hypothesis evidence IDs must be nonempty, unique and inside the selected source evidence;
8. default source selection that exceeds `max_evidence_fragments` is explicitly partial even if every scheduled provider call succeeds;
9. Intelligence structs and any other runtime structs are rejected before Observe context construction;
10. unknown context slots fail before provider dispatch;
11. `ContextBuilder` uses the installed lens contract and Observe-owned Fact/Belief/Relation/etc. primitives rather than mirrored Intelligence structs;
12. preflight makes no provider call and reserves no analysis budget;
13. the playbook-level provider-request cap and shared measurement-state budget apply across both acquisition passes;
14. exhausted/skipped/failed contextual work leaves missing evidence and `partial` coverage;
15. actual usage records base/contextual acquisition and budget consumption; unknown hosted cost stays unknown rather than becoming zero;
16. `Sandbox` can drive the entire multi-pass path deterministically with a fixed run ID;
17. exactly the ten Phase-5 writer playbooks are exposed by `writer_playbooks/0`;
18. the existing low-level playbook registry and `run/execute/plan/explain` paths still work;
19. the writer packet keeps source evidence, derived state, diagnoses, strategies and candidate material separate;
20. acquisition/reduction execution trace is provenance, not mislabeled screenplay trajectory;
21. candidate pages remain Workshop-owned (`candidate` is nil in this investigative phase);
22. no Phase-6 Scene/Agency/Character/Relationship capability-family implementation has been smuggled into this phase.

Add focused regressions if a repair reveals a gap.

## 5. Architecture and dependency audit

Run the compiled architecture gate and inspect dependency graphs. At minimum prove:

- pure `Fount.Intelligence.Diagnosis*` has no Observe execution, acquisition, Repo/persistence, SystemOneSDK, Inference, ASM, filesystem/network/environment, clock/random or hidden mutable-state dependency;
- the shell may call `Fount.Observe`, but provider-native types terminate behind Observe;
- `fount_intelligence` still has no direct SystemOneSDK, Inference or ASM dependency;
- Inference remains Workshop-owned;
- ASM remains behind Inference/its consuming application and is not a new Fount runtime dependency;
- the two new diagnosis lenses remain closed declarative assets and cannot name arbitrary executable modules/functions;
- the four-package Fount DAG remains intact.

The five attached dependency snapshots were inspected offline: SystemOneSDK 0.6.0, Inference 0.5.0 and ASM 0.17.1. Phase 5 itself uses none of those public facades directly.

## 6. Full preservation ladder

After focused fixes, run the current repository equivalents of:

```bash
python3 scripts/tests/test_phase_five_source.py
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v
bash scripts/verify_handoff.sh --offline
mix format --check-formatted
mix compile --warnings-as-errors
mix test
mix ci
mix fount.architecture
```

Also run package-local strict Credo, Dialyzer, ExDoc warnings-as-errors and Hex/package inspection as required by the current checkout. Re-run the existing StoryWorld/Temporal/Reader/low-level-playbook tests and Observe context/measurement/cache/provider/Sandbox tests.

Run the current isolated Core/Workshop persistence and writer-preservation gates, including DB-backed workflows, acceptance/rejection and PDF/export checks when the repository's QC policy requires them. Phase 5 intentionally changes no Core or Workshop source, but earlier green results do not automatically transfer across a new Intelligence/Observe build.

### Known offline Python gap

The supplied Fount XML contains `scripts/tests/test_prune_deleted_directories.py` but omits `scripts/prune_deleted_directories.py`. Offline discovery therefore ran 35 tests with 34 successful and one import error. Inspect the real applied checkout. If the helper legitimately exists there, rerun normally. If it is still absent, reconcile it from repository history/current policy; do not attribute it to Phase 5 without evidence and do not fabricate a passing result.

## 7. Screenwriter-facing demonstration

Run `packages/fount_intelligence/examples/phase_five.exs` and inspect the rendered packet, not merely the exit code. The interrogation case should make the writing decision clearer by showing the writer concern/intended effect/protected strength, exact evidence, more than one testable explanation, counterpoint/uncertainty, coverage/resource usage and next investigation while avoiding a screenplay score or automatic rewrite.

If the output is technically valid but confusing or semantically mislabeled, repair the Phase-5 packet/renderer within this phase.

No hosted provider call is required merely to complete the deterministic Sandbox demonstration. Do not expose screenplay text or spend provider resources unless a current explicit gate requires it and the user authorizes it.

## 8. Optional human usefulness pilot

`PHASE_05_DOMAIN_REVIEW_PACKET.md` is retained under D046. It was not run offline. You may skip it without blocking Phase-5 engineering completion; record it as validation debt. Do not invent screenwriters/reviewers, usefulness findings, human agreement or calibration.

## 9. Required QC record

Create `handoffs/PHASE_05_RUNTIME_QC_REPORT.md` containing:

- exact applied Fount/docset commits;
- toolchain versions;
- exact commands, exit codes and test counts;
- every repair and why it was required;
- post-repair file/source identity;
- focused correctness-ladder evidence;
- full architecture/preservation/package evidence;
- writer demonstration result;
- status of the optional human pilot;
- remaining limitations/debt.

Update `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `PHASE_05_IMPLEMENTATION_MATRIX.md`, `PHASE_05_FILE_INVENTORY.json` if repair payloads change, and regenerate docset integrity records.

Set Phase 5 to `COMPLETE` only when applicable engineering gates pass. Otherwise use the appropriate blocked/in-progress status with exact blockers.

**STOP AFTER PHASE 5. Do not implement Phase 6 in this QC pass.**