/* V3 wireframe. All relationships below are hand-authored design fixtures. */
(() => {
'use strict';
const files = window.ATLAS_FILES;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byName = (name, variant = 'current') => files.findIndex(f => f.name === name && f.variant === variant);
const goals = [
 {id:'authorize',short:'Authorize the action',statement:'Only permitted actors may issue a device command.',requirement:'REQ-01 · approved fixture requirement',detail:'Authorization is a decision. A separate validation process adds a queue and failure boundary; its runtime justification is missing.',steps:['Identify actor','Check site + action','Accept or reject'],links:['policy.ex','validation_gate.ex','policy_test.exs'],gap:'Why is validation a GenServer when it owns no state?',status:'Runtime boundary unexplained'},
 {id:'commit',short:'Keep accepted intent',statement:'An accepted command must survive loss of a worker.',requirement:'REQ-02 · approved fixture requirement',detail:'Durable acceptance belongs to the journal. Authority caches, worker records, and status mirrors are distinct copies, not one shared memory.',steps:['Validate command','Persist acceptance','Expose stable ID'],links:['command.ex','journal.ex','command_record.ex'],gap:'A durable journal row is not proof that the device applied the command.',status:'Durable / transient distinction'},
 {id:'reconcile',short:'Never retry blindly',statement:'An uncertain external effect must be reconciled before another attempt.',requirement:'REQ-03 · approved fixture requirement',detail:'Supervisor restart restores execution capacity. It does not restore process memory or establish whether a remote device applied a write.',steps:['Outcome unknown','Read device truth','Choose safe next action'],links:['worker.ex','device_adapter.ex','recovery_policy.ex'],gap:'Declared: unknown → reconcile. Fixture source: unknown → dispatch.',status:'Requirement / source disagreement'},
 {id:'report',short:'Report what is known',statement:'Expose completion only when the available evidence confirms it.',requirement:'REQ-04 · approved fixture requirement',detail:'A process-local status mirror can diverge from the journal. A timeout is an unknown outcome, not a failed external operation.',steps:['Read evidence','Keep unknown explicit','Report confirmed result'],links:['status_projector.ex','receipt.ex','status.ex'],gap:'Which observation makes “completed” legitimate across a network partition?',status:'External evidence incomplete'}
];
const actors = [
 {id:'authority',name:'Authority',file:'authority.ex',state:'pending / epoch',why:'Serial admission + transient cache',x:120,y:205,node:'A'},
 {id:'validator',name:'ValidationGate',file:'validation_gate.ex',state:'{} · no owned domain state',why:'Pure validation behind a mailbox',x:350,y:205,node:'A'},
 {id:'dispatcher',name:'Dispatcher',file:'dispatcher.ex',state:'{} · no owned domain state',why:'Worker creation message hop',x:350,y:290,node:'A'},
 {id:'worker',name:'CommandWorker',file:'worker.ex',state:'attempts / copied record',why:'Command execution + failure isolation',x:710,y:205,node:'B'},
 {id:'retry',name:'RetryBroker',file:'retry_broker.ex',state:'attempt counts + timers',why:'Second retry owner',x:955,y:205,node:'B'},
 {id:'lease',name:'LeaseKeeper',file:'lease_keeper.ex',state:'local fencing epochs',why:'Authority boundary needs enforcement',x:710,y:290,node:'B'},
 {id:'status',name:'StatusProjector',file:'status_projector.ex',state:'status mirror',why:'Another copy of command status',x:955,y:290,node:'B'}
];
const observations = [
 {name:'Message arrives',phase:'received',callback:'handle_info/2',message:':execute',before:'attempts: 0 / outcome: unknown',after:'Not yet observed',mailbox:[':execute',':readback'],pid:'<0.210.0>',file:'worker.ex',needle:'def handle_info',ledger:'status: pending',effect:'No write observed at this point',note:'Fixture message capture: delivery is separate from callback execution.'},
 {name:'Callback runs',phase:'callback entry',callback:'handle_info/2',message:':execute',before:'attempts: 0 / outcome: unknown',after:'Callback has not returned',mailbox:[':readback'],pid:'<0.210.0>',file:'worker.ex',needle:'result = DeviceAdapter.write',ledger:'status: pending',effect:'Effect call reached',note:'One callback at a time in this process. Other processes can run concurrently.'},
 {name:'Write / timeout',phase:'callback return',callback:'handle_info/2',message:'{:error, :timeout}',before:'attempts: 0 / outcome: unknown',after:'attempts: 1 / outcome: unknown',mailbox:[':readback'],pid:'<0.210.0>',file:'worker.ex',needle:'Journal.mark_unknown',ledger:'status: unknown',effect:'Write attempted · remote outcome unknown',note:'Captured timeout + journal update. The remote device may already have acted.'},
 {name:'Process dies',phase:'exit :kill',callback:'Process terminated',message:'No active callback',before:'Last observed: attempts: 1',after:'Process-local state no longer exists',mailbox:[],pid:'<0.210.0> †',file:'worker_supervisor.ex',needle:'DynamicSupervisor.init',ledger:'status: unknown · survives',effect:'Device outcome remains unknown',note:'Crash discards this process state and mailbox. The journal and device are separate owners.'},
 {name:'New PID / reload',phase:'new incarnation',callback:'init/1',message:'Start argument: cmd-42',before:'New process; no inherited memory',after:'attempts: 0 / journal record: unknown',mailbox:[],pid:'<0.288.0>',file:'worker.ex',needle:'state = %{id:',ledger:'status: unknown · reloaded',effect:'Prior effect unresolved',note:'Same logical worker role, different PID. init/1 reads durable state; the supervisor does not restore it.'},
 {name:'Blind retry',phase:'recovery decision',callback:'handle_continue/2 → next/1',message:'unknown → dispatch',before:'journal record: unknown',after:'Next action: dispatch',mailbox:[':execute'],pid:'<0.288.0>',file:'recovery_policy.ex',needle:'def next(%{status: :unknown})',ledger:'status: unknown',effect:'Second write scheduled · outcome still unknown',note:'Contradicts REQ-03. This demonstrates a retry decision; it does not prove duplicate committed effects.'}
];
const state = {goal:'reconcile',view:'intent',wide:false,candidate:false,actor:'worker',step:4,peel:100,file:byName('worker.ex'),source:false,full:false,query:'',history:[]};
const goal = () => goals.find(g=>g.id===state.goal);
const fileFor = name => {
 const candidate = state.candidate && ['authority.ex','journal.ex','device_adapter.ex','decision.ex'].includes(name);
 return byName(name,candidate?'candidate':'current');
};
const related = f => f.goals.includes(state.goal);
function snapshot(){ state.history.push({goal:state.goal,view:state.view,actor:state.actor,file:state.file,source:state.source,step:state.step}); }
function chooseGoal(id){snapshot();state.goal=id;render();}
function chooseView(view){snapshot();state.view=view;state.source=false;render();}
function openFile(index){ if(index<0||index>=files.length)return;snapshot();state.file=index;state.source=true;renderSource();renderFiles();$('status').textContent=files[index].reason; }
function openActor(id){snapshot();state.actor=id;state.view='anatomy';state.source=false;render();}
function text(x,y,label,cls='svg-label',extra=''){return `<text x="${x}" y="${y}" class="${cls}" ${extra}>${esc(label)}</text>`;}
function item(attrs,body,label){return `<g class="map-item" tabindex="0" role="button" aria-label="${esc(label)}" ${attrs}>${body}</g>`;}
function chip(x,y,w,title,subtitle,attrs='',color='var(--line)'){
 return item(attrs,`<rect class="hit" x="${x}" y="${y}" width="${w}" height="51" rx="2" fill="var(--white)" stroke="${color}"/>${text(x+12,y+20,title)}${text(x+12,y+38,subtitle,'svg-tiny')}`,title);
}
function svg(body){return `<svg viewBox="0 0 1300 570" aria-label="${esc(state.view)} projection" role="group">${body}</svg>`;}
function intentMap(){
 let out=`<ellipse cx="650" cy="248" rx="588" ry="180" fill="var(--white)" fill-opacity=".65" stroke="var(--line)" stroke-dasharray="4 5"/>`;
 out+=text(650,103,'Safe device commands across failure','svg-title','text-anchor="middle"');
 out+=text(650,128,'Declared product goal · responsibilities overlap · this is not a file tree','svg-small','text-anchor="middle"');
 const positions=[{x:103,y:187},{x:398,y:187},{x:693,y:187},{x:988,y:187}];
 goals.forEach((g,i)=>{
  const p=positions[i],active=g.id===state.goal;
  out+=`<g ${!active&&!state.wide?'class="dim"':''}>`;
  out+=item(`data-goal="${g.id}"`,`<path class="hit" d="M${p.x},${p.y+20} L${p.x+22},${p.y} H${p.x+198} L${p.x+221},${p.y+20} V${p.y+106} L${p.x+199},${p.y+128} H${p.x+22} L${p.x},${p.y+106} Z" fill="${active?'#e4ebdf':'#f7f7f0'}" stroke="${active?'var(--green)':'var(--line)'}" stroke-width="${active?2:1}"/>${text(p.x+15,p.y+26,`REQ-0${i+1} · declared`,'svg-tiny')}${text(p.x+15,p.y+55,g.short)}${text(p.x+15,p.y+81,g.steps[0],'svg-small')}${text(p.x+15,p.y+101,g.steps[2],'svg-small')}`,g.short);
  out+='</g>';
 });
 out+=`<path d="M205 336 Q610 403 1110 336" class="map-line" stroke-dasharray="5 5"/>`;
 out+=text(650,368,'Shared implementation: one journal participates in three promises','svg-small','text-anchor="middle"');
 const g=goal();
 out+=text(105,437,'OPEN THE SELECTED PROMISE','svg-tiny');
 g.steps.forEach((s,i)=>{
  const x=105+i*350;
  if(i<2)out+=`<path d="M${x+272},477 H${x+340}" class="map-line" marker-end="url(#arrow)"/>`;
  out+=chip(x,449,272,s,g.links[i]+' · inspect source',`data-file="${byName(g.links[i])}"`,i===2&&g.id==='reconcile'?'var(--amber)':'var(--line)');
 });
 out+=text(105,535,g.gap,'svg-small');
 return svg(defs()+out);
}
function defs(){return `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="#8e9b8c"/></marker></defs>`;}
function actorBlock(a,ghost=false){
 const file=files[byName(a.file)],isRelated=related(file),dim=!state.wide&&!isRelated;
 let body=`<path class="hit" d="M${a.x},${a.y+7} l15,-7 h181 l-15,7 Z" fill="#f8f9f3" stroke="${ghost?'#b7bdb2':'var(--line)'}"/><rect class="hit" x="${a.x}" y="${a.y+7}" width="181" height="55" fill="${ghost?'none':isRelated?'#e8eee2':'var(--white)'}" stroke="var(--line)" ${ghost?'stroke-dasharray="4 4"':''}/><path d="M${a.x+181},${a.y+7} l15,-7 v55 l-15,7 Z" fill="${ghost?'none':'#e1e6da'}" stroke="var(--line)"/>`;
 body+=text(a.x+10,a.y+25,a.name,'svg-label');
 body+=text(a.x+10,a.y+42,ghost?'Removed in proposal · justification?':a.state,'svg-tiny');
 body+=text(a.x+10,a.y+56,ghost?'Not proven unnecessary':'GenServer · open anatomy ↗','svg-tiny');
 return `<g class="${dim&&!ghost?'dim':''}">${item(`data-actor="${a.id}"`,body,a.name+' process anatomy')}</g>`;
}
function machineryMap(){
 let out=defs();const collapsed=100-state.peel;
 out+=text(80,30,'IMPLEMENTATION CROSS-SECTION','svg-tiny');
 out+=text(785,30,state.candidate?'Candidate proposal · equivalent behavior NOT established':'Current fixture · static topology, not a live cluster','svg-tiny');
 out+=`<g transform="translate(0 ${collapsed*.95})"><path d="M85 52H1125L1200 118H160Z" fill="#f5f5ee" stroke="var(--line)"/>`;
 out+=text(103,73,'DECISIONS · modules / functions, not processes','svg-tiny');
 const names=state.candidate?['policy.ex','decision.ex','receipt.ex']:['policy.ex','recovery_policy.ex','backoff.ex','receipt.ex'];
 names.forEach((name,i)=>{const idx=fileFor(name),f=files[idx],x=170+i*263;out+=`<g class="${!state.wide&&!related(f)?'dim':''}">`+chip(x,80,230,f.name,name==='recovery_policy.ex'?'unknown → dispatch ⚠':name==='decision.ex'?'unknown → reconcile · proposed':'Pure decision / transformation',`data-file="${idx}"`,name==='recovery_policy.ex'?'var(--amber)':'var(--line)')+'</g>';});
 out+='</g>';
 out+=`<path d="M65 177H566L628 365H127Z" fill="#e8ece1" fill-opacity=".55" stroke="var(--line)"/><path d="M660 177H1190L1250 365H720Z" fill="#e8ece1" fill-opacity=".55" stroke="var(--line)"/>`;
 out+=text(90,167,'NODE A · admission failure domain','svg-small');out+=text(695,167,'NODE B · execution failure domain','svg-small');
 if(!state.candidate){
  out+=`<path d="M298 230H350" class="map-line" marker-end="url(#arrow)"/><path d="M300 254 C314 303 325 320 347 320" class="map-line" marker-end="url(#arrow)"/><path d="M536 323 C630 323 620 235 705 235" class="map-line" marker-end="url(#arrow)"/>`;
  out+=text(564,260,'message','svg-tiny');out+=text(564,275,'boundary','svg-tiny');
  actors.forEach(a=>out+=actorBlock(a));
 }else{
  out+=actorBlock({...actors[0],x:180,y:205,state:'Serialized admission',name:'Authority'});
  out+=chip(765,212,280,'Supervised effect task','Transient work · NOT a GenServer',`data-file="${fileFor('device_adapter.ex')}"`);
  out+=`<path d="M376 237H756" class="map-line" marker-end="url(#arrow)"/>`;
  out+=text(447,228,'Decision + supervised task · proposed','svg-tiny');
  out+=text(150,308,'6 actor wrappers absent from this candidate sketch','svg-small');
  out+=text(150,331,'What isolation, throughput, cancellation, or fencing guarantees did they provide?','svg-tiny');
  out+=text(765,308,'Candidate is incomplete. Existing adapters / dependencies remain.','svg-tiny');
 }
 out+=text(89,390,'PROCESS MEMORY ENDS AT CRASH. SUPERVISION RESTARTS CODE; IT DOES NOT RESTORE STATE.','svg-tiny');
 out+=`<g transform="translate(0 ${-collapsed*.75})"><path d="M85 420H1150L1220 518H155Z" fill="#ede9dc" fill-opacity=".6" stroke="var(--line)"/>`;
 out+=text(102,441,'OWNERS OUTSIDE THE WORKER','svg-tiny');
 out+=chip(190,454,266,'Journal / database','Durable command status · survives PID',`data-file="${fileFor('journal.ex')}"`);
 out+=chip(490,454,280,'Ecto / SQL / connection pool','Dependency machinery still exists',`data-file="${byName('repo.ex')}"`);
 out+=chip(875,454,284,'Device / external truth','Remote write may survive your crash',`data-file="${fileFor('device_adapter.ex')}"`,'var(--amber)');
 out+='</g>';
 out+=`<path d="M790 268 V402 H323 V449" class="map-line" stroke-dasharray="3 4"/><path d="M877 267 Q1040 365 1010 449" class="map-line unknown-line" marker-end="url(#arrow)"/>`;
 out+=text(87,552,'Depth = ownership / lifetime boundaries. Peel separates layers; opening an actor changes the representation.','svg-tiny');
 return svg(out);
}
function anatomyMap(){
 const a=actors.find(a=>a.id===state.actor)||actors[3];
 const recorded=a.id==='worker'&&!state.candidate;
 const o=observations[state.step];
 const f=files[fileFor(a.file)];
 const activeIndex=recorded?byName(o.file):fileFor(a.file);
 const callback=recorded?o.callback:(a.id==='dispatcher'?'handle_cast/2':'handle_call/3');
 const before=recorded?o.before:'Static owner fields: '+(state.candidate&&a.id==='authority'?'in_flight (candidate)':a.state);
 const after=recorded?o.after:'No runtime observation for this actor';
 let out=defs();
 out+=text(72,30,'PROCESS ANATOMY · '+a.name,'svg-title');
 out+=text(72,54,recorded?'Logical role: command/cmd-42 · fixture incarnation '+o.pid:'Static callback / state structure · runtime state unavailable','svg-small');
 out+=chip(498,60,314,state.candidate?'Supervision design still open':'Supervisor / restart boundary','New PID starts init/1; no memory transfer',`data-file="${byName(a.id==='worker'?'worker_supervisor.ex':'root_supervisor.ex')}"`);
 out+=`<path d="M655 111V137" class="map-line" marker-end="url(#arrow)"/>`;
 out+=`<rect x="252" y="141" width="828" height="246" rx="25" fill="${recorded&&state.step===3?'#efe2dc':'#e7edde'}" fill-opacity=".8" stroke="${recorded&&state.step===3?'var(--red)':'var(--green)'}" stroke-dasharray="${recorded&&state.step===3?'6 5':'none'}"/>`;
 out+=text(277,168,recorded&&state.step===3?'TERMINATED INCARNATION · MEMORY + MAILBOX LOST':'ONE PROCESS · isolated memory · serial callbacks','svg-small');
 out+=text(73,220,'MAILBOX','svg-small');
 const mailbox=recorded?o.mailbox:['Request candidates'];
 if(!mailbox.length)out+=text(73,247,recorded&&state.step===3?'Destroyed with PID':'No queued messages captured','svg-tiny');
 mailbox.forEach((m,i)=>{out+=chip(70,235+i*57,170,m,recorded?'Captured fixture message':'Static possible input',recorded?'data-step="1"':`data-file="${activeIndex}"`);});
 out+=`<path d="M240 256H368" class="map-line" marker-end="url(#arrow)"/>`;
 out+=text(275,193,recorded?o.message:'message → callback','svg-tiny');
 out+=item(`data-file="${activeIndex}"`,`<rect class="hit" x="375" y="197" width="305" height="150" fill="var(--white)" stroke="var(--green)"/>${text(393,220,'CALLBACK CHAMBER','svg-tiny')}${text(393,248,callback)}${text(393,275,recorded?o.phase:'Possible callback; not observed','svg-small')}${text(393,302,files[activeIndex].name+' · exact source ↗','svg-small')}${text(393,327,'Only one callback runs here at once.','svg-tiny')}`,callback+' source');
 out+=`<path d="M682 270H739" class="map-line" marker-end="url(#arrow)"/>`;
 out+=`<rect x="745" y="197" width="304" height="150" fill="var(--white)" stroke="var(--line)"/>`;
 out+=text(762,219,'PROCESS-LOCAL STATE','svg-tiny');
 out+=text(762,244,'IN  '+before,'svg-tiny');out+=text(762,272,'OUT '+after,'svg-tiny');
 out+=text(762,302,recorded&&state.step>=4?'New incarnation; attempts reset.':'Lives only as long as this PID.','svg-small');
 out+=text(762,326,'A state value is not a durable write.','svg-tiny');
 out+=`<path d="M531 348V444" class="map-line" marker-end="url(#arrow)"/><path d="M681 320 Q1115 370 1115 444" class="map-line unknown-line" marker-end="url(#arrow)"/>`;
 out+=text(547,412,'explicit read / write','svg-tiny');
 out+=chip(383,450,307,'Journal · durable owner',recorded?o.ledger:'Status / payload stored separately',`data-file="${fileFor('journal.ex')}"`);
 out+=chip(830,450,366,'Device · external owner',recorded?o.effect:'Possible write; outcome needs evidence',`data-file="${fileFor('device_adapter.ex')}"`,'var(--amber)');
 out+=text(70,544,recorded?o.note:'Why this process exists: '+a.why+'. No captured execution is supplied for it.','svg-tiny');
 return svg(out);
}
function renderFiles(){
 const query=state.query.toLowerCase();
 $('files').innerHTML=files.map((f,i)=>({f,i})).filter(({f})=>!query||f.path.toLowerCase().includes(query)).map(({f,i})=>`<button class="file-tile ${related(f)?'related':''} ${f.goals.length?'':'unmapped'} ${i===state.file?'selected':''} ${f.variant==='candidate'?'candidate':''}" data-file="${i}" title="${esc(f.path+' — '+f.reason)}"><span class="file-index">${String(i+1).padStart(2,'0')} · ${f.kind}${f.variant==='candidate'?' / proposal':''}</span>${esc(f.name)}</button>`).join('');
 $('file-reel').value=state.file;
 $('reel-label').textContent=String(state.file+1).padStart(2,'0')+'/32 · '+files[state.file].name;
}
function renderReview(){
 const scope=files.filter(f=>f.variant==='current'&&(state.wide||related(f)));
 const candidate=files.filter(f=>f.variant==='candidate'&&(state.wide||related(f)));
 const active=state.candidate?candidate:scope;
 const count=active.filter(f=>f.kind==='actor').length;
 const loc=active.reduce((n,f)=>n+f.loc,0);
 $('review').innerHTML=`<div class="claim"><div class="eyebrow">${goal().requirement}</div><strong>${esc(goal().statement)}</strong><p>${esc(state.candidate?'Candidate sketch changes the mechanism; matching requirements remain open. '+goal().gap:goal().detail)}</p></div><div class="fact-row"><div class="fact"><b>${count}${state.candidate?' / '+scope.filter(f=>f.kind==='actor').length:''}</b><small>application GenServers${state.candidate?' · proposal / current':''}</small></div><div class="fact"><b>${active.length}</b><small>${state.candidate?'candidate sketch units':'source units in scope'}</small></div><div class="fact"><b>${loc}</b><small>${state.candidate?'sketch lines · not full app':'fixture source lines'}</small></div></div>`;
}
function renderSource(preserveReel = false){
 if(!state.source){$('source-root').innerHTML='';return;}
 const f=files[state.file];
 const o=observations[state.step];
 const eventLine=state.view==='anatomy'&&f.name===o.file?f.source.split('\n').findIndex(l=>l.includes(o.needle))+1:0;
 const focus=eventLine||f.line;
 const all=f.source.trimEnd().split('\n');
 const lines=all.map((s,i)=>({s,n:i+1})).filter(({n})=>state.full||Math.abs(n-focus)<=6);
 const siblings=files.filter(other=>other!==f&&other.variant===f.variant&&other.goals.some(id=>f.goals.includes(id))).slice(0,2);
 const markup=`<section class="source-surface" aria-label="Source inside investigation"><div class="source-head"><span class="eyebrow">Source aperture</span><strong>${esc(f.path)}</strong><span class="tag">${f.variant==='candidate'?'PROPOSAL':'FIXTURE REVISION r3'}</span><button data-action="full">${state.full?'Show focused fragment':'Expand to file'}</button><button data-action="close-source">Return to map · Esc</button></div><div class="source-context"><span>WHY THIS CODE:</span>${f.goals.length?f.goals.map(id=>`<button data-goal="${id}">${esc(goals.find(g=>g.id===id).short)}</button>`).join(''):'<span>No approved requirement mapping · infrastructure stays visible</span>'}</div><div class="source-body"><pre class="source-code">${lines.map(({s,n})=>`<span class="line ${n===focus?'focus':''}" data-line="${n}"><span class="line-number">${n}</span>${esc(s)}</span>`).join('')}</pre><aside class="source-aside"><div class="eyebrow">Mechanism / evidence</div><p>${esc(f.reason)}</p><p>Hand-authored source mapping. ${f.kind==='test'?'Test source is a proposed oracle, not an executed test result.':'No runtime behavior is inferred from this source alone.'}</p><div class="eyebrow">Related by responsibility</div>${siblings.map(other=>`<button class="fragment" data-file="${files.indexOf(other)}"><small>${esc(other.name)} · ${other.kind}</small><pre>${esc(other.source.split('\n').slice(Math.max(0,other.line-1),other.line+3).join('\n'))}</pre></button>`).join('')}</aside></div><div class="source-footer"><button data-action="previous-file">←</button><span>${state.file+1} / 32</span><input type="range" min="0" max="31" value="${state.file}" id="source-reel" aria-label="Scrub source working set"><button data-action="next-file">→</button><span>${f.loc} lines · ${f.kind} · ${state.full?'file':'fragment'}</span></div></section>`;
 if(preserveReel && $('source-reel')) {
  const next=document.createElement('div');next.innerHTML=markup;
  for(const selector of ['.source-head','.source-context','.source-body']) {
   $('source-root').querySelector(selector).replaceWith(next.querySelector(selector));
  }
  const labels=$('source-root').querySelectorAll('.source-footer span');
  labels[0].textContent=(state.file+1)+' / 32';
  labels[1].textContent=f.loc+' lines · '+f.kind+' · '+(state.full?'file':'fragment');
 } else $('source-root').innerHTML=markup;
 const scroller=$('source-root').querySelector('.source-code');
 const row=$('source-root').querySelector('.line.focus');
 if(scroller&&row&&state.full)scroller.scrollTop=row.offsetTop-scroller.offsetTop-100;
}
function render(){
 $('questions').innerHTML=goals.map((g,i)=>`<button class="question ${g.id===state.goal?'active':''}" data-goal="${g.id}"><span class="number">0${i+1}</span><span>${esc(g.short)}<small>${esc(g.status)}</small></span></button>`).join('');
 $('path-goal').textContent=goal().short;
 $('path-view').textContent=state.view==='intent'?'declared responsibility':state.view==='machinery'?'implementation / ownership boundaries':(actors.find(a=>a.id===state.actor)?.name+' / process anatomy');
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
 $('aperture').textContent=state.wide?'Scope: whole system':'Scope: selected promise';
 $('candidate').classList.toggle('active',state.candidate);
 $('candidate').textContent=state.candidate?'Viewing simpler proposal · unverified':'Compare simpler proposal';
 $('peel-control').style.visibility=state.view==='machinery'?'visible':'hidden';
 $('scene-heading').textContent=state.view==='intent'?'The promise and its obligations':state.view==='machinery'?'What this promise actually costs':'A GenServer is a state / message / failure boundary';
 $('scene-description').textContent=state.view==='intent'?'Select a responsibility. Shared code and unresolved mappings remain explicit.':state.view==='machinery'?'Open a process to inspect its anatomy. Open a decision or external owner to inspect its source.':'Open the callback chamber to reach code. Choose a recorded scenario step to inspect ownership changes.';
 $('next-action').textContent=state.view==='intent'?'Reveal implementation →':state.view==='machinery'?(state.candidate?'Open Authority →':'Open CommandWorker →'):'Open current callback →';
 const recorded=state.view==='anatomy'&&state.actor==='worker'&&!state.candidate;
 $('journey').hidden=!recorded;
 $('journey').innerHTML=recorded?`<span class="eyebrow" style="align-self:center;margin-right:8px">One fixture scenario / causal steps</span>`+observations.map((o,i)=>`<button data-step="${i}" class="${i===state.step?'active':''}">${i+1} · ${esc(o.name)}</button>`).join(''):'';
 $('map').innerHTML=state.view==='intent'?intentMap():state.view==='machinery'?machineryMap():anatomyMap();
 $('canvas-note').textContent=state.view==='intent'?'Correspondence is many-to-many. A requirement mapping is a hypothesis about implementation, not proof of fulfillment.':state.view==='machinery'?'Why a process? State ownership, concurrency, or failure isolation. “It is a module” is not a runtime reason.':'Different PID ≠ continuous state. Durable progress and remote truth are independent owners.';
 renderReview();renderFiles();renderSource();
}
function act(target){
 const t=target.closest('[data-goal],[data-view],[data-file],[data-actor],[data-step],[data-action]');if(!t)return;
 if(t.dataset.goal)chooseGoal(t.dataset.goal);
 else if(t.dataset.view)chooseView(t.dataset.view);
 else if(t.dataset.file!==undefined)openFile(Number(t.dataset.file));
 else if(t.dataset.actor)openActor(t.dataset.actor);
 else if(t.dataset.step!==undefined){state.step=Number(t.dataset.step);state.source=false;render();}
 else if(t.dataset.action==='close-source'){state.source=false;renderSource();}
 else if(t.dataset.action==='full'){state.full=!state.full;renderSource();}
 else if(t.dataset.action==='previous-file')openFile(Math.max(0,state.file-1));
 else if(t.dataset.action==='next-file')openFile(Math.min(files.length-1,state.file+1));
}
document.addEventListener('click',e=>act(e.target));
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.matches('g[role=button]')){e.preventDefault();act(e.target);return;}
 if(e.key==='Escape'){state.source=false;renderSource();return;}
 if(e.target instanceof HTMLInputElement && e.target.type!=='range')return;
 if(['1','2','3'].includes(e.key)){chooseView(['intent','machinery','anatomy'][Number(e.key)-1]);}
 else if(e.key==='['||e.key===']'){e.preventDefault();openFile(Math.max(0,Math.min(files.length-1,state.file+(e.key===']'?1:-1))));}
 else if(e.key==='/'){e.preventDefault();$('file-search').focus();}
 else if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();const old=state.history.pop();if(old){Object.assign(state,old);render();}}
});
$('aperture').onclick=()=>{state.wide=!state.wide;render();};
$('candidate').onclick=()=>{state.candidate=!state.candidate;state.source=false;state.view='machinery';render();};
$('next-action').onclick=()=>{
 if(state.view==='intent')chooseView('machinery');
 else if(state.view==='machinery')openActor(state.candidate?'authority':'worker');
 else openFile(state.actor==='worker'&&!state.candidate?byName(observations[state.step].file):fileFor(actors.find(a=>a.id===state.actor).file));
};
$('peel').oninput=e=>{state.peel=Number(e.target.value);$('map').innerHTML=machineryMap();};
$('file-search').oninput=e=>{state.query=e.target.value;renderFiles();};
$('file-reel').oninput=e=>{state.file=Number(e.target.value);state.source=true;renderSource();renderFiles();};
// The source scrubber stays attached while dragged; update the source aperture around it.
document.addEventListener('input',e=>{
 if(e.target.id!=='source-reel')return;
 state.file=Number(e.target.value);state.source=true;
 renderSource(true);renderFiles();
});
$('research-open').onclick=()=>$('research').showModal();
$('research-close').onclick=()=>$('research').close();
render();
})();
