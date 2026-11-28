// In-page measurement for pill button optical padding.
// No dependencies. Paste into a browser console or run via scripts/audit_buttons.mjs.
//   measurePillButtons('button, [role="button"]') -> { k, tolerance, buttons: [...] }
// Roles: a child is an "icon" if it is <svg>/<img>, has data-pill-role="icon", a class containing
// "icon", or aria-hidden with no text; otherwise it is a "label". data-pill-role overrides.
(function () {
  const K = 1 - Math.PI / 4;
  const TOL = 0.5;
  const num = (s) => parseFloat(s) || 0;

  function role(el) {
    const forced = el.getAttribute && el.getAttribute('data-pill-role');
    if (forced) return forced;
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg' || tag === 'img') return 'icon';
    if (/icon/i.test(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '')) return 'icon';
    if (el.getAttribute('aria-hidden') === 'true' && !el.textContent.trim()) return 'icon';
    return 'label';
  }

  function measure(btn, index) {
    const cs = getComputedStyle(btn);
    const rect = btn.getBoundingClientRect();
    const rtl = cs.direction === 'rtl';
    const bStart = rtl ? num(cs.borderRightWidth) : num(cs.borderLeftWidth);
    const bEnd = rtl ? num(cs.borderLeftWidth) : num(cs.borderRightWidth);
    const pStart = rtl ? num(cs.paddingRight) : num(cs.paddingLeft);
    const pEnd = rtl ? num(cs.paddingLeft) : num(cs.paddingRight);
    const pTop = num(cs.paddingTop), pBottom = num(cs.paddingBottom);
    const bTop = num(cs.borderTopWidth), bBottom = num(cs.borderBottomWidth);
    const height = rect.height, width = rect.width;
    const contentHeight = height - pTop - pBottom - bTop - bBottom;
    const lhRaw = cs.lineHeight;
    let lh = lhRaw === 'normal' ? NaN : num(lhRaw);
    const radii = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map((p) => num(cs[p]));
    const rDeclared = Math.max(...radii);
    // CSS clamps radii so adjacent pairs fit the side: for a symmetric pill the rendered radius is min(r, h/2, w/2)
    const r = Math.min(rDeclared, height / 2, width / 2);
    const pill = pTop + contentHeight / 2; // py + 0.5lh for single-line content; measured on the content height (supplemental S4)
    const edgeLabel = r * K * r / pill;

    const kids = Array.from(btn.children).filter((c) => {
      const s = getComputedStyle(c);
      return s.display !== 'none' && s.position !== 'absolute' && s.visibility !== 'hidden';
    });
    const padStartX = rtl ? rect.right - bEnd : rect.left + bStart;  // start edge of the padding box
    const padEndX = rtl ? rect.left + bStart : rect.right - bEnd;
    const children = kids.map((c, i) => {
      const cr = c.getBoundingClientRect();
      const s = getComputedStyle(c);
      const startDist = rtl ? padStartX - cr.right : cr.left - padStartX;
      const endDist = rtl ? cr.left - padEndX : padEndX - cr.right;
      const ro = role(c);
      if (ro === 'label' && isNaN(lh) && kids.length) lh = cr.height;
      const position = [];
      if (i === 0) position.push('first');
      if (i === kids.length - 1) position.push('last');
      return {
        role: ro, position, tag: c.tagName.toLowerCase(),
        width: cr.width, height: cr.height,
        startDist, endDist,
        marginStart: rtl ? num(s.marginRight) : num(s.marginLeft),
        marginEnd: rtl ? num(s.marginLeft) : num(s.marginRight),
        topDist: cr.top - (rect.top + bTop), bottomDist: rect.bottom - bBottom - cr.bottom,
      };
    });
    if (isNaN(lh)) lh = contentHeight;

    // Two checks, 0.5px tolerance. The optical number (px + margin - strip) is reported, not checked:
    // it equals px exactly when label-strip passes.
    const checks = {};
    let opticalStart = null, opticalEnd = null;
    for (const c of children) {
      if (c.role === 'icon') {
        if (c.position.includes('first')) checks['icon-concentric:start'] = Math.abs(c.startDist - pTop) <= TOL;
        if (c.position.includes('last')) checks['icon-concentric:end'] = Math.abs(c.endDist - pTop) <= TOL;
      } else {
        if (c.position.includes('first')) { checks['label-strip:start'] = Math.abs(c.marginStart - edgeLabel) <= TOL; opticalStart = pStart + c.marginStart - edgeLabel; }
        if (c.position.includes('last')) { checks['label-strip:end'] = Math.abs(c.marginEnd - edgeLabel) <= TOL; opticalEnd = pEnd + c.marginEnd - edgeLabel; }
      }
    }
    const gapRaw = cs.columnGap === 'normal' ? cs.gap : cs.columnGap;

    return {
      id: btn.id || `${btn.tagName.toLowerCase()}${typeof btn.className === 'string' && btn.className.trim() ? '.' + btn.className.trim().split(/\s+/)[0] : ''}#${index}`,
      text: (btn.textContent || '').trim().slice(0, 40),
      fontSize: num(cs.fontSize), lh, contentHeight, lhMatchesContent: Math.abs(lh - contentHeight) <= TOL,
      py: pTop, pyBottom: pBottom, px: pStart, pxEnd: pEnd,
      border: { top: bTop, bottom: bBottom, start: bStart, end: bEnd },
      rDeclared, r, pill, height, width, gap: num(gapRaw),
      expected: { edgeIcon: pTop - pStart, edgeLabel, avgCut: edgeLabel },
      optical: { start: opticalStart, end: opticalEnd },
      children, checks,
      pass: Object.values(checks).every(Boolean),
    };
  }

  function measurePillButtons(selector) {
    const els = Array.from(document.querySelectorAll(selector || 'button, [role="button"]'));
    return { k: K, tolerance: TOL, selector: selector || 'button, [role="button"]', buttons: els.map(measure) };
  }
  if (typeof window !== 'undefined') window.measurePillButtons = measurePillButtons;
  return measurePillButtons;
})();
