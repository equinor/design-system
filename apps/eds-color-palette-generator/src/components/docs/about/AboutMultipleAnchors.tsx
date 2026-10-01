'use client'

import { useMemo } from 'react'
import { TS_GAUSSIAN, TS_HUES, TS_SCALE } from '@/config/tokensStudio'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { generateColorScale } from '@/utils/color'
import { ScaleStrip } from './ScaleStrip'

// Two Tokens Studio anchors, so the example uses EDS hues: the accent
// hue at step 4 and the info hue at step 12.
const hueFor = (tone: 'accent' | 'info') =>
  TS_HUES.find((hue) => hue.tones.light.includes(tone)) ?? TS_HUES[0]
const START = hueFor('accent')
const END = hueFor('info')
const ANCHORS = [
  { step: 4, value: START.anchor, name: START.name },
  { step: 12, value: END.anchor, name: END.name },
]

export function AboutMultipleAnchors() {
  const { colorScheme } = useColorScheme()
  const { mean, stdDev } = TS_GAUSSIAN[colorScheme]

  const scale = useMemo(
    () =>
      generateColorScale(
        ANCHORS.map(({ step, value }) => ({ step, value })),
        TS_SCALE[colorScheme],
        mean,
        stdDev,
        'OKLCH',
      ),
    [colorScheme, mean, stdDev],
  )

  return (
    <section id="multiple-anchors" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">
        Palettes with several anchors
      </h2>
      <div className="mb-6 space-y-4">
        <p>
          In the Theme Builder a palette can have one colour or several anchors,
          each placed at a step. With several anchors, the generator finds the
          two anchors on either side of each step and blends their chroma and
          hue in OKLCH, taking the shorter way round the hue circle. Steps
          before the first anchor use the first anchor, and steps after the last
          use the last. Lightness still comes from the scale, at the
          anchor&apos;s own step too, so an anchor sets the hue and chroma
          there, never the exact colour.
        </p>
        <p>
          Several anchors are useful for trying out a scale whose hue shifts
          from light to dark. Tokens Studio has one anchor per hue, though, so a
          palette with several anchors cannot be proposed as it is: the Tokens
          Studio download lists it and leaves it out.
        </p>
      </div>

      <div className="rounded border border-muted bg-surface p-6">
        <h3 className="m-0 mb-1 text-header-md font-medium">
          Example: {START.name} at step 4, {END.name} at step 12
        </h3>
        <p className="m-0 mb-4 text-sm text-secondary">
          Generated live in {colorScheme} mode. The outlined steps hold the
          anchors.
        </p>
        <div className="mb-4 flex flex-wrap gap-6">
          {ANCHORS.map((anchor) => (
            <div key={anchor.step} className="flex items-center gap-2">
              <div
                className="size-8 shrink-0 rounded border border-muted"
                style={{ backgroundColor: anchor.value }}
              />
              <div className="text-sm">
                <div className="font-mono text-xs">{anchor.value}</div>
                <div className="text-xs text-secondary">
                  {anchor.name} anchor at step {anchor.step}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScaleStrip
          colours={scale}
          label={`${START.name} to ${END.name}, ${colorScheme} mode`}
          marked={ANCHORS.map((anchor) => anchor.step)}
        />
        <p className="m-0 mt-4 text-sm text-secondary">
          Compare each anchor with the outlined step: they share hue, but the
          step has the scale&apos;s lightness and the curve&apos;s share of the
          chroma, so it can look quite different from the anchor.
        </p>
      </div>
    </section>
  )
}
