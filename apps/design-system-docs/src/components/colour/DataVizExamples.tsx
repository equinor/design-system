import React, { useRef, useState } from 'react'

import './dataviz-examples.css'

/**
 * Example charts for the data visualisation colour page: a multi-well line chart, a stacked bar
 * chart and a donut. Plain React and SVG, no chart library.
 *
 * Every colour is a token. Series take categorical hues in token order and keep them when the reader
 * filters, lines use step 4, fills use step 3, faded series use step 2, and text and axes use the
 * text and border tokens. Hues that are weak in a scheme rely on the legend, the tooltip and the data
 * table, which give every value as text.
 *
 * The field names are Equinor production fields, used as labels only. Every number is random,
 * generated below with a seeded generator, and has no connection to their production. The well labels
 * are made up.
 */

const dv = (hue: number, step: number) =>
  `var(--eds-data-visualization-cat-${hue}-${step})`

/** Small deterministic random generator, so the made-up data is the same on every render. */
function random(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const fmt = (n: number, digits = 0) =>
  n.toLocaleString('en-GB', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

type Shape =
  'square' | 'circle' | 'triangle' | 'diamond' | 'triangleDown' | 'plus'

function Marker({
  shape,
  x,
  y,
  size = 8,
  fill,
}: {
  shape: Shape
  x: number
  y: number
  size?: number
  fill: string
}) {
  const r = size / 2
  const ring = {
    stroke: 'var(--eds-background-surface)',
    strokeWidth: 2,
    paintOrder: 'stroke' as const,
  }
  if (shape === 'circle')
    return <circle cx={x} cy={y} r={r} fill={fill} {...ring} />
  if (shape === 'square')
    return (
      <rect
        x={x - r}
        y={y - r}
        width={size}
        height={size}
        rx={1}
        fill={fill}
        {...ring}
      />
    )
  const t = r + 1
  const d =
    shape === 'triangle'
      ? `M${x},${y - t}L${x + t},${y + r}L${x - t},${y + r}Z`
      : shape === 'triangleDown'
        ? `M${x},${y + t}L${x + t},${y - r}L${x - t},${y - r}Z`
        : shape === 'diamond'
          ? `M${x},${y - t}L${x + t},${y}L${x},${y + t}L${x - t},${y}Z`
          : // plus: a filled cross
            `M${x - 1.5},${y - t}h3v${t - 1.5}h${t - 1.5}v3h${-(t - 1.5)}v${t - 1.5}h-3v${-(t - 1.5)}h${-(t - 1.5)}v-3h${t - 1.5}Z`
  return <path d={d} fill={fill} {...ring} />
}

function Disclaimer() {
  return (
    <p className="dv-disclaimer">
      Random example data. The numbers have no connection to the production of
      these fields or any other.
    </p>
  )
}

function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string
  head: string[]
  rows: (string | number)[][]
}) {
  return (
    <details className="dv-data">
      <summary>Show the data as a table</summary>
      <div className="dv-table-scroll">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[0])}>
                {r.map((c, j) =>
                  j === 0 ? (
                    <th key={head[j]} scope="row">
                      {c}
                    </th>
                  ) : (
                    <td key={head[j]}>{c}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

/* ------------------------------------------------------------------ */
/*  Line chart: several wells, several measures                        */
/* ------------------------------------------------------------------ */

const WELLS: {
  id: string
  field: string
  name: string
  hue: number
  shape: Shape
}[] = [
  { id: 'w1', field: 'Snorre', name: 'Well 1', hue: 1, shape: 'square' },
  { id: 'w2', field: 'Snorre', name: 'Well 2', hue: 2, shape: 'circle' },
  { id: 'w3', field: 'Heidrun', name: 'Well 3', hue: 3, shape: 'triangle' },
  { id: 'w4', field: 'Heidrun', name: 'Well 4', hue: 4, shape: 'diamond' },
  { id: 'w5', field: 'Åsgard', name: 'Well 5', hue: 5, shape: 'triangleDown' },
  { id: 'w6', field: 'Åsgard', name: 'Well 6', hue: 6, shape: 'plus' },
]

const MEASURES: {
  key: 'gas' | 'water' | 'cum'
  label: string
  unit: string
  digits: number
}[] = [
  { key: 'gas', label: 'Gas rate', unit: 'kSm³/d', digits: 0 },
  { key: 'water', label: 'Water rate', unit: 'm³/d', digits: 0 },
  { key: 'cum', label: 'Cumulative gas', unit: 'GSm³', digits: 3 },
]

const MONTHS = 72 // January 2004 to December 2009
const START_YEAR = 2004
const monthLabel = (i: number) =>
  new Date(Date.UTC(START_YEAR, i, 1)).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

type WellSeries = Record<'gas' | 'water' | 'cum', number[]>

function makeWellData(): Record<string, WellSeries> {
  const bases = [
    { gas: 92, water: 10, trend: 0.18 },
    { gas: 74, water: 28, trend: 0.32 },
    { gas: 58, water: 6, trend: 0.08 },
    { gas: 46, water: 18, trend: 0.24 },
    { gas: 34, water: 38, trend: 0.12 },
    { gas: 22, water: 2, trend: 0.05 },
  ]
  const out: Record<string, WellSeries> = {}
  WELLS.forEach((w, wi) => {
    const rnd = random(11 + wi * 7)
    const b = bases[wi]
    const gas: number[] = []
    const water: number[] = []
    const cum: number[] = []
    let total = 0.02 + wi * 0.015
    for (let m = 0; m < MONTHS; m++) {
      const season = Math.sin((m / 12) * Math.PI * 2 + wi) * 6
      const g = Math.max(0, b.gas - m * 0.25 + season + (rnd() - 0.5) * 22)
      const wv = Math.max(0, b.water + m * b.trend + (rnd() - 0.5) * 9)
      total += (g * 30) / 1e6
      gas.push(g)
      water.push(wv)
      cum.push(total)
    }
    out[w.id] = { gas, water, cum }
  })
  return out
}

const WELL_DATA = makeWellData()

export function LineChartExample() {
  const data = WELL_DATA
  const [visible, setVisible] = useState<string[]>(['w1', 'w2', 'w3'])
  const [index, setIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 760
  const L = 52
  const R = 64
  const panelH = 112
  const gap = 30
  const top = 8
  const plotW = W - L - R
  const H = top + MEASURES.length * (panelH + gap) + 4
  const x = (i: number) => L + (i / (MONTHS - 1)) * plotW

  const shown = WELLS.filter((w) => visible.includes(w.id))

  const scales = MEASURES.map((m) => {
    const max = Math.max(...WELLS.flatMap((w) => data[w.id][m.key]))
    const niceMax = niceCeil(max)
    return { max: niceMax, ticks: [0, niceMax / 2, niceMax] }
  })
  const panelTop = (p: number) => top + p * (panelH + gap) + 18
  const plotH = panelH - 18
  const y = (p: number, v: number) =>
    panelTop(p) + plotH - (v / scales[p].max) * plotH

  const toggle = (id: string) =>
    setVisible((v) =>
      v.includes(id)
        ? v.length > 1
          ? v.filter((x) => x !== id)
          : v
        : [...v, id],
    )

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const box = svg.getBoundingClientRect()
    const vx = ((e.clientX - box.left) / box.width) * W
    const i = Math.round(((vx - L) / plotW) * (MONTHS - 1))
    setIndex(Math.max(0, Math.min(MONTHS - 1, i)))
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const d = e.key === 'ArrowRight' ? 1 : -1
      setIndex((i) => Math.max(0, Math.min(MONTHS - 1, (i ?? MONTHS - 1) + d)))
    }
    if (e.key === 'Escape') setIndex(null)
  }

  const years = Array.from({ length: 6 }, (_, k) => k * 12)

  return (
    <figure className="dv-example">
      <div className="dv-wells" role="group" aria-label="Wells">
        {WELLS.map((w) => {
          const on = visible.includes(w.id)
          const colour = on ? dv(w.hue, 4) : dv(w.hue, 2)
          return (
            <label key={w.id} className="dv-well">
              <input
                type="checkbox"
                className="dv-checkbox-input"
                checked={on}
                disabled={on && visible.length === 1}
                onChange={() => toggle(w.id)}
              />
              <span className="dv-checkbox" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="dv-well-text">
                <span className="dv-well-field">{w.field}</span>
                <span className="dv-well-name">{w.name}</span>
              </span>
              <svg
                className="dv-series-icon"
                viewBox="0 0 28 12"
                aria-hidden="true"
              >
                <line
                  x1="2"
                  x2="26"
                  y1="6"
                  y2="6"
                  stroke={colour}
                  strokeWidth="2"
                />
                <Marker shape={w.shape} x={14} y={6} fill={colour} />
              </svg>
            </label>
          )
        })}
      </div>
      <p className="dv-hint">
        Colour alone tells up to five wells apart. From six, the marker shapes
        and the labels at the end of each line tell them apart.
      </p>

      <div className="dv-plot-scroll">
        <div className="dv-plot">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label="Gas rate, water rate and cumulative gas for the selected wells from 2004 to 2009. Focus the chart and use the arrow keys to read the values month by month."
            tabIndex={0}
            onKeyDown={onKey}
            onBlur={() => setIndex(null)}
          >
            {MEASURES.map((m, p) => (
              <g key={m.key}>
                <text x={L} y={panelTop(p) - 8} className="dv-panel-title">
                  {m.label} <tspan className="dv-unit">({m.unit})</tspan>
                </text>
                {scales[p].ticks.map((t) => (
                  <g key={t}>
                    <line
                      x1={L}
                      x2={L + plotW}
                      y1={y(p, t)}
                      y2={y(p, t)}
                      className="dv-grid"
                    />
                    <text
                      x={L - 8}
                      y={y(p, t) + 4}
                      className="dv-tick"
                      textAnchor="end"
                    >
                      {fmt(t, m.digits && t !== 0 ? 2 : 0)}
                    </text>
                  </g>
                ))}
                {shown.map((w) => {
                  const pts = data[w.id][m.key]
                  const d = pts
                    .map(
                      (v, i) =>
                        `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p, v).toFixed(1)}`,
                    )
                    .join('')
                  return (
                    <path
                      key={w.id}
                      d={d}
                      fill="none"
                      stroke={dv(w.hue, 4)}
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  )
                })}
                {endLabels(
                  shown.map((w) => ({
                    w,
                    y: y(p, data[w.id][m.key][MONTHS - 1]),
                  })),
                ).map(({ w, y: ly }) => (
                  <g key={w.id}>
                    <Marker
                      shape={w.shape}
                      x={L + plotW + 10}
                      y={ly}
                      size={7}
                      fill={dv(w.hue, 4)}
                    />
                    <text
                      x={L + plotW + 18}
                      y={ly + 4}
                      className="dv-end-label"
                    >
                      {w.name}
                    </text>
                  </g>
                ))}
              </g>
            ))}

            {years.map((m) => (
              <text
                key={m}
                x={x(m)}
                y={H - 6}
                className="dv-tick"
                textAnchor={m === 0 ? 'start' : 'middle'}
              >
                {START_YEAR + m / 12}
              </text>
            ))}

            {index !== null && (
              <g pointerEvents="none">
                <line
                  x1={x(index)}
                  x2={x(index)}
                  y1={panelTop(0) - 4}
                  y2={panelTop(MEASURES.length - 1) + plotH}
                  className="dv-crosshair"
                />
                {MEASURES.map((m, p) =>
                  shown.map((w) => (
                    <Marker
                      key={`${m.key}-${w.id}`}
                      shape={w.shape}
                      x={x(index)}
                      y={y(p, data[w.id][m.key][index])}
                      fill={dv(w.hue, 4)}
                    />
                  )),
                )}
              </g>
            )}

            <rect
              x={L}
              y={panelTop(0) - 4}
              width={plotW}
              height={panelTop(MEASURES.length - 1) + plotH - panelTop(0) + 4}
              fill="transparent"
              onPointerMove={onMove}
              onPointerLeave={() => setIndex(null)}
            />
          </svg>

          {index !== null && (
            <div
              className="dv-tooltip"
              style={{
                left: `${(x(index) / W) * 100}%`,
                transform:
                  index > MONTHS / 2
                    ? 'translateX(calc(-100% - 12px))'
                    : 'translateX(12px)',
              }}
            >
              <div className="dv-tooltip-title">{monthLabel(index)}</div>
              <table>
                <thead>
                  <tr>
                    <th />
                    {MEASURES.map((m) => (
                      <th key={m.key} scope="col">
                        {m.label.replace(' rate', '')}
                        <span className="dv-tooltip-unit">{m.unit}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((w) => (
                    <tr key={w.id}>
                      <th scope="row">
                        <svg
                          className="dv-tooltip-icon"
                          viewBox="0 0 10 10"
                          aria-hidden="true"
                        >
                          <Marker
                            shape={w.shape}
                            x={5}
                            y={5}
                            size={7}
                            fill={dv(w.hue, 4)}
                          />
                        </svg>
                        {w.name}
                      </th>
                      {MEASURES.map((m) => (
                        <td key={m.key}>
                          {fmt(data[w.id][m.key][index], m.digits)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Disclaimer />
      <DataTable
        caption="Yearly average per well, random example data"
        head={[
          'Year',
          ...WELLS.flatMap((w) => [
            `${w.name} gas (kSm³/d)`,
            `${w.name} water (m³/d)`,
          ]),
        ]}
        rows={Array.from({ length: 6 }, (_, k) => [
          START_YEAR + k,
          ...WELLS.flatMap((w) => [
            fmt(avg(data[w.id].gas.slice(k * 12, k * 12 + 12))),
            fmt(avg(data[w.id].water.slice(k * 12, k * 12 + 12))),
          ]),
        ])}
      />
    </figure>
  )
}

function niceCeil(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v)))
  const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
  return (steps.find((n) => n * exp >= v) ?? 10) * exp
}

const avg = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length

/** Spread end labels so that they do not overlap. */
function endLabels<T extends { y: number }>(items: T[], minGap = 13): T[] {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < minGap)
      sorted[i] = { ...sorted[i], y: sorted[i - 1].y + minGap }
  }
  return sorted
}

/* ------------------------------------------------------------------ */
/*  Bar chart and donut: the same four fields                         */
/* ------------------------------------------------------------------ */

const FIELDS = [
  { id: 'johan-sverdrup', name: 'Johan Sverdrup', hue: 1 },
  { id: 'troll', name: 'Troll', hue: 2 },
  { id: 'oseberg', name: 'Oseberg', hue: 3 },
  { id: 'gullfaks', name: 'Gullfaks', hue: 4 },
]

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function makeFieldData() {
  const rnd = random(42)
  const base = [520, 360, 240, 150]
  return MONTH_NAMES.map((_, m) =>
    base.map((b, f) =>
      Math.round(
        b * (0.86 + 0.14 * Math.cos(((m - 1) / 12) * Math.PI * 2)) +
          (rnd() - 0.5) * b * 0.16 -
          (f === 0 && m === 6 ? 180 : 0), // a made-up dip in July for the first field
      ),
    ),
  )
}

const FIELD_DATA = makeFieldData()

const PLAN = 1150

export function BarChartExample() {
  const data = FIELD_DATA
  const [focus, setFocus] = useState<string | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  const W = 760
  const H = 300
  const L = 48
  const R = 72
  const T = 12
  const B = 28
  const plotW = W - L - R
  const plotH = H - T - B
  const max = 1400
  const y = (v: number) => T + plotH - (v / max) * plotH
  const band = plotW / data.length
  const bw = Math.min(36, band * 0.62)

  return (
    <figure className="dv-example">
      <div className="dv-toggles" role="group" aria-label="Highlight a field">
        {FIELDS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="dv-toggle"
            aria-pressed={focus === f.id}
            onClick={() => setFocus((c) => (c === f.id ? null : f.id))}
          >
            <span className="dv-swatch" style={{ background: dv(f.hue, 3) }} />
            {f.name}
          </button>
        ))}
      </div>

      <div className="dv-plot-scroll">
        <div className="dv-plot">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label="Random example data: monthly production for four fields, stacked, with a plan line at 1 150 kSm³/d."
          >
            {[0, 350, 700, 1050, 1400].map((t) => (
              <g key={t}>
                <line
                  x1={L}
                  x2={L + plotW}
                  y1={y(t)}
                  y2={y(t)}
                  className="dv-grid"
                />
                <text
                  x={L - 8}
                  y={y(t) + 4}
                  className="dv-tick"
                  textAnchor="end"
                >
                  {fmt(t)}
                </text>
              </g>
            ))}

            {data.map((month, m) => {
              const cx = L + band * m + band / 2
              let acc = 0
              return (
                <g
                  key={MONTH_NAMES[m]}
                  onPointerEnter={() => setHover(m)}
                  onPointerLeave={() => setHover(null)}
                >
                  <rect
                    x={L + band * m}
                    y={T}
                    width={band}
                    height={plotH}
                    fill="transparent"
                  />
                  {month.map((v, f) => {
                    const field = FIELDS[f]
                    const y0 = y(acc)
                    acc += v
                    const y1 = y(acc)
                    const isTop = f === month.length - 1
                    const faded = focus !== null && focus !== field.id
                    const fill = dv(field.hue, faded ? 2 : 3)
                    const r = isTop ? 4 : 0
                    const x0 = cx - bw / 2
                    const top = y1 + (isTop ? 0 : 2)
                    const d = r
                      ? `M${x0},${y0}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + bw - r}Q${x0 + bw},${top} ${x0 + bw},${top + r}V${y0}Z`
                      : `M${x0},${y0}V${top}H${x0 + bw}V${y0}Z`
                    return <path key={field.id} d={d} fill={fill} />
                  })}
                  <text
                    x={cx}
                    y={H - 8}
                    className="dv-tick"
                    textAnchor="middle"
                  >
                    {MONTH_NAMES[m]}
                  </text>
                </g>
              )
            })}

            <line
              x1={L}
              x2={L + plotW}
              y1={y(PLAN)}
              y2={y(PLAN)}
              className="dv-plan"
            />
            <text x={L + plotW + 8} y={y(PLAN) + 4} className="dv-end-label">
              Plan {fmt(PLAN)}
            </text>
          </svg>

          {hover !== null && (
            <div
              className="dv-tooltip"
              style={{
                left: `${((L + band * hover + band / 2) / W) * 100}%`,
                top: '8px',
                transform:
                  hover > 6
                    ? 'translateX(calc(-100% - 24px))'
                    : 'translateX(24px)',
              }}
            >
              <div className="dv-tooltip-title">
                {MONTH_NAMES[hover]}:{' '}
                {fmt(data[hover].reduce((s, v) => s + v, 0))} kSm³/d
              </div>
              <table>
                <tbody>
                  {[...FIELDS].reverse().map((f) => (
                    <tr key={f.id}>
                      <th scope="row">
                        <span
                          className="dv-swatch"
                          style={{ background: dv(f.hue, 3) }}
                        />
                        {f.name}
                      </th>
                      <td>{fmt(data[hover][FIELDS.indexOf(f)])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Disclaimer />
      <DataTable
        caption="Monthly production, random example data (kSm³/d)"
        head={['Month', ...FIELDS.map((f) => f.name), 'Total']}
        rows={data.map((month, m) => [
          MONTH_NAMES[m],
          ...month.map((v) => fmt(v)),
          fmt(month.reduce((s, v) => s + v, 0)),
        ])}
      />
    </figure>
  )
}

export function DonutChartExample() {
  const data = FIELD_DATA
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const focus = hovered ?? selected

  const totals = FIELDS.map((f, i) => ({
    ...f,
    value: Math.round(avg(data.map((m) => m[i]))),
  })).sort((a, b) => b.value - a.value)
  const total = totals.reduce((s, f) => s + f.value, 0)

  const size = 260
  const c = size / 2
  const R = 92
  const r = 58
  let angle = -Math.PI / 2
  const slices = totals.map((f) => {
    const a0 = angle
    const a1 = angle + (f.value / total) * Math.PI * 2
    angle = a1
    return { ...f, a0, a1 }
  })
  const pt = (a: number, rad: number) => [
    c + Math.cos(a) * rad,
    c + Math.sin(a) * rad,
  ]
  const arc = (a0: number, a1: number) => {
    const large = a1 - a0 > Math.PI ? 1 : 0
    const [x0, y0] = pt(a0, R)
    const [x1, y1] = pt(a1, R)
    const [x2, y2] = pt(a1, r)
    const [x3, y3] = pt(a0, r)
    return `M${x0},${y0}A${R},${R} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${r},${r} 0 ${large} 0 ${x3},${y3}Z`
  }
  const focused = slices.find((s) => s.id === focus)

  return (
    <figure className="dv-example dv-donut">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        role="img"
        aria-label={`Random example data: share of production by field: ${slices
          .map(
            (s) => `${s.name} ${Math.round((s.value / total) * 100)} percent`,
          )
          .join(', ')}.`}
      >
        {slices.map((s) => {
          const faded = focus !== null && focus !== s.id
          const mid = (s.a0 + s.a1) / 2
          const [lx, ly] = pt(mid, R + 16)
          return (
            <g
              key={s.id}
              onPointerEnter={() => setHovered(s.id)}
              onPointerLeave={() => setHovered(null)}
            >
              <path
                d={arc(s.a0, s.a1)}
                fill={dv(s.hue, faded ? 2 : 3)}
                stroke="var(--eds-background-surface)"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <text
                x={lx}
                y={ly + 4}
                className="dv-slice-label"
                textAnchor={
                  Math.cos(mid) > 0.2
                    ? 'start'
                    : Math.cos(mid) < -0.2
                      ? 'end'
                      : 'middle'
                }
              >
                {Math.round((s.value / total) * 100)}%
              </text>
            </g>
          )
        })}
        <text x={c} y={c - 2} textAnchor="middle" className="dv-donut-value">
          {fmt(focused ? focused.value : total)}
        </text>
        <text x={c} y={c + 16} textAnchor="middle" className="dv-donut-label">
          {focused ? focused.name.toUpperCase() : 'TOTAL KSM³/D'}
        </text>
      </svg>

      <ul className="dv-legend" aria-label="Fields">
        {slices.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="dv-toggle"
              aria-pressed={selected === s.id}
              onClick={() => setSelected((f) => (f === s.id ? null : s.id))}
            >
              <span
                className="dv-swatch"
                style={{ background: dv(s.hue, 3) }}
              />
              {s.name}: <b>{fmt(s.value)}</b>
            </button>
          </li>
        ))}
      </ul>

      <Disclaimer />
      <DataTable
        caption="Average production by field, random example data (kSm³/d)"
        head={['Field', 'kSm³/d', 'Share']}
        rows={slices.map((s) => [
          s.name,
          fmt(s.value),
          `${Math.round((s.value / total) * 100)}%`,
        ])}
      />
    </figure>
  )
}
