const fs=require('fs'),vm=require('vm'),assert=require('assert');
const app={innerHTML:'',addEventListener(){}};
const context=vm.createContext({document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},window:{setTimeout(){return 0},setInterval(){return 1}},clearTimeout(){},clearInterval(){},Date,console});
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../app.js'),'utf8'),context);
const evalUI=expression=>vm.runInContext(expression,context);
// A pinned source stays fixed even when global active source changes.
evalUI("state.pinned=true;state.pinnedSymbolId='recover';selectSymbol('journal')");
assert.equal(evalUI('state.pinnedSymbolId'),'recover');
assert(app.innerHTML.includes('CommandWorker.recover/2'));
console.log('✓ Pin invariant across source selection');
// Process mode does not cross worker incarnation, role mode does.
evalUI("state.view='cinema';state.run='fail';state.eventIndex=7;state.follow='process';stepEvent(1)");
assert.equal(evalUI('state.eventIndex'),7);
evalUI("state.follow='role';stepEvent(1)");
assert.equal(evalUI('state.eventIndex'),8);
console.log('✓ Distinct process and logical-role following');
// Causal mode traverses ONLY stored relations; it does not skip to the next event by time.
evalUI("state.follow='causal';state.eventIndex=7;stepEvent(1)");
assert.equal(evalUI('state.eventIndex'),8);
evalUI('stepEvent(1)');
assert.equal(evalUI('state.eventIndex'),8);
console.log('✓ Causal navigation constrained to supported edges');
// An event without a source reference renders an explicit unavailable state.
evalUI("state.eventIndex=0;state.view='cinema';render()");
assert(app.innerHTML.includes('No source span in this event'));
console.log('✓ Missing source never mapped speculatively');
// Site remains clear about external outcome uncertainty on both review and comparison.
evalUI("setView('review')");assert(app.innerHTML.includes('Two attempts do not prove two committed writes.'));
evalUI("setView('compare')");assert(app.innerHTML.includes('This is not proof of a duplicate committed effect.'));
console.log('✓ Evidence boundaries remain visible');
console.log('All interaction invariants passed.');
