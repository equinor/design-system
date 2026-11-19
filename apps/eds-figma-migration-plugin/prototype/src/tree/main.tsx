import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@equinor/eds-tokens/next/css/variables.css'
import '@equinor/eds-core-react/next/index.css'
import '../../../src/ui/ui.css'
import './tree.css'
import {
  InstanceTree,
  slotKeyOf,
} from '../../../src/ui/components/InstanceTree'
import { instanceForest } from '../../../src/ui/instances'
import { peEditorInstances } from './pe-editor'

const forest = instanceForest(peEditorInstances())
const top = forest[0]

function Pane({ scheme }: { scheme: 'light' | 'dark' }) {
  const [went, setWent] = useState<string>()
  return (
    <section
      className="pane"
      aria-label={`${scheme} theme`}
      data-color-scheme={scheme}
    >
      <h2 className="pane-title">Figma {scheme}</h2>
      <div className="pane-window">
        <p className="muted">
          These are the legacy values instances take from their main component,
          which the plugin does not change in the instance.
        </p>
        <InstanceTree
          nodes={forest}
          initiallyOpen={[top.key, slotKeyOf(top.key, 'Content')]}
          onSelect={(ids) => setWent(`Go to ${ids.join(', ')}`)}
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
        <h1>Instances tab: the tree inside an instance (phase 2 design)</h1>
        <p>
          Casper&rsquo;s case: the pasted PE Editor in FRIOD Main Design, with
          the counts the phase 1 scan reads, drawn as Figma&rsquo;s Layers panel
          draws layers. Go to selects the layer; the caret opens it.
        </p>
      </header>
      <main className="panes">
        <Pane scheme="light" />
        <Pane scheme="dark" />
      </main>
    </StrictMode>,
  )
}
