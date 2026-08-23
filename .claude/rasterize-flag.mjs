// Renders the traced colour SVG down to a small transparent raster.
// The source is a 1.1MB auto-trace (1903 paths, 1656 near-identical fills)
// for a mark displayed at ~40px - vector buys nothing here and costs a lot.
// Run:  node .claude/rasterize-flag.mjs   (no server needed)
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9338;
const OUT_W = 900;                 // ~20x the display size; plenty for 3x screens
const SRC = 'public/images/personal-flag.svg';
const profile = mkdtempSync(join(tmpdir(), 'rast-'));

// The trace has width/height but no viewBox, so it cannot be scaled.
let svg = readFileSync(SRC, 'utf8');
if (!/viewBox=/.test(svg)) {
  const w = svg.match(/width="(\d+)"/)?.[1];
  const h = svg.match(/height="(\d+)"/)?.[1];
  svg = svg.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
  writeFileSync(SRC, svg);
  console.log(`injected viewBox="0 0 ${w} ${h}"`);
}
const natW = Number(svg.match(/width="(\d+)"/)[1]);
const natH = Number(svg.match(/height="(\d+)"/)[1]);
const outH = Math.round((OUT_W * natH) / natW);

// Rendered off a file:// URL - `next start` serves the built public/
// manifest and will 404 a shim written after the build.
const shim = join(process.cwd(), '.claude', '__flagshim.html');
const svgUrl = pathToFileURL(join(process.cwd(), SRC)).href;
writeFileSync(shim, `<!doctype html><meta charset=utf-8>
<style>html,body{margin:0;padding:0;background:transparent}
img{display:block;width:${OUT_W}px;height:${outH}px}</style>
<img src="${svgUrl}">`);
const shimUrl = pathToFileURL(shim).href;

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--allow-file-access-from-files', 'about:blank',
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

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',
  { width: OUT_W, height: outH, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setDefaultBackgroundColorOverride',
  { color: { r: 0, g: 0, b: 0, a: 0 } });
await send('Page.navigate', { url: shimUrl });
await sleep(4000);

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: { x: 0, y: 0, width: OUT_W, height: outH, scale: 1 },
  captureBeyondViewport: true,
});
writeFileSync('public/images/personal-flag.png', Buffer.from(shot.result.data, 'base64'));
console.log(`wrote personal-flag.png at ${OUT_W}x${outH}`);

unlinkSync(shim);
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
