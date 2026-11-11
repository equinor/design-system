/**
 * Types for the mapping from the deprecated EDS libraries to
 * EDS Foundation [EDS Beta]. The mapping is plain data and pure functions,
 * so it can be tested without Figma. The scanner (src/plugin) builds these
 * inputs from the nodes it finds.
 */

export type VariableType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'

/** One step in the alias chain of an old variable. */
export type ChainStep = {
  /** Key of the variable's collection, the part after `VariableCollectionId:` */
  collectionKey: string
  name: string
}

/** A variable from one of the deprecated libraries, as bound on a node. */
export type OldVariable = {
  collectionKey: string
  name: string
  type: VariableType
  /**
   * Where the variable points under the modes in force on the node, from the
   * variable it aliases down to the first variable in `💎 Density`. A
   * mode-driven variable such as `Selectable/Space horizontal` under the
   * Selectable space mode XS ends at `spacing/horizontal/xs`. Empty or
   * missing when the variable aliases nothing or the chain could not be read.
   */
  chain?: ChainStep[]
  /** The number the variable resolves to on the node, in px, when it was read */
  value?: number
  /** The value the variable resolves to on the node, when it was read. */
  resolvedValue?: number | string | boolean | null
}

/** What a binding sits on. */
export type BindingKind =
  /** A paint in the fills of a frame or shape */
  | 'fill'
  /** A paint in the strokes of any node */
  | 'stroke'
  /** The colour of an effect */
  | 'effect'
  /** A paint in the fills of a text node, or of a range in one */
  | 'textFill'
  /** Padding, item spacing and counter-axis spacing */
  | 'spacing'
  /** Width, height and the min and max sizes */
  | 'size'
  /** The four corner radii */
  | 'radius'
  | 'strokeWeight'
  | 'opacity'
  /** Any other bound field */
  | 'other'

/** The old variable on the fill under a text or icon, with its owner. */
export type FillUnder = {
  /** Old variable bound to the fill, when the fill uses one */
  oldVariable?: OldVariable
  /** New variable name, when the fill already uses EDS Foundation */
  newVariableName?: string
  /** Context of the layer that owns the fill */
  context: RoleContext
}

/** What the scanner knows about the layer a binding sits on. */
export type RoleContext = {
  /** Figma node type, such as FRAME, TEXT or VECTOR */
  nodeType: string
  /**
   * The layer's own name, then the names of its ancestors up to the
   * top-level frame, nearest first. Variant names of local components
   * (`State=Hover, Size=Small`) are names too, so they are matched the same
   * way.
   */
  names: string[]
  /** True if the layer or an ancestor up to the top-level frame has prototype interactions */
  hasReactions?: boolean
  /** Old modes in force on the layer: collection key → mode name */
  modes: Record<string, string>
  /** Stroke weights per side (top, right, bottom, left) when the layer has strokes */
  strokeSides?: [number, number, number, number]
  /** For text: true when the text sits on one line */
  singleLine?: boolean
  /** The nearest visible fill under the layer, when there is one */
  fillUnder?: FillUnder
}

export type Outcome = 'sure' | 'check' | 'none'

export type Resolution = {
  outcome: Outcome
  /**
   * New variable or text style names, the proposal first. Empty when the
   * outcome is `none`.
   */
  candidates: string[]
  /** Why the rule chose this, in a sentence a designer can read */
  reason: string
  /** Identifier of the rule that decided, for tests and the change log */
  rule: string
}

export type TypographyField =
  | 'fontSize'
  | 'lineHeight'
  | 'fontFamily'
  | 'fontWeight'
  | 'letterSpacing'
  | 'paragraphSpacing'

export type TypographyInput = {
  /** Old variables bound to the typography fields of the text or range */
  fields: Partial<Record<TypographyField, OldVariable>>
  /** The font in use, which also gives the weight when no variable sets it */
  font: { family: string; style: string }
  /** Font size in px, for when no size variable is bound */
  fontSize?: number
  context: RoleContext
}

export type ModeInput = {
  collectionKey: string
  modeName: string
}

export type ModeTarget = {
  /** `density` or `color-scheme` in EDS Foundation */
  collection: 'density' | 'color-scheme'
  mode: string
}

export type ModeResolution = {
  outcome: Outcome
  /** The new mode to set, or null when the old mode is only cleared */
  target: ModeTarget | null
  reason: string
  rule: string
}
