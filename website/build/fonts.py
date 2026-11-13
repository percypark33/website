#!/usr/bin/env python3
"""Makes the small web-font files in assets/site/fonts from the originals in build/fonts-src.

Only needed again if the typefaces change:   pip install fonttools brotli && python3 build/fonts.py
The fonts are Hahmlet, IBM Plex Sans KR and Gaegu, plus Lilita One and Outfit for the
catering pages (all SIL Open Font License).

Only the catering fonts:   python3 build/fonts.py catering
"""
import io
import os
import re
import sys

from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'build', 'fonts-src')
OUT = os.path.join(ROOT, 'assets', 'site', 'fonts')
LATIN = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2122, 0x2192, 0x2212]


def reload(font):
    buffer = io.BytesIO()
    font.flavor = None
    font.save(buffer)
    buffer.seek(0)
    return TTFont(buffer)


def make(font, name):
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['kern', 'liga', 'calt', 'locl']
    options.name_IDs = [1, 2]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=LATIN)
    subsetter.subset(font)
    font.flavor = 'woff2'
    target = os.path.join(OUT, name)
    font.save(target)
    print(name, os.path.getsize(target), 'bytes')


def sign():
    """The vertical Korean sign in the hero, as outlines taken straight from Hahmlet,
    so six letters do not need their own font download."""
    font = TTFont(os.path.join(SRC, 'hahmlet-sign.woff2'))
    cmap, glyphs, upm, ascent = font.getBestCmap(), font.getGlyphSet(), font['head'].unitsPerEm, font['hhea'].ascent
    y, paths = 0, []
    for char in '정통 눈꽃빙수':
        if char == ' ':
            y += int(upm * 0.9)
            continue
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(TransformPen(pen, (1, 0, 0, -1, (upm - glyph.width) / 2, y + ascent)))
        paths.append(pen.getCommands())
        y += int(upm * 1.5)
    height = y - int(upm * 0.5) + 200
    svg = f'<svg class="hero-sign-art" viewBox="0 0 {upm} {height}" aria-hidden="true"><path fill="currentColor" d="{" ".join(paths)}"/></svg>'
    svg = re.sub(r'(\d+\.\d)\d+', r'\1', svg)
    with open(os.path.join(ROOT, 'build', 'src', 'sign.svg'), 'w') as handle:
        handle.write(svg)
    print('sign.svg', len(svg), 'bytes')


def catering():
    """Catering has its own two typefaces: Lilita One for titles (the lettering of the printed
    flyers) and Outfit for text (the typeface of the catering team plan)."""
    outfit = instancer.instantiateVariableFont(TTFont(os.path.join(SRC, 'outfit-latin.woff2')), {'wght': (400, 700)})
    make(reload(outfit), 'outfit.woff2')
    make(TTFont(os.path.join(ROOT, 'designs', 'fonts', 'LilitaOne-Regular.ttf')), 'lilita.woff2')


def main():
    os.makedirs(OUT, exist_ok=True)
    catering()
    if sys.argv[1:] == ['catering']:
        return
    # Hahmlet: keep only the weights the site uses (300 for titles, 400 for item names).
    hahmlet = instancer.instantiateVariableFont(TTFont(os.path.join(SRC, 'hahmlet-latin.woff2')), {'wght': (300, 500)})
    make(reload(hahmlet), 'hahmlet.woff2')
    for weight in (400, 600):
        make(TTFont(os.path.join(SRC, f'plex-latin-{weight}.woff2')), f'plex-{weight}.woff2')
    make(TTFont(os.path.join(SRC, 'gaegu-latin-700.woff2')), 'gaegu-700.woff2')
    sign()


if __name__ == '__main__':
    main()
