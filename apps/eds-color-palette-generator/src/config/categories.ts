export const CATEGORY_GROUPS = [
  { label: 'Background', span: 2 },
  { label: 'Background Fill Muted', span: 3 },
  { label: 'Border', span: 3 },
  { label: 'Background Fill Emphasis', span: 3 },
  { label: 'Text', span: 4 },
] as const

/**
 * EDS semantic token name per step (array is 0-indexed, steps are 1-indexed),
 * matching the Contrast Table vocabulary. `sub` is the interaction state for
 * tokens that have default/hover/pressed variants.
 */
export const STEP_TOKENS: ReadonlyArray<{ name: string; sub?: string }> = [
  { name: 'subtle', sub: 'default' },
  { name: 'subtle', sub: 'hover' },
  { name: 'subtle', sub: 'pressed' },
  { name: 'selected', sub: 'default' },
  { name: 'selected', sub: 'hover' },
  { name: 'selected', sub: 'pressed' },
  { name: 'muted' },
  { name: 'secondary' },
  { name: 'accent', sub: 'default' },
  { name: 'accent', sub: 'hover' },
  { name: 'accent', sub: 'pressed' },
  { name: 'primary' },
  { name: 'strong' },
  { name: 'on-accent' },
  { name: 'color on dark' },
]

/** Category groups aligned with the EDS token families (Token Matrix). */
export const TOKEN_CATEGORY_GROUPS = [
  { label: 'Surface · subtle', span: 3 },
  { label: 'Surface · selected', span: 3 },
  { label: 'Neutral text', span: 2 },
  { label: 'Accent', span: 3 },
  { label: 'Text', span: 4 },
] as const
