import { describe, expect, it } from 'vitest'
import {
  PALETTE_STEPS,
  categoryLabel,
  darknessValuesInDarkMode,
  lightnessValuesInLightMode,
  stepCategoryRuns,
  stepId,
  stepLabel,
  stepRolesText,
  stepsWithRole,
} from './config'
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

  it('capitalises the border and text categories too', () => {
    expect(categoryLabel('border')).toBe('Border')
    expect(categoryLabel('text')).toBe('Text')
  })

  it('lists the roles of a step, or says it has none', () => {
    expect(stepRolesText(13)).toContain('text.primary')
    expect(stepRolesText(6)).toBe('no semantic role')
    expect(stepRolesText(14)).toBe('no semantic role')
  })

  it('joins every role of a step with a comma', () => {
    for (const step of PALETTE_STEPS) {
      if (step.roles.length === 0) continue
      expect(stepRolesText(step.step)).toBe(step.roles.join(', '))
    }
  })

  it('says a step outside the scale has no role', () => {
    expect(stepRolesText(0)).toBe('no semantic role')
    expect(stepRolesText(STEP_COUNT + 1)).toBe('no semantic role')
  })

  it('labels a step with its number and the label of its main role', () => {
    for (const step of PALETTE_STEPS) {
      expect(stepLabel(step.step)).toBe(`${step.step} · ${step.label}`)
    }
  })

  it('names steps 6 and 14 unused in the label', () => {
    expect(stepLabel(6)).toBe('6 · unused')
    expect(stepLabel(14)).toBe('14 · unused')
  })
})

describe('stepCategoryRuns', () => {
  const runs = stepCategoryRuns()

  it('spans all 15 steps', () => {
    expect(runs.reduce((sum, run) => sum + run.span, 0)).toBe(STEP_COUNT)
  })

  it('gives every run a span of at least one', () => {
    for (const run of runs) expect(run.span).toBeGreaterThanOrEqual(1)
  })

  it('never puts two runs of the same category next to each other', () => {
    runs.slice(1).forEach((run, i) => {
      expect(run.category).not.toBe(runs[i].category)
    })
  })

  it('expands back to the category of every step, in order', () => {
    const expanded = runs.flatMap((run) =>
      Array.from({ length: run.span }, () => run.category),
    )
    expect(expanded).toEqual(PALETTE_STEPS.map((step) => step.category))
  })

  it('returns a fresh list on each call', () => {
    const again = stepCategoryRuns()
    expect(again).toEqual(runs)
    expect(again).not.toBe(runs)
    again[0].span += 1
    expect(stepCategoryRuns()).toEqual(runs)
  })
})

describe('stepsWithRole', () => {
  const groups = ['background', 'border', 'text'] as const
  const hasPrefix = (roles: string[], prefixes: string[]) =>
    roles.some((role) => prefixes.some((prefix) => role.startsWith(prefix)))

  it('returns exactly the steps with a role in the group', () => {
    for (const group of groups) {
      const prefixes = group === 'text' ? ['text.', 'icon.'] : [`${group}.`]
      const expected = PALETTE_STEPS.filter((step) =>
        hasPrefix(step.roles, prefixes),
      )
      expect(stepsWithRole(group)).toEqual(expected)
    }
  })

  it('counts icon roles as text', () => {
    const textSteps = stepsWithRole('text').map((step) => step.step)
    for (const step of PALETTE_STEPS) {
      if (step.roles.some((role) => role.startsWith('icon.'))) {
        expect(textSteps).toContain(step.step)
      }
    }
  })

  it('includes text.primary and background.surface under their groups', () => {
    expect(stepsWithRole('text').map((step) => step.step)).toContain(13)
    expect(stepsWithRole('background').map((step) => step.step)).toContain(15)
  })

  it('never includes the steps without a semantic role', () => {
    for (const group of groups) {
      const steps = stepsWithRole(group).map((step) => step.step)
      expect(steps).not.toContain(6)
      expect(steps).not.toContain(14)
    }
  })

  it('keeps the steps in scale order', () => {
    for (const group of groups) {
      const steps = stepsWithRole(group).map((step) => step.step)
      expect(steps).toEqual([...steps].sort((a, b) => a - b))
    }
  })
})

describe('lightness exports', () => {
  it('match the Tokens Studio scale for each scheme', () => {
    expect(lightnessValuesInLightMode).toEqual(TS_SCALE.light)
    expect(darknessValuesInDarkMode).toEqual(TS_SCALE.dark)
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
