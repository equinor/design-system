'use client'

import { useMemo } from 'react'
import Color from 'colorjs.io'
import { TS_GAUSSIAN, TS_HUES, TS_SCALE } from '@/config/tokensStudio'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { gaussian, generateColorScale } from '@/utils/color'
import { ScaleStrip } from './ScaleStrip'

// The accent hue comes first in TS_HUES
const EXAMPLE_HUE = TS_HUES[0]

function oklchParts(colour: string) {
  const [l, c, h] = new Color(colour).to('oklch').coords
  return { l: l ?? 0, c: c ?? 0, h: h == null || isNaN(h) ? 0 : h }
}

export function AboutHowItWorks() {
  const { colorScheme } = useColorScheme()
  const lightness = TS_SCALE[colorScheme]
  const { mean, stdDev } = TS_GAUSSIAN[colorScheme]
  const anchor = oklchParts(EXAMPLE_HUE.anchor)

  const scale = useMemo(
    () =>
      generateColorScale(EXAMPLE_HUE.anchor, lightness, mean, stdDev, 'OKLCH'),
    [lightness, mean, stdDev],
  )

  // Step 9, the emphasis fill, as a worked example
  const step9L = lightness[8]
  const step9Multiplier = gaussian(step9L, mean, stdDev)

  return (
    <section id="how-it-works" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">How a scale is made</h2>
      <div className="space-y-4">
        <p>
          The generator makes each step the way Tokens Studio does. In Tokens
          Studio&apos;s own notation, a step is:
        </p>
        <pre className="m-0 overflow-x-auto rounded border border-muted bg-surface p-4 font-mono text-sm">
          set_chroma(set_lightness(anchor, L), gaussian(L) × C)
        </pre>
        <ol className="space-y-2 pl-5 list-decimal">
          <li>
            Start from the hue&apos;s anchor, an{' '}
            <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> colour in the
            Tokens Studio set <code>input/palette</code>. Only its chroma (C)
            and hue (H) are used.
          </li>
          <li>
            Replace the lightness with the step&apos;s value, L, from{' '}
            <code>input/scale</code>. The anchor&apos;s own lightness is not
            used for any step.
          </li>
          <li>
            Multiply the anchor&apos;s chroma by the Gaussian curve at L. The
            multiplier is 1 where L equals the curve&apos;s mean and falls
            towards 0 further away, so steps near the mean keep most of the
            chroma and very light or very dark steps keep little.
          </li>
          <li>Keep the anchor&apos;s hue unchanged.</li>
        </ol>
        <p>
          Because every hue uses the same 15 lightness values, step 9 has the
          same lightness in every hue. That is why one semantic role can point
          at the same step for all six tones: for example,{' '}
          <code>background.interactive.&lt;tone&gt;.emphasis.default</code> is
          step 9 for accent, neutral, info, success, warning and danger, and the
          text on it has similar contrast in all of them.
        </p>
      </div>

      <div className="mt-6 rounded border border-muted bg-surface p-6">
        <h3 className="m-0 mb-1 text-header-md font-medium">
          Example: {EXAMPLE_HUE.name} in {colorScheme} mode
        </h3>
        <p className="m-0 mb-4 text-sm text-secondary">
          Generated live from the Tokens Studio values, so it follows the mode
          you choose in settings.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div
            className="size-10 shrink-0 rounded border border-muted"
            style={{ backgroundColor: EXAMPLE_HUE.anchor }}
          />
          <div className="text-sm">
            <div className="font-mono">{EXAMPLE_HUE.anchor}</div>
            <div className="text-secondary">
              Anchor: L {anchor.l.toFixed(3)}, C {anchor.c.toFixed(3)}, H{' '}
              {anchor.h.toFixed(1)}
            </div>
          </div>
        </div>

        <ScaleStrip
          colours={scale}
          label={`${EXAMPLE_HUE.name}, ${colorScheme} mode`}
        />

        <p className="m-0 mt-4 text-sm text-secondary">
          Step 9 has L {step9L}. The Gaussian curve in {colorScheme} mode has
          mean {mean} and standard deviation {stdDev}, which gives a multiplier
          of {step9Multiplier.toFixed(3)} at that lightness, so step 9 has
          chroma {anchor.c.toFixed(3)} × {step9Multiplier.toFixed(3)} ={' '}
          {(anchor.c * step9Multiplier).toFixed(3)} and hue{' '}
          {anchor.h.toFixed(1)}. The anchor itself, at L {anchor.l.toFixed(3)},
          does not have to appear in the scale: a step looks like the anchor
          only where its lightness happens to be close to the anchor&apos;s.
        </p>
      </div>
    </section>
  )
}
