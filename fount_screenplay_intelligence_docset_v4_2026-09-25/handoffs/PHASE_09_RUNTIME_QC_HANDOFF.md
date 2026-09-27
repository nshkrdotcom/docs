# Codex runtime-QC handoff — Fount Phase 9 Workshop Intelligence Integration

You are the runtime-QC/repair agent for **Phase 9 only**. The user has already applied and committed the Fount overlay and complete docset. **Do not reapply the overlay. Do not implement Phase 10.**

## 1. Establish the applied state

Read `PROGRESS.md`, `DECISIONS.md` (especially D046), Phase 9 in `16_PHASED_IMPLEMENTATION_PLAN.md`, `14_WORKSHOP_INTEGRATION_AND_REVISION_INTELLIGENCE.md`, `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`, `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`, Phase-9 acceptance requirements, and every `handoffs/PHASE_09_*` source-delivery record. Inspect the actual checkout and actual dependency APIs; where the checkout differs from the XML snapshot, the checkout wins.

Record the applied Fount commit/tree and docset commit. Verify all 19 delivered paths against `PHASE_09_FILE_INVENTORY.json` before repair. The supplied XML omits the pre-existing `prune_deleted_directories` implementation imported by one Python test; Phase-8 runtime QC recorded the real tracked helper. Preserve/verify the real helper instead of recreating it from this snapshot.

## 2. Format, compile and focused tests

Use the repository's real SDK path/bootstrap conventions. At minimum run, repairing only Phase-9 defects and rerunning affected gates:

```bash
mix format --check-formatted
mix compile --warnings-as-errors

cd packages/fount_workshop
mix test test/phase_nine_intelligence_test.exs
mix test

cd ../..
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v
bash scripts/verify_handoff.sh --offline
mix ci
```

If local dependency PLTs or generated setup require the same repair procedure used in Phase 8, use the actual repository instructions and record it. Do not claim a command passed unless it ran successfully.

## 3. Prove the Phase-9 integration contract

Verify with focused tests and at least one deterministic end-to-end session using **Observe Sandbox plus explicit mock/scripted Inference**, not a fake persistence/acceptance path:

1. `FountWorkshop.preflight/3` performs no provider/generation call, validates the request, exposes the relevant Intelligence playbook estimate when available, and says `changes_canon=false`.
2. Existing `%{store, inference}` sessions still run with no Observe service. Their metadata says analysis `not_run`; no hidden analysis requirement breaks generation-only callers.
3. When Observe is supplied, prewrite capability analysis runs before strategy/page generation for supported revision workflows and the full writer packet is persisted separately from screenplay pages.
4. Notes keep raw reaction, possible/suggested cause and possible/suggested treatment separate. Do not silently turn free-text reaction into a diagnosis or fix.
5. Generated strategies carry diagnosis/playbook lineage and duplicate semantic signatures are refused. Confirm normal legitimately distinct alternatives still work.
6. Generation prompt context gets the compact semantic packet, while saved provenance retains the full packet/evidence. Check context-size behavior and no secret/provider object leakage.
7. Candidate compilation/check runs explicit base/candidate `revision_regression` only when the Phase-9 Workshop context is present; direct legacy `Candidate.check/4` calls remain valid and record analysis not run.
8. Protected-strength and collateral findings are advisory. Confirm Core `ReviewGate` required-only behavior is unchanged and analysis cannot accept/reject canon.
9. Review packet exposes original/proposed Fountain and diffs plus separate prewrite writer packet, postwrite revision packet, strategy lineage, note triage, consequence proposals/causal ripple, uncertainty/limitations and resource use.
10. Audition/combine/rebase preserve or identify source analysis lineage. Rebase must not invent a fresh successful analysis result.
11. `investigate` with `write_fixes=false` still produces no pages; Intelligence can enrich the investigation without forcing materialization.
12. Explicit writer acceptance/rejection remains stale-base/content-hash protected and is the only canonical decision.
13. Phase 10 durable analysis persistence/cache/recomputation is absent.

## 4. Writer-workflow and preservation ladder

Run the full root `mix ci` and the established Phase-8 preservation gates. With a disposable PostgreSQL test database, run Core and Workshop integration suites, including Develop, targeted rewrite, sequence rebuild, note response, pass, recovery, candidate selection/combine/rebase, accept/reject and the existing PDF/action-layout paths. Run representative table-read/render/export flows and package builds.

Add/repair a deterministic Phase-9 writer demonstration if needed to prove the real loop:

```text
accepted base
→ writer concern + protected strength
→ preflight
→ prewrite diagnosis packet
→ at least two causally distinct strategies
→ candidate pages
→ exact diff + post-candidate revision packet
→ explicit reject of one path / explicit accept of selected path
→ reload accepted revision and verify history/recovery
```

The demonstration should use small fixture material, Observe Sandbox and Mock/Scripted Inference. Do not require a paid/live model for engineering completion. If an authorized narrow live provider check is useful, keep it separate and record actual provider/model identity without secrets.

## 5. Resource and boundary verification

Confirm preflight is provider-free; host resource caps dominate; actual analysis usage is attached after execution; unknown cost dimensions stay unknown; and no provider secret is persisted. Compile/source architecture must still enforce: System One behind Observe, Inference behind Workshop generation, ASM behind Inference, pure Intelligence core without effect dependencies, and Core-owned canon/persistence.

## 6. Optional human/domain review

`PHASE_09_DOMAIN_REVIEW_PACKET.md` is optional under D046 and assumed skipped unless commissioned. If skipped, keep it as visible validation debt. Do not make a human writer-usefulness, audience-response or quality claim.

## 7. Repair/accounting rules and stop line

Repair Phase-9 defects directly in the applied checkout and rerun affected focused/full gates. Do not preserve source-delivery mistakes for compatibility. Update `PHASE_09_FILE_INVENTORY.json` with post-repair hashes/bytes; create `PHASE_09_RUNTIME_QC_REPORT.md` with exact commands, defects, repairs and final commit/tree; update `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, `README.md`, `AGENT_START_HERE.md`, the Phase-9 plan checkpoint, `PHASE_09_DOCSET_HASHES.json`, and `SHA256SUMS.txt`.

Mark Phase 9 `COMPLETE` only when applicable non-human engineering/preservation gates pass. Optional human review may remain validation debt under D046. Then **stop before Phase 10** and return final Fount/docset commit identities plus the runtime report.