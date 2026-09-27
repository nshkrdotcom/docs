# Codex: verify, repair and complete Fount Phase 3 only

**Phase:** 3 — Story-World Pure Core.  
**Source-delivery status:** OFFLINE_IMPLEMENTED; no Elixir/runtime or human-review claim.  
**Date:** 2026-09-26, Pacific/Honolulu.

## Start from the user's already-applied commits

The user will apply and commit `fount_phase_03_overlay.zip` and the separate complete `fount_phase_03_docset.zip`. Start from those commits. **Do not reapply either ZIP, reset unrelated work, or begin Phase 4.** Record the actual Fount/docset commit IDs, clean/dirty state, dependency identities, OS, Elixir/OTP/Mix, Python, Node and PostgreSQL versions. Those identities are not available in the raw source snapshots and must not be guessed.

Read `PROGRESS.md`, `AGENT_START_HERE.md`, Phase 3 in document 16, documents 18/24/27/28/31/35/36, and all `PHASE_03_*` handoffs before changing source.

## Verify source-delivery authenticity first

The overlay is **21 additions, 8 modifications, zero deletions**. Verify the applied result hashes/modes against `handoffs/PHASE_03_FILE_INVENTORY.json` and the archive manifest before making repairs; keep repair diffs distinct. The raw input XMLs are unsealed Repomix exports, so the preimage hashes authenticate the supplied reconstruction, not a live Git commit. Do not use a mismatch bypass.

All production changes should be confined to `packages/fount_intelligence`; the only other overlay addition is `handoff/PHASE_03_SOURCE_NOTES.md`. Preserve unrelated local changes.

## Phase behavior to keep

The source implements a **pure writer-reference StoryWorld**, not a diagnosis or generation engine:

- canonical entity/mention and scene-event scaffolding;
- evidence-backed events, interactions, assertions/facts, goals, commitments, beats and motifs;
- base/recollection/dream/hypothetical/alternate/contested reality scopes;
- event-qualified state transitions for possession/access/resource, injury/death, knowledge/plan and relationship continuity;
- partial diegetic story-time constraints with unknown/ambiguous/contradictory results and no scene-order fallback;
- causal graph independent from story time and presentation;
- source-backed local consistency conflicts;
- state/fact/knowledge/time/causal/evidence/dependency queries;
- reverse dependency/recomputation index and counterfactual support-impact reporting;
- deterministic writer-facing semantic packet and JSON/Markdown reference renderer;
- compatibility ingestion for the existing Phase-2 StoryWorld extraction record kinds.

Do not turn this into Reader state, diagnosis, playbook planning, persistent L2 analysis, or Workshop rewriting. Those are later phases.

## Actual APIs inspected by the source-writing pass

Fount source used actual `%Fount.Screenplay{}`, `Fount.Screenplay.new/1`, `Fount.Screenplay.Model.plain/1`, `Fount.Query`, `Fount.Target`, `Fount.SourceEvidence`, `Fount.ID.hash/1`/`v5/2`, and `Fount.Writing.CanonicalJSON`; Observe inputs are existing leaf values `Observation`, `MeasurementResult`, `Distribution`, `EvidenceRef`, and `TargetRef`.

The supplied SystemOneSDK is 0.6.0; its public facade (`version/0`, `new_client/1`, `noul/2`, `choice/3`, `score/3`, `prepare/1`, evaluation contracts) was inspected. The supplied Inference package is 0.5.0; its client/completion/stream/capability contracts were inspected. **Phase 3 adds no SystemOneSDK or Inference call.** If compilation shows an API mismatch, fix against the checkout source rather than inventing a replacement.

## Offline checks and limits

Read `PHASE_03_STATIC_CHECKS.json`. The offline environment had Python/Ruby/Node but no Elixir/Erlang/Mix. It executed source/diff/JSON/archive checks only. A lexical delimiter scan is not an Elixir parse, and direct grep-based purity scans are not the compiled architecture gate. All ExUnit declarations are unrun.

## Focused runtime QC first

Use the repository's real setup/dependency path. If the checkout still requires the local SDK path from earlier QC, point it at the actual local package; do not alter dependencies just to avoid local resolution.

Run formatting first and retain any source repair diff. Then, at minimum, run the actual repository-native equivalents of:

```bash
mix setup
(cd packages/fount_intelligence && mix format)
(cd packages/fount_intelligence && MIX_ENV=test mix compile --warnings-as-errors)
(cd packages/fount_intelligence && MIX_ENV=test mix test \
  test/story_world_architecture_test.exs \
  test/story_world_records_test.exs \
  test/story_world_records_validation_test.exs \
  test/story_world_reference_test.exs \
  test/story_world_scope_causality_test.exs \
  test/story_world_temporal_test.exs)
(cd packages/fount_intelligence && MIX_ENV=test mix test)
(cd packages/fount_intelligence && MIX_ENV=test mix run examples/phase_three.exs)
```

Repair ordinary defects and add focused regressions; do not weaken assertions, manufacture chronology, hide uncertainty, or use provider/database calls to make the pure core pass.

## High-risk Phase-3 cases to inspect deliberately

1. **Flashback/non-linear continuity:** later-presented state must not leak into earlier diegetic events; scene order is never a chronology fallback.
2. **Event-qualified state:** death/injury/possession/access/knowledge must answer from explicit event/story-time support; incomparable transitions remain unknown/ambiguous.
3. **Temporal ambiguity/contradiction:** overlaps and relation sets must not become a total order; contradictory evidence must retain supporting evidence/constraint IDs.
4. **Reality scope:** dream/recollection/hypothetical/alternate/contested material must not silently mutate base-story state.
5. **Causality:** no causal edge may be inferred merely from temporal or presentation order; deliberately opposite causal/time examples must survive.
6. **Evidence freshness:** frozen observations and exact excerpts must match current screenplay/revision/targets; stale evidence must fail rather than be promoted.
7. **Phase-2 preservation:** existing extraction record kinds must remain ingestible; do not replace/delete `StoryWorld.Records` or old playbook contracts.
8. **Determinism/purity:** same screenplay/observations/records must yield byte-stable reference JSON/Markdown; no provider, Repo, filesystem/network, environment, clock/random or process-state dependency may enter pure StoryWorld.
9. **Writer-facing contract:** packet separates evidence, derived reference state and uncertainty; Phase 3 diagnosis/strategy arrays remain empty and limitations remain explicit.
10. **Counterfactual primitive:** it reports affected support/dependency records only; it must not generate rewritten pages or pretend to simulate the whole film.

## Full preservation / architecture ladder

After focused repairs, run the repository's current full ladder, not historical command assumptions. The supplied source previously exposes `mix ci` and `scripts/verify_handoff.sh`; confirm their current behavior, then run appropriate equivalents including:

```bash
python3 -m unittest discover -s scripts/tests -v
bash -n scripts/verify_handoff.sh
mix ci
bash scripts/verify_handoff.sh --offline
```

Record separate results for formatting, warnings-as-errors compile, full four-package ExUnit, compiled architecture/xref checks, strict Credo, Dialyzer, ExDoc and package inspection. Phase 3 changes no DB schema, Observe execution or Workshop writing code, but run existing isolated DB/Workshop integration and writer/export regressions required by current CI/handoff policy. Do not transfer Phase-2 green evidence to changed Intelligence source.

No new live provider call is required merely to validate this pure phase. Run live checks only if current repository gates explicitly require them or the user authorizes them; never substitute a hosted model result for deterministic StoryWorld correctness.

## Architecture audit

Verify the four-package DAG and the existing `Runner.Architecture` gate. In particular:

- StoryWorld pure modules call no Observe execution/acquisition, Intelligence shell persistence/playbooks/runner, provider, Inference, Repo, filesystem/network/environment, clock/random or hidden process state;
- allowed Observe dependencies are leaf value/contract modules only;
- `MeasurementResult` and current `Observation` provenance remain distinct;
- presentation order, story-time constraints and causality are separate;
- ambiguity remains explicit;
- no Probe compatibility package/wrapper is reintroduced;
- writing/generation/acceptance remains Workshop-owned.

## Required Level-A human structural/factual gate

After engineering fixes, use `PHASE_03_DOMAIN_REVIEW_PACKET.md`. This is a real human gate, not an ExUnit/Codex-review substitute:

- at least 3 rights-cleared feature scripts or substantial feature-script excerpts;
- at least 2 independent structural reviewers;
- rights/provenance/provider-export metadata recorded before analysis;
- deterministic StoryWorld JSON/Markdown + exact evidence/query artifacts per case;
- independent review before reconciliation;
- disagreements classified as software defect, extraction error, legitimate interpretation disagreement, screenplay ambiguity, insufficient evidence, or presentation issue.

Do not fabricate reviewers or results. If engineering QC passes but the real review is unavailable, update Phase 3 to `DOMAIN_REVIEW_PENDING`. Mark `COMPLETE` only when the gate is actually recorded or the user explicitly authorizes a visible validation-debt override.

## Required docset/QC output

Create `handoffs/PHASE_03_RUNTIME_QC_REPORT.md` with exact commands, exit codes/results, repairs and post-repair source identity. Update `PHASE_03_IMPLEMENTATION_MATRIX.md`, `PHASE_03_FILE_INVENTORY.json` if repair payload changes, `TRACEABILITY_MATRIX.md`, `PROGRESS.md`, and any durable decision/spec only if runtime evidence requires it. Produce a complete corrected docset and identify the exact post-QC Fount source for the next Repomix.

**Stop after Phase 3. Do not implement Phase 4 in the same pass.**
