/**
 * The collection keys of the deprecated libraries, without the EDS Foundation
 * inventory, for the scanner and the fixture export.
 */
import oldLibraries from './inventory/old-libraries.json'

export const OLD_COLLECTION_KEYS = new Set(
  oldLibraries.libraries.flatMap((library) =>
    library.collections.map((collection) => collection.key),
  ),
)

const density = oldLibraries.libraries
  .flatMap((library) => library.collections)
  .find((collection) => collection.name === '💎 Density')
if (!density) throw new Error('old-libraries.json has no 💎 Density collection')

/** Key of `💎 Density`, where alias chains stop. */
export const OLD_DENSITY_KEY = density.key
