/**
 * Stands in for the plugin main thread (src/plugin/code.ts) in the browser:
 * answers every message the window sends, from Sample file (sample.ts), with
 * the plugin's own pure code for the rules, counting, choices, the apply
 * plan, conversions and the report. The switch over the messages is
 * exhaustive, so a new message type fails the typecheck here.
 *
 * What only Figma can do is simulated on the raw units of the file: Apply
 * puts the EDS Beta variable, number, text style or mode on the unit, Revert
 * puts the legacy unit back, and Convert replaces a Typography instance with
 * a text layer. The next scan classifies the units again, as the plugin
 * scans again after a run. Everything is held in memory, so every load
 * starts from the same file.
 */
import { isResetTarget } from '../../../src/mapping/reset'
import { MAPPING_VERSION } from '../../../src/mapping/version'
import {
  isModeChange,
  keptModeChanges,
  modeWaits,
  planChanges,
  planConversions,
  previewConversions,
  previewRun,
} from '../../../src/scan/apply-plan'
import { classifyUnits, propertyKey } from '../../../src/scan/classify'
import { conversionRecords, dropsTextCase } from '../../../src/scan/conversions'
import type { ConversionSource } from '../../../src/scan/conversions'
import { buildInstanceTree } from '../../../src/scan/instance-tree'
import {
  buildMappingGroups,
  effectiveCategory,
  isMappable,
  NO_KEPT_MODES,
  NO_OVERRIDES,
  withChanges,
  withRowChoice,
} from '../../../src/scan/mapping'
import type { KeptModes, Overrides } from '../../../src/scan/mapping'
import { buildReport } from '../../../src/scan/report'
import { remoteMainComponents } from '../../../src/scan/sources'
import {
  healthOf,
  recount,
  summariseEntries,
  totalsOf,
} from '../../../src/scan/summary'
import type { EntryMeta } from '../../../src/scan/summary'
import type {
  BindingRecord,
  ComponentSource,
  OldInstance,
  RawUnit,
  ScanSummary,
} from '../../../src/scan/types'
import type {
  ApplyResult,
  ChangeFailure,
  ConvertResult,
  MapRect,
  PluginToUi,
  ScanDot,
  Scope,
  SelectionComponent,
  UiToPlugin,
} from '../../../src/shared/messages'
import { pagesToScan } from '../../../src/shared/pages'
import type { FilePage } from '../../../src/shared/pages'
import { DEFAULT_SETTINGS } from '../../../src/shared/window'
import type { DisplaySettings } from '../../../src/shared/window'
import { buildSample, mainComponentOf } from './sample'
import type { SampleEntry, SampleFile } from './sample'
import { betaMode, unitId, withTarget } from './units'

/** What a button does on Figma's canvas, which the demo has none of. */
export type CanvasAction =
  | { type: 'select'; count: number }
  | { type: 'select-old'; count: number }
  | { type: 'go-to-page'; pageName: string }
  | { type: 'scan-page-of'; pageName: string }
  | { type: 'notify'; message: string }
  | { type: 'resize' }
  | { type: 'reset-window-size' }

export type MockOptions = {
  /** Sends a message to the window */
  post: (message: PluginToUi) => void
  /** A button acted on the canvas, which the page around the window explains */
  onCanvas: (action: CanvasAction) => void
  /** The introduction counts as seen, so it does not open by itself */
  introSeen: boolean
}

/** How fast scans and runs go: as in Figma, or at once while the page gets to a step. */
export type Pace = 'live' | 'fast'

type ScanState = {
  summary: ScanSummary
  records: BindingRecord[]
  conversions: BindingRecord[]
  oldInstances: OldInstance[]
}

type Target = { scope: Scope; pageId: string; nodeIds: string[] }

/** An entry of a scan, and the units it reads. */
type ScopeEntry = SampleEntry & { units: RawUnit[] }

/**
 * One change on a layer, kept in memory as the plugin keeps its change log
 * on the layer, so Revert can put it back. `own` is false for a change an
 * instance takes from its main component.
 */
type Change = {
  entryId: string
  nodeId: string
  removed: RawUnit[]
  added: RawUnit[]
  own: boolean
}

const LEGACY: ReadonlySet<string> = new Set([
  'sure',
  'check',
  'byHand',
  'none',
  'inInstance',
])

/** The legacy EDS Typography component (src/plugin/scan/scan.ts, isTypographyComponent). */
function isTypographyComponent(name: string | undefined): boolean {
  return /^typography$/i.test(name?.trim() ?? '')
}

/** A number from 0 to 1 for a string, the same every time, to place the dots of the scan map. */
function spread(text: string, salt: number): number {
  let hash = 2166136261 ^ salt
  for (let index = 0; index < text.length; index++) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619)
  }
  return ((hash >>> 0) % 1000) / 1000
}

export class DemoPlugin {
  private readonly file: SampleFile = buildSample()
  private pageId: string
  private selection: string[] = []
  private overrides: Overrides = NO_OVERRIDES
  private kept: KeptModes = NO_KEPT_MODES
  private blocked: Record<string, string> = {}
  private leftOutPages: string[] = []
  private introSeen: boolean
  private settings: DisplaySettings = DEFAULT_SETTINGS
  private lastScan?: ScanState
  private lastTarget?: Target
  private log: Change[] = []
  private nextId = 1
  private busy = false
  private cancelRequested = false
  private checkingSources = false
  private stopSources?: () => void
  private pace: Pace = 'live'

  constructor(private readonly options: MockOptions) {
    this.pageId = this.file.pages[0].id
    this.introSeen = options.introSeen
  }

  setPace(pace: Pace) {
    this.pace = pace
  }

  private post(message: PluginToUi) {
    this.options.post(message)
  }

  private wait(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, this.pace === 'fast' ? 0 : ms),
    )
  }

  // --- The file and the canvas

  private page(pageId: string): FilePage | undefined {
    return this.file.pages.find((page) => page.id === pageId)
  }

  private entryOf(nodeId: string): SampleEntry | undefined {
    const unit = this.file.units.find(
      (candidate) =>
        candidate.nodeId === nodeId ||
        candidate.instances?.some((step) => step.id === nodeId),
    )
    return this.file.entries.find(
      (entry) => entry.id === unit?.entryId || entry.nodeIds.includes(nodeId),
    )
  }

  private selectionComponent(): SelectionComponent | undefined {
    const entries = this.selection.map((id) =>
      this.file.entries.find((entry) => entry.nodeIds.includes(id)),
    )
    if (
      entries.length > 0 &&
      entries.every((entry) => entry?.kind === 'component')
    ) {
      return { kind: 'main' }
    }
    if (this.selection.length !== 1) return undefined
    const inside = this.entryOf(this.selection[0])
    return inside?.kind === 'component'
      ? { kind: 'inside', name: inside.name }
      : undefined
  }

  private postSelection() {
    const component = this.selectionComponent()
    const first = this.selection[0]
    this.post({
      type: 'selection',
      count: this.selection.length,
      ...(first ? { firstName: this.file.names.get(first) ?? first } : {}),
      ...(component ? { component } : {}),
    })
  }

  private postPages() {
    this.post({
      type: 'pages',
      pages: this.file.pages,
      leftOut: this.leftOutPages,
    })
  }

  /** Selects layers, as Go to does in Figma: switches to their page and selects them. */
  private select(nodeIds: string[]) {
    const page = nodeIds
      .map((id) => this.entryOf(id)?.pageId)
      .find((id) => id !== undefined)
    if (page && page !== this.pageId) {
      this.pageId = page
      this.postPages()
    }
    this.selection = nodeIds.filter(
      (id) => this.entryOf(id)?.pageId === this.pageId,
    )
    this.postSelection()
  }

  // --- Scanning

  /** The entries a scan reads, with their units. */
  private scopeOf(target: Target): {
    pages: FilePage[]
    entries: ScopeEntry[]
  } {
    const withUnits = (entry: SampleEntry): ScopeEntry => ({
      ...entry,
      units: this.file.units.filter((unit) => unit.entryId === entry.id),
    })
    if (target.scope === 'selection') {
      const entries: ScopeEntry[] = []
      for (const id of target.nodeIds) {
        const root = this.file.entries.find((entry) =>
          entry.nodeIds.includes(id),
        )
        if (root) {
          entries.push(withUnits(root))
          continue
        }
        // A layer inside a frame: the layer and every layer in it.
        const parent = this.entryOf(id)
        const own = this.file.units.find((unit) => unit.nodeId === id)
        if (!parent || !own) continue
        const depth = own.path.length
        const name = own.nodeName
        entries.push({
          ...parent,
          id,
          kind: 'frame',
          name,
          nodeIds: [id],
          layers: 1,
          units: this.file.units
            .filter(
              (unit) =>
                unit.entryId === parent.id &&
                (unit.nodeId === id ||
                  unit.instances?.some((step) => step.id === id) ||
                  (unit.path.length > depth && unit.path[depth] === name)),
            )
            .map((unit) => ({ ...unit, entryId: id })),
        })
      }
      const pageIds = new Set(entries.map((entry) => entry.pageId))
      return {
        pages: this.file.pages.filter((page) => pageIds.has(page.id)),
        entries,
      }
    }
    const pageIds =
      target.scope === 'file'
        ? pagesToScan(this.file.pages, this.leftOutPages)
        : [target.pageId]
    return {
      pages: this.file.pages.filter((page) => pageIds.includes(page.id)),
      entries: this.file.entries
        .filter((entry) => pageIds.includes(entry.pageId))
        .map(withUnits),
    }
  }

  /** The instances that take legacy values from their main component, as the plugin reads them. */
  private oldInstances(
    records: BindingRecord[],
    units: RawUnit[],
  ): OldInstance[] {
    const byInstance = new Map<string, BindingRecord[]>()
    for (const record of records) {
      if (record.category !== 'inInstance' || !record.instanceId) continue
      const list = byInstance.get(record.instanceId) ?? []
      list.push(record)
      byInstance.set(record.instanceId, list)
    }
    const result: OldInstance[] = []
    for (const [id, own] of byInstance) {
      const chain =
        own.find((record) => record.instances?.some((step) => step.id === id))
          ?.instances ?? []
      const at = chain.findIndex((step) => step.id === id)
      const step = chain[at] ?? { id, name: this.file.names.get(id) ?? id }
      const above = at > 0 ? chain[at - 1] : undefined
      const mainComponent = mainComponentOf(this.file, step.component)
      const instance: OldInstance = {
        id,
        name: step.name,
        entryId: own[0].entryId,
        count: own.length,
        ...(step.hidden ? { hidden: true as const } : {}),
        ...(step.slot && above
          ? { within: { id: above.id, name: above.name } }
          : {}),
        tree: buildInstanceTree(step, own),
        ...(mainComponent ? { mainComponent } : {}),
      }
      if (isTypographyComponent(mainComponent?.name)) {
        instance.typography = true
        const text = units.find(
          (unit) => unit.instanceId === id && unit.nodeType === 'TEXT',
        )
        if (text) {
          instance.text = this.file.texts.get(id) ?? 'Text'
          instance.textId = text.nodeId
        }
      }
      result.push(instance)
    }
    return result
  }

  /** Layer names from the entry down to the parent of an instance. */
  private instancePath(instanceId: string, units: RawUnit[]): string[] {
    const own = units.find((unit) => unit.nodeId === instanceId)
    if (own) return own.path
    const inside = units.find((unit) =>
      unit.instances?.some((step) => step.id === instanceId),
    )
    return inside ? inside.path.slice(0, -1) : []
  }

  /** The layers in the entry the plugin has changed, which Revert can put back. */
  private changedIn(entryId: string, nodeIds: ReadonlySet<string>): Change[] {
    // A change an instance takes from its main component is the main
    // component's, and only Revert there puts it back.
    return this.log.filter(
      (change) =>
        change.entryId === entryId ||
        (change.own && nodeIds.has(change.nodeId)),
    )
  }

  /** Reads the entries as a scan does and classifies them with the plugin's rules. */
  private read(target: Target, scope: ScopeEntry[], pages: FilePage[]) {
    const units = scope.flatMap((entry) => entry.units)
    const records = classifyUnits(units)
    const oldInstances = this.oldInstances(records, units)
    const sources: ConversionSource[] = oldInstances.flatMap((instance) =>
      instance.typography && instance.textId
        ? [
            {
              id: instance.id,
              name: instance.name,
              entryId: instance.entryId,
              text: instance.text,
              textId: instance.textId,
              path: this.instancePath(instance.id, units),
            },
          ]
        : [],
    )
    const conversions = conversionRecords(sources, units)
    const legacyIn = new Set(
      records
        .filter((record) => LEGACY.has(record.category))
        .map((record) => record.entryId),
    )
    const metas: EntryMeta[] = scope.map((entry) => {
      const nodes = new Set(entry.units.map((unit) => unit.nodeId))
      const changed = new Set(
        this.changedIn(entry.id, nodes)
          .filter((change) => change.own)
          .map((change) => change.nodeId),
      ).size
      return {
        id: entry.id,
        kind: entry.kind,
        name: entry.name,
        pageId: entry.pageId,
        pageName: this.page(entry.pageId)?.name ?? '',
        sections: entry.sections,
        nodeIds: entry.nodeIds,
        changed,
        ...(entry.instanceCount !== undefined && legacyIn.has(entry.id)
          ? { instanceCount: entry.instanceCount }
          : {}),
      }
    })
    const entries = summariseEntries(metas, records, oldInstances)
    const totals = totalsOf(entries)
    const state: ScanState = {
      summary: {
        scope: target.scope,
        scannedAt: new Date().toISOString(),
        mappingVersion: MAPPING_VERSION,
        pages: pages.map((page) => ({ id: page.id, name: page.name })),
        nodesScanned: scope.reduce((sum, entry) => sum + entry.layers, 0),
        totals,
        health: healthOf(totals),
        entries,
      },
      records,
      conversions,
      oldInstances,
    }
    return state
  }

  /** The scan counted with the designer's choices, as in code.ts, withChoices. */
  private withChoices(state: ScanState): ScanState {
    const current = this.overrides
    const waits = modeWaits(
      state.records,
      current,
      new Set(state.records.map((record) => record.entryId)),
      state.oldInstances,
    )
    this.kept = waits.kept
    this.blocked = waits.blocked
    const kept = waits.kept
    return {
      ...state,
      summary: recount(
        state.summary,
        state.records,
        state.oldInstances,
        (record) => effectiveCategory(record, current, kept),
      ),
    }
  }

  /** The map of a page the scan loader draws, with the area the entries cover. */
  private mapOf(
    pageId: string,
    entries: ScopeEntry[],
  ): { width: number; height: number; tiles: MapRect[]; sections: MapRect[] } {
    const sections = this.file.sections
      .filter((section) => section.pageId === pageId)
      .map((section) => section.rect)
    const tiles = entries.map((entry) => entry.rect)
    const all = [...tiles, ...sections]
    const minX = Math.min(...all.map(([x]) => x))
    const minY = Math.min(...all.map(([, y]) => y))
    const maxX = Math.max(...all.map(([x, , width]) => x + width))
    const maxY = Math.max(...all.map(([, y, , height]) => y + height))
    const shift = ([x, y, width, height]: MapRect): MapRect => [
      x - minX,
      y - minY,
      width,
      height,
    ]
    return {
      width: maxX - minX,
      height: maxY - minY,
      tiles: tiles.map(shift),
      sections: sections.map(shift),
    }
  }

  private async scan(target: Target) {
    if (this.busy) return
    const { pages, entries } = this.scopeOf(target)
    if (target.scope === 'selection' && entries.length === 0) {
      this.post({
        type: 'error',
        message: 'Select one or more frames, then scan again.',
      })
      return
    }
    if (pages.length === 0) {
      this.post({
        type: 'error',
        message: 'Choose one or more pages to scan, then scan again.',
      })
      return
    }
    this.busy = true
    this.cancelRequested = false
    try {
      // Read first, so the map can show where the values are as it goes.
      const state = this.read(target, entries, pages)
      this.post({
        type: 'scan-start',
        scope: target.scope,
        pageCount: pages.length,
      })
      let nodes = 0
      for (const [pageIndex, page] of pages.entries()) {
        const onPage = entries.filter((entry) => entry.pageId === page.id)
        const progress = {
          pageName: page.name,
          pageIndex,
          pageCount: pages.length,
        }
        this.post({ type: 'scan-progress', progress: { ...progress, nodes } })
        await this.wait(200)
        const map = this.mapOf(page.id, onPage)
        this.post({
          type: 'scan-map',
          pageIndex,
          map: { pageId: page.id, ...map },
        })
        for (const [index, entry] of onPage.entries()) {
          this.post({
            type: 'scan-progress',
            progress: { ...progress, nodes, current: index, tilesDone: index },
          })
          await this.wait(100 + entry.layers * 3)
          if (this.cancelRequested) {
            this.post({ type: 'scan-cancelled' })
            return
          }
          nodes += entry.layers
          const [x, y, width, height] = map.tiles[index]
          const dots: ScanDot[] = state.records
            .filter((record) => record.entryId === entry.id)
            .slice(0, 24)
            .map((record) => [
              Math.round(x + width * (0.08 + 0.84 * spread(record.id, 1))),
              Math.round(y + height * (0.08 + 0.84 * spread(record.id, 2))),
              LEGACY.has(record.category) ? 1 : 0,
            ])
          this.post({
            type: 'scan-progress',
            progress: {
              ...progress,
              nodes,
              tilesDone: index + 1,
              ...(dots.length > 0 ? { dots } : {}),
            },
          })
        }
      }
      this.lastTarget = target
      this.lastScan = this.withChoices(state)
      this.post({ type: 'kept-modes', kept: this.kept, blocked: this.blocked })
      this.post({ type: 'scan-done', summary: this.lastScan.summary })
      this.post({
        type: 'mapping',
        groups: buildMappingGroups(this.lastScan.records),
      })
      this.post({
        type: 'conversions',
        groups: buildMappingGroups(this.lastScan.conversions, {
          ownReasons: true,
        }),
      })
      this.post({ type: 'instances', instances: this.lastScan.oldInstances })
      this.post({ type: 'overrides', overrides: this.overrides })
    } finally {
      this.busy = false
    }
  }

  private target(scope: Scope): Target {
    return { scope, pageId: this.pageId, nodeIds: this.selection }
  }

  // --- Apply, Revert and Convert, on the units of the file

  private unitFor(recordId: string): RawUnit | undefined {
    return this.file.units.find((unit) => unitId(unit) === recordId)
  }

  /**
   * The units of the instances of a main component in this file that take
   * this unit's value from it: the same property on the same layer, below
   * an instance of the component (`I<instance>;<layer>`), or on the
   * instance itself for the component's root.
   */
  private followers(unit: RawUnit): RawUnit[] {
    const entry = this.file.entries.find((item) => item.id === unit.entryId)
    if (entry?.kind !== 'component') return []
    const root = entry.nodeIds[0]
    const property = propertyKey(unit.property)
    return this.file.units.filter((other) => {
      if (other === unit || other.override || !other.instanceId) return false
      const instance = other.instances?.find(
        (step) => step.id === other.instanceId,
      )
      if (instance?.component !== entry.name) return false
      const counterpart =
        unit.nodeId === root
          ? other.instanceId
          : `I${other.instanceId};${unit.nodeId}`
      return (
        other.nodeId === counterpart && propertyKey(other.property) === property
      )
    })
  }

  /** Replaces a unit with others, and logs the change, for it and for the instances that follow it. */
  private change(unit: RawUnit, next: (unit: RawUnit) => RawUnit[]) {
    const units = this.file.units
    for (const [index, current] of [unit, ...this.followers(unit)].entries()) {
      const added = next(current)
      const at = units.indexOf(current)
      const removed = added.includes(current) ? [] : [current]
      units.splice(
        at,
        removed.length,
        ...added.filter((item) => item !== current),
      )
      this.log.push({
        entryId: unit.entryId,
        nodeId: current.nodeId,
        removed,
        added: added.filter((item) => item !== current),
        own: index === 0,
      })
    }
  }

  private async step(done: number, total: number) {
    if (done % 20 === 0) {
      this.post({ type: 'apply-progress', done, total })
      await this.wait(60)
    }
  }

  private async apply(entryIds: string[], recordIds?: Set<string>) {
    if (!this.lastScan || !this.lastTarget || this.busy) return
    this.busy = true
    try {
      const { records } = this.lastScan
      const plan = planChanges(
        records,
        this.overrides,
        new Set(entryIds),
        recordIds,
      )
      const changed = new Set<string>()
      const layers = new Set<string>()
      const reset = new Set<string>()
      const failed: ChangeFailure[] = []
      let values = 0
      let numbers = 0
      let modes = 0
      let modesKept = 0
      let done = 0
      await this.wait(300)
      for (const change of plan.filter((item) => !isModeChange(item))) {
        const unit = this.unitFor(change.record.id)
        if (!unit) {
          failed.push({
            nodeId: change.record.nodeId,
            nodeName: change.record.nodeName,
            property: change.record.property.type,
            message: 'The layer has changed since the scan. Scan again.',
          })
          continue
        }
        if (isResetTarget(change.target)) reset.add(unit.nodeId)
        this.change(unit, (current) => [withTarget(current, change.target)])
        changed.add(change.record.id)
        layers.add(unit.nodeId)
        if (change.target.startsWith('value:')) numbers += 1
        else values += 1
        await this.step((done += 1), plan.length)
      }
      // A legacy mode stays while values below read it, as in Figma
      // (apply.ts, keptModeChanges).
      const modeChanges = plan.filter(isModeChange)
      const keep = keptModeChanges(records, modeChanges, changed)
      for (const change of modeChanges) {
        const unit = this.unitFor(change.record.id)
        if (!unit) continue
        const mustKeep = keep.has(change.record.id)
        const sets = betaMode(unit, change.target) !== null
        if (sets || !mustKeep) {
          this.change(unit, (current) => {
            const added = betaMode(current, change.target)
            return [...(mustKeep ? [current] : []), ...(added ? [added] : [])]
          })
          changed.add(change.record.id)
          layers.add(unit.nodeId)
          modes += 1
        }
        if (mustKeep) modesKept += 1
        await this.step((done += 1), plan.length)
      }
      const result: ApplyResult = {
        planned: plan.length,
        applied: changed.size,
        values,
        numbers,
        modes,
        layers: layers.size,
        modesKept,
        resets: reset.size,
        failedFixes: [],
        failed,
      }
      this.post({
        type: 'apply-progress',
        done: plan.length,
        total: plan.length,
      })
      this.post({ type: 'apply-done', result })
    } finally {
      this.busy = false
    }
    await this.scan(this.lastTarget)
  }

  private async revert(entryId: string) {
    const entry = this.lastScan?.summary.entries.find(
      (candidate) => candidate.id === entryId,
    )
    if (!entry || !this.lastTarget || this.busy) return
    this.busy = true
    try {
      const nodes = new Set(
        this.lastScan?.records
          .filter((record) => record.entryId === entryId)
          .map((record) => record.nodeId),
      )
      const mine = this.changedIn(entryId, nodes)
      const units = this.file.units
      for (const change of [...mine].reverse()) {
        let at = -1
        for (const added of change.added) {
          const index = units.indexOf(added)
          if (index === -1) continue
          if (at === -1 || index < at) at = index
          units.splice(index, 1)
        }
        units.splice(at === -1 ? units.length : at, 0, ...change.removed)
      }
      this.log = this.log.filter((change) => !mine.includes(change))
      await this.wait(400)
      const own = mine.filter((change) => change.own)
      this.post({
        type: 'revert-done',
        result: {
          reverted: own.length,
          layers: new Set(own.map((change) => change.nodeId)).size,
          failed: [],
        },
      })
    } finally {
      this.busy = false
    }
    await this.scan(this.lastTarget)
  }

  private async convert(instanceIds: string[]) {
    if (!this.lastScan || !this.lastTarget || this.busy) return
    this.busy = true
    try {
      const plan = planConversions(
        this.lastScan.conversions,
        this.overrides,
        instanceIds,
      )
      const units = this.file.units
      const caseIds: string[] = []
      await this.wait(300)
      for (const item of plan.convert) {
        const inside = units.filter((unit) =>
          unit.instances?.some((step) => step.id === item.instanceId),
        )
        const text = inside.find(
          (unit) =>
            unit.unit === 'typography' && unit.instanceId === item.instanceId,
        )
        if (!text) continue
        const fill = inside.find(
          (unit) =>
            unit.unit === 'variable' &&
            unit.kind === 'textFill' &&
            unit.nodeId === text.nodeId,
        )
        // The text layer takes the instance's place, outside it, in what
        // holds it: the frame, or the slot of the instance above it.
        const chain = text.instances ?? []
        const above = chain.slice(
          0,
          chain.findIndex((step) => step.id === item.instanceId),
        )
        const nodeId = `90:${this.nextId++}`
        const layer = (unit: RawUnit): RawUnit => {
          const { instanceId, override, ...rest } = unit
          void instanceId
          void override
          return {
            ...rest,
            nodeId,
            path: unit.path.slice(0, -1),
            // In slot content an instance owns, a layer outside the
            // instances there has no instance of its own (README).
            instances: above.length > 0 ? above : undefined,
          }
        }
        const added = [
          withTarget(layer(text), item.style.target),
          ...(fill
            ? [
                item.colour
                  ? withTarget(layer(fill), item.colour.target)
                  : layer(fill),
              ]
            : []),
        ]
        const at = units.indexOf(inside[0])
        for (const unit of inside) units.splice(units.indexOf(unit), 1)
        units.splice(Math.max(0, at), 0, ...added)
        this.log.push({
          entryId: text.entryId,
          nodeId,
          removed: inside,
          added,
          own: true,
        })
        this.file.names.set(nodeId, 'Typography')
        if (dropsTextCase(item.style.record, item.style.target)) {
          caseIds.push(nodeId)
        }
      }
      const result: ConvertResult = {
        converted: plan.convert.length,
        monoNumbers: 0,
        monoNumberIds: [],
        caseIds,
        instanceTexts: 0,
        skipped: plan.skipped.map((skip) => ({
          nodeId: skip.instanceId,
          nodeName: skip.name ?? 'Typography',
          reason: skip.reason,
        })),
        failed: [],
      }
      this.post({ type: 'convert-done', result })
    } finally {
      this.busy = false
    }
    await this.scan(this.lastTarget)
  }

  // --- Choices

  /** Keeps the designer's choices and counts the scan again with them, as code.ts does. */
  private keepChoices(next: Overrides) {
    this.overrides = next
    this.post({ type: 'overrides', overrides: next })
    if (this.lastScan) {
      this.lastScan = this.withChoices(this.lastScan)
      this.post({ type: 'kept-modes', kept: this.kept, blocked: this.blocked })
      this.post({ type: 'summary', summary: this.lastScan.summary })
    }
  }

  // --- Where to fix the values inside instances

  private sourceOf(key: string): ComponentSource {
    const found = Object.values(this.file.components).find(
      (component) => component.key === key,
    )
    return found?.source ?? { kind: 'library', legacy: 0 }
  }

  private async checkSources() {
    if (!this.lastScan || this.checkingSources) return
    this.checkingSources = true
    let stopped = false
    try {
      const mains = remoteMainComponents(this.lastScan.oldInstances)
      this.post({ type: 'sources-start', total: mains.length })
      const stop = new Promise<'stopped'>((resolve) => {
        this.stopSources = () => resolve('stopped')
      })
      for (const { key } of mains) {
        this.post({ type: 'source-checking', key })
        const source = await Promise.race([
          this.wait(700).then(() => this.sourceOf(key)),
          stop,
        ])
        if (source === 'stopped') {
          stopped = true
          break
        }
        this.post({ type: 'source', key, source })
      }
    } finally {
      this.checkingSources = false
      this.stopSources = undefined
      this.post({ type: 'sources-done', ...(stopped ? { stopped } : {}) })
    }
  }

  // --- Messages from the window

  async handle(message: UiToPlugin): Promise<void> {
    try {
      await this.answer(message)
    } catch (error) {
      this.post({
        type: 'error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async answer(message: UiToPlugin): Promise<void> {
    switch (message.type) {
      case 'ready':
        this.post({
          type: 'init',
          command: 'open',
          mappingVersion: MAPPING_VERSION,
          fileName: this.file.fileName,
          currentPageName: this.page(this.pageId)?.name ?? '',
        })
        this.postSelection()
        this.postPages()
        this.post({
          type: 'prefs',
          introSeen: this.introSeen,
          settings: this.settings,
        })
        return
      case 'scan':
        await this.scan(this.target(message.scope))
        return
      case 'cancel-scan':
        this.cancelRequested = true
        return
      case 'get-pages':
        this.postPages()
        return
      case 'set-left-out-pages':
        this.leftOutPages = message.pageIds
        this.postPages()
        return
      case 'get-entry': {
        const scan = this.lastScan
        if (!scan) return
        const entry = scan.summary.entries.find(
          (item) => item.id === message.entryId,
        )
        this.post({
          type: 'entry-detail',
          entryId: message.entryId,
          records: scan.records.filter(
            (record) => record.entryId === message.entryId,
          ),
          oldInstances: scan.oldInstances.filter(
            (instance) => instance.entryId === message.entryId,
          ),
          // The main component in Sample file has no instances in it.
          ...(entry?.kind === 'component' || entry?.insideComponent
            ? { instances: [] }
            : {}),
        })
        return
      }
      case 'select':
        this.select(message.nodeIds)
        this.options.onCanvas({ type: 'select', count: message.nodeIds.length })
        return
      case 'go-to-page': {
        const page = this.page(message.pageId)
        if (!page) return
        this.pageId = page.id
        this.selection = []
        this.postSelection()
        this.postPages()
        this.options.onCanvas({ type: 'go-to-page', pageName: page.name })
        return
      }
      case 'select-old': {
        const nodeIds = [
          ...new Set(
            (this.lastScan?.records ?? [])
              .filter(
                (record) =>
                  record.oldKey === message.oldKey && isMappable(record),
              )
              .map((record) => record.nodeId),
          ),
        ]
        this.select(nodeIds)
        this.options.onCanvas({ type: 'select-old', count: nodeIds.length })
        return
      }
      case 'set-overrides':
        this.keepChoices(withChanges(this.overrides, message.changes))
        return
      case 'row-choice':
        this.keepChoices(
          withRowChoice(this.overrides, message.row, message.value),
        )
        return
      case 'apply':
        await this.apply(message.entryIds)
        return
      case 'apply-selected': {
        const ids = new Set(message.recordIds)
        const entryIds = new Set(
          (this.lastScan?.records ?? [])
            .filter((record) => ids.has(record.id))
            .map((record) => record.entryId),
        )
        await this.apply([...entryIds], ids)
        return
      }
      case 'preview': {
        const scan = this.lastScan
        if (!scan) return
        const recordIds = message.recordIds && new Set(message.recordIds)
        const entryIds = recordIds
          ? new Set(
              scan.records
                .filter((record) => recordIds.has(record.id))
                .map((record) => record.entryId),
            )
          : new Set(message.entryIds ?? [])
        this.post({
          type: 'preview',
          id: message.id,
          preview: previewRun(
            scan.records,
            this.overrides,
            entryIds,
            recordIds,
            scan.oldInstances,
          ),
        })
        return
      }
      case 'revert':
        await this.revert(message.entryId)
        return
      case 'get-report':
        if (this.lastScan) {
          this.post({
            type: 'report',
            report: buildReport({
              fileName: this.file.fileName,
              summary: this.lastScan.summary,
              records: this.lastScan.records,
              oldInstances: this.lastScan.oldInstances,
              overrides: this.overrides,
              kept: this.kept,
            }),
          })
        }
        return
      case 'scan-page-of': {
        const entry = this.entryOf(message.nodeId)
        const page = entry && this.page(entry.pageId)
        if (page) {
          this.pageId = page.id
          this.selection = [message.nodeId]
          this.postSelection()
          this.postPages()
          this.options.onCanvas({ type: 'scan-page-of', pageName: page.name })
        }
        await this.scan(this.target('page'))
        return
      }
      case 'intro-seen':
        this.introSeen = true
        return
      case 'save-settings':
        this.settings = message.settings
        return
      case 'reset-window-size':
        this.options.onCanvas({ type: 'reset-window-size' })
        return
      case 'convert-typography':
        await this.convert(message.instanceIds)
        return
      case 'preview-convert':
        if (this.lastScan) {
          this.post({
            type: 'convert-preview',
            id: message.id,
            preview: previewConversions(
              planConversions(
                this.lastScan.conversions,
                this.overrides,
                message.instanceIds,
              ),
              this.lastScan.oldInstances,
              {},
            ),
          })
        }
        return
      case 'get-typography-components':
        // No Typography instance in Sample file is in a main component.
        if (this.lastScan) {
          this.post({ type: 'typography-components', counts: {} })
        }
        return
      case 'check-sources':
        await this.checkSources()
        return
      case 'cancel-sources':
        this.stopSources?.()
        return
      case 'resize':
        // The demo keeps its size; a drag of the grip says what it does in Figma.
        if (message.done && !message.fit) {
          this.options.onCanvas({ type: 'resize' })
        }
        return
      case 'run-dev-export-inventory':
      case 'run-dev-export-fixture':
        this.post({
          type: 'dev-export',
          files: [],
          notes: [
            'The developer commands read a Figma file, so the demo has none.',
          ],
        })
        return
      case 'notify':
        this.options.onCanvas({ type: 'notify', message: message.message })
        return
      default: {
        const unknown: never = message
        throw new Error(`No answer for ${JSON.stringify(unknown)}`)
      }
    }
  }
}
