/**
 * Messages between the plugin main thread (src/plugin, Figma's sandbox) and
 * the plugin window (src/ui, an iframe). Both sides import these types, so a
 * change to a message is checked on both.
 */
import type { MappingGroup, OverrideValue, Overrides } from '../scan/mapping'
import type { Report } from '../scan/report'
import type {
  BindingRecord,
  Counts,
  OldInstance,
  ScanSummary,
} from '../scan/types'

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

/** A change that could not be made or undone, and why. */
export type ChangeFailure = {
  nodeId: string
  nodeName: string
  property: string
  message: string
}

export type ApplyResult = {
  /** Changes the run tried */
  planned: number
  applied: number
  /** Layers changed */
  layers: number
  /** Legacy modes left in place because layers below still use legacy variables */
  modesKept: number
  failed: ChangeFailure[]
}

export type RevertResult = {
  reverted: number
  layers: number
  failed: ChangeFailure[]
}

/** The latest scan, kept in the file and shown when the plugin opens. */
export type SavedHealth = {
  scannedAt: string
  /** “Page Well overview”, “The whole file”, … */
  place: string
  nodesScanned: number
  totals: Counts
  health: number | null
  /** The frames with the lowest health, up to 20 */
  frames: { name: string; pageName: string; health: number | null }[]
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
  /** The same scan counted again after targets were changed */
  | { type: 'summary'; summary: ScanSummary }
  | { type: 'apply-progress'; done: number; total: number }
  | { type: 'apply-done'; result: ApplyResult }
  | { type: 'revert-done'; result: RevertResult }
  /** Every binding still to migrate, grouped by legacy variable, sent after a scan */
  | { type: 'mapping'; groups: MappingGroup[] }
  /** Every instance in the scan that still uses legacy variables */
  | { type: 'instances'; instances: OldInstance[] }
  /** The latest scan saved in the file, sent when the window opens */
  | { type: 'saved-health'; saved: SavedHealth }
  | { type: 'report'; report: Report }
  /** The choices could not be kept in the file */
  | { type: 'choices-not-saved' }
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
  /** Switches Figma to a page */
  | { type: 'go-to-page'; pageId: string }
  /** Selects every layer with a binding to migrate that uses one legacy variable */
  | { type: 'select-old'; oldKey: string }
  /**
   * Sets targets for bindings or for rows in the Mapping view, in one batch.
   * A value of null leaves the legacy binding as it is; undefined removes the
   * override, so the row's target or the proposal applies again.
   */
  | { type: 'set-overrides'; changes: OverrideChange[] }
  /** Applies every Ready change in the entries */
  | { type: 'apply'; entryIds: string[] }
  /** Puts back what the plugin changed in an entry, from the change log */
  | { type: 'revert'; entryId: string }
  /** Builds the report of the latest scan */
  | { type: 'get-report' }
  | { type: 'run-dev-export-inventory' }
  | { type: 'run-dev-export-fixture' }
  | { type: 'notify'; message: string }
