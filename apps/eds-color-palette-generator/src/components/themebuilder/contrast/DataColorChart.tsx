'use client'

import { useState, useMemo } from 'react'
import { calcContrast } from '@/utils/palette'
import { stepLabel } from '@/config/config'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { paletteForTone } from '@/utils/semanticTokens'
import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { CVDFilter, cvdFilterStyle } from '@/components/shared/CVDFilter'
import { CVD_OPTIONS, type CVDType } from '@/utils/cvd'
import { StepSelect } from './StepSelect'

type Palette = { name: string; steps: string[] }

/** A chart series colour. `step` is present only for palette-derived colours. */
type ChartColor = { name: string; hex: string; step?: number }

type ChartType = 'bar' | 'stacked-bar' | 'donut' | 'line'

const CHART_TYPES: SegmentedOption<ChartType>[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'stacked-bar', label: 'Stacked bar' },
  { value: 'donut', label: 'Donut' },
  { value: 'line', label: 'Line' },
]

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

const CONTROL_LABEL = 'flex items-center gap-1.5 text-sm text-primary'

const SUBHEADING = 'm-0 text-base font-medium text-primary'

const BAR_DATA = [
  [82, 65, 48, 71, 55, 39, 60],
  [18, 35, 52, 29, 45, 61, 40],
]

const DONUT_SEGMENTS = [35, 25, 20, 12, 8]

/**
 * Pick black or white text for a fill, whichever gives the higher APCA
 * contrast (Lc). Used for labels sitting directly on a series colour so they
 * stay legible on both light and dark fills instead of a fixed colour.
 */
function bestTextColor(bg: string): string {
  const onBlack = Math.abs(parseFloat(calcContrast('#000000', bg).apca))
  const onWhite = Math.abs(parseFloat(calcContrast('#ffffff', bg).apca))
  return onBlack >= onWhite ? '#000000' : '#ffffff'
}

/** Monochromatic ordering following PatternFly: base(300→step8), 100, 500, 200, 400 */
function monochromaticSteps(): number[] {
  return [8, 2, 12, 5, 10]
}

/**
 * Translucent stripe overlays laid over a series colour so charts stay
 * readable without relying on hue alone (the survey's #1 accessibility habit).
 * Index 0 is solid; the rest cycle through distinct hatchings.
 */
const PATTERN_OVERLAYS: (string | undefined)[] = [
  undefined,
  'repeating-linear-gradient(45deg, rgba(255,255,255,.55) 0 2px, transparent 2px 8px)',
  'repeating-linear-gradient(-45deg, rgba(0,0,0,.4) 0 2px, transparent 2px 8px)',
  'repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 2px, transparent 2px 8px)',
  'repeating-linear-gradient(0deg, rgba(0,0,0,.4) 0 2px, transparent 2px 8px)',
  'repeating-linear-gradient(45deg, rgba(255,255,255,.6) 0 1px, transparent 1px 4px)',
]

function overlayFor(index: number, on: boolean): string | undefined {
  return on ? PATTERN_OVERLAYS[index % PATTERN_OVERLAYS.length] : undefined
}

/** Line dash patterns keyed by series index (index 0 is solid). */
const LINE_DASHES: (string | undefined)[] = [
  undefined,
  '6 4',
  '2 3',
  '8 3 2 3',
  '1 4',
  '10 4',
]

/** Point-marker shapes for line series, keyed by index. */
const MARKER_SHAPES = ['circle', 'square', 'triangle', 'diamond'] as const

/* ---------------------------------------------------------------------- */
/*  Chart renderers                                                        */
/* ---------------------------------------------------------------------- */

type ChartProps = {
  colors: { name: string; hex: string }[]
  bgHex: string
  textHex: string
  showPatterns?: boolean
}

function BarChart({ colors, bgHex, textHex, showPatterns }: ChartProps) {
  return (
    <div className="rounded p-4" style={{ backgroundColor: bgHex }}>
      <div className="flex h-40 items-end gap-2">
        {colors.map((pc, i) => {
          const h = BAR_DATA[0][i % BAR_DATA[0].length]
          return (
            <div
              key={pc.name}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span
                className="font-mono text-xs font-medium"
                style={{ color: textHex }}
              >
                {h}
              </span>
              <div
                className="w-full rounded-t"
                style={{
                  backgroundColor: pc.hex,
                  backgroundImage: overlayFor(i, !!showPatterns),
                  height: `${h}%`,
                  minHeight: 8,
                }}
              />
            </div>
          )
        })}
      </div>
      <XAxis colors={colors} textHex={textHex} />
    </div>
  )
}

function StackedBarChart({ colors, bgHex, textHex, showPatterns }: ChartProps) {
  const groups = ['Q1', 'Q2', 'Q3', 'Q4']
  return (
    <div className="rounded p-4" style={{ backgroundColor: bgHex }}>
      <div className="flex h-40 items-end gap-3">
        {groups.map((label, gi) => (
          <div key={label} className="flex h-full flex-1 flex-col justify-end">
            {colors.map((pc, ci) => {
              const val = 20 + ((gi * 13 + ci * 17) % 30)
              return (
                <div
                  key={pc.name}
                  style={{
                    backgroundColor: pc.hex,
                    backgroundImage: overlayFor(ci, !!showPatterns),
                    height: `${val}%`,
                    minHeight: 4,
                  }}
                  className={ci === 0 ? 'rounded-t' : ''}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div
        className="flex gap-3 mt-2 pt-2"
        style={{ borderTop: `1px solid ${textHex}30` }}
      >
        {groups.map((g) => (
          <div
            key={g}
            className="flex-1 text-center text-xs"
            style={{ color: textHex }}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ colors, bgHex, textHex, showPatterns }: ChartProps) {
  const total = DONUT_SEGMENTS.slice(0, colors.length).reduce(
    (a, b) => a + b,
    0,
  )
  const pcts = colors.map(
    (_, i) => (DONUT_SEGMENTS[i % DONUT_SEGMENTS.length] / total) * 100,
  )
  const segments = colors.map((pc, i) => ({
    name: pc.name,
    hex: pc.hex,
    pct: pcts[i],
    offset: 25 - pcts.slice(0, i).reduce((a, b) => a + b, 0),
  }))

  return (
    <div
      className="flex items-center justify-center rounded p-4"
      style={{ backgroundColor: bgHex }}
    >
      <div className="relative size-40">
        <svg viewBox="0 0 42 42" className="size-full">
          {showPatterns && (
            <defs>
              {segments.map(({ name, hex }, i) => (
                <pattern
                  key={name}
                  id={`donut-pat-${i}`}
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                  patternTransform={`rotate(${(i % 4) * 45})`}
                >
                  <rect width="4" height="4" fill={hex} />
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="4"
                    stroke={i % 2 ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.6)'}
                    strokeWidth="1.5"
                  />
                </pattern>
              ))}
            </defs>
          )}
          {segments.map(({ name, hex, pct, offset }, i) => (
            <circle
              key={name}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={showPatterns ? `url(#donut-pat-${i})` : hex}
              strokeWidth="5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offset}
            />
          ))}
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-base font-medium"
          style={{ color: textHex }}
        >
          {total}%
        </div>
      </div>
    </div>
  )
}

function Marker({
  shape,
  cx,
  cy,
  color,
}: {
  shape: (typeof MARKER_SHAPES)[number]
  cx: number
  cy: number
  color: string
}) {
  const s = 3
  if (shape === 'square')
    return (
      <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} fill={color} />
    )
  if (shape === 'triangle')
    return (
      <polygon
        points={`${cx},${cy - s} ${cx + s},${cy + s} ${cx - s},${cy + s}`}
        fill={color}
      />
    )
  if (shape === 'diamond')
    return (
      <polygon
        points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
        fill={color}
      />
    )
  return <circle cx={cx} cy={cy} r={s} fill={color} />
}

function LineChart({ colors, bgHex, textHex, showPatterns }: ChartProps) {
  const points = [20, 45, 35, 60, 50, 75, 65]
  const w = 280
  const h = 120
  const px = (i: number) => (i / (points.length - 1)) * w
  const py = (v: number, offset: number) => h - ((v + offset) / 100) * h

  return (
    <div className="rounded p-4" style={{ backgroundColor: bgHex }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-40 w-full"
        preserveAspectRatio="none"
      >
        {colors.map((pc, ci) => {
          const offset = ci * 5
          const d = points
            .map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(v, offset)}`)
            .join(' ')
          return (
            <g key={pc.name}>
              <path
                d={d}
                fill="none"
                stroke={pc.hex}
                strokeWidth="2"
                strokeDasharray={
                  showPatterns
                    ? LINE_DASHES[ci % LINE_DASHES.length]
                    : undefined
                }
                vectorEffect="non-scaling-stroke"
              />
              {showPatterns &&
                points.map((v, i) => (
                  <Marker
                    key={i}
                    shape={MARKER_SHAPES[ci % MARKER_SHAPES.length]}
                    cx={px(i)}
                    cy={py(v, offset)}
                    color={pc.hex}
                  />
                ))}
            </g>
          )
        })}
      </svg>
      <div
        className="mt-2 pt-2 flex gap-2"
        style={{ borderTop: `1px solid ${textHex}30` }}
      >
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div
            key={d}
            className="flex-1 text-center text-xs"
            style={{ color: textHex }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

function XAxis({
  colors,
  textHex,
}: {
  colors: { name: string; hex: string }[]
  textHex: string
}) {
  return (
    <div
      className="flex gap-2 mt-2 pt-2"
      style={{ borderTop: `1px solid ${textHex}30` }}
    >
      {colors.map((pc) => (
        <div
          key={pc.name}
          className="flex-1 truncate text-center text-xs"
          style={{ color: textHex }}
        >
          {pc.name}
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Legend                                                                  */
/* ---------------------------------------------------------------------- */

// The legend sits on the chart background, so its text uses the chart's text
// colour rather than the app's.
function Legend({
  colors,
  bgHex,
  textHex,
}: {
  colors: ChartColor[]
  bgHex: string
  textHex: string
}) {
  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 rounded p-3"
      style={{ backgroundColor: bgHex }}
    >
      {colors.map((pc) => (
        <div key={pc.name} className="flex items-center gap-1.5 text-xs">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: pc.hex }}
          />
          <span style={{ color: textHex }}>
            {pc.name}
            {pc.step != null && (
              <>
                {' '}
                <span className="font-mono text-xs opacity-80">
                  ({stepLabel(pc.step + 1)})
                </span>
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Main component                                                         */
/* ---------------------------------------------------------------------- */

type DataColorChartProps = {
  /** Palette-derived mode (theme builder): colours are sliced from these. */
  palettes?: Palette[]
  /** Direct mode (data-viz route): render exactly these generated colours. */
  colors?: ChartColor[]
  /** Chart background / text hex — used in direct mode. */
  bgHex?: string
  textHex?: string
  /**
   * Show the pairwise "every pair ≥ 3:1" matrix. Meaningful for categorical
   * series; misleading for sequential/diverging scales whose steps are
   * intentionally similar, so the panel turns it off for those.
   */
  pairwiseCheck?: boolean
}

export function DataColorChart({
  palettes,
  colors: externalColors,
  bgHex: externalBg,
  textHex: externalText,
  pairwiseCheck = true,
}: DataColorChartProps) {
  const { colorScheme } = useColorScheme()
  // 0-based: step 1 (background.canvas) and step 13 (text.primary)
  const [bgStep, setBgStep] = useState(0)
  const [textStep, setTextStep] = useState(12)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [mono, setMono] = useState(false)
  const [monoPaletteIdx, setMonoPaletteIdx] = useState(0)
  const [cvd, setCvd] = useState<CVDType>('none')
  const [showPatterns, setShowPatterns] = useState(false)

  // Palette mode drives the derivation + step selectors; direct mode renders
  // the passed colours and hides the palette-only controls.
  const paletteMode = !externalColors
  const safePalettes = useMemo(() => palettes ?? [], [palettes])
  // The neutral palette follows Tokens Studio (Gray in light, North Sea in
  // dark), falling back to the Tokens Studio default when there is none.
  const neutral = paletteForTone(safePalettes, 'neutral', colorScheme)
  const paletteBg = neutral.steps[bgStep]
  const paletteText = neutral.steps[textStep]
  const bgHex = externalBg ?? paletteBg
  const textHex = externalText ?? paletteText

  /**
   * Multi-chromatic with lightness spread: each palette uses a different step
   * so colors are distinguishable by lightness alone (achromatopsia-friendly).
   * Centred on step 9 (index 8, background.interactive.<tone>.emphasis.default),
   * then spreads ±1 per palette.
   */
  const multiColors = useMemo<ChartColor[]>(() => {
    const center = 8
    const count = safePalettes.length
    const startStep = Math.max(0, center - Math.floor((count - 1) / 2))
    return safePalettes.map((p, i) => {
      const step = Math.min(14, startStep + i)
      return { name: p.name, hex: p.steps[step], step }
    })
  }, [safePalettes])

  // Monochromatic: multiple shades from a single palette
  const monoColors = useMemo<ChartColor[]>(() => {
    if (!safePalettes.length) return []
    const p = safePalettes[monoPaletteIdx] ?? safePalettes[0]
    return monochromaticSteps().map((step) => ({
      name: `${p.name}/${step + 1}`,
      hex: p.steps[step],
      step,
    }))
  }, [safePalettes, monoPaletteIdx])

  const derivedColors = mono ? monoColors : multiColors
  const colors: ChartColor[] = externalColors ?? derivedColors

  const ChartComponent = {
    bar: BarChart,
    'stacked-bar': StackedBarChart,
    donut: DonutChart,
    line: LineChart,
  }[chartType]

  return (
    <Card
      title="Data colour chart"
      description={
        paletteMode
          ? 'Preview palette colours in chart contexts — multi-chromatic (one colour per palette) or monochromatic (shades from a single palette)'
          : 'Preview the generated data-viz palette in chart contexts, then check it under colour-vision-deficiency simulation.'
      }
    >
      <div className="flex flex-col gap-4">
        {/* Controls row 1: chart type + mode */}
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl
            mode="radio"
            aria-label="Chart type"
            size="sm"
            options={CHART_TYPES}
            value={chartType}
            onChange={setChartType}
          />

          {paletteMode && (
            <label className={CONTROL_LABEL}>
              <input
                type="checkbox"
                checked={mono}
                onChange={(e) => setMono(e.target.checked)}
              />
              <span className="font-medium">Monochromatic</span>
            </label>
          )}

          {paletteMode && mono && (
            <label className={CONTROL_LABEL}>
              <span className="font-medium">Palette</span>
              <select
                value={monoPaletteIdx}
                onChange={(e) => setMonoPaletteIdx(Number(e.target.value))}
                className={SELECT_CLASS}
              >
                {safePalettes.map((p, i) => (
                  <option key={i} value={i}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* Controls row 2: bg + text + accessibility */}
        <div className="flex flex-wrap items-center gap-4">
          {paletteMode && (
            <>
              <StepSelect
                label="Chart bg"
                value={bgStep}
                onChange={setBgStep}
                only="background"
              />
              <StepSelect
                label="Text"
                value={textStep}
                onChange={setTextStep}
                only="text"
              />
            </>
          )}

          <label className={CONTROL_LABEL}>
            <span className="font-medium">Vision</span>
            <select
              value={cvd}
              onChange={(e) => {
                setCvd(e.target.value as CVDType)
              }}
              className={SELECT_CLASS}
            >
              {CVD_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className={CONTROL_LABEL}>
            <input
              type="checkbox"
              checked={showPatterns}
              onChange={(e) => setShowPatterns(e.target.checked)}
            />
            <span className="font-medium">Show patterns</span>
          </label>
        </div>

        {/* SVG filter definitions */}
        <CVDFilter type={cvd} />

        {/* Filtered preview area */}
        <div style={cvdFilterStyle(cvd)}>
          {/* Chart */}
          <ChartComponent
            colors={colors}
            bgHex={bgHex}
            textHex={textHex}
            showPatterns={showPatterns}
          />

          {/* Legend */}
          <div className="mt-4">
            <Legend colors={colors} bgHex={bgHex} textHex={textHex} />
          </div>

          {/* Chips / Badges */}
          <div className="mt-4 flex flex-col gap-2">
            <h3 className={SUBHEADING}>Chips &amp; badges</h3>
            <div
              className="flex flex-wrap gap-2 rounded p-4"
              style={{ backgroundColor: bgHex }}
            >
              {colors.map((pc, i) => (
                <span
                  key={pc.name}
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: pc.hex,
                    backgroundImage: overlayFor(i, showPatterns),
                    color: bestTextColor(pc.hex),
                  }}
                >
                  {pc.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contrast table (outside filter — shows real values) */}
        <div className="flex flex-col gap-2">
          <h3 className={SUBHEADING}>Contrast on chart background</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((pc) => {
              const result = calcContrast(pc.hex, bgHex)
              return (
                <div key={pc.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="inline-block size-3 rounded border border-muted"
                    style={{ backgroundColor: pc.hex }}
                  />
                  <span className="max-w-20 truncate text-secondary">
                    {pc.name}
                  </span>
                  <span className="font-mono font-medium text-primary">
                    {result.wcag}
                  </span>
                  <Badge pass={result.aa} label="AA" />
                  <Badge pass={result.aaa} label="AAA" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Inter-color contrast matrix */}
        {pairwiseCheck && colors.length > 1 && (
          <div className="flex flex-col gap-2">
            <h3 className={SUBHEADING}>Colour-to-colour contrast</h3>
            <p className="m-0 text-xs text-secondary">
              Each pair of data colours must be distinguishable — 3:1 minimum
              for adjacent chart elements
            </p>
            <div className="overflow-x-auto">
              <table className="border-collapse text-xs">
                <thead>
                  <tr>
                    <th />
                    {colors.map((pc) => (
                      <th
                        key={pc.name}
                        className="px-2 py-1 font-medium text-secondary"
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-block size-2 rounded-sm"
                            style={{ backgroundColor: pc.hex }}
                          />
                          <span className="max-w-[60px] truncate">
                            {pc.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colors.map((row, ri) => (
                    <tr key={row.name}>
                      <td className="px-2 py-1 font-medium whitespace-nowrap text-secondary">
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-block size-2 rounded-sm"
                            style={{ backgroundColor: row.hex }}
                          />
                          <span className="max-w-[60px] truncate">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      {colors.map((col, ci) => {
                        if (ci <= ri) {
                          return (
                            <td
                              key={col.name}
                              className="px-2 py-1 text-center"
                            >
                              {ci === ri ? '—' : ''}
                            </td>
                          )
                        }
                        const result = calcContrast(row.hex, col.hex)
                        const ratio = parseFloat(result.wcag)
                        const pass3 = ratio >= 3
                        return (
                          <td
                            key={col.name}
                            className={[
                              'px-2 py-1 text-center font-mono',
                              pass3
                                ? 'bg-success-muted text-success-on-muted'
                                : 'bg-danger-muted text-danger-on-muted',
                            ].join(' ')}
                          >
                            {result.wcag}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
