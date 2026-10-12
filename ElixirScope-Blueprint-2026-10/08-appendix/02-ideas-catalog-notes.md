# How to use the 95-item Atlas visualization backlog

The adjacent `03-atlas-95-idea-inventory.md` preserves the core concepts from the two BEAM Atlas research documents (`0002_not_beam_specific_distsys_debug.md`: 50 distributed ideas; `0003.md`: 45 BEAM ideas) in concise source-derived descriptions, and adds a **new** proposed relevance tier. It is a research backlog, **not** a list of 95 deliverables.

## Why catalog the alternatives

The archive contains valuable ideas that should not dictate the first version's architecture. Those ideas can be re-evaluated when a user question demands a new representation; e.g., an unresponsive GenServer might justify a Call/Reply Anatomy lens, whereas a duplicate external effect might justify an Effect Ledger with replay lineage. Rendering both to everyone all the time would be UI slop.

## Proposed tier meanings

- **Now:** Directly improves source/diff/impact/evidence or the basic recorded Cinema prototype.
- **Next:** Substantial value after a safe capture importer and source correlations work.
- **Research:** Requires expensive or hard-to-trust probes, invariants, distributed state reconstruction, runtime scheduler data or hypothetical simulation.

These tiers are proposed, not in the original Atlas documents.

## Curated composite views worth naming

**Process Anatomy:** process role, PID incarnations, supervisor, observed lifecycle, selected callback source, state observations and effects in one focus context. This is one *projection*, not multiple independent interactive apps.

**Causal Microscope:** one event's supported predecessors/successors, source path, uncertainty and knowledge horizon. It should never claim to know what an actor believed without captured inputs/state.

**Reviewer Flight Path:** selected changed function → most relevant structural dependencies → effect frontier → test/recorded counterexample → finding. Explain why each navigation was suggested.

**Recovery Counterexample:** one minimal failing test sequence, actor timeline, source branch, state/uncertainty evidence, and a saved question/invariant. Likely distinctive product value.

**Change-to-Behavior Comparison:** changed code vs previous source, with recorded run pairs and effect outcomes, not only side-by-side text.

## Ideas that need explicit caveats

- Vector clocks/knowledge horizon require actual logical timestamp or event causality metadata, not invented from wall timestamps.
- Selective receive/mailbox contents require invasive or purpose-built observation; ordinary Telemetry won't show full queues.
- Scheduler migration/reduction/heap lenses need runtime-specific sampling and should never appear in a static review as observed facts.
- State constellation/partition belief maps require participant-local recorded state, authority models and clock/capture constraints.
- Invariant gauges need an explicit human-authored property or validated test oracle; there is no magic extraction from arbitrary AST.
- "Minimal failure witness" only becomes formal if a shrinking/search procedure with stated bounds produced it; a handpicked pretty event path is a *focused investigation*, not necessarily a minimal witness.

## Promotion gate

Every backlog idea should name its user question, required evidence, capture cost/uncertainty, frontend integration cost, benchmark scenario, acceptance condition and the narrower existing pane it might replace. If it doesn't improve a real investigation, leave it archived.
