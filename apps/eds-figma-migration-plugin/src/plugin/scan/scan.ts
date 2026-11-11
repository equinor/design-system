/**
 * Runs a scan of the current page or the whole file: loads each page, splits
 * it into entries (top-level frames, the frames in sections, loose layers and
 * local components), collects the raw units and classifies them.
 */
import { OLD_COLLECTION_KEYS, OLD_DENSITY_KEY } from '../../mapping/old-keys'
import { MAPPING_VERSION } from '../../mapping/version'
import { classifyUnits } from '../../scan/classify'
import { healthOf, summariseEntries, sumCounts } from '../../scan/summary'
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

export async function runScan(
  scope: Scope,
  onProgress: (progress: ScanProgress) => void,
  isCancelled: () => boolean,
): Promise<ScanState> {
  // Hidden layers inside instances are skipped when this is true, and a scan
  // must see them.
  figma.skipInvisibleInstanceChildren = false

  const pages =
    scope === 'page' ? [figma.currentPage] : [...figma.root.children]
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

  async function collectContainer(
    container: PageNode | SectionNode,
    page: PageNode,
    sections: string[],
    modes: Modes,
  ) {
    const loose: SceneNode[] = []
    for (const child of container.children) {
      if (child.type === 'SECTION') {
        await collectContainer(child, page, [...sections, child.name], {
          ...modes,
          ...explicitModes(child),
        })
      } else if (
        child.type === 'FRAME' ||
        child.type === 'COMPONENT' ||
        child.type === 'COMPONENT_SET'
      ) {
        const kind = child.type === 'FRAME' ? 'frame' : 'component'
        addEntry(
          {
            id: child.id,
            kind,
            name: child.name,
            sections,
            nodeIds: [child.id],
          },
          page,
        )
        await collector.collectEntry(
          [child],
          child.id,
          modes,
          kind === 'component',
        )
        await collectNestedComponents(page, sections)
      } else {
        loose.push(child)
      }
    }
    if (loose.length > 0) {
      const id = `loose:${container.id}`
      addEntry(
        {
          id,
          kind: 'loose',
          name: LOOSE_NAME,
          sections,
          nodeIds: loose.map((node) => node.id),
        },
        page,
      )
      await collector.collectEntry(loose, id, modes)
      await collectNestedComponents(page, sections)
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
    await collectContainer(page, page, [], explicitModes(page))
    pageIndex += 1
  }

  const records = classifyUnits(collector.units)
  const oldInstances = await findOldInstances(collector, records)
  const summaries = summariseEntries(entries, records, oldInstances)
  const scored = summaries.filter((entry) => entry.kind !== 'component')
  const totals = sumCounts(scored.map((entry) => entry.counts))

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
        }
      }
    }
    result.push(instance)
  }
  return result
}
