# Anti-patterns: what the new ElixirScope explicitly refuses

## The legacy failure modes

**Architecture-as-progress.** Nine-layer diagrams and hundreds of module names provide no proof that one real review/debug interaction works. Countermeasure: fixture-backed end-to-end acceptance for each phase.

**Status-report inflation.** Old files claim 100% readiness in some places and simultaneously show missing APIs and failing tests elsewhere. Countermeasure: only verified CI output and versioned benchmark fixtures can establish functionality.

**Generic Foundation dependency.** Circuit breakers, pools, high-performance buffer and caching layers may be useful later but consume focus now. Countermeasure: use OTP primitives and narrow libraries, add a service only when a real resource/lifecycle demands it.

**A new CPG for every query.** Reach/ExAST and `mix xref` already solve many source structure questions. Countermeasure: adapter + bounded query and only implement proven gaps.

**Universal semantic ontology.** No automatic representation captures authoritative product intent from arbitrary AST. Countermeasure: declared intent, inferred hypotheses and verified properties separate.

**Graph hairball.** Rendering every symbol/actor/event destroys navigation. Countermeasure: index globally, render bounded neighborhoods and causal slices.

**Fake time travel.** A reducer over sparse events isn't complete historical state. Countermeasure: state observational semantics and validated reconstruction only when capture is sufficient.

**Timestamp causality.** Cross-node clock order may be unreliable and unrelated events may be concurrent. Countermeasure: explicit causal edges, partial order, uncertainty windows.

**Auto-follow seizure.** Code panes jumping constantly is not intelligence. Countermeasure: follow modes, pins, invocation lock, back/forward.

**Overcoupled frontend.** LiveView isn't a universal headless endpoint for a TS canvas. Countermeasure: typed JSON/Channels, React state for animation and editor highlights.

**Premature SaaS provisioning.** Before local product proof, automatic domain/org routing is waste. Countermeasure: configurable API base, same-origin default, auth boundary only.

**Unbounded capture.** Tracing every process/message/value can change timing and leak secrets. Countermeasure: explicit targets, sampling, quotas, redaction, gap accounting, dev/test-first.

**LLM explanation as evidence.** Plausible prose can make incorrect root causes sound settled. Countermeasure: each claim opens evidence and falsifiers; AI is optional and downstream.

## Common counterarguments

**"But graph DBs are built for this."** True for some graph workloads; not proof that a local review tool requires another operational system. Source relations can be queried from normalized facts and bounded in-memory graphs initially.

**"But the user wants Cinema, shouldn't we trace now?"** No. The first unknown is the UX: can a developer effectively follow a causal event to source while preserving pin/context? A synthetic but realistic fixture answers that before tracer risk.

**"But implementing source identity and evidence contracts first sounds like overengineering."** These are small fields that prevent wrong-source jumps and false causal claims; unlike a generic event bus, they are foundational correctness requirements.

**"But Ash can model all trace events."** It can store records, but high-volume event ingestion/indexing has different query patterns and costs from user-centric CRUD. Use Ash for durable app facts, a trace store for raw chunks.

**"Could every BEAM language be first-class immediately?"** Reach may parse more, but language-specific symbol diff, syntax ranges, macro treatment and source UX are not automatically equivalent. A language capability interface is cheap; broad polished support is not.

**"Can we claim time-travel debugging?"** Better term initially: recorded execution navigation. Reserve full deterministic replay and reconstruction claims for explicitly instrumented and validated regions.
