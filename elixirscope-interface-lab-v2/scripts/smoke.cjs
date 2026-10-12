const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    assert.equal(await page.locator('.atlas-card').count(), 24);
    for (let i = 0; i < 22; i++) {
      await page.evaluate(i => window.setEventIndex(i), i);
      assert.match(await page.locator('.scrub-step').innerText(), new RegExp(`STEP ${String(i + 1).padStart(2, '0')}/22`));
      assert.equal(await page.locator('.col-live .is-active-line').count(), 1);
    }
    const files = new Set();
    for (let i = 0; i < 24; i++) {
      await page.evaluate(i => window.setFileIndex(i), i);
      files.add(await page.locator('.col-live .file-path-label').innerText());
      assert.ok(await page.locator('.col-live .code-line').count() > 5);
    }
    assert.equal(files.size, 24);
    await page.keyboard.press('/');
    await page.keyboard.type('pipeline');
    assert.equal(await page.locator('.atlas-search-input').inputValue(), 'pipeline');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'atlas-search-input');
    assert.ok(await page.locator('.atlas-card').count() < 24);
    await page.locator('.atlas-search-input').fill('');
    await page.locator('.brand-title').click();
    await page.keyboard.press('Control+k');
    assert.equal(await page.locator('.command-palette-modal').count(), 1);
    await page.keyboard.press('Escape');
    await page.keyboard.press('x');
    assert.match(await page.locator('.scrub-step').innerText(), /STEP 12/);
    await page.keyboard.press('p');
    const pinned = await page.locator('.col-pinned .file-path-label').innerText();
    await page.keyboard.press('d');
    assert.match(await page.locator('.scrub-step').innerText(), /STEP 20/);
    assert.equal(await page.locator('.col-pinned .file-path-label').innerText(), pinned);
    await page.locator('.follow-pill', { hasText: 'FREE' }).click();
    const free = await page.locator('.col-live .file-path-label').innerText();
    await page.keyboard.press('Home');
    assert.equal(await page.locator('.col-live .file-path-label').innerText(), free);
    await page.locator('.follow-pill', { hasText: 'ROLE' }).click();
    await page.keyboard.press('p');
    const range = page.locator('.master-scrub-input');
    const box = await range.boundingBox();
    assert.ok(box.width > 500);
    await page.mouse.move(box.x + 8, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 8, box.y + box.height / 2, { steps: 25 });
    await page.mouse.up();
    assert.match(await page.locator('.scrub-step').innerText(), /STEP 22/);
    await page.keyboard.press('Home');
    await page.keyboard.press('Space');
    await page.waitForTimeout(800);
    await page.keyboard.press('Space');
    assert.match(await page.locator('.scrub-step').innerText(), /STEP 02/);
    for (const lens of ['compare', 'supervision', 'evidence', 'cinema', 'review', 'cockpit']) {
      await page.evaluate(lens => window.setLens(lens), lens);
      assert.ok((await page.locator('.cockpit-main-viewport').innerText()).length > 100);
    }
    await page.keyboard.press('d');
    const rowHeight = await page.locator('.col-live .code-line').first().evaluate(e => e.getBoundingClientRect().height);
    assert.ok(rowHeight < 30, `Dense code row: ${rowHeight}px`);
    await page.screenshot({ path: path.resolve(__dirname, '../preview.png') });
    await page.setViewportSize({ width: 1280, height: 800 });
    assert.ok(await range.isVisible());
    assert.deepEqual(errors, []);
    console.log('PASS: direct-file boot, 22 events, 24 files, search, shortcuts, pinning, free mode, pointer scrubbing, playback, six lenses, dense code rows; no browser errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
