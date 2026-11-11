/**
 * The plugin main thread. Runs in Figma's sandbox, reads and changes the
 * document, and talks to the plugin window (src/ui) through messages.
 */
import { MAPPING_VERSION } from '../mapping/version'
import type { Command, PluginToUi, UiToPlugin } from '../shared/messages'
import { exportInventory } from './dev/export-inventory'

const COMMANDS: Command[] = ['open', 'dev-export-inventory']
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

async function runDevExport() {
  const { files, notes } = await exportInventory()
  post({ type: 'dev-export', files, notes })
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
        })
        if (command === 'dev-export-inventory') await runDevExport()
        break
      case 'run-dev-export-inventory':
        await runDevExport()
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
