/** The report: Markdown sections and one CSV row per binding. */
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { classifyUnits } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { NO_OVERRIDES } from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import { summariseEntries, totalsOf, healthOf } from '../src/scan/summary'
import type { BindingRecord, ScanSummary } from '../src/scan/types'

const path = new URL('./fixtures/test-frame.json', import.meta.url)
const fixture = existsSync(path)
  ? (JSON.parse(readFileSync(path, 'utf8')) as PackedFixture)
  : undefined

describe.skipIf(!fixture)('buildReport on the test frame', () => {
  const records = fixture ? classifyUnits(unpackFixture(fixture)) : []
  const entries = summariseEntries(
    [
      {
        id: fixture?.frame.id ?? '',
        kind: 'frame',
        name: fixture?.frame.name ?? '',
        pageId: 'page',
        pageName: 'Fgima Agent test',
        sections: ['Section 1'],
        nodeIds: [fixture?.frame.id ?? ''],
      },
    ],
    records,
    [],
  )
  const totals = totalsOf(entries)
  const summary: ScanSummary = {
    scope: 'selection',
    scannedAt: '2026-11-11T12:00:00.000Z',
    mappingVersion: 'test',
    pages: [{ id: 'page', name: 'Fgima Agent test' }],
    nodesScanned: 66,
    totals,
    health: healthOf(totals),
    entries,
  }
  const report = buildReport({
    fileName: 'Sample file',
    summary,
    records,
    oldInstances: [],
    overrides: NO_OVERRIDES,
  })

  it('has the health, the frames, and the check and no-equivalent lists', () => {
    expect(report.markdown).toContain(
      '# EDS variable migration report: Sample file',
    )
    expect(report.markdown).toContain('## Health: 0%')
    expect(report.markdown).toContain(`## Needs check (${totals.check})`)
    expect(report.markdown).toContain(`## No equivalent (${totals.none})`)
    expect(report.markdown).toContain('Well overview')
  })

  it('has one CSV row per binding, with a header', () => {
    const lines = report.csv.trim().split('\n')
    expect(lines[0]).toBe(
      'Frame,Page,Layer,Property,Status,Legacy,Target,Chosen by,Why,Rules version',
    )
    expect(lines).toHaveLength(
      records.filter((record) => record.category !== 'other').length + 1,
    )
  })

  it('names the files after the file and the date', () => {
    expect(report.baseName).toBe('eds-migration-Sample-file-2026-11-11')
  })
})

describe('buildReport on a Manual fix', () => {
  const fix: BindingRecord = {
    id: 'icon',
    nodeId: 'icon',
    nodeName: 'error filled',
    nodeType: 'INSTANCE',
    entryId: 'frame',
    path: ['Frame', 'Error icon'],
    property: { type: 'field', field: 'width' },
    group: 'size',
    category: 'byHand',
    oldKey: 'spacing/Selectable/Icon size',
    old: 'Selectable/Icon size',
    candidates: ['reset:spacing/md'],
    reason: 'To fix it, reset the layer.',
    resetEffects: ['icon, fill: background/surface (now Bg/Neutral/Surface)'],
    rule: 'instance/size-override',
    instanceId: 'field',
    override: true,
  }
  const entries = summariseEntries(
    [
      {
        id: 'frame',
        kind: 'frame',
        name: 'Frame',
        pageId: 'page',
        pageName: 'Page',
        sections: [],
        nodeIds: ['frame'],
      },
    ],
    [fix],
    [],
  )
  const totals = totalsOf(entries)
  const summary: ScanSummary = {
    scope: 'page',
    scannedAt: '2026-11-16T12:00:00.000Z',
    mappingVersion: 'test',
    pages: [{ id: 'page', name: 'Page' }],
    nodesScanned: 1,
    totals,
    health: healthOf(totals),
    entries,
  }
  const effects =
    'Resetting the layer also removes these. The plugin puts each one back as it is now, and the same Apply changes the Ready ones to the EDS Beta value shown: icon, fill: background/surface (now Bg/Neutral/Surface).'

  it('prints what the reset also removes and sets again after the steps', () => {
    const report = buildReport({
      fileName: 'File',
      summary,
      records: [fix],
      oldInstances: [],
      overrides: NO_OVERRIDES,
    })
    expect(report.markdown).toContain(`To fix it, reset the layer. ${effects}`)
  })

  it('escapes backslashes and pipes in a table cell', () => {
    const named: BindingRecord = { ...fix, path: ['Frame', 'Icon \\| left'] }
    const report = buildReport({
      fileName: 'File',
      summary,
      records: [named],
      oldInstances: [],
      overrides: NO_OVERRIDES,
    })
    expect(report.markdown).toContain('Icon \\\\\\| left')
  })

  it('keeps them in the CSV once the fix is accepted', () => {
    const report = buildReport({
      fileName: 'File',
      summary,
      records: [fix],
      oldInstances: [],
      overrides: { records: { icon: 'reset:spacing/md' }, rows: {} },
    })
    const row = report.csv.trim().split('\n')[1]
    expect(row).toContain('Ready')
    expect(row).toContain(effects)
  })
})
