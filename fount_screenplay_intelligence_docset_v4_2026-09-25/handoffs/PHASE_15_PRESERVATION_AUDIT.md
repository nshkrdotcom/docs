# Phase 15 Preservation Audit

## Preserved contracts

- Canon still changes only through the existing candidate Review/Acceptance path. Read packets, clean shares, human reactions and usefulness records never accept or mutate a screenplay.
- `mix fount.read` is extended rather than replaced: existing `table-read.json`, `table-read.html`, and optional audio remain; the packet and clean-share files are additive.
- Human reading remains provider-free. Speech remains optional and a synthesized voice cannot be recorded as a human observer or treated as measured audience response.
- Clean share is derived from the loaded accepted canonical `Fount.Screenplay`; it does not read Workshop candidates, analysis packets or provider metadata.
- Core owns projection and export semantics. Phase 15 reuses `Selection.selected_ids/2`, `Screenplay.Editor.spec_ir/1`, `Screenplay.export_fountain/2` and `Screenplay.to_fdx/1`; it does not invent a second Fountain/FDX serializer.
- Clean sharing is conservative about selection: whole screenplay or whole-scene targets only. Unsupported fine-grained clean-share requests fail instead of silently broadening the writer's selection.
- Private notes, boneyards and omitted scenes are excluded before reader export. Sections/synopses removed by spec projection are counted in the privacy manifest; exporter losses are surfaced under `unsupported_or_lossy`.
- Existing stable title metadata, Unicode and dual-dialogue support remain owned by Core exporters and are exercised by the Phase-15 fixture.
- Existing stale-base refusal, idempotent accepted decisions, explicit rejection, Store persistence and resume contracts are exercised rather than bypassed.
- W11 resource/budget/cancellation behavior stays in existing Session/Generation services. Phase 15 adds no critique loop or autonomous retry mechanism.
- Usefulness evidence is separate from screenplay text and engineering evidence. Keeping the original can be neutral/successful; acceptance rate is not equated with quality.
- No aggregate screenplay score, workflow winner, marketability verdict, expert endorsement, representative-sample claim or simulated audience metric is added.
- Package boundaries remain unchanged: Workshop depends on Inference 0.5.0 and ASM 0.17.1; no direct SystemOneSDK dependency is introduced.
- Phase 16 final integration/acceptance is not implemented.

## Runtime proof still required

Codex must format/compile the actual applied checkout, run the new writer-workflow ExUnit tests, run the PostgreSQL integration regression against a fresh Store/Repo, inspect generated packet/share artifacts, and execute the established full CI/architecture/quality/docs/package/preservation gates. Repairs must preserve the privacy and explicit-writer-authority rules above. The optional D046 writer comparison remains NOT_RUN unless separately commissioned.
