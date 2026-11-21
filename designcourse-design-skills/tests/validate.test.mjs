// Structural tests for the skill package. Run: node --test tests/
// Set LIFT_PW_DIR to a directory where `playwright` resolves to include the browser test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { contrastRatio, isLargeText, verdict, parseColor } from '../skills/lift-ui/scripts/contrast.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const skillNames = readdirSync(skillsDir).filter((d) => existsSync(join(skillsDir, d, 'SKILL.md')));
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const SPECIALISTS = ['lift-type', 'lift-layout', 'lift-surfaces', 'lift-color'];
const ID = /\b([MTLSC]\d{1,2})\b/g;

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, 'missing YAML frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { fm, body: text.slice(m[0].length) };
}

// Rule ids cited as "(T4)" or "(S6, S17)" in skill bodies and the checklist.
function citedIds(text) {
  const ids = new Set();
  for (const group of text.matchAll(/\(([MTLSC]\d{1,2}(?:,\s*[MTLSC]\d{1,2})*)\)/g)) {
    for (const id of group[1].split(/,\s*/)) ids.add(id);
  }
  return ids;
}

function evidenceRows() {
  const rows = new Map();
  for (const line of read('EVIDENCE.md').split('\n')) {
    const m = line.match(/^\|\s*([MTLSC]\d{1,2})\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/);
    if (m) rows.set(m[1], { rule: m[2].trim(), source: m[3].trim(), basis: m[4].trim() });
  }
  return rows;
}

test('package has the router and four specialists', () => {
  assert.deepEqual([...skillNames].sort(), ['lift-ui', ...SPECIALISTS].sort());
});

for (const name of skillNames) {
  test(`${name}: valid frontmatter and size budget`, () => {
    const text = read('skills', name, 'SKILL.md');
    const { fm, body } = frontmatter(text);
    assert.equal(fm.name, name, 'frontmatter name must equal directory name');
    assert.match(fm.name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(fm.name.length <= 64);
    assert.ok(fm.description && fm.description.length >= 80, 'description too short to trigger reliably');
    assert.ok(fm.description.length <= 1024, `description is ${fm.description.length} chars (max 1024)`);
    assert.match(fm.description, /existing/i, 'description must scope the skill to existing UIs');
    assert.match(fm.description, /\bUse when\b/, 'description must state when to use the skill');
    const lines = body.split('\n').length;
    const words = body.split(/\s+/).filter(Boolean).length;
    assert.ok(lines <= 120, `${lines} body lines (budget 120)`);
    assert.ok(words <= 1200, `${words} body words (budget 1200)`);
  });
}

test('router names every mode and every specialist, and has the gate', () => {
  const text = read('skills', 'lift-ui', 'SKILL.md');
  for (const s of SPECIALISTS) assert.ok(text.includes('`' + s + '`'), `router does not reference ${s}`);
  for (const mode of ['audit', 'type', 'layout', 'surfaces', 'color', 'full']) {
    assert.match(text, new RegExp(`^\\| ${mode} \\|`, 'm'), `mode table missing ${mode}`);
  }
  for (const heading of ['## Approval gate', '## Hold constant', '## Report', '## Process']) {
    assert.ok(text.includes(heading), `router missing section ${heading}`);
  }
  for (const word of ['before', 'contrast', '200% zoom', 'keyboard', 'focus', 'Residual issues']) {
    assert.ok(text.includes(word), `router does not mention ${word}`);
  }
  assert.ok(existsSync(join(skillsDir, 'lift-ui', 'references', 'audit-checklist.md')));
});

test('every cited rule id has an evidence row, and every evidence row is cited', () => {
  const rows = evidenceRows();
  assert.ok(rows.size >= 80, `only ${rows.size} evidence rows parsed`);
  const cited = new Set();
  for (const name of skillNames) for (const id of citedIds(read('skills', name, 'SKILL.md'))) cited.add(id);
  const missing = [...cited].filter((id) => !rows.has(id));
  assert.deepEqual(missing, [], `cited without evidence: ${missing.join(', ')}`);
  const orphan = [...rows.keys()].filter((id) => !cited.has(id));
  assert.deepEqual(orphan, [], `evidence rows no skill cites: ${orphan.join(', ')}`);
  for (const id of citedIds(read('skills', 'lift-ui', 'references', 'audit-checklist.md'))) {
    assert.ok(rows.has(id), `checklist cites unknown rule ${id}`);
  }
});

test('each skill cites only its own rule prefix', () => {
  const prefix = { 'lift-type': 'T', 'lift-layout': 'L', 'lift-surfaces': 'S', 'lift-color': 'C', 'lift-ui': 'M' };
  for (const name of skillNames) {
    for (const id of citedIds(read('skills', name, 'SKILL.md'))) {
      assert.equal(id[0], prefix[name], `${name} cites ${id}`);
    }
  }
});

test('evidence rows are sourced or explicitly marked standard', () => {
  for (const [id, row] of evidenceRows()) {
    const hasVideo = /V[1-7] \d{2}:\d{2}/.test(row.source);
    if (!hasVideo) assert.match(row.basis, /standard/, `${id} has no video timestamp and is not marked standard`);
    assert.match(row.basis, /stated|shown|inferred|standard/, `${id} has no basis`);
  }
});

test('every source video has an extraction file with required sections', () => {
  const ev = read('EVIDENCE.md');
  const ids = [...ev.matchAll(/watch\?v=([\w-]{11}) \|/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, 7, 'expected seven distinct source videos in the Sources table');
  for (const id of new Set(ids)) {
    const p = join(root, 'research', id, 'extraction.md');
    assert.ok(existsSync(p), `missing research/${id}/extraction.md`);
    const t = readFileSync(p, 'utf8');
    for (const h of ['## Source', '## Access record', '## Timestamped findings', '## Practical rules', '## Uncertainty and limitations']) {
      assert.ok(t.includes(h), `${id}: extraction lacks "${h}"`);
    }
    assert.ok(t.includes(`watch?v=${id}`), `${id}: extraction does not cite its URL`);
  }
});

test('attribution is present and no endorsement is claimed', () => {
  for (const f of [['README.md'], ['EVIDENCE.md'], ['skills', 'lift-ui', 'SKILL.md']]) {
    const t = read(...f);
    assert.match(t, /not (affiliated with or )?endorsed/i, `${f.join('/')} lacks a non-endorsement statement`);
    assert.match(t, /Gary Simon/, `${f.join('/')} lacks attribution`);
  }
});

test('contrast: known WCAG values', () => {
  const r = (a, b) => Math.round(contrastRatio(a, b) * 100) / 100;
  assert.equal(r('#000', '#fff'), 21);
  assert.equal(r('#fff', '#000'), 21);
  assert.equal(r('#757575', '#ececec'), 3.9); // measured in source V5 06:16
  assert.equal(r('#757575', '#ffffff'), 4.61); // measured in source V5 ~06:30
  assert.equal(r('#777777', '#ffffff'), 4.48);
  assert.equal(r('rgb(17, 17, 17)', '#ffffff'), r('#111', '#fff'));
  // 50% black over white composites to mid grey
  assert.equal(r('rgba(0,0,0,0.5)', '#ffffff'), r({ r: 127.5, g: 127.5, b: 127.5, a: 1 }, '#ffffff'));
  assert.deepEqual(parseColor('#abcd'), { r: 170, g: 187, b: 204, a: 221 / 255 });
  assert.throws(() => parseColor('purple'));
  assert.throws(() => contrastRatio('#000', 'rgba(255,255,255,0.5)'));
});

test('contrast: thresholds and large text', () => {
  assert.equal(isLargeText(24, 400), true);
  assert.equal(isLargeText(18.66, 700), true);
  assert.equal(isLargeText(18.66, 400), false);
  assert.equal(isLargeText(16, 700), false);
  assert.equal(verdict(3.9).aa, false);
  assert.equal(verdict(3.9, true).aa, true);
  assert.equal(verdict(4.5).aa, true);
  assert.equal(verdict(6.9).aaa, false);
});

test('contrast: CLI exit codes', () => {
  const cli = join(skillsDir, 'lift-ui', 'scripts', 'contrast.mjs');
  const run = (...a) => spawnSync(process.execPath, [cli, ...a], { encoding: 'utf8' });
  assert.equal(run('#111', '#fff').status, 0);
  const fail = run('#757575', '#ececec');
  assert.equal(fail.status, 1);
  assert.match(fail.stdout, /3\.90:1/);
  assert.equal(run('#757575', '#ececec', '--large').status, 0);
  assert.equal(run('#111').status, 2);
  assert.equal(run('nope', '#fff').status, 2);
  const j = JSON.parse(run('#111', '#fff', '#757575', '#ececec', '--json').stdout);
  assert.equal(j.length, 2);
  assert.equal(j[1].aa, false);
});

test('evals.json is well formed and covers every mode', () => {
  const e = JSON.parse(read('evals', 'evals.json'));
  assert.ok(existsSync(join(root, e.fixture)));
  assert.deepEqual([...e.skills].sort(), [...skillNames].sort());
  const modes = new Set(e.evals.map((c) => c.expected_mode));
  for (const m of ['audit', 'type', 'layout', 'color', 'full', 'none']) assert.ok(modes.has(m), `no eval for mode ${m}`);
  for (const c of e.evals) {
    assert.ok(c.id && c.prompt && c.must?.length && c.must_not?.length, `eval ${c.id} incomplete`);
  }
});

test('plugin manifest is valid', () => {
  const p = JSON.parse(read('.claude-plugin', 'plugin.json'));
  assert.match(p.name, /^[a-z0-9-]+$/);
  assert.ok(p.description && p.version);
});

test('probe: exits 3 with guidance when playwright is not resolvable', () => {
  const probe = join(skillsDir, 'lift-ui', 'scripts', 'probe.mjs');
  const empty = mkdtempSync(join(tmpdir(), 'lift-nopw-'));
  const r = spawnSync(process.execPath, [probe, 'file:///dev/null'], { cwd: empty, encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stderr, /playwright is not resolvable/);
  assert.equal(spawnSync(process.execPath, [probe], { cwd: empty, encoding: 'utf8' }).status, 2);
});

function playwrightDir() {
  for (const dir of [process.env.LIFT_PW_DIR, root].filter(Boolean)) {
    try {
      createRequire(join(dir, 'noop.js')).resolve('playwright');
      return dir;
    } catch {
      // not here
    }
  }
  return null;
}

const pwDir = playwrightDir();
test('probe: finds the seeded defects in the fixture', { skip: pwDir ? false : 'playwright not resolvable; set LIFT_PW_DIR to run' }, () => {
  const probe = join(skillsDir, 'lift-ui', 'scripts', 'probe.mjs');
  const out = mkdtempSync(join(tmpdir(), 'lift-probe-'));
  const url = pathToFileURL(join(root, 'evals', 'fixtures', 'weak-settings.html')).href;
  const r = spawnSync(process.execPath, [probe, url, '--label', 'before', '--out', out, '--viewports', '375,1280'], { cwd: pwDir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['375.png', '1280.png', 'metrics.json']) assert.ok(existsSync(join(out, 'before', f)), `missing ${f}`);
  const m = JSON.parse(readFileSync(join(out, 'before', 'metrics.json'), 'utf8')).viewports;
  const d = m[1280];
  assert.deepEqual(d.text.distinctSizes, [16], 'fixture has a single text size');
  assert.deepEqual(d.text.distinctWeights, [400]);
  const fails = d.contrastFailures.map((c) => `${c.fg} ${c.bg} ${c.ratio}`);
  assert.ok(fails.includes('#ff2424 #5b3df5 1.61'), `header contrast not found in ${fails}`);
  assert.ok(fails.includes('#757575 #ececec 3.9'), `footer contrast not found in ${fails}`);
  assert.ok(fails.includes('#b9aef9 #5b3df5 3.06'), `plan meta contrast not found in ${fails}`);
  assert.ok(d.borders.borderedElements >= 15);
  assert.ok(d.borders.distinct.some((b) => b.width === 3 && b.contrastVsSurface > 15), 'heavy high-contrast border not reported');
  assert.ok(d.shadows.distinct.some((s) => s.alpha === 0.45), '45% shadow not reported');
  assert.ok(d.text.alignment.center >= 3 && d.text.alignment.left >= 3, 'alignment mix not reported');
  assert.ok(d.raggedColumns.some((c) => c.selector.includes('centered')), 'centered card not reported as ragged');
  assert.equal(m[375].horizontalOverflow, false);
  const offScale = d.spacing.verticalGapsPx.map((g) => g.value).filter((v) => ![4, 8, 12, 16, 24, 32].includes(v));
  assert.ok(offScale.length >= 2, `expected off-scale gaps, got ${JSON.stringify(d.spacing.verticalGapsPx)}`);
  assert.ok(d.radii.length >= 2, 'radius inventory missing');
  const focus = JSON.parse(readFileSync(join(out, 'before', 'metrics.json'), 'utf8')).focus;
  assert.equal(focus.stops, 9, `tab stops: ${JSON.stringify(focus.order)}`);
  assert.deepEqual(focus.noVisibleFocus, []);
  assert.equal(focus.backwardJumps, 0);
});
