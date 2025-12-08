import { StepDefinition } from './types'

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
