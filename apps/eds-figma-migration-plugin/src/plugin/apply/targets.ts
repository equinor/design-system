/**
 * Imports the EDS Foundation [EDS Beta] variables, text styles and
 * collections an apply run needs, once per run.
 */
import { collectionKeyFromId } from '../../mapping/ids'
import { getNewTextStyle, getNewVariable, NEW } from '../../mapping/inventory'

export const LIBRARY_MISSING =
  'Could not import from EDS Foundation [EDS Beta]. Check that the library is enabled in this file (Assets → Libraries), then try again.'

/** Variables whose alias chains lead to each collection, to find it when the library API cannot list it. */
const PROBES: Record<string, string[]> = {
  [NEW.density]: ['spacing/md', 'spacing/sm'],
  [NEW.colorScheme]: ['background/canvas', 'text/primary'],
}

function isAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { type?: unknown }).type === 'VARIABLE_ALIAS'
  )
}

export class Targets {
  private readonly variables = new Map<string, Promise<Variable>>()
  private readonly styles = new Map<string, Promise<TextStyle>>()
  private readonly collections = new Map<string, Promise<VariableCollection>>()

  /** A variable in the `semantic` collection, by name. */
  variable(name: string): Promise<Variable> {
    let found = this.variables.get(name)
    if (!found) {
      const info = getNewVariable(name)
      found = info
        ? figma.variables.importVariableByKeyAsync(info.key).catch(() => {
            throw new Error(LIBRARY_MISSING)
          })
        : Promise.reject(
            new Error(`${name} is not in EDS Foundation [EDS Beta]`),
          )
      this.variables.set(name, found)
    }
    return found
  }

  /** A text style, by name. */
  textStyle(name: string): Promise<TextStyle> {
    let found = this.styles.get(name)
    if (!found) {
      const info = getNewTextStyle(name)
      found = info
        ? figma
            .importStyleByKeyAsync(info.key)
            .then((style) => {
              if (style.type !== 'TEXT')
                throw new Error(`${name} is not a text style`)
              return style as TextStyle
            })
            .catch((error: unknown) => {
              throw error instanceof Error &&
                error.message.includes('text style')
                ? error
                : new Error(LIBRARY_MISSING)
            })
        : Promise.reject(
            new Error(
              `${name} is not a text style in EDS Foundation [EDS Beta]`,
            ),
          )
      this.styles.set(name, found)
    }
    return found
  }

  /** A library collection by key, new or legacy. */
  collection(key: string, knownId?: string): Promise<VariableCollection> {
    let found = this.collections.get(key)
    if (!found) {
      found = this.findCollection(key, knownId)
      this.collections.set(key, found)
    }
    return found
  }

  /** The id of a mode in a collection, by name. */
  async modeId(collectionKey: string, modeName: string): Promise<string> {
    const collection = await this.collection(collectionKey)
    const mode = collection.modes.find(
      (candidate) => candidate.name === modeName,
    )
    if (!mode) {
      throw new Error(`${collection.name} has no mode called ${modeName}`)
    }
    return mode.modeId
  }

  private async findCollection(
    key: string,
    knownId?: string,
  ): Promise<VariableCollection> {
    if (knownId) {
      const known = await figma.variables
        .getVariableCollectionByIdAsync(knownId)
        .catch(() => null)
      if (known) return known
    }
    try {
      const listed =
        await figma.teamLibrary.getVariablesInLibraryCollectionAsync(key)
      if (listed.length > 0) {
        const variable = await figma.variables.importVariableByKeyAsync(
          listed[0].key,
        )
        const collection = await figma.variables.getVariableCollectionByIdAsync(
          variable.variableCollectionId,
        )
        if (collection) return collection
      }
    } catch {
      // The library API needs the library to be enabled; the aliases below may still find it.
    }
    for (const name of PROBES[key] ?? []) {
      let current: Variable | null = await this.variable(name).catch(() => null)
      for (let depth = 0; current && depth < 6; depth++) {
        if (collectionKeyFromId(current.variableCollectionId) === key) {
          const collection =
            await figma.variables.getVariableCollectionByIdAsync(
              current.variableCollectionId,
            )
          if (collection) return collection
        }
        const value = Object.values(current.valuesByMode).find(isAlias)
        current = value
          ? await figma.variables.getVariableByIdAsync(value.id)
          : null
      }
    }
    throw new Error(LIBRARY_MISSING)
  }
}
