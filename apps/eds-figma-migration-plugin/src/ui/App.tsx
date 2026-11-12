import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Banner, Button } from '@equinor/eds-core-react/next'
import { schemesOf } from '../mapping/scheme'
import { sharedSubject } from '../mapping/picker'
import type { BindingKind } from '../mapping/types'
import { NO_OVERRIDES, effectiveTarget, rowKey } from '../scan/mapping'
import type {
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
  ScanProgress,
  Scope,
} from '../shared/messages'
import { ApplyActions } from './components/ApplyActions'
import { BulkBar } from './components/BulkBar'
import { DevExport } from './components/DevExport'
import { ExportReport } from './components/ExportReport'
import { EntryList } from './components/EntryList'
import { HealthBar, HealthLegend } from './components/HealthBar'
import { Inspector } from './components/Inspector'
import { InstancesView } from './components/InstancesView'
import { MappingView } from './components/MappingView'
import { ReviewView } from './components/ReviewView'
import { SavedHealth } from './components/SavedHealth'
import { SettingsMenu } from './components/SettingsMenu'
import { ResizeHandle } from './components/ResizeHandle'
import { RunResult } from './components/RunResult'
import type { Run } from './components/RunResult'
import { ScanControls } from './components/ScanControls'
import { Tabs } from './components/Tabs'
import { TargetPicker } from './components/TargetPicker'
import type { PickerRequest } from './components/TargetPicker'
import type { SelectionInfo } from './components/ScanControls'
import { send, useFigmaColorScheme, usePluginMessages } from './figma'
import { reviewItems } from './review'
import type { ReviewItem } from './review'
import { filterGroups } from './groups'
import { useSelection } from './selection'
import type { Selection } from './selection'

type EntryDetail = {
  entryId: string
  records: BindingRecord[]
  oldInstances: OldInstance[]
}

type View = 'frames' | 'mapping' | 'instances'

function Overview({
  summary,
  view,
  onView,
  mapping,
  overrides,
  showComponents,
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
  onShowComponents,
  onConvert,
}: {
  summary: ScanSummary
  view: View
  onView: (view: View) => void
  mapping: MappingGroup[]
  overrides: Overrides
  showComponents: boolean
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
  onReview: () => void
  report?: Report
  onReport: () => void
  onCloseReport: () => void
  showCounts: boolean
  showEmpty: boolean
  onShowComponents: (show: boolean) => void
  onConvert: (instanceIds: string[]) => void
}) {
  const entryNames = new Map(
    summary.entries.map((entry) => [entry.id, entry.name]),
  )
  const typographyCount = instances.filter(
    (instance) => instance.typography,
  ).length
  const frames = summary.entries.filter((entry) => entry.kind !== 'component')
  const components = summary.entries.filter(
    (entry) => entry.kind === 'component',
  )
  const totals = showComponents
    ? sumCounts(summary.entries.map((entry) => entry.counts))
    : summary.totals
  const applied = showComponents ? summary.entries : frames
  // Final review FR10: Changes counts what the health bar counts.
  const componentIds = new Set(components.map((entry) => entry.id))
  const changes = showComponents
    ? mapping
    : filterGroups(mapping, (binding) => !componentIds.has(binding.entryId))
  // Final review FR5: a component with legacy variables is not hidden away.
  const legacyComponents = components.filter(
    (entry) => oldCount(entry.counts) > 0,
  )
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
            inside instances change with their main component or library.
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
                Everything in the scope uses EDS Foundation. Nothing is left to
                migrate.
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

      {typographyCount > 0 && view !== 'instances' && (
        <Banner tone="info">
          <Banner.Message>
            {typographyCount} instance{typographyCount === 1 ? '' : 's'} of the
            legacy Typography component can become text layers with the matching
            text style.
          </Banner.Message>
          <Banner.Actions>
            <Button
              size="small"
              variant="secondary"
              onClick={() => onView('instances')}
            >
              Show
            </Button>
          </Banner.Actions>
        </Banner>
      )}
      <Tabs
        label="View"
        tabs={[
          { id: 'mapping', label: 'Changes' },
          { id: 'frames', label: 'Frames' },
          { id: 'instances', label: `Instances ${instances.length}` },
        ]}
        selected={view}
        onSelect={onView}
      >
        {view === 'instances' ? (
          <InstancesView
            instances={instances}
            entryNames={entryNames}
            onSelect={onSelectLayer}
            onConvert={onConvert}
            busy={busy}
          />
        ) : view === 'mapping' ? (
          <MappingView
            groups={changes}
            overrides={overrides}
            entryNames={entryNames}
            showCounts={showCounts}
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

            {legacyComponents.length > 0 && !showComponents && (
              <div className="components-note">
                <span className="muted">
                  {legacyComponents.length} local component
                  {legacyComponents.length === 1 ? ' uses' : 's use'} legacy
                  variables
                  {legacyComponents[0].instanceCount !== undefined
                    ? ` and ${legacyComponents.length === 1 ? 'is' : 'are'} used ${legacyComponents.reduce((sum, entry) => sum + (entry.instanceCount ?? 0), 0)} times in the file`
                    : ''}
                  .
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onShowComponents(true)}
                >
                  Show
                </Button>
              </div>
            )}
            {components.length > 0 && showComponents && (
              <section
                className="stack-tight"
                aria-labelledby="components-title"
              >
                <h2 id="components-title" className="section-title">
                  Local components
                </h2>
                {showComponents && (
                  <>
                    <p className="muted">
                      Changing a main component changes every instance of it in
                      the file.
                    </p>
                    <EntryList
                      entries={components}
                      showPages={summary.scope === 'file'}
                      onGoToPage={(pageId) =>
                        send({ type: 'go-to-page', pageId })
                      }
                      onOpen={onOpen}
                      onGoTo={onGoTo}
                    />
                  </>
                )}
              </section>
            )}
          </div>
        )}
      </Tabs>
      {selection.items.size === 0 && (
        <ApplyActions
          ready={totals.sure}
          toReview={totals.check}
          where={reach ?? 'in the scope'}
          mainComponents={mainComponents}
          busy={busy}
          onReview={onReview}
          onApply={() => onApply(applied.map((entry) => entry.id))}
        />
      )}
    </div>
  )
}

export function App() {
  // Sets the window's own theme. The colours shown for layers follow each
  // layer's colour scheme instead (scan/types.ts, BindingRecord.scheme).
  useFigmaColorScheme()
  const bulk = useSelection()
  const clearBulk = bulk.clear
  const [command, setCommand] = useState<Command>()
  const [selection, setSelection] = useState<SelectionInfo>({ count: 0 })
  const [scope, setScope] = useState<Scope>('page')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress>()
  const [summary, setSummary] = useState<ScanSummary>()
  const [openEntryId, setOpenEntryId] = useState<string>()
  const [detail, setDetail] = useState<EntryDetail>()
  const [showComponents, setShowComponents] = useState(false)
  // Test session finding 14: until the designer chooses, local components
  // are shown when they hold most of what the plugin can change.
  const componentsChosen = useRef(false)
  const chooseComponents = (show: boolean) => {
    componentsChosen.current = true
    setShowComponents(show)
  }
  // Test session finding 17: the scan is out of date after an undo or an edit.
  const [stale, setStale] = useState(false)
  // Check designs: the changes are the first thing shown after a scan.
  const [view, setView] = useState<View>('mapping')
  const [showCounts, setShowCounts] = useState(true)
  const [showEmpty, setShowEmpty] = useState(false)
  const [mapping, setMapping] = useState<MappingGroup[]>([])
  const [instances, setInstances] = useState<OldInstance[]>([])
  const [review, setReview] = useState<ReviewItem[]>()
  const [saved, setSaved] = useState<Saved>()
  const [report, setReport] = useState<Report>()
  const [choicesNotSaved, setChoicesNotSaved] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>(NO_OVERRIDES)
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
  const [lastApplied, setLastApplied] = useState<string[]>([])
  useEffect(() => {
    openEntryRef.current = openEntryId
  }, [openEntryId])

  const onMessage = useCallback(
    (message: PluginToUi) => {
      switch (message.type) {
        case 'init':
          setCommand(message.command)
          break
        case 'selection':
          setSelection({ count: message.count, firstName: message.firstName })
          if (!scopeChosen.current) {
            setScope(message.count > 0 ? 'selection' : 'page')
          }
          break
        case 'scan-progress':
          setProgress(message.progress)
          break
        case 'scan-done': {
          scopeChosen.current = true
          if (userScan.current) {
            userScan.current = false
            setView(
              message.summary.scope === 'selection' ? 'mapping' : 'frames',
            )
          }
          setScanning(false)
          setProgress(undefined)
          setStale(false)
          if (!componentsChosen.current) {
            const changeable = (entries: EntrySummary[]) =>
              entries.reduce(
                (sum, entry) =>
                  sum +
                  entry.counts.sure +
                  entry.counts.check +
                  entry.counts.none,
                0,
              )
            const components = message.summary.entries.filter(
              (entry) => entry.kind === 'component',
            )
            const frames = message.summary.entries.filter(
              (entry) => entry.kind !== 'component',
            )
            setShowComponents(
              components.length > 0 &&
                changeable(components) > changeable(frames),
            )
          }
          setSummary(message.summary)
          setDetail(undefined)
          setReview(undefined)
          clearBulk()
          // After an apply or a revert the plugin scans again; an open
          // frame stays open when it is still in the scan.
          const openId = openEntryRef.current
          if (
            openId &&
            message.summary.entries.some((entry) => entry.id === openId)
          ) {
            send({ type: 'get-entry', entryId: openId })
          } else {
            setOpenEntryId(undefined)
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
          break
        case 'revert-done':
          setApplying(undefined)
          setRun({ kind: 'revert', result: message.result })
          setScanning(true)
          break
        case 'convert-done':
          setApplying(undefined)
          setRun({ kind: 'convert', result: message.result })
          setScanning(true)
          break
        case 'summary':
          setSummary(message.summary)
          break
        case 'stale':
          setStale(true)
          break
        case 'scan-cancelled':
          setScanning(false)
          setProgress(undefined)
          break
        case 'mapping':
          setMapping(message.groups)
          break
        case 'instances':
          setInstances(message.instances)
          break
        case 'saved-health':
          setSaved(message.saved)
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
    send({ type: 'scan', scope })
  }
  const open = (entry: EntrySummary) => {
    setOpenEntryId(entry.id)
    setDetail(undefined)
    send({ type: 'get-entry', entryId: entry.id })
  }
  const select = (nodeIds: string[]) => send({ type: 'select', nodeIds })
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
   * as Ready.
   */
  const recordValue = (
    value: OverrideValue | undefined,
    proposal: string | undefined,
    rowChanged: boolean,
    settles: boolean,
  ) =>
    value === undefined || (value === proposal && !rowChanged && !settles)
      ? undefined
      : value

  const changeRecord = (record: BindingRecord) => {
    const current = effectiveTarget(record, overrides)
    const rowChanged = rowKey(record) in overrides.rows
    setPicker({
      title: record.old ?? record.nodeName,
      description: `${record.nodeName}, ${propertyLabel(record.property)}. Changes this value only, and wins over a change on its row.`,
      schemes: [record.scheme ?? 'light'],
      subject: {
        kinds: record.kind ? [record.kind] : [],
        group: record.group,
        candidates: record.candidates ?? [],
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
    setPicker({
      title: group.old,
      description: `${binding.nodeName}, ${propertyLabel(binding.property)}. Changes this value only, and wins over a change on its row.`,
      schemes: [binding.scheme ?? 'light'],
      subject: {
        kinds: binding.kind ? [binding.kind] : [],
        group: group.group,
        candidates: row.candidates,
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
            ),
          },
        ]),
    })
  }

  const changeRow = (group: MappingGroup, row: MappingRow) => {
    const changed = row.key in overrides.rows
    const kinds = [
      ...new Set(
        row.bindings
          .map((binding) => binding.kind)
          .filter((kind): kind is BindingKind => kind !== undefined),
      ),
    ]
    setPicker({
      title: group.old,
      description: `Changes all ${row.count} value${row.count === 1 ? '' : 's'} in this row. A change on a single value wins over it.`,
      schemes: schemesOf(row.bindings),
      subject: { kinds, group: group.group, candidates: row.candidates },
      current: changed ? overrides.rows[row.key] : (row.proposal ?? null),
      changed,
      onSave: (value) =>
        sendOverrides([
          {
            target: { type: 'row', key: row.key },
            value:
              value === row.proposal && row.outcome === 'sure'
                ? undefined
                : value,
          },
        ]),
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
            <SettingsMenu
              settings={[
                {
                  id: 'counts',
                  label: 'Layer counts',
                  checked: showCounts,
                  onChange: setShowCounts,
                },
                {
                  id: 'empty',
                  label: 'Frames without EDS variables',
                  checked: showEmpty,
                  onChange: setShowEmpty,
                },
                {
                  id: 'components',
                  label: 'Local components',
                  checked: showComponents,
                  onChange: chooseComponents,
                },
              ]}
              actions={
                summary
                  ? [
                      {
                        id: 'report',
                        label: 'Export report…',
                        onSelect: () =>
                          send({
                            type: 'get-report',
                            includeComponents: showComponents,
                          }),
                      },
                    ]
                  : []
              }
            />
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
            {!openEntry && !review && (
              <ScanControls
                scope={scope}
                onScopeChange={(next) => {
                  scopeChosen.current = true
                  setScope(next)
                }}
                selection={selection}
                scanning={scanning}
                progress={progress}
                onScan={scan}
                onCancel={() => send({ type: 'cancel-scan' })}
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
            {summary && !scanning && review && (
              <ReviewView
                items={review}
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
                onDone={() => setReview(undefined)}
              />
            )}
            {summary && !scanning && !review && openEntry && (
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
                overrides={overrides}
                selection={bulk}
                busy={locked}
                onApply={() => applyEntries([openEntry.id])}
                onReview={() =>
                  setReview(reviewItems(mapping, overrides, openEntry.id))
                }
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
            {/* Hidden rather than unmounted while a frame is open, so Back
                returns to the same tab, filters and open accordion items. */}
            {summary && !scanning && (
              <div hidden={openEntry !== undefined || review !== undefined}>
                <Overview
                  summary={summary}
                  view={view}
                  onView={setView}
                  mapping={mapping}
                  overrides={overrides}
                  onSelectOld={(oldKey) => send({ type: 'select-old', oldKey })}
                  onChangeRow={changeRow}
                  onChangeBinding={changeBinding}
                  onSelectLayer={select}
                  selection={bulk}
                  showComponents={showComponents}
                  onOpen={open}
                  onGoTo={(entry) => select(entry.nodeIds)}
                  busy={locked}
                  onApply={applyEntries}
                  instances={instances}
                  onReview={() => setReview(reviewItems(mapping, overrides))}
                  report={report}
                  onReport={() =>
                    send({
                      type: 'get-report',
                      includeComponents: showComponents,
                    })
                  }
                  onCloseReport={() => setReport(undefined)}
                  showCounts={showCounts}
                  showEmpty={showEmpty}
                  onShowComponents={chooseComponents}
                  onConvert={convertTypography}
                />
              </div>
            )}
          </>
        )}
      </main>
      {command === 'open' && (
        <BulkBar
          count={selected.length}
          canChange={shared !== undefined}
          onChange={changeSelected}
          onLeave={() => setSelected(null)}
          onUndo={() => setSelected(undefined)}
          onClear={bulk.clear}
        />
      )}
      <ResizeHandle />
      <TargetPicker request={picker} onClose={() => setPicker(undefined)} />
    </div>
  )
}
