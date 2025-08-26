export const APCA_CONTRAST_LEVELS = {
  LC_90: {
    value: 90,
    description: 'Preferred for fluent/body text.',
    rules: [
      'Body text: ≥14px/400 or heavier/larger.',
      'Large fluent text: maximum Lc 90 when bold and >36px.',
      'Small/medium text: no maximum.',
    ],
  },
  LC_75: {
    value: 75,
    description: 'Minimum for body text.',
    rules: ['Body text: ≥24px/300, 18px/400, 16px/500, or 14px/700.'],
  },
  LC_60: {
    value: 60,
    description: 'Minimum for content text that is not body/column/block text.',
    rules: ['Labels, short copy, helper text: ≥24px/400 or ≥16px/700.'],
  },
  LC_45: {
    value: 45,
    description: 'Minimum for large/heavy fluent text and detailed icons.',
    rules: [
      'Headlines: ≥36px/400 or ≥24px/700.',
      'Large fluent text (>36px): maximum Lc 90 when bold.',
      'Icons with fine details or thin outlines: Lc ≥ 45.',
    ],
  },
  LC_30: {
    value: 30,
    description:
      'Absolute minimum for spot-readable text and large, simple UI graphics.',
    rules: [
      'Applies to placeholders, disabled text, copyright/™ bugs.',
      'Large, solid, easily recognizable UI graphics: Lc ≥ 30.',
    ],
  },
  LC_15: {
    value: 15,
    description:
      'Absolute minimum for decorative or structural non-text elements.',
    rules: [
      'Dividers, borders, and thick focus outlines: Lc ≥ 15 and ≥5px in smallest dimension.',
      'Anything below Lc 15 is not reliably visible.',
    ],
  },
} as const
