/**
 * What the window draws while a scan runs: the order the map lists the
 * top-level layers in, which values count as legacy or Beta, and how the
 * window adds up the scan messages into the loader's state and progress.
 */
import { describe, expect, it } from 'vitest'
import { NEW, NEW_TEXT_STYLES, OLD } from '../src/mapping/inventory'
import { mapLayers, unitOrigin } from '../src/scan/trace'
import type { MapNode } from '../src/scan/trace'
import type { RawUnit, RawVariable } from '../src/scan/types'
import type { ScanMap } from '../src/shared/messages'
import {
  NO_TRACE,
  scanFraction,
  tileEnds,
  traceScan,
} from '../src/ui/scanTrace'

type FakeNode = MapNode & { children?: FakeNode[] }

const node = (id: string, type: string, children?: FakeNode[]): FakeNode => ({
  id,
  type,
  ...(children ? { children } : {}),
})

const ids = (nodes: FakeNode[]) => nodes.map((each) => each.id)

describe('mapLayers', () => {
  it('lists a page in the order the scan reads it: frames, sections in place, then loose layers', () => {
    const page = [
      node('A', 'FRAME'),
      node('t1', 'TEXT'),
      node('S', 'SECTION', [node('B', 'FRAME'), node('t2', 'TEXT')]),
      node('C', 'COMPONENT_SET'),
    ]
    const { tiles, sections } = mapLayers(page, false)
    // The section's loose layer is read when the section ends, the page's
    // when the page ends (scan.ts, collectContainer).
    expect(ids(tiles)).toEqual(['A', 'B', 't2', 'C', 't1'])
    expect(sections.map((section) => section.id)).toEqual(['S'])
  })

  it('reads each selected layer on its own, in the order of the selection', () => {
    const { tiles } = mapLayers(
      [node('t1', 'TEXT'), node('A', 'FRAME'), node('t2', 'RECTANGLE')],
      true,
    )
    expect(ids(tiles)).toEqual(['t1', 'A', 't2'])
  })
})

const variable = (collectionKey: string): RawVariable => ({
  id: `VariableID:${collectionKey}/x`,
  key: 'key-x',
  name: 'x',
  type: 'COLOR',
  collectionKey,
  collectionName: 'Collection',
})

const base = {
  nodeId: '1:2',
  nodeName: 'Card',
  nodeType: 'FRAME',
  entryId: '1:1',
  path: [],
  context: { nodeType: 'FRAME', names: ['Card'], modes: {} },
}

const fill = (collectionKey: string) =>
  ({
    ...base,
    unit: 'variable',
    kind: 'fill',
    property: { type: 'paint', field: 'fills', index: 0 },
    variable: variable(collectionKey),
  }) as RawUnit

describe('unitOrigin', () => {
  it('tells legacy values from Beta values and leaves other libraries out', () => {
    expect(unitOrigin(fill(OLD.staticSemantic))).toBe('legacy')
    expect(unitOrigin(fill(NEW.semantic))).toBe('beta')
    expect(unitOrigin(fill('f'.repeat(40)))).toBeUndefined()
  })

  it('counts a text with a Beta text style as Beta, and one legacy field as legacy', () => {
    const text = {
      ...base,
      unit: 'typography',
      property: { type: 'typography' },
      font: { family: 'Inter', style: 'Regular' },
      fontSize: 14,
    }
    expect(
      unitOrigin({
        ...text,
        fields: {},
        textStyle: { id: 'S:1', key: NEW_TEXT_STYLES[0].key, name: 'x' },
      } as RawUnit),
    ).toBe('beta')
    expect(
      unitOrigin({
        ...text,
        fields: { fontSize: variable(OLD.fontSize) },
        textStyle: { id: 'S:1', key: NEW_TEXT_STYLES[0].key, name: 'x' },
      } as RawUnit),
    ).toBe('legacy')
  })
})

const map: ScanMap = {
  pageId: '0:1',
  width: 400,
  height: 100,
  tiles: [
    [0, 0, 300, 100],
    [300, 0, 100, 100],
  ],
  sections: [],
}

describe('tileEnds', () => {
  it('weighs a tile half by its area and half by its count, ending at 1', () => {
    const ends = tileEnds(map)
    // (0.75 + 0.5) / 2, then the rest
    expect(ends[0]).toBeCloseTo(0.625)
    expect(ends[1]).toBeCloseTo(1)
  })
})

describe('traceScan', () => {
  const progress = (pageIndex: number, extra = {}) => ({
    type: 'scan-progress' as const,
    progress: {
      pageName: `Page ${pageIndex}`,
      pageIndex,
      pageCount: 2,
      nodes: 10,
      ...extra,
    },
  })

  it('adds up a page: its map, the layers read and the dots in batches', () => {
    let trace = traceScan(NO_TRACE, {
      type: 'scan-start',
      scope: 'file',
      pageCount: 2,
    })
    trace = traceScan(trace, progress(0))
    expect(scanFraction(trace)).toBe(0)
    trace = traceScan(trace, { type: 'scan-map', pageIndex: 0, map })
    trace = traceScan(
      trace,
      progress(0, { current: 0, tilesDone: 0, dots: [[1, 1, 1]] }),
    )
    trace = traceScan(
      trace,
      progress(0, { current: 1, tilesDone: 1, dots: [[2, 2, 0]] }),
    )
    expect(trace.dots).toEqual([[[1, 1, 1]], [[2, 2, 0]]])
    expect(trace.current).toBe(1)
    // The first of two pages, 0.625 of the way through it
    expect(scanFraction(trace)).toBeCloseTo(0.3125)
  })

  it('starts the next page without the map and dots of the last one', () => {
    let trace = traceScan(NO_TRACE, { type: 'scan-map', pageIndex: 0, map })
    trace = traceScan(trace, progress(0, { tilesDone: 2, dots: [[1, 1, 1]] }))
    expect(scanFraction(trace)).toBeCloseTo(0.5)
    trace = traceScan(trace, progress(1, { tilesDone: 0 }))
    expect(trace.map).toBeUndefined()
    expect(trace.dots).toEqual([])
    expect(trace.pageName).toBe('Page 1')
    expect(scanFraction(trace)).toBeCloseTo(0.5)
  })

  it('forgets the last scan when a new one starts', () => {
    const trace = traceScan(NO_TRACE, { type: 'scan-map', pageIndex: 0, map })
    expect(traceScan(trace, { type: 'trace-reset' })).toEqual(NO_TRACE)
  })
})
