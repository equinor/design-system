/**
 * Reads the collection key from a variable's collection id. A remote
 * collection id has the form `VariableCollectionId:<collection key>/<id>`;
 * a local one has no key in it, so this returns null.
 *
 * Kept apart from inventory.ts, which loads the inventories, so the scanner
 * can use it without them.
 */
const PREFIX = 'VariableCollectionId:'

export function collectionKeyFromId(collectionId: string): string | null {
  if (!collectionId.startsWith(PREFIX)) return null
  const key = collectionId.slice(PREFIX.length).split('/')[0]
  return key.length === 40 && /^[0-9a-f]+$/.test(key) ? key : null
}
