/**
 * A value set on a property without a variable, where the EDS Beta has no
 * token for it: a border width in px (spacing.mdx: "The widths above are
 * literals because the redefined set has no stroke-width token"), a 0 that
 * needs no token, an opacity in percent, or no value at all, such as a
 * minimum height the Beta components do not use.
 *
 * Targets are written `value:4` (px), `value:40%` (percent) and
 * `value:none` (the property is cleared).
 */
const PREFIX = 'value:'

/** The target that clears a property, such as a minimum height. */
export const CLEAR_VALUE = `${PREFIX}none`

export function literalTarget(value: number): string {
  return `${PREFIX}${value}`
}

/** An opacity between 0 and 1 as a target in percent. */
export function opacityTarget(opacity: number): string {
  return `${PREFIX}${Math.round(opacity * 1000) / 10}%`
}

/**
 * The value of a literal target as Figma takes it: px as a number, a
 * percent as a fraction, null to clear the property; undefined for a
 * variable or a text style.
 */
export function literalValue(
  target: string | null | undefined,
): number | null | undefined {
  if (!target?.startsWith(PREFIX)) return undefined
  const raw = target.slice(PREFIX.length)
  if (raw === 'none') return null
  const percent = raw.endsWith('%')
  const value = Number(percent ? raw.slice(0, -1) : raw)
  if (!Number.isFinite(value)) return undefined
  return percent ? value / 100 : value
}

/** How a literal target is written for people: “4px”, “40%”, “no value”. */
export function literalText(target: string): string | undefined {
  if (!target.startsWith(PREFIX)) return undefined
  const raw = target.slice(PREFIX.length)
  if (raw === 'none') return 'Remove it'
  return raw.endsWith('%') ? raw : `${raw}px`
}
