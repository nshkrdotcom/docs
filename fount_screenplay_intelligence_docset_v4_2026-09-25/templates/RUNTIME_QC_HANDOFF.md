# Phase NN — runtime QC and completion

Fill every phase-specific field before delivery. Return this Markdown as its own download and include identical bytes under docset handoffs/.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Start here

The user has already applied both ZIPs to the Fount and docset repositories, committed and pushed both. No further user application or docset editing is needed. Work from those commits; do not reapply the overlay. Read AGENT_START_HERE.md, state.json, the Phase NN spec, its offline handoff, inputs, implementation matrix and copied overlay manifest. Verify result hashes/deletions and record actual applied commits; do not invent them from input baseline hashes.

## What was implemented

Concrete writer outcome, public contracts, changed files, migration order and dependency assumptions. Give phase-specific risk areas and exact source/test locations. Record source baseline and the three returned artifact names.

## Validation already performed

Exact static commands/results. The web agent had no Elixir and only created/edited code, tests and docs; Elixir/application database/browser/PDF checks were NOT_RUN. Record any other unexecuted checks explicitly. Source inspection is not runtime evidence.

## Execute and repair

Run RUNTIME_QC.md plus each acceptance ID in this phase. Supply concrete new test paths/commands in this section, including new Run/host migration commands introduced by the overlay. Configure isolated test PostgreSQL and fake services; fix ordinary compile/API/runtime/test failures within this phase. Preserve unrelated work and keep paid provider calls optional unless explicitly authorized.

## Leave the next handoff ready

Record PHASE_NN_RUNTIME_QC_REPORT.md with all runtime destinations above, user-applied commits, repairs, verified final code commit/tree, actual commands/results and remaining optional limitations. Set COMPLETE only when required engineering gates pass; otherwise retain this phase as QC_FAILED with actionable evidence. Update state/traceability/decisions, refresh/validate, commit and push code/docset changes, and prepare five fresh XMLs from corrected commits for the next phase. Stop after preparing that handoff. After Phase 06, mark the plan finished and queue no further phase.