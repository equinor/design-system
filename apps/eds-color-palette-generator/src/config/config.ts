// The 15 steps of every colour scale, derived from Tokens Studio.
//
// Lightness comes from `input/scale` and the role names come from the
// semantic layer (see tokensStudio.ts). The step roles follow ADR 0016 D5.

import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'
import { ContrastRequirement, StepCategory, StepDefinition } from './types'
import { getLightnessValues } from './helpers'
import { STEP_COUNT, TS_SCALE, rolesForStep } from './tokensStudio'

/**
 * The role each step is named after in the UI, as a Tokens Studio semantic
 * path. A step usually serves several roles (`rolesForStep` lists them all);
 * this picks the one that best explains the step. `config.test.ts` checks
 * that every path still references its step, so a Tokens Studio change that
 * repoints a role fails the test instead of leaving a stale label.
 */
const PRIMARY_ROLES: ReadonlyArray<{ role: string | null; label: string }> = [
  { role: 'background.interactive.<tone>.muted.default', label: 'muted' },
  { role: 'background.interactive.<tone>.muted.hover', label: 'muted hover' },
  {
    role: 'background.interactive.<tone>.muted.pressed',
    label: 'muted pressed',
  },
  { role: 'border.non-interactive.<tone>.muted', label: 'border muted' },
  { role: 'background.interactive.accent.selected.default', label: 'selected' },
  { role: null, label: 'unused' },
  { role: 'border.non-interactive.<tone>.default', label: 'border' },
  { role: 'text.secondary', label: 'text secondary' },
  { role: 'background.interactive.<tone>.emphasis.default', label: 'emphasis' },
  {
    role: 'background.interactive.<tone>.emphasis.hover',
    label: 'emphasis hover',
  },
  {
    role: 'background.interactive.<tone>.emphasis.pressed',
    label: 'emphasis pressed',
  },
  { role: 'text.on-muted.<tone>', label: 'on-muted' },
  { role: 'text.primary', label: 'text primary' },
  { role: null, label: 'unused' },
  { role: 'text.on-emphasis.<tone>', label: 'on-emphasis' },
]

export const stepId = (step: number) => `step-${step}`

/**
 * Contrast requirements from ADR 0016 Confirmation 5. Text and icon roles are
 * measured with APCA against `background.surface`: Lc 90 for `text.primary`,
 * Lc 60 for secondary text and interactive elements. `on-emphasis` is measured
 * against the tone's emphasis fill. Borders are deliberately out of scope.
 *
 * The generator checks each pair inside every hue. For hues other than the
 * neutral one, that hue's step 15 stands in for `background.surface`
 * (`neutral.15`); both sit at the same lightness.
 */
const surface = stepId(15)
const lc60OnSurface = (pairing: string): ContrastRequirement => ({
  targetStep: surface,
  lc: APCA_CONTRAST_LEVELS.LC_60,
  wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
  pairing,
})

const CONTRAST_REQUIREMENTS: Partial<Record<number, ContrastRequirement[]>> = {
  8: [lc60OnSurface('text.secondary on background.surface')],
  11: [lc60OnSurface('icon.interactive.<tone>.default on background.surface')],
  12: [lc60OnSurface('icon.interactive.<tone>.hover on background.surface')],
  13: [
    {
      targetStep: surface,
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      pairing: 'text.primary on background.surface',
    },
  ],
  15: [
    {
      targetStep: stepId(9),
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      pairing:
        'text.on-emphasis.<tone> on background.interactive.<tone>.emphasis.default',
    },
  ],
}

function categoryOf(role: string | null): StepCategory {
  const group = role?.split('.')[0]
  return group === 'background' || group === 'border' || group === 'text'
    ? group
    : 'unused'
}

/** The 15 steps, in order. */
export const PALETTE_STEPS: StepDefinition[] = Array.from(
  { length: STEP_COUNT },
  (_, i) => {
    const step = i + 1
    const { role, label } = PRIMARY_ROLES[i]
    return {
      step,
      id: stepId(step),
      name: `Step ${step}`,
      label,
      primaryRole: role,
      roles: rolesForStep(step),
      category: categoryOf(role),
      lightValue: TS_SCALE.light[i],
      darkValue: TS_SCALE.dark[i],
      contrastWith: CONTRAST_REQUIREMENTS[step],
    }
  },
)

/** `"9 · emphasis"`, the short name used in selects and tooltips. */
export const stepLabel = (step: number) =>
  `${step} · ${PALETTE_STEPS[step - 1]?.label ?? ''}`

export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)
