// Renders the 1200x630 social card in the site's own design language,
// using the real webfonts via headless Chrome. Run: node .claude/make-og.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, unlinkSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9339;
const profile = mkdtempSync(join(tmpdir(), 'og-'));

const flagB64 = readFileSync('public/images/personal-flag.webp').toString('base64');
const portraitB64 = readFileSync('public/images/Personal-Photo-5.webp').toString('base64');

const shim = join(process.cwd(), '.claude', '__og.html');
writeFileSync(shim, `<!doctype html><meta charset=utf-8>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#F2F0EB;color:#0C0C0C;
       font-family:'JetBrains Mono',monospace;overflow:hidden;position:relative}
  .pad{padding:44px 56px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .bar{display:flex;align-items:center;justify-content:space-between;
       border-top:6px solid #0C0C0C;padding-top:14px;
       font-size:15px;letter-spacing:.18em;text-transform:uppercase}
  .bar.b{border-top-width:2px}
  .left{display:flex;align-items:center;gap:16px}
  .left img{height:40px;width:auto;display:block}
  h1{font-family:Anton,sans-serif;font-size:132px;line-height:.86;
     text-transform:uppercase;letter-spacing:-.01em}
  .tag{font-family:'Instrument Serif',serif;font-style:italic;font-size:40px;margin-top:22px}
  .who{display:flex;align-items:flex-end;gap:18px}
  .who img{width:92px;height:92px;object-fit:cover;filter:grayscale(1)}
  .who p{font-size:15px;letter-spacing:.16em;text-transform:uppercase;line-height:1.7;color:#6b6862}
  .accent{color:#FF3B00}
</style>
<div class="pad">
  <div class="bar">
    <span class="left"><img src="data:image/webp;base64,${flagB64}">Lima, Peru</span>
    <span>Software Developer &amp; Business Analyst</span>
  </div>
  <div>
    <h1>Marco<br>Quantrill</h1>
    <div class="tag">I build tools that turn data into decisions<span class="accent">.</span></div>
  </div>
  <div class="bar b">
    <span class="who">
      <img src="data:image/webp;base64,${portraitB64}">
      <p>Next.js &middot; TypeScript &middot; Python &middot; SQL<br>quantrillmarco@gmail.com</p>
    </span>
    <span>05 Projects</span>
  </div>
</div>`);

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
  { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(shim).href });
await sleep(6000);   // let the webfonts land

const shot = await send('Page.captureScreenshot', {
  format: 'jpeg', quality: 90,
  clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
});
writeFileSync('public/images/og-image.jpg', Buffer.from(shot.result.data, 'base64'));
console.log('wrote public/images/og-image.jpg');

unlinkSync(shim);
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
