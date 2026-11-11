/**
 * The pure part of a scan: classification of raw units, counting and health,
 * and the fixture format.
 */
import { describe, expect, it } from 'vitest'
import { NEW, NEW_TEXT_STYLES, OLD } from '../src/mapping/inventory'
import { classifyUnit } from '../src/scan/classify'
import { packFixture, unpackFixture } from '../src/scan/fixture'
import {
  emptyCounts,
  formatHealth,
  healthOf,
  summariseEntries,
} from '../src/scan/summary'
import type { RawUnit, RawVariable } from '../src/scan/types'
import { ROOT } from './helpers'

const context = (names: string[], extra = {}) => ({
  nodeType: 'FRAME',
  names: [...names, ROOT],
  modes: {},
  ...extra,
})

const raw = (
  collectionKey: string,
  name: string,
  extra: Partial<RawVariable> = {},
): RawVariable => ({
  id: `VariableID:${collectionKey}/${name}`,
  key: `key-${name}`,
  name,
  type: 'COLOR',
  collectionKey,
  collectionName: 'Collection',
  ...extra,
})

const base = {
  nodeId: '1:2',
  nodeName: 'Card',
  nodeType: 'FRAME',
  entryId: '1:1',
  path: ['Page frame'],
}

const fill = (variable: RawVariable, extra: Partial<RawUnit> = {}): RawUnit =>
  ({
    ...base,
    unit: 'variable',
    kind: 'fill',
    property: { type: 'paint', field: 'fills', index: 0 },
    variable,
    context: context(['Card']),
    ...extra,
  }) as RawUnit

describe('classifyUnit', () => {
  it('counts a variable from EDS Foundation as migrated', () => {
    expect(
      classifyUnit(fill(raw(NEW.semantic, 'background/surface'))),
    ).toMatchObject({ category: 'migrated', current: 'background/surface' })
  })

  it('counts a variable from another library as other, outside the score', () => {
    expect(classifyUnit(fill(raw('f'.repeat(40), 'Brand/Blue')))).toMatchObject(
      { category: 'other' },
    )
  })

  it('proposes a target for an old variable', () => {
    expect(
      classifyUnit(fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'))),
    ).toMatchObject({
      category: 'sure',
      old: 'Bg/Neutral/Surface',
      candidates: ['background/surface'],
    })
  })

  it('reports an old variable inside an instance without a proposal', () => {
    const record = classifyUnit(
      fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'), {
        instanceId: '1:9',
      }),
    )
    expect(record).toMatchObject({ category: 'inInstance', instanceId: '1:9' })
    expect(record?.candidates).toBeUndefined()
  })

  it('counts text set in an EDS Foundation text style as migrated', () => {
    const style = NEW_TEXT_STYLES.find((s) => s.name === 'label/md/default')
    if (!style) throw new Error('label/md/default is missing')
    const record = classifyUnit({
      ...base,
      nodeType: 'TEXT',
      unit: 'typography',
      property: { type: 'typography' },
      fields: {},
      font: { family: 'Inter', style: 'Regular' },
      fontSize: 14,
      textStyle: { id: `S:${style.key},`, key: style.key, name: style.name },
      context: context(['Label'], { nodeType: 'TEXT' }),
    })
    expect(record).toMatchObject({
      category: 'migrated',
      current: 'label/md/default',
    })
  })

  it('does not count text with no typography bindings', () => {
    expect(
      classifyUnit({
        ...base,
        nodeType: 'TEXT',
        unit: 'typography',
        property: { type: 'typography' },
        fields: {},
        font: { family: 'Inter', style: 'Regular' },
        fontSize: 14,
        context: context(['Label'], { nodeType: 'TEXT' }),
      }),
    ).toBeNull()
  })

  it('maps an old mode and counts a new one as migrated', () => {
    const mode = (collectionKey: string, modeName: string): RawUnit => ({
      ...base,
      unit: 'mode',
      property: {
        type: 'mode',
        collectionId: `VariableCollectionId:${collectionKey}/1:1`,
      },
      collectionId: `VariableCollectionId:${collectionKey}/1:1`,
      collectionKey,
      collectionName: 'Density',
      modeId: '1:1',
      modeName,
      context: context(['Card']),
    })
    expect(classifyUnit(mode(OLD.density, 'Comfortable'))).toMatchObject({
      category: 'sure',
      candidates: ['density: compact'],
    })
    expect(classifyUnit(mode(NEW.density, 'compact'))).toMatchObject({
      category: 'migrated',
    })
  })
})

describe('health', () => {
  it('is migrated divided by everything scored, leaving other libraries out', () => {
    const counts = {
      ...emptyCounts(),
      migrated: 3,
      sure: 4,
      check: 1,
      none: 1,
      inInstance: 1,
      other: 50,
    }
    expect(healthOf(counts)).toBe(0.3)
    expect(formatHealth(healthOf(counts))).toBe('30%')
  })

  it('is null when there is nothing to score', () => {
    expect(healthOf({ ...emptyCounts(), other: 2 })).toBeNull()
    expect(formatHealth(null)).toBe('–')
  })

  it('sums records per entry and counts the old instances in each', () => {
    const records = [
      classifyUnit(fill(raw(NEW.semantic, 'background/surface'))),
      classifyUnit(fill(raw(OLD.staticSemantic, 'Bg/Neutral/Canvas'))),
    ].filter((record) => record !== null)
    const [entry] = summariseEntries(
      [
        {
          id: '1:1',
          kind: 'frame',
          name: 'Page frame',
          pageId: '0:1',
          pageName: 'Page',
          sections: [],
          nodeIds: ['1:1'],
        },
      ],
      records,
      [{ id: '1:9', name: 'Button', entryId: '1:1', count: 2 }],
    )
    expect(entry.counts).toMatchObject({ migrated: 1, sure: 1 })
    expect(entry.health).toBe(0.5)
    expect(entry.oldInstances).toBe(1)
  })
})

describe('fixture format', () => {
  it('packs and unpacks units without loss', () => {
    const banner = context(['Banner / Info'])
    const units: RawUnit[] = [
      fill(raw(OLD.staticSemantic, 'Bg/Info/Fill Muted/Default'), {
        nodeId: '1:3',
        nodeName: 'Banner / Info',
        context: banner,
      }),
      {
        ...base,
        nodeId: '1:4',
        nodeName: 'Message',
        nodeType: 'TEXT',
        unit: 'typography',
        property: { type: 'typography' },
        fields: {
          fontSize: raw(OLD.spacingSemantic, 'Typography/Font size', {
            type: 'FLOAT',
            chain: [
              {
                collectionKey: OLD.density,
                name: 'typography/ui-body/md/font-size',
              },
            ],
          }),
        },
        font: { family: 'Inter', style: 'Regular' },
        fontSize: 14,
        context: {
          ...context(['Message', 'Banner / Info'], {
            nodeType: 'TEXT',
            singleLine: false,
          }),
          fillUnder: {
            variable: raw(OLD.staticSemantic, 'Bg/Info/Fill Muted/Default'),
            context: banner,
          },
        },
      },
      {
        ...base,
        unit: 'mode',
        property: { type: 'mode', collectionId: 'VariableCollectionId:x/1' },
        collectionId: 'VariableCollectionId:x/1',
        collectionKey: OLD.density,
        collectionName: '💎 Density',
        modeId: '1:0',
        modeName: 'Spacious',
        instanceId: '1:9',
        context: context(['Card']),
      },
    ]
    const packed = packFixture(
      {
        generatedAt: '2026-11-11',
        fileName: 'Test',
        frame: { id: '1:1', name: 'Frame' },
      },
      units,
    )
    expect(Object.keys(packed.variables)).toHaveLength(2)
    expect(unpackFixture(packed)).toEqual(units)
  })
})
