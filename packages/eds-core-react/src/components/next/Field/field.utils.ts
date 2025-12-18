export const classNames = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(' ')
