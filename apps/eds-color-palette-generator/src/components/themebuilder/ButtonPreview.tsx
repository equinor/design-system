'use client'

import { Fragment } from 'react'
import type { SemanticColors } from '@/utils/semanticTokens'

type ButtonPreviewProps = {
  colors: SemanticColors
}

type StateStyle = { bg: string; text: string; border: string }

const STATES = ['default', 'hover', 'pressed'] as const

/**
 * Button variants × interaction states, in Tokens Studio semantic tokens:
 *
 *   Solid    background.interactive.accent.emphasis.{default,hover,pressed}
 *            text.on-emphasis.accent
 *   Outlined transparent → background.interactive.accent.muted.hover
 *                        → background.interactive.accent.muted.pressed
 *            border.interactive.accent.emphasis.default
 *            text.on-default.accent
 *   Ghost    the same fills as Outlined, no border
 *            text.on-default.accent
 */
function buildVariants(c: SemanticColors): Array<{
  name: string
  states: Record<(typeof STATES)[number], StateStyle>
}> {
  const onEmphasis = c['text.on-emphasis.accent']
  const label = c['text.on-default.accent']
  const outline = c['border.interactive.accent.emphasis.default']
  const mutedHover = c['background.interactive.accent.muted.hover']
  const mutedPressed = c['background.interactive.accent.muted.pressed']

  return [
    {
      name: 'Solid',
      states: {
        default: {
          bg: c['background.interactive.accent.emphasis.default'],
          text: onEmphasis,
          border: 'transparent',
        },
        hover: {
          bg: c['background.interactive.accent.emphasis.hover'],
          text: onEmphasis,
          border: 'transparent',
        },
        pressed: {
          bg: c['background.interactive.accent.emphasis.pressed'],
          text: onEmphasis,
          border: 'transparent',
        },
      },
    },
    {
      name: 'Outlined',
      states: {
        default: { bg: 'transparent', text: label, border: outline },
        hover: { bg: mutedHover, text: label, border: outline },
        pressed: { bg: mutedPressed, text: label, border: outline },
      },
    },
    {
      name: 'Ghost',
      states: {
        default: { bg: 'transparent', text: label, border: 'transparent' },
        hover: { bg: mutedHover, text: label, border: 'transparent' },
        pressed: {
          bg: mutedPressed,
          text: label,
          border: 'transparent',
        },
      },
    },
  ]
}

export function ButtonPreview({ colors }: ButtonPreviewProps) {
  const variants = buildVariants(colors)
  const labelColor = colors['text.primary']

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(72px, auto) repeat(3, 1fr)',
        gap: '14px',
        alignItems: 'center',
        maxWidth: '560px',
      }}
    >
      {/* Header row: interaction states */}
      <div />
      {STATES.map((state) => (
        <div
          key={state}
          style={{
            fontSize: '11px',
            textAlign: 'center',
            textTransform: 'capitalize',
            color: labelColor,
            opacity: 0.7,
          }}
        >
          {state}
        </div>
      ))}

      {/* One row per variant */}
      {variants.map((variant) => (
        <Fragment key={variant.name}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: labelColor }}>
            {variant.name}
          </div>
          {STATES.map((state) => {
            const s = variant.states[state]
            return (
              <div key={state} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    backgroundColor: s.bg,
                    color: s.text,
                    border: `1px solid ${s.border}`,
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Label
                </span>
              </div>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}
