import type { CSSProperties } from 'react'

/**
 * A binding maps one CSS property to one dotted semantic token.
 *
 * Keying by property does three jobs at once: it styles the specimen, it tells the leader which
 * edge to leave from, and in spacing mode it tells the overlay which region to tint. That is why
 * the specimen can be rendered from the same declaration that draws the diagram.
 */
export type Binding = {
  /** Dotted semantic name, e.g. 'spacing.md'. Shown as the CSS custom property. */
  token: string
  /** What this token does here, if the name alone is not obvious. */
  label?: string
  /** Overrides the per-property default edge. */
  edge?: 'top' | 'bottom'
}

export type TokenMode = 'colour' | 'spacing' | 'typography'

export type BindableProperty =
  // colour
  | 'color'
  | 'background'
  | 'borderColor'
  | 'outlineColor'
  | 'textDecorationColor'
  // spacing
  | 'paddingBlock'
  | 'paddingInline'
  | 'gap'
  | 'borderRadius'
  // typography
  | 'fontFamily'
  | 'fontSize'
  | 'lineHeight'
  | 'fontWeight'

export type Bindings = Partial<Record<BindableProperty, Binding>>

/** The custom property a dotted name compiles to. Mechanical, and checked by check:colour-docs. */
export const cssName = (token: string) => `--eds-${token.replaceAll('.', '-')}`

export const cssVar = (token: string) => `var(${cssName(token)})`

/**
 * Fixed ordering, so leader rows do not move when someone reorders the keys in the MDX.
 */
export const ORDER: BindableProperty[] = [
  'color',
  'background',
  'borderColor',
  'outlineColor',
  'textDecorationColor',
  'paddingBlock',
  'paddingInline',
  'gap',
  'borderRadius',
  'fontFamily',
  'fontWeight',
  'fontSize',
  'lineHeight',
]

/**
 * Properties whose resolved value is printed on the label row. Lengths and font settings are worth
 * reading off a diagram; a colour resolves to an oklch string, which is not.
 */
export const READOUT: ReadonlySet<BindableProperty> = new Set<BindableProperty>(
  [
    'paddingBlock',
    'paddingInline',
    'gap',
    'borderRadius',
    'fontFamily',
    'fontWeight',
    'fontSize',
    'lineHeight',
  ],
)

/** Which edge a leader leaves from when the binding does not say. */
export const DEFAULT_EDGE: Record<BindableProperty, 'top' | 'bottom'> = {
  color: 'top',
  background: 'bottom',
  borderColor: 'bottom',
  outlineColor: 'bottom',
  textDecorationColor: 'bottom',
  paddingBlock: 'bottom',
  paddingInline: 'bottom',
  gap: 'bottom',
  borderRadius: 'top',
  fontFamily: 'top',
  fontWeight: 'top',
  fontSize: 'top',
  lineHeight: 'bottom',
}

/**
 * Styles a bound property needs in order to be visible at all. A border colour with no border
 * style paints nothing. Chrome `style` can override any of these; a binding cannot be overridden,
 * because the diagram would then be labelling something the specimen is not using.
 */
export function impliedStyle(prop: BindableProperty): CSSProperties {
  switch (prop) {
    case 'borderColor':
      return { borderStyle: 'solid', borderWidth: 1 }
    case 'outlineColor':
      return { outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 }
    case 'gap':
      return { display: 'inline-flex', alignItems: 'center' }
    case 'textDecorationColor':
      return { textDecorationLine: 'underline', textDecorationThickness: 2 }
    default:
      return {}
  }
}

/**
 * Region tints for the spacing overlay. Chrome, not tokens: these are here to tell two regions
 * apart on the page, and they carry no meaning in the design system.
 */
const HUE = {
  paddingBlock: '124, 58, 237',
  paddingInline: '219, 39, 119',
  gap: '13, 148, 136',
  borderRadius: '217, 119, 6',
} satisfies Partial<Record<BindableProperty, string>>

export const TINT: Partial<Record<BindableProperty, string>> = {
  paddingBlock: `rgba(${HUE.paddingBlock}, 0.28)`,
  paddingInline: `rgba(${HUE.paddingInline}, 0.28)`,
  gap: `rgba(${HUE.gap}, 0.35)`,
  borderRadius: `rgba(${HUE.borderRadius}, 0.9)`,
}

/** The same hues, opaque, for the dot that points into a region. A translucent dot reads as a ring. */
export const DOT_TINT: Partial<Record<BindableProperty, string>> = {
  paddingBlock: `rgb(${HUE.paddingBlock})`,
  paddingInline: `rgb(${HUE.paddingInline})`,
  gap: `rgb(${HUE.gap})`,
  borderRadius: `rgb(${HUE.borderRadius})`,
}

/** The bound properties present, in ORDER. */
export const boundProperties = (bindings: Bindings): BindableProperty[] =>
  ORDER.filter((prop) => bindings[prop] !== undefined)
