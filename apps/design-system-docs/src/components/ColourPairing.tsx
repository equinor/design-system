import React, { Fragment } from 'react'

/**
 * Renders the foreground pairing rules as specimens rather than as a table of names.
 *
 * Each specimen is painted with the fill token and carries, inside it, the text, icon and border
 * tokens that fill is specified for. The point is that the pairing can be seen rather than trusted:
 * if a combination were wrong, it would be visibly wrong here.
 *
 * Token names are the canonical dotted form. The CSS custom property is derived by replacing dots
 * with hyphens, which holds for every colour token in the set.
 */

const TONES = [
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const

type Tone = (typeof TONES)[number]

/** `background.interactive.accent.emphasis.default` -> `var(--eds-background-...)` */
function cssVar(token: string): string {
  return `var(--eds-${token.replaceAll('.', '-')})`
}

type Pairing = {
  /** Heading for the group */
  title: string
  /** One sentence on when this fill applies */
  note: string
  /** Dotted fill token. `{tone}` is expanded across all six tones. */
  fill: string
  text: string
  icon: string
  /** Some fills have no paired border */
  border?: string
}

const PAIRINGS: Pairing[] = [
  {
    title: 'Surfaces',
    note: 'The planes your content sits on.',
    fill: 'background.surface',
    text: 'text.primary',
    icon: 'icon.secondary',
    border: 'border.non-interactive.neutral.default',
  },
  {
    title: 'Canvas',
    note: 'The page behind everything.',
    fill: 'background.canvas',
    text: 'text.primary',
    icon: 'icon.secondary',
    border: 'border.non-interactive.neutral.muted',
  },
  {
    title: 'Interactive, emphasis',
    note: 'Solid fills you can act on, such as a primary button.',
    fill: 'background.interactive.{tone}.emphasis.default',
    text: 'text.on-emphasis.{tone}',
    icon: 'icon.on-emphasis.{tone}',
    border: 'border.interactive.{tone}.emphasis.default',
  },
  {
    title: 'Interactive, muted',
    note: 'Tinted fills you can act on, such as a secondary button.',
    fill: 'background.interactive.{tone}.muted.default',
    text: 'text.on-muted.{tone}',
    icon: 'icon.on-muted.{tone}',
    border: 'border.interactive.{tone}.muted.default',
  },
  {
    title: 'Non-interactive, emphasis',
    note: 'Solid fills that do not respond to input, such as a status pip.',
    fill: 'background.non-interactive.{tone}.emphasis',
    text: 'text.on-emphasis.{tone}',
    icon: 'icon.on-emphasis.{tone}',
    border: 'border.non-interactive.{tone}.emphasis',
  },
  {
    title: 'Non-interactive, default',
    note: 'The middle strength for a non-interactive tinted element.',
    fill: 'background.non-interactive.{tone}.default',
    text: 'text.on-default.{tone}',
    icon: 'icon.on-default.{tone}',
    border: 'border.non-interactive.{tone}.default',
  },
  {
    title: 'Non-interactive, muted',
    note: 'The faintest tint that still reads as tinted, such as a banner.',
    fill: 'background.non-interactive.{tone}.muted',
    text: 'text.on-muted.{tone}',
    icon: 'icon.on-muted.{tone}',
    border: 'border.non-interactive.{tone}.muted',
  },
  {
    title: 'Selected',
    note: 'Available on accent and neutral only.',
    fill: 'background.interactive.accent.selected.default',
    text: 'text.primary',
    icon: 'icon.primary',
    border: 'border.interactive.selected-indicator',
  },
  {
    title: 'Inverted',
    note: 'Surfaces that stand apart from their surroundings, such as a snackbar.',
    fill: 'background.inverted',
    text: 'text.inverted',
    icon: 'icon.inverted',
  },
  {
    title: 'Input',
    note: 'Form field fills.',
    fill: 'background.input',
    text: 'text.primary',
    icon: 'icon.secondary',
    border: 'border.interactive.neutral.muted.default',
  },
  {
    title: 'Disabled',
    note: 'A disabled control has no tone.',
    fill: 'background.interactive.disabled',
    text: 'text.interactive.disabled',
    icon: 'icon.interactive.disabled',
    border: 'border.interactive.disabled',
  },
]

/** A single painted specimen: the fill, with its paired foregrounds inside it. */
function Specimen({
  fill,
  text,
  icon,
  border,
  label,
}: {
  fill: string
  text: string
  icon: string
  border?: string
  label: string
}) {
  return (
    <div
      style={{
        background: cssVar(fill),
        border: `2px solid ${border ? cssVar(border) : 'transparent'}`,
        borderRadius: '6px',
        padding: '1.125rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Stands in for an icon, painted with the paired icon token */}
        <span
          aria-hidden="true"
          style={{
            width: '0.875rem',
            height: '0.875rem',
            borderRadius: '2px',
            background: cssVar(icon),
            flex: 'none',
          }}
        />
        <span
          style={{
            color: cssVar(text),
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'capitalize',
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          color: cssVar(text),
          fontSize: '0.75rem',
          lineHeight: 1.5,
          opacity: 0.9,
        }}
      >
        Sample text on this fill
      </span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          fontSize: '0.6875rem',
          lineHeight: 1.45,
          fontFamily: 'var(--ifm-font-family-monospace)',
          color: cssVar(text),
          opacity: 0.75,
          wordBreak: 'break-all',
        }}
      >
        <span>{fill}</span>
        <span>{text}</span>
        <span>{icon}</span>
        {border ? <span>{border}</span> : null}
      </div>
    </div>
  )
}

function Group({ pairing }: { pairing: Pairing }) {
  const isPerTone = pairing.fill.includes('{tone}')
  const tones: readonly string[] = isPerTone ? TONES : ['']

  const expand = (token: string, tone: string) => token.replaceAll('{tone}', tone)

  return (
    <section style={{ margin: '2rem 0' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>{pairing.title}</h3>
      <p
        style={{
          marginTop: 0,
          marginBottom: '0.75rem',
          color: 'var(--ifm-color-emphasis-700)',
          fontSize: '0.875rem',
        }}
      >
        {pairing.note}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1rem',
        }}
      >
        {tones.map((tone) => (
          <Specimen
            key={tone || pairing.fill}
            label={tone || pairing.title}
            fill={expand(pairing.fill, tone)}
            text={expand(pairing.text, tone)}
            icon={expand(pairing.icon, tone)}
            border={pairing.border ? expand(pairing.border, tone) : undefined}
          />
        ))}
      </div>
    </section>
  )
}

export function ColourPairing() {
  return (
    <div>
      {PAIRINGS.map((pairing) => (
        <Group key={pairing.title} pairing={pairing} />
      ))}
    </div>
  )
}

export default ColourPairing
