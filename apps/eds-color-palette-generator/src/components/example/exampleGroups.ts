/**
 * Step pairings inside one palette, named after the Tokens Studio roles they
 * stand for (ADR 0016 D5). Steps are 1-based, as in `accent.9`.
 */
export type ExamplePairing = {
  fg: number
  bg: number
  type?: 'text' | 'border'
}

export type ExampleGroup = {
  title: string
  description: string
  pairings: ExamplePairing[]
}

export const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    title: 'text.on-muted on muted fills',
    description:
      'text.on-muted.<tone> (step 12) on background.interactive.<tone>.muted default, hover and pressed (steps 1, 2 and 3)',
    pairings: [
      { fg: 12, bg: 1 },
      { fg: 12, bg: 2 },
      { fg: 12, bg: 3 },
    ],
  },
  {
    title: 'text.on-emphasis on emphasis fills',
    description:
      'text.on-emphasis.<tone> (step 15) on background.interactive.<tone>.emphasis default, hover and pressed (steps 9, 10 and 11)',
    pairings: [
      { fg: 15, bg: 9 },
      { fg: 15, bg: 10 },
      { fg: 15, bg: 11 },
    ],
  },
  {
    title: 'border.non-interactive on canvas and surface',
    description:
      'border.non-interactive.<tone> muted, default and emphasis (steps 4, 7 and 9) on steps 1 and 15, which are background.canvas and background.surface in the neutral palette. ADR 0016 has no contrast requirement for borders.',
    pairings: [
      { fg: 4, bg: 1, type: 'border' },
      { fg: 7, bg: 1, type: 'border' },
      { fg: 9, bg: 1, type: 'border' },
      { fg: 4, bg: 15, type: 'border' },
      { fg: 7, bg: 15, type: 'border' },
      { fg: 9, bg: 15, type: 'border' },
    ],
  },
]
