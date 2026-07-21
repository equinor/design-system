'use client'

import { useMemo, useState } from 'react'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { getSemanticColors } from '@/config/semanticColors'
import {
  generateCategoricalPalette,
  generateSequentialScale,
  generateDivergingScale,
} from '@/utils/dataviz'
import { auditCategorical } from '@/utils/dataviz-a11y'
import {
  DEFAULT_CATEGORICAL,
  DEFAULT_SEQUENTIAL,
  DEFAULT_DIVERGING,
  DATAVIZ_HINTS,
  EDS_CATEGORICAL_SEEDS,
} from '@/config/dataviz-defaults'
import type { DatavizKind } from '@/config/dataviz-types'
import {
  toHexArray,
  toCssVars,
  toW3CTokens,
  downloadText,
} from '@/utils/dataviz-export'
import { Badge } from '@/components/shared/Badge'
import { DataColorChart } from '@/components/themebuilder/contrast/DataColorChart'

const KINDS: { key: DatavizKind; label: string }[] = [
  { key: 'categorical', label: 'Categorical' },
  { key: 'sequential', label: 'Sequential' },
  { key: 'diverging', label: 'Diverging' },
]

export function DataVizPanel() {
  const { colorScheme } = useColorScheme()
  const mode = colorScheme

  const [kind, setKind] = useState<DatavizKind>('categorical')

  // Categorical controls
  const [count, setCount] = useState(DEFAULT_CATEGORICAL.count)

  // Sequential / diverging controls
  const [seqSteps, setSeqSteps] = useState(DEFAULT_SEQUENTIAL.steps)
  const [seqHue, setSeqHue] = useState(DEFAULT_SEQUENTIAL.hue as number)
  const [divSteps, setDivSteps] = useState(DEFAULT_DIVERGING.steps)

  const [copied, setCopied] = useState<string | null>(null)
  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
      },
      () => {},
    )
  }

  // CVD-aware spacing is always on — accessible output is the point of the tool.
  const categoricalCfg = { ...DEFAULT_CATEGORICAL, count, enforceCVD: true }
  const sequentialCfg = { ...DEFAULT_SEQUENTIAL, steps: seqSteps, hue: seqHue }
  const divergingCfg = { ...DEFAULT_DIVERGING, steps: divSteps }

  const colors = useMemo(() => {
    if (kind === 'categorical')
      return generateCategoricalPalette(categoricalCfg, mode)
    if (kind === 'sequential')
      return generateSequentialScale(sequentialCfg, mode)
    return generateDivergingScale(divergingCfg, mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- configs are derived from the primitive state below
  }, [kind, count, seqSteps, seqHue, divSteps, mode])

  const audit = useMemo(
    () =>
      kind === 'categorical' ? auditCategorical(colors, categoricalCfg) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- categoricalCfg is derived from count
    [kind, colors, count],
  )

  const semantic = getSemanticColors(mode)
  const chartBg = semantic['bg-neutral-surface']
  const chartText = semantic['text-neutral-strong']

  const hint = DATAVIZ_HINTS[kind]

  return (
    <div className="flex flex-col gap-5">
      {/* Family sub-tabs */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg overflow-hidden border border-neutral-subtle">
          {KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              className={[
                'cursor-pointer px-4 py-1.5 text-sm border-none',
                kind === k.key
                  ? 'bg-neutral-fill-emphasis-default text-strong-on-emphasis font-semibold'
                  : 'bg-default text-subtle font-normal',
              ].join(' ')}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Family-specific controls */}
      <div className="flex flex-wrap items-center gap-5">
        {kind === 'categorical' && (
          <label className="flex items-center gap-2 text-xs text-strong">
            <span className="font-medium whitespace-nowrap">
              Colours: {count}
            </span>
            <input
              type="range"
              min={3}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>
        )}

        {kind === 'sequential' && (
          <>
            <label className="flex items-center gap-2 text-xs text-strong">
              <span className="font-medium whitespace-nowrap">
                Steps: {seqSteps}
              </span>
              <input
                type="range"
                min={3}
                max={11}
                value={seqSteps}
                onChange={(e) => setSeqSteps(Number(e.target.value))}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-strong">
              <span className="font-medium">Hue</span>
              <select
                value={seqHue}
                onChange={(e) => setSeqHue(Number(e.target.value))}
                className="rounded border border-neutral-subtle bg-default text-xs px-2 py-1"
              >
                {EDS_CATEGORICAL_SEEDS.map((s) => (
                  <option key={s.name} value={s.hue}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {kind === 'diverging' && (
          <label className="flex items-center gap-2 text-xs text-strong">
            <span className="font-medium whitespace-nowrap">
              Steps: {divSteps}
            </span>
            <input
              type="range"
              min={3}
              max={11}
              step={2}
              value={divSteps}
              onChange={(e) => setDivSteps(Number(e.target.value))}
            />
          </label>
        )}
      </div>

      {/* Hint */}
      <p className="text-sm text-subtle m-0">{hint}</p>

      {/* Swatches */}
      <div className="flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            data-testid="dataviz-swatch"
            className="flex flex-col items-center gap-1"
          >
            <span
              className="rounded-md border border-neutral-subtle"
              style={{ width: 44, height: 44, backgroundColor: c.hex }}
            />
            <span className="font-mono text-[10px] text-subtle">{c.hex}</span>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-subtle mr-1">Export:</span>
        <button
          type="button"
          onClick={() => copy('hex', toHexArray(colors))}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-subtle bg-default text-subtle hover:text-strong transition-colors"
        >
          {copied === 'hex' ? 'Copied' : 'Copy hex array'}
        </button>
        <button
          type="button"
          onClick={() => copy('css', toCssVars(colors, kind))}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-subtle bg-default text-subtle hover:text-strong transition-colors"
        >
          {copied === 'css' ? 'Copied' : 'Copy CSS variables'}
        </button>
        <button
          type="button"
          onClick={() =>
            downloadText(
              `dataviz-${kind}-tokens.json`,
              toW3CTokens(colors, kind),
              'application/json',
            )
          }
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-subtle bg-default text-subtle hover:text-strong transition-colors"
        >
          Download tokens
        </button>
      </div>

      {/* Categorical accessibility audit */}
      {audit && (
        <section className="rounded-xl border border-neutral-subtle bg-default p-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-strong m-0">
            Accessibility audit
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-subtle">
              Distinctness (ΔE {audit.minDeltaE.toFixed(3)})
              <Badge pass={audit.passesDeltaE} label={audit.passesDeltaE ? 'OK' : 'LOW'} />
            </span>
            {audit.cvd.map((s) => {
              const floor = categoricalCfg.minDeltaE * 0.6
              return (
                <span key={s.type} className="flex items-center gap-1.5 text-subtle">
                  {s.type} (ΔE {s.minDeltaE.toFixed(3)})
                  <Badge
                    pass={s.minDeltaE >= floor}
                    label={s.minDeltaE >= floor ? 'OK' : 'LOW'}
                  />
                </span>
              )
            })}
          </div>
          {audit.failures.length > 0 && (
            <ul className="m-0 pl-4 text-[11px] text-subtle flex flex-col gap-1">
              {audit.failures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          <p className="text-[11px] text-subtle m-0">
            {DATAVIZ_HINTS.accessibility}
          </p>
        </section>
      )}

      {/* Chart preview (reuses the theme-builder chart + CVD sim) */}
      <DataColorChart
        colors={colors}
        bgHex={chartBg}
        textHex={chartText}
        pairwiseCheck={kind === 'categorical'}
      />
    </div>
  )
}
