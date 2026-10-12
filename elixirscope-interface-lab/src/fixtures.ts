/* Original synthetic fixtures copied from the supplied ElixirScope blueprint. */

const captureFail: CaptureFixture = {
  "format": "elixirscope-synthetic-capture",
  "schemaVersion": "1.0",
  "synthetic": true,
  "sessionId": "run-fail",
  "codeVersions": [
    {
      "nodeInstanceId": "node-a-boot-1",
      "revisionId": "synthetic-rev-001"
    },
    {
      "nodeInstanceId": "node-b-boot-1",
      "revisionId": "synthetic-rev-001"
    },
    {
      "nodeInstanceId": "node-c-boot-1",
      "revisionId": "synthetic-rev-001"
    }
  ],
  "clockAlignment": {
    "status": "unknown",
    "note": "Monotonic timestamps across nodes are intentionally incomparable"
  },
  "capturePolicy": {
    "mode": "fixture_metadata_partial",
    "payloadDefault": "metadata_only",
    "scope": "cmd-42"
  },
  "coverage": {
    "status": "partial",
    "notes": [
      "External operation outcomes not observed in failing run",
      "State is only a point-in-time partial observation"
    ]
  },
  "events": [
    {
      "id": "run-fail-node-a-boot-1-001",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-a-boot-1",
      "processInstanceId": "node-a-boot-1/ingress-pid1",
      "logicalRoleId": "ingress",
      "localSequence": 1,
      "clockDomain": "node-a-boot-1-mono",
      "monotonicNs": "1000000",
      "wallTimeNs": null,
      "eventType": "command_accepted",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "commandId": "cmd-42"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-a-boot-1-002",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-a-boot-1",
      "processInstanceId": "node-a-boot-1/ingress-pid1",
      "logicalRoleId": "ingress",
      "localSequence": 2,
      "clockDomain": "node-a-boot-1-mono",
      "monotonicNs": "1000200",
      "wallTimeNs": null,
      "eventType": "message_sent",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": "msg-42",
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-001",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 1,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220000",
      "wallTimeNs": null,
      "eventType": "process_spawned",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "supervisor": "command_supervisor"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-002",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 2,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220500",
      "wallTimeNs": null,
      "eventType": "message_received",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": "msg-42",
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-003",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 3,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220700",
      "wallTimeNs": null,
      "eventType": "callback_enter",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-004",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 4,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221100",
      "wallTimeNs": null,
      "eventType": "effect_attempted",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "effectType": "external_write",
        "attempt": 1,
        "outcome": "not_observed"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-005",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 5,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221200",
      "wallTimeNs": null,
      "eventType": "state_observed",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "status": "executing",
        "completeness": "partial"
      },
      "evidenceKind": "observed",
      "captureStatus": "partial",
      "captureProducer": "synthetic_fixture_generator",
      "notes": "Point observation; no guarantee about later state"
    },
    {
      "id": "run-fail-node-b-boot-1-006",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 6,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221300",
      "wallTimeNs": null,
      "eventType": "process_exit",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "reason": "injected_crash"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-007",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid2",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 7,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "223000",
      "wallTimeNs": null,
      "eventType": "process_spawned",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.recover/2",
        "span": {
          "startLine": 71,
          "startColumn": 3,
          "endLine": 99,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "supervisor": "command_supervisor"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-008",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid2",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 8,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "223300",
      "wallTimeNs": null,
      "eventType": "callback_enter",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.recover/2",
        "span": {
          "startLine": 71,
          "startColumn": 3,
          "endLine": 99,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-b-boot-1-009",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid2",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 9,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "223800",
      "wallTimeNs": null,
      "eventType": "effect_attempted",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.recover/2",
        "span": {
          "startLine": 71,
          "startColumn": 3,
          "endLine": 99,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "effectType": "external_write",
        "attempt": 2,
        "outcome": "not_observed"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-fail-node-c-boot-1-001",
      "sessionId": "run-fail",
      "nodeInstanceId": "node-c-boot-1",
      "processInstanceId": "node-c-boot-1/journal-pid1",
      "logicalRoleId": "journal",
      "localSequence": 1,
      "clockDomain": "node-c-boot-1-mono",
      "monotonicNs": "600000",
      "wallTimeNs": null,
      "eventType": "journal_write_observed",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "record": "cmd-42",
        "status": "pending"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": "Observed write in fixture; cross-node order not implied by numerical monotonic clock"
    }
  ],
  "relations": [
    {
      "fromEventId": "run-fail-node-a-boot-1-002",
      "toEventId": "run-fail-node-b-boot-1-002",
      "kind": "message_transfer",
      "basis": "synthetic_fixture_message_id",
      "evidenceKind": "observed"
    },
    {
      "fromEventId": "run-fail-node-b-boot-1-006",
      "toEventId": "run-fail-node-b-boot-1-007",
      "kind": "supervisor_reaction",
      "basis": "synthetic_fixture_supervisor_link",
      "evidenceKind": "observed"
    }
  ]
};

const capturePass: CaptureFixture = {
  "format": "elixirscope-synthetic-capture",
  "schemaVersion": "1.0",
  "synthetic": true,
  "sessionId": "run-pass",
  "codeVersions": [
    {
      "nodeInstanceId": "node-a-boot-1",
      "revisionId": "synthetic-rev-001"
    },
    {
      "nodeInstanceId": "node-b-boot-1",
      "revisionId": "synthetic-rev-001"
    },
    {
      "nodeInstanceId": "node-c-boot-1",
      "revisionId": "synthetic-rev-001"
    }
  ],
  "clockAlignment": {
    "status": "unknown",
    "note": "Monotonic timestamps across nodes are intentionally incomparable"
  },
  "capturePolicy": {
    "mode": "fixture_metadata_partial",
    "payloadDefault": "metadata_only",
    "scope": "cmd-42"
  },
  "coverage": {
    "status": "partial",
    "notes": [
      "External operation outcomes not observed in failing run",
      "No state snapshots captured"
    ]
  },
  "events": [
    {
      "id": "run-pass-node-a-boot-1-001",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-a-boot-1",
      "processInstanceId": "node-a-boot-1/ingress-pid1",
      "logicalRoleId": "ingress",
      "localSequence": 1,
      "clockDomain": "node-a-boot-1-mono",
      "monotonicNs": "1000000",
      "wallTimeNs": null,
      "eventType": "command_accepted",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "commandId": "cmd-42"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-a-boot-1-002",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-a-boot-1",
      "processInstanceId": "node-a-boot-1/ingress-pid1",
      "logicalRoleId": "ingress",
      "localSequence": 2,
      "clockDomain": "node-a-boot-1-mono",
      "monotonicNs": "1000200",
      "wallTimeNs": null,
      "eventType": "message_sent",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": "msg-42",
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-001",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 1,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220000",
      "wallTimeNs": null,
      "eventType": "process_spawned",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "supervisor": "command_supervisor"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-002",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 2,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220500",
      "wallTimeNs": null,
      "eventType": "message_received",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": "msg-42",
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-003",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 3,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "220700",
      "wallTimeNs": null,
      "eventType": "callback_enter",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": null,
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-004",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 4,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221100",
      "wallTimeNs": null,
      "eventType": "effect_attempted",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "effectType": "external_write",
        "attempt": 1,
        "outcome": "not_observed"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-005",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 5,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221500",
      "wallTimeNs": null,
      "eventType": "effect_result_observed",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "attempt": 1,
        "result": "acknowledged_by_test_gateway"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-b-boot-1-006",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-b-boot-1",
      "processInstanceId": "node-b-boot-1/worker-pid1",
      "logicalRoleId": "worker-cmd-42",
      "localSequence": 6,
      "clockDomain": "node-b-boot-1-mono",
      "monotonicNs": "221800",
      "wallTimeNs": null,
      "eventType": "callback_exit",
      "sourceRef": {
        "repositoryId": "synthetic-otp-recovery",
        "revisionId": "synthetic-rev-001",
        "language": "elixir",
        "filePath": "lib/otp_recovery/command_worker.ex",
        "contentHash": "synthetic-blob-command-worker-v1",
        "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
        "span": {
          "startLine": 40,
          "startColumn": 3,
          "endLine": 66,
          "endColumn": 6
        },
        "matchStatus": "exact"
      },
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "status": "ok"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": null
    },
    {
      "id": "run-pass-node-c-boot-1-001",
      "sessionId": "run-pass",
      "nodeInstanceId": "node-c-boot-1",
      "processInstanceId": "node-c-boot-1/journal-pid1",
      "logicalRoleId": "journal",
      "localSequence": 1,
      "clockDomain": "node-c-boot-1-mono",
      "monotonicNs": "600000",
      "wallTimeNs": null,
      "eventType": "journal_write_observed",
      "sourceRef": null,
      "correlationId": "cmd-42",
      "messageId": null,
      "payload": {
        "record": "cmd-42",
        "status": "pending"
      },
      "evidenceKind": "observed",
      "captureStatus": "metadata_only",
      "captureProducer": "synthetic_fixture_generator",
      "notes": "Observed write in fixture; cross-node order not implied by numerical monotonic clock"
    }
  ],
  "relations": [
    {
      "fromEventId": "run-pass-node-a-boot-1-002",
      "toEventId": "run-pass-node-b-boot-1-002",
      "kind": "message_transfer",
      "basis": "synthetic_fixture_message_id",
      "evidenceKind": "observed"
    }
  ]
};

const alignmentFixture: AlignmentFixture = {
  "synthetic": true,
  "schemaVersion": "1.0",
  "runA": "run-pass",
  "runB": "run-fail",
  "alignmentPlan": {
    "scope": {
      "correlationId": "cmd-42"
    },
    "alignBy": "semantic_milestones",
    "matchBasis": "shared_command_id_and_symbol"
  },
  "anchors": [
    {
      "label": "command_accepted",
      "runA": "run-pass-node-a-boot-1-001",
      "runB": "run-fail-node-a-boot-1-001",
      "basis": "same_command_id"
    },
    {
      "label": "first_effect_attempted",
      "runA": "run-pass-node-b-boot-1-004",
      "runB": "run-fail-node-b-boot-1-004",
      "basis": "logical_role_and_effect_kind"
    }
  ],
  "differences": [
    {
      "kind": "additional_observed_event",
      "runAEvent": null,
      "runBEvent": "run-fail-node-b-boot-1-009",
      "finding": "Second external write attempt recorded in failing run",
      "qualifier": "The first attempt outcome was not recorded; cannot assert duplicate committed effect."
    }
  ],
  "gaps": [
    "run-fail initial external outcome unknown; no global event order implied"
  ]
};

const reviewContextFixture: Record<string, unknown> = {
  "synthetic": true,
  "schemaVersion": "1.0",
  "revisionId": "synthetic-rev-001",
  "selectedSymbol": {
    "id": "sym-worker-handle-info",
    "sourceRef": {
      "repositoryId": "synthetic-otp-recovery",
      "revisionId": "synthetic-rev-001",
      "language": "elixir",
      "filePath": "lib/otp_recovery/command_worker.ex",
      "contentHash": "synthetic-blob-command-worker-v1",
      "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
      "span": {
        "startLine": 40,
        "startColumn": 3,
        "endLine": 66,
        "endColumn": 6
      },
      "matchStatus": "exact"
    },
    "changeKind": "body_modified"
  },
  "directCallers": [],
  "effectPaths": [
    {
      "kind": "may_effect",
      "target": "external_write",
      "provider": "synthetic_fixture",
      "steps": [
        {
          "sourceRef": {
            "repositoryId": "synthetic-otp-recovery",
            "revisionId": "synthetic-rev-001",
            "language": "elixir",
            "filePath": "lib/otp_recovery/command_worker.ex",
            "contentHash": "synthetic-blob-command-worker-v1",
            "symbolKey": "OtpRecovery.CommandWorker.handle_info/2",
            "span": {
              "startLine": 40,
              "startColumn": 3,
              "endLine": 66,
              "endColumn": 6
            },
            "matchStatus": "exact"
          },
          "kind": "calls"
        },
        {
          "sourceRef": {
            "repositoryId": "synthetic-otp-recovery",
            "revisionId": "synthetic-rev-001",
            "language": "elixir",
            "filePath": "lib/otp_recovery/command_worker.ex",
            "contentHash": "synthetic-blob-command-worker-v1",
            "symbolKey": "OtpRecovery.CommandWorker.recover/2",
            "span": {
              "startLine": 71,
              "startColumn": 3,
              "endLine": 99,
              "endColumn": 6
            },
            "matchStatus": "exact"
          },
          "kind": "may_effect"
        }
      ],
      "limitations": [
        "Not evidence that either call path executed"
      ]
    }
  ],
  "coverage": {
    "status": "partial",
    "reasons": [
      "static_flow_fixture_only"
    ]
  },
  "testLeads": [
    {
      "test": "OtpRecoveryTest crash recovery",
      "kind": "candidate"
    }
  ]
};
