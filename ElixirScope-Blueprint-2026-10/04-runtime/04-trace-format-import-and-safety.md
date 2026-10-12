# Recording format, import protocol, privacy and offline investigation

## Design decision

Create a **versioned, immutable and safely importable recording envelope** before an in-process recorder. The user must be able to analyze a capture without a live system and to save a small counterexample that can be reopened later. The exact chunk compression format can evolve; source/version IDs, coverage, causal evidence and schemas cannot be omitted.

## Recording bundle, conceptual

```text
recovery-failure.scope-capture/
  manifest.json          # version, session, nodes, build/source versions, capture policy
  events/
    node-a-0001.ndjson   # ordered local events, chunks, checksums
    node-b-0001.ndjson
    node-c-0001.ndjson
  artifacts/
    redacted-value-001.json
  source-manifest.json   # source file digests, source revision IDs, no code required
  coverage.json          # counts, dropped samples, gaps, missing nodes
  investigation.json    # optional saved focus, pins, comparisons, findings
```

NDJSON is excellent for the first fixture and reviewable tests; a binary columnar/chunked representation may later be justified for throughput and random seek. The **wire semantics** remain versioned, independent of physical encoding.

## Event envelope minimal fields

`event_id` globally unique within recording (prefer opaque string), `capture_session_id`, `node_instance_id`, `process_instance_id` optional, `local_sequence` (source/actor scoped), `clock_domain`, optional `monotonic_ns` and `wall_time_ns`, `event_type`, optional `source_ref`, `correlation`, optional `payload_ref`, `provenance`, `coverage`/redaction and `capture_policy_ref`.

Producer should not assert message match merely by reusing a correlation string on arbitrary events. An explicit relationship record lists pairs of event IDs and match basis. Missing event IDs are validation errors for claimed observed relation; unresolved relationships may be retained as candidates with status.

## Safe import sequence

1. Read bounded manifest; reject unsupported major schema, oversized files or unsafe file paths.
2. Validate every chunk checksum/content length and syntactic JSON schema.
3. Reject path traversal in attachment names; avoid extracting untrusted ZIP paths without canonicalization.
4. Enforce event count, nesting depth, payload byte/decompression size caps; apply rate limits where needed.
5. Verify unique event IDs and monotonic local sequences per declared producer domain, flag conflicts.
6. Build indexes and causal links using only explicit correlation evidence; orphan event refs become diagnostics.
7. Resolve source digest/revision matches to indexed repository or display `source unavailable`; never silently load arbitrary disk source based on captured path.
8. Emit comprehensive `ImportReport { accepted, rejected, warnings, gaps, missingSources }`.
9. Persist manifest/index and retain original raw events immutable if policy allows.
10. Provide export of redacted investigation subset, not default full trace with sensitive values.

## Privacy and data boundaries

- Metadata-only by default, opt-in payload capture for selected test/dev targets.
- Redact before serialization at producer when possible; redact again before serving browser in defense in depth.
- Drop or hash sensitive keys/large binaries; represent non-JSON terms safely and without code execution.
- Trace exports may leak user data, passwords, tokens and proprietary code. Display capture policy and data sharing warning.
- Do not invent safe semantics from `inspect(term)` (representation can be large/ambiguous); use structured capture adapters.
- Production capture requires authorization and authentication design; no remote node cookie or auth secret in browser.
- Source tree paths, network addresses and process registration names can themselves be sensitive; make export filters explicit.

## Version migration

Provide trace-reader migration functions per major/minor supported format. Older events must remain distinguishable from fields introduced later; defaulting unknown `capture_level` to "complete" would be a severe semantic bug. Add fixtures for each supported historical format.

## Example JSON

See `examples/fixtures/otp-recovery-capture.json` and `examples/contracts/trace-event.schema.json`, both clearly synthetic design fixtures rather than evidence of actual BEAM runs.
