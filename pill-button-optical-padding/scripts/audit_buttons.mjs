#!/usr/bin/env node
// Audit pill buttons on a page against the reel's math. Wraps scripts/measure-buttons.js in Playwright.
//   node scripts/audit_buttons.mjs <url-or-file.html> [--selector "button"] [--json out.json] [--width 1280]
// Playwright is resolved from the current directory, then from $PILL_PW_DIR. Exit 3 with a hint if missing.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const MEASURE_SRC = readFileSync(join(here, 'measure-buttons.js'), 'utf8');

export function loadPlaywright() {
  const dirs = [process.cwd(), process.env.PILL_PW_DIR].filter(Boolean);
  for (const d of dirs) {
    try { return createRequire(join(resolve(d), 'package.json'))('playwright'); } catch { /* next */ }
  }
  return null;
}

export function toUrl(target) {
  return /^https?:\/\//.test(target) ? target : pathToFileURL(resolve(target)).href;
}

export async function auditPage(target, { selector, width = 1280, height = 800, pw } = {}) {
  const playwright = pw || loadPlaywright();
  if (!playwright) {
    const err = new Error('playwright not found: run `pnpm add playwright` in the app, or set PILL_PW_DIR to a directory where it is installed');
    err.code = 3;
    throw err;
  }
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(toUrl(target), { waitUntil: 'load' });
    await page.evaluate(MEASURE_SRC);
    return await page.evaluate((sel) => window.measurePillButtons(sel), selector || null);
  } finally {
    await browser.close();
  }
}

export function formatReport(result) {
  const f = (n) => (n == null ? '-' : Number(n).toFixed(2));
  const lines = [];
  for (const b of result.buttons) {
    const kids = b.children.map((c) => `${c.role}${c.position.length ? '(' + c.position.join('+') + ')' : ''} start=${f(c.startDist)} end=${f(c.endDist)} m=${f(c.marginStart)}/${f(c.marginEnd)}`).join(' | ');
    lines.push(`${b.pass ? 'PASS' : 'FAIL'}  ${b.id}  "${b.text}"`);
    lines.push(`      font=${f(b.fontSize)} lh=${f(b.lh)} py=${f(b.py)} px=${f(b.px)} r=${f(b.r)}${b.rDeclared > b.r + 0.5 ? ` (declared ${f(b.rDeclared)})` : ''} pill=${f(b.pill)} gap=${f(b.gap)}`);
    lines.push(`      expect edge_icon=${f(b.expected.edgeIcon)} edge_label=${f(b.expected.edgeLabel)}  optical start=${f(b.optical.start)} end=${f(b.optical.end)}`);
    lines.push(`      ${kids}`);
    for (const [k, v] of Object.entries(b.checks)) lines.push(`      ${v ? 'ok ' : 'BAD'} ${k}`);
  }
  const passed = result.buttons.filter((b) => b.pass).length;
  lines.push(`${passed}/${result.buttons.length} buttons pass (tolerance ${result.tolerance}px)`);
  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) { console.error('usage: audit_buttons.mjs <url-or-file> [--selector css] [--json out.json] [--width n]'); process.exit(2); }
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  try {
    const result = await auditPage(target, { selector: opt('--selector'), width: Number(opt('--width')) || 1280 });
    const out = opt('--json');
    if (out) (await import('node:fs')).writeFileSync(out, JSON.stringify(result, null, 2));
    console.log(formatReport(result));
    process.exit(result.buttons.every((b) => b.pass) ? 0 : 1);
  } catch (e) {
    console.error(e.message);
    process.exit(e.code || 1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
