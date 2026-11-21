#!/usr/bin/env node
// Screenshot a page at several viewports and measure what the lift skills need as evidence.
// Usage: node probe.mjs <url> [--label before] [--out .lift] [--viewports 375,768,1280] [--full-page] [--wait 300]
// Requires `playwright` (or `playwright-core` with a browser) resolvable from the current directory.
// Output: <out>/<label>/<width>.png and <out>/<label>/metrics.json
// The numbers are leads to confirm in the screenshot, not verdicts.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const o = { label: 'before', out: '.lift', viewports: [375, 768, 1280], fullPage: false, wait: 300 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--label') o.label = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--viewports') o.viewports = argv[++i].split(',').map(Number);
    else if (a === '--full-page') o.fullPage = true;
    else if (a === '--wait') o.wait = Number(argv[++i]);
    else rest.push(a);
  }
  o.url = rest[0];
  return o;
}

async function loadPlaywright() {
  const require = createRequire(join(process.cwd(), 'noop.js'));
  for (const name of ['playwright', 'playwright-core', '@playwright/test']) {
    try {
      const mod = await import(pathToFileURL(require.resolve(name)).href);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch {
      // try the next package name
    }
  }
  console.error(
    'probe.mjs: playwright is not resolvable from ' + process.cwd() + '.\n' +
      'Install it in the app (pnpm add -D playwright && pnpm exec playwright install chromium),\n' +
      'or capture screenshots another way and state that measurements were not run.',
  );
  process.exit(3);
}

// Runs in the page. Must be self-contained.
function measure() {
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => {
    const l = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * l(c.r) + 0.7152 * l(c.g) + 0.0722 * l(c.b);
  };
  const ratio = (f, b) => { const [h, l] = [lum(f), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const sel = (el) => {
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && parts.length < 4; e = e.parentElement) {
      let s = e.tagName.toLowerCase();
      if (e.id) { parts.unshift(s + '#' + e.id); break; }
      const cls = [...e.classList].slice(0, 2).join('.');
      if (cls) s += '.' + cls;
      parts.unshift(s);
    }
    return parts.join(' > ');
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  // Effective background: composite ancestors' background colors over white. Images/gradients are flagged, not resolved.
  const backdrop = (el) => {
    const layers = [];
    let image = false;
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') image = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of layers.reverse()) bg = over(c, bg);
    return { bg, image };
  };

  const all = [...document.body.querySelectorAll('*')].filter(visible);
  const textEls = all.filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0));

  const styles = new Map();
  const contrastFailures = [];
  const aligns = {};
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const { bg, image } = backdrop(el);
    let fg = parse(cs.color);
    if (!fg) continue;
    // opacity on the element or an ancestor dims the text too
    let op = 1;
    for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
    fg = over({ ...fg, a: fg.a * op }, bg);
    const key = `${px}px/${weight}/${hex(fg)}`;
    const cur = styles.get(key) ?? { size: px, weight, color: hex(fg), count: 0, sample: el.textContent.trim().slice(0, 40), selector: sel(el) };
    cur.count++;
    styles.set(key, cur);
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const r = ratio(fg, bg);
    if (r < (large ? 3 : 4.5)) {
      contrastFailures.push({ selector: sel(el), text: el.textContent.trim().slice(0, 40), fg: hex(fg), bg: hex(bg), ratio: Math.round(r * 100) / 100, need: large ? 3 : 4.5, overImage: image });
    }
    // control labels are centered by convention; they say nothing about block alignment
    if (!el.closest('button, [role="button"], input, select, summary')) {
      const ta = cs.textAlign === 'start' ? 'left' : cs.textAlign;
      aligns[ta] = (aligns[ta] ?? 0) + 1;
    }
  }

  // Borders
  const borders = new Map();
  let bordered = 0;
  for (const el of all) {
    const cs = getComputedStyle(el);
    let has = false;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(cs[`border${side}Width`]);
      const st = cs[`border${side}Style`];
      const c = parse(cs[`border${side}Color`]);
      if (w > 0 && st !== 'none' && st !== 'hidden' && c && c.a > 0) {
        has = true;
        const { bg } = backdrop(el.parentElement ?? el);
        const col = over(c, bg);
        const key = `${w}px ${st} ${hex(col)}`;
        const cur = borders.get(key) ?? { width: w, style: st, color: hex(col), sides: 0, contrastVsSurface: Math.round(ratio(col, bg) * 100) / 100, selector: sel(el) };
        cur.sides++;
        borders.set(key, cur);
      }
    }
    if (has) bordered++;
  }

  // Shadows
  const shadows = new Map();
  for (const el of all) {
    const v = getComputedStyle(el).boxShadow;
    if (!v || v === 'none') continue;
    const c = parse(v);
    const cur = shadows.get(v) ?? { value: v, alpha: c ? c.a : null, count: 0, selector: sel(el) };
    cur.count++;
    shadows.set(v, cur);
  }

  // Left edges: containers whose direct children start on several different x positions.
  const raggedColumns = [];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const row = (cs.display.includes('flex') && cs.flexDirection.startsWith('row')) || cs.display.includes('grid');
    if (row) continue;
    const kids = [...el.children].filter(visible).filter((k) => getComputedStyle(k).position !== 'absolute' && getComputedStyle(k).position !== 'fixed');
    if (kids.length < 3) continue;
    const lefts = [...new Set(kids.map((k) => {
      // use the text/content start, not the box, for centered or right-aligned children
      const range = document.createRange();
      range.selectNodeContents(k);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      const x = rects.length ? Math.min(...rects.map((r) => r.left)) : k.getBoundingClientRect().left;
      return Math.round(x);
    }))];
    if (lefts.length >= 3) raggedColumns.push({ selector: sel(el), children: kids.length, distinctLeftEdges: lefts.length, edges: lefts.sort((a, b) => a - b).slice(0, 8) });
  }

  // Vertical gaps between consecutive siblings in stacked containers, and radius inventory.
  const gaps = new Map();
  const radii = new Map();
  for (const el of all) {
    const cs = getComputedStyle(el);
    const rad = cs.borderTopLeftRadius;
    if (rad && rad !== '0px') radii.set(rad, (radii.get(rad) ?? 0) + 1);
    const row = (cs.display.includes('flex') && cs.flexDirection.startsWith('row')) || cs.display.includes('grid');
    if (row) continue;
    const kids = [...el.children].filter(visible).filter((k) => !['absolute', 'fixed'].includes(getComputedStyle(k).position));
    for (let i = 1; i < kids.length; i++) {
      const g = Math.round(kids[i].getBoundingClientRect().top - kids[i - 1].getBoundingClientRect().bottom);
      if (g > 0 && g < 200) gaps.set(g, (gaps.get(g) ?? 0) + 1);
    }
  }
  const tally = (m) => [...m.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count).slice(0, 25);

  const styleList = [...styles.values()].sort((a, b) => b.count - a.count);
  const sizes = [...new Set(styleList.map((s) => s.size))].sort((a, b) => a - b);
  return {
    title: document.title,
    viewport: { width: innerWidth, height: innerHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    text: {
      elements: textEls.length,
      distinctStyles: styleList.length,
      distinctSizes: sizes,
      distinctWeights: [...new Set(styleList.map((s) => s.weight))].sort((a, b) => a - b),
      distinctColors: [...new Set(styleList.map((s) => s.color))],
      styles: styleList.slice(0, 40),
      alignment: aligns,
    },
    contrastFailures: contrastFailures.slice(0, 60),
    borders: { borderedElements: bordered, distinct: [...borders.values()].sort((a, b) => b.sides - a.sides).slice(0, 30) },
    shadows: { distinct: [...shadows.values()].sort((a, b) => b.count - a.count).slice(0, 20) },
    raggedColumns: raggedColumns.sort((a, b) => b.distinctLeftEdges - a.distinctLeftEdges).slice(0, 20),
    spacing: { verticalGapsPx: tally(gaps) },
    radii: tally(radii),
  };
}

// Tab through the page and record order and whether each stop shows a focus indicator.
async function focusPass(page, max = 60) {
  const stops = [];
  const seen = new Set();
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      if (!el.dataset.liftFocusId) el.dataset.liftFocusId = String(document.querySelectorAll('[data-lift-focus-id]').length + 1);
      const cs = getComputedStyle(el);
      const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const r = el.getBoundingClientRect();
      const name = (el.getAttribute('aria-label') || el.textContent || el.value || el.id || '').trim().slice(0, 40);
      return { id: el.dataset.liftFocusId, tag: el.tagName.toLowerCase(), name, x: Math.round(r.left), y: Math.round(r.top + scrollY), outline, boxShadow: cs.boxShadow, borderColor: cs.borderTopColor, background: cs.backgroundColor };
    });
    if (!stop || seen.has(stop.id)) break;
    seen.add(stop.id);
    stops.push(stop);
  }
  // Compare with the unfocused style to catch indicators done with shadow, border or fill.
  await page.evaluate(() => document.activeElement?.blur());
  const rest = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-lift-focus-id]')].map((el) => {
    const cs = getComputedStyle(el);
    return [el.dataset.liftFocusId, { boxShadow: cs.boxShadow, borderColor: cs.borderTopColor, background: cs.backgroundColor }];
  })));
  const noVisibleFocus = [];
  let outOfOrder = 0;
  stops.forEach((s, i) => {
    const r = rest[s.id] ?? {};
    const changed = s.boxShadow !== r.boxShadow || s.borderColor !== r.borderColor || s.background !== r.background;
    if (!s.outline && !changed) noVisibleFocus.push(`${s.tag} "${s.name}"`);
    // moving up into a column further right is normal; up and not rightward suggests DOM order differs from visual order
    if (i > 0 && s.y < stops[i - 1].y - 8 && s.x <= stops[i - 1].x) outOfOrder++;
  });
  return { stops: stops.length, order: stops.map((s) => `${s.tag} "${s.name}"`), noVisibleFocus, backwardJumps: outOfOrder };
}

const o = parseArgs(process.argv.slice(2));
if (!o.url) {
  console.error('Usage: probe.mjs <url> [--label before] [--out .lift] [--viewports 375,768,1280] [--full-page] [--wait 300]');
  process.exit(2);
}
if (o.viewports.some((v) => !Number.isFinite(v) || v <= 0)) {
  console.error('probe.mjs: --viewports must be a comma-separated list of widths');
  process.exit(2);
}
const chromium = await loadPlaywright();
const dir = resolve(o.out, o.label);
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const metrics = { url: o.url, label: o.label, capturedAt: new Date().toISOString(), viewports: {} };
try {
  for (const width of o.viewports) {
    const page = await browser.newPage({ viewport: { width, height: Math.round(width * (width < 600 ? 2 : 0.7)) } });
    await page.goto(o.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(o.wait);
    await page.screenshot({ path: join(dir, `${width}.png`), fullPage: o.fullPage });
    metrics.viewports[width] = await page.evaluate(measure);
    if (width === Math.max(...o.viewports)) metrics.focus = await focusPass(page);
    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(join(dir, 'metrics.json'), JSON.stringify(metrics, null, 2));
const widest = metrics.viewports[Math.max(...o.viewports)];
console.log(`probe: ${dir}`);
console.log(
  `  ${o.viewports.join('/')}px captured | text styles ${widest.text.distinctStyles} (sizes ${widest.text.distinctSizes.join(', ')}) | ` +
    `contrast failures ${widest.contrastFailures.length} | bordered elements ${widest.borders.borderedElements} | ` +
    `distinct shadows ${widest.shadows.distinct.length} | ragged columns ${widest.raggedColumns.length} | ` +
    `alignment ${JSON.stringify(widest.text.alignment)} | tab stops ${metrics.focus.stops}, no visible focus ${metrics.focus.noVisibleFocus.length}`,
);
