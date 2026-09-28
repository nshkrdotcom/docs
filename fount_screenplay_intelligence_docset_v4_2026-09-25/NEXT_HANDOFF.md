# Current handoff

Generated from `state.json`. Read `AGENT_START_HERE.md` and the selected phase before acting.

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Next action

Phase 02: Local runtime QC / repair.

Read [phases/02_RUN_FOUNDATION.md](phases/02_RUN_FOUNDATION.md). Current status: `OFFLINE_IMPLEMENTED`.

Runtime agent: follow [handoffs/PHASE_02_RUNTIME_QC_HANDOFF.md](handoffs/PHASE_02_RUNTIME_QC_HANDOFF.md). The user has already applied both ZIPs, committed and pushed the Fount and docset repositories. Verify their installed result; do not reapply either ZIP or ask the user to edit the docset. Run and repair this phase's required gates using RUNTIME_QC.md.

Record exact executed evidence, verified code commit and all runtime destinations in the QC report. Complete only after required gates pass. Update state/traceability, refresh/validate, commit and push code/docs, then prepare the next five XMLs from corrected committed source. Stop after that handoff. Web chat must not start a later phase while this one awaits QC.
