'use client'

import { useState, useMemo } from 'react'
import { gaussian } from '@/utils/color'

type BellCurveVisualizationProps = {
  initialMean?: number
  initialStdDev?: number
}

export const BellCurveVisualization = ({
  initialMean = 0.6,
  initialStdDev = 2,
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
    const padding = 40

    const scaleX = (x: number) => padding + x * (width - 2 * padding)
    const scaleY = (y: number) => height - padding - y * (height - 2 * padding)

    const path = points
      .map((point, index) => {
        const x = scaleX(point.x)
        const y = scaleY(point.y)
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

    return { path, width, height, padding, scaleX, scaleY }
  }, [points])

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-lg p-6">
        <svg
          viewBox={`0 0 ${pathData.width} ${pathData.height}`}
          className="w-full h-auto"
          role="img"
          aria-label="Bell curve visualization showing Gaussian distribution"
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
              x={pathData.padding - 25}
              y={pathData.height / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${pathData.padding - 25} ${pathData.height / 2})`}
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
            className="text-blue-600 dark:text-blue-400"
          />

          {/* Mean indicator */}
          <line
            x1={pathData.scaleX(mean)}
            y1={pathData.padding}
            x2={pathData.scaleX(mean)}
            y2={pathData.height - pathData.padding}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="text-red-500"
          />
          <text
            x={pathData.scaleX(mean)}
            y={pathData.padding - 10}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="text-red-500"
          >
            Mean: {mean.toFixed(1)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-2 text-sm font-medium">
            Mean (center of the curve)
          </span>
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
            className="w-full accent-current"
          />
          <span className="text-sm text-neutral-subtle">
            Current value: {stdDev.toFixed(2)}
          </span>
        </label>
      </div>

      <div className="bg-surface rounded-lg p-4 text-sm">
        <p className="mb-2">
          <strong>How it works:</strong> The bell curve (Gaussian function)
          determines how much chroma (color intensity) is applied at different
          lightness levels.
        </p>
        <ul className="list-disc list-inside space-y-1 text-neutral-subtle">
          <li>
            <strong>Mean:</strong> The lightness value where chroma is at its
            maximum
          </li>
          <li>
            <strong>Standard deviation:</strong> How quickly chroma decreases
            away from the mean
          </li>
          <li>Higher values near the mean = more vibrant colors</li>
          <li>Lower values away from the mean = more muted colors</li>
        </ul>
      </div>
    </div>
  )
}
