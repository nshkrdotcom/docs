# ElixirScope interface lab V2

Open `index.html` directly in your browser. The checked-in `app.js` is a standalone browser bundle; viewing it requires no install or build.

For a local preview, run from this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://localhost:8765.

## Try the investigation

Drag the full-width timeline below the transport controls. The causal score, source location, state observations, mailbox and external-effect evidence follow the selected event. This is a fabricated offline recording of a distributed settlement worker crashing after an outbound write, restarting, and attempting the write again; it does not execute Elixir or capture a running BEAM.

- Space: play/pause. J/K or arrows: previous/next recorded event.
- X: crash. D: duplicate attempt. E: initial external write. Home/End: recording boundaries.
- Click the horizontally scrollable atlas to explore all 24 files; `/` focuses its search. `[` / `]` move between files.
- P: pin the current source beside the live follower. This pins the fixture source, not a separate historical revision.
- FREE: keep the selected file while changing events. ROLE: return to following recorded source.
- 1–6: cockpit, cinema, review, dual-run comparison, supervision, findings.
- Ctrl/Cmd+K: navigation palette. `?`: shortcut reference.
- Findings contains a JSON export of the investigation.

The cockpit, cinema and review tabs currently share the same source/trace workspace. Process and causal follow selectors are prototype UI; the recording cursor follows recorded events across processes. Comparison, supervision and findings have dedicated fixture views. Observed versus unknown outcomes are explicitly labeled; duplicate attempts do not establish duplicate committed effects.

## Rebuild and verify

Only development requires Node and dependencies:

```sh
npm install
npm run build
npx playwright install chromium
npm test
```

The smoke check opens `index.html` directly in headless Chromium and exercises every event and file, text search, keyboard shortcuts, pinned source, free following, real pointer dragging, playback and the six views. It writes `preview.png` and checks for browser errors.

The design follows the product thesis in `../ElixirScope-Blueprint-2026-10`: one investigation focus projected into source, causality, state and evidence. Source fixtures live in `src/codebase.ts`, and the recording in `src/trace_data.ts`.
