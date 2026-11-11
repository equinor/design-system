/**
 * Messages between the plugin main thread (src/plugin, Figma's sandbox) and
 * the plugin window (src/ui, an iframe). Both sides import these types, so a
 * change to a message is checked on both.
 */
import type { MappingGroup, OverrideValue, Overrides } from '../scan/mapping'
import type { BindingRecord, OldInstance, ScanSummary } from '../scan/types'

/** The menu commands in manifest.json. */
export type Command = 'open' | 'dev-export-inventory' | 'dev-export-fixture'

export type Scope = 'selection' | 'page' | 'file'

export type DevExportFile = {
  /** File name for a download, such as new-library.json */
  fileName: string
  /** Where the file goes in the repository */
  path: string
  json: string
}

export type OverrideTarget =
  { type: 'record'; id: string } | { type: 'row'; key: string }

export type OverrideChange = {
  target: OverrideTarget
  value?: OverrideValue
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
  /** The current selection, sent when the window opens and when it changes */
  | { type: 'selection'; count: number; firstName?: string }
  | { type: 'scan-progress'; progress: ScanProgress }
  | { type: 'scan-done'; summary: ScanSummary }
  /** Every binding still to migrate, grouped by legacy variable, sent after a scan */
  | { type: 'mapping'; groups: MappingGroup[] }
  | { type: 'overrides'; overrides: Overrides }
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
  /** Selects every layer with a binding to migrate that uses one legacy variable */
  | { type: 'select-old'; oldKey: string }
  /**
   * Sets targets for bindings or for rows in the Mapping view, in one batch.
   * A value of null leaves the legacy binding as it is; undefined removes the
   * override, so the row's target or the proposal applies again.
   */
  | { type: 'set-overrides'; changes: OverrideChange[] }
  | { type: 'run-dev-export-inventory' }
  | { type: 'run-dev-export-fixture' }
  | { type: 'notify'; message: string }
