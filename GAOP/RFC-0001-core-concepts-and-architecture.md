# RFC-0001: GAOP Core Concepts and Architecture

Status: Draft

Version: v1.0

## Abstract

The Governed Agentic Operations Protocol defines a neutral protocol for controlling the consequences of autonomous and semi-autonomous agents. GAOP does not standardize how an agent reasons. GAOP standardizes how an agentic operation becomes authorized, bounded, executed, recorded, and replayed.

The central primitive is the governed effect: a side effect that is traceable to an intent, authorized by a policy decision, constrained by scope, executed through an execution lane, and represented by a durable receipt.

## Normative language

The terms `MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, `SHOULD NOT`, and `MAY` are to be interpreted as described in RFC 2119 and RFC 8174.

## Scope

GAOP specifies:

1. Protocol vocabulary.
2. Request and authority boundaries.
3. Credential lease semantics.
4. Effect request and receipt semantics.
5. Audit lineage and replay semantics.
6. Human review and compensation semantics.
7. Epistemic framing and operational correctness semantics.

GAOP does not specify:

1. A programming language.
2. A deployment platform.
3. A workflow engine.
4. A database engine.
5. A specific inference provider.
6. A specific source system or target resource provider.

## Required definitions

### Principal

A principal is an authenticated entity that can request, approve, execute, or observe a governed operation.

Examples include a human operator, a service identity, an automated agent, or a delegated workload identity.

A principal MUST be represented by a stable reference. A principal reference MUST NOT embed raw credentials.

### Tenant

A tenant is an administrative and policy boundary. Every command, authority packet, credential lease, effect request, receipt, and evidence record MUST be associated with exactly one tenant.

Tenant isolation is a protocol invariant. A compliant implementation MUST NOT allow protocol objects from one tenant to reference, authorize, or affect protocol objects in another tenant unless an explicit cross-tenant delegation mechanism is defined and audited.

### Agentic Intent

An agentic intent is the normalized statement of what an agent or client is attempting to accomplish before specific effects are dispatched.

An intent SHOULD be high-level enough to preserve product meaning and precise enough to evaluate policy. An intent MUST be hashable in canonical form.

### Governed Effect

A governed effect is any externally meaningful consequence produced by an agentic system under GAOP.

Examples include mutating a target resource, reading scoped data, issuing a network request, creating an artifact, initiating a workflow step, or producing a delegated operation request.

A governed effect MUST have an effect receipt.

### Authority Packet

An authority packet is the policy engine output that records whether a requested intent is allowed, denied, or requires human review.

An authority packet MUST include enough cryptographic or deterministic material for an execution layer to verify that it corresponds to the command being executed.

### Credential Lease

A credential lease is a short-lived, scope-bound reference to secret material. A lease MAY travel through workflow state. Materialized secret bytes MUST NOT travel through workflow state.

### Effect Receipt

An effect receipt is the normalized record of an attempted governed effect. It records status, target, hashes, redaction state, timing, execution lane, and relevant evidence references.

An effect receipt MUST NOT persist raw secrets. It SHOULD NOT persist raw provider payloads unless explicitly quarantined under a redaction policy.

### Trace Lineage

Trace lineage is the causal chain connecting input artifacts, command envelopes, authority packets, effect requests, receipts, and audit projections.

Trace lineage MUST support auditor reconstruction of why a governed effect occurred.

A GAOP `trace_id` MAY map directly to a W3C Trace Context `trace-id` (a 16-byte array represented as 32 lowercase hex characters) as defined in the W3C Trace Context specification. This allows enterprises to overlay GAOP governance on existing distributed tracing infrastructure (OpenTelemetry, Datadog, Honeycomb, Jaeger, etc.).

### Epistemic Frame

An epistemic frame is the protocol object that records the conditions under which a claim, command, authority decision, effect, receipt, replay result, or audit projection was produced.

An epistemic frame captures system identity, analyzer identity, resource budgets, index completeness, coordination mode, concurrent work, reflexivity state, and external constraint context.

An epistemic frame is not passive metadata. A compliant implementation MAY use it to restrict conclusions, disclose degraded results, prevent unsafe merges, and decide whether two observations are comparable.

### Framed Observation

A framed observation is any protocol-relevant claim whose meaning depends on the conditions of production.

Examples include confidence scores, policy findings, impact analyses, replay conclusions, and audit projections.

### External Constraint

An external constraint is a regulatory, legal, ecosystem, platform, certification, or contractual requirement that affects architecture or execution semantics but may not be encoded directly in local policy bundles.

External constraints MUST be represented separately from local design preferences. External constraints SHOULD be evaluated by the policy engine and bound into the authority packet's conditions, making them explicit policy inputs.

### Delegation

Delegation occurs when one principal or agent authorizes another to act on its behalf within a governed scope.

When Agent A delegates to Agent B, Agent B MUST issue a new command envelope with its own `actor_ref`. The command envelope MUST reference the delegating principal via a delegation chain. Resource scopes MUST narrow or remain equal through delegation; they MUST NOT widen. Agent B requires its own authority packet. The delegating agent's epistemic frame SHOULD be referenced as a parent frame in Agent B's epistemic frame.

### Policy Bundle

A policy bundle is an immutable set of policy material used to evaluate a command or constrain execution.

Policy bundles MUST be content-addressed or otherwise hash-bound.

### Resource Scope

A resource scope bounds the resources on which an intent or effect may operate. A resource scope may refer to a path prefix, object collection, dataset, queue, endpoint class, account boundary, repository segment, or other implementation-defined resource set.

### Execution Lane

An execution lane is a concrete substrate capable of performing a governed effect. Examples include a connector invocation lane, a script execution lane, a deterministic test lane, or a human-operated lane.

Every execution lane MUST return an effect receipt or a denial receipt.

## Protocol roles

| Role | Responsibility |
|---|---|
| Client | Creates a command envelope representing requested intent. |
| Policy Engine | Evaluates command, tenant, principal, policy bundle, and resource scope. |
| Credential Broker | Issues and materializes short-lived credential leases. |
| Execution Layer | Validates authority and performs or denies effects through execution lanes. |
| Evidence Store | Persists hash-bound records, receipts, and lineage artifacts. |
| Audit Projection | Presents durable evidence in queryable or human-readable form. |
| Review Authority | Approves or denies operations requiring human review. |

## Governance lifecycle

```mermaid
flowchart TD
    A[Agentic Intent] --> B[Command Envelope]
    B --> C[Policy Evaluation]
    C -->|allow| D[Authority Packet]
    C -->|deny| X[Denial Receipt]
    C -->|review_required| R[Review Gate]
    R -->|approved| D
    R -->|denied| X
    D --> E[Authorized Dispatch]
    E --> F[Credential Lease Resolution]
    F --> G[Effect Execution]
    G --> H[Receipt Generation]
    H --> I[Evidence Record]
    I --> J[Audit Projection]
    I --> K[Causal Replay]
```

## Protocol invariants

1. A command envelope MUST contain a tenant identifier, actor reference, trace identifier, idempotency key, and requested capability.
2. A policy engine MUST produce an authority packet, denial result, or review gate.
3. An execution layer MUST NOT perform side effects without validating an authority packet or review approval.
4. Credential lease references MAY be persisted; materialized secret values MUST NOT be persisted.
5. Every attempted effect MUST produce a receipt.
6. Every receipt MUST be connectable to a trace lineage record.
7. Permanent evidence MUST be hash-bound.
8. Redaction MUST happen before raw payloads enter permanent audit records.
9. Provider-specific payloads MUST be normalized before becoming protocol receipts.
10. Protocol objects MUST be serializable in a language-neutral representation.
11. Claims, receipts, replay results, and audit projections that depend on system identity, resource limits, coordination state, reflexivity state, or external constraints SHOULD reference an epistemic frame.
12. GAOP-Strict implementations MUST support epistemic frame references as defined in RFC-0008.

## Canonicalization and hashes

GAOP hashes are computed over canonical serialized payloads.

JSON implementations MUST use JSON Canonicalization Scheme (JCS) as defined in RFC 8785 for deterministic serialization. JCS requires:

1. Lexicographic sorting of object member names.
2. No insignificant whitespace.
3. Numbers serialized per ECMAScript rules (no trailing zeros, no positive sign, exponential notation for magnitudes outside a defined range).
4. Strings serialized with minimal escaping per ECMAScript rules.
5. UTF-8 encoding.

Non-JSON implementations MUST define and publish the canonicalization method they use, and the method MUST produce byte-identical output for logically equivalent payloads.

Hash strings MUST use this format:

```text
<algorithm>:<lowercase-hex-digest>
```

The default algorithm is `sha256`. Implementations MAY support additional algorithms if the algorithm identifier is included in the hash string.

Hash strings MUST match the following pattern:

```text
^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$
```

## Core JSON Schema definitions

The following schema defines shared GAOP primitive types.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gaop.dev/schemas/v1/core-types.schema.json",
  "title": "GAOP Core Types",
  "type": "object",
  "$defs": {
    "TenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "TraceId": {
      "type": "string",
      "minLength": 16,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "StableRef": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "Hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "IdempotencyKey": {
      "type": "string",
      "minLength": 8,
      "maxLength": 512,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "CapabilityId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "Decision": {
      "type": "string",
      "enum": ["allow", "deny", "review_required"]
    },
    "EffectStatus": {
      "type": "string",
      "enum": ["success", "failed", "denied", "timeout", "cancelled", "compensated"]
    },
    "ProtocolVersion": {
      "type": "string",
      "const": "gaop.v1"
    },
    "NonSecretMetadata": {
      "type": "object",
      "description": "Flat key-value metadata. Keys with null values are equivalent to absent keys for canonicalization purposes.",
      "additionalProperties": {
        "oneOf": [
          { "type": "string", "maxLength": 4096 },
          { "type": "number" },
          { "type": "integer" },
          { "type": "boolean" }
        ]
      }
    },
    "EpistemicFrameRef": {
      "type": "string",
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "ErrorDetail": {
      "type": "object",
      "required": ["category", "code", "message"],
      "additionalProperties": false,
      "properties": {
        "category": {
          "type": "string",
          "enum": ["client", "policy", "execution", "infrastructure", "lease", "review", "epistemic"]
        },
        "code": {
          "type": "string",
          "minLength": 1,
          "maxLength": 256,
          "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
        },
        "message": {
          "type": "string",
          "minLength": 1,
          "maxLength": 4096
        },
        "retryable": {
          "type": "boolean",
          "default": false
        },
        "detail_ref": {
          "type": "string",
          "maxLength": 2048,
          "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
        }
      }
    }
  }
}
```

## Lifecycle rules

1. A command envelope MUST be validated before policy evaluation.
2. A policy evaluation MUST bind the command hash into the authority packet.
3. An authority packet MUST expire or be otherwise bounded.
4. An execution layer MUST reject expired authority packets.
5. A credential lease MUST be scoped to an authority packet or effect request.
6. An effect receipt MUST include enough evidence to distinguish success, denial, failure, timeout, and compensation.
7. Evidence records MUST be append-only from the perspective of the audit trail.
8. Corrections MUST be represented by superseding records, not mutation of historical evidence.

## Compliance levels

| Level | Requirements |
|---|---|
| GAOP-Envelope | Implements command envelopes, authority packets, and effect receipts. |
| GAOP-Evidence | Adds evidence records, trace lineage, and replay hash chains. |
| GAOP-Lease | Adds credential lease and materialization rules. |
| GAOP-HITL | Adds review gates and compensation recipes. |
| GAOP-Epistemic | Adds epistemic frames, analyzer manifests, manifest transitions, and query execution bounds (RFC-0008 core tier). |
| GAOP-Epistemic-Full | Additionally adds analysis epochs, reflexivity signals, external constraints, and calibration quarantine (RFC-0008 advanced tier). |
| GAOP-Strict | Implements all required RFC-0001 through RFC-0008 rules. |

## Epistemic extension

Protocol objects defined in RFC-0002 through RFC-0007 MAY carry:

```json
{
  "epistemic_frame_ref": "epistemic-frame://tenant/example/frame",
  "epistemic_frame_hash": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

If present, `epistemic_frame_hash` MUST be computed over the canonical serialized `EpistemicFrame` defined in RFC-0008.

If a protocol object includes an epistemic frame reference, downstream components MUST preserve it or explicitly create a successor frame that references it.

## Versioning and schema evolution

### Protocol versioning

The protocol version string `gaop.v1` identifies the major version. Minor, non-breaking additions within v1 are indicated by the presence of new optional fields.

Breaking changes MUST increment the major version (e.g., `gaop.v2`). A receiver that does not recognize the protocol version MUST reject the object.

### Schema extension

All GAOP schemas use `"additionalProperties": false` on their core property sets to ensure strict validation. To support forward-compatible extensions without breaking existing validators:

1. Each schema includes an optional `extensions` property when extensibility is needed.
2. Implementation-defined fields MUST use the `extensions` object rather than adding top-level properties.
3. A receiver MUST NOT reject a protocol object solely because it contains unknown keys within `extensions`.
4. Extensions MUST NOT override or redefine the semantics of normative fields.

### Deprecation

A field or object marked for deprecation MUST remain valid for at least one major version after the deprecation is announced. Deprecated fields SHOULD include a deprecation notice in their schema description.

## Transport considerations

GAOP defines data model contracts, not wire transport. However, compliant implementations SHOULD observe the following guidance:

### HTTP binding

When transporting GAOP objects over HTTP:

1. Request and response bodies MUST use `application/json` content type with UTF-8 encoding.
2. GAOP object type SHOULD be indicated via a `GAOP-Object-Type` header (e.g., `CommandEnvelope`, `AuthorityPacket`).
3. Protocol version SHOULD be indicated via a `GAOP-Protocol-Version` header.
4. Error responses MUST use the `ErrorDetail` schema defined in this RFC.
5. Idempotent submissions SHOULD use HTTP PUT or POST with idempotency key headers.
6. Evidence queries SHOULD support pagination via `cursor` and `limit` parameters.

### Asynchronous transport

When transporting GAOP objects over message queues or event buses:

1. The message envelope MUST include `gaop_object_type`, `protocol_version`, `tenant_id`, and `trace_id` as message attributes or headers.
2. The message body MUST be the canonical JSON serialization of the GAOP object.
3. Implementations SHOULD use at-least-once delivery with idempotency-key-based deduplication.

### Clock synchronization

All timestamps in GAOP objects MUST be UTC. Implementations SHOULD synchronize clocks via NTP or equivalent. Implementations SHOULD accept authority packets, credential leases, and review gates within 60 seconds of their stated `expires_at` to accommodate reasonable clock skew. Implementations MUST NOT accept objects more than 300 seconds past their stated `expires_at`.

