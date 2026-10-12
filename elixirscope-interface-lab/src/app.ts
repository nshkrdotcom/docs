/* ElixirScope Interface Lab | standalone, browser-native TypeScript UI.
   No network requests, framework hydration, or runtime dependencies required. */
const app = document.getElementById('app') as HTMLElement;
const saved:Partial<AppState> = (()=>{try{return JSON.parse(localStorage.getItem('elixirscope-concept-state')||'{}')}catch{return {}}})();
const state:AppState = {
  view:'review',symbolId:'handle_info',inspectorTab:'impact',diffMode:'unified',bottomTab:'investigation',
  follow:'role',run:'fail',eventIndex:7,playing:false,pinned:true,pinnedSymbolId:'recover',
  showUncertain:true,showStatic:true,showObserved:true,topologyNode:'worker',
  paletteOpen:false,paletteQuery:'',modal:'none',sideCollapsed:false,navQuery:'',
  findingDraft:'',findingSeverity:'high',toast:'',history:['handle_info'],historyPosition:0,
  selectedMilestone:5,captureTab:'event',findings:Array.isArray(saved.findings)?saved.findings:initialFindings.map(x=>({...x}))
};
let playTimer:number|undefined;
let toastTimer:number|undefined;
const entity = (s:unknown)=>String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const iconPaths:Record<string,string>={
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  code:'<path d="m8 17-5-5 5-5m8 0 5 5-5 5m-2-14-4 18"/>',
  activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  compare:'<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="m6 9 2 2-2 2m12-4-2 2 2 2"/>',
  network:'<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5m0 0H5v5m7-5h7v5"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',down:'<path d="m6 9 6 6 6-6"/>',
  pin:'<path d="m16 3 5 5-3 1-4 4v4l-2 2-3-7-4-3 2-2h4l4-4zM4 20l6-6"/>',
  sliders:'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  alert:'<path d="M10.3 3.8 2 18.2A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.8L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',back:'<path d="M19 12H5m6 6-6-6 6-6"/>',
  play:'<path d="m8 5 12 7-12 7z"/>',pause:'<path d="M8 5v14m8-14v14"/>',
  skipback:'<path d="M19 20 9 12l10-8zM5 19V5"/>',skipforward:'<path d="m5 4 10 8-10 8zM19 5v14"/>',
  command:'<path d="M9 7V5a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>',
  spark:'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>',
  shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/>',
  dotcircle:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  book:'<path d="M4 19V5a2 2 0 0 1 2-2h14v17H6a2 2 0 0 0 0 4h14M8 8h8m-8 4h5"/>',
  terminal:'<path d="m4 7 5 5-5 5m8 0h8"/>',
  expand:'<path d="M8 3H3v5m0-5 7 7m6-7h5v5m0-5-7 7M3 16v5h5m-5 0 7-7m11 2v5h-5m5 0-7-7"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 .3l3-3a5 5 0 0 0-7-7l-1.8 1.8M14 11a5 5 0 0 0-7-.3l-3 3a5 5 0 0 0 7 7l1.8-1.8"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-7M3 4v5h5m4-2v6l4 2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bug:'<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 7V3M4 13h3m10 0h3M4 19l3-2m13 2-3-2M5 7l3 2m11-2-3 2"/>',
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 4h.01"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6m-5 4a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/>',
  codebranch:'<circle cx="6" cy="4" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="20" r="2"/><path d="M6 6v12m12-10a6 6 0 0 1-6 6H6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
};
function ico(name:string,size=16,cls=''):string{return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.grid}</svg>`;}
function act(action:string,value:string='',label:string='',cls:string='',ic:string=''):string{return `<button type="button" class="${cls}" data-action="${action}" data-value="${entity(value)}" ${label?`aria-label="${entity(label)}" title="${entity(label)}"`:''}>${ic?ico(ic):''}${label?`<span>${entity(label)}</span>`:''}</button>`;}
function pill(text:string,tone='neutral',extra=''):string{return `<span class="pill pill-${tone} ${extra}">${entity(text)}</span>`;}
function actionPill(iconName:string,text:string,action:string,value='',cls=''):string{return `<button class="action-pill ${cls}" data-action="${action}" data-value="${entity(value)}">${ico(iconName,14)}<span>${entity(text)}</span></button>`;}
function sparkline(vals:number[],stroke='var(--mint)',width=90,height=24):string{let d=vals.map((v,i)=>`${i?'L':'M'}${i/(vals.length-1)*width},${height-2-v*(height-4)}`).join(' ');return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function getSymbol(id=state.symbolId):SymbolItem{return symbols.find(s=>s.id===id)||symbols[0];}
function currentCapture():CaptureFixture{return state.run==='fail'?captureFail:capturePass;}
function currentEvent():TraceEvent{return currentCapture().events[Math.min(state.eventIndex,currentCapture().events.length-1)];}
function eventTone(e:TraceEvent):string{if(e.eventType==='process_exit')return 'coral';if(e.eventType==='effect_attempted')return 'amber';if(e.eventType==='process_spawned')return 'violet';if(e.eventType==='state_observed')return 'blue';if(e.eventType==='effect_result_observed'||e.eventType==='callback_exit')return 'mint';return 'cyan';}
function eventShort(e:TraceEvent):string{return eventTitles[e.eventType]||e.eventType.replace(/_/g,' ');}
function eventDescriptor(e:TraceEvent):string{const p=e.payload;if(e.eventType==='effect_attempted')return `Attempt #${p?.attempt||'?'} · outcome not observed`;if(e.eventType==='process_exit')return `Reason: ${p?.reason||'unknown'}`;if(e.eventType==='journal_write_observed')return `Status: ${p?.status||'unknown'}`;if(e.eventType==='state_observed')return `State: ${p?.status||'unknown'} · partial`;if(e.eventType==='process_spawned')return e.processInstanceId.split('/').pop()||'';return e.logicalRoleId.replace(/-/g,' ');}
function eventNumber(e:TraceEvent):string{return e.id.split('-').slice(-1)[0];}
function tinyDataLabel():string{return `<span class="data-watermark">${ico('shield',12)} SYNTHETIC FIXTURE</span>`;}
function syntax(code:string):string{
  const re=/(#[^\n]*|"(?:\\.|[^"\\])*"|\b(?:defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|@impl|test|assert)\b|@[a-z_]+|:[a-z][\w!?]*|\b[A-Z][A-Za-z0-9_.]*\b|\b\d+\b|\b[a-z][a-z0-9_!?]*(?=\())/g;
  let result='',last=0,m:RegExpExecArray|null;
  while((m=re.exec(code))!==null){result+=entity(code.slice(last,m.index));const token=m[0];let kind='fn';if(token.startsWith('#'))kind='comment';else if(token.startsWith('"'))kind='string';else if(token.startsWith(':'))kind='atom';else if(token.startsWith('@'))kind='attr';else if(/^\d+$/.test(token))kind='number';else if(/^[A-Z]/.test(token))kind='module';else if(/^(defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|test|assert)$/.test(token))kind='keyword';result+=`<span class="tok-${kind}">${entity(token)}</span>`;last=m.index+token.length;}
  return result+entity(code.slice(last));
}
function renderRail():string{
 const items:Array<[View,string,string]>= [['review','code','Review'],['cinema','activity','Cinema'],['compare','compare','Compare'],['topology','network','Topology'],['findings','file','Findings']];
 return `<nav class="app-rail" aria-label="Primary navigation"><div class="rail-brand" title="ElixirScope">${logoMark()}</div><div class="rail-links">${items.map(([view,ic,label])=>`<button class="rail-button ${state.view===view?'is-active':''}" data-action="view" data-value="${view}" aria-label="${label}" title="${label}">${ico(ic,20)}<span class="rail-title">${label}</span>${view==='findings'?`<span class="rail-dot"></span>`:''}</button>`).join('')}</div><div class="rail-footer"><button class="rail-button" data-action="modal" data-value="shortcuts" title="Keyboard shortcuts">${ico('command',19)}</button><button class="rail-button" data-action="export" title="Export investigation">${ico('download',19)}</button><span class="rail-avatar" title="Local workspace">KW</span></div></nav>`;
}
function logoMark():string{return `<svg viewBox="0 0 36 36" class="logo-mark" aria-hidden="true"><path d="M18 4 31 11.5v13L18 32 5 24.5v-13L18 4Z" fill="none" stroke="currentColor" stroke-width="1.65"/><path d="M11 15.5 18 11l7 4.5M11 20.5l7 4.5 7-4.5M18 11v14" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2.5" fill="currentColor"/></svg>`;}
function renderTopbar():string{
 return `<header class="topbar"><div class="wordmark">elixir<span>scope</span><span class="brand-beta">LAB</span></div><div class="topbar-divider"></div><button class="repo-switch" data-action="modal" data-value="capture">${ico('layers',15)}<span class="repo-name">otp-recovery</span>${ico('down',13)}<span class="repo-version">synthetic-rev-001</span></button><div class="topbar-fill"></div><button class="global-command" data-action="palette">${ico('search',15)}<span>Search symbols, traces, actions...</span><kbd>⌘ K</kbd></button><div class="topbar-fill"></div><div class="connection"><span class="live-dot"></span><span>LOCAL LAB</span></div><button class="top-icon" data-action="modal" data-value="shortcuts" title="Keyboard shortcuts">${ico('help',17)}</button><button class="top-icon" data-action="export" title="Export investigation">${ico('download',17)}</button><div class="top-avatar">KW</div></header>`;
}
function renderShell():string{
 let screen=state.view==='review'?renderReview():state.view==='cinema'?renderCinema():state.view==='compare'?renderCompare():state.view==='topology'?renderTopology():renderFindings();
 return `${renderTopbar()}<div class="app-body">${renderRail()}<main class="screen-root" id="screen-root">${screen}</main></div>${state.paletteOpen?renderPalette():''}${state.modal!=='none'?renderModal():''}${state.toast?`<div role="status" class="toast">${ico('checkcircle',16)}${entity(state.toast)}</div>`:''}`;
}
function heading(eyebrow:string,title:string,sub:string,actions:string):string{return `<div class="view-head"><div class="headline"><div class="eyebrow">${entity(eyebrow)}</div><div class="headline-row"><h1>${entity(title)}</h1></div><p>${entity(sub)}</p></div><div class="view-head-actions">${actions}</div></div>`;}
function sectionTitle(name:string,extra=''):string{return `<div class="section-title"><span>${name}</span>${extra}</div>`;}
function tabButton(name:string,label:string,selected:boolean,action:string):string{return `<button class="small-tab ${selected?'active':''}" data-action="${action}" data-value="${name}">${label}</button>`;}
function renderReview():string{
 const actions=`${pill('PR #248','outline')}${pill('4 modified symbols','neutral')}${actionPill('activity','Open recording','view','cinema','accent-outline')}${actionPill('plus','New finding','modal','finding','btn-primary')}`;
 return `<div class="review-page">${heading('CODEBASE / SEMANTIC REVIEW','Recovery after worker restart','main  ↔  fix/recovery  ·  Investigate possible external effects across an OTP restart boundary',actions)}<div class="review-grid"><aside class="pane navigator-pane">${renderNavigator()}</aside><section class="pane source-pane">${renderSource()}</section><aside class="pane insight-pane">${renderInspector()}</aside></div>${renderBottomDock()}</div>`;
}
function renderNavigator():string{
 const changed=symbols.filter(s=>s.group==='changed'),related=symbols.filter(s=>s.group==='related');
 return `<div class="pane-top"><div class="pane-label">${ico('codebranch',14)} CHANGE NAVIGATOR</div><button class="bare-icon" data-action="modal" data-value="capture" title="Revision and index context">${ico('sliders',15)}</button></div><div class="nav-search">${ico('search',14)}<input id="symbol-search" placeholder="Filter symbols..." autocomplete="off" aria-label="Filter symbols" value="${entity(state.navQuery)}" /><span class="keyhint">/</span></div><div class="navigator-scroll">${sectionTitle('CHANGED DEFINITIONS',`<span class="count-label">04</span>`)}${changed.map(renderSymbolRow).join('')}${sectionTitle('RELEVANT NEIGHBORHOOD',`<span class="count-label">02</span>`)}${related.map(renderSymbolRow).join('')}<div class="nav-subsection"><div class="tiny-label">ANALYSIS SCOPE</div><div class="scope-line">${ico('dotcircle',13)} Radius 2  <span>·</span>  Bounded neighborhood</div><div class="scope-line">${ico('shield',13)} Static edges  <span>·</span>  Partial coverage</div></div></div><div class="navigator-footer"><div class="nav-footer-top"><span class="small-ring"></span> INDEX READY <span class="muted">/ fixture</span></div><div class="progress-track"><span style="width:83%"></span></div><div class="nav-footer-meta"><span>Symbol graph</span><span>sample view</span></div></div>`;
}
function renderSymbolRow(s:SymbolItem):string{
 const tone=s.badge==='M'?'violet':s.badge==='T'?'mint':'blue';
 return `<button class="symbol-row ${state.symbolId===s.id?'selected':''}" data-action="symbol" data-value="${s.id}" data-search="${entity((s.name+' '+s.module+' '+s.file).toLowerCase())}"><div class="symbol-badge badge-${tone}">${entity(s.badge)}</div><div class="symbol-main"><div class="symbol-title">${entity(s.name)}<span class="symbol-impact">${entity(s.impact)}</span></div><div class="symbol-sub">${entity(s.module)} <span class="middot">·</span> ${entity(s.range)}</div></div>${ico('chevron',13,'subdued')}</button>`;
}
function sourceRows(lines:SourceLine[]):string{return lines.map((l,i)=>`<div class="source-row line-${l.kind} ${l.note?'line-noted':''}" data-action="${l.note?'source-note':'noop'}" data-value="${l.note||''}"><span class="ln">${l.old??''}</span><span class="ln">${l.next??''}</span><span class="line-indicator">${l.kind==='add'?'+':l.kind==='remove'?'−':l.kind==='focus'?'◆':''}</span><code>${l.text?syntax(l.text):' '}</code>${l.note?`<span class="inline-marker ${l.note==='effect'?'marker-amber':'marker-blue'}">${l.note==='effect'?'E1':'↳'}</span>`:''}</div>`).join('');}
function splitRows(lines:SourceLine[]):string{
 const old=lines.filter(x=>x.old!==undefined),next=lines.filter(x=>x.next!==undefined);
 return `<div class="split-editor"><div class="split-half"><div class="half-caption">BASE <span>main</span></div>${old.map(l=>`<div class="split-line line-${l.kind}"><span>${l.old}</span><code>${l.text?syntax(l.text):' '}</code></div>`).join('')}</div><div class="split-half"><div class="half-caption">HEAD <span>fix/recovery</span></div>${next.map(l=>`<div class="split-line line-${l.kind}"><span>${l.next}</span><code>${l.text?syntax(l.text):' '}</code></div>`).join('')}</div></div>`;
}
function renderSource():string{
 const s=getSymbol(), pinned=getSymbol(state.pinnedSymbolId);
 return `<div class="source-header"><div class="source-tabs"><span class="file-tab active">${ico('file',14)} ${entity(s.file.split('/').pop()||'source')}<span class="tab-mod">M</span></span><span class="file-tab inactive" data-action="symbol" data-value="test">${ico('file',13)} recovery_test.exs</span></div><div class="source-actions">${actionPill('pin',state.pinned?'Pinned baseline':'Pin baseline','pin','',state.pinned?'active':'')}${act('modal','capture','Source metadata','bare-icon','more')}</div></div><div class="source-subheader"><div class="path-text">${ico('code',13)} ${entity(s.file)} <span class="sep">/</span> <strong>${entity(s.name)}</strong></div><div class="sub-actions">${pill('ELIXIR','outline')}${pill('ILLUSTRATIVE SOURCE','ghost')}</div></div><div class="semantic-strip"><div class="semantic-badge">${ico('dotcircle',15)}</div><div><div class="semantic-name">${entity(s.module)}.<strong>${entity(s.name)}</strong></div><div class="semantic-sub">${entity(s.summary)}</div></div><button class="square-button" data-action="modal" data-value="provenance" title="Why this change matters">${ico('info',15)}</button></div><div class="editor-modebar"><div class="toggle-pair">${tabButton('unified','Unified',state.diffMode==='unified','diff')}${tabButton('split','Split',state.diffMode==='split','diff')}</div><span class="editor-label">${ico('codebranch',13)} main...fix/recovery</span><span class="editor-fill"></span><span class="editor-label">${s.lines.filter(l=>l.kind==='add').length} additions</span><span class="editor-label text-negative">${s.lines.filter(l=>l.kind==='remove').length} deletions</span></div><div class="editor-content">${state.diffMode==='split'?splitRows(s.lines):sourceRows(s.lines)}<div class="editor-fade"></div></div>${state.pinned?`<div class="pinned-source"><div class="pinned-header">${ico('pin',12)} PINNED REFERENCE <span class="pinned-rev">main@e71c</span><span class="spacer"></span><button class="inline-link" data-action="symbol" data-value="${pinned.id}">${entity(pinned.module)}.${entity(pinned.name)}</button><button class="bare-icon" data-action="pin" title="Unpin reference">${ico('close',13)}</button></div><div class="pin-code"><span class="line-number">75</span><code>${syntax(pinned.lines.find(l=>l.kind==='remove')?.text||'    :pending -> {:noreply, state}')}</code><span class="pinned-badge">BASE</span></div></div>`:`<button class="add-pin" data-action="pin">${ico('pin',13)} Pin this source as reference for later selections</button>`}<div class="source-status"><span>${ico('shield',12)} source correspondences illustrative</span><span>UTF-8 <i></i> Elixir <i></i> ${entity(s.range)}</span></div>`;
}
function renderInspector():string{
 const tabs=`<div class="inspector-tabstrip">${tabButton('impact','Impact',state.inspectorTab==='impact','inspector')}${tabButton('evidence','Evidence',state.inspectorTab==='evidence','inspector')}${tabButton('graph','Graph',state.inspectorTab==='graph','inspector')}</div>`;
 return `<div class="inspector-top"><div class="pane-label">${ico('spark',14)} CONTEXT INTELLIGENCE</div><button class="bare-icon" data-action="modal" data-value="provenance" title="Explain confidence and provenance">${ico('info',16)}</button></div>${tabs}<div class="inspector-body">${state.inspectorTab==='impact'?renderImpact():state.inspectorTab==='evidence'?renderEvidence():renderMiniGraph()}</div><div class="inspector-footer">${actionPill('plus','Create finding','modal','finding','btn-primary fill')}${actionPill('activity','Cinema','view','cinema','icon-onlyish')}</div>`;
}
function renderImpact():string{
 const s=getSymbol();
 return `<div class="insight-feature"><div class="insight-kicker">${ico('alert',13)} REVIEW SIGNAL <span>·</span> STATIC + RECORDED</div><div class="insight-heading">Possible repeat write after restart</div><p>Recovery can revisit a pending command. The failing recording contains a <em>second attempted</em> external write.</p><div class="insight-tags">${pill('Needs investigation','amber')}${pill('Not confirmed duplicate','outline')}</div></div><div class="inspector-block">${sectionTitle('SOURCE → EFFECT PATH',`<button class="subtle-link" data-action="modal" data-value="provenance">Why this path ${ico('arrow',11)}</button>`)}<div class="path-list"><button class="path-step" data-action="symbol" data-value="handle_info"><span class="path-node node-violet">01</span><div><strong>handle_info/2</strong><small>Callback · selected change</small></div>${pill('STATIC','ghost')}</button><button class="path-step" data-action="symbol" data-value="recover"><span class="path-node node-violet">02</span><div><strong>recover/2</strong><small>Pending branch</small></div></button><button class="path-step" data-action="symbol" data-value="gateway"><span class="path-node node-amber">03</span><div><strong>Gateway.dispatch/1</strong><small>Possible external I/O</small></div>${ico('arrow',13)}</button></div><div class="path-note">${ico('info',12)} Static path ≠ observed invocation</div></div><div class="inspector-block effect-block">${sectionTitle('OBSERVED EFFECT ATTEMPTS',pill('2 EVENTS','amber'))}<div class="effect-grid"><button class="effect-row" data-action="event" data-value="5"><span class="effect-mark"></span><div><strong>Attempt 01</strong><small>worker-pid1</small></div><span class="status-unknown">OUTCOME ?</span></button><button class="effect-row" data-action="event" data-value="10"><span class="effect-mark"></span><div><strong>Attempt 02</strong><small>worker-pid2</small></div><span class="status-unknown">OUTCOME ?</span></button></div></div><div class="coverage-card"><div class="coverage-title">${ico('shield',15)} Evidence boundary</div><p>External outcomes are <strong>not observed</strong>. Two attempts do not prove two committed writes.</p><button data-action="inspector" data-value="evidence">Inspect coverage ${ico('arrow',12)}</button></div><div class="inspector-block compact-block"><div class="tiny-label">CURRENT SYMBOL</div><div class="focus-identity">${entity(s.module)}<span>.</span>${entity(s.name)}</div><div class="focus-meta">${entity(s.range)} · exact source mockup</div></div>`;
}
function renderEvidence():string{
 return `<div class="evidence-intro"><div class="evidence-score">03 <span>evidence classes</span></div><p>Each assertion keeps its own provenance. There is no flattened confidence percentage.</p></div><div class="evidence-list"><button class="evidence-item" data-action="modal" data-value="provenance"><span class="ev-icon observed">${ico('eye',15)}</span><div><div class="ev-head">Observed <span>CAPTURE</span></div><strong>Two effect attempts</strong><small>Run-fail · events 004, 009</small></div>${ico('chevron',13)}</button><button class="evidence-item" data-action="symbol" data-value="recover"><span class="ev-icon candidate">${ico('code',15)}</span><div><div class="ev-head">Static possible <span>ANALYSIS</span></div><strong>Path to external write</strong><small>Normalized synthetic review context</small></div>${ico('chevron',13)}</button><button class="evidence-item" data-action="event" data-value="6"><span class="ev-icon partial">${ico('layers',15)}</span><div><div class="ev-head">Partial observation <span>STATE</span></div><strong>Worker state: executing</strong><small>One point-in-time snapshot</small></div>${ico('chevron',13)}</button><div class="evidence-gap"><div>${ico('alert',14)} NOT CAPTURED</div><p>External durable outcome, complete state transitions and global cross-node event order.</p></div><button class="evidence-item" data-action="symbol" data-value="test"><span class="ev-icon candidate">${ico('bug',15)}</span><div><div class="ev-head">Test lead <span>CANDIDATE</span></div><strong>OtpRecoveryTest</strong><small>Reference is not proof of coverage</small></div>${ico('chevron',13)}</button></div>`;
}
function renderMiniGraph():string{
 return `<div class="mini-graph-intro">Bounded neighborhood <span>·</span> radius 2</div><div class="mini-graph-canvas"><svg viewBox="0 0 310 236" role="img" aria-label="Static possible path from command callback through recovery to gateway"><path d="M155 46V82 M155 117v35 M155 184v19" stroke="#707a95" stroke-width="1.5" stroke-dasharray="4 5" fill="none"/><circle cx="155" cy="47" r="3" fill="#9b8dff"/><circle cx="155" cy="116" r="3" fill="#9b8dff"/><circle cx="155" cy="185" r="3" fill="#ecae6d"/></svg><button class="mini-graph-node g1" data-action="symbol" data-value="handle_info"><span>CALLBACK</span> handle_info/2</button><button class="mini-graph-node g2" data-action="symbol" data-value="recover"><span>RECOVERY</span> recover/2</button><button class="mini-graph-node g3" data-action="symbol" data-value="gateway"><span>EFFECT</span> Gateway.dispatch/1</button><div class="mini-graph-caption">Dashed edges = static possibility</div></div><div class="inspector-block">${sectionTitle('RELATION COVERAGE')}<div class="property-row"><span>Provider</span><strong>Synthetic adapter</strong></div><div class="property-row"><span>Radius</span><strong>2 hops</strong></div><div class="property-row"><span>Evidence</span>${pill('STATIC','violet')}</div><div class="property-row"><span>Execution implied</span><strong class="text-negative">No</strong></div></div>${actionPill('network','Open system topology','view','topology','wide-outline')}`;
}
function renderBottomDock():string{
 return `<section class="bottom-dock"><div class="dock-tabs">${tabButton('investigation',`${ico('codebranch',14)} INVESTIGATION TRAIL <span class="tab-counter">04</span>`,state.bottomTab==='investigation','bottom')}${tabButton('tests',`${ico('bug',14)} TEST LEADS <span class="tab-counter">01</span>`,state.bottomTab==='tests','bottom')}${tabButton('activity',`${ico('history',14)} HISTORY <span class="tab-counter">${String(state.history.length).padStart(2,'0')}</span>`,state.bottomTab==='activity','bottom')}<span class="spacer"></span>${pill('SCOPE · cmd-42','outline')}<button class="bare-icon dock-expand" data-action="view" data-value="findings" title="Open findings">${ico('expand',14)}</button></div><div class="dock-content">${state.bottomTab==='investigation'?renderInvestigationTrail():state.bottomTab==='tests'?renderTestLeads():renderHistory()}</div></section>`;
}
function renderInvestigationTrail():string{
 const entries=[['1','Changed callback','handle_info/2','source','handle_info'],['2','Possible write path','recover → Gateway','static','recover'],['3','Observed process exit','worker-pid1','observed','7'],['4','Observed second attempt','worker-pid2 · outcome unknown','unknown','10']];
 return `<div class="investigation-trail"><div class="trail-context"><span class="context-vertical">ACTIVE QUESTION</span><strong>Could a pending command cause an external write to repeat after restart?</strong><p>Follow the supported evidence. Unknowns remain visible.</p></div><div class="trail-steps">${entries.map(([n,title,sub,kind,id],idx)=>`<button class="trail-item trail-${kind}" data-action="${idx<2?'symbol':'event'}" data-value="${id}"><span class="trail-index">${n}</span><span class="trail-text"><strong>${title}</strong><small>${entity(sub)}</small></span>${ico('chevron',13)}</button>`).join('')}</div></div>`;
}
function renderTestLeads():string{return `<div class="test-table"><div class="test-row test-head"><span>TEST OR CAPTURE</span><span>BASIS</span><span>STATUS</span><span>ACTION</span></div><div class="test-row"><span><strong>OtpRecoveryTest / crash recovery</strong><small>test/otp_recovery_test.exs</small></span><span>Static candidate</span>${pill('NOT CONFIRMED','amber')}<button data-action="symbol" data-value="test">Open source ${ico('arrow',12)}</button></div><div class="test-row"><span><strong>Recovery failing recording</strong><small>run-fail · cmd-42</small></span><span>Synthetic observed fixture</span>${pill('PARTIAL','blue')}<button data-action="view" data-value="cinema">Open cinema ${ico('arrow',12)}</button></div></div>`;}
function renderHistory():string{return `<div class="history-strip">${state.history.map((id,i)=>`<button class="history-token ${i===state.historyPosition?'current':''}" data-action="history" data-value="${i}"><span>${String(i+1).padStart(2,'0')}</span> ${entity(getSymbol(id).module)}.${entity(getSymbol(id).name)}</button>`).join('')}</div>`;}
function renderCinema():string{
 const capture=currentCapture();
 const ev=currentEvent();
 const actions=`<div class="segmented-group">${tabButton('fail','FAILING RUN',state.run==='fail','run')}${tabButton('pass','PASSING RUN',state.run==='pass','run')}</div>${pill('CAPTURE PARTIAL','amber')}${actionPill('compare','Compare runs','view','compare','accent-outline')}`;
 return `<div class="cinema-page">${heading('EXECUTION / SOURCE-CORRELATED CINEMA','Inside the recovery sequence',`cmd-42  ·  ${capture.events.length} recorded events  ·  3 node incarnations  ·  offline fixture`,actions)}${renderPlayer(capture,ev)}${renderScore(capture)}<div class="cinema-workarea"><section class="pane cinema-source">${renderSourceFollower(ev)}</section><section class="pane cinema-event-panel">${renderEventInspector(ev)}</section></div></div>`;
}
function renderPlayer(capture:CaptureFixture,ev:TraceEvent):string{
 return `<div class="player-bar"><div class="player-controls"><button class="player-round ${state.playing?'playing':''}" data-action="play" title="${state.playing?'Pause':'Play'}">${ico(state.playing?'pause':'play',16)}</button><button class="player-step" data-action="step" data-value="-1" title="Previous eligible event">${ico('skipback',15)}</button><button class="player-step" data-action="step" data-value="1" title="Next eligible event">${ico('skipforward',15)}</button><div class="player-index">${String(state.eventIndex+1).padStart(2,'0')}<span> / ${String(capture.events.length).padStart(2,'0')}</span></div></div><div class="scrubber-wrap"><input id="scrubber" class="scrubber" type="range" min="0" max="${capture.events.length-1}" value="${state.eventIndex}" aria-label="Selected fixture event index" style="--progress:${(state.eventIndex/(capture.events.length-1)*100).toFixed(2)}%"/><div class="scrubber-under"><span>START</span><span>${entity(eventShort(ev))} · ${entity(eventNumber(ev))}</span><span>END</span></div></div><div class="follow-mode"><span>FOLLOW</span><div class="mode-select">${(['causal','role','process','free'] as FollowMode[]).map(mode=>`<button data-action="follow" data-value="${mode}" class="${state.follow===mode?'active':''}">${mode}</button>`).join('')}</div></div></div>`;
}
function traceLane(e:TraceEvent):number{
 if(e.nodeInstanceId==='node-a-boot-1')return 0;
 if(e.nodeInstanceId==='node-c-boot-1')return 3;
 if(e.processInstanceId.includes('pid2'))return 2;
 return 1;
}
function traceCoordinates(capture:CaptureFixture):Map<string,{x:number;y:number}>{
 let positions=new Map<string,{x:number;y:number}>();
 capture.events.forEach((e,i)=>positions.set(e.id,{x:57+i*(1000/Math.max(1,capture.events.length-1)),y:47+traceLane(e)*50}));
 return positions;
}
function renderScore(capture:CaptureFixture):string{
 const coords=traceCoordinates(capture),sel=currentEvent();
 const yRows=[47,97,147,197];
 const grid=[...Array(13)].map((_,i)=>`<line x1="${56+i*83.35}" x2="${56+i*83.35}" y1="19" y2="228" class="score-gridline"/>`).join('');
 const rows=yRows.map((y,i)=>`<rect x="0" y="${y-20}" width="1110" height="42" rx="4" class="score-lane-bg ${i%2?'alternating':''}"/><line x1="0" x2="1110" y1="${y}" y2="${y}" class="score-lane-axis"/>`).join('');
 const arrows=capture.relations.map(r=>{const a=coords.get(r.fromEventId),b=coords.get(r.toEventId);if(!a||!b)return '';return `<path d="M${a.x} ${a.y} C${a.x+34} ${a.y},${b.x-30} ${b.y},${b.x} ${b.y}" class="score-causal-arrow" marker-end="url(#arrowhead)"/><circle cx="${(a.x+b.x)/2}" cy="${(a.y+b.y)/2}" r="2.2" fill="#64dfc0" opacity=".8"/>`}).join('');
 const markers=capture.events.map((e,i)=>{const {x,y}=coords.get(e.id)!;const tone=eventTone(e);const selected=e.id===sel.id;const outer=selected?`<circle cx="${x}" cy="${y}" r="16" class="score-glow score-${tone}"/>`:'';
 let symbol=e.eventType==='process_exit'?`<path d="M${x-7} ${y-7}l14 14m0-14-14 14" stroke-width="2.4"/>`:e.eventType==='effect_attempted'?`<path d="M${x} ${y-8}l8 8-8 8-8-8z"/>`:e.eventType==='process_spawned'?`<circle cx="${x}" cy="${y}" r="7"/><path d="M${x-3} ${y}h6m-3-3v6"/>`:`<circle cx="${x}" cy="${y}" r="${selected?7:5.4}"/>`;
 return `<g class="score-point ${selected?'selected':''} score-tone-${tone}" data-action="event" data-value="${i}" role="button" tabindex="0"><title>${entity(eventShort(e))} · ${entity(eventDescriptor(e))}</title>${outer}<g fill="${selected?'#0c1316':'#11161f'}" stroke="currentColor" stroke-width="2">${symbol}</g>${selected?`<text x="${x}" y="${y-21}" class="score-selected-label" text-anchor="middle">${entity(eventShort(e).toUpperCase())}</text>`:''}<rect x="${x-13}" y="${y-13}" width="26" height="26" fill="transparent" stroke="none"/></g>`;}).join('');
 const cursor=coords.get(sel.id)!;
 return `<section class="score-panel"><div class="score-panel-header"><div class="score-title">${ico('activity',16)} SYSTEM SCORE <span class="score-tag">CAUSAL / SEMANTIC EVENT VIEW</span></div><div class="score-toolbar"><span class="evidence-key"><i class="key-dot observed-key"></i>observed</span><span class="evidence-key"><i class="key-line"></i>supported causal edge</span><span class="evidence-key"><i class="key-dash"></i>unobserved interval</span>${actionPill('info','Clock domains','modal','capture')}</div></div><div class="score-workspace"><div class="lane-labels"><div class="lane-label"><span class="lane-node">NODE A</span><strong>Ingress</strong><small>ingress-pid1</small></div><div class="lane-label"><span class="lane-node">NODE B</span><strong>Worker · 01</strong><small>worker-pid1</small></div><div class="lane-label"><span class="lane-node">NODE B</span><strong>Worker · 02</strong><small>worker-pid2 <em>restart</em></small></div><div class="lane-label"><span class="lane-node">NODE C</span><strong>Journal</strong><small>journal-pid1</small></div></div><div class="score-chart"><div class="score-scale"><span>START</span><span>SEMANTIC SEQUENCE · NOT A SHARED CLOCK</span><span>LAST OBSERVED</span></div><svg viewBox="0 0 1110 234" preserveAspectRatio="none" class="score-svg" role="img" aria-label="Interactive process lanes showing captured fixture events and documented causal relationships"><defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="none" stroke="#64dfc0" stroke-width="1.2"/></marker></defs>${rows}${grid}${arrows}<line x1="${cursor.x}" x2="${cursor.x}" y1="12" y2="228" class="score-cursor"/>${markers}</svg></div></div><div class="score-panel-foot"><span>${ico('shield',12)} Capture policy: metadata-only / partial</span><span>2 causal relations in failing fixture · 3 node-local clock domains</span><span>${tinyDataLabel()}</span></div></section>`;
}
function symbolForEvent(e:TraceEvent):SymbolItem|null{
 if(!e.sourceRef)return null;
 let key=e.sourceRef.symbolKey;
 if(key.includes('recover/'))return getSymbol('recover');
 if(key.includes('handle_info/'))return getSymbol('handle_info');
 if(key.includes('Gateway.'))return getSymbol('gateway');
 return null;
}
function renderSourceFollower(e:TraceEvent):string{
 const linked=symbolForEvent(e);
 return `<div class="pane-top pane-top-tall"><div class="pane-label">${ico('code',14)} SOURCE FOLLOWER <span class="tiny-sep">/</span> ${pill(state.follow.toUpperCase(),'blue')}</div><div class="pane-actions">${linked?pill('SOURCE REF EXACT','mint'):pill('NO SOURCE REF','amber')}<button class="bare-icon" data-action="modal" data-value="capture" title="Source mapping details">${ico('info',15)}</button></div></div>${linked?`<div class="follower-path">${ico('file',13)} ${entity(linked.file)} <span class="spacer"></span><span>synthetic-rev-001</span></div><div class="follower-context"><div class="follower-breadcrumb">${entity(linked.module)}<span>.</span><strong>${entity(linked.name)}</strong></div><span class="follower-invocation">${ico('dotcircle',12)} ${entity(eventShort(e))}</span></div><div class="follower-code">${sourceRows(linked.lines.filter(l=>l.kind!=='remove').slice(0,16))}</div>`:`<div class="source-not-mapped"><div class="source-notmapped-icon">${ico('link',23)}</div><h3>No source span in this event</h3><p>This fixture event does not contain a source reference. The viewer will not guess a location in your checkout.</p><button class="outline-button" data-action="symbol" data-value="handle_info">Inspect related static source ${ico('arrow',13)}</button></div>`}<div class="follower-footer"><span>${ico('pin',13)} Pinned references are never auto-replaced</span><button data-action="view" data-value="review">Review in source ${ico('arrow',13)}</button></div>`;
}
function renderEventInspector(e:TraceEvent):string{
 const tone=eventTone(e),selectedIdx=state.eventIndex;
 return `<div class="pane-top pane-top-tall"><div class="pane-label">${ico('dotcircle',14)} EVENT INSPECTOR</div><div class="pane-actions">${pill('OBSERVED', 'mint')}<button class="bare-icon" data-action="modal" data-value="capture" title="Capture details">${ico('info',15)}</button></div></div><div class="event-inspector-heading"><div class="event-index">EVT <strong>${String(selectedIdx+1).padStart(3,'0')}</strong><span> / ${String(currentCapture().events.length).padStart(3,'0')}</span></div><div class="event-name tone-${tone}">${ico(e.eventType==='process_exit'?'alert':e.eventType==='effect_attempted'?'activity':'dotcircle',19)} ${entity(eventShort(e))}</div><p>${entity(eventDescriptions[e.eventType]||'Fixture event.')}</p></div><div class="event-inspector-tabs">${tabButton('event','Event',state.captureTab==='event','capture-tab')}${tabButton('state','State',state.captureTab==='state','capture-tab')}${tabButton('causality','Causality',state.captureTab==='causality','capture-tab')}</div><div class="event-inspector-content">${state.captureTab==='event'?renderEventDetails(e):state.captureTab==='state'?renderStateDetails(e):renderCausalityDetails(e)}</div><div class="event-inspector-footer"><button data-action="modal" data-value="finding">${ico('plus',14)} Attach to finding</button><button data-action="view" data-value="compare">Compare run ${ico('arrow',13)}</button></div>`;
}
function renderEventDetails(e:TraceEvent):string{
 return `<div class="event-facts"><div class="property-row"><span>EVENT ID</span><strong class="mono truncate" title="${entity(e.id)}">${entity(e.id)}</strong></div><div class="property-row"><span>LOGICAL ROLE</span><strong>${entity(e.logicalRoleId)}</strong></div><div class="property-row"><span>PROCESS INCARNATION</span><strong class="mono">${entity(e.processInstanceId.split('/').pop())}</strong></div><div class="property-row"><span>NODE BOOT</span><strong class="mono">${entity(e.nodeInstanceId)}</strong></div><div class="property-row"><span>LOCAL SEQUENCE</span><strong class="mono">${String(e.localSequence).padStart(3,'0')}</strong></div><div class="property-row"><span>CAPTURE</span><strong>${entity(e.captureStatus)}</strong></div></div><div class="json-head">REDACTED / METADATA PAYLOAD ${ico('lock',12)}</div><pre class="json-view">${entity(JSON.stringify(e.payload??{note:'No payload captured'},null,2))}</pre>`;
}
function renderStateDetails(e:TraceEvent):string{
 const obs=e.eventType==='state_observed';
 return `<div class="state-observation"><div class="state-card-head"><span class="state-indicator ${obs?'seen':'unseen'}"></span><strong>${obs?'Partial point observation':'No state sampled at this event'}</strong></div>${obs?`<div class="observed-value"><span>status</span><code>${entity(String(e.payload?.status??'unknown'))}</code>${pill('OBSERVED PARTIAL','blue')}</div><p>Snapshot belongs only to this process incarnation at this captured point.</p>`:`<div class="unknown-field">${ico('shield',19)} <span>UNKNOWN</span></div><p>State is not inferred from adjacent events or reused across process restarts.</p>`}<div class="state-warning">${ico('alert',14)} No continuous process-state reconstruction is supported by this fixture.</div></div>`;
}
function renderCausalityDetails(e:TraceEvent):string{
 const relations=currentCapture().relations.filter(r=>r.fromEventId===e.id||r.toEventId===e.id);
 return `<div class="causal-details">${sectionTitle('SUPPORTED RELATIONS',pill(String(relations.length)+' EDGES','mint'))}${relations.length?relations.map(r=>`<div class="causal-relation"><span class="relation-kind">${entity(r.kind.replace(/_/g,' '))}</span><strong>${entity(r.fromEventId===e.id?r.toEventId:r.fromEventId)}</strong><small>Basis: ${entity(r.basis)}</small><button data-action="event-id" data-value="${entity(r.fromEventId===e.id?r.toEventId:r.fromEventId)}">Follow ${ico('arrow',12)}</button></div>`).join(''):`<div class="causal-empty">${ico('link',20)}<strong>No asserted causal edge</strong><p>Chronological proximity and matching-looking values are not causal proof.</p></div>`}<div class="state-warning">Cross-node monotonic timestamps are intentionally incomparable.</div></div>`;
}
const milestoneRows=[
 {title:'Command accepted',a:'Accepted · cmd-42',b:'Accepted · cmd-42',type:'matched',desc:'Shared command identifier'},
 {title:'Message transfer',a:'Sent / received',b:'Sent / received',type:'matched',desc:'Synthetic message ID msg-42'},
 {title:'First external attempt',a:'Attempt #1',b:'Attempt #1',type:'matched',desc:'Logical role + effect kind'},
 {title:'After first attempt',a:'Gateway acknowledged',b:'State sampled: executing',type:'different',desc:'Different recorded event types'},
 {title:'Process continuation',a:'Callback exited OK',b:'Worker exited → restarted',type:'different',desc:'Crash + replacement only observed in B'},
 {title:'Recovery write attempt',a:'Not recorded in scoped run',b:'Attempt #2 · outcome unknown',type:'divergent',desc:'Additional event observed in failing fixture'}
];
function renderCompare():string{
 const actions=`${pill('ALIGNMENT · cmd-42','outline')}${pill('2 SHARED ANCHORS','mint')}${actionPill('activity','Open Cinema','view','cinema','accent-outline')}`;
 return `<div class="compare-page">${heading('INVESTIGATION / MULTI-RUN COMPARISON','The moment behavior separates','Align by semantic evidence, not raw PIDs, timestamps, or imagined missing events.',actions)}<div class="comparison-summary">${renderRunCard('PASSING','run-pass','mint',capturePass)}<div class="align-bridge"><div class="bridge-arrows">${ico('link',20)}</div><strong>SEMANTIC ALIGNMENT</strong><span>cmd-42 · two verified anchors</span><div class="bridge-track"><span></span><span></span></div></div>${renderRunCard('FAILING','run-fail','coral',captureFail)}</div><div class="compare-workspace"><section class="pane align-panel"><div class="pane-top pane-top-tall"><div class="pane-label">${ico('compare',15)} ALIGNED EXECUTION CHECKPOINTS</div><div class="pane-actions"><button class="switch-row ${state.showUncertain?'on':''}" data-action="uncertain" title="Toggle uncertain detail"><span class="switch-knob"></span> show uncertainty</button></div></div><div class="align-column-head"><span>RUN A <b>PASS</b></span><span>MATCH BASIS</span><span>RUN B <b>FAIL</b></span></div><div class="align-rows">${milestoneRows.map((m,i)=>renderMilestone(m,i)).join('')}</div><div class="align-footer">${ico('info',13)} Differences describe recorded observations within scope, not full-system absence or causal root.</div></section><aside class="pane divergence-panel">${renderDivergence()}</aside></div><div class="compare-bottom">${renderCompareSource()}</div></div>`;
}
function renderRunCard(label:string,id:string,tone:string,cap:CaptureFixture):string{
 const eventCounts=cap.events.reduce((m,e)=>(m[e.eventType]=(m[e.eventType]||0)+1,m),{} as Record<string,number>);
 return `<div class="run-card run-${tone}"><div class="run-card-top"><span class="run-label"><i></i> ${label} FIXTURE</span>${pill(tone==='mint'?'CONTROL':'VARIANT',tone==='mint'?'mint':'coral')}</div><div class="run-card-main"><div><strong>${id}</strong><small>synthetic-rev-001 <span>·</span> 3 node boots</small></div><div class="run-stats"><strong>${cap.events.length}</strong><span>events</span></div>${sparkline(tone==='mint'?[.2,.28,.36,.62,.5,.78,.64,.58,.75]:[.15,.35,.3,.48,.83,.27,.51,.3,.95],tone==='mint'?'#69dfb2':'#f08e90',90,28)}</div><div class="run-card-bottom">${ico('shield',12)} partial capture <span></span> ${eventCounts.effect_attempted||0} external attempt${(eventCounts.effect_attempted||0)>1?'s':''}</div></div>`;
}
function renderMilestone(m:typeof milestoneRows[number],i:number):string{
 return `<button class="milestone milestone-${m.type} ${state.selectedMilestone===i?'active':''}" data-action="milestone" data-value="${i}"><div class="milestone-side left"><span class="milestone-dot"></span><strong>${entity(m.a)}</strong></div><div class="milestone-center"><span class="milestone-index">${String(i+1).padStart(2,'0')}</span><span class="milestone-name">${entity(m.title)}</span><span class="milestone-basis">${state.showUncertain?entity(m.desc):'Click to inspect'}</span></div><div class="milestone-side right"><span class="milestone-dot"></span><strong>${entity(m.b)}</strong></div></button>`;
}
function renderDivergence():string{
 const m=milestoneRows[state.selectedMilestone];const isDivergent=state.selectedMilestone===5;
 return `<div class="divergence-inner"><div class="divergence-upper"><div class="divergence-eyebrow">${ico('dotcircle',14)} SELECTED MILESTONE <span>${String(state.selectedMilestone+1).padStart(2,'0')} / 06</span></div><div class="divergence-mark ${isDivergent?'highlight':''}">${ico(isDivergent?'alert':'compare',24)}</div><h2>${isDivergent?'Additional observed write attempt':entity(m.title)}</h2><p>${isDivergent?'The failing fixture records a second external write attempt following the observed process restart. The passing fixture has no corresponding recorded attempt in the selected scope.':entity(m.desc)}</p><div class="divergence-labels">${pill(isDivergent?'SUPPORTED OBSERVATION':'ALIGNED CHECKPOINT',isDivergent?'amber':'blue')}${pill('SYNTHETIC','outline')}</div></div><div class="divergence-bottom"><div class="tiny-label">LIMITATION / EVIDENCE GAP</div><div class="divergence-caveat">${ico('shield',16)} <span>${isDivergent?'The first attempt’s external outcome was not recorded. This is not proof of a duplicate committed effect.':'No conclusion about unrecorded behavior may be inferred from absent events.'}</span></div><div class="divergence-stats"><div><span>Anchored pairs</span><strong>02</strong></div><div><span>Capture gaps</span><strong>01+</strong></div></div><button class="primary-wide" data-action="modal" data-value="finding">${ico('plus',14)} Convert to finding</button></div></div>`;
}
function renderCompareSource():string{
 const s=getSymbol('recover');
 const left=s.lines.filter(l=>l.old!==undefined).slice(0,6),right=s.lines.filter(l=>l.next!==undefined).slice(0,6);
 return `<section class="pane paired-source"><div class="paired-caption"><div>${ico('code',14)} CORRELATED SOURCE / ${entity(s.module)}.${entity(s.name)}</div><span>Illustrative source comparison · same synthetic revision</span></div><div class="paired-columns"><div class="paired-half"><div class="paired-half-title"><span class="run-dot pass"></span> RUN A · observed gateway acknowledgement</div>${left.map(l=>`<div class="paired-code-row"><span>${l.old}</span><code>${syntax(l.text)}</code></div>`).join('')}</div><div class="paired-half"><div class="paired-half-title"><span class="run-dot fail"></span> RUN B · retry path after restart</div>${right.map(l=>`<div class="paired-code-row ${l.kind==='add'?'add':''}"><span>${l.next}</span><code>${syntax(l.text)}</code></div>`).join('')}</div></div></section>`;
}
function renderTopology():string{
 const actions=`${pill('BOUNDED TOPOLOGY','outline')}${pill('6 SCENARIO NODES','neutral')}${actionPill('code','Back to review','view','review','accent-outline')}`;
 return `<div class="topology-page">${heading('SYSTEM / CODE ↔ RUNTIME PROJECTION','Architecture at the fault line','Explore which relationships are structural possibilities and which ones the capture actually observed.',actions)}<div class="topology-stats"><div class="topo-stat"><span>DOCUMENTED MESSAGE TRANSFER</span><strong>01 <small>edge</small></strong><span class="stat-tone mint">${ico('checkcircle',13)} observed correlation</span></div><div class="topo-stat"><span>SUPERVISOR REACTION</span><strong>01 <small>edge</small></strong><span class="stat-tone mint">${ico('checkcircle',13)} exit → new incarnation</span></div><div class="topo-stat"><span>EXTERNAL WRITE ATTEMPTS</span><strong>02 <small>events</small></strong><span class="stat-tone amber">${ico('alert',13)} outcomes unknown</span></div><div class="topo-stat"><span>CLOCK RELATIONSHIP</span><strong>— <small>not aligned</small></strong><span class="stat-tone blue">${ico('shield',13)} node-local times</span></div></div><div class="topology-main"><section class="pane topology-canvas"><div class="pane-top pane-top-tall"><div class="pane-label">${ico('network',14)} SYSTEM RELATIONSHIPS <span class="tiny-sep">/</span> cmd-42</div><div class="pane-actions"><button class="layer-toggle ${state.showObserved?'selected':''}" data-action="layer" data-value="observed"><span class="legend-line solid"></span> Observed</button><button class="layer-toggle ${state.showStatic?'selected':''}" data-action="layer" data-value="static"><span class="legend-line dashed"></span> Static possible</button>${pill('LOCAL SCOPE','outline')}</div></div><div class="map-surface"><div class="map-grid"></div><svg viewBox="0 0 1050 470" preserveAspectRatio="xMidYMid meet" class="topology-connections" aria-hidden="true"><defs><marker id="topo-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 1 6 4 0 7" fill="none" stroke="#64dfc0" stroke-width="1.1"/></marker><marker id="topo-arrow-static" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 1 6 4 0 7" fill="none" stroke="#7e75bb" stroke-width="1.1"/></marker></defs>${state.showObserved?`<path d="M233 178 H302" class="topo-edge observed" marker-end="url(#topo-arrow)"/><path d="M394 227 V308" class="topo-edge observed" marker-end="url(#topo-arrow)"/><text x="265" y="160" class="topo-edge-label">msg-42</text><text x="408" y="275" class="topo-edge-label">exit → spawn</text>`:''}${state.showStatic?`<path d="M493 164 C554 164 550 102 576 102" class="topo-edge static" marker-end="url(#topo-arrow-static)"/><path d="M774 102 H815" class="topo-edge unknown"/><text x="527" y="111" class="topo-edge-label">may call</text><text x="780" y="89" class="topo-edge-label amber">outcome ?</text>`:''}<path d="M576 314 H528" class="topo-edge isolated"/><text x="564" y="345" text-anchor="middle" class="topo-edge-caption">Journal observation is not causally joined</text></svg>${nodeGraph.map(n=>renderGraphNode(n)).join('')}<div class="map-watermark">${tinyDataLabel()}<span>Conceptual positions · verified edges labelled</span></div><div class="map-corner-index">FIG. 01 <span>PROCESS / SOURCE CONTEXT</span></div></div><div class="map-legend-bar"><span>${ico('shield',13)} Inferred graph placement is illustrative</span><span>Static possibility ≠ recorded execution</span><button data-action="modal" data-value="provenance">How edges are classified ${ico('arrow',12)}</button></div></section><aside class="pane topology-detail">${renderTopologyDetail()}</aside></div><div class="topology-bottom"><div class="topo-foot-card"><span class="card-eyebrow">NEXT INVESTIGATION</span><strong>Follow a retry across incarnations</strong><p>Observe the worker exit and the supervisor-linked replacement before inspecting the second external attempt.</p><button data-action="event" data-value="7">Open exit event ${ico('arrow',14)}</button></div><div class="topo-foot-card"><span class="card-eyebrow">COVERAGE PROBLEM</span><strong>What did the external service do?</strong><p>The recording contains attempts, not durable completion. Keep this boundary explicit in every review claim.</p><button data-action="view" data-value="compare">Compare capture outcomes ${ico('arrow',14)}</button></div><div class="topo-foot-card"><span class="card-eyebrow">SOURCE RELATIONSHIP</span><strong>Bounded impact, not a universe graph</strong><p>Explore a focused neighborhood that preserves evidence type, provider, and unresolved gaps.</p><button data-action="symbol" data-value="recover">Inspect recovery branch ${ico('arrow',14)}</button></div></div></div>`;
}
function renderGraphNode(n:GraphNode):string{
 const graphIcons:Record<string,string>={process:'cpu',effect:'activity',storage:'layers',supervisor:'network',boundary:'shield'};
 return `<button class="graph-card ${state.topologyNode===n.id?'selected':''} graph-${n.type}" style="left:${n.x/1050*100}%;top:${n.y/470*100}%" data-action="graph-node" data-value="${n.id}"><span class="graph-card-head"><span class="graph-node-icon">${ico(graphIcons[n.type]||'grid',16)}</span><span class="graph-state state-${n.status}"></span></span><strong>${entity(n.label)}</strong><small>${entity(n.subtitle)}</small><span class="graph-card-status">${entity(n.status.toUpperCase())}${ico('chevron',11)}</span></button>`;
}
function renderTopologyDetail():string{
 const node=nodeGraph.find(n=>n.id===state.topologyNode)||nodeGraph[1];
 const relevant=node.id==='worker'?'handle_info':node.id==='gateway'?'gateway':node.id==='journal'?'journal':node.id==='supervisor'?'supervisor':'handle_info';
 const isUnknown=node.status==='unknown'||node.status==='candidate';
 return `<div class="pane-top pane-top-tall"><div class="pane-label">${ico('dotcircle',14)} NODE INSPECTOR</div><button class="bare-icon" data-action="modal" data-value="provenance">${ico('info',15)}</button></div><div class="topo-detail-head"><div class="topo-detail-symbol">${ico(node.type==='storage'?'layers':node.type==='boundary'?'shield':'cpu',24)}</div><div class="tiny-label">${entity(node.type.toUpperCase())} / SELECTED OBJECT</div><h2>${entity(node.label)}</h2><p>${entity(node.subtitle)}</p>${pill(node.status.toUpperCase(),isUnknown?'amber':'mint')}</div><div class="topo-detail-body"><div class="tiny-label">WHAT WE CAN SAY</div><p>${entity(node.detail)}</p><div class="topo-property"><span>Projection</span><strong>Code + runtime</strong></div><div class="topo-property"><span>Question scope</span><strong>cmd-42</strong></div><div class="topo-property"><span>Capture level</span><strong>Metadata only</strong></div><div class="topo-property"><span>Ambiguity</span><strong>${isUnknown?'Unresolved':'Bounded'}</strong></div><div class="provenance-divider"></div><div class="tiny-label">SOURCE ANCHOR</div><button class="topo-source-link" data-action="symbol" data-value="${relevant}">${ico('code',16)}<span>${entity(getSymbol(relevant).module)}.${entity(getSymbol(relevant).name)}</span>${ico('arrow',13)}</button></div><div class="topo-detail-footer"><button class="primary-wide" data-action="view" data-value="cinema">${ico('activity',14)} Open recording</button><button data-action="modal" data-value="finding">${ico('plus',14)} Add finding</button></div>`;
}
function renderFindings():string{
 const actions=`${pill(`${state.findings.length} FINDINGS`,'outline')}${actionPill('download','Export evidence','export','','accent-outline')}${actionPill('plus','New finding','modal','finding','btn-primary')}`;
 return `<div class="findings-page">${heading('REVIEW / DURABLE EVIDENCE LEDGER','A review that can be challenged','Claims are only useful when the exact source, observation, and unresolved evidence gaps travel with them.',actions)}<div class="findings-stats"><div><span>OPEN / IN REVIEW</span><strong>${state.findings.filter(f=>f.status!=='Resolved').length}</strong><small>active review claims</small></div><div><span>LINKED OBSERVATIONS</span><strong>${state.findings.reduce((n,f)=>n+f.evidence,0)}</strong><small>evidence references</small></div><div><span>EXPLICIT GAPS</span><strong>${state.findings.reduce((n,f)=>n+f.gaps,0)}</strong><small>not silently omitted</small></div><div class="findings-stat-philosophy">${ico('shield',20)}<strong>Provenance before certainty.</strong><small>Static / observed / unknown remain distinct.</small></div></div><div class="findings-main"><section class="pane findings-list"><div class="pane-top pane-top-tall"><div class="pane-label">${ico('file',14)} INVESTIGATION FINDINGS</div><span class="pane-top-extra">otp-recovery / fix-recovery</span></div><div class="finding-list-content">${state.findings.map(renderFindingCard).join('')}<button class="new-finding-card" data-action="modal" data-value="finding">${ico('plus',18)} <span>Record another finding</span> <small>Preserve links, scope, and uncertainty</small></button></div></section><aside class="pane findings-evidence">${renderFindingsSidebar()}</aside></div></div>`;
}
function renderFindingCard(f:Finding):string{
 return `<article class="finding-card"><div class="finding-topline"><span class="finding-id">${entity(f.id)}</span>${pill(f.severity.toUpperCase(),f.severity==='high'?'coral':f.severity==='medium'?'amber':f.severity==='critical'?'coral':'blue')}${pill(f.status,f.status==='Resolved'?'mint':'neutral')}<span class="spacer"></span><button class="finding-resolve" data-action="resolve-finding" data-value="${entity(f.id)}">${ico(f.status==='Resolved'?'refresh':'check',13)} ${f.status==='Resolved'?'Reopen':'Resolve'}</button></div><h2>${entity(f.title)}</h2><p>${entity(f.claim)}</p><div class="finding-tags">${f.tags.map(x=>pill(x,'outline')).join('')}</div><div class="finding-bottom"><span>${ico('code',14)} ${entity(f.anchor)}</span><span>${ico('link',13)} ${f.evidence} references</span><span>${ico('alert',13)} ${f.gaps} gaps</span><span class="spacer"></span><button data-action="finding-source" data-value="${entity(f.id)}">Inspect source ${ico('arrow',13)}</button></div></article>`;
}
function renderFindingsSidebar():string{
 return `<div class="pane-top pane-top-tall"><div class="pane-label">${ico('shield',14)} EVIDENCE COMPOSITION</div></div><div class="findings-sidebar-body"><div class="evidence-mix"><div class="mix-top"><span>WHAT THE RECORDING SUPPORTS</span>${pill('PARTIAL','amber')}</div><div class="mix-row"><div><span class="mix-dot m-mint"></span>Observed attempts</div><strong>2</strong></div><div class="mix-bar"><span style="width:66%;background:var(--mint)"></span></div><div class="mix-row"><div><span class="mix-dot m-violet"></span>Static possible path</div><strong>1</strong></div><div class="mix-bar"><span style="width:33%;background:var(--violet)"></span></div><div class="mix-row"><div><span class="mix-dot m-amber"></span>Unknown external outcomes</div><strong>2</strong></div><div class="mix-bar"><span style="width:66%;background:var(--amber)"></span></div></div><div class="coverage-postcard"><span class="tiny-label">IMPORTANT DISTINCTION</span><h3>Attempt ≠ completion.</h3><p>A claim that the gateway was written to twice exceeds the available evidence. What is observed is two attempts.</p><button data-action="view" data-value="compare">Challenge in run comparison ${ico('arrow',13)}</button></div><div class="sidebar-rail-title">REPRODUCIBLE ANCHORS</div><button class="anchor-link" data-action="symbol" data-value="recover">${ico('code',15)} <span><strong>Source revision</strong><small>synthetic-rev-001 · recover/2</small></span>${ico('chevron',13)}</button><button class="anchor-link" data-action="event" data-value="10">${ico('activity',15)} <span><strong>Failing recording</strong><small>run-fail · event 009</small></span>${ico('chevron',13)}</button><button class="anchor-link" data-action="view" data-value="compare">${ico('compare',15)} <span><strong>Alignment plan</strong><small>cmd-42 · two shared anchors</small></span>${ico('chevron',13)}</button></div><div class="findings-sidebar-footer">${ico('lock',13)} Local-only concept storage · no backend connected</div>`;
}
function renderPalette():string{
 const commands: Array<{icon:string;name:string;desc:string;action:string;value:string;key:string}> = [
  {icon:'code',name:'Open semantic review',desc:'Changed functions and impact path',action:'view',value:'review',key:'R'},
  {icon:'activity',name:'Open execution cinema',desc:'Recorded process lanes and events',action:'view',value:'cinema',key:'C'},
  {icon:'compare',name:'Compare recorded runs',desc:'Semantic milestone alignment',action:'view',value:'compare',key:'V'},
  {icon:'network',name:'Explore system topology',desc:'Bounded relationships with provenance',action:'view',value:'topology',key:'G'},
  {icon:'file',name:'Open findings ledger',desc:'Review claims and evidence gaps',action:'view',value:'findings',key:'E'},
  {icon:'pin',name:'Pin or unpin source reference',desc:'Keep fixed context during navigation',action:'pin',value:'',key:'P'},
  {icon:'plus',name:'Create review finding',desc:'Save a sourced and contestable claim',action:'modal',value:'finding',key:'+'},
  {icon:'activity',name:'Inspect observed retry attempt',desc:'Failing fixture · event 009',action:'event',value:'10',key:'↵'},
  ...symbols.map(s=>({icon:'codebranch',name:`Open ${s.module}.${s.name}`,desc:s.file,action:'symbol',value:s.id,key:'↵'}))
 ];
 const filtered=commands.filter(c=>(c.name+' '+c.desc).toLowerCase().includes(state.paletteQuery.toLowerCase())).slice(0,12);
 return `<div class="overlay" data-action="close-overlays"><section class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette"><div class="palette-search">${ico('search',20)}<input id="palette-input" placeholder="Jump to anything, or type a command..." autocomplete="off" value="${entity(state.paletteQuery)}" aria-label="Search commands"/><kbd>ESC</kbd></div><div class="palette-results"><div class="palette-label">${state.paletteQuery?'MATCHING COMMANDS':'SUGGESTED COMMANDS'}</div>${filtered.length?filtered.map(c=>`<button class="palette-item" data-action="${c.action}" data-value="${entity(c.value)}"><span class="palette-item-icon">${ico(c.icon,17)}</span><span><strong>${entity(c.name)}</strong><small>${entity(c.desc)}</small></span><kbd>${entity(c.key)}</kbd></button>`).join(''):`<div class="palette-empty">No matches. Try “source”, “trace”, “review”, or “finding”.</div>`}</div><div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span>${ico('shield',12)} Offline local concept</span></div></section></div>`;
}
function renderModal():string{
 let body='';let title='';let footer='';
 if(state.modal==='finding'){
  title='Create evidence-backed finding';
  body=`<p class="modal-intro">Capture a falsifiable claim with scope and unknowns. Saved locally in this browser; export it as a portable JSON concept bundle.</p><label class="field-label" for="finding-title">FINDING TITLE</label><input class="form-input" id="finding-title" value="Potential external write retry after worker exit" placeholder="What should the reviewer investigate?"/><label class="field-label" for="finding-text">CLAIM & LIMITATIONS</label><textarea class="form-input form-area" id="finding-text" rows="5" placeholder="What do the observations prove? What remains unknown?">${entity(state.findingDraft||'The failing fixture records two external write attempts across a worker restart. The outcome of the first attempt was not captured, so duplicate completion cannot be asserted.')}</textarea><div class="modal-row"><div><label class="field-label" for="finding-severity">REVIEW PRIORITY</label><select class="form-input" id="finding-severity"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div><div class="modal-bound"><span class="field-label">ATTACHED CONTEXT</span><strong>${entity(getSymbol().module)}.${entity(getSymbol().name)}</strong><small>run-fail · synthetic-rev-001</small></div></div>`;
  footer=`<button class="outline-button" data-action="modal" data-value="none">Cancel</button><button class="primary-wide modal-save" data-action="save-finding">${ico('check',14)} Save finding</button>`;
 }else if(state.modal==='provenance'){
  title='Evidence, provenance & uncertainty';
  body=`<p class="modal-intro">ElixirScope separates a syntactically possible path from an event that was actually recorded. These are deliberately not combined into a “confidence score.”</p><div class="provenance-line"><div class="provenance-symbol static">${ico('code',18)}</div><div><strong>Static possible relationship</strong><p>The supplied sample-review-context fixture describes a possible path from handle_info/2 through recover/2 toward an external write. This is not execution proof.</p><small>Provider: synthetic_fixture · coverage: partial</small></div></div><div class="provenance-line"><div class="provenance-symbol observed">${ico('eye',18)}</div><div><strong>Recorded observation</strong><p>The failing trace contains effect_attempted events in two distinct worker incarnations and a supervisor reaction linking exit to spawn.</p><small>Provider: synthetic_fixture_generator · session: run-fail</small></div></div><div class="provenance-line"><div class="provenance-symbol gap">${ico('shield',18)}</div><div><strong>Unknown and unavailable</strong><p>No external durable outcome, complete state history, or global ordering across node-local monotonic clocks may be assumed.</p><small>Coverage: partial · external result: not_observed</small></div></div>`;
  footer=`<button class="primary-wide modal-save" data-action="modal" data-value="none">I understand ${ico('check',13)}</button>`;
 }else if(state.modal==='capture'){
  title='Recording & revision context';
  body=`<div class="modal-capture-grid"><div><span>REPOSITORY</span><strong>synthetic-otp-recovery</strong></div><div><span>CODE REVISION</span><strong>synthetic-rev-001</strong></div><div><span>CAPTURE POLICY</span><strong>fixture_metadata_partial</strong></div><div><span>CLOCK ALIGNMENT</span><strong>unknown · node-local</strong></div><div><span>PASSING RECORDING</span><strong>${capturePass.events.length} events · ${capturePass.relations.length} asserted edge</strong></div><div><span>FAILING RECORDING</span><strong>${captureFail.events.length} events · ${captureFail.relations.length} asserted edges</strong></div></div><div class="modal-callout">${ico('info',16)} The code excerpts are illustrative visual-design content. The event fixtures, alignment anchors and evidence gaps were copied from your uploaded blueprint.</div>`;
  footer=`<button class="primary-wide modal-save" data-action="modal" data-value="none">Close</button>`;
 }else if(state.modal==='shortcuts'){
  title='Keyboard-first navigation';
  const shortcuts=[['⌘ / Ctrl + K','Open command palette'],['R / C / V / G / E','Switch workbench lens'],['J / K','Next / previous recording event'],['P','Pin current source context'],['Alt + ← / →','Semantic navigation history'],['/','Focus symbol filter'],['?','Show this keyboard map'],['Esc','Dismiss dialog / palette']];
  body=`<p class="modal-intro">The interface is designed to stay out of your way when investigating a fast-moving codebase.</p><div class="shortcut-list">${shortcuts.map(([keys,label])=>`<div><kbd>${entity(keys)}</kbd><span>${entity(label)}</span></div>`).join('')}</div>`;
  footer=`<button class="primary-wide modal-save" data-action="modal" data-value="none">Done</button>`;
 }else if(state.modal==='export'){
  title='Export investigation';body=`<p class="modal-intro">Export the current semantic focus, selected fixture event, active pinned source, and review findings as an offline JSON bundle.</p>`;footer=`<button class="primary-wide modal-save" data-action="export">${ico('download',15)} Download bundle</button>`;
 }
 return `<div class="overlay" data-action="close-overlays"><section class="dialog" role="dialog" aria-modal="true" aria-label="${entity(title)}"><div class="dialog-header"><div><span class="eyebrow">ELIXIRSCOPE / INVESTIGATION</span><h2>${entity(title)}</h2></div><button class="dialog-close" data-action="modal" data-value="none" aria-label="Close">${ico('close',18)}</button></div><div class="dialog-body">${body}</div><div class="dialog-footer">${footer}</div></section></div>`;
}
function persist():void{try{localStorage.setItem('elixirscope-concept-state',JSON.stringify({findings:state.findings}))}catch{}}
function toast(message:string):void{
 state.toast=message;
 if(toastTimer!==undefined)clearTimeout(toastTimer);
 toastTimer=window.setTimeout(()=>{state.toast='';render()},3000);
}
function stopPlaying():void{state.playing=false;if(playTimer!==undefined){clearInterval(playTimer);playTimer=undefined;}}
function setView(view:View):void{
 if(view!==state.view)stopPlaying();
 state.view=view;state.paletteOpen=false;state.modal='none';render();
}
function selectSymbol(id:string):void{
 if(!symbols.some(s=>s.id===id))return;
 if(state.symbolId!==id){state.symbolId=id;state.history=state.history.slice(0,state.historyPosition+1);state.history.push(id);state.historyPosition=state.history.length-1;}
 state.inspectorTab='impact';state.paletteOpen=false;state.modal='none';state.view='review';stopPlaying();render();
}
function selectEvent(index:number):void{
 state.run='fail';state.eventIndex=Math.max(0,Math.min(index,captureFail.events.length-1));state.paletteOpen=false;state.modal='none';state.captureTab='event';state.view='cinema';render();
}
function stepEvent(dir:number):void{
 const capture=currentCapture(),e=currentEvent();let target=-1;
 if(state.follow==='causal'){
   const relation=capture.relations.find(r=>dir>0?r.fromEventId===e.id:r.toEventId===e.id);
   if(relation)target=capture.events.findIndex(x=>x.id===(dir>0?relation.toEventId:relation.fromEventId));
   if(target<0){toast('No supported causal '+(dir>0?'successor':'predecessor')+' at this event. Switch to Role or Free to continue.');render();return;}
 }else if(state.follow==='role'||state.follow==='process'){
   const eligible=capture.events.map((ev,i)=>({ev,i})).filter(({ev})=>state.follow==='role'?ev.logicalRoleId===e.logicalRoleId:ev.processInstanceId===e.processInstanceId);
   const currentPos=eligible.findIndex(({i})=>i===state.eventIndex);target=eligible[Math.max(0,Math.min(eligible.length-1,currentPos+dir))].i;
 }else target=Math.max(0,Math.min(capture.events.length-1,state.eventIndex+dir));
 state.eventIndex=target;render();
}
function startPlaying():void{
 if(state.playing){stopPlaying();render();return;}
 state.playing=true;if(state.follow==='causal')state.follow='free';render();
 playTimer=window.setInterval(()=>{if(state.eventIndex>=currentCapture().events.length-1){stopPlaying();render();return;}state.eventIndex++;render();},900);
}
function exportBundle():void{
 const current=currentEvent();const data={
  title:'ElixirScope interface lab — portable investigation concept',
  exportedAt:new Date().toISOString(),synthetic:true,
  scope:{repositoryId:'synthetic-otp-recovery',revisionId:'synthetic-rev-001',commandId:'cmd-42'},
  focus:{lens:state.view,symbol:getSymbol().name,eventId:current.id,runId:current.sessionId,followMode:state.follow},
  pinnedSource:state.pinned?{symbol:getSymbol(state.pinnedSymbolId).name,revision:'illustrative-main'}:null,
  comparison:alignmentFixture,
  findings:state.findings,
  captureCoverage:{failing:captureFail.coverage,passing:capturePass.coverage},
  caveats:['Illustrative source only — no real repository indexing has been performed.','Events are synthetic fixture observations.','Cross-node monotonic timestamps are not globally comparable.','A recorded external attempt does not establish a durable outcome.']
 };
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='elixirscope-investigation.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);state.modal='none';toast('Investigation JSON exported.');render();
}
function saveFinding():void{
 const title=(document.getElementById('finding-title') as HTMLInputElement|null)?.value.trim()||'Untitled investigation';
 const claim=(document.getElementById('finding-text') as HTMLTextAreaElement|null)?.value.trim()||'';
 const severity=((document.getElementById('finding-severity') as HTMLSelectElement|null)?.value||'high') as Severity;
 if(!claim){toast('Add a claim or explicit uncertainty before saving.');render();return;}
 const s=getSymbol();state.findings.unshift({id:`F-${String(Math.max(0,...state.findings.map(f=>Number(f.id.replace('F-',''))||0))+1).padStart(3,'0')}`,title,severity,status:'In review',claim,anchor:s.module+'.'+s.name,tags:['User authored','Source linked'],evidence:1,gaps:1,created:new Date().toLocaleDateString()});
 persist();state.modal='none';state.view='findings';toast('Finding saved to this browser.');render();
}
function runAction(action:string,value:string):void{
 switch(action){
 case 'noop':return;
 case 'view':setView(value as View);return;
 case 'symbol':selectSymbol(value);return;
 case 'event':selectEvent(Number(value));return;
 case 'event-id':{const n=currentCapture().events.findIndex(x=>x.id===value);if(n>=0){state.eventIndex=n;render();}return;}
 case 'modal':state.modal=value as Modal;state.paletteOpen=false;render();return;
 case 'palette':state.paletteOpen=true;state.paletteQuery='';render();window.setTimeout(()=>(document.getElementById('palette-input') as HTMLInputElement|null)?.focus(),0);return;
 case 'close-overlays':state.modal='none';state.paletteOpen=false;render();return;
 case 'inspector':state.inspectorTab=value as InspectorTab;render();return;
 case 'diff':state.diffMode=value as DiffMode;render();return;
 case 'bottom':state.bottomTab=value as BottomTab;render();return;
 case 'pin':state.pinned=!state.pinned;if(state.pinned)state.pinnedSymbolId=state.symbolId;toast(state.pinned?'Source pinned; future selections will not replace it.':'Pinned comparison released.');render();return;
 case 'run':state.run=value==='pass'?'pass':'fail';state.eventIndex=state.run==='fail'?7:6;stopPlaying();render();return;
 case 'follow':state.follow=value as FollowMode;render();return;
 case 'step':stopPlaying();stepEvent(Number(value));return;
 case 'play':startPlaying();return;
 case 'capture-tab':state.captureTab=value as AppState['captureTab'];render();return;
 case 'uncertain':state.showUncertain=!state.showUncertain;render();return;
 case 'milestone':state.selectedMilestone=Number(value);render();return;
 case 'layer':if(value==='static')state.showStatic=!state.showStatic;else state.showObserved=!state.showObserved;render();return;
 case 'graph-node':state.topologyNode=value;render();return;
 case 'source-note':state.inspectorTab=value==='effect'?'impact':'graph';render();return;
 case 'history':state.historyPosition=Number(value);state.symbolId=state.history[state.historyPosition]||state.symbolId;render();return;
 case 'finding-source':{const f=state.findings.find(f=>f.id===value);const anchor=f?.anchor||'';const s=symbols.find(s=>anchor.includes(s.name)&&anchor.includes(s.module));selectSymbol(s?.id||'recover');return;}
 case 'resolve-finding':{const f=state.findings.find(f=>f.id===value);if(f){f.status=f.status==='Resolved'?'In review':'Resolved';persist();toast(f.status==='Resolved'?'Finding marked resolved.':'Finding reopened.');render();}return;}
 case 'save-finding':saveFinding();return;
 case 'export':exportBundle();return;
 }
}
function render():void{
 app.innerHTML=renderShell();document.title=`ElixirScope — ${viewLabels[state.view]}`;
}
app.addEventListener('click',e=>{
 const target=e.target as HTMLElement;
 const el=target.closest<HTMLElement>('[data-action]');if(!el)return;
 const action=el.dataset.action||'noop',value=el.dataset.value||'';
 if(action==='close-overlays'&&target!==el)return;
 e.preventDefault();runAction(action,value);
});
app.addEventListener('input',e=>{
 const el=e.target as HTMLInputElement;
 if(el.id==='symbol-search'){
  state.navQuery=el.value;const query=el.value.toLowerCase();
  document.querySelectorAll<HTMLElement>('.symbol-row').forEach(row=>{row.style.display=(row.dataset.search||'').includes(query)?'':'none'});
 }else if(el.id==='palette-input'){
  state.paletteQuery=el.value;
  const oldPos=el.selectionStart||state.paletteQuery.length;
  const list=document.querySelector('.palette-results');if(list){const doc=new DOMParser().parseFromString(renderPalette(),'text/html');const next=doc.querySelector('.palette-results');if(next)list.innerHTML=next.innerHTML;}
  el.setSelectionRange(oldPos,oldPos);
 }else if(el.id==='scrubber'){
  el.style.setProperty('--progress',`${Number(el.value)/Math.max(1,currentCapture().events.length-1)*100}%`);
 }
});
app.addEventListener('change',e=>{
 const el=e.target as HTMLInputElement;
 if(el.id==='scrubber'){stopPlaying();state.eventIndex=Number(el.value);render();}
});
function historyGo(delta:number):void{state.historyPosition=Math.max(0,Math.min(state.history.length-1,state.historyPosition+delta));state.symbolId=state.history[state.historyPosition];state.view='review';render();}
document.addEventListener('keydown',e=>{
 const t=e.target as HTMLElement;const isTyping=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement||t.isContentEditable;
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();state.paletteOpen?runAction('close-overlays',''):runAction('palette','');return;}
 if(e.key==='Escape'){if(state.paletteOpen||state.modal!=='none'){e.preventDefault();runAction('close-overlays','');}return;}
 if(e.key==='Enter'&&!isTyping){const focusAction=t.closest<HTMLElement>('[data-action]');if(focusAction&&focusAction.getAttribute('role')==='button'){e.preventDefault();runAction(focusAction.dataset.action||'noop',focusAction.dataset.value||'');return;}}
 if(state.paletteOpen){if(e.key==='Enter'){const first=document.querySelector<HTMLElement>('.palette-item');if(first){e.preventDefault();runAction(first.dataset.action||'noop',first.dataset.value||'');}}return;}
 if(state.modal!=='none')return;
 if(e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();historyGo(e.key==='ArrowLeft'?-1:1);return;}
 if(isTyping)return;
 const key=e.key.toLowerCase();
 if(key==='/'){e.preventDefault();if(state.view!=='review')setView('review');window.setTimeout(()=>(document.getElementById('symbol-search') as HTMLInputElement|null)?.focus(),0);return;}
 if(key==='?'){runAction('modal','shortcuts');return;}
 if(key==='p'){runAction('pin','');return;}
 if(key==='j'&&state.view==='cinema'){e.preventDefault();runAction('step','1');return;}
 if(key==='k'&&state.view==='cinema'){e.preventDefault();runAction('step','-1');return;}
 const routes:Record<string,View>={r:'review',c:'cinema',v:'compare',g:'topology',e:'findings'};
 if(routes[key]&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();setView(routes[key]);}
});
render();
