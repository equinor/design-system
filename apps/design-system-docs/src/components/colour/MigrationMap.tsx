import React from 'react'

/**
 * Previous-generation token beside its 3.0.0-beta replacement, both painted.
 *
 * Not one value carries over: none of the 115 semantic 2.0.0-beta colours resolves to the same hex
 * as any 3.0.0-beta token. So a mapping cannot be derived from values, and "find the
 * closest hex" produces a palette that fails contrast in one scheme or the other. These pairs are
 * mapped by role, and the swatches show the size of the change you should expect.
 *
 * 1.x colours are literals because that generation was a hand-picked hex palette and its variables
 * are not loaded here. Everything on the right is a live `var()`, so it tracks the token source.
 */

type Pair = {
  /**
   * The token you are migrating away from, dotted.
   *
   * 1.x is dotted because that is its JS token path. 2.0.0-beta only ever shipped as CSS custom
   * properties, so its dotted form is written out here rather than quoted from a source: one
   * notation per table keeps the pair readable as a rename.
   */
  from: string
  /** The colour the old token had. A hex for 1.x, a custom property for 2.0.0-beta. */
  fromValue: string
  /** 3.0.0-beta token, dotted. `null` where there is no equivalent. */
  to: string | null
  /** Why, or what to decide when `to` is null */
  note?: string
}

const cssVar = (token: string) => `var(--eds-${token.replaceAll('.', '-')})`
const paint = (value: string) =>
  value.startsWith('--') ? `var(${value})` : value

/**
 * Decorative: the colour is the point, and the token name beside it already says which colour.
 * Announcing it would read as an empty cell, so it is hidden from the accessibility tree.
 */
function Swatch({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
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

const cell: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
}

function Row({ pair }: { pair: Pair }) {
  return (
    <tr>
      <td>
        <span style={cell}>
          <Swatch value={pair.fromValue} />
          <span style={name}>{pair.from}</span>
        </span>
      </td>
      <td aria-hidden="true" className="direction">
        →
      </td>
      <td>
        <span style={cell}>
          <Swatch value={pair.to ? cssVar(pair.to) : ''} muted={!pair.to} />
          <span style={name}>
            {pair.to ?? (
              <em style={{ color: 'var(--ifm-color-emphasis-700)' }}>
                no equivalent
              </em>
            )}
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
        </span>
      </td>
    </tr>
  )
}

/**
 * A real table, because this is tabular data.
 *
 * The direction of the mapping is carried visually by the `→`, which a screen reader cannot see.
 * Column headers carry it instead: without them a row reads as two token names with nothing to say
 * which one you are migrating away from. They name the version rather than saying "old" and "new",
 * since a reader arrives on this page from one specific version. The arrow column is hidden rather
 * than given a header, since the headers now say the same thing.
 */
function Table({ pairs, from }: { pairs: Pair[]; from: string }) {
  return (
    <div className="migration-map">
      <table>
        <thead>
          <tr>
            <th scope="col">{from}</th>
            <th aria-hidden="true" className="direction" />
            <th scope="col">3.0.0-beta</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => (
            <Row key={p.from} pair={p} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- EDS 1.x -------------------------------------------------------------------------------------

const ONE_TEXT: Pair[] = [
  {
    from: 'text.static_icons__default',
    fromValue: '#3d3d3d',
    to: 'text.primary',
  },
  {
    from: 'text.static_icons__secondary',
    fromValue: '#565656',
    to: 'text.secondary',
  },
  {
    from: 'text.static_icons__tertiary',
    fromValue: '#6f6f6f',
    to: 'text.tertiary',
  },
  {
    from: 'text.static_icons__primary_white',
    fromValue: '#ffffff',
    to: 'text.inverted',
    note: 'On a solid accent fill use text.on-emphasis.accent instead.',
  },
]

const ONE_UI: Pair[] = [
  {
    from: 'ui.background__default',
    fromValue: '#ffffff',
    to: 'background.surface',
  },
  {
    from: 'ui.background__light',
    fromValue: '#f7f7f7',
    to: 'background.canvas',
  },
  {
    from: 'ui.background__medium',
    fromValue: '#dcdcdc',
    to: null,
    note: 'Used for both fills and dividers. Pick background.non-interactive.neutral.muted or border.non-interactive.neutral.default by role.',
  },
  { from: 'ui.background__scrim', fromValue: '#000000', to: 'overlay.scrim' },
  { from: 'ui.background__overlay', fromValue: '#000000', to: 'overlay.scrim' },
  {
    from: 'ui.background__semitransparent',
    fromValue: '#ffffff',
    to: null,
    note: 'Colour tokens are opaque now, so translucency has no token.',
  },
  {
    from: 'ui.background__info',
    fromValue: '#d5eaf4',
    to: 'background.non-interactive.info.muted',
  },
  {
    from: 'ui.background__warning',
    fromValue: '#ffe7d6',
    to: 'background.non-interactive.warning.muted',
  },
  {
    from: 'ui.background__danger',
    fromValue: '#ffc1c1',
    to: 'background.non-interactive.danger.muted',
  },
]

const ONE_INTERACTIVE: Pair[] = [
  {
    from: 'interactive.primary__resting',
    fromValue: '#007079',
    to: 'background.interactive.accent.emphasis.default',
  },
  {
    from: 'interactive.primary__hover',
    fromValue: '#004f55',
    to: 'background.interactive.accent.emphasis.hover',
  },
  {
    from: 'interactive.primary__hover_alt',
    fromValue: '#deedee',
    to: 'background.interactive.accent.muted.hover',
  },
  {
    from: 'interactive.primary__selected_highlight',
    fromValue: '#e6faec',
    to: 'background.interactive.accent.selected.default',
  },
  {
    from: 'interactive.primary__selected_hover',
    fromValue: '#c3f3d2',
    to: 'background.interactive.accent.selected.hover',
  },
  {
    from: 'interactive.secondary__resting',
    fromValue: '#243746',
    to: 'background.interactive.neutral.emphasis.default',
  },
  {
    from: 'interactive.secondary__highlight',
    fromValue: '#d5eaf4',
    to: 'background.interactive.neutral.muted.default',
  },
  {
    from: 'interactive.secondary__link_hover',
    fromValue: '#17242f',
    to: 'text.interactive.link.hover',
  },
  {
    from: 'interactive.danger__resting',
    fromValue: '#eb0000',
    to: 'background.interactive.danger.emphasis.default',
  },
  {
    from: 'interactive.danger__hover',
    fromValue: '#b30d2f',
    to: 'background.interactive.danger.emphasis.hover',
  },
  {
    from: 'interactive.danger__highlight',
    fromValue: '#ffc1c1',
    to: 'background.interactive.danger.muted.default',
  },
  {
    from: 'interactive.danger__text',
    fromValue: '#b30d2f',
    to: 'text.on-muted.danger',
  },
  {
    from: 'interactive.warning__resting',
    fromValue: '#ff9200',
    to: 'background.interactive.warning.emphasis.default',
  },
  {
    from: 'interactive.warning__hover',
    fromValue: '#ad6200',
    to: 'background.interactive.warning.emphasis.hover',
  },
  {
    from: 'interactive.warning__highlight',
    fromValue: '#ffe7d6',
    to: 'background.interactive.warning.muted.default',
  },
  {
    from: 'interactive.warning__text',
    fromValue: '#ad6200',
    to: 'text.on-muted.warning',
  },
  {
    from: 'interactive.success__resting',
    fromValue: '#4bb748',
    to: 'background.interactive.success.emphasis.default',
  },
  {
    from: 'interactive.success__hover',
    fromValue: '#358132',
    to: 'background.interactive.success.emphasis.hover',
  },
  {
    from: 'interactive.success__highlight',
    fromValue: '#e6faec',
    to: 'background.interactive.success.muted.default',
  },
  {
    from: 'interactive.success__text',
    fromValue: '#358132',
    to: 'text.on-muted.success',
  },
  {
    from: 'interactive.disabled__fill',
    fromValue: '#eaeaea',
    to: 'background.interactive.disabled',
  },
  {
    from: 'interactive.disabled__border',
    fromValue: '#dcdcdc',
    to: 'border.interactive.disabled',
  },
  {
    from: 'interactive.disabled__text',
    fromValue: '#bebebe',
    to: 'text.interactive.disabled',
  },
  {
    from: 'interactive.focus',
    fromValue: '#007079',
    to: 'border.interactive.focus',
  },
  {
    from: 'interactive.link_on_interactive_colors',
    fromValue: '#ffffff',
    to: 'text.on-emphasis.accent',
  },
  {
    from: 'interactive.icon_on_interactive_colors',
    fromValue: '#ffffff',
    to: 'icon.on-emphasis.accent',
  },
  {
    from: 'interactive.text_highlight',
    fromValue: '#d5eaf4',
    to: 'background.interactive.accent.selected.default',
    note: 'Selection is a state, so it now sits under selected rather than under a tone tint.',
  },
  {
    from: 'interactive.link_in_snackbars',
    fromValue: '#97cace',
    to: null,
    note: 'There is no token for this. A link on background.inverted takes text.inverted, so raise a request if you need a distinct value.',
  },
  {
    from: 'interactive.pressed_overlay_dark',
    fromValue: '#000000',
    to: null,
    note: 'States are named colours now, so there is no overlay. Use the pressed value of the token you started from.',
  },
  {
    from: 'interactive.pressed_overlay_light',
    fromValue: '#ffffff',
    to: null,
    note: 'Same as the dark overlay above.',
  },
]

const ONE_TABLE: Pair[] = [
  {
    from: 'interactive.table__cell__fill_resting',
    fromValue: '#ffffff',
    to: 'background.surface',
  },
  {
    from: 'interactive.table__cell__fill_hover',
    fromValue: '#eaeaea',
    to: 'background.interactive.neutral.muted.hover',
  },
  {
    from: 'interactive.table__cell__fill_activated',
    fromValue: '#e6faec',
    to: 'background.interactive.neutral.selected.default',
  },
  {
    from: 'interactive.table__header__fill_resting',
    fromValue: '#f7f7f7',
    to: 'background.canvas',
  },
  {
    from: 'interactive.table__header__fill_hover',
    fromValue: '#dcdcdc',
    to: 'background.interactive.neutral.muted.hover',
  },
  {
    from: 'interactive.table__header__fill_activated',
    fromValue: '#eaeaea',
    to: 'background.interactive.neutral.selected.default',
  },
]

// --- 2.0.0-beta ------------------------------------------------------------------------------------

const TWO_SURFACES: Pair[] = [
  {
    from: 'bg.canvas',
    fromValue: '--eds-color-bg-canvas',
    to: 'background.canvas',
  },
  {
    from: 'bg.surface',
    fromValue: '--eds-color-bg-surface',
    to: 'background.surface',
  },
  {
    from: 'bg.floating',
    fromValue: '--eds-color-bg-floating',
    to: 'background.floating',
  },
  {
    from: 'bg.input',
    fromValue: '--eds-color-bg-input',
    to: 'background.input',
  },
  {
    from: 'bg.backdrop',
    fromValue: '--eds-color-bg-backdrop',
    to: null,
    note: 'Under review together with overlay.scrim; the two describe the same job.',
  },
  {
    from: 'bg.disabled',
    fromValue: '--eds-color-bg-disabled',
    to: 'background.interactive.disabled',
  },
]

const TWO_FILLS: Pair[] = [
  {
    from: 'bg.accent.fill.emphasis.default',
    fromValue: '--eds-color-bg-accent-fill-emphasis-default',
    to: 'background.interactive.accent.emphasis.default',
  },
  {
    from: 'bg.accent.fill.emphasis.hover',
    fromValue: '--eds-color-bg-accent-fill-emphasis-hover',
    to: 'background.interactive.accent.emphasis.hover',
  },
  {
    from: 'bg.accent.fill.emphasis.active',
    fromValue: '--eds-color-bg-accent-fill-emphasis-active',
    to: 'background.interactive.accent.emphasis.pressed',
    note: 'active became pressed.',
  },
  {
    from: 'bg.accent.fill.muted.default',
    fromValue: '--eds-color-bg-accent-fill-muted-default',
    to: 'background.interactive.accent.muted.default',
  },
  {
    from: 'bg.accent.canvas',
    fromValue: '--eds-color-bg-accent-canvas',
    to: 'background.non-interactive.accent.muted',
    note: 'A tinted plane that cannot be clicked is non-interactive now.',
  },
  {
    from: 'bg.accent.surface',
    fromValue: '--eds-color-bg-accent-surface',
    to: 'background.non-interactive.accent.default',
  },
]

const TWO_BORDERS: Pair[] = [
  {
    from: 'border.accent.subtle',
    fromValue: '--eds-color-border-accent-subtle',
    to: 'border.non-interactive.accent.muted',
  },
  {
    from: 'border.accent.medium',
    fromValue: '--eds-color-border-accent-medium',
    to: 'border.non-interactive.accent.default',
  },
  {
    from: 'border.accent.strong',
    fromValue: '--eds-color-border-accent-strong',
    to: 'border.non-interactive.accent.emphasis',
  },
  {
    from: 'border.subtle',
    fromValue: '--eds-color-border-subtle',
    to: 'border.non-interactive.neutral.muted',
  },
  {
    from: 'border.focus',
    fromValue: '--eds-color-border-focus',
    to: 'border.interactive.focus',
  },
  {
    from: 'border.disabled',
    fromValue: '--eds-color-border-disabled',
    to: 'border.interactive.disabled',
  },
]

const TWO_TEXT: Pair[] = [
  {
    from: 'text.strong',
    fromValue: '--eds-color-text-strong',
    to: 'text.primary',
  },
  {
    from: 'text.subtle',
    fromValue: '--eds-color-text-subtle',
    to: 'text.secondary',
  },
  {
    from: 'text.accent.strong',
    fromValue: '--eds-color-text-accent-strong',
    to: 'text.on-muted.accent',
    note: 'Tone-coloured text sits on a tinted fill, so it is named for what it sits on.',
  },
  {
    from: 'text.accent.strong.on-emphasis',
    fromValue: '--eds-color-text-accent-strong-on-emphasis',
    to: 'text.on-emphasis.accent',
  },
  {
    from: 'text.accent.subtle.on-emphasis',
    fromValue: '--eds-color-text-accent-subtle-on-emphasis',
    to: null,
    note: 'Only one foreground per tone on an emphasis fill now. Use text.on-emphasis.accent.',
  },
  {
    from: 'text.link',
    fromValue: '--eds-color-text-link',
    to: 'text.interactive.link.default',
  },
  {
    from: 'text.disabled',
    fromValue: '--eds-color-text-disabled',
    to: 'text.interactive.disabled',
  },
]

export const MigrationOneText = () => <Table pairs={ONE_TEXT} from="EDS 1.x" />
export const MigrationOneUi = () => <Table pairs={ONE_UI} from="EDS 1.x" />
export const MigrationOneInteractive = () => (
  <Table pairs={ONE_INTERACTIVE} from="EDS 1.x" />
)
export const MigrationOneTable = () => (
  <Table pairs={ONE_TABLE} from="EDS 1.x" />
)
export const MigrationTwoSurfaces = () => (
  <Table pairs={TWO_SURFACES} from="2.0.0-beta" />
)
export const MigrationTwoFills = () => (
  <Table pairs={TWO_FILLS} from="2.0.0-beta" />
)
export const MigrationTwoBorders = () => (
  <Table pairs={TWO_BORDERS} from="2.0.0-beta" />
)
export const MigrationTwoText = () => (
  <Table pairs={TWO_TEXT} from="2.0.0-beta" />
)
