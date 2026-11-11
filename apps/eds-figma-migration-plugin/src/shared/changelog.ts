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

export type LogEntry = {
  property: PropertyRef
  old: LoggedVariable | LoggedTypography | LoggedOldMode
  /** What was bound or set instead; none when a legacy mode was only cleared */
  new: LoggedVariable | LoggedTextStyle | LoggedNewMode | { type: 'none' }
  outcome: ChangeOutcome
  mappingVersion: string
  /** ISO time */
  at: string
}
