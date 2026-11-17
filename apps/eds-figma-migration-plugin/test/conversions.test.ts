/**
 * Typography conversion as rows with targets (decisions A and B,
 * 2026-11-16): the text style and colour of each Typography instance are
 * records made at scan time, kept apart from the scan's records, listed on
 * the Typography tab like Changes, and Convert uses the designer's choices
 * on them.
 */
import { describe, expect, it } from 'vitest'
import { NEW_TEXT_STYLES, OLD } from '../src/mapping/inventory'
import type { Outcome } from '../src/mapping/types'
import {
  changeOutcome,
  conversionSkipReason,
  NO_LEGACY_TYPOGRAPHY,
  planConversions,
} from '../src/scan/apply-plan'
import { classifyUnits } from '../src/scan/classify'
import {
  conversionId,
  conversionRecords,
  styleTextCase,
} from '../src/scan/conversions'
import type { ConversionSource } from '../src/scan/conversions'
import { packFixture, unpackFixture } from '../src/scan/fixture'
import {
  buildMappingGroups,
  DECIDE_LATER,
  effectiveTarget,
  NO_OVERRIDES,
  rowKey,
} from '../src/scan/mapping'
import type { Overrides } from '../src/scan/mapping'
import { summariseEntries, totalsOf } from '../src/scan/summary'
import type {
  BindingRecord,
  OldInstance,
  RawUnit,
  RawVariable,
} from '../src/scan/types'
import { conversionStates } from '../src/ui/conversions'
import { reviewItems } from '../src/ui/review'
import { ROOT } from './helpers'

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

const INSTANCE = '10:1'
const TEXT = `I${INSTANCE};2:3`

/** A Typography instance in a card, as findOldInstances reports it. */
const instance: OldInstance = {
  id: INSTANCE,
  name: 'Typography',
  entryId: '1:1',
  typography: true,
  text: 'Hello',
  textId: TEXT,
  count: 2,
  mainComponent: { name: 'Typography', key: 'typography', remote: true },
}

const source: ConversionSource = {
  ...instance,
  textId: TEXT,
  path: ['Card'],
}

const textContext = {
  nodeType: 'TEXT',
  names: ['Text', 'Typography', 'Card', ROOT],
  modes: {},
  singleLine: true,
}

const textBase = {
  nodeId: TEXT,
  nodeName: 'Text',
  nodeType: 'TEXT',
  entryId: '1:1',
  path: ['Card', 'Typography'],
  instanceId: INSTANCE,
  context: textContext,
}

/** The typography of the text in the instance: UI body, md, squished, which is label/md/default. */
const typography = (
  extra: Partial<Extract<RawUnit, { unit: 'typography' }>> = {},
): RawUnit => ({
  ...textBase,
  unit: 'typography',
  property: { type: 'typography' },
  fields: {
    fontSize: raw(OLD.density, 'typography/ui-body/md/font-size', {
      type: 'FLOAT',
    }),
    lineHeight: raw(OLD.density, 'typography/ui-body/md/line-height-squished', {
      type: 'FLOAT',
    }),
    fontFamily: raw(OLD.density, 'typography/ui-body/font-family', {
      type: 'STRING',
    }),
  },
  font: { family: 'Inter', style: 'Regular' },
  fontSize: 14,
  ...extra,
})

/** The text colour, Text/Neutral/Strong, which is text/primary. */
const textFill: RawUnit = {
  ...textBase,
  unit: 'variable',
  kind: 'textFill',
  property: { type: 'paint', field: 'fills', index: 0 },
  variable: raw(OLD.staticSemantic, 'Text/Neutral/Strong'),
}

/** A padding on the card, outside the instance, which is not part of a conversion. */
const cardPadding: RawUnit = {
  nodeId: '1:2',
  nodeName: 'Card',
  nodeType: 'FRAME',
  entryId: '1:1',
  path: [],
  unit: 'variable',
  kind: 'spacing',
  property: { type: 'field', field: 'paddingLeft' },
  variable: raw(OLD.spacingSemantic, 'Container/Padding horizontal', {
    type: 'FLOAT',
    value: 16,
  }),
  context: { nodeType: 'FRAME', names: ['Card', ROOT], modes: {} },
}

describe('conversion records', () => {
  const units = [typography(), textFill, cardPadding]

  it('gives the typography and the colour of the text in a Typography instance', () => {
    const records = conversionRecords([source], units)
    expect(records.map((record) => record.id)).toEqual([
      conversionId(INSTANCE, 'typography'),
      conversionId(INSTANCE, 'fill'),
    ])
    expect(records[0]).toMatchObject({
      id: 'convert:10:1|typography',
      nodeId: INSTANCE,
      nodeName: '“Hello”',
      nodeType: 'INSTANCE',
      entryId: '1:1',
      path: ['Card'],
      group: 'typography',
      category: 'sure',
      candidates: ['label/md/default'],
      rule: 'type/style',
    })
    expect(records[1]).toMatchObject({
      id: 'convert:10:1|fill',
      nodeId: INSTANCE,
      group: 'colour',
      kind: 'textFill',
      category: 'sure',
      candidates: ['text/primary'],
    })
  })

  it('classifies them as if the text were not in an instance', () => {
    for (const record of conversionRecords([source], units)) {
      expect(record.instanceId).toBeUndefined()
      expect(record.override).toBeUndefined()
      expect(record.category).not.toBe('inInstance')
    }
  })

  it('gives them legacy keys of their own, so a choice on a row in Changes never reaches them', () => {
    const [style] = conversionRecords([source], units)
    expect(style.oldKey).toMatch(/^convert:typography:/)
    const inChanges: BindingRecord = {
      ...style,
      id: 'other',
      oldKey: style.oldKey?.replace(/^convert:/, ''),
    }
    const overrides: Overrides = {
      records: {},
      rows: { [rowKey(inChanges)]: 'label/lg/default' },
    }
    expect(effectiveTarget(style, overrides)).toEqual({
      target: 'label/md/default',
      source: 'proposal',
    })
  })

  it('gives no record for an instance without a text layer of its own in the units', () => {
    expect(
      conversionRecords([{ ...source, textId: 'I10:1;9:9' }], units),
    ).toEqual([])
  })

  it('leaves a text already in an EDS Beta style out, and keeps its colour', () => {
    const style = NEW_TEXT_STYLES.find(
      (candidate) => candidate.name === 'label/md/default',
    )
    if (!style) throw new Error('label/md/default is missing')
    const migrated = typography({
      fields: {},
      textStyle: { id: `S:${style.key},`, key: style.key, name: style.name },
    })
    // Migrated already: nothing to decide on, so no typography record, and
    // Convert skips the instance for want of one.
    expect(
      conversionRecords([source], [migrated, textFill]).map(
        (record) => record.id,
      ),
    ).toEqual([conversionId(INSTANCE, 'fill')])
  })
})

describe('text case (decision B)', () => {
  it('reads every EDS Beta text style as having no text case, since the inventory records none', () => {
    expect(styleTextCase('label/md/default')).toBe('ORIGINAL')
    expect(styleTextCase('header/xl')).toBe('ORIGINAL')
  })

  it('makes a Ready text style Needs check when the legacy text has another case', () => {
    const [style, fill] = conversionRecords(
      [source],
      [typography({ textCase: 'UPPER' }), textFill],
    )
    expect(style).toMatchObject({
      category: 'check',
      outcome: 'check',
      candidates: ['label/md/default'],
      rule: 'type/style',
    })
    expect(style.reason).toMatch(/^The legacy text has upper case/)
    expect(style.reason).toMatch(/drops the case/)
    // Kept, so the Convert confirmation counts the case it drops.
    expect(style.textCase).toBe('UPPER')
    // The colour is not affected by the case.
    expect(fill.category).toBe('sure')
  })

  it('counts more than one case in the text as another case', () => {
    const [style] = conversionRecords(
      [source],
      [typography({ textCase: 'MIXED' })],
    )
    expect(style.category).toBe('check')
    expect(style.reason).toMatch(/more than one text case/)
  })

  it('leaves a text without a case as the rules decided', () => {
    const [style] = conversionRecords([source], [typography()])
    expect(style.category).toBe('sure')
    expect(style.reason).not.toMatch(/text case/)
    expect(style.textCase).toBeUndefined()
  })

  it('keeps the text case through the fixture format', () => {
    const units = [typography({ textCase: 'TITLE' }), textFill]
    const packed = packFixture(
      {
        generatedAt: '2026-11-16',
        fileName: 'Test',
        frame: { id: '1:1', name: 'Card' },
      },
      units,
    )
    expect(unpackFixture(packed)).toEqual(units)
  })
})

describe('the health', () => {
  it('counts the instance values once, as Inside instances, whatever the conversion records say', () => {
    const units = [typography(), textFill, cardPadding]
    const records = classifyUnits(units)
    const conversions = conversionRecords([source], units)
    expect(
      conversions.filter((record) => record.category === 'sure'),
    ).toHaveLength(2)
    const totals = totalsOf(
      summariseEntries(
        [
          {
            id: '1:1',
            kind: 'frame',
            name: 'Card',
            pageId: '0:1',
            pageName: 'Page',
            sections: [],
            nodeIds: ['1:1'],
          },
        ],
        records,
        [instance],
      ),
    )
    expect(totals.inInstance).toBe(2)
    // The card padding is the only Ready value; the conversions add none.
    expect(totals.sure + totals.check + totals.none).toBe(1)
    expect(records.some((record) => record.id.startsWith('convert:'))).toBe(
      false,
    )
  })
})

/** A conversion record by hand, as conversionRecords makes them. */
const conversion = (
  instanceId: string,
  part: 'typography' | 'fill',
  category: Outcome,
  proposal: string,
): BindingRecord => ({
  id: conversionId(instanceId, part),
  nodeId: instanceId,
  nodeName: `“${instanceId}”`,
  nodeType: 'INSTANCE',
  entryId: 'frame',
  path: [],
  property:
    part === 'typography'
      ? { type: 'typography' }
      : { type: 'paint', field: 'fills', index: 0 },
  group: part === 'typography' ? 'typography' : 'colour',
  ...(part === 'fill' ? { kind: 'textFill' as const } : {}),
  category,
  outcome: category,
  oldKey: `convert:${part}:${instanceId}`,
  old:
    part === 'typography'
      ? 'typography/ui-body/md/font-size'
      : 'Text/Neutral/Strong',
  candidates: [proposal],
  reason: `${part} of ${instanceId}`,
  rule: part === 'typography' ? 'type/style' : 'colour/text-neutral',
})

const records = [
  conversion('ready', 'typography', 'sure', 'label/md/default'),
  conversion('ready', 'fill', 'sure', 'text/primary'),
  conversion('check', 'typography', 'check', 'label/md/medium'),
  conversion('check', 'fill', 'check', 'text/on-muted/neutral'),
  conversion('gap', 'typography', 'none', 'body/md/default'),
]
const ids = ['ready', 'check', 'gap', 'missing']
const record = (id: string) => {
  const found = records.find((candidate) => candidate.id === id)
  if (!found) throw new Error(`No record ${id}`)
  return found
}

const choose = (choices: Record<string, string>): Overrides => ({
  records: choices,
  rows: {},
})

describe('planConversions', () => {
  it('converts an instance whose text style is Ready, with the proposal and a Ready colour', () => {
    const plan = planConversions(records, NO_OVERRIDES, ['ready'])
    expect(plan.skipped).toEqual([])
    expect(plan.convert).toHaveLength(1)
    expect(plan.convert[0]).toMatchObject({
      instanceId: 'ready',
      style: { target: 'label/md/default', outcome: 'sure' },
      colour: { target: 'text/primary', outcome: 'sure' },
    })
  })

  it('skips a Needs check and a No equivalent without a choice, and an instance without a record', () => {
    const plan = planConversions(records, NO_OVERRIDES, ids)
    expect(plan.convert.map((item) => item.instanceId)).toEqual(['ready'])
    expect(
      plan.skipped.map(({ instanceId, name }) => ({ instanceId, name })),
    ).toEqual([
      { instanceId: 'check', name: '“check”' },
      { instanceId: 'gap', name: '“gap”' },
      { instanceId: 'missing', name: undefined },
    ])
    const [check, gap, missing] = plan.skipped.map((skip) => skip.reason)
    expect(check).toMatch(/needs a check/)
    expect(gap).toMatch(/no text style/)
    expect(missing).toBe(NO_LEGACY_TYPOGRAPHY)
  })

  it('uses a chosen style, and logs it as the designer’s', () => {
    const plan = planConversions(
      records,
      choose({ 'convert:check|typography': 'label/lg/bold' }),
      ['check'],
    )
    expect(plan.convert[0].style).toMatchObject({
      target: 'label/lg/bold',
      outcome: 'override',
    })
  })

  it('converts a Needs check once the proposal is confirmed, logged as confirmed', () => {
    const plan = planConversions(
      records,
      choose({ 'convert:check|typography': 'label/md/medium' }),
      ['check'],
    )
    expect(plan.convert[0].style).toMatchObject({
      target: 'label/md/medium',
      outcome: 'confirmed',
    })
  })

  it('converts a No equivalent once the stand-in is chosen', () => {
    const plan = planConversions(
      records,
      choose({ 'convert:gap|typography': 'body/md/default' }),
      ['gap'],
    )
    expect(plan.convert[0].style.outcome).toBe('confirmed')
  })

  it('follows a choice on the row as well as on the value', () => {
    const style = record('convert:check|typography')
    const plan = planConversions(
      records,
      { records: {}, rows: { [rowKey(style)]: 'label/md/bold' } },
      ['check'],
    )
    expect(plan.convert[0].style).toMatchObject({
      target: 'label/md/bold',
      outcome: 'override',
    })
  })

  it('skips an instance set to Decide later, even when its style was Ready', () => {
    const plan = planConversions(
      records,
      choose({ 'convert:ready|typography': DECIDE_LATER }),
      ['ready'],
    )
    expect(plan.convert).toEqual([])
    expect(plan.skipped[0].reason).toMatch(/Decide later/)
  })

  it('uses a chosen colour', () => {
    const plan = planConversions(
      records,
      choose({
        'convert:check|typography': 'label/md/medium',
        'convert:check|fill': 'text/primary',
      }),
      ['check'],
    )
    expect(plan.convert[0].colour).toMatchObject({
      target: 'text/primary',
      outcome: 'override',
    })
  })

  it('copies the legacy fill when the colour needs a check, or is set to Decide later', () => {
    const unchecked = planConversions(
      records,
      choose({ 'convert:check|typography': 'label/md/medium' }),
      ['check'],
    )
    expect(unchecked.convert[0].colour).toBeUndefined()
    const later = planConversions(
      records,
      choose({ 'convert:ready|fill': DECIDE_LATER }),
      ['ready'],
    )
    expect(later.convert[0].colour).toBeUndefined()
  })

  it('logs the outcome changeOutcome gives for the target', () => {
    const overrides = choose({
      'convert:check|typography': 'label/md/medium',
      'convert:gap|typography': 'body/lg/default',
    })
    const plan = planConversions(records, overrides, ids)
    for (const item of plan.convert) {
      expect(item.style.outcome).toBe(
        changeOutcome(item.style.record, item.style.target),
      )
    }
    expect(plan.convert.map((item) => item.style.outcome)).toEqual([
      'sure',
      'confirmed',
      'override',
    ])
  })

  it('plans each instance once', () => {
    expect(
      planConversions(records, NO_OVERRIDES, ['ready', 'ready']).convert,
    ).toHaveLength(1)
  })
})

describe('the Typography tab', () => {
  const groups = buildMappingGroups(records, { ownReasons: true })

  it('decides each instance the way the plan does', () => {
    const cases: Overrides[] = [
      NO_OVERRIDES,
      choose({ 'convert:check|typography': 'label/md/medium' }),
      choose({
        'convert:ready|typography': DECIDE_LATER,
        'convert:gap|typography': 'body/md/default',
        'convert:check|fill': 'text/primary',
      }),
    ]
    for (const overrides of cases) {
      const plan = planConversions(records, overrides, ids)
      const states = conversionStates(groups, overrides, ids)
      expect(ids.filter((id) => states.get(id)?.skip === undefined)).toEqual(
        plan.convert.map((item) => item.instanceId),
      )
      for (const skip of plan.skipped) {
        expect(states.get(skip.instanceId)?.skip).toBe(skip.reason)
      }
      for (const item of plan.convert) {
        const legacy = states.get(item.instanceId)?.legacyColour
        const hasFill = records.some(
          (candidate) => candidate.id === conversionId(item.instanceId, 'fill'),
        )
        expect(legacy !== undefined).toBe(hasFill && !item.colour)
      }
    }
  })

  it('names the legacy colour that stays', () => {
    const states = conversionStates(groups, NO_OVERRIDES, ['check'])
    expect(states.get('check')?.legacyColour).toBe('Text/Neutral/Strong')
  })

  it('reviews the values that wait for a decision', () => {
    const items = reviewItems(groups, NO_OVERRIDES)
    expect(items.map((item) => item.binding.id).sort()).toEqual([
      'convert:check|fill',
      'convert:check|typography',
      'convert:gap|typography',
    ])
    const later = reviewItems(
      groups,
      choose({ 'convert:ready|typography': DECIDE_LATER }),
    )
    expect(later.map((item) => item.binding.id)).toContain(
      'convert:ready|typography',
    )
  })

  it('keeps the reason of each instance in a row, such as a text case', () => {
    const cased: BindingRecord = {
      ...record('convert:check|typography'),
      id: conversionId('cased', 'typography'),
      nodeId: 'cased',
      reason: 'The legacy text has upper case.',
    }
    const [group] = buildMappingGroups(
      [record('convert:check|typography'), cased],
      { ownReasons: true },
    )
    const [row] = group.rows
    expect(row.bindings.map((binding) => binding.reason)).toEqual([
      undefined,
      'The legacy text has upper case.',
    ])
    // Changes keeps one reason per row, as before.
    const [plain] = buildMappingGroups([
      record('convert:check|typography'),
      cased,
    ])
    expect(plain.rows[0].bindings.every((binding) => !binding.reason)).toBe(
      true,
    )
  })

  it('says why Convert leaves an instance without a record', () => {
    expect(conversionSkipReason(undefined)).toBe(NO_LEGACY_TYPOGRAPHY)
  })
})
