# Elixir AI Engineer: Spec-Governed Greenfield Architecture Docset

This docset defines a practical architecture for building large greenfield Elixir/OTP systems with AI assistance **without pretending the language model is the engineer**.

The central thesis:

> **The AI engineer is not a model. It is a deterministic engineering harness with language models embedded as bounded proposal engines.**

The system proposed here is an **Elixir/OTP specification compiler and engineering normalizer**. It lowers human intent through structured artifacts before code exists, then checks generated code against the extracted architecture, engineering policy, and runtime evidence.

It is designed to answer the criticism from senior Elixir engineers:

- AI can produce code that compiles and passes tests, but is architecturally wrong.
- AI can produce 1,000 LOC where a senior engineer writes 250 LOC.
- AI does not know when **not** to use Elixir, OTP, GenServers, behaviours, registries, supervisors, or abstractions.
- Generic coding agents do not have enough implicit project context or strong opinions about nonfunctional requirements.

The answer is not “better prompting.” The answer is a **process substrate**:

```text
strong spec → architecture alternatives → explicit constraints → deterministic skeletons
→ bounded LM fill → extracted implementation graph → ENF check
→ compression challenge → evidence gate → accepted code
```

## What is in this docset

| Area | Files |
|---|---|
| Core thesis | `00_thesis.md`, `01_problem_statement.md` |
| System architecture | `02_system_overview.md`, `03_spec_stack.md`, `04_spec_cells.md` |
| Elixir architecture | `05_elixir_engineering_normal_form.md`, `06_otp_lowering.md`, `07_architecture_compression.md` |
| Greenfield process | `08_greenfield_workflow.md`, `09_pre_code_design_reviews.md`, `10_context_bundles.md` |
| Evaluation and QC | `11_eval_framework.md`, `12_qc_controls_catalog.md`, `13_nogood_constraint_compilation.md` |
| Harness implementation | `14_mix_tasks.md`, `15_implementation_graph.md`, `16_normalizer.md`, `17_agent_roles.md` |
| Proof slice | `18_credentialed_connector_slice.md`, `examples/credential_fabric_spec.md` |
| Roadmap | `19_roadmap.md`, `20_open_questions.md` |
| Templates | `templates/*` |
| Policies | `policies/*` |
| Benchmarks | `benchmarks/*` |

## The practical starting point

Build three Mix tasks first:

```bash
mix spec.audit    # extracts architecture from code and reports slop/spec drift
mix spec.bundle   # builds a precise context bundle for a coding agent
mix spec.accept   # runs the acceptance gate
```

Do **not** start with code generation. Start with audit, context distillation, and acceptance.

## The first proof slice

The first full vertical slice should be:

> **Governed provider invocation through Credential Fabric + Connector Fabric.**

It exercises the important parts:

- `ExecutionContext`
- `CredentialLease`
- capability / access checks
- connector invocation
- untrusted vs trusted boundaries
- no raw credential exposure
- audit event
- revocation
- redaction
- spec-to-code traceability

## How to use this docset

1. Read `00_thesis.md` and `01_problem_statement.md`.
2. Use `templates/spec_cell_template.md` to define one component.
3. Use `policies/enf_policy.yaml` as the initial Engineering Normal Form policy.
4. Use `examples/credential_fabric_spec.md` as the first slice.
5. Implement only `mix spec.audit` first.
6. Run it against AI-generated Elixir and produce a report.

The demo that matters is not “AI writes code.”

The demo that matters is:

```text
AI-generated implementation passes tests but violates engineering normal form.
The harness detects why.
A normalized rewrite preserves behavior with fewer modules, fewer public APIs,
fewer unjustified abstractions, and stronger traceability.
```
