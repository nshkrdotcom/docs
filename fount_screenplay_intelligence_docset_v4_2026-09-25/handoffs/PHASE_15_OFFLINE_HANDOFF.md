# Phase 15 Offline Handoff

**Date:** 2026-09-27 (Pacific/Honolulu)  
**Status:** OFFLINE_IMPLEMENTED. Runtime/database QC NOT_RUN. Phase 16 NOT_STARTED.

## Scope implemented

This delivery implements only Phase 15, **Read, Share, Resume, and Prove Usefulness**: W01/W10-W12, A09-A12, and the required whole-workflow integration. It extends the existing writer surface instead of creating another product path.

The writer-facing additions are: a provider-free human table-read packet tied to exact accepted source/selection, explicit human reaction records that cannot be synthesized from TTS, clean accepted-canonical Fountain/FDX sharing with privacy/fidelity manifests, one documented capture→explore→revise→compare→accept/reject→export→resume path using existing CLI commands, and usefulness evidence that preserves human-only/basic-LLM/Fount-assisted outcomes without scoring the screenplay or selecting a winner.

## Artifact

- Overlay: `fount_phase_15_overlay.zip`
- SHA-256: `420cdaf39153461981eb350648cdc1e6230d47c613109fbd9c956e0946b60322`
- Bytes: 42607
- Operations: 17 (8 additions, 9 modifications, 0 deletions)
- Strict dry-run: PASS
- Strict apply to clean extracted Fount XML baseline: PASS (17 changed)
- Second strict dry-run: PASS (17 unchanged)
- Desired/applied tree identity: PASS (634 files)
- ZIP integrity: PASS

Exact path hashes are in `PHASE_15_FILE_INVENTORY.json`.

## Checks actually executed

- Focused Phase-13–15 Python source contracts: 24/24 PASS.
- All phase-source Python contracts: 110/110 PASS.
- Repository-wide Python discovery: 119 tests attempted; 118 pass and one known supplied-snapshot import error remains because `scripts/prune_deleted_directories.py` is absent while its test is present.
- Strict overlay transport and ZIP integrity: PASS as recorded above.

`mix`, `elixir`, and `erl` are not installed in this source-writing environment. Formatter, compiler, ExUnit, full CI, Credo, Dialyzer, ExDoc, Hex builds, PostgreSQL, live providers, TTS/PDF runtime, and human review are therefore **NOT_RUN** and are not claimed.

## API decisions grounded in supplied source

- Human read/share stays provider-free and extends the existing `fount.read` surface. Existing table-read JSON/HTML and optional audio remain intact.
- The read packet uses actual canonical source identities and `Fount.Selection`; reactions are separate records and require an explicit human observer.
- Clean sharing uses Core's actual `Editor.spec_ir/1`, `Screenplay.export_fountain/2` and `Screenplay.to_fdx/1`; it does not build a second serializer.
- Session continuity reuses existing Store/Session/Candidate/Review/Acceptance semantics, including stale refusal and idempotent acceptance.
- The documented basic-LLM comparison uses the actual Inference 0.5.0 facade: `Inference.client!/1`, `Inference.complete/3`, and `Inference.Response.text/1`. No new provider API is invented.
- Workshop dependency ownership is unchanged: generation remains behind Inference/ASM; analytical measurement remains behind Intelligence/Observe/System One.

## Human evidence

The A12 three-condition fixture is deterministic engineering evidence, not a human study. The optional D046 comparative study is **NOT_RUN**. No preference, usefulness, expert, marketability, representative-sample, or workflow-superiority claim is made.

## Runtime handoff

After the user applies and commits the overlay and docset, Codex should follow `PHASE_15_RUNTIME_QC_HANDOFF.md`: verify original hashes, format/compile, repair real Phase-15 defects, execute A09-A12 and the complete scene/session path, run the PostgreSQL durability regression and established preservation gates, inspect generated share/read artifacts, update evidence, and **stop before Phase 16**.