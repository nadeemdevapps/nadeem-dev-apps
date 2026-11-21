#!/usr/bin/env python3
"""Generate the 1200x630 Open Graph PNGs for the Tsumly and Kaizenly sites.

Social crawlers (Facebook / X / LinkedIn) do not render SVG as og:image,
so each product site needs a real PNG. The images are deliberately plain:
solid brand background, a small three-tile mark echoing the product logos,
the product name, and the one-line tagline taken from the site's own copy.

Usage:
    python3 scripts/make-og-images.py [--check]

--check only verifies the existing PNGs are 1200x630 instead of rewriting
them. Outputs: tsumly/public/og-image.png, kaizenly/public/og-image.png.
Requires Pillow (pip install pillow). Fonts: system DejaVu Sans.
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

PRODUCTS = [
    {
        "name": "Tsumly",
        # Tagline is the site hero H1 ("Every amount adds up.").
        "tagline": "Every amount adds up.",
        "bg": "#6C4DE6",
        "tagline_color": "#E4DEFF",
        # Three-tile mark: cream, amber, white (Tsumly palette accents).
        "tiles": ["#F6F0E2", "#F2A81D", "#FFFFFF"],
        "out": ROOT / "tsumly" / "public" / "og-image.png",
    },
    {
        "name": "Kaizenly",
        # Tagline is the site hero H1 ("A little better, every day.").
        "tagline": "A little better, every day.",
        "bg": "#1DBF3A",
        "tagline_color": "#D9F5DF",
        # Three-tile mark: white, pale green, deep green (Kaizenly palette).
        "tiles": ["#FFFFFF", "#CBE8C3", "#17992F"],
        "out": ROOT / "kaizenly" / "public" / "og-image.png",
    },
]


def make_og(product: dict) -> Image.Image:
    img = Image.new("RGB", (W, H), product["bg"])
    draw = ImageDraw.Draw(img)
    name_font = ImageFont.truetype(BOLD, 118)
    tagline_font = ImageFont.truetype(REGULAR, 44)

    # Text block size, so the mark + text group can be centred as a whole.
    name_box = draw.textbbox((0, 0), product["name"], font=name_font)
    name_w = name_box[2] - name_box[0]
    tag_box = draw.textbbox((0, 0), product["tagline"], font=tagline_font)
    tag_w = tag_box[2] - tag_box[0]
    text_w = max(name_w, tag_w)
    text_h = (name_box[3] - name_box[1]) + 26 + (tag_box[3] - tag_box[1])

    # Three-tile mark: 76px rounded squares ascending diagonally.
    tile = 76
    gap = 14
    mark_w = tile * 2 + gap
    mark_h = tile * 2 + gap
    group_w = mark_w + 56 + text_w
    group_h = max(mark_h, text_h)
    x0 = (W - group_w) // 2
    y0 = (H - group_h) // 2

    # Tiles: bottom-left, middle, top-right (ascending steps).
    positions = [
        (x0, y0 + mark_h - tile),
        (x0 + tile // 2 + gap // 2, y0 + (mark_h - tile) // 2),
        (x0 + mark_w - tile, y0),
    ]
    for (tx, ty), color in zip(positions, product["tiles"]):
        draw.rounded_rectangle([tx, ty, tx + tile, ty + tile], radius=18, fill=color)

    tx = x0 + mark_w + 56
    ty = y0 + (group_h - text_h) // 2
    draw.text((tx, ty), product["name"], font=name_font, fill="#FFFFFF")
    draw.text(
        (tx, ty + (name_box[3] - name_box[1]) + 26),
        product["tagline"],
        font=tagline_font,
        fill=product["tagline_color"],
    )
    return img


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="verify existing PNGs instead of generating")
    args = parser.parse_args()

    for product in PRODUCTS:
        if args.check:
            img = Image.open(product["out"])
            ok = img.size == (W, H)
            print(f"{product['out']}: {img.size} {'OK' if ok else 'WRONG SIZE'}")
            if not ok:
                return 1
            continue
        img = make_og(product)
        product["out"].parent.mkdir(parents=True, exist_ok=True)
        img.save(product["out"], "PNG")
        print(f"wrote {product['out']} ({img.size[0]}x{img.size[1]})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
