// Normal: teksten har kontrast på minst 4,5:1 mot bakgrunnen for liten tekst
// Large: teksten har kontrast på 3:1 mot bakgrunnen for stor eller fet tekst (tekststørrelse på minst 24 piksler eller 19 piksler med fet/uthevet tekst)

export const WCAG_CONTRAST_LEVELS = {
  AAA_LARGE: {
    value: 4.5,
    description: 'Enhanced contrast for large text (Level AAA)',
    rules: [
      'Applies to text 18pt and larger, or 14pt and larger if bold',
      'Recommended for optimal accessibility',
      'Required for Level AAA compliance',
    ],
  },
  AAA_NORMAL: {
    value: 7,
    description: 'Enhanced contrast for normal text (Level AAA)',
    rules: [
      'Applies to text smaller than 18pt',
      'Highest level of contrast for normal text',
      'Required for Level AAA compliance',
    ],
  },
  AA_LARGE: {
    value: 3,
    description: 'Standard contrast for large text (Level AA)',
    rules: [
      'Applies to text 18pt and larger, or 14pt and larger if bold',
      'Minimum requirement for WCAG AA compliance',
      'Common requirement for most websites',
    ],
  },
  AA_NORMAL: {
    value: 4.5,
    description: 'Standard contrast for normal text (Level AA)',
    rules: [
      'Applies to text smaller than 18pt',
      'Minimum requirement for WCAG AA compliance',
      'Most commonly used contrast requirement',
    ],
  },
  UI_COMPONENTS: {
    value: 3,
    description: 'Contrast for UI components and graphical objects',
    rules: [
      'Applies to interactive UI components',
      'Required for visual boundaries of components',
      'Applies to graphical objects necessary for understanding',
    ],
  },
}
