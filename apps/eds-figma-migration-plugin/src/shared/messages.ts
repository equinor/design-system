/**
 * Messages between the plugin main thread (src/plugin, Figma's sandbox) and
 * the plugin window (src/ui, an iframe). Both sides import these types, so a
 * change to a message is checked on both.
 */
import type { BindingRecord, OldInstance, ScanSummary } from '../scan/types'

/** The menu commands in manifest.json. */
export type Command = 'open' | 'dev-export-inventory' | 'dev-export-fixture'

export type Scope = 'page' | 'file'

export type DevExportFile = {
  /** File name for a download, such as new-library.json */
  fileName: string
  /** Where the file goes in the repository */
  path: string
  json: string
}

export type ScanProgress = {
  pageName: string
  pageIndex: number
  pageCount: number
  nodes: number
}

export type PluginToUi =
  | {
      type: 'init'
      command: Command
      mappingVersion: string
      fileName: string
      currentPageName: string
    }
  | { type: 'scan-progress'; progress: ScanProgress }
  | { type: 'scan-done'; summary: ScanSummary }
  | { type: 'scan-cancelled' }
  | {
      type: 'entry-detail'
      entryId: string
      records: BindingRecord[]
      oldInstances: OldInstance[]
    }
  | {
      type: 'dev-export'
      files: DevExportFile[]
      /** What could not be exported, and why */
      notes: string[]
    }
  | { type: 'error'; message: string }

export type UiToPlugin =
  | { type: 'ready' }
  | { type: 'scan'; scope: Scope }
  | { type: 'cancel-scan' }
  | { type: 'get-entry'; entryId: string }
  /** Selects layers in Figma and scrolls to them, switching page when needed */
  | { type: 'select'; nodeIds: string[] }
  | { type: 'run-dev-export-inventory' }
  | { type: 'run-dev-export-fixture' }
  | { type: 'notify'; message: string }
