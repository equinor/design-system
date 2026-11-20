import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@equinor/eds-tokens/next/css/variables.css'
import '@equinor/eds-core-react/next/index.css'
import '../../../src/ui/ui.css'
import '../tree/tree.css'
import fixture from '../../../test/fixtures/nested-instances.json'
import { classifyUnits } from '../../../src/scan/classify'
import { unpackFixture } from '../../../src/scan/fixture'
import type { PackedFixture } from '../../../src/scan/fixture'
import { buildMappingGroups, NO_OVERRIDES } from '../../../src/scan/mapping'
import { summariseEntries } from '../../../src/scan/summary'
import { Inspector } from '../../../src/ui/components/Inspector'
import { useSelection } from '../../../src/ui/selection'

/**
 * The FRIOD test frame "Casper case (local)" (2100:1825), from the fixture
 * the tests use: one instance of PE Editor (test) with a header from its main
 * component and slot content the instance owns.
 */
const original = fixture as unknown as PackedFixture
// The fixture was made before the scan recorded the slot's name; in the
// file the slot is Content.
const packed: PackedFixture = {
  ...original,
  steps: Object.fromEntries(
    Object.entries(original.steps ?? {}).map(([id, step]) => [
      id,
      step.slot ? { ...step, slotName: 'Content' } : step,
    ]),
  ),
}
const scanned = classifyUnits(unpackFixture(packed))
// The test frame has no plain layer in the slot; Casper's PE Editor has the
// frames Container, Type and Actions there. One such frame, made from the
// Tab's stroke, shows where their values go.
const tab = scanned.find((record) => record.override && record.instances)
const records = tab?.instances
  ? [
      ...scanned,
      {
        ...tab,
        id: 'sample-actions|strokes',
        nodeId: 'sample-actions',
        nodeName: 'Actions (sample)',
        nodeType: 'FRAME',
        instanceId: undefined,
        override: undefined,
        instances: tab.instances.slice(0, 1),
        slotName: 'Content',
      },
    ]
  : scanned
const [entry] = summariseEntries(
  [
    {
      id: packed.frame.id,
      kind: 'frame',
      name: packed.frame.name,
      pageId: '2100:8',
      pageName: '🧪 Plugin test: composite with nested legacy (local)',
      sections: [],
      nodeIds: [packed.frame.id],
    },
  ],
  records,
  [],
)
const mapping = buildMappingGroups(
  records.filter((record) => record.category !== 'migrated'),
)

function Pane({ scheme }: { scheme: 'light' | 'dark' }) {
  const [went, setWent] = useState<string>()
  const selection = useSelection()
  const noop = () => undefined
  return (
    <section
      className="pane"
      aria-label={`${scheme} theme`}
      data-color-scheme={scheme}
    >
      <h2 className="pane-title">Figma {scheme}</h2>
      <div className="pane-window">
        <Inspector
          entry={entry}
          records={records}
          oldInstances={[]}
          overrides={NO_OVERRIDES}
          selection={selection}
          busy={false}
          onApply={noop}
          onReview={noop}
          onRevert={noop}
          onBack={noop}
          onSelect={(ids) => setWent(`Go to ${ids.join(', ')}`)}
          onChange={noop}
          mapping={mapping}
          showCounts={false}
          onChangeRow={noop}
          onChangeBinding={noop}
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
        <h1>A frame&rsquo;s instances as a tree (phase 2 design)</h1>
        <p>
          The Layers view of the FRIOD test frame &ldquo;Casper case
          (local)&rdquo;, from the scan the tests use. Open the PE Editor (test)
          group: the values on its own layers come first, then the instances in
          it, in the tree of the Instances tab, with their values as the leaves.
        </p>
      </header>
      <main className="panes">
        <Pane scheme="light" />
        <Pane scheme="dark" />
      </main>
    </StrictMode>,
  )
}
