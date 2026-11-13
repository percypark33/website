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
from PIL import Image, ImageChops, ImageDraw, ImageFilter

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
        digest = hashlib.sha1(handle.read() + b'trim-2').hexdigest()[:8]
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
        # Trim to the food itself. Faint see-through edges (soft shadows) are ignored when finding
        # the edge, so every item ends up the same visual size; a small margin keeps the shadow.
        alpha = np.asarray(image)[..., 3]
        ys, xs = np.where(alpha > 24)
        if len(xs):
            pad = round(0.03 * max(xs.max() - xs.min(), ys.max() - ys.min()))
            image = image.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(image.width, xs.max() + 1 + pad), min(image.height, ys.max() + 1 + pad)))
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
    """The logo, unchanged, as small transparent files."""
    out = {}

    def fingerprint(image):
        # Browsers keep everything in assets/site for a year. A new picture must get a new file name,
        # or people who visited before keep seeing the old one.
        return hashlib.sha1(image.tobytes() + b'logo-1').hexdigest()[:8]

    def save(alpha, rgb, name, widths):
        h, w = alpha.shape
        pixels = np.zeros((h, w, 4), np.uint8)
        pixels[..., 0], pixels[..., 1], pixels[..., 2] = rgb
        pixels[..., 3] = (alpha * 255).astype(np.uint8)
        image = Image.fromarray(pixels, 'RGBA')
        image = image.crop(image.getbbox())
        tag = fingerprint(image)
        variants = []
        for target in widths:
            resized = image.resize((target, round(image.height * target / image.width)), Image.LANCZOS)
            # 16 steps of transparency are plenty for one flat colour and make the file about a third smaller.
            data = np.asarray(resized).copy()
            data[..., 3] = (np.round(data[..., 3] / 17) * 17).astype(np.uint8)
            file = f'{name}-{tag}-{target}.webp'
            Image.fromarray(data, 'RGBA').save(os.path.join(OUT, file), 'WEBP', lossless=True, quality=100, method=6)
            variants.append({'w': target, 'url': '/assets/site/img/' + file, 'bytes': os.path.getsize(os.path.join(OUT, file))})
        out[name] = {'w': image.width, 'h': image.height, 'variants': variants}

    # The owner's logo file (assets/brand/sweet-snow-logo-20261112.pdf), turned into a picture by build/brand.mjs:
    # white artwork on the logo's blue, #73AEDC. How white a pixel is tells how much ink is there.
    source = Image.open(os.path.join(ROOT, 'assets', 'brand', 'sweet-snow-logo-20261112.png')).convert('RGB')
    a = np.asarray(source).astype(np.float32)
    alpha = np.clip((a[..., 0] - 115) / (255 - 115), 0, 1)
    save(alpha, (115, 174, 220), 'logo-blue', (224, 336))      # the logo's own blue
    save(alpha, (255, 255, 255), 'logo-white', (224, 336))   # the same artwork in white, for dark looks

    # The logo bunny on its own (blue lines, white inside), for the catering pages.
    bunny = Image.open(os.path.join(ROOT, 'assets', 'brand', 'sweet-snow-bunny-20261112.png')).convert('RGBA')
    bunny = bunny.crop(bunny.getbbox())
    tag = fingerprint(bunny)
    variants = []
    blue = np.array([115, 174, 220], np.float32)
    for target in (96, 176, 352):
        file = f'bunny-{tag}-{target}.webp'
        data = np.asarray(bunny.resize((target, round(bunny.height * target / bunny.width)), Image.LANCZOS)).astype(np.float32)
        # Every pixel is the logo's blue, white, or a soft edge between the two. Sixteen steps of each keep the
        # two colours exact and make the file about a quarter of the size.
        mix = np.round(np.clip((255 - data[..., 0]) / (255 - blue[0]), 0, 1) * 15) / 15
        small = np.empty(data.shape, np.uint8)
        small[..., :3] = np.round(255 - mix[..., None] * (255 - blue))
        small[..., 3] = np.round(data[..., 3] / 17) * 17
        Image.fromarray(small, 'RGBA').save(os.path.join(OUT, file), 'WEBP', lossless=True, quality=100, method=6)
        variants.append({'w': target, 'url': '/assets/site/img/' + file, 'bytes': os.path.getsize(os.path.join(OUT, file))})
    out['bunny'] = {'w': bunny.width, 'h': bunny.height, 'variants': variants}

    # The arched logo in the footer. The arched words and snowflakes are the owner's own
    # (assets/sweet-snow-arched-logo.png). That file was drawn with an older bunny that has no goggles,
    # so the bunny in the middle is swapped for the logo bunny: every logo then shows the same one.
    arched = Image.open(os.path.join(ROOT, 'assets', 'sweet-snow-arched-logo.png')).convert('RGB')
    ink = arched.getchannel('R').point(lambda v: 255 if v < 225 else 0)
    ImageDraw.floodfill(ink, (242, 283), 128)                      # a point on the older bunny's outline
    old = ink.point(lambda v: 255 if v == 128 else 0)
    if np.count_nonzero(np.asarray(old)) < 10000:
        raise SystemExit('images.py: could not find the older bunny in sweet-snow-arched-logo.png. Did that file change?')
    words = ink.point(lambda v: 255 if v == 255 else 0)
    # Wipe the older bunny with its soft edge, but never touch a letter or a snowflake.
    wipe = ImageChops.subtract(old.filter(ImageFilter.MaxFilter(5)), words.filter(ImageFilter.MaxFilter(3)))
    arched.paste((255, 255, 255), mask=wipe)
    width = 284                                                    # the largest size that keeps clear of the words
    fresh = bunny.resize((width, round(bunny.height * width / bunny.width)), Image.LANCZOS)
    arched = arched.convert('RGBA')
    arched.alpha_composite(fresh, (432 - fresh.width // 2, 310 - fresh.height // 2))
    arched = arched.convert('RGB')
    arched.save(os.path.join(ROOT, 'assets', 'brand', 'sweet-snow-arched-logo-20261113.png'), optimize=True)
    arch = np.asarray(arched).astype(np.float32)
    arch_alpha = np.clip((255 - arch[..., 0]) / (255 - 115), 0, 1)
    save(arch_alpha, (115, 174, 220), 'arch-blue', (200, 400))
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
