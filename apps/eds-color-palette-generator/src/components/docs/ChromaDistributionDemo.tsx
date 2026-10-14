'use client'

import { useMemo, useState } from 'react'
import Color from 'colorjs.io'
import {
  gaussian,
  generateColorScale,
  isValidColorFormat,
  parseColorToHex,
  toOklchString,
} from '@/utils/color'
import { ScaleStrip } from '@/components/docs/about/ScaleStrip'

type ChromaDistributionDemoProps = {
  /** The starting colour, e.g. a Tokens Studio anchor */
  initialBaseColor: string
  /** The 15 lightness values of the scale, step 1 first */
  lightness: number[]
  initialMean: number
  initialStdDev: number
}

const CHART = { left: 40, right: 360, top: 20, bottom: 240 }
const CHART_WIDTH = CHART.right - CHART.left
const CHART_HEIGHT = CHART.bottom - CHART.top

function chromaOf(colour: string): number {
  try {
    return new Color(colour).to('oklch').coords[1] ?? 0
  } catch {
    return 0
  }
}

export const ChromaDistributionDemo = ({
  initialBaseColor,
  lightness,
  initialMean,
  initialStdDev,
}: ChromaDistributionDemoProps) => {
  // What is typed; only a valid colour reaches the scale
  const [text, setText] = useState(initialBaseColor)
  const [baseColor, setBaseColor] = useState(initialBaseColor)
  const [mean, setMean] = useState(initialMean)
  const [stdDev, setStdDev] = useState(initialStdDev)
  const valid = isValidColorFormat(text)

  const colorScale = useMemo(
    () => generateColorScale(baseColor, lightness, mean, stdDev, 'OKLCH'),
    [baseColor, lightness, mean, stdDev],
  )

  const baseChroma = chromaOf(baseColor)
  const steps = lightness.map((l, i) => {
    const multiplier = gaussian(l, mean, stdDev)
    return {
      step: i + 1,
      lightness: l,
      multiplier,
      chroma: multiplier * baseChroma,
    }
  })
  const strongest = steps.reduce((max, s) => (s.chroma > max.chroma ? s : max))
  const chartMax = Math.max(baseChroma, 0.01)
  const barSlot = CHART_WIDTH / steps.length

  const setColour = (next: string) => {
    setText(next)
    if (isValidColorFormat(next)) setBaseColor(next.trim())
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="chroma-demo-colour"
              className="mb-2 block text-sm font-medium"
            >
              Anchor
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={parseColorToHex(baseColor) ?? '#808080'}
                onChange={(e) =>
                  setColour(toOklchString(e.target.value) ?? e.target.value)
                }
                aria-label="Pick the anchor colour"
                className="h-10 w-16 cursor-pointer rounded border border-input bg-input"
              />
              <input
                id="chroma-demo-colour"
                type="text"
                value={text}
                onChange={(e) => setColour(e.target.value)}
                spellCheck={false}
                aria-invalid={!valid}
                className={[
                  'flex-1 rounded border bg-input px-3 py-2 font-mono text-sm text-primary',
                  valid
                    ? 'border-input hover:border-input-hover'
                    : 'border-danger',
                ].join(' ')}
              />
            </div>
            <p className="m-0 mt-1 text-xs text-secondary">
              Any CSS colour works, for example <code>#ff6b6b</code> or{' '}
              <code>oklch(0.6 0.15 30)</code>.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Mean</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mean}
              onChange={(e) => setMean(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-secondary">{mean.toFixed(2)}</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Standard deviation
            </span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={stdDev}
              onChange={(e) => setStdDev(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-secondary">{stdDev.toFixed(2)}</span>
          </label>

          <div className="rounded border border-muted bg-surface p-4 text-sm">
            <ul className="m-0 list-none space-y-1 p-0 text-secondary">
              <li>Anchor chroma: {baseChroma.toFixed(3)}</li>
              <li>
                Most chroma: step {strongest.step} (L {strongest.lightness}),
                chroma {strongest.chroma.toFixed(3)}
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded border border-muted bg-surface p-6">
          <h3 className="m-0 mb-4 text-sm font-medium">Chroma per step</h3>
          <svg
            viewBox="0 0 400 280"
            className="h-auto w-full"
            role="img"
            aria-label={`Chroma of steps 1 to 15. The most is at step ${strongest.step}.`}
          >
            <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
              {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                <line
                  key={value}
                  x1={CHART.left}
                  y1={CHART.bottom - value * CHART_HEIGHT}
                  x2={CHART.right}
                  y2={CHART.bottom - value * CHART_HEIGHT}
                />
              ))}
            </g>

            <g stroke="currentColor" strokeWidth="2">
              <line
                x1={CHART.left}
                y1={CHART.top}
                x2={CHART.left}
                y2={CHART.bottom}
              />
              <line
                x1={CHART.left}
                y1={CHART.bottom}
                x2={CHART.right}
                y2={CHART.bottom}
              />
            </g>

            {steps.map((s, i) => {
              const height = ((s.chroma / chartMax) * CHART_HEIGHT).toFixed(2)
              return (
                <g key={s.step}>
                  <rect
                    x={(CHART.left + i * barSlot + 2).toFixed(2)}
                    y={(CHART.bottom - Number(height)).toFixed(2)}
                    width={(barSlot - 4).toFixed(2)}
                    height={height}
                    fill={colorScale[i]}
                    stroke="currentColor"
                    strokeOpacity="0.2"
                  >
                    <title>{`Step ${s.step}: L ${s.lightness}, multiplier ${s.multiplier.toFixed(3)}, chroma ${s.chroma.toFixed(3)}`}</title>
                  </rect>
                  <text
                    x={(CHART.left + (i + 0.5) * barSlot).toFixed(2)}
                    y={CHART.bottom + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                  >
                    {s.step}
                  </text>
                </g>
              )
            })}

            <text
              x={(CHART.left + CHART.right) / 2}
              y={CHART.bottom + 34}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              Step
            </text>
            <text
              x={12}
              y={(CHART.top + CHART.bottom) / 2}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              transform={`rotate(-90 12 ${(CHART.top + CHART.bottom) / 2})`}
            >
              Chroma
            </text>
            {[0, 0.5, 1].map((value) => (
              <text
                key={value}
                x={CHART.left - 6}
                y={CHART.bottom - value * CHART_HEIGHT + 4}
                textAnchor="end"
                fontSize="10"
                fill="currentColor"
              >
                {(value * chartMax).toFixed(2)}
              </text>
            ))}
          </svg>
          <p className="m-0 mt-2 text-xs text-secondary">
            The top of the chart is the anchor&apos;s own chroma, the most any
            step can have.
          </p>
        </div>
      </div>

      <div>
        <h3 className="m-0 mb-3 text-sm font-medium">The generated scale</h3>
        <ScaleStrip colours={colorScale} label="Generated scale" />
      </div>
    </div>
  )
}
