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
QUALITY = {'hero': 80, 'card': 82, 'feature': 80, 'icon': 82, 'photo': 76, 'place': 76}
TRIM = {'hero', 'card', 'feature'}
AVIF = {'hero': 60, 'card': 58, 'feature': 58}   # food cut-outs also get an AVIF copy (about half the bytes)
FORCE = '--force' in sys.argv


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
    variants, avif = [], []
    for target in WIDTHS[role]:
        w = min(target, width)
        if variants and variants[-1]['w'] == w:
            continue
        h = round(height * w / width)
        resized = None
        name = f'{slug(src)}-{w}.webp'
        # A copy that already exists is kept (its name carries the photo's fingerprint). Use --force to remake all.
        if FORCE or not os.path.exists(os.path.join(OUT, name)):
            resized = image.resize((w, h), Image.LANCZOS) if w != width else image
            resized.save(os.path.join(OUT, name), 'WEBP', quality=QUALITY[role], method=6)
        variants.append({'w': w, 'url': '/assets/site/img/' + name, 'bytes': os.path.getsize(os.path.join(OUT, name))})
        if role in AVIF:
            name = f'{slug(src)}-{w}.avif'
            if FORCE or not os.path.exists(os.path.join(OUT, name)):
                resized = resized or (image.resize((w, h), Image.LANCZOS) if w != width else image)
                resized.save(os.path.join(OUT, name), 'AVIF', quality=AVIF[role], speed=5)
            avif.append({'w': w, 'url': '/assets/site/img/' + name, 'bytes': os.path.getsize(os.path.join(OUT, name))})
    result = {'w': width, 'h': height, 'variants': variants}
    if avif:
        result['avif'] = avif
    return result


def logos():
    """The logo, unchanged, as small transparent files (the original is 1.8 MB)."""
    out = {}

    def save(alpha, rgb, name, widths):
        h, w = alpha.shape
        pixels = np.zeros((h, w, 4), np.uint8)
        pixels[..., 0], pixels[..., 1], pixels[..., 2] = rgb
        pixels[..., 3] = (alpha * 255).astype(np.uint8)
        image = Image.fromarray(pixels, 'RGBA')
        image = image.crop(image.getbbox())
        variants = []
        for target in widths:
            resized = image.resize((target, round(image.height * target / image.width)), Image.LANCZOS)
            # 16 steps of transparency are plenty for one flat colour and make the file about a third smaller.
            data = np.asarray(resized).copy()
            data[..., 3] = (np.round(data[..., 3] / 17) * 17).astype(np.uint8)
            file = f'{name}-{target}.webp'
            Image.fromarray(data, 'RGBA').save(os.path.join(OUT, file), 'WEBP', lossless=True, quality=100, method=6)
            variants.append({'w': target, 'url': '/assets/site/img/' + file, 'bytes': os.path.getsize(os.path.join(OUT, file))})
        out[name] = {'w': image.width, 'h': image.height, 'variants': variants}

    source = Image.open(os.path.join(ROOT, 'assets', 'sweet-snow-horizontal-right-original-20261104.png')).convert('RGB')
    a = np.asarray(source).astype(np.float32) / 255
    # Same maths as the colour filter inside sweet-snow-horizontal-right-blue-20261104.svg.
    alpha = np.clip(4 * a[..., 0] - 4 * a[..., 2] + 1, 0, 1)
    save(alpha, (112, 173, 217), 'logo-blue', (224, 336))      # the logo's own blue
    save(alpha, (255, 255, 255), 'logo-white', (224, 336))
    save(alpha, (22, 50, 74), 'logo-ink', (224, 336))

    arch = np.asarray(Image.open(os.path.join(ROOT, 'assets', 'sweet-snow-arched-logo.png')).convert('RGB')).astype(np.float32)
    arch_alpha = np.clip((255 - arch[..., 0]) / (255 - 112), 0, 1)
    save(arch_alpha, (112, 173, 217), 'arch-blue', (200, 400))
    save(arch_alpha, (255, 255, 255), 'arch-white', (200, 400))
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    listing = os.path.join(ROOT, 'build', '.images.json')
    entries = json.load(open(listing)) if os.path.exists(listing) else []
    target = os.path.join(ROOT, 'build', 'image-manifest.json')
    if '--logos-only' in sys.argv and os.path.exists(target):
        manifest = json.load(open(target))
        manifest['logos'] = logos()
    else:
        manifest = {'images': {}, 'logos': logos()}
        for entry in entries:
            result = process(entry)
            if result:
                manifest['images'][entry['src'] + '|' + entry['role']] = result
    json.dump(manifest, open(os.path.join(ROOT, 'build', 'image-manifest.json'), 'w'), indent=1)
    total = sum(v['bytes'] for item in list(manifest['images'].values()) + list(manifest['logos'].values()) for v in item['variants'] + item.get('avif', []))
    print(f"{len(manifest['images'])} photos, {len(manifest['logos'])} logo files, {total // 1024} KB in assets/site/img")


if __name__ == '__main__':
    sys.exit(main())
