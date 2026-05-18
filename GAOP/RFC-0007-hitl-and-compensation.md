# RFC-0007: Human-in-the-Loop and Compensation

Status: Draft

Version: v1.0

## Abstract

This document defines GAOP human-in-the-loop review gates and compensation recipes. Review gates pause execution when policy requires human or delegated approval. Compensation recipes declare rollback or corrective actions for failed multi-step operations.

## Review and compensation lifecycle

```mermaid
stateDiagram-v2
    [*] --> Execution_Paused
    Execution_Paused --> Operator_Allowed: review decision allow
    Execution_Paused --> Operator_Denied: review decision deny
    Execution_Paused --> Review_Expired: timeout
    Operator_Allowed --> Resume_Execution
    Operator_Denied --> Trigger_Compensation
    Review_Expired --> Trigger_Compensation
    Resume_Execution --> Effect_Executed
    Resume_Execution --> Effect_Failed
    Effect_Failed --> Trigger_Compensation
    Trigger_Compensation --> Compensation_Executed
    Trigger_Compensation --> Compensation_Failed
    Effect_Executed --> [*]
    Compensation_Executed --> [*]
    Compensation_Failed --> [*]
```

## ReviewGate JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gaop.dev/schemas/v1/review-gate.schema.json",
  "title": "GAOP ReviewGate",
  "type": "object",
  "required": [
    "protocol_version",
    "review_gate_id",
    "tenant_id",
    "trace_id",
    "command_id",
    "command_hash",
    "authority_id",
    "authority_hash",
    "review_state",
    "required_reviewer_class",
    "created_at",
    "expires_at"
  ],
  "additionalProperties": false,
  "properties": {
    "protocol_version": {
      "type": "string",
      "const": "gaop.v1"
    },
    "review_gate_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "tenant_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "trace_id": {
      "type": "string",
      "minLength": 16,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "command_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "command_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "authority_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "authority_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "review_state": {
      "type": "string",
      "enum": ["pending", "allowed", "denied", "expired", "cancelled"]
    },
    "required_reviewer_class": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256
    },
    "review_reason": {
      "type": "string",
      "maxLength": 4096
    },
    "allowed_decision_window": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "not_before": {
          "type": "string",
          "format": "date-time"
        },
        "not_after": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "epistemic_frame_ref": {
      "type": "string",
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "epistemic_frame_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "review_disclosures": {
      "type": "array",
      "maxItems": 128,
      "items": {
        "type": "string",
        "maxLength": 4096
      },
      "default": []
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## ReviewDecision JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gaop.dev/schemas/v1/review-decision.schema.json",
  "title": "GAOP ReviewDecision",
  "type": "object",
  "required": [
    "protocol_version",
    "review_decision_id",
    "review_gate_id",
    "tenant_id",
    "trace_id",
    "reviewer_ref",
    "decision",
    "decision_hash",
    "decided_at"
  ],
  "additionalProperties": false,
  "properties": {
    "protocol_version": {
      "type": "string",
      "const": "gaop.v1"
    },
    "review_decision_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "review_gate_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "tenant_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "trace_id": {
      "type": "string",
      "minLength": 16,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "reviewer_ref": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "decision": {
      "type": "string",
      "enum": ["allow", "deny"]
    },
    "decision_rationale": {
      "type": "string",
      "maxLength": 8192
    },
    "decision_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "signature": {
      "type": "object",
      "required": ["signature_algorithm", "key_ref", "signature_value"],
      "additionalProperties": false,
      "properties": {
        "signature_algorithm": {
          "type": "string",
          "minLength": 1,
          "maxLength": 128
        },
        "key_ref": {
          "type": "string",
          "minLength": 1,
          "maxLength": 2048,
          "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
        },
        "signature_value": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "epistemic_frame_ref": {
      "type": "string",
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "epistemic_frame_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "decided_at": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## CompensationRecipe JSON Schema

A compensation recipe is a declarative plan. Each compensation step MUST independently pass through the full GAOP lifecycle (command → authority → effect → receipt) when executed.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gaop.dev/schemas/v1/compensation-recipe.schema.json",
  "title": "GAOP CompensationRecipe",
  "type": "object",
  "required": [
    "protocol_version",
    "compensation_recipe_id",
    "tenant_id",
    "trace_id",
    "applies_to_effect_request_id",
    "authority_id",
    "authority_hash",
    "compensation_strategy",
    "created_at"
  ],
  "additionalProperties": false,
  "properties": {
    "protocol_version": {
      "type": "string",
      "const": "gaop.v1"
    },
    "compensation_recipe_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "tenant_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "trace_id": {
      "type": "string",
      "minLength": 16,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "applies_to_effect_request_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "authority_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "authority_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "compensation_strategy": {
      "type": "string",
      "enum": ["inverse_effect", "restore_snapshot", "append_correction", "manual_remediation", "none_available"]
    },
    "steps": {
      "type": "array",
      "maxItems": 128,
      "items": {
        "$ref": "#/$defs/CompensationStep"
      },
      "default": []
    },
    "epistemic_frame_ref": {
      "type": "string",
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "epistemic_frame_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "external_constraint_refs": {
      "type": "array",
      "maxItems": 128,
      "items": {
        "type": "string",
        "maxLength": 2048,
        "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
      },
      "default": []
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "$defs": {
    "CompensationStep": {
      "type": "object",
      "required": ["step_id", "operation", "target_ref"],
      "additionalProperties": false,
      "properties": {
        "step_id": {
          "type": "string",
          "minLength": 1,
          "maxLength": 256
        },
        "operation": {
          "type": "string",
          "minLength": 1,
          "maxLength": 256
        },
        "target_ref": {
          "type": "string",
          "minLength": 1,
          "maxLength": 2048,
          "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
        },
        "requires_review": {
          "type": "boolean",
          "default": true
        },
        "precondition_hash": {
          "type": "string",
          "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
        }
      }
    }
  }
}
```

## CompensationReceipt JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gaop.dev/schemas/v1/compensation-receipt.schema.json",
  "title": "GAOP CompensationReceipt",
  "type": "object",
  "required": [
    "protocol_version",
    "compensation_receipt_id",
    "compensation_recipe_id",
    "tenant_id",
    "trace_id",
    "status",
    "receipt_hash",
    "completed_at"
  ],
  "additionalProperties": false,
  "properties": {
    "protocol_version": {
      "type": "string",
      "const": "gaop.v1"
    },
    "compensation_receipt_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "compensation_recipe_id": {
      "type": "string",
      "minLength": 8,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "tenant_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "trace_id": {
      "type": "string",
      "minLength": 16,
      "maxLength": 256,
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"
    },
    "status": {
      "type": "string",
      "enum": ["success", "failed", "partial", "not_available", "manual_required"]
    },
    "step_receipt_refs": {
      "type": "array",
      "maxItems": 128,
      "items": {
        "type": "string",
        "maxLength": 2048,
        "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
      },
      "default": []
    },
    "epistemic_frame_ref": {
      "type": "string",
      "maxLength": 2048,
      "pattern": "^[a-zA-Z][a-zA-Z0-9+.-]*://.+$"
    },
    "epistemic_frame_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "receipt_hash": {
      "type": "string",
      "pattern": "^[a-z0-9_+-]+:[a-fA-F0-9]{32,}$"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## Review rules

1. A `review_required` authority decision MUST produce a review gate.
2. Execution MUST pause while a review gate is pending.
3. A review gate MUST expire.
4. A review decision MUST be bound to the review gate, tenant, trace, command hash, and authority hash.
5. A review approval MUST be verified before execution resumes.
6. A review denial MUST produce a denial receipt or trigger compensation if prior effects exist.
7. Review decisions SHOULD be signed or otherwise authenticated.

## Compensation rules

1. High-risk multi-step operations SHOULD declare compensation recipes before execution.
2. A compensation recipe MUST identify the effect request it applies to.
3. A compensation recipe MUST reference the authority packet that governs it via `authority_id` and `authority_hash`.
4. A compensation step MUST be independently governed as a new effect through the full GAOP lifecycle.
5. Compensation MUST produce a compensation receipt.
6. Compensation MUST NOT erase the original effect receipt.
7. Failed compensation MUST be represented explicitly.
8. Manual remediation MAY be a valid compensation strategy if automated reversal is unsafe or impossible.
9. When `compensation_strategy` is `none_available`, the `steps` array MAY be empty. For all other strategies, `steps` MUST contain at least one entry.

## Review approval binding

An execution layer resuming from review MUST verify:

1. The review gate is not expired.
2. The review decision references the correct review gate.
3. The reviewer satisfies `required_reviewer_class`.
4. The review decision hash is valid.
5. Any review signature is valid.
6. The command hash and authority hash match the paused execution.

If any check fails, execution MUST remain paused or be denied.

## Epistemic review and compensation rules

For GAOP-Epistemic conformance:

1. A review gate MUST disclose the epistemic frame that caused review to be required.
2. A reviewer SHOULD be shown degradation disclosures, manifest incompatibilities, reflexivity warnings, coordination conflicts, and external constraints relevant to the decision.
3. A review approval MUST bind to the same epistemic frame or a compatible successor frame.
4. Compensation recipes SHOULD declare external constraints that affect rollback safety.
5. Compensation receipts MUST disclose if compensation was partial because of external constraints or changed frame conditions.

