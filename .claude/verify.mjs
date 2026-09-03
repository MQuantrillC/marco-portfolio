// Regression check for the portfolio. Drives real headless Chrome over CDP
// using Node 22's built-in WebSocket - no npm installs.
// Run:  npm run build && npx next start -p 3000
//       node .claude/verify.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_ = process.argv[2] || 'http://localhost:3000/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9337;
const profile = mkdtempSync(join(tmpdir(), 'verify-'));

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu',
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

try {
  const probe = await fetch(URL_);
  if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
} catch (e) {
  console.error(`\nCannot reach ${URL_} (${e.message}).`);
  console.error('Start it first:  npx next start -p 3000\n');
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
  process.exit(2);
}

async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find(t => t.type === 'page');
      if (p) return p;
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome did not expose a debugging target');
}

try {
  const page = await target();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  const consoleErrors = [];
  const failed = [];
  const reqUrls = new Map();

  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(m.params.exceptionDetails.text + ' ' +
        (m.params.exceptionDetails.exception?.description || ''));
    }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      consoleErrors.push(m.params.args.map(a => a.value ?? a.description).join(' '));
    }
    if (m.method === 'Network.requestWillBeSent') reqUrls.set(m.params.requestId, m.params.request.url);
    if (m.method === 'Network.loadingFailed') {
      failed.push(`${m.params.errorText} ${reqUrls.get(m.params.requestId) || '(unknown)'}`);
    }
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) {
      failed.push(`${m.params.response.status} ${m.params.response.url}`);
    }
  };

  const send = (method, params = {}) => new Promise(res => {
    const i = ++id; pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const ev = async expr => (await send('Runtime.evaluate',
    { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;

  await send('Runtime.enable');
  await send('Network.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ });
  await sleep(5000);

  // --- document ---
  check('title is set', (await ev('document.title')).includes('Marco Quantrill'));
  check('html lang="en"', (await ev('document.documentElement.lang')) === 'en');
  check('exactly one h1', (await ev(`document.querySelectorAll('h1').length`)) === 1);
  check('JSON-LD parses as Person',
    (await ev(`JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@type']`)) === 'Person');
  check('og:image is a jpg',
    (await ev(`document.querySelector('meta[property="og:image"]').content`)).endsWith('.jpg'));

  // --- fonts (regression guard: @theme vars must resolve on :root) ---
  check('display font resolves to Anton',
    (await ev(`getComputedStyle(document.querySelector('.type-mega')).fontFamily`)).includes('Anton'),
    await ev(`getComputedStyle(document.querySelector('.type-mega')).fontFamily.slice(0,40)`));
  check('label font resolves to JetBrains Mono',
    (await ev(`getComputedStyle(document.querySelector('.type-label')).fontFamily`)).includes('JetBrains'));
  check('body font resolves to Inter',
    (await ev(`getComputedStyle(document.body).fontFamily`)).includes('Inter'));
  check('all 4 webfonts actually loaded',
    await ev(`['Anton','Inter','Instrument Serif','JetBrains Mono'].every(f=>[...document.fonts].some(x=>x.family===f&&x.status==='loaded'))`),
    await ev(`[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family))].join(', ')`));

  // --- content ---
  check('6 projects rendered', (await ev(`document.querySelectorAll('#work article').length`)) === 6);
  check('every project has a live link',
    await ev(`[...document.querySelectorAll('#work article')].every(a=>a.querySelector('a[href*="vercel.app"],a[href*="streamlit.app"],a[href*="itch.io"]'))`));
  check('5 projects link to source (Rifthold ships without a public repo)',
    (await ev(`document.querySelectorAll('#work article a[href*="github.com"]').length`)) === 5);
  check('all external links use rel=noopener',
    await ev(`[...document.querySelectorAll('a[target="_blank"]')].every(a=>(a.rel||'').includes('noopener'))`),
    'count=' + await ev(`document.querySelectorAll('a[target="_blank"]').length`));
  check('no dead links (href empty or #)',
    await ev(`[...document.querySelectorAll('a')].every(a=>{const h=a.getAttribute('href');return h&&h!=='#'})`));
  check('9 reel cards', (await ev(`document.querySelectorAll('#reel button[aria-label^="Play"]').length`)) === 9);
  check('photo marquee has both tracks duplicated for seamless loop',
    (await ev(`document.querySelectorAll('section[aria-label="Photography"] img').length`)) === 32);
  check('no iframes before interaction (lazy)',
    (await ev(`document.querySelectorAll('iframe').length`)) === 0);

  // clicking a reel card swaps the poster for the real embed
  await ev(`document.querySelector('#reel button[aria-label^="Play"]').click()`);
  await sleep(1200);
  check('reel card loads iframe on click',
    (await ev(`document.querySelectorAll('#reel iframe').length`)) === 1);

  check('every local image declares width+height',
    await ev(`[...document.querySelectorAll('img')].filter(i=>!i.src.includes('youtube')).every(i=>i.getAttribute('width')&&i.getAttribute('height'))`));
  check('no broken images',
    await ev(`[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0&&!i.src.includes('youtube')).length===0`));

  // --- layout / motion ---
  await ev(`(async()=>{const h=document.documentElement.scrollHeight;
    for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}})()`);
  await sleep(2500);
  check('scroll progress bar advances',
    await ev(`(()=>{const b=document.querySelector('.fixed.top-0.h-1');if(!b)return false;const m=new DOMMatrix(getComputedStyle(b).transform);return m.a>0.5})()`));
  check('project cards revealed after scroll',
    await ev(`[...document.querySelectorAll('#work article')].every(a=>parseFloat(getComputedStyle(a).opacity)>0.9)`));
  check('no horizontal overflow (desktop 1440)',
    await ev('document.documentElement.scrollWidth <= document.documentElement.clientWidth'),
    await ev(`document.documentElement.scrollWidth+' vs '+document.documentElement.clientWidth`));

  // --- accessibility ---
  check('skip link present', await ev(`!!document.querySelector('a[href="#work"].sr-only')`));
  const pressTab = async () => {
    await send('Input.dispatchKeyEvent',
      { type: 'rawKeyDown', windowsVirtualKeyCode: 9, code: 'Tab', key: 'Tab' });
    await send('Input.dispatchKeyEvent',
      { type: 'keyUp', windowsVirtualKeyCode: 9, code: 'Tab', key: 'Tab' });
  };
  await ev(`window.scrollTo(0,0); document.body.focus()`);
  await pressTab();
  await sleep(250);
  check('keyboard focus shows a visible ring',
    (await ev(`(()=>{const a=document.activeElement;return a&&a!==document.body?getComputedStyle(a).outlineStyle:'no-focus'})()`)) !== 'none',
    'focused=' + await ev(`(document.activeElement.textContent||'').trim().slice(0,20)+' outline='+getComputedStyle(document.activeElement).outlineStyle`));
  check('reel play buttons have accessible names',
    await ev(`[...document.querySelectorAll('#reel button')].every(b=>(b.getAttribute('aria-label')||'').length>3)`));
  check('decorative marquee photos have empty alt',
    await ev(`[...document.querySelectorAll('section[aria-label="Photography"] img')].every(i=>i.getAttribute('alt')==='')`));

  // --- mobile ---
  for (const [w, h, label] of [[390, 844, '390'], [320, 700, '320']]) {
    await send('Emulation.setDeviceMetricsOverride',
      { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: URL_ });
    await sleep(3500);
    check(`no horizontal overflow (mobile ${label})`,
      await ev('document.documentElement.scrollWidth <= document.documentElement.clientWidth'),
      await ev(`document.documentElement.scrollWidth+' vs '+document.documentElement.clientWidth`));
    check(`hero name does not clip (mobile ${label})`,
      await ev(`(()=>{const e=document.querySelector('.type-mega');const r=e.getBoundingClientRect();return r.right<=innerWidth+1&&r.left>=-1})()`));
  }
  check('tap targets >= 44px on mobile',
    await ev(`[...document.querySelectorAll('a,button')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&b.height<44&&!e.closest('p')&&!e.className.includes('sr-only')}).length===0`),
    await ev(`[...document.querySelectorAll('a,button')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&b.height<44&&!e.closest('p')&&!e.className.includes('sr-only')}).map(e=>(e.textContent||'').trim().slice(0,18)+' '+Math.round(e.getBoundingClientRect().height)).join(' | ')||'none'`));

  const realErrors = consoleErrors.filter(e => !/youtube|doubleclick|googleads|play\.google|gstatic/i.test(e));
  check('no JS errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 300));
  const realFails = failed.filter(u => !/youtube|ytimg|doubleclick|googleads|google\.com|gstatic/i.test(u));
  check('no failed local requests', realFails.length === 0, realFails.join(' | ').slice(0, 300));

  ws.close();
} catch (err) {
  check('harness ran to completion', false, err.message);
} finally {
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

let failedCount = 0;
console.log('\n' + '='.repeat(74));
for (const r of results) {
  if (!r.pass) failedCount++;
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name.padEnd(50, ' ')} ${r.detail}`);
}
console.log('='.repeat(74));
console.log(`${results.length - failedCount}/${results.length} passed`);
process.exit(failedCount ? 1 : 0);
