/**
 * The full pipeline on a scan of the test frame "Migration test – old EDS
 * variables": the raw units the plugin read from Figma, classified by the
 * same code as in the plugin, checked against the answer key.
 *
 * The fixture is exported from Figma with Plugins → Development → EDS
 * variable migration → Developer → Export scan of selected frame as fixture,
 * with the test frame selected, and saved as test/fixtures/test-frame.json.
 * Until it is there, these tests are skipped.
 */
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { classifyUnits } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { propertyLabel } from '../src/scan/labels'
import type { BindingRecord } from '../src/scan/types'

const path = new URL('./fixtures/test-frame.json', import.meta.url)
const fixture = existsSync(path)
  ? (JSON.parse(readFileSync(path, 'utf8')) as PackedFixture)
  : undefined

/** Proposals by layer and property, from the answer key. */
const EXPECTED: [layer: string, property: string, proposal: string][] = [
  ['Migration test – old EDS variables', 'Fill', 'background/canvas'],
  ['Migration test – old EDS variables', 'Padding left', 'spacing/xl'],
  ['Migration test – old EDS variables', 'Gap', 'spacing/lg'],
  ['Top bar', 'Stroke', 'border/non-interactive/neutral/muted'],
  ['Top bar', 'Padding top', 'spacing/md'],
  ['Vector', 'Fill', 'icon/primary'],
  ['Page title', 'Typography', 'header/lg'],
  ['Link', 'Fill', 'text/interactive/link/default'],
  ['Link', 'Typography', 'label/md/default'],
  ['Banner / Info', 'Fill', 'background/non-interactive/info/muted'],
  ['Banner / Info', 'Padding top', 'spacing/sm'],
  ['Message', 'Fill', 'text/on-muted/info'],
  ['Message', 'Typography', 'body/md/default'],
  ['Card / Well', 'Stroke', 'border/non-interactive/neutral/default'],
  ['Card / Well', 'Gap', 'spacing/md'],
  ['Description', 'Typography', 'body/md/default'],
  ['Chip / Status', 'Fill', 'background/non-interactive/success/muted'],
  ['Chip / Status', 'Padding top', 'spacing/xs'],
  ['Chip / Status', 'Radius top left', 'corner-radius/pill'],
  ['Input', 'Stroke', 'border/interactive/focus'],
  ['Helper text (error)', 'Fill', 'text/on-default/danger'],
  ['Helper text (error)', 'Typography', 'body/sm/default'],
  [
    'Chip / Warning (dynamic)',
    'Fill',
    'background/interactive/warning/muted/default',
  ],
  [
    'Chip / Warning (dynamic)',
    'Stroke',
    'border/interactive/warning/muted/default',
  ],
  [
    'Button / Primary',
    'Fill',
    'background/interactive/accent/emphasis/default',
  ],
  [
    'Button / Primary (hover)',
    'Fill',
    'background/interactive/accent/emphasis/hover',
  ],
  ['Shortcut hint', 'Fill', 'text/on-emphasis/accent'],
  ['Button / Outlined', 'Stroke', 'border/interactive/accent/emphasis/default'],
  [
    'Button / Ghost (hover)',
    'Fill',
    'background/interactive/accent/muted/hover',
  ],
  [
    'Button / Danger (dynamic)',
    'Fill',
    'background/interactive/danger/emphasis/default',
  ],
  ['Button / Disabled', 'Fill', 'background/interactive/disabled'],
  ['Table / Wells (dense)', 'Mode', 'density: compact'],
  ['Row (hover)', 'Fill', 'background/interactive/neutral/muted/hover'],
  ['Overlay (dark scheme)', 'Mode', 'color-scheme: dark'],
  ['Menu', 'Fill', 'background/floating'],
  [
    'Menu item (selected)',
    'Fill',
    'background/interactive/accent/selected/default',
  ],
]

describe.skipIf(!fixture)('pipeline on the test frame', () => {
  const records: BindingRecord[] = fixture
    ? classifyUnits(unpackFixture(fixture))
    : []
  const find = (layer: string, property: string) =>
    records.filter(
      (record) =>
        record.nodeName === layer &&
        propertyLabel(record.property) === property,
    )

  it('finds only old variables, none inside an instance', () => {
    expect(records.length).toBeGreaterThan(0)
    expect(records.filter((record) => record.category === 'migrated')).toEqual(
      [],
    )
    expect(records.filter((record) => record.category === 'other')).toEqual([])
    expect(
      records.filter((record) => record.category === 'inInstance'),
    ).toEqual([])
  })

  it.each(EXPECTED)('%s, %s → %s', (layer, property, proposal) => {
    const found = find(layer, property)
    expect(found.length).toBeGreaterThan(0)
    for (const record of found) expect(record.candidates?.[0]).toBe(proposal)
  })

  it('reports only the icon size and the backdrop as having no equivalent', () => {
    const none = records
      .filter((record) => record.category === 'none')
      .map((record) => `${record.nodeName}: ${propertyLabel(record.property)}`)
      .sort()
    expect(none).toEqual([
      'Icon / menu: Height',
      'Icon / menu: Width',
      'Overlay (dark scheme): Fill',
    ])
  })

  it('gives every label and table cell a label style, and the header cells medium', () => {
    const cells = records.filter(
      (record) =>
        record.nodeName === 'Cell' && record.property.type === 'typography',
    )
    expect(cells).toHaveLength(9)
    expect(
      cells.filter((record) => record.candidates?.[0] === 'label/sm/medium'),
    ).toHaveLength(3)
    expect(
      cells.filter((record) => record.candidates?.[0] === 'label/sm/default'),
    ).toHaveLength(6)
  })
})
