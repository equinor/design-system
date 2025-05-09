export const APCA_CONTRAST_LEVELS = {
  LC_90: {
    value: 90,
    description: 'Preferred level for fluent text and body text',
    rules: [
      'Minimum: 18px/300, 14px/400 for body text',
      'Minimum: 12px/400 for non-body text',
      'Minimum: 24px/200 for extremely thin fonts',
      'Suggested maximum for fonts >36px bold or large areas of color',
      'No maximum for small fonts',
    ],
  },
  LC_75: {
    value: 75,
    description: 'Minimum level for body text in columns',
    rules: [
      'Minimum: 24px/300, 18px/400, 16px/500, 14px/700 for body text',
      'Minimum: 15px/400 for non-body text',
      'Considered the minimum for larger text where readability is important',
    ],
  },
  LC_60: {
    value: 60,
    description: 'Minimum for content text that is not body or block text',
    rules: [
      'Minimum: 48px/200, 36px/300, 24px/400, 21px/500, 18px/600, 16px/700',
      'Based on reference font Helvetica',
      'To use as body text, add Lc 15',
    ],
  },
  LC_45: {
    value: 45,
    description: 'Minimum for larger, heavier text such as headlines',
    rules: [
      'Minimum: 36px/400, 24px/700',
      'Applies to fluently readable large text that is not body text',
      'Minimum for pictograms with fine details or smaller outline icons',
    ],
  },
  LC_30: {
    value: 30,
    description: 'Absolute minimum for spot-readable text',
    rules: [
      'Includes placeholder text, disabled text, copyright bugs',
      'Minimum for large, solid, understandable non-text elements',
      'No smaller than 5.5px solid in its smallest dimension',
    ],
  },
  LC_15: {
    value: 15,
    description: 'Absolute minimum for non-semantic non-text elements',
    rules: [
      'Minimum size: 5px solid in its smallest dimension',
      'May apply to dividers, large buttons, thick focus-visible outlines',
      'Avoid for important UI elements',
      'Anything below this level is considered invisible for many users',
    ],
  },
}
