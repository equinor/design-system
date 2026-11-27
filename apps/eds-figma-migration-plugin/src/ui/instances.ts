/** Instances that still use legacy variables, grouped by main component. */
import type {
  BindingRecord,
  ComponentInstance,
  ComponentSource,
  EntrySummary,
  InstanceStep,
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
 * put under it (`OldInstance.within`), so a panel component shows the Text
 * Fields and Switches in its slot (a panel component pasted from another
 * file, 2026-11-18).
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
  /**
   * For an instance listed on the Instances tab, not one inside it: the key
   * of its main component, to show where its values can be fixed
   */
  componentKey?: string
  /** Legacy values in it and the instances below */
  count: number
  /** Of `count`: values on hidden layers */
  hiddenCount: number
  /** Of `count`: values on its own layers */
  own: number
  /** Of `count`, in a frame's Layers view: values the instance overrides */
  overridden?: number
  /** Of `own`, in a frame's Layers view: values the instance overrides */
  ownOverridden?: number
  /** In a frame's Layers view: the layers of the values on its own layers, for their Go to */
  ownIds?: string[]
  /**
   * In a frame's Layers view: the values on layers in slot content the
   * instance owns that are not in an instance there, such as a frame in the
   * slot, per slot (`BindingRecord.slotName`)
   */
  slotValues?: SlotValues[]
  children: TreeNode[]
}

/** The values on the layers of one slot that are not in an instance there */
export type SlotValues = {
  slot: string
  own: number
  ownIds: string[]
}

/** The key of the row for a slot, to open it from outside and to find its values. */
export function slotKeyOf(parentKey: string, slot: string): string {
  return `${parentKey}:slot:${slot}`
}

/** A row with instances or slot content below it, not only values of its own */
export function hasInner(node: TreeNode): boolean {
  return node.children.length > 0 || (node.slotValues?.length ?? 0) > 0
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
  const nodeOf = (instance: OldInstance): TreeNode => ({
    ...nodeOfTree(instance),
    ...(instance.mainComponent
      ? { componentKey: instance.mainComponent.key }
      : {}),
  })
  const nodeOfTree = (instance: OldInstance): TreeNode =>
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

/**
 * The values in one instance of a frame and in the instances inside it, for
 * the frame's Layers view: the tree of the Instances tab with the values as
 * its leaves, one level per instance in the chain each value records. `own`
 * gives the values on each node's own layers by its key, and the values on
 * layers in a slot it owns that are not in an instance there by the slot's
 * key (`slotKeyOf`), the ones an instance overrides first. A value from a
 * fixture made before chains were recorded counts on the top instance's own
 * layers. Found on 2026-11-18, on a panel component pasted from another
 * file: the frame listed the panel's 638 values, and those of the 12
 * instances in its slot, in flat lists of one group per instance, and the
 * frames in the slot as layers of the frame.
 */
export function valueTree(
  top: InstanceStep,
  records: BindingRecord[],
): { root: TreeNode; own: Map<string, BindingRecord[]> } {
  const nodeOf = (step: InstanceStep, key: string): TreeNode => ({
    key,
    id: step.id,
    name: step.name,
    ...(step.component ? { component: step.component } : {}),
    ...(step.hidden ? { hidden: true as const } : {}),
    ...(step.slot ? { inSlot: true as const } : {}),
    ...(step.slotName ? { slotName: step.slotName } : {}),
    count: 0,
    hiddenCount: 0,
    own: 0,
    overridden: 0,
    ownOverridden: 0,
    children: [],
  })
  const root = nodeOf(top, top.id)
  const own = new Map<string, BindingRecord[]>()
  const ids = new Map<string, Set<string>>()
  const add = (key: string, record: BindingRecord) => {
    own.set(key, [...(own.get(key) ?? []), record])
    ids.set(key, (ids.get(key) ?? new Set()).add(record.nodeId))
  }
  for (const record of records) {
    const chain = record.instances ?? []
    const at = chain.findIndex((step) => step.id === top.id)
    let node = root
    const count = (target: TreeNode) => {
      target.count += 1
      if (record.hidden) target.hiddenCount += 1
      if (record.override) target.overridden = (target.overridden ?? 0) + 1
    }
    count(node)
    for (const step of at === -1 ? [] : chain.slice(at + 1)) {
      let child = node.children.find((item) => item.id === step.id)
      if (!child) {
        child = nodeOf(step, `${node.key}/${step.id}`)
        node.children.push(child)
      }
      node = child
      count(node)
    }
    // A layer in slot content the instance owns, outside the instances
    // there, is under the slot, as in Figma's Layers panel.
    if (record.slotName && record.instanceId === undefined) {
      const slot = record.slotName
      node.slotValues ??= []
      let values = node.slotValues.find((item) => item.slot === slot)
      if (!values) {
        values = { slot, own: 0, ownIds: [] }
        node.slotValues.push(values)
      }
      values.own += 1
      add(slotKeyOf(node.key, slot), record)
      continue
    }
    node.own += 1
    if (record.override) node.ownOverridden = (node.ownOverridden ?? 0) + 1
    add(node.key, record)
  }
  for (const list of own.values()) {
    list.sort((a, b) => Number(!a.override) - Number(!b.override))
  }
  const withIds = (node: TreeNode) => {
    const found = ids.get(node.key)
    if (found) node.ownIds = [...found]
    for (const values of node.slotValues ?? []) {
      values.ownIds = [...(ids.get(slotKeyOf(node.key, values.slot)) ?? [])]
    }
    node.children.forEach(withIds)
  }
  withIds(root)
  return { root, own }
}

/**
 * The sources the Instances tab knows: those the check found, by main
 * component key, and the main components in this file, which need no check.
 */
export function knownSources(
  instances: OldInstance[],
  checked: ReadonlyMap<string, ComponentSource>,
): Map<string, ComponentSource> {
  const known = new Map(checked)
  for (const instance of instances) {
    const main = instance.mainComponent
    if (main && !main.remote) known.set(main.key, { kind: 'this-file' })
  }
  return known
}

/** One main component in Where to fix them, with the instances of it on the tab. */
export type SourceComponent = {
  key: string
  name: string
  source: ComponentSource
  instanceIds: string[]
  /** Legacy values the instances take from it */
  count: number
}

export type SourceGroup = {
  kind: ComponentSource['kind']
  components: SourceComponent[]
}

const SOURCE_ORDER: ComponentSource['kind'][] = [
  'update',
  'library',
  'this-file',
  'no-library',
  'failed',
]

/**
 * Where to fix them, on the Instances tab: the main components of the
 * instances, grouped by what fixes their legacy values, a library update
 * first, since it fixes them all in Figma without migrating anything, and in
 * a group the components with the most values first. Instances whose source
 * is not known yet are left out.
 */
export function sourceGroups(
  instances: OldInstance[],
  sources: ReadonlyMap<string, ComponentSource>,
): SourceGroup[] {
  const byKey = new Map<string, SourceComponent>()
  for (const instance of instances) {
    const main = instance.mainComponent
    const source = main && sources.get(main.key)
    if (!main || !source) continue
    let component = byKey.get(main.key)
    if (!component) {
      component = {
        key: main.key,
        name: main.name,
        source,
        instanceIds: [],
        count: 0,
      }
      byKey.set(main.key, component)
    }
    component.instanceIds.push(instance.id)
    component.count += instance.count
  }
  return SOURCE_ORDER.flatMap((kind) => {
    const components = [...byKey.values()]
      .filter((component) => component.source.kind === kind)
      .sort((a, b) => b.count - a.count)
    return components.length > 0 ? [{ kind, components }] : []
  })
}

/** How far the source check is (src/plugin/scan/sources.ts) */
export type SourceCheck = {
  done: number
  total: number
  running: boolean
  /** The key of the main component being checked */
  current?: string
  /** The keys the last check answered, in order */
  checked: string[]
  /** Checks finished so far, to open the results of the last one */
  runs: number
  /** Stop was pressed, and the plugin has not answered yet */
  stopping?: boolean
  /** The check ended before the last main component */
  stopped?: boolean
}

const SUMMARY_ORDER: ComponentSource['kind'][] = [
  'update',
  'library',
  'no-library',
  'failed',
]

/** At most this many main components are named in a part of the summary */
const SUMMARY_NAMES = 3

const SUMMARY_PARTS: Record<ComponentSource['kind'], string> = {
  update: 'with a library update',
  library: 'current in its library',
  'this-file': 'in this file',
  'no-library': 'not in a library',
  failed: 'not checked',
}

/**
 * What the last check found, in one line under its button, so the designer
 * sees that it ran and what changed (2026-11-20: in the app the imports were
 * so quick that the count went from 0 to done, and the groups it filled were
 * closed).
 */
export function checkSummary(
  check: SourceCheck,
  sources: ReadonlyMap<string, ComponentSource>,
  /** The main components' names, by key, to name a few */
  names: ReadonlyMap<string, string> = new Map(),
): string {
  if (check.total === 0) {
    return 'No library components to check: every main component here is in this file.'
  }
  const byKind = new Map<ComponentSource['kind'], string[]>()
  for (const key of check.checked) {
    const kind = sources.get(key)?.kind
    if (kind) byKind.set(kind, [...(byKind.get(kind) ?? []), key])
  }
  // A few main components are named, so the designer sees which one is not
  // in a library without opening its group (2026-11-20).
  const parts = SUMMARY_ORDER.flatMap((kind) => {
    const keys = byKind.get(kind) ?? []
    if (keys.length === 0) return []
    const part = `${keys.length} ${SUMMARY_PARTS[kind]}`
    const named = keys.map((key) => names.get(key)).filter(Boolean)
    return [
      keys.length <= SUMMARY_NAMES && named.length === keys.length
        ? `${part} (${named.join(', ')})`
        : part,
    ]
  })
  const checked = check.checked.length
  const lead = check.stopped
    ? `Stopped after ${checked} of ${check.total}`
    : `Checked ${checked} library component${checked === 1 ? '' : 's'}`
  return parts.length > 0 ? `${lead}: ${parts.join(', ')}.` : `${lead}.`
}
