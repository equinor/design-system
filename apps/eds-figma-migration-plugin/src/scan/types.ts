/**
 * Types for a scan. The plugin main thread reads the document into raw units
 * (src/plugin/scan/collect.ts), and the pure code in src/scan classifies and
 * counts them. The raw units are plain data, so the scan of a frame can be
 * saved as a fixture and run through the same pipeline in the tests.
 */
import type {
  BindingKind,
  ChainStep,
  Outcome,
  RoleContext,
  TypographyField,
  VariableType,
} from '../mapping/types'

/** A bound variable as read from the document, before it is classified. */
export type RawVariable = {
  id: string
  key: string
  name: string
  type: VariableType
  /** Key of the variable's collection; empty for local variables in files that are not libraries */
  collectionKey: string
  collectionName: string
  /** The alias chain under the modes in force, down to the first `💎 Density` variable */
  chain?: ChainStep[]
  resolvedValue?: number | string | boolean | null
}

export type RawFillUnder = {
  /** The variable on the fill, when it uses one */
  variable?: RawVariable
  context: Omit<RoleContext, 'fillUnder'>
}

export type RawContext = Omit<RoleContext, 'fillUnder'> & {
  fillUnder?: RawFillUnder
}

/** Where on a node a binding sits. */
export type PropertyRef =
  | {
      type: 'paint'
      field: 'fills' | 'strokes'
      index: number
      /** For a fill on a range of text */
      range?: [number, number]
    }
  | { type: 'effect'; index: number; field: string }
  | { type: 'field'; field: string }
  | { type: 'typography'; range?: [number, number] }
  | { type: 'mode'; collectionId: string }

export type RawTextStyle = {
  id: string
  key: string
  name: string
}

/** One counted unit: a paint binding, a bound field, the typography of a text or range, or an explicit mode. */
export type RawUnit = {
  nodeId: string
  nodeName: string
  nodeType: string
  /** The frame, loose-layer group or local component the unit is listed under */
  entryId: string
  /** Names from the entry's root down to the node's parent */
  path: string[]
  property: PropertyRef
  /** Id of the outermost instance the node is in, or the node itself when it is an instance */
  instanceId?: string
  context: RawContext
} & (
  | { unit: 'variable'; kind: BindingKind; variable: RawVariable }
  | {
      unit: 'typography'
      fields: Partial<Record<TypographyField, RawVariable>>
      font: { family: string; style: string }
      fontSize: number
      textStyle?: RawTextStyle
    }
  | {
      unit: 'mode'
      collectionId: string
      collectionKey: string
      collectionName: string
      modeId: string
      modeName: string
    }
)

export type Category =
  /** Bound to EDS Foundation [EDS Beta] */
  | 'migrated'
  | 'sure'
  | 'check'
  | 'none'
  /** An old variable inside an instance, or on an instance node */
  | 'inInstance'
  /** Bound to another library or to a local variable; left out of the score */
  | 'other'

export const SCORED_CATEGORIES = [
  'migrated',
  'sure',
  'check',
  'none',
  'inInstance',
] as const

export type ScoredCategory = (typeof SCORED_CATEGORIES)[number]

export type Counts = Record<ScoredCategory, number> & { other: number }

/** A unit after classification, as the inspector and the report show it. */
export type BindingRecord = {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  entryId: string
  path: string[]
  property: PropertyRef
  category: Category
  /** The old variable, a summary of old typography variables, or the old mode */
  old?: string
  /** The collection of the old variable or mode */
  oldCollection?: string
  /** For migrated and other units: what the property is bound to now */
  current?: string
  outcome?: Outcome
  /** The proposal first */
  candidates?: string[]
  reason?: string
  rule?: string
  instanceId?: string
}

export type EntryKind = 'frame' | 'loose' | 'component'

/** A top-level frame, the loose layers of a page or section, or a local component. */
export type EntrySummary = {
  id: string
  kind: EntryKind
  name: string
  pageId: string
  pageName: string
  /** Section names, outermost first; empty for a frame directly on the page */
  sections: string[]
  /** Nodes to select for go-to: the frame itself, or the loose layers */
  nodeIds: string[]
  counts: Counts
  /** migrated ÷ (migrated + sure + check + none + in instance), or null when there is nothing to score */
  health: number | null
  /** Instances in the entry that still contain old variables */
  oldInstances: number
}

export type OldInstance = {
  id: string
  name: string
  entryId: string
  /** Old variables inside the instance or on it */
  count: number
  mainComponent?: {
    name: string
    key: string
    remote: boolean
  }
}

export type ScanSummary = {
  scope: 'page' | 'file'
  scannedAt: string
  mappingVersion: string
  pages: { id: string; name: string }[]
  nodesScanned: number
  totals: Counts
  health: number | null
  entries: EntrySummary[]
}
