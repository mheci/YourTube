"""Original procedural dusk scene. Optional regeneration: Pillow; FFmpeg/libvpx-vp9.
The checked-in media have no network or encoder dependency at test time."""

from PIL import Image, ImageDraw
from pathlib import Path
import math, random, subprocess

here = Path(__file__).resolve().parent
W, H = 1440, 800
im = Image.new("RGB", (W, H))
d = ImageDraw.Draw(im)
r = random.Random(42)
for y in range(H):
    s = (y / H) ** 0.92
    a, b = (28, 58, 71), (237, 173, 121)
    d.line((0, y, W, y), fill=tuple(round(a[i] * (1 - s) + b[i] * s) for i in range(3)))
for _ in range(120):
    x, y = r.randrange(W), r.randrange(320)
    k = r.randrange(105, 174)
    d.point((x, y), fill=(k, k + 9, k + 12))
d.ellipse((1069, 273, 1157, 361), fill=(244, 205, 152))
for k, (base, amp, col) in enumerate(
    [
        (455, 65, "#908c83"),
        (499, 80, "#737d78"),
        (545, 73, "#526660"),
        (572, 56, "#3e564f"),
        (625, 70, "#2e4842"),
        (706, 97, "#1c3835"),
        (790, 86, "#172e2d"),
    ]
):
    y = 0
    ps = []
    for x in range(-2, W + 5, 3):
        y = y * 0.82 + r.uniform(-2.8, 2.8)
        a = x / W
        h = (
            base
            + amp
            * (
                math.sin(a * 7.4 + k * 0.77) * 0.72
                + math.sin(a * 16 + k * 1.05) * 0.3
                + math.sin(a * 30 + k * 0.6) * 0.16
            )
            + y
        )
        ps.append((x, round(h)))
    d.polygon([(0, H), *ps, (W, H)], fill=col)
# A small ridge observatory, in silhouette; the image is a test film, not a web grab.
x, y = 1101, 623
col = "#243d38"
d.polygon(
    [(x - 51, y + 12), (x + 61, y + 12), (x + 53, y - 12), (x - 47, y - 12)], fill=col
)
d.pieslice((x - 26, y - 43, x + 26, y + 8), 180, 360, fill=col)
d.rectangle((x - 26, y - 18, x + 26, y - 8), fill=col)
d.line((x + 12, y - 32, x + 31, y - 50), fill=col, width=5)
im.save(here / "dusk.jpg", quality=86, optimize=True)
subprocess.run(
    [
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-loop",
        "1",
        "-framerate",
        "4",
        "-i",
        str(here / "dusk.jpg"),
        "-t",
        "120",
        "-vf",
        "scale=512:288",
        "-pix_fmt",
        "yuv420p",
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        "40",
        "-deadline",
        "realtime",
        "-cpu-used",
        "8",
        "-g",
        "8",
        "-an",
        str(here / "dusk.webm"),
    ],
    check=True,
)
