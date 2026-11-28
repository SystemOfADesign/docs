// Measures tests/fixtures/{before,after}.html in Chromium and checks them against the reel's math.
// Run: node --test tests/   (skips the browser cases when playwright cannot be resolved; set PILL_PW_DIR)
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditPage, loadPlaywright } from '../scripts/audit_buttons.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pw = loadPlaywright();
const near = (a, b, tol = 0.5) => Math.abs(a - b) <= tol;

test('before.html fails the reel checks the way the reel describes', { skip: !pw && 'playwright not resolvable' }, async () => {
  const r = await auditPage(join(here, 'fixtures/before.html'), { pw });
  const byId = Object.fromEntries(r.buttons.map((b) => [b.id, b]));
  const b = byId['icon-first'];
  assert.equal(b.pass, false);
  assert.ok(near(b.py, 8) && near(b.px, 16) && near(b.r, 20) && near(b.pill, 20), JSON.stringify(b));
  assert.ok(near(b.children[0].startDist, 16), 'icon sits at px, not py');          // "Off-center"
  assert.ok(near(b.optical.end, 11.71, 0.6), `optical before ${b.optical.end}`);       // "12, not 16"
  assert.equal(b.checks['icon-concentric:start'], false);
  assert.equal(b.checks['label-strip:end'], false);
  assert.equal(byId['text-only'].pass, false);
  assert.equal(byId['icon-only'].pass, false);
});

test('after.html passes every check for every variant', { skip: !pw && 'playwright not resolvable' }, async () => {
  const r = await auditPage(join(here, 'fixtures/after.html'), { pw });
  const failures = r.buttons.filter((b) => !b.pass).map((b) => [b.id, b.checks]);
  assert.deepEqual(failures, []);
  const byId = Object.fromEntries(r.buttons.map((b) => [b.id, b]));
  const base = byId['icon-first'];
  assert.ok(near(base.children[0].startDist, 8), '8 all around');
  assert.ok(near(base.children[1].marginEnd, 4.29), 'strip 4.29');
  assert.ok(near(base.optical.end, 16), 'optical 16');
  assert.ok(near(byId['icon-last'].children[1].endDist, 8) && near(byId['icon-last'].children[0].marginStart, 4.29));
  assert.ok(near(byId['text-only'].children[0].marginStart, 4.29) && near(byId['text-only'].children[0].marginEnd, 4.29));
  assert.ok(near(byId['icon-only'].children[0].startDist, 8) && near(byId['icon-only'].children[0].endDist, 8));
  assert.ok(near(byId['py-0-7em'].children[1].marginEnd, 4.98), `py 0.7em strip ${byId['py-0-7em'].children[1].marginEnd}`);
  assert.ok(near(byId['r-19px'].children[1].marginEnd, 3.87));
  assert.ok(near(byId['r-4px'].children[1].marginEnd, 0.17));
  assert.ok(near(byId['small-14px'].pill, 17) && near(byId['small-14px'].children[1].marginEnd, 3.65));
  assert.ok(byId['rounded-full-token'].rDeclared > 1000 && near(byId['rounded-full-token'].r, 20) && byId['rounded-full-token'].checks['real-radius']);
  assert.ok(near(byId['rtl'].children[0].startDist, 8), 'rtl icon concentric');
});
