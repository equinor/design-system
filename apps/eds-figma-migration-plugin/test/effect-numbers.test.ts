/**
 * Numbers on effects, such as the blur of a shadow (decided 2026-11-16,
 * phase 6b). A number on an effect with no spacing token at its px gets the
 * px without a variable as its stand-in, and Apply sets it on the effect.
 * The Figma calls in apply.ts and revert.ts cannot run here, so these tests
 * cover what they rely on: reading and setting the number on an effect, the
 * plan and the preview, and the scan of a number the plugin has set.
 */
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import { literalValue } from '../src/mapping/literal'
import { planChanges, previewRun } from '../src/scan/apply-plan'
import { classifyUnit } from '../src/scan/classify'
import { NO_OVERRIDES } from '../src/scan/mapping'
import type { BindingRecord, RawUnit } from '../src/scan/types'
import { effectNumber, withEffectNumber } from '../src/shared/effect-numbers'
import { ctx } from './helpers'

const shadow = {
  type: 'DROP_SHADOW',
  color: { r: 0, g: 0, b: 0, a: 0.2 },
  offset: { x: 0, y: 2 },
  radius: 5,
  spread: 1,
  visible: true,
  blendMode: 'NORMAL',
}

describe('effectNumber', () => {
  it('reads the blur, the spread and the offset', () => {
    expect(effectNumber(shadow, 'radius')).toBe(5)
    expect(effectNumber(shadow, 'spread')).toBe(1)
    expect(effectNumber(shadow, 'offsetX')).toBe(0)
    expect(effectNumber(shadow, 'offsetY')).toBe(2)
  })

  it('has no number for the colour, or for a field the effect does not have', () => {
    expect(effectNumber(shadow, 'color')).toBeUndefined()
    expect(
      effectNumber({ type: 'LAYER_BLUR', radius: 4 }, 'spread'),
    ).toBeUndefined()
  })
})

describe('withEffectNumber', () => {
  it('sets the number on a copy, and leaves the effect as it was', () => {
    const blurred = withEffectNumber(shadow, 'radius', 18)
    expect(blurred).toMatchObject({ radius: 18, spread: 1 })
    expect(shadow.radius).toBe(5)
  })

  it('sets the x or y of the offset', () => {
    expect(withEffectNumber(shadow, 'offsetY', 4).offset).toEqual({
      x: 0,
      y: 4,
    })
    expect(withEffectNumber(shadow, 'offsetX', -2).offset).toEqual({
      x: -2,
      y: 2,
    })
  })

  it('throws for a field that takes no number', () => {
    expect(() => withEffectNumber(shadow, 'color', 1)).toThrow(
      'An effect takes no number on color',
    )
  })
})

/** A blur on a shadow with a stand-in of 18px without a variable. */
const blur: BindingRecord = {
  id: 'card|effects[0].radius',
  nodeId: 'card',
  nodeName: 'Card',
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: { type: 'effect', index: 0, field: 'radius' },
  group: 'other',
  kind: 'other',
  category: 'none',
  outcome: 'none',
  oldKey: `${OLD.spacingSemantic}/Shadow/Blur`,
  old: 'Shadow/Blur',
  oldVariable: { id: 'VariableID:blur', key: 'blur', name: 'Shadow/Blur' },
  candidates: ['value:18'],
  reason:
    'No rule for Shadow/Blur: the plugin knows no EDS Beta token for it; no EDS Beta spacing token is 18px in comfortable, so the stand-in is 18px without a variable',
  rule: 'number/as-px',
}

describe('a number without a variable on an effect, in a run', () => {
  const FRAME = new Set(['frame'])
  const chosen = { records: { [blur.id]: 'value:18' }, rows: {} }

  it('is not planned until a designer chooses the stand-in', () => {
    expect(planChanges([blur], NO_OVERRIDES, FRAME)).toEqual([])
  })

  it('is planned as the number Apply sets on the effect, and counted as a number', () => {
    const plan = planChanges([blur], chosen, FRAME)
    expect(plan).toHaveLength(1)
    expect(plan[0]).toMatchObject({
      target: 'value:18',
      outcome: 'confirmed',
    })
    expect(plan[0].record.property).toEqual(blur.property)
    expect(literalValue(plan[0].target)).toBe(18)
    expect(previewRun([blur], chosen, FRAME)).toMatchObject({
      changes: 1,
      numbers: 1,
      variables: 0,
    })
  })
})

describe('a number the plugin set on an effect, in the next scan', () => {
  it('counts as migrated, with the effect numbers', () => {
    const unit: RawUnit = {
      nodeId: 'card',
      nodeName: 'Card',
      nodeType: 'FRAME',
      entryId: 'frame',
      path: [],
      unit: 'value',
      property: { type: 'effect', index: 0, field: 'radius' },
      value: 18,
      context: ctx(['Card']),
    }
    expect(classifyUnit(unit)).toMatchObject({
      id: 'card|effects[0].radius',
      category: 'migrated',
      group: 'other',
      current: '18, set without a variable by the plugin',
    })
  })
})
