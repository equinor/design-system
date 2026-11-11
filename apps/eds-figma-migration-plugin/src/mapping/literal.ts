/**
 * A number set on a property without a variable. EDS Foundation has no stroke
 * width variable yet, so a legacy border width becomes its number in px
 * (spacing.mdx: "The widths above are literals because the redefined set has
 * no stroke-width token").
 */
const PREFIX = 'value:'

export function literalTarget(value: number): string {
  return `${PREFIX}${value}`
}

/** The number of a literal target; undefined for a variable or a text style. */
export function literalValue(
  target: string | null | undefined,
): number | undefined {
  if (!target?.startsWith(PREFIX)) return undefined
  const value = Number(target.slice(PREFIX.length))
  return Number.isFinite(value) ? value : undefined
}
