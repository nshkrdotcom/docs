/* Dependency-free smoke checks that run compiled UI code in a minimal DOM harness.
   This verifies render paths and command transitions. It is not a screenshot test. */
const fs=require('fs');const vm=require('vm');const assert=require('assert');
const app={innerHTML:'',addEventListener(){}};
const document={getElementById:(id)=>id==='app'?app:null,addEventListener(){},title:'',querySelectorAll(){return[]}};
const fakeStorage={getItem(){return null},setItem(){}};
const context=vm.createContext({document,localStorage:fakeStorage,console,window:{setTimeout(fn){return 0},setInterval(fn){return 1}},setTimeout(){return 0},clearTimeout(){},clearInterval(){},Blob:function(){},URL:{createObjectURL(){return 'blob:stub'},revokeObjectURL(){}},Date,DOMParser:class{}});
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../app.js'),'utf8'),context);
function run(cmd){return vm.runInContext(cmd,context);}
function includes(text){assert(app.innerHTML.includes(text),`Expected rendered screen to include ${JSON.stringify(text)}`)}
function test(name,code){run(code);assert(app.innerHTML.length>8000,'No meaningful screen HTML');console.log('✓ '+name+' ('+app.innerHTML.length+' chars)')}
includes('Recovery after worker restart');includes('CODEBASE / SEMANTIC REVIEW');includes('Possible repeat write after restart');
test('Semantic review / select changed symbol',"selectSymbol('recover')");includes('Possible external I/O');includes('PINNED REFERENCE');
test('Split source comparison',"state.diffMode='split';render()");includes('split-editor');
test('Cinema / selected crash',"setView('cinema')");includes('SYSTEM SCORE');includes('Worker process exited');includes('SEMANTIC');
test('Cinema / next recorded event',"state.follow='role';stepEvent(1)");includes('Process spawned');
test('Passing fixture events',"state.run='pass';state.eventIndex=6;render()");includes('Gateway result observed');
test('Aligned multi-run comparison',"setView('compare')");includes('Recovery write attempt');includes('Additional observed write attempt');
test('Topology / chosen node',"setView('topology')");includes('Architecture at the fault line');includes('Journal observation is not causally joined');
test('Findings ledger',"setView('findings')");includes('A review that can be challenged');includes('Recovery may repeat an external write');
test('Command palette',"state.paletteOpen=true;render()");includes('Jump to anything');
console.log('All offline render paths passed.');
