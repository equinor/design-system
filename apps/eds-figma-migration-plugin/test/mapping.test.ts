/** The Mapping view: grouping, overrides and the picker options. */
import { describe, expect, it } from 'vitest'
import {
  compareNames,
  pickerOptions,
  sharedSubject,
} from '../src/mapping/picker'
import {
  bindingOutcome,
  buildMappingGroups,
  effectiveCategory,
  effectiveTarget,
  NO_OVERRIDES,
  rowKey,
  targetCounts,
} from '../src/scan/mapping'
import { recount } from '../src/scan/summary'
import { selectionStatus } from '../src/ui/selection'
import type { BindingRecord, ScanSummary } from '../src/scan/types'

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

describe('effectiveCategory', () => {
  const [, , button, icon, done] = records

  it("is the rule's category until someone decides", () => {
    expect(effectiveCategory(button, NO_OVERRIDES)).toBe('check')
    expect(effectiveCategory(icon, NO_OVERRIDES)).toBe('none')
  })

  it('makes a chosen target Ready, the proposal included', () => {
    const confirmed = {
      records: { button: 'border/interactive/neutral/muted/default' },
      rows: {},
    }
    expect(effectiveCategory(button, confirmed)).toBe('sure')
    const chosen = { records: { icon: 'icon/size/lg' }, rows: {} }
    expect(effectiveCategory(icon, chosen)).toBe('sure')
  })

  it('makes a choice to keep the legacy variable Excluded, not No equivalent', () => {
    const left = { records: {}, rows: { [rowKey(records[0])]: null } }
    expect(effectiveCategory(records[0], left)).toBe('excluded')
  })

  it('leaves migrated bindings and bindings in instances alone', () => {
    expect(effectiveCategory(done, { records: { done: null }, rows: {} })).toBe(
      'migrated',
    )
  })
})

describe('selectionStatus', () => {
  const groups = buildMappingGroups(records)

  it('counts the selected values Apply changes and the choices Reset removes', () => {
    const overrides = { records: { 'card-1': null }, rows: {} }
    expect(
      selectionStatus(
        ['card-1', 'card-2', 'button', 'icon'],
        groups,
        overrides,
      ),
    ).toEqual({ ready: 1, chosen: 1, entryIds: ['frame'] })
  })

  it('counts a Needs check value as Ready once a target is chosen for it', () => {
    const overrides = {
      records: { button: 'border/interactive/neutral/muted/default' },
      rows: {},
    }
    expect(selectionStatus(['button'], groups, overrides)).toMatchObject({
      ready: 1,
      chosen: 1,
    })
  })

  it('has nothing to reset when the values are only selected', () => {
    expect(
      selectionStatus(['card-1', 'card-2'], groups, NO_OVERRIDES),
    ).toMatchObject({ ready: 2, chosen: 0 })
  })
})

describe('targetCounts', () => {
  const [group] = buildMappingGroups(records)
  const row = group.rows[0]

  it('counts the proposal when nothing is changed', () => {
    expect(targetCounts([row], NO_OVERRIDES)).toEqual([
      {
        target: 'border/non-interactive/neutral/muted',
        noEquivalent: false,
        count: 2,
      },
    ])
  })

  it('follows changes on single bindings, so the heading shows them', () => {
    const overrides = { records: { 'card-1': null, 'card-2': null }, rows: {} }
    expect(targetCounts([row], overrides)).toEqual([
      { target: null, noEquivalent: false, count: 2 },
    ])
    expect(bindingOutcome(row, row.bindings[0], overrides)).toEqual({
      target: null,
      source: 'record',
      category: 'excluded',
    })
  })

  it('tells a missing equivalent from a choice to leave the binding', () => {
    const none = buildMappingGroups(records).find(
      (candidate) => candidate.old === 'sizing/icon/lg',
    )
    expect(targetCounts(none?.rows ?? [], NO_OVERRIDES)).toEqual([
      { target: null, noEquivalent: true, count: 1 },
    ])
  })
})

describe('recount', () => {
  it('moves a decided binding to Ready in the entry and the totals', () => {
    const summary: ScanSummary = {
      scope: 'page',
      scannedAt: '2026-11-11',
      mappingVersion: 'test',
      pages: [],
      nodesScanned: 6,
      totals: {
        migrated: 1,
        sure: 2,
        check: 1,
        none: 1,
        excluded: 0,
        inInstance: 1,
        other: 0,
      },
      health: 1 / 6,
      entries: [
        {
          id: 'frame',
          kind: 'frame',
          name: 'Frame',
          pageId: 'page',
          pageName: 'Page',
          sections: [],
          nodeIds: ['frame'],
          counts: {
            migrated: 1,
            sure: 2,
            check: 1,
            none: 1,
            excluded: 0,
            inInstance: 1,
            other: 0,
          },
          health: 1 / 6,
          oldInstances: 0,
        },
      ],
    }
    const overrides = {
      records: { button: 'border/interactive/neutral/muted/default' },
      rows: {},
    }
    const result = recount(summary, records, [], (candidate) =>
      effectiveCategory(candidate, overrides),
    )
    expect(result.totals).toEqual({
      migrated: 1,
      sure: 3,
      check: 0,
      none: 1,
      excluded: 0,
      inInstance: 1,
      other: 0,
    })
    expect(result.entries[0].counts.check).toBe(0)
  })
})

describe('compareNames', () => {
  it('orders sizes from small to large', () => {
    expect(
      [
        'spacing/2xl',
        'spacing/md',
        'spacing/none',
        'spacing/2xs',
        'spacing/xs',
        'spacing/xl',
        'spacing/sm',
        'spacing/lg',
      ].sort(compareNames),
    ).toEqual([
      'spacing/none',
      'spacing/2xs',
      'spacing/xs',
      'spacing/sm',
      'spacing/md',
      'spacing/lg',
      'spacing/xl',
      'spacing/2xl',
    ])
  })

  it('orders numbers by value, and states and weights the way they are read', () => {
    expect(['cat/10/1', 'cat/2/1', 'cat/1/1'].sort(compareNames)).toEqual([
      'cat/1/1',
      'cat/2/1',
      'cat/10/1',
    ])
    expect(['a/pressed', 'a/hover', 'a/default'].sort(compareNames)).toEqual([
      'a/default',
      'a/hover',
      'a/pressed',
    ])
    expect(
      ['body/md/bold', 'body/md/default', 'body/sm/default'].sort(compareNames),
    ).toEqual(['body/sm/default', 'body/md/default', 'body/md/bold'])
  })
})
