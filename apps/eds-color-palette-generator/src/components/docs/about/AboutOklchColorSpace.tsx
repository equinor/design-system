import Color from 'colorjs.io'
import { TS_HUES } from '@/config/tokensStudio'

// The most colourful Tokens Studio anchor, as an example of a high chroma
const STRONGEST = TS_HUES.map((hue) => ({
  name: hue.name,
  chroma: new Color(hue.anchor).to('oklch').coords[1] ?? 0,
})).reduce((max, hue) => (hue.chroma > max.chroma ? hue : max))

export function AboutOklchColorSpace() {
  return (
    <section id="oklch-color-space" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Why OKLCH</h2>
      <div className="space-y-4">
        <p>
          <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> describes a
          colour with three numbers, and each of them matches one step of the
          generation. It is the polar form of the Oklab colour space, which was
          designed so that equal changes in the numbers look like roughly equal
          changes in colour.
        </p>
        <dl className="m-0 space-y-4 rounded border border-muted bg-surface p-6">
          <div>
            <dt className="font-medium">Lightness (L)</dt>
            <dd className="m-0 text-sm text-secondary">
              From 0 (black) to 1 (white). Two colours with the same L look
              about equally light whatever their hue, which is what lets one
              lightness scale serve all seven hues. In HSL, by comparison, a
              yellow and a blue with the same lightness value look very
              different.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Chroma (C)</dt>
            <dd className="m-0 text-sm text-secondary">
              How colourful the colour is. 0 is grey; the most colourful anchor
              in Tokens Studio, {STRONGEST.name}, has chroma{' '}
              {STRONGEST.chroma.toFixed(2)}. The Gaussian curve scales this
              number, step by step.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Hue (H)</dt>
            <dd className="m-0 text-sm text-secondary">
              The angle on the colour wheel, from 0 to 360 degrees. A scale
              keeps the anchor&apos;s hue on every step.
            </dd>
          </div>
        </dl>
        <p>
          OKLCH is the canonical form for EDS colour (ADR 0016, D9): the anchors
          are stored as OKLCH in Tokens Studio, and the published CSS uses{' '}
          <code>oklch()</code> values. The Theme Builder therefore shows colours
          in OKLCH by default. The OKLCH and HEX switch on the Palettes card
          changes every colour value on the page to HEX if you need it, and
          palettes are still stored in OKLCH.
        </p>
        <p>
          Some OKLCH colours, mostly ones with high chroma, are outside the sRGB
          range that HEX can express. Their HEX value is brought inside sRGB, so
          it can look slightly less colourful than the OKLCH value.
        </p>
      </div>
    </section>
  )
}
