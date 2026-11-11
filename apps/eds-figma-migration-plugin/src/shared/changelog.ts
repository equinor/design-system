/**
 * The change log the plugin keeps on every layer it changes, in the layer's
 * shared plugin data. Revert frame reads it to put the legacy bindings back.
 *
 * Shared plugin data, under a namespace, works for a published plugin and
 * for a development copy alike; private plugin data needs the plugin's
 * published id. Other plugins can read it, which also lets a team audit a
 * migration with its own tools.
 */
import type { TypographyField } from '../mapping/types'
import type { ChangeOutcome } from '../scan/apply-plan'
import type { PropertyRef } from '../scan/types'

/** The shared plugin data namespace for everything the plugin stores. */
export const NAMESPACE = 'eds_migration'

/** The key of the change log on each changed layer. */
export const LOG_KEY = 'log'

export type LoggedVariable = { type: 'variable'; key: string; name: string }

export type LoggedTypography = {
  type: 'typography'
  fields: Partial<Record<TypographyField, { key: string; name: string }>>
  /** The font before the change, which has to be loaded to bind the legacy variables again */
  font?: { family: string; style: string }
}

export type LoggedTextStyle = { type: 'textStyle'; key: string; name: string }

/** A legacy component instance that was replaced, such as Typography */
export type LoggedComponent = {
  type: 'component'
  /** The key of the variant the instance used, to import it again */
  key: string
  name: string
  properties: Record<string, string | boolean>
  /** Explicit modes on the instance, by collection id, which size its text */
  modes?: Record<string, string>
  /** How the instance was sized */
  sizing?: {
    horizontal: 'FIXED' | 'HUG' | 'FILL'
    vertical: 'FIXED' | 'HUG' | 'FILL'
    width: number
    height: number
  }
  /** The fills of the text in the instance, with their variable bindings, as Figma paints */
  textFills?: unknown[]
}

export type LoggedOldMode = {
  type: 'mode'
  collectionId: string
  collectionKey: string
  modeId: string
  modeName: string
  /** False when the legacy mode had to stay */
  cleared: boolean
}

export type LoggedNewMode = {
  type: 'newMode'
  collectionKey: string
  modeName: string
  /** The mode of the new collection before the run, to restore on revert */
  previousModeId: string | null
}

/** A number set without a variable, such as a border width */
export type LoggedValue = { type: 'value'; value: number }

export type LogEntry = {
  property: PropertyRef
  old: LoggedVariable | LoggedTypography | LoggedOldMode | LoggedComponent
  /** What was bound or set instead; none when a legacy mode was only cleared */
  new:
    | LoggedVariable
    | LoggedTextStyle
    | LoggedNewMode
    | LoggedValue
    | { type: 'none' }
  outcome: ChangeOutcome
  mappingVersion: string
  /** ISO time */
  at: string
}
