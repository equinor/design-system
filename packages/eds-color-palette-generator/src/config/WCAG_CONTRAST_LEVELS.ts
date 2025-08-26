export const WCAG_CONTRAST_LEVELS = {
  AAA_LARGE: {
    value: 4.5,
    description: 'Contrast for large text.',
    rules: ['Large text: ≥24px, or ≥19px bold.'],
  },
  AAA_NORMAL: {
    value: 7,
    description: 'Contrast for normal text.',
    rules: ['Normal text: <24px and <19px bold.'],
  },
  AA_LARGE: {
    value: 3,
    description: 'Contrast for large text.',
    rules: ['Large text: ≥24px, or ≥19px bold.'],
  },
  AA_NORMAL: {
    value: 4.5,
    description: 'Contrast for normal text',
    rules: ['Normal text: <24px and <19px bold.'],
  },
  UI_COMPONENTS: {
    value: 3,
    description: 'Contrast for UI components and graphical objects.',
    rules: [
      'Interactive components',
      'Graphical objects needed to understand content',
    ],
  },
} as const
