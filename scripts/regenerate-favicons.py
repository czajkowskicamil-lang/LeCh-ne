"""
Régénère les favicons Le Chêne Patrimonial avec une safe zone confortable.
Source : public/logo-mark.png (arbre or sur fond transparent).
Sortie : favicon-{32,48,96,192,512}.png + apple-touch-icon.png (180x180).
Le fond est navy brand (#0A1F4F) et l'arbre occupe ~76% du canvas (marge ~12%).
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo-mark.png"
OUT = ROOT / "public"

NAVY = (10, 31, 79)  # #0A1F4F (ink brand token)
SAFE_RATIO = 0.76    # arbre occupe 76% du plus grand côté (marge ~12% chaque côté)

SIZES = {
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "favicon-96x96.png": 96,
    "favicon-192x192.png": 192,
    "favicon-512x512.png": 512,
    "apple-touch-icon.png": 180,
}

def build(size: int, tree: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (size, size), NAVY)
    target = int(size * SAFE_RATIO)
    w, h = tree.size
    scale = target / max(w, h)
    new_w, new_h = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    resized = tree.resize((new_w, new_h), Image.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas

def main() -> None:
    tree = Image.open(SRC).convert("RGBA")
    print(f"Source: {SRC.name} {tree.size}")
    for filename, size in SIZES.items():
        img = build(size, tree)
        path = OUT / filename
        img.save(path, "PNG", optimize=True)
        print(f"  -> {filename} ({size}x{size})")

if __name__ == "__main__":
    main()
