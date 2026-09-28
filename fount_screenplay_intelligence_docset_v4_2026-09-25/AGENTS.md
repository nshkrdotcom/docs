# Instructions for agents receiving this docset

For implementation, preparation or QC, follow [AGENT_START_HERE.md](AGENT_START_HERE.md) and [HANDOFF_PROTOCOL.md](HANDOFF_PROTOCOL.md). Read `state.json` to select the phase; do not require the user to name it.

For a task that only authors or revises this docset, edit the documents and validate them without implementing Fount or marking implementation phases complete.

Keep all handoffs explicit about `/home/home/p/g/n/fount` and `/home/home/jb/docs/20260928/fount`, including the canonical docs path and dependency paths listed in the entry point. Update the whole docset after source delivery and runtime QC. Never promote static checks to runtime evidence.

The two ZIPs have separate destinations. Preserve the existing strict overlay manifest/applier contract. No unsolicited implementation beyond the selected phase. No phase advances until its engineering gates pass.

During these six phases, add or edit docset files in place; never delete or rename them. Keep superseded paths with pointers and preserve prior handoff evidence so applying the complete docset ZIP needs no manual deletion work.