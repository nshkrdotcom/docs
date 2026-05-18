# GAOP Specification v1.0 Draft Docset

GAOP is the Governed Agentic Operations Protocol.

This docset defines a language-agnostic, provider-neutral, cloud-independent protocol for authorizing, bounding, executing, recording, and replaying autonomous or semi-autonomous agentic operations.

This specification is independent of any particular reference implementation. A compliant implementation may be written in any language, deployed on any infrastructure, and integrated with any inference provider, source system, or target resource.

## Normative status

Status: Draft

Version: v1.0

Date: 2026-05-18

The terms `MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, `SHOULD NOT`, and `MAY` are to be interpreted as described in RFC 2119 and RFC 8174.

## Documents

| RFC | Title | Purpose |
|---|---|---|
| RFC-0001 | Core Concepts and Architecture | Defines the vocabulary, lifecycle, roles, and protocol invariants. |
| RFC-0002 | Command and Intent Envelope | Defines how clients request governed operations. |
| RFC-0003 | Authority Packet | Defines the cryptographic proof of permission or review requirement. |
| RFC-0004 | Credential Leasing and Materialization | Defines secret-safe lease handling and edge-only materialization. |
| RFC-0005 | Governed Effects and Receipts | Defines effect execution and normalized receipts. |
| RFC-0006 | Audit Lineage and Causal Replay | Defines evidence records, hash chains, and replay semantics. |
| RFC-0007 | Human-in-the-Loop and Compensation | Defines review gates and rollback/compensation recipes. |
| RFC-0008 | Epistemic Frames and Operational Correctness | Defines system identity, bounded execution, coordination, reflexivity, and external constraint context. |

## Reading order

1. `RFC-0001-core-concepts-and-architecture.md`
2. `RFC-0002-command-and-intent-envelope.md`
3. `RFC-0003-authority-packet.md`
4. `RFC-0004-credential-leasing-and-materialization.md`
5. `RFC-0005-governed-effects-and-receipts.md`
6. `RFC-0006-audit-lineage-and-causal-replay.md`
7. `RFC-0007-hitl-and-compensation.md`
8. `RFC-0008-epistemic-frames-and-operational-correctness.md`

## Protocol principle

GAOP treats every meaningful agentic consequence as a governed effect.

A governed effect is valid only when it can be tied to:

1. A tenant.
2. A principal.
3. An agentic intent.
4. A bounded resource scope.
5. A policy evaluation.
6. An authority packet.
7. An execution lane.
8. A deterministic or cryptographic receipt.
9. A trace lineage record.
10. An epistemic frame describing the system, resource, coordination, reflexivity, and external-constraint conditions under which the observation or action was produced.

## Out of scope

GAOP does not standardize:

1. Prompt formats.
2. Model APIs.
3. Provider SDKs.
4. Workflow engine internals.
5. Database schemas.
6. User-interface behavior.
7. Specific programming languages.
8. Specific cloud infrastructure.

GAOP standardizes the contracts that allow those systems to interoperate safely.

## Epistemic correctness

GAOP treats evidence as framed. A receipt or claim without epistemic context may still be useful, but it is not sufficient for strict conformance in environments where model versions, analyzer versions, query budgets, concurrent analyses, reflexivity, or external constraints can change the meaning of the result.

RFC-0008 defines the protocol objects that prevent silently incomparable confidence scores, silently partial query results, racing analyses, self-induced calibration drift, and missing external constraint context.
