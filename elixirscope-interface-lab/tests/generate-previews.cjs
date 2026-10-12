/* Update read-only HTML compositions from compiled app.js (not screenshots). */
const fs=require('fs'),vm=require('vm'),path=require('path');
const base=path.resolve(__dirname,'..');
const app={innerHTML:'',addEventListener(){}};
const document={getElementById:id=>id==='app'?app:null,addEventListener(){},title:''};
const context=vm.createContext({document,localStorage:{getItem(){return null},setItem(){}},window:{setTimeout(){return 0},setInterval(){return 1}},clearTimeout(){},clearInterval(){},Date,console});
vm.runInContext(fs.readFileSync(path.join(base,'app.js'),'utf8'),context);
const views=['review','cinema','compare','topology','findings'];
fs.mkdirSync(path.join(base,'previews'),{recursive:true});
views.forEach((v,i)=>{
 vm.runInContext(`state.view='${v}';render()`,context);
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../assets/styles.css"><title>ElixirScope / ${v} / static preview</title></head><body><div id="app">${app.innerHTML}</div></body></html>`;
 const filename=path.join(base,'previews',`${String(i+1).padStart(2,'0')}-${v}.html`);
 fs.writeFileSync(filename,html);
 console.log('Generated',path.relative(base,filename));
});
