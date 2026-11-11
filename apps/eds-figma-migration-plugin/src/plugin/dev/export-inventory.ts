/**
 * Developer command: exports the inventories the mapping is built on, in
 * the format of src/mapping/inventory/*.json.
 *
 * - new-library.json can only be exported from EDS Foundation [EDS Beta]
 *   itself, because the plugin API cannot list the text styles of a library
 *   from another file.
 * - old-libraries.json is exported from any file where the deprecated
 *   libraries are enabled. figma.teamLibrary only lists published
 *   collections, so the unpublished ones the old variables alias through are
 *   carried over from the current file.
 */
import currentOld from '../../mapping/inventory/old-libraries.json'
import { NEW, NEW_LIBRARY } from '../../mapping/inventory'
import type { DevExportFile } from '../../shared/messages'

const byName = <T extends { name: string }>(a: T, b: T) =>
  a.name.localeCompare(b.name, 'en')

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

async function exportNewLibrary(): Promise<DevExportFile | string> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const semantic = collections.find(
    (collection) => collection.key === NEW.semantic,
  )
  if (!semantic) {
    return `new-library.json was not exported: this file has no local “semantic” collection with the key ${NEW.semantic}. Run the command in EDS Foundation [EDS Beta].`
  }

  const variables = []
  for (const id of semantic.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(id)
    if (!variable) continue
    variables.push({
      name: variable.name,
      key: variable.key,
      type: variable.resolvedType,
      scopes: [...variable.scopes],
    })
  }
  const textStyles = (await figma.getLocalTextStylesAsync()).map((style) => ({
    name: style.name,
    key: style.key,
    fontFamily: style.fontName.family,
    fontStyle: style.fontName.style,
    fontSize: style.fontSize,
  }))

  const inventory = {
    generatedAt: today(),
    library: NEW_LIBRARY,
    collections: collections
      .map((collection) => ({
        name: collection.name,
        key: collection.key,
        modes: collection.modes.map((mode) => ({
          name: mode.name,
          modeId: mode.modeId,
        })),
      }))
      .sort(byName),
    variables: variables.sort(byName),
    textStyles: textStyles.sort(byName),
  }
  return {
    fileName: 'new-library.json',
    path: 'src/mapping/inventory/new-library.json',
    json: `${JSON.stringify(inventory, null, 2)}\n`,
  }
}

async function exportOldLibraries(): Promise<DevExportFile | string> {
  let available
  try {
    available =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  } catch (error) {
    return `old-libraries.json was not exported: the team libraries could not be read (${String(error)}).`
  }
  const deprecated = available.filter((collection) =>
    /\(Deprecated\)/.test(collection.libraryName),
  )
  if (deprecated.length === 0) {
    return 'old-libraries.json was not exported: no deprecated EDS library is enabled in this file.'
  }

  const libraries = currentOld.libraries.map((library) => {
    const published = deprecated
      .filter((collection) => collection.libraryName === library.name)
      .map((collection) => ({ name: collection.name, key: collection.key }))
    const unpublished = library.collections.filter(
      (collection) => 'published' in collection && !collection.published,
    )
    return {
      ...library,
      collections: [...published, ...unpublished],
    }
  })
  const known = new Set(currentOld.libraries.map((library) => library.name))
  const unknown = [
    ...new Set(
      deprecated
        .map((collection) => collection.libraryName)
        .filter((name) => !known.has(name)),
    ),
  ]
  for (const name of unknown) {
    libraries.push({
      id: name,
      name,
      libraryKey: null,
      collections: deprecated
        .filter((collection) => collection.libraryName === name)
        .map((collection) => ({ name: collection.name, key: collection.key })),
    })
  }

  return {
    fileName: 'old-libraries.json',
    path: 'src/mapping/inventory/old-libraries.json',
    json: `${JSON.stringify({ generatedAt: today(), libraries }, null, 2)}\n`,
  }
}

export async function exportInventory(): Promise<{
  files: DevExportFile[]
  notes: string[]
}> {
  const files: DevExportFile[] = []
  const notes: string[] = []
  for (const result of [await exportNewLibrary(), await exportOldLibraries()]) {
    if (typeof result === 'string') notes.push(result)
    else files.push(result)
  }
  return { files, notes }
}
