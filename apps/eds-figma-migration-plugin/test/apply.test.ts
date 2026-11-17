/** Apply: what a run changes, in what order, and which legacy modes stay. */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import {
  changeOutcome,
  isModeChange,
  keptModeChanges,
  keptModes,
  keptModesByRecord,
  modesToKeep,
  modeWaits,
  parseModeTarget,
  planChanges,
  previewRun,
  waitsFor,
} from '../src/scan/apply-plan'
import {
  CLEAR_MODE,
  classifyUnits,
  holdModes,
  REMOVE_ANYWAY,
} from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { pickerOptions } from '../src/mapping/picker'
import {
  bindingOutcome,
  buildMappingGroups,
  DECIDE_LATER,
  effectiveCategory,
  keptModeText,
  NO_OVERRIDES,
  rowChoiceTarget,
  withRowChoice,
} from '../src/scan/mapping'
import type { KeptModes, Overrides } from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import { recount, summariseEntries } from '../src/scan/summary'
import type { BindingRecord, OldInstance, ScanSummary } from '../src/scan/types'
import { removedLine } from '../src/ui/preview'
import { reviewItems } from '../src/ui/review'
import {
  modePickerExtra,
  modePickerNote,
  REMOVE_ANYWAY_LABEL,
  REMOVE_ANYWAY_OPTION,
  targetLabel,
} from '../src/ui/targets'

const binding = (
  id: string,
  category: BindingRecord['category'],
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: { type: 'field', field: 'paddingLeft' },
  group: 'spacing',
  kind: 'spacing',
  category,
  oldKey: `${OLD.spacingSemantic}/Container/Space horizontal`,
  old: 'Container/Space horizontal',
  candidates: category === 'none' ? [] : ['spacing/md'],
  ...options,
})

const mode = (
  nodeId: string,
  collectionKey: string,
  target: string,
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id: `${nodeId}|mode:${collectionKey}`,
  nodeId,
  nodeName: nodeId,
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: {
    type: 'mode',
    collectionId: `VariableCollectionId:${collectionKey}/1`,
  },
  group: 'modes',
  category: 'sure',
  oldKey: `mode:${collectionKey}:x`,
  old: 'x',
  candidates: [target],
  modeHolders: [nodeId],
  oldMode: {
    collectionId: `VariableCollectionId:${collectionKey}/1`,
    collectionKey,
    modeId: '1:0',
    modeName: 'x',
  },
  ...options,
})

describe('planChanges', () => {
  const records = [
    mode('root', OLD.density, 'density: comfortable'),
    binding('ready', 'sure', { modeHolders: ['root'] }),
    binding('check', 'check', { modeHolders: ['root'] }),
    binding('none', 'none', { modeHolders: ['root'] }),
    binding('elsewhere', 'sure', { entryId: 'other' }),
  ]

  it('applies Ready bindings in the entries, modes last', () => {
    const plan = planChanges(records, NO_OVERRIDES, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).toEqual([
      'ready',
      `root|mode:${OLD.density}`,
    ])
  })

  it('applies a Needs check binding once a designer has confirmed it', () => {
    const overrides = { records: { check: 'spacing/md' }, rows: {} }
    const plan = planChanges(records, overrides, new Set(['frame']))
    const confirmed = plan.find((change) => change.record.id === 'check')
    expect(confirmed?.outcome).toBe('confirmed')
  })

  it('leaves out a binding the designer set to Decide later', () => {
    const overrides = { records: { ready: DECIDE_LATER }, rows: {} }
    const plan = planChanges(records, overrides, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).not.toContain('ready')
  })

  it('applies only the Ready bindings among the selected ones', () => {
    const plan = planChanges(
      records,
      NO_OVERRIDES,
      new Set(['frame', 'other']),
      new Set(['ready', 'check', 'elsewhere']),
    )
    // Needs check stays out, and so does the mode, which was not selected
    expect(plan.map((change) => change.record.id)).toEqual([
      'ready',
      'elsewhere',
    ])
  })

  it('calls a different target an override', () => {
    expect(changeOutcome(records[1], 'spacing/lg')).toBe('override')
    expect(changeOutcome(records[1], 'spacing/md')).toBe('sure')
  })
})

describe('modesToKeep', () => {
  it('keeps a legacy mode above a binding the run did not change', () => {
    const records = [
      mode('root', OLD.density, 'density: comfortable'),
      binding('a', 'sure', { modeHolders: ['root'] }),
      binding('b', 'check', { modeHolders: ['root'] }),
    ]
    expect(modesToKeep(records, new Set(['a']))).toEqual(
      new Set([`root|${OLD.density}`]),
    )
    expect(modesToKeep(records, new Set(['a', 'b'])).size).toBe(0)
  })

  it("keeps only the nearest mode of the binding's own library", () => {
    const colour = binding('fill', 'none', {
      property: { type: 'paint', field: 'fills', index: 0 },
      group: 'colour',
      kind: 'fill',
      oldKey: `${OLD.staticConcept}/Bg/Backdrop`,
      modeHolders: ['root', 'overlay'],
    })
    const records = [
      mode('root', OLD.colorScheme, 'color-scheme: light'),
      mode('root', OLD.density, 'density: comfortable'),
      mode('overlay', OLD.colorScheme, 'color-scheme: dark', {
        modeHolders: ['root', 'overlay'],
      }),
      colour,
    ]
    expect(modesToKeep(records, new Set())).toEqual(
      new Set([`overlay|${OLD.colorScheme}`]),
    )
  })
})

describe('holdModes', () => {
  const FRAME = new Set(['frame'])
  const instance: OldInstance = {
    id: 'instance',
    name: 'Chip 1',
    entryId: 'frame',
    count: 1,
    mainComponent: { name: 'Chip', key: 'c', remote: false, id: '1:2' },
  }

  it('leaves a mode that is only cleared Ready, and the run keeps it as Waiting while an instance below uses legacy variables', () => {
    const records = holdModes([
      mode('chip', OLD.borderRadius, CLEAR_MODE),
      binding('inside', 'inInstance', {
        oldKey: `${OLD.borderRadius}/Radius`,
        modeHolders: ['chip'],
        instanceId: 'instance',
      }),
    ])
    const [held] = records
    expect(held).toMatchObject({ category: 'sure', candidates: [CLEAR_MODE] })
    const kept = keptModesByRecord(records, NO_OVERRIDES, FRAME, [instance])
    expect(kept[held.id]).toEqual({
      setsMode: false,
      waitsFor: 'the main component Chip is migrated',
    })
    expect(effectiveCategory(held, NO_OVERRIDES, kept)).toBe('none')
  })

  it('still sets a new density mode, and the kept modes say the legacy one stays', () => {
    const records = holdModes([
      mode('root', OLD.density, 'density: comfortable', {
        reason: 'Spacious is comfortable',
      }),
      binding('icon', 'none', { nodeName: 'Icon', modeHolders: ['root'] }),
    ])
    const [held] = records
    expect(held).toMatchObject({
      category: 'sure',
      reason: 'Spacious is comfortable',
    })
    const kept = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    expect(keptModeText(kept[held.id])).toBe(
      'The legacy mode stays beside it until Icon, padding left no longer uses a legacy variable.',
    )
    expect(effectiveCategory(held, NO_OVERRIDES, kept)).toBe('sure')
  })

  it('only clears a legacy mode whose EDS Beta mode is already set on the layer', () => {
    const records = holdModes([
      mode('root', OLD.density, 'density: comfortable', {
        reason: 'Spacious is comfortable',
      }),
      {
        ...mode('root', 'new-density', CLEAR_MODE),
        id: 'root|mode:new-density',
        category: 'migrated',
        current: 'density: comfortable',
        oldMode: undefined,
      },
      binding('label', 'check', { nodeName: 'Label', modeHolders: ['root'] }),
    ])
    const [legacy] = records
    expect(legacy.candidates).toEqual([CLEAR_MODE])
    expect(legacy.reason).toContain(
      'The layer already has a mode of the EDS Beta density collection, so only the legacy mode is left to clear',
    )
    // Nothing to set, so the run that keeps it changes nothing there.
    const kept = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    expect(kept[legacy.id]).toMatchObject({ setsMode: false })
    expect(effectiveCategory(legacy, NO_OVERRIDES, kept)).toBe('none')
  })
})

describe('instance overrides', () => {
  it('plans an override inside an instance, and leaves what the instance inherits', () => {
    const records = [
      binding('override', 'sure', { instanceId: 'instance', override: true }),
      binding('inherited', 'inInstance', { instanceId: 'instance' }),
    ]
    const plan = planChanges(
      records,
      { records: {}, rows: {} },
      new Set(['frame']),
    )
    expect(plan.map((change) => change.record.id)).toEqual(['override'])
  })
})

describe('legacy modes an instance overrides', () => {
  const overridden = mode('icon-item', OLD.appearance, CLEAR_MODE, {
    instanceId: 'adornment',
    override: true,
  })

  it('clears the mode when nothing below it uses legacy variables', () => {
    const records = holdModes([
      overridden,
      binding('icon', 'migrated', {
        modeHolders: ['icon-item'],
        instanceId: 'adornment',
      }),
    ])
    expect(records[0].category).toBe('sure')
    const plan = planChanges(records, NO_OVERRIDES, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).toEqual([overridden.id])
  })

  it('waits in Inside instances while values from the main component read it', () => {
    const [held] = holdModes([
      overridden,
      binding('icon', 'inInstance', {
        oldKey: `${OLD.appearance}/Icon/Default`,
        modeHolders: ['icon-item'],
        instanceId: 'adornment',
        reads: [OLD.appearance],
      }),
    ])
    expect(held).toMatchObject({
      category: 'inInstance',
      rule: 'mode/from-main',
      override: true,
    })
    expect(held.candidates).toBeUndefined()
    expect(planChanges([held], NO_OVERRIDES, new Set(['frame']))).toEqual([])
  })

  it('waits as a mode the run keeps while values the instance overrides read it', () => {
    const records = holdModes([
      overridden,
      binding('icon', 'none', {
        nodeName: 'Icon',
        oldKey: `${OLD.appearance}/Icon/Default`,
        modeHolders: ['icon-item'],
        instanceId: 'adornment',
        override: true,
        reads: [OLD.appearance],
      }),
    ])
    const [held] = records
    expect(held).toMatchObject({ category: 'sure', candidates: [CLEAR_MODE] })
    const kept = keptModesByRecord(
      records,
      NO_OVERRIDES,
      new Set(['frame']),
      [],
    )
    expect(kept[held.id]).toEqual({
      setsMode: false,
      waitsFor: 'Icon, padding left no longer uses a legacy variable',
    })
    expect(effectiveCategory(held, NO_OVERRIDES, kept)).toBe('none')
  })
})

describe('a legacy mode an instance overrides (Core Components, Text Field)', () => {
  // Scanned 2026-11-16: ↳ ↳ Leading Icon Item in ↳ Right Adornment sets
  // 🎨 Appearance: Neutral, which its main component does not, and every
  // value below it is EDS Beta.
  const fixture = JSON.parse(
    readFileSync(
      new URL('./fixtures/text-field-instance-mode.json', import.meta.url),
      'utf8',
    ),
  ) as PackedFixture

  it('is Ready and cleared by Apply', () => {
    const records = classifyUnits(unpackFixture(fixture))
    const mode = records.find((record) => record.property.type === 'mode')
    expect(mode).toMatchObject({
      nodeName: '↳ ↳ Leading Icon Item',
      category: 'sure',
      override: true,
      candidates: [CLEAR_MODE],
      rule: 'mode/clear',
    })
    const plan = planChanges(records, NO_OVERRIDES, new Set(['113:420']))
    expect(plan.map((change) => change.record.id)).toEqual([mode?.id])
  })
})

describe('parseModeTarget', () => {
  it('reads the collection and the mode', () => {
    expect(parseModeTarget('density: compact')).toEqual({
      collection: 'density',
      mode: 'compact',
    })
    expect(parseModeTarget(CLEAR_MODE)).toBeNull()
  })
})

describe('modes held only by what reads them', () => {
  it('keeps a mode only above a value whose chain reads its collection', () => {
    const reader = binding('reads', 'inInstance', {
      modeHolders: ['frame'],
      instanceId: 'instance',
      reads: [OLD.spacingSemantic, OLD.density],
    })
    const other = binding('other', 'inInstance', {
      modeHolders: ['frame'],
      instanceId: 'instance',
      reads: [OLD.density],
    })
    const proportions = mode('frame', OLD.spaceProportions, CLEAR_MODE)
    const semantic = mode('frame', OLD.spacingSemantic, CLEAR_MODE)
    const records = holdModes([proportions, semantic, reader, other])
    const kept = keptModesByRecord(
      records,
      NO_OVERRIDES,
      new Set(['frame']),
      [],
    )
    expect(Object.keys(kept)).toEqual([semantic.id])
    expect(effectiveCategory(records[0], NO_OVERRIDES, kept)).toBe('sure')
    expect(effectiveCategory(records[1], NO_OVERRIDES, kept)).toBe('none')
  })

  it('still offers to remove a kept mode, and removes it only when removed anyway', () => {
    const records = holdModes([
      mode('frame', OLD.borderRadius, CLEAR_MODE),
      binding('inside', 'inInstance', {
        oldKey: `${OLD.borderRadius}/Radius`,
        modeHolders: ['frame'],
        instanceId: 'instance',
        reads: [OLD.borderRadius],
      }),
    ])
    const [held] = records
    expect(held.candidates).toEqual([CLEAR_MODE])
    // Clearing is the proposal of a Ready mode, so choosing it changes
    // nothing: the run keeps the mode while the value inside the instance
    // reads it.
    const chosen = { records: { [held.id]: CLEAR_MODE }, rows: {} }
    const plan = planChanges(records, chosen, new Set(['frame']))
    expect(plan.map((change) => change.outcome)).toEqual(['sure'])
    expect(
      keptModes(records, chosen, new Set(['frame'])).map(
        (item) => item.record.id,
      ),
    ).toEqual([held.id])
    // Removing it anyway is its own choice, and the run removes it.
    const anyway = { records: { [held.id]: REMOVE_ANYWAY }, rows: {} }
    const removed = planChanges(records, anyway, new Set(['frame']))
    expect(removed.map((change) => change.outcome)).toEqual(['confirmed'])
    expect(keptModes(records, anyway, new Set(['frame']))).toEqual([])
  })
})

describe('Manual fix', () => {
  const fix = binding('icon', 'byHand', {
    property: { type: 'field', field: 'width' },
    group: 'size',
    kind: 'size',
    candidates: ['reset:spacing/md'],
    instanceId: 'wrapper',
    override: true,
  })
  const padding = binding('pad', 'sure', {
    candidates: ['spacing/md'],
  })

  it('is not applied until a designer accepts it in Review', () => {
    const plan = planChanges([fix, padding], NO_OVERRIDES, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).toEqual(['pad'])
  })

  it('runs first once accepted, before other changes on the layers below', () => {
    const accepted = {
      records: { icon: 'reset:spacing/md' },
      rows: {},
    }
    const plan = planChanges([padding, fix], accepted, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).toEqual(['icon', 'pad'])
    expect(plan[0]).toMatchObject({
      target: 'reset:spacing/md',
      outcome: 'confirmed',
    })
  })

  it('is left out when a designer decides later', () => {
    const later = { records: { icon: DECIDE_LATER }, rows: {} }
    const plan = planChanges([fix], later, new Set(['frame']))
    expect(plan).toEqual([])
  })
})

describe('legacy modes a run keeps (decision C)', () => {
  const FRAME = new Set(['frame'])
  // A legacy mode that is only cleared, with a Ready padding below it that
  // reads its collection: nothing waits at scan time, so the mode is Ready.
  const clearOnly = () =>
    holdModes([
      mode('card', OLD.spacingSemantic, CLEAR_MODE, { nodeName: 'Card' }),
      binding('pad', 'sure', {
        nodeName: 'Icon',
        property: { type: 'field', field: 'width' },
        modeHolders: ['card'],
        reads: [OLD.spacingSemantic],
      }),
    ])
  const modeId = `card|mode:${OLD.spacingSemantic}`
  const later: Overrides = { records: { pad: DECIDE_LATER }, rows: {} }
  /** The categories the health bar counts, with the kept modes. */
  const counted = (
    records: BindingRecord[],
    overrides: Overrides,
    kept: KeptModes,
  ) =>
    summariseEntries(
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

  it('is Ready at scan time when nothing below waits', () => {
    const [cardMode] = clearOnly()
    expect(cardMode).toMatchObject({ id: modeId, category: 'sure' })
  })

  it('keeps a mode that is only cleared above a value set to Decide later, and counts it as Waiting', () => {
    const records = clearOnly()
    const kept = keptModes(records, later, FRAME)
    expect(kept.map((item) => item.record.id)).toEqual([modeId])
    expect(kept[0].setsMode).toBe(false)
    expect(kept[0].holders.map((holder) => holder.id)).toEqual(['pad'])

    const byRecord = keptModesByRecord(records, later, FRAME, [])
    expect(byRecord).toEqual({
      [modeId]: { setsMode: false, waitsFor: 'Icon, width is decided' },
    })
    expect(keptModeText(byRecord[modeId])).toBe(
      'Cleared once Icon, width is decided.',
    )
    const [cardMode] = records
    expect(effectiveCategory(cardMode, later, byRecord)).toBe('none')
    // The value below is Needs check, the mode is Waiting, and nothing is
    // Ready, so the next Apply changes nothing.
    expect(counted(records, later, byRecord)).toMatchObject({
      sure: 0,
      check: 1,
      none: 1,
    })
    expect(previewRun(records, later, FRAME)).toMatchObject({
      changes: 0,
      modesCleared: 0,
      modesKept: [
        {
          id: modeId,
          layer: 'Card',
          setsMode: false,
          waitsFor: 'Icon, width is decided',
        },
      ],
    })
  })

  it('shows the kept mode as Waiting in Changes, and leaves it out of Review', () => {
    const records = clearOnly()
    const kept = keptModesByRecord(records, later, FRAME, [])
    const modeGroup = buildMappingGroups(records).find(
      (group) => group.group === 'modes',
    )
    const row = modeGroup?.rows[0]
    if (!row) throw new Error('No mode row')
    expect(bindingOutcome(row, row.bindings[0], later, kept)).toMatchObject({
      category: 'none',
      held: true,
      kept: { setsMode: false },
    })
    // Without the kept modes, the window would call it Ready.
    expect(bindingOutcome(row, row.bindings[0], later).category).toBe('sure')
    const review = reviewItems(buildMappingGroups(records), later, FRAME, kept)
    expect(review.map((item) => item.binding.id)).toEqual(['pad'])
  })

  it('clears the mode, Ready, once every value below changes in the same run', () => {
    const records = clearOnly()
    expect(keptModes(records, NO_OVERRIDES, FRAME)).toEqual([])
    const kept = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    expect(effectiveCategory(records[0], NO_OVERRIDES, kept)).toBe('sure')
    expect(counted(records, NO_OVERRIDES, kept)).toMatchObject({ sure: 2 })
    expect(previewRun(records, NO_OVERRIDES, FRAME)).toMatchObject({
      changes: 2,
      variables: 1,
      modesCleared: 1,
      modesKept: [],
    })
  })

  it('keeps the mode when Apply on selected values leaves a value below it out', () => {
    const records = clearOnly()
    const selected = new Set([modeId])
    const kept = keptModes(records, NO_OVERRIDES, FRAME, selected)
    expect(kept.map((item) => item.record.id)).toEqual([modeId])
    const preview = previewRun(records, NO_OVERRIDES, FRAME, selected)
    expect(preview).toMatchObject({ changes: 0, modesCleared: 0 })
    expect(preview.modesKept[0].waitsFor).toBe(
      'Icon, width is selected and applied',
    )
    // With the value below selected too, the mode goes in the same run.
    const both = new Set([modeId, 'pad'])
    expect(keptModes(records, NO_OVERRIDES, FRAME, both)).toEqual([])
  })

  it('keeps a mode that sets a new mode Ready, with the legacy mode beside it', () => {
    const records = holdModes([
      mode('root', OLD.density, 'density: comfortable'),
      binding('fill', 'check', { nodeName: 'Label', modeHolders: ['root'] }),
    ])
    expect(records[0].category).toBe('sure')
    const kept = keptModesByRecord(records, NO_OVERRIDES, FRAME, [])
    const id = `root|mode:${OLD.density}`
    expect(kept[id]).toEqual({
      setsMode: true,
      waitsFor: 'Label, padding left is decided',
    })
    expect(keptModeText(kept[id])).toBe(
      'The legacy mode stays beside it until Label, padding left is decided.',
    )
    expect(effectiveCategory(records[0], NO_OVERRIDES, kept)).toBe('sure')
    expect(previewRun(records, NO_OVERRIDES, FRAME)).toMatchObject({
      changes: 1,
      modesSet: 1,
      modesCleared: 0,
      modesKept: [{ id, setsMode: true }],
    })
  })

  it('keeps the mode when Review confirms clearing it on a deferred Ready mode, with a value below set to Decide later', () => {
    const records = clearOnly()
    const deferred: Overrides = {
      records: { pad: DECIDE_LATER, [modeId]: DECIDE_LATER },
      rows: {},
    }
    // Review lists the deferred mode, and says what clearing it waits for.
    const groups = buildMappingGroups(records)
    expect(
      reviewItems(groups, deferred, FRAME).map((item) => item.binding.id),
    ).toContain(modeId)
    expect(modeWaits(records, deferred, FRAME, []).blocked[modeId]).toBe(
      'Icon, width is decided',
    )
    // Confirming the proposal in Review stores clearing on the mode.
    const confirmed: Overrides = {
      records: { pad: DECIDE_LATER, [modeId]: CLEAR_MODE },
      rows: {},
    }
    const plan = planChanges(records, confirmed, FRAME)
    expect(plan.map((change) => [change.record.id, change.outcome])).toEqual([
      [modeId, 'sure'],
    ])
    const { kept } = modeWaits(records, confirmed, FRAME, [])
    expect(kept[modeId]).toEqual({
      setsMode: false,
      waitsFor: 'Icon, width is decided',
    })
    expect(effectiveCategory(records[0], confirmed, kept)).toBe('none')
    expect(previewRun(records, confirmed, FRAME)).toMatchObject({
      changes: 0,
      modesCleared: 0,
      modesRemovedAnyway: [],
      modesKept: [{ id: modeId }],
    })
  })

  it('removes a mode the designer removes anyway, and the preview names the values that change', () => {
    const records = clearOnly()
    const anyway: Overrides = {
      records: { pad: DECIDE_LATER, [modeId]: REMOVE_ANYWAY },
      rows: {},
    }
    const plan = planChanges(records, anyway, FRAME)
    expect(plan.map((change) => [change.record.id, change.outcome])).toEqual([
      [modeId, 'confirmed'],
    ])
    expect(keptModes(records, anyway, FRAME)).toEqual([])
    const kept = keptModesByRecord(records, anyway, FRAME, [])
    expect(effectiveCategory(records[0], anyway, kept)).toBe('sure')
    const preview = previewRun(records, anyway, FRAME)
    expect(preview).toMatchObject({
      changes: 1,
      modesCleared: 1,
      modesKept: [],
      modesRemovedAnyway: [{ id: modeId, layer: 'Card', below: 'Icon, width' }],
    })
    expect(removedLine(preview.modesRemovedAnyway[0])).toBe(
      'x on Card is removed anyway, so the legacy values below that read it change: Icon, width.',
    )
    // The proposal itself stays sure, and removing anyway is confirmed.
    expect(changeOutcome(records[0], CLEAR_MODE)).toBe('sure')
    expect(changeOutcome(records[0], REMOVE_ANYWAY)).toBe('confirmed')
  })

  it('keeps the legacy mode beside another new mode a designer chooses', () => {
    const records = holdModes([
      mode('root', OLD.density, 'density: comfortable'),
      binding('fill', 'check', { nodeName: 'Label', modeHolders: ['root'] }),
    ])
    const id = `root|mode:${OLD.density}`
    const other: Overrides = { records: { [id]: 'density: compact' }, rows: {} }
    expect(planChanges(records, other, FRAME)[0].outcome).toBe('override')
    expect(keptModesByRecord(records, other, FRAME, [])[id]).toMatchObject({
      setsMode: true,
    })
  })

  it('offers removing anyway only on a legacy mode that values below read', () => {
    const held = holdModes([
      mode('chip', OLD.borderRadius, CLEAR_MODE, { nodeName: 'Chip' }),
      binding('inside', 'inInstance', {
        oldKey: `${OLD.borderRadius}/Radius`,
        modeHolders: ['chip'],
        instanceId: 'instance',
        reads: [OLD.borderRadius],
      }),
    ])
    const id = held[0].id
    expect(held[0]).toMatchObject({
      category: 'sure',
      candidates: [CLEAR_MODE],
    })
    const { blocked } = modeWaits(held, NO_OVERRIDES, FRAME, [
      {
        id: 'instance',
        name: 'Chip 1',
        entryId: 'frame',
        count: 1,
        mainComponent: { name: 'Chip', key: 'c', remote: false, id: '1:2' },
      },
    ])
    const extra = modePickerExtra([id], blocked)
    expect(extra).toBe(REMOVE_ANYWAY_OPTION)
    const options = pickerOptions({
      kinds: [],
      group: 'modes',
      candidates: held[0].candidates ?? [],
      ...(extra ? { extra } : {}),
    })
    expect(options.proposed).toEqual([CLEAR_MODE])
    expect(options.extra?.targets).toEqual([REMOVE_ANYWAY])
    expect(targetLabel(REMOVE_ANYWAY)).toBe(REMOVE_ANYWAY_LABEL)
    expect(REMOVE_ANYWAY_LABEL).toBe(
      'Remove the legacy mode anyway (the values below that read it change)',
    )
    expect(modePickerNote([id], blocked)).toContain(
      'Clearing it waits until the main component Chip is migrated. To remove it in the next run anyway, choose Remove the legacy mode anyway',
    )
    // A mode nothing below reads offers no such choice.
    const free = clearOnly()
    const none = modeWaits(free, NO_OVERRIDES, FRAME, []).blocked
    expect(modePickerExtra([modeId], none)).toBeUndefined()
  })

  it('stores removing anyway on a row, and drops the proposal chosen again on a Ready row', () => {
    const records = clearOnly()
    const row = buildMappingGroups(records).find(
      (group) => group.group === 'modes',
    )?.rows[0]
    if (!row) throw new Error('No mode row')
    const rowChoice = (value: string, overrides: Overrides) =>
      withRowChoice(overrides, rowChoiceTarget(row), value).rows[row.key]
    expect(rowChoice(REMOVE_ANYWAY, later)).toBe(REMOVE_ANYWAY)
    expect(rowChoice(CLEAR_MODE, later)).toBeUndefined()
    // Saving the choice the row has already keeps it.
    const chosen: Overrides = { records: {}, rows: { [row.key]: CLEAR_MODE } }
    expect(rowChoice(CLEAR_MODE, chosen)).toBe(CLEAR_MODE)
  })

  it('clears the legacy mode for removing anyway, with no new mode', () => {
    expect(parseModeTarget(REMOVE_ANYWAY)).toBeNull()
    // The rule apply.ts keeps modes with: removing anyway is never kept.
    const records = clearOnly()
    const [cardMode] = records
    const change = {
      record: cardMode,
      target: REMOVE_ANYWAY,
      outcome: 'confirmed' as const,
    }
    expect(keptModeChanges(records, [change], new Set()).size).toBe(0)
    expect(
      keptModeChanges(
        records,
        [{ ...change, target: CLEAR_MODE, outcome: 'sure' }],
        new Set(),
      ).has(modeId),
    ).toBe(true)
  })

  it('names what values inside instances wait for', () => {
    const inside = (id: string, instanceId: string) =>
      binding(id, 'inInstance', { instanceId })
    const instances: OldInstance[] = [
      {
        id: 'local',
        name: 'Button 1',
        entryId: 'frame',
        count: 1,
        mainComponent: { name: 'Button', key: 'b', remote: false, id: '1:1' },
      },
      {
        id: 'library',
        name: 'Chip 2',
        entryId: 'frame',
        count: 1,
        mainComponent: { name: 'Chip', key: 'c', remote: true },
      },
      {
        id: 'type',
        name: 'Title',
        entryId: 'frame',
        count: 1,
        typography: true,
        mainComponent: { name: 'Typography', key: 't', remote: true },
      },
    ]
    expect(waitsFor([inside('a', 'local')], NO_OVERRIDES, instances)).toBe(
      'the main component Button is migrated',
    )
    expect(
      waitsFor(
        [inside('a', 'local'), inside('b', 'library'), inside('c', 'type')],
        NO_OVERRIDES,
        instances,
      ),
    ).toBe(
      'the main component Button is migrated, the instance Chip 2 is swapped to an EDS Beta component and the Typography instance Title is converted to text',
    )
  })

  it('shares one keep rule between keptModes and applyChanges', () => {
    // applyChanges plans, changes the bindings, and keeps the modes that
    // keptModeChanges returns for the bindings it changed; keptModes runs
    // the same function on the plan.
    const records = [
      ...clearOnly(),
      mode('root', OLD.density, 'density: comfortable'),
      binding('label', 'check', { modeHolders: ['root'] }),
    ]
    for (const overrides of [NO_OVERRIDES, later]) {
      const plan = planChanges(records, overrides, FRAME)
      const changed = new Set(
        plan
          .filter((change) => !isModeChange(change))
          .map((change) => change.record.id),
      )
      const run = keptModeChanges(records, plan.filter(isModeChange), changed)
      expect(
        keptModes(records, overrides, FRAME).map((item) => item.record.id),
      ).toEqual([...run.keys()])
      // Every kept mode is one modesToKeep blocks.
      const blocked = modesToKeep(records, changed)
      for (const id of run.keys()) {
        const record = records.find((candidate) => candidate.id === id)
        expect(
          blocked.has(`${record?.nodeId}|${record?.oldMode?.collectionKey}`),
        ).toBe(true)
      }
    }
  })
})

describe('previewRun', () => {
  const FRAME = new Set(['frame'])

  it('counts each kind of change the plan makes', () => {
    const records: BindingRecord[] = [
      binding('pad', 'sure'),
      binding('border', 'sure', {
        property: { type: 'field', field: 'strokeWeight' },
        candidates: ['value:1'],
      }),
      binding('title', 'sure', {
        property: { type: 'typography' },
        group: 'typography',
        candidates: ['header/lg'],
      }),
      binding('icon', 'byHand', {
        property: { type: 'field', field: 'width' },
        candidates: ['reset:spacing/md'],
        instanceId: 'wrapper',
        override: true,
      }),
      binding('overridden', 'sure', { instanceId: 'wrapper', override: true }),
      mode('root', OLD.density, 'density: comfortable'),
    ]
    const accepted: Overrides = {
      records: { icon: 'reset:spacing/md' },
      rows: {},
    }
    const plan = planChanges(records, accepted, FRAME)
    const preview = previewRun(records, accepted, FRAME)
    expect(preview).toEqual({
      changes: plan.length,
      variables: 3,
      numbers: 1,
      textStyles: 1,
      modesSet: 1,
      modesCleared: 1,
      modesRemovedAnyway: [],
      modesKept: [],
      resets: 1,
      inInstances: 2,
      fromMain: { file: 0, library: 0, typography: 0 },
    })
  })

  describe('on the test frame', () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL('./fixtures/test-frame.json', import.meta.url),
        'utf8',
      ),
    ) as PackedFixture
    const records = classifyUnits(unpackFixture(fixture))
    const entries = new Set(records.map((record) => record.entryId))
    const readyBindings = records.filter(
      (record) => record.category === 'sure' && record.property.type !== 'mode',
    )
    const cases: [string, Overrides][] = [
      ['without choices', NO_OVERRIDES],
      [
        'with every Ready value set to Decide later',
        {
          records: Object.fromEntries(
            readyBindings.map((record) => [record.id, DECIDE_LATER]),
          ),
          rows: {},
        },
      ],
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
    ]

    it.each(cases)(
      'changes as many values as the health bar counts Ready, %s',
      (_, overrides) => {
        const kept = keptModesByRecord(records, overrides, entries, [])
        const ready = records.filter(
          (record) => effectiveCategory(record, overrides, kept) === 'sure',
        ).length
        const plan = planChanges(records, overrides, entries)
        const preview = previewRun(records, overrides, entries)
        const waiting = preview.modesKept.filter((item) => !item.setsMode)
        expect(preview.changes).toBe(ready)
        expect(preview.changes).toBe(plan.length - waiting.length)
        expect(preview.modesKept.map((item) => item.id).sort()).toEqual(
          Object.keys(kept).sort(),
        )
      },
    )

    it('counts the kept modes as Waiting in the report as in the summary', () => {
      const overrides = cases[1][1]
      const kept = keptModesByRecord(records, overrides, entries, [])
      const meta = [...entries].map((id) => ({
        id,
        kind: 'frame' as const,
        name: id,
        pageId: 'page',
        pageName: 'Page',
        sections: [],
        nodeIds: [id],
      }))
      const base: ScanSummary = {
        scope: 'page',
        scannedAt: '2026-11-16T00:00:00.000Z',
        mappingVersion: 'test',
        pages: [{ id: 'page', name: 'Page' }],
        nodesScanned: 0,
        totals: summariseEntries(meta, records, [])[0].counts,
        health: null,
        entries: summariseEntries(meta, records, []),
      }
      const summary = recount(base, records, [], (record) =>
        effectiveCategory(record, overrides, kept),
      )
      const report = buildReport({
        fileName: 'Test',
        summary,
        records,
        oldInstances: [],
        overrides,
        kept,
      })
      expect(report.markdown).toContain(
        `## No equivalent (${summary.totals.none})`,
      )
      expect(report.markdown).toContain('Cleared once')
    })
  })
})
