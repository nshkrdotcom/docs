import {
  NodeIncarnation,
  ProcessIncarnation,
  TraceEvent,
  ComparisonMilestone,
  SupervisionNode,
  Finding
} from './types';

export const nodeIncarnations: NodeIncarnation[] = [
  {
    id: 'node-a-boot-1',
    name: 'Node A [ingest@edge-01]',
    role: 'HTTP Ingress & Edge Routing',
    bootId: 'boot-2026-10-11-a',
    clockDomain: 'node-a-mono',
    color: '#38bdf8' // Cyan
  },
  {
    id: 'node-b-boot-1',
    name: 'Node B [engine@worker-04]',
    role: 'Saga Pipeline & Worker Tree',
    bootId: 'boot-2026-10-11-b',
    clockDomain: 'node-b-mono',
    color: '#a78bfa' // Violet
  },
  {
    id: 'node-c-boot-1',
    name: 'Node C [ledger@store-02]',
    role: 'PostgreSQL Journal & Audit Storage',
    bootId: 'boot-2026-10-11-c',
    clockDomain: 'node-c-mono',
    color: '#34d399' // Emerald
  }
];

export const processIncarnations: ProcessIncarnation[] = [
  {
    id: 'node-a-boot-1/ingress-pid1',
    nodeInstanceId: 'node-a-boot-1',
    pidRepr: '<0.142.0>',
    logicalRoleId: 'ingress',
    bornEventId: 'ev-01',
    reincarnationIndex: 1,
    color: '#38bdf8'
  },
  {
    id: 'node-b-boot-1/coord-pid1',
    nodeInstanceId: 'node-b-boot-1',
    pidRepr: '<0.184.0>',
    logicalRoleId: 'coordinator',
    bornEventId: 'ev-04',
    reincarnationIndex: 1,
    color: '#818cf8'
  },
  {
    id: 'node-b-boot-1/sup-pid1',
    nodeInstanceId: 'node-b-boot-1',
    pidRepr: '<0.190.0>',
    logicalRoleId: 'worker_supervisor',
    bornEventId: 'ev-05',
    reincarnationIndex: 1,
    color: '#c084fc'
  },
  {
    id: 'node-b-boot-1/worker-pid1',
    nodeInstanceId: 'node-b-boot-1',
    pidRepr: '<0.210.0>',
    logicalRoleId: 'worker-cmd-42',
    supervisorId: 'node-b-boot-1/sup-pid1',
    bornEventId: 'ev-06',
    diedEventId: 'ev-13',
    exitReason: ':killed (simulated BEAM fault)',
    reincarnationIndex: 1,
    color: '#f87171' // Coral/Red (Crashes)
  },
  {
    id: 'node-b-boot-1/worker-pid2',
    nodeInstanceId: 'node-b-boot-1',
    pidRepr: '<0.288.0>',
    logicalRoleId: 'worker-cmd-42',
    supervisorId: 'node-b-boot-1/sup-pid1',
    bornEventId: 'ev-16',
    reincarnationIndex: 2,
    color: '#2dd4bf' // Teal (Reincarnation)
  },
  {
    id: 'node-c-boot-1/journal-pid1',
    nodeInstanceId: 'node-c-boot-1',
    pidRepr: '<0.312.0>',
    logicalRoleId: 'journal',
    bornEventId: 'ev-07',
    reincarnationIndex: 1,
    color: '#34d399'
  },
  {
    id: 'node-c-boot-1/ledger-pid1',
    nodeInstanceId: 'node-c-boot-1',
    pidRepr: '<0.340.0>',
    logicalRoleId: 'ledger',
    bornEventId: 'ev-21',
    reincarnationIndex: 1,
    color: '#fbbf24'
  }
];

export const traceEvents: TraceEvent[] = [
  {
    id: 'ev-01',
    seq: 1,
    timeNs: 1000000,
    timeDisplay: 'T+1.00ms',
    nodeInstanceId: 'node-a-boot-1',
    processInstanceId: 'node-a-boot-1/ingress-pid1',
    logicalRoleId: 'ingress',
    eventType: 'command_accepted',
    title: 'Command Accepted',
    headline: 'Ingress accepts cmd-42 payload on Node A',
    correlationId: 'cmd-42',
    seqTraceToken: 'tok-42-root',
    causalPredecessors: [],
    causalSuccessors: ['ev-02', 'ev-03'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/ingest/ingress_controller.ex',
      symbolKey: 'Ingest.IngressController.submit/1',
      span: { startLine: 5, endLine: 18, focusLine: 6 }
    },
    stateObservation: {
      ownerPid: '<0.142.0>',
      logicalRole: 'ingress',
      phase: 'before_callback',
      completeness: 'metadata_only',
      fields: { intake_status: ":active", current_conn: 14 }
    },
    notes: 'Ingress intake receives raw JSON payload with amount 120,000 cents.'
  },
  {
    id: 'ev-02',
    seq: 2,
    timeNs: 1150000,
    timeDisplay: 'T+1.15ms',
    nodeInstanceId: 'node-a-boot-1',
    processInstanceId: 'node-a-boot-1/ingress-pid1',
    logicalRoleId: 'ingress',
    eventType: 'rate_limit_checked',
    title: 'Rate Limit Checked',
    headline: 'Account bucket updated in ETS table',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-01'],
    causalSuccessors: ['ev-03'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/ingest/rate_limiter.ex',
      symbolKey: 'Ingest.RateLimiter.check_rate/1',
      span: { startLine: 5, endLine: 10, focusLine: 6 }
    },
    notes: 'Account acct-test-99 consumed 1 token; balance remaining: 99.'
  },
  {
    id: 'ev-03',
    seq: 3,
    timeNs: 1220000,
    timeDisplay: 'T+1.22ms',
    nodeInstanceId: 'node-a-boot-1',
    processInstanceId: 'node-a-boot-1/ingress-pid1',
    logicalRoleId: 'ingress',
    eventType: 'validation_passed',
    title: 'Command Validated',
    headline: 'Pure schema check passes; positive monetary amount verified',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-02'],
    causalSuccessors: ['ev-04'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/ingest/command_validator.ex',
      symbolKey: 'Ingest.CommandValidator.validate/1',
      span: { startLine: 6, endLine: 14, focusLine: 7 }
    },
    notes: 'Constructed %Ingest.CommandValidator{id: "cmd-42", amount: 120000}.'
  },
  {
    id: 'ev-04',
    seq: 4,
    timeNs: 1350000,
    timeDisplay: 'T+1.35ms',
    nodeInstanceId: 'node-a-boot-1',
    processInstanceId: 'node-a-boot-1/ingress-pid1',
    logicalRoleId: 'ingress',
    eventType: 'message_sent',
    title: 'Cross-Node Dispatch Dispatched',
    headline: 'Node A transmits {:dispatch, cmd} to Coordinator on Node B',
    correlationId: 'cmd-42',
    seqTraceToken: 'tok-42-dist',
    causalPredecessors: ['ev-03'],
    causalSuccessors: ['ev-05'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/ingest/ingress_controller.ex',
      symbolKey: 'Ingest.IngressController.submit/1',
      span: { startLine: 10, endLine: 14, focusLine: 12 }
    },
    notes: 'Transmitted over Distributed Erlang channel with seq_trace token tok-42-dist.'
  },
  {
    id: 'ev-05',
    seq: 5,
    timeNs: 1580000,
    timeDisplay: 'T+1.58ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/coord-pid1',
    logicalRoleId: 'coordinator',
    eventType: 'message_received',
    title: 'Coordinator Intake',
    headline: 'Coordinator on Node B receives command message',
    correlationId: 'cmd-42',
    seqTraceToken: 'tok-42-dist',
    causalPredecessors: ['ev-04'],
    causalSuccessors: ['ev-06'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/coordinator.ex',
      symbolKey: 'Pipeline.Coordinator.handle_cast/2',
      span: { startLine: 14, endLine: 20, focusLine: 15 }
    },
    stateObservation: {
      ownerPid: '<0.184.0>',
      logicalRole: 'coordinator',
      phase: 'before_callback',
      completeness: 'full',
      fields: { active_workers: {} }
    },
    notes: 'Clock domain transition: Node A monotonic time -> Node B monotonic time (estimated offset +142µs).'
  },
  {
    id: 'ev-06',
    seq: 6,
    timeNs: 1720000,
    timeDisplay: 'T+1.72ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/sup-pid1',
    logicalRoleId: 'worker_supervisor',
    eventType: 'process_spawned',
    title: 'Spawn Worker Incarnation #1',
    headline: 'DynamicSupervisor spawns CommandWorker <0.210.0>',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-05'],
    causalSuccessors: ['ev-07'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/worker_supervisor.ex',
      symbolKey: 'Pipeline.WorkerSupervisor.start_worker/1',
      span: { startLine: 9, endLine: 12, focusLine: 11 }
    },
    notes: 'Child PID <0.210.0> linked to DynamicSupervisor <0.190.0>.'
  },
  {
    id: 'ev-07',
    seq: 7,
    timeNs: 1850000,
    timeDisplay: 'T+1.85ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'saga_step_initiated',
    title: 'Worker #1 Init & Message Delivered',
    headline: 'Worker <0.210.0> receives {:execute, cmd-42}',
    correlationId: 'cmd-42',
    seqTraceToken: 'msg-42',
    causalPredecessors: ['ev-06'],
    causalSuccessors: ['ev-08'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.handle_info/2 {:execute}',
      span: { startLine: 32, endLine: 37, focusLine: 33 }
    },
    stateObservation: {
      ownerPid: '<0.210.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'before_callback',
      completeness: 'full',
      fields: { status: ":init", retry_count: 0, command_id: 'cmd-42' }
    },
    mailboxState: {
      ownerPid: '<0.210.0>',
      queueDepth: 1,
      messages: [
        { id: 'm-1', msgType: '{:execute, %Command{}}', payloadPreview: 'cmd-42 $1200.00', senderPid: '<0.184.0>', status: 'active' }
      ]
    },
    notes: 'Worker #1 begins execution flow.'
  },
  {
    id: 'ev-08',
    seq: 8,
    timeNs: 2400000,
    timeDisplay: 'T+2.40ms',
    nodeInstanceId: 'node-c-boot-1',
    processInstanceId: 'node-c-boot-1/journal-pid1',
    logicalRoleId: 'journal',
    eventType: 'journal_write_attempted',
    title: 'Journal Record Pending Inserted',
    headline: 'SQL insert into CommandEntry on Node C marks status :pending',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-07'],
    causalSuccessors: ['ev-09'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/storage/journal.ex',
      symbolKey: 'Storage.Journal.record_pending/2',
      span: { startLine: 15, endLine: 18, focusLine: 16 }
    },
    notes: 'PostgreSQL row inserted: command_id="cmd-42", status="pending".'
  },
  {
    id: 'ev-09',
    seq: 9,
    timeNs: 2900000,
    timeDisplay: 'T+2.90ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'state_observed',
    title: 'Worker #1 State Snapshot',
    headline: 'State transitions to status: ":pending" prior to Gateway call',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-08'],
    causalSuccessors: ['ev-10'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.handle_info/2 {:execute}',
      span: { startLine: 35, endLine: 37, focusLine: 36 }
    },
    stateObservation: {
      ownerPid: '<0.210.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'after_callback',
      completeness: 'full',
      fields: { status: ":pending", retry_count: 0, command_id: 'cmd-42', in_flight_call: true },
      diffs: { status: { from: ":init", to: ":pending" } }
    },
    notes: 'GenServer private memory updated.'
  },
  {
    id: 'ev-10',
    seq: 10,
    timeNs: 3100000,
    timeDisplay: 'T+3.10ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'callback_enter',
    title: 'Dispatch Invocation',
    headline: 'Worker #1 invokes dispatch(cmd, state)',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-09'],
    causalSuccessors: ['ev-11'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.recover/2',
      span: { startLine: 39, endLine: 54, focusLine: 40 }
    },
    notes: 'Enters private dispatch clause.'
  },
  {
    id: 'ev-11',
    seq: 11,
    timeNs: 3450000,
    timeDisplay: 'T+3.45ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'effect_attempted',
    title: 'EFFECT FRONTIER: External HTTP Post Attempt #1',
    headline: 'Worker #1 initiates HTTP POST /v1/settle to External Gateway',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-10'],
    causalSuccessors: ['ev-12'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/gateway/external_client.ex',
      symbolKey: 'Gateway.ExternalClient.post/2',
      span: { startLine: 9, endLine: 18, focusLine: 11 }
    },
    effectRecord: {
      id: 'eff-01',
      operation: 'HTTP POST /v1/settle',
      target: 'api.gateway.internal',
      attemptNumber: 1,
      status: 'outcome_unknown',
      payloadDigest: 'sha256:7b49cf8a2...',
      hazardNote: 'Outbound TCP frame sent over wire. Durable outcome unconfirmed!'
    },
    notes: 'Outbound TCP network socket packet transmitted. External payment gateway received packet.'
  },
  {
    id: 'ev-12',
    seq: 12,
    timeNs: 4800000,
    timeDisplay: 'T+4.80ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'worker_fault_injected',
    title: 'CRASH SITE: Injected Fault Executed',
    headline: 'Process.exit(self(), :kill) abruptly terminates worker <0.210.0>!',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-11'],
    causalSuccessors: ['ev-13'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.recover/2',
      span: { startLine: 41, endLine: 45, focusLine: 43 }
    },
    notes: 'Simulated BEAM crash injected while HTTP request is in-flight on the wire!'
  },
  {
    id: 'ev-13',
    seq: 13,
    timeNs: 4920000,
    timeDisplay: 'T+4.92ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid1',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'process_exit',
    title: 'Process Exit: ":killed"',
    headline: 'Worker Incarnation #1 terminates abnormally with reason :killed',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-12'],
    causalSuccessors: ['ev-14'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.recover/2',
      span: { startLine: 43, endLine: 44, focusLine: 43 }
    },
    stateObservation: {
      ownerPid: '<0.210.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'crash',
      completeness: 'metadata_only',
      fields: { exit_reason: ":killed" },
      unrecordedGap: 'Intermediate socket return state between T+3.45ms and T+4.80ms was NOT captured'
    },
    notes: 'Abnormal termination signal propagates to parent supervisor.'
  },
  {
    id: 'ev-14',
    seq: 14,
    timeNs: 5100000,
    timeDisplay: 'T+5.10ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/sup-pid1',
    logicalRoleId: 'worker_supervisor',
    eventType: 'monitor_down_received',
    title: 'Supervisor Trap :DOWN',
    headline: 'WorkerSupervisor traps abnormal termination of child <0.210.0>',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-13'],
    causalSuccessors: ['ev-15'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/worker_supervisor.ex',
      symbolKey: 'Pipeline.WorkerSupervisor.init/1',
      span: { startLine: 16, endLine: 21, focusLine: 18 }
    },
    notes: 'Supervisor link monitor signal: {:EXIT, <0.210.0>, :killed}.'
  },
  {
    id: 'ev-15',
    seq: 15,
    timeNs: 5250000,
    timeDisplay: 'T+5.25ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/sup-pid1',
    logicalRoleId: 'worker_supervisor',
    eventType: 'supervisor_restart_decision',
    title: 'Supervisor Restart Decision',
    headline: 'Supervisor verifies restart intensity (1 of 5 consumed) and triggers restart',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-14'],
    causalSuccessors: ['ev-16'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/worker_supervisor.ex',
      symbolKey: 'Pipeline.WorkerSupervisor.init/1',
      span: { startLine: 17, endLine: 21, focusLine: 19 }
    },
    notes: 'Restart budget: max_restarts: 5 within 10s. Current: 1. Restart approved under :one_for_one.'
  },
  {
    id: 'ev-16',
    seq: 16,
    timeNs: 5600000,
    timeDisplay: 'T+5.60ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid2',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'process_spawned',
    title: 'Spawn Worker Incarnation #2',
    headline: 'Fresh process <0.288.0> spawned for logical role worker-cmd-42',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-15'],
    causalSuccessors: ['ev-17'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.init/1',
      span: { startLine: 12, endLine: 17, focusLine: 13 }
    },
    notes: 'CRITICAL OTP PROPERTY: Process state memory is NOT preserved across restarts! Fresh incarnation <0.288.0> starts with virgin heap.'
  },
  {
    id: 'ev-17',
    seq: 17,
    timeNs: 5850000,
    timeDisplay: 'T+5.85ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid2',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'reincarnation_init',
    title: 'Worker #2 Init Callback',
    headline: 'Worker <0.288.0> runs init/1 and returns {:continue, :evaluate_recovery}',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-16'],
    causalSuccessors: ['ev-18'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.init/1',
      span: { startLine: 13, endLine: 17, focusLine: 15 }
    },
    stateObservation: {
      ownerPid: '<0.288.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'init',
      completeness: 'full',
      fields: { status: ":init", retry_count: 0, command_id: 'cmd-42', in_flight_call: null }
    },
    notes: 'State reset: retry_count reset to 0; no knowledge of previous socket attempt.'
  },
  {
    id: 'ev-18',
    seq: 18,
    timeNs: 6400000,
    timeDisplay: 'T+6.40ms',
    nodeInstanceId: 'node-c-boot-1',
    processInstanceId: 'node-c-boot-1/journal-pid1',
    logicalRoleId: 'journal',
    eventType: 'journal_status_queried',
    title: 'Journal Status Queried',
    headline: 'Worker #2 queries Journal.status("cmd-42") on Node C -> returns :pending',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-17'],
    causalSuccessors: ['ev-19'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/storage/journal.ex',
      symbolKey: 'Storage.Journal.status/1',
      span: { startLine: 6, endLine: 13, focusLine: 10 }
    },
    notes: 'Journal status returned as :pending because commit/2 was never invoked prior to crash.'
  },
  {
    id: 'ev-19',
    seq: 19,
    timeNs: 7100000,
    timeDisplay: 'T+7.10ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid2',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'recovery_evaluated',
    title: 'PR #248 MODIFICATION: recover/2 Clause Invoked',
    headline: 'Worker #2 enters PR #248 recover/2 pending clause',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-18'],
    causalSuccessors: ['ev-20'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/pipeline/command_worker.ex',
      symbolKey: 'Pipeline.CommandWorker.recover/2',
      span: { startLine: 56, endLine: 70, focusLine: 63 }
    },
    stateObservation: {
      ownerPid: '<0.288.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'before_callback',
      completeness: 'full',
      fields: { status: ":pending", retry_count: 0, command_id: 'cmd-42' },
      diffs: { status: { from: ":init", to: ":pending" } }
    },
    notes: 'PR #248 modified this clause to immediately resubmit to Gateway.dispatch/1!'
  },
  {
    id: 'ev-20',
    seq: 20,
    timeNs: 7800000,
    timeDisplay: 'T+7.80ms',
    nodeInstanceId: 'node-b-boot-1',
    processInstanceId: 'node-b-boot-1/worker-pid2',
    logicalRoleId: 'worker-cmd-42',
    eventType: 'duplicate_effect_attempted',
    title: 'HAZARD: External HTTP Post Attempt #2 (DUPLICATE WRITE)',
    headline: 'Worker #2 sends SECOND HTTP POST /v1/settle for cmd-42 to External Gateway!',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-19'],
    causalSuccessors: ['ev-21'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/gateway/external_client.ex',
      symbolKey: 'Gateway.ExternalClient.post/2',
      span: { startLine: 9, endLine: 18, focusLine: 11 }
    },
    effectRecord: {
      id: 'eff-02',
      operation: 'HTTP POST /v1/settle',
      target: 'api.gateway.internal',
      attemptNumber: 2,
      status: 'attempted',
      payloadDigest: 'sha256:7b49cf8a2...',
      hazardNote: 'DUPLICATE WRITE HAZARD: Attempt #1 was never confirmed dead! Customer card may be charged twice!'
    },
    notes: 'EVIDENCE GAP: The capture protocol proves Attempt #1 occurred and Attempt #2 occurred, but lacks proof of whether Attempt #1 was applied at the gateway.'
  },
  {
    id: 'ev-21',
    seq: 21,
    timeNs: 8900000,
    timeDisplay: 'T+8.90ms',
    nodeInstanceId: 'node-c-boot-1',
    processInstanceId: 'node-c-boot-1/ledger-pid1',
    logicalRoleId: 'ledger',
    eventType: 'duplicate_warning_emitted',
    title: 'Ledger Writer Invariant Alert',
    headline: 'LedgerWriter detects concurrent debit authorization for reference cmd-42',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-20'],
    causalSuccessors: ['ev-22'],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/settlement/ledger_writer.ex',
      symbolKey: 'Settlement.LedgerWriter.post_entry/3',
      span: { startLine: 4, endLine: 12, focusLine: 10 }
    },
    notes: 'Ledger audit detects double authorization anomaly.'
  },
  {
    id: 'ev-22',
    seq: 22,
    timeNs: 9400000,
    timeDisplay: 'T+9.40ms',
    nodeInstanceId: 'node-c-boot-1',
    processInstanceId: 'node-c-boot-1/journal-pid1',
    logicalRoleId: 'journal',
    eventType: 'journal_write_committed',
    title: 'Late Journal Commit for Attempt #2',
    headline: 'Attempt #2 commits to SQL journal, masking the unconfirmed status of Attempt #1',
    correlationId: 'cmd-42',
    causalPredecessors: ['ev-21'],
    causalSuccessors: [],
    epistemicClass: 'observed',
    sourceRef: {
      repositoryId: 'saga-core',
      revisionId: 'head-rev-248',
      filePath: 'lib/storage/journal.ex',
      symbolKey: 'Storage.Journal.commit/2',
      span: { startLine: 20, endLine: 24, focusLine: 22 }
    },
    stateObservation: {
      ownerPid: '<0.288.0>',
      logicalRole: 'worker-cmd-42',
      phase: 'after_callback',
      completeness: 'full',
      fields: { status: ":committed", retry_count: 1, command_id: 'cmd-42' },
      diffs: { status: { from: ":pending", to: ":committed" } }
    },
    notes: 'Saga terminates with potential phantom double charge on payment gateway.'
  }
];

export const comparisonMilestones: ComparisonMilestone[] = [
  {
    index: 1,
    phaseName: '01 / Ingress Intake',
    symbol: 'Ingest.IngressController.submit/1',
    runAEventId: 'run-pass-001',
    runBEventId: 'ev-01',
    runAStatus: 'observed',
    runBStatus: 'observed',
    matchBasis: 'correlation_token',
    divergenceType: 'identical',
    notes: 'Both runs accept command cmd-42 with matching payload hash and seq_trace label.'
  },
  {
    index: 2,
    phaseName: '02 / Rate Limit & Validation',
    symbol: 'Ingest.CommandValidator.validate/1',
    runAEventId: 'run-pass-002',
    runBEventId: 'ev-03',
    runAStatus: 'observed',
    runBStatus: 'observed',
    matchBasis: 'logical_role_and_symbol',
    divergenceType: 'identical',
    notes: 'Pure schema verification is identical in both runs.'
  },
  {
    index: 3,
    phaseName: '03 / Journal Status Insert',
    symbol: 'Storage.Journal.record_pending/2',
    runAEventId: 'run-pass-003',
    runBEventId: 'ev-08',
    runAStatus: 'observed',
    runBStatus: 'observed',
    matchBasis: 'correlation_token',
    divergenceType: 'identical',
    notes: 'Both runs insert pending entry into PostgreSQL on Node C.'
  },
  {
    index: 4,
    phaseName: '04 / Gateway Dispatch Attempt #1',
    symbol: 'Gateway.ExternalClient.post/2',
    runAEventId: 'run-pass-004',
    runBEventId: 'ev-11',
    runAStatus: 'observed',
    runBStatus: 'observed',
    matchBasis: 'effect_frontier',
    divergenceType: 'identical',
    notes: 'Both runs dispatch HTTP POST /v1/settle to external payment gateway.'
  },
  {
    index: 5,
    phaseName: '05 / Fault Injection Point (DIVERGENCE)',
    symbol: 'Pipeline.CommandWorker.recover/2',
    runAEventId: 'run-pass-005',
    runBEventId: 'ev-12',
    runAStatus: 'observed',
    runBStatus: 'crash',
    matchBasis: 'logical_role_and_symbol',
    divergenceType: 'crash_injected',
    notes: 'EARLIEST SUPPORTED DIVERGENCE: Run A succeeds smoothly; Run B injects Process.exit(:kill) during socket wait!'
  },
  {
    index: 6,
    phaseName: '06 / Supervisor Reaction & Reincarnation',
    symbol: 'Pipeline.WorkerSupervisor.init/1',
    runAEventId: undefined,
    runBEventId: 'ev-16',
    runAStatus: 'missing',
    runBStatus: 'observed',
    matchBasis: 'logical_role_and_symbol',
    divergenceType: 'crash_injected',
    notes: 'Run A never restarts. Run B supervisor catches :DOWN and spawns Worker Incarnation #2 (<0.288.0>).'
  },
  {
    index: 7,
    phaseName: '07 / Post-Crash Recovery Evaluation',
    symbol: 'Pipeline.CommandWorker.recover/2',
    runAEventId: undefined,
    runBEventId: 'ev-19',
    runAStatus: 'missing',
    runBStatus: 'observed',
    matchBasis: 'logical_role_and_symbol',
    divergenceType: 'duplicate_attempt',
    notes: 'Under PR #248, Worker #2 evaluates :pending status in Journal and re-dispatches to Gateway.'
  },
  {
    index: 8,
    phaseName: '08 / Duplicate External Mutation Hazard',
    symbol: 'Gateway.ExternalClient.post/2',
    runAEventId: undefined,
    runBEventId: 'ev-20',
    runAStatus: 'missing',
    runBStatus: 'diverged',
    matchBasis: 'effect_frontier',
    divergenceType: 'duplicate_attempt',
    notes: 'CRITICAL CONCURRENCY BUG: Run B executes Attempt #2 without knowing if Attempt #1 succeeded!'
  }
];

export const initialSupervisionNodes: SupervisionNode[] = [
  {
    id: 'Core.Supervisor',
    name: 'Core.Supervisor',
    type: 'supervisor',
    strategy: ':one_for_one',
    maxRestarts: 10,
    maxSeconds: 60,
    activeChildren: 3,
    restartsObserved: 0,
    incarnationHistory: ['<0.105.0>'],
    blastRadius: ['Cluster.NodeMonitor', 'Cluster.RingManager', 'Core.RootSupervisor']
  },
  {
    id: 'Core.RootSupervisor',
    name: 'Core.RootSupervisor',
    type: 'supervisor',
    strategy: ':rest_for_one',
    maxRestarts: 10,
    maxSeconds: 60,
    activeChildren: 5,
    restartsObserved: 0,
    incarnationHistory: ['<0.112.0>'],
    blastRadius: ['Pipeline.WorkerSupervisor', 'Pipeline.Coordinator']
  },
  {
    id: 'Pipeline.WorkerSupervisor',
    name: 'Pipeline.WorkerSupervisor',
    type: 'dynamic_supervisor',
    strategy: ':one_for_one',
    maxRestarts: 5,
    maxSeconds: 10,
    activeChildren: 1,
    restartsObserved: 1,
    incarnationHistory: ['<0.190.0>'],
    blastRadius: ['Pipeline.CommandWorker']
  },
  {
    id: 'Pipeline.CommandWorker (role: worker-cmd-42)',
    name: 'CommandWorker [role: worker-cmd-42]',
    type: 'worker',
    activeChildren: 0,
    restartsObserved: 1,
    incarnationHistory: ['<0.210.0> (died :killed)', '<0.288.0> (reincarnation)'],
    blastRadius: []
  }
];

export const initialFindings: Finding[] = [
  {
    id: 'F-001',
    title: 'Non-idempotent gateway retry across worker restart boundary',
    severity: 'critical',
    status: 'active',
    claim: 'PR #248 modified recover/2 to resubmit pending commands to Gateway.ExternalClient.post/2 after worker restart. In the failing recording, two distinct HTTP POST attempts occurred for cmd-42. The outcome of the first attempt is UNRECORDED, creating a critical risk of duplicate external payment mutations.',
    anchors: [
      {
        filePath: 'lib/pipeline/command_worker.ex',
        symbol: 'Pipeline.CommandWorker.recover/2',
        lineRange: 'L57–70',
        eventId: 'ev-20'
      },
      {
        filePath: 'lib/gateway/external_client.ex',
        symbol: 'Gateway.ExternalClient.post/2',
        lineRange: 'L9–18',
        eventId: 'ev-11'
      }
    ],
    evidencePoints: [
      {
        kind: 'observed',
        summary: 'Attempt #1 recorded at T+3.45ms by Worker-1 (<0.210.0>).'
      },
      {
        kind: 'observed',
        summary: 'Worker-1 killed by simulated fault at T+4.80ms during active HTTP request.'
      },
      {
        kind: 'unknown_gap',
        summary: 'Capture lacks external gateway response or commit proof for Attempt #1.'
      },
      {
        kind: 'observed',
        summary: 'Supervisor spawned Worker-2 (<0.288.0>) which re-executed Attempt #2 at T+7.80ms.'
      }
    ],
    competingHypotheses: [
      'The external payment gateway might have idempotency keys enabled on its server side (unverified).',
      'The first HTTP TCP connection might have been dropped by the OS socket buffer before receipt.'
    ],
    unresolvedGaps: [
      'External gateway access logs are not instrumented in this capture session.',
      'No pre-dispatch idempotency reservation was inserted into Storage.Journal.'
    ],
    createdEpoch: 'rev-248-investigation-1'
  },
  {
    id: 'F-002',
    title: 'GenServer private state reset obscures previous in-flight dispatch attempt',
    severity: 'high',
    status: 'active',
    claim: 'When CommandWorker <0.210.0> was killed and restarted as <0.288.0>, state memory was reset. The new process had retry_count: 0 and in_flight_call: nil, concealing the fact that a socket dispatch had already been initiated.',
    anchors: [
      {
        filePath: 'lib/pipeline/command_worker.ex',
        symbol: 'Pipeline.CommandWorker.init/1',
        lineRange: 'L13–17',
        eventId: 'ev-17'
      }
    ],
    evidencePoints: [
      {
        kind: 'observed',
        summary: 'Worker <0.288.0> init/1 callback instantiated clean %CommandWorker{} struct.'
      },
      {
        kind: 'static_possible',
        summary: 'OTP supervision does not persist process heap across child restart boundaries.'
      }
    ],
    competingHypotheses: [
      'State was intended to be reloaded exclusively from the Journal database on Node C.'
    ],
    unresolvedGaps: [
      'Journal does not store an attempt_count column or socket lease lock.'
    ],
    createdEpoch: 'rev-248-investigation-1'
  },
  {
    id: 'F-003',
    title: 'Missing transactional outbox pattern prior to external socket transmission',
    severity: 'critical',
    status: 'active',
    claim: 'Storage.Journal.commit/2 is called AFTER Gateway.ExternalClient.post/2 returns. If the process crashes while the external request is in transit, the Journal remains :pending, directly misleading recovery into believing the command was never executed.',
    anchors: [
      {
        filePath: 'lib/storage/journal.ex',
        symbol: 'Storage.Journal.commit/2',
        lineRange: 'L20–24',
        eventId: 'ev-22'
      }
    ],
    evidencePoints: [
      {
        kind: 'observed',
        summary: 'Journal row remained status="pending" after Worker-1 crashed at T+4.80ms.'
      },
      {
        kind: 'observed',
        summary: 'Worker-2 inspected Journal.status("cmd-42") and branched to recover/2 because it was :pending.'
      }
    ],
    competingHypotheses: [
      'Developers assumed atomic two-phase commit without distributed coordinator.'
    ],
    unresolvedGaps: [
      'No two-phase commit or transactional outbox queue implemented in storage layer.'
    ],
    createdEpoch: 'rev-248-investigation-1'
  }
];
