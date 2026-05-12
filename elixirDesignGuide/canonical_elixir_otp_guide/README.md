# Canonical Large-Scale Elixir/OTP Implementation Guide

This docset is a practical operating system for designing, building, reviewing, and repairing large Elixir/OTP applications.

It is written for both:

- Greenfield systems, where architecture can be shaped before code exists.
- Brownfield systems, where the existing runtime, data model, and dependency graph must be understood before it can be safely changed.

The core rule is:

```text
Design the domain and consistency model first.
Lower into OTP only where runtime ownership exists.
Prove the design through review artifacts, tests, observability, and release gates.
```

## How To Use This Docset

Start with [00_IMPLEMENTATION_CHECKLIST.md](00_IMPLEMENTATION_CHECKLIST.md). It is the control document for the whole guide: every document has a coverage checklist, and every checklist item must be covered before the docset is considered canonical.

For a new system, read in this order:

1. [process/01_formal_development_process.md](process/01_formal_development_process.md)
2. [process/02_greenfield_lifecycle.md](process/02_greenfield_lifecycle.md)
3. [architecture/04_domain_data_and_boundaries.md](architecture/04_domain_data_and_boundaries.md)
4. [architecture/05_functional_core_effect_shell.md](architecture/05_functional_core_effect_shell.md)
5. [architecture/06_otp_runtime_lowering.md](architecture/06_otp_runtime_lowering.md)
6. [qc/15_static_analysis_qc_and_ci_gates.md](qc/15_static_analysis_qc_and_ci_gates.md)
7. [process/17_feature_acceptance_review_protocol.md](process/17_feature_acceptance_review_protocol.md)

For an existing system, read in this order:

1. [process/03_brownfield_lifecycle.md](process/03_brownfield_lifecycle.md)
2. [process/16_refactoring_cleanup_and_rebuild_process.md](process/16_refactoring_cleanup_and_rebuild_process.md)
3. [architecture/07_supervision_process_lifecycle.md](architecture/07_supervision_process_lifecycle.md)
4. [qc/14_testing_verification_and_model_checking.md](qc/14_testing_verification_and_model_checking.md)
5. [qc/20_canonical_review_rubric.md](qc/20_canonical_review_rubric.md)

For a specific feature, use [use_cases/18_use_case_playbooks.md](use_cases/18_use_case_playbooks.md) and the templates in [templates/19_templates_and_forms.md](templates/19_templates_and_forms.md).

## Docset Map

### Process

- [01 Formal Development Process](process/01_formal_development_process.md)
- [02 Greenfield Lifecycle](process/02_greenfield_lifecycle.md)
- [03 Brownfield Lifecycle](process/03_brownfield_lifecycle.md)
- [16 Refactoring, Cleanup, And Rebuild Process](process/16_refactoring_cleanup_and_rebuild_process.md)
- [17 Feature Acceptance And Review Protocol](process/17_feature_acceptance_review_protocol.md)

### Architecture

- [04 Domain Data And Boundaries](architecture/04_domain_data_and_boundaries.md)
- [05 Functional Core, Effect Shell](architecture/05_functional_core_effect_shell.md)
- [06 OTP Runtime Lowering](architecture/06_otp_runtime_lowering.md)
- [07 Supervision And Process Lifecycle](architecture/07_supervision_process_lifecycle.md)
- [08 Persistence, Transactions, And Effects](architecture/08_persistence_transactions_and_effects.md)
- [09 APIs, Web Layers, And Contracts](architecture/09_apis_web_layers_and_contracts.md)
- [10 Workflows, Jobs, And External Effects](architecture/10_workflows_jobs_and_external_effects.md)
- [11 Distributed OTP And Cluster Readiness](architecture/11_distributed_otp_and_cluster_readiness.md)
- [12 Observability, Operations, And Shutdown](architecture/12_observability_operations_and_shutdown.md)
- [13 Security, Config, Secrets, And Tenant Boundaries](architecture/13_security_config_secrets_and_tenant_boundaries.md)

### QC

- [14 Testing, Verification, And Model Checking](qc/14_testing_verification_and_model_checking.md)
- [15 Static Analysis, QC, And CI Gates](qc/15_static_analysis_qc_and_ci_gates.md)
- [20 Canonical Review Rubric](qc/20_canonical_review_rubric.md)

### Use Cases And Templates

- [18 Use Case Playbooks](use_cases/18_use_case_playbooks.md)
- [19 Templates And Forms](templates/19_templates_and_forms.md)

## Canonical Architecture Shape

```text
Application
└── Root Supervisor
    ├── Infrastructure
    │   ├── Repo / DB pool
    │   ├── PubSub / message bus
    │   ├── Registry
    │   └── Task.Supervisor
    ├── Bounded Context Supervisors
    │   ├── static workers
    │   └── DynamicSupervisor for runtime children
    ├── Effect Delivery
    │   ├── Oban / durable jobs
    │   ├── outbox publisher
    │   └── external adapter pools
    └── Observability / health / telemetry
```

Most business behavior should not live in that tree. The tree owns runtime responsibilities. Business behavior belongs in explicit data structures, pure transition functions, and effect orchestration boundaries.

## Canonical Decision Order

1. Define the domain language.
2. Define commands, events, states, read models, and persistence records separately.
3. Assign invariants to the weakest sufficient enforcement layer.
4. Define boundaries and public contracts.
5. Keep core transitions pure.
6. Declare effects, idempotency, and recovery.
7. Lower only necessary runtime responsibilities into OTP primitives.
8. Design supervision around failure domains.
9. Design tests and observability before implementation is accepted.
10. Use QC gates to prevent regressions.

