/** Apply: what a run changes, in what order, and which legacy modes stay. */
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import {
  changeOutcome,
  modesToKeep,
  parseModeTarget,
  planChanges,
} from '../src/scan/apply-plan'
import { CLEAR_MODE, holdModes } from '../src/scan/classify'
import { NO_OVERRIDES } from '../src/scan/mapping'
import type { BindingRecord } from '../src/scan/types'

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

  it('leaves out a binding the designer chose to leave', () => {
    const overrides = { records: { ready: null }, rows: {} }
    const plan = planChanges(records, overrides, new Set(['frame']))
    expect(plan.map((change) => change.record.id)).not.toContain('ready')
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
  it('turns a mode that is only cleared into No equivalent while an instance below uses legacy variables', () => {
    const [held] = holdModes([
      mode('chip', OLD.borderRadius, CLEAR_MODE),
      binding('inside', 'inInstance', {
        oldKey: `${OLD.borderRadius}/Radius`,
        modeHolders: ['chip'],
        instanceId: 'instance',
      }),
    ])
    expect(held.category).toBe('none')
    expect(held.rule).toBe('mode/kept')
  })

  it('still sets a new density mode, and says the legacy one stays', () => {
    const [held] = holdModes([
      mode('root', OLD.density, 'density: comfortable', {
        reason: 'Spacious is comfortable',
      }),
      binding('icon', 'none', { modeHolders: ['root'] }),
    ])
    expect(held.category).toBe('sure')
    expect(held.reason).toContain('The legacy mode stays')
  })
})

describe('holdModes and the review', () => {
  it('holds a mode that is only cleared until the bindings below that need a check are applied', () => {
    const [held] = holdModes([
      mode('button', OLD.appearance, CLEAR_MODE),
      binding('fill', 'check', {
        oldKey: `${OLD.appearance}/Bg/Fill/Emphasis/Default`,
        modeHolders: ['button'],
      }),
    ])
    expect(held.category).toBe('none')
    expect(held.rule).toBe('mode/after-review')
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
    const [freed, held] = holdModes([proportions, semantic, reader, other])
    expect(freed.category).toBe('sure')
    expect(held.category).toBe('none')
  })

  it('still offers to remove a kept mode, and removes it when chosen', () => {
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
    const chosen = { records: { [held.id]: CLEAR_MODE }, rows: {} }
    const plan = planChanges(records, chosen, new Set(['frame']))
    expect(plan.map((change) => change.outcome)).toEqual(['confirmed'])
  })
})
