/**
 * The plugin main thread. Runs in Figma's sandbox, reads and changes the
 * document, and talks to the plugin window (src/ui) through messages.
 */
import { MAPPING_VERSION } from '../mapping/version'
import type { Command, PluginToUi, UiToPlugin } from '../shared/messages'
import { collectFixture } from './dev/export-fixture'
import { exportInventory } from './dev/export-inventory'
import { ScanCancelled } from './scan/collect'
import { runScan } from './scan/scan'
import type { ScanState } from './scan/scan'

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
  width: 440,
  height: 680,
  title: 'EDS variable migration',
})

function post(message: PluginToUi) {
  figma.ui.postMessage(message)
}

let lastScan: ScanState | undefined
let scanning = false
let cancelRequested = false

async function scan(scope: 'page' | 'file') {
  if (scanning) return
  scanning = true
  cancelRequested = false
  try {
    lastScan = await runScan(
      scope,
      (progress) => post({ type: 'scan-progress', progress }),
      () => cancelRequested,
    )
    post({ type: 'scan-done', summary: lastScan.summary })
  } catch (error) {
    if (error instanceof ScanCancelled) post({ type: 'scan-cancelled' })
    else throw error
  } finally {
    scanning = false
  }
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
        if (command === 'dev-export-inventory') await runDevExportInventory()
        if (command === 'dev-export-fixture') await runDevExportFixture()
        break
      case 'scan':
        await scan(message.scope)
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
