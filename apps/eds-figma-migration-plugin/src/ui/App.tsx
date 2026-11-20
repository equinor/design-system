import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Badge, Banner, Button, Icon } from '@equinor/eds-core-react/next'
import { tune } from '@equinor/eds-icons'
import { schemesOf } from '../mapping/scheme'
import { sharedSubject } from '../mapping/picker'
import type { BindingKind } from '../mapping/types'
import {
  DECIDE_LATER,
  NO_KEPT_MODES,
  NO_OVERRIDES,
  choicesToBringBack,
  choicesToBringBackAfter,
  effectiveTarget,
  filterGroups,
  ownChoices,
  readyCount,
  rowChoiceTarget,
  rowCurrent,
  rowKey,
  wholeRow,
} from '../scan/mapping'
import type {
  KeptModes,
  MappingBinding,
  MappingGroup,
  MappingRow,
  OverrideValue,
  Overrides,
} from '../scan/mapping'
import { propertyLabel } from './labels'
import type { Report } from '../scan/report'
import {
  formatHealth,
  healthOf,
  healthOutsideInstances,
  oldCount,
  scoredTotal,
  sumCounts,
} from '../scan/summary'
import type {
  BindingRecord,
  ComponentInstance,
  ComponentSource,
  EntrySummary,
  OldInstance,
  ScanSummary,
} from '../scan/types'
import type {
  Command,
  DevExportFile,
  OverrideChange,
  PluginToUi,
  SavedHealth as Saved,
  Scope,
} from '../shared/messages'
import { DEFAULT_SETTINGS } from '../shared/window'
import type { DisplaySettings } from '../shared/window'
import { pagesToScan, scannablePages } from '../shared/pages'
import type { FilePage } from '../shared/pages'
import { ApplyActions } from './components/ApplyActions'
import { BulkBar } from './components/BulkBar'
import { DevExport } from './components/DevExport'
import { ExportReport } from './components/ExportReport'
import { EntryList } from './components/EntryList'
import { HealthBar, HealthLegend } from './components/HealthBar'
import { Inspector } from './components/Inspector'
import { InstancesView } from './components/InstancesView'
import type { SourceCheck } from './components/InstancesView'
import {
  MainComponentsView,
  mainComponentsElsewhere,
} from './components/MainComponentsView'
import type { PartialFile } from './components/MainComponentsView'
import { MappingView } from './components/MappingView'
import type { ChangesTab } from './components/MappingView'
import { TypographyView } from './components/TypographyView'
import { ReviewView } from './components/ReviewView'
import { SavedHealth } from './components/SavedHealth'
import { Onboarding } from './components/Onboarding'
import { SettingsDialog } from './components/SettingsDialog'
import { ResizeHandle } from './components/ResizeHandle'
import { RunResult } from './components/RunResult'
import type { Run } from './components/RunResult'
import { ScanControls } from './components/ScanControls'
import { ScanLoader, prefersReducedMotion } from './components/ScanLoader'
import type { ScanFinale } from './components/ScanLoader'
import { NO_TRACE, traceScan } from './scanTrace'
import { Tabs } from './components/Tabs'
import { TargetPicker } from './components/TargetPicker'
import type { PickerRequest } from './components/TargetPicker'
import type { SelectionInfo } from './components/ScanControls'
import { send, useFigmaColorScheme, usePluginMessages } from './figma'
import { reviewItems } from './review'
import type { ReviewItem } from './review'
import { modePickerExtra, modePickerNote, rowChoicesNote } from './targets'
import { selectionStatus, useSelection } from './selection'
import type { Selection } from './selection'

/** What the picker says on a Manual fix: what the plugin does when the fix is accepted. */
const MANUAL_FIX_PICKER =
  'Figma lets nobody change this size inside the instance. Choose the fix to let the plugin reset the layer, swap it back if it was swapped, and set its other changes again, or decide later.'

type EntryDetail = {
  entryId: string
  records: BindingRecord[]
  oldInstances: OldInstance[]
  /** For a main component: every instance in it */
  instances?: ComponentInstance[]
}

type View = 'frames' | 'mapping' | 'instances' | 'components'

/** How long the end of the first scan stays on screen before the results */
const FINALE_MS = 1600

function Overview({
  summary,
  view,
  onView,
  mapping,
  overrides,
  kept,
  onOpen,
  onGoTo,
  onSelectOld,
  onChangeRow,
  onChangeBinding,
  onSelectLayer,
  selection,
  busy,
  onApply,
  instances,
  onReview,
  report,
  onReport,
  onCloseReport,
  showCounts,
  showEmpty,
  onScanPageOf,
  onScanFile,
  partialFile,
  onConvert,
  conversions,
  componentCounts,
  onCountComponents,
  onReviewConversions,
  sources,
  sourceCheck,
  onCheckSources,
  onStopSources,
}: {
  summary: ScanSummary
  view: View
  onView: (view: View) => void
  mapping: MappingGroup[]
  overrides: Overrides
  /** The legacy modes the next Apply keeps, from the plugin */
  kept: KeptModes
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
  onSelectOld: (oldKey: string) => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
  onSelectLayer: (nodeIds: string[]) => void
  selection: Selection
  busy: boolean
  onApply: (entryIds: string[]) => void
  instances: OldInstance[]
  /** Opens the review, of the entries given or of the whole scope */
  onReview: (entryIds?: string[]) => void
  report?: Report
  onReport: () => void
  onCloseReport: () => void
  showCounts: boolean
  showEmpty: boolean
  onScanPageOf: (nodeId: string) => void
  onScanFile: () => void
  /** Set when the page picker leaves pages out of a scan of the file */
  partialFile?: PartialFile
  onConvert: (instanceIds: string[]) => void
  /** The text style and colour of each Typography instance, for the Typography tab */
  conversions: MappingGroup[]
  /** Instances of the main components with a Typography instance in them, once counted */
  componentCounts?: Record<string, number>
  onCountComponents: () => void
  /** Opens Review with the conversion values that wait for a decision */
  onReviewConversions: (items: ReviewItem[]) => void
  sources: ReadonlyMap<string, ComponentSource>
  sourceCheck?: SourceCheck
  onCheckSources: () => void
  onStopSources: () => void
}) {
  const entryNames = new Map(
    summary.entries.map((entry) => [entry.id, entry.name]),
  )
  // The legacy Typography component is converted on its own tab in Changes,
  // and the Instances tab lists the other instances with a link there.
  const typographyInstances = instances.filter(
    (instance) => instance.typography,
  )
  const otherInstances = instances.filter((instance) => !instance.typography)
  // Kept here rather than in Changes, so the Instances tab can open a tab
  // in Changes, and Changes opens on the tab it was left on.
  const [changesTab, setChangesTab] = useState<ChangesTab>('colour')
  // The tab in What Apply changes on the Main components tab, kept the same
  // way, so the Main components tab opens on the tab it was left on.
  const [componentsTab, setComponentsTab] = useState<ChangesTab>('colour')
  const frames = summary.entries.filter((entry) => entry.kind !== 'component')
  const components = summary.entries.filter(
    (entry) => entry.kind === 'component',
  )
  const componentIds = components.map((entry) => entry.id)
  // The values the Apply on the Main components tab can change: the rows
  // of Changes narrowed to the main components, with their row keys, so the
  // choices made in Changes apply to them as well.
  const componentGroups = filterGroups(mapping, new Set(componentIds))
  // Main components in the scope count like the frames, and Apply changes
  // them too; the Main components tab lists them with those used elsewhere.
  const totals = summary.totals
  const applied = summary.entries
  const changes = mapping
  const componentsTabCount =
    components.filter((entry) => oldCount(entry.counts) > 0).length +
    mainComponentsElsewhere(components, instances).length
  // UX review F8: Apply says where it applies.
  const readyIn = applied.filter((entry) => entry.counts.sure > 0)
  const pageCount = new Set(readyIn.map((entry) => entry.pageId)).size
  // Test session finding 15: main components are named as such, with the
  // instances that change with them.
  const readyFrames = readyIn.filter((entry) => entry.kind !== 'component')
  const readyComponents = readyIn.filter((entry) => entry.kind === 'component')
  const reachParts = [
    readyFrames.length > 0 &&
      `${readyFrames.length} frame${readyFrames.length === 1 ? '' : 's'}`,
    readyComponents.length > 0 &&
      `${readyComponents.length} main component${readyComponents.length === 1 ? '' : 's'}`,
  ].filter((part): part is string => Boolean(part))
  const reach =
    readyIn.length === 0
      ? undefined
      : `in ${reachParts.join(' and ')}${
          pageCount > 1 ? ` on ${pageCount} pages` : ''
        }`
  const mainComponents =
    readyComponents.length > 0
      ? {
          count: readyComponents.length,
          instances: readyComponents.reduce(
            (sum, entry) => sum + (entry.instanceCount ?? 0),
            0,
          ),
        }
      : undefined
  // The Main components tab applies to its main components only, all of
  // them in one run, and leaves the frames in the scope as they are.
  const componentsReady = components.filter((entry) => entry.counts.sure > 0)
  const componentPages = new Set(componentsReady.map((entry) => entry.pageId))
    .size
  const componentFooter = {
    // The Ready values What Apply changes lists, so the footer counts what
    // the tab shows. It is the same as the Ready count of the main
    // components in the health bar (test/main-components.test.ts).
    ready: readyCount(componentGroups, overrides, kept),
    toReview: reviewItems(componentGroups, overrides, undefined, kept).length,
    where:
      componentsReady.length === 0
        ? 'in the main components'
        : `in ${componentsReady.length} main component${componentsReady.length === 1 ? '' : 's'}${
            componentPages > 1 ? ` on ${componentPages} pages` : ''
          }`,
    mainComponents:
      componentsReady.length > 0
        ? {
            count: componentsReady.length,
            instances: componentsReady.reduce(
              (sum, entry) => sum + (entry.instanceCount ?? 0),
              0,
            ),
          }
        : undefined,
    entryIds: componentIds,
    done: healthOf(sumCounts(components.map((entry) => entry.counts))) === 1,
  }
  const outside = healthOutsideInstances(totals)
  // UX review F3: where the work is, across pages.
  const mostWork = frames
    .filter((entry) => oldCount(entry.counts) > 0)
    .sort((a, b) => oldCount(b.counts) - oldCount(a.counts))
    .slice(0, 3)
  return (
    <div className="stack">
      <section className="stack-tight" aria-labelledby="health-title">
        <div className="health-heading">
          <h2 id="health-title" className="section-title">
            Health
          </h2>
          <span className="health-value">{formatHealth(healthOf(totals))}</span>
        </div>
        <HealthBar counts={totals} />
        <HealthLegend counts={totals} />
        {/* Test session finding 7: health counts every value inside
            instances, so a complete run can still read 6%. */}
        {totals.inInstance > 0 && outside !== null && (
          <p className="muted">
            Outside instances: {formatHealth(outside)} migrated. The values
            instances take from their main component change with it or its
            library.
          </p>
        )}

        {scoredTotal(totals) === 0 ? (
          <p className="muted">
            No layer in the scope uses EDS variables. Choose another scope, or
            scan the whole file.
          </p>
        ) : (
          oldCount(totals) === 0 && (
            <Banner tone="success">
              <Banner.Message>
                Everything in the scope uses the EDS Beta tokens. Nothing is
                left to migrate.
              </Banner.Message>
            </Banner>
          )
        )}
        <div className="scope-line">
          <p className="muted">
            {summary.scope === 'file'
              ? `${summary.pages.length} pages`
              : summary.scope === 'selection'
                ? `Selection on ${summary.pages[0]?.name}`
                : summary.pages[0]?.name}
            , {summary.nodesScanned} layers
          </p>
          <ExportReport
            report={report}
            onRequest={onReport}
            onClose={onCloseReport}
          />
        </div>
      </section>

      <Tabs
        label="View"
        tabs={[
          { id: 'mapping', label: 'Changes' },
          { id: 'frames', label: 'Frames' },
          { id: 'instances', label: `Instances ${otherInstances.length}` },
          {
            id: 'components',
            label: `Main components ${componentsTabCount}`,
          },
        ]}
        selected={view}
        onSelect={onView}
      >
        {view === 'instances' ? (
          <InstancesView
            instances={otherInstances}
            entries={summary.entries}
            onSelect={onSelectLayer}
            typographyCount={typographyInstances.length}
            onShowTypography={() => {
              setChangesTab('typography-component')
              onView('mapping')
            }}
            sources={sources}
            sourceCheck={sourceCheck}
            onCheckSources={onCheckSources}
            onStopSources={onStopSources}
          />
        ) : view === 'components' ? (
          <MainComponentsView
            components={components}
            instances={instances}
            showPages={summary.scope === 'file'}
            onGoToPage={(pageId) => send({ type: 'go-to-page', pageId })}
            onOpen={onOpen}
            onGoTo={onGoTo}
            onSelect={onSelectLayer}
            onScanPageOf={onScanPageOf}
            onScanFile={onScanFile}
            partialFile={partialFile}
            busy={busy}
            groups={componentGroups}
            overrides={overrides}
            kept={kept}
            entryNames={entryNames}
            selection={selection}
            showCounts={showCounts}
            tab={componentsTab}
            onTab={setComponentsTab}
            onChangeRow={onChangeRow}
            onChangeBinding={onChangeBinding}
          />
        ) : view === 'mapping' ? (
          <MappingView
            groups={changes}
            overrides={overrides}
            kept={kept}
            entryNames={entryNames}
            showCounts={showCounts}
            inInstances={totals.inInstance}
            tab={changesTab}
            onTab={setChangesTab}
            typography={
              typographyInstances.length > 0
                ? {
                    count: typographyInstances.length,
                    content: (
                      <TypographyView
                        instances={typographyInstances}
                        groups={conversions}
                        overrides={overrides}
                        entryNames={entryNames}
                        showCounts={showCounts}
                        componentCounts={componentCounts}
                        onCountComponents={onCountComponents}
                        onSelect={onSelectLayer}
                        onChangeRow={onChangeRow}
                        onChangeBinding={onChangeBinding}
                        onReview={onReviewConversions}
                        onConvert={onConvert}
                        busy={busy}
                      />
                    ),
                  }
                : undefined
            }
            selection={selection}
            onSelectOld={onSelectOld}
            onSelectLayer={onSelectLayer}
            onChangeRow={onChangeRow}
            onChangeBinding={onChangeBinding}
          />
        ) : (
          <div className="stack">
            <section className="stack-tight" aria-labelledby="frames-title">
              <h2 id="frames-title" className="section-title">
                Frames and layers
              </h2>
              {mostWork.length > 1 && summary.scope !== 'selection' && (
                <div className="most-work">
                  <h3 className="group-title">Most work left</h3>
                  <ul className="entry-list">
                    {mostWork.map((entry) => (
                      <li key={entry.id} className="entry-row">
                        <div className="entry-info">
                          <span className="entry-name">{entry.name}</span>
                          <span className="entry-meta">
                            {entry.pageName}, {oldCount(entry.counts)} legacy
                            values
                            {entry.counts.check > 0
                              ? `, ${entry.counts.check} to check`
                              : ''}
                          </span>
                        </div>
                        <div className="entry-actions">
                          <Button
                            size="small"
                            variant="secondary"
                            aria-label={`Open ${entry.name}`}
                            onClick={() => onOpen(entry)}
                          >
                            Open
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {frames.length === 0 ? (
                <p className="muted">Nothing in the scope.</p>
              ) : (
                <EntryList
                  entries={frames}
                  showPages={summary.scope === 'file'}
                  onGoToPage={(pageId) => send({ type: 'go-to-page', pageId })}
                  onOpen={onOpen}
                  onGoTo={onGoTo}
                  showEmpty={showEmpty}
                />
              )}
            </section>
          </div>
        )}
      </Tabs>
      {selection.items.size === 0 &&
        (view === 'components' && components.length > 0 ? (
          <ApplyActions
            key="components"
            ready={componentFooter.ready}
            toReview={componentFooter.toReview}
            where={componentFooter.where}
            kind="component"
            mainComponents={componentFooter.mainComponents}
            done={componentFooter.done}
            busy={busy}
            preview={{ entryIds: componentFooter.entryIds }}
            onReview={() => onReview(componentFooter.entryIds)}
            onApply={() => onApply(componentFooter.entryIds)}
          />
        ) : (
          <ApplyActions
            key="scope"
            ready={totals.sure}
            toReview={reviewItems(mapping, overrides, undefined, kept).length}
            where={reach ?? 'in the scope'}
            mainComponents={mainComponents}
            done={healthOf(totals) === 1}
            busy={busy}
            preview={{ entryIds: applied.map((entry) => entry.id) }}
            onReview={() => onReview()}
            onApply={() => onApply(applied.map((entry) => entry.id))}
          />
        ))}
    </div>
  )
}

export function App() {
  const bulk = useSelection()
  const clearBulk = bulk.clear
  const [command, setCommand] = useState<Command>()
  const [selection, setSelection] = useState<SelectionInfo>({ count: 0 })
  // The pages in the file, and the ones a scan of the file leaves out.
  const [filePages, setFilePages] = useState<{
    pages: FilePage[]
    leftOut: string[]
  }>({ pages: [], leftOut: [] })
  const [scope, setScope] = useState<Scope>('page')
  const [scanning, setScanning] = useState(false)
  // What the scan loader draws: the page's map and how far the scan is.
  const [trace, dispatchTrace] = useReducer(traceScan, NO_TRACE)
  const [summary, setSummary] = useState<ScanSummary>()
  // The first scan after the window opens ends with its result for a
  // moment, before the window shows it (scan loader, finale).
  const [finale, setFinale] = useState<ScanFinale>()
  const hadSummary = useRef(false)
  const [openEntryId, setOpenEntryId] = useState<string>()
  const [detail, setDetail] = useState<EntryDetail>()
  // Test session finding 17: the scan is out of date after an undo or an edit.
  const [stale, setStale] = useState(false)
  // Check designs: the changes are the first thing shown after a scan.
  const [view, setView] = useState<View>('mapping')
  // Kept per person in clientStorage, and sent when the window opens.
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_SETTINGS)
  const { showCounts, showEmpty } = settings
  // Sets the window's own theme: Figma's, or the one chosen in Settings. The
  // colours shown for layers follow each layer's colour scheme instead
  // (scan/types.ts, BindingRecord.scheme).
  const windowScheme = useFigmaColorScheme(settings.theme)
  const changeSettings = (next: DisplaySettings) => {
    setSettings(next)
    send({ type: 'save-settings', settings: next })
  }
  const [settingsOpen, setSettingsOpen] = useState(false)
  // The introduction opens by itself once per person, then from Settings.
  const [introOpen, setIntroOpen] = useState(false)
  const [mapping, setMapping] = useState<MappingGroup[]>([])
  // The Typography tab: the text style and colour of each Typography
  // instance, and the instances of the main components they are in.
  const [conversions, setConversions] = useState<MappingGroup[]>([])
  const [componentCounts, setComponentCounts] =
    useState<Record<string, number>>()
  const [instances, setInstances] = useState<OldInstance[]>([])
  // Where the values of each library main component can be fixed, by key.
  // Kept across scans in a session: a library changes only when published.
  const [sources, setSources] = useState<Map<string, ComponentSource>>(
    () => new Map(),
  )
  const [sourceCheck, setSourceCheck] = useState<SourceCheck>()
  const [review, setReview] = useState<ReviewItem[]>()
  // Review of the conversions ends on a note about Convert, not Apply.
  const [reviewRun, setReviewRun] = useState<'Apply' | 'Convert'>('Apply')
  const [saved, setSaved] = useState<Saved>()
  const [report, setReport] = useState<Report>()
  const [choicesNotSaved, setChoicesNotSaved] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>(NO_OVERRIDES)
  // The legacy modes the next Apply keeps, which the plugin works out with
  // every count, so the window counts them as the health bar does.
  const [kept, setKept] = useState<KeptModes>(NO_KEPT_MODES)
  // Every legacy mode that values below read and the next Apply leaves,
  // with what clearing it waits for, for the pickers and Review.
  const [blocked, setBlocked] = useState<Record<string, string>>({})
  const [picker, setPicker] = useState<PickerRequest>()
  const [devExport, setDevExport] = useState<{
    files: DevExportFile[]
    notes: string[]
  }>()
  const [error, setError] = useState<string>()
  const [applying, setApplying] = useState<{ done: number; total: number }>()
  const [run, setRun] = useState<Run>()
  const openEntryRef = useRef<string | undefined>(undefined)
  // UX review F4: until the designer chooses a scope or scans, the scope
  // follows the selection: Selection when something is selected.
  const scopeChosen = useRef(false)
  // Final review FR1: after a scan the designer started, a selection opens
  // on Changes and a page or the file on Frames, where the work is.
  const userScan = useRef(false)
  // After Scan its page, the scan opens on the Main components tab.
  const toComponents = useRef(false)
  const [lastApplied, setLastApplied] = useState<string[]>([])
  useEffect(() => {
    openEntryRef.current = openEntryId
  }, [openEntryId])
  useEffect(() => {
    hadSummary.current = summary !== undefined
  }, [summary])
  useEffect(() => {
    if (!finale) return
    const timer = setTimeout(() => setFinale(undefined), FINALE_MS)
    return () => clearTimeout(timer)
  }, [finale])

  const onMessage = useCallback(
    (message: PluginToUi) => {
      switch (message.type) {
        case 'init':
          setCommand(message.command)
          break
        case 'selection':
          setSelection({
            count: message.count,
            firstName: message.firstName,
            component: message.component,
          })
          if (!scopeChosen.current) {
            setScope(message.count > 0 ? 'selection' : 'page')
          }
          break
        case 'pages':
          setFilePages({ pages: message.pages, leftOut: message.leftOut })
          break
        case 'scan-start':
        case 'scan-map':
        case 'scan-progress':
          dispatchTrace(message)
          break
        case 'scan-done': {
          scopeChosen.current = true
          // A scan of one selected main component, such as a component set,
          // opens it: there is nothing else in the scan to choose.
          const { entries } = message.summary
          const onlyComponent =
            userScan.current &&
            message.summary.scope === 'selection' &&
            entries.length === 1 &&
            entries[0].kind === 'component'
              ? entries[0].id
              : undefined
          if (userScan.current) {
            userScan.current = false
            setView(
              toComponents.current || onlyComponent
                ? 'components'
                : message.summary.scope === 'selection'
                  ? 'mapping'
                  : 'frames',
            )
            toComponents.current = false
          }
          setScanning(false)
          setStale(false)
          if (!hadSummary.current && !prefersReducedMotion()) {
            setFinale({
              // The same health the overview shows after the finale.
              health: healthOf(message.summary.totals),
              totals: message.summary.totals,
              nodes: message.summary.nodesScanned,
            })
          }
          setSummary(message.summary)
          setReview(undefined)
          setComponentCounts(undefined)
          clearBulk()
          // After an apply or a revert the plugin scans again; an open
          // frame stays open when it is still in the scan. Its layers stay
          // listed until the new ones arrive, so the list does not collapse
          // to Loading and lose the place the designer was at.
          const openId = onlyComponent ?? openEntryRef.current
          if (onlyComponent && onlyComponent !== openEntryRef.current) {
            setOpenEntryId(onlyComponent)
            setDetail(undefined)
          }
          if (
            openId &&
            message.summary.entries.some((entry) => entry.id === openId)
          ) {
            send({ type: 'get-entry', entryId: openId })
          } else {
            setOpenEntryId(undefined)
            setDetail(undefined)
          }
          break
        }
        case 'apply-progress':
          setApplying({ done: message.done, total: message.total })
          break
        case 'apply-done':
          setApplying(undefined)
          setRun({ kind: 'apply', result: message.result })
          setScanning(true)
          dispatchTrace({ type: 'trace-reset' })
          break
        case 'revert-done':
          setApplying(undefined)
          setRun({ kind: 'revert', result: message.result })
          setScanning(true)
          dispatchTrace({ type: 'trace-reset' })
          break
        case 'convert-done':
          setApplying(undefined)
          setRun({ kind: 'convert', result: message.result })
          setScanning(true)
          dispatchTrace({ type: 'trace-reset' })
          break
        case 'summary':
          setSummary(message.summary)
          break
        case 'kept-modes':
          setKept(message.kept)
          setBlocked(message.blocked)
          break
        case 'stale':
          setStale(true)
          break
        case 'scan-cancelled':
          setScanning(false)
          break
        case 'mapping':
          setMapping(message.groups)
          break
        case 'conversions':
          setConversions(message.groups)
          break
        case 'typography-components':
          setComponentCounts(message.counts)
          break
        case 'instances':
          setInstances(message.instances)
          break
        case 'sources-start':
          setSourceCheck((previous) => ({
            done: 0,
            total: message.total,
            running: true,
            checked: [],
            runs: previous?.runs ?? 0,
          }))
          break
        case 'source-checking': {
          const { key } = message
          setSourceCheck(
            (previous) => previous && { ...previous, current: key },
          )
          break
        }
        case 'source': {
          const { key, source } = message
          setSources((previous) => new Map(previous).set(key, source))
          setSourceCheck(
            (previous) =>
              previous && {
                ...previous,
                done: previous.done + 1,
                checked: [...previous.checked, key],
              },
          )
          break
        }
        case 'sources-done':
          setSourceCheck((previous) => ({
            done: previous?.done ?? 0,
            total: previous?.total ?? 0,
            running: false,
            checked: previous?.checked ?? [],
            runs: (previous?.runs ?? 0) + 1,
            ...(message.stopped ? { stopped: true } : {}),
          }))
          break
        case 'saved-health':
          setSaved(message.saved)
          break
        case 'prefs':
          setSettings(message.settings)
          if (!message.introSeen) setIntroOpen(true)
          break
        case 'report':
          setReport(message.report)
          break
        case 'choices-not-saved':
          setChoicesNotSaved(true)
          break
        case 'overrides':
          setOverrides(message.overrides)
          break
        case 'entry-detail':
          setDetail({
            entryId: message.entryId,
            records: message.records,
            oldInstances: message.oldInstances,
            ...(message.instances ? { instances: message.instances } : {}),
          })
          break
        case 'dev-export':
          setDevExport({ files: message.files, notes: message.notes })
          break
        case 'error':
          setScanning(false)
          setApplying(undefined)
          setError(message.message)
          break
      }
    },
    [clearBulk],
  )
  usePluginMessages(onMessage)

  useEffect(() => send({ type: 'ready' }), [])

  const scan = () => {
    userScan.current = true
    setError(undefined)
    setScanning(true)
    dispatchTrace({ type: 'trace-reset' })
    send({ type: 'scan', scope })
  }
  /** Goes to a main component's page and scans it, from the Main components tab */
  const scanPageOf = (nodeId: string) => {
    scopeChosen.current = true
    userScan.current = true
    toComponents.current = true
    setScope('page')
    setError(undefined)
    setScanning(true)
    dispatchTrace({ type: 'trace-reset' })
    send({ type: 'scan-page-of', nodeId })
  }
  /** Scans the whole file from the Main components tab, and returns to it */
  const scanFile = () => {
    scopeChosen.current = true
    userScan.current = true
    toComponents.current = true
    setScope('file')
    setError(undefined)
    setScanning(true)
    dispatchTrace({ type: 'trace-reset' })
    send({ type: 'scan', scope: 'file' })
  }
  const open = (entry: EntrySummary) => {
    setOpenEntryId(entry.id)
    setDetail(undefined)
    send({ type: 'get-entry', entryId: entry.id })
  }
  const select = (nodeIds: string[]) => send({ type: 'select', nodeIds })
  const pageTotal = scannablePages(filePages.pages).length
  const pagesChosen = pagesToScan(filePages.pages, filePages.leftOut).length
  const partialFile: PartialFile | undefined =
    pagesChosen < pageTotal
      ? { chosen: pagesChosen, total: pageTotal }
      : undefined
  const busy = scanning || applying !== undefined
  /** Apply, Convert and Revert wait for a new scan when the file has changed */
  const locked = busy || stale
  const applyEntries = (entryIds: string[]) => {
    setLastApplied(entryIds)
    setError(undefined)
    setRun(undefined)
    setApplying({ done: 0, total: 0 })
    send({ type: 'apply', entryIds })
  }
  const convertTypography = (instanceIds: string[]) => {
    setError(undefined)
    setRun(undefined)
    setApplying({ done: 0, total: 0 })
    send({ type: 'convert-typography', instanceIds })
  }
  const revertEntry = (entryId: string) => {
    setError(undefined)
    setRun(undefined)
    setApplying({ done: 0, total: 0 })
    send({ type: 'revert', entryId })
  }
  const sendOverrides = (changes: OverrideChange[]) =>
    send({ type: 'set-overrides', changes })

  /**
   * The value to store for one binding. Choosing the proposal again removes
   * the binding's own change, unless its row has a change that would then
   * apply instead. On a binding that needs a check or has no equivalent,
   * choosing the proposal is kept: it settles the binding, which then counts
   * as Ready. Saving the choice the binding has already keeps it. Decide
   * later is always kept, since it is never the proposal.
   */
  const recordValue = (
    value: OverrideValue | undefined,
    proposal: string | undefined,
    rowChanged: boolean,
    settles: boolean,
    stored: OverrideValue | undefined,
  ) =>
    value === undefined ||
    (value === proposal && !rowChanged && !settles && stored !== value)
      ? undefined
      : value

  const changeRecord = (record: BindingRecord) => {
    const current = effectiveTarget(record, overrides)
    const rowChanged = rowKey(record) in overrides.rows
    // A legacy mode that waits for values below it offers removing it anyway.
    const waits = modePickerNote([record.id], blocked)
    const extra = modePickerExtra([record.id], blocked)
    setPicker({
      title: record.old ?? record.nodeName,
      description:
        record.category === 'byHand'
          ? `${record.nodeName}, ${propertyLabel(record.property)}. ${MANUAL_FIX_PICKER}`
          : `${record.nodeName}, ${propertyLabel(record.property)}. Changes this value only, and wins over a change on its row.${waits ? ` ${waits}` : ''}`,
      schemes: [record.scheme ?? 'light'],
      subject: {
        // A Manual fix offers the plugin's fix or Decide later, never
        // another variable: Figma would not take it there.
        kinds: record.kind && record.category !== 'byHand' ? [record.kind] : [],
        group: record.group,
        candidates: record.candidates ?? [],
        ...(extra ? { extra } : {}),
      },
      current: current.target,
      changed: current.source === 'record',
      onSave: (value) =>
        sendOverrides([
          {
            target: { type: 'record', id: record.id },
            value: recordValue(
              value,
              record.candidates?.[0],
              rowChanged,
              record.category !== 'sure',
              overrides.records[record.id],
            ),
          },
        ]),
    })
  }

  const changeBinding = (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => {
    const own = binding.id in overrides.records
    const rowChanged = row.key in overrides.rows
    const manual = row.outcome === 'byHand'
    const waits = modePickerNote([binding.id], blocked)
    const extra = modePickerExtra([binding.id], blocked)
    setPicker({
      title: group.old,
      description: manual
        ? `${binding.nodeName}, ${propertyLabel(binding.property)}. ${MANUAL_FIX_PICKER}`
        : `${binding.nodeName}, ${propertyLabel(binding.property)}. Changes this value only, and wins over a change on its row.${waits ? ` ${waits}` : ''}`,
      schemes: [binding.scheme ?? 'light'],
      subject: {
        kinds: binding.kind && !manual ? [binding.kind] : [],
        group: group.group,
        candidates: row.candidates,
        ...(extra ? { extra } : {}),
      },
      current: own
        ? overrides.records[binding.id]
        : rowChanged
          ? overrides.rows[row.key]
          : (row.proposal ?? null),
      changed: own,
      onSave: (value) =>
        sendOverrides([
          {
            target: { type: 'record', id: binding.id },
            value: recordValue(
              value,
              row.proposal,
              rowChanged,
              row.outcome !== 'sure',
              overrides.records[binding.id],
            ),
          },
        ]),
    })
  }

  const changeRow = (group: MappingGroup, shown: MappingRow) => {
    // A frame and the Main components tab list only their own values of a
    // row. A choice on the row is stored by its key and reaches every value
    // in it, as in Changes, so the picker counts, and the change replaces
    // the choices on, all of them, and says how many are not listed.
    const row = wholeRow(mapping, shown)
    const target = rowChoiceTarget(row)
    const notListed = row.count - shown.count
    const own = ownChoices(row, overrides)
    // A target saved on the row replaces the choices on its values, and Undo
    // my change brings them back (withRowChoice in scan/mapping.ts).
    const back = choicesToBringBack(overrides, row.key)
    const choicesNote = rowChoicesNote(
      row.count,
      own,
      back,
      own > 0 ? choicesToBringBackAfter(overrides, target) : 0,
    )
    const replaced = choicesNote ? ` ${choicesNote}` : ''
    // Legacy modes in the row that wait for values below them: the picker
    // says what they wait for, and offers removing them anyway.
    const ids = target.bindingIds
    const waitNote = modePickerNote(ids, blocked)
    const waits = waitNote ? ` ${waitNote}` : ''
    const extra = modePickerExtra(ids, blocked)
    // A Manual fix offers the plugin's fix or Decide later, never another
    // variable: Figma would not take it there.
    const manual = row.outcome === 'byHand'
    const kinds = manual
      ? []
      : [
          ...new Set(
            row.bindings
              .map((binding) => binding.kind)
              .filter((kind): kind is BindingKind => kind !== undefined),
          ),
        ]
    const all = row.count === 1 ? 'the value' : `all ${row.count} values`
    const elsewhere =
      notListed === 0
        ? ''
        : ` ${notListed} of them ${notListed === 1 ? 'is' : 'are'} elsewhere in the scope, not listed here.`
    setPicker({
      title: group.old,
      description: `${manual ? `${MANUAL_FIX_PICKER} ` : ''}Changes ${all} in this row.${elsewhere}${replaced}${waits}`,
      schemes: schemesOf(row.bindings),
      subject: {
        kinds,
        group: group.group,
        candidates: row.candidates,
        ...(extra ? { extra } : {}),
      },
      current: rowCurrent(row, overrides),
      // Undo my change undoes the change on the row and brings back the
      // choices it replaced. It keeps the choices made on single values, so
      // a row with only those has nothing to undo: Undo my change on each
      // value, or Reset choices in the bulk bar, removes them.
      changed: row.key in overrides.rows || back > 0,
      onSave: (value) => send({ type: 'row-choice', row: target, value }),
    })
  }

  const selected = [...bulk.items.values()]
  const shared = sharedSubject(selected)
  const changeSelected = () => {
    if (!shared) return
    setPicker({
      title: `${selected.length} values`,
      description:
        'Sets the same target on every selected value. It wins over a change on their rows.',
      schemes: schemesOf(selected),
      subject: shared,
      onSave: (value) => {
        sendOverrides(
          selected.map((item) => ({
            target: { type: 'record', id: item.id },
            value,
          })),
        )
        bulk.clear()
      },
    })
  }
  const setSelected = (value: OverrideValue | undefined) => {
    sendOverrides(
      selected.map((item) => ({
        target: { type: 'record', id: item.id },
        value,
      })),
    )
    bulk.clear()
  }
  const selectedStatus = selectionStatus(
    bulk.items.keys(),
    mapping,
    overrides,
    kept,
  )
  /** Applies the Ready changes among the selected values only */
  const applySelected = () => {
    setLastApplied(selectedStatus.entryIds)
    setError(undefined)
    setRun(undefined)
    setApplying({ done: 0, total: 0 })
    send({ type: 'apply-selected', recordIds: selected.map((item) => item.id) })
  }
  const openEntry = summary?.entries.find((entry) => entry.id === openEntryId)

  const isDevCommand =
    command === 'dev-export-inventory' || command === 'dev-export-fixture'

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">EDS Variable Migration</h1>
        <Badge tone="warning" emphasis="medium">
          WIP beta
        </Badge>
        {command === 'open' && (
          <div className="header-actions">
            <Button
              variant="ghost"
              icon
              aria-label="Settings"
              aria-haspopup="dialog"
              onClick={() => setSettingsOpen(true)}
            >
              <Icon data={tune} />
            </Button>
          </div>
        )}
      </header>
      <main className="app-main stack">
        {error && (
          <Banner
            tone="danger"
            role="alert"
            onDismiss={() => setError(undefined)}
          >
            <Banner.Message>{error}</Banner.Message>
          </Banner>
        )}
        {applying && (
          <p className="muted" role="status">
            {applying.total > 0
              ? `Applying ${applying.done} of ${applying.total}…`
              : 'Working…'}
          </p>
        )}
        {run && !applying && (
          <RunResult
            run={run}
            onDismiss={() => setRun(undefined)}
            onSelect={select}
            onRevert={
              run.kind === 'apply' && lastApplied.length === 1
                ? () => revertEntry(lastApplied[0])
                : undefined
            }
          />
        )}
        {isDevCommand &&
          (devExport ? (
            <DevExport
              files={devExport.files}
              notes={devExport.notes}
              command={command}
            />
          ) : (
            <p className="muted">Exporting…</p>
          ))}
        {command === 'open' && (
          <>
            {/* The first scan after the window opens takes the whole window,
                with the scope controls hidden until it ends. */}
            {((scanning && !summary) || finale) && (
              <ScanLoader
                trace={trace}
                variant="initial"
                finale={finale}
                onCancel={() => send({ type: 'cancel-scan' })}
              />
            )}
            {!openEntry && !review && !(scanning && !summary) && !finale && (
              <ScanControls
                scope={scope}
                onScopeChange={(next) => {
                  scopeChosen.current = true
                  setScope(next)
                }}
                selection={selection}
                scanning={scanning}
                onScan={scan}
                compact={summary !== undefined}
                onGoToScope={
                  summary
                    ? () =>
                        select(
                          summary.entries
                            .filter((entry) => entry.kind !== 'component')
                            .flatMap((entry) => entry.nodeIds),
                        )
                    : undefined
                }
                pages={filePages.pages}
                leftOutPages={filePages.leftOut}
                onOpenPages={() => send({ type: 'get-pages' })}
                onLeftOutPagesChange={(pageIds) => {
                  setFilePages((current) => ({ ...current, leftOut: pageIds }))
                  send({ type: 'set-left-out-pages', pageIds })
                }}
              />
            )}
            {!summary && !scanning && !saved && (
              <p className="muted">
                Scan the selection, the page or the whole file to see which
                layers still use legacy EDS variables.
              </p>
            )}
            {!summary && !scanning && saved && <SavedHealth saved={saved} />}
            {summary && !scanning && stale && (
              <Banner tone="warning">
                <Banner.Message>
                  The page has changed since the scan, by an undo or an edit.
                  Scan again before you apply or convert anything.
                </Banner.Message>
                <Banner.Actions>
                  <Button size="small" variant="secondary" onClick={scan}>
                    Scan again
                  </Button>
                </Banner.Actions>
              </Banner>
            )}
            {choicesNotSaved && (
              <Banner
                tone="warning"
                onDismiss={() => setChoicesNotSaved(false)}
              >
                <Banner.Message>
                  Your choices are too many to keep in the file. They stay while
                  the plugin is open; apply them before you close it.
                </Banner.Message>
              </Banner>
            )}
            {/* A later scan, by Scan again or after an apply, a revert or a
                convert, is a card above the results. The scan controls are
                hidden while a frame or the review is open, so the card is
                what shows the scan there. */}
            {scanning && summary && (
              <ScanLoader
                trace={trace}
                variant="rescan"
                onCancel={() => send({ type: 'cancel-scan' })}
              />
            )}
            {summary && !scanning && review && (
              <ReviewView
                items={review}
                blocked={blocked}
                entryNames={
                  new Map(
                    summary.entries.map((entry) => [entry.id, entry.name]),
                  )
                }
                onSelect={select}
                onDecide={(item, value) =>
                  sendOverrides([
                    {
                      target: { type: 'record', id: item.binding.id },
                      value,
                    },
                  ])
                }
                run={reviewRun}
                onDone={() => setReview(undefined)}
              />
            )}
            {/* An open frame stays on screen during that scan, with its
                actions locked, so the designer is back where they were
                when it ends: same tab, filters and open layers. */}
            {summary && !finale && !review && openEntry && (
              <Inspector
                entry={openEntry}
                records={
                  detail?.entryId === openEntry.id ? detail.records : undefined
                }
                oldInstances={
                  detail?.entryId === openEntry.id
                    ? detail.oldInstances
                    : undefined
                }
                componentInstances={
                  detail?.entryId === openEntry.id
                    ? detail.instances
                    : undefined
                }
                overrides={overrides}
                kept={kept}
                selection={bulk}
                busy={locked}
                onApply={() => applyEntries([openEntry.id])}
                onReview={() => {
                  setReviewRun('Apply')
                  setReview(
                    reviewItems(
                      mapping,
                      overrides,
                      new Set([openEntry.id]),
                      kept,
                    ),
                  )
                }}
                onRevert={() => revertEntry(openEntry.id)}
                onBack={() => setOpenEntryId(undefined)}
                onSelect={select}
                onChange={changeRecord}
                mapping={mapping}
                showCounts={showCounts}
                onChangeRow={changeRow}
                onChangeBinding={changeBinding}
              />
            )}
            {/* Hidden rather than unmounted while a frame or the review is
                open, so Back, and the end of the scan after an apply,
                return to the same tab, filters and open accordion items. */}
            {summary && (
              <div
                className="results"
                hidden={
                  finale !== undefined ||
                  openEntry !== undefined ||
                  review !== undefined
                }
                // During a later scan the results stay in view, faded and
                // out of reach, under the scan card, until the new ones
                // replace them.
                inert={scanning}
                data-updating={scanning ? '' : undefined}
              >
                <Overview
                  summary={summary}
                  view={view}
                  onView={setView}
                  mapping={mapping}
                  overrides={overrides}
                  kept={kept}
                  onSelectOld={(oldKey) => send({ type: 'select-old', oldKey })}
                  onChangeRow={changeRow}
                  onChangeBinding={changeBinding}
                  onSelectLayer={select}
                  selection={bulk}
                  onOpen={open}
                  onGoTo={(entry) => select(entry.nodeIds)}
                  busy={locked}
                  onApply={applyEntries}
                  instances={instances}
                  onReview={(entryIds) => {
                    setReviewRun('Apply')
                    setReview(
                      reviewItems(
                        mapping,
                        overrides,
                        entryIds ? new Set(entryIds) : undefined,
                        kept,
                      ),
                    )
                  }}
                  report={report}
                  onReport={() => send({ type: 'get-report' })}
                  onCloseReport={() => setReport(undefined)}
                  showCounts={showCounts}
                  showEmpty={showEmpty}
                  onScanPageOf={scanPageOf}
                  onScanFile={scanFile}
                  partialFile={partialFile}
                  onConvert={convertTypography}
                  conversions={conversions}
                  componentCounts={componentCounts}
                  onCountComponents={() =>
                    send({ type: 'get-typography-components' })
                  }
                  onReviewConversions={(items) => {
                    setReviewRun('Convert')
                    setReview(items)
                  }}
                  sources={sources}
                  sourceCheck={sourceCheck}
                  onCheckSources={() => send({ type: 'check-sources' })}
                  onStopSources={() => {
                    setSourceCheck(
                      (previous) => previous && { ...previous, stopping: true },
                    )
                    send({ type: 'cancel-sources' })
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>
      {command === 'open' && (
        <BulkBar
          count={selected.length}
          recordIds={selected.map((item) => item.id)}
          ready={selectedStatus.ready}
          chosen={selectedStatus.chosen}
          canChange={shared !== undefined}
          busy={locked}
          onApply={applySelected}
          onChange={changeSelected}
          onDecideLater={() => setSelected(DECIDE_LATER)}
          onReset={() => setSelected(undefined)}
          onClear={bulk.clear}
        />
      )}
      <ResizeHandle />
      <TargetPicker request={picker} onClose={() => setPicker(undefined)} />
      {command === 'open' && (
        <>
          <SettingsDialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            windowScheme={windowScheme}
            onChange={changeSettings}
            canReport={summary !== undefined}
            onReport={() => {
              setSettingsOpen(false)
              send({ type: 'get-report' })
            }}
            onIntroduction={() => {
              setSettingsOpen(false)
              setIntroOpen(true)
            }}
            onResetWindow={() => send({ type: 'reset-window-size' })}
          />
          <Onboarding
            open={introOpen}
            onClose={(scanPage) => {
              setIntroOpen(false)
              send({ type: 'intro-seen' })
              if (scanPage) {
                scopeChosen.current = true
                userScan.current = true
                setScope('page')
                setError(undefined)
                setScanning(true)
                dispatchTrace({ type: 'trace-reset' })
                send({ type: 'scan', scope: 'page' })
              }
            }}
          />
        </>
      )}
    </div>
  )
}
