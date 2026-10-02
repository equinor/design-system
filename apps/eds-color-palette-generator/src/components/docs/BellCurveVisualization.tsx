'use client'

import { useState, useMemo } from 'react'
import { gaussian } from '@/utils/color'

type BellCurveVisualizationProps = {
  initialMean?: number
  initialStdDev?: number
  /** Lightness values to mark on the curve, e.g. the 15 steps of a scale */
  markers?: number[]
}

export const BellCurveVisualization = ({
  initialMean = 0.6,
  initialStdDev = 2,
  markers = [],
}: BellCurveVisualizationProps) => {
  const [mean, setMean] = useState(initialMean)
  const [stdDev, setStdDev] = useState(initialStdDev)

  // Generate points for the bell curve
  const points = useMemo(() => {
    const numPoints = 100
    const result: Array<{ x: number; y: number }> = []

    for (let i = 0; i <= numPoints; i++) {
      const x = i / numPoints
      const y = gaussian(x, mean, stdDev)
      result.push({ x, y })
    }

    return result
  }, [mean, stdDev])

  // Create SVG path from points
  const pathData = useMemo(() => {
    const width = 600
    const height = 300
    const padding = 52

    const scaleX = (x: number) => padding + x * (width - 2 * padding)
    const scaleY = (y: number) => height - padding - y * (height - 2 * padding)

    const path = points
      .map((point, index) => {
        // Rounded so the server and the browser serialise the same string;
        // Math.exp can differ in the last digits, which breaks hydration.
        const x = scaleX(point.x).toFixed(2)
        const y = scaleY(point.y).toFixed(2)
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

    return { path, width, height, padding, scaleX, scaleY }
  }, [points])

  return (
    <div className="space-y-4">
      <div className="rounded border border-muted bg-surface p-6">
        <svg
          viewBox={`0 0 ${pathData.width} ${pathData.height}`}
          className="w-full h-auto"
          role="img"
          aria-label="Bell curve visualisation showing Gaussian distribution"
        >
          {/* Grid lines */}
          <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <line
                key={`v-${value}`}
                x1={pathData.scaleX(value)}
                y1={pathData.padding}
                x2={pathData.scaleX(value)}
                y2={pathData.height - pathData.padding}
              />
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <line
                key={`h-${value}`}
                x1={pathData.padding}
                y1={pathData.scaleY(value)}
                x2={pathData.width - pathData.padding}
                y2={pathData.scaleY(value)}
              />
            ))}
          </g>

          {/* Axes */}
          <g stroke="currentColor" strokeWidth="2">
            <line
              x1={pathData.padding}
              y1={pathData.height - pathData.padding}
              x2={pathData.width - pathData.padding}
              y2={pathData.height - pathData.padding}
            />
            <line
              x1={pathData.padding}
              y1={pathData.padding}
              x2={pathData.padding}
              y2={pathData.height - pathData.padding}
            />
          </g>

          {/* Axis labels */}
          <g fill="currentColor" fontSize="12">
            <text
              x={pathData.width / 2}
              y={pathData.height - 5}
              textAnchor="middle"
            >
              Lightness (0 to 1)
            </text>
            <text
              x={pathData.padding - 40}
              y={pathData.height / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${pathData.padding - 40} ${pathData.height / 2})`}
            >
              Chroma multiplier
            </text>

            {/* X-axis tick labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <text
                key={`x-label-${value}`}
                x={pathData.scaleX(value)}
                y={pathData.height - pathData.padding + 20}
                textAnchor="middle"
                fontSize="10"
              >
                {value.toFixed(2)}
              </text>
            ))}

            {/* Y-axis tick labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <text
                key={`y-label-${value}`}
                x={pathData.padding - 10}
                y={pathData.scaleY(value) + 4}
                textAnchor="end"
                fontSize="10"
              >
                {value.toFixed(2)}
              </text>
            ))}
          </g>

          {/* Bell curve path */}
          <path
            d={pathData.path}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-accent"
          />

          {/* One dot per step, where its lightness meets the curve */}
          <g className="text-accent" fill="currentColor">
            {markers.map((lightness, i) => (
              <circle
                key={i}
                cx={pathData.scaleX(lightness).toFixed(2)}
                cy={pathData
                  .scaleY(gaussian(lightness, mean, stdDev))
                  .toFixed(2)}
                r="4"
              >
                <title>{`Step ${i + 1}: L ${lightness}, multiplier ${gaussian(lightness, mean, stdDev).toFixed(3)}`}</title>
              </circle>
            ))}
          </g>

          {/* Mean indicator */}
          <line
            x1={pathData.scaleX(mean)}
            y1={pathData.padding}
            x2={pathData.scaleX(mean)}
            y2={pathData.height - pathData.padding}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="text-danger"
          />
          <text
            x={pathData.scaleX(mean)}
            y={pathData.padding - 10}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="text-danger"
          >
            Mean: {mean.toFixed(2)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-2 text-sm font-medium">
            Mean (centre of the curve)
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-secondary">
            Current value: {mean.toFixed(2)}
          </span>
        </label>

        <label className="block">
          <span className="block mb-2 text-sm font-medium">
            Standard deviation (width of the curve)
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
          <span className="text-sm text-secondary">
            Current value: {stdDev.toFixed(2)}
          </span>
        </label>
      </div>

      <div className="rounded border border-muted bg-surface p-4 text-sm">
        <p className="m-0 mb-2">
          The curve gives the share of the anchor&apos;s chroma that a step
          keeps at each lightness:
        </p>
        <ul className="m-0 list-disc space-y-1 pl-5 text-secondary">
          <li>
            <strong>Mean</strong> is the lightness where the multiplier is 1, so
            a step there keeps all of the anchor&apos;s chroma.
          </li>
          <li>
            <strong>Standard deviation</strong> sets how wide the curve is. A
            lower value narrows it, so chroma drops quickly away from the mean;
            a higher value widens it, so more steps keep their colour.
          </li>
          <li>
            The dots are the 15 steps of the scale. Steps 1 and 15, the canvas
            and the surface, are furthest from the mean in both modes, so they
            keep the least chroma.
          </li>
        </ul>
      </div>
    </div>
  )
}
