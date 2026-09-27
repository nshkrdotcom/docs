# Phase 9 offline source handoff — Workshop Intelligence Integration

**Status:** `OFFLINE_IMPLEMENTED`, not COMPLETE. **Stop before Phase 10.**

## What is delivered

The Fount overlay connects the already-implemented Intelligence capability/revision surfaces to the existing writer-controlled Workshop session path. It adds provider-free preflight, optional prewrite writer packets, note reaction/cause/treatment triage, diagnosis/strategy/candidate lineage, exact duplicate-strategy rejection, compact analysis-guided generation context, explicit post-candidate Revision Intelligence, advisory protected-strength/collateral checks, consequence/resource metadata, and lineage preservation through review/audition/combine/rebase.

The bridge calls actual public Fount APIs inspected in the supplied source. It does not add a direct SystemOneSDK, ASM or Inference-completion call. Generation remains Workshop/Inference-owned; analysis acquisition remains Observe-owned; canonical mutation remains typed Fount edits plus explicit writer acceptance.

## Screenplay-writing outcome

With an Observe provider configured, a substantial revision session can diagnose selected material before prose generation, attach that diagnosis to genuinely different strategy attempts, generate real candidate pages, then compare base versus candidate for intended effect, protected strengths and collateral/causal consequences. The review packet exposes the prewrite packet, postwrite packet, strategy lineage, note triage and resource use separately from the pages/diff.

Without Observe, the existing writing lane continues to work. Analysis is reported as `not_run`; it is never fabricated. This preserves existing hosts while making Intelligence first-class when the host supplies it.

## Writer-control boundary

Phase-9 semantic regression checks are advisory. Core's required-only review gate is unchanged. No analysis packet or model output accepts/rejects canon. Expected-base/content-hash review and an explicit writer decision remain authoritative.

## Offline evidence actually executed

- 61 Phase 1–9 source-contract tests pass.
- Python compilation passes for changed source tests and overlay/snapshot helpers.
- Direct-provider boundary scan of the new bridge passes.
- Overlay ZIP integrity passes.
- The strict 19-operation overlay dry-runs and applies against a fresh decoded supplied Fount baseline; a second dry-run sees all 19 unchanged; applied/desired trees match after generated cache/backup artifacts are removed.
- Repository-wide Python discovery reaches 70 tests; 69 pass and one import error remains because this supplied XML omits the pre-existing `prune_deleted_directories` implementation module. This is recorded as an input-snapshot limitation, not a pass.

## Checks not run here

Elixir, Erlang and Mix are absent. No claim is made for formatting, compile, ExUnit, root `mix ci`, compiled architecture, Credo, Dialyzer, ExDoc, package archives, PostgreSQL integrations, actual Workshop generation, PDF/table-read/render, live providers, or human/domain review.

## Required next action

Apply and commit `Fount_Phase09_Overlay.zip` and the complete updated docset. Codex starts from those applied commits, **does not reapply the overlay**, verifies the 19 delivered paths, formats/compiles/tests the actual checkout, repairs Phase 9 only, runs the complete engineering/preservation ladder including a deterministic end-to-end Workshop+Intelligence writing session, records exact evidence in a new Phase-9 runtime report, and then stops. **Do not begin Phase 10.**
