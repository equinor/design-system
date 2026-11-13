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

describe('report and main components', () => {
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
  const frameTotals = totalsOf(entries)
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

  it('counts the main components in the scope and lists them', () => {
    const report = buildReport({
      fileName: 'File',
      summary,
      records,
      oldInstances: [],
      overrides: NO_OVERRIDES,
    })
    expect(report.csv.trim().split('\n')).toHaveLength(3)
    expect(report.markdown).toContain('## Main components (1)')
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

describe('display settings kept per person', () => {
  it('fills in the defaults for anything missing or wrong', async () => {
    const { readSettings, DEFAULT_SETTINGS } =
      await import('../src/shared/window')
    expect(readSettings(undefined)).toEqual(DEFAULT_SETTINGS)
    expect(
      readSettings({ showCounts: false, showEmpty: 'yes', theme: 'dark' }),
    ).toEqual({
      showCounts: false,
      showEmpty: DEFAULT_SETTINGS.showEmpty,
      theme: 'dark',
    })
    expect(readSettings({ theme: 'purple' }).theme).toBe('figma')
  })
})

describe('EDS Beta typography variables without a text style', () => {
  const variable = (name: string) => ({
    id: name,
    key: name,
    name,
    type: 'FLOAT' as const,
    collectionKey: 'new',
    collectionName: 'typography',
  })

  it('names the text style the variables describe', async () => {
    const { styleForVariables } = await import('../src/scan/classify')
    expect(
      styleForVariables({
        fontSize: variable('typography/header/xl/font-size'),
        fontWeight: variable('font-weight/medium'),
      }),
    ).toBe('header/xl')
    expect(
      styleForVariables({
        fontSize: variable('typography/label/md/font-size'),
        fontWeight: variable('font-weight/bold'),
      }),
    ).toBe('label/md/bold')
    expect(
      styleForVariables({
        fontSize: variable('typography/body/sm/font-size'),
        fontWeight: variable('font-weight/normal'),
      }),
    ).toBe('body/sm/default')
    expect(
      styleForVariables({ fontSize: variable('spacing/md') }),
    ).toBeUndefined()
  })
})

describe('the picker and zero spacing', () => {
  it('offers 0 without a variable instead of spacing/none', async () => {
    const { pickerOptions } = await import('../src/mapping/picker')
    const options = pickerOptions({
      kinds: ['spacing'],
      group: 'spacing',
      candidates: [],
    })
    expect(options.others).toContain('value:0')
    expect(options.others).not.toContain('spacing/none')
  })
})

describe('repairing a text from EDS Beta variables', () => {
  it('takes label for single-line text in a control, and body elsewhere', async () => {
    const { NEW } = await import('../src/mapping/inventory')
    const beta = (name: string) => ({
      id: name,
      key: name,
      name,
      type: 'FLOAT' as const,
      collectionKey: NEW.density,
      collectionName: 'density',
    })
    const unit = (names: string[], singleLine: boolean): RawUnit => ({
      nodeId: 'text',
      nodeName: 'Label',
      nodeType: 'TEXT',
      entryId: 'frame',
      path: [],
      property: { type: 'typography' },
      context: { nodeType: 'TEXT', names, modes: {}, singleLine },
      unit: 'typography',
      fields: {
        fontSize: beta('typography/body/md/font-size'),
        fontWeight: beta('font-weight/normal'),
      },
      font: { family: 'Inter', style: 'Regular' },
      fontSize: 16,
    })
    expect(
      classifyUnit(unit(['Label', 'Button / Primary'], true))?.candidates,
    ).toEqual(['label/md/default'])
    expect(
      classifyUnit(unit(['Description', 'Card'], false))?.candidates,
    ).toEqual(['body/md/default'])
  })
})

describe('how different two colours look', () => {
  it('is near 0 for the same colour and clearly visible for a paler grey', async () => {
    const { colourDistance, VISIBLE_CHANGE } =
      await import('../src/mapping/colour-distance')
    expect(colourDistance('#e0e0e0', '#e0e0e0')).toBeCloseTo(0)
    expect(colourDistance('#e0e0e0', '#f8f8f8')!).toBeGreaterThan(
      VISIBLE_CHANGE,
    )
    expect(colourDistance('#ffffff', '#fdfdfd')!).toBeLessThan(VISIBLE_CHANGE)
    expect(colourDistance('nope', '#ffffff')).toBeUndefined()
  })

  it('lays a colour with alpha over the surface of its scheme', async () => {
    const { colourDistance } = await import('../src/mapping/colour-distance')
    expect(colourDistance('#00000000', '#ffffff', 'light')).toBeCloseTo(0)
    expect(colourDistance('#ffffff00', '#030303', 'dark')).toBeCloseTo(0)
  })
})
