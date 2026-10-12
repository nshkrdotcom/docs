# ElixirScope — Interface Lab

**Five high-density interactive interface mockups** for an investigation-first semantic code-review workbench, based on the supplied ElixirScope Repomix blueprint.

This is a **visual / interaction prototype**, not a real source indexer, a production code reviewer, a tracing agent, or a live connection to a BEAM node. It uses the blueprint's own synthetic OTP recovery fixtures, paired with explicitly *illustrative* Elixir source excerpts.

## Open it

**The quickest path:** open `index.html` in a regular modern browser. All JavaScript and CSS are bundled locally; **no package installation, server, account, or network access is required**. Navigate with the vertical icon rail.

If your browser's local-file security policies block local scripts, start a local static server:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

Static read-only alternatives are in `previews/01-review.html` through `previews/05-findings.html`, each directly viewable without JavaScript. They are captured HTML compositions, not PNG screenshots.

## Five experiences

| View | What to explore |
|---|---|
| **01 / Semantic review** | Change navigator; syntax-highlighted unified/split source diff; persistent pinned baseline; possible source→effect path; evidence provenance; bottom investigation trail; test leads |
| **02 / Execution cinema** | Synthetic three-node OTP recording; actor/process-incarnation lanes; crash/restart; supported causal links; interactive event selection; event/state/causality inspector; role/process/causal/free stepping |
| **03 / Run comparison** | Side-by-side passing/failing recordings; semantic anchors; selected milestone inspector; observed second attempt versus unknown completion; correlated illustrative source |
| **04 / System topology** | Bounded source + runtime neighborhood; evidence-typed edges; static/observed filters; interactive node inspector; explicit unjoined journal observation |
| **05 / Findings ledger** | Evidence-backed review concerns; open/resolve transitions; finding creation with local persistence; source navigation; JSON export |

## Interactions to try

1. In **Review**, click `recover/2` in the left rail and switch **Unified → Split**. Click **Pin baseline**, then click a different changed symbol: the pinned reference stays fixed.
2. Click **Cinema**, then click the crash marker (red X) or step using **J/K** in `Role` follow mode. Notice the distinct worker incarnations and how source follows recorded event references.
3. Switch to `Causal` follow mode at the crash event and step forward to the supported supervisor-linked replacement. Other events do **not** automatically become causal just because they are nearby.
4. Open **Compare**, click different milestone rows, and toggle uncertainty detail. Inspect what was actually observed in the failing recording.
5. Open **Topology**, toggle **Observed** or **Static possible** layers and select different graph cards.
6. Open **Findings**, resolve/reopen a finding, create a new one, and export the current investigation as JSON.

## Keyboard navigation

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ + K` | Command palette and symbol navigation |
| `R`, `C`, `V`, `G`, `E` | Review, Cinema, Compare, Graph/Topology, Evidence/Findings |
| `J` / `K` | Next/previous eligible event in Cinema |
| `P` | Pin or unpin source reference |
| `Alt + ← / →` | Previous/next semantic source selection |
| `/` | Search changed symbols |
| `?` | Keyboard reference |
| `Esc` | Close modal or command palette |

## Technology choice

**Dependency-free TypeScript + modern CSS + SVG.** The editable application lives in `src/`, while `app.js` is precompiled and included for instant viewing. This is intentional: a prototype should be portable, launch instantly and remain interactive offline, without npm installation, a bundler, backend services, or 100 MB of dependencies. The UI architecture separates typed fixture models, authored source-display content, and view/application logic.

The actual product blueprint recommends **React + Dockview + CodeMirror/diff view + bounded graphs + a Canvas/Perfetto timeline experiment** for production. These are complementary: the prototype validates composition, information hierarchy, and focus behavior without precommitting to heavyweight production renderers. The production app should reuse proven rendering primitives and adapt the view logic to a typed focus store.

To edit the TypeScript, install `typescript` (or use an existing `tsc` installation) and run:

```sh
npm install
npm run build
```

The compiled file `app.js` is refreshed in place. No run-time dependencies are installed or imported. The source is ECMAScript and TypeScript without JSX.

## Data honesty

The bundled JSON files in `data/` are copied from the blueprint's `examples/fixtures/`:

- `otp-recovery-trace-failing.json` — 12 **synthetic** events, 2 asserted causal relations.
- `otp-recovery-trace-passing.json` — 9 **synthetic** events, 1 asserted causal relation.
- `sample-review-context.json` — sample possible static effect path and candidate test lead.
- `two-run-alignment.json` — comparison anchors and documented difference.

Visible Elixir snippets in `src/content.ts` are **invented for the UI prototype**, not source code extracted from a real repository. No actual tests, benchmarks, repository indexing, external write outcomes, or trace overhead measurements have been performed. The UI is deliberately designed not to infer global event ordering from unaligned node-local clocks or to confuse observed effect attempts with committed external side effects.

## File layout

```text
index.html                    ← Open this for the interactive prototype
app.js                        ← Browser-ready compiled JavaScript
assets/styles.css             ← Entire visual system and responsive layouts
src/types.ts                  ← Typed domain/view objects
src/fixtures.ts               ← Exact synthetic fixtures bundled into JS
src/content.ts                ← Illustrated source, graph, sample claims
src/app.ts                    ← All views, focus state, commands, renderers
previews/01-review.html       ← Static HTML snapshot of review
previews/02-cinema.html       ← Static HTML snapshot of Cinema
previews/03-compare.html      ← Static HTML snapshot of comparison
previews/04-topology.html     ← Static HTML snapshot of topology
previews/05-findings.html     ← Static HTML snapshot of findings
data/*.json                   ← Inspectable original synthetic fixture data
tests/smoke.cjs               ← No-dependency render/transition smoke test
tsconfig.json / package.json  ← Optional TypeScript rebuild
DESIGN_NOTES.md               ← Visual system & production handoff
```

### Tests

```sh
node tests/smoke.cjs
```

Smoke tests exercise all five view render paths and several state transitions. They do not replace visual regression, accessibility, performance or full browser E2E testing.
