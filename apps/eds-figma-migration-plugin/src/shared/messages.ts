/**
 * Messages between the plugin main thread (src/plugin, Figma's sandbox) and
 * the plugin window (src/ui, an iframe). Both sides import these types, so a
 * change to a message is checked on both.
 */
import type { DisplaySettings } from './window'
import type { FilePage } from './pages'
import type { ConversionPreview, RunPreview } from '../scan/apply-plan'
import type {
  KeptModes,
  MappingGroup,
  OverrideValue,
  Overrides,
  RowChoiceTarget,
} from '../scan/mapping'
import type { Report } from '../scan/report'
import type {
  BindingRecord,
  ComponentInstance,
  ComponentSource,
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
  /** Of the changes made: numbers set without a variable, such as a padding of 0 or a border width */
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
  /**
   * Instances Convert left as they are, because their text style is not
   * Ready after the designer's choices, and why
   */
  skipped: { nodeId: string; nodeName: string; reason: string }[]
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
  /**
   * A scan starts; sent before anything else of it. `target` is the same for
   * two scans of the same layers (scanKey in shared/pages.ts).
   */
  | { type: 'scan-start'; scope: Scope; pageCount: number; target: string }
  /** The layers on the next page, sent when the page is loaded and before it is read */
  | { type: 'scan-map'; pageIndex: number; map: ScanMap }
  | { type: 'scan-progress'; progress: ScanProgress }
  | { type: 'scan-done'; summary: ScanSummary }
  /** The same scan counted again after targets were changed */
  | { type: 'summary'; summary: ScanSummary }
  /**
   * The legacy modes the next Apply keeps, by record id, with what each
   * waits for, and every legacy mode that values below read and the run
   * leaves (`blocked`, apply-plan.ts, modeWaits). Sent before every
   * `scan-done` and `summary`, since they follow the designer's choices:
   * the summary counts a kept mode that is only cleared as No equivalent
   * (Waiting), and the window does the same.
   */
  | { type: 'kept-modes'; kept: KeptModes; blocked: Record<string, string> }
  /** The answer to a `preview` request: what the run would do */
  | { type: 'preview'; id: number; preview: RunPreview }
  /** The answer to a `preview-convert` request: what Convert would do */
  | { type: 'convert-preview'; id: number; preview: ConversionPreview }
  | { type: 'apply-progress'; done: number; total: number }
  | { type: 'apply-done'; result: ApplyResult }
  | { type: 'revert-done'; result: RevertResult }
  | { type: 'convert-done'; result: ConvertResult }
  /** The current page changed since the scan, by an undo or an edit */
  | { type: 'stale' }
  /** Every binding still to migrate, grouped by legacy variable, sent after a scan */
  | { type: 'mapping'; groups: MappingGroup[] }
  /**
   * The text style and colour of each Typography instance, grouped like
   * `mapping`, for the Typography tab; sent after a scan
   */
  | { type: 'conversions'; groups: MappingGroup[] }
  /** Instances of the main components that have a Typography instance in them, by component id */
  | { type: 'typography-components'; counts: Record<string, number> }
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
  /** The source check starts, for `total` main components (src/plugin/scan/sources.ts) */
  | { type: 'sources-start'; total: number }
  /** The check starts on the main component with this key */
  | { type: 'source-checking'; key: string }
  /** The source of the main component with this key, as the check finds it */
  | { type: 'source'; key: string; source: ComponentSource }
  /** The check ended; stopped when the designer stopped it before the last main component */
  | { type: 'sources-done'; stopped?: true }
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
   * Sets targets for single values, from the inspector, Review and the bulk
   * bar, in one batch. Undefined removes the choice, so the row's target or
   * the proposal applies again. A choice on a row is sent as `row-choice`.
   */
  | { type: 'set-overrides'; changes: OverrideChange[] }
  /**
   * A target chosen on a row, or undefined to undo the change on the row.
   * The plugin makes it in one step: a target puts the choices on the row's
   * values aside, and undoing it brings them back, except on a value with a
   * choice of its own again (withRowChoice in scan/mapping.ts).
   */
  | { type: 'row-choice'; row: RowChoiceTarget; value?: OverrideValue }
  /** Applies every Ready change in the entries */
  | { type: 'apply'; entryIds: string[] }
  /** Applies the Ready changes among the bindings a designer has selected */
  | { type: 'apply-selected'; recordIds: string[] }
  /**
   * Asks what a run would do, as an Apply confirmation opens: Apply in the
   * entries, or with `recordIds`, Apply on the selected values. The plugin
   * answers with a `preview` of the same id.
   */
  | { type: 'preview'; id: number; entryIds?: string[]; recordIds?: string[] }
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
  /**
   * Replaces Typography component instances with text layers, each with the
   * text style and colour its rows on the Typography tab show
   */
  | { type: 'convert-typography'; instanceIds: string[] }
  /**
   * Asks what Convert would do with the instances, as the Convert
   * confirmation opens. The plugin answers with a `convert-preview` of the
   * same id.
   */
  | { type: 'preview-convert'; id: number; instanceIds: string[] }
  /** Counts the instances of the main components that have a Typography instance in them */
  | { type: 'get-typography-components' }
  /**
   * Finds where the legacy values of the instances on the Instances tab can
   * be fixed, by importing each library main component by its key. Asked for
   * by the designer, since each import leaves a hidden copy of the library's
   * latest version in the file.
   */
  | { type: 'check-sources' }
  /**
   * Stops the source check at once: the import under way goes on in Figma,
   * but its answer is dropped.
   */
  | { type: 'cancel-sources' }
  /**
   * Resizes the window; done when the drag ends, so the size is kept. With
   * fit, the window shrinks to the room Figma gives it (src/ui/fit.ts), below
   * the smallest size a drag allows if it has to, and the size is not kept.
   */
  | {
      type: 'resize'
      width: number
      height: number
      done: boolean
      fit?: true
    }
  | { type: 'run-dev-export-inventory' }
  | { type: 'run-dev-export-fixture' }
  | { type: 'notify'; message: string }
