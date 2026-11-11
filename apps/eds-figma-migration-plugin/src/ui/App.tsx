import { useCallback, useEffect, useState } from 'react'
import { Banner, Button, Radio } from '@equinor/eds-core-react/next'
import type { Command, DevExportFile, PluginToUi } from '../shared/messages'
import { DevExport } from './components/DevExport'
import { send, useFigmaColorScheme, usePluginMessages } from './figma'

type Scope = 'page' | 'file'

function Start() {
  const [scope, setScope] = useState<Scope>('page')
  return (
    <div className="stack">
      <fieldset className="scope">
        <legend className="section-title">Scope</legend>
        <div className="scope-options">
          <Radio
            name="scope"
            label="Page"
            value="page"
            checked={scope === 'page'}
            onChange={() => setScope('page')}
          />
          <Radio
            name="scope"
            label="File"
            value="file"
            checked={scope === 'file'}
            onChange={() => setScope('file')}
          />
        </div>
        <Button disabled>Scan</Button>
      </fieldset>
      <Banner tone="info">
        <Banner.Message>
          This development build has the mapping rules and the inventory export.
          Scanning comes in the next milestone.
        </Banner.Message>
      </Banner>
    </div>
  )
}

export function App() {
  useFigmaColorScheme()
  const [command, setCommand] = useState<Command>()
  const [mappingVersion, setMappingVersion] = useState<string>()
  const [devExport, setDevExport] = useState<{
    files: DevExportFile[]
    notes: string[]
  }>()
  const [error, setError] = useState<string>()

  const onMessage = useCallback((message: PluginToUi) => {
    switch (message.type) {
      case 'init':
        setCommand(message.command)
        setMappingVersion(message.mappingVersion)
        break
      case 'dev-export':
        setDevExport({ files: message.files, notes: message.notes })
        break
      case 'error':
        setError(message.message)
        break
    }
  }, [])
  usePluginMessages(onMessage)

  useEffect(() => send({ type: 'ready' }), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">EDS variable migration</h1>
        {mappingVersion && (
          <span className="muted">Mapping {mappingVersion}</span>
        )}
      </header>
      <main className="app-main">
        {error && (
          <Banner
            tone="danger"
            role="alert"
            onDismiss={() => setError(undefined)}
          >
            <Banner.Message>{error}</Banner.Message>
          </Banner>
        )}
        {command === 'dev-export-inventory' ? (
          devExport ? (
            <DevExport files={devExport.files} notes={devExport.notes} />
          ) : (
            <p className="muted">Reading the libraries…</p>
          )
        ) : (
          command && <Start />
        )}
      </main>
    </div>
  )
}
