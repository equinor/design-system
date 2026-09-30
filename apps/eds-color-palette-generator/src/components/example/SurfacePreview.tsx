import { stepLabel, stepRolesText, stepsWithRole } from '@/config/config'
import { calcContrast } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

/* ------------------------------------------------------------------ */
/*  Surface layer steps for the layout preview                         */
/* ------------------------------------------------------------------ */

/** 1-based steps that some Tokens Studio role of each group uses. */
export const SURFACE_STEPS = stepsWithRole('background').map((s) => s.step)
export const BORDER_STEPS = stepsWithRole('border').map((s) => s.step)
export const TEXT_STEPS = stepsWithRole('text').map((s) => s.step)

/** 1-based step per surface layer. */
export type SurfaceConfig = {
  page: number
  panel: number
  cardRow: number
  card: number
  border: number
  text: number
}

/**
 * background.canvas (1) → background.surface (15)
 * → background.non-interactive.<tone>.default (3) → background.surface (15),
 * with border.non-interactive.<tone>.muted (4) and text.primary (13).
 */
export const DEFAULT_SURFACE: SurfaceConfig = {
  page: 1,
  panel: 15,
  cardRow: 3,
  card: 15,
  border: 4,
  text: 13,
}

/** Recommended steps per surface layer, by Tokens Studio role — options
 *  outside this set still work but are flagged as atypical in the dropdown. */
export const RECOMMENDED: Record<keyof SurfaceConfig, ReadonlySet<number>> = {
  // background.canvas, background.surface
  page: new Set([1, 15]),
  panel: new Set([1, 15]),
  // background.non-interactive.<tone>.muted (1) and .default (3), and the
  // muted hover fill (2)
  cardRow: new Set([1, 2, 3]),
  card: new Set([1, 15]),
  // border.non-interactive.<tone>.muted / .default / .emphasis
  border: new Set([4, 7, 9]),
  // text.primary, text.secondary, text.tertiary
  text: new Set([13, 8, 7]),
}

function SurfaceLabel({
  label,
  role,
  hex,
}: {
  label: string
  role: string
  hex: string
}) {
  return (
    <div className="pointer-events-none absolute top-2 left-2.5 flex items-center gap-2 text-xs text-secondary">
      <span
        className="inline-block size-2 shrink-0 rounded-xs border border-muted"
        style={{ backgroundColor: hex }}
      />
      <span>
        <strong className="font-medium text-primary">{label}</strong>{' '}
        <span className="font-mono">{role}</span>
      </span>
    </div>
  )
}

export function SurfaceSelect({
  label,
  value,
  onChange,
  options,
  recommended,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  options: readonly number[]
  recommended?: ReadonlySet<number>
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="min-w-14 font-medium text-secondary">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-input bg-input px-2 py-1 font-mono text-sm text-primary hover:border-input-hover"
      >
        {options.map((step) => {
          const isRecommended = recommended ? recommended.has(step) : true
          const label = stepLabel(step)
          return (
            <option key={step} value={step} title={stepRolesText(step)}>
              {isRecommended ? `● ${label}` : `  ${label}`}
            </option>
          )
        })}
      </select>
    </label>
  )
}

export function SurfacePreview({
  config,
  steps,
}: {
  config: SurfaceConfig
  steps: string[]
}) {
  const pageHex = steps[config.page - 1]
  const panelHex = steps[config.panel - 1]
  const cardRowHex = steps[config.cardRow - 1]
  const cardHex = steps[config.card - 1]
  const borderHex = steps[config.border - 1]
  const textHex = steps[config.text - 1]

  const contrastPagePanel = calcContrast(panelHex, pageHex)
  const contrastPanelCardRow = calcContrast(cardRowHex, panelHex)
  const contrastCardRowCard = calcContrast(cardHex, cardRowHex)
  const contrastBorderCard = calcContrast(borderHex, cardHex)
  const contrastTextCard = calcContrast(textHex, cardHex)

  return (
    <div>
      {/* Live layout wireframe */}
      <div
        className="relative rounded border border-muted px-6 py-8"
        style={{ backgroundColor: pageHex }}
      >
        <SurfaceLabel
          label="Page"
          role={stepLabel(config.page)}
          hex={pageHex}
        />

        {/* Panel */}
        <div
          className="relative mt-3 rounded px-5 pt-7 pb-5"
          style={{ backgroundColor: panelHex }}
        >
          <SurfaceLabel
            label="Panel"
            role={stepLabel(config.panel)}
            hex={panelHex}
          />

          {/* Card row */}
          <div
            className="relative mt-2 rounded px-4 pt-6 pb-4"
            style={{ backgroundColor: cardRowHex }}
          >
            <SurfaceLabel
              label="Card row"
              role={stepLabel(config.cardRow)}
              hex={cardRowHex}
            />

            {/* Cards */}
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex min-h-20 flex-col gap-1.5 rounded px-3.5 py-4"
                  style={{
                    backgroundColor: cardHex,
                    border: `1px solid ${borderHex}`,
                  }}
                >
                  <div
                    className="text-base font-medium"
                    style={{ color: textHex }}
                  >
                    Card title
                  </div>
                  <div
                    className="text-sm opacity-70"
                    style={{ color: textHex }}
                  >
                    Body text content
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contrast ratios between adjacent layers */}
      <div
        className="mt-4 grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {[
          {
            label: 'Page / Panel',
            result: contrastPagePanel,
            a: pageHex,
            b: panelHex,
          },
          {
            label: 'Panel / Card row',
            result: contrastPanelCardRow,
            a: panelHex,
            b: cardRowHex,
          },
          {
            label: 'Card row / Card',
            result: contrastCardRowCard,
            a: cardRowHex,
            b: cardHex,
          },
          {
            label: 'Border / Card',
            result: contrastBorderCard,
            a: borderHex,
            b: cardHex,
          },
          {
            label: 'Text / Card',
            result: contrastTextCard,
            a: textHex,
            b: cardHex,
          },
        ].map(({ label, result, a, b }) => (
          <div
            key={label}
            className="rounded border border-muted bg-surface px-3 py-2.5"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-block size-2.5 rounded-xs border border-muted"
                style={{ backgroundColor: a }}
              />
              <span
                className="inline-block size-2.5 rounded-xs border border-muted"
                style={{ backgroundColor: b }}
              />
              <span className="text-sm font-medium text-primary">{label}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-mono text-sm font-medium text-primary">
                {result.wcag}:1
              </span>
              <Badge pass={result.aa} label="AA" />
              <Badge pass={result.aaa} label="AAA" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
