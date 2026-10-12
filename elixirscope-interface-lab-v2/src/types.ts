export type FollowMode = 'role' | 'process' | 'causal' | 'function' | 'effect' | 'free' | 'pinned';
export type LensMode = 'cockpit' | 'cinema' | 'review' | 'compare' | 'supervision' | 'evidence';

export interface ClockDomain {
  id: string;
  nodeInstanceId: string;
  type: 'monotonic' | 'wall';
  driftEstNs: number;
  uncertaintyNs: number;
}

export interface NodeIncarnation {
  id: string;
  name: string;
  role: string;
  bootId: string;
  clockDomain: string;
  color: string;
}

export interface ProcessIncarnation {
  id: string;
  nodeInstanceId: string;
  pidRepr: string;
  logicalRoleId: string;
  supervisorId?: string;
  bornEventId: string;
  diedEventId?: string;
  exitReason?: string;
  reincarnationIndex: number;
  color: string;
}

export interface SourceSpan {
  startLine: number;
  endLine: number;
  focusLine?: number;
  startCol?: number;
  endCol?: number;
}

export interface SourceRef {
  repositoryId: string;
  revisionId: string;
  filePath: string;
  symbolKey: string;
  span: SourceSpan;
}

export interface InlineAnnotation {
  line: number;
  kind: 'effect' | 'crash' | 'snapshot' | 'seq_trace' | 'restart' | 'journal' | 'unconfirmed';
  label: string;
  detail: string;
  badge: string;
}

export interface CodeLine {
  num: number;
  oldNum?: number;
  text: string;
  diffStatus: 'context' | 'add' | 'remove' | 'modified' | 'focus';
  annotation?: InlineAnnotation;
}

export interface SymbolItem {
  id: string;
  symbolKey: string;
  name: string;
  module: string;
  kind: 'def' | 'defp' | 'callback' | 'macro' | 'schema';
  filePath: string;
  span: SourceSpan;
  callersCount: number;
  calleesCount: number;
  impactsEffect: boolean;
  isModified: boolean;
  docSummary: string;
}

export interface FileItem {
  path: string;
  module: string;
  subsystem: 'core' | 'ingest' | 'pipeline' | 'storage' | 'gateway' | 'settlement' | 'cluster' | 'telemetry' | 'test';
  loc: number;
  changeStatus: 'MODIFIED' | 'ADDED' | 'CALLER' | 'EFFECT_FRONTIER' | 'TEST_LEAD' | 'INFRA';
  diffSummary?: string;
  eventIds: string[];
  lines: CodeLine[];
  symbols: SymbolItem[];
  directCallers: string[];
  directCallees: string[];
}

export interface StateObservation {
  ownerPid: string;
  logicalRole: string;
  phase: 'before_callback' | 'after_callback' | 'init' | 'crash';
  completeness: 'full' | 'partial' | 'metadata_only';
  fields: Record<string, unknown>;
  diffs?: Record<string, { from: unknown; to: unknown }>;
  unrecordedGap?: string;
}

export interface MailboxState {
  ownerPid: string;
  queueDepth: number;
  messages: Array<{
    id: string;
    msgType: string;
    payloadPreview: string;
    senderPid: string;
    status: 'enqueued' | 'active' | 'deferred';
  }>;
}

export interface EffectRecord {
  id: string;
  operation: string;
  target: string;
  attemptNumber: number;
  status: 'attempted' | 'durably_confirmed' | 'outcome_unknown' | 'rejected';
  idempotencyKey?: string;
  payloadDigest: string;
  hazardNote?: string;
}

export interface TraceEvent {
  id: string;
  seq: number;
  timeNs: number;
  timeDisplay: string;
  nodeInstanceId: string;
  processInstanceId: string;
  logicalRoleId: string;
  eventType: 
    | 'command_accepted'
    | 'rate_limit_checked'
    | 'validation_passed'
    | 'message_sent'
    | 'message_received'
    | 'saga_step_initiated'
    | 'journal_write_attempted'
    | 'journal_write_committed'
    | 'callback_enter'
    | 'state_observed'
    | 'effect_attempted'
    | 'worker_fault_injected'
    | 'process_exit'
    | 'monitor_down_received'
    | 'supervisor_restart_decision'
    | 'process_spawned'
    | 'reincarnation_init'
    | 'recovery_evaluated'
    | 'journal_status_queried'
    | 'duplicate_effect_attempted'
    | 'duplicate_warning_emitted';
  title: string;
  headline: string;
  sourceRef: SourceRef;
  correlationId: string;
  seqTraceToken?: string;
  causalPredecessors: string[];
  causalSuccessors: string[];
  epistemicClass: 'observed' | 'static_possible' | 'reconstructed' | 'unknown_gap';
  stateObservation?: StateObservation;
  mailboxState?: MailboxState;
  effectRecord?: EffectRecord;
  notes?: string;
}

export interface ComparisonMilestone {
  index: number;
  phaseName: string;
  symbol: string;
  runAEventId?: string;
  runBEventId?: string;
  runAStatus: 'observed' | 'missing' | 'failed';
  runBStatus: 'observed' | 'diverged' | 'crash';
  matchBasis: 'correlation_token' | 'logical_role_and_symbol' | 'effect_frontier';
  divergenceType?: 'identical' | 'crash_injected' | 'duplicate_attempt' | 'missing_commit';
  notes: string;
}

export interface SupervisionNode {
  id: string;
  name: string;
  type: 'supervisor' | 'worker' | 'dynamic_supervisor';
  strategy?: ':one_for_one' | ':rest_for_one' | ':one_for_all';
  maxRestarts?: number;
  maxSeconds?: number;
  activeChildren: number;
  restartsObserved: number;
  incarnationHistory: string[];
  blastRadius: string[];
}

export interface Finding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'in_review' | 'resolved';
  claim: string;
  anchors: Array<{
    filePath: string;
    symbol: string;
    lineRange: string;
    eventId?: string;
  }>;
  evidencePoints: Array<{
    kind: 'observed' | 'static_possible' | 'unknown_gap';
    summary: string;
  }>;
  competingHypotheses: string[];
  unresolvedGaps: string[];
  createdEpoch: string;
}

export interface AppFocus {
  lens: LensMode;
  followMode: FollowMode;
  activeFileIndex: number;
  activeEventIndex: number;
  activeSymbolKey: string;
  pinnedFileIndex?: number;
  pinnedLine?: number;
  pinnedSymbolKey?: string;
  isPinnedSplit: boolean;
  selectedProcessId: string;
  selectedNodeId: string;
  epoch: number;
}
