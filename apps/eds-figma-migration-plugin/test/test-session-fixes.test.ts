/** Fixes from the FRIOD test session on 2026-11-11 that can be tested without Figma. */
import { describe, expect, it } from 'vitest'
import { classifyUnit } from '../src/scan/classify'
import { NO_OVERRIDES } from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import {
  emptyCounts,
  healthOutsideInstances,
  summariseEntries,
  sumCounts,
  totalsOf,
  healthOf,
} from '../src/scan/summary'
import type { BindingRecord, RawUnit, ScanSummary } from '../src/scan/types'
import { counterpartId, nestingDepth } from '../src/shared/instance-ids'

const record = (
  id: string,
  entryId: string,
  category: BindingRecord['category'],
  instanceId?: string,
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId,
  path: [],
  property: { type: 'field', field: 'paddingLeft' },
  group: 'spacing',
  category,
  ...(instanceId ? { instanceId } : {}),
})

describe('instance ids', () => {
  it('finds a main component layer inside an instance', () => {
    expect(counterpartId('17:426', 'I15:359;2526:534')).toBe(
      'I17:426;15:359;2526:534',
    )
    expect(counterpartId('17:426', '15:359')).toBe('I17:426;15:359')
  })

  it('finds it inside an instance nested in another instance', () => {
    expect(counterpartId('I17:299;15:535', 'I15:408;2526:534')).toBe(
      'I17:299;15:535;15:408;2526:534',
    )
    expect(nestingDepth('17:426')).toBe(1)
    expect(nestingDepth('I17:299;15:535')).toBe(2)
  })
})

describe('counts', () => {
  it('counts migrated values inside instances apart, for the figure outside instances', () => {
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
      [
        record('a', 'frame', 'migrated'),
        record('b', 'frame', 'migrated', 'instance'),
        record('c', 'frame', 'none'),
        record('d', 'frame', 'inInstance', 'instance'),
      ],
      [],
    )
    const totals = totalsOf(entries)
    expect(totals.migrated).toBe(2)
    expect(totals.migratedInInstances).toBe(1)
    // Outside instances: 1 migrated of 1 migrated + 1 no equivalent.
    expect(healthOutsideInstances(totals)).toBe(0.5)
    expect(sumCounts([totals, emptyCounts()]).migratedInInstances).toBe(1)
  })

  it('counts a border width the plugin set as a number as migrated', () => {
    const unit: RawUnit = {
      nodeId: 'card',
      nodeName: 'Card',
      nodeType: 'FRAME',
      entryId: 'frame',
      path: [],
      property: { type: 'field', field: 'strokeWeight' },
      context: { nodeType: 'FRAME', names: ['Card'], modes: {} },
      unit: 'value',
      value: 1,
    }
    expect(classifyUnit(unit)).toMatchObject({
      category: 'migrated',
      group: 'size',
    })
  })
})

describe('report and Local components', () => {
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
      {
        id: 'button',
        kind: 'component',
        name: 'Button',
        pageId: 'page',
        pageName: 'Page',
        sections: [],
        nodeIds: ['button'],
        instanceCount: 15,
      },
    ],
    [record('a', 'frame', 'sure'), record('b', 'button', 'sure')],
    [],
  )
  const frameTotals = totalsOf(entries.filter((e) => e.kind !== 'component'))
  const summary: ScanSummary = {
    scope: 'page',
    scannedAt: '2026-11-11T12:00:00.000Z',
    mappingVersion: 'test',
    pages: [{ id: 'page', name: 'Page' }],
    nodesScanned: 2,
    totals: frameTotals,
    health: healthOf(frameTotals),
    entries,
  }
  const records = [record('a', 'frame', 'sure'), record('b', 'button', 'sure')]

  it('leaves local components out when the window does', () => {
    const report = buildReport({
      fileName: 'File',
      summary,
      records,
      oldInstances: [],
      overrides: NO_OVERRIDES,
    })
    expect(report.csv.trim().split('\n')).toHaveLength(2)
    expect(report.markdown).toContain('left out, as in the window')
  })

  it('counts them when Local components is on', () => {
    const report = buildReport({
      fileName: 'File',
      summary,
      records,
      oldInstances: [],
      overrides: NO_OVERRIDES,
      includeComponents: true,
    })
    expect(report.csv.trim().split('\n')).toHaveLength(3)
    expect(report.markdown).toContain('## Local components (1)')
    expect(report.markdown).toMatch(/\| Button \| Page \|.*\| 15 \|/)
  })
})

describe('colour scheme of a layer', () => {
  it('follows the layer, not the theme of the window', async () => {
    const { targetScheme, schemesOf } = await import('../src/mapping/scheme')
    const { NEW, OLD } = await import('../src/mapping/inventory')
    expect(targetScheme({})).toBe('light')
    expect(targetScheme({ [OLD.colorScheme]: 'Dark' })).toBe('dark')
    expect(
      targetScheme({ [OLD.colorScheme]: 'Dark', [NEW.colorScheme]: 'light' }),
    ).toBe('light')
    expect(schemesOf([{ scheme: 'dark' }, {}])).toEqual(['light', 'dark'])
    expect(schemesOf([])).toEqual(['light'])
  })
})
