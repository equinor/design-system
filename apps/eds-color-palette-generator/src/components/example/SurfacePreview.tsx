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
    <div
      className="flex items-center gap-2"
      style={{
        position: 'absolute',
        top: '8px',
        left: '10px',
        fontSize: '10px',
        lineHeight: '14px',
        color: '#6b7280',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '2px',
          backgroundColor: hex,
          border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      />
      <span>
        <strong style={{ color: '#374151' }}>{label}</strong>{' '}
        <span style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}>
          {role}
        </span>
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
    <label className="flex items-center gap-2" style={{ fontSize: '12px' }}>
      <span style={{ color: '#6b7280', fontWeight: 500, minWidth: '56px' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          borderRadius: '6px',
          border: '1.5px solid #d1d5db',
          background: '#fff',
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
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
        style={{
          backgroundColor: pageHex,
          borderRadius: '16px',
          padding: '32px 24px',
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <SurfaceLabel
          label="Page"
          role={stepLabel(config.page)}
          hex={pageHex}
        />

        {/* Panel */}
        <div
          style={{
            backgroundColor: panelHex,
            borderRadius: '12px',
            padding: '28px 20px 20px',
            position: 'relative',
            marginTop: '12px',
          }}
        >
          <SurfaceLabel
            label="Panel"
            role={stepLabel(config.panel)}
            hex={panelHex}
          />

          {/* Card row */}
          <div
            style={{
              backgroundColor: cardRowHex,
              borderRadius: '10px',
              padding: '24px 16px 16px',
              position: 'relative',
              marginTop: '8px',
            }}
          >
            <SurfaceLabel
              label="Card row"
              role={stepLabel(config.cardRow)}
              hex={cardRowHex}
            />

            {/* Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '8px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: cardHex,
                    border: `1px solid ${borderHex}`,
                    borderRadius: '8px',
                    padding: '16px 14px',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      color: textHex,
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    Card title
                  </div>
                  <div
                    style={{
                      color: textHex,
                      fontSize: '11px',
                      opacity: 0.7,
                    }}
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
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '8px',
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
            className="rounded-lg"
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              padding: '10px 12px',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: '6px' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: a,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: b,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {label}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '12px',
                  color: '#111',
                }}
              >
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
