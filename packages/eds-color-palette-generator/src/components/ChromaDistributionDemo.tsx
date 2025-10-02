'use client'

import { useState, useMemo } from 'react'
import { generateColorScale, gaussian } from '@/utils/color'
import Color from 'colorjs.io'

type ChromaDistributionDemoProps = {
  initialBaseColor?: string
  initialMean?: number
  initialStdDev?: number
}

export const ChromaDistributionDemo = ({
  initialBaseColor = '#FF6B6B',
  initialMean = 0.6,
  initialStdDev = 2,
}: ChromaDistributionDemoProps) => {
  const [baseColor, setBaseColor] = useState(initialBaseColor)
  const [mean, setMean] = useState(initialMean)
  const [stdDev, setStdDev] = useState(initialStdDev)

  // Generate lightness values (using a simplified 15-step scale)
  const lightnessValues = useMemo(() => {
    const steps = 15
    return Array.from({ length: steps }, (_, i) => i / (steps - 1))
  }, [])

  // Generate color scale
  const colorScale = useMemo(() => {
    return generateColorScale(baseColor, lightnessValues, mean, stdDev, 'OKLCH')
  }, [baseColor, lightnessValues, mean, stdDev])

  // Calculate chroma values for visualization
  const chromaData = useMemo(() => {
    try {
      const base = new Color(baseColor)
      const oklchBase = base.to('oklch')
      const baseChroma = oklchBase.c

      return lightnessValues.map((lightness) => {
        const multiplier = gaussian(lightness, mean, stdDev)
        const chroma = multiplier * baseChroma
        return { lightness, chroma, multiplier, baseChroma }
      })
    } catch {
      return []
    }
  }, [baseColor, lightnessValues, mean, stdDev])

  const maxChroma = Math.max(...chromaData.map((d) => d.chroma), 0.1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <label className="block">
            <span className="block mb-2 text-sm font-medium">Base color</span>
            <div className="flex gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-subtle rounded bg-surface"
                placeholder="#FF6B6B"
              />
            </div>
          </label>

          <label className="block">
            <span className="block mb-2 text-sm font-medium">Mean</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mean}
              onChange={(e) => setMean(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm text-neutral-subtle">
              {mean.toFixed(2)}
            </span>
          </label>

          <label className="block">
            <span className="block mb-2 text-sm font-medium">
              Standard deviation
            </span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={stdDev}
              onChange={(e) => setStdDev(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm text-neutral-subtle">
              {stdDev.toFixed(2)}
            </span>
          </label>

          {chromaData.length > 0 && (
            <div className="bg-surface rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Base color properties:</p>
              <ul className="space-y-1 text-neutral-subtle">
                <li>Base chroma: {chromaData[0].baseChroma.toFixed(3)}</li>
                <li>Max chroma in scale: {maxChroma.toFixed(3)}</li>
                <li>
                  Peak at lightness:{' '}
                  {chromaData
                    .reduce((max, d) => (d.chroma > max.chroma ? d : max))
                    .lightness.toFixed(2)}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Chroma distribution chart */}
        <div className="bg-surface rounded-lg p-6">
          <h4 className="text-sm font-medium mb-4">Chroma distribution</h4>
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto"
            role="img"
            aria-label="Chroma distribution across lightness values"
          >
            {/* Grid and axes */}
            <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
              {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                <line
                  key={`grid-x-${value}`}
                  x1={40 + value * 320}
                  y1={20}
                  x2={40 + value * 320}
                  y2={240}
                />
              ))}
              {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                <line
                  key={`grid-y-${value}`}
                  x1={40}
                  y1={240 - value * 220}
                  x2={360}
                  y2={240 - value * 220}
                />
              ))}
            </g>

            {/* Axes */}
            <g stroke="currentColor" strokeWidth="2">
              <line x1={40} y1={20} x2={40} y2={240} />
              <line x1={40} y1={240} x2={360} y2={240} />
            </g>

            {/* Axis labels */}
            <text
              x={200}
              y={275}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              Lightness
            </text>
            <text
              x={15}
              y={130}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              transform="rotate(-90 15 130)"
            >
              Chroma
            </text>

            {/* Bars */}
            {chromaData.map((data, index) => {
              const x = 40 + (data.lightness * 320) / 1
              const barWidth = 320 / chromaData.length
              const height = (data.chroma / maxChroma) * 220
              const y = 240 - height

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth - 2}
                    height={height}
                    fill="currentColor"
                    className="text-blue-500"
                    opacity="0.7"
                  />
                  <title>{`Lightness: ${data.lightness.toFixed(2)}, Chroma: ${data.chroma.toFixed(3)}`}</title>
                </g>
              )
            })}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <text
                key={`y-label-${value}`}
                x={30}
                y={240 - value * 220 + 4}
                textAnchor="end"
                fontSize="10"
                fill="currentColor"
              >
                {(value * maxChroma).toFixed(2)}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Generated color scale */}
      <div>
        <h4 className="text-sm font-medium mb-3">Generated color scale</h4>
        <div className="flex gap-1 rounded-lg overflow-hidden">
          {colorScale.map((color, index) => (
            <div
              key={index}
              className="flex-1 h-20 relative group"
              style={{ backgroundColor: color }}
              title={`Step ${index}: ${color}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <span className="text-white text-xs font-mono">{index}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-subtle mt-2">
          Hover over each step to see its index. Notice how chroma (color
          intensity) peaks near the mean lightness value.
        </p>
      </div>

      <div className="bg-surface rounded-lg p-4 text-sm">
        <p className="mb-2">
          <strong>Chroma calculation formula:</strong>
        </p>
        <code className="block border border-neutral-subtle p-2 rounded font-mono text-xs">
          chroma = gaussian(lightness, mean, stdDev) × baseChroma
        </code>
        <p className="mt-2 text-neutral-subtle">
          Where the Gaussian function outputs a multiplier between 0 and 1,
          which scales the base color's chroma based on the lightness
          value's distance from the mean.
        </p>
      </div>
    </div>
  )
}
