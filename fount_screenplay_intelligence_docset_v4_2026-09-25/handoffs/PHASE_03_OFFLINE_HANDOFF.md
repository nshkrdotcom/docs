# Phase 3 offline handoff — Story-World Pure Core

**Status:** OFFLINE_IMPLEMENTED, not COMPLETE.  
**Date:** 2026-09-26, Pacific/Honolulu.  
**Next actor:** Codex/runtime agent, starting from the user's applied Fount/docset commits.  
**Stop line:** complete/repair Phase 3 only; do not begin Phase 4.

## Why Phase 3

The supplied current `PROGRESS.md` records Phases 1 and 2 COMPLETE and Phase 3 — Story-World Pure Core — NOT_STARTED. Phase 3 is therefore the current phase. The stale Phase-2 sentence that remained in `AGENT_START_HERE.md` was updated to match the authoritative progress record.

## Content-identified inputs

The four raw XML attachments were identified by contents, not attachment names. Exact SHA-256/byte/file counts are in `PHASE_03_INPUTS.json`:

- Fount four-package workspace: `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`;
- System One monorepo containing public `system_one_sdk` 0.6.0;
- Inference repository containing public `inference` 0.5.0;
- current numbered implementation docset with `PROGRESS.md` and Phase-1/2 QC records.

They contain no current `snapshot_index`/Git seal. Current commit IDs are therefore deliberately not invented.

## Fount source delivered

The strict overlay contains **21 added, 8 modified, zero deleted files**. Full byte hashes/modes are in `PHASE_03_FILE_INVENTORY.json` and the ZIP's `handoff/fount-overlay.manifest.json`.

Production behavior is confined to `packages/fount_intelligence`:

- `Fount.Intelligence.StoryWorld` public pure facade;
- evidence-backed entities/mentions, events/interactions, assertions, goals, commitments, beats and motifs;
- base/recollection/dream/hypothetical/alternate/contested narrative scopes;
- event-qualified state transitions for possession/access/resources, injury/death, knowledge/plan and relationship state;
- partial story-time nodes/constraints with known, ambiguous, contradictory and unknown results and no scene-order chronology fallback;
- causal relations stored/traversed independently from presentation/story time;
- practical local consistency checks with source evidence;
- query API for state/facts/knowledge/time/causality/evidence/dependencies;
- reverse dependency index and counterfactual support-impact primitive without page generation;
- deterministic writer-facing inspection packet plus JSON/Markdown reference renderers;
- Phase-2 extraction-record preservation through normalization into the richer model.

`examples/phase_three.exs` is the provider-free writer demonstration. New tests cover the explicit Phase-3 acceptance cases listed in the implementation matrix.

## Screenplay-writing usefulness

The source is intentionally a reference layer a writer can interrogate before later diagnosis/rewrite phases. Its main useful questions are:

- What is established to be true at this story event?
- Does a flashback actually occur before this state change, or is that merely how pages are ordered?
- Who possesses/knows/can access something at this point in story time?
- Is chronology known, ambiguous, contradictory, or genuinely unknown?
- Is a claim in base reality, a recollection, a dream, a hypothetical, an alternate, or contested material?
- What exact screenplay evidence supports this fact/relationship?
- What depends on this setup if the writer removes it?
- Is a claimed dependency causal, or merely temporal/presentational?

Phase 3 does not diagnose quality, tell the writer what to fix, or generate replacement pages.

## Actual API inspection

Fount APIs were inspected in supplied source before writing: `%Fount.Screenplay{}`, `Fount.Screenplay.new/1`, `Fount.Screenplay.Model.plain/1`, `Fount.Query`, `Fount.Target`, `Fount.SourceEvidence`, deterministic `Fount.ID.hash/1`/`v5/2`, and `Fount.Writing.CanonicalJSON`; Observe leaf contracts include `Observation`, `MeasurementResult`, `Distribution`, `EvidenceRef`, and `TargetRef`.

SystemOneSDK 0.6.0 public facade/contracts and Inference 0.5.0 public client/completion/stream contracts were inspected. **The Phase-3 pure core calls neither.** System One stays behind Observe acquisition; Inference remains outside pure Intelligence and writing stays Workshop-owned.

## Checks actually executed offline

See `PHASE_03_STATIC_CHECKS.json` for exact results. The source-writing environment has no `elixir`, `mix`, or `erl`, so no Elixir/runtime result is claimed.

Executed checks include changed-file accounting, JSON parsing, a conservative delimiter scan, direct forbidden dependency/effect scans of the new pure namespace, phase-stop/source-preservation checks, and strict overlay validation/dry-run/apply/reapply checks using the repository-supplied applier.

**Unrun:** Elixir parser/formatter, dependency resolution, warnings-as-errors compile, all ExUnit tests, compiled architecture/xref gate, Credo, Dialyzer, ExDoc, package build, examples, PostgreSQL/integration regressions, PDF/speech regressions, providers/live calls, and human review.

## Human/domain gate prepared, not claimed

Document 28 requires the Phase-3 Level-A structural/factual pilot. `PHASE_03_DOMAIN_REVIEW_PACKET.md` prepares the protocol: at least 3 rights-cleared feature scripts/substantial feature excerpts and at least 2 independent structural reviewers, with rights/provenance and disagreement records.

No rights-cleared corpus/reviewer results were supplied to this source-writing environment. No human result is fabricated. If engineering QC passes before the review is performed, Phase 3 becomes `DOMAIN_REVIEW_PENDING`, not COMPLETE, unless the user explicitly authorizes a visible validation-debt override.

## Preservation

No canonical `packages/fount`, Observe, Workshop, root project/locks, migration, lens, SystemOneSDK, or Inference file is changed. Existing Intelligence playbooks/acquisition/reporting/persistence/Reader/capability code remains. See `PHASE_03_PRESERVATION_AUDIT.md`.

## Codex exit criteria

Codex should:

1. verify the already-applied commits and strict overlay result hashes; do not reapply the ZIP;
2. format/compile/test/repair new Phase-3 source against actual APIs;
3. run focused StoryWorld tests/example, then full four-package CI/architecture/preservation gates;
4. record every repair and actual command/result in a Phase-3 runtime-QC report;
5. generate real deterministic reference artifacts for the human pilot after engineering fixes;
6. mark engineering success plus outstanding real review as `DOMAIN_REVIEW_PENDING`, or `COMPLETE` only after the domain gate (or explicit user override) is recorded;
7. stop without implementing Phase 4.