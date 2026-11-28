#!/usr/bin/env python3
"""Pill button optical padding calculator (Ariakit reel DgQdaYhCFeA).

Implements exactly the reel's formulas, nothing more:

  pill       = py + lh / 2
  k          = 1 - pi / 4
  edge_icon  = py - px
  edge_label = r * k * r / pill
  gap        = max(py, px - (lh - cap) / 2)      (shown in the reel, unexplained)

Usage:
  pill_math.py --py 8 --px 16 --lh 24 [--cap 12] [--r 20] [--json]
  pill_math.py --check measured.json              # output of scripts/measure-buttons.js
"""
import argparse
import json
import math
import sys

K = 1 - math.pi / 4  # 0.21460183660255172
TOL = 0.5            # px; readouts are display-rounded and layout snaps to device pixels


def compute(py, px, lh, r=None, cap=None, content_height=None):
    """Return every number the reel shows for one button. All inputs in CSS px."""
    content = lh if content_height is None else content_height
    pill = py + content / 2
    r = pill if r is None else r
    edge_label = r * K * r / pill
    avg_cut = edge_label  # 2 r^2 k / (2 pill)
    out = {
        "py": py, "px": px, "lh": lh, "cap": cap, "r": r, "k": K,
        "pill": pill,
        "height": content + 2 * py,
        "edge_icon": py - px,
        "edge_label": edge_label,
        "gap": None if cap is None else max(py, px - (lh - cap) / 2),
        "label_end": px + edge_label,
        "optical_before": px - avg_cut,
        "optical_after": px + edge_label - avg_cut,
    }
    return out


def check_button(b):
    """Check one measured button (see measure-buttons.js output) against the formulas."""
    exp = compute(b["py"], b["px"], b["lh"], r=b["r"], content_height=b.get("contentHeight"))
    results = {}
    for child in b.get("children", []):
        role, pos = child["role"], child["position"]
        if role == "icon":
            if "first" in pos:
                results["icon-concentric:start"] = abs(child["startDist"] - b["py"]) <= TOL
            if "last" in pos:
                results["icon-concentric:end"] = abs(child["endDist"] - b["py"]) <= TOL
        elif role == "label":
            if "first" in pos:
                results["label-strip:start"] = abs(child["marginStart"] - exp["edge_label"]) <= TOL
            if "last" in pos:
                results["label-strip:end"] = abs(child["marginEnd"] - exp["edge_label"]) <= TOL
    results["real-radius"] = b["rDeclared"] <= b["r"] + TOL or all(
        v for k, v in results.items() if k.startswith("label-strip"))
    return exp, results


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--py", type=float)
    ap.add_argument("--px", type=float)
    ap.add_argument("--lh", type=float)
    ap.add_argument("--cap", type=float)
    ap.add_argument("--r", type=float, help="real radius; default = pill (full pill)")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--check", help="JSON file from measure-buttons.js; exit 1 if any check fails")
    a = ap.parse_args(argv)

    if a.check:
        data = json.load(open(a.check))
        buttons = data if isinstance(data, list) else data.get("buttons", [])
        failed = 0
        for b in buttons:
            exp, res = check_button(b)
            ok = all(res.values())
            failed += not ok
            print(f"{'PASS' if ok else 'FAIL'}  {b.get('id','?')}  py={b['py']:.2f} px={b['px']:.2f} r={b['r']:.2f} "
                  f"pill={exp['pill']:.2f} expect edge_icon={exp['edge_icon']:.2f} edge_label={exp['edge_label']:.3f}")
            for k, v in res.items():
                print(f"      {'ok ' if v else 'BAD'} {k}")
        print(f"{len(buttons) - failed}/{len(buttons)} buttons pass")
        return 1 if failed else 0

    if None in (a.py, a.px, a.lh):
        ap.error("--py, --px and --lh are required (or use --check)")
    out = compute(a.py, a.px, a.lh, r=a.r, cap=a.cap)
    if a.json:
        print(json.dumps(out, indent=2))
    else:
        print(f"pill (py + lh/2)            = {out['pill']:.3f}")
        print(f"r                           = {out['r']:.3f}" + ("   (defaulted to pill)" if a.r is None else ""))
        print(f"edge_icon  (py - px)        = {out['edge_icon']:.3f}")
        print(f"edge_label (r*k*r/pill)     = {out['edge_label']:.3f}   k = {K:.4f}")
        if out["gap"] is not None:
            print(f"gap max(py, px-(lh-cap)/2)  = {out['gap']:.3f}")
        print(f"label end reads             = {out['label_end']:.2f}")
        print(f"optical space before -> after = {out['optical_before']:.2f} -> {out['optical_after']:.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
