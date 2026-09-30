import { describe, expect, it } from 'vitest'
import { PALETTE_STEPS, categoryLabel, stepId, stepRolesText } from './config'
import { LEGACY_2X_LIGHTNESS } from './legacy2x'
import { STEP_COUNT, TS_SCALE } from './tokensStudio'

describe('PALETTE_STEPS', () => {
  it('has one definition per Tokens Studio step', () => {
    expect(PALETTE_STEPS).toHaveLength(STEP_COUNT)
    PALETTE_STEPS.forEach((step, i) => {
      expect(step.step).toBe(i + 1)
      expect(step.id).toBe(stepId(i + 1))
    })
  })

  it('takes lightness from Tokens Studio', () => {
    expect(PALETTE_STEPS.map((s) => s.lightValue)).toEqual(TS_SCALE.light)
    expect(PALETTE_STEPS.map((s) => s.darkValue)).toEqual(TS_SCALE.dark)
  })

  it('names each step after a role that still references it', () => {
    for (const step of PALETTE_STEPS) {
      if (step.primaryRole === null) {
        // Steps 6 and 14 have no semantic consumer (ADR 0016 D5).
        expect(step.roles).toEqual([])
      } else {
        expect(step.roles).toContain(step.primaryRole)
      }
    }
  })

  it('only targets steps that exist', () => {
    const ids = new Set(PALETTE_STEPS.map((s) => s.id))
    for (const step of PALETTE_STEPS) {
      for (const requirement of step.contrastWith ?? []) {
        expect(ids.has(requirement.targetStep)).toBe(true)
      }
    }
  })
})

describe('step display helpers', () => {
  it('capitalises categories for grouped headers', () => {
    expect(categoryLabel('background')).toBe('Background')
    expect(categoryLabel('unused')).toBe('Unused')
  })

  it('lists the roles of a step, or says it has none', () => {
    expect(stepRolesText(13)).toContain('text.primary')
    expect(stepRolesText(6)).toBe('no semantic role')
    expect(stepRolesText(14)).toBe('no semantic role')
  })
})

describe('LEGACY_2X_LIGHTNESS', () => {
  // The frozen 2.x scale must not follow Tokens Studio (ADR 0016 D1).
  it('keeps the 2.x values', () => {
    expect(LEGACY_2X_LIGHTNESS.light).toHaveLength(STEP_COUNT)
    expect(LEGACY_2X_LIGHTNESS.dark).toHaveLength(STEP_COUNT)
    expect(LEGACY_2X_LIGHTNESS.light[0]).toBe(0.97)
    expect(LEGACY_2X_LIGHTNESS.dark[0]).toBe(0.15)
  })
})
