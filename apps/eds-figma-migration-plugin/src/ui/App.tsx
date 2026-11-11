import { useCallback, useEffect, useState } from 'react'
import { Banner, Switch } from '@equinor/eds-core-react/next'
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
import { propertyLabel } from '../scan/labels'
import { formatHealth, healthOf, sumCounts } from '../scan/summary'
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
  ScanProgress,
  Scope,
} from '../shared/messages'
import { BulkBar } from './components/BulkBar'
import { DevExport } from './components/DevExport'
import { EntryList } from './components/EntryList'
import { HealthBar, HealthLegend } from './components/HealthBar'
import { Inspector } from './components/Inspector'
import { MappingView } from './components/MappingView'
import { ScanControls } from './components/ScanControls'
import { Tabs } from './components/Tabs'
import { TargetPicker } from './components/TargetPicker'
import type { PickerRequest } from './components/TargetPicker'
import type { SelectionInfo } from './components/ScanControls'
import { send, useFigmaColorScheme, usePluginMessages } from './figma'
import { useSelection } from './selection'
import type { Selection } from './selection'

type EntryDetail = {
  entryId: string
  records: BindingRecord[]
  oldInstances: OldInstance[]
}

type View = 'frames' | 'mapping'

function Overview({
  summary,
  view,
  onView,
  mapping,
  overrides,
  showComponents,
  onShowComponents,
  onOpen,
  onGoTo,
  onSelectOld,
  onChangeRow,
  onChangeBinding,
  onSelectLayer,
  selection,
}: {
  summary: ScanSummary
  view: View
  onView: (view: View) => void
  mapping: MappingGroup[]
  overrides: Overrides
  showComponents: boolean
  onShowComponents: (show: boolean) => void
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
}) {
  const frames = summary.entries.filter((entry) => entry.kind !== 'component')
  const components = summary.entries.filter(
    (entry) => entry.kind === 'component',
  )
  const totals = showComponents
    ? sumCounts(summary.entries.map((entry) => entry.counts))
    : summary.totals
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
        <p className="muted">
          {summary.scope === 'file'
            ? `${summary.pages.length} pages`
            : summary.scope === 'selection'
              ? `Selection on ${summary.pages[0]?.name}`
              : summary.pages[0]?.name}
          , {summary.nodesScanned} layers
        </p>
      </section>

      <Tabs
        label="View"
        tabs={[
          { id: 'frames', label: 'Frames' },
          { id: 'mapping', label: 'Mapping' },
        ]}
        selected={view}
        onSelect={onView}
      >
        {view === 'mapping' ? (
          <MappingView
            groups={mapping}
            overrides={overrides}
            entryNames={
              new Map(summary.entries.map((entry) => [entry.id, entry.name]))
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
              {frames.length === 0 ? (
                <p className="muted">Nothing in the scope.</p>
              ) : (
                <EntryList
                  entries={frames}
                  showPages={summary.scope === 'file'}
                  onOpen={onOpen}
                  onGoTo={onGoTo}
                />
              )}
            </section>

            {components.length > 0 && (
              <section
                className="stack-tight"
                aria-labelledby="components-title"
              >
                <h2 id="components-title" className="section-title">
                  Local components
                </h2>
                <Switch
                  label={`Show and count ${components.length} main component${components.length === 1 ? '' : 's'}`}
                  checked={showComponents}
                  onChange={(event) => onShowComponents(event.target.checked)}
                />
                {showComponents && (
                  <>
                    <p className="muted">
                      Changing a main component changes every instance of it in
                      the file.
                    </p>
                    <EntryList
                      entries={components}
                      showPages={summary.scope === 'file'}
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
    </div>
  )
}

export function App() {
  const colorScheme = useFigmaColorScheme()
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
  const [view, setView] = useState<View>('frames')
  const [mapping, setMapping] = useState<MappingGroup[]>([])
  const [overrides, setOverrides] = useState<Overrides>(NO_OVERRIDES)
  const [picker, setPicker] = useState<PickerRequest>()
  const [devExport, setDevExport] = useState<{
    files: DevExportFile[]
    notes: string[]
  }>()
  const [error, setError] = useState<string>()

  const onMessage = useCallback(
    (message: PluginToUi) => {
      switch (message.type) {
        case 'init':
          setCommand(message.command)
          break
        case 'selection':
          setSelection({ count: message.count, firstName: message.firstName })
          break
        case 'scan-progress':
          setProgress(message.progress)
          break
        case 'scan-done':
          setScanning(false)
          setProgress(undefined)
          setSummary(message.summary)
          setOpenEntryId(undefined)
          setDetail(undefined)
          clearBulk()
          break
        case 'scan-cancelled':
          setScanning(false)
          setProgress(undefined)
          break
        case 'mapping':
          setMapping(message.groups)
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
          setError(message.message)
          break
      }
    },
    [clearBulk],
  )
  usePluginMessages(onMessage)

  useEffect(() => send({ type: 'ready' }), [])

  const scan = () => {
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
  const sendOverrides = (changes: OverrideChange[]) =>
    send({ type: 'set-overrides', changes })

  /**
   * The value to store for one binding. Choosing the proposal again removes
   * the binding's own change, unless its row has a change that would then
   * apply instead.
   */
  const recordValue = (
    value: OverrideValue | undefined,
    proposal: string | undefined,
    rowChanged: boolean,
  ) =>
    value === undefined || (value === proposal && !rowChanged)
      ? undefined
      : value

  const changeRecord = (record: BindingRecord) => {
    const current = effectiveTarget(record, overrides)
    const rowChanged = rowKey(record) in overrides.rows
    setPicker({
      title: record.old ?? record.nodeName,
      description: `${record.nodeName}, ${propertyLabel(record.property)}. Changes this binding only, and wins over a change on its row.`,
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
            value: recordValue(value, record.candidates?.[0], rowChanged),
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
      description: `${binding.nodeName}, ${propertyLabel(binding.property)}. Changes this binding only, and wins over a change on its row.`,
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
            value: recordValue(value, row.proposal, rowChanged),
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
      description: `Changes all ${row.count} binding${row.count === 1 ? '' : 's'} in this row. A change on a single binding wins over it.`,
      subject: { kinds, group: group.group, candidates: row.candidates },
      current: changed ? overrides.rows[row.key] : (row.proposal ?? null),
      changed,
      onSave: (value) =>
        sendOverrides([
          {
            target: { type: 'row', key: row.key },
            value: value === row.proposal ? undefined : value,
          },
        ]),
    })
  }

  const selected = [...bulk.items.values()]
  const shared = sharedSubject(selected)
  const changeSelected = () => {
    if (!shared) return
    setPicker({
      title: `${selected.length} bindings`,
      description:
        'Sets the same target on every selected binding. It wins over a change on their rows.',
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
        <h1 className="app-title">EDS variable migration</h1>
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
            {!openEntry && (
              <ScanControls
                scope={scope}
                onScopeChange={setScope}
                selection={selection}
                scanning={scanning}
                progress={progress}
                onScan={scan}
                onCancel={() => send({ type: 'cancel-scan' })}
              />
            )}
            {!summary && !scanning && (
              <p className="muted">
                Scan the selection, the page or the whole file to see which
                layers still use legacy EDS variables.
              </p>
            )}
            {summary && !scanning && openEntry && (
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
                onBack={() => setOpenEntryId(undefined)}
                onSelect={select}
                onChange={changeRecord}
              />
            )}
            {summary && !scanning && !openEntry && (
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
                onShowComponents={setShowComponents}
                onOpen={open}
                onGoTo={(entry) => select(entry.nodeIds)}
              />
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
      <TargetPicker
        request={picker}
        onClose={() => setPicker(undefined)}
        colorScheme={colorScheme}
      />
    </div>
  )
}
