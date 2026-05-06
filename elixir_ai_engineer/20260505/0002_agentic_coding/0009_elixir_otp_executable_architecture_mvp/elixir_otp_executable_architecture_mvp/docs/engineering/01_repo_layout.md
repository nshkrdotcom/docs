# Repository Layout

## Proposed umbrella structure

```text
archex/
  mix.exs
  apps/
    archex_core/
      lib/archex/core/
        semantic_id.ex
        semantic_graph.ex
        semantic_type.ex
        registry.ex
        version.ex

    archex_capabilities/
      lib/archex/capabilities/
        bundle.ex
        access_edge.ex
        checker.ex

    archex_oracle/
      lib/archex/oracle/
        server.ex
        query.ex
        valid_morphism_space.ex
        template_catalog.ex

    archex_projection/
      lib/archex/projection/
        engine.ex
        ex_unit_generator.ex
        stream_data_generator.ex
        credo_generator.ex
        telemetry_generator.ex
        benchee_generator.ex

    archex_kernel/
      lib/archex/kernel/
        consistency_kernel.ex
        proof_bundle.ex
        verdict.ex
        check_result.ex

    archex_patch_lens/
      lib/archex/patch_lens/
        diff_parser.ex
        impact_analyzer.ex
        symbol_mapper.ex

    archex_mutation/
      lib/archex/mutation/
        mutation.ex
        runner.ex
        report.ex
        builtins/

    archex_observer/
      lib/archex/observer/
        runtime_observer.ex
        telemetry_handler.ex
        anomaly.ex
        refinement_candidate.ex

    archex_example/
      lib/example/
        session_pool.ex
        worker.ex
        worker_supervisor.ex
      test/
      bench/

  priv/
    semantic_types/
    generated/
    mutation_reports/
    benchmark_results/
```

## Single-app MVP alternative

For speed, start with one Mix project:

```text
archex_mvp/
  lib/archex/
    core/
    capabilities/
    oracle/
    projection/
    kernel/
    patch_lens/
    mutation/
    observer/
    example/
  priv/semantic_types/
  test/generated/
  bench/
```

Refactor to umbrella after the MVP loop works.

## Generated file policy

Generated artifacts should live under:

```text
test/generated/
lib/generated/credo/
bench/generated/
priv/archex/generated/
```

Each generated file contains:

```text
semantic_type_id
semantic_type_version
semantic_type_hash
generator_version
```

## Mix aliases

```elixir
aliases: [
  "archex.check": [
    "archex.types.validate",
    "archex.projections.verify",
    "test",
    "credo --strict",
    "archex.mutate --impacted",
    "archex.bench --impacted"
  ]
]
```
