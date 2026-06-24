import { StepDefinition, StepRole } from './types'

export const getLightnessValues =
  (mode: 'light' | 'dark') =>
  (steps: readonly StepDefinition[]): number[] =>
    steps.map((step) => (mode === 'light' ? step.lightValue : step.darkValue))

export const findStepById =
  (id: string) =>
  (steps: readonly StepDefinition[]): StepDefinition | undefined =>
    steps.find((step) => step.id === id)

export const getStepIndex =
  (id: string) =>
  (steps: readonly StepDefinition[]): number =>
    steps.findIndex((step) => step.id === id)

/**
 * Index of the (first) step carrying a given semantic role, or -1.
 * Used to resolve UI chrome colors by role instead of by fixed position, so
 * the scale survives steps being inserted, removed, or reassigned.
 */
export const getStepIndexByRole =
  (role: StepRole) =>
  (steps: readonly StepDefinition[]): number =>
    steps.findIndex((step) => step.role === role)
