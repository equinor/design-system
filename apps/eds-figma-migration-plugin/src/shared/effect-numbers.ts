/**
 * The numbers on an effect that a variable can be bound to: the blur radius,
 * the spread, and the x and y of the offset. Figma names the offset's fields
 * `offsetX` and `offsetY` in an effect's bound variables, but keeps the
 * numbers in `offset`. The scan reads the number when the legacy variable
 * could not be read, Apply sets it when a designer chooses a number without
 * a variable, and the scan finds it again from the change log.
 *
 * Plain functions on plain objects, so they are tested without Figma.
 */

/** The number an effect has on a field a variable can be bound to; undefined when it has none. */
export function effectNumber(
  effect: object,
  field: string,
): number | undefined {
  const values = effect as Record<string, unknown>
  const offset = values.offset as { x?: unknown; y?: unknown } | undefined
  const value =
    field === 'offsetX'
      ? offset?.x
      : field === 'offsetY'
        ? offset?.y
        : field === 'radius' || field === 'spread'
          ? values[field]
          : undefined
  return typeof value === 'number' ? value : undefined
}

/**
 * A copy of the effect with the number set on the field. Call it on an
 * effect whose variable on that field has been removed, since a bound
 * variable decides the number. Throws for a field that takes no number, such
 * as the colour.
 */
export function withEffectNumber<T extends object>(
  effect: T,
  field: string,
  value: number,
): T {
  const values = effect as Record<string, unknown>
  if (field === 'offsetX' || field === 'offsetY') {
    const offset = (values.offset ?? { x: 0, y: 0 }) as {
      x: number
      y: number
    }
    return {
      ...effect,
      offset:
        field === 'offsetX' ? { ...offset, x: value } : { ...offset, y: value },
    }
  }
  if (field === 'radius' || field === 'spread') {
    return { ...effect, [field]: value }
  }
  throw new Error(`An effect takes no number on ${field}`)
}
