# Example assets and status

All assets under `examples/` are **illustrative design artifacts**. They are not a working Phoenix application, and fixtures are synthetic rather than real recorded BEAM execution. They demonstrate versioned identifiers, evidence distinctions and APIs and can be used to build early UI prototypes.

## JSON contract sketches

- `contracts/source-ref.schema.json`: revision-qualified source anchor.
- `contracts/trace-event.schema.json`: normalized event with incarnation, clocks, capture status.
- `contracts/focus.schema.json`: shared UI/navigation focus.

## Synthetic fixtures

- `fixtures/otp-recovery-trace-passing.json`: command processing with one observed effect attempt and an acknowledgment from a fixture gateway.
- `fixtures/otp-recovery-trace-failing.json`: crash/restart and second effect attempt, with initial outcome unknown.
- `fixtures/two-run-alignment.json`: anchor-based comparison and honest divergence statement.
- `fixtures/sample-review-context.json`: a static-effect-path example with explicit coverage limitations.

**Important:** all monotonic timestamps in these fixtures are node-local, intentionally in different clock domains. Sorting them into a single cross-node total order would be incorrect. The fixtures are authored examples, not traces captured by OTP `trace` or `seq_trace`.

## Mix reference fragments

The root/engine/server `mix.exs` patterns are in `05-delivery/01-poncho-blitz-mise.md`. Use current Phoenix/Ash generators for a compiling server; no fabricated runnable scaffold is claimed. Toolchain validation requires an environment with Erlang/Elixir/Mix installed.

## Integrity verification

The ZIP includes `manifest.sha256` generated at packaging time. JSON fixtures and schemas were syntactically checked; schema validation when jsonschema package is available is also included in build report. This does not validate semantic truth of synthetic capture events.
