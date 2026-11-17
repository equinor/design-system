/**
 * A target chosen on a row replaces the choices made on single values in
 * it, such as Review decisions and Decide later. The plugin puts those
 * choices aside under the row's key, and Undo my change on the row brings
 * them back, except on a value that has a choice of its own again.
 */
import { describe, expect, it } from 'vitest'
import {
  bindingOutcome,
  buildMappingGroups,
  choicesToBringBack,
  choicesToBringBackAfter,
  DECIDE_LATER,
  NO_OVERRIDES,
  rowChoiceTarget,
  savedChoices,
  withChanges,
  withRowChoice,
} from '../src/scan/mapping'
import type { Overrides } from '../src/scan/mapping'
import type { BindingRecord } from '../src/scan/types'
import { rowChoicesNote } from '../src/ui/targets'

const record = (
  id: string,
  category: BindingRecord['category'],
  proposal: string,
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
  oldKey: 'Border/Neutral/Subtle',
  old: 'Border/Neutral/Subtle',
  candidates: [proposal],
})

const PROPOSAL = 'border/non-interactive/neutral/muted'
const STRONG = 'border/non-interactive/neutral/strong'
const DEFAULT = 'border/non-interactive/neutral/default'
const ACCENT = 'border/non-interactive/accent/default'

const [group] = buildMappingGroups([
  record('card', 'sure', PROPOSAL),
  record('chip', 'sure', PROPOSAL),
  record('tag', 'sure', PROPOSAL),
])
const row = group.rows[0]
const target = rowChoiceTarget(row)

/** A Review decision on the card and Decide later on the chip, the tag without a choice. */
const chosen: Overrides = {
  records: { card: DEFAULT, chip: DECIDE_LATER },
  rows: {},
}

describe('a target chosen on a row', () => {
  it('sends the row with every value in it', () => {
    expect(target).toEqual({
      key: row.key,
      bindingIds: ['card', 'chip', 'tag'],
      proposal: PROPOSAL,
      outcome: 'sure',
    })
  })

  it('puts the choices on its values aside and removes them', () => {
    const after = withRowChoice(chosen, target, STRONG)
    expect(after).toEqual({
      records: {},
      rows: { [row.key]: STRONG },
      replaced: { [row.key]: { card: DEFAULT, chip: DECIDE_LATER } },
    })
    for (const binding of row.bindings) {
      expect(bindingOutcome(row, binding, after)).toEqual({
        target: STRONG,
        source: 'row',
        category: 'sure',
      })
    }
  })

  it('puts nothing aside when no value in the row has a choice', () => {
    expect(withRowChoice(NO_OVERRIDES, target, STRONG)).toEqual({
      records: {},
      rows: { [row.key]: STRONG },
    })
  })

  it('leaves choices on values outside the row as they are', () => {
    const outside: Overrides = {
      ...chosen,
      records: { ...chosen.records, other: ACCENT },
    }
    const after = withRowChoice(outside, target, STRONG)
    expect(after.records).toEqual({ other: ACCENT })
    expect(after.replaced?.[row.key]).toEqual({
      card: DEFAULT,
      chip: DECIDE_LATER,
    })
  })

  it('keeps the first choices put aside through a second change on the row', () => {
    const first = withRowChoice(chosen, target, STRONG)
    // A choice on the card after the change on the row, and one on the tag,
    // which had none before.
    const since = withChanges(first, [
      { target: { type: 'record', id: 'card' }, value: ACCENT },
      { target: { type: 'record', id: 'tag' }, value: ACCENT },
    ])
    const second = withRowChoice(since, target, DECIDE_LATER)
    expect(second).toEqual({
      records: {},
      rows: { [row.key]: DECIDE_LATER },
      replaced: {
        [row.key]: { card: DEFAULT, chip: DECIDE_LATER, tag: ACCENT },
      },
    })
    // Undo brings back the choices from before the first change.
    expect(withRowChoice(second, target, undefined)).toEqual({
      records: { card: DEFAULT, chip: DECIDE_LATER, tag: ACCENT },
      rows: {},
    })
  })
})

describe('Undo my change on a row', () => {
  it('removes the row choice, brings back the choices it replaced and forgets them', () => {
    const after = withRowChoice(chosen, target, STRONG)
    const undone = withRowChoice(after, target, undefined)
    expect(undone).toEqual(chosen)
    expect(undone).not.toHaveProperty('replaced')
    expect(bindingOutcome(row, row.bindings[1], undone)).toEqual({
      target: DECIDE_LATER,
      source: 'record',
      category: 'check',
    })
  })

  it('keeps a choice made on one value since, and brings back the others', () => {
    const after = withRowChoice(chosen, target, STRONG)
    const since = withChanges(after, [
      { target: { type: 'record', id: 'card' }, value: ACCENT },
    ])
    // A choice on one value leaves the choices put aside as they are.
    expect(since.replaced).toEqual(after.replaced)
    expect(withRowChoice(since, target, undefined)).toEqual({
      records: { card: ACCENT, chip: DECIDE_LATER },
      rows: {},
    })
  })

  it('brings back a choice the value has lost since', () => {
    const after = withRowChoice(chosen, target, STRONG)
    // The card got a choice of its own after the change on the row, which
    // was then reset again.
    const reset = withChanges(
      withChanges(after, [
        { target: { type: 'record', id: 'card' }, value: ACCENT },
      ]),
      [{ target: { type: 'record', id: 'card' } }],
    )
    expect(withRowChoice(reset, target, undefined)).toEqual(chosen)
  })

  it('leaves what other rows put aside', () => {
    const other = 'Other/Row||sure'
    const overrides: Overrides = {
      records: {},
      rows: { [row.key]: STRONG, [other]: ACCENT },
      replaced: {
        [row.key]: { card: DEFAULT },
        [other]: { button: DECIDE_LATER },
      },
    }
    expect(withRowChoice(overrides, target, undefined)).toEqual({
      records: { card: DEFAULT },
      rows: { [other]: ACCENT },
      replaced: { [other]: { button: DECIDE_LATER } },
    })
  })
})

describe('the proposal chosen again on a Ready row', () => {
  it('stores no row choice, and still puts the choices aside', () => {
    const after = withRowChoice(chosen, target, PROPOSAL)
    expect(after).toEqual({
      records: {},
      rows: {},
      replaced: { [row.key]: { card: DEFAULT, chip: DECIDE_LATER } },
    })
    expect(bindingOutcome(row, row.bindings[0], after)).toEqual({
      target: PROPOSAL,
      source: 'proposal',
      category: 'sure',
    })
    // Undo is offered, since there is something to bring back.
    expect(choicesToBringBack(after, row.key)).toBe(2)
    expect(withRowChoice(after, target, undefined)).toEqual(chosen)
  })

  it('removes an earlier row choice and keeps what it put aside', () => {
    const first = withRowChoice(chosen, target, STRONG)
    const back = withRowChoice(first, target, PROPOSAL)
    expect(back).toEqual({
      records: {},
      rows: {},
      replaced: first.replaced,
    })
    expect(withRowChoice(back, target, undefined)).toEqual(chosen)
  })

  it('puts nothing aside on a row without choices', () => {
    expect(withRowChoice(NO_OVERRIDES, target, PROPOSAL)).toEqual(NO_OVERRIDES)
  })
})

describe('what the row picker says about the choices it replaces', () => {
  it('counts what Undo my change brings back, now and after a change', () => {
    expect(choicesToBringBack(chosen, row.key)).toBe(0)
    expect(choicesToBringBackAfter(chosen, target)).toBe(2)
    const after = withRowChoice(chosen, target, STRONG)
    expect(choicesToBringBack(after, row.key)).toBe(2)
    const since = withChanges(after, [
      { target: { type: 'record', id: 'card' }, value: ACCENT },
      { target: { type: 'record', id: 'tag' }, value: ACCENT },
    ])
    // The card has a choice again, which Undo keeps; a second change on the
    // row puts the tag's aside as well, and the card keeps its first.
    expect(choicesToBringBack(since, row.key)).toBe(1)
    expect(choicesToBringBackAfter(since, target)).toBe(3)
  })

  it('says that Save replaces the choices and Undo my change brings them back', () => {
    expect(rowChoicesNote(3, 0, 0, 0)).toBe('')
    expect(rowChoicesNote(3, 2, 0, 2)).toBe(
      '2 of them have a choice of their own, which this replaces. Undo my change brings back the 2 choices it replaced.',
    )
    expect(rowChoicesNote(1, 1, 0, 1)).toBe(
      'The value has a choice of its own, which this replaces. Undo my change brings back the choice it replaced.',
    )
    expect(rowChoicesNote(3, 3, 0, 3)).toBe(
      'Each of them has a choice of its own, which this replaces. Undo my change brings back the 3 choices it replaced.',
    )
    expect(rowChoicesNote(3, 0, 2, 0)).toBe(
      'Undo my change brings back the 2 choices it replaced.',
    )
    expect(rowChoicesNote(3, 1, 1, 3)).toBe(
      '1 of them has a choice of its own, which this replaces. Undo my change keeps it and brings back the choice it replaced.',
    )
  })
})

describe('choices put aside, saved in the file', () => {
  it('are saved and loaded with the other choices', () => {
    const after = withRowChoice(chosen, target, STRONG)
    expect(savedChoices(JSON.parse(JSON.stringify(after)))).toEqual(after)
  })

  it('load choices saved before there were any unchanged', () => {
    const earlier = { records: { card: DEFAULT }, rows: { [row.key]: STRONG } }
    const loaded = savedChoices(earlier)
    expect(loaded).toEqual(earlier)
    expect(loaded).not.toHaveProperty('replaced')
  })

  it('leave out what is not a choice put aside', () => {
    expect(
      savedChoices({
        records: {},
        rows: {},
        replaced: {
          [row.key]: { card: DEFAULT, chip: null, tag: 4 },
          empty: {},
          list: ['spacing/md'],
          text: 'spacing/md',
        },
      }),
    ).toEqual({
      records: {},
      rows: {},
      replaced: { [row.key]: { card: DEFAULT, chip: DECIDE_LATER } },
    })
    for (const replaced of ['choices', ['a'], null, 4]) {
      expect(savedChoices({ records: {}, rows: {}, replaced })).toEqual({
        records: {},
        rows: {},
      })
    }
  })
})
