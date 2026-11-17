/**
 * Decide later (decided 2026-11-16): the one choice that leaves a value for
 * a later run. It replaces every way to keep a legacy variable, so a value
 * set to it is never applied and keeps counting as not migrated.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { planChanges } from '../src/scan/apply-plan'
import {
  bindingOutcome,
  buildMappingGroups,
  DECIDE_LATER,
  effectiveCategory,
  NO_OVERRIDES,
  rowChoiceChanges,
  rowCurrent,
  savedChoices,
} from '../src/scan/mapping'
import type { Overrides } from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import {
  emptyCounts,
  healthOf,
  recount,
  savedCounts,
  summariseEntries,
  totalsOf,
} from '../src/scan/summary'
import { SCORED_CATEGORIES } from '../src/scan/types'
import type { BindingRecord, OldInstance, ScanSummary } from '../src/scan/types'
import type { OverrideChange } from '../src/shared/messages'
import { groupInstances, LIBRARY_INSTANCES_NOTE } from '../src/ui/instances'
import { reviewItems, reviewSummary } from '../src/ui/review'
import { sourceLabel, targetLabel } from '../src/ui/targets'

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

const ready = record(
  'card',
  'Border/Neutral/Subtle',
  'sure',
  'border/non-interactive/neutral/muted',
)
const check = record(
  'button',
  'Border/Neutral/Subtle',
  'check',
  'border/interactive/neutral/muted/default',
)
const standIn = record(
  'palette',
  'Palette/Grey 40',
  'none',
  'border/non-interactive/neutral/default',
)
const fix = record('icon', 'Selectable/Icon size', 'byHand', 'reset:')
const all = [ready, check, standIn, fix]

const later = (ids: string[]): Overrides => ({
  records: Object.fromEntries(ids.map((id) => [id, DECIDE_LATER])),
  rows: {},
})

/** What the plugin does with the changes (code.ts, setOverrides). */
const store = (overrides: Overrides, changes: OverrideChange[]) => {
  const records = { ...overrides.records }
  const rows = { ...overrides.rows }
  for (const { target, value } of changes) {
    const map = target.type === 'record' ? records : rows
    const key = target.type === 'record' ? target.id : target.key
    if (value === undefined) delete map[key]
    else map[key] = value
  }
  return { records, rows }
}

describe('Decide later', () => {
  it('makes a Ready value Needs check, and Apply leaves it', () => {
    const overrides = later(['card'])
    expect(effectiveCategory(ready, overrides)).toBe('check')
    expect(planChanges([ready], NO_OVERRIDES, new Set(['frame']))).toHaveLength(
      1,
    )
    expect(planChanges([ready], overrides, new Set(['frame']))).toEqual([])
  })

  it('keeps Needs check, No equivalent and Manual fix as they were', () => {
    const overrides = later(['button', 'palette', 'icon'])
    expect(effectiveCategory(check, overrides)).toBe('check')
    expect(effectiveCategory(standIn, overrides)).toBe('none')
    expect(effectiveCategory(fix, overrides)).toBe('byHand')
    expect(
      planChanges([check, standIn, fix], overrides, new Set(['frame'])),
    ).toEqual([])
  })

  it('is left out of a run on the ticked values too', () => {
    const overrides = later(['card'])
    expect(
      planChanges([ready], overrides, new Set(['frame']), new Set(['card'])),
    ).toEqual([])
  })

  it('comes back in Review, a Ready value included', () => {
    const groups = buildMappingGroups(all)
    const listed = (overrides: Overrides) =>
      reviewItems(groups, overrides).map((item) => item.binding.id)
    // Without choices, Review has every value that waits for a designer.
    expect(listed(NO_OVERRIDES)).toEqual(['button', 'palette', 'icon'])
    // A chosen target takes a value out of Review; Decide later does not.
    const chosen: Overrides = {
      records: {
        button: 'border/interactive/neutral/muted/default',
        palette: DECIDE_LATER,
        icon: DECIDE_LATER,
        card: DECIDE_LATER,
      },
      rows: {},
    }
    expect(listed(chosen).sort()).toEqual(['card', 'icon', 'palette'])
  })

  it('on a row defers every value in it, replacing their own choices', () => {
    const second = { ...ready, id: 'card-2', nodeId: 'card-2' }
    const [group] = buildMappingGroups([ready, second])
    const row = group.rows[0]
    const before: Overrides = {
      records: { card: 'border/non-interactive/neutral/default' },
      rows: {},
    }
    const after = store(before, rowChoiceChanges(row, DECIDE_LATER, before))
    expect(after).toEqual({ records: {}, rows: { [row.key]: DECIDE_LATER } })
    expect(rowCurrent(row, after)).toBe(DECIDE_LATER)
    for (const binding of row.bindings) {
      expect(bindingOutcome(row, binding, after)).toEqual({
        target: DECIDE_LATER,
        source: 'row',
        category: 'check',
      })
    }
    expect(planChanges([ready, second], after, new Set(['frame']))).toEqual([])
  })

  it('counts as not migrated in the health', () => {
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
      [ready, record('done', 'Bg/Neutral/Surface', 'migrated')],
      [],
    )
    const totals = totalsOf(entries)
    const summary: ScanSummary = {
      scope: 'page',
      scannedAt: '2026-11-16',
      mappingVersion: 'test',
      pages: [],
      nodesScanned: 2,
      totals,
      health: healthOf(totals),
      entries,
    }
    const overrides = later(['card'])
    const result = recount(summary, [ready], [], (candidate) =>
      effectiveCategory(candidate, overrides),
    )
    expect(result.totals).toMatchObject({ sure: 0, check: 1 })
  })

  it('is written as Decide later, with what it means for Apply', () => {
    expect(targetLabel(DECIDE_LATER)).toBe('Decide later')
    expect(sourceLabel('record', DECIDE_LATER)).toBe(
      'Your choice for this value. Apply leaves it until you choose a target.',
    )
    expect(sourceLabel('row', 'spacing/md')).toBe(
      'Your choice for all of these',
    )
  })
})

describe('choices saved by an earlier version', () => {
  it('reads a choice to keep the legacy variable as Decide later', () => {
    expect(
      savedChoices({
        records: { card: null, button: 'spacing/md' },
        rows: { 'Border/Medium||sure': null },
      }),
    ).toEqual({
      records: { card: DECIDE_LATER, button: 'spacing/md' },
      rows: { 'Border/Medium||sure': DECIDE_LATER },
    })
  })

  it('leaves out what is not a choice, and starts empty without one', () => {
    expect(
      savedChoices({ records: { card: 4, button: 'spacing/md' }, rows: {} }),
    ).toEqual({ records: { button: 'spacing/md' }, rows: {} })
    expect(savedChoices(undefined)).toEqual({ records: {}, rows: {} })
    expect(savedChoices('choices')).toEqual({ records: {}, rows: {} })
    expect(savedChoices({ records: {} })).toEqual({ records: {}, rows: {} })
  })

  it('counts saved Excluded totals as Needs check', () => {
    const saved = { ...emptyCounts(), check: 2, excluded: 3 }
    const counts = savedCounts(saved)
    expect(counts.check).toBe(5)
    expect(counts).not.toHaveProperty('excluded')
    expect(savedCounts(undefined)).toEqual(emptyCounts())
  })
})

describe('the summary without Excluded', () => {
  it('has no Excluded category to count in', () => {
    expect(SCORED_CATEGORIES).not.toContain('excluded')
    expect(emptyCounts()).not.toHaveProperty('excluded')
    const [entry] = summariseEntries(
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
      all,
      [],
      (candidate) => effectiveCategory(candidate, later(['card'])),
    )
    expect(Object.keys(entry.counts)).not.toContain('excluded')
    expect(entry.counts).toMatchObject({ sure: 0, check: 2, none: 1 })
  })
})

describe('the report', () => {
  const overrides = later(['card'])
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
    all,
    [],
    (candidate) => effectiveCategory(candidate, overrides),
  )
  const totals = totalsOf(entries)
  const report = buildReport({
    fileName: 'Test',
    summary: {
      scope: 'page',
      scannedAt: '2026-11-16T12:00:00.000Z',
      mappingVersion: 'test',
      pages: [{ id: 'page', name: 'Page' }],
      nodesScanned: 4,
      totals,
      health: healthOf(totals),
      entries,
    },
    records: all,
    oldInstances: [],
    overrides,
  })

  it('lists the values decided later, and has no Excluded', () => {
    expect(report.markdown).toContain('## Decide later (1)')
    expect(report.markdown).not.toContain('Excluded')
    expect(report.markdown).toContain(
      'Health is migrated ÷ (migrated + ready + needs check + manual fix + no equivalent + in instance).',
    )
  })

  it('writes Decide later as the target in the CSV', () => {
    const row = report.csv.split('\n').find((line) => line.includes(',card,'))
    expect(row).toContain('Needs check')
    expect(row).toContain('Decide later')
    expect(row).toContain('Designer')
  })
})

describe('the Instances tab', () => {
  const instance = (
    id: string,
    main: string,
    remote: boolean,
  ): OldInstance => ({
    id,
    name: main,
    entryId: 'frame',
    count: 2,
    mainComponent: {
      name: main,
      key: `key-${main}`,
      remote,
      ...(remote ? {} : { id: `id-${main}` }),
    },
  })

  it('marks instances of a library component, to be swapped in Figma', () => {
    const groups = groupInstances([
      instance('1', 'Button', true),
      instance('2', 'Card', false),
    ])
    const button = groups.find((group) => group.name === 'Button')
    const card = groups.find((group) => group.name === 'Card')
    expect(button).toMatchObject({
      source: 'from a library',
      fromLibrary: true,
    })
    expect(button?.mainId).toBeUndefined()
    expect(card).toMatchObject({ source: 'in this file', mainId: 'id-Card' })
    expect(card?.fromLibrary).toBeUndefined()
    expect(LIBRARY_INSTANCES_NOTE).toBe(
      'The plugin migrates variables, not components. Swap these to EDS Beta components in Figma; their legacy values go with them.',
    )
  })
})

describe('Review keeps only Decide later (decided 2026-11-16, phase 6b)', () => {
  it('counts confirmed, changed and Decide later in its closing summary, and nothing skipped', () => {
    const summary = reviewSummary(['confirmed', 'later', 'changed', 'later'])
    expect(summary.map((line) => [line.decision, line.count])).toEqual([
      ['confirmed', 1],
      ['changed', 1],
      ['later', 2],
    ])
    expect(summary.map((line) => line.text).join(' ')).not.toMatch(/skip/i)
  })

  it('has no Skip button, and offers Decide later where Skip was', () => {
    const source = readFileSync(
      new URL('../src/ui/components/ReviewView.tsx', import.meta.url),
      'utf8',
    )
    expect(source).not.toMatch(/\bSkip\b|skipped/)
    // Decide later is a button both for a Manual fix and for other values.
    expect(source.match(/\{DECIDE_LATER_LABEL\}/g)?.length).toBe(2)
  })
})
