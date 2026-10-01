import { describe, expect, it } from 'vitest'
import { PALETTE_STEPS } from './config'
import { findStepById, getLightnessValues } from './helpers'
import { TS_SCALE } from './tokensStudio'
import type { StepDefinition } from './types'

const step = (
  n: number,
  lightValue: number,
  darkValue: number,
): StepDefinition => ({
  step: n,
  id: `step-${n}`,
  name: `Step ${n}`,
  label: '',
  primaryRole: null,
  roles: [],
  category: 'unused',
  lightValue,
  darkValue,
})

describe('getLightnessValues', () => {
  it('reads the light or dark value of each step, in order', () => {
    const steps = [step(1, 0.9, 0.2), step(2, 0.5, 0.6)]
    expect(getLightnessValues('light')(steps)).toEqual([0.9, 0.5])
    expect(getLightnessValues('dark')(steps)).toEqual([0.2, 0.6])
  })

  it('returns an empty list for no steps', () => {
    expect(getLightnessValues('light')([])).toEqual([])
  })

  it('gives the Tokens Studio scale for the palette steps', () => {
    expect(getLightnessValues('light')(PALETTE_STEPS)).toEqual(TS_SCALE.light)
    expect(getLightnessValues('dark')(PALETTE_STEPS)).toEqual(TS_SCALE.dark)
  })
})

describe('findStepById', () => {
  it('finds a palette step by its id', () => {
    expect(findStepById('step-9')(PALETTE_STEPS)).toBe(PALETTE_STEPS[8])
    expect(findStepById('step-15')(PALETTE_STEPS)?.step).toBe(15)
  })

  it('returns undefined for an unknown id', () => {
    expect(findStepById('step-16')(PALETTE_STEPS)).toBeUndefined()
    expect(findStepById('9')(PALETTE_STEPS)).toBeUndefined()
    expect(findStepById('step-1')([])).toBeUndefined()
  })
})
