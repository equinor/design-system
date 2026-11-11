import { useCallback, useEffect, useState } from 'react'
import { Banner, Switch } from '@equinor/eds-core-react/next'
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
  PluginToUi,
  ScanProgress,
  Scope,
} from '../shared/messages'
import { DevExport } from './components/DevExport'
import { EntryList } from './components/EntryList'
import { HealthBar, HealthLegend } from './components/HealthBar'
import { Inspector } from './components/Inspector'
import { ScanControls } from './components/ScanControls'
import type { SelectionInfo } from './components/ScanControls'
import { send, useFigmaColorScheme, usePluginMessages } from './figma'

type EntryDetail = {
  entryId: string
  records: BindingRecord[]
  oldInstances: OldInstance[]
}

function Overview({
  summary,
  showComponents,
  onShowComponents,
  onOpen,
  onGoTo,
}: {
  summary: ScanSummary
  showComponents: boolean
  onShowComponents: (show: boolean) => void
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
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
        <section className="stack-tight" aria-labelledby="components-title">
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
                Changing a main component changes every instance of it in the
                file.
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
  )
}

export function App() {
  useFigmaColorScheme()
  const [command, setCommand] = useState<Command>()
  const [selection, setSelection] = useState<SelectionInfo>({ count: 0 })
  const [scope, setScope] = useState<Scope>('page')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress>()
  const [summary, setSummary] = useState<ScanSummary>()
  const [openEntryId, setOpenEntryId] = useState<string>()
  const [detail, setDetail] = useState<EntryDetail>()
  const [showComponents, setShowComponents] = useState(false)
  const [devExport, setDevExport] = useState<{
    files: DevExportFile[]
    notes: string[]
  }>()
  const [error, setError] = useState<string>()

  const onMessage = useCallback((message: PluginToUi) => {
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
        break
      case 'scan-cancelled':
        setScanning(false)
        setProgress(undefined)
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
  }, [])
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
                onBack={() => setOpenEntryId(undefined)}
                onSelect={select}
              />
            )}
            {summary && !scanning && !openEntry && (
              <Overview
                summary={summary}
                showComponents={showComponents}
                onShowComponents={setShowComponents}
                onOpen={open}
                onGoTo={(entry) => select(entry.nodeIds)}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
