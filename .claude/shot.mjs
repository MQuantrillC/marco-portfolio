// Capture desktop + mobile screenshots via headless Chrome (CDP).
// Run: node .claude/shot.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const profile = mkdtempSync(join(tmpdir(), 'shot-'));
const out = process.argv[2] || '.claude';

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

let page;
for (let i = 0; i < 50; i++) {
  try {
    const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    page = l.find(t => t.type === 'page');
    if (page) break;
  } catch {}
  await sleep(200);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
let id = 0;
const pend = new Map();
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
};
const send = (method, params = {}) => new Promise(r => {
  const i = ++id; pend.set(i, r);
  ws.send(JSON.stringify({ id: i, method, params }));
});
const ev = async e => (await send('Runtime.evaluate',
  { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
const shot = async f => {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(f, Buffer.from(r.result.data, 'base64'));
  console.log('wrote', f);
};

await send('Runtime.enable');
await send('Page.enable');

await send('Emulation.setDeviceMetricsOverride',
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:3000/' });
await sleep(5000);
await sleep(1500);
await shot(join(out, 'a-hero.png'));
for (const [name, sel] of [['b-work','#work'],['c-about','#about'],['d-reel','#reel'],['e-contact','#contact']]) {
  await ev(`window.scrollTo({top: document.querySelector('${sel}').offsetTop, behavior:'instant'})`);
  await sleep(2200);
  await shot(join(out, name + '.png'));
}

await send('Emulation.setDeviceMetricsOverride',
  { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://localhost:3000/' });
await sleep(4500);
await sleep(1500);
await shot(join(out, 'm-hero.png'));
await ev(`window.scrollTo({top: document.querySelector('#work').offsetTop, behavior:'instant'})`);
await sleep(2000);
await shot(join(out, 'm-work.png'));

chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
