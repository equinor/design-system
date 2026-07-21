'use client'

import { Fragment } from 'react'
import type { SemanticColors } from '@/config/semanticColors'

type ButtonPreviewProps = {
  colors: SemanticColors
}

type StateStyle = { bg: string; text: string; border: string }

const STATES = ['default', 'hover', 'pressed'] as const

/**
 * Button variants × interaction states, following the Figma dark button spec.
 * Ghost/outlined use the accent colour for text (and outlined border), with
 * subtle accent-tinted fills on hover/pressed:
 *
 *   Solid    bg = bg-accent-fill-emphasis-{default,hover,active}   text = text-accent-strong-on-emphasis
 *   Outlined transparent → bg-accent-surface → bg-accent-fill-muted-default
 *            border = accent   text = accent
 *   Ghost    transparent → bg-accent-surface → bg-accent-fill-muted-default
 *            text = accent
 *
 * Figma binds ghost/outlined label to `text/accent` and the outlined border to
 * `background/surface/accent/default/default` — both resolve to the accent
 * emphasis colour, so we use `bg-accent-fill-emphasis-default` as `accent`.
 * The hover/pressed fills are Figma's `.../selected/hover` and `.../selected/pressed`.
 */
function buildVariants(c: SemanticColors): Array<{
  name: string
  states: Record<(typeof STATES)[number], StateStyle>
}> {
  const onEmphasis = c['text-accent-strong-on-emphasis']
  const accent = c['bg-accent-fill-emphasis-default']
  const subtleHover = c['bg-accent-surface']
  const subtlePressed = c['bg-accent-fill-muted-default']

  return [
    {
      name: 'Solid',
      states: {
        default: {
          bg: c['bg-accent-fill-emphasis-default'],
          text: onEmphasis,
          border: 'transparent',
        },
        hover: {
          bg: c['bg-accent-fill-emphasis-hover'],
          text: onEmphasis,
          border: 'transparent',
        },
        pressed: {
          bg: c['bg-accent-fill-emphasis-active'],
          text: onEmphasis,
          border: 'transparent',
        },
      },
    },
    {
      name: 'Outlined',
      states: {
        default: { bg: 'transparent', text: accent, border: accent },
        hover: { bg: subtleHover, text: accent, border: accent },
        pressed: { bg: subtlePressed, text: accent, border: accent },
      },
    },
    {
      name: 'Ghost',
      states: {
        default: { bg: 'transparent', text: accent, border: 'transparent' },
        hover: { bg: subtleHover, text: accent, border: 'transparent' },
        pressed: {
          bg: subtlePressed,
          text: accent,
          border: 'transparent',
        },
      },
    },
  ]
}

export function ButtonPreview({ colors }: ButtonPreviewProps) {
  const variants = buildVariants(colors)
  const labelColor = colors['text-neutral-strong']

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
