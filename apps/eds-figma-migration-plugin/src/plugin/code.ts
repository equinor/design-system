/**
 * The plugin main thread. Runs in Figma's sandbox, reads and changes the
 * document, and talks to the plugin window (src/ui) through messages.
 */
import { MAPPING_VERSION } from '../mapping/version'
import {
  buildMappingGroups,
  effectiveCategory,
  isMappable,
} from '../scan/mapping'
import { recount } from '../scan/summary'
import type { Overrides } from '../scan/mapping'
import type {
  Command,
  OverrideChange,
  PluginToUi,
  UiToPlugin,
} from '../shared/messages'
import { applyChanges } from './apply/apply'
import { convertTypography } from './apply/convert'
import { revertRoots } from './apply/revert'
import { collectFixture } from './dev/export-fixture'
import { exportInventory } from './dev/export-inventory'
import { ScanCancelled } from './scan/collect'
import { currentTarget, runScan } from './scan/scan'
import { loadChoices, loadHealth, saveChoices, saveHealth } from './store'
import { buildReport } from '../scan/report'
import type { ScanState, ScanTarget } from './scan/scan'
import { clampSize, WINDOW, WINDOW_SIZE_KEY } from '../shared/window'

const COMMANDS: Command[] = [
  'open',
  'dev-export-inventory',
  'dev-export-fixture',
]
const command: Command = COMMANDS.includes(figma.command as Command)
  ? (figma.command as Command)
  : 'open'

figma.showUI(__html__, {
  themeColors: true,
  width: WINDOW.width,
  height: WINDOW.height,
  title: 'EDS Variable Migration [WIP BETA]',
})

// The window opens at the size the person last gave it.
figma.clientStorage
  .getAsync(WINDOW_SIZE_KEY)
  .then((saved: unknown) => {
    const size = saved as { width?: unknown; height?: unknown } | undefined
    if (typeof size?.width === 'number' && typeof size.height === 'number') {
      const { width, height } = clampSize(size.width, size.height)
      figma.ui.resize(width, height)
    }
  })
  .catch(() => {
    // No saved size; the default stays.
  })

function post(message: PluginToUi) {
  figma.ui.postMessage(message)
}

let lastScan: ScanState | undefined
let lastTarget: ScanTarget | undefined
let overrides: Overrides = loadChoices()
/** True while a scan, an apply or a revert runs; only one at a time */
let busy = false
let cancelRequested = false

/** The scan counted with the designer's choices: a chosen target is Ready, a choice to leave a binding No equivalent. */
function withChoices(state: ScanState): ScanState {
  const current = overrides
  return {
    ...state,
    summary: recount(
      state.summary,
      state.records,
      state.oldInstances,
      (record) => effectiveCategory(record, current),
    ),
  }
}

function postSelection() {
  const selection = figma.currentPage.selection
  post({
    type: 'selection',
    count: selection.length,
    firstName: selection[0]?.name,
  })
}

figma.on('selectionchange', postSelection)
figma.on('currentpagechange', postSelection)

/**
 * Scans the target. The designer's choices are kept from one scan to the
 * next: they are stored by layer and property, and by legacy variable and
 * proposal, so they still apply to what is left after an apply.
 */
async function scan(target: ScanTarget) {
  if (busy) return
  busy = true
  cancelRequested = false
  try {
    const state = await runScan(
      target,
      (progress) => post({ type: 'scan-progress', progress }),
      () => cancelRequested,
    )
    lastTarget = target
    lastScan = withChoices(state)
    saveHealth(lastScan.summary)
    post({ type: 'scan-done', summary: lastScan.summary })
    post({ type: 'mapping', groups: buildMappingGroups(lastScan.records) })
    post({ type: 'instances', instances: lastScan.oldInstances })
    post({ type: 'overrides', overrides })
  } catch (error) {
    if (error instanceof ScanCancelled) post({ type: 'scan-cancelled' })
    else throw error
  } finally {
    busy = false
  }
}

/** Applies the Ready changes in the entries, then scans the same layers again. */
async function apply(entryIds: string[]) {
  if (!lastScan || !lastTarget || busy) return
  busy = true
  try {
    const result = await applyChanges(
      lastScan.records,
      overrides,
      new Set(entryIds),
      (done, total) => post({ type: 'apply-progress', done, total }),
    )
    post({ type: 'apply-done', result })
  } finally {
    busy = false
  }
  await scan(lastTarget)
}

/** Replaces Typography component instances with text layers, then scans again. */
async function convert(instanceIds: string[]) {
  if (!lastScan || !lastTarget || busy) return
  busy = true
  try {
    const result = await convertTypography(instanceIds, lastScan.units)
    post({ type: 'convert-done', result })
  } finally {
    busy = false
  }
  await scan(lastTarget)
}

/** Puts back what the plugin changed in an entry, then scans again. */
async function revert(entryId: string) {
  const entry = lastScan?.summary.entries.find(
    (candidate) => candidate.id === entryId,
  )
  if (!entry || !lastTarget || busy) return
  busy = true
  try {
    const roots: SceneNode[] = []
    for (const id of entry.nodeIds) {
      const node = await figma.getNodeByIdAsync(id)
      if (
        node &&
        !node.removed &&
        node.type !== 'PAGE' &&
        node.type !== 'DOCUMENT'
      ) {
        roots.push(node as SceneNode)
      }
    }
    const result = await revertRoots(roots)
    post({ type: 'revert-done', result })
  } finally {
    busy = false
  }
  await scan(lastTarget)
}

function pageOf(node: BaseNode): PageNode | null {
  let current: BaseNode | null = node
  while (current && current.type !== 'PAGE') current = current.parent
  return current
}

async function select(nodeIds: string[]) {
  const nodes: SceneNode[] = []
  for (const id of nodeIds) {
    const node = await figma.getNodeByIdAsync(id)
    if (node && node.type !== 'DOCUMENT' && node.type !== 'PAGE') {
      nodes.push(node as SceneNode)
    }
  }
  if (nodes.length === 0) {
    post({
      type: 'error',
      message: 'The layer is no longer in the file. Scan again.',
    })
    return
  }
  const page = pageOf(nodes[0])
  if (page && page !== figma.currentPage) await figma.setCurrentPageAsync(page)
  const onPage = nodes.filter((node) => pageOf(node) === figma.currentPage)
  figma.currentPage.selection = onPage
  figma.viewport.scrollAndZoomIntoView(onPage)
  const elsewhere = nodes.length - onPage.length
  if (elsewhere > 0) {
    figma.notify(
      `Selected ${onPage.length} on this page. ${elsewhere} more ${elsewhere === 1 ? 'is' : 'are'} on other pages.`,
    )
  }
}

async function selectOld(oldKey: string) {
  if (!lastScan) return
  const nodeIds = [
    ...new Set(
      lastScan.records
        .filter((record) => record.oldKey === oldKey && isMappable(record))
        .map((record) => record.nodeId),
    ),
  ]
  await select(nodeIds)
}

function setOverrides(changes: OverrideChange[]) {
  const records = { ...overrides.records }
  const rows = { ...overrides.rows }
  for (const { target, value } of changes) {
    const map = target.type === 'record' ? records : rows
    const key = target.type === 'record' ? target.id : target.key
    if (value === undefined) delete map[key]
    else map[key] = value
  }
  overrides = { records, rows }
  post({ type: 'overrides', overrides })
  if (!saveChoices(overrides)) post({ type: 'choices-not-saved' })
  if (lastScan) {
    // The health bars, the legend and the filters follow every change.
    lastScan = withChoices(lastScan)
    post({ type: 'summary', summary: lastScan.summary })
  }
}

function entryDetail(entryId: string) {
  if (!lastScan) return
  post({
    type: 'entry-detail',
    entryId,
    records: lastScan.records.filter((record) => record.entryId === entryId),
    oldInstances: lastScan.oldInstances.filter(
      (instance) => instance.entryId === entryId,
    ),
  })
}

async function runDevExportInventory() {
  const { files, notes } = await exportInventory()
  post({ type: 'dev-export', files, notes })
}

async function runDevExportFixture() {
  const node = figma.currentPage.selection[0]
  if (!node) {
    post({
      type: 'dev-export',
      files: [],
      notes: ['Select the frame to export, then run the command again.'],
    })
    return
  }
  const fixture = await collectFixture(node)
  post({
    type: 'dev-export',
    files: [
      {
        fileName: 'test-frame.json',
        path: 'test/fixtures/test-frame.json',
        json: `${JSON.stringify(fixture, null, 2)}\n`,
      },
    ],
    notes: [],
  })
}

figma.ui.onmessage = async (message: UiToPlugin) => {
  try {
    switch (message.type) {
      case 'ready':
        post({
          type: 'init',
          command,
          mappingVersion: MAPPING_VERSION,
          fileName: figma.root.name,
          currentPageName: figma.currentPage.name,
        })
        postSelection()
        {
          const saved = loadHealth()
          if (saved) post({ type: 'saved-health', saved })
        }
        if (command === 'dev-export-inventory') await runDevExportInventory()
        if (command === 'dev-export-fixture') await runDevExportFixture()
        break
      case 'scan':
        await scan(currentTarget(message.scope))
        break
      case 'cancel-scan':
        cancelRequested = true
        break
      case 'get-entry':
        entryDetail(message.entryId)
        break
      case 'select':
        await select(message.nodeIds)
        break
      case 'go-to-page': {
        const page = await figma.getNodeByIdAsync(message.pageId)
        if (page?.type === 'PAGE') await figma.setCurrentPageAsync(page)
        break
      }
      case 'select-old':
        await selectOld(message.oldKey)
        break
      case 'set-overrides':
        setOverrides(message.changes)
        break
      case 'apply':
        await apply(message.entryIds)
        break
      case 'revert':
        await revert(message.entryId)
        break
      case 'convert-typography':
        await convert(message.instanceIds)
        break
      case 'resize': {
        const { width, height } = clampSize(message.width, message.height)
        figma.ui.resize(width, height)
        if (message.done) {
          await figma.clientStorage
            .setAsync(WINDOW_SIZE_KEY, { width, height })
            .catch(() => undefined)
        }
        break
      }
      case 'get-report':
        if (lastScan) {
          post({
            type: 'report',
            report: buildReport({
              fileName: figma.root.name,
              summary: lastScan.summary,
              records: lastScan.records,
              oldInstances: lastScan.oldInstances,
              overrides,
            }),
          })
        }
        break
      case 'run-dev-export-inventory':
        await runDevExportInventory()
        break
      case 'run-dev-export-fixture':
        await runDevExportFixture()
        break
      case 'notify':
        figma.notify(message.message)
        break
    }
  } catch (error) {
    post({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}
