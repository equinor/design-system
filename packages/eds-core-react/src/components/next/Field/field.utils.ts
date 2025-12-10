export const classNames = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(' ')

export const mergeSpaceSeparated = (
  ...values: Array<string | null | undefined>
): string | undefined => {
  const tokens = values
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(/\s+/).filter(Boolean))

  if (tokens.length === 0) {
    return undefined
  }

  return Array.from(new Set(tokens)).join(' ')
}
