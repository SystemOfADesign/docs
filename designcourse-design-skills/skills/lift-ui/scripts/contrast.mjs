#!/usr/bin/env node
// WCAG 2.x contrast ratio. No dependencies.
// Usage: node contrast.mjs <fg> <bg> [<fg> <bg> ...] [--large] [--json]
// Colors: #rgb, #rrggbb, #rrggbbaa, rgb()/rgba(). A translucent fg is composited over bg.
// Exit code 1 if any pair fails its AA threshold, 2 on bad input.

export function parseColor(input) {
  const s = String(input).trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error(`Unparseable color: ${input}`);
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    if (p.length < 3) throw new Error(`Unparseable color: ${input}`);
    const ch = (v) => (v.endsWith('%') ? (parseFloat(v) / 100) * 255 : parseFloat(v));
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3]);
    const c = { r: ch(p[0]), g: ch(p[1]), b: ch(p[2]), a };
    if ([c.r, c.g, c.b, c.a].some(Number.isNaN)) throw new Error(`Unparseable color: ${input}`);
    return c;
  }
  throw new Error(`Unparseable color: ${input} (use hex or rgb()/rgba())`);
}

export function composite(fg, bg) {
  const a = fg.a ?? 1;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

export function luminance({ r, g, b }) {
  const lin = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fgInput, bgInput) {
  const bg = typeof bgInput === 'string' ? parseColor(bgInput) : bgInput;
  let fg = typeof fgInput === 'string' ? parseColor(fgInput) : fgInput;
  if ((bg.a ?? 1) < 1) throw new Error('Background must be opaque; composite it over its own backdrop first');
  if ((fg.a ?? 1) < 1) fg = composite(fg, bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Large text per WCAG: >= 24px, or >= 18.66px when bold (700+).
export function isLargeText(px, weight) {
  return px >= 24 || (px >= 18.66 && Number(weight) >= 700);
}

export function verdict(ratio, large = false) {
  return {
    ratio: Math.round(ratio * 100) / 100,
    large,
    aa: ratio >= (large ? 3 : 4.5),
    aaa: ratio >= (large ? 4.5 : 7),
    nonText: ratio >= 3,
  };
}

const isMain = import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const args = process.argv.slice(2);
  const large = args.includes('--large');
  const json = args.includes('--json');
  const colors = args.filter((a) => !a.startsWith('--'));
  if (colors.length < 2 || colors.length % 2 !== 0) {
    console.error('Usage: contrast.mjs <fg> <bg> [<fg> <bg> ...] [--large] [--json]');
    process.exit(2);
  }
  const out = [];
  try {
    for (let i = 0; i < colors.length; i += 2) {
      out.push({ fg: colors[i], bg: colors[i + 1], ...verdict(contrastRatio(colors[i], colors[i + 1]), large) });
    }
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  if (json) console.log(JSON.stringify(out, null, 2));
  else {
    for (const r of out) {
      console.log(
        `${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)}:1  ${r.large ? 'large' : 'normal'} text AA ${r.aa ? 'PASS' : 'FAIL'}, AAA ${r.aaa ? 'PASS' : 'FAIL'}; non-text 3:1 ${r.nonText ? 'PASS' : 'FAIL'}`,
      );
    }
  }
  process.exit(out.every((r) => r.aa) ? 0 : 1);
}
