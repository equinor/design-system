/** The report: Markdown sections and one CSV row per binding. */
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { classifyUnits } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { NO_OVERRIDES } from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import { summariseEntries, totalsOf, healthOf } from '../src/scan/summary'
import type { ScanSummary } from '../src/scan/types'

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
    fileName: 'AI Testing',
    summary,
    records,
    oldInstances: [],
    overrides: NO_OVERRIDES,
  })

  it('has the health, the frames, and the check and no-equivalent lists', () => {
    expect(report.markdown).toContain(
      '# EDS variable migration report: AI Testing',
    )
    expect(report.markdown).toContain('## Health: 0%')
    expect(report.markdown).toContain(`## Needs check (${totals.check})`)
    expect(report.markdown).toContain(`## No equivalent (${totals.none})`)
    expect(report.markdown).toContain('Migration test – old EDS variables')
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
    expect(report.baseName).toBe('eds-migration-AI-Testing-2026-11-11')
  })
})
