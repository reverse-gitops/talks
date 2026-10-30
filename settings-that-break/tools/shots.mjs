// One PNG per click of every slide, taken from a running dev server (npm run dev).
//   npm run shots                 all slides → shots/<slide>-<click>.png
//   npm run shots -- 2 3          only slides 2 and 3
//   BASE=http://127.0.0.1:3031 npm run shots
// Each click is opened directly (?clicks=n) and given SETTLE ms for its animations.
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-chromium';

const BASE = process.env.BASE || 'http://127.0.0.1:3030';
const SETTLE = Number(process.env.SETTLE || 2500);
const OUT = new URL('../shots/', import.meta.url);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(m.type(), m.text()); });

await page.goto(`${BASE}/1`, { waitUntil: 'networkidle' });
const total = await page.evaluate(() => window.__slidev__?.nav?.slides?.length ?? 0);
const wanted = process.argv.slice(2).map(Number);
const slides = wanted.length ? wanted : Array.from({ length: total }, (_, i) => i + 1);

for (const no of slides) {
  await page.goto(`${BASE}/${no}?clicks=0`, { waitUntil: 'networkidle' });
  const clicks = await page.evaluate(() => window.__slidev__?.nav?.clicksTotal ?? 0);
  for (let c = 0; c <= clicks; c++) {
    await page.goto(`${BASE}/${no}?clicks=${c}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(SETTLE);
    const file = new URL(`${String(no).padStart(2, '0')}-${c}.png`, OUT);
    await page.screenshot({ path: file.pathname });
    console.log(file.pathname);
  }
}
await browser.close();
