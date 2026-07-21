import {
  STEP_ROLES,
  calcContrast,
  roleIndex,
  type StepRole,
} from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

/* ------------------------------------------------------------------ */
/*  Surface layer roles for the layout preview                         */
/* ------------------------------------------------------------------ */

export const SURFACE_ROLES = STEP_ROLES.filter((r) => r.startsWith('bg-'))
export const BORDER_ROLES = STEP_ROLES.filter((r) => r.startsWith('border-'))

export type SurfaceConfig = {
  page: StepRole
  panel: StepRole
  cardRow: StepRole
  card: StepRole
  border: StepRole
  text: StepRole
}

export const DEFAULT_SURFACE: SurfaceConfig = {
  page: '1 · bg/canvas',
  panel: '2 · bg/surface',
  cardRow: '3 · bg/surface-hover',
  card: '1 · bg/canvas',
  border: '5 · bg/interactive',
  text: '12 · fg/strong',
}

/** Recommended roles per surface layer — options outside this set still work
 *  but are flagged as atypical in the dropdown. */
export const RECOMMENDED: Record<keyof SurfaceConfig, ReadonlySet<StepRole>> = {
  page: new Set<StepRole>([
    '1 · bg/canvas',
    '2 · bg/surface',
    '15 · bg/card, sheet, popover',
  ]),
  panel: new Set<StepRole>([
    '1 · bg/canvas',
    '2 · bg/surface',
    '15 · bg/card, sheet, popover',
  ]),
  cardRow: new Set<StepRole>([
    '1 · bg/canvas',
    '2 · bg/surface',
    '3 · bg/surface-hover',
    '4 · bg/surface-pressed',
  ]),
  card: new Set<StepRole>([
    '1 · bg/canvas',
    '2 · bg/surface',
    '15 · bg/card, sheet, popover',
  ]),
  border: new Set<StepRole>([
    '4 · bg/surface-pressed',
    '5 · bg/interactive',
    '7 · border/subtle',
    '8 · border/default',
  ]),
  text: new Set<StepRole>([
    '12 · fg/strong',
    '7 · border/subtle',
    '8 · border/default',
  ]),
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
  value: StepRole
  onChange: (v: StepRole) => void
  options: readonly StepRole[]
  recommended?: ReadonlySet<StepRole>
}) {
  return (
    <label className="flex items-center gap-2" style={{ fontSize: '12px' }}>
      <span style={{ color: '#6b7280', fontWeight: 500, minWidth: '56px' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as StepRole)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          borderRadius: '6px',
          border: '1.5px solid #d1d5db',
          background: '#fff',
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
      >
        {options.map((r) => {
          const isRecommended = recommended ? recommended.has(r) : true
          return (
            <option key={r} value={r}>
              {isRecommended ? `● ${r}` : `  ${r}`}
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
  const pageHex = steps[roleIndex(config.page)]
  const panelHex = steps[roleIndex(config.panel)]
  const cardRowHex = steps[roleIndex(config.cardRow)]
  const cardHex = steps[roleIndex(config.card)]
  const borderHex = steps[roleIndex(config.border)]
  const textHex = steps[roleIndex(config.text)]

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
        <SurfaceLabel label="Page" role={config.page} hex={pageHex} />

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
          <SurfaceLabel label="Panel" role={config.panel} hex={panelHex} />

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
              role={config.cardRow}
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
