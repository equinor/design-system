/**
 * The pure part of a scan: classification of raw units, counting and health,
 * and the fixture format.
 */
import { describe, expect, it } from 'vitest'
import { NEW, NEW_TEXT_STYLES, OLD } from '../src/mapping/inventory'
import {
  classifyUnit,
  classifyUnits,
  manualFixTarget,
} from '../src/scan/classify'
import { packFixture, unpackFixture } from '../src/scan/fixture'
import {
  addToCounts,
  emptyCounts,
  formatHealth,
  healthOf,
  summariseEntries,
} from '../src/scan/summary'
import type { BindingRecord, RawUnit, RawVariable } from '../src/scan/types'
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

  it('proposes a target for a legacy variable an instance overrides', () => {
    const record = classifyUnit(
      fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'), {
        instanceId: '1:9',
        override: true,
      }),
    )
    expect(record).toMatchObject({
      category: 'sure',
      candidates: ['background/surface'],
      instanceId: '1:9',
      override: true,
    })
  })

  // EDS Core Components, Text Field: the swapped error icon inside the
  // .Icon Wrapper instance overrides its size with `Selectable/Icon size`.
  const iconSize = (extra: Partial<RawUnit> = {}): RawUnit =>
    ({
      ...base,
      nodeId: 'I385:1962;66:4158',
      nodeName: 'error filled',
      nodeType: 'INSTANCE',
      unit: 'variable',
      kind: 'size',
      property: { type: 'field', field: 'width' },
      variable: raw(OLD.spacingSemantic, 'Selectable/Icon size', {
        type: 'FLOAT',
        value: 16,
        chain: [
          { collectionKey: OLD.fontSize, name: 'typography/icon-size' },
          { collectionKey: OLD.density, name: 'sizing/icon/xs' },
        ],
      }),
      context: context(['error filled', 'Error icon'], {
        nodeType: 'INSTANCE',
      }),
      instanceId: '385:1962',
      override: true,
      ...extra,
    }) as RawUnit

  it('flags a size an instance overrides on a layer inside it as a Manual fix', () => {
    const record = classifyUnit(iconSize())
    expect(record).toMatchObject({
      category: 'byHand',
      rule: 'instance/size-override',
      override: true,
    })
    expect(record?.reason).toContain('Figma lets nobody change the size')
    expect(record?.reason).toContain('Reset all changes')
  })

  it('names the variable the main component uses there, which the reset gives', () => {
    const record = classifyUnit(
      iconSize({
        mainVariable: raw(NEW.semantic, 'spacing/md', { type: 'FLOAT' }),
        swap: { from: 'Placeholder Icon', to: 'error filled' },
      } as Partial<RawUnit>),
    )
    // The fix the plugin can make once a designer accepts it in Review
    expect(record).toMatchObject({
      category: 'byHand',
      candidates: ['reset:spacing/md'],
    })
    expect(manualFixTarget(record as BindingRecord)).toBe('spacing/md')
    expect(record?.reason).toContain(
      'It turns back into Placeholder Icon and takes spacing/md from the main component',
    )
    expect(record?.reason).toContain('swap it to error filled again')
  })

  it('gives the steps through the instance-swap property when the swap was made with one', () => {
    const record = classifyUnit(
      iconSize({
        mainVariable: raw(NEW.semantic, 'spacing/md', { type: 'FLOAT' }),
        swap: {
          from: 'Placeholder Icon',
          to: 'error filled',
          property: { name: 'Icon', on: 'Error icon' },
        },
      } as Partial<RawUnit>),
    )
    expect(record?.reason).toContain(
      'set its Icon property to Placeholder Icon and back to error filled',
    )
    expect(record?.candidates).toEqual(['reset:spacing/md'])
  })

  it('says to migrate the main component first when it uses a legacy variable too', () => {
    const record = classifyUnit(
      iconSize({
        mainVariable: raw(OLD.spacingSemantic, 'Selectable/Icon size', {
          type: 'FLOAT',
        }),
      } as Partial<RawUnit>),
    )
    expect(record?.category).toBe('byHand')
    expect(record?.reason).toContain('migrate the main component first')
    // A reset would give the legacy variable back, so the plugin offers no fix.
    expect(record?.candidates).toEqual([])
  })

  it('offers no plugin fix on a layer that is not an instance', () => {
    const record = classifyUnit(
      iconSize({
        nodeType: 'FRAME',
        mainVariable: raw(NEW.semantic, 'spacing/md', { type: 'FLOAT' }),
      } as Partial<RawUnit>),
    )
    expect(record).toMatchObject({ category: 'byHand', candidates: [] })
  })

  it('lists the changes a reset removes, with the values to set again', () => {
    const icon = iconSize({
      mainVariable: raw(NEW.semantic, 'spacing/md', { type: 'FLOAT' }),
    } as Partial<RawUnit>)
    const colour = fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'), {
      nodeId: 'I385:1962;66:4158;72:4046',
      nodeName: 'icon',
      instanceId: '385:1962',
      override: true,
    })
    const elsewhere = fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'), {
      nodeId: 'I385:1962;99:1',
      nodeName: 'label',
      instanceId: '385:1962',
      override: true,
    })
    const records = classifyUnits([icon, colour, elsewhere])
    const fix = records.find((record) => record.category === 'byHand')
    expect(fix?.reason).toContain(
      'icon, fill: background/surface (now Bg/Neutral/Surface)',
    )
    expect(fix?.reason).not.toContain('label')
  })

  it('keeps the rules for a size overridden on the instance itself', () => {
    const record = classifyUnit(iconSize({ nodeId: '385:1962' }))
    expect(record?.rule).not.toBe('instance/size-override')
    expect(record?.category).not.toBe('inInstance')
  })

  it('reports a size the instance takes from its main component as inside instances', () => {
    expect(classifyUnit(iconSize({ override: undefined }))).toMatchObject({
      category: 'inInstance',
    })
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

describe('property groups', () => {
  it('groups paints as colour, and fields by what they size', () => {
    const variable = raw(OLD.density, 'spacing/horizontal/md', {
      type: 'FLOAT',
    })
    const unit = (kind: string, field: string) =>
      ({
        ...base,
        unit: 'variable',
        kind,
        property: { type: 'field', field },
        variable,
        context: context(['Card']),
      }) as RawUnit
    expect(
      classifyUnit(fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface')))?.group,
    ).toBe('colour')
    expect(classifyUnit(unit('spacing', 'paddingLeft'))?.group).toBe('spacing')
    expect(classifyUnit(unit('size', 'width'))?.group).toBe('size')
    expect(classifyUnit(unit('radius', 'topLeftRadius'))?.group).toBe('radius')
    expect(classifyUnit(unit('opacity', 'opacity'))?.group).toBe('other')
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

  it('counts a migrated override as outside instances', () => {
    const counts = emptyCounts()
    const migrated = classifyUnit(
      fill(raw(NEW.semantic, 'background/surface'), {
        instanceId: '1:9',
        override: true,
      }),
    )
    const inherited = classifyUnit(
      fill(raw(NEW.semantic, 'background/surface'), { instanceId: '1:9' }),
    )
    if (!migrated || !inherited) throw new Error('not classified')
    addToCounts(counts, migrated)
    addToCounts(counts, inherited)
    expect(counts.migrated).toBe(2)
    expect(counts.migratedInInstances).toBe(1)
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
      fill(raw(OLD.staticSemantic, 'Bg/Neutral/Surface'), {
        nodeId: 'I1:9;2:1',
        instanceId: '1:9',
        override: true,
      }),
    ]
    const packed = packFixture(
      {
        generatedAt: '2026-11-11',
        fileName: 'Test',
        frame: { id: '1:1', name: 'Frame' },
      },
      units,
    )
    expect(Object.keys(packed.variables)).toHaveLength(3)
    expect(unpackFixture(packed)).toEqual(units)
  })
})
