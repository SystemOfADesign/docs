"""Deterministic checks that pill_math.py reproduces the reference values. Run: python3 -m unittest discover -s tests"""
import math
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import pill_math  # noqa: E402


class ReferenceValues(unittest.TestCase):
    BASE = dict(py=8, px=16, lh=24, cap=12)

    def test_k(self):
        self.assertAlmostEqual(pill_math.K, 0.2146, places=4)  # on-screen tooltip "≈ 0.2146"

    def test_usual_pill_before_fix(self):
        o = pill_math.compute(**self.BASE)              # r defaults to pill = 20
        self.assertEqual(o["pill"], 20)
        self.assertEqual(o["gap"], 10)                  # readout "10"
        self.assertEqual(o["edge_icon"], -8)            # "8 all around" after the fix
        self.assertAlmostEqual(o["optical_before"], 11.708, places=3)  # "Optical space 12, not 16"

    def test_fixed_full_pill(self):
        o = pill_math.compute(**self.BASE)
        self.assertAlmostEqual(o["edge_label"], 4.292, places=3)   # "r × (1 − π/4) = 4"
        self.assertEqual(round(o["label_end"]), 20)                # readout "20"
        self.assertAlmostEqual(o["optical_after"], 16)             # "Optical space 16"

    def test_999px_breaks(self):
        o = pill_math.compute(r=999, **self.BASE)
        self.assertEqual(round(o["label_end"]), 10725)             # readout "10725"

    def test_padding_change_holds(self):
        o = pill_math.compute(py=11.2, px=16, lh=24, cap=12)        # --py: 0.7em
        self.assertAlmostEqual(o["pill"], 23.2)
        self.assertEqual(round(o["gap"]), 11)                      # "11"
        self.assertEqual(round(o["label_end"]), 21)                # "21"
        self.assertAlmostEqual(o["optical_after"], 16)

    def test_radius_change_holds(self):
        self.assertEqual(round(pill_math.compute(r=19, **self.BASE)["label_end"]), 20)   # "20"
        self.assertEqual(round(pill_math.compute(r=4, **self.BASE)["label_end"]), 16)    # "16"
        self.assertAlmostEqual(pill_math.compute(r=4, **self.BASE)["optical_after"], 16)

    def test_square_button(self):
        self.assertEqual(pill_math.compute(r=0, **self.BASE)["edge_label"], 0)

    def test_derivation_equals_two_corners_over_height(self):
        o = pill_math.compute(**self.BASE)
        two_corners = 2 * o["r"] ** 2 * (1 - math.pi / 4)
        self.assertAlmostEqual(o["edge_label"], two_corners / o["height"])


if __name__ == "__main__":
    unittest.main()
