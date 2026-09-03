// Converts a raw screenshot (PNG/JPG/WebP) into the 1400px-wide WebP the
// project rows expect. There is no PIL, ImageMagick or cwebp on this machine,
// so this reuses the same headless-Chrome-over-CDP trick as rasterize-flag.mjs.
//
// Run:  node .claude/make-project-shot.mjs <source-image> <out-name>
// e.g.  node .claude/make-project-shot.mjs C:/Users/Me/Desktop/rifthold.png My-Projects-7
//
// Prints the final width/height so you can paste them into src/lib/content.ts.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9339;
const OUT_W = 1400;      // matches every other project screenshot
const QUALITY = 88;

const [src, name = 'My-Projects-7'] = process.argv.slice(2);
if (!src) {
  console.error('usage: node .claude/make-project-shot.mjs <source-image> [out-name]');
  process.exit(1);
}
const srcPath = resolve(src);
if (!existsSync(srcPath)) {
  console.error(`no such file: ${srcPath}`);
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), 'shot-'));
const shim = join(process.cwd(), '.claude', '__shotshim.html');
const srcUrl = pathToFileURL(srcPath).href;

// The image is laid out at exactly OUT_W wide so the capture needs no scaling.
writeFileSync(shim, `<!doctype html><meta charset=utf-8>
<style>html,body{margin:0;padding:0;background:#000}
img{display:block;width:${OUT_W}px;height:auto}</style>
<img id=i src="${srcUrl}">`);
const shimUrl = pathToFileURL(shim).href;

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--allow-file-access-from-files', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let page;
for (let i = 0; i < 60; i++) {
  try {
    const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    page = l.find((t) => t.type === 'page');
    if (page) break;
  } catch {}
  await sleep(200);
}
if (!page) {
  console.error('could not reach headless Chrome - check the CHROME path at the top of this file');
  chrome.kill();
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0;
const pend = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
};
const send = (method, params = {}) => new Promise((r) => {
  const i = ++id; pend.set(i, r);
  ws.send(JSON.stringify({ id: i, method, params }));
});
const ev = async (expr) => (await send('Runtime.evaluate',
  { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;

await send('Page.enable');
await send('Runtime.enable');
// Tall viewport first so the image is never clipped before we measure it.
await send('Emulation.setDeviceMetricsOverride',
  { width: OUT_W, height: 2000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: shimUrl });

// Wait for decode rather than guessing at a fixed delay.
const natural = await ev(`
  new Promise(res => {
    const i = document.getElementById('i');
    const done = () => res(i.naturalWidth + 'x' + i.naturalHeight);
    if (i.complete && i.naturalWidth) done(); else i.onload = done;
  })
`);
if (!natural || natural.startsWith('0x')) {
  console.error('image failed to decode');
  chrome.kill();
  process.exit(1);
}
const [natW, natH] = natural.split('x').map(Number);
const outH = Math.round((OUT_W * natH) / natW);

await send('Emulation.setDeviceMetricsOverride',
  { width: OUT_W, height: outH, deviceScaleFactor: 1, mobile: false });
await sleep(300);

const shot = await send('Page.captureScreenshot', {
  format: 'webp',
  quality: QUALITY,
  clip: { x: 0, y: 0, width: OUT_W, height: outH, scale: 1 },
  captureBeyondViewport: true,
});

const out = `public/images/${name}.webp`;
const buf = Buffer.from(shot.result.data, 'base64');
writeFileSync(out, buf);
console.log(`wrote ${out}  ${OUT_W}x${outH}  (${(buf.length / 1024).toFixed(0)}KB)  from ${natW}x${natH}`);
console.log(`content.ts:  width: ${OUT_W},  height: ${outH},`);

unlinkSync(shim);
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
