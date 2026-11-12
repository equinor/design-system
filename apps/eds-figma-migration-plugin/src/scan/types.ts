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
  /** For the rules: the value of a variable whose chain does not reach `💎 Density` */
  resolvedValue?: number | string | boolean | null
  /** For the window and the rules: the number a legacy variable resolves to on this layer, in px */
  value?: number
  /** For the window: the colour a legacy variable resolves to on this layer, as #rrggbb or #rrggbbaa */
  colour?: string
}

import type { Density } from '../mapping/density'
import type { ColorScheme } from '../mapping/scheme'

export type { Density }

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
  /** Ids of the node and its ancestors in the entry that set explicit modes, outermost first */
  modeHolders?: string[]
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
  /**
   * A number the plugin set in place of a legacy variable, such as a border
   * width, read from the change log while the layer still has that number
   */
  | { unit: 'value'; value: number }
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

export type Counts = Record<ScoredCategory, number> & {
  other: number
  /** Of `migrated`: values inside instances, which follow their main component */
  migratedInInstances?: number
}

/** What kind of property a binding is on, for filtering. */
export type PropertyGroup =
  'colour' | 'typography' | 'spacing' | 'size' | 'radius' | 'modes' | 'other'

export const PROPERTY_GROUPS: PropertyGroup[] = [
  'colour',
  'typography',
  'spacing',
  'size',
  'radius',
  'modes',
  'other',
]

/** A unit after classification, as the inspector and the report show it. */
export type BindingRecord = {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  entryId: string
  path: string[]
  property: PropertyRef
  group: PropertyGroup
  /** For variables: the kind of property, which decides the variables a picker offers */
  kind?: BindingKind
  category: Category
  /**
   * Identifies the legacy variable, the set of legacy typography variables,
   * or the legacy mode, so the Mapping view can group every use of it.
   */
  oldKey?: string
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
  /** Ids of the node and its ancestors in the entry that set explicit modes */
  modeHolders?: string[]
  /**
   * Keys of the legacy collections the binding reads, so a legacy mode on one
   * of them above it has to stay while the binding does: its own collection
   * and every collection in its alias chain.
   */
  reads?: string[]
  /** The legacy variable, for a binding on a variable; the change log and revert need its key */
  oldVariable?: { id: string; key: string; name: string }
  /** The legacy typography variables by field, for a text or range */
  oldFields?: Partial<Record<TypographyField, { key: string; name: string }>>
  /** The font of a text or range before the change */
  oldFont?: { family: string; style: string }
  /** The number the legacy variable resolves to on the layer, in px */
  oldValue?: number
  /** The colour the legacy variable resolves to on the layer */
  oldColour?: string
  /** The density the layer has after the migration, which decides the new numbers */
  density?: Density
  /** The colour scheme the layer has after the migration, which decides the new colours shown */
  scheme?: ColorScheme
  /** The legacy mode, for an explicit mode */
  oldMode?: {
    collectionId: string
    collectionKey: string
    modeId: string
    modeName: string
  }
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
  /** Layers the plugin has changed, with a change log Revert can use */
  changed?: number
  /** For a local component with legacy variables: its instances in the file */
  instanceCount?: number
}

export type OldInstance = {
  id: string
  name: string
  entryId: string
  /** An instance of the legacy Typography component, which can become a text layer */
  typography?: boolean
  /** The text in a Typography instance, to tell them apart */
  text?: string
  /** Old variables inside the instance or on it */
  count: number
  mainComponent?: {
    name: string
    key: string
    remote: boolean
    /** For a main component in this file, to go to it */
    id?: string
  }
}

export type ScanSummary = {
  scope: 'selection' | 'page' | 'file'
  scannedAt: string
  mappingVersion: string
  pages: { id: string; name: string }[]
  nodesScanned: number
  totals: Counts
  health: number | null
  entries: EntrySummary[]
}
