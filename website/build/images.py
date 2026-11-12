#!/usr/bin/env python3
"""Makes small, fast copies of the photos the website uses.

Run after adding or replacing a photo:

    node build/build.mjs --list-images > build/.images.json
    python3 build/images.py

It never changes a photo's content: it only trims empty margins, resizes and
saves as WebP into assets/site/img/. The originals stay where they are.
If a photo has no small copy yet, the website simply uses the original file.
"""
import hashlib
import json
import os
import re
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'site', 'img')
WIDTHS = {
    'hero': [480, 720, 1080],
    'card': [320, 480, 720],
    'feature': [320, 480, 720],
    'icon': [96, 192],
    'photo': [380, 760],
    'place': [480, 960],
}
QUALITY = {'hero': 86, 'card': 84, 'feature': 84, 'icon': 82, 'photo': 78, 'place': 78}
TRIM = {'hero', 'card', 'feature'}


def slug(path):
    """File name plus a fingerprint of the photo, so a replaced photo gets a new address."""
    name = os.path.splitext(os.path.basename(path))[0]
    with open(os.path.join(ROOT, path.lstrip('/')), 'rb') as handle:
        digest = hashlib.sha1(handle.read()).hexdigest()[:8]
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') + '-' + digest


def process(entry):
    src, role = entry['src'], entry['role']
    file = os.path.join(ROOT, src.lstrip('/'))
    if not os.path.exists(file):
        print('  missing:', src)
        return None
    image = Image.open(file)
    has_alpha = image.mode in ('RGBA', 'LA', 'P')
    image = image.convert('RGBA' if has_alpha else 'RGB')
    if role in TRIM and has_alpha:
        box = image.getbbox()
        if box:
            image = image.crop(box)
    width, height = image.size
    variants = []
    for target in WIDTHS[role]:
        w = min(target, width)
        if variants and variants[-1]['w'] == w:
            continue
        h = round(height * w / width)
        resized = image.resize((w, h), Image.LANCZOS) if w != width else image
        name = f'{slug(src)}-{w}.webp'
        resized.save(os.path.join(OUT, name), 'WEBP', quality=QUALITY[role], method=6)
        variants.append({'w': w, 'url': '/assets/site/img/' + name, 'bytes': os.path.getsize(os.path.join(OUT, name))})
    return {'w': width, 'h': height, 'variants': variants}


def logos():
    """The logo, unchanged, as small transparent files (the original is 1.8 MB)."""
    out = {}
    source = Image.open(os.path.join(ROOT, 'assets', 'sweet-snow-horizontal-right-original-20261104.png')).convert('RGB')
    a = np.asarray(source).astype(np.float32) / 255
    # Same maths as the colour filter inside sweet-snow-horizontal-right-blue-20261104.svg.
    alpha = np.clip(4 * a[..., 0] - 4 * a[..., 2] + 1, 0, 1)

    def tinted(rgb, name):
        h, w = alpha.shape
        pixels = np.zeros((h, w, 4), np.uint8)
        pixels[..., 0], pixels[..., 1], pixels[..., 2] = rgb
        pixels[..., 3] = (alpha * 255).astype(np.uint8)
        image = Image.fromarray(pixels, 'RGBA')
        image = image.crop(image.getbbox())
        variants = []
        for target in (240, 480):
            resized = image.resize((target, round(image.height * target / image.width)), Image.LANCZOS)
            file = f'{name}-{target}.webp'
            resized.save(os.path.join(OUT, file), 'WEBP', quality=90, method=6)
            variants.append({'w': target, 'url': '/assets/site/img/' + file, 'bytes': os.path.getsize(os.path.join(OUT, file))})
        out[name] = {'w': image.width, 'h': image.height, 'variants': variants}

    tinted((112, 173, 217), 'logo-blue')      # the logo's own blue
    tinted((255, 255, 255), 'logo-white')
    tinted((22, 50, 74), 'logo-ink')

    arch = np.asarray(Image.open(os.path.join(ROOT, 'assets', 'sweet-snow-arched-logo.png')).convert('RGB')).astype(np.float32)
    arch_alpha = np.clip((255 - arch[..., 0]) / (255 - 112), 0, 1)

    def arched(rgb, name):
        h, w = arch_alpha.shape
        pixels = np.zeros((h, w, 4), np.uint8)
        pixels[..., :3] = rgb
        pixels[..., 3] = (arch_alpha * 255).astype(np.uint8)
        image = Image.fromarray(pixels, 'RGBA')
        image = image.crop(image.getbbox())
        variants = []
        for target in (320, 640):
            resized = image.resize((target, round(image.height * target / image.width)), Image.LANCZOS)
            file = f'{name}-{target}.webp'
            resized.save(os.path.join(OUT, file), 'WEBP', quality=90, method=6)
            variants.append({'w': target, 'url': '/assets/site/img/' + file, 'bytes': os.path.getsize(os.path.join(OUT, file))})
        out[name] = {'w': image.width, 'h': image.height, 'variants': variants}

    arched((112, 173, 217), 'arch-blue')
    arched((255, 255, 255), 'arch-white')
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    listing = os.path.join(ROOT, 'build', '.images.json')
    entries = json.load(open(listing)) if os.path.exists(listing) else []
    manifest = {'images': {}, 'logos': logos()}
    for entry in entries:
        result = process(entry)
        if result:
            manifest['images'][entry['src'] + '|' + entry['role']] = result
    json.dump(manifest, open(os.path.join(ROOT, 'build', 'image-manifest.json'), 'w'), indent=1)
    total = sum(v['bytes'] for item in list(manifest['images'].values()) + list(manifest['logos'].values()) for v in item['variants'])
    print(f"{len(manifest['images'])} photos, {len(manifest['logos'])} logo files, {total // 1024} KB in assets/site/img")


if __name__ == '__main__':
    sys.exit(main())
