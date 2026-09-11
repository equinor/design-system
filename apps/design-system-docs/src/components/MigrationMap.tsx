import React from 'react'

/**
 * Old token beside new token, both painted.
 *
 * Not one value survived the redefinition: none of the 115 semantic 2.x colours resolves to the
 * same hex as any redefined token. So a mapping cannot be derived from values, and "find the
 * closest hex" produces a palette that fails contrast in one scheme or the other. These pairs are
 * mapped by role, and the swatches show the size of the change you should expect.
 *
 * 1.x colours are literals because that generation was a hand-picked hex palette and its variables
 * are not loaded here. Everything on the right is a live `var()`, so it tracks the token source.
 */

type Pair = {
  /** Old token, as the consumer knows it */
  from: string
  /** The colour the old token had. A hex for 1.x, a custom property for 2.x. */
  fromValue: string
  /** Redefined token, dotted. `null` where there is no equivalent. */
  to: string | null
  /** Why, or what to decide when `to` is null */
  note?: string
}

const cssVar = (token: string) => `var(--eds-${token.replaceAll('.', '-')})`
const paint = (value: string) => (value.startsWith('--') ? `var(${value})` : value)

function Swatch({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <span
      style={{
        background: muted ? 'transparent' : paint(value),
        backgroundImage: muted
          ? 'repeating-linear-gradient(45deg, var(--ifm-color-emphasis-200) 0 6px, transparent 6px 12px)'
          : undefined,
        width: '2.5rem',
        height: '2.5rem',
        flex: 'none',
        borderRadius: '4px',
        border: '1px solid var(--ifm-color-emphasis-300)',
      }}
    />
  )
}

const name: React.CSSProperties = {
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.75rem',
  wordBreak: 'break-word',
}

function Row({ pair }: { pair: Pair }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) 1.25rem auto minmax(0, 1fr)',
        gap: '0.625rem',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderTop: '1px solid var(--ifm-color-emphasis-200)',
      }}
    >
      <Swatch value={pair.fromValue} />
      <span style={name}>{pair.from}</span>
      <span aria-hidden="true" style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
        →
      </span>
      <Swatch value={pair.to ? cssVar(pair.to) : ''} muted={!pair.to} />
      <span style={name}>
        {pair.to ?? <em style={{ color: 'var(--ifm-color-emphasis-700)' }}>no equivalent</em>}
        {pair.note ? (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--ifm-font-family-base)',
              fontSize: '0.75rem',
              color: 'var(--ifm-color-emphasis-700)',
              marginTop: '0.125rem',
            }}
          >
            {pair.note}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function Table({ pairs }: { pairs: Pair[] }) {
  return (
    <div style={{ margin: '1rem 0 2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) 1.25rem auto minmax(0, 1fr)',
          gap: '0.625rem',
          fontSize: '0.75rem',
          color: 'var(--ifm-color-emphasis-700)',
          paddingBottom: '0.375rem',
        }}
      >
        <span />
        <span>Old</span>
        <span />
        <span />
        <span>Redefined</span>
      </div>
      {pairs.map((p) => (
        <Row key={p.from} pair={p} />
      ))}
    </div>
  )
}

// --- EDS 1.x -------------------------------------------------------------------------------------

const ONE_TEXT: Pair[] = [
  { from: 'text.static_icons__default', fromValue: '#3d3d3d', to: 'text.primary' },
  { from: 'text.static_icons__secondary', fromValue: '#565656', to: 'text.secondary' },
  { from: 'text.static_icons__tertiary', fromValue: '#6f6f6f', to: 'text.tertiary' },
  { from: 'text.static_icons__primary_white', fromValue: '#ffffff', to: 'text.inverted', note: 'On a solid accent fill use text.on-emphasis.accent instead.' },
]

const ONE_UI: Pair[] = [
  { from: 'ui.background__default', fromValue: '#ffffff', to: 'background.surface' },
  { from: 'ui.background__light', fromValue: '#f7f7f7', to: 'background.canvas' },
  { from: 'ui.background__medium', fromValue: '#dcdcdc', to: null, note: 'Used for both fills and dividers. Pick background.non-interactive.neutral.muted or border.non-interactive.neutral.default by role.' },
  { from: 'ui.background__scrim', fromValue: '#000000', to: 'overlay.scrim' },
  { from: 'ui.background__overlay', fromValue: '#000000', to: 'overlay.scrim' },
  { from: 'ui.background__semitransparent', fromValue: '#ffffff', to: null, note: 'Colour tokens are opaque now, so translucency has no token. Use opacity on the element.' },
  { from: 'ui.background__info', fromValue: '#d5eaf4', to: 'background.non-interactive.info.muted' },
  { from: 'ui.background__warning', fromValue: '#ffe7d6', to: 'background.non-interactive.warning.muted' },
  { from: 'ui.background__danger', fromValue: '#ffc1c1', to: 'background.non-interactive.danger.muted' },
]

const ONE_INTERACTIVE: Pair[] = [
  { from: 'interactive.primary__resting', fromValue: '#007079', to: 'background.interactive.accent.emphasis.default' },
  { from: 'interactive.primary__hover', fromValue: '#004f55', to: 'background.interactive.accent.emphasis.hover' },
  { from: 'interactive.primary__hover_alt', fromValue: '#deedee', to: 'background.interactive.accent.muted.hover' },
  { from: 'interactive.primary__selected_highlight', fromValue: '#e6faec', to: 'background.interactive.accent.selected.default' },
  { from: 'interactive.primary__selected_hover', fromValue: '#c3f3d2', to: 'background.interactive.accent.selected.hover' },
  { from: 'interactive.secondary__resting', fromValue: '#243746', to: 'background.interactive.neutral.emphasis.default' },
  { from: 'interactive.secondary__highlight', fromValue: '#d5eaf4', to: 'background.interactive.neutral.muted.default' },
  { from: 'interactive.secondary__link_hover', fromValue: '#17242f', to: 'text.interactive.link.hover' },
  { from: 'interactive.danger__resting', fromValue: '#eb0000', to: 'background.interactive.danger.emphasis.default' },
  { from: 'interactive.danger__hover', fromValue: '#b30d2f', to: 'background.interactive.danger.emphasis.hover' },
  { from: 'interactive.danger__highlight', fromValue: '#ffc1c1', to: 'background.interactive.danger.muted.default' },
  { from: 'interactive.danger__text', fromValue: '#b30d2f', to: 'text.on-muted.danger' },
  { from: 'interactive.warning__resting', fromValue: '#ff9200', to: 'background.interactive.warning.emphasis.default' },
  { from: 'interactive.warning__hover', fromValue: '#ad6200', to: 'background.interactive.warning.emphasis.hover' },
  { from: 'interactive.warning__highlight', fromValue: '#ffe7d6', to: 'background.interactive.warning.muted.default' },
  { from: 'interactive.warning__text', fromValue: '#ad6200', to: 'text.on-muted.warning' },
  { from: 'interactive.success__resting', fromValue: '#4bb748', to: 'background.interactive.success.emphasis.default' },
  { from: 'interactive.success__hover', fromValue: '#358132', to: 'background.interactive.success.emphasis.hover' },
  { from: 'interactive.success__highlight', fromValue: '#e6faec', to: 'background.interactive.success.muted.default' },
  { from: 'interactive.success__text', fromValue: '#358132', to: 'text.on-muted.success' },
  { from: 'interactive.disabled__fill', fromValue: '#eaeaea', to: 'background.interactive.disabled' },
  { from: 'interactive.disabled__border', fromValue: '#dcdcdc', to: 'border.interactive.disabled' },
  { from: 'interactive.disabled__text', fromValue: '#bebebe', to: 'text.interactive.disabled' },
  { from: 'interactive.focus', fromValue: '#007079', to: 'border.interactive.focus' },
  { from: 'interactive.link_on_interactive_colors', fromValue: '#ffffff', to: 'text.on-emphasis.accent' },
  { from: 'interactive.icon_on_interactive_colors', fromValue: '#ffffff', to: 'icon.on-emphasis.accent' },
  { from: 'interactive.text_highlight', fromValue: '#d5eaf4', to: 'background.interactive.accent.selected.default', note: 'Selection is a state, so it now sits under selected rather than under a tone tint.' },
  { from: 'interactive.link_in_snackbars', fromValue: '#97cace', to: null, note: 'There is no token for this. A link on background.inverted takes text.inverted, so raise a request if you need a distinct value.' },
  { from: 'interactive.pressed_overlay_dark', fromValue: '#000000', to: null, note: 'States are named colours now, so there is no overlay. Use the pressed value of the token you started from.' },
  { from: 'interactive.pressed_overlay_light', fromValue: '#ffffff', to: null, note: 'Same as the dark overlay above.' },
]

const ONE_TABLE: Pair[] = [
  { from: 'interactive.table__cell__fill_resting', fromValue: '#ffffff', to: 'background.surface' },
  { from: 'interactive.table__cell__fill_hover', fromValue: '#eaeaea', to: 'background.interactive.neutral.muted.hover' },
  { from: 'interactive.table__cell__fill_activated', fromValue: '#e6faec', to: 'background.interactive.neutral.selected.default' },
  { from: 'interactive.table__header__fill_resting', fromValue: '#f7f7f7', to: 'background.canvas' },
  { from: 'interactive.table__header__fill_hover', fromValue: '#dcdcdc', to: 'background.interactive.neutral.muted.hover' },
  { from: 'interactive.table__header__fill_activated', fromValue: '#eaeaea', to: 'background.interactive.neutral.selected.default' },
]

// --- 2.0.0-beta ------------------------------------------------------------------------------------

const TWO_SURFACES: Pair[] = [
  { from: '--eds-color-bg-canvas', fromValue: '--eds-color-bg-canvas', to: 'background.canvas' },
  { from: '--eds-color-bg-surface', fromValue: '--eds-color-bg-surface', to: 'background.surface' },
  { from: '--eds-color-bg-floating', fromValue: '--eds-color-bg-floating', to: 'background.floating' },
  { from: '--eds-color-bg-input', fromValue: '--eds-color-bg-input', to: 'background.input' },
  { from: '--eds-color-bg-backdrop', fromValue: '--eds-color-bg-backdrop', to: null, note: 'Under review together with overlay.scrim; the two describe the same job.' },
  { from: '--eds-color-bg-disabled', fromValue: '--eds-color-bg-disabled', to: 'background.interactive.disabled' },
]

const TWO_FILLS: Pair[] = [
  { from: '--eds-color-bg-accent-fill-emphasis-default', fromValue: '--eds-color-bg-accent-fill-emphasis-default', to: 'background.interactive.accent.emphasis.default' },
  { from: '--eds-color-bg-accent-fill-emphasis-hover', fromValue: '--eds-color-bg-accent-fill-emphasis-hover', to: 'background.interactive.accent.emphasis.hover' },
  { from: '--eds-color-bg-accent-fill-emphasis-active', fromValue: '--eds-color-bg-accent-fill-emphasis-active', to: 'background.interactive.accent.emphasis.pressed', note: 'active became pressed.' },
  { from: '--eds-color-bg-accent-fill-muted-default', fromValue: '--eds-color-bg-accent-fill-muted-default', to: 'background.interactive.accent.muted.default' },
  { from: '--eds-color-bg-accent-canvas', fromValue: '--eds-color-bg-accent-canvas', to: 'background.non-interactive.accent.muted', note: 'A tinted plane that cannot be clicked is non-interactive now.' },
  { from: '--eds-color-bg-accent-surface', fromValue: '--eds-color-bg-accent-surface', to: 'background.non-interactive.accent.default' },
]

const TWO_BORDERS: Pair[] = [
  { from: '--eds-color-border-accent-subtle', fromValue: '--eds-color-border-accent-subtle', to: 'border.non-interactive.accent.muted' },
  { from: '--eds-color-border-accent-medium', fromValue: '--eds-color-border-accent-medium', to: 'border.non-interactive.accent.default' },
  { from: '--eds-color-border-accent-strong', fromValue: '--eds-color-border-accent-strong', to: 'border.non-interactive.accent.emphasis' },
  { from: '--eds-color-border-subtle', fromValue: '--eds-color-border-subtle', to: 'border.non-interactive.neutral.muted' },
  { from: '--eds-color-border-focus', fromValue: '--eds-color-border-focus', to: 'border.interactive.focus' },
  { from: '--eds-color-border-disabled', fromValue: '--eds-color-border-disabled', to: 'border.interactive.disabled' },
]

const TWO_TEXT: Pair[] = [
  { from: '--eds-color-text-strong', fromValue: '--eds-color-text-strong', to: 'text.primary' },
  { from: '--eds-color-text-subtle', fromValue: '--eds-color-text-subtle', to: 'text.secondary' },
  { from: '--eds-color-text-accent-strong', fromValue: '--eds-color-text-accent-strong', to: 'text.on-muted.accent', note: 'Tone-coloured text sits on a tinted fill, so it is named for what it sits on.' },
  { from: '--eds-color-text-accent-strong-on-emphasis', fromValue: '--eds-color-text-accent-strong-on-emphasis', to: 'text.on-emphasis.accent' },
  { from: '--eds-color-text-accent-subtle-on-emphasis', fromValue: '--eds-color-text-accent-subtle-on-emphasis', to: null, note: 'Only one foreground per tone on an emphasis fill now. Use text.on-emphasis.accent.' },
  { from: '--eds-color-text-link', fromValue: '--eds-color-text-link', to: 'text.interactive.link.default' },
  { from: '--eds-color-text-disabled', fromValue: '--eds-color-text-disabled', to: 'text.interactive.disabled' },
]

export const MigrationOneText = () => <Table pairs={ONE_TEXT} />
export const MigrationOneUi = () => <Table pairs={ONE_UI} />
export const MigrationOneInteractive = () => <Table pairs={ONE_INTERACTIVE} />
export const MigrationOneTable = () => <Table pairs={ONE_TABLE} />
export const MigrationTwoSurfaces = () => <Table pairs={TWO_SURFACES} />
export const MigrationTwoFills = () => <Table pairs={TWO_FILLS} />
export const MigrationTwoBorders = () => <Table pairs={TWO_BORDERS} />
export const MigrationTwoText = () => <Table pairs={TWO_TEXT} />
