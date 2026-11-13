/**
 * Messages between the plugin main thread (src/plugin, Figma's sandbox) and
 * the plugin window (src/ui, an iframe). Both sides import these types, so a
 * change to a message is checked on both.
 */
import type { DisplaySettings } from './window'
import type { FilePage } from './pages'
import type { MappingGroup, OverrideValue, Overrides } from '../scan/mapping'
import type { Report } from '../scan/report'
import type {
  BindingRecord,
  ComponentInstance,
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
  /** Of the changes made: values bound to EDS Foundation variables or text styles */
  values: number
  /** Of the changes made: values set as numbers, such as border widths */
  numbers: number
  /** Of the changes made: legacy modes removed or replaced */
  modes: number
  /** Layers changed */
  layers: number
  /** Legacy modes left in place because layers below still use legacy variables */
  modesKept: number
  /** Layers inside instances the run reset for a Manual fix, whether the size came out right or not */
  resets: number
  /** Manual fixes that failed: their acceptance is withdrawn, so they are Manual fixes again */
  failedFixes: string[]
  failed: ChangeFailure[]
}

export type ConvertResult = {
  converted: number
  /** Converted instances that used mono numbers, which a text style cannot carry */
  monoNumbers: number
  /** The new text layers that need tabular figures set by hand */
  monoNumberIds: string[]
  /**
   * The new text layers whose instance had another text case, such as
   * uppercase. A text style cannot carry it, and setting it would detach
   * the style, so the style is kept.
   */
  caseIds: string[]
  /** Instances of main components whose own text was kept on the new text layer */
  instanceTexts: number
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

/**
 * A selection that is one or more main components, or one layer inside a
 * main component, which the window marks in Figma's component colour.
 */
export type SelectionComponent =
  | { kind: 'main' }
  /** The component, or its component set when it is a variant */
  | { kind: 'inside'; name: string }

export type ScanProgress = {
  pageName: string
  pageIndex: number
  pageCount: number
  /** Layers read so far, on every page */
  nodes: number
  /** Index in the page's map of the top-level layer being read */
  current?: number
  /** Top-level layers on the page's map that are read */
  tilesDone?: number
  /**
   * Where EDS values were found since the previous message, for the window
   * to draw on the map. A sample: at most one per layer, and only so many
   * per message and per page, so a large page does not flood the window.
   */
  dots?: ScanDot[]
}

/** A rectangle on the scan map: x, y, width and height in px, from the top left corner of the area the map covers. */
export type MapRect = [number, number, number, number]

/**
 * The top-level layers a scan reads on one page, with their place on the
 * page, so the window can draw the page and show which layer is being read.
 */
export type ScanMap = {
  pageId: string
  /** Width and height of the area the layers cover, in px */
  width: number
  height: number
  /** Frames, components and loose layers, in the order the scan reads them */
  tiles: MapRect[]
  /** Sections, drawn behind the layers in them */
  sections: MapRect[]
}

/**
 * A layer where the scan found an EDS value: x and y of its centre on the
 * map, and 1 for a legacy value or 0 for a Beta value.
 */
export type ScanDot = [number, number, 0 | 1]

export type PluginToUi =
  | {
      type: 'init'
      command: Command
      mappingVersion: string
      fileName: string
      currentPageName: string
    }
  /** The current selection, sent when the window opens and when it changes */
  | {
      type: 'selection'
      count: number
      firstName?: string
      component?: SelectionComponent
    }
  /**
   * The pages in the file and the ones a scan of the file leaves out, sent
   * when the window opens, when the page changes, when the page picker opens
   * and after the choice is changed
   */
  | { type: 'pages'; pages: FilePage[]; leftOut: string[] }
  /** A scan starts; sent before anything else of it */
  | { type: 'scan-start'; scope: Scope; pageCount: number }
  /** The layers on the next page, sent when the page is loaded and before it is read */
  | { type: 'scan-map'; pageIndex: number; map: ScanMap }
  | { type: 'scan-progress'; progress: ScanProgress }
  | { type: 'scan-done'; summary: ScanSummary }
  /** The same scan counted again after targets were changed */
  | { type: 'summary'; summary: ScanSummary }
  | { type: 'apply-progress'; done: number; total: number }
  | { type: 'apply-done'; result: ApplyResult }
  | { type: 'revert-done'; result: RevertResult }
  | { type: 'convert-done'; result: ConvertResult }
  /** The current page changed since the scan, by an undo or an edit */
  | { type: 'stale' }
  /** Every binding still to migrate, grouped by legacy variable, sent after a scan */
  | { type: 'mapping'; groups: MappingGroup[] }
  /** Every instance in the scan that still uses legacy variables */
  | { type: 'instances'; instances: OldInstance[] }
  /** The latest scan saved in the file, sent when the window opens */
  | { type: 'saved-health'; saved: SavedHealth }
  /** The person's own preferences, sent when the window opens */
  | { type: 'prefs'; introSeen: boolean; settings: DisplaySettings }
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
      /** For a main component, or a layer inside one: every instance in it */
      instances?: ComponentInstance[]
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
  /** Sends the pages again, as the page picker opens, since pages may have been added or renamed */
  | { type: 'get-pages' }
  /** The pages a scan of the file leaves out, kept in the file */
  | { type: 'set-left-out-pages'; pageIds: string[] }
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
  /** Applies the Ready changes among the bindings a designer has selected */
  | { type: 'apply-selected'; recordIds: string[] }
  /** Puts back what the plugin changed in an entry, from the change log */
  | { type: 'revert'; entryId: string }
  /** Builds the report of the latest scan */
  | { type: 'get-report' }
  /** Goes to the page a main component is on, selects it and scans the page */
  | { type: 'scan-page-of'; nodeId: string }
  /** The introduction was closed, so it does not open by itself again */
  | { type: 'intro-seen' }
  | { type: 'save-settings'; settings: DisplaySettings }
  /** Puts the window back to its first size and forgets the saved one */
  | { type: 'reset-window-size' }
  /** Replaces Typography component instances with text layers */
  | { type: 'convert-typography'; instanceIds: string[] }
  /** Resizes the window; done when the drag ends, so the size is kept */
  | { type: 'resize'; width: number; height: number; done: boolean }
  | { type: 'run-dev-export-inventory' }
  | { type: 'run-dev-export-fixture' }
  | { type: 'notify'; message: string }
