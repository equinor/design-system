/**
 * Legacy modes held by the values below them (decided 2026-11-16, phase 6b):
 * the rules leave a mode that is only cleared Ready, and the plugin works
 * out from the designer's choices whether the next run keeps it, as it does
 * for any mode a run keeps. Once every value below that reads the mode is
 * Ready and changes in the same run, that run clears the mode after them.
 * The health bar, Review, the preview and Apply agree on it.
 */
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import {
  isModeChange,
  keptModeChanges,
  keptModesByRecord,
  modeWaits,
  planChanges,
  previewRun,
} from '../src/scan/apply-plan'
import {
  CLEAR_MODE,
  classifyUnits,
  holdModes,
  REMOVE_ANYWAY,
} from '../src/scan/classify'
import {
  buildMappingGroups,
  DECIDE_LATER,
  effectiveCategory,
  keptModeText,
  NO_OVERRIDES,
  readyCount,
} from '../src/scan/mapping'
import type { KeptModes, Overrides } from '../src/scan/mapping'
import { summariseEntries } from '../src/scan/summary'
import type { BindingRecord, OldInstance, RawUnit } from '../src/scan/types'
import { reviewItems } from '../src/ui/review'
import { ctx } from './helpers'

const FRAME = new Set(['frame'])
const MODE_ID = `button|mode:${OLD.appearance}`

/** The 🎨 Appearance mode on a button, which only selects a tone, so it is cleared. */
const appearanceMode = (): BindingRecord => ({
  id: MODE_ID,
  nodeId: 'button',
  nodeName: 'Button',
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: {
    type: 'mode',
    collectionId: `VariableCollectionId:${OLD.appearance}/1`,
  },
  group: 'modes',
  category: 'sure',
  outcome: 'sure',
  oldKey: `mode:${OLD.appearance}:Danger`,
  old: 'Danger',
  oldCollection: '🎨 Appearance',
  candidates: [CLEAR_MODE],
  reason: '🎨 Appearance: Danger: the mode only selects a tone',
  rule: 'mode/clear',
  modeHolders: ['button'],
  oldMode: {
    collectionId: `VariableCollectionId:${OLD.appearance}/1`,
    collectionKey: OLD.appearance,
    modeId: '1:0',
    modeName: 'Danger',
  },
})

/** A value below the mode that reads it. */
const below = (
  id: string,
  category: BindingRecord['category'],
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId: 'frame',
  path: ['Button'],
  property: { type: 'paint', field: 'fills', index: 0 },
  group: 'colour',
  kind: 'fill',
  category,
  outcome: category === 'inInstance' ? undefined : (category as 'check'),
  oldKey: `${OLD.appearance}/Bg/Fill/Emphasis/Default`,
  old: 'Bg/Fill/Emphasis/Default',
  candidates:
    category === 'inInstance'
      ? undefined
      : [
          'background/interactive/danger/emphasis/default',
          'background/non-interactive/danger/emphasis',
        ],
  reason: 'Interactive element',
  rule: 'colour/fill-role',
  modeHolders: ['button'],
  reads: [OLD.appearance],
  ...options,
})

/** A Needs check fill on the button, which is all that reads the mode. */
const withCheck = () => holdModes([appearanceMode(), below('Fill', 'check')])

const CONFIRMED: Overrides = {
  records: { Fill: 'background/interactive/danger/emphasis/default' },
  rows: {},
}
const LATER: Overrides = { records: { Fill: DECIDE_LATER }, rows: {} }

const CHIP: OldInstance = {
  id: 'chip',
  name: 'Chip 1',
  entryId: 'frame',
  count: 1,
  mainComponent: { name: 'Chip', key: 'c', remote: false, id: '1:2' },
}

/** The counts the health bar shows, with the kept modes. */
function counts(
  records: BindingRecord[],
  overrides: Overrides,
  kept: KeptModes,
) {
  return summariseEntries(
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
    records,
    [],
    (record) => effectiveCategory(record, overrides, kept),
  )[0].counts
}

/** What the plugin works out with every choice: the kept modes, the counts and the preview. */
function state(
  records: BindingRecord[],
  overrides: Overrides,
  instances: OldInstance[] = [],
) {
  const kept = keptModesByRecord(records, overrides, FRAME, instances)
  return {
    kept,
    counts: counts(records, overrides, kept),
    preview: previewRun(records, overrides, FRAME, undefined, instances),
    plan: planChanges(records, overrides, FRAME),
  }
}

describe('a legacy mode held by a Needs check below it', () => {
  it('stays Ready by its rule, with clearing as the proposal', () => {
    const [mode] = withCheck()
    expect(mode).toMatchObject({
      category: 'sure',
      candidates: [CLEAR_MODE],
      rule: 'mode/clear',
    })
  })

  it('is Waiting while nobody has decided the value below, and says what it waits for', () => {
    const records = withCheck()
    const { kept, counts: counted, preview } = state(records, NO_OVERRIDES)
    expect(kept[MODE_ID]).toEqual({
      setsMode: false,
      waitsFor: 'Fill, fill is decided',
    })
    expect(keptModeText(kept[MODE_ID])).toBe(
      'Cleared once Fill, fill is decided.',
    )
    expect(effectiveCategory(records[0], NO_OVERRIDES, kept)).toBe('none')
    expect(counted).toMatchObject({ sure: 0, check: 1, none: 1 })
    expect(preview).toMatchObject({ changes: 0, modesCleared: 0 })
    expect(preview.modesKept.map((item) => item.id)).toEqual([MODE_ID])
  })

  it('becomes Ready once the value below is confirmed, and the same run clears it after that value', () => {
    const records = withCheck()
    const { kept, counts: counted, preview, plan } = state(records, CONFIRMED)
    expect(kept).toEqual({})
    expect(effectiveCategory(records[0], CONFIRMED, kept)).toBe('sure')
    expect(counted).toMatchObject({ sure: 2, check: 0, none: 0 })
    // The value first, then the mode, which is cleared, not kept.
    expect(plan.map((change) => [change.record.id, change.target])).toEqual([
      ['Fill', 'background/interactive/danger/emphasis/default'],
      [MODE_ID, CLEAR_MODE],
    ])
    expect(preview).toMatchObject({
      changes: 2,
      variables: 1,
      modesCleared: 1,
      modesKept: [],
    })
    // Apply keeps the modes keptModeChanges returns for what it changed.
    const changed = new Set(
      plan
        .filter((change) => !isModeChange(change))
        .map((change) => change.record.id),
    )
    expect(
      keptModeChanges(records, plan.filter(isModeChange), changed).size,
    ).toBe(0)
    // A value below that fails in the run keeps the mode after all.
    expect(
      keptModeChanges(records, plan.filter(isModeChange), new Set()).has(
        MODE_ID,
      ),
    ).toBe(true)
  })

  it('is Ready too when the value below gets another target', () => {
    const records = withCheck()
    const other: Overrides = {
      records: { Fill: 'background/non-interactive/danger/emphasis' },
      rows: {},
    }
    expect(state(records, other).kept).toEqual({})
  })

  it('stays Waiting when the value below is set to Decide later', () => {
    const records = withCheck()
    const { kept, counts: counted, preview } = state(records, LATER)
    expect(kept[MODE_ID]).toEqual({
      setsMode: false,
      waitsFor: 'Fill, fill is decided',
    })
    expect(counted).toMatchObject({ sure: 0, check: 1, none: 1 })
    expect(preview.changes).toBe(0)
  })

  it('stays Waiting when a value below is Inside instances, even with the Needs check confirmed', () => {
    const records = holdModes([
      appearanceMode(),
      below('Fill', 'check'),
      below('Icon', 'inInstance', { instanceId: 'chip' }),
    ])
    const { kept, counts: counted, preview } = state(records, CONFIRMED, [CHIP])
    expect(kept[MODE_ID]).toEqual({
      setsMode: false,
      waitsFor: 'the main component Chip is migrated',
    })
    expect(counted).toMatchObject({ sure: 1, none: 1, inInstance: 1 })
    expect(preview).toMatchObject({ changes: 1, modesCleared: 0 })
  })

  it('stays Waiting above a No equivalent without a choice, and is Ready once its stand-in is chosen', () => {
    const records = holdModes([
      appearanceMode(),
      below('Shadow', 'none', {
        candidates: ['overlay/scrim'],
        rule: 'colour/nearest-by-role',
      }),
    ])
    expect(state(records, NO_OVERRIDES).kept[MODE_ID]).toMatchObject({
      waitsFor: 'Shadow, fill is decided',
    })
    const chosen: Overrides = { records: { Shadow: 'overlay/scrim' }, rows: {} }
    expect(state(records, chosen).kept).toEqual({})
  })

  it('stays Waiting above a Manual fix until the fix is accepted', () => {
    const records = holdModes([
      appearanceMode(),
      below('Icon', 'byHand', {
        property: { type: 'field', field: 'width' },
        group: 'size',
        kind: 'size',
        candidates: ['reset:spacing/md'],
        instanceId: 'wrapper',
        override: true,
      }),
    ])
    expect(state(records, NO_OVERRIDES).kept[MODE_ID]).toMatchObject({
      waitsFor: 'Icon, width is fixed',
    })
    const accepted: Overrides = {
      records: { Icon: 'reset:spacing/md' },
      rows: {},
    }
    expect(state(records, accepted).kept).toEqual({})
  })

  it('is removed in the run when the designer removes it anyway, and the value below stays legacy', () => {
    const records = withCheck()
    const anyway: Overrides = {
      records: { [MODE_ID]: REMOVE_ANYWAY },
      rows: {},
    }
    const { kept, preview } = state(records, anyway)
    expect(kept).toEqual({})
    expect(preview).toMatchObject({
      changes: 1,
      modesCleared: 1,
      modesRemovedAnyway: [{ id: MODE_ID, below: 'Fill, fill' }],
    })
    // The picker offers removing it anyway while the value below waits.
    expect(modeWaits(records, NO_OVERRIDES, FRAME, []).blocked[MODE_ID]).toBe(
      'Fill, fill is decided',
    )
  })

  it('is cleared by Apply on ticked values only when the value below is ticked too', () => {
    const records = withCheck()
    const alone = previewRun(records, CONFIRMED, FRAME, new Set([MODE_ID]))
    expect(alone).toMatchObject({ changes: 0, modesCleared: 0 })
    expect(alone.modesKept[0].waitsFor).toBe(
      'Fill, fill is selected and applied',
    )
    const both = previewRun(
      records,
      CONFIRMED,
      FRAME,
      new Set([MODE_ID, 'Fill']),
    )
    expect(both).toMatchObject({ changes: 2, modesCleared: 1 })
  })
})

describe('Changes and Review agree on a held legacy mode', () => {
  it('lists the value below in Review, and the mode as Waiting, until the value is decided', () => {
    const records = withCheck()
    const groups = buildMappingGroups(records)
    const waiting = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    expect(
      reviewItems(groups, NO_OVERRIDES, FRAME, waiting).map(
        (item) => item.binding.id,
      ),
    ).toEqual(['Fill'])
    expect(readyCount(groups, NO_OVERRIDES, waiting)).toBe(0)

    const freed = keptModesByRecord(records, CONFIRMED, FRAME, [])
    expect(reviewItems(groups, CONFIRMED, FRAME, freed)).toEqual([])
    expect(readyCount(groups, CONFIRMED, freed)).toBe(2)
  })
})

describe('a held legacy mode from a scan', () => {
  // A frame with a 🎨 Appearance mode, and a fill below it whose role the
  // rules cannot tell, so it needs a check.
  const context = ctx(['Chip / Warning (dynamic)'], {
    modes: { [OLD.appearance]: 'Warning' },
  })
  const units: RawUnit[] = [
    {
      nodeId: 'chip',
      nodeName: 'Chip / Warning (dynamic)',
      nodeType: 'FRAME',
      entryId: 'frame',
      path: [],
      modeHolders: ['chip'],
      unit: 'mode',
      property: {
        type: 'mode',
        collectionId: `VariableCollectionId:${OLD.appearance}/1`,
      },
      collectionId: `VariableCollectionId:${OLD.appearance}/1`,
      collectionKey: OLD.appearance,
      collectionName: '🎨 Appearance',
      modeId: '1:1',
      modeName: 'Warning',
      context,
    },
    {
      nodeId: 'chip',
      nodeName: 'Chip / Warning (dynamic)',
      nodeType: 'FRAME',
      entryId: 'frame',
      path: [],
      modeHolders: ['chip'],
      unit: 'variable',
      kind: 'fill',
      property: { type: 'paint', field: 'fills', index: 0 },
      variable: {
        id: 'VariableID:fill',
        key: 'fill',
        name: 'Bg/Fill Muted/Default',
        type: 'COLOR',
        collectionKey: OLD.appearance,
        collectionName: '🎨 Appearance',
      },
      context,
    },
  ]

  it('is Waiting until the fill is confirmed, then cleared in the same run', () => {
    const records = classifyUnits(units)
    const mode = records.find((record) => record.property.type === 'mode')
    const fill = records.find((record) => record.property.type === 'paint')
    if (!mode || !fill) throw new Error('The scan has no mode or no fill')
    expect(fill.category).toBe('check')
    expect(mode).toMatchObject({ category: 'sure', rule: 'mode/clear' })
    const waiting = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    expect(effectiveCategory(mode, NO_OVERRIDES, waiting)).toBe('none')
    const confirmed: Overrides = {
      records: { [fill.id]: fill.candidates?.[0] ?? '' },
      rows: {},
    }
    const kept = keptModesByRecord(records, confirmed, FRAME, [])
    expect(effectiveCategory(mode, confirmed, kept)).toBe('sure')
    expect(previewRun(records, confirmed, FRAME)).toMatchObject({
      changes: 2,
      modesCleared: 1,
    })
  })
})
