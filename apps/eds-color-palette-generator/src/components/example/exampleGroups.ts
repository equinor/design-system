import type { StepRole } from '@/utils/palette'

export type ExamplePairing = {
  fg: StepRole
  bg: StepRole
  type?: 'text' | 'border'
}

export type ExampleGroup = {
  title: string
  description: string
  pairings: ExamplePairing[]
}

export const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    title: 'Text on interactive fills',
    description:
      'Text on muted fill backgrounds across default/hover/active states',
    pairings: [
      { fg: '12 · fg/strong', bg: '3 · bg/surface-hover' },
      { fg: '12 · fg/strong', bg: '4 · bg/surface-pressed' },
      { fg: '12 · fg/strong', bg: '5 · bg/interactive' },
    ],
  },
  {
    title: 'Text on emphasis fills',
    description: 'Light text on dark emphasis backgrounds',
    pairings: [
      { fg: '15 · bg/card, sheet, popover', bg: '9 · fill/emphasis' },
      { fg: '15 · bg/card, sheet, popover', bg: '10 · fill/emphasis-hover' },
      { fg: '15 · bg/card, sheet, popover', bg: '11 · fill/emphasis-pressed' },
      { fg: '14 · fg/on-emphasis', bg: '9 · fill/emphasis' },
    ],
  },
  {
    title: 'Borders on backgrounds',
    description: 'Border visibility on different surfaces',
    pairings: [
      { fg: '5 · bg/interactive', bg: '1 · bg/canvas', type: 'border' },
      { fg: '7 · border/subtle', bg: '1 · bg/canvas', type: 'border' },
      { fg: '8 · border/default', bg: '1 · bg/canvas', type: 'border' },
      { fg: '5 · bg/interactive', bg: '2 · bg/surface', type: 'border' },
      { fg: '7 · border/subtle', bg: '2 · bg/surface', type: 'border' },
      { fg: '8 · border/default', bg: '2 · bg/surface', type: 'border' },
    ],
  },
]
