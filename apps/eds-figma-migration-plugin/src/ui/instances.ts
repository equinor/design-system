/** Instances that still use legacy variables, grouped by main component. */
import type {
  ComponentInstance,
  EntrySummary,
  InstanceTree,
  OldInstance,
} from '../scan/types'

/**
 * What the Instances tab says about the instances of a library component
 * (decided 2026-11-16). The plugin never swaps a component.
 */
export const LIBRARY_INSTANCES_NOTE =
  'The plugin migrates variables, not components. Swap these to EDS Beta components in Figma; their legacy values go with them.'

export type InstanceGroup = {
  key: string
  name: string
  /** Where the main component is */
  source: string
  /** The main component, when it is in this file */
  mainId?: string
  /**
   * The main component is in a library. The plugin migrates variables, not
   * components, so these instances are swapped to EDS Beta components in
   * Figma by a designer.
   */
  fromLibrary?: true
  instances: OldInstance[]
  /** Legacy variables in all of them */
  count: number
}

export function groupInstances(instances: OldInstance[]): InstanceGroup[] {
  const groups = new Map<string, InstanceGroup>()
  for (const instance of instances) {
    const main = instance.mainComponent
    const key = main ? `main:${main.key}` : `name:${instance.name}`
    const group = groups.get(key) ?? {
      key,
      name: main?.name ?? instance.name,
      source: main
        ? main.remote
          ? 'from a library'
          : 'in this file'
        : 'main component not found',
      ...(main?.id && !main.remote ? { mainId: main.id } : {}),
      ...(main?.remote ? { fromLibrary: true as const } : {}),
      instances: [],
      count: 0,
    }
    group.instances.push(instance)
    group.count += instance.count
    groups.set(key, group)
  }
  return [...groups.values()].sort((a, b) => b.count - a.count)
}

/** The instances in a main component that come from one main component. */
export type ComponentInstanceGroup = {
  key: string
  name: string
  /** Where the main component is */
  source: string
  /** The main component, when it is in this file */
  mainId?: string
  instances: ComponentInstance[]
  /** Legacy values the instances override, which change in this component */
  overridden: number
  /** Legacy values the instances take from their main component */
  fromMain: number
}

/**
 * The instances in a main component, grouped by their main component: the
 * groups with legacy values first, then by name, each in the scan's order.
 */
export function groupComponentInstances(
  instances: ComponentInstance[],
): ComponentInstanceGroup[] {
  const groups = new Map<string, ComponentInstanceGroup>()
  for (const instance of instances) {
    const main = instance.mainComponent
    const key = main ? `main:${main.key}` : `name:${instance.name}`
    const group = groups.get(key) ?? {
      key,
      name: main?.name ?? instance.name,
      source: main
        ? main.remote
          ? 'from a library'
          : 'in this file'
        : 'main component not found',
      ...(main?.id && !main.remote ? { mainId: main.id } : {}),
      instances: [],
      overridden: 0,
      fromMain: 0,
    }
    group.instances.push(instance)
    group.overridden += instance.overridden
    group.fromMain += instance.fromMain
    groups.set(key, group)
  }
  const legacy = (group: ComponentInstanceGroup) =>
    group.overridden + group.fromMain
  return [...groups.values()].sort(
    (a, b) => legacy(b) - legacy(a) || a.name.localeCompare(b.name, 'en'),
  )
}

/** How many legacy values an instance, or a group of them, overrides and takes from its main component. */
export function legacySummary(overridden: number, fromMain: number): string {
  if (overridden === 0 && fromMain === 0) return 'No legacy values'
  const values = (count: number) =>
    `${count} legacy value${count === 1 ? '' : 's'}`
  return [
    overridden > 0 && `${values(overridden)} overridden here`,
    fromMain > 0 && `${values(fromMain)} from the main component`,
  ]
    .filter(Boolean)
    .join(', ')
}

/**
 * One instance in the Instances tab's tree: the instances in it below, and
 * the legacy values it and they take from their main components. Built from
 * the scan's `OldInstance.tree`, with the instances in slot content it owns
 * put under it (`OldInstance.within`), so a panel component such as PE Editor
 * shows the Text Fields and Switches in its slot (Casper's case,
 * 2026-11-18).
 */
export type TreeNode = {
  key: string
  /** The instance, for Go to */
  id: string
  name: string
  /** Its main component's name, or the component set's for a variant */
  component?: string
  /** The instance or a layer above it is hidden */
  hidden?: true
  /** It sits in slot content the instance above owns */
  inSlot?: true
  /** For such an instance: the name of the slot, such as Content */
  slotName?: string
  /**
   * What the row is when it is not an instance: the frame, main component
   * or loose layers of the scan that the instances at the top are in
   */
  kind?: EntrySummary['kind']
  /**
   * The row is a page: the instances below sit on its canvas, not in a frame
   * or section, so the row is named after the page and has the page icon
   */
  page?: true
  /** The layers Go to selects, when not the row's own id */
  goTo?: string[]
  /** Legacy values in it and the instances below */
  count: number
  /** Of `count`: values on hidden layers */
  hiddenCount: number
  /** Of `count`: values on its own layers */
  own: number
  children: TreeNode[]
}

function fromTree(tree: InstanceTree, key: string): TreeNode {
  return {
    key,
    id: tree.id,
    name: tree.name,
    ...(tree.component ? { component: tree.component } : {}),
    ...(tree.hidden ? { hidden: true as const } : {}),
    ...(tree.slot ? { inSlot: true as const } : {}),
    ...(tree.slotName ? { slotName: tree.slotName } : {}),
    count: tree.count,
    hiddenCount: tree.hiddenCount,
    own: tree.own,
    children: tree.children.map((child) => fromTree(child, child.id)),
  }
}

/**
 * The instances of the Instances tab as a forest: each instance with its
 * tree, and an instance in slot content another instance owns put under that
 * instance, whose counts then include it. An instance whose owner has no
 * legacy values of its own gets the owner as a node of its own, so it is
 * still shown where it is.
 */
export function instanceForest(instances: OldInstance[]): TreeNode[] {
  const roots: TreeNode[] = []
  const byId = new Map<string, TreeNode>()
  const index = (node: TreeNode) => {
    byId.set(node.id, node)
    node.children.forEach(index)
  }
  const nodeOf = (instance: OldInstance): TreeNode =>
    instance.tree
      ? fromTree(instance.tree, instance.id)
      : {
          key: instance.id,
          id: instance.id,
          name: instance.name,
          ...(instance.mainComponent
            ? { component: instance.mainComponent.name }
            : {}),
          ...(instance.hidden ? { hidden: true as const } : {}),
          count: instance.count,
          hiddenCount: 0,
          own: instance.count,
          children: [],
        }
  const nested: [TreeNode, NonNullable<OldInstance['within']>][] = []
  for (const instance of instances) {
    const node = nodeOf(instance)
    index(node)
    if (instance.within) nested.push([node, instance.within])
    else roots.push(node)
  }
  // Ancestors of each node, to add a nested instance's counts to them.
  const parents = new Map<string, TreeNode>()
  const link = (node: TreeNode) => {
    for (const child of node.children) {
      parents.set(child.id, node)
      link(child)
    }
  }
  roots.forEach(link)
  for (const [node, within] of nested) {
    let owner = byId.get(within.id)
    if (!owner) {
      owner = {
        key: within.id,
        id: within.id,
        name: within.name,
        count: 0,
        hiddenCount: 0,
        own: 0,
        children: [],
      }
      byId.set(owner.id, owner)
      roots.push(owner)
    }
    owner.children.push({ ...node, inSlot: true })
    parents.set(node.id, owner)
    link(node)
    for (let at: TreeNode | undefined = owner; at; at = parents.get(at.id)) {
      at.count += node.count
      at.hiddenCount += node.hiddenCount
    }
  }
  return roots
}

/**
 * The tree of the Instances tab, as Figma's Layers panel shows it: the
 * frames, main components and loose layers of the scan in their order, each
 * with the instances in it, in layer order.
 */
export function entryForest(
  instances: OldInstance[],
  entries: EntrySummary[],
): TreeNode[] {
  const roots = instanceForest(instances)
  const entryOf = new Map(instances.map((item) => [item.id, item.entryId]))
  // An owner made for slot content has the entry of the instances in it.
  const entryIn = (node: TreeNode): string | undefined =>
    entryOf.get(node.id) ??
    node.children.map(entryIn).find((entryId) => entryId !== undefined)
  const byEntry = new Map<string, TreeNode[]>()
  for (const root of roots) {
    const entryId = entryIn(root) ?? ''
    byEntry.set(entryId, [...(byEntry.get(entryId) ?? []), root])
  }
  const known = new Set(entries.map((entry) => entry.id))
  const result: TreeNode[] = []
  for (const entry of entries) {
    const children = byEntry.get(entry.id)
    if (!children) continue
    // Loose layers on the canvas are named after their page, in a section
    // after the section.
    const onCanvas = entry.kind === 'loose' && entry.sections.length === 0
    const name =
      entry.kind === 'loose'
        ? (entry.sections[entry.sections.length - 1] ?? entry.pageName)
        : entry.name
    result.push({
      key: `entry:${entry.id}`,
      id: entry.id,
      name,
      kind: entry.kind,
      ...(onCanvas ? { page: true as const } : {}),
      goTo: entry.nodeIds,
      count: children.reduce((sum, child) => sum + child.count, 0),
      hiddenCount: children.reduce((sum, child) => sum + child.hiddenCount, 0),
      own: 0,
      children,
    })
  }
  // Instances whose entry is not in the summary stay at the top.
  for (const [entryId, children] of byEntry) {
    if (!known.has(entryId)) result.push(...children)
  }
  return result
}
