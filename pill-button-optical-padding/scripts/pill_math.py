#!/usr/bin/env python3
"""Pill button optical padding calculator. Implements exactly the formulas in SKILL.md:

  pill       = py + lh / 2
  k          = 1 - pi / 4
  edge_icon  = py - px
  edge_label = r * k * r / pill
  gap        = max(py, px - (lh - cap) / 2)      (shown with the method, never derived)

Usage: pill_math.py --py 8 --px 16 --lh 24 [--cap 12] [--r 20] [--json]
"""
import argparse
import json
import math
import sys

K = 1 - math.pi / 4  # 0.21460183660255172


def compute(py, px, lh, r=None, cap=None):
    """Every derived number for one button. Inputs in CSS px; r defaults to pill (full pill)."""
    pill = py + lh / 2
    r = pill if r is None else r
    edge_label = r * K * r / pill  # also the average horizontal loss per unit height
    return {
        "py": py, "px": px, "lh": lh, "cap": cap, "r": r, "k": K,
        "pill": pill,
        "height": lh + 2 * py,
        "edge_icon": py - px,
        "edge_label": edge_label,
        "gap": None if cap is None else max(py, px - (lh - cap) / 2),
        "label_end": px + edge_label,
        "optical_before": px - edge_label,
        "optical_after": px,
    }


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--py", type=float, required=True)
    ap.add_argument("--px", type=float, required=True)
    ap.add_argument("--lh", type=float, required=True)
    ap.add_argument("--cap", type=float)
    ap.add_argument("--r", type=float, help="rendered radius; default = pill")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    o = compute(a.py, a.px, a.lh, r=a.r, cap=a.cap)
    if a.json:
        print(json.dumps(o, indent=2))
        return 0
    print(f"pill (py + lh/2)              = {o['pill']:.3f}")
    print(f"r                             = {o['r']:.3f}" + ("   (defaulted to pill)" if a.r is None else ""))
    print(f"edge_icon  (py - px)          = {o['edge_icon']:.3f}")
    print(f"edge_label (r*k*r/pill)       = {o['edge_label']:.3f}   k = {K:.4f}")
    if o["gap"] is not None:
        print(f"gap max(py, px-(lh-cap)/2)    = {o['gap']:.3f}")
    print(f"label end reads               = {o['label_end']:.2f}")
    print(f"optical space before -> after = {o['optical_before']:.2f} -> {o['optical_after']:.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
