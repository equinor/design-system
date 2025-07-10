/**
 * Function returning wether a string only contains number. Allows leading or trailing spaces.
 *
 * Examples:
 *
 * ```
 * isNumberOnlyString("10") // true
 * isNumberOnlyString("10.10") // true
 * isNumberOnlyString("10px") // false
 * isNumberOnlyString("10%") // false
 * isNumberOnlyString("10 ") // true
 * ```
 *
 * @param number
 * @returns
 */
export function isNumberOnlyString(number: string) {
  return !isNaN(Number(number)) && !isNaN(parseFloat(number))
}

export function addPxSuffixIfInputHasNoPrefix(size: number | string) {
  if (typeof size === 'number' || isNumberOnlyString(size)) {
    return `${size}px`
  }

  return size
}

export function logDevelopmentWarningOfPropUse(
  deprecatedProps: Record<string, { value: unknown; mitigationInfo?: string }>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  for (const [key, { value, mitigationInfo }] of Object.entries(
    deprecatedProps,
  )) {
    if (typeof value !== 'undefined') {
      console.warn(
        `The prop '${key}' is deprecated and will be removed in a future release. ${mitigationInfo}`,
      )
    }
  }
}

export const isFirefox = () => {
  return (
    typeof window !== 'undefined' &&
    navigator.userAgent.indexOf('Firefox') !== -1
  )
}

export const getMeasureElementHandler = () => {
  return isFirefox()
    ? undefined
    : (element: HTMLTableRowElement) => element?.getBoundingClientRect().height
}
