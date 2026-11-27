/**
 * The Main components tab: What Apply changes lists the rows of Changes
 * narrowed to the main components in the scope, and the footer counts the
 * Ready values in that list, which is what the tab's Apply changes.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import { keptModesByRecord, previewRun } from '../src/scan/apply-plan'
import { CLEAR_MODE, classifyUnits, holdModes } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import {
  bindingOutcome,
  buildMappingGroups,
  DECIDE_LATER,
  effectiveCategory,
  filterGroups,
  NO_OVERRIDES,
  readyCount,
  rowKey,
  wholeRow,
} from '../src/scan/mapping'
import type { MappingGroup, MappingRow, Overrides } from '../src/scan/mapping'
import { summariseEntries } from '../src/scan/summary'
import type { EntryMeta } from '../src/scan/summary'
import type { BindingRecord } from '../src/scan/types'
import { reviewItems } from '../src/ui/review'

const PADDING = `${OLD.spacingSemantic}/Container/Space horizontal`
const FILL = `${OLD.staticSemantic}/Bg/Neutral/Surface`

const binding = (
  id: string,
  entryId: string,
  category: BindingRecord['category'],
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId,
  path: [],
  property: { type: 'field', field: 'paddingLeft' },
  group: 'spacing',
  kind: 'spacing',
  category,
  oldKey: PADDING,
  old: 'Container/Space horizontal',
  candidates: ['spacing/md'],
  reason: `${id}: the reason`,
  rule: 'spacing/container',
  ...options,
})

const fill = (
  id: string,
  entryId: string,
  options: Partial<BindingRecord> = {},
): BindingRecord =>
  binding(id, entryId, 'sure', {
    property: { type: 'paint', field: 'fills', index: 0 },
    group: 'colour',
    kind: 'fill',
    oldKey: FILL,
    old: 'Bg/Neutral/Surface',
    candidates: ['background/canvas'],
    rule: 'colour/surface',
    ...options,
  })

/** A legacy spacing mode on a layer, that is only cleared. */
const clearMode = (nodeId: string, entryId: string): BindingRecord => ({
  id: `${nodeId}|mode:${OLD.spacingSemantic}`,
  nodeId,
  nodeName: nodeId,
  nodeType: 'FRAME',
  entryId,
  path: [],
  property: {
    type: 'mode',
    collectionId: `VariableCollectionId:${OLD.spacingSemantic}/1`,
  },
  group: 'modes',
  category: 'sure',
  oldKey: `mode:${OLD.spacingSemantic}:x`,
  old: 'x',
  candidates: [CLEAR_MODE],
  modeHolders: [nodeId],
  oldMode: {
    collectionId: `VariableCollectionId:${OLD.spacingSemantic}/1`,
    collectionKey: OLD.spacingSemantic,
    modeId: '1:0',
    modeName: 'x',
  },
})

const meta = (id: string, kind: EntryMeta['kind']): EntryMeta => ({
  id,
  kind,
  name: id,
  pageId: 'page',
  pageName: 'Page',
  sections: [],
  nodeIds: [id],
})

/** The Ready values of the entries, as the health bar and the entry counts have them with the choices. */
function readyInCounts(
  records: BindingRecord[],
  entries: EntryMeta[],
  overrides: Overrides,
  componentIds: ReadonlySet<string>,
): number {
  // The plugin works the kept modes out for a run of the whole scope
  // (plugin/code.ts, withChoices), and sends the window the same ones.
  const kept = keptModesByRecord(
    records,
    overrides,
    new Set(entries.map((entry) => entry.id)),
    [],
  )
  return summariseEntries(entries, records, [], (record) =>
    effectiveCategory(record, overrides, kept),
  )
    .filter((entry) => componentIds.has(entry.id))
    .reduce((sum, entry) => sum + entry.counts.sure, 0)
}

describe('filterGroups', () => {
  // A frame and a main component share the padding row; the padding that
  // needs a check and the surface fill are each in one of them only.
  const records = [
    binding('frame-pad', 'frame', 'sure'),
    binding('button-pad', 'button', 'sure'),
    binding('button-icon-pad', 'button', 'sure'),
    binding('frame-gap', 'frame', 'check', {
      candidates: ['spacing/lg', 'spacing/md'],
    }),
    fill('button-fill', 'button'),
    fill('frame-fill', 'frame', { oldKey: `${FILL}-2`, old: 'Bg/Other' }),
  ]
  const groups = buildMappingGroups(records)
  const BUTTON = new Set(['button'])

  it('keeps the values of the entries, with the rows as Changes has them', () => {
    const filtered = filterGroups(groups, BUTTON)
    expect(
      filtered.map((group) => ({
        oldKey: group.oldKey,
        count: group.count,
        rows: group.rows.map((row) => ({
          key: row.key,
          count: row.count,
          bindings: row.bindings.map((item) => item.id),
        })),
      })),
    ).toEqual([
      {
        oldKey: PADDING,
        count: 2,
        rows: [
          {
            key: rowKey(records[1]),
            count: 2,
            bindings: ['button-pad', 'button-icon-pad'],
          },
        ],
      },
      {
        oldKey: FILL,
        count: 1,
        rows: [
          { key: rowKey(records[4]), count: 1, bindings: ['button-fill'] },
        ],
      },
    ])
  })

  it('keeps the key, outcome, proposal, candidates, reason, rule and kind of every row', () => {
    const filtered = filterGroups(groups, BUTTON)
    for (const group of filtered) {
      const original = groups.find((item) => item.oldKey === group.oldKey)
      for (const row of group.rows) {
        const { bindings, count, ...rest } =
          original?.rows.find((item) => item.key === row.key) ??
          ({} as MappingRow)
        expect(row).toMatchObject(rest)
        expect(count).toBeGreaterThanOrEqual(row.count)
        expect(bindings.length).toBe(count)
      }
    }
    const [padding] = filtered
    expect(padding.rows[0]).toMatchObject({
      outcome: 'sure',
      proposal: 'spacing/md',
      candidates: ['spacing/md'],
      reason: 'frame-pad: the reason',
      rule: 'spacing/container',
      kind: 'spacing',
    })
  })

  it('drops the rows and the groups with no value in the entries', () => {
    const filtered = filterGroups(groups, BUTTON)
    const keys = filtered.flatMap((group) => group.rows.map((row) => row.key))
    expect(keys).not.toContain(rowKey(records[3]))
    expect(filtered.map((group) => group.oldKey)).not.toContain(`${FILL}-2`)
    expect(filterGroups(groups, new Set(['nowhere']))).toEqual([])
  })

  it('returns the rows unchanged for every entry in them', () => {
    expect(filterGroups(groups, new Set(['frame', 'button']))).toEqual(groups)
  })

  it('applies a choice stored by row key to the narrowed row', () => {
    const [padding] = filterGroups(groups, BUTTON)
    const row = padding.rows[0]
    const overrides: Overrides = {
      records: {},
      rows: { [row.key]: 'spacing/lg' },
    }
    for (const item of row.bindings) {
      expect(bindingOutcome(row, item, overrides)).toMatchObject({
        target: 'spacing/lg',
        source: 'row',
        category: 'sure',
      })
    }
  })
})

describe('wholeRow', () => {
  const records = [
    binding('frame-pad', 'frame', 'sure'),
    binding('button-pad', 'button', 'sure'),
  ]
  const groups = buildMappingGroups(records)

  it('finds the row of Changes with every value in it, for a narrowed row', () => {
    const [narrowed] = filterGroups(groups, new Set(['button']))
    const row = wholeRow(groups, narrowed.rows[0])
    expect(row).toBe(groups[0].rows[0])
    expect(row.count).toBe(2)
    expect(narrowed.rows[0].count).toBe(1)
  })

  it('returns a row that is not in the groups as it is, such as a Typography conversion', () => {
    const conversion: MappingRow = {
      ...groups[0].rows[0],
      bindings: [{ ...groups[0].rows[0].bindings[0], id: 'convert:x' }],
      count: 1,
    }
    expect(wholeRow(groups, conversion)).toBe(conversion)
  })
})

describe('the Ready count on the Main components tab', () => {
  const entries = [meta('frame', 'frame'), meta('button', 'component')]
  const BUTTON = new Set(['button'])

  it('counts the Ready values the list shows, the same as the entry counts and the run', () => {
    const records = [
      binding('frame-pad', 'frame', 'sure'),
      binding('button-pad', 'button', 'sure'),
      binding('button-gap', 'button', 'check'),
      fill('button-fill', 'button'),
    ]
    const groups = filterGroups(buildMappingGroups(records), BUTTON)
    const cases: Overrides[] = [
      NO_OVERRIDES,
      // A Ready value set to Decide later is Needs check.
      { records: { 'button-pad': DECIDE_LATER }, rows: {} },
      // A choice on the Needs check makes it Ready.
      { records: { 'button-gap': 'spacing/lg' }, rows: {} },
      // A choice on the whole row, made in Changes.
      { records: {}, rows: { [rowKey(records[0])]: DECIDE_LATER } },
    ]
    expect(cases.map((overrides) => readyCount(groups, overrides, {}))).toEqual(
      [2, 1, 3, 1],
    )
    for (const overrides of cases) {
      expect(readyCount(groups, overrides, {})).toBe(
        readyInCounts(records, entries, overrides, BUTTON),
      )
      expect(readyCount(groups, overrides, {})).toBe(
        previewRun(records, overrides, BUTTON).changes,
      )
    }
  })

  it('leaves out a legacy mode the run keeps, as Waiting', () => {
    // A legacy mode in the main component that is only cleared, above a
    // padding that reads it.
    const records = holdModes([
      clearMode('button', 'button'),
      binding('button-pad', 'button', 'sure', {
        modeHolders: ['button'],
        reads: [OLD.spacingSemantic],
      }),
      binding('frame-pad', 'frame', 'sure'),
    ])
    const groups = filterGroups(buildMappingGroups(records), BUTTON)
    const later: Overrides = {
      records: { 'button-pad': DECIDE_LATER },
      rows: {},
    }
    const all = new Set(['frame', 'button'])
    const kept = keptModesByRecord(records, later, all, [])
    expect(Object.keys(kept)).toEqual([records[0].id])
    // Without the kept modes the mode would be counted as Ready.
    expect(readyCount(groups, later)).toBe(1)
    expect(readyCount(groups, later, kept)).toBe(0)
    expect(readyInCounts(records, entries, later, BUTTON)).toBe(0)
    expect(previewRun(records, later, BUTTON).changes).toBe(0)
    // With nothing set to Decide later, the mode is cleared in the same run.
    const none = keptModesByRecord(records, NO_OVERRIDES, all, [])
    expect(readyCount(groups, NO_OVERRIDES, none)).toBe(2)
    expect(readyInCounts(records, entries, NO_OVERRIDES, BUTTON)).toBe(2)
    expect(previewRun(records, NO_OVERRIDES, BUTTON).changes).toBe(2)
  })

  describe('on the test frame, with Card row as a main component', () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL('./fixtures/test-frame.json', import.meta.url),
        'utf8',
      ),
    ) as PackedFixture
    const scanned = classifyUnits(unpackFixture(fixture))
    const root = scanned[0].entryId
    // Card row and everything in it, as if it were a main component nested
    // in the frame: the scan makes such a component an entry of its own.
    const inCardRow = (record: BindingRecord) =>
      record.path[1] === 'Card row' ||
      (record.path.length === 1 && record.nodeName === 'Card row')
    const records = scanned.map((record) =>
      inCardRow(record) ? { ...record, entryId: 'card-row' } : record,
    )
    const fixtureEntries = [meta(root, 'frame'), meta('card-row', 'component')]
    const CARD_ROW = new Set(['card-row'])
    const all = new Set([root, 'card-row'])
    const groups = buildMappingGroups(records)
    const listed = filterGroups(groups, CARD_ROW)
    const readyBindings = records.filter(
      (record) =>
        record.entryId === 'card-row' &&
        record.category === 'sure' &&
        record.property.type !== 'mode',
    )
    const firstCheck = records.find(
      (record) =>
        record.entryId === 'card-row' &&
        record.category === 'check' &&
        (record.candidates?.length ?? 0) > 0,
    )
    const cases: [string, Overrides][] = [
      ['without choices', NO_OVERRIDES],
      [
        'with every other Ready value set to Decide later',
        {
          records: Object.fromEntries(
            readyBindings
              .filter((_, index) => index % 2 === 0)
              .map((record) => [record.id, DECIDE_LATER]),
          ),
          rows: {},
        },
      ],
      [
        'with the proposal chosen on a Needs check row',
        firstCheck
          ? {
              records: {},
              rows: { [rowKey(firstCheck)]: firstCheck.candidates?.[0] ?? '' },
            }
          : NO_OVERRIDES,
      ],
    ]

    it('has values in Card row in more than one status', () => {
      expect(listed.length).toBeGreaterThan(0)
      expect(firstCheck).toBeDefined()
      expect(readyCount(listed, NO_OVERRIDES)).toBeGreaterThan(0)
    })

    it.each(cases)(
      'counts as many Ready values in the list as the entry counts and the run, %s',
      (_, overrides) => {
        const kept = keptModesByRecord(records, overrides, all, [])
        const count = readyCount(listed, overrides, kept)
        expect(count).toBe(
          readyInCounts(records, fixtureEntries, overrides, CARD_ROW),
        )
        expect(count).toBe(previewRun(records, overrides, CARD_ROW).changes)
      },
    )

    it('reviews the same values from the list as from the entries', () => {
      const [, [, overrides]] = cases
      const kept = keptModesByRecord(records, overrides, all, [])
      const ids = (items: { binding: { id: string } }[]) =>
        items.map((item) => item.binding.id)
      expect(ids(reviewItems(listed, overrides, undefined, kept))).toEqual(
        ids(reviewItems(groups, overrides, CARD_ROW, kept)),
      )
    })

    it('keeps the order of Changes', () => {
      const order = (list: MappingGroup[]) =>
        list.flatMap((group) => group.rows.map((row) => row.key))
      const inList = new Set(order(listed))
      expect(order(listed)).toEqual(
        order(groups).filter((key) => inList.has(key)),
      )
    })
  })
})
