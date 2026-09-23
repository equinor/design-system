import React from 'react'

/**
 * Renders the foreground pairing rules as specimens rather than as a table of names.
 *
 * Each specimen is painted with a fill and its corresponding text and icon tokens. Border tokens
 * are examples where a border is used, not a requirement for every fill.
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
  /** An example border, where the specimen has one */
  border?: string
  /** One representative tone; the full gallery includes every tone. */
  featuredTone?: (typeof TONES)[number] | ''
}

const PAIRINGS: Pairing[] = [
  {
    title: 'Surfaces',
    note: 'The planes your content sits on.',
    fill: 'background.surface',
    text: 'text.primary',
    icon: 'icon.secondary',
    border: 'border.non-interactive.neutral.default',
    featuredTone: '',
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
    featuredTone: 'accent',
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
    featuredTone: 'success',
  },
  {
    title: 'Non-interactive, default',
    note: 'The middle strength for a non-interactive tinted element.',
    fill: 'background.non-interactive.{tone}.default',
    text: 'text.on-default.{tone}',
    icon: 'icon.on-default.{tone}',
    featuredTone: 'info',
  },
  {
    title: 'Non-interactive, muted',
    note: 'A faint tint with a tone-specific foreground; component designs may specify another.',
    fill: 'background.non-interactive.{tone}.muted',
    text: 'text.on-muted.{tone}',
    icon: 'icon.on-muted.{tone}',
    border: 'border.non-interactive.{tone}.muted',
    featuredTone: 'warning',
  },
  {
    title: 'Selected, neutral',
    note: 'Short labels on a selected neutral row; check typography in every state.',
    fill: 'background.interactive.neutral.selected.default',
    text: 'text.primary',
    icon: 'icon.primary',
    featuredTone: '',
  },
  {
    title: 'Selected, accent (default only)',
    note: 'The default state only. Check APCA before using hover or pressed.',
    fill: 'background.interactive.accent.selected.default',
    text: 'text.primary',
    icon: 'icon.primary',
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

const FEATURED_PAIRINGS = PAIRINGS.flatMap((pairing) =>
  pairing.featuredTone === undefined
    ? []
    : [{ pairing, tone: pairing.featuredTone }],
)

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
        border: border ? `2px solid ${cssVar(border)}` : undefined,
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
            borderRadius: '2px 6px',
            background: cssVar(icon),
            flex: 'none',
          }}
        />
        <span
          style={{
            color: cssVar(text),
            fontWeight: 400,
            fontSize: '1rem',
            textTransform: 'capitalize',
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          color: cssVar(text),
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        Sample text on this fill
      </span>
    </div>
  )
}

function TokenLabels({
  fill,
  text,
  icon,
  border,
}: Pick<Pairing, 'fill' | 'text' | 'icon' | 'border'>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--ifm-font-family-monospace)',
        fontSize: '0.75rem',
        gap: '0.25rem',
        marginTop: '0.5rem',
        overflowWrap: 'anywhere',
      }}
    >
      <span>Fill: {fill}</span>
      <span>Text: {text}</span>
      <span>Icon: {icon}</span>
      {border ? <span>Border (example): {border}</span> : null}
    </div>
  )
}

function expand(token: string, tone: string) {
  return token.replaceAll('{tone}', tone)
}

function PairingSpecimen({
  pairing,
  tone,
}: {
  pairing: Pairing
  tone: string
}) {
  const fill = expand(pairing.fill, tone)
  const text = expand(pairing.text, tone)
  const icon = expand(pairing.icon, tone)
  const border = pairing.border ? expand(pairing.border, tone) : undefined

  return (
    <div style={{ minWidth: 0 }}>
      <Specimen
        label={tone || pairing.title}
        fill={fill}
        text={text}
        icon={icon}
        border={border}
      />
      <TokenLabels fill={fill} text={text} icon={icon} border={border} />
    </div>
  )
}

function Group({ pairing }: { pairing: Pairing }) {
  const isPerTone = pairing.fill.includes('{tone}')
  const tones: readonly string[] = isPerTone ? TONES : ['']

  return (
    <section style={{ margin: '2rem 0' }}>
      <h4 style={{ marginBottom: '0.25rem' }}>{pairing.title}</h4>
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
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
          gap: '1rem',
        }}
      >
        {tones.map((tone) => (
          <PairingSpecimen
            key={tone || pairing.fill}
            pairing={pairing}
            tone={tone}
          />
        ))}
      </div>
    </section>
  )
}

export function ColourPairing() {
  return (
    <div>
      <h3>Representative pairings</h3>
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
        }}
      >
        {FEATURED_PAIRINGS.map(({ pairing, tone }) => (
          <section key={pairing.title} style={{ minWidth: 0 }}>
            <h4>{pairing.title}</h4>
            <PairingSpecimen pairing={pairing} tone={tone} />
          </section>
        ))}
      </div>
      <details style={{ margin: '2rem 0' }}>
        <summary>Explore all tones and levels</summary>
        <h3>Full pairing gallery</h3>
        {PAIRINGS.map((pairing) => (
          <Group key={pairing.title} pairing={pairing} />
        ))}
      </details>
    </div>
  )
}

export default ColourPairing
