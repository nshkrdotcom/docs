# Product thesis, UX philosophy and boundaries

## Category and audience

A local-first, developer-centric code investigation workbench initially optimized for Elixir/OTP. Initial audience: experienced Elixir engineers reviewing changes that cross modules, GenServers, persistence, supervision and failure boundaries. Adjacent audiences: maintainers of Erlang/Gleam systems, architectural reviewers, incident responders, AI coding agents consuming evidence-backed interfaces.

The product distinguishes **implementation possibility** (static analysis), **recorded execution** (capture), **stated intent** (human-authored requirements and architecture constraints), and **inferred purpose** (reviewable hypotheses). Never present inferred business intent as recovered fact. Source: Atlas `0006a.md` and `0006.md` explicitly corrected earlier conflation.

## The navigation primitive

A selection is a question with a scope, not merely a selected DOM item. E.g. "what caused this repeat write after the restart?" corresponds to a symbol, source revision, logical actor, one or more process incarnations and a bounded causal sequence. Panels are *projections* of that focus, not separate applications requiring manual synchronization.

### Semantic zoom is not a single hierarchy

- **Architectural projection:** role → boundary → module → function → source.
- **Causal projection:** failure → related events → process messages → callbacks → source.
- **Dependency projection:** entrypoint → data/control path → effect → owner/test.
- **Temporal projection:** session → time range → event → invocation → state observation.
- **Review projection:** diff hunk → changed symbol → impacted neighborhood → evidence/claim.

Each projection preserves the focus identity, pins, breadcrumbs and provenance. Source: Atlas `0005` evolved into the more defensible investigation-centered `0006`/`0007`.

## Product wedge

A full execution observability platform would require years of capture, privacy, storage and correctness work before users could see its value. A conventional code review client is crowded and offers little differentiation. The intersection is distinctive: **changed function → possible effects → test executions → evidence → exact source**, with Cinema as a future high-leverage lens.

## What "Jarvis" actually means

Intelligence comes from context selection and low friction, not 3D graphics. The interface should anticipate the next useful evidence *without commandeering the user's focus*. It should preserve pinned context, offer keyboard-driven commands and reversible navigation, and show why a suggested relationship is relevant. Initial AI is entirely optional. Never animate or autoscroll for spectacle.

## Three flagship experiences

1. **Semantic review:** Navigate the affected behavior of a diff and create source/evidence-linked findings.
2. **Process-following Cinema:** A selected process or causal chain drives source, timeline, state and effect projections.
3. **Multi-run comparison:** Align executions on meaningful semantic anchors, show divergent events/values/coverage and distinguish missing data.

Full interaction specs live in `03-product/`.

## Product boundaries by phase

| Concern | v0/v1 | Expansion |
|---|---|---|
| Source language | Elixir primary | Erlang/Gleam after adapter tests |
| Codebase | One local repo at a time | Multiple repositories and teams |
| Diff | Local Git diff / two refs | PR provider integration |
| Source/graph | Bounded local navigation | Scaled search and persistent index |
| Runtime | Fixture and imported recordings | Selective tracing, state instrumentation |
| State | Captured values; no assumed omniscience | Checkpoint + validated complete transition replay |
| Distribution | Data model permits node identities | True multi-node capture and partial clock alignment |
| AI | Optional evidence summaries | Assisted hypothesis/test generation with provenance |
| Collaboration | Export/save investigation | Shared sessions, authz, SaaS deployment |

## Non-goals with teeth

No replacement IDE; no arbitrary code execution from the browser; no autonomous mutation of production nodes; no universal code property graph; no graph DB; no embedded LLM as the source of semantics; no reconstruction of unrecorded state; no claim of globally ordered events by wall-clock; no 3D required; no hierarchical microservices for a local developer tool.

## Success definition

The interface allows a user unfamiliar with the codebase to answer a bounded question faster and with fewer unsupported conclusions than using editor navigation plus text search and logs. If a graph or AI explanation adds visual density without strengthening that answer, it should be removed.
