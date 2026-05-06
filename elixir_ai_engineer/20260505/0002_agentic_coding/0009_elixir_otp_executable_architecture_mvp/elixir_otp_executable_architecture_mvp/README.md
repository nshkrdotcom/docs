# Executable Architecture for Elixir/OTP — MVP Docset

This docset specifies an MVP for an **Executable Architecture** platform on Elixir/OTP.

The premise:

> Architecture should compile into semantic types, capability bundles, protocol constraints, generated tests, generated static checks, generated benchmarks, mutation suites, and runtime observation contracts.

The system is designed for autonomous AI-assisted development, but it does not put the LLM in the correctness path. The LLM proposes semantic types, code, tests, and patches. The deterministic substrate decides whether those artifacts satisfy the declared architecture.

## Core thesis

A software component is not fully described by what it computes. It is described by:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

Performance, resource usage, capability boundaries, and protocol ordering are semantic dimensions of the program. They are not after-the-fact measurements.

## MVP name

Working name: **ArchEx** — Executable Architecture for Elixir/OTP.

Product category: **Executable Architecture**.

Technical category: **cost-refined semantic types with generated enforcement projections**.

## Doc map

| Path | Purpose |
|---|---|
| `docs/theory/00_conversational_arc.md` | Full conceptual arc from AI code failure to executable architecture |
| `docs/theory/01_core_model.md` | Formal semantic model and denotation |
| `docs/theory/02_universal_ontology.md` | Universal ontology independent of language/platform |
| `docs/theory/03_cost_refined_types.md` | Performance as a first-class type |
| `docs/architecture/00_system_overview.md` | Overall architecture and component map |
| `docs/architecture/01_elixir_otp_mapping.md` | Mapping the ontology to OTP concepts |
| `docs/architecture/02_semantic_type_system.md` | Semantic type DSL and type checking model |
| `docs/architecture/03_capability_bundles.md` | Agent capability typing and access graph |
| `docs/architecture/04_type_oracle.md` | Queryable type system / valid morphism oracle |
| `docs/architecture/05_consistency_kernel.md` | Acceptance kernel and proof bundle |
| `docs/architecture/06_projection_engine.md` | Generating tests, checks, benchmarks, telemetry |
| `docs/architecture/07_mutation_harness.md` | Mutation testing for semantic types and projections |
| `docs/architecture/08_runtime_observer.md` | Telemetry-driven cost-type calibration loop |
| `docs/architecture/09_patch_lens.md` | Patch impact analysis and model delta extraction |
| `docs/architecture/10_supervision_topology.md` | OTP supervision tree for the MVP implementation |
| `docs/engineering/00_mvp_scope.md` | MVP boundaries and acceptance criteria |
| `docs/engineering/01_repo_layout.md` | Repository layout and Mix app structure |
| `docs/engineering/02_data_model.md` | Schemas for semantic objects, types, capabilities, proofs |
| `docs/engineering/03_mix_tasks_cli.md` | CLI and Mix task design |
| `docs/engineering/04_generated_testing.md` | ExUnit, StreamData, Credo, Dialyzer, Benchee generation |
| `docs/engineering/05_agent_workflow.md` | How autonomous agents interact with the oracle and kernel |
| `docs/engineering/06_bootstrap_validation.md` | Validating semantic types themselves |
| `docs/engineering/07_mvp_backlog.md` | Build epics, milestones, and task breakdown |
| `docs/operations/00_ci_pipeline.md` | CI pipeline and quality gates |
| `docs/operations/01_rollout_playbook.md` | Adoption strategy for existing Elixir codebases |
| `docs/operations/02_risk_register.md` | Risks and mitigations |
| `docs/examples/00_session_pool_example.md` | End-to-end OTP example |
| `examples/` | DSL examples, generated test examples, mutation examples |
| `diagrams/` | Mermaid diagrams as standalone files |
| `adr/` | Architecture decision records |

## MVP deliverable

The MVP should prove one narrow but complete loop:

1. Declare a semantic type for an OTP boundary process.
2. Declare an agent capability bundle for a local repair.
3. Query the type oracle for valid morphisms.
4. Generate ExUnit/StreamData property tests, Credo checks, telemetry contracts, and Benchee benchmark stubs.
5. Run mutation tests that deliberately violate capability, protocol, telemetry, and cost invariants.
6. Accept/reject a patch with a deterministic proof bundle.
7. Feed runtime telemetry/benchmark anomalies back into candidate type refinements.

The example domain is a supervised `SessionPool` that checks out workers for agent executions.
