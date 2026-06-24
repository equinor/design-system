import { StepDefinition } from '@/config/types'
import { PALETTE_GROUPS } from '@/config/groups'

/**
 * Runtime helpers for editing the set of palette steps. The scale is an ordered
 * StepDefinition[]; steps can be inserted between existing ones, reassigned to a
 * different group, removed, or have their lightness tuned — all without relying
 * on a fixed step count.
 */

let idCounter = 0

/** Generate a unique, stable id for a user-created step. */
export function makeStepId(): string {
  idCounter += 1
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${idCounter}`
  return `custom-${rand}`
}

/** Clamp a lightness value to the valid OKLCH lightness range [0, 1]. */
function clampLightness(value: number): number {
  if (Number.isNaN(value)) return 0.5
  return Math.min(1, Math.max(0, value))
}

/**
 * Lightness for a step inserted at `index`, interpolated from its neighbours.
 * Falls back to the single neighbour at an edge, or 0.5 with no neighbours.
 */
function interpolatedLightness(
  steps: readonly StepDefinition[],
  index: number,
  mode: 'lightValue' | 'darkValue',
): number {
  const prev = steps[index - 1]
  const next = steps[index]
  if (prev && next) return clampLightness((prev[mode] + next[mode]) / 2)
  if (prev) return clampLightness(prev[mode])
  if (next) return clampLightness(next[mode])
  return 0.5
}

export interface NewStepInput {
  name?: string
  groupId?: string
  lightValue?: number
  darkValue?: number
}

/**
 * Insert a new step at `index` (0-based position in the ordered scale).
 * Unspecified lightness is interpolated from neighbours; an unspecified group
 * defaults to the neighbour's group, then the first group in the registry.
 */
export function insertStepAt(
  steps: StepDefinition[],
  index: number,
  input: NewStepInput = {},
): StepDefinition[] {
  const clampedIndex = Math.min(Math.max(index, 0), steps.length)
  const neighbourGroup =
    steps[clampedIndex - 1]?.groupId ??
    steps[clampedIndex]?.groupId ??
    PALETTE_GROUPS[0].id

  const newStep: StepDefinition = {
    id: makeStepId(),
    name: input.name?.trim() || 'New step',
    groupId: input.groupId ?? neighbourGroup,
    lightValue:
      input.lightValue ??
      interpolatedLightness(steps, clampedIndex, 'lightValue'),
    darkValue:
      input.darkValue ?? interpolatedLightness(steps, clampedIndex, 'darkValue'),
  }

  const next = [...steps]
  next.splice(clampedIndex, 0, newStep)
  return next
}

/** Remove the step at `index`. Never removes the last remaining step. */
export function removeStepAt(
  steps: StepDefinition[],
  index: number,
): StepDefinition[] {
  if (steps.length <= 1) return steps
  return steps.filter((_, i) => i !== index)
}

/** Apply a partial patch to the step at `index`. */
export function updateStepAt(
  steps: StepDefinition[],
  index: number,
  patch: Partial<StepDefinition>,
): StepDefinition[] {
  return steps.map((step, i) => (i === index ? { ...step, ...patch } : step))
}

/**
 * Build a step array from legacy positional lightness arrays by folding them
 * onto a default step structure. Used to migrate older saved configs (which
 * stored only lightModeValues/darkModeValues) into the step-based model. Falls
 * back to the defaults unchanged when lengths don't line up.
 */
export function stepsFromLightness(
  defaultSteps: StepDefinition[],
  lightModeValues?: number[],
  darkModeValues?: number[],
): StepDefinition[] {
  const lightOk =
    Array.isArray(lightModeValues) &&
    lightModeValues.length === defaultSteps.length
  const darkOk =
    Array.isArray(darkModeValues) &&
    darkModeValues.length === defaultSteps.length

  if (!lightOk && !darkOk) return defaultSteps

  return defaultSteps.map((step, i) => ({
    ...step,
    lightValue: lightOk ? lightModeValues![i] : step.lightValue,
    darkValue: darkOk ? darkModeValues![i] : step.darkValue,
  }))
}

/**
 * Structural equality for two step arrays (ignores contrastWith, which the UI
 * doesn't edit). Used to detect whether the scale has diverged from defaults.
 */
export function areStepsEqual(
  a: readonly StepDefinition[],
  b: readonly StepDefinition[],
): boolean {
  if (a.length !== b.length) return false
  return a.every((step, i) => {
    const other = b[i]
    return (
      step.id === other.id &&
      step.name === other.name &&
      step.groupId === other.groupId &&
      step.role === other.role &&
      step.lightValue === other.lightValue &&
      step.darkValue === other.darkValue
    )
  })
}

/**
 * Validate a value parsed from storage / an imported config as a step array.
 * Returns true only for a non-empty array of objects carrying the required
 * structural fields, so malformed or legacy data falls back to defaults.
 */
export function isValidStepArray(value: unknown): value is StepDefinition[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (s) =>
        s &&
        typeof s === 'object' &&
        typeof (s as StepDefinition).id === 'string' &&
        typeof (s as StepDefinition).name === 'string' &&
        typeof (s as StepDefinition).groupId === 'string' &&
        typeof (s as StepDefinition).lightValue === 'number' &&
        typeof (s as StepDefinition).darkValue === 'number',
    )
  )
}
