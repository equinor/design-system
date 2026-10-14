'use client'

import { useMemo, useState } from 'react'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { resolveToken, toneRamps } from '@/utils/semanticTokens'
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
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { DataColorChart } from '@/components/themebuilder/contrast/DataColorChart'

const KINDS: SegmentedOption<DatavizKind>[] = [
  { value: 'categorical', label: 'Categorical' },
  { value: 'sequential', label: 'Sequential' },
  { value: 'diverging', label: 'Diverging' },
]

const CONTROL_LABEL = 'flex items-center gap-2 text-sm text-primary'

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

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

  // The chart sits on background.surface with text.primary labels, resolved
  // from the Tokens Studio palettes for the current scheme.
  const ramps = toneRamps(mode)
  const chartBg = resolveToken('background.surface', ramps, mode)
  const chartText = resolveToken('text.primary', ramps, mode)

  const hint = DATAVIZ_HINTS[kind]

  return (
    <div className="flex flex-col gap-5">
      {/* Palette family */}
      <SegmentedControl
        mode="radio"
        aria-label="Palette family"
        options={KINDS}
        value={kind}
        onChange={setKind}
        className="self-start"
      />

      {/* Family-specific controls */}
      <div className="flex flex-wrap items-center gap-5">
        {kind === 'categorical' && (
          <label className={CONTROL_LABEL}>
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
            <label className={CONTROL_LABEL}>
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
            <label className={CONTROL_LABEL}>
              <span className="font-medium">Hue</span>
              <select
                value={seqHue}
                onChange={(e) => setSeqHue(Number(e.target.value))}
                className={SELECT_CLASS}
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
          <label className={CONTROL_LABEL}>
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
      <p className="m-0 text-base text-secondary">{hint}</p>

      {/* Swatches */}
      <div className="flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            data-testid="dataviz-swatch"
            className="flex flex-col items-center gap-1"
          >
            <span
              className="size-11 rounded border border-muted"
              style={{ backgroundColor: c.hex }}
            />
            <span className="font-mono text-xs text-secondary">{c.hex}</span>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-secondary">Export:</span>
        <Button size="sm" onClick={() => copy('hex', toHexArray(colors))}>
          {copied === 'hex' ? 'Copied' : 'Copy hex array'}
        </Button>
        <Button size="sm" onClick={() => copy('css', toCssVars(colors, kind))}>
          {copied === 'css' ? 'Copied' : 'Copy CSS variables'}
        </Button>
        <Button
          size="sm"
          onClick={() =>
            downloadText(
              `dataviz-${kind}-tokens.json`,
              toW3CTokens(colors, kind),
              'application/json',
            )
          }
        >
          Download tokens
        </Button>
      </div>

      {/* Categorical accessibility audit */}
      {audit && (
        <Card title="Accessibility audit">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-secondary">
                Distinctness (ΔE {audit.minDeltaE.toFixed(3)})
                <Badge
                  pass={audit.passesDeltaE}
                  label={audit.passesDeltaE ? 'OK' : 'LOW'}
                />
              </span>
              {audit.cvd.map((s) => {
                const floor = categoricalCfg.minDeltaE * 0.6
                return (
                  <span
                    key={s.type}
                    className="flex items-center gap-1.5 text-secondary"
                  >
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
              <ul className="m-0 flex flex-col gap-1 pl-4 text-sm text-secondary">
                {audit.failures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            <p className="m-0 text-sm text-secondary">
              {DATAVIZ_HINTS.accessibility}
            </p>
          </div>
        </Card>
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
