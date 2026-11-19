"""Turn the client's photo into a transparent, trimmed cutout for the hero.

Usage:  python tools/remove-bg.py path/to/photo.jpg
Output: assets/client-cutout.png  and  assets/client-cutout.webp
Then set  photo: "assets/client-cutout.png"  in data.js.
"""
import sys
from pathlib import Path
from rembg import remove, new_session
from PIL import Image

src = Path(sys.argv[1])
out_dir = Path(__file__).resolve().parent.parent / "assets"

img = Image.open(src).convert("RGBA")
# isnet-general-use gives cleaner hair/edges than the default model
cut = remove(img, session=new_session("isnet-general-use"), alpha_matting=True)
cut = cut.crop(cut.getbbox())          # trim empty space so feet/torso sit on the hero floor
if cut.height > 1400:                  # keep file size sane
    cut = cut.resize((round(cut.width * 1400 / cut.height), 1400), Image.LANCZOS)

cut.save(out_dir / "client-cutout.png", optimize=True)
cut.save(out_dir / "client-cutout.webp", quality=88, method=6)
print(f"saved {cut.width}x{cut.height} -> {out_dir}")
