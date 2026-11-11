/**
 * Runs a scan of the current page or the whole file: loads each page, splits
 * it into entries (top-level frames, the frames in sections, loose layers and
 * local components), collects the raw units and classifies them.
 */
import { OLD_COLLECTION_KEYS, OLD_DENSITY_KEY } from '../../mapping/old-keys'
import { MAPPING_VERSION } from '../../mapping/version'
import { classifyUnits } from '../../scan/classify'
import { healthOf, summariseEntries, totalsOf } from '../../scan/summary'
import type { EntryMeta } from '../../scan/summary'
import type {
  BindingRecord,
  OldInstance,
  RawUnit,
  ScanSummary,
} from '../../scan/types'
import type { ScanProgress, Scope } from '../../shared/messages'
import { Collector, explicitModes } from './collect'
import type { Modes } from './collect'

export type ScanState = {
  summary: ScanSummary
  records: BindingRecord[]
  oldInstances: OldInstance[]
  units: RawUnit[]
}

const LOOSE_NAME = 'Loose layers'

/** What a scan covers, so the plugin can scan the same layers again after an apply. */
export type ScanTarget = {
  scope: Scope
  pageId: string
  /** The selected layers, for a scan of the selection */
  nodeIds: string[]
}

/** The scope as it is now: the current page and the current selection. */
export function currentTarget(scope: Scope): ScanTarget {
  return {
    scope,
    pageId: figma.currentPage.id,
    nodeIds: figma.currentPage.selection.map((node) => node.id),
  }
}

export async function runScan(
  target: ScanTarget,
  onProgress: (progress: ScanProgress) => void,
  isCancelled: () => boolean,
): Promise<ScanState> {
  // Hidden layers inside instances are skipped when this is true, and a scan
  // must see them.
  figma.skipInvisibleInstanceChildren = false

  const { scope } = target
  const targetPage = await figma.getNodeByIdAsync(target.pageId)
  const scopePage = targetPage?.type === 'PAGE' ? targetPage : figma.currentPage
  const pages = scope === 'file' ? [...figma.root.children] : [scopePage]
  const selected: SceneNode[] = []
  if (scope === 'selection') {
    for (const id of target.nodeIds) {
      const node = await figma.getNodeByIdAsync(id)
      if (
        node &&
        !node.removed &&
        node.type !== 'PAGE' &&
        node.type !== 'DOCUMENT'
      ) {
        selected.push(node as SceneNode)
      }
    }
    if (selected.length === 0) {
      throw new Error('Select one or more frames, then scan again.')
    }
  }
  const entries: EntryMeta[] = []
  let pageIndex = 0
  let currentPage = pages[0]

  const collector = new Collector({
    densityKey: OLD_DENSITY_KEY,
    oldKeys: OLD_COLLECTION_KEYS,
    onProgress: async (nodes) => {
      onProgress({
        pageName: currentPage.name,
        pageIndex,
        pageCount: pages.length,
        nodes,
      })
      // Gives the window a moment to send a cancel.
      await new Promise((resolve) => setTimeout(resolve, 0))
      return isCancelled()
    },
  })

  const addEntry = (
    meta: Omit<EntryMeta, 'pageId' | 'pageName'>,
    page: PageNode,
  ) => entries.push({ ...meta, pageId: page.id, pageName: page.name })

  async function collectNestedComponents(page: PageNode, sections: string[]) {
    while (collector.nestedComponents.length > 0) {
      const found = collector.nestedComponents.shift()
      if (!found) break
      addEntry(
        {
          id: found.node.id,
          kind: 'component',
          name: found.node.name,
          sections,
          nodeIds: [found.node.id],
        },
        page,
      )
      await collector.collectEntry(
        [found.node],
        found.node.id,
        found.modes,
        true,
      )
    }
  }

  /** Splits one layer on a page or in a section into its entry. Loose layers are gathered for the caller. */
  async function collectTopLevel(
    node: SceneNode,
    page: PageNode,
    sections: string[],
    modes: Modes,
    loose: SceneNode[],
  ) {
    if (node.type === 'SECTION') {
      await collectContainer(node, page, [...sections, node.name], {
        ...modes,
        ...explicitModes(node),
      })
    } else if (
      node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'COMPONENT_SET'
    ) {
      const kind = node.type === 'FRAME' ? 'frame' : 'component'
      addEntry(
        { id: node.id, kind, name: node.name, sections, nodeIds: [node.id] },
        page,
      )
      await collector.collectEntry([node], node.id, modes, kind === 'component')
      await collectNestedComponents(page, sections)
    } else {
      loose.push(node)
    }
  }

  async function collectLoose(
    loose: SceneNode[],
    id: string,
    name: string,
    page: PageNode,
    sections: string[],
    modes: Modes,
  ) {
    if (loose.length === 0) return
    addEntry(
      {
        id,
        kind: 'loose',
        name,
        sections,
        nodeIds: loose.map((node) => node.id),
      },
      page,
    )
    await collector.collectEntry(loose, id, modes)
    await collectNestedComponents(page, sections)
  }

  async function collectContainer(
    container: PageNode | SectionNode,
    page: PageNode,
    sections: string[],
    modes: Modes,
  ) {
    const loose: SceneNode[] = []
    for (const child of container.children) {
      await collectTopLevel(child, page, sections, modes, loose)
    }
    await collectLoose(
      loose,
      `loose:${container.id}`,
      LOOSE_NAME,
      page,
      sections,
      modes,
    )
  }

  /** Scans the selected layers, each as its own entry, with the sections and modes around it. */
  async function collectSelection(page: PageNode) {
    for (const node of selected) {
      const ancestors: BaseNode[] = []
      for (
        let parent = node.parent;
        parent && parent.type !== 'PAGE';
        parent = parent.parent
      ) {
        ancestors.unshift(parent)
      }
      const sections = ancestors
        .filter((ancestor) => ancestor.type === 'SECTION')
        .map((ancestor) => ancestor.name)
      const modes = explicitModes(page)
      for (const ancestor of ancestors)
        Object.assign(modes, explicitModes(ancestor))
      const loose: SceneNode[] = []
      await collectTopLevel(node, page, sections, modes, loose)
      await collectLoose(loose, node.id, node.name, page, sections, modes)
    }
  }

  for (const page of pages) {
    currentPage = page
    onProgress({
      pageName: page.name,
      pageIndex,
      pageCount: pages.length,
      nodes: collector.nodes,
    })
    await page.loadAsync()
    if (scope === 'selection') await collectSelection(page)
    else await collectContainer(page, page, [], explicitModes(page))
    pageIndex += 1
  }

  const records = classifyUnits(collector.units)
  const oldInstances = await findOldInstances(collector, records)
  for (const entry of entries)
    entry.changed = collector.changed.get(entry.id) ?? 0
  await countInstances(entries, records)
  const summaries = summariseEntries(entries, records, oldInstances)
  const totals = totalsOf(summaries)

  return {
    summary: {
      scope,
      scannedAt: new Date().toISOString(),
      mappingVersion: MAPPING_VERSION,
      pages: pages.map((page) => ({ id: page.id, name: page.name })),
      nodesScanned: collector.nodes,
      totals,
      health: healthOf(totals),
      entries: summaries,
    },
    records,
    oldInstances,
    units: collector.units,
  }
}

/**
 * Counts the instances of each local component that still uses legacy
 * variables, since changing the main component changes all of them. Only
 * those components are counted, because finding instances can load every
 * page.
 */
async function countInstances(
  entries: EntryMeta[],
  records: BindingRecord[],
): Promise<void> {
  const legacy = new Set(
    records
      .filter((record) =>
        ['sure', 'check', 'none', 'inInstance'].includes(record.category),
      )
      .map((record) => record.entryId),
  )
  for (const entry of entries) {
    if (entry.kind !== 'component' || !legacy.has(entry.id)) continue
    const node = await figma.getNodeByIdAsync(entry.id)
    const components =
      node?.type === 'COMPONENT_SET'
        ? node.children.filter(
            (child): child is ComponentNode => child.type === 'COMPONENT',
          )
        : node?.type === 'COMPONENT'
          ? [node]
          : []
    let count = 0
    for (const component of components) {
      count += (await component.getInstancesAsync().catch(() => [])).length
    }
    entry.instanceCount = count
  }
}

/** The legacy EDS Typography component, a text in a component. */
export function isTypographyComponent(name: string): boolean {
  return /^typography$/i.test(name.trim())
}

async function findOldInstances(
  collector: Collector,
  records: BindingRecord[],
): Promise<OldInstance[]> {
  const counts = new Map<string, number>()
  for (const record of records) {
    if (record.category === 'inInstance' && record.instanceId) {
      counts.set(record.instanceId, (counts.get(record.instanceId) ?? 0) + 1)
    }
  }
  const result: OldInstance[] = []
  for (const [id, count] of counts) {
    const found = collector.instances.get(id)
    if (!found) continue
    const instance: OldInstance = { ...found, count }
    const node = await figma.getNodeByIdAsync(id)
    if (node?.type === 'INSTANCE') {
      const main = await node.getMainComponentAsync()
      if (main) {
        const set = main.parent?.type === 'COMPONENT_SET' ? main.parent : null
        instance.mainComponent = {
          name: set ? set.name : main.name,
          key: set ? set.key : main.key,
          remote: main.remote,
          ...(main.remote ? {} : { id: set ? set.id : main.id }),
        }
        if (isTypographyComponent(set ? set.name : main.name)) {
          instance.typography = true
          const text = node.findOne((child) => child.type === 'TEXT')
          if (text?.type === 'TEXT')
            instance.text = text.characters.slice(0, 60)
        }
      }
    }
    result.push(instance)
  }
  return result
}
