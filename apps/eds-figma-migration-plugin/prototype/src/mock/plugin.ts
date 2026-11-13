/**
 * Stands in for the plugin main thread (src/plugin/code.ts) in the browser:
 * answers the window's messages from the mock file in data.ts, with the
 * plugin's own pure code for counting, mapping, choices, the apply plan and
 * the report. The document storage is the browser's localStorage.
 */
import { MAPPING_VERSION } from '../../../src/mapping/version'
import {
  modesToKeep,
  parseModeTarget,
  planChanges,
} from '../../../src/scan/apply-plan'
import { propertyLabel } from '../../../src/scan/labels'
import {
  buildMappingGroups,
  effectiveCategory,
  isMappable,
} from '../../../src/scan/mapping'
import type { Overrides } from '../../../src/scan/mapping'
import { buildReport } from '../../../src/scan/report'
import {
  healthOf,
  recount,
  summariseEntries,
  totalsOf,
} from '../../../src/scan/summary'
import type {
  BindingRecord,
  OldInstance,
  ScanSummary,
} from '../../../src/scan/types'
import type {
  ApplyResult,
  ChangeFailure,
  PluginToUi,
  SavedHealth,
  Scope,
  UiToPlugin,
} from '../../../src/shared/messages'
import { buildWorld } from './data'
import type { MockEntry, World } from './data'

const STORE = 'eds-migration-prototype'

type Scan = {
  summary: ScanSummary
  records: BindingRecord[]
  oldInstances: OldInstance[]
}

type Target = { scope: Scope; pageId: string; nodeIds: string[] }

type Change = {
  entryId: string
  nodeId: string
  /** The record before the change; undefined for a record the apply added */
  before?: BindingRecord
  /** The id of the record after the change; undefined when it was removed */
  after?: string
}

export type ShellEvents = {
  onSelect: (nodeIds: string[], label: string) => void
  onPage: (pageId: string) => void
  onNotify: (message: string) => void
  onResize: (width: number, height: number) => void
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MockPlugin {
  world: World = buildWorld()
  selection: string[]
  pageId: string
  private overrides: Overrides
  private lastScan?: Scan
  private lastTarget?: Target
  private changes: Change[] = []
  private busy = false
  private cancel = false

  constructor(
    private readonly post: (message: PluginToUi) => void,
    private readonly shell: ShellEvents,
  ) {
    this.selection = [this.world.entries[0].id]
    this.pageId = this.world.pages[0].id
    this.overrides = this.load<Overrides>('choices') ?? {
      records: {},
      rows: {},
    }
  }

  // --- Storage, as the document's shared plugin data

  private load<T>(key: string): T | undefined {
    try {
      const raw = localStorage.getItem(`${STORE}:${key}`)
      return raw ? (JSON.parse(raw) as T) : undefined
    } catch {
      return undefined
    }
  }

  private save(key: string, value: unknown) {
    localStorage.setItem(`${STORE}:${key}`, JSON.stringify(value))
  }

  reset() {
    for (const key of ['choices', 'health']) {
      localStorage.removeItem(`${STORE}:${key}`)
    }
    this.world = buildWorld()
    this.overrides = { records: {}, rows: {} }
    this.lastScan = undefined
    this.lastTarget = undefined
    this.changes = []
    this.selection = [this.world.entries[0].id]
    this.pageId = this.world.pages[0].id
  }

  // --- Canvas

  selectionLabel(ids = this.selection): string {
    if (ids.length === 0) return 'Nothing selected'
    const first = this.world.names.get(ids[0]) ?? ids[0]
    return ids.length === 1 ? first : `${first} and ${ids.length - 1} more`
  }

  postSelection() {
    this.post({
      type: 'selection',
      count: this.selection.length,
      firstName: this.selection.length
        ? this.world.names.get(this.selection[0])
        : undefined,
    })
  }

  setSelection(ids: string[]) {
    this.selection = ids
    this.shell.onSelect(ids, this.selectionLabel(ids))
    this.postSelection()
  }

  setPage(pageId: string) {
    this.pageId = pageId
    this.shell.onPage(pageId)
  }

  private pageOf(nodeId: string): string | undefined {
    const record = this.world.records.find((r) => r.nodeId === nodeId)
    const entryId =
      record?.entryId ??
      this.world.entries.find((entry) => entry.nodeIds.includes(nodeId))?.id ??
      this.world.oldInstances.find((instance) => instance.id === nodeId)
        ?.entryId
    return this.world.entries.find((entry) => entry.id === entryId)?.pageId
  }

  // --- Scanning

  private entriesFor(target: Target): {
    entries: MockEntry[]
    records: BindingRecord[]
  } {
    const { world } = this
    if (target.scope === 'selection') {
      const entries: MockEntry[] = []
      const records: BindingRecord[] = []
      for (const id of target.nodeIds) {
        const root = world.entries.find((entry) => entry.nodeIds.includes(id))
        if (root) {
          entries.push(root)
          records.push(...world.records.filter((r) => r.entryId === root.id))
          continue
        }
        // A layer inside a frame: the layer and everything below it.
        const name = world.names.get(id) ?? id
        const own = world.records.find((r) => r.nodeId === id)
        if (!own) continue
        const parent = world.entries.find((entry) => entry.id === own.entryId)
        const entry: MockEntry = {
          id,
          kind: 'frame',
          name,
          pageId: parent?.pageId ?? this.pageId,
          pageName: parent?.pageName ?? '',
          sections: parent?.sections ?? [],
          nodeIds: [id],
        }
        entries.push(entry)
        records.push(
          ...world.records
            .filter(
              (r) =>
                r.entryId === own.entryId &&
                (r.nodeId === id || r.path.includes(name)),
            )
            .map((r) => ({ ...r, entryId: id })),
        )
      }
      return { entries, records }
    }
    const pageIds =
      target.scope === 'file'
        ? world.pages.map((page) => page.id)
        : [target.pageId]
    const entries = world.entries.filter((entry) =>
      pageIds.includes(entry.pageId),
    )
    const ids = new Set(entries.map((entry) => entry.id))
    return {
      entries,
      records: world.records.filter((r) => ids.has(r.entryId)),
    }
  }

  private withChoices(scan: Scan): Scan {
    const overrides = this.overrides
    return {
      ...scan,
      summary: recount(scan.summary, scan.records, scan.oldInstances, (r) =>
        effectiveCategory(r, overrides),
      ),
    }
  }

  private async scan(target: Target) {
    if (this.busy) return
    if (target.scope === 'selection' && target.nodeIds.length === 0) {
      this.post({
        type: 'error',
        message: 'Select one or more frames, then scan again.',
      })
      return
    }
    this.busy = true
    this.cancel = false
    try {
      const pages =
        target.scope === 'file'
          ? this.world.pages
          : this.world.pages.filter((page) => page.id === target.pageId)
      for (const [index, page] of pages.entries()) {
        this.post({
          type: 'scan-progress',
          progress: {
            pageName: page.name,
            pageIndex: index,
            pageCount: pages.length,
            nodes: (index + 1) * 66,
          },
        })
        await wait(target.scope === 'file' ? 450 : 250)
        if (this.cancel) {
          this.post({ type: 'scan-cancelled' })
          return
        }
      }
      const { entries, records } = this.entriesFor(target)
      const ids = new Set(entries.map((entry) => entry.id))
      const oldInstances = this.world.oldInstances.filter((instance) =>
        ids.has(instance.entryId),
      )
      const changed = new Map<string, Set<string>>()
      for (const change of this.changes) {
        const set = changed.get(change.entryId) ?? new Set<string>()
        set.add(change.nodeId)
        changed.set(change.entryId, set)
      }
      const summaries = summariseEntries(
        entries.map((entry) => ({
          id: entry.id,
          kind: entry.kind,
          name: entry.name,
          pageId: entry.pageId,
          pageName: entry.pageName,
          sections: entry.sections,
          nodeIds: entry.nodeIds,
          changed: changed.get(entry.id)?.size ?? 0,
          instanceCount: entry.instanceCount,
        })),
        records,
        oldInstances,
      )
      const totals = totalsOf(summaries)
      const summary: ScanSummary = {
        scope: target.scope,
        scannedAt: new Date().toISOString(),
        mappingVersion: MAPPING_VERSION,
        pages:
          target.scope === 'file'
            ? this.world.pages
            : this.world.pages.filter((page) => page.id === target.pageId),
        nodesScanned: records.length + entries.length * 12,
        totals,
        health: healthOf(totals),
        entries: summaries,
      }
      this.lastTarget = target
      this.lastScan = this.withChoices({ summary, records, oldInstances })
      this.saveHealth(this.lastScan.summary)
      this.post({ type: 'scan-done', summary: this.lastScan.summary })
      this.post({ type: 'mapping', groups: buildMappingGroups(records) })
      this.post({ type: 'instances', instances: oldInstances })
      this.post({ type: 'overrides', overrides: this.overrides })
    } finally {
      this.busy = false
    }
  }

  private saveHealth(summary: ScanSummary) {
    const place =
      summary.scope === 'file'
        ? 'The whole file'
        : summary.scope === 'page'
          ? `Page ${summary.pages[0]?.name ?? ''}`
          : `Selection on ${summary.pages[0]?.name ?? ''}`
    const saved: SavedHealth = {
      scannedAt: summary.scannedAt,
      place,
      nodesScanned: summary.nodesScanned,
      totals: summary.totals,
      health: summary.health,
      frames: summary.entries
        .filter((entry) => entry.kind !== 'component' && entry.health !== null)
        .sort((a, b) => (a.health ?? 0) - (b.health ?? 0))
        .slice(0, 20)
        .map((entry) => ({
          name: entry.name,
          pageName: entry.pageName,
          health: entry.health,
        })),
    }
    this.save('health', saved)
  }

  // --- Apply and revert, on the mock records

  private replace(id: string, next: BindingRecord | undefined) {
    const index = this.world.records.findIndex((r) => r.id === id)
    if (index === -1) return
    if (next) this.world.records[index] = next
    else this.world.records.splice(index, 1)
  }

  private async apply(entryIds: string[]) {
    if (!this.lastScan || !this.lastTarget || this.busy) return
    this.busy = true
    const plan = planChanges(
      this.lastScan.records,
      this.overrides,
      new Set(entryIds),
    )
    const changed = new Set<string>()
    const layers = new Set<string>()
    const failed: ChangeFailure[] = []
    let modesKept = 0
    let done = 0
    const step = async () => {
      done += 1
      if (done % 25 === 0) {
        this.post({ type: 'apply-progress', done, total: plan.length })
        await wait(60)
      }
    }
    const worldEntry = (record: BindingRecord) =>
      this.world.records.find((candidate) => candidate.id === record.id)
        ?.entryId ?? record.entryId

    for (const change of plan.filter(
      (candidate) => candidate.record.property.type !== 'mode',
    )) {
      const { record, target } = change
      const before = this.world.records.find((r) => r.id === record.id)
      if (!before) {
        failed.push({
          nodeId: record.nodeId,
          nodeName: record.nodeName,
          property: propertyLabel(record.property),
          message: 'The layer has changed since the scan. Scan again.',
        })
        continue
      }
      this.replace(record.id, {
        ...before,
        category: 'migrated',
        current: target,
        candidates: undefined,
        outcome: undefined,
        reason: undefined,
      })
      this.changes.push({
        entryId: before.entryId,
        nodeId: before.nodeId,
        before,
        after: before.id,
      })
      changed.add(record.id)
      layers.add(record.nodeId)
      await step()
    }

    const keep = modesToKeep(this.lastScan.records, changed)
    for (const change of plan.filter(
      (candidate) => candidate.record.property.type === 'mode',
    )) {
      const { record, target } = change
      const before = this.world.records.find((r) => r.id === record.id)
      if (!before || !before.oldMode) continue
      const mustKeep = keep.has(
        `${record.nodeId}|${before.oldMode.collectionKey}`,
      )
      const parsed = parseModeTarget(target)
      const entryId = worldEntry(record)
      if (parsed) {
        const added: BindingRecord = {
          ...before,
          id: `${before.nodeId}|mode:new:${parsed.collection}`,
          category: 'migrated',
          current: `${parsed.collection}: ${parsed.mode}`,
          candidates: undefined,
          outcome: undefined,
          reason: undefined,
          oldMode: undefined,
        }
        this.world.records.push(added)
        this.changes.push({ entryId, nodeId: before.nodeId, after: added.id })
      }
      if (mustKeep) {
        modesKept += 1
        if (parsed) {
          this.replace(before.id, {
            ...before,
            category: 'none',
            outcome: 'none',
            candidates: [],
            rule: 'mode/kept',
            reason:
              'The legacy mode stays while layers below use legacy variables that are not changed, inside instances or with no equivalent.',
          })
          this.changes.push({
            entryId,
            nodeId: before.nodeId,
            before,
            after: before.id,
          })
        }
      } else {
        this.replace(before.id, undefined)
        this.changes.push({ entryId, nodeId: before.nodeId, before })
      }
      if (parsed || !mustKeep) {
        changed.add(record.id)
        layers.add(record.nodeId)
      }
      await step()
    }

    const appliedRecords = plan.filter((change) =>
      changed.has(change.record.id),
    )
    const modeCount = appliedRecords.filter(
      (change) => change.record.property.type === 'mode',
    ).length
    const numberCount = appliedRecords.filter((change) =>
      String(change.target ?? '').startsWith('value:'),
    ).length
    const result: ApplyResult = {
      planned: plan.length,
      applied: changed.size,
      values: changed.size - modeCount - numberCount,
      numbers: numberCount,
      modes: modeCount,
      layers: layers.size,
      modesKept,
      resets: 0,
      failedFixes: [],
      failed,
    }
    this.busy = false
    this.post({ type: 'apply-progress', done: plan.length, total: plan.length })
    await wait(150)
    this.post({ type: 'apply-done', result })
    await this.scan(this.lastTarget)
  }

  private async revert(entryId: string) {
    if (!this.lastTarget || this.busy) return
    this.busy = true
    const mine = this.changes.filter((change) => change.entryId === entryId)
    const layers = new Set(mine.map((change) => change.nodeId))
    for (const change of [...mine].reverse()) {
      if (change.after) this.replace(change.after, undefined)
      if (change.before) {
        this.world.records.push(change.before)
      }
    }
    this.changes = this.changes.filter((change) => change.entryId !== entryId)
    await wait(400)
    this.busy = false
    this.post({
      type: 'revert-done',
      result: {
        reverted: mine.filter((change) => change.before).length,
        layers: layers.size,
        failed: [],
      },
    })
    await this.scan(this.lastTarget)
  }

  // --- Messages from the window

  async handle(message: UiToPlugin) {
    switch (message.type) {
      case 'ready': {
        this.post({
          type: 'init',
          command: 'open',
          mappingVersion: MAPPING_VERSION,
          fileName: this.world.fileName,
          currentPageName:
            this.world.pages.find((page) => page.id === this.pageId)?.name ??
            '',
        })
        this.postSelection()
        const saved = this.load<SavedHealth>('health')
        if (saved) this.post({ type: 'saved-health', saved })
        break
      }
      case 'scan':
        await this.scan({
          scope: message.scope,
          pageId: this.pageId,
          nodeIds: this.selection,
        })
        break
      case 'cancel-scan':
        this.cancel = true
        break
      case 'get-entry':
        if (this.lastScan) {
          this.post({
            type: 'entry-detail',
            entryId: message.entryId,
            records: this.lastScan.records.filter(
              (r) => r.entryId === message.entryId,
            ),
            oldInstances: this.lastScan.oldInstances.filter(
              (instance) => instance.entryId === message.entryId,
            ),
          })
        }
        break
      case 'select': {
        const page = this.pageOf(message.nodeIds[0] ?? '')
        if (page && page !== this.pageId) this.setPage(page)
        this.setSelection(message.nodeIds)
        break
      }
      case 'go-to-page':
        this.setPage(message.pageId)
        this.setSelection([])
        break
      case 'select-old':
        if (this.lastScan) {
          this.setSelection([
            ...new Set(
              this.lastScan.records
                .filter((r) => r.oldKey === message.oldKey && isMappable(r))
                .map((r) => r.nodeId),
            ),
          ])
        }
        break
      case 'set-overrides': {
        const records = { ...this.overrides.records }
        const rows = { ...this.overrides.rows }
        for (const { target, value } of message.changes) {
          const map = target.type === 'record' ? records : rows
          const key = target.type === 'record' ? target.id : target.key
          if (value === undefined) delete map[key]
          else map[key] = value
        }
        this.overrides = { records, rows }
        this.save('choices', this.overrides)
        this.post({ type: 'overrides', overrides: this.overrides })
        if (this.lastScan) {
          this.lastScan = this.withChoices(this.lastScan)
          this.post({ type: 'summary', summary: this.lastScan.summary })
        }
        break
      }
      case 'apply':
        await this.apply(message.entryIds)
        break
      case 'revert':
        await this.revert(message.entryId)
        break
      case 'get-report':
        if (this.lastScan) {
          this.post({
            type: 'report',
            report: buildReport({
              fileName: this.world.fileName,
              summary: this.lastScan.summary,
              records: this.lastScan.records,
              oldInstances: this.lastScan.oldInstances,
              overrides: this.overrides,
            }),
          })
        }
        break
      case 'notify':
        this.shell.onNotify(message.message)
        break
      case 'resize':
        this.shell.onResize(message.width, message.height)
        break
      default:
        break
    }
  }
}
