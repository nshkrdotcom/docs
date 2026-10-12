type View = 'review'|'cinema'|'compare'|'topology'|'findings';
type InspectorTab = 'impact'|'evidence'|'graph';
type DiffMode = 'unified'|'split';
type BottomTab = 'investigation'|'tests'|'activity';
type FollowMode = 'causal'|'role'|'process'|'free';
type Modal = 'none'|'finding'|'provenance'|'capture'|'shortcuts'|'export';
type LineKind = 'context'|'add'|'remove'|'focus';
type Severity = 'critical'|'high'|'medium'|'low';
interface SourceLine { old?:number; next?:number; text:string; kind:LineKind; note?:string; }
interface SymbolItem { id:string; name:string; file:string; module:string; kind:string; change:string; badge:string; group:string; range:string; impact:string; lines:SourceLine[]; summary:string; }
interface TraceEvent {
  id:string; sessionId:string; nodeInstanceId:string; processInstanceId:string;
  logicalRoleId:string; localSequence:number; clockDomain:string;
  monotonicNs:string; wallTimeNs:string|null; eventType:string;
  sourceRef?: {repositoryId?:string;language?:string;contentHash?:string;matchStatus?:string;filePath:string;symbolKey:string;revisionId:string;span?:{startLine:number;startColumn?:number;endLine?:number;endColumn?:number}}|null;
  correlationId:string|null; messageId:string|null; payload:Record<string,unknown>|null;
  evidenceKind:string;captureStatus:string;captureProducer:string;notes?:string|null;
}
interface CaptureFixture {
  format:string;schemaVersion:string;synthetic:boolean;sessionId:string;
  codeVersions:Array<{nodeInstanceId:string;revisionId:string}>;
  clockAlignment:{status:string;note:string};
  capturePolicy:Record<string, unknown>;
  coverage:{status:string;notes:string[]};
  events:TraceEvent[];
  relations:Array<{fromEventId:string;toEventId:string;kind:string;basis:string;evidenceKind:string}>;
}
interface AlignmentFixture {
  synthetic:boolean;schemaVersion:string;runA:string;runB:string;
  alignmentPlan:Record<string,unknown>;
  anchors:Array<{label:string;runA:string;runB:string;basis:string}>;
  differences:Array<{kind:string;runAEvent:string|null;runBEvent:string;finding:string;qualifier:string}>;
  gaps:string[];
}
interface Finding { id:string;title:string;severity:Severity;status:string;claim:string;anchor:string;tags:string[];evidence:number;gaps:number;created:string; }
interface GraphNode {id:string;label:string;subtitle:string;type:string;x:number;y:number;status:string;detail:string;}
interface AppState {
 view:View; symbolId:string; inspectorTab:InspectorTab;diffMode:DiffMode;bottomTab:BottomTab;
 follow:FollowMode; run:'fail'|'pass'; eventIndex:number;playing:boolean;
 pinned:boolean;pinnedSymbolId:string;showUncertain:boolean;showStatic:boolean;showObserved:boolean;
 topologyNode:string; paletteOpen:boolean;paletteQuery:string;modal:Modal;
 sideCollapsed:boolean; navQuery:string; findingDraft:string; findingSeverity:Severity;
 toast:string;history:string[];historyPosition:number;
 selectedMilestone:number; captureTab:'event'|'state'|'causality';
 findings:Finding[];
}
