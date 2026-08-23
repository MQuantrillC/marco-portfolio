// Exercises the flag: waits for the periodic hint, opens the expanded view,
// closes it with Escape. Captures a screenshot at each step.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9341;
const profile = mkdtempSync(join(tmpdir(), 'flag-'));
const out = '.claude';
const W = Number(process.argv[2] || 1440);
const H = Number(process.argv[3] || 900);
const tag = process.argv[4] || 'desk';

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let page;
for (let i = 0; i < 60; i++) {
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
  writeFileSync(join(out, f), Buffer.from(r.result.data, 'base64'));
  console.log('  wrote', f);
};

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',
  { width: W, height: H, deviceScaleFactor: tag === 'mob' ? 2 : 1, mobile: tag === 'mob' });
await send('Page.navigate', { url: 'http://localhost:3000/' });
await sleep(4000);

console.log(`[${tag}] hint hidden on load:`,
  (await ev(`!document.querySelector('[role="status"]')`)) === true);

// The hint is scheduled for ~7s after mount.
await sleep(5000);
const hintUp = await ev(`!!document.querySelector('[role="status"]')`);
console.log(`[${tag}] hint appeared after ~7s:`, hintUp);
console.log(`[${tag}] hint text:`,
  await ev(`(document.querySelector('[role="status"]')?.innerText||'').replace(/\\n/g,' | ')`));
await shot(`flag-${tag}-1-hint.png`);

// Open the expanded view.
await ev(`document.querySelector('header button[aria-label*="bandera"]').click()`);
await sleep(1200);
console.log(`[${tag}] dialog open:`, await ev(`!!document.querySelector('[role="dialog"]')`));
console.log(`[${tag}] page scroll locked:`,
  (await ev(`getComputedStyle(document.body).overflow`)) === 'hidden');
console.log(`[${tag}] large image loaded:`,
  await ev(`(()=>{const i=document.querySelector('[role="dialog"] img');return !!i&&i.complete&&i.naturalWidth>0})()`));
await shot(`flag-${tag}-2-open.png`);

// Escape closes it and restores scrolling.
await send('Input.dispatchKeyEvent',
  { type: 'rawKeyDown', windowsVirtualKeyCode: 27, code: 'Escape', key: 'Escape' });
await send('Input.dispatchKeyEvent',
  { type: 'keyUp', windowsVirtualKeyCode: 27, code: 'Escape', key: 'Escape' });
await sleep(900);
console.log(`[${tag}] dialog closed by Escape:`,
  (await ev(`!document.querySelector('[role="dialog"]')`)) === true);
console.log(`[${tag}] scroll restored:`,
  (await ev(`getComputedStyle(document.body).overflow`)) !== 'hidden');

// And the nudge should not come back once acknowledged.
await sleep(9000);
console.log(`[${tag}] hint stays away after opening:`,
  (await ev(`!document.querySelector('[role="status"]')`)) === true);

chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
