import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT=9336, profile=mkdtempSync(join(tmpdir(),'ev-'));
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,`--user-data-dir=${profile}`,'--no-first-run','--disable-gpu','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let page;
for(let i=0;i<50;i++){try{const l=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();page=l.find(t=>t.type==='page');if(page)break}catch{}await sleep(200)}
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r=>{ws.onopen=r});
let id=0;const pend=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}};
const send=(m,p={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}))});
const ev=async e=>(await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result?.result?.value;
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:process.argv[2]||'http://localhost:3000/'});
await sleep(5000);
console.log(await ev(process.argv[3]));
chrome.kill();try{rmSync(profile,{recursive:true,force:true})}catch{}
process.exit(0);
