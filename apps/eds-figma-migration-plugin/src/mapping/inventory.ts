import newLibrary from './inventory/new-library.json'
import oldLibraries from './inventory/old-libraries.json'
import type { VariableType } from './types'

export type NewVariable = {
  name: string
  key: string
  type: VariableType
  scopes: string[]
  /**
   * What the variable resolves to, for swatches and numbers in the picker:
   * a colour per colour scheme, or a number per density.
   */
  values?: {
    light?: string
    dark?: string
    comfortable?: number
    compact?: number
    relaxed?: number
  }
}

export type NewTextStyle = {
  name: string
  key: string
  fontFamily: string
  fontStyle: string
  fontSize: number
}

export type CollectionInfo = {
  name: string
  key: string
  libraryId: string
  libraryName: string
}

export const NEW_LIBRARY = newLibrary.library

export const NEW_VARIABLES = newLibrary.variables as NewVariable[]
export const NEW_TEXT_STYLES = newLibrary.textStyles as NewTextStyle[]

const newVariablesByName = new Map(NEW_VARIABLES.map((v) => [v.name, v]))
const newTextStylesByName = new Map(NEW_TEXT_STYLES.map((s) => [s.name, s]))
const newTextStyleKeys = new Set(NEW_TEXT_STYLES.map((s) => s.key))

export function getNewVariable(name: string): NewVariable | undefined {
  return newVariablesByName.get(name)
}

export function getNewTextStyle(name: string): NewTextStyle | undefined {
  return newTextStylesByName.get(name)
}

export function isNewTextStyleKey(key: string): boolean {
  return newTextStyleKeys.has(key)
}

function newCollectionKey(name: string): string {
  const collection = newLibrary.collections.find((c) => c.name === name)
  if (!collection) throw new Error(`new-library.json has no collection ${name}`)
  return collection.key
}

function newModeId(collection: string, mode: string): string {
  const found = newLibrary.collections
    .find((c) => c.name === collection)
    ?.modes.find((m) => m.name === mode)
  if (!found)
    throw new Error(`new-library.json has no mode ${collection}/${mode}`)
  return found.modeId
}

/** Collection keys in EDS Foundation [EDS Beta]. */
export const NEW = {
  semantic: newCollectionKey('semantic'),
  density: newCollectionKey('density'),
  colorScheme: newCollectionKey('color-scheme'),
}

/** Mode ids of the two collections the plugin sets modes on. */
export const NEW_MODES = {
  density: {
    comfortable: newModeId('density', 'comfortable'),
    compact: newModeId('density', 'compact'),
    relaxed: newModeId('density', 'relaxed'),
  },
  'color-scheme': {
    light: newModeId('color-scheme', 'light'),
    dark: newModeId('color-scheme', 'dark'),
  },
} as const

const newCollectionKeys = new Set(newLibrary.collections.map((c) => c.key))

const oldCollections = new Map<string, CollectionInfo>()
for (const library of oldLibraries.libraries) {
  for (const collection of library.collections) {
    oldCollections.set(collection.key, {
      name: collection.name,
      key: collection.key,
      libraryId: library.id,
      libraryName: library.name,
    })
  }
}

function oldCollectionKey(libraryId: string, name: string): string {
  for (const info of oldCollections.values()) {
    if (info.libraryId === libraryId && info.name === name) return info.key
  }
  throw new Error(`old-libraries.json has no collection ${libraryId}/${name}`)
}

/** Collection keys in the deprecated libraries that the rules refer to. */
export const OLD = {
  appearance: oldCollectionKey('colours-dynamic', '🎨 Appearance'),
  dynamicConcept: oldCollectionKey('colours-dynamic', 'Concept'),
  staticSemantic: oldCollectionKey('colours-static', 'Semantic'),
  staticConcept: oldCollectionKey('colours-static', 'Concept'),
  colorScheme: oldCollectionKey('colours-shared', '🌗 Color scheme'),
  density: oldCollectionKey('spacing-typography', '💎 Density'),
  spacingSemantic: oldCollectionKey('spacing-typography', '🗣️ Semantic'),
  spaceProportions: oldCollectionKey(
    'spacing-typography',
    '🪐 Space proportions',
  ),
  selectableSpace: oldCollectionKey(
    'spacing-typography',
    '🪐 Selectable space',
  ),
  borderRadius: oldCollectionKey('spacing-typography', '⭕️ Border radius'),
  box: oldCollectionKey('spacing-typography', '📦 Box'),
  fontSize: oldCollectionKey('spacing-typography', '🅰️ Font and icon size'),
  fontFamily: oldCollectionKey('spacing-typography', '🅰️ Font family'),
  lineHeight: oldCollectionKey('spacing-typography', '🅰️ Line height'),
}

/** Which library a collection key belongs to. */
export type CollectionOrigin = 'new' | 'old' | 'other'

export function collectionOrigin(collectionKey: string): CollectionOrigin {
  if (newCollectionKeys.has(collectionKey)) return 'new'
  if (oldCollections.has(collectionKey)) return 'old'
  return 'other'
}

export function oldCollectionInfo(
  collectionKey: string,
): CollectionInfo | undefined {
  return oldCollections.get(collectionKey)
}

export { collectionKeyFromId } from './ids'
