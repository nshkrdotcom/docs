# ElixirScope — Semantic Code Review + Execution Cinema

**A practical, extensible product and engineering design dossier**  
**Edition:** 2026-10-11 · **Status:** proposed blueprint, not a shipped implementation  
**Audience:** one or a small team of Elixir/OTP engineers building a genuinely exceptional code-comprehension workbench.

> **Thesis:** An investigation-first, BEAM-native cockpit where source, static dependencies, process/actor identity, runtime events, state observations, and evidence are navigable representations of the same focused question. First prove the semantic code-review interaction; then layer in bounded Execution Cinema and multi-run comparison.

## Start here

1. [One-page executive decisions](00-foundation/01-executive-decisions.md)
2. [Product thesis and scope](00-foundation/02-product-thesis.md)
3. [Library/ecosystem research](01-research/01-library-landscape.md)
4. [What we mined from the three source snapshots](01-research/02-heritage-mining.md)
5. [Poncho architecture](02-architecture/01-poncho-architecture.md)
6. [Shared identities, evidence and semantics](02-architecture/02-semantic-evidence-model.md)
7. [Frontend/workspace design](03-product/01-workspace-and-interaction-system.md)
8. **Three complete interaction specs:** [Semantic code review](03-product/02-semantic-review-spec.md), [Process-following Cinema](03-product/03-cinema-spec.md), [Multi-run comparison](03-product/04-multi-run-comparison-spec.md)
9. [Roadmap with vertical slices](06-implementation/01-delivery-roadmap.md)
10. [Source & research references](08-appendix/01-sources-and-verification.md) and [full source-file inventory](08-appendix/05-source-file-inventory.csv)

## Complete navigation

| Folder | Contents |
|---|---|
| `00-foundation` | Executive decisions, product thesis, bounded MVP, working vocabulary |
| `01-research` | Elixir/BEAM ecosystem survey, TypeScript/UI ecosystem, old repository mining, alternatives |
| `02-architecture` | Poncho structure, analysis and semantics, Ash domain/persistence, API contracts, source identity, tracing boundaries |
| `03-product` | Workspace architecture, detailed interaction specs, focus/state machines, view catalogue, keyboard UX |
| `04-runtime` | Capture stages, state reconstruction, distributed causal model, privacy, trace format |
| `05-delivery` | Mix/Blitz/mise setup, local dev, deploy/origins/auth boundaries, CI, benchmarks |
| `06-implementation` | Sequencing, acceptance criteria, fixtures, test plan, risk register, decisive experiments |
| `07-decisions` | Architecture decision records and deferred decisions |
| `08-appendix` | Source registry, complete 1,131-file input inventory, glossary, explicit non-goals, future research and exploration backlog |
| `examples` | Illustrative normalized event fixture, JSON Schema sketches, Mix/Phoenix/config snippets. These are **design examples**, not claimed executable applications. |
| `diagrams` | Mermaid diagrams, renderer-independent |

## Source and assertion discipline

This is a *synthesis*, not a claim that the old repositories' documented features work. The input corpus was three Repomix files supplied in this conversation:

- `repomix-output(20261011-234441).xml`: 10 BEAM Atlas, interface and code-review research documents.
- `repomix-output(20261011-234709).xml`: 610 included files from an older ElixirScope monolith; extensive implementation, docs, test app experiments and contradictory status claims.
- `repomix-output(20261011-235118).xml`: 511 included files from the later ElixirScope rework, with 475 under `docs/`; application source contains substantial graph work and predominantly skeleton upper-layer facades.

**Three labels appear in research-oriented docs:** **Observed source** = present in provided files; **Verified externally** = checked against linked current documentation/repository pages on 2026-10-11; **Proposed** = recommendation, target or conceptual design. The docs consistently mark uncertainty where claims cannot be verified without running code.

Version strings are *research-time examples*, not guaranteed compatible locked dependencies. There was no Elixir/Erlang executable in the authoring container: Mix examples and the original repositories were not compiled or benchmarked. No performance result in this dossier represents a measured ElixirScope benchmark.

## Architectural invariants

- **Poncho, not umbrella:** independent `mix.exs` at root (tooling only), in `apps/elixir_scope`, and in `apps/elixir_scope_server`; independent `web/` Node/TS package.
- **Analysis stays independent:** `elixir_scope` has no Ash, Phoenix, or frontend dependency.
- **Ash owns durable application semantics**, not all AST nodes or millions of raw trace events.
- **Navigation is focus-driven**: symbol + source revision + process incarnation + capture event + selection policy.
- **Never conflate evidence classes:** static possible / observed / reconstructed / inferred / unknown.
- **Causal edges are not timestamp guesses;** node clocks, capture gaps and source-version mismatches are explicit.
- **Index globally, render locally.** Don't mount a repository's entire graph or a trace's entire event set in the browser.
- **Capture is optional and bounded.** Every review workflow must work with zero runtime instrumentation.
- **No speculative universal ontology, custom CPG, NIF, graph DB, LLM agent fleet or recording infrastructure before the interaction earns it.**

## Product in one paragraph

A reviewer opens a PR and selects a changed `handle_call/3`; pinned and following source panes reveal exact callers, state ownership and effects, with structural changes and review evidence. A recorded test can be opened as Cinema: the user follows a command through GenServers, messages and node boundaries, scrubs from failed attempt to restart, sees each event's corresponding source revision and last *observed* state, and can pin comparative executions. In a two-run comparison, source, actor roles and causal milestones align where supported; divergences and unknowns become first-class objects that can be saved as a review finding.

## What to build first

A meaningful TS cockpit wired to real Git/Reach/ExAST data for one repository: **change → symbol → impact → evidence → pinned source**. In parallel, render a *known, synthetic but realistic* event fixture in the same focus model to evaluate the Cinema interaction without building a capture engine. Expand instrumentation only after that dual experience works.

## The requested next design artifacts

> The next design artifact I'd find most valuable is a detailed interaction specification for just three experiences: semantic code review, process-following Cinema, and multi-run comparison. If those three feel excellent, we'll have established a foundation worth expanding without prematurely rebuilding the enormous machinery in the archives.

Those interaction specifications are included in full in `03-product/02` through `03-product/04`, with goals, workflows, view contracts, commands, edge cases, UX budgets, acceptance criteria and test scenarios. This dossier also includes the supporting architecture, source contracts, local development setup, deployment seams, capture semantics and experiments.
