# 12 — QC Controls Catalog

This catalog is intentionally broad. It separates deterministic controls from LM-assisted controls.

## Control levels

| Level | Name | Meaning |
|---|---|---|
| L0 | Guidance | Prompt/checklist only. |
| L1 | Structured review | Required form or rationale. |
| L2 | Static check | AST/text/graph detector. |
| L3 | Behavioral check | Unit/property/fault test. |
| L4 | Construction constraint | Generator/template prevents invalid shape. |
| L5 | Merge gate | CI/harness blocks acceptance. |

## Core controls

| Control | Deterministic? | Tooling | LM role | Gate |
|---|---:|---|---|---|
| Format | yes | `mix format --check-formatted` | repair | block |
| Compile | yes | `mix compile --warnings-as-errors` | repair | block |
| Tests | yes | ExUnit | generate/repair | block |
| Credo strict | yes | Credo | explain/repair | warn/block |
| Dialyzer | mostly | Dialyxir | repair specs | warn/block |
| Public API diff | yes | AST export diff | explain impact | block |
| Boundary violations | mostly | call graph + spec | propose refactor | block |
| Undeclared effect | mostly | AST/call graph | classify | block |
| Unjustified GenServer | partial | AST + process form | justify/refactor | block |
| Single-implementation behaviour | yes | AST graph | collapse | warn/block |
| Invented domain term | partial | spec dictionary + LM | classify synonym | warn/block |
| External SDK leakage into core | mostly | call graph | refactor adapter | block |
| Raw credential exposure | mostly | taint/AST/log scan | propose fix | block |
| Missing telemetry/audit | partial | spec obligations | add events | warn/block |

## Elixir/OTP controls

```text
- no business logic in GenServer callbacks
- no unsupervised spawn / Task.start
- no unbounded cast by default
- no DynamicSupervisor for fixed children
- no Registry without dynamic lookup need
- no Application config reads in pure core
- no System env reads outside config/materializer boundary
- no String.to_atom on external input
- no Process.sleep in tests
- no broad rescue swallowing errors
- no long blocking work in stateful callback
```

## Architecture controls

```text
- every module has a SpecCell or generated support role
- every public function traces to a contract
- every boundary edge is declared
- every external effect is declared
- every process has state/lifecycle justification
- every supervisor has failure domain rationale
- every behaviour has multiple implementations or declared seam
- every state machine has forbidden-transition tests
```

## Compression controls

```text
- module count budget
- public function budget
- process count budget
- behaviour count budget
- abstraction depth budget
- duplicate concept detector
- single-use wrapper detector
- API fan-out detector
- state representation count
```

## Security controls

```text
- no raw secrets in agent sandbox
- no raw secrets in logs/telemetry/crash dumps
- credential leases non-exportable
- connector redeemability checked
- revocation epoch checked
- tenant/session boundary checked
- sandbox file/env exfiltration tests
```

## LM-assisted controls

Use LMs for:

```text
- ambiguous term classification
- architecture rationale critique
- compression proposal
- test idea generation
- error explanation
- spec gap detection
```

Do not use LMs as final authority for:

```text
- compile status
- test status
- module existence
- public API count
- external effect occurrence
- secret exposure scan
- process count
- boundary edge presence
```

## Promotion rule

Any repeated LM-assisted finding should become a deterministic rule when possible.

```text
LLM critique → structured finding → detector candidate → test/check → gate
```
