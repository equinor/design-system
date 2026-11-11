/** The Mapping view: grouping, overrides and the picker options. */
import { describe, expect, it } from 'vitest'
import { pickerOptions, sharedSubject } from '../src/mapping/picker'
import {
  buildMappingGroups,
  effectiveTarget,
  NO_OVERRIDES,
  rowKey,
} from '../src/scan/mapping'
import type { BindingRecord } from '../src/scan/types'

const record = (
  id: string,
  oldKey: string,
  category: BindingRecord['category'],
  proposal?: string,
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: { type: 'paint', field: 'strokes', index: 0 },
  group: 'colour',
  kind: 'stroke',
  category,
  oldKey,
  old: oldKey,
  candidates: proposal ? [proposal] : [],
})

const records = [
  record(
    'card-1',
    'Border/Neutral/Subtle',
    'sure',
    'border/non-interactive/neutral/muted',
  ),
  record(
    'card-2',
    'Border/Neutral/Subtle',
    'sure',
    'border/non-interactive/neutral/muted',
  ),
  record(
    'button',
    'Border/Neutral/Subtle',
    'check',
    'border/interactive/neutral/muted/default',
  ),
  record('icon', 'sizing/icon/lg', 'none'),
  record('done', 'Bg/Neutral/Surface', 'migrated'),
  record('instance', 'Bg/Neutral/Surface', 'inInstance'),
]

describe('buildMappingGroups', () => {
  it('groups by legacy variable with one row per proposal, most used first', () => {
    const groups = buildMappingGroups(records)
    expect(groups.map((group) => [group.old, group.count])).toEqual([
      ['Border/Neutral/Subtle', 3],
      ['sizing/icon/lg', 1],
    ])
    expect(groups[0].rows.map((row) => [row.proposal, row.count])).toEqual([
      ['border/non-interactive/neutral/muted', 2],
      ['border/interactive/neutral/muted/default', 1],
    ])
  })

  it('leaves out migrated bindings and bindings inside instances', () => {
    const olds = buildMappingGroups(records).map((group) => group.old)
    expect(olds).not.toContain('Bg/Neutral/Surface')
  })
})

describe('effectiveTarget', () => {
  const [card, , button] = records

  it('is the proposal without overrides', () => {
    expect(effectiveTarget(card, NO_OVERRIDES)).toEqual({
      target: 'border/non-interactive/neutral/muted',
      source: 'proposal',
    })
  })

  it('takes a row override for every binding in the row', () => {
    const overrides = {
      records: {},
      rows: { [rowKey(card)]: 'border/non-interactive/neutral/default' },
    }
    expect(effectiveTarget(card, overrides)).toEqual({
      target: 'border/non-interactive/neutral/default',
      source: 'row',
    })
    expect(effectiveTarget(button, overrides).source).toBe('proposal')
  })

  it('lets an override on one binding win over its row', () => {
    const overrides = {
      records: { [card.id]: null },
      rows: { [rowKey(card)]: 'border/non-interactive/neutral/default' },
    }
    expect(effectiveTarget(card, overrides)).toEqual({
      target: null,
      source: 'record',
    })
  })
})

describe('pickerOptions', () => {
  it('offers the candidates first, then stroke colours, never the backdrop', () => {
    const options = pickerOptions({
      kinds: ['stroke'],
      group: 'colour',
      candidates: ['border/interactive/neutral/muted/default'],
    })
    expect(options.proposed).toEqual([
      'border/interactive/neutral/muted/default',
    ])
    expect(options.others).toContain('border/non-interactive/neutral/muted')
    expect(options.others).not.toContain(
      'border/interactive/neutral/muted/default',
    )
    expect(options.others).not.toContain('text/primary')
    expect(options.others).not.toContain('background/backdrop')
  })

  it('offers spacing for padding and corner radii for radius', () => {
    const spacing = pickerOptions({
      kinds: ['spacing'],
      group: 'spacing',
      candidates: [],
    })
    expect(spacing.others).toContain('spacing/md')
    expect(spacing.others).not.toContain('corner-radius/pill')
    const radius = pickerOptions({
      kinds: ['radius'],
      group: 'radius',
      candidates: [],
    })
    expect(radius.others).toEqual([
      'corner-radius/none',
      'corner-radius/pill',
      'corner-radius/rounded',
      'corner-radius/rounded-outer',
    ])
  })

  it('offers text styles for typography and the other modes for a mode', () => {
    const type = pickerOptions({
      kinds: [],
      group: 'typography',
      candidates: ['label/md/default'],
    })
    expect(type.others).toContain('body/md/default')
    expect(type.others).not.toContain('label/md/default')
    const mode = pickerOptions({
      kinds: [],
      group: 'modes',
      candidates: ['density: compact'],
    })
    expect(mode.others).toEqual(['density: comfortable', 'density: relaxed'])
  })
})

describe('sharedSubject', () => {
  it('combines colours on fills and strokes, with the most proposed target first', () => {
    const subject = sharedSubject([
      { kind: 'fill', group: 'colour', candidates: ['background/surface'] },
      { kind: 'fill', group: 'colour', candidates: ['background/surface'] },
      {
        kind: 'stroke',
        group: 'colour',
        candidates: ['border/non-interactive/neutral/muted'],
      },
    ])
    expect(subject?.candidates).toEqual([
      'background/surface',
      'border/non-interactive/neutral/muted',
    ])
    expect(subject?.kinds).toEqual(['fill', 'stroke'])
  })

  it('refuses a selection that mixes colours and numbers', () => {
    expect(
      sharedSubject([
        { kind: 'fill', group: 'colour', candidates: [] },
        { kind: 'spacing', group: 'spacing', candidates: ['spacing/md'] },
      ]),
    ).toBeUndefined()
  })
})
