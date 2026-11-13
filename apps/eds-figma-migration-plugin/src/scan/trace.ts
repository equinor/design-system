/**
 * The pure part of the scan map the window draws while a scan runs (the
 * plugin's ScanTracer, src/plugin/scan/trace.ts): which top-level layers the
 * scan reads, in its order, and whether a unit is a legacy or a Beta value.
 * Kept free of Figma so the tests can run it.
 */
import { collectionOrigin, isNewTextStyleKey } from '../mapping/inventory'
import type { RawUnit } from './types'

/**
 * Whether a unit uses the legacy libraries or EDS Foundation [EDS Beta], the
 * same test classify.ts starts from. Other libraries and local variables
 * give undefined, and are not drawn.
 */
export function unitOrigin(unit: RawUnit): 'legacy' | 'beta' | undefined {
  switch (unit.unit) {
    case 'variable': {
      const origin = collectionOrigin(unit.variable.collectionKey)
      return origin === 'old' ? 'legacy' : origin === 'new' ? 'beta' : undefined
    }
    case 'typography': {
      const origins = Object.values(unit.fields).map((variable) =>
        collectionOrigin(variable.collectionKey),
      )
      if (origins.includes('old')) return 'legacy'
      if (
        origins.includes('new') ||
        (unit.textStyle && isNewTextStyleKey(unit.textStyle.key))
      )
        return 'beta'
      return undefined
    }
    case 'mode': {
      const origin = collectionOrigin(unit.collectionKey)
      return origin === 'old' ? 'legacy' : origin === 'new' ? 'beta' : undefined
    }
    case 'value':
      // A number the plugin set in place of a legacy variable: migrated.
      return 'beta'
  }
}

/** The little of a Figma layer the map needs, so this runs without Figma. */
export type MapNode = { readonly id: string; readonly type: string }

type MapLayers<T> = { tiles: T[]; sections: T[] }

function isFrameLike(node: MapNode): boolean {
  return (
    node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'COMPONENT_SET'
  )
}

/**
 * The layers that become entries, in the order scan.ts reads them: the
 * frames and components of a container, going into sections where they are,
 * and then its loose layers.
 */
function addContainer<T extends MapNode>(
  children: readonly T[],
  out: MapLayers<T>,
) {
  const loose: T[] = []
  for (const child of children) addTopLevel(child, out, loose)
  out.tiles.push(...loose)
}

function addTopLevel<T extends MapNode>(
  node: T,
  out: MapLayers<T>,
  loose: T[],
) {
  if (node.type === 'SECTION') {
    out.sections.push(node)
    // A section's children are layers of the same kind as the section.
    addContainer((node as T & { children: readonly T[] }).children, out)
  } else if (isFrameLike(node)) {
    out.tiles.push(node)
  } else {
    loose.push(node)
  }
}

/**
 * The top-level layers of a page, or the selected layers, in the order the
 * scan reads them. A selected layer that is not a frame is read on its own
 * right after it, as scan.ts does.
 */
export function mapLayers<T extends MapNode>(
  roots: readonly T[],
  selection: boolean,
): MapLayers<T> {
  const out: MapLayers<T> = { tiles: [], sections: [] }
  if (!selection) {
    addContainer(roots, out)
    return out
  }
  for (const root of roots) {
    const loose: T[] = []
    addTopLevel(root, out, loose)
    out.tiles.push(...loose)
  }
  return out
}
