// Screenshots every step of every slide, so the animated slides can be checked
// without clicking through them by hand.
//
// Usage: npm run shots                     all slides (builds first)
//        npm run shots -- big-picture      only the slides with these ids
//
// Writes shots/<nn>-<slide id>-<step>.png (1600×900). Serves dist/ with vite preview
// and drives the deck through window.deck, the same way the keyboard does.
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-chromium';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = fileURLToPath(new URL('../shots/', import.meta.url));
const only = process.argv.slice(2);
const SETTLE_MS = 400; // the timeline bar animates to a new stop in .28s

const server = await preview({ root, logLevel: 'silent', preview: { port: 4174, open: false } });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.deck && window.deck.engine);
  await page.addStyleTag({ content: '#pager { display: none }' });
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.evaluate(() => window.deck.slides.map((s) => s.id));
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  for (const [i, id] of slides.entries()) {
    if (only.length && !only.includes(id)) continue;
    const points = await page.evaluate((n) => {
      window.deck.show(n);
      const e = window.deck.engine;
      e.anims().filter((a) => e.isIntro(a)).forEach((a) => a.finish());
      return e.navPoints();
    }, i);
    for (const [k, ms] of points.entries()) {
      await page.evaluate((t) => window.deck.engine.seekAll(t, false), ms);
      await page.waitForTimeout(SETTLE_MS);
      const file = `${String(i + 1).padStart(2, '0')}-${id}-${k}.png`;
      await page.locator('#stage').screenshot({ path: out + file });
    }
    console.log(`${id}: ${points.length} steps`);
  }
} finally {
  await browser.close();
  server.httpServer.close();
}
