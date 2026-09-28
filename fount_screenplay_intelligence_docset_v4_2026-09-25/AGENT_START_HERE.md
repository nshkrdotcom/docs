# Agent entry point

Read this file, `state.json`, `NEXT_HANDOFF.md`, the selected phase, and its referenced contracts before editing code. The state file is the only mutable authority for phase selection. Historical handoffs are evidence, not current instructions. The active plan has six phases. Older phase-file paths are redirects; select only the specs listed in state. Phase 01 covers Core approval safety; all new Run package/schema work begins in Phase 02.

Web chat receives this entire docset as a **Repomix XML** (`docset.xml`) and the Fount source as **Repomix `fount.xml`**, alongside the dependency XMLs. It has **no Elixir**: its phase work is creating/editing code, tests and docs, static inspection and packaging. It returns the complete revised docset ZIP, Fount overlay ZIP and local runtime-QC handoff. By the time the local agent receives that handoff, the user has already applied both ZIPs to their respective repositories, committed and pushed both. Start QC from that installed state. Both agents must update the docset themselves so it is ready for the next step; the user only transfers/applies artifacts, never edits progress or phase instructions.

## Select role and phase automatically

Select the first phase whose status is not `COMPLETE`. If none exists, report completion; never invent a seventh phase.

| State | Web chat with source attachments and no Elixir | Agent in the local Elixir checkout |
| --- | --- | --- |
| `NOT_STARTED` | Implement this phase from the fresh XML baseline | Prepare/verify the five XMLs and handoff for web chat; do not start a different phase |
| `OFFLINE_IMPLEMENTED` | Preserve the pending handoff; do not start the next phase | Verify user's applied overlay; QC and repair this phase |
| `QC_IN_PROGRESS` / `QC_FAILED` | Preserve the current phase; only make a requested repair overlay | Continue runtime QC/repair of this phase |
| All `COMPLETE` | Report finished | Report finished; retain final evidence |

Explicit user instructions can assign local implementation or a repair to web chat. Otherwise use the table. Having a shell or Python in web chat does not make it the runtime role. Inspect `mix --version` locally; never infer Elixir execution from source checks.

## Fixed working paths

- Code: `/home/home/p/g/n/fount`.
- Docs: `/home/home/jb/docs/20260928/fount`.
- Same docs: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`.
- Docs Git root: `/home/home/p/g/n/brainstorms`.
- Dependencies: `/home/home/p/g/n/system_one_sdk`, `/home/home/p/g/n/inference`, `/home/home/p/g/n/agent_session_manager`.

Copy this entire path block into every offline handoff and runtime QC report. Do not replace paths with `~/...`, placeholders, or sandbox extraction paths. Record sandbox paths separately when useful.

## Required reading and behavior

Read `PRODUCT.md`, `ARCHITECTURE.md`, `REVIEW_AND_APPROVAL_MODEL.md`, `DATA_AND_EXECUTION.md`, `HANDOFF_PROTOCOL.md`, `RUNTIME_QC.md`, and the current phase. Read the last runtime QC report when one exists. Inspect actual source definitions before using an API.

Complete one phase per cycle. Web chat labels its result `OFFLINE_IMPLEMENTED`, never `COMPLETE`. Runtime agents repair ordinary failures and may mark `COMPLETE` only with the required executed evidence. Update state, traceability, reports and checksums yourselves; do not ask the user to maintain the docset.

The web agent returns `fount_run_phase_NN_overlay.zip`, `fount_run_phase_NN_docset.zip`, and `PHASE_NN_RUNTIME_QC_HANDOFF.md`. The latter is also in `handoffs/` in the docset ZIP. Runtime QC starts from the user's already applied, committed and pushed repository state and **does not reapply the overlay**. Preserve unrelated work and do not force-push.

After successful QC, commit and push the phase's code repairs and docset changes, then generate the next five XMLs from those corrected commits. Record exact source commits in the QC report; use the containing docset commit for docset identity rather than trying to embed its own future hash. Stop after preparing the next handoff. Paid provider calls and optional writer studies need explicit existing authorization and are not prerequisites for deterministic engineering completion.