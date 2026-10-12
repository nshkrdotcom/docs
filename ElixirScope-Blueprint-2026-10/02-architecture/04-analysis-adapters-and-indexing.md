# Static analysis adapters, source indexing, revisions and impact queries

## One normalized interface; multiple evidence providers

Implement a thin analysis adapter behavior/protocol only for boundaries we expect to swap:

```elixir
@callback index_source(source_manifest, options) :: {:ok, index, diagnostics} | {:error, term}
@callback definitions(index, query) :: {:ok, [symbol_ref], diagnostics}
@callback changed_symbols(base_index, head_index, options) :: {:ok, changes, diagnostics}
@callback neighborhood(index, source_ref, filter) :: {:ok, relations, diagnostics}
@callback effect_paths(index, source_ref, options) :: {:ok, paths, diagnostics}
```

**Do not** make one behavior per AST manipulation or create a reusable plugin framework for hypothetical analyzers. An ordinary `ReachAdapter`, `ExASTAdapter` and Git source loader are enough initially.

## Revision/source manifest

A `SourceManifest` includes repo ID, revision ID, Git metadata, per-file content digest, language, extraction mode, generated-file policy and tool version. Indexing must be deterministic given the manifest and analyzer version. For a dirty tree, hash content snapshot and preserve it separately from HEAD. Don't follow symlinks out of the allowed repository root.

## Basic pipeline

```text
Git ref / working tree snapshot
  -> enumerate allowlisted source files (.ex/.exs first)
  -> ExAST symbols + AST-aware diff
  -> Reach dependency/flow/effect project analysis
  -> normalize SourceRef + typed relations
  -> derive changed symbol review contexts
  -> optional persisted hot index and/or content-addressed cache
```

ExAST's README exposes structural matching and symbols. Reach Project's API exposes `from_sources`, `from_glob` and `from_mix_project`. Do not prematurely assume both libraries produce identical source-range semantics. Build a source-range normalization fixture matrix and record if an edge has no precise span.

## Indexing strategy

**V0:** repo roots manually selected. Normalize current tree. Analyze changed files plus a necessary project-wide Reach model. Cache in memory/artifact and persist only metadata/selected relations. Use batch requests; no file watcher initially if Git selection is explicit.

**V1:** index named revisions and compute two-sided changed-symbol mappings. Resolve dirty tree snapshots, selected merge base, deleted/renamed symbols and source spans. Add file watcher only when live edits materially improve UX.

**Later:** incremental dependency invalidation and multi-repo/package-aware graph indexing.

## Changed-symbol classification

`added`, `deleted`, `body_modified`, `signature_modified`, `moved_or_renamed_candidate`, `unchanged_but_impacted`, `generated_or_unresolved`. A moved function's stable name is insufficient to prove identity; attach `match_reason` such as structural equality, signature + nearby calls, or explicit user mapping. Show ambiguous candidates rather than quietly choosing.

For Elixir, separately account for multi-clause `def`/`defp`, guards, macros, `use`, `import`, protocols, behaviors and `@impl`. Elixir-specific tests should verify source spans before adding other BEAM languages.

## Risk-weighted query, not risk scores masquerading as truth

Return bounded groups:

- Direct callers / callees and transitive impact within a configurable depth.
- Possible source-to-effect paths (DB, file, network, send, external boundary), with source and explanation.
- State ownership clues: callback, process/state references, supervisor edges where statically available.
- Tests likely related (names/references/coverage if available); **never label "covered" from a mere reference search**.
- Architecture boundary rules explicitly supplied from Boundary or configuration.
- Diagnostics: dynamic apply/anonymous functions/protocol dispatch/macro-generated ambiguity, unresolved symbols, unchecked external effects.

Do not automatically assign one risk score combining unrelated signals. If showing review priority, expose the component facts, their limitations and user-controlled weighting.

## Query budget

Requests include `limit`, `depth`, `relationKinds`, `targetRevision`, `excludeDependencies?`, and a cursor. Returned `truncated` and `nextCursor` flags indicate partial results. Limit result cardinality at the engine boundary, not only the frontend renderer.

## Verification corpus

Test on: one Phoenix/Ash app, one OTP process-heavy app, one mixed Erlang/Gleam module fixture; include `case`, `with`, guarded clauses, pattern binding, aliases/import, dynamic module calls, `GenServer` callbacks, macros and Phoenix/Ecto generated code. Compare resulting source references with verified human expectations.

## Fall back gracefully

If Reach cannot derive dataflow due to a macro, still serve syntax symbols/diff and label relationships unavailable. If ExAST cannot reliably correlate a revision, show text diff and ask user to choose. An investigation never becomes unusable because one advanced analyzer declines an operation.
