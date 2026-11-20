import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@equinor/eds-tokens/next/css/variables.css'
import '@equinor/eds-core-react/next/index.css'
import '../../../src/ui/ui.css'
import './tree.css'
import { emptyCounts } from '../../../src/scan/summary'
import type { ComponentSource, EntrySummary } from '../../../src/scan/types'
import { InstancesView } from '../../../src/ui/components/InstancesView'
import type { SourceCheck } from '../../../src/ui/components/InstancesView'
import { peEditorInstances } from './pe-editor'

const instances = peEditorInstances()

/** PE Editor sits on the canvas of the page Test in FRIOD Main Design. */
const entries: EntrySummary[] = [
  {
    id: 'test-page',
    kind: 'loose',
    name: 'PE Editor',
    pageId: '2103:312',
    pageName: 'Test',
    sections: [],
    nodeIds: ['1'],
    counts: emptyCounts(),
    health: 0.03,
    oldInstances: instances.length,
  },
]

/**
 * What the check finds, from spikes S2 and S3 (2026-11-19): PE Editor's
 * import fails, since its main component is in the deprecated Main Design
 * File and not in a library; the Core Components in its slot are an old
 * version, and the library's current one has no legacy values.
 */
const FOUND: Record<string, ComponentSource> = {
  'PE Editor': { kind: 'no-library' },
  'Text Field [EDS]': { kind: 'update', legacy: 152, latestLegacy: 0 },
  'Switch [EDS]': { kind: 'update', legacy: 38, latestLegacy: 0 },
  'Button [EDS]': { kind: 'update', legacy: 21, latestLegacy: 0 },
  '_Tab [EDS]': { kind: 'update', legacy: 17, latestLegacy: 0 },
  '_Badge [EDS]': { kind: 'update', legacy: 24, latestLegacy: 0 },
  '_Divider [EDS]': { kind: 'update', legacy: 7, latestLegacy: 0 },
}

function Pane({ scheme }: { scheme: 'light' | 'dark' }) {
  const [went, setWent] = useState<string>()
  const [sources, setSources] = useState<Map<string, ComponentSource>>(
    () => new Map(),
  )
  const [check, setCheck] = useState<SourceCheck>()
  const stop = useRef(false)
  // As the plugin does: one main component at a time, a second or two each
  const runCheck = () => {
    const keys = [
      ...new Set(
        instances.map((instance) => instance.mainComponent?.key ?? ''),
      ),
    ]
    stop.current = false
    setCheck((previous) => ({
      done: 0,
      total: keys.length,
      running: true,
      current: keys[0],
      checked: [],
      runs: previous?.runs ?? 0,
    }))
    keys.forEach((key, index) => {
      setTimeout(
        () => {
          if (stop.current) {
            setCheck((previous) =>
              previous?.running
                ? {
                    ...previous,
                    running: false,
                    stopped: true,
                    runs: previous.runs + 1,
                  }
                : previous,
            )
            return
          }
          const source = FOUND[key.trim()]
          if (source)
            setSources((previous) => new Map(previous).set(key, source))
          setCheck((previous) => {
            const last = index + 1 === keys.length
            const checked = [...(previous?.checked ?? []), key]
            return {
              done: index + 1,
              total: keys.length,
              running: !last,
              current: keys[index + 1],
              checked,
              runs: (previous?.runs ?? 0) + (last ? 1 : 0),
            }
          })
        },
        (index + 1) * 700,
      )
    })
  }
  return (
    <section
      className="pane"
      aria-label={`${scheme} theme`}
      data-color-scheme={scheme}
    >
      <h2 className="pane-title">Figma {scheme}</h2>
      <div className="pane-window">
        <InstancesView
          instances={instances}
          entries={entries}
          onSelect={(ids) => setWent(`Go to ${ids.join(', ')}`)}
          typographyCount={0}
          onShowTypography={() => undefined}
          sources={sources}
          sourceCheck={check}
          onCheckSources={runCheck}
          onStopSources={() => {
            stop.current = true
            setCheck((previous) => previous && { ...previous, stopping: true })
          }}
        />
        {went && <p className="pane-note">{went}</p>}
      </div>
    </section>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <header className="page-head">
        <h1>Instances tab: where to fix the values (phase 3 design)</h1>
        <p>
          Casper&rsquo;s case: the pasted PE Editor in FRIOD Main Design. Check
          for library updates fills in, one main component at a time, what the
          spikes found: PE Editor is from another file, and the Core Components
          in its slot have a library update with no legacy values.
        </p>
      </header>
      <main className="panes">
        <Pane scheme="light" />
        <Pane scheme="dark" />
      </main>
    </StrictMode>,
  )
}
