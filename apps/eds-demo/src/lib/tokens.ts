/** How a token is previewed in the token reference. */
export type TokenKind =
  | 'fill'
  | 'text'
  | 'icon'
  | 'border'
  | 'spacing'
  | 'radius'
  | 'font-size'
  | 'line-height'
  | 'family'
  | 'weight'
  | 'shadow'
  /** A name the reference does not know how to preview */
  | 'none'

export type Token = {
  name: string
  kind: TokenKind
  /** The background the preview sits on: the fill a text or icon token is
   * made for, otherwise the surface. */
  backdrop: string
  /** For typography: the family of the role the step belongs to */
  family?: string
  /** For a line height: the font size of the same step */
  size?: string
}

export type TokenSubgroup = { label: string; tokens: Token[] }
export type TokenGroup = {
  id: string
  label: string
  subgroups: TokenSubgroup[]
}

/** The size steps in order, smallest first. */
const SIZES = [
  'none',
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
]

const ORDER: Record<string, string[]> = {
  'corner-radius': ['none', 'rounded', 'rounded-outer', 'pill'],
  'font-weight': ['normal', 'medium', 'bold'],
  'font-family': ['ui', 'header', 'mono'],
  elevation: ['low', 'high', 'key', 'ambient'],
}

const SURFACE = 'var(--eds-background-surface)'

/** text.on-<level>.<tone> and icon.on-<level>.<tone> go on the fill of the
 * same level and tone, inverted on the inverted background, the rest on the
 * surface (the foreground pairing on the colour usage page). */
function backdropFor(rest: string) {
  const on = rest.match(/^on-(default|emphasis|muted)-(\w+)$/)
  if (on) return `var(--eds-background-non-interactive-${on[2]}-${on[1]})`
  if (rest === 'inverted') return 'var(--eds-background-inverted)'
  return SURFACE
}

function colourSubgroup(rest: string) {
  if (rest.startsWith('interactive-')) return 'Interactive'
  if (rest.startsWith('non-interactive-')) return 'Non-interactive'
  if (rest.startsWith('on-')) return 'On a fill'
  return 'Base'
}

type Entry = { group: string; subgroup: string; sort: number; token: Token }

function describe(name: string): Entry | null {
  const match = name.match(
    /^--eds-(background|text|icon|border|spacing|corner-radius|typography|font-family|font-weight|elevation|overlay)-(.+)$/,
  )
  if (!match) return null
  const [, group, rest] = match
  const token = (kind: TokenKind, backdrop = SURFACE): Token => ({
    name,
    kind,
    backdrop,
  })
  const ordered = (list: string[], value: string) => {
    const index = list.indexOf(value)
    return index === -1 ? list.length : index
  }

  switch (group) {
    case 'background':
      return {
        group,
        subgroup: colourSubgroup(rest),
        sort: 0,
        token: token('fill'),
      }
    case 'text':
    case 'icon':
      return {
        group,
        subgroup: colourSubgroup(rest),
        sort: 0,
        token: token(group, backdropFor(rest)),
      }
    case 'border':
      return {
        group,
        subgroup: colourSubgroup(rest),
        sort: 0,
        token: token('border'),
      }
    case 'overlay':
      return { group, subgroup: '', sort: 0, token: token('fill') }
    case 'spacing':
      return {
        group,
        subgroup: '',
        sort: ordered(SIZES, rest),
        token: token('spacing'),
      }
    case 'corner-radius':
      return {
        group,
        subgroup: '',
        sort: ordered(ORDER[group], rest),
        token: token('radius'),
      }
    case 'font-family':
    case 'font-weight':
      return {
        group: 'font',
        subgroup: group === 'font-family' ? 'Family' : 'Weight',
        sort: ordered(ORDER[group], rest),
        token: token(group === 'font-family' ? 'family' : 'weight'),
      }
    case 'elevation': {
      const shadow = rest === 'low' || rest === 'high'
      return {
        group,
        subgroup: shadow ? 'Shadow' : 'Shadow colour',
        sort: ordered(ORDER.elevation, rest),
        // A shadow is previewed on the canvas, where elevated parts sit.
        token: shadow
          ? token('shadow', 'var(--eds-background-canvas)')
          : token('fill'),
      }
    }
    case 'typography': {
      const parts = rest.match(
        /^(header|label|body)-(\w+)-(font-size|line-height)$/,
      )
      if (!parts) return null
      const [, role, size, property] = parts
      return {
        group,
        subgroup: role[0].toUpperCase() + role.slice(1),
        sort: ordered(SIZES, size) * 2 + (property === 'line-height' ? 1 : 0),
        token: {
          ...token(property === 'font-size' ? 'font-size' : 'line-height'),
          family:
            role === 'header'
              ? 'var(--eds-font-family-header)'
              : 'var(--eds-font-family-ui)',
          size: `var(--eds-typography-${role}-${size}-font-size)`,
        },
      }
    }
  }
  return null
}

const GROUPS: { id: string; label: string; subgroups?: string[] }[] = [
  {
    id: 'background',
    label: 'Background',
    subgroups: ['Base', 'Interactive', 'Non-interactive'],
  },
  {
    id: 'text',
    label: 'Text',
    subgroups: ['Base', 'Interactive', 'On a fill'],
  },
  {
    id: 'icon',
    label: 'Icon',
    subgroups: ['Base', 'Interactive', 'On a fill'],
  },
  {
    id: 'border',
    label: 'Border',
    subgroups: ['Base', 'Interactive', 'Non-interactive'],
  },
  { id: 'spacing', label: 'Spacing' },
  { id: 'corner-radius', label: 'Corner radius' },
  {
    id: 'typography',
    label: 'Typography',
    subgroups: ['Header', 'Label', 'Body'],
  },
  { id: 'font', label: 'Font', subgroups: ['Family', 'Weight'] },
  {
    id: 'elevation',
    label: 'Elevation',
    subgroups: ['Shadow', 'Shadow colour'],
  },
  { id: 'overlay', label: 'Overlay' },
]

/** The group for names that fit none of the patterns above, such as a new
 * kind of token in a later release of the bundle. They are listed without a
 * preview, so no published name goes missing; the tests fail while the group
 * is there, so the patterns get updated. */
export const OTHER_GROUP = 'other'

/** Sorts the published token names into the groups of the token reference.
 * The names come from the installed bundle, so a new release changes the
 * list without any change here. */
export function groupTokens(names: string[]): TokenGroup[] {
  const entries = names
    .map(describe)
    .filter((entry): entry is Entry => entry !== null)
  const groups = GROUPS.map(({ id, label, subgroups = [''] }) => ({
    id,
    label,
    subgroups: subgroups
      .map((subgroup) => ({
        label: subgroup,
        tokens: entries
          .filter((entry) => entry.group === id && entry.subgroup === subgroup)
          .sort(
            (a, b) =>
              a.sort - b.sort || a.token.name.localeCompare(b.token.name),
          )
          .map((entry) => entry.token),
      }))
      .filter((subgroup) => subgroup.tokens.length > 0),
  }))

  const placed = new Set(
    groups.flatMap((group) =>
      group.subgroups.flatMap((subgroup) =>
        subgroup.tokens.map((token) => token.name),
      ),
    ),
  )
  const other = names
    .filter((name) => !placed.has(name))
    .sort()
    .map((name): Token => ({ name, kind: 'none', backdrop: SURFACE }))
  if (other.length > 0) {
    groups.push({
      id: OTHER_GROUP,
      label: 'Other',
      subgroups: [{ label: '', tokens: other }],
    })
  }
  return groups.filter((group) => group.subgroups.length > 0)
}
