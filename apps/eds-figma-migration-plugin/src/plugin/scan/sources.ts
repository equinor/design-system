/**
 * Where the legacy values an instance takes from its main component can be
 * fixed (phase 3 of the nested-instances plan, 2026-11-20). Figma has no
 * read-only way to tell: getPublishStatusAsync answers UNPUBLISHED for every
 * remote component, the current Typography component too (tested on FRIOD
 * Main Design, 2026-11-20). So the check imports each main component by its
 * key, as spikes S2 and S3 found (2026-11-19): the import fails when no
 * library this file reaches has the main component, either because it is in
 * another file that is not a library or because its library no longer
 * publishes it (the old Core Components Badge and Divider, 2026-11-20); Figma
 * logs a 404 for that in the console. It returns the file's
 * own copy when that copy is current; and it returns a new node when the
 * library has a newer version. An import changes no layer, but Figma keeps a
 * hidden copy of the latest version in the file, so the designer starts the
 * check from the Instances tab.
 */
import { OLD_COLLECTION_KEYS } from '../../mapping/old-keys'
import { collectionKeyFromId } from '../../mapping/ids'
import type { ComponentSource } from '../../scan/types'

type MainNode = ComponentNode | ComponentSetNode

/** The variable ids an object of bound variables refers to, at any depth. */
function aliasIds(value: unknown, out: string[]) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    for (const item of value) aliasIds(item, out)
    return
  }
  const alias = value as { type?: unknown; id?: unknown }
  if (alias.type === 'VARIABLE_ALIAS' && typeof alias.id === 'string') {
    out.push(alias.id)
    return
  }
  for (const item of Object.values(value)) aliasIds(item, out)
}

/** Counts the legacy bindings and modes in a main component, its variants and the layers in them. */
export class LegacyCounter {
  private readonly variables = new Map<string, Promise<boolean>>()
  private readonly collections = new Map<string, Promise<boolean>>()

  private collectionIsLegacy(collectionId: string): Promise<boolean> {
    let found = this.collections.get(collectionId)
    if (!found) {
      const key = collectionKeyFromId(collectionId)
      found = key
        ? Promise.resolve(OLD_COLLECTION_KEYS.has(key))
        : figma.variables
            .getVariableCollectionByIdAsync(collectionId)
            .then((collection) =>
              collection ? OLD_COLLECTION_KEYS.has(collection.key) : false,
            )
            .catch(() => false)
      this.collections.set(collectionId, found)
    }
    return found
  }

  private variableIsLegacy(id: string): Promise<boolean> {
    let found = this.variables.get(id)
    if (!found) {
      found = figma.variables
        .getVariableByIdAsync(id)
        .then((variable) =>
          variable
            ? this.collectionIsLegacy(variable.variableCollectionId)
            : false,
        )
        .catch(() => false)
      this.variables.set(id, found)
    }
    return found
  }

  async count(root: MainNode): Promise<number> {
    let total = 0
    for (const node of [root, ...root.findAll(() => true)]) {
      const ids: string[] = []
      if ('boundVariables' in node) aliasIds(node.boundVariables, ids)
      for (const id of ids) {
        if (await this.variableIsLegacy(id)) total += 1
      }
      if ('explicitVariableModes' in node) {
        for (const collectionId of Object.keys(node.explicitVariableModes)) {
          if (await this.collectionIsLegacy(collectionId)) total += 1
        }
      }
    }
    return total
  }
}

/** How long the check waits for one import; most answer in 2 s or less. */
const IMPORT_TIMEOUT = 30_000

function timeout(ms: number): Promise<'timeout'> {
  return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms))
}

/** The main component of an instance, or its component set for a variant. */
async function mainOf(instanceId: string): Promise<MainNode | null> {
  const node = await figma.getNodeByIdAsync(instanceId)
  if (node?.type !== 'INSTANCE') return null
  const main = await node.getMainComponentAsync()
  if (!main) return null
  return main.parent?.type === 'COMPONENT_SET' ? main.parent : main
}

/** Where the legacy values of the instance's main component can be fixed. */
export async function componentSource(
  instanceId: string,
  counter: LegacyCounter,
): Promise<ComponentSource> {
  const copy = await mainOf(instanceId).catch(() => null)
  if (!copy) {
    return { kind: 'failed', message: 'The instance was not found.' }
  }
  if (!copy.remote) return { kind: 'this-file' }
  const imported =
    copy.type === 'COMPONENT_SET'
      ? figma.importComponentSetByKeyAsync(copy.key)
      : figma.importComponentByKeyAsync(copy.key)
  let latest: MainNode | 'timeout'
  try {
    latest = await Promise.race([imported, timeout(IMPORT_TIMEOUT)])
  } catch {
    return { kind: 'no-library' }
  }
  if (latest === 'timeout') {
    return {
      kind: 'failed',
      message: `The library did not answer in ${IMPORT_TIMEOUT / 1000} s.`,
    }
  }
  const legacy = await counter.count(copy)
  if (latest.id === copy.id) return { kind: 'library', legacy }
  return { kind: 'update', legacy, latestLegacy: await counter.count(latest) }
}
