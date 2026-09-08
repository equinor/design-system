import React from 'react'

/**
 * The 15-step scale, painted, for every tone.
 *
 * The page can say "a step number is a role position, not a lightness" as often as it likes; the
 * grid is what makes it obvious. Reading down a column shows the jump between the border steps and
 * the fill steps, and reading across a row shows that the same step is the same role in every tone.
 */

const TONES = ['accent', 'neutral', 'info', 'success', 'warning', 'danger'] as const

/** Kept in step with the role table on this page. */
const ROLES: Record<number, string> = {
  1: 'canvas, input fills, resting muted fill',
  2: 'muted fill on hover; disabled fill',
  3: 'muted fill when pressed',
  4: 'muted borders, disabled border',
  5: 'accent selected; muted border on hover',
  6: 'not used',
  7: 'muted border when pressed; tertiary foreground',
  8: 'links; secondary foreground',
  9: 'the solid fill; emphasis borders',
  10: 'solid fill on hover; on-default foregrounds',
  11: 'solid fill when pressed; interactive foregrounds',
  12: 'on-muted foregrounds; the inverted surface',
  13: 'primary foreground; the selected indicator',
  14: 'not used',
  15: 'the content plane; on-emphasis foregrounds',
}

const STEPS = Array.from({ length: 15 }, (_, i) => i + 1)

const label: React.CSSProperties = {
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.6875rem',
  color: 'var(--ifm-color-emphasis-700)',
  whiteSpace: 'nowrap',
}

export function ColourScale() {
  return (
    <div style={{ margin: '1.5rem 0', overflowX: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `2rem repeat(${TONES.length}, minmax(3rem, 1fr)) minmax(14rem, 1.6fr)`,
          gap: '0.25rem',
          alignItems: 'center',
          minWidth: '42rem',
        }}
      >
        <span style={label} />
        {TONES.map((t) => (
          <span key={t} style={{ ...label, textAlign: 'center' }}>
            {t}
          </span>
        ))}
        <span style={label}>role</span>

        {STEPS.map((step) => (
          <React.Fragment key={step}>
            <span style={{ ...label, textAlign: 'right' }}>{step}</span>
            {TONES.map((tone) => (
              <span
                key={tone}
                title={`${tone}.${step}`}
                style={{
                  background: `var(--eds-${tone}-${step})`,
                  height: '2rem',
                  borderRadius: '3px',
                  border: '1px solid var(--ifm-color-emphasis-200)',
                }}
              />
            ))}
            <span
              style={{
                ...label,
                whiteSpace: 'normal',
                fontStyle: ROLES[step] === 'not used' ? 'italic' : undefined,
                opacity: ROLES[step] === 'not used' ? 0.6 : 1,
              }}
            >
              {ROLES[step]}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default ColourScale
