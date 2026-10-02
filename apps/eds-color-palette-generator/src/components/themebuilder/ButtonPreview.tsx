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
    <div className="grid max-w-[560px] grid-cols-[minmax(72px,auto)_repeat(3,1fr)] items-center gap-3.5">
      {/* Header row: interaction states */}
      <div />
      {STATES.map((state) => (
        <div
          key={state}
          className="text-center text-xs capitalize opacity-70"
          style={{ color: labelColor }}
        >
          {state}
        </div>
      ))}

      {/* One row per variant */}
      {variants.map((variant) => (
        <Fragment key={variant.name}>
          <div className="text-sm font-medium" style={{ color: labelColor }}>
            {variant.name}
          </div>
          {STATES.map((state) => {
            const s = variant.states[state]
            return (
              <div key={state} className="text-center">
                <span
                  className="inline-block whitespace-nowrap rounded border px-5 py-2.5 text-base font-medium"
                  style={{
                    backgroundColor: s.bg,
                    color: s.text,
                    borderColor: s.border,
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
